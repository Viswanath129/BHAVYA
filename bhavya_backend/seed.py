from app.db.base import SessionLocal, engine, Base
from app.db import models
from app.core.security import get_password_hash

# Init DB
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    user = db.query(models.User).filter(models.User.email == "test@example.com").first()
    if not user:
        print("Creating test user...")
        user = models.User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("password123")
        )
        db.add(user)
        db.commit()
        print("User created: testuser / password123")
    else:
        print("Test user already exists.")

if __name__ == "__main__":
    seed()
