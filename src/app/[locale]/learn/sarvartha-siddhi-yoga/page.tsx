'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, XCircle, Calendar, ArrowLeft } from 'lucide-react';
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
    title: 'Sarvartha Siddhi Yoga',
    subtitle: 'The Yoga Where All Purposes Succeed',
    whatIs: 'What is Sarvartha Siddhi Yoga?',
    whatIsText: 'Sarvartha Siddhi Yoga (Sanskrit: सर्वार्थसिद्धियोग, "accomplishment of all goals") is one of the most commonly occurring special muhurta yogas in Vedic astrology. It forms when specific weekday (vara) and nakshatra combinations align. When active, any important activity initiated is believed to yield favorable results — hence the name "all purposes succeed."',
    formation: 'How It Forms — The Vara-Nakshatra Table',
    formationText: 'Sarvartha Siddhi Yoga is determined entirely by the day of the week and the Moon\'s nakshatra at sunrise. The classical source is Muhurta Chintamani and Nirnaya Sindhu. Here is the complete table:',
    sunday: 'Sunday — Pushya, Hasta, U.Phalguni, U.Ashadha, U.Bhadrapada, Ashwini, Mula',
    monday: 'Monday — Rohini, Mrigashira, Pushya, Anuradha, Hasta, Shravana',
    tuesday: 'Tuesday — Ashwini, U.Phalguni, Krittika, U.Ashadha, U.Bhadrapada',
    wednesday: 'Wednesday — Rohini, Anuradha, Hasta, Mrigashira, Jyeshtha, Revati',
    thursday: 'Thursday — Ashwini, Pushya, Anuradha, Shravana, Revati, Punarvasu',
    friday: 'Friday — Ashwini, Anuradha, Punarvasu, Shravana, Revati, Pushya',
    saturday: 'Saturday — Rohini, Shravana, Swati, Revati',
    activities: 'Recommended Activities',
    activitiesText: 'Sarvartha Siddhi Yoga is considered universally auspicious. Classical texts recommend it for virtually any constructive activity:',
    activityItems: 'Starting a new business or venture|Signing contracts and agreements|Beginning education or courses|Buying property or vehicles|Commencing travel or pilgrimage|Filing important applications|Starting medical treatment|Performing religious ceremonies',
    frequency: 'Frequency and Duration',
    frequencyText: 'Sarvartha Siddhi Yoga is the most frequently occurring special yoga — it forms several times per month. On some days, multiple nakshatras may qualify for the same weekday, so it can even occur on consecutive days. The yoga is active from sunrise to the end of the qualifying nakshatra (when the Moon moves to the next nakshatra, the yoga ends).',
    interactions: 'Interactions with Inauspicious Periods',
    interactionsText: 'Sarvartha Siddhi Yoga is cancelled or weakened when it coincides with certain inauspicious factors. Classical authorities specify that the following override the yoga\'s benefits:',
    interactionItems: 'Rahu Kaal — the yoga is suspended during Rahu Kaal hours|Bhadra (Vishti) Karana — if the current karana is Vishti, the yoga is ineffective|Panchak nakshatras — if the qualifying nakshatra falls in the Panchak group (23-27), some authorities reduce its potency|Eclipse period — solar or lunar eclipses override all auspicious yogas',
    misconceptions: 'Common Misconceptions',
    misconception1: '"Sarvartha Siddhi guarantees success regardless of effort" — The yoga creates favorable conditions, but it does not replace preparation, skill, or effort. It is a supportive factor, not a guarantee.',
    misconception2: '"Any activity done during Sarvartha Siddhi will succeed" — Activities initiated during Rahu Kaal or Bhadra Karana within a Sarvartha Siddhi day are NOT protected by the yoga. The inauspicious periods take precedence.',
    misconception3: '"Sarvartha Siddhi is rare and extremely powerful" — It is actually the most common special yoga, occurring multiple times per month. Amrit Siddhi Yoga is rarer and considered more powerful.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'सीखें',
    title: 'सर्वार्थ सिद्धि योग',
    subtitle: 'सभी कार्यों में सफलता का योग',
    whatIs: 'सर्वार्थ सिद्धि योग क्या है?',
    whatIsText: 'सर्वार्थ सिद्धि योग (संस्कृत: सर्वार्थसिद्धियोग, "सभी लक्ष्यों की प्राप्ति") वैदिक ज्योतिष में सबसे सामान्य रूप से होने वाला विशेष मुहूर्त योग है। यह तब बनता है जब विशिष्ट वार और नक्षत्र का संयोग होता है। जब यह सक्रिय होता है, तो कोई भी महत्वपूर्ण कार्य अनुकूल परिणाम देता है।',
    formation: 'कैसे बनता है — वार-नक्षत्र सारणी',
    formationText: 'सर्वार्थ सिद्धि योग पूरी तरह से सप्ताह के दिन और सूर्योदय के समय चन्द्रमा के नक्षत्र से निर्धारित होता है। शास्त्रीय स्रोत मुहूर्त चिन्तामणि और निर्णय सिन्धु है।',
    sunday: 'रविवार — पुष्य, हस्त, उ.फाल्गुनी, उ.आषाढ़ा, उ.भाद्रपद, अश्विनी, मूल',
    monday: 'सोमवार — रोहिणी, मृगशिरा, पुष्य, अनुराधा, हस्त, श्रवण',
    tuesday: 'मंगलवार — अश्विनी, उ.फाल्गुनी, कृत्तिका, उ.आषाढ़ा, उ.भाद्रपद',
    wednesday: 'बुधवार — रोहिणी, अनुराधा, हस्त, मृगशिरा, ज्येष्ठा, रेवती',
    thursday: 'गुरुवार — अश्विनी, पुष्य, अनुराधा, श्रवण, रेवती, पुनर्वसु',
    friday: 'शुक्रवार — अश्विनी, अनुराधा, पुनर्वसु, श्रवण, रेवती, पुष्य',
    saturday: 'शनिवार — रोहिणी, श्रवण, स्वाती, रेवती',
    activities: 'अनुशंसित कार्य',
    activitiesText: 'सर्वार्थ सिद्धि योग सार्वभौमिक रूप से शुभ माना जाता है। शास्त्रीय ग्रंथ लगभग किसी भी रचनात्मक कार्य के लिए इसकी सिफारिश करते हैं:',
    activityItems: 'नया व्यवसाय या उद्यम शुरू करना|अनुबंध और समझौतों पर हस्ताक्षर|शिक्षा या पाठ्यक्रम शुरू करना|संपत्ति या वाहन खरीदना|यात्रा या तीर्थयात्रा शुरू करना|महत्वपूर्ण आवेदन दाखिल करना|चिकित्सा उपचार शुरू करना|धार्मिक अनुष्ठान करना',
    frequency: 'आवृत्ति और अवधि',
    frequencyText: 'सर्वार्थ सिद्धि योग सबसे अधिक बार होने वाला विशेष योग है — यह महीने में कई बार बनता है। यह सूर्योदय से योग्य नक्षत्र के अंत तक सक्रिय रहता है।',
    interactions: 'अशुभ अवधियों के साथ संबंध',
    interactionsText: 'सर्वार्थ सिद्धि योग कुछ अशुभ कारकों के साथ मेल खाने पर रद्द या कमज़ोर हो जाता है:',
    interactionItems: 'राहु काल — राहु काल के समय योग स्थगित रहता है|भद्रा (विष्टि) करण — यदि वर्तमान करण विष्टि है, तो योग अप्रभावी है|पंचक नक्षत्र — यदि योग्य नक्षत्र पंचक समूह (23-27) में है, तो कुछ आचार्य इसकी शक्ति कम मानते हैं|ग्रहण अवधि — सूर्य या चंद्र ग्रहण सभी शुभ योगों को रद्द करता है',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"सर्वार्थ सिद्धि प्रयास के बिना सफलता की गारंटी देता है" — योग अनुकूल परिस्थितियाँ बनाता है, लेकिन यह तैयारी, कौशल या प्रयास का विकल्प नहीं है।',
    misconception2: '"सर्वार्थ सिद्धि के दौरान कोई भी कार्य सफल होगा" — राहु काल या भद्रा करण के दौरान किए गए कार्य योग द्वारा संरक्षित नहीं हैं।',
    misconception3: '"सर्वार्थ सिद्धि दुर्लभ और अत्यंत शक्तिशाली है" — यह वास्तव में सबसे सामान्य विशेष योग है। अमृत सिद्धि योग दुर्लभ और अधिक शक्तिशाली माना जाता है।',
    seeAlso: 'यह भी देखें',
  },
};

