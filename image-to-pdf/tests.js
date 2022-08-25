import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.jpg": "./sample.jpg",
  });
});

describe("tests", function () {
  it("should work", async function () {
    this.timeout(4000);
    const out = await main({
      dpi: 300,
      imageFiles: [
        { path: testUtil.inPath("sample.jpg") },
        { path: testUtil.inPath("sample.jpg") },
      ],
      searchable: true,
    });
    assert.equal(out.pdfs.length, 2);
    assert.equal(out.pdfs[0], testUtil.outPath("sample-0.pdf"));
    assert.equal(out.pdfs[1], testUtil.outPath("sample-1.pdf"));
  });
});
