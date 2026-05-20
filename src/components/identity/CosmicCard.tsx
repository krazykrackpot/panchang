'use client';

import { motion } from 'framer-motion';
import ArchetypeSVG from './ArchetypeSVG';
import { getArchetype } from '@/lib/constants/archetypes';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Types ─────────────────────────────────────────────────────────

interface CosmicCardProps {
  /** Lagna sign ID (1-12) — determines archetype + artwork */
  lagnaSignId: number;
  /** Moon sign ID (1-12) */
  moonSignId: number;
  /** Nakshatra ID (1-27) */
  nakshatraId: number;
  /** Nakshatra pada (1-4) */
  pada?: number;
  /** Birth tithi number (1-30) */
  birthTithi?: number;
  /** Birth tithi name */
  birthTithiName?: string;
  /** Birth paksha */
  birthPaksha?: string;
  /** Birth masa name */
  birthMasa?: string;
  /** Birth masa number (1-12, Chaitra=1) */
  birthMasaNumber?: number;
  /** Mahadasha lord planet ID (0-8) */
  mahaDashaLordId?: number;
  /** Mahadasha lord name */
  mahaDashaName?: string;
  /** Years remaining in mahadasha */
  mahaDashaYearsLeft?: number;
  /** Antardasha lord name */
  antarDashaName?: string;
  /** Major transit description */
  transitDesc?: string;
  /** Transit house number */
  transitHouse?: number;
  /** Count of people in same transit tribe */
  tribeCount?: number;
  /** User's locale */
  locale: string;
}

// Planet IDs for display
const GRAHA_SYMBOLS: Record<number, string> = {
  0: '☉', 1: '☽', 2: '♂', 3: '☿', 4: '♃', 5: '♀', 6: '♄', 7: '☊', 8: '☋',
};

const MASA_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Chaitra', hi: 'चैत्र' }, 2: { en: 'Vaishakha', hi: 'वैशाख' },
  3: { en: 'Jyeshtha', hi: 'ज्येष्ठ' }, 4: { en: 'Ashadha', hi: 'आषाढ़' },
  5: { en: 'Shravana', hi: 'श्रावण' }, 6: { en: 'Bhadrapada', hi: 'भाद्रपद' },
  7: { en: 'Ashwin', hi: 'आश्विन' }, 8: { en: 'Kartik', hi: 'कार्तिक' },
  9: { en: 'Margashirsha', hi: 'मार्गशीर्ष' }, 10: { en: 'Pausha', hi: 'पौष' },
  11: { en: 'Magha', hi: 'माघ' }, 12: { en: 'Phalguna', hi: 'फाल्गुन' },
};

// ─── Component ─────────────────────────────────────────────────────

