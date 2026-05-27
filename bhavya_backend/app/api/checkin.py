from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date
import logging
from app.api import deps
from app.db import models
from app import schemas
from services.affective_engine.temporal_model import EEVTemporalModel
from services.affective_engine.npu_interface import NPUInterface

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize Engines at module level
npu_engine = NPUInterface()
temporal_model = EEVTemporalModel()
temporal_model.eval()

@router.post("/", response_model=schemas.DailyCheckIn)
def create_checkin(
    checkin: schemas.DailyCheckInCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Check if already checked in today
    today = date.today()
    existing = db.query(models.DailyCheckIn).filter(
        models.DailyCheckIn.user_id == current_user.id,
        func.date(models.DailyCheckIn.timestamp) == today
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already checked in today."
        )

    db_checkin = models.DailyCheckIn(
        user_id=current_user.id,
        **checkin.model_dump()
    )
    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)
    
    # --- ADVANCED AFFECTIVE ALGO INTEGRATION ---
    # 1. Map to EEV Vector
    answers = [
        checkin.q_sleep_issue, checkin.q_energy, checkin.q_interest, 
        checkin.q_focus, checkin.q_anxiety, checkin.q_social, 
        checkin.q_routine, checkin.q_phone, checkin.q_motivation, 
        checkin.q_overwhelm
    ]
    base_vector = npu_engine.process_question_answers(answers)

    # 2. Run Centralized Affective Analysis
    analysis_results = temporal_model.predict_from_vector(base_vector)
    detected_pattern = analysis_results["pattern"]
    risk_score = analysis_results["risk_score"]
    
    logger.info(f"User {current_user.id} Affective Analysis: {detected_pattern} (Risk: {risk_score:.2f})")
    
    # Save as Insight
    new_insight = models.Insight(
        user_id=current_user.id,
        text=f"Affective Analysis: {detected_pattern} Pattern detected with Risk Level {risk_score:.2f}.",
        related_features={
            "pattern": detected_pattern,
            "risk_score": risk_score,
            "source": "daily_checkin_advanced"
        }
    )
    db.add(new_insight)
    db.commit()
    
    return db_checkin

@router.get("/today", response_model=Optional[schemas.DailyCheckIn])
def get_todays_checkin(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    today = date.today()
    checkin = db.query(models.DailyCheckIn).filter(
        models.DailyCheckIn.user_id == current_user.id,
        func.date(models.DailyCheckIn.timestamp) == today
    ).first()
    
    return checkin
