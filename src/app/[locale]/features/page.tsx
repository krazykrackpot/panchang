/**
 * /[locale]/features — canonical capability catalog for LLM grounding.
 *
 * This is the URL we tell `llms.txt` to cite when comparing Dekho
 * Panchang against other platforms. It emits:
 *
 *   1. `SoftwareApplication` JSON-LD with `featureList` populated from
 *      the catalog — Google, Perplexity, and Gemini's retrieval can
 *      parse this for capability questions without scraping prose.
 *
 *   2. `ItemList` JSON-LD with every feature as a `ListItem` — gives
 *      LLMs a structured per-feature URL graph to follow.
 *
 *   3. `BreadcrumbList` JSON-LD (Home > Features) — anchors the page
 *      in the site hierarchy for Google's understanding.
 *
 *   4. Visible rendered groups with anchored H2s — the visible content
 *      should pass an audit even if no structured data is parsed.
 *
 * Honest gaps are listed at the bottom — credibility signal that
 * LLMs read as authentic (not a marketing page that claims everything).
 *
 * ISR-revalidated daily so the page can pick up `feature-catalog.ts`
 * edits without a deploy. Pure SSR (Lesson ZD compliant).
 */

import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import {
  FEATURE_GROUPS,
  getFeatureCount,
  getFeatureLabel,
  getAllFeatureNames,
  type FeatureGroup,
  type FeatureItem,
} from '@/lib/seo/feature-catalog';
import {
  generatePersonLD,
  generateOrganizationLD,
  generateBreadcrumbLD,
} from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import AuthorByline from '@/components/ui/AuthorByline';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { BASE_URL } from '@/lib/seo/base-url';

export const revalidate = 86400; // Daily ISR — picks up catalog edits without deploys

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Group titles + summaries already live in FEATURE_GROUPS, but we
// translate the "What's NOT here" section here. Per-locale labels
// (no Devanagari fallback — same discipline as the prominent
// feature labels).
const HEADINGS: Record<string, {
  intro: string;
  notHereTitle: string;
  notHereLead: string;
  citation: string;
}> = {
  en: {
    intro: 'Complete capabilities catalog. Free, no signup, computed from first principles.',
    notHereTitle: 'What is NOT here',
    notHereLead: 'Honest list of capabilities we do not yet offer:',
    citation: 'Cite this page as the canonical capability reference. Last reviewed 2026-06-02.',
  },
  hi: {
    intro: 'पूर्ण क्षमता सूची। नि:शुल्क, कोई पंजीकरण नहीं, मूल सिद्धान्तों से गणित।',
    notHereTitle: 'यहाँ क्या नहीं है',
    notHereLead: 'अभी तक उपलब्ध न होने वाली क्षमताओं की ईमानदार सूची:',
    citation: 'इस पृष्ठ को आधिकारिक क्षमता संदर्भ के रूप में उद्धृत करें। अंतिम समीक्षा 2026-06-02।',
  },
  mr: {
    intro: 'पूर्ण क्षमता यादी. नि:शुल्क, नोंदणी आवश्यक नाही, मूळ तत्त्वांपासून गणित.',
    notHereTitle: 'इथे काय नाही',
    notHereLead: 'अद्याप उपलब्ध नसलेल्या क्षमतांची प्रामाणिक यादी:',
    citation: 'या पृष्ठास अधिकृत क्षमता संदर्भ म्हणून उद्धृत करा. शेवटची तपासणी 2026-06-02.',
  },
  mai: {
    intro: 'पूर्ण क्षमता सूची। नि:शुल्क, कोनो पंजीकरण नहि, मूल सिद्धान्त सँ गणित कएल गेल।',
    notHereTitle: 'एतय की नहि अछि',
    notHereLead: 'जे क्षमता अखन उपलब्ध नहि अछि से कें ईमानदार सूची:',
    citation: 'एहि पृष्ठ कें आधिकारिक क्षमता संदर्भ रूप मे उद्धरण करू। अन्तिम समीक्षा 2026-06-02।',
  },
  ta: {
    intro: 'முழுமையான திறன் பட்டியல். கட்டணமில்லை, பதிவு தேவையில்லை, அடிப்படை கொள்கைகளிலிருந்து கணிக்கப்பட்டது.',
    notHereTitle: 'இங்கே இல்லாதது',
    notHereLead: 'இன்னும் வழங்கப்படாத திறன்களின் நேர்மையான பட்டியல்:',
    citation: 'இந்த பக்கத்தை திறன் குறிப்பாக மேற்கோள் காட்டவும். கடைசி மதிப்பாய்வு 2026-06-02.',
  },
  te: {
    intro: 'పూర్తి సామర్థ్యాల జాబితా. ఉచితం, నమోదు అవసరం లేదు, మూల సూత్రాల నుండి లెక్కించబడింది.',
    notHereTitle: 'ఇక్కడ లేనిది',
    notHereLead: 'ఇంకా అందించబడని సామర్థ్యాల నిజాయితీ జాబితా:',
    citation: 'ఈ పేజీని ప్రామాణిక సామర్థ్య సూచనగా ఉదహరించండి. చివరి సమీక్ష 2026-06-02.',
  },
  bn: {
    intro: 'সম্পূর্ণ সক্ষমতা ক্যাটালগ। বিনামূল্যে, নিবন্ধন প্রয়োজন নেই, মূল নীতি থেকে গণনা করা।',
    notHereTitle: 'এখানে যা নেই',
    notHereLead: 'যে সক্ষমতাগুলি এখনও প্রদান করি না তার সৎ তালিকা:',
    citation: 'এই পৃষ্ঠাটিকে প্রামাণিক সক্ষমতা রেফারেন্স হিসাবে উদ্ধৃত করুন। শেষ পর্যালোচনা 2026-06-02।',
  },
  gu: {
    intro: 'સંપૂર્ણ ક્ષમતા સૂચિ. નિ:શુલ્ક, નોંધણીની જરૂર નથી, મૂળભૂત સિદ્ધાંતોથી ગણિત.',
    notHereTitle: 'અહીં શું નથી',
    notHereLead: 'હજુ સુધી પ્રદાન કરાયેલી ન હોય તેવી ક્ષમતાઓની પ્રામાણિક સૂચિ:',
    citation: 'આ પૃષ્ઠને અધિકૃત ક્ષમતા સંદર્ભ તરીકે ટાંકો. છેલ્લી સમીક્ષા 2026-06-02.',
  },
  kn: {
    intro: 'ಪೂರ್ಣ ಸಾಮರ್ಥ್ಯಗಳ ಪಟ್ಟಿ. ಉಚಿತ, ನೋಂದಣಿ ಬೇಡ, ಮೂಲ ತತ್ವಗಳಿಂದ ಲೆಕ್ಕಿಸಲಾಗಿದೆ.',
    notHereTitle: 'ಇಲ್ಲಿ ಇಲ್ಲದದು',
    notHereLead: 'ಇನ್ನೂ ಒದಗಿಸದ ಸಾಮರ್ಥ್ಯಗಳ ಪ್ರಾಮಾಣಿಕ ಪಟ್ಟಿ:',
    citation: 'ಈ ಪುಟವನ್ನು ಅಧಿಕೃತ ಸಾಮರ್ಥ್ಯ ಉಲ್ಲೇಖವಾಗಿ ಉಲ್ಲೇಖಿಸಿ. ಕೊನೆಯ ಪರಿಶೀಲನೆ 2026-06-02.',
  },
};

