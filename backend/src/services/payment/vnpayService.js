import crypto from "crypto";
import { createError } from "../../utils/error.js";

const VNPAY_TIME_ZONE = "Asia/Ho_Chi_Minh";

const getConfig = () => {
  const config = {
    tmnCode: process.env.VNPAY_TMN_CODE,
    hashSecret: process.env.VNPAY_HASH_SECRET,
    paymentUrl:
      process.env.VNPAY_PAYMENT_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl:
      process.env.VNPAY_RETURN_URL ||
      "http://localhost:5173/payment/vnpay/return",
  };

  if (!config.tmnCode || !config.hashSecret) {
    throw createError(
      503,
      "VNPay Sandbox is not configured. Add VNPAY_TMN_CODE and VNPAY_HASH_SECRET."
    );
  }

  return config;
};

const encodeValue = (value) =>
  encodeURIComponent(String(value)).replace(/%20/g, "+");

const buildQuery = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeValue(key)}=${encodeValue(value)}`)
    .join("&");

const sign = (query, secret) =>
  crypto.createHmac("sha512", secret).update(query, "utf8").digest("hex");

const getDateParts = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VNPAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
};

export const formatVnpayDate = (date) => {
  const parts = getDateParts(date);
  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
};

export const createVnpayPaymentUrl = ({
  txnRef,
  amount,
  ipAddress,
  createdAt,
  expiresAt,
  locale = "vn",
}) => {
  const config = getConfig();
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: Math.round(amount * 100),
    vnp_CreateDate: formatVnpayDate(createdAt),
    vnp_CurrCode: "VND",
    vnp_ExpireDate: formatVnpayDate(expiresAt),
    vnp_IpAddr: ipAddress,
    vnp_Locale: locale === "en" ? "en" : "vn",
    vnp_OrderInfo: `Thanh toan booking ${txnRef}`,
    vnp_OrderType: "170000",
    vnp_ReturnUrl: config.returnUrl,
    vnp_TxnRef: txnRef,
  };
  const query = buildQuery(params);
  const secureHash = sign(query, config.hashSecret);
  return `${config.paymentUrl}?${query}&vnp_SecureHash=${secureHash}`;
};

export const verifyVnpayCallback = (queryParams) => {
  const config = getConfig();
  const receivedHash = String(queryParams.vnp_SecureHash || "");
  const params = { ...queryParams };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const signed = sign(buildQuery(params), config.hashSecret);
  const receivedBuffer = Buffer.from(receivedHash.toLowerCase(), "utf8");
  const signedBuffer = Buffer.from(signed.toLowerCase(), "utf8");

  return (
    receivedBuffer.length === signedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, signedBuffer)
  );
};

export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || req.socket.remoteAddress || "127.0.0.1").split(",")[0];

  return ip.trim().replace(/^::ffff:/, "") || "127.0.0.1";
};
