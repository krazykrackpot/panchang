'use client';

/**
 * Floating Brihaspati entry point. Bottom-right corner with a pill shape
 * that carries both the sage avatar AND the name "Brihaspati" — per the
 * design feedback that the name shouldn't be obscure / icon-only.
 *
 * Coexistence with BrihaspatiBanner:
 * Both components mount in `BrihaspatiShell`. Banner sits at
 * `bottom-0 inset-x-0`, button at `bottom-6 right-6`. On narrow mobile
 * viewports the button visually overlaps the banner — same brand asset
 * twice on top of itself. The button hides while the banner is visible
 * (banner has its own × dismiss + 3-page-view auto-dismiss). Once the
 * banner is gone the button takes over. One CTA at a time, same pattern
 * as the May 2026 ChartChat consolidation.
 *
 * The button reads the SAME sessionStorage keys that the banner writes —
 * no shared React state needed, no coupling beyond a string contract.
 */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBrihaspati } from './BrihaspatiProvider';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';

// Must match the keys in BrihaspatiBanner.tsx. Duplication is the
// trade-off vs. exporting them from there — exporting would force any
// future banner-internal renames to ripple here. Keeping them in sync
// is one grep.
const BANNER_SESSION_DISMISSED = 'dp-brihaspati-banner-dismissed';
const BANNER_SESSION_VIEWS = 'dp-brihaspati-banner-views';
const BANNER_VIEW_CAP = 3;

/**
 * Returns true if the banner is currently visible (so the button must
 * hide). Mirrors BrihaspatiBanner's own visibility logic. We can't read
 * the banner's internal `dismissed` React state from a sibling, so we
 * derive the same answer from sessionStorage that the banner uses.
 */
function isBannerVisible(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.sessionStorage.getItem(BANNER_SESSION_DISMISSED) === '1') return false;
    const views = Number(window.sessionStorage.getItem(BANNER_SESSION_VIEWS) ?? '0');
    return views <= BANNER_VIEW_CAP;
  } catch {
    // private browsing — assume banner is visible to be safe (button hides)
    return true;
  }
}

export function BrihaspatiButton() {
  const t = useTranslations('brihaspati');
  const { state, open } = useBrihaspati();
  const pathname = usePathname();
  const [hiddenByBanner, setHiddenByBanner] = useState(false);

  useEffect(() => {
    // Re-evaluate when pathname changes — the banner increments its
    // view counter on each navigation, so the button's visibility can
    // flip from one route to the next. A slight delay (16ms = one
    // frame) lets the banner write its counter first.
    const id = setTimeout(() => setHiddenByBanner(isBannerVisible()), 16);
    return () => clearTimeout(id);
  }, [pathname]);

  // Re-check when the user dismisses the banner via ×. The banner fires
  // a custom `dp-brihaspati-banner-state-change` event same-tab; the
  // browser-native `storage` event covers other tabs.
  useEffect(() => {
    const refresh = () => setHiddenByBanner(isBannerVisible());
    const onStorage = (e: StorageEvent) => {
      if (e.key === BANNER_SESSION_DISMISSED) refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('dp-brihaspati-banner-state-change', refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('dp-brihaspati-banner-state-change', refresh);
    };
  }, []);

  if (state.kind !== 'closed' && state.kind !== 'error') return null;
  if (hiddenByBanner) return null;

  return (
    <button
      type="button"
      onClick={() => open('button')}
      aria-label={t('button.ariaLabel')}
      className="
        fixed bottom-6 right-6 z-40
        h-16 pl-2 pr-5 rounded-full
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
      {/* Pulsing gold ring around the avatar — draws the eye without
          screaming. CSS-only via Tailwind's animate-ping on an outer
          ring sibling. */}
      <span className="relative flex h-12 w-12 items-center justify-center shrink-0">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gold-primary/40 animate-ping"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-gold-primary/70"
        />
        <span className="
          relative h-11 w-11 rounded-full overflow-hidden
          bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
          border border-gold-primary/40
          flex items-center justify-center
          group-hover:scale-105 transition-transform
        ">
          <BrihaspatiAvatar size={44} />
        </span>
      </span>
      <span className="
        flex flex-col items-start leading-tight
        text-left
      ">
        <span className="text-gold-light font-serif text-base font-semibold tracking-wide">
          {t('button.ariaLabel')}
        </span>
        <span className="text-text-secondary text-[10px] uppercase tracking-[0.15em]">
          बृहस्पति · Vedic Sage
        </span>
      </span>
    </button>
  );
}
