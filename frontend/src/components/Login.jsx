import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate("/console");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-shell">
      {/* Left: White form panel */}
      <div className="form-pane">
        <div className="form-card">
          <h1 className="brand">
          </h1>
          <h2 className="title">Sign in</h2>
          <p className="subtitle">Welcome back. Enter your details below.</p>

          <form onSubmit={handleLogin} className="form">
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
              autoComplete="current-password"
            />

            <button type="submit" className="submit">Continue</button>
          </form>

          <div className="footer-actions">
            <button className="text-link" onClick={() => navigate("/register")}>
              Create an account
            </button>
          </div>
        </div>
      </div>

      {/* Right: Blueprint side with skyline + airplane */}
      <div className="blueprint-pane">
        <svg viewBox="0 0 1000 600" className="blueprint-svg" aria-hidden>
          {/* Ground line */}
          <motion.line
            x1="50" y1="520" x2="950" y2="520"
            stroke="white" strokeWidth="2"
            strokeDasharray="1200" strokeDashoffset="1200"
            initial={{ opacity: 0.5 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          />

          {/* A few simple buildings (clean, non-glowy) */}
          <motion.rect
            x="130" y="240" width="90" height="280"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="800" strokeDashoffset="800"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "linear", delay: 0.4 }}
          />
          <motion.rect
            x="260" y="280" width="110" height="240"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="800" strokeDashoffset="800"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "linear", delay: 0.5 }}
          />
          <motion.rect
            x="410" y="220" width="80" height="300"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="900" strokeDashoffset="900"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2.2, ease: "linear", delay: 0.6 }}
          />
          <motion.rect
            x="520" y="320" width="120" height="200"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="700" strokeDashoffset="700"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear", delay: 0.7 }}
          />
          <motion.rect
            x="670" y="250" width="70" height="270"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="800" strokeDashoffset="800"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear", delay: 0.8 }}
          />
          <motion.rect
            x="760" y="300" width="90" height="220"
            fill="none" stroke="white" strokeWidth="1.5"
            strokeDasharray="700" strokeDashoffset="700"
            initial={{ opacity: 0.6 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear", delay: 0.9 }}
          />

          {/* Airplane (simple silhouette) */}
          <motion.g
            initial={{ x: -120, y: 80, opacity: 0.9 }}
            animate={{ x: 1120, y: 60, opacity: 0.9 }}
            transition={{ duration: 9, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
          >
            {/* contrail */}
            <line x1="-200" y1="100" x2="-20" y2="100" stroke="white" strokeWidth="1" opacity="0.35"/>
            {/* airplane body */}
            <path
              d="M0,92 L40,100 L0,108 L8,102 Z"
              fill="white"
              opacity="0.85"
            />
            {/* tail */}
            <path d="M6,100 L-8,92 L-6,108 Z" fill="white" opacity="0.85" />
          </motion.g>

          {/* subtle guide marks */}
          <g opacity="0.2">
            <line x1="80" y1="560" x2="80" y2="80" stroke="white" strokeDasharray="6 8"/>
            <line x1="920" y1="560" x2="920" y2="80" stroke="white" strokeDasharray="6 8"/>
          </g>
        </svg>
        <div className="tagline">
          Build. Launch. Grow.
        </div>
      </div>

      {/* inline CSS for layout + responsiveness */}
      <style>{`
        .login-shell {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #ffffff;
        }
        .form-pane {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }
        .form-card {
          width: 100%;
          max-width: 420px;
          padding: 40px 32px;
        }
        .brand {
          margin: 0 0 24px 0;
          font-family: 'Quicksand', 'Inter', sans-serif;
          letter-spacing: 2px;
        }
        .brand-light {
          font-weight: 400;
          font-size: 28px;
          color: #0F172A;
          margin-right: 6px;
        }
        .brand-bold {
          font-weight: 700;
          font-size: 28px;
          color: #0F172A;
        }
        .title {
          margin: 0 0 8px 0;
          font-size: 24px;
          fontFamily: "'Quicksand', 'Inter', sans-serif",
          font-weight: 600;
          color: #0F172A;
        }
        .subtitle {
          margin: 0 0 28px 0;
          fontFamily: "'Quicksand', 'Inter', sans-serif",
          color: #475569;
          font-size: 14px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .label {
          font-size: 13px;
          color: #334155;
        }
        .input {
          height: 44px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0 12px;
          font-size: 14px;
          outline: none;
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .input:focus {
          border-color: #94A3B8;
          box-shadow: 0 0 0 4px rgba(3, 27, 79, 0.08);
        }
        .submit {
          margin-top: 8px;
          height: 46px;
          border: none;
          border-radius: 10px;
          background: #031B4F;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
        }
        .submit:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(3,27,79,0.15); }
        .submit:active { transform: translateY(0); box-shadow: none; }
        .text-link {
          background: transparent;
          border: none;
          color: #031B4F;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .text-link:hover { text-decoration: underline; }

        .footer-actions {
          margin-top: 16px;
        }

        .blueprint-pane {
          flex: 1;
          background: #031B4F;
          color: #fff;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blueprint-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .tagline {
          position: relative;
          z-index: 1;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          letter-spacing: 3px;
          opacity: 0.7;
          top: 34%;
          text-transform: uppercase;
        }

        /* Responsive: stack on small screens */
        @media (max-width: 900px) {
          .login-shell { flex-direction: column; }
          .blueprint-pane { height: 40vh; }
          .form-card { max-width: 520px; }
        }
      `}</style>
    </div>
  );
}
