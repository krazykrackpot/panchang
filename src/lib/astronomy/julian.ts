/**
 * Julian Day Number calculations
 * Based on Jean Meeus, "Astronomical Algorithms" (2nd ed.)
 */

export function dateToJD(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): number {
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + B - 1524.5;
}

export function jdToDate(jd: number): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;

  let A: number;
  if (z < 2299161) {
    A = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayFraction = B - D - Math.floor(30.6001 * E) + f;
  const day = Math.floor(dayFraction);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const totalHours = (dayFraction - day) * 24;
  const hour = Math.floor(totalHours);
  const totalMinutes = (totalHours - hour) * 60;
  const minute = Math.floor(totalMinutes);
  const second = Math.round((totalMinutes - minute) * 60);

  return { year, month, day, hour, minute, second };
}

/** Julian centuries from J2000.0 */
export function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/** Convert Date object to JD (assumes UTC) */
export function dateObjectToJD(date: Date): number {
  return dateToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

/** Normalize angle to 0-360 range */
export function normalizeAngle(angle: number): number {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/** Degrees to radians */
export function degToRad(deg: number): number {
  return deg * Math.PI / 180;
}

/** Radians to degrees */
export function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}
