import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.pdfFile.path, { suffix: "-locked" });
  await subprocess.run("qpdf", [
    input.pdfFile.path,
    "--encrypt",
    input.password,
    input.password,
    input.encryption === "256-bit AES" ? "256" : "128",
    "--",
    outPath,
  ]);

  return { lockedPDF: outPath };
}
