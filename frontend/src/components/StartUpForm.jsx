import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StartupForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get userId from state passed in navigate
  const userId = location.state?.userId;

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [fundingMin, setFundingMin] = useState("");
  const [fundingMax, setFundingMax] = useState("");

  // Redirect if no userId found
  useEffect(() => {
    if (!userId) {
      alert("No user ID found. Redirecting to register.");
      navigate("/register");
    }
  }, [userId, navigate]);

  const renderButtonGroup = (label, options, selected, setSelected) => (
    <div className="form-group">
      <label className="label">{label}</label>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
        {options.map((opt) => (
          <motion.button
            key={opt}
            type="button"
            onClick={() => setSelected(opt)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: selected === opt ? "#E0E7FF" : "#fff",
              borderColor: selected === opt ? "#2563EB" : "#ccc",
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
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const payload = {
      business_name: businessName,
      owner_name: "Owner Name", // Replace with actual user info if available
      business_address: businessAddress,
      city,
      state,
      country,
      industry,
      stage,
      funding_min: fundingMin,
      funding_max: fundingMax,
      owner_id: userId,
    };

    try {
      const res = await fetch("http://localhost:8000/startups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create startup");

      await res.json();
      alert("Startup created successfully!");
      navigate("/console");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="form-shell">
      {/* Left: Form side */}
      <div className="form-pane">
        <div className="form-card">
          <h2 className="title">Create Your Startup</h2>
          <p className="subtitle">Tell us more about your venture.</p>

          <form onSubmit={handleSubmit} className="form">
            <label className="label" htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              className="input"
              placeholder="e.g., Codify Tech"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <label className="label" htmlFor="businessAddress">Business Location</label>
            <input
              id="businessAddress"
              className="input"
              placeholder="123 Main St"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              required
            />

            <label className="label" htmlFor="city">City</label>
            <input
              id="city"
              className="input"
              placeholder="e.g., New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <label className="label" htmlFor="state">State / Province</label>
            <input
              id="state"
              className="input"
              placeholder="e.g., NY"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />

            <label className="label" htmlFor="country">Country</label>
            <input
              id="country"
              className="input"
              placeholder="e.g., USA"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            {renderButtonGroup("Industry", ["Tech", "Healthcare", "Retail", "Finance"], industry, setIndustry)}
            {renderButtonGroup("Stage", ["Seed", "Early-Stage", "Series A", "Series B"], stage, setStage)}
            {renderButtonGroup("Funding Min", ["50k", "500k", "5M"], fundingMin, setFundingMin)}
            {renderButtonGroup("Funding Max", ["50k", "500k", "5M"], fundingMax, setFundingMax)}

            <button type="submit" className="submit">Submit Startup Info</button>
          </form>
        </div>
      </div>

      {/* Right: Blueprint style */}
      <div className="blueprint-pane">
        <svg viewBox="0 0 600 600" className="blueprint-svg" aria-hidden>
          {/* Ground line */}
          <line x1="70" y1="500" x2="550" y2="500" stroke="white" strokeWidth="0.5" />

          {/* Main startup building outline */}
          <motion.rect
            x="200" y="220" width="200" height="260"
            fill="none" stroke="white" strokeWidth="0.5"
            strokeDasharray="1000" strokeDashoffset="1000"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear", delay: 0.5 }}
          />

          {/* Windows */}
          {[...Array(4)].map((_, row) =>
            [...Array(3)].map((_, col) => (
              <motion.rect
                key={`${row}-${col}`}
                x={220 + col * 50} y={240 + row * 60} width="30" height="30"
                fill="none" stroke="white" strokeWidth="0.5"
                strokeDasharray="120" strokeDashoffset="120"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6, delay: 2 + row * 0.4 + col * 0.2, ease: "easeOut" }}
              />
            ))
          )}
        </svg>
        <div className="tagline">Launch your dream.</div>
      </div>

      <style>{`
        .form-shell { display: flex; min-height: 100vh; width: 100%; background: #ffffff; }
        .form-pane { flex: 1; display: flex; align-items: center; justify-content: center; background: #ffffff; }
        .form-card { width: 100%; max-width: 480px; padding: 40px 32px; }
        .title { margin: 0 0 8px 0; font-size: 24px; font-family: 'Quicksand', 'Inter', sans-serif; font-weight: 600; color: #0F172A; }
        .subtitle { margin: 0 0 28px 0; font-family: 'Quicksand', 'Inter', sans-serif; color: #475569; font-size: 14px; }
        .form { display: flex; flex-direction: column; gap: 14px; }
        .label { font-size: 13px; color: #334155; }
        .input { height: 44px; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0 12px; font-size: 14px; outline: none; transition: box-shadow 150ms ease, border-color 150ms ease; }
        .input:focus { border-color: #94A3B8; box-shadow: 0 0 0 4px rgba(3, 27, 79, 0.08); }
        .submit { margin-top: 8px; height: 46px; border: none; border-radius: 10px; background: #031B4F; color: #fff; font-weight: 600; font-size: 15px; cursor: pointer; transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease; }
        .submit:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(3,27,79,0.15); }
        .submit:active { transform: translateY(0); box-shadow: none; }
        .form-group { margin-top: 12px; }
        .blueprint-pane { flex: 1; background: #031B4F; color: #fff; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .blueprint-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .tagline { position: relative; z-index: 1; font-family: 'Courier New', monospace; font-size: 14px; letter-spacing: 3px; opacity: 0.7; top: 34%; text-transform: uppercase; }
        @media (max-width: 900px) { .form-shell { flex-direction: column; } .blueprint-pane { height: 40vh; } .form-card { max-width: 520px; } }
      `}</style>
    </div>
  );
}
