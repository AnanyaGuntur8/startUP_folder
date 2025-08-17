const API_URL = "http://localhost:5173/playground";

export const fetchFeed = async (tab = "recommended", user = null) => {
  const url = user
    ? `${API_URL}/feed?tab=${tab}&user=${user}`
    : `${API_URL}/feed?tab=${tab}`;
  const res = await fetch(url);
  return res.json();
};

export const createPost = async (author, content) => {
  const res = await fetch(`${API_URL}/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, content }),
  });
  return res.json();
};

export const addReply = async (postId, author, content) => {
  const res = await fetch(`${API_URL}/reply/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, content }),
  });
  return res.json();
};

export const likePost = async (postId) => {
  const res = await fetch(`${API_URL}/like/${postId}`, { method: "POST" });
  return res.json();
};
