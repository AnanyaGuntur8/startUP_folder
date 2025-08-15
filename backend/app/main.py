from fastapi import FastAPI
from app.routes import auth, startup, customer
from app.db.session import engine
from app.db.base import Base
from app.routes import console
from fastapi.middleware.cors import CORSMiddleware
from app.routes import console

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # dev front-end origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(console.router, prefix="/console", tags=["console"])


@app.get("/")
def read_root():
    return {"message": "StartUP backend is running!"}

# Include routers with prefixes here
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(startup.router, prefix="/startup", tags=["startup"])
app.include_router(customer.router, prefix="/customers", tags=["customers"])
app.include_router(console.router, prefix="/console", tags=["console"])
