import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Tag, Scissors } from 'lucide-react';
import { Listing } from '../types';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }: { listing: Listing }) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-100 text-blue-700';
      case 'buy': return 'bg-green-100 text-green-700';
      case 'free': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#5A5A40]/10"
    >
      <div className="relative aspect-square">
        <img 
          src={listing.imageUrl || `https://images.unsplash.com/photo-1528459840556-3de5f3d9d672?auto=format&fit=crop&q=80&w=400`}
          alt={listing.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeColor(listing.type)}`}>
            {listing.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-[#1a1a1a] leading-tight">
            {listing.title}
          </h3>
          {listing.type === 'buy' && (
            <span className="font-bold text-[#5A5A40]">₹{listing.price}</span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs text-[#5A5A40]/70 bg-[#f5f5f0] px-2 py-1 rounded-md">
            <Tag size={12} />
            {listing.material}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#5A5A40]/70 bg-[#f5f5f0] px-2 py-1 rounded-md">
            <Scissors size={12} />
            {listing.size}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-[#5A5A40]/60 text-sm">
            <MapPin size={14} />
            <span>{listing.location.city}</span>
          </div>
          <Link 
            to={`/listing/${listing.id}`}
            className="text-[#5A5A40] text-sm font-bold hover:underline"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
