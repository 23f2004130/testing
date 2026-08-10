from app.models.palm_reading import PalmReading

from sqlalchemy import func

from app.models.palm_reading import PalmReading


def create_reading(
    db,
    user_id,
    original_image,
    processed_image,
    line_image,
    features,
    classification,
    finger_analysis,
    line_analysis,
    interpretation
):

    classification.get("palm_shape", "Unknown")

    reading = PalmReading(
        user_id=user_id,

        palm_shape=classification.get("palm_shape", "Unknown"),

        longest_finger=finger_analysis.get(
    "longest_finger",
    "Unknown"
),

shortest_finger=finger_analysis.get(
    "shortest_finger",
    "Unknown"
),

        original_image=original_image,
        processed_image=processed_image,
        line_image=line_image,

        classification=classification,

        finger_analysis=finger_analysis,

        line_analysis=line_analysis,

        features=features,

        interpretation=interpretation["ai_reading"]
    )

    db.add(reading)

    db.commit()

    db.refresh(reading)

    return reading
def get_user_readings(db, user_id):
    return (
        db.query(PalmReading)
        .filter(PalmReading.user_id == user_id)
        .order_by(PalmReading.created_at.desc())
        .all()
    )


def get_reading_by_id(db, reading_id, user_id):
    return (
        db.query(PalmReading)
        .filter(
            PalmReading.id == reading_id,
            PalmReading.user_id == user_id
        )
        .first()
    )
def get_total_readings(db, user_id):
    return (
        db.query(func.count(PalmReading.id))
        .filter(PalmReading.user_id == user_id)
        .scalar()
    )


def get_latest_reading(db, user_id):
    return (
        db.query(PalmReading)
        .filter(PalmReading.user_id == user_id)
        .order_by(PalmReading.created_at.desc())
        .first()
    )