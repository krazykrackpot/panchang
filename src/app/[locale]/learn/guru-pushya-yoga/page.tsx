'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle, Gem, Calendar, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Guru Pushya Yoga',
    subtitle: 'Thursday + Pushya Nakshatra — The Gold-Buying Yoga',
    whatIs: 'What is Guru Pushya Yoga?',
    whatIsText: 'Guru Pushya Yoga (Sanskrit: गुरुपुष्ययोग) forms when Thursday (Guru = Jupiter\'s day) coincides with the Moon in Pushya nakshatra. This creates a "double Jupiter" effect — Jupiter rules Thursday AND is the deity (Brihaspati) of Pushya nakshatra. This rare alignment is considered one of the most auspicious muhurtas in the entire Vedic calendar, especially for buying gold, jewelry, and starting educational pursuits.',
    formation: 'Formation',
    formationText: 'Thursday (weekday 4, ruled by Jupiter) + Moon in Pushya nakshatra (#8, Cancer 3\u00b020\' to 16\u00b040\'). The yoga is active from sunrise on Thursday until the Moon leaves Pushya. Since the Moon spends about 1 day per nakshatra and Thursday occurs every 7 days, the alignment is genuinely rare.',
    goldConnection: 'The Gold Connection',
    goldConnectionText: 'Guru Pushya Yoga is THE yoga for buying gold in Indian tradition. Jewelers across North India advertise special sales on Guru Pushya days. The reasoning is astrological: Jupiter represents wealth, abundance, and expansion. Pushya represents nourishment and growth. Gold represents Jupiter\'s metal. The combination of Jupiter\'s day + Jupiter\'s nakshatra + Jupiter\'s metal creates a triple resonance that is believed to make the gold "grow" in value and bring prosperity to the owner.',
    recommended: 'Recommended Activities',
    activityItems: 'Buying gold, silver, and precious gems|Starting education, courses, or degrees|Guru puja and worship of teachers|Beginning spiritual practices (sadhana)|Purchasing religious items and scriptures|Starting a teaching career or school|Financial investments (long-term)|Charitable donations and dan',
    rarity: 'Rarity — Why It\'s So Special',
    rarityText: 'Guru Pushya Yoga occurs only about 4 times per year. The Moon takes ~27.3 days to complete one cycle through all nakshatras, meaning it visits Pushya roughly every 27 days. But Thursday also repeats every 7 days. The alignment of these two cycles produces the yoga only when a Thursday falls within the ~1 day window of Moon-in-Pushya. Statistically, this is about 1/7 of the monthly Pushya windows, yielding roughly 12-13 Pushya days per year / 7 days = ~2 occurrences. In practice, due to the Moon\'s slightly variable speed, it averages 3-4 times per year.',
    popularity: 'Cultural Significance in North India',
    popularityText: 'Guru Pushya Yoga has enormous commercial and cultural significance in North India. Jewelers in cities like Jaipur, Delhi, Ahmedabad, and Mumbai mark these dates months in advance. Special gold coins and jewelry collections are launched on Guru Pushya days. Many families specifically time gold purchases for weddings to fall on a Guru Pushya date. The belief is so strong that gold sales on Guru Pushya days can be 5-10x normal daily volume.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Any gold bought on Guru Pushya will increase in value" — The yoga creates an auspicious start, but gold prices are governed by global markets. The belief is about spiritual merit and positive energy association, not guaranteed financial returns.',
    misconception2: '"Guru Pushya Yoga lasts 24 hours" — It is only active while Moon is in Pushya. If the Moon transitions to Ashlesha at 2 PM on Thursday, the yoga ends then. Always verify the nakshatra end time before making purchases.',
    misconception3: '"Ravi Pushya and Guru Pushya are equally good for gold" — While both are auspicious, Guru Pushya is specifically considered superior for gold because of Jupiter\'s direct rulership connection. Ravi Pushya (Sunday + Pushya) is more general-purpose.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'गुरु पुष्य योग',
    subtitle: 'गुरुवार + पुष्य नक्षत्र — सोना खरीदने का योग',
    whatIs: 'गुरु पुष्य योग क्या है?',
    whatIsText: 'गुरु पुष्य योग (संस्कृत: गुरुपुष्ययोग) तब बनता है जब गुरुवार (गुरु = बृहस्पति का दिन) पुष्य नक्षत्र में चन्द्रमा के साथ मेल खाता है। यह "दोहरा बृहस्पति" प्रभाव बनाता है — बृहस्पति गुरुवार के स्वामी हैं और पुष्य नक्षत्र के देवता भी। यह दुर्लभ संयोग विशेष रूप से सोना खरीदने और शिक्षा शुरू करने के लिए सबसे शुभ मुहूर्तों में से एक माना जाता है।',
    formation: 'निर्माण',
    formationText: 'गुरुवार (वार 4, बृहस्पति का दिन) + चन्द्रमा पुष्य नक्षत्र (#8, कर्क 3\u00b020\' से 16\u00b040\') में। यह सूर्योदय से पुष्य के अंत तक सक्रिय रहता है।',
    goldConnection: 'सोने का संबंध',
    goldConnectionText: 'गुरु पुष्य योग भारतीय परम्परा में सोना खरीदने का सबसे शुभ योग है। उत्तर भारत के ज्वैलर्स इन तारीखों को महीनों पहले से विज्ञापित करते हैं। बृहस्पति धन और विस्तार का प्रतिनिधित्व करता है, पुष्य पोषण और वृद्धि का, और सोना बृहस्पति की धातु है।',
    recommended: 'अनुशंसित कार्य',
    activityItems: 'सोना, चांदी और रत्न खरीदना|शिक्षा, पाठ्यक्रम या डिग्री शुरू करना|गुरु पूजा और शिक्षकों की पूजा|आध्यात्मिक साधना शुरू करना|धार्मिक सामग्री और ग्रंथ खरीदना|शिक्षण कैरियर या विद्यालय शुरू करना|दीर्घकालिक वित्तीय निवेश|दान और धर्मदान',
    rarity: 'दुर्लभता — यह इतना विशेष क्यों है',
    rarityText: 'गुरु पुष्य योग वर्ष में केवल लगभग 4 बार होता है। चन्द्रमा ~27.3 दिनों में सभी नक्षत्रों का चक्कर लगाता है, यानी पुष्य में लगभग हर 27 दिन पहुंचता है। लेकिन गुरुवार भी हर 7 दिन दोहराता है। इन दो चक्रों का संरेखण बहुत दुर्लभ है।',
    popularity: 'उत्तर भारत में सांस्कृतिक महत्व',
    popularityText: 'गुरु पुष्य योग का उत्तर भारत में विशाल व्यावसायिक और सांस्कृतिक महत्व है। जयपुर, दिल्ली, अहमदाबाद और मुंबई के ज्वैलर्स इन तारीखों को महीनों पहले चिह्नित करते हैं। गुरु पुष्य के दिनों में सोने की बिक्री सामान्य से 5-10 गुना हो सकती है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"गुरु पुष्य में खरीदा सोना बढ़ेगा" — योग शुभ शुरुआत बनाता है, लेकिन सोने की कीमत वैश्विक बाज़ारों द्वारा निर्धारित होती है। विश्वास आध्यात्मिक पुण्य के बारे में है।',
    misconception2: '"गुरु पुष्य योग 24 घंटे चलता है" — यह केवल चन्द्रमा के पुष्य में रहने तक सक्रिय है। नक्षत्र समाप्ति समय सत्यापित करें।',
    misconception3: '"रवि पुष्य और गुरु पुष्य सोने के लिए समान हैं" — गुरु पुष्य विशेष रूप से सोने के लिए श्रेष्ठ माना जाता है क्योंकि बृहस्पति का सीधा संबंध है।',
    seeAlso: 'यह भी देखें',
  },
};

