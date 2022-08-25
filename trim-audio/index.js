import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.audioFile.path, { suffix: "-trimmed" });

  const args = ["-ss", input.startTime];
  if (input.rangeMethod === "specifyStopTime") {
    args.push("-to", input.stopTime);
  } else {
    args.push("-t", input.duration);
  }
  args.push("-i", input.audioFile.path, outPath);

  await subprocess.run("ffmpeg", args);

  return { result: outPath };
}
