/**
 * Chandra Darshan — New Crescent Moon Visibility Calculator
 *
 * Computes whether the young crescent Moon is visible after sunset on a given date.
 * Uses a simplified Yallop/Odeh visibility model based on:
 *   - Moon age (hours since last Sun-Moon conjunction / Amavasya)
 *   - Elongation (angular separation between Moon and Sun)
 *   - Moon altitude at sunset (approximate)
 *
 * Accuracy note: Moon longitude from Meeus has ~0.5deg error; elongation-based
 * visibility thresholds are generous enough to absorb this. The model errs on the
 * side of "possible" rather than "definite" — real naked-eye sighting depends on
 * atmospheric conditions, observer skill, and horizon obstruction.
 */

import {
  dateToJD,
  sunLongitude,
  moonLongitude,
  normalizeDeg,
  approximateSunsetSafe,
  formatTime,
  toRad,
  toDeg,
} from '@/lib/ephem/astronomical';

export interface ChandraDarshanInfo {
  /** Whether the young Moon is potentially visible tonight */
  isVisible: boolean;
  /** Moon age in hours since last new Moon (conjunction) */
  moonAgeHours: number;
  /** Moon elongation from Sun in degrees -- needs > ~7deg for visibility */
  elongationDeg: number;
  /** Approximate Moon altitude at sunset in degrees */
  altitudeAtSunset: number;
  /** Visibility assessment */
  assessment: 'not_visible' | 'difficult' | 'visible' | 'easily_visible';
  /** Human-readable description */
  description: { en: string; hi: string };
  /** Best viewing time (just after sunset), local time string HH:MM or null */
  bestViewingTime: string | null;
  /** Best viewing direction */
  direction: { en: string; hi: string };
  /** JD of the most recent new Moon (conjunction) */
  newMoonJD: number;
  /** Date of the most recent new Moon as ISO string */
  newMoonDate: string;
}

/**
 * Find the most recent new Moon (Sun-Moon conjunction) by scanning backward from
 * the given JD. New Moon = elongation ~0 (Moon longitude == Sun longitude).
 *
 * Strategy: step back in 1-day increments until elongation wraps from a large
 * value (>300) to a small value (<60), then binary-search the exact crossing.
 */
function findRecentNewMoon(jd: number): number {
  // Walk backward day by day, looking for the minimum elongation
  let prevElong = normalizeDeg(moonLongitude(jd) - sunLongitude(jd));

  // If elongation is already very small (<10deg), we're right at new Moon.
  // Step back further to find the actual minimum.
  let searchJD = jd;
  for (let i = 0; i < 35; i++) {
    searchJD -= 1;
    const elong = normalizeDeg(moonLongitude(searchJD) - sunLongitude(searchJD));
    // Detect the wrap: previous elongation was small (<60) and current is large (>300)
    // That means we've crossed backward past the conjunction
    if (elong > 300 && prevElong < 60) {
      // Conjunction is between searchJD and searchJD+1
      // Binary search for the minimum elongation
      let lo = searchJD;
      let hi = searchJD + 1;
      for (let j = 0; j < 30; j++) {
        const mid = (lo + hi) / 2;
        const eMid = normalizeDeg(moonLongitude(mid) - sunLongitude(mid));
        // Check which side of the minimum we're on
        const eLeft = normalizeDeg(moonLongitude(mid - 0.001) - sunLongitude(mid - 0.001));
        if (eLeft > eMid || eLeft > 300) {
          // Minimum is at or after mid
          lo = mid;
        } else {
          hi = mid;
        }
        // If elongation is tiny, we've found it
        if (eMid < 0.5) break;
      }
      return (lo + hi) / 2;
    }
    prevElong = elong;
  }

  // Fallback: if we didn't find a wrap, look for minimum elongation in the last 30 days
  let minElong = 999;
  let minJD = jd;
  for (let d = 0; d < 35; d++) {
    const testJD = jd - d;
    const e = normalizeDeg(moonLongitude(testJD) - sunLongitude(testJD));
    // Elongation near 0 or near 360 both mean conjunction
    const effElong = e > 180 ? 360 - e : e;
    if (effElong < minElong) {
      minElong = effElong;
      minJD = testJD;
    }
  }
  return minJD;
}

/**
 * Approximate Moon altitude at a given JD for a given location.
 * Uses a simplified approach: Moon's ecliptic latitude + elongation-based
 * elevation above the western horizon at sunset.
 *
 * For a more accurate result we'd need full equatorial coordinate transform,
 * but for visibility assessment this gives a reasonable estimate.
 */
