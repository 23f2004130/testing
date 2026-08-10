import math
from pyexpat import features


def distance(p1, p2):
    return math.sqrt(
        (p1["x"] - p2["x"]) ** 2 +
        (p1["y"] - p2["y"]) ** 2
    )


def extract_features(landmarks):
    if len(landmarks) != 21:
        return {
        "status": "failed",
        "message": f"Expected 21 landmarks but found {len(landmarks)}."
    }
    features = {}

    # -------------------------
    # Palm Size
    # -------------------------

    wrist = landmarks[0]
    index_base = landmarks[5]
    little_base = landmarks[17]
    middle_base = landmarks[9]
    features["palm_height"] = round(
        distance(wrist, middle_base), 2
)

    features["palm_width"] = round(
        distance(index_base, little_base), 2
    )



    # -------------------------
    # Finger Lengths
    # -------------------------

    fingers = {
        "thumb": (1, 4),
        "index": (5, 8),
        "middle": (9, 12),
        "ring": (13, 16),
        "little": (17, 20)
    }

    for name, (base, tip) in fingers.items():

        features[f"{name}_length"] = round(
            distance(
                landmarks[base],
                landmarks[tip]
            ),
            2
        )

    # -------------------------
    # Ratios
    # -------------------------

    features["index_middle_ratio"] = round(
        features["index_length"] /
        max(features["middle_length"], 1),
        2
    )

    features["ring_middle_ratio"] = round(
        features["ring_length"] /
        max(features["middle_length"], 1),
        2
    )

    features["little_middle_ratio"] = round(
        features["little_length"] /
        max(features["middle_length"], 1),
        2
    )
    # -------------------------
# Palm Aspect Ratio
# -------------------------
    features["palm_aspect_ratio"] = round(
    features["palm_height"] / max(features["palm_width"], 1),
    2
)

    return features