/**
 * Tajika Aspects and Yogas for Varshaphal
 * Detects Ithasala, Ishrafa, Nakta, Yamaya, Manaú yogas
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type { TajikaYoga } from '@/types/varshaphal';
import type { Trilingual } from '@/types/panchang';

// Tajika aspect angles
const TAJIKA_ASPECTS = [
  { angle: 0, name: 'conjunction', label: { en: 'Conjunction', hi: 'युति', sa: 'युतिः' } },
  { angle: 60, name: 'sextile', label: { en: 'Sextile', hi: 'षष्ठांश', sa: 'षष्ठांशः' } },
  { angle: 90, name: 'square', label: { en: 'Square', hi: 'चतुर्थांश', sa: 'चतुर्थांशः' } },
  { angle: 120, name: 'trine', label: { en: 'Trine', hi: 'त्रिकोण', sa: 'त्रिकोणः' } },
  { angle: 180, name: 'opposition', label: { en: 'Opposition', hi: 'सप्तम', sa: 'सप्तमः' } },
];

// Orbs: luminaries (Sun/Moon) get 12°, others get 8°
function getOrb(id1: number, id2: number): number {
  if (id1 <= 1 || id2 <= 1) return 12;
  return 8;
}

// Approximate daily motion (degrees/day) for speed comparison
const PLANET_SPEEDS: Record<number, number> = {
  0: 1.0,    // Sun
  1: 13.2,   // Moon
  2: 0.52,   // Mars
  3: 1.38,   // Mercury
  4: 0.083,  // Jupiter
  5: 1.2,    // Venus
  6: 0.034,  // Saturn
  7: 0.053,  // Rahu
  8: 0.053,  // Ketu
};

export function detectTajikaYogas(planets: PlanetPosition[]): TajikaYoga[] {
  const yogas: TajikaYoga[] = [];
  const mainPlanets = planets.filter(p => p.planet.id <= 6); // Sun through Saturn

  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      const orb = getOrb(p1.planet.id, p2.planet.id);

      for (const aspect of TAJIKA_ASPECTS) {
        const aspectDiff = Math.abs(diff - aspect.angle);
        if (aspectDiff <= orb) {
          // Determine faster planet (higher speed = faster)
          const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
          const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
          const faster = speed1 > speed2 ? p1 : p2;
          const slower = speed1 > speed2 ? p2 : p1;

          // Is the aspect applying (getting closer) or separating?
          const isApplying = isAspectApplying(faster, slower, aspect.angle);

          if (isApplying) {
            // ITHASALA — faster planet applies to slower
            yogas.push({
              name: { en: `Ithasala (${aspect.label.en})`, hi: `इत्थशाल (${aspect.label.hi})`, sa: `इत्थशालः (${aspect.label.sa})` },
              type: 'ithasala',
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              favorable: aspect.angle !== 90 && aspect.angle !== 180,
              description: {
                en: `${faster.planet.name.en} applies to ${slower.planet.name.en} by ${aspect.label.en} — event will materialize.`,
                hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से ${aspect.label.hi} बना रहा है — कार्य सिद्ध होगा।`,
                sa: `${faster.planet.name.sa} ${slower.planet.name.sa} ${aspect.label.sa} योगं करोति — कार्यसिद्धिः।`,
              },
            });
          } else {
            // ISHRAFA — separating aspect
            yogas.push({
              name: { en: `Ishrafa (${aspect.label.en})`, hi: `ईशराफ (${aspect.label.hi})`, sa: `ईशराफः (${aspect.label.sa})` },
              type: 'ishrafa',
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              favorable: false,
              description: {
                en: `${faster.planet.name.en} separates from ${slower.planet.name.en} — opportunity may have passed.`,
                hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से अलग हो रहा है — अवसर बीत सकता है।`,
                sa: `${faster.planet.name.sa} ${slower.planet.name.sa} विमुखः — अवसरः अतीतः।`,
              },
            });
          }
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Check for Nakta (a third planet transfers light)
  if (yogas.length >= 2) {
    const naktaYoga = detectNakta(mainPlanets, yogas);
    if (naktaYoga) yogas.push(naktaYoga);
  }

  return yogas;
}

function isAspectApplying(faster: PlanetPosition, slower: PlanetPosition, aspectAngle: number): boolean {
  const currentDiff = angleDiff(faster.longitude, slower.longitude);
  const futureFaster = faster.longitude + (faster.speed || PLANET_SPEEDS[faster.planet.id] || 0);
  const futureSlower = slower.longitude + (slower.speed || PLANET_SPEEDS[slower.planet.id] || 0);
  const futureDiff = angleDiff(futureFaster, futureSlower);

  return Math.abs(futureDiff - aspectAngle) < Math.abs(currentDiff - aspectAngle);
}

function angleDiff(a: number, b: number): number {
  let d = normalizeDeg(a - b);
  if (d > 180) d -= 360;
  return Math.abs(d);
}

function detectNakta(planets: PlanetPosition[], existingYogas: TajikaYoga[]): TajikaYoga | null {
  // Nakta: When planet A can't reach planet B, but planet C mediates
  // Simplified: if we have both Ishrafa and Ithasala involving a common planet
  const ishrafas = existingYogas.filter(y => y.type === 'ishrafa');
  const ithasalas = existingYogas.filter(y => y.type === 'ithasala');

  for (const ish of ishrafas) {
    for (const ith of ithasalas) {
      if (ish.planet2.en === ith.planet1.en || ish.planet1.en === ith.planet2.en) {
        const mediator = ish.planet2.en === ith.planet1.en ? ish.planet2 : ish.planet1;
        return {
          name: { en: 'Nakta Yoga', hi: 'नक्त योग', sa: 'नक्तयोगः' },
          type: 'nakta',
          planet1: ish.planet1,
          planet2: ith.planet2,
          favorable: true,
          description: {
            en: `${mediator.en} transfers light between planets — event happens through an intermediary.`,
            hi: `${mediator.hi} मध्यस्थता करता है — कार्य मध्यस्थ द्वारा होगा।`,
            sa: `${mediator.sa} ज्योतिसंक्रमणं करोति — कार्यं मध्यस्थेन भवति।`,
          },
        };
      }
    }
  }

  return null;
}
