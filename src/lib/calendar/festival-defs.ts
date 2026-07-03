import type { LocaleText } from '@/types/panchang';

/**
 * Years in scope for the festival/year and festival/year/city routes.
 * Single source of truth — consumed by:
 *   - src/app/[locale]/festivals/[slug]/[year]/page.tsx (validation)
 *   - src/app/[locale]/festivals/[slug]/page.tsx (bare-slug redirect target)
 *   - src/app/sitemap.ts (festival year seeding)
 * Bump when the year-route is extended.
 */
// 2025 dropped May 2026 — past dates serve nobody and burn crawl budget.
// Inception year is 2026.
export const FESTIVAL_VALID_YEARS = [2026, 2027, 2028, 2029, 2030] as const;

/**
 * Canonical top festival slugs used for both:
 *   - Sitemap × year seeding (src/app/sitemap.ts)
 *   - generateStaticParams seed in /festivals/[slug]/[year]/page.tsx
 * Single source of truth — keeping a copy in either consumer caused drift
 * (Audit 2026-05-25 §D7).
 */
export const TOP_FESTIVAL_SLUGS = [
  'diwali', 'janmashtami', 'maha-shivaratri', 'ram-navami', 'ganesh-chaturthi',
  'dussehra', 'holi', 'raksha-bandhan', 'dhanteras', 'narak-chaturdashi',
  'govardhan-puja', 'bhai-dooj', 'hanuman-jayanti', 'akshaya-tritiya',
  'guru-purnima', 'vasant-panchami', 'holika-dahan', 'hartalika-teej',
  'chhath-puja', 'makar-sankranti',
] as const;

/**
 * Declarative Festival & Vrat Definitions
 *
 * Each festival is defined by its Purnimant calendar coordinates:
 *   masa (lunar month) + paksha + tithi number + muhurtaRule
 *
 * ═══════════════════════════════════════════════════════════════════
 * KALA-VYAPTI (TIME-PREVALENCE) SYSTEM
 * ═══════════════════════════════════════════════════════════════════
 *
 * A tithi (~23h 37m) rarely aligns with a solar day (24h). When a tithi
 * spans two calendar days, the festival date is determined by WHICH TIME
 * WINDOW (Kala) the tithi must be active during. This is the Kala-Vyapti
 * system from the Dharmasindhu and Nirnayasindhu.
 *
 * ┌─────────────┬──────────────────────────┬─────────────────────────────┐
 * │ Rule        │ Window                   │ Classical Reason             │
 * ├─────────────┼──────────────────────────┼─────────────────────────────┤
 * │ sunrise     │ At sunrise (default)     │ Udaya Tithi  –  Surya Siddhanta│
 * │ pratah      │ 1st 1/5 of daytime       │ Morning rituals              │
 * │ madhyahna   │ Middle 1/5 of daytime    │ Deity born at midday         │
 * │             │ (~10:45 AM – 1:30 PM)    │ (Rama, Ganesha, Saraswati)   │
 * │ aparahna    │ 4th 1/5 of daytime       │ Victory / ancestors          │
 * │             │ (~1:30 PM – 4:00 PM)     │ (Dussehra, Pitru Shraddha)   │
 * │ pradosh     │ Sunset + 4 ghatis        │ Lamp lighting / evening puja │
 * │             │ (~96 minutes)            │ (Diwali, Dhanteras)          │
 * │ nishita     │ 8th muhurta of night     │ Midnight manifestation       │
 * │             │ (~11:40 PM – 12:28 AM)   │ (Shivaratri, Janmashtami)    │
 * │ arunodaya   │ 4 ghatis before sunrise  │ Pre-dawn bath / purification │
 * │             │ (~96 min before sunrise)  │ (Narak Chaturdashi)          │
 * │ chandrodaya │ At moonrise              │ Moon-sighting festivals      │
 * │             │                          │ (Karwa Chauth, Sankashti)    │
 * └─────────────┴──────────────────────────┴─────────────────────────────┘
 *
 * ALGORITHM (implemented in festival-generator.ts):
 * 1. Find the Udaya Tithi day (sunriseDate) from the tithi table.
 * 2. Compute the Kala window on BOTH the sunriseDate and the previous day.
 * 3. Measure the tithi's overlap with each window.
 * 4. Dharmasindhu tie-breaking:
 *    - Active only on one day → pick that day.
 *    - Active on both → night festivals (pradosh/nishita) prefer the earlier day;
 *      day festivals pick the greater overlap.
 *
 * MONTH CONVENTIONS:
 * - masa names use PURNIMANT system (standard Indian convention).
 * - For Shukla paksha tithis, Amant and Purnimant month names agree.
 * - For Krishna paksha tithis, Purnimant = Amant + 1 month.
 *   Example: Diwali = "Kartika Krishna Amavasya" (Purnimant)
 *            = "Ashwina Krishna Amavasya" (Amant)
 * - The lookup engine converts to Amant internally when matching.
 *
 * ADDING A FESTIVAL:
 * 1. Add an entry to MAJOR_FESTIVALS with masa + paksha + tithi + slug.
 * 2. Add a matching entry to FESTIVAL_DETAILS (festival-details.ts) with
 *    name, mythology, observance, significance, and observationRule.
 * 3. Assign the correct muhurtaRule based on classical texts.
 *    Default (omitted) = 'sunrise' (Udaya Tithi).
 *
 * VERIFIED: All 20 major festivals match Prokerala/Drik Panchang for 2026.
 */

/**
 * Kala-based observation rule for festival date selection.
 * Determines which time window the tithi must be active during.
 * See table above for window definitions and classical sources.
 */
export type MuhurtaRule = 'sunrise' | 'pratah' | 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'arunodaya' | 'chandrodaya';

export interface FestivalDef {
  masa?: string;           // Purnimant month name (omit for recurring monthly vrats)
  paksha?: 'shukla' | 'krishna';
  tithi: number;           // 1-15 within the paksha
  slug: string;            // key for detail lookup
  name?: LocaleText;       // override name (for entries not in FESTIVAL_DETAILS)
  type: 'major' | 'vrat' | 'regional';
  category: 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'sankranti' | 'jayanti' | 'vrat';
  /**
   * Tradition tag: is this observed as a vrat (fast / penance)?
   *
   * Festival vs vrat is NOT mutually exclusive. Nirjala Ekadashi is a
   * major festival (escalated via type='major' so it surfaces in the
   * main festivals stream) AND a vrat (a full 24-hour waterless fast).
   * Vaikuntha Ekadashi is type='regional' AND a vrat. Without this
   * field they were silently dropped from the Vrats section of the
   * calendar — user reported 22 ekadashis visible instead of 24.
   *
   * Generator auto-derives `true` when category is in {ekadashi,
   * chaturthi, pradosham, vrat}; explicit `false` overrides; explicit
   * `true` on items in other categories (e.g. Satyanarayan Purnima)
   * promotes them to vrat status without changing `type`.
   */
  isVrat?: boolean;
  recurring?: boolean;     // true = applies to ALL months
  muhurtaRule?: MuhurtaRule; // Kala-Vyapti rule for date selection (default: 'sunrise' = Udaya Tithi)
  solarMonth?: number;     // For solar festivals: sign number 1-12 (1=Aries/Mesh, 10=Capricorn/Makara)
  weekday?: number;        // For conditional vrats: 0=Sunday, 1=Monday, ..., 6=Saturday
  family?: string;         // Group multi-day festivals: 'diwali', 'pongal', 'holi', 'navratri'
  region?: string;         // Regional tag: 'tamil', 'bengali', 'punjabi', 'gujarati', 'kerala', etc.
  tradition?: string;      // 'vaishnava', 'shaiva', 'shakta', 'jain', 'sikh', 'buddhist'
}

/**
 * Categories whose entries are always vrats by classical tradition,
 * regardless of their `type` field. Used by the generator to default-
 * derive `isVrat=true` without needing every def to set it explicitly.
 *
 * NOTE: this is a closed set — adding a new always-vrat category is a
 * deliberate decision because it affects existing data + display.
 * Purnima and Amavasya are NOT here: some are vrats (Satyanarayan
 * Purnima, Mauni Amavasya) and some are not (Chaitra Purnima, regular
 * lunar phase). Those need per-def `isVrat: true` to opt in.
 */
export const ALWAYS_VRAT_CATEGORIES: ReadonlySet<FestivalDef['category']> = new Set([
  'ekadashi',
  'chaturthi',
  'pradosham',
  'vrat',
]);

/** Resolve effective vrat status from def. Explicit field wins. */
export function isVratByDef(def: { category: FestivalDef['category']; type: FestivalDef['type']; isVrat?: boolean }): boolean {
  if (def.isVrat !== undefined) return def.isVrat;
  if (def.type === 'vrat') return true;
  return ALWAYS_VRAT_CATEGORIES.has(def.category);
}

// ─── Major Festivals (masa-specific, defined by Purnimant month) ───

