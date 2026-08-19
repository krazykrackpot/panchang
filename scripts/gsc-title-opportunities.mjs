// Wide diagnostic for title/description fixes.
// Criteria: pages where users SEE us in SERP but don't click →
//   position ≤15  AND  impressions ≥20  AND  CTR <2%
// For each hit, fetch the top query so we can judge whether it's a
// genuine title problem (fixable) vs an intent/hreflang problem (skip).
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const SITE = 'sc-domain:dekhopanchang.com';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const sc = google.searchconsole({ version: 'v1', auth: await auth.getClient() });

const start = '2026-07-18';
const end = '2026-08-14';

const r = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 2000 },
});

const rows = (r.data.rows || []).map(row => ({
  page: row.keys[0].replace('https://dekhopanchang.com', '').replace('https://www.dekhopanchang.com', ''),
  clicks: row.clicks || 0,
  imps: row.impressions || 0,
  pos: row.position || 0,
  ctr: (row.ctr || 0) * 100,
}));

// Title-opportunity: seen but not clicked
const opps = rows
  .filter(r => r.imps >= 20 && r.pos <= 15 && r.ctr < 2 && r.clicks <= 1)
  .sort((a, b) => b.imps - a.imps)
  .slice(0, 25);

console.log(`Found ${opps.length} pages with imps≥20, pos≤15, CTR<2%\n`);
console.log('page'.padEnd(58), 'imps'.padStart(5), 'clk'.padStart(4), 'pos'.padStart(5), 'CTR%'.padStart(6), '  top query');

for (const p of opps) {
  // Fetch top query for this page
  const q = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: {
      startDate: start, endDate: end, dimensions: ['query'],
      dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: 'https://dekhopanchang.com' + p.page }] }],
      rowLimit: 1,
    },
  });
  const topQ = q.data.rows?.[0]?.keys[0] || '(no query data)';
  console.log(
    p.page.slice(0, 58).padEnd(58),
    String(p.imps).padStart(5),
    String(p.clicks).padStart(4),
    p.pos.toFixed(1).padStart(5),
    p.ctr.toFixed(1).padStart(6),
    ' ',
    topQ.slice(0, 40),
  );
}
