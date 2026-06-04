/**
 * Authenticated Pandit-flow E2E. Creates a temporary test Pandit
 * user via the service-role admin API, sets account_type='pandit',
 * signs in to mint a real JWT, then exercises:
 *
 *   - POST /api/pandit/clients ×5 (succeed)
 *   - POST /api/pandit/clients ×1 (cap_exceeded 402)
 *   - GET  /api/pandit/subscription (free tier, usage 5/5)
 *   - GET  /api/pandit/calendar?month=… (200, shape check)
 *   - GET  /api/pandit/clients/[id]/export (200, JSON bundle)
 *   - GET  /api/pandit/clients (list shape)
 *
 * Cleans up by deleting every client + the test user at end-of-suite.
 *
 * This is the missing P12 coverage that the unauthenticated spec at
 * pandit-crm.spec.ts can't reach. Without it, the cap trigger + 402
 * mapping is only verified at the DB layer (smoke DO block) and not
 * through the full HTTP path.
 *
 * Pandit CRM P12 (E2E gate).
 */

import { test, expect, type APIRequestContext } from '@playwright/test';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

const TEST_EMAIL_PREFIX = 'pandit-e2e-';
const TEST_PASSWORD = 'TestPandit!2026';

let svc: SupabaseClient;
let testUserId: string;
let testUserEmail: string;
let accessToken: string;

const createdClientIds: string[] = [];

test.beforeAll(async () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase env — copy .env.local from the worktree root');
  }

  svc = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Create a fresh user with a random suffix so reruns don't collide.
  testUserEmail = `${TEST_EMAIL_PREFIX}${Date.now()}@example.com`;
  const { data: created, error: createErr } = await svc.auth.admin.createUser({
    email: testUserEmail,
    password: TEST_PASSWORD,
    email_confirm: true, // skip the confirmation flow for the test
  });
  if (createErr || !created.user) {
    throw new Error(`Failed to create test user: ${createErr?.message}`);
  }
  testUserId = created.user.id;

  // 2. Flip account_type to 'pandit'. The user_profiles row is created
  //    by the migration-022 trigger on auth.users insert; we just
  //    upsert to ensure it exists with the right flag.
  const { error: profileErr } = await svc
    .from('user_profiles')
    .upsert(
      { id: testUserId, account_type: 'pandit', display_name: 'Test Pandit' },
      { onConflict: 'id' },
    );
  if (profileErr) {
    await svc.auth.admin.deleteUser(testUserId);
    throw new Error(`Failed to set account_type: ${profileErr.message}`);
  }

  // 3. Sign in with anon client to get a real access_token (JWT) that
  //    the API routes will accept.
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: session, error: signInErr } = await anon.auth.signInWithPassword({
    email: testUserEmail,
    password: TEST_PASSWORD,
  });
  if (signInErr || !session.session) {
    await svc.auth.admin.deleteUser(testUserId);
    throw new Error(`Sign-in failed: ${signInErr?.message}`);
  }
  accessToken = session.session.access_token;
});

test.afterAll(async () => {
  // Cleanup: delete clients + user. ON DELETE CASCADE on
  // pandit_clients.pandit_user_id handles all child rows.
  if (svc && testUserId) {
    await svc.auth.admin.deleteUser(testUserId);
  }
});

