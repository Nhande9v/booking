import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const SecurityTab = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put("auth/update-password", passwords);
            toast.success(" Password updated successfully! 🎉");
            setPasswords({ currentPassword: "", newPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Security Settings</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Current Password</label>
                    <input 
                        type="password" 
                        required
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">New Password</label>
                    <input 
                        type="password" 
                        required
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                </div>
                <button 
                    disabled={loading}
                    className="mt-4 w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default SecurityTab;