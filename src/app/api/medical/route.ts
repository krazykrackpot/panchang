/**
 * POST /api/medical
 *
 * Accepts birth data (same format as /api/kundali), generates the kundali
 * internally, then runs all 4 medical astrology engines:
 *   - Prakriti (Ayurvedic constitution)
 *   - Body Map (house-based vulnerability)
 *   - Health Timeline (dasha-based vulnerability windows, next 10 years)
 *   - Disease Profile (aggregate analysis + signature patterns)
 *
 * Cache: when the caller is authenticated and the posted birth data matches
 * the user's own profile chart, the computed result is persisted in
 * kundali_snapshots (health_diagnosis + health_diagnosis_extended columns)
 * and served from there on subsequent requests — as long as
 * computation_version matches ENGINE_VERSION.
 *
 * Cache hit conditions (ALL must be true):
 *   - Caller is authenticated (Bearer token header)
 *   - birth data matches user_profiles.{date_of_birth, time_of_birth, birth_lat, birth_lng}
 *   - !isSnapshotStale(snapshot) — engine version current (audit P2 #3)
 *   - snapshot.health_diagnosis_computed_at IS NOT NULL
 *   - if extended=true: snapshot.health_diagnosis_extended IS NOT NULL
 *
 * DISCLAIMER: This endpoint returns traditional Vedic knowledge for
 * self-awareness purposes only. It is NOT medical advice.
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 2
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { computePrakriti } from '@/lib/kundali/health-diagnosis/legacy/prakriti';
import { computeBodyMap } from '@/lib/kundali/health-diagnosis/legacy/body-map';
import { computeHealthTimeline } from '@/lib/kundali/health-diagnosis/legacy/health-timeline';
import { computeDiseaseProfile } from '@/lib/kundali/health-diagnosis/legacy/disease-profile';
import { computeHealthPrognosis } from '@/lib/kundali/health-diagnosis/legacy/health-prognosis';
import { computeHealthDiagnosis } from '@/lib/kundali/health-diagnosis';
import { ENGINE_VERSION } from '@/lib/kundali/engine-version';
import { isSnapshotStale } from '@/lib/supabase/get-fresh-snapshot';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { getServerSupabase } from '@/lib/supabase/server';
import type { BirthData } from '@/types/kundali';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  try {
    // Extend BirthData with the diagnosis-specific optional fields
    const body: BirthData & { extended?: boolean; age?: number; locale?: string } =
      await request.json();

    // ── Input validation (mirrors /api/kundali) ───────────────────────────
    if (!body.date || !body.time || !body.lat || !body.lng || !body.timezone) {
      return NextResponse.json(
        { error: 'Missing required fields: date, time, lat, lng, timezone' },
        { status: 400 },
      );
    }

    if (Math.abs(body.lat) > 90 || Math.abs(body.lng) > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates: lat must be -90 to 90, lng must be -180 to 180' },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date.trim())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 },
      );
    }

    if (!/^\d{2}:\d{2}$/.test(body.time.trim())) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM.' },
        { status: 400 },
      );
    }

    const [year, month, day] = body.date.trim().split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json({ error: 'Date values out of range.' }, { status: 400 });
    }

    const [hour, minute] = body.time.trim().split(':').map(Number);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json({ error: 'Time values out of range.' }, { status: 400 });
    }

    const isExtended = !!body.extended;

    // ── Cache probe (authenticated own-chart requests only) ───────────────
    // We check the auth header and compare birth data against the user's
    // own profile. Unauthenticated requests and family/third-party chart
    // requests fall through to full compute WITHOUT touching the cache.
    //
    // SECURITY: Cache is keyed only on userId, so a user submitting a
    // family member's birth data must NEVER read from or write to their
    // own cache slot — that would either serve wrong data (privacy leak)
    // or overwrite the user's own cached diagnosis (corruption).
    // We resolve this by verifying the submitted birth data matches the
    // user's own profile BEFORE any cache interaction.
    const supabase = getServerSupabase();
    let userId: string | null = null;
    let matchesProfile = false;

    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ') && supabase) {
      const token = authHeader.slice(7).trim();
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    // Verify that the submitted birth data matches the user's own profile.
    // Only when true will we touch the cache (read or write).
    if (userId && supabase) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('date_of_birth, time_of_birth, birth_lat, birth_lng')
        .eq('id', userId)
        .maybeSingle();

      // M7 audit fix: replace slice(0,5) time comparison with minutes-since-midnight
      // parsing. The old check assumed both stored and submitted times are exactly
      // "HH:MM" (5 chars). If the stored time_of_birth is "H:MM" (e.g. "6:30"),
      // slice(0,5) returns "6:30:" (includes the colon and extra char), which never
      // matches the validated "HH:MM" body.time. This would silently disable cache
      // for any user whose stored time used a single-digit hour format.
      // Minutes-since-midnight comparison is format-agnostic.
      const parseHhmm = (s: string | null | undefined): number | null => {
        if (!s) return null;
        const m = s.trim().match(/^(\d{1,2}):(\d{2})/);
        if (!m) return null;
        return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      };
      const storedTimeMins = parseHhmm(profile?.time_of_birth ?? null);
      const bodyTimeMins   = parseHhmm(body.time ?? null);
      const timesMatch = storedTimeMins !== null && bodyTimeMins !== null
        && Math.abs(storedTimeMins - bodyTimeMins) <= 1; // ±1 minute tolerance for rounding

      matchesProfile = !!(
        profile &&
        profile.date_of_birth === body.date &&
        timesMatch &&
        Math.abs((profile.birth_lat ?? 0) - body.lat) < 0.01 &&
        Math.abs((profile.birth_lng ?? 0) - body.lng) < 0.01
      );
    }

    // Try to read a cached result only for the user's own chart.
    if (userId && supabase && matchesProfile) {
      const { data: snapshot, error: snapErr } = await supabase
        .from('kundali_snapshots')
        .select(
          'computation_version, health_diagnosis, health_diagnosis_extended, health_diagnosis_computed_at',
        )
        .eq('user_id', userId)
        .maybeSingle();

      if (snapErr) {
        console.error('[API/medical] snapshot cache probe failed:', snapErr.message);
        // Non-fatal — fall through to full compute.
      } else if (snapshot && !isSnapshotStale(snapshot)) {
        // Engine version current — check if the cached payload satisfies this request.
        const hasCachedDefault = snapshot.health_diagnosis_computed_at != null
          && snapshot.health_diagnosis != null;
        const hasCachedExtended = snapshot.health_diagnosis_extended != null;

        if (hasCachedDefault && (!isExtended || hasCachedExtended)) {
          // Cache hit. Rebuild the full response from cached diagnosis + fresh legacy engines.
          // (Legacy engines are cheap; only health_diagnosis is expensive.)
          const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });
          const todayISO = new Date().toISOString().slice(0, 10);
          const prakriti = computePrakriti(kundali);
          const bodyMap = computeBodyMap(kundali);
          const healthTimeline = computeHealthTimeline(kundali, todayISO);
          const diseaseProfile = computeDiseaseProfile(kundali, bodyMap);
          const healthPrognosis = computeHealthPrognosis(kundali);

          return NextResponse.json(
            {
              prakriti,
              bodyMap: bodyMap.map((r) => ({
                house: r.house,
                bodyRegion: r.bodyRegion,
                vulnerability: r.vulnerability,
                factors: r.factors,
              })),
              healthTimeline,
              diseaseProfile,
              healthPrognosis,
              healthDiagnosis: isExtended
                ? snapshot.health_diagnosis_extended
                : snapshot.health_diagnosis,
              disclaimer:
                'This analysis is based on traditional Vedic Jyotish and Ayurveda. ' +
                'It is for self-awareness only and does NOT constitute medical advice. ' +
                'Always consult qualified healthcare professionals for health concerns.',
              _cached: true,
            },
            { headers: { 'Cache-Control': 'no-store' } },
          );
        }
      }
    }

    // ── Full compute (cache miss, unauthenticated, or family chart) ────────
    const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });

    // ── Run medical engines ──────────────────────────────────────────────────
    const todayISO = new Date().toISOString().slice(0, 10);

    const prakriti = computePrakriti(kundali);
    const bodyMap = computeBodyMap(kundali);
    const healthTimeline = computeHealthTimeline(kundali, todayISO);
    const diseaseProfile = computeDiseaseProfile(kundali, bodyMap);
    const healthPrognosis = computeHealthPrognosis(kundali);

    const healthDiagnosis = computeHealthDiagnosis(kundali, {
      extended: isExtended,
      age: typeof body.age === 'number' ? body.age : undefined,
    });

    // ── Persist to cache (authenticated own-chart requests only) ──────────
    // Write-back to snapshot. Uses upsert-style update: only updates the
    // health_diagnosis* columns, leaving other snapshot fields intact.
    //
    // Empty-vs-NULL invariant: we write null (not {}) for the extended field
    // when not requested, so the IS NOT NULL check stays reliable.
    //
    // SECURITY: only cache when the submitted birth data has been verified
    // to match the user's own profile (matchesProfile). Family/third-party
    // charts must not overwrite the user's snapshot — deferred per spec §6.
    if (userId && supabase && matchesProfile) {
      // Patch only the health_diagnosis_* columns. Do NOT include
      // `computation_version: ENGINE_VERSION` here — the WHERE filter
      // below already restricts the write to rows that are at current
      // engine version, so re-setting the field is redundant. Worse,
      // re-setting it would falsely freshen a snapshot whose other
      // fields (chart_data, full_kundali, …) were computed against an
      // older engine if the WHERE clause is ever loosened (audit #3).
      const patch: Record<string, unknown> = {
        health_diagnosis_computed_at: new Date().toISOString(),
      };
      if (!isExtended) {
        patch.health_diagnosis = healthDiagnosis;
        // Do NOT reset extended to null if it was already populated.
      } else {
        patch.health_diagnosis_extended = healthDiagnosis;
        // Also populate default if this is the first compute.
        patch.health_diagnosis = healthDiagnosis;
      }

      const { error: cacheErr } = await supabase
        .from('kundali_snapshots')
        .update(patch)
        .eq('user_id', userId)
        .eq('computation_version', ENGINE_VERSION);

      if (cacheErr) {
        // Non-fatal — just log, don't block the response.
        console.error('[API/medical] cache write failed:', cacheErr.message);
      }
    }

    return NextResponse.json(
      {
        prakriti,
        bodyMap: bodyMap.map((r) => ({
          house: r.house,
          bodyRegion: r.bodyRegion,
          vulnerability: r.vulnerability,
          factors: r.factors,
        })),
        healthTimeline,
        diseaseProfile,
        healthPrognosis,
        healthDiagnosis,
        disclaimer:
          'This analysis is based on traditional Vedic Jyotish and Ayurveda. ' +
          'It is for self-awareness only and does NOT constitute medical advice. ' +
          'Always consult qualified healthcare professionals for health concerns.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[API/medical] Generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate medical astrology analysis' },
      { status: 500 },
    );
  }
}
