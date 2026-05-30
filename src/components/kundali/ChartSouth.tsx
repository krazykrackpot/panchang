'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { ChartData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { getPlanetDignity, type DignityState } from '@/lib/tippanni/dignity';
import { isParamaUchcha } from '@/lib/constants/dignities';
import { getPlanetAspects } from '@/lib/kundali/graha-drishti';
import { DrishtiOverlay } from './DrishtiOverlay';

interface ChartSouthProps {
  data: ChartData;
  title: string;
  size?: number;
  selectedHouse?: number | null;
  onSelectHouse?: (house: number) => void;
  retrogradeIds?: Set<number>;
  combustIds?: Set<number>;
  transitData?: ChartData;
  /** Optional. See ChartNorthProps for the full contract — South chart
   *  mirrors the same opt-in: pass `planets` for dignity halos, pass
   *  `selectedPlanetId`/`onSelectPlanet` for the drishti overlay. */
  planets?: PlanetPosition[];
  selectedPlanetId?: number | null;
  onSelectPlanet?: (planetId: number | null) => void;
}

/** Mirror of the North chart's halo table — kept inline (not exported)
 *  so North/South each own their styling decisions, but the values
 *  agree. If we ever wanted to share, lift this into a tiny module
 *  alongside the spec doc. */
const DIGNITY_HALO: Record<DignityState | 'parama-ucha', { color: string; opacity: number; pulse: boolean }> = {
  'parama-ucha':  { color: '#fbbf24', opacity: 0.70, pulse: true },
  exalted:        { color: '#fbbf24', opacity: 0.55, pulse: true },
  moolatrikona:   { color: '#facc15', opacity: 0.45, pulse: true },
  own:            { color: '#a3e635', opacity: 0.35, pulse: false },
  friendly:       { color: '#86efac', opacity: 0.25, pulse: false },
  neutral:        { color: 'transparent', opacity: 0, pulse: false },
  enemy:          { color: '#fda4af', opacity: 0.25, pulse: false },
  debilitated:    { color: '#f87171', opacity: 0.50, pulse: true },
};

// South Indian chart: 4x4 outer ring with fixed sign positions
const GRID_CELLS: { col: number; row: number; sign: number }[] = [
  { col: 0, row: 0, sign: 12 },
  { col: 1, row: 0, sign: 1 },
  { col: 2, row: 0, sign: 2 },
  { col: 3, row: 0, sign: 3 },
  { col: 3, row: 1, sign: 4 },
  { col: 3, row: 2, sign: 5 },
  { col: 3, row: 3, sign: 6 },
  { col: 2, row: 3, sign: 7 },
  { col: 1, row: 3, sign: 8 },
  { col: 0, row: 3, sign: 9 },
  { col: 0, row: 2, sign: 10 },
  { col: 0, row: 1, sign: 11 },
];

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

const PLANET_ABBR: Record<number, Record<string, string>> = {
  0: { en: 'Su', hi: 'सू', sa: 'सू' },
  1: { en: 'Mo', hi: 'चं', sa: 'चं' },
  2: { en: 'Ma', hi: 'मं', sa: 'मं' },
  3: { en: 'Me', hi: 'बु', sa: 'बु' },
  4: { en: 'Ju', hi: 'गु', sa: 'गु' },
  5: { en: 'Ve', hi: 'शु', sa: 'शु' },
  6: { en: 'Sa', hi: 'श', sa: 'श' },
  7: { en: 'Ra', hi: 'रा', sa: 'रा' },
  8: { en: 'Ke', hi: 'के', sa: 'के' },
};

export default function ChartSouth({
  data, title, size = 500,
  selectedHouse, onSelectHouse,
  retrogradeIds, combustIds, transitData,
  planets, selectedPlanetId = null, onSelectPlanet,
}: ChartSouthProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const cell = 110;
  const pad = 20;

  const signToHouse = (sign: number): number => {
    return ((sign - data.ascendantSign + 12) % 12) + 1;
  };

  const getPlanetsInSign = (sign: number): number[] => {
    const house = signToHouse(sign);
    return data.houses[house - 1] || [];
  };

  const totalW = pad * 2 + cell * 4;

  // House-keyed path strings + centroids for the drishti overlay. Each
  // sign cell is a 110×110 box; the polygon traces the corners CW from
  // top-left. Centroid is the cell centre. Cells are ordered around the
  // outer ring, with houses derived from sign via `signToHouse`.
  const housePaths = useMemo<Record<number, string>>(() => {
    const out: Record<number, string> = {};
    for (const { col, row, sign } of GRID_CELLS) {
      const x = pad + col * cell;
      const y = pad + row * cell;
      const house = signToHouse(sign);
      out[house] = `M ${x} ${y} L ${x + cell} ${y} L ${x + cell} ${y + cell} L ${x} ${y + cell} Z`;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.ascendantSign]);

  const houseCentroids = useMemo<Record<number, [number, number]>>(() => {
    const out: Record<number, [number, number]> = {};
    for (const { col, row, sign } of GRID_CELLS) {
      const house = signToHouse(sign);
      out[house] = [pad + col * cell + cell / 2, pad + row * cell + cell / 2];
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.ascendantSign]);

  const dignityByPlanet = useMemo<Record<number, DignityState>>(() => {
    if (!planets) return {};
    const out: Record<number, DignityState> = {};
    for (const p of planets) {
      out[p.planet.id] = getPlanetDignity(p.planet.id, p.sign, parseFloat(p.degree) || 0);
    }
    return out;
  }, [planets]);

  const paramaUchchaIds = useMemo<Set<number>>(() => {
    if (!planets) return new Set();
    const out = new Set<number>();
    for (const p of planets) {
      if (isParamaUchcha(p.planet.id, p.sign, parseFloat(p.degree) || 0)) {
        out.add(p.planet.id);
      }
    }
    return out;
  }, [planets]);

  const planetHouseMap = useMemo<Record<number, number>>(() => {
    if (!planets) return {};
    const out: Record<number, number> = {};
    for (const p of planets) out[p.planet.id] = p.house;
    return out;
  }, [planets]);

  const aspectedHouses = useMemo<number[]>(() => {
    if (selectedPlanetId == null) return [];
    const h = planetHouseMap[selectedPlanetId];
    if (!h) return [];
    return getPlanetAspects(selectedPlanetId, h);
  }, [selectedPlanetId, planetHouseMap]);

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (selectedPlanetId == null || !onSelectPlanet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelectPlanet(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPlanetId, onSelectPlanet]);

  const selectionAnnouncement = useMemo<string>(() => {
    if (selectedPlanetId == null || aspectedHouses.length === 0) return '';
    const planetName = GRAHAS[selectedPlanetId]?.name[locale] ?? GRAHAS[selectedPlanetId]?.name.en ?? '';
    return `${planetName} aspects houses ${aspectedHouses.join(', ')}.`;
  }, [selectedPlanetId, aspectedHouses, locale]);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <motion.svg
        viewBox={`0 0 ${totalW} ${totalW}`}
        role="img"
        aria-label="South Indian birth chart showing planets in 12 houses"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="drop-shadow-2xl w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]"
      >
        <defs>
          <radialGradient id="sBg" cx="50%" cy="50%" r="72%">
            <stop offset="0%" stopColor="#111638" />
            <stop offset="100%" stopColor="#080b1f" />
          </radialGradient>
          <linearGradient id="sGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a5e22" />
            <stop offset="30%" stopColor="#d4a853" />
            <stop offset="70%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#7a5e22" />
          </linearGradient>
          {/* No blur filter  –  crisp text */}
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={totalW} height={totalW} rx="12" fill="url(#sBg)" />

        {/* Double border */}
        <rect x={pad - 2} y={pad - 2} width={totalW - (pad - 2) * 2} height={totalW - (pad - 2) * 2} fill="none" stroke="url(#sGold)" strokeWidth="2" rx="4" />
        <rect x={pad + 2} y={pad + 2} width={totalW - (pad + 2) * 2} height={totalW - (pad + 2) * 2} fill="none" stroke="url(#sGold)" strokeWidth="0.4" opacity="0.4" rx="2" />

        {/* Grid lines */}
        {[1, 2, 3].map(i => (
          <g key={`grid-${i}`}>
            <line x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={totalW - pad} stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />
            <line x1={pad} y1={pad + i * cell} x2={totalW - pad} y2={pad + i * cell} stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />
          </g>
        ))}

        {/* Center area  –  classical label */}
        <rect x={pad + cell} y={pad + cell} width={cell * 2} height={cell * 2} fill="rgba(212,168,83,0.015)" stroke="rgba(212,168,83,0.08)" strokeWidth="0.5" />
        <text x={totalW / 2} y={totalW / 2 - 6} fill="rgba(212,168,83,0.15)" fontSize="12" textAnchor="middle" fontFamily="var(--font-heading)" letterSpacing="3">
          {isDevanagari ? 'कुण्डली' : 'KUNDALI'}
        </text>
        <text x={totalW / 2} y={totalW / 2 + 10} fill="rgba(212,168,83,0.1)" fontSize="9" textAnchor="middle" letterSpacing="1">
          {isDevanagari ? 'दक्षिण शैली' : 'SOUTH'}
        </text>

        {/* Sign cells */}
        {GRID_CELLS.map(({ col, row, sign }) => {
          const px = pad + col * cell;
          const py = pad + row * cell;
          const planetsInSign = getPlanetsInSign(sign);
          const rashi = RASHIS[sign - 1];
          const isAscendant = sign === data.ascendantSign;
          const house = signToHouse(sign);
          const isSelected = selectedHouse === house;

          return (
            <g
              key={sign}
              onClick={() => onSelectHouse?.(house)}
              style={{ cursor: onSelectHouse ? 'pointer' : 'default' }}
            >
              {/* Cell background */}
              <rect
                x={px}
                y={py}
                width={cell}
                height={cell}
                fill={isSelected
                  ? 'rgba(212,168,83,0.14)'
                  : isAscendant
                  ? 'rgba(212,168,83,0.06)'
                  : planetsInSign.length > 0
                  ? 'rgba(212,168,83,0.02)'
                  : 'transparent'}
                stroke={isSelected ? 'rgba(212,168,83,0.5)' : 'none'}
                strokeWidth={isSelected ? '1.5' : '0'}
                className="transition-all duration-200 hover:fill-[rgba(212,168,83,0.05)]"
              />

              {/* Sign name */}
              <text
                x={px + 8}
                y={py + 16}
                fill={isAscendant ? '#f0d48a' : 'rgba(212,168,83,0.85)'}
                fontSize={isAscendant ? '13' : '12'}
                fontWeight={isAscendant ? '700' : '600'}
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {rashi?.name[locale] || rashi?.name.en}
              </text>

              {/* House number */}
              <text
                x={px + cell - 8}
                y={py + 15}
                fill={isAscendant ? 'rgba(240,212,138,0.85)' : 'rgba(212,168,83,0.7)'}
                fontSize="13"
                fontWeight="700"
                textAnchor="end"
                dominantBaseline="middle"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {house}
              </text>

              {/* Ascendant diagonal marker */}
              {isAscendant && (
                <>
                  <line x1={px} y1={py} x2={px + 18} y2={py + 18} stroke="#f0d48a" strokeWidth="1.5" opacity="0.8" />
                  <text x={px + 22} y={py + 18} fill="#f0d48a" fontSize="8" fontWeight="600" letterSpacing="1" opacity="0.8">
                    {isDevanagari ? 'लग्न' : 'ASC'}
                  </text>
                </>
              )}

              {/* Natal Planets  –  abbreviation + colored dot */}
              {planetsInSign.map((planetId, pIdx) => {
                const color = PLANET_COLORS[planetId] || '#e8e6e3';
                const count = planetsInSign.length;
                const cols = Math.min(count, 2);
                const colIdx = pIdx % cols;
                const rowIdx = Math.floor(pIdx / cols);
                const startX = px + 12 + colIdx * (cell / 2 - 4);
                const startY = py + 38 + rowIdx * 20;
                let abbr = PLANET_ABBR[planetId]?.[locale] || PLANET_ABBR[planetId]?.en || '';
                if (retrogradeIds?.has(planetId)) abbr += 'ᴿ';
                if (combustIds?.has(planetId)) abbr += '☄';

                const tier = paramaUchchaIds.has(planetId) ? 'parama-ucha' : dignityByPlanet[planetId];
                const halo = tier ? DIGNITY_HALO[tier] : undefined;
                const isSelectedPlanet = selectedPlanetId === planetId;
                const handlePlanetClick = onSelectPlanet
                  ? (e: React.MouseEvent) => {
                      e.stopPropagation();
                      onSelectPlanet(isSelectedPlanet ? null : planetId);
                    }
                  : undefined;
                return (
                  <g
                    key={planetId}
                    onClick={handlePlanetClick}
                    style={handlePlanetClick ? { cursor: 'pointer' } : undefined}
                    role={handlePlanetClick ? 'button' : undefined}
                    tabIndex={handlePlanetClick ? 0 : undefined}
                    aria-pressed={handlePlanetClick ? isSelectedPlanet : undefined}
                    aria-label={handlePlanetClick
                      ? `${GRAHAS[planetId]?.name[locale] ?? GRAHAS[planetId]?.name.en ?? ''} — click to show aspects`
                      : undefined}
                    onKeyDown={handlePlanetClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePlanetClick(e as unknown as React.MouseEvent);
                          }
                        }
                      : undefined}
                  >
                    {halo && halo.opacity > 0 && (
                      <circle
                        cx={startX + 18} cy={startY - 2}
                        r="12"
                        fill={halo.color}
                        opacity={halo.opacity}
                        style={halo.pulse && !reduceMotion ? { animation: 'dignityPulseS 2.4s ease-in-out infinite' } : undefined}
                      />
                    )}
                    <circle cx={startX + 18} cy={startY - 2} r="12" fill={color} opacity="0.05" />
                    <circle cx={startX + 6} cy={startY - 2} r="2.5" fill={color} opacity="0.9" />
                    {handlePlanetClick && (
                      <rect
                        x={startX + 7} y={startY - 13}
                        width="22" height="22"
                        fill="transparent"
                      />
                    )}
                    <text
                      x={startX + 18} y={startY} fill={color}
                      fontSize="12" fontWeight="700" textAnchor="middle" dominantBaseline="middle"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.5px' }}
                    >{abbr}</text>
                    {paramaUchchaIds.has(planetId) && (
                      <path
                        d="M0,4 C-2,2 -2,-1 0,-4 C2,-1 2,2 0,4 Z"
                        transform={`translate(${startX + 18}, ${startY - 14}) scale(1.4)`}
                        fill="#fbbf24"
                        opacity="0.95"
                        style={{ filter: 'drop-shadow(0 0 3px #fbbf24)' }}
                      />
                    )}
                  </g>
                );
              })}

              {/* Transit Planets  –  outlined style */}
              {transitData && (() => {
                const tHouse = ((sign - transitData.ascendantSign + 12) % 12) + 1;
                const tPlanets = transitData.houses[tHouse - 1] || [];
                if (tPlanets.length === 0) return null;
                const natalRows = Math.ceil(planetsInSign.length / Math.min(planetsInSign.length || 1, 2));
                const tBaseY = py + 38 + (planetsInSign.length > 0 ? natalRows * 20 : 0);
                return tPlanets.map((planetId, pIdx) => {
                  const color = PLANET_COLORS[planetId] || '#e8e6e3';
                  const cols = Math.min(tPlanets.length, 2);
                  const colIdx = pIdx % cols;
                  const rowIdx = Math.floor(pIdx / cols);
                  const startX = px + 12 + colIdx * (cell / 2 - 4);
                  const startY = tBaseY + rowIdx * 16;
                  const abbr = PLANET_ABBR[planetId]?.[locale] || PLANET_ABBR[planetId]?.en || '';
                  return (
                    <g key={`t-${planetId}`} opacity="0.6">
                      <circle cx={startX + 6} cy={startY - 2} r="2" fill="none" stroke={color} strokeWidth="1" />
                      <text
                        x={startX + 18} y={startY} fill={color}
                        fontSize="10" fontWeight="600" textAnchor="middle" dominantBaseline="middle"
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.3px' }}
                      >{abbr}</text>
                    </g>
                  );
                });
              })()}
            </g>
          );
        })}

        {/* Corner ornaments */}
        <g opacity="0.5">
          <line x1={pad - 2} y1={pad + 8} x2={pad - 2} y2={pad - 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={pad - 2} y1={pad - 2} x2={pad + 8} y2={pad - 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={totalW - pad - 8} y1={pad - 2} x2={totalW - pad + 2} y2={pad - 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={totalW - pad + 2} y1={pad - 2} x2={totalW - pad + 2} y2={pad + 8} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={pad - 2} y1={totalW - pad - 8} x2={pad - 2} y2={totalW - pad + 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={pad - 2} y1={totalW - pad + 2} x2={pad + 8} y2={totalW - pad + 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={totalW - pad - 8} y1={totalW - pad + 2} x2={totalW - pad + 2} y2={totalW - pad + 2} stroke="#d4a853" strokeWidth="1.5" />
          <line x1={totalW - pad + 2} y1={totalW - pad + 2} x2={totalW - pad + 2} y2={totalW - pad - 8} stroke="#d4a853" strokeWidth="1.5" />
        </g>

        {/* Drishti overlay — same component as North, fed South-grid
            geometry. Houses are rectangles here so the highlighted
            "polygon" is just the cell border, but the overlay component
            doesn't care about shape — it just paints what it's given. */}
        {selectedPlanetId != null && aspectedHouses.length > 0 && planetHouseMap[selectedPlanetId] && (
          <DrishtiOverlay
            housePaths={housePaths}
            houseCentroids={houseCentroids}
            sourceHouse={planetHouseMap[selectedPlanetId]}
            aspectedHouses={aspectedHouses}
            reduceMotion={reduceMotion}
            ariaLabel={selectionAnnouncement}
          />
        )}

        {onSelectPlanet && selectedPlanetId != null && (
          <rect
            x="0" y="0" width={totalW} height={totalW}
            fill="transparent"
            onClick={() => onSelectPlanet(null)}
            style={{ cursor: 'default' }}
          />
        )}
      </motion.svg>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1, height: 1,
          padding: 0, margin: -1, overflow: 'hidden',
          clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
        }}
      >
        {selectionAnnouncement}
      </div>

      <style jsx>{`
        @keyframes dignityPulseS {
          0%, 100% { opacity: var(--halo-min, 0.35); }
          50%      { opacity: var(--halo-max, 0.65); }
        }
      `}</style>
    </div>
  );
}
