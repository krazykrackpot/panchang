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
import { buildHreflangMap } from '@/lib/seo/hreflang';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 86400;

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

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
// Static params: 12 lagna pages × EN locale only (PR-1)
//
// 12 entries is a small bounded set — well under the 9k static-page
// budget. When HI lands (PR-2) we'll widen to 24. Other locales return
// notFound() in this PR so we don't pollute the index with thin
// translations.
// ──────────────────────────────────────────────────────────────

export function generateStaticParams(): Array<{ locale: string; sign: string }> {
  return SIGN_SLUGS.map(sign => ({ locale: 'en', sign }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; sign: string }> }): Promise<Metadata> {
  const { locale, sign } = await params;
  setRequestLocale(locale);

  // Case-insensitive slug lookup (Gemini #243): users / external links
  // hitting /kundali/lagna/Leo or /Aries should still resolve. Canonical
  // URL is always emitted in lowercase below.
  const id = SIGN_SLUG_TO_ID[sign.toLowerCase()];
  if (!id) return { title: 'Kundali — Dekho Panchang' };
  const rashi = RASHIS.find(r => r.id === id);
  if (!rashi) return { title: 'Kundali — Dekho Panchang' };

  // Canonical URL is always the EN page — only EN content ships in PR-1.
  // Non-EN locales render the same EN content but flagged `noindex` so
  // search engines don't see thin translations.
  const canonicalUrl = `${BASE_URL}/en/kundali/lagna/${sign}`;
  const en = rashi.name.en;
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what an EN reader searches when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);
  const isEn = locale === 'en';

  return {
    title: `${en} Ascendant (${sanskrit} Lagna) — Personality, Career, Marriage`,
    description: `${en} ascendant in Vedic astrology: complete guide to personality, career, health, relationships, finances, and spiritual path. Ruling planet ${rashi.rulerName.en}, ${rashi.element.en.toLowerCase()} element, ${rashi.quality.en.toLowerCase()} sign.`,
    keywords: [
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
    ],
    // PR-1 ships EN content only. Non-EN locales return 200 with the EN
    // content but `index: false` so they don't enter the SERP — keeps
    // hreflang honest (every locale URL resolves) without polluting the
    // index with thin/duplicate translations. PR-2 flips HI to
    // indexable when translations land.
    robots: isEn
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
      // buildHreflangMap iterates visibleLocales — satisfies the SEO
      // invariant test and keeps hreflang in sync if locales change.
      languages: buildHreflangMap(`/kundali/lagna/${sign}`),
    },
    openGraph: {
      title: `${en} Ascendant (${sanskrit} Lagna) — Vedic Astrology Guide`,
      description: `Complete ${en} ascendant guide: personality, career, marriage, health, finances, and remedies. Ruled by ${rashi.rulerName.en}.`,
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

function buildPlanetDignitiesForLagna(lagnaId: number): {
  exaltedInChart: Array<{ planet: string; sign: string }>;
  debilitatedInChart: Array<{ planet: string; sign: string }>;
  rulerHouse: Record<string, number>;
} {
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
      exaltedInChart.push({ planet: PLANET_NAMES_EN[pid], sign: `${exRashi.name.en} (house ${house})` });
    }
    if (debRashi) {
      const house = ((debSign - lagnaId + 12) % 12) + 1;
      debilitatedInChart.push({ planet: PLANET_NAMES_EN[pid], sign: `${debRashi.name.en} (house ${house})` });
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
  const id = SIGN_SLUG_TO_ID[sign.toLowerCase()];
  if (!id) notFound();
  const rashi = RASHIS.find(r => r.id === id);
  if (!rashi) notFound();
  const deep = LAGNA_DEEP[id];
  if (!deep) notFound();

  const en = rashi.name.en;
  // Latin transliteration of the Sanskrit name (e.g. "Simha" for Leo).
  // RASHIS uses Sanskrit slugs as-is — capitalise for display. This is
  // what an EN reader searches when they type "simha lagna".
  const sanskrit = rashi.slug.charAt(0).toUpperCase() + rashi.slug.slice(1);
  const ruler = rashi.rulerName.en;
  const element = rashi.element.en;
  const quality = rashi.quality.en;

  const { exaltedInChart, debilitatedInChart, rulerHouse } = buildPlanetDignitiesForLagna(id);

  const sections: Section[] = [
    { heading: 'Personality', paragraph: deep.personality.en },
    { heading: 'Career', paragraph: deep.career.en },
    { heading: 'Health', paragraph: deep.health.en },
    { heading: 'Relationships & Marriage', paragraph: deep.relationships.en },
    { heading: 'Finances', paragraph: deep.finances.en },
    { heading: 'Spiritual Path', paragraph: deep.spiritual.en },
  ];

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-text-secondary mb-4" aria-label="Breadcrumb">
          <Link href={`/${locale}/kundali`} className="hover:text-gold-light">Kundali</Link>
          <span className="mx-1">·</span>
          <span>Lagna</span>
          <span className="mx-1">·</span>
          <span className="text-text-primary">{en} Ascendant</span>
        </nav>

        {/* H1 */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {en} Ascendant <span className="text-text-secondary">({sanskrit} Lagna)</span>
        </h1>

        {/* Sub-header chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {rashi.symbol} {en}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            Ruled by {ruler}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {element} · {quality}
          </span>
        </div>

        {/* SEO summary paragraph */}
        <p className="text-text-primary text-base mt-5 leading-relaxed">
          {en} ascendant (known as <strong>{sanskrit} Lagna</strong> in Sanskrit) is the {ordinal(id)} of the
          twelve rising signs in Vedic astrology. Your rising sign is the zodiac constellation that was on the
          eastern horizon at the moment of your birth, and it sets the entire framework of your birth chart —
          which planets rule which houses, which dashas activate which life themes, and what your natural
          tendencies will be. With <strong>{ruler}</strong> as your ascendant lord, the {element.toLowerCase()}{' '}
          element governs your temperament and the {quality.toLowerCase()} modality shapes how you engage
          with change.
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
            Exalted & Debilitated Planets in a {en} Chart
          </h2>
          <p className="text-text-primary text-sm leading-relaxed mb-4">
            Each planet has a sign in which it gives best results (exaltation) and one in which it struggles
            (debilitation). In your chart, those positions translate to specific houses based on the lagna.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gold-primary/12 p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">Exalted</h3>
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
              <h3 className="text-sm font-semibold text-red-400 mb-2">Debilitated</h3>
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
            Your Ascendant Lord: {ruler}
          </h2>
          <p className="text-text-primary leading-relaxed">
            {ruler} is the lord of your 1st house (the lagna itself) as the ruler of {en}. The condition of{' '}
            {ruler} in your birth chart — its sign, house, aspects, and conjunctions — has an outsized influence
            on your overall life direction, vitality, and identity. A well-placed {ruler} (in its own sign,
            moolatrikona, exaltation, or a friend's sign, with strong dignities) signals that the foundational
            promise of your {en} ascendant will manifest with relative ease. A weak or afflicted {ruler}{' '}
            indicates obstacles in actualising your natural strengths and points toward specific remedial
            practices.
          </p>
          {rulerHouse[ruler] !== undefined && (
            <p className="text-text-secondary text-sm mt-3">
              In addition to the 1st house, {ruler} naturally governs themes related to the{' '}
              {ordinal(rulerHouse[ruler])} house in your chart.
            </p>
          )}
        </section>

        {/* CTA to the chart-generator tool */}
        <section className="mt-12 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-6">
          <h2
            className="text-xl font-semibold text-gold-light mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            See This Lagna in Your Own Chart
          </h2>
          <p className="text-text-primary mb-4">
            Generate your full kundali to see whether {en} is your true ascendant, where {ruler} sits in your
            chart, and which yogas activate based on these positions. Free, no signup, Swiss Ephemeris precision.
          </p>
          <Link
            href={`/${locale}/kundali`}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors"
          >
            Generate My Kundali →
          </Link>
        </section>

        {/* Sibling lagna pages — internal-linking spine */}
        <nav className="mt-12" aria-label="All twelve ascendants">
          <h2
            className="text-base font-semibold text-text-secondary uppercase tracking-wider mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            All Twelve Ascendants
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {SIGN_SLUGS.map(s => {
              const r = RASHIS.find(rr => rr.id === SIGN_SLUG_TO_ID[s]);
              if (!r) return null;
              const isCurrent = s === sign;
              return (
                <li key={s}>
                  {isCurrent ? (
                    <span className="block px-3 py-2 rounded-lg bg-gold-primary/15 border border-gold-primary/40 text-gold-light">
                      {r.symbol} {r.name.en}
                    </span>
                  ) : (
                    <Link
                      href={`/${locale}/kundali/lagna/${s}`}
                      className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors"
                    >
                      {r.symbol} {r.name.en}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Related links footer */}
        <nav className="flex flex-wrap gap-2 mt-10 text-xs" aria-label="Related pages">
          <Link href={`/${locale}/kundali`} className="text-gold-primary/70 hover:text-gold-light">Generate Kundali</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/matching`} className="text-gold-primary/70 hover:text-gold-light">Kundali Matching</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/horoscope`} className="text-gold-primary/70 hover:text-gold-light">Daily Horoscope</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/${locale}/learn/kundali`} className="text-gold-primary/70 hover:text-gold-light">How to Read a Kundali</Link>
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

