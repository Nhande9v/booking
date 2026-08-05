import "dotenv/config";
import express from 'express';
import bookingRouters from './routes/bookingRouters.js';
import hotelRouters from './routes/hotelRouters.js';
import roomRouters from './routes/roomRouters.js';
import authRouters from './routes/authRouters.js';
import uploadRouters from './routes/uploadRouters.js';
import reviewRouters from './routes/reviewRouters.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import healthRouters from './routes/healthRouters.js';
import { startBookingExpirationJob } from "./services/bookingExpirationService.js";
import paymentRouters from "./routes/paymentRouters.js";


const PORT = process.env.PORT || 5001;

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin include health checks and server-to-server callbacks.
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      const error = new Error(`Origin ${origin} is not allowed by CORS.`);
      error.status = 403;
      return callback(error);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/health",healthRouters);
app.use("/api/bookings", bookingRouters);
app.use("/api/rooms", roomRouters);
app.use("/api/hotels", hotelRouters);
app.use("/api/auth", authRouters);
app.use("/api/uploads", uploadRouters);
app.use("/api/reviews", reviewRouters);
app.use("/api/payments", paymentRouters);

app.use((err, req, res, next) => {
  const errorStatus = err.status || err.statusCode || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
});

connectDB().then(() => {
    startBookingExpirationJob();
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    })
});

