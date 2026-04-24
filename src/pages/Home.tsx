import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing, MaterialType } from '../types';
import ListingCard from '../components/ListingCard';
import { Search, SlidersHorizontal, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<MaterialType | 'All'>('All');

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setListings(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = filterMaterial === 'All' || item.material === filterMaterial;
    return matchesSearch && matchesMaterial;
  });

  const materials: (MaterialType | 'All')[] = ['All', 'Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Other'];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search and Dashboard Header */}
      <section className="bg-white border-b border-border px-6 py-8 shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-text-main">Swap Dashboard</h2>
              <p className="text-sm text-text-muted font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Scraps: {listings.length} • Registered Artisans: 1.2k
              </p>
            </div>
            
            <div className="flex flex-1 max-w-2xl items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Query material, color, or location..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative shrink-0">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                  value={filterMaterial}
                  onChange={(e) => setFilterMaterial(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-8 py-2 text-xs font-bold uppercase tracking-tighter appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {materials.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="flex-1 overflow-y-auto px-6 py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Assets</h3>
            <div className="h-px flex-1 bg-border mx-4"></div>
            <span className="text-[10px] font-mono text-slate-400">OFFSET: 0 | LIMIT: 100</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded border border-border aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredListings.map(listing => (
                <div key={listing.id}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-lg border border-border shadow-sm">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
                <Info size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">Null Results Detected</h3>
              <p className="text-slate-400 text-sm">No matching fabric entries found in database registry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
