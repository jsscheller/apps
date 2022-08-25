import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function main(input) {
  const args = [input.imageFile.path, "-resize"];

  switch (input.resizeBy) {
    case "width":
      args.push(`${input.width}x`);
      break;
    case "height":
      args.push(`x${input.height}`);
      break;
    case "width_and_height":
      args.push(`${input.width}x${input.height}`);
      switch (input.method) {
        case "best_fit":
          // Default
          break;
        case "ignore_aspect_ratio":
          args[args.length - 1] += "!";
          break;
        case "fill":
          args[args.length - 1] += "^";
          break;
        case "pad":
          // Don't stretch the image
          args[args.length - 1] += ">";
          args.push(
            "-background",
            input.padColor,
            "-gravity",
            "center",
            "-extent",
            `${input.width}x${input.height}`
          );
          break;
        case "crop":
          args[args.length - 1] += "^";
          args.push(
            "-gravity",
            "center",
            "-extent",
            `${input.width}x${input.height}`
          );
          break;
      }
      break;
    case "area": {
      const area = parseFloat(input.area);
      const width = parseFloat(input.width);
      const height = parseFloat(input.height);
      args.push(`${area}@`);
      if (input.exactMatch) {
        const size =
          input.dimension == "Width"
            ? `${width}x${area / width}`
            : `${area / height}x${height}`;
        args.push(
          "-gravity",
          "center",
          "-background",
          input.padColor,
          "-extent",
          size
        );
      }
      break;
    }
    case "percentage":
      args.push(`${input.percentage}%`);
      break;
  }

  const outPath = util.outPath(input.imageFile.path, { suffix: "-resized" });

  args.push(outPath);

  await subprocess.run("magick", args);

  return { resizedImage: outPath };
}
