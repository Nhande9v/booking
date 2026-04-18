import React, { useState, useEffect, useContext } from "react";
import { Globe,  Menu, LogOut, ChevronDown, Briefcase, Settings } from "lucide-react"; 
import { AuthContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const displayName = user?.details?.username || user?.username;
    const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
                isScrolled 
                ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] py-3 border-b border-white/20" 
                : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-[10deg] transition-transform duration-300">
                            <span className="text-white font-black text-xl tracking-tighter">A</span>
                        </div>
                        <div className="absolute -inset-1 bg-blue-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                        isScrolled ? "text-slate-900" : "text-slate-600"
                    }`}>
                        Azura<span className="text-blue-500">Haven</span>
                    </span>
                </Link>

                {/* Main Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    <ul className={`flex items-center gap-8 text-[14px] font-bold tracking-wide transition-colors ${
                        isScrolled ? "text-slate-600" : "text-slate-600"
                    }`}>
                        <li>
                            <Link to="/" className="hover:text-blue-500 transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 hover:after:w-full after:transition-all">Home</Link>
                        </li>
                        <li>
                            <Link to="/bookings" className="hover:text-blue-500 transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 hover:after:w-full after:transition-all">My Bookings</Link>
                        </li>
                    </ul>

                    <div className="h-6 w-[1px] bg-slate-300/30" />

                    <div className="flex items-center gap-6">
                        <button className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                            isScrolled ? "text-slate-600 hover:text-blue-600" : "text-slate-600 hover:text-white"
                        }`}>
                            <Globe size={18} className="animate-spin-slow" />
                            <span>EN</span>
                        </button>

                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-3 p-1 pr-3 rounded-full border transition-all ${
                                        isScrolled 
                                        ? "bg-slate-50 border-slate-200 hover:border-blue-300" 
                                        : "bg-slate-600 border-white/20 hover:bg-black/50"
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                                        {initial}
                                    </div>
                                    <span className={`text-sm font-bold ${isScrolled ? "text-slate-700" : "text-white"}`}>
                                        {displayName}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""} ${isScrolled ? "text-slate-400" : "text-white/70"}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 animate-in fade-in zoom-in duration-200">
                                            <Link   to="/settings" 
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                                                <Settings size={18} /> Account Settings
                                            </Link>
                                            <Link to="/bookings" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                                                <Briefcase size={18} /> My Bookings
                                            </Link>
                                            <div className="h-[1px] bg-slate-100 my-2 mx-2" />
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className={`px-7 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                                    isScrolled 
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                                    : "bg-white text-blue-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                }`}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button className={`md:hidden p-2 rounded-xl ${isScrolled ? "text-slate-900" : "text-white"}`}>
                    <Menu size={28} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;