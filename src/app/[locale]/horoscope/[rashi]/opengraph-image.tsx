import { ImageResponse } from 'next/og';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';

// Node.js runtime required  –  daily-engine chains to swiss-ephemeris (native module, not edge-safe)
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// On-demand revalidation only. The OG image inherits down to
// /[rashi]/[date] children — keeping a daily revalidate window here
// burned ISR writes for the dated horoscope grid (12 rashis × 9 locales
// = 108 PNGs/day max) without a real freshness benefit, since the
// rendered PNG is rashi-keyed, not date-keyed. revalidatePath on the
// page route flips this OG cache too, so the nightly precompute
// pipeline still propagates fresh visuals on demand. Mirrors the
// page/layout switch in this same surface.
export const revalidate = false;

// ─── Inlined rashi data (edge-safe, no native deps) ─────────────────────────

const RASHI_MAP: Record<string, { id: number; vedic: string; western: string; symbol: string }> = {
  mesh:      { id: 1,  vedic: 'Mesh',      western: 'Aries',       symbol: '♈' },
  vrishabh:  { id: 2,  vedic: 'Vrishabh', western: 'Taurus',      symbol: '♉' },
  mithun:    { id: 3,  vedic: 'Mithun',   western: 'Gemini',      symbol: '♊' },
  kark:      { id: 4,  vedic: 'Kark',     western: 'Cancer',      symbol: '♋' },
  simha:     { id: 5,  vedic: 'Simha',    western: 'Leo',         symbol: '♌' },
  kanya:     { id: 6,  vedic: 'Kanya',    western: 'Virgo',       symbol: '♍' },
  tula:      { id: 7,  vedic: 'Tula',     western: 'Libra',       symbol: '♎' },
  vrishchik: { id: 8,  vedic: 'Vrishchik',western: 'Scorpio',     symbol: '♏' },
  dhanu:     { id: 9,  vedic: 'Dhanu',    western: 'Sagittarius', symbol: '♐' },
  makar:     { id: 10, vedic: 'Makar',    western: 'Capricorn',   symbol: '♑' },
  kumbh:     { id: 11, vedic: 'Kumbh',    western: 'Aquarius',    symbol: '♒' },
  meen:      { id: 12, vedic: 'Meen',     western: 'Pisces',      symbol: '♓' },
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

// ─── OG Image ───────────────────────────────────────────────────────────────

export const alt = 'Daily Horoscope  –  Dekho Panchang';

/** Score colour: green for 7+, amber for 5-6, red-ish for ≤4. */
function scoreColor(score: number): string {
  if (score >= 7) return '#4ade80'; // green
  if (score >= 5) return '#f0d48a'; // gold/amber
  return '#f87171';                 // red
}

export default async function Image({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  // params is a Promise in Next.js 16  –  must be awaited before accessing properties.
  const { rashi: rashiSlug } = await params;

  const rashiInfo = getRashiInfo(rashiSlug ?? '');
  const vedicName = rashiInfo?.vedic ?? 'Horoscope';
  const westernName = rashiInfo?.western ?? '';
  const symbol = rashiInfo?.symbol ?? '✦';
  const rashiId = rashiInfo?.id ?? 1;

  const now = new Date();
  const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // Compute today's score via the deterministic horoscope engine
  const horoscope = generateDailyHoroscope({ moonSign: rashiId, date: today });
  const score = horoscope.overallScore;
  const color = scoreColor(score);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 50%, #0a0e27 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
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

        {/* Left column: rashi info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingLeft: 60,
          }}
        >
          {/* Top eyebrow */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: 5,
              color: '#d4a853',
              textTransform: 'uppercase',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
            DAILY HOROSCOPE
            <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
          </div>

          {/* Zodiac symbol */}
          <div
            style={{
              fontSize: 64,
              color: '#d4a853',
              marginBottom: 4,
              display: 'flex',
              opacity: 0.85,
            }}
          >
            {symbol}
          </div>

          {/* Rashi name (Vedic + Western) */}
          <div
            style={{
              fontSize: 56,
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
                fontSize: 22,
                color: '#8a8478',
                letterSpacing: 2,
                marginBottom: 16,
                display: 'flex',
              }}
            >
              {westernName}
            </div>
          ) : null}

          {/* Date */}
          <div
            style={{
              fontSize: 18,
              color: '#d4a853',
              fontWeight: 600,
              display: 'flex',
            }}
          >
            {dateStr}
          </div>
        </div>

        {/* Right column: score badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 80,
            gap: 8,
          }}
        >
          {/* Score label */}
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4,
              color: '#8a8478',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {"TODAY'S SCORE"}
          </div>

          {/* Score circle */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `4px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10, 14, 39, 0.8)',
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                color,
                lineHeight: 1,
                display: 'flex',
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#8a8478',
                marginTop: 2,
                display: 'flex',
              }}
            >
              / 10
            </div>
          </div>

          {/* Score tier label */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginTop: 4,
              display: 'flex',
            }}
          >
            {score >= 8 ? 'EXCELLENT' : score >= 6 ? 'GOOD' : score >= 4 ? 'MIXED' : 'CHALLENGING'}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            fontSize: 15,
            color: '#8a8478',
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
