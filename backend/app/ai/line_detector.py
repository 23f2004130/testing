import cv2
import numpy as np


def detect_palm_lines(image):

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Improve local contrast
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    # Smooth noise
    blur = cv2.GaussianBlur(
        enhanced,
        (5, 5),
        0
    )

    # Adaptive threshold
    binary = cv2.adaptiveThreshold(
        blur,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        21,
        8
    )

    # Remove tiny dots
    kernel = np.ones((3, 3), np.uint8)

    cleaned = cv2.morphologyEx(
        binary,
        cv2.MORPH_OPEN,
        kernel
    )

    return cleaned