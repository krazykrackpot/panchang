/**
 * Minimal Google Search Console client for server-side cron use.
 *
 * Auth: OAuth refresh token (matches the existing scripts/gsc-auth.ts
 * setup). Per `feedback_google_oauth_separation` memory the long-term
 * direction is a service account, but the existing infrastructure
 * already has GSC_REFRESH_TOKEN provisioned and we don't want to gate
 * the SEO-health cron on a service-account migration.
 *
 * Required env vars in production:
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GSC_REFRESH_TOKEN
 *
 * Without these the cron returns 500 with a clear "[gsc] missing OAuth
 * env" message so the operator can identify the config gap.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const SITE_URL = 'sc-domain:dekhopanchang.com';
export const QUERY_ENDPOINT = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Exchange the long-lived refresh token for a short-lived access token.
 * Refresh tokens don't expire automatically (only on revoke), so this
 * is the only credential the cron needs at runtime.
 */
export async function getGscAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GSC_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('[gsc] missing OAuth env: GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GSC_REFRESH_TOKEN');
  }
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) {
    throw new Error(`[gsc] token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error('[gsc] token exchange returned no access_token');
  }
  return data.access_token;
}

/** POST a Search Analytics query and return the rows (or []). */
export async function queryGsc(
  token: string,
  body: Record<string, unknown>,
): Promise<GscRow[]> {
  const res = await fetch(QUERY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`[gsc] query failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json() as { rows?: GscRow[] };
  return data.rows ?? [];
}
