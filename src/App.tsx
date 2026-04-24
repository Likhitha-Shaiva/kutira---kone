import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ListingDetail from './pages/ListingDetail';
import AIIdeas from './components/AIIdeas';
import { auth } from './lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-2xl text-[#5A5A40]">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-surface text-text-main font-sans selection:bg-primary/20 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/ai-ideas" element={<AIIdeas />} />
          </Routes>
        </main>
        
        {/* Status Bar */}
        <footer className="h-8 bg-status-bar text-slate-400 text-[10px] flex items-center justify-between px-4 shrink-0 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Exchange Protocol: Active
            </div>
            <div className="text-slate-500">|</div>
            <div>Auth: <span className="text-slate-200">Authenticated</span></div>
            <div className="text-slate-500">|</div>
            <div>Sync: <span className="text-slate-200">Real-time</span></div>
          </div>
          <div className="flex items-center gap-3">
            <span>KUTIRA OS v1.1.0</span>
            <span className="uppercase tracking-tighter">System Time: {new Date().toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
