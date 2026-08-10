from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user

from app.schemas.dashboard import DashboardResponse

from app.crud.palm_reading import (
    get_total_readings,
    get_latest_reading,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("", response_model=DashboardResponse)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    latest = get_latest_reading(
        db,
        current_user.id
    )

    return DashboardResponse(
        total_readings=get_total_readings(
            db,
            current_user.id
        ),
        latest_palm_shape=latest.palm_shape if latest else None,
        latest_reading_date=latest.created_at if latest else None,
        member_since=current_user.created_at,
        ai_model="Llama 3.2"
    )