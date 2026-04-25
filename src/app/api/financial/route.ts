/**
 * POST /api/financial
 *
 * Accepts birth data (same format as /api/kundali), generates the kundali
 * internally, then runs all financial astrology engines:
 *   - Annual Financial Report (year rating, monthly outlook, Dhana activations)
 *   - Today's Hora-based financial guide
 *
 * DISCLAIMER: This endpoint returns traditional Vedic knowledge for
 * self-awareness purposes only. It is NOT financial advice.
 */

import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { computeAnnualFinancialReport } from '@/lib/financial/annual-financial';
import { computeFinancialHoras } from '@/lib/financial/hora-finance';
import { calculateHoras } from '@/lib/hora/hora-calculator';
import {
  dateToJD,
  approximateSunriseSafe,
  approximateSunsetSafe,
  formatTime,
} from '@/lib/ephem/astronomical';
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

    const dateTrimmed = body.date.trim();
    const timeTrimmed = body.time.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateTrimmed)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 },
      );
    }

    if (!/^\d{2}:\d{2}$/.test(timeTrimmed)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM.' },
        { status: 400 },
      );
    }

    const [year, month, day] = dateTrimmed.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json({ error: 'Date values out of range.' }, { status: 400 });
    }

    const [hour, minute] = timeTrimmed.split(':').map(Number);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json({ error: 'Time values out of range.' }, { status: 400 });
    }

    // ── Generate kundali ─────────────────────────────────────────────────────
    const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });

    // ── Annual financial report ──────────────────────────────────────────────
    const todayISO = new Date().toISOString().slice(0, 10);
    const annualReport = computeAnnualFinancialReport(kundali, todayISO);

    // ── Today's hora-based financial guide ───────────────────────────────────
    // Compute sunrise/sunset for TODAY at the birth location
    // (birth location used as proxy for current location when not provided)
    let financialHoras = null;
    try {
      const today = new Date();
      const jd = dateToJD(
        today.getUTCFullYear(),
        today.getUTCMonth() + 1,
        today.getUTCDate(),
      );

      // Timezone offset in hours from the IANA tz name
      // We use a simple approach: parse the UTC offset from the timezone string
      // Using the birth timezone as a proxy for current location timezone
      const tzParts = new Date().toLocaleString('en-US', {
        timeZone: body.timezone.trim(),
        timeZoneName: 'shortOffset',
      });
      // Extract offset hours from parts like "GMT+5:30"
      const offsetMatch = tzParts.match(/GMT([+-]\d+)(?::(\d+))?/);
      const tzOffsetHours = offsetMatch
        ? parseInt(offsetMatch[1], 10) + (offsetMatch[2] ? parseInt(offsetMatch[2], 10) / 60 : 0)
        : 0;

      const sunriseUT = approximateSunriseSafe(jd, body.lat, body.lng);
      const sunsetUT = approximateSunsetSafe(jd, body.lat, body.lng);
      const nextSunriseUT = approximateSunriseSafe(jd + 1, body.lat, body.lng);

      const sunriseLocal = formatTime(sunriseUT, tzOffsetHours);
      const sunsetLocal = formatTime(sunsetUT, tzOffsetHours);
      const nextSunriseLocal = formatTime(nextSunriseUT, tzOffsetHours);

      const weekday = today.getDay(); // 0=Sunday
      const nowMinutes = today.getHours() * 60 + today.getMinutes();

      const horaData = calculateHoras(
        today,
        sunriseLocal,
        sunsetLocal,
        nextSunriseLocal,
        weekday,
        nowMinutes,
      );

      financialHoras = computeFinancialHoras(horaData.horas);
    } catch (horaErr) {
      console.error('[API/financial] Hora computation failed (non-fatal):', horaErr);
      // Hora is non-critical; return null and let the page handle it gracefully
    }

    return NextResponse.json(
      {
        annualReport,
        financialHoras,
        disclaimer:
          'This analysis is based on traditional Vedic Jyotish. ' +
          'It is for self-awareness and educational purposes only and does NOT constitute ' +
          'financial advice. Always consult qualified financial professionals before making ' +
          'investment decisions.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[API/financial] Generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate financial astrology analysis' },
      { status: 500 },
    );
  }
}
