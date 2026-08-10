import cv2
import numpy as np

def preprocess_image(image_input):
    """
    Accepts either:
    1. Image file path (str)
    2. OpenCV image (NumPy array)
    """

    # If input is a file path
    if isinstance(image_input, str):
        image = cv2.imread(image_input)

        if image is None:
            raise ValueError(f"Could not read image: {image_input}")

    # If input is already an image
    elif isinstance(image_input, np.ndarray):
        image = image_input

    else:
        raise ValueError("Unsupported image input.")

    # Resize
    image = cv2.resize(image, (640, 640))

    # Convert BGR → RGB
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    return rgb