function approxMoonAltitudeAtSunset(
  sunsetJD: number,
  elongation: number,
  lat: number,
): number {
  // Very rough: the Moon's altitude above the horizon at sunset is approximately
  // elongation * sin(angle) where angle depends on latitude and season.
  // For a first-order approximation, altitude ~ elongation * 0.7 for mid-latitudes.
  // At higher latitudes the ecliptic is more tilted, so the factor varies.
  const latFactor = Math.cos(toRad(Math.abs(lat) - 30)); // peaks at 30deg latitude
  const alt = elongation * 0.7 * Math.max(0.4, Math.min(1.0, latFactor));
  return Math.min(alt, 25); // Cap at reasonable max
}

/**
 * Compute the next new Moon from a given JD by scanning forward.
 */
export function findNextNewMoon(jd: number): number {
  let prevElong = normalizeDeg(moonLongitude(jd) - sunLongitude(jd));
  let searchJD = jd;

  for (let i = 0; i < 35; i++) {
    searchJD += 1;
    const elong = normalizeDeg(moonLongitude(searchJD) - sunLongitude(searchJD));
    // Detect wrap from large (>300) to small (<60) = conjunction
    if (prevElong > 300 && elong < 60) {
      // Binary search
      let lo = searchJD - 1;
      let hi = searchJD;
      for (let j = 0; j < 30; j++) {
        const mid = (lo + hi) / 2;
        const eMid = normalizeDeg(moonLongitude(mid) - sunLongitude(mid));
        const eRight = normalizeDeg(moonLongitude(mid + 0.001) - sunLongitude(mid + 0.001));
        if (eRight < eMid || eMid > 300) {
          lo = mid;
        } else {
          hi = mid;
        }
        if (eMid < 0.5) break;
      }
      return (lo + hi) / 2;
    }
    prevElong = elong;
  }

  // Fallback: scan for minimum
  let minElong = 999;
  let minJD = jd;
  for (let d = 0; d < 35; d++) {
    const testJD = jd + d;
    const e = normalizeDeg(moonLongitude(testJD) - sunLongitude(testJD));
    const effElong = e > 180 ? 360 - e : e;
    if (effElong < minElong) {
      minElong = effElong;
      minJD = testJD;
    }
  }
  return minJD;
}

/**
 * Format a JD as an ISO date string (UTC).
 */
function jdToISODate(jd: number): string {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = Math.floor(b - d - Math.floor(30.6001 * e) + f);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Compute Chandra Darshan (new crescent Moon visibility) for a given date and location.
 *
 * @param year - Calendar year
 * @param month - Calendar month (1-12)
 * @param day - Calendar day (1-31)
 * @param lat - Observer latitude in degrees
 * @param lng - Observer longitude in degrees
 * @param tzOffset - UTC offset in hours (e.g. 5.5 for IST, 1 for CET)
 */
export function computeChandraDarshan(
  year: number,
  month: number,
  day: number,
  lat: number,
  lng: number,
  tzOffset: number,
): ChandraDarshanInfo {
  // 1. JD at noon UT for the given date
  const jdNoon = dateToJD(year, month, day, 12);

  // 2. Sunset time (decimal hours UT) for this date
  const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);
  // JD at sunset
  const jdSunset = dateToJD(year, month, day, sunsetUT);

  // 3. Sun and Moon longitudes at sunset
  const sunLng = sunLongitude(jdSunset);
  const moonLng = moonLongitude(jdSunset);

  // 4. Elongation = angular separation (Moon ahead of Sun)
  const elongation = normalizeDeg(moonLng - sunLng);

  // 5. Find most recent new Moon
  const newMoonJD = findRecentNewMoon(jdSunset);

  // 6. Moon age in hours
  const moonAgeHours = (jdSunset - newMoonJD) * 24;

  // 7. Approximate Moon altitude at sunset
  const altitude = approxMoonAltitudeAtSunset(jdSunset, elongation, lat);

  // 8. Apply visibility criteria (simplified Yallop/Odeh)
  let assessment: ChandraDarshanInfo['assessment'];
  if (moonAgeHours < 15 || elongation < 7 || elongation > 180) {
    assessment = 'not_visible';
  } else if (moonAgeHours < 24 && elongation >= 10) {
    assessment = 'difficult';
  } else if (moonAgeHours >= 24 && moonAgeHours < 36 && elongation >= 12) {
    assessment = 'visible';
  } else if (moonAgeHours >= 36 && elongation >= 15) {
    assessment = 'easily_visible';
  } else if (moonAgeHours >= 24 && elongation >= 7 && elongation < 12) {
    assessment = 'difficult';
  } else if (moonAgeHours >= 15 && elongation >= 7) {
    assessment = 'difficult';
  } else {
    assessment = 'not_visible';
  }

  // Override: if elongation > 180 then Moon is behind Sun (past full Moon), not a new crescent
  if (elongation > 180) {
    assessment = 'not_visible';
  }

  const isVisible = assessment === 'visible' || assessment === 'easily_visible';

  // 9. Description
  const description = getDescription(assessment, moonAgeHours, elongation);

  // 10. Best viewing time: sunset + 25 min (when sky is dark enough but Moon hasn't set)
  let bestViewingTime: string | null = null;
  if (assessment !== 'not_visible') {
    const viewingHoursUT = sunsetUT + 25 / 60; // 25 minutes after sunset
    bestViewingTime = formatTime(viewingHoursUT, tzOffset);
  }

  // 11. Direction — always western horizon for new crescent
  const direction = {
    en: 'Western horizon, slightly above where the Sun set',
    hi: 'पश्चिमी क्षितिज, जहाँ सूर्यास्त हुआ उससे थोड़ा ऊपर',
  };

  return {
    isVisible,
    moonAgeHours: Math.round(moonAgeHours * 10) / 10,
    elongationDeg: Math.round(elongation * 10) / 10,
    altitudeAtSunset: Math.round(altitude * 10) / 10,
    assessment,
    description,
    bestViewingTime,
    direction,
    newMoonJD,
    newMoonDate: jdToISODate(newMoonJD),
  };
}

