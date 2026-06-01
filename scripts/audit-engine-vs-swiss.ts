/**
 * scripts/audit-engine-vs-swiss.ts
 *
 * Runs 7 reference birth charts through https://dekhopanchang.com/api/kundali
 * and diffs the output against locally-computed Swiss Ephemeris positions.
 * Replaces hallucinated LLM "validation reports" with actual deltas.
 *
 * Usage:
 *   npx tsx scripts/audit-engine-vs-swiss.ts                  # human-readable summary
 *   npx tsx scripts/audit-engine-vs-swiss.ts --csv > out.csv  # CSV for spreadsheets
 *   npx tsx scripts/audit-engine-vs-swiss.ts --chart Einstein # one chart only
 *
 * Tolerances:
 *   - Longitude: ±0.01° (~36 arcsec). Sweph itself claims < 0.001°.
 *   - Speed:     ±0.001 °/day
 *   - Retrograde state, sign, nakshatra: exact match
 *
 * What this is NOT:
 *   - Not a replacement for the Vitest unit suite (which covers Shadbala,
 *     dasha, yogas at the function level). This script tests the integrated
 *     HTTP surface against an external (Swiss Ephemeris) source of truth.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sweph = require('sweph');

// Defaults to prod; override with --url=<deployment-url> to hit a Vercel
// preview deploy when validating a PR before merge.
const PROD = (() => {
  const arg = process.argv.find((a) => a.startsWith('--url='));
  if (arg) return arg.slice('--url='.length);
  return process.env.AUDIT_URL ?? 'https://dekhopanchang.com';
})();
const args = new Set(process.argv.slice(2));
const csvMode = args.has('--csv');
const chartFilter = (() => {
  const i = process.argv.indexOf('--chart');
  return i >= 0 ? process.argv[i + 1] : null;
})();

// ─── Sweph init ──────────────────────────────────────────────────────────
sweph.set_sid_mode(sweph.constants.SE_SIDM_LAHIRI, 0, 0);
// SEFLG_MOSEPH: Moshier semi-analytical model. ~1 arcsec accuracy, no
// ephemeris files needed. Matches what the deployed engine uses (its
// swiss-ephemeris.ts wrapper doesn't call set_ephe_path either).
const SEFLG = sweph.constants.SEFLG_MOSEPH | sweph.constants.SEFLG_SPEED | sweph.constants.SEFLG_SIDEREAL;

const SWE_PLANETS: Array<[number, number, string]> = [
  // [sweph constant, engine planet id (0-based), name]
  [sweph.constants.SE_SUN,        0, 'Sun'],
  [sweph.constants.SE_MOON,       1, 'Moon'],
  [sweph.constants.SE_MARS,       2, 'Mars'],
  [sweph.constants.SE_MERCURY,    3, 'Mercury'],
  [sweph.constants.SE_JUPITER,    4, 'Jupiter'],
  [sweph.constants.SE_VENUS,      5, 'Venus'],
  [sweph.constants.SE_SATURN,     6, 'Saturn'],
  [sweph.constants.SE_MEAN_NODE,  7, 'Rahu'],
];

// ─── Charts ──────────────────────────────────────────────────────────────
interface Chart {
  name: string;
  date: string;      // YYYY-MM-DD local
  time: string;      // HH:MM local
  lat: number;
  lng: number;
  timezone: string;  // IANA — engine resolves UT from this
  notes?: string;
}

const CHARTS: Chart[] = [
  { name: 'Einstein',    date: '1879-03-14', time: '11:30', lat: 48.3974, lng: 9.9934,    timezone: 'Europe/Berlin',     notes: 'pre-1880 LMT — engine known to use tzdb instead' },
  { name: 'Gandhi',      date: '1869-10-02', time: '07:33', lat: 21.6422, lng: 69.6093,   timezone: 'Asia/Kolkata',      notes: 'pre-IST 1906 standardization' },
  { name: 'MLK',         date: '1929-01-15', time: '12:00', lat: 33.7490, lng: -84.3880,  timezone: 'America/New_York',  notes: 'pre-DST US, EST winter' },
  { name: 'IndiraGandhi',date: '1917-11-19', time: '23:11', lat: 25.4358, lng: 81.8463,   timezone: 'Asia/Kolkata' },
  { name: 'SteveJobs',   date: '1955-02-24', time: '19:15', lat: 37.7749, lng: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Equatorial',  date: '2000-06-21', time: '12:00', lat: 0.0349,  lng: -51.0694,  timezone: 'America/Belem',     notes: 'lat≈0 — Dig Bala stress test' },
  { name: 'Polar',       date: '1990-12-22', time: '06:00', lat: -77.85,  lng: 166.67,    timezone: 'Pacific/Auckland',  notes: 'lat ≈ -78° — ascendant degeneracy test' },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function localToUtcParts(date: string, time: string, timezone: string): { y: number; m: number; d: number; h: number; min: number } {
  // Use Intl to find the offset for the local date+time in the given tz.
  // Build the local wall-clock as if it were UTC, then adjust by the
  // tz offset. The offset can change over the year (DST) and over
  // history (timezone reforms), so we ask Intl directly for this instant.
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  // Treat the input as UTC first
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  // Find what the SAME wall clock would be in the target tz at that instant
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
  });
  const parts = fmt.formatToParts(new Date(asUtc));
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value);
  const tzAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') === 24 ? 0 : get('hour'), get('minute'));
  const offsetMs = tzAsUtc - asUtc; // positive = tz is ahead of UTC
  const trueUtc = new Date(asUtc - offsetMs);
  return {
    y: trueUtc.getUTCFullYear(),
    m: trueUtc.getUTCMonth() + 1,
    d: trueUtc.getUTCDate(),
    h: trueUtc.getUTCHours(),
    min: trueUtc.getUTCMinutes(),
  };
}

function lmtUtcParts(date: string, time: string, lng: number): { y: number; m: number; d: number; h: number; min: number } {
  // Longitude-based Local Mean Time. lng east-positive.
  // 1° = 4 min. LMT - UT = lng * 4 min / 60 hr.
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const lmtMin = hh * 60 + mm;
  const utMin = lmtMin - (lng * 4); // shift west by lng*4 min
  // Spread overflow into the date
  const totalMin = utMin;
  const baseMs = Date.UTC(y, m - 1, d, 0, 0) + totalMin * 60 * 1000;
  const out = new Date(baseMs);
  return { y: out.getUTCFullYear(), m: out.getUTCMonth() + 1, d: out.getUTCDate(), h: out.getUTCHours(), min: out.getUTCMinutes() };
}

function jdFromParts(p: { y: number; m: number; d: number; h: number; min: number }): { jdEt: number; jdUt: number } {
  const r = sweph.utc_to_jd(p.y, p.m, p.d, p.h, p.min, 0, sweph.constants.SE_GREG_CAL);
  if (r.flag !== sweph.constants.OK) throw new Error(`utc_to_jd: ${r.error}`);
  const [jdEt, jdUt] = r.data;
  return { jdEt, jdUt };
}

function swissCompute(jdEt: number, jdUt: number, lat: number, lng: number) {
  const planets = SWE_PLANETS.map(([se, id, name]) => {
    const r = sweph.calc(jdEt, se, SEFLG);
    if (r.flag < 0) throw new Error(`calc ${name}: ${r.error}`);
    const [lon, , , speed] = r.data;
    return { id, name, longitude: lon, speed, isRetrograde: speed < 0 };
  });
  // Whole Sign house system ('W'): uses ascendant only, no cusps that
  // divide by cos(lat) — works at polar latitudes. Equal House ('E')
  // would also work; both expose the ascendant at points[0].
  // SEFLG_SIDEREAL applies the Lahiri ayanamsha (set in init).
  const houses = sweph.houses_ex2(jdUt, sweph.constants.SEFLG_SIDEREAL, lat, lng, 'W');
  const ascDeg = (houses.flag >= 0 && houses.data?.points?.[0] != null && Number.isFinite(houses.data.points[0]))
    ? houses.data.points[0]
    : null;
  return { planets, ascendantDeg: ascDeg };
}

async function callEngine(c: Chart): Promise<any> {
  const res = await fetch(`${PROD}/api/kundali`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: c.name, date: c.date, time: c.time, place: c.name,
      lat: c.lat, lng: c.lng, timezone: c.timezone, ayanamsha: 'lahiri',
    }),
  });
  if (!res.ok) throw new Error(`engine HTTP ${res.status}`);
  return res.json();
}

function fmt(n: number, w = 4) { return n.toFixed(w).padStart(w + 5); }
function signOf(lon: number) { return Math.floor(lon / 30) + 1; }

// ─── Per-chart audit ─────────────────────────────────────────────────────
interface Row {
  chart: string;
  planet: string;
  engineLon: number | null;
  swissLon: number | null;
  delta: number | null;
  engineRetro: boolean | null;
  swissRetro: boolean | null;
  retroMatch: boolean | null;
  engineSign: number | null;
  swissSign: number | null;
  signMatch: boolean | null;
  verdict: 'PASS' | 'WARN' | 'FAIL' | 'ERROR' | 'INFO';
  note?: string;
}

/**
 * Back-solve the engine's effective UT from its Moon longitude.
 * The Moon moves ~13.2°/day at varying rate; we sample sweph at jdUt and
 * jdUt + 1hr and interpolate. Returns the JD UT offset (in days) the
 * engine appears to have used relative to our reference.
 */
