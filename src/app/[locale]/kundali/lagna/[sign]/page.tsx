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
import { LAGNA_DEEP } from '@/lib/kundali/tippanni-lagna';
import {
  EXALTATION_SIGNS,
  DEBILITATION_SIGNS,
  SIGN_LORDS,
} from '@/lib/constants/dignities';
import {
  FEATURED_YOGAS,
  INDEXABLE_LAGNA_LOCALES,
  buildIndexableLagnaHreflang,
} from '@/lib/seo/lagna-seo';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;

// Strip trailing slash if env var has one (Gemini #243 re-review MED) —
// without this, `${BASE_URL}/${locale}/...` becomes `https://.../` + `/en/...`
// → double slash in canonical and hreflang URLs.
import { BASE_URL } from '@/lib/seo/base-url';

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि'];

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
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what an EN reader searches when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);
  const isIndexable = (INDEXABLE_LAGNA_LOCALES as readonly string[]).includes(locale);

  // Each indexable locale gets its own canonical pointing at its own
  // lowercase URL. Non-indexable locales render EN content but
  // canonical → EN.
  const canonicalLocale = isIndexable ? locale : 'en';
  const canonicalUrl = `${BASE_URL}/${canonicalLocale}/kundali/lagna/${normalizedSign}`;

  // Per-locale title + description.
  const isHi = locale === 'hi';
  const title = isHi
    ? `${hi} लग्न (${sanskrit} Lagna) — व्यक्तित्व, करियर, विवाह`
    : `${en} Ascendant (${sanskrit} Lagna) — Personality, Career, Marriage`;
  const description = isHi
    ? `वैदिक ज्योतिष में ${hi} लग्न: व्यक्तित्व, करियर, स्वास्थ्य, सम्बन्ध, धन और आध्यात्मिक मार्ग का पूर्ण मार्गदर्शन। स्वामी ${rashi.rulerName.hi ?? rashi.rulerName.en}, ${rashi.element.hi ?? rashi.element.en} तत्व।`
    : `${en} ascendant in Vedic astrology: complete guide to personality, career, health, relationships, finances, and spiritual path. Ruling planet ${rashi.rulerName.en}, ${rashi.element.en.toLowerCase()} element, ${rashi.quality.en.toLowerCase()} sign.`;
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
      // Hreflang restricted to INDEXABLE_LAGNA_LOCALES + x-default
      // (Gemini #250 HIGH). Pointing hreflang at the 7 noindex
      // locales would flag "Hreflang to non-indexable page" / "
      // Hreflang conflicts" in GSC.
      languages: buildIndexableLagnaHreflang(`/kundali/lagna/${normalizedSign}`),
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

function buildPlanetDignitiesForLagna(lagnaId: number, isHi: boolean): {
  exaltedInChart: Array<{ planet: string; sign: string }>;
  debilitatedInChart: Array<{ planet: string; sign: string }>;
  rulerHouse: Record<string, number>;
} {
  const planetNames = isHi ? PLANET_NAMES_HI : PLANET_NAMES_EN;
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
    const houseLabel = isHi ? 'भाव' : 'house';
    if (exRashi) {
      const house = ((exSign - lagnaId + 12) % 12) + 1;
      const exSignName = (isHi ? (exRashi.name.hi ?? exRashi.name.en) : exRashi.name.en);
      exaltedInChart.push({ planet: planetNames[pid], sign: `${exSignName} (${houseLabel} ${house})` });
    }
    if (debRashi) {
      const house = ((debSign - lagnaId + 12) % 12) + 1;
      const debSignName = (isHi ? (debRashi.name.hi ?? debRashi.name.en) : debRashi.name.en);
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
  const L = isHi ? LABELS.hi : LABELS.en;
  const en = rashi.name.en;
  const signNameLocal = isHi ? (rashi.name.hi ?? en) : en;
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what readers search when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);
  const ruler = isHi ? (rashi.rulerName.hi ?? rashi.rulerName.en) : rashi.rulerName.en;
  const element = isHi ? (rashi.element.hi ?? rashi.element.en) : rashi.element.en;
  const quality = isHi ? (rashi.quality.hi ?? rashi.quality.en) : rashi.quality.en;

  const { exaltedInChart, debilitatedInChart, rulerHouse } = buildPlanetDignitiesForLagna(id, isHi);

  // Section content pulled from LAGNA_DEEP. The .hi field exists for
  // every section/lagna — we ship HI in PR-2 with confidence because
  // the content was already written for the tippanni report.
  // The LocaleText `.hi` field is typed as optional. In practice every
  // LAGNA_DEEP entry has it, but use `?? .en` so any future gap doesn't
  // break the build.
  const pick = (en: string, hi: string | undefined) => (isHi ? (hi ?? en) : en);
  const sections: Section[] = [
    { heading: L.sections.personality, paragraph: pick(deep.personality.en, deep.personality.hi) },
    { heading: L.sections.career, paragraph: pick(deep.career.en, deep.career.hi) },
    { heading: L.sections.health, paragraph: pick(deep.health.en, deep.health.hi) },
    { heading: L.sections.relationships, paragraph: pick(deep.relationships.en, deep.relationships.hi) },
    { heading: L.sections.finances, paragraph: pick(deep.finances.en, deep.finances.hi) },
    { heading: L.sections.spiritual, paragraph: pick(deep.spiritual.en, deep.spiritual.hi) },
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
          {isHi ? (
            <>{signNameLocal} लग्न <span className="text-text-secondary">({sanskrit} Lagna)</span></>
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

        {/* SEO summary paragraph */}
        <p className="text-text-primary text-base mt-5 leading-relaxed">
          {isHi ? (
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
            {isHi
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
            {isHi ? (
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
              {isHi
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
            {isHi
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
            {isHi ? 'प्रमुख योग' : 'Featured Yogas to Explore'}
          </h2>
          <p className="text-text-secondary text-sm mb-3">
            {isHi
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
                  {isHi ? `${y.hi} योग` : `${y.en} Yoga`}
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
              return (
                <li key={s}>
                  {isCurrent ? (
                    <span className="block px-3 py-2 rounded-lg bg-gold-primary/15 border border-gold-primary/40 text-gold-light">
                      {r.symbol} {isHi ? (r.name.hi ?? r.name.en) : r.name.en}
                    </span>
                  ) : (
                    <Link
                      href={`/${locale}/kundali/lagna/${s}`}
                      className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors"
                    >
                      {r.symbol} {isHi ? (r.name.hi ?? r.name.en) : r.name.en}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Related links footer */}
        <nav className="flex flex-wrap gap-2 mt-10 text-xs" aria-label={isHi ? 'सम्बन्धित पृष्ठ' : 'Related pages'}>
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