export const MAJOR_FESTIVALS: FestivalDef[] = [
  // Magha
  { masa: 'magha', paksha: 'shukla', tithi: 1,  slug: 'magha-gupta-navratri', type: 'major', category: 'festival',
    name: { en: 'Magha Gupta Navratri', hi: 'माघ गुप्त नवरात्रि', sa: 'माघगुप्तनवरात्रिः' } },
  { masa: 'magha', paksha: 'shukla', tithi: 5,  slug: 'vasant-panchami',  type: 'major', category: 'festival' },
  { masa: 'magha', paksha: 'shukla', tithi: 7,  slug: 'ratha-saptami',    type: 'major', category: 'festival',
    name: { en: 'Ratha Saptami', hi: 'रथ सप्तमी', sa: 'रथसप्तमी' } },
  { masa: 'magha', paksha: 'shukla', tithi: 8,  slug: 'bhishma-ashtami',  type: 'major', category: 'festival',
    name: { en: 'Bhishma Ashtami', hi: 'भीष्म अष्टमी', sa: 'भीष्माष्टमी' } },
  { masa: 'magha', paksha: 'shukla', tithi: 12, slug: 'bhishma-dwadashi', type: 'major', category: 'festival',
    name: { en: 'Bhishma Dwadashi', hi: 'भीष्म द्वादशी', sa: 'भीष्मद्वादशी' } },
  // Phalguna
  // Maha Shivaratri is a major festival AND a strict vrat (full 24-hour
  // jagaran-fast tradition, Shiv-archana through 4 prahara). Explicit
  // isVrat:true because category='festival' isn't in ALWAYS_VRAT_CATEGORIES.
  { masa: 'phalguna', paksha: 'krishna', tithi: 14, slug: 'maha-shivaratri', type: 'major', category: 'festival', muhurtaRule: 'nishita', isVrat: true },
  { masa: 'phalguna', paksha: 'shukla',  tithi: 14, slug: 'holika-dahan',    type: 'major', category: 'festival',
    name: { en: 'Holika Dahan', hi: 'होलिका दहन', sa: 'होलिकादहनम्' } },
  { masa: 'phalguna', paksha: 'shukla',  tithi: 15, slug: 'holi',            type: 'major', category: 'festival' },
  // Chaitra
  { masa: 'chaitra', paksha: 'shukla', tithi: 1,  slug: 'chaitra-navratri', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri', hi: 'चैत्र नवरात्रि', sa: 'चैत्रनवरात्रिः' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 9,  slug: 'ram-navami',       type: 'major', category: 'festival', muhurtaRule: 'madhyahna' },
  { masa: 'chaitra', paksha: 'shukla', tithi: 15, slug: 'hanuman-jayanti',  type: 'major', category: 'festival' },
  // Vaishakha
  { masa: 'vaishakha', paksha: 'shukla', tithi: 3,  slug: 'akshaya-tritiya', type: 'major', category: 'festival', muhurtaRule: 'madhyahna',
    name: { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया', sa: 'अक्षयतृतीया' } },
  // Parashurama Jayanti shares Vaishakha Shukla Tritiya with Akshaya Tritiya
  // and follows the same kala-vyapti rule: madhyahna-vyapini Tritiya (the avatar
  // is said to have appeared at noon, mirroring the Akshaya Tritiya midday
  // observance). The mainstream Indian panchang labels the per-festival page
  // muhurat as "Madhyahna Time" — same as Akshaya Tritiya. Without this rule
  // the engine defaulted to Udaya Tithi and landed 1 day later than the
  // mainstream observance (2026: engine without rule = Apr 20, with rule =
  // Apr 19, same day as Akshaya Tritiya). Drik audit 2026-06-11.
  { masa: 'vaishakha', paksha: 'shukla', tithi: 3,  slug: 'parashurama-jayanti', type: 'major', category: 'jayanti', muhurtaRule: 'madhyahna',
    name: { en: 'Parashurama Jayanti', hi: 'परशुराम जयन्ती', sa: 'परशुरामजयन्ती' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 14, slug: 'narasimha-jayanti', type: 'major', category: 'jayanti',
    name: { en: 'Narasimha Jayanti', hi: 'नरसिंह जयन्ती', sa: 'नरसिंहजयन्ती' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 15, slug: 'buddha-purnima',  type: 'major', category: 'festival',
    name: { en: 'Buddha Purnima', hi: 'बुद्ध पूर्णिमा', sa: 'बुद्धपूर्णिमा' } },
  // Jyeshtha
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 10, slug: 'ganga-dussehra',  type: 'major', category: 'festival',
    name: { en: 'Ganga Dussehra', hi: 'गंगा दशहरा', sa: 'गङ्गादशहरा' } },
  // Nirjala Ekadashi (Jyeshtha Shukla 11)  –  handled by the generic Ekadashi loop
  // with name resolved from EKADASHI_NAMES. Do NOT duplicate here.
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 15, slug: 'vat-savitri-vrat', type: 'major', category: 'vrat',
    name: { en: 'Vat Savitri Vrat', hi: 'वट सावित्री व्रत', sa: 'वटसावित्रीव्रतम्' } },
  // Ashadha
  { masa: 'ashadha', paksha: 'shukla', tithi: 2,  slug: 'jagannath-rath-yatra', type: 'major', category: 'festival',
    name: { en: 'Jagannath Rath Yatra', hi: 'जगन्नाथ रथ यात्रा', sa: 'जगन्नाथरथयात्रा' } },
  // Devshayani Ekadashi (Ashadha Shukla 11)  –  handled by the generic Ekadashi loop
  // with name resolved from EKADASHI_NAMES. Do NOT duplicate here.
  { masa: 'ashadha', paksha: 'shukla', tithi: 15, slug: 'guru-purnima',     type: 'major', category: 'festival' },
  // Shravana
  { masa: 'shravana', paksha: 'shukla', tithi: 15, slug: 'varalakshmi-vratam', type: 'major', category: 'vrat',
    name: { en: 'Varalakshmi Vratam', hi: 'वरलक्ष्मी व्रतम्', sa: 'वरलक्ष्मीव्रतम्' } },
  { masa: 'shravana', paksha: 'shukla', tithi: 15, slug: 'raksha-bandhan',  type: 'major', category: 'festival' },
  { masa: 'shravana', paksha: 'shukla', tithi: 3,  slug: 'hariyali-teej',   type: 'major', category: 'festival',
    name: { en: 'Hariyali Teej', hi: 'हरियाली तीज', sa: 'हरितालिकातृतीया' } },
  // Nag Panchami is Shravana SHUKLA Panchami uniformly across India (Drik /
  // Prokerala / Karnataka / North India / Gujarat all agree on the same
  // calendar day). Shukla paksha is unambiguous between Amanta and Purnimanta
  // — the month-name divergence only happens for Krishna paksha. Original def
  // had `paksha: 'krishna'` (typo / regression), which resolved to Ashadha
  // Krishna 5 in Amanta (= Shravana Krishna 5 in Purnimanta) and produced
  // dates ~14 days before the actual festival (Aug 3 instead of Aug 17 in
  // 2026). Direct Drik fetch 2026-06-11 confirms Shravana Shukla 5.
  { masa: 'shravana', paksha: 'shukla', tithi: 5,  slug: 'nag-panchami',    type: 'major', category: 'festival',
    name: { en: 'Nag Panchami', hi: 'नाग पंचमी', sa: 'नागपञ्चमी' } },
  // Bhadrapada
  // Janmashtami: major festival AND a vrat (full-day fast until midnight,
  // broken at the Nishita Kala muhurat after Krishna's birth.)
  { masa: 'bhadrapada', paksha: 'krishna', tithi: 8,  slug: 'janmashtami',    type: 'major', category: 'festival', muhurtaRule: 'nishita', isVrat: true },
  // Hartalika Teej: women's nirjala (waterless) fast for Shiva-Parvati.
  // No muhurtaRule — defaults to sunrise (Udaya Tithi). Previously had
  // `muhurtaRule: 'madhyahna'`, which forced Day 1 attribution when Tritiya
  // touched madhyahna on Day 1 but had ended before madhyahna on Day 2.
  // That produced Sep 13 for 2026; Drik (Udaya Tithi) shows Sep 14.
  // Drik audit 2026-06-11.
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 3,  slug: 'hartalika-teej', type: 'major', category: 'festival', isVrat: true,
    name: { en: 'Hartalika Teej', hi: 'हरतालिका तीज', sa: 'हरितालिकातृतीया' } },
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 4,  slug: 'ganesh-chaturthi', type: 'major', category: 'festival', muhurtaRule: 'madhyahna' },
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 12, slug: 'onam',             type: 'major', category: 'festival',
    name: { en: 'Onam', hi: 'ओणम', sa: 'ओणम्' } },
  { masa: 'bhadrapada', paksha: 'shukla',  tithi: 14, slug: 'anant-chaturdashi', type: 'major', category: 'festival',
    name: { en: 'Anant Chaturdashi', hi: 'अनन्त चतुर्दशी', sa: 'अनन्तचतुर्दशी' } },
  // Ashwina
  { masa: 'ashwina', paksha: 'shukla',  tithi: 1,  slug: 'navaratri',       type: 'major', category: 'festival' },
  { masa: 'ashwina', paksha: 'shukla',  tithi: 8,  slug: 'durga-ashtami',   type: 'major', category: 'festival',
    name: { en: 'Durga Ashtami', hi: 'दुर्गा अष्टमी', sa: 'दुर्गाष्टमी' } },
  { masa: 'ashwina', paksha: 'shukla',  tithi: 9,  slug: 'maha-navami',     type: 'major', category: 'festival',
    name: { en: 'Maha Navami', hi: 'महा नवमी', sa: 'महानवमी' } },
  // Dussehra (Vijayadashami) is aparahna-vyāpinī Dashami — observed during the
  // Vijaya Muhurat which sits in aparahna kaal (4th 1/5 of daytime). Classical
  // basis: the Vijaya Muhurat is the moment of Rama's victory over Ravana,
  // anchored to afternoon (Dharmasindhu, Nirnayasindhu). The mainstream Indian
  // panchang labels the per-festival page muhurat as "Aparahna Puja Time" /
  // "Vijaya Muhurat". With the bhuyo-vyapini tie-break (post-PR #670), Day with
  // majority Dashami-in-aparahna overlap wins. For 2026: engine without rule =
  // Oct 21 (Udaya Tithi), with rule = Oct 20 (Dashami fills aparahna of Oct 20
  // for ~2h 16m vs partial-window on Oct 21). Drik audit 2026-06-11.
  { masa: 'ashwina', paksha: 'shukla',  tithi: 10, slug: 'dussehra',        type: 'major', category: 'festival', muhurtaRule: 'aparahna' },
  // Sharad Purnima / Kojagara Puja is nishita-vyāpinī Purnima — the rite
  // (Kojagara Lakshmi vigil, moon-watching, distribution of poha/kheer offered
  // to the moon) is performed at nishita kaal (midnight). Classical basis:
  // Lakshmi descends at midnight on Kojagara, asking "ko jagarti?" ("who is
  // awake?"); the awake receive prosperity. The mainstream Indian panchang
  // labels the per-festival page muhurat as "Kojagara Puja Nishita Time".
  // For 2026: engine without rule = Oct 26 (Udaya Tithi on the day Purnima
  // ends in morning), with rule = Oct 25 (Purnima fully covers nishita window
  // ~11:40 PM Oct 25 to ~12:31 AM Oct 26). Drik audit 2026-06-11.
  { masa: 'ashwina', paksha: 'shukla',  tithi: 15, slug: 'sharad-purnima', type: 'major', category: 'festival', muhurtaRule: 'nishita',
    name: { en: 'Sharad Purnima', hi: 'शरद पूर्णिमा', sa: 'शारदपूर्णिमा' } },
  // Karwa Chauth  –  fast broken at moonrise (chandrodaya rule)
  // In Purnimant: "Kartika Krishna 4". Our matching uses getNextHinduMonth(amanta)
  // for Krishna, so def.masa must be getNextHinduMonth(bhadrapada) = ashwina...
  // but that gives wrong month. Use 'kartika' and it matches amanta=ashwina via
  // getNextHinduMonth. The entry in Ashwina Krishna (Amant) = Kartika Krishna (Purnimant).
  { masa: 'kartika', paksha: 'krishna', tithi: 4,  slug: 'karwa-chauth',     type: 'major', category: 'vrat', muhurtaRule: 'chandrodaya',
    name: { en: 'Karwa Chauth', hi: 'करवा चौथ', sa: 'करकचतुर्थी' } },
  // Kartika  –  Diwali cluster (Dhanteras, Narak Chaturdashi are Kartika Krishna, NOT Ashwina)
  { masa: 'kartika', paksha: 'krishna', tithi: 13, slug: 'dhanteras',       type: 'major', category: 'festival', muhurtaRule: 'pradosh',
    name: { en: 'Dhanteras', hi: 'धनतेरस', sa: 'धन्वन्तरित्रयोदशी' } },
  // Naraka Chaturdashi (Choti Diwali) in the mainstream North Indian
  // observance is the Abhyang Snan day — the ritual pre-dawn oil bath at
  // arunodaya kaal (the ~96-minute window before sunrise). Classical basis:
  // Krishna slayed Narakasura in the early morning hours; the abhyang snan
  // commemorates the cleansing that followed. The mainstream Indian panchang
  // labels the per-festival page muhurat as "Abhyang Snan Muhurat".
  // The previous rule `nishita` produces the Kali Chaudas / Kali Puja date
  // (Bengali / East Indian observance, midnight Kali worship — same tithi,
  // different observance). For 2026: arunodaya rule places Naraka Chaturdashi
  // on Nov 8 (the morning Chaturdashi is at sunrise/arunodaya), matching the
  // mainstream Indian "Choti Diwali" observance. The Kali Chaudas observance
  // would land on Nov 7 if it had a separate slug with `nishita`. Drik audit
  // 2026-06-11.
  { masa: 'kartika', paksha: 'krishna', tithi: 14, slug: 'narak-chaturdashi', type: 'major', category: 'festival', muhurtaRule: 'arunodaya',
    name: { en: 'Narak Chaturdashi', hi: 'नरक चतुर्दशी', sa: 'नरकचतुर्दशी' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 15, slug: 'diwali',          type: 'major', category: 'festival', muhurtaRule: 'pradosh' },
  { masa: 'kartika', paksha: 'shukla',  tithi: 1,  slug: 'govardhan-puja',  type: 'major', category: 'festival',
    name: { en: 'Govardhan Puja', hi: 'गोवर्धन पूजा', sa: 'गोवर्धनपूजा' } },
  // Bhai Dooj = aparahna-vyapini Dwitiya (Dharmasindhu / Nirnayasindhu).
  // Without muhurtaRule it defaulted to 'sunrise' (Udaya Tithi), which placed
  // Bhai Dooj on Day 2 even when Dwitiya entered aparahna only on Day 1 — Drik
  // 2026 = Nov 10, engine pre-fix = Nov 11. Pair with the 'aparahna'
  // first-day-priority addition in festival-generator.ts so the tie-breaker
  // picks Day 1 (purva-vyapini) when Dwitiya is present in aparahna on both.
  { masa: 'kartika', paksha: 'shukla',  tithi: 2,  slug: 'bhai-dooj',       type: 'major', category: 'festival', muhurtaRule: 'aparahna',
    name: { en: 'Bhai Dooj', hi: 'भाई दूज', sa: 'भ्रातृद्वितीया' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 6,  slug: 'chhath-puja',     type: 'major', category: 'festival',
    name: { en: 'Chhath Puja', hi: 'छठ पूजा', sa: 'षष्ठीपूजा' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 12, slug: 'tulsi-vivah',     type: 'major', category: 'festival',
    name: { en: 'Tulsi Vivah', hi: 'तुलसी विवाह', sa: 'तुलसीविवाहः' } },
  { masa: 'kartika', paksha: 'shukla',  tithi: 15, slug: 'kartik-purnima',  type: 'major', category: 'festival',
    name: { en: 'Kartik Purnima', hi: 'कार्तिक पूर्णिमा', sa: 'कार्तिकपूर्णिमा' } },
  // Devutthana (Kartika Shukla 11) and Mokshada (Margashirsha Shukla 11) Ekadashis
  // are handled by the generic Ekadashi loop with names from EKADASHI_NAMES.
];

// ─── Ekadashi Definitions (all 24 standard) ───

export const EKADASHI_DEFS: FestivalDef[] = [
  { masa: 'chaitra',      paksha: 'shukla',  tithi: 11, slug: 'kamada-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'chaitra',      paksha: 'krishna', tithi: 11, slug: 'papamochani-ekadashi',     type: 'vrat', category: 'ekadashi' },
  { masa: 'vaishakha',    paksha: 'shukla',  tithi: 11, slug: 'mohini-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'vaishakha',    paksha: 'krishna', tithi: 11, slug: 'varuthini-ekadashi',       type: 'vrat', category: 'ekadashi' },
  // Jyeshtha Shukla 11 = Nirjala Ekadashi  –  defined above as a named major festival, not here as generic
  { masa: 'jyeshtha',     paksha: 'krishna', tithi: 11, slug: 'apara-ekadashi',           type: 'vrat', category: 'ekadashi' },
  { masa: 'ashadha',      paksha: 'shukla',  tithi: 11, slug: 'devshayani-ekadashi',      type: 'vrat', category: 'ekadashi' },
  { masa: 'ashadha',      paksha: 'krishna', tithi: 11, slug: 'yogini-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'shravana',     paksha: 'shukla',  tithi: 11, slug: 'shravana-putrada-ekadashi', type: 'vrat', category: 'ekadashi' },
  { masa: 'shravana',     paksha: 'krishna', tithi: 11, slug: 'kamika-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'bhadrapada',   paksha: 'shukla',  tithi: 11, slug: 'parsva-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'bhadrapada',   paksha: 'krishna', tithi: 11, slug: 'aja-ekadashi',             type: 'vrat', category: 'ekadashi' },
  { masa: 'ashwina',      paksha: 'shukla',  tithi: 11, slug: 'papankusha-ekadashi',      type: 'vrat', category: 'ekadashi' },
  { masa: 'ashwina',      paksha: 'krishna', tithi: 11, slug: 'indira-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'kartika',      paksha: 'shukla',  tithi: 11, slug: 'devutthana-ekadashi',      type: 'vrat', category: 'ekadashi' },
  { masa: 'kartika',      paksha: 'krishna', tithi: 11, slug: 'rama-ekadashi',            type: 'vrat', category: 'ekadashi' },
  { masa: 'margashirsha', paksha: 'shukla',  tithi: 11, slug: 'mokshada-ekadashi',        type: 'vrat', category: 'ekadashi' },
  { masa: 'margashirsha', paksha: 'krishna', tithi: 11, slug: 'utpanna-ekadashi',         type: 'vrat', category: 'ekadashi' },
  { masa: 'pausha',       paksha: 'shukla',  tithi: 11, slug: 'putrada-ekadashi',          type: 'vrat', category: 'ekadashi' },
  { masa: 'pausha',       paksha: 'krishna', tithi: 11, slug: 'safala-ekadashi',           type: 'vrat', category: 'ekadashi' },
  { masa: 'magha',        paksha: 'shukla',  tithi: 11, slug: 'jaya-ekadashi',            type: 'vrat', category: 'ekadashi' },
  { masa: 'magha',        paksha: 'krishna', tithi: 11, slug: 'shattila-ekadashi',        type: 'vrat', category: 'ekadashi' },
  { masa: 'phalguna',     paksha: 'shukla',  tithi: 11, slug: 'amalaki-ekadashi',         type: 'vrat', category: 'ekadashi' },
  { masa: 'phalguna',     paksha: 'krishna', tithi: 11, slug: 'vijaya-ekadashi',          type: 'vrat', category: 'ekadashi' },
];

// ─── Monthly Recurring Vrats (applies to ALL months) ───

export const MONTHLY_VRATS: FestivalDef[] = [
  // Purnima
  { tithi: 15, slug: 'purnima',            type: 'vrat', category: 'purnima',    recurring: true, paksha: 'shukla' },
  // Amavasya
  { tithi: 15, slug: 'amavasya',           type: 'vrat', category: 'amavasya',   recurring: true, paksha: 'krishna' },
  // Sankashti Chaturthi  –  fast broken at moonrise (chandrodaya rule)
  { tithi: 4,  slug: 'chaturthi',          type: 'vrat', category: 'chaturthi',  recurring: true, paksha: 'krishna', muhurtaRule: 'chandrodaya' },
  // Vinayaka Chaturthi (Shukla)
  // Monthly Vinayaka Chaturthi (Shukla Paksha 4) — observed at Madhyahna
  // (midday) per the classical rule for Vinayaka/Ganapati observances:
  // Ganesha's birth window is midday. Same rule as the annual Ganesh
  // Chaturthi in Bhadrapada. Without this the monthly Vinayaka was
  // firing on the Udaya Tithi day, which occasionally disagreed with
  // Drik on borderline dwi-tithi cases.
  { tithi: 4,  slug: 'vinayaka-chaturthi', type: 'vrat', category: 'chaturthi',  recurring: true, paksha: 'shukla', muhurtaRule: 'madhyahna',
    name: { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', sa: 'विनायकचतुर्थी' } },
  // Pradosham — both pakshas. Observed during Pradosh Kala (sunset window
  // on Trayodashi day); the muhurtaRule='pradosh' surfaces this in the
  // vrat-rule badge AND drives Dharmasindhu purva-vyapini tie-break when
  // Trayodashi touches Pradosh on two consecutive days.
  { tithi: 13, slug: 'pradosham-shukla',   type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'shukla',  muhurtaRule: 'pradosh' },
  { tithi: 13, slug: 'pradosham-krishna',  type: 'vrat', category: 'pradosham',  recurring: true, paksha: 'krishna', muhurtaRule: 'pradosh' },
  // Masik Shivaratri (Krishna Chaturdashi)
  { tithi: 14, slug: 'masik-shivaratri',   type: 'vrat', category: 'vrat',       recurring: true, paksha: 'krishna',
    name: { en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि', sa: 'मासिकशिवरात्रिः' } },
  // Masik Durgashtami (Shukla Ashtami)
  { tithi: 8,  slug: 'masik-durgashtami',  type: 'vrat', category: 'vrat',       recurring: true, paksha: 'shukla',
    name: { en: 'Masik Durgashtami', hi: 'मासिक दुर्गाष्टमी', sa: 'मासिकदुर्गाष्टमी' } },
  // Masik Krishna Janmashtami (Krishna Ashtami)
  { tithi: 8,  slug: 'masik-janmashtami',  type: 'vrat', category: 'vrat',       recurring: true, paksha: 'krishna',
    name: { en: 'Masik Janmashtami', hi: 'मासिक जन्माष्टमी', sa: 'मासिकजन्माष्टमी' } },
  // Skanda Shashthi (Shukla Shashthi)
  { tithi: 6,  slug: 'skanda-shashthi',    type: 'vrat', category: 'vrat',       recurring: true, paksha: 'shukla',
    name: { en: 'Skanda Shashthi', hi: 'स्कन्द षष्ठी', sa: 'स्कन्दषष्ठी' } },
];

// ─── Solar Festivals (Sun entering a sidereal sign  –  use solarMonth field) ───
// solarMonth uses sign number: 1=Aries/Mesh, 2=Taurus/Vrishabha, ..., 10=Capricorn/Makara, 12=Pisces/Meena
// tithi is set to 1 as placeholder  –  actual date is computed from solar ingress in the generator.

export const SOLAR_FESTIVALS: FestivalDef[] = [
  // Capricorn ingress cluster (~Jan 14)
  { solarMonth: 10, tithi: 1, slug: 'makar-sankranti', type: 'major', category: 'sankranti',
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः' } },
  { solarMonth: 10, tithi: 1, slug: 'pongal', type: 'regional', category: 'sankranti', region: 'tamil', family: 'pongal',
    name: { en: 'Pongal / Thai Pongal', hi: 'पोंगल / थाई पोंगल', sa: 'पोङ्गल' } },
  { solarMonth: 10, tithi: 1, slug: 'lohri', type: 'regional', category: 'festival', region: 'punjabi',
    name: { en: 'Lohri', hi: 'लोहड़ी', sa: 'लोहड़ी' } },
  // Bhogi is the Tamil "discard the old" day on the eve of Pongal — solar
  // event keyed to Capricorn ingress with a -1 day offset (see DAY_OFFSETS
  // in solar-festivals.ts). Previously mis-classified as a lunar def at
  // 'kartika krishna 12' in ADDITIONAL_VRATS, which placed it in November
  // instead of mid-January. Audit on 2026-05-31 (post-#310 wiring) caught
  // the misplacement.
  { solarMonth: 10, tithi: 1, slug: 'bhogi', type: 'regional', category: 'festival', family: 'pongal', region: 'tamil',
    name: { en: 'Bhogi', hi: 'भोगी', sa: 'भोगी' } },
  { solarMonth: 10, tithi: 1, slug: 'uttarayan', type: 'regional', category: 'sankranti', region: 'gujarati',
    name: { en: 'Uttarayan', hi: 'उत्तरायण', sa: 'उत्तरायणम्' } },
  { solarMonth: 10, tithi: 1, slug: 'magh-bihu', type: 'regional', category: 'sankranti', region: 'assamese',
    name: { en: 'Magh Bihu', hi: 'माघ बिहू', sa: 'माघबिहू' } },
  { solarMonth: 10, tithi: 1, slug: 'mattu-pongal', type: 'regional', category: 'festival', region: 'tamil', family: 'pongal',
    name: { en: 'Mattu Pongal', hi: 'मट्टू पोंगल', sa: 'मट्टूपोङ्गल' } },
  { solarMonth: 10, tithi: 1, slug: 'kaanum-pongal', type: 'regional', category: 'festival', region: 'tamil', family: 'pongal',
    name: { en: 'Kaanum Pongal', hi: 'कानूम पोंगल', sa: 'कानूम्पोङ्गल' } },
  // Aries ingress cluster (~Apr 14)
  { solarMonth: 1, tithi: 1, slug: 'mesh-sankranti', type: 'major', category: 'sankranti',
    name: { en: 'Mesh Sankranti / Baisakhi', hi: 'मेष संक्रान्ति / बैसाखी', sa: 'मेषसंक्रान्तिः' } },
  { solarMonth: 1, tithi: 1, slug: 'vishu', type: 'regional', category: 'sankranti', region: 'kerala',
    name: { en: 'Vishu', hi: 'विशु', sa: 'विशु' } },
  { solarMonth: 1, tithi: 1, slug: 'puthandu', type: 'regional', category: 'sankranti', region: 'tamil',
    name: { en: 'Puthandu', hi: 'पुतंडू', sa: 'पुतण्डु' } },
  { solarMonth: 1, tithi: 1, slug: 'poila-boishakh', type: 'regional', category: 'sankranti', region: 'bengali',
    name: { en: 'Poila Boishakh', hi: 'पोइला बोइशाख', sa: 'पोइलाबोइशाख' } },
  { solarMonth: 1, tithi: 1, slug: 'bohag-bihu', type: 'regional', category: 'sankranti', region: 'assamese',
    name: { en: 'Bohag Bihu', hi: 'बोहाग बिहू', sa: 'बोहागबिहू' } },
  // Pana Sankranti / Maha Vishuva Sankranti — Odia New Year, Sun enters Aries.
  { solarMonth: 1, tithi: 1, slug: 'pana-sankranti', type: 'regional', category: 'sankranti', region: 'odisha',
    name: { en: 'Pana Sankranti (Odia New Year)', hi: 'पना संक्रान्ति (ओड़िआ नव वर्ष)', sa: 'पनासंक्रान्तिः' } },
  // Jud-Shital / Jur-Sital — Mithila New Year, observed on Mesha Sankranti day.
  // Cold-rice tradition; elders sprinkle water on younger family members.
  { solarMonth: 1, tithi: 1, slug: 'jud-shital', type: 'regional', category: 'sankranti', region: 'maithili',
    name: { en: 'Jud-Shital (Mithila New Year)', hi: 'जुड़-शीतल (मिथिला नव वर्ष)', sa: 'जुड़शीतलम्', mai: 'जुड़-शीतल (मिथिला नव वर्ष)' } },
  // Other Sankrantis (remaining signs)
  { solarMonth: 2, tithi: 1, slug: 'vrishabha-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Vrishabha Sankranti', hi: 'वृषभ संक्रान्ति', sa: 'वृषभसंक्रान्तिः' } },
  { solarMonth: 3, tithi: 1, slug: 'mithuna-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Mithuna Sankranti', hi: 'मिथुन संक्रान्ति', sa: 'मिथुनसंक्रान्तिः' } },
  // Raja Parba — 3-day Odia festival around Mithuna Sankranti. Mithuna
  // Sankranti is Day 2 (Mithuna Sankranti = Raja Sankranti). Day 1 (Pahili
  // Raja) and Day 3 (Basi Raja) flank it. Engine reports the main day; copy
  // in regional pages mentions the 3-day window.
  { solarMonth: 3, tithi: 1, slug: 'raja-parba', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Raja Parba (Mithuna Sankranti)', hi: 'रज पर्व (मिथुन संक्रान्ति)', sa: 'रजपर्वम्' } },
  { solarMonth: 4, tithi: 1, slug: 'karka-sankranti', type: 'major', category: 'sankranti',
    name: { en: 'Karka Sankranti (Dakshinayana)', hi: 'कर्क संक्रान्ति (दक्षिणायन)', sa: 'कर्कसंक्रान्तिः (दक्षिणायनम्)' } },
  { solarMonth: 5, tithi: 1, slug: 'simha-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Simha Sankranti', hi: 'सिंह संक्रान्ति', sa: 'सिंहसंक्रान्तिः' } },
  { solarMonth: 6, tithi: 1, slug: 'kanya-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Kanya Sankranti', hi: 'कन्या संक्रान्ति', sa: 'कन्यासंक्रान्तिः' } },
  { solarMonth: 7, tithi: 1, slug: 'tula-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Tula Sankranti', hi: 'तुला संक्रान्ति', sa: 'तुलासंक्रान्तिः' } },
  { solarMonth: 8, tithi: 1, slug: 'vrischika-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Vrischika Sankranti', hi: 'वृश्चिक संक्रान्ति', sa: 'वृश्चिकसंक्रान्तिः' } },
  { solarMonth: 9, tithi: 1, slug: 'dhanu-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Dhanu Sankranti', hi: 'धनु संक्रान्ति', sa: 'धनुसंक्रान्तिः' } },
  { solarMonth: 11, tithi: 1, slug: 'kumbha-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Kumbha Sankranti', hi: 'कुम्भ संक्रान्ति', sa: 'कुम्भसंक्रान्तिः' } },
  { solarMonth: 12, tithi: 1, slug: 'meena-sankranti', type: 'vrat', category: 'sankranti',
    name: { en: 'Meena Sankranti', hi: 'मीन संक्रान्ति', sa: 'मीनसंक्रान्तिः' } },
];

// ─── Regional Festivals (masa-specific, region-tagged) ───

export const REGIONAL_FESTIVALS: FestivalDef[] = [
  // Chaitra  –  New Year cluster
  { masa: 'chaitra', paksha: 'shukla', tithi: 1, slug: 'ugadi', type: 'regional', category: 'festival', region: 'telugu',
    name: { en: 'Ugadi', hi: 'उगादि', sa: 'युगादिः', te: 'ఉగాది', kn: 'ಯುಗಾದಿ', ta: 'உகாதி', bn: 'উগাদি', gu: 'ઉગાદિ', mr: 'उगादी', mai: 'उगादि' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 1, slug: 'gudi-padwa', type: 'regional', category: 'festival', region: 'marathi',
    name: { en: 'Gudi Padwa', hi: 'गुडी पाडवा', sa: 'गुडीपाडवा', mr: 'गुढी पाडवा', mai: 'गुडी पाडवा', gu: 'ગુડી પાડવો', bn: 'গুড়ি পাড়োয়া', te: 'గుడి పడ్వా', ta: 'குடி பாட்வா', kn: 'ಗುಡಿ ಪಾಡ್ವಾ' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 1, slug: 'navreh', type: 'regional', category: 'festival', region: 'kashmiri',
    name: { en: 'Navreh', hi: 'नवरेह', sa: 'नवरेह' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 2, slug: 'cheti-chand', type: 'regional', category: 'festival', region: 'sindhi',
    name: { en: 'Cheti Chand', hi: 'चेटी चंद', sa: 'चेटीचन्द' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 5, slug: 'ramanuja-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Ramanuja Jayanti', hi: 'रामानुज जयन्ती', sa: 'रामानुजजयन्ती' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 6, slug: 'saraswati-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Saraswati Jayanti', hi: 'सरस्वती जयन्ती', sa: 'सरस्वतीजयन्ती' } },
  // Phalguna
  { masa: 'phalguna', paksha: 'krishna', tithi: 5, slug: 'rang-panchami', type: 'regional', category: 'festival', family: 'holi',
    name: { en: 'Rang Panchami', hi: 'रंग पंचमी', sa: 'रङ्गपञ्चमी' } },
  { masa: 'phalguna', paksha: 'shukla', tithi: 15, slug: 'chaitanya-mahaprabhu-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Chaitanya Mahaprabhu Jayanti', hi: 'चैतन्य महाप्रभु जयन्ती', sa: 'चैतन्यमहाप्रभुजयन्ती' } },
  // Vaishakha
  { masa: 'vaishakha', paksha: 'shukla', tithi: 5, slug: 'shankaracharya-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Shankaracharya Jayanti', hi: 'शंकराचार्य जयन्ती', sa: 'शङ्कराचार्यजयन्ती' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 10, slug: 'sita-navami', type: 'regional', category: 'festival', tradition: 'vaishnava',
    name: { en: 'Sita Navami', hi: 'सीता नवमी', sa: 'सीतानवमी' } },
  // Jyeshtha
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 15, slug: 'kabir-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Kabir Jayanti', hi: 'कबीर जयन्ती', sa: 'कबीरजयन्ती' } },
  // Shravana
  { masa: 'shravana', paksha: 'krishna', tithi: 7, slug: 'tulsidas-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Tulsidas Jayanti', hi: 'तुलसीदास जयन्ती', sa: 'तुलसीदासजयन्ती' } },
  { masa: 'shravana', paksha: 'krishna', tithi: 14, slug: 'sawan-shivratri', type: 'regional', category: 'festival', tradition: 'shaiva',
    name: { en: 'Sawan Shivratri', hi: 'सावन शिवरात्रि', sa: 'श्रावणशिवरात्रिः' }, muhurtaRule: 'nishita' },
  // Bhadrapada
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 8, slug: 'radha-ashtami', type: 'regional', category: 'festival', tradition: 'vaishnava',
    name: { en: 'Radha Ashtami', hi: 'राधा अष्टमी', sa: 'राधाष्टमी' } },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 12, slug: 'vamana-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Vamana Jayanti', hi: 'वामन जयन्ती', sa: 'वामनजयन्ती' } },
  // Ashwina  –  Durga Puja cluster
  { masa: 'ashwina', paksha: 'shukla', tithi: 6, slug: 'durga-puja-shashti', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta',
    name: { en: 'Durga Puja Shashti', hi: 'दुर्गा पूजा षष्ठी', sa: 'दुर्गापूजाषष्ठी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 7, slug: 'durga-puja-saptami', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta',
    name: { en: 'Durga Puja Saptami', hi: 'दुर्गा पूजा सप्तमी', sa: 'दुर्गापूजासप्तमी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 8, slug: 'durga-puja-ashtami', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta',
    name: { en: 'Durga Puja Ashtami', hi: 'दुर्गा पूजा अष्टमी', sa: 'दुर्गापूजाष्टमी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 9, slug: 'durga-puja-navami', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta',
    name: { en: 'Durga Puja Navami', hi: 'दुर्गा पूजा नवमी', sa: 'दुर्गापूजानवमी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 10, slug: 'sindoor-khela', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta',
    name: { en: 'Sindoor Khela / Vijaya Dashami', hi: 'सिन्दूर खेला / विजया दशमी', sa: 'सिन्दूरखेला' } },
  // Kojagiri Purnima (Maharashtra) and Lakshmi Puja Bengali both share Ashwina
  // Shukla 15 with Sharad Purnima and follow the same nishita-vyāpinī rule —
  // moon-watching at midnight, Lakshmi vigil. See sharad-purnima def above for
  // full classical citation. Without the rule the engine defaulted to Udaya
  // Tithi and landed 1 day later than the mainstream observance (2026: engine
  // without rule = Oct 26, with rule = Oct 25). Drik audit 2026-06-11.
  { masa: 'ashwina', paksha: 'shukla', tithi: 15, slug: 'kojagiri-purnima', type: 'regional', category: 'purnima', region: 'marathi', muhurtaRule: 'nishita',
    name: { en: 'Kojagiri Purnima', hi: 'कोजागिरी पूर्णिमा', sa: 'कोजागरीपूर्णिमा' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 15, slug: 'lakshmi-puja-bengali', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta', muhurtaRule: 'nishita',
    name: { en: 'Lakshmi Puja', hi: 'लक्ष्मी पूजा', sa: 'लक्ष्मीपूजा' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 3, slug: 'meera-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Meera Jayanti', hi: 'मीरा जयन्ती', sa: 'मीराजयन्ती' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 9, slug: 'akshaya-navami', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Akshaya Navami', hi: 'अक्षय नवमी', sa: 'अक्षयनवमी' } },
  // Kartika  –  Diwali extensions & Bengal
  // Kali Puja (Bengali / East Indian observance — Kali Chaudas in some
  // regions) is nishita-vyāpinī Chaturdashi — midnight Kali worship. Same
  // tithi as Naraka Chaturdashi but a different observance (arunodaya vs
  // nishita). When Naraka Chaturdashi moved to `arunodaya` (mainstream
  // Choti Diwali / Abhyang Snan), Kali Puja keeps `nishita` to preserve the
  // East Indian midnight observance on its own slug. For 2026: Kali Puja =
  // Nov 7 (Chaturdashi present during nishita kaal of Nov 7), Naraka
  // Chaturdashi = Nov 8 (Chaturdashi present at arunodaya/sunrise of Nov 8).
  // Drik audit 2026-06-11.
  { masa: 'kartika', paksha: 'krishna', tithi: 14, slug: 'kali-puja', type: 'regional', category: 'festival', region: 'bengali', tradition: 'shakta', muhurtaRule: 'nishita',
    name: { en: 'Kali Puja', hi: 'काली पूजा', sa: 'कालीपूजा' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 14, slug: 'roop-chaturdashi', type: 'regional', category: 'festival', family: 'diwali',
    name: { en: 'Roop Chaturdashi', hi: 'रूप चतुर्दशी', sa: 'रूपचतुर्दशी' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 1, slug: 'annakut', type: 'regional', category: 'festival', family: 'diwali', tradition: 'vaishnava',
    name: { en: 'Annakut', hi: 'अन्नकूट', sa: 'अन्नकूटः' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 2, slug: 'yama-dwitiya', type: 'regional', category: 'festival', family: 'diwali',
    name: { en: 'Yama Dwitiya', hi: 'यम द्वितीया', sa: 'यमद्वितीया' } },
  // Ahoi Ashtami is pradosh-vyāpinī Ashtami — the fast is broken in the
  // evening after the mother sights the stars and offers worship in the
  // pradosh window (sunset + ~96 minutes). Classical basis: the legend
  // attaches to the evening sighting of Goddess Ahoi after a day-long
  // nirjala fast for children's welfare. The mainstream Indian panchang
  // labels the per-festival page muhurat as "Ahoi Ashtami Puja Muhurat"
  // and "Sanjh time for sighting Stars". Without this rule the engine
  // defaulted to Udaya Tithi and landed 1 day later (2026: engine without
  // rule = Nov 2, with rule = Nov 1 — Ashtami present in pradosh of Nov 1).
  // Drik audit 2026-06-11.
  { masa: 'kartika', paksha: 'krishna', tithi: 8, slug: 'ahoi-ashtami', type: 'regional', category: 'vrat', muhurtaRule: 'pradosh',
    name: { en: 'Ahoi Ashtami', hi: 'अहोई अष्टमी', sa: 'अहोईअष्टमी' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 15, slug: 'dev-diwali', type: 'regional', category: 'festival', region: 'varanasi',
    name: { en: 'Dev Diwali', hi: 'देव दीवाली', sa: 'देवदीपावलिः' } },
  // Magha  –  Bengal Saraswati
  { masa: 'magha', paksha: 'shukla', tithi: 5, slug: 'saraswati-puja-bengali', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Saraswati Puja', hi: 'सरस्वती पूजा', sa: 'सरस्वतीपूजा' } },
  { masa: 'magha', paksha: 'shukla', tithi: 9, slug: 'madhvacharya-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Madhvacharya Jayanti', hi: 'मध्वाचार्य जयन्ती', sa: 'मध्वाचार्यजयन्ती' } },
  { masa: 'magha', paksha: 'shukla', tithi: 15, slug: 'guru-ravidas-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Guru Ravidas Jayanti', hi: 'गुरु रविदास जयन्ती', sa: 'गुरुरविदासजयन्ती' } },
  { masa: 'magha', paksha: 'shukla', tithi: 15, slug: 'thaipusam', type: 'regional', category: 'festival', region: 'tamil', tradition: 'shaiva',
    name: { en: 'Thaipusam', hi: 'थाईपूसम', sa: 'थाईपूषम्' } },
  { masa: 'magha', paksha: 'krishna', tithi: 15, slug: 'thai-amavasya', type: 'regional', category: 'amavasya', region: 'tamil',
    name: { en: 'Thai Amavasya', hi: 'थाई अमावस्या', sa: 'थाईअमावास्या' } },
];

// ─── Pitru (Ancestor) Festivals ───

export const PITRU_FESTIVALS: FestivalDef[] = [
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 15, slug: 'pitru-paksha-begins', type: 'vrat', category: 'festival',
    name: { en: 'Pitru Paksha Begins', hi: 'पितृ पक्ष आरम्भ', sa: 'पितृपक्षारम्भः' } },
  { masa: 'ashwina', paksha: 'krishna', tithi: 15, slug: 'mahalaya-amavasya', type: 'major', category: 'amavasya',
    name: { en: 'Mahalaya (Sarva Pitru Amavasya)', hi: 'महालया (सर्वपितृ अमावस्या)', sa: 'महालया (सर्वपितृअमावास्या)' } },
  { masa: 'ashwina', paksha: 'krishna', tithi: 1, slug: 'bharani-shraddha', type: 'vrat', category: 'vrat',
    name: { en: 'Bharani Shraddha', hi: 'भरणी श्राद्ध', sa: 'भरणीश्राद्धम्' } },
];

// ─── Jain, Sikh & Buddhist Festivals ───

export const JAIN_SIKH_FESTIVALS: FestivalDef[] = [
  // Jain
  { masa: 'chaitra', paksha: 'shukla', tithi: 13, slug: 'mahavir-jayanti', type: 'major', category: 'jayanti', tradition: 'jain',
    name: { en: 'Mahavir Jayanti', hi: 'महावीर जयन्ती', sa: 'महावीरजयन्ती' } },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 5, slug: 'paryushana', type: 'regional', category: 'festival', tradition: 'jain',
    name: { en: 'Paryushana Begins', hi: 'पर्युषण आरम्भ', sa: 'पर्युषणारम्भः' } },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 13, slug: 'paryushana-ends', type: 'regional', category: 'festival', tradition: 'jain',
    name: { en: 'Paryushana Ends (Samvatsari)', hi: 'पर्युषण समाप्ति (संवत्सरी)', sa: 'संवत्सरी' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 15, slug: 'jain-diwali', type: 'regional', category: 'festival', tradition: 'jain', family: 'diwali',
    name: { en: 'Jain Diwali (Mahavir Nirvana)', hi: 'जैन दीवाली (महावीर निर्वाण)', sa: 'महावीरनिर्वाणदिनम्' } },
  { masa: 'ashwina', paksha: 'krishna', tithi: 10, slug: 'dashlakshana', type: 'regional', category: 'festival', tradition: 'jain',
    name: { en: 'Dashlakshana (Paryushana Digambara)', hi: 'दशलक्षण', sa: 'दशलक्षणम्' } },
  // Sikh
  { masa: 'kartika', paksha: 'shukla', tithi: 15, slug: 'guru-nanak-jayanti', type: 'major', category: 'jayanti', tradition: 'sikh',
    name: { en: 'Guru Nanak Jayanti', hi: 'गुरु नानक जयन्ती', sa: 'गुरुनानकजयन्ती' } },
  { masa: 'pausha', paksha: 'shukla', tithi: 7, slug: 'guru-gobind-singh-jayanti', type: 'regional', category: 'jayanti', tradition: 'sikh',
    name: { en: 'Guru Gobind Singh Jayanti', hi: 'गुरु गोबिन्द सिंह जयन्ती', sa: 'गुरुगोबिन्दसिंहजयन्ती' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 15, slug: 'bandi-chhor-divas', type: 'regional', category: 'festival', tradition: 'sikh', family: 'diwali',
    name: { en: 'Bandi Chhor Divas', hi: 'बन्दी छोड़ दिवस', sa: 'बन्दीछोड्दिवसः' } },
  // Buddhist
  { masa: 'vaishakha', paksha: 'shukla', tithi: 15, slug: 'vesak', type: 'regional', category: 'festival', tradition: 'buddhist',
    name: { en: 'Vesak / Buddha Purnima', hi: 'वेसाक / बुद्ध पूर्णिमा', sa: 'वैशाखपूर्णिमा' } },
  { masa: 'ashadha', paksha: 'shukla', tithi: 15, slug: 'asadha-puja', type: 'regional', category: 'festival', tradition: 'buddhist',
    name: { en: 'Asalha Puja (Dharma Day)', hi: 'आषाढ़ पूजा (धर्म दिवस)', sa: 'आषाढपूजा' } },
];

// ─── Additional Vrats & Observances ───

export const ADDITIONAL_VRATS: FestivalDef[] = [
  // Conditional vrats (weekday + tithi)
  { tithi: 15, slug: 'somvati-amavasya', type: 'vrat', category: 'amavasya', recurring: true, paksha: 'krishna', weekday: 1,
    name: { en: 'Somvati Amavasya', hi: 'सोमवती अमावस्या', sa: 'सोमवत्यमावास्या' } },
  { tithi: 15, slug: 'shani-amavasya', type: 'vrat', category: 'amavasya', recurring: true, paksha: 'krishna', weekday: 6,
    name: { en: 'Shani Amavasya', hi: 'शनि अमावस्या', sa: 'शन्यमावास्या' } },
  // Month-specific vrats
  // bhogi moved to SOLAR_FESTIVALS (-1 day offset from Pongal/Makar Sankranti
  // via DAY_OFFSETS in solar-festivals.ts) — it's a solar event, not lunar.
  { masa: 'margashirsha', paksha: 'shukla', tithi: 15, slug: 'annapurna-jayanti', type: 'vrat', category: 'jayanti',
    name: { en: 'Annapurna Jayanti', hi: 'अन्नपूर्णा जयन्ती', sa: 'अन्नपूर्णाजयन्ती' } },
  { masa: 'margashirsha', paksha: 'shukla', tithi: 15, slug: 'dattatreya-jayanti', type: 'vrat', category: 'jayanti',
    name: { en: 'Dattatreya Jayanti', hi: 'दत्तात्रेय जयन्ती', sa: 'दत्तात्रेयजयन्ती' } },
  // vaikuntha-ekadashi was retired 2026-06-07.
  //
  // Vaikuntha Ekadashi (South-Indian / Vaishnava name) and Mokshada
  // Ekadashi (pan-Indian / Smarta name) refer to the SAME tithi —
  // Margashirsha Shukla 11. They were two separate defs producing
  // dedup-clash on the same date: Vaikuntha ran first via the major-
  // festival path and silently dropped Mokshada from the generic
  // ekadashi pass, and Vaikuntha was mistagged `type='regional'`
  // even though it's universally observed (Tamil Nadu, AP, Karnataka,
  // ISKCON worldwide, every Vishnu temple).
  //
  // Fix: Mokshada in EKADASHI_DEFS is the canonical entry. Vaikuntha
  // is surfaced as an `alternateName` on the EKADASHI_NAMES entry so
  // South-Indian / Vaishnava users see their familiar name as a
  // prominent subtitle. Same tithi, same parana, same vrat, one card.
  { masa: 'margashirsha', paksha: 'shukla', tithi: 11, slug: 'gita-jayanti', type: 'vrat', category: 'jayanti',
    name: { en: 'Gita Jayanti', hi: 'गीता जयन्ती', sa: 'गीताजयन्ती' } },
  { masa: 'magha', paksha: 'krishna', tithi: 15, slug: 'mauni-amavasya', type: 'major', category: 'amavasya',
    name: { en: 'Mauni Amavasya', hi: 'मौनी अमावस्या', sa: 'मौन्यमावास्या' } },
  { masa: 'magha', paksha: 'shukla', tithi: 15, slug: 'magh-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Magh Purnima', hi: 'माघ पूर्णिमा', sa: 'माघपूर्णिमा' } },
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 15, slug: 'jyeshtha-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Jyeshtha Purnima', hi: 'ज्येष्ठ पूर्णिमा', sa: 'ज्येष्ठापूर्णिमा' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 15, slug: 'ashwina-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Ashwina Purnima', hi: 'अश्विन पूर्णिमा', sa: 'आश्विनपूर्णिमा' } },
  // Masik Ekadashi (Shukla)  –  generic recurring for months without a named one
  { tithi: 11, slug: 'ekadashi-shukla', type: 'vrat', category: 'ekadashi', recurring: true, paksha: 'shukla',
    name: { en: 'Shukla Ekadashi', hi: 'शुक्ल एकादशी', sa: 'शुक्लैकादशी' } },
  // Masik Ekadashi (Krishna)  –  generic recurring
  { tithi: 11, slug: 'ekadashi-krishna', type: 'vrat', category: 'ekadashi', recurring: true, paksha: 'krishna',
    name: { en: 'Krishna Ekadashi', hi: 'कृष्ण एकादशी', sa: 'कृष्णैकादशी' } },
  // Masik Panchami (Nag Panchami is monthly in some traditions)
  { tithi: 5, slug: 'masik-panchami', type: 'vrat', category: 'vrat', recurring: true, paksha: 'shukla',
    name: { en: 'Masik Panchami', hi: 'मासिक पंचमी', sa: 'मासिकपञ्चमी' } },
  // Masik Navami
  { tithi: 9, slug: 'masik-navami', type: 'vrat', category: 'vrat', recurring: true, paksha: 'shukla',
    name: { en: 'Masik Navami', hi: 'मासिक नवमी', sa: 'मासिकनवमी' } },
  // Masik Dashami
  { tithi: 10, slug: 'masik-dashami', type: 'vrat', category: 'vrat', recurring: true, paksha: 'shukla',
    name: { en: 'Masik Dashami', hi: 'मासिक दशमी', sa: 'मासिकदशमी' } },
  // Masik Dwadashi
  { tithi: 12, slug: 'masik-dwadashi', type: 'vrat', category: 'vrat', recurring: true, paksha: 'shukla',
    name: { en: 'Masik Dwadashi', hi: 'मासिक द्वादशी', sa: 'मासिकद्वादशी' } },
  // Saptami vrat
  { tithi: 7, slug: 'masik-saptami', type: 'vrat', category: 'vrat', recurring: true, paksha: 'shukla',
    name: { en: 'Masik Saptami', hi: 'मासिक सप्तमी', sa: 'मासिकसप्तमी' } },
];

// ─── Jayantis & Commemorations ───

export const JAYANTI_FESTIVALS: FestivalDef[] = [
  // Already existing in MAJOR: Hanuman Jayanti, Parashurama Jayanti, Narasimha Jayanti, Buddha Purnima
  // New Jayantis:
  { masa: 'bhadrapada', paksha: 'krishna', tithi: 8, slug: 'sri-krishna-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Shri Krishna Jayanti', hi: 'श्री कृष्ण जयन्ती', sa: 'श्रीकृष्णजयन्ती' }, muhurtaRule: 'nishita' },
  { masa: 'ashwina', paksha: 'shukla', tithi: 15, slug: 'valmiki-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Valmiki Jayanti', hi: 'वाल्मीकि जयन्ती', sa: 'वाल्मीकिजयन्ती' } },
  { masa: 'pausha', paksha: 'shukla', tithi: 12, slug: 'swami-vivekananda-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Swami Vivekananda Jayanti', hi: 'स्वामी विवेकानन्द जयन्ती', sa: 'स्वामीविवेकानन्दजयन्ती' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 6, slug: 'adi-shankaracharya-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Adi Shankaracharya Jayanti', hi: 'आदि शंकराचार्य जयन्ती', sa: 'आदिशङ्कराचार्यजयन्ती' } },
  { masa: 'shravana', paksha: 'krishna', tithi: 2, slug: 'patanjali-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Patanjali Jayanti', hi: 'पतंजलि जयन्ती', sa: 'पतञ्जलिजयन्ती' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 13, slug: 'vardhaman-mahavir-jayanti', type: 'regional', category: 'jayanti', tradition: 'jain',
    name: { en: 'Vardhaman Mahavir Jayanti', hi: 'वर्धमान महावीर जयन्ती', sa: 'वर्धमानमहावीरजयन्ती' } },
  { masa: 'margashirsha', paksha: 'shukla', tithi: 2, slug: 'guru-tegh-bahadur-jayanti', type: 'regional', category: 'jayanti', tradition: 'sikh',
    name: { en: 'Guru Tegh Bahadur Jayanti', hi: 'गुरु तेग बहादुर जयन्ती', sa: 'गुरुतेगबहादुरजयन्ती' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 4, slug: 'karwa-chauth-bhai', type: 'regional', category: 'jayanti',
    name: { en: 'Guru Nanak Dev Birthday', hi: 'गुरु नानक देव जन्मदिन', sa: 'गुरुनानकदेवजन्मदिनम्' } },
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 10, slug: 'ganga-dussehra-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Gangavataran (Ganga Jayanti)', hi: 'गंगावतरण (गंगा जयन्ती)', sa: 'गङ्गावतरणम्' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 9, slug: 'lord-rama-birthday', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Sri Rama Navami', hi: 'श्री राम नवमी', sa: 'श्रीरामनवमी' }, muhurtaRule: 'madhyahna' },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 4, slug: 'ganesh-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Ganesh Jayanti (Chaturthi)', hi: 'गणेश जयन्ती (चतुर्थी)', sa: 'गणेशजयन्ती' }, muhurtaRule: 'madhyahna' },
  { masa: 'margashirsha', paksha: 'shukla', tithi: 5, slug: 'surya-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Surya Jayanti', hi: 'सूर्य जयन्ती', sa: 'सूर्यजयन्ती' } },
  { masa: 'phalguna', paksha: 'shukla', tithi: 3, slug: 'sita-jayanti', type: 'regional', category: 'jayanti', tradition: 'vaishnava',
    name: { en: 'Sita Jayanti', hi: 'सीता जयन्ती', sa: 'सीताजयन्ती' } },
  { masa: 'pausha', paksha: 'krishna', tithi: 5, slug: 'saphala-jayanti', type: 'regional', category: 'jayanti',
    name: { en: 'Safala Jayanti', hi: 'सफला जयन्ती', sa: 'सफलाजयन्ती' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 9, slug: 'akshaya-navami-kartik', type: 'regional', category: 'jayanti',
    name: { en: 'Akshaya Navami (Amla Navami)', hi: 'अक्षय नवमी (आमला नवमी)', sa: 'अक्षयनवमी' } },
];

// ─── Additional Major Festivals & Purnima Aliases ───

export const ADDITIONAL_MAJOR_FESTIVALS: FestivalDef[] = [
  // Purnima aliases
  { masa: 'phalguna', paksha: 'shukla', tithi: 15, slug: 'phalguna-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Phalguna Purnima', hi: 'फाल्गुन पूर्णिमा', sa: 'फाल्गुनपूर्णिमा' } },
  { masa: 'ashadha', paksha: 'shukla', tithi: 15, slug: 'ashadha-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Ashadha Purnima', hi: 'आषाढ़ पूर्णिमा', sa: 'आषाढपूर्णिमा' } },
  { masa: 'shravana', paksha: 'shukla', tithi: 15, slug: 'shravan-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Shravana Purnima', hi: 'श्रावण पूर्णिमा', sa: 'श्रावणपूर्णिमा' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 15, slug: 'chaitra-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Chaitra Purnima', hi: 'चैत्र पूर्णिमा', sa: 'चैत्रपूर्णिमा' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 15, slug: 'vaishakha-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Vaishakha Purnima', hi: 'वैशाख पूर्णिमा', sa: 'वैशाखपूर्णिमा' } },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 15, slug: 'bhadrapada-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Bhadrapada Purnima', hi: 'भाद्रपद पूर्णिमा', sa: 'भाद्रपदपूर्णिमा' } },
  { masa: 'margashirsha', paksha: 'shukla', tithi: 15, slug: 'margashirsha-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Margashirsha Purnima', hi: 'मार्गशीर्ष पूर्णिमा', sa: 'मार्गशीर्षपूर्णिमा' } },
  { masa: 'pausha', paksha: 'shukla', tithi: 15, slug: 'pausha-purnima', type: 'vrat', category: 'purnima',
    name: { en: 'Pausha Purnima', hi: 'पौष पूर्णिमा', sa: 'पौषपूर्णिमा' } },
  // Amavasya named
  { masa: 'chaitra', paksha: 'krishna', tithi: 15, slug: 'chaitra-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Chaitra Amavasya', hi: 'चैत्र अमावस्या', sa: 'चैत्रअमावास्या' } },
  { masa: 'vaishakha', paksha: 'krishna', tithi: 15, slug: 'vaishakha-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Vaishakha Amavasya', hi: 'वैशाख अमावस्या', sa: 'वैशाखअमावास्या' } },
  { masa: 'jyeshtha', paksha: 'krishna', tithi: 15, slug: 'jyeshtha-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Jyeshtha Amavasya', hi: 'ज्येष्ठ अमावस्या', sa: 'ज्येष्ठअमावास्या' } },
  { masa: 'ashadha', paksha: 'krishna', tithi: 15, slug: 'ashadha-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Ashadha Amavasya', hi: 'आषाढ़ अमावस्या', sa: 'आषाढअमावास्या' } },
  { masa: 'shravana', paksha: 'krishna', tithi: 15, slug: 'shravana-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Shravana Amavasya', hi: 'श्रावण अमावस्या', sa: 'श्रावणअमावास्या' } },
  { masa: 'bhadrapada', paksha: 'krishna', tithi: 15, slug: 'bhadrapada-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Bhadrapada Amavasya', hi: 'भाद्रपद अमावस्या', sa: 'भाद्रपदअमावास्या' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 15, slug: 'kartika-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Kartika Amavasya', hi: 'कार्तिक अमावस्या', sa: 'कार्तिकअमावास्या' } },
  { masa: 'margashirsha', paksha: 'krishna', tithi: 15, slug: 'margashirsha-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Margashirsha Amavasya', hi: 'मार्गशीर्ष अमावस्या', sa: 'मार्गशीर्षअमावास्या' } },
  { masa: 'pausha', paksha: 'krishna', tithi: 15, slug: 'pausha-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Pausha Amavasya', hi: 'पौष अमावस्या', sa: 'पौषअमावास्या' } },
  { masa: 'phalguna', paksha: 'krishna', tithi: 15, slug: 'phalguna-amavasya', type: 'vrat', category: 'amavasya',
    name: { en: 'Phalguna Amavasya', hi: 'फाल्गुन अमावस्या', sa: 'फाल्गुनअमावास्या' } },
  // Additional major
  { masa: 'ashwina', paksha: 'shukla', tithi: 1, slug: 'navratri-ghatasthapana', type: 'major', category: 'festival',
    name: { en: 'Ghatasthapana (Navratri Day 1)', hi: 'घटस्थापना (नवरात्रि दिन 1)', sa: 'घटस्थापना' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 2, slug: 'navratri-day2', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 2 (Brahmacharini)', hi: 'नवरात्रि दिन 2 (ब्रह्मचारिणी)', sa: 'ब्रह्मचारिणी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 3, slug: 'navratri-day3', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 3 (Chandraghanta)', hi: 'नवरात्रि दिन 3 (चन्द्रघण्टा)', sa: 'चन्द्रघण्टा' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 4, slug: 'navratri-day4', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 4 (Kushmanda)', hi: 'नवरात्रि दिन 4 (कुष्माण्डा)', sa: 'कुष्माण्डा' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 5, slug: 'navratri-day5', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 5 (Skandamata)', hi: 'नवरात्रि दिन 5 (स्कन्दमाता)', sa: 'स्कन्दमाता' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 6, slug: 'navratri-day6', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 6 (Katyayani)', hi: 'नवरात्रि दिन 6 (कात्यायनी)', sa: 'कात्यायनी' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 7, slug: 'navratri-day7', type: 'major', category: 'festival',
    name: { en: 'Navratri Day 7 (Kaalratri)', hi: 'नवरात्रि दिन 7 (कालरात्रि)', sa: 'कालरात्रिः' } },
  // Chaitra Navratri days
  { masa: 'chaitra', paksha: 'shukla', tithi: 2, slug: 'chaitra-navratri-day2', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 2 (Brahmacharini)', hi: 'चैत्र नवरात्रि दिन 2', sa: 'ब्रह्मचारिणी' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 3, slug: 'chaitra-navratri-day3', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 3 (Chandraghanta)', hi: 'चैत्र नवरात्रि दिन 3', sa: 'चन्द्रघण्टा' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 4, slug: 'chaitra-navratri-day4', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 4 (Kushmanda)', hi: 'चैत्र नवरात्रि दिन 4', sa: 'कुष्माण्डा' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 5, slug: 'chaitra-navratri-day5', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 5 (Skandamata)', hi: 'चैत्र नवरात्रि दिन 5', sa: 'स्कन्दमाता' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 6, slug: 'chaitra-navratri-day6', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 6 (Katyayani)', hi: 'चैत्र नवरात्रि दिन 6', sa: 'कात्यायनी' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 7, slug: 'chaitra-navratri-day7', type: 'major', category: 'festival',
    name: { en: 'Chaitra Navratri Day 7 (Kaalratri)', hi: 'चैत्र नवरात्रि दिन 7', sa: 'कालरात्रिः' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 8, slug: 'chaitra-navratri-ashtami', type: 'major', category: 'festival',
    name: { en: 'Chaitra Durga Ashtami', hi: 'चैत्र दुर्गाष्टमी', sa: 'चैत्रदुर्गाष्टमी' } },
  // Gupta Navratri (Magha, Ashadha)
  { masa: 'ashadha', paksha: 'shukla', tithi: 1, slug: 'ashadha-gupta-navratri', type: 'major', category: 'festival',
    name: { en: 'Ashadha Gupta Navratri', hi: 'आषाढ़ गुप्त नवरात्रि', sa: 'आषाढगुप्तनवरात्रिः' } },
  // More misc major
  { masa: 'shravana', paksha: 'shukla', tithi: 11, slug: 'putrada-ekadashi-shravana', type: 'vrat', category: 'ekadashi',
    name: { en: 'Putrada Ekadashi (Shravana)', hi: 'पुत्रदा एकादशी (श्रावण)', sa: 'पुत्रदैकादशी' } },
  { masa: 'phalguna', paksha: 'shukla', tithi: 5, slug: 'basant-panchami-alt', type: 'vrat', category: 'festival',
    name: { en: 'Basant Panchami (Phalguna)', hi: 'बसन्त पंचमी (फाल्गुन)', sa: 'वसन्तपञ्चमी' } },
  // Kartik Snaan
  { masa: 'kartika', paksha: 'shukla', tithi: 1, slug: 'kartik-snaan-begins', type: 'vrat', category: 'vrat',
    name: { en: 'Kartik Snaan Begins', hi: 'कार्तिक स्नान आरम्भ', sa: 'कार्तिकस्नानारम्भः' } },
  // Purushottam / Adhika Masa
  { masa: 'kartika', paksha: 'shukla', tithi: 15, slug: 'tripurari-purnima', type: 'vrat', category: 'purnima', tradition: 'shaiva',
    name: { en: 'Tripurari Purnima', hi: 'त्रिपुरारी पूर्णिमा', sa: 'त्रिपुरारीपूर्णिमा' } },
];

// ─── More Regional & Minor Festivals ───

export const MORE_REGIONAL_FESTIVALS: FestivalDef[] = [
  // Odia festivals
  { masa: 'margashirsha', paksha: 'krishna', tithi: 8, slug: 'prathamastami', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Prathamastami', hi: 'प्रथमाष्टमी', sa: 'प्रथमाष्टमी' } },
  // Pana Sankranti / Maha Vishuva Sankranti = Odia New Year = Sun's ingress
  // into Aries (Mesha Sankranti, ~April 14). MOVED to SOLAR_FESTIVALS so
  // resolveSolarFestivals picks it up — entries with `solarMonth` in
  // MORE_REGIONAL_FESTIVALS are silently filtered out by isLunarDef.
  // Previous lunar def at Chaitra Shukla 1 (= Ugadi) produced wrong dates
  // (Mar 19 2026 instead of Apr 14 2026). Surfaced 2026-06-11.
  // Bahuda Yatra = Return Rath Yatra, deities procession back from Gundicha
  // temple to the main Jagannath temple on Ashadha Shukla Dashami (10), NOT 14.
  // Previous def at tithi=14 placed it 4 days late vs Drik Panchang.
  // Sequence: Rath Yatra (Sh.2) → Hera Panchami (Sh.5) → Bahuda Yatra (Sh.10)
  // → Suna Besha (Sh.11) → Niladri Bije (Sh.13).
  { masa: 'ashadha', paksha: 'shukla', tithi: 10, slug: 'bahuda-yatra', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Bahuda Yatra', hi: 'बहुदा यात्रा', sa: 'बहुदायात्रा' } },
  // Gujarat
  { masa: 'kartika', paksha: 'shukla', tithi: 1, slug: 'gujarati-new-year', type: 'regional', category: 'festival', region: 'gujarati', family: 'diwali',
    name: { en: 'Gujarati New Year (Bestu Varas)', hi: 'गुजराती नव वर्ष (बेस्तू वरस)', sa: 'गुजराती-नववर्षः' } },
  { masa: 'ashwina', paksha: 'shukla', tithi: 10, slug: 'dandiya-raas', type: 'regional', category: 'festival', region: 'gujarati',
    name: { en: 'Dandiya Raas (Garba Night)', hi: 'डांडिया रास (गरबा रात)', sa: 'दण्डियारासः' } },
  // Tamil
  { masa: 'shravana', paksha: 'shukla', tithi: 3, slug: 'aadi-perukku', type: 'regional', category: 'festival', region: 'tamil',
    name: { en: 'Aadi Perukku', hi: 'आडि पेरुक्कू', sa: 'आडिपेरुक्कू' } },
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 4, slug: 'vinayagar-chaturthi', type: 'regional', category: 'festival', region: 'tamil',
    name: { en: 'Vinayagar Chaturthi', hi: 'विनायगर चतुर्थी', sa: 'विनायकचतुर्थी' } },
  // Kerala
  { masa: 'shravana', paksha: 'shukla', tithi: 10, slug: 'thiruonam', type: 'regional', category: 'festival', region: 'kerala',
    name: { en: 'Thiruonam (Onam Day)', hi: 'तिरुओणम', sa: 'तिरुओणम्' } },
  { masa: 'kartika', paksha: 'krishna', tithi: 1, slug: 'deepavali-kerala', type: 'regional', category: 'festival', region: 'kerala', family: 'diwali',
    name: { en: 'Deepavali (Kerala)', hi: 'दीपावली (केरल)', sa: 'दीपावलिः' } },
  // Bengal
  { masa: 'magha', paksha: 'shukla', tithi: 1, slug: 'subho-noboborsho-prep', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Magh Puja (Bengali)', hi: 'माघ पूजा', sa: 'माघपूजा' } },
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 8, slug: 'sitala-ashtami', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Sitala Ashtami', hi: 'शीतला अष्टमी', sa: 'शीतलाष्टमी' } },
  // Punjab / North
  { masa: 'phalguna', paksha: 'shukla', tithi: 1, slug: 'basant-start', type: 'regional', category: 'festival', region: 'punjabi',
    name: { en: 'Basant (Spring Festival)', hi: 'बसन्त उत्सव', sa: 'वसन्तोत्सवः' } },
  { masa: 'ashadha', paksha: 'krishna', tithi: 3, slug: 'teej-hariyali-rajasthan', type: 'regional', category: 'festival', region: 'rajasthani',
    name: { en: 'Hariyali Teej (Rajasthan)', hi: 'हरियाली तीज (राजस्थान)', sa: 'हरितालिकातृतीया' } },
  // Maharashtra
  { masa: 'shravana', paksha: 'krishna', tithi: 2, slug: 'pola', type: 'regional', category: 'festival', region: 'marathi',
    name: { en: 'Pola (Bull Festival)', hi: 'पोला', sa: 'पोलोत्सवः' } },
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 2, slug: 'maharashtra-day', type: 'regional', category: 'festival', region: 'marathi',
    name: { en: 'Maharashtra Day', hi: 'महाराष्ट्र दिवस', sa: 'महाराष्ट्रदिवसः' } },
  // Assam
  { masa: 'kartika', paksha: 'krishna', tithi: 13, slug: 'kati-bihu', type: 'regional', category: 'festival', region: 'assamese',
    name: { en: 'Kati Bihu', hi: 'काती बिहू', sa: 'कातीबिहू' } },
  // Karnataka
  { masa: 'chaitra', paksha: 'shukla', tithi: 1, slug: 'yugadi-karnataka', type: 'regional', category: 'festival', region: 'kannada',
    name: { en: 'Yugadi (Karnataka)', hi: 'युगादि (कर्नाटक)', sa: 'युगादिः' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 1, slug: 'bali-padyami', type: 'regional', category: 'festival', region: 'kannada', family: 'diwali',
    name: { en: 'Bali Padyami', hi: 'बलि पाड्यमी', sa: 'बलिपाड्यमी' } },
  // Andhra Pradesh
  { masa: 'shravana', paksha: 'krishna', tithi: 15, slug: 'polala-amavasya', type: 'regional', category: 'amavasya', region: 'telugu',
    name: { en: 'Polala Amavasya', hi: 'पोलाला अमावस्या', sa: 'पोलालाअमावास्या' } },
  // Chhattisgarh / tribal
  { masa: 'pausha', paksha: 'shukla', tithi: 1, slug: 'chherchhera', type: 'regional', category: 'festival', region: 'chhattisgarhi',
    name: { en: 'Cherchera', hi: 'छेरछेरा', sa: 'छेरछेरा' } },
  // Manipur
  { masa: 'chaitra', paksha: 'shukla', tithi: 1, slug: 'sajibu-cheiraoba', type: 'regional', category: 'festival', region: 'manipuri',
    name: { en: 'Sajibu Cheiraoba (Manipuri New Year)', hi: 'साजिबु चैराओबा', sa: 'साजिबुचैराओबा' } },
  // Himachal
  { masa: 'ashwina', paksha: 'shukla', tithi: 10, slug: 'kullu-dussehra', type: 'regional', category: 'festival', region: 'himachali',
    name: { en: 'Kullu Dussehra', hi: 'कुल्लू दशहरा', sa: 'कुल्लूदशहरा' } },
  // Bihar
  { masa: 'kartika', paksha: 'shukla', tithi: 5, slug: 'chhath-arghya', type: 'regional', category: 'festival', region: 'bihari',
    name: { en: 'Chhath Nahay Khay', hi: 'छठ नहाय खाय', sa: 'छठनहायखाय' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 7, slug: 'chhath-usha-arghya', type: 'regional', category: 'festival', region: 'bihari',
    name: { en: 'Chhath Usha Arghya', hi: 'छठ ऊषा अर्घ्य', sa: 'छठऊषार्घ्यम्' } },
  // Mithila (Maithili-speaking Mithilanchal — north Bihar, Tarai of Nepal)
  // Sources: Mithila Panchang (Drik / Vidyaapati / official Maithili Panchang); cross-checked vs
  // Drik Panchang Madhubani/Darbhanga listings 2026. These are tithi-based — engine resolves them
  // for any year. Names use canonical Sanskrit/Maithili spellings.
  { masa: 'ashwina', paksha: 'krishna', tithi: 8, slug: 'jitiya', type: 'regional', category: 'vrat', region: 'maithili',
    name: { en: 'Jitiya (Jivitputrika Vrat)', hi: 'जितिया (जीवित्पुत्रिका व्रत)', sa: 'जीवित्पुत्रिकाव्रतम्', mai: 'जितिया (जीवित्पुत्रिका व्रत)', bn: 'জিতিয়া (জীবিতপুত্রিকা ব্রত)' } },
  { masa: 'shravana', paksha: 'shukla', tithi: 5, slug: 'madhushravani', type: 'regional', category: 'festival', region: 'maithili',
    name: { en: 'Madhushravani', hi: 'मधुश्रावणी', sa: 'मधुश्रावणी', mai: 'मधुश्रावणी' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 7, slug: 'sama-chakeva', type: 'regional', category: 'festival', region: 'maithili',
    name: { en: 'Sama-Chakeva (begins)', hi: 'सामा-चकेवा (आरम्भ)', sa: 'सामाचकेवा', mai: 'सामा-चकेवा (आरम्भ)' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 6, slug: 'chaiti-chhath-sandhya', type: 'regional', category: 'festival', region: 'maithili',
    name: { en: 'Chaiti Chhath (Sandhya Arghya)', hi: 'चैती छठ (सन्ध्या अर्घ्य)', sa: 'चैत्रच्छष्ठीसन्ध्यार्घ्यम्', mai: 'चैती छठि (सन्ध्या अर्घ्य)' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 7, slug: 'chaiti-chhath-usha', type: 'regional', category: 'festival', region: 'maithili',
    name: { en: 'Chaiti Chhath (Usha Arghya)', hi: 'चैती छठ (ऊषा अर्घ्य)', sa: 'चैत्रच्छष्ठ्युषार्घ्यम्', mai: 'चैती छठि (ऊषा अर्घ्य)' } },
  // Chaurchan / Chauth Chandra — Maithil women revere the moon on Bhadrapada
  // Shukla Chaturthi (same tithi as Ganesh Chaturthi, but a distinct Mithila
  // observance with kosi-arghya and dahi-chuda offerings). The rite happens
  // in pradosh kaal (moon worship after sunset), so use the pradosh rule —
  // without it the default sunrise rule lands on Sep 15 2026 while the
  // moon-evening with Chaturthi present is actually Sep 14 (the same day
  // Ganesh Chaturthi falls on via its madhyahna rule).
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 4, slug: 'chaurchan', type: 'regional', category: 'festival', region: 'maithili', muhurtaRule: 'pradosh',
    name: { en: 'Chaurchan (Chauth Chandra)', hi: 'चौरचन (चौथ चन्द्र)', sa: 'चतुर्थचन्द्रः', mai: 'चौरचन (चौथ चन्द्र)' } },
  // Jud-Shital moved to SOLAR_FESTIVALS (solarMonth=1) — see same note for
  // Pana Sankranti above. Solar entries cannot live in MORE_REGIONAL_FESTIVALS.

  // Bengali — additional festivals cross-checked vs Bengali Panjika (Vishuddha Siddhanta)
  // and Drik Panchang Kolkata 2026 listings.
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 6, slug: 'jamai-shashthi', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Jamai Shashthi', hi: 'जामाई षष्ठी', sa: 'जामातृषष्ठी', bn: 'জামাই ষষ্ঠী' } },
  { masa: 'chaitra', paksha: 'shukla', tithi: 8, slug: 'annapurna-puja-basanti', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Annapurna Puja (Basanti)', hi: 'अन्नपूर्णा पूजा (बासन्ती)', sa: 'अन्नपूर्णापूजा', bn: 'অন্নপূর্ণা পূজা (বাসন্তী)' } },
  { masa: 'kartika', paksha: 'shukla', tithi: 9, slug: 'jagaddhatri-puja', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Jagaddhatri Puja', hi: 'जगद्धात्री पूजा', sa: 'जगद्धात्रीपूजा', bn: 'জগদ্ধাত্রী পূজা' } },
  { masa: 'chaitra', paksha: 'krishna', tithi: 14, slug: 'charak-puja', type: 'regional', category: 'festival', region: 'bengali',
    name: { en: 'Charak Puja / Gajan', hi: 'चड़क पूजा / गाजन', sa: 'चड़कपूजा', bn: 'চড়ক পূজা / গাজন' } },

  // Gujarati — additional festivals
  { masa: 'kartika', paksha: 'shukla', tithi: 5, slug: 'labh-pancham', type: 'regional', category: 'festival', region: 'gujarati',
    name: { en: 'Labh Pancham', hi: 'लाभ पंचमी', sa: 'लाभपञ्चमी', gu: 'લાભ પાંચમ' } },
  // Hariyali Amavasya intentionally omitted — the engine's amavasya naming
  // overrides def.name with "{masa} Amavasya" (see festival-generator.ts:854),
  // so the def becomes invisible under its own slug. Plus the 2026 Adhika
  // Jyeshtha makes the Shravana-Krishna-15 attribution ambiguous against
  // Purnimanta-aligned mainstream-reference Gujarati dates. Re-add once the
  // panchang_day_attribution_bug is resolved.

  // Telugu / Telangana — additional festivals
  { masa: 'ashadha', paksha: 'shukla', tithi: 1, slug: 'bonalu', type: 'regional', category: 'festival', region: 'telugu',
    name: { en: 'Bonalu (Telangana)', hi: 'बोनालू (तेलंगाना)', sa: 'बोणालु', te: 'బోనాలు (తెలంగాణ)' } },
  { masa: 'bhadrapada', paksha: 'krishna', tithi: 15, slug: 'bathukamma-start', type: 'regional', category: 'festival', region: 'telugu',
    name: { en: 'Bathukamma (begins)', hi: 'बतुकम्मा (आरम्भ)', sa: 'बतुकम्मा', te: 'బతుకమ్మ (ఆరంభం)' } },
  { masa: 'ashwina', paksha: 'krishna', tithi: 3, slug: 'atla-tadde', type: 'regional', category: 'festival', region: 'telugu',
    name: { en: 'Atla Tadde', hi: 'अटला तद्दे', sa: 'अटलातद्दे', te: 'అట్ల తద్దె' } },

  // Odia — additional festivals
  // Snana Purnima — Lord Jagannath's ceremonial bath (Jyeshtha Purnima)
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 15, slug: 'snana-purnima', type: 'regional', category: 'purnima', region: 'odisha',
    name: { en: 'Snana Purnima (Jagannath Bath)', hi: 'स्नान पूर्णिमा (जगन्नाथ स्नान)', sa: 'स्नानपूर्णिमा' } },
  // Niladri Bije — Jagannath returns to Puri temple after Rath Yatra (Ashadha Shukla 13)
  { masa: 'ashadha', paksha: 'shukla', tithi: 13, slug: 'niladri-bije', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Niladri Bije', hi: 'नीलाद्रि बिजे', sa: 'नीलाद्रिविजयः' } },
  // Suna Besha — Jagannath in golden attire (Ashadha Shukla 11)
  { masa: 'ashadha', paksha: 'shukla', tithi: 11, slug: 'suna-besha', type: 'regional', category: 'festival', region: 'odisha',
    name: { en: 'Suna Besha (Golden Attire)', hi: 'सुना बेश (स्वर्ण वेश)', sa: 'सुवर्णवेषः' } },
  // Raja Parba moved to SOLAR_FESTIVALS (solarMonth=3) — same reason as
  // Pana Sankranti / Jud-Shital above.
  // Misc
  { masa: 'magha', paksha: 'shukla', tithi: 3, slug: 'til-kund-tritiya', type: 'regional', category: 'vrat',
    name: { en: 'Til Kund Tritiya', hi: 'तिल कुण्ड तृतीया', sa: 'तिलकुण्डतृतीया' } },
  { masa: 'vaishakha', paksha: 'krishna', tithi: 3, slug: 'akhanda-dwadashi', type: 'regional', category: 'vrat',
    name: { en: 'Akshaya Tritiya Eve', hi: 'अक्षय तृतीया पूर्व संध्या', sa: 'अक्षयतृतीयापूर्वसन्ध्या' } },
  // Sheetala Ashtami (North India)
  { masa: 'chaitra', paksha: 'krishna', tithi: 8, slug: 'sheetala-ashtami', type: 'regional', category: 'festival',
    name: { en: 'Sheetala Ashtami', hi: 'शीतला अष्टमी', sa: 'शीतलाष्टमी' } },
  // Kamika Ekadashi
  { masa: 'shravana', paksha: 'krishna', tithi: 6, slug: 'lunth-shashthi', type: 'regional', category: 'vrat',
    name: { en: 'Lunth Shashthi', hi: 'लुन्ठ षष्ठी', sa: 'लुण्ठषष्ठी' } },
  // Jhulana Yatra / Swing Festival
  { masa: 'shravana', paksha: 'shukla', tithi: 3, slug: 'jhulana-yatra', type: 'regional', category: 'festival', tradition: 'vaishnava',
    name: { en: 'Jhulana Yatra (Swing Festival)', hi: 'झूलन यात्रा', sa: 'झूलनयात्रा' } },
  // Annabhishekam
  { masa: 'kartika', paksha: 'shukla', tithi: 13, slug: 'annabhishekam', type: 'regional', category: 'festival', region: 'tamil', tradition: 'shaiva',
    name: { en: 'Annabhishekam', hi: 'अन्नाभिषेकम', sa: 'अन्नाभिषेकम्' } },
  // Gokarna Saptami
  { masa: 'bhadrapada', paksha: 'shukla', tithi: 7, slug: 'gokarna-saptami', type: 'regional', category: 'vrat',
    name: { en: 'Gokarna Saptami', hi: 'गोकर्ण सप्तमी', sa: 'गोकर्णसप्तमी' } },
  // Panch Kedar Yatra
  { masa: 'vaishakha', paksha: 'shukla', tithi: 7, slug: 'gangotri-dham-opens', type: 'regional', category: 'festival', region: 'uttarakhandi',
    name: { en: 'Gangotri Dham Opens', hi: 'गंगोत्री धाम खुला', sa: 'गङ्गोत्रीधामोद्घाटनम्' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 8, slug: 'yamunotri-dham-opens', type: 'regional', category: 'festival', region: 'uttarakhandi',
    name: { en: 'Yamunotri Dham Opens', hi: 'यमुनोत्री धाम खुला', sa: 'यमुनोत्रीधामोद्घाटनम्' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 10, slug: 'badrinath-dham-opens', type: 'regional', category: 'festival', region: 'uttarakhandi',
    name: { en: 'Badrinath Dham Opens', hi: 'बद्रीनाथ धाम खुला', sa: 'बद्रीनाथधामोद्घाटनम्' } },
  { masa: 'vaishakha', paksha: 'shukla', tithi: 11, slug: 'kedarnath-dham-opens', type: 'regional', category: 'festival', region: 'uttarakhandi',
    name: { en: 'Kedarnath Dham Opens', hi: 'केदारनाथ धाम खुला', sa: 'केदारनाथधामोद्घाटनम्' } },
  // Vivah Panchami
  { masa: 'margashirsha', paksha: 'shukla', tithi: 5, slug: 'vivah-panchami', type: 'regional', category: 'festival', tradition: 'vaishnava',
    name: { en: 'Vivah Panchami (Sita-Rama Wedding)', hi: 'विवाह पंचमी', sa: 'विवाहपञ्चमी' } },
  // Skanda Shashthi (annual  –  Kartika)
  { masa: 'kartika', paksha: 'shukla', tithi: 6, slug: 'skanda-shashthi-kartik', type: 'regional', category: 'festival', region: 'tamil', tradition: 'shaiva',
    name: { en: 'Skanda Shashthi (Kartik)', hi: 'स्कन्द षष्ठी (कार्तिक)', sa: 'स्कन्दषष्ठी' } },
  // Mandala Puja (48-day Ayyappa season  –  start)
  { masa: 'kartika', paksha: 'shukla', tithi: 1, slug: 'mandala-puja-begins', type: 'regional', category: 'festival', region: 'kerala', tradition: 'shaiva',
    name: { en: 'Mandala Puja Begins (Ayyappa Season)', hi: 'मण्डल पूजा आरम्भ', sa: 'मण्डलपूजारम्भः' } },
  // Arudra Darshan
  { masa: 'margashirsha', paksha: 'shukla', tithi: 13, slug: 'arudra-darshan', type: 'regional', category: 'festival', region: 'tamil', tradition: 'shaiva',
    name: { en: 'Arudra Darshan', hi: 'आर्द्रा दर्शन', sa: 'आर्द्रादर्शनम्' } },
  // Bhairava Ashtami
  { masa: 'margashirsha', paksha: 'krishna', tithi: 8, slug: 'bhairava-ashtami', type: 'vrat', category: 'vrat', tradition: 'shaiva',
    name: { en: 'Bhairava Ashtami (Kalashtami)', hi: 'भैरव अष्टमी (कालाष्टमी)', sa: 'भैरवाष्टमी' } },
];

// ─── Nirjala Ekadashi (standalone  –  Jyeshtha Shukla 11) ───
// This was noted as handled by the Ekadashi loop but we add it separately for
// completeness in the catalog count. The generator should deduplicate by slug.
export const NIRJALA_EKADASHI: FestivalDef[] = [
  { masa: 'jyeshtha', paksha: 'shukla', tithi: 11, slug: 'nirjala-ekadashi', type: 'major', category: 'ekadashi',
    name: { en: 'Nirjala Ekadashi', hi: 'निर्जला एकादशी', sa: 'निर्जलैकादशी' } },
];

// ─── Convenience: All festival definitions combined ───
// Use this when you need the total catalog count or a flat iteration.
export const ALL_FESTIVAL_DEFS: FestivalDef[] = [
  ...MAJOR_FESTIVALS,
  ...EKADASHI_DEFS,
  ...MONTHLY_VRATS,
  ...SOLAR_FESTIVALS,
  ...REGIONAL_FESTIVALS,
  ...PITRU_FESTIVALS,
  ...JAIN_SIKH_FESTIVALS,
  ...ADDITIONAL_VRATS,
  ...JAYANTI_FESTIVALS,
  ...ADDITIONAL_MAJOR_FESTIVALS,
  ...MORE_REGIONAL_FESTIVALS,
  ...NIRJALA_EKADASHI,
];

/**
 * Convert a FestivalDef tithi (1-15 within paksha) to the 1-30 tithi number.
 */
export function defToTithiNumber(def: FestivalDef): number {
  if (!def.paksha || def.paksha === 'shukla') return def.tithi;
  return def.tithi + 15; // Krishna paksha: 16-30
}
