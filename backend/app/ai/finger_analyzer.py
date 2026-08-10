import math


def distance(p1, p2):
    return math.sqrt(
        (p1["x"] - p2["x"]) ** 2 +
        (p1["y"] - p2["y"]) ** 2
    )


def finger_length(landmarks, joints):
    length = 0

    for i in range(len(joints) - 1):
        length += distance(
            landmarks[joints[i]],
            landmarks[joints[i + 1]]
        )

    return round(length, 2)


def analyze_fingers(landmarks):

    fingers = {
        "thumb": [2,3, 4],
        "index": [5, 6, 7, 8],
        "middle": [9, 10, 11, 12],
        "ring": [13, 14, 15, 16],
        "little": [17, 18, 19, 20]
    }

    analysis = {}

    lengths = {}

    for name, joints in fingers.items():

        lengths[name] = finger_length(
            landmarks,
            joints
        )

    analysis["lengths"] = lengths

    analysis["longest_finger"] = max(
        lengths,
        key=lengths.get
    )

    analysis["shortest_finger"] = min(
        lengths,
        key=lengths.get
    )

    # Distance between fingertips
    tips = [4, 8, 12, 16, 20]

    spreads = []

    for i in range(len(tips) - 1):

        spreads.append(
            round(
                distance(
                    landmarks[tips[i]],
                    landmarks[tips[i + 1]]
                ),
                2
            )
        )

    analysis["finger_spread"] = spreads

    return analysis