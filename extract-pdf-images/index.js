import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  const outDir = "out";
  const opts = [
    `--quality=${input.quality}`,
    `--min-width=${input.filter.minWidth || 1}`,
    `--min-height=${input.filter.minHeight || 1}`,
    `--min-area=${input.filter.minArea || 1}`,
  ];

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);
  await subprocess.run("pdfr", ["extract-images", ...opts, input.pdfFile.name, outDir]);

  const images = [];
  for (const name of await fs.readdir(outDir)) {
    images.push({
      name,
      contents: await fs.readFileToBlob(`${outDir}/${name}`),
    });
  }
  return { images };
}
