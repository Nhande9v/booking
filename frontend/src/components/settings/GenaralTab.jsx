import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";

const GeneralTab = ({ userInfo }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold text-slate-800 mb-6">General Information</h2>
        <div className="space-y-6 max-w-md">
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                    <User size={18} className="text-slate-400" />
                    <span className="font-medium">{userInfo?.username}</span>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 overflow-hidden">
                    <Mail size={18} className="text-slate-400 flex-shrink-0" />
                    <span className="font-medium break-all">{userInfo?.email}</span>
                </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-700 leading-relaxed">
                  Your account is verified and secure. To change your primary email, please contact our support team.
                </p>
            </div>
        </div>
    </div>
);

export default GeneralTab;