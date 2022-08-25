import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

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

  const outPath = util.outPath(input.pdfFile.path, { suffix: "-rotated" });

  await subprocess.run("qpdf", [
    input.pdfFile.path,
    "--pages",
    ".",
    "1-z",
    "--",
    outPath,
    ...rotate,
  ]);

  return { rotatedPDF: outPath };
}

function normAngle(deg) {
  deg = deg % 360;
  if (deg < 0) deg += 360;
  return deg;
}
