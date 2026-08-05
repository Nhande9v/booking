import { createError } from "./error.js";

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return next(createError(403, "Administrator access is required."));
};
