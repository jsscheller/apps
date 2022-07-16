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
    });
    assert.equal(out.compressedPDF.name, "sample-compressed.pdf");
    assert.ok(out.compressedPDF.contents.size > 0);
  });
});
