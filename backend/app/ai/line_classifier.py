import cv2
import numpy as np


def classify_lines(line_image, landmarks):

    h, w = line_image.shape

    heart = line_image[: int(h * 0.35), :]
    head = line_image[int(h * 0.35): int(h * 0.60), :]
    life = line_image[int(h * 0.45):, : int(w * 0.60)]

    def analyse(region):

        pixels = cv2.countNonZero(region)

        area = region.shape[0] * region.shape[1]

        density = pixels / area

        if density > 0.20:
            status = "Strong"

        elif density > 0.08:
            status = "Moderate"

        elif density > 0.02:
            status = "Weak"

        else:
            status = "Not Visible"

        return {
            "status": status,
            "density": round(density, 3)
        }

    return {

        "heart_line": analyse(heart),

        "head_line": analyse(head),

        "life_line": analyse(life),

        "fate_line": {
            "status": "Coming Soon"
        }

    }