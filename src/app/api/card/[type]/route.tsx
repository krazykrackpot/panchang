/**
 * API Route: GET /api/card/[type]?format=og&...params
 *
 * Server-side card image generation using @vercel/og (Satori + PNG).
 * Returns a PNG image with appropriate cache headers.
 *
 * Supported types: birth-poster, daily-vibe, yoga-badge, discovery, blueprint, compatibility
 * Supported formats: story (1080x1920), square (1080x1080), og (1200x630)
 *
 * Discovery card params:
 *   tropicalSign  — e.g. "Aries"
 *   siderealSign  — e.g. "Pisces"
 *   shiftedCount  — number of planets that shifted sign
 *   totalPlanets  — total planets compared (default 9)
 *   hookLine      — short narrative hook line
 *   ayanamsha     — e.g. "24.2°"
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
      JSON.stringify({ error: `Invalid card type: ${type}. Expected: birth-poster, daily-vibe, yoga-badge, discovery, blueprint, compatibility` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { searchParams } = request.nextUrl;
  const format = parseCardFormat(searchParams.get('format'));
  const { width, height } = CARD_DIMENSIONS[format];

  // ── Discovery Card ───────────────────────────────────────────────────────────
  // Story-format viral card: "I thought I was Aries — but the stars say Pisces"
  if (type === 'discovery') {
    const tropicalSign = searchParams.get('tropicalSign') ?? 'Unknown';
    const siderealSign = searchParams.get('siderealSign') ?? 'Unknown';
    const shiftedCount = parseInt(searchParams.get('shiftedCount') ?? '0', 10);
    const totalPlanets = parseInt(searchParams.get('totalPlanets') ?? '9', 10);
    const hookLine = searchParams.get('hookLine') ?? '';
    const ayanamsha = searchParams.get('ayanamsha') ?? '';

    // Scale font sizes for format — story is tall (1920px), og is shorter (630px)
    const isStory = format === 'story';
    const isOg = format === 'og';

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
            backgroundImage: `radial-gradient(ellipse at 50% 20%, #1a1f4d 0%, ${CARD_COLORS.navy} 65%)`,
            padding: isOg ? '48px 64px' : '80px 72px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Gold border frame */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: `1px solid ${CARD_COLORS.goldDark}44`,
              borderRadius: '28px',
              display: 'flex',
            }}
          />

          {/* Corner ornaments — top left */}
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: '36px',
              width: isOg ? '32px' : '48px',
              height: isOg ? '32px' : '48px',
              borderTop: `2px solid ${CARD_COLORS.gold}88`,
              borderLeft: `2px solid ${CARD_COLORS.gold}88`,
              display: 'flex',
            }}
          />
          {/* Corner ornaments — bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: '36px',
              right: '36px',
              width: isOg ? '32px' : '48px',
              height: isOg ? '32px' : '48px',
              borderBottom: `2px solid ${CARD_COLORS.gold}88`,
              borderRight: `2px solid ${CARD_COLORS.gold}88`,
              display: 'flex',
            }}
          />

          {/* ── Top tag ── */}
          <div
            style={{
              position: 'absolute',
              top: isOg ? '44px' : '72px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: isOg ? '20px' : '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
            <div
              style={{
                fontSize: isOg ? '11px' : '14px',
                letterSpacing: '5px',
                textTransform: 'uppercase' as const,
                color: CARD_COLORS.gold,
                display: 'flex',
              }}
            >
              ASTRONOMICAL TRUTH
            </div>
            <div style={{ width: isOg ? '20px' : '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isOg ? '16px' : '28px',
              maxWidth: '88%',
            }}
          >
            {/* "I thought I was" */}
            <div
              style={{
                fontSize: isOg ? '20px' : isStory ? '30px' : '26px',
                color: CARD_COLORS.text,
                opacity: 0.7,
                display: 'flex',
              }}
            >
              I thought I was
            </div>

            {/* OLD SIGN — muted, struck-through visual effect via opacity */}
            <div
              style={{
                fontSize: isOg ? '40px' : isStory ? '72px' : '56px',
                fontWeight: 700,
                color: '#6b7280',
                display: 'flex',
                letterSpacing: '-1px',
                textDecoration: 'line-through',
              }}
            >
              {tropicalSign}
            </div>

            {/* Divider line */}
            <div
              style={{
                width: isOg ? '40px' : '64px',
                height: '1px',
                backgroundColor: CARD_COLORS.goldDark,
                opacity: 0.6,
                display: 'flex',
              }}
            />

            {/* "But the stars say" */}
            <div
              style={{
                fontSize: isOg ? '20px' : isStory ? '30px' : '26px',
                color: CARD_COLORS.text,
                opacity: 0.7,
                display: 'flex',
              }}
            >
              But the stars say
            </div>

            {/* NEW SIGN — gold, bold, large */}
            <div
              style={{
                fontSize: isOg ? '56px' : isStory ? '100px' : '80px',
                fontWeight: 900,
                color: CARD_COLORS.goldLight,
                display: 'flex',
                letterSpacing: '-2px',
                lineHeight: 1,
              }}
            >
              {siderealSign}
            </div>

            {/* Hook line */}
            {hookLine && (
              <div
                style={{
                  fontSize: isOg ? '15px' : '20px',
                  color: CARD_COLORS.text,
                  opacity: 0.65,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  maxWidth: isOg ? '480px' : '800px',
                  lineHeight: 1.5,
                  display: 'flex',
                }}
              >
                &ldquo;{hookLine}&rdquo;
              </div>
            )}

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isOg ? '12px' : '20px',
                marginTop: isOg ? '4px' : '8px',
              }}
            >
              {/* Shifted count pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: `${CARD_COLORS.gold}18`,
                  border: `1px solid ${CARD_COLORS.gold}44`,
                  borderRadius: '999px',
                  padding: isOg ? '6px 16px' : '8px 24px',
                }}
              >
                <div
                  style={{
                    fontSize: isOg ? '18px' : '28px',
                    fontWeight: 700,
                    color: CARD_COLORS.gold,
                    display: 'flex',
                  }}
                >
                  {shiftedCount}
                </div>
                <div
                  style={{
                    fontSize: isOg ? '13px' : '16px',
                    color: CARD_COLORS.text,
                    opacity: 0.65,
                    display: 'flex',
                  }}
                >
                  of {totalPlanets} planets shifted sign
                </div>
              </div>

              {/* Ayanamsha pill */}
              {ayanamsha && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: `${CARD_COLORS.goldDark}22`,
                    border: `1px solid ${CARD_COLORS.goldDark}44`,
                    borderRadius: '999px',
                    padding: isOg ? '6px 14px' : '8px 20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: isOg ? '12px' : '14px',
                      color: CARD_COLORS.text,
                      opacity: 0.5,
                      display: 'flex',
                    }}
                  >
                    Ayanamsha (Lahiri)
                  </div>
                  <div
                    style={{
                      fontSize: isOg ? '13px' : '16px',
                      fontWeight: 600,
                      color: CARD_COLORS.gold,
                      opacity: 0.8,
                      display: 'flex',
                    }}
                  >
                    {ayanamsha}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom CTA + watermark ── */}
          <div
            style={{
              position: 'absolute',
              bottom: isOg ? '40px' : '72px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isOg ? '6px' : '10px',
            }}
          >
            <div
              style={{
                fontSize: isOg ? '16px' : '22px',
                fontWeight: 600,
                color: CARD_COLORS.goldLight,
                display: 'flex',
              }}
            >
              What shifted for YOU?
            </div>
            <div
              style={{
                fontSize: isOg ? '12px' : '16px',
                color: CARD_COLORS.gold,
                opacity: 0.6,
                letterSpacing: '1px',
                display: 'flex',
              }}
            >
              {WATERMARK_URL}
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          // Discovery cards are keyed by sign params — cache for 30 days
          'Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
        },
      }
    );
  }

  // ── Placeholder for other card types ────────────────────────────────────────

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
