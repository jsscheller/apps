import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
  });
});

describe("tests", function () {
  it("should extract pages into single PDF", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "extract",
      pages: "1-2",
    });
    assert.equal(out.pdfs.length, 1);
    assert.equal(out.pdfs[0], testUtil.outPath("sample-1.pdf"));
  });

  it("should each page to separate PDF", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "chunk",
      chunkSize: 3,
    });
    assert.equal(out.pdfs.length, 2);
  });

  it("should split PDF into multiple PDFs", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "split",
      pdfs: ["z-1", "1-z"],
    });
    assert.equal(out.pdfs.length, 2);
  });
});
