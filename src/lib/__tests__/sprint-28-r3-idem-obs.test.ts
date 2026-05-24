/**
 * Sprint 28 — Round 3 idempotency + observability residual.
 *
 * R3-SF-3   — WhatsApp webhook uses next/server `after` (not bare fire-and-forget)
 * R3-SF-4   — WhatsApp panchang/rahu-kaal reply day in city tz
 * R3-SF-5   — onboarding-drip getUserById error capture
 * R3-SF-6   — weekly-digest profile + admin error captures
 * R3-IDEM-4 — social-post singleton dedup via cron_singleton_run
 * R3-IDEM-5 — youtube-short singleton dedup via cron_singleton_run
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('R3-SF-3 — WhatsApp webhook uses next/server `after`', () => {
  const src = read('src/app/api/whatsapp/route.ts');

  it('imports `after` from next/server', () => {
    expect(src).toMatch(/import \{ NextResponse, after \} from 'next\/server'/);
  });

  it('wraps sendWhatsAppMessage in after(() => ...) — callback form per Gemini #166', () => {
    expect(src).toMatch(/after\(\(\) =>\s+sendWhatsAppMessage/);
  });
});

describe('R3-SF-4 — WhatsApp panchang/rahu-kaal day in city tz', () => {
  const src = read('src/app/api/whatsapp/route.ts');

  it('both formatters read y/m/d via Intl.DateTimeFormat with city tz', () => {
    const occurrences = src.match(/Intl\.DateTimeFormat\('en-CA'[\s\S]{0,200}timeZone: tz/g) ?? [];
    expect(occurrences.length).toBeGreaterThanOrEqual(2);
  });

  it('removes the previous `now.getFullYear/getMonth/getDate` server-local read', () => {
    const codeOnly = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(codeOnly).not.toMatch(/const year = now\.getFullYear/);
  });
});

describe('R3-SF-5 — onboarding-drip getUserById error capture', () => {
  const src = read('src/app/api/cron/onboarding-drip/route.ts');

  it('destructures { error: adminErr } from getUserById', () => {
    expect(src).toMatch(/\{ data: \{ user: authUser \}, error: adminErr \} = await supabase\.auth\.admin\.getUserById/);
  });

  it('logs the error with a tagged prefix and continues the loop', () => {
    expect(src).toMatch(/\[OnboardingDrip\] getUserById failed for/);
  });
});

describe('R3-SF-6 — weekly-digest error captures', () => {
  const src = read('src/app/api/cron/weekly-digest/route.ts');

  it('captures profile read error', () => {
    expect(src).toMatch(/const \{ data: profile, error: profileErr \}/);
    expect(src).toMatch(/profile read failed/);
  });

  it('captures admin getUserById error', () => {
    expect(src).toMatch(/error: adminErr \} = await supabase\.auth\.admin\.getUserById/);
    expect(src).toMatch(/getUserById failed/);
  });

  it('both error paths increment errors counter and continue', () => {
    const errorsBlocks = src.match(/errors\+\+;[\s\n]*continue/g) ?? [];
    expect(errorsBlocks.length).toBeGreaterThanOrEqual(2);
  });
});

describe('R3-IDEM-4 — social-post singleton dedup', () => {
  it('Migration 041 creates cron_singleton_run', () => {
    const src = read('supabase/migrations/041_cron_singleton_run.sql');
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS public\.cron_singleton_run/);
    expect(src).toMatch(/PRIMARY KEY \(cron_name, run_date\)/);
  });

  it('claimCronSingletonRun helper exists with claim-first ON CONFLICT', () => {
    const src = read('src/lib/cron/email-sent-anchor.ts');
    expect(src).toMatch(/export async function claimCronSingletonRun/);
    expect(src).toMatch(/from\('cron_singleton_run'\)/);
  });

  it('social-post claims BEFORE generating the tweet', () => {
    const src = read('src/app/api/cron/social-post/route.ts');
    expect(src).toMatch(/claimCronSingletonRun/);
    expect(src).toMatch(/cronName:\s*'social-post'/);
    const claimIdx = src.indexOf("cronName: 'social-post'");
    const composeIdx = src.indexOf('composeTweet(');
    expect(claimIdx).toBeGreaterThan(0);
    expect(composeIdx).toBeGreaterThan(claimIdx);
  });
});

describe('R3-IDEM-5 — youtube-short singleton dedup', () => {
  const src = read('src/app/api/cron/youtube-short/route.ts');

  it('claims BEFORE generateDailyShort', () => {
    expect(src).toMatch(/claimCronSingletonRun/);
    expect(src).toMatch(/cronName:\s*'youtube-short'/);
    const claimIdx = src.indexOf("cronName: 'youtube-short'");
    const generateIdx = src.indexOf('generateDailyShort()');
    expect(claimIdx).toBeGreaterThan(0);
    expect(generateIdx).toBeGreaterThan(claimIdx);
  });

  it('reports "Already uploaded today" on dedup hit', () => {
    expect(src).toMatch(/Already uploaded today/);
  });
});
