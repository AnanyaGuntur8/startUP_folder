from fastapi import FastAPI
from app.routes import auth, startup, customer  # Comment out DB-dependent routes
from app.db.session import engine
from app.db.session import Base
from app.routes import console
from fastapi.middleware.cors import CORSMiddleware
from app.routes import playground

# Create all tables
Base.metadata.create_all(bind=engine)  # Comment out DB creation

# Initialize app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "StartUP backend is running!"}

# Include only non-DB routers for now
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(startup.router, prefix="/startup", tags=["startup"])
app.include_router(customer.router, prefix="/customers", tags=["customers"])
app.include_router(console.router, prefix="/console", tags=["console"])
app.include_router(playground.router, prefix="/playground", tags=["playground"])