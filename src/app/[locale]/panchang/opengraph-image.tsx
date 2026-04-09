import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Today's Panchang — Dekho Panchang";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600; // Refresh every hour

// ─── Inlined Meeus calculations (Edge-compatible, no native deps) ───────────

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function dateToJD(year: number, month: number, day: number, hour: number = 0): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
}

function T(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

function sunLongitude(jd: number): number {
  const t = T(jd);
  const L0 = normalizeDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const M = normalizeDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const Mrad = toRad(M);
  const C =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const sunTrue = normalizeDeg(L0 + C);
  const omega = 125.04 - 1934.136 * t;
  const apparent = sunTrue - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  return normalizeDeg(apparent);
}

function moonLongitude(jd: number): number {
  const t = T(jd);
  const Lp = normalizeDeg(
    218.3164477 + 481267.88123421 * t - 0.0015786 * t * t + (t * t * t) / 538841 - (t * t * t * t) / 65194000
  );
  const D = normalizeDeg(
    297.8501921 + 445267.1114034 * t - 0.0018819 * t * t + (t * t * t) / 545868 - (t * t * t * t) / 113065000
  );
  const M = normalizeDeg(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t + (t * t * t) / 24490000);
  const Mp = normalizeDeg(
    134.9633964 + 477198.8675055 * t + 0.0087414 * t * t + (t * t * t) / 69699 - (t * t * t * t) / 14712000
  );
  const F = normalizeDeg(
    93.272095 + 483202.0175233 * t - 0.0036539 * t * t - (t * t * t) / 3526000 + (t * t * t * t) / 863310000
  );

  const E = 1 - 0.002516 * t - 0.0000074 * t * t;
  const E2 = E * E;
  const dr = toRad(D),
    mr = toRad(M),
    mpr = toRad(Mp),
    fr = toRad(F);

  const LR: [number, number, number, number, number][] = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
    [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
    [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
    [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
    [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
    [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
    [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
    [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
    [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
    [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
    [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700],
    [2, 1, -2, 0, 691], [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
    [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399], [0, 0, 2, -2, -381],
    [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330], [2, -1, 2, 0, 327],
    [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294], [2, 0, -1, -2, 0],
  ];

  let sumL = 0;
  for (const [cd, cm, cmp, cf, sl] of LR) {
    const arg = cd * dr + cm * mr + cmp * mpr + cf * fr;
    let coeff = sl;
    const absM = Math.abs(cm);
    if (absM === 1) coeff *= E;
    else if (absM === 2) coeff *= E2;
    sumL += coeff * Math.sin(arg);
  }

  const A1 = toRad(normalizeDeg(119.75 + 131.849 * t));
  const A2 = toRad(normalizeDeg(53.09 + 479264.29 * t));
  sumL += 3958 * Math.sin(A1) + 1962 * Math.sin(toRad(Lp) - fr) + 318 * Math.sin(A2);

  return normalizeDeg(Lp + sumL / 1000000);
}

function lahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  return 23.85306 + 1.39722 * t + 0.00018 * t * t - 0.000005 * t * t * t;
}

function toSidereal(tropicalLong: number, jd: number): number {
  return normalizeDeg(tropicalLong - lahiriAyanamsha(jd));
}

// ─── Tithi & Nakshatra & Yoga names (inlined for Edge) ─────────────────────

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma',
  'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana',
  'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

// ─── OG Image ───────────────────────────────────────────────────────────────

export default function Image() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const jd = dateToJD(year, month, day, 12); // noon UT for stable values

  // Calculate panchang elements
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);

  const tithiDiff = normalizeDeg(moonSid - sunSid);
  const tithiNum = Math.floor(tithiDiff / 12) + 1;
  const tithiName = TITHI_NAMES[tithiNum - 1] || 'Unknown';
  const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';

  const nakshatraNum = Math.floor(moonSid / (360 / 27)) + 1;
  const nakshatraName = NAKSHATRA_NAMES[nakshatraNum - 1] || 'Unknown';

  const yogaSum = normalizeDeg(sunSid + moonSid);
  const yogaNum = Math.floor(yogaSum / (360 / 27)) + 1;
  const yogaName = YOGA_NAMES[yogaNum - 1] || 'Unknown';

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

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
        {/* Subtle decorative circles */}
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

        {/* Header */}
        <div
          style={{
            fontSize: 18,
            color: '#8a8478',
            letterSpacing: 4,
            marginBottom: 12,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {"Today's Panchang"}
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 38,
            color: '#f0d48a',
            fontWeight: 700,
            marginBottom: 8,
            display: 'flex',
          }}
        >
          {dateStr}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 16,
            marginBottom: 32,
            display: 'flex',
          }}
        />

        {/* Panchang elements row */}
        <div style={{ display: 'flex', gap: 64, marginTop: 0 }}>
          {/* Tithi */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              TITHI
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{tithiName}</div>
            <div style={{ fontSize: 14, color: '#8a8478', marginTop: 4, display: 'flex' }}>{paksha} Paksha</div>
          </div>

          {/* Nakshatra */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              NAKSHATRA
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{nakshatraName}</div>
          </div>

          {/* Yoga */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              YOGA
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{yogaName}</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 15,
            color: '#8a8478',
            marginTop: 48,
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
