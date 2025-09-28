import json
import torch
import numpy as np
import torchvision.transforms as transforms
import httpx
import io
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from PIL import Image
from pydantic import BaseModel
from sklearn.cluster import DBSCAN
from torchvision.models import mobilenet_v2, resnet18, MobileNet_V2_Weights, ResNet18_Weights
from transformers import pipeline
from typing import Dict, Any

# --- 1. Initialize FastAPI App ---
app = FastAPI(
    title="CivicDesk Advanced ML Service",
    description="Analyzes civic issues with classification, sentiment, routing, duplicate detection, and hotspot prediction.",
    version="2.0.0"
)

print("🚀 Starting model loading process...")

# --- 2. Load Models on Startup ---

# CV Model (Image Classification) - For identifying the issue type
try:
    classification_model = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
    classification_model.eval()
    CLASS_NAMES = ['garbage', 'pothole', 'broken_streetlight']
    print("✅ CV Classification model (MobileNetV2) loaded.")
except Exception as model_error:
    print(f"❌ Error loading CV Classification model: {model_error}")
    classification_model = None

# CV Model (Image Similarity) - For creating embeddings to detect duplicates
try:
    similarity_model = resnet18(weights=ResNet18_Weights.DEFAULT)
    # Remove the final classification layer to get feature embeddings
    similarity_model = torch.nn.Sequential(*(list(similarity_model.children())[:-1]))
    similarity_model.eval()
    print("✅ CV Similarity model (ResNet18) loaded.")
except Exception as model_error:
    print(f"❌ Error loading CV Similarity model: {model_error}")
    similarity_model = None

# NLP Model (Zero-Shot Classification) - For text analysis tasks
try:
    nlp_pipeline = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    URGENCY_LABELS = ['urgent', 'not_urgent']
    SENTIMENT_LABELS = ['positive', 'negative', 'neutral']
    DEPARTMENT_LABELS = ['Public Works', 'Sanitation Dept', 'Traffic Dept', 'Water Dept']
    print("✅ NLP Zero-Shot model (BART) loaded.")
except Exception as nlp_error:
    print(f"❌ Error loading NLP model: {nlp_error}")
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


# --- 4. Helper Functions ---

def preprocess_image(image: Image.Image, target_size=224) -> torch.Tensor:
    """Preprocess a PIL image for CV models."""
    transform = transforms.Compose([
        transforms.Resize(target_size + 32),
        transforms.CenterCrop(target_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)


async def download_image(url: str) -> Image.Image:
    """Asynchronously download an image from a URL."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url, follow_redirects=True)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")


def get_image_embedding(image: Image.Image) -> torch.Tensor:
    """Generate a feature vector (embedding) for an image."""
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
    Comprehensive analysis of a new civic issue report:
    - CV: Classify issue type (pothole, garbage, etc.).
    - NLP: Determine sentiment, urgency, and responsible department.
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
    urgency_result: Dict[str, Any] = nlp_pipeline(description, candidate_labels=URGENCY_LABELS)
    sentiment_result: Dict[str, Any] = nlp_pipeline(description, candidate_labels=SENTIMENT_LABELS)
    routing_result: Dict[str, Any] = nlp_pipeline(description, candidate_labels=DEPARTMENT_LABELS)

    return {
        "category": predicted_category,
        "sentiment": sentiment_result['labels'][0],
        "urgency": urgency_result['labels'][0],
        "suggested_department": routing_result['labels'][0]
    }


@app.post("/detect_duplicate", summary="Detects duplicates via location and image")
async def detect_duplicate(
        new_image: UploadFile = File(..., description="Image of the new report."),
        new_location: str = Form(..., description='JSON: {"lat": 12.97, "lon": 77.59}'),
        existing_reports_json: str = Form(..., description='JSON: [{"report_id":1, ...}]')
):
    """
    Detect duplicate reports based on:
    - **Location clustering** using DBSCAN.
    - **Image similarity** using ResNet embeddings.
    """
    new_loc = Location(**json.loads(new_location))
    existing_reports = [ExistingReport(**r) for r in json.loads(existing_reports_json)]

    if not existing_reports:
        return {"location_duplicates": [], "image_duplicates": []}

    # --- Location Clustering ---
    locations = np.array([[r.location.lat, r.location.lon] for r in existing_reports] + [[new_loc.lat, new_loc.lon]])

    # <-- FIX: Separated instantiation and fitting for clarity and to help the IDE -->
    clustering_model = DBSCAN(eps=0.0005, min_samples=2)
    clustering_model.fit(locations)
    new_cluster_label = clustering_model.labels_[-1]

    location_duplicates = [
        existing_reports[i].report_id for i, label in enumerate(clustering_model.labels_[:-1]) if
        label == new_cluster_label
    ] if new_cluster_label != -1 else []

    # --- Image Similarity ---
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
                    if similarity > 0.95:  # Threshold for duplicates
                        image_duplicates.append({
                            "report_id": report.report_id,
                            "similarity_score": round(similarity, 3)
                        })
                except Exception as img_error:
                    print(f"Could not process image for report {report.report_id}: {img_error}")

    return {
        "location_duplicates": location_duplicates,
        "image_duplicates": image_duplicates
    }


@app.get("/predict_hotspots", summary="Predicts future issue hotspots (Placeholder)")
async def predict_hotspots(issue_type: str = "pothole"):
    """
    Placeholder endpoint for predicting future civic issue hotspots.
    A real implementation would require historical data and advanced ML models.
    """
    dummy_hotspots = [
        {"location": {"lat": 12.9716, "lon": 77.5946}, "predicted_issue": issue_type, "risk_score": 0.88},
        {"location": {"lat": 12.9759, "lon": 77.6393}, "predicted_issue": issue_type, "risk_score": 0.76},
        {"location": {"lat": 12.9345, "lon": 77.6264}, "predicted_issue": issue_type, "risk_score": 0.65},
    ]
    return {
        "message": "This is a placeholder. A real implementation requires historical data.",
        "predicted_hotspots": dummy_hotspots
    }