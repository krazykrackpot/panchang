'use client';

import { useCallback, useEffect, useRef } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';
import { DOMAIN_ICON_MAP } from '@/components/icons/DomainIcons';
import type { DomainType } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'pandit-question-choice';

/** Domain options for the question entry. Excludes 'currentPeriod'. */
type SelectableDomain = Exclude<DomainType, 'currentPeriod'>;

interface DomainOption {
  domain: SelectableDomain;
  label: { en: string; hi: string };
}

const DOMAIN_OPTIONS: DomainOption[] = [
  { domain: 'career',    label: { en: 'Career & Finance', hi: 'करियर और वित्त' } },
  { domain: 'marriage',  label: { en: 'Relationships',    hi: 'संबंध' } },
  { domain: 'health',    label: { en: 'Health & Wellness', hi: 'स्वास्थ्य और कल्याण' } },
  { domain: 'education', label: { en: 'Education',        hi: 'शिक्षा' } },
  { domain: 'children',  label: { en: 'Children & Family', hi: 'संतान और परिवार' } },
  { domain: 'spiritual', label: { en: 'Spiritual Path',   hi: 'आध्यात्मिक मार्ग' } },
];

const LABELS = {
  heading: { en: 'What would you like guidance on today?', hi: 'आज आप किस बारे में मार्गदर्शन चाहते हैं?' },
  showAll: { en: 'Show me everything', hi: 'सब कुछ दिखाएं' },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuestionEntryProps {
  locale: string;
  onSelect: (domain: DomainType | 'all') => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read persisted choice from localStorage. Returns null if none saved. */
export function getSavedQuestionChoice(): DomainType | 'all' | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val) return val as DomainType | 'all';
  } catch { /* localStorage unavailable */ }
  return null;
}

/** Clear persisted choice so the question entry re-appears. */
export function clearQuestionChoice(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuestionEntry({ locale, onSelect }: QuestionEntryProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const useDevanagari = isDevanagariLocale(locale);
  const headingStyle = getHeadingFont(locale);

  // Trap focus within the overlay for accessibility
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const firstButton = el.querySelector<HTMLButtonElement>('button');
    firstButton?.focus();
  }, []);

  const handleSelect = useCallback(
    (choice: DomainType | 'all') => {
      try {
        localStorage.setItem(STORAGE_KEY, choice);
      } catch { /* ignore */ }
      onSelect(choice);
    },
    [onSelect],
  );

  // Handle keyboard on cards
  const handleKeyDown = useCallback(
    (choice: DomainType | 'all') => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(choice);
      }
    },
    [handleSelect],
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your focus area"
    >
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Heading */}
        <h2
          className="text-center text-2xl sm:text-3xl font-bold text-gold-light mb-8 leading-snug"
          style={headingStyle}
        >
          {useDevanagari
            ? tl(LABELS.heading, locale)
            : tl(LABELS.heading, locale)}
        </h2>

        {/* Domain grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {DOMAIN_OPTIONS.map(({ domain, label }) => {
            const IconComp = DOMAIN_ICON_MAP[domain];
            const displayLabel = useDevanagari ? label.hi : label.en;
            const secondaryLabel = useDevanagari ? label.en : label.hi;

            return (
              <button
                key={domain}
                type="button"
                onClick={() => handleSelect(domain)}
                onKeyDown={handleKeyDown(domain)}
                className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold-primary/8 hover:border-gold-primary/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                {/* Icon */}
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {IconComp
                    ? <IconComp className="w-[64px] h-[44px] opacity-75 group-hover:opacity-100 transition-opacity" />
                    : <div className="w-12 h-8 rounded bg-gold-primary/8" />}
                </div>

                {/* Primary label */}
                <span
                  className="text-gold-light text-sm sm:text-base font-semibold text-center leading-tight"
                  style={useDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {displayLabel}
                </span>

                {/* Secondary label (other language) */}
                <span className="text-text-secondary text-xs text-center leading-tight opacity-60">
                  {secondaryLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* "Show me everything" button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => handleSelect('all')}
            onKeyDown={handleKeyDown('all')}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/25 bg-gold-primary/8 px-6 py-3 text-gold-light text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gold-primary/15 hover:border-gold-primary/40 hover:shadow-lg hover:shadow-gold-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={useDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(LABELS.showAll, locale)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
