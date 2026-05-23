'use client';

/**
 * Kundali "Ask Your Chart" tab.
 *
 * Originally hosted the free chart-chat (2 AI questions/day, free tier).
 * That feature is REMOVED per the Brihaspati spec — replaced with a
 * Brihaspati entry point.
 *
 * The export name + props are preserved so kundali/Client.tsx's dynamic
 * import doesn't need to change.
 */

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEventDetail } from '@/components/brihaspati/events';
import { BrihaspatiAvatar } from '@/components/brihaspati/BrihaspatiAvatar';

interface ChartChatTabProps {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

const PROMPT_KEYS = ['promptMangal', 'promptMarriage', 'promptDasha', 'promptGemstone'] as const;

export default function ChartChatTab({ kundali: _kundali, locale, headingFont }: ChartChatTabProps) {
  const t = useTranslations('brihaspati');

  // BrihaspatiProvider mounts inside ClientShell (sibling of {children}).
  // This component lives inside the kundali page, which is a descendant
  // of {children} — outside the provider's React subtree. Calling
  // useBrihaspati() here throws "must be used inside <BrihaspatiProvider>",
  // crashing the kundali page render and triggering the route error
  // boundary ("Kundali Error" — what Madhavi saw, 17 prod reports in a
  // few hours). Use the documented event-bus pattern instead, same as
  // BrihaspatiHomeBanner.
  const fireWith = (prompt: string) => {
    if (typeof window === 'undefined') return;
    const detail: BrihaspatiOpenEventDetail = { entry: 'kundali_tab', question: prompt };
    window.dispatchEvent(new CustomEvent(BRIHASPATI_OPEN_EVENT, { detail }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          rounded-2xl
          bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
          border border-gold-primary/12
          hover:border-gold-primary/40
          p-8
          text-center
        "
      >
        <div className="h-24 w-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] border-2 border-gold-primary/40 shadow-lg shadow-gold-primary/30 flex items-center justify-center mb-3">
          <BrihaspatiAvatar size={92} />
        </div>
        <p className="text-text-secondary text-[10px] uppercase tracking-[0.25em] mb-1">
          बृहस्पति · Vedic Sage
        </p>
        <h2 style={headingFont} className="text-3xl text-gold-light font-serif mb-3 tracking-wide">
          Brihaspati
        </h2>
        <p className="text-gold-light/80 text-sm italic mb-2">{t('tab.title')}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xl mx-auto">
          {t('tab.body')}
        </p>
        <button
          type="button"
          onClick={() => open('kundali_tab')}
          className="
            px-6 py-3 rounded-md
            bg-gradient-to-r from-[#d4a853] to-[#8a6d2b]
            text-bg-primary font-semibold
            hover:from-[#f0d48a] hover:to-[#a0813a]
            transition-all
          "
        >
          {t('tab.cta')}
        </button>
      </motion.div>

      <div className="mt-8">
        <p className="text-text-secondary text-xs uppercase tracking-wide mb-3 text-center">
          {t('tab.suggestedHeading')}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PROMPT_KEYS.map((key) => {
            const prompt = t(`tab.${key}` as never);
            return (
            <button
              key={key}
              type="button"
              onClick={() => fireWith(prompt)}
              className="
                text-left
                rounded-xl
                bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
                border border-gold-primary/12
                hover:border-gold-primary/40
                px-4 py-3
                text-sm text-text-primary
                transition-colors
              "
            >
              {prompt}
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
