import cv2
import mediapipe as mp
import numpy as np

from app.utils.image_processing import preprocess_image
from app.ai.feature_extractor import extract_features
from app.ai.finger_analyzer import analyze_fingers
from app.ai.line_detector import detect_palm_lines
from app.ai.line_classifier import classify_lines
from app.ai.palm_classifier import classify_palm
from app.ai.interpretation_engine import generate_interpretation
from app.ai.life_trend_engine import generate_life_trends
from app.ai.recommendation_engine import generate_recommendations

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

MODEL_PATH = "app/models/hand_landmarker.task"

_landmarker = None

def get_landmarker():
    global _landmarker
    if _landmarker is None:
        options = HandLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=VisionRunningMode.IMAGE,
            num_hands=1,
            min_hand_detection_confidence=0.08,
            min_hand_presence_confidence=0.08
        )
        _landmarker = HandLandmarker.create_from_options(options)
    return _landmarker


def process_palm(image_path):
    # -----------------------------
    # Step 1 : Read & Downscale ORIGINAL image to prevent RAM spikes
    # -----------------------------
    original = cv2.imread(image_path)

    if original is None:
        raise Exception("Unable to read image.")

    # Downscale large mobile camera photos (e.g. 4000x3000 -> max 1024) to save RAM and run in 0.05s
    h_orig, w_orig = original.shape[:2]
    max_dim = max(h_orig, w_orig)
    if max_dim > 1024:
        scale = 1024.0 / max_dim
        new_w, new_h = int(w_orig * scale), int(h_orig * scale)
        original = cv2.resize(original, (new_w, new_h), interpolation=cv2.INTER_AREA)

    # -----------------------------
    # Step 2 : Preprocess ORIGINAL image
    # -----------------------------
    image = preprocess_image(original)
    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=image
    )

    landmarker = get_landmarker()
    result = landmarker.detect(mp_image)
    detected_hand = result.hand_landmarks[0] if len(result.hand_landmarks) > 0 else None

    # Fallback to unscaled RGB if preprocessed 640x640 stretch lost landmarks
    if detected_hand is None:
        orig_rgb = cv2.cvtColor(original, cv2.COLOR_BGR2RGB)
        mp_orig = mp.Image(image_format=mp.ImageFormat.SRGB, data=orig_rgb)
        result_orig = landmarker.detect(mp_orig)
        if len(result_orig.hand_landmarks) > 0:
            detected_hand = result_orig.hand_landmarks[0]

    if detected_hand is None:
        raise Exception("No hand landmarks detected. Please ensure your entire hand including palm, wrist, and all fingers is clearly visible in good lighting.")

    hand = detected_hand

    h, w, _ = image.shape

    landmark_data = []

    for lm in hand:
        landmark_data.append({
            "x": lm.x * w,
            "y": lm.y * h,
            "z": lm.z
        })

    # -----------------------------
    # Draw landmarks
    # -----------------------------
    processed = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    for lm in landmark_data:
        cv2.circle(
            processed,
            (int(lm["x"]), int(lm["y"])),
            4,
            (0, 255, 0),
            -1
        )

    # -----------------------------
    # Feature Extraction
    # -----------------------------
    features = extract_features(landmark_data)

    # -----------------------------
    # Palm Classification
    # -----------------------------
    classification = classify_palm(features)

    # -----------------------------
    # Finger Analysis
    # -----------------------------
    finger_analysis = analyze_fingers(landmark_data)

    # -----------------------------
    # Detect Palm Lines
    # -----------------------------
    line_image = detect_palm_lines(processed)

    # -----------------------------
    # Classify Palm Lines
    # -----------------------------
    line_analysis = classify_lines(
        line_image,
        landmark_data
    )

    # -----------------------------
    # Final Interpretation
    # -----------------------------
    interpretation = generate_interpretation(
        classification,
        finger_analysis,
        line_analysis
    )
    recommendations = generate_recommendations(
        classification,
        finger_analysis,
        line_analysis
    )
    life_trends = generate_life_trends(
        classification,
        line_analysis
    )

    return (
        processed,
        line_image,
        landmark_data,
        features,
        classification,
        finger_analysis,
        line_analysis,
        interpretation,
        recommendations,
        life_trends
    )