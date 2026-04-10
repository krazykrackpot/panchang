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

import type { EclipseData, LunarEclipseData, SolarEclipseData } from './eclipse-data';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import { sunLongitude, moonLongitude, getPlanetaryPositions, dateToJD, normalizeDeg } from '@/lib/ephem/astronomical';

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

  // Sutak — computed per 3 classical traditions
  sutakApplicable: boolean;     // False if eclipse not visible from location
  sutakStart: string | null;    // Recommended (most aggressive/earliest) HH:MM local
  sutakEnd: string | null;      // HH:MM local time
  sutakVulnerableStart: string | null; // For children, elderly, pregnant, sick
  sutakTraditions: {
    nirnyaSindhu: { start: string; label: string } | null;       // Fixed 12h solar / 9h lunar
    dharmaSindhu: { start: string; label: string } | null;       // Variable prahar-based
    muhurtaChintamani: { start: string; label: string } | null;  // From previous sunrise
  };

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

  // Sutak: compute per 3 traditions
  const sutak = computeSutakTraditions(p1Local, p4Local, false, sunrise, sunset);

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
    sutakStart: visible ? formatTime(sutak.recommended) : null,
    sutakEnd: visible ? formatTime(sutak.end) : null,
    sutakVulnerableStart: visible ? formatTime(sutak.vulnerableStart) : null,
    sutakTraditions: visible ? {
      nirnyaSindhu: { start: formatTime(sutak.traditions.nirnyaSindhu.start), label: sutak.traditions.nirnyaSindhu.label },
      dharmaSindhu: { start: formatTime(sutak.traditions.dharmaSindhu.start), label: sutak.traditions.dharmaSindhu.label },
      muhurtaChintamani: { start: formatTime(sutak.traditions.muhurtaChintamani.start), label: sutak.traditions.muhurtaChintamani.label },
    } : { nirnyaSindhu: null, dharmaSindhu: null, muhurtaChintamani: null },
    saros: eclipse.saros,
    gamma: eclipse.gamma,
    sunrise: sunTimes ? formatTime(sunTimes.sunrise) : null,
    sunset: sunTimes ? formatTime(sunTimes.sunset) : null,
  };
}

// ─── Sutak Calculation (3 Classical Traditions) ──────────────────────────────

interface SutakResult {
  recommended: number;        // Earliest (most aggressive) start time in local hours
  vulnerableStart: number;    // Start for children/elderly/sick
  end: number;                // Sutak end time
  traditions: {
    nirnyaSindhu: { start: number; label: string };
    dharmaSindhu: { start: number; label: string };
    muhurtaChintamani: { start: number; label: string };
  };
}

/**
 * Compute Sutak times per 3 classical traditions.
 * @param eclipseStartLocal - first contact in local fractional hours
 * @param eclipseEndLocal - last contact in local fractional hours
 * @param isSolar - true for solar, false for lunar
 * @param sunriseLocal - local sunrise in fractional hours
 * @param sunsetLocal - local sunset in fractional hours
 */
function computeSutakTraditions(
  eclipseStartLocal: number,
  eclipseEndLocal: number,
  isSolar: boolean,
  sunriseLocal: number,
  sunsetLocal: number,
): SutakResult {
  // 1. Nirnaya Sindhu — fixed 12h (solar) or 9h (lunar) before sparsha
  const nsHours = isSolar ? 12 : 9;
  const nsStart = eclipseStartLocal - nsHours;
  const nsLabel = isSolar ? '12 hours before sparsha' : '9 hours before sparsha';

  // 2. Dharma Sindhu — 4 prahars (solar) or 3 prahars (lunar) before sparsha
  //    A prahar (yama) = 1/8 of the ahoratra (sunrise-to-sunrise = ~24h)
  //    But traditionally, day-prahars and night-prahars have different lengths:
  //    Day prahar = (sunset - sunrise) / 4
  //    Night prahar = (next sunrise - sunset) / 4
  //    For Sutak, the tradition uses the full ahoratra prahar = ~3h but seasonal.
  const dayLength = sunsetLocal - sunriseLocal; // hours of daylight
  const nightLength = 24 - dayLength;
  // Prahar for Sutak: use the ahoratra (24h) divided by 8
  const praharLength = (dayLength + nightLength) / 8; // ~3h but varies slightly
  // Actually, Dharmasindhu uses day-prahars if eclipse is during day:
  const dayPrahar = dayLength / 4;
  const nightPrahar = nightLength / 4;
  // For solar eclipses (always during day): use day-prahars × 4
  // For lunar eclipses (always during night): use night-prahars × 3
  const dsPrahars = isSolar ? 4 : 3;
  const dsPraharLen = isSolar ? dayPrahar : nightPrahar;
  const dsStart = eclipseStartLocal - (dsPrahars * dsPraharLen);
  const dsLabel = isSolar
    ? `4 day-prahars (${Math.round(dsPraharLen * 60)}m each) before sparsha`
    : `3 night-prahars (${Math.round(dsPraharLen * 60)}m each) before sparsha`;

  // 3. Muhurta Chintamani — from previous sunrise
  //    If eclipse is today after sunrise, Sutak starts at today's sunrise.
  //    If eclipse is before sunrise (e.g., early morning lunar eclipse),
  //    Sutak starts at previous day's sunrise (~yesterday's sunrise ≈ today's - 24h).
  const mcStart = eclipseStartLocal >= sunriseLocal
    ? sunriseLocal
    : sunriseLocal - 24; // previous sunrise
  const mcLabel = 'From sunrise of the eclipse day';

  // Recommended = most aggressive (earliest start)
  const recommended = Math.min(nsStart, dsStart, mcStart);

  // Vulnerable persons: roughly half the general Sutak
  // Nirnaya Sindhu says 6h solar / 4.5h lunar for vulnerable
  const vulnerableStart = eclipseStartLocal - (isSolar ? 6 : 4.5);

  return {
    recommended,
    vulnerableStart,
    end: eclipseEndLocal,
    traditions: {
      nirnyaSindhu: { start: nsStart, label: nsLabel },
      dharmaSindhu: { start: dsStart, label: dsLabel },
      muhurtaChintamani: { start: mcStart, label: mcLabel },
    },
  };
}

