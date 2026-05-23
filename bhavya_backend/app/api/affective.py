from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import logging
from services.affective_engine.temporal_model import EEVTemporalModel
from services.affective_engine.npu_interface import NPUInterface

logger = logging.getLogger(__name__)
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
    2. Temporal Model Inference (via centralized predict_from_vector)
    """
    try:
        # 1. Map to 15-dim vector
        base_vector = npu_engine.process_question_answers(data.answers)
        
        # 2. Centralized Model Inference & Risk Calculation
        result = temporal_model.predict_from_vector(base_vector)
        
        return result
    except Exception as e:
        logger.error(f"Error in analyze_questions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during affective analysis")

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
