// src/app/[locale]/path/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { LevelPortrait } from '@/components/gamification/LevelPortrait';
import { BadgeIcon } from '@/components/gamification/BadgeIcons';
import { LEVELS } from '@/lib/constants/levels';
import { BADGES } from '@/lib/constants/badges';
import { tl } from '@/lib/utils/trilingual';

interface ProgressResponse { progress: { current_level?: number } | null; badges: { badge_slug: string }[] }

export default function PathPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { user, session } = useAuthStore();
  const accessToken = session?.access_token;
  const [data, setData] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    if (!user || !accessToken) return;
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => console.error('[PathPage] progress fetch failed:', err));
    return () => { cancelled = true; };
  }, [user, accessToken]);

  const currentLevel = data?.progress?.current_level ?? 1;
  const earnedSlugs = new Set<string>((data?.badges ?? []).map(b => b.badge_slug));

  if (!user) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-text-secondary">{locale === 'hi' ? 'कृपया साइन इन करें।' : 'Please sign in.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1">{locale === 'hi' ? 'साधक पथ' : 'Sadhaka Path'}</h1>
      <p className="text-text-secondary text-sm mb-6">{locale === 'hi' ? 'आपका सात-स्तरीय आध्यात्मिक मार्ग।' : 'Your seven-tier spiritual journey.'}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {LEVELS.map(l => {
          const locked = l.ordinal > currentLevel;
          return (
            <div key={l.slug} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-3 flex flex-col items-center text-center">
              <LevelPortrait ordinal={l.ordinal} locked={locked} size={140}/>
              <div className="mt-2 text-gold-light text-sm font-bold">{tl(l.name, locale)}</div>
              <div className="text-text-secondary text-[10px] mt-1 leading-tight">{tl(l.criteria, locale)}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-gold-light mb-3">{locale === 'hi' ? 'बैज संग्रह' : 'Badge Collection'} <span className="text-text-secondary text-sm font-normal">· {earnedSlugs.size} / 18</span></h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {BADGES.map(b => {
          const earned = earnedSlugs.has(b.slug);
          return (
            <div key={b.slug} className={`p-3 text-center rounded-lg border ${earned ? 'border-gold-primary/60 bg-gold-primary/5' : 'border-white/10 bg-white/[0.03]'}`}>
              <div className="flex justify-center mb-1.5"><BadgeIcon slug={b.slug} size={40} locked={!earned}/></div>
              <div className={`text-[10px] font-semibold ${earned ? 'text-gold-light' : 'text-text-secondary/50'}`}>{tl(b.name, locale)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
