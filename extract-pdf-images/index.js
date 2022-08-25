import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outDir = util.outPath("out");
  const opts = [
    `--quality=${input.quality}`,
    `--min-width=${input.filter.minWidth || 1}`,
    `--min-height=${input.filter.minHeight || 1}`,
    `--min-area=${input.filter.minArea || 1}`,
  ];

  await subprocess.run("pdfr", [
    "extract-images",
    ...opts,
    input.pdfFile.path,
    outDir,
  ]);

  const images = [];
  for (const name of await fs.readdir(outDir)) {
    images.push(`${outDir}/${name}`);
  }
  return { images };
}
