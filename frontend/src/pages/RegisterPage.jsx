import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
        setError("");
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      // Check if error is an object with a message, otherwise fallback to string
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants for Luxury Transitions
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen md:pt-16 pt-10 flex items-center justify-center px-4 selection:bg-neutral-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white px-8 py-10 md:px-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-neutral-100 relative overflow-hidden"
      >
        {/* Subtle Luxury Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-neutral-200 via-neutral-400 to-neutral-200" />

        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h2
            layoutId="form-title"
            className="text-3xl font-light tracking-tight text-neutral-900 mb-2 font-serif"
          >
            {showOTP ? "Verify Identity" : "Create Account"}
          </motion.h2>
          <p className="text-sm font-light tracking-wide text-neutral-400 uppercase">
            {showOTP ? "Security Verification" : "Join Eventora"}
          </p>
        </div>

        {/* Error Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50/60 backdrop-blur-sm text-red-700 text-xs tracking-wide p-4 rounded-xl mb-6 text-center border border-red-100/50 font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.div
                key="register-fields"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                {/* Full Name Field */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 stroke-[1.5]" />
                    <input
                      type="text"
                      required
                      placeholder="Alexander Wright"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-50/50 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none text-neutral-800 text-sm placeholder:text-neutral-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 stroke-[1.5]" />
                    <input
                      type="email"
                      required
                      placeholder="alexander@eventora.com"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-50/50 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none text-neutral-800 text-sm placeholder:text-neutral-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 stroke-[1.5]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-neutral-50/50 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none text-neutral-800 text-sm placeholder:text-neutral-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-field"
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center">
                  <p className="text-xs tracking-wide text-neutral-500 font-light leading-relaxed">
                    A secure verification code has been dispatched to{" "}
                    <span className="font-medium text-neutral-800">
                      {email}
                    </span>
                    .
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-center text-xs font-medium tracking-wider text-neutral-500 uppercase">
                    Verification Code (OTP)
                  </label>
                  <div className="relative max-w-60 mx-auto">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 stroke-[1.5]" />
                    <input
                      type="text"
                      required
                      placeholder="000000"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50/50 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:bg-white focus:ring-0 transition-all duration-300 outline-none font-mono tracking-[0.6em] text-center text-lg text-neutral-900 font-semibold uppercase placeholder:text-neutral-200"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Call-to-Action Button */}
          <motion.button
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full relative bg-neutral-900 text-white text-xs font-medium tracking-widest uppercase py-4 rounded-xl shadow-sm hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            ) : (
              <>
                <span>{showOTP ? "Verify & Complete" : "Begin Journey"}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link Navigation */}
        <AnimatePresence>
          {!showOTP && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-8 text-xs tracking-wide text-neutral-400 font-light"
            >
              Already registered?{" "}
              <Link
                to="/login"
                className="text-neutral-900 font-normal hover:underline underline-offset-4 transition-all ml-1"
              >
                Sign in
              </Link>
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
