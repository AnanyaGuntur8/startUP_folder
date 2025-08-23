import React from "react";
import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <div style={styles.container}>
      {/* Professional City Skyline Blueprint */}
      <svg viewBox="0 0 1000 400" style={styles.skyline}>
        {/* Corporate Tower 1 - Glass facade with grid */}
        <motion.rect
          x="120"
          y="80"
          width="80"
          height="320"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 6, ease: "linear" }}
        />
        {/* Window grid pattern */}
        {[...Array(10)].map((_, row) =>
          [...Array(3)].map((_, col) => (
            <motion.rect
              key={`tower1-${row}-${col}`}
              x={130 + col * 23}
              y={95 + row * 28}
              width="16"
              height="20"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 + row * 0.05 + col * 0.05 }}
            />
          ))
        )}

        {/* Modern Office Complex - Cleaner rectangular design */}
        <motion.rect
          x="230"
          y="160"
          width="90"
          height="240"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="900"
          strokeDashoffset="900"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 6, ease: "linear", delay: 0.5 }}
        />
        {/* Office windows in clean grid */}
        {[...Array(7)].map((_, row) =>
          [...Array(3)].map((_, col) => (
            <motion.rect
              key={`office-${row}-${col}`}
              x={240 + col * 26}
              y={175 + row * 30}
              width="18"
              height="22"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5 + row * 0.08 }}
            />
          ))
        )}

        {/* Corporate Headquarters - Clean stepped design */}
        <motion.rect
          x="350"
          y="120"
          width="70"
          height="280"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="900"
          strokeDashoffset="900"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 6, ease: "linear", delay: 1 }}
        />
        {/* Upper section */}
        <motion.rect
          x="440"
          y="140"
          width="40"
          height="260"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="600"
          strokeDashoffset="600"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 5, ease: "linear", delay: 1.2 }}
        />
        {/* Logo area */}
        <motion.rect
          x="360"
          y="130"
          width="50"
          height="15"
          fill="none"
          stroke="white"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2 }}
        />

        {/* Business Center */}
        <motion.rect
          x="510"
          y="200"
          width="100"
          height="200"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="800"
          strokeDashoffset="800"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 5, ease: "linear", delay: 1.2 }}
        />
        {/* Main entrance */}
        <motion.rect
          x="545"
          y="360"
          width="30"
          height="40"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2.2 }}
        />
        {/* Window rows */}
        {[...Array(5)].map((_, floor) => (
          <motion.g key={`business-floor-${floor}`}>
            <motion.rect
              x={520}
              y={215 + floor * 28}
              width="15"
              height="18"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.5 + floor * 0.1 }}
            />
            <motion.rect
              x={545}
              y={215 + floor * 28}
              width="15"
              height="18"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.5 + floor * 0.1 }}
            />
            <motion.rect
              x={570}
              y={215 + floor * 28}
              width="15"
              height="18"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.5 + floor * 0.1 }}
            />
          </motion.g>
        ))}

        {/* Financial District Tower */}
        <motion.rect
          x="640"
          y="90"
          width="60"
          height="310"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="900"
          strokeDashoffset="900"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 6, ease: "linear", delay: 1.5 }}
        />
        {/* Executive floors with regular windows */}
        {[...Array(9)].map((_, floor) => (
          <motion.g key={`financial-floor-${floor}`}>
            <motion.rect
              x={650}
              y={105 + floor * 32}
              width="12"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.8 + floor * 0.1 }}
            />
            <motion.rect
              x={675}
              y={105 + floor * 32}
              width="12"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.8 + floor * 0.1 }}
            />
          </motion.g>
        ))}

        {/* Tech Campus - Simple modern tower */}
        <motion.rect
          x="730"
          y="140"
          width="80"
          height="260"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="850"
          strokeDashoffset="850"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 6, ease: "linear", delay: 1.8 }}
        />
        {/* Modern glass panels */}
        {[...Array(8)].map((_, floor) => (
          <motion.rect
            key={`tech-floor-${floor}`}
            x={740}
            y={155 + floor * 30}
            width="60"
            height="22"
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 3.2 + floor * 0.1 }}
          />
        ))}

        {/* Blueprint Trees - Hand drawn style */}
        {[80, 850].map((cx, i) => (
          <motion.g key={`tree-${i}`}>
            {/* Tree trunk */}
            <motion.rect
              x={cx - 4}
              y="360"
              width="8"
              height="40"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="100"
              strokeDashoffset="100"
              initial={{ opacity: 0.3 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, delay: 4 + i * 0.3 }}
            />
            {/* Tree crown - sketchy circles */}
            <motion.circle
              cx={cx}
              cy="335"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="160"
              strokeDashoffset="160"
              initial={{ opacity: 0.3 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, delay: 4.5 + i * 0.3 }}
            />
            {/* Inner detail circle */}
            <motion.circle
              cx={cx - 8}
              cy="335"
              r="12"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="80"
              strokeDashoffset="80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2, delay: 5 + i * 0.3 }}
            />
            <motion.circle
              cx={cx + 6}
              cy="345"
              r="8"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="50"
              strokeDashoffset="50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2, delay: 5.2 + i * 0.3 }}
            />
          </motion.g>
        ))}

        {/* Additional smaller trees */}
        {[380, 590, 720].map((cx, i) => (
          <motion.g key={`small-tree-${i}`}>
            <motion.rect
              x={cx - 2}
              y="370"
              width="4"
              height="30"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="60"
              strokeDashoffset="60"
              initial={{ opacity: 0.3 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, delay: 5.5 + i * 0.2 }}
            />
            <motion.circle
              cx={cx}
              cy="355"
              r="15"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="95"
              strokeDashoffset="95"
              initial={{ opacity: 0.3 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, delay: 6 + i * 0.2 }}
            />
          </motion.g>
        ))}

        {/* Ground level details */}
        <motion.line
          x1="50"
          y1="400"
          x2="870"
          y2="400"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="1500"
          strokeDashoffset="1500"
          initial={{ opacity: 0.3 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 8, ease: "linear", delay: 3 }}
        />

        {/* Blueprint dimension lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 4 }}
        >
        </motion.g>
      </svg>

      {/* Blueprint Title - Typed Text Style */}
      <div style={styles.titleContainer}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7, duration: 1 }}
        >
          <span style={styles.startText}>Start</span>
          <span style={styles.upText}>UP</span>
        </motion.div>
        
        {/* Blueprint construction lines */}
        <motion.div
          style={styles.constructionLines}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 6.5 }}
        >
          {/* <div style={styles.topLine}></div>
          <div style={styles.middleLine}></div>
          <div style={styles.bottomLine}></div> */}
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#031B4F", // deeper blueprint blue
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "'Courier New', monospace", // blueprint font
  },
  skyline: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  titleContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    textAlign: "center",
  },
  startText: {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: 400,
    color: "white",
    fontFamily: "'Quicksand', 'Inter', sans-serif",
    letterSpacing: "2px",
  },
  upText: {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: 700,
    color: "white",
    fontFamily: "'Quicksand', 'Inter', sans-serif",
    letterSpacing: "2px",
  },
  constructionLines: {
    position: "absolute",
    width: "120%",
    height: "100%",
    left: "-10%",
    top: "0",
    pointerEvents: "none",
  },
  topLine: {
    position: "absolute",
    top: "20%",
    width: "100%",
    height: "1px",
    background: "white",
    borderStyle: "dashed",
    borderWidth: "1px 0 0 0",
    borderColor: "white",
  },
  middleLine: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: "1px",
    background: "white",
    borderStyle: "dashed",
    borderWidth: "1px 0 0 0",
    borderColor: "white",
  },
  bottomLine: {
    position: "absolute",
    top: "80%",
    width: "100%",
    height: "1px",
    background: "white",
    borderStyle: "dashed",
    borderWidth: "1px 0 0 0",
    borderColor: "white",
  },
};

export default Welcome;
