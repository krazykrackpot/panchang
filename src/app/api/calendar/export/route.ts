import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { getEclipsesForYear, type EclipseData } from '@/lib/calendar/eclipse-data';
import { generateICal, type ICalEvent } from '@/lib/calendar/ical-generator';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

type Category = 'all' | 'major' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'vrat' | 'eclipse' | 'rahukaal';

const CALENDAR_NAMES: Record<Category, (year: number) => string> = {
  all: (y) => `Vedic Calendar ${y}  –  Dekho Panchang`,
  major: (y) => `Hindu Major Festivals ${y}`,
  ekadashi: (y) => `Ekadashi Vrats ${y}`,
  purnima: (y) => `Purnima (Full Moon) ${y}`,
  amavasya: (y) => `Amavasya (New Moon) ${y}`,
  chaturthi: (y) => `Chaturthi Vrats ${y}`,
  pradosham: (y) => `Pradosham Vrats ${y}`,
  vrat: (y) => `Hindu Vrats ${y}`,
  eclipse: (y) => `Solar & Lunar Eclipses ${y}`,
  rahukaal: (y) => `Rahu Kaal ${y}`,
};

const VALID_CATEGORIES: Category[] = ['all', 'major', 'ekadashi', 'purnima', 'amavasya', 'chaturthi', 'pradosham', 'vrat', 'eclipse', 'rahukaal'];

/**
 * GET /api/calendar/export
 *
 * Generates a .ics (iCalendar) file for Vedic calendar events.
 *
 * Query params:
 *   year       –  calendar year (required)
 *   lat        –  latitude (required)
 *   lon        –  longitude (required)
 *   timezone   –  IANA timezone string (required, e.g. "Europe/Zurich")
 *   category   –  filter: "all" | "major" | "ekadashi" | ... (default: "all")
 *   locale     –  locale for event names: "en" | "hi" | "sa" etc. (default: "en")
 */
export async function GET(request: Request) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  const { searchParams } = new URL(request.url);

  const yearParam = searchParams.get('year')?.trim();
  const category = (searchParams.get('category')?.trim() || 'all') as Category;
  const latParam = searchParams.get('lat')?.trim();
  const lonParam = searchParams.get('lon')?.trim();
  const timezoneParam = searchParams.get('timezone')?.trim();
  const locale = searchParams.get('locale')?.trim() || 'en';

  if (!yearParam || !latParam || !lonParam || !timezoneParam) {
    return NextResponse.json(
      { error: 'Required parameters: year, lat, lon, timezone' },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam, 10);
  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);

  if (isNaN(year) || isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'Invalid numeric parameters' },
      { status: 400 }
    );
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const icalEvents: ICalEvent[] = [];

    // ── Generate festival events (skip for eclipse-only) ──
    if (category !== 'eclipse') {
      const allFestivals = generateFestivalCalendarV2(year, lat, lon, timezoneParam);
      const filtered = filterByCategory(allFestivals, category);

      for (const f of filtered) {
        const name = getLocaleName(f.name, locale);
        const slug = f.slug || slugify(f.name.en);

        icalEvents.push({
          uid: `${f.date}-${slug}@dekhopanchang.com`,
          dtstart: f.date,
          summary: name,
          description: buildDescription(f, locale),
          categories: [f.category || f.type],
          url: `https://dekhopanchang.com/en/calendar/${slug}`,
          alarm: { trigger: '-P1D', description: `Tomorrow: ${name}` },
        });
      }
    }

    // ── Generate Rahu Kaal events for each day ──
    if (category === 'all' || category === 'rahukaal') {
      const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
      for (let dayOfYear = 1; dayOfYear <= daysInYear; dayOfYear++) {
        const d = new Date(Date.UTC(year, 0, dayOfYear));
        const m = d.getUTCMonth() + 1; // 1-based
        const dd = d.getUTCDate();
        try {
          const tz = getUTCOffsetForDate(year, m, dd, timezoneParam);
          const panchang = computePanchang({ year, month: m, day: dd, lat, lng: lon, tzOffset: tz, timezone: timezoneParam });

          if (panchang.rahuKaal) {
            const rahuStart = parseTimeToDate(year, m, dd, panchang.rahuKaal.start, tz);
            const rahuEnd = parseTimeToDate(year, m, dd, panchang.rahuKaal.end, tz);
            if (rahuStart && rahuEnd) {
              const dateStr = `${year}${String(m).padStart(2, '0')}${String(dd).padStart(2, '0')}`;
              icalEvents.push({
                uid: `rahu-${dateStr}@dekhopanchang.com`,
                dtstart: `${rahuStart}`,
                summary: 'Rahu Kaal  –  Avoid Initiations',
                description: `Rahu Kaal from ${panchang.rahuKaal.start} to ${panchang.rahuKaal.end}. Avoid starting important activities during this inauspicious window.`,
                categories: ['Rahu Kaal', 'Inauspicious'],
                dtend: `${rahuEnd}`,
              });
            }
          }
        } catch (err) {
          console.error(`[calendar/export] Failed to compute Rahu Kaal for ${year}-${m}-${dd}:`, err);
          // Continue to next day  –  don't fail the whole export
        }
      }
    }

    // ── Add eclipses from the static table ──
    if (category === 'all' || category === 'eclipse') {
      const eclipses = getEclipsesForYear(year);
      for (const ecl of eclipses) {
        icalEvents.push(eclipseToICalEvent(ecl));
      }
    }

    // Sort by date
    icalEvents.sort((a, b) => a.dtstart.localeCompare(b.dtstart));

    // Deduplicate by UID
    const seen = new Set<string>();
    const deduped = icalEvents.filter(e => {
      if (seen.has(e.uid)) return false;
      seen.add(e.uid);
      return true;
    });

    const calName = CALENDAR_NAMES[category](year);

    const icsContent = generateICal({
      calName,
      timezone: timezoneParam,
      events: deduped,
    });

    const filename = `vedic-calendar-${category}-${year}.ics`;

    // webcal:// subscriptions need inline disposition; direct downloads get attachment
    const isSubscription = searchParams.get('subscribe') === '1';

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        ...(isSubscription
          ? { 'Content-Disposition': `inline; filename="${filename}"` }
          : { 'Content-Disposition': `attachment; filename="${filename}"` }),
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  } catch (err) {
    // Round 2 SEC-6 — never leak `String(err)` to the client. It exposes
    // module paths, function names, downstream DB error text. Detail stays
    // in the console; user gets a constant message.
    console.error('[calendar/export] Failed to generate iCal:', err);
    return NextResponse.json(
      { error: 'Failed to generate calendar export' },
      { status: 500 }
    );
  }
}

