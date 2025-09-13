import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const isDev = import.meta?.env?.MODE === 'development';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !username) {
      setError('Please fill required fields (username now required)');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
  await register({ email, password, username, role });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background text-text-main"
      aria-labelledby="register-title"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 30% 70%, var(--color-secondary) 0%, transparent 55%), radial-gradient(circle at 70% 30%, var(--color-primary) 0%, transparent 55%), linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 80%)',
        }}
      />
      <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-background/60" />
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-20 w-full max-w-md p-8 bg-surface/10 backdrop-blur-s rounded-2xl shadow-2xl border border-primary/20"
      >
        <motion.h1
          id="register-title"
            initial={{ opacity: 0, scale: 0.5, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 180 }}
            className="text-3xl font-extrabold text-center text-tertiary tracking-tight mb-6"
        >
          Create Account
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-describedby={error ? 'register-error' : undefined}>
          {/* Email */}
          <label htmlFor="reg-email" className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary">Email</label>
          <div className="relative mb-2">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
              autoComplete="email"
            />
          </div>
          {/* Username */}
          <label htmlFor="reg-username" className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary">Username</label>
          <div className="relative mb-2">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              autoComplete="username"
              required
            />
          </div>
          {isDev && (
            <div className="mb-2">
              <label htmlFor="reg-role" className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary">Role (dev only)</label>
              <select
                id="reg-role"
                value={role}
                onChange={e=>setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <p className="text-[10px] mt-1 text-text-secondary">Admin accepted only if no admin exists yet.</p>
            </div>
          )}
          {/* Password */}
          <label htmlFor="reg-password" className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary">Password (min 6 chars)</label>
          <div className="relative mb-2">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/80 hover:text-primary"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {/* Confirm Password */}
          <label htmlFor="reg-confirm" className="block mb-1 text-sm font-semibold uppercase tracking-wide text-tertiary">Confirm Password</label>
          <div className="relative mb-2">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white/5 backdrop-blur-md text-text-main rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p id="register-error" role="alert" className="text-center text-status-danger font-medium bg-status-danger/10 p-3 rounded-lg border border-status-danger/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition disabled:opacity-60"
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>

          <div className="text-center text-xs text-text-secondary pt-2">
            <Link to="/login" className="text-primary hover:underline">Already have an account? Log In</Link>
          </div>
        </form>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
