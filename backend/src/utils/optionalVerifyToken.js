import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) token = req.cookies?.access_token;

  // Khách chưa đăng nhập vẫn được đi tiếp.
  if (!token) return next();

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return next(createError(403, "Token is invalid or has expired."));
    }

    req.user = user;
    return next();
  });
};