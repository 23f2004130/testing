from ultralytics import YOLO
import cv2

MODEL_PATH = "app/models/best.pt"

# Load YOLO model only once
model = YOLO(MODEL_PATH)


def detect_palm(image_path):
    """
    Detect palm using YOLOv8 and return a cropped image
    with sufficient padding for MediaPipe.
    """

    image = cv2.imread(image_path)

    if image is None:
        print("Could not read image.")
        return None

    h, w = image.shape[:2]

    print("Running YOLO detection...")

    results = model.predict(
        source=image,
        conf=0.30,
        verbose=False
    )

    if len(results) == 0:
        print("No YOLO results.")
        return None

    boxes = results[0].boxes

    if boxes is None or len(boxes) == 0:
        print("Palm not detected.")
        return None

    # Highest confidence detection
    box = boxes[0]

    x1, y1, x2, y2 = map(int, box.xyxy[0])

    # -------------------------------
    # Dynamic padding
    # -------------------------------
    box_width = x2 - x1
    box_height = y2 - y1

    padding = int(max(box_width, box_height) * 0.45)

    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(w, x2 + padding)
    y2 = min(h, y2 + padding)

    cropped = image[y1:y2, x1:x2]

    if cropped.size == 0:
        print("Crop failed.")
        return None

    # Save for debugging
    cv2.imwrite("app/uploads/debug_crop.jpg", cropped)

    print("Crop Size:", cropped.shape)

    return cropped