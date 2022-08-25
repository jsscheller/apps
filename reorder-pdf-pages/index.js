import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  let pages,
    rotate = [];
  switch (input.method) {
    case "custom":
      ({ pages, rotate } = parsePageSelection(input.pages));
      break;
    case "reverse":
      pages = "z-1";
      break;
  }

  const outPath = util.outPath(input.pdfFile.path, { suffix: "-reordered" });

  await subprocess.run("qpdf", [
    input.pdfFile.path,
    "--pages",
    ".",
    pages,
    "--",
    outPath,
    ...rotate,
  ]);

  return { reorderedPDF: outPath };
}

function parsePageSelection(sel) {
  let pages;
  const rotate = [];
  for (const part of sel.split(" ")) {
    const colonPos = part.indexOf(":");
    const afterColon = part.slice(colonPos + 1);
    if (
      colonPos !== -1 &&
      !afterColon.startsWith("even") &&
      !afterColon.startsWith("odd")
    ) {
      rotate.push(`--rotate=${part}`);
    } else {
      pages = part;
    }
  }
  return { pages, rotate };
}
