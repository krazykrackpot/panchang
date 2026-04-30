import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { RASHIS } from '@/lib/constants/rashis';
import type { LocaleText, PanchangData } from '@/types/panchang';

/**
 * Instagram image generation API — produces 1080x1080 PNG images for social media.
 *
 * Query params:
 *   ?type=panchang              — Daily panchang card (Ujjain)
 *   ?type=nakshatra&id=N        — Nakshatra spotlight (1-27, defaults to today's nakshatra)
 *   ?type=moonsign&rashi=N&topic=love — Moon sign carousel slide (rashi 1-12)
 *
 * Uses Satori (via next/og ImageResponse) for server-side rendering.
 * Satori CSS limitations: no CSS grid, limited position:absolute, no pseudo-elements.
 */

// ─── Constants ──────────────────────────────────────────────────────────────

const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

const SIZE_SQUARE = { width: 1080, height: 1080 };
const SIZE_SHORTS = { width: 1080, height: 1920 };

const COLORS = {
  bg: '#0a0e27',
  bgLight: '#111633',
  purple: '#1a1040',
  purpleBright: '#2d1b69',
  gold: '#d4a853',
  goldLight: '#f0d48a',
  goldDark: '#8a6d2b',
  textPrimary: '#e6e2d8',
  textSecondary: '#8a8478',
  white: '#ffffff',
};

const L = (obj: LocaleText): string => obj.en;

// ─── Moon Sign Traits ───────────────────────────────────────────────────────

const MOON_SIGN_TRAITS: Record<string, Record<number, { title: string; text: string }>> = {
  love: {
    1: { title: 'Your Love Language', text: 'Acts of courage. You show love by protecting and fiercely defending those you care about.' },
    2: { title: 'Your Love Language', text: 'Sensory devotion. You show love through touch, food, comfort, and creating a beautiful shared space.' },
    3: { title: 'Your Love Language', text: 'Words and wit. You show love through conversation, humor, and keeping things intellectually alive.' },
    4: { title: 'Your Love Language', text: 'Nurturing presence. You show love by feeding, sheltering, and emotionally holding your partner.' },
    5: { title: 'Your Love Language', text: 'Grand gestures. You show love dramatically — public declarations, generous gifts, undivided attention.' },
    6: { title: 'Your Love Language', text: 'Acts of service. You show love by fixing, organizing, and quietly making your partner\'s life easier.' },
    7: { title: 'Your Love Language', text: 'Harmony and partnership. You show love by creating balance, beauty, and treating your partner as an equal.' },
    8: { title: 'Your Love Language', text: 'Emotional depth. You show love through total vulnerability — or not at all. No half-measures.' },
    9: { title: 'Your Love Language', text: 'Shared adventure. You show love by exploring together — travel, philosophy, new experiences, growth.' },
    10: { title: 'Your Love Language', text: 'Quiet commitment. You show love through loyalty, reliability, and building something lasting together.' },
    11: { title: 'Your Love Language', text: 'Intellectual freedom. You show love by respecting independence and sharing visionary ideas about the future.' },
    12: { title: 'Your Love Language', text: 'Spiritual connection. You show love through empathy, intuition, and dissolving the boundary between self and other.' },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (local.getTime() - utc.getTime()) / (3600 * 1000);
  } catch (err) {
    console.error('[instagram] TZ resolution failed for:', timezone, err, '- defaulting to IST');
    return 5.5;
  }
}

function getTodayPanchang(): { panchang: PanchangData; festivals: FestivalEntry[] } {
  const now = new Date();
  const tzOffset = getTimezoneOffset(UJJAIN_TZ, now);

  // Compute today's date in IST
  const istMs = now.getTime() + tzOffset * 3600 * 1000;
  const istDate = new Date(istMs);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth() + 1;
  const day = istDate.getUTCDate();

  const panchang = computePanchang({
    year,
    month,
    day,
    lat: UJJAIN_LAT,
    lng: UJJAIN_LNG,
    tzOffset,
    timezone: UJJAIN_TZ,
    locationName: 'Ujjain',
  });

  let festivals: FestivalEntry[] = [];
  try {
    const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const allFestivals = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);
    festivals = allFestivals.filter(f => f.date === todayStr);
  } catch (err) {
    console.error('[instagram] Festival lookup failed:', err);
  }

  return { panchang, festivals };
}

// ─── Template: Daily Panchang Card ──────────────────────────────────────────

