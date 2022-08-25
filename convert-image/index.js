import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const args = [input.imageFile.path];

  if (input.convertTo === "ICO") {
    args.push("-resize", "250x250>");
  }

  const outPath = util.outPath(input.imageFile.path, {
    ext: input.convertTo.toLowerCase().replace("jpeg", "jpg"),
  });
  args.push(outPath);

  await subprocess.run("magick", args);

  return { result: outPath };
}
