'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Layers, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Tripushkar Yoga',
    subtitle: 'The "Triple Results" Yoga — Stronger Sibling of Dwipushkar',
    whatIs: 'What is Tripushkar Yoga?',
    whatIsText: 'Tripushkar Yoga (Sanskrit: त्रिपुष्करयोग, "triple lotuses") is a rare and powerful muhurta yoga where the results of any action are believed to be tripled. Like its sibling Dwipushkar (double results), Tripushkar is a neutral amplifier — it magnifies both positive and negative outcomes. The triple amplification makes it even more consequential, demanding extra care in how the day is spent.',
    formation: 'Formation Rules',
    formationText: 'Tripushkar Yoga requires ALL THREE conditions simultaneously:',
    tithiRule: 'Tithi: Dwitiya (2), Saptami (7), or Dwadashi (12) — same as Dwipushkar',
    nakshatraRule: 'Nakshatra: Krittika (3), Punarvasu (7), Vishakha (16), or U.Bhadrapada (26)',
    varaRule: 'Vara: Sunday (0), Tuesday (2), or Saturday (6) — same as Dwipushkar',
    formationNote: 'Note: Tripushkar shares the same tithis and varas as Dwipushkar — the difference is entirely in the nakshatras. While Dwipushkar uses Mrigashira (5), Chitra (14), Dhanishta (23), Tripushkar uses Krittika (3), Punarvasu (7), Vishakha (16), U.Bhadrapada (26). The four Tripushkar nakshatras are each associated with strong, transformative energies.',
    comparison: 'Dwipushkar vs Tripushkar',
    comparisonText: 'Both yogas share the same tithi and vara requirements. The only difference is the nakshatra:',
    compDwi: 'Dwipushkar: Mrigashira, Chitra, Dhanishta (3 nakshatras) — Double results',
    compTri: 'Tripushkar: Krittika, Punarvasu, Vishakha, U.Bhadrapada (4 nakshatras) — Triple results',
    compNote: 'Despite having 4 qualifying nakshatras (vs 3 for Dwipushkar), Tripushkar is rarer in practice because the specific tithi + vara + nakshatra alignment is less frequent.',
    caution: 'Triple Amplification — Handle with Care',
    cautionText: 'The triple amplification makes Tripushkar even more consequential than Dwipushkar:',
    doItems: 'Charity and religious donations — triple merit|Mantra japa and spiritual sadhana — triple potency|Starting well-planned positive ventures|Performing weddings (if other muhurta factors are good)|Constructive community service',
    dontItems: 'Arguments, conflicts, or violence — triple negative karma|Risky financial speculation — triple loss potential|Starting ventures born of anger or greed|Court cases or adversarial proceedings|Destructive actions of any kind',
    frequency: 'Frequency',
    frequencyText: 'Tripushkar Yoga is rarer than Dwipushkar, occurring roughly 1-2 times per month. The triple alignment of specific tithi + specific nakshatra + specific vara makes it an infrequent occurrence, which adds to its significance in muhurta selection.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Tripushkar is three times as auspicious as a normal day" — It is three times as AMPLIFIED, not three times as auspicious. Bad actions get tripled too. The yoga is a multiplier, not a blessing.',
    misconception2: '"Tripushkar is just Dwipushkar with a different name" — They are distinct yogas with different qualifying nakshatras. The formation tables in classical texts list them separately, and their effects differ in intensity.',
    misconception3: '"Tripushkar is rare enough to be impractical" — While rarer than Dwipushkar or Sarvartha Siddhi, it still occurs 1-2 times per month. Tracking it on a panchang is straightforward.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'त्रिपुष्कर योग',
    subtitle: '"तीन गुना फल" का योग — द्विपुष्कर का शक्तिशाली भाई',
    whatIs: 'त्रिपुष्कर योग क्या है?',
    whatIsText: 'त्रिपुष्कर योग (संस्कृत: त्रिपुष्करयोग, "तीन कमल") एक दुर्लभ और शक्तिशाली मुहूर्त योग है जहां किसी भी कार्य के परिणाम तीन गुना माने जाते हैं। अपने भाई द्विपुष्कर (दोगुना परिणाम) की तरह, यह एक तटस्थ प्रवर्धक है — सकारात्मक और नकारात्मक दोनों परिणामों को बढ़ाता है।',
    formation: 'निर्माण नियम',
    formationText: 'त्रिपुष्कर योग के लिए तीनों शर्तें एक साथ पूरी होनी चाहिए:',
    tithiRule: 'तिथि: द्वितीया (2), सप्तमी (7), या द्वादशी (12) — द्विपुष्कर जैसी',
    nakshatraRule: 'नक्षत्र: कृत्तिका (3), पुनर्वसु (7), विशाखा (16), या उ.भाद्रपद (26)',
    varaRule: 'वार: रविवार (0), मंगलवार (2), या शनिवार (6) — द्विपुष्कर जैसा',
    formationNote: 'त्रिपुष्कर द्विपुष्कर के समान तिथि और वार साझा करता है — अंतर केवल नक्षत्रों में है। द्विपुष्कर मृगशिरा (5), चित्रा (14), धनिष्ठा (23) का उपयोग करता है; त्रिपुष्कर कृत्तिका (3), पुनर्वसु (7), विशाखा (16), उ.भाद्रपद (26) का।',
    comparison: 'द्विपुष्कर बनाम त्रिपुष्कर',
    comparisonText: 'दोनों योग समान तिथि और वार आवश्यकताएँ साझा करते हैं। अंतर केवल नक्षत्र में है:',
    compDwi: 'द्विपुष्कर: मृगशिरा, चित्रा, धनिष्ठा (3 नक्षत्र) — दोगुने परिणाम',
    compTri: 'त्रिपुष्कर: कृत्तिका, पुनर्वसु, विशाखा, उ.भाद्रपद (4 नक्षत्र) — तीन गुने परिणाम',
    compNote: '4 योग्य नक्षत्र होने के बावजूद, त्रिपुष्कर व्यवहार में दुर्लभ है क्योंकि तिथि + वार + नक्षत्र का विशिष्ट संरेखण कम होता है।',
    caution: 'तीन गुना प्रवर्धन — सावधानी से संभालें',
    cautionText: 'तीन गुना प्रवर्धन त्रिपुष्कर को द्विपुष्कर से और अधिक महत्वपूर्ण बनाता है:',
    doItems: 'दान और धार्मिक दक्षिणा — तीन गुना पुण्य|मंत्र जप और आध्यात्मिक साधना — तीन गुना शक्ति|सुनियोजित सकारात्मक उद्यम शुरू करना|विवाह (यदि अन्य मुहूर्त कारक अच्छे हैं)|रचनात्मक सामुदायिक सेवा',
    dontItems: 'बहस, संघर्ष या हिंसा — तीन गुना नकारात्मक कर्म|जोखिमपूर्ण वित्तीय सट्टा — तीन गुना हानि|क्रोध या लोभ से जन्मे उद्यम|न्यायालय मामले या प्रतिकूल कार्यवाही|किसी भी प्रकार के विनाशकारी कार्य',
    frequency: 'आवृत्ति',
    frequencyText: 'त्रिपुष्कर योग द्विपुष्कर से दुर्लभ है, लगभग महीने में 1-2 बार होता है। तिथि + नक्षत्र + वार का विशिष्ट त्रिगुट संरेखण इसे कम बार होने वाला बनाता है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"त्रिपुष्कर सामान्य दिन से तीन गुना शुभ है" — यह तीन गुना प्रवर्धित है, तीन गुना शुभ नहीं। बुरे कार्य भी तीन गुने होते हैं।',
    misconception2: '"त्रिपुष्कर द्विपुष्कर का दूसरा नाम है" — ये अलग-अलग योग्य नक्षत्रों वाले विभिन्न योग हैं।',
    misconception3: '"त्रिपुष्कर इतना दुर्लभ है कि अव्यावहारिक है" — यह महीने में 1-2 बार होता है। पंचांग पर ट्रैक करना सरल है।',
    seeAlso: 'यह भी देखें',
  },
};

