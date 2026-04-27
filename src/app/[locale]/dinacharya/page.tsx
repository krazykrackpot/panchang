'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import { usePrakritiStore } from '@/stores/prakriti-store';
import { generateDailyProtocol } from '@/lib/dinacharya/protocol-engine';
import type { VoiceMode, DailyProtocol, HoraSlot, EnergyPhase, DeadZone } from '@/lib/dinacharya/protocol-engine';
import { PRAKRITI_QUESTIONS, scorePrakriti } from '@/lib/dinacharya/prakriti-quiz';
import type { Dosha } from '@/lib/dinacharya/prakriti-quiz';
import { tl } from '@/lib/utils/trilingual';
import type { PanchangData, HoraSlot as PanchangHoraSlot } from '@/types/panchang';

// ── Planet symbols for hora display ──
const PLANET_SYMBOLS: Record<number, string> = {
  0: '\u2609', // Sun
  1: '\u263D', // Moon
  2: '\u2642', // Mars
  3: '\u263F', // Mercury
  4: '\u2643', // Jupiter
  5: '\u2640', // Venus
  6: '\u2644', // Saturn
};

// ── Moon phase icons by approximate phase ──
const MOON_PHASE_ICONS = [
  '\uD83C\uDF11', // new
  '\uD83C\uDF12', // waxing crescent
  '\uD83C\uDF13', // first quarter
  '\uD83C\uDF14', // waxing gibbous
  '\uD83C\uDF15', // full
  '\uD83C\uDF16', // waning gibbous
  '\uD83C\uDF17', // last quarter
  '\uD83C\uDF18', // waning crescent
];

function getMoonPhaseIcon(tithiNumber: number): string {
  // Map tithi 1-30 to 8 phase icons
  if (tithiNumber <= 2) return MOON_PHASE_ICONS[1];
  if (tithiNumber <= 7) return MOON_PHASE_ICONS[2];
  if (tithiNumber <= 10) return MOON_PHASE_ICONS[3];
  if (tithiNumber <= 15) return MOON_PHASE_ICONS[4]; // full at 15
  if (tithiNumber <= 17) return MOON_PHASE_ICONS[5];
  if (tithiNumber <= 22) return MOON_PHASE_ICONS[6];
  if (tithiNumber <= 25) return MOON_PHASE_ICONS[7];
  return MOON_PHASE_ICONS[0]; // new moon approaching
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
  return DOSHA_COLORS[label] ?? { bg: 'bg-white/5', border: 'border-white/10', text: 'text-[#e6e2d8]' };
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
  return now >= end;
}

// ── Agni visualization ──
function AgniLevel({ level }: { level: 'strong' | 'moderate' | 'low' }) {
  const count = level === 'strong' ? 3 : level === 'moderate' ? 2 : 1;
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={i < count ? 'opacity-100' : 'opacity-20'}>
          \uD83D\uDD25
        </span>
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

  // ── Error state ──
  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-[#111633] border border-red-500/20 rounded-xl p-6 max-w-md text-center">
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
      <div className="max-w-2xl mx-auto px-4 pt-8">
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
        >
          <EnergyTimeline phases={protocol.energyPhases} voice={voice} />
        </SectionCard>

        {/* ── Hora Schedule ── */}
        <SectionCard
          title={voice === 'traditional' ? 'Hora Chakra' : 'Hora Schedule'}
        >
          <HoraGrid slots={protocol.horaSchedule} voice={voice} />
        </SectionCard>

        {/* ── Nutrition Window ── */}
        <SectionCard
          title={
            voice === 'traditional' ? 'Ahara Vidhi' : 'Nutrition Window'
          }
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
        >
          <PracticeFocus practice={protocol.practice} voice={voice} />
        </SectionCard>

        {/* ── Dead Zones ── */}
        {protocol.deadZones.length > 0 && (
          <SectionCard
            title={
              voice === 'traditional' ? 'Ashubha Kala' : 'Dead Zones'
            }
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="font-[Cinzel] text-base text-[#f0d48a] mb-3">{title}</h2>
      <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5">
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
    <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5 mb-5 flex items-center gap-4">
      <span className="text-4xl flex-shrink-0">{icon}</span>
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

// ── Energy Timeline ──
function EnergyTimeline({
  phases,
  voice,
}: {
  phases: EnergyPhase[];
  voice: VoiceMode;
}) {
  return (
    <div className="space-y-3">
      {/* Horizontal bar visualization */}
      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
        {phases.map((phase, i) => {
          const isCurrent = isInTimeRange(phase.startTime, phase.endTime);
          const label = phase.label[voice];
          const colors = getDoshaColor(label);
          return (
            <div
              key={i}
              className={`flex-1 relative flex items-center justify-center text-[10px] font-medium transition-all ${colors.bg} ${
                isCurrent
                  ? 'ring-1 ring-[#d4a853]/60 z-10'
                  : 'opacity-60'
              }`}
            >
              <span className={colors.text}>
                {phase.startTime}
              </span>
              {isCurrent && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d4a853]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase cards */}
      {phases.map((phase, i) => {
        const isCurrent = isInTimeRange(phase.startTime, phase.endTime);
        const label = phase.label[voice];
        const colors = getDoshaColor(label);
        return (
          <div
            key={i}
            className={`rounded-lg p-3 border transition-all ${
              isCurrent
                ? `${colors.bg} ${colors.border} border`
                : 'bg-[#161b42]/50 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${isCurrent ? colors.text : 'text-[#e6e2d8]/70'}`}>
                {label}
                {isCurrent && (
                  <span className="ml-2 text-[10px] bg-[#d4a853]/20 text-[#f0d48a] px-1.5 py-0.5 rounded-full">
                    NOW
                  </span>
                )}
              </span>
              <span className="text-[#8a8478] text-xs">
                {phase.startTime} - {phase.endTime}
              </span>
            </div>
            <p className="text-[#8a8478] text-xs leading-relaxed">
              {phase.description[voice]}
            </p>
          </div>
        );
      })}
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
          <span className="text-xl leading-none mt-0.5">
            {PLANET_SYMBOLS[slot.planetId] ?? '?'}
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
  const langKey = locale === 'hi' ? 'hi' : 'en';
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
              : 'bg-white/5 text-[#8a8478]/50 border border-white/[0.04] cursor-not-allowed'
          }`}
        >
          See my protocol
        </button>
      </div>
    </div>
  );
}
