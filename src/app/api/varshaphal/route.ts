import { NextResponse } from 'next/server';
import { generateVarshaphal } from '@/lib/varshaphal';
import { computeMaasaphal } from '@/lib/varshaphal/maasaphal';
import { computeVarsheshaDasha } from '@/lib/varshaphal/varshesha-dasha';
import { computePatyayiniDasha } from '@/lib/varshaphal/patyayini-dasha';
import type { BirthData } from '@/types/kundali';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthData, year, detail } = body as {
      birthData: BirthData;
      year: number;
      /** Pass detail:'monthly' to include Maasaphal + extended dashas */
      detail?: string;
    };

    if (!birthData?.date || !birthData?.time || !birthData?.lat || !birthData?.lng || !birthData?.timezone) {
      return NextResponse.json(
        { error: 'Missing required birth data fields: date, time, lat, lng, timezone' },
        { status: 400 },
      );
    }

    if (!year || year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: 'Invalid year. Must be between 1900 and 2100.' },
        { status: 400 },
      );
    }

    const result = generateVarshaphal(birthData, year);

    if (detail === 'monthly') {
      // ── Maasaphal ────────────────────────────────────────────────────────────
      // Use the sidereal Sun degree from the annual chart (most accurate)
      const annualSunDeg = result.chart.planets.find(p => p.planet.id === 0)?.longitude ?? 0;
      result.maasaphal = computeMaasaphal(
        result.solarReturnJD,
        annualSunDeg,
        birthData.lat,
        birthData.lng,
        birthData.timezone,
      );

      // ── Varshesha Dasha ───────────────────────────────────────────────────────
      result.varsheshaDasha = computeVarsheshaDasha(
        result.varsheshvara.planetId,
        result.solarReturnMoment,
      );

      // ── Patyayini Dasha ───────────────────────────────────────────────────────
      // Use actual sidereal planet longitudes from the annual chart
      const planetLongitudes = result.chart.planets.map(p => ({
        id: p.planet.id,
        longitude: p.longitude,
      }));
      result.patyayiniDasha = computePatyayiniDasha(
        result.solarReturnMoment,
        planetLongitudes,
      );
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=3600' },
    });
  } catch (err) {
    console.error('[varshaphal] computation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate Varshaphal chart' },
      { status: 500 },
    );
  }
}
