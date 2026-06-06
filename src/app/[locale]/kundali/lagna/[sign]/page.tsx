/**
 * /[locale]/kundali/lagna/[sign] — ascendant landing pages (SEO step 3 PR-1).
 *
 * 12 long-form content pages targeting "{sign} ascendant", "{sign} lagna",
 * "{sign} rising sign" queries. EN only in this PR; PR-2 adds HI. Other
 * locales render a 404 — the route is a no-op for them until translations
 * land (no degraded-EN rendering on non-EN locales to avoid hreflang
 * confusion).
 *
 * Content sources (NO duplication — single source of truth per Lesson Q):
 *   - `LAGNA_DEEP` (src/lib/kundali/tippanni-lagna.ts) — 6 sections/lagna
 *     × 1500 chars/section × EN/HI/SA. Currently unused for SEO.
 *   - `RASHIS` (src/lib/constants/rashis.ts) — sign id, slug, ruler.
 *   - `EXALTATION_SIGNS` / `DEBILITATION_SIGNS` / `SIGN_LORDS`
 *     (src/lib/constants/dignities.ts) — canonical BPHS tables.
 *
 * Routing note: `/kundali` has both `/kundali/[id]` (saved-chart view)
 * and now `/kundali/lagna/[sign]`. These are at different path depths,
 * so no conflict. The new sub-tree only handles `/kundali/lagna/*`.
 *
 * Spec: docs/specs/2026-05-27-seo-panchang-kundali-content.md §2.3
 */
import { setRequestLocale } from 'next-intl/server';
import { RASHIS } from '@/lib/constants/rashis';
import { LAGNA_DEEP_WITH_OVERLAY as LAGNA_DEEP } from '@/lib/kundali/lagna-deep-with-overlay';
import {
  EXALTATION_SIGNS,
  DEBILITATION_SIGNS,
  SIGN_LORDS,
} from '@/lib/constants/dignities';
import { FEATURED_YOGAS, INDEXABLE_LAGNA_LOCALES } from '@/lib/seo/lagna-seo';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;

// Strip trailing slash if env var has one (Gemini #243 re-review MED) —
// without this, `${BASE_URL}/${locale}/...` becomes `https://.../` + `/en/...`
// → double slash in canonical and hreflang URLs.
import { BASE_URL } from '@/lib/seo/base-url';

/**
 * Locale-aware LocaleText reader. Picks `obj[locale]` when present, falls
 * back HI → EN → '' so under-translated locales degrade gracefully.
 * Empty string degrades into the surrounding template — defensive against
 * a future refactor that allows missing entries (Gemini PR #481 round-2
 * MED + round-3 MED — single source instead of 4 inline copies in the
 * page's helpers).
 *
 * `locale === 'en'` short-circuits to a pure `.en` read — no HI fallback.
 * This matches what the page used to do for English readers and prevents
 * an EN visitor from seeing Hindi if `.en` happens to be missing (Gemini
 * PR #481 round-5 MED — previously the docstring claimed this behaviour
 * but the code fell through to the generic chain).
 */
function getLocalizedText(
  obj: Record<string, string | undefined> | undefined | null,
  locale: string,
): string {
  if (!obj) return '';
  if (locale === 'en') return obj.en ?? '';
  return obj[locale] ?? obj.hi ?? obj.en ?? '';
}

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
// Localised planet names indexed by RASHIS.rulerName per planet's natural
// home sign. Built lazily in `buildPlanetDignitiesForLagna` from RASHIS
// so adding a locale to RASHIS automatically propagates here without a
// hardcoded duplicate list per locale (Gemini PR #481 MED). The home
// signs hard-mapped here are stable BPHS canon (Sun→Leo, Moon→Cancer,
// Mars→Aries, Mercury→Gemini, Jupiter→Sagittarius, Venus→Taurus,
// Saturn→Capricorn) — see SIGN_LORDS for the inverse mapping.
const PLANET_HOME_SIGN_ID: readonly number[] = [5, 4, 1, 3, 9, 2, 10];

/**
 * Per-locale body chrome. Section headings, breadcrumb labels, CTA copy.
 * The 6 content paragraphs themselves come from LAGNA_DEEP (en/hi) —
 * this map only covers the page furniture so HI users see a fully
 * translated experience.
 */
