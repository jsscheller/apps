import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.pdf": "./sample.pdf",
  });
});

describe("tests", function () {
  it("should complain about the password", async function () {
    try {
      await main({
        pdfFile: { path: testUtil.inPath("sample.pdf") },
      });
    } catch (err) {
      assert.ok(typeof err === "string");
    }
  });

  it("should work", async function () {
    const out = await main({
      pdfFile: { path: testUtil.inPath("sample.pdf") },
      password: "foobar",
    });
    assert.equal(out.unlockedPDF, testUtil.outPath("sample-unlocked.pdf"));
  });
});