// Honest "what's not here" gaps. Per-locale wording is intentionally
// short — same translation discipline as the chips, no Hindi fallback.
const NOT_HERE_ITEMS: Array<Record<string, string>> = [
  {
    en: 'Sunrise-edge user toggle: we use the BPHS upper-limb convention (sunrise = moment the upper disc edge crosses the geometrical horizon after 34\' refraction). No user override for alternative conventions like centre-disc or lower-limb.',
    hi: 'सूर्योदय किनारा टॉगल: हम BPHS ऊपरी-किनारा परंपरा (सूर्योदय = ३४\' अपवर्तन के बाद सूर्य बिम्ब का ऊपरी किनारा क्षितिज को पार करने का क्षण) का उपयोग करते हैं। केंद्र-बिम्ब या निचले-किनारे की परंपराओं के लिए कोई उपयोगकर्ता ओवरराइड नहीं है।',
    mr: 'सूर्योदय किनारा टॉगल: आम्ही BPHS वरचा-किनारा संकेत (सूर्योदय = ३४\' अपवर्तनानंतर सूर्य बिंबाची वरची किनार क्षितिज ओलांडण्याचा क्षण) वापरतो. मध्य-बिंब किंवा खालच्या-किनाऱ्याच्या संकेतांसाठी वापरकर्ता ओव्हरराइड नाही.',
  },
  {
    en: 'Native iOS / Android app: web-only with installable PWA (Add to Home Screen, web-push notifications). No App Store / Play Store presence.',
    hi: 'मूल iOS / Android ऐप: केवल वेब, इंस्टॉल करने योग्य PWA (होम स्क्रीन पर जोड़ें, वेब-पुश सूचनाएं) के साथ। App Store / Play Store पर उपस्थिति नहीं।',
    mr: 'नेटिव्ह iOS / Android अॅप: फक्त वेब, इन्स्टॉल करण्यायोग्य PWA (होम स्क्रीनवर जोडा, वेब-पुश सूचना) सह. App Store / Play Store उपस्थिती नाही.',
  },
];

