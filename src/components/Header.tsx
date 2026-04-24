import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, User, LogOut, Plus } from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Header() {
  const [user] = useAuthState(auth);

  return (
    <header className="sticky top-0 z-50 bg-[#f5f5f0] border-b border-[#5A5A40]/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#5A5A40] p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
            <Scissors size={24} />
          </div>
          <span className="font-serif text-2xl font-bold text-[#5A5A40]">Kutira-Kone</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-[#5A5A40] font-medium hover:underline underline-offset-4">Browse</Link>
          <Link to="/ai-ideas" className="text-[#5A5A40] font-medium hover:underline underline-offset-4">AI Projects</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/upload" className="bg-[#5A5A40] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#4A4A30] transition-colors">
                <Plus size={18} />
                <span>List Scrap</span>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-[#5A5A40]/20">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || 'Profile'} 
                  className="w-8 h-8 rounded-full border border-[#5A5A40]/20"
                />
                <button 
                  onClick={logout}
                  className="text-[#5A5A40] hover:text-red-600 p-2"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-[#5A5A40] text-white px-6 py-2 rounded-full font-medium hover:bg-[#4A4A30] transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
