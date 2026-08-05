import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CircleCheck,
  Clock3,
  Eye,
  FilePenLine,
  Plus,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getPropertyCoverUrl } from "@/lib/imageUtils";

const statusStyle = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

const HostDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/hotels/mine");
      setHotels(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load your properties.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const statusCounts = hotels.reduce(
    (counts, hotel) => ({
      ...counts,
      [hotel.status]: (counts[hotel.status] || 0) + 1,
    }),
    { draft: 0, pending: 0, active: 0, rejected: 0 },
  );

  const overview = [
    { label: "Drafts", value: statusCounts.draft, icon: FilePenLine, color: "text-slate-600", background: "bg-slate-100" },
    { label: "In review", value: statusCounts.pending, icon: Clock3, color: "text-amber-700", background: "bg-amber-50" },
    { label: "Published", value: statusCounts.active, icon: CircleCheck, color: "text-emerald-700", background: "bg-emerald-50" },
    { label: "Needs attention", value: statusCounts.rejected, icon: TriangleAlert, color: "text-red-700", background: "bg-red-50" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-blue-100 bg-blue-50 px-6 py-7 shadow-sm sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Host workspace</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Your properties</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Manage your properties, room inventory, and review status in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" title="Refresh properties" onClick={fetchHotels} className="grid h-12 w-12 place-items-center rounded-lg border border-blue-200 bg-white text-slate-600 transition hover:bg-blue-100">
              <RefreshCw size={19} className={loading ? "animate-spin" : ""} />
            </button>
            <Link to="/create-hotel" className="flex min-h-12 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
              <Plus size={19} /> Add property
            </Link>
          </div>
        </section>

        {!loading && hotels.length > 0 && (
          <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Property overview">
            {overview.map(({ label, value, icon, color, background }) => (
              <div key={label} className="flex min-h-24 items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${background} ${color}`}>
                  {React.createElement(icon, { size: 20 })}
                </span>
                <div>
                  <p className="text-2xl font-black text-slate-950">{value}</p>
                  <p className="text-xs font-semibold text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {loading ? (
          <div className="grid gap-3" aria-label="Loading properties">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <section className="relative min-h-80 overflow-hidden rounded-lg bg-slate-900 shadow-sm">
            <img src="/hotel.jpg" alt="Hotel room ready to be listed" className="absolute inset-0 h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-slate-950/55" />
            <div className="relative flex min-h-80 max-w-xl flex-col items-start justify-center px-7 py-12 text-white sm:px-12">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                <Building2 size={24} />
              </span>
              <h2 className="mt-5 text-2xl font-black">Bring your first property online</h2>
              <p className="mt-2 text-sm leading-6 text-slate-200">Create the listing, add room types and photos, then send it for review when everything feels ready.</p>
              <Link to="/create-hotel" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-50">
                Start a property <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-black text-slate-900">All properties</h2>
                <p className="mt-0.5 text-xs text-slate-500">{hotels.length} {hotels.length === 1 ? "listing" : "listings"}</p>
              </div>
            </div>
            {hotels.map((hotel) => (
              <article key={hotel._id} className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-[150px_1fr_auto] sm:items-center">
                <img src={getPropertyCoverUrl(hotel)} alt={hotel.name} className="aspect-[16/10] w-full rounded-lg object-cover" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-900">{hotel.name}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusStyle[hotel.status] || statusStyle.draft}`}>
                      {hotel.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{hotel.type} · {hotel.city}</p>
                  {hotel.rejectionReason && (
                    <p className="mt-2 text-sm font-medium text-red-600">Rejection reason: {hotel.rejectionReason}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                  to={`/hotel/${hotel._id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                  <Eye size={17} /> Preview
                  </Link>
                  <Link
                  to={`/host/hotels/${hotel._id}/rooms`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                  Manage rooms <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default HostDashboard;
