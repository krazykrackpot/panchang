#!/usr/bin/env npx tsx
/**
 * Google Search Console OAuth2 — one-time auth flow.
 *
 * Opens browser → Google consent → captures auth code → saves refresh token.
 * Run once, then the audit script uses the saved token.
 *
 * Usage: npx tsx scripts/gsc-auth.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { URL } from 'url';

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
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

loadEnv();

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() || '';
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() || '';
const REDIRECT_URI = 'http://localhost:9876/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters', // needed for URL inspection
];
const TOKEN_PATH = path.join(process.cwd(), '.gsc-token.json');

async function main() {
  // Build auth URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent'); // force refresh token

  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Google Search Console — One-Time OAuth Setup ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('Opening browser for Google sign-in...');
  console.log('If the browser doesn\'t open, visit this URL:');
  console.log('');
  console.log(authUrl.toString());
  console.log('');

  // Open browser
  const { exec } = await import('child_process');
  exec(`open "${authUrl.toString()}"`);

  // Start local server to capture the auth code
  return new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://localhost:9876`);

      // Only process the /callback path
      if (url.pathname !== '/callback') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Waiting for OAuth callback on /callback...');
        return;
      }

      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Auth failed</h1><p>${error}</p>`);
        console.error(`\n✗ Auth failed: ${error}`);
        server.close();
        reject(new Error(error));
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing auth code');
        return;
      }

      // Exchange code for tokens
      try {
        console.log('Auth code received. Exchanging for tokens...');

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenRes.ok) {
          const errBody = await tokenRes.text();
          throw new Error(`Token exchange failed: ${tokenRes.status} ${errBody}`);
        }

        const tokens = await tokenRes.json();

        // Save tokens
        const tokenData = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: Date.now() + (tokens.expires_in || 3600) * 1000,
          token_type: tokens.token_type || 'Bearer',
          scope: tokens.scope,
        };

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));

        // Also append to .env.local if refresh token present
        if (tokens.refresh_token) {
          const envPath = path.join(process.cwd(), '.env.local');
          const envContent = fs.readFileSync(envPath, 'utf-8');
          if (!envContent.includes('GSC_REFRESH_TOKEN')) {
            fs.appendFileSync(envPath, `\n# Google Search Console OAuth\nGSC_REFRESH_TOKEN=${tokens.refresh_token}\n`);
            console.log('   Refresh token appended to .env.local as GSC_REFRESH_TOKEN');
          } else {
            // Update existing
            const updated = envContent.replace(/GSC_REFRESH_TOKEN=.*/, `GSC_REFRESH_TOKEN=${tokens.refresh_token}`);
            fs.writeFileSync(envPath, updated);
            console.log('   GSC_REFRESH_TOKEN updated in .env.local');
          }
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0a0e27;color:#e6e2d8">
            <h1 style="color:#d4a853">✓ GSC Auth Complete</h1>
            <p>Tokens saved to <code>.gsc-token.json</code></p>
            <p>You can close this tab and run the audit script:</p>
            <pre style="background:#111633;padding:20px;border-radius:12px;color:#f0d48a">npx tsx scripts/seo-index-audit.ts</pre>
          </body></html>
        `);

        console.log('\n✓ Authentication successful!');
        console.log(`   Token saved to: ${TOKEN_PATH}`);
        console.log('\n   Next: run the audit:');
        console.log('   npx tsx scripts/seo-index-audit.ts');

        server.close();
        resolve();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error</h1><pre>${err}</pre>`);
        console.error('\n✗ Token exchange failed:', err);
        server.close();
        reject(err);
      }
    });

    server.listen(9876, () => {
      console.log('Listening on http://localhost:9876/callback for OAuth callback...');
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      console.error('\n✗ Timed out waiting for auth callback (5 minutes).');
      server.close();
      reject(new Error('Auth timeout'));
    }, 5 * 60 * 1000);
  });
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
