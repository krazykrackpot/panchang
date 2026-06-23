/* eslint-disable no-console */
/**
 * One-shot grandfather backfill for the kundali paywall (PR #721).
 *
 * Every user with existing birth data — primary profile, saved_charts,
 * or pandit_clients — gets a chart_entitlements row inserted with
 * source='admin_grant'. The unlock route short-circuits to
 * already_unlocked when a matching fingerprint exists, so existing
 * users will never see the paywall for charts they already had.
 *
 * Strictly additive: new charts (different birth data) still require
 * paid credits. Idempotent via UNIQUE (user_id, kundali_fingerprint).
 *
 * Sources backfilled:
 *   1. user_profiles  — primary self chart (date_of_birth/time_of_birth/birth_lat/birth_lng)
 *   2. saved_charts   — family/library kundalis (birth_data jsonb)
 *   3. pandit_clients — Pandit's client charts (birth_data jsonb), grandfathered on pandit_user_id
 *
 * Usage:
 *   npx tsx scripts/grandfather-kundali-entitlements.ts           # commit
 *   npx tsx scripts/grandfather-kundali-entitlements.ts --dry     # report only
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Load .env.local (same pattern as scripts/stripe-setup-kundali-products.ts).
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
  console.error('[grandfather] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const DRY = process.argv.includes('--dry');

const svc = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Same normalisation as src/lib/kundali/fingerprint.ts —
// any drift here means unlock() would compute a different hash and the
// grandfather entitlement wouldn't match. Keep these in lock-step.
function fingerprint(date: string, time: string, lat: number, lng: number): string | null {
  // Date: YYYY-MM-DD strict.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  // Time: HH:MM (drop seconds if present).
  const timeMatch = time.match(/^(\d{2}):(\d{2})/);
  if (!timeMatch) return null;
  const hh = parseInt(timeMatch[1], 10);
  const mm = parseInt(timeMatch[2], 10);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  const normalisedTime = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const payload = `${date}|${normalisedTime}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
  return createHash('sha256').update(payload).digest('hex');
}

type Row = { user_id: string; fingerprint: string; display_name: string; source_label: string };

async function collectFromUserProfiles(): Promise<Row[]> {
  const { data, error } = await svc
    .from('user_profiles')
    .select('id, display_name, date_of_birth, time_of_birth, birth_lat, birth_lng')
    .not('date_of_birth', 'is', null)
    .not('time_of_birth', 'is', null)
    .not('birth_lat', 'is', null)
    .not('birth_lng', 'is', null);
  if (error) throw new Error(`user_profiles read failed: ${error.message}`);
  const rows: Row[] = [];
  for (const r of data ?? []) {
    const fp = fingerprint(r.date_of_birth, r.time_of_birth, Number(r.birth_lat), Number(r.birth_lng));
    if (!fp) {
      console.warn(`[grandfather] skip user_profile ${r.id} — malformed: date=${r.date_of_birth} time=${r.time_of_birth}`);
      continue;
    }
    rows.push({
      user_id: r.id,
      fingerprint: fp,
      display_name: (r.display_name || 'My Chart').slice(0, 80),
      source_label: 'user_profile',
    });
  }
  return rows;
}

async function collectFromSavedCharts(): Promise<Row[]> {
  const { data, error } = await svc.from('saved_charts').select('user_id, label, birth_data');
  if (error) throw new Error(`saved_charts read failed: ${error.message}`);
  const rows: Row[] = [];
  for (const r of data ?? []) {
    if (!r.user_id) {
      console.warn('[grandfather] skip saved_chart with null user_id');
      continue;
    }
    const bd = r.birth_data as { date?: string; time?: string; lat?: number; lng?: number } | null;
    if (!bd?.date || !bd?.time || bd.lat == null || bd.lng == null) {
      console.warn(`[grandfather] skip saved_chart for user ${r.user_id} — missing birth_data fields`);
      continue;
    }
    const fp = fingerprint(bd.date, bd.time, Number(bd.lat), Number(bd.lng));
    if (!fp) {
      console.warn(`[grandfather] skip saved_chart for user ${r.user_id} — malformed birth_data`);
      continue;
    }
    rows.push({
      user_id: r.user_id,
      fingerprint: fp,
      display_name: (r.label || 'Saved Chart').slice(0, 80),
      source_label: 'saved_chart',
    });
  }
  return rows;
}

async function collectFromPanditClients(): Promise<Row[]> {
  // Pandit's own client charts — grandfather them under the *pandit's* user_id
  // so the pandit can view them without paying.
  const { data, error } = await svc
    .from('pandit_clients')
    .select('pandit_user_id, full_name, birth_data');
  if (error) {
    // pandit_clients may not exist in all environments; tolerate "relation does not exist".
    if (/does not exist/.test(error.message)) {
      console.log('[grandfather] pandit_clients absent — skipping');
      return [];
    }
    throw new Error(`pandit_clients read failed: ${error.message}`);
  }
  const rows: Row[] = [];
  for (const r of data ?? []) {
    if (!r.pandit_user_id) continue;
    const bd = r.birth_data as { date?: string; time?: string; lat?: number; lng?: number } | null;
    if (!bd?.date || !bd?.time || bd.lat == null || bd.lng == null) continue;
    const fp = fingerprint(bd.date, bd.time, Number(bd.lat), Number(bd.lng));
    if (!fp) continue;
    rows.push({
      user_id: r.pandit_user_id,
      fingerprint: fp,
      display_name: (r.full_name || 'Client Chart').slice(0, 80),
      source_label: 'pandit_client',
    });
  }
  return rows;
}

async function main() {
  console.log(`[grandfather] Mode: ${DRY ? 'DRY-RUN' : 'COMMIT'}`);

  const profiles = await collectFromUserProfiles();
  const saved = await collectFromSavedCharts();
  const clients = await collectFromPanditClients();
  const all = [...profiles, ...saved, ...clients];

  console.log(`[grandfather]   user_profiles  : ${profiles.length}`);
  console.log(`[grandfather]   saved_charts   : ${saved.length}`);
  console.log(`[grandfather]   pandit_clients : ${clients.length}`);
  console.log(`[grandfather]   TOTAL          : ${all.length} entitlements to grant`);

  // Dedupe within this batch by (user_id, fingerprint) to avoid noisy
  // ON CONFLICT spam when the same chart appears in both user_profile
  // and saved_charts (the canonical case: self chart saved as a row).
  const seen = new Set<string>();
  const dedup: Row[] = [];
  for (const r of all) {
    const k = `${r.user_id}::${r.fingerprint}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(r);
  }
  console.log(`[grandfather]   after dedupe   : ${dedup.length} unique entitlements`);

  if (DRY) {
    console.log('[grandfather] DRY-RUN — exiting before INSERT.');
    return;
  }

  // Bulk upsert in 100-row batches (Postgres-friendly).
  const BATCH = 100;
  let inserted = 0;
  let skipped = 0;
  for (let i = 0; i < dedup.length; i += BATCH) {
    const batch = dedup.slice(i, i + BATCH).map((r) => ({
      user_id: r.user_id,
      kundali_fingerprint: r.fingerprint,
      display_name: r.display_name,
      source: 'admin_grant',
    }));
    // upsert with ignoreDuplicates so re-runs are silent no-ops.
    const { data, error } = await svc
      .from('chart_entitlements')
      .upsert(batch, { onConflict: 'user_id,kundali_fingerprint', ignoreDuplicates: true })
      .select('id');
    if (error) {
      console.error(`[grandfather] batch ${i / BATCH} failed:`, error.message);
      throw error;
    }
    inserted += data?.length ?? 0;
    skipped += batch.length - (data?.length ?? 0);
    console.log(`[grandfather]   batch ${Math.floor(i / BATCH) + 1}: ${data?.length ?? 0} new + ${batch.length - (data?.length ?? 0)} already-granted`);
  }

  console.log(`[grandfather] DONE — ${inserted} new entitlements, ${skipped} pre-existing.`);
}

main().catch((e) => {
  console.error('[grandfather] FATAL:', e);
  process.exit(1);
});
