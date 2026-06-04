/**
 * /api/cron/pandit-alerts
 *
 * Daily cron — for every Pandit's active/prospect/past client, run a
 * small set of detectors and upsert pandit_alerts rows. Uniqueness on
 * (client_record_id, kind, fires_at) makes the job idempotent — the
 * same Saturn-Mercury sandhi for the same client on the same date
 * generates one row regardless of how many times the cron fires.
 *
 * Detectors implemented in P8:
 *   - maha_dasha_change   — within pandit_settings.alert_lookahead_days (default 14)
 *   - antar_dasha_change  — within lookahead
 *   - sade_sati_entry / peak / exit — when crossing a phase boundary
 *   - birthday            — 7 days before, day-of
 *   - followup_due        — pandit_consultations.next_followup_at <= today
 *
 * Detectors deferred to P8.b (transit-heavy, need real-time gochar):
 *   - jupiter_aspect_natal, saturn_ingress_natal_house, rahu_ketu_ingress
 *   - eclipse_impact
 *
 * Spec §8.
 *
 * Pandit CRM P8.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData as EngineBirthData, DashaEntry, KundaliData } from '@/types/kundali';
import type { AlertKind, AlertSeverity, BirthData } from '@/lib/pandit/types';

export const maxDuration = 300; // alerts run on a sizeable client set

interface PanditClientRow {
  id: string;
  pandit_user_id: string;
  client_user_id: string | null;
  full_name: string;
  birth_data: BirthData;
  engagement_state: string;
  link_state: string;
}

interface PanditSettingsRow {
  pandit_user_id: string;
  alert_lookahead_days: number;
}

interface DetectedAlert {
  kind: AlertKind;
  fires_at: string; // YYYY-MM-DD
  severity: AlertSeverity;
  payload: Record<string, unknown>;
}

function todayUtcDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/** Adapter — pandit_clients.birth_data → engine BirthData. */
function toEngineBirthData(name: string, bd: BirthData): EngineBirthData {
  return {
    name,
    date: bd.date,
    time: bd.time || '12:00',
    place: bd.place,
    lat: bd.lat,
    lng: bd.lng,
    timezone: bd.tz,
    ayanamsha: 'lahiri',
    relationship: 'other',
    node_type: 'mean',
  };
}

// ─────────────────────────────────────────────────────────────────────
// Detectors
// ─────────────────────────────────────────────────────────────────────

/** Walk dashas; find the next maha or antar boundary within lookahead. */
function detectDashaChanges(
  dashas: DashaEntry[],
  today: Date,
  lookaheadDays: number,
): DetectedAlert[] {
  const out: DetectedAlert[] = [];
  const horizon = new Date(today.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);

  for (const maha of dashas) {
    if (maha.level !== 'maha') continue;
    const mahaEnd = new Date(maha.endDate);
    if (mahaEnd > today && mahaEnd <= horizon) {
      const successor = dashas.find(
        (d) => d.level === 'maha' && new Date(d.startDate).getTime() >= mahaEnd.getTime(),
      );
      out.push({
        kind: 'maha_dasha_change',
        fires_at: toIsoDate(mahaEnd),
        severity: 'critical',
        payload: {
          from: maha.planetName?.en ?? maha.planet,
          to: successor?.planetName?.en ?? null,
          ends_at: maha.endDate,
        },
      });
    }
    // Antar within this maha — only consider ones in the future
    for (const antar of maha.subPeriods ?? []) {
      if (antar.level !== 'antar') continue;
      const antarEnd = new Date(antar.endDate);
      if (antarEnd > today && antarEnd <= horizon) {
        const successor = (maha.subPeriods ?? []).find(
          (d) => d.level === 'antar' && new Date(d.startDate).getTime() >= antarEnd.getTime(),
        );
        out.push({
          kind: 'antar_dasha_change',
          fires_at: toIsoDate(antarEnd),
          severity: 'notable',
          payload: {
            maha_lord: maha.planetName?.en ?? maha.planet,
            from: antar.planetName?.en ?? antar.planet,
            to: successor?.planetName?.en ?? null,
            ends_at: antar.endDate,
          },
        });
      }
    }
  }
  return out;
}

/** Read kundali.sadeSati and emit a phase-event alert if currently in
 *  rising/peak/setting (Saturn transit affecting natal moon). */
