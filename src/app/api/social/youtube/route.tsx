import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import type { LocaleText, PanchangData } from '@/types/panchang';

/**
 * YouTube Shorts slide generator — TAROT-CARD STYLE 1080x1920 slides.
 *
 * Each slide uses the same dramatic aesthetic as TarotCard.tsx:
 * deep indigo background, ornate double gold borders, corner flourishes,
 * decorative star separators, radial glow effects, bold typography.
 */

const UJJAIN = { lat: 23.1765, lng: 75.7885, tz: 'Asia/Kolkata' };
const SIZE = { width: 1080, height: 1920 };

// ── Design tokens matching TarotCard.tsx ──
const C = {
  bg: '#0a0520',        // deepest indigo (from tarot card)
  bgMid: '#0f0825',
  bgTop: '#1a0a3e',
  gold: '#d4a853',
  goldLight: '#f0d48a',
  goldDark: '#8a6d2b',
  text: '#e6e2d8',
  textDim: '#8a8478',
  red: '#dc2626',
  redLight: '#ff6b6b',
  emerald: '#34d399',
  purple: '#c084fc',
  blue: '#60a5fa',
};

const L = (obj: LocaleText): string => obj.en;

function getTodayPanchang(): { panchang: PanchangData; festivals: FestivalEntry[] } {
  const now = new Date();
  const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), UJJAIN.tz);
  const istMs = now.getTime() + tzOffset * 3600 * 1000;
  const d = new Date(istMs);
  const panchang = computePanchang({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), lat: UJJAIN.lat, lng: UJJAIN.lng, tzOffset, timezone: UJJAIN.tz, locationName: 'Ujjain' });
  let festivals: FestivalEntry[] = [];
  try {
    const ds = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    festivals = generateFestivalCalendarV2(d.getUTCFullYear(), UJJAIN.lat, UJJAIN.lng, UJJAIN.tz).filter(f => f.date === ds);
  } catch { /* ignore */ }
  return { panchang, festivals };
}

// ═══════════════════════════════════════════════════════════════
// SHARED ORNAMENTAL ELEMENTS (matching TarotCard aesthetic)
// ═══════════════════════════════════════════════════════════════

