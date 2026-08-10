from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.database.connection import get_db
from app.schemas.profile import ProfileCreate
from app.services.profile_service import create_profile
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.post("/")
def create_user_profile(

    profile: ProfileCreate,

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user),
):

    return create_profile(

        db,

        profile,

        current_user.id,
    )
@router.get("/")
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        return {"message": "Profile not found"}

    return profile
@router.put("/")
def update_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db_profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not db_profile:
        return {"message": "Profile not found"}

    db_profile.age_group = profile.age_group
    db_profile.interests = profile.interests
    db_profile.spiritual_goals = profile.spiritual_goals
    db_profile.reading_preferences = profile.reading_preferences
    db_profile.bio = profile.bio

    db.commit()
    db.refresh(db_profile)

    return db_profile