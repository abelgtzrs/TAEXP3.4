// Admin login page for The Abel Experience dashboard
// I wanted this to have a cyberpunk/sci-fi aesthetic that matches the overall theme
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth(); // Using my auth context for login functionality

  // Pre-filling with my credentials for development - TODO: remove for production
  const [email, setEmail] = useState("abelgutierrezrivas@gmail.com");
  const [password, setPassword] = useState("ODE2theMETS");
  const [error, setError] = useState("");

  // Handle form submission with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      await login(email, password); // Auth context handles the actual login logic
      // navigation happens inside login()
    } catch (err) {
      // Display user-friendly error message
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  // More dramatic floating animation variants for background elements
  const blob = {
    animate: (i) => ({
      x: ["-15%", "15%", "-10%", "8%", "-5%"], // More dramatic movement with multiple waypoints
      y: ["-12%", "12%", "-8%", "10%", "-6%"], // Complex vertical movement
      scale: [1, 1.3, 0.8, 1.2, 1], // Dramatic scaling with variance
      rotate: [0, 180, -90, 270, 0], // Full rotation cycles
      transition: {
        duration: 25 + i * 8, // Longer duration for more complex animation
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for dramatic easing
        repeat: Infinity,
      },
    }),
  };

  // Particle-like floating elements animation
  const particle = {
    animate: (i) => ({
      y: ["-100vh", "100vh"], // Fall from top to bottom
      x: ["-20px", "20px", "-15px", "10px"], // Slight horizontal drift
      opacity: [0, 1, 1, 0], // Fade in and out
      scale: [0.5, 1, 0.8, 0.3], // Size variation during fall
      transition: {
        duration: 15 + Math.random() * 10, // Random duration for organic feel
        delay: i * 2, // Staggered start times
        ease: "linear",
        repeat: Infinity,
      },
    }),
  };

  return (
    // Full screen container with dark gradient background - going for that cyberpunk aesthetic
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background text-text-main">
      {/* Dramatic animated gradient backdrop with multiple layers */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(45deg, var(--color-primary) 0%, var(--color-secondary) 30%, var(--color-surface) 60%, var(--color-primary) 100%)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Secondary animated layer for depth */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 z-1"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 70%, var(--color-secondary) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--color-primary) 0%, transparent 50%)",
        }}
      />

      {/* Enhanced glass overlay with pulsing effect */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 backdrop-blur-[3px] bg-background/50 z-10"
      />

      {/* Floating particles for ambience */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          custom={i}
          variants={particle}
          animate="animate"
          className="absolute w-1 h-1 bg-primary/30 rounded-full z-5"
          style={{
            left: `${10 + i * 10}%`,
          }}
        />
      ))}

      {/* Dramatic floating color blobs with complex animations */}
      {[...Array(4)].map((_, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={blob}
          animate="animate"
          className="absolute z-0 w-96 h-96 rounded-full opacity-25 mix-blend-screen" // Increased opacity for drama
          style={{
            background:
              i % 3 === 0
                ? `radial-gradient(circle at 30% 30%, var(--color-primary), var(--color-secondary) 70%)`
                : i % 3 === 1
                ? `radial-gradient(circle at 70% 70%, var(--color-secondary), var(--color-primary) 70%)`
                : `conic-gradient(from ${
                    i * 90
                  }deg, var(--color-primary), var(--color-secondary), var(--color-surface), var(--color-primary))`,
            filter: "blur(100px)", // Less blur for more visible effect
            left: `${i * 25}%`,
            top: `${i * 20}%`,
          }}
        />
      ))}

      {/* Login card with dramatic entrance animation and glassmorphism */}
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8, rotateX: -30 }} // More dramatic entrance
        animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for dramatic effect
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        whileHover={{
          scale: 1.02,
          rotateY: 2,
          transition: { duration: 0.3 },
        }}
        className="relative z-20 w-full max-w-md p-8 bg-surface/10 backdrop-blur-s rounded-2xl shadow-2xl border border-primary/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:via-transparent before:to-secondary/10 before:rounded-2xl before:-z-10"
        style={{
          perspective: "100px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}
      >
        <div className="space-y-6">
          {/* Title with dramatic glow and typing effect */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px var(--color-primary)",
              transition: { duration: 0.2 },
            }}
            className="text-3xl font-extrabold text-center text-tertiary tracking-tight drop-shadow-lg"
          >
            Admin Panel Login
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input with dramatic focus animations */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{
                delay: 0.7,
                duration: 0.6,
                type: "spring",
                stiffness: 150,
              }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileFocus={{ scale: 1.05, boxShadow: "0 0 25px var(--color-primary)" }}
            >
              <motion.label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Email
              </motion.label>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <FiMail className="text-primary" />
                </motion.div>
                <motion.input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 focus:bg-white/10 focus:border-primary/40 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                    boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(66, 98, 128, 0.5)",
                  }}
                />
              </div>
            </motion.div>

            {/* Password input with dramatic focus animations */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{
                delay: 1.0,
                duration: 0.6,
                type: "spring",
                stiffness: 150,
              }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileFocus={{ scale: 1.05, boxShadow: "0 0 25px var(--color-primary)" }}
            >
              <motion.label
                htmlFor="password"
                className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Password
              </motion.label>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <FiLock className="text-primary" />
                </motion.div>
                <motion.input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 focus:bg-white/10 focus:border-primary/40 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                    boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(66, 98, 128, 0.5)",
                  }}
                />
              </div>
            </motion.div>

            {/* Error message with dramatic shake animation */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  x: [0, -5, 5, -5, 5, 0], // Shake effect
                }}
                transition={{
                  duration: 0.6,
                  x: { duration: 0.4, ease: "easeInOut" },
                }}
                className="text-center text-status-danger font-medium bg-status-danger/10 backdrop-blur-md p-3 rounded-lg border border-status-danger/30 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(220, 38, 127, 0.1), rgba(220, 38, 127, 0.05))",
                  boxShadow: "0 4px 16px 0 rgba(220, 38, 127, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit button with dramatic hover and press effects */}
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 1.3,
                duration: 0.7,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 10px 30px rgba(66, 98, 128, 0.4)",
                backgroundPosition: "100% 0%",
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: 0.95,
                y: 0,
                transition: { duration: 0.1 },
              }}
              type="submit"
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-primary/50 drop-shadow-lg relative overflow-hidden"
              style={{ backgroundSize: "200% 100%" }}
            >
              {/* Shimmer effect overlay */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative z-10">Log&nbsp;In</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
