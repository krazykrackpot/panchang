'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthModal from './AuthModal';
import OnboardingModal from './OnboardingModal';

export default function UserMenu() {
  const locale = useLocale();
  const { user, initialized, initialize, signOut } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
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

  useEffect(() => {
    if (!user || profileChecked) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('default_location, date_of_birth, display_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setProfileChecked(true);
        if (error || !data) {
          // No profile at all — show onboarding
          setShowOnboarding(true);
        } else if (!data.date_of_birth && !data.default_location) {
          // Profile exists but no birth data — could be skipped onboarding
          if (!data.display_name) {
            setShowOnboarding(true);
          } else {
            // Has name but no birth data — show nudge, not onboarding
            setProfileIncomplete(true);
          }
        }
      });
  }, [user, profileChecked]);

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
            {profileIncomplete && (
              <a href={`/${locale}/settings`} className="block mt-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/15 text-amber-400 text-xs leading-tight hover:bg-amber-500/15 transition-colors">
                {tl({ en: 'Add birth details for personalized insights', hi: 'व्यक्तिगत अन्तर्दृष्टि के लिए जन्म विवरण जोड़ें', sa: 'व्यक्तिगत अन्तर्दृष्टि के लिए जन्म विवरण जोड़ें' }, locale)}
              </a>
            )}
          </div>
          <a
            href={`/${locale}/profile`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            {isDevanagariLocale(locale) ? (locale === 'sa' ? 'मम कुण्डली' : 'मेरी कुंडली') : 'My Profile'}
          </a>
          <a
            href={`/${locale}/settings`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {tl({ en: 'Settings', hi: 'सेटिंग्स', sa: 'सेटिंग्स' }, locale)}
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

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        userName={user.user_metadata?.name || user.user_metadata?.full_name}
        userEmail={user.email}
      />
    </div>
  );
}
