/**
 * Current transit Saturn + Jupiter signs (1-12). Used by member-status
 * computations to flag Sade Sati / Jupiter-house phases.
 *
 * Shared between the family dashboard (every member) and the main
 * dashboard (the user's own MemberStatus). Lifted out of family/page.tsx
 * so both surfaces use the same helper and never drift.
 */

import { getPlanetaryPositions, toSidereal, getRashiNumber, dateToJD } from '@/lib/ephem/astronomical';

export function getCurrentTransitSigns(): { saturnSign: number; jupiterSign: number } {
  const now = new Date();
  const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 12);
  const planets = getPlanetaryPositions(jd);
  // planets[6] = Saturn, planets[4] = Jupiter  –  tropical longitudes
  const saturnSid = toSidereal(planets[6].longitude, jd);
  const jupiterSid = toSidereal(planets[4].longitude, jd);
  return {
    saturnSign: getRashiNumber(saturnSid),
    jupiterSign: getRashiNumber(jupiterSid),
  };
}
