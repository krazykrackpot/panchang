#!/usr/bin/env npx tsx
/**
 * Submit (or re-submit) the sitemap to Google Search Console.
 *
 * Usage: npx tsx scripts/gsc-submit-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const GSC_PROPERTY = 'sc-domain:dekhopanchang.com';
const SITEMAP_URL = 'https://dekhopanchang.com/sitemap.xml';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

/** Get an access token from ADC credentials or service account key */
async function getAccessToken(): Promise<string> {
  loadEnv();

  // 1. Service account key
  const keyPath = process.env.GSC_SERVICE_ACCOUNT_KEY_PATH?.trim();
  if (keyPath && fs.existsSync(path.resolve(keyPath))) {
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(keyPath),
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token!;
  }

  // 2. ADC refresh token (from gcloud auth application-default login)
  const adcPath = path.join(process.env.HOME || '', '.config/gcloud/application_default_credentials.json');
  if (fs.existsSync(adcPath)) {
    const adcData = JSON.parse(fs.readFileSync(adcPath, 'utf-8'));
    if (adcData.refresh_token) {
      console.log('Refreshing token from ADC...');
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: adcData.client_id,
          client_secret: adcData.client_secret,
          refresh_token: adcData.refresh_token,
          grant_type: 'refresh_token',
        }),
      });
      if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
      const { access_token } = await res.json() as { access_token: string };
      return access_token;
    }
  }

  throw new Error('No credentials found. Run: gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/cloud-platform');
}

/** Raw GSC API call — bypasses googleapis library quota project detection */
async function gscApi(method: string, endpoint: string, token: string): Promise<any> {
  const base = 'https://searchconsole.googleapis.com/webmasters/v3';
  const url = `${base}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-goog-user-project': 'dekhopanchang',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GSC API ${method} ${endpoint} → ${res.status}: ${body}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return {};
  return res.json();
}

async function main() {
  const token = await getAccessToken();
  console.log('Authenticated.');

  const siteUrl = encodeURIComponent(GSC_PROPERTY);

  // List current sitemaps
  console.log('\nCurrent sitemaps in GSC:');
  const listData = await gscApi('GET', `/sites/${siteUrl}/sitemaps`, token);
  const sitemaps = listData.sitemap || [];

  for (const sm of sitemaps) {
    console.log(`  ${sm.path}`);
    console.log(`    Last submitted: ${sm.lastSubmitted || 'unknown'}`);
    console.log(`    Warnings: ${sm.warnings || 0}, Errors: ${sm.errors || 0}`);
    if (sm.contents) {
      for (const c of sm.contents) {
        console.log(`    ${c.type}: submitted=${c.submitted}, indexed=${c.indexed}`);
      }
    }
  }

  // Delete old www sitemap if exists
  const wwwSitemap = sitemaps.find((s: any) => s.path?.includes('www.dekhopanchang.com'));
  if (wwwSitemap) {
    console.log(`\nDeleting old www sitemap: ${wwwSitemap.path}`);
    try {
      await gscApi('DELETE', `/sites/${siteUrl}/sitemaps/${encodeURIComponent(wwwSitemap.path)}`, token);
      console.log('  Deleted.');
    } catch (err: any) {
      console.warn(`  Warning: ${err.message}`);
    }
  }

  // Submit sitemap
  console.log(`\nSubmitting sitemap: ${SITEMAP_URL}`);
  await gscApi('PUT', `/sites/${siteUrl}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`, token);
  console.log('  Submitted successfully.');

  // Verify
  console.log('\nVerifying...');
  const verifyData = await gscApi('GET', `/sites/${siteUrl}/sitemaps`, token);
  for (const sm of verifyData.sitemap || []) {
    console.log(`  ${sm.path} — warnings: ${sm.warnings || 0}, errors: ${sm.errors || 0}`);
  }

  console.log('\nDone. Google will re-process the sitemap within 24-48 hours.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
