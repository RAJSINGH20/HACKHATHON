# Backend crop image verification

Farmer booking images are checked by the backend with an Ollama vision-language
model. The verification route accepts one JPG, PNG, or WebP file (up to 5 MB)
and returns a verified, rejected, or uncertain result. Only a verified result
gets a short-lived signed proof; booking creation checks that proof against the
exact image bytes and selected crop.

Uploads are held in memory and are not written to temporary files.

## Install and start Ollama

Install Ollama from <https://ollama.com/download>, then pull a vision model in
a terminal:

```powershell
ollama pull qwen2.5vl:7b
ollama list
```

Ollama Desktop normally starts its local service. If it is not running, start
it in a separate terminal:

```powershell
ollama serve
```

Configure `Backend/.env` (do not commit this file):

```dotenv
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_VISION_MODEL=qwen2.5vl:7b
CROP_VERIFICATION_MIN_CONFIDENCE=0.78
CROP_VERIFICATION_TIMEOUT_MS=90000
CROP_VERIFICATION_SECRET=replace_with_a_random_secret_at_least_32_characters_long
```

Generate a signing secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The configured Ollama model is checked for its `vision` capability before use.
Text-only models are rejected. The backend fails closed if Ollama is unavailable,
the request times out, the model output is malformed, or confidence is below
the configured threshold.

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
images, uncertainty, malformed model output, image signatures, Ollama vision
capability checks, and signed verification proofs. Real-world image recognition
still requires the Ollama model to be installed and running.
