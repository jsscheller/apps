import main from "./index.js";
import * as assert from "assert";

describe("tests", function () {
  it("should work", async function () {
    const out = await main({
      width: 100,
      height: 100,
      color: "#ff9933",
      format: "PNG",
    });
    assert.equal(out.blankImage.name, "blank.png");
  });
});
