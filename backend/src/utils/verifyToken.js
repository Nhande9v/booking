import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // 1. Lấy token từ Header (Axios của bạn gửi ở đây)
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(" ")[1];

  // 2. Nếu không có header, mới tìm trong cookie (phòng hờ)
  if (!token) {
    token = req.cookies?.access_token;
  }

  if (!token) {
    return next(createError(401, "Bạn chưa đăng nhập hoặc thiếu Token!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verify Error:", err.message); // In ra để debug xem token hết hạn hay sai secret
      return next(createError(403, "Token không hợp lệ hoặc đã hết hạn!"));
    }
    
    req.user = user;
    next();
  });
};