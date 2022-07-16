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
      method: "keep",
      pagesToKeep: "1-2",
    });
    assert.equal(out.trimmedPDF.name, "sample-trimmed.pdf");
    assert.ok(out.trimmedPDF.contents.size > 0);
  });

  it("should remove first page", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      method: "remove_first",
      pageCount: 1,
    });
    assert.equal(out.trimmedPDF.name, "sample-trimmed.pdf");
    assert.ok(out.trimmedPDF.contents.size > 0);
  });

  it("should remove last 2 pages", async function () {
    const out = await main({
      pdfFile: {
        name: "sample.pdf",
        contents: await fs.readFile("sample.pdf"),
      },
      method: "remove_last",
      pageCount: 2,
    });
    assert.equal(out.trimmedPDF.name, "sample-trimmed.pdf");
    assert.ok(out.trimmedPDF.contents.size > 0);
  });
});