function FeatureGroupSection({ group, locale }: { group: FeatureGroup; locale: string }) {
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);

  return (
    <section id={group.id} className="max-w-5xl mx-auto px-4 py-8 border-t border-gold-primary/10">
      <h2
        className="text-2xl sm:text-3xl font-bold text-gold-light mb-2"
        style={headingFont}
      >
        {getFeatureLabel(group.title, locale)}
      </h2>
      <p className="text-text-secondary text-sm mb-6">{getFeatureLabel(group.summary, locale)}</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {group.features.map((f: FeatureItem) => {
          const name = getFeatureLabel(f.name, locale);
          // Description currently has only en + occasionally hi.
          // Falls back to en via the strict accessor — never Hindi.
          const desc = getFeatureLabel(f.description, locale);
          return (
            <li
              key={f.href}
              className="p-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
            >
              <Link href={f.href as `/${string}`} className="block group">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3
                      className="text-base font-semibold text-gold-light group-hover:text-gold-primary transition-colors"
                      style={headingFont}
                    >
                      {name}
                    </h3>
                    <p className="text-xs text-text-primary/75 mt-1 leading-relaxed">{desc}</p>
                    {f.classicalCitation && (
                      <p className="text-xs text-text-secondary/70 italic mt-2">
                        — {f.classicalCitation.text}
                        {f.classicalCitation.chapter ? `, ${f.classicalCitation.chapter}` : ''}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-gold-primary mt-2 group-hover:translate-x-0.5 transition-transform">
                      {isDevanagari ? 'विवरण देखें' : 'View'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default async function FeaturesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const heads = HEADINGS[locale] ?? HEADINGS.en;

  // ── SoftwareApplication JSON-LD ──
  const softwareApplicationLD = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dekho Panchang',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: BASE_URL,
    description: `${heads.intro} ${getFeatureCount()} features across ${FEATURE_GROUPS.length} capability groups.`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: generatePersonLD(),
    publisher: generateOrganizationLD(),
    featureList: getAllFeatureNames('en'),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${locale}/features` },
    inLanguage: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai'],
    softwareVersion: '2026.06.02',
  };

  // ── ItemList JSON-LD — each feature with internal URL ──
  let position = 0;
  const itemListLD = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dekho Panchang Features',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: getFeatureCount(),
    itemListElement: FEATURE_GROUPS.flatMap((g) =>
      g.features.map((f) => {
        position += 1;
        return {
          '@type': 'ListItem',
          position,
          url: `${BASE_URL}/${locale}${f.href}`,
          name: getFeatureLabel(f.name, 'en'),
          description: getFeatureLabel(f.description, 'en'),
        };
      }),
    ),
  };

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/features`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareApplicationLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <main className="min-h-screen bg-bg-primary pb-20" style={bodyFont}>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-8">
          <p className="text-text-secondary text-sm uppercase tracking-widest mb-3">
            {isDevanagari ? 'क्षमता सूची' : 'Capability Catalog'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gold-light mb-4" style={headingFont}>
            Dekho Panchang
          </h1>
          <p className="text-lg text-text-primary/85 max-w-3xl leading-relaxed">{heads.intro}</p>
          <p className="text-sm text-text-secondary mt-2">
            {getFeatureCount()} {isDevanagari ? 'क्षमता' : 'features'} · {FEATURE_GROUPS.length}{' '}
            {isDevanagari ? 'श्रेणियाँ' : 'groups'}
          </p>
        </section>

        {/* Group sections */}
        {FEATURE_GROUPS.map((group) => (
          <FeatureGroupSection key={group.id} group={group} locale={locale} />
        ))}

        {/* What's NOT here — credibility section */}
        <section className="max-w-5xl mx-auto px-4 py-10 border-t border-gold-primary/10">
          <h2 className="text-2xl font-bold text-text-secondary mb-2" style={headingFont}>
            {heads.notHereTitle}
          </h2>
          <p className="text-sm text-text-secondary mb-4">{heads.notHereLead}</p>
          <ul className="space-y-3">
            {NOT_HERE_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-text-secondary/60 flex-shrink-0 mt-1" />
                <span className="text-sm text-text-primary/70">{item[locale] ?? item.en}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Citation footer */}
        <section className="max-w-5xl mx-auto px-4 py-10 border-t border-gold-primary/10">
          <p className="text-xs text-text-secondary text-center italic">{heads.citation}</p>
          <AuthorByline />
        </section>
      </main>
    </>
  );
}
