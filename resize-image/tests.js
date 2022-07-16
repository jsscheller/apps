import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should decrease width", async function () {
    const out = await main({
      imageFile: {
        name: "image.jpg",
        contents: await fs.readFile("examples/assets/image.jpg"),
      },
      resizeBy: "width",
      width: 100,
    });
    assert.equal(out.resizedImage.name, "image-resized.jpg");
    assert.ok(out.resizedImage.contents.size > 0);
  });

  it("should increase width", async function () {
    const out = await main({
      imageFile: {
        name: "image.jpg",
        contents: await fs.readFile("examples/assets/image.jpg"),
      },
      resizeBy: "width",
      width: 800,
    });
    assert.equal(out.resizedImage.name, "image-resized.jpg");
    assert.ok(out.resizedImage.contents.size > 0);
  });

  it("should increase width using padding", async function () {
    const out = await main({
      imageFile: {
        name: "image.jpg",
        contents: await fs.readFile("examples/assets/image.jpg"),
      },
      resizeBy: "width_and_height",
      method: "pad",
      padColor: "#000000",
      width: 800,
      height: 800,
    });
    assert.equal(out.resizedImage.name, "image-resized.jpg");
    assert.ok(out.resizedImage.contents.size > 0);
  });
});
