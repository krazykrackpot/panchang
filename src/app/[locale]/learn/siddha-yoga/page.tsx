'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Siddha Yoga',
    subtitle: 'The Tithi-Vara Yoga of Accomplishment',
    whatIs: 'What is Siddha Yoga?',
    whatIsText: 'Siddha Yoga (Sanskrit: सिद्धयोग, "yoga of perfection/accomplishment") is a muhurta yoga determined by specific tithi (lunar day) and vara (weekday) combinations. Unlike the 27 Nitya Yogas calculated from Sun-Moon longitude sums, Siddha Yoga belongs to the Tithi-Vara classification system used in daily panchang muhurta assessment. When active, it indicates a day favorable for spiritual practices, mantra repetition, and disciplined action.',
    formation: 'Formation — Tithi + Vara Combinations',
    formationText: 'Siddha Yoga forms from specific tithi-vara pairs. The classical system assigns each weekday certain tithis that create the yoga:',
    sunday: 'Sunday — Chaturthi (4), Navami (9), Chaturdashi (14)',
    monday: 'Monday — Shashti (6), Ekadashi (11), Purnima (15/30)',
    tuesday: 'Tuesday — Tritiya (3), Ashtami (8), Trayodashi (13)',
    wednesday: 'Wednesday — Panchami (5), Dashami (10), Amavasya (30)',
    thursday: 'Thursday — Dwitiya (2), Saptami (7), Dwadashi (12)',
    friday: 'Friday — Pratipada (1), Shashti (6), Ekadashi (11)',
    saturday: 'Saturday — Tritiya (3), Saptami (7), Dwadashi (12)',
    formationNote: 'These are from the Muhurta Chintamani. Some regional traditions use slightly different tables. Always verify against the panchang tradition followed in your region.',
    distinction: 'Siddha Yoga vs Siddhi Yoga vs Amrit Siddhi',
    distinctionText: 'These three are commonly confused but are entirely different yogas:',
    distSiddha: 'Siddha Yoga — Tithi + Vara combination (this page). Favorable for spiritual practices and disciplined action.',
    distSiddhi: 'Siddhi Yoga — One of the 27 Nitya Yogas (#21), calculated from Sun + Moon longitude sum reaching 333\u00b020\' to 346\u00b040\'. A mathematical astronomical yoga, not a muhurta combination.',
    distAmrit: 'Amrit Siddhi Yoga — Vara + Nakshatra combination (7 specific pairs). The most powerful auspicious muhurta yoga. Completely different formation from Siddha.',
    recommended: 'Recommended Activities',
    activityItems: 'Mantra japa and meditation|Spiritual initiations (diksha)|Beginning a fast or vrat|Starting a course of study (especially sacred texts)|Performing puja or havan|Charitable acts and seva|Commencing sadhana or tapas|Making vows and resolutions',
    spiritual: 'Spiritual Emphasis',
    spiritualText: 'While Sarvartha Siddhi and Amrit Siddhi are considered broadly auspicious for material activities (business, purchases, travel), Siddha Yoga is traditionally emphasized more for spiritual and disciplined activities. The word "siddha" in this context refers to accomplishment through discipline and practice — the perfection that comes from sustained effort, particularly in spiritual pursuits. It is the yoga of the sadhaka (practitioner), not the vyapari (businessman).',
    frequency: 'Frequency',
    frequencyText: 'Siddha Yoga occurs several times per month — roughly on par with Sarvartha Siddhi in frequency. Since each weekday has 2-3 qualifying tithis, and tithis repeat twice per lunar month (once in Shukla, once in Krishna Paksha), there are many opportunities for the alignment.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Siddha Yoga is the same as Siddhi Yoga" — Siddhi is one of the 27 Nitya Yogas (#21) and is calculated astronomically. Siddha is a muhurta yoga from tithi-vara combinations. They share a Sanskrit root (siddh = accomplish) but are unrelated yogas.',
    misconception2: '"Siddha Yoga is good for buying gold or starting business" — While not prohibited, Siddha Yoga is traditionally recommended more for spiritual activities. For business and material pursuits, Sarvartha Siddhi or Amrit Siddhi are more appropriate.',
    misconception3: '"If both Siddha Yoga and Rahu Kaal are present, they cancel out" — Rahu Kaal does not cancel Siddha Yoga entirely, but activities done during the Rahu Kaal window within a Siddha Yoga day may not carry the yoga\'s benefits. Avoid Rahu Kaal hours even on Siddha Yoga days.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'सिद्ध योग',
    subtitle: 'उपलब्धि का तिथि-वार योग',
    whatIs: 'सिद्ध योग क्या है?',
    whatIsText: 'सिद्ध योग (संस्कृत: सिद्धयोग, "पूर्णता/उपलब्धि का योग") एक मुहूर्त योग है जो विशिष्ट तिथि (चंद्र दिवस) और वार (सप्ताह का दिन) संयोग से निर्धारित होता है। 27 नित्य योगों से भिन्न, सिद्ध योग तिथि-वार वर्गीकरण प्रणाली से संबंधित है। जब सक्रिय होता है, यह आध्यात्मिक साधना, मंत्र जप और अनुशासित कार्य के लिए अनुकूल दिन इंगित करता है।',
    formation: 'निर्माण — तिथि + वार संयोग',
    formationText: 'सिद्ध योग विशिष्ट तिथि-वार जोड़ियों से बनता है:',
    sunday: 'रविवार — चतुर्थी (4), नवमी (9), चतुर्दशी (14)',
    monday: 'सोमवार — षष्ठी (6), एकादशी (11), पूर्णिमा (15/30)',
    tuesday: 'मंगलवार — तृतीया (3), अष्टमी (8), त्रयोदशी (13)',
    wednesday: 'बुधवार — पंचमी (5), दशमी (10), अमावस्या (30)',
    thursday: 'गुरुवार — द्वितीया (2), सप्तमी (7), द्वादशी (12)',
    friday: 'शुक्रवार — प्रतिपदा (1), षष्ठी (6), एकादशी (11)',
    saturday: 'शनिवार — तृतीया (3), सप्तमी (7), द्वादशी (12)',
    formationNote: 'ये मुहूर्त चिन्तामणि से हैं। कुछ क्षेत्रीय परम्पराएँ थोड़ी भिन्न सारणी का उपयोग करती हैं। हमेशा अपने क्षेत्र की पंचांग परम्परा से सत्यापित करें।',
    distinction: 'सिद्ध योग बनाम सिद्धि योग बनाम अमृत सिद्धि',
    distinctionText: 'ये तीनों आमतौर पर भ्रमित होते हैं लेकिन पूर्णतः भिन्न योग हैं:',
    distSiddha: 'सिद्ध योग — तिथि + वार संयोग (यह पृष्ठ)। आध्यात्मिक साधना और अनुशासित कार्य के लिए अनुकूल।',
    distSiddhi: 'सिद्धि योग — 27 नित्य योगों में से एक (#21), सूर्य + चन्द्र देशांतर योग से गणना। खगोलीय योग, मुहूर्त संयोग नहीं।',
    distAmrit: 'अमृत सिद्धि योग — वार + नक्षत्र संयोग (7 विशिष्ट जोड़ी)। सबसे शक्तिशाली शुभ मुहूर्त योग।',
    recommended: 'अनुशंसित कार्य',
    activityItems: 'मंत्र जप और ध्यान|आध्यात्मिक दीक्षा|उपवास या व्रत शुरू करना|अध्ययन शुरू करना (विशेषकर पवित्र ग्रंथ)|पूजा या हवन|दान और सेवा|साधना या तपस शुरू करना|संकल्प और प्रतिज्ञा',
    spiritual: 'आध्यात्मिक महत्व',
    spiritualText: 'जबकि सर्वार्थ सिद्धि और अमृत सिद्धि भौतिक कार्यों (व्यवसाय, खरीदारी, यात्रा) के लिए व्यापक रूप से शुभ माने जाते हैं, सिद्ध योग परम्परागत रूप से आध्यात्मिक और अनुशासित कार्यों के लिए अधिक महत्वपूर्ण है। "सिद्ध" अनुशासन और अभ्यास से उपलब्धि को संदर्भित करता है — यह साधक का योग है, व्यापारी का नहीं।',
    frequency: 'आवृत्ति',
    frequencyText: 'सिद्ध योग महीने में कई बार होता है — आवृत्ति में सर्वार्थ सिद्धि के लगभग बराबर।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"सिद्ध योग और सिद्धि योग एक ही हैं" — सिद्धि 27 नित्य योगों में से एक (#21) है और खगोलीय रूप से गणना होती है। सिद्ध तिथि-वार संयोग से बना मुहूर्त योग है।',
    misconception2: '"सिद्ध योग सोना खरीदने या व्यवसाय शुरू करने के लिए अच्छा है" — यह परम्परागत रूप से आध्यात्मिक कार्यों के लिए अधिक अनुशंसित है। भौतिक कार्यों के लिए सर्वार्थ सिद्धि अधिक उपयुक्त है।',
    misconception3: '"सिद्ध योग और राहु काल एक दूसरे को रद्द करते हैं" — राहु काल सिद्ध योग को पूरी तरह रद्द नहीं करता, लेकिन राहु काल की अवधि में किए गए कार्य योग का लाभ नहीं ले सकते।',
    seeAlso: 'यह भी देखें',
  },
};

