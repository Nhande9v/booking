import express from 'express';
import bookingRouters from './routes/bookingRouters.js';
import hotelRouters from './routes/hotelRouters.js';
import roomRouters from './routes/roomRouters.js';
import authRouters from './routes/authRouters.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173",
               credentials: true, // Bắt buộc phải có dòng này để khớp với axios
               methods: ["GET", "POST", "PUT", "DELETE"],
               allowedHeaders: ["Content-Type", "Authorization"] 
 }));
app.use(express.json());

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack, // Hiển thị chi tiết lỗi khi đang dev
  });
});

app.use("/api/bookings", bookingRouters);
app.use("/api/rooms", roomRouters);
app.use("/api/hotels", hotelRouters);
app.use("/api/auth", authRouters);
connectDB().then(() => {
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    })
});

