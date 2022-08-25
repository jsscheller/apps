import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  let pages = [];
  switch (input.method) {
    case "join":
      pages.push(input.pdfFiles[0].path, "--pages", ".", "1-z");
      for (const file of input.pdfFiles.slice(1)) {
        pages.push(file.path, "1-z");
      }
      break;
    case "custom": {
      const file = input.pdfFiles.find(
        (file) => file.name === input.pages[0].from
      );
      pages.push(file.path, "--pages", ".", input.pages[0].selection);

      for (const item of input.pages.slice(1)) {
        const file = input.pdfFiles.find((file) => file.name === item.from);
        pages.push(file.path, item.selection);
      }
      break;
    }
  }

  const outPath = util.outPath(input.pdfFiles[0].path, { suffix: "-merged" });
  await subprocess.run("qpdf", [...pages, "--", outPath]);

  return { mergedPDF: outPath };
}
