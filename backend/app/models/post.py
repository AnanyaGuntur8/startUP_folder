# app/models/post.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="posts")
    replies = relationship("Reply", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")

class Reply(Base):
    __tablename__ = "replies"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    post = relationship("Post", back_populates="replies")
    likes = relationship("ReplyLike", back_populates="reply", cascade="all, delete-orphan")

# ---- Likes ----
class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    post = relationship("Post", back_populates="likes")
    user = relationship("User")

class ReplyLike(Base):
    __tablename__ = "reply_likes"

    id = Column(Integer, primary_key=True, index=True)
    reply_id = Column(Integer, ForeignKey("replies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    reply = relationship("Reply", back_populates="likes")
    user = relationship("User")
