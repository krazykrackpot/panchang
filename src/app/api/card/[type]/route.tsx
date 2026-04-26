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
