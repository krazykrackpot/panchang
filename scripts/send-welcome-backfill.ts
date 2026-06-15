/* eslint-disable no-console */
/**
 * Recovery tool: send a Day-1 welcome email to a list of users.
 *
 * WARNING — read before running. The PRIMARY welcome path is the chart-
 * dependent welcome in /api/user/profile (gated by
 * user_profiles.welcome_email_sent_at), which fires the moment a user
 * generates their first kundali. That path is reliable. The 7-day
 * onboarding-drip cron covers the long tail (users who sign up but never
 * generate a chart).
 *
 * This script exists ONLY for genuine recovery cases — e.g. Resend outage
 * on the day of signup, where welcome_email_sent_at is still NULL after
 * the user clearly generated charts. ALWAYS check welcome_email_sent_at
 * BEFORE running; if it's already set, this script will send a duplicate.
 *
 * Historical context: 2026-06-14/15 I (the engineer) misdiagnosed an
 * unrelated NULL on signup_welcome_sent_at (a now-removed column from a
 * deleted /api/user/signup-welcome route) as the welcome having failed.
 * I ran this script and sent 4 users a duplicate welcome before catching
 * the mistake. The dead signup-welcome route and its column gate were
 * removed in the same PR. Don't repeat the mistake.
 *
 * Usage (one of):
 *
 *   1. JSON file (recommended for batch). Create scripts/welcome-backfill-targets.json
 *      (gitignored — Gemini PR #699 flagged hardcoded PII as a privacy
 *      issue). Schema: [{"id": "<uuid>", "email": "<email>"}, ...]
 *
 *        npx tsx scripts/send-welcome-backfill.ts
 *
 *   2. CLI args (one user). Pass --id and --email:
 *
 *        npx tsx scripts/send-welcome-backfill.ts --id <uuid> --email <email>
 *
 *   3. Inline JSON via --targets:
 *
 *        npx tsx scripts/send-welcome-backfill.ts --targets '[{"id":"...","email":"..."}]'
 *
 * No targets ever live in source. PII stays out of git.
 */
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../src/lib/email/resend-client';
import { getOnboardingEmail } from '../src/lib/email/onboarding-templates';

// Load .env.local — strip surrounding quotes from values (matches the pattern
// in scripts/upload-youtube.ts; .env files often quote URLs/strings).
const envPath = path.resolve('.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[backfill] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface Target { id: string; email: string }

function isValidTarget(x: unknown): x is Target {
  if (typeof x !== 'object' || x === null) return false;
  const t = x as Record<string, unknown>;
  return typeof t.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t.id)
    && typeof t.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email);
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}

function loadTargets(): Target[] {
  // Priority: --targets > --id/--email > targets file
  const inlineJson = argValue('--targets');
  if (inlineJson) {
    let parsed: unknown;
    try { parsed = JSON.parse(inlineJson); }
    catch (e) {
      console.error('[backfill] --targets is not valid JSON:', e);
      process.exit(1);
    }
    if (!Array.isArray(parsed) || !parsed.every(isValidTarget)) {
      console.error('[backfill] --targets must be an array of {id: UUID, email}');
      process.exit(1);
    }
    return parsed;
  }

  const idArg = argValue('--id');
  const emailArg = argValue('--email');
  if (idArg || emailArg) {
    const t = { id: idArg ?? '', email: emailArg ?? '' };
    if (!isValidTarget(t)) {
      console.error('[backfill] --id must be a UUID and --email must be a valid address');
      process.exit(1);
    }
    return [t];
  }

  const targetsPath = path.resolve('scripts/welcome-backfill-targets.json');
  if (existsSync(targetsPath)) {
    let parsed: unknown;
    try { parsed = JSON.parse(readFileSync(targetsPath, 'utf-8')); }
    catch (e) {
      console.error(`[backfill] Failed to parse ${targetsPath}:`, e);
      process.exit(1);
    }
    if (!Array.isArray(parsed) || !parsed.every(isValidTarget)) {
      console.error(`[backfill] ${targetsPath} must be an array of {id: UUID, email}`);
      process.exit(1);
    }
    return parsed;
  }

  console.error('[backfill] No targets provided. Use --id/--email, --targets, or create');
  console.error('           scripts/welcome-backfill-targets.json (gitignored).');
  console.error('           See docstring at the top of this file for examples.');
  process.exit(1);
}

const TARGETS = loadTargets();

async function main(): Promise<void> {
  for (const t of TARGETS) {
    // Re-read profile + check the PRIMARY chart welcome flag. If it's already
    // set, this script will produce a duplicate — abort with a clear warning.
    const { data: profile, error: fetchErr } = await supabase
      .from('user_profiles')
      .select('id, display_name, preferred_locale, welcome_email_sent_at')
      .eq('id', t.id)
      .single();

    if (fetchErr || !profile) {
      console.error(`[backfill] ${t.email}: profile fetch failed:`, fetchErr?.message);
      continue;
    }

    if (profile.welcome_email_sent_at) {
      console.warn(`[backfill] ${t.email}: PRIMARY welcome already sent at ${profile.welcome_email_sent_at}`);
      console.warn(`[backfill]   ${t.email}: skipping to avoid a duplicate. If you genuinely need a re-send,`);
      console.warn(`[backfill]   ${t.email}: NULL out welcome_email_sent_at in user_profiles first.`);
      continue;
    }

    const locale = (profile.preferred_locale as string) || 'en';
    const name = (profile.display_name as string) || t.email.split('@')[0];
    const template = getOnboardingEmail(1, locale, { name });

    console.log(`[backfill] ${t.email}: sending Day-1 welcome (locale=${locale}, name="${name}")`);
    console.log(`           subject: ${template.subject}`);

    const result = await sendEmail({
      to: t.email,
      subject: template.subject,
      html: template.html,
    });

    if (!result.success) {
      console.error(`[backfill] ${t.email}: send failed:`, result.error);
      continue;
    }

    // Mark the PRIMARY welcome flag as sent so the chart-welcome path in
    // /api/user/profile won't double-send when the user next generates a
    // chart. Doesn't touch onboarding_drip_day — that's the cron's lane.
    const { error: claimErr } = await supabase
      .from('user_profiles')
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq('id', t.id);

    if (claimErr) {
      console.error(`[backfill] ${t.email}: send OK but db update failed:`, claimErr.message);
      continue;
    }

    console.log(`[backfill] ${t.email}: ✓ sent + marked`);
  }

  console.log('\n[backfill] Done.');
}

main().catch((err) => {
  console.error('[backfill] FATAL:', err);
  process.exit(1);
});
