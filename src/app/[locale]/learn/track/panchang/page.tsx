'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import type { Locale } from '@/types/panchang';

type Tri = { en: string; hi: string; sa: string };
interface Section {
  id: string;
  icon: string;
  title: Tri;
  subtitle: Tri;
  modules: { id: string; title: Tri }[];
  refs: { label: Tri; href: string }[];
}

const SECTIONS: Section[] = [
  {
    id: 'tithi', icon: '\u{1F319}',
    title: { en: 'Tithi (Lunar Day)', hi: 'तिथि (चान्द्र दिन)', sa: 'तिथिः (चान्द्रदिनम्)' },
    subtitle: { en: 'The Moon-Sun Dance', hi: 'चन्द्र-सूर्य नृत्य', sa: 'चन्द्रसूर्यनृत्यम्' },
    modules: [
      { id: '5-1', title: { en: 'The Lunar Day \u2014 12\u00b0 Segments', hi: 'तिथि \u2014 12\u00b0 खण्ड', sa: 'तिथिः \u2014 12\u00b0 खण्डाः' } },
      { id: '5-2', title: { en: 'Paksha \u2014 Shukla & Krishna', hi: 'पक्ष \u2014 शुक्ल एवं कृष्ण', sa: 'पक्षः \u2014 शुक्लकृष्णौ' } },
      { id: '5-3', title: { en: 'Parana, Kshaya & Vriddhi Tithis', hi: 'पारण, क्षय एवं वृद्धि तिथि', sa: 'पारणं, क्षयवृद्धितिथयः' } },
    ],
    refs: [
      { label: { en: 'Tithis', hi: 'तिथियाँ', sa: 'तिथयः' }, href: '/learn/tithis' },
    ],
  },
  {
    id: 'nakshatra', icon: '\u2736',
    title: { en: 'Nakshatra in Panchang', hi: 'पंचांग में नक्षत्र', sa: 'पञ्चाङ्गे नक्षत्रम्' },
    subtitle: { en: 'The Daily Star', hi: 'दैनिक नक्षत्र', sa: 'दैनिकनक्षत्रम्' },
    modules: [
      { id: '6-1', title: { en: '27 Lunar Mansions', hi: '27 चन्द्र गृह', sa: '27 चन्द्रगृहाणि' } },
    ],
    refs: [
      { label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, href: '/learn/nakshatras' },
    ],
  },
  {
    id: 'yoga-karana-vara', icon: '\u262F',
    title: { en: 'Yoga, Karana & Vara', hi: 'योग, करण एवं वार', sa: 'योगः करणं वारश्च' },
    subtitle: { en: 'The Three Remaining Limbs', hi: 'तीन शेष अंग', sa: 'त्रीणि शेषाङ्गानि' },
    modules: [
      { id: '7-1', title: { en: 'Yoga \u2014 Sun + Moon Sum', hi: 'योग \u2014 सूर्य + चन्द्र योग', sa: 'योगः \u2014 सूर्यचन्द्रयोगः' } },
      { id: '7-2', title: { en: 'Karana \u2014 The Half-Tithi', hi: 'करण \u2014 अर्ध तिथि', sa: 'करणम् \u2014 अर्धतिथिः' } },
      { id: '7-3', title: { en: 'Vara & the Hora System', hi: 'वार एवं होरा पद्धति', sa: 'वारः होरापद्धतिश्च' } },
    ],
    refs: [
      { label: { en: 'Yogas', hi: 'योग', sa: 'योगाः' }, href: '/learn/yogas' },
      { label: { en: 'Karanas', hi: 'करण', sa: 'करणानि' }, href: '/learn/karanas' },
      { label: { en: 'Vara', hi: 'वार', sa: 'वारः' }, href: '/learn/vara' },
    ],
  },
  {
    id: 'muhurta', icon: '\u23F0',
    title: { en: 'Muhurta & Hora', hi: 'मुहूर्त एवं होरा', sa: 'मुहूर्तं होरा च' },
    subtitle: { en: 'Electional Timing', hi: 'शुभ समय चयन', sa: 'शुभसमयचयनम्' },
    modules: [
      { id: '8-1', title: { en: 'Five Limbs Together \u2014 Reading a Panchang', hi: 'पाँचों अंग \u2014 पञ्चाङ्ग पढ़ना', sa: 'पञ्चाङ्गानि \u2014 पञ्चाङ्गपठनम्' } },
      { id: '17-1', title: { en: 'The Science of Timing', hi: 'समय विज्ञान', sa: 'समयविज्ञानम्' } },
      { id: '17-2', title: { en: 'Marriage Muhurta', hi: 'विवाह मुहूर्त', sa: 'विवाहमुहूर्तम्' } },
      { id: '17-3', title: { en: 'Property & Travel', hi: 'गृह एवं यात्रा', sa: 'गृहं यात्रा च' } },
      { id: '17-4', title: { en: 'Education & Naming', hi: 'शिक्षा एवं नामकरण', sa: 'शिक्षा नामकरणं च' } },
    ],
    refs: [
      { label: { en: 'Muhurtas', hi: 'मुहूर्त', sa: 'मुहूर्ताः' }, href: '/learn/muhurtas' },
      { label: { en: 'Hora', hi: 'होरा', sa: 'होरा' }, href: '/learn/hora' },
    ],
  },
  {
    id: 'integration', icon: '\u{1F4D6}',
    title: { en: 'Panchang Integration', hi: 'पंचांग एकीकरण', sa: 'पञ्चाङ्गैकीकरणम्' },
    subtitle: { en: 'Putting It All Together', hi: 'सब कुछ एक साथ', sa: 'सर्वम् एकत्र' },
    modules: [
      { id: '0-4', title: { en: 'Reading Today\'s Panchang', hi: 'आज का पंचांग पढ़ना', sa: 'अद्यपञ्चाङ्गपठनम्' } },
    ],
    refs: [
      { label: { en: 'Masa', hi: 'मास', sa: 'मासः' }, href: '/learn/masa' },
      { label: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शिका', sa: 'गोचरमार्गदर्शिका' }, href: '/learn/transit-guide' },
    ],
  },
  {
    id: 'calendar', icon: '\u{1F4C5}',
    title: { en: 'Calendar & Festivals', hi: 'पंचांग एवं त्योहार', sa: 'पञ्चाङ्गम् उत्सवाश्च' },
    subtitle: { en: 'Living by the Stars', hi: 'तारों के अनुसार जीवन', sa: 'ताराणाम् अनुसारं जीवनम्' },
    modules: [],
    refs: [
      { label: { en: 'Festival Calendar', hi: 'त्योहार कैलेंडर', sa: 'उत्सवपञ्चाङ्गम्' }, href: '/calendar' },
      { label: { en: 'Cosmic Time Scales', hi: 'ब्रह्माण्डीय कालमान', sa: 'ब्रह्माण्डीयकालमानम्' }, href: '/learn/cosmology' },
    ],
  },
];

const L = {
  en: {
    badge: 'Track 2',
    title: 'Panchang \u2014 The Daily Practice',
    sub: 'Reading the cosmic weather that governs every day \u2014 Tithi, Nakshatra, Yoga, Karana, and Vara',
    startHere: 'Start Here',
    modules: 'modules',
    deepDive: 'Deep Dive',
    backToLearn: 'All Tracks',
    refsOnly: 'Reference pages only',
  },
  hi: {
    badge: 'ट्रैक 2',
    title: 'पंचांग \u2014 दैनिक अभ्यास',
    sub: 'प्रतिदिन के ब्रह्माण्डीय मौसम को पढ़ना \u2014 तिथि, नक्षत्र, योग, करण, और वार',
    startHere: 'यहाँ से शुरू करें',
    modules: 'मॉड्यूल',
    deepDive: 'गहन अध्ययन',
    backToLearn: 'सभी ट्रैक',
    refsOnly: 'केवल संदर्भ पृष्ठ',
  },
  sa: {
    badge: 'मार्गः 2',
    title: 'पञ्चाङ्गम् \u2014 दैनिकाभ्यासः',
    sub: 'प्रतिदिनस्य ब्रह्माण्डीयवातावरणं पठति \u2014 तिथिः, नक्षत्रम्, योगः, करणम्, वारश्च',
    startHere: 'अत्र आरभतु',
    modules: 'मॉड्यूलाः',
    deepDive: 'गहनाध्ययनम्',
    backToLearn: 'सर्वे मार्गाः',
    refsOnly: 'सन्दर्भपृष्ठानि केवलम्',
  },
};

export default function PanchangTrackPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const l = L[locale] || L.en;

  return (
    <div>
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10 mb-10"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-500/8 blur-3xl" />

        <div className="relative z-10">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-gold-light/70 hover:text-amber-200 text-xs uppercase tracking-wider mb-6 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {l.backToLearn}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-gold-light" />
            <span className="text-gold-light text-xs uppercase tracking-widest font-bold">{l.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" style={hf}>
            {l.title}
          </h1>
          <p className="text-amber-200/60 text-lg max-w-2xl mb-8" style={bf}>{l.sub}</p>

          <Link
            href="/learn/modules/5-1"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold-primary/20 text-gold-light border border-gold-primary/30 font-bold text-sm hover:bg-gold-primary/30 transition-colors"
            style={hf}
          >
            {l.startHere}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── Sections ── */}
      <div className="space-y-8">
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.06 }}
            className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden"
          >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-gold-primary/10 flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-white" style={hf}>{section.title[locale]}</h2>
                <span className="text-gold-light/50 text-xs uppercase tracking-wider" style={bf}>{section.subtitle[locale]}</span>
              </div>
              {section.modules.length > 0 && (
                <span className="ml-auto text-gold-primary/40 text-xs font-mono">{section.modules.length} {l.modules}</span>
              )}
              {section.modules.length === 0 && (
                <span className="ml-auto text-gold-primary/30 text-xs italic">{l.refsOnly}</span>
              )}
            </div>

            {/* Module cards */}
            {section.modules.length > 0 && (
              <div className="divide-y divide-amber-500/8">
                {section.modules.map((mod, mi) => (
                  <Link
                    key={mod.id}
                    href={`/learn/modules/${mod.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-amber-500/8 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-gold-light">
                        {mi + 1}
                      </span>
                      <span className="text-text-primary text-sm group-hover:text-amber-200 transition-colors" style={bf}>
                        {mod.title[locale]}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-light transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {/* Reference deep dives */}
            {section.refs.length > 0 && (
              <div className={`px-6 py-3 ${section.modules.length > 0 ? 'border-t border-amber-500/10' : ''} flex flex-wrap gap-2`}>
                {section.refs.map(ref => (
                  <Link
                    key={ref.href}
                    href={ref.href}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 border border-orange-500/20 transition-colors"
                    style={bf}
                  >
                    <BookOpen className="w-3 h-3" />
                    {l.deepDive}: {ref.label[locale]}
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
