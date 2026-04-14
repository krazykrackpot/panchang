'use client';

import { tl } from '@/lib/utils/trilingual';
import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKS = 4;

/** Get YYYY-MM-DD for a Date in local time */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function StreakCalendar() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const { streak, hydrated, progress } = useLearningProgressStore();

  // Build set of active dates from module lastAccessedAt timestamps
  const activeDates = useMemo(() => {
    const dates = new Set<string>();
    for (const mod of Object.values(progress)) {
      if (mod.lastAccessedAt) {
        const d = new Date(mod.lastAccessedAt);
        dates.add(toDateStr(d));
      }
    }
    return dates;
  }, [progress]);

  // Build 4-week grid (28 days ending today)
  const grid = useMemo(() => {
    const today = new Date();
    const todayStr = toDateStr(today);
    const freezeDate = streak.lastFreezeUsed || '';

    const days: { date: string; isActive: boolean; isToday: boolean; isFreeze: boolean }[] = [];
    for (let i = WEEKS * 7 - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = toDateStr(d);
      days.push({
        date: dateStr,
        isActive: activeDates.has(dateStr),
        isToday: dateStr === todayStr,
        isFreeze: dateStr === freezeDate,
      });
    }
    return days;
  }, [activeDates, streak.lastFreezeUsed]);

  if (!hydrated) return null;

  const title = tl({ en: '4 Weeks', hi: '4 सप्ताह', sa: '4 सप्ताह' }, locale);

  return (
    <div>
      <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">
        {title}
      </p>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((label, i) => (
          <span key={i} className="text-[8px] text-text-secondary/50 text-center leading-none">
            {label}
          </span>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((day) => (
          <div
            key={day.date}
            title={day.date}
            className={[
              'w-full aspect-square rounded-sm transition-all',
              day.isToday ? 'ring-1 ring-gold-primary' : '',
              day.isFreeze
                ? 'bg-amber-500/40'
                : day.isActive
                  ? 'bg-gold-primary'
                  : 'bg-white/6',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
