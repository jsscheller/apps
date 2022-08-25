import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  let edits = input.signatures.concat(input.otherAdditions.images).map((x) => ({
    op: "add_image",
    page: x.page,
    placement: {
      x: x.x,
      y: x.y,
      width: x.width,
      height: x.height,
    },
    image: x.file.path,
  }));
  edits = edits.concat(
    input.otherAdditions.text.map((x) => ({
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

  const outPath = util.outPath(input.pdfFile.path, { suffix: "-signed" });

  await subprocess.run("pdfr", [
    "edit",
    "edits.json",
    input.pdfFile.path,
    outPath,
  ]);

  return { signedPDF: outPath };
}
