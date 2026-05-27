'use client';

// src/app/[locale]/learn/health-diagnosis/page.tsx
//
// Learn page — explains the three-layer Health Diagnosis Engine architecture:
//   Layer 1: Natal baseline (22 elements)
//   Layer 2: Dasha activation + transit overlay
//   Layer 3: Sade Sati amplifier + life-stage gate
//
// Cross-links to /medical-astrology (tool), /learn/ayurveda-jyotish, /learn/health.
// Added to MODULE_SEQUENCE phase 13 (Medical Jyotish).

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Activity, BookOpen, FlaskConical, Layers, ShieldCheck, ChevronRight } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

// ── Inline labels — 9 visible locales, English fallback for new scripts ──────

const LABELS = {
  en: {
    badge:    'Medical Jyotish',
    title:    'Health Diagnosis Engine — Methodology',
    subtitle: 'How the 22-element, three-layer engine scores your Vedic health profile.',
    disclaimer: 'This is traditional Vedic knowledge for self-awareness only. It is NOT medical advice. Always consult qualified healthcare professionals.',
    sec1Title: 'Three-Layer Architecture',
    sec1Intro: 'The engine works in three sequential layers. Each layer adds temporal context on top of the natal baseline, producing a score that reflects both your birth-chart constitution and present-moment conditions.',
    layer1Title: 'Layer 1 — Natal Baseline',
    layer1Desc:  'Scores 22 health elements from the birth chart using house affliction analysis (6th, 8th, 12th houses), planetary dignity (Shadbala), and classical BPHS signatures. The score is fixed for life — it represents constitutional vulnerability, not current health.',
    layer2Title: 'Layer 2 — Temporal Activation',
    layer2Desc:  'Applies a dasha multiplier (0–0.5 bonus) and a transit multiplier (0–0.5 bonus) on top of the natal score. When the dasha lord rules or afflicts a health house, the natal vulnerability is temporarily amplified.',
    layer3Title: 'Layer 3 — Amplifiers & Gates',
    layer3Desc:  'Sade Sati (Saturn transiting natal Moon ±1 sign) adds a flat amplifier to all elements. A life-stage gate scales scores by age — 0–18 (constitutional), 18–60 (active), 60+ (longevity emphasis).',
    sec2Title: '22 Elements — Default vs Extended',
    sec2Intro: 'The default view shows 19 elements covering the main physical, mental, and systemic categories. Three extended elements (allergies, cancer tendency, longevity) are opt-in, requiring explicit user consent before display.',
    catPhysical:  'Physical Systems (houses 1–6)',
    catMental:    'Mental & Emotional (Moon, Mercury, 5th house)',
    catSystemic:  'Systemic Risk Factors (8th, 12th house)',
    catLongevity: 'Longevity & Chronic (Pinda Ayurdaya, extended)',
    sec3Title: 'Classical Sources',
    sec3Intro: 'Each element is sourced from one or more classical texts. The engine uses Lahiri Ayanamsha and Meeus algorithms consistent with the main kundali engine.',
    src1: 'BPHS Chapter 68  –  diseases from house lords',
    src2: 'Sarvartha Chintamani  –  disease-causing yogas',
    src3: 'Pinda Ayurdaya  –  longevity computation from lagna, Sun, and Moon lords',
    src4: 'Charaka Samhita  –  Prakriti classification (Vata/Pitta/Kapha)',
    sec4Title: 'Integration with the Kundali Engine',
    sec4Intro: 'The Health Diagnosis runs inside the same /api/kundali pipeline. Results are cached in kundali_snapshots (key: healthDiagnosis) and auto-invalidated when ENGINE_VERSION changes. The Simple view (DomainRingsCard) shows the top-3 vulnerable elements; the Expert SummaryDomainCard and the full /medical-astrology page show all 22.',
    tryTool:     'Try the Health Diagnosis tool →',
    learnAyurveda: 'Ayurveda & Jyotish →',
    learnHealth:   'Health Astrology foundations →',
  },
  hi: {
    badge:    'चिकित्सा ज्योतिष',
    title:    'स्वास्थ्य निदान इंजन — पद्धति',
    subtitle: '22-तत्व, त्रि-स्तरीय इंजन आपकी वैदिक स्वास्थ्य प्रोफ़ाइल कैसे बनाता है।',
    disclaimer: 'यह पारम्परिक वैदिक ज्ञान केवल आत्म-जागरूकता के लिए है। यह चिकित्सा परामर्श नहीं है।',
    sec1Title: 'त्रि-स्तरीय संरचना',
    sec1Intro: 'इंजन तीन क्रमिक स्तरों में कार्य करता है। प्रत्येक स्तर जन्मकालीन आधार पर कालिक संदर्भ जोड़ता है।',
    layer1Title: 'स्तर 1 — जन्मकालीन आधार',
    layer1Desc:  '6ठे, 8वें, 12वें भावों के दोष विश्लेषण और षड्बल से 22 स्वास्थ्य तत्वों का अंकन।',
    layer2Title: 'स्तर 2 — कालिक सक्रियता',
    layer2Desc:  'दशा गुणक (0–0.5) और गोचर गुणक (0–0.5) जन्मकालीन अंक पर लागू होते हैं।',
    layer3Title: 'स्तर 3 — प्रवर्धक और द्वार',
    layer3Desc:  'साढ़े साती सभी तत्वों पर प्रवर्धक जोड़ती है। जीवन-चरण द्वार आयु के अनुसार अंक समायोजित करता है।',
    sec2Title:  '22 तत्व — सामान्य बनाम विस्तारित',
    sec2Intro:  'सामान्य दृश्य में 19 तत्व। तीन विस्तारित तत्व (एलर्जी, कैंसर प्रवृत्ति, दीर्घायु) ऑप्ट-इन हैं।',
    catPhysical:  'शारीरिक तंत्र (भाव 1–6)',
    catMental:    'मानसिक एवं भावनात्मक (चन्द्र, बुध, 5वाँ भाव)',
    catSystemic:  'प्रणालीगत जोखिम (8वाँ, 12वाँ भाव)',
    catLongevity: 'दीर्घायु एवं जीर्ण रोग (पिण्ड आयुर्दाय, विस्तारित)',
    sec3Title: 'शास्त्रीय स्रोत',
    sec3Intro: 'प्रत्येक तत्व एक या अधिक शास्त्रीय ग्रन्थों से स्रोतित है।',
    src1: 'BPHS अध्याय 68  –  भाव स्वामियों से रोग',
    src2: 'सर्वार्थ चिन्तामणि  –  रोगकारक योग',
    src3: 'पिण्ड आयुर्दाय  –  लग्न, सूर्य और चन्द्र स्वामियों से दीर्घायु गणना',
    src4: 'चरक संहिता  –  प्रकृति वर्गीकरण',
    sec4Title: 'कुण्डली इंजन के साथ एकीकरण',
    sec4Intro: 'स्वास्थ्य निदान /api/kundali पाइपलाइन में चलता है। परिणाम kundali_snapshots में कैश होते हैं।',
    tryTool:     'स्वास्थ्य निदान उपकरण →',
    learnAyurveda: 'आयुर्वेद एवं ज्योतिष →',
    learnHealth:   'स्वास्थ्य ज्योतिष आधार →',
  },
  // ta, te, bn, gu, kn, mai, mr — English fallback per CLAUDE.md rule
  // "Locale fallback is non-negotiable: render English if regional translation is missing"
} as const;