export default function CosmicCard({
  lagnaSignId, moonSignId, nakshatraId, pada,
  birthTithi, birthTithiName, birthPaksha, birthMasa, birthMasaNumber,
  mahaDashaLordId, mahaDashaName, mahaDashaYearsLeft, antarDashaName,
  transitDesc, transitHouse, tribeCount,
  locale,
}: CosmicCardProps) {
  const archetype = getArchetype(lagnaSignId);
  const rashi = RASHIS[moonSignId - 1];
  const nakshatra = NAKSHATRAS[nakshatraId - 1];
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)';

  if (!archetype || !rashi) return null;

  const archetypeName = tl(archetype.name, locale);
  const lagnaRashi = RASHIS[lagnaSignId - 1];
  const lagnaName = lagnaRashi ? tl(lagnaRashi.name, locale) : '';
  const rashiName = tl(rashi.name, locale);
  const nakName = nakshatra ? tl(nakshatra.name, locale) : '';
  const essence = tl(archetype.essence, locale);
  const rulerName = tl(rashi.rulerName, locale);
  const elementName = tl(rashi.element, locale);

  // Cosmic number: Rashi · Nakshatra · Masa · Tithi · Graha
  const masaNum = birthMasaNumber || 0;
  const tithiNum = birthTithi || 0;
  const grahaNum = mahaDashaLordId != null ? mahaDashaLordId : 0;
  const cosmicNumber = `${moonSignId} · ${nakshatraId} · ${masaNum || '–'} · ${tithiNum || '–'} · ${grahaNum}`;

  const masaName = birthMasa || (birthMasaNumber ? (isHi ? MASA_NAMES[birthMasaNumber]?.hi : MASA_NAMES[birthMasaNumber]?.en) : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[380px] mx-auto"
    >
      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{
          aspectRatio: '5/8',
          boxShadow: '0 0 60px rgba(212, 168, 83, 0.15), 0 0 120px rgba(212, 168, 83, 0.05)',
        }}
      >
        {/* Full-card SVG artwork background */}
        <div className="absolute inset-0">
          <ArchetypeSVG rashiId={lagnaSignId} className="w-full h-full" />
        </div>

        {/* Gold border */}
        <div className="absolute inset-0 rounded-[20px] border-2 border-gold-primary/50 z-[5] pointer-events-none" />
        <div className="absolute inset-[5px] rounded-[16px] border border-gold-primary/15 z-[5] pointer-events-none" />

        {/* Text overlay with gradient for readability */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(4,6,16,0.25) 0%, rgba(4,6,16,0.05) 25%, rgba(4,6,16,0.05) 40%, rgba(4,6,16,0.65) 60%, rgba(4,6,16,0.92) 80%, rgba(4,6,16,0.97) 100%)',
          }}
        >
          {/* ── TOP: Archetype + Cosmic Number ── */}
          <div className="text-center pt-7 px-6">
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold-primary/60 font-semibold">
              {isHi ? 'आपकी ब्रह्माण्डीय पहचान' : 'Your Cosmic Identity'}
            </p>
            <h2
              className="text-[28px] sm:text-[32px] font-black leading-tight mt-2 text-gold-gradient"
              style={{ fontFamily: hf }}
            >
              {archetypeName}
            </h2>
            <p className="text-gold-primary/50 text-xs tracking-widest mt-1">
              {lagnaName} {isHi ? 'लग्न' : 'Lagna'}
            </p>

            {/* Cosmic Number — BIG and BOLD */}
            <p
              className="text-[22px] font-black tracking-[0.12em] mt-4"
              style={{
                fontFamily: hf,
                color: 'rgba(240, 212, 138, 0.85)',
                textShadow: '0 0 20px rgba(212, 168, 83, 0.4)',
              }}
            >
              {cosmicNumber}
            </p>
            <p className="text-[8px] tracking-[0.25em] uppercase text-gold-primary/35 mt-1">
              {isHi ? 'राशि · नक्षत्र · मास · तिथि · ग्रह' : 'Rashi · Nakshatra · Masa · Tithi · Graha'}
            </p>
          </div>

          {/* ── MIDDLE: Essence quote (floats over the artwork) ── */}
          <div className="px-8 text-center">
            <p className="text-sm italic text-text-primary/60 leading-relaxed"
              style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              &ldquo;{essence}&rdquo;
            </p>
          </div>

          {/* ── BOTTOM: Data grid ── */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-[5px]">
              {/* Moon Sign */}
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-emerald-400/80">☽ {isHi ? 'चन्द्र राशि' : 'Moon Sign'}</p>
                  <span className="text-emerald-400/25 text-lg font-black" style={{ fontFamily: hf }}>{moonSignId}</span>
                </div>
                <p className="text-sm font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>{rashiName}</p>
                <p className="text-[10px] text-text-secondary/60">{elementName} · {rulerName}</p>
              </div>

              {/* Nakshatra */}
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-purple-400/80">✦ {isHi ? 'नक्षत्र' : 'Birth Star'}</p>
                  <span className="text-purple-400/25 text-lg font-black" style={{ fontFamily: hf }}>{nakshatraId}</span>
                </div>
                <p className="text-sm font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>{nakName}</p>
                <p className="text-[10px] text-text-secondary/60">
                  {pada ? `${isHi ? 'पद' : 'Pada'} ${pada}` : ''}{nakshatra ? ` · ${tl(nakshatra.rulerName, locale)}` : ''}
                </p>
              </div>

              {/* Birth Panchang — Tithi + Masa */}
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-pink-400/80">☸ {isHi ? 'जन्म तिथि' : 'Birth Tithi'}</p>
                  <span className="text-pink-400/25 text-lg font-black" style={{ fontFamily: hf }}>{tithiNum || '–'}</span>
                </div>
                <p className="text-sm font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>
                  {birthTithiName || (isHi ? 'तिथि' : 'Tithi')}
                </p>
                <p className="text-[10px] text-text-secondary/60">
                  {masaName ? `${masaName} · ` : ''}{birthPaksha || ''}
                </p>
              </div>

              {/* Dasha */}
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-blue-400/80">
                    {GRAHA_SYMBOLS[mahaDashaLordId ?? 4]} {isHi ? 'जीवन चरण' : 'Life Phase'}
                  </p>
                  <span className="text-blue-400/25 text-lg font-black" style={{ fontFamily: hf }}>{mahaDashaLordId ?? '–'}</span>
                </div>
                <p className="text-sm font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>
                  {mahaDashaName || (isHi ? 'दशा' : 'Dasha')}
                </p>
                <p className="text-[10px] text-text-secondary/60">
                  {mahaDashaYearsLeft != null ? `${mahaDashaYearsLeft}${isHi ? ' वर्ष शेष' : 'y left'}` : ''}
                  {antarDashaName ? ` · ${antarDashaName} AD` : ''}
                </p>
              </div>

              {/* Transit Tribe — full width */}
              {transitDesc && (
                <div className="col-span-2 rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-amber-400/80">♄ {isHi ? 'गोचर समूह' : 'Transit Tribe'}</p>
                  <p className="text-sm font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>
                    {transitDesc}{transitHouse ? ` → ${transitHouse}${isHi ? 'वाँ भाव' : 'H'}` : ''}
                  </p>
                  {tribeCount != null && tribeCount > 0 && (
                    <p className="text-[10px] text-amber-400/50 mt-0.5">
                      {isHi ? `${tribeCount.toLocaleString()} अन्य ${rashiName} के साथ` : `With ${tribeCount.toLocaleString()} other ${tl(rashi.name, 'en')} natives`}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gold-primary/10">
              <span className="text-[9px] tracking-[0.12em] text-gold-primary/30" style={{ fontFamily: hf }}>
                DEKHO PANCHANG
              </span>
              <span className="text-[10px] text-gold-primary/40">
                {lagnaName} {isHi ? 'लग्न' : 'Lagna'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
