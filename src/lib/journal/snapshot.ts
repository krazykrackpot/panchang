/**
 * Builds a PlanetarySnapshot from panchang data + dasha timeline.
 * Called server-side when a journal entry is created to auto-tag
 * the entry with the current planetary state.
 */
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import type { DashaEntry } from '@/types/kundali';
import type { PlanetarySnapshot } from '@/types/journal';
import { tl } from '@/lib/utils/trilingual';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

/**
 * Denormalized fields stored alongside the JSONB snapshot for fast SQL filtering.
 */
export interface DenormalizedFields {
  tithi_number: number;
  nakshatra_number: number;
  yoga_number: number;
  karana_number: number;
  weekday: number;
  maha_dasha: string | null;
  antar_dasha: string | null;
  moon_sign: number | null;
  sade_sati_phase: string | null;
}

/**
 * Find the current maha dasha and antar dasha for a given date
 * by scanning the dasha timeline.
 */
export function extractDashaForDate(
  dashaTimeline: DashaEntry[] | undefined | null,
  date: Date,
): { mahaDasha: string; antarDasha: string } | null {
  if (!dashaTimeline || dashaTimeline.length === 0) return null;

  const dateMs = date.getTime();

  for (const maha of dashaTimeline) {
    const mahaStart = new Date(maha.startDate).getTime();
    const mahaEnd = new Date(maha.endDate).getTime();

    if (dateMs >= mahaStart && dateMs < mahaEnd) {
      // Found the maha dasha  –  now find the antar dasha
      if (maha.subPeriods && maha.subPeriods.length > 0) {
        for (const antar of maha.subPeriods) {
          const antarStart = new Date(antar.startDate).getTime();
          const antarEnd = new Date(antar.endDate).getTime();
          if (dateMs >= antarStart && dateMs < antarEnd) {
            return { mahaDasha: maha.planet, antarDasha: antar.planet };
          }
        }
      }
      // No matching antar dasha found  –  return maha only
      return { mahaDasha: maha.planet, antarDasha: maha.planet };
    }
  }

  return null;
}

/**
 * Extract denormalized fields from a PlanetarySnapshot for SQL indexing.
 */
export function buildDenormalizedFields(
  snapshot: PlanetarySnapshot,
): DenormalizedFields {
  return {
    tithi_number: snapshot.tithi.number,
    nakshatra_number: snapshot.nakshatra.number,
    yoga_number: snapshot.yoga.number,
    karana_number: snapshot.karana.number,
    weekday: snapshot.weekday,
    maha_dasha: snapshot.dasha?.mahaDasha ?? null,
    antar_dasha: snapshot.dasha?.antarDasha ?? null,
    moon_sign: snapshot.moonSign,
    sade_sati_phase: snapshot.sadeSatiPhase,
  };
}

/**
 * Build a complete planetary state snapshot for a given date and location.
 * Uses computePanchang for panchang elements and planet positions,
 * and scans the user's dasha timeline for current dasha period.
 */
export function buildPlanetarySnapshot(
  lat: number,
  lng: number,
  timezone: string,
  date: Date,
  dashaTimeline?: DashaEntry[] | null,
  sadeSatiPhase?: string | null,
): { snapshot: PlanetarySnapshot; denormalized: DenormalizedFields } {
  // Round 2 TZ-6 — extract y/m/d in the OBSERVER's timezone, not the
  // server's local. Previously `date.getFullYear/getMonth/getDate`
  // returned server-local components, so a user in Asia at 23:00 IST on
  // a UTC server would get the previous civil day's panchang. The
  // function already took `timezone` as a parameter for the tz offset
  // — we just weren't using it for the date itself.
  const partsFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  let year: number;
  let month: number;
  let day: number;
  try {
    const parts = partsFmt.formatToParts(date);
    year = Number(parts.find((p) => p.type === 'year')?.value ?? '0');
    month = Number(parts.find((p) => p.type === 'month')?.value ?? '1');
    day = Number(parts.find((p) => p.type === 'day')?.value ?? '1');
  } catch (err) {
    console.error('[journal/snapshot] Invalid timezone, falling back to UTC:', timezone, err);
    year = date.getUTCFullYear();
    month = date.getUTCMonth() + 1;
    day = date.getUTCDate();
  }

  // Resolve timezone offset for this specific date (handles DST)
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);

  const input: PanchangInput = {
    year,
    month,
    day,
    lat,
    lng,
    tzOffset,
    timezone,
  };

  const panchang = computePanchang(input);

  // Find Moon's rashi from planet positions
  const moon = panchang.planets.find((p) => p.id === 1);
  const moonSign = moon?.rashi ?? null;

  // Extract dasha for this date
  const dasha = extractDashaForDate(dashaTimeline, date);

  const snapshot: PlanetarySnapshot = {
    tithi: {
      name: tl(panchang.tithi.name, 'en'),
      number: panchang.tithi.number,
      paksha: panchang.tithi.paksha,
    },
    nakshatra: {
      name: tl(panchang.nakshatra.name, 'en'),
      number: panchang.nakshatra.id,
      pada: panchang.nakshatra.pada ?? 1,
    },
    yoga: {
      name: tl(panchang.yoga.name, 'en'),
      number: panchang.yoga.number,
    },
    karana: {
      name: tl(panchang.karana.name, 'en'),
      number: panchang.karana.number,
    },
    weekday: panchang.vara.day, // 0=Sun, 1=Mon, ..., 6=Sat
    moonSign: moonSign ?? 0,
    planets: panchang.planets.map((p) => ({
      id: p.id,
      name: tl(p.name, 'en'),
      sign: p.rashi ?? 0,
      signName: '', // Kept lean  –  sign name can be derived from sign number
      nakshatra: '', // Kept lean
      degree: p.longitude ?? 0,
      isRetrograde: p.isRetrograde ?? false,
    })),
    dasha,
    sadeSatiPhase: sadeSatiPhase ?? null,
  };

  const denormalized = buildDenormalizedFields(snapshot);

  return { snapshot, denormalized };
}
