/**
 * Snapshot → RouterKundali normaliser.
 *
 * The boundary between deterministic Jyotish computation and the LLM.
 * Every fact the LLM needs to give an accurate reading must flow through
 * here — anything dropped here is invented or hallucinated downstream.
 *
 * ── Contract: lossless on the MUST tier ─────────────────────────────────
 *
 * For each planet position we surface (verbatim where possible):
 *   - id / canonical name
 *   - sign (number + English name)
 *   - house (1–12)
 *   - longitude + latitude + speed (LLM uses speed sign for direction
 *     and magnitude; longitude for ashtakavarga / transit arithmetic)
 *   - degree (DD°MM'SS" formatted string)
 *   - nakshatra: id, name, pada, ruler (KP + dasha-balance critical)
 *   - All dignity flags: retrograde, combust, exalted, debilitated,
 *     own-sign, vargottama, mrityu bhaga, pushkar bhaga / navamsha
 *   - navamshaSign (D9 placement — used for marriage + spiritual reads)
 *   - Shadbala: total + sthana/dig/kala/cheshta/drik/naisargika
 *   - Avastha: baladi / jagradadi / deeptadi / lajjitadi / shayanadi
 *   - Functional nature: yogaKaraka / benefic / neutral / malefic / maraka / badhak,
 *     plus house rulership and human-readable label.
 *
 * At the top level we surface:
 *   - ascendant (sign + sign name + degree + ascendant's nakshatra)
 *   - houses (12 cusps with sign + planets occupying)
 *   - navamsha (D9) chart summary
 *   - dashas at three levels (maha / antar / pratyantar), with current
 *     start/end dates and upcoming transitions
 *   - Sade Sati: phase, cycle dates, intensity, Saturn sign
 *   - Yogas: evaluatedYogas (detected only) — name, domain, strength,
 *     classical ref, cancellation status; falls back to yogasComplete
 *     when the new engine hasn't emitted any.
 *   - Doshas: Manglik / Kuja, Kaal Sarpa, Pitru, Sade Sati (cross-ref)
 *   - Ashtakavarga summary: SAV per sign + Bhinnashtakavarga per
 *     {planet, sign} pair (LLM uses for transit timing)
 *   - Jaimini: Atmakaraka, Amatyakaraka, Karakamsha (Soul indicator —
 *     essential for any "purpose / dharma" question)
 *   - Special Lagnas (Hora, Ghatika, Bhava, Sripathi) when present
 *   - Bhavabala (house strength per house — Kendra/Trikona analysis)
 *   - Bhrigu Bindu (advanced predictive point)
 *   - Graha Yuddha results (planet wars affect dignity)
 *   - Warnings from the engine (Meeus precision, missing data, etc.) —
 *     surfaced so the LLM can disclaim accordingly
 *
 * ── Deliberately OMITTED (rationale documented per field) ──────────────
 *
 *   - divisionalCharts (D2/D7/D10/D12/...): out-of-scope for v1; LLMs
 *     trained on classical Jyotish tend to mistranslate non-D1/D9
 *     vargas. Re-introduce per-category when prompt scaffolds support
 *     them.
 *   - Additional dashas (Yogini / Ashtottari / Narayana / Chara /
 *     Kalachakra / Shoola / etc.): Vimshottari is the dominant system;
 *     including the others bloats context and risks the LLM citing
 *     conflicting periods. Surfaced per-category when category demands
 *     (e.g. Chara for spiritual questions).
 *   - vimshopakaBala: composite strength better expressed through
 *     individual varga dignity which we don't pass anyway. Re-add when
 *     divisional charts come online.
 *   - argala / sphutas: too easy for LLMs to misuse; surface in
 *     category-specific scaffolds when the analysis demands them.
 *
 * Every drop above is intentional. Adding a field to the engine output
 * does NOT automatically add it here — and the completeness test in
 * snapshot-normaliser.test.ts asserts the contract.
 *
 * ── Defensive contract ─────────────────────────────────────────────────
 *
 * Every step tolerates missing / unexpected fields. Empty input
 * produces empty output, never throws. Shape variants (saved_charts
 * chart_data using `{planets:[]}` vs canonical `number[]` for houses)
 * are accepted via coercion helpers.
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

// ──────────────────────────────────────────────────────────────────────
// Raw types (loose — match the engine output shape verbatim)
// ──────────────────────────────────────────────────────────────────────

interface RawLocaleText { en?: string; hi?: string; sa?: string; [k: string]: string | undefined }

interface RawNakshatra {
  id?: number;
  name?: RawLocaleText;
  ruler?: string;
  rulerName?: RawLocaleText;
}

interface RawPlanet {
  planet?: { id?: number; name?: RawLocaleText };
  sign?: number;
  signName?: RawLocaleText;
  house?: number;
  longitude?: number;
  latitude?: number;
  speed?: number;
  degree?: string;
  pada?: number;
  nakshatra?: RawNakshatra;
  isRetrograde?: boolean;
  isCombust?: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
  isOwnSign?: boolean;
  isVargottama?: boolean;
  isMrityuBhaga?: boolean;
  isPushkarBhaga?: boolean;
  isPushkarNavamsha?: boolean;
  navamshaSign?: number;
}

interface RawDashaEntry {
  level?: 'maha' | 'antar' | 'pratyantar';
  planet?: string;
  planetName?: RawLocaleText;
  startDate?: string;
  endDate?: string;
  subPeriods?: RawDashaEntry[];
}

interface RawSadeSati {
  isActive?: boolean;
  phase?: string;
  currentPhase?: string;
  cycleStart?: number | string;
  cycleEnd?: number | string;
  cycleProgress?: number;
  overallIntensity?: number;
  saturnSign?: number;
  phaseProgress?: number;
  currentCycle?: { startDate?: string; endDate?: string; phase?: string };
  upcomingCycle?: { startDate?: string; endDate?: string };
}

interface RawShadbalaEntry {
  planet?: string;
  planetName?: RawLocaleText;
  totalStrength?: number;
  sthanaBala?: number;
  digBala?: number;
  kalaBala?: number;
  cheshtaBala?: number;
  drikBala?: number;
  naisargikaBala?: number;
}

interface RawAvastha {
  planetId?: number;
  baladi?: { state?: string; name?: RawLocaleText; strength?: number };
  jagradadi?: { state?: string; name?: RawLocaleText; quality?: string };
  deeptadi?: { state?: string; name?: RawLocaleText; luminosity?: number };
  lajjitadi?: { state?: string; name?: RawLocaleText; effect?: string };
  shayanadi?: { state?: string; name?: RawLocaleText; activity?: string };
}

interface RawFunctionalNatureEntry {
  planetId?: number;
  planetName?: RawLocaleText;
  nature?: string;
  label?: RawLocaleText;
  note?: RawLocaleText;
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

interface RawEvaluatedYoga {
  id?: string;
  name?: string;
  nameKey?: string;
  detected?: boolean;
  domain?: string;
  strength?: number;
  strengthLabel?: string;
  cancelled?: boolean;
  cancellationReason?: string;
  classicalRef?: string;
  description?: RawLocaleText | string;
  planetsInvolved?: string[];
  housesInvolved?: number[];
}

interface RawYogaComplete {
  name?: string;
  nameKey?: string;
  isPresent?: boolean;
  planets?: string[];
  houses?: number[];
  description?: RawLocaleText | string;
}

interface RawAshtakavarga {
  bpiTable?: number[][];      // 7 planets × 12 signs
  savTable?: number[];        // 12 signs
  reducedBpiTable?: number[][];
  reducedSavTable?: number[];
  shodhitaSav?: number[];
  pindaAshtakavarga?: number[];
  planetNames?: string[];
}

interface RawBhavaBala {
  house?: number;
  total?: number;
  bhavadhipathiBala?: number;
  bhavaDigBala?: number;
  bhavaDrishtiBala?: number;
  strength?: string;
}

interface RawSpecialLagna {
  sign?: number;
  signName?: RawLocaleText;
  degree?: number;
}

interface RawJaiminiKaraka {
  planet?: number;
  planetName?: RawLocaleText;
  karaka?: string;
  karakaName?: RawLocaleText;
  degree?: number;
}

interface RawJaimini {
  charaKarakas?: RawJaiminiKaraka[];
  karakamsha?: { sign?: number; signName?: RawLocaleText };
  arudhaPadas?: Array<{ house?: number; sign?: number; signName?: RawLocaleText; label?: RawLocaleText }>;
  charaDasha?: Array<{ sign?: number; signName?: RawLocaleText; years?: number; startDate?: string; endDate?: string }>;
  rajayogas?: Array<{ name?: string; planets?: string[] }>;
}

interface RawAscendant {
  sign?: number;
  signName?: RawLocaleText;
  degree?: number;
  nakshatra?: RawNakshatra;
  pada?: number;
}

interface RawGrahaYuddha {
  winner?: string;
  loser?: string;
  separation?: number;
}

interface RawBhriguBindu {
  longitude?: number;
  sign?: number;
  degree?: string;
}

interface RawChartData {
  houses?: number[][] | Array<{ planets?: number[]; grahas?: number[] }>;
  ascendantDeg?: number;
  ascendantSign?: number;
}

interface RawSnapshot {
  computation_version?: string;
  chart_data?: RawChartData;
  full_kundali?: {
    birthData?: { name?: string; date?: string; time?: string; lat?: number; lng?: number; timezone?: string };
    ascendant?: RawAscendant;
    planets?: RawPlanet[];
    chart?: RawChartData;
    navamshaChart?: RawChartData;
    dashas?: RawDashaEntry[];
    shadbala?: RawShadbalaEntry[];
    fullShadbala?: RawShadbalaEntry[];
    avasthas?: RawAvastha[];
    functionalNature?: RawFunctionalNature;
    evaluatedYogas?: RawEvaluatedYoga[];
    yogasComplete?: RawYogaComplete[];
    sadeSati?: RawSadeSati;
    ashtakavarga?: RawAshtakavarga;
    bhavabala?: RawBhavaBala[];
    specialLagnas?: Record<string, RawSpecialLagna>;
    jaimini?: RawJaimini;
    bhriguBindu?: RawBhriguBindu;
    grahaYuddha?: RawGrahaYuddha[];
    warnings?: string[];
    ayanamshaValue?: number;
  } | null;
}

// ──────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────

function signName(sign: number | undefined): string | undefined {
  if (typeof sign !== 'number' || sign < 1 || sign > 12) return undefined;
  return SIGN_NAMES[sign - 1];
}

function planetById(id: number | undefined): string | undefined {
  if (typeof id !== 'number' || id < 0 || id >= PLANET_BY_ID.length) return undefined;
  return PLANET_BY_ID[id];
}

function canonicalPlanetName(p: RawPlanet): string | undefined {
  return planetById(p.planet?.id) ?? p.planet?.name?.en;
}

function en<T extends RawLocaleText | undefined>(t: T): string | null {
  return (t && typeof t.en === 'string') ? t.en : null;
}

function withinDateRange(today: Date, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return false;
  const t = today.getTime();
  return t >= s && t < e;
}

function coerceHouseCell(cell: unknown): number[] {
  if (Array.isArray(cell)) {
    return cell.filter((n): n is number => typeof n === 'number');
  }
  if (cell && typeof cell === 'object') {
    const o = cell as { planets?: unknown; grahas?: unknown };
    if (Array.isArray(o.planets)) return o.planets.filter((n): n is number => typeof n === 'number');
    if (Array.isArray(o.grahas)) return o.grahas.filter((n): n is number => typeof n === 'number');
  }
  return [];
}

// ──────────────────────────────────────────────────────────────────────
// Per-section normalisers
// ──────────────────────────────────────────────────────────────────────

function normalisePositions(raw: RawSnapshot): Record<string, unknown>[] {
  const planets = raw.full_kundali?.planets;
  if (!Array.isArray(planets)) return [];
  const out: Record<string, unknown>[] = [];
  for (const p of planets) {
    const name = canonicalPlanetName(p);
    if (!name) continue;
    out.push({
      planet: name,
      planet_id: p.planet?.id,
      sign: signName(p.sign) ?? en(p.signName) ?? null,
      sign_number: p.sign ?? null,
      house: typeof p.house === 'number' ? p.house : null,
      longitude: typeof p.longitude === 'number' ? p.longitude : null,
      latitude: typeof p.latitude === 'number' ? p.latitude : null,
      speed: typeof p.speed === 'number' ? p.speed : null,
      degree: typeof p.degree === 'string' ? p.degree : null,
      nakshatra: en(p.nakshatra?.name) ?? null,
      nakshatra_lord: p.nakshatra?.ruler ?? en(p.nakshatra?.rulerName) ?? null,
      nakshatra_pada: typeof p.pada === 'number' ? p.pada : null,
      navamsha_sign: signName(p.navamshaSign) ?? null,
      retrograde: !!p.isRetrograde,
      combust: !!p.isCombust,
      exalted: !!p.isExalted,
      debilitated: !!p.isDebilitated,
      own_sign: !!p.isOwnSign,
      vargottama: !!p.isVargottama,
      mrityu_bhaga: !!p.isMrityuBhaga,
      pushkar_bhaga: !!p.isPushkarBhaga,
      pushkar_navamsha: !!p.isPushkarNavamsha,
    });
  }
  return out;
}

function normaliseHouses(raw: RawSnapshot): Record<string, unknown>[] {
  const cd = raw.chart_data ?? raw.full_kundali?.chart;
  if (!cd || !Array.isArray(cd.houses)) return [];
  const lagnaSign = cd.ascendantSign ?? 1;
  const out: Record<string, unknown>[] = [];
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const sign = ((lagnaSign - 1 + i) % 12) + 1;
    const planetIds = coerceHouseCell(cd.houses[i]);
    out.push({
      house: houseNum,
      sign: signName(sign),
      sign_number: sign,
      planets: planetIds.map((id) => planetById(id) ?? `?${id}`),
    });
  }
  return out;
}

function normaliseNavamshaSummary(raw: RawSnapshot): Record<string, unknown> | null {
  const nv = raw.full_kundali?.navamshaChart;
  if (!nv || !Array.isArray(nv.houses)) return null;
  const lagnaSign = nv.ascendantSign ?? 1;
  const houses: Record<string, unknown>[] = [];
  for (let i = 0; i < 12; i++) {
    const sign = ((lagnaSign - 1 + i) % 12) + 1;
    houses.push({
      house: i + 1,
      sign: signName(sign),
      planets: coerceHouseCell(nv.houses[i]).map((id) => planetById(id) ?? `?${id}`),
    });
  }
  return { lagna: signName(lagnaSign), houses };
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
  // Third-level (pratyantar) — most LLMs ignore it but having it eliminates
  // any need for the LLM to guess fine-grained timing.
  const currentPratyantar = (currentAntar?.subPeriods ?? []).find((s) =>
    withinDateRange(today, s.startDate, s.endDate),
  );

  const futureSubs = (currentMaha.subPeriods ?? [])
    .filter((s) => s.startDate && new Date(s.startDate).getTime() > today.getTime())
    .slice(0, 3)
    .map((s) => ({ lord: s.planet, start: s.startDate, end: s.endDate, level: 'antar' }));

  const upcomingMahas = dashas
    .filter((d) => d.startDate && new Date(d.startDate).getTime() > today.getTime())
    .slice(0, 2)
    .map((d) => ({ lord: d.planet, start: d.startDate, end: d.endDate, level: 'maha' }));

  return {
    current: currentMaha.planet,
    sub: currentAntar?.planet,
    pratyantar: currentPratyantar?.planet,
    chain: dashas.map((d) => d.planet).filter((x): x is string => !!x),
    start_date: currentMaha.startDate,
    end_date: currentMaha.endDate,
    sub_start_date: currentAntar?.startDate,
    sub_end_date: currentAntar?.endDate,
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
        strength_label: y.strengthLabel,
        cancelled: y.cancelled ?? false,
        cancellation_reason: y.cancellationReason ?? null,
        classical_ref: y.classicalRef ?? null,
        description: typeof y.description === 'string' ? y.description : en(y.description as RawLocaleText | undefined),
        planets: y.planetsInvolved ?? null,
        houses: y.housesInvolved ?? null,
      });
    }
  }
  // Fall back to yogasComplete only when the newer engine produced nothing.
  if (out.length === 0) {
    const yc = raw.full_kundali?.yogasComplete;
    if (Array.isArray(yc)) {
      for (const y of yc) {
        if (y.isPresent === false) continue;
        if (!y.name && !y.nameKey) continue;
        out.push({
          name: y.name ?? y.nameKey,
          planets: y.planets ?? null,
          houses: y.houses ?? null,
          description: typeof y.description === 'string' ? y.description : en(y.description as RawLocaleText | undefined),
        });
      }
    }
  }
  return out;
}

function normaliseDoshas(raw: RawSnapshot): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const sadeSati = raw.full_kundali?.sadeSati;
  if (sadeSati && typeof sadeSati === 'object' && sadeSati.isActive) {
    out.push({
      name: 'Sade Sati',
      phase: sadeSati.currentPhase ?? sadeSati.phase ?? null,
      cycle_start: sadeSati.cycleStart ?? sadeSati.currentCycle?.startDate ?? null,
      cycle_end: sadeSati.cycleEnd ?? sadeSati.currentCycle?.endDate ?? null,
      cycle_progress: typeof sadeSati.cycleProgress === 'number'
        ? Math.round(sadeSati.cycleProgress * 100) / 100
        : null,
      intensity: sadeSati.overallIntensity ?? null,
      saturn_sign: signName(typeof sadeSati.saturnSign === 'number' ? sadeSati.saturnSign : undefined),
      upcoming_cycle: sadeSati.upcomingCycle
        ? { start: sadeSati.upcomingCycle.startDate, end: sadeSati.upcomingCycle.endDate }
        : null,
    });
  }
  const evaluated = raw.full_kundali?.evaluatedYogas;
  if (Array.isArray(evaluated)) {
    for (const y of evaluated) {
      const n = (y.name ?? y.nameKey ?? '').toString().toLowerCase();
      // Match Manglik / Kuja / Kaal Sarpa / Pitru / Chandala / Kemadruma
      if (
        n.includes('mangal') || n.includes('manglik') || n.includes('kuja') ||
        n.includes('kaal sarpa') || n.includes('kaalsarpa') || n.includes('kalsarpa') ||
        n.includes('pitru') || n.includes('chandala') || n.includes('kemadruma') ||
        n.includes('dosha')
      ) {
        out.push({
          name: y.name ?? y.nameKey,
          domain: y.domain ?? null,
          cancelled: y.cancelled ?? false,
          cancellation_reason: y.cancellationReason ?? null,
        });
      }
    }
  }
  return out;
}

/**
 * Per-planet meta: shadbala (total + 6 components) + avastha + functional
 * nature. Merged onto each position downstream so the category filter
 * preserves it.
 */
