'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname } from 'next/navigation';
import AuthModal from './AuthModal';

const STORAGE_KEY = 'dp-signup-prompt';
const VIEWS_KEY = 'dp-page-views';
const COOLDOWN_DAYS = 3;
const PAGE_VIEW_THRESHOLD = 3; // Show after 3 page views
const TIME_THRESHOLD_MS = 90_000; // OR after 90 seconds on one page

/**
 * Gentler signup modal for non-logged-in visitors.
 *
 * Triggers after EITHER:
 *   - 3 cumulative page views (tracked in localStorage), OR
 *   - 90 seconds on a single page (for deep readers)
 *
 * - Never shows on the very first page view
 * - Dismiss sets a 3-day cooldown (localStorage timestamp)
 * - Never renders if user is logged in
 */
export default function SignupPrompt() {
  const { user, initialized, initialize } = useAuthStore();
  const [show, setShow] = useState(false);
  const triggered = useRef(false);
  const pathname = usePathname();

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (user) { setShow(false); return; }

    // Check 3-day cooldown
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const ts = parseInt(dismissed, 10);
        if (!isNaN(ts) && Date.now() - ts < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
          return;
        }
      }
    } catch {
      // localStorage unavailable — don't block
      console.error('[SignupPrompt] localStorage read failed');
      return;
    }

    // Increment page view count
    let views = 0;
    try {
      const stored = localStorage.getItem(VIEWS_KEY);
      views = stored ? parseInt(stored, 10) || 0 : 0;
      views += 1;
      localStorage.setItem(VIEWS_KEY, views.toString());
    } catch {
      console.error('[SignupPrompt] localStorage views tracking failed');
    }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setShow(true);
    };

    // Page view trigger — show if they've visited 3+ pages (never on first visit)
    if (views >= PAGE_VIEW_THRESHOLD) {
      // Small delay so the page renders first, not instant popup
      const viewTimer = setTimeout(trigger, 2_000);
      return () => clearTimeout(viewTimer);
    }

    // Time trigger — 90 seconds on a single page (for deep readers)
    const timer = setTimeout(trigger, TIME_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [initialized, user, pathname]);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      console.error('[SignupPrompt] localStorage write failed');
    }
  };

  if (!show) return null;
  return <AuthModal isOpen={true} onClose={dismiss} />;
}
