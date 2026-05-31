import express from "express";
import { checkHealth, checkReadiness } from "../controllers/healthController.js";

const router = express.Router();

// Liveness probe - app còn sống không?
router.get("/", checkHealth);

// Readiness probe - app sẵn sàng nhận request chưa? (kiểm tra cả DB)
router.get("/ready", checkReadiness);

export default router;
