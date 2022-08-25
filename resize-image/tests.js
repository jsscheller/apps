import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "image.jpg": "./image.jpg",
  });
});

describe("tests", function () {
  it("should decrease width", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      resizeBy: "width",
      width: 100,
    });
    assert.equal(out.resizedImage, testUtil.outPath("image-resized.jpg"));
  });

  it("should increase width", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      resizeBy: "width",
      width: 800,
    });
    assert.equal(out.resizedImage, testUtil.outPath("image-resized.jpg"));
  });

  it("should increase width using padding", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      resizeBy: "width_and_height",
      method: "pad",
      padColor: "#000000",
      width: 800,
      height: 800,
    });
    assert.equal(out.resizedImage, testUtil.outPath("image-resized.jpg"));
  });
});
