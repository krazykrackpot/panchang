/**
 * API Route: GET /api/card/[type]?format=og&...params
 *
 * Server-side card image generation using @vercel/og (Satori + PNG).
 * Returns a PNG image with appropriate cache headers.
 *
 * Supported types: birth-poster, daily-vibe, yoga-badge
 * Supported formats: story (1080x1920), square (1080x1080), og (1200x630)
 *
 * This is the infrastructure route — each card type will get its own
 * content renderer wired up separately. For now, renders a placeholder.
 */

import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import {
  CARD_DIMENSIONS,
  CARD_COLORS,
  WATERMARK_URL,
  parseCardFormat,
  isValidCardType,
} from '@/lib/shareable/card-base';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  if (!isValidCardType(type)) {
    return new Response(
      JSON.stringify({ error: `Invalid card type: ${type}. Expected: birth-poster, daily-vibe, yoga-badge` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { searchParams } = request.nextUrl;
  const format = parseCardFormat(searchParams.get('format'));
  const { width, height } = CARD_DIMENSIONS[format];

  // Human-readable type label for the placeholder
  const typeLabel = type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Placeholder card — actual card content will be wired up per type.
  // Uses Satori-compatible JSX (flexbox only, no grid, no CSS variables).
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: CARD_COLORS.navy,
          // Subtle radial gradient overlay
          backgroundImage: `radial-gradient(circle at 50% 30%, #1a1f4d 0%, ${CARD_COLORS.navy} 70%)`,
          padding: '48px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gold border frame */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            bottom: '16px',
            border: `1px solid ${CARD_COLORS.goldDark}33`,
            borderRadius: '24px',
            display: 'flex',
          }}
        />

        {/* Card type label */}
        <div
          style={{
            fontSize: '14px',
            letterSpacing: '4px',
            textTransform: 'uppercase' as const,
            color: CARD_COLORS.gold,
            opacity: 0.7,
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          Dekho Panchang
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: format === 'og' ? '48px' : '56px',
            fontWeight: 700,
            color: CARD_COLORS.goldLight,
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          {typeLabel}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '20px',
            color: CARD_COLORS.text,
            opacity: 0.6,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Card generation coming soon
        </div>

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '48px',
            fontSize: '14px',
            color: CARD_COLORS.gold,
            opacity: 0.6,
            display: 'flex',
          }}
        >
          {WATERMARK_URL}
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        // Cache birth-poster indefinitely, daily-vibe for 24h, yoga-badge indefinitely
        'Cache-Control':
          type === 'daily-vibe'
            ? 'public, max-age=86400, s-maxage=86400'
            : 'public, max-age=604800, s-maxage=604800',
      },
    }
  );
}
