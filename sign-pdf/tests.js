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
      signatures: [
        {
          file: {
            name: "sig.png",
            contents: await fs.readFile("sig.png"),
          },
          page: 1,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
        },
      ],
      options: {
        text: [],
        images: [],
      },
    });
    assert.equal(out.signedPDF.name, "sample-signed.pdf");
    assert.ok(out.signedPDF.contents.size > 0);
  });
});
