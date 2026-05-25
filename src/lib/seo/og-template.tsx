import { ImageResponse } from 'next/og';

/**
 * Reusable OG-image renderer. Centralises the gold-on-navy template so
 * every route-specific opengraph-image.tsx is a 5-line file passing
 * title + tagline. Audit 2026-05-25 §C3.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

interface OgImageProps {
  /** Big bold title — e.g. "Solar & Lunar Eclipses 2026". */
  title: string;
  /** All-caps subtitle — e.g. "ECLIPSE CALENDAR". */
  tagline: string;
  /** Optional supporting line — e.g. "Sutak times · Visibility · Remedies". */
  footer?: string;
}

export function renderOgImage({ title, tagline, footer }: OgImageProps) {
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
          padding: '0 80px',
        }}
      >
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 24, borderRadius: 2, display: 'flex' }} />
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: '#f0d48a',
            letterSpacing: -1,
            marginBottom: 16,
            display: 'flex',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: '#8a8478', letterSpacing: 4, display: 'flex' }}>
          {tagline}
        </div>
        {footer ? (
          <div style={{ fontSize: 22, color: '#d4a853', marginTop: 32, opacity: 0.85, display: 'flex', textAlign: 'center' }}>
            {footer}
          </div>
        ) : null}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 24, borderRadius: 2, display: 'flex' }} />
      </div>
    ),
    { ...OG_SIZE },
  );
}
