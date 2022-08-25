import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS();
});

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      width: 100,
      height: 100,
      color: "#ff9933",
      format: "PNG",
    });
    assert.equal(out.blankImage, testUtil.outPath("blank.png"));
  });
});
