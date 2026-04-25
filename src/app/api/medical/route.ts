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
 * DISCLAIMER: This endpoint returns traditional Vedic knowledge for
 * self-awareness purposes only. It is NOT medical advice.
 */

import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { computePrakriti } from '@/lib/medical/prakriti';
import { computeBodyMap } from '@/lib/medical/body-map';
import { computeHealthTimeline } from '@/lib/medical/health-timeline';
import { computeDiseaseProfile } from '@/lib/medical/disease-profile';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body: BirthData = await request.json();

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

    // ── Generate kundali ─────────────────────────────────────────────────────
    const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });

    // ── Run medical engines ──────────────────────────────────────────────────
    const todayISO = new Date().toISOString().slice(0, 10);

    const prakriti = computePrakriti(kundali);
    const bodyMap = computeBodyMap(kundali);
    const healthTimeline = computeHealthTimeline(kundali, todayISO);
    const diseaseProfile = computeDiseaseProfile(kundali, bodyMap);

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
