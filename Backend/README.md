# Backend crop image verification

Farmer booking images are checked by the backend with the Gemini API using the
configured vision model. The verification route accepts one JPG, PNG, or WebP
file (up to 5 MB) and returns a verified, rejected, or uncertain result. Only a
verified result gets a short-lived signed proof; booking creation checks that
proof against the exact image bytes and selected crop.

Uploads are held in memory and are not written to temporary files.

## Configure Gemini

Set the API key in `Backend/.env` (keep this key on the backend; do not commit
it or expose it in frontend code):

```dotenv
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
CROP_VERIFICATION_MIN_CONFIDENCE=0.78
CROP_VERIFICATION_TIMEOUT_MS=90000
CROP_VERIFICATION_SECRET=replace_with_a_random_secret_at_least_32_characters_long
```

`GEMINI_MODEL` defaults to `gemini-3.5-flash-lite`. Set it only if you want to
use a different Gemini model that supports image input. On Render or another
host, configure `GEMINI_API_KEY` and the signing secret as backend environment
variables.

Generate a signing secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The backend fails closed if the API key is missing or rejected, the request
times out, the model output is malformed, or confidence is below the configured
threshold.

Start the backend from the repository root:

```powershell
npm --prefix Backend install
npm --prefix Backend start
```

## Verify the endpoint

The booking form calls `POST /api/bookings/verify-crop` using multipart form
fields `selectedCrop` and `image`. For example:

```powershell
curl.exe -F "selectedCrop=Paddy" -F "image=@C:\path\to\paddy.jpg;type=image/jpeg" http://localhost:3000/api/bookings/verify-crop
```

Run backend validation tests with:

```powershell
npm --prefix Backend test
```

The tests cover all six supported label/decision paths, mismatches, unrelated
images, uncertainty, malformed model output, image signatures, Gemini request
format and API-key handling, and signed verification proofs. Real-world image
recognition requires a valid Gemini API key and an image-capable model.
