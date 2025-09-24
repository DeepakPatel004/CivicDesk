# civicdesk.py
# ml_service.py

import io
import random
from typing import List

import torch
import torchvision.transforms as T
import httpx
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from PIL import Image
from pydantic import BaseModel
from sklearn.cluster import DBSCAN
from torchvision.models import mobilenet_v2, resnet18
from transformers import pipeline
import numpy as np

# --- 1. Initialize FastAPI App ---
app = FastAPI(
    title="CivicDesk Advanced ML Service",
    description="Analyzes civic issues with classification, sentiment, routing, duplicate detection, and hotspot prediction.",
    version="2.0.0"
)

# --- 2. Load Models on Startup ---
print("🚀 Starting model loading process...")

# CV Model (Image Classification) - For identifying the issue type
try:
    classification_model = mobilenet_v2(weights='MobileNet_V2_Weights.DEFAULT')
    classification_model.eval()
    CLASS_NAMES = ['garbage', 'pothole', 'broken_streetlight']
    print("✅ CV Classification model (MobileNetV2) loaded.")
except Exception as e:
    print(f"❌ Error loading CV Classification model: {e}")
    classification_model = None

# CV Model (Image Similarity) - For creating embeddings to detect duplicates
try:
    similarity_model = resnet18(weights='ResNet18_Weights.DEFAULT')
    # Remove the final classification layer to get feature embeddings
    similarity_model = torch.nn.Sequential(*(list(similarity_model.children())[:-1]))
    similarity_model.eval()
    print("✅ CV Similarity model (ResNet18) loaded.")
except Exception as e:
    print(f"❌ Error loading CV Similarity model: {e}")
    similarity_model = None

# NLP Model (Zero-Shot Classification) - For multiple text analysis tasks
try:
    nlp_pipeline = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    URGENCY_LABELS = ['urgent', 'not_urgent']
    SENTIMENT_LABELS = ['positive', 'negative', 'neutral']
    DEPARTMENT_LABELS = ['Public Works', 'Sanitation Dept', 'Traffic Dept', 'Water Dept']
    print("✅ NLP Zero-Shot model (BART) loaded.")
except Exception as e:
    print(f"❌ Error loading NLP model: {e}")
    nlp_pipeline = None

print("✨ Model loading complete.")


# --- 3. Pydantic Models for Data Validation ---
class Location(BaseModel):
    lat: float
    lon: float


class ExistingReport(BaseModel):
    report_id: int
    location: Location
    image_url: str


# --- 4. Preprocessing and Helper Functions ---

