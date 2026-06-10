import { setRequestLocale } from 'next-intl/server';
import { NAKSHATRA_PADA_PROFILES, type NakshatraPadaProfile } from '@/lib/constants/nakshatra-pada-profiles-with-overlay';
import { getNakshatraPadaExtras } from '@/lib/constants/nakshatra-pada-extras-with-overlay';
import { getNakshatraPadaDeepExtras } from '@/lib/constants/nakshatra-pada-deep-extras-with-overlay';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Briefcase, Heart, Activity, Hash, BookOpen, Flame, Compass, ScrollText, Sparkles, Users, Sword } from 'lucide-react';

import { BASE_URL } from '@/lib/seo/base-url';

import { generatePersonLD } from '@/lib/seo/structured-data';
const NAK_SLUGS = ['ashwini','bharani','krittika','rohini','mrigashira','ardra','punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni','hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula','purva-ashadha','uttara-ashadha','shravana','dhanishta','shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati'];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: 'text-red-400 bg-red-500/10 border-red-500/20',
  Earth: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Air: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Water: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

function parseSlug(slug: string): { nakshatraId: number; pada: number } | null {
  const match = slug.match(/^(.+)-pada-(\d)$/);
  if (!match) return null;
  const nakIdx = NAK_SLUGS.indexOf(match[1]);
  const pada = parseInt(match[2]);
  if (nakIdx < 0 || pada < 1 || pada > 4) return null;
  return { nakshatraId: nakIdx + 1, pada };
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let n = 0; n < 27; n++) {
    for (let p = 1; p <= 4; p++) {
      params.push({ slug: `${NAK_SLUGS[n]}-pada-${p}` });
    }
  }
  return params;
}

