import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, User, LogOut, Plus } from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Header() {
  const [user] = useAuthState(auth);

  return (
    <header className="h-16 bg-panel border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            KK
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-text-main">Kutira-Kone</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Fabric Exchange v2.4.0</p>
          </div>
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link to="/" className="text-sm font-semibold text-slate-700 hover:text-primary px-2 transition-colors">Browse</Link>
        <Link to="/ai-ideas" className="text-sm font-semibold text-slate-700 hover:text-primary px-2 transition-colors">AI Projects</Link>
        
        {user ? (
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <Link to="/upload" className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm">
              <Plus size={16} />
              List Scrap
            </Link>
            <div className="flex items-center gap-2">
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || 'Profile'} 
                className="w-8 h-8 rounded-full border border-border"
              />
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="px-6 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}
