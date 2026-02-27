from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas
from app.db import models
from app.db.base import get_db
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Insight])
def get_insights(
    skip: int = 0, 
    limit: int = 10, 
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    insights = db.query(models.Insight).filter(models.Insight.user_id == current_user.id).offset(skip).limit(limit).all()
    return insights

@router.get("/dashboard", response_model=schemas.DashboardData)
def get_dashboard_data(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch real risk assessment
    from services.inference.predictor import predictor
    risk_assessment = predictor.predict_risk(current_user.id, db)
    
    # Mock data for charts (still mocked as we don't have full history visualization built yet)
    # But future_risk comes from ALGO
    return {
        "sleep_data": [
            { "name": 'Mon', "score": 65, "sleep": 7.2 },
            { "name": 'Tue', "score": 75, "sleep": 7.5 },
            { "name": 'Wed', "score": 60, "sleep": 6.8 },
            { "name": 'Thu', "score": 85, "sleep": 8.0 },
            { "name": 'Fri', "score": 90, "sleep": 7.8 },
            { "name": 'Sat', "score": 55, "sleep": 9.0 },
            { "name": 'Sun', "score": 95, "sleep": 8.2 },
        ],
        "activity_data": [
            { "name": 'M', "value": 40 },
            { "name": 'T', "value": 65 },
            { "name": 'W', "value": 85 },
            { "name": 'T', "value": 50 },
            { "name": 'F', "value": 35 },
            { "name": 'S', "value": 90 },
            { "name": 'S', "value": 70 },
        ],
        "interaction_data": [
            { "name": '1', "value": 10 },
            { "name": '2', "value": 40 },
            { "name": '3', "value": 25 },
            { "name": '4', "value": 60 },
            { "name": '5', "value": 80 },
            { "name": '6', "value": 30 },
            { "name": '7', "value": 55 },
        ],
        "future_risk": {
            "score": int(risk_assessment['risk_score'] * 100),
            "label": risk_assessment['risk_label'],
            "prediction": f"Current analysis indicates {risk_assessment['risk_label'].lower()} risk based on: " + ", ".join(risk_assessment['contributing_factors'])
        }
    }

@router.get("/risk", response_model=schemas.RiskData)
def get_risk_insights(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    # Connect to ML Model
    from services.inference.predictor import predictor
    risk = predictor.predict_risk(current_user.id, db)
    
    factors = []
    # Map simple explanation strings to RiskFactors
    for explanation in risk['contributing_factors']:
        factors.append({
            "name": explanation,
            "value": 50, # Arbitrary since model doesn't output per-factor magnitude yet
            "percentage": 10,
            "type": "negative" if "Low" in explanation or "Reduced" in explanation else "positive"
        })
        
    if not factors:
        factors.append({"name": "Stable Behavior", "value": 90, "percentage": 0, "type": "positive"})

    return {
        "score": int(risk['risk_score'] * 100),
        "label": risk['risk_label'],
        "factors": factors
    }
