def classify_palm(features):

    palm_width = features["palm_width"]
    palm_height = features["palm_height"]

    # Ignore thumb because it is anatomically different
    avg_finger = (
        features["index_length"] +
        features["middle_length"] +
        features["ring_length"] +
        features["little_length"]
    ) / 4

    palm_ratio = palm_height / max(palm_width, 1)
    finger_ratio = avg_finger / max(palm_height, 1)

    # Palm Type
    if palm_ratio <= 1.10:
        palm_type = "Square"
    else:
        palm_type = "Long"

    # Finger Type
    if finger_ratio <= 0.60:
        finger_type = "Short"
    else:
        finger_type = "Long"

    # Palm Shape
    if palm_ratio >= 1.30 and finger_ratio >= 0.75:
        shape = "Water"

    elif palm_ratio >= 1.20 and finger_ratio < 0.75:
        shape = "Fire"

    elif palm_ratio < 1.20 and finger_ratio >= 0.75:
        shape = "Air"

    else:
        shape = "Earth"

    print("\n========== PALM FEATURES ==========")
    print(f"Palm Width      : {palm_width:.2f}")
    print(f"Palm Height     : {palm_height:.2f}")
    print(f"Average Finger  : {avg_finger:.2f}")
    print(f"Palm Ratio      : {palm_ratio:.2f}")
    print(f"Finger Ratio    : {finger_ratio:.2f}")
    print(f"Palm Type       : {palm_type}")
    print(f"Finger Type     : {finger_type}")
    print(f"Palm Shape      : {shape}")
    print("===================================\n")

    return {
        "palm_shape": shape,
        "palm_ratio": round(palm_ratio, 2),
        "finger_ratio": round(finger_ratio, 2),
        "palm_type": palm_type,
        "finger_type": finger_type
    }