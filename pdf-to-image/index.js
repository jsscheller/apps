import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outDir = util.outPath("out");
  const opts = [`--quality=${input.quality}`];
  if (input.size.width || input.size.height) {
    const size = [input.size.width, "x", input.size.height]
      .filter((x) => !!x)
      .join("");
    opts.push(`--size=${size}`);
  }
  if (input.pages) {
    opts.push(`--pages=${input.pages}`);
  }

  await subprocess.run("pdfr", ["render", ...opts, input.pdfFile.path, outDir]);

  const images = [];
  for (const name of await fs.readdir(outDir)) {
    images.push(`${outDir}/${name}`);
  }
  return { images };
}
