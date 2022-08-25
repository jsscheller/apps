import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
    "sample-clone.pdf": "./sample.pdf",
  });
});

describe("tests", function () {
  it("should join files end-to-end", async function () {
    const out = await main({
      pdfFiles: [
        { path: testUtil.inPath("sample.pdf") },
        { path: testUtil.inPath("sample.pdf") },
      ],
      method: "join",
    });
    assert.equal(out.mergedPDF, testUtil.outPath("sample-merged.pdf"));
  });

  it("should specify page arrangement", async function () {
    const out = await main({
      pdfFiles: [
        { path: testUtil.inPath("sample.pdf"), name: "sample.pdf" },
        { path: testUtil.inPath("sample-clone.pdf"), name: "sample-clone.pdf" },
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
        },
      ],
    });
    assert.equal(out.mergedPDF, testUtil.outPath("sample-merged.pdf"));
  });
});
