import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
  });
});

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "keep",
      pagesToKeep: "1-2",
    });
    assert.equal(out.trimmedPDF, testUtil.outPath("sample-trimmed.pdf"));
  });

  it("should remove first page", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "remove_first",
      pageCount: 1,
    });
    assert.equal(out.trimmedPDF, testUtil.outPath("sample-trimmed.pdf"));
  });

  it("should remove last 2 pages", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      method: "remove_last",
      pageCount: 2,
    });
    assert.equal(out.trimmedPDF, testUtil.outPath("sample-trimmed.pdf"));
  });
});
