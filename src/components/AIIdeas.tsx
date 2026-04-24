import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Scissors, Info } from 'lucide-react';
import { getDesignIdeas } from '../services/geminiService';

export default function AIIdeas() {
  const [material, setMaterial] = useState('Cotton');
  const [size, setSize] = useState('0.5 meters');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const materials = ['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Denim', 'Scraps'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getDesignIdeas(material, size);
    setIdeas(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 text-orange-600 rounded-2xl mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-[#1a1a1a] mb-4">AI Design Studio</h1>
        <p className="text-[#5A5A40]/70 max-w-xl mx-auto">
          Not sure what to do with your leftovers? Tell us what you have, and our AI will suggest creative upcycling projects.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white p-8 rounded-[32px] shadow-sm border border-[#5A5A40]/10 mb-12 flex flex-wrap gap-6 items-end justify-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 mb-2">Material Type</label>
          <select 
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full bg-[#f5f5f0] border-none rounded-xl focus:ring-2 focus:ring-[#5A5A40] px-4 py-3"
          >
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 mb-2">Approximate Size</label>
          <input 
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 10cm x 10cm"
            className="w-full bg-[#f5f5f0] border-none rounded-xl focus:ring-2 focus:ring-[#5A5A40] px-4 py-3"
          />
        </div>
        <button 
          disabled={loading}
          className="bg-[#5A5A40] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4A4A30] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          Generate Ideas
        </button>
      </form>

      <div className="grid gap-8">
        {ideas.map((idea, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-[#5A5A40]/10 flex gap-8 items-start relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4" />
            <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl shrink-0">
              <Scissors size={24} />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold mb-2">{idea.title}</h3>
              <p className="text-[#5A5A40]/80 mb-6 leading-relaxed italic">{idea.description}</p>
              
              <div className="space-y-3">
                {idea.steps.map((step: string, i: number) => (
                  <div key={i} className="flex gap-3 text-sm text-[#5A5A40]/70">
                    <span className="font-bold text-[#5A5A40] shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {!loading && ideas.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
            <Info className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 italic">Enter your fabric details above to get inspiration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
