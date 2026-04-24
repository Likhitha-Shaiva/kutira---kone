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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <section className="bg-white border-b border-border px-6 py-12 shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-primary border border-indigo-100 rounded-lg mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Generative Design Studio</h1>
          <p className="text-sm text-text-muted max-w-lg mx-auto font-medium lowercase tracking-tight">
            Advanced heuristic engine for circular textile upcycling. Input scrap parameters to compute creative secondary use-cases.
          </p>
        </div>
      </section>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          <form onSubmit={handleGenerate} className="bg-panel p-6 rounded-lg border border-border shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Input_Material</label>
              <select 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {materials.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Scale_Descriptor</label>
              <input 
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 10cm x 10cm"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button 
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded text-sm font-bold hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Compute Ideas
            </button>
          </form>

          <div className="grid gap-4">
            {ideas.map((idea, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-panel border border-border rounded-lg shadow-sm flex overflow-hidden"
              >
                <div className="w-2 bg-indigo-500 shrink-0"></div>
                <div className="p-6 flex gap-6">
                  <div className="bg-slate-50 text-slate-400 p-3 rounded border border-slate-200 self-start">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-main mb-1 uppercase tracking-tight">{idea.title}</h3>
                    <p className="text-sm text-text-muted mb-4 font-mono leading-relaxed">{idea.description}</p>
                    
                    <div className="space-y-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedural Steps</span>
                       {idea.steps.map((step: string, i: number) => (
                        <div key={i} className="flex gap-3 text-[11px] text-slate-600 font-mono">
                          <span className="text-primary font-bold">0{i + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {!loading && ideas.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-slate-200">
                <Info className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-400 text-xs font-mono uppercase tracking-tighter">Enter parameters to begin heuristic computation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
