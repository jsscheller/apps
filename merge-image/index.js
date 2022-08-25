import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const args = ["montage"];
  for (const file of input.imageFiles) {
    args.push(file.path);
  }

  let tile;
  const cols = input.columns;
  const rows = input.rows;
  if (cols && rows) {
    tile = `${cols}x${rows}`;
  } else if (cols) {
    tile = `${cols}x`;
  } else {
    tile = `x${rows || 1}`;
  }
  args.push("-tile", tile, "-geometry", `+${input.spacing}+${input.spacing}`);

  if (input.backgroundColor) {
    args.push(
      "-background",
      input.backgroundColor,
      "-alpha",
      "remove",
      "-alpha",
      "off"
    );
  }

  const outPath = util.outPath(input.imageFiles[0].path, {
    suffix: "-montage",
    ext: input.format.toLowerCase().replace("jpeg", "jpg"),
  });
  args.push(outPath);

  await subprocess.run("magick", args);

  return { result: outPath };
}