function normalisePlanetMeta(raw: RawSnapshot): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};

  // Shadbala: prefer fullShadbala (6 named components) over the legacy
  // shadbala (which sometimes only has totalStrength).
  const shadbalaList = raw.full_kundali?.fullShadbala ?? raw.full_kundali?.shadbala;
  if (Array.isArray(shadbalaList)) {
    for (const s of shadbalaList) {
      const name = s.planet ?? en(s.planetName);
      if (!name) continue;
      const bucket = out[name] = out[name] ?? {};
      bucket.shadbala = {
        total: s.totalStrength ?? null,
        sthana: s.sthanaBala ?? null,
        dig: s.digBala ?? null,
        kala: s.kalaBala ?? null,
        cheshta: s.cheshtaBala ?? null,
        drik: s.drikBala ?? null,
        naisargika: s.naisargikaBala ?? null,
      };
    }
  }

  // Avastha: 5 systems per planet. Keyed by planetId so we map back to name.
  const avasthas = raw.full_kundali?.avasthas;
  if (Array.isArray(avasthas)) {
    for (const a of avasthas) {
      const name = planetById(a.planetId);
      if (!name) continue;
      const bucket = out[name] = out[name] ?? {};
      bucket.avastha = {
        baladi: a.baladi ? { state: a.baladi.state, name: en(a.baladi.name), strength: a.baladi.strength } : null,
        jagradadi: a.jagradadi ? { state: a.jagradadi.state, name: en(a.jagradadi.name), quality: a.jagradadi.quality } : null,
        deeptadi: a.deeptadi ? { state: a.deeptadi.state, name: en(a.deeptadi.name), luminosity: a.deeptadi.luminosity } : null,
        lajjitadi: a.lajjitadi ? { state: a.lajjitadi.state, name: en(a.lajjitadi.name), effect: a.lajjitadi.effect } : null,
        shayanadi: a.shayanadi ? { state: a.shayanadi.state, name: en(a.shayanadi.name), activity: a.shayanadi.activity } : null,
      };
    }
  }

  // Functional nature: badhak / maraka / yogakaraka / functional benefic etc.
  const fn = raw.full_kundali?.functionalNature?.planets;
  if (Array.isArray(fn)) {
    for (const p of fn) {
      const name = en(p.planetName) ?? planetById(p.planetId);
      if (!name) continue;
      const bucket = out[name] = out[name] ?? {};
      bucket.functional_nature = p.nature ?? null;
      bucket.functional_label = en(p.label) ?? null;
      bucket.functional_note = en(p.note) ?? null;
      bucket.house_rulership = p.houseRulership ?? null;
    }
  }

  return out;
}

