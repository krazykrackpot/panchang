/**
 * Bhava Chalit Chart — Equal Bhava (Sripati) System
 *
 * In the standard Vedic chart, each rashi IS a house (whole-sign system).
 * But in the Bhava Chalit system, house boundaries (sandhis) are determined
 * by the ascendant degree, not sign boundaries. Planets near the cusp of
 * a sign may "shift" to an adjacent bhava.
 *
 * Algorithm (Equal Bhava):
 *   Bhava Madhya (midpoint) of house N = Ascendant + (N-1) × 30°
 *   Bhava Sandhi (boundary) between N and N+1 = midpoint of their madhyas
 *   A planet belongs to the bhava whose sandhi range contains it.
 *
 * This is the standard Vedic approach. More complex systems (Placidus, Koch)
 * exist but Equal Bhava is used by BPHS and most Vedic software.
 */

export interface BhavaChalitPlanet {
  planetId: number;
  planetName: string;
  longitude: number;
  rashiHouse: number;  // 1-12, whole-sign house relative to ascendant
  bhavaHouse: number;  // 1-12, bhava chalit house
  shifted: boolean;    // true if rashiHouse !== bhavaHouse
}

export interface BhavaChalitResult {
  /** Bhava Madhya (midpoints) — 12 entries in degrees (0-360) */
  bhavaMadhya: number[];
  /** Bhava Sandhi (boundaries) — 12 entries, sandhi[i] = start of bhava i+1 */
  bhavaSandhi: number[];
  /** Planet bhava assignments */
  planets: BhavaChalitPlanet[];
  /** How many planets shifted houses */
  shiftCount: number;
}

function normDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

/**
 * Compute Bhava Chalit chart using Equal Bhava (Sripati) system.
 *
 * @param ascendantDeg - Sidereal ascendant degree (0-360)
 * @param planets - Array of planets with id, longitude (sidereal), name
 */
export function computeBhavaChalit(
  ascendantDeg: number,
  planets: Array<{ id: number; longitude: number; name?: { en?: string } | string }>,
): BhavaChalitResult {
  // 1. Compute Bhava Madhya (midpoints)
  const bhavaMadhya: number[] = [];
  for (let i = 0; i < 12; i++) {
    bhavaMadhya.push(normDeg(ascendantDeg + i * 30));
  }

  // 2. Compute Bhava Sandhi (boundaries)
  // Sandhi between bhava N and bhava N+1 = midpoint of their madhyas
  const bhavaSandhi: number[] = [];
  for (let i = 0; i < 12; i++) {
    const m1 = bhavaMadhya[i];
    const m2 = bhavaMadhya[(i + 1) % 12];
    // Midpoint handling for circular degrees
    let mid = (m1 + m2) / 2;
    if (Math.abs(m2 - m1) > 180) {
      mid = normDeg(mid + 180);
    }
    bhavaSandhi.push(normDeg(mid));
  }

  // 3. Assign planets to bhavas
  const ascSign = Math.floor(ascendantDeg / 30) + 1; // 1-12

  const result: BhavaChalitPlanet[] = planets
    .filter(p => p.id >= 0 && p.id <= 8) // Sun through Ketu
    .map(p => {
      const pSign = Math.floor(p.longitude / 30) + 1;
      const rashiHouse = ((pSign - ascSign + 12) % 12) + 1;

      // Find which bhava the planet falls in.
      // Bhava N spans from sandhi[N-1] (previous boundary) to sandhi[N].
      // sandhi[i] = boundary between bhava i+1 and bhava i+2.
      // So bhava 1 spans from sandhi[11] to sandhi[0].
      let bhavaHouse = 1;
      const pDeg = normDeg(p.longitude);
      for (let b = 0; b < 12; b++) {
        const start = bhavaSandhi[(b + 11) % 12]; // previous sandhi = start of this bhava
        const end = bhavaSandhi[b];                // this sandhi = end of this bhava
        if (end > start) {
          if (pDeg >= start && pDeg < end) { bhavaHouse = b + 1; break; }
        } else {
          // Wraps around 360°
          if (pDeg >= start || pDeg < end) { bhavaHouse = b + 1; break; }
        }
      }
      const planetName = typeof p.name === 'string' ? p.name : (p.name?.en || `Planet ${p.id}`);

      return {
        planetId: p.id,
        planetName,
        longitude: p.longitude,
        rashiHouse,
        bhavaHouse,
        shifted: rashiHouse !== bhavaHouse,
      };
    });

  return {
    bhavaMadhya,
    bhavaSandhi,
    planets: result,
    shiftCount: result.filter(p => p.shifted).length,
  };
}
