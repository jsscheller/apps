import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  const outPath = `blank.${ext(input.format)}`;

  await subprocess.run("imagecli", [
    "-o",
    outPath,
    "-p",
    `new ${input.width} ${input.height} (${hexToRgb(input.color)})`,
  ]);

  return {
    blankImage: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
}

function ext(format) {
  return format === "JPEG" ? "jpg" : format.toLowerCase();
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);

  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  return r + ", " + g + ", " + b;
}
