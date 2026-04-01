/**
 * Declarative Festival & Vrat Definitions
 *
 * Each festival is defined by its Purnimant calendar coordinates:
 * masa (lunar month) + paksha + tithi number.
 *
 * IMPORTANT: masa names use PURNIMANT system (same as Drik Panchang).
 * The lookup engine converts to Amanta internally when needed.
 *
 * Adding a new festival = adding one entry to the appropriate array.
 */

export interface FestivalDef {
  masa?: string;           // Purnimant month name (omit for recurring monthly vrats)
  paksha?: 'shukla' | 'krishna';
  tithi: number;           // 1-15 within the paksha
  slug: string;            // key for detail lookup
  name?: { en: string; hi: string; sa: string }; // override name (for entries not in FESTIVAL_DETAILS)
  type: 'major' | 'vrat' | 'regional';
  category: 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'sankranti' | 'jayanti' | 'vrat';
  recurring?: boolean;     // true = applies to ALL months
}

// ─── Major Festivals (masa-specific, defined by Purnimant month) ───

export const MAJOR_FESTIVALS: FestivalDef[] = [
  // Magha
  { masa: 'magha', paksha: 'shukla', tithi: 5,  slug: 'vasant-panchami',  type: 'major', category: 'festival' },
  { masa: 'magha', paksha: 'shukla', tithi: 7,  slug: 'ratha-saptami',    type: 'major', category: 'festival',
    name: { en: 'Ratha Saptami', hi: 'रथ सप्तमी', sa: 'रथसप्तमी' } },
  { masa: 'magha', paksha: 'shukla', tithi: 8,  slug: 'bhishma-ashtami',  type: 'major', category: 'festival',
    name: { en: 'Bhishma Ashtami', hi: 'भीष्म अष्टमी', sa: 'भीष्माष्टमी' } },
  // Phalguna
  { masa: 'phalguna', paksha: 'krishna', tithi: 14, slug: 'maha-shivaratri', type: 'major', category: 'festival' },
  { masa: 'phalguna', paksha: 'shukla',  tithi: 15, slug: 'holi',            type: 'major', category: 'festival' },
  // Chaitra
  { masa: 'chaitra', paksha: 'shukla', tithi: 1,  slug: 'chaitra-navratri', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri', hi: 'चैत्र नवरात्रि', sa: 'चैत्रनवरात्रिः' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 9,  slug: 'ram-navami',       type: 'major', category: 'festival' },
  { masa: 'chaitra', paksha: 'shukla', tithi: 15, slug: 'hanuman-jayanti',  type: 'major', category: 'festival' },
  // Vaishakha
  { masa: 'vaishakha', paksha: 'shukla', tithi: 3,  slug: 'akshaya-tritiya', type: 'major', category: 'festival',
    name: { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया', sa: 'अक्षयतृतीया' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 15, slug: 'buddha-purnima',  type: 'major', category: 'festival',
    name: { en: 'Buddha Purnima', hi: 'बुद्ध पूर्णिमा', sa: 'बुद्धपूर्णिमा' } },
  // Jyeshtha
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 10, slug: 'ganga-dussehra',  type: 'major', category: 'festival',
    name: { en: 'Ganga Dussehra', hi: 'गंगा दशहरा', sa: 'गङ्गादशहरा' } },
  // Ashadha
  { masa: 'ashadha', paksha: 'shukla', tithi: 11, slug: 'devshayani-ekadashi', type: 'major', category: 'festival',
    name: { en: 'Devshayani Ekadashi', hi: 'देवशयनी एकादशी', sa: 'देवशयनीएकादशी' } },
  { masa: 'ashadha', paksha: 'shukla', tithi: 15, slug: 'guru-purnima',     type: 'major', category: 'festival' },
  // Shravana
  { masa: 'shravana', paksha: 'shukla', tithi: 15, slug: 'raksha-bandhan',  type: 'major', category: 'festival' },
  { masa: 'shravana', paksha: 'shukla', tithi: 3,  slug: 'hariyali-teej',   type: 'major', category: 'festival',
    name: { en: 'Hariyali Teej', hi: 'हरियाली तीज', sa: 'हरितालिकातृतीया' } },
  { masa: 'shravana', paksha: 'krishna', tithi: 5,  slug: 'nag-panchami',    type: 'major', category: 'festival',
    name: { en: 'Nag Panchami', hi: 'नाग पंचमी', sa: 'नागपञ्चमी' } },
  // Bhadrapada
  { masa: 'bhadrapada', paksha: 'krishna', tithi: 8,  slug: 'janmashtami',    type: 'major', category: 'festival' },
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 4,  slug: 'ganesh-chaturthi', type: 'major', category: 'festival' },
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 14, slug: 'anant-chaturdashi', type: 'major', category: 'festival',
    name: { en: 'Anant Chaturdashi', hi: 'अनन्त चतुर्दशी', sa: 'अनन्तचतुर्दशी' } },
  // Ashwina
  { masa: 'ashwina', paksha: 'shukla',  tithi: 1,  slug: 'navaratri',       type: 'major', category: 'festival' },
  { masa: 'ashwina', paksha: 'shukla',  tithi: 8,  slug: 'durga-ashtami',   type: 'major', category: 'festival',
    name: { en: 'Durga Ashtami', hi: 'दुर्गा अष्टमी', sa: 'दुर्गाष्टमी' } },
  { masa: 'ashwina', paksha: 'shukla',  tithi: 9,  slug: 'maha-navami',     type: 'major', category: 'festival',
    name: { en: 'Maha Navami', hi: 'महा नवमी', sa: 'महानवमी' } },
  { masa: 'ashwina', paksha: 'shukla',  tithi: 10, slug: 'dussehra',        type: 'major', category: 'festival' },
  { masa: 'ashwina', paksha: 'krishna', tithi: 13, slug: 'dhanteras',       type: 'major', category: 'festival',
    name: { en: 'Dhanteras', hi: 'धनतेरस', sa: 'धन्वन्तरित्रयोदशी' } },
  { masa: 'ashwina', paksha: 'krishna', tithi: 14, slug: 'narak-chaturdashi', type: 'major', category: 'festival',
    name: { en: 'Narak Chaturdashi', hi: 'नरक चतुर्दशी', sa: 'नरकचतुर्दशी' } },
  // Kartika
  { masa: 'kartika', paksha: 'krishna', tithi: 15, slug: 'diwali',          type: 'major', category: 'festival' },
  { masa: 'kartika', paksha: 'shukla',  tithi: 1,  slug: 'govardhan-puja',  type: 'major', category: 'festival',
    name: { en: 'Govardhan Puja', hi: 'गोवर्धन पूजा', sa: 'गोवर्धनपूजा' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 2,  slug: 'bhai-dooj',       type: 'major', category: 'festival',
    name: { en: 'Bhai Dooj', hi: 'भाई दूज', sa: 'भ्रातृद्वितीया' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 15, slug: 'kartik-purnima',  type: 'major', category: 'festival',
    name: { en: 'Kartik Purnima', hi: 'कार्तिक पूर्णिमा', sa: 'कार्तिकपूर्णिमा' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 11, slug: 'devutthana-ekadashi', type: 'major', category: 'festival',
    name: { en: 'Devutthana Ekadashi', hi: 'देवुत्थान एकादशी', sa: 'देवोत्थानैकादशी' } },
  // Margashirsha
  { masa: 'margashirsha', paksha: 'shukla', tithi: 11, slug: 'mokshada-ekadashi', type: 'major', category: 'festival',
    name: { en: 'Mokshada Ekadashi (Gita Jayanti)', hi: 'मोक्षदा एकादशी (गीता जयन्ती)', sa: 'मोक्षदैकादशी (गीताजयन्ती)' } },
];

// ─── Ekadashi Definitions (all 24 standard) ───

export const EKADASHI_DEFS: FestivalDef[] = [
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

// ─── Monthly Recurring Vrats (applies to ALL months) ───

export const MONTHLY_VRATS: FestivalDef[] = [
  // Purnima
  { tithi: 15, slug: 'purnima',            type: 'vrat', category: 'purnima',    recurring: true, paksha: 'shukla' },
  // Amavasya
  { tithi: 15, slug: 'amavasya',           type: 'vrat', category: 'amavasya',   recurring: true, paksha: 'krishna' },
  // Sankashti Chaturthi
  { tithi: 4,  slug: 'chaturthi',          type: 'vrat', category: 'chaturthi',  recurring: true, paksha: 'krishna' },
  // Vinayaka Chaturthi (Shukla)
  { tithi: 4,  slug: 'vinayaka-chaturthi', type: 'vrat', category: 'chaturthi',  recurring: true, paksha: 'shukla',
    name: { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', sa: 'विनायकचतुर्थी' } },
  // Pradosham — both pakshas
  { tithi: 13, slug: 'pradosham-shukla',   type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'shukla' },
  { tithi: 13, slug: 'pradosham-krishna',  type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'krishna' },
  // Masik Shivaratri (Krishna Chaturdashi)
  { tithi: 14, slug: 'masik-shivaratri',   type: 'vrat', category: 'vrat',       recurring: true, paksha: 'krishna',
    name: { en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि', sa: 'मासिकशिवरात्रिः' } },
  // Masik Durgashtami (Shukla Ashtami)
  { tithi: 8,  slug: 'masik-durgashtami',  type: 'vrat', category: 'vrat',       recurring: true, paksha: 'shukla',
    name: { en: 'Masik Durgashtami', hi: 'मासिक दुर्गाष्टमी', sa: 'मासिकदुर्गाष्टमी' } },
];

/**
 * Convert a FestivalDef tithi (1-15 within paksha) to the 1-30 tithi number.
 */
export function defToTithiNumber(def: FestivalDef): number {
  if (!def.paksha || def.paksha === 'shukla') return def.tithi;
  return def.tithi + 15; // Krishna paksha: 16-30
}
