import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);

  const outPath = addSuffix("-unlocked", input.pdfFile.name);
  try {
    await subprocess.run("qpdf", [
      input.pdfFile.name,
      ...(input.password ? [`--password=${input.password}`] : []),
      "--decrypt",
      outPath,
    ]);
  } catch (err) {
    if (err.stderr && err.stderr.includes("invalid password")) {
      throw "This PDF is password-protected - the correct password is required.";
    }
    throw err;
  }

  return {
    unlockedPDF: {
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
