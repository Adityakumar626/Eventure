import express from "express";
const router = express.Router();
import { protect, admin } from "../middleware/auth.js";
import {
  getAllEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  createEvent,
} from "../controllers/eventController.js";

// Get all events
router.get("/", getAllEvents);

// Get event by id
router.get("/:id", getEventById);

// create event (admin only)
router.post("/", protect, admin, createEvent);

// update event (admin only)
router.put("/:id", protect, admin, updateEvent);

// delete a event (admin only)
router.delete("/:id", protect, admin, deleteEvent);

export default router;
