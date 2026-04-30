'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, AlertTriangle, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import { usePrakritiStore } from '@/stores/prakriti-store';
import { generateDailyProtocol } from '@/lib/dinacharya/protocol-engine';
import type { VoiceMode, DailyProtocol, HoraSlot, EnergyPhase, DeadZone } from '@/lib/dinacharya/protocol-engine';
import { PRAKRITI_QUESTIONS, scorePrakriti } from '@/lib/dinacharya/prakriti-quiz';
import type { Dosha } from '@/lib/dinacharya/prakriti-quiz';
import { tl } from '@/lib/utils/trilingual';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import DayTimeline from '@/components/panchang/DayTimeline';
import type { PanchangData, HoraSlot as PanchangHoraSlot } from '@/types/panchang';

// ── Moon phase SVG icons (replacing emoji) ──
// Each returns a small SVG node; index matches the 8 canonical phases
const MOON_PHASE_SVGS: React.ReactNode[] = [
  // 0: new moon
  <svg key="new" width="20" height="20" viewBox="0 0 20 20" aria-label="New Moon"><circle cx="10" cy="10" r="8" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1.5" /></svg>,
  // 1: waxing crescent
  <svg key="wax-cres" width="20" height="20" viewBox="0 0 20 20" aria-label="Waxing Crescent"><circle cx="10" cy="10" r="8" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 1 0 16A5 5 0 0 0 10 2z" fill="#f0d48a" /></svg>,
  // 2: first quarter
  <svg key="first-q" width="20" height="20" viewBox="0 0 20 20" aria-label="First Quarter"><circle cx="10" cy="10" r="8" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 1 0 16V2z" fill="#f0d48a" /></svg>,
  // 3: waxing gibbous
  <svg key="wax-gib" width="20" height="20" viewBox="0 0 20 20" aria-label="Waxing Gibbous"><circle cx="10" cy="10" r="8" fill="#f0d48a" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 0 0 16A5 5 0 0 1 10 2z" fill="#1a1040" /></svg>,
  // 4: full moon
  <svg key="full" width="20" height="20" viewBox="0 0 20 20" aria-label="Full Moon"><circle cx="10" cy="10" r="8" fill="#f0d48a" /></svg>,
  // 5: waning gibbous
  <svg key="wan-gib" width="20" height="20" viewBox="0 0 20 20" aria-label="Waning Gibbous"><circle cx="10" cy="10" r="8" fill="#f0d48a" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 1 0 16A5 5 0 0 0 10 2z" fill="#1a1040" /></svg>,
  // 6: last quarter
  <svg key="last-q" width="20" height="20" viewBox="0 0 20 20" aria-label="Last Quarter"><circle cx="10" cy="10" r="8" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 0 0 16V2z" fill="#f0d48a" /></svg>,
  // 7: waning crescent
  <svg key="wan-cres" width="20" height="20" viewBox="0 0 20 20" aria-label="Waning Crescent"><circle cx="10" cy="10" r="8" fill="#1a1040" stroke="#8a6d2b" strokeWidth="1" /><path d="M10 2a8 8 0 0 0 0 16A5 5 0 0 1 10 2z" fill="#f0d48a" /></svg>,
];

function getMoonPhaseIcon(tithiNumber: number): React.ReactNode {
  // Map tithi 1-30 to 8 phase SVGs
  if (tithiNumber <= 2) return MOON_PHASE_SVGS[1];
  if (tithiNumber <= 7) return MOON_PHASE_SVGS[2];
  if (tithiNumber <= 10) return MOON_PHASE_SVGS[3];
  if (tithiNumber <= 15) return MOON_PHASE_SVGS[4]; // full at 15
  if (tithiNumber <= 17) return MOON_PHASE_SVGS[5];
  if (tithiNumber <= 22) return MOON_PHASE_SVGS[6];
  if (tithiNumber <= 25) return MOON_PHASE_SVGS[7];
  return MOON_PHASE_SVGS[0]; // new moon approaching
}

