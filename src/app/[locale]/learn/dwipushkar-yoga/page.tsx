'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Dwipushkar Yoga',
    subtitle: 'The "Double Results" Yoga — Actions Produce Twice the Fruit',
    whatIs: 'What is Dwipushkar Yoga?',
    whatIsText: 'Dwipushkar Yoga (Sanskrit: द्विपुष्करयोग, "double lotuses") is a special muhurta yoga where the results of any action — positive OR negative — are believed to be doubled. Unlike most auspicious yogas, Dwipushkar is a neutral amplifier: good deeds yield double merit, but negative actions also produce double consequences. This makes timing critical and demands conscious, positive action.',
    formation: 'Formation Rules',
    formationText: 'Dwipushkar Yoga requires ALL THREE conditions to be met simultaneously:',
    tithiRule: 'Tithi: Dwitiya (2), Saptami (7), or Dwadashi (12) — in either Shukla or Krishna Paksha',
    nakshatraRule: 'Nakshatra: Mrigashira (5), Chitra (14), or Dhanishta (23)',
    varaRule: 'Vara: Sunday (0), Tuesday (2), or Saturday (6)',
    formationNote: 'All three nakshatras share a common thread — they are each the 5th nakshatra in their respective group of 9 (Mrigashira in group 1, Chitra in group 2, Dhanishta in group 3). The tithis 2, 7, 12 are separated by exactly 5. This mathematical pattern of "fives" is the structural basis of the yoga.',
    caution: 'The Double-Edged Sword',
    cautionText: 'Dwipushkar Yoga amplifies ALL results, not just positive ones. This is its most important characteristic and the reason it is treated with both excitement and caution:',
    doItems: 'Charity and donations — merit is doubled|Puja, prayers, and spiritual practices|Starting positive ventures with clear intentions|Helping others — the karma return is amplified|Planting trees, constructive agriculture',
    dontItems: 'Arguments, fights, or legal disputes — conflict doubles|Risky investments or gambling — losses can double|Signing contracts under pressure — regret doubles|Starting ventures with unclear or selfish intent|Lending money — default risk doubles',
    frequency: 'Frequency',
    frequencyText: 'Dwipushkar Yoga occurs approximately 2-3 times per month. The three tithis (2, 7, 12) each occur twice per lunar month (once in Shukla and once in Krishna Paksha), giving 6 tithi windows per month. Each must align with one of 3 nakshatras and one of 3 weekdays, making the triple alignment moderately common.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Dwipushkar is always auspicious" — It is NOT inherently auspicious or inauspicious. It is an amplifier. Starting a fight on a Dwipushkar day does not bring double blessings — it brings double trouble.',
    misconception2: '"Dwipushkar means doing things twice" — The name "double lotus" refers to double results, not double actions. You do not need to perform activities twice.',
    misconception3: '"Dwipushkar is stronger than Tripushkar" — Actually, Tripushkar (triple results) is considered stronger. However, Dwipushkar occurs more frequently, making it more practically useful for timing positive activities.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'द्विपुष्कर योग',
    subtitle: '"दोगुने फल" का योग — कार्यों का दोगुना परिणाम',
    whatIs: 'द्विपुष्कर योग क्या है?',
    whatIsText: 'द्विपुष्कर योग (संस्कृत: द्विपुष्करयोग, "दो कमल") एक विशेष मुहूर्त योग है जहां किसी भी कार्य के परिणाम — सकारात्मक या नकारात्मक — दोगुने माने जाते हैं। अधिकांश शुभ योगों के विपरीत, द्विपुष्कर एक तटस्थ प्रवर्धक है: अच्छे कार्य दोगुना पुण्य देते हैं, लेकिन नकारात्मक कार्य भी दोगुने परिणाम लाते हैं।',
    formation: 'निर्माण नियम',
    formationText: 'द्विपुष्कर योग के लिए तीनों शर्तें एक साथ पूरी होनी चाहिए:',
    tithiRule: 'तिथि: द्वितीया (2), सप्तमी (7), या द्वादशी (12) — शुक्ल या कृष्ण पक्ष में',
    nakshatraRule: 'नक्षत्र: मृगशिरा (5), चित्रा (14), या धनिष्ठा (23)',
    varaRule: 'वार: रविवार (0), मंगलवार (2), या शनिवार (6)',
    formationNote: 'तीनों नक्षत्र एक समान सूत्र साझा करते हैं — प्रत्येक अपने 9 नक्षत्रों के समूह में 5वां है। तिथि 2, 7, 12 ठीक 5 के अंतर पर हैं। "पाँच" का यह गणितीय प्रतिरूप योग का संरचनात्मक आधार है।',
    caution: 'दोधारी तलवार',
    cautionText: 'द्विपुष्कर योग सभी परिणामों को बढ़ाता है, केवल सकारात्मक नहीं:',
    doItems: 'दान और दक्षिणा — पुण्य दोगुना|पूजा, प्रार्थना और आध्यात्मिक साधना|स्पष्ट इरादों के साथ सकारात्मक उद्यम शुरू करना|दूसरों की मदद — कर्म प्रतिफल बढ़ता है|वृक्षारोपण, रचनात्मक कृषि',
    dontItems: 'बहस, लड़ाई या कानूनी विवाद — संघर्ष दोगुना|जोखिमपूर्ण निवेश या जुआ — हानि दोगुनी|दबाव में अनुबंध — पछतावा दोगुना|अस्पष्ट या स्वार्थी इरादे से उद्यम|उधार देना — चूक का जोखिम दोगुना',
    frequency: 'आवृत्ति',
    frequencyText: 'द्विपुष्कर योग लगभग महीने में 2-3 बार होता है। तीन तिथियाँ (2, 7, 12) प्रत्येक चंद्र मास में दो बार आती हैं, इन्हें 3 नक्षत्रों और 3 वारों के साथ संरेखित होना चाहिए।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"द्विपुष्कर हमेशा शुभ है" — यह स्वाभाविक रूप से शुभ या अशुभ नहीं है। यह एक प्रवर्धक है। द्विपुष्कर के दिन लड़ाई शुरू करना दोगुना आशीर्वाद नहीं — दोगुना संकट लाता है।',
    misconception2: '"द्विपुष्कर का अर्थ है चीजें दो बार करना" — "दो कमल" नाम दोगुने परिणामों को संदर्भित करता है, दोगुने कार्यों को नहीं।',
    misconception3: '"द्विपुष्कर त्रिपुष्कर से मजबूत है" — वास्तव में, त्रिपुष्कर (तीन गुना परिणाम) अधिक मजबूत माना जाता है। लेकिन द्विपुष्कर अधिक बार होता है।',
    seeAlso: 'यह भी देखें',
  },
};

export default function LearnDwipushkarYogaPage() {
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
            <Copy size={32} className="text-gold-primary" />
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

        <GoldDivider />

        <LessonSection number={3} title={L.caution} variant="highlight">
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

        <LessonSection number={4} title={L.frequency}>
          <p className="text-text-primary leading-relaxed">{L.frequencyText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={5} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="dp-myth1" title={locale === 'hi' ? '"हमेशा शुभ"' : '"Always auspicious"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="dp-myth2" title={locale === 'hi' ? '"चीजें दो बार करना"' : '"Doing things twice"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="dp-myth3" title={locale === 'hi' ? '"त्रिपुष्कर से मजबूत"' : '"Stronger than Tripushkar"'}>
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
              { href: '/learn/tripushkar-yoga' as const, label: locale === 'hi' ? 'त्रिपुष्कर योग' : 'Tripushkar Yoga' },
              { href: '/learn/sarvartha-siddhi-yoga' as const, label: locale === 'hi' ? 'सर्वार्थ सिद्धि योग' : 'Sarvartha Siddhi Yoga' },
              { href: '/learn/muhurtas' as const, label: locale === 'hi' ? 'मुहूर्त' : 'Muhurtas' },
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
