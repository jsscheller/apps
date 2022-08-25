import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.imageFile.path, {
    suffix: "-reflected",
  });

  const args = [input.imageFile.path];
  if (input.reflectX) {
    args.push("-flop");
  }
  if (input.reflectY) {
    args.push("-flip");
  }
  args.push(outPath);
  await subprocess.run("magick", args);

  return { result: outPath };
}
