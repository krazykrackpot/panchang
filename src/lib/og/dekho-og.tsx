/**
 * Shared OG-card renderer for Dekho Panchang flagship pages.
 *
 * One template, multiple instantiations — each page-specific
 * `opengraph-image.tsx` just calls `renderDekhoOG()` with its own label,
 * title, and subtitle. Keeps the visual identity consistent and the
 * per-page files tiny.
 *
 * Visual baseline mirrors the existing /festivals OG card: dark navy
 * gradient, gold accents, centered title with eyebrow label and a gilded
 * divider beneath. Edge runtime, 1200×630 PNG.
 */

import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = 'image/png';
export const ogRuntime = 'edge';

export interface DekhoOGProps {
  /** Small uppercase eyebrow above the title. e.g. "AI Vedic Astrologer". */
  eyebrow: string;
  /** Main headline lines. Each entry becomes a `<div>` for line break control. */
  titleLines: string[];
  /** Optional subtitle rendered beneath the gilded divider. */
  subtitle?: string;
}

export function renderDekhoOG({ eyebrow, titleLines, subtitle }: DekhoOGProps): ImageResponse {
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
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(212, 168, 83, 0.15)',
            borderRadius: 16,
            display: 'flex',
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 340,
            height: 340,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.06)',
            display: 'flex',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 16,
            color: '#8a8478',
            letterSpacing: 5,
            marginBottom: 20,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            color: '#f0d48a',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {titleLines.map((line, i) => (
            <span key={i} style={{ display: 'flex' }}>{line}</span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 16,
            marginBottom: 24,
            display: 'flex',
          }}
        />

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 22,
              color: '#8a8478',
              textAlign: 'center',
              letterSpacing: 1,
              maxWidth: 820,
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        )}

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
    { ...ogSize },
  );
}
