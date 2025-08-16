import React, { useState } from "react";
import { addReply, likePost } from "./api";

const PostCard = ({ post, onReplyAdded, onLike }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    const newReply = await addReply(post.id, "currentUser", replyContent);
    onReplyAdded(post.id, newReply);
    setReplyContent("");
    setShowReplyBox(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{post.author}</h3>
      <p>{post.content}</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
        <button onClick={() => onLike(post.id)}>👍 {post.likes}</button>
      </div>
      {showReplyBox && (
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: "70%", marginRight: "0.5rem" }}
          />
          <button onClick={handleReply}>Send</button>
        </div>
      )}
      {post.replies.length > 0 && (
        <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px solid #ddd" }}>
          {post.replies.map((reply, idx) => (
            <div key={idx}>
              <strong>{reply.author}</strong>: {reply.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
