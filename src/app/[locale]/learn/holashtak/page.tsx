'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle, Calendar, Heart, ShieldAlert, ArrowLeft, Sparkles } from 'lucide-react';
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
    title: 'Holashtak',
    subtitle: '8 Inauspicious Days Before Holi',
    whatIs: 'What is Holashtak?',
    whatIsText: 'Holashtak is a period of 8 inauspicious days that occurs before the festival of Holi each year. It spans from Phalguna Shukla Ashtami (the 8th day of the bright half of the Phalguna month) to Phalguna Shukla Purnima (the full moon day, which is Holi). The word comes from "Hola" (Holi) + "Ashtak" (eight), literally meaning "the eight days of Holi."',
    etymology: 'Etymology and Significance',
    etymologyText: 'The name Holashtak combines two Sanskrit-origin words: "Hola" derives from "Holika" (the demoness burned on Holi eve), and "Ashtak" means "a group of eight." These 8 days are considered a preparation period during which the cosmic energy builds toward the climactic Holika Dahan on the eve of Holi. The fire energy associated with Holika is believed to be in its accumulation phase, making the environment spiritually volatile.',
    whyInauspicious: 'Why Are These Days Inauspicious?',
    whyInauspiciousText: 'During Holashtak, planets are believed to be in aggressive or unstable positions. The buildup of fire energy toward Holika Dahan creates an environment where initiating new beginnings is considered risky. Classical texts suggest that the period carries a residual intensity from the cosmic battle between devotion (Prahlad) and ego (Hiranyakashipu), and this energy is not conducive to auspicious ceremonies.',
    activitiesToAvoid: 'Activities to Avoid',
    avoidItems: 'Marriage ceremonies and engagements|Griha Pravesh (housewarming ceremonies)|Mundan (head shaving/first haircut ceremony)|Starting a new business or venture|Buying property, vehicles, or major assets|Naming ceremonies (Namkaran)|Thread ceremony (Upanayanam)|Signing important contracts',
    activitiesOkay: 'What IS Okay During Holashtak',
    okayItems: 'Daily routine activities and office work|Emergency actions and medical treatments|Spiritual practices (actually enhanced during this period)|Charity and donations|Studying and learning|Holi preparations (colors, sweets, decorations)',
    connection: 'Connection to Holi',
    connectionText: 'The 8th and final day of Holashtak is Holi itself — the festival of colors celebrating the triumph of devotion over evil. On the evening before Holi (Holika Dahan), a bonfire is lit representing the burning of the demoness Holika. This fire is believed to consume all the accumulated negative energy of the Holashtak period. The festival of colors on the next day represents the joyful release after the period of restraint.',
    howToIdentify: 'How to Identify Holashtak',
    howToIdentifyText: 'Holashtak can be identified by three criteria in the Hindu Panchang: (1) the month must be Phalguna in the Amanta reckoning, (2) the paksha must be Shukla (bright half), and (3) the tithi must be between Ashtami (8th) and Purnima (15th/full moon). Day 1 = Ashtami, Day 2 = Navami, Day 3 = Dashami, Day 4 = Ekadashi, Day 5 = Dwadashi, Day 6 = Trayodashi, Day 7 = Chaturdashi, Day 8 = Purnima (Holi).',
    eightDays: 'The 8 Days of Holashtak',
    day1: 'Day 1 — Ashtami: Beginning of the inauspicious period. The energy of restraint begins.',
    day2: 'Day 2 — Navami: Intensity builds. No new ventures should be started.',
    day3: 'Day 3 — Dashami: The restriction deepens. Focus on existing commitments.',
    day4: 'Day 4 — Ekadashi: A fasting day in its own right. Spiritual practices are emphasized.',
    day5: 'Day 5 — Dwadashi: Holi preparations begin in earnest despite the inauspicious period.',
    day6: 'Day 6 — Trayodashi: The penultimate phase. Community gathering for Holika Dahan preparation.',
    day7: 'Day 7 — Chaturdashi: Holika Dahan eve. The bonfire pyre is assembled.',
    day8: 'Day 8 — Purnima: Holika Dahan at night, followed by the festival of colors the next morning. Holashtak ends.',
    regional: 'Regional Observance',
    regionalText: 'Holashtak is primarily observed in North and Central India, particularly in Uttar Pradesh, Bihar, Madhya Pradesh, Rajasthan, and parts of Gujarat. In South India, the concept of Holashtak is much less prominent, and Holi itself is celebrated differently (as Kamadahana in Karnataka, or less elaborately in Tamil Nadu and Kerala). The strictness of observance also varies — some families avoid only marriages and property purchases, while others restrict all auspicious activities.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Holashtak is as strict as Rahu Kaal" — This is a period-level restriction lasting 8 full days, not an hourly window. It applies to ceremonies and new beginnings, not to daily routine activities. You can go to work, travel, and handle daily affairs normally.',
    misconception2: '"Holashtak makes everything inauspicious" — Spiritual practices are actually considered MORE powerful during Holashtak, not less. Fasting, prayer, meditation, and charitable acts are encouraged.',
    misconception3: '"Holashtak dates are fixed" — Since Holashtak is based on the lunar calendar (Phalguna Shukla Ashtami to Purnima), the dates shift each year in the Gregorian calendar, typically falling in February-March.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'होलाष्टक',
    subtitle: 'होली से पूर्व 8 अशुभ दिन',
    whatIs: 'होलाष्टक क्या है?',
    whatIsText: 'होलाष्टक प्रत्येक वर्ष होली से पहले 8 अशुभ दिनों की अवधि है। यह फाल्गुन शुक्ल अष्टमी (फाल्गुन मास के शुक्ल पक्ष का 8वां दिन) से फाल्गुन शुक्ल पूर्णिमा (पूर्ण चन्द्र दिवस, जो होली है) तक चलती है। यह शब्द "होला" (होली) + "अष्टक" (आठ) से बना है, जिसका शाब्दिक अर्थ "होली के आठ दिन" है।',
    etymology: 'व्युत्पत्ति और महत्व',
    etymologyText: 'होलाष्टक नाम दो संस्कृत-मूल शब्दों से मिलकर बना है: "होला" "होलिका" (होली की पूर्व संध्या पर जलाई जाने वाली राक्षसी) से निकला है, और "अष्टक" का अर्थ "आठ का समूह" है। ये 8 दिन तैयारी की अवधि माने जाते हैं जब ब्रह्मांडीय ऊर्जा होलिका दहन की चरमोत्कर्ष की ओर बढ़ती है।',
    whyInauspicious: 'ये दिन अशुभ क्यों हैं?',
    whyInauspiciousText: 'होलाष्टक के दौरान ग्रह आक्रामक या अस्थिर स्थिति में माने जाते हैं। होलिका दहन की ओर अग्नि ऊर्जा का संचय एक ऐसा वातावरण बनाता है जहाँ नई शुरुआत करना जोखिमपूर्ण माना जाता है।',
    activitiesToAvoid: 'वर्जित कार्य',
    avoidItems: 'विवाह संस्कार और सगाई|गृह प्रवेश|मुंडन संस्कार|नया व्यापार या उद्यम|सम्पत्ति, वाहन या बड़ी खरीदारी|नामकरण संस्कार|उपनयन संस्कार (यज्ञोपवीत)|महत्वपूर्ण अनुबंधों पर हस्ताक्षर',
    activitiesOkay: 'होलाष्टक में क्या ठीक है',
    okayItems: 'दैनिक दिनचर्या और कार्यालय कार्य|आपातकालीन कार्य और चिकित्सा|आध्यात्मिक साधना (इस अवधि में विशेष प्रभावी)|दान और दक्षिणा|अध्ययन और शिक्षा|होली की तैयारी (रंग, मिठाई, सजावट)',
    connection: 'होली से संबंध',
    connectionText: 'होलाष्टक का 8वां और अंतिम दिन स्वयं होली है — रंगों का त्योहार जो भक्ति की बुराई पर विजय का उत्सव है। होली की पूर्व संध्या (होलिका दहन) पर अलाव जलाया जाता है जो राक्षसी होलिका के दहन का प्रतीक है। माना जाता है कि यह अग्नि होलाष्टक काल की सभी संचित नकारात्मक ऊर्जा को भस्म कर देती है।',
    howToIdentify: 'होलाष्टक कैसे पहचानें',
    howToIdentifyText: 'होलाष्टक को हिन्दू पंचांग में तीन मानदंडों से पहचाना जा सकता है: (1) मास फाल्गुन होना चाहिए (अमान्त गणना), (2) पक्ष शुक्ल होना चाहिए, (3) तिथि अष्टमी (8वीं) से पूर्णिमा (15वीं) के बीच होनी चाहिए।',
    eightDays: 'होलाष्टक के 8 दिन',
    day1: 'दिन 1 — अष्टमी: अशुभ अवधि की शुरुआत। संयम की ऊर्जा शुरू होती है।',
    day2: 'दिन 2 — नवमी: तीव्रता बढ़ती है। कोई नया उद्यम शुरू नहीं करना चाहिए।',
    day3: 'दिन 3 — दशमी: प्रतिबंध गहरा होता है। मौजूदा प्रतिबद्धताओं पर ध्यान दें।',
    day4: 'दिन 4 — एकादशी: स्वयं एक उपवास दिवस। आध्यात्मिक साधना पर ज़ोर।',
    day5: 'दिन 5 — द्वादशी: अशुभ अवधि के बावजूद होली की तैयारी शुरू होती है।',
    day6: 'दिन 6 — त्रयोदशी: उपान्त्य चरण। होलिका दहन की तैयारी के लिए सामुदायिक जुटान।',
    day7: 'दिन 7 — चतुर्दशी: होलिका दहन की पूर्व संध्या। चिता को जोड़ा जाता है।',
    day8: 'दिन 8 — पूर्णिमा: रात को होलिका दहन, अगली सुबह रंगों का त्योहार। होलाष्टक समाप्त।',
    regional: 'क्षेत्रीय पालन',
    regionalText: 'होलाष्टक मुख्य रूप से उत्तर और मध्य भारत में मनाया जाता है, विशेषकर उत्तर प्रदेश, बिहार, मध्य प्रदेश, राजस्थान और गुजरात के कुछ भागों में। दक्षिण भारत में होलाष्टक की अवधारणा बहुत कम प्रमुख है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"होलाष्टक राहु काल जितना सख्त है" — यह 8 दिनों की अवधि-स्तरीय पाबंदी है, प्रति घंटा नहीं। यह समारोहों और नई शुरुआतों पर लागू होता है, दैनिक दिनचर्या पर नहीं।',
    misconception2: '"होलाष्टक सब कुछ अशुभ बनाता है" — आध्यात्मिक साधनाएँ होलाष्टक में अधिक शक्तिशाली मानी जाती हैं, कम नहीं।',
    misconception3: '"होलाष्टक की तिथियाँ निश्चित हैं" — चूंकि होलाष्टक चान्द्र कैलेंडर पर आधारित है, ग्रेगोरियन कैलेंडर में तिथियाँ प्रत्येक वर्ष बदलती हैं।',
    seeAlso: 'यह भी देखें',
  },
};

