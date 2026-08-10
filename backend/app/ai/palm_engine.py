import cv2
import mediapipe as mp

from app.ai.yolo_detector import detect_palm
from app.utils.image_processing import preprocess_image
from app.ai.feature_extractor import extract_features
from app.ai.finger_analyzer import analyze_fingers
from app.ai.line_detector import detect_palm_lines
from app.ai.line_classifier import classify_lines
from app.ai.palm_classifier import classify_palm
from app.ai.interpretation_engine import generate_interpretation
from app.ai.life_trend_engine import generate_life_trends

BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

MODEL_PATH = "app/models/hand_landmarker.task"


def process_palm(image_path):

    # -----------------------------
    # Step 1 : Run YOLO Detection
    # -----------------------------
    # This is used to verify palm detection and save debug_crop.jpg
    detect_palm(image_path)

    # -----------------------------
    # Step 2 : Read ORIGINAL image
    # -----------------------------
    original = cv2.imread(image_path)

    if original is None:
        raise Exception("Unable to read image.")

    # -----------------------------
    # Step 3 : Preprocess ORIGINAL image
    # -----------------------------
    image = preprocess_image(original)
    mp_image = mp.Image(
        image_format=mp.ImageFormat.SRGB,
        data=image
    )

    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=MODEL_PATH),
        running_mode=VisionRunningMode.IMAGE,
        num_hands=1
    )

    with HandLandmarker.create_from_options(options) as landmarker:

        result = landmarker.detect(mp_image)

    if len(result.hand_landmarks) == 0:
        raise Exception("No hand landmarks detected.")

    hand = result.hand_landmarks[0]

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
    from app.ai.recommendation_engine import generate_recommendations
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