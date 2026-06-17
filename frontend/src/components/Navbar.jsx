import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  // Nav Links Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-sm border-[#EAE9E4] px-6 py-5 md:px-12"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-px bg-[#EAE9E4]" />
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Luxury Asymmetric Logo */}
        <Link to="/" className="group flex flex-col items-start">
          <span className="text-xl font-normal tracking-[-0.04em] text-[#1C1B19] lowercase font-serif italic pr-2">
            Eventora{" "}
            <span className="not-italic text-[10px] tracking-[0.2em] uppercase font-sans text-stone-400 ml-1">
              ®
            </span>
          </span>
        </Link>

        {/* Center / Right Dynamic Desktop Navigation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center gap-12"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="group relative text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-[#1C1B19] transition-colors duration-300"
            >
              Events
              <motion.span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1B19] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0" />
            </Link>
          </motion.div>

          {/* AnimatePresence handles fluid transitions when user logs in or out */}
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="auth-true"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-12"
              >
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="group relative text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-[#1C1B19] transition-colors duration-300"
                >
                  Dashboard
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1B19] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[12px] font-medium tracking-[0.15em] uppercase text-stone-400 hover:text-stone-900 transition-colors duration-300 cursor-pointer"
                >
                  Logout
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth-false"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-12"
              >
                <Link
                  to="/login"
                  className="text-[12px] font-medium tracking-[0.15em] uppercase text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="relative px-5 py-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-white bg-[#1C1B19] overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-stone-800 scale-x-0 origin-left transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:scale-x-100" />
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#1C1B19] focus:outline-none p-1 cursor-pointer relative w-6 h-6 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Fullscreen Architectural Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(30px at calc(100% - 45px) 40px)" }}
            animate={{ clipPath: "circle(1200px at calc(100% - 45px) 40px)" }}
            exit={{ clipPath: "circle(30px at calc(100% - 45px) 40px)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#1C1B19] z-40 flex flex-col justify-between px-8 py-24 md:hidden h-screen w-screen"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-8 mt-12"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">
                Navigation
              </span>

              <Link
                to="/"
                className="text-3xl font-light font-serif italic text-[#FBFBFA]"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>

              {user && (
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-3xl font-light font-serif italic text-[#FBFBFA]"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-4 border border-white/20 text-[#FBFBFA] text-center text-xs uppercase tracking-[0.2em] font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 border border-white/20 text-[#FBFBFA] text-center text-xs uppercase tracking-[0.2em] font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-[#FBFBFA] text-[#1C1B19] text-center text-xs uppercase tracking-[0.2em] font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
