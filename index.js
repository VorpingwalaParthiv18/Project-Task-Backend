import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import taskRoutes from "./Routes/TaskRoutes.js";
import activityRoutes from "./Routes/activityRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // allows requests from any origin
    credentials: true, // allow cookies to be sent
  })
);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/activities", activityRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

