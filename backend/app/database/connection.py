from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

Base = declarative_base()

def get_engine():
    db_url = os.getenv("DATABASE_URL")
    # If unconfigured, empty, or pointing to unreachable local postgres
    if not db_url or "localhost:5432" in db_url or "127.0.0.1:5432" in db_url:
        sqlite_path = "/tmp/palmistry_tarot.db" if os.path.exists("/tmp") else os.path.join(os.path.dirname(__file__), "..", "..", "palmistry_tarot.db")
        return create_engine(f"sqlite:///{sqlite_path}", connect_args={"check_same_thread": False})

    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    try:
        eng = create_engine(db_url, pool_pre_ping=True)
        with eng.connect() as conn:
            pass
        return eng
    except Exception:
        sqlite_path = "/tmp/palmistry_tarot.db" if os.path.exists("/tmp") else os.path.join(os.path.dirname(__file__), "..", "..", "palmistry_tarot.db")
        return create_engine(f"sqlite:///{sqlite_path}", connect_args={"check_same_thread": False})

engine = get_engine()

# Import models to ensure they are registered with Base metadata
from app.models.user import User
from app.models.reading import Reading
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()