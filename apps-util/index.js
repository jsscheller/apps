export function outPath(inPath, opts = {}) {
  let name = basename(inPath);
  if (opts.ext) {
    name = replaceExt(name, opts.ext);
  }
  if (opts.suffix) {
    name = addSuffix(name, opts.suffix);
  }
  return `~/out/${name}`;
}

export function replaceExt(path, ext) {
  let lastDot = path.lastIndexOf(".");
  if (lastDot === -1) {
    lastDot = path.length - 1;
  }
  return path.slice(0, lastDot + 1) + ext;
}

export function basename(path) {
  const lastSlash = path.lastIndexOf("/") + 1;
  return path.slice(lastSlash);
}

export function addSuffix(path, suffix) {
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
