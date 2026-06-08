// src/components/gamification/SadhakaBanner.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useBirthDataStatus } from '@/hooks/useBirthDataStatus';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';
import { tl } from '@/lib/utils/trilingual';
import type { UserProgress } from '@/lib/gamification/types';
import { pickByScript } from "@/lib/utils/locale-fonts";

const SS_KEY = 'sadhakaBannerDismissed';

interface ProgressResponse { progress: UserProgress | null; badges: { badge_slug: string }[] }

export function SadhakaBanner({ locale }: { locale: string }) {
  const { user, session } = useAuthStore();
  const accessToken = session?.access_token;
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash
  const [data, setData] = useState<ProgressResponse | null>(null);
  // Defer to BirthDetailsBanner when the user has completed onboarding
  // without setting their date_of_birth — single-source-of-truth for
  // the "no birth data" nudge. Shared hook means at most one
  // user_profiles query per session across both banners.
  const { loaded: birthDataLoaded, missingBirthData } = useBirthDataStatus();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDismissed(sessionStorage.getItem(SS_KEY) === '1');
  }, []);

  useEffect(() => {
    if (!user || !accessToken) { setData(null); return; }
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (r) => {
        if (r.ok) return r.json();
        // HTTP/2 + modern browsers often return empty statusText, which
        // collapsed the previous catch log to "progress fetch failed: "
        // with no actionable detail. Surface status + first 200 chars
        // of the body so we can diagnose without a network tab.
        const body = await r.text().catch(() => '<unreadable body>');
        throw new Error(`${r.status} ${r.statusText || '(no statusText)'} — ${body.slice(0, 200)}`);
      })
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => { console.error('[SadhakaBanner] progress fetch failed:', err); });
    return () => { cancelled = true; };
  }, [user, accessToken]);

  if (!user) return null;
  if (pathname?.startsWith(`/${locale}/dashboard`)) return null;
  if (dismissed) return null;
  if (!data) return null;
  // Defer to BirthDetailsBanner when the no-birth-data prompt is active
  // — otherwise the user sees TWO banners stacked saying overlapping
  // things ("level 1" + "add birth details"). One banner, one CTA.
  if (!birthDataLoaded) return null; // still loading; render nothing rather than flash twice
  if (missingBirthData) return null;

  const level = data.progress?.current_level ?? 1;
  const streak = data.progress?.streak_days ?? 0;
  const badgeCount = data.badges?.length ?? 0;
  const lvl = LEVEL_BY_ORDINAL[level];

  const handleDismiss = () => {
    sessionStorage.setItem(SS_KEY, '1');
    setDismissed(true);
  };

  if (level === 1) {
    return (
      <div className="w-full bg-gradient-to-r from-gold-primary/15 to-[#2d1b69]/40 border-b border-gold-primary/25 px-4 py-2 flex items-center gap-3 text-sm">
        <Link href={`/${locale}/settings`} className="flex-1 flex items-center gap-3 text-gold-light no-underline">
          <span className="font-bold">{pickByScript('Shishya · Step 2 of 5', 'शिष्य · चरण 2/5', locale)}</span>
          <span className="text-text-secondary text-xs">{pickByScript('Add birth details to unlock your kundali →', 'जन्म विवरण जोड़ें →', locale)}</span>
        </Link>
        <button onClick={handleDismiss} aria-label="Dismiss" className="text-gold-primary/60 hover:text-gold-light px-2">×</button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gold-primary/15 to-[#2d1b69]/40 border-b border-gold-primary/25 px-4 py-2 flex items-center gap-3 text-sm">
      <Link href={`/${locale}/path`} className="flex-1 flex items-center gap-3 text-gold-light no-underline">
        <span className="font-bold">{lvl ? tl(lvl.name, locale) : ''}</span>
        <span className="text-text-secondary text-xs">{streak}-{pickByScript('day streak', 'दिन निरंतरता', locale)} · {badgeCount}/18 {pickByScript('badges', 'बैज', locale)}</span>
      </Link>
      <button onClick={handleDismiss} aria-label="Dismiss" className="text-gold-primary/60 hover:text-gold-light px-2">×</button>
    </div>
  );
}
