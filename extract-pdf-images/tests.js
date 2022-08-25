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
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      quality: 92,
      filter: {
        minWidth: 200,
      },
    });
    assert.equal(out.images.length, 1);
  });
});
