import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import taskRoutes from "./Routes/TaskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// --- MongoDB Serverless Connection ---
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  console.log("MongoDB Connected");
  return cached.conn;
}

// --- Connect to DB once (cold start) ---
await connectDB();

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});

// --- Export serverless handler ---
export default serverless(app);
