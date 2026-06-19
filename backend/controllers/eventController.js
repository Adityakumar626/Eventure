import Event from "../models/Event.js";

// all events
export const getAllEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.ticketPrice) {
      filters.ticketPrice = req.query.ticketPrice;
    }
    const events = await Event.find(filters);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// specific event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// creating a event
export const createEvent = async (req, res) => {
  const {
    title,
    description,
    ticketPrice,
    date,
    location,
    totalSeats,
    category,
    imageUrl,
  } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      ticketPrice: Number(ticketPrice),
      date,
      location,
      totalSeats: Number(totalSeats),
      category,
      imageUrl,
      createdBy: req.user._id,
      availableSeats: Number(totalSeats),
    });
    if (!totalSeats || !ticketPrice) {
      return req.json(400).json({ error: "Seats and Price are Required" });
    }
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update event
export const updateEvent = async (req, res) => {
  const {
    title,
    description,
    ticketPrice,
    date,
    lacation,
    totalSeats,
    category,
    imageUrl,
  } = req.body;
  try {
    const event = Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        ticketPrice,
        date,
        lacation,
        totalSeats,
        category,
        imageUrl,
      },
      { new: true },
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    req.json(event);
  } catch (error) {
    res.status(500).json("error:error.message");
  }
};

// delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json("error:error.message");
  }
};
