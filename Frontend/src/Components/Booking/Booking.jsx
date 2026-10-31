import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  User,
  Phone,
  Wheat,
  Scale,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
const CREATE_BOOKING_URL = `${VITE_API_URL}/api/bookings/createBooking`;
const VERIFY_CROP_URL = `${VITE_API_URL}/api/bookings/verify-crop`;

const PRODUCTS = [
  "Wheat",
  "Paddy",
  "Mustard",
  "Maize",
  "Sugarcane",
  "Cotton",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });

const BookingPage = () => {
  const navigate = useNavigate();
  const { users } = useAuth();
  const farmerMobile = users.farmer?.mobile || "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: farmerMobile,
    product: PRODUCTS[0],
    weight: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageCheck, setImageCheck] = useState({ status: "idle" });
  const [checkAttempt, setCheckAttempt] = useState(0);

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    let active = true;
    const product = form.product;

    const verifyImage = async () => {
      try {
        const upload = new FormData();
        upload.append("selectedCrop", product);
        upload.append("image", image);
        const { data } = await axios.post(VERIFY_CROP_URL, upload, {
          timeout: 120000,
        });
        if (active) {
          setImageCheck({
            ...data,
            image,
            product,
          });
        }
      } catch (error) {
        if (active) {
          setImageCheck({
            image,
            product,
            status: "error",
            message:
              error.response?.data?.message ||
              error.message ||
              "The crop image could not be verified.",
          });
        }
      }
    };

    void verifyImage();

    return () => {
      active = false;
    };
  }, [image, form.product, checkAttempt]);

  const currentImageCheck =
    imageCheck.image === image && imageCheck.product === form.product
      ? imageCheck
      : { status: image ? "checking" : "idle" };
  const imageVerified =
    currentImageCheck.status === "verified" &&
    Boolean(currentImageCheck.verificationToken);

  const updateField = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));

    setErrors((e) => ({
      ...e,
      [field]: undefined,
      submit: undefined,
    }));
  };

  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) {
      e.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      e.lastName = "Last name is required";
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.product) {
      e.product = "Select a product";
    }

    if (!form.weight || Number(form.weight) <= 0) {
      e.weight = "Enter a valid weight";
    }

    if (!image) {
      e.image = "Select an image to submit with your booking";
    } else if (!imageVerified) {
      e.image = "Verify that the uploaded image matches the selected crop";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!imageVerified) {
      return;
    }

    setSubmitting(true);

    try {
      const imageDataUrl = await readImageAsDataUrl(image);
      const { data } = await axios.post(
        CREATE_BOOKING_URL,
        {
          ...form,
          imageDataUrl,
          cropVerificationToken: currentImageCheck.verificationToken,
        },
        {
          withCredentials: true
        }
      );

      console.log("Booking successful:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Booking was not saved.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);

      const status = err.response?.status;

      if (status === 401 || status === 403) {
        setErrors((e) => ({
          ...e,
          submit: "Your session has expired. Please log in again.",
        }));

        navigate("/farmer-login");
        return;
      }

      setErrors((e) => ({
        ...e,
        submit:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-stone-50 to-stone-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-green-700" />
          </div>

          <h2 className="font-serif text-2xl text-green-900 mb-2">
            Booking submitted
          </h2>

          <p className="text-sm text-stone-600 mb-6">
            Thanks, {form.firstName}. We've recorded your booking for{" "}
            {form.weight} kg of {form.product}. A field officer will confirm by
            phone shortly.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-stone-50 to-stone-100 font-sans text-stone-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-stone-50"
            aria-label="Go back"
          >
            <ArrowLeft size={16} className="text-green-800" />
          </button>

          <h1 className="font-serif text-lg text-green-900">
            Book a slot
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-sm text-stone-500 mb-6">
            Fill in your details below and we'll confirm your slot by phone
            within one working day.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First name + Last name */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600">
                First name

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    className={`pl-9 pr-3 py-2.5 w-full rounded-lg border text-base bg-white text-stone-800 focus:outline-none focus:border-green-600 ${
                      errors.firstName
                        ? "border-red-400"
                        : "border-stone-300"
                    }`}
                    value={form.firstName}
                    onChange={(e) =>
                      updateField("firstName", e.target.value)
                    }
                    placeholder="Ramesh"
                  />
                </div>

                {errors.firstName && (
                  <span className="text-xs text-red-600">
                    {errors.firstName}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600">
                Last name

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    className={`pl-9 pr-3 py-2.5 w-full rounded-lg border text-base bg-white text-stone-800 focus:outline-none focus:border-green-600 ${
                      errors.lastName
                        ? "border-red-400"
                        : "border-stone-300"
                    }`}
                    value={form.lastName}
                    onChange={(e) =>
                      updateField("lastName", e.target.value)
                    }
                    placeholder="Kumar"
                  />
                </div>

                {errors.lastName && (
                  <span className="text-xs text-red-600">
                    {errors.lastName}
                  </span>
                )}
              </label>
            </div>

            {/* Phone */}
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600">
              Phone number

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="tel"
                  className={`pl-9 pr-3 py-2.5 w-full rounded-lg border text-base bg-white text-stone-800 focus:outline-none focus:border-green-600 ${
                    errors.phone
                      ? "border-red-400"
                      : "border-stone-300"
                  } ${farmerMobile ? "read-only:bg-stone-50 read-only:text-stone-500" : ""}`}
                  value={form.phone}
                  readOnly={Boolean(farmerMobile)}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="9876543210"
                />
              </div>

              {farmerMobile && (
                <span className="text-xs font-normal text-stone-500">
                  Using your registered account number so this booking appears
                  on your dashboard.
                </span>
              )}

              {errors.phone && (
                <span className="text-xs text-red-600">
                  {errors.phone}
                </span>
              )}
            </label>

            {/* Product + Weight */}
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600">
                Product

                <div className="relative">
                  <Wheat
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <select
                    className="pl-9 pr-3 py-2.5 w-full rounded-lg border border-stone-300 text-base bg-white text-stone-800 focus:outline-none focus:border-green-600"
                    value={form.product}
                    onChange={(e) =>
                      updateField("product", e.target.value)
                    }
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.product && (
                  <span className="text-xs text-red-600">
                    {errors.product}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600">
                Weight (kg)

                <div className="relative">
                  <Scale
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={`pl-9 pr-3 py-2.5 w-full rounded-lg border text-base bg-white text-stone-800 focus:outline-none focus:border-green-600 ${
                      errors.weight
                        ? "border-red-400"
                        : "border-stone-300"
                    }`}
                    value={form.weight}
                    onChange={(e) =>
                      updateField("weight", e.target.value)
                    }
                    placeholder="500"
                  />
                </div>

                {errors.weight && (
                  <span className="text-xs text-red-600">
                    {errors.weight}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-stone-600 sm:col-span-2">
                Product image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={`pl-3 pr-3 py-2.5 w-full rounded-lg border text-base bg-white text-stone-800 focus:outline-none focus:border-green-600 ${
                    errors.image ? "border-red-400" : "border-stone-300"
                  }`}
                  onChange={(event) => {
                    const selectedImage = event.target.files?.[0] || null;
                    setImage(null);
                    setErrors((current) => ({
                      ...current,
                      image: undefined,
                      submit: undefined,
                    }));

                    if (!selectedImage) return;

                    if (!ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
                      setErrors((current) => ({
                        ...current,
                        image: "Choose a JPG, PNG, or WebP image",
                      }));
                      event.target.value = "";
                      return;
                    }

                    if (selectedImage.size > MAX_IMAGE_SIZE) {
                      setErrors((current) => ({
                        ...current,
                        image: "Image must be 5 MB or smaller",
                      }));
                      event.target.value = "";
                      return;
                    }

                    setImage(selectedImage);
                  }}
                />
                <span className="text-xs font-normal text-stone-500">
                  Upload one JPG, PNG, or WebP image (maximum 5 MB).
                </span>
                {image && (
                  <span className="text-xs font-normal text-stone-600">
                    Selected: {image.name}
                  </span>
                )}
                {errors.image && (
                  <span className="text-xs text-red-600">{errors.image}</span>
                )}
                {currentImageCheck.status === "checking" && (
                  <span
                    className="flex items-center gap-2 text-xs font-normal text-amber-700"
                    role="status"
                  >
                    <LoaderCircle size={14} className="animate-spin" />
                    Vision AI is checking the image on the server. This may
                    take a short while.
                  </span>
                )}
                {currentImageCheck.status === "verified" && (
                  <span
                    className="flex items-center gap-2 text-xs font-normal text-green-700"
                    role="status"
                  >
                    <CheckCircle2 size={14} />
                    Image verified as {currentImageCheck.detectedCrop} (
                    {Math.round(currentImageCheck.confidence * 100)}% confidence).
                    {currentImageCheck.reason}
                  </span>
                )}
                {currentImageCheck.status === "rejected" && (
                  <span
                    className="flex items-center gap-2 text-xs font-normal text-red-600"
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    {currentImageCheck.detectedCrop === "unknown"
                      ? "No supported crop was clearly identified."
                      : `Selected ${form.product}, but the image appears to show ${currentImageCheck.detectedCrop}.`}{" "}
                    {currentImageCheck.reason} Upload another image.
                  </span>
                )}
                {currentImageCheck.status === "uncertain" && (
                  <span
                    className="flex items-center gap-2 text-xs font-normal text-amber-700"
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    AI could not confidently identify this image. Upload a
                    clearer photo of {form.product}.{" "}
                    {currentImageCheck.reason}
                  </span>
                )}
                {currentImageCheck.status === "error" && (
                  <span
                    className="flex flex-col gap-2 text-xs font-normal text-red-600"
                    role="alert"
                  >
                    <span>
                      Crop image verification failed:{" "}
                      {currentImageCheck.message}
                    </span>
                    <button
                      type="button"
                      className="self-start font-semibold underline"
                      onClick={() => {
                        setImageCheck({
                          status: "checking",
                          image,
                          product: form.product,
                        });
                        setCheckAttempt((attempt) => attempt + 1);
                      }}
                    >
                      Try verification again
                    </button>
                  </span>
                )}
              </label>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <p className="text-sm text-red-600">
                {errors.submit}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !imageVerified}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md"
            >
              {submitting
                ? "Submitting..."
                : currentImageCheck.status === "checking"
                  ? "Verifying image..."
                  : "Confirm booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;