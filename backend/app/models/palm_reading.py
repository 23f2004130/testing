from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    JSON,
    Text
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.connection import Base

class PalmReading(Base):

    __tablename__ = "palm_readings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    palm_shape = Column(String)
    longest_finger = Column(String)
    shortest_finger = Column(String)
    original_image = Column(String)
    processed_image = Column(String)
    line_image = Column(String)
    classification = Column(JSON)
    finger_analysis = Column(JSON)
    line_analysis = Column(JSON)
    features = Column(JSON)
    interpretation = Column(Text)
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now())

    user = relationship(
    "User",
    back_populates="history"
)