type LabelLocale = keyof typeof LABELS;

// Localised string helper — falls back to English for any locale not in LABELS.
function L(locale: string, key: keyof typeof LABELS.en): string {
  const loc = (locale in LABELS ? locale : 'en') as LabelLocale;
  return LABELS[loc][key] ?? LABELS.en[key];
}

// ── Layer card data ────────────────────────────────────────────────────────────
const LAYERS: Array<{
  num: number;
  icon: typeof Layers;
  color: string;
  bg: string;
  titleKey: keyof typeof LABELS.en;
  descKey: keyof typeof LABELS.en;
}> = [
  { num: 1, icon: ShieldCheck, color: 'text-gold-light',   bg: 'from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]', titleKey: 'layer1Title', descKey: 'layer1Desc' },
  { num: 2, icon: Activity,    color: 'text-blue-400',     bg: 'from-blue-500/15 via-[#1a1040]/50 to-[#0a0e27]',   titleKey: 'layer2Title', descKey: 'layer2Desc' },
  { num: 3, icon: Layers,      color: 'text-amber-400',    bg: 'from-amber-500/15 via-[#1a1040]/50 to-[#0a0e27]',  titleKey: 'layer3Title', descKey: 'layer3Desc' },
];

// ── Element category cards ────────────────────────────────────────────────────
const CATEGORIES: Array<{ key: keyof typeof LABELS.en; count: number; icon: typeof BookOpen; color: string }> = [
  { key: 'catPhysical',  count: 9,  icon: Activity,     color: 'text-emerald-400' },
  { key: 'catMental',    count: 4,  icon: FlaskConical, color: 'text-blue-400'    },
  { key: 'catSystemic',  count: 6,  icon: ShieldCheck,  color: 'text-amber-400'   },
  { key: 'catLongevity', count: 3,  icon: BookOpen,     color: 'text-violet-400'  },
];

