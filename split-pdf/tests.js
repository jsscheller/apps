import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should extract pages into single PDF", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      method: "extract",
      pages: "1-2",
    });
    assert.equal(out.pdfs.length, 1);
    assert.equal(out.pdfs[0].name, "sample-1.pdf");
    assert.ok(out.pdfs[0].contents.size > 0);
  });

  it("should each page to separate PDF", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      method: "chunk",
      chunkSize: 3,
    });
    assert.equal(out.pdfs.length, 2);
  });

  it("should split PDF into multiple PDFs", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      method: "split",
      pdfs: ["z-1", "1-z"],
    });
    assert.equal(out.pdfs.length, 2);
  });
});
