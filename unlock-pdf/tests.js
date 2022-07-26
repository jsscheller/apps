import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should complain about the password", async function () {
    try {
      await main({
        pdfFile: {
          name: "sample.pdf",
          contents: await fs.readFile("sample.pdf"),
        },
      });
    } catch (err) {
      assert.ok(typeof err === "string");
    }
  });

  it("should work", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      password: "foobar",
    });
    assert.equal(out.unlockedPDF.name, "sample-unlocked.pdf");
    assert.ok(out.unlockedPDF.contents.size > 0);
  });
});
