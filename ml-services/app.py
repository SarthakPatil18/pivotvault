"""PivotVault Idea Score model service.

The serialized artifacts were trained with scikit-learn 1.6.1.  This service
keeps the exact training transformation order: validate named inputs, arrange
them in the scaler's saved feature order, transform with ``scaler.pkl``, then
call ``startup_model.pkl``.
"""

from __future__ import annotations

import hashlib
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator


LOGGER = logging.getLogger("pivotvault.ml_service")
MODEL_DIR = Path(__file__).resolve().parent
SCALER_PATH = MODEL_DIR / "scaler.pkl"
MODEL_PATH = MODEL_DIR / "startup_model.pkl"

scaler = None
model = None
feature_order: tuple[str, ...] = ()
model_version = ""


class ScoreFeatures(BaseModel):
    """The five raw inputs used while training the supplied model."""

    model_config = ConfigDict(extra="forbid")

    log_funding: Annotated[float, Field(description="Natural log of total funding")]
    funding_rounds: Annotated[float, Field(ge=0)]
    days_to_first_funding: Annotated[float, Field(ge=0)]
    funding_duration_days: Annotated[float, Field(ge=0)]
    is_international: Annotated[int, Field(description="Binary flag: 0 or 1")]

    @field_validator("is_international")
    @classmethod
    def validate_international_flag(cls, value: int) -> int:
        if value not in (0, 1):
            raise ValueError("must be either 0 or 1")
        return value


class ScoreRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    features: ScoreFeatures


class ScoreResponse(BaseModel):
    ideaScore: Annotated[float, Field(ge=0, le=100)]
    raw: float
    modelVersion: str


def _artifact_version() -> str:
    digest = hashlib.sha256(MODEL_PATH.read_bytes()).hexdigest()[:12]
    return f"startup-model-rf-{digest}"


def _load_artifacts() -> None:
    global feature_order, model, model_version, scaler

    if not SCALER_PATH.is_file() or not MODEL_PATH.is_file():
        raise RuntimeError("Required model artifacts scaler.pkl and startup_model.pkl are missing")

    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
    names = getattr(scaler, "feature_names_in_", None)
    if names is None:
        raise RuntimeError("The saved scaler does not contain its training feature names")

    feature_order = tuple(str(name) for name in names)
    if getattr(model, "n_features_in_", None) != len(feature_order):
        raise RuntimeError("Model and scaler feature counts do not match")
    if set(getattr(model, "classes_", [])) != {0, 1}:
        raise RuntimeError("The supplied classifier must expose binary classes 0 and 1")

    model_version = _artifact_version()
    LOGGER.info("Loaded model version %s with features %s", model_version, feature_order)


@asynccontextmanager
async def lifespan(_: FastAPI):
    _load_artifacts()
    yield


app = FastAPI(title="PivotVault Idea Score Service", version="1.0.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    return {"status": "ok"}


@app.post("/score", response_model=ScoreResponse)
def score(request: ScoreRequest) -> ScoreResponse:
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    # DataFrame preserves the named fields and training order expected by sklearn.
    input_frame = pd.DataFrame(
        [[getattr(request.features, field) for field in feature_order]],
        columns=feature_order,
    )
    transformed = scaler.transform(input_frame)
    probabilities = model.predict_proba(np.asarray(transformed))[0]
    positive_index = list(model.classes_).index(1)
    raw = float(probabilities[positive_index])
    idea_score = round(raw * 100, 2)

    LOGGER.info(
        "score_request features=%s raw=%.8f ideaScore=%.2f",
        request.features.model_dump(),
        raw,
        idea_score,
    )
    return ScoreResponse(ideaScore=idea_score, raw=raw, modelVersion=model_version)


@app.post("/predict", response_model=ScoreResponse)
def predict(request: ScoreRequest) -> ScoreResponse:
    return score(request)
