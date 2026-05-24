'use client';

import { useEffect } from 'react';
import { isChunkLoadError, recoverFromChunkError } from '@/lib/utils/chunk-error';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export default function RouteError({ error, reset, title }: Props) {
  useEffect(() => {
    // Chunk-load errors mean the user has a tab open from a previous
    // deploy and the chunk we need has been garbage-collected. Reload
    // to fetch the current deploy's HTML + chunks. The global
    // ChunkErrorListener can't see these — React's error boundary
    // catches them inside the tree before the global handler fires.
    if (isChunkLoadError(error)) {
      const reloaded = recoverFromChunkError(`route:${title || 'Page'}`, error);
      // If reload was triggered, the page is about to unload — bail out
      // of the logging + report so we don't fire a spurious POST. If
      // reload was skipped (already attempted in this session), fall
      // through to the normal error UI so the user can see what failed.
      if (reloaded) return;
    }

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
        {/* Surface the actual error message above the fold (was hidden
            behind a "Show details" accordion — that buried the signal
            for 12+ hours during the BrihaspatiProvider regression). */}
        {error?.message ? (
          <p className="text-red-200 text-sm font-mono break-words mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-left">
            {error.message}
          </p>
        ) : (
          <p className="text-text-secondary text-sm mb-4">An error occurred while loading this page. Please try again.</p>
        )}
        {error?.digest && (
          <p className="text-xs text-text-secondary/60 font-mono break-words mb-4">digest: {error.digest}</p>
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