/** Full-slide tarot frame — deep indigo bg, double gold border, corner flourishes */
function TarotFrame({ children, glowColor }: { children: React.ReactNode; glowColor?: string }) {
  const glow = glowColor || C.gold;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: `linear-gradient(180deg, ${C.bgTop}, ${C.bgMid} 40%, ${C.bg})`, fontFamily: 'sans-serif', color: C.text, position: 'relative' }}>
      {/* Celestial glow */}
      <div style={{ display: 'flex', position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${glow}12, transparent 70%)` }} />
      {/* Ornate border — single elegant gold frame */}
      <div style={{ display: 'flex', position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', borderRadius: '20px', border: `2px solid ${C.gold}45` }} />
      {/* Content area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '48px 44px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {/* Bottom watermark */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '48px', left: 0, right: 0, zIndex: 1 }}>
        <div style={{ display: 'flex', fontSize: '14px', color: `${C.goldDark}80`, letterSpacing: '4px', fontWeight: 600 }}>dekhopanchang.com</div>
      </div>
    </div>
  );
}

/** Decorative star separator (✦ · ✦ · ✦) */
function StarSeparator({ size }: { size?: number }) {
  const s = size || 14;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: `${C.gold}40`, fontSize: `${s}px` }}>
      <span>✦</span><span style={{ fontSize: `${s * 0.5}px` }}>·</span><span>✦</span><span style={{ fontSize: `${s * 0.5}px` }}>·</span><span>✦</span>
    </div>
  );
}

/** Brand header — DEKHO PANCHANG with gold gradient line */
function BrandMark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ display: 'flex', fontSize: '24px', letterSpacing: '10px', color: C.gold, fontWeight: 800 }}>DEKHO PANCHANG</div>
      <div style={{ display: 'flex', width: '160px', height: '2px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
    </div>
  );
}

/** Ornate data card with gold left accent and icon */
function DataCard({ icon, label, value, sub, accentColor }: { icon: string; label: string; value: string; sub?: string; accentColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: `linear-gradient(135deg, ${C.bgTop}ee, ${C.bg}ee)`, borderRadius: '20px', border: `1px solid ${C.gold}20`, borderLeft: `4px solid ${accentColor}90`, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}25, ${accentColor}08)`, border: `2px solid ${accentColor}45`, fontSize: '28px', flexShrink: 0 }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', fontSize: '12px', color: C.goldDark, letterSpacing: '4px', fontWeight: 700 }}>{label}</div>
        <div style={{ display: 'flex', fontSize: '30px', color: C.goldLight, fontWeight: 800 }}>{value}</div>
        {sub && <div style={{ display: 'flex', fontSize: '15px', color: `${accentColor}bb` }}>{sub}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 1: DRAMATIC INTRO
// ═══════════════════════════════════════════════════════════════

function Slide1({ panchang, festivals }: { panchang: PanchangData; festivals: FestivalEntry[] }) {
  const dateObj = new Date(panchang.date + 'T12:00:00Z');
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const monthDay = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
  const yearStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' });

  return (
    <TarotFrame glowColor={C.gold}>
      <BrandMark />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: '32px' }}>
        {/* Gayatri — reverent */}
        <div style={{ display: 'flex', fontSize: '18px', color: `${C.gold}70`, textAlign: 'center', lineHeight: '2', letterSpacing: '2px' }}>
          ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं
        </div>

        <StarSeparator size={18} />

        {/* Date — massive and bold */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', fontSize: '28px', color: C.goldDark, letterSpacing: '6px', fontWeight: 600 }}>{dayName.toUpperCase()}</div>
          <div style={{ display: 'flex', fontSize: '72px', fontWeight: 900, color: C.goldLight, letterSpacing: '-1px' }}>{monthDay}</div>
          <div style={{ display: 'flex', fontSize: '32px', color: C.gold, fontWeight: 600, letterSpacing: '8px' }}>{yearStr}</div>
        </div>

        <StarSeparator />

        {/* Vara + Masa */}
        <div style={{ display: 'flex', fontSize: '26px', color: C.text, textAlign: 'center', letterSpacing: '1px' }}>
          {L(panchang.vara.name)} • {L(panchang.amantMasa || panchang.masa)} मास
        </div>

        {/* Festival highlight */}
        {festivals.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${C.gold}10`, borderRadius: '16px', border: `2px solid ${C.gold}35`, padding: '20px 48px', gap: '8px' }}>
            {festivals.slice(0, 2).map((f, i) => (
              <div key={i} style={{ display: 'flex', fontSize: '30px', color: C.goldLight, fontWeight: 800, letterSpacing: '1px' }}>{f.name.en}</div>
            ))}
          </div>
        )}

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: '18px', color: `${C.goldDark}90`, fontStyle: 'italic', letterSpacing: '3px' }}>YOUR DAILY VEDIC ALMANAC</div>
      </div>
    </TarotFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2: PANCHA ANGA — dramatic data cards
// ═══════════════════════════════════════════════════════════════

function Slide2({ panchang }: { panchang: PanchangData }) {
  return (
    <TarotFrame glowColor={C.purple}>
      <BrandMark />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '8px', color: C.goldDark, fontWeight: 700 }}>PANCHA ANGA</div>
      </div>
      <StarSeparator />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center', marginTop: '16px' }}>
        <DataCard icon="☽" label="TITHI" value={L(panchang.tithi.name)} sub={panchang.tithi.paksha === 'shukla' ? 'Shukla Paksha' : 'Krishna Paksha'} accentColor={C.purple} />
        <DataCard icon="✦" label="NAKSHATRA" value={L(panchang.nakshatra.name)} sub={`Pada ${panchang.nakshatra.pada || '—'}`} accentColor={C.blue} />
        <DataCard icon="☉" label="YOGA" value={L(panchang.yoga.name)} sub={panchang.yoga.nature === 'auspicious' ? 'Auspicious' : panchang.yoga.nature === 'inauspicious' ? 'Inauspicious' : 'Neutral'} accentColor={C.emerald} />
        <DataCard icon="◈" label="KARANA" value={L(panchang.karana.name)} accentColor="#fb923c" />
        <DataCard icon="⊕" label="VARA" value={L(panchang.vara.name)} sub={L(panchang.vara.ruler)} accentColor={C.gold} />
      </div>
    </TarotFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3: TIMINGS — celestial clock
// ═══════════════════════════════════════════════════════════════

function Slide3({ panchang }: { panchang: PanchangData }) {
  return (
    <TarotFrame glowColor="#fb923c">
      <BrandMark />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '8px', color: C.goldDark, fontWeight: 700 }}>CELESTIAL TIMINGS</div>
      </div>
      <StarSeparator />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center', marginTop: '16px' }}>
        <DataCard icon="🌅" label="SUNRISE" value={panchang.sunrise} accentColor="#fb923c" />
        <DataCard icon="🌇" label="SUNSET" value={panchang.sunset} accentColor="#f43f5e" />
        <DataCard icon="🌙" label="MOONRISE" value={panchang.moonrise} accentColor={C.purple} />

        {/* Rahu Kaal — dramatic red accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: `linear-gradient(135deg, #1a0000ee, ${C.bg}ee)`, borderRadius: '20px', border: `1px solid ${C.red}30`, borderLeft: `4px solid ${C.red}90`, padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: `radial-gradient(circle, ${C.red}25, ${C.red}08)`, border: `2px solid ${C.red}50`, fontSize: '28px', flexShrink: 0 }}>⚠</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', fontSize: '12px', color: C.redLight, letterSpacing: '4px', fontWeight: 700 }}>RAHU KAAL</div>
            <div style={{ display: 'flex', fontSize: '32px', color: '#ff9999', fontWeight: 800 }}>{panchang.rahuKaal.start} — {panchang.rahuKaal.end}</div>
          </div>
        </div>

        {/* Abhijit Muhurta */}
        {panchang.abhijitMuhurta && (
          <DataCard icon="✧" label="ABHIJIT MUHURTA" value={`${panchang.abhijitMuhurta.start} — ${panchang.abhijitMuhurta.end}`} sub="Most auspicious window" accentColor={C.emerald} />
        )}
      </div>
    </TarotFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4: NAKSHATRA SPOTLIGHT
// ═══════════════════════════════════════════════════════════════

function Slide4({ panchang }: { panchang: PanchangData }) {
  const nak = NAKSHATRAS[panchang.nakshatra.id - 1];
  const details = NAKSHATRA_DETAILS.find(d => d.id === panchang.nakshatra.id);

  return (
    <TarotFrame glowColor={C.blue}>
      <BrandMark />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '8px', color: C.goldDark, fontWeight: 700 }}>NAKSHATRA OF THE DAY</div>
      </div>
      <StarSeparator />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: '24px' }}>
        {/* Symbol with dramatic glow */}
        <div style={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${C.gold}15, transparent 70%)` }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}20, ${C.goldDark}10)`, border: `3px solid ${C.gold}50`, fontSize: '56px', position: 'relative' }}>
            {nak?.symbol || '✦'}
          </div>
        </div>

        {/* Name — massive */}
        <div style={{ display: 'flex', fontSize: '52px', fontWeight: 900, color: C.goldLight, letterSpacing: '2px' }}>
          {nak ? L(nak.name) : 'Nakshatra'}
        </div>

        {/* Meaning */}
        {details && (
          <div style={{ display: 'flex', fontSize: '20px', color: `${C.textDim}cc`, fontStyle: 'italic', textAlign: 'center', maxWidth: '800px', lineHeight: '1.6' }}>
            {L(details.meaning)}
          </div>
        )}

        <StarSeparator />

        {/* Detail cards */}
        {nak && (
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            {[
              { label: 'DEITY', value: L(nak.deity) },
              { label: 'RULER', value: nak.ruler },
              { label: 'NATURE', value: L(nak.nature) },
            ].map((b) => (
              <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, background: `linear-gradient(135deg, ${C.bgTop}dd, ${C.bg}dd)`, borderRadius: '16px', border: `1px solid ${C.gold}20`, padding: '20px 12px', gap: '8px' }}>
                <div style={{ display: 'flex', fontSize: '11px', color: C.goldDark, letterSpacing: '3px', fontWeight: 700 }}>{b.label}</div>
                <div style={{ display: 'flex', fontSize: '20px', color: C.goldLight, fontWeight: 700, textAlign: 'center' }}>{b.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Characteristics */}
        {details && (
          <div style={{ display: 'flex', background: `linear-gradient(135deg, ${C.bgTop}aa, ${C.bg}aa)`, borderRadius: '16px', border: `1px solid ${C.gold}15`, padding: '20px 24px', width: '100%' }}>
            <div style={{ display: 'flex', fontSize: '18px', color: C.text, lineHeight: '1.7', textAlign: 'center' }}>{L(details.characteristics)}</div>
          </div>
        )}
      </div>
    </TarotFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5: CTA OUTRO — dramatic brand close
// ═══════════════════════════════════════════════════════════════

function Slide5() {
  return (
    <TarotFrame glowColor={C.gold}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '40px' }}>
        {/* Massive brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', fontSize: '56px', letterSpacing: '12px', color: C.gold, fontWeight: 900 }}>DEKHO</div>
          <div style={{ display: 'flex', fontSize: '56px', letterSpacing: '12px', color: C.goldLight, fontWeight: 900 }}>PANCHANG</div>
        </div>

        <div style={{ display: 'flex', width: '300px', height: '3px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

        <StarSeparator size={20} />

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: '24px', color: C.text, fontStyle: 'italic', textAlign: 'center', lineHeight: '1.8', letterSpacing: '1px' }}>
          Vedic Astrology for the Modern Seeker
        </div>

        {/* Sanskrit shloka */}
        <div style={{ display: 'flex', fontSize: '22px', color: `${C.gold}60`, textAlign: 'center', lineHeight: '2', letterSpacing: '2px' }}>
          तमसो मा ज्योतिर्गमय
        </div>

        <StarSeparator />

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', padding: '20px 56px', borderRadius: '16px', background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, fontSize: '24px', fontWeight: 800, color: C.bg, letterSpacing: '2px' }}>
            dekhopanchang.com
          </div>
          <div style={{ display: 'flex', fontSize: '16px', color: C.textDim, letterSpacing: '3px' }}>
            FREE • 7 LANGUAGES • 3000+ TESTS
          </div>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', fontSize: '16px', color: `${C.goldDark}90`, letterSpacing: '3px' }}>@dekhopanchang</div>
      </div>
    </TarotFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slide = parseInt(searchParams.get('slide') || '1', 10);

  try {
    const { panchang, festivals } = getTodayPanchang();
    let element: React.ReactElement;
    switch (slide) {
      case 1: element = <Slide1 panchang={panchang} festivals={festivals} />; break;
      case 2: element = <Slide2 panchang={panchang} />; break;
      case 3: element = <Slide3 panchang={panchang} />; break;
      case 4: element = <Slide4 panchang={panchang} />; break;
      case 5: element = <Slide5 />; break;
      default: element = <Slide1 panchang={panchang} festivals={festivals} />;
    }
    return new ImageResponse(element, { ...SIZE });
  } catch (err) {
    console.error('[youtube-slides] failed:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
