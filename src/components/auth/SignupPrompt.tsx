'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname } from 'next/navigation';
import AuthModal from './AuthModal';
import { isE2eMode } from '@/lib/utils/e2e-mode';

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
  const prevPathname = useRef(pathname);

  useEffect(() => { initialize(); }, [initialize]);

  // Page view counter — only increment when pathname ACTUALLY changes (Bug A1 fix)
  useEffect(() => {
    if (!initialized || user) return;
    if (prevPathname.current === pathname) return; // skip re-fires from initialized changing
    prevPathname.current = pathname;

    try {
      const stored = localStorage.getItem(VIEWS_KEY);
      const views = (stored ? parseInt(stored, 10) || 0 : 0) + 1;
      localStorage.setItem(VIEWS_KEY, views.toString());
    } catch {
      console.error('[SignupPrompt] localStorage views tracking failed');
    }
  }, [initialized, user, pathname]);

  // Trigger logic — separate from counter to avoid double-counting
  useEffect(() => {
    if (!initialized) return;
    if (user) { setShow(false); return; }
    // E2E suppression — see `lib/utils/e2e-mode.ts`. Playwright sets the
    // session-storage flag before navigation; suppressing here is
    // simpler than chasing race conditions with dismiss helpers.
    if (isE2eMode()) return;

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
      console.error('[SignupPrompt] localStorage read failed');
      return;
    }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setShow(true);
    };

    // Page view trigger
    let views = 0;
    try {
      const stored = localStorage.getItem(VIEWS_KEY);
      views = stored ? parseInt(stored, 10) || 0 : 0;
    } catch { /* already logged above */ }

    if (views >= PAGE_VIEW_THRESHOLD) {
      const viewTimer = setTimeout(trigger, 2_000);
      return () => clearTimeout(viewTimer);
    }

    // Time trigger — 90 seconds on a single page
    const timer = setTimeout(trigger, TIME_THRESHOLD_MS);

    // Chart generation trigger (Bug A3 fix: store timer ID for cleanup)
    let chartTimer: ReturnType<typeof setTimeout> | null = null;
    const onChartGenerated = () => { chartTimer = setTimeout(trigger, 3_000); };
    window.addEventListener('kundali:generated', onChartGenerated);

    return () => {
      clearTimeout(timer);
      if (chartTimer) clearTimeout(chartTimer);
      window.removeEventListener('kundali:generated', onChartGenerated);
    };
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
