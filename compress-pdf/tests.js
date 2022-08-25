import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
  });
});

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      pdfFile: {
        path: testUtil.inPath("sample.pdf"),
      },
    });
    assert.equal(out.compressedPDF, testUtil.outPath("sample-compressed.pdf"));
  });
});
