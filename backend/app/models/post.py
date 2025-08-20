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

class PostLike(Base):
    __tablename__ = "post_likes"

    post_id = Column(Integer, ForeignKey("posts.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    post = relationship("Post", back_populates="likes")
    user = relationship("User")

class ReplyLike(Base):
    __tablename__ = "reply_likes"

    reply_id = Column(Integer, ForeignKey("replies.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    reply = relationship("Reply", back_populates="likes")
    user = relationship("User")