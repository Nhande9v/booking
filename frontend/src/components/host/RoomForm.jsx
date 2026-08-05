import React from "react";
import { X } from "lucide-react";
import RoomImageUploader from "@/components/host/RoomImageUploader";

const RoomForm = ({ form, editing, saving, onChange, onSubmit, onClose }) => {
  const setField = (field, value) => onChange({ ...form, [field]: value });

  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">{editing ? "Edit room type" : "Add room type"}</h2>
          <p className="mt-1 text-sm text-slate-500">Set pricing, capacity, inventory, and room-specific photos.</p>
        </div>
        <button type="button" title="Close" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-bold text-slate-700">
          Room type name
          <input required placeholder="e.g. Deluxe Ocean View" value={form.title} onChange={(event) => setField("title", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-700">
          Price per night
          <input required min="0" type="number" value={form.price} onChange={(event) => setField("price", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-700">
          Regular price <span className="font-normal text-slate-400">(optional)</span>
          <input min="0" type="number" placeholder="Leave empty when there is no discount" value={form.oldPrice} onChange={(event) => setField("oldPrice", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-700">
          Maximum guests
          <input required min="1" type="number" value={form.maxPeople} onChange={(event) => setField("maxPeople", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-700">
          Rooms available
          <input required min="1" type="number" value={form.totalRooms} onChange={(event) => setField("totalRooms", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="space-y-1 text-sm font-bold text-slate-700 sm:col-span-2">
          Room description
          <textarea required rows="3" placeholder="Describe the room, view, beds, and key amenities." value={form.desc} onChange={(event) => setField("desc", event.target.value)} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
      </div>

      <div className="mt-6">
        <RoomImageUploader
          photos={form.photos}
          coverPhoto={form.coverPhoto}
          disabled={saving}
          onChange={(images) => onChange({ ...form, ...images })}
        />
      </div>

      <button type="submit" disabled={saving} className="mt-6 rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-600 disabled:opacity-50">
        {saving ? "Saving..." : editing ? "Save changes" : "Add room type"}
      </button>
    </form>
  );
};

export default RoomForm;
