from sqlalchemy.orm import Session
from app.core.security import verify_password


from app.models.user import User
from app.core.security import hash_password

def create_user(db: Session, user):

    hashed = hash_password(user.password)

    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed
    )

    db.add(db_user)

    db.commit()

    db.refresh(db_user)

    return db_user
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