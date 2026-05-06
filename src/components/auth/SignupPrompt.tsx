'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from './AuthModal';

const SESSION_KEY = 'dp-signup-prompt-dismissed';

/**
 * Auto-opens AuthModal for non-logged-in visitors once per session.
 *
 * - Shows immediately on first page load if not authenticated
 * - Dismissed via X button or backdrop click → sets sessionStorage flag
 * - Flag clears when browser tab/window closes → prompts again next visit
 * - Never renders if user is already logged in
 */
export default function SignupPrompt() {
  const { user, initialized } = useAuthStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (user) {
      // User signed in (possibly via this modal) — dismiss
      setShow(false);
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setShow(true);
  }, [initialized, user]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  };

  if (!show) return null;
  return <AuthModal isOpen={true} onClose={dismiss} />;
}
