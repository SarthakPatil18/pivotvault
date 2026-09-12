═══════════════════════════════════════════════════════
ADDENDUM — WIRING UP THE TRAINED .pkl MODEL
═══════════════════════════════════════════════════════
Append this section to the main prompt, right after the
"IDEA SCORE MODEL — REPLACES THE MANUAL FORMULA" section.
It replaces the generic/stubbed version of
agents/lib/ideaScoreModel.js with a concrete integration.

CONTEXT:
The idea-scoring model was trained in Google Colab using
scikit-learn (or similar) and exported as 2 .pkl files.
Node.js cannot load .pkl files directly — they need a
Python process to unpickle and run inference. Do NOT try
to port the model to JS or reimplement it — load the
.pkl files as-is inside a small Python service and call
that service from Node.

WHAT THE TWO .pkl FILES LIKELY ARE (verify, don't assume):
  - One is almost certainly the trained model itself
    (e.g. classifier/regressor — model.pkl)
  - The other is very likely a preprocessor: a scaler,
    vectorizer, or encoder fit on the training data
    (e.g. scaler.pkl / vectorizer.pkl) that MUST be applied
    to raw features before they're passed to the model —
    using the model without it will silently produce wrong
    scores. Open the Colab notebook and confirm which file
    is which and the exact order they were applied in
    before wiring anything up.

NEW COMPONENT — ml-service/ (Python, own top-level folder,
not inside backend/src, so it never collides with the
Node/Prisma/scraper codebase your teammate is touching):

ml-service/
  app.py              ← FastAPI (or Flask) app
  models/
    model.pkl          ← rename to match your actual file
    preprocessor.pkl    ← rename to match your actual file
  requirements.txt
  README.md            ← document exact input feature order

app.py:
  - On startup: load both .pkl files once with joblib
    (joblib.load) or pickle, keep them in memory
  - Expose POST /score
    body: { features: { ...named feature fields... } }
    steps:
      1. Validate the incoming features (reject if any
         required field is missing — do not silently
         default them)
      2. Run them through the preprocessor exactly as
         training did (same field order / same
         transform — mismatches here are the #1 cause
         of silently wrong scores)
      3. Run the transformed features through the model
      4. Return: { ideaScore: number (0-100), raw: number,
                   modelVersion: string }
  - Add a GET /health endpoint returning { status: "ok" }
    for startup checks
  - Log every request: feature snapshot + resulting score
  - This service does ONE job — score an idea. No DB
    access, no auth logic, no other endpoints.

requirements.txt:
  fastapi
  uvicorn
  scikit-learn   (match the exact version used in Colab —
                  check with pip freeze in the notebook,
                  a version mismatch can break unpickling)
  joblib
  numpy / pandas as needed by the preprocessor

Run locally with:
  uvicorn app:app --host 0.0.0.0 --port 8001

Deployment: run this as its own Railway service (same
platform as the rest of the backend), separate from the
Node backend service. Add its URL as an env var —
ML_SERVICE_URL — read only via config/env.js, never
process.env directly, matching the rest of the codebase's
rules.

═══════════════════════════════════════════════════════
UPDATED agents/lib/ideaScoreModel.js (Node side)
═══════════════════════════════════════════════════════

lib/ideaScoreModel.js:
  - Export scoreIdea(features) → { ideaScore, breakdown }
  - Read ML_SERVICE_URL from config/env.js
  - POST features to `${ML_SERVICE_URL}/score`
  - Timeout the request at 5s (this is a local/internal
    call, not a third-party API — should be fast)
  - On non-200 response or timeout: throw a clear error,
    do NOT fall back to an LLM-estimated score and do NOT
    return a default number — riskAnalyst.js should let
    this error propagate so it shows as a failed/timeout
    specialist in Stage 2, same as any other agent failure
  - On success: return { ideaScore: response.ideaScore,
    breakdown: response.raw ? { rawScore: response.raw,
    modelVersion: response.modelVersion } : {} }
  - Add a startup check (or lazy first-call check) that
    pings ML_SERVICE_URL + "/health" and logs a clear
    warning if the ML service isn't reachable, so a
    misconfigured URL fails loudly in dev, not silently
    in production

FEATURE CONTRACT (fill this in once you confirm from the
Colab notebook exactly what features the model expects,
in what order, and what type each one is — e.g.
market_saturation: float, team_size: int, funding_stage:
categorical/encoded, burn_rate: float, etc.). Document the
final list at the top of ml-service/README.md AND as a
comment in ideaScoreModel.js so both sides always match —
this is the single most likely place for the two sides to
silently drift out of sync.

DO NOT (additional, specific to this addendum):
- Do not hardcode feature values or fill missing features
  with 0/None to "make it work" — a wrong input silently
  produces a wrong score, which is worse than an error
- Do not skip the preprocessor step even if the raw model
  "seems to work" without it — unscaled/unencoded input
  usually still returns a number, just a wrong one
- Do not let riskAnalyst.js reach into ml-service/ directly
  or import Python — it must go through the HTTP boundary
  via ideaScoreModel.js only
