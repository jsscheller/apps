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

  const args = ["convert"];

  const centerOffset = [0, 0];
  const size = wxh.slice();
  const bw = input.borderWidth;
  if (input.placement === "outside") {
    size[0] += bw * 2;
    size[1] += bw * 2;
    centerOffset[0] = centerOffset[1] = bw;
  } else if (input.placement === "center") {
    size[0] += bw;
    size[1] += bw;
    centerOffset[0] = centerOffset[1] = Math.round(bw / 2).toFixed(3);
  }
  const centerOffsetStr = "+" + centerOffset.join("+");
  const sizeStr = size.join("x");

  // set size of image with first page
  args.push("-page", sizeStr + "+0+0", "-size", sizeStr, "xc:none");

  // now, other pages just need offset
  const offset = Math.round((bw * 1000) / 2) / 1000;
  const drawTo = size.map(function (n) {
    return n - offset;
  });
  args.push(
    "-page",
    "+0+0",
    "(",
    "-size",
    sizeStr,
    "xc:none",
    "-fill",
    "none",
    "-stroke",
    input.borderColor,
    "-strokewidth",
    bw,
    "-draw",
    "rectangle " + offset + "," + offset + " " + drawTo.join(),
    ")"
  );

  args.push("-page", centerOffsetStr, input.imageFile.path);

  const outPath = util.outPath(input.imageFile.path, {
    suffix: "-border",
  });
  args.push("-background", "none", "-compose", "DstOver", "-flatten", outPath);

  await subprocess.run("magick", args);

  return { result: outPath };
}
