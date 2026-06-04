import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Source-level invariants. We don't unit-test the network paths
// (Bing's API is the real source of truth), but we DO pin the
// configuration so a refactor that swaps the wrong endpoint, drops
// the apex hostname, or removes the env-var read fails CI.

const SRC = readFileSync(
  join(process.cwd(), 'src/lib/seo/bing-webmaster.ts'),
  'utf8',
);

describe('bing-webmaster — endpoint + host invariants', () => {
  it('uses the Bing Webmaster API base, not IndexNow', () => {
    expect(SRC).toContain('https://ssl.bing.com/webmaster/api.svc/json');
  });

  it('declares the apex host (no `www.` — Vercel 308s break batch POSTs)', () => {
    expect(SRC).toContain("BING_SITE_URL = 'https://dekhopanchang.com'");
    expect(SRC).not.toContain('www.dekhopanchang.com');
  });

  it('reads BING_WEBMASTER_API_KEY and trims it (Vercel env-value newlines)', () => {
    expect(SRC).toContain('BING_WEBMASTER_API_KEY');
    expect(SRC).toMatch(/\.trim\(\)/);
  });

  it('caps URL submissions at 100 (Bing daily quota), not 10k as docs claim', () => {
    expect(SRC).toMatch(/\.slice\(0,\s*100\)/);
  });

  it('uses SubmitUrlBatch for URLs and SubmitFeed for sitemaps', () => {
    expect(SRC).toContain('SubmitUrlBatch');
    expect(SRC).toContain('SubmitFeed');
  });

  it('exposes GetUrlSubmissionQuota for pre-flight quota sizing', () => {
    expect(SRC).toContain('GetUrlSubmissionQuota');
    expect(SRC).toMatch(/export async function getBingUrlSubmissionQuota/);
  });

  it('quota helper fails open (-1 sentinel) so callers can default to full cap', () => {
    expect(SRC).toMatch(/dailyRemaining:\s*-1/);
    expect(SRC).toMatch(/monthlyRemaining:\s*-1/);
  });

  it('encodes the API key in the query string (URL-injection guard)', () => {
    expect(SRC).toContain('encodeURIComponent(apiKey)');
  });

  it('catches errors and returns a result rather than throwing', () => {
    expect(SRC).toMatch(/catch\s*\(err\)/);
    expect(SRC).toMatch(/console\.error\(.*bing-webmaster/);
  });
});

describe('bing-webmaster — exported surface', () => {
  beforeEach(() => {
    delete process.env.BING_WEBMASTER_API_KEY;
  });

  it('getBingApiKey returns undefined when env var is missing', async () => {
    const { getBingApiKey } = await import('../bing-webmaster');
    expect(getBingApiKey()).toBeUndefined();
  });

  it('getBingApiKey returns undefined for empty-string env var', async () => {
    process.env.BING_WEBMASTER_API_KEY = '';
    const { getBingApiKey } = await import('../bing-webmaster');
    expect(getBingApiKey()).toBeUndefined();
  });

  it('getBingApiKey trims whitespace from the env value', async () => {
    process.env.BING_WEBMASTER_API_KEY = '  abc123  \n';
    const { getBingApiKey } = await import('../bing-webmaster');
    expect(getBingApiKey()).toBe('abc123');
  });
});

describe('bing-submit-urls — daily script wiring', () => {
  const scriptSrc = readFileSync(
    join(process.cwd(), 'scripts/bing-submit-urls.ts'),
    'utf8',
  );

  it('calls getBingUrlSubmissionQuota before submitting', () => {
    expect(scriptSrc).toContain('getBingUrlSubmissionQuota');
  });

  it('caps batch at min(remaining, 100) when quota call succeeds', () => {
    expect(scriptSrc).toContain('Math.min(quota.dailyRemaining, BING_DAILY_QUOTA)');
  });

  it('exits 0 (not error) when daily quota is already exhausted', () => {
    expect(scriptSrc).toMatch(/dailyRemaining <= 0[\s\S]*?process\.exit\(0\)/);
  });

  it('fails open to full cap when quota endpoint itself fails', () => {
    expect(scriptSrc).toMatch(/quota\.ok[\s\S]*?BING_DAILY_QUOTA/);
  });
});

describe('indexnow comment hygiene', () => {
  const indexnowSrc = readFileSync(
    join(process.cwd(), 'src/lib/seo/indexnow.ts'),
    'utf8',
  );

  it('does NOT claim Google participates in IndexNow (past comment was wrong)', () => {
    // Forbid the specific wrong-claim shapes that prior comments used,
    // not every co-occurrence of "Google" and "IndexNow" — the
    // rebuttal sentence ("Google does NOT participate in IndexNow")
    // must be allowed since it's the documentation that prevents
    // reintroduction.
    expect(indexnowSrc).not.toMatch(/Google \(since/);
    expect(indexnowSrc).not.toMatch(/Bing,?\s*Yandex,?\s*and\s+Google/);
    expect(indexnowSrc).not.toMatch(/notifies[^.]*Google/);
  });

  it('explicitly documents that Google does NOT participate (anti-rewrite guard)', () => {
    expect(indexnowSrc).toMatch(/Google does NOT participate in IndexNow/);
  });

  it('lists actual IndexNow consumers (Bing, Yandex)', () => {
    expect(indexnowSrc).toContain('Bing');
    expect(indexnowSrc).toContain('Yandex');
  });

  it('uses the regenerated 2026-06-04 key (not the placeholder a1b2c3...)', () => {
    expect(indexnowSrc).not.toContain('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6');
    expect(indexnowSrc).toMatch(/INDEXNOW_KEY = '[0-9a-f]{32}'/);
  });
});
