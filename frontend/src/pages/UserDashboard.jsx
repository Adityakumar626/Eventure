import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Ticket,
  XCircle,
  Calendar,
  IndianRupee,
  Clock,
  ArrowUpRight,
  User,
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(
          error.response?.data?.message || "Error cancelling booking"
        );
      }
    }
  };

  // Orchestration Variants matching the editorial style
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBFA] pt-28 text-center justify-center text-sm font-medium tracking-widest uppercase text-[#59554F]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA] pt-28 text-[#2E2C29]">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-24">
        
        {/* 1. Profile Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#2E2C29] text-white rounded-3xl p-8 md:p-12 mb-16 border border-[#E6E0D3]/10 relative overflow-hidden shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8"
        >
          {/* Visual Texture Overlays */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
          
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-[#F7F4EB] text-[#2E2C29] rounded-2xl flex items-center justify-center text-3xl font-serif italic shrink-0 border border-white/10 shadow-inner z-10">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
          </div>
          
          <div className="relative flex flex-col justify-center h-full z-10 pt-2">
            <span className="text-[10px] text-stone-400 font-medium tracking-[0.25em] uppercase mb-2">
              Account Overview
            </span>
            <h1 className="text-3xl md:text-4xl font-normal leading-none tracking-tight font-serif italic text-[#F7F4EB] mb-3">
              Welcome back, {user?.name}
            </h1>
            <p className="text-stone-300 text-sm font-light flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D4E] animate-pulse"></span>
              Verified Guest Dashboard
            </p>
          </div>
        </motion.div>

        {/* 2. Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 border-b border-[#E6E0D3] pb-4 gap-2">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight font-serif text-[#2E2C29] flex items-center gap-3">
            My Booking Requests
          </h2>
          <div className="text-[#8C857B] text-xs font-mono uppercase tracking-wider">
            {bookings.length} reservations listed
          </div>
        </div>

        {/* 3. Empty State or Main Grid */}
        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#F7F4EB]/30 rounded-2xl p-16 text-center border border-[#E6E0D3]/50 max-w-2xl mx-auto"
          >
            <div className="w-14 h-14 bg-[#EBE5D8] text-[#4A5D4E] rounded-xl flex items-center justify-center mx-auto mb-6">
              <Ticket size={24} strokeWidth={1.5} />
            </div>
            <p className="text-base text-[#59554F] mb-8 font-serif italic">
              Your itinerary is currently empty. You haven't booked any events yet.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-[#2E2C29] hover:bg-[#2E2C29]/90 text-[#FBFBFA] font-medium text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all duration-300 shadow-sm"
            >
              Browse Experiences
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  layout
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#F7F4EB]/30 rounded-2xl overflow-hidden border border-[#E6E0D3]/50 hover:border-[#E6E0D3] transition-all duration-300 flex flex-col group"
                >
                  {/* Card Main Body */}
                  <div className="p-6 grow flex flex-col justify-between">
                    <div>
                      {booking.eventId ? (
                        <>
                          <div className="flex justify-between items-start gap-4 mb-5">
                            <h3 className="text-lg font-medium text-[#2E2C29] leading-snug group-hover:text-[#4A5D4E] transition-colors font-serif">
                              {booking.eventId.title}
                            </h3>
                            
                            {/* Badges Stack */}
                            <div className="flex flex-col gap-1.5 items-end shrink-0">
                              <span className={`px-2.5 py-1 text-[9px] font-semibold rounded-lg uppercase tracking-wider border ${
                                booking.status === "confirmed" 
                                  ? "bg-[#4A5D4E]/10 text-[#4A5D4E] border-[#4A5D4E]/20" 
                                  : booking.status === "cancelled" 
                                  ? "bg-red-50 text-red-700 border-red-100" 
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}>
                                {booking.status}
                              </span>
                              
                              {booking.status !== "cancelled" && booking.paymentStatus && (
                                <span className={`px-2.5 py-1 text-[9px] font-semibold rounded-lg uppercase tracking-wider border ${
                                  booking.paymentStatus === "paid" 
                                    ? "bg-blue-50 text-blue-700 border-blue-100" 
                                    : "bg-[#EBE5D8] text-[#59554F] border-[#E6E0D3]"
                                }`}>
                                  {booking.paymentStatus.replace("_", " ")}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Technical Info Metrics */}
                          <div className="flex flex-col gap-2.5 text-[#59554F] text-xs font-light mb-6">
                            <div className="flex items-center gap-2.5">
                              <Calendar size={14} className="text-[#8C857B]" />
                              <span>
                                {new Date(booking.eventId.date).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <IndianRupee size={14} className="text-[#8C857B]" />
                              <span>
                                {booking.amount === 0 ? (
                                  <span className="text-[#4A5D4E] font-medium tracking-wide">FREE ENTRY</span>
                                ) : (
                                  `₹${booking.amount}`
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 pt-2 border-t border-[#E6E0D3]/40 mt-1">
                              <Clock size={14} className="text-[#8C857B]" />
                              <span className="text-[11px] text-[#8C857B]">
                                Requested on {new Date(booking.bookedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="py-6 text-center">
                          <p className="text-red-700 bg-red-50 border border-red-100 rounded-xl py-3 px-4 text-xs italic">
                            Event details are unavailable or have been deleted.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar Footer */}
                  <div className="mt-auto px-6 pb-6 pt-4 border-t border-[#E6E0D3]/40 flex gap-3 items-center bg-[#F7F4EB]/10">
                    {booking.eventId && booking.status !== "cancelled" ? (
                      <>
                        <Link
                          to={`/events/${booking.eventId._id}`}
                          className="group/btn flex items-center justify-center gap-1.5 w-full text-center bg-[#EBE5D8]/60 hover:bg-[#EBE5D8] text-[#2E2C29] font-medium py-3 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider"
                        >
                          View Event
                          <ArrowUpRight
                            size={14}
                            className="text-[#8C857B] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                          />
                        </Link>
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="flex items-center justify-center gap-1.5 text-red-600 hover:text-red-800 font-medium py-3 px-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider hover:bg-red-50 border border-transparent hover:border-red-100 cursor-pointer"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center py-2 text-xs font-mono uppercase tracking-widest text-[#8C857B] italic">
                        Booking Cancelled
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;