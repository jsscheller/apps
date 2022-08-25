import main from "./index.js";
import * as assert from "assert";
import * as testUtil from "test-util";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.mp3": "./sample.mp3",
  });
});

describe("tests", function () {
  it("should trim using stop time", async function () {
    this.timeout(10000);
    const out = await main({
      audioFile: { path: testUtil.inPath("sample.mp3") },
      startTime: "00:00:05",
      rangeMethod: "specifyStopTime",
      stopTime: "00:00:07",
    });
    assert.equal(out.result, testUtil.outPath("sample-trimmed.mp3"));
  });

  it("should trim using duration", async function () {
    this.timeout(10000);
    const out = await main({
      audioFile: { path: testUtil.inPath("sample.mp3") },
      startTime: "00:00:05",
      rangeMethod: "specifyDuration",
      duration: "00:00:02",
    });
    assert.equal(out.result, testUtil.outPath("sample-trimmed.mp3"));
  });
});
