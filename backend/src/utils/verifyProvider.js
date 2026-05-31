import { createError } from "./error.js";

export const verifyProvider = (req, res, next) => {
    if (req.user && (req.user.role === "provider" || req.user.role === "admin")) {
        next();
    } else {
        return next(createError(403, "Chỉ chủ nhà mới có quyền thực hiện hành động này!"));
    }
};