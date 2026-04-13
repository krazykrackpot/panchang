'use client';

import { useLocale } from 'next-intl';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { getLevel, checkBadges } from '@/lib/learn/badges';
import ShareButton from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LEVEL_ICONS: Record<string, string> = {
  beginner: '\u{1F331}',
  student: '\u{1F4DA}',
  practitioner: '\u{1F52E}',
  vidwan: '\u{2B50}',
  pandit: '\u{1F451}',
};

const LABELS = {
  title:     { en: 'Share Your Progress', hi: 'अपनी प्रगति साझा करें', sa: 'अपनी प्रगति साझा करें', mai: 'अपनी प्रगति साझा करें', mr: 'अपनी प्रगति साझा करें', ta: 'Share Your Progress', te: 'Share Your Progress', bn: 'Share Your Progress', kn: 'Share Your Progress', gu: 'Share Your Progress' },
  streak:    { en: 'Day Streak', hi: 'दिन की लय', sa: 'दिन की लय', mai: 'दिन की लय', mr: 'दिन की लय', ta: 'Day Streak', te: 'Day Streak', bn: 'Day Streak', kn: 'Day Streak', gu: 'Day Streak' },
  badges:    { en: 'Badges Earned', hi: 'अर्जित बैज', sa: 'अर्जित बैज', mai: 'अर्जित बैज', mr: 'अर्जित बैज', ta: 'Badges Earned', te: 'Badges Earned', bn: 'Badges Earned', kn: 'Badges Earned', gu: 'Badges Earned' },
  tagline:   { en: 'Learning Vedic Astrology on Dekho Panchang', hi: 'देखो पंचांग पर वैदिक ज्योतिष सीख रहे हैं', sa: 'देखो पंचांग पर वैदिक ज्योतिष सीख रहे हैं', mai: 'देखो पंचांग पर वैदिक ज्योतिष सीख रहे हैं', mr: 'देखो पंचांग पर वैदिक ज्योतिष सीख रहे हैं', ta: 'Learning Vedic Astrology on Dekho Panchang', te: 'Learning Vedic Astrology on Dekho Panchang', bn: 'Learning Vedic Astrology on Dekho Panchang', kn: 'Learning Vedic Astrology on Dekho Panchang', gu: 'Learning Vedic Astrology on Dekho Panchang' },
};

function t(key: keyof typeof LABELS, locale: Locale): string {
  const entry = LABELS[key];
  return locale === 'en' || String(locale) === 'ta' ? entry.en : entry.hi;
}

export default function ShareStreakCard() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const { progress, streak, hydrated, getOverallProgress } = useLearningProgressStore();

  if (!hydrated) return null;

  const overall = getOverallProgress();
  const level = getLevel(overall.mastered);
  const icon = LEVEL_ICONS[level.level] || '\u{1F331}';
  const levelName = isHi ? level.label.hi : level.label.en;
  const { earned } = checkBadges(progress, streak);

  const shareText = isDevanagariLocale(locale)
    ? `${icon} ${levelName} | \u{1F525} ${streak.streakDays} दिन की लय | \u{1F3C5} ${earned.length} बैज — देखो पंचांग पर वैदिक ज्योतिष सीख रहे हैं!`
    : `${icon} ${levelName} | \u{1F525} ${streak.streakDays} Day Streak | \u{1F3C5} ${earned.length} Badges — Learning Vedic Astrology on Dekho Panchang!`;

  return (
    <div>
      <p
        className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3"
        style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
      >
        {t('title', locale)}
      </p>

      {/* Visual card for screenshotting */}
      <div className="p-5 rounded-2xl border-2 border-gold-primary/30 bg-gradient-to-br from-[#0a0e27] via-[#111633] to-[#0a0e27] shadow-lg shadow-gold-primary/5">
        {/* Level row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="text-lg font-bold text-gold-light">{levelName}</p>
            <p className="text-[11px] text-text-secondary">
              {overall.mastered}/{overall.total} modules
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{'\u{1F525}'}</span>
            <span className="text-sm font-bold text-amber-400">{streak.streakDays}</span>
            <span className="text-xs text-text-secondary">{t('streak', locale)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{'\u{1F3C5}'}</span>
            <span className="text-sm font-bold text-gold-light">{earned.length}</span>
            <span className="text-xs text-text-secondary">{t('badges', locale)}</span>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-[11px] text-text-secondary/70 italic"
          style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
        >
          {t('tagline', locale)}
        </p>
      </div>

      {/* Share buttons */}
      <div className="mt-3">
        <ShareButton
          title="My Vedic Astrology Progress"
          text={shareText}
          url="https://dekhopanchang.com/en/learn"
          locale={locale}
          variant="inline"
        />
      </div>
    </div>
  );
}
