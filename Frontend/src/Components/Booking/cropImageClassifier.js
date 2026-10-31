import { pipeline, RawImage } from "@huggingface/transformers";

const MODEL_ID = "Xenova/clip-vit-base-patch32";
const MIN_SCORE = 0.35;
const MIN_SCORE_MARGIN = 0.08;

const CROP_LABELS = {
  Wheat: "wheat plants, wheat grain heads, or harvested wheat grains",
  Paddy: "rice plants in a paddy field, rice panicles, or harvested rice grains",
  Mustard: "mustard plants with yellow flowers or harvested mustard seeds",
  Maize: "maize plants, ears of corn, or harvested corn kernels",
  Sugarcane: "sugarcane plants or harvested sugarcane stalks",
  Cotton: "cotton plants or cotton bolls",
};

let classifierPromise;

const loadClassifier = () => {
  if (!classifierPromise) {
    classifierPromise = pipeline(
      "zero-shot-image-classification",
      MODEL_ID,
      { dtype: "q8" },
    ).catch((error) => {
      classifierPromise = undefined;
      throw error;
    });
  }

  return classifierPromise;
};

export async function classifyCropImage(imageFile, selectedCrop) {
  if (!CROP_LABELS[selectedCrop]) {
    throw new Error("The selected crop is not supported by image verification.");
  }

  const image = await RawImage.read(imageFile);
  const classifier = await loadClassifier();
  const candidates = Object.entries(CROP_LABELS).map(
    ([crop, description]) => `${crop}: ${description}`,
  );
  const results = await classifier(image, candidates, {
    hypothesis_template: "A photo of {}.",
  });

  const bestMatch = results[0];
  const secondBestMatch = results[1];
  const detectedCrop = bestMatch.label.split(":")[0];
  const isConfident =
    bestMatch.score >= MIN_SCORE &&
    bestMatch.score - secondBestMatch.score >= MIN_SCORE_MARGIN;

  return {
    detectedCrop,
    matches: isConfident && detectedCrop === selectedCrop,
    uncertain: !isConfident,
  };
}
