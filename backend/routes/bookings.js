import express from "express";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();
import {
  bookEvent,
  sendBookingOtp,
  getMyBookings,
  confirmBooking,
  cancelBooking,
  getAllBookings,
} from "../controllers/bookingController.js";

router.post("/", protect, bookEvent);
router.post("/send-otp", protect, sendBookingOtp);
router.get("/my", protect, getMyBookings);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.delete("/:id", protect, cancelBooking);
router.get("/", protect, admin, getAllBookings);

export default router;
