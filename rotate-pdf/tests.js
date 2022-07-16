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
      rotate: [
        {
          angle: 90,
          relative: true,
          pages: "1,2",
        },
      ],
    });
    assert.equal(out.rotatedPDF.name, "sample-rotated.pdf");
    assert.ok(out.rotatedPDF.contents.size > 0);
  });
});
