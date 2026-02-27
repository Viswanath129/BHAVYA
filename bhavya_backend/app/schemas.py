from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None

class User(UserBase):
    id: int
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Mood
class MoodLogCreate(BaseModel):
    score: int
    note: Optional[str] = None

class MoodLog(MoodLogCreate):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Data Ingestion
class DataIngestion(BaseModel):
    data_type: str
    payload: Any

# Insight
class Insight(BaseModel):
    id: int
    text: str
    related_features: Optional[Any] = None
    generated_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard
class DashboardData(BaseModel):
    sleep_data: List[dict]
    activity_data: List[dict]
    activity_data: List[dict]
    interaction_data: List[dict]
    future_risk: Optional[dict] = None

# Journal
class JournalEntryCreate(BaseModel):
    title: Optional[str] = "Untitled"
    mood: Optional[str] = None
    content: str

class JournalEntry(JournalEntryCreate):
    id: int
    user_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Risk
class RiskFactor(BaseModel):
    name: str
    value: int
    percentage: int
    type: str

class RiskData(BaseModel):
    score: int
    label: str
    factors: List[RiskFactor]

# Daily Check-In
class DailyCheckInCreate(BaseModel):
    q_sleep_issue: int
    q_energy: int
    q_interest: int
    q_focus: int
    q_anxiety: int
    q_social: int
    q_routine: int
    q_phone: int
    q_motivation: int
    q_overwhelm: int

class DailyCheckIn(DailyCheckInCreate):
    id: int
    user_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True
