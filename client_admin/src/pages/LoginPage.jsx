// Admin login page for The Abel Experience dashboard
// I wanted this to have a cyberpunk/sci-fi aesthetic that matches the overall theme
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const isDev = import.meta?.env?.MODE === "development";
  const [email, setEmail] = useState(isDev ? "" : "");
  const [password, setPassword] = useState(isDev ? "" : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Registration moved to dedicated RegisterPage
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // More dramatic floating animation variants for background elements
  // legacy inline variants removed (moved to factory above)

  return (
    // Full screen container with static background (animations removed)
    <main
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background text-text-main"
      aria-labelledby="login-title"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, var(--color-secondary) 0%, transparent 55%), radial-gradient(circle at 70% 30%, var(--color-primary) 0%, transparent 55%), linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 80%)",
        }}
      />
      <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-background/60" />

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
            id="login-title"
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

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            aria-describedby={error ? "login-error" : undefined}
          >
            {/* Email input */}
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
                autoComplete="email"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(66, 98, 128, 0.5)",
                }}
              />
            </div>

            {/* Password input */}
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 focus:bg-white/10 focus:border-primary/40 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                    boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  required
                  autoComplete="current-password"
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(66, 98, 128, 0.5)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/80 hover:text-primary transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Error message */}
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
                id="login-error"
                role="alert"
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
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-primary/50 drop-shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundSize: "200% 100%" }}
            >
              {/* Shimmer effect overlay */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting && (
                  <span
                    className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isSubmitting ? "Logging In..." : "Log In"}
              </span>
            </motion.button>
            <div className="text-center text-xs text-text-secondary pt-2">
              <Link to="/register" className="text-primary hover:underline">
                Need an account? Register
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
