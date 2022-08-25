import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

const EXTRA_CODEC_ARGS = {
  libopus: ["-compression_level", "10"],
  libmp3lame: ["-q:a", "2"],
  libvorbis: ["-q:a", "4"],
  adpcm_yamaha: [
    // Yamaha SMAF stereo is experimental, add '-strict -2' if you want to use it.
    "-strict",
    "-2",
  ],
};

export default async function (input) {
  const opts = input[`options${input.convertTo}`];

  let args = [
    "-hide_banner",
    "-i",
    input.audioFile.path,
    "-ss",
    input.startTime || 0,
  ];
  if (opts.codec) {
    args.push("-c:a", opts.codec);
  }
  if (input.stopTime) {
    args.push("-to", input.stopTime);
  }
  if (opts.bitrate) {
    args.push("-b:a", `${opts.bitrate}k`);
  }
  if (opts.sampleRate) {
    args.push("-ar", opts.sampleRate);
  }
  if (opts.channels) {
    args.push("-ac", opts.channels);
  }
  if (opts.bitDepth) {
    const bitDepth = {
      16: "s16",
      24: "s32", // flac defaults s32 to 24 bit
    }[opts.bitDepth];
    args.push("-sample_fmt", bitDepth);
  }
  if (opts.codec && EXTRA_CODEC_ARGS[opts.codec]) {
    args = args.concat(EXTRA_CODEC_ARGS[opts.codec]);
  }

  const outPath = util.outPath(input.audioFile.path, {
    ext: input.convertTo.toLowerCase(),
  });
  args.push(outPath);

  await subprocess.run("ffmpeg", args);

  return { result: outPath };
}