// ── Classical sources ─────────────────────────────────────────────────────────
const SOURCES: Array<{ key: keyof typeof LABELS.en }> = [
  { key: 'src1' },
  { key: 'src2' },
  { key: 'src3' },
  { key: 'src4' },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HealthDiagnosisMethodologyPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Activity className="w-3.5 h-3.5" />
          {L(locale, 'badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
          {L(locale, 'title')}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
          {L(locale, 'subtitle')}
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="mb-10 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-text-secondary/70 text-xs leading-relaxed">{L(locale, 'disclaimer')}</p>
      </motion.div>

      {/* Section 1: Three-layer architecture */}
      <LessonSection number={1} title={L(locale, 'sec1Title')}>
        <p className="mb-6 text-text-secondary text-sm leading-relaxed">{L(locale, 'sec1Intro')}</p>
        <div className="space-y-4">
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <div key={layer.num}
                className={`p-5 rounded-2xl bg-gradient-to-br ${layer.bg} border border-gold-primary/12`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                    {layer.num}
                  </span>
                  <Icon className={`w-4 h-4 ${layer.color}`} />
                  <h4 className={`font-bold text-sm ${layer.color}`} style={hf}>
                    {L(locale, layer.titleKey)}
                  </h4>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed ml-10">
                  {L(locale, layer.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: 22 elements */}
      <LessonSection number={2} title={L(locale, 'sec2Title')}>
        <p className="mb-5 text-text-secondary text-sm leading-relaxed">{L(locale, 'sec2Intro')}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map(({ key, count, icon: Icon, color }) => (
            <div key={key}
              className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className={`text-xs font-bold ${color}`}>{count} elements</span>
              </div>
              <p className="text-text-secondary text-xs leading-snug">{L(locale, key)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 3: Classical sources */}
      <LessonSection number={3} title={L(locale, 'sec3Title')} variant="formula">
        <p className="mb-4 text-text-secondary text-sm leading-relaxed">{L(locale, 'sec3Intro')}</p>
        <div className="space-y-2">
          {SOURCES.map(({ key }) => (
            <div key={key}
              className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <BookOpen className="w-3.5 h-3.5 text-gold-primary mt-0.5 flex-shrink-0" />
              <p className="text-text-secondary text-xs leading-relaxed">{L(locale, key)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Integration with kundali engine */}
      <LessonSection number={4} title={L(locale, 'sec4Title')}>
        <p className="text-text-secondary text-sm leading-relaxed">{L(locale, 'sec4Intro')}</p>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {([
          { href: '/medical-astrology', labelKey: 'tryTool'       },
          { href: '/learn/ayurveda-jyotish', labelKey: 'learnAyurveda' },
          { href: '/learn/health',           labelKey: 'learnHealth'   },
        ] as const).map(({ href, labelKey }) => (
          <Link key={href} href={href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium hover:bg-gold-primary/20 transition-colors">
            {L(locale, labelKey)}
            <ChevronRight className="w-3 h-3" />
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
