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

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-[#5A5A40] italic text-2xl">Loading scrap details...</div>;
  if (!listing) return <div className="h-screen flex items-center justify-center font-serif text-[#5A5A40] italic text-2xl">Listing not found.</div>;

  const isOwner = currentUser?.uid === listing.ownerId;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[40px] overflow-hidden bg-white shadow-sm border border-[#5A5A40]/10 aspect-square"
        >
          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${listing.type === 'swap' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {listing.type} Available
            </div>
            <h1 className="font-serif text-5xl font-bold mb-4 leading-tight">{listing.title}</h1>
            <div className="flex items-center gap-4 text-[#5A5A40]/60 text-lg">
              <div className="flex items-center gap-1">
                <MapPin size={20} />
                <span>{listing.location.city}</span>
              </div>
              <div className="w-1 h-1 bg-[#5A5A40]/20 rounded-full" />
              <div className="flex items-center gap-1 font-bold text-[#5A5A40]">
                <Tag size={20} />
                <span>{listing.material}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-[#5A5A40]/10 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/50 mb-1">Approx Size</span>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Scissors size={18} className="text-[#5A5A40]" />
                  <span>{listing.size}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/50 mb-1">Color</span>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: listing.color.toLowerCase() }} />
                  <span>{listing.color}</span>
                </div>
              </div>
            </div>
            
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/50 mb-2">Description</span>
              <p className="text-gray-600 leading-relaxed font-sans">{listing.description || 'No additional details provided.'}</p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <User size={20} className="text-orange-600" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-gray-400">Post by</span>
                  <span className="font-bold text-[#5A5A40] underline underline-offset-4 decoration-orange-400">@{listing.ownerName}</span>
                </div>
              </div>
              {listing.type === 'buy' && (
                <div className="text-right">
                  <span className="block text-[10px] font-bold uppercase text-gray-400">Price</span>
                  <span className="text-3xl font-serif font-black text-[#5A5A40]">₹{listing.price}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {isOwner ? (
              <div className="w-full space-y-6">
                <div className="flex items-center gap-2 text-orange-600">
                  <MessageSquare size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Active Swap Requests ({swapRequests.length})</h3>
                </div>
                <div className="space-y-4">
                  {swapRequests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl border border-orange-100 flex justify-between items-center shadow-sm">
                      <div>
                        <span className="font-bold">@{req.requesterName}</span>
                        <p className="text-sm text-gray-500 italic mt-1">"{req.message}"</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${req.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                  {swapRequests.length === 0 && (
                    <div className="bg-gray-50 py-10 px-6 rounded-2xl text-center border-2 border-dashed border-gray-200">
                      <p className="text-sm text-gray-400 italic">No one has requested a swap yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowSwapModal(true)}
                className="w-full bg-[#5A5A40] text-white py-5 rounded-full font-bold text-xl shadow-lg hover:bg-[#4A4A30] transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Send size={24} />
                <span>Request {listing.type === 'swap' ? 'Swap' : 'Purchase'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Swap Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwapModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="font-serif text-3xl font-bold">Talk to the Tailor</h2>
                    <p className="text-gray-500 text-sm mt-1">Tell @{listing.ownerName} why you want this scrap.</p>
                  </div>
                  <button onClick={() => setShowSwapModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                  </button>
                </div>
                
                <textarea 
                  className="w-full bg-[#f5f5f0] border-none rounded-[24px] p-6 focus:ring-2 focus:ring-[#5A5A40] h-40 resize-none font-sans"
                  placeholder="Hi! I'm an artisan and I'd love to use this for a patchwork project..."
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                />
                
                <div className="flex gap-4 mt-8">
                  <button 
                    disabled={isSubmitting || !swapMessage.trim()}
                    onClick={handleSwapRequest}
                    className="flex-1 bg-[#5A5A40] text-white py-4 rounded-full font-bold text-lg hover:bg-[#4A4A30] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Clock className="animate-spin" /> : <CheckCircle2 />}
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
