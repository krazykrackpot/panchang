'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
// Audit 2026-05-25 §D — lazy-load AuthModal so the every-page signup
// banner doesn't ship the modal bundle until the user clicks Sign In.
const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });

const STORAGE_KEY = 'dp-signup-banner-dismissed';
const DISMISS_DAYS = 7;

/**
 * Page-specific CTA messages for non-logged-in users.
 * Key = path segment after /[locale]/ (e.g. "panchang", "kundali").
 */
const PAGE_CTA: Record<string, { headline: string; subtext: string }> = {
  panchang: {
    headline: 'Save your location for daily panchang',
    subtext: 'Free account  –  get personalised tithi, nakshatra & muhurta every day',
  },
  kundali: {
    headline: 'Create account to save your birth charts',
    subtext: 'Free account  –  save unlimited kundalis for family & friends',
  },
  'muhurta-ai': {
    headline: 'Sign in to personalise muhurta with your birth data',
    subtext: 'Free account  –  personalised auspicious timing based on your chart',
  },
  ekadashi: {
    headline: 'Get ekadashi reminders via email',
    subtext: 'Free account  –  never miss a vrat day again',
  },
  matching: {
    headline: 'Save compatibility reports for later',
    subtext: 'Free account  –  no credit card needed',
  },
};

const DEFAULT_CTA = {
  headline: 'Save your charts & get daily panchang',
  subtext: 'Free account  –  no credit card needed',
};

/**
 * Subtle bottom banner CTA for non-logged-in users.
 * Appears after 10 seconds on key pages. Dismisses for 7 days via localStorage.
 * NOT a modal  –  a small floating card in the bottom-right corner.
 */
export default function SignupBanner() {
  const { user, initialized, initialize } = useAuthStore();
  const [show, setShow] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (user) { setShow(false); return; }

    // Check 7-day dismissal
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const ts = parseInt(dismissed, 10);
        if (!isNaN(ts) && Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch {
      // localStorage unavailable  –  don't block
      console.error('[SignupBanner] localStorage read failed');
    }

    // Show after 10 seconds
    const timer = setTimeout(() => setShow(true), 10_000);
    return () => clearTimeout(timer);
  }, [initialized, user]);

  // Auto-dismiss when user signs in via the auth modal
  useEffect(() => {
    if (user) { setShow(false); setAuthOpen(false); }
  }, [user]);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      console.error('[SignupBanner] localStorage write failed');
    }
  };

  const openAuth = () => {
    setAuthOpen(true);
  };

  if (!show && !authOpen) return null;

  // Determine page-specific copy from pathname
  // pathname is like /en/panchang or /hi/kundali
  const segments = pathname.split('/').filter(Boolean);
  const pageKey = segments[1] ?? ''; // segment after locale
  const cta = PAGE_CTA[pageKey] ?? DEFAULT_CTA;

  return (
    <>
      {show && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 bg-gradient-to-r from-[#2d1b69]/95 to-[#1a1040]/95 backdrop-blur border border-gold-primary/20 rounded-xl p-4 shadow-xl animate-in slide-in-from-bottom-4 duration-500"
          role="complementary"
          aria-label="Sign up prompt"
        >
          <p className="text-gold-light text-sm font-semibold">{cta.headline}</p>
          <p className="text-text-secondary text-xs mt-1">{cta.subtext}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={openAuth}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors"
            >
              Sign Up Free
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}
      {authOpen && <AuthModal isOpen={true} onClose={() => setAuthOpen(false)} />}
    </>
  );
}