// ── Energy phase dosha colors ──
const DOSHA_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Kapha Kala': { bg: 'bg-teal-500/15', border: 'border-teal-500/30', text: 'text-teal-400' },
  'Grounding Phase': { bg: 'bg-teal-500/15', border: 'border-teal-500/30', text: 'text-teal-400' },
  'Pitta Kala': { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400' },
  'Peak Performance': { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400' },
  'Vata Kala': { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400' },
  'Creative Phase': { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400' },
  'Sayam Kapha': { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400/70' },
  'Wind-Down Phase': { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400/70' },
};

function getDoshaColor(label: string) {
  return DOSHA_COLORS[label] ?? { bg: 'bg-white/[0.06]', border: 'border-white/10', text: 'text-[#e6e2d8]' };
}

// ── Current time helpers ──
function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function isInTimeRange(startTime: string, endTime: string): boolean {
  const now = currentMinutes();
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  // Handle midnight wrapping (lesson R)
  if (end < start) return now >= start || now < end;
  return now >= start && now < end;
}

function isPastTimeRange(endTime: string): boolean {
  const now = currentMinutes();
  const end = parseTimeToMinutes(endTime);
  // Midnight-crossing: if end is early morning (before 6 AM) and now is evening (after 6 PM),
  // the slot crosses midnight and is NOT past yet (lesson R)
  if (end < 360 && now > 1080) return false;
  return now >= end;
}

// ── Agni visualization ──
function FlameSVG({ dim }: { dim?: boolean }) {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden="true"
      className={dim ? 'opacity-20' : 'opacity-100'}
    >
      <path
        d="M8 0C8 0 3 5 3 10a5 5 0 0 0 10 0C13 6.5 10 4 10 4S9.5 7 8 8C6.5 9 5 8 5 6.5 5 4.5 8 0 8 0Z"
        fill="#d4a853"
      />
      <path
        d="M8 10c0 0-2 1-2 3a2 2 0 0 0 4 0C10 11.5 8 10 8 10Z"
        fill="#f0d48a"
      />
    </svg>
  );
}

function AgniLevel({ level }: { level: 'strong' | 'moderate' | 'low' }) {
  const count = level === 'strong' ? 3 : level === 'moderate' ? 2 : 1;
  return (
    <span className="inline-flex gap-0.5 items-end">
      {Array.from({ length: 3 }, (_, i) => (
        <FlameSVG key={i} dim={i >= count} />
      ))}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════════

export default function DinacharyaPage() {
  const locale = useLocale();
  const locationStore = useLocationStore();
  const prakritiStore = usePrakritiStore();

  const [voice, setVoice] = useState<VoiceMode>('modern');
  const [protocol, setProtocol] = useState<DailyProtocol | null>(null);
  const [rawPanchang, setRawPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, Dosha>>({});

  // Fetch panchang and generate protocol
  const fetchAndGenerate = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const ianaTimezone =
          typeof window !== 'undefined'
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : 'UTC';

        const res = await fetch(
          `/api/panchang?year=${year}&month=${month}&day=${day}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(ianaTimezone)}`
        );
        if (!res.ok) {
          throw new Error(`Panchang API error: ${res.status}`);
        }
        const panchang: PanchangData = await res.json();
        setRawPanchang(panchang);

        // Transform panchang hora slots to protocol engine format
        const nowMinutes = currentMinutes();
        const horaSlots = (panchang.hora ?? []).map((h: PanchangHoraSlot) => ({
          planetId: h.planetId,
          startTime: h.startTime,
          endTime: h.endTime,
          isCurrent: isInTimeRange(h.startTime, h.endTime),
        }));

        // Collect varjyam windows (API may return single or array)
        const varjyamWindows: { start: string; end: string }[] = [];
        if (panchang.varjyamAll && panchang.varjyamAll.length > 0) {
          varjyamWindows.push(...panchang.varjyamAll);
        } else if (panchang.varjyam) {
          varjyamWindows.push(panchang.varjyam);
        }

        const result = generateDailyProtocol({
          tithi: {
            number: panchang.tithi.number,
            name: tl(panchang.tithi.name, locale),
          },
          nakshatra: {
            number: panchang.nakshatra.id,
            name: tl(panchang.nakshatra.name, locale),
          },
          sunrise: panchang.sunrise,
          sunset: panchang.sunset,
          moonLongitude: panchang.moonLongitude,
          sunLongitude: panchang.sunLongitude,
          horaSlots,
          rahuKaal: panchang.rahuKaal,
          yamaganda: panchang.yamaganda,
          varjyam: varjyamWindows,
          prakriti: prakritiStore.profile,
        });

        setProtocol(result);
      } catch (err) {
        console.error('[dinacharya] Failed to fetch panchang data:', err);
        setError('Failed to load daily protocol. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [locale, prakritiStore.profile]
  );

  // Trigger location detection and data fetch
  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
    // Timeout: if location not confirmed after 10s, stop loading to avoid infinite spinner
    // (e.g. user denies geolocation permission)
    const timer = setTimeout(() => {
      if (!locationStore.confirmed) {
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [locationStore.confirmed, locationStore.detecting]);

  useEffect(() => {
    if (
      locationStore.confirmed &&
      locationStore.lat !== null &&
      locationStore.lng !== null
    ) {
      fetchAndGenerate(locationStore.lat, locationStore.lng);
    }
  }, [locationStore.confirmed, locationStore.lat, locationStore.lng, fetchAndGenerate]);

  // Prakriti quiz submission handler
  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length < PRAKRITI_QUESTIONS.length) return;
    const profile = scorePrakriti(quizAnswers);
    prakritiStore.setProfile(profile);
    prakritiStore.setAnswers(quizAnswers);
    setShowQuiz(false);
    // Protocol will regenerate via the fetchAndGenerate dependency on prakritiStore.profile
    if (locationStore.lat !== null && locationStore.lng !== null) {
      fetchAndGenerate(locationStore.lat, locationStore.lng);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#d4a853] animate-spin mx-auto mb-3" />
          <p className="text-[#8a8478] text-sm">
            Calculating your daily protocol...
          </p>
        </div>
      </div>
    );
  }

  // ── Location not available (e.g. geolocation denied) ──
  if (!loading && !protocol && !error && locationStore.lat === null) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 max-w-md text-center">
          <Compass className="w-8 h-8 text-gold-primary mx-auto mb-3" />
          <p className="text-[#e6e2d8] mb-2">Location Required</p>
          <p className="text-[#8a8478] text-sm mb-4">
            Please enable location access or set your location to use Dinacharya.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              locationStore.detect();
              // Reset timeout
              setTimeout(() => {
                if (!locationStore.confirmed) setLoading(false);
              }, 10000);
            }}
            className="px-4 py-2 rounded-lg bg-[#d4a853]/20 text-[#f0d48a] text-sm hover:bg-[#d4a853]/30 transition-colors"
          >
            Retry Location Detection
          </button>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20 rounded-2xl p-6 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-[#e6e2d8] mb-2">{error || 'Unable to generate protocol'}</p>
          <button
            onClick={() => {
              if (locationStore.lat !== null && locationStore.lng !== null) {
                fetchAndGenerate(locationStore.lat, locationStore.lng);
              }
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-[#d4a853]/20 text-[#f0d48a] text-sm hover:bg-[#d4a853]/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ── Page Header ── */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-[Cinzel] text-2xl md:text-3xl text-[#f0d48a]">
              {voice === 'traditional' ? 'Dinacharya' : 'Daily Protocol'}
            </h1>
            <VoiceToggle voice={voice} setVoice={setVoice} />
          </div>
          <p className="text-[#8a8478] text-sm">
            {dateStr} &middot; {protocol.tithi.name} &middot;{' '}
            {protocol.nakshatra.name}
          </p>
          {locationStore.name && (
            <p className="text-[#8a8478]/60 text-xs mt-1">{locationStore.name}</p>
          )}
        </header>

        {/* ── Moon Phase Banner ── */}
        <MoonPhaseBanner protocol={protocol} voice={voice} />

        {/* ── Energy Timeline ── */}
        <SectionCard
          title={voice === 'traditional' ? 'Dosha Kala' : 'Energy Timeline'}
          accent="teal"
        >
          <EnergyTimeline phases={protocol.energyPhases} voice={voice} />
        </SectionCard>

        {/* ── Day Timeline — auspicious/inauspicious windows ── */}
        {rawPanchang && (
          <SectionCard
            title={voice === 'traditional' ? 'Shubha-Ashubha Kala' : 'Sacred Timings'}
            accent="gold"
          >
            <DayTimeline
              panchang={rawPanchang}
              sunrise={rawPanchang.sunrise}
              sunset={rawPanchang.sunset}
              locale={locale}
            />
          </SectionCard>
        )}

        {/* ── Hora Schedule ── */}
        <SectionCard
          title={voice === 'traditional' ? 'Hora Chakra' : 'Hora Schedule'}
          accent="amber"
        >
          <HoraGrid slots={protocol.horaSchedule} voice={voice} />
        </SectionCard>

        {/* ── Nutrition Window ── */}
        <SectionCard
          title={
            voice === 'traditional' ? 'Ahara Vidhi' : 'Nutrition Window'
          }
          accent="orange"
        >
          <NutritionCard nutrition={protocol.nutrition} voice={voice} />
        </SectionCard>

        {/* ── Practice Focus ── */}
        <SectionCard
          title={
            voice === 'traditional'
              ? 'Karma Nirdesh'
              : 'Practice Focus'
          }
          accent="purple"
        >
          <PracticeFocus practice={protocol.practice} voice={voice} />
        </SectionCard>

        {/* ── Dead Zones ── */}
        {protocol.deadZones.length > 0 && (
          <SectionCard
            title={
              voice === 'traditional' ? 'Ashubha Kala' : 'Dead Zones'
            }
            accent="red"
          >
            <DeadZoneList zones={protocol.deadZones} voice={voice} />
          </SectionCard>
        )}

        {/* ── Prakriti Section ── */}
        <SectionCard
          title={
            voice === 'traditional'
              ? 'Prakriti Pariksha'
              : 'Your Constitution'
          }
          accent="gold"
        >
          <PrakritiSection
            profile={prakritiStore.profile}
            advice={protocol.prakritiAdvice}
            voice={voice}
            showQuiz={showQuiz}
            setShowQuiz={setShowQuiz}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
            onSubmitQuiz={handleQuizSubmit}
            locale={locale}
          />
        </SectionCard>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/dinacharya')} locale={locale} className="mt-8" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Sub-components
// ══════════════════════════════════════════════════════════════════

function VoiceToggle({
  voice,
  setVoice,
}: {
  voice: VoiceMode;
  setVoice: (v: VoiceMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setVoice('traditional')}
        className={`px-4 py-1.5 rounded-full text-xs transition-all ${
          voice === 'traditional'
            ? 'bg-[#d4a853]/20 text-[#f0d48a] border border-[#d4a853]/40'
            : 'text-[#8a8478] border border-white/[0.06] hover:border-[#d4a853]/20'
        }`}
      >
        Om Traditional
      </button>
      <button
        onClick={() => setVoice('modern')}
        className={`px-4 py-1.5 rounded-full text-xs transition-all ${
          voice === 'modern'
            ? 'bg-[#d4a853]/20 text-[#f0d48a] border border-[#d4a853]/40'
            : 'text-[#8a8478] border border-white/[0.06] hover:border-[#d4a853]/20'
        }`}
      >
        Modern
      </button>
    </div>
  );
}

const SECTION_ACCENT_CLASSES: Record<string, { border: string; fromClass: string }> = {
  teal:   { border: 'border-l-4 border-l-teal-500/40',   fromClass: 'from-teal-900/10' },
  gold:   { border: 'border-l-4 border-l-gold-primary/40', fromClass: 'from-[#2d1b69]/40' },
  amber:  { border: 'border-l-4 border-l-amber-500/40',  fromClass: 'from-amber-900/10' },
  orange: { border: 'border-l-4 border-l-orange-500/40', fromClass: 'from-orange-900/10' },
  purple: { border: 'border-l-4 border-l-purple-500/40', fromClass: 'from-purple-900/10' },
  red:    { border: 'border-l-4 border-l-red-500/40',    fromClass: 'from-red-900/10' },
};

function SectionCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: keyof typeof SECTION_ACCENT_CLASSES;
}) {
  const accentClasses = accent ? SECTION_ACCENT_CLASSES[accent] : null;
  const fromClass = accentClasses ? accentClasses.fromClass : 'from-[#2d1b69]/40';
  const borderAccent = accentClasses ? accentClasses.border : '';
  return (
    <section className="mb-5">
      <h2 className="font-[Cinzel] text-base text-[#f0d48a] mb-3">{title}</h2>
      <div className={`bg-gradient-to-br ${fromClass} via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 hover:border-gold-primary/40 transition-all ${borderAccent}`}>
        {children}
      </div>
    </section>
  );
}

// ── Moon Phase Banner ──
function MoonPhaseBanner({
  protocol,
  voice,
}: {
  protocol: DailyProtocol;
  voice: VoiceMode;
}) {
  const icon = getMoonPhaseIcon(protocol.tithi.number);
  const isWaxing = protocol.tithi.number <= 15;
  const dayOfCycle = protocol.tithi.number;
  const percentLabel = isWaxing
    ? `${protocol.moonPhasePercent}% waxing`
    : `${protocol.moonPhasePercent}% waning`;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 mb-5 flex items-center gap-4 hover:border-gold-primary/40 transition-all">
      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center [&_svg]:w-9 [&_svg]:h-9">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[#e6e2d8] text-sm">
          {voice === 'traditional'
            ? `${protocol.tithi.paksha} ${protocol.tithi.name.split(' ').pop() ?? protocol.tithi.name}`
            : `Day ${dayOfCycle} of lunar cycle (${percentLabel})`}
        </p>
        <p className="text-[#8a8478] text-xs mt-1">
          {protocol.moonPhaseLabel[voice]}
        </p>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#d4a853]/50 transition-all"
            style={{ width: `${protocol.moonPhasePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Energy Timeline (vertical, with "YOU ARE HERE" needle) ──
function EnergyTimeline({
  phases,
  voice,
}: {
  phases: EnergyPhase[];
  voice: VoiceMode;
}) {
  // Current time in minutes since midnight — recalculated client-side
  const nowMins = currentMinutes();
  const nowHour = Math.floor(nowMins / 60);
  const nowMin = nowMins % 60;
  // "HH:MM" for display
  const nowLabel = `${String(nowHour).padStart(2, '0')}:${String(nowMin).padStart(2, '0')}`;

  // Height of the full 24-hour column (px) — same on all breakpoints via inline style
  const TOTAL_HEIGHT = 960; // px; 40px per hour, readable on all screen sizes

  // Convert "HH:MM" → minutes since midnight
  function toMins(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  // Position helpers: fraction of TOTAL_HEIGHT
  function topPx(mins: number): number {
    return (mins / 1440) * TOTAL_HEIGHT;
  }
  function heightPx(startMins: number, endMins: number): number {
    // Handle midnight-crossing phases
    const duration = endMins > startMins ? endMins - startMins : 1440 - startMins + endMins;
    return (duration / 1440) * TOTAL_HEIGHT;
  }

  // Hour tick marks every 3 hours
  const HOUR_TICKS = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <div className="overflow-y-auto max-h-[500px] sm:max-h-none rounded-xl">
    <div className="relative select-none" style={{ height: `${TOTAL_HEIGHT}px` }}>
      {/* ── Vertical axis line ── */}
      <div
        className="absolute w-px bg-gold-primary/15"
        style={{ left: '44px', top: 0, bottom: 0 }}
      />

      {/* ── Hour tick marks ── */}
      {HOUR_TICKS.map((hour) => {
        const yPx = topPx(hour * 60);
        return (
          <div
            key={hour}
            className="absolute flex items-center"
            style={{ top: `${yPx}px`, left: 0, right: 0 }}
          >
            {/* Label */}
            <span
              className="text-[10px] font-mono text-text-secondary w-10 text-right pr-2 leading-none"
              style={{ marginTop: '-0.4em' }}
            >
              {String(hour).padStart(2, '0')}:00
            </span>
            {/* Tick line across the full width */}
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>
        );
      })}

      {/* ── Phase blocks ── */}
      {phases.map((phase, i) => {
        const isCurrent = isInTimeRange(phase.startTime, phase.endTime);
        const label = phase.label[voice];
        const altLabel = phase.label[voice === 'traditional' ? 'modern' : 'traditional'];
        const colors = getDoshaColor(label);
        const startMins = toMins(phase.startTime);
        const endMins = toMins(phase.endTime);
        const phaseTop = topPx(startMins);
        const phaseHeight = heightPx(startMins, endMins);

        // Left border color matches dosha
        const borderLeftClass = colors.border.replace('border-', 'border-l-');

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: '52px',
              right: 0,
              top: `${phaseTop}px`,
              height: `${phaseHeight}px`,
              paddingBottom: '3px',
            }}
          >
            <div
              className={`h-full rounded-xl px-3 py-2 border-l-4 transition-all ${colors.bg} ${borderLeftClass} ${
                isCurrent
                  ? 'ring-1 ring-gold-primary/40'
                  : 'opacity-70'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span
                    className={`text-sm font-semibold leading-tight block ${
                      isCurrent ? colors.text : 'text-[#e6e2d8]/70'
                    }`}
                  >
                    {label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] bg-gold-primary/20 text-gold-light px-1.5 py-0.5 rounded-full align-middle">
                        YOU ARE HERE
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-text-secondary block leading-tight mt-0.5">
                    {altLabel}
                  </span>
                </div>
                <span className="text-[11px] text-gold-light/70 font-mono whitespace-nowrap flex-shrink-0 mt-0.5">
                  {phase.startTime}–{phase.endTime}
                </span>
              </div>

              {/* Description — only show if the block is tall enough (≥ 70px) */}
              {phaseHeight >= 70 && (
                <p className="text-[#8a8478] text-[11px] leading-relaxed mt-1 line-clamp-2">
                  {phase.description[voice]}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Current-time needle ── */}
      <div
        className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
        style={{ top: `${topPx(nowMins)}px` }}
        suppressHydrationWarning
      >
        {/* Dot on the axis */}
        <div className="w-3 h-3 rounded-full bg-gold-primary animate-pulse flex-shrink-0 ml-[38px]" />
        {/* Horizontal line */}
        <div className="flex-1 h-[1.5px] bg-gold-primary/60" />
        {/* Time label */}
        <span
          className="text-[10px] font-mono text-gold-light bg-[#0a0e27]/80 px-1.5 rounded ml-1 flex-shrink-0"
          suppressHydrationWarning
        >
          {nowLabel}
        </span>
      </div>
    </div>
    </div>
  );
}

// ── Hora Grid ──
function HoraGrid({
  slots,
  voice,
}: {
  slots: HoraSlot[];
  voice: VoiceMode;
}) {
  // Show only remaining + current slots (skip fully past ones)
  const visibleSlots = slots.filter(
    (s) => s.isCurrent || !isPastTimeRange(s.endTime)
  );

  if (visibleSlots.length === 0) {
    return (
      <p className="text-[#8a8478] text-sm text-center py-4">
        All hora slots for today have passed.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {visibleSlots.map((slot, i) => (
        <div
          key={i}
          className={`rounded-lg p-3 flex items-start gap-3 transition-all ${
            slot.isCurrent
              ? 'bg-[#d4a853]/5 border border-[#d4a853]/40'
              : 'bg-[#161b42] border border-transparent'
          }`}
        >
          <span className="leading-none mt-0.5 flex-shrink-0">
            {slot.planetId >= 0 && slot.planetId <= 6
              ? <GrahaIconById id={slot.planetId} size={18} />
              : <span className="text-xl">?</span>}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  slot.isCurrent ? 'text-[#f0d48a]' : 'text-[#e6e2d8]/80'
                }`}
              >
                {slot.planetName}
                {slot.isCurrent && (
                  <span className="ml-2 text-[10px] bg-[#d4a853]/20 text-[#f0d48a] px-1.5 py-0.5 rounded-full">
                    NOW
                  </span>
                )}
              </span>
              <span className="text-[#8a8478] text-xs">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <p className="text-[#8a8478] text-xs mt-1">
              {slot.activity[voice]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Nutrition Card ──
function NutritionCard({
  nutrition,
  voice,
}: {
  nutrition: DailyProtocol['nutrition'];
  voice: VoiceMode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#e6e2d8] text-sm">
            {voice === 'traditional' ? 'Ahara Kala' : 'Eating Window'}
          </p>
          <p className="text-[#f0d48a] text-lg font-medium">
            {nutrition.eatingWindow.start} - {nutrition.eatingWindow.end}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#e6e2d8] text-sm">
            {voice === 'traditional' ? 'Agni' : 'Metabolism'}
          </p>
          <AgniLevel level={nutrition.agniLevel} />
        </div>
      </div>
      <div className="bg-[#161b42] rounded-lg p-3">
        <p className="text-[#8a8478] text-xs mb-1">
          {voice === 'traditional' ? 'Madhyahna Bhojana' : 'Best meal time'}:{' '}
          <span className="text-[#e6e2d8]">{nutrition.bestMealTime}</span>
        </p>
        <p className="text-[#8a8478] text-xs leading-relaxed">
          {nutrition.advice[voice]}
        </p>
      </div>
    </div>
  );
}

// ── Practice Focus ──
function PracticeFocus({
  practice,
  voice,
}: {
  practice: DailyProtocol['practice'];
  voice: VoiceMode;
}) {
  const typeLabels: Record<string, string> = {
    fixed: 'Dhruva (Fixed)',
    movable: 'Chara (Movable)',
    sharp: 'Tikshna (Sharp)',
    soft: 'Mridu (Soft)',
    mixed: 'Mishra (Mixed)',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs bg-[#d4a853]/15 text-[#f0d48a] px-2 py-0.5 rounded-full">
          {typeLabels[practice.nakshatraActivity] ?? practice.nakshatraActivity}
        </span>
      </div>
      <div className="bg-[#161b42] rounded-lg p-3">
        <p className="text-[#e6e2d8] text-sm mb-1">
          {voice === 'traditional' ? 'Focus' : 'Best for'}
        </p>
        <p className="text-[#8a8478] text-xs leading-relaxed">
          {practice.focus[voice]}
        </p>
      </div>
      <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
        <p className="text-red-400/80 text-sm mb-1">
          {voice === 'traditional' ? 'Varjya' : 'Avoid'}
        </p>
        <p className="text-[#8a8478] text-xs leading-relaxed">
          {practice.avoid[voice]}
        </p>
      </div>
    </div>
  );
}

// ── Dead Zones ──
function DeadZoneList({
  zones,
  voice,
}: {
  zones: DeadZone[];
  voice: VoiceMode;
}) {
  return (
    <div className="space-y-2">
      {zones.map((zone, i) => {
        const isActive = isInTimeRange(zone.startTime, zone.endTime);
        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg p-3 ${
              isActive
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-[#161b42]'
            }`}
          >
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                isActive
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {zone.name}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[#e6e2d8] text-sm">
                {zone.startTime} - {zone.endTime}
                {isActive && (
                  <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                )}
              </p>
              <p className="text-[#8a8478] text-xs mt-0.5">
                {zone.advice[voice]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Prakriti Section ──
function PrakritiSection({
  profile,
  advice,
  voice,
  showQuiz,
  setShowQuiz,
  quizAnswers,
  setQuizAnswers,
  onSubmitQuiz,
  locale,
}: {
  profile: ReturnType<typeof usePrakritiStore.getState>['profile'];
  advice: DailyProtocol['prakritiAdvice'];
  voice: VoiceMode;
  showQuiz: boolean;
  setShowQuiz: (v: boolean) => void;
  quizAnswers: Record<string, Dosha>;
  setQuizAnswers: (a: Record<string, Dosha>) => void;
  onSubmitQuiz: () => void;
  locale: string;
}) {
  // If profile exists, show advice
  if (profile && advice) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[#e6e2d8] text-sm">
            {voice === 'traditional' ? 'Prakriti' : 'Your Constitution'}:{' '}
            <span className="text-[#f0d48a] font-medium">{profile.label}</span>
          </p>
          <button
            onClick={() => {
              usePrakritiStore.getState().clear();
              setShowQuiz(false);
            }}
            className="text-[#8a8478] text-xs hover:text-[#e6e2d8] transition-colors"
          >
            Retake quiz
          </button>
        </div>
        <div className="bg-[#161b42] rounded-lg p-3">
          <p className="text-[#8a8478] text-xs leading-relaxed">
            {advice[voice]}
          </p>
        </div>
        {/* Dosha score bars */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {(['vata', 'pitta', 'kapha'] as const).map((d) => {
            const pct = Math.round((profile.scores[d] / PRAKRITI_QUESTIONS.length) * 100);
            return (
              <div key={d} className="bg-[#161b42] rounded-lg p-2">
                <p className="text-[#8a8478] text-[10px] uppercase tracking-wider mb-1">
                  {d}
                </p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#d4a853]/50"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[#e6e2d8] text-xs mt-1">{profile.scores[d]}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz prompt or quiz inline
  if (!showQuiz) {
    return (
      <button
        onClick={() => setShowQuiz(true)}
        className="w-full text-left bg-[#161b42] hover:bg-[#1c2250] rounded-lg p-4 transition-colors group"
      >
        <p className="text-[#e6e2d8] text-sm group-hover:text-[#f0d48a] transition-colors">
          {voice === 'traditional'
            ? 'Take the Prakriti Pariksha for personalized daily guidance'
            : 'Take the 1-minute body-type quiz for personalized recommendations'}
        </p>
        <p className="text-[#8a8478] text-xs mt-1">
          5 questions &middot; determines your Vata/Pitta/Kapha balance
        </p>
      </button>
    );
  }

  // Inline quiz
  // Map all Devanagari-script locales to Hindi quiz text, others to English
  const langKey = ['hi', 'sa', 'mr', 'gu', 'mai'].includes(locale) ? 'hi' : 'en';
  const allAnswered = Object.keys(quizAnswers).length >= PRAKRITI_QUESTIONS.length;

  return (
    <div className="space-y-4">
      {PRAKRITI_QUESTIONS.map((q, qi) => (
        <div key={q.id}>
          <p className="text-[#e6e2d8] text-sm mb-2">
            {qi + 1}. {q.question[langKey]}
          </p>
          <div className="space-y-1.5">
            {q.options.map((opt) => {
              const selected = quizAnswers[q.id] === opt.dosha;
              return (
                <button
                  key={opt.dosha}
                  onClick={() =>
                    setQuizAnswers({ ...quizAnswers, [q.id]: opt.dosha })
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    selected
                      ? 'bg-[#d4a853]/15 text-[#f0d48a] border border-[#d4a853]/30'
                      : 'bg-[#161b42] text-[#8a8478] border border-transparent hover:border-white/10'
                  }`}
                >
                  {opt.label[langKey]}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setShowQuiz(false)}
          className="px-4 py-2 rounded-lg text-xs text-[#8a8478] border border-white/[0.06] hover:border-[#d4a853]/20 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmitQuiz}
          disabled={!allAnswered}
          className={`px-4 py-2 rounded-lg text-xs transition-all ${
            allAnswered
              ? 'bg-[#d4a853]/20 text-[#f0d48a] border border-[#d4a853]/40 hover:bg-[#d4a853]/30'
              : 'bg-white/[0.06] text-[#8a8478]/50 border border-white/[0.04] cursor-not-allowed'
          }`}
        >
          See my protocol
        </button>
      </div>
    </div>
  );
}
