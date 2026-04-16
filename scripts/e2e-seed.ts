/**
 * E2E test-user seed script
 *
 * Creates (or refreshes) a known test user with 3 saved kundalis, then
 * prints the auth access token to stdout for consumption by Playwright.
 *
 * Usage:
 *   # One-shot, prints token:
 *   npx tsx scripts/e2e-seed.ts
 *
 *   # In CI / shell — capture into env var for the auth-gated specs:
 *   export E2E_AUTH_COOKIE="$(npx tsx scripts/e2e-seed.ts --token-only)"
 *   npx playwright test e2e/dashboard-saved-kundalis.spec.ts e2e/error-surfacing.spec.ts
 *
 * Why this exists:
 *   Two Playwright specs (dashboard-saved-kundalis, error-surfacing) need a
 *   real session to test the authenticated dashboard flow. Without a seeded
 *   user they skip cleanly — useful for local dev, but means CI never runs
 *   them. This script gives both local and CI a deterministic way to get a
 *   known-good session.
 *
 * Safety:
 *   - Uses the service-role key (server-only env var). NEVER ship this
 *     script's bundled dependencies into client-side code.
 *   - Operates on a fixed test email (`E2E_TEST_EMAIL`, defaulting to a
 *     `+e2e@` aliased address). Will not touch any other user.
 *   - Idempotent: running twice produces the same end state. Re-creates
 *     the saved_charts rows (delete-all-then-insert) so seeded data is
 *     deterministic across runs.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SERVICE_KEY  = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const ANON_KEY     = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

const TEST_EMAIL    = (process.env.E2E_TEST_EMAIL    || 'e2e+seed@dekhopanchang.test').trim();
const TEST_PASSWORD = (process.env.E2E_TEST_PASSWORD || 'E2eSeed!Password-2026').trim();

const TOKEN_ONLY = process.argv.includes('--token-only');

function log(...args: unknown[]) {
  // Silenced in --token-only mode so the token is the only thing on stdout.
  if (!TOKEN_ONLY) console.error('[e2e-seed]', ...args);
}

function die(msg: string): never {
  console.error('[e2e-seed] FATAL:', msg);
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
  die('Missing one of NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY in env. Source .env.local first.');
}

// Service-role client: full admin, bypasses RLS. Used to create the user
// and seed rows.
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Anon client: used at the end to actually sign in as the test user and
// obtain the access_token Playwright will inject.
const anon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Three deterministic charts the dashboard-saved-kundalis spec asserts on.
// Names + dates chosen to be obvious test data, not collide with anything
// real, and exercise both Devanagari + Latin label paths.
const SEEDED_CHARTS = [
  {
    label: 'Arjun Test',
    birth_data: {
      name: 'Arjun Test',
      date: '2016-09-09',
      time: '19:45',
      place: 'Luxembourg',
      lat: 49.8159,
      lng: 6.1297,
      timezone: 'Europe/Luxembourg',
    },
    is_primary: false,
  },
  {
    label: 'Vaibhavi Test',
    birth_data: {
      name: 'Vaibhavi Test',
      date: '1985-06-20',
      time: '14:45',
      place: 'Mumbai',
      lat: 19.076,
      lng: 72.8777,
      timezone: 'Asia/Kolkata',
    },
    is_primary: false,
  },
  {
    label: 'Adi Test',
    birth_data: {
      name: 'Adi Test',
      date: '1990-01-15',
      time: '08:30',
      place: 'Delhi',
      lat: 28.6139,
      lng: 77.209,
      timezone: 'Asia/Kolkata',
    },
    is_primary: true,
  },
];

async function ensureUser(): Promise<{ userId: string }> {
  // Check if the user already exists. listUsers() is paginated — for a fresh
  // test setup this will be tiny, but we list the first page only on
  // purpose to keep this fast.
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listErr) die(`listUsers failed: ${listErr.message}`);

  const existing = list.users.find(u => u.email?.toLowerCase() === TEST_EMAIL.toLowerCase());
  if (existing) {
    log('user already exists:', existing.id);
    return { userId: existing.id };
  }

  // Create with email already confirmed so signin works without an inbox.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { name: 'E2E Seed', is_test: true },
  });
  if (createErr || !created.user) die(`createUser failed: ${createErr?.message ?? 'no user returned'}`);
  log('user created:', created.user.id);
  return { userId: created.user.id };
}

async function reseedSavedCharts(userId: string): Promise<void> {
  // Wipe existing rows so the seed state is deterministic — otherwise repeat
  // runs would accumulate charts and our assertions on count would drift.
  const { error: delErr } = await admin
    .from('saved_charts')
    .delete()
    .eq('user_id', userId);
  if (delErr) die(`delete saved_charts failed: ${delErr.message}`);

  const rows = SEEDED_CHARTS.map(c => ({ user_id: userId, ...c }));
  const { error: insErr } = await admin.from('saved_charts').insert(rows);
  if (insErr) die(`insert saved_charts failed: ${insErr.message}`);
  log(`seeded ${rows.length} saved_charts`);
}

async function fetchAccessToken(): Promise<string> {
  // Sign in as the test user via anon client to mirror what the browser
  // actually does. The returned access_token is what Playwright stuffs into
  // the dekho-panchang-auth cookie/storage to appear authenticated.
  const { data, error } = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (error || !data.session) die(`signin failed: ${error?.message ?? 'no session'}`);
  return data.session.access_token;
}

async function main() {
  log('seeding test user', TEST_EMAIL);
  const { userId } = await ensureUser();
  await reseedSavedCharts(userId);
  const token = await fetchAccessToken();

  if (TOKEN_ONLY) {
    process.stdout.write(token);
    return;
  }

  log('user_id:', userId);
  log('access_token:');
  process.stdout.write(token + '\n');
  log('');
  log('Use it in shell:');
  log(`  export E2E_AUTH_COOKIE="${token}"`);
  log('  npx playwright test e2e/dashboard-saved-kundalis.spec.ts e2e/error-surfacing.spec.ts');
}

main().catch(err => {
  console.error('[e2e-seed] unhandled:', err);
  process.exit(1);
});
