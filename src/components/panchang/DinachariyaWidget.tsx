'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import { usePrakritiStore } from '@/stores/prakriti-store';
import { generateDailyProtocol } from '@/lib/dinacharya/protocol-engine';
import type { DailyProtocol } from '@/lib/dinacharya/protocol-engine';
import type { PanchangData } from '@/types/panchang';

// 0=Sun 1=Moon 2=Mars 3=Mercury 4=Jupiter 5=Venus 6=Saturn
const PLANET_SYMBOLS = ['☉', '☽', '♂', '☿', '♃', '♀', '♄'];

const AGNI_ICONS: Record<string, string> = {
  strong: '🔥🔥🔥',
  moderate: '🔥🔥',
  low: '🔥',
};

/** Parse "HH:MM" → minutes since midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Return the next upcoming dead zone (start time is in the future), or first one if all passed */
function nextDeadZone(protocol: DailyProtocol) {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const upcoming = protocol.deadZones.filter((z) => toMinutes(z.startTime) > nowMin);
  return upcoming[0] ?? protocol.deadZones[0] ?? null;
}

/** Current energy phase whose window contains now */
function currentPhase(protocol: DailyProtocol) {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  return (
    protocol.energyPhases.find((p) => {
      const start = toMinutes(p.startTime);
      const end = toMinutes(p.endTime);
      // handle midnight wrap (Lesson R)
      if (end < start) return nowMin >= start || nowMin < end;
      return nowMin >= start && nowMin < end;
    }) ?? protocol.energyPhases[0]
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-4 animate-pulse space-y-3">
      <div className="h-4 bg-[#d4a853]/10 rounded w-2/3" />
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-5/6" />
      <div className="h-3 bg-white/5 rounded w-4/6" />
    </div>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────────────
export default function DinachariyaWidget() {
  const locale = useLocale();
  const locationStore = useLocationStore();
  const { profile: prakriti } = usePrakritiStore();
  const [protocol, setProtocol] = useState<DailyProtocol | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!locationStore.confirmed || locationStore.lat === null || locationStore.lng === null) return;

    setLoading(true);
    setError(false);

    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const url =
      `/api/panchang?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}` +
      `&lat=${locationStore.lat}&lng=${locationStore.lng}&timezone=${encodeURIComponent(tz)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<PanchangData>;
      })
      .then((data) => {
        // Map panchang API fields → generateDailyProtocol params
        const horaSlots = (data.hora ?? []).map((h) => {
          const nowMin = now.getHours() * 60 + now.getMinutes();
          const start = toMinutes(h.startTime);
          const end = toMinutes(h.endTime);
          const isCurrent = end < start
            ? nowMin >= start || nowMin < end
            : nowMin >= start && nowMin < end;
          return { planetId: h.planetId, startTime: h.startTime, endTime: h.endTime, isCurrent };
        });

        const result = generateDailyProtocol({
          tithi: { number: data.tithi.number, name: data.tithi.name.en },
          nakshatra: { number: data.nakshatra.id, name: data.nakshatra.name.en },
          sunrise: data.sunrise,
          sunset: data.sunset,
          rahuKaal: data.rahuKaal,
          yamaganda: data.yamaganda,
          varjyam: data.varjyamAll ?? (data.varjyam ? [data.varjyam] : undefined),
          horaSlots,
          prakriti,
        });

        setProtocol(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('[dinacharya-widget] fetch failed:', err);
        setError(true);
        setLoading(false);
      });
  }, [locationStore.confirmed, locationStore.lat, locationStore.lng, prakriti]);

  // ── No location ────────────────────────────────────────────────
  if (!locationStore.confirmed) {
    return (
      <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-4">
        <p className="text-xs text-[#8a8478]">Set your location to see your daily protocol.</p>
      </div>
    );
  }

  if (loading) return <Skeleton />;

  if (error || !protocol) {
    return (
      <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-4">
        <p className="text-xs text-[#8a8478]">Could not load daily protocol. Try refreshing.</p>
      </div>
    );
  }

  const currentHora = protocol.horaSchedule.find((h) => h.isCurrent) ?? protocol.horaSchedule[0];
  const phase = currentPhase(protocol);
  const deadZone = nextDeadZone(protocol);

  return (
    <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#f0d48a]">Daily Protocol</span>
        <Link
          href={`/${locale}/dinacharya`}
          className="text-[#d4a853] hover:text-[#f0d48a] transition-colors"
          aria-label="View full daily protocol"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Current Hora */}
      {currentHora && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg leading-none">{PLANET_SYMBOLS[currentHora.planetId] ?? '★'}</span>
            <span className="text-sm text-[#e6e2d8] font-medium">{currentHora.planetName} Hora</span>
            <span className="text-xs text-[#8a8478] ml-auto">until {currentHora.endTime}</span>
          </div>
          <p className="text-xs text-[#8a8478] mt-0.5 pl-6">{currentHora.activity.modern}</p>
        </div>
      )}

      {/* Energy Phase */}
      {phase && (
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#d4a853]">{phase.label.modern}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto ${
              phase.level === 'high' ? 'bg-green-500/15 text-green-400' :
              phase.level === 'low' ? 'bg-blue-500/15 text-blue-400' :
              phase.level === 'avoid' ? 'bg-red-500/15 text-red-400' :
              'bg-amber-500/15 text-amber-400'
            }`}>
              {phase.level === 'high' ? 'Peak' : phase.level === 'low' ? 'Rest' : phase.level === 'avoid' ? 'Avoid' : 'Moderate'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-[#8a8478]">Agni</span>
            <span className="text-xs">{AGNI_ICONS[protocol.nutrition.agniLevel]}</span>
          </div>
        </div>
      )}

      {/* Next Dead Zone */}
      {deadZone && (
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-red-400/80">⛔</span>
            <span className="text-xs text-[#8a8478]">{deadZone.name}</span>
            <span className="text-xs text-[#e6e2d8] ml-auto font-mono">{deadZone.startTime}–{deadZone.endTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}
