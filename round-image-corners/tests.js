import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS({
    "dog.jpg": "./dog.jpg",
  });
});

describe("tests", function () {
  it("should not change format", async function () {
    this.timeout(5000);
    const out = await main({
      imageFile: { path: testUtil.inPath("dog.jpg") },
      borderRadius: 100,
      format: "noChange",
    });
    assert.equal(out.result, testUtil.outPath("dog-rounded.jpg"));
  });

  it("should change format to png", async function () {
    this.timeout(5000);
    const out = await main({
      imageFile: { path: testUtil.inPath("dog.jpg") },
      borderRadius: 100,
      format: "PNG",
    });
    assert.equal(out.result, testUtil.outPath("dog-rounded.png"));
  });
});
