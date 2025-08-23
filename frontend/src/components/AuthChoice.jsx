import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.box}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>Choose an option to continue</p>
        <div style={styles.buttonGroup}>
          <button style={styles.loginButton} onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            style={styles.registerButton}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#031B4F", // same as Welcome
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Quicksand', 'Inter', sans-serif",
  },
  box: {
    textAlign: "center",
    padding: "40px",
    border: "1.5px solid white", // blueprint outline
    borderRadius: "12px",
    backgroundColor: "rgba(3, 27, 79, 0.85)", // transparent blueprint overlay
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#cfd8e3", // softer blueprint white
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  loginButton: {
    flex: 1,
    padding: "12px 24px",
    border: "1.5px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  registerButton: {
    flex: 1,
    padding: "12px 24px",
    border: "1.5px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// Add hover manually (clean + professional, not glowing neon)
styles.loginButton[":hover"] = { backgroundColor: "white", color: "#031B4F" };
styles.registerButton[":hover"] = { backgroundColor: "white", color: "#031B4F" };

export default AuthChoice;
