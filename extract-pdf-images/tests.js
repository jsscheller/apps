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
      quality: 92,
      filter: {
        minWidth: 200,
      },
    });
    assert.equal(out.images.length, 1);
  });
});
