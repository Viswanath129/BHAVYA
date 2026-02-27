from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, auth, ingestion, chat, journal, checkin, insights, affective
from app.core.config import settings
from app.db.base import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite default
    "http://localhost:5174", # Vite fallback
    "http://localhost:3000", # React default
    "http://localhost:3001", # React fallback
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(ingestion.router, prefix=f"{settings.API_V1_STR}/ingestion", tags=["ingestion"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(journal.router, prefix=f"{settings.API_V1_STR}/journal", tags=["journal"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(checkin.router, prefix="/api/checkin", tags=["checkin"])
app.include_router(affective.router, prefix="/api/affective", tags=["affective"]) # New Affective Module

@app.get("/")
def root():
    return {"message": "Welcome to BHAVYA Backend"}
