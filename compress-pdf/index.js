import { subprocess, fs } from "@jspawn/jspawn";

export default async function (input) {
  await fs.writeFile(input.pdfFile.name, input.pdfFile.contents);

  const gsOutPath = addSuffix("-gs", input.pdfFile.name);
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
    input.pdfFile.name,
  ]);

  const outPath = addSuffix("-compressed", input.pdfFile.name);
  await subprocess.run("qpdf", [
    // https://qpdf.readthedocs.io/en/latest/cli.html
    gsOutPath,
    "--object-streams=generate",
    "--compression-level=9",
    "--recompress-flate",
    "--optimize-images",
    outPath,
  ]);

  return {
    compressedPDF: {
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
