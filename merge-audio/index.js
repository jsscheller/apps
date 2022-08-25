import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.audioFiles[0].path, {
    suffix: "-merged",
    ext: input.format === "auto" ? null : input.format.toLowerCase(),
  });

  const args = [];
  const filterInputs = [];
  for (const [pos, file] of input.audioFiles.entries()) {
    args.push("-i", file.path);
    filterInputs.push(`[${pos}:0]`);
  }
  args.push(
    "-filter_complex",
    `${filterInputs.join("")}concat=n=${input.audioFiles.length}:v=0:a=1[out]`,
    "-map",
    "[out]",
    outPath
  );

  await subprocess.run("ffmpeg", args);

  return { result: outPath };
}
