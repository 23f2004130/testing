from app.models.profile import Profile


def create_profile(db, profile, user_id):

    # Check if profile already exists
    existing = db.query(Profile).filter(
        Profile.user_id == user_id
    ).first()

    if existing:
        return {
            "success": False,
            "message": "Profile already exists"
        }

    db_profile = Profile(
        user_id=user_id,
        age_group=profile.age_group,
        interests=profile.interests,
        spiritual_goals=profile.spiritual_goals,
        reading_preferences=profile.reading_preferences,
        bio=profile.bio,
        preferred_language=profile.preferred_language,
    )
    

    
    existing=db.query(Profile).filter(
    Profile.user_id==user_id
).first()

    if existing:
        return {

        "success":False,

        "message":"Profile already exists"

    }
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)

    return {
        "success": True,
        "message": "Profile created successfully",
        "data": db_profile
    }
def update_profile(db, profile, user_id):
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if not db_profile:
        return {"message": "Profile not found"}

    #  Step 5: Clean update approach
    profile_data = profile.model_dump()  # converts Pydantic model to dict
    for key, value in profile_data.items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)

    return db_profile
