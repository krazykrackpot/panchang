/**
 * Eclipse Local Circumstances Calculator
 *
 * Computes location-specific eclipse times, magnitude, visibility, and Sutak
 * from the pre-computed eclipse data table.
 *
 * For LUNAR eclipses: contact times are universal (same for all observers).
 * We just convert UTC→local and check if Moon is above horizon.
 *
 * For SOLAR eclipses: we use the greatest-eclipse parameters + simplified
 * geometric model to approximate local contact times.
 *
 * Architecture note: This file is the compute layer. To upgrade to full
 * Besselian element computation, replace the solar eclipse functions here.
 */

import type { EclipseData, LunarEclipseData, SolarEclipseData, CityEclipseData } from './eclipse-data';
import { getSunTimes } from '@/lib/astronomy/sunrise';

// ─── Output Types ────────────────────────────────────────────────────────────

export interface LocalEclipseResult {
  date: string;
  type: 'solar' | 'lunar';
  subtype: 'total' | 'annular' | 'partial' | 'penumbral' | 'hybrid';
  visible: boolean;
  visibilityNote: string;       // e.g., "Visible as Partial", "Not visible"

  // Contact times in local time (HH:MM format), null if not applicable
  eclipseStart: string | null;  // First contact (P1 for lunar, C1 for solar partial)
  partialStart: string | null;  // U1 for lunar, or same as eclipseStart for solar
  maximum: string | null;       // Greatest eclipse local time
  partialEnd: string | null;    // U2 for lunar
  eclipseEnd: string | null;    // P4 for lunar, C4 for solar
  endsAtSunset: boolean;        // True if eclipse in progress at sunset (solar)
  endsAtMoonset: boolean;       // True if eclipse in progress at moonset (lunar)

  // Magnitude
  maxMagnitude: number;         // Decimal (e.g., 0.91)
  magnitudeAtSunset: number | null; // For solar eclipses ending at sunset

  // Duration
  durationMinutes: number;      // Total visible duration in minutes
  durationFormatted: string;    // "01h 18m 49s" format

  // Sutak
  sutakApplicable: boolean;     // False if eclipse not visible from location
  sutakStart: string | null;    // HH:MM local time
  sutakEnd: string | null;      // HH:MM local time
  sutakVulnerableStart: string | null; // For children, elderly, pregnant, sick