function authHeaders() {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function addClient(request: APIRequestContext, name: string) {
  return request.post('/api/pandit/clients', {
    headers: authHeaders(),
    data: {
      full_name: name,
      birth_data: {
        date: '1990-01-01',
        time: '12:00',
        tz: 'Europe/Zurich',
        place: 'Test Place',
        lat: 46.4642,
        lng: 6.8438,
      },
    },
  });
}

test.describe('Pandit CRM — authenticated flows', () => {
  test('GET /api/pandit/subscription returns free tier shape', async ({ request }) => {
    const res = await request.get('/api/pandit/subscription', { headers: authHeaders() });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.subscription).toBeDefined();
    expect(body.subscription.tier).toBe('free');
    expect(body.usage).toBeDefined();
    expect(body.usage.cap).toBe(5);
    expect(body.usage.unlinked_count).toBe(0);
    expect(body.usage.can_add_unlinked).toBe(true);
  });

  test('POST 5 clients succeed; 6th fires cap_exceeded 402', async ({ request }) => {
    // Add 5 clients
    for (let i = 1; i <= 5; i++) {
      const res = await addClient(request, `E2E Client ${i}`);
      expect(res.status(), `client ${i} should succeed`).toBe(200);
      const body = await res.json();
      expect(body.client.id).toBeDefined();
      createdClientIds.push(body.client.id);
    }

    // 6th should hit the cap
    const res6 = await addClient(request, 'E2E Client 6');
    expect(res6.status()).toBe(402);
    const body6 = await res6.json();
    expect(body6.error).toBe('cap_exceeded');
    expect(body6.message).toContain('5 unlinked clients');
    expect(body6.hint).toContain('Upgrade');

    // Subscription usage should reflect 5/5
    const subRes = await request.get('/api/pandit/subscription', { headers: authHeaders() });
    const sub = await subRes.json();
    expect(sub.usage.unlinked_count).toBe(5);
    expect(sub.usage.remaining).toBe(0);
    expect(sub.usage.can_add_unlinked).toBe(false);
  });

  test('GET /api/pandit/clients lists all 5 created clients', async ({ request }) => {
    const res = await request.get('/api/pandit/clients', { headers: authHeaders() });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.clients)).toBe(true);
    expect(body.clients.length).toBe(5);
    const names = body.clients.map((c: { full_name: string }) => c.full_name).sort();
    expect(names).toEqual(['E2E Client 1', 'E2E Client 2', 'E2E Client 3', 'E2E Client 4', 'E2E Client 5']);
  });

  test('GET /api/pandit/calendar returns valid shape for current month', async ({ request }) => {
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const res = await request.get(`/api/pandit/calendar?month=${month}`, { headers: authHeaders() });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.month).toBe(month);
    expect(Array.isArray(body.events)).toBe(true);
    // No cron has run for this user yet, so events array is empty.
    // (The cron is daily; we just verify the endpoint returns the
    // empty-events shape correctly.)
  });

  test('GET /api/pandit/calendar rejects invalid month', async ({ request }) => {
    const res = await request.get('/api/pandit/calendar?month=2026-13', { headers: authHeaders() });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid_month');
  });

  test('GDPR export returns the full bundle shape', async ({ request }) => {
    const clientId = createdClientIds[0];
    const res = await request.get(`/api/pandit/clients/${clientId}/export`, {
      headers: authHeaders(),
    });
    expect(res.status()).toBe(200);

    // Content-Disposition with sanitised filename
    const disposition = res.headers()['content-disposition'];
    expect(disposition).toContain('attachment');
    expect(disposition).toMatch(/filename="pandit-e2e-client-1-[0-9a-f]{8}\.json"/);

    const body = await res.json();
    expect(body.schema_version).toBe(1);
    expect(body.exported_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(body.client).toBeDefined();
    expect(body.client.full_name).toBe('E2E Client 1');
    expect(Array.isArray(body.family)).toBe(true);
    expect(Array.isArray(body.consultations)).toBe(true);
    expect(Array.isArray(body.deliverables)).toBe(true);
    expect(Array.isArray(body.alerts)).toBe(true);
    expect(Array.isArray(body.invitations)).toBe(true);
    // No partial errors expected — empty child tables are not errors.
    expect(body._partial_errors).toBeUndefined();
  });

  test('GDPR export returns 404 for non-existent client id', async ({ request }) => {
    const res = await request.get(
      '/api/pandit/clients/00000000-0000-0000-0000-000000000000/export',
      { headers: authHeaders() },
    );
    expect(res.status()).toBe(404);
  });

  test('linking a client frees up a cap slot', async ({ request }) => {
    // We can't trigger a full invitation accept flow without a second
    // user, so we use service-role to flip one client to 'linked'
    // directly. This validates the cap-trigger UPDATE-side logic.
    const targetId = createdClientIds[0];
    const { error: linkErr } = await svc
      .from('pandit_clients')
      .update({ link_state: 'linked', client_user_id: testUserId })
      .eq('id', targetId);
    expect(linkErr).toBeNull();

    // Now usage should drop to 4/5
    const subRes = await request.get('/api/pandit/subscription', { headers: authHeaders() });
    const sub = await subRes.json();
    expect(sub.usage.unlinked_count).toBe(4);
    expect(sub.usage.linked_count).toBe(1);
    expect(sub.usage.remaining).toBe(1);
    expect(sub.usage.can_add_unlinked).toBe(true);

    // And we can add a 6th client now (5th unlinked + 1 linked = 5 cap; 6th is fine because the cap counts unlinked only)
    const res6 = await addClient(request, 'E2E Client 6 After Link');
    expect(res6.status()).toBe(200);
    const body6 = await res6.json();
    createdClientIds.push(body6.client.id);
  });
});
