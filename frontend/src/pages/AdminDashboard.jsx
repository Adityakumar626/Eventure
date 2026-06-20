import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Layers,
  IndianRupee,
  Users,
  Activity,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  FileText,
  BadgeAlert,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  // Fetch data
  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings"),
      ]);

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE EVENT
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });

      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  // OPTIMISTIC DELETE
  const handleDeleteEvent = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to purge this event?")) return;

    setEvents((prev) => prev.filter((e) => e._id !== id));

    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.log("DELETE ERROR:", error);
      fetchData();
    }
  }, []);

  // BOOKING ACTIONS
  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      const cleanStatus = String(paymentStatus).trim().toLowerCase;
      await api.put(`/bookings/${id}/confirm`, { paymentStatus: cleanStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.delete(`/bookings/${id}`);
      fetchData();
    } catch (error) {
      alert("Error cancelling booking");
    }
  };

  // PERFORMANCE OPTIMIZATIONS
  const revenue = useMemo(() => {
    return bookings.reduce(
      (sum, b) =>
        b.paymentStatus === "paid" && b.status === "confirmed"
          ? sum + b.amount
          : sum,
      0,
    );
  }, [bookings]);

  const paidClients = useMemo(() => {
    return new Set(
      bookings
        .filter((b) => b.paymentStatus === "paid" && b.status === "confirmed")
        .map((b) => b.userId?._id),
    ).size;
  }, [bookings]);

  const pendingRequests = useMemo(() => {
    return bookings.filter((b) => b.status === "pending").length;
  }, [bookings]);

  // Framer Motion presets matching standard index logic
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBFA] pt-28 text-center justify-center text-sm font-medium tracking-widest uppercase text-[#59554F]">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA] pt-28 text-[#2E2C29]">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-24">
        {/* 1. Header Hero Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#2E2C29] text-white rounded-3xl p-8 md:p-12 mb-16 border border-[#E6E0D3]/10 relative overflow-hidden shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity pointer-events-none"></div>

          <div className="relative z-10">
            <span className="text-[10px] text-stone-400 font-medium tracking-[0.25em] uppercase mb-2 block">
              Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight font-serif italic text-[#F7F4EB]">
              Admin Dashboard
            </h1>
            <p className="text-stone-300 text-sm font-light mt-1">
              System monitoring, ledger approvals, and experience deployment.
            </p>
          </div>

          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="relative z-10 flex items-center gap-2 bg-[#F7F4EB] hover:bg-[#EBE5D8] text-[#2E2C29] text-xs uppercase tracking-wider font-medium py-3.5 px-6 rounded-xl transition-all duration-300 select-none cursor-pointer"
          >
            {showEventForm ? <X size={14} /> : <Plus size={14} />}
            {showEventForm ? "Close Form" : "Create Event"}
          </button>
        </motion.div>

        {/* 2. Metrics Deck Component */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <StatCard
            title="Accumulated Revenue"
            value={`₹${revenue}`}
            icon={<IndianRupee size={18} />}
            description="Settled transactions summary"
          />
          <StatCard
            title="Unique Guests"
            value={paidClients}
            icon={<Users size={18} />}
            description="Active allocation accounts"
          />
          <StatCard
            title="Pending Verifications"
            value={pendingRequests}
            icon={<Activity size={18} />}
            description="Awaiting system authorization"
            accent={pendingRequests > 0}
          />
        </motion.div>

        {/* 3. Sliding Event Creation Container */}
        <AnimatePresence>
          {showEventForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="overflow-hidden mb-16"
            >
              <div className="bg-[#F7F4EB]/40 border border-[#E6E0D3] rounded-3xl p-6 md:p-10">
                <h3 className="text-xl font-medium font-serif text-[#2E2C29] mb-6 pb-3 border-b border-[#E6E0D3]">
                  Deploy New Experience
                </h3>
                <form
                  onSubmit={handleCreateEvent}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Category / Sphere
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Technology, Music"
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Description Narratives
                    </label>
                    <textarea
                      rows="3"
                      required
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29] resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Calendar Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Location Coordinates
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Total Capacity Seats
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.totalSeats}
                      onChange={(e) =>
                        setFormData({ ...formData, totalSeats: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Ticket Valuation Price (INR)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0 for Free"
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.ticketPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ticketPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] mb-2">
                      Visual asset URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full bg-[#FBFBFA] border border-[#E6E0D3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A5D4E] transition-colors text-[#2E2C29]"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2E2C29] hover:bg-[#2E2C29]/90 text-[#FBFBFA] text-xs font-medium uppercase tracking-wider py-4 px-8 rounded-xl transition-colors duration-300 shadow-xs cursor-pointer"
                    >
                      Commit Registry Launch
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Split Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Active Registers Table Block */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-baseline justify-between mb-6 border-b border-[#E6E0D3] pb-3">
              <h2 className="text-xl font-medium tracking-tight font-serif text-[#2E2C29]">
                Active Registers
              </h2>
              <span className="text-[#8C857B] font-mono text-[11px] uppercase tracking-widest">
                {events.length} listings
              </span>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12 bg-[#F7F4EB]/10 rounded-2xl border border-dashed border-[#E6E0D3] text-xs font-light text-[#8C857B] italic">
                No active event templates found.
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {events.map((event) => (
                  <motion.div
                    key={event._id}
                    variants={elementVariants}
                    className="p-4 bg-[#F7F4EB]/20 border border-[#E6E0D3]/60 rounded-xl hover:border-[#E6E0D3] transition-all duration-300 flex justify-between items-center group"
                  >
                    <div className="truncate pr-4">
                      <p className="font-medium text-sm text-[#2E2C29] truncate group-hover:text-[#4A5D4E] transition-colors">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#8C857B] font-light mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2.5 text-[#8C857B] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all duration-300 cursor-pointer"
                      title="Purge Template"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Allocation Logs block */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-baseline justify-between mb-6 border-b border-[#E6E0D3] pb-3">
              <h2 className="text-xl font-medium tracking-tight font-serif text-[#2E2C29]">
                Allocation Pass Requests
              </h2>
              <span className="text-[#8C857B] font-mono text-[11px] uppercase tracking-widest">
                {bookings.length} reservations
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-[#F7F4EB]/10 rounded-2xl border border-dashed border-[#E6E0D3] text-xs font-light text-[#8C857B] italic">
                No customer bookings recorded in ledger.
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {bookings.map((b) => (
                  <motion.div
                    key={b._id}
                    variants={elementVariants}
                    className="p-5 bg-[#F7F4EB]/20 border border-[#E6E0D3]/60 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300"
                  >
                    <div className="space-y-1.5 grow max-w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-semibold bg-[#EBE5D8] text-[#59554F] px-2 py-0.5 rounded uppercase tracking-wider">
                          {b.status}
                        </span>
                        <h4 className="text-sm font-medium font-serif text-[#2E2C29] truncate">
                          {b.eventId?.title || "Unknown Experience Asset"}
                        </h4>
                      </div>

                      <p className="text-xs font-light text-[#59554F]">
                        Buyer:{" "}
                        <span className="font-normal text-[#2E2C29]">
                          {b.userId?.name}
                        </span>{" "}
                        <span className="text-[#8C857B] font-mono text-[11px]">
                          ({b.userId?.email})
                        </span>
                      </p>

                      <div className="text-[11px] font-medium font-mono text-[#4A5D4E]">
                        Valuation: ₹{b.amount}
                      </div>
                    </div>

                    {/* Operational controls container logic */}
                    {b.status === "pending" && (
                      <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6E0D3]/40">
                        <button
                          onClick={() => handleConfirmBooking(b._id, "paid")}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#4A5D4E] hover:bg-[#4A5D4E]/90 text-white text-[10px] font-medium uppercase tracking-wider py-2 px-3.5 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                          <CheckCircle2 size={12} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-transparent hover:bg-red-50 text-red-700 border border-transparent hover:border-red-100 text-[10px] font-medium uppercase tracking-wider py-2 px-3.5 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Stat Module matching layout requirements
const StatCard = ({ title, value, icon, description, accent = false }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }}
    className={`p-6 rounded-2xl border transition-all duration-300 ${
      accent
        ? "bg-amber-50/40 border-amber-200/70 shadow-xs"
        : "bg-[#F7F4EB]/50 border-[#E6E0D3]/60"
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C857B]">
        {title}
      </span>
      <div
        className={`p-2 rounded-lg ${accent ? "bg-amber-100 text-amber-800" : "bg-[#EBE5D8] text-[#4A5D4E]"}`}
      >
        {icon}
      </div>
    </div>
    <p className="text-3xl font-serif text-[#2E2C29] tracking-tight mb-1">
      {value}
    </p>
    <p className="text-[11px] font-light text-[#59554F]">{description}</p>
  </motion.div>
);

export default AdminDashboard;
