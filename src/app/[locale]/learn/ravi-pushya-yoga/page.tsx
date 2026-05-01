'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sun, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Ravi Pushya Yoga',
    subtitle: 'Sunday + Pushya Nakshatra — The Sun\'s Nourishing Day',
    whatIs: 'What is Ravi Pushya Yoga?',
    whatIsText: 'Ravi Pushya Yoga (also called Ravi Pushya Nakshatra Yoga) forms when a Sunday (Ravi = Sun) coincides with the Moon in Pushya nakshatra. Pushya (Sanskrit: पुष्य, "nourisher") is considered the most benevolent nakshatra in Vedic astrology — its lord Saturn provides discipline while its deity Brihaspati (Jupiter) bestows wisdom and abundance. Combined with the Sun\'s day, it creates an extremely auspicious window for new beginnings.',
    formation: 'Formation',
    formationText: 'The formation is simple: Sunday (weekday 0, ruled by the Sun) + Moon in Pushya nakshatra (nakshatra #8, spanning 3\u00b020\' to 16\u00b040\' Cancer). The yoga is active from sunrise on Sunday until the Moon leaves Pushya. If the Moon exits Pushya before sunrise, the yoga does not form that Sunday.',
    significance: 'Why Pushya is Special',
    significanceText: 'Pushya is called the "star of nourishment" and is unique among the 27 nakshatras. Classical texts describe it as the most auspicious nakshatra for beginning any constructive endeavor. Its guna is Sattva (purity), its nature is Laghu (light) and Kshipra (swift), making it ideal for quick, positive action. When this meets the Sun\'s vitality, the combination amplifies both energies.',
    recommended: 'Recommended Activities',
    activityItems: 'Buying gold and precious metals|Starting medical treatments or health regimens|Beginning new ventures or projects|Performing religious ceremonies|Initiating education or learning|Entering a new home (Griha Pravesh)|Buying vehicles|Planting seeds (literally and figuratively)',
    frequency: 'Frequency',
    frequencyText: 'Ravi Pushya Yoga occurs roughly once per month — whenever a Sunday falls during the Moon\'s transit through Pushya nakshatra. The Moon spends approximately 1 day in each nakshatra, so the alignment of Sunday specifically with Pushya happens about 12-13 times per year. However, partial overlaps (Pushya ending early Sunday morning) may reduce effective occurrences.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Ravi Pushya is the best day for buying gold" — While excellent for gold purchase, Guru Pushya Yoga (Thursday + Pushya) is traditionally considered EVEN BETTER for gold specifically, because Jupiter (Guru) is the planet of wealth and expansion. Ravi Pushya is more versatile — it is auspicious for all activities, not just gold.',
    misconception2: '"Ravi Pushya Yoga lasts the entire Sunday" — The yoga is only active while the Moon is in Pushya. If the Moon transitions to Ashlesha during the day, the yoga ends at that point. Always check the nakshatra transition time.',
    misconception3: '"Any gold purchased on Ravi Pushya will multiply" — This is a folk belief without textual support. The yoga creates auspicious conditions for purchases and new ventures, but it does not guarantee financial returns.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'रवि पुष्य योग',
    subtitle: 'रविवार + पुष्य नक्षत्र — सूर्य का पोषक दिन',
    whatIs: 'रवि पुष्य योग क्या है?',
    whatIsText: 'रवि पुष्य योग (रवि पुष्य नक्षत्र योग) तब बनता है जब रविवार (रवि = सूर्य) पुष्य नक्षत्र में चन्द्रमा के साथ मेल खाता है। पुष्य (संस्कृत: पुष्य, "पोषक") वैदिक ज्योतिष में सबसे शुभ नक्षत्र माना जाता है — इसके स्वामी शनि अनुशासन प्रदान करते हैं जबकि इसके देवता बृहस्पति ज्ञान और समृद्धि प्रदान करते हैं।',
    formation: 'निर्माण',
    formationText: 'निर्माण सरल है: रविवार (वार 0, सूर्य का दिन) + चन्द्रमा पुष्य नक्षत्र (#8, कर्क 3\u00b020\' से 16\u00b040\') में। यह सूर्योदय से पुष्य के अंत तक सक्रिय रहता है।',
    significance: 'पुष्य विशेष क्यों है',
    significanceText: 'पुष्य को "पोषण का तारा" कहा जाता है और यह 27 नक्षत्रों में अद्वितीय है। शास्त्रीय ग्रंथ इसे किसी भी रचनात्मक कार्य के लिए सबसे शुभ नक्षत्र बताते हैं।',
    recommended: 'अनुशंसित कार्य',
    activityItems: 'सोना और कीमती धातुएं खरीदना|चिकित्सा उपचार या स्वास्थ्य कार्यक्रम शुरू करना|नए उद्यम या परियोजनाएं शुरू करना|धार्मिक अनुष्ठान करना|शिक्षा या सीखना शुरू करना|गृह प्रवेश|वाहन खरीदना|बीज बोना (शाब्दिक और लाक्षणिक)',
    frequency: 'आवृत्ति',
    frequencyText: 'रवि पुष्य योग लगभग महीने में एक बार होता है — जब रविवार पुष्य नक्षत्र के दौरान पड़ता है। यह वर्ष में लगभग 12-13 बार होता है।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"रवि पुष्य सोना खरीदने का सबसे अच्छा दिन है" — उत्कृष्ट होते हुए भी, गुरु पुष्य योग (गुरुवार + पुष्य) सोने के लिए और भी बेहतर माना जाता है क्योंकि बृहस्पति धन का ग्रह है।',
    misconception2: '"रवि पुष्य योग पूरे रविवार चलता है" — यह केवल चन्द्रमा के पुष्य में रहने तक सक्रिय है। नक्षत्र संक्रमण समय जांचें।',
    misconception3: '"रवि पुष्य में खरीदा सोना बढ़ेगा" — यह लोक विश्वास है, शास्त्रीय प्रमाण नहीं। योग शुभ परिस्थितियाँ बनाता है, वित्तीय रिटर्न की गारंटी नहीं।',
    seeAlso: 'यह भी देखें',
  },
};

export default function LearnRaviPushyaYogaPage() {
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
            <Sun size={32} className="text-gold-primary" />
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

        <LessonSection number={3} title={L.significance} variant="highlight">
          <p className="text-text-primary leading-relaxed">{L.significanceText}</p>
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

        <LessonSection number={5} title={L.frequency}>
          <p className="text-text-primary leading-relaxed">{L.frequencyText}</p>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={6} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="rp-myth1" title={locale === 'hi' ? '"सोने के लिए सबसे अच्छा दिन"' : '"Best day for buying gold"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="rp-myth2" title={locale === 'hi' ? '"पूरे रविवार चलता है"' : '"Lasts the entire Sunday"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="rp-myth3" title={locale === 'hi' ? '"सोना बढ़ेगा"' : '"Gold will multiply"'}>
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
              { href: '/learn/guru-pushya-yoga' as const, label: locale === 'hi' ? 'गुरु पुष्य योग' : 'Guru Pushya Yoga' },
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
