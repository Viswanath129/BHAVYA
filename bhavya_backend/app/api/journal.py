from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.db import models
from app import schemas

router = APIRouter()

@router.post("/", response_model=schemas.JournalEntry)
def create_journal_entry(
    entry: schemas.JournalEntryCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    db_entry = models.JournalEntry(
        user_id=current_user.id,
        title=entry.title,
        mood=entry.mood,
        content=entry.content
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[schemas.JournalEntry])
def read_journal_entries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    entries = db.query(models.JournalEntry).filter(
        models.JournalEntry.user_id == current_user.id
    ).order_by(models.JournalEntry.timestamp.desc()).offset(skip).limit(limit).all()
    return entries
