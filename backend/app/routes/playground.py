from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Dict
from datetime import datetime

router = APIRouter(tags=["playground"])

# ---- In-memory storage ----
posts_db: List[dict] = []
users_db: Dict[str, dict] = {}  # key: email
followers_db: dict = {}

# ---- Models ----
class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str

class Reply(BaseModel):
    author: str
    content: str
    timestamp: datetime

class Post(BaseModel):
    id: int
    author: str
    content: str
    timestamp: datetime
    likes: List[str] = []
    replies: List[Reply] = []

class CreatePost(BaseModel):
    author: str
    content: str

class CreateReply(BaseModel):
    author: str
    content: str

# ---- Routes ----

@router.post("/auth/register")
def register_user(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    users_db[user.email] = {
        "email": user.email,
        "name": user.name,
        "password": user.password  # NOTE: plain text for demo only (hash in prod)
    }
    return {"message": "User registered", "name": user.name, "email": user.email}

@router.get("/feed", response_model=List[Post])
def get_feed():
    return posts_db

@router.post("/post", response_model=Post)
def create_post(post: CreatePost):
    new_post = {
        "id": len(posts_db) + 1,
        "author": post.author,
        "content": post.content,
        "timestamp": datetime.now(),
        "likes": [],
        "replies": []
    }
    posts_db.insert(0, new_post)  # newest first
    return new_post

@router.delete("/post/{post_id}")
def delete_post(post_id: int, user: str):
    global posts_db
    for post in posts_db:
        if post["id"] == post_id:
            if post["author"] != user:
                raise HTTPException(status_code=403, detail="You can only delete your own posts")
            posts_db = [p for p in posts_db if p["id"] != post_id]
            return {"message": "Post deleted"}
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/reply/{post_id}", response_model=Reply)
def add_reply(post_id: int, reply: CreateReply):
    for post in posts_db:
        if post["id"] == post_id:
            new_reply = {
                "author": reply.author,
                "content": reply.content,
                "timestamp": datetime.now()
            }
            post["replies"].append(new_reply)
            return new_reply
    raise HTTPException(status_code=404, detail="Post not found")

@router.delete("/reply/{post_id}/{reply_index}")
def delete_reply(post_id: int, reply_index: int, user: str):
    for post in posts_db:
        if post["id"] == post_id:
            if reply_index < 0 or reply_index >= len(post["replies"]):
                raise HTTPException(status_code=400, detail="Invalid reply index")
            if post["replies"][reply_index]["author"] != user:
                raise HTTPException(status_code=403, detail="You can only delete your own replies")
            post["replies"].pop(reply_index)
            return {"message": "Reply deleted"}
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/like/{post_id}")
def like_post(post_id: int, user: str):
    for post in posts_db:
        if post["id"] == post_id:
            if user in post["likes"]:
                post["likes"].remove(user)
                return {"message": "Unliked", "likes": len(post["likes"])}
            else:
                post["likes"].append(user)
                return {"message": "Liked", "likes": len(post["likes"])}
    raise HTTPException(status_code=404, detail="Post not found")
