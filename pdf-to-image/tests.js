import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      pages: "1-3",
      quality: 92,
      size: {
        width: 100,
      },
    });
    assert.equal(out.images.length, 3);
  });
});
