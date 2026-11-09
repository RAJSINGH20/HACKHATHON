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
    isValidCropImage(
      Buffer.from("RIFF0000WEBP", "ascii"),
      "image/webp"
    ),
    true
  );
  assert.equal(isValidCropImage(makeImage(), "image/png"), false);
  assert.equal(isValidCropImage(Buffer.alloc(0), "image/jpeg"), false);
});

for (const crop of SUPPORTED_CROPS) {
  test(`accepts a confident ${crop} visual classification when selected`, () => {
    const result = validateCropModelResponse(
      JSON.stringify({
        is_crop: true,
        detected_crop: crop,
        confidence: 0.94,
        reason: `Visible ${crop} crop features.`,
      }),
      crop,
      0.78
    );

    assert.equal(result.status, "verified");
    assert.equal(result.isMatch, true);
    assert.equal(result.selectedCrop, crop);
    assert.equal(result.detectedCrop, crop);
  });
}

for (const [selectedCrop, detectedCrop] of [
  ["Wheat", "Paddy"],
  ["Paddy", "Mustard"],
  ["Maize", "Wheat"],
  ["Cotton", "Sugarcane"],
  ["Sugarcane", "Cotton"],
  ["Mustard", "Maize"],
]) {
  test(`rejects ${detectedCrop} when the farmer selected ${selectedCrop}`, () => {
    const result = validateCropModelResponse(
      JSON.stringify({
        is_crop: true,
        detected_crop: detectedCrop,
        confidence: 0.94,
        reason: `Visible ${detectedCrop} crop features.`,
      }),
      selectedCrop,
      0.78
    );

    assert.equal(result.status, "rejected");
    assert.equal(result.isMatch, false);
  });
}

for (const unrelatedObject of [
  "animal",
  "person",
  "car",
  "random landscape",
]) {
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

test("asks for another image when the visual classification is uncertain", () => {
  const uncertain = validateCropModelResponse(
    JSON.stringify({
      is_crop: true,
      detected_crop: "Wheat",
      confidence: 0.51,
      reason: "The image is blurry and the crop cannot be identified clearly.",
    }),
    "Wheat",
    0.78
  );
  assert.equal(uncertain.status, "uncertain");
  assert.equal(uncertain.isMatch, false);
});

test("rejects malformed or internally inconsistent vision output", () => {
  assert.throws(
    () => validateCropModelResponse("not json", "Wheat"),
    { code: "INVALID_VISION_RESPONSE" }
  );
  assert.throws(
    () =>
      validateCropModelResponse(
        JSON.stringify({
          is_crop: false,
          detected_crop: "Cotton",
          confidence: 0.99,
          reason: "Cotton is visible.",
        }),
        "Cotton"
      ),
    { code: "INVALID_VISION_RESPONSE" }
  );
});

test("sends the actual image bytes to a vision-capable Ollama model", async () => {
  const image = makeImage();
  let receivedImages;
  const client = {
    async show() {
      return { capabilities: ["completion", "vision"] };
    },
    async chat(request) {
      receivedImages = request.messages[0].images;
      return {
        message: {
          content: JSON.stringify({
            is_crop: true,
            detected_crop: "Cotton",
            confidence: 0.91,
            reason: "Cotton bolls are visible.",
          }),
        },
      };
    },
  };

  const result = await classifyCropImage(image, "Cotton", {
    client,
    confidenceThreshold: 0.78,
  });

  assert.equal(receivedImages[0], image);
  assert.equal(result.status, "verified");
});

test("rejects text-only configured Ollama models", async () => {
  const client = {
    async show() {
      return { capabilities: ["completion"] };
    },
    async chat() {
      assert.fail("Text-only models must not receive crop classification requests.");
    },
  };

  await assert.rejects(
    classifyCropImage(makeImage(), "Wheat", { client }),
    { code: "VISION_MODEL_REQUIRED", statusCode: 503 }
  );
});

test("fails closed when Ollama cannot be reached", async () => {
  const client = {
    async show() {
      throw new Error("connection refused");
    },
    async chat() {
      assert.fail("Unavailable Ollama must not receive image requests.");
    },
  };

  await assert.rejects(
    classifyCropImage(makeImage(), "Wheat", { client }),
    {
      code: "VISION_MODEL_UNAVAILABLE",
      statusCode: 503,
      message:
        "Ollama is unavailable to the backend. Start Ollama on the backend host and confirm OLLAMA_BASE_URL points to it.",
    }
  );
});

test("does not connect to Ollama on Render", async () => {
  const previousRender = process.env.RENDER;
  process.env.RENDER = "true";
  let called = false;
  const client = {
    async show() {
      called = true;
      return { capabilities: ["completion", "vision"] };
    },
    async chat() {
      called = true;
      return {};
    },
  };

  try {
    await assert.rejects(
      classifyCropImage(makeImage(), "Wheat", { client }),
      {
        code: "VISION_MODEL_DISABLED",
        statusCode: 503,
        message: "Ollama crop verification is disabled on Render.",
      }
    );
    assert.equal(called, false);
  } finally {
    if (previousRender === undefined) {
      delete process.env.RENDER;
    } else {
      process.env.RENDER = previousRender;
    }
  }
});

test("reports when the configured Ollama model is not installed", async () => {
  const client = {
    async show() {
      const error = new Error("model 'qwen2.5vl:7b' not found");
      error.status_code = 404;
      throw error;
    },
    async chat() {
      assert.fail("A missing Ollama model must not receive image requests.");
    },
  };

  await assert.rejects(
    classifyCropImage(makeImage(), "Wheat", { client }),
    {
      code: "VISION_MODEL_NOT_INSTALLED",
      statusCode: 503,
      message: 'The Ollama model "qwen2.5vl:7b" is not installed. Run "ollama pull qwen2.5vl:7b" on the backend host.',
    }
  );
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