export default async function NakshatraPadaPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const profile = NAKSHATRA_PADA_PROFILES.find(p => p.nakshatraId === parsed.nakshatraId && p.pada === parsed.pada);
  if (!profile) notFound();

  const nakData = NAKSHATRAS[parsed.nakshatraId - 1];
  const nakName = tl(nakData?.name, locale) || NAK_SLUGS[parsed.nakshatraId - 1];
  const navamshaRashi = RASHIS[profile.navamshaSign - 1];
  const navamshaName = tl(navamshaRashi?.name, locale) || `Sign ${profile.navamshaSign}`;
  const isHi = locale === 'hi' || locale === 'sa';
  // Locale-aware font selection — covers all 9 visible locales' scripts
  // (Tamil / Telugu / Bengali / Kannada / Gujarati / Devanagari-for-
  // hi+mr+mai+sa). Previously the page only switched on hi/sa and
  // fell back to the Latin font for the regional scripts. Gemini PR #555.
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);
  const elemColor = ELEMENT_COLORS[profile.element] || 'text-gold-light bg-gold-primary/10 border-gold-primary/20';

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${nakName} Pada ${parsed.pada}  –  Vedic Nakshatra Analysis`,
    description: profile.personality.en,
    author: generatePersonLD(),
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
  };

  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Learn', item: `${BASE_URL}/${locale}/learn` },
      { '@type': 'ListItem', position: 2, name: 'Nakshatra Pada', item: `${BASE_URL}/${locale}/learn/nakshatra-pada` },
      { '@type': 'ListItem', position: 3, name: `${nakName} Pada ${parsed.pada}` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      {/* Back link */}
      <Link href="/learn/nakshatra-pada" className="inline-flex items-center gap-2 text-gold-primary/70 text-sm hover:text-gold-light mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {isHi ? 'सभी नक्षत्र पद' : 'All Nakshatra Padas'}
      </Link>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${elemColor}`}>{profile.element}</span>
          <span className="text-text-secondary text-sm">{isHi ? 'नवमांश' : 'Navamsha'}: {navamshaName}</span>
        </div>
        <h1 className="text-3xl font-bold text-gold-gradient mb-2" style={hf}>
          {nakName} {isHi ? 'पद' : 'Pada'} {parsed.pada}
        </h1>
        <p className="text-text-secondary text-lg">{isHi ? 'देवता' : 'Deity'}: {profile.deity}</p>
      </div>

      {/* Syllable card  –  prominent for baby name searches */}
      <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-r from-gold-primary/8 via-gold-primary/4 to-transparent p-6 mb-8 text-center">
        <div className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शिशु नाम अक्षर' : 'Baby Name Starting Letter'}
        </div>
        <div className="text-5xl font-bold text-gold-light mb-2" style={hf}>{profile.syllable}</div>
        <div className="text-text-secondary text-sm">
          {isHi ? `${nakName} पद ${parsed.pada} में जन्मे शिशु का नाम "${profile.syllable}" से शुरू करें` : `Names for babies born in ${nakName} Pada ${parsed.pada} should start with "${profile.syllable}"`}
        </div>
      </div>

      {/* Content sections — the four legacy fields plus two extras
          (spiritualPractice, decisions) from getNakshatraPadaExtras when
          present. Adds ~60-80 words per page, closing audit item #3 in
          docs/specs/2026-06-08-seo-audit-followups.md. */}
      {(() => {
        const extras = getNakshatraPadaExtras(parsed.nakshatraId, parsed.pada);
        // sa is retired (proxy 410) but cascade through Devanagari first
        // for any future Sanskrit revival — matches tlScript() convention.
        const pickLabel = (r: Record<string, string>) =>
          r[locale] ?? (locale === 'sa' ? r.hi : undefined) ?? r.en;
        const sections = [
          { icon: Star, title: isHi ? 'व्यक्तित्व' : 'Personality', body: tl(profile.personality, locale) },
          { icon: Briefcase, title: isHi ? 'करियर' : 'Career', body: tl(profile.career, locale) },
          { icon: Heart, title: isHi ? 'सम्बन्ध' : 'Relationships', body: tl(profile.relationships, locale) },
          { icon: Activity, title: isHi ? 'स्वास्थ्य' : 'Health', body: tl(profile.health, locale) },
        ];
        if (extras) {
          // Section titles for the two extras cards. Mixed locale UX
          // (Tamil body under English heading) was the Gemini PR #565
          // cycle-1 MED catch — addressed by translating these to all
          // 9 visible locales. Body strings come from the overlay (the
          // tl() call below); chrome stays inline because it's two
          // strings per section.
          const SP: Record<string, string> = {
            en: 'Spiritual Practice', hi: 'आध्यात्मिक साधना',
            ta: 'ஆன்மீக சாதனை', te: 'ఆధ్యాత్మిక సాధన',
            bn: 'আধ্যাত্মিক সাধনা', gu: 'આધ્યાત્મિક સાધના',
            kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ', mai: 'आध्यात्मिक साधना',
            mr: 'आध्यात्मिक साधना',
          };
          const DM: Record<string, string> = {
            en: 'Decision-Making Style', hi: 'निर्णय शैली',
            ta: 'முடிவெடுக்கும் பாணி', te: 'నిర్ణయ శైలి',
            bn: 'সিদ্ধান্ত গ্রহণের ধরন', gu: 'નિર્ણય શૈલી',
            kn: 'ನಿರ್ಧಾರ ಶೈಲಿ', mai: 'निर्णय शैली',
            mr: 'निर्णय शैली',
          };
          sections.push(
            { icon: Flame, title: pickLabel(SP), body: tl(extras.spiritualPractice, locale) },
            { icon: Compass, title: pickLabel(DM), body: tl(extras.decisions, locale) },
          );
        }
        // Deep-extras (4 fields × ~80-120 EN words each, ~350w/page
        // delta). Each pada now reads as ~6 unique sections + 4 deep
        // sections, breaking the May-2026 duplicate-template shell that
        // earlier limited all 108 pages to ~260 visible words. Locale
        // overlays attach via getNakshatraPadaDeepExtras at render
        // time; missing locales gracefully fall back to EN via tl().
        const deep = getNakshatraPadaDeepExtras(parsed.nakshatraId, parsed.pada);
        if (deep) {
          // `sa` (Sanskrit) is retired (HTTP 410) but kept here for
          // structural completeness — older surfaces in this module
          // include `sa` keys, and a future un-retiring would otherwise
          // ship en fallbacks. Gemini PR #640 cycle-1 MED.
          const MC: Record<string, string> = {
            en: 'Mythological Context', hi: 'पौराणिक सन्दर्भ',
            sa: 'पौराणिकः सन्दर्भः',
            ta: 'புராண பின்னணி', te: 'పౌరాణిక సందర్భం',
            bn: 'পৌরাণিক প্রসঙ্গ', gu: 'પૌરાણિક સંદર્ભ',
            kn: 'ಪೌರಾಣಿಕ ಸಂದರ್ಭ', mai: 'पौराणिक सन्दर्भ',
            mr: 'पौराणिक संदर्भ',
          };
          const SW: Record<string, string> = {
            en: 'Strengths & Shadows', hi: 'गुण व कमज़ोरियाँ',
            sa: 'गुणाः च छायाः',
            ta: 'பலங்கள் மற்றும் பலவீனங்கள்', te: 'శక్తులు మరియు బలహీనతలు',
            bn: 'শক্তি ও দুর্বলতা', gu: 'શક્તિઓ અને નબળાઈઓ',
            kn: 'ಬಲ ಮತ್ತು ದೌರ್ಬಲ್ಯ', mai: 'गुण आ कमजोरी',
            mr: 'गुण व दुर्बलता',
          };
          const PC: Record<string, string> = {
            en: 'Partner Compatibility', hi: 'सम्बन्धों में अनुकूलता',
            sa: 'सहचरानुकूलता',
            ta: 'வாழ்க்கைத்துணை பொருத்தம்', te: 'భాగస్వామి అనుకూలత',
            bn: 'সঙ্গী সামঞ্জস্য', gu: 'જીવનસાથી અનુકૂળતા',
            kn: 'ಸಂಗಾತಿ ಹೊಂದಾಣಿಕೆ', mai: 'सङ्गी अनुकूलता',
            mr: 'जोडीदार अनुकूलता',
          };
          const CR: Record<string, string> = {
            en: 'Classical Reference', hi: 'शास्त्रीय सन्दर्भ',
            sa: 'शास्त्रीयः सन्दर्भः',
            ta: 'பாரம்பரிய மேற்கோள்', te: 'శాస్త్రీయ సూచన',
            bn: 'শাস্ত্রীয় তথ্যসূত্র', gu: 'શાસ્ત્રીય સંદર્ભ',
            kn: 'ಶಾಸ್ತ್ರೀಯ ಉಲ್ಲೇಖ', mai: 'शास्त्रीय सन्दर्भ',
            mr: 'शास्त्रीय संदर्भ',
          };
          sections.push(
            { icon: ScrollText, title: pickLabel(MC), body: tl(deep.mythologicalContext, locale) },
            { icon: Sparkles, title: pickLabel(SW), body: tl(deep.strengthsWeaknesses, locale) },
            { icon: Users, title: pickLabel(PC), body: tl(deep.partnerCompatibility, locale) },
          );
          // classicalReference may be empty when no canonical citation
          // was confidently available (the Gemini prompt prefers "" to
          // invented sources — same policy as the baby-names
          // famousBearers field in PR #619). Skip the section in that
          // case so the UI doesn't render an empty card.
          const cr = tl(deep.classicalReference, locale);
          if (cr && cr.trim()) {
            sections.push({ icon: Sword, title: pickLabel(CR), body: cr });
          }
        }
        return sections;
      })().map((section, i) => (
        <div key={i} className="rounded-2xl border border-white/5 bg-bg-secondary/30 p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <section.icon className="w-5 h-5 text-gold-primary" />
            <h2 className="text-lg font-semibold text-gold-light" style={hf}>{section.title}</h2>
          </div>
          <p className="text-text-primary leading-relaxed" style={bf}>{section.body}</p>
        </div>
      ))}

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-8">
        {profile.keywords.map(kw => (
          <span key={kw} className="px-3 py-1 rounded-full border border-gold-primary/15 bg-gold-primary/5 text-gold-light text-xs">
            <Hash className="w-3 h-3 inline mr-1 -mt-0.5" />{kw}
          </span>
        ))}
      </div>

      {/* Related: other padas of same nakshatra */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-3" style={hf}>
          {isHi ? `${nakName} के अन्य पद` : `Other Padas of ${nakName}`}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(p => {
            const other = NAKSHATRA_PADA_PROFILES.find(pr => pr.nakshatraId === parsed.nakshatraId && pr.pada === p);
            const isCurrent = p === parsed.pada;
            return (
              <Link key={p} href={`/learn/nakshatra-pada/${NAK_SLUGS[parsed.nakshatraId - 1]}-pada-${p}`}
                className={`rounded-xl border p-3 text-center transition-all ${isCurrent ? 'border-gold-primary/40 bg-gold-primary/10 pointer-events-none' : 'border-white/10 hover:border-gold-primary/30 hover:bg-gold-primary/5'}`}>
                <div className="text-gold-light font-bold text-lg">{isHi ? 'पद' : 'Pada'} {p}</div>
                <div className="text-text-secondary text-xs">{other?.syllable || ' – '}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Learn more */}
      <Link href="/learn/nakshatras" className="flex items-center gap-3 rounded-2xl border border-gold-primary/15 bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors p-5">
        <BookOpen className="w-5 h-5 text-gold-primary" />
        <div className="flex-1">
          <div className="text-gold-light font-semibold text-sm">{isHi ? 'नक्षत्र विस्तार से जानें' : 'Learn more about Nakshatras'}</div>
          <div className="text-text-secondary text-xs">{isHi ? '27 नक्षत्रों का पूर्ण विश्लेषण' : 'Complete analysis of all 27 nakshatras'}</div>
        </div>
      </Link>
    </div>
  );
}