// ─── Solar Eclipse: Direct Topocentric Computation ──────────────────────────
//
// For any observer lat/lng, we compute the apparent angular separation between
// Sun and Moon as seen from that location (applying lunar parallax), then scan
// for when separation equals the sum of their apparent radii (contact times).
// No city lookups, no interpolation — pure calculation from Swiss Ephemeris.

/** Degrees to radians */
const DEG2RAD = Math.PI / 180;

/**
 * Compute the apparent angular separation between Sun and Moon as seen from
 * a specific point on Earth's surface (topocentric), accounting for lunar parallax.
 *
 * The parallax is crucial for solar eclipses — it can shift the Moon's apparent
 * position by up to ~1°, which is the entire difference between "no eclipse" and
 * "91% partial eclipse" for a location like Zurich.
 *
 * Method: Convert geocentric ecliptic coordinates to topocentric equatorial
 * coordinates using the observer's geographic position, then compute the
 * angular separation between the topocentric Sun and Moon.
 */
function topocentricSeparation(jd: number, obsLat: number, obsLng: number): {
  separation: number;
  sunRadius: number;
  moonRadius: number;
} {
  const positions = getPlanetaryPositions(jd);
  const sunPos = positions.find(p => p.id === 0);
  const moonPos = positions.find(p => p.id === 1);
  if (!sunPos || !moonPos) return { separation: 999, sunRadius: 0.267, moonRadius: 0.259 };

  // Moon distance from speed (proxy): faster = closer
  const avgDist = 384400;
  const moonDist = avgDist * (13.2 / Math.max(Math.abs(moonPos.speed), 10));

  // Moon horizontal parallax
  const HP = Math.asin(6371 / moonDist) / DEG2RAD; // ~0.9° to ~1.03°

  // Obliquity of ecliptic (~23.44°)
  const obliquity = 23.44;
  const oblRad = obliquity * DEG2RAD;

  // Convert Sun from ecliptic to equatorial (RA, Dec)
  const sunLonRad = sunPos.longitude * DEG2RAD;
  const sunRA = Math.atan2(Math.sin(sunLonRad) * Math.cos(oblRad), Math.cos(sunLonRad));
  const sunDec = Math.asin(Math.sin(sunLonRad) * Math.sin(oblRad));

  // Convert Moon from ecliptic to equatorial (RA, Dec)
  const moonLonRad = moonPos.longitude * DEG2RAD;
  const moonLatRad = moonPos.latitude * DEG2RAD;
  const moonRA = Math.atan2(
    Math.sin(moonLonRad) * Math.cos(oblRad) - Math.tan(moonLatRad) * Math.sin(oblRad),
    Math.cos(moonLonRad)
  );
  const moonDec = Math.asin(
    Math.sin(moonLatRad) * Math.cos(oblRad) +
    Math.cos(moonLatRad) * Math.sin(oblRad) * Math.sin(moonLonRad)
  );

  // Greenwich Sidereal Time (approximate)
  const T = (jd - 2451545.0) / 36525.0;
  const GMST = normalizeDeg(280.46061837 + 360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T) * DEG2RAD;

  // Local Sidereal Time
  const LST = GMST + obsLng * DEG2RAD;

  // Moon's Hour Angle
  const moonHA = LST - moonRA;

  // Apply topocentric parallax to Moon (Sun parallax is negligible)
  const obsLatRad = obsLat * DEG2RAD;
  const HPRad = HP * DEG2RAD;

  // Topocentric Moon RA and Dec (Meeus Ch. 40)
  const cosHP = Math.cos(HPRad);
  const sinHP = Math.sin(HPRad);
  const cosMoonDec = Math.cos(moonDec);
  const sinMoonDec = Math.sin(moonDec);
  const cosObsLat = Math.cos(obsLatRad);
  const sinObsLat = Math.sin(obsLatRad);
  const cosHA = Math.cos(moonHA);
  const sinHA = Math.sin(moonHA);

  // Parallax correction in RA
  const dRA = Math.atan2(
    -cosObsLat * sinHP * sinHA,
    cosMoonDec - cosObsLat * sinHP * cosHA
  );

  // Topocentric declination
  const topoMoonDec = Math.atan2(
    (sinMoonDec - sinObsLat * sinHP) * Math.cos(dRA),
    cosMoonDec - cosObsLat * sinHP * cosHA
  );

  const topoMoonRA = moonRA + dRA;

  // Angular separation between Sun and topocentric Moon
  const cosSep = Math.sin(sunDec) * Math.sin(topoMoonDec) +
    Math.cos(sunDec) * Math.cos(topoMoonDec) * Math.cos(sunRA - topoMoonRA);
  const separation = Math.acos(Math.max(-1, Math.min(1, cosSep))) / DEG2RAD;

  // Apparent radii
  const sunRadius = 0.267;
  const moonRadius = Math.asin(1737.4 / moonDist) / DEG2RAD;

  return { separation, sunRadius, moonRadius };
}

