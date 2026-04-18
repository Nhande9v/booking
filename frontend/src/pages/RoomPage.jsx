import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Wifi, Wind, ShieldCheck } from "lucide-react";
import api from "../lib/axios";
const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Loading room details...</div>;
  if (!room) return <div className="text-center py-20 text-red-500 font-bold">Room not found!</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. NÚT BACK VÀ HEADER ẢNH */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img 
          src={room.photo?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32"} 
          className="h-full w-full object-cover transition duration-700 hover:scale-105" 
          alt={room.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-md hover:bg-white transition active:scale-95"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 -mt-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600"> Premium Room</span>
              <h1 className="text-4xl font-black text-slate-900 mt-2 mb-6">{room.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Users size={20} className="text-indigo-500" /> {room.maxPeople} guests
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wifi size={20} className="text-indigo-500" /> Free Wi-Fi
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wind size={20} className="text-indigo-500" /> Air Conditioning
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <p className="text-lg leading-relaxed text-slate-600">
                {room.desc || "A perfect getaway with modern amenities, offering a relaxing and comfortable stay."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {room.photo?.slice(1).map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  className="h-64 w-full object-cover rounded-3xl border border-slate-200 shadow-sm" 
                  alt="room sub"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price per night</p>
                <h2 className="text-4xl font-black text-indigo-600 mt-2">
                  {room.price?.toLocaleString("vi-VN")}₫
                </h2>
              </div>

              <div className="space-y-4">
                <button className="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95">
                   BOOK NOW
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 uppercase">
                  <ShieldCheck size={16} /> 100% Secure Payment
                </div>
              </div>

              <hr className="my-8 border-slate-100" />
              
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 leading-6 italic">
                  * Check-in: 2:00 PM - Check-out: 12:00 PM <br />
                  * Free cancellation up to 24 hours before arrival
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomPage;