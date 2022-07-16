import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  let rotate;
  switch (input.method) {
    case "custom":
      rotate = input.rotate.map((x) => {
        const relative = x.relative ? "+" : "";
        return `--rotate=${relative}${normAngle(x.angle)}:${x.pages}`;
      });
      break;
    case "relative":
      rotate = [`--rotate=+${normAngle(input.angle)}:1-z`];
      break;
    case "fixed":
      rotate = [`--rotate=${normAngle(input.angle)}:1-z`];
      break;
  }

  const outPath = addSuffix("-rotated", input.pdfFile.name);

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);
  await subprocess.run("qpdf", [
    input.pdfFile.name,
    "--pages",
    ".",
    "1-z",
    "--",
    outPath,
    ...rotate,
  ]);

  return {
    rotatedPDF: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
}

function normAngle(deg) {
  deg = deg % 360;
  if (deg < 0) deg += 360;
  return deg;
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
