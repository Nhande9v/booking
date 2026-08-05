import React from "react";

const RoomPricingForm = ({ form, saving, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5">
    <label className="min-w-52 flex-1 space-y-1 text-sm font-bold text-slate-700">
      Price per night
      <input required min="0" type="number" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500" />
    </label>
    <label className="min-w-52 flex-1 space-y-1 text-sm font-bold text-slate-700">
      Regular price <span className="font-normal text-slate-400">(optional)</span>
      <input min="0" type="number" value={form.oldPrice} onChange={(event) => onChange({ ...form, oldPrice: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-blue-500" />
    </label>
    <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
      {saving ? "Saving..." : "Save pricing"}
    </button>
    <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">
      Cancel
    </button>
  </form>
);

export default RoomPricingForm;