function getDescription(
  assessment: ChandraDarshanInfo['assessment'],
  ageHours: number,
  elongation: number,
): { en: string; hi: string } {
  const ageStr = Math.round(ageHours);
  const elongStr = Math.round(elongation);

  switch (assessment) {
    case 'not_visible':
      return {
        en: `The crescent Moon is not visible tonight. Moon age is ${ageStr} hours with ${elongStr}\u00b0 elongation — too close to the Sun for naked-eye sighting.`,
        hi: `आज रात चन्द्र दर्शन सम्भव नहीं है। चन्द्रमा की आयु ${ageStr} घण्टे और ${elongStr}\u00b0 दूरी — सूर्य से बहुत निकट।`,
      };
    case 'difficult':
      return {
        en: `Difficult sighting conditions. Moon age is ${ageStr} hours with ${elongStr}\u00b0 elongation. Binoculars may help — look west just after sunset with a clear horizon.`,
        hi: `कठिन दर्शन स्थिति। चन्द्रमा की आयु ${ageStr} घण्टे और ${elongStr}\u00b0 दूरी। दूरबीन सहायक हो सकती है — सूर्यास्त के तुरन्त बाद पश्चिम में देखें।`,
      };
    case 'visible':
      return {
        en: `The new crescent Moon should be visible tonight! Moon age is ${ageStr} hours with ${elongStr}\u00b0 elongation. Look west 20-30 minutes after sunset.`,
        hi: `आज रात नव चन्द्र दर्शन सम्भव है! चन्द्रमा की आयु ${ageStr} घण्टे और ${elongStr}\u00b0 दूरी। सूर्यास्त के 20-30 मिनट बाद पश्चिम में देखें।`,
      };
    case 'easily_visible':
      return {
        en: `The crescent Moon is easily visible tonight. Moon age is ${ageStr} hours with ${elongStr}\u00b0 elongation — a beautiful thin crescent in the western sky after sunset.`,
        hi: `आज रात चन्द्र दर्शन सुगमता से सम्भव है। चन्द्रमा की आयु ${ageStr} घण्टे और ${elongStr}\u00b0 दूरी — सूर्यास्त के बाद पश्चिमी आकाश में सुन्दर पतला चन्द्रमा।`,
      };
  }
}

/**
 * Compute upcoming Chandra Darshan dates for the next N months.
 * Returns one entry per lunation — the first evening after each new Moon
 * when the crescent becomes visible.
 */
export function getUpcomingDarshan(
  year: number,
  month: number,
  day: number,
  lat: number,
  lng: number,
  tzOffset: number,
  count: number = 6,
): ChandraDarshanInfo[] {
  const results: ChandraDarshanInfo[] = [];
  let currentJD = dateToJD(year, month, day, 12);

  for (let i = 0; i < count; i++) {
    // Find the next new Moon from current position
    const nmJD = findNextNewMoon(currentJD);

    // Check visibility on the evening of new Moon day, +1, +2, +3
    for (let offset = 0; offset <= 3; offset++) {
      const testJD = nmJD + offset;
      const isoDate = jdToISODate(testJD);
      const [y, m, d] = isoDate.split('-').map(Number);
      const info = computeChandraDarshan(y, m, d, lat, lng, tzOffset);

      if (info.assessment !== 'not_visible') {
        results.push(info);
        break;
      }

      // If we've checked 4 days and still not visible, add the +2 day as "difficult"
      if (offset === 3) {
        const fallbackDate = jdToISODate(nmJD + 2);
        const [fy, fm, fd] = fallbackDate.split('-').map(Number);
        results.push(computeChandraDarshan(fy, fm, fd, lat, lng, tzOffset));
      }
    }

    // Move past this lunation (jump ~30 days ahead)
    currentJD = nmJD + 25;
  }

  return results;
}
