const HotelHero = ({ hotel, mainPhoto, ratingValue, stars }) => (
  <div className="relative h-[520px] sm:h-[560px] overflow-hidden">
    <img src={mainPhoto} alt={hotel.name} className="h-full w-full object-cover brightness-90 transition duration-500 hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
    <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10">
      <div className="max-w-3xl rounded-3xl bg-white/90 px-6 py-7 shadow-xl backdrop-blur-md border border-white/20 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <span className="rounded-full bg-indigo-100 px-3 py-1 font-bold text-indigo-600"> Premium Hotel</span>
          <span className="text-slate-600 font-medium">{hotel.city}</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-4xl tracking-tight">{hotel.name}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-bold text-yellow-900 shadow-sm">
            <span>{ratingValue.toFixed(1)}</span> ★
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-700 border border-slate-200">
            Giá từ {hotel.price?.toLocaleString("vi-VN")}₫
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default HotelHero;