import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    token = req.cookies?.access_token;
  }

  if (!token) {
    return next(createError(401, "Bạn chưa đăng nhập hoặc thiếu Token!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(403, "Token không hợp lệ hoặc đã hết hạn!"));
    }
    req.user = user; // Gán dữ liệu user vào req để Controller sử dụng
    next(); // Chỉ gọi next() ở đây khi thành công
  });
};