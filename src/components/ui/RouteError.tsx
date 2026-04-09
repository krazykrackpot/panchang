'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export default function RouteError({ error, reset, title }: Props) {
  useEffect(() => { console.error(`[${title || 'Page'}] Error:`, error); }, [error, title]);

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
        <p className="text-text-secondary text-sm mb-6">An error occurred while loading this page. Please try again.</p>
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
