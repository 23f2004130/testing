from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base


class PalmHistory(Base):
    __tablename__ = "palm_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    original_image = Column(String(255))

    processed_image = Column(String(255))

    line_image = Column(String(255))

    palm_shape = Column(String(50))

    interpretation = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")