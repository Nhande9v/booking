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


const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173",
               credentials: true, // Bắt buộc phải có dòng này để khớp với axios
               methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
               allowedHeaders: ["Content-Type", "Authorization"] 
 }));
app.use(express.json());

app.use("/api/health",healthRouters);
app.use("/api/bookings", bookingRouters);
app.use("/api/rooms", roomRouters);
app.use("/api/hotels", hotelRouters);
app.use("/api/auth", authRouters);
app.use("/api/uploads", uploadRouters);
app.use("/api/reviews", reviewRouters);

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
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    })
});