// Vara-Nakshatra table for visual display
const SARVARTHA_TABLE = [
  { vara: { en: 'Sunday', hi: 'रविवार' }, nakshatras: { en: 'Ashwini, Pushya, U.Phalguni, Hasta, Mula, U.Ashadha, U.Bhadrapada', hi: 'अश्विनी, पुष्य, उ.फाल्गुनी, हस्त, मूल, उ.आषाढ़ा, उ.भाद्रपद' }, count: 7 },
  { vara: { en: 'Monday', hi: 'सोमवार' }, nakshatras: { en: 'Rohini, Mrigashira, Pushya, Hasta, Anuradha, Shravana', hi: 'रोहिणी, मृगशिरा, पुष्य, हस्त, अनुराधा, श्रवण' }, count: 6 },
  { vara: { en: 'Tuesday', hi: 'मंगलवार' }, nakshatras: { en: 'Ashwini, Krittika, U.Phalguni, U.Ashadha, U.Bhadrapada', hi: 'अश्विनी, कृत्तिका, उ.फाल्गुनी, उ.आषाढ़ा, उ.भाद्रपद' }, count: 5 },
  { vara: { en: 'Wednesday', hi: 'बुधवार' }, nakshatras: { en: 'Rohini, Mrigashira, Hasta, Anuradha, Jyeshtha, Revati', hi: 'रोहिणी, मृगशिरा, हस्त, अनुराधा, ज्येष्ठा, रेवती' }, count: 6 },
  { vara: { en: 'Thursday', hi: 'गुरुवार' }, nakshatras: { en: 'Ashwini, Punarvasu, Pushya, Anuradha, Shravana, Revati', hi: 'अश्विनी, पुनर्वसु, पुष्य, अनुराधा, श्रवण, रेवती' }, count: 6 },
  { vara: { en: 'Friday', hi: 'शुक्रवार' }, nakshatras: { en: 'Ashwini, Punarvasu, Pushya, Anuradha, Shravana, Revati', hi: 'अश्विनी, पुनर्वसु, पुष्य, अनुराधा, श्रवण, रेवती' }, count: 6 },
  { vara: { en: 'Saturday', hi: 'शनिवार' }, nakshatras: { en: 'Rohini, Swati, Shravana, Revati', hi: 'रोहिणी, स्वाती, श्रवण, रेवती' }, count: 4 },
];

export default function LearnSarvarthaSiddhiYogaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const activityItems = L.activityItems.split('|');
  const interactionItems = L.interactionItems.split('|');

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
            <Sparkles size={32} className="text-gold-primary" />
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
            {SARVARTHA_TABLE.map((row, i) => (
              <div key={i} className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gold-light" style={headingFont}>
                    {locale === 'hi' ? row.vara.hi : row.vara.en}
                  </h4>
                  <span className="text-xs text-text-secondary bg-gold-primary/10 px-2 py-0.5 rounded-full">
                    {row.count} {locale === 'hi' ? 'नक्षत्र' : 'nakshatras'}
                  </span>
                </div>
                <p className="text-text-secondary text-sm">
                  {locale === 'hi' ? row.nakshatras.hi : row.nakshatras.en}
                </p>
              </div>
            ))}
          </div>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={3} title={L.activities}>
          <p className="text-text-primary leading-relaxed mb-3">{L.activitiesText}</p>
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

        <GoldDivider />

        <LessonSection number={5} title={L.interactions}>
          <p className="text-text-primary leading-relaxed mb-3">{L.interactionsText}</p>
          <ul className="space-y-2 ml-1">
            {interactionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <XCircle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </LessonSection>

        <GoldDivider />

        <LessonSection number={6} title={L.misconceptions}>
          <div className="space-y-4">
            <InfoBlock id="ss-myth1" title={locale === 'hi' ? '"प्रयास के बिना सफलता"' : '"Guarantees success without effort"'} defaultOpen>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception1}</p>
            </InfoBlock>
            <InfoBlock id="ss-myth2" title={locale === 'hi' ? '"कोई भी कार्य सफल होगा"' : '"Any activity will succeed"'}>
              <p className="text-text-primary text-sm leading-relaxed">{L.misconception2}</p>
            </InfoBlock>
            <InfoBlock id="ss-myth3" title={locale === 'hi' ? '"दुर्लभ और अत्यंत शक्तिशाली"' : '"Rare and extremely powerful"'}>
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
              { href: '/learn/siddha-yoga' as const, label: locale === 'hi' ? 'सिद्ध योग' : 'Siddha Yoga' },
              { href: '/panchang' as const, label: locale === 'hi' ? 'पंचांग' : 'Panchang' },
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
