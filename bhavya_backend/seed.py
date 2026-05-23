from app.db.base import SessionLocal, engine, Base
from app.db import models
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Init DB
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    user = db.query(models.User).filter(models.User.email == "test@example.com").first()
    if not user:
        logger.info("Creating test user...")
        user = models.User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("password123")
        )
        db.add(user)
        db.commit()
        logger.info("User created: testuser / password123")
    else:
        logger.info("Test user already exists.")

if __name__ == "__main__":
    seed()