const LABELS = {
  en: {
    breadcrumb_kundali: 'Kundali',
    breadcrumb_lagna: 'Lagna',
    breadcrumb_suffix: 'Ascendant',
    chip_ruled_by: 'Ruled by',
    sections: {
      personality: 'Personality',
      career: 'Career',
      health: 'Health',
      relationships: 'Relationships & Marriage',
      finances: 'Finances',
      spiritual: 'Spiritual Path',
    },
    dignities_heading: 'Exalted & Debilitated Planets',
    dignities_intro:
      'Each planet has a sign in which it gives best results (exaltation) and one in which it struggles (debilitation). In your chart, those positions translate to specific houses based on the lagna.',
    exalted: 'Exalted',
    debilitated: 'Debilitated',
    lord_heading: 'Your Ascendant Lord',
    cta_heading: 'See This Lagna in Your Own Chart',
    cta_button: 'Generate My Kundali →',
    all_twelve: 'All Twelve Ascendants',
    related_kundali: 'Generate Kundali',
    related_matching: 'Kundali Matching',
    related_horoscope: 'Daily Horoscope',
    related_learn: 'How to Read a Kundali',
  },
  hi: {
    breadcrumb_kundali: 'कुण्डली',
    breadcrumb_lagna: 'लग्न',
    breadcrumb_suffix: 'लग्न',
    chip_ruled_by: 'स्वामी',
    sections: {
      personality: 'व्यक्तित्व',
      career: 'करियर',
      health: 'स्वास्थ्य',
      relationships: 'सम्बन्ध और विवाह',
      finances: 'धन',
      spiritual: 'आध्यात्मिक मार्ग',
    },
    dignities_heading: 'उच्च व नीच ग्रह',
    dignities_intro:
      'प्रत्येक ग्रह की एक उच्च राशि (जहाँ वह सर्वोत्तम फल देता है) और एक नीच राशि (जहाँ वह दुर्बल होता है) होती है। आपकी कुण्डली में लग्न के अनुसार ये भावों में बदलते हैं।',
    exalted: 'उच्च',
    debilitated: 'नीच',
    lord_heading: 'आपका लग्नेश',
    cta_heading: 'इस लग्न को अपनी कुण्डली में देखें',
    cta_button: 'मेरी कुण्डली बनाएँ →',
    all_twelve: 'सभी बारह लग्न',
    related_kundali: 'कुण्डली बनाएँ',
    related_matching: 'कुण्डली मिलान',
    related_horoscope: 'दैनिक राशिफल',
    related_learn: 'कुण्डली कैसे पढ़ें',
  },
  mai: {
    breadcrumb_kundali: 'कुण्डली',
    breadcrumb_lagna: 'लग्न',
    breadcrumb_suffix: 'लग्न',
    chip_ruled_by: 'स्वामी',
    sections: {
      personality: 'व्यक्तित्व',
      career: 'कैरियर',
      health: 'स्वास्थ्य',
      relationships: 'सम्बन्ध आ विवाह',
      finances: 'धन',
      spiritual: 'आध्यात्मिक मार्ग',
    },
    dignities_heading: 'उच्च आ नीच ग्रह',
    dignities_intro:
      'प्रत्येक ग्रहक एकटा उच्च राशि (जतय ओ सर्वोत्तम फल दैत अछि) आ एकटा नीच राशि (जतय ओ दुर्बल होइत अछि) होइत अछि। अहाँक कुण्डलीमे लग्नक अनुसार ई भाव बदलैत अछि।',
    exalted: 'उच्च',
    debilitated: 'नीच',
    lord_heading: 'अहाँक लग्नेश',
    cta_heading: 'अहि लग्नकेँ अपन कुण्डलीमे देखू',
    cta_button: 'हमर कुण्डली बनाउ →',
    all_twelve: 'सब बारह लग्न',
    related_kundali: 'कुण्डली बनाउ',
    related_matching: 'कुण्डली मिलान',
    related_horoscope: 'दैनिक राशिफल',
    related_learn: 'कुण्डली कोना पढ़ी',
  },
  mr: {
    breadcrumb_kundali: 'कुंडली',
    breadcrumb_lagna: 'लग्न',
    breadcrumb_suffix: 'लग्न',
    chip_ruled_by: 'स्वामी',
    sections: {
      personality: 'व्यक्तिमत्व',
      career: 'कारकीर्द',
      health: 'आरोग्य',
      relationships: 'नाती आणि विवाह',
      finances: 'अर्थकारण',
      spiritual: 'आध्यात्मिक मार्ग',
    },
    dignities_heading: 'उच्च आणि नीच ग्रह',
    dignities_intro:
      'प्रत्येक ग्रहाची एक उच्च राशी (जिथे तो सर्वोत्तम फळ देतो) आणि एक नीच राशी (जिथे तो दुर्बल होतो) असते. तुमच्या कुंडलीत लग्नानुसार हे भाव बदलतात.',
    exalted: 'उच्च',
    debilitated: 'नीच',
    lord_heading: 'तुमचा लग्नेश',
    cta_heading: 'हे लग्न तुमच्या कुंडलीत पहा',
    cta_button: 'माझी कुंडली बनवा →',
    all_twelve: 'सर्व बारा लग्न',
    related_kundali: 'कुंडली बनवा',
    related_matching: 'कुंडली मिलान',
    related_horoscope: 'दैनिक राशीभविष्य',
    related_learn: 'कुंडली कशी वाचावी',
  },
  ta: {
    breadcrumb_kundali: 'ஜாதகம்',
    breadcrumb_lagna: 'லக்னம்',
    breadcrumb_suffix: 'லக்னம்',
    chip_ruled_by: 'அதிபதி',
    sections: {
      personality: 'ஆளுமை',
      career: 'தொழில்',
      health: 'ஆரோக்கியம்',
      relationships: 'உறவுகள் மற்றும் திருமணம்',
      finances: 'பொருளாதாரம்',
      spiritual: 'ஆன்மிக பாதை',
    },
    dignities_heading: 'உச்ச மற்றும் நீச கிரகங்கள்',
    dignities_intro:
      'ஒவ்வொரு கிரகத்துக்கும் சிறந்த பலன்களைத் தரும் ராசி (உச்சம்) மற்றும் சிரமப்படும் ராசி (நீசம்) உண்டு. உங்கள் ஜாதகத்தில், லக்னத்தைப் பொறுத்து இவை குறிப்பிட்ட பாவங்களாக மாறுகின்றன.',
    exalted: 'உச்சம்',
    debilitated: 'நீசம்',
    lord_heading: 'உங்கள் லக்னாதிபதி',
    cta_heading: 'இந்த லக்னத்தை உங்கள் சொந்த ஜாதகத்தில் காண்க',
    cta_button: 'என் ஜாதகத்தை உருவாக்கு →',
    all_twelve: 'பன்னிரண்டு லக்னங்களும்',
    related_kundali: 'ஜாதகம் உருவாக்கு',
    related_matching: 'திருமண பொருத்தம்',
    related_horoscope: 'தினசரி ராசி பலன்',
    related_learn: 'ஜாதகம் படிப்பது எப்படி',
  },
  te: {
    breadcrumb_kundali: 'జాతకం',
    breadcrumb_lagna: 'లగ్నం',
    breadcrumb_suffix: 'లగ్నం',
    chip_ruled_by: 'అధిపతి',
    sections: {
      personality: 'వ్యక్తిత్వం',
      career: 'వృత్తి',
      health: 'ఆరోగ్యం',
      relationships: 'సంబంధాలు మరియు వివాహం',
      finances: 'ఆర్థికం',
      spiritual: 'ఆధ్యాత్మిక మార్గం',
    },
    dignities_heading: 'ఉచ్చ మరియు నీచ గ్రహాలు',
    dignities_intro:
      'ప్రతి గ్రహానికి ఉత్తమ ఫలితాలు ఇచ్చే రాశి (ఉచ్చం) మరియు బలహీనపడే రాశి (నీచం) ఉంటాయి. మీ జాతకంలో, లగ్నం ఆధారంగా ఇవి నిర్దిష్ట భావాలుగా మారతాయి.',
    exalted: 'ఉచ్చం',
    debilitated: 'నీచం',
    lord_heading: 'మీ లగ్నాధిపతి',
    cta_heading: 'మీ స్వంత జాతకంలో ఈ లగ్నాన్ని చూడండి',
    cta_button: 'నా జాతకాన్ని రూపొందించు →',
    all_twelve: 'పన్నెండు లగ్నాలు',
    related_kundali: 'జాతకం రూపొందించు',
    related_matching: 'వివాహ పొంతన',
    related_horoscope: 'రోజువారీ రాశి ఫలాలు',
    related_learn: 'జాతకాన్ని ఎలా చదవాలి',
  },
  kn: {
    breadcrumb_kundali: 'ಜಾತಕ',
    breadcrumb_lagna: 'ಲಗ್ನ',
    breadcrumb_suffix: 'ಲಗ್ನ',
    chip_ruled_by: 'ಅಧಿಪತಿ',
    sections: {
      personality: 'ವ್ಯಕ್ತಿತ್ವ',
      career: 'ವೃತ್ತಿ',
      health: 'ಆರೋಗ್ಯ',
      relationships: 'ಸಂಬಂಧಗಳು ಮತ್ತು ವಿವಾಹ',
      finances: 'ಆರ್ಥಿಕ',
      spiritual: 'ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗ',
    },
    dignities_heading: 'ಉಚ್ಚ ಮತ್ತು ನೀಚ ಗ್ರಹಗಳು',
    dignities_intro:
      'ಪ್ರತಿ ಗ್ರಹಕ್ಕೂ ಶ್ರೇಷ್ಠ ಫಲಿತಾಂಶಗಳನ್ನು ನೀಡುವ ರಾಶಿ (ಉಚ್ಚ) ಮತ್ತು ದುರ್ಬಲವಾಗುವ ರಾಶಿ (ನೀಚ) ಇರುತ್ತದೆ. ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ, ಲಗ್ನವನ್ನು ಆಧರಿಸಿ ಇವು ನಿರ್ದಿಷ್ಟ ಭಾವಗಳಾಗಿ ಬದಲಾಗುತ್ತವೆ.',
    exalted: 'ಉಚ್ಚ',
    debilitated: 'ನೀಚ',
    lord_heading: 'ನಿಮ್ಮ ಲಗ್ನಾಧಿಪತಿ',
    cta_heading: 'ಈ ಲಗ್ನವನ್ನು ನಿಮ್ಮ ಸ್ವಂತ ಜಾತಕದಲ್ಲಿ ನೋಡಿ',
    cta_button: 'ನನ್ನ ಜಾತಕ ರಚಿಸಿ →',
    all_twelve: 'ಹನ್ನೆರಡು ಲಗ್ನಗಳು',
    related_kundali: 'ಜಾತಕ ರಚಿಸಿ',
    related_matching: 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ',
    related_horoscope: 'ದೈನಂದಿನ ರಾಶಿ ಫಲ',
    related_learn: 'ಜಾತಕವನ್ನು ಹೇಗೆ ಓದುವುದು',
  },
  gu: {
    breadcrumb_kundali: 'કુંડળી',
    breadcrumb_lagna: 'લગ્ન',
    breadcrumb_suffix: 'લગ્ન',
    chip_ruled_by: 'સ્વામી',
    sections: {
      personality: 'વ્યક્તિત્વ',
      career: 'કારકિર્દી',
      health: 'આરોગ્ય',
      relationships: 'સંબંધો અને લગ્ન',
      finances: 'નાણાં',
      spiritual: 'આધ્યાત્મિક માર્ગ',
    },
    dignities_heading: 'ઉચ્ચ અને નીચ ગ્રહો',
    dignities_intro:
      'દરેક ગ્રહને શ્રેષ્ઠ ફળ આપતી રાશિ (ઉચ્ચ) અને નબળી પડતી રાશિ (નીચ) હોય છે. તમારી કુંડળીમાં, લગ્ન અનુસાર આ ચોક્કસ ભાવોમાં બદલાય છે.',
    exalted: 'ઉચ્ચ',
    debilitated: 'નીચ',
    lord_heading: 'તમારો લગ્નેશ',
    cta_heading: 'આ લગ્નને તમારી પોતાની કુંડળીમાં જુઓ',
    cta_button: 'મારી કુંડળી બનાવો →',
    all_twelve: 'બાર લગ્નો',
    related_kundali: 'કુંડળી બનાવો',
    related_matching: 'કુંડળી મેળાપક',
    related_horoscope: 'દૈનિક રાશિફળ',
    related_learn: 'કુંડળી કેવી રીતે વાંચવી',
  },
  bn: {
    breadcrumb_kundali: 'কুণ্ডলী',
    breadcrumb_lagna: 'লগ্ন',
    breadcrumb_suffix: 'লগ্ন',
    chip_ruled_by: 'অধিপতি',
    sections: {
      personality: 'ব্যক্তিত্ব',
      career: 'কর্মজীবন',
      health: 'স্বাস্থ্য',
      relationships: 'সম্পর্ক ও বিবাহ',
      finances: 'আর্থিক',
      spiritual: 'আধ্যাত্মিক পথ',
    },
    dignities_heading: 'উচ্চ ও নীচ গ্রহ',
    dignities_intro:
      'প্রতিটি গ্রহের একটি উচ্চ রাশি (যেখানে এটি সর্বোত্তম ফল দেয়) এবং একটি নীচ রাশি (যেখানে এটি দুর্বল হয়) আছে। আপনার কুণ্ডলীতে, লগ্ন অনুযায়ী এগুলি নির্দিষ্ট ভাবে রূপান্তরিত হয়।',
    exalted: 'উচ্চ',
    debilitated: 'নীচ',
    lord_heading: 'আপনার লগ্নেশ',
    cta_heading: 'এই লগ্নটি আপনার নিজের কুণ্ডলীতে দেখুন',
    cta_button: 'আমার কুণ্ডলী তৈরি করুন →',
    all_twelve: 'বারোটি লগ্ন',
    related_kundali: 'কুণ্ডলী তৈরি করুন',
    related_matching: 'কুণ্ডলী মিলন',
    related_horoscope: 'দৈনিক রাশিফল',
    related_learn: 'কুণ্ডলী কীভাবে পড়বেন',
  },
} as const;

/**
 * EN URL slug → rashi id (1-12). Maintained here because the canonical
 * RASHIS table uses Sanskrit slugs; EN slugs are an SEO-only concern
 * for this route.
 */
const SIGN_SLUG_TO_ID: Record<string, number> = {
  aries: 1, taurus: 2, gemini: 3, cancer: 4, leo: 5, virgo: 6,
  libra: 7, scorpio: 8, sagittarius: 9, capricorn: 10, aquarius: 11, pisces: 12,
};

const SIGN_SLUGS = Object.keys(SIGN_SLUG_TO_ID);

// ──────────────────────────────────────────────────────────────
// Static params: 12 lagna pages × indexable locales (EN + HI in PR-2)
//
// 24 entries — small bounded set, well under the 9k budget. Other
// locales fall through to ISR and render with `noindex` (set in
// generateMetadata). INDEXABLE_LAGNA_LOCALES is shared with sitemap.ts
// so adding a locale here propagates everywhere (Lesson Q, Gemini #245).
// ──────────────────────────────────────────────────────────────

