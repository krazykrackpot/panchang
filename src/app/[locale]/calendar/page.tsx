import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import CalendarClient from './Client';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateFAQLD } from '@/lib/seo/faq-data';

export const revalidate = 86400;

import { BASE_URL } from '@/lib/seo/base-url';

// Ujjain reference location for the SSR "upcoming festivals" overview.
// Picked because it's the canonical 0° UT reference in many panchang
// traditions; the date list is approximate-to-Ujjain. The interactive
// client below computes location-accurate dates for the user's actual
// city. Audit 2026-05-25 §D2 (SSR fallback for Googlebot).
const UJJAIN = { lat: 23.1765, lng: 75.7885, tz: 'Asia/Kolkata' };

interface SSRFestivalRow {
  name: string;
  nameLocale: string;
  date: string;
  desc: string;
  descLocale: string;
  slug?: string;
  paksha?: 'shukla' | 'krishna';
}

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_HI = ['जन.', 'फर.', 'मार्च', 'अप्रै.', 'मई', 'जून', 'जुला.', 'अग.', 'सित.', 'अक्टू.', 'नव.', 'दिस.'];

function buildSsrFestivalList(locale: string, isHi: boolean): SSRFestivalRow[] {
  const year = new Date().getUTCFullYear();
  const todayISO = new Date().toISOString().slice(0, 10);
  // Generate this year's calendar then fall through to next year if we're
  // late in the year and only have a few entries left.
  let entries = generateFestivalCalendarV2(year, UJJAIN.lat, UJJAIN.lng, UJJAIN.tz)
    .filter(e => e.type === 'major' && e.date >= todayISO);
  if (entries.length < 12) {
    entries = entries.concat(
      generateFestivalCalendarV2(year + 1, UJJAIN.lat, UJJAIN.lng, UJJAIN.tz)
        .filter(e => e.type === 'major'),
    );
  }
  entries = entries.slice(0, 18);

  return entries.map((e): SSRFestivalRow => {
    const [yyyy, mm, dd] = e.date.split('-').map(Number);
    const m = MONTH_NAMES_EN[mm - 1];
    const mHi = MONTH_NAMES_HI[mm - 1];
    const dateStr = isHi ? `${dd} ${mHi} ${yyyy}` : `${dd} ${m} ${yyyy}`;
    const en = e.name.en ?? '';
    const hi = (e.name as Record<string, string | undefined>).hi ?? '';
    const descEn = e.description.en ?? '';
    const descHi = (e.description as Record<string, string | undefined>).hi ?? '';
    const localeName = (e.name as Record<string, string | undefined>)[locale];
    const localeDesc = (e.description as Record<string, string | undefined>)[locale];
    // Priority: exact locale → Hindi (only when active locale is Devanagari-
    // based, since the Devanagari script is the cognate fallback) → English.
    // Gemini #189 HIGH: previous code forced Hindi for sa/mr/mai even when
    // the entry had a specific sa/mr/mai translation, bypassing them.
    const nameOut = localeName || (isHi ? hi : '') || en;
    const descOut = localeDesc || (isHi ? descHi : '') || descEn;
    return {
      name: en,
      nameLocale: nameOut,
      date: dateStr,
      desc: descEn,
      descLocale: descOut,
      slug: e.slug,
      paksha: e.paksha,
    };
  });
}

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const festivalsList = buildSsrFestivalList(locale, isHi);

  // ItemList JSON-LD — gives Googlebot a machine-readable view of the
  // server-rendered festival list. Pairs with the BreadcrumbList /
  // CollectionPage LD that festivals/layout.tsx already emits. Audit §D2.
  // Gemini #189 MED — Google penalises structured-data / visible-content
  // mismatches. The visible page shows localised names + a localised list
  // heading, so the JSON-LD must do the same.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isHi ? 'आगामी प्रमुख त्योहार' : 'Upcoming Hindu Festivals',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: festivalsList.length,
    itemListElement: festivalsList.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.nameLocale,
      url: f.slug ? `${BASE_URL}/${locale}/calendar/${f.slug}` : `${BASE_URL}/${locale}/calendar`,
    })),
  };

  // Generic /calendar FAQ — was previously emitted from layout.tsx and
  // cascaded onto every regional sub-page (duplicate-FAQPage Rich Results
  // ERROR on Bengali, Gujarati, etc.). Emitting only here, on the /calendar
  // landing route, keeps the FAQ for this page and removes the duplicate
  // on sub-pages that own their own FAQ content.
  const faqLD = generateFAQLD('/calendar', locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListLd) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {/* Intro title + the two explanatory paragraphs are wrapped in
              a native <details> so visitors can collapse the explainer
              once they know what the calendar is. Default-closed because
              repeat users don't need to re-read it on every visit; the
              summary keeps the H2 visible for SEO + first-time context.
              Server-rendered <details> means the content is still in the
              HTML for Google to crawl. */}
          <details className="group">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3">
              <h2 className="text-gold-light text-xl font-bold">
                {isHi ? 'हिन्दू त्योहार कैलेंडर 2026' : 'Hindu Festival Calendar 2026'}
              </h2>
              <span aria-hidden="true" className="text-gold-primary/60 text-sm shrink-0 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="space-y-4 mt-4">
              {isHi ? (<>
                <p>हिन्दू कैलेंडर (पंचांग) चन्द्र-सौर प्रणाली पर आधारित है जिसमें मास, तिथि, नक्षत्र, योग और करण पाँच अंगों से मिलकर बनते हैं। प्रत्येक त्योहार और व्रत की तिथि चन्द्रमा की कला (तिथि) और मास (अमान्त या पूर्णिमान्त) से निर्धारित होती है। यही कारण है कि ग्रेगोरियन कैलेंडर पर तारीखें प्रतिवर्ष बदलती हैं।</p>
                <p>यह कैलेंडर आपके स्थान के अनुसार सटीक तिथि, एकादशी पारण समय, पूर्णिमा, अमावस्या, चतुर्थी, प्रदोष और ग्रहण सहित सम्पूर्ण पंचांग प्रदान करता है। प्रत्येक त्योहार पर क्लिक करें &mdash; विस्तृत विधि, महत्व और पूजा पद्धति देखें।</p>
              </>) : (<>
                <p>The Hindu calendar (Panchang) follows a lunisolar system where months, tithis (lunar days), nakshatras (lunar mansions), yogas, and karanas form the five limbs of timekeeping. Every festival and vrat date is determined by the Moon&apos;s phase (tithi) and the lunar month (Amanta or Purnimanta convention), which is why Gregorian dates shift each year.</p>
                <p>This calendar provides location-accurate dates for all major festivals, Ekadashi fasting days with Parana (fast-breaking) times, Purnima, Amavasya, Chaturthi, Pradosham, and eclipses. Click on any festival to see detailed puja vidhi, significance, and observance instructions.</p>
              </>)}
            </div>
          </details>

          {isHi ? (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">कैलेंडर की विशेषताएँ</h3>
            <p>हमारा कैलेंडर स्थान-आधारित है &mdash; सभी तिथि समय, सूर्योदय/सूर्यास्त, और एकादशी पारण खिड़कियाँ आपके शहर के अनुसार गणना की जाती हैं। आप पश्चिमी मास (जनवरी-दिसम्बर), हिन्दू चन्द्र मास (चैत्र-फाल्गुन), या तिथि ग्रिड दृश्य में देख सकते हैं। फ़िल्टर करें: केवल त्योहार, एकादशी, पूर्णिमा, अमावस्या, चतुर्थी, प्रदोष, या ग्रहण। ICS निर्यात से अपने Apple/Google कैलेंडर में जोड़ें।</p>
            <h3 className="text-gold-light text-lg font-bold mt-6">क्षेत्रीय पंचांग परम्पराएँ</h3>
            <p>भारत में एक ही मानक पंचांग नहीं है। <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">बंगाली कैलेंडर (बंगाब्द)</Link> सौर पद्धति से चलता है और बोइशाख से वर्ष आरम्भ होता है। <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">तमिल पंचांग (तिरुवल्लुवर)</Link> भी सौर है और चित्तिरै (मेष संक्रान्ति) से शुरू होता है। <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">गुजराती पंचांग (विक्रम संवत)</Link> अनूठा है — इसका नववर्ष (बेस्तु वरस) दीपावली के अगले दिन कार्तिक शुक्ल प्रतिपदा से आरम्भ होता है। तेलुगु, कन्नड़, मराठी और ओड़िया पंचांग चान्द्र-सौर (लूनिसोलर) पद्धति से चलते हैं। इन सभी क्षेत्रीय परम्पराओं की विस्तृत जानकारी, मास-नाम और प्रमुख त्योहार <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">क्षेत्रीय पंचांग पृष्ठ</Link> पर देखें।</p>
          </>) : (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">Calendar Features</h3>
            <p>Our calendar is location-aware &mdash; all tithi timings, sunrise/sunset, and Ekadashi Parana windows are computed for your city. Switch between Western months (January&ndash;December), Hindu lunar months (Chaitra&ndash;Phalguna), or a visual Tithi Grid view. Filter by category: festivals only, Ekadashi, Purnima, Amavasya, Chaturthi, Pradosham, or eclipses. Export to your Apple or Google Calendar via ICS download.</p>
            <h3 className="text-gold-light text-lg font-bold mt-6">Regional Calendar Traditions</h3>
            <p>India does not follow a single uniform calendar. The <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">Bengali calendar (Bangabda)</Link> is solar and starts its year with Boishakh (around April 14). The <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">Tamil calendar (Thiruvalluvar)</Link> is also solar, beginning the year with Chithirai at Mesha Sankranti. The <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">Gujarati calendar (Vikram Samvat)</Link> is uniquely lunisolar and starts its new year (Bestu Varas) the day after Diwali on Kartik Shukla Pratipada. Telugu, Kannada, Marathi, and Odia calendars follow the lunisolar Amanta system beginning with Chaitra. See month names, new year dates, and key regional festivals for all traditions on our <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">Regional Calendars page</Link>.</p>
          </>)}

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/panchang`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'आज का पंचांग →' : "Today’s Panchang →"}</Link>
            <Link href={`/${locale}/learn/tithis`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'तिथियों के बारे में जानें →' : 'Learn about Tithis →'}</Link>
            <Link href={`/${locale}/learn/muhurtas`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'मुहूर्त सीखें →' : 'Learn about Muhurtas →'}</Link>
            <Link href={`/${locale}/vedic-time`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'वैदिक समय →' : 'Vedic Time →'}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <CalendarClient />

      {/* ── Upcoming Major Festivals (moved to page end per UX) ──
          The interactive calendar above is the primary surface; the
          static list below is a quick-glance secondary view for users
          who want a list rather than a grid. Dynamically generated from
          generateFestivalCalendarV2 (Ujjain reference), updates daily
          via revalidate. Audit §D2. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4">
          <h2 className="text-gold-light text-xl font-bold">
            {isHi ? 'आगामी प्रमुख त्योहार' : 'Upcoming Major Festivals'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'तिथि' : 'Date'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'विवरण' : 'Description'}</th>
                </tr>
              </thead>
              <tbody>
                {festivalsList.map((f, i) => (
                  <tr key={i} className="border-b border-gold-primary/5">
                    <td className="py-1.5 px-3 text-gold-light font-medium whitespace-nowrap">
                      {f.slug ? (
                        <Link href={`/${locale}/calendar/${f.slug}`} className="hover:text-gold-primary transition-colors">{f.nameLocale}</Link>
                      ) : f.nameLocale}
                    </td>
                    <td className="py-1.5 px-3 text-text-primary whitespace-nowrap">{f.date}</td>
                    <td className="py-1.5 px-3 text-text-secondary text-xs">{f.descLocale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary/60 mt-2">
            {isHi
              ? '* तारीखें उज्जैन (भारतीय मानक) के लिए हैं। अपने शहर की सटीक तिथि के लिए ऊपर दिए गए कैलेंडर में स्थान चुनें।'
              : '* Dates are computed for Ujjain (Indian reference). Use the location selector in the calendar above for your city’s exact timings.'}
          </p>
        </article>
      </section>
    </>
  );
}
