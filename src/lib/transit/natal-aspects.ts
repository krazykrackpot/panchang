/**
 * Transit-to-Natal Aspect Analysis
 *
 * When a transiting slow planet (Jupiter, Saturn, Rahu) forms an exact or
 * close aspect to a natal planet position, it triggers significant effects.
 * This goes beyond house-based transit analysis by checking angular distance.
 *
 * Aspect angles and orbs follow standard Vedic/Western hybrid practice
 * for transit analysis (degree-based, not whole-sign).
 */

export interface TransitNatalAspect {
  transitPlanet: number;     // transiting planet id
  natalPlanet: number;       // natal planet id being aspected
  aspectType: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  orb: number;               // degrees of separation from exact (always >= 0)
  isApplying: boolean;       // getting closer (more potent) vs separating
  significance: 'major' | 'moderate' | 'minor';
}

/** Standard aspect angles in degrees */
const ASPECT_ANGLES: Record<string, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
};

/** Maximum orb allowed per aspect type (degrees) */
const MAX_ORBS: Record<string, number> = {
  conjunction: 8,
  opposition: 8,
  trine: 6,
  square: 6,
  sextile: 4,
};

/** Significance classification per aspect type */
const ASPECT_SIGNIFICANCE: Record<string, 'major' | 'moderate' | 'minor'> = {
  conjunction: 'major',
  opposition: 'major',
  trine: 'moderate',
  square: 'moderate',
  sextile: 'minor',
};

/** Slow transit planets worth checking: Jupiter(4), Saturn(6), Rahu(7) */
const SLOW_TRANSIT_PLANETS = new Set([4, 6, 7]);

/**
 * Normalize an angle to 0-360 range.
 */
function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the shortest angular distance between two longitudes (0-180).
 */
function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(normalize360(lon1) - normalize360(lon2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Determine if the transit planet is applying to (moving toward) the exact
 * aspect angle, or separating from it.
 *
 * A positive speed means the transit planet is advancing in longitude.
 * If advancing brings it closer to the exact aspect point, it is applying.
 */
function isApplyingAspect(
  transitLon: number,
  natalLon: number,
  transitSpeed: number,
  aspectAngle: number,
): boolean {
  const tNorm = normalize360(transitLon);

  // The exact aspect point is where transit would be for a perfect aspect
  const exactPoint = normalize360(natalLon + aspectAngle);

  // Current distance to the exact point (going forward through the zodiac)
  const forwardDist = normalize360(exactPoint - tNorm);

  // If forward distance is small (< 180), the planet needs to move forward to reach it
  // If transit speed is positive, it IS moving forward → applying
  if (forwardDist > 0 && forwardDist < 180) {
    return transitSpeed > 0;
  }
  // If forward distance is >= 180, the planet has passed the exact point going forward
  // Moving forward means separating
  return transitSpeed < 0;
}

/**
 * Find all aspects between current transit positions and natal planet positions.
 *
 * Only checks slow planets (Jupiter=4, Saturn=6, Rahu=7) as transit planets
 * against all natal planets (0-8).
 */
export function findTransitNatalAspects(
  transitPositions: { id: number; longitude: number; speed: number }[],
  natalPositions: { id: number; longitude: number }[],
): TransitNatalAspect[] {
  const results: TransitNatalAspect[] = [];

  for (const transit of transitPositions) {
    if (!SLOW_TRANSIT_PLANETS.has(transit.id)) continue;

    for (const natal of natalPositions) {
      const distance = angularDistance(transit.longitude, natal.longitude);

      for (const [aspectName, aspectAngle] of Object.entries(ASPECT_ANGLES)) {
        const orb = Math.abs(distance - aspectAngle);
        const maxOrb = MAX_ORBS[aspectName];

        if (orb <= maxOrb) {
          results.push({
            transitPlanet: transit.id,
            natalPlanet: natal.id,
            aspectType: aspectName as TransitNatalAspect['aspectType'],
            orb: Math.round(orb * 100) / 100,
            isApplying: isApplyingAspect(
              transit.longitude,
              natal.longitude,
              transit.speed,
              aspectAngle,
            ),
            significance: ASPECT_SIGNIFICANCE[aspectName],
          });
        }
      }
    }
  }

  return results;
}
