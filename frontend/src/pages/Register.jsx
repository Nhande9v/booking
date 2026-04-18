import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "sonner";
import { User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react"; // Thêm icon

const Register = () => {
  const [info, setInfo] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... Giữ nguyên logic validation của bạn ...
    // [Logic validation giữ nguyên]
    
    setLoading(true);
    try {
      await api.post("/auth/register", info);
      toast.success("Account created successfully! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      {/* Background Decor - Tạo điểm nhấn hiện đại */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
        
        {/* LEFT SIDE - Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-500 blur-[80px]" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/40">
                <span className="text-2xl font-black">A</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-6 leading-tight">
              Start your <br /> <span className="text-indigo-400">Extraordinary</span> <br /> journey.
            </h1>
            <div className="space-y-4">
              {[ "Best price guarantee", "Verified luxury stays", "24/7 Premium support"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs font-medium tracking-widest uppercase opacity-40">
            Azura Haven Luxury Edition
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="p-8 md:p-14 bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-400 font-medium">Join 10,000+ travelers worldwide</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text" id="username" placeholder="Username"
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border transition-all outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 ${errors.username ? 'border-red-500' : 'border-slate-100 focus:border-indigo-500'}`}
                  onChange={handleChange}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs font-bold ml-2">{errors.username}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email" id="email" placeholder="Email Address"
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border transition-all outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-indigo-500'}`}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-bold ml-2">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password" id="password" placeholder="Password"
                  className={`w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border transition-all outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 ${errors.password ? 'border-red-500' : 'border-slate-100 focus:border-indigo-500'}`}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs font-bold ml-2">{errors.password}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2 group"
            >
              {loading ? "Creating..." : "Register Now"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-sm font-medium text-slate-400 mt-6">
              Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;