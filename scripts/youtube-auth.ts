#!/usr/bin/env npx tsx
/**
 * One-time YouTube OAuth2 authorization script.
 *
 * Run: npx tsx scripts/youtube-auth.ts
 *
 * 1. Opens a browser for Google OAuth consent
 * 2. You authorize the @dekhopanchang channel
 * 3. Prints the YOUTUBE_REFRESH_TOKEN to add to .env.local
 *
 * Prerequisites:
 *   - YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env.local
 *   - OAuth consent screen configured in GCP with YouTube upload scope
 */

import { createServer } from 'http';
import { URL } from 'url';

const REDIRECT_PORT = 9876;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

// Load .env.local manually (no dotenv dependency)
import { readFileSync } from 'fs';
try {
  const envContent = readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* .env.local not found — rely on process.env */ }

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET?.trim();

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env.local first');
  process.exit(1);
}

// Step 1: Build the authorization URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent'); // Force refresh token

console.log('\n🔑 YouTube OAuth2 Authorization\n');
console.log('Open this URL in your browser:\n');
console.log(authUrl.toString());
console.log('\nWaiting for callback...\n');

// Step 2: Start a temporary server to receive the OAuth callback
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${REDIRECT_PORT}`);

  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
    console.error(`❌ Authorization failed: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end('Missing code parameter');
    return;
  }

  // Step 3: Exchange the code for tokens
  try {
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

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(JSON.stringify(tokenData));
    }

    const refreshToken = tokenData.refresh_token;
    if (!refreshToken) {
      throw new Error('No refresh_token in response — did you set prompt=consent?');
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Success!</h1><p>You can close this tab. Check your terminal for the refresh token.</p>');

    console.log('✅ Authorization successful!\n');
    console.log('Add this to your .env.local:\n');
    console.log(`YOUTUBE_REFRESH_TOKEN=${refreshToken}`);
    console.log('');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<h1>Token exchange failed</h1><pre>${err}</pre>`);
    console.error('❌ Token exchange failed:', err);
  }

  server.close();
  process.exit(0);
});

server.listen(REDIRECT_PORT, () => {
  console.log(`Listening on http://localhost:${REDIRECT_PORT}/callback`);
});
