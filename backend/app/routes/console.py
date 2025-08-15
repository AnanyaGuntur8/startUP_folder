from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter()

# Service model
class Service(BaseModel):
    name: str
    description: str
    route: str

# Dummy service list for now
services_db: List[Service] = [
    {"name": "Playground", "description": "Social network for businesses, posts, and networking", "route": "/playground"},
    {"name": "StartUp Slide", "description": "Connect with similar businesses and investors", "route": "/startup-slide"},
    {"name": "Billboard", "description": "Post ads and showcase your business", "route": "/billboard"},
    {"name": "Library", "description": "Forms, advice, and resources for startups", "route": "/library"},
]

# Endpoint to get all services
@router.get("/", response_model=List[Service])
def get_console_services():
    return services_db
