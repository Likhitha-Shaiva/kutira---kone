import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { Listing, SwapRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Tag, Scissors, User, Send, Clock, CheckCircle2, MessageSquare, X } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser] = useAuthState(auth);
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
      }
      setLoading(false);
    };
    fetchListing();

    // Listen for swap requests if owner
    const q = query(collection(db, `listings/${id}/swapRequests`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSwapRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SwapRequest)));
    });

    return () => unsubscribe();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!id || !listing || !currentUser) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `listings/${id}/swapRequests`), {
        listingId: id,
        ownerId: listing.ownerId,
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName || 'Anonymous',
        message: swapMessage,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setShowSwapModal(false);
      setSwapMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to send swap request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center font-mono text-text-muted text-sm uppercase tracking-widest">Initialising Buffer...</div>;
  if (!listing) return <div className="flex-1 flex items-center justify-center font-mono text-text-muted text-sm uppercase tracking-widest">Error 404: Node Not Found</div>;

  const isOwner = currentUser?.uid === listing.ownerId;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Detail Header bar */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} className="rotate-45" /> {/* Use X as back arrow by rotating */}
          </button>
          <div>
            <h2 className="text-sm font-bold text-text-main">{listing.title}</h2>
            <p className="text-[10px] text-text-muted uppercase font-mono">Registry ID: {listing.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${listing.type === 'swap' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
            Type: {listing.type}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase border border-slate-200">
            Material: {listing.material}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Main Content Column */}
          <div className="flex-1 space-y-6">
            <div className="panel-border bg-panel rounded-lg overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-2 border-b border-border flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Preview</span>
                <span className="text-[10px] font-mono text-slate-400">RAW_DATA_SOURCE</span>
              </div>
              <div className="p-4">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.title} 
                  className="w-full rounded border border-border aspect-video object-contain bg-slate-900"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="panel-border bg-panel rounded-lg shadow-sm">
              <div className="bg-slate-50 px-4 py-2 border-b border-border">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technical Overview</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-text-main mb-2">Description</h4>
                  <p className="text-sm text-text-muted leading-relaxed font-mono bg-slate-50 p-4 rounded border border-border">
                    {listing.description || 'No binary metadata provided for this entry.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stats-card">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Color Buffer</div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-sm border border-border" style={{ backgroundColor: listing.color.toLowerCase() }} />
                       <span className="text-sm font-bold">{listing.color}</span>
                    </div>
                  </div>
                  <div className="stats-card">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Scale Units</div>
                    <div className="text-sm font-bold">{listing.size}</div>
                  </div>
                  <div className="stats-card">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Node City</div>
                    <div className="text-sm font-bold">{listing.location.city}</div>
                  </div>
                  <div className="stats-card">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Registry Value</div>
                    <div className="text-sm font-bold text-primary">{listing.type === 'buy' ? `₹${listing.price}` : 'VARIABLE'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Side-Rail */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            <div className="panel-border bg-panel rounded-lg shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Origin Node</h3>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-primary font-bold">
                  {listing.ownerName[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">@{listing.ownerName}</div>
                  <div className="text-[10px] text-text-muted font-mono uppercase">Verified Tailor</div>
                </div>
              </div>
              
              {isOwner ? (
                <div className="space-y-4">
                  <div className="h-px bg-border"></div>
                  <h4 className="text-[10px] font-bold text-primary uppercase">Protocol Requests ({swapRequests.length})</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {swapRequests.map(req => (
                      <div key={req.id} className="bg-slate-50 p-3 rounded border border-border text-[11px]">
                        <div className="flex justify-between items-center mb-1">
                           <span className="font-bold text-slate-700">@{req.requesterName}</span>
                           <span className="text-slate-400">{req.status}</span>
                        </div>
                        <p className="text-slate-500 italic mt-1 font-mono">"{req.message}"</p>
                      </div>
                    ))}
                    {swapRequests.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-[10px] border border-dashed border-slate-200 rounded">
                        No active requests detected.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSwapModal(true)}
                  className="w-full bg-primary text-white py-3 rounded text-sm font-bold shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Initiate Port Exchange
                </button>
              )}
            </div>

            <div className="bg-slate-900 rounded-lg p-5 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Smart Analytics</p>
                 <h4 className="text-xs font-bold mb-2">Sustainable Impact</h4>
                 <p className="text-[10px] text-slate-400 leading-normal mb-4">Exchanging this fabric prevents approx. 0.4kg of textile waste from entering local landfills.</p>
                 <div className="w-full bg-slate-800 h-1 rounded-full">
                    <div className="bg-emerald-500 h-1 rounded-full w-[65%]"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSwapModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-panel w-full max-w-lg rounded-xl border border-border shadow-2xl overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-border flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Port Transaction</h2>
                <button onClick={() => setShowSwapModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Message to Origin</div>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none font-mono text-sm"
                    placeholder="Provide swap proposal or purchase intent..."
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                  />
                </div>
                <button 
                  disabled={isSubmitting || !swapMessage.trim()}
                  onClick={handleSwapRequest}
                  className="w-full bg-primary text-white py-3 rounded font-bold text-sm hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? <Clock className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                  Transmit Protocol Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
