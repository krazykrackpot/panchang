'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, AlertTriangle, Shield, Flame, DollarSign, Navigation, Skull, HeartPulse, ArrowLeft } from 'lucide-react';
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
    title: 'Panchak',
    subtitle: 'The 5 Inauspicious Nakshatras',
    whatIs: 'What is Panchak?',
    whatIsText: 'Panchak (Sanskrit: पञ्चक, "group of five") is an inauspicious period in Vedic astrology that occurs when the Moon transits through the last five nakshatras of the zodiac — Dhanishtha (23), Shatabhisha (24), Purva Bhadrapada (25), Uttara Bhadrapada (26), and Revati (27). These five nakshatras span the signs of Aquarius and Pisces, the final segment of the 27-nakshatra cycle.',
    whyInauspicious: 'Why is Panchak Inauspicious?',
    whyInauspiciousText: 'Each of the five Panchak nakshatras carries a specific fear or negative energy. Classical texts like the Dharma Sindhu and Nirnaya Sindhu associate each nakshatra with a particular type of danger. The combined energy of these five consecutive nakshatras is considered unfavorable for initiating important activities.',
    fiveNakshatras: 'The Five Panchak Nakshatras',
    dhanishtha: 'Dhanishtha Panchak — Fear of Death',
    dhanishthaText: 'When the Moon transits Dhanishtha, cremation and funeral rites should be avoided. If unavoidable, 5 effigies (putlas) must be made and cremated alongside the body to protect surviving family members.',
    shatabhisha: 'Shatabhisha Panchak — Fear of Disease',
    shatabhishaText: 'Moon in Shatabhisha brings health-related fears. Starting new medical treatments, surgeries, or health regimens during this period is traditionally avoided.',
    purvaBhadra: 'Purva Bhadrapada Panchak — Fear of Fire',
    purvaBhadraText: 'This nakshatra carries fire-related dangers. Collecting wood or fuel, building roofs, and any construction activity involving fire (kilns, furnaces) should be avoided.',
    uttaraBhadra: 'Uttara Bhadrapada Panchak — Fear of Financial Loss',
    uttaraBhadraText: 'Major financial decisions, large purchases, signing contracts, and business investments are discouraged during this nakshatra. The energy favors conservation over expansion.',
    revati: 'Revati Panchak — Fear of Travel Danger',
    revatiText: 'Southward journeys are specifically warned against during Revati Panchak. Long-distance travel and relocation are also considered risky.',
    activitiesToAvoid: 'Activities to Avoid During Panchak',
    avoidItems: 'Collecting wood, straw, or fuel|Building or repairing roofs and ceilings|Starting journeys toward the south|Making new beds, cots, or mattresses|Cremation without special rituals (5 effigies)',
    cremationRules: 'Special Cremation Rules During Panchak',
    cremationText: 'If a death occurs during Panchak, the cremation cannot simply be postponed — specific protective rituals are required. Five effigies (putlas) made of grass, flour, or cloth are created and placed on the funeral pyre alongside the deceased. Each effigy represents protection for the surviving family members. This ritual, known as Panchak Shanti, neutralizes the inauspicious energy. The effigies are believed to absorb the negative influence that would otherwise affect the living.',
    duration: 'Duration and Frequency',
    durationText: 'Panchak typically lasts about 2.5 days (approximately 60 hours). Since each nakshatra spans about 13 degrees 20 minutes of arc, and the Moon moves through approximately 13.2 degrees per day, each nakshatra takes roughly 1 day to transit. Five consecutive nakshatras therefore take about 5 days in total, but Panchak is specifically calculated from the Moon entering Dhanishtha to leaving Revati.',
    calculation: 'How Panchak is Calculated',
    calculationText: 'Panchak is determined by the Moon\'s nakshatra position. When the Moon is in any nakshatra numbered 23 through 27 (Dhanishtha through Revati), Panchak is active. This corresponds to the Moon being between approximately 293\u00b020\' and 360\u00b0 of sidereal longitude — the Aquarius-Pisces segment of the zodiac.',
    regional: 'Regional Variations',
    regionalText: 'Panchak is most strictly observed in North India, particularly in Uttar Pradesh, Bihar, Rajasthan, and Madhya Pradesh. In South India, the equivalent concept exists but is observed with less strictness. Some communities consider only Dhanishtha (death Panchak) and Purva Bhadrapada (fire Panchak) as strictly inauspicious, while treating the other three as mildly cautionary.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Nothing good can happen during Panchak" — This is false. Panchak restricts only specific activities (wood gathering, roof building, southward travel, bed making, cremation). Routine daily activities, spiritual practices, and emergency actions are not restricted.',
    misconception2: '"Panchak applies equally everywhere" — Observance varies significantly by region and community. South Indian traditions treat it differently from North Indian ones.',
    misconception3: '"All travel is forbidden" — Only southward journeys are specifically warned against in classical texts. Other directions are not restricted.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'पंचक',
    subtitle: '5 अशुभ नक्षत्र',
    whatIs: 'पंचक क्या है?',
    whatIsText: 'पंचक (संस्कृत: पञ्चक, "पाँच का समूह") वैदिक ज्योतिष में एक अशुभ अवधि है जो तब होती है जब चन्द्रमा राशिचक्र के अंतिम पाँच नक्षत्रों — धनिष्ठा (23), शतभिषा (24), पूर्वा भाद्रपद (25), उत्तरा भाद्रपद (26) और रेवती (27) से गुज़रता है।',
    whyInauspicious: 'पंचक अशुभ क्यों है?',
    whyInauspiciousText: 'पंचक के प्रत्येक पाँच नक्षत्रों में एक विशिष्ट भय या नकारात्मक ऊर्जा होती है। धर्म सिन्धु और निर्णय सिन्धु जैसे शास्त्रीय ग्रंथ प्रत्येक नक्षत्र को एक विशेष प्रकार के खतरे से जोड़ते हैं।',
    fiveNakshatras: 'पंचक के पाँच नक्षत्र',
    dhanishtha: 'धनिष्ठा पंचक — मृत्यु का भय',
    dhanishthaText: 'जब चन्द्रमा धनिष्ठा में होता है, तो अंत्येष्टि और श्राद्ध कर्म से बचना चाहिए। यदि अनिवार्य हो, तो शव के साथ 5 पुतले बनाकर दाह करना आवश्यक है।',
    shatabhisha: 'शतभिषा पंचक — रोग का भय',
    shatabhishaText: 'शतभिषा में चन्द्रमा स्वास्थ्य संबंधी भय लाता है। इस अवधि में नई चिकित्सा, शल्यक्रिया या स्वास्थ्य कार्यक्रम शुरू करना परम्परागत रूप से वर्जित है।',
    purvaBhadra: 'पूर्वा भाद्रपद पंचक — अग्नि का भय',
    purvaBhadraText: 'यह नक्षत्र अग्नि संबंधी खतरे लाता है। लकड़ी या ईंधन संग्रह, छत निर्माण, और अग्नि से जुड़ी किसी भी निर्माण गतिविधि से बचना चाहिए।',
    uttaraBhadra: 'उत्तरा भाद्रपद पंचक — आर्थिक हानि का भय',
    uttaraBhadraText: 'बड़े वित्तीय निर्णय, बड़ी खरीदारी, अनुबंध पर हस्ताक्षर और व्यापार निवेश इस नक्षत्र में वर्जित हैं।',
    revati: 'रेवती पंचक — यात्रा के खतरे का भय',
    revatiText: 'रेवती पंचक में विशेष रूप से दक्षिण दिशा की यात्रा से चेतावनी दी जाती है। लम्बी दूरी की यात्रा और स्थानांतरण भी जोखिमपूर्ण माना जाता है।',
    activitiesToAvoid: 'पंचक में वर्जित कार्य',
    avoidItems: 'लकड़ी, भूसा या ईंधन संग्रह|छत या छज्जे का निर्माण या मरम्मत|दक्षिण दिशा की यात्रा|नई शय्या, खाट या गद्दा बनाना|विशेष विधि के बिना अंत्येष्टि (5 पुतले)',
    cremationRules: 'पंचक में अंत्येष्टि के विशेष नियम',
    cremationText: 'यदि पंचक में मृत्यु हो जाए, तो अंत्येष्टि को केवल स्थगित नहीं किया जा सकता — विशेष रक्षात्मक अनुष्ठान आवश्यक हैं। घास, आटा या कपड़े से बने पाँच पुतले बनाए जाते हैं और मृतक के साथ चिता पर रखे जाते हैं।',
    duration: 'अवधि और आवृत्ति',
    durationText: 'पंचक आमतौर पर लगभग 2.5 दिन (लगभग 60 घंटे) तक रहता है। चूंकि प्रत्येक नक्षत्र लगभग 13 अंश 20 कला का होता है, और चन्द्रमा प्रतिदिन लगभग 13.2 अंश चलता है।',
    calculation: 'पंचक की गणना कैसे होती है',
    calculationText: 'पंचक चन्द्रमा की नक्षत्र स्थिति से निर्धारित होता है। जब चन्द्रमा 23 से 27 (धनिष्ठा से रेवती) किसी भी नक्षत्र में हो, तो पंचक सक्रिय होता है।',
    regional: 'क्षेत्रीय भिन्नताएँ',
    regionalText: 'पंचक सबसे कठोरता से उत्तर भारत में मनाया जाता है, विशेषकर उत्तर प्रदेश, बिहार, राजस्थान और मध्य प्रदेश में। दक्षिण भारत में यह कम कठोरता से मनाया जाता है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"पंचक में कुछ भी अच्छा नहीं हो सकता" — यह गलत है। पंचक केवल विशिष्ट कार्यों को प्रतिबंधित करता है। दैनिक गतिविधियाँ, आध्यात्मिक अभ्यास और आपातकालीन कार्य प्रतिबंधित नहीं हैं।',
    misconception2: '"पंचक हर जगह समान रूप से लागू होता है" — पालन क्षेत्र और समुदाय के अनुसार काफी भिन्न होता है।',
    misconception3: '"सभी यात्राएँ वर्जित हैं" — शास्त्रीय ग्रंथों में केवल दक्षिण दिशा की यात्रा से विशेष चेतावनी है। अन्य दिशाएँ प्रतिबंधित नहीं हैं।',
    seeAlso: 'यह भी देखें',
  },
};

