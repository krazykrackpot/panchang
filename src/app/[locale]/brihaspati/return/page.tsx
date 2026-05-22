'use client';

/**
 * Stripe Checkout return landing.
 *
 * The order route's success_url points here with:
 *   ?session_id={CHECKOUT_SESSION_ID}&status=success&q={questionId}
 * or on cancel:
 *   ?status=cancelled&q={questionId}
 *
 * On success we open the Brihaspati panel and trigger startQuestion()
 * which streams the answer from /api/brihaspati. The Stripe webhook
 * (running locally via `stripe listen`) will have flipped
 * payment_verified=true on the brihaspati_questions row by the time the
 * user lands here — the streaming route confirms that flag before
 * narrating.
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BrihaspatiReturnPage() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status');
  const questionId = params.get('q');
  const [message, setMessage] = useState('Confirming your payment…');

  useEffect(() => {
    if (status === 'cancelled') {
      setMessage('Payment was cancelled. You can try again whenever you’re ready.');
      // Redirect to home after a moment.
      const t = setTimeout(() => router.replace('/'), 2500);
      return () => clearTimeout(t);
    }
    if (status === 'success' && questionId) {
      // Stash the questionId so the home page can pick it up and resume
      // streaming via the Brihaspati panel.
      window.sessionStorage.setItem('dp-brihaspati-resume', questionId);
      setMessage('Payment confirmed. Brihaspati is preparing your answer…');
      // Go to dashboard (or home) — the panel will auto-open on resume.
      const t = setTimeout(() => router.replace('/'), 1200);
      return () => clearTimeout(t);
    }
    setMessage('Returning to the previous page…');
    const t = setTimeout(() => router.replace('/'), 1200);
    return () => clearTimeout(t);
  }, [status, questionId, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-text-primary">
      <div className="
        max-w-md w-full text-center
        rounded-2xl
        bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
        border border-gold-primary/12
        px-8 py-10
      ">
        <div className="
          h-20 w-20 rounded-full overflow-hidden mx-auto mb-5
          bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
          border-2 border-gold-primary/40
          shadow-md shadow-gold-primary/30
        ">
          {/* Lazy: skip the avatar to avoid Image hydration on a transient page */}
          <div className="h-full w-full flex items-center justify-center text-bg-primary font-bold text-3xl">
            बृ
          </div>
        </div>
        <p className="text-gold-light text-lg">{message}</p>
      </div>
    </main>
  );
}
