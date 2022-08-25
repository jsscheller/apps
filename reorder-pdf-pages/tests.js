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
      method: "custom",
      pages: "z-1 +90:1",
    });
    assert.equal(out.reorderedPDF, testUtil.outPath("sample-reordered.pdf"));
  });
});