def preprocess_image(image: Image.Image, target_size=224) -> torch.Tensor:
    """Preprocesses a PIL image for a CV model."""
    transform = T.Compose([
        T.Resize(target_size + 32),
        T.CenterCrop(target_size),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)


async def download_image(url: str) -> Image.Image:
    """Asynchronously downloads an image from a URL."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url, follow_redirects=True)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")


def get_image_embedding(image: Image.Image) -> torch.Tensor:
    """Generates a feature vector (embedding) for an image."""
    if not similarity_model:
        raise HTTPException(status_code=503, detail="Image similarity model is not available.")
    image_tensor = preprocess_image(image)
    with torch.no_grad():
        embedding = similarity_model(image_tensor)
        return embedding.flatten()


# --- 5. API Endpoints ---

@app.post("/analyze_issue", summary="Analyzes a single new issue")
async def analyze_issue(
        file: UploadFile = File(..., description="Image of the civic issue."),
        description: str = Form(..., description="Text description of the issue.")
):
    """
    Performs a comprehensive analysis on a newly reported issue.
    - **CV**: Classifies the issue type (pothole, garbage, etc.).
    - **NLP**: Determines sentiment, urgency, and suggests a responsible department.
    """
    if not classification_model or not nlp_pipeline:
        raise HTTPException(status_code=503, detail="ML models are not available.")

    # --- Image Analysis ---
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_tensor = preprocess_image(image)
    with torch.no_grad():
        outputs = classification_model(image_tensor)
        top_cat_id = torch.argmax(outputs, dim=1).item()
        predicted_category = CLASS_NAMES[top_cat_id % len(CLASS_NAMES)]

    # --- NLP Analysis ---
    urgency_result = nlp_pipeline(description, candidate_labels=URGENCY_LABELS)
    sentiment_result = nlp_pipeline(description, candidate_labels=SENTIMENT_LABELS)
    routing_result = nlp_pipeline(description, candidate_labels=DEPARTMENT_LABELS)

    return {
        "category": predicted_category,
        "sentiment": sentiment_result['labels'][0],
        "urgency": urgency_result['labels'][0],
        "suggested_department": routing_result['labels'][0]
    }


@app.post("/detect_duplicate", summary="Detects duplicates via location and image")
async def detect_duplicate(
        new_image: UploadFile = File(..., description="Image of the new report."),
        new_location: str = Form(...,
                                 description="JSON string for the new report's location, e.g., '{\"lat\": 12.97, \"lon\": 77.59}'"),
        existing_reports_json: str = Form(...,
                                          description="JSON string of existing reports, e.g., '[{\"report_id\": 1, ...}]'")
):
    """
    Detects if a new report is a duplicate of existing ones.
    - **Location Clustering**: Uses DBSCAN to find reports that are geographically close.
    - **Image Similarity**: Uses a ResNet model to compare image content for clustered reports.
    """
    import json
    new_loc = Location(**json.loads(new_location))
    existing_reports = [ExistingReport(**r) for r in json.loads(existing_reports_json)]

    if not existing_reports:
        return {"location_duplicates": [], "image_duplicates": []}

    # --- Location Clustering ---
    locations = np.array([[r.location.lat, r.location.lon] for r in existing_reports] + [[new_loc.lat, new_loc.lon]])
    # eps is the max distance (in degrees). ~0.0005 degrees is approx 55 meters. This needs tuning.
    clustering = DBSCAN(eps=0.0005, min_samples=2).fit(locations)
    new_report_cluster_label = clustering.labels_[-1]

    location_duplicates = []
    if new_report_cluster_label != -1:  # -1 means it's noise (not in a cluster)
        for i, label in enumerate(clustering.labels_[:-1]):
            if label == new_report_cluster_label:
                location_duplicates.append(existing_reports[i].report_id)

    # --- Image Similarity (only on location-based candidates) ---
    image_duplicates = []
    if location_duplicates:
        new_img_contents = await new_image.read()
        new_pil_image = Image.open(io.BytesIO(new_img_contents)).convert("RGB")
        new_embedding = get_image_embedding(new_pil_image)

        for report in existing_reports:
            if report.report_id in location_duplicates:
                try:
                    existing_pil_image = await download_image(report.image_url)
                    existing_embedding = get_image_embedding(existing_pil_image)

                    similarity = torch.nn.functional.cosine_similarity(new_embedding, existing_embedding, dim=0).item()

                    # Threshold for considering images as duplicates. This needs tuning.
                    if similarity > 0.95:
                        image_duplicates.append(
                            {"report_id": report.report_id, "similarity_score": round(similarity, 3)})
                except Exception as e:
                    print(f"Could not process image for report {report.report_id}: {e}")

    return {
        "location_duplicates": location_duplicates,
        "image_duplicates": image_duplicates
    }


@app.get("/predict_hotspots", summary="Predicts future issue hotspots (Placeholder)")
async def predict_hotspots(issue_type: str = "pothole"):
    """
    **Placeholder Endpoint**

    Predicts geographical hotspots where civic issues are likely to occur.

    A real implementation of this endpoint would require a large historical dataset of
    issue reports (type, location, timestamp). It could then use algorithms like:
    - **Kernel Density Estimation**: To find areas with high historical density of reports.
    - **Predictive Modeling**: A model trained on features like weather data, road material,
      traffic volume, and age of infrastructure to forecast future problem areas.
    """
    # Returning dummy data as a placeholder
    dummy_hotspots = [
        {"location": {"lat": 12.9716, "lon": 77.5946}, "predicted_issue": issue_type, "risk_score": 0.88},
        {"location": {"lat": 12.9759, "lon": 77.6393}, "predicted_issue": issue_type, "risk_score": 0.76},
        {"location": {"lat": 12.9345, "lon": 77.6264}, "predicted_issue": issue_type, "risk_score": 0.65},
    ]
    return {
        "message": "This is a placeholder. A real implementation requires historical data.",
        "predicted_hotspots": dummy_hotspots
    }