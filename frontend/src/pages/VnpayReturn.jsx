import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw, TriangleAlert, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "@/lib/axios";

const VnpayReturn = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const verifyReturn = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = Object.fromEntries(new URLSearchParams(window.location.search));
      const response = await api.get("/payments/vnpay/return", { params });
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to verify the VNPay response.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { verifyReturn(); }, [verifyReturn]);

  const displayStatus =
    result?.paymentStatus === "expired" ? "failed" : result?.paymentStatus || "pending";

  const resultContent = {
    paid: {
      icon: CheckCircle2,
      title: t("vnpayReturn.successTitle"),
      description: t("vnpayReturn.successDesc"),
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    failed: {
      icon: XCircle,
      title: t("vnpayReturn.failTitle"),
      description: t("vnpayReturn.failDesc"),
      color: "text-red-600",
      background: "bg-red-50",
    },
    review_required: {
      icon: TriangleAlert,
      title: "Cần xem xét thanh toán / Payment review",
      description: "Hệ thống cần kiểm tra lại đơn này trước khi xác nhận.",
      color: "text-amber-700",
      background: "bg-amber-50",
    },
    pending: {
      icon: Clock3,
      title: "Đang chờ máy chủ xác nhận...",
      description: "Đơn đặt phòng đang được xác nhận tự động qua cổng VNPay.",
      color: "text-blue-600",
      background: "bg-blue-50",
    },
  };

  const content = resultContent[displayStatus] || resultContent.pending;
  const Icon = content.icon;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-14">
      <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        {loading ? (
          <div className="py-12">
            <RefreshCw className="mx-auto animate-spin text-blue-600" size={32} />
            <p className="mt-4 font-semibold text-slate-600">{t("vnpayReturn.processing")}</p>
          </div>
        ) : error ? (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-red-50 text-red-600">
              <TriangleAlert size={28} />
            </span>
            <h1 className="mt-5 text-2xl font-black text-slate-950">Không thể xác thực / Unable to verify</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
          </>
        ) : (
          <>
            <span className={`mx-auto grid h-14 w-14 place-items-center rounded-lg ${content.background} ${content.color}`}>
              <Icon size={30} />
            </span>
            <h1 className="mt-5 text-2xl font-black text-slate-950">{content.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{content.description}</p>
            {result?.responseCode && (
              <p className="mt-4 text-xs font-semibold text-slate-400">Mã kết quả VNPay / Code: {result.responseCode}</p>
            )}
          </>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {!loading && !error && displayStatus === "pending" && (
            <button type="button" onClick={verifyReturn} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold text-blue-700 hover:bg-blue-50">
              <RefreshCw size={17} /> Kiểm tra lại
            </button>
          )}
          <Link to="/bookings" className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-5 text-sm font-bold text-white hover:bg-blue-600">
            {t("vnpayReturn.viewBookings")}
          </Link>
          <Link to="/" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            {t("vnpayReturn.backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default VnpayReturn;
