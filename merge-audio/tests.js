import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.mp3": "./sample.mp3",
    "sample.opus": "./sample.opus",
  });
});

describe("tests", function () {
  it("should work", async function () {
    this.timeout(10000);
    const out = await main({
      audioFiles: [
        { path: testUtil.inPath("sample.mp3") },
        { path: testUtil.inPath("sample.opus") },
      ],
      format: "WAV",
    });
    assert.equal(out.result, testUtil.outPath("sample-merged.wav"));
  });
});