// ─── 8-day breakdown ──────────────────────────────────────────
const EIGHT_DAYS = [
  { day: 1, tithi: 'Ashtami', tithiHi: 'अष्टमी' },
  { day: 2, tithi: 'Navami', tithiHi: 'नवमी' },
  { day: 3, tithi: 'Dashami', tithiHi: 'दशमी' },
  { day: 4, tithi: 'Ekadashi', tithiHi: 'एकादशी' },
  { day: 5, tithi: 'Dwadashi', tithiHi: 'द्वादशी' },
  { day: 6, tithi: 'Trayodashi', tithiHi: 'त्रयोदशी' },
  { day: 7, tithi: 'Chaturdashi', tithiHi: 'चतुर्दशी' },
  { day: 8, tithi: 'Purnima (Holi)', tithiHi: 'पूर्णिमा (होली)' },
];

export default function LearnHolashtakPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const avoidItems = L.avoidItems.split('|');
  const okayItems = L.okayItems.split('|');

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
            <Flame size={32} className="text-gold-primary" />
            <h1
              className="text-3xl sm:text-4xl font-bold text-gold-light"
              style={headingFont}
            >
              {L.title}
            </h1>
          </div>
          <p className="text-text-secondary text-lg ml-11">{L.subtitle}</p>
        </motion.div>

        {/* What is Holashtak */}
        <LessonSection number={1} title={L.whatIs}>
          <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
        </LessonSection>

        {/* Etymology */}
        <LessonSection number={2} title={L.etymology}>
          <p className="text-text-primary leading-relaxed">{L.etymologyText}</p>
        </LessonSection>

        {/* Why inauspicious */}
        <LessonSection number={3} title={L.whyInauspicious}>
          <p className="text-text-primary leading-relaxed">{L.whyInauspiciousText}</p>
        </LessonSection>

        <GoldDivider />

        {/* Activities to avoid */}
        <LessonSection number={4} title={L.activitiesToAvoid} variant="highlight">
          <ul className="space-y-2 ml-1">
            {avoidItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <AlertTriangle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        {/* What is okay */}
        <LessonSection number={5} title={L.activitiesOkay}>
          <ul className="space-y-2 ml-1">
            {okayItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <Sparkles size={16} className="text-green-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        <GoldDivider />

        {/* The 8 days */}
        <LessonSection number={6} title={L.eightDays} variant="highlight">
          <div className="space-y-3 mt-2">
            {EIGHT_DAYS.map((d) => {
              const dayKey = `day${d.day}` as keyof typeof L;
              return (
                <div
                  key={d.day}
                  className="flex items-start gap-3 rounded-lg bg-white/5 border border-white/10 p-3"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold">
                    {d.day}
                  </span>
                  <div>
                    <span className="text-gold-light font-semibold text-sm">
                      {locale === 'hi' ? d.tithiHi : d.tithi}
                    </span>
                    <p className="text-text-secondary text-sm mt-0.5">
                      {L[dayKey]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </LessonSection>

        {/* Connection to Holi */}
        <LessonSection number={7} title={L.connection}>
          <p className="text-text-primary leading-relaxed">{L.connectionText}</p>
        </LessonSection>

        {/* How to identify */}
        <LessonSection number={8} title={L.howToIdentify} variant="formula">
          <p className="text-text-primary leading-relaxed">{L.howToIdentifyText}</p>
        </LessonSection>

        <GoldDivider />

        {/* Regional observance */}
        <LessonSection number={9} title={L.regional}>
          <p className="text-text-primary leading-relaxed">{L.regionalText}</p>
        </LessonSection>

        {/* Misconceptions FAQ */}
        <LessonSection number={10} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="holashtak-myth1" title={locale === 'hi' ? '"होलाष्टक राहु काल जितना सख्त"' : '"Holashtak is as strict as Rahu Kaal"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="holashtak-myth2" title={locale === 'hi' ? '"सब कुछ अशुभ"' : '"Holashtak makes everything inauspicious"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="holashtak-myth3" title={locale === 'hi' ? '"तिथियाँ निश्चित हैं"' : '"Holashtak dates are fixed"'}>
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
              { href: '/holashtak' as const, label: locale === 'hi' ? 'आज का होलाष्टक' : 'Holashtak Today' },
              { href: '/panchang' as const, label: locale === 'hi' ? 'पंचांग' : 'Panchang' },
              { href: '/calendar' as const, label: locale === 'hi' ? 'त्योहार कैलेंडर' : 'Festival Calendar' },
              { href: '/learn/tithis' as const, label: locale === 'hi' ? 'तिथियाँ' : 'Tithis' },
              { href: '/learn/panchak' as const, label: locale === 'hi' ? 'पंचक' : 'Panchak' },
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
