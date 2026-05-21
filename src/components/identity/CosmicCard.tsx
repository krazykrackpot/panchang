'use client';

import { motion } from 'framer-motion';
import { getArchetype } from '@/lib/constants/archetypes';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface CosmicCardProps {
  lagnaSignId: number;
  moonSignId: number;
  nakshatraId: number;
  pada?: number;
  birthTithi?: number;
  birthTithiName?: string;
  birthPaksha?: string;
  birthMasa?: string;
  birthMasaNumber?: number;
  mahaDashaLordId?: number;
  mahaDashaName?: string;
  mahaDashaYearsLeft?: number;
  antarDashaName?: string;
  transitDesc?: string;
  transitHouse?: number;
  tribeCount?: number;
  birthYear?: number;
  locale: string;
}

const GRAHA_SYMBOLS: Record<number, string> = {
  0: '\u2609', 1: '\u263d', 2: '\u2642', 3: '\u263f', 4: '\u2643', 5: '\u2640', 6: '\u2644', 7: '\u260a', 8: '\u260b',
};

const MASA_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Chaitra', hi: '\u091a\u0948\u0924\u094d\u0930' }, 2: { en: 'Vaishakha', hi: '\u0935\u0948\u0936\u093e\u0916' },
  3: { en: 'Jyeshtha', hi: '\u091c\u094d\u092f\u0947\u0937\u094d\u0920' }, 4: { en: 'Ashadha', hi: '\u0906\u0937\u093e\u0922\u093c' },
  5: { en: 'Shravana', hi: '\u0936\u094d\u0930\u093e\u0935\u0923' }, 6: { en: 'Bhadrapada', hi: '\u092d\u093e\u0926\u094d\u0930\u092a\u0926' },
  7: { en: 'Ashwin', hi: '\u0906\u0936\u094d\u0935\u093f\u0928' }, 8: { en: 'Kartik', hi: '\u0915\u093e\u0930\u094d\u0924\u093f\u0915' },
  9: { en: 'Margashirsha', hi: '\u092e\u093e\u0930\u094d\u0917\u0936\u0940\u0930\u094d\u0937' }, 10: { en: 'Pausha', hi: '\u092a\u094c\u0937' },
  11: { en: 'Magha', hi: '\u092e\u093e\u0918' }, 12: { en: 'Phalguna', hi: '\u092b\u093e\u0932\u094d\u0917\u0941\u0928' },
};

export default function CosmicCard({
  lagnaSignId, moonSignId, nakshatraId, pada,
  birthTithi, birthTithiName, birthPaksha, birthMasa, birthMasaNumber,
  mahaDashaLordId, mahaDashaName, mahaDashaYearsLeft, antarDashaName,
  transitDesc, transitHouse, tribeCount,
  birthYear,
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

  const masaNum = birthMasaNumber || 0;
  const tithiNum = birthTithi || 0;
  const cosmicNumber = `${tithiNum || '-'} . ${masaNum || '-'} . ${birthYear || '-'} . ${nakshatraId || '-'} . ${moonSignId || '-'} . ${mahaDashaLordId != null && mahaDashaLordId >= 0 ? mahaDashaLordId + 1 : '-'}`;
  const masaName = birthMasa || (birthMasaNumber ? (isHi ? MASA_NAMES[birthMasaNumber]?.hi : MASA_NAMES[birthMasaNumber]?.en) : '');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mx-auto">
      <div className="relative rounded-[20px] overflow-hidden" style={{
        aspectRatio: '9/16',
        boxShadow: '0 0 40px rgba(212, 168, 83, 0.1)',
        border: '1.5px solid rgba(212, 168, 83, 0.4)',
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b69]/80 via-[#1a1040]/90 to-[#0a0e27]" />

        <div className="absolute inset-0 rounded-[20px] border-2 border-gold-primary/50 z-[5] pointer-events-none" />

        <div className="absolute inset-0 z-10 flex flex-col justify-between" style={{
          background: 'linear-gradient(180deg, rgba(26,16,64,0.4) 0%, rgba(26,16,64,0.15) 15%, rgba(26,16,64,0.1) 35%, rgba(26,16,64,0.1) 50%, rgba(10,14,39,0.6) 60%, rgba(10,14,39,0.85) 70%, rgba(10,14,39,0.95) 80%, rgba(10,14,39,0.98) 100%)',
        }}>
          <div className="text-center pt-5 px-6">
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold-primary/60 font-semibold">
              {isHi ? 'Cosmic Identity' : 'Your Cosmic Identity'}
            </p>
            <h2 className="text-[28px] sm:text-[32px] font-black leading-tight mt-2 text-gold-gradient" style={{ fontFamily: hf }}>
              {archetypeName}
            </h2>
            <p className="text-[12px] sm:text-[14px] font-black tracking-[0.04em] mt-3 whitespace-nowrap" style={{
              fontFamily: hf, color: 'rgba(240, 212, 138, 0.85)',
              textShadow: '0 0 20px rgba(212, 168, 83, 0.4)',
            }}>
              {cosmicNumber}
            </p>
            <p className="text-[8px] tracking-[0.25em] uppercase text-gold-primary/60 mt-1">
              {isHi ? 'Tithi . Masa . Year . Nakshatra . Rashi . Planet' : 'Tithi . Masa . Year . Nakshatra . Rashi . Planet'}
            </p>
            {birthYear ? (
              <p className="text-xs text-gold-primary/40 mt-2 tracking-wider">
                {isHi ? `Vikram ${birthYear + 57} . ${birthYear} CE` : `Born ${birthYear} . VS ${birthYear + 57}`}
              </p>
            ) : null}
          </div>

          <div className="px-6 text-center mb-2">
            <p className="text-base sm:text-lg font-semibold text-gold-light/80 leading-relaxed"
              style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              &ldquo;{essence}&rdquo;
            </p>
          </div>

          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-[5px]">
              <div className="rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-pink-400">Birth Tithi</p>
                  <span className="text-pink-400/20 text-sm font-black" style={{ fontFamily: hf }}>{tithiNum || '-'}</span>
                </div>
                <p className="text-xs font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>
                  {isHi ? (birthTithiName || '-') : birthTithi ? `${birthPaksha === 'Shukla' ? 'Waxing' : 'Waning'} ${birthTithi}${birthTithi === 1 ? 'st' : birthTithi === 2 ? 'nd' : birthTithi === 3 ? 'rd' : 'th'}` : '-'}
                </p>
              </div>
              <div className="rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-rose-400">Birth Month</p>
                  <span className="text-rose-400/20 text-sm font-black" style={{ fontFamily: hf }}>{masaNum || '-'}</span>
                </div>
                <p className="text-xs font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>
                  {masaName || '-'} ({masaNum || '-'})
                </p>
              </div>
              <div className="rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-emerald-400">Moon Sign</p>
                  <span className="text-emerald-400/20 text-sm font-black" style={{ fontFamily: hf }}>{moonSignId}</span>
                </div>
                <p className="text-xs font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>{rashiName}</p>
                <p className="text-[9px] text-text-secondary/60">{elementName}</p>
              </div>
              <div className="rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-purple-400">Birth Star</p>
                  <span className="text-purple-400/20 text-sm font-black" style={{ fontFamily: hf }}>{nakshatraId}</span>
                </div>
                <p className="text-xs font-bold text-text-primary mt-0.5" style={{ fontFamily: hf }}>{nakName}</p>
                <p className="text-[9px] text-text-secondary/60">{pada ? `Pada ${pada}` : ''}</p>
              </div>
              <div className="col-span-2 rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-blue-400">
                    {mahaDashaLordId != null ? GRAHA_SYMBOLS[mahaDashaLordId] : ''} Life Phase
                  </p>
                  <span className="text-blue-400/20 text-sm font-black" style={{ fontFamily: hf }}>{mahaDashaLordId != null && mahaDashaLordId >= 0 ? mahaDashaLordId + 1 : '-'}</span>
                </div>
                <p className="text-xs font-bold text-text-primary mt-0.5 truncate" style={{ fontFamily: hf }}>
                  {mahaDashaName || '-'} {mahaDashaYearsLeft != null ? `(${mahaDashaYearsLeft}y)` : ''}
                </p>
              </div>
              {transitDesc && (
                <div className="col-span-2 rounded-xl p-2 bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                  <p className="text-[7px] tracking-[0.1em] uppercase text-amber-400">Transit</p>
                  <p className="text-xs font-bold text-text-primary mt-0.5 truncate" style={{ fontFamily: hf }}>
                    {transitDesc}{transitHouse ? ` > ${transitHouse}H` : ''}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gold-primary/10">
              <span className="text-[8px] tracking-[0.1em] text-gold-primary/30" style={{ fontFamily: hf }}>DEKHO PANCHANG</span>
              <span className="text-xs text-gold-light font-semibold tracking-wide">{lagnaName} {isHi ? 'Lagna' : 'Lagna'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
