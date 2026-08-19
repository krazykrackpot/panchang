// Diagnose the 2026-08-14 rank slide: compare last 7d vs prior 7d.
// Break down by query and by page. Find where the drop is concentrated.
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const SITE = 'sc-domain:dekhopanchang.com';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const sc = google.searchconsole({ version: 'v1', auth: await auth.getClient() });

// GSC data lags ~3 days; last complete day = today - 3
const RECENT = { start: '2026-08-08', end: '2026-08-14' };
const PRIOR  = { start: '2026-08-01', end: '2026-08-07' };

async function fetchBucket(range, dim) {
  const r = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: { startDate: range.start, endDate: range.end, dimensions: [dim], rowLimit: 500 },
  });
  const map = new Map();
  for (const row of r.data.rows || []) {
    map.set(row.keys[0], { clicks: row.clicks || 0, imps: row.impressions || 0, pos: row.position || 0 });
  }
  return map;
}

function delta(recent, prior) {
  const out = [];
  const keys = new Set([...recent.keys(), ...prior.keys()]);
  for (const k of keys) {
    const r = recent.get(k) || { clicks: 0, imps: 0, pos: 0 };
    const p = prior.get(k) || { clicks: 0, imps: 0, pos: 0 };
    out.push({
      key: k,
      recentImps: r.imps, priorImps: p.imps, impsDelta: r.imps - p.imps,
      recentPos: r.pos, priorPos: p.pos, posDelta: r.pos - p.pos, // + = worse
      recentClicks: r.clicks, priorClicks: p.clicks, clicksDelta: r.clicks - p.clicks,
    });
  }
  return out;
}

function fmt(row, keyLabel) {
  const clickStr = `${String(row.priorClicks).padStart(3)}→${String(row.recentClicks).padEnd(3)}`;
  const impStr   = `${String(row.priorImps).padStart(4)}→${String(row.recentImps).padEnd(4)}`;
  const posStr   = `${row.priorPos.toFixed(1).padStart(5)}→${row.recentPos.toFixed(1).padEnd(5)}`;
  const deltaPos = (row.posDelta >= 0 ? '+' : '') + row.posDelta.toFixed(1);
  const key = String(row.key).slice(0, 60).padEnd(60);
  return `${key} ${clickStr}  ${impStr}  ${posStr}  Δpos=${deltaPos}`;
}

console.log(`Recent:  ${RECENT.start} → ${RECENT.end}`);
console.log(`Prior:   ${PRIOR.start} → ${PRIOR.end}\n`);

// ── Queries where position got worse (had ≥5 imps in either window) ──
const qR = await fetchBucket(RECENT, 'query');
const qP = await fetchBucket(PRIOR, 'query');
const qDelta = delta(qR, qP).filter(r => (r.recentImps + r.priorImps) >= 10);

console.log('━━━━━━ TOP 15 QUERIES BY POSITION DROP (Δpos most positive = worst slide) ━━━━━━');
console.log('query'.padEnd(60), 'clicks       imps         pos');
for (const r of qDelta.sort((a, b) => b.posDelta - a.posDelta).slice(0, 15)) {
  console.log(fmt(r, 'query'));
}

console.log('\n━━━━━━ TOP 15 QUERIES BY IMPRESSION LOSS (had ≥20 prior imps) ━━━━━━');
for (const r of qDelta.filter(r => r.priorImps >= 20).sort((a, b) => a.impsDelta - b.impsDelta).slice(0, 15)) {
  console.log(fmt(r, 'query'));
}

console.log('\n━━━━━━ QUERIES THAT DISAPPEARED (≥10 prior imps, 0 recent) ━━━━━━');
for (const r of qDelta.filter(r => r.priorImps >= 10 && r.recentImps === 0).sort((a, b) => b.priorImps - a.priorImps).slice(0, 15)) {
  console.log(fmt(r, 'query'));
}

// ── Pages ──
const pR = await fetchBucket(RECENT, 'page');
const pP = await fetchBucket(PRIOR, 'page');
const pDelta = delta(pR, pP).filter(r => (r.recentImps + r.priorImps) >= 10);

console.log('\n━━━━━━ TOP 15 PAGES BY IMPRESSION LOSS ━━━━━━');
console.log('page'.padEnd(60), 'clicks       imps         pos');
for (const r of pDelta.filter(r => r.priorImps >= 20).sort((a, b) => a.impsDelta - b.impsDelta).slice(0, 15)) {
  // Strip domain prefix for legibility
  const shortKey = r.key.replace('https://dekhopanchang.com', '');
  console.log(fmt({ ...r, key: shortKey }, 'page'));
}

console.log('\n━━━━━━ TOP 10 PAGES BY POSITION DROP ━━━━━━');
for (const r of pDelta.sort((a, b) => b.posDelta - a.posDelta).slice(0, 10)) {
  const shortKey = r.key.replace('https://dekhopanchang.com', '');
  console.log(fmt({ ...r, key: shortKey }, 'page'));
}
