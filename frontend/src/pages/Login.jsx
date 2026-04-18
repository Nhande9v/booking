import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/axios";
import { toast } from "sonner";
import { User, Lock, ArrowRight, ShieldCheck, Stars } from "lucide-react";

const Login = () => {
  // Lưu dữ liệu thông tin đăng nhập
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});

  //dispatch để cập nhật trạn thái đăng nhập
  const { loading, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev, // Cập nhật giá trị của field tương ứng
      [e.target.id]: e.target.value,
    }));
    // Xóa lỗi của field đó khi người dùng bắt đầu nhập lại
    if (errors[e.target.id]) {
      setErrors(prev => ({ ...prev, [e.target.id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản tại client
    let newErrors = {};
    if (!credentials.username) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please enter your credentials");
      return;
    }

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });

      toast.success("Welcome back to Azura Haven! 🎉");

      // Chuyển hướng sau 1 giây để người dùng kịp thấy thông báo thành công
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check again.";
      
      toast.error(errorMsg);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: { message: errorMsg },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans relative overflow-hidden">
      
      {/* Background Orbs - Hiệu ứng các khối màu mờ hiện đại */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white">
        
        {/* PHẦN TRÁI: BRANDING & INSPIRATION */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-slate-900 text-white relative">
          {/* Lớp phủ họa tiết nhẹ */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Stars size={12} className="text-yellow-400" /> Premium Experience
            </div>
            
            <h1 className="text-5xl text-center font-black leading-tight mb-6">
              Book Your <br />
              <span className="text-indigo-400">Dream</span> Stay.
            </h1>
            <p className="text-slate-400 text-lg max-w-[280px] text-center mx-auto">
              Access exclusive deals and manage your trips with ease.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Secure Authentication</p>
                <p className="text-xs text-slate-500">Your data is always protected</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">
              © 2026 Azura Haven Co.
            </div>
          </div>
        </div>

        {/* PHẦN PHẢI: LOGIN FORM */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="username"
                  placeholder="Nahnoha"
                  value={credentials.username}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 ${
                    errors.username ? "border-red-500" : "border-slate-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-[10px] font-bold ml-2 italic">{errors.username}</p>}
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 ${
                    errors.password ? "border-red-500" : "border-slate-100 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold ml-2 italic">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Link to Register */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                New to Azura Haven?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-bold hover:underline underline-offset-4"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;