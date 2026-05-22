// src/components/dashboard/SadhakaHero.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { LevelPortrait } from '@/components/gamification/LevelPortrait';
import { StreakGrid } from '@/components/gamification/StreakGrid';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';
import { tl } from '@/lib/utils/trilingual';
import type { UserProgress } from '@/lib/gamification/types';

interface ProgressResponse { progress: UserProgress | null; badges: { badge_slug: string; earned_at: string }[] }

interface Props {
  locale: string;
  profileFields: {
    hasName: boolean;
    hasDob: boolean;
    hasTime: boolean;
    hasPlace: boolean;
  };
}

export function SadhakaHero({ locale, profileFields }: Props) {
  const { user, session } = useAuthStore();
  const accessToken = session?.access_token;
  const [data, setData] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    if (!user || !accessToken) { setData(null); return; }
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => { console.error('[SadhakaHero] progress fetch failed:', err); });
    return () => { cancelled = true; };
  }, [user, accessToken]);

  if (!user) return null;

  const fieldsDone = [profileFields.hasName, profileFields.hasDob, profileFields.hasTime, profileFields.hasPlace].filter(Boolean).length;
  const total = 4;
  const profileComplete = fieldsDone === total;
  const level = data?.progress?.current_level ?? 1;
  const streakDays = data?.progress?.streak_days ?? 0;
  const lastVisit = data?.progress?.streak_last_visit ?? null;

  // State A: profile incomplete
  if (!profileComplete) {
    const nextField =
      !profileFields.hasName  ? { en: 'name',        hi: 'नाम' }       :
      !profileFields.hasDob   ? { en: 'birth date',  hi: 'जन्म तिथि' } :
      !profileFields.hasTime  ? { en: 'birth time',  hi: 'जन्म समय' }  :
      !profileFields.hasPlace ? { en: 'birth place', hi: 'जन्म स्थान' }: null;
    const pct = Math.round((fieldsDone / total) * 100);

    return (
      <div className="mb-8 rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#2d1b69] via-[#1a1040] to-[#0a0e27] p-5 sm:p-6 flex items-center gap-5">
        <LevelPortrait ordinal={2} locked size={120} />
        <div className="flex-1">
          <h2 className="text-gold-light text-lg sm:text-xl font-bold leading-tight">
            {locale === 'hi' ? 'साधक तक पहुँचें' : 'Reach Sadhaka साधक'}
          </h2>
          <p className="text-text-secondary text-xs mt-1 mb-3">
            {locale === 'hi'
              ? `${fieldsDone} / ${total} चरण पूर्ण · व्यक्तिगत कुंडली अनलॉक करें`
              : `${fieldsDone} of ${total} steps · unlock your personal chart`}
          </p>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-gold-dark to-gold-primary rounded-full" style={{ width: `${pct}%` }}/>
          </div>
          {nextField && (
            <Link href={`/${locale}/settings`} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 rounded-lg text-gold-light text-sm font-semibold transition-colors">
              + {locale === 'hi' ? `${tl(nextField, 'hi')} जोड़ें` : `Add ${tl(nextField, 'en')}`} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  // State B: Sadhaka+
  const lvl = LEVEL_BY_ORDINAL[level];
  const nextLvl = LEVEL_BY_ORDINAL[level + 1];

  return (
    <div className="mb-8 rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#2d1b69] via-[#1a1040] to-[#0a0e27] p-5 sm:p-6">
      <div className="flex items-center gap-5">
        <Link href={`/${locale}/path`}>
          <LevelPortrait ordinal={level} size={120} />
        </Link>
        <div className="flex-1">
          <div className="text-gold-light text-4xl sm:text-5xl font-black leading-none">
            {streakDays}
            <span className="text-gold-primary/70 text-xs font-bold ml-2 tracking-[0.15em] uppercase">{locale === 'hi' ? 'दिन निरंतरता' : 'day streak'}</span>
          </div>
          {lvl && (
            <div className="inline-block mt-2 px-2.5 py-0.5 bg-gold-primary/15 border border-gold-primary/30 rounded-full text-gold-light text-xs font-bold">
              {tl(lvl.name, locale)}
            </div>
          )}
          {nextLvl && (
            <p className="text-text-secondary text-xs mt-2">
              {tl(nextLvl.criteria, locale)} → <span className="text-gold-light">{tl(nextLvl.name, locale)}</span>
            </p>
          )}
        </div>
      </div>
      <StreakGrid streakDays={streakDays} streakLastVisit={lastVisit}/>
    </div>
  );
}