function detectSadeSati(kundali: KundaliData, today: Date): DetectedAlert[] {
  const ss = kundali.sadeSati;
  if (!ss || !ss.currentPhase) return [];
  const phase = ss.currentPhase; // 'rising' | 'peak' | 'setting'
  const kind: AlertKind =
    phase === 'rising' ? 'sade_sati_entry' :
    phase === 'peak' ? 'sade_sati_peak' :
    'sade_sati_exit';
  // Use today's date for "fires_at" so the alert is current. The same
  // (client, kind, today) won't double-fire the same day; on subsequent
  // days while still in the phase the cron writes a new row per day
  // (which IS the deluge to avoid). Mitigation: only emit if the phase
  // BOUNDARY is within the last 7 days OR we don't have any sade_sati
  // alert acknowledged yet — simpler: just emit on the boundary day +
  // every 30 days during the phase to keep the Pandit reminded.
  // For P8 simplicity: emit once per phase per 30d.
  // We approximate this with fires_at = today aligned to the START of a
  // 30-day epoch from the natal date so the unique index lock makes
  // the cron idempotent across days within the same epoch.
  const epochStart = Math.floor(today.getTime() / (30 * 24 * 60 * 60 * 1000)) * (30 * 24 * 60 * 60 * 1000);
  const firesAt = toIsoDate(new Date(epochStart));
  return [
    {
      kind,
      fires_at: firesAt,
      severity: phase === 'peak' ? 'critical' : 'notable',
      payload: { phase, natal_moon_sign: kundali.planets.find((p) => p.planet.name.en === 'Moon')?.sign ?? null },
    },
  ];
}

/** Birthday: 7 days before, day-of (annual cycle, idempotent via the
 *  (client, kind, fires_at) unique index).
 *
 *  Year-boundary handling: if THIS year's birthday is already in the
 *  past (e.g. today is Dec 28 and birthday is Jan 5), look at NEXT
 *  year's birthday instead so the T-7d reminder fires correctly across
 *  the year boundary. Gemini PR #406 round 9 narrative #2.
 */
