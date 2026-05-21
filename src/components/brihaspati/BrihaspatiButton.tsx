'use client';

/**
 * Floating Brihaspati entry point. Bottom-right corner, gold gradient.
 * Hides itself when the panel is already open.
 */
import { useTranslations } from 'next-intl';
import { useBrihaspati } from './BrihaspatiProvider';

export function BrihaspatiButton() {
  const t = useTranslations('brihaspati');
  const { state, open } = useBrihaspati();
  if (state.kind !== 'closed' && state.kind !== 'error') return null;

  return (
    <button
      type="button"
      onClick={() => open('button')}
      aria-label={t('button.ariaLabel')}
      className="
        fixed bottom-6 right-6 z-40
        h-14 w-14 rounded-full
        bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
        border border-gold-primary/40
        shadow-lg shadow-gold-primary/30
        flex items-center justify-center
        hover:from-[#f5deb3] hover:to-[#a0813a]
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light
      "
    >
      {/* Jupiter / Brihaspati glyph — gold radial */}
      <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden>
        <defs>
          <radialGradient id="briBtnGrad" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#fff7e0" />
            <stop offset="60%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#5d4716" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="11" fill="url(#briBtnGrad)" />
        <path
          d="M14 14 Q20 8 26 14 Q22 17 22 22 Q22 28 26 28"
          stroke="#0a0e27"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
