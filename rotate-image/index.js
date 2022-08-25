import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.imageFile.path, {
    suffix: "-rotated",
  });

  await subprocess.run("magick", [
    input.imageFile.path,
    "-rotate",
    input.angle,
    outPath,
  ]);

  return { result: outPath };
}
