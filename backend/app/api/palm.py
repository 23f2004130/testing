from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
import cv2
import traceback
from typing import List
from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.ai.palm_engine import process_palm
from app.models.reading import Reading
from app.crud.palm_reading import create_reading
from app.schemas.palm_reading import PalmReadingResponse
from app.core.dependencies import (
    get_current_user
)
from app.crud.palm_reading import (
    create_reading,
    get_user_readings,
    get_reading_by_id
)

router = APIRouter(
    prefix="/palm",
    tags=["Palm Analysis"]
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_palm_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        # -------------------------
        # Save uploaded image
        # -------------------------
        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # -------------------------
        # Process Palm
        # -------------------------
        (
    processed,
    line_image,
    landmarks,
    features,
    classification,
    finger_analysis,
    line_analysis,
    interpretation,
    recommendations,
    life_trends
) = process_palm(file_path)
        # -------------------------
        # Save processed image
        # -------------------------
        processed_filename = f"processed_{file.filename}"
        processed_path = os.path.join(
            UPLOAD_FOLDER,
            processed_filename
)

        success = cv2.imwrite(processed_path, processed)
        print("Processed Path:", processed_path)
        print("Exists:", os.path.exists(processed_path))
        print("Processed image saved:", success)
        print("Processed path:", processed_path)

        # -------------------------
        # Save line image
        # -------------------------
        line_filename = "detected_lines.jpg"

        line_path = os.path.join(
            UPLOAD_FOLDER,
            line_filename
        )

        success = cv2.imwrite(line_path, line_image)
        print("Line image saved:", success)
        print("Line Path:", line_path)
        print("Exists:", os.path.exists(line_path))
        print("========== DEBUG ==========")
        print("Classification:", classification)
        print(type(classification))

        print("Finger Analysis:", finger_analysis)
        print(type(finger_analysis))

        print("Line Analysis:", line_analysis)
        print(type(line_analysis))

        print("Features:", features)
        print(type(features))
        print("Interpretation:", interpretation)
        print(type(interpretation))
        print("===========================")
        # Save reading to database
        reading = create_reading(
    db=db,
    user_id=current_user.id,
    original_image=file.filename,
    processed_image=processed_filename,
    line_image=line_filename,
    features=features,
    classification=classification,
    finger_analysis=finger_analysis,
    line_analysis=line_analysis,
    interpretation=interpretation
)
        print("Reading ID:", reading.id)
        return {

    "message": "Palm image processed successfully",

    "reading_id": reading.id,

    "original_image": file.filename,

    "processed_image": processed_filename,

    "line_image": line_filename,

    "landmarks_detected": len(landmarks),

    "features": features,

    "classification": classification,

    "finger_analysis": finger_analysis,

    "line_analysis": line_analysis,

    "interpretation": interpretation,

    "recommendations": recommendations,

    "life_trends": life_trends,

    "landmarks": landmarks
}


    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get(
    "/history",
    response_model=List[PalmReadingResponse]
)
def reading_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_user_readings(
        db,
        current_user.id
    )


@router.get(
    "/history/{reading_id}",
    response_model=PalmReadingResponse
)
def reading_details(
    reading_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    reading = get_reading_by_id(
        db,
        reading_id,
        current_user.id
    )

    if not reading:
        raise HTTPException(
            status_code=404,
            detail="Reading not found"
        )

    return reading