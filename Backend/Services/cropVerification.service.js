import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SUPPORTED_CROPS = [
  "Wheat",
  "Paddy",
  "Mustard",
  "Maize",
  "Sugarcane",
  "Cotton",
];

const CROP_LABELS = [...SUPPORTED_CROPS, "unknown"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const TOKEN_TTL_MS = 10 * 60 * 1000;
const configuredThreshold = Number(
  process.env.CROP_VERIFICATION_MIN_CONFIDENCE || "0.78"
);
const requestTimeout = Number(
  process.env.CROP_VERIFICATION_TIMEOUT_MS || "90000"
);

if (
  !Number.isFinite(configuredThreshold) ||
  configuredThreshold < 0 ||
  configuredThreshold > 1
) {
  throw new Error("CROP_VERIFICATION_MIN_CONFIDENCE must be between 0 and 1.");
}

if (!Number.isInteger(requestTimeout) || requestTimeout < 1000) {
  throw new Error("CROP_VERIFICATION_TIMEOUT_MS must be at least 1000.");
}

export class CropVerificationError extends Error {
  constructor(message, statusCode = 502, code = "CROP_VERIFICATION_FAILED") {
    super(message);
    this.name = "CropVerificationError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const CROP_VERIFICATION_MODEL =
  process.env.GEMINI_VISION_MODEL || "gemini-3.5-flash-lite";

const getGeminiError = (error) => {
  if (error?.name === "TimeoutError" || error?.name === "AbortError") {
    return new CropVerificationError(
      "The vision model did not respond in time. Please try again.",
      504,
      "VISION_MODEL_TIMEOUT"
    );
  }

  return new CropVerificationError(
    "Gemini is unavailable to the backend. Check the Gemini API key, model name, and network connection.",
    503,
    "VISION_MODEL_UNAVAILABLE"
  );
};

export const isValidCropImage = (buffer, mimeType) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0 || buffer.length > MAX_IMAGE_SIZE) {
    return false;
  }

  if (
    mimeType === "image/jpeg" &&
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return true;
  }

  if (
    mimeType === "image/png" &&
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return true;
  }

  return (
    mimeType === "image/webp" &&
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
};

const getImageMimeType = (imageBuffer) => {
  if (
    imageBuffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }
  if (
    imageBuffer.toString("ascii", 0, 4) === "RIFF" &&
    imageBuffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (
    imageBuffer[0] === 0xff &&
    imageBuffer[1] === 0xd8 &&
    imageBuffer[2] === 0xff
  ) {
    return "image/jpeg";
  }
  throw new CropVerificationError(
    "The uploaded file is not a valid JPG, PNG, or WebP image.",
    400,
    "INVALID_CROP_IMAGE"
  );
};

const normalizeDetectedCrop = (crop) => {
  if (typeof crop !== "string") return null;
  const normalized = crop.trim().toLowerCase();
  if (normalized === "rice") return "Paddy";
  if (normalized === "corn") return "Maize";
  return SUPPORTED_CROPS.find((item) => item.toLowerCase() === normalized) || null;
};

export const validateCropModelResponse = (
  rawResponse,
  selectedCrop,
  confidenceThreshold = configuredThreshold
) => {
  let prediction;
  try {
    prediction = JSON.parse(rawResponse);
  } catch {
    throw new CropVerificationError(
      "Vision model returned an invalid response.",
      502,
      "INVALID_VISION_RESPONSE"
    );
  }

  if (
    !prediction ||
    typeof prediction.is_crop !== "boolean" ||
    typeof prediction.detected_crop !== "string" ||
    typeof prediction.confidence !== "number" ||
    !Number.isFinite(prediction.confidence) ||
    prediction.confidence < 0 ||
    prediction.confidence > 1 ||
    typeof prediction.reason !== "string" ||
    !prediction.reason.trim()
  ) {
    throw new CropVerificationError(
      "Vision model returned incomplete classification data.",
      502,
      "INVALID_VISION_RESPONSE"
    );
  }

  const detectedCrop =
    prediction.detected_crop.trim().toLowerCase() === "unknown"
      ? "unknown"
      : normalizeDetectedCrop(prediction.detected_crop);

  if (
    detectedCrop === null ||
    (prediction.is_crop && detectedCrop === "unknown") ||
    (!prediction.is_crop && detectedCrop !== "unknown")
  ) {
    throw new CropVerificationError(
      "Vision model returned an inconsistent crop classification.",
      502,
      "INVALID_VISION_RESPONSE"
    );
  }

  const confidence = prediction.confidence;
  const isMatch =
    prediction.is_crop &&
    confidence >= confidenceThreshold &&
    detectedCrop === selectedCrop;
  const status =
    confidence < confidenceThreshold
      ? "uncertain"
      : isMatch
        ? "verified"
        : "rejected";

  return {
    isCrop: prediction.is_crop,
    detectedCrop,
    selectedCrop,
    isMatch,
    confidence,
    reason: prediction.reason.trim().slice(0, 500),
    status,
  };
};

export const classifyCropImage = async (
  imageBuffer,
  selectedCrop,
  { fetchImpl = globalThis.fetch, confidenceThreshold = configuredThreshold } = {}
) => {
  if (!SUPPORTED_CROPS.includes(selectedCrop)) {
    throw new CropVerificationError(
      "Select one of the supported crops.",
      400,
      "UNSUPPORTED_CROP"
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new CropVerificationError(
      "Gemini crop verification is not configured. Set GEMINI_API_KEY in the backend environment.",
      503,
      "GEMINI_API_KEY_REQUIRED"
    );
  }

  const mimeType = getImageMimeType(imageBuffer);

  let response;
  try {
    response = await fetchImpl(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_VISION_MODEL)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: AbortSignal.timeout(requestTimeout),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: [
                    "Inspect the attached image itself. Do not infer its contents from a filename or any user-selected crop.",
                    "Determine whether a supported crop is visibly identifiable. Supported categories are Wheat, Paddy (rice), Mustard, Maize (corn), Sugarcane, and Cotton.",
                    "Recognize plants, flowers, fruits, ears, bolls, stalks, and harvested grains at different growth stages and in field or close-up views.",
                    "Set is_crop=true and detected_crop to exactly one canonical category only when visual evidence identifies it. Use is_crop=false and detected_crop=unknown for people, animals, vehicles, buildings, unrelated crops, generic landscapes, or images without an identifiable supported crop.",
                    "Be conservative with blurry, obstructed, distant, or ambiguous images. Confidence must express certainty in your visual classification from 0 to 1; do not guess.",
                    "Return a short factual reason based only on visible evidence.",
                  ].join(" "),
                },
                {
                  inlineData: {
                    mimeType,
                    data: imageBuffer.toString("base64"),
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                is_crop: { type: "BOOLEAN" },
                detected_crop: { type: "STRING", enum: CROP_LABELS },
                confidence: { type: "NUMBER" },
                reason: { type: "STRING" },
              },
              required: ["is_crop", "detected_crop", "confidence", "reason"],
            },
          },
        }),
      }
    );
  } catch (error) {
    throw getGeminiError(error);
  }

  if (!response.ok) {
    throw new CropVerificationError(
      response.status === 401 || response.status === 403
        ? "Gemini rejected the API key or does not have access to the configured model."
        : response.status === 429
          ? "Gemini API rate limit reached. Please try again shortly."
          : `Gemini API request failed with status ${response.status}.`,
      response.status === 429 ? 503 : 502,
      response.status === 401 || response.status === 403
        ? "GEMINI_API_KEY_INVALID"
        : response.status === 429
          ? "GEMINI_RATE_LIMITED"
          : "GEMINI_API_ERROR"
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new CropVerificationError(
      "Gemini returned an invalid response.",
      502,
      "INVALID_VISION_RESPONSE"
    );
  }

  const rawResponse = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("");
  return validateCropModelResponse(
    rawResponse,
    selectedCrop,
    confidenceThreshold
  );
};

