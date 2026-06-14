/* eslint-disable no-console */
/**
 * One-off backfill: send the immediate post-signup welcome email to the
 * 2 new users from 2026-06-14 whose /auth/callback fire-and-forget POST
 * to /api/user/signup-welcome got cancelled by the 2.5s redirect before
 * the request reached the server. signup_welcome_sent_at is NULL on both.
 *
 * After sending, atomically marks signup_welcome_sent_at=now() so the cron
 * doesn't double-send (drip_day=1 was already set by the onboarding cron's
 * Day-1 path, so no double-send risk on that side).
 *
 * Bug to fix in a follow-up: use sendBeacon() in /auth/callback so the
 * request survives page unload — current fire-and-forget races the redirect.
 *
 * Usage: npx tsx scripts/send-welcome-backfill.ts
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

const TARGETS = [
  { id: '4f1290e6-41e2-4a26-b8a7-cc2dd5f9c160', email: 'sadentpak2015@gmail.com' },
  { id: 'f941853a-ee2d-445a-b66b-ee03c7b1fbb4', email: 'idokar28@gmail.com' },
];

async function main(): Promise<void> {
  for (const t of TARGETS) {
    // Re-read profile to get display_name + locale (avoid sending with stale data)
    const { data: profile, error: fetchErr } = await supabase
      .from('user_profiles')
      .select('id, display_name, preferred_locale, signup_welcome_sent_at')
      .eq('id', t.id)
      .single();

    if (fetchErr || !profile) {
      console.error(`[backfill] ${t.email}: profile fetch failed:`, fetchErr?.message);
      continue;
    }

    if (profile.signup_welcome_sent_at) {
      console.log(`[backfill] ${t.email}: already sent at ${profile.signup_welcome_sent_at} — skipping`);
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

    // Mark sent — but DON'T touch onboarding_drip_day. The cron already
    // claimed Day 1 (drip_day=1). Leaving it lets tomorrow's cron progress
    // to Day 2 naturally.
    const { error: claimErr } = await supabase
      .from('user_profiles')
      .update({ signup_welcome_sent_at: new Date().toISOString() })
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
