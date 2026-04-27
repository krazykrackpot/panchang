import { NextRequest, NextResponse } from 'next/server';
import { generateEclipseCalendar, type EclipseEvent } from '@/lib/calendar/eclipses';
import { getEclipsesForYear, ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';
import { computeLocalEclipse, type LocalEclipseResult } from '@/lib/calendar/eclipse-compute';
import type { LocaleText,} from '@/types/panchang';

interface EnrichedEclipse extends EclipseEvent {
  local?: LocalEclipseResult;
}

const ECLIPSE_TYPE_NAMES: Record<string, LocaleText> = {
  solar: { en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' },
  lunar: { en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' },
};

const MAG_NAMES: Record<string, LocaleText> = {
  total: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  partial: { en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' },
  annular: { en: 'Annular', hi: 'वलयाकार', sa: 'वलयाकारम्' },
  penumbral: { en: 'Penumbral', hi: 'उपच्छाया', sa: 'उपच्छायाकम्' },
  hybrid: { en: 'Hybrid', hi: 'संकर', sa: 'संकरम्' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const tz = searchParams.get('tz')?.trim() || null;

  // Engine computes eclipses from first principles (tithi table + Moon latitude)
  const baseEclipses = generateEclipseCalendar(year);

  // Table (2024-2035) provides enrichment: contact times, city data for local computation
  const tableData = getEclipsesForYear(year);

  // Enrich engine results with table data for local circumstances
  const eclipses: EnrichedEclipse[] = baseEclipses.map(eclipse => {
    // Match engine eclipse to table entry (±1 day tolerance for date boundary)
    const tableEntry = tableData.find(t => {
      if (t.date === eclipse.date && t.kind === eclipse.type) return true;
      const d1 = new Date(t.date + 'T00:00:00Z').getTime();
      const d2 = new Date(eclipse.date + 'T00:00:00Z').getTime();
      return Math.abs(d1 - d2) <= 86400000 && t.kind === eclipse.type;
    });

    if (tableEntry && lat !== null && lng !== null && tz) {
      // Table has contact times/city data → compute local circumstances
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
    headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400' },
  });
}