  // Metadata
  saros: number;
  gamma: number;
  sunrise: string | null;       // Local sunrise HH:MM
  sunset: string | null;        // Local sunset HH:MM
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse "HH:MM" or "HH:MM:SS" to fractional hours */
function parseUtcTime(s: string): number {
  const parts = s.split(':').map(Number);
  return parts[0] + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
}

/** Fractional hours → "HH:MM" */
function formatTime(hours: number): string {
  // Handle day wraparound
  hours = ((hours % 24) + 24) % 24;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Convert UTC fractional hours to local fractional hours */
function utcToLocal(utcHours: number, tzOffsetHours: number): number {
  return utcHours + tzOffsetHours;
}

/** Format duration in minutes to "XXh YYm ZZs" */
function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const s = Math.round((minutes - Math.floor(minutes)) * 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

/** Great-circle distance in km between two lat/lon points */
function greatCircleDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Get timezone offset in hours for a given IANA timezone and date */
function getTzOffset(timezone: string, date: string): number {
  try {
    const d = new Date(date + 'T12:00:00Z');
    const utcStr = d.toLocaleString('en-US', { timeZone: 'UTC' });
    const localStr = d.toLocaleString('en-US', { timeZone: timezone });
    const utcDate = new Date(utcStr);
    const localDate = new Date(localStr);
    return (localDate.getTime() - utcDate.getTime()) / 3600000;
  } catch {
    return 0;
  }
}

/** Get sunrise/sunset times as fractional local hours */
function getSunriseSunset(date: string, lat: number, lng: number, tzOffset: number): { sunrise: number; sunset: number } | null {
  try {
    const [y, m, d] = date.split('-').map(Number);
    const times = getSunTimes(y, m, d, lat, lng, tzOffset);
    const srH = times.sunrise.getHours() + times.sunrise.getMinutes() / 60;
    const ssH = times.sunset.getHours() + times.sunset.getMinutes() / 60;
    return { sunrise: srH, sunset: ssH };
  } catch {
    return null;
  }
}

// ─── Lunar Eclipse Computation ───────────────────────────────────────────────

function computeLunarLocal(eclipse: LunarEclipseData, lat: number, lng: number, timezone: string): LocalEclipseResult {
  const tzOffset = getTzOffset(timezone, eclipse.date);
  const sunTimes = getSunriseSunset(eclipse.date, lat, lng, tzOffset);

  // Convert all UTC times to local
  const p1Local = utcToLocal(parseUtcTime(eclipse.p1), tzOffset);
  const maxLocal = utcToLocal(parseUtcTime(eclipse.max), tzOffset);
  const p4Local = utcToLocal(parseUtcTime(eclipse.p4), tzOffset);
  const u1Local = eclipse.u1 ? utcToLocal(parseUtcTime(eclipse.u1), tzOffset) : null;
  const u2Local = eclipse.u2 ? utcToLocal(parseUtcTime(eclipse.u2), tzOffset) : null;

  // Lunar eclipse visibility: Moon is above horizon during at least part of the eclipse
  // At Full Moon, the Moon rises approximately at sunset and sets at sunrise
  const sunset = sunTimes?.sunset ?? 18;
  const sunrise = sunTimes?.sunrise ?? 6;

  // Moon is above horizon from ~sunset to ~next sunrise (for Full Moon)
  // Account for day wrap: if p1 < sunset but p4 > sunset, part of eclipse is visible
  const moonRise = sunset;       // Full Moon rises at sunset
  const moonSet = sunrise + 24;  // Full Moon sets at next sunrise

  // Normalize all times to handle day wraparound
  let p1N = p1Local;
  let p4N = p4Local;
  // If eclipse crosses midnight, p4 might be smaller than p1 — add 24
  if (p4N < p1N) p4N += 24;

  // Eclipse is visible if ANY part of [p1, p4] overlaps with [moonRise, moonSet]
  const overlapStart = Math.max(p1N, moonRise);
  const overlapEnd = Math.min(p4N, moonSet);
  const visible = overlapEnd > overlapStart;

  let visibleStart = overlapStart;
  let visibleEnd = overlapEnd;
  let endsAtMoonset = false;

  if (visible && p4N > moonSet) {
    endsAtMoonset = true;
    visibleEnd = moonSet;
  }

  const durationMinutes = visible ? Math.max(0, (visibleEnd - visibleStart) * 60) : 0;

  // Sutak: 9 hours before P1 for lunar eclipse
  // Sutak for vulnerable: ~4.5 hours before P1
  const sutakStartLocal = p1Local - 9;
  const sutakVulnStartLocal = p1Local - 4.5;

  // Visibility note
  let visibilityNote = '';
  if (!visible) {
    visibilityNote = 'Not visible — Moon below horizon';
  } else if (eclipse.type === 'total') {
    visibilityNote = 'Visible as Total Lunar Eclipse';
  } else if (eclipse.type === 'partial') {
    visibilityNote = 'Visible as Partial Lunar Eclipse';
  } else {
    visibilityNote = 'Visible as Penumbral Lunar Eclipse';
  }

  return {
    date: eclipse.date,
    type: 'lunar',
    subtype: eclipse.type,
    visible,
    visibilityNote,
    eclipseStart: visible ? formatTime(p1Local) : null,
    partialStart: visible && u1Local !== null ? formatTime(u1Local) : null,
    maximum: visible ? formatTime(maxLocal) : null,
    partialEnd: visible && u2Local !== null ? formatTime(u2Local) : null,
    eclipseEnd: visible ? formatTime(p4Local) : null,
    endsAtSunset: false,
    endsAtMoonset,
    maxMagnitude: eclipse.magnitude,
    magnitudeAtSunset: null,
    durationMinutes,
    durationFormatted: formatDuration(durationMinutes),
    sutakApplicable: visible,
    sutakStart: visible ? formatTime(sutakStartLocal) : null,
    sutakEnd: visible ? formatTime(p4Local) : null,
    sutakVulnerableStart: visible ? formatTime(sutakVulnStartLocal) : null,
    saros: eclipse.saros,
    gamma: eclipse.gamma,
    sunrise: sunTimes ? formatTime(sunTimes.sunrise) : null,
    sunset: sunTimes ? formatTime(sunTimes.sunset) : null,
  };
}

// ─── City-based Interpolation ────────────────────────────────────────────────

/** Interpolate local circumstances from the nearest reference cities using inverse-distance weighting */
function interpolateFromCities(
  cities: CityEclipseData[],
  lat: number,
  lng: number,
  tzOffset: number,
  sunsetLocal: number,
): { c1Local: number; maxLocal: number; c4Local: number; magnitude: number; endsAtSunset: boolean } | null {
  if (!cities || cities.length === 0) return null;

  // Find distances to all cities
  const withDist = cities.map(c => ({
    ...c,
    dist: greatCircleDistKm(lat, lng, c.lat, c.lng),
  }));

  // Sort by distance, take 3 nearest
  withDist.sort((a, b) => a.dist - b.dist);
  const nearest = withDist.slice(0, 3);

  // If closest city is within 50km, use it directly
  if (nearest[0].dist < 50) {
    const city = nearest[0];
    const c1Utc = parseUtcTime(city.c1);
    const maxUtc = parseUtcTime(city.max);
    const isSunset = city.c4 === 'sunset';
    const c4Utc = isSunset ? (sunsetLocal - tzOffset) : parseUtcTime(city.c4);
    return {
      c1Local: utcToLocal(c1Utc, tzOffset),
      maxLocal: utcToLocal(maxUtc, tzOffset),
      c4Local: isSunset ? sunsetLocal : utcToLocal(c4Utc, tzOffset),
      magnitude: city.magnitude,
      endsAtSunset: isSunset,
    };
  }

  // Inverse-distance weighted interpolation
  const weights = nearest.map(c => 1 / Math.max(c.dist, 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let c1Sum = 0, maxSum = 0, c4Sum = 0, magSum = 0;
  let anySunset = false;

  nearest.forEach((city, i) => {
    const w = weights[i] / totalWeight;
    c1Sum += parseUtcTime(city.c1) * w;
    maxSum += parseUtcTime(city.max) * w;
    magSum += city.magnitude * w;
    if (city.c4 === 'sunset') {
      anySunset = true;
      c4Sum += (sunsetLocal - tzOffset) * w;
    } else {
      c4Sum += parseUtcTime(city.c4) * w;
    }
  });

  const c4Local = utcToLocal(c4Sum, tzOffset);
  const endsAtSunset = anySunset || c4Local > sunsetLocal;

  return {
    c1Local: utcToLocal(c1Sum, tzOffset),
    maxLocal: utcToLocal(maxSum, tzOffset),
    c4Local: endsAtSunset ? sunsetLocal : c4Local,
    magnitude: Math.round(magSum * 100) / 100,
    endsAtSunset,
  };
}

// ─── Solar Eclipse Computation ───────────────────────────────────────────────

function computeSolarLocal(eclipse: SolarEclipseData, lat: number, lng: number, timezone: string): LocalEclipseResult {
  const tzOffset = getTzOffset(timezone, eclipse.date);
  const sunTimes = getSunriseSunset(eclipse.date, lat, lng, tzOffset);
  const sunset = sunTimes?.sunset ?? 20;

  // Try city-based interpolation first (most accurate)
  if (eclipse.cities && eclipse.cities.length > 0) {
    const interp = interpolateFromCities(eclipse.cities, lat, lng, tzOffset, sunset);
    if (interp && interp.magnitude > 0.01) {
      const localSubtype: 'total' | 'annular' | 'partial' | 'hybrid' =
        interp.magnitude >= eclipse.magnitude && eclipse.type !== 'partial' ? eclipse.type : 'partial';

      const durationMinutes = Math.max(0, ((interp.endsAtSunset ? sunset : interp.c4Local) - interp.c1Local) * 60);

      // Sutak: 12h before C1, vulnerable: 6h before
      const sutakStart = interp.c1Local - 12;
      const sutakVuln = interp.c1Local - 6;

      // Magnitude at sunset
      let magAtSunset: number | null = null;
      if (interp.endsAtSunset && sunset > interp.maxLocal) {
        const totalPhase = interp.c4Local - interp.maxLocal;
        const sunsetPhase = sunset - interp.maxLocal;
        if (totalPhase > 0) {
          magAtSunset = Math.max(0, interp.magnitude * (1 - sunsetPhase / totalPhase));
          magAtSunset = Math.round(magAtSunset * 100) / 100;
        }
      }

      let visibilityNote: string;
      if (localSubtype === 'total') visibilityNote = 'Visible as Total Solar Eclipse';
      else if (localSubtype === 'annular') visibilityNote = 'Visible as Annular Solar Eclipse';
      else visibilityNote = `Visible as Partial Solar Eclipse (${Math.round(interp.magnitude * 100)}% coverage)`;

      return {
        date: eclipse.date,
        type: 'solar',
        subtype: localSubtype,
        visible: true,
        visibilityNote,
        eclipseStart: formatTime(interp.c1Local),
        partialStart: formatTime(interp.c1Local),
        maximum: formatTime(interp.maxLocal),
        partialEnd: null,
        eclipseEnd: formatTime(interp.endsAtSunset ? sunset : interp.c4Local),
        endsAtSunset: interp.endsAtSunset,
        endsAtMoonset: false,
        maxMagnitude: interp.magnitude,
        magnitudeAtSunset: magAtSunset,
        durationMinutes,
        durationFormatted: formatDuration(durationMinutes),
        sutakApplicable: true,
        sutakStart: formatTime(sutakStart),
        sutakEnd: formatTime(interp.endsAtSunset ? sunset : interp.c4Local),
        sutakVulnerableStart: formatTime(sutakVuln),
        saros: eclipse.saros,
        gamma: eclipse.gamma,
        sunrise: sunTimes ? formatTime(sunTimes.sunrise) : null,
        sunset: sunTimes ? formatTime(sunset) : null,
      };
    }
  }

  // Fallback: geometric approximation (for eclipses without city data)

  // Distance from observer to greatest eclipse point
  const distKm = greatCircleDistKm(lat, lng, eclipse.maxLat, eclipse.maxLon);

  // Check visibility: observer within penumbral shadow radius?
  // For high-gamma eclipses (polar path), the penumbral shadow can be much larger
  // because the shadow is projected at a steep angle. Scale the effective radius.
  const gammaFactor = 1 + Math.abs(eclipse.gamma) * 0.5; // Larger shadow for high-gamma
  const effectivePenRadius = eclipse.penRadius * gammaFactor;
  const visible = distKm < effectivePenRadius;

  if (!visible) {
    return {
      date: eclipse.date,
      type: 'solar',
      subtype: eclipse.type === 'hybrid' ? 'total' : eclipse.type,
      visible: false,
      visibilityNote: 'Not visible from your location',
      eclipseStart: null, partialStart: null, maximum: null, partialEnd: null, eclipseEnd: null,
      endsAtSunset: false, endsAtMoonset: false,
      maxMagnitude: 0, magnitudeAtSunset: null,
      durationMinutes: 0, durationFormatted: '0m',
      sutakApplicable: false,
      sutakStart: null, sutakEnd: null, sutakVulnerableStart: null,
      saros: eclipse.saros, gamma: eclipse.gamma,
      sunrise: sunTimes ? formatTime(sunTimes.sunrise) : null,
      sunset: sunTimes ? formatTime(sunTimes.sunset) : null,
    };
  }

  // ── Compute local eclipse magnitude ──
  // Use quadratic falloff for more realistic magnitude distribution
  // The penumbral shadow has a bell-curve-like magnitude profile
  const halfPathKm = eclipse.pathWidth / 2;
  let localMagnitude: number;
  let localSubtype: 'total' | 'annular' | 'partial' | 'hybrid';

  if (distKm < halfPathKm && eclipse.pathWidth > 0) {
    // Within the path of totality/annularity
    localMagnitude = eclipse.magnitude;
    localSubtype = eclipse.type === 'partial' ? 'partial' : eclipse.type;
  } else {
    // Partial eclipse — use cosine-based falloff for better approximation
    // At center: eclipse.magnitude, at penumbral edge: 0
    const normalizedDist = distKm / effectivePenRadius;
    // Cosine falloff gives more realistic magnitude distribution
    localMagnitude = Math.max(0.01, eclipse.magnitude * Math.cos(normalizedDist * Math.PI / 2));
    localSubtype = 'partial';
  }

  // ── Compute local contact times ──
  // For solar eclipses, the local maximum time depends on the observer's
  // position relative to the shadow path. We use longitude difference
  // scaled by the shadow's longitudinal velocity.
  const maxUtcHours = parseUtcTime(eclipse.maxUtc);

  // The shadow crosses ~360° of longitude during the eclipse.
  // For a typical eclipse, the shadow takes ~3-5 hours to cross the visible zone.
  // The longitude-based time offset is approximately:
  // deltaT = (observerLon - eclipseLon) / (15°/hour * cos correction)
  // But the shadow doesn't move at constant speed on the ground, and for
  // polar eclipses the relationship is highly non-linear.
  //
  // Better approach: use the fact that the Sun moves 15°/hour in hour angle,
  // so the eclipse geometry repeats with a ~15°/hour longitude shift.
  // This gives a first-order correction:
  const lonDiff = lng - eclipse.maxLon;
  // Normalize longitude difference to [-180, 180]
  const lonDiffNorm = ((lonDiff + 180) % 360 + 360) % 360 - 180;

  // Time offset from longitude: the shadow moves roughly with the Sun
  // at ~15°/hour, but ground speed varies with cos(lat) and eclipse geometry.
  // For high-gamma eclipses near the pole, longitude compression is extreme.
  const effectiveSpeedDegPerHour = 15 * Math.cos(eclipse.maxLat * Math.PI / 180);
  const lonTimeOffset = effectiveSpeedDegPerHour > 1 ? lonDiffNorm / effectiveSpeedDegPerHour : 0;

  // Latitude also affects timing — further from center line = later entry/earlier exit
  const latDiff = lat - eclipse.maxLat;
  const latTimeAdjust = Math.abs(latDiff) * 0.01; // Small adjustment

  // Local maximum time (UTC)
  const localMaxUtc = maxUtcHours + lonTimeOffset;

  // Eclipse half-duration at observer location
  // Duration depends on depth within shadow. Use quadratic scaling.
  const normalizedDist = distKm / effectivePenRadius;
  const depthFraction = Math.max(0, 1 - normalizedDist);
  // At center of penumbra: ~1.5h half-duration, at edge: ~0
  // Use sqrt for more gradual falloff (matches observed eclipse durations)
  const halfDurationHours = 1.5 * Math.sqrt(depthFraction);

  const c1Utc = localMaxUtc - halfDurationHours; // First contact (partial begins)
  const c4Utc = localMaxUtc + halfDurationHours; // Fourth contact (partial ends)

  // Convert to local time
  const c1Local = utcToLocal(c1Utc, tzOffset);
  const maxLocal = utcToLocal(localMaxUtc, tzOffset);
  const c4Local = utcToLocal(c4Utc, tzOffset);

  // Check if eclipse ends at sunset (sunset already defined above)
  const endsAtSunset = c4Local > sunset;
  const effectiveEnd = endsAtSunset ? sunset : c4Local;

  // Magnitude at sunset (if applicable)
  let magnitudeAtSunset: number | null = null;
  if (endsAtSunset) {
    // Linear interpolation: mag decreases from max to 0 as we move from maximum to c4
    const totalPhase = c4Local - maxLocal;
    const sunsetPhase = sunset - maxLocal;
    if (totalPhase > 0 && sunsetPhase > 0) {
      magnitudeAtSunset = Math.max(0, localMagnitude * (1 - sunsetPhase / totalPhase));
    }
  }

  // Duration
  const durationMinutes = Math.max(0, (effectiveEnd - c1Local) * 60);

  // Sutak: 12 hours before first contact for solar eclipse
  // Sutak for vulnerable: ~6 hours before first contact
  const sutakStartLocal = c1Local - 12;
  const sutakVulnStartLocal = c1Local - 6;

  // Visibility note
  let visibilityNote: string;
  if (localSubtype === 'total') {
    visibilityNote = 'Visible as Total Solar Eclipse';
  } else if (localSubtype === 'annular') {
    visibilityNote = 'Visible as Annular Solar Eclipse';
  } else {
    visibilityNote = `Visible as Partial Solar Eclipse (${(localMagnitude * 100).toFixed(0)}% coverage)`;
  }

  return {
    date: eclipse.date,
    type: 'solar',
    subtype: localSubtype,
    visible,
    visibilityNote,
    eclipseStart: formatTime(c1Local),
    partialStart: formatTime(c1Local), // Same as eclipseStart for solar
    maximum: formatTime(maxLocal),
    partialEnd: null, // No distinct partial end for solar
    eclipseEnd: endsAtSunset ? formatTime(sunset) : formatTime(c4Local),
    endsAtSunset,
    endsAtMoonset: false,
    maxMagnitude: Math.round(localMagnitude * 100) / 100,
    magnitudeAtSunset,
    durationMinutes,
    durationFormatted: formatDuration(durationMinutes),
    sutakApplicable: true,
    sutakStart: formatTime(sutakStartLocal),
    sutakEnd: endsAtSunset ? formatTime(sunset) : formatTime(c4Local),
    sutakVulnerableStart: formatTime(sutakVulnStartLocal),
    saros: eclipse.saros,
    gamma: eclipse.gamma,
    sunrise: sunTimes ? formatTime(sunTimes.sunrise) : null,
    sunset: sunTimes ? formatTime(sunset) : null,
  };
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Compute local eclipse circumstances for a specific observer.
 * Returns enriched data with local contact times, Sutak, visibility.
 */
export function computeLocalEclipse(
  eclipse: EclipseData,
  lat: number,
  lng: number,
  timezone: string,
): LocalEclipseResult {
  if (eclipse.kind === 'lunar') {
    return computeLunarLocal(eclipse, lat, lng, timezone);
  }
  return computeSolarLocal(eclipse, lat, lng, timezone);
}
