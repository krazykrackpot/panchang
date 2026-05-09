'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from './AuthModal';

const SESSION_KEY = 'dp-signup-prompt-dismissed';
const DELAY_MS = 60_000; // 60 seconds before showing
const SCROLL_THRESHOLD = 0.5; // 50% of page height

/**
 * Auto-opens AuthModal for non-logged-in visitors after engagement.
 *
 * Triggers after EITHER:
 *   - 60 seconds on site, OR
 *   - Scrolling past 50% of the page height
 *
 * - Dismissed via X button or backdrop click → sets sessionStorage flag
 * - Flag clears when browser tab/window closes → prompts again next visit
 * - Never renders if user is already logged in
 */
export default function SignupPrompt() {
  const { user, initialized, initialize } = useAuthStore();
  const [show, setShow] = useState(false);
  const triggered = useRef(false);

  // Ensure auth is initialized (UserMenu also calls this, but we may mount first)
  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (user) {
      setShow(false);
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage unavailable (private browsing) — continue
      console.error('[SignupPrompt] sessionStorage read failed');
    }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setShow(true);
    };

    // Timer trigger — 60 seconds on site
    const timer = setTimeout(trigger, DELAY_MS);

    // Scroll trigger — 50% of page
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight > 0 && scrolled / docHeight >= SCROLL_THRESHOLD) {
        trigger();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [initialized, user]);

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      console.error('[SignupPrompt] sessionStorage write failed');
    }
  };

  if (!show) return null;
  return <AuthModal isOpen={true} onClose={dismiss} />;
}
