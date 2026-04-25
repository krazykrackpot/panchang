'use client';

import React, { useState, useCallback } from 'react';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import { normalizeShadbala } from '@/lib/kundali/shadbala-normalize';
import type { Locale, LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import ShadbalaRadarDetail from './ShadbalaRadarDetail';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLANET_COLORS: Record<number, string> = {
  0: '#FF6B35', // Sun
  1: '#C0C0C0', // Moon
  2: '#DC143C', // Mars
  3: '#50C878', // Mercury
  4: '#FFD700', // Jupiter
  5: '#FF69B4', // Venus
  6: '#4169E1', // Saturn
};

const PLANET_LABELS: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુక્ར' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શನਿ' },
};

type AxisKey = 'sthanaBala' | 'digBala' | 'kalaBala' | 'cheshtaBala' | 'naisargikaBala' | 'drikBala';

interface AxisDef {
  key: AxisKey;
  label: LocaleText;
  description: LocaleText;
}

const AXES: AxisDef[] = [
  {
    key: 'sthanaBala',
    label: { en: 'Sthana', hi: 'स्थान', sa: 'स्थान', mai: 'स्थान', mr: 'स्थान', ta: 'ஸ்தான', te: 'స్థాన', bn: 'স্থান', kn: 'ಸ್ಥಾನ', gu: 'સ્થાન' },
    description: { en: 'Positional strength — exaltation, own sign, vargas', hi: 'स्थानीय बल — उच्च, स्वराशि, वर्ग', sa: 'स्थानबलम् — उच्च, स्वराशि, वर्ग', mai: 'स्थान बल — उच्च, स्वराशि, वर्ग', mr: 'स्थान बल — उच्च, स्वराशि, वर्ग', ta: 'நிலை வலிமை — உச்சம், சொந்த ராசி', te: 'స్థాన బలం — ఉచ్చం, స్వరాశి', bn: 'স্থান বল — উচ্চ, স্বরাশি', kn: 'ಸ್ಥಾನ ಬಲ — ಉಚ್ಚ, ಸ್ವರಾಶಿ', gu: 'સ્થાન બળ — ઉચ્ચ, સ્વ રાશિ' },
  },
  {
    key: 'digBala',
    label: { en: 'Dig', hi: 'दिक्', sa: 'दिक्', mai: 'दिक्', mr: 'दिग्', ta: 'திக்', te: 'దిక్', bn: 'দিক্', kn: 'ದಿಕ್', gu: 'દિક્' },
    description: { en: 'Directional strength — power in a specific house direction', hi: 'दिग्बल — दिशा अनुसार बल', sa: 'दिग्बलम् — भाव दिशाबलम्', mai: 'दिग बल — दिशा के अनुसार बल', mr: 'दिग्बल — दिशेनुसार बल', ta: 'திக்பலம் — திசை வலிமை', te: 'దిక్ బలం — దిశా శక్తి', bn: 'দিকবল — দিক শক্তি', kn: 'ದಿಕ್ ಬಲ — ದಿಕ್ ಶಕ್ತಿ', gu: 'દિગ્બળ — દિશા શક્તિ' },
  },
  {
    key: 'kalaBala',
    label: { en: 'Kāla', hi: 'काल', sa: 'काल', mai: 'काल', mr: 'काल', ta: 'கால', te: 'కాల', bn: 'কাল', kn: 'ಕಾಲ', gu: 'કાળ' },
    description: { en: 'Temporal strength — birth time, day/night, paksha, hora', hi: 'कालबल — जन्म समय, दिन/रात, पक्ष, होरा', sa: 'कालबलम् — जन्मकालः, दिन/रात्रि', mai: 'काल बल — जन्म समय, पक्ष, होरा', mr: 'काल बल — जन्म वेळ, पक्ष, होरा', ta: 'காலபலம் — பக்ஷம், ஹோரா', te: 'కాలబలం — జన్మ సమయం, పక్షం', bn: 'কালবল — জন্ম সময়, পক্ষ', kn: 'ಕಾಲ ಬಲ — ಜನ್ಮ ಸಮಯ, ಪಕ್ಷ', gu: 'કાળ બળ — જન્મ સમય, પક્ષ' },
  },
  {
    key: 'cheshtaBala',
    label: { en: 'Cheshta', hi: 'चेष्टा', sa: 'चेष्टा', mai: 'चेष्टा', mr: 'चेष्टा', ta: 'சேஷ்டா', te: 'చేష్ట', bn: 'চেষ্টা', kn: 'ಚೇಷ್ಟಾ', gu: 'ચેષ્ટા' },
    description: { en: 'Motional strength — direct vs retrograde, speed relative to mean', hi: 'चेष्टाबल — वक्री/मार्गी, औसत गति', sa: 'चेष्टाबलम् — वक्री/मार्गी गतिः', mai: 'चेष्टा बल — वक्री/मार्गी, गति', mr: 'चेष्टा बल — वक्री/मार्गी, वेग', ta: 'சேஷ்டா பலம் — வக்ர/நேர்', te: 'చేష్ట బలం — వక్ర/సరళ', bn: 'চেষ্টা বল — বক্র/সরল', kn: 'ಚೇಷ್ಟಾ ಬಲ — ವಕ್ರ/ಮಾರ್ಗ', gu: 'ચેષ્ટા બળ — વક્ર/સરળ' },
  },
  {
    key: 'naisargikaBala',
    label: { en: 'Naisargika', hi: 'नैसर्गिक', sa: 'नैसर्गिक', mai: 'नैसर्गिक', mr: 'नैसर्गिक', ta: 'நைசர்கிக', te: 'నైసర్గిక', bn: 'নৈসর্গিক', kn: 'ನೈಸರ್ಗಿಕ', gu: 'નૈસર્ગિક' },
    description: { en: 'Natural strength — fixed by nature: Sun highest, Saturn lowest', hi: 'नैसर्गिक बल — स्थायी: सूर्य श्रेष्ठ, शनि निम्न', sa: 'नैसर्गिकबलम् — स्थिरम्: सूर्यः श्रेष्ठः', mai: 'नैसर्गिक बल — स्थिर: सूर्य सर्वश्रेष्ठ', mr: 'नैसर्गिक बल — स्थिर: सूर्य श्रेष्ठ', ta: 'நைசர்கிக பலம் — சூரியன் அதிகம்', te: 'నైసర్గిక బలం — సూర్యుడు అధికం', bn: 'নৈসর্গিক বল — সূর্য সর্বোচ্চ', kn: 'ನೈಸರ್ಗಿಕ ಬಲ — ಸೂರ್ಯ ಶ್ರೇಷ್ಠ', gu: 'નૈસર્ગિક બળ — સૂર્ય સર્વશ્રેષ્ઠ' },
  },
  {
    key: 'drikBala',
    label: { en: 'Drik', hi: 'दृक्', sa: 'दृक्', mai: 'दृक्', mr: 'दृक्', ta: 'திருஷ்டி', te: 'దృక్', bn: 'দৃক্', kn: 'ದೃಕ್', gu: 'દૃક્' },
    description: { en: 'Aspectual strength — net gain/loss from planetary aspects received', hi: 'दृक्बल — ग्रहीय दृष्टि से प्राप्त/खोया बल', sa: 'दृक्बलम् — ग्रहदृष्टिजनित बलम्', mai: 'दृक बल — ग्रह दृष्टि से बल', mr: 'दृक्बल — ग्रह दृष्टींमुळे बल', ta: 'திருஷ்டி பலம் — கிரக பார்வை', te: 'దృక్ బలం — గ్రహ దృష్టి', bn: 'দৃক্ বল — গ্রহ দৃষ্টি', kn: 'ದೃಕ್ ಬಲ — ಗ್ರಹ ದೃಷ್ಟಿ', gu: 'દૃક્ બળ — ગ્રહ દૃષ્ટિ' },
  },
];

// ---------------------------------------------------------------------------
// Radar math helpers
// ---------------------------------------------------------------------------

const SVG_SIZE = 300;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const RADIUS = 110;
const LEVELS = 4;
const AXIS_COUNT = AXES.length;

function angleForAxis(i: number): number {
  // Start from the top (-90°), go clockwise
  return (2 * Math.PI * i) / AXIS_COUNT - Math.PI / 2;
}

function polarToCartesian(r: number, angleDeg: number): { x: number; y: number } {
  return {
    x: CX + r * Math.cos(angleDeg),
    y: CY + r * Math.sin(angleDeg),
  };
}

function polygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const r = (v / 100) * RADIUS;
      const pt = polarToCartesian(r, angleForAxis(i));
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ShadbalaRadarProps {
  shadbala: ShadBalaComplete[];
  locale: Locale;
}

export default function ShadbalaRadar({ shadbala, locale }: ShadbalaRadarProps) {
  const normalized = normalizeShadbala(shadbala);

  // Default: top 3 by strengthRatio
  const defaultVisible = [...shadbala]
    .sort((a, b) => b.strengthRatio - a.strengthRatio)
    .slice(0, 3)
    .map(p => p.planetId);

  const [visible, setVisible] = useState<Set<number>>(new Set(defaultVisible));
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);

  const togglePlanet = useCallback((id: number) => {
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleAxisClick = useCallback((key: string) => {
    setSelectedAxis(prev => (prev === key ? null : key));
  }, []);

  const hoveredAxisDef = AXES.find(a => a.key === hoveredAxis);

  return (
    <div className="flex flex-col gap-4">
      {/* Planet toggle buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {normalized.map(planet => {
          const color = PLANET_COLORS[planet.planetId] ?? '#d4a853';
          const isOn = visible.has(planet.planetId);
          return (
            <button
              key={planet.planetId}
              onClick={() => togglePlanet(planet.planetId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm font-medium"
              style={{
                borderColor: isOn ? color : '#8a6d2b',
                backgroundColor: isOn ? `${color}22` : 'transparent',
                color: isOn ? color : '#8a8478',
              }}
              aria-pressed={isOn}
            >
              <GrahaIconById id={planet.planetId} size={16} />
              <span>{tl(PLANET_LABELS[planet.planetId], locale)}</span>
            </button>
          );
        })}
      </div>

      {/* Radar SVG */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full max-w-[400px] sm:max-w-[450px]"
          aria-label="Shadbala radar chart"
        >
          {/* Concentric grid levels */}
          {Array.from({ length: LEVELS }, (_, li) => {
            const r = ((li + 1) / LEVELS) * RADIUS;
            const pts = AXES.map((_, i) => {
              const pt = polarToCartesian(r, angleForAxis(i));
              return `${pt.x},${pt.y}`;
            }).join(' ');
            return (
              <polygon
                key={li}
                points={pts}
                fill="none"
                stroke="#8a6d2b"
                strokeOpacity={0.3}
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {AXES.map((axis, i) => {
            const outer = polarToCartesian(RADIUS, angleForAxis(i));
            return (
              <line
                key={axis.key}
                x1={CX}
                y1={CY}
                x2={outer.x}
                y2={outer.y}
                stroke="#8a6d2b"
                strokeOpacity={0.3}
                strokeWidth={1}
              />
            );
          })}

          {/* Planet polygons */}
          {normalized
            .filter(p => visible.has(p.planetId))
            .map(planet => {
              const color = PLANET_COLORS[planet.planetId] ?? '#d4a853';
              const vals = AXES.map(a => planet[a.key]);
              return (
                <g key={planet.planetId}>
                  <polygon
                    points={polygonPoints(vals)}
                    fill={color}
                    fillOpacity={0.12}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.9}
                  />
                  {/* Vertex dots */}
                  {vals.map((v, i) => {
                    const r = (v / 100) * RADIUS;
                    const pt = polarToCartesian(r, angleForAxis(i));
                    return (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={3}
                        fill={color}
                        fillOpacity={0.9}
                      />
                    );
                  })}
                </g>
              );
            })}

          {/* Axis labels — clickable */}
          {AXES.map((axis, i) => {
            const angle = angleForAxis(i);
            const labelR = RADIUS + 22;
            const pt = polarToCartesian(labelR, angle);
            const isSelected = selectedAxis === axis.key;
            const isHovered = hoveredAxis === axis.key;

            return (
              <text
                key={axis.key}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={isSelected ? 700 : 400}
                fill={isSelected || isHovered ? '#f0d48a' : '#d4a853'}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleAxisClick(axis.key)}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                {tl(axis.label, locale)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Hovered axis description */}
      {hoveredAxisDef && !selectedAxis && (
        <p className="text-center text-xs text-text-secondary px-4">
          {tl(hoveredAxisDef.description, locale)}
        </p>
      )}

      {/* Drill-down panel */}
      {selectedAxis && (
        <ShadbalaRadarDetail
          selectedAxis={selectedAxis}
          shadbala={shadbala}
          locale={locale}
        />
      )}
    </div>
  );
}
