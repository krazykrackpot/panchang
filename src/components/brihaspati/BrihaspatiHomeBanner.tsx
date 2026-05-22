'use client';

/**
 * Compact full-bleed Brihaspati ribbon on the locale homepage.
 *
 * Layout: [sage avatar] · [eyebrow + "Ask Brihaspati."] · [Ask now →]
 * Click the CTA → opens the panel.
 *
 * Communication: this component renders inside the page tree (above
 * ClientShell where the BrihaspatiProvider mounts), so it CAN'T call
 * useBrihaspati() directly. It dispatches the shared open-event from
 * `events.ts` and the Provider listens for it.
 */

import { useTranslations } from 'next-intl';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';
import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEventDetail } from './events';

export function BrihaspatiHomeBanner() {
  // All copy lives in src/messages/{locale}.json under brihaspati.homeBanner
  // — eyebrow / headline / cta. No hardcoded strings here.
  const t = useTranslations('brihaspati.homeBanner');

  const openPanel = () => {
    if (typeof window === 'undefined') return;
    const detail: BrihaspatiOpenEventDetail = { entry: 'banner' };
    window.dispatchEvent(new CustomEvent(BRIHASPATI_OPEN_EVENT, { detail }));
  };

  return (
    <section
      aria-label={t('headline')}
      // w-full (NOT w-screen): the parent <main> is already viewport-
      // width, so w-full spans cleanly. w-screen = 100vw would include
      // the vertical scrollbar's width on platforms where it takes
      // layout space (Windows), producing a spurious horizontal
      // scrollbar.
      className="relative w-full my-4 sm:my-6 overflow-hidden border-y border-gold-primary/30 bg-gradient-to-r from-[#3a2880]/70 via-[#2d1b69]/65 to-[#1a1040]/70 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
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
              {t('eyebrow')}
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent leading-tight"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              {t('headline')}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={openPanel}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-sm hover:from-[#fff4cc] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/30 hover:shadow-gold-primary/50 shrink-0"
        >
          {t('cta')}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
