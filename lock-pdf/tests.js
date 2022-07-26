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
      encryption: "256-bit AES",
      password: "foobar",
    });
    assert.equal(out.lockedPDF.name, "sample-locked.pdf");
    assert.ok(out.lockedPDF.contents.size > 0);
  });
});
