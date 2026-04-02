import { NextResponse } from 'next/server';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

type Category = 'all' | 'major' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'vrat' | 'eclipse';

const CALENDAR_NAMES: Record<Category, (year: number) => string> = {
  all: (y) => `Hindu Festivals & Vrats ${y}`,
  major: (y) => `Hindu Major Festivals ${y}`,
  ekadashi: (y) => `Ekadashi Vrats ${y}`,
  purnima: (y) => `Purnima (Full Moon) ${y}`,
  amavasya: (y) => `Amavasya (New Moon) ${y}`,
  chaturthi: (y) => `Chaturthi Vrats ${y}`,
  pradosham: (y) => `Pradosham Vrats ${y}`,
  vrat: (y) => `Hindu Vrats ${y}`,
  eclipse: (y) => `Solar & Lunar Eclipses ${y}`,
};

/** Escape special characters for ICS text fields */
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** Fold lines longer than 75 octets per RFC 5545 */
function icsFold(line: string): string {
  const maxLen = 75;
  if (line.length <= maxLen) return line;
  const parts: string[] = [];
  parts.push(line.slice(0, maxLen));
  let i = maxLen;
  while (i < line.length) {
    parts.push(' ' + line.slice(i, i + maxLen - 1));
    i += maxLen - 1;
  }
  return parts.join('\r\n');
}

/** Format date as YYYYMMDD for ICS VALUE=DATE */
function toIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

/** Add one day to a YYYY-MM-DD string, return YYYYMMDD */
function nextDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/** Create a slug from a name for UID generation */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('year');
  const category = (searchParams.get('category') || 'all') as Category;
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const timezoneParam = searchParams.get('timezone');
  const locale = searchParams.get('locale') || 'en';

  if (!yearParam || !latParam || !lonParam || !timezoneParam) {
    return NextResponse.json(
      { error: 'Required parameters: year, lat, lon, timezone' },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam);
  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);

  if (isNaN(year) || isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'Invalid numeric parameters' },
      { status: 400 }
    );
  }

  const validCategories: Category[] = ['all', 'major', 'ekadashi', 'purnima', 'amavasya', 'chaturthi', 'pradosham', 'vrat', 'eclipse'];
  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const festivals = generateFestivalCalendarV2(year, lat, lon, timezoneParam);

    // Filter by category (same logic as the calendar page)
    const filtered = festivals.filter((f) => {
      if (category === 'all') return true;
      if (category === 'major') return f.type === 'major';
      if (category === 'eclipse') return f.type === 'eclipse';
      // For vrat sub-categories, match against f.category
      return f.category === category;
    });

    const useLocale = locale === 'hi' ? 'hi' : 'en';
    const calName = CALENDAR_NAMES[category](year);

    // Build ICS
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Panchang//Hindu Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      icsFold(`X-WR-CALNAME:${icsEscape(calName)}`),
      icsFold(`X-WR-TIMEZONE:${icsEscape(timezoneParam)}`),
    ];

    for (const f of filtered) {
      const name = f.name[useLocale] || f.name.en;
      const slug = f.slug || slugify(f.name.en);
      const uid = `${f.date}-${slug}@panchang.app`;

      // Build description
      let desc = f.description[useLocale] || f.description.en || '';

      // For ekadashi events, add parana info
      if (f.category === 'ekadashi' && f.paranaStart) {
        const paranaLines: string[] = [];
        if (useLocale === 'hi') {
          paranaLines.push(`पारण (व्रत तोड़ना): ${f.paranaStart}${f.paranaEnd ? ' - ' + f.paranaEnd : ''}`);
          if (f.paranaDate) paranaLines.push(`पारण तिथि: ${f.paranaDate}`);
          if (f.paranaSunrise) paranaLines.push(`सूर्योदय: ${f.paranaSunrise}`);
        } else {
          paranaLines.push(`Parana (breaking fast): ${f.paranaStart}${f.paranaEnd ? ' - ' + f.paranaEnd : ''}`);
          if (f.paranaDate) paranaLines.push(`Parana date: ${f.paranaDate}`);
          if (f.paranaSunrise) paranaLines.push(`Sunrise: ${f.paranaSunrise}`);
        }
        desc = desc ? desc + '\n\n' + paranaLines.join('\n') : paranaLines.join('\n');
      }

      const categoryLabel = f.category || f.type || 'festival';

      lines.push('BEGIN:VEVENT');
      lines.push(icsFold(`DTSTART;VALUE=DATE:${toIcsDate(f.date)}`));
      lines.push(icsFold(`DTEND;VALUE=DATE:${nextDay(f.date)}`));
      lines.push(icsFold(`SUMMARY:${icsEscape(name)}`));
      if (desc) {
        lines.push(icsFold(`DESCRIPTION:${icsEscape(desc)}`));
      }
      lines.push(icsFold(`CATEGORIES:${icsEscape(categoryLabel)}`));
      lines.push(icsFold(`UID:${uid}`));
      lines.push('STATUS:CONFIRMED');
      lines.push('TRANSP:TRANSPARENT');
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');

    const icsContent = lines.join('\r\n') + '\r\n';
    const filename = `hindu-festivals-${category}-${year}.ics`;

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to generate calendar export: ' + String(err) },
      { status: 500 }
    );
  }
}