export function generateStaticParams(): Array<{ locale: string; sign: string }> {
  return INDEXABLE_LAGNA_LOCALES.flatMap(locale =>
    SIGN_SLUGS.map(sign => ({ locale, sign })),
  );
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; sign: string }> }): Promise<Metadata> {
  const { locale, sign } = await params;
  setRequestLocale(locale);

  // Case-insensitive slug lookup (Gemini #243): users / external links
  // hitting /kundali/lagna/Leo or /Aries should still resolve.
  // Gemini #243 re-review HIGH: normalise to lowercase once and use it
  // for canonical + hreflang + every URL output below, so all roads
  // funnel into the single canonical lowercase path.
  const normalizedSign = sign.toLowerCase();
  const id = SIGN_SLUG_TO_ID[normalizedSign];
  if (!id) return { title: 'Kundali — Dekho Panchang' };
  const rashi = RASHIS.find(r => r.id === id);
  if (!rashi) return { title: 'Kundali — Dekho Panchang' };

  const en = rashi.name.en;
  const hi = rashi.name.hi ?? en;
  // Locale-aware reader for RASHIS LocaleText fields — picks the locale-
  // specific translation when present, else falls back HI → EN. Used in
  // the per-locale `descX` builders below so Maithili rashi/ruler/element
  // names come from RASHIS.mai (which is fully populated) rather than
  // silently from RASHIS.hi. Gemini PR #481 HIGH.
  // Locale-aware RASHIS reader — delegates to the file-scope helper
  // (Gemini PR #481 round-3 MED — single source instead of inline copies).
  const localized = (obj: Record<string, string | undefined> | undefined | null): string =>
    getLocalizedText(obj, locale);
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what an EN reader searches when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);

  // Indexability now sourced from the central per-route policy in
  // src/lib/seo/indexable-locales.ts. Was previously reading the local
  // INDEXABLE_LAGNA_LOCALES constant directly — same set today, but
  // the policy lives in one place so the option A translation pipeline
  // can flip it via PER_ROUTE_INDEXABLE without editing this file.
  // Spec 2026-06-04-noindex-thin-translation-locales.md Phase 5.
  const route = `/kundali/lagna/${normalizedSign}`;
  const isIndexable = isLocaleIndexable(route, locale);

  // Each indexable locale gets its own canonical pointing at its own
  // lowercase URL. Non-indexable locales render the same content but
  // their canonical → the default-locale URL.
  const canonicalUrl = buildCanonicalUrl(route, locale);

  // Per-locale title + description.
  const isHi = locale === 'hi';
  const isMai = locale === 'mai';
  const isMr = locale === 'mr';
  // Locale-specific rashi name + ruler + element pulled from RASHIS via
  // the locale-aware helper. For Maithili these are now RASHIS.*.mai
  // values rather than silent Hindi fallbacks (Gemini PR #481 HIGH).
  const localName = localized(rashi.name as Record<string, string | undefined>);
  const localRuler = localized(rashi.rulerName as Record<string, string | undefined>);
  const localElement = localized(rashi.element as Record<string, string | undefined>);
  const isTa = locale === 'ta';
  const isTe = locale === 'te';
  const isKn = locale === 'kn';
  const isGu = locale === 'gu';
  const isBn = locale === 'bn';
  const titleEn = `${en} Ascendant (${sanskrit} Lagna) — Personality, Career, Marriage`;
  const titleHi = `${hi} लग्न (${sanskrit} Lagna) — व्यक्तित्व, करियर, विवाह`;
  const titleMai = `${localName} लग्न (${sanskrit} Lagna) — व्यक्तित्व, कैरियर, विवाह`;
  const titleMr = `${localName} लग्न (${sanskrit} Lagna) — व्यक्तिमत्व, कारकीर्द, विवाह`;
  const titleTa = `${localName} லக்னம் (${sanskrit} Lagna) — ஆளுமை, தொழில், திருமணம்`;
  const titleTe = `${localName} లగ్నం (${sanskrit} Lagna) — వ్యక్తిత్వం, వృత్తి, వివాహం`;
  const titleKn = `${localName} ಲಗ್ನ (${sanskrit} Lagna) — ವ್ಯಕ್ತಿತ್ವ, ವೃತ್ತಿ, ವಿವಾಹ`;
  const titleGu = `${localName} લગ્ન (${sanskrit} Lagna) — વ્યક્તિત્વ, કારકિર્દી, લગ્ન`;
  const titleBn = `${localName} লগ্ন (${sanskrit} Lagna) — ব্যক্তিত্ব, কর্মজীবন, বিবাহ`;
  const title = isBn ? titleBn : isGu ? titleGu : isKn ? titleKn : isTe ? titleTe : isTa ? titleTa : isMr ? titleMr : isMai ? titleMai : isHi ? titleHi : titleEn;
  const descEn = `${en} ascendant in Vedic astrology: complete guide to personality, career, health, relationships, finances, and spiritual path. Ruling planet ${rashi.rulerName.en}, ${rashi.element.en.toLowerCase()} element, ${rashi.quality.en.toLowerCase()} sign.`;
  const descHi = `वैदिक ज्योतिष में ${hi} लग्न: व्यक्तित्व, करियर, स्वास्थ्य, सम्बन्ध, धन और आध्यात्मिक मार्ग का पूर्ण मार्गदर्शन। स्वामी ${rashi.rulerName.hi ?? rashi.rulerName.en}, ${rashi.element.hi ?? rashi.element.en} तत्व।`;
  const descMai = `वैदिक ज्योतिषमे ${localName} लग्न: व्यक्तित्व, कैरियर, स्वास्थ्य, सम्बन्ध, धन आ आध्यात्मिक मार्गक पूर्ण मार्गदर्शन। स्वामी ${localRuler}, ${localElement} तत्व।`;
  const descMr = `वैदिक ज्योतिषात ${localName} लग्न: व्यक्तिमत्व, कारकीर्द, आरोग्य, नाती, अर्थकारण आणि आध्यात्मिक मार्ग यांचे संपूर्ण मार्गदर्शन. स्वामी ${localRuler}, ${localElement} तत्त्व.`;
  const descTa = `வேத ஜோதிடத்தில் ${localName} லக்னம்: ஆளுமை, தொழில், ஆரோக்கியம், உறவுகள், பொருளாதாரம் மற்றும் ஆன்மிக பாதைக்கான முழுமையான வழிகாட்டி. அதிபதி ${localRuler}, ${localElement} தத்துவம்.`;
  const descTe = `వేద జ్యోతిషంలో ${localName} లగ్నం: వ్యక్తిత్వం, వృత్తి, ఆరోగ్యం, సంబంధాలు, ఆర్థికం మరియు ఆధ్యాత్మిక మార్గానికి సంపూర్ణ మార్గదర్శి. అధిపతి ${localRuler}, ${localElement} తత్త్వం.`;
  const descKn = `ವೇದ ಜ್ಯೋತಿಷದಲ್ಲಿ ${localName} ಲಗ್ನ: ವ್ಯಕ್ತಿತ್ವ, ವೃತ್ತಿ, ಆರೋಗ್ಯ, ಸಂಬಂಧಗಳು, ಆರ್ಥಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ. ಅಧಿಪತಿ ${localRuler}, ${localElement} ತತ್ತ್ವ.`;
  const descGu = `વૈદિક જ્યોતિષમાં ${localName} લગ્ન: વ્યક્તિત્વ, કારકિર્દી, આરોગ્ય, સંબંધો, નાણાં અને આધ્યાત્મિક માર્ગનું સંપૂર્ણ માર્ગદર્શન. સ્વામી ${localRuler}, ${localElement} તત્વ.`;
  const descBn = `বৈদিক জ্যোতিষে ${localName} লগ্ন: ব্যক্তিত্ব, কর্মজীবন, স্বাস্থ্য, সম্পর্ক, আর্থিক এবং আধ্যাত্মিক পথের সম্পূর্ণ নির্দেশিকা। অধিপতি ${localRuler}, ${localElement} তত্ত্ব।`;
  const description = isBn ? descBn : isGu ? descGu : isKn ? descKn : isTe ? descTe : isTa ? descTa : isMr ? descMr : isMai ? descMai : isHi ? descHi : descEn;
  const keywords = isHi
    ? [
        `${hi} लग्न`,
        `${hi} ascendant`,
        `${sanskrit.toLowerCase()} लग्न`,
        `${hi} व्यक्तित्व`,
        `${hi} करियर`,
        'वैदिक ज्योतिष लग्न',
        'कुण्डली लग्न',
        'लग्न क्या है',
      ]
    : [
        `${en.toLowerCase()} ascendant`,
        `${en.toLowerCase()} lagna`,
        `${en.toLowerCase()} rising`,
        `${en.toLowerCase()} rising sign`,
        `${sanskrit.toLowerCase()} lagna`,
        'vedic astrology ascendant',
        'kundali ascendant',
        'lagna meaning',
        `${en.toLowerCase()} ascendant personality`,
        `${en.toLowerCase()} ascendant career`,
      ];

  return {
    title,
    description,
    keywords,
    // Indexable locales (EN, HI) → index, follow. Others render same
    // content with noindex so hreflang stays honest without polluting
    // the SERP with non-translated copies.
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
      // Hreflang restricted to the route's indexable-locale set + x-default
      // via the central policy (Gemini #250 HIGH origin). Pointing hreflang
      // at the 7 noindex locales would flag "Hreflang to non-indexable
      // page" / "Hreflang conflicts" in GSC.
      languages: buildIndexableHreflang(route),
    },
    openGraph: {
      title: isHi
        ? `${hi} लग्न (${sanskrit} Lagna) — वैदिक ज्योतिष मार्गदर्शिका`
        : `${en} Ascendant (${sanskrit} Lagna) — Vedic Astrology Guide`,
      description: isHi
        ? `${hi} लग्न का पूर्ण मार्गदर्शन: व्यक्तित्व, करियर, विवाह, स्वास्थ्य, धन, उपाय। स्वामी ${rashi.rulerName.hi ?? rashi.rulerName.en}।`
        : `Complete ${en} ascendant guide: personality, career, marriage, health, finances, and remedies. Ruled by ${rashi.rulerName.en}.`,
      url: canonicalUrl,
      siteName: 'Dekho Panchang',
      type: 'article',
    },
  };
}

interface Section {
  heading: string;
  paragraph: string;
}

/** Devanagari-script and Latin "house" labels — extends as new locales
 *  ship lagna translations. Maithili shares HI's "भाव" via Devanagari
 *  fallback; future Marathi can override here as `mr: 'भाव'`, Bengali
 *  as `bn: 'ভাব'`, etc. */
const HOUSE_LABEL_BY_LOCALE: Record<string, string> = {
  en: 'house',
  hi: 'भाव',
  mai: 'भाव',
  mr: 'भाव',
  ta: 'பாவம்',
  te: 'భావం',
  kn: 'ಭಾವ',
  gu: 'ભાવ',
  bn: 'ভাব',
};

