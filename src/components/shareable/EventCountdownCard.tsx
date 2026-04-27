'use client';

import type { CelestialEvent } from '@/lib/calendar/upcoming-events';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { CARD_COLORS, WATERMARK_URL } from '@/lib/shareable/card-base';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const L = {
  dos: { en: 'Do', hi: 'करें' },
  donts: { en: "Don't", hi: 'न करें' },
  daysAway: { en: 'days away', hi: 'दिन शेष' },
  activeNow: { en: 'Active Now', hi: 'अभी सक्रिय' },
  today: { en: 'Today', hi: 'आज' },
  tomorrow: { en: 'Tomorrow', hi: 'कल' },
  keyDates: { en: 'Key Dates', hi: 'प्रमुख तिथियाँ' },
  personalImpact: { en: 'Your Impact', hi: 'आपका प्रभाव' },
};

// ---------------------------------------------------------------------------
// SVG Illustrations
// ---------------------------------------------------------------------------

function RetrogradeSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 40" className="w-20 h-10" aria-hidden="true">
      {/* Retrograde loop path */}
      <path
        d="M 5 20 Q 20 5, 35 15 Q 50 25, 40 10 Q 30 -5, 50 15 Q 60 25, 75 20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Arrow at start */}
      <circle cx="75" cy="20" r="3" fill={color} opacity="0.9" />
      {/* Retrograde symbol */}
      <text x="40" y="38" textAnchor="middle" fill={color} fontSize="10" opacity="0.5">
        &#x211E;
      </text>
    </svg>
  );
}

function EclipseSVG({ isSolar }: { isSolar: boolean }) {
  if (isSolar) {
    return (
      <svg viewBox="0 0 60 60" className="w-14 h-14" aria-hidden="true">
        {/* Sun */}
        <circle cx="30" cy="30" r="22" fill="#f59e0b" opacity="0.15" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Moon covering */}
        <circle cx="30" cy="30" r="18" fill={CARD_COLORS.navy} />
        {/* Corona rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 30 + Math.cos(rad) * 22;
          const y1 = 30 + Math.sin(rad) * 22;
          const x2 = 30 + Math.cos(rad) * 27;
          const y2 = 30 + Math.sin(rad) * 27;
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="1" opacity="0.4" />;
        })}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14" aria-hidden="true">
      {/* Moon */}
      <circle cx="30" cy="30" r="20" fill="#818cf8" opacity="0.15" />
      <circle cx="30" cy="30" r="20" fill="none" stroke="#818cf8" strokeWidth="1.5" />
      {/* Earth shadow passing over */}
      <circle cx="35" cy="28" r="18" fill={CARD_COLORS.navy} opacity="0.85" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EventCountdownCardProps {
  event: CelestialEvent;
  locale: string;
  personalImpact?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventCountdownCard({
  event,
  locale,
  personalImpact,
  expanded = false,
  onToggleExpand,
}: EventCountdownCardProps) {
  const isDeva = isDevanagariLocale(locale as Locale);
  const headingFont = getHeadingFont(locale as Locale);
  const bodyFont = getBodyFont(locale as Locale);

  const title = tl(event.title, locale);
  const description = tl(event.description, locale);

  // Event-type-specific styling
  const isEclipse = event.type === 'eclipse';
  const isSolarEclipse = isEclipse && event.planet === 0;
  const isRetro = event.type === 'retrograde';

  const borderColor = isEclipse
    ? (isSolarEclipse ? 'border-amber-500/25' : 'border-indigo-500/25')
    : 'border-gold-primary/20';
  const accentColor = isEclipse
    ? (isSolarEclipse ? 'text-amber-400' : 'text-indigo-400')
    : 'text-gold-light';
  const glowFrom = isEclipse
    ? (isSolarEclipse ? 'from-amber-500/5' : 'from-indigo-500/5')
    : 'from-gold-primary/5';

  // Countdown display
  let countdownText: string;
  if (event.isActive) {
    countdownText = tl(L.activeNow, locale);
  } else if (event.daysUntil === 0) {
    countdownText = tl(L.today, locale);
  } else if (event.daysUntil === 1) {
    countdownText = tl(L.tomorrow, locale);
  } else {
    countdownText = `${event.daysUntil} ${tl(L.daysAway, locale)}`;
  }

  const countdownBg = event.isActive
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
    : event.daysUntil <= 7
      ? 'bg-red-500/15 text-red-300 border-red-500/20'
      : event.daysUntil <= 30
        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
        : 'bg-blue-500/10 text-blue-300 border-blue-500/20';

  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border ${borderColor} overflow-hidden transition-all hover:border-gold-primary/30`}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggleExpand}
        className={`w-full text-left p-5 sm:p-6 bg-gradient-to-r ${glowFrom} to-transparent`}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-4">
          {/* Visual */}
          <div className="shrink-0 mt-1">
            {isEclipse ? (
              <EclipseSVG isSolar={isSolarEclipse} />
            ) : (
              <RetrogradeSVG color={event.planetColor || CARD_COLORS.gold} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-base sm:text-lg font-bold ${accentColor}`} style={headingFont}>
                {title}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${countdownBg}`}>
                {countdownText}
              </span>
            </div>

            {/* Date range */}
            <p className="text-sm text-text-secondary mb-1" style={bodyFont}>
              {formatEventDate(event.date)}
              {event.endDate && ` — ${formatEventDate(event.endDate)}`}
            </p>

            {/* Description */}
            <p className="text-xs text-text-secondary/70 line-clamp-2" style={bodyFont}>
              {description}
            </p>
          </div>

          {/* Expand chevron */}
          <div className="shrink-0 flex items-center">
            <svg
              className={`w-5 h-5 text-text-secondary/40 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded content — survival guide */}
      {expanded && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 border-t border-white/5 pt-4">
          {/* Personal impact (if logged in with chart) */}
          {personalImpact && (
            <div className="p-3 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
              <p className="text-xs font-semibold text-gold-light mb-1" style={headingFont}>
                {tl(L.personalImpact, locale)}
              </p>
              <p className="text-sm text-text-primary" style={bodyFont}>
                {personalImpact}
              </p>
            </div>
          )}

          {/* Do's */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
              {tl(L.dos, locale)}
            </h4>
            <ul className="space-y-1.5">
              {event.survivalGuide.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary/90" style={bodyFont}>
                  <span className="text-emerald-400 shrink-0 mt-0.5">+</span>
                  <span>{tl(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div>
            <h4 className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">
              {tl(L.donts, locale)}
            </h4>
            <ul className="space-y-1.5">
              {event.survivalGuide.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary/90" style={bodyFont}>
                  <span className="text-red-400 shrink-0 mt-0.5">&minus;</span>
                  <span>{tl(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Dates */}
          {event.survivalGuide.keyDates.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gold-light/70 mb-2 uppercase tracking-wider">
                {tl(L.keyDates, locale)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.survivalGuide.keyDates.map((kd, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-text-secondary"
                  >
                    <span className="font-mono text-gold-light">{formatEventDate(kd.date)}</span>
                    <span className="text-text-secondary/60" style={bodyFont}>{tl(kd.label, locale)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Watermark */}
          <p className="text-[10px] text-text-secondary/30 text-right mt-2">
            {WATERMARK_URL}
          </p>
        </div>
      )}
    </div>
  );
}
