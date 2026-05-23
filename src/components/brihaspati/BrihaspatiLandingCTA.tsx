'use client';

import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEventDetail } from './events';

export function BrihaspatiLandingCTA({ locale: _locale }: { locale: string }) {
  const openPanel = () => {
    if (typeof window === 'undefined') return;
    const detail: BrihaspatiOpenEventDetail = { entry: 'button' };
    window.dispatchEvent(new CustomEvent(BRIHASPATI_OPEN_EVENT, { detail }));
  };

  return (
    <button
      type="button"
      onClick={openPanel}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-base sm:text-lg hover:from-[#fff4cc] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/30 hover:shadow-gold-primary/50"
    >
      Ask Brihaspati now
      <span aria-hidden="true">→</span>
    </button>
  );
}
