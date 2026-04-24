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
      setError("Asset photo manifest required for registration.");
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
    <div className="flex-1 overflow-y-auto px-6 py-12 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto panel-border bg-panel rounded-lg shadow-sm overflow-hidden"
      >
        <div className="bg-slate-900 p-8 text-white">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Port_Registration</p>
          <h1 className="text-2xl font-bold mb-1">New Asset Entry</h1>
          <p className="text-slate-400 text-sm font-mono lowercase">Configure parameters for excess fabric allocation.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-xs font-mono flex gap-3 items-center">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-primary uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Step 01</span>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capture Visual Latency</h2>
             </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sampleFabrics.map((url, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(url)}
                    className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${imageUrl === url ? 'border-primary shadow-lg ring-4 ring-primary/10' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} alt="Sample" className="w-full h-full object-cover" />
                    {imageUrl === url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <CheckCircle className="text-white" size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Manual_URL_Input</label>
                <input 
                  type="url" 
                  placeholder="https://cloud.fabric/asset_id..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-primary uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Step 02</span>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata Configuration</h2>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Registry_Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="SCRAP_IDENTIFIER" 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Material_Class</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as any)}
                >
                  {['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Other'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Color_Hex_Def</label>
                <input 
                  type="text" 
                  placeholder="e.g. #FF0000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Scale_Descriptor</label>
                <input 
                  required
                  type="text" 
                  placeholder="Units: m/cm" 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Geo_City_Node</label>
                <input 
                  required
                  type="text" 
                  placeholder="HOST_NODE" 
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-primary uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Step 03</span>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Mode</h2>
             </div>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="space-y-2">
                <div className="flex gap-2">
                  {(['swap', 'buy', 'free'] as ListingType[]).map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-4 py-2 rounded text-[10px] font-bold uppercase border transition-all ${type === t ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
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
                  className="space-y-2 flex-1 min-w-[120px]"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit_Price (INR)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-3">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-6 py-3 rounded font-bold text-sm hover:bg-primary-hover transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Transmitting Data...' : 'Commit Asset Registry'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded font-bold text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all text-sm"
            >
              Abort
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
