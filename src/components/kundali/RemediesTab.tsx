'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';
import {
  generateGemstoneRecommendations,
  GEMSTONE_COLORS,
  type GemstoneRecommendation,
  type NeedLevel,
} from '@/lib/remedies/gemstone-engine';
import { computeHoraTable, getHoraWindowsForPlanet, type HoraSlot } from '@/lib/panchang/hora-engine';
import { PLANET_REMEDIES_FULL } from '@/lib/tippanni/remedies-enhanced';
import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

interface RemediesTabProps {
  kundali: KundaliData;
  locale: string;
}

// ─── Module-level constants ─────────────────────────────────────────────────

const NEED_LEVEL_CONFIG: Record<NeedLevel, { label: string; labelHi: string; barColor: string; borderColor: string; bgColor: string; textColor: string }> = {
  critical: {
    label: 'Critical',
    labelHi: 'अत्यावश्यक',
    barColor: 'bg-gradient-to-r from-red-500 to-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/8',
    textColor: 'text-red-400',
  },
  recommended: {
    label: 'Recommended',
    labelHi: 'अनुशंसित',
    barColor: 'bg-gradient-to-r from-gold-dark to-gold-primary',
    borderColor: 'border-gold-primary/25',
    bgColor: 'bg-gold-primary/8',
    textColor: 'text-gold-light',
  },
  optional: {
    label: 'Optional',
    labelHi: 'वैकल्पिक',
    barColor: 'bg-gradient-to-r from-blue-600/60 to-blue-400/60',
    borderColor: 'border-blue-400/15',
    bgColor: 'bg-blue-500/5',
    textColor: 'text-blue-400/80',
  },
  not_needed: {
    label: 'Not Needed',
    labelHi: 'आवश्यक नहीं',
    barColor: 'bg-gradient-to-r from-text-secondary/30 to-text-secondary/20',
    borderColor: 'border-text-secondary/10',
    bgColor: 'bg-text-secondary/3',
    textColor: 'text-text-secondary/60',
  },
};

const NEED_ORDER: NeedLevel[] = ['critical', 'recommended', 'optional', 'not_needed'];

/** Map: planet id → best weekday name (en/hi) */
const PLANET_BEST_DAY: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sunday', hi: 'रविवार' },
  1: { en: 'Monday', hi: 'सोमवार' },
  2: { en: 'Tuesday', hi: 'मंगलवार' },
  3: { en: 'Wednesday', hi: 'बुधवार' },
  4: { en: 'Thursday', hi: 'गुरुवार' },
  5: { en: 'Friday', hi: 'शुक्रवार' },
  6: { en: 'Saturday', hi: 'शनिवार' },
  7: { en: 'Saturday', hi: 'शनिवार' },   // Rahu → Saturday
  8: { en: 'Tuesday', hi: 'मंगलवार' },   // Ketu → Tuesday
};

/** Map: planet id → weekday number (0=Sunday) for "is today" check */
const PLANET_BEST_WEEKDAY: Record<number, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 6, 8: 2,
};

