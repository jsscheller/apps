import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.imageFile.path, {
    suffix: "-bg",
  });

  await subprocess.run("magick", [
    input.imageFile.path,
    "-background",
    input.backgroundColor,
    "-alpha",
    "remove",
    "-alpha",
    "off",
    outPath,
  ]);

  return { result: outPath };
}
