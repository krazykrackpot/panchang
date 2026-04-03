'use client';

import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo / App name */}
        <div className="space-y-3">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f0d48a] to-[#8a6d2b] flex items-center justify-center shadow-lg shadow-[#d4a853]/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a0e27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a7 7 0 0 0 0 14 3.5 3.5 0 0 1 0-7 3.5 3.5 0 0 0 0-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-gold-primary">
            Dekho Panchang
          </h1>
        </div>

        {/* Offline message */}
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-surface-secondary/50 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            You&apos;re offline
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            It looks like you&apos;ve lost your internet connection. Some previously visited pages may still be available from cache.
          </p>
        </div>

        {/* Cached pages hint */}
        <div className="bg-surface-secondary/30 border border-gold-primary/10 rounded-xl p-4 space-y-3">
          <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium">
            Try these cached pages
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Panchang', href: '/en/panchang' },
              { label: 'Dashboard', href: '/en/dashboard' },
              { label: 'Calendar', href: '/en/calendar' },
              { label: 'Kundali', href: '/en/kundali' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg bg-surface-secondary/50 text-text-secondary text-sm hover:text-gold-primary hover:bg-surface-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Try again button */}
        <button
          onClick={() => router.refresh()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4a853] to-[#b8912e] text-[#0a0e27] font-semibold text-sm hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try again
        </button>
      </div>
    </div>
  );
}
