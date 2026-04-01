'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Save } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from './AuthModal';

export default function UserMenu() {
  const { user, initialized, initialize, signOut } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!initialized) return null;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuth(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300 whitespace-nowrap"
          aria-label="Sign in"
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          Sign In
        </button>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gold-primary/20 text-gold-light rounded-lg hover:bg-gold-primary/10 transition-all"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-dark to-gold-primary flex items-center justify-center text-bg-primary text-xs font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">{displayName}</span>
      </button>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50">
          <div className="px-4 py-2 border-b border-gold-primary/10">
            <p className="text-text-primary text-sm font-medium truncate">{displayName}</p>
            <p className="text-text-secondary text-xs truncate">{user.email}</p>
          </div>
          <a
            href="/en/kundali"
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Saved Charts
          </a>
          <button
            onClick={() => { signOut(); setMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
