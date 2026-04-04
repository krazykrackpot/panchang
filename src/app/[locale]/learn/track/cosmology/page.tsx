'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ── Section data ─────────────────────────────────────────────────
type Tri = { en: string; hi: string; sa: string };
interface Section {
  id: string;
  icon: string;
  title: Tri;
  subtitle: Tri;
  modules: { id: string; title: Tri; href?: string }[];
  refs: { label: Tri; href: string }[];
}

const SECTIONS: Section[] = [
  {
    id: 'worldview', icon: '\u2728',
    title: { en: 'The Hindu Worldview', hi: 'हिन्दू विश्वदृष्टि', sa: 'हिन्दूविश्वदृष्टिः' },
    subtitle: { en: 'Getting Started', hi: 'आरम्भ', sa: 'आरम्भः' },
    modules: [
      { id: '0-1', title: { en: 'What is Jyotish? (And What It Isn\'t)', hi: 'ज्योतिष क्या है? (और क्या नहीं है)', sa: 'ज्योतिषं किम्? (किं न च)' } },
      { id: '0-2', title: { en: 'The Hindu Calendar \u2014 Why It\'s Different', hi: 'हिन्दू पंचांग \u2014 यह अलग क्यों है', sa: 'हिन्दूपञ्चाङ्गम् \u2014 कथं भिन्नम्' } },
      { id: '0-3', title: { en: 'Your Cosmic Address \u2014 Sun, Moon, Nakshatra', hi: 'आपका ब्रह्माण्डीय पता \u2014 सूर्य, चन्द्र, नक्षत्र', sa: 'भवतः ब्रह्माण्डीयसङ्केतः' } },
      { id: '0-6', title: { en: 'Rituals & Astronomy', hi: 'अनुष्ठान एवं खगोल', sa: 'अनुष्ठानं खगोलं च' } },
      { id: 'ref:cosmology', title: { en: 'Cosmic Time Scales — Yugas, Kalpas, Brahma', hi: 'ब्रह्माण्डीय कालमान — युग, कल्प, ब्रह्मा', sa: 'ब्रह्माण्डीयकालमानम्' }, href: '/learn/cosmology' },
    ],
    refs: [],
  },
  {
    id: 'sky', icon: '\u2604',
    title: { en: 'The Sky', hi: 'आकाश', sa: 'आकाशः' },
    subtitle: { en: 'Observational Foundations', hi: 'प्रेक्षणात्मक आधार', sa: 'प्रेक्षणात्मकाधारः' },
    modules: [
      { id: '1-1', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', sa: 'रात्र्याकाशः क्रान्तिवृत्तं च' } },
      { id: '1-2', title: { en: 'Measuring the Sky \u2014 Degrees & Signs', hi: 'आकाश मापन \u2014 अंश एवं राशि', sa: 'आकाशमापनम् \u2014 अंशाः राशयश्च' } },
      { id: '1-3', title: { en: 'Fixed Stars vs Moving Planets', hi: 'स्थिर तारे बनाम गतिशील ग्रह', sa: 'स्थिरतारकाः गतिशीलग्रहाश्च' } },
      { id: 'ref:calculations', title: { en: 'How We Calculate — Meeus Algorithms', hi: 'गणना कैसे करते हैं — Meeus गणित', sa: 'गणनापद्धतयः' }, href: '/learn/calculations' },
    ],
    refs: [],
  },
  {
    id: 'orbital', icon: '\u{1F6F0}',
    title: { en: 'Planetary Cycles & Orbital Mechanics', hi: 'ग्रह चक्र एवं कक्षीय यान्त्रिकी', sa: 'ग्रहचक्राणि कक्षीययान्त्रिकी च' },
    subtitle: { en: 'How Ancient Indians Measured the Cosmos', hi: 'प्राचीन भारतीयों ने ब्रह्माण्ड कैसे मापा', sa: 'प्राचीनभारतीयाः ब्रह्माण्डं कथम् अमापयन्' },
    modules: [
      { id: 'ref:orbital', title: { en: 'Planetary Orbital Periods — Surya Siddhanta vs NASA', hi: 'ग्रह कक्षीय काल — सूर्य सिद्धान्त बनाम NASA', sa: 'ग्रहकक्षीयकालाः — सूर्यसिद्धान्तः NASA च' }, href: '/learn/planetary-cycles' },
      { id: 'ref:vedanga', title: { en: 'Vedanga Jyotisha & Indian Astronomy Heritage', hi: 'वेदांग ज्योतिष एवं भारतीय खगोल विरासत', sa: 'वेदाङ्गज्योतिषम् भारतीयखगोलपरम्परा च' }, href: '/learn/vedanga' },
      { id: 'ref:observatories', title: { en: 'Jantar Mantar — Stone Observatories', hi: 'जन्तर मन्तर — पत्थर वेधशालाएं', sa: 'जन्तरमन्तरम् — प्रस्तरवेधशालाः' }, href: '/learn/observatories' },
    ],
    refs: [],
  },
  {
    id: 'navagraha', icon: '\u2609',
    title: { en: 'The Nine Planets (Navagraha)', hi: 'नवग्रह', sa: 'नवग्रहाः' },
    subtitle: { en: 'Cosmic Forces', hi: 'ब्रह्माण्डीय शक्तियाँ', sa: 'ब्रह्माण्डीयशक्तयः' },
    modules: [
      { id: '2-1', title: { en: 'Nine Grahas \u2014 Nature & Karakatva', hi: 'नवग्रह \u2014 प्रकृति एवं कारकत्व', sa: 'नवग्रहाः \u2014 प्रकृतिः कारकत्वं च' } },
      { id: '2-2', title: { en: 'Planetary Friendship Matrix', hi: 'ग्रह मित्रता सारणी', sa: 'ग्रहमैत्रीसारणी' } },
      { id: '2-3', title: { en: 'Dignities \u2014 Exaltation & Debilitation', hi: 'ग्रह गरिमा \u2014 उच्च एवं नीच', sa: 'ग्रहगरिमा \u2014 उच्चनीचम्' } },
      { id: '2-4', title: { en: 'Retrograde, Combustion & Graha Yuddha', hi: 'वक्री, अस्त एवं ग्रह युद्ध', sa: 'वक्री, अस्तं, ग्रहयुद्धं च' } },
      { id: 'ref:grahas', title: { en: 'The Navagraha — Complete Reference', hi: 'नवग्रह — सम्पूर्ण संदर्भ', sa: 'नवग्रहाः — सम्पूर्णसन्दर्भः' }, href: '/learn/grahas' },
      { id: 'ref:planets', title: { en: 'Planetary Positions — Reading Your Chart', hi: 'ग्रह स्थिति — कुण्डली पढ़ना', sa: 'ग्रहस्थितयः' }, href: '/learn/planets' },
      { id: 'ref:aspects', title: { en: 'Planetary Aspects (Drishti) — Visual Guide', hi: 'ग्रह दृष्टि — दृश्य मार्गदर्शिका', sa: 'ग्रहदृष्टिः' }, href: '/learn/aspects' },
      { id: 'ref:combustion', title: { en: 'Combustion — When Planets Get Too Close to Sun', hi: 'अस्त — जब ग्रह सूर्य के निकट', sa: 'अस्तम्' }, href: '/learn/combustion' },
      { id: 'ref:retro', title: { en: 'Retrograde Effects — All 5 Planets', hi: 'वक्री प्रभाव — सभी 5 ग्रह', sa: 'वक्रीप्रभावाः' }, href: '/learn/retrograde-effects' },
      { id: 'ref:remedies', title: { en: 'Complete Remedial Reference — All 9 Planets', hi: 'सम्पूर्ण उपचार — सभी 9 ग्रह', sa: 'उपायाः' }, href: '/learn/remedies' },
    ],
    refs: [],
  },
  {
    id: 'rashis', icon: '\u2648',
    title: { en: 'The 12 Signs (Rashis)', hi: '12 राशियाँ', sa: '12 राशयः' },
    subtitle: { en: 'The Zodiacal Framework', hi: 'राशि ढाँचा', sa: 'राशिढाञ्चः' },
    modules: [
      { id: '3-1', title: { en: 'The 12 Rashis \u2014 Parashara\'s Description', hi: '12 राशियाँ \u2014 पराशर वर्णन', sa: '12 राशयः \u2014 पाराशरवर्णनम्' } },
      { id: '3-2', title: { en: 'Qualities & Elements', hi: 'गुण एवं तत्व', sa: 'गुणाः तत्त्वानि च' } },
      { id: '3-3', title: { en: 'Sign Lordship & Moolatrikona', hi: 'राशि स्वामित्व एवं मूलत्रिकोण', sa: 'राशिस्वामित्वं मूलत्रिकोणं च' } },
      { id: 'ref:rashis', title: { en: 'The 12 Rashis — Complete Reference', hi: '12 राशियाँ — सम्पूर्ण संदर्भ', sa: '12 राशयः — सम्पूर्णसन्दर्भः' }, href: '/learn/rashis' },
    ],
    refs: [],
  },
  {
    id: 'nakshatras', icon: '\u2736',
    title: { en: 'The 27 Stars (Nakshatras)', hi: '27 नक्षत्र', sa: '27 नक्षत्राणि' },
    subtitle: { en: 'Lunar Mansions', hi: 'चन्द्र गृह', sa: 'चन्द्रगृहाणि' },
    modules: [
      { id: '6-1', title: { en: '27 Lunar Mansions', hi: '27 चन्द्र गृह', sa: '27 चन्द्रगृहाणि' } },
      { id: '6-2', title: { en: '108 Padas \u2014 The Navamsha Link', hi: '108 पाद \u2014 नवांश सम्बन्ध', sa: '108 पादाः \u2014 नवांशसम्बन्धः' } },
      { id: '6-3', title: { en: 'Compatibility (Melapaka)', hi: 'अनुकूलता (मेलापक)', sa: 'अनुकूलता (मेलापकम्)' } },
      { id: '6-4', title: { en: 'Nakshatra Lords & Dasha Connection', hi: 'नक्षत्र स्वामी एवं दशा सम्बन्ध', sa: 'नक्षत्रस्वामिनः दशासम्बन्धश्च' } },
      { id: 'ref:nakshatras', title: { en: '27 Nakshatras — Complete Reference', hi: '27 नक्षत्र — सम्पूर्ण संदर्भ', sa: '27 नक्षत्राणि — सम्पूर्णसन्दर्भः' }, href: '/learn/nakshatras' },
    ],
    refs: [],
  },
  {
    id: 'precession', icon: '\u21BB',
    title: { en: 'Precession & Ayanamsha', hi: 'अयनगति एवं अयनांश', sa: 'अयनगतिः अयनांशश्च' },
    subtitle: { en: 'The Shifting Sky', hi: 'बदलता आकाश', sa: 'परिवर्तमानाकाशः' },
    modules: [
      { id: '4-1', title: { en: 'Precession \u2014 Why the Sky Shifts', hi: 'अयनगति \u2014 आकाश क्यों बदलता', sa: 'अयनगतिः \u2014 आकाशः कथं परिवर्तते' } },
      { id: '4-2', title: { en: 'Ayanamsha Systems Compared', hi: 'अयनांश पद्धतियों की तुलना', sa: 'अयनांशपद्धतीनां तुलना' } },
      { id: '4-3', title: { en: 'Tropical vs Sidereal Debate', hi: 'सायन बनाम निरयन वाद', sa: 'सायननिरयनवादः' } },
      { id: 'ref:ayanamsha', title: { en: 'Ayanamsha — Complete Systems Reference', hi: 'अयनांश — सम्पूर्ण पद्धति संदर्भ', sa: 'अयनांशः — सम्पूर्णपद्धतिसन्दर्भः' }, href: '/learn/ayanamsha' },
    ],
    refs: [],
  },
  {
    id: 'classical', icon: '\u{1F4DC}',
    title: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान', sa: 'शास्त्रीयज्ञानम्' },
    subtitle: { en: 'Ancient Texts', hi: 'प्राचीन ग्रन्थ', sa: 'प्राचीनग्रन्थाः' },
    modules: [
      { id: '16-1', title: { en: 'Brihat Parashara Hora Shastra', hi: 'बृहत् पराशर होरा शास्त्र', sa: 'बृहत्पाराशरहोराशास्त्रम्' } },
      { id: '16-2', title: { en: 'Phaladeepika & Jataka Parijata', hi: 'फलदीपिका एवं जातक पारिजात', sa: 'फलदीपिका जातकपारिजातश्च' } },
      { id: '16-3', title: { en: 'Surya Siddhanta & Mathematics', hi: 'सूर्य सिद्धान्त एवं गणित', sa: 'सूर्यसिद्धान्तः गणितं च' } },
      { id: 'ref:classical', title: { en: 'Classical Texts — Complete Reference', hi: 'शास्त्रीय ग्रन्थ — सम्पूर्ण संदर्भ', sa: 'शास्त्रीयग्रन्थाः' }, href: '/learn/classical-texts' },
    ],
    refs: [],
  },
];

const L = {
  en: {
    badge: 'Track 1',
    title: 'Hindu Cosmology & Foundations',
    sub: 'The universe, time, planets, stars, and the mathematical framework of Jyotish',
    startHere: 'Start Here',
    modules: 'modules',
    deepDive: 'Deep Dive',
    backToLearn: 'All Tracks',
  },
  hi: {
    badge: 'ट्रैक 1',
    title: 'हिन्दू ब्रह्माण्डविद्या एवं आधार',
    sub: 'ब्रह्माण्ड, काल, ग्रह, तारे, और ज्योतिष का गणितीय ढाँचा',
    startHere: 'यहाँ से शुरू करें',
    modules: 'मॉड्यूल',
    deepDive: 'गहन अध्ययन',
    backToLearn: 'सभी ट्रैक',
  },
  sa: {
    badge: 'मार्गः 1',
    title: 'हिन्दूब्रह्माण्डविद्या आधारश्च',
    sub: 'ब्रह्माण्डं कालः ग्रहाः ताराः ज्योतिषस्य गणितीयढाञ्चश्च',
    startHere: 'अत्र आरभतु',
    modules: 'मॉड्यूलाः',
    deepDive: 'गहनाध्ययनम्',
    backToLearn: 'सर्वे मार्गाः',
  },
};

export default function CosmologyTrackPage() {
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
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative z-10">
          {/* Back link */}
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-gold-light/70 hover:text-indigo-200 text-xs uppercase tracking-wider mb-6 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {l.backToLearn}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-gold-light" />
            <span className="text-gold-light text-xs uppercase tracking-widest font-bold">{l.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3" style={hf}>
            {l.title}
          </h1>
          <p className="text-indigo-200/60 text-lg max-w-2xl mb-8" style={bf}>{l.sub}</p>

          <Link
            href="/learn/modules/0-1"
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
              <span className="ml-auto text-gold-primary/40 text-xs font-mono">{section.modules.length} {l.modules}</span>
            </div>

            {/* Module cards */}
            <div className="divide-y divide-indigo-500/8">
              {section.modules.map((mod, mi) => {
                const isRef = mod.id.startsWith('ref:');
                const linkHref = isRef && mod.href ? mod.href : `/learn/modules/${mod.id}`;
                return (
                <Link
                  key={mod.id}
                  href={linkHref}
                  className={`flex items-center justify-between px-6 py-3.5 transition-colors group ${isRef ? 'hover:bg-violet-500/8 bg-violet-500/3' : 'hover:bg-indigo-500/8'}`}
                >
                  <div className="flex items-center gap-3">
                    {isRef ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase tracking-wider">
                        {locale === 'en' ? 'Ref' : 'सन्दर्भ'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-gold-light">
                        {mi + 1}
                      </span>
                    )}
                    <span className={`text-sm group-hover:text-indigo-200 transition-colors ${isRef ? 'text-violet-200/80' : 'text-text-primary'}`} style={bf}>
                      {mod.title[locale]}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-light transition-colors shrink-0" />
                </Link>
                );
              })}
            </div>

            {/* Legacy refs section — now empty, all moved to modules list */}
            {section.refs.length > 0 && (
              <div className="px-6 py-3 border-t border-indigo-500/10 flex flex-wrap gap-2">
                {section.refs.map(ref => (
                  <Link
                    key={ref.href}
                    href={ref.href}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/20 transition-colors"
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