const getVerificationSecret = () => {
  const secret =
    process.env.CROP_VERIFICATION_SECRET || process.env.JWT_SECRET || "";
  if (secret.length < 32 || /replace_with|change-this-secret/i.test(secret)) {
    throw new CropVerificationError(
      "Crop verification signing secret is not configured.",
      503,
      "VERIFICATION_SECRET_REQUIRED"
    );
  }
  return secret;
};

export const createCropVerificationToken = (imageBuffer, selectedCrop) => {
  const payload = Buffer.from(
    JSON.stringify({
      digest: createHash("sha256").update(imageBuffer).digest("hex"),
      crop: selectedCrop,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    })
  ).toString("base64url");
  const signature = createHmac("sha256", getVerificationSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
};

export const verifyCropVerificationToken = (
  token,
  imageBuffer,
  selectedCrop
) => {
  if (typeof token !== "string" || !token.includes(".")) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    if (!payload || !signature) return false;
    const expectedSignature = createHmac("sha256", getVerificationSecret())
      .update(payload)
      .digest();
    const suppliedSignature = Buffer.from(signature, "base64url");
    if (
      suppliedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(suppliedSignature, expectedSignature)
    ) {
      return false;
    }

    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const digest = createHash("sha256").update(imageBuffer).digest("hex");
    return (
      claims.crop === selectedCrop &&
      claims.digest === digest &&
      Number.isFinite(claims.expiresAt) &&
      claims.expiresAt > Date.now()
    );
  } catch (error) {
    if (error instanceof CropVerificationError) throw error;
    return false;
  }
};
