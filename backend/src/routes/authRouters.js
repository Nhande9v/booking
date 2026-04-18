import express from "express";
import { login, register , forgotPassword, resetPassword,updatePassword } from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();


router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", verifyToken, updatePassword);
router.post("/register", register);
router.post("/login", login);

export default router;