import React from "react";
import { Building2, Home, Landmark } from "lucide-react";

/* =========================
   INPUT COMPONENT
========================= */
const Input = ({ label, name, value, onChange, placeholder, type = "text", required }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      transition-all duration-200 shadow-sm"
    />
  </div>
);

/* =========================
   MAIN COMPONENT
========================= */
const Step1Info = ({ data, update, next, back }) => {

  /* ===== PRICE UTILS ===== */
  const formatNumber = (val) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const unformatNumber = (val) => val.replace(/,/g, "");

  /* ===== HANDLE CHANGE ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const raw = unformatNumber(value);

      // chỉ cho nhập số
      if (!/^\d*$/.test(raw)) return;

      // giới hạn 1 tỷ
      if (Number(raw) > 1000000000) return;

      update({ price: raw });
      return;
    }

    update({ [name]: value });
  };

  /* ===== VALIDATION ===== */
  const validateAndNext = () => {
    const price = Number(data.price);

    if (!data.name || !data.city || !data.address) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!price || price < 50000) {
      alert("Minimum price is 50,000 VND.");
      return;
    }

    next();
  };

  /* ===== ICON ===== */
  const getPropertyIcon = (type) => {
    switch (type) {
      case "Hotel": return <Building2 size={18} className="text-blue-600" />;
      case "Apartment": return <Home size={18} className="text-blue-600" />;
      case "Homestay": return <Landmark size={18} className="text-blue-600" />;
      default: return null;
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Basic Information
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide essential details so guests can find and book your property.
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-200/50">

        {/* TYPE + NAME */}
        <div className="grid md:grid-cols-3 gap-6 items-end">

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">
              Property Type
            </label>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 font-semibold">
              {getPropertyIcon(data.type)}
              {data.type || "Not selected"}
            </div>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Property Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="e.g. Azura Sea View Hotel"
              required
            />
          </div>
        </div>

        {/* PRICE */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 ml-1">
            Price per night (VND) <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="text"
              name="price"
              value={formatNumber(data.price || "")}
              onChange={handleChange}
              placeholder="Enter price (e.g. 500,000)"
              className="w-full pl-4 pr-28 py-3.5 rounded-xl border border-slate-200 
              focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-lg"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
              VND / night
            </span>
          </div>

          {data.price > 0 && (
            <p className="text-xs text-blue-600 font-medium ml-1 italic">
              Formatted: {formatNumber(data.price)} VND
            </p>
          )}
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">

          <Input
            label="City"
            name="city"
            value={data.city}
            onChange={handleChange}
            placeholder="e.g. Da Nang"
            required
          />

          <Input
            label="District"
            name="district"
            value={data.district}
            onChange={handleChange}
            placeholder="e.g. Son Tra"
          />
        </div>

        <Input
          label="Full Address"
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Street, ward, district..."
          required
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-4">

        <button
          onClick={back}
          className="px-8 py-3.5 rounded-2xl font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
        >
          ← Back
        </button>

        <button
          onClick={validateAndNext}
          className="px-10 py-3.5 font-semibold text-white rounded-2xl bg-slate-900 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Next: Amenities →
        </button>

      </div>
    </div>
  );
};

export default Step1Info;