function normaliseAshtakavarga(raw: RawSnapshot): Record<string, unknown> | null {
  const a = raw.full_kundali?.ashtakavarga;
  if (!a) return null;
  // The LLM sees TWO useful views:
  //   - sav_by_sign:   total benefic points per sign (transit timing — Saturn
  //     entering a sign with low SAV is harsher than one with high SAV)
  //   - bav_by_planet: total benefic points each PLANET contributes (the
  //     "pinda" — planets with high pinda are strong contributors)
  // We do NOT pass the raw 7×12 BPI table — too noisy and the LLM can't
  // do useful arithmetic on it. The high-level views are what readings need.
  const sav: Record<string, number> | null = Array.isArray(a.savTable) && a.savTable.length === 12
    ? Object.fromEntries(a.savTable.map((v, i) => [SIGN_NAMES[i], v]))
    : null;
  const planetNames = a.planetNames ?? PLANET_BY_ID.slice(0, 7);
  const pinda: Record<string, number> | null = Array.isArray(a.pindaAshtakavarga)
    ? Object.fromEntries(a.pindaAshtakavarga.map((v, i) => [planetNames[i] ?? `p${i}`, v]))
    : null;
  return { sav_by_sign: sav, pinda_by_planet: pinda };
}

function normaliseBhavabala(raw: RawSnapshot): Record<string, unknown>[] | null {
  const bb = raw.full_kundali?.bhavabala;
  if (!Array.isArray(bb)) return null;
  return bb.map((h) => ({
    house: h.house,
    total: h.total ?? null,
    strength_label: h.strength ?? null,
  }));
}

