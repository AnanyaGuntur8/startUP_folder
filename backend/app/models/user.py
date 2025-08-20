from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) 

    # Add these so Post and Reply relationships work
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    replies = relationship("Reply", back_populates="user", cascade="all, delete-orphan")
