'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Star, Clock, Sunrise, Sunset, Moon, AlertTriangle, ChevronDown, User } from 'lucide-react';
import type { PanchangData } from '@/types/panchang';
import type { DayVerdict, VerdictRating } from '@/lib/muhurta/verdict-types';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { EXTENDED_ACTIVITIES } from '@/lib/muhurta/activity-rules-extended';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import { useLocationStore } from '@/stores/location-store';
import { computeBalam, TARA_NAMES, FAVORABLE_TARAS } from '@/lib/panchang/balam';

// ── Colours — solid hex for visibility on dark bg ──

const VERDICT_HEX: Record<VerdictRating, string> = {
  avoid: '#991b1b',
  caution: '#92400e',
  good: '#065f46',
  very_good: '#047857',
  excellent: '#d4a853',
  exceptional: '#f0d48a',
};

const VERDICT_LABEL: Record<VerdictRating, { en: string; hi: string }> = {
  avoid: { en: 'Avoid', hi: 'वर्जित' },
  caution: { en: 'Caution', hi: 'सावधान' },
  good: { en: 'Good', hi: 'शुभ' },
  very_good: { en: 'Very Good', hi: 'अति शुभ' },
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  exceptional: { en: 'Exceptional', hi: 'सर्वश्रेष्ठ' },
};

