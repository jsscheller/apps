import { subprocess, fs } from "@jspawn/jspawn";

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

  const outPath = addSuffix("-reordered", input.pdfFile.name);

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);
  await subprocess.run("qpdf", [
    input.pdfFile.name,
    "--pages",
    ".",
    pages,
    "--",
    outPath,
    ...rotate,
  ]);

  return {
    reorderedPDF: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
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
