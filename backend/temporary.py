from app.ai.yolo_detector import detect_palm

crop, bbox = detect_palm("app/uploads/hand.jpg")

print(bbox)

if crop is not None:
    import cv2
    cv2.imwrite("app/uploads/cropped_hand.jpg", crop)