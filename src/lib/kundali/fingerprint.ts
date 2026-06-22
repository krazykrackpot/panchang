/**
 * Deterministic kundali fingerprint — SHA-256 of normalised birth params.
 *
 * Used by the paywall to identify "the same chart" across re-unlock
 * attempts (typo correction, browser refresh, account switch). Re-unlock
 * matches an existing entitlement on (user_id, fingerprint) and is a
 * no-op — never double-charges.
 *
 * Normalisation rules (mirror lesson G in CLAUDE.md):
 *  - birth_date: YYYY-MM-DD, validated
 *  - birth_time: HH:MM (UTC offset NOT included; the user enters local
 *    civil time, and the timezone is a separate input that derives from
 *    lat/lng — so two charts at the same local time + lat/lng are the
 *    same chart even across timezone-data updates)
 *  - birth_lat / birth_lng: rounded to 4 decimal places (~11 m precision
 *    at the equator — well below the granularity at which the lagna
 *    cusp moves; charts within 11 m are the same chart)
 *
 * The hash is computed SERVER-SIDE only — clients never see this code
 * path. If a client could compute the fingerprint, it could craft one
 * for someone else's chart and steal an entitlement.
 */

import { createHash } from 'node:crypto';

export interface BirthParams {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  lat: number;
  lng: number;
}

/** Round to 4 decimals, returning a stable string like "28.6139". */
function normaliseCoord(n: number): string {
  // Math.round(n * 10000) / 10000 has float-precision artefacts (e.g.
  // 28.6139 → 28.61389999...). Format directly to fixed-4 instead.
  return n.toFixed(4);
}

/** YYYY-MM-DD passthrough with light validation. Throws on malformed input. */
function normaliseDate(d: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    throw new Error(`fingerprint: birth date "${d}" is not YYYY-MM-DD`);
  }
  return d;
}

/** HH:MM with light validation (24h, 00–23 / 00–59). Throws on malformed input. */
function normaliseTime(t: string): string {
  const m = /^(\d{2}):(\d{2})$/.exec(t);
  if (!m) {
    throw new Error(`fingerprint: birth time "${t}" is not HH:MM`);
  }
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) {
    throw new Error(`fingerprint: birth time "${t}" out of range`);
  }
  return t;
}

/**
 * Compute the kundali fingerprint. Pure function — same input → same
 * 64-character lowercase hex string forever.
 */
export function computeKundaliFingerprint(birth: BirthParams): string {
  const parts = [
    normaliseDate(birth.date),
    normaliseTime(birth.time),
    normaliseCoord(birth.lat),
    normaliseCoord(birth.lng),
  ];
  // Pipe is fine as a separator — none of the normalised parts can
  // contain a pipe character.
  const payload = parts.join('|');
  return createHash('sha256').update(payload).digest('hex');
}
