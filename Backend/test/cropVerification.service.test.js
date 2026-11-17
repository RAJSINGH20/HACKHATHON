import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyCropImage,
  createCropVerificationToken,
  isValidCropImage,
  SUPPORTED_CROPS,
  validateCropModelResponse,
  verifyCropVerificationToken,
} from "../Services/cropVerification.service.js";

const makeImage = () => Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x01]);
const makePrediction = (crop, overrides = {}) =>
  JSON.stringify({
    is_crop: true,
    detected_crop: crop,
    confidence: 0.94,
    reason: `Visible ${crop} crop features.`,
    ...overrides,
  });

test("validates supported image signatures and rejects MIME spoofing", () => {
  assert.equal(isValidCropImage(makeImage(), "image/jpeg"), true);
  assert.equal(
    isValidCropImage(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      "image/png"
    ),
    true
  );
  assert.equal(
    isValidCropImage(Buffer.from("RIFF0000WEBP", "ascii"), "image/webp"),
    true
  );
  assert.equal(isValidCropImage(makeImage(), "image/png"), false);
  assert.equal(isValidCropImage(Buffer.alloc(0), "image/jpeg"), false);
});

for (const crop of SUPPORTED_CROPS) {
  test(`accepts a confident ${crop} visual classification`, () => {
    const result = validateCropModelResponse(makePrediction(crop), crop, 0.78);
    assert.equal(result.status, "verified");
    assert.equal(result.isMatch, true);
  });
}

test("normalizes rice and corn labels", () => {
  assert.equal(
    validateCropModelResponse(makePrediction("rice"), "Paddy").detectedCrop,
    "Paddy"
  );
  assert.equal(
    validateCropModelResponse(makePrediction("corn"), "Maize").detectedCrop,
    "Maize"
  );
});

for (const [selectedCrop, detectedCrop] of [
  ["Wheat", "Paddy"],
  ["Paddy", "Mustard"],
  ["Maize", "Wheat"],
  ["Cotton", "Sugarcane"],
  ["Sugarcane", "Cotton"],
  ["Mustard", "Maize"],
]) {
  test(`rejects ${detectedCrop} when ${selectedCrop} was selected`, () => {
    const result = validateCropModelResponse(
      makePrediction(detectedCrop),
      selectedCrop,
      0.78
    );
    assert.equal(result.status, "rejected");
    assert.equal(result.isMatch, false);
  });
}

for (const unrelatedObject of ["animal", "person", "car", "random landscape"]) {
  test(`rejects an unrelated ${unrelatedObject} image`, () => {
    const result = validateCropModelResponse(
      JSON.stringify({
        is_crop: false,
        detected_crop: "unknown",
        confidence: 0.97,
        reason: `The image shows a ${unrelatedObject}, not a supported crop.`,
      }),
      "Mustard",
      0.78
    );
    assert.equal(result.status, "rejected");
    assert.equal(result.isMatch, false);
  });
}

test("marks low confidence classifications uncertain", () => {
  assert.equal(
    validateCropModelResponse(
      makePrediction("Wheat", { confidence: 0.5 }),
      "Wheat"
    ).status,
    "uncertain"
  );
});

test("rejects malformed or internally inconsistent vision output", () => {
  assert.throws(() => validateCropModelResponse("not json", "Wheat"), {
    code: "INVALID_VISION_RESPONSE",
  });
  assert.throws(
    () =>
      validateCropModelResponse(
        makePrediction("Cotton", { is_crop: false }),
        "Cotton"
      ),
    { code: "INVALID_VISION_RESPONSE" }
  );
});

test("sends the image and structured classification request to Gemini", async () => {
  const image = makeImage();
  const previousApiKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-gemini-api-key";
  let requestUrl;
  let requestOptions;
  const fetchImpl = async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return {
      ok: true,
      async json() {
        return {
          candidates: [{
            content: {
              parts: [{ text: makePrediction("Cotton") }],
            },
          }],
        };
      },
    };
  };

  try {
    const result = await classifyCropImage(image, "Cotton", {
      fetchImpl,
      confidenceThreshold: 0.78,
    });
    assert.match(requestUrl, /models\/gemini-3\.5-flash-lite:generateContent$/);
    assert.equal(requestOptions.headers["x-goog-api-key"], "test-gemini-api-key");
    const requestBody = JSON.parse(requestOptions.body);
    const imagePart = requestBody.contents[0].parts[1].inlineData;
    assert.equal(imagePart.mimeType, "image/jpeg");
    assert.equal(imagePart.data, image.toString("base64"));
    assert.equal(requestBody.generationConfig.responseMimeType, "application/json");
    assert.equal(result.status, "verified");
  } finally {
    if (previousApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = previousApiKey;
    }
  }
});

test("requires a Gemini API key without making a network request", async () => {
  const previousApiKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    await assert.rejects(
      classifyCropImage(makeImage(), "Wheat", {
        fetchImpl: async () => assert.fail("Must not call Gemini without an API key."),
      }),
      { code: "GEMINI_API_KEY_REQUIRED", statusCode: 503 }
    );
  } finally {
    if (previousApiKey !== undefined) process.env.GEMINI_API_KEY = previousApiKey;
  }
});

test("reports Gemini authentication failures without exposing the API key", async () => {
  const previousApiKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-gemini-api-key";
  try {
    await assert.rejects(
      classifyCropImage(makeImage(), "Wheat", {
        fetchImpl: async () => ({ ok: false, status: 403 }),
      }),
      {
        code: "GEMINI_API_KEY_INVALID",
        statusCode: 502,
        message:
          "Gemini rejected the API key or does not have access to the configured model.",
      }
    );
  } finally {
    if (previousApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = previousApiKey;
    }
  }
});

test("verification tokens are bound to exact image bytes and selected crop", () => {
  const previousSecret = process.env.CROP_VERIFICATION_SECRET;
  process.env.CROP_VERIFICATION_SECRET = "test-secret-with-at-least-32-characters";
  try {
    const image = makeImage();
    const token = createCropVerificationToken(image, "Wheat");
    assert.equal(verifyCropVerificationToken(token, image, "Wheat"), true);
    assert.equal(verifyCropVerificationToken(token, makeImage().subarray(1), "Wheat"), false);
    assert.equal(verifyCropVerificationToken(token, image, "Paddy"), false);
  } finally {
    if (previousSecret === undefined) {
      delete process.env.CROP_VERIFICATION_SECRET;
    } else {
      process.env.CROP_VERIFICATION_SECRET = previousSecret;
    }
  }
});
