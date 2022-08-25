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
      imageFile: { path: testUtil.inPath("cat.png") },
      reflectX: true,
      reflectY: false,
    });
    assert.equal(out.result, testUtil.outPath("cat-reflected.png"));
  });
});