function detectBirthday(birthData: BirthData, today: Date): DetectedAlert[] {
  const out: DetectedAlert[] = [];
  const [, monthStr, dayStr] = birthData.date.split('-');
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!month || !day) return out;

  // Candidate: this year's birthday. If already past, advance a year so
  // the diff is correctly computed for upcoming reminder dates. We only
  // ever evaluate the NEXT upcoming birthday — by definition diff ≥ 0.
  let upcomingBirthday = new Date(Date.UTC(today.getUTCFullYear(), month - 1, day));
  if (upcomingBirthday.getTime() < today.getTime()) {
    upcomingBirthday = new Date(Date.UTC(today.getUTCFullYear() + 1, month - 1, day));
  }
  const diff = daysBetween(today, upcomingBirthday);
  // fires_at = "the date the alert is meant to fire", NOT the birthday
  // date itself — otherwise T-7d and day-of share the same
  // (client, 'birthday', birthday_date) tuple and the second upsert is
  // silently dropped by the idempotency index. T-7d fires_at = birthday-7;
  // day-of fires_at = birthday. Gemini PR #406 round 10 narrative #1.
  if (diff === 7) {
    const reminderDate = new Date(upcomingBirthday.getTime() - 7 * 24 * 60 * 60 * 1000);
    out.push({
      kind: 'birthday',
      fires_at: toIsoDate(reminderDate),
      severity: 'info',
      payload: { kind: 'reminder_7d', birthday_date: toIsoDate(upcomingBirthday) },
    });
  }
  if (diff === 0) {
    out.push({
      kind: 'birthday',
      fires_at: toIsoDate(upcomingBirthday),
      severity: 'info',
      payload: { kind: 'day_of', birthday_date: toIsoDate(upcomingBirthday) },
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────
// Cron handler
// ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const today = todayUtcDate();
  const runStart = Date.now();

  try {
    // Fetch all eligible clients. Active + prospect + past (archived is
    // excluded — Pandit explicitly hid them). Skip declined links.
    const { data: clients, error: clientsError } = await supabase
      .from('pandit_clients')
      .select('id, pandit_user_id, client_user_id, full_name, birth_data, engagement_state, link_state')
      .in('engagement_state', ['active', 'prospect', 'past'])
      .neq('link_state', 'declined');
    if (clientsError) {
      console.error('[cron/pandit-alerts] clients fetch failed:', clientsError.message);
      return NextResponse.json({ error: clientsError.message }, { status: 500 });
    }
    if (!clients || clients.length === 0) {
      return NextResponse.json({ processed: 0, alerts_inserted: 0, duration_ms: Date.now() - runStart });
    }

    // Fetch Pandit settings to pick up alert_lookahead_days per Pandit.
    const panditIds = Array.from(new Set(clients.map((c) => c.pandit_user_id)));
    const { data: settings } = await supabase
      .from('pandit_settings')
      .select('pandit_user_id, alert_lookahead_days')
      .in('pandit_user_id', panditIds);
    const lookaheadByPandit: Record<string, number> = {};
    for (const s of (settings ?? []) as PanditSettingsRow[]) {
      lookaheadByPandit[s.pandit_user_id] = s.alert_lookahead_days ?? 14;
    }

    // Fetch upcoming follow-ups for the followup_due detector.
    const { data: followups } = await supabase
      .from('pandit_consultations')
      .select('client_record_id, pandit_user_id, next_followup_at')
      .gte('next_followup_at', today.toISOString())
      .lte('next_followup_at', new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString());
    const followupsByClient: Record<string, string[]> = {};
    for (const f of (followups ?? []) as { client_record_id: string; next_followup_at: string }[]) {
      const cid = f.client_record_id;
      (followupsByClient[cid] ??= []).push(f.next_followup_at);
    }

    let totalDetected = 0;
    let totalInserted = 0;
    let perClientFailures = 0;

    for (const c of clients as PanditClientRow[]) {
      try {
        const lookahead = lookaheadByPandit[c.pandit_user_id] ?? 14;
        const engineBirthData = toEngineBirthData(c.full_name, c.birth_data);
        // Heavy: full kundali per client. At ~150 clients ≈ 75s total.
        // Acceptable for daily cron; scale-out to per-Pandit chunks later.
        const kundali = generateKundali(engineBirthData);

        const detected: DetectedAlert[] = [
          ...detectDashaChanges(kundali.dashas, today, lookahead),
          ...detectSadeSati(kundali, today),
          ...detectBirthday(c.birth_data, today),
        ];

        // followup_due alerts from the pre-fetched map
        for (const followupIso of followupsByClient[c.id] ?? []) {
          const followupDate = new Date(followupIso);
          // Fire only on the day itself; the unique index dedupes per day.
          if (toIsoDate(followupDate) === toIsoDate(today)) {
            detected.push({
              kind: 'followup_due',
              fires_at: toIsoDate(followupDate),
              severity: 'info',
              payload: { scheduled_at: followupIso },
            });
          }
        }

        if (detected.length === 0) continue;

        totalDetected += detected.length;

        // Upsert with ON CONFLICT (client_record_id, kind, fires_at) DO NOTHING
        // — the unique idempotency index from migration 049 enforces this.
        // Supabase doesn't have a clean "INSERT ... ON CONFLICT DO NOTHING"
        // in the JS client; we use upsert with onConflict + ignoreDuplicates.
        const rows = detected.map((d) => ({
          client_record_id: c.id,
          pandit_user_id: c.pandit_user_id,
          client_user_id: c.client_user_id,
          kind: d.kind,
          fires_at: d.fires_at,
          severity: d.severity,
          payload: d.payload,
        }));
        const { error: upsertError, count } = await supabase
          .from('pandit_alerts')
          .upsert(rows, { onConflict: 'client_record_id,kind,fires_at', ignoreDuplicates: true, count: 'exact' });
        if (upsertError) {
          console.error(`[cron/pandit-alerts] upsert failed for client ${c.id}:`, upsertError.message);
          perClientFailures += 1;
          continue;
        }
        totalInserted += count ?? 0;
      } catch (clientErr) {
        // Never let one bad client crash the whole cron.
        console.error(`[cron/pandit-alerts] client ${c.id} processing failed:`, clientErr);
        perClientFailures += 1;
      }
    }

    const durationMs = Date.now() - runStart;
    console.info(
      `[cron/pandit-alerts] processed=${clients.length} detected=${totalDetected} inserted=${totalInserted} failures=${perClientFailures} duration_ms=${durationMs}`,
    );
    return NextResponse.json({
      processed: clients.length,
      alerts_detected: totalDetected,
      alerts_inserted: totalInserted,
      per_client_failures: perClientFailures,
      duration_ms: durationMs,
    });
  } catch (err) {
    console.error('[cron/pandit-alerts] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
