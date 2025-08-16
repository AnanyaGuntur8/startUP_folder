import React, { useState } from "react";

const Playground = () => {
  const [view, setView] = useState("feed"); // Default view
  const [postText, setPostText] = useState("");

  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#fff",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  };

  const mainStyle = {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  };

  const buttonStyle = {
    textAlign: "left",
    padding: "10px 15px",
    border: "none",
    background: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "10px",
  };

  const buttonHover = {
    backgroundColor: "#f0f4ff",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#e0ebff",
    fontWeight: "bold",
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f7f7f7" }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Playground</h2>
        <button
          style={view === "feed" ? activeButtonStyle : buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = view === "feed" ? "#e0ebff" : "transparent")}
          onClick={() => setView("feed")}
        >
          Feed
        </button>
        <button
          style={view === "slide" ? activeButtonStyle : buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = view === "slide" ? "#e0ebff" : "transparent")}
          onClick={() => setView("slide")}
        >
          Slide
        </button>
        <button
          style={view === "billboard" ? activeButtonStyle : buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = view === "billboard" ? "#e0ebff" : "transparent")}
          onClick={() => setView("billboard")}
        >
          Billboard
        </button>
        <button
          style={view === "library" ? activeButtonStyle : buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#f0f4ff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = view === "library" ? "#e0ebff" : "transparent")}
          onClick={() => setView("library")}
        >
          Library
        </button>
      </aside>

      {/* Main Content */}
      <main style={mainStyle}>
        {view === "feed" && (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Playground Feed</h1>
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
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontWeight: "600" }}>John Doe</h3>
              <p style={{ marginTop: "10px" }}>This is an example post in the Playground.</p>
              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button style={{ color: "#0070f3", background: "none", border: "none", cursor: "pointer" }}>Like</button>
                <button style={{ color: "#555", background: "none", border: "none", cursor: "pointer" }}>Reply</button>
              </div>
            </div>
          </>
        )}

        {view !== "feed" && (
          <div style={{ fontSize: "18px", color: "#333" }}>
            <p>{view.charAt(0).toUpperCase() + view.slice(1)} feature coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Playground;
