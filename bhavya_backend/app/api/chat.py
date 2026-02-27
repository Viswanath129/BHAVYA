from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    sender: str = "ai"

@router.post("/message", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest):
    user_msg = request.message.lower()
    
    # Simple Keyword-Based Logic (Placeholder for LLM)
    if "hello" in user_msg or "hi" in user_msg:
        response = "Hello! I'm BHAVYA. How are you feeling right now?"
    elif "sad" in user_msg or "low" in user_msg:
        response = "I'm sorry to hear you're feeling low. Do you want to try a breathing exercise?"
    elif "anxious" in user_msg or "stress" in user_msg:
        response = "It sounds like things are heavy. Remember to breathe. We can try 4-7-8 breathing together."
    elif "thank" in user_msg:
        response = "You're welcome. I'm here for you."
    else:
        replies = [
            "I hear you. Tell me more.",
            "That sounds significant. How does that sit with you?",
            "I'm listening. Go on.",
            "Thank you for sharing that with me."
        ]
        response = random.choice(replies)

    return {"response": response}
