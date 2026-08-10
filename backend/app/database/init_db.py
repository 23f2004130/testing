from app.database.connection import engine, Base
from app.models.profile import Profile
from app.models.user import User
from app.models.palm_reading import PalmReading

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")