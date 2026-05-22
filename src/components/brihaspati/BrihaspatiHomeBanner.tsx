'use client';

/**
 * Full-bleed homepage banner for Brihaspati — option C from the
 * front-and-centre design pass. Edge-to-edge gradient strip with the
 * sage portrait on the right, headline + sample question chips + CTA
 * on the left. Click any chip or the CTA → opens the panel pre-filled.
 *
 * Lives BELOW the brand hero (Gayatri mantra + tagline) and ABOVE the
 * panchang/kundali widget tiles, so it's the first interactive surface
 * a first-time visitor lands on.
 */

import { useLocale } from 'next-intl';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';

// We dispatch a window event instead of using useBrihaspati() directly
// because this banner is rendered INSIDE the page tree (above the
// ClientShell where the Provider lives), so the Provider context isn't
// in scope here. A small listener inside the Provider picks the event
// up and calls open() / setQuestion(). Decoupled, no prop drilling.
const OPEN_EVENT = 'brihaspati:open';
export interface BrihaspatiOpenEventDetail {
  question?: string;
  entry?: 'banner' | 'button' | 'oauth_return' | 'chart_add_return';
}

type LocaleText = { en: string; hi: string };

function pick(t: LocaleText, locale: string): string {
  // Hindi-script locales (hi/sa/mai/mr) read the Hindi copy. Other
  // locales (ta/te/bn/kn/gu) fall back to English for now — the panel
  // itself is fully localised; this banner is a teaser.
  const useHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';
  return useHi ? t.hi : t.en;
}

const COPY = {
  eyebrow: { en: 'AI VEDIC ASTROLOGER', hi: 'AI वैदिक ज्योतिषी' },
  headline: { en: 'Ask Brihaspati.', hi: 'बृहस्पति से पूछें।' },
  subhead: {
    en: 'Cites BPHS, Saravali, Phaladeepika. Reads YOUR chart. Answers in seconds.',
    hi: 'BPHS, सारावली, फलदीपिका से उद्धरण। आपकी कुण्डली पढ़ता है। सेकंडों में उत्तर।',
  },
  prompts: [
    { en: 'When will I get married?',     hi: 'मेरा विवाह कब होगा?' },
    { en: 'My career arc in 2026?',       hi: '2026 में मेरा करियर?' },
    { en: 'What does my dasha say?',      hi: 'मेरी दशा क्या कह रही है?' },
    { en: 'Health outlook this year?',    hi: 'इस वर्ष स्वास्थ्य का योग?' },
  ],
  cta: { en: 'Ask now', hi: 'अभी पूछें' },
  fineprint: { en: 'From ₹99 · No subscription required', hi: '₹99 से · सदस्यता आवश्यक नहीं' },
} as const;

export function BrihaspatiHomeBanner() {
  const locale = useLocale();

  // Fire a custom window event that the Provider listens for. We can't
  // call useBrihaspati() here because the Provider mounts inside
  // ClientShell (sibling to {children}), not as an ancestor of page
  // content. Decoupled event-bus pattern keeps both surfaces working
  // without restructuring the layout.
  const openWith = (q?: string) => {
    if (typeof window === 'undefined') return;
    const detail: BrihaspatiOpenEventDetail = { question: q, entry: 'banner' };
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail }));
    // Scroll to top so the panel (fixed top-right on desktop, bottom
    // sheet on mobile) is immediately in view.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Ask Brihaspati"
      // Full-bleed: spans the entire viewport width regardless of the
      // parent's max-w container. Eyebrow + headline + button only —
      // minimal vertical footprint.
      className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] my-4 sm:my-6 overflow-hidden border-y border-gold-primary/30 bg-gradient-to-r from-[#3a2880]/70 via-[#2d1b69]/65 to-[#1a1040]/70 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Sage portrait — same asset as the FAB / chat avatar, sized
              for the ribbon (~64 px) so it reads without dominating. */}
          <div
            className="relative rounded-full overflow-hidden border-2 border-gold-primary/60 shadow-[0_0_20px_rgba(212,168,83,0.35)] bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] shrink-0"
            style={{ width: 64, height: 64 }}
            aria-hidden="true"
          >
            <BrihaspatiAvatar size={64} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-gold-primary text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-semibold mb-1">
              AI VEDIC ASTROLOGER ✦
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent leading-tight"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              {pick(COPY.headline, locale)}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => openWith()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-sm hover:from-[#fff4cc] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/30 hover:shadow-gold-primary/50 shrink-0"
        >
          {pick(COPY.cta, locale)}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