function PanchangCard({ panchang, festivals }: { panchang: PanchangData; festivals: FestivalEntry[] }) {
  const dateObj = new Date(panchang.date + 'T12:00:00Z');
  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const panchangRows = [
    { label: 'TITHI', value: `${L(panchang.tithi.name)} (${panchang.tithi.paksha === 'shukla' ? 'Shukla' : 'Krishna'})`, icon: '\u263D' },
    { label: 'NAKSHATRA', value: L(panchang.nakshatra.name), icon: '\u2726' },
    { label: 'YOGA', value: L(panchang.yoga.name), icon: '\u2609' },
    { label: 'KARANA', value: L(panchang.karana.name), icon: '\u2737' },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `radial-gradient(circle at 50% 30%, ${COLORS.purpleBright}80, ${COLORS.bg} 70%)`,
        padding: '48px',
        fontFamily: 'sans-serif',
        color: COLORS.textPrimary,
      }}
    >
      {/* Brand header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', fontSize: '22px', letterSpacing: '4px', color: COLORS.gold, fontWeight: 700 }}>
          DEKHO PANCHANG
        </div>
        <div style={{ display: 'flex', fontSize: '18px', color: COLORS.textSecondary }}>
          Ujjain
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ display: 'flex', width: '100%', height: '2px', background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldDark}40, transparent)`, marginBottom: '24px' }} />

      {/* Date */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', fontSize: '44px', fontWeight: 700, color: COLORS.goldLight, letterSpacing: '-0.5px' }}>
          {dateStr}
        </div>
        <div style={{ display: 'flex', fontSize: '22px', color: COLORS.textSecondary, marginTop: '4px', fontStyle: 'italic' }}>
          {L(panchang.vara.name)}
        </div>
      </div>

      {/* Festival banner */}
      {festivals.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: `4px solid ${COLORS.gold}`,
            paddingLeft: '16px',
            marginTop: '16px',
            marginBottom: '8px',
            background: `${COLORS.gold}10`,
            padding: '12px 16px',
            borderRadius: '0 12px 12px 0',
          }}
        >
          {festivals.slice(0, 2).map((f, i) => (
            <div key={i} style={{ display: 'flex', fontSize: '20px', color: COLORS.goldLight, fontWeight: 600, marginBottom: i < festivals.length - 1 ? '4px' : '0' }}>
              {f.name.en}
            </div>
          ))}
        </div>
      )}

      {/* Panchang elements */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        {panchangRows.map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${COLORS.purpleBright}50, ${COLORS.purple}60)`,
              borderRadius: '16px',
              padding: '20px 24px',
              border: `1px solid ${COLORS.gold}18`,
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.gold}30, ${COLORS.goldDark}20)`,
                border: `1px solid ${COLORS.gold}40`,
                fontSize: '24px',
                marginRight: '20px',
                flexShrink: 0,
              }}
            >
              {row.icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: '13px', color: COLORS.textSecondary, letterSpacing: '3px', marginBottom: '4px', fontWeight: 600 }}>
                {row.label}
              </div>
              <div style={{ display: 'flex', fontSize: '26px', color: COLORS.goldLight, fontWeight: 600 }}>
                {row.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: times + Rahu Kaal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '12px', color: COLORS.textSecondary, letterSpacing: '2px' }}>SUNRISE</div>
            <div style={{ display: 'flex', fontSize: '20px', color: COLORS.gold }}>{panchang.sunrise}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '12px', color: COLORS.textSecondary, letterSpacing: '2px' }}>SUNSET</div>
            <div style={{ display: 'flex', fontSize: '20px', color: COLORS.gold }}>{panchang.sunset}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '12px', color: COLORS.textSecondary, letterSpacing: '2px' }}>MOONRISE</div>
            <div style={{ display: 'flex', fontSize: '20px', color: COLORS.gold }}>{panchang.moonrise}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            background: '#8b0000' + '30',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid #8b000050',
          }}
        >
          <div style={{ display: 'flex', fontSize: '11px', color: '#ff6b6b', letterSpacing: '2px', fontWeight: 600 }}>RAHU KAAL</div>
          <div style={{ display: 'flex', fontSize: '18px', color: '#ff9999' }}>
            {panchang.rahuKaal.start} - {panchang.rahuKaal.end}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary, letterSpacing: '1px' }}>
          dekhopanchang.com
        </div>
      </div>
    </div>
  );
}

// ─── Template: Nakshatra Spotlight ──────────────────────────────────────────

