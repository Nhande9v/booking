import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
const DiscountSection = ({ hotels, loading }) => {
    const discountedHotels = hotels?.filter(h => h.oldPrice > h.price).slice(0, 4) || [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    if (loading || discountedHotels.length === 0) return null;

     const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-24 px-6 bg-gradient-to-b from-white to-slate-50"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-14">
                    <div>
                        <div className="flex items-center gap-2 text-red-500 font-semibold text-xs uppercase tracking-widest mb-2">
                            <Tag size={14} />
                            Limited Time Offers
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                            Exclusive <span className="text-red-500">Deals</span>
                        </h2>
                    </div>

                    <button className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black transition">
                        View All
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >

                    {discountedHotels.map((hotel) => {
                        const discountPercent = Math.round(
                            ((hotel.oldPrice - hotel.price) / hotel.oldPrice) * 100
                        );

                        return (
                            <motion.div
                                key={hotel._id}
                                variants={item}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl transition"
                            >
                                {/* Image */}
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={Array.isArray(hotel.photo)
                                            ? hotel.photo[0]
                                            : hotel.photo?.split(',')[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />

                                    {/* Discount badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-md">
                                            -{discountPercent}%
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-2">
                                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                                        {hotel.name}
                                    </h3>

                                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                                        {hotel.city}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xl font-bold text-slate-900">
                                            {formatPrice(hotel.price)}đ
                                        </span>

                                        <span className="text-sm text-slate-400 line-through">
                                            {formatPrice(hotel.oldPrice)}đ
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                </motion.div>
            </div>
        </motion.section>
    );
};

export default DiscountSection;