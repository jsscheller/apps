import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  for (const file of input.imageFiles) {
    await fs.writeFile(file.name, file.contents);
  }

  const outPath = replaceExt(input.imageFiles[0].name, "pdf");
  await subprocess.run("pdfr", [
    "create",
    `--dpi=${input.dpi}`,
    ...input.imageFiles.map((file) => `--image=${file.name}`),
    outPath,
  ]);

  return {
    pdf: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
}

function replaceExt(path, ext) {
  let lastDot = path.lastIndexOf(".");
  if (lastDot === -1) {
    lastDot = path.length - 1;
  }
  return path.slice(0, lastDot + 1) + ext;
}
