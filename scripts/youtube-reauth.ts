#!/usr/bin/env npx tsx
/**
 * YouTube OAuth2 re-authorization — get a fresh refresh token.
 *
 * Opens browser → Google consent (YouTube scope) → captures token.
 * Then tells you how to update the GitHub secret.
 *
 * Usage: npx tsx scripts/youtube-reauth.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { URL } from 'url';

// Load .env.local
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

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID?.trim() || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET?.trim() || '';
const REDIRECT_URI = 'http://localhost:9876/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET in .env.local');
    process.exit(1);
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  YouTube OAuth2 — Re-authorize for Upload API  ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('Opening browser for Google sign-in...');
  console.log('Sign in with the Google account that owns the @dekhopanchang YouTube channel.');
  console.log('');

  const { exec } = await import('child_process');
  exec(`open "${authUrl.toString()}"`);

  return new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://localhost:9876`);

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
        server.close();
        reject(new Error(error));
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing auth code');
        return;
      }

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
        const refreshToken = tokens.refresh_token;

        if (!refreshToken) {
          throw new Error('No refresh_token in response — did you set prompt=consent?');
        }

        // Update .env.local
        const envPath = path.join(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const updated = envContent.replace(
          /YOUTUBE_REFRESH_TOKEN=.*/,
          `YOUTUBE_REFRESH_TOKEN=${refreshToken}`,
        );
        fs.writeFileSync(envPath, updated);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0a0e27;color:#e6e2d8">
            <h1 style="color:#d4a853">YouTube Auth Complete</h1>
            <p>Refresh token saved to .env.local</p>
            <p>Now update the GitHub secret — run this in your terminal:</p>
            <pre style="background:#111633;padding:20px;border-radius:12px;color:#f0d48a;text-align:left">echo "${refreshToken}" | gh secret set YOUTUBE_REFRESH_TOKEN</pre>
            <p>Then re-run the workflow:</p>
            <pre style="background:#111633;padding:20px;border-radius:12px;color:#f0d48a;text-align:left">gh workflow run youtube-short.yml</pre>
          </body></html>
        `);

        console.log('');
        console.log('✓ New refresh token obtained!');
        console.log('');
        console.log('  .env.local updated.');
        console.log('');
        console.log('  Now update the GitHub secret:');
        console.log(`    echo "${refreshToken}" | gh secret set YOUTUBE_REFRESH_TOKEN`);
        console.log('');
        console.log('  Then test the workflow:');
        console.log('    gh workflow run youtube-short.yml');

        server.close();
        resolve();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error</h1><pre>${err}</pre>`);
        console.error('Token exchange failed:', err);
        server.close();
        reject(err);
      }
    });

    server.listen(9876, () => {
      console.log('Listening on http://localhost:9876/callback ...');
    });

    setTimeout(() => {
      console.error('Timed out (5 min).');
      server.close();
      reject(new Error('Timeout'));
    }, 5 * 60 * 1000);
  });
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