// ─── Panchak nakshatra data ───────────────────────────────────
const PANCHAK_NAKSHATRAS = [
  {
    id: 23,
    name: { en: 'Dhanishtha', hi: 'धनिष्ठा' },
    fear: { en: 'Death', hi: 'मृत्यु' },
    icon: Skull,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
    avoid: { en: 'Cremation, funeral rites', hi: 'अंत्येष्टि, श्राद्ध कर्म' },
  },
  {
    id: 24,
    name: { en: 'Shatabhisha', hi: 'शतभिषा' },
    fear: { en: 'Disease', hi: 'रोग' },
    icon: HeartPulse,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    avoid: { en: 'Starting medical treatments, surgery', hi: 'नई चिकित्सा, शल्यक्रिया' },
  },
  {
    id: 25,
    name: { en: 'Purva Bhadrapada', hi: 'पूर्वा भाद्रपद' },
    fear: { en: 'Fire', hi: 'अग्नि' },
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    avoid: { en: 'Collecting fuel, building roofs', hi: 'ईंधन संग्रह, छत निर्माण' },
  },
  {
    id: 26,
    name: { en: 'Uttara Bhadrapada', hi: 'उत्तरा भाद्रपद' },
    fear: { en: 'Financial Loss', hi: 'आर्थिक हानि' },
    icon: DollarSign,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    avoid: { en: 'Major investments, contracts', hi: 'बड़े निवेश, अनुबंध' },
  },
  {
    id: 27,
    name: { en: 'Revati', hi: 'रेवती' },
    fear: { en: 'Travel Danger', hi: 'यात्रा खतरा' },
    icon: Navigation,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    avoid: { en: 'Southward journeys, long-distance travel', hi: 'दक्षिण दिशा की यात्रा' },
  },
];

export default function LearnPanchakPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const avoidItems = L.avoidItems.split('|');

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Moon size={32} className="text-gold-primary" />
            <h1
              className="text-3xl sm:text-4xl font-bold text-gold-light"
              style={headingFont}
            >
              {L.title}
            </h1>
          </div>
          <p className="text-text-secondary text-lg ml-11">{L.subtitle}</p>
        </motion.div>

        {/* What is Panchak */}
        <LessonSection number={1} title={L.whatIs}>
          <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
        </LessonSection>

        {/* Why inauspicious */}
        <LessonSection number={2} title={L.whyInauspicious}>
          <p className="text-text-primary leading-relaxed">{L.whyInauspiciousText}</p>
        </LessonSection>

        {/* The Five Nakshatras */}
        <LessonSection number={3} title={L.fiveNakshatras} variant="highlight">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {PANCHAK_NAKSHATRAS.map((nak) => {
              const Icon = nak.icon;
              return (
                <div
                  key={nak.id}
                  className={`rounded-xl border p-4 ${nak.bgColor}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={20} className={nak.color} />
                    <h4 className="font-semibold text-text-primary" style={headingFont}>
                      {locale === 'hi' ? nak.name.hi : nak.name.en}
                    </h4>
                  </div>
                  <p className={`text-sm font-medium ${nak.color} mb-1`}>
                    {locale === 'hi' ? nak.fear.hi : nak.fear.en}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {locale === 'hi' ? nak.avoid.hi : nak.avoid.en}
                  </p>
                </div>
              );
            })}
          </div>
        </LessonSection>

        {/* Detailed Nakshatra sections */}
        <LessonSection number={4} title={locale === 'hi' ? L.dhanishtha : L.dhanishtha}>
          <p className="text-text-primary leading-relaxed">{L.dhanishthaText}</p>
        </LessonSection>

        <LessonSection title={locale === 'hi' ? L.shatabhisha : L.shatabhisha}>
          <p className="text-text-primary leading-relaxed">{L.shatabhishaText}</p>
        </LessonSection>

        <LessonSection title={locale === 'hi' ? L.purvaBhadra : L.purvaBhadra}>
          <p className="text-text-primary leading-relaxed">{L.purvaBhadraText}</p>
        </LessonSection>

        <LessonSection title={locale === 'hi' ? L.uttaraBhadra : L.uttaraBhadra}>
          <p className="text-text-primary leading-relaxed">{L.uttaraBhadraText}</p>
        </LessonSection>

        <LessonSection title={locale === 'hi' ? L.revati : L.revati}>
          <p className="text-text-primary leading-relaxed">{L.revatiText}</p>
        </LessonSection>

        <GoldDivider />

        {/* Activities to avoid */}
        <LessonSection number={5} title={L.activitiesToAvoid}>
          <ul className="space-y-2 ml-1">
            {avoidItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <AlertTriangle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        {/* Cremation rules */}
        <LessonSection number={6} title={L.cremationRules} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.cremationText}</p>
        </LessonSection>

        <GoldDivider />

        {/* Duration */}
        <LessonSection number={7} title={L.duration}>
          <p className="text-text-primary leading-relaxed">{L.durationText}</p>
        </LessonSection>

        {/* Calculation */}
        <LessonSection number={8} title={L.calculation} variant="formula">
          <p className="text-text-primary leading-relaxed">{L.calculationText}</p>
        </LessonSection>

        {/* Regional variations */}
        <LessonSection number={9} title={L.regional}>
          <p className="text-text-primary leading-relaxed">{L.regionalText}</p>
        </LessonSection>

        <GoldDivider />

        {/* Misconceptions FAQ */}
        <LessonSection number={10} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="panchak-myth1" title={locale === 'hi' ? '"पंचक में कुछ भी अच्छा नहीं हो सकता"' : '"Nothing good can happen during Panchak"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="panchak-myth2" title={locale === 'hi' ? '"पंचक हर जगह समान"' : '"Panchak applies equally everywhere"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="panchak-myth3" title={locale === 'hi' ? '"सभी यात्राएँ वर्जित"' : '"All travel is forbidden"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception3}</p>
            </InfoBlock>
          </div>
        </LessonSection>

        <GoldDivider className="mt-8" />

        {/* See Also */}
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
              { href: '/panchak' as const, label: locale === 'hi' ? 'आज का पंचक' : 'Panchak Today' },
              { href: '/panchang' as const, label: locale === 'hi' ? 'पंचांग' : 'Panchang' },
              { href: '/learn/nakshatras' as const, label: locale === 'hi' ? 'नक्षत्र' : 'Nakshatras' },
              { href: '/learn/holashtak' as const, label: locale === 'hi' ? 'होलाष्टक' : 'Holashtak' },
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
