import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { motion } from 'motion/react';
import { Upload as UploadIcon, X, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { MaterialType, ListingType } from '../types';

export default function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState<MaterialType>('Cotton');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState<ListingType>('swap');
  const [price, setPrice] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [city, setCity] = useState('');

  const sampleFabrics = [
    'https://images.unsplash.com/photo-1528459840556-3de5f3d9d672?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1544006659-f0b21884dc1d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1596753144102-de362b534eaf?auto=format&fit=crop&q=80&w=400'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (!imageUrl) {
      setError("Please provide a photo of the fabric.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'listings'), {
        title,
        description,
        material,
        color,
        size,
        type,
        price: type === 'buy' ? parseFloat(price) : 0,
        imageUrl,
        ownerId: auth.currentUser.uid,
        ownerName: auth.currentUser.displayName || 'Anonymous Tailor',
        location: {
          city,
          lat: 12.9716, // Default Bangalore
          lng: 77.5946
        },
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      try {
        handleFirestoreError(err, 'create', 'listings');
      } catch (formattedErr: any) {
        setError(JSON.parse(formattedErr.message).error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] shadow-sm border border-[#5A5A40]/10 overflow-hidden"
      >
        <div className="bg-[#5A5A40] p-10 text-white text-center">
          <h1 className="font-serif text-4xl font-bold mb-2">List Your Excess Fabric</h1>
          <p className="text-white/70">Fill in the details to find someone who can use your scraps.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex gap-3 items-center">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#5A5A40] border-b border-gray-100 pb-2">1. Photo & Basics</h2>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Fabric Photo (Required)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sampleFabrics.map((url, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(url)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${imageUrl === url ? 'border-orange-400 scale-95 shadow-inner' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={url} alt="Sample" className="w-full h-full object-cover" />
                    {imageUrl === url && (
                      <div className="absolute inset-0 bg-orange-400/20 flex items-center justify-center">
                        <CheckCircle className="text-white" size={32} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input 
                  type="url" 
                  placeholder="Or paste an image URL here..." 
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5A5A40]"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Listing Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Scraps of Red Indian Silk" 
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Material</label>
                <select 
                  required
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as any)}
                >
                  {['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Other'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#5A5A40] border-b border-gray-100 pb-2">2. Details & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Color</label>
                <input 
                  type="text" 
                  placeholder="e.g. Crimson Red" 
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Approx. Size</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 0.5m x 0.2m" 
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Your City</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Chennai" 
                  className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Description</label>
              <textarea 
                rows={3}
                placeholder="Include details like weight, weave, or any minor defects..." 
                className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#5A5A40] border-b border-gray-100 pb-2">3. Exchange Type</h2>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Listing Type</label>
                <div className="flex gap-2">
                  {(['swap', 'buy', 'free'] as ListingType[]).map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-6 py-3 rounded-full text-sm font-bold capitalize transition-all ${type === t ? 'bg-[#5A5A40] text-white shadow-md' : 'bg-[#f5f5f0] text-[#5A5A40]'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {type === 'buy' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2 flex-1"
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#f5f5f0] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40]"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="pt-10 flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'List Scrap Now'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-full font-bold text-[#5A5A40] border-2 border-[#5A5A40]/10 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
