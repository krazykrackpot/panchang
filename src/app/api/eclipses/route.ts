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

  // Engine is the master — it computes eclipses from first principles for any year
  const baseEclipses = generateEclipseCalendar(year);

  // Table provides enrichment data (contact times, city data) for 2024-2035
  const tableData = getEclipsesForYear(year);

  // Enrich each eclipse with local circumstances if location provided
  const eclipses: EnrichedEclipse[] = baseEclipses.map(eclipse => {
    const tableEntry = tableData.find(t => t.date === eclipse.date);

    if (tableEntry && lat !== null && lng !== null && tz) {
      const local = computeLocalEclipse(tableEntry, lat, lng, tz);
      return { ...eclipse, local };
    }

    return eclipse;
  });

  // Check if any eclipse is significantly visible from user's location
  const hasVisible = eclipses.some(e =>
    e.local?.visible === true && (e.local?.sutakApplicable || (e.local?.maxMagnitude ?? 0) > 0.3)
  );

  // If no significant visible eclipse this year, find the next one in future years
  let nextSignificant: {
    date: string; year: number; type: 'solar' | 'lunar';
    subtype: string; magnitude: number; visibilityNote: string;
  } | null = null;

  if (!hasVisible && lat !== null && lng !== null && tz) {
    const cutoff = `${year + 1}-01-01`;
    for (const entry of ECLIPSE_TABLE) {
      if (entry.date < cutoff) continue;
      if (entry.kind === 'lunar' && entry.type === 'penumbral') continue;
      const local = computeLocalEclipse(entry, lat, lng, tz);
      if (local.visible && local.maxMagnitude > 0.3) {
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
