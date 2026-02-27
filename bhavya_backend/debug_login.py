from app.db.base import SessionLocal
from app.db import models
from app.core import security, config
from datetime import timedelta

def debug_login():
    print("Starting debug_login...")
    db = SessionLocal()
    username = "newuser"
    password = "password123"

    try:
        print(f"Querying user: {username}")
        user = db.query(models.User).filter(models.User.username == username).first()
        
        if not user:
            print("User not found!")
            return

        print(f"User found: {user.email}")
        print(f"Hashed password in DB: {user.hashed_password}")

        print("Verifying password...")
        is_valid = security.verify_password(password, user.hashed_password)
        print(f"Password valid: {is_valid}")

        if is_valid:
            print("Creating token...")
            access_token_expires = timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = security.create_access_token(
                data={"sub": user.username}, expires_delta=access_token_expires
            )
            print(f"Token created: {access_token[:10]}...")
        else:
            print("Password verification failed.")

    except Exception as e:
        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_login()
