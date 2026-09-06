import json
from pathlib import Path

import pandas as pd

from app.core.config import settings


BASE_DIR = Path(__file__).resolve().parents[2]
LOCATIONS_PATH = BASE_DIR / settings.locations_path

with open(LOCATIONS_PATH, "r", encoding="utf-8") as file:
    ALLOWED_LOCATIONS = set(json.load(file))


def request_to_dataframe(request):
    location = request.location

    if location not in ALLOWED_LOCATIONS:
        location = "other"

    data = {
        "Carpet Area_clean": request.carpet_area_sqft,
        "Floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "location_grouped": location,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }

    return pd.DataFrame([data])