// Siddha Yoga formation table for visual display
const SIDDHA_TABLE = [
  { vara: { en: 'Sunday', hi: 'रविवार' }, tithis: { en: 'Chaturthi (4), Navami (9), Chaturdashi (14)', hi: 'चतुर्थी (4), नवमी (9), चतुर्दशी (14)' } },
  { vara: { en: 'Monday', hi: 'सोमवार' }, tithis: { en: 'Shashti (6), Ekadashi (11), Purnima (15)', hi: 'षष्ठी (6), एकादशी (11), पूर्णिमा (15)' } },
  { vara: { en: 'Tuesday', hi: 'मंगलवार' }, tithis: { en: 'Tritiya (3), Ashtami (8), Trayodashi (13)', hi: 'तृतीया (3), अष्टमी (8), त्रयोदशी (13)' } },
  { vara: { en: 'Wednesday', hi: 'बुधवार' }, tithis: { en: 'Panchami (5), Dashami (10), Amavasya (30)', hi: 'पंचमी (5), दशमी (10), अमावस्या (30)' } },
  { vara: { en: 'Thursday', hi: 'गुरुवार' }, tithis: { en: 'Dwitiya (2), Saptami (7), Dwadashi (12)', hi: 'द्वितीया (2), सप्तमी (7), द्वादशी (12)' } },
  { vara: { en: 'Friday', hi: 'शुक्रवार' }, tithis: { en: 'Pratipada (1), Shashti (6), Ekadashi (11)', hi: 'प्रतिपदा (1), षष्ठी (6), एकादशी (11)' } },
  { vara: { en: 'Saturday', hi: 'शनिवार' }, tithis: { en: 'Tritiya (3), Saptami (7), Dwadashi (12)', hi: 'तृतीया (3), सप्तमी (7), द्वादशी (12)' } },
];

