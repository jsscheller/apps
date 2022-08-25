import { subprocess, fs } from "@jspawn/jspawn";
import * as util from "apps-util";

export default async function (input) {
  const gsOutPath = util.outPath(input.pdfFile.path, { suffix: "-gs" });
  await subprocess.run("gs", [
    // https://ghostscript.com/doc/current/VectorDevices.htm
    "-o",
    gsOutPath,
    "-sDEVICE=pdfwrite",
    "-dPDFSETTINGS=/screen",
    "-dColorImageResolution=100",
    "-dGrayImageResolution=100",
    "-dMonoImageResolution=100",
    "-dCompatibilityLevel=1.4",
    "-dConvertCMYKImagesToRGB=true",
    "-c",
    "<</AlwaysEmbed [ ]>> setdistillerparams",
    "-c",
    "<</NeverEmbed [ /Courier /Courier-Bold /Courier-Oblique /Courier-BoldOblique /Helvetica /Helvetica-Bold /Helvetica-Oblique /Helvetica-BoldOblique /Times-Roman /Times-Bold /Times-Italic /Times-BoldItalic /Symbol /ZapfDingbats /Arial ]>> setdistillerparams",
    "-f",
    input.pdfFile.path,
  ]);

  const outPath = util.outPath(input.pdfFile.path, { suffix: "-compressed" });
  await subprocess.run("qpdf", [
    // https://qpdf.readthedocs.io/en/latest/cli.html
    gsOutPath,
    "--object-streams=generate",
    "--compression-level=9",
    "--recompress-flate",
    "--optimize-images",
    outPath,
  ]);

  return { compressedPDF: outPath };
}
