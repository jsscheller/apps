import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  let pages = [];
  switch (input.method) {
    case "join":
      pages.push(input.pdfFiles[0].name, "--pages", ".", "1-z");
      for (const file of input.pdfFiles.slice(1)) {
        pages.push(file.name, "1-z");
      }
      break;
    case "custom":
      pages.push(input.pages[0].from, "--pages", ".", input.pages[0].selection);
      for (const item of input.pages.slice(1)) {
        pages.push(item.from, item.selection);
      }
      break;
  }

  for (const file of input.pdfFiles) {
    await fs.writeFile(file.name, file.contents);
  }

  const outPath = addSuffix("-merged", input.pdfFiles[0].name);
  await subprocess.run("qpdf", [...pages, "--", outPath]);
  return {
    mergedPDF: {
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
