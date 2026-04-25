/**
 * POST /api/transit-replay
 *
 * Given a birth chart and a target date, returns:
 *  - natal planet positions (sign, house, degree)
 *  - transit planet positions for the selected date
 *  - transit-to-natal house placements
 *  - transit-to-natal aspects (conjunction 0°, sextile 60°, square 90°, trine 120°, opposition 180°)
 *  - notable conditions (retrograde stations, close conjunctions, mutual aspects)
 *
 * No auth required — all data is computed from inputs, nothing is stored.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { getCurrentSkyPositions } from '@/lib/sky/positions';
import type { BirthData } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Aspect definitions (orbs)
// ---------------------------------------------------------------------------
const ASPECTS = [
  { name: 'Conjunction',  degrees: 0,   orb: 8 },
  { name: 'Sextile',      degrees: 60,  orb: 5 },
  { name: 'Square',       degrees: 90,  orb: 7 },
  { name: 'Trine',        degrees: 120, orb: 8 },
  { name: 'Opposition',   degrees: 180, orb: 8 },
] as const;

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function detectAspect(transitLong: number, natalLong: number): { aspect: string; orb: number } | null {
  for (const asp of ASPECTS) {
    const diff = angularDiff(transitLong, natalLong);
    const orb = Math.abs(diff - asp.degrees);
    if (orb <= asp.orb) {
      return { aspect: asp.name, orb: +orb.toFixed(2) };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// House from ascendant (equal-house)
// ---------------------------------------------------------------------------
function transitHouse(transitSiderealLong: number, ascendantSignNum: number): number {
  // ascendantSignNum is 1-based (1=Aries). Convert to 0-based degrees.
  const ascDeg = (ascendantSignNum - 1) * 30;
  const offset = (transitSiderealLong - ascDeg + 360) % 360;
  return Math.floor(offset / 30) + 1; // 1-12
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { date: rawDate, birthData: rawBirth } = body as {
    date?: unknown;
    birthData?: unknown;
  };

  // Validate date
  if (typeof rawDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return NextResponse.json(
      { error: 'date must be a string in YYYY-MM-DD format' },
      { status: 400 }
    );
  }
  const [y, m, d] = rawDate.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) {
    return NextResponse.json({ error: 'date values out of range' }, { status: 400 });
  }

  // Validate birthData
  const bd = rawBirth as Partial<BirthData> | undefined;
  if (
    !bd ||
    typeof bd.date !== 'string' ||
    typeof bd.time !== 'string' ||
    typeof bd.lat !== 'number' ||
    typeof bd.lng !== 'number' ||
    typeof bd.timezone !== 'string'
  ) {
    return NextResponse.json(
      { error: 'birthData must include date, time, lat, lng, timezone' },
      { status: 400 }
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bd.date)) {
    return NextResponse.json({ error: 'birthData.date must be YYYY-MM-DD' }, { status: 400 });
  }
  if (!/^\d{2}:\d{2}$/.test(bd.time)) {
    return NextResponse.json({ error: 'birthData.time must be HH:MM' }, { status: 400 });
  }
  if (Math.abs(bd.lat) > 90 || Math.abs(bd.lng) > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    // --- 1. Generate natal chart ---
    const birthData: BirthData = {
      name: (bd.name as string | undefined) ?? 'Chart',
      date: bd.date,
      time: bd.time,
      place: (bd.place as string | undefined) ?? '',
      lat: bd.lat,
      lng: bd.lng,
      timezone: bd.timezone,
      ayanamsha: (bd.ayanamsha as string | undefined) ?? 'lahiri',
    };
    const kundali = generateKundali(birthData);

    // --- 2. Compute transit positions for the selected date ---
    // Use noon UTC for the selected date (avoids day-boundary ambiguity)
    const transitDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const transitPositions = getCurrentSkyPositions(transitDate);

    // --- 3. Build natal planet map (id -> position) ---
    const natalByPlanetId: Record<number, { sign: number; house: number; siderealLong: number; name: string }> = {};
    for (const pp of kundali.planets) {
      natalByPlanetId[pp.planet.id] = {
        sign: pp.sign,
        house: pp.house,
        siderealLong: pp.longitude,
        name: pp.planet.name.en,
      };
    }
    const ascendantSign: number = kundali.ascendant?.sign ?? 1;

    // --- 4. Transit positions enriched with house placements ---
    const transitRows = transitPositions.map((tp) => {
      const natal = natalByPlanetId[tp.id];
      const house = transitHouse(tp.siderealLongitude, ascendantSign);
      return {
        id: tp.id,
        name: tp.name,
        rashi: tp.rashi,
        nakshatra: tp.nakshatra,
        nakshatraPada: tp.nakshatraPada,
        siderealLongitude: +tp.siderealLongitude.toFixed(4),
        isRetrograde: tp.isRetrograde,
        house,
        natalSign: natal?.sign ?? null,
        natalHouse: natal?.house ?? null,
      };
    });

    // --- 5. Transit-to-natal aspects ---
    const aspects: Array<{
      transitPlanet: string;
      natalPlanet: string;
      aspect: string;
      orb: number;
    }> = [];

    for (const tp of transitPositions) {
      for (const np of kundali.planets) {
        const det = detectAspect(tp.siderealLongitude, np.longitude);
        if (det) {
          aspects.push({
            transitPlanet: tp.name,
            natalPlanet: np.planet.name.en,
            aspect: det.aspect,
            orb: det.orb,
          });
        }
      }
    }
    // Sort by tightest orb first
    aspects.sort((a, b) => a.orb - b.orb);

    // --- 6. Notable conditions ---
    const notableConditions: string[] = [];
    for (const tp of transitPositions) {
      if (tp.isRetrograde && (tp.id === 4 || tp.id === 6)) {
        // Jupiter or Saturn retrograde are slower, more significant
        notableConditions.push(`${tp.name} is retrograde on this date`);
      }
      if (tp.isRetrograde && (tp.id === 2 || tp.id === 3 || tp.id === 5)) {
        notableConditions.push(`${tp.name} is retrograde (${tp.name === 'Mercury' ? 'review and re-think' : 'inward focus'})`);
      }
    }
    // Flag very tight conjunctions (orb ≤ 1°) between transit and natal planets
    for (const asp of aspects) {
      if (asp.aspect === 'Conjunction' && asp.orb <= 1) {
        notableConditions.push(
          `Exact conjunction: transit ${asp.transitPlanet} on natal ${asp.natalPlanet} (orb ${asp.orb}°)`
        );
      }
    }
    // Rahu-Ketu axis on natal Sun or Moon
    for (const tp of transitPositions) {
      if (tp.id === 7 || tp.id === 8) {
        for (const np of kundali.planets) {
          if (np.planet.id === 0 || np.planet.id === 1) {
            const diff = angularDiff(tp.siderealLongitude, np.longitude);
            if (diff <= 10) {
              notableConditions.push(
                `${tp.name} near natal ${np.planet.name.en} — eclipse sensitivity window`
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      selectedDate: rawDate,
      natalSummary: {
        name: birthData.name,
        date: birthData.date,
        time: birthData.time,
        place: birthData.place,
        ascendantSign,
        ascendantDeg: kundali.ascendant?.degree ?? 0,
      },
      transitPositions: transitRows,
      aspects,
      notableConditions: [...new Set(notableConditions)],
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[transit-replay] computation failed:', err);
    return NextResponse.json(
      { error: 'Failed to compute transit replay' },
      { status: 500 }
    );
  }
}
