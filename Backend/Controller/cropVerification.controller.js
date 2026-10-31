import {
  classifyCropImage,
  createCropVerificationToken,
  CropVerificationError,
  isValidCropImage,
  SUPPORTED_CROPS,
} from "../Services/cropVerification.service.js";

export const verifyCropImage = async (req, res) => {
  const { selectedCrop } = req.body;
  const file = req.file;

  if (!SUPPORTED_CROPS.includes(selectedCrop)) {
    return res.status(400).json({
      success: false,
      message: "Select one of the supported crops.",
    });
  }

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Upload a JPG, PNG, or WebP crop image.",
    });
  }

  if (!isValidCropImage(file.buffer, file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "The uploaded file is not a valid JPG, PNG, or WebP image.",
    });
  }

  try {
    const verification = await classifyCropImage(file.buffer, selectedCrop);
    const verificationToken =
      verification.status === "verified"
        ? createCropVerificationToken(file.buffer, selectedCrop)
        : null;

    console.info("Crop image verification completed:", {
      selectedCrop,
      detectedCrop: verification.detectedCrop,
      confidence: verification.confidence,
      status: verification.status,
    });

    return res.status(200).json({
      success: true,
      ...verification,
      verificationToken,
    });
  } catch (error) {
    console.error("Crop image verification failed:", {
      code: error.code || "UNEXPECTED_ERROR",
      message: error.message,
    });

    if (error instanceof CropVerificationError) {
      return res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Crop image verification failed. Please try again.",
    });
  }
};