// ─── Helpers ───

function filterByCategory(festivals: FestivalEntry[], category: string): FestivalEntry[] {
  if (category === 'all') return festivals;
  if (category === 'major') return festivals.filter(f => f.type === 'major');
  if (category === 'eclipse') return festivals.filter(f => f.type === 'eclipse');
  // Sub-category filter (ekadashi, purnima, amavasya, etc.)
  return festivals.filter(f => f.category === category);
}

/** Safely get a locale string from a LocaleText object, falling back to .en */
function getLocaleName(obj: { en: string; [key: string]: string | undefined }, locale: string): string {
  return obj[locale] || obj.en || '';
}

/**
 * Localized strings for the Parana lines of an ICS event description.
 *
 * `sa` is retired (middleware redirects → en) but is kept in the map so
 * cached/old ICS URLs still render in Devanagari. Anything else falls
 * back to English. Single source of truth — adding a new locale here
 * keeps label + date suffix + sunrise suffix in the same script.
 */
function paranaLocalization(locale: string): {
  label: string;
  dateSuffix: string;
  sunriseSuffix: string;
} {
  const map: Record<string, { label: string; dateSuffix: string; sunriseSuffix: string }> = {
    hi:  { label: 'पारण',    dateSuffix: 'तिथि',       sunriseSuffix: 'सूर्योदय' },
    sa:  { label: 'पारणम्',  dateSuffix: 'तिथिः',      sunriseSuffix: 'सूर्योदयः' },
    mai: { label: 'पारण',    dateSuffix: 'तिथि',       sunriseSuffix: 'सूर्योदय' },
    ta:  { label: 'பாரணை',  dateSuffix: 'தேதி',       sunriseSuffix: 'சூரியோதயம்' },
    te:  { label: 'పారణ',   dateSuffix: 'తేదీ',       sunriseSuffix: 'సూర్యోదయం' },
    bn:  { label: 'পারণ',    dateSuffix: 'তারিখ',     sunriseSuffix: 'সূর্যোদয়' },
    kn:  { label: 'ಪಾರಣ',   dateSuffix: 'ದಿನಾಂಕ',     sunriseSuffix: 'ಸೂರ್ಯೋದಯ' },
    gu:  { label: 'પારણ',    dateSuffix: 'તારીખ',      sunriseSuffix: 'સૂર્યોદય' },
  };
  return map[locale] ?? { label: 'Parana', dateSuffix: 'date', sunriseSuffix: 'Sunrise' };
}

