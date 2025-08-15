from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.db.session import SessionLocal
from app.models.customer import Customer
from app.models.startup import Startup

router = APIRouter(tags=["customers"])

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas for Customer
class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str = None
    startup_id: int

class CustomerOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str = None
    startup_id: int

    class Config:
        orm_mode = True

# Create a customer
@router.post("/", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Check startup exists
    startup = db.query(Startup).filter(Startup.id == customer.startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        startup_id=customer.startup_id
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

# Get all customers
@router.get("/", response_model=List[CustomerOut])
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

# Get a single customer by ID
@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
