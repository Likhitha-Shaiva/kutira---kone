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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-20 text-center relative overflow-hidden py-10 rounded-[48px] bg-[#5A5A40] text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Simulated pattern */}
          <div className="grid grid-cols-12 gap-4 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-white/20 rounded-full w-12 h-12" />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            The Marketplace for <br /> <span className="text-orange-400">Leftover Fabric</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            A zero-waste exchange. List your scraps, trade with neighbors, and breathe new life into textile waste.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto bg-white p-2 rounded-[32px] shadow-xl"
          >
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <Search className="text-[#5A5A40]" size={24} />
              <input 
                type="text" 
                placeholder="Search scraps, colors, materials..." 
                className="w-full bg-transparent border-none text-[#1a1a1a] focus:ring-0 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 p-1">
              <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[300px]">
                {materials.slice(0, 4).map(m => (
                  <button 
                    key={m}
                    onClick={() => setFilterMaterial(m)}
                    className={`px-4 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterMaterial === m ? 'bg-orange-400 text-white' : 'text-[#5A5A40] hover:bg-[#f5f5f0]'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button 
                className="bg-[#5A5A40] text-white px-8 py-4 rounded-full font-bold hover:bg-[#4A4A30] transition-colors shadow-lg"
              >
                Find Bits
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-bold">New Discoveries</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#5A5A40] text-sm font-medium">
            <SlidersHorizontal size={16} />
            <span>Filter Material:</span>
          </div>
          <select 
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value as any)}
            className="bg-white border-none rounded-full px-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#5A5A40]"
          >
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] aspect-square animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredListings.map(listing => (
            <div key={listing.id}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40">
          <div className="inline-flex p-6 bg-gray-100 rounded-full text-gray-400 mb-6">
            <Info size={48} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-600 mb-2">No scraps found</h3>
          <p className="text-gray-400">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
