/**
 * MCP-package-local timezone helper.
 *
 * The main app's `resolveCurrentLocationTimezone` in
 * src/lib/utils/timezone.ts is async and tries an external HTTP API first
 * (timeapi.io) before falling back to tz-lookup. Inside the MCP server
 * we want a synchronous, offline-only resolver — no outbound network,
 * no per-call cost. tz-lookup ships pre-computed geographic boundaries
 * and covers every populated point on the globe.
 */

// tz-lookup is a plain CommonJS default export: (lat, lng) => 'Asia/Kolkata'
// The package has no @types; keep the shape narrow.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import tzLookup from 'tz-lookup';

/**
 * Resolve an IANA timezone identifier from latitude and longitude.
 * Purely offline — no network, no per-call cost.
 * Throws only if the coordinates are outside the valid range.
 */
export function resolveTimezoneFromCoords(lat: number, lng: number): string {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    throw new Error(
      `Invalid coordinates: lat=${lat}, lng=${lng}. Expected lat in [-90, 90] and lng in [-180, 180].`,
    );
  }
  return tzLookup(lat, lng);
}
