// For each zero-click page, list its top queries so we can rewrite titles
// against actual user intent (not our guesses).
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const SITE = 'sc-domain:dekhopanchang.com';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const sc = google.searchconsole({ version: 'v1', auth: await auth.getClient() });

const PAGES = [
  'https://dekhopanchang.com/en/festivals/raksha-bandhan/2026',
  'https://dekhopanchang.com/en/festivals/ganesh-chaturthi/2028',
  'https://dekhopanchang.com/en/upagraha',
  'https://dekhopanchang.com/kn/hindu-calendar/2027',
  'https://dekhopanchang.com/hi/horoscope/tula',
];

for (const page of PAGES) {
  const r = await sc.searchanalytics.query({
    siteUrl: SITE,
    requestBody: {
      startDate: '2026-07-18',
      endDate: '2026-08-14',
      dimensions: ['query'],
      dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: page }] }],
      rowLimit: 10,
    },
  });
  console.log(`\n═══ ${page.replace('https://dekhopanchang.com', '')} ═══`);
  const rows = (r.data.rows || []).sort((a, b) => b.impressions - a.impressions);
  if (rows.length === 0) { console.log('  (no query data)'); continue; }
  for (const row of rows) {
    console.log(`  ${String(row.impressions).padStart(4)} imps  ${String(row.clicks).padStart(2)} clicks  pos ${row.position.toFixed(1).padStart(5)}  "${row.keys[0]}"`);
  }
}
