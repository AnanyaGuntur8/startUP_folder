from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(tags=["playground"])

posts_db: List[dict] = []
followers_db: dict = {} 

# ---- Models ----
class Reply(BaseModel):
    author: str
    content: str
    timestamp: datetime

class Post(BaseModel):
    id: int
    author: str
    content: str
    timestamp: datetime
    likes: int = 0
    replies: List[Reply] = []

class CreatePost(BaseModel):
    author: str
    content: str

class CreateReply(BaseModel):
    author: str
    content: str

# ---- Routes ----

# Get feed (Recommended or Following)
@router.get("/feed", response_model=List[Post])
def get_feed(tab: str = Query("recommended", enum=["recommended", "following"]), user: str = None):
    if tab == "following" and user:
        following_list = followers_db.get(user, [])
        return [post for post in posts_db if post["author"] in following_list]
    return posts_db  # recommended = all posts for now

@router.post("/post", response_model=Post)
def create_post(post: CreatePost):
    new_post = {
        "id": len(posts_db) + 1,
        "author": post.author,
        "content": post.content,
        "timestamp": datetime.now(),
        "likes": 0,
        "replies": []
    }
    posts_db.append(new_post)
    return new_post

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

@router.post("/like/{post_id}")
def like_post(post_id: int):
    for post in posts_db:
        if post["id"] == post_id:
            post["likes"] += 1
            return {"message": "Liked", "likes": post["likes"]}
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/follow")
def follow_user(current_user: str, target_user: str):
    if current_user == target_user:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")
    if current_user not in followers_db:
        followers_db[current_user] = []
    if target_user not in followers_db[current_user]:
        followers_db[current_user].append(target_user)
    return {"message": f"{current_user} now follows {target_user}", "following": followers_db[current_user]}

@router.post("/unfollow")
def unfollow_user(current_user: str, target_user: str):
    if current_user in followers_db and target_user in followers_db[current_user]:
        followers_db[current_user].remove(target_user)
        return {"message": f"{current_user} unfollowed {target_user}", "following": followers_db[current_user]}
    raise HTTPException(status_code=400, detail="Not following this user")
