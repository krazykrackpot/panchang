import { NextResponse } from 'next/server';
import { z } from 'zod';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getCityBySlug, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { checkPanchak } from '@/lib/panchang/panchak';

// ── Input validation ──────────────────────────────────────────────
const pdfSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2200),
  month: z.coerce.number().int().min(1).max(12),
  city: z.string().max(100).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  timezone: z.string().max(100).optional(),
  locationName: z.string().max(200).optional(),
});

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DayRow {
  day: number;
  weekday: string;
  weekdayNum: number; // 0=Sun per Date.getUTCDay()
  tithi: string;
  nakshatra: string;
  yoga: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  festivals: string;
  isPanchak: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = pdfSchema.safeParse({
    year: searchParams.get('year') || new Date().getFullYear(),
    month: searchParams.get('month') || (new Date().getMonth() + 1),
    city: searchParams.get('city') ?? undefined,
    lat: searchParams.get('lat') ?? undefined,
    lng: searchParams.get('lng') ?? undefined,
    timezone: searchParams.get('timezone') ?? undefined,
    locationName: searchParams.get('locationName') ?? undefined,
  });

  if (!parsed.success) {
    console.error('[panchang-pdf] Invalid params:', parsed.error.flatten());
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { year, month } = parsed.data;

  // ── Resolve location ──────────────────────────────────────────
  let lat: number;
  let lng: number;
  let timezone: string;
  let cityName: string;

  if (parsed.data.city) {
    const city: CityData | undefined = getCityBySlug(parsed.data.city);
    if (!city) {
      return NextResponse.json(
        { error: `City "${parsed.data.city}" not found. Use a valid city slug.` },
        { status: 404 },
      );
    }
    lat = city.lat;
    lng = city.lng;
    timezone = city.timezone;
    cityName = city.name.en;
  } else if (parsed.data.lat != null && parsed.data.lng != null && parsed.data.timezone) {
    lat = parsed.data.lat;
    lng = parsed.data.lng;
    timezone = parsed.data.timezone;
    cityName = parsed.data.locationName || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  } else {
    return NextResponse.json(
      { error: 'Provide either ?city=<slug> or ?lat=...&lng=...&timezone=...' },
      { status: 400 },
    );
  }

  // ── Compute panchang for each day ────────────────────────────
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getDate();
  const rows: DayRow[] = [];

  // Get festivals for the year, then filter to this month
  let festivals: { name: { en: string; [k: string]: string | undefined }; date: string }[] = [];
  try {
    festivals = generateFestivalCalendarV2(year, lat, lng, timezone);
  } catch (err) {
    console.error('[panchang-pdf] Festival generation failed:', err);
    // Continue without festivals — don't block the PDF
  }

  const monthStr = String(month).padStart(2, '0');
  const festivalsByDate = new Map<string, string[]>();
  for (const f of festivals) {
    if (f.date.startsWith(`${year}-${monthStr}-`)) {
      const existing = festivalsByDate.get(f.date) || [];
      existing.push(f.name.en);
      festivalsByDate.set(f.date, existing);
    }
  }

  // Track the Hindu masa for the header (use mid-month panchang)
  let hinduMasa = '';

  for (let day = 1; day <= daysInMonth; day++) {
    try {
      const tz = getUTCOffsetForDate(year, month, day, timezone);
      const panchang = computePanchang({
        year, month, day,
        lat, lng,
        tzOffset: tz,
        timezone,
        locationName: cityName,
      });

      const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
      const dayFestivals = festivalsByDate.get(dateStr) || [];

      // Use the local Date to get the weekday
      // Date.UTC gives us a proper UTC date; we read its day-of-week
      const weekdayNum = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=Sun

      const isPanchak = checkPanchak(panchang.nakshatra.id || 1).isActive;

      // Capture Hindu masa from mid-month
      if (day === 15 && panchang.masa?.en) {
        hinduMasa = panchang.masa.en;
      }

      rows.push({
        day,
        weekday: DAY_ABBR[weekdayNum],
        weekdayNum,
        tithi: panchang.tithi?.name?.en || '',
        nakshatra: panchang.nakshatra?.name?.en || '',
        yoga: panchang.yoga?.name?.en || '',
        sunrise: panchang.sunrise || '',
        sunset: panchang.sunset || '',
        rahuKaal: panchang.rahuKaal
          ? `${panchang.rahuKaal.start} – ${panchang.rahuKaal.end}`
          : '',
        festivals: dayFestivals.join(', '),
        isPanchak,
      });
    } catch (err) {
      console.error(`[panchang-pdf] Day ${day} computation failed:`, err);
      // Add empty row so the table stays aligned
      const weekdayNum = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
      rows.push({
        day,
        weekday: DAY_ABBR[weekdayNum],
        weekdayNum,
        tithi: '—',
        nakshatra: '—',
        yoga: '—',
        sunrise: '—',
        sunset: '—',
        rahuKaal: '—',
        festivals: '',
        isPanchak: false,
      });
    }
  }

  // ── Build HTML ────────────────────────────────────────────────
  const monthName = MONTH_NAMES[month - 1];
  const subtitle = hinduMasa ? `${monthName} ${year} — ${hinduMasa}` : `${monthName} ${year}`;
  const generatedDate = new Date().toISOString().split('T')[0];

  const tableRows = rows.map(r => {
    const sundayClass = r.weekdayNum === 0 ? ' class="sunday"' : '';
    const panchakBadge = r.isPanchak ? ' <span class="panchak-badge">P</span>' : '';
    const festivalCell = r.festivals
      ? `<span class="festival-text">${escapeHtml(r.festivals)}</span>`
      : '';

    return `<tr${sundayClass}>
      <td class="day-cell">${r.day}</td>
      <td>${r.weekday}</td>
      <td>${escapeHtml(r.tithi)}${panchakBadge}</td>
      <td>${escapeHtml(r.nakshatra)}</td>
      <td>${escapeHtml(r.yoga)}</td>
      <td class="time-cell">${escapeHtml(r.sunrise)}</td>
      <td class="time-cell">${escapeHtml(r.sunset)}</td>
      <td class="time-cell">${escapeHtml(r.rahuKaal)}</td>
      <td class="festival-cell">${festivalCell}</td>
    </tr>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Monthly Panchang — ${monthName} ${year} — ${escapeHtml(cityName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    /* ── Reset ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 32px 40px;
      font-size: 11px;
      line-height: 1.5;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      border-bottom: 2px solid #d4a853;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-family: 'Cinzel', serif;
      font-size: 22px;
      color: #8B6914;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .header .subtitle {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
    }
    .header .city {
      font-size: 12px;
      color: #666;
    }
    .header .coords {
      font-size: 9px;
      color: #999;
      margin-top: 2px;
    }

    /* ── Legend ── */
    .legend {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 12px;
      font-size: 10px;
      color: #666;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .legend-swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    th, td {
      border: 1px solid #d5d0c4;
      padding: 5px 7px;
      text-align: left;
      font-size: 10.5px;
      vertical-align: top;
    }
    th {
      background: #f5f0e0;
      font-weight: 600;
      color: #8B6914;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    tr:nth-child(even) {
      background: #faf9f6;
    }
    tr.sunday {
      background: #fff8eb;
    }
    tr.sunday td {
      color: #a0522d;
    }

    .day-cell {
      font-weight: 700;
      text-align: center;
      width: 28px;
    }
    .time-cell {
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      font-size: 10px;
    }
    .festival-cell {
      max-width: 180px;
    }
    .festival-text {
      color: #92400e;
      font-weight: 600;
      font-size: 10px;
    }
    .panchak-badge {
      display: inline-block;
      background: #dc2626;
      color: #fff;
      font-size: 8px;
      font-weight: 700;
      width: 14px;
      height: 14px;
      line-height: 14px;
      text-align: center;
      border-radius: 50%;
      margin-left: 4px;
      vertical-align: middle;
    }

    /* ── Footer ── */
    .footer {
      text-align: center;
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid #d4a853;
      font-size: 9px;
      color: #999;
    }
    .footer a {
      color: #8B6914;
      text-decoration: none;
    }

    /* ── Print / @page ── */
    @media print {
      body { padding: 12px 16px; }
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      tr { break-inside: avoid; }
      .no-print { display: none !important; }
    }

    /* ── Print button (hidden in print) ── */
    .print-bar {
      text-align: center;
      margin-bottom: 16px;
    }
    .print-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border: 2px solid #d4a853;
      border-radius: 6px;
      background: #faf5e8;
      color: #8B6914;
      font-family: 'Cinzel', serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #f0e8d0;
    }
  </style>
</head>
<body>
  <!-- Print action bar — hidden in print output -->
  <div class="print-bar no-print">
    <button class="print-btn" onclick="window.print()">
      &#128424; Save as PDF / Print
    </button>
  </div>

  <div class="header">
    <h1>Dekho Panchang &mdash; Monthly Panchang</h1>
    <div class="subtitle">${escapeHtml(subtitle)}</div>
    <div class="city">${escapeHtml(cityName)}</div>
    <div class="coords">${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'} &bull; ${escapeHtml(timezone)}</div>
  </div>

  <div class="legend">
    <div class="legend-item">
      <span class="legend-swatch" style="background:#fff8eb;border:1px solid #d5d0c4;"></span>
      Sunday
    </div>
    <div class="legend-item">
      <span class="legend-swatch" style="background:#dc2626;border-radius:50%;"></span>
      Panchak
    </div>
    <div class="legend-item">
      <span class="legend-swatch" style="background:transparent;border:1px solid #d5d0c4;color:#92400e;font-weight:700;font-size:8px;line-height:12px;text-align:center;">F</span>
      Festival/Vrat
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Day</th>
        <th>Tithi</th>
        <th>Nakshatra</th>
        <th>Yoga</th>
        <th>Sunrise</th>
        <th>Sunset</th>
        <th>Rahu Kaal</th>
        <th>Festival / Vrat</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="footer">
    Generated on ${generatedDate} by
    <a href="https://dekhopanchang.com" target="_blank" rel="noopener">Dekho Panchang</a>
    &mdash; dekhopanchang.com
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

/** Escape HTML entities to prevent XSS in user-provided city/location names */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