export default function LearnGuruPushyaYogaPage() {
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
            <GraduationCap size={32} className="text-gold-primary" />
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
          <p className="text-text-primary leading-relaxed">{L.formationText}</p>
        </LessonSection>

        <LessonSection number={3} title={L.goldConnection} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.goldConnectionText}</p>
        </LessonSection>

        <GoldDivider />

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

        <LessonSection number={5} title={L.rarity}>
          <p className="text-text-primary leading-relaxed">{L.rarityText}</p>
        </LessonSection>

        <LessonSection number={6} title={L.popularity} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.popularityText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={7} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="gp-myth1" title={locale === 'hi' ? '"सोना बढ़ेगा"' : '"Gold will increase in value"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="gp-myth2" title={locale === 'hi' ? '"24 घंटे चलता है"' : '"Lasts 24 hours"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="gp-myth3" title={locale === 'hi' ? '"रवि पुष्य = गुरु पुष्य"' : '"Ravi Pushya = Guru Pushya for gold"'}>
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
              { href: '/learn/ravi-pushya-yoga' as const, label: locale === 'hi' ? 'रवि पुष्य योग' : 'Ravi Pushya Yoga' },
              { href: '/learn/amrit-siddhi-yoga' as const, label: locale === 'hi' ? 'अमृत सिद्धि योग' : 'Amrit Siddhi Yoga' },
              { href: '/learn/nakshatras' as const, label: locale === 'hi' ? 'नक्षत्र' : 'Nakshatras' },
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