// ── Time helpers ──

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function fmtShort(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h >= 12 ? 'p' : 'a';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}${suffix}`;
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Activity pills — 6 most common shown directly, rest in "More" dropdown ──

const PRIMARY_ACTIVITIES: ExtendedActivityId[] = [
  'travel', 'marriage', 'property', 'business', 'spiritual_practice', 'education',
];

const ALL_ACTIVITY_IDS = Object.keys(EXTENDED_ACTIVITIES) as ExtendedActivityId[];
const SECONDARY_ACTIVITIES = ALL_ACTIVITY_IDS.filter(id => !PRIMARY_ACTIVITIES.includes(id));

// ── Named time window for lanes ──

interface NamedWindow {
  id: string;
  name: string;
  nameHi: string;
  start: number; // minutes
  end: number;
  colour: string; // hex
}

function collectInauspicious(p: PanchangData): NamedWindow[] {
  const windows: NamedWindow[] = [];
  // Day-level yoga doshas: Vyatipata (#17) and Vaidhriti (#27) block sunrise→sunset
  const sunriseM = toMin(p.sunrise);
  const sunsetM = toMin(p.sunset);
  if (p.yoga?.number === 17) windows.push({ id: 'vyati', name: 'Vyatipata', nameHi: 'व्यतीपात', start: sunriseM, end: sunsetM, colour: '#581c87' });
  if (p.yoga?.number === 27) windows.push({ id: 'vaidh', name: 'Vaidhriti', nameHi: 'वैधृति', start: sunriseM, end: sunsetM, colour: '#581c87' });
  if (p.rahuKaal) windows.push({ id: 'rk', name: 'Rahu Kaal', nameHi: 'राहु काल', start: toMin(p.rahuKaal.start), end: toMin(p.rahuKaal.end), colour: '#dc2626' });
  if (p.yamaganda) windows.push({ id: 'ym', name: 'Yamaganda', nameHi: 'यमगण्ड', start: toMin(p.yamaganda.start), end: toMin(p.yamaganda.end), colour: '#b91c1c' });
  if (p.gulikaKaal) windows.push({ id: 'gk', name: 'Gulika', nameHi: 'गुलिक', start: toMin(p.gulikaKaal.start), end: toMin(p.gulikaKaal.end), colour: '#991b1b' });
  const varjyam = p.varjyamAll ?? (p.varjyam ? [p.varjyam] : []);
  varjyam.forEach((v, i) => windows.push({ id: `vj${i}`, name: 'Varjyam', nameHi: 'वर्ज्यम्', start: toMin(v.start), end: toMin(v.end), colour: '#d97706' }));
  const bhadra = p.bhadraAll ?? (p.bhadra ? [p.bhadra] : []);
  bhadra.forEach((b, i) => windows.push({ id: `bh${i}`, name: 'Vishti', nameHi: 'विष्टि', start: toMin(b.start), end: toMin(b.end), colour: '#7f1d1d' }));
  if (p.durMuhurtam) p.durMuhurtam.forEach((d, i) => windows.push({ id: `dm${i}`, name: 'Durmuhurta', nameHi: 'दुर्मुहूर्त', start: toMin(d.start), end: toMin(d.end), colour: '#92400e' }));
  if (p.vishaGhatika) windows.push({ id: 'vg', name: 'Visha Ghatika', nameHi: 'विष घटिका', start: toMin(p.vishaGhatika.start), end: toMin(p.vishaGhatika.end), colour: '#78350f' });
  return windows;
}

function collectAuspicious(p: PanchangData): NamedWindow[] {
  const windows: NamedWindow[] = [];
  if (p.brahmaMuhurta) windows.push({ id: 'bm', name: 'Brahma Muhurta', nameHi: 'ब्रह्म मुहूर्त', start: toMin(p.brahmaMuhurta.start), end: toMin(p.brahmaMuhurta.end), colour: '#6d28d9' });
  if (p.abhijitMuhurta && p.abhijitMuhurta.available !== false) windows.push({ id: 'ab', name: 'Abhijit', nameHi: 'अभिजित', start: toMin(p.abhijitMuhurta.start), end: toMin(p.abhijitMuhurta.end), colour: '#d4a853' });
  const amrit = p.amritKalamAll ?? (p.amritKalam ? [p.amritKalam] : []);
  amrit.forEach((a, i) => windows.push({ id: `ak${i}`, name: 'Amrit Kalam', nameHi: 'अमृत काल', start: toMin(a.start), end: toMin(a.end), colour: '#059669' }));
  if (p.vijayaMuhurta) windows.push({ id: 'vj', name: 'Vijaya', nameHi: 'विजय', start: toMin(p.vijayaMuhurta.start), end: toMin(p.vijayaMuhurta.end), colour: '#10b981' });
  if (p.godhuli) windows.push({ id: 'gd', name: 'Godhuli', nameHi: 'गोधूलि', start: toMin(p.godhuli.start), end: toMin(p.godhuli.end), colour: '#f59e0b' });
  return windows;
}

// ── Props ──

interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
  timezone?: string;
  birthNakshatra?: number;  // 1-27 (from saved kundali)
  birthRashi?: number;      // 1-12 (Moon sign from saved kundali)
}

// ── Lane Bar sub-component ──

function LaneBar({ windows, label, labelHi, isHi, tlStart, tlSpan, emptyColour }: {
  windows: NamedWindow[];
  label: string;
  labelHi: string;
  isHi: boolean;
  tlStart: number;
  tlSpan: number;
  emptyColour: string;
}) {
  const pct = (min: number) => Math.max(0, Math.min(100, ((min - tlStart) / tlSpan) * 100));

  return (
    <div>
      <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 block">
        {isHi ? labelHi : label}
      </span>
      <div className="relative h-7 rounded-md" style={{ backgroundColor: emptyColour }}>
        {windows.map(w => {
          const left = pct(Math.max(w.start, tlStart));
          const right = pct(Math.min(w.end, tlStart + tlSpan));
          const width = right - left;
          if (width <= 0) return null;
          return (
            <div
              key={w.id}
              className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden rounded-sm"
              style={{ left: `${left}%`, width: `${width}%`, backgroundColor: w.colour }}
              title={`${isHi ? w.nameHi : w.name}: ${fmt12(toHHMM(w.start))} – ${fmt12(toHHMM(w.end))}`}
            >
              {width > 6 && (
                <span className="text-[8px] font-bold text-white/90 truncate px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isHi ? w.nameHi : w.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Date-aware label helpers ───────────────────────────────────────
// "Today" labels are misleading once the user picks a non-today date
// from the date picker on /panchang. These helpers compare the
// panchang's date against the actual current date in the panchang's
// own timezone (NOT browser TZ — the panchang is anchored to a
// specific location).

const LOCALE_TO_BCP47: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN',
  kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN', sa: 'hi-IN',
};

function formatDateLabel(iso: string, locale: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  // Noon UTC so the displayed date doesn't shift due to TZ; we only
  // care about month + day + weekday rendering.
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const bcp47 = LOCALE_TO_BCP47[locale] ?? 'en-IN';
  return new Intl.DateTimeFormat(bcp47, { weekday: 'short', month: 'short', day: 'numeric' }).format(dt);
}

// ── Main Component ──

export default function BestWindowsCard({ panchang, locale, timezone, birthNakshatra, birthRashi }: BestWindowsCardProps) {
  const isHi = isDevanagariLocale(locale);
  const storeTz = useLocationStore(s => s.timezone);
  const effectiveTz = timezone || storeTz || null;

  // Is the panchang showing today (in the panchang's location TZ)?
  // Used to gate "Today" copy and the NOW marker — both lie when the
  // user has picked a different date on the panchang date picker.
  //
  // Lazy state initialiser computes `todayInTimezone` on first render
  // (SSR + client both deterministic since `effectiveTz` is a prop).
  // Previously initialised to `panchang.date` which made `isToday` always
  // true on first paint, causing a brief "Today" → "<date>" flash on
  // non-today views (Gemini PR #357 round-2 MEDIUM).
  const [todayIso, setTodayIso] = useState<string>(() => todayInTimezone(effectiveTz || 'Asia/Kolkata'));
  useEffect(() => {
    setTodayIso(todayInTimezone(effectiveTz || 'Asia/Kolkata'));
  }, [effectiveTz]);
  const isToday = panchang.date === todayIso;
  const dateLabel = !isToday ? formatDateLabel(panchang.date, locale) : '';

  // Activity filter state
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Personal tarabala overlay
  const [personalMode, setPersonalMode] = useState(false);
  const hasBirthData = birthNakshatra != null && birthRashi != null;

  const personalBalam = useMemo(() => {
    if (!hasBirthData || !personalMode) return null;
    const todayNak = panchang.nakshatra?.id ?? 1;
    // Approximate today's Moon rashi from nakshatra: each rashi spans 2.25 nakshatras
    const todayMoonRashi = Math.ceil(todayNak / 2.25);
    return computeBalam(birthNakshatra!, birthRashi!, todayNak, todayMoonRashi);
  }, [hasBirthData, personalMode, birthNakshatra, birthRashi, panchang.nakshatra]);

  // Cycle degradation: distance from birth nakshatra determines cycle 1/2/3
  const personalCycle = useMemo(() => {
    if (!hasBirthData || !personalMode || !panchang.nakshatra) return null;
    const todayNak = panchang.nakshatra?.id ?? 1;
    const distance = ((todayNak - birthNakshatra! + 27) % 27);
    // distance 0 means same nakshatra = cycle 1
    const cycle = distance === 0 ? 1 : Math.floor((distance - 1) / 9) + 1; // 1, 2, or 3
    return cycle;
  }, [hasBirthData, personalMode, birthNakshatra, panchang.nakshatra]);

  // Forward lookup: when tara is unfavourable, find the next favourable one
  const nextFavourableTara = useMemo(() => {
    if (!personalBalam || personalBalam.tarabalam.favorable) return null;
    if (!birthNakshatra || !panchang.nakshatra) return null;
    const todayNak = panchang.nakshatra.id ?? 1;
    // Walk forward through nakshatras to find the next favourable tara
    for (let offset = 1; offset <= 4; offset++) {
      const futureNak = ((todayNak - 1 + offset) % 27) + 1;
      const futureTara = ((futureNak - birthNakshatra + 27) % 9) || 9;
      if (FAVORABLE_TARAS.has(futureTara)) {
        // Estimate when: each nakshatra lasts ~1 day (13h20m average)
        // nakshatraTransition.endTime gives when current nakshatra ends
        const transitionTime = panchang.nakshatraTransition?.endTime;
        let timeHint = '';
        if (offset === 1 && transitionTime) {
          timeHint = ` (~${transitionTime})`;
        } else {
          timeHint = ` (~${offset} day${offset > 1 ? 's' : ''})`;
        }
        return {
          taraName: TARA_NAMES[futureTara - 1],
          offset,
          timeHint,
        };
      }
    }
    return null;
  }, [personalBalam, birthNakshatra, panchang.nakshatra, panchang.nakshatraTransition]);

  const handleActivitySelect = useCallback((id: string | undefined) => {
    setSelectedActivity(id);
    setShowMore(false);
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    if (!showMore) return;
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMore]);

  const verdict: DayVerdict = useMemo(
    () => computeDayVerdict(panchang, selectedActivity),
    [panchang, selectedActivity]
  );
  const { slots, bestWindow, dayLevelYogas } = verdict;

  // NOW — updates every 60s
  const [nowMin, setNowMin] = useState(() => nowMinutesInTimezone(effectiveTz));
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(effectiveTz));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(effectiveTz)), 60_000);
    return () => clearInterval(iv);
  }, [effectiveTz]);

  // Timeline range: Brahma Muhurta (or sunrise-1h) to sunset+1h
  const sunriseMin = toMin(panchang.sunrise);
  const sunsetMin = toMin(panchang.sunset);
  const tlStart = panchang.brahmaMuhurta ? toMin(panchang.brahmaMuhurta.start) : Math.max(0, sunriseMin - 60);
  const tlEnd = Math.min(1440, sunsetMin + 60);
  const tlSpan = tlEnd - tlStart;

  const moonriseMin = panchang.moonrise ? toMin(panchang.moonrise) : null;
  const moonsetMin = panchang.moonset ? toMin(panchang.moonset) : null;

  const pct = (min: number) => tlSpan > 0 ? Math.max(0, Math.min(100, ((min - tlStart) / tlSpan) * 100)) : 0;
  const nowPct = pct(nowMin);
  const nowInRange = nowMin >= tlStart && nowMin <= tlEnd;

  // Collect named windows for lanes
  const inauspicious = useMemo(() => collectInauspicious(panchang), [panchang]);
  const auspicious = useMemo(() => collectAuspicious(panchang), [panchang]);

  // Hour tick marks within range
  const hourTicks = useMemo(() => {
    const ticks: number[] = [];
    const firstHour = Math.ceil(tlStart / 60) * 60;
    for (let m = firstHour; m <= tlEnd; m += 60) ticks.push(m);
    return ticks;
  }, [tlStart, tlEnd]);

  if (slots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <p className="text-text-secondary text-sm text-center">{isHi ? 'कोई डेटा उपलब्ध नहीं।' : 'No verdict data available.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h3 className="text-gold-light font-semibold text-base">
            {isToday
              ? (isHi ? 'आज की सर्वश्रेष्ठ अवधियाँ' : 'Best Windows Today')
              : (isHi ? `${dateLabel} की सर्वश्रेष्ठ अवधियाँ` : `Best Windows for ${dateLabel}`)}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {dayLevelYogas.length > 0 && (
            <span className="text-gold-primary/70 text-[10px]">
              ✦ {dayLevelYogas.map(y => isHi ? y.nameHi : y.name).join(', ')}
            </span>
          )}
          {/* Personal tarabala toggle */}
          <button
            onClick={() => hasBirthData && setPersonalMode(prev => !prev)}
            disabled={!hasBirthData}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
              !hasBirthData
                ? 'opacity-40 cursor-not-allowed bg-white/[0.03] text-text-secondary border border-white/[0.06]'
                : personalMode
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                  : 'bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:border-sky-400/30 hover:text-sky-300'
            }`}
            title={!hasBirthData ? (isHi ? 'व्यक्तिगत करने के लिए जन्म विवरण जोड़ें' : 'Sign in with birth data to personalise') : (isHi ? 'मेरा लग्न' : 'My Chart')}
          >
            <User className="w-3 h-3" />
            <span>{isHi ? 'मेरा लग्न' : 'My Chart'}</span>
            <span className={`w-3 h-3 rounded-full border transition-all ${
              personalMode ? 'bg-sky-400 border-sky-300' : 'bg-transparent border-text-secondary/40'
            }`} />
          </button>
        </div>
      </div>

      {/* ── Personal Tarabala Summary (when toggled ON) ── */}
      {personalMode && personalBalam && (
        <div className="flex items-center gap-2 bg-sky-500/[0.06] rounded-lg px-3 py-2 border border-sky-500/10">
          <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <p className="text-sky-300/90 text-[11px] leading-snug">
            {tl(personalBalam.tarabalam.taraName, locale)} {isHi ? 'तारा' : 'Tara'}
            {' — '}
            {personalBalam.tarabalam.favorable
              ? (isHi
                  ? (isToday ? 'व्यक्तिगत रूप से आज शुभ' : `व्यक्तिगत रूप से ${dateLabel} को शुभ`)
                  : (isToday ? 'personally auspicious today' : `personally auspicious on ${dateLabel}`))
              : personalBalam.tarabalam.tara === 1
                ? (isHi ? 'जन्म नक्षत्र दिवस' : 'birth star day')
                : (isHi ? 'सावधानी बरतें' : 'exercise caution')}
            {personalCycle && (
              <span className="text-sky-400/60 ml-1.5">
                ({personalCycle === 1
                  ? (isHi ? 'पूर्ण बल' : 'Full strength')
                  : personalCycle === 2
                    ? (isHi ? 'मध्यम बल' : 'Moderate strength')
                    : (isHi ? 'न्यून बल' : 'Reduced strength')})
              </span>
            )}
          </p>
        </div>
      )}

      {/* ── Activity Pill Selector ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* "All" pill */}
        <button
          onClick={() => handleActivitySelect(undefined)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            selectedActivity === undefined
              ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
              : 'bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:border-gold-primary/20 hover:text-text-primary'
          }`}
        >
          {isHi ? 'सभी' : 'All'}
        </button>

        {/* Primary activity pills */}
        {PRIMARY_ACTIVITIES.map(id => {
          const activity = EXTENDED_ACTIVITIES[id];
          return (
            <button
              key={id}
              onClick={() => handleActivitySelect(id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                selectedActivity === id
                  ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                  : 'bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:border-gold-primary/20 hover:text-text-primary'
              }`}
            >
              {tl(activity.label, locale)}
            </button>
          );
        })}

        {/* "More" dropdown */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setShowMore(prev => !prev)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all flex items-center gap-0.5 ${
              selectedActivity && SECONDARY_ACTIVITIES.includes(selectedActivity as ExtendedActivityId)
                ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                : 'bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:border-gold-primary/20 hover:text-text-primary'
            }`}
          >
            {selectedActivity && SECONDARY_ACTIVITIES.includes(selectedActivity as ExtendedActivityId)
              ? tl(EXTENDED_ACTIVITIES[selectedActivity as ExtendedActivityId].label, locale)
              : (isHi ? 'और' : 'More')}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMore && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-[#1a1040] border border-gold-primary/20 rounded-lg shadow-xl py-1 min-w-[180px] max-h-[240px] overflow-y-auto">
              {SECONDARY_ACTIVITIES.map(id => {
                const activity = EXTENDED_ACTIVITIES[id];
                return (
                  <button
                    key={id}
                    onClick={() => handleActivitySelect(id)}
                    className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${
                      selectedActivity === id
                        ? 'bg-gold-primary/15 text-gold-light'
                        : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                    }`}
                  >
                    {tl(activity.label, locale)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Activity Note (when activity causes day-level blocks) ── */}
      {selectedActivity && verdict.slots.some(s =>
        s.conditionalBlocks.some(b => b.id === 'activity_nakshatra' || b.id === 'activity_tithi') ||
        s.hardBlocks.some(b => b.id === 'activity_nakshatra_hard')
      ) && (
        <div className="flex items-start gap-2 bg-amber-500/[0.06] rounded-lg px-3 py-2 border border-amber-500/10">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-400/80 text-[10px] leading-snug">
            {(() => {
              const notes: string[] = [];
              const firstSlot = verdict.slots[0];
              if (firstSlot) {
                const allBlocks = [...firstSlot.hardBlocks, ...firstSlot.conditionalBlocks];
                for (const b of allBlocks) {
                  if (b.id === 'activity_nakshatra_hard' || b.id === 'activity_nakshatra' || b.id === 'activity_tithi') {
                    notes.push(isHi ? b.nameHi : b.name);
                  }
                }
              }
              return notes.join(' · ');
            })()}
          </p>
        </div>
      )}

      {/* ── Best Window Callout ── */}
      {bestWindow && (
        <div className="border border-gold-primary/30 rounded-xl p-3 bg-gold-primary/[0.07] shadow-[0_0_20px_rgba(212,168,83,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-light/70" />
              <span className="text-gold-light font-mono text-sm">{fmt12(bestWindow.start)} – {fmt12(bestWindow.end)}</span>
              <span className="text-emerald-400/80 text-xs">
                {bestWindow.positives.map(p => isHi ? p.nameHi : p.name).join(' + ')}
              </span>
            </div>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: bestWindow.verdict === 'exceptional' ? 3 : bestWindow.verdict === 'excellent' ? 3 : bestWindow.verdict === 'very_good' ? 2 : 1 }, (_, i) => (
                <Star key={i} className="w-3 h-3 text-gold-primary fill-gold-primary" />
              ))}
            </span>
          </div>
          {/* Personal note in best window callout */}
          {personalMode && personalBalam && (
            <div className="mt-2 flex items-start gap-1.5 pt-2 border-t border-sky-500/10">
              <User className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
              <span className={`text-[10px] leading-snug ${
                personalBalam.tarabalam.favorable ? 'text-sky-300/80' : personalBalam.tarabalam.tara === 1 ? 'text-amber-400/80' : 'text-indigo-300/80'
              }`}>
                {tl(personalBalam.tarabalam.taraName, locale)} {isHi ? 'तारा' : 'Tara'}
                {' — '}
                {personalBalam.tarabalam.favorable
                  ? (isHi
                      ? (isToday ? 'व्यक्तिगत रूप से आज शुभ' : `व्यक्तिगत रूप से ${dateLabel} को शुभ`)
                      : (isToday ? 'personally auspicious today' : `personally auspicious on ${dateLabel}`))
                  : personalBalam.tarabalam.tara === 1
                    ? (isHi ? 'जन्म नक्षत्र दिवस — मिश्र' : 'birth star day — mixed')
                    : (isHi ? 'स्थगित करने पर विचार करें' : 'consider postponing')}
                {nextFavourableTara && (
                  <span className="text-sky-400/70 text-[10px] ml-1">
                    → {isHi ? 'अगला शुभ:' : 'Next favourable:'} {tl(nextFavourableTara.taraName, locale)} {isHi ? 'तारा' : 'Tara'}{nextFavourableTara.timeHint}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Three-Lane Timeline ── */}
      <div className="space-y-1.5">
        {/* Hour ticks + labels (shared axis) */}
        <div className="relative h-4">
          {hourTicks.map(m => (
            <span key={m} className="absolute text-[8px] text-text-secondary/50 font-mono -translate-x-1/2"
              style={{ left: `${pct(m)}%` }}>
              {fmtShort(m)}
            </span>
          ))}
        </div>

        {/* Lane container — relative so vertical markers span all 3 lanes */}
        <div className="relative space-y-1.5">

        {/* Lane 1: Inauspicious (red) */}
        <LaneBar
          windows={inauspicious}
          label="Inauspicious"
          labelHi="अशुभ काल"
          isHi={isHi}
          tlStart={tlStart}
          tlSpan={tlSpan}
          emptyColour="rgba(255,255,255,0.02)"
        />

        {/* Lane 2: Auspicious (green) */}
        <LaneBar
          windows={auspicious}
          label="Auspicious"
          labelHi="शुभ काल"
          isHi={isHi}
          tlStart={tlStart}
          tlSpan={tlSpan}
          emptyColour="rgba(255,255,255,0.02)"
        />

        {/* Lane 3: Net Verdict (synthesised) */}
        <div>
          <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 block">
            {isHi ? 'परिणाम' : 'Net Result'}
          </span>
          <div className="relative h-9 rounded-md bg-white/[0.02]">
            {slots.map((slot, i) => {
              const startMin = toMin(slot.start);
              const endMin = toMin(slot.end);
              const left = pct(startMin);
              const width = pct(endMin) - left;
              if (width <= 0) return null;
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{ left: `${left}%`, width: `${width}%`, backgroundColor: VERDICT_HEX[slot.verdict] }}
                  title={`${fmt12(slot.start)}–${fmt12(slot.end)}: ${VERDICT_LABEL[slot.verdict].en}`}
                />
              );
            })}
          </div>
        </div>

        {/* Lane 4: Personal Tarabala (when toggled ON) */}
        {personalMode && personalBalam && (
          <div>
            <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 block">
              {isHi ? 'व्यक्तिगत' : 'Personal'}
            </span>
            <div className="relative h-7 rounded-md" style={{
              backgroundColor: personalBalam.tarabalam.favorable
                ? '#0ea5e9' // blue-green for favourable
                : personalBalam.tarabalam.tara === 1
                  ? '#d97706' // amber for Janma
                  : '#6366f1' // indigo for unfavourable
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white/90 truncate px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {tl(personalBalam.tarabalam.taraName, locale)} {isHi ? 'तारा' : 'Tara'}
                  {' — '}
                  {personalBalam.tarabalam.favorable
                    ? (isHi ? 'शुभ' : 'favourable')
                    : personalBalam.tarabalam.tara === 1
                      ? (isHi ? 'जन्म तारा' : 'birth star day')
                      : (isHi ? 'सावधान' : 'exercise caution')}
                  {personalCycle && personalCycle > 1 && (
                    <> · {personalCycle === 2 ? (isHi ? 'मध्यम' : 'moderate') : (isHi ? 'न्यून' : 'reduced')}</>
                  )}
                  {nextFavourableTara && !personalBalam.tarabalam.favorable && (
                    <> · {isHi ? 'अगला:' : 'next:'} {tl(nextFavourableTara.taraName, locale)}{nextFavourableTara.timeHint}</>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Vertical markers overlaid on ALL lanes ── */}
        {/* These are positioned relative to the lane container */}

        {/* Sunrise */}
        <div className="absolute pointer-events-none z-10" style={{ left: `${pct(sunriseMin)}%`, top: 0, bottom: 0 }}>
          <div className="w-px h-full" style={{ backgroundColor: '#fbbf24' }} />
          <Sunrise className="absolute -top-1 -translate-x-1/2 w-4 h-4 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" style={{ color: '#fbbf24', left: '0.5px' }} />
        </div>

        {/* Sunset */}
        <div className="absolute pointer-events-none z-10" style={{ left: `${pct(sunsetMin)}%`, top: 0, bottom: 0 }}>
          <div className="w-px h-full" style={{ backgroundColor: '#fb923c' }} />
          <Sunset className="absolute -top-1 -translate-x-1/2 w-4 h-4 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]" style={{ color: '#fb923c', left: '0.5px' }} />
        </div>

        {/* Moonrise */}
        {moonriseMin !== null && moonriseMin >= tlStart && moonriseMin <= tlEnd && (
          <div className="absolute pointer-events-none z-10" style={{ left: `${pct(moonriseMin)}%`, top: 0, bottom: 0 }}>
            <div className="w-px h-full" style={{ backgroundColor: 'rgba(147,197,253,0.4)' }} />
            <Moon className="absolute -top-1 -translate-x-1/2 w-3.5 h-3.5" style={{ color: '#93c5fd', left: '0.5px' }} />
          </div>
        )}

        {/* Moonset */}
        {moonsetMin !== null && moonsetMin >= tlStart && moonsetMin <= tlEnd && (
          <div className="absolute pointer-events-none z-10" style={{ left: `${pct(moonsetMin)}%`, top: 0, bottom: 0 }}>
            <div className="w-px h-full" style={{ backgroundColor: 'rgba(96,165,250,0.2)' }} />
            <Moon className="absolute -top-1 -translate-x-1/2 w-3 h-3 opacity-40" style={{ color: '#60a5fa', left: '0.5px' }} />
          </div>
        )}

        {/* NOW marker — only render when viewing TODAY. The "now"
            position is meaningless on a historical / future date and
            confuses users who picked a different date from the picker. */}
        {isToday && nowInRange && (
          <div className="absolute pointer-events-none z-20" style={{ left: `${nowPct}%`, top: 0, bottom: 0 }}>
            <div className="w-0.5 h-full shadow-[0_0_12px_rgba(212,168,83,1)]" style={{ backgroundColor: '#d4a853' }} />
            <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,168,83,0.7)]"
              style={{ backgroundColor: '#f0d48a', color: '#0a0e27', left: '0.5px' }}>
              NOW
            </span>
          </div>
        )}

        </div>{/* end lane container */}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#991b1b' }} /> {isHi ? 'वर्जित' : 'Avoid'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#92400e' }} /> {isHi ? 'सावधान' : 'Caution'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#065f46' }} /> {isHi ? 'शुभ' : 'Good'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#d4a853' }} /> {isHi ? 'उत्तम' : 'Excellent'}
          </span>
          {personalMode && (
            <>
              <span className="flex items-center gap-1 text-[9px] text-text-secondary">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#0ea5e9' }} /> {isHi ? 'व्यक्तिगत शुभ' : 'Personal +'}
              </span>
              <span className="flex items-center gap-1 text-[9px] text-text-secondary">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#6366f1' }} /> {isHi ? 'व्यक्तिगत सावधान' : 'Personal −'}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sunrise className="w-3 h-3" style={{ color: '#fbbf24' }} />
          <span className="text-[9px] text-text-secondary">{fmt12(panchang.sunrise)}</span>
          <Sunset className="w-3 h-3" style={{ color: '#fb923c' }} />
          <span className="text-[9px] text-text-secondary">{fmt12(panchang.sunset)}</span>
        </div>
      </div>

      {/* ── Conflict callout (when inauspicious overrides auspicious) ── */}
      {slots.some(s => s.hardBlocks.length > 0 && s.positives.length > 0) && (
        <div className="flex items-start gap-2 bg-red-500/[0.06] rounded-lg px-3 py-2 border border-red-500/10">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400/70 text-[10px] leading-snug">
            {isHi
              ? 'विषमिश्रित मधु भी व्यर्थ है — कठोर दोष के समय शुभ योग भी समय को शुद्ध नहीं कर सकता। केवल अभिजित मुहूर्त में दोष-निवारण शक्ति है।'
              : 'Even honey is useless if poisoned — an auspicious yoga during a hard dosha cannot purify the time. Only Abhijit Muhurta claims dosha-override power (Muhurta Chintamani).'}
          </p>
        </div>
      )}
    </div>
  );
}
