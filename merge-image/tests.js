import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS({
    "cat.png": "./cat.png",
  });
});

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      imageFiles: Array(4).fill({ path: testUtil.inPath("cat.png") }, 0),
      rows: 2,
      columns: 2,
      spacing: 0,
      format: "JPEG",
      backgroundColor: "#ff9933",
    });
    assert.equal(out.result, testUtil.outPath("cat-montage.jpg"));
  });
});
