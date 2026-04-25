/**
 * POST /api/nadi
 *
 * Accepts birth data (same format as /api/kundali), generates the kundali
 * internally, then runs the BNN (Bhrigu Nandi Nadi) engine and karmic profile.
 *
 * Body: BirthData + optional `locale` field (en|hi|ta|bn — defaults to 'en')
 *
 * DISCLAIMER: Results are traditional Vedic knowledge for self-awareness only.
 * Not a substitute for a qualified Jyotishi's personal reading.
 */

import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateBNNReading } from '@/lib/nadi/bnn-engine';
import { computeKarmicProfile } from '@/lib/nadi/karmic-profile';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body: BirthData & { locale?: string } = await request.json();

    // ── Input validation (mirrors /api/kundali) ────────────────────────────
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

    const locale = ['en', 'hi', 'ta', 'bn'].includes(body.locale ?? '') ? (body.locale ?? 'en') : 'en';

    // ── Generate kundali ───────────────────────────────────────────────────
    const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });

    // ── Run BNN engine + karmic profile ────────────────────────────────────
    const bnnReading = generateBNNReading(kundali, locale);
    const karmicProfile = computeKarmicProfile(kundali, locale);

    return NextResponse.json(
      {
        bnnReading,
        karmicProfile,
        disclaimer:
          'This reading is based on Bhrigu Nandi Nadi tradition and is intended for ' +
          'self-reflection and spiritual inquiry only. It does not replace the guidance of a ' +
          'qualified Jyotishi who can consider your full chart in a personal consultation.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[API/nadi] BNN reading generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate Nadi Jyotish reading' },
      { status: 500 },
    );
  }
}
