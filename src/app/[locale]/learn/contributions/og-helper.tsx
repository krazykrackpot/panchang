import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

export function createContributionOG(hook: string, stat: string, branding?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(145deg, #0a0e27 0%, #0f1535 30%, #1a1040 60%, #0a0e27 100%)',
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
        {/* Top gold border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 0%, #d4a853 20%, #f0d48a 50%, #d4a853 80%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Bottom gold border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 0%, #d4a853 20%, #f0d48a 50%, #d4a853 80%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Large decorative circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.05)',
            display: 'flex',
          }}
        />

        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.06)',
            display: 'flex',
          }}
        />

        {/* Subtle radial glow behind text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 600,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212, 168, 83, 0.04) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* "DID YOU KNOW?" label */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#d4a853',
            letterSpacing: 6,
            textTransform: 'uppercase' as const,
            marginBottom: 32,
            display: 'flex',
          }}
        >
          DID YOU KNOW?
        </div>

        {/* Gold line separator */}
        <div
          style={{
            width: 60,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginBottom: 32,
            display: 'flex',
          }}
        />

        {/* Main hook text */}
        <div
          style={{
            fontSize: hook.length > 35 ? 44 : 52,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -0.5,
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: 1000,
            marginBottom: 28,
            display: 'flex',
            padding: '0 40px',
          }}
        >
          {hook}
        </div>

        {/* Stat/subtitle in gold */}
        <div
          style={{
            fontSize: stat.length > 50 ? 22 : 26,
            fontWeight: 600,
            color: '#f0d48a',
            letterSpacing: 1,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.3,
            display: 'flex',
            padding: '0 40px',
          }}
        >
          {stat}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 24,
              height: 2,
              background: 'rgba(212, 168, 83, 0.3)',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: '#8a8478',
              letterSpacing: 2,
              display: 'flex',
            }}
          >
            {branding || 'dekhopanchang.com  ·  Learn the full story'}
          </div>
          <div
            style={{
              width: 24,
              height: 2,
              background: 'rgba(212, 168, 83, 0.3)',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
