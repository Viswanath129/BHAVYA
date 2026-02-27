from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app import schemas
from app.db import models
from app.db.base import get_db
from app.api import deps
from datetime import datetime

router = APIRouter()

def process_ingestion_data(data: schemas.DataIngestion, user_id: int, db: Session):
    # This simulates sending data to the Data Ingestion & Preprocessing Service
    # In a real microservices architecture, this might push to a queue (Kafka/RabbitMQ)
    # For now, we save raw data directly
    
    db_raw = models.BehavioralRaw(
        user_id=user_id,
        data_type=data.data_type,
        payload=data.payload,
        timestamp=datetime.now()
    )
    db.add(db_raw)
    db.commit()
    print(f"Processed {data.data_type} for user {user_id}")

@router.post("/ingest")
def ingest_data(
    data: schemas.DataIngestion, 
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    # Offload processing to background task (or separate service)
    background_tasks.add_task(process_ingestion_data, data, current_user.id, db)
    return {"status": "received", "message": "Data queued for processing"}
