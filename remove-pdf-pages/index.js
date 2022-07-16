import { subprocess, fs } from "@jspawn/jspawn";

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

  const outPath = addSuffix("-trimmed", input.pdfFile.name);

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);
  await subprocess.run("qpdf", [
    input.pdfFile.name,
    "--pages",
    ".",
    pages,
    "--",
    outPath,
  ]);

  return {
    trimmedPDF: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
}

function addSuffix(suffix, path) {
  const name = path.split("/").pop();
  let stem = name;
  let ext = "";
  const lastDot = name.lastIndexOf(".");
  if (lastDot > -1) {
    stem = name.slice(0, lastDot);
    ext = name.slice(lastDot);
  }
  return `${stem}${suffix}${ext}`;
}
