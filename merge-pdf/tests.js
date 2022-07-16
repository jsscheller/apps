import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should join files end-to-end", async function () {
    const out = await main({
      pdfFiles: [
        {
          name: "sample.pdf",
          contents: await fs.readFile("sample.pdf"),
        },
        {
          name: "sample.pdf",
          contents: await fs.readFile("sample.pdf"),
        },
      ],
      method: "join",
    });
    assert.equal(out.mergedPDF.name, "sample-merged.pdf");
    assert.ok(out.mergedPDF.contents.size > 0);
  });

  it("should specify page arrangement", async function () {
    const out = await main({
      pdfFiles: [
        {
          name: "sample.pdf",
          contents: await fs.readFile("sample.pdf"),
        },
        {
          name: "sample-clone.pdf",
          contents: await fs.readFile("sample.pdf"),
        },
      ],
      method: "custom",
      pages: [
        {
          from: "sample.pdf",
          selection: "1-2",
        },
        {
          from: "sample-clone.pdf",
          selection: "3-4",
        }
      ],
    });
    assert.equal(out.mergedPDF.name, "sample-merged.pdf");
    assert.ok(out.mergedPDF.contents.size > 0);
  });
});
