import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600; // Refresh every hour

// ─── Inlined rashi data (edge-safe, no native deps) ─────────────────────────

const RASHI_MAP: Record<string, { vedic: string; western: string; symbol: string }> = {
  mesh:      { vedic: 'Mesh',      western: 'Aries',       symbol: '♈' },
  vrishabh:  { vedic: 'Vrishabh', western: 'Taurus',      symbol: '♉' },
  mithun:    { vedic: 'Mithun',   western: 'Gemini',      symbol: '♊' },
  kark:      { vedic: 'Kark',     western: 'Cancer',      symbol: '♋' },
  simha:     { vedic: 'Simha',    western: 'Leo',         symbol: '♌' },
  kanya:     { vedic: 'Kanya',    western: 'Virgo',       symbol: '♍' },
  tula:      { vedic: 'Tula',     western: 'Libra',       symbol: '♎' },
  vrishchik: { vedic: 'Vrishchik',western: 'Scorpio',     symbol: '♏' },
  dhanu:     { vedic: 'Dhanu',    western: 'Sagittarius', symbol: '♐' },
  makar:     { vedic: 'Makar',    western: 'Capricorn',   symbol: '♑' },
  kumbh:     { vedic: 'Kumbh',    western: 'Aquarius',    symbol: '♒' },
  meen:      { vedic: 'Meen',     western: 'Pisces',      symbol: '♓' },
};

// Western slug aliases → vedic slug
const WESTERN_TO_VEDIC: Record<string, string> = {
  aries: 'mesh', taurus: 'vrishabh', gemini: 'mithun', cancer: 'kark',
  leo: 'simha', virgo: 'kanya', libra: 'tula', scorpio: 'vrishchik',
  sagittarius: 'dhanu', capricorn: 'makar', aquarius: 'kumbh', pisces: 'meen',
};

function getRashiInfo(slug: string) {
  const vedicSlug = RASHI_MAP[slug] ? slug : WESTERN_TO_VEDIC[slug.toLowerCase()];
  return vedicSlug ? RASHI_MAP[vedicSlug] : null;
}

/** ISO week number for a given date. */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Monday and Sunday of the current ISO week (UTC). */
function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun..6=Sat
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - ((dayOfWeek + 6) % 7)); // shift to Monday
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { start: monday, end: sunday };
}

// ─── OG Image ───────────────────────────────────────────────────────────────

export const alt = 'Weekly Horoscope — Dekho Panchang';

export default async function Image({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  // params is a Promise in Next.js 16 — must be awaited before accessing properties.
  const { rashi: rashiSlug } = await params;

  const rashiInfo = getRashiInfo(rashiSlug ?? '');
  const vedicName = rashiInfo?.vedic ?? 'Horoscope';
  const westernName = rashiInfo?.western ?? '';
  const symbol = rashiInfo?.symbol ?? '✦';

  const { start, end } = getCurrentWeekRange();
  const weekNum = getISOWeek(start);

  const formatOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  const startStr = start.toLocaleDateString('en-US', formatOpts);
  const endStr = end.toLocaleDateString('en-US', { ...formatOpts, year: 'numeric' });
  const weekRangeStr = `${startStr} – ${endStr}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 50%, #0a0e27 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.08)',
            display: 'flex',
          }}
        />

        {/* Top eyebrow */}
        <div
          style={{
            fontSize: 13,
            letterSpacing: 5,
            color: '#d4a853',
            textTransform: 'uppercase',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
          WEEKLY HOROSCOPE
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
        </div>

        {/* Zodiac symbol */}
        <div
          style={{
            fontSize: 72,
            color: '#d4a853',
            marginBottom: 8,
            display: 'flex',
            opacity: 0.85,
          }}
        >
          {symbol}
        </div>

        {/* Rashi name (Vedic + Western) */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#f0d48a',
            letterSpacing: -1,
            marginBottom: 4,
            display: 'flex',
          }}
        >
          {vedicName}
        </div>
        {westernName ? (
          <div
            style={{
              fontSize: 24,
              color: '#8a8478',
              letterSpacing: 2,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            {westernName}
          </div>
        ) : null}

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 8,
            marginBottom: 24,
            display: 'flex',
          }}
        />

        {/* Week range */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 13, color: '#8a8478', letterSpacing: 3, textTransform: 'uppercase', display: 'flex' }}>
            Week {weekNum}
          </div>
          <div style={{ fontSize: 22, color: '#d4a853', fontWeight: 600, display: 'flex' }}>
            {weekRangeStr}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 15,
            color: '#8a8478',
            marginTop: 40,
            opacity: 0.5,
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
