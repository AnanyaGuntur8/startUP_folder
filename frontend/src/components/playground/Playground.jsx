import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Trash2, User, Clock, Plus } from 'lucide-react';

const Playground = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8000/playground';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Ensure user has an ID
        if (!user.id) {
          console.error('User object missing ID:', user);
          setError('User ID is missing. Please log in again.');
          return;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        setError('Invalid user data. Please log in again.');
        return;
      }
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Make sure we have a valid user_id from the token
        if (!payload.user_id) {
          console.error('Token missing user_id:', payload);
          setError('Invalid token. Please log in again.');
          localStorage.removeItem('access_token');
          return;
        }
        const user = {
          id: payload.user_id,
          name: payload.name || payload.sub,
          email: payload.sub
        };
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('access_token');
        setError('Invalid token. Please log in again.');
        return;
      }
    }
    
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      console.log('Fetching posts from:', `${API_BASE}/feed`);
      const response = await fetch(`${API_BASE}/feed`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Posts loaded successfully:', data);
      
      // Sort posts by timestamp (newest first)
      const sortedPosts = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(sortedPosts);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError(`Failed to load posts: ${error.message}`);
      setPosts([]);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) {
      setError('Post content cannot be empty');
      return;
    }
    
    if (!currentUser?.id) {
      setError('User ID is missing. Please refresh and log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating post with payload:', {
        user_id: currentUser.id,
        content: newPost.trim()
      });

      const response = await fetch(`${API_BASE}/post`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          content: newPost.trim()
        })
      });

      console.log('Create post response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const savedPost = await response.json();
      console.log('Post created successfully:', savedPost);
      
      // Add the new post to the top of the list
      setPosts(prev => [savedPost, ...prev]);
      setNewPost('');
    } catch (error) {
      console.error('Failed to create post:', error);
      setError(`Failed to create post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`${API_BASE}/like/post/${postId}?user_id=${currentUser.id}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Reload posts to get updated likes
        loadPosts();
      } else {
        console.error('Failed to like post, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleReply = async (postId) => {
    const content = replyContent[postId];
    if (!content?.trim() || !currentUser?.id) return;

    try {
      const response = await fetch(`${API_BASE}/reply/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: currentUser.id, 
          content: content.trim() 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newReply = await response.json();

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...(post.replies || []), newReply]
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
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`${API_BASE}/post/${postId}?user_id=${currentUser.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        console.error('Failed to delete post, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    if (!currentUser?.id) return;
    
    try {
      const response = await fetch(`${API_BASE}/reply/${replyId}?user_id=${currentUser.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              replies: (post.replies || []).filter(r => r.id !== replyId)
            };
          }
          return post;
        }));
      } else {
        console.error('Failed to delete reply, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
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
          {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Playground</h1>
          <div style={styles.userInfo}>
            <span style={styles.welcomeText}>Welcome, {currentUser.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('access_token');
                setCurrentUser(null);
              }}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

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
                  disabled={loading}
                  maxLength="500"
                />
                <div style={styles.createPostFooter}>
                  <div style={styles.characterCount}>
                    {newPost.length}/500 characters
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim() || loading}
                    style={{
                      ...styles.postButton,
                      ...((!newPost.trim() || loading) ? styles.postButtonDisabled : {})
                    }}
                  >
                    <Plus size={16} style={styles.buttonIcon} />
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div style={styles.feed}>
          {posts.length === 0 ? (
            <div style={styles.emptyState}>
              <MessageCircle size={48} style={styles.emptyIcon} />
              <p style={styles.emptyTitle}>No posts yet</p>
              <p style={{color: '#666', fontSize: '14px'}}>Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <div style={styles.postHeader}>
                  <div style={styles.postAuthorInfo}>
                    <div style={styles.postAvatar}>
                      <User size={20} />
                    </div>
                    <div style={styles.postAuthorDetails}>
                      <h3 style={styles.authorName}>{post.user_name}</h3>
                      <div style={styles.postTimestamp}>
                        <Clock size={14} style={styles.timestampIcon} />
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  {post.user_id === currentUser.id && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div style={styles.postContent}>
                  <p style={styles.postText}>{post.content}</p>
                </div>

                <div style={styles.postActions}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      ...styles.actionButton,
                      color: (post.likes || []).includes(currentUser.name) ? '#ef4444' : '#6b7280'
                    }}
                  >
                    <Heart
                      size={18}
                      fill={(post.likes || []).includes(currentUser.name) ? 'currentColor' : 'none'}
                      style={styles.actionIcon}
                    />
                    {(post.likes || []).length} likes
                  </button>
                  <button style={styles.actionButton}>
                    <MessageCircle size={18} style={styles.actionIcon} />
                    {(post.replies || []).length} replies
                  </button>
                </div>

                {post.replies && post.replies.length > 0 && (
                  <div style={styles.repliesSection}>
                    {post.replies.map((reply) => (
                      <div key={reply.id} style={styles.replyItem}>
                        <div style={styles.replyContent}>
                          <div style={styles.replyAuthorInfo}>
                            <div style={styles.replyAvatar}>
                              <User size={16} />
                            </div>
                            <div style={styles.replyDetails}>
                              <h4 style={styles.replyAuthorName}>{reply.user_name}</h4>
                              <p style={styles.replyText}>{reply.content}</p>
                              <div style={styles.replyTimestamp}>
                                <Clock size={12} style={styles.replyTimestampIcon} />
                                {formatTimestamp(reply.timestamp)}
                              </div>
                            </div>
                          </div>
                          {reply.user_id === currentUser.id && (
                            <button
                              onClick={() => handleDeleteReply(post.id, reply.id)}
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
                          ...(!replyContent[post.id]?.trim() ? styles.replyButtonDisabled : {})
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