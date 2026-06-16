// Input validation for the WhatsApp opt-in API routes.
//
// Centralised so the same E.164 format check, locale allowlist, and timezone
// validation logic runs identically across /optin, /verify, and /optout.
// Mirrors the SQL constraints in migration 065 — a request that passes these
// checks is guaranteed to satisfy the DB constraints too.

const ALLOWED_LOCALES = [
  'en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr',
] as const;
export type AllowedLocale = (typeof ALLOWED_LOCALES)[number];

export function isAllowedLocale(v: unknown): v is AllowedLocale {
  return typeof v === 'string' && (ALLOWED_LOCALES as readonly string[]).includes(v);
}

// E.164: + followed by 7-15 digits, first digit 1-9
const E164_RE = /^\+[1-9][0-9]{6,14}$/;

export function isValidE164(v: unknown): v is string {
  return typeof v === 'string' && E164_RE.test(v);
}

// IANA timezone — lazy check via Intl. Cheaper than shipping the full IANA
// list. Caches the result so repeated calls for "Asia/Kolkata" are O(1).
const TZ_CACHE = new Map<string, boolean>();
export function isValidIanaTimezone(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  if (TZ_CACHE.has(v)) return TZ_CACHE.get(v)!;
  try {
    new Intl.DateTimeFormat('en', { timeZone: v });
    TZ_CACHE.set(v, true);
    return true;
  } catch {
    TZ_CACHE.set(v, false);
    return false;
  }
}

// send_time_local must be HH:MM:00 with HH in 00-23 and MM == 00 (top-of-hour
// per migration's send_time_is_top_of_hour CHECK).
const TIME_RE = /^([01][0-9]|2[0-3]):00(?::00)?$/;

export function isTopOfHourTime(v: unknown): v is string {
  return typeof v === 'string' && TIME_RE.test(v);
}

export interface OptinInput {
  phone_e164: string;
  locale: AllowedLocale;
  timezone: string;
  send_time_local: string;
  send_at_sunrise: boolean;
}

export type ValidationError = { field: string; message: string };

export function validateOptin(body: unknown):
  | { ok: true; data: OptinInput }
  | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: [{ field: 'body', message: 'must be a JSON object' }] };
  }
  const b = body as Record<string, unknown>;

  if (!isValidE164(b.phone_e164)) {
    errors.push({ field: 'phone_e164', message: 'must be E.164 (e.g. +919876543210)' });
  }
  if (!isAllowedLocale(b.locale)) {
    errors.push({
      field: 'locale',
      message: `must be one of ${ALLOWED_LOCALES.join(', ')}`,
    });
  }
  if (!isValidIanaTimezone(b.timezone)) {
    errors.push({ field: 'timezone', message: 'must be a valid IANA timezone' });
  }
  if (!isTopOfHourTime(b.send_time_local)) {
    errors.push({
      field: 'send_time_local',
      message: 'must be HH:00 or HH:00:00 (top of the hour)',
    });
  }
  if (typeof b.send_at_sunrise !== 'boolean') {
    errors.push({ field: 'send_at_sunrise', message: 'must be a boolean' });
  }

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      phone_e164: b.phone_e164 as string,
      locale: b.locale as AllowedLocale,
      timezone: b.timezone as string,
      // Normalize HH:MM → HH:MM:00 so it matches the SQL TIME literal exactly
      send_time_local: (b.send_time_local as string).length === 5
        ? `${b.send_time_local}:00`
        : (b.send_time_local as string),
      send_at_sunrise: b.send_at_sunrise as boolean,
    },
  };
}
