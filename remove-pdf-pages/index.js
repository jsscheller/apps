import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  let pages;
  switch (input.method) {
    case "keep":
      pages = input.pagesToKeep;
      break;
    case "remove_even":
      pages = "1-z:odd";
      break;
    case "remove_odd":
      pages = "1-z:even";
      break;
    case "remove_first":
      pages = `${input.pageCount + 1}-z`;
      break;
    case "remove_last":
      pages = `1-r${input.pageCount + 1}`;
      break;
  }

  const outPath = util.outPath(input.pdfFile.path, { suffix: "-trimmed" });

  await subprocess.run("qpdf", [
    input.pdfFile.path,
    "--pages",
    ".",
    pages,
    "--",
    outPath,
  ]);

  return { trimmedPDF: outPath };
}
