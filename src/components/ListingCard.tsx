import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Tag, Scissors } from 'lucide-react';
import { Listing } from '../types';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }: { listing: Listing }) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'buy': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'free': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-panel rounded-lg overflow-hidden border border-border shadow-sm hover:border-primary/50 transition-all"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={listing.imageUrl || `https://images.unsplash.com/photo-1528459840556-3de5f3d9d672?auto=format&fit=crop&q=80&w=400`}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getBadgeColor(listing.type)}`}>
            {listing.type}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900/40 backdrop-blur-sm text-white text-[9px] font-mono border border-white/10">
            {listing.material[0].toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-xs font-bold text-text-main leading-tight truncate flex-1" title={listing.title}>
            {listing.title}
          </h3>
          {listing.type === 'buy' && (
            <span className="text-xs font-mono font-bold text-primary">₹{listing.price}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-3 text-[10px] text-text-muted font-medium">
          <MapPin size={10} className="text-slate-400" />
          <span className="truncate">{listing.location.city}</span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: listing.color.toLowerCase() }} />
            <span className="text-[9px] font-mono text-slate-400">{listing.size}</span>
          </div>
          <Link 
            to={`/listing/${listing.id}`}
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
          >
            Access Data
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
