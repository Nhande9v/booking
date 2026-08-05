import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw, TriangleAlert, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

const resultContent = {
  paid: {
    icon: CheckCircle2,
    title: "Payment confirmed",
    description: "Your booking is confirmed and ready for your stay.",
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },
  failed: {
    icon: XCircle,
    title: "Payment was not completed",
    description: "No booking confirmation was made. You can try again while the hold is active.",
    color: "text-red-600",
    background: "bg-red-50",
  },
  review_required: {
    icon: TriangleAlert,
    title: "Payment needs review",
    description: "The payment arrived after the booking hold changed. Support must review it before confirmation.",
    color: "text-amber-700",
    background: "bg-amber-50",
  },
  pending: {
    icon: Clock3,
    title: "Waiting for server confirmation",
    description: "VNPay returned you to the site. The booking is confirmed only after the signed IPN reaches the backend.",
    color: "text-blue-600",
    background: "bg-blue-50",
  },
};

const VnpayReturn = () => {
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
  const content = resultContent[displayStatus] || resultContent.pending;
  const Icon = content.icon;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-14">
      <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        {loading ? (
          <div className="py-12">
            <RefreshCw className="mx-auto animate-spin text-blue-600" size={32} />
            <p className="mt-4 font-semibold text-slate-600">Verifying VNPay response...</p>
          </div>
        ) : error ? (
          <>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-red-50 text-red-600">
              <TriangleAlert size={28} />
            </span>
            <h1 className="mt-5 text-2xl font-black text-slate-950">Unable to verify payment</h1>
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
              <p className="mt-4 text-xs font-semibold text-slate-400">VNPay response code: {result.responseCode}</p>
            )}
          </>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {!loading && !error && displayStatus === "pending" && (
            <button type="button" onClick={verifyReturn} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold text-blue-700 hover:bg-blue-50">
              <RefreshCw size={17} /> Check again
            </button>
          )}
          <Link to="/bookings" className="inline-flex min-h-11 items-center rounded-lg bg-slate-900 px-5 text-sm font-bold text-white hover:bg-blue-600">
            View my bookings
          </Link>
        </div>
      </section>
    </main>
  );
};

export default VnpayReturn;
