import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const outPath = util.outPath(input.pdfFile.path, { suffix: "-unlocked" });
  try {
    await subprocess.run("qpdf", [
      input.pdfFile.path,
      ...(input.password ? [`--password=${input.password}`] : []),
      "--decrypt",
      outPath,
    ]);
  } catch (err) {
    if (err.stderr && err.stderr.includes("invalid password")) {
      throw "This PDF is password-protected - the correct password is required.";
    }
    throw err;
  }

  return { unlockedPDF: outPath };
}
