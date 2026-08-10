from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from datetime import datetime

from app.database.connection import Base


class Reading(Base):

    __tablename__ = "readings"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    image = Column(Text)

    processed_image = Column(Text)

    ai_reading = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )