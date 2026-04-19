'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { generateSudarshana, type RingData } from '@/lib/kundali/sudarshana';
import type { DetailedRingAnalysis } from '@/lib/kundali/sudarshana-interpretation';
import type { KundaliData } from '@/types/kundali';

interface SudarshanaTabProps {
  kundali: KundaliData;
  locale: string;
}

// Sign abbreviations for the SVG (English only for compactness)
const SIGN_ABBR: Record<number, string> = {
  1: 'Ar', 2: 'Ta', 3: 'Ge', 4: 'Ca', 5: 'Le', 6: 'Vi',
  7: 'Li', 8: 'Sc', 9: 'Sg', 10: 'Cp', 11: 'Aq', 12: 'Pi',
};

// Ring configuration
const OUTER_R = 195;
const MID_R = 145;
const INNER_R = 95;
const CENTER_R = 45;

const SVG_SIZE = 440;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;

export default function SudarshanaTab({ kundali, locale }: SudarshanaTabProps) {
  const isTamil = locale === 'ta';
  const isEn = locale === 'en' || isTamil;

  // Calculate current age from birth date
  const birthYear = parseInt(kundali.birthData.date.slice(0, 4), 10);
  const now = new Date();
  const defaultAge = Math.max(1, Math.min(120, now.getFullYear() - birthYear));

  const [age, setAge] = useState(defaultAge);

  const data = useMemo(
    () => generateSudarshana(kundali, age),
    [kundali, age],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-light mb-2">
          {isEn ? 'Sudarshana Chakra' : 'सुदर्शन चक्र'}
        </h2>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          {isEn
            ? 'Triple-reference annual chart. Three concentric rings show activated houses from Lagna, Moon, and Sun simultaneously for each year of life.'
            : 'तीन संकेन्द्रित वलय लग्न, चन्द्र एवं सूर्य से प्रत्येक वर्ष के सक्रिय भावों को एक साथ दर्शाते हैं।'}
        </p>
      </div>

      {/* Age slider */}
      <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">{isEn ? 'Age' : 'आयु'}</span>
          <span className="text-gold-light font-bold text-lg">{age}</span>
          <span className="text-text-secondary text-xs">
            {isEn ? `Year ${data.birthYear + age}` : `वर्ष ${data.birthYear + age}`}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={120}
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full accent-gold-primary h-2 rounded-full appearance-none bg-white/5 cursor-pointer"
          aria-label={isEn ? 'Select age' : 'आयु चुनें'}
        />
        <div className="flex justify-between text-[10px] text-text-secondary/40 mt-1">
          <span>1</span>
          <span>30</span>
          <span>60</span>
          <span>90</span>
          <span>120</span>
        </div>
      </div>

      {/* SVG Chakra */}
      <div className="flex justify-center">
        <div className="overflow-x-auto max-w-full">
          <SudarshanaChakra
            lagnaRing={data.lagnaRing}
            chandraRing={data.chandraRing}
            suryaRing={data.suryaRing}
            locale={locale}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(212, 168, 83, 0.7)' }} />
          <span>{isEn ? 'Lagna (outer)' : 'लग्न (बाहरी)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(236, 240, 241, 0.5)' }} />
          <span>{isEn ? 'Chandra (middle)' : 'चन्द्र (मध्य)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(230, 126, 34, 0.6)' }} />
          <span>{isEn ? 'Surya (inner)' : 'सूर्य (आन्तर)'}</span>
        </div>
      </div>

      {/* Educational context */}
      <details className="bg-white/[0.02] border border-gold-primary/10 rounded-xl group">
        <summary className="px-5 py-3 cursor-pointer text-sm text-gold-primary hover:text-gold-light transition-colors flex items-center gap-2">
          <span className="text-base">📖</span>
          {isEn ? 'What is Sudarshana Chakra?' : 'सुदर्शन चक्र क्या है?'}
          <span className="ml-auto text-text-secondary/40 text-xs group-open:rotate-90 transition-transform">▶</span>
        </summary>
        <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
          {data.educationalNote}
        </p>
      </details>

      {/* Convergence insight */}
      {data.interpretation.convergenceNote && (
        <div className="bg-gradient-to-r from-purple-500/10 via-gold-primary/10 to-purple-500/10 border border-gold-primary/20 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-2">
            {isEn ? 'Convergence Insight' : 'अभिसरण विश्लेषण'}
          </h3>
          <p className="text-sm text-text-primary/85 leading-relaxed">
            {data.interpretation.convergenceNote}
          </p>
        </div>
      )}

      {/* Detailed ring analysis */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6 space-y-4">
        <h3 className="text-gold-light font-semibold">
          {isEn ? `Age ${age} — Annual Analysis` : `आयु ${age} — वार्षिक विश्लेषण`}
        </h3>

        <DetailedRingSection
          ring={data.interpretation.lagna}
          label={isEn ? 'From Lagna (Ascendant)' : 'लग्न से'}
          color="rgba(212, 168, 83, 0.6)"
          isEn={isEn}
          locale={locale}
        />
        <DetailedRingSection
          ring={data.interpretation.chandra}
          label={isEn ? 'From Chandra (Moon)' : 'चन्द्र से'}
          color="rgba(236, 240, 241, 0.5)"
          isEn={isEn}
          locale={locale}
        />
        <DetailedRingSection
          ring={data.interpretation.surya}
          label={isEn ? 'From Surya (Sun)' : 'सूर्य से'}
          color="rgba(230, 126, 34, 0.6)"
          isEn={isEn}
          locale={locale}
        />
      </div>

      {/* Focus areas */}
      {data.interpretation.focusAreas.length > 0 && (
        <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-3">
            {isEn ? 'Focus Areas This Year' : 'इस वर्ष के प्रमुख क्षेत्र'}
          </h3>
          <ul className="space-y-2">
            {data.interpretation.focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary/80">
                <span className="text-gold-primary mt-0.5 shrink-0">●</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cycle & life stage context */}
      <div className="bg-gradient-to-r from-purple-500/8 to-blue-500/8 border border-purple-400/15 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-sm mb-2">
          {isEn
            ? `Life Stage: ${data.interpretation.cycleContext.lifeStage} (Cycle ${data.interpretation.cycleContext.cycleNumber})`
            : `जीवन चरण: ${data.interpretation.cycleContext.lifeStage} (चक्र ${data.interpretation.cycleContext.cycleNumber})`}
        </h3>
        <p className="text-sm text-text-secondary/85 leading-relaxed">
          {data.interpretation.cycleContext.cycleTheme}
        </p>
      </div>

      {/* Vimshottari Dasha overlay */}
      {data.interpretation.dashaContext && (
        <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-2">
            {isEn ? 'Running Dasha Influence' : 'वर्तमान दशा प्रभाव'}
            <span className="ml-2 text-xs text-text-secondary font-normal">
              {data.interpretation.dashaContext.mahadasha}
              {data.interpretation.dashaContext.antardasha && `–${data.interpretation.dashaContext.antardasha}`}
            </span>
          </h3>
          <p className="text-sm text-text-secondary/85 leading-relaxed">
            {data.interpretation.dashaContext.dashaInfluence}
          </p>
        </div>
      )}

      {/* Monthly sub-periods */}
      <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-sm mb-3">
          {isEn ? 'Monthly Sub-Periods (from Lagna)' : 'मासिक उप-अवधि (लग्न से)'}
        </h3>
        <p className="text-xs text-text-secondary/60 mb-3">
          {isEn
            ? 'Each year divides into 12 monthly sub-periods, each ruled by the next sign from the activated house. The sub-lord colors that month\'s specific themes.'
            : 'प्रत्येक वर्ष 12 मासिक उप-अवधियों में विभाजित होता है, प्रत्येक सक्रिय भाव से अगली राशि द्वारा शासित।'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {data.interpretation.monthlySubPeriods.map(sp => (
            <div
              key={sp.month}
              className="bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-2 text-center hover:border-gold-primary/20 transition-colors"
            >
              <div className="text-[10px] text-text-secondary/50 mb-0.5">
                {isEn ? `Month ${sp.month}` : `मास ${sp.month}`}
              </div>
              <div className="text-xs text-text-primary font-medium">
                {tl(sp.signName, locale)}
              </div>
              <div className="text-[10px] text-gold-primary/70 mt-0.5">
                {sp.lordPlanetName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year comparison */}
      {data.interpretation.yearDelta && age > 1 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <h3 className="text-text-secondary font-semibold text-sm mb-2">
            {isEn ? 'Compared to Last Year' : 'पिछले वर्ष की तुलना में'}
          </h3>
          <p className="text-sm text-text-secondary/80 leading-relaxed">
            {data.interpretation.yearDelta}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Detailed ring section (replaces old InterpretationCard) ───────────────

function DetailedRingSection({
  ring,
  label,
  color,
  isEn,
  locale,
}: {
  ring: DetailedRingAnalysis;
  label: string;
  color: string;
  isEn: boolean;
  locale: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{label}</span>
            <span className="text-xs text-text-secondary">
              → {isEn ? `${ordinal(ring.house)} house` : `${ring.house} भाव`} ({tl(ring.signName, locale)})
            </span>
          </div>
          <p className="text-xs text-text-secondary/70 mt-0.5">{ring.theme}</p>
        </div>
        <span className={`text-text-secondary/40 text-xs mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {/* Detailed house theme */}
          <p className="text-sm text-text-primary/85 leading-relaxed">
            {ring.detailedTheme}
          </p>

          {/* Lord analysis */}
          <div className="bg-white/[0.02] rounded-lg px-3 py-2.5">
            <p className="text-xs text-gold-primary/80 font-medium mb-1">
              {isEn ? `Sign Lord: ${ring.lordPlanetName}` : `राशि स्वामी: ${ring.lordPlanetName}`}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {ring.lordAnalysis}
            </p>
          </div>

          {/* Planets in activated house */}
          {ring.planetsPresent.length > 0 && (
            <div>
              <p className="text-xs text-text-secondary/60 font-medium mb-1.5">
                {isEn
                  ? `Planets in ${tl(ring.signName, locale)}:`
                  : `${tl(ring.signName, locale)} में ग्रह:`}
              </p>
              <div className="space-y-1.5">
                {ring.planetsPresent.map(p => (
                  <div key={p.id} className="flex gap-2 text-xs">
                    <span className="text-gold-light font-medium shrink-0 w-16">{p.name}</span>
                    <span className="text-text-secondary/70">{p.brief}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {ring.planetsPresent.length === 0 && (
            <p className="text-xs text-text-secondary/50 italic">
              {isEn ? 'No planets occupy this sign — themes are shaped primarily by the sign lord.' : 'इस राशि में कोई ग्रह नहीं — विषय मुख्यतः राशि स्वामी द्वारा निर्धारित।'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SVG Sudarshana Chakra ──────────────────────────────────────────────────

function SudarshanaChakra({
  lagnaRing,
  chandraRing,
  suryaRing,
  locale,
}: {
  lagnaRing: RingData;
  chandraRing: RingData;
  suryaRing: RingData;
  locale: string;
}) {
  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="max-w-full h-auto"
    >
      <defs>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx={CX} cy={CY} r={OUTER_R + 10} fill="rgba(10, 14, 39, 0.3)" />

      {/* Ring borders */}
      <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(212, 168, 83, 0.3)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={MID_R} fill="none" stroke="rgba(236, 240, 241, 0.2)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(230, 126, 34, 0.25)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={CENTER_R} fill="none" stroke="rgba(212, 168, 83, 0.15)" strokeWidth={1} />

      {/* Segment divider lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x2 = CX + OUTER_R * Math.cos(angle);
        const y2 = CY + OUTER_R * Math.sin(angle);
        const x1 = CX + CENTER_R * Math.cos(angle);
        const y1 = CY + CENTER_R * Math.sin(angle);
        return (
          <line
            key={`div-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(212, 168, 83, 0.12)"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Highlighted segments (active houses) */}
      <HighlightSegment index={lagnaRing.activatedIndex} outerR={OUTER_R} innerR={MID_R} color="rgba(212, 168, 83, 0.12)" />
      <HighlightSegment index={chandraRing.activatedIndex} outerR={MID_R} innerR={INNER_R} color="rgba(236, 240, 241, 0.08)" />
      <HighlightSegment index={suryaRing.activatedIndex} outerR={INNER_R} innerR={CENTER_R} color="rgba(230, 126, 34, 0.1)" />

      {/* Ring labels and planets */}
      <RingLabels ring={lagnaRing} outerR={OUTER_R} innerR={MID_R} color="rgba(212, 168, 83, 0.7)" locale={locale} />
      <RingLabels ring={chandraRing} outerR={MID_R} innerR={INNER_R} color="rgba(236, 240, 241, 0.55)" locale={locale} />
      <RingLabels ring={suryaRing} outerR={INNER_R} innerR={CENTER_R} color="rgba(230, 126, 34, 0.6)" locale={locale} />

      {/* Center label */}
      <text x={CX} y={CY - 6} textAnchor="middle" fill="rgba(212, 168, 83, 0.5)" fontSize={9} fontWeight="bold">
        SUDARSHANA
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fill="rgba(212, 168, 83, 0.35)" fontSize={7}>
        CHAKRA
      </text>
    </svg>
  );
}

// ─── Highlight a segment (pie slice) ────────────────────────────────────────

function HighlightSegment({
  index,
  outerR,
  innerR,
  color,
}: {
  index: number;
  outerR: number;
  innerR: number;
  color: string;
}) {
  const startAngle = (index * 30 - 90) * (Math.PI / 180);
  const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

  const outerX1 = CX + outerR * Math.cos(startAngle);
  const outerY1 = CY + outerR * Math.sin(startAngle);
  const outerX2 = CX + outerR * Math.cos(endAngle);
  const outerY2 = CY + outerR * Math.sin(endAngle);
  const innerX1 = CX + innerR * Math.cos(endAngle);
  const innerY1 = CY + innerR * Math.sin(endAngle);
  const innerX2 = CX + innerR * Math.cos(startAngle);
  const innerY2 = CY + innerR * Math.sin(startAngle);

  const d = [
    `M ${outerX1} ${outerY1}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerX2} ${outerY2}`,
    `L ${innerX1} ${innerY1}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerX2} ${innerY2}`,
    'Z',
  ].join(' ');

  return <path d={d} fill={color} />;
}

// ─── Ring labels (sign abbreviations + planet glyphs) ───────────────────────

function RingLabels({
  ring,
  outerR,
  innerR,
  color,
  locale,
}: {
  ring: RingData;
  outerR: number;
  innerR: number;
  color: string;
  locale: string;
}) {
  const midR = (outerR + innerR) / 2;
  const isActive = (i: number) => i === ring.activatedIndex;

  return (
    <g>
      {ring.segments.map((seg, i) => {
        const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);
        const labelR = midR + 2; // slightly outward for sign name
        const planetR = midR - 8; // slightly inward for planet glyphs
        const x = CX + labelR * Math.cos(midAngle);
        const y = CY + labelR * Math.sin(midAngle);
        const px = CX + planetR * Math.cos(midAngle);
        const py = CY + planetR * Math.sin(midAngle);
        const active = isActive(i);

        return (
          <g key={`${ring.label}-${i}`}>
            {/* Sign abbreviation */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={active ? '#f0d48a' : color}
              fontSize={active ? 9 : 7.5}
              fontWeight={active ? 'bold' : 'normal'}
              filter={active ? 'url(#glow-gold)' : undefined}
            >
              {SIGN_ABBR[seg.signId] ?? '?'}
            </text>
            {/* Planet glyphs */}
            {seg.planets.length > 0 && (
              <text
                x={px}
                y={py + (outerR - innerR > 60 ? 0 : 2)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active ? '#e6e2d8' : 'rgba(230, 226, 216, 0.4)'}
                fontSize={6}
              >
                {seg.planets.map(p => p.abbr).join(' ')}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ─── Ordinal helper ─────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
