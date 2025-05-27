import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedLoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds total
    const stepTime = 20; // update every 20ms
    const totalSteps = duration / stepTime;

    const interval = setInterval(() => {
      start += 1;
      setProgress((start / totalSteps) * 100);
      if (start >= totalSteps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#121212",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* Progress Bar Container */}
      <div
        style={{
          width: "70%",
          height: 14,
          borderRadius: 7,
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "inset 0 0 8px rgba(255, 255, 255, 0.15)",
          overflow: "hidden",
          marginBottom: 30,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          style={{
            height: "100%",
            borderRadius: 7,
            background: "linear-gradient(90deg, #4ade80, #16a34a)",
            boxShadow:
              "0 0 8px #4ade80, 0 0 15px #16a34a",
          }}
        />
      </div>

      {/* Animated company name */}
      <AnimatePresence>
        <motion.h1
          key="questify"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            fontSize: 36,
            fontWeight: "700",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#4ade80",
            letterSpacing: "0.1em",
            userSelect: "none",
            textShadow: "0 0 8px #4ade80",
          }}
        >
          Questify
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLoadingBar;
