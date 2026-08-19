/**
 * MCP tool: get_kundali
 *
 * Generates a Vedic birth chart (Rasi + Navamsa + Vimshottari Dasha)
 * from birth date, time, and coordinates. Runs entirely on the user's
 * machine using Swiss Ephemeris — no network round-trip, no per-call
 * cost, no API keys.
 *
 * Reuses src/lib/ephem/kundali-calc.ts (same engine as /api/kundali on
 * dekhopanchang.com). The response is a compact, LLM-friendly projection
 * — the full KundaliData shape has ~40 optional axes (Ashtakavarga,
 * Shadbala, 20+ dashas, evaluated yogas) that would flood any LLM
 * context window. Callers who need the full detail should hit the web
 * API directly.
 */

import { z } from 'zod';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { validateBirthData } from '@/lib/kundali/validate-birth-data';
import type { BirthData } from '@/types/kundali';
import { resolveTimezoneFromCoords } from '../lib/tz.js';

export const kundaliInputSchema = {
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'birth_date must be YYYY-MM-DD')
    .describe('Birth date in YYYY-MM-DD format (Gregorian civil date)'),
  birth_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'birth_time must be HH:MM (24-hour)')
    .describe('Local birth time in HH:MM 24-hour format (00:00 to 23:59)'),
  lat: z
    .number()
    .min(-90)
    .max(90)
    .describe('Birth latitude in decimal degrees, -90 to 90'),
  lng: z
    .number()
    .min(-180)
    .max(180)
    .describe('Birth longitude in decimal degrees, -180 to 180'),
  timezone: z
    .string()
    .max(64)
    .optional()
    .describe(
      "IANA timezone at birth location (e.g. 'Asia/Kolkata'). Omit to auto-resolve from lat/lng — recommended unless you know the historical zone rule.",
    ),
  name: z
    .string()
    .max(200)
    .optional()
    .describe('Optional person name — echoed back in the response only'),
  ayanamsha: z
    .enum(['lahiri', 'raman', 'kp'])
    .optional()
    .describe(
      "Sidereal ayanamsha system. Default 'lahiri' (Chitrapaksha, Indian government standard). Alternatives: 'raman' (B.V. Raman), 'kp' (Krishnamurti Paddhati).",
    ),
  node_type: z
    .enum(['mean', 'true'])
    .optional()
    .describe(
      "Rahu/Ketu node type. Default 'mean' (traditional Vedic). 'true' includes nutation and matches modern NASA JPL to ~1.5 arcmin.",
    ),
};

export async function runGetKundali(args: {
  birth_date: string;
  birth_time: string;
  lat: number;
  lng: number;
  timezone?: string;
  name?: string;
  ayanamsha?: 'lahiri' | 'raman' | 'kp';
  node_type?: 'mean' | 'true';
}) {
  const timezone = args.timezone ?? resolveTimezoneFromCoords(args.lat, args.lng);

  const birthData: BirthData = {
    name: args.name ?? 'Unnamed',
    date: args.birth_date,
    time: args.birth_time,
    place: args.name ?? '',
    lat: args.lat,
    lng: args.lng,
    timezone,
    ayanamsha: args.ayanamsha ?? 'lahiri',
    node_type: args.node_type ?? 'mean',
  };

  // Same validator used by /api/kundali — single source of truth.
  const check = validateBirthData(birthData);
  if (!check.ok) {
    throw new Error(check.error);
  }

  const kundali = generateKundali(birthData);

  // Compact projection. Full KundaliData carries ~40 optional detail axes
  // (Ashtakavarga tables, 20+ dashas, evaluated yogas, upagrahas, etc.)
  // that overflow LLM context windows. Callers needing those should use
  // the web API at dekhopanchang.com/api/kundali.
  return {
    source: 'dekhopanchang.com',
    engine: 'Swiss Ephemeris DE441 (Meeus fallback)',
    ayanamsha: birthData.ayanamsha,
    ayanamshaValue: kundali.ayanamshaValue,
    julianDay: kundali.julianDay,
    birthData: {
      name: birthData.name,
      date: birthData.date,
      time: birthData.time,
      lat: birthData.lat,
      lng: birthData.lng,
      timezone: birthData.timezone,
    },
    ascendant: {
      degree: kundali.ascendant.degree,
      sign: kundali.ascendant.sign,
      signName: kundali.ascendant.signName.en,
    },
    planets: kundali.planets.map((p) => ({
      planet: p.planet.name.en,
      longitude: p.longitude,
      speed: p.speed,
      sign: p.sign,
      signName: p.signName.en,
      house: p.house,
      nakshatra: p.nakshatra.name.en,
      pada: p.pada,
      degree: p.degree,
      isRetrograde: p.isRetrograde,
      isCombust: p.isCombust,
      isExalted: p.isExalted,
      isDebilitated: p.isDebilitated,
      isOwnSign: p.isOwnSign,
    })),
    houses: kundali.houses.map((h) => ({
      house: h.house,
      sign: h.sign,
      signName: h.signName.en,
      lord: h.lord,
      lordName: h.lordName.en,
      degree: h.degree,
    })),
    // Vimshottari Mahadasha overview — top level only. Antardasha /
    // pratyantar are available in kundali.dashas[i].subPeriods but nested
    // 3 levels deep = hundreds of rows; omit from the default response.
    mahadashas: kundali.dashas.map((d) => ({
      planet: d.planet,
      planetName: d.planetName.en,
      startDate: d.startDate,
      endDate: d.endDate,
    })),
    // Named yogas detected in the chart, if the engine returned any.
    // Filter to yogas actually present in the chart (engine returns
    // all definitions with a `present` flag). Cap at 20 to keep the
    // response LLM-friendly; strongest indicators surface first via
    // the engine's own ordering.
    yogas: (kundali.yogasComplete ?? [])
      .filter((y) => y.present)
      .slice(0, 20)
      .map((y) => ({
        name: y.name.en,
        category: y.category,
        isAuspicious: y.isAuspicious,
        strength: y.strength,
        description: y.description.en,
      })),
    warnings: kundali.warnings ?? [],
    citation: {
      attribution: 'Computed by @dekhopanchang/mcp — Kundali Engine',
      methodology: 'https://dekhopanchang.com/en/about/methodology',
      sources: [
        'Brihat Parashara Hora Shastra (BPHS)',
        'Phaladeepika (Mantreshwara)',
        'Jataka Parijata',
        'Swiss Ephemeris (NASA JPL DE441)',
      ],
      note: 'This is a compact projection. For Ashtakavarga, Shadbala, Divisional charts, and 20+ additional dashas, query the web API at dekhopanchang.com/api/kundali or the /kundali page.',
    },
  };
}
