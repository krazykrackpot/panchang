'use client';

import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import { getLevel } from '@/lib/learn/badges';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface LevelBadgeProps {
  masteredCount: number;
  locale: Locale;
  /** 'compact' = sidebar / module index, 'full' = dashboard */
  variant?: 'compact' | 'full';
}

const LEVEL_ICONS: Record<string, string> = {
  beginner: '\u{1F331}',     // seedling
  student: '\u{1F4DA}',      // books
  practitioner: '\u{1F52E}', // crystal ball
  vidwan: '\u{2B50}',        // star
  pandit: '\u{1F451}',       // crown
};

export default function LevelBadge({ masteredCount, locale, variant = 'compact' }: LevelBadgeProps) {
  const isHi = isDevanagariLocale(locale);
  const level = getLevel(masteredCount);
  const icon = LEVEL_ICONS[level.level] || '\u{1F331}';

  if (variant === 'compact') {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-xs font-bold text-gold-light">
            {isHi ? level.label.hi : level.label.en}
          </span>
          {level.nextLevel && (
            <span className="text-[10px] text-text-secondary">
              ({masteredCount}/{masteredCount + level.nextLevel.modulesNeeded}{' '}
              {tl({ en: `to ${level.nextLevel.label.en}`, hi: `→ ${level.nextLevel.label.hi}`, sa: `→ ${level.nextLevel.label.hi}` }, locale)})
            </span>
          )}
        </div>
        {level.nextLevel && (
          <div className="h-1 w-full rounded-full bg-gold-primary/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-primary to-gold-light transition-all duration-500"
              style={{
                width: `${Math.round(((masteredCount - level.minModules) / (masteredCount + level.nextLevel.modulesNeeded - level.minModules)) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Full variant for dashboard
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gold-light">
            {isHi ? level.label.hi : level.label.en}
          </span>
          <span className="text-xs text-text-secondary font-mono">
            {masteredCount} {tl({ en: 'modules', hi: 'मॉड्यूल', sa: 'मॉड्यूल' }, locale)}
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5">
          {isHi ? level.description.hi : level.description.en}
        </p>
        {level.nextLevel && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-1.5 w-24 rounded-full bg-gold-primary/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-primary to-gold-light transition-all duration-500"
                style={{
                  width: `${Math.round(((masteredCount - level.minModules) / (masteredCount + level.nextLevel.modulesNeeded - level.minModules)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-text-secondary">
              {level.nextLevel.modulesNeeded} {tl({ en: `more to ${level.nextLevel.label.en}`, hi: `और → ${level.nextLevel.label.hi}`, sa: `और → ${level.nextLevel.label.hi}` }, locale)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
