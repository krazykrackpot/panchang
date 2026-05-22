/**
 * Snapshot → RouterKundali normaliser.
 *
 * The real kundali_snapshots table stores the engine output verbatim —
 * `full_kundali.planets` is an array of richly-nested objects, `dashas`
 * is a multi-level array, `chart_data.houses` is `number[][]` of planet
 * IDs. The Layer-2 filter (router/category-filters.ts) wants a flatter
 * shape — { positions: [{planet, sign, house}, …], current dasha lord,
 * yoga names with .name strings, etc.
 *
 * This module is the adapter. It turns the snapshot into a
 * RouterKundali that's ready for `filterForCategory()`.
 *
 * Defensive: every step tolerates missing / unexpected fields. Empty
 * input produces empty output, never throws.
 */

import type { RouterKundali } from '../router';

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const PLANET_BY_ID = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter',
  'Venus', 'Saturn', 'Rahu', 'Ketu',
] as const;

interface RawPlanet {
  planet?: { id?: number; name?: { en?: string } };
  sign?: number;
  signName?: { en?: string };
  house?: number;
  isRetrograde?: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
  isOwnSign?: boolean;
  degree?: string;
  nakshatra?: { name?: { en?: string } };
}

interface RawDashaEntry {
  level?: 'maha' | 'antar' | 'pratyantar';
  planet?: string;
  startDate?: string;
  endDate?: string;
  subPeriods?: RawDashaEntry[];
}

interface RawSnapshot {
  computation_version?: string;
  chart_data?: {
    houses?: number[][];
    ascendantDeg?: number;
    ascendantSign?: number;
  };
  full_kundali?: {
    planets?: RawPlanet[];
    dashas?: RawDashaEntry[];
    ascendant?: { signName?: { en?: string }; sign?: number };
    evaluatedYogas?: Array<{ name?: string; nameKey?: string; detected?: boolean; domain?: string }>;
    sadeSati?: { phase?: string; isActive?: boolean };
    yogasComplete?: Array<{ name?: string; nameKey?: string; isPresent?: boolean }>;
  } | null;
}

function signName(sign: number | undefined): string | undefined {
  if (typeof sign !== 'number' || sign < 1 || sign > 12) return undefined;
  return SIGN_NAMES[sign - 1];
}

function canonicalPlanetName(p: RawPlanet): string | undefined {
  if (typeof p.planet?.id === 'number' && p.planet.id >= 0 && p.planet.id < PLANET_BY_ID.length) {
    return PLANET_BY_ID[p.planet.id];
  }
  return p.planet?.name?.en;
}

function normalisePositions(raw: RawSnapshot): Record<string, unknown>[] {
  const planets = raw.full_kundali?.planets;
  if (!Array.isArray(planets)) return [];
  const out: Record<string, unknown>[] = [];
  for (const p of planets) {
    const name = canonicalPlanetName(p);
    if (!name) continue;
    out.push({
      planet: name,
      sign: signName(p.sign) ?? p.signName?.en ?? null,
      house: typeof p.house === 'number' ? p.house : null,
      degree: typeof p.degree === 'string' ? p.degree : null,
      retrograde: !!p.isRetrograde,
      exalted: !!p.isExalted,
      debilitated: !!p.isDebilitated,
      ownSign: !!p.isOwnSign,
      nakshatra: p.nakshatra?.name?.en ?? null,
    });
  }
  return out;
}

function normaliseHouses(raw: RawSnapshot): Record<string, unknown>[] {
  const cd = raw.chart_data;
  if (!cd || !Array.isArray(cd.houses)) return [];
  const lagnaSign = cd.ascendantSign ?? 1;
  const out: Record<string, unknown>[] = [];
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const sign = ((lagnaSign - 1 + i) % 12) + 1;
    const planetIds = cd.houses[i] ?? [];
    out.push({
      house: houseNum,
      sign: signName(sign),
      planets: planetIds.map((id) =>
        typeof id === 'number' && id >= 0 && id < PLANET_BY_ID.length ? PLANET_BY_ID[id] : `?${id}`,
      ),
    });
  }
  return out;
}

