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
      rotate: [
        {
          angle: 90,
          relative: true,
          pages: "1,2",
        },
      ],
    });
    assert.equal(out.rotatedPDF, testUtil.outPath("sample-rotated.pdf"));
  });
});
