import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import api from "../lib/axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() !== confirmPassword.trim()) {
        return toast.error("Passwords do not match!");
    }

    setLoading(true);
   try {
      // Đảm bảo URL có chứa biến token và body có chứa password
      await api.put(`/auth/reset-password/${token}`, { password }); 
      toast.success("Success!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Chi tiết lỗi:", err.response?.data); 
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">New Password</h2>
          <p className="text-slate-400 text-sm">Please enter a strong password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Updating..." : "RESET PASSWORD"}
            {!loading && <CheckCircle2 size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;