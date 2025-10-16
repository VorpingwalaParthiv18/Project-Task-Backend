import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import taskRoutes from "./Routes/TaskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // allows requests from any origin
    credentials: true, // allow cookies to be sent
  })
);

// Connect MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

let isConnected = false;

const connectDB = async () => {
  // if (isConnected) {
  //   console.log("Already connected to the database.");
  //   return;
  // }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

//add middleware to connect to DB
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
  }
  next();
}
);


// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


