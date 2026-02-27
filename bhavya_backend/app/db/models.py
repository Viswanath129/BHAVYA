from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    mood_logs = relationship("MoodLog", back_populates="user")
    journal_entries = relationship("JournalEntry", back_populates="user")
    behavioral_raw = relationship("BehavioralRaw", back_populates="user")
    behavioral_features = relationship("BehavioralFeatures", back_populates="user")
    model_outputs = relationship("ModelOutput", back_populates="user")
    insights = relationship("Insight", back_populates="user")

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer)  # 1-10
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="mood_logs")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=True)
    mood = Column(String, nullable=True)
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="journal_entries")

class BehavioralRaw(Base):
    __tablename__ = "behavioral_raw"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    data_type = Column(String) # e.g., 'sleep', 'activity', 'keystroke'
    payload = Column(JSON) # Raw data
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="behavioral_raw")

class BehavioralFeatures(Base):
    __tablename__ = "behavioral_features"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True))
    feature_vector = Column(JSON) # Computed features
    
    user = relationship("User", back_populates="behavioral_features")

class ModelOutput(Base):
    __tablename__ = "model_outputs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    model_version = Column(String)
    prediction = Column(JSON)
    confidence = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="model_outputs")

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text)
    related_features = Column(JSON, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)

    user = relationship("User", back_populates="insights")

class DailyCheckIn(Base):
    __tablename__ = "daily_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Clinical Questions (0-3 scale)
    q_sleep_issue = Column(Integer)
    q_energy = Column(Integer)
    q_interest = Column(Integer)
    q_focus = Column(Integer)
    q_anxiety = Column(Integer)
    q_social = Column(Integer)
    q_routine = Column(Integer)
    q_phone = Column(Integer)
    q_motivation = Column(Integer)
    q_overwhelm = Column(Integer)

    user = relationship("User", back_populates="daily_checkins")

# Update User relationship
User.daily_checkins = relationship("DailyCheckIn", back_populates="user")
