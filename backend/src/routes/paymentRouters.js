import express from "express";
import {
  createVnpayCheckout,
  getVnpayReturnResult,
  handleVnpayIpn,
} from "../controllers/paymentController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/vnpay/checkout", verifyToken, createVnpayCheckout);
router.get("/vnpay/return", verifyToken, getVnpayReturnResult);
router.get("/vnpay/ipn", handleVnpayIpn);

export default router;
