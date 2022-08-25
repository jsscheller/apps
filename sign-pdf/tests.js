import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
    "sig.png": "./sig.png",
  });
});

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      signatures: [
        {
          file: { path: testUtil.inPath("sig.png") },
          page: 1,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
        },
      ],
      otherAdditions: {
        text: [],
        images: [],
      },
    });
    assert.equal(out.signedPDF, testUtil.outPath("sample-signed.pdf"));
  });
});
