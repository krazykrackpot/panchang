#!/usr/bin/env npx tsx
/**
 * One-off script to post the launch announcement tweet.
 * Usage: npx tsx scripts/first-tweet.ts
 */

import crypto from 'crypto';
import { readFileSync } from 'fs';

const TWITTER_CREATE_TWEET_URL = 'https://api.twitter.com/2/tweets';

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateOAuthHeader(
  method: string, url: string,
  consumerKey: string, consumerSecret: string,
  tokenKey: string, tokenSecret: string,
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: tokenKey,
    oauth_version: '1.0',
  };
  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join('&');
  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  oauthParams.oauth_signature = signature;
  const header = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(', ');
  return `OAuth ${header}`;
}

async function main() {
  const tweet = `Namaste 🙏

Dekho Panchang — free Vedic astrology, pure math.

✦ Daily Panchang · 55 cities
✦ Kundali · Dasha · Yogas
✦ Muhurta · Matching · Transits
✦ 27 learning modules

dekhopanchang.com

#Jyotish #Panchang #VedicAstrology #Mahakal`;

  console.log(`Tweet length: ${tweet.length}/280`);
  if (tweet.length > 280) {
    console.error('ERROR: Tweet exceeds 280 characters!');
    process.exit(1);
  }

  // Read env from .env.local
  const envContent = readFileSync('.env.local', 'utf-8');
  const env: Record<string, string> = {};
  envContent.split('\n').forEach(line => {
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      env[line.slice(0, eqIdx).trim()] = line.slice(eqIdx + 1).trim();
    }
  });

  const apiKey = env.TWITTER_API_KEY;
  const apiSecret = env.TWITTER_API_SECRET;
  const accessToken = env.TWITTER_ACCESS_TOKEN;
  const accessSecret = env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('Missing Twitter env vars in .env.local');
    process.exit(1);
  }

  console.log('\nPosting tweet...');

  const authHeader = generateOAuthHeader('POST', TWITTER_CREATE_TWEET_URL, apiKey, apiSecret, accessToken, accessSecret);

  const res = await fetch(TWITTER_CREATE_TWEET_URL, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: tweet }),
  });

  const data = await res.json();
  console.log('Status:', res.status);

  if (res.ok) {
    console.log('Tweet posted successfully!');
    console.log(`https://x.com/dekhopanchang/status/${data.data?.id}`);
  } else {
    console.error('Failed:', JSON.stringify(data, null, 2));
  }
}

main();
