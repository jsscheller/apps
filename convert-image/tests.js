import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS({
    "image.jpg": "./image.jpg",
    "cat.svg": "./cat.svg",
  });
});

describe("tests", function () {
  it("should convert to bmp", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "BMP",
    });
    assert.equal(out.result, testUtil.outPath("image.bmp"));
  });

  it("should convert to gif", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "GIF",
    });
    assert.equal(out.result, testUtil.outPath("image.gif"));
  });

  it("should convert to ico", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "ICO",
    });
    assert.equal(out.result, testUtil.outPath("image.ico"));
  });

  it("should convert to png", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "PNG",
    });
    assert.equal(out.result, testUtil.outPath("image.png"));
  });

  it("should convert to tga", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "TGA",
    });
    assert.equal(out.result, testUtil.outPath("image.tga"));
  });

  it("should convert to tiff", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "TIFF",
    });
    assert.equal(out.result, testUtil.outPath("image.tiff"));
  });

  it("should convert to webp", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "WEBP",
    });
    assert.equal(out.result, testUtil.outPath("image.webp"));
  });

  it("should convert to wbmp", async function () {
    const out = await main({
      imageFile: { path: testUtil.inPath("image.jpg") },
      convertTo: "WBMP",
    });
    assert.equal(out.result, testUtil.outPath("image.wbmp"));
  });
});
