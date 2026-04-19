'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import { VARA_DATA } from '@/lib/constants/grahas';
import { SBC_GRID, type SBCCell } from '@/lib/chakra/sbc-grid-layout';
import { analyzeSarvatobhadra, type SBCAnalysis, type TransitVedha } from '@/lib/chakra/sarvatobhadra';
import { dateToJD, getPlanetaryPositions, toSidereal, getNakshatraNumber } from '@/lib/ephem/astronomical';
import { tl } from '@/lib/utils/trilingual';
import GoldDivider from '@/components/ui/GoldDivider';

// --------------- i18n labels ---------------

const LABELS: Record<string, Record<string, string>> = {
  title: { en: 'Sarvatobhadra Chakra', hi: 'सर्वतोभद्र चक्र', sa: 'सर्वतोभद्रचक्रम्' },
  subtitle: {
    en: 'Vedic 9x9 Vedha Analysis Grid',
    hi: 'वैदिक 9×9 वेध विश्लेषण ग्रिड',
    sa: 'वैदिकं 9×9 वेधविश्लेषणजालम्',
  },
  birthNakshatra: { en: 'Birth Nakshatra', hi: 'जन्म नक्षत्र', sa: 'जन्मनक्षत्रम्' },
  selectNakshatra: { en: 'Select nakshatra...', hi: 'नक्षत्र चुनें...', sa: 'नक्षत्रं चिनुत...' },
  transitDate: { en: 'Transit Date', hi: 'गोचर तिथि', sa: 'गोचरदिनम्' },
  analyze: { en: 'Analyze Vedha', hi: 'वेध विश्लेषण', sa: 'वेधविश्लेषणम्' },
  transitVedha: { en: 'Transit Vedha Analysis', hi: 'गोचर वेध विश्लेषण', sa: 'गोचरवेधविश्लेषणम्' },
  benefic: { en: 'BENEFIC', hi: 'शुभ', sa: 'शुभम्' },
  malefic: { en: 'MALEFIC', hi: 'अशुभ', sa: 'अशुभम्' },
  affects: { en: 'Affects', hi: 'प्रभावित', sa: 'प्रभावः' },
  days: { en: 'Days', hi: 'वार', sa: 'वाराः' },
  yourNakshatra: { en: 'YOUR nakshatra is under vedha', hi: 'आपका नक्षत्र वेध में है', sa: 'भवतः नक्षत्रं वेधे अस्ति' },
  summary: { en: 'Summary', hi: 'सारांश', sa: 'सारांशः' },
  favorableDays: { en: 'Favorable Days', hi: 'शुभ वार', sa: 'शुभवाराः' },
  unfavorableDays: { en: 'Unfavorable Days', hi: 'अशुभ वार', sa: 'अशुभवाराः' },
  overallAssessment: { en: 'Overall Assessment', hi: 'समग्र मूल्यांकन', sa: 'समग्रमूल्याङ्कनम्' },
  noTransits: { en: 'Select a birth nakshatra to begin analysis', hi: 'विश्लेषण के लिए जन्म नक्षत्र चुनें', sa: 'विश्लेषणार्थं जन्मनक्षत्रं चिनुत' },
  in: { en: 'in', hi: 'में', sa: 'मध्ये' },
  vedha: { en: 'vedha', hi: 'वेध', sa: 'वेधः' },
  legend: { en: 'Legend', hi: 'संकेत', sa: 'सङ्केतः' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  vowel: { en: 'Vowel', hi: 'स्वर', sa: 'स्वरः' },
  weekday: { en: 'Weekday', hi: 'वार', sa: 'वारः' },
  tithi: { en: 'Tithi', hi: 'तिथि', sa: 'तिथिः' },
  direction: { en: 'Direction', hi: 'दिशा', sa: 'दिशा' },
  birthCell: { en: 'Birth Nakshatra', hi: 'जन्म नक्षत्र', sa: 'जन्मनक्षत्रम्' },
  beneficVedha: { en: 'Benefic Vedha', hi: 'शुभ वेध', sa: 'शुभवेधः' },
  maleficVedha: { en: 'Malefic Vedha', hi: 'अशुभ वेध', sa: 'अशुभवेधः' },
  hoverHint: { en: 'Hover/tap a cell for details', hi: 'विवरण के लिए सेल पर क्लिक करें', sa: 'विवरणार्थं कोष्ठे क्लिक् कुर्वन्तु' },
  noneThisPeriod: { en: 'None in this period', hi: 'इस अवधि में कोई नहीं', sa: 'अस्मिन् काले न किमपि' },
};

// --------------- real transit computation ---------------

interface TransitInfo {
  planetId: number;
  nakshatraId: number;
  entryDate: Date;
  exitDate: Date;
  isRetrograde: boolean;
}

function computeCurrentTransits(): TransitInfo[] {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours() + now.getMinutes() / 60);
  const positions = getPlanetaryPositions(jd);
  const NAK_SPAN = 360 / 27; // 13.333°

  return positions.map(p => {
    const sidLong = toSidereal(p.longitude, jd);
    const nakId = Math.min(Math.max(getNakshatraNumber(sidLong), 1), 27);
    const nakStart = (nakId - 1) * NAK_SPAN;
    const nakEnd = nakId * NAK_SPAN;

    // Use actual speed to estimate entry/exit dates
    // Speed is tropical degrees/day — close enough for sidereal estimation
    const speed = Math.abs(p.speed) || 0.01; // avoid division by zero
    const isRetro = p.isRetrograde;

    let degSinceEntry: number;
    let degToExit: number;
    if (!isRetro) {
      degSinceEntry = ((sidLong - nakStart) + 360) % 360;
      if (degSinceEntry > NAK_SPAN) degSinceEntry = NAK_SPAN / 2; // safety
      degToExit = ((nakEnd - sidLong) + 360) % 360;
      if (degToExit > NAK_SPAN) degToExit = NAK_SPAN / 2;
    } else {
      // Retrograde: moving backward, so "exit" is the start boundary
      degToExit = ((sidLong - nakStart) + 360) % 360;
      if (degToExit > NAK_SPAN) degToExit = NAK_SPAN / 2;
      degSinceEntry = ((nakEnd - sidLong) + 360) % 360;
      if (degSinceEntry > NAK_SPAN) degSinceEntry = NAK_SPAN / 2;
    }

    const daysSinceEntry = degSinceEntry / speed;
    const daysToExit = degToExit / speed;

    const entryDate = new Date(now.getTime() - daysSinceEntry * 86400000);
    const exitDate = new Date(now.getTime() + daysToExit * 86400000);

    return { planetId: p.id, nakshatraId: nakId, entryDate, exitDate, isRetrograde: isRetro };
  });
}

