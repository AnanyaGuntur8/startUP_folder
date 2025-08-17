import React, { useEffect, useState, useCallback } from "react";

const Playground = () => {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock professional posts data
  const mockPosts = [
    {
      id: "post-1",
      author: "Sarah Chen",
      role: "Senior Frontend Developer",
      avatar: "SC",
      content: "Just shipped a new feature that reduces load time by 40%! The key was implementing lazy loading with intersection observers. Here's what we learned in the process...",
      timestamp: "2 hours ago",
      likes: ["user1", "user2", "user3"],
      replies: [
        {
          author: "Alex Rivera",
          role: "Full Stack Developer",
          content: "Great work Sarah! Could you share more details about the intersection observer implementation? We're facing similar performance issues.",
          timestamp: "1 hour ago",
          likes: ["user1"],
          replyingTo: "Sarah Chen"
        }
      ],
      views: 1247,
      shares: 12
    },
    {
      id: "post-2", 
      author: "Marcus Johnson",
      role: "Product Manager",
      avatar: "MJ",
      content: "Attending React Conf next week. Anyone else going? Would love to connect and discuss the latest trends in web development and product strategy.",
      timestamp: "4 hours ago",
      likes: ["user1", "user4"],
      replies: [],
      views: 892,
      shares: 8
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(mockPosts);
    }
  }, []);
  
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);  

  const handlePost = useCallback(() => {
    if (!postText.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        author: "You",
        role: "Professional",
        avatar: "YU",
        content: postText,
        timestamp: "now",
        likes: [],
        replies: [],
        views: 0,
        shares: 0
      };
      
      setPosts([newPost, ...posts]);
      setPostText("");
      setIsLoading(false);
    }, 500);
  }, [postText, posts]);

  const handleLike = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const userLiked = p.likes?.includes("You");
          return {
            ...p,
            likes: userLiked 
              ? p.likes.filter(u => u !== "You")
              : [...(p.likes || []), "You"]
          };
        }
        return p;
      })
    );
  }, []);

  const handleReply = useCallback((postId) => {
    if (!replyText.trim()) return;
    
    const newReply = {
      author: "You", 
      role: "Professional",
      content: replyText, 
      timestamp: "now", 
      likes: []
    };
    
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...(p.replies || []), newReply] } : p))
    );
    setReplyText("");
    setActiveReplyPostId(null);
  }, [replyText]);

  const handleLikeReply = useCallback((postId, replyIndex) => {
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
  }, []);

  const handleDeletePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const handleDeleteReply = useCallback((postId, replyIndex) => {
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
  }, []);

  const toggleReplies = useCallback((postId) => {
    setCollapsedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  // Professional styling
  const styles = {
    container: { 
      display: "flex", 
      height: "100vh", 
      backgroundColor: "#f8fafc", 
      color: "#1e293b", 
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: "14px"
    },
    
    sidebar: { 
      width: "280px", 
      backgroundColor: "#ffffff", 
      borderRight: "1px solid #e2e8f0", 
      padding: "24px", 
      display: "flex", 
      flexDirection: "column",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
    },
    
    sidebarHeader: {
      marginBottom: "32px"
    },
    
    sidebarTitle: { 
      fontSize: "24px", 
      fontWeight: "700", 
      marginBottom: "8px", 
      color: "#0f172a",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    
    sidebarSubtitle: {
      fontSize: "14px",
      color: "#64748b",
      fontWeight: "400"
    },
    
    navButton: (active) => ({ 
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%", 
      textAlign: "left", 
      padding: "12px 16px", 
      marginBottom: "4px", 
      borderRadius: "12px", 
      border: "none", 
      fontSize: "15px", 
      cursor: "pointer", 
      backgroundColor: active ? "#3b82f6" : "transparent", 
      color: active ? "#ffffff" : "#475569", 
      fontWeight: active ? "600" : "500", 
      transition: "all 0.2s ease",
      boxShadow: active ? "0 4px 12px rgb(59 130 246 / 0.25)" : "none"
    }),
    
    navIcon: {
      width: "20px",
      height: "20px",
      fill: "currentColor"
    },
    
    main: { 
      flex: 1, 
      padding: "24px 32px", 
      overflowY: "auto",
      maxWidth: "800px"
    },
    
    header: { 
      fontSize: "28px", 
      fontWeight: "700", 
      marginBottom: "8px", 
      color: "#0f172a"
    },
    
    headerSubtext: {
      fontSize: "16px",
      color: "#64748b",
      marginBottom: "32px"
    },
    
    card: { 
      backgroundColor: "#ffffff", 
      padding: "24px", 
      borderRadius: "16px", 
      marginBottom: "24px", 
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      border: "1px solid #f1f5f9"
    },
    
    avatar: (size = "40px") => ({
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "#3b82f6",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: size === "32px" ? "12px" : "14px",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      flexShrink: 0
    }),
    
    postHeader: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "16px"
    },
    
    postAuthorInfo: {
      flex: 1
    },
    
    postAuthor: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "2px"
    },
    
    postRole: {
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "4px"
    },
    
    postTime: {
      fontSize: "13px",
      color: "#94a3b8"
    },
    
    postContent: {
      fontSize: "15px",
      lineHeight: "1.6",
      color: "#334155",
      marginBottom: "16px"
    },
    
    postMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "16px",
      paddingBottom: "16px",
      borderBottom: "1px solid #f1f5f9"
    },
    
    postActions: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginBottom: "16px"
    },
    
    actionButton: (active = false, color = "#64748b") => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      backgroundColor: active ? `${color}15` : "transparent",
      color: active ? color : "#64748b",
      transition: "all 0.2s ease"
    }),
    
    postTextarea: { 
      width: "100%",
      minHeight: "120px", 
      backgroundColor: "#f8fafc", 
      color: "#1e293b", 
      border: "2px solid #e2e8f0", 
      borderRadius: "12px", 
      padding: "16px", 
      fontSize: "15px", 
      resize: "vertical", 
      marginBottom: "16px",
      fontFamily: "inherit",
      lineHeight: "1.5",
      transition: "border-color 0.2s ease",
      outline: "none"
    },
    
    primaryButton: (disabled = false) => ({ 
      backgroundColor: disabled ? "#94a3b8" : "#3b82f6", 
      color: "#ffffff", 
      padding: "12px 24px", 
      border: "none", 
      borderRadius: "8px", 
      fontWeight: "600", 
      fontSize: "14px",
      cursor: disabled ? "not-allowed" : "pointer", 
      transition: "all 0.2s ease",
      boxShadow: disabled ? "none" : "0 1px 3px rgb(59 130 246 / 0.12), 0 1px 2px rgb(59 130 246 / 0.24)"
    }),
    
    repliesContainer: { 
      marginTop: "20px", 
      paddingLeft: "20px", 
      borderLeft: "3px solid #e2e8f0"
    },
    
    replyCard: { 
      backgroundColor: "#f8fafc", 
      padding: "16px", 
      borderRadius: "12px", 
      marginBottom: "12px",
      border: "1px solid #e2e8f0"
    },
    
    replyHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px"
    },
    
    replyAuthor: {
      fontWeight: "600",
      fontSize: "14px",
      color: "#0f172a"
    },
    
    replyRole: {
      fontSize: "12px",
      color: "#64748b"
    },
    
    replyContent: {
      fontSize: "14px",
      lineHeight: "1.5",
      color: "#334155",
      marginBottom: "8px"
    },
    
    replyActions: {
      display: "flex",
      gap: "12px",
      fontSize: "12px"
    },
    
    replyBox: { 
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      border: "1px solid #e2e8f0"
    },
    
    replyTextarea: {
      width: "100%",
      minHeight: "80px",
      backgroundColor: "#ffffff",
      color: "#1e293b",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "12px",
      fontSize: "14px",
      resize: "vertical",
      marginBottom: "12px",
      fontFamily: "inherit",
      outline: "none"
    },
    
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px"
    },
    
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#64748b",
      padding: "8px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease"
    },
    
    deleteButton: {
      backgroundColor: "transparent",
      color: "#dc2626",
      border: "none",
      padding: "6px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "18px",
      transition: "all 0.2s ease"
    },
    
    emptyState: {
      textAlign: "center",
      padding: "48px 24px",
      color: "#64748b"
    },
    
    emptyStateIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      opacity: 0.5
    },
    
    emptyStateTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#334155"
    },
    
    charCounter: (count) => ({
      fontSize: "12px",
      color: count > 280 ? "#dc2626" : "#64748b",
      textAlign: "right",
      marginTop: "4px"
    })
  };

  const navItems = [
    { id: "feed", label: "Home", icon: "🏠" },
    { id: "trending", label: "Trending", icon: "📈" },
    { id: "network", label: "Slide", icon: "👥" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "library", label: "Library", icon: "📚" }
  ];

  return (
    <div style={styles.container}>
      {/* Professional Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.sidebarTitle}>Playground</h1>
          <p style={styles.sidebarSubtitle}>Connect. Share. Grow.</p>
        </div>
        
        <nav>
          {navItems.map((item) => (
            <button 
              key={item.id} 
              style={styles.navButton(view === item.id)} 
              onClick={() => setView(item.id)}
              onMouseEnter={(e) => {
                if (view !== item.id) {
                  e.target.style.backgroundColor = "#f1f5f9";
                }
              }}
              onMouseLeave={(e) => {
                if (view !== item.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div style={{marginTop: "auto", paddingTop: "24px", borderTop: "1px solid #e2e8f0"}}>
          <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
            <div style={styles.avatar("44px")}>YU</div>
            <div style={{flex: 1}}>
              <div style={{fontSize: "14px", fontWeight: "600", color: "#0f172a"}}>Your Name</div>
              <div style={{fontSize: "12px", color: "#64748b"}}>@yourhandle</div>
            </div>
            <button style={{background: "none", border: "none", fontSize: "18px", cursor: "pointer"}}>⚙️</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {view === "feed" && (
          <>
            <div>
              <h1 style={styles.header}>Professional Feed</h1>
              <p style={styles.headerSubtext}>Stay connected with your professional network and industry insights</p>
            </div>

            {/* Enhanced Post Creation */}
            <div style={styles.card}>
              <div style={{display: "flex", gap: "16px", alignItems: "flex-start"}}>
                <div style={styles.avatar()}>YU</div>
                <div style={{flex: 1}}>
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Share your professional insights, achievements, or ask questions to engage with your network..."
                    style={{
                      ...styles.postTextarea,
                      borderColor: postText.length > 0 ? "#3b82f6" : "#e2e8f0"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = postText.length > 0 ? "#3b82f6" : "#e2e8f0"}
                  />
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div style={styles.charCounter(postText.length)}>
                      {postText.length}/280 characters
                    </div>
                    <button 
                      onClick={handlePost} 
                      disabled={!postText.trim() || isLoading}
                      style={styles.primaryButton(!postText.trim() || isLoading)}
                      onMouseEnter={(e) => {
                        if (!(!postText.trim() || isLoading)) {
                          e.target.style.backgroundColor = "#2563eb";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!(!postText.trim() || isLoading)) {
                          e.target.style.backgroundColor = "#3b82f6";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {isLoading ? "🔄 Posting..." : "📤 Share Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Feed */}
            {posts.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>💼</div>
                <h3 style={styles.emptyStateTitle}>Welcome to your Professional Feed</h3>
                <p>Start sharing your professional journey and connect with industry peers!</p>
              </div>
            ) : (
              posts.map((post) => {
                const userLiked = post.likes?.includes("You");
                const repliesCollapsed = collapsedReplies[post.id];
                
                return (
                  <div key={post.id} style={styles.card}>
                    {/* Enhanced Post Header */}
                    <div style={styles.postHeader}>
                      <div style={styles.avatar()}>{post.avatar}</div>
                      <div style={styles.postAuthorInfo}>
                        <div style={styles.postAuthor}>{post.author}</div>
                        <div style={styles.postRole}>{post.role}</div>
                        <div style={styles.postTime}>{post.timestamp}</div>
                      </div>
                      {post.author === "You" && (
                        <button 
                          style={styles.deleteButton} 
                          onClick={() => handleDeletePost(post.id)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#fee2e2"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    {/* Post Content */}
                    <div style={styles.postContent}>{post.content}</div>

                    {/* Post Metrics */}
                    <div style={styles.postMeta}>
                      <span>{post.views?.toLocaleString() || 0} views</span>
                      <span>{post.shares || 0} shares</span>
                    </div>

                    {/* Enhanced Post Actions */}
                    <div style={styles.postActions}>
                      <button 
                        style={styles.actionButton(userLiked, "#dc2626")} 
                        onClick={() => handleLike(post.id)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = userLiked ? "#dc262615" : "#fee2e2";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = userLiked ? "#dc262615" : "transparent";
                        }}
                      >
                        {userLiked ? "💖" : "🤍"} {post.likes?.length || 0}
                      </button>
                      
                      <button 
                        style={styles.actionButton(activeReplyPostId === post.id, "#3b82f6")} 
                        onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#dbeafe";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = activeReplyPostId === post.id ? "#3b82f615" : "transparent";
                        }}
                      >
                        💬 {post.replies?.length || 0}
                      </button>
                      
                      <button 
                        style={styles.actionButton(false, "#059669")}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#d1fae5";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        🔄 {post.shares || 0}
                      </button>

                      {post.replies?.length > 0 && (
                        <button 
                          style={{...styles.actionButton(), marginLeft: "auto"}} 
                          onClick={() => toggleReplies(post.id)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f1f5f9";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          {repliesCollapsed ? "👁️ Show" : "🙈 Hide"} replies
                        </button>
                      )}
                    </div>

                    {/* Enhanced Reply Box */}
                    {activeReplyPostId === post.id && (
                      <div style={styles.replyBox}>
                        <div style={{display: "flex", gap: "12px", alignItems: "flex-start"}}>
                          <div style={styles.avatar("32px")}>YU</div>
                          <div style={{flex: 1}}>
                            <textarea 
                              value={replyText} 
                              onChange={(e) => setReplyText(e.target.value)} 
                              placeholder="Share your professional thoughts or insights..." 
                              style={styles.replyTextarea}
                            />
                            <div style={styles.buttonGroup}>
                              <button 
                                onClick={() => setActiveReplyPostId(null)}
                                style={styles.secondaryButton}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#f1f5f9";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "transparent";
                                }}
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleReply(post.id)}
                                disabled={!replyText.trim()}
                                style={styles.primaryButton(!replyText.trim())}
                                onMouseEnter={(e) => {
                                  if (replyText.trim()) {
                                    e.target.style.backgroundColor = "#2563eb";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (replyText.trim()) {
                                    e.target.style.backgroundColor = "#3b82f6";
                                  }
                                }}
                              >
                                💬 Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Replies */}
                    {post.replies?.length > 0 && !repliesCollapsed && (
                      <div style={styles.repliesContainer}>
                        {post.replies.map((reply, index) => {
                          const userLikedReply = reply.likes?.includes("You");
                          
                          return (
                            <div key={index} style={styles.replyCard}>
                              <div style={styles.replyHeader}>
                                <div style={styles.avatar("28px")}>{reply.author.charAt(0).toUpperCase()}</div>
                                <div>
                                  <span style={styles.replyAuthor}>{reply.author}</span>
                                  <span style={{...styles.replyRole, marginLeft: "8px"}}>{reply.role}</span>
                                  {reply.replyingTo && (
                                    <span style={{fontSize: "12px", color: "#64748b", marginLeft: "8px"}}>
                                      → {reply.replyingTo}
                                    </span>
                                  )}
                                </div>
                                {reply.author === "You" && (
                                  <button 
                                    style={{...styles.deleteButton, fontSize: "14px", marginLeft: "auto"}} 
                                    onClick={() => handleDeleteReply(post.id, index)}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              
                              <div style={styles.replyContent}>{reply.content}</div>
                              
                              <div style={styles.replyActions}>
                                <button 
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: userLikedReply ? "#dc2626" : "#64748b",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                  }}
                                  onClick={() => handleLikeReply(post.id, index)}
                                >
                                  {userLikedReply ? "💖" : "🤍"} {reply.likes?.length || 0}
                                </button>
                                <span style={{fontSize: "12px", color: "#94a3b8"}}>{reply.timestamp}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Other Views */}
        {view !== "feed" && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🚧</div>
            <h3 style={styles.emptyStateTitle}>{view.charAt(0).toUpperCase() + view.slice(1)} Coming Soon</h3>
            <p>This professional feature is currently under development. Stay tuned for updates!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Playground;