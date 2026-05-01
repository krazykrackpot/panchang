'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Droplets, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Amrit Siddhi Yoga',
    subtitle: 'The Nectar of Success — Most Powerful Vara-Nakshatra Yoga',
    whatIs: 'What is Amrit Siddhi Yoga?',
    whatIsText: 'Amrit Siddhi Yoga (Sanskrit: अमृतसिद्धियोग, "nectar of accomplishment") is the most powerful of all vara-nakshatra yogas. It forms from only 7 specific weekday + nakshatra pairs — one unique combination per day of the week. When active, it is considered supremely auspicious for ANY important activity, overriding most minor inauspicious factors. Classical texts describe it as the "amrit" (nectar) that ensures success.',
    formation: 'The 7 Sacred Combinations',
    formationText: 'Each day of the week has exactly one nakshatra that forms Amrit Siddhi Yoga. These are fixed and come from the Muhurta Deepika:',
    recommended: 'Recommended Activities',
    recommendedText: 'Amrit Siddhi Yoga is considered universally beneficial — there is no restriction on the type of activity. It is especially recommended for:',
    activityItems: 'Any major life decision or undertaking|Starting a business, signing deals|Education, examinations, interviews|Medical procedures and treatments|Property purchase, construction|Marriage muhurta (when combined with other factors)|Travel and pilgrimage|Spiritual initiation and mantra diksha',
    frequency: 'Frequency',
    frequencyText: 'Amrit Siddhi Yoga occurs approximately 2-3 times per month. Since each weekday has only one qualifying nakshatra, and the Moon takes about 1 day per nakshatra, the specific weekday-nakshatra alignment happens roughly once every 4 weeks per combination. With 7 combinations across the week, the total frequency averages 2-3 occurrences monthly.',
    power: 'Why It Overrides Minor Doshas',
    powerText: 'Classical muhurta texts rank Amrit Siddhi above Sarvartha Siddhi in potency. While Sarvartha Siddhi is cancelled by Rahu Kaal and Bhadra Karana, Amrit Siddhi is considered strong enough to override minor inauspicious factors (though not eclipses or major doshas). This is why experienced jyotishis specifically seek Amrit Siddhi windows for important muhurtas.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Amrit Siddhi and Sarvartha Siddhi are the same" — They are different yogas with different tables. Sarvartha Siddhi has 40+ qualifying combinations and occurs frequently. Amrit Siddhi has exactly 7 combinations and is much rarer and more powerful.',
    misconception2: '"Amrit Siddhi overrides everything" — While it overrides minor doshas, it does NOT override eclipses, combustion of the Moon, or major personal doshas in the birth chart. It is a transit-level auspiciousness, not a natal-level remedy.',
    misconception3: '"You must wait for Amrit Siddhi for important work" — While ideal, waiting months for the perfect alignment is impractical. Sarvartha Siddhi or Siddha Yoga combined with a good nakshatra and no Rahu Kaal is a perfectly acceptable alternative.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'अमृत सिद्धि योग',
    subtitle: 'सफलता का अमृत — सबसे शक्तिशाली वार-नक्षत्र योग',
    whatIs: 'अमृत सिद्धि योग क्या है?',
    whatIsText: 'अमृत सिद्धि योग (संस्कृत: अमृतसिद्धियोग, "उपलब्धि का अमृत") सभी वार-नक्षत्र योगों में सबसे शक्तिशाली है। यह केवल 7 विशिष्ट वार + नक्षत्र जोड़ियों से बनता है। जब सक्रिय होता है, तो यह किसी भी महत्वपूर्ण कार्य के लिए परम शुभ माना जाता है।',
    formation: '7 पवित्र संयोग',
    formationText: 'सप्ताह के प्रत्येक दिन का एक ही नक्षत्र है जो अमृत सिद्धि योग बनाता है। ये मुहूर्त दीपिका से हैं:',
    recommended: 'अनुशंसित कार्य',
    recommendedText: 'अमृत सिद्धि योग सार्वभौमिक रूप से लाभकारी माना जाता है — कार्य के प्रकार पर कोई प्रतिबंध नहीं है:',
    activityItems: 'कोई भी बड़ा जीवन निर्णय या कार्य|व्यवसाय शुरू करना, सौदे पर हस्ताक्षर|शिक्षा, परीक्षा, साक्षात्कार|चिकित्सा प्रक्रिया और उपचार|संपत्ति खरीद, निर्माण|विवाह मुहूर्त (अन्य कारकों के साथ)|यात्रा और तीर्थयात्रा|आध्यात्मिक दीक्षा और मंत्र दीक्षा',
    frequency: 'आवृत्ति',
    frequencyText: 'अमृत सिद्धि योग लगभग महीने में 2-3 बार होता है। चूंकि प्रत्येक वार का केवल एक योग्य नक्षत्र है, यह संयोग काफी दुर्लभ है।',
    power: 'यह लघु दोषों को क्यों रद्द करता है',
    powerText: 'शास्त्रीय मुहूर्त ग्रंथ अमृत सिद्धि को सर्वार्थ सिद्धि से ऊपर रखते हैं। जबकि सर्वार्थ सिद्धि राहु काल और भद्रा करण से रद्द हो जाता है, अमृत सिद्धि लघु अशुभ कारकों को रद्द करने में सक्षम माना जाता है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"अमृत सिद्धि और सर्वार्थ सिद्धि एक ही हैं" — ये अलग-अलग सारणियों वाले भिन्न योग हैं। सर्वार्थ सिद्धि में 40+ संयोग हैं, अमृत सिद्धि में केवल 7।',
    misconception2: '"अमृत सिद्धि सब कुछ रद्द कर देता है" — यह लघु दोषों को रद्द करता है, लेकिन ग्रहण, चन्द्रमा का अस्तत्व या जन्मकुंडली के प्रमुख दोषों को नहीं।',
    misconception3: '"महत्वपूर्ण कार्य के लिए अमृत सिद्धि की प्रतीक्षा करनी चाहिए" — आदर्श होते हुए भी, महीनों प्रतीक्षा करना व्यावहारिक नहीं है। सर्वार्थ सिद्धि या सिद्ध योग भी स्वीकार्य विकल्प हैं।',
    seeAlso: 'यह भी देखें',
  },
};

// The 7 Amrit Siddhi combinations (from panchang-calc.ts AMRIT_SIDDHI_TABLE)
const AMRIT_COMBINATIONS = [
  { vara: { en: 'Sunday', hi: 'रविवार' }, nakshatra: { en: 'Hasta', hi: 'हस्त' }, nakshatraId: 13, ruler: { en: 'Moon', hi: 'चन्द्र' } },
  { vara: { en: 'Monday', hi: 'सोमवार' }, nakshatra: { en: 'Mrigashira', hi: 'मृगशिरा' }, nakshatraId: 5, ruler: { en: 'Mars', hi: 'मंगल' } },
  { vara: { en: 'Tuesday', hi: 'मंगलवार' }, nakshatra: { en: 'Ashwini', hi: 'अश्विनी' }, nakshatraId: 1, ruler: { en: 'Ketu', hi: 'केतु' } },
  { vara: { en: 'Wednesday', hi: 'बुधवार' }, nakshatra: { en: 'Anuradha', hi: 'अनुराधा' }, nakshatraId: 17, ruler: { en: 'Saturn', hi: 'शनि' } },
  { vara: { en: 'Thursday', hi: 'गुरुवार' }, nakshatra: { en: 'Pushya', hi: 'पुष्य' }, nakshatraId: 8, ruler: { en: 'Saturn', hi: 'शनि' } },
  { vara: { en: 'Friday', hi: 'शुक्रवार' }, nakshatra: { en: 'Revati', hi: 'रेवती' }, nakshatraId: 27, ruler: { en: 'Mercury', hi: 'बुध' } },
  { vara: { en: 'Saturday', hi: 'शनिवार' }, nakshatra: { en: 'Rohini', hi: 'रोहिणी' }, nakshatraId: 4, ruler: { en: 'Moon', hi: 'चन्द्र' } },
];

export default function LearnAmritSiddhiYogaPage() {
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
            <Droplets size={32} className="text-gold-primary" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AMRIT_COMBINATIONS.map((combo, i) => (
              <div key={i} className="rounded-xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} className="text-amber-400" />
                  <h4 className="font-semibold text-gold-light" style={headingFont}>
                    {locale === 'hi' ? combo.vara.hi : combo.vara.en}
                  </h4>
                </div>
                <p className="text-text-primary text-sm">
                  {locale === 'hi' ? combo.nakshatra.hi : combo.nakshatra.en}
                  <span className="text-text-secondary ml-1">({locale === 'hi' ? combo.ruler.hi : combo.ruler.en})</span>
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={3} title={L.recommended}>
          <p className="text-text-primary leading-relaxed mb-3">{L.recommendedText}</p>
          <ul className="space-y-2 ml-1">
            {activityItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        <LessonSection number={4} title={L.frequency}>
          <p className="text-text-primary leading-relaxed">{L.frequencyText}</p>
        </LessonSection>

        <LessonSection number={5} title={L.power} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.powerText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={6} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="as-myth1" title={locale === 'hi' ? '"अमृत सिद्धि = सर्वार्थ सिद्धि"' : '"Same as Sarvartha Siddhi"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="as-myth2" title={locale === 'hi' ? '"सब कुछ रद्द करता है"' : '"Overrides everything"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="as-myth3" title={locale === 'hi' ? '"इसकी प्रतीक्षा ज़रूरी"' : '"Must wait for it"'}>
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
              { href: '/learn/sarvartha-siddhi-yoga' as const, label: locale === 'hi' ? 'सर्वार्थ सिद्धि योग' : 'Sarvartha Siddhi Yoga' },
              { href: '/learn/siddha-yoga' as const, label: locale === 'hi' ? 'सिद्ध योग' : 'Siddha Yoga' },
              { href: '/learn/guru-pushya-yoga' as const, label: locale === 'hi' ? 'गुरु पुष्य योग' : 'Guru Pushya Yoga' },
              { href: '/learn/muhurtas' as const, label: locale === 'hi' ? 'मुहूर्त' : 'Muhurtas' },
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