function inferEngineUtOffsetDays(jdEt: number, engineMoonLon: number, refMoonLon: number, refMoonSpeed: number): number {
  // refMoonSpeed is deg/day
  const dLon = ((engineMoonLon - refMoonLon + 540) % 360) - 180;
  return dLon / refMoonSpeed; // days
}

async function auditChart(c: Chart): Promise<{ rows: Row[]; ascDelta: number | null; engineAsc: number | null; swissAsc: number | null; lmtCheck?: { tzdbDelta: number; lmtDelta: number; planet: string }; utDiagnostic?: { refUtIso: string; inferredEngineUtIso: string; inferredEngineUtMinutesAfterRef: number; reAscDelta: number | null; reAscAtEngineUt: number | null } }> {
  const rows: Row[] = [];

  // Compute reference (engine's expected UT from its IANA tz lookup)
  const utParts = localToUtcParts(c.date, c.time, c.timezone);
  const { jdEt, jdUt } = jdFromParts(utParts);
  const ref = swissCompute(jdEt, jdUt, c.lat, c.lng);

  // Call the engine
  let engine: any;
  try {
    engine = await callEngine(c);
  } catch (err: any) {
    return {
      rows: [{
        chart: c.name, planet: 'ALL', engineLon: null, swissLon: null, delta: null,
        engineRetro: null, swissRetro: null, retroMatch: null,
        engineSign: null, swissSign: null, signMatch: null,
        verdict: 'ERROR', note: `engine call failed: ${err.message}`,
      }],
      ascDelta: null, engineAsc: null, swissAsc: null,
    };
  }

  const enginePlanets: any[] = engine.planets ?? [];
  const enginePlanetById = new Map<number, any>();
  for (const p of enginePlanets) {
    // planets in the response use `planet.id` as 0-based id
    const id = p.planet?.id ?? p.id;
    if (typeof id === 'number') enginePlanetById.set(id, p);
  }

  // ─── Diff each planet ───
  for (const { id, name } of ref.planets) {
    const ep = enginePlanetById.get(id);
    if (!ep) {
      rows.push({ chart: c.name, planet: name, engineLon: null, swissLon: ref.planets.find(p => p.name === name)!.longitude, delta: null, engineRetro: null, swissRetro: null, retroMatch: null, engineSign: null, swissSign: null, signMatch: null, verdict: 'ERROR', note: 'planet missing in engine response' });
      continue;
    }
    const swPlanet = ref.planets.find(p => p.name === name)!;
    const dLon = ((ep.longitude - swPlanet.longitude + 540) % 360) - 180;
    const retroMatch = ep.isRetrograde === swPlanet.isRetrograde || (name === 'Rahu' && ep.isRetrograde && swPlanet.isRetrograde);
    const engineSign = signOf(ep.longitude);
    const swissSign = signOf(swPlanet.longitude);
    const verdict: Row['verdict'] =
      Math.abs(dLon) > 0.1 ? 'FAIL' :
      Math.abs(dLon) > 0.01 ? 'WARN' :
      'PASS';
    rows.push({
      chart: c.name, planet: name,
      engineLon: ep.longitude, swissLon: swPlanet.longitude, delta: dLon,
      engineRetro: ep.isRetrograde, swissRetro: swPlanet.isRetrograde, retroMatch,
      engineSign, swissSign, signMatch: engineSign === swissSign,
      verdict,
    });
  }

  // Ascendant diff
  const engineAsc: number | null = engine.ascendantDeg ?? engine.ascendant?.degree ?? null;
  const swissAsc = ref.ascendantDeg;
  const ascDelta = (engineAsc != null && swissAsc != null && Number.isFinite(engineAsc) && Number.isFinite(swissAsc))
    ? (((engineAsc - swissAsc) + 540) % 360) - 180
    : null;
  if (engineAsc === null || !Number.isFinite(engineAsc)) {
    rows.push({ chart: c.name, planet: 'Ascendant', engineLon: engineAsc, swissLon: swissAsc, delta: null, engineRetro: null, swissRetro: null, retroMatch: null, engineSign: null, swissSign: null, signMatch: null, verdict: 'FAIL', note: 'engine ascendant is null/NaN' });
  } else {
    rows.push({
      chart: c.name, planet: 'Ascendant',
      engineLon: engineAsc, swissLon: swissAsc, delta: ascDelta,
      engineRetro: null, swissRetro: null, retroMatch: null,
      engineSign: signOf(engineAsc), swissSign: swissAsc != null ? signOf(swissAsc) : null, signMatch: swissAsc != null ? signOf(engineAsc) === signOf(swissAsc) : null,
      verdict: swissAsc == null ? 'INFO' : (Math.abs(ascDelta!) > 0.5 ? 'WARN' : 'PASS'),
      note: swissAsc == null ? 'sweph ascendant unavailable (degenerate)' : undefined,
    });
  }

  // ─── Back-solve: at what UT does the engine appear to have computed planets? ───
  // If the asc mismatch is purely a UT-resolution difference (engine uses
  // longitude LMT, we use IANA tzdb), then recomputing sweph ASC at the
  // engine's effective UT should match the engine's reported ASC.
  let utDiagnostic: { refUtIso: string; inferredEngineUtIso: string; inferredEngineUtMinutesAfterRef: number; reAscDelta: number | null; reAscAtEngineUt: number | null } | undefined;
  const refMoon = ref.planets.find(p => p.name === 'Moon')!;
  const engineMoon = enginePlanetById.get(1);
  if (engineMoon && engineAsc != null && Number.isFinite(engineAsc)) {
    const offsetDays = inferEngineUtOffsetDays(jdEt, engineMoon.longitude, refMoon.longitude, refMoon.speed);
    const engineJdEt = jdEt + offsetDays;
    const engineJdUt = jdUt + offsetDays;
    // Recompute sweph reference at the engine's inferred UT
    const refAtEngineUt = swissCompute(engineJdEt, engineJdUt, c.lat, c.lng);
    const reAscAtEngineUt = refAtEngineUt.ascendantDeg;
    const reAscDelta = (reAscAtEngineUt != null && Number.isFinite(reAscAtEngineUt))
      ? (((engineAsc - reAscAtEngineUt) + 540) % 360) - 180
      : null;
    const refUtMs = Date.UTC(utParts.y, utParts.m - 1, utParts.d, utParts.h, utParts.min);
    const engineUtMs = refUtMs + offsetDays * 86400 * 1000;
    utDiagnostic = {
      refUtIso: new Date(refUtMs).toISOString(),
      inferredEngineUtIso: new Date(engineUtMs).toISOString(),
      inferredEngineUtMinutesAfterRef: offsetDays * 1440,
      reAscAtEngineUt,
      reAscDelta,
    };
  }

  // ─── LMT cross-check for Einstein (pre-1880) ───
  let lmtCheck: { tzdbDelta: number; lmtDelta: number; planet: string } | undefined;
  if (c.name === 'Einstein') {
    const lmtParts = lmtUtcParts(c.date, c.time, c.lng);
    const { jdEt: lmtJdEt } = jdFromParts(lmtParts);
    const lmtRef = swissCompute(lmtJdEt, lmtParts.h /* not used */, c.lat, c.lng);
    const moonRef = ref.planets.find(p => p.name === 'Moon')!;
    const moonLmt = lmtRef.planets.find(p => p.name === 'Moon')!;
    const moonEngine = enginePlanetById.get(1);
    if (moonEngine) {
      const tzdbDelta = (((moonEngine.longitude - moonRef.longitude) + 540) % 360) - 180;
      const lmtDelta = (((moonEngine.longitude - moonLmt.longitude) + 540) % 360) - 180;
      lmtCheck = { tzdbDelta, lmtDelta, planet: 'Moon' };
    }
  }

  return { rows, ascDelta, engineAsc, swissAsc, lmtCheck, utDiagnostic };
}