export default function LearnSiddhaYogaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const activityItems = L.activityItems.split('|');

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap size={32} className="text-gold-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={headingFont}>
              {L.title}
            </h1>
          </div>
          <p className="text-text-secondary text-lg ml-11">{L.subtitle}</p>
        </motion.div>

        <LessonSection number={1} title={L.whatIs}>
          <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
        </LessonSection>

        <LessonSection number={2} title={L.formation} variant="highlight">
          <p className="text-text-primary leading-relaxed mb-4">{L.formationText}</p>
          <div className="space-y-3">
            {SIDDHA_TABLE.map((row, i) => (
              <div key={i} className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                <h4 className="font-semibold text-gold-light mb-1" style={headingFont}>
                  {locale === 'hi' ? row.vara.hi : row.vara.en}
                </h4>
                <p className="text-text-secondary text-sm">
                  {locale === 'hi' ? row.tithis.hi : row.tithis.en}
                </p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm mt-4 leading-relaxed">{L.formationNote}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={3} title={L.distinction} variant="formula">
          <p className="text-text-primary leading-relaxed mb-3">{L.distinctionText}</p>
          <div className="space-y-2">
            <div className="rounded-xl border border-gold-primary/15 bg-gold-primary/5 p-3">
              <p className="text-text-primary text-sm">{L.distSiddha}</p>
            </div>
            <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-3">
              <p className="text-text-primary text-sm">{L.distSiddhi}</p>
            </div>
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3">
              <p className="text-text-primary text-sm">{L.distAmrit}</p>
            </div>
          </div>
        </LessonSection>

        <LessonSection number={4} title={L.recommended}>
          <ul className="space-y-2 ml-1">
            {activityItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        <LessonSection number={5} title={L.spiritual} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.spiritualText}</p>
        </LessonSection>

        <LessonSection number={6} title={L.frequency}>
          <p className="text-text-primary leading-relaxed">{L.frequencyText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={7} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="sy-myth1" title={locale === 'hi' ? '"सिद्ध योग = सिद्धि योग"' : '"Siddha = Siddhi Yoga"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="sy-myth2" title={locale === 'hi' ? '"व्यवसाय के लिए अच्छा"' : '"Good for business"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="sy-myth3" title={locale === 'hi' ? '"राहु काल से रद्द"' : '"Cancelled by Rahu Kaal"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception3}</p>
            </InfoBlock>
          </div>
        </LessonSection>

        <GoldDivider className="mt-8" />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/learn/amrit-siddhi-yoga' as const, label: locale === 'hi' ? 'अमृत सिद्धि योग' : 'Amrit Siddhi Yoga' },
              { href: '/learn/sarvartha-siddhi-yoga' as const, label: locale === 'hi' ? 'सर्वार्थ सिद्धि योग' : 'Sarvartha Siddhi Yoga' },
              { href: '/learn/yogas' as const, label: locale === 'hi' ? '27 नित्य योग' : '27 Nitya Yogas' },
              { href: '/panchang' as const, label: locale === 'hi' ? 'पंचांग' : 'Panchang' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
