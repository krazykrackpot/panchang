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
import { useBrihaspati } from './BrihaspatiProvider';
import { trackBrihaspatiBannerShown, trackBrihaspatiBannerDismissed } from '@/lib/analytics';

const SESSION_DISMISSED = 'dp-brihaspati-banner-dismissed';
const SESSION_VIEWS = 'dp-brihaspati-banner-views';
const VIEW_CAP = 3;

type PageFamily = 'panchang' | 'horoscope' | 'kundali' | 'kundali-empty' | 'calendar' | 'choghadiya' | 'dashboard' | 'generic';

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

const COPY: Record<PageFamily, { en: string; hi: string }> = {
  panchang:   { en: 'How does today’s nakshatra + tithi affect YOUR chart? Ask Brihaspati', hi: 'आज का नक्षत्र और तिथि आपकी कुंडली पर क्या प्रभाव डालते हैं? बृहस्पति से पूछिए' },
  horoscope:  { en: 'Your Moon sign only scratches the surface. What do your 9 planets say?', hi: 'आपकी चन्द्र राशि केवल सतह है — आपके 9 ग्रह क्या कहते हैं?' },
  kundali:    { en: 'Yogas detected in your chart. Which ones shape your career? Ask Brihaspati', hi: 'आपकी कुंडली में योग पाए गए — कौन आपके करियर को आकार दे रहे हैं?' },
  'kundali-empty': { en: 'Brihaspati will ask for your birth data inline. Pay only when you ask.', hi: 'जन्म-विवरण बृहस्पति आपसे माँगेंगे। पूछने पर ही भुगतान।' },
  calendar:   { en: 'Planning around a festival? Ask Brihaspati for your personal muhurta', hi: 'त्योहार के आसपास योजना? अपने व्यक्तिगत मुहूर्त के लिए पूछिए' },
  choghadiya: { en: 'Choghadiya tells you WHEN. Brihaspati tells you WHY it matters for YOU', hi: 'चौघड़िया बताता है कब। बृहस्पति बताते हैं कि आपके लिए क्यों' },
  dashboard:  { en: 'Your chart is loaded. Ask Brihaspati anything.', hi: 'आपकी कुंडली तैयार है। बृहस्पति से कुछ भी पूछिए।' },
  generic:    { en: 'What do the stars say about your next big decision? Ask Brihaspati', hi: 'आपके अगले बड़े निर्णय पर तारे क्या कहते हैं?' },
};

export function BrihaspatiBanner({ locale = 'en' }: { locale?: 'en' | 'hi' | 'ta' | 'bn' }) {
  const pathname = usePathname();
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
  const copy = COPY[family];
  const text = locale === 'hi' ? copy.hi : copy.en;

  const priceHint = useMemo(() => {
    if (balance && (balance.subscription !== 'none' || balance.credits > 0)) return 'free with your plan';
    return currency === 'INR' ? '₹49' : '$0.99';
  }, [balance, currency]);

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
        Ask Brihaspati
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(SESSION_DISMISSED, '1');
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
