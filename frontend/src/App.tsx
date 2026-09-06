import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [locations, setLocations] = useState<string[]>([])
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    carpet_area_sqft: "",
    floor_num: "",
    bathroom: "",
    balcony: "",
    location: "",
    furnishing: "",
    transaction: "",
    ownership: "",
    facing: "",
  })

  useEffect(() => {
    fetch("/locations.json")
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error("Error loading locations:", error))
  }, [])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (
      !formData.carpet_area_sqft ||
      !formData.floor_num ||
      !formData.bathroom ||
      !formData.balcony ||
      !formData.location ||
      !formData.furnishing ||
      !formData.transaction ||
      !formData.ownership ||
      !formData.facing
    ) {
      setError("Please complete all required fields.")
      return
    }

    if (Number(formData.carpet_area_sqft) <= 0) {
      setError("Carpet area must be greater than 0.")
      return
    }

    setLoading(true)
    setError("")
    setPrediction(null)

    const payload = {
      carpet_area_sqft: Number(formData.carpet_area_sqft),
      floor_num: Number(formData.floor_num),
      bathroom: Number(formData.bathroom),
      balcony: Number(formData.balcony),
      location: formData.location,
      furnishing: formData.furnishing,
      transaction: formData.transaction,
      ownership: formData.ownership,
      facing: formData.facing,
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/predict`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      }
    )

      if (!response.ok) {
        throw new Error("Prediction request failed")
      }

      const data = await response.json()

      setPrediction(data.predicted_price)
    } catch (error) {
      setError("Could not get a prediction. Please check that the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  function formatPrice(price: number) {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(1)} Lac`
    }

    return `₹ ${price.toLocaleString("en-IN")}`
  }

  

    return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>House Price Predictor</h1>
          <p>
            Enter the property details below to estimate its price using our
            machine learning model.
          </p>
        </div>

        <div className="card">
          <h2>Property Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Carpet Area (sq ft)</label>
                <input
                  type="number"
                  name="carpet_area_sqft"
                  value={formData.carpet_area_sqft}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Floor Number</label>
                <input
                  type="number"
                  name="floor_num"
                  value={formData.floor_num}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathroom"
                  value={formData.bathroom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Balconies</label>
                <input
                  type="number"
                  name="balcony"
                  value={formData.balcony}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select location</option>

                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Furnishing</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select furnishing</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div className="form-group">
                <label>Transaction</label>
                <select
                  name="transaction"
                  value={formData.transaction}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select transaction</option>
                  <option value="New Property">New Property</option>
                  <option value="Resale">Resale</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ownership</label>
                <select
                  name="ownership"
                  value={formData.ownership}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select ownership</option>
                  <option value="Freehold">Freehold</option>
                  <option value="Leasehold">Leasehold</option>
                  <option value="Co-operative Society">
                    Co-operative Society
                  </option>
                  <option value="Power Of Attorney">
                    Power Of Attorney
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Facing</label>
                <select
                  name="facing"
                  value={formData.facing}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>

            <button
              className="predict-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict Price"}
            </button>
          </form>

          {prediction !== null && (
            <div className="result">
              <h2>Estimated Price</h2>
              <p className="price">
                {formatPrice(prediction)}
              </p>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default App