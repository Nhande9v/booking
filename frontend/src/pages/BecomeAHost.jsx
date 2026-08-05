import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Input = ({ label, name, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-semibold text-slate-700 ml-1">
      {label}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      hover:border-slate-300 transition-all"
    />
  </div>
);

const BecomeAHost = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    address: "",
    identityCard: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (step === 1)
      return formData.businessName && formData.phoneNumber && formData.address;
    if (step === 2) return formData.identityCard;
    if (step === 3)
      return formData.bankName && formData.accountNumber && formData.accountName;
    return true;
  };

  const next = () => {
    if (!validateStep()) {
      toast.error("Please complete all required fields.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const userId = user?._id || user?.details?._id;

    if (!userId) {
      toast.error("User not found.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/auth/upgrade/${userId}`, formData);
      dispatch({ type: "UPDATE_USER", payload: res.data.user });

      toast.success("🎉 You're now a Host!");
      navigate("/");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input label="Property Name" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. ALaura Homestay" />
            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+84..." />
            <Input label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, district..." />
          </div>
        );

      case 2:
        return (
          <Input label="ID Card / Passport" name="identityCard" value={formData.identityCard} onChange={handleChange} />
        );

      case 3:
        return (
          <div className="space-y-4">
            <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
            <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            <Input label="Account Holder" name="accountName" value={formData.accountName} onChange={handleChange} />
          </div>
        );

      case 4:
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 space-y-3 text-sm">
            <h3 className="font-bold text-blue-800 text-base">Review</h3>
            <div className="space-y-1 text-slate-700">
              <p><b>Name:</b> {formData.businessName}</p>
              <p><b>Phone:</b> {formData.phoneNumber}</p>
              <p><b>Address:</b> {formData.address}</p>
              <p><b>ID:</b> {formData.identityCard}</p>
              <p><b>Bank:</b> {formData.bankName}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4 py-20">

      <div className="w-full max-w-xl bg-white/80 backdrop-blur p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Become a Host
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Start earning by sharing your space
          </p>
        </div>

        {/* STEP DOTS */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                step === i + 1 ? "w-6 bg-blue-600" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* PROGRESS */}
        <div className="mb-6 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="h-full bg-blue-600"
          />
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* ACTIONS */}
        <div className="flex justify-between mt-10">
          <button
            onClick={back}
            disabled={step === 1}
            className="px-6 py-2 rounded-xl border text-slate-500 hover:bg-slate-50 disabled:opacity-30"
          >
            Back
          </button>

          {step < totalSteps ? (
            <button
              onClick={next}
              className="px-8 py-2 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 active:scale-95 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BecomeAHost;