/**
 * Compute local solar eclipse circumstances by scanning the topocentric
 * Sun-Moon separation around the time of greatest eclipse.
 */
function computeSolarContactTimes(
  maxJdUtc: number,
  obsLat: number,
  obsLng: number,
): {
  c1Jd: number | null;  // First contact (partial begins)
  maxJd: number | null;  // Local maximum
  c4Jd: number | null;  // Last contact (partial ends)
  maxMagnitude: number;  // Local magnitude at maximum
  visible: boolean;
} {
  // Scan window: ±3 hours from greatest eclipse in 1-minute steps
  const scanStep = 1 / 1440; // 1 minute in days
  const scanHalfWidth = 3 / 24; // 3 hours in days

  let minSep = 999;
  let minSepJd = maxJdUtc;
  let contactRadius = 0;

  // First pass: find local minimum separation and contact radius
  for (let jd = maxJdUtc - scanHalfWidth; jd <= maxJdUtc + scanHalfWidth; jd += scanStep) {
    const { separation, sunRadius, moonRadius } = topocentricSeparation(jd, obsLat, obsLng);
    const sumRadii = sunRadius + moonRadius;

    if (separation < minSep) {
      minSep = separation;
      minSepJd = jd;
      contactRadius = sumRadii;
    }
  }

  // Not visible if minimum separation > sum of radii
  if (minSep >= contactRadius) {
    return { c1Jd: null, maxJd: null, c4Jd: null, maxMagnitude: 0, visible: false };
  }

  // Local magnitude: 1.0 when separation = 0 (total), 0 when separation = sumRadii
  const maxMagnitude = Math.max(0, (contactRadius - minSep) / contactRadius);

  // Second pass: find C1 (first contact) and C4 (last contact)
  // Scan forward and backward from maximum to find when separation = sumRadii
  let c1Jd: number | null = null;
  let c4Jd: number | null = null;

  // Find C1: scan backward from maximum
  for (let jd = minSepJd; jd >= maxJdUtc - scanHalfWidth; jd -= scanStep) {
    const { separation, sunRadius, moonRadius } = topocentricSeparation(jd, obsLat, obsLng);
    if (separation >= sunRadius + moonRadius) {
      // Refine with binary search
      let lo = jd, hi = jd + scanStep;
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        const s = topocentricSeparation(mid, obsLat, obsLng);
        if (s.separation >= s.sunRadius + s.moonRadius) lo = mid; else hi = mid;
      }
      c1Jd = (lo + hi) / 2;
      break;
    }
  }

  // Find C4: scan forward from maximum
  for (let jd = minSepJd; jd <= maxJdUtc + scanHalfWidth; jd += scanStep) {
    const { separation, sunRadius, moonRadius } = topocentricSeparation(jd, obsLat, obsLng);
    if (separation >= sunRadius + moonRadius) {
      let lo = jd - scanStep, hi = jd;
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        const s = topocentricSeparation(mid, obsLat, obsLng);
        if (s.separation >= s.sunRadius + s.moonRadius) hi = mid; else lo = mid;
      }
      c4Jd = (lo + hi) / 2;
      break;
    }
  }

  return { c1Jd, maxJd: minSepJd, c4Jd, maxMagnitude, visible: true };
}

