import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getCityBySlug, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import type { LocaleText } from '@/types/panchang';
import type { Metadata } from 'next';

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: 'Panchang Widget — Dekho Panchang',
  robots: { index: false },
};

/**
 * Embeddable panchang widget — designed for temple websites.
 * URL: /embed/panchang?city=varanasi or ?lat=25.31&lng=82.97&name=Varanasi
 *
 * Light theme, compact (300x400px), no navbar/footer, iframeable.
 * Sets X-Frame-Options: ALLOWALL so any site can embed it.
 */
export default async function EmbedPanchangPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; lat?: string; lng?: string; name?: string }>;
}) {
  const params = await searchParams;

  // Resolve location from city slug or lat/lng params
  let cityData: CityData | undefined;
  let lat: number;
  let lng: number;
  let locationName: string;
  let timezone: string;

  if (params.city) {
    cityData = getCityBySlug(params.city);
    if (!cityData) {
      return <WidgetError message={`City "${params.city}" not found. Use ?city=varanasi or ?lat=...&lng=...&name=...`} />;
    }
    lat = cityData.lat;
    lng = cityData.lng;
    locationName = cityData.name.en;
    timezone = cityData.timezone;
  } else if (params.lat && params.lng) {
    lat = parseFloat(params.lat);
    lng = parseFloat(params.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return <WidgetError message="Invalid lat/lng. Latitude: -90 to 90, Longitude: -180 to 180." />;
    }
    locationName = params.name || `${lat.toFixed(2)}N, ${lng.toFixed(2)}E`;
    // Approximate timezone from longitude — not perfect, but reasonable for display
    // For best results, pass ?city= which has IANA timezone built in
    timezone = 'Asia/Kolkata'; // Default; users should prefer city slugs
  } else {
    return <WidgetError message="Missing location. Use ?city=varanasi or ?lat=25.31&lng=82.97&name=Varanasi" />;
  }

  // Compute today's date in the location's timezone
  const now = new Date();
  const tzOffset = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), timezone);
  const localMs = now.getTime() + tzOffset * 3600 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = localDate.getUTCMonth() + 1;
  const day = localDate.getUTCDate();

  // Compute panchang
  const panchang = computePanchang({
    year,
    month,
    day,
    lat,
    lng,
    tzOffset,
    timezone,
    locationName,
  });

  // Find today's festivals
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  let festivals: FestivalEntry[] = [];
  try {
    const allFestivals = generateFestivalCalendarV2(year, lat, lng, timezone);
    festivals = allFestivals.filter(f => f.date === todayStr);
    clearTithiTableCache();
  } catch (err) {
    console.error('[embed/panchang] Festival lookup failed:', err);
  }

  // Format date
  const dateStr = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const L = (obj: LocaleText) => obj.en;

  // Transition times for display
  const tithiEnd = panchang.tithiTransition?.endTime;
  const nakEnd = panchang.nakshatraTransition?.endTime;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: WIDGET_STYLES }} />
      </head>
      <body>
        <div className="widget">
          {/* Header */}
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{dateStr}</div>
          </div>

          {/* Festivals */}
          {festivals.length > 0 && (
            <div className="widget-festivals">
              {festivals.map((f, i) => (
                <div key={i} className="festival-badge">
                  {L(f.name)}
                </div>
              ))}
            </div>
          )}

          {/* Panchang Data */}
          <div className="widget-grid">
            <WidgetRow label="Tithi" value={L(panchang.tithi.name)} time={tithiEnd ? `until ${tithiEnd}` : undefined} />
            <WidgetRow label="Nakshatra" value={L(panchang.nakshatra.name)} time={nakEnd ? `until ${nakEnd}` : undefined} />
            <WidgetRow label="Yoga" value={L(panchang.yoga.name)} />
            <WidgetRow label="Karana" value={L(panchang.karana.name)} />
            <WidgetRow label="Vara" value={L(panchang.vara.name)} />
          </div>

          {/* Sun times */}
          <div className="widget-sun">
            <div className="sun-item">
              <span className="sun-icon">&#9728;</span>
              <span className="sun-label">Sunrise</span>
              <span className="sun-time">{panchang.sunrise}</span>
            </div>
            <div className="sun-item">
              <span className="sun-icon">&#9790;</span>
              <span className="sun-label">Sunset</span>
              <span className="sun-time">{panchang.sunset}</span>
            </div>
          </div>

          {/* Powered by */}
          <div className="widget-footer">
            <a href="https://dekhopanchang.com" target="_blank" rel="noopener noreferrer">
              Powered by <strong>Dekho Panchang</strong>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

function WidgetRow({ label, value, time }: { label: string; value: string; time?: string }) {
  return (
    <div className="grid-row">
      <span className="grid-label">{label}</span>
      <span className="grid-value">
        {value}
        {time && <span className="grid-time">{time}</span>}
      </span>
    </div>
  );
}

function WidgetError({ message }: { message: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{ __html: WIDGET_STYLES }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">Configuration Error</div>
          </div>
          <div style={{ padding: '16px', color: '#c0392b', fontSize: '13px', lineHeight: '1.5' }}>
            {message}
          </div>
          <div className="widget-footer">
            <a href="https://dekhopanchang.com" target="_blank" rel="noopener noreferrer">
              Powered by <strong>Dekho Panchang</strong>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

/**
 * Inline CSS for the widget — no external dependencies.
 * Light theme, system fonts, compact layout.
 * Designed for 250-500px width.
 */
const WIDGET_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #ffffff;
    color: #333333;
    -webkit-font-smoothing: antialiased;
  }
  .widget {
    max-width: 500px;
    min-width: 250px;
    margin: 0 auto;
  }
  .widget-header {
    background: linear-gradient(135deg, #f8f4e8, #fef9ee);
    padding: 16px;
    border-bottom: 2px solid #d4a853;
  }
  .widget-location {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #8a6d2b;
    font-weight: 700;
  }
  .widget-date {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-top: 4px;
  }
  .widget-festivals {
    padding: 10px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    border-bottom: 1px solid #eee;
  }
  .festival-badge {
    display: inline-block;
    background: #d4a853;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 12px;
    letter-spacing: 0.3px;
  }
  .widget-grid {
    padding: 12px 16px;
  }
  .grid-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 7px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .grid-row:last-child { border-bottom: none; }
  .grid-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  .grid-value {
    font-size: 14px;
    font-weight: 600;
    color: #222;
    text-align: right;
  }
  .grid-time {
    display: block;
    font-size: 10px;
    color: #aaa;
    font-weight: 400;
    margin-top: 1px;
  }
  .widget-sun {
    display: flex;
    justify-content: space-around;
    padding: 12px 16px;
    background: #faf8f2;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .sun-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .sun-icon { font-size: 20px; }
  .sun-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  .sun-time { font-size: 15px; font-weight: 700; color: #333; }
  .widget-footer {
    padding: 10px 16px;
    text-align: center;
    font-size: 10px;
    color: #bbb;
  }
  .widget-footer a {
    color: #8a6d2b;
    text-decoration: none;
  }
  .widget-footer a:hover {
    text-decoration: underline;
  }
  .widget-footer strong {
    color: #d4a853;
  }
`;
