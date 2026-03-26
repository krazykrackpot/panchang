'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto" aria-hidden="true">
            <circle cx="40" cy="40" r="38" stroke="url(#errGrad)" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M40 20v24M40 52v4" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="errGrad" x1="0" y1="0" x2="80" y2="80">
                <stop stopColor="#f0d48a" />
                <stop offset="1" stopColor="#8a6d2b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Something Went Wrong
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          A celestial disturbance has occurred. The calculations could not be completed at this time.
        </p>

        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
