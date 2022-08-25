export async function initFS(input = {}) {
  const isBrowser = globalThis.document;

  let src = {};
  if (!isBrowser) {
    const fs = await import("fs/promises");
    const appJSON = JSON.parse((await fs.readFile("app.json")).toString());
    for (const item of appJSON.include) {
      if (typeof item === "string") continue;
      src = { ...src, ...item };
    }
  }

  const path = isBrowser
    ? "@jspawn/jspawn"
    : `${process.cwd()}/node_modules/@jspawn/jspawn/umd/jspawn.js`;
  const { fs, chdir } = await import(path);

  await fs.clear();

  const dir = {
    src,
    in: input,
    out: {},
    tmp: {},
  };
  if (isBrowser && !dir.src.node_modules) {
    try {
      dir.src.node_modules = {
        "@jspawn": await resolveJspawnBinaries(),
      };
    } catch (_) {}
  }
  await fs.mount(dir, ".");

  await chdir("src");
}

async function resolveJspawnBinaries() {
  const acc = {};
  const jspawnPath = "/node_modules/@jspawn/";
  const jspawnDirPage = await (await fetch(jspawnPath)).text();
  const jspawnDir = parseSimpleHTTPServerDir(jspawnDirPage);
  for (const name of jspawnDir) {
    if (name === "jspawn") continue;
    const modPath = jspawnPath + name + "/";
    const dirPage = await (await fetch(modPath)).text();
    const dir = parseSimpleHTTPServerDir(dirPage);
    const wasm = dir.find((name) => name.endsWith(".wasm"));
    if (wasm) {
      acc[name] = {
        [wasm]: modPath + wasm,
      };
    }
  }
  return acc;
}

function parseSimpleHTTPServerDir(html) {
  const ents = [];
  for (const item of html.split("<li>").slice(1)) {
    const start = item.indexOf(">") + 1;
    const end = item.indexOf("</");
    ents.push(item.slice(start, end).replace(/\/$/, ""));
  }
  return ents;
}

export function inPath(path) {
  return `~/in/${path}`;
}

export function outPath(path) {
  return `~/out/${path}`;
}

export async function writeFile(path) {
  const nodeFS = await import("fs/promises");
  const { fs } = await import(
    `${process.cwd()}/node_modules/@jspawn/jspawn/umd/jspawn.js`
  );

  const buf = await fs.readFile(path);
  await nodeFS.writeFile(path.split("/").pop(), Buffer.from(buf));
}
