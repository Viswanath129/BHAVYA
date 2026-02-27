from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "BHAVYA Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE"  # In production, get from env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "bhavya"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.SQLALCHEMY_DATABASE_URI:
            # Fallback to SQLite if no Postgres URI is provided or configured
            # self.SQLALCHEMY_DATABASE_URI = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
            self.SQLALCHEMY_DATABASE_URI = "sqlite:///./sql_app.db"

    class Config:
        case_sensitive = True

settings = Settings()
