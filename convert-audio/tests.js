import main from "./index.js";
import * as testUtil from "test-util";
import * as assert from "assert";

beforeEach(async function () {
  await testUtil.initFS({
    "sample.mp4": "./sample.mp4",
  });
});

describe("tests", function () {
  this.timeout(10000);

  it("should convert to AAC", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "AAC",
      optionsAAC: { codec: "aac" },
    });
    assert.equal(out.result, "~/out/sample.aac");
  });

  it("should convert to AIFF", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "AIFF",
      optionsAIFF: { codec: "pcm_s16be" },
    });
    assert.equal(out.result, "~/out/sample.aiff");
  });

  it("should convert to FLAC", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "FLAC",
      optionsFLAC: { codec: "flac" },
    });
    assert.equal(out.result, "~/out/sample.flac");
  });

  it("should convert to M4A/aac", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "M4A",
      optionsM4A: { codec: "aac" },
    });
    assert.equal(out.result, "~/out/sample.m4a");
  });

  it("should convert to M4A/alac", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "M4A",
      optionsM4A: { codec: "alac" },
    });
    assert.equal(out.result, "~/out/sample.m4a");
  });

  it("should convert to MMF", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "MMF",
      optionsMMF: {
        codec: "adpcm_yamaha",
        channels: 2,
        sampleRate: 4000,
      },
    });
    assert.equal(out.result, "~/out/sample.mmf");
  });

  it("should convert to MP3", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "MP3",
      optionsMP3: { codec: "libmp3lame" },
    });
    assert.equal(out.result, "~/out/sample.mp3");
  });

  it("should convert to OGG/libvorbis", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "OGG",
      optionsOGG: {
        codec: "libvorbis",
      },
    });
    assert.equal(out.result, "~/out/sample.ogg");
  });

  it("should convert to OGG/libopus", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "OGG",
      optionsOGG: {
        codec: "libopus",
      },
    });
    assert.equal(out.result, "~/out/sample.ogg");
  });

  it("should convert to OPUS", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "OPUS",
      optionsOPUS: { codec: "libopus" },
    });
    assert.equal(out.result, "~/out/sample.opus");
  });

  it("should convert to WAV", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "WAV",
      optionsWAV: { codec: "pcm_s16le" },
    });
    assert.equal(out.result, "~/out/sample.wav");
  });

  it("should convert to WMA/wmav2", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "WMA",
      optionsWMA: { codec: "wmav2", channels: 2 },
    });
    assert.equal(out.result, "~/out/sample.wma");
  });

  it("should convert to WMA/wmav1", async function () {
    const out = await main({
      audioFile: { path: "~/in/sample.mp4" },
      convertTo: "WMA",
      optionsWMA: { codec: "wmav1", channels: 2 },
    });
    assert.equal(out.result, "~/out/sample.wma");
  });
});
