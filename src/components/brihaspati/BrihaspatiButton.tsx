'use client';

/**
 * Floating Brihaspati entry point. Bottom-right corner with a pill shape
 * that carries both the sage avatar AND the name "Brihaspati" — per the
 * design feedback that the name shouldn't be obscure / icon-only.
 */
import { useTranslations } from 'next-intl';
import { useBrihaspati } from './BrihaspatiProvider';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';

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
        h-14 pl-2 pr-5 rounded-full
        bg-gradient-to-br from-[#1a1040] via-[#2d1b69]/95 to-[#0a0e27]
        border border-gold-primary/60
        shadow-lg shadow-gold-primary/30
        flex items-center gap-2.5
        hover:border-gold-primary
        hover:shadow-gold-primary/50
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light
        group
      "
    >
      <span className="
        block h-11 w-11 rounded-full overflow-hidden
        bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
        border border-gold-primary/40
        flex items-center justify-center
        group-hover:scale-105 transition-transform
      ">
        <BrihaspatiAvatar size={44} />
      </span>
      <span className="
        flex flex-col items-start leading-tight
        text-left
      ">
        <span className="text-gold-light font-serif text-base font-semibold tracking-wide">
          {t('panel.title')}
        </span>
        <span className="text-text-secondary text-[10px] uppercase tracking-[0.15em]">
          {t('button.ariaLabel')}
        </span>
      </span>
    </button>
  );
}