// --------------- weekday name helper ---------------
const WEEKDAY_NAMES: Record<number, Record<string, string>> = {
  0: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
  1: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
  2: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
  3: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
  4: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
  5: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
  6: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
};

// --------------- cell style map (hoisted to module level for perf) ---------------
const CELL_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  nakshatra: { bg: 'bg-[#1a1040]/60', border: 'border-gold-primary/20', text: 'text-gold-light' },
  vowel: { bg: 'bg-[#0d1235]/40', border: 'border-blue-400/15', text: 'text-blue-300' },
  weekday: { bg: 'bg-[#1a2040]/40', border: 'border-emerald-400/15', text: 'text-emerald-300' },
  tithi: { bg: 'bg-[#201035]/40', border: 'border-purple-400/15', text: 'text-purple-300' },
  direction: { bg: 'bg-[#0a0e27]/30', border: 'border-gold-primary/10', text: 'text-text-secondary' },
};

const ABHIJIT_STYLE = { bg: 'bg-gold-primary/10', border: 'border-gold-primary/30', text: 'text-gold-light' };

// --------------- legend items ---------------
const LEGEND_ITEMS: { key: string; bg: string; border: string }[] = [
  { key: 'nakshatra', bg: 'bg-[#1a1040]/60', border: 'border-gold-primary/20' },
  { key: 'vowel', bg: 'bg-[#0d1235]/40', border: 'border-blue-400/15' },
  { key: 'weekday', bg: 'bg-[#1a2040]/40', border: 'border-emerald-400/15' },
  { key: 'tithi', bg: 'bg-[#201035]/40', border: 'border-purple-400/15' },
  { key: 'direction', bg: 'bg-[#0a0e27]/30', border: 'border-gold-primary/10' },
  { key: 'birthCell', bg: 'bg-gold-primary/5', border: 'border-gold-primary' },
  { key: 'beneficVedha', bg: 'bg-emerald-500/15', border: 'border-emerald-400/30' },
  { key: 'maleficVedha', bg: 'bg-red-500/15', border: 'border-red-400/30' },
];