// ─── Solar Eclipse Computation (Topocentric) ────────────────────────────────

function computeSolarLocal(eclipse: SolarEclipseData, lat: number, lng: number, timezone: string): LocalEclipseResult {
  const tzOffset = getTzOffset(timezone, eclipse.date);
  const sunTimes = getSunriseSunset(eclipse.date, lat, lng, tzOffset);
  const sunset = sunTimes?.sunset ?? 20;
  const sunrise = sunTimes?.sunrise ?? 6;

  // Compute local eclipse from first principles using topocentric Sun-Moon separation
  const maxJdUtc = (() => {
    // Parse maxUtc (HH:MM:SS) to JD
    const [y, m, d] = eclipse.date.split('-').map(Number);
    const utcH = parseUtcTime(eclipse.maxUtc);
    return dateToJD(y, m, d, utcH);
  })();

  const topo = computeSolarContactTimes(maxJdUtc, lat, lng);

  if (topo.visible && topo.c1Jd && topo.maxJd && topo.c4Jd) {
    // Convert JD to local hours of the day
    const jdToLocalHours = (jd: number): number => {
      // JD 0.0 = noon UT, JD 0.5 = midnight UT
      // Hours UTC = ((JD + 0.5) fraction) * 24
      const utcHours = ((jd + 0.5) % 1) * 24;
      return utcToLocal(utcHours, tzOffset);
    };

    const c1Local = jdToLocalHours(topo.c1Jd);
    const maxLocal = jdToLocalHours(topo.maxJd);
    const c4Local = jdToLocalHours(topo.c4Jd);

    const endsAtSunset = c4Local > sunset;
    const effectiveEnd = endsAtSunset ? sunset : c4Local;
    const durationMinutes = Math.max(0, (effectiveEnd - c1Local) * 60);

    const localSubtype: LocalEclipseResult['subtype'] =
      topo.maxMagnitude >= 1.0 && eclipse.type !== 'partial' ? eclipse.type : 'partial';

    // Magnitude at sunset
    let magAtSunset: number | null = null;
    if (endsAtSunset && sunset > maxLocal) {
      const totalPhase = c4Local - maxLocal;
      const sunsetPhase = sunset - maxLocal;
      if (totalPhase > 0) {
        magAtSunset = Math.max(0, topo.maxMagnitude * (1 - sunsetPhase / totalPhase));
        magAtSunset = Math.round(magAtSunset * 100) / 100;
      }
    }

    // Sutak
    const sutak = computeSutakTraditions(c1Local, effectiveEnd, true, sunrise, sunset);

    let visibilityNote: string;
    if (localSubtype === 'total') visibilityNote = 'Visible as Total Solar Eclipse';
    else if (localSubtype === 'annular') visibilityNote = 'Visible as Annular Solar Eclipse';
    else visibilityNote = `Visible as Partial Solar Eclipse (${Math.round(topo.maxMagnitude * 100)}% coverage)`;

    return {
      date: eclipse.date,
      type: 'solar',
      subtype: localSubtype,
      visible: true,
      visibilityNote,
      eclipseStart: formatTime(c1Local),
      partialStart: formatTime(c1Local),
      maximum: formatTime(maxLocal),
      partialEnd: null,
      eclipseEnd: formatTime(effectiveEnd),
      endsAtSunset,
      endsAtMoonset: false,
      maxMagnitude: Math.round(topo.maxMagnitude * 100) / 100,
      magnitudeAtSunset: magAtSunset,
      durationMinutes,
      durationFormatted: formatDuration(durationMinutes),
      sutakApplicable: true,
      sutakStart: formatTime(sutak.recommended),
      sutakEnd: formatTime(sutak.end),
      sutakVulnerableStart: formatTime(sutak.vulnerableStart),
      sutakTraditions: {
        nirnyaSindhu: { start: formatTime(sutak.traditions.nirnyaSindhu.start), label: sutak.traditions.nirnyaSindhu.label },
        dharmaSindhu: { start: formatTime(sutak.traditions.dharmaSindhu.start), label: sutak.traditions.dharmaSindhu.label },
        muhurtaChintamani: { start: formatTime(sutak.traditions.muhurtaChintamani.start), label: sutak.traditions.muhurtaChintamani.label },
      },
      saros: eclipse.saros,
      gamma: eclipse.gamma,
      sunrise: sunTimes ? formatTime(sunrise) : null,
      sunset: sunTimes ? formatTime(sunset) : null,
    };
  }

  // Not visible from this location
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
    sutakTraditions: { nirnyaSindhu: null, dharmaSindhu: null, muhurtaChintamani: null },
    saros: eclipse.saros, gamma: eclipse.gamma,
    sunrise: sunTimes ? formatTime(sunrise) : null,
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
