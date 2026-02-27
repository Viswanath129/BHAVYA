from app.db.base import SessionLocal, engine
from app.db import models
from sqlalchemy import text

def debug_db():
    print("Testing DB Connection...")
    try:
        db = SessionLocal()
        # Try raw query to check tables
        result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = [row[0] for row in result]
        print(f"Tables found: {tables}")
        
        if "users" not in tables:
            print("ERROR: 'users' table missing!")
        else:
            print("'users' table exists.")
            # Check user
            user = db.query(models.User).filter(models.User.username == "testuser").first()
            if user:
                print(f"User 'testuser' found: {user.email}")
            else:
                print("User 'testuser' NOT found.")
        
        if "daily_checkins" not in tables:
            print("ERROR: 'daily_checkins' table missing!")
        else:
            print("'daily_checkins' table exists.")

    except Exception as e:
        print(f"DB Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_db()
