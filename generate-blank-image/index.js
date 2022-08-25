import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(
    `blank.${input.format.toLowerCase().replace("jpeg", "jpg")}`
  );

  await subprocess.run("imagecli", [
    "-o",
    outPath,
    "-p",
    `new ${input.width} ${input.height} (${hexToRgb(input.color)})`,
  ]);

  return { blankImage: outPath };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);

  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  return r + ", " + g + ", " + b;
}
