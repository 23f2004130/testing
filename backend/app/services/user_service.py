from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import verify_password, hash_password
from app.models.user import User

def create_user(db: Session, user):
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already registered. Please sign in."
        )

    hashed = hash_password(user.password)

    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user account. Please try again."
        )

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user