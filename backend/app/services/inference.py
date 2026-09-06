import joblib
from pathlib import Path

from app.core.config import settings
from app.services.preprocessing import request_to_dataframe


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / settings.model_path

model = None


def load_model():
    global model
    model = joblib.load(MODEL_PATH)


def predict_price(request):
    if model is None:
        raise RuntimeError("Model has not been loaded.")

    input_df = request_to_dataframe(request)
    prediction = model.predict(input_df)

    return float(prediction[0])