import { NextRequest, NextResponse } from 'next/server';
import { generateEclipseCalendar, type EclipseEvent } from '@/lib/calendar/eclipses';
import { getEclipsesForYear, ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';
import { computeLocalEclipse, type LocalEclipseResult } from '@/lib/calendar/eclipse-compute';

interface EnrichedEclipse extends EclipseEvent {
  local?: LocalEclipseResult;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const tz = searchParams.get('tz')?.trim() || null;

  // Get base eclipse list from existing engine (detects eclipses dynamically)
  const baseEclipses = generateEclipseCalendar(year);

  // Get pre-computed table data for this year
  const tableData = getEclipsesForYear(year);

  // Enrich each eclipse with local circumstances if location provided
  const eclipses: EnrichedEclipse[] = baseEclipses.map(eclipse => {
    // Find matching table entry by date
    const tableEntry = tableData.find(t => t.date === eclipse.date);

    if (tableEntry && lat !== null && lng !== null && tz) {
      const local = computeLocalEclipse(tableEntry, lat, lng, tz);
      return { ...eclipse, local };
    }

    // No table entry or no location — return base data with table metadata
    if (tableEntry) {
      return {
        ...eclipse,
        local: {
          date: eclipse.date,
          type: eclipse.type,
          subtype: tableEntry.kind === 'lunar' ? tableEntry.type : tableEntry.type === 'hybrid' ? 'total' : tableEntry.type,
          visible: true, // Unknown without location
          visibilityNote: 'Provide location for local details',
          eclipseStart: null,
          partialStart: null,
          maximum: tableEntry.kind === 'lunar' ? tableEntry.max : tableEntry.maxUtc.slice(0, 5),
          partialEnd: null,
          eclipseEnd: null,
          endsAtSunset: false,
          endsAtMoonset: false,
          maxMagnitude: tableEntry.magnitude,
          magnitudeAtSunset: null,
          durationMinutes: 0,
          durationFormatted: '',
          sutakApplicable: false,
          sutakStart: null,
          sutakEnd: null,
          sutakVulnerableStart: null,
          sutakTraditions: { nirnyaSindhu: null, dharmaSindhu: null, muhurtaChintamani: null },
          saros: tableEntry.saros,
          gamma: tableEntry.gamma,
          sunrise: null,
          sunset: null,
        } satisfies LocalEclipseResult,
      };
    }

    return eclipse;
  });

  // Check if any eclipse is visible from user's location
  const hasVisible = eclipses.some(e => e.local?.visible === true && (e.local?.sutakApplicable || (e.local?.maxMagnitude ?? 0) > 0.3));

  // If no significant visible eclipse this year, find the next one in FUTURE years
  let nextSignificant: { date: string; year: number; type: 'solar' | 'lunar'; subtype: string; magnitude: number; visibilityNote: string } | null = null;

  if (!hasVisible && lat !== null && lng !== null && tz) {
    // Search forward from NEXT year (current year's eclipses are already shown)
    const cutoff = `${year + 1}-01-01`;
    for (const entry of ECLIPSE_TABLE) {
      if (entry.date < cutoff) continue;
      // Skip penumbral lunar eclipses (not significant)
      if (entry.kind === 'lunar' && entry.type === 'penumbral') continue;
      const local = computeLocalEclipse(entry, lat, lng, tz);
      if (local.visible && local.maxMagnitude > 0.3) {
        // Use LOCAL subtype and magnitude, not global table data
        nextSignificant = {
          date: entry.date,
          year: parseInt(entry.date.slice(0, 4)),
          type: entry.kind,
          subtype: local.subtype,
          magnitude: local.maxMagnitude,
          visibilityNote: local.visibilityNote,
        };
        break;
      }
    }
  }

  return NextResponse.json({ year, eclipses, nextSignificant }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  });
}
