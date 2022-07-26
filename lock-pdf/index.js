import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);

  const outPath = addSuffix("-locked", input.pdfFile.name);
  await subprocess.run("qpdf", [
    input.pdfFile.name,
    "--encrypt",
    input.password,
    input.password,
    input.encryption === "256-bit AES" ? "256" : "128",
    "--",
    outPath,
  ]);

  return {
    lockedPDF: {
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
