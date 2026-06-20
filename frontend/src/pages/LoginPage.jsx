import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password); // get user back

      if (data.role === "admin") {
        navigate("/admin"); // admin route
      } else {
        navigate("/dashboard"); //  normal user
      }
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Stagger container variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  // Item animation for elements drifting up into view smoothly
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    // Changed min-h to screen, dropped arbitrary top percentages for structural layout flexibility
    <div className="min-h-lvh w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-neutral-200 relative overflow-hidden">
      {/* FLOATING AMBIENT BACKGROUND ELEMENTS */}
      {/* Adjusted dimensions across responsive breakpoints to prevent layout blowouts */}
      <motion.div
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/12 w-64 h-64 sm:w-96 sm:h-96 bg-neutral-200/40 rounded-full filter blur-[60px] sm:blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -35, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/12 w-72 h-72 sm:w-[400px] sm:h-[400px] bg-neutral-300/30 rounded-full filter blur-[75px] sm:blur-[100px] pointer-events-none"
      />

      {/* MAIN LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md px-6 py-8 sm:px-10 sm:py-10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.015)] border border-white/60 relative overflow-hidden z-10"
      >
        {/* Subtle Top Accent Accentuation */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200" />

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 mb-2 font-serif"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm font-light tracking-wide text-neutral-400 uppercase"
          >
            Access Eventora Portal
          </motion.p>
        </div>

        {/* Error Banner */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-red-50/60 backdrop-blur-sm text-red-700 text-xs tracking-wide p-3 sm:p-4 rounded-xl mb-6 text-center border border-red-100/50 font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5 sm:space-y-6"
          >
            {/* Email Field */}
            <motion.div
              variants={itemVariants}
              className="space-y-1.5 relative"
            >
              <label className="block text-xs font-medium tracking-wider text-neutral-500 uppercase">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 stroke-[1.5] transition-colors group-focus-within:text-neutral-900" />
                <input
                  type="email"
                  required
                  placeholder="alexander@eventora.com"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-neutral-50/40 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none text-neutral-800 text-sm placeholder:text-neutral-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={itemVariants}
              className="space-y-1.5 relative"
            >
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium tracking-wider text-neutral-500 uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] sm:text-[11px] text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-wider"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative group">
                {/* Left Icon (Lock) */}
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 stroke-[1.5] transition-colors group-focus-within:text-neutral-900" />

                {/* Input Field */}
                <input
                  type={showPassword ? "text" : "password"} // Dynamic type changing
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 sm:py-3 bg-neutral-50/40 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none text-neutral-800 text-sm placeholder:text-neutral-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Right Icon (Toggle Button) */}
                <button
                  type="button" // Critical to prevent this button from submitting forms accidentally
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors p-0.5 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.5]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.5]" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Luxury CTA Button */}
            <motion.div variants={itemVariants} className="pt-1 sm:pt-2">
              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full relative bg-neutral-900 text-white text-xs font-medium tracking-widest uppercase py-3.5 sm:py-4 rounded-xl shadow-sm hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </form>

        {/* Footer Navigation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-6 sm:mt-8 text-xs tracking-wide text-neutral-400 font-light"
        >
          New to the platform?{" "}
          <Link
            to="/register"
            className="text-neutral-900 font-normal hover:underline underline-offset-4 transition-all ml-1"
          >
            Create account
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
