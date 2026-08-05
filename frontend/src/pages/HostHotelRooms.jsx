import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BedDouble, Plus, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import RoomCard from "@/components/host/RoomCard";
import RoomForm from "@/components/host/RoomForm";
import RoomPricingForm from "@/components/host/RoomPricingForm";
import api from "@/lib/axios";

const emptyForm = {
  title: "",
  price: "",
  oldPrice: "",
  maxPeople: 2,
  totalRooms: 1,
  desc: "",
  coverPhoto: null,
  photos: [],
};

const HostHotelRooms = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricingRoomId, setPricingRoomId] = useState(null);
  const [pricingForm, setPricingForm] = useState({ price: "", oldPrice: "" });

  const editable = ["draft", "rejected"].includes(hotel?.status);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [hotelResponse, roomsResponse] = await Promise.all([
        api.get(`/hotels/${hotelId}`),
        api.get(`/rooms/hotel/${hotelId}`),
      ]);
      setHotel(hotelResponse.data);
      setRooms(roomsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load room types.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (room) => {
    setEditingId(room._id);
    setForm({
      title: room.title,
      price: room.price,
      oldPrice: room.oldPrice || "",
      maxPeople: room.maxPeople,
      totalRooms: room.totalRooms || 1,
      desc: room.desc,
      coverPhoto: room.coverPhoto,
      photos: room.photos || [],
    });
    setShowForm(true);
  };

  const closeRoomForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const saveRoom = async (event) => {
    event.preventDefault();
    if (!form.coverPhoto || !form.photos.length) {
      toast.error("Add room photos and select a cover photo first.");
      return;
    }
    if (form.oldPrice && Number(form.oldPrice) <= Number(form.price)) {
      toast.error("Regular price must be greater than the discounted price.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        maxPeople: Number(form.maxPeople),
        totalRooms: Number(form.totalRooms),
        hotelId,
      };
      if (editingId) await api.put(`/rooms/${editingId}`, payload);
      else await api.post("/rooms", payload);
      toast.success(editingId ? "Room type updated." : "Room type added.");
      closeRoomForm();
      setForm(emptyForm);
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save this room type.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (room) => {
    if (!window.confirm(`Delete the room type “${room.title}”?`)) return;
    try {
      await api.delete(`/rooms/${room._id}`);
      toast.success("Room type deleted.");
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete this room type.");
    }
  };

  const openPricing = (room) => {
    setPricingRoomId(room._id);
    setPricingForm({ price: room.price, oldPrice: room.oldPrice || "" });
  };

  const savePricing = async (event) => {
    event.preventDefault();
    if (pricingForm.oldPrice && Number(pricingForm.oldPrice) <= Number(pricingForm.price)) {
      toast.error("Regular price must be greater than the discounted price.");
      return;
    }
    try {
      setSaving(true);
      const response = await api.patch(`/rooms/${pricingRoomId}/pricing`, {
        price: Number(pricingForm.price),
        oldPrice: pricingForm.oldPrice ? Number(pricingForm.oldPrice) : null,
      });
      setRooms((current) => current.map((room) => room._id === pricingRoomId ? response.data : room));
      setPricingRoomId(null);
      toast.success("Room pricing updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update room pricing.");
    } finally {
      setSaving(false);
    }
  };

  const submitReview = async () => {
    try {
      const response = await api.post(`/hotels/${hotelId}/submit`);
      setHotel(response.data);
      toast.success("Property submitted for review.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit this property for review.");
    }
  };

  const withdrawReview = async () => {
    try {
      const response = await api.post(`/hotels/${hotelId}/withdraw`);
      setHotel(response.data);
      toast.success("Submission withdrawn. You can edit the room types again.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to withdraw this submission.");
    }
  };

  if (loading) return <p className="p-16 text-center text-slate-500">Loading room types...</p>;
  if (!hotel) return <p className="p-16 text-center text-red-600">Property not found.</p>;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/host/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600">
          <ArrowLeft size={18} /> Host Dashboard
        </Link>

        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase text-blue-600">{hotel.status}</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Room types at {hotel.name}</h1>
            <p className="mt-2 text-sm text-slate-500">Each entry represents a room type and its available inventory.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotel.status === "pending" && (
              <button type="button" onClick={withdrawReview} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 hover:bg-amber-100">Withdraw submission</button>
            )}
            {editable && (
              <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100">
                <Plus size={18} /> Add room type
              </button>
            )}
            {editable && rooms.length > 0 && (
              <button type="button" onClick={submitReview} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
                <Send size={18} /> Submit for review
              </button>
            )}
          </div>
        </header>

        {hotel.rejectionReason && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">Rejection reason: {hotel.rejectionReason}</div>
        )}

        {showForm && editable && (
          <RoomForm form={form} editing={Boolean(editingId)} saving={saving} onChange={setForm} onSubmit={saveRoom} onClose={closeRoomForm} />
        )}

        {pricingRoomId && hotel.status !== "pending" && (
          <RoomPricingForm form={pricingForm} saving={saving} onChange={setPricingForm} onSubmit={savePricing} onCancel={() => setPricingRoomId(null)} />
        )}

        {rooms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <BedDouble className="mx-auto text-slate-400" size={36} />
            <p className="mt-4 font-bold text-slate-800">No room types yet.</p>
            <p className="mt-1 text-sm text-slate-500">Add at least one room type before submitting this property for review.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                editable={editable}
                canManagePricing={hotel.status === "active"}
                onEdit={() => openEdit(room)}
                onDelete={() => deleteRoom(room)}
                onPricing={() => openPricing(room)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HostHotelRooms;
