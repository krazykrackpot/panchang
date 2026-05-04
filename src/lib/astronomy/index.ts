export { dateToJD, jdToDate, julianCenturies, dateObjectToJD, normalizeAngle, degToRad, radToDeg } from './julian';
export { getSolarPosition, getObliquity, getGMST, getLST, getEquationOfTime } from './solar';
export type { SolarPosition } from './solar';
export { getLunarPosition, getMoonPhase } from './lunar';
export type { LunarPosition } from './lunar';
export { getPlanetPosition, getAllPlanetPositions } from './planets';
export type { PlanetId, PlanetPosition } from './planets';
export { getSunTimes } from './sunrise';
export type { SunTimes } from './sunrise';
// Ayanamsha adapters — canonical module is src/lib/ephem/astronomical.
// These re-exports preserve the old API (getAyanamsa / tropicalToSidereal / AyanamsaType)
// so existing tests and any remaining callers continue to work.
import { getAyanamsha, toSidereal as _toSidereal, type AyanamshaType } from '../ephem/astronomical';
/** @deprecated Use getAyanamsha from src/lib/ephem/astronomical */
export function getAyanamsa(jd: number, type?: 'lahiri' | 'krishnamurti' | 'raman'): number {
  // Map old 'krishnamurti' key to Module B's 'kp' (same polynomial constants)
  const mapped = type === 'krishnamurti' ? 'kp' : (type ?? 'lahiri');
  return getAyanamsha(jd, mapped as AyanamshaType);
}
/** @deprecated Use toSidereal from src/lib/ephem/astronomical */
export function tropicalToSidereal(tropicalLon: number, ayanamsa: number): number {
  return _toSidereal(tropicalLon, 0, ayanamsa);
}
export type { AyanamshaType as AyanamsaType } from '../ephem/astronomical';
