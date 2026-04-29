import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Muhurta AI Scanner — Find Your Auspicious Time | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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

        {/* Decorative SVG — stylised sun/clock dial representing auspicious timing */}
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <svg width={100} height={100} viewBox="0 0 100 100">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="#d4a853" strokeWidth={1} opacity={0.35} />
            {/* Inner ring */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="#d4a853" strokeWidth={0.8} opacity={0.25} />
            {/* Centre dot */}
            <circle cx="50" cy="50" r="4" fill="#d4a853" opacity={0.6} />
            {/* Hour tick marks at 12 positions */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const x1 = 50 + 40 * Math.cos(rad);
              const y1 = 50 + 40 * Math.sin(rad);
              const x2 = 50 + 46 * Math.cos(rad);
              const y2 = 50 + 46 * Math.sin(rad);
              return (
                <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#d4a853" strokeWidth={deg % 90 === 0 ? 2 : 1} opacity={0.45} />
              );
            })}
            {/* Single "auspicious" hand pointing to 10 o'clock position */}
            <line x1="50" y1="50" x2="24" y2="22"
              stroke="#f0d48a" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          </svg>
        </div>

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
          VEDIC ASTROLOGY TOOL
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: '#f0d48a',
            letterSpacing: -1,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          Muhurta AI Scanner
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: '#8a8478',
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          Find Your Auspicious Time
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 28,
            marginBottom: 28,
            display: 'flex',
          }}
        />

        {/* Feature tags */}
        <div style={{ display: 'flex', gap: 32 }}>
          {['Panchang-Aware', 'AI-Powered', '20+ Activities'].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 14,
                color: '#d4a853',
                letterSpacing: 1,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 16,
                paddingRight: 16,
                border: '1px solid rgba(212, 168, 83, 0.3)',
                borderRadius: 20,
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
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
