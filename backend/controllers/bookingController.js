import Booking from "../models/Booking.js";
import OTP from "../models/OTP.js";
import Event from "../models/Event.js";
import { sendBookingEmail, sendOtpEmail } from "../utils/email.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendBookingOtp = async (req, res) => {
  const otp = generateOtp();
  await OTP.findOneAndDelete({
    email: req.user.email,
    action: "event_booking",
  });
  await OTP.create({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
  });
  await sendOtpEmail(req.user.email, otp, "event_booking");
  res.json({ message: "OTP sent to email" });
};

export const bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;
  const otpRecord = await OTP.findOne({
    email: req.user.email,
    otp,
    action: "event_booking",
  });
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or Expired OTP" });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(400).json({ error: "Event not found" });
  }

  if (event.totalSeats <= 0) {
    return res.status(400).json({ error: "No seats available" });
  }

  const existingBooking = await Booking.findOne({
    userId: req.user._id,
    eventId,
  });
  if (existingBooking) {
    return res
      .status(400)
      .json({ error: "You have already booked this event" });
  }

  const booking = await Booking.create({
    userId: req.user._id,
    eventId,
    amount: event.ticketPrice,
    status: "pending",
    paymentStatus: "unpaid",
  });

  await OTP.deleteMany({ email: req.user.email, action: "event_booking" });
  res.status(201).json({
    message: "Booking created. Please check your email for otp",
    booking: booking,
  });
};

export const confirmBooking = async (req, res) => {
  const paymentStatus = req.body.paymentStatus;
  if (!["paid", "unpaid"].includes(paymentStatus)) {
    return res.status(400).json({ error: "Invalid payment status" });
  }

  const booking = await Booking.findById(req.params.id).populate("eventId");
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (booking.status === "confirmed") {
    return res.status(400).json({ error: "Booking is already confirmed" });
  }

  const event = await Event.findById(booking.eventId._id);
  if (event.totalSeats <= 0) {
    return res.status(400).json({ error: "No seats available" });
  }
  booking.status = "confirmed";

  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  await booking.save();
  event.totalSeats -= 1;
  await event.save();

  // admin confirms booking, send email to user
  await sendBookingEmail(req.user.email, event.title, booking._id);
  res.json({ message: "Booking Confirmed", booking });
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(
    "eventId",
  );
  res.json(bookings);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorised" });
  }

  if (booking.status === "confirmed") {
    const event = await Event.findById(booking.eventId._id);
    event.totalSeats += 1;
    await event.save();
  }

  await booking.remove();
  res.json({ message: "Booking cancelled" });
};