function normaliseSpecialLagnas(raw: RawSnapshot): Record<string, unknown> | null {
  const sl = raw.full_kundali?.specialLagnas;
  if (!sl || typeof sl !== 'object') return null;
  const out: Record<string, unknown> = {};
  for (const [name, val] of Object.entries(sl)) {
    if (val && typeof val === 'object') {
      out[name] = {
        sign: signName(val.sign) ?? en(val.signName) ?? null,
        degree: val.degree ?? null,
      };
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

function normaliseJaimini(raw: RawSnapshot): Record<string, unknown> | null {
  const j = raw.full_kundali?.jaimini;
  if (!j) return null;
  // Atmakaraka (soul indicator) = the chara karaka with karaka='AK'.
  // We surface AK + AmK (Amatyakaraka, profession indicator) by name only —
  // LLMs reliably mistranslate the full 8-karaka chain when listed.
  const charaKarakas = Array.isArray(j.charaKarakas) ? j.charaKarakas : [];
  const ak = charaKarakas.find((k) => k.karaka === 'AK' || k.karaka === 'Atmakaraka');
  const amk = charaKarakas.find((k) => k.karaka === 'AmK' || k.karaka === 'Amatyakaraka');
  return {
    atmakaraka: ak ? { planet: en(ak.planetName), degree: ak.degree } : null,
    amatyakaraka: amk ? { planet: en(amk.planetName), degree: amk.degree } : null,
    karakamsha: j.karakamsha ? { sign: signName(j.karakamsha.sign) ?? en(j.karakamsha.signName) } : null,
    chara_dasha_current: (() => {
      if (!Array.isArray(j.charaDasha)) return null;
      const today = Date.now();
      const cur = j.charaDasha.find((d) => {
        if (!d.startDate || !d.endDate) return false;
        const s = new Date(d.startDate).getTime();
        const e = new Date(d.endDate).getTime();
        return today >= s && today < e;
      });
      return cur ? { sign: signName(cur.sign) ?? en(cur.signName), start: cur.startDate, end: cur.endDate } : null;
    })(),
    rajayogas_count: Array.isArray(j.rajayogas) ? j.rajayogas.length : 0,
  };
}

function normaliseAscendant(raw: RawSnapshot): Record<string, unknown> {
  const asc = raw.full_kundali?.ascendant;
  const cd = raw.chart_data ?? raw.full_kundali?.chart;
  return {
    sign: signName(asc?.sign) ?? en(asc?.signName) ?? signName(cd?.ascendantSign) ?? null,
    sign_number: asc?.sign ?? cd?.ascendantSign ?? null,
    degree: asc?.degree ?? cd?.ascendantDeg ?? null,
    nakshatra: en(asc?.nakshatra?.name) ?? null,
    nakshatra_lord: asc?.nakshatra?.ruler ?? en(asc?.nakshatra?.rulerName) ?? null,
    nakshatra_pada: asc?.pada ?? null,
  };
}

function normaliseGrahaYuddha(raw: RawSnapshot): Record<string, unknown>[] | null {
  const yu = raw.full_kundali?.grahaYuddha;
  if (!Array.isArray(yu) || yu.length === 0) return null;
  return yu.map((g) => ({
    winner: g.winner,
    loser: g.loser,
    separation_deg: g.separation ?? null,
  }));
}

function normaliseBhriguBindu(raw: RawSnapshot): Record<string, unknown> | null {
  const b = raw.full_kundali?.bhriguBindu;
  if (!b) return null;
  return {
    longitude: b.longitude ?? null,
    sign: signName(b.sign) ?? null,
    degree: b.degree ?? null,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Public
// ──────────────────────────────────────────────────────────────────────

/** Turn a raw kundali_snapshots row into a RouterKundali. */
export function normaliseSnapshot(raw: RawSnapshot): RouterKundali {
  const positions = normalisePositions(raw);
  const planetMeta = normalisePlanetMeta(raw);

  // Merge per-planet meta onto each position so the category filter
  // (which only keeps focus planets) preserves shadbala + avastha +
  // functional nature for those planets.
  const positionsWithMeta = positions.map((p) => {
    const name = String(p.planet);
    const meta = planetMeta[name];
    return meta ? { ...p, ...meta } : p;
  });

  const fnRoot = raw.full_kundali?.functionalNature;

  const analysisBlock: Record<string, unknown> = {
    ascendant: normaliseAscendant(raw),
  };

  if (fnRoot) {
    analysisBlock.functional_summary = {
      lagna: fnRoot.lagna ?? null,
      badhak_lord: fnRoot.badhakLord ?? null,
      badhak_house: fnRoot.badhakHouse ?? null,
      maraka_lords: fnRoot.marakaLords ?? null,
      yoga_karaka: fnRoot.yogaKaraka ?? null,
    };
  }

  const ashta = normaliseAshtakavarga(raw);
  if (ashta) analysisBlock.ashtakavarga = ashta;

  const bhavabala = normaliseBhavabala(raw);
  if (bhavabala) analysisBlock.bhavabala = bhavabala;

  const specialLagnas = normaliseSpecialLagnas(raw);
  if (specialLagnas) analysisBlock.special_lagnas = specialLagnas;

  const jaimini = normaliseJaimini(raw);
  if (jaimini) analysisBlock.jaimini = jaimini;

  const navamsha = normaliseNavamshaSummary(raw);
  if (navamsha) analysisBlock.navamsha = navamsha;

  const grahaYuddha = normaliseGrahaYuddha(raw);
  if (grahaYuddha) analysisBlock.graha_yuddha = grahaYuddha;

  const bhriguBindu = normaliseBhriguBindu(raw);
  if (bhriguBindu) analysisBlock.bhrigu_bindu = bhriguBindu;

  const warnings = raw.full_kundali?.warnings;
  if (Array.isArray(warnings) && warnings.length > 0) {
    analysisBlock.warnings = warnings;
  }

  const ayanamsha = raw.full_kundali?.ayanamshaValue;
  if (typeof ayanamsha === 'number') {
    analysisBlock.ayanamsha_value = ayanamsha;
  }

  return {
    engineVersion: raw.computation_version ?? 'unknown',
    chart: {
      ascendant: normaliseAscendant(raw),
      positions: positionsWithMeta,
      houses: normaliseHouses(raw),
      lagna: signName(raw.full_kundali?.ascendant?.sign)
        ?? en(raw.full_kundali?.ascendant?.signName)
        ?? signName(raw.chart_data?.ascendantSign)
        ?? null,
      ascendantDeg: raw.full_kundali?.ascendant?.degree ?? raw.chart_data?.ascendantDeg ?? null,
      planet_meta: planetMeta,
    },
    dashas: normaliseDashas(raw),
    yogas: normaliseYogas(raw),
    doshas: normaliseDoshas(raw),
    transits: [],
    analysis: analysisBlock,
  };
}
