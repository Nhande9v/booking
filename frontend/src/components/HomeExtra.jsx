import React from "react";
import { ShieldCheck, Headset, Lock } from "lucide-react"; // Nếu bạn dùng lucide-react, hoặc dùng SVG bên dưới

const HomeExtra = () => {
    const extras = [
        {
            title: "Curated Precision",
            desc: "Every property in our portfolio is hand-vetted by our editorial team for architectural merit and service excellence.",
            icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Concierge Support",
            desc: "Dedicated haven-specialists available 24/7 to manage your itinerary and special requests.",
            icon: <Headset className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Secure Sanctuary",
            desc: "Your data and payments are protected by industry-leading encryption and privacy protocols.",
            icon: <Lock className="w-6 h-6 text-blue-600" />
        }
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {extras.map((item, index) => (
                    <div key={index} className="flex flex-col items-start space-y-4">
                        <div className="p-3 bg-slate-100 rounded-lg">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeExtra;