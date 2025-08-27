import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select a user type");
      return;
    }

    try {
        const res = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, user_type: userType }),
        });
  
        if (!res.ok) throw new Error("Registration failed");
  
        const data = await res.json();
  
        // Redirect based on user type
        if (userType === "Business") {
            navigate("/startup-form", { state: { userId: data.user_id } });
        } else {
          navigate("/console"); // or wherever non-business users go
        }
      } catch (err) {
        alert("Error registering user.");
      }
    };

  return (
    <div className="login-shell">
      {/* Left: White form panel */}
      <div className="form-pane">
        <div className="form-card">
          <h2 className="title">Create account</h2>
          <p className="subtitle">Start building with us today.</p>

          <form onSubmit={handleRegister} className="form">
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {/* --- User Type Selection --- */}
            <div style={{ margin: "16px 0" }}>
              <label className="label">Select User Type</label>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                {["Business", "Investor", "User"].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundColor: userType === type ? "#E0E7FF" : "#fff",
                      borderColor: userType === type ? "#2563EB" : "#ccc",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "2px solid",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#031B4F",
                    }}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            <button type="submit" className="submit">Register</button>
          </form>

          <div className="footer-actions">
            <button className="text-link" onClick={() => navigate("/login")}>
              Already have an account?
            </button>
          </div>
        </div>
      </div>

      {/* Right: Blueprint side with building being drawn */}
      <div className="blueprint-pane">
        <svg viewBox="0 0 600 600" className="blueprint-svg" aria-hidden>
          {/* --- Background side buildings (static) --- */}
          <rect x="120" y="280" width="60" height="220" fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          <rect x="420" y="250" width="80" height="250" fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />

          {/* Ground line (static) */}
          <line x1="70" y1="500" x2="550" y2="500" stroke="white" strokeWidth="0.5" />

          {/* Main skyscraper body */}
          <motion.rect
            x="200" y="200" width="200" height="300"
            fill="none" stroke="white" strokeWidth="0.5"
            strokeDasharray="1200" strokeDashoffset="1200"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.5, ease: "linear", delay: 0.5 }}
          />

          {/* Windows: 5 rows × 3 columns */}
          {[...Array(5)].map((_, row) =>
            [...Array(3)].map((_, col) => (
              <motion.rect
                key={`${row}-${col}`}
                x={220 + col * 50} y={220 + row * 50} width="30" height="30"
                fill="none" stroke="white" strokeWidth="0.5"
                strokeDasharray="120" strokeDashoffset="120"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6, delay: 3 + row * 0.4 + col * 0.2, ease: "easeOut" }}
              />
            ))
          )}

          {/* Subtle vertical dashed guide lines */}
          <g opacity="0.2">
            <line x1="80" y1="520" x2="80" y2="100" stroke="white" strokeDasharray="6 8"/>
            <line x1="540" y1="520" x2="540" y2="100" stroke="white" strokeDasharray="6 8"/>
          </g>
        </svg>
        <div className="tagline">Build your future.</div>
      </div>

      <style>{`
        .login-shell { display: flex; min-height: 100vh; width: 100%; background: #ffffff; }
        .form-pane { flex: 1; display: flex; align-items: center; justify-content: center; background: #ffffff; }
        .form-card { width: 100%; max-width: 420px; padding: 40px 32px; }
        .title { margin: 0 0 8px 0; font-size: 24px; font-family: 'Quicksand', 'Inter', sans-serif; font-weight: 600; color: #0F172A; }
        .subtitle { margin: 0 0 28px 0; font-family: 'Quicksand', 'Inter', sans-serif; color: #475569; font-size: 14px; }
        .form { display: flex; flex-direction: column; gap: 14px; }
        .label { font-size: 13px; color: #334155; }
        .input { height: 44px; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0 12px; font-size: 14px; outline: none; transition: box-shadow 150ms ease, border-color 150ms ease; }
        .input:focus { border-color: #94A3B8; box-shadow: 0 0 0 4px rgba(3, 27, 79, 0.08); }
        .submit { margin-top: 8px; height: 46px; border: none; border-radius: 10px; background: #031B4F; color: #fff; font-weight: 600; font-size: 15px; cursor: pointer; transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease; }
        .submit:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(3,27,79,0.15); }
        .submit:active { transform: translateY(0); box-shadow: none; }
        .text-link { background: transparent; border: none; color: #031B4F; font-weight: 600; cursor: pointer; padding: 0; }
        .text-link:hover { text-decoration: underline; }
        .footer-actions { margin-top: 16px; }
        .blueprint-pane { flex: 1; background: #031B4F; color: #fff; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .blueprint-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .tagline { position: relative; z-index: 1; font-family: 'Courier New', monospace; font-size: 14px; letter-spacing: 3px; opacity: 0.7; top: 34%; text-transform: uppercase; }
        @media (max-width: 900px) { .login-shell { flex-direction: column; } .blueprint-pane { height: 40vh; } .form-card { max-width: 520px; } }
      `}</style>
    </div>
  );
}