export default function LearnTripushkarYogaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const doItems = L.doItems.split('|');
  const dontItems = L.dontItems.split('|');

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
            <Layers size={32} className="text-gold-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={headingFont}>
              {L.title}
            </h1>
          </div>
          <p className="text-text-secondary text-lg ml-11">{L.subtitle}</p>
        </motion.div>

        <LessonSection number={1} title={L.whatIs}>
          <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
        </LessonSection>

        <LessonSection number={2} title={L.formation} variant="formula">
          <p className="text-text-primary leading-relaxed mb-4">{L.formationText}</p>
          <div className="space-y-3">
            {[L.tithiRule, L.nakshatraRule, L.varaRule].map((rule, i) => (
              <div key={i} className="rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-3">
                <p className="text-text-primary text-sm">{rule}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm mt-4 leading-relaxed">{L.formationNote}</p>
        </LessonSection>

        <LessonSection number={3} title={L.comparison}>
          <p className="text-text-primary leading-relaxed mb-3">{L.comparisonText}</p>
          <div className="space-y-2">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-text-primary text-sm">{L.compDwi}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-text-primary text-sm">{L.compTri}</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm mt-3 leading-relaxed">{L.compNote}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={4} title={L.caution} variant="highlight">
          <p className="text-text-primary leading-relaxed mb-4">{L.cautionText}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-emerald-400 mb-2" style={headingFont}>
                {locale === 'hi' ? 'करें' : 'DO'}
              </h4>
              <ul className="space-y-2">
                {doItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-primary text-sm">
                    <CheckCircle size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2" style={headingFont}>
                {locale === 'hi' ? 'न करें' : 'AVOID'}
              </h4>
              <ul className="space-y-2">
                {dontItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text-primary text-sm">
                    <AlertTriangle size={14} className="text-red-400 mt-1 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LessonSection>

        <LessonSection number={5} title={L.frequency}>
          <p className="text-text-primary leading-relaxed">{L.frequencyText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={6} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="tp-myth1" title={locale === 'hi' ? '"तीन गुना शुभ"' : '"Three times as auspicious"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="tp-myth2" title={locale === 'hi' ? '"द्विपुष्कर का दूसरा नाम"' : '"Just another name for Dwipushkar"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="tp-myth3" title={locale === 'hi' ? '"बहुत दुर्लभ"' : '"Too rare to be practical"'}>
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
              { href: '/learn/dwipushkar-yoga' as const, label: locale === 'hi' ? 'द्विपुष्कर योग' : 'Dwipushkar Yoga' },
              { href: '/learn/sarvartha-siddhi-yoga' as const, label: locale === 'hi' ? 'सर्वार्थ सिद्धि योग' : 'Sarvartha Siddhi Yoga' },
              { href: '/learn/amrit-siddhi-yoga' as const, label: locale === 'hi' ? 'अमृत सिद्धि योग' : 'Amrit Siddhi Yoga' },
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
