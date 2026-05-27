'use client';

/**
 * Contextual bottom banner that nudges users into Brihaspati from
 * whatever page they're on. Data-driven copy per page family.
 *
 * Dismiss rules (spec §Global Presence):
 *  - X button: dismiss for this session
 *  - Auto-dismiss after 3 page views per session
 *  - Returns on a new session
 */
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBrihaspati } from './BrihaspatiProvider';
import { trackBrihaspatiBannerShown, trackBrihaspatiBannerDismissed } from '@/lib/analytics';

// Keep in sync with BrihaspatiButton's BANNER_SESSION_* constants —
// the button reads these to decide whether to hide itself behind the
// banner. One grep keeps them aligned.
const SESSION_DISMISSED = 'dp-brihaspati-banner-dismissed';
const SESSION_VIEWS = 'dp-brihaspati-banner-views';
const VIEW_CAP = 3;

/** Same-tab signal so BrihaspatiButton can reappear immediately when
 *  the banner is dismissed via × (the native `storage` event doesn't
 *  fire on the tab that performed the write). */
const BANNER_STATE_CHANGE_EVENT = 'dp-brihaspati-banner-state-change';

type PageFamily = 'panchang' | 'horoscope' | 'kundali' | 'kundaliEmpty' | 'calendar' | 'choghadiya' | 'dashboard' | 'generic';

function familyFromPath(pathname: string | null): PageFamily {
  if (!pathname) return 'generic';
  if (pathname.includes('/dashboard')) return 'dashboard';
  if (pathname.includes('/panchang')) return 'panchang';
  if (pathname.includes('/horoscope')) return 'horoscope';
  if (pathname.includes('/kundali')) return 'kundali';
  if (pathname.includes('/calendar') || pathname.includes('/festival')) return 'calendar';
  if (pathname.includes('/choghadiya') || pathname.includes('/hora')) return 'choghadiya';
  return 'generic';
}

export function BrihaspatiBanner({ locale = 'en' }: { locale?: 'en' | 'hi' | 'ta' | 'bn' }) {
  const pathname = usePathname();
  const t = useTranslations('brihaspati');
  const { state, open, currency, balance } = useBrihaspati();
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(SESSION_DISMISSED) === '1') {
      setDismissed(true);
      return;
    }
    const views = Number(window.sessionStorage.getItem(SESSION_VIEWS) ?? '0') + 1;
    window.sessionStorage.setItem(SESSION_VIEWS, String(views));
    if (views > VIEW_CAP) {
      setDismissed(true);
      window.sessionStorage.setItem(SESSION_DISMISSED, '1');
    } else {
      trackBrihaspatiBannerShown({ page: pathname ?? 'unknown', locale });
    }
  }, [pathname, locale]);

  const family = useMemo(() => familyFromPath(pathname), [pathname]);
  const text = t(`banner.${family}` as never);

  const priceHint = useMemo(() => {
    // Three seeker states. "Plan" implies a recurring subscription —
    // do NOT say "free with your plan" when they only have finite
    // credits. Credits get their own "N left" copy.
    if (balance && balance.subscription !== 'none') return t('banner.freeWithPlan');
    if (balance && balance.credits > 0) {
      return t.has('banner.freeWithCredits')
        ? t('banner.freeWithCredits', { count: balance.credits })
        : `${balance.credits} credit${balance.credits === 1 ? '' : 's'} left`;
    }
    return currency === 'INR' ? '₹99' : '$0.99';
  }, [balance, currency, t]);

  if (dismissed) return null;
  if (state.kind !== 'closed') return null;

  return (
    <div
      role="region"
      aria-label="Brihaspati"
      className="
        fixed bottom-0 inset-x-0 z-30
        bg-gradient-to-r from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27]/95
        border-t border-gold-primary/30
        backdrop-blur-sm
        px-4 py-3
        flex items-center gap-3
        text-sm
      "
    >
      <span className="text-gold-light truncate">{text}</span>
      <span className="text-text-secondary text-xs whitespace-nowrap">— {priceHint}</span>
      <button
        type="button"
        onClick={() => open('banner')}
        className="ml-auto px-3 py-1 rounded-md bg-gold-primary/20 text-gold-light text-xs font-semibold border border-gold-primary/30 hover:bg-gold-primary/30"
      >
        {t('banner.cta')}
      </button>
      <button
        type="button"
        aria-label={t('banner.dismiss')}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(SESSION_DISMISSED, '1');
            // Same-tab notification so BrihaspatiButton can reappear
            // immediately. The browser-native `storage` event doesn't
            // fire on the tab that performed the write.
            window.dispatchEvent(new CustomEvent(BANNER_STATE_CHANGE_EVENT));
          }
          trackBrihaspatiBannerDismissed();
          setDismissed(true);
        }}
        className="p-1 text-text-secondary hover:text-text-primary"
      >
        ✕
      </button>
    </div>
  );
}
