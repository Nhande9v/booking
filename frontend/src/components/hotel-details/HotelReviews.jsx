import React, { useCallback, useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquareText, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";

const ReviewStars = ({ value, onChange, interactive = false, size = 18 }) => (
  <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const Icon = (
        <Star
          size={size}
          className={star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}
        />
      );
      return interactive ? (
        <button key={star} type="button" title={`${star} stars`} onClick={() => onChange(star)} className="p-0.5 transition hover:scale-110">
          {Icon}
        </button>
      ) : <span key={star}>{Icon}</span>;
    })}
  </div>
);

const HotelReviews = ({ hotel, onSummaryChange }) => {
  const { user } = useContext(AuthContext);
  const role = user?.details?.role || user?.role;
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      //Nếu không truyền page thì mặc định sẽ lấy page 1, limit 5
      const response = await api.get(`/reviews/hotel/${hotel._id}`, { params: { page, limit: 5 } });
      setReviews(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load guest reviews.");
    } finally {
      setLoading(false);
    }
  }, [hotel._id, page]);

  const fetchMyReview = useCallback(async () => {
    if (role !== "user") return;
    try {
      const response = await api.get(`/reviews/hotel/${hotel._id}/mine`);
      setMyReview(response.data);
      if (response.data) {
        setRating(response.data.rating);
        setComment(response.data.comment);
      }
    } catch (error) {
      console.error("Unable to load your review:", error);
    }
  }, [hotel._id, role]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchMyReview();
  }, [fetchMyReview]);

  const saveReview = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = { rating, comment };
      const response = myReview
        ? await api.patch(`/reviews/${myReview._id}`, payload)
        : await api.post(`/reviews/hotel/${hotel._id}`, payload);
      setMyReview(response.data.review);
      onSummaryChange(response.data.summary);
      toast.success(myReview ? "Your review was updated." : "Thank you for your review.");
      setPage(1);
      await fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save your review.");
    } finally {
      setSaving(false);
    }
  };

  const deleteMyReview = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      const response = await api.delete(`/reviews/${myReview._id}`);
      setMyReview(null);
      setRating(5);
      setComment("");
      onSummaryChange(response.data.summary);
      toast.success("Your review was deleted.");
      setPage(1);
      await fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete your review.");
    }
  };

  return (
    <section className="mt-8 border-t border-slate-200 pt-8" id="reviews">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-blue-600">Guest reviews</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            {hotel.reviewCount ? `${Number(hotel.rating).toFixed(1)} out of 5` : "No reviews yet"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{hotel.reviewCount || 0} guest {hotel.reviewCount === 1 ? "review" : "reviews"}</p>
        </div>
        {hotel.reviewCount > 0 && <ReviewStars value={Math.round(hotel.rating)} size={20} />}
      </div>

      {role === "user" ? (
        <form onSubmit={saveReview} className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">{myReview ? "Edit your review" : "Share your experience"}</h3>
              <p className="mt-1 text-xs text-slate-500">One review per guest account and property.</p>
            </div>
            <ReviewStars value={rating} onChange={setRating} interactive size={22} />
          </div>
          <textarea
            required
            minLength="10"
            maxLength="1000"
            rows="4"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What stood out about your stay?"
            className="mt-4 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">{comment.length}/1000</span>
            <div className="flex gap-2">
              {myReview && (
                <button type="button" title="Delete review" onClick={deleteMyReview} className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 size={17} />
                </button>
              )}
              <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving..." : myReview ? "Update review" : "Post review"}
              </button>
            </div>
          </div>
        </form>
      ) : !user ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <Link to="/login" className="font-bold text-blue-600">Sign in</Link> with a guest account to write a review.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center">
            <MessageSquareText className="mx-auto text-slate-400" size={28} />
            <p className="mt-3 font-bold text-slate-800">Be the first to share your experience</p>
          </div>
        ) : reviews.map((review) => (
          <article key={review._id} className="border-b border-slate-200 pb-4 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900">{review.userId?.username || "Guest"}</p>
                <p className="mt-0.5 text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <ReviewStars value={review.rating} size={15} />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{review.comment}</p>
          </article>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <nav className="mt-5 flex items-center justify-center gap-3" aria-label="Review pagination">
          <button type="button" title="Previous reviews" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 disabled:opacity-40"><ChevronLeft size={17} /></button>
          <span className="text-sm font-bold text-slate-600">{pagination.page} / {pagination.totalPages}</span>
          <button type="button" title="Next reviews" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 disabled:opacity-40"><ChevronRight size={17} /></button>
        </nav>
      )}
    </section>
  );
};

export default HotelReviews;
