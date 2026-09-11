# PivotVault Idea Score service

This FastAPI service serves the supplied scikit-learn artifacts. It is deliberately separate from the Node backend: the `.pkl` files are loaded only by Python and are never ported or approximated in JavaScript.

## Verified artifact contract

The supplied files were inspected with `joblib`:

- `startup_model.pkl` is a `RandomForestClassifier` (`n_estimators=200`, `max_depth=8`, `class_weight="balanced"`) trained with scikit-learn **1.6.1**.
- `scaler.pkl` is a `StandardScaler`, also serialized by scikit-learn **1.6.1**.
- Both expect five features. The service applies the scaler before `predict_proba` in this exact order:

| Field | Type | Validation |
| --- | --- | --- |
| `log_funding` | number | required |
| `funding_rounds` | number | required, at least 0 |
| `days_to_first_funding` | number | required, at least 0 |
| `funding_duration_days` | number | required, at least 0 |
| `is_international` | integer | required, exactly `0` or `1` |

The model emits the probability for class `1`. `raw` is that probability, and `ideaScore` is `raw * 100`, rounded to two decimals. Confirm that class `1` has the intended positive meaning against the original training data before presenting the result to users; no notebook or label mapping was provided with the artifacts.

## Run locally

```powershell
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001
```

Health check:

```powershell
Invoke-RestMethod http://localhost:8001/health
```

Example score request:

```powershell
$body = @{ features = @{
  log_funding = 12.7
  funding_rounds = 2
  days_to_first_funding = 365
  funding_duration_days = 180
  is_international = 0
} } | ConvertTo-Json
Invoke-RestMethod http://localhost:8001/score -Method Post -ContentType 'application/json' -Body $body
```

## Node integration contract

Set `ML_SERVICE_URL` in the Node backend configuration. `agents/lib/ideaScoreModel.js` should POST the feature object to `${ML_SERVICE_URL}/score`, use a five-second timeout, and return `{ ideaScore, breakdown: { rawScore: raw, modelVersion } }`. A failed health check or score request must propagate as an error; it must not produce a guessed or default score.
