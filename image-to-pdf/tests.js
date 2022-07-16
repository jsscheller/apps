import main from "./index.js";
import * as fs from "fs/promises";
import * as assert from "assert";

describe("tests", function () {
  it("should work", async function () {
    try {
      const out = await main({
        dpi: 300,
        imageFiles: [{
          name: "sample.jpg",
          contents: await fs.readFile("sample.jpg"),
        }],
      });
      assert.equal(out.pdf.name, "sample.pdf");
    } catch (err) {
      console.log(err);
    }
  });
});
