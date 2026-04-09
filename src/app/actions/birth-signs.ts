'use server';

import { computeBirthSigns, type BirthSignResult } from '@/lib/ephem/astronomical';

/**
 * Server action: compute birth signs using Swiss Ephemeris (sub-arcsecond accuracy).
 * Runs on Node.js where Swiss Eph native module is available.
 * Client pages should call this instead of importing computeBirthSigns directly —
 * direct import runs in the browser where Swiss Eph is NOT available and falls
 * back to the Meeus polynomial (±0.5° Moon, ±1° ayanamsha for dates outside 1900-2100).
 */
export async function computeBirthSignsAction(
  date: string,
  time: string,
  lat: number,
  lng: number,
  timezone: string,
  ayanamshaType: 'lahiri' | 'raman' | 'kp' = 'lahiri',
): Promise<BirthSignResult> {
  return computeBirthSigns(date, time, lat, lng, timezone, ayanamshaType);
}
