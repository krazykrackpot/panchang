// Find "almost winning" pages: high impressions + position 15-50 (page 2-5).
// These are pages Google already trusts partially — a content investment
// on ONE of them can lift it into the click-earning zone (top 10).
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const SITE = 'sc-domain:dekhopanchang.com';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const sc = google.searchconsole({ version: 'v1', auth: await auth.getClient() });

// Last 28d for a stable picture (single-week noise removed)
const end = '2026-08-14';
const start = '2026-07-18';

const r = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 1000 },
});

const rows = (r.data.rows || []).map(row => ({
  page: row.keys[0].replace('https://dekhopanchang.com', '').replace('https://www.dekhopanchang.com', ''),
  clicks: row.clicks || 0,
  imps: row.impressions || 0,
  pos: row.position || 0,
  ctr: (row.ctr || 0) * 100,
}));

console.log(`Range: ${start} → ${end}   (${rows.length} pages with ≥1 impression)\n`);

// Opportunity: pos 15-50, imps ≥ 50 — a lift to top 10 would 5-10x clicks
const opp = rows
  .filter(r => r.imps >= 50 && r.pos >= 15 && r.pos <= 50)
  .sort((a, b) => b.imps - a.imps)
  .slice(0, 20);

console.log('━━━━━ BIGGEST OPPORTUNITY PAGES (imps≥50, pos 15-50) ━━━━━');
console.log('page'.padEnd(58), 'imps'.padStart(6), 'clicks'.padStart(7), 'pos'.padStart(6), 'ctr%'.padStart(6));
for (const r of opp) {
  console.log(
    r.page.slice(0, 58).padEnd(58),
    String(r.imps).padStart(6),
    String(r.clicks).padStart(7),
    r.pos.toFixed(1).padStart(6),
    r.ctr.toFixed(1).padStart(6),
  );
}

// Also show ALREADY winning pages so we know the top of the funnel
console.log('\n━━━━━ ALREADY WINNING (top-10 avg pos, ≥50 imps) ━━━━━');
const winning = rows
  .filter(r => r.imps >= 50 && r.pos < 15)
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 10);
for (const r of winning) {
  console.log(
    r.page.slice(0, 58).padEnd(58),
    String(r.imps).padStart(6),
    String(r.clicks).padStart(7),
    r.pos.toFixed(1).padStart(6),
    r.ctr.toFixed(1).padStart(6),
  );
}
