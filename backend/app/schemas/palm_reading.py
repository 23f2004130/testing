from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any


class PalmReadingResponse(BaseModel):

    id: int

    palm_shape: str

    longest_finger: str

    shortest_finger: str

    original_image: str

    processed_image: str

    line_image: str

    classification: Dict[str, Any]

    finger_analysis: Dict[str, Any]

    line_analysis: Dict[str, Any]

    features: Dict[str, Any]

    interpretation: str

    created_at: datetime

    class Config:
        from_attributes = True