# app/routes/playground.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.post import Post, Reply, PostLike, ReplyLike
from pydantic import BaseModel
from datetime import datetime
from typing import List

router = APIRouter(tags=["playground"])

# ---- DB dependency ----
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---- Schemas ----
class CreatePost(BaseModel):
    user_id: int
    content: str

class CreateReply(BaseModel):
    user_id: int
    content: str

class PostOut(BaseModel):
    id: int
    content: str
    user_name: str
    user_id: int
    timestamp: datetime
    replies: List[dict] = []
    likes: List[str] = []

    class Config:
        orm_mode = True

class ReplyOut(BaseModel):
    id: int
    content: str
    user_name: str
    user_id: int
    timestamp: datetime
    likes: List[str] = []

    class Config:
        orm_mode = True

# ---- Routes ----

# Create a post
@router.post("/post", response_model=PostOut)
def create_post(post: CreatePost, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == post.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_post = Post(content=post.content, user_id=user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {
        "id": new_post.id,
        "content": new_post.content,
        "user_name": user.name,
        "user_id": user.id,
        "timestamp": new_post.timestamp,
        "replies": [],
        "likes": []
    }

# Add a reply
@router.post("/reply/{post_id}", response_model=ReplyOut)
def add_reply(post_id: int, reply: CreateReply, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == reply.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_reply = Reply(content=reply.content, user_id=user.id, post_id=post.id)
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)

    return {
        "id": new_reply.id,
        "content": new_reply.content,
        "user_name": user.name,
        "user_id": user.id,
        "timestamp": new_reply.timestamp,
        "likes": []
    }

# Get all posts
@router.get("/feed", response_model=List[PostOut])
def get_feed(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "content": post.content,
            "user_name": post.user.name,
            "user_id": post.user.id,
            "timestamp": post.timestamp,
            "likes": [like.user.name for like in post.likes],
            "replies": [
                {
                    "id": r.id,
                    "content": r.content,
                    "user_name": r.user.name,
                    "user_id": r.user.id,
                    "timestamp": r.timestamp,
                    "likes": [like.user.name for like in r.likes]
                } for r in post.replies
            ]
        })
    return result

# Like/unlike a post
@router.post("/like/post/{post_id}")
def like_post(post_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(PostLike).filter_by(post_id=post.id, user_id=user.id).first()
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Post unliked"}

    new_like = PostLike(post_id=post.id, user_id=user.id)
    db.add(new_like)
    db.commit()
    return {"message": "Post liked"}

# Like/unlike a reply
@router.post("/like/reply/{reply_id}")
def like_reply(reply_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reply = db.query(Reply).filter(Reply.id == reply_id).first()
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")

    existing_like = db.query(ReplyLike).filter_by(reply_id=reply.id, user_id=user.id).first()
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"message": "Reply unliked"}

    new_like = ReplyLike(reply_id=reply.id, user_id=user.id)
    db.add(new_like)
    db.commit()
    return {"message": "Reply liked"}

# Delete a post
@router.delete("/post/{post_id}")
def delete_post(post_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.user_id != user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own post")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

# Delete a reply
@router.delete("/reply/{reply_id}")
def delete_reply(reply_id: int, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reply = db.query(Reply).filter(Reply.id == reply_id).first()
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")

    if reply.user_id != user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own reply")

    db.delete(reply)
    db.commit()
    return {"message": "Reply deleted"}
