from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.crud.palm_reading import get_reading_by_id
from app.utils.report_generator import generate_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{reading_id}")
def download_report(
    reading_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print("Requested Reading ID:", reading_id)

    reading = get_reading_by_id(
        db,
        reading_id,
        current_user.id
    )

    print("Reading:", reading)

    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found")

    pdf_path = generate_report(reading)

    print("PDF Path:", pdf_path)
    print("Exists:", os.path.exists(pdf_path))

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"Palm_Report_{reading.id}.pdf"
    )