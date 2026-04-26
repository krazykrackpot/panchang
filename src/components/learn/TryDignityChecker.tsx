'use client';

import { useState, useMemo } from 'react';
import { RASHIS } from '@/lib/constants/rashis';

/**
 * Planetary dignity data from BPHS (Brihat Parashara Hora Shastra).
 * Rahu/Ketu excluded — only visible planets Sun through Saturn.
 *
 * Fields: ownSigns (array of rashi IDs), exaltSign, exaltDeg, debilSign,
 * moolatrikonSign, moolatrikonDegRange [start, end].
 */
const PLANET_DIGNITY: {
  id: number;
  name: string;
  ownSigns: number[];
  exaltSign: number;
  exaltDeg: number;
  debilSign: number;
  moolatrikonSign: number;
  moolatrikonRange: [number, number]; // deg within sign
}[] = [
  { id: 0, name: 'Sun',     ownSigns: [5],    exaltSign: 1,  exaltDeg: 10, debilSign: 7,  moolatrikonSign: 5,  moolatrikonRange: [0, 20] },
  { id: 1, name: 'Moon',    ownSigns: [4],    exaltSign: 2,  exaltDeg: 3,  debilSign: 8,  moolatrikonSign: 2,  moolatrikonRange: [4, 20] },
  { id: 2, name: 'Mars',    ownSigns: [1, 8], exaltSign: 10, exaltDeg: 28, debilSign: 4,  moolatrikonSign: 1,  moolatrikonRange: [0, 12] },
  { id: 3, name: 'Mercury', ownSigns: [3, 6], exaltSign: 6,  exaltDeg: 15, debilSign: 12, moolatrikonSign: 6,  moolatrikonRange: [16, 20] },
  { id: 4, name: 'Jupiter', ownSigns: [9, 12],exaltSign: 4,  exaltDeg: 5,  debilSign: 10, moolatrikonSign: 9,  moolatrikonRange: [0, 10] },
  { id: 5, name: 'Venus',   ownSigns: [2, 7], exaltSign: 12, exaltDeg: 27, debilSign: 6,  moolatrikonSign: 7,  moolatrikonRange: [0, 15] },
  { id: 6, name: 'Saturn',  ownSigns: [10, 11],exaltSign: 7, exaltDeg: 20, debilSign: 1,  moolatrikonSign: 11, moolatrikonRange: [0, 20] },
];

/** Natural friendship table (BPHS). Key: planet id, value: set of friend planet ids */
const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1, 2, 4]),       // Sun: Moon, Mars, Jupiter
  1: new Set([0, 3]),          // Moon: Sun, Mercury
  2: new Set([0, 1, 4]),       // Mars: Sun, Moon, Jupiter
  3: new Set([0, 5]),          // Mercury: Sun, Venus
  4: new Set([0, 1, 2]),       // Jupiter: Sun, Moon, Mars
  5: new Set([3, 6]),          // Venus: Mercury, Saturn
  6: new Set([3, 5]),          // Saturn: Mercury, Venus
};

const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5, 6]),          // Sun: Venus, Saturn
  1: new Set([]),              // Moon: none
  2: new Set([3]),             // Mars: Mercury
  3: new Set([1]),             // Mercury: Moon
  4: new Set([3, 5]),          // Jupiter: Mercury, Venus
  5: new Set([0, 1]),          // Venus: Sun, Moon
  6: new Set([0, 1, 2]),       // Saturn: Sun, Moon, Mars
};

function getDignity(planetId: number, signId: number): { level: string; color: string; description: string } {
  const planet = PLANET_DIGNITY.find(p => p.id === planetId);
  if (!planet) return { level: 'Unknown', color: 'text-text-secondary', description: '' };

  if (signId === planet.exaltSign) {
    return { level: 'Exalted', color: 'text-emerald-400', description: `Peak strength at ${planet.exaltDeg}\u00b0 ${RASHIS[signId - 1].name.en}` };
  }
  if (signId === planet.debilSign) {
    return { level: 'Debilitated', color: 'text-red-400', description: `Weakest position. Check for Neecha Bhanga cancellation.` };
  }
  if (signId === planet.moolatrikonSign) {
    return { level: 'Moolatrikona', color: 'text-cyan-400', description: `Strong office sign (${planet.moolatrikonRange[0]}\u00b0\u2013${planet.moolatrikonRange[1]}\u00b0 range)` };
  }
  if (planet.ownSigns.includes(signId)) {
    return { level: 'Own Sign (Swakshetra)', color: 'text-blue-400', description: `Comfortable in its own domain` };
  }

  // Check friendship via sign lord
  const signLord = RASHIS[signId - 1].ruler;
  const lordPlanetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const lordId = lordPlanetNames.indexOf(signLord);
  if (lordId === -1 || lordId === planetId) {
    return { level: 'Neutral', color: 'text-yellow-400', description: 'Neutral territory' };
  }

  if (FRIENDS[planetId]?.has(lordId)) {
    return { level: 'Friendly Sign', color: 'text-teal-400', description: `Sign lord ${signLord} is a natural friend` };
  }
  if (ENEMIES[planetId]?.has(lordId)) {
    return { level: 'Enemy Sign', color: 'text-orange-400', description: `Sign lord ${signLord} is a natural enemy` };
  }
  return { level: 'Neutral Sign', color: 'text-yellow-400', description: `Sign lord ${signLord} is neutral` };
}

export default function TryDignityChecker() {
  const [planetId, setPlanetId] = useState(0);
  const [signId, setSignId] = useState(1);

  const dignity = useMemo(() => getDignity(planetId, signId), [planetId, signId]);

  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] p-5 my-6">
      <h4 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Try It -- Planetary Dignity Checker
      </h4>
      <p className="text-text-secondary text-xs mb-4">Select a planet and sign to see the dignity status.</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-text-secondary text-xs mb-1">Planet</label>
          <select
            value={planetId}
            onChange={e => setPlanetId(Number(e.target.value))}
            className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
          >
            {PLANET_DIGNITY.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-text-secondary text-xs mb-1">Sign</label>
          <select
            value={signId}
            onChange={e => setSignId(Number(e.target.value))}
            className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
          >
            {RASHIS.map(r => (
              <option key={r.id} value={r.id}>{r.symbol} {r.name.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#111633]/60 rounded-xl p-4 border border-gold-primary/10">
        <div className="flex items-center gap-3 mb-2">
          <span className={`font-bold text-lg ${dignity.color}`}>{dignity.level}</span>
        </div>
        <p className="text-text-secondary text-xs">{dignity.description}</p>
        <div className="mt-3 text-text-secondary text-xs opacity-60">
          {PLANET_DIGNITY.find(p => p.id === planetId)?.name} in {RASHIS[signId - 1].name.en} ({RASHIS[signId - 1].symbol})
          {' '}&mdash; Lord: {RASHIS[signId - 1].ruler}
        </div>
      </div>
    </div>
  );
}
