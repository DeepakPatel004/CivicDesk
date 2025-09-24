# CivicDesk Advanced ML Microservice

This is the Python-based Machine Learning microservice for the CivicDesk project. It provides REST APIs to analyze, detect duplicates, and predict civic issues.

## Features ✨

-   **Issue Analysis (`/analyze_issue`)**:
    -   Classifies issue type (`garbage`, `pothole`, etc.).
    -   Determines text **sentiment** (`positive`, `negative`).
    -   Determines text **urgency** (`urgent`, `not_urgent`).
    -   Suggests a responsible department via **Smart Auto-Routing**.
-   **Duplicate Detection (`/detect_duplicate`)**:
    -   Finds geographically close reports using **Location Clustering** (DBSCAN).
    -   Verifies visual duplicates using **Image Similarity** (ResNet embeddings).
-   **Hotspot Prediction (`/predict_hotspots`)**:
    -   A placeholder endpoint demonstrating **Predictive Hotspot Analysis**.

## Setup & Running

Setup and running instructions are the same as before.

1.  Create and activate a Python virtual environment.
2.  Install all dependencies: `pip install -r requirements.txt`
3.  Run the service: `uvicorn ml_service:app --reload`

The service will be available at **http://127.0.0.1:8000**. The interactive API documentation at **http://127.0.0.1:8000/docs** is the best place to test the new endpoints.

## API Usage

### 1. Endpoint: `POST /analyze_issue`

Analyzes a single new issue for its category, sentiment, urgency, and suggested department.

**`curl` Example:**
```bash
curl -X POST "[http://127.0.0.1:8000/analyze_issue](http://127.0.0.1:8000/analyze_issue)" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/your/pothole.jpg" \
     -F "description=This is a terrible and dangerous pothole. It needs to be fixed urgently!"
```
**Sample Response:**
```json
{
  "category": "pothole",
  "sentiment": "negative",
  "urgency": "urgent",
  "suggested_department": "Public Works"
}
```

### 2. Endpoint: `POST /detect_duplicate`

Checks a new report against a list of existing unresolved reports to find duplicates.

**`curl` Example:**
```bash
curl -X POST "[http://127.0.0.1:8000/detect_duplicate](http://127.0.0.1:8000/detect_duplicate)" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "new_image=@/path/to/your/new_pothole.jpg" \
     -F "new_location={\"lat\": 12.9716, \"lon\": 77.5946}" \
     -F "existing_reports_json='[{\"report_id\": 101, \"location\": {\"lat\": 12.9715, \"lon\": 77.5945}, \"image_url\": \"[https://i.imgur.com/your-image-url.jpg](https://i.imgur.com/your-image-url.jpg)\"}]'"
```
**Sample Response:**
```json
{
  "location_duplicates": [101],
  "image_duplicates": [
    {
      "report_id": 101,
      "similarity_score": 0.985
    }
  ]
}
```

### 3. Endpoint: `GET /predict_hotspots`

Predicts where issues are likely to occur in the future. **Note: This is a placeholder and returns dummy data.**

**`curl` Example:**
```bash
curl -X GET "[http://127.0.0.1:8000/predict_hotspots?issue_type=pothole](http://127.0.0.1:8000/predict_hotspots?issue_type=pothole)"
```
**Sample Response:**
```json
{
  "message": "This is a placeholder. A real implementation requires historical data.",
  "predicted_hotspots": [
    { "location": {"lat": 12.9716, "lon": 77.5946}, "predicted_issue": "pothole", "risk_score": 0.88 },
    { "location": {"lat": 12.9759, "lon": 77.6393}, "predicted_issue": "pothole", "risk_score": 0.76 }
  ]
}
```
