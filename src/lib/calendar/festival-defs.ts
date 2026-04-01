/**
 * Declarative Festival & Vrat Definitions
 *
 * Each festival is defined by its Hindu calendar coordinates:
 * masa (lunar month) + paksha + tithi number.
 *
 * Adding a new festival = adding one entry to the appropriate array.
 * The festival engine looks up dates from the pre-computed yearly tithi table.
 */

export interface FestivalDef {
  masa?: string;           // Hindu month name (omit for recurring monthly vrats)
  paksha?: 'shukla' | 'krishna';
  tithi: number;           // 1-15 within the paksha
  slug: string;            // key for FESTIVAL_DETAILS / EKADASHI_NAMES
  type: 'major' | 'vrat';
  category: 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'sankranti';
  recurring?: boolean;     // true = applies to ALL months (monthly vrats)
}

// ─── Major Festivals (defined by masa + paksha + tithi) ───

export const MAJOR_FESTIVALS: FestivalDef[] = [
  // Magha
  { masa: 'magha',       paksha: 'shukla',  tithi: 5,  slug: 'vasant-panchami',  type: 'major', category: 'festival' },
  // Phalguna
  { masa: 'phalguna',    paksha: 'krishna', tithi: 14, slug: 'maha-shivaratri',  type: 'major', category: 'festival' },
  { masa: 'phalguna',    paksha: 'shukla',  tithi: 15, slug: 'holi',             type: 'major', category: 'festival' },
  // Chaitra
  { masa: 'chaitra',     paksha: 'shukla',  tithi: 9,  slug: 'ram-navami',       type: 'major', category: 'festival' },
  { masa: 'chaitra',     paksha: 'shukla',  tithi: 15, slug: 'hanuman-jayanti',  type: 'major', category: 'festival' },
  // Ashadha
  { masa: 'ashadha',     paksha: 'shukla',  tithi: 15, slug: 'guru-purnima',     type: 'major', category: 'festival' },
  // Shravana
  { masa: 'shravana',    paksha: 'shukla',  tithi: 15, slug: 'raksha-bandhan',   type: 'major', category: 'festival' },
  // Bhadrapada
  { masa: 'bhadrapada',  paksha: 'krishna', tithi: 8,  slug: 'janmashtami',      type: 'major', category: 'festival' },
  { masa: 'bhadrapada',  paksha: 'shukla',  tithi: 4,  slug: 'ganesh-chaturthi', type: 'major', category: 'festival' },
  // Ashwina
  { masa: 'ashwina',     paksha: 'shukla',  tithi: 1,  slug: 'navaratri',        type: 'major', category: 'festival' },
  { masa: 'ashwina',     paksha: 'shukla',  tithi: 10, slug: 'dussehra',         type: 'major', category: 'festival' },
  // Kartika
  { masa: 'kartika',     paksha: 'krishna', tithi: 15, slug: 'diwali',           type: 'major', category: 'festival' },
  // Note: Diwali is on Amavasya (tithi 30 = krishna 15). kartika krishna amavasya.
];

// ─── Ekadashi Definitions (all 24 standard + Adhika) ───
// Each lunar month has one Shukla and one Krishna Ekadashi.
// Tithi 11 in both pakshas.

export const EKADASHI_DEFS: FestivalDef[] = [
  // Standard 12 months × 2 pakshas = 24 Ekadashis
  { masa: 'chaitra',      paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'chaitra',      paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'vaishakha',    paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'vaishakha',    paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'jyeshtha',     paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'jyeshtha',     paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'ashadha',      paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'ashadha',      paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'shravana',     paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'shravana',     paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'bhadrapada',   paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'bhadrapada',   paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'ashwina',      paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'ashwina',      paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'kartika',      paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'kartika',      paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'margashirsha', paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'margashirsha', paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'pausha',       paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'pausha',       paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'magha',        paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'magha',        paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'phalguna',     paksha: 'shukla',  tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'phalguna',     paksha: 'krishna', tithi: 11, slug: 'ekadashi', type: 'vrat', category: 'ekadashi' },
];

// ─── Monthly Recurring Vrats ───

export const MONTHLY_VRATS: FestivalDef[] = [
  // Purnima — every month, tithi 15 (Shukla 15)
  { tithi: 15, slug: 'purnima',          type: 'vrat', category: 'purnima',    recurring: true, paksha: 'shukla' },
  // Amavasya — every month, tithi 15 of Krishna (= tithi 30)
  { tithi: 15, slug: 'amavasya',         type: 'vrat', category: 'amavasya',   recurring: true, paksha: 'krishna' },
  // Sankashti Chaturthi — Krishna Chaturthi (4th)
  { tithi: 4,  slug: 'chaturthi',        type: 'vrat', category: 'chaturthi',  recurring: true, paksha: 'krishna' },
  // Pradosham — Trayodashi (13th) of both pakshas
  { tithi: 13, slug: 'pradosham-shukla', type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'shukla' },
  { tithi: 13, slug: 'pradosham-krishna',type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'krishna' },
];

/**
 * Convert a FestivalDef tithi (1-15 within paksha) to the 1-30 tithi number.
 */
export function defToTithiNumber(def: FestivalDef): number {
  if (!def.paksha || def.paksha === 'shukla') return def.tithi;
  return def.tithi + 15; // Krishna paksha: 16-30
}
