from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import torch
from services.affective_engine.temporal_model import EEVTemporalModel, AffectiveRiskScorer
from services.affective_engine.npu_interface import NPUInterface

router = APIRouter()

# Initialize Engines
npu_engine = NPUInterface()
temporal_model = EEVTemporalModel()
temporal_model.eval()

class QuestionInput(BaseModel):
    answers: List[int] # 0-3 scale for 10 questions

@router.post("/analyze/questions")
async def analyze_questions(data: QuestionInput):
    """
    Analyzes mental state based on questionnaire answers mapped to EEV Emotion Space.
    1. Answers -> NPU Interface (Vector Mapping)
    2. Sequence Generation (Simulated temporal aspect from static answers)
    3. Temporal Model Inference
    """
    try:
        # 1. Map to 15-dim vector
        base_vector = npu_engine.process_question_answers(data.answers)
        
        # 2. Model Inference via Temporal Engine
        probs, sequence_np = temporal_model.predict_from_vector(base_vector)
            
        pattern_idx = torch.argmax(probs).item()
        patterns = ["Stable", "Volatile", "Depressive", "Anxious"]
        
        # 4. Risk Calculation
        risk_score = AffectiveRiskScorer.calculate_risk(sequence_np)
        
        return {
            "pattern": patterns[pattern_idx],
            "risk_score": float(risk_score),
            "emotion_timeline": [
                {"time": i, "positive": float(v[:6].sum()), "negative": float(v[11:].sum())} 
                for i, v in enumerate(sequence_np)
            ]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    """
    Placeholder for Video Analysis.
    In production:
    1. Save video temp.
    2. OpenCV read frames.
    3. NPU extracts vector per frame.
    4. Temporal model analyzes sequence.
    """
    return {"message": "Video analysis module ready. Connect NPU stream."}
