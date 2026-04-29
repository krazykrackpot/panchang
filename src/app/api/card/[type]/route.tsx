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

  // ── Blueprint Card ────────────────────────────────────────────────────────────
  // Story-format card: Cosmic Blueprint archetype + dasha chapter
  if (type === 'blueprint') {
    const name = searchParams.get('name') ?? '';
    const archetype = searchParams.get('archetype') ?? 'Unknown';
    const planet = searchParams.get('planet') ?? '';
    const currentChapter = searchParams.get('currentChapter') ?? '';
    const currentDashaYears = searchParams.get('currentDashaYears') ?? '';
    const nextChapter = searchParams.get('nextChapter') ?? '';
    const nextDashaStart = searchParams.get('nextDashaStart') ?? '';
    const headline = searchParams.get('headline') ?? '';

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
              COSMIC BLUEPRINT
            </div>
            <div style={{ width: isOg ? '20px' : '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isOg ? '14px' : '24px',
              maxWidth: '88%',
            }}
          >
            {/* Name */}
            {name && (
              <div
                style={{
                  fontSize: isOg ? '18px' : isStory ? '26px' : '22px',
                  color: CARD_COLORS.text,
                  opacity: 0.7,
                  display: 'flex',
                }}
              >
                {name}
              </div>
            )}

            {/* Archetype + planet symbol */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isOg ? '12px' : '16px',
              }}
            >
              {planet && (
                <div
                  style={{
                    fontSize: isOg ? '44px' : isStory ? '72px' : '56px',
                    color: CARD_COLORS.gold,
                    display: 'flex',
                  }}
                >
                  {planet}
                </div>
              )}
              <div
                style={{
                  fontSize: isOg ? '48px' : isStory ? '80px' : '64px',
                  fontWeight: 900,
                  color: CARD_COLORS.goldLight,
                  display: 'flex',
                  letterSpacing: '-1px',
                  lineHeight: 1,
                }}
              >
                {archetype}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: isOg ? '40px' : '64px',
                height: '1px',
                backgroundColor: CARD_COLORS.goldDark,
                opacity: 0.6,
                display: 'flex',
              }}
            />

            {/* Current chapter */}
            {currentChapter && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: isOg ? '13px' : '17px',
                    color: CARD_COLORS.text,
                    opacity: 0.5,
                    display: 'flex',
                    letterSpacing: '2px',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Currently in
                </div>
                <div
                  style={{
                    fontSize: isOg ? '24px' : isStory ? '36px' : '30px',
                    fontWeight: 700,
                    color: CARD_COLORS.gold,
                    display: 'flex',
                  }}
                >
                  {currentChapter}
                </div>
                {currentDashaYears && (
                  <div
                    style={{
                      fontSize: isOg ? '14px' : '18px',
                      color: CARD_COLORS.text,
                      opacity: 0.6,
                      display: 'flex',
                    }}
                  >
                    {currentDashaYears}
                  </div>
                )}
              </div>
            )}

            {/* Next chapter */}
            {nextChapter && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: isOg ? '13px' : '17px',
                    color: CARD_COLORS.text,
                    opacity: 0.5,
                    display: 'flex',
                    letterSpacing: '2px',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Shifting to
                </div>
                <div
                  style={{
                    fontSize: isOg ? '22px' : isStory ? '32px' : '26px',
                    fontWeight: 600,
                    color: CARD_COLORS.text,
                    display: 'flex',
                  }}
                >
                  {nextChapter}
                </div>
                {nextDashaStart && (
                  <div
                    style={{
                      fontSize: isOg ? '14px' : '18px',
                      color: CARD_COLORS.text,
                      opacity: 0.6,
                      display: 'flex',
                    }}
                  >
                    {nextDashaStart}
                  </div>
                )}
              </div>
            )}

            {/* Headline quote */}
            {headline && (
              <div
                style={{
                  fontSize: isOg ? '14px' : '19px',
                  color: CARD_COLORS.text,
                  opacity: 0.65,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  maxWidth: isOg ? '480px' : '800px',
                  lineHeight: 1.5,
                  display: 'flex',
                  marginTop: isOg ? '4px' : '8px',
                }}
              >
                &ldquo;{headline}&rdquo;
              </div>
            )}
          </div>

          {/* ── Bottom CTA ── */}
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
              {"What's YOUR archetype?"}
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
          // Blueprint cards are keyed by personal data — cache for 30 days
          'Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
        },
      }
    );
  }

  // ── Compatibility Card ───────────────────────────────────────────────────────
  // Story-format viral card: two signs, Ashta Kuta score, 3 highlighted kutas
  if (type === 'compatibility') {
    const person1Name = searchParams.get('person1Name') ?? '';
    const person1Sign = searchParams.get('person1Sign') ?? 'Unknown';
    const person2Name = searchParams.get('person2Name') ?? '';
    const person2Sign = searchParams.get('person2Sign') ?? 'Unknown';
    const score = parseInt(searchParams.get('score') ?? '0', 10);
    const maxScore = parseInt(searchParams.get('maxScore') ?? '36', 10);
    const verdict = searchParams.get('verdict') ?? 'average';
    const kuta1Name = searchParams.get('kuta1Name') ?? '';
    const kuta1Score = parseInt(searchParams.get('kuta1Score') ?? '0', 10);
    const kuta1Max = parseInt(searchParams.get('kuta1Max') ?? '1', 10);
    const kuta1Insight = searchParams.get('kuta1Insight') ?? '';
    const kuta2Name = searchParams.get('kuta2Name') ?? '';
    const kuta2Score = parseInt(searchParams.get('kuta2Score') ?? '0', 10);
    const kuta2Max = parseInt(searchParams.get('kuta2Max') ?? '1', 10);
    const kuta2Insight = searchParams.get('kuta2Insight') ?? '';
    const kuta3Name = searchParams.get('kuta3Name') ?? '';
    const kuta3Score = parseInt(searchParams.get('kuta3Score') ?? '0', 10);
    const kuta3Max = parseInt(searchParams.get('kuta3Max') ?? '1', 10);
    const kuta3Insight = searchParams.get('kuta3Insight') ?? '';

    const isStory = format === 'story';
    const isOg = format === 'og';

    // Verdict colour mapping (no CSS variables — Satori requires static values)
    const verdictColor =
      verdict === 'excellent' ? '#10b981' :
      verdict === 'good' ? '#34d399' :
      verdict === 'average' ? '#f59e0b' :
      verdict === 'below_average' ? '#f97316' :
      '#ef4444'; // not_recommended

    const verdictLabel =
      verdict === 'excellent' ? 'Excellent Match' :
      verdict === 'good' ? 'Good Match' :
      verdict === 'average' ? 'Average Match' :
      verdict === 'below_average' ? 'Below Average' :
      'Not Recommended';

    const scorePercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const progressWidth = `${scorePercent}%`;

    const highlightedKutas = [
      { name: kuta1Name, score: kuta1Score, max: kuta1Max, insight: kuta1Insight },
      { name: kuta2Name, score: kuta2Score, max: kuta2Max, insight: kuta2Insight },
      { name: kuta3Name, score: kuta3Score, max: kuta3Max, insight: kuta3Insight },
    ].filter((k) => k.name !== '');

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
              COSMIC COMPATIBILITY
            </div>
            <div style={{ width: isOg ? '20px' : '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isOg ? '14px' : '22px',
              maxWidth: '88%',
              width: '88%',
            }}
          >
            {/* Two signs side by side */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isOg ? '24px' : '40px',
              }}
            >
              {/* Person 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                {person1Name && (
                  <div style={{ fontSize: isOg ? '13px' : '18px', color: CARD_COLORS.text, opacity: 0.6, display: 'flex' }}>
                    {person1Name}
                  </div>
                )}
                <div
                  style={{
                    fontSize: isOg ? '28px' : isStory ? '44px' : '36px',
                    fontWeight: 700,
                    color: CARD_COLORS.goldLight,
                    display: 'flex',
                  }}
                >
                  {person1Sign}
                </div>
              </div>

              {/* Centre symbol */}
              <div
                style={{
                  fontSize: isOg ? '28px' : '44px',
                  color: CARD_COLORS.gold,
                  opacity: 0.5,
                  display: 'flex',
                }}
              >
                ✦
              </div>

              {/* Person 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                {person2Name && (
                  <div style={{ fontSize: isOg ? '13px' : '18px', color: CARD_COLORS.text, opacity: 0.6, display: 'flex' }}>
                    {person2Name}
                  </div>
                )}
                <div
                  style={{
                    fontSize: isOg ? '28px' : isStory ? '44px' : '36px',
                    fontWeight: 700,
                    color: CARD_COLORS.goldLight,
                    display: 'flex',
                  }}
                >
                  {person2Sign}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: isOg ? '40px' : '64px',
                height: '1px',
                backgroundColor: CARD_COLORS.goldDark,
                opacity: 0.6,
                display: 'flex',
              }}
            />

            {/* Large score display */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isOg ? '6px' : '10px',
              }}
            >
              <div
                style={{
                  fontSize: isOg ? '64px' : isStory ? '110px' : '88px',
                  fontWeight: 900,
                  color: CARD_COLORS.goldLight,
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                {score}
                <span
                  style={{
                    fontSize: isOg ? '32px' : isStory ? '52px' : '44px',
                    fontWeight: 400,
                    color: CARD_COLORS.text,
                    opacity: 0.5,
                    alignSelf: 'flex-end',
                    paddingBottom: '6px',
                    display: 'flex',
                  }}
                >
                  /{maxScore}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: isOg ? '220px' : '340px',
                  height: isOg ? '6px' : '10px',
                  backgroundColor: `${CARD_COLORS.text}18`,
                  borderRadius: '999px',
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: progressWidth,
                    height: '100%',
                    backgroundColor: verdictColor,
                    borderRadius: '999px',
                    display: 'flex',
                  }}
                />
              </div>

              {/* Verdict badge */}
              <div
                style={{
                  fontSize: isOg ? '14px' : '20px',
                  fontWeight: 700,
                  color: verdictColor,
                  backgroundColor: `${verdictColor}18`,
                  border: `1px solid ${verdictColor}44`,
                  borderRadius: '999px',
                  padding: isOg ? '4px 16px' : '6px 24px',
                  display: 'flex',
                  letterSpacing: '0.5px',
                }}
              >
                {verdictLabel}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: isOg ? '40px' : '64px',
                height: '1px',
                backgroundColor: CARD_COLORS.goldDark,
                opacity: 0.4,
                display: 'flex',
              }}
            />

            {/* Highlighted kutas */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isOg ? '8px' : '12px',
                width: '100%',
              }}
            >
              {highlightedKutas.map((k) => (
                <div
                  key={k.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isOg ? '12px' : '16px',
                    backgroundColor: `${CARD_COLORS.gold}10`,
                    border: `1px solid ${CARD_COLORS.gold}22`,
                    borderRadius: '12px',
                    padding: isOg ? '8px 16px' : '12px 20px',
                  }}
                >
                  {/* Kuta score pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '2px',
                      minWidth: isOg ? '44px' : '60px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: isOg ? '18px' : '26px',
                        fontWeight: 700,
                        color: CARD_COLORS.gold,
                        display: 'flex',
                      }}
                    >
                      {k.score}
                    </span>
                    <span
                      style={{
                        fontSize: isOg ? '12px' : '16px',
                        color: CARD_COLORS.text,
                        opacity: 0.4,
                        display: 'flex',
                      }}
                    >
                      /{k.max}
                    </span>
                  </div>
                  {/* Kuta name + insight */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <div
                      style={{
                        fontSize: isOg ? '13px' : '17px',
                        fontWeight: 600,
                        color: CARD_COLORS.goldLight,
                        display: 'flex',
                      }}
                    >
                      {k.name}
                    </div>
                    {k.insight && (
                      <div
                        style={{
                          fontSize: isOg ? '11px' : '14px',
                          color: CARD_COLORS.text,
                          opacity: 0.6,
                          lineHeight: 1.4,
                          display: 'flex',
                        }}
                      >
                        {k.insight}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
              {'Check YOUR compatibility \u2192'}
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
          // Compatibility cards are user-specific — cache for 7 days
          'Cache-Control': 'public, max-age=604800, s-maxage=604800',
        },
      }
    );
  }

  // ── Birth Poster Card ─────────────────────────────────────────────────────
  // Personalized Vedic birth chart card with mini North Indian diamond chart
  if (type === 'birth-poster') {
    const name = searchParams.get('name') ?? 'Birth Chart';
    const date = searchParams.get('date') ?? '';
    const time = searchParams.get('time') ?? '';
    const place = searchParams.get('place') ?? '';
    const rising = searchParams.get('rising') ?? '';
    const moon = searchParams.get('moon') ?? '';
    const sun = searchParams.get('sun') ?? '';
    const dasha = searchParams.get('dasha') ?? '';

    // Parse houses: JSON array of 12 arrays of planet IDs
    let houses: number[][] = Array.from({ length: 12 }, () => []);
    try {
      const housesParam = searchParams.get('houses');
      if (housesParam) {
        const parsed = JSON.parse(housesParam);
        if (Array.isArray(parsed) && parsed.length === 12) {
          houses = parsed;
        }
      }
    } catch {
      // Silently use empty houses if JSON parsing fails — not a critical error
      // for image generation; the chart will just show empty houses
    }

    const isStory = format === 'story';
    const isOg = format === 'og';

    // Planet abbreviations for the mini chart
    const PLANET_ABBR: Record<number, string> = {
      0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
    };

    // North Indian diamond chart geometry — key points
    const chartSize = isOg ? 220 : isStory ? 380 : 300;
    const p = Math.round(chartSize * 0.06);
    const m = Math.round(chartSize / 2);
    const q1 = Math.round(chartSize * 0.28);
    const q3 = Math.round(chartSize * 0.72);

    // Diamond corners
    const T = { x: m, y: p };
    const L = { x: p, y: m };
    const B = { x: m, y: chartSize - p };
    const R = { x: chartSize - p, y: m };
    const C = { x: m, y: m };
    const TL = { x: q1, y: q1 };
    const TR = { x: q3, y: q1 };
    const BL = { x: q1, y: q3 };
    const BR = { x: q3, y: q3 };

    // House geometry: { path, cx, cy } for each house (1-indexed)
    const houseGeo: Record<number, { path: string; cx: number; cy: number }> = {
      1:  { path: `M ${T.x} ${T.y} L ${TL.x} ${TL.y} L ${C.x} ${C.y} L ${TR.x} ${TR.y} Z`, cx: m, cy: Math.round(m * 0.52) },
      2:  { path: `M ${p} ${p} L ${TL.x} ${TL.y} L ${T.x} ${T.y} Z`, cx: Math.round(m * 0.55), cy: Math.round(m * 0.42) },
      3:  { path: `M ${p} ${p} L ${p} ${m} L ${TL.x} ${TL.y} Z`, cx: Math.round(m * 0.35), cy: Math.round(m * 0.55) },
      4:  { path: `M ${L.x} ${L.y} L ${TL.x} ${TL.y} L ${C.x} ${C.y} L ${BL.x} ${BL.y} Z`, cx: Math.round(m * 0.52), cy: m },
      5:  { path: `M ${L.x} ${L.y} L ${BL.x} ${BL.y} L ${p} ${chartSize - p} Z`, cx: Math.round(m * 0.35), cy: Math.round(m * 1.45) },
      6:  { path: `M ${p} ${chartSize - p} L ${BL.x} ${BL.y} L ${B.x} ${B.y} Z`, cx: Math.round(m * 0.55), cy: Math.round(m * 1.58) },
      7:  { path: `M ${B.x} ${B.y} L ${BL.x} ${BL.y} L ${C.x} ${C.y} L ${BR.x} ${BR.y} Z`, cx: m, cy: Math.round(m * 1.48) },
      8:  { path: `M ${B.x} ${B.y} L ${BR.x} ${BR.y} L ${chartSize - p} ${chartSize - p} Z`, cx: Math.round(m * 1.45), cy: Math.round(m * 1.58) },
      9:  { path: `M ${chartSize - p} ${chartSize - p} L ${BR.x} ${BR.y} L ${R.x} ${R.y} Z`, cx: Math.round(m * 1.65), cy: Math.round(m * 1.45) },
      10: { path: `M ${R.x} ${R.y} L ${BR.x} ${BR.y} L ${C.x} ${C.y} L ${TR.x} ${TR.y} Z`, cx: Math.round(m * 1.48), cy: m },
      11: { path: `M ${R.x} ${R.y} L ${TR.x} ${TR.y} L ${chartSize - p} ${p} Z`, cx: Math.round(m * 1.65), cy: Math.round(m * 0.55) },
      12: { path: `M ${chartSize - p} ${p} L ${TR.x} ${TR.y} L ${T.x} ${T.y} Z`, cx: Math.round(m * 1.45), cy: Math.round(m * 0.42) },
    };

    const planetFontSize = isOg ? 9 : isStory ? 14 : 11;
    const planetLineHeight = planetFontSize + 3;

    // OG format: horizontal layout (chart left, info right)
    // Story/Square: vertical layout (info top, chart middle, details bottom)
    if (isOg) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: CARD_COLORS.navy,
              backgroundImage: `radial-gradient(ellipse at 30% 40%, #1a1f4d 0%, ${CARD_COLORS.navy} 65%)`,
              padding: '40px 56px',
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
                border: `1px solid ${CARD_COLORS.goldDark}44`,
                borderRadius: '24px',
                display: 'flex',
              }}
            />

            {/* Corner ornaments — top left */}
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: '28px',
                width: '28px',
                height: '28px',
                borderTop: `2px solid ${CARD_COLORS.gold}88`,
                borderLeft: `2px solid ${CARD_COLORS.gold}88`,
                display: 'flex',
              }}
            />
            {/* Corner ornaments — bottom right */}
            <div
              style={{
                position: 'absolute',
                bottom: '28px',
                right: '28px',
                width: '28px',
                height: '28px',
                borderBottom: `2px solid ${CARD_COLORS.gold}88`,
                borderRight: `2px solid ${CARD_COLORS.gold}88`,
                display: 'flex',
              }}
            />

            {/* Left: Mini North Indian Chart */}
            <div style={{ display: 'flex', flexShrink: 0, marginRight: '40px' }}>
              <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
                <rect x="0" y="0" width={chartSize} height={chartSize} fill="#0a0e1a" rx={Math.round(chartSize * 0.03)} />
                {/* House paths */}
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => {
                  const g = houseGeo[h];
                  return (
                    <path key={`h${h}`} d={g.path} fill="none" stroke={CARD_COLORS.gold} strokeWidth={1.2} opacity={0.6} />
                  );
                })}
              </svg>
              {/* Planet labels overlaid using positioned divs (Satori doesn't support SVG <text>) */}
              <div style={{ position: 'absolute', width: `${chartSize}px`, height: `${chartSize}px`, display: 'flex' }}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => {
                  const g = houseGeo[h];
                  const planetIds = houses[h - 1] || [];
                  const labels = planetIds.map(id => PLANET_ABBR[id] || '').filter(Boolean);
                  if (labels.length === 0) return null;
                  const totalHeight = labels.length * planetLineHeight;
                  const topY = g.cy - totalHeight / 2;
                  return labels.map((lbl, i) => (
                    <div
                      key={`p${h}-${i}`}
                      style={{
                        position: 'absolute',
                        left: `${g.cx}px`,
                        top: `${topY + i * planetLineHeight}px`,
                        transform: 'translateX(-50%)',
                        fontSize: `${planetFontSize}px`,
                        color: CARD_COLORS.text,
                        fontFamily: 'monospace',
                        display: 'flex',
                        lineHeight: 1,
                      }}
                    >
                      {lbl}
                    </div>
                  ));
                })}
              </div>
            </div>

            {/* Right: Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              {/* Tag */}
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '4px',
                  textTransform: 'uppercase' as const,
                  color: CARD_COLORS.gold,
                  marginBottom: '10px',
                  display: 'flex',
                }}
              >
                VEDIC BIRTH CHART
              </div>

              {/* Name */}
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: CARD_COLORS.goldLight,
                  lineHeight: 1.1,
                  marginBottom: '8px',
                  display: 'flex',
                  letterSpacing: '-0.5px',
                }}
              >
                {name}
              </div>

              {/* Date / Time / Place */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
                {(date || time) && (
                  <div style={{ fontSize: '13px', color: '#8a8478', fontFamily: 'monospace', display: 'flex' }}>
                    {date}{date && time ? ' · ' : ''}{time}
                  </div>
                )}
                {place && (
                  <div style={{ fontSize: '12px', color: '#6b6560', display: 'flex' }}>
                    {place}
                  </div>
                )}
              </div>

              {/* Rising / Moon / Sun pills */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' as const }}>
                {rising && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ fontSize: '12px', color: CARD_COLORS.gold, fontWeight: 700, display: 'flex' }}>{rising}</div>
                    <div style={{ fontSize: '11px', color: CARD_COLORS.text, opacity: 0.6, display: 'flex' }}>Rising</div>
                  </div>
                )}
                {moon && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ fontSize: '11px', color: CARD_COLORS.text, opacity: 0.6, display: 'flex' }}>Moon in</div>
                    <div style={{ fontSize: '12px', color: CARD_COLORS.gold, fontWeight: 700, display: 'flex' }}>{moon}</div>
                  </div>
                )}
                {sun && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ fontSize: '11px', color: CARD_COLORS.text, opacity: 0.6, display: 'flex' }}>Sun in</div>
                    <div style={{ fontSize: '12px', color: CARD_COLORS.gold, fontWeight: 700, display: 'flex' }}>{sun}</div>
                  </div>
                )}
              </div>

              {/* Dasha */}
              {dasha && (
                <div style={{ fontSize: '12px', color: '#8a8478', display: 'flex', marginBottom: '8px' }}>
                  {dasha}
                </div>
              )}

              {/* Watermark */}
              <div style={{ fontSize: '10px', color: `${CARD_COLORS.gold}88`, marginTop: '12px', display: 'flex' }}>
                {WATERMARK_URL}
              </div>
            </div>
          </div>
        ),
        {
          width,
          height,
          headers: {
            'Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
          },
        }
      );
    }

    // Story / Square layout — vertical
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
            backgroundImage: `radial-gradient(ellipse at 50% 30%, #1a1f4d 0%, ${CARD_COLORS.navy} 65%)`,
            padding: isStory ? '80px 72px' : '56px 64px',
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

          {/* Corner ornaments */}
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: '36px',
              width: '48px',
              height: '48px',
              borderTop: `2px solid ${CARD_COLORS.gold}88`,
              borderLeft: `2px solid ${CARD_COLORS.gold}88`,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '36px',
              right: '36px',
              width: '48px',
              height: '48px',
              borderBottom: `2px solid ${CARD_COLORS.gold}88`,
              borderRight: `2px solid ${CARD_COLORS.gold}88`,
              display: 'flex',
            }}
          />

          {/* Top tag */}
          <div
            style={{
              position: 'absolute',
              top: isStory ? '72px' : '56px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
            <div
              style={{
                fontSize: isStory ? '14px' : '12px',
                letterSpacing: '5px',
                textTransform: 'uppercase' as const,
                color: CARD_COLORS.gold,
                display: 'flex',
              }}
            >
              VEDIC BIRTH CHART
            </div>
            <div style={{ width: '32px', height: '1px', backgroundColor: CARD_COLORS.gold, opacity: 0.5, display: 'flex' }} />
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: isStory ? '52px' : '40px',
              fontWeight: 800,
              color: CARD_COLORS.goldLight,
              lineHeight: 1.1,
              marginBottom: '8px',
              display: 'flex',
              letterSpacing: '-1px',
              textAlign: 'center',
            }}
          >
            {name}
          </div>

          {/* Date / Time */}
          {(date || time) && (
            <div style={{ fontSize: isStory ? '18px' : '15px', color: '#8a8478', fontFamily: 'monospace', marginBottom: '4px', display: 'flex' }}>
              {date}{date && time ? ' · ' : ''}{time}
            </div>
          )}
          {place && (
            <div style={{ fontSize: isStory ? '16px' : '14px', color: '#6b6560', marginBottom: isStory ? '40px' : '28px', display: 'flex' }}>
              {place}
            </div>
          )}

          {/* North Indian Diamond Chart */}
          <div style={{ display: 'flex', position: 'relative', marginBottom: isStory ? '40px' : '28px' }}>
            <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
              <rect x="0" y="0" width={chartSize} height={chartSize} fill="#0a0e1a" rx={Math.round(chartSize * 0.03)} />
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => {
                const g = houseGeo[h];
                return (
                  <path key={`h${h}`} d={g.path} fill="none" stroke={CARD_COLORS.gold} strokeWidth={1.2} opacity={0.6} />
                );
              })}
            </svg>
            {/* Planet labels */}
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => {
              const g = houseGeo[h];
              const planetIds = houses[h - 1] || [];
              const labels = planetIds.map(id => PLANET_ABBR[id] || '').filter(Boolean);
              if (labels.length === 0) return null;
              const totalHeight = labels.length * planetLineHeight;
              const topY = g.cy - totalHeight / 2;
              return labels.map((lbl, i) => (
                <div
                  key={`p${h}-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${g.cx}px`,
                    top: `${topY + i * planetLineHeight}px`,
                    transform: 'translateX(-50%)',
                    fontSize: `${planetFontSize}px`,
                    color: CARD_COLORS.text,
                    fontFamily: 'monospace',
                    display: 'flex',
                    lineHeight: 1,
                  }}
                >
                  {lbl}
                </div>
              ));
            })}
          </div>

          {/* Rising / Moon / Sun */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isStory ? '12px' : '8px', marginBottom: isStory ? '28px' : '20px' }}>
            {rising && (
              <div
                style={{
                  fontSize: isStory ? '28px' : '22px',
                  color: CARD_COLORS.goldLight,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  display: 'flex',
                }}
              >
                {rising} Rising
              </div>
            )}
            <div style={{ display: 'flex', gap: isStory ? '24px' : '16px' }}>
              {moon && (
                <div style={{ fontSize: isStory ? '16px' : '14px', color: CARD_COLORS.text, display: 'flex' }}>
                  Moon in <span style={{ color: CARD_COLORS.gold, fontWeight: 600, marginLeft: '4px', display: 'flex' }}>{moon}</span>
                </div>
              )}
              {sun && (
                <div style={{ fontSize: isStory ? '16px' : '14px', color: CARD_COLORS.text, display: 'flex' }}>
                  Sun in <span style={{ color: CARD_COLORS.gold, fontWeight: 600, marginLeft: '4px', display: 'flex' }}>{sun}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dasha */}
          {dasha && (
            <div style={{ fontSize: isStory ? '16px' : '14px', color: '#8a8478', marginBottom: '16px', display: 'flex' }}>
              {dasha}
            </div>
          )}

          {/* Bottom CTA */}
          <div
            style={{
              position: 'absolute',
              bottom: isStory ? '72px' : '56px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: isStory ? '22px' : '18px',
                fontWeight: 600,
                color: CARD_COLORS.goldLight,
                display: 'flex',
              }}
            >
              Generate YOUR birth chart
            </div>
            <div
              style={{
                fontSize: isStory ? '16px' : '13px',
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
