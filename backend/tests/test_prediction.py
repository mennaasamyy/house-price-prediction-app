from fastapi.testclient import TestClient

from app.main import app


def test_health():
    with TestClient(app) as client:
        response = client.get("/health")

        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_prediction_success():
    payload = {
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "location": "other",
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }

    with TestClient(app) as client:
        response = client.post("/predict", json=payload)

        assert response.status_code == 200
        assert "predicted_price" in response.json()


def test_prediction_invalid_input():
    payload = {
        "carpet_area_sqft": "not-a-number",
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "location": "other",
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }

    with TestClient(app) as client:
        response = client.post("/predict", json=payload)

        assert response.status_code == 422