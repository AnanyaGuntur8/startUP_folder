from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, nullable=False)
    niche = Column(String, index=True)
    owner_name = Column(String, nullable=False)
    business_address = Column(String, nullable=False)
    description = Column(String)
    country = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
