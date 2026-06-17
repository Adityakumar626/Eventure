import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Compass,
  ShieldCheck,
  Grid,
  ArrowUpRight,
} from "lucide-react";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400); // 400ms debounce
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Dynamic Unique Category Extractor
  const categories = [
    "all",
    ...new Set(
      events
        .map((event) => event.category)
        .filter((cat) => cat && cat.trim() !== ""),
    ),
  ];

  // 2. Client-Side Filter Integration
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter(
          (event) =>
            event.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  // Stagger orchestration variant
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA] pt-28 text-[#2E2C29]">
      {/* 1. Hero Container Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-20">
        <div className="relative bg-[#2E2C29] text-white rounded-3xl overflow-hidden shadow-sm">
          {/* Visual Comfort Layer Masks */}
          <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#2E2C29]/40 to-[#2E2C29]"></div>

          <div className="relative p-8 md:p-20 text-center flex flex-col items-center z-10 max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-medium tracking-[0.25em] uppercase mb-8 border border-white/10 text-stone-200"
            >
              Welcome to Eventora
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-normal mb-6 leading-[1.15] tracking-tight font-serif italic text-[#F7F4EB]"
            >
              Find your next unforgettable experience
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-stone-300 text-base md:text-lg mb-10 max-w-2xl font-light leading-relaxed"
            >
              Discover the best tech conferences, late-night music festivals,
              and hands-on workshops happening directly in your area. Secure
              your spot today.
            </motion.p>

            {/* Redesigned Minimal Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-xl mx-auto relative flex items-center shadow-lg rounded-2xl overflow-hidden group border border-[#E6E0D3]/10"
            >
              <Search
                size={20}
                className="absolute left-5 text-stone-400 group-focus-within:text-[#4A5D4E] transition-colors"
              />
              <input
                type="text"
                placeholder="Search events by title..."
                className="w-full pl-14 pr-6 py-4.5 text-base text-[#2E2C29] bg-[#FBFBFA] focus:outline-none placeholder-stone-400 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Feature Rows Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F7F4EB]/50 p-8 rounded-2xl border border-[#E6E0D3]/60 flex flex-col items-start hover:bg-[#F7F4EB] transition-all duration-300">
            <div className="p-3 bg-[#EBE5D8] text-[#4A5D4E] rounded-xl mb-6">
              <Clock size={20} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[#2E2C29] mb-2">
              Fast Booking
            </h3>
            <p className="text-[#59554F] text-sm leading-relaxed font-light">
              Secure your tickets instantly with our fast streamlined booking
              infrastructure built for speed.
            </p>
          </div>

          <div className="bg-[#F7F4EB]/50 p-8 rounded-2xl border border-[#E6E0D3]/60 flex flex-col items-start hover:bg-[#F7F4EB] transition-all duration-300">
            <div className="p-3 bg-[#EBE5D8] text-[#4A5D4E] rounded-xl mb-6">
              <Compass size={20} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[#2E2C29] mb-2">
              Seamless Access
            </h3>
            <p className="text-[#59554F] text-sm leading-relaxed font-light">
              Download tickets instantly or manage them right from your personal
              dashboard with ease.
            </p>
          </div>

          <div className="bg-[#F7F4EB]/50 p-8 rounded-2xl border border-[#E6E0D3]/60 flex flex-col items-start hover:bg-[#F7F4EB] transition-all duration-300">
            <div className="p-3 bg-[#EBE5D8] text-[#4A5D4E] rounded-xl mb-6">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[#2E2C29] mb-2">
              Secure Platform
            </h3>
            <p className="text-[#59554F] text-sm leading-relaxed font-light">
              All transactions and registrations are bounded by cutting-edge
              security and 2FA OTP tech.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Category Selection Component */}
      {!loading && events.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-12 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C857B] mb-3">
            Filter by Sphere
          </span>
          <div className="flex flex-wrap gap-2 bg-[#F7F4EB]/40 p-1.5 rounded-xl border border-[#E6E0D3]/60">
            {categories.map((category) => {
              const isSelected =
                selectedCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className="relative px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors duration-300 cursor-pointer select-none"
                  style={{ color: isSelected ? "#FBFBFA" : "#59554F" }}
                >
                  <span className="relative z-10">
                    {category === "all" ? "All Experiences" : category}
                  </span>
                  {/* Fluid transition capsule indicator */}
                  {isSelected && (
                    <motion.span
                      layoutId="activeCategoryTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-[#2E2C29] rounded-lg z-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Main Dynamic Events Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-24">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 border-b border-[#E6E0D3] pb-4 gap-2">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight font-serif text-[#2E2C29]">
            Upcoming Events
          </h2>
          <div className="text-[#8C857B] text-xs font-mono uppercase tracking-wider">
            {filteredEvents.length} results found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-sm font-medium tracking-widest uppercase text-[#59554F]">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-24 text-sm font-light text-[#8C857B]">
            No events found matching your search parameters.
          </div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event._id}
                  layout // Allows items to glide smoothly to new grid tracks when layout reshuffles
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#F7F4EB]/30 rounded-2xl overflow-hidden border border-[#E6E0D3]/50 hover:border-[#E6E0D3] transition-all duration-300 flex flex-col group"
                >
                  <div className="h-52 bg-[#EBE5D8] overflow-hidden relative">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8C857B] font-serif italic text-xl">
                        {event.category || "Event"}
                      </div>
                    )}
                    {/* Dynamic Tag */}
                    <div className="absolute top-4 right-4 bg-[#FBFBFA]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm border border-[#E6E0D3]/20">
                      {event.ticketPrice === 0 ? (
                        <span className="text-[#4A5D4E]">FREE</span>
                      ) : (
                        <span className="text-[#2E2C29]">
                          ₹{event.ticketPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 grow flex flex-col">
                    <div className="text-[10px] font-semibold text-[#4A5D4E] uppercase tracking-[0.18em] mb-3">
                      {event.category}
                    </div>
                    <h2 className="text-xl font-medium text-[#2E2C29] leading-snug mb-4 group-hover:text-[#4A5D4E] transition-colors">
                      {event.title}
                    </h2>

                    <div className="flex flex-col gap-2.5 mb-6 text-[#59554F] text-xs font-light">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-[#8C857B]" />
                        <span>
                          {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} className="text-[#8C857B]" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Clean Metric Progress Section */}
                    <div className="mt-auto pt-4 border-t border-[#E6E0D3]/40">
                      <div className="w-full bg-[#EBE5D8] rounded-full h-1 mb-2.5 overflow-hidden">
                        <div
                          className="bg-[#4A5D4E] h-1 rounded-full"
                          style={{
                            width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-[#8C857B] font-medium tracking-wide mb-4">
                        {event.availableSeats} of {event.totalSeats} seats
                        remaining
                      </p>

                      <Link
                        to={`/events/${event._id}`}
                        className="group/btn flex items-center justify-center gap-1.5 w-full text-center bg-[#EBE5D8]/60 hover:bg-[#EBE5D8] text-[#2E2C29] font-medium py-3 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider"
                      >
                        View Details
                        <ArrowUpRight
                          size={14}
                          className="text-[#8C857B] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* 5. Footer Section */}
      <footer className="mt-auto pt-20 pb-10 border-t border-[#E6E0D3] bg-[#F7F4EB]/30 text-center px-4">
        <div className="flex justify-center items-center gap-2.5 mb-5">
          <div className="p-1.5 bg-[#EBE5D8] text-[#4A5D4E] rounded-lg">
            <Grid size={16} />
          </div>
          <span className="text-lg font-medium tracking-tight text-[#2E2C29]">
            Eventora
          </span>
        </div>
        <p className="text-[#59554F] text-sm font-light mb-8 max-w-md mx-auto leading-relaxed">
          The simplest, most dynamic way to manage, discover, and host
          world-class events in your local city. Let's make memories together.
        </p>
        <div className="text-[10px] text-[#8C857B] font-mono uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Eventora Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