function buildPlanetDignitiesForLagna(lagnaId: number, locale: string): {
  exaltedInChart: Array<{ planet: string; sign: string }>;
  debilitatedInChart: Array<{ planet: string; sign: string }>;
  rulerHouse: Record<string, number>;
} {
  // Locale-aware reader for RASHIS LocaleText fields. Falls back hi→en
  // so under-translated locales degrade gracefully without showing
  // English where a script-locale chrome is rendering. Gemini PR #481
  // HIGH: previously used `(isHi ? rashi.name.hi : rashi.name.en)`
  // which silently downgraded Maithili to Hindi even when RASHIS had a
  // proper .mai entry — and would have broken Marathi entirely in
  // wave 2 (तूळ ≠ तुला for Libra).
  // Same delegation to the file-scope helper (Gemini PR #481 round-3 MED).
  const tl = (obj: Record<string, string | undefined> | undefined | null): string =>
    getLocalizedText(obj, locale);

  // Build locale-aware planet names from RASHIS via each planet's home
  // sign. PLANET_HOME_SIGN_ID maps planet id (0=Sun..6=Saturn) to its
  // rulership sign; we then read rulerName from THAT sign's RASHIS
  // entry. This automatically picks up every locale RASHIS supports.
  const planetNames: string[] = PLANET_HOME_SIGN_ID.map(signId => {
    const rashi = RASHIS.find(r => r.id === signId);
    return rashi ? tl(rashi.rulerName as Record<string, string | undefined>) : '';
  });

  const houseLabel = HOUSE_LABEL_BY_LOCALE[locale] ?? HOUSE_LABEL_BY_LOCALE.en;

  // For each planet (Sun..Saturn), figure out which house it's exalted/
  // debilitated in *relative to this lagna*. House = (signId - lagnaId)
  // mod 12 + 1.
  const exaltedInChart: Array<{ planet: string; sign: string }> = [];
  const debilitatedInChart: Array<{ planet: string; sign: string }> = [];
  for (let pid = 0; pid <= 6; pid++) {
    const exSign = EXALTATION_SIGNS[pid];
    const debSign = DEBILITATION_SIGNS[pid];
    const exRashi = RASHIS.find(r => r.id === exSign);
    const debRashi = RASHIS.find(r => r.id === debSign);
    if (exRashi) {
      const house = ((exSign - lagnaId + 12) % 12) + 1;
      const exSignName = tl(exRashi.name as Record<string, string | undefined>);
      exaltedInChart.push({ planet: planetNames[pid], sign: `${exSignName} (${houseLabel} ${house})` });
    }
    if (debRashi) {
      const house = ((debSign - lagnaId + 12) % 12) + 1;
      const debSignName = tl(debRashi.name as Record<string, string | undefined>);
      debilitatedInChart.push({ planet: planetNames[pid], sign: `${debSignName} (${houseLabel} ${house})` });
    }
  }

  // Which other house does the ascendant lord (and each planet that
  // rules two signs) own — relative to this lagna?
  //
  // SIGN_LORDS maps sign → planet. We invert: for each planet, which
  // houses are its rulership relative to this lagna. The 1st house is
  // always the lagna itself, so we skip house===1 — the *useful*
  // information is the OTHER house each two-sign-ruler also governs
  // (e.g. Mars rules house 8 for Aries lagna; Venus rules house 6 for
  // Taurus lagna).
  //
  // Sun and Moon rule only one sign each (Leo/Cancer), so for Leo/
  // Cancer lagnas they will have no "other house" — rulerHouse[ruler]
  // stays undefined and the body text correctly omits the paragraph.
  //
  // Gemini #243 CRITICAL — previous version recorded the first house
  // seen per planet which was always house 1 (signId=lagnaId iterates
  // first), producing nonsense like "Mars governs themes related to the
  // 1st house in your chart" on top of the already-stated 1st-house lord
  // role.
  // rulerHouse keys are the stable EN planet names regardless of
  // locale (Gemini #245) — body lookup uses `rashi.rulerName.en` so
  // they always agree even if PLANET_NAMES_HI vs RASHIS.rulerName.hi
  // drift in a future edit.
  const rulerHouse: Record<string, number> = {};
  for (let signId = 1; signId <= 12; signId++) {
    const lord = SIGN_LORDS[signId];
    if (lord === undefined) continue;
    const planet = PLANET_NAMES_EN[lord];
    const house = ((signId - lagnaId + 12) % 12) + 1;
    if (house !== 1) {
      rulerHouse[planet] = house;
    }
  }
  return { exaltedInChart, debilitatedInChart, rulerHouse };
}