// --------------- component ---------------

export default function SarvatobhadraPage() {
  const locale = useLocale();
  const l = useCallback((key: string) => tl(LABELS[key], locale), [locale]);

  const searchParams = useSearchParams();
  const [birthNakId, setBirthNakId] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<SBCCell | null>(null);

  // Auto-populate birth nakshatra from URL params (?nak=14) or sessionStorage
  // URL params take priority over stored state (documented precedence per CLAUDE.md)
  useEffect(() => {
    const urlNak = searchParams.get('nak');
    if (urlNak) {
      const id = parseInt(urlNak, 10);
      if (id >= 1 && id <= 27) { setBirthNakId(id); return; }
    }
    try {
      const stored = sessionStorage.getItem('kundali_last_result');
      if (stored) {
        const kundali = JSON.parse(stored);
        const moonNak = kundali?.planets?.find((p: { planet: { id: number } }) => p.planet.id === 1)?.nakshatra?.id;
        if (moonNak && moonNak >= 1 && moonNak <= 27) setBirthNakId(moonNak);
      }
    } catch { /* sessionStorage unavailable or parse error — user picks manually */ }
  }, [searchParams]);

  // Compute real transit positions from the ephemeris engine
  const currentTransits = useMemo(() => computeCurrentTransits(), []);
  const transitInput = useMemo(() => currentTransits.map(t => ({ planetId: t.planetId, nakshatraId: t.nakshatraId })), [currentTransits]);

  // Run analysis whenever birth nakshatra changes
  const analysis: SBCAnalysis | null = useMemo(() => {
    if (birthNakId === 0) return null;
    return analyzeSarvatobhadra(birthNakId, transitInput);
  }, [birthNakId, transitInput]);

  // Build sets for highlighting cells
  const highlightSets = useMemo(() => {
    const birthCells = new Set<string>();
    const beneficCells = new Set<string>();
    const maleficCells = new Set<string>();
    const transitSourceCells = new Set<string>();

    if (!analysis) return { birthCells, beneficCells, maleficCells, transitSourceCells };

    // Mark birth nakshatra cells
    for (const row of SBC_GRID) {
      for (const cell of row) {
        if (cell.type === 'nakshatra' && cell.nakshatraId === birthNakId) {
          birthCells.add(`${cell.row},${cell.col}`);
        }
      }
    }

    // Mark transit source cells and vedha-affected cells
    for (const tv of analysis.transitVedhas) {
      // Mark transit planet source cells
      for (const row of SBC_GRID) {
        for (const cell of row) {
          if (cell.type === 'nakshatra' && cell.nakshatraId === tv.nakshatraId) {
            transitSourceCells.add(`${cell.row},${cell.col}`);
          }
        }
      }

      // Mark affected cells
      const targetSet = tv.isBenefic ? beneficCells : maleficCells;
      for (const line of tv.vedhaLines) {
        for (const pos of line.affectedCells) {
          const key = `${pos.row},${pos.col}`;
          if (!birthCells.has(key) && !transitSourceCells.has(key)) {
            targetSet.add(key);
          }
        }
      }
    }

    return { birthCells, beneficCells, maleficCells, transitSourceCells };
  }, [analysis, birthNakId]);

  // Check if a vedha crosses birth nakshatra
  const birthIsStruck = useCallback((tv: TransitVedha): boolean => {
    return tv.vedhaLines.some(l => l.affectedNakshatras.includes(birthNakId));
  }, [birthNakId]);

  // Get cell CSS classes
  const getCellClasses = useCallback((cell: SBCCell): string => {
    const key = `${cell.row},${cell.col}`;
    const base = 'flex items-center justify-center border text-center transition-all duration-150 cursor-pointer select-none';
    const sizeClass = 'w-full min-h-[44px] sm:min-h-[52px] md:min-h-[56px] text-[10px] sm:text-xs md:text-sm';

    // Birth nakshatra highlight (highest priority)
    if (highlightSets.birthCells.has(key)) {
      return `${base} ${sizeClass} bg-gold-primary/10 border-2 border-gold-primary shadow-lg shadow-gold-primary/20 text-gold-light font-bold rounded-sm`;
    }

    // Transit source cells
    if (highlightSets.transitSourceCells.has(key)) {
      return `${base} ${sizeClass} bg-cyan-500/15 border-2 border-cyan-400/40 text-cyan-300 font-semibold rounded-sm`;
    }

    // Malefic vedha highlight (override benefic if conflict)
    if (highlightSets.maleficCells.has(key)) {
      return `${base} ${sizeClass} bg-red-500/15 border border-red-400/30 text-red-300 rounded-sm`;
    }

    // Benefic vedha highlight
    if (highlightSets.beneficCells.has(key)) {
      return `${base} ${sizeClass} bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-sm`;
    }

    // Abhijit special
    if (cell.type === 'nakshatra' && cell.nakshatraId === 28) {
      return `${base} ${sizeClass} ${ABHIJIT_STYLE.bg} border ${ABHIJIT_STYLE.border} ${ABHIJIT_STYLE.text} rounded-sm`;
    }

    // Default cell type styling
    const style = CELL_STYLES[cell.type] || CELL_STYLES.direction;
    return `${base} ${sizeClass} ${style.bg} border ${style.border} ${style.text} rounded-sm hover:brightness-125`;
  }, [highlightSets]);

  // Get display label for a cell (short form for grid)
  const getCellLabel = useCallback((cell: SBCCell): string => {
    if (cell.type === 'nakshatra') {
      if (cell.nakshatraId === 28) return locale === 'sa' ? 'अभिजित्' : locale === 'hi' ? 'अभिजित्' : 'Abhi';
      const nak = NAKSHATRAS.find(n => n.id === cell.nakshatraId);
      if (!nak) return cell.value;
      const fullName = tl(nak.name, locale);
      // Show longer names now that grid is bigger
      if (locale === 'en') return fullName.length > 8 ? fullName.slice(0, 7) : fullName;
      return fullName.length > 5 ? fullName.slice(0, 5) : fullName;
    }
    if (cell.type === 'weekday') {
      const wd = VARA_DATA.find(v => v.day === cell.weekdayNum);
      if (!wd) return cell.value;
      const name = tl(wd.name, locale);
      if (locale === 'en') return name.slice(0, 3);
      return name.length > 3 ? name.slice(0, 3) : name;
    }
    return cell.value;
  }, [locale]);

  // Tooltip content
  const getTooltipContent = useCallback((cell: SBCCell): string => {
    if (cell.type === 'nakshatra') {
      if (cell.nakshatraId === 28) return locale === 'hi' ? 'अभिजित् नक्षत्र' : 'Abhijit Nakshatra';
      const nak = NAKSHATRAS.find(n => n.id === cell.nakshatraId);
      return nak ? tl(nak.name, locale) : cell.value;
    }
    if (cell.type === 'weekday') {
      const wd = VARA_DATA.find(v => v.day === cell.weekdayNum);
      return wd ? tl(wd.name, locale) : cell.value;
    }
    if (cell.type === 'tithi') {
      return `${l('tithi')} ${cell.value}`;
    }
    if (cell.type === 'vowel') {
      return `${l('vowel')}: ${cell.value}`;
    }
    return cell.value;
  }, [locale, l]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold-gradient">{l('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {l('subtitle')}
        </p>
      </div>

      {/* Educational context */}
      <details className="mb-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl group" open>
          <summary className="px-5 py-3 cursor-pointer text-sm text-gold-primary hover:text-gold-light transition-colors flex items-center gap-2">
            <span className="text-base">📖</span>
            {locale === 'hi' ? 'सर्वतोभद्र चक्र क्या है?' : locale === 'sa' ? 'सर्वतोभद्रचक्रं किम्?' : 'What is Sarvatobhadra Chakra?'}
            <span className="ml-auto text-text-secondary/40 text-xs group-open:rotate-90 transition-transform">▶</span>
          </summary>
          <div className="px-5 pb-5 space-y-3">
            <p className="text-sm text-text-secondary leading-relaxed">
              {locale === 'hi'
                ? 'सर्वतोभद्र चक्र एक 9×9 ग्रिड है जो 28 नक्षत्रों, 7 वारों, 30 तिथियों, स्वरों और दिशाओं को एक संरचित मानचित्र में व्यवस्थित करता है। जब कोई गोचर ग्रह ग्रिड की किसी कोष्ठ पर स्थित होता है, तो वह उसी पंक्ति, स्तम्भ और विकर्ण पर "वेध" (पीड़ा/प्रभाव) डालता है। शुभ ग्रहों का वेध अनुकूल होता है; अशुभ ग्रहों का वेध प्रतिकूल।'
                : 'The Sarvatobhadra Chakra is a 9×9 grid that maps all 28 nakshatras, 7 weekdays, 30 tithis, vowels, and directions into one structured chart. When a transiting planet occupies a cell, it casts "vedha" (aspect/affliction) along its row, column, and both diagonals — affecting every element in those lines. Benefic planets create favorable vedha; malefic planets create unfavorable vedha.'}
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                <p className="text-gold-light font-medium mb-1">{locale === 'hi' ? 'जन्म नक्षत्र वेध' : 'Birth Nakshatra Vedha'}</p>
                <p className="text-text-secondary">{locale === 'hi' ? 'यदि किसी ग्रह की वेध रेखा आपके जन्म नक्षत्र से गुज़रती है, तो वह ग्रह आप पर सीधा प्रभाव डालता है।' : 'When a planet\'s vedha line passes through YOUR birth nakshatra, that planet directly influences you — for good (benefic) or challenge (malefic).'}</p>
              </div>
              <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                <p className="text-gold-light font-medium mb-1">{locale === 'hi' ? 'प्रभाव अवधि' : 'Duration of Effect'}</p>
                <p className="text-text-secondary">{locale === 'hi' ? 'वेध का प्रभाव तब तक रहता है जब तक गोचर ग्रह उस नक्षत्र में रहता है। चन्द्रमा ~1 दिन, सूर्य ~13 दिन, बृहस्पति ~13 मास।' : 'Effects last as long as the transit planet stays in that nakshatra. Moon ~1 day, Sun ~13 days, Mars ~45 days, Jupiter ~13 months, Saturn ~13 months.'}</p>
              </div>
              <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                <p className="text-gold-light font-medium mb-1">{locale === 'hi' ? 'शुभ बनाम अशुभ' : 'Benefic vs Malefic'}</p>
                <p className="text-text-secondary">{locale === 'hi' ? 'चन्द्र, बुध, गुरु, शुक्र = शुभ। सूर्य, मंगल, शनि, राहु, केतु = अशुभ। यदि शुभ और अशुभ दोनों एक ही तत्व पर वेध करें, तो अशुभ प्रबल होता है।' : 'Moon, Mercury, Jupiter, Venus = benefic. Sun, Mars, Saturn, Rahu, Ketu = malefic. When both strike the same element, malefic overrides benefic.'}</p>
              </div>
            </div>
          </div>
        </details>

        {/* Controls */}
        <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gold-light">
              {l('birthNakshatra')}
            </label>
            <select
              value={birthNakId}
              onChange={(e) => setBirthNakId(Number(e.target.value))}
              className="w-full rounded-lg border border-gold-primary/20 bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-gold-primary focus:outline-none focus:ring-1 focus:ring-gold-primary/50"
            >
              <option value={0}>{l('selectNakshatra')}</option>
              {NAKSHATRAS.map((n) => (
                <option key={n.id} value={n.id}>
                  {tl(n.name, locale)} ({n.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <GoldDivider className="mb-8" />

        {/* Main content: Grid + Panel */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Grid */}
          <div className="flex-shrink-0">
            <div className="mx-auto w-fit">
              {/* 9x9 Grid */}
              <div className="grid grid-cols-9 gap-[2px] sm:gap-1">
                {SBC_GRID.flat().map((cell) => (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    className={getCellClasses(cell)}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={getTooltipContent(cell)}
                    style={{ minWidth: '48px', minHeight: '44px' }}
                  >
                    <span className="leading-tight px-0.5 overflow-hidden text-ellipsis">
                      {getCellLabel(cell)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hover info bar */}
              <div className="mt-3 h-8 rounded-lg bg-bg-secondary/50 border border-gold-primary/10 px-3 flex items-center justify-center text-xs text-text-secondary">
                {hoveredCell ? (
                  <span className="text-text-primary">
                    {getTooltipContent(hoveredCell)}
                    <span className="text-text-secondary ml-2">
                      [{hoveredCell.row},{hoveredCell.col}] {hoveredCell.type}
                    </span>
                  </span>
                ) : (
                  <span>{l('hoverHint')}</span>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 rounded-lg bg-bg-secondary/30 border border-gold-primary/10 p-3">
                <h3 className="mb-2 text-xs font-semibold text-gold-light uppercase tracking-wider">
                  {l('legend')}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
                  {LEGEND_ITEMS.map((item) => (
                    <div key={item.key} className="flex items-center gap-1.5">
                      <div className={`h-3 w-3 rounded-sm border ${item.bg} ${item.border}`} />
                      <span className="text-[10px] text-text-secondary">{l(item.key)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vedha Panel */}
          <div className="flex-1 min-w-0">
            {!analysis ? (
              <div className="flex h-64 items-center justify-center rounded-xl border border-gold-primary/10 bg-bg-secondary/30">
                <p className="text-text-secondary text-sm">{l('noTransits')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Gantt Chart — Calendar Timeline */}
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6">
                  <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-1 font-bold">
                    {locale === 'hi' ? 'गोचर समयरेखा' : 'Transit Timeline'}
                  </h2>
                  <p className="text-[11px] text-text-secondary/60 mb-4">
                    {locale === 'hi'
                      ? 'प्रत्येक ग्रह वर्तमान नक्षत्र में कब से कब तक रहेगा। चमकीले बार आपके जन्म नक्षत्र पर वेध करते हैं।'
                      : 'Each bar shows when a planet enters and exits its current nakshatra. Bright bars = vedha on your birth nakshatra.'}
                  </p>
                  {(() => {
                    const now = new Date();
                    // Compute timeline bounds: 30 days before → 60 days after today
                    // But extend if slow planets go further
                    const allExits = currentTransits.map(t => t.exitDate.getTime());
                    const allEntries = currentTransits.map(t => t.entryDate.getTime());
                    const timelineStart = new Date(Math.min(now.getTime() - 30 * 86400000, ...allEntries));
                    const timelineEnd = new Date(Math.max(now.getTime() + 60 * 86400000, ...allExits));
                    const totalMs = timelineEnd.getTime() - timelineStart.getTime();
                    const toPercent = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - timelineStart.getTime()) / totalMs) * 100));
                    const todayPct = toPercent(now);

                    // Sort by duration (longest first)
                    const sorted = [...currentTransits].sort((a, b) =>
                      (b.exitDate.getTime() - b.entryDate.getTime()) - (a.exitDate.getTime() - a.entryDate.getTime())
                    );

                    const formatDate = (d: Date) => d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-GB', { day: 'numeric', month: 'short' });

                    // Month markers
                    const months: { label: string; pct: number }[] = [];
                    const mCursor = new Date(timelineStart);
                    mCursor.setDate(1);
                    mCursor.setMonth(mCursor.getMonth() + 1);
                    while (mCursor < timelineEnd) {
                      months.push({
                        label: mCursor.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
                        pct: toPercent(mCursor),
                      });
                      mCursor.setMonth(mCursor.getMonth() + 1);
                    }

                    return (
                      <div className="relative">
                        {/* Month labels */}
                        <div className="relative h-5 mb-1">
                          {months.map((m, i) => (
                            <span key={i} className="absolute text-[9px] text-text-secondary/40 -translate-x-1/2" style={{ left: `${m.pct}%` }}>
                              {m.label}
                            </span>
                          ))}
                        </div>

                        {/* Bars */}
                        <div className="space-y-1.5">
                          {sorted.map(t => {
                            const tv = analysis.transitVedhas.find(v => v.planetId === t.planetId);
                            const isBenefic = tv?.isBenefic ?? false;
                            const struck = tv ? birthIsStruck(tv) : false;
                            const graha = GRAHAS.find(g => g.id === t.planetId);
                            const leftPct = toPercent(t.entryDate);
                            const rightPct = toPercent(t.exitDate);
                            const widthPct = Math.max(1, rightPct - leftPct);

                            return (
                              <div key={t.planetId} className="flex items-center gap-1.5">
                                <div className="w-14 sm:w-18 shrink-0 text-right">
                                  <span className="text-[10px] sm:text-xs font-medium" style={{ color: graha?.color }}>
                                    {graha?.symbol} {tl(tv?.planetName ?? { en: '' }, locale)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 relative h-5">
                                  {/* Today marker */}
                                  <div className="absolute top-0 bottom-0 w-px bg-gold-primary/30" style={{ left: `${todayPct}%` }} />
                                  {/* Bar */}
                                  <div
                                    className={`absolute top-0 h-full rounded-sm flex items-center justify-center overflow-hidden ${
                                      isBenefic
                                        ? struck ? 'bg-emerald-500/50 border border-emerald-400/60' : 'bg-emerald-500/15 border border-emerald-400/15'
                                        : struck ? 'bg-red-500/50 border border-red-400/60' : 'bg-red-500/15 border border-red-400/15'
                                    }`}
                                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                    title={`${formatDate(t.entryDate)} — ${formatDate(t.exitDate)}${t.isRetrograde ? ' (R)' : ''}`}
                                  >
                                    {widthPct > 8 && (
                                      <span className={`text-[8px] sm:text-[9px] font-medium truncate px-1 ${
                                        isBenefic ? 'text-emerald-300' : 'text-red-300'
                                      } ${struck ? 'opacity-100' : 'opacity-60'}`}>
                                        {formatDate(t.entryDate)}–{formatDate(t.exitDate)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {struck && (
                                  <span className={`text-[9px] shrink-0 ${isBenefic ? 'text-emerald-400' : 'text-red-400'}`}>●</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Today line label */}
                        <div className="relative h-4 mt-1">
                          <span className="absolute text-[9px] text-gold-primary/60 -translate-x-1/2" style={{ left: `${todayPct}%` }}>
                            {locale === 'hi' ? 'आज' : 'Today'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-text-secondary/50">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500/40" /> {locale === 'hi' ? 'शुभ' : 'Benefic'}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/40" /> {locale === 'hi' ? 'अशुभ' : 'Malefic'}</span>
                    <span className="flex items-center gap-1"><span className="text-gold-primary">●</span> {locale === 'hi' ? 'आपके नक्षत्र पर वेध' : 'Strikes your nak.'}</span>
                    <span className="flex items-center gap-1"><span className="w-px h-3 bg-gold-primary/30 inline-block" /> {locale === 'hi' ? 'आज' : 'Today'}</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Transit Vedha Details — full width, below the grid+timeline flex row */}
        {analysis && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gold-light">
                {l('transitVedha')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.transitVedhas.map((tv) => {
                  const planetName = tl(tv.planetName, locale);
                  const nakName = tl(tv.nakshatraName, locale);
                  const isStruck = birthIsStruck(tv);
                  const transit = currentTransits.find(t => t.planetId === tv.planetId);
                  const formatD = (d: Date) => d.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-GB', { day: 'numeric', month: 'short' });

                  return (
                    <div
                      key={tv.planetId}
                      className={`rounded-xl border p-4 ${
                        tv.isBenefic
                          ? 'border-emerald-400/20 bg-emerald-500/5'
                          : 'border-red-400/20 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg" style={{ color: GRAHAS.find(g => g.id === tv.planetId)?.color }}>
                            {GRAHAS.find(g => g.id === tv.planetId)?.symbol}
                          </span>
                          <div>
                            <span className="font-semibold text-text-primary text-sm">{planetName}</span>
                            <span className="text-text-secondary text-xs"> {l('in')} {nakName}</span>
                          </div>
                        </div>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          tv.isBenefic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tv.isBenefic ? l('benefic') : l('malefic')}
                        </span>
                      </div>

                      {transit && (
                        <p className="text-[11px] text-text-secondary/70 mb-1">
                          {formatD(transit.entryDate)} — {formatD(transit.exitDate)}
                          {transit.isRetrograde ? ' (℞)' : ''}
                          <span className="ml-1 text-text-secondary/40">({tv.transitDuration})</span>
                        </p>
                      )}

                      {isStruck && (
                        <div className={`mt-1 mb-1 flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium ${
                          tv.isBenefic ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                        }`}>
                          ● {l('yourNakshatra')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <GoldDivider />

            {/* Summary Panel */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gold-light">{l('summary')}</h2>

              <div className="mb-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                <h3 className="mb-1 text-xs font-semibold text-gold-light uppercase tracking-wider">{l('overallAssessment')}</h3>
                <p className="text-sm text-text-primary leading-relaxed">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/5 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">{l('favorableDays')}</h3>
                  {analysis.favorableDays.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.favorableDays.map(d => (
                        <span key={d} className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">{tl(WEEKDAY_NAMES[d], locale)}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-secondary">{l('noneThisPeriod')}</p>
                  )}
                </div>
                <div className="rounded-xl border border-red-400/15 bg-red-500/5 p-4">
                  <h3 className="mb-2 text-xs font-semibold text-red-400 uppercase tracking-wider">{l('unfavorableDays')}</h3>
                  {analysis.unfavorableDays.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.unfavorableDays.map(d => (
                        <span key={d} className="rounded bg-red-500/10 px-2.5 py-1 text-xs text-red-300">{tl(WEEKDAY_NAMES[d], locale)}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-secondary">{l('noneThisPeriod')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

