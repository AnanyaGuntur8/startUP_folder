import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Welcome from "./Welcome";

export default function WelcomeWrapper() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);

      setTimeout(() => {
        navigate("/auth");
      }, 1000); // duration matches exit animation
    }, 9000); // adjust to your welcome animation duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#031B4F", // same background color as Welcome
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            <Welcome />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