/** Map: ordinal suffix helper */
function ordinalHouse(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Build a short "why" explanation for the planet's weakness */
function buildWhyExplanation(
  kundali: KundaliData,
  planetId: number,
  isEn: boolean,
): string {
  const planet = kundali.planets.find(p => p.planet.id === planetId);
  if (!planet) return '';

  const parts: string[] = [];
  const pName = isEn ? (planet.planet.name.en ?? '') : (planet.planet.name.hi ?? planet.planet.name.en ?? '');
  const signName = isEn ? (planet.signName.en ?? '') : (planet.signName.hi ?? planet.signName.en ?? '');

  if (planet.isDebilitated) {
    parts.push(isEn
      ? `${pName} is debilitated in ${signName}, its weakest placement.`
      : `${pName} ${signName} में नीच है, यह इसकी सबसे कमज़ोर स्थिति है।`);
  } else if (planet.isCombust) {
    parts.push(isEn
      ? `${pName} is combust (too close to Sun), reducing its significations.`
      : `${pName} अस्त है (सूर्य के अत्यन्त समीप), इसके कारकत्व कमज़ोर हैं।`);
  }

  const dusthanas = new Set([6, 8, 12]);
  if (dusthanas.has(planet.house)) {
    parts.push(isEn
      ? `Placed in the ${ordinalHouse(planet.house)} house (dusthana — house of challenge).`
      : `${ordinalHouse(planet.house)} भाव (दुष्टस्थान) में स्थित।`);
  }

  // Shadbala check
  const sb = kundali.shadbala.find(s => s.planet === planet.planet.name.en);
  if (sb && sb.totalStrength < 40) {
    parts.push(isEn
      ? `Low Shadbala strength (${sb.totalStrength.toFixed(0)}%) — needs energizing.`
      : `कम षड्बल (${sb.totalStrength.toFixed(0)}%) — बल वृद्धि आवश्यक।`);
  }

  // Dasha relevance
  const now = new Date().toISOString().split('T')[0];
  const planetName = planet.planet.name.en;
  if (kundali.dashas?.length) {
    for (const maha of kundali.dashas) {
      if (maha.startDate <= now && maha.endDate >= now) {
        if (maha.planet === planetName) {
          parts.push(isEn
            ? `Currently running ${pName} Mahadasha — remedies are especially potent now.`
            : `वर्तमान में ${pName} महादशा चल रही है — उपाय अत्यन्त प्रभावी।`);
        } else if (maha.subPeriods) {
          for (const antar of maha.subPeriods) {
            if (antar.startDate <= now && antar.endDate >= now && antar.planet === planetName) {
              parts.push(isEn
                ? `Currently in ${pName} Antardasha — a timely window for remedies.`
                : `वर्तमान ${pName} अन्तर्दशा — उपायों का उचित समय।`);
              break;
            }
          }
        }
      }
    }
  }

  if (parts.length === 0) {
    parts.push(isEn
      ? `${pName} could benefit from strengthening through remedial measures.`
      : `${pName} को उपचारात्मक उपायों से बल मिल सकता है।`);
  }

  return parts.join(' ');
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RemediesTab({ kundali, locale }: RemediesTabProps) {
  const isTamil = locale === 'ta';
  const isEn = locale === 'en' || isTamil;

  const recommendations = useMemo(
    () => generateGemstoneRecommendations(kundali),
    [kundali],
  );

  // Compute today's hora table using approximate sunrise/sunset
  // (exact panchang data isn't available as a prop — use 06:00/18:00 default)
  const horaTable = useMemo(() => {
    const today = new Date();
    const varaDay = today.getDay(); // 0=Sunday
    return computeHoraTable('06:00', '18:00', '06:00', varaDay);
  }, []);

  const todayWeekday = useMemo(() => new Date().getDay(), []);

  // Group by need level
  const grouped = useMemo(() => {
    const map: Record<NeedLevel, GemstoneRecommendation[]> = {
      critical: [],
      recommended: [],
      optional: [],
      not_needed: [],
    };
    for (const rec of recommendations) {
      map[rec.needLevel].push(rec);
    }
    return map;
  }, [recommendations]);

  const [expandNotNeeded, setExpandNotNeeded] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold-light mb-2">
          {isEn ? 'Gemstone & Mantra Remedies' : 'रत्न एवं मन्त्र उपाय'}
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto">
          {isEn
            ? 'Personalized recommendations based on planetary strength, dignity, and placement in your birth chart. Always consult a qualified jyotishi before wearing gemstones.'
            : 'आपकी जन्मकुण्डली में ग्रहों की स्थिति, बल और गरिमा के आधार पर व्यक्तिगत अनुशंसाएँ। रत्न धारण करने से पहले सदैव किसी योग्य ज्योतिषी से परामर्श करें।'}
        </p>
      </div>

      {/* Grouped sections */}
      {NEED_ORDER.map((level) => {
        const items = grouped[level];
        if (items.length === 0) return null;

        const config = NEED_LEVEL_CONFIG[level];
        const isCollapsed = level === 'not_needed' && !expandNotNeeded;

        return (
          <div key={level} className="space-y-4">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${config.textColor.replace('text-', 'bg-')}`} />
              <h3 className={`text-lg font-semibold ${config.textColor}`}>
                {isEn ? config.label : config.labelHi}
                <span className="text-text-secondary/50 text-sm font-normal ml-2">
                  ({items.length})
                </span>
              </h3>
              {level === 'not_needed' && (
                <button
                  onClick={() => setExpandNotNeeded(!expandNotNeeded)}
                  className="text-xs text-text-secondary/60 hover:text-gold-light transition-colors ml-auto"
                >
                  {isCollapsed
                    ? (isEn ? 'Show' : 'दिखाएँ')
                    : (isEn ? 'Hide' : 'छिपाएँ')}
                </button>
              )}
            </div>

            {/* Cards */}
            {!isCollapsed && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((rec) => (
                  <GemstoneCard
                    key={rec.planetId}
                    rec={rec}
                    locale={locale}
                    isEn={isEn}
                    horaTable={horaTable}
                    todayWeekday={todayWeekday}
                    kundali={kundali}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── GemstoneCard ───────────────────────────────────────────────────────────

function GemstoneCard({
  rec,
  locale,
  isEn,
  horaTable,
  todayWeekday,
  kundali,
}: {
  rec: GemstoneRecommendation;
  locale: string;
  isEn: boolean;
  horaTable: HoraSlot[];
  todayWeekday: number;
  kundali: KundaliData;
}) {
  const [expanded, setExpanded] = useState(rec.needLevel === 'critical' || rec.needLevel === 'recommended');
  const config = NEED_LEVEL_CONFIG[rec.needLevel];
  const gemColor = GEMSTONE_COLORS[rec.planetId] ?? '#d4a853';
  const remedy = rec.remedy;
  const planetName = tl(rec.planetName, locale);

  // Get hora windows for this planet (Rahu uses Saturn hora, Ketu uses Mars hora)
  const horaId = rec.planetId <= 6 ? rec.planetId : (rec.planetId === 7 ? 6 : 2);
  const planetHoraWindows = useMemo(
    () => getHoraWindowsForPlanet(horaTable, horaId),
    [horaTable, horaId],
  );

  // Best day check
  const bestDay = PLANET_BEST_DAY[rec.planetId] ?? { en: 'Saturday', hi: 'शनिवार' };
  const isBestDayToday = PLANET_BEST_WEEKDAY[rec.planetId] === todayWeekday;

  // Full remedy data from PLANET_REMEDIES_FULL
  const fullRemedy = PLANET_REMEDIES_FULL[rec.planetId];

  // "Why" explanation
  const whyText = useMemo(
    () => buildWhyExplanation(kundali, rec.planetId, isEn),
    [kundali, rec.planetId, isEn],
  );

  return (
    <div
      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${config.borderColor} rounded-2xl overflow-hidden transition-all`}
    >
      {/* Header bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Planet color dot */}
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: GRAHAS[rec.planetId]?.color ?? '#d4a853' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-text-primary truncate">{planetName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
              {isEn ? config.label : config.labelHi}
            </span>
          </div>
          {/* Score bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${config.barColor} transition-all`}
              style={{ width: `${rec.needScore}%` }}
            />
          </div>
          <div className="text-[10px] text-text-secondary/50 mt-0.5 text-right">
            {rec.needScore}/100
          </div>
        </div>
        {/* Expand icon */}
        <svg
          className={`w-4 h-4 text-text-secondary/40 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Reasons */}
          {rec.reasons.length > 0 && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
                {isEn ? 'Analysis' : 'विश्लेषण'}
              </h4>
              <ul className="space-y-1">
                {rec.reasons.map((reason, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-gold-dark mt-1 shrink-0">--</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gemstone */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Primary Gemstone' : 'प्राथमिक रत्न'}
            </h4>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg border border-white/10 shrink-0"
                style={{ backgroundColor: gemColor, opacity: 0.85 }}
              />
              <div>
                <span className="text-text-primary font-medium text-sm">
                  {tl(remedy.gemstone.name, locale)}
                </span>
                <div className="text-text-secondary/60 text-xs">
                  {remedy.gemstone.weight} | {tl(remedy.gemstone.metal, locale)}
                </div>
              </div>
            </div>
            {/* Alternatives */}
            {remedy.gemstone.alternates.length > 0 && (
              <p className="text-xs text-text-secondary/50">
                {isEn ? 'Alternatives: ' : 'विकल्प: '}
                {remedy.gemstone.alternates.map(a => tl(a, locale)).join(', ')}
              </p>
            )}
          </div>

          {/* Wearing rules */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Wearing Rules' : 'धारण नियम'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Finger' : 'अँगुली'}</span>
                <span className="text-text-primary">{tl(remedy.gemstone.finger, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Metal' : 'धातु'}</span>
                <span className="text-text-primary">{tl(remedy.gemstone.metal, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Day' : 'दिन'}</span>
                <span className="text-text-primary">{tl(remedy.charity.day, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Color' : 'रंग'}</span>
                <span className="text-text-primary">{tl(remedy.color, locale)}</span>
              </div>
            </div>
          </div>

          {/* Mantra */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Beej Mantra' : 'बीज मन्त्र'}
            </h4>
            <div className="bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/30 border border-gold-primary/10 rounded-xl px-4 py-3">
              <p className="text-gold-light font-medium text-sm leading-relaxed">
                {tl(remedy.beejMantra, 'hi')}
              </p>
              {locale === 'en' && (
                <p className="text-text-secondary/60 text-xs mt-1">
                  {tl(remedy.beejMantra, 'en')}
                </p>
              )}
              <p className="text-text-secondary/40 text-xs mt-2">
                {isEn ? `Japa count: ${remedy.count.toLocaleString()}` : `जप संख्या: ${remedy.count.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Charity */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Charity & Fasting' : 'दान एवं व्रत'}
            </h4>
            <p className="text-sm text-text-secondary">{tl(remedy.charity.items, locale)}</p>
            <p className="text-xs text-text-secondary/60 mt-1">{tl(remedy.fasting, locale)}</p>
          </div>

          {/* ── Today's Hora Windows ── */}
          {planetHoraWindows.length > 0 && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
                {isEn ? "Today's Hora Windows" : 'आज के होरा समय'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {planetHoraWindows.map((hw, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                      hw.isDay
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {hw.startTime} - {hw.endTime}
                    <span className="ml-1.5 opacity-60">{hw.isDay ? (isEn ? 'day' : 'दिन') : (isEn ? 'night' : 'रात')}</span>
                  </div>
                ))}
              </div>
              <p className="text-text-secondary/40 text-[10px] mt-1.5">
                {isEn
                  ? 'Perform mantra japa or wear gemstone during these planetary hours for maximum effect.'
                  : 'अधिकतम प्रभाव के लिए इन ग्रह-होराओं में मन्त्र जप या रत्न धारण करें।'}
              </p>
            </div>
          )}

          {/* ── Best Day Indicator ── */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
            isBestDayToday
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-white/[0.02] border border-white/5'
          }`}>
            {isBestDayToday && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            )}
            <span className={isBestDayToday ? 'text-green-300 font-medium' : 'text-text-secondary'}>
              {isEn ? 'Best Day: ' : 'सर्वोत्तम दिन: '}
              <span className="text-text-primary">{isEn ? bestDay.en : bestDay.hi}</span>
              {isBestDayToday && (
                <span className="ml-1.5 text-green-400">
                  {isEn ? '— Today!' : '— आज!'}
                </span>
              )}
            </span>
          </div>

          {/* ── Charity Details (expanded) ── */}
          {fullRemedy && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
                {isEn ? 'Charity & Worship' : 'दान एवं पूजा'}
              </h4>
              <div className="bg-white/[0.02] rounded-xl border border-white/5 px-4 py-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary/50 shrink-0 w-16">{isEn ? 'Donate' : 'दान'}</span>
                  <span className="text-text-secondary">{tl(fullRemedy.charity.items, locale)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary/50 shrink-0 w-16">{isEn ? 'Deity' : 'देवता'}</span>
                  <span className="text-text-secondary">{tl(fullRemedy.charity.deity, locale)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary/50 shrink-0 w-16">{isEn ? 'Direction' : 'दिशा'}</span>
                  <span className="text-text-secondary">{tl(fullRemedy.direction, locale)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary/50 shrink-0 w-16">{isEn ? 'Color' : 'रंग'}</span>
                  <span className="text-text-secondary">{tl(fullRemedy.color, locale)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-text-secondary/50 shrink-0 w-16">{isEn ? 'Fasting' : 'व्रत'}</span>
                  <span className="text-text-secondary">{tl(fullRemedy.fasting, locale)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Why This Remedy (chart context) ── */}
          {whyText && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
                {isEn ? 'Why This Remedy' : 'यह उपाय क्यों'}
              </h4>
              <p className="text-sm text-text-secondary/80 leading-relaxed bg-gradient-to-r from-[#2d1b69]/20 to-transparent rounded-xl px-4 py-3 border-l-2 border-gold-primary/30">
                {whyText}
              </p>
            </div>
          )}

          {/* Cautions */}
          {rec.cautions.length > 0 && (
            <div>
              {rec.cautions.map((c, i) => (
                <div
                  key={i}
                  className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl px-4 py-3 text-xs leading-relaxed mt-2"
                >
                  <span className="font-semibold mr-1">{isEn ? 'Caution:' : 'सावधानी:'}</span>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
