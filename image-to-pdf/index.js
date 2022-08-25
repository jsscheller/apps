import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const pdfs = [];

  const singleOutPath = util.outPath(input.imageFiles[0].path, {
    ext: "pdf",
    suffix: "-single",
  });

  if (input.searchable) {
    for (const [pos, file] of input.imageFiles.entries()) {
      const outPath = util.outPath(file.path, {
        suffix: `-${pos}`,
        ext: "pdf",
      });
      await subprocess.run("tesseract", [
        "--tessdata-dir",
        "./tessdata",
        file.path,
        outPath.replace(/.pdf$/, ""),
        "-l",
        "eng",
        "--dpi",
        input.dpi.toString(),
        "pdf",
      ]);
      pdfs.push(outPath);
    }
    if (input.singlePDF && pdfs.length > 1) {
      const pages = [];
      pages.push(pdfs[0], "--pages", ".", "1-z");
      for (const path of pdfs.slice(1)) {
        pages.push(path, "1-z");
      }
      await subprocess.run("qpdf", [...pages, "--", singleOutPath]);
      pdfs = [singleOutPath];
    }
  } else {
    if (input.singlePDF) {
      await subprocess.run("pdfr", [
        "create",
        `--dpi=${input.dpi}`,
        ...input.imageFiles.map((file) => `--image=${file.path}`),
        singleOutPath,
      ]);
      pdfs = [singleOutPath];
    } else {
      for (const [pos, file] of input.imageFiles.entries()) {
        const outPath = util.outPath(file.path, {
          suffix: `-${pos}`,
          ext: "pdf",
        });
        await subprocess.run("pdfr", [
          "create",
          `--dpi=${input.dpi}`,
          `--image=${file.path}`,
          outPath,
        ]);
        pdfs.push(outPath);
      }
    }
  }

  return { pdfs };
}
