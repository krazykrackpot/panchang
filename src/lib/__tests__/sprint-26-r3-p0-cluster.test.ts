/**
 * Sprint 26 — Round 3 P0 cluster.
 *
 * R3-SF-1 / R3-SF-2 — subscription cancel atomicity (provider-first)
 * R3-IDEM-3       — daily-panchang + weekly-digest sent-anchor
 * R3-COMP-1       — Drik Bala house-distance off-by-one
 * R3-UI-1         — ChartChatTab "Talk to Brihaspati" CTA dead-click
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { claimCronEmailSlot as _claim, utcRunDate, utcWeekStartDate } from '../cron/email-sent-anchor';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('R3-SF-1 / R3-SF-2 — subscription cancel provider-first', () => {
  const src = read('src/app/api/subscription/route.ts');

  it('Stripe provider call precedes DB update', () => {
    const stripeUpdateIdx = src.indexOf('stripe.subscriptions.update');
    const dbUpdateIdx = src.indexOf("from('subscriptions').update");
    expect(stripeUpdateIdx).toBeGreaterThan(0);
    expect(dbUpdateIdx).toBeGreaterThan(stripeUpdateIdx);
  });

  it('Stripe failure returns 502 (does not silently log + continue)', () => {
    expect(src).toMatch(/Stripe cancel failed/);
    expect(src).toMatch(/Unable to cancel with payment provider/);
    expect(src).toMatch(/status:\s*502/);
  });

  it('Razorpay failure returns 502', () => {
    expect(src).toMatch(/Razorpay cancel failed/);
  });

  it('DB error after provider success surfaces as 502', () => {
    expect(src).toMatch(/DB cancel-flip failed/);
    expect(src).toMatch(/Cancellation processed at provider but database update failed/);
  });

  it('DB update captures { error: dbErr }', () => {
    expect(src).toMatch(/const \{ error: dbErr \} = await supabase\.from\('subscriptions'\)\.update/);
  });

  it('Gemini #164: missing Stripe credentials returns 503 (no silent fall-through)', () => {
    expect(src).toMatch(/STRIPE_SECRET_KEY missing, cannot cancel/);
    expect(src).toMatch(/Payment provider not configured/);
  });

  it('Gemini #164: missing Razorpay credentials returns 503', () => {
    expect(src).toMatch(/RAZORPAY credentials missing, cannot cancel/);
  });
});

describe('R3-IDEM-3 — daily-panchang + weekly-digest sent-anchor', () => {
  it('Migration 040 creates cron_email_sent', () => {
    const src = read('supabase/migrations/040_cron_email_sent.sql');
    expect(src).toMatch(/CREATE TABLE IF NOT EXISTS public\.cron_email_sent/);
    expect(src).toMatch(/PRIMARY KEY \(cron_name, user_id, run_date\)/);
    expect(src).toMatch(/Service role manages cron_email_sent/);
  });

  it('email-sent-anchor helper exists with claim-first semantics', () => {
    const src = read('src/lib/cron/email-sent-anchor.ts');
    expect(src).toMatch(/export async function claimCronEmailSlot/);
    expect(src).toMatch(/PG_UNIQUE_VIOLATION = '23505'/);
    expect(src).toMatch(/export function utcRunDate/);
    expect(src).toMatch(/export function utcWeekStartDate/);
  });

  it('daily-panchang cron claims the slot BEFORE sending', () => {
    const src = read('src/app/api/cron/daily-panchang/route.ts');
    expect(src).toMatch(/claimCronEmailSlot/);
    expect(src).toMatch(/cronName:\s*'daily-panchang'/);
    const claimIdx = src.indexOf("cronName: 'daily-panchang'");
    const sendIdx = src.indexOf('sendEmail({ to: email');
    expect(claimIdx).toBeGreaterThan(0);
    expect(sendIdx).toBeGreaterThan(claimIdx);
  });

  it('weekly-digest cron claims the slot BEFORE sending', () => {
    const src = read('src/app/api/cron/weekly-digest/route.ts');
    expect(src).toMatch(/claimCronEmailSlot/);
    expect(src).toMatch(/cronName:\s*'weekly-digest'/);
    expect(src).toMatch(/utcWeekStartDate\(\)/);
  });

  it('utcRunDate returns YYYY-MM-DD in UTC', () => {
    expect(utcRunDate(new Date('2026-05-24T15:30:00Z'))).toBe('2026-05-24');
  });

  it('utcWeekStartDate returns ISO Monday in UTC', () => {
    // 2026-05-24 is a Sunday; ISO Monday is 2026-05-18.
    expect(utcWeekStartDate(new Date('2026-05-24T00:00:00Z'))).toBe('2026-05-18');
    // 2026-05-25 is a Monday; should be itself.
    expect(utcWeekStartDate(new Date('2026-05-25T00:00:00Z'))).toBe('2026-05-25');
  });
});

describe('R3-COMP-1 — Drik Bala / Tajika house-distance is inclusive 1-12', () => {
  it('shadbala.ts uses (((p.house - other.house) % 12) + 12) % 12 + 1', () => {
    const src = read('src/lib/kundali/shadbala.ts');
    expect(src).toMatch(/const houseDistance = \(\(\(p\.house - other\.house\) % 12\) \+ 12\) % 12 \+ 1/);
    expect(src).not.toMatch(/houseDistance = \(\(p\.house - other\.house \+ 12\) % 12\) \|\| 12/);
  });

  it('tajika-aspects.ts uses the same inclusive form', () => {
    const src = read('src/lib/varshaphal/tajika-aspects.ts');
    expect(src).toMatch(/const houseDist = \(\(\(p2\.house - p1\.house\) % 12\) \+ 12\) % 12 \+ 1/);
    expect(src).not.toMatch(/houseDist = \(\(p2\.house - p1\.house \+ 12\) % 12\) \|\| 12/);
  });
});

describe('R3-UI-1 — ChartChatTab CTA uses event-bus, not unimported open', () => {
  const src = read('src/components/kundali/ChartChatTab.tsx');

  it('CTA onClick calls fireWith (the event-bus pattern)', () => {
    expect(src).toMatch(/onClick=\{\(\) => fireWith\(''\)\}/);
  });

  it('removes the previous `onClick={() => open(\'kundali_tab\')}` global-window-open call', () => {
    // Strip line comments before matching so the audit/explanation comment
    // referencing the old code doesn't trigger a false positive.
    const codeOnly = src.replace(/\/\/[^\n]*/g, '');
    expect(codeOnly).not.toMatch(/onClick=\{\(\) => open\('kundali_tab'\)\}/);
  });

  it('fireWith helper is still wired to BRIHASPATI_OPEN_EVENT', () => {
    expect(src).toMatch(/BRIHASPATI_OPEN_EVENT/);
    expect(src).toMatch(/window\.dispatchEvent\(new CustomEvent\(BRIHASPATI_OPEN_EVENT/);
  });
});
