from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.db import models
from app.api import deps

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.bio is not None:
        current_user.bio = user_in.bio
    if user_in.location is not None:
        current_user.location = user_in.location
    if user_in.email is not None:
        # check if email exists
        existing = db.query(models.User).filter(models.User.email == user_in.email).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_in.email

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