function buildDescription(f: FestivalEntry, locale: string): string {
  const desc = getLocaleName(f.description, locale);
  const parts: string[] = [];
  if (desc) parts.push(desc);
  if (f.tithi) parts.push(`Tithi: ${f.tithi}`);
  if (f.masa) {
    parts.push(`Masa: ${f.masa.purnimanta} (Purnimant)${f.masa.isAdhika ? ' [Adhika]' : ''}`);
  }
  if (f.pujaMuhurat) {
    parts.push(`Puja: ${f.pujaMuhurat.start} - ${f.pujaMuhurat.end} (${f.pujaMuhurat.name})`);
  }
  if (f.paranaStart && f.paranaEnd) {
    // P3 — fully-localized Parana lines. The previous ternary chain (a) was
    // hard to extend with new locales and (b) only translated the label
    // itself, so non-English clients saw mixed-language output like
    // "पारण date" or "பாரணை date". The lookup map below carries the
    // label, the "date" suffix, and the "Sunrise" suffix together so
    // every line renders in a single script. Gemini #155.
    //
    // `sa` is retired (middleware redirects → en) but is kept here for
    // back-compat with cached/old ICS URLs. EN is the fallback.
    const paranaStrings = paranaLocalization(locale);
    parts.push(`${paranaStrings.label}: ${f.paranaStart} - ${f.paranaEnd}`);
    if (f.paranaDate) parts.push(`${paranaStrings.label} ${paranaStrings.dateSuffix}: ${f.paranaDate}`);
    if (f.paranaSunrise) parts.push(`${paranaStrings.sunriseSuffix}: ${f.paranaSunrise}`);
  }
  return parts.join('\n');
}

function eclipseToICalEvent(ecl: EclipseData): ICalEvent {
  const typeLabel = ecl.kind === 'solar' ? 'Solar' : 'Lunar';
  const subtypeLabel = ecl.type.charAt(0).toUpperCase() + ecl.type.slice(1);
  const summary = `${subtypeLabel} ${typeLabel} Eclipse`;

  let description = `${subtypeLabel} ${typeLabel} Eclipse on ${ecl.date}`;
  if (ecl.kind === 'lunar') {
    description += `\nMax: ${ecl.max} UTC`;
    description += `\nMagnitude: ${ecl.magnitude}`;
    if (ecl.durationTotal > 0) description += `\nTotality: ${ecl.durationTotal} min`;
  } else {
    description += `\nGreatest Eclipse: ${ecl.maxUtc} UTC`;
    description += `\nMagnitude: ${ecl.magnitude}`;
    if (ecl.durationCenter > 0) description += `\nCentral Duration: ${Math.round(ecl.durationCenter / 60)} min`;
  }

  return {
    uid: `eclipse-${ecl.kind}-${ecl.date}@dekhopanchang.com`,
    dtstart: ecl.date,
    summary,
    description,
    categories: ['eclipse'],
    url: `https://dekhopanchang.com/en/eclipses`,
    alarm: { trigger: '-P1D', description: `Tomorrow: ${summary}` },
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parse "HH:MM" local time string to an iCal UTC datetime string (YYYYMMDDTHHMMSSZ).
 * Converts local time to UTC by subtracting the timezone offset.
 */
function parseTimeToDate(
  year: number, month: number, day: number,
  time: string, tzOffsetHours: number,
): string | null {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  // Convert local time to UTC using Date.UTC to handle day rollovers correctly
  const localMs = Date.UTC(year, month - 1, day, h, m, 0);
  const utcMs = localMs - tzOffsetHours * 3_600_000;
  const utcDate = new Date(utcMs);
  const yy = utcDate.getUTCFullYear();
  const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utcDate.getUTCDate()).padStart(2, '0');
  const hh = String(utcDate.getUTCHours()).padStart(2, '0');
  const mi = String(utcDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(utcDate.getUTCSeconds()).padStart(2, '0');
  return `${yy}${mm}${dd}T${hh}${mi}${ss}Z`;
}