function NakshatraSpotlight({ nakshatraId }: { nakshatraId: number }) {
  const nak = NAKSHATRAS[nakshatraId - 1];
  const details = NAKSHATRA_DETAILS.find(d => d.id === nakshatraId);

  if (!nak || !details) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, color: COLORS.gold, fontSize: '36px' }}>
        Invalid Nakshatra ID
      </div>
    );
  }

  const detailBoxes = [
    { label: 'DEITY', value: L(nak.deity) },
    { label: 'RULER', value: nak.ruler },
    { label: 'NATURE', value: L(nak.nature) },
    { label: 'SYMBOL', value: nak.symbol },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: `radial-gradient(circle at 50% 40%, ${COLORS.purpleBright}90, ${COLORS.bg} 70%)`,
        padding: '48px',
        fontFamily: 'sans-serif',
        color: COLORS.textPrimary,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', fontSize: '18px', letterSpacing: '6px', color: COLORS.textSecondary, marginBottom: '32px', fontWeight: 600 }}>
        NAKSHATRA OF THE DAY
      </div>

      {/* Symbol */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.gold}25, ${COLORS.goldDark}15)`,
          border: `2px solid ${COLORS.gold}50`,
          fontSize: '56px',
          marginBottom: '24px',
        }}
      >
        {nak.symbol}
      </div>

      {/* Name */}
      <div style={{ display: 'flex', fontSize: '52px', fontWeight: 700, color: COLORS.goldLight, marginBottom: '8px' }}>
        {L(nak.name)}
      </div>

      {/* Meaning */}
      <div style={{ display: 'flex', fontSize: '20px', color: COLORS.textSecondary, marginBottom: '32px', fontStyle: 'italic', textAlign: 'center', maxWidth: '700px' }}>
        {L(details.meaning)}
      </div>

      {/* Gold divider */}
      <div style={{ display: 'flex', width: '80px', height: '2px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, marginBottom: '32px' }} />

      {/* Detail boxes */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', width: '100%' }}>
        {detailBoxes.map((box) => (
          <div
            key={box.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              background: `linear-gradient(135deg, ${COLORS.purpleBright}50, ${COLORS.purple}60)`,
              borderRadius: '16px',
              padding: '20px 12px',
              border: `1px solid ${COLORS.gold}18`,
            }}
          >
            <div style={{ display: 'flex', fontSize: '11px', color: COLORS.textSecondary, letterSpacing: '3px', marginBottom: '8px', fontWeight: 600 }}>
              {box.label}
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: COLORS.goldLight, fontWeight: 600, textAlign: 'center' }}>
              {box.value}
            </div>
          </div>
        ))}
      </div>

      {/* Characteristics */}
      <div
        style={{
          display: 'flex',
          background: `linear-gradient(135deg, ${COLORS.purpleBright}40, ${COLORS.purple}50)`,
          borderRadius: '16px',
          padding: '24px 32px',
          border: `1px solid ${COLORS.gold}15`,
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', fontSize: '18px', color: COLORS.textPrimary, lineHeight: '1.6', textAlign: 'center' }}>
          {L(details.characteristics)}
        </div>
      </div>

      {/* Guna / Tattva / Gana row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary }}>
          <span style={{ color: COLORS.gold, marginRight: '6px' }}>Guna:</span> {L(details.guna)}
        </div>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary }}>
          <span style={{ color: COLORS.gold, marginRight: '6px' }}>Tattva:</span> {L(details.tattva)}
        </div>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary }}>
          <span style={{ color: COLORS.gold, marginRight: '6px' }}>Gana:</span> {L(details.gana)}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', fontSize: '18px', color: COLORS.gold, letterSpacing: '3px', fontWeight: 700, marginBottom: '4px' }}>
          DEKHO PANCHANG
        </div>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary }}>
          dekhopanchang.com
        </div>
      </div>
    </div>
  );
}

// ─── Template: Moon Sign Carousel Slide ─────────────────────────────────────

function MoonSignSlide({ rashiId, topic }: { rashiId: number; topic: string }) {
  const rashi = RASHIS[rashiId - 1];
  const traits = MOON_SIGN_TRAITS[topic];
  const trait = traits?.[rashiId];

  if (!rashi || !trait) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, color: COLORS.gold, fontSize: '36px' }}>
        Invalid rashi or topic
      </div>
    );
  }

  const topicLabel = topic.toUpperCase();

  // Dot indicators for carousel position
  const dots = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `radial-gradient(circle at 50% 50%, ${COLORS.purpleBright}, ${COLORS.bg} 80%)`,
        padding: '48px',
        fontFamily: 'sans-serif',
        color: COLORS.textPrimary,
      }}
    >
      {/* Gold border frame */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          border: `2px solid ${COLORS.gold}40`,
          borderRadius: '24px',
          padding: '40px',
          alignItems: 'center',
        }}
      >
        {/* Inner gold accent line at top */}
        <div style={{ display: 'flex', width: '60px', height: '2px', background: COLORS.gold, marginBottom: '24px' }} />

        {/* Topic header */}
        <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '6px', color: COLORS.textSecondary, marginBottom: '32px', fontWeight: 600 }}>
          YOUR {topicLabel} BY MOON SIGN
        </div>

        {/* Rashi symbol */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.goldDark}10)`,
            border: `2px solid ${COLORS.gold}40`,
            fontSize: '48px',
            marginBottom: '20px',
          }}
        >
          {rashi.symbol}
        </div>

        {/* Rashi name */}
        <div style={{ display: 'flex', fontSize: '44px', fontWeight: 700, color: COLORS.goldLight, marginBottom: '4px' }}>
          {L(rashi.name)}
        </div>

        {/* Sanskrit name */}
        <div style={{ display: 'flex', fontSize: '18px', color: COLORS.textSecondary, marginBottom: '32px', fontStyle: 'italic' }}>
          {rashi.name.hi || L(rashi.name)}
        </div>

        {/* Trait box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: `linear-gradient(135deg, ${COLORS.purpleBright}50, ${COLORS.purple}60)`,
            borderRadius: '20px',
            padding: '28px 32px',
            border: `1px solid ${COLORS.gold}20`,
            width: '100%',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '3px', color: COLORS.gold, marginBottom: '12px', fontWeight: 700 }}>
            {trait.title.toUpperCase()}
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: COLORS.textPrimary, lineHeight: '1.6', textAlign: 'center' }}>
            {trait.text}
          </div>
        </div>

        {/* Swipe indicator */}
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary, marginBottom: '16px', letterSpacing: '1px' }}>
          SWIPE to find your sign
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {dots.map((d) => (
            <div
              key={d}
              style={{
                display: 'flex',
                width: d === rashiId ? '12px' : '8px',
                height: d === rashiId ? '12px' : '8px',
                borderRadius: '50%',
                background: d === rashiId ? COLORS.gold : `${COLORS.gold}30`,
              }}
            />
          ))}
        </div>

        {/* Bottom gold accent */}
        <div style={{ display: 'flex', width: '60px', height: '2px', background: COLORS.gold, marginTop: 'auto' }} />
      </div>

      {/* Branded footer outside frame */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', fontSize: '14px', color: COLORS.textSecondary, letterSpacing: '2px' }}>
          dekhopanchang.com
        </div>
      </div>
    </div>
  );
}

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get('type');

  if (!type) {
    return new Response(JSON.stringify({ error: 'Missing ?type= parameter. Options: panchang, nakshatra, moonsign' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let element: React.ReactElement;

    switch (type) {
      case 'panchang': {
        const { panchang, festivals } = getTodayPanchang();
        element = <PanchangCard panchang={panchang} festivals={festivals} />;
        break;
      }

      case 'nakshatra': {
        let nakshatraId = parseInt(searchParams.get('id') || '', 10);
        if (isNaN(nakshatraId) || nakshatraId < 1 || nakshatraId > 27) {
          // Default to today's nakshatra
          const { panchang } = getTodayPanchang();
          nakshatraId = panchang.nakshatra.id;
        }
        element = <NakshatraSpotlight nakshatraId={nakshatraId} />;
        break;
      }

      case 'moonsign': {
        const rashiId = parseInt(searchParams.get('rashi') || '', 10);
        const topic = searchParams.get('topic') || 'love';

        if (isNaN(rashiId) || rashiId < 1 || rashiId > 12) {
          return new Response(JSON.stringify({ error: 'Missing or invalid ?rashi= (1-12)' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (!MOON_SIGN_TRAITS[topic]) {
          return new Response(JSON.stringify({ error: `Unknown topic "${topic}". Available: ${Object.keys(MOON_SIGN_TRAITS).join(', ')}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        element = <MoonSignSlide rashiId={rashiId} topic={topic} />;
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown type "${type}". Options: panchang, nakshatra, moonsign` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    const format = searchParams.get('format');
    const size = format === 'shorts' ? SIZE_SHORTS : SIZE_SQUARE;

    return new ImageResponse(element, {
      ...size,
    });
  } catch (err) {
    console.error('[instagram] Image generation failed:', err);
    return new Response(JSON.stringify({ error: 'Image generation failed', detail: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
