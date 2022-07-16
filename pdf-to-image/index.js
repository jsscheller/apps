import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  const outDir = "out";
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

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);
  await subprocess.run("pdfr", ["render", ...opts, input.pdfFile.name, outDir]);

  const images = [];
  for (const name of await fs.readdir(outDir)) {
    images.push({
      name,
      contents: await fs.readFileToBlob(`${outDir}/${name}`),
    });
  }
  return { images };
}
