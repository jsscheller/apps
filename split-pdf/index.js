import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);

  let docs = [];
  switch (input.method) {
    case "extract":
      docs.push(input.pages);
      break;
    case "chunk": {
      const output = await subprocess.run("qpdf", [
        input.pdfFile.name,
        "--show-npages",
      ]);
      const pageCount = parseInt(output.stdout);
      for (let i = 1; i <= pageCount; i += input.chunkSize) {
        const end = Math.min(pageCount, i + input.chunkSize - 1);
        if (i !== end) {
          docs.push(`${i}-${end}`);
        } else {
          docs.push(i.toString());
        }
      }
      break;
    }
    case "split":
      docs = input.pdfs;
      break;
  }

  const pdfs = [];
  for (const [pos, doc] of docs.entries()) {
    const outPath = addSuffix(`-${pos + 1}`, input.pdfFile.name);

    await subprocess.run("qpdf", [
      input.pdfFile.name,
      "--pages",
      ".",
      doc,
      "--",
      outPath,
    ]);

    pdfs.push({
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    });
  }
  return { pdfs };
}

function addSuffix(suffix, path) {
  const name = path.split("/").pop();
  let stem = name;
  let ext = "";
  const lastDot = name.lastIndexOf(".");
  if (lastDot > -1) {
    stem = name.slice(0, lastDot);
    ext = name.slice(lastDot);
  }
  return `${stem}${suffix}${ext}`;
}
