#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
/**
 * Orphan-account cleanup — run locally, no Vercel cost.
 *
 * Definition of "orphan": auth.users rows where
 *   - email_confirmed_at IS NULL  (never confirmed)
 *   - last_sign_in_at IS NULL     (never signed in)
 *   - created_at > 24h ago        (grace window for legitimate
 *                                  "I'll confirm tomorrow" signups)
 *
 * Per user (2026-06-28): "pick one day in the calendar and scan all
 * orphan accounts and delete them. only spare orphan accounts less
 * than 24 hours old". Run this monthly (or whenever you remember).
 *
 * Usage:
 *   npx tsx scripts/purge-orphan-accounts.ts          # commit deletes
 *   npx tsx scripts/purge-orphan-accounts.ts --dry    # report only
 *
 * Optional automation: add a macOS launchd plist that runs this
 * monthly. Example at the bottom of this file's comments.
 *
 * No Vercel cron used — keeps the platform bill at zero for this work.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const GRACE_HOURS = 24;

// Load .env.local — same pattern as scripts/grandfather-kundali-entitlements.ts.
const envPath = resolve('.env.local');
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
  console.error('[purge-orphans] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const DRY = process.argv.includes('--dry');

const svc = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
}

async function main() {
  console.log(`[purge-orphans] Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);
  console.log(`[purge-orphans] Grace window: ${GRACE_HOURS}h`);

  // Paginate through all users. admin.listUsers caps at 200/page.
  let all: AuthUser[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await svc.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error('[purge-orphans] listUsers failed:', error.message);
      process.exit(1);
    }
    if (!data?.users?.length) break;
    all = all.concat(data.users);
    if (data.users.length < 200) break;
    page++;
  }

  const cutoffMs = Date.now() - GRACE_HOURS * 3600 * 1000;
  const orphans = all.filter((u) => {
    if (u.email_confirmed_at) return false;
    if (u.last_sign_in_at) return false;
    if (new Date(u.created_at).getTime() > cutoffMs) return false;
    return true;
  });

  console.log(`[purge-orphans] Scanned ${all.length} total accounts.`);
  console.log(`[purge-orphans] Identified ${orphans.length} orphan(s) (unconfirmed + never signed in, > ${GRACE_HOURS}h old).`);

  if (orphans.length === 0) {
    console.log('[purge-orphans] Nothing to do.');
    return;
  }

  for (const u of orphans) {
    const ageH = Math.round((Date.now() - new Date(u.created_at).getTime()) / 3600000);
    const ageStr = ageH < 24 ? `${ageH}h` : `${Math.round(ageH / 24)}d`;
    console.log(`  • ${u.email ?? '<no email>'.padEnd(40)}  ${u.created_at.slice(0, 19)}Z  (${ageStr})  id=${u.id.slice(0, 8)}`);
  }

  if (DRY) {
    console.log();
    console.log('[purge-orphans] DRY-RUN — no rows deleted. Re-run without --dry to commit.');
    return;
  }

  console.log();
  console.log('[purge-orphans] Deleting…');

  let deleted = 0;
  let failed = 0;
  for (const u of orphans) {
    const { error } = await svc.auth.admin.deleteUser(u.id);
    if (error) {
      console.error(`[purge-orphans] FAILED ${u.email}: ${error.message}`);
      failed++;
    } else {
      deleted++;
    }
  }

  console.log(`[purge-orphans] DONE — deleted ${deleted}, failed ${failed}.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('[purge-orphans] FATAL:', e);
  process.exit(1);
});

/*
 * Optional: monthly automation via macOS launchd
 * ───────────────────────────────────────────────
 * Save as ~/Library/LaunchAgents/com.dekho.purge-orphans.plist :
 *
 * <?xml version="1.0" encoding="UTF-8"?>
 * <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 * <plist version="1.0">
 * <dict>
 *   <key>Label</key>           <string>com.dekho.purge-orphans</string>
 *   <key>ProgramArguments</key>
 *   <array>
 *     <string>/bin/bash</string>
 *     <string>-lc</string>
 *     <string>cd /Users/adityakumar/Desktop/venture/panchang && npx tsx scripts/purge-orphan-accounts.ts >> /tmp/dekho-purge-orphans.log 2>&1</string>
 *   </array>
 *   <key>StartCalendarInterval</key>
 *   <dict>
 *     <key>Day</key>    <integer>1</integer>
 *     <key>Hour</key>   <integer>9</integer>
 *     <key>Minute</key> <integer>0</integer>
 *   </dict>
 * </dict>
 * </plist>
 *
 * Then:  launchctl load ~/Library/LaunchAgents/com.dekho.purge-orphans.plist
 *
 * It fires on the 1st of each month at 09:00 local time. If your laptop
 * is asleep at that time, launchd runs it the next time the machine
 * wakes — no missed runs. Log tail: tail -f /tmp/dekho-purge-orphans.log
 */
