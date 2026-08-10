from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import relationship
from app.database.connection import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(30), default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship with PalmReading
    history = relationship(
        "PalmReading",
        back_populates="user",
        cascade="all, delete-orphan"
    )
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
