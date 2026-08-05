import { createError } from "./error.js";

export const verifyProvider = (req, res, next) => {
    if (req.user && (req.user.role === "provider" || req.user.role === "admin")) {
        next();
    } else {
        return next(createError(403, "Only property hosts can perform this action."));
    }
};
