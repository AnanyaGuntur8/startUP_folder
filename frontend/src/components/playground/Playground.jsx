import React, { useEffect, useState } from "react";

const Playground = () => {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const token = localStorage.getItem("token");

  const BASE_URL = "http://localhost:8000/playground";

  // ✅ Fetch feed from backend
  useEffect(() => {
    if (view === "feed") {
      fetch(`${BASE_URL}/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Failed to load feed:", err));
    }
  }, [view, token]);

  // ✅ Handle new post
  const handlePost = () => {
    if (!postText.trim()) return;
    fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author: "You", content: postText }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        setPostText("");
      })
      .catch((err) => console.error("Failed to create post:", err));
  };

  // ✅ Handle reply
  const handleReply = (postId) => {
    if (!replyText.trim()) return;
    fetch(`${BASE_URL}/reply/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ author: "You", content: replyText }),
    })
      .then((res) => res.json())
      .then((newReply) => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
          )
        );
        setReplyText("");
        setActiveReplyPostId(null);
      })
      .catch((err) => console.error("Failed to add reply:", err));
  };

  // ✅ Handle like (API + local update)
  const handleLike = (postId) => {
    fetch(`${BASE_URL}/like/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          )
        );
      })
      .catch((err) => console.error("Failed to like post:", err));
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "#fff", borderRight: "1px solid #ddd", padding: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Playground</h2>
        {["feed", "slide", "billboard", "library"].map((item) => (
          <button
            key={item}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: view === item ? "#e0ebff" : "transparent",
            }}
            onClick={() => setView(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        {view === "feed" ? (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Playground Feed</h1>
            {/* Post Form */}
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind?"
                style={{
                  width: "100%",
                  height: "80px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              ></textarea>
              <button
                onClick={handlePost}
                style={{
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>

            {/* Feed */}
            <div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>{post.author}</h3>
                  <p style={{ marginTop: "10px" }}>{post.content}</p>
                  <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                    <button
                      style={{ color: "#0070f3", background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => handleLike(post.id)}
                    >
                      Like ({post.likes})
                    </button>
                    <button
                      style={{ color: "#555", background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => setActiveReplyPostId(post.id)}
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Box */}
                  {activeReplyPostId === post.id && (
                    <div style={{ marginTop: "10px" }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        style={{
                          width: "100%",
                          height: "50px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "10px",
                        }}
                      ></textarea>
                      <button
                        onClick={() => handleReply(post.id)}
                        style={{
                          backgroundColor: "#0070f3",
                          color: "#fff",
                          padding: "6px 14px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div style={{ marginTop: "15px", paddingLeft: "20px", borderLeft: "2px solid #eee" }}>
                      {post.replies.map((r, i) => (
                        <p key={i} style={{ marginBottom: "8px" }}>
                          <strong>{r.author}: </strong>
                          {r.content}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: "18px" }}>{view} feature coming soon...</p>
        )}
      </main>
    </div>
  );
};

export default Playground;