export default async function LagnaSignPage({
  params,
}: { params: Promise<{ locale: string; sign: string }> }) {
  const { locale, sign } = await params;
  setRequestLocale(locale);

  // PR-1 ships EN content only, but every locale URL must resolve so
  // the hreflang alternates are honest. Non-EN locales render the same
  // EN content with `noindex` (set in generateMetadata above) so they
  // don't enter the SERP. PR-2 swaps in HI translations when ready.
  // Case-insensitive slug lookup — consistent with generateMetadata above.
  // Normalised once so the sidebar "current page" comparison further
  // down also works for /Aries / /ARIES (Gemini #243 re-review MED).
  const normalizedSign = sign.toLowerCase();
  const id = SIGN_SLUG_TO_ID[normalizedSign];
  if (!id) notFound();
  const rashi = RASHIS.find(r => r.id === id);
  if (!rashi) notFound();
  const deep = LAGNA_DEEP[id];
  if (!deep) notFound();

  const isHi = locale === 'hi';
  const isMai = locale === 'mai';
  const isMr = locale === 'mr';
  const isGu = locale === 'gu';
  const isBn = locale === 'bn';
  // Devanagari-script Indic siblings that pick the "लग्न" form in the
  // H1 + use the HI-derived rashi-name template ("X लग्न"). Gujarati
  // (script: Gujarati) and Bengali (script: Bengali) get their own H1
  // template via the script branches in the JSX — they do NOT join
  // this set despite being Indo-Aryan languages.
  const isDevanagari = isHi || isMai || isMr;
  // Locale-keyed chrome lookup. Falls back to EN for locales that
  // haven't shipped translated chrome yet — they render English chrome
  // with whatever body content the page produces (still gated by
  // INDEXABLE_LAGNA_LOCALES so untranslated locales stay noindex).
  const L = LABELS[locale as keyof typeof LABELS] ?? LABELS.en;
  // Locale-aware reader for RASHIS LocaleText fields — picks the
  // locale-specific translation when present, falls back HI → EN. Used
  // for signNameLocal / ruler / element / quality below so Maithili
  // (and future Marathi/Tamil/...) names come from RASHIS.<locale>,
  // not silent Hindi fallbacks (Gemini PR #481 HIGH).
  // Locale-aware RASHIS reader — delegates to the file-scope helper
  // (Gemini PR #481 round-3 MED — single source instead of inline copies).
  const localized = (obj: Record<string, string | undefined> | undefined | null): string =>
    getLocalizedText(obj, locale);
  const en = rashi.name.en;
  // Rashi name / ruler / element / quality come from RASHIS via the
  // locale-aware helper for ALL locales — EN, Devanagari, and Dravidian
  // scripts (ta wave 3, te/kn wave 4) alike. The `localized()` helper's
  // obj[locale] ?? obj.hi ?? obj.en fallback chain handles each case
  // correctly: EN reads .en, Devanagari reads .hi/.mai/.mr, Tamil reads
  // .ta. No isDevanagari gating needed.
  const signNameLocal = localized(rashi.name as Record<string, string | undefined>);
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what readers search when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);
  const ruler = localized(rashi.rulerName as Record<string, string | undefined>);
  const element = localized(rashi.element as Record<string, string | undefined>);
  const quality = localized(rashi.quality as Record<string, string | undefined>);

  // buildPlanetDignitiesForLagna takes the locale string so it can
  // pick the correct localized planet, sign, and house labels — and
  // crucially so future waves (mr/ta/te/...) don't silently downgrade
  // to Hindi via the previous boolean flag. Gemini PR #481 MED.
  const { exaltedInChart, debilitatedInChart, rulerHouse } = buildPlanetDignitiesForLagna(id, locale);

  // Section content pulled from LAGNA_DEEP_WITH_OVERLAY. Delegates to
  // the file-scope helper — no per-locale hardcoded branches, so wave-4
  // te/kn etc. need zero edits here when their overlays land (Gemini PR
  // #481 round-3 MED). Cast to the index-signature shape because
  // LocaleText's static type is just { en, hi, sa? } even though overlays
  // attach extra keys at runtime.
  const pick = (textObj: { en: string; hi?: string }): string =>
    getLocalizedText(textObj as Record<string, string | undefined>, locale);
  const sections: Section[] = [
    { heading: L.sections.personality, paragraph: pick(deep.personality) },
    { heading: L.sections.career, paragraph: pick(deep.career) },
    { heading: L.sections.health, paragraph: pick(deep.health) },
    { heading: L.sections.relationships, paragraph: pick(deep.relationships) },
    { heading: L.sections.finances, paragraph: pick(deep.finances) },
    { heading: L.sections.spiritual, paragraph: pick(deep.spiritual) },
  ];

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-text-secondary mb-4" aria-label="Breadcrumb">
          <Link href={`/${locale}/kundali`} className="hover:text-gold-light">{L.breadcrumb_kundali}</Link>
          <span className="mx-1">·</span>
          <span>{L.breadcrumb_lagna}</span>
          <span className="mx-1">·</span>
          <span className="text-text-primary">{signNameLocal} {L.breadcrumb_suffix}</span>
        </nav>

        {/* H1 */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isDevanagari ? (
            <>{signNameLocal} लग्न <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : locale === 'ta' ? (
            <>{signNameLocal} லக்னம் <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : locale === 'te' ? (
            <>{signNameLocal} లగ్నం <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : locale === 'kn' ? (
            <>{signNameLocal} ಲಗ್ನ <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : locale === 'gu' ? (
            <>{signNameLocal} લગ્ન <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : locale === 'bn' ? (
            <>{signNameLocal} লগ্ন <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          ) : (
            <>{en} Ascendant <span className="text-text-secondary">({sanskrit} Lagna)</span></>
          )}
        </h1>

        {/* Sub-header chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {rashi.symbol} {signNameLocal}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {L.chip_ruled_by} {ruler}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {element} · {quality}
          </span>
        </div>

        {/* SEO summary paragraph. Translated per indexable locale so the
            page body matches the chrome script — addresses Gemini PR
            #481 round-3 HIGH (untranslated body paragraphs leaked English
            into mai/mr/ta pages even after the overlay sections rendered
            correctly). en remains the default fallback for locales not
            yet branched (te/kn wave 4, gu/bn wave 5). */}
        <p className="text-text-primary text-base mt-5 leading-relaxed">
          {isMai ? (
            <>
              {signNameLocal} लग्न (संस्कृतमे <strong>{sanskrit} Lagna</strong>) वैदिक ज्योतिषक बारह लग्नमे{' '}
              {ordinalMai(id)} थिक। अहाँक लग्न राशि ओ नक्षत्र-समूह थिक जे अहाँक जन्मक समय पूर्वी क्षितिज पर उदित छल।
              ई अहाँक सम्पूर्ण कुण्डलीक ढाँचा निर्धारित करैत अछि — कोन ग्रह कोन भावक स्वामी अछि,
              कोन दशा कखन सक्रिय होइत अछि, आ अहाँक स्वाभाविक प्रवृत्ति की अछि। अहाँक लग्नेश{' '}
              <strong>{ruler}</strong> क संग, {element} तत्व अहाँक स्वभावकेँ नियन्त्रित करैत अछि आ{' '}
              {quality} प्रकृति अहाँक परिवर्तनक प्रति दृष्टिकोणकेँ आकार दैत अछि।
            </>
          ) : isMr ? (
            <>
              {signNameLocal} लग्न (संस्कृतमध्ये <strong>{sanskrit} Lagna</strong>) वैदिक ज्योतिषातील बारा लग्नांपैकी{' '}
              {ordinalMr(id)} आहे. तुमची लग्न राशी म्हणजे जन्माच्या वेळी पूर्व क्षितिजावर उगवलेला तो राशीसमूह.
              हे तुमच्या संपूर्ण कुंडलीची चौकट ठरवते — कोणते ग्रह कोणत्या भावांचे स्वामी आहेत,
              कोणत्या दशा कधी सक्रिय होतात, आणि तुमच्या नैसर्गिक प्रवृत्ती काय आहेत. तुमच्या लग्नेश{' '}
              <strong>{ruler}</strong> सोबत, {element} तत्व तुमच्या स्वभावावर नियंत्रण ठेवते आणि{' '}
              {quality} प्रकृती बदलाशी तुम्ही कसे जुळवून घेता हे आकार देते.
            </>
          ) : locale === 'ta' ? (
            <>
              {signNameLocal} லக்னம் (சமஸ்கிருதத்தில் <strong>{sanskrit} Lagna</strong>) வேத ஜோதிடத்தின் பன்னிரண்டு லக்னங்களில்{' '}
              {ordinalTa(id)} ஆகும். உங்கள் லக்ன ராசி என்பது நீங்கள் பிறந்த நேரத்தில் கிழக்கு வானத்தில் உதயமான நட்சத்திரக் கூட்டம் ஆகும்.
              இது உங்கள் முழு ஜாதகத்தின் கட்டமைப்பை நிர்ணயிக்கிறது — எந்த கிரகங்கள் எந்த பாவங்களின் அதிபதிகள்,
              எந்த தசைகள் எப்போது செயல்படுகின்றன, மற்றும் உங்கள் இயற்கையான போக்குகள் என்ன என்பதை. உங்கள் லக்னாதிபதி{' '}
              <strong>{ruler}</strong> உடன், {element} தத்துவம் உங்கள் சுபாவத்தை ஆளுகிறது மற்றும்{' '}
              {quality} பண்பு மாற்றத்தை நீங்கள் எவ்வாறு எதிர்கொள்கிறீர்கள் என்பதை வடிவமைக்கிறது.
            </>
          ) : locale === 'te' ? (
            <>
              {signNameLocal} లగ్నం (సంస్కృతంలో <strong>{sanskrit} Lagna</strong>) వేద జ్యోతిషం యొక్క పన్నెండు లగ్నాలలో{' '}
              {ordinalTe(id)}. మీ లగ్న రాశి అంటే మీరు పుట్టిన సమయంలో తూర్పు హోరిజోన్‌లో ఉదయించిన నక్షత్ర సముదాయం.
              ఇది మీ సంపూర్ణ జాతకం యొక్క నిర్మాణాన్ని నిర్ణయిస్తుంది — ఏ గ్రహాలు ఏ భావాలకు అధిపతులు,
              ఏ దశలు ఎప్పుడు సక్రియమవుతాయి, మరియు మీ సహజ ధోరణులు ఏమిటి అన్నదాన్ని. మీ లగ్నాధిపతి{' '}
              <strong>{ruler}</strong> తో పాటు, {element} తత్త్వం మీ స్వభావాన్ని శాసిస్తుంది మరియు{' '}
              {quality} ప్రకృతి మీరు మార్పును ఎలా ఎదుర్కొంటారో రూపొందిస్తుంది.
            </>
          ) : locale === 'kn' ? (
            <>
              {signNameLocal} ಲಗ್ನ (ಸಂಸ್ಕೃತದಲ್ಲಿ <strong>{sanskrit} Lagna</strong>) ವೇದ ಜ್ಯೋತಿಷದ ಹನ್ನೆರಡು ಲಗ್ನಗಳಲ್ಲಿ{' '}
              {ordinalKn(id)}. ನಿಮ್ಮ ಲಗ್ನ ರಾಶಿ ಎಂದರೆ ನೀವು ಹುಟ್ಟಿದ ಸಮಯದಲ್ಲಿ ಪೂರ್ವ ಆಕಾಶದಲ್ಲಿ ಉದಯಿಸಿದ ನಕ್ಷತ್ರ ಸಮೂಹ.
              ಇದು ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಜಾತಕದ ರಚನೆಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ — ಯಾವ ಗ್ರಹಗಳು ಯಾವ ಭಾವಗಳಿಗೆ ಅಧಿಪತಿಗಳು,
              ಯಾವ ದಶೆಗಳು ಯಾವಾಗ ಸಕ್ರಿಯವಾಗುತ್ತವೆ, ಮತ್ತು ನಿಮ್ಮ ಸಹಜ ಪ್ರವೃತ್ತಿಗಳು ಏನು ಎಂಬುದನ್ನು. ನಿಮ್ಮ ಲಗ್ನಾಧಿಪತಿ{' '}
              <strong>{ruler}</strong> ಜೊತೆಗೆ, {element} ತತ್ತ್ವ ನಿಮ್ಮ ಸ್ವಭಾವವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ ಮತ್ತು{' '}
              {quality} ಪ್ರಕೃತಿ ನೀವು ಬದಲಾವಣೆಯನ್ನು ಹೇಗೆ ಎದುರಿಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ರೂಪಿಸುತ್ತದೆ.
            </>
          ) : isGu ? (
            <>
              {signNameLocal} લગ્ન (સંસ્કૃતમાં <strong>{sanskrit} Lagna</strong>) વૈદિક જ્યોતિષના બાર લગ્નોમાંથી{' '}
              {ordinalGu(id)} છે. તમારી લગ્ન રાશિ એ નક્ષત્ર સમૂહ છે જે તમારા જન્મ સમયે પૂર્વ ક્ષિતિજે ઊગ્યું હતું.
              તે તમારી સંપૂર્ણ કુંડળીની માળખું નક્કી કરે છે — કયા ગ્રહો કયા ભાવોના સ્વામી છે,
              કઈ દશાઓ ક્યારે સક્રિય થાય છે, અને તમારી સ્વાભાવિક પ્રવૃત્તિઓ શું છે. તમારા લગ્નેશ{' '}
              <strong>{ruler}</strong> સાથે, {element} તત્વ તમારા સ્વભાવને નિયંત્રિત કરે છે અને{' '}
              {quality} પ્રકૃતિ તમે પરિવર્તનનો સામનો કેવી રીતે કરો છો તે આકાર આપે છે.
            </>
          ) : isBn ? (
            <>
              {signNameLocal} লগ্ন (সংস্কৃতে <strong>{sanskrit} Lagna</strong>) বৈদিক জ্যোতিষের বারোটি লগ্নের মধ্যে{' '}
              {ordinalBn(id)}। আপনার লগ্ন রাশি হল সেই নক্ষত্র সমষ্টি যা আপনার জন্মের সময় পূর্ব দিগন্তে উদিত হয়েছিল।
              এটি আপনার সম্পূর্ণ কুণ্ডলীর কাঠামো নির্ধারণ করে — কোন গ্রহ কোন ভাবের অধিপতি,
              কোন দশা কখন সক্রিয় হয়, এবং আপনার স্বাভাবিক প্রবণতা কী। আপনার লগ্নেশ{' '}
              <strong>{ruler}</strong> এর সাথে, {element} তত্ত্ব আপনার স্বভাবকে নিয়ন্ত্রণ করে এবং{' '}
              {quality} প্রকৃতি পরিবর্তনের সাথে আপনি কীভাবে মানিয়ে নেন তা গঠন করে।
            </>
          ) : isHi ? (
            <>
              {signNameLocal} लग्न (संस्कृत में <strong>{sanskrit} Lagna</strong>) वैदिक ज्योतिष के बारह लग्नों में{' '}
              {ordinalHi(id)} है। आपकी लग्न राशि वह नक्षत्र-समूह है जो आपके जन्म के समय पूर्वी क्षितिज पर उदित था।
              यह आपकी सम्पूर्ण कुण्डली का ढाँचा निर्धारित करती है — कौन से ग्रह किन भावों के स्वामी हैं,
              कौन सी दशाएँ कब सक्रिय होती हैं, और आपकी स्वाभाविक प्रवृत्तियाँ क्या हैं। आपके लग्नेश{' '}
              <strong>{ruler}</strong> के साथ, {element} तत्व आपके स्वभाव को नियंत्रित करता है और{' '}
              {quality} प्रकृति आपके परिवर्तन के प्रति दृष्टिकोण को आकार देती है।
            </>
          ) : (
            <>
              {en} ascendant (known as <strong>{sanskrit} Lagna</strong> in Sanskrit) is the {ordinal(id)} of the
              twelve rising signs in Vedic astrology. Your rising sign is the zodiac constellation that was on the
              eastern horizon at the moment of your birth, and it sets the entire framework of your birth chart —
              which planets rule which houses, which dashas activate which life themes, and what your natural
              tendencies will be. With <strong>{ruler}</strong> as your ascendant lord, the {element.toLowerCase()}{' '}
              element governs your temperament and the {quality.toLowerCase()} modality shapes how you engage
              with change.
            </>
          )}
        </p>

        {/* Six sections from LAGNA_DEEP */}
        {sections.map(s => (
          <section key={s.heading} className="mt-8">
            <h2
              className="text-xl font-semibold text-gold-light mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {s.heading}
            </h2>
            <p className="text-text-primary leading-relaxed">{s.paragraph}</p>
          </section>
        ))}

        {/* Dignities table — derived from canonical EXALTATION_SIGNS /
            DEBILITATION_SIGNS (no constant duplication, Lesson Q). */}
        <section className="mt-10">
          <h2
            className="text-xl font-semibold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isMai
              ? `${signNameLocal} लग्नमे उच्च आ नीच ग्रह`
              : isMr
              ? `${signNameLocal} लग्नातील उच्च आणि नीच ग्रह`
              : locale === 'ta'
              ? `${signNameLocal} லக்னத்தில் உச்ச மற்றும் நீச கிரகங்கள்`
              : locale === 'te'
              ? `${signNameLocal} లగ్నంలో ఉచ్చ మరియు నీచ గ్రహాలు`
              : locale === 'kn'
              ? `${signNameLocal} ಲಗ್ನದಲ್ಲಿ ಉಚ್ಚ ಮತ್ತು ನೀಚ ಗ್ರಹಗಳು`
              : isGu
              ? `${signNameLocal} લગ્નમાં ઉચ્ચ અને નીચ ગ્રહો`
              : isBn
              ? `${signNameLocal} লগ্নে উচ্চ ও নীচ গ্রহ`
              : isHi
              ? `${signNameLocal} लग्न में उच्च व नीच ग्रह`
              : `Exalted & Debilitated Planets in a ${en} Chart`}
          </h2>
          <p className="text-text-primary text-sm leading-relaxed mb-4">
            {L.dignities_intro}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gold-primary/12 p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">{L.exalted}</h3>
              <ul className="space-y-1 text-sm text-text-primary">
                {exaltedInChart.map(e => (
                  <li key={e.planet}>
                    <span className="font-medium">{e.planet}</span>
                    <span className="text-text-secondary"> → {e.sign}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gold-primary/12 p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-2">{L.debilitated}</h3>
              <ul className="space-y-1 text-sm text-text-primary">
                {debilitatedInChart.map(e => (
                  <li key={e.planet}>
                    <span className="font-medium">{e.planet}</span>
                    <span className="text-text-secondary"> → {e.sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Ascendant lord deep-dive */}
        <section className="mt-10">
          <h2
            className="text-xl font-semibold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {L.lord_heading}: {ruler}
          </h2>
          <p className="text-text-primary leading-relaxed">
            {isMai ? (
              <>
                {ruler} {signNameLocal} राशिक स्वामी हेबाक नाते अहाँक प्रथम भाव (लग्न) क स्वामी अछि।
                अहाँक जन्म कुण्डलीमे {ruler} क स्थिति — ओकर राशि, भाव, दृष्टि आ युति — अहाँक सम्पूर्ण
                जीवन-दिशा, जीवनी-शक्ति आ पहचान पर निर्णायक प्रभाव डालैत अछि। यदि {ruler} स्वराशि, मूलत्रिकोण,
                उच्च वा मित्र राशिमे बलवान होय, तँ अहाँक {signNameLocal} लग्नक आधारभूत प्रतिज्ञा सहजतासँ
                प्रकट होइत अछि। यदि {ruler} दुर्बल वा पीड़ित होय, तँ अहाँक स्वाभाविक शक्तिक प्रकटनमे
                बाधा अबैत अछि — जे विशिष्ट उपायक दिस सङ्केत करैत अछि।
              </>
            ) : isMr ? (
              <>
                {ruler} हा {signNameLocal} राशीचा स्वामी असल्याने तुमच्या पहिल्या भावाचा (लग्नाचा) स्वामी आहे.
                तुमच्या जन्म कुंडलीत {ruler} ची स्थिती — त्याची राशी, भाव, दृष्टी आणि युती — तुमच्या एकूण
                जीवन-दिशा, जीवनशक्ती आणि ओळखीवर निर्णायक परिणाम करते. जर {ruler} स्वराशी, मूलत्रिकोण,
                उच्च किंवा मित्र राशीत बलवान असेल, तर तुमच्या {signNameLocal} लग्नाची मूलभूत प्रतिज्ञा सहजतेने
                प्रकट होते. जर {ruler} दुर्बल किंवा पीडित असेल, तर तुमच्या नैसर्गिक शक्तींच्या प्रकटीकरणात
                अडथळे येतात — जे विशिष्ट उपायांकडे निर्देश करतात.
              </>
            ) : locale === 'ta' ? (
              <>
                {ruler} {signNameLocal} ராசியின் அதிபதியாக இருப்பதால் உங்கள் முதலாம் பாவத்தின் (லக்னத்தின்) அதிபதி ஆகிறார்.
                உங்கள் ஜாதகத்தில் {ruler} இன் நிலை — அவரது ராசி, பாவம், பார்வை மற்றும் சேர்க்கை — உங்கள் ஒட்டுமொத்த
                வாழ்க்கை திசை, உயிர்ச் சக்தி மற்றும் அடையாளத்தில் முக்கிய தாக்கம் கொண்டுள்ளது. {ruler} சுயராசி, மூலத்திரிகோணம்,
                உச்சம் அல்லது நட்பு ராசியில் வலுவாக இருந்தால், உங்கள் {signNameLocal} லக்னத்தின் அடிப்படை வாக்குறுதி இலகுவாக
                வெளிப்படும். {ruler} பலவீனமாக அல்லது பாதிக்கப்பட்டிருந்தால், உங்கள் இயற்கையான பலங்களை வெளிப்படுத்துவதில்
                தடைகள் ஏற்படும் — இது குறிப்பிட்ட பரிகாரங்களைச் சுட்டிக்காட்டுகிறது.
              </>
            ) : locale === 'te' ? (
              <>
                {ruler} {signNameLocal} రాశికి అధిపతి అయినందున మీ మొదటి భావం (లగ్నం) యొక్క అధిపతి అవుతారు.
                మీ జాతకంలో {ruler} యొక్క స్థితి — అతని రాశి, భావం, దృష్టి మరియు యోగాలు — మీ మొత్తం
                జీవిత దిశ, ప్రాణశక్తి మరియు గుర్తింపుపై నిర్ణాయక ప్రభావం చూపిస్తాయి. {ruler} స్వరాశి, మూలత్రికోణం,
                ఉచ్చం లేదా మిత్ర రాశిలో బలంగా ఉంటే, మీ {signNameLocal} లగ్నం యొక్క మూల వాగ్దానం సులభంగా
                వ్యక్తమవుతుంది. {ruler} దుర్బలంగా లేదా పీడితంగా ఉంటే, మీ సహజ శక్తులను వ్యక్తీకరించడంలో
                అడ్డంకులు వస్తాయి — ఇది నిర్దిష్ట పరిహారాలను సూచిస్తుంది.
              </>
            ) : locale === 'kn' ? (
              <>
                {ruler} {signNameLocal} ರಾಶಿಯ ಅಧಿಪತಿಯಾಗಿರುವುದರಿಂದ ನಿಮ್ಮ ಮೊದಲ ಭಾವದ (ಲಗ್ನದ) ಅಧಿಪತಿಯಾಗಿರುತ್ತಾರೆ.
                ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ {ruler} ರ ಸ್ಥಿತಿ — ಅವರ ರಾಶಿ, ಭಾವ, ದೃಷ್ಟಿ ಮತ್ತು ಯೋಗಗಳು — ನಿಮ್ಮ ಒಟ್ಟಾರೆ
                ಜೀವನ ದಿಕ್ಕು, ಪ್ರಾಣಶಕ್ತಿ ಮತ್ತು ಗುರುತಿನ ಮೇಲೆ ನಿರ್ಣಾಯಕ ಪ್ರಭಾವ ಬೀರುತ್ತವೆ. {ruler} ಸ್ವರಾಶಿ, ಮೂಲತ್ರಿಕೋಣ,
                ಉಚ್ಚ ಅಥವಾ ಮಿತ್ರ ರಾಶಿಯಲ್ಲಿ ಬಲವಾಗಿದ್ದರೆ, ನಿಮ್ಮ {signNameLocal} ಲಗ್ನದ ಮೂಲ ವಾಗ್ದಾನ ಸುಲಭವಾಗಿ
                ವ್ಯಕ್ತವಾಗುತ್ತದೆ. {ruler} ದುರ್ಬಲವಾಗಿ ಅಥವಾ ಪೀಡಿತವಾಗಿದ್ದರೆ, ನಿಮ್ಮ ಸಹಜ ಶಕ್ತಿಗಳನ್ನು ವ್ಯಕ್ತಪಡಿಸುವಲ್ಲಿ
                ಅಡೆತಡೆಗಳು ಬರುತ್ತವೆ — ಇದು ನಿರ್ದಿಷ್ಟ ಪರಿಹಾರಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ.
              </>
            ) : isGu ? (
              <>
                {ruler} {signNameLocal} રાશિના સ્વામી હોવાથી તમારા પ્રથમ ભાવ (લગ્ન) ના સ્વામી છે.
                તમારી જન્મ કુંડળીમાં {ruler} ની સ્થિતિ — તેની રાશિ, ભાવ, દૃષ્ટિ અને યુતિ — તમારી સંપૂર્ણ
                જીવન દિશા, જીવનશક્તિ અને ઓળખ પર નિર્ણાયક અસર કરે છે. જો {ruler} સ્વરાશિ, મૂળત્રિકોણ,
                ઉચ્ચ અથવા મિત્ર રાશિમાં બળવાન હોય, તો તમારા {signNameLocal} લગ્નનું મૂળભૂત વચન સહજતાથી
                પ્રગટ થાય છે. જો {ruler} નબળો અથવા પીડિત હોય, તો તમારી સ્વાભાવિક શક્તિઓના પ્રગટીકરણમાં
                અવરોધો આવે છે — જે ચોક્કસ ઉપાયો તરફ નિર્દેશ કરે છે.
              </>
            ) : isBn ? (
              <>
                {ruler} {signNameLocal} রাশির অধিপতি হওয়ায় আপনার প্রথম ভাবের (লগ্নের) অধিপতি।
                আপনার জন্ম কুণ্ডলীতে {ruler} এর অবস্থান — তার রাশি, ভাব, দৃষ্টি এবং যোগ — আপনার সামগ্রিক
                জীবন দিশা, প্রাণশক্তি এবং পরিচিতিতে নির্ণায়ক প্রভাব ফেলে। যদি {ruler} স্বরাশি, মূলত্রিকোণ,
                উচ্চ বা মিত্র রাশিতে বলবান হন, তবে আপনার {signNameLocal} লগ্নের মৌলিক প্রতিশ্রুতি সহজেই
                প্রকাশ পায়। যদি {ruler} দুর্বল বা পীড়িত হন, তবে আপনার স্বাভাবিক শক্তির প্রকাশে
                বাধা আসে — যা নির্দিষ্ট প্রতিকারের দিকে নির্দেশ করে।
              </>
            ) : isHi ? (
              <>
                {ruler} {signNameLocal} राशि का स्वामी होने के नाते आपके प्रथम भाव (लग्न) का स्वामी है।
                आपकी जन्म कुण्डली में {ruler} की स्थिति — उसकी राशि, भाव, दृष्टि और युति — आपके सम्पूर्ण
                जीवन-दिशा, जीवनी-शक्ति और पहचान पर निर्णायक प्रभाव डालती है। यदि {ruler} स्वराशि, मूलत्रिकोण,
                उच्च या मित्र राशि में बलवान हो, तो आपके {signNameLocal} लग्न की आधारभूत प्रतिज्ञा सहजता से
                प्रकट होती है। यदि {ruler} दुर्बल या पीड़ित हो, तो आपकी स्वाभाविक शक्तियों के प्रकटन में
                बाधाएँ आती हैं — जो विशिष्ट उपायों की ओर संकेत करती हैं।
              </>
            ) : (
              <>
                {ruler} is the lord of your 1st house (the lagna itself) as the ruler of {en}. The condition of{' '}
                {ruler} in your birth chart — its sign, house, aspects, and conjunctions — has an outsized influence
                on your overall life direction, vitality, and identity. A well-placed {ruler} (in its own sign,
                moolatrikona, exaltation, or a friend&apos;s sign, with strong dignities) signals that the foundational
                promise of your {en} ascendant will manifest with relative ease. A weak or afflicted {ruler}{' '}
                indicates obstacles in actualising your natural strengths and points toward specific remedial
                practices.
              </>
            )}
          </p>
          {/* Key by EN ruler name (Gemini #245) — buildPlanetDignitiesForLagna
              always stores rulerHouse keys in EN regardless of locale. */}
          {rulerHouse[rashi.rulerName.en] !== undefined && (
            <p className="text-text-secondary text-sm mt-3">
              {isMai
                ? `प्रथम भावक अतिरिक्त, ${ruler} स्वाभाविक रूपसँ अहाँक कुण्डलीमे ${ordinalMai(rulerHouse[rashi.rulerName.en])} भावक विषयक सेहो अधिपति अछि।`
                : isMr
                ? `पहिल्या भावाव्यतिरिक्त, ${ruler} नैसर्गिकरीत्या तुमच्या कुंडलीतील ${ordinalMrOblique(rulerHouse[rashi.rulerName.en])} भावाशी संबंधित विषयांचा अधिपती आहे.`
                : locale === 'ta'
                ? `முதல் பாவத்திற்கு கூடுதலாக, ${ruler} இயற்கையாக உங்கள் ஜாதகத்தில் ${ordinalTa(rulerHouse[rashi.rulerName.en])} பாவம் தொடர்பான விஷயங்களையும் ஆளுகிறார்.`
                : locale === 'te'
                ? `మొదటి భావంతో పాటు, ${ruler} సహజంగానే మీ జాతకంలో ${ordinalTeOblique(rulerHouse[rashi.rulerName.en])} భావానికి సంబంధించిన విషయాలను కూడా శాసిస్తారు.`
                : locale === 'kn'
                ? `ಮೊದಲ ಭಾವದ ಜೊತೆಗೆ, ${ruler} ಸಹಜವಾಗಿ ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ${ordinalKnOblique(rulerHouse[rashi.rulerName.en])} ಭಾವಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ವಿಷಯಗಳ ಅಧಿಪತಿಯಾಗಿರುತ್ತಾರೆ.`
                : isGu
                ? `પ્રથમ ભાવ ઉપરાંત, ${ruler} સ્વાભાવિક રીતે તમારી કુંડળીમાં ${ordinalGuOblique(rulerHouse[rashi.rulerName.en])} ભાવને લગતા વિષયોના સ્વામી છે.`
                : isBn
                ? `প্রথম ভাব ছাড়াও, ${ruler} স্বাভাবিকভাবে আপনার কুণ্ডলীতে ${ordinalBn(rulerHouse[rashi.rulerName.en])} ভাবের সংশ্লিষ্ট বিষয়ের অধিপতি।`
                : isHi
                ? `प्रथम भाव के अतिरिक्त, ${ruler} स्वाभाविक रूप से आपकी कुण्डली में ${ordinalHi(rulerHouse[rashi.rulerName.en])} भाव के विषयों का भी अधिपति है।`
                : `In addition to the 1st house, ${ruler} naturally governs themes related to the ${ordinal(rulerHouse[rashi.rulerName.en])} house in your chart.`}
            </p>
          )}
        </section>

        {/* CTA to the chart-generator tool */}
        <section className="mt-12 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-6">
          <h2
            className="text-xl font-semibold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {L.cta_heading}
          </h2>
          <p className="text-text-primary mb-4">
            {isMai
              ? `अपन पूर्ण कुण्डली बनाउ आ देखू जे ${signNameLocal} वास्तवमे अहाँक लग्न अछि किनै, ${ruler} अहाँक कुण्डलीमे कतय स्थित अछि, आ ई स्थितिसँ कोन योग सक्रिय होइत अछि। निःशुल्क, बिना साइनअप, स्विस एफेमेरिस सटीकता।`
              : isMr
              ? `तुमची संपूर्ण कुंडली बनवा आणि पाहा की ${signNameLocal} खरोखरच तुमचे लग्न आहे का, ${ruler} तुमच्या कुंडलीत कुठे आहे, आणि या स्थितींवर आधारित कोणते योग सक्रिय होतात. विनामूल्य, साइनअप नाही, स्विस एफेमेरिस अचूकता.`
              : locale === 'ta'
              ? `உங்கள் முழு ஜாதகத்தை உருவாக்கி, ${signNameLocal} உண்மையில் உங்கள் லக்னமா, ${ruler} உங்கள் ஜாதகத்தில் எங்கே அமர்ந்துள்ளார், மற்றும் இந்த நிலைகளின் அடிப்படையில் எந்த யோகங்கள் செயல்படுகின்றன என்பதைக் காண்க. இலவசம், பதிவு தேவையில்லை, ஸ்விஸ் எஃபெமெரிஸ் துல்லியம்.`
              : locale === 'te'
              ? `మీ సంపూర్ణ జాతకాన్ని రూపొందించి, ${signNameLocal} నిజంగా మీ లగ్నమేనా, ${ruler} మీ జాతకంలో ఎక్కడ ఉన్నారు, మరియు ఈ స్థానాల ఆధారంగా ఏ యోగాలు సక్రియమవుతాయో చూడండి. ఉచితం, సైనప్ అవసరం లేదు, స్విస్ ఎఫెమెరిస్ ఖచ్చితత్వం.`
              : locale === 'kn'
              ? `ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಜಾತಕವನ್ನು ರಚಿಸಿ ಮತ್ತು ${signNameLocal} ನಿಜವಾಗಿಯೂ ನಿಮ್ಮ ಲಗ್ನವೇ, ${ruler} ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಎಲ್ಲಿ ಕುಳಿತಿದ್ದಾರೆ, ಮತ್ತು ಈ ಸ್ಥಾನಗಳ ಆಧಾರದ ಮೇಲೆ ಯಾವ ಯೋಗಗಳು ಸಕ್ರಿಯವಾಗುತ್ತವೆ ಎಂಬುದನ್ನು ನೋಡಿ. ಉಚಿತ, ಸೈನಪ್ ಅಗತ್ಯವಿಲ್ಲ, ಸ್ವಿಸ್ ಎಫೆಮೆರಿಸ್ ನಿಖರತೆ.`
              : isGu
              ? `તમારી સંપૂર્ણ કુંડળી બનાવો અને જુઓ કે શું ${signNameLocal} ખરેખર તમારું લગ્ન છે, ${ruler} તમારી કુંડળીમાં ક્યાં છે, અને આ સ્થિતિઓના આધારે કયા યોગ સક્રિય થાય છે. વિના મૂલ્યે, સાઇન-અપ વગર, સ્વિસ એફેમેરિસ ચોકસાઈ.`
              : isBn
              ? `আপনার সম্পূর্ণ কুণ্ডলী তৈরি করুন এবং দেখুন ${signNameLocal} সত্যিই আপনার লগ্ন কিনা, ${ruler} আপনার কুণ্ডলীতে কোথায় অবস্থিত, এবং এই অবস্থানের ভিত্তিতে কোন যোগ সক্রিয় হয়। বিনামূল্যে, সাইন-আপ ছাড়াই, সুইস এফেমেরিস নির্ভুলতা।`
              : isHi
              ? `अपनी पूर्ण कुण्डली बनाएँ और देखें कि क्या ${signNameLocal} वास्तव में आपका लग्न है, ${ruler} आपकी कुण्डली में कहाँ स्थित है, और इन स्थितियों से कौन से योग सक्रिय होते हैं। निःशुल्क, बिना साइनअप, स्विस एफेमेरिस सटीकता।`
              : `Generate your full kundali to see whether ${en} is your true ascendant, where ${ruler} sits in your chart, and which yogas activate based on these positions. Free, no signup, Swiss Ephemeris precision.`}
          </p>
          <Link
            href={`/${locale}/kundali`}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors"
          >
            {L.cta_button}
          </Link>
        </section>

        {/* Featured yogas — cross-link to /learn/yoga/[slug] pages
            (existing rich content). Drives internal link equity into
            the long-tail yoga query layer. */}
        <section className="mt-10">
          <h2
            className="text-base font-semibold text-text-secondary uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isMai ? 'प्रमुख योग' : isMr ? 'प्रमुख योग' : locale === 'ta' ? 'முக்கிய யோகங்கள்' : locale === 'te' ? 'ముఖ్య యోగాలు' : locale === 'kn' ? 'ಮುಖ್ಯ ಯೋಗಗಳು' : isGu ? 'મુખ્ય યોગો' : isBn ? 'প্রধান যোগ' : isHi ? 'प्रमुख योग' : 'Featured Yogas to Explore'}
          </h2>
          <p className="text-text-secondary text-sm mb-3">
            {isMai
              ? 'ई योगक उपस्थिति अहाँक कुण्डलीमे जीवनक विशेष आयामकेँ आकार दैत अछि।'
              : isMr
              ? 'हे योग तुमच्या कुंडलीत असल्यास जीवनातील विशेष पैलूंना आकार देतात.'
              : locale === 'ta'
              ? 'இந்த யோகங்கள் உங்கள் ஜாதகத்தில் இருந்தால், உங்கள் வாழ்க்கையின் குறிப்பிட்ட பரிமாணங்களை வடிவமைக்கின்றன.'
              : locale === 'te'
              ? 'ఈ యోగాలు మీ జాతకంలో ఉన్నప్పుడు, మీ జీవితంలోని నిర్దిష్ట కోణాలను రూపొందిస్తాయి.'
              : locale === 'kn'
              ? 'ಈ ಯೋಗಗಳು ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಇದ್ದರೆ, ನಿಮ್ಮ ಜೀವನದ ನಿರ್ದಿಷ್ಟ ಆಯಾಮಗಳನ್ನು ರೂಪಿಸುತ್ತವೆ.'
              : isGu
              ? 'આ યોગો જ્યારે તમારી કુંડળીમાં હાજર હોય, ત્યારે તમારા જીવનનાં ચોક્કસ પાસાંઓને આકાર આપે છે.'
              : isBn
              ? 'এই যোগগুলি আপনার কুণ্ডলীতে থাকলে, আপনার জীবনের নির্দিষ্ট দিকগুলি গঠন করে।'
              : isHi
              ? 'इन योगों की उपस्थिति आपकी कुण्डली में जीवन के विशेष आयामों को आकार देती है।'
              : 'These yogas, when present in your chart, shape specific dimensions of your life.'}
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
            {FEATURED_YOGAS.map(y => (
              <li key={y.slug}>
                <Link
                  href={`/${locale}/learn/yoga/${y.slug}`}
                  className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors text-xs"
                >
                  {isMai || isMr || isHi
                    ? `${y.hi} योग`
                    : locale === 'ta'
                    ? `${y.en} யோகம்`
                    : locale === 'te'
                    ? `${y.en} యోగం`
                    : locale === 'kn'
                    ? `${y.en} ಯೋಗ`
                    : isGu
                    ? `${y.en} યોગ`
                    : isBn
                    ? `${y.en} যোগ`
                    : `${y.en} Yoga`}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Sibling lagna pages — internal-linking spine */}
        <nav className="mt-12" aria-label={L.all_twelve}>
          <h2
            className="text-base font-semibold text-text-secondary uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {L.all_twelve}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {SIGN_SLUGS.map(s => {
              const r = RASHIS.find(rr => rr.id === SIGN_SLUG_TO_ID[s]);
              if (!r) return null;
              const isCurrent = s === normalizedSign;
              // Sibling rashi names via the same locale-aware reader as the
              // page body. Previously hardcoded `r.name.en` for any non-HI
              // locale, which leaked English into the nav of mai/mr/ta/te/kn
              // (Gemini PR #481 round-4 HIGH — mixed-language content).
              const siblingName = localized(r.name as Record<string, string | undefined>);
              return (
                <li key={s}>
                  {isCurrent ? (
                    <span className="block px-3 py-2 rounded-lg bg-gold-primary/15 border border-gold-primary/40 text-gold-light">
                      {r.symbol} {siblingName}
                    </span>
                  ) : (
                    <Link
                      href={`/${locale}/kundali/lagna/${s}`}
                      className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors"
                    >
                      {r.symbol} {siblingName}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Related links footer */}
        <nav className="flex flex-wrap gap-2 mt-10 text-xs" aria-label={
          isMai ? 'सम्बन्धित पृष्ठ'
            : isMr ? 'संबंधित पाने'
            : locale === 'ta' ? 'தொடர்புடைய பக்கங்கள்'
            : locale === 'te' ? 'సంబంధిత పేజీలు'
            : locale === 'kn' ? 'ಸಂಬಂಧಿತ ಪುಟಗಳು'
            : isGu ? 'સંબંધિત પૃષ્ઠો'
            : isBn ? 'সম্পর্কিত পৃষ্ঠা'
            : isHi ? 'सम्बन्धित पृष्ठ'
            : 'Related pages'
        }>
          <Link href={`/${locale}/kundali`} className="text-gold-primary/70 hover:text-gold-light">{L.related_kundali}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/matching`} className="text-gold-primary/70 hover:text-gold-light">{L.related_matching}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/horoscope`} className="text-gold-primary/70 hover:text-gold-light">{L.related_horoscope}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/learn/kundali`} className="text-gold-primary/70 hover:text-gold-light">{L.related_learn}</Link>
        </nav>
      </div>
    </main>
  );
}

function ordinal(n: number): string {
  const j = n % 10, k = n % 100;
  if (k >= 11 && k <= 13) return `${n}th`;
  if (j === 1) return `${n}st`;
  if (j === 2) return `${n}nd`;
  if (j === 3) return `${n}rd`;
  return `${n}th`;
}

/**
 * Hindi ordinal for 1..12. Hindi uses different forms — "पहला" (1st),
 * "दूसरा" (2nd), etc. For 13+ we fall back to "Nवाँ" but we only use
 * this for lagna id (1-12) and house numbers (1-12), so the static
 * map is sufficient.
 */
const ORDINALS_HI = [
  '', 'पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ', 'छठा',
  'सातवाँ', 'आठवाँ', 'नौवाँ', 'दसवाँ', 'ग्यारहवाँ', 'बारहवाँ',
];
function ordinalHi(n: number): string {
  return ORDINALS_HI[n] ?? `${n}वाँ`;
}

// Per-locale native ordinals for the SEO summary "{ordinal} of the
// twelve lagnas" pattern and the deep-dive "in addition to the 1st
// house, X governs the Nth house..." sentence (Gemini PR #481 round-4
// HIGH × 2). Previously reused ordinalHi/ordinal which silently
// downgraded mai/mr to Hindi forms ("पहला" instead of Maithili
// "पहिल", "दूसरा" instead of Marathi "दुसरे") and dropped Tamil/Telugu/
// Kannada to English "1st" — visible jarring to native readers and an
// SEO trust hit. Marathi additionally needs an OBLIQUE form when the
// ordinal precedes "भावाशी" (the oblique-case house noun) — "आठव्या
// भावाशी" not "आठवे भावाशी".

const ORDINALS_MAI = [
  '', 'पहिल', 'दोसर', 'तेसर', 'चौथा', 'पांचम', 'छठम',
  'सातम', 'आठम', 'नवम', 'दशम', 'एकादश', 'द्वादश',
];
function ordinalMai(n: number): string { return ORDINALS_MAI[n] ?? `${n}अम`; }

const ORDINALS_MR = [
  '', 'पहिले', 'दुसरे', 'तिसरे', 'चौथे', 'पाचवे', 'सहावे',
  'सातवे', 'आठवे', 'नववे', 'दहावे', 'अकरावे', 'बारावे',
];
function ordinalMr(n: number): string { return ORDINALS_MR[n] ?? `${n}वे`; }

// Marathi oblique form — used when the ordinal modifies a noun in
// oblique case (e.g. "आठव्या भावाशी" = "with the 8th house").
const ORDINALS_MR_OBLIQUE = [
  '', 'पहिल्या', 'दुसऱ्या', 'तिसऱ्या', 'चौथ्या', 'पाचव्या', 'सहाव्या',
  'सातव्या', 'आठव्या', 'नवव्या', 'दहाव्या', 'अकराव्या', 'बाराव्या',
];
function ordinalMrOblique(n: number): string { return ORDINALS_MR_OBLIQUE[n] ?? `${n}व्या`; }

// Tamil — `Nவது` for both standalone ("1வது ஆகும்") and attributive
// ("1வது பாவம்"). The hyphen-separated form "N-வது" exists in some
// stylistic registers but plain "Nவது" is the dominant SEO form.
function ordinalTa(n: number): string { return `${n}வது`; }

// Telugu — `Nవది` standalone ("1వది"), `Nవ` attributive ("2వ భావానికి").
function ordinalTe(n: number): string { return `${n}వది`; }
function ordinalTeOblique(n: number): string { return `${n}వ`; }

// Kannada — `Nನೆಯದು` standalone, `Nನೆಯ` attributive ("2ನೆಯ ಭಾವಕ್ಕೆ").
function ordinalKn(n: number): string { return `${n}ನೆಯದು`; }
function ordinalKnOblique(n: number): string { return `${n}ನೆಯ`; }

// Gujarati — full ordinal forms 1..12. Both standalone ("પહેલું છે")
// and attributive ("આઠમા ભાવને") use slightly different inflection;
// the attributive masculine -ા form precedes ભાવ.
const ORDINALS_GU = [
  '', 'પહેલું', 'બીજું', 'ત્રીજું', 'ચોથું', 'પાંચમું', 'છઠ્ઠું',
  'સાતમું', 'આઠમું', 'નવમું', 'દસમું', 'અગિયારમું', 'બારમું',
];
function ordinalGu(n: number): string { return ORDINALS_GU[n] ?? `${n}મું`; }
const ORDINALS_GU_OBLIQUE = [
  '', 'પહેલા', 'બીજા', 'ત્રીજા', 'ચોથા', 'પાંચમા', 'છઠ્ઠા',
  'સાતમા', 'આઠમા', 'નવમા', 'દસમા', 'અગિયારમા', 'બારમા',
];
function ordinalGuOblique(n: number): string { return ORDINALS_GU_OBLIQUE[n] ?? `${n}મા`; }

// Bengali — Tatsama Sanskrit ordinals are used for both attributive
// and predicative roles ("প্রথম থেকে" / "অষ্টম ভাবের"). No separate
// oblique form needed because Bengali ordinals don't decline.
const ORDINALS_BN = [
  '', 'প্রথম', 'দ্বিতীয়', 'তৃতীয়', 'চতুর্থ', 'পঞ্চম', 'ষষ্ঠ',
  'সপ্তম', 'অষ্টম', 'নবম', 'দশম', 'একাদশ', 'দ্বাদশ',
];
function ordinalBn(n: number): string { return ORDINALS_BN[n] ?? `${n}তম`; }

