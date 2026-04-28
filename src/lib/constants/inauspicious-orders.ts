/**
 * Segment orders for inauspicious period computation.
 *
 * Each day (sunrise to sunset) is divided into 8 equal segments.
 * The value at index `weekday` (0=Sunday through 6=Saturday) gives
 * the 1-based segment number for that period.
 *
 * Sources: Dharma Sindhu, Muhurta Chintamani.
 * Verified Apr 2026 against Prokerala.
 */

/** Rahu Kaal segment order — [Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3] */
export const RAHU_ORDER = [8, 2, 7, 5, 6, 4, 3];

/** Yamaganda segment order — [Sun=5, Mon=4, Tue=3, Wed=2, Thu=1, Fri=7, Sat=6] */
export const YAMA_ORDER = [5, 4, 3, 2, 1, 7, 6];

/** Gulika Kaal segment order — [Sun=7, Mon=6, Tue=5, Wed=4, Thu=3, Fri=2, Sat=1] */
export const GULIKA_ORDER = [7, 6, 5, 4, 3, 2, 1];
