import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Event from "./models/Event.js";
import Booking from "./models/Booking.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@eventora.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Demo User",
    email: "user@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Alice Smith",
    email: "alice@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Bob Johnson",
    email: "bob@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Charlie Dave",
    email: "charlie@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Diana Prince",
    email: "diana@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "George Miller",
    email: "george@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Hannah Montana",
    email: "hannah@eventora.com",
    password: "password123",
    role: "user",
  },
];

const events = [
  {
    title: "React & Node.js Developer Retreat",
    description:
      "Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: "Silicon Valley Innovation Center, CA",
    category: "Technology",
    totalSeats: 200,
    ticketPrice: 0,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Neon Nights EDM Festival",
    description:
      "Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    location: "Grand Arena, New York",
    category: "Music",
    totalSeats: 500,
    ticketPrice: 1500,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1682125853703-896a05629709?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Global Leaders Business Summit",
    description:
      "A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    location: "The Ritz-Carlton, London",
    category: "Business",
    totalSeats: 150,
    ticketPrice: 5000,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Modern Art Expo 2024",
    description:
      "Discover breathtaking contemporary and modern arts from underground and trending artists this season.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Downtown Art Museum",
    category: "Art",
    totalSeats: 300,
    ticketPrice: 200,
    imageUrl:
      "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0fGVufDB8fDB8fHww",
  },
  {
    title: "Startup Pitch & Pitch Competition",
    description:
      "Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: "Convention Center, Miami",
    category: "Business",
    totalSeats: 250,
    ticketPrice: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1506787497326-c2736dde1bef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Cloud Computing Architecture Seminar",
    description:
      "A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    location: "Tech Hub, Seattle",
    category: "Technology",
    totalSeats: 100,
    ticketPrice: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHRlY2h8ZW58MHx8MHx8fDA%3D",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/eventora",
    );
    console.log("\n✅ MongoDB connection open...");

    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();
    console.log("🗑️  Cleared existing data.");

    // Hash user passwords
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = users.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, salt),
      isVerified: true,
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers.find((u) => u.role === "admin");
    const normalUsers = createdUsers.filter((u) => u.role === "user");
    console.log(`👤 Created ${createdUsers.length} total dummy users.`);

    // Link events to admin
    const eventsWithAdmin = events.map((e) => ({
      ...e,
      availableSeats: e.totalSeats,
      createdBy: adminUser._id,
    }));

    const createdEvents = await Event.insertMany(eventsWithAdmin);
    console.log(
      `🎉 Created ${createdEvents.length} distinct events with Unsplash images.`,
    );

    // Generate Bookings Data
    const bookingsData = [];

    for (const event of createdEvents) {
      // Assign 3-6 random users to each event
      const randomCount = Math.floor(Math.random() * 4) + 3;
      // Shuffle and pick random users
      const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, randomCount);

      for (const user of selectedUsers) {
        // Randomize statuses
        const statuses = ["pending", "confirmed", "cancelled"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        let paymentStatus = "unpaid";
        if (status === "confirmed" && event.ticketPrice > 0) {
          // Usually confirmed tickets are marked paid (90% of the time)
          paymentStatus = Math.random() > 0.1 ? "paid" : "unpaid";
        } else if (event.ticketPrice === 0) {
          paymentStatus = "paid";
        }

        bookingsData.push({
          userId: user._id,
          eventId: event._id,
          status: status,
          paymentStatus: paymentStatus,
          amount: event.ticketPrice,
        });

        // Deduct available seats specifically for confirmed tickets!
        if (status === "confirmed") {
          event.availableSeats -= 1;
          await event.save();
        }
      }
    }

    await Booking.insertMany(bookingsData);
    console.log(
      `🎫 Inserted ${bookingsData.length} randomized dummy bookings (confirmed, pending, cancelled, paid, unpaid).`,
    );

    console.log("\n🚀 Database seeded successfully!");
    console.log("-------------------------------------------");
    console.log("Admin Email: admin@eventora.com");
    console.log("User Email:  user@eventora.com");
    console.log("Password for all users: password123");
    console.log("-------------------------------------------\n");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
