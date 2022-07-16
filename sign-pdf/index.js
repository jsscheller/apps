import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  let edits = input.signatures.concat(input.options.images).map((x) => ({
    op: "add_image",
    page: x.page,
    placement: {
      x: x.x,
      y: x.y,
      width: x.width,
      height: x.height,
    },
    image: x.file.name,
  }));
  edits = edits.concat(
    input.options.text.map((x) => ({
      op: "add_text",
      page: x.page,
      placement: {
        x: x.x,
        y: x.y,
      },
      text: x.text,
      font: x.font,
      font_size: x.fontSize,
    }))
  );
  await fs.writeFile("edits.json", JSON.stringify(edits));

  for (const sig of input.signatures) {
    await fs.writeFile(sig.file.name, sig.file.contents);
  }

  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);

  const outPath = addSuffix("-signed", input.pdfFile.name);

  await subprocess.run("pdfr", [
    "edit",
    "edits.json",
    input.pdfFile.name,
    outPath,
  ]);

  return {
    signedPDF: {
      name: outPath,
      contents: await fs.readFileToBlob(outPath),
    },
  };
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
