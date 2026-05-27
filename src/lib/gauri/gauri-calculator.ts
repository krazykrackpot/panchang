/**
 * Gauri Panchang (Gowri Panchangam / Gowri Nalla Neram) calculator.
 *
 * Mirrors the Choghadiya algorithm: divides daylight into eight equal
 * slots from sunrise to sunset, and the night into eight equal slots
 * from sunset to next sunrise. Each slot is tagged with one of eight
 * Gauri periods (see GAURI_TYPES). The starting period rotates with
 * the weekday lord.
 *
 * Why this lives in its own file rather than inline in panchang-calc.ts
 * (where Choghadiya lives): the Gauri page can be rendered independently
 * of a full panchang (we serve a lightweight `/gauri-panchang/[date]`
 * page that only needs sunrise + sunset + weekday). Keeping the
 * compute function importable on its own avoids dragging the full
 * panchang engine into that route.
 *
 * Classical source: standard Tamil Gowri Panchangam published almanacs.
 * Rotation table verified against three reference dates in
 * `src/lib/__tests__/gauri-panchang-rotation.test.ts`. See
 * `src/lib/constants/gauri-panchang.ts` for the names and rotation
 * source attribution.
 *
 * Midnight-crossing semantics: identical to Choghadiya (Lesson R) —
 * unwrapped UT values are kept internally so overlap detection works,
 * `crossesMidnight=true` is set for the slot that straddles 24h, and
 * the formatted clock-times are wrapped via `% 24`.
 */
import { formatTime } from '@/lib/ephem/astronomical';
import type { GauriSlot } from '@/types/panchang';
import {
  GAURI_TYPES,
  GAURI_NAMES,
  GAURI_NATURE,
  GAURI_DAY_START_BY_WEEKDAY,
  GAURI_NIGHT_START_BY_WEEKDAY,
} from '@/lib/constants/gauri-panchang';

/**
 * Compute the 16 Gauri Panchang slots (8 day + 8 night) for a date.
 *
 * @param sunriseUT  Sunrise as decimal hours in UT (0–24, may go negative
 *                   or >24 in extreme latitudes — caller's responsibility
 *                   to validate before calling).
 * @param sunsetUT   Sunset as decimal hours in UT.
 * @param weekday    0=Sunday … 6=Saturday (see CLAUDE.md Lesson O for
 *                   the JD-weekday convention).
 * @param tzOffset   Local timezone offset in hours (e.g., +5.5 for IST,
 *                   +2 for Switzerland CEST).
 * @returns Array of 16 GauriSlot, ordered day(0..7) then night(0..7).
 */
export function computeGauriPanchang(
  sunriseUT: number,
  sunsetUT: number,
  weekday: number,
  tzOffset: number,
): GauriSlot[] {
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const daySlotDuration = dayDuration / 8;
  const nightSlotDuration = nightDuration / 8;
  const slots: GauriSlot[] = [];

  const dayStart = GAURI_DAY_START_BY_WEEKDAY[weekday];
  for (let i = 0; i < 8; i++) {
    const type = GAURI_TYPES[(dayStart + i) % 8];
    const startUT = sunriseUT + i * daySlotDuration;
    const endUT = startUT + daySlotDuration;
    slots.push({
      name: GAURI_NAMES[type],
      type,
      nature: GAURI_NATURE[type],
      startTime: formatTime(startUT, tzOffset),
      endTime: formatTime(endUT, tzOffset),
      period: 'day',
    });
  }

  const nightStart = GAURI_NIGHT_START_BY_WEEKDAY[weekday];
  for (let i = 0; i < 8; i++) {
    const type = GAURI_TYPES[(nightStart + i) % 8];
    const startUT = sunsetUT + i * nightSlotDuration;       // unwrapped, may exceed 24
    const endUT = sunsetUT + (i + 1) * nightSlotDuration;   // unwrapped, may exceed 24

    // crossesMidnight reflects the CLOCK-time wrap, not the UT day boundary,
    // because the consumer (verdict-engine) compares the formatted HH:MM
    // strings — see verdict-engine.ts:101. A slot crosses local midnight
    // when its displayed end-time is numerically less than its start-time.
    const startLocalDay = Math.floor((startUT + tzOffset) / 24);
    const endLocalDay = Math.floor((endUT + tzOffset) / 24);

    slots.push({
      name: GAURI_NAMES[type],
      type,
      nature: GAURI_NATURE[type],
      startTime: formatTime(startUT % 24, tzOffset),
      endTime: formatTime(endUT % 24, tzOffset),
      period: 'night',
      crossesMidnight: endLocalDay > startLocalDay,
    });
  }

  return slots;
}
