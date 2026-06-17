import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFA] px-4 md:px-8 text-[#2E2C29]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-[#F7F4EB]/30 p-8 md:p-12 rounded-3xl border border-[#E6E0D3] max-w-lg w-full text-center relative overflow-hidden group shadow-xs"
      >
        {/* Visual Comfort Layer Grid Mask */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity pointer-events-none"></div>

        {/* Status Indicator Icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="w-16 h-16 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xs"
        >
          <AlertCircle size={26} strokeWidth={1.75} />
        </motion.div>

        {/* Typography Stack */}
        <span className="text-[10px] text-red-700 font-semibold tracking-[0.25em] uppercase mb-3 block">
          Transaction Suspended
        </span>

        <h1 className="text-3xl md:text-4xl font-normal leading-tight tracking-tight font-serif italic text-[#2E2C29] mb-4">
          Checkout Declined
        </h1>

        <p className="text-[#59554F] font-light text-sm leading-relaxed mb-8 max-w-md mx-auto">
          We were unable to secure payment verification for this seat
          allocation. Please review your payment credentials, card spending
          thresholds, or return to the interface to try initializing your
          transaction loop again.
        </p>

        {/* Explanatory Logging Box */}
        <div className="bg-[#F7F4EB]/60 rounded-xl p-4 mb-8 border border-[#E6E0D3]/60 text-left">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
            <span className="text-[#8C857B]">Pipeline Code</span>
            <span className="text-red-700 font-semibold flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse"></span>
              ERR_PAYMENT_VOID
            </span>
          </div>
        </div>

        {/* Primary Actions Workspace */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <Link
            to="/"
            className="group/btn flex-1 flex items-center justify-center gap-2 bg-[#2E2C29] hover:bg-[#2E2C29]/90 text-[#FBFBFA] font-medium py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider text-center transition-all duration-300"
          >
            <RotateCcw
              size={14}
              className="text-stone-400 group-hover/btn:rotate-45 transition-transform duration-300"
            />
            Retry Checkouts
          </Link>
          <Link
            to="/dashboard"
            className="group/btn flex-1 flex items-center justify-center gap-2 bg-[#EBE5D8]/40 hover:bg-[#EBE5D8] text-[#2E2C29] font-medium py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider text-center transition-all duration-300 border border-[#E6E0D3]/60"
          >
            <LayoutDashboard size={14} className="text-[#8C857B]" />
            User Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
