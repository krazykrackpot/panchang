/**
 * Minimal Google Search Console client for server-side cron use.
 *
 * Auth: service-account / ADC via google-auth-library's JWT class.
 * Falls back to the legacy OAuth refresh-token flow when the
 * service-account env vars aren't present — so the migration to ADC
 * is non-breaking. Once GOOGLE_SERVICE_ACCOUNT_EMAIL and
 * GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are set in Vercel, the OAuth env
 * vars can be removed.
 *
 * Per `feedback_gsc_use_adc` memory: GSC API treats service accounts
 * as first-class principals; OAuth refresh tokens get revoked when a
 * Google account's password changes or 2FA settings shift, which has
 * already broken the daily indexing-request cron once. ADC eliminates
 * that class of failure entirely.
 *
 * To finish the migration end-to-end:
 *   1. Create a service account in the panchang GCP project
 *   2. Grant it "Restricted access" → Search Console → "Full" via
 *      https://search.google.com/search-console/users
 *   3. Generate a JSON key, copy the `client_email` and `private_key`
 *      fields into Vercel env vars
 *   4. Remove GSC_REFRESH_TOKEN / GOOGLE_OAUTH_CLIENT_SECRET from
 *      production once the cron has logged at least one successful run
 *      with the service-account path
 *
 * Required env vars in production (either set):
 *   --- service-account path (preferred) ---
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY  (PEM, with literal "\n" preserved
 *                                        as in the JSON key file)
 *
 *   --- legacy OAuth path (fallback during migration) ---
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GSC_REFRESH_TOKEN
 *
 * Without either set, the cron returns a clear "[gsc] no auth env"
 * error so the operator can identify the config gap.
 */

import { JWT } from 'google-auth-library';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
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
 * Get a short-lived access token for GSC.
 *
 * Service-account path: mint a JWT signed with the service account's
 * private key, exchange for an access token. The JWT library caches
 * tokens internally — a single cron invocation only does one network
 * round-trip to Google.
 *
 * Legacy fallback: exchange the long-lived OAuth refresh token for an
 * access token. Kept so the migration to ADC can roll out in two
 * pushes (1: deploy this client, 2: flip env vars) without a window
 * where the cron is broken.
 */
export async function getGscAccessToken(): Promise<string> {
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const saPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();

  if (saEmail && saPrivateKey) {
    // Vercel stores multi-line env values with literal "\n" sequences;
    // the JWT library needs real newlines in the PEM.
    const pemKey = saPrivateKey.replace(/\\n/g, '\n');
    const jwt = new JWT({
      email: saEmail,
      key: pemKey,
      scopes: [GSC_SCOPE],
    });
    const tokenResponse = await jwt.authorize();
    if (!tokenResponse.access_token) {
      throw new Error('[gsc] service-account JWT exchange returned no access_token');
    }
    return tokenResponse.access_token;
  }

  // Legacy OAuth refresh-token path
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GSC_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      '[gsc] no auth env: set either GOOGLE_SERVICE_ACCOUNT_EMAIL + ' +
        'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (preferred) or GOOGLE_OAUTH_CLIENT_ID + ' +
        'GOOGLE_OAUTH_CLIENT_SECRET + GSC_REFRESH_TOKEN (legacy)',
    );
  }
  console.warn(
    '[gsc] using legacy OAuth refresh-token auth — migrate to service account; ' +
      'see docs at top of src/lib/seo/gsc-client.ts',
  );
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
    throw new Error(`[gsc] OAuth token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error('[gsc] OAuth token exchange returned no access_token');
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
