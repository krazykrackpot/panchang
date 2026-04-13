'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Lock } from 'lucide-react';
import { BADGES, getEarnedBadgeIds, checkBadges } from '@/lib/learn/badges';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { MODULE_SEQUENCE, getPhaseModules, PHASE_INFO } from '@/lib/learn/module-sequence';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  title:       { en: 'Badge Gallery', hi: 'बैज गैलरी', sa: 'प्रतीकचित्रशाला', mai: 'बैज गैलरी', mr: 'बॅज दालन', ta: 'பதக்க காட்சியகம்', te: 'బ్యాడ్జ్ గ్యాలరీ', bn: 'ব্যাজ গ্যালারি', kn: 'ಬ್ಯಾಡ್ಜ್ ಗ್ಯಾಲರಿ', gu: 'બેજ ગેલેરી' },
  earned:      { en: 'Earned', hi: 'अर्जित', sa: 'अर्जितम्', mai: 'अर्जित', mr: 'मिळवलेले', ta: 'பெற்றவை', te: 'సాధించినవి', bn: 'অর্জিত', kn: 'ಗಳಿಸಿದವು', gu: 'મેળવેલ' },
  locked:      { en: 'Locked', hi: 'लॉक', sa: 'पिहितम्', mai: 'लॉक', mr: 'लॉक', ta: 'பூட்டப்பட்டது', te: 'లాక్ చేయబడింది', bn: 'লক করা', kn: 'ಲಾಕ್', gu: 'લૉક' },
  earnedOn:    { en: 'Earned', hi: 'अर्जित', sa: 'अर्जितम्', mai: 'अर्जित', mr: 'मिळवले', ta: 'பெற்றது', te: 'సాధించిన', bn: 'অর্জিত', kn: 'ಗಳಿಸಿದ', gu: 'મેળવ્યું' },
  progress:    { en: 'Progress', hi: 'प्रगति', sa: 'प्रगतिः', mai: 'प्रगति', mr: 'प्रगती', ta: 'முன்னேற்றம்', te: 'పురోగతి', bn: 'অগ্রগতি', kn: 'ಪ್ರಗತಿ', gu: 'પ્રગતિ' },
};

function t(key: keyof typeof LABELS, locale: Locale): string {
  const entry = LABELS[key];
  return locale === 'en' || String(locale) === 'ta' ? entry.en : entry.hi;
}

/** Read earned dates from localStorage */
function getEarnedDates(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem('dekho-panchang-badge-dates');
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Compute progress fraction for a specific badge */
function getBadgeProgress(
  badgeId: string,
  progress: Record<string, { status: string }>,
  streakDays: number,
  longestStreak: number,
): { current: number; target: number } | null {
  const mastered = MODULE_SEQUENCE.filter(m => progress[m.id]?.status === 'mastered').length;

  switch (badgeId) {
    case 'first-step':
      return { current: Math.min(mastered, 1), target: 1 };
    case 'phase-0-complete': {
      const mods = getPhaseModules(0);
      const done = mods.filter(m => progress[m.id]?.status === 'mastered').length;
      return { current: done, target: mods.length };
    }
    case 'week-warrior':
      return { current: Math.min(Math.max(streakDays, longestStreak), 7), target: 7 };
    case 'fortnight-fire':
      return { current: Math.min(Math.max(streakDays, longestStreak), 14), target: 14 };
    case 'quiz-master': {
      const best = Object.values(progress).reduce((max, p) => {
        const score = (p as { quizScore?: number | null }).quizScore ?? 0;
        return Math.max(max, score);
      }, 0);
      return { current: Math.min(best, 5), target: 5 };
    }
    case 'pandit-badge':
      return { current: Math.min(mastered, 91), target: 91 };
    case 'perfect-phase': {
      let bestPct = 0;
      let bestDone = 0;
      let bestTotal = 1;
      for (const p of PHASE_INFO) {
        const mods = getPhaseModules(p.phase);
        const done = mods.filter(m => progress[m.id]?.status === 'mastered').length;
        const pct = mods.length > 0 ? done / mods.length : 0;
        if (pct > bestPct) {
          bestPct = pct;
          bestDone = done;
          bestTotal = mods.length;
        }
      }
      return { current: bestDone, target: bestTotal };
    }
    default:
      return null;
  }
}

export default function BadgeGallery() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);

  const { progress, streak, hydrated } = useLearningProgressStore();
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [earnedDates, setEarnedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hydrated) return;
    const { earned } = checkBadges(progress, streak);
    setEarnedIds(new Set(earned.map(b => b.id)));

    // Store earned dates for newly earned badges
    const dates = getEarnedDates();
    let changed = false;
    for (const b of earned) {
      if (!dates[b.id]) {
        dates[b.id] = new Date().toISOString().split('T')[0];
        changed = true;
      }
    }
    if (changed) {
      try {
        window.localStorage.setItem('dekho-panchang-badge-dates', JSON.stringify(dates));
      } catch { /* ignore */ }
    }
    setEarnedDates(dates);
  }, [hydrated, progress, streak]);

  if (!hydrated) return null;

  const earnedCount = earnedIds.size;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-bold text-gold-light"
          style={{ fontFamily: isHi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
        >
          {t('title', locale)}
        </h3>
        <span className="text-xs text-text-secondary">
          {earnedCount}/{BADGES.length} {t('earned', locale)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {BADGES.map(badge => {
          const isEarned = earnedIds.has(badge.id);
          const date = earnedDates[badge.id];
          const prog = !isEarned
            ? getBadgeProgress(badge.id, progress, streak.streakDays, streak.longestStreak)
            : null;

          return (
            <div
              key={badge.id}
              className={[
                'relative p-3 rounded-xl border transition-all',
                isEarned
                  ? 'bg-gradient-to-br from-purple-500/15 via-purple-600/10 to-gold-primary/10 border-gold-primary/25 shadow-lg shadow-gold-primary/5'
                  : 'bg-bg-secondary/50 border-white/8 opacity-60',
              ].join(' ')}
            >
              {/* Lock overlay for unearned */}
              {!isEarned && (
                <div className="absolute top-2 right-2">
                  <Lock size={12} className="text-text-secondary/40" />
                </div>
              )}

              {/* Icon */}
              <div className={`text-2xl mb-2 ${isEarned ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>

              {/* Name */}
              <p
                className={`text-xs font-semibold leading-snug mb-0.5 ${
                  isEarned ? 'text-gold-light' : 'text-text-secondary'
                }`}
                style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
              >
                {isHi ? badge.label.hi : badge.label.en}
              </p>

              {/* Description */}
              <p
                className="text-[10px] text-text-secondary leading-snug"
                style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
              >
                {isHi ? badge.description.hi : badge.description.en}
              </p>

              {/* Earned date */}
              {isEarned && date && (
                <p className="text-[9px] text-emerald-400/70 mt-1.5">
                  {t('earnedOn', locale)} {date}
                </p>
              )}

              {/* Progress bar for unearned */}
              {!isEarned && prog && prog.target > 0 && (
                <div className="mt-2">
                  <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-primary/40 transition-all duration-300"
                      style={{ width: `${Math.round((prog.current / prog.target) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-text-secondary/60 mt-0.5">
                    {prog.current}/{prog.target}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
