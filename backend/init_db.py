from app.database.connection import engine, Base

# Import ALL models
from app.models.user import User
from app.models.profile import Profile

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Done!")