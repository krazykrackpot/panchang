import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
const SITE = 'sc-domain:dekhopanchang.com';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
const sc = google.searchconsole({ version: 'v1', auth: await auth.getClient() });

const r = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: {
    startDate: '2026-07-18', endDate: '2026-08-14',
    dimensions: ['query'],
    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: 'https://dekhopanchang.com/en/calendar/regional/bengali' }] }],
    rowLimit: 30,
  },
});
console.log('Top queries for /en/calendar/regional/bengali (28d):');
console.log('imps clicks   pos  query');
for (const row of (r.data.rows || []).sort((a, b) => b.impressions - a.impressions)) {
  console.log(String(row.impressions).padStart(4), String(row.clicks).padStart(6), row.position.toFixed(1).padStart(6), ' ', row.keys[0]);
}
