from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.db.session import SessionLocal
from app.models.startup import Startup

router = APIRouter(tags=["startups"])

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas for Startup
class StartupCreate(BaseModel):
    business_name: str
    owner_name: str
    business_address: str
    description: str = None
    country: str
    niche: str = None
    industry: str = None
    stage: str = None
    geography: str = None
    funding_min: int = None
    funding_max: int = None
    owner_id: int 


class StartupOut(BaseModel):
    id: int
    business_name: str
    owner_name: str
    business_address: str
    description: str = None
    country: str
    niche: str = None
    owner_id: int

    class Config:
        orm_mode = True

# Create a startup
@router.post("/create", response_model=StartupOut)
def create_startup(startup: StartupCreate, db: Session = Depends(get_db)):
    new_startup = Startup(
        business_name=startup.business_name,
        owner_name=startup.owner_name,
        business_address=startup.business_address,
        description=startup.description,
        country=startup.country,
        niche=startup.niche,
        industry=startup.industry,
        stage=startup.stage,
        geography=startup.geography,
        funding_min=startup.funding_min,
        funding_max=startup.funding_max,
        owner_id=startup.owner_id,
    )
    db.add(new_startup)
    db.commit()
    db.refresh(new_startup)
    return new_startup


# Get all startups
@router.get("/get-startups", response_model=List[StartupOut])
def get_startups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    startups = db.query(Startup).offset(skip).limit(limit).all()
    return startups

# Get a single startup by ID
@router.get("/{startup_id}", response_model=StartupOut)
def get_startup(startup_id: int, db: Session = Depends(get_db)):
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup
