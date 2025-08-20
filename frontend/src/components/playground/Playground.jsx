import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Trash2, User, Clock, Plus } from 'lucide-react';

const Playground = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState({});

  // Mock API base URL - in real implementation, this would be your FastAPI server
  const API_BASE = 'http://localhost:8000/playground';

  // Load user from localStorage and posts from API on component mount
  useEffect(() => {
    // Check for JWT token first
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode JWT token to get user info (basic decode, not verifying signature)
        const payload = JSON.parse(atob(token.split('.')[1]));
        // The token contains 'sub' field with email, but we need the name
        // So we'll need to get user data from your backend or store it separately
        
        // Option 1: If you stored user data separately
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user.name || user.email || payload.sub);
        } else {
          // Option 2: Use email from token as fallback
          setCurrentUser(payload.sub);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Clear invalid token
        localStorage.removeItem('access_token');
      }
    } else {
      // Fallback: Check for direct user data (for testing)
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user.name || user.email || userData);
        } catch (error) {
          setCurrentUser(userData);
        }
      }
    }
    
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/feed`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to empty array if API call fails
      setPosts([]);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUser) return;

    const postData = {
      author: currentUser,
      content: newPost
    };

    try {
      // Mock post creation=
      // const response = await fetch(`${API_BASE}/post`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(postData)
      // });
      // const newPostObj = await response.json();
      
      const newPostObj = {
        id: posts.length + 1,
        author: currentUser,
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: [],
        replies: []
      };
      
      setPosts(prev => [newPostObj, ...prev]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) return;

    try {
      // Mock like toggle - replace with actual API call
      // await fetch(`${API_BASE}/like/${postId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ user: currentUser })
      // });

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(user => user !== currentUser)
              : [...post.likes, currentUser]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleReply = async (postId) => {
    const content = replyContent[postId];
    if (!content?.trim() || !currentUser) return;

    try {
      // Mock reply creation - replace with actual API call
      // const response = await fetch(`${API_BASE}/reply/${postId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ author: currentUser, content: content })
      // });
      // const newReply = await response.json();

      const newReply = {
        author: currentUser,
        content: content,
        timestamp: new Date().toISOString()
      };

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      }));

      setReplyContent(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Mock delete - replace with actual API call
      // await fetch(`${API_BASE}/post/${postId}?user=${encodeURIComponent(currentUser)}`, {
      //   method: 'DELETE'
      // });

      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Playground</h1>
          <p style={styles.loginSubtitle}>Please log in to access your professional feed</p>
          <div style={styles.loginMessage}>
            <p><strong>Authentication Required</strong></p>
            <p>Please log in through your authentication system.</p>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              Your login should store either:
              <br />• JWT token in 'access_token'
              <br />• User data in 'currentUser'
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Playground</h1>
          <div style={styles.userInfo}>
            <span style={styles.welcomeText}>Welcome, {currentUser}</span>
            <button
              onClick={() => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('access_token'); // Clear JWT token too
                setCurrentUser('');
              }}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Create Post */}
        <div style={styles.createPostCard}>
          <form onSubmit={handleCreatePost}>
            <div style={styles.createPostContent}>
              <div style={styles.userAvatar}>
                <User size={20} />
              </div>
              <div style={styles.createPostInput}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your insights..."
                  style={styles.textarea}
                  rows="3"
                />
                <div style={styles.createPostFooter}>
                  <div style={styles.characterCount}>
                    {newPost.length}/500 characters
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    style={{
                      ...styles.postButton,
                      ...(newPost.trim() ? {} : styles.postButtonDisabled)
                    }}
                  >
                    <Plus size={16} style={styles.buttonIcon} />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div style={styles.feed}>
          {posts.length === 0 ? (
            <div style={styles.emptyState}>
              <MessageCircle size={48} style={styles.emptyIcon} />
              <p style={styles.emptyTitle}>No posts yet</p>
              <p style={styles.emptySubtitle}>Be the first to share something with your network!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <div style={styles.postHeader}>
                  <div style={styles.postAuthorInfo}>
                    <div style={styles.postAvatar}>
                      <User size={20} />
                    </div>
                    <div style={styles.postAuthorDetails}>
                      <h3 style={styles.authorName}>{post.author}</h3>
                      <div style={styles.postTimestamp}>
                        <Clock size={14} style={styles.timestampIcon} />
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  {post.author === currentUser && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div style={styles.postContent}>
                  <p style={styles.postText}>{post.content}</p>
                </div>

                {/* Post Actions */}
                <div style={styles.postActions}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      ...styles.actionButton,
                      color: post.likes.includes(currentUser) ? '#ef4444' : '#6b7280'
                    }}
                  >
                    <Heart
                      size={18}
                      fill={post.likes.includes(currentUser) ? 'currentColor' : 'none'}
                      style={styles.actionIcon}
                    />
                    {post.likes.length} likes
                  </button>
                  <button style={styles.actionButton}>
                    <MessageCircle size={18} style={styles.actionIcon} />
                    {post.replies.length} replies
                  </button>
                </div>

                {/* Replies Section */}
                {post.replies.length > 0 && (
                  <div style={styles.repliesSection}>
                    {post.replies.map((reply, index) => (
                      <div key={index} style={styles.replyItem}>
                        <div style={styles.replyContent}>
                          <div style={styles.replyAuthorInfo}>
                            <div style={styles.replyAvatar}>
                              <User size={16} />
                            </div>
                            <div style={styles.replyDetails}>
                              <h4 style={styles.replyAuthorName}>{reply.author}</h4>
                              <p style={styles.replyText}>{reply.content}</p>
                              <div style={styles.replyTimestamp}>
                                <Clock size={12} style={styles.replyTimestampIcon} />
                                {formatTimestamp(reply.timestamp)}
                              </div>
                            </div>
                          </div>
                          {reply.author === currentUser && (
                            <button
                              onClick={() => {
                                setPosts(prev => prev.map(p => {
                                  if (p.id === post.id) {
                                    return {
                                      ...p,
                                      replies: p.replies.filter((_, i) => i !== index)
                                    };
                                  }
                                  return p;
                                }));
                              }}
                              style={styles.replyDeleteButton}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply */}
                <div style={styles.addReplySection}>
                  <div style={styles.addReplyContent}>
                    <div style={styles.replyInputAvatar}>
                      <User size={16} />
                    </div>
                    <div style={styles.replyInputContainer}>
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyContent[post.id] || ''}
                        onChange={(e) =>
                          setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleReply(post.id);
                          }
                        }}
                        style={styles.replyInput}
                      />
                      <button
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent[post.id]?.trim()}
                        style={{
                          ...styles.replyButton,
                          ...(replyContent[post.id]?.trim() ? {} : styles.replyButtonDisabled)
                        }}
                      >
                        <Send size={14} style={styles.buttonIcon} />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// Styles object
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  loginContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  },
  
  loginCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  
  loginTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px'
  },
  
  loginSubtitle: {
    color: '#6b7280',
    marginBottom: '24px'
  },
  
  loginMessage: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '16px',
    color: '#92400e'
  },
  
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },
  
  headerContent: {
    maxWidth: '768px',
    margin: '0 auto',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  
  welcomeText: {
    color: '#374151'
  },
  
  logoutButton: {
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  
  main: {
    maxWidth: '768px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  
  createPostCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  },
  
  createPostContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  
  userAvatar: {
    backgroundColor: '#dbeafe',
    borderRadius: '50%',
    padding: '8px',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  createPostInput: {
    flex: '1'
  },
  
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    resize: 'none',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  },
  
  createPostFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  },
  
  characterCount: {
    fontSize: '14px',
    color: '#6b7280'
  },
  
  postButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  
  postButtonDisabled: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed'
  },
  
  buttonIcon: {
    flexShrink: 0
  },
  
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '32px',
    textAlign: 'center',
    color: '#6b7280'
  },
  
  emptyIcon: {
    margin: '0 auto 16px',
    color: '#d1d5db'
  },
  
  emptyTitle: {
    fontSize: '18px',
    marginBottom: '8px'
  },
  
  emptySubtitle: {
    fontSize: '14px'
  },
  
  postCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  
  postHeader: {
    padding: '24px 24px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  
  postAuthorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  postAvatar: {
    backgroundColor: '#dbeafe',
    borderRadius: '50%',
    padding: '8px',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  postAuthorDetails: {},
  
  authorName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  
  postTimestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  },
  
  timestampIcon: {
    flexShrink: 0
  },
  
  deleteButton: {
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  
  postContent: {
    padding: '0 24px 16px'
  },
  
  postText: {
    color: '#374151',
    lineHeight: '1.6',
    margin: 0
  },
  
  postActions: {
    padding: '16px 24px',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
    padding: '4px'
  },
  
  actionIcon: {
    flexShrink: 0
  },
  
  repliesSection: {
    borderTop: '1px solid #f3f4f6'
  },
  
  replyItem: {
    padding: '16px 16px 16px 48px',
    borderBottom: '1px solid #f9fafb'
  },
  
  replyContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  
  replyAuthorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  
  replyAvatar: {
    backgroundColor: '#f3f4f6',
    borderRadius: '50%',
    padding: '4px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  replyDetails: {
    flex: 1
  },
  
  replyAuthorName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    margin: 0
  },
  
  replyText: {
    color: '#374151',
    fontSize: '14px',
    margin: '4px 0',
    lineHeight: '1.5'
  },
  
  replyTimestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280'
  },
  
  replyTimestampIcon: {
    flexShrink: 0
  },
  
  replyDeleteButton: {
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  
  addReplySection: {
    padding: '16px 16px 16px 48px',
    borderTop: '1px solid #f3f4f6',
    backgroundColor: '#f9fafb'
  },
  
  addReplyContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  
  replyInputAvatar: {
    backgroundColor: '#f3f4f6',
    borderRadius: '50%',
    padding: '4px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px'
  },
  
  replyInputContainer: {
    flex: 1
  },
  
  replyInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  },
  
  replyButton: {
    marginTop: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  
  replyButtonDisabled: {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed'
  }
};

export default Playground;