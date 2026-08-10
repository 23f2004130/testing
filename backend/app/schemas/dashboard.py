from pydantic import BaseModel
from datetime import datetime


class DashboardResponse(BaseModel):
    total_readings: int
    latest_palm_shape: str | None
    latest_reading_date: datetime | None
    member_since: datetime
    ai_model: str