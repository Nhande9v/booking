import React from "react";
import { Link } from "react-router-dom";
const RoomList = ({ rooms, selectedRoom, onSelectRoom }) => {
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return (<div className="text-slate-500 py-10 text-center italic">
        No rooms are currently available for this hotel.
        </div>);
    }
return(
    <div className="space-y-6">
        <h3 className ="text-2xl font-bold text-slate-900 tracking-tight"> Select a Room Type </h3>
        <div className="grid gap-5">
        {rooms.map((room) => {
          const isSelected = selectedRoom?._id === room._id;
          return (
            <div
              key={room._id}
              onClick={() => onSelectRoom(room)} // viết như này để click vào
              className={`group relative flex items-center gap-5 p-4 rounded-[2rem] border transition-all duration-300 ${
                isSelected      
                  ? "border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
              }`}
            >
                <Link to={`/room/${room._id}`} className="shrink-0">
                <div className="relative h-24 w-32 overflow-hidden rounded-2xl shadow-inner">
                <img
                  src={room.photo?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=300"}
                  alt={room.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
                </Link>

              <div className="flex-1 space-y-1">
                <h4 className={`text-lg font-bold transition-colors ${isSelected ? "text-indigo-900" : "text-slate-900"}`}>{room.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-1 font-medium">{room.desc}</p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">👤 Max: {room.maxPeople}</span>
                  <span className={`text-lg font-black ${isSelected ? "text-indigo-600" : "text-indigo-500"}`}>
                    {room.price?.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Trạng thái chọn */}
              <div className="pr-2">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" 
                    : "border-slate-300 bg-white group-hover:border-indigo-400"
                }`}>
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              </div>
            </div>  
          );
        })}
      </div>
    </div>
)
}
export default RoomList;