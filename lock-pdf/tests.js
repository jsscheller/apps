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
      encryption: "256-bit AES",
      password: "foobar",
    });
    assert.equal(out.lockedPDF, testUtil.outPath("sample-locked.pdf"));
  });
});