function withinDateRange(today: Date, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return false;
  const t = today.getTime();
  return t >= s && t < e;
}

function normaliseDashas(raw: RawSnapshot): Record<string, unknown> {
  const dashas = raw.full_kundali?.dashas;
  if (!Array.isArray(dashas) || dashas.length === 0) return {};
  const today = new Date();

  const currentMaha = dashas.find((d) => withinDateRange(today, d.startDate, d.endDate));
  if (!currentMaha?.planet) {
    return { chain: dashas.map((d) => d.planet).filter((x): x is string => !!x) };
  }

  const currentAntar = (currentMaha.subPeriods ?? []).find((s) =>
    withinDateRange(today, s.startDate, s.endDate),
  );

  const futureSubs = (currentMaha.subPeriods ?? [])
    .filter((s) => s.startDate && new Date(s.startDate).getTime() > today.getTime())
    .slice(0, 3)
    .map((s) => ({ lord: s.planet, start: s.startDate, end: s.endDate }));

  const upcomingMahas = dashas
    .filter((d) => d.startDate && new Date(d.startDate).getTime() > today.getTime())
    .slice(0, 2)
    .map((d) => ({ lord: d.planet, start: d.startDate, end: d.endDate, level: 'maha' }));

  return {
    current: currentMaha.planet,
    sub: currentAntar?.planet,
    chain: dashas.map((d) => d.planet).filter((x): x is string => !!x),
    start_date: currentMaha.startDate,
    end_date: currentMaha.endDate,
    upcoming: [...futureSubs, ...upcomingMahas],
  };
}

function normaliseYogas(raw: RawSnapshot): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const evaluated = raw.full_kundali?.evaluatedYogas;
  if (Array.isArray(evaluated)) {
    for (const y of evaluated) {
      if (y.detected === false) continue;
      if (!y.name && !y.nameKey) continue;
      out.push({
        name: y.name ?? y.nameKey,
        domain: y.domain,
      });
    }
  }
  const yc = raw.full_kundali?.yogasComplete;
  if (Array.isArray(yc) && out.length === 0) {
    for (const y of yc) {
      if (y.isPresent === false) continue;
      if (!y.name && !y.nameKey) continue;
      out.push({ name: y.name ?? y.nameKey });
    }
  }
  return out;
}

function normaliseDoshas(raw: RawSnapshot): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const sadeSati = raw.full_kundali?.sadeSati;
  if (sadeSati && typeof sadeSati === 'object' && sadeSati.isActive) {
    out.push({ name: 'Sade Sati', phase: sadeSati.phase ?? null });
  }
  const evaluated = raw.full_kundali?.evaluatedYogas;
  if (Array.isArray(evaluated)) {
    for (const y of evaluated) {
      const n = (y.name ?? y.nameKey ?? '').toString().toLowerCase();
      if (n.includes('mangal') || n.includes('manglik') || n.includes('kuja')) {
        out.push({ name: y.name ?? y.nameKey, domain: y.domain ?? 'marriage' });
      }
    }
  }
  return out;
}

/** Turn a raw kundali_snapshots row into a RouterKundali. */
export function normaliseSnapshot(raw: RawSnapshot): RouterKundali {
  return {
    engineVersion: raw.computation_version ?? 'unknown',
    chart: {
      positions: normalisePositions(raw),
      houses: normaliseHouses(raw),
      lagna: raw.full_kundali?.ascendant?.signName?.en
        ?? signName(raw.full_kundali?.ascendant?.sign)
        ?? signName(raw.chart_data?.ascendantSign)
        ?? null,
      ascendantDeg: raw.chart_data?.ascendantDeg ?? null,
    },
    dashas: normaliseDashas(raw),
    yogas: normaliseYogas(raw),
    doshas: normaliseDoshas(raw),
    transits: [],
    analysis: {},
  };
}
