import GeneralTab from "@/components/settings/GenaralTab";
import SecurityTab from "@/components/settings/SecurityTab";
import { AuthContext } from "@/context/AuthContext";
import { Lock, User } from "lucide-react";
import React, { useContext, useState } from "react";

const AccountSettings = () => {
    // lấy thông tin
    const {user} = useContext(AuthContext);
    //general: thông tin user, security: đổi mật khẩu,
    const [activeTab, setActiveTab] = useState("general");
    const userInfo = user?.details || user; // Sử dụng details nếu có, nếu không thì dùng user gốc


    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Account Settings</h1>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "general" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"}`}
                        >
                            <User size={18} /> General Info
                        </button>
                        <button 
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "security" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"}`}
                        >
                            <Lock size={18} /> Security
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px]">
                        {activeTab === "general" ? (
                            <GeneralTab userInfo={userInfo} />
                        ) : (
                            <SecurityTab />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AccountSettings