import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import { createError } from "../utils/error.js";
import {
  createVnpayPaymentUrl,
  getClientIp,
  verifyVnpayCallback,
} from "../services/payment/vnpayService.js";

const MINIMUM_VNPAY_AMOUNT = 5000;

const createTxnRef = (bookingId) =>
  `${bookingId.toString().slice(-8)}${Date.now()}`;

export const createVnpayCheckout = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      throw createError(403, "Only guest accounts can pay for bookings.");
    }
    if (!mongoose.isValidObjectId(req.body.bookingId)) {
      throw createError(400, "Booking ID is invalid.");
    }

    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) throw createError(404, "Booking not found.");
    if (booking.userId.toString() !== req.user.id) {
      throw createError(403, "You can only pay for your own booking.");
    }
    if (booking.status !== "pending") {
      throw createError(409, "Only pending bookings can be paid.");
    }

    const now = new Date();
    if (!booking.expiresAt || booking.expiresAt <= now) {
      throw createError(409, "This booking hold has expired.");
    }
    if (booking.totalPrice < MINIMUM_VNPAY_AMOUNT) {
      throw createError(409, "VNPay requires a minimum payment of 5,000 VND.");
    }

    const existingPayment = await Payment.findOne({
      bookingId: booking._id,
      status: "pending",
      expiresAt: { $gt: now },
    });
    if (existingPayment) {
      return res.status(200).json({
        paymentId: existingPayment._id,
        paymentUrl: existingPayment.checkoutUrl,
        expiresAt: existingPayment.expiresAt,
      });
    }

    await Payment.updateMany(
      { bookingId: booking._id, status: "pending", expiresAt: { $lte: now } },
      { $set: { status: "failed", failedAt: now } }
    );

    const txnRef = createTxnRef(booking._id);
    const checkoutUrl = createVnpayPaymentUrl({
      txnRef,
      amount: booking.totalPrice,
      ipAddress: getClientIp(req),
      createdAt: now,
      expiresAt: booking.expiresAt,
      locale: req.body.locale,
    });
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user.id,
      txnRef,
      amount: booking.totalPrice,
      checkoutUrl,
      expiresAt: booking.expiresAt,
    });

    booking.paymentStatus = "pending";
    await booking.save();

    return res.status(201).json({
      paymentId: payment._id,
      paymentUrl: checkoutUrl,
      expiresAt: payment.expiresAt,
    });
  } catch (error) {
    if (error?.code === 11000 && req.body.bookingId) {
      const payment = await Payment.findOne({
        bookingId: req.body.bookingId,
        status: "pending",
      });
      if (payment) {
        return res.status(200).json({
          paymentId: payment._id,
          paymentUrl: payment.checkoutUrl,
          expiresAt: payment.expiresAt,
        });
      }
    }
    return next(error);
  }
};

export const getVnpayReturnResult = async (req, res, next) => {
  try {
    if (!verifyVnpayCallback(req.query)) {
      throw createError(400, "VNPay return signature is invalid.");
    }

    const payment = await Payment.findOne({ txnRef: req.query.vnp_TxnRef });
    if (!payment) throw createError(404, "Payment not found.");
    if (payment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      throw createError(403, "You cannot view this payment.");
    }

    return res.status(200).json({
      bookingId: payment.bookingId,
      paymentStatus: payment.status,
      responseCode: req.query.vnp_ResponseCode || null,
      transactionStatus: req.query.vnp_TransactionStatus || null,
      message:
        payment.status === "paid"
          ? "Payment confirmed."
          : payment.status === "review_required"
            ? "Payment requires manual review."
            : "Payment result received. Waiting for server confirmation.",
    });
  } catch (error) {
    return next(error);
  }
};

export const handleVnpayIpn = async (req, res) => {
  try {
    if (!verifyVnpayCallback(req.query)) {
      return res.status(200).json({ RspCode: "97", Message: "Invalid signature" });
    }

    const payment = await Payment.findOne({ txnRef: req.query.vnp_TxnRef });
    if (!payment) {
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    const receivedAmount = Number(req.query.vnp_Amount) / 100;
    if (!Number.isFinite(receivedAmount) || receivedAmount !== payment.amount) {
      return res.status(200).json({ RspCode: "04", Message: "Invalid amount" });
    }
    if (payment.status === "paid" || payment.status === "review_required") {
      return res.status(200).json({ RspCode: "02", Message: "Order already confirmed" });
    }
    if (!["pending", "expired"].includes(payment.status)) {
      return res.status(200).json({ RspCode: "02", Message: "Order already processed" });
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
      const currentPayment = await Payment.findById(payment._id).session(session);
      if (!currentPayment || !["pending", "expired"].includes(currentPayment.status)) return;

      const booking = await Booking.findById(currentPayment.bookingId).session(session);
      if (!booking) throw createError(404, "Booking not found for payment.");

      const successful =
        req.query.vnp_ResponseCode === "00" &&
        req.query.vnp_TransactionStatus === "00";
      const providerFields = {
        providerTransactionNo: req.query.vnp_TransactionNo || null,
        responseCode: req.query.vnp_ResponseCode || null,
        transactionStatus: req.query.vnp_TransactionStatus || null,
        bankCode: req.query.vnp_BankCode || null,
        cardType: req.query.vnp_CardType || null,
      };

      if (!successful) {
        Object.assign(currentPayment, providerFields, {
          status: "failed",
          failedAt: new Date(),
        });
        await currentPayment.save({ session });
        if (booking.status === "pending") {
          booking.paymentStatus = "failed";
          await booking.save({ session });
        }
        return;
      }

      const canConfirm =
        booking.status === "pending" &&
        booking.expiresAt &&
        booking.expiresAt > new Date();
      Object.assign(currentPayment, providerFields, {
        status: canConfirm ? "paid" : "review_required",
        paidAt: new Date(),
      });
      await currentPayment.save({ session });

      if (canConfirm) {
        booking.status = "confirmed";
        booking.paymentStatus = "paid";
        booking.expiresAt = null;
      } else {
        booking.paymentStatus = "review_required";
      }
      await booking.save({ session });
      });

      return res.status(200).json({ RspCode: "00", Message: "Confirm success" });
    } catch (error) {
      console.error("VNPay IPN transaction failed:", error.message);
      return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("VNPay IPN processing failed:", error.message);
    return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};
