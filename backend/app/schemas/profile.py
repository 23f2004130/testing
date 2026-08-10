from pydantic import BaseModel

class ProfileCreate(BaseModel):

    age_group:str

    interests:str

    spiritual_goals:str

    reading_preferences:str

    bio:str

    preferred_language:str

class ProfileResponse(ProfileCreate):

    id:int

    user_id:int

    profile_picture:str|None=None

    class Config:

        from_attributes=True