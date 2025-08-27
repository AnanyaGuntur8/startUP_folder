from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)

    # Basic startup info
    business_name = Column(String, nullable=False)
    niche = Column(String, index=True)
    owner_name = Column(String, nullable=False)
    business_address = Column(String, nullable=False)
    description = Column(String)
    country = Column(String, nullable=False)

    # Foreign key to user
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", backref="startups")

    # Slide / matching info
    industry = Column(String(50), nullable=True)
    stage = Column(String(50), nullable=True)  # seed, early-stage, Series A, etc.
    geography = Column(String(50), nullable=True)  # local, national, global
    funding_min = Column(Integer, nullable=True)
    funding_max = Column(Integer, nullable=True)

    # Optional: investor preferences for matching
    preferences = Column(String, nullable=True) 