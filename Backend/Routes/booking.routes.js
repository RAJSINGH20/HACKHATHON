import { Router } from "express"
import {
	createBooking,
	createBookingIVR,
	getBookings,
} from "../Controller/booking.controller.js";
import { verifyCropImage } from "../Controller/cropVerification.controller.js";
import multer from "multer";
const app = Router()

const uploadCropImage = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 1,
		fields: 1,
		fieldSize: 64,
		parts: 2,
	},
	fileFilter: (_req, file, callback) => {
		if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
			return callback(new Error("Upload a JPG, PNG, or WebP image."));
		}
		callback(null, true);
	},
});

const handleCropImageUpload = (req, res, next) => {
	uploadCropImage.single("image")(req, res, (error) => {
		if (!error) return next();

		if (error instanceof multer.MulterError) {
			const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
			return res.status(status).json({
				success: false,
				message: status === 413
					? "Image must be 5 MB or smaller."
					: "Upload one image file at a time.",
			});
		}

		return res.status(415).json({
			success: false,
			message: error.message || "Unsupported image upload.",
		});
	});
};

app.post("/verify-crop", handleCropImageUpload, verifyCropImage)
app.post("/createBooking", createBooking)
app.post("/ivr/createBooking", createBookingIVR)
app.get("/getBookings", getBookings)
app.get("/ivr/getBookings", getBookings)
export default app