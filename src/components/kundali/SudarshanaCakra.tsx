'use client';
/**
 * Sudarshana Chakra — Three concentric rings
 * Source: BPHS Ch. 22
 *
 * Ring 1 (outer): Lagna-based houses (1H = Lagna sign)
 * Ring 2 (middle): Moon-based houses (1H = Moon sign)
 * Ring 3 (inner): Sun-based houses (1H = Sun sign)
 *
 * Each ring shows the 12 signs in their house positions from the respective ref point.
 * Planets are placed in each ring according to their house from that ring's reference.
 */

import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

interface Props {
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}

const SIGN_ABBR_EN = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
const SIGN_ABBR_HI = ['मे','वृ','मि','क','सि','क','तु','वृ','ध','म','कु','मी'];

// Planet abbreviations for chart
const PLANET_ABBR: Record<number, { en: string; hi: string; color: string }> = {
  0: { en: 'Su', hi: 'सू', color: '#e67e22' },
  1: { en: 'Mo', hi: 'च',  color: '#ecf0f1' },
  2: { en: 'Ma', hi: 'मं', color: '#e74c3c' },
  3: { en: 'Me', hi: 'बु', color: '#2ecc71' },
  4: { en: 'Ju', hi: 'गु', color: '#f39c12' },
  5: { en: 'Ve', hi: 'शु', color: '#e8e6e3' },
  6: { en: 'Sa', hi: 'श',  color: '#3498db' },
  7: { en: 'Ra', hi: 'रा', color: '#8e44ad' },
  8: { en: 'Ke', hi: 'के', color: '#95a5a6' },
};

// Compute 1-based house number of sign from reference sign
function houseOf(refSign: number, sign: number): number {
  return ((sign - refSign + 12) % 12) + 1;
}

export default function SudarshanaCakra({ kundali, locale, isDevanagari, headingFont }: Props) {
  const sun  = kundali.planets.find(p => p.planet.id === 0);
  const moon = kundali.planets.find(p => p.planet.id === 1);

  const lagnaSign = kundali.ascendant.sign;    // 1-12
  const moonSign  = moon ? Math.floor(moon.longitude / 30) + 1 : lagnaSign;
  const sunSign   = sun  ? Math.floor(sun.longitude  / 30) + 1 : lagnaSign;

  // Build planet-per-house maps for each ring
  function buildHouseMap(refSign: number): Record<number, number[]> {
    const map: Record<number, number[]> = {};
    for (let h = 1; h <= 12; h++) map[h] = [];
    for (const p of kundali.planets) {
      const pSign = Math.floor(p.longitude / 30) + 1;
      const h = houseOf(refSign, pSign);
      if (!map[h]) map[h] = [];
      map[h].push(p.planet.id);
    }
    return map;
  }

  const lagnaMap = buildHouseMap(lagnaSign);
  const moonMap  = buildHouseMap(moonSign);
  const sunMap   = buildHouseMap(sunSign);

  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const signAbbr = (signId: number) => isHi ? SIGN_ABBR_HI[signId - 1] : SIGN_ABBR_EN[signId - 1];

  // SVG dimensions
  const cx = 250, cy = 250;
  const R = [210, 155, 100]; // outer, middle, inner radii
  const r = [155, 100, 48];  // inner radii of each ring
  const midR = R.map((outer, i) => (outer + r[i]) / 2);

  // Draw 12 sector arcs for a ring
  function renderRing(outerR: number, innerR: number, refSign: number, map: Record<number, number[]>, ringIdx: number) {
    const sectors = [];
    const arcDeg = 30; // 360 / 12

    for (let h = 0; h < 12; h++) {
      const startAngle = (h * arcDeg - 90) * (Math.PI / 180);
      const endAngle   = ((h + 1) * arcDeg - 90) * (Math.PI / 180);

      // Arc endpoints
      const x1o = cx + outerR * Math.cos(startAngle);
      const y1o = cy + outerR * Math.sin(startAngle);
      const x2o = cx + outerR * Math.cos(endAngle);
      const y2o = cy + outerR * Math.sin(endAngle);
      const x1i = cx + innerR * Math.cos(startAngle);
      const y1i = cy + innerR * Math.sin(startAngle);
      const x2i = cx + innerR * Math.cos(endAngle);
      const y2i = cy + innerR * Math.sin(endAngle);

      // Sign in this house position
      const signId = ((refSign - 1 + h) % 12) + 1;
      const houseNum = h + 1;
      const planetsHere = map[houseNum] || [];

      // Text position
      const midAngle = ((h + 0.5) * arcDeg - 90) * (Math.PI / 180);
      const midRing = (outerR + innerR) / 2;
      const tx = cx + midRing * Math.cos(midAngle);
      const ty = cy + midRing * Math.sin(midAngle);

      // Color — house 1, 5, 9 = trikona (gold tint), 4,7,10 = kendra (purple tint)
      const isTrikona = [1, 5, 9].includes(houseNum);
      const isKendra  = [4, 7, 10].includes(houseNum);
      const fillBase = isTrikona ? 'rgba(212,168,83,0.08)' : isKendra ? 'rgba(100,60,180,0.1)' : 'rgba(17,22,51,0.6)';

      sectors.push(
        <g key={h}>
          <path
            d={`M ${x1i} ${y1i} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 0 0 ${x1i} ${y1i} Z`}
            fill={fillBase}
            stroke="rgba(212,168,83,0.2)"
            strokeWidth="0.8"
          />
          {/* Sign abbreviation */}
          <text x={tx} y={ty - 6} textAnchor="middle" dominantBaseline="middle"
            fontSize={ringIdx === 0 ? 8 : ringIdx === 1 ? 7 : 6}
            fill="rgba(212,168,83,0.6)"
            style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : 'monospace' }}>
            {signAbbr(signId)}
          </text>
          {/* House number */}
          <text x={tx} y={ty + 5} textAnchor="middle" dominantBaseline="middle"
            fontSize={ringIdx === 0 ? 6 : 5}
            fill="rgba(138,132,120,0.5)">
            {houseNum}
          </text>
          {/* Planets */}
          {planetsHere.map((pid, pi) => {
            const planetAngle = ((h + 0.5) * arcDeg - 90) * (Math.PI / 180);
            const pr = (outerR + innerR) / 2;
            const px = cx + pr * Math.cos(planetAngle);
            const pyo = cy + pr * Math.sin(planetAngle);
            const offset = (pi - (planetsHere.length - 1) / 2) * (ringIdx === 0 ? 8 : 6);
            return (
              <text key={pid}
                x={px + offset * Math.cos(planetAngle + Math.PI / 2)}
                y={pyo + offset * Math.sin(planetAngle + Math.PI / 2) + (ringIdx === 0 ? 14 : 12)}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={ringIdx === 0 ? 7 : ringIdx === 1 ? 6 : 5.5}
                fill={PLANET_ABBR[pid]?.color || '#e6e2d8'}
                fontWeight="bold"
                style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : 'monospace' }}>
                {isHi ? PLANET_ABBR[pid]?.hi : PLANET_ABBR[pid]?.en}
              </text>
            );
          })}
        </g>
      );
    }
    return sectors;
  }

  // Reference point labels for center
  const refPoints = [
    { label: isHi ? 'लग्न' : 'Lagna', sign: lagnaSign, color: '#d4a853' },
    { label: isHi ? 'चन्द्र' : 'Moon',  sign: moonSign,  color: '#ecf0f1' },
    { label: isHi ? 'सूर्य' : 'Sun',    sign: sunSign,   color: '#e67e22' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-gold-gradient text-2xl font-bold mb-2" style={headingFont}>
          {locale === 'en' || String(locale) === 'ta' ? 'Sudarshana Chakra' : 'सुदर्शन चक्र'}
        </h3>
        <p className="text-text-secondary/75 text-sm max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {locale === 'en'
            ? 'Three concentric rings — outer: Lagna-based, middle: Moon-based, inner: Sun-based. An event is confirmed when all three rings agree.'
            : 'तीन संकेन्द्रित वलय — बाह्य: लग्न आधारित, मध्य: चन्द्र आधारित, आन्तरिक: सूर्य आधारित। जब तीनों वलय सहमत हों, तभी घटना की पुष्टि होती है।'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        {refPoints.map((rp, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2" style={{ borderColor: rp.color, backgroundColor: rp.color + '22' }} />
            <span className="text-text-secondary/70">{rp.label}: {RASHIS[rp.sign - 1]?.name[locale]}</span>
            <span className="text-text-secondary/65 text-[10px]">{i === 0 ? (locale === 'en' || String(locale) === 'ta' ? 'outer' : 'बाह्य') : i === 1 ? (locale === 'en' || String(locale) === 'ta' ? 'middle' : 'मध्य') : (locale === 'en' || String(locale) === 'ta' ? 'inner' : 'आन्तरिक')}</span>
          </div>
        ))}
      </div>

      {/* SVG Chakra */}
      <div className="flex justify-center">
        <svg viewBox="0 0 500 500" className="w-full max-w-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(212,168,83,0.15))' }}>
          {/* Background */}
          <circle cx={cx} cy={cy} r={215} fill="rgba(10,14,39,0.95)" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />

          {/* Ring 1: Lagna */}
          {renderRing(R[0], r[0], lagnaSign, lagnaMap, 0)}

          {/* Ring 2: Moon */}
          {renderRing(R[1], r[1], moonSign, moonMap, 1)}

          {/* Ring 3: Sun */}
          {renderRing(R[2], r[2], sunSign, sunMap, 2)}

          {/* Center label */}
          <circle cx={cx} cy={cy} r={r[2]} fill="rgba(10,14,39,0.98)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
          <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="rgba(212,168,83,0.8)" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'en' || String(locale) === 'ta' ? 'Sudarshana' : 'सुदर्शन'}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="rgba(212,168,83,0.5)" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'en' || String(locale) === 'ta' ? 'Chakra' : 'चक्र'}
          </text>

          {/* Ring separator labels */}
          <text x={cx + R[0] - 18} y={cy - 5} fontSize="8" fill="rgba(212,168,83,0.5)" textAnchor="middle">
            {locale === 'en' || String(locale) === 'ta' ? 'Lg' : 'ल'}
          </text>
          <text x={cx + R[1] - 15} y={cy - 5} fontSize="7" fill="rgba(236,240,241,0.4)" textAnchor="middle">
            {locale === 'en' || String(locale) === 'ta' ? 'Mo' : 'च'}
          </text>
          <text x={cx + R[2] - 10} y={cy - 5} fontSize="7" fill="rgba(230,126,34,0.5)" textAnchor="middle">
            {locale === 'en' || String(locale) === 'ta' ? 'Su' : 'सू'}
          </text>
        </svg>
      </div>

      {/* House concordance table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4">
        <div className="text-gold-primary/70 text-xs uppercase tracking-wider font-bold mb-3">
          {locale === 'en' || String(locale) === 'ta' ? 'Triple Concordance — Planets in all 3 rings (Strongest indicators)' : 'त्रिवलय सामञ्जस्य — तीनों वलयों में ग्रह (सबसे बलवान संकेत)'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {kundali.planets.map(p => {
            const pSign = Math.floor(p.longitude / 30) + 1;
            const hL = houseOf(lagnaSign, pSign);
            const hM = houseOf(moonSign, pSign);
            const hS = houseOf(sunSign, pSign);
            const allKendra  = [hL, hM, hS].every(h => [1,4,7,10].includes(h));
            const allTrikona = [hL, hM, hS].every(h => [1,5,9].includes(h));
            const someAgree  = hL === hM || hM === hS || hL === hS;
            const abbr = PLANET_ABBR[p.planet.id];
            return (
              <div key={p.planet.id} className={`rounded-lg border p-2.5 ${allTrikona ? 'border-gold-primary/30 bg-gold-primary/8' : allKendra ? 'border-purple-500/20 bg-purple-500/8' : someAgree ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-gold-primary/6 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-sm" style={{ color: abbr?.color }}>
                    {isHi ? p.planet.name.hi : p.planet.name.en}
                  </span>
                  {allTrikona && <span className="text-[9px] px-1 py-0.5 rounded bg-gold-primary/20 text-gold-light">Trikona ✦</span>}
                  {allKendra && !allTrikona && <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/15 text-purple-300">Kendra</span>}
                </div>
                <div className="text-[10px] text-text-secondary/75 font-mono">
                  Lg:{hL}H · Mo:{hM}H · Su:{hS}H
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretation note */}
      <div className="rounded-xl bg-gold-primary/5 border border-gold-primary/12 p-4 text-sm text-text-secondary/70 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {locale === 'en'
          ? 'In Sudarshana analysis, a planet or house is considered powerfully activated when it appears in a kendra (1,4,7,10) or trikona (1,5,9) position in ALL THREE rings simultaneously. During the Dasha of such a planet, the indicated results are strongly confirmed. The outer ring governs your outer life/body, the middle ring governs mind/emotions, the inner ring governs soul/spirit.'
          : 'सुदर्शन विश्लेषण में, जब कोई ग्रह या भाव तीनों वलयों में एक साथ केन्द्र (1,4,7,10) या त्रिकोण (1,5,9) में आता है, तब वह प्रबल रूप से सक्रिय माना जाता है। ऐसे ग्रह की दशा में संकेतित फल प्रबलता से मिलते हैं। बाह्य वलय बाह्य जीवन/शरीर, मध्य वलय मन/भावना, आन्तरिक वलय आत्मा/आत्मा को नियंत्रित करता है।'}
      </div>
    </div>
  );
}
