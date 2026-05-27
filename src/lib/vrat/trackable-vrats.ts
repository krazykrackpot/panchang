/**
 * Trackable Vrat Definitions — single source of truth.
 *
 * This file replaces the deprecated `src/lib/constants/vrat-types.ts`
 * (deleted alongside this revision). Both lists carried the same data
 * with mismatched slug conventions — see the project's
 * "NEVER Duplicate Logic or Constants" rule in CLAUDE.md.
 *
 * Each entry's `slug` is the canonical identifier; it's what
 * `user_vrat_preferences.vrat_type` stores. The `calendarSlug` is what
 * the festival generator emits (sometimes different, e.g. our slug
 * `vat-savitri` maps to festival slug `vat-savitri-vrat`).
 *
 * Schema + decision rationale: docs/specs/2026-05-27-vrat-tracker-and-pandit-dashboard.md
 */

import type { LocaleText } from '@/types/panchang';

export type VratFrequency = 'twice-monthly' | 'monthly' | 'weekly' | 'annual';

export type VratCategory =
  | 'ekadashi'        // 11th tithi, twice monthly
  | 'chaturthi'       // 4th tithi
  | 'pradosham'       // 13th tithi (evening Shiva)
  | 'shivaratri'      // monthly Krishna 14th — Shiva night
  | 'shashthi'        // 6th tithi (Murugan)
  | 'lunar'           // purnima / amavasya
  | 'weekday'         // weekly by day-of-week
  | 'festival';       // annual single-day or short series

/**
 * Parana rule families. The runtime resolver (in PR 2) reads this plus
 * the user's tradition to compute the exact parana window for an
 * occurrence.
 *
 * - `sunrise_next_day` — most weekly + festival vrats. Window = sunrise
 *   of the day after the fast → end of vrat tithi.
 * - `sunrise_to_tithi_end` — Smarta Ekadashi. Window = sunrise of
 *   Dwadashi → end of Dwadashi tithi.
 * - `vaishnava_quarter_dwadashi` — Vaishnava Ekadashi. Window = sunrise
 *   of Dwadashi → 1/4 of Dwadashi elapsed (with the documented
 *   sunrise-before-1/4 fallback).
 * - `moonrise` — Sankashti Chaturthi. Window = moonrise (single
 *   reference moment, not a span).
 * - `sunset_same_day` — Pradosham. The vrat is broken in the evening of
 *   the fast day after the Pradosh worship.
 * - `no_parana` — Some short festivals have no formal parana window
 *   (e.g. annapurna jayanti, observance-only events).
 */
export type ParanaRule =
  | 'sunrise_next_day'
  | 'sunrise_to_tithi_end'
  | 'vaishnava_quarter_dwadashi'
  | 'moonrise'
  | 'sunset_same_day'
  | 'no_parana';

export interface TrackableVrat {
  /** Canonical key. Stored in user_vrat_preferences.vrat_type. */
  slug: string;
  name: LocaleText;
  description: LocaleText;
  /** Machine-grouping for cron + UI. */
  frequency: VratFrequency;
  /** Human-readable frequency label, used in the picker UI. */
  frequencyLabel: LocaleText;
  category: VratCategory;
  /** Matches FestivalEntry.slug from festival-generator. May differ from `slug`. */
  calendarSlug: string;
  deity: LocaleText;
  /** For weekly vrats: 0=Sunday, 1=Monday, ..., 6=Saturday. */
  weekday?: number;
  paranaRule: ParanaRule;
  /** True if the actual fast date / parana rule depends on Smarta vs Vaishnava. */
  traditionDependent: boolean;
  /** When non-null, links to /puja/[slug] for the vrat detail page. */
  pujaSlug?: string;
}

const FREQ_TWICE_MONTHLY: LocaleText = { en: 'Twice a month', hi: 'माह में दो बार', sa: 'मासे द्विवारम्' };
const FREQ_MONTHLY: LocaleText       = { en: 'Monthly', hi: 'मासिक', sa: 'मासिकम्' };
const FREQ_WEEKLY: LocaleText        = { en: 'Weekly', hi: 'साप्ताहिक', sa: 'साप्ताहिकम्' };
const FREQ_ANNUAL: LocaleText        = { en: 'Yearly', hi: 'वार्षिक', sa: 'वार्षिकम्' };

