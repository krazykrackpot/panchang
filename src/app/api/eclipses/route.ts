import { NextRequest, NextResponse } from 'next/server';
import { generateEclipseCalendar, type EclipseEvent } from '@/lib/calendar/eclipses';
import { getEclipsesForYear, ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';
import { computeLocalEclipse, type LocalEclipseResult } from '@/lib/calendar/eclipse-compute';
import type { Trilingual } from '@/types/panchang';

interface EnrichedEclipse extends EclipseEvent {
  local?: LocalEclipseResult;
}

const ECLIPSE_TYPE_NAMES: Record<string, Trilingual> = {
  solar: { en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' },
  lunar: { en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' },
};

const MAG_NAMES: Record<string, Trilingual> = {
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

  // Table data (2024-2035) from NASA — authoritative for dates, types, magnitudes
  const tableData = getEclipsesForYear(year);

  let eclipses: EnrichedEclipse[];

  if (tableData.length > 0) {
    // Table year: NASA data is the single source of truth for dates and types.
    // Build eclipse list directly from table entries.
    eclipses = tableData.map(entry => {
      const type = entry.kind;
      const mag = entry.type === 'hybrid' ? 'total' : entry.type;

      const base: EclipseEvent = {
        type,
        typeName: ECLIPSE_TYPE_NAMES[type],
        date: entry.date,
        magnitude: mag as EclipseEvent['magnitude'],
        magnitudeName: MAG_NAMES[mag] || MAG_NAMES.partial,
        description: type === 'solar' ? {
          en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Solar Eclipse — Sun and Moon conjoin near the Rahu-Ketu axis.`,
          hi: `${MAG_NAMES[mag]?.hi || mag} सूर्य ग्रहण — सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट युति करते हैं।`,
          sa: `${MAG_NAMES[mag]?.sa || mag} सूर्यग्रहणम् — सूर्यचन्द्रौ राहुकेत्वक्षसमीपे युज्येते।`,
        } : {
          en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Lunar Eclipse — Full Moon passes through Earth's shadow near the nodal axis.`,
          hi: `${MAG_NAMES[mag]?.hi || mag} चन्द्र ग्रहण — पूर्णिमा का चन्द्रमा पृथ्वी की छाया से गुजरता है।`,
          sa: `${MAG_NAMES[mag]?.sa || mag} चन्द्रग्रहणम् — पूर्णिमायां चन्द्रः पृथिव्याः छायायां प्रविशति।`,
        },
      };

      if (lat !== null && lng !== null && tz) {
        const local = computeLocalEclipse(entry, lat, lng, tz);
        return { ...base, local };
      }
      return base;
    });
  } else {
    // Outside table range: use engine (tithi-based detection from first principles)
    eclipses = generateEclipseCalendar(year);
  }

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
