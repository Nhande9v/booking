import React from 'react';
import { Card } from '@/components/ui/card'; 
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react'; // Thêm icon để chuyên nghiệp hơn

const FeaturedHotels = ({ hotels }) => {
    if (!hotels || hotels.length === 0) {
        return (
            <div className="py-24 text-center">
                <div className="inline-block animate-pulse text-slate-400 font-medium">
                    Discovering sanctuaries...
                </div>
            </div>
        );
    }

    const mainHotel = hotels[0]; 
    const sideHotels = hotels.slice(1, 3); 

    const getDisplayPhoto = (photoData) => {
        if (Array.isArray(photoData)) return photoData[0];
        return photoData?.split(',')[0];
    };

    return (
        <section className="py-20 px-6 bg-[#fcfcfd]">
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6'>
                    <div className='max-w-2xl'>
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-[0.2em] mb-3 block">
                            Featured Collection
                        </span>
                        <h2 className='text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight'>
                            Hand-picked sanctuaries for the <br className="hidden md:block" /> discerning traveler.
                        </h2>
                    </div>

                </div>

                <div className='flex flex-wrap items-stretch gap-8'>
                    {/* Main Featured Hotel */}
                    <div className="w-full lg:w-[calc(68%-1rem)] flex">
                        <Card className="ring-0 group relative w-full border-0 shadow-none bg-transparent overflow-hidden cursor-pointer">
                            <div className='relative h-[600px] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-900/10'>
                                <img
                                    src={getDisplayPhoto(mainHotel.photo)}
                                    alt={mainHotel.name}
                                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110'
                                />
                                {/* có lớp phủ để text nổi hơn */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                
                                <Badge className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 shadow-xl rounded-full flex items-center gap-1">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{mainHotel.rating}</span>
                                </Badge>

                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <div className="flex items-center gap-2 mb-2 text-white/80">
                                        <MapPin size={16} />
                                        <span className="text-sm font-medium tracking-wide">{mainHotel.city}</span>
                                    </div>
                                    <h3 className='font-bold text-4xl mb-2'>{mainHotel.name}</h3>
                                    <p className="text-xl font-light text-white/90">
                                        Starting from <span className="font-bold text-white">VND {mainHotel.price}</span> / night
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ảnh bên phải */}
                    <div className='w-full lg:w-[calc(32%-1rem)] flex flex-col gap-8'>
                        {sideHotels.map((hotel) => (
                            <Card key={hotel._id} className="ring-0 flex flex-col flex-1 border-0 shadow-none bg-transparent group cursor-pointer">
                                <div className='relative h-[220px] overflow-hidden rounded-[1.5rem] shadow-lg group-hover:shadow-blue-500/10 transition-all duration-500'>
                                    <img
                                        src={getDisplayPhoto(hotel.photo)}
                                        alt={hotel.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-slate-900/60 backdrop-blur-sm text-white border-none px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            Trending
                                        </Badge>
                                    </div>
                                </div>
                                <div className="pt-5 px-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                            {hotel.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{hotel.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter italic">
                                            {hotel.city}
                                        </p>
                                        <p className="text-slate-900 font-medium">
                                            <span className="text-lg font-black text-blue-600">VND {hotel.price}</span>
                                            <span className="text-xs text-slate-400 ml-1">/night</span>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedHotels;