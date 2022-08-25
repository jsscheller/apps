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
      pages: "1-3",
      quality: 92,
      size: {
        width: 100,
      },
    });
    assert.equal(out.images.length, 3);
  });
});