export const TRACKABLE_VRATS: TrackableVrat[] = [
  // ─── Tithi-based: Ekadashi ────────────────────────────────────────────
  {
    slug: 'ekadashi',
    name: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
    description: {
      en: 'Twice-monthly fast on the 11th tithi — dedicated to Lord Vishnu',
      hi: 'शुक्ल और कृष्ण पक्ष की एकादशी — भगवान विष्णु को समर्पित',
      sa: 'शुक्लकृष्णपक्षयोः एकादशी — विष्णवे समर्पिता',
    },
    frequency: 'twice-monthly',
    frequencyLabel: FREQ_TWICE_MONTHLY,
    category: 'ekadashi',
    calendarSlug: 'ekadashi',
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु', sa: 'श्रीविष्णुः' },
    paranaRule: 'sunrise_to_tithi_end', // Smarta default; Vaishnava resolved at runtime
    traditionDependent: true,
  },

  // ─── Tithi-based: Chaturthi (Ganesh) ──────────────────────────────────
  {
    slug: 'sankashti-chaturthi',
    name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टचतुर्थी' },
    description: {
      en: 'Monthly fast on Krishna Chaturthi — Ganesh, broken at moonrise',
      hi: 'कृष्ण चतुर्थी को गणेश व्रत — चन्द्रोदय पर पारण',
      sa: 'कृष्णचतुर्थ्यां गणेशव्रतं — चन्द्रोदये पारणम्',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'chaturthi',
    calendarSlug: 'chaturthi',
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'श्रीगणेशः' },
    paranaRule: 'moonrise',
    traditionDependent: false,
  },
  {
    slug: 'vinayaka-chaturthi',
    name: { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', sa: 'विनायकचतुर्थी' },
    description: {
      en: 'Monthly Shukla Chaturthi fast for Lord Ganesha',
      hi: 'शुक्ल चतुर्थी को गणेश व्रत',
      sa: 'शुक्लचतुर्थ्यां गणेशव्रतम्',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'chaturthi',
    calendarSlug: 'vinayaka-chaturthi',
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'श्रीगणेशः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },

  // ─── Tithi-based: Pradosham ───────────────────────────────────────────
  {
    slug: 'pradosham',
    name: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषः' },
    description: {
      en: 'Twice-monthly evening worship of Lord Shiva on Trayodashi',
      hi: 'त्रयोदशी सायं शिव पूजा',
      sa: 'त्रयोदश्यां शिवपूजनम्',
    },
    frequency: 'twice-monthly',
    frequencyLabel: FREQ_TWICE_MONTHLY,
    category: 'pradosham',
    calendarSlug: 'pradosham',
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
    paranaRule: 'sunset_same_day',
    traditionDependent: false,
  },

  // ─── Tithi-based: Shivaratri (monthly) ────────────────────────────────
  {
    slug: 'masik-shivaratri',
    name: { en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि', sa: 'मासिकशिवरात्रिः' },
    description: {
      en: 'Monthly Shivaratri on Krishna Chaturdashi — Shiva night vigil',
      hi: 'कृष्ण चतुर्दशी को शिवरात्रि — रात्रि जागरण',
      sa: 'कृष्णचतुर्दश्यां शिवरात्रिः — रात्रिजागरणम्',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'shivaratri',
    calendarSlug: 'masik-shivaratri',
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },

  // ─── Tithi-based: Lunar (Purnima, Amavasya) ───────────────────────────
  {
    slug: 'purnima',
    name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
    description: {
      en: 'Full moon day fasting and Satyanarayan Puja',
      hi: 'पूर्णिमा व्रत और सत्यनारायण पूजा',
      sa: 'पूर्णिमायां व्रतं सत्यनारायणपूजनं च',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'lunar',
    calendarSlug: 'purnima',
    deity: { en: 'Lord Vishnu (Satyanarayan)', hi: 'भगवान सत्यनारायण', sa: 'श्रीसत्यनारायणः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
    pujaSlug: 'purnima-vrat',
  },
  {
    slug: 'amavasya',
    name: { en: 'Amavasya Tarpan', hi: 'अमावस्या तर्पण', sa: 'अमावस्यातर्पणम्' },
    description: {
      en: 'New moon day for ancestral offerings (Pitru Tarpan)',
      hi: 'अमावस्या को पितृ तर्पण',
      sa: 'अमावस्यायां पितृतर्पणम्',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'lunar',
    calendarSlug: 'amavasya',
    deity: { en: 'Pitru Devatas', hi: 'पितृ देवता', sa: 'पितृदेवताः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },

  // ─── Tithi-based: Shashthi (Murugan) ──────────────────────────────────
  {
    slug: 'skanda-shashthi',
    name: { en: 'Skanda Shashthi', hi: 'स्कन्द षष्ठी', sa: 'स्कन्दषष्ठी' },
    description: {
      en: 'Monthly Shukla Shashthi for Lord Murugan / Kartikeya',
      hi: 'शुक्ल षष्ठी को कार्तिकेय व्रत',
      sa: 'शुक्लषष्ठ्यां कार्तिकेयव्रतम्',
    },
    frequency: 'monthly',
    frequencyLabel: FREQ_MONTHLY,
    category: 'shashthi',
    calendarSlug: 'skanda-shashthi',
    deity: { en: 'Lord Murugan', hi: 'भगवान कार्तिकेय', sa: 'श्रीकार्तिकेयः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },

  // ─── Weekday vrats ────────────────────────────────────────────────────
  {
    slug: 'bhanuvar-vrat',
    name: { en: 'Bhanuvar Vrat (Sunday)', hi: 'भानुवार व्रत', sa: 'भानुवारव्रतम्' },
    description: {
      en: 'Weekly Sunday fast for Surya — health and vitality',
      hi: 'हर रविवार सूर्य व्रत — स्वास्थ्य और ऊर्जा',
      sa: 'प्रतिरविवारे सूर्यव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'bhanuvar-vrat',
    deity: { en: 'Surya Dev', hi: 'सूर्य देव', sa: 'सूर्यदेवः' },
    weekday: 0,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'somvar-vrat',
    name: { en: 'Somvar Vrat (Monday)', hi: 'सोमवार व्रत', sa: 'सोमवारव्रतम्' },
    description: {
      en: 'Weekly Monday fast for Lord Shiva',
      hi: 'हर सोमवार शिव व्रत',
      sa: 'प्रतिसोमवारे शिवव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'somvar-vrat',
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
    weekday: 1,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
    pujaSlug: 'somvar-vrat',
  },
  {
    slug: 'mangalvar-vrat',
    name: { en: 'Mangalvar Vrat (Tuesday)', hi: 'मंगलवार व्रत', sa: 'मङ्गलवारव्रतम्' },
    description: {
      en: 'Weekly Tuesday fast for Lord Hanuman',
      hi: 'हर मंगलवार हनुमान व्रत',
      sa: 'प्रतिमङ्गलवारे हनुमद्व्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'mangalvar-vrat',
    deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान', sa: 'श्रीहनुमान्' },
    weekday: 2,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
    pujaSlug: 'mangalvar-vrat',
  },
  {
    slug: 'budhavar-vrat',
    name: { en: 'Budhavar Vrat (Wednesday)', hi: 'बुधवार व्रत', sa: 'बुधवारव्रतम्' },
    description: {
      en: 'Weekly Wednesday fast for Budh / Vishnu — intellect and learning',
      hi: 'हर बुधवार बुध व्रत — बुद्धि और विद्या',
      sa: 'प्रतिबुधवारे बुधव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'budhavar-vrat',
    deity: { en: 'Budh / Lord Vishnu', hi: 'बुध / भगवान विष्णु', sa: 'बुधः / श्रीविष्णुः' },
    weekday: 3,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'guruvar-vrat',
    name: { en: 'Guruvar Vrat (Thursday)', hi: 'गुरुवार व्रत', sa: 'गुरुवारव्रतम्' },
    description: {
      en: 'Weekly Thursday fast for Brihaspati / Vishnu',
      hi: 'हर गुरुवार बृहस्पति व्रत',
      sa: 'प्रतिगुरुवारे बृहस्पतिव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'guruvar-vrat',
    deity: { en: 'Lord Vishnu / Brihaspati', hi: 'भगवान विष्णु / बृहस्पति', sa: 'श्रीविष्णुः / बृहस्पतिः' },
    weekday: 4,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'shukravar-vrat',
    name: { en: 'Shukravar Vrat (Friday)', hi: 'शुक्रवार व्रत', sa: 'शुक्रवारव्रतम्' },
    description: {
      en: 'Weekly Friday fast for Lakshmi / Santoshi Maa',
      hi: 'हर शुक्रवार लक्ष्मी / सन्तोषी माँ व्रत',
      sa: 'प्रतिशुक्रवारे लक्ष्मीव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'shukravar-vrat',
    deity: { en: 'Mahalakshmi / Santoshi Maa', hi: 'महालक्ष्मी / सन्तोषी माँ', sa: 'श्रीमहालक्ष्मीः' },
    weekday: 5,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'shanivar-vrat',
    name: { en: 'Shanivar Vrat (Saturday)', hi: 'शनिवार व्रत', sa: 'शनिवारव्रतम्' },
    description: {
      en: 'Weekly Saturday fast for Shani Dev',
      hi: 'हर शनिवार शनि व्रत',
      sa: 'प्रतिशनिवारे शनिव्रतम्',
    },
    frequency: 'weekly',
    frequencyLabel: FREQ_WEEKLY,
    category: 'weekday',
    calendarSlug: 'shanivar-vrat',
    deity: { en: 'Shani Dev', hi: 'शनि देव', sa: 'शनिदेवः' },
    weekday: 6,
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },

  // ─── Annual festival vrats ────────────────────────────────────────────
  {
    slug: 'maha-shivaratri',
    name: { en: 'Maha Shivaratri', hi: 'महा शिवरात्रि', sa: 'महाशिवरात्रिः' },
    description: {
      en: 'The great night of Shiva — annual fast in Phalguna Krishna Chaturdashi',
      hi: 'फाल्गुन कृष्ण चतुर्दशी — शिव की महान रात्रि',
      sa: 'फाल्गुनकृष्णचतुर्दश्यां महाशिवरात्रिः',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'maha-shivaratri',
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'ram-navami',
    name: { en: 'Ram Navami', hi: 'राम नवमी', sa: 'रामनवमी' },
    description: {
      en: 'Birth of Lord Rama — Chaitra Shukla Navami',
      hi: 'भगवान राम का प्राकट्योत्सव — चैत्र शुक्ल नवमी',
      sa: 'चैत्रशुक्लनवम्यां रामजन्मोत्सवः',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'ram-navami',
    deity: { en: 'Lord Rama', hi: 'भगवान राम', sa: 'श्रीरामः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'janmashtami',
    name: { en: 'Krishna Janmashtami', hi: 'कृष्ण जन्माष्टमी', sa: 'कृष्णजन्माष्टमी' },
    description: {
      en: 'Birth of Lord Krishna — Bhadrapada Krishna Ashtami',
      hi: 'भगवान कृष्ण का प्राकट्योत्सव — भाद्रपद कृष्ण अष्टमी',
      sa: 'भाद्रपदकृष्णाष्टम्यां कृष्णजन्माष्टमी',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'janmashtami',
    deity: { en: 'Lord Krishna', hi: 'भगवान कृष्ण', sa: 'श्रीकृष्णः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: true,
  },
  {
    slug: 'hanuman-jayanti',
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', sa: 'हनुमज्जयन्ती' },
    description: {
      en: 'Birth of Lord Hanuman — Chaitra Purnima',
      hi: 'हनुमान जी का प्राकट्योत्सव — चैत्र पूर्णिमा',
      sa: 'चैत्रपूर्णिमायां हनुमज्जन्मोत्सवः',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'hanuman-jayanti',
    deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान', sa: 'श्रीहनुमान्' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'akshaya-tritiya',
    name: { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया', sa: 'अक्षयतृतीया' },
    description: {
      en: 'All-day auspicious muhurta — Vaishakha Shukla Tritiya',
      hi: 'वैशाख शुक्ल तृतीया — अक्षय फलदायक मुहूर्त',
      sa: 'वैशाखशुक्लतृतीयायां अक्षयफलदायी मुहूर्तः',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'akshaya-tritiya',
    deity: { en: 'Vishnu / Lakshmi', hi: 'विष्णु / लक्ष्मी', sa: 'विष्णुलक्ष्म्यौ' },
    paranaRule: 'no_parana',
    traditionDependent: false,
  },
  {
    slug: 'karwa-chauth',
    name: { en: 'Karwa Chauth', hi: 'करवा चौथ', sa: 'करकचतुर्थी' },
    description: {
      en: 'Wife\'s fast for husband\'s long life — Kartika Krishna Chaturthi',
      hi: 'पति की दीर्घायु के लिए सुहागिन व्रत',
      sa: 'पत्युर्दीर्घायुर्थं स्त्रीणां व्रतम्',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'karwa-chauth',
    deity: { en: 'Shiva–Parvati', hi: 'शिव-पार्वती', sa: 'शिवपार्वत्यौ' },
    paranaRule: 'moonrise',
    traditionDependent: false,
  },
  {
    slug: 'hartalika-teej',
    name: { en: 'Hartalika Teej', hi: 'हरतालिका तीज', sa: 'हरितालिकातृतीया' },
    description: {
      en: 'Women\'s fast for spousal welfare — Bhadrapada Shukla Tritiya',
      hi: 'शिव-पार्वती मिलन व्रत — भाद्रपद शुक्ल तृतीया',
      sa: 'भाद्रपदशुक्लतृतीयायां हरितालिकाव्रतम्',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'hartalika-teej',
    deity: { en: 'Shiva–Parvati', hi: 'शिव-पार्वती', sa: 'शिवपार्वत्यौ' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'vat-savitri',
    name: { en: 'Vat Savitri Vrat', hi: 'वट सावित्री व्रत', sa: 'वटसावित्रीव्रतम्' },
    description: {
      en: 'Wife\'s fast invoking Savitri — Jyeshtha Amavasya / Purnima',
      hi: 'सावित्री के नाम पर सुहागिन व्रत',
      sa: 'सावित्रीनाम्ना स्त्रीणां व्रतम्',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'vat-savitri-vrat',
    deity: { en: 'Savitri / Yamaraja', hi: 'सावित्री / यमराज', sa: 'सावित्री यमश्च' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'chaitra-navratri',
    name: { en: 'Chaitra Navratri', hi: 'चैत्र नवरात्रि', sa: 'चैत्रनवरात्रम्' },
    description: {
      en: '9-day spring Navratri — Chaitra Shukla 1 to Navami',
      hi: 'वसन्त ऋतु की नवरात्रि — चैत्र शुक्ल प्रतिपदा से नवमी',
      sa: 'चैत्रशुक्लप्रतिपदातः नवम्यन्तं नवरात्रम्',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'chaitra-navratri',
    deity: { en: 'Goddess Durga', hi: 'माँ दुर्गा', sa: 'श्रीदुर्गादेवी' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
    pujaSlug: 'chaitra-navratri',
  },
  {
    slug: 'sharad-navratri',
    name: { en: 'Sharad Navratri', hi: 'शरद नवरात्रि', sa: 'शारदनवरात्रम्' },
    description: {
      en: '9-day autumn Navratri — Ashwina Shukla 1 to Navami',
      hi: 'शरद ऋतु की नवरात्रि — आश्विन शुक्ल प्रतिपदा से नवमी',
      sa: 'आश्विनशुक्लप्रतिपदातः नवम्यन्तं नवरात्रम्',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    // The festival generator emits day-1 as `navratri-ghatasthapana`.
    // We hook the subscription to that — UI can also surface the day-2
    // through day-9 entries linked to the same vrat.
    calendarSlug: 'navratri-ghatasthapana',
    deity: { en: 'Goddess Durga', hi: 'माँ दुर्गा', sa: 'श्रीदुर्गादेवी' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
  {
    slug: 'guru-purnima',
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', sa: 'गुरुपूर्णिमा' },
    description: {
      en: 'Honouring the Guru — Ashadha Purnima (Vyasa Puja)',
      hi: 'गुरु को प्रणाम — आषाढ़ पूर्णिमा (व्यास पूजा)',
      sa: 'आषाढपूर्णिमायां गुरुपूजनम् व्यासपूजनं च',
    },
    frequency: 'annual',
    frequencyLabel: FREQ_ANNUAL,
    category: 'festival',
    calendarSlug: 'guru-purnima',
    deity: { en: 'The Guru', hi: 'गुरुदेव', sa: 'श्रीगुरुः' },
    paranaRule: 'sunrise_next_day',
    traditionDependent: false,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────

/**
 * Get the next occurrences of a weekly weekday. Pure date arithmetic;
 * the calendar generator isn't consulted for weekly vrats.
 *
 * Returns dates for the next `count` occurrences of `dayOfWeek`, where
 * dayOfWeek follows Date.getDay() (0=Sunday, 6=Saturday).
 */
export function getNextWeeklyDates(dayOfWeek: number, count: number = 4): string[] {
  const dates: string[] = [];
  const current = new Date();
  const diff = (dayOfWeek - current.getDay() + 7) % 7;
  current.setDate(current.getDate() + (diff === 0 ? 0 : diff));
  for (let i = 0; i < count; i++) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

/** Look up a TrackableVrat by its slug. */
export function getTrackableVrat(slug: string): TrackableVrat | undefined {
  return TRACKABLE_VRATS.find(v => v.slug === slug);
}

/**
 * For a weekly vrat slug, return the day-of-week (0=Sun..6=Sat).
 * Returns null for any non-weekly vrat or unknown slug.
 */
export function getWeeklyVratDay(slug: string): number | null {
  const v = getTrackableVrat(slug);
  return v?.category === 'weekday' && typeof v.weekday === 'number' ? v.weekday : null;
}
