import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  let docs = [];
  switch (input.method) {
    case "extract":
      docs.push(input.pages);
      break;
    case "chunk": {
      const output = await subprocess.run("qpdf", [
        input.pdfFile.path,
        "--show-npages",
      ]);
      const pageCount = parseInt(output.stdout);
      for (let i = 1; i <= pageCount; i += input.chunkSize) {
        const end = Math.min(pageCount, i + input.chunkSize - 1);
        if (i !== end) {
          docs.push(`${i}-${end}`);
        } else {
          docs.push(i.toString());
        }
      }
      break;
    }
    case "split":
      docs = input.pdfs;
      break;
  }

  const pdfs = [];
  for (const [pos, doc] of docs.entries()) {
    const outPath = util.outPath(input.pdfFile.path, { suffix: `-${pos + 1}` });

    await subprocess.run("qpdf", [
      input.pdfFile.path,
      "--pages",
      ".",
      doc,
      "--",
      outPath,
    ]);

    pdfs.push(outPath);
  }
  return { pdfs };
}
