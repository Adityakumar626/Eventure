import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Armchair,
  CircleDollarSign,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Info,
} from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false); // show otp input visibility
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm booking.",
        );
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);
        // Update local seats count dynamically after booking
        setEvent((prev) => ({
          ...prev,
          availableSeats: prev.availableSeats - 1,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBFBFA]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-[#4A5D4E]" />
        </motion.div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBFBFA] px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center p-8 bg-[#F7F4EB]/50 rounded-2xl border border-red-200/60"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-[#2E2C29] mb-1">
            Unable to load event
          </p>
          <p className="text-[#8C857B] text-sm">{error || "Event not found"}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#4A5D4E] hover:text-[#2E2C29] transition-colors"
          >
            <ArrowLeft size={14} /> Back to explore
          </Link>
        </motion.div>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] pt-24 md:pt-28 pb-24 text-[#2E2C29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Navigation Action Line */}
        <div className="mb-6 md:mb-8 flex items-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-[#8C857B] hover:text-[#2E2C29] transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to experiences
          </Link>
        </div>

        {/* Adaptive Layout Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {/* MAIN COLUMN (Left side on desktop, stacked on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            {/* Visual Cover Header Block */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#EBE5D8] h-60 sm:h-87.5 lg:h-105 w-full shadow-xs">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#2E2C29] to-[#4A5D4E] flex flex-col items-center justify-center text-[#F7F4EB] p-6 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md mb-3 border border-white/10 text-stone-200">
                    {event.category}
                  </span>
                  <h2 className="text-xl md:text-3xl font-normal font-serif italic max-w-md px-4">
                    {event.title}
                  </h2>
                </div>
              )}
              {/* Dynamic Overlay Floating Badge */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <span className="bg-[#2E2C29] text-[#FBFBFA] text-[10px] font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-xl uppercase tracking-wider shadow-sm">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Description & Body Card */}
            <div className="bg-[#F7F4EB]/30 rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#E6E0D3]/40">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif italic text-[#2E2C29] tracking-tight mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="h-0.5 w-12 bg-[#4A5D4E] rounded-full mb-6 md:mb-8"></div>

              <div className="flex items-center gap-2 text-[#8C857B] text-[10px] uppercase tracking-wider mb-3 font-semibold">
                <Info size={14} className="text-[#4A5D4E]" />
                <span>About The Experience</span>
              </div>
              <p className="text-[#59554F] text-sm sm:text-base md:text-lg leading-relaxed font-light whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </motion.div>

          {/* SIDEBAR COMPONENT (Right side on desktop, acts as bottom section on mobile devices) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="lg:col-span-1 lg:sticky lg:top-32"
          >
            <div className="bg-[#F7F4EB]/60 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-[#E6E0D3] relative overflow-hidden">
              <h3 className="text-base md:text-lg font-medium font-serif text-[#2E2C29] mb-5 pb-4 border-b border-[#E6E0D3]">
                Registration Desk
              </h3>

              {/* Data Rows Stack */}
              <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
                {/* Metric Item: Ticket Pricing */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE5D8] text-[#4A5D4E] flex items-center justify-center shrink-0">
                    <CircleDollarSign size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#8C857B] uppercase tracking-wider">
                      Pass Variant
                    </p>
                    <p className="font-semibold text-[#2E2C29] text-base md:text-lg mt-0.5 truncate">
                      {event.ticketPrice === 0 ? (
                        <span className="text-[#4A5D4E] font-medium uppercase tracking-wide text-xs bg-[#EBE5D8] px-2.5 py-0.5 rounded-md">
                          Free Entry
                        </span>
                      ) : (
                        `₹${event.ticketPrice}`
                      )}
                    </p>
                  </div>
                </div>

                {/* Metric Item: Seat Allocation */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE5D8] text-[#4A5D4E] flex items-center justify-center shrink-0">
                    <Armchair size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#8C857B] uppercase tracking-wider">
                      Availability Matrix
                    </p>
                    <p className="font-medium text-[#59554F] text-xs md:text-sm mt-0.5 truncate">
                      <span
                        className={`font-semibold ${event.availableSeats < 10 ? "text-amber-600" : "text-[#2E2C29]"}`}
                      >
                        {event.availableSeats}
                      </span>{" "}
                      / {event.totalSeats} seats remaining
                    </p>
                  </div>
                </div>

                {/* Metric Item: Dates */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE5D8] text-[#4A5D4E] flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#8C857B] uppercase tracking-wider">
                      Scheduled Date
                    </p>
                    <p className="font-medium text-[#2E2C29] text-xs md:text-sm mt-0.5 truncate">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Metric Item: Location Anchor */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBE5D8] text-[#4A5D4E] flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#8C857B] uppercase tracking-wider">
                      Venue Location
                    </p>
                    <p className="font-medium text-[#2E2C29] text-xs md:text-sm mt-0.5 wrap-break-word line-clamp-2 leading-tight">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphical Capacity Progression Gauge */}
              <div className="mb-6 md:mb-8 pt-4 border-t border-[#E6E0D3]/60">
                <div className="w-full bg-[#EBE5D8] rounded-full h-1 mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        event.totalSeats
                          ? (event.availableSeats / event.totalSeats) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-[#4A5D4E] h-1 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-[#8C857B] font-medium tracking-wide">
                  Experience booking capacity status indicator
                </p>
              </div>

              {/* Secure Multi-Factor Input Sliding Container */}
              <AnimatePresence>
                {showOTP && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mb-5 p-4 bg-[#FBFBFA] rounded-xl border border-[#E6E0D3]">
                      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#59554F] mb-2.5">
                        <ShieldCheck size={14} className="text-[#4A5D4E]" />
                        Enter Authorization Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="••••••"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#E6E0D3] bg-[#FBFBFA] text-[#2E2C29] focus:outline-none focus:border-[#4A5D4E] transition text-center text-lg font-medium tracking-[0.4em] placeholder:tracking-normal font-mono"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Primary Form Interactive Triggers */}
              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-xs uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer select-none text-center flex items-center justify-center min-h-11.5 ${
                  isSoldOut || (successMsg && !showOTP)
                    ? "bg-[#EBE5D8] text-[#8C857B] cursor-not-allowed shadow-none"
                    : "bg-[#2E2C29] hover:bg-[#4A5D4E] text-[#FBFBFA]"
                }`}
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Secure processing...
                  </span>
                ) : showOTP ? (
                  "Verify Code & Authorize"
                ) : successMsg && !showOTP ? (
                  "Request Submitted"
                ) : isSoldOut ? (
                  "Sold Out"
                ) : (
                  "Request Verification Pass"
                )}
              </button>

              {/* Status Alert Panels */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-2.5 text-xs font-medium text-red-700 bg-red-50/60 border border-red-100 p-3 rounded-xl"
                  >
                    <AlertCircle
                      size={14}
                      className="shrink-0 mt-0.5 text-red-600"
                    />
                    <span className="leading-tight">{error}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-start gap-2.5 text-xs font-medium text-[#4A5D4E] bg-[#F7F4EB] border border-[#E6E0D3] p-3 rounded-xl"
                  >
                    <CheckCircle2
                      size={14}
                      className="shrink-0 mt-0.5 text-[#4A5D4E]"
                    />
                    <span className="leading-tight">{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
