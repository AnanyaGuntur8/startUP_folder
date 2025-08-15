from fastapi import FastAPI
from app.routes import auth, startup, customer
from app.db.session import engine
from app.db.base import Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "StartUP backend is running!"}

# Include routers with prefixes here
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(startup.router, prefix="/startup", tags=["startup"])
app.include_router(customer.router, prefix="/customers", tags=["customers"])
