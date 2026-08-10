from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "Welcome to Palmistry & Tarot Intelligence Platform"
    }


@router.get("/health")
def health():
    return {
        "status": "Server is Running"
    }


@router.get("/about")
def about():
    return {
        "project": "Palmistry & Tarot Intelligence Platform",
        "backend": "FastAPI",
        "database": "PostgreSQL",
        "frontend": "React"
    }