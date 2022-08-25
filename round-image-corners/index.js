import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const output = await subprocess.run("magick", [
    "identify",
    "-format",
    "%wx%h\n",
    input.imageFile.path,
  ]);
  const wxh = output.stdout
    .split("\n")
    .pop()
    .split("x")
    .map((n) => parseInt(n));

  const mask = util.outPath("__mask__.png");
  await subprocess.run("magick", [
    "-size",
    wxh.join("x"),
    "xc:none",
    "-draw",
    "roundrectangle 0,0," +
      wxh.concat(input.borderRadius, input.borderRadius).join(),
    mask,
  ]);

  const outPath = util.outPath(input.imageFile.path, {
    suffix: "-rounded",
    ext:
      input.format === "noChange"
        ? null
        : input.format.toLowerCase().replace("jpeg", "jpg"),
  });

  await subprocess.run("magick", [
    input.imageFile.path,
    "-matte",
    mask,
    "-compose",
    "DstIn",
    "-composite",
    outPath,
  ]);

  return { result: outPath };
}
