import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import AdminHotelFilters from "@/components/admin/AdminHotelFilters";
import HotelReviewCard from "@/components/admin/HotelReviewCard";
import api from "@/lib/axios";

const AdminHotelReview = () => {
  const [hotels, setHotels] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 1 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/hotels/review", {
        params: { status: statusFilter, page, limit: 10, search: debouncedSearch || undefined },
      });
      setHotels(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load the review queue.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, debouncedSearch]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const review = async (hotel, action) => {
    try {
      await api.patch(`/hotels/${hotel._id}/review`, {
        action,
        reason: reasons[hotel._id] || "",
      });
      toast.success(action === "approve" ? "Property approved." : "Property rejected.");
      setHotels((current) => current.filter((item) => item._id !== hotel._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update this review.");
    }
  };

  const toggleFeatured = async (hotel) => {
    try {
      const response = await api.patch(`/hotels/${hotel._id}/featured`, { featured: !hotel.featured });
      setHotels((current) => current.map((item) => item._id === hotel._id ? { ...item, ...response.data } : item));
      toast.success(response.data.featured ? "Property added to Featured." : "Property removed from Featured.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update Featured properties.");
    }
  };

  const refreshCoordinates = async (hotel) => {
    try {
      const response = await api.patch(`/hotels/${hotel._id}/geocode`);
      setHotels((current) => current.map((item) => item._id === hotel._id ? { ...item, ...response.data } : item));
      toast.success("Map location updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to locate this property address.");
    }
  };

  const changeStatus = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-blue-600">Admin moderation</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Property review queue</h1>
            <p className="mt-2 text-sm text-slate-500">Review submitted listings before they become publicly available.</p>
          </div>
          <button type="button" title="Refresh" onClick={fetchHotels} className="rounded-lg border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-100">
            <RefreshCw size={19} />
          </button>
        </header>

        <AdminHotelFilters
          status={statusFilter}
          onStatusChange={changeStatus}
          search={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <p className="py-16 text-center text-slate-500">Loading review queue...</p>
        ) : hotels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            {searchQuery && <Search className="mx-auto mb-3 text-slate-400" size={30} />}
            <p className="font-semibold text-slate-600">
              {searchQuery
                ? `No properties match “${searchQuery}”.`
                : statusFilter === "pending"
                  ? "No properties are waiting for review."
                  : "No published properties found."}
            </p>
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700">Clear search</button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>{pagination.totalItems} {pagination.totalItems === 1 ? "property" : "properties"}</span>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            </div>
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <HotelReviewCard
                  key={hotel._id}
                  hotel={hotel}
                  status={statusFilter}
                  reason={reasons[hotel._id] || ""}
                  onReasonChange={(reason) => setReasons((current) => ({ ...current, [hotel._id]: reason }))}
                  onReview={(action) => review(hotel, action)}
                  onToggleFeatured={() => toggleFeatured(hotel)}
                  onRefreshCoordinates={() => refreshCoordinates(hotel)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Property pagination">
                <button type="button" title="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft size={19} />
                </button>
                <span className="min-w-28 text-center text-sm font-bold text-slate-700">{pagination.page} / {pagination.totalPages}</span>
                <button type="button" title="Next page" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => Math.min(current + 1, pagination.totalPages))} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronRight size={19} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default AdminHotelReview;