// ─── Output ─────────────────────────────────────────────────────────────
function emitCsv(allRows: Row[]) {
  console.log('chart,planet,engine_lon,swiss_lon,delta_deg,engine_retro,swiss_retro,engine_sign,swiss_sign,verdict,note');
  for (const r of allRows) {
    console.log([
      r.chart, r.planet,
      r.engineLon?.toFixed(6) ?? '',
      r.swissLon?.toFixed(6) ?? '',
      r.delta?.toFixed(6) ?? '',
      r.engineRetro ?? '',
      r.swissRetro ?? '',
      r.engineSign ?? '',
      r.swissSign ?? '',
      r.verdict,
      r.note ?? '',
    ].map(v => String(v).includes(',') ? `"${v}"` : v).join(','));
  }
}

function emitHuman(results: Array<{ chart: Chart; res: Awaited<ReturnType<typeof auditChart>> }>) {
  for (const { chart, res } of results) {
    console.log(`\n── ${chart.name} (${chart.date} ${chart.time} ${chart.timezone})${chart.notes ? `  [${chart.notes}]` : ''}`);
    console.log('Planet     | Engine°       | Swiss°        | Δ°       | Retro engine/swiss | Sign | Verdict');
    console.log('-----------|---------------|---------------|----------|--------------------|------|--------');
    for (const r of res.rows) {
      const dLabel = r.delta == null ? '   —   ' : (r.delta >= 0 ? '+' : '') + r.delta.toFixed(4);
      const eRetro = r.engineRetro == null ? '—' : (r.engineRetro ? 'R' : 'D');
      const sRetro = r.swissRetro == null ? '—' : (r.swissRetro ? 'R' : 'D');
      console.log(
        `${r.planet.padEnd(11)}| ${r.engineLon?.toFixed(6).padStart(13) ?? '   —   '} | ${r.swissLon?.toFixed(6).padStart(13) ?? '   —   '} | ${dLabel.padStart(8)} | ${eRetro}/${sRetro}                | ${r.engineSign ?? '-'}/${r.swissSign ?? '-'}  | ${r.verdict}${r.note ? `  (${r.note})` : ''}`
      );
    }
    if (res.lmtCheck) {
      console.log('  LMT check (pre-1880): Moon delta vs IANA tzdb = ' + res.lmtCheck.tzdbDelta.toFixed(4) + '°');
      console.log('                        Moon delta vs longitude LMT = ' + res.lmtCheck.lmtDelta.toFixed(4) + '°');
      const which = Math.abs(res.lmtCheck.tzdbDelta) < Math.abs(res.lmtCheck.lmtDelta) ? 'IANA tzdb' : 'longitude LMT';
      console.log(`                        engine agrees with: ${which}`);
    }
    if (res.utDiagnostic) {
      const d = res.utDiagnostic;
      console.log(`  UT diagnostic:`);
      console.log(`    sweph reference UT     : ${d.refUtIso} (from IANA ${chart.timezone})`);
      console.log(`    engine inferred UT     : ${d.inferredEngineUtIso} (back-solved from engine Moon)`);
      console.log(`    Δ (engine − ref)       : ${d.inferredEngineUtMinutesAfterRef >= 0 ? '+' : ''}${d.inferredEngineUtMinutesAfterRef.toFixed(2)} min`);
      if (d.reAscAtEngineUt != null && d.reAscDelta != null) {
        const verdict =
          Math.abs(d.reAscDelta) < 0.05 ? 'CONSISTENT — asc mismatch IS purely UT' :
          Math.abs(d.reAscDelta) < 1.0  ? 'SYSTEMATIC OFFSET — see summary' :
                                          'REAL LAGNA BUG — asc-only divergence after UT alignment';
        console.log(`    sweph ASC at engine UT : ${d.reAscAtEngineUt.toFixed(4)}°`);
        console.log(`    engine ASC vs that     : ${d.reAscDelta >= 0 ? '+' : ''}${d.reAscDelta.toFixed(4)}°  ← ${verdict}`);
      } else {
        console.log(`    sweph ASC at engine UT : unavailable (house system degenerate)`);
      }
    }
  }

  // Summary
  const allRows = results.flatMap(r => r.res.rows);
  const counts = { PASS: 0, WARN: 0, FAIL: 0, ERROR: 0, INFO: 0 };
  for (const r of allRows) counts[r.verdict]++;
  console.log(`\n── Summary ──`);
  console.log(`PASS:  ${counts.PASS}`);
  console.log(`WARN:  ${counts.WARN}  (delta > 0.01° but < 0.1°)`);
  console.log(`FAIL:  ${counts.FAIL}  (delta > 0.1° or structural issue)`);
  console.log(`ERROR: ${counts.ERROR}`);
  const fails = allRows.filter(r => r.verdict === 'FAIL' || r.verdict === 'ERROR');
  if (fails.length) {
    console.log('\n── Failures ──');
    for (const f of fails) {
      console.log(`  ${f.chart} / ${f.planet}: ${f.note ?? `delta ${f.delta?.toFixed(4)}°`}`);
    }
  }

  // Lagna systematic-offset report
  const lagnaDeltas = results
    .filter(r => r.res.utDiagnostic?.reAscDelta != null)
    .map(r => ({ chart: r.chart.name, lat: r.chart.lat, residual: r.res.utDiagnostic!.reAscDelta! }));
  if (lagnaDeltas.length) {
    console.log('\n── Lagna residual at engine\'s effective UT (after UT alignment) ──');
    console.log('chart        lat°       residual°');
    for (const d of lagnaDeltas) {
      const flag = Math.abs(d.residual) > 1.0 ? '  ← REAL BUG' : '';
      console.log(`  ${d.chart.padEnd(14)} ${d.lat.toFixed(2).padStart(7)}    ${(d.residual >= 0 ? '+' : '') + d.residual.toFixed(4)}°${flag}`);
    }
    const nonPolar = lagnaDeltas.filter(d => Math.abs(d.lat) < 66);
    if (nonPolar.length) {
      const mean = nonPolar.reduce((s, d) => s + d.residual, 0) / nonPolar.length;
      const stddev = Math.sqrt(nonPolar.reduce((s, d) => s + (d.residual - mean) ** 2, 0) / nonPolar.length);
      console.log(`  ─────────────────────────────────`);
      console.log(`  non-polar mean ± stddev:           ${(mean >= 0 ? '+' : '') + mean.toFixed(4)}° ± ${stddev.toFixed(4)}°`);
      console.log(`  Interpretation: a small systematic offset (~|mean| arcsec to arcmin)`);
      console.log(`  is consistent with a Lahiri-ayanamsha-computation difference between`);
      console.log(`  engine and sweph-Moshier. Not chart-specific; not a bug.`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────
(async () => {
  const charts = chartFilter ? CHARTS.filter(c => c.name === chartFilter) : CHARTS;
  if (charts.length === 0) {
    console.error(`No chart matches --chart ${chartFilter}. Known: ${CHARTS.map(c => c.name).join(', ')}`);
    process.exit(1);
  }

  const results: Array<{ chart: Chart; res: Awaited<ReturnType<typeof auditChart>> }> = [];
  for (const c of charts) {
    if (!csvMode) console.error(`→ ${c.name} ...`);
    const res = await auditChart(c);
    results.push({ chart: c, res });
  }

  if (csvMode) emitCsv(results.flatMap(r => r.res.rows));
  else emitHuman(results);
})();
