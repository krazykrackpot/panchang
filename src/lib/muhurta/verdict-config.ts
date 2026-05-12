import type { VerdictRating } from './verdict-types';

/**
 * Configurable verdict for the Abhijit Muhurta vs hard-block conflict.
 *
 * Muhurta Chintamani calls Abhijit "sarva doshagnam" (destroyer of all doshas),
 * but Rahu Kaal / Yamaganda / Gulika are universally treated as hard blocks by
 * modern practitioners and Vishti/Vyatipata/Vaidhriti as severe doshas by classical
 * texts. The standoff is genuine. We default to CAUTION so users know to prefer
 * another window when one is available.
 *
 * Change this to 'avoid' for a stricter stance or 'good' for a purely classical view.
 */
export const ABHIJIT_DURING_HARD_BLOCK: VerdictRating = 'caution';
