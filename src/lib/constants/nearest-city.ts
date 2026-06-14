/**
 * Reverse geo-lookup: given a (lat, lng), find the closest entry in
 * CITIES that is within tolerance.
 *
 * Use case — Blob short-circuit on /api/panchang. When the user's
 * geo-resolved coords match a known city, the page handler can pass
 * `?citySlug=` to /api/panchang and the route returns the precomputed
 * panchang-city Blob instead of running computePanchang live (PR-3).
 *
 * Tolerance choice — default 50km:
 * Panchang values at the city scale drift slowly with location.
 * Sunrise/sunset are longitude-dominated (~4 min per degree ≈ ~110km),
 * tithi/nakshatra/yoga/karana labels are location-independent for a
 * given day. A 50km tolerance keeps any served content within a few
 * minutes of the user's true sunrise, which is the same accuracy
 * most panchang apps surface (city-level granularity).
 */

import { CITIES, type CityData } from '@/lib/constants/cities';

/**
 * Haversine great-circle distance in kilometres between two
 * (lat, lng) pairs. ~0.5% accuracy within a few thousand km, which
 * is plenty for "is this user near a known city" lookups.
 */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Find the CITY closest to (lat, lng), if any is within `maxKm`.
 *
 * @returns the CityData entry, or null if no city is within tolerance
 *          (or if lat/lng are invalid numbers).
 */
export function findNearestPrecomputedCity(
  lat: number,
  lng: number,
  maxKm = 50,
): CityData | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  let best: { city: CityData; km: number } | null = null;
  for (const city of CITIES) {
    const km = haversineKm(lat, lng, city.lat, city.lng);
    if (km <= maxKm && (best === null || km < best.km)) {
      best = { city, km };
    }
  }
  return best?.city ?? null;
}
