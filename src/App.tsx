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
      <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-sans selection:bg-[#5A5A40]/30">
        <Header />
        <main>
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
        
        <footer className="bg-[#f5f5f0] border-t border-[#5A5A40]/10 py-12 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#5A5A40] p-1.5 rounded-lg text-white">
                <Scissors size={18} />
              </div>
              <span className="font-serif text-xl font-bold text-[#5A5A40]">Kutira-Kone</span>
            </div>
            <p className="text-[#5A5A40]/60 text-sm">
              © 2026 Kutira-Kone. Promoting circular fashion and reducing textile waste.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
