import React, { useEffect, useState } from "react";

const Playground = () => {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const token = localStorage.getItem("token");

  const BASE_URL = "http://localhost:8000/playground";

  useEffect(() => {
    if (view === "feed") {
      fetch(`${BASE_URL}/feed`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Failed to load feed:", err));
    }
  }, [view, token]);

  const handlePost = () => {
    if (!postText.trim()) return;
    fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ author: "You", content: postText }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        setPostText("");
      })
      .catch((err) => console.error("Failed to create post:", err));
  };

  const handleLike = (postId) => {
    fetch(`${BASE_URL}/like/${postId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(() => {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: [...(p.likes || []), "You"] } : p))
        );
      })
      .catch((err) => console.error("Failed to like post:", err));
  };

  const handleReply = (postId) => {
    if (!replyText.trim()) return;
    fetch(`${BASE_URL}/reply/${postId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ author: "You", content: replyText }),
    })
      .then((res) => res.json())
      .then((newReply) => {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, replies: [...(p.replies || []), newReply] } : p))
        );
        setReplyText("");
        setActiveReplyPostId(null);
      })
      .catch((err) => console.error("Failed to add reply:", err));
  };

  const handleLikeReply = (postId, replyIndex) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const replies = [...(p.replies || [])];
          const reply = replies[replyIndex];
          const userLiked = reply.likes?.includes("You");
          reply.likes = userLiked ? reply.likes.filter((u) => u !== "You") : [...(reply.likes || []), "You"];
          replies[replyIndex] = reply;
          return { ...p, replies };
        }
        return p;
      })
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleDeleteReply = (postId, replyIndex) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const replies = [...(p.replies || [])];
          replies.splice(replyIndex, 1);
          return { ...p, replies };
        }
        return p;
      })
    );
  };

  const handleReplyToReply = (postId, replyIndex) => {
    if (!replyText.trim()) return;
    const parentReply = posts.find((p) => p.id === postId).replies[replyIndex];
    const newReply = { author: "You", content: replyText, replyingTo: parentReply.author, likes: [] };
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const replies = [...(p.replies || [])];
          replies.splice(replyIndex + 1, 0, newReply);
          return { ...p, replies };
        }
        return p;
      })
    );
    setReplyText("");
    setActiveReplyPostId(null);
  };

  const toggleReplies = (postId) => {
    setCollapsedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const styles = {
    container: { display: "flex", height: "100vh", backgroundColor: "#111", color: "#fff", fontFamily: "'Inter', sans-serif" },
    sidebar: { width: "250px", backgroundColor: "#000", borderRight: "1px solid #333", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    sidebarTitle: { fontSize: "22px", fontWeight: "bold", marginBottom: "30px", color: "#fff" },
    navButton: (active) => ({ display: "block", width: "100%", textAlign: "left", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "none", fontSize: "16px", cursor: "pointer", backgroundColor: active ? "#fff" : "transparent", color: active ? "#000" : "#bbb", fontWeight: active ? "600" : "400", transition: "0.3s" }),
    main: { flex: 1, padding: "30px", overflowY: "auto" },
    header: { fontSize: "26px", fontWeight: "bold", marginBottom: "20px", color: "#fff" },
    card: { backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" },
    postTextarea: { height: "100px", backgroundColor: "#111", color: "#fff", border: "1px solid #444", borderRadius: "8px", padding: "12px", fontSize: "14px", resize: "none", marginBottom: "10px", width: "100%", boxSizing: "border-box" },
    buttonPrimary: { backgroundColor: "#fff", color: "#000", padding: "10px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" },
    buttonInline: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
    repliesContainer: { marginTop: "15px", paddingLeft: "15px", borderLeft: "2px solid #333" },
    replyCard: { backgroundColor: "#222", padding: "15px", borderRadius: "8px", marginBottom: "10px" },
    replyBox: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Playground</h2>
          {["feed", "slide", "billboard", "library"].map((item) => (
            <button key={item} style={styles.navButton(view === item)} onClick={() => setView(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {view === "feed" && (
          <>
            <h1 style={styles.header}>Playground Feed</h1>

            {/* Post Form */}
            <div style={{ ...styles.card, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share your thoughts, updates, or ideas..."
                style={styles.postTextarea}
              />
              <button onClick={handlePost} style={{ ...styles.buttonPrimary, alignSelf: "flex-end" }}>
                Post
              </button>
            </div>

            {/* Feed */}
            {posts.map((post) => {
              const userLiked = post.likes?.includes("You");
              const repliesCollapsed = collapsedReplies[post.id];
              return (
                <div key={post.id} style={styles.card}>
                  <h3>{post.author}</h3>
                  <p>{post.content}</p>
                  <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                    <button style={styles.buttonInline} onClick={() => handleLike(post.id)}>
                      {userLiked ? "💔 Unlike" : "❤️ Like"} ({post.likes?.length || 0})
                    </button>
                    <button style={styles.buttonInline} onClick={() => setActiveReplyPostId(post.id)}>
                      💬 Reply
                    </button>
                    {post.replies?.length > 0 && (
                      <button style={styles.buttonInline} onClick={() => toggleReplies(post.id)}>
                        {repliesCollapsed ? "▼ Show Replies" : "▲ Hide Replies"} ({post.replies.length})
                      </button>
                    )}
                    {post.author === "You" && <button style={styles.buttonInline} onClick={() => handleDeletePost(post.id)}>🗑 Delete</button>}
                  </div>

                  {/* Reply Box */}
                  {activeReplyPostId === post.id && (
                    <div style={styles.replyBox}>
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." style={styles.postTextarea} />
                      <button onClick={() => handleReply(post.id)} style={styles.buttonPrimary}>Reply</button>
                    </div>
                  )}

                  {/* Replies */}
                  {post.replies?.length > 0 && !repliesCollapsed && (
                    <div style={styles.repliesContainer}>
                      {post.replies.map((r, i) => {
                        const userLikedReply = r.likes?.includes("You");
                        return (
                          <div key={i} style={styles.replyCard}>
                            <p>
                              <strong>{r.author}</strong>
                              {r.replyingTo && <span style={{ color: "#888", marginLeft: "5px" }}>replying to {r.replyingTo}</span>}
                              : {r.content}
                            </p>
                            <div style={{ display: "flex", gap: "10px", fontSize: "14px" }}>
                              <button style={styles.buttonInline} onClick={() => handleLikeReply(post.id, i)}>
                                {userLikedReply ? "💔 Unlike" : "❤️ Like"} ({r.likes?.length || 0})
                              </button>
                              <button style={styles.buttonInline} onClick={() => setActiveReplyPostId(`${post.id}-${i}`)}>💬 Reply</button>
                              {r.author === "You" && <button style={{ ...styles.buttonInline, color: "red" }} onClick={() => handleDeleteReply(post.id, i)}>🗑 Delete</button>}
                            </div>

                            {/* Nested Reply Box */}
                            {activeReplyPostId === `${post.id}-${i}` && (
                              <div style={styles.replyBox}>
                                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." style={styles.postTextarea} />
                                <button onClick={() => handleReplyToReply(post.id, i)} style={styles.buttonPrimary}>Reply</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
};

export default Playground;
