'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export default function RouteError({ error, reset, title }: Props) {
  useEffect(() => {
    console.error(`[${title || 'Page'}] Error:`, error);
    // Best-effort report to server logs so we can diagnose without devtools access.
    try {
      void fetch('/api/client-error', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          source: title || 'Page',
          message: error?.message ?? String(error),
          digest: error?.digest,
          stack: error?.stack?.slice(0, 4000),
          url: typeof window !== 'undefined' ? window.location.href : '',
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          ts: new Date().toISOString(),
        }),
      }).catch(() => { /* never block UI on logging */ });
    } catch { /* never block UI on logging */ }
  }, [error, title]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl text-gold-light font-bold mb-2">{title || 'Something went wrong'}</h2>
        <p className="text-text-secondary text-sm mb-4">An error occurred while loading this page. Please try again.</p>
        {(error?.message || error?.digest) && (
          <details className="text-left mb-6 text-xs text-text-secondary/80 bg-bg-secondary/40 border border-gold-primary/10 rounded-lg p-3">
            <summary className="cursor-pointer text-text-secondary hover:text-gold-light">Show details (share with support)</summary>
            {error?.message && <p className="mt-2 font-mono break-words"><span className="text-text-secondary/60">message:</span> {error.message}</p>}
            {error?.digest && <p className="mt-1 font-mono break-words"><span className="text-text-secondary/60">digest:</span> {error.digest}</p>}
          </details>
        )}
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-gold-primary/20 text-gold-light border border-gold-primary/30 text-sm font-medium hover:bg-gold-primary/30 transition-colors">
            Try Again
          </button>
          <a href="/" className="px-5 py-2.5 rounded-lg border border-gold-primary/10 text-text-secondary text-sm hover:text-gold-light transition-colors">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
