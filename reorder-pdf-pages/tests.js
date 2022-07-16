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
      method: "custom",
      pages: "z-1 +90:1",
    });
    assert.equal(out.reorderedPDF.name, "sample-reordered.pdf");
    assert.ok(out.reorderedPDF.contents.size > 0);
  });
});
