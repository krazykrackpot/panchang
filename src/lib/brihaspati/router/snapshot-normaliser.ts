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

interface RawSadeSati {
  isActive?: boolean;
  phase?: string;
  currentPhase?: 'rising' | 'peak' | 'setting' | string;
  cycleStart?: number | string;
  cycleEnd?: number | string;
  cycleProgress?: number;       // 0..1 within current cycle
  overallIntensity?: number;    // engine-emitted intensity score
  saturnSign?: number;
  phaseProgress?: number;
}

interface RawShadbalaEntry {
  planet?: string;
  totalStrength?: number;
  sthanaBala?: number;
  digBala?: number;
  kalaBala?: number;
  cheshtaBala?: number;
  drikBala?: number;
  naisargikaBala?: number;
}

interface RawFunctionalNatureEntry {
  planetName?: { en?: string };
  nature?: 'funcBenefic' | 'funcMalefic' | 'neutral' | 'maraka' | 'badhak' | string;
  label?: { en?: string };
  note?: { en?: string };
  houseRulership?: number[];
}

interface RawFunctionalNature {
  lagna?: number | string;
  planets?: RawFunctionalNatureEntry[];
  badhakHouse?: number;
  badhakLord?: string;
  marakaLords?: string[];
  yogaKaraka?: string | null;
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
    evaluatedYogas?: Array<{ name?: string; nameKey?: string; detected?: boolean; domain?: string; strength?: number; cancelled?: boolean }>;
    sadeSati?: RawSadeSati;
    yogasComplete?: Array<{ name?: string; nameKey?: string; isPresent?: boolean }>;
    shadbala?: RawShadbalaEntry[];
    functionalNature?: RawFunctionalNature;
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
    // Surface every field the LLM needs to be specific about Sade Sati:
    // dates, current phase, intensity. Engine v2 emits cycleStart / cycleEnd
    // (years), currentPhase ('rising' | 'peak' | 'setting'), and an
    // overallIntensity score. Without these the LLM has only the binary
    // "Sade Sati is active" — useless for timing-sensitive answers.
    out.push({
      name: 'Sade Sati',
      phase: sadeSati.currentPhase ?? sadeSati.phase ?? null,
      cycle_start: sadeSati.cycleStart ?? null,
      cycle_end: sadeSati.cycleEnd ?? null,
      cycle_progress: typeof sadeSati.cycleProgress === 'number'
        ? Math.round(sadeSati.cycleProgress * 100) / 100
        : null,
      intensity: sadeSati.overallIntensity ?? null,
      saturn_sign: typeof sadeSati.saturnSign === 'number'
        ? signName(sadeSati.saturnSign)
        : null,
    });
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

/**
 * Per-planet strength + functional nature. The LLM needs this to
 * distinguish positional dignity (exalted, own-sign) from functional
 * reality (e.g. Mercury is exalted in Virgo but BADHAK for a
 * Sagittarius lagna — high obstructive potential despite the dignity).
 */
function normalisePlanetMeta(raw: RawSnapshot): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};

  // Shadbala — relative strength per planet
  const shadbala = raw.full_kundali?.shadbala;
  if (Array.isArray(shadbala)) {
    for (const s of shadbala) {
      if (!s.planet) continue;
      out[s.planet] = out[s.planet] || {};
      if (typeof s.totalStrength === 'number') {
        out[s.planet].shadbala_total = s.totalStrength;
      }
    }
  }

  // Functional nature — per-lagna benefic/malefic classification
  const fn = raw.full_kundali?.functionalNature?.planets;
  if (Array.isArray(fn)) {
    for (const p of fn) {
      const name = p.planetName?.en;
      if (!name) continue;
      out[name] = out[name] || {};
      out[name].functional_nature = p.nature ?? null;
      out[name].functional_label = p.label?.en ?? null;
      out[name].functional_note = p.note?.en ?? null;
      out[name].house_rulership = p.houseRulership ?? null;
    }
  }
  return out;
}

/** Turn a raw kundali_snapshots row into a RouterKundali. */
export function normaliseSnapshot(raw: RawSnapshot): RouterKundali {
  const positions = normalisePositions(raw);
  const planetMeta = normalisePlanetMeta(raw);

  // Merge functional nature + shadbala onto each position so the
  // category filter (which only keeps focus planets) preserves the
  // strength + functional-nature info per planet.
  const positionsWithMeta = positions.map((p) => {
    const name = String(p.planet);
    const meta = planetMeta[name];
    return meta ? { ...p, ...meta } : p;
  });

  // Top-level functional-nature summary for the LLM's framing:
  // badhak lord, maraka lords, yogakaraka. These are HUGE for
  // accurate predictive reads — e.g. Mercury for Sagittarius lagna
  // is the badhak, not a pure benefic just because it's exalted.
  const fnRoot = raw.full_kundali?.functionalNature;
  const analysisBlock: Record<string, unknown> = {};
  if (fnRoot) {
    analysisBlock.functional_summary = {
      badhak_lord: fnRoot.badhakLord ?? null,
      badhak_house: fnRoot.badhakHouse ?? null,
      maraka_lords: fnRoot.marakaLords ?? null,
      yoga_karaka: fnRoot.yogaKaraka ?? null,
    };
  }

  return {
    engineVersion: raw.computation_version ?? 'unknown',
    chart: {
      positions: positionsWithMeta,
      houses: normaliseHouses(raw),
      lagna: raw.full_kundali?.ascendant?.signName?.en
        ?? signName(raw.full_kundali?.ascendant?.sign)
        ?? signName(raw.chart_data?.ascendantSign)
        ?? null,
      ascendantDeg: raw.chart_data?.ascendantDeg ?? null,
      planet_meta: planetMeta,
    },
    dashas: normaliseDashas(raw),
    yogas: normaliseYogas(raw),
    doshas: normaliseDoshas(raw),
    transits: [],
    analysis: analysisBlock,
  };
}
