'use client';

import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, ShieldX, Zap, Home, Heart, TrendingUp, Star } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/argala.json';


/* ── Argala types data ────────────────────────────────────────────── */
const ARGALA_TYPES = [
  {
    name: { en: 'Dhana Argala (Wealth)', hi: 'धन अर्गला', sa: 'धनार्गला' },
    house: '2nd',
    virodha: '3rd',
    icon: 'wealth',
    color: '#f0d48a',
    desc: {
      en: 'Planets in the 2nd from a house provide resource and wealth intervention. They supply material support, financial backing, and family resources to the target house. Example: Jupiter in 8th house (2nd from 7th) provides wealth support to marriage.',
      hi: '2रे भाव के ग्रह संसाधन और धन हस्तक्षेप प्रदान करते हैं। वे लक्ष्य भाव को भौतिक सहायता, वित्तीय सहायता और पारिवारिक संसाधन प्रदान करते हैं।',
      sa: 'द्वितीयभावस्य ग्रहाः संसाधनं धनहस्तक्षेपं च प्रददति।'
    },
  },
  {
    name: { en: 'Sukha Argala (Comfort)', hi: 'सुख अर्गला', sa: 'सुखार्गला' },
    house: '4th',
    virodha: '10th',
    icon: 'comfort',
    color: '#7dd3fc',
    desc: {
      en: 'Planets in the 4th from a house provide emotional and comfort intervention. They supply peace, emotional security, domestic support, vehicles, and property benefits. Example: Venus in 10th house (4th from 7th) provides emotional comfort to marriage.',
      hi: '4थे भाव के ग्रह भावनात्मक और सुख-सुविधा हस्तक्षेप प्रदान करते हैं। वे शान्ति, भावनात्मक सुरक्षा, घरेलू सहायता प्रदान करते हैं।',
      sa: 'चतुर्थभावस्य ग्रहाः भावनात्मकं सुखहस्तक्षेपं च प्रददति।'
    },
  },
  {
    name: { en: 'Labha Argala (Gains)', hi: 'लाभ अर्गला', sa: 'लाभार्गला' },
    house: '11th',
    virodha: '12th',
    icon: 'gains',
    color: '#86efac',
    desc: {
      en: 'Planets in the 11th from a house provide gains and achievement intervention. They bring fulfillment of desires, network support, elder sibling help, and income to the target house. Example: Saturn in 5th house (11th from 7th) provides steady, long-term gains to marriage.',
      hi: '11वें भाव के ग्रह लाभ और उपलब्धि हस्तक्षेप प्रदान करते हैं। वे इच्छाओं की पूर्ति, नेटवर्क सहायता, ज्येष्ठ भ्राता सहायता प्रदान करते हैं।',
      sa: 'एकादशभावस्य ग्रहाः लाभं प्राप्तिहस्तक्षेपं च प्रददति।'
    },
  },
  {
    name: { en: 'Putra Argala (Special/Children)', hi: 'पुत्र अर्गला (विशेष)', sa: 'पुत्रार्गला (विशेषः)' },
    house: '5th',
    virodha: '9th',
    icon: 'special',
    color: '#c4b5fd',
    desc: {
      en: 'Planets in the 5th from a house create a special Argala — related to intelligence, past-life merit (Purva Punya), children, and creative energy. This is sometimes called the most auspicious Argala because 5th house signifies Poorva Punya. Example: Mercury in 11th house (5th from 7th) provides intellectual/creative support to partnerships.',
      hi: '5वें भाव के ग्रह एक विशेष अर्गला बनाते हैं — जो बुद्धि, पूर्व जन्म के पुण्य, सन्तान और सृजनात्मक ऊर्जा से सम्बन्धित है।',
      sa: 'पञ्चमभावस्य ग्रहाः विशेषाम् अर्गलां रचयन्ति — बुद्ध्या, पूर्वपुण्येन, सन्तानैः, सृजनशक्त्या च सम्बद्धाम्।'
    },
  },
];

/* ── Virodha pairing table ────────────────────────────────────────── */
const VIRODHA_TABLE = [
  { argala: '2nd (Dhana)', virodha: '3rd', desc: { en: 'Effort & courage counter wealth support', hi: 'पराक्रम धन सहायता का प्रतिरोध करता है', sa: 'पराक्रमः धनसहायतां प्रतिरुणद्धि' } },
  { argala: '4th (Sukha)', virodha: '10th', desc: { en: 'Career demands counter emotional comfort', hi: 'कर्म की माँगें भावनात्मक सुख का प्रतिरोध करती हैं', sa: 'कर्ममाङ्गाः भावनात्मकसुखं प्रतिरुन्धन्ति' } },
  { argala: '11th (Labha)', virodha: '12th', desc: { en: 'Losses & expenses counter gains', hi: 'व्यय लाभ का प्रतिरोध करता है', sa: 'व्ययः लाभं प्रतिरुणद्धि' } },
  { argala: '5th (Putra)', virodha: '9th', desc: { en: 'Fate & dharma counter creative/past-merit support', hi: 'भाग्य सृजनात्मक/पूर्वपुण्य सहायता का प्रतिरोध करता है', sa: 'भाग्यं सृजनात्मक/पूर्वपुण्यसहायतां प्रतिरुणद्धि' } },
];

/* ── Worked example data ──────────────────────────────────────────── */
const EXAMPLE_STEPS = [
  { house: '8th (2nd from 7th)', type: { en: 'Dhana Argala', hi: 'धन अर्गला', sa: 'धनार्गला' }, planets: { en: 'Jupiter + Moon', hi: 'गुरु + चन्द्र', sa: 'गुरुः + चन्द्रः' }, result: { en: 'Strong wealth/family support for marriage. Jupiter brings wisdom, Moon brings emotional nurturing.', hi: 'विवाह के लिए मजबूत धन/पारिवारिक सहायता। गुरु ज्ञान लाता है, चन्द्र भावनात्मक पोषण।', sa: 'विवाहाय प्रबलं धन/कुटुम्बसहायता। गुरुः ज्ञानं, चन्द्रः भावनात्मकपोषणं च आनयति।' } },
  { house: '10th (4th from 7th)', type: { en: 'Sukha Argala', hi: 'सुख अर्गला', sa: 'सुखार्गला' }, planets: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, result: { en: 'Venus — the natural significator of love — in the 4th from 7th provides deep emotional comfort and harmony in marriage.', hi: 'शुक्र — प्रेम का नैसर्गिक कारक — 7वें से 4थे में विवाह में गहरा भावनात्मक सुख प्रदान करता है।', sa: 'शुक्रः — प्रेमस्य नैसर्गिककारकः — सप्तमात् चतुर्थे विवाहे गभीरं भावनात्मकसुखं ददाति।' } },
  { house: '5th (11th from 7th)', type: { en: 'Labha Argala', hi: 'लाभ अर्गला', sa: 'लाभार्गला' }, planets: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, result: { en: 'Saturn provides slow but steady gains. Marriage may start with challenges but builds lasting stability over time.', hi: 'शनि धीमा लेकिन स्थिर लाभ देता है। विवाह चुनौतियों से शुरू हो सकता है लेकिन समय के साथ स्थायी स्थिरता बनाता है।', sa: 'शनिः मन्दं किन्तु स्थिरं लाभं ददाति।' } },
  { house: '9th (3rd from 7th)', type: { en: 'Virodha to Dhana', hi: 'धन का विरोध', sa: 'धनस्य विरोधः' }, planets: { en: 'Mars alone', hi: 'केवल मंगल', sa: 'केवलं मङ्गलः' }, result: { en: 'Mars alone in the 3rd tries to obstruct the Dhana Argala — but Jupiter + Moon (2 planets) > Mars (1 planet). Argala HOLDS. Wealth support for marriage is preserved despite martial friction.', hi: '3रे में अकेला मंगल धन अर्गला को रोकने का प्रयास करता है — लेकिन गुरु + चन्द्र (2 ग्रह) > मंगल (1 ग्रह)। अर्गला बनी रहती है।', sa: 'तृतीये एकाकी मङ्गलः धनार्गलां रोद्धुं प्रयतते — किन्तु गुरुः + चन्द्रः (2 ग्रहौ) > मङ्गलः (1 ग्रहः)। अर्गला तिष्ठति।' } },
];

/* ── Special rules ────────────────────────────────────────────────── */
const SPECIAL_RULES = [
  { en: 'Rahu and Ketu: When Rahu or Ketu cause Argala, the intervention is sudden, unconventional, and often karmic. Their Argala cannot be easily predicted by standard benefic/malefic logic.', hi: 'राहु और केतु: जब राहु या केतु अर्गला कारित करते हैं, हस्तक्षेप अचानक, अपरम्परागत और प्रायः कार्मिक होता है।', sa: 'राहुकेतू: यदा राहुकेतू अर्गलां कारयतः, हस्तक्षेपः आकस्मिकः, अपरम्परागतः, प्रायः कार्मिकश्च।' },
  { en: 'Benefic vs Malefic Argala: Benefic planets (Jupiter, Venus, strong Moon, unafflicted Mercury) causing Argala bring positive intervention. Malefic planets (Saturn, Mars, Rahu, Ketu, weak Moon) bring challenging but transformative intervention.', hi: 'शुभ बनाम पाप अर्गला: शुभ ग्रह सकारात्मक हस्तक्षेप लाते हैं। पाप ग्रह चुनौतीपूर्ण लेकिन परिवर्तनकारी हस्तक्षेप लाते हैं।', sa: 'शुभपापार्गला: शुभग्रहाः सकारात्मकहस्तक्षेपम् आनयन्ति। पापग्रहाः आव्हानात्मकं किन्तु परिवर्तनकारकं हस्तक्षेपम्।' },
  { en: 'Multiple Planet Argala: When 3+ planets create Argala from the same position, it becomes an extremely powerful influence — virtually unobstructable. This is called "Bahu Graha Argala" (multi-planet bolt).', hi: 'बहु ग्रह अर्गला: जब 3+ ग्रह एक ही स्थान से अर्गला बनाते हैं, यह अत्यन्त शक्तिशाली प्रभाव बन जाता है — व्यावहारिक रूप से अप्रतिरोध्य।', sa: 'बहुग्रहार्गला: यदा 3+ ग्रहाः एकस्मात् स्थानात् अर्गलां कुर्वन्ति, अत्यन्तशक्तिशालिप्रभावः — प्रायः अप्रतिरोध्यः।' },
  { en: 'Argala in Divisional Charts: Argala analysis should be done not only in the Rashi chart (D-1) but also in divisional charts — D-9 (Navamsha) for marriage, D-10 (Dashamsha) for career, etc. Argala in the relevant divisional chart confirms or denies the Rashi chart findings.', hi: 'वर्ग कुण्डलियों में अर्गला: अर्गला विश्लेषण केवल राशि कुण्डली (D-1) में ही नहीं बल्कि वर्ग कुण्डलियों में भी किया जाना चाहिए।', sa: 'वर्गकुण्डलीषु अर्गला: अर्गलाविश्लेषणं केवलं राशिकुण्डल्यां (D-1) न, अपि तु वर्गकुण्डलीषु अपि कर्तव्यम्।' },
  { en: 'Sign-based Argala (Jaimini): In Jaimini\'s system, Argala is calculated from signs rather than houses. This means Argala can apply to any planet in the target sign, not just the house cusp. Jaimini also considers a planet\'s Chara Karaka status when evaluating Argala strength.', hi: 'राशि-आधारित अर्गला (जैमिनी): जैमिनी की पद्धति में अर्गला की गणना भावों के बजाय राशियों से होती है।', sa: 'राश्याधारितार्गला (जैमिनी): जैमिनिपद्धत्यां अर्गला भावेभ्यः न, राशिभ्यः गण्यते।' },
];

/* ── Practical tips ───────────────────────────────────────────────── */
const PRACTICAL_TIPS = [
  { en: 'Always analyze Argala for the 1st, 7th, and 10th houses first — self, marriage, and career are the most impactful life areas.', hi: 'सदैव पहले 1, 7 और 10वें भाव की अर्गला विश्लेषित करें — आत्म, विवाह और करियर सबसे प्रभावशाली जीवन क्षेत्र हैं।', sa: 'सदा प्रथमं 1, 7, 10 भावानाम् अर्गलां विश्लेषयत।' },
  { en: 'If a house has NO Argala at all (empty 2nd, 4th, 5th, 11th from it), the house lacks active support — its significations depend entirely on the house lord and occupants.', hi: 'यदि किसी भाव पर कोई अर्गला नहीं है, तो वह भाव सक्रिय सहायता से रहित है — उसके कारकत्व पूरी तरह भाव स्वामी पर निर्भर हैं।', sa: 'यदि भावे सर्वथा अर्गला नास्ति, भावः सक्रियसहायतया रहितः — तस्य कारकत्वानि केवलं भावस्वामिनि निर्भरन्ति।' },
  { en: 'Combine Argala with Ashtakavarga: if a house has strong Argala AND high Ashtakavarga bindus, it is exceptionally well-supported.', hi: 'अर्गला को अष्टकवर्ग के साथ मिलाएँ: यदि किसी भाव में मजबूत अर्गला और उच्च अष्टकवर्ग बिन्दु हैं, तो वह असाधारण रूप से समर्थित है।', sa: 'अर्गलाम् अष्टकवर्गेण सह संयोजयत: यदि भावे प्रबला अर्गला उच्चाष्टकवर्गबिन्दवश्च, सः असाधारणरूपेण समर्थितः।' },
  { en: 'In transit analysis, temporary Argala forms when transiting planets occupy the 2nd, 4th, 5th, or 11th from a natal house — giving temporary boost or challenge to that house.', hi: 'गोचर विश्लेषण में, अस्थायी अर्गला बनती है जब गोचरी ग्रह जन्म भाव से 2, 4, 5 या 11वें भाव में गुज़रते हैं।', sa: 'गोचरविश्लेषणे, अस्थायी अर्गला निर्मीयते यदा गोचरिग्रहाः जन्मभावात् 2, 4, 5, 11 भावेषु गच्छन्ति।' },
];

/* ── Cross-references ─────────────────────────────────────────────── */
const CROSS_REFS = [
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' }, desc: { en: 'See Argala in your own birth chart', hi: 'अपनी जन्म कुण्डली में अर्गला देखें', sa: 'स्वजन्मकुण्डल्याम् अर्गलां पश्यत' } },
  { href: '/learn/jaimini', label: { en: 'Jaimini Astrology', hi: 'जैमिनी ज्योतिष', sa: 'जैमिनीज्योतिषम्' }, desc: { en: 'Sign-based Argala and Chara Karakas', hi: 'राशि-आधारित अर्गला और चर कारक', sa: 'राश्याधारितार्गला चरकारकाश्च' } },
  { href: '/learn/bhavas', label: { en: 'The 12 Bhavas (Houses)', hi: '12 भाव', sa: '12 भावाः' }, desc: { en: 'Understand house significations for Argala analysis', hi: 'अर्गला विश्लेषण के लिए भाव कारकत्व समझें', sa: 'अर्गलाविश्लेषणाय भावकारकत्वानि अवगच्छत' } },
  { href: '/learn/ashtakavarga', label: { en: 'Ashtakavarga', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्गः' }, desc: { en: 'Combine Argala with Ashtakavarga bindus', hi: 'अर्गला को अष्टकवर्ग बिन्दुओं के साथ संयोजित करें', sa: 'अर्गलाम् अष्टकवर्गबिन्दुभिः सह संयोजयत' } },
];

/* ── Page component ───────────────────────────────────────────────── */
export default function ArgalaPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const loc = isDevanagariLocale(locale) ? 'hi' as const : 'en' as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-2">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-primary/15 border border-gold-primary/30 mb-4">
          <Zap className="w-8 h-8 text-gold-primary" />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* ── Section 1: What is Argala? ────────────────────────────── */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p>{t('whatContent')}</p>
        <p>{t('whatContent2')}</p>
        <div className="mt-4 p-4 rounded-lg bg-gold-primary/5 border border-gold-primary/15">
          <p className="text-gold-light text-sm italic">
            {t('sourceContent')}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 2: The Four Types ─────────────────────────────── */}
      <LessonSection number={2} title={t('typesTitle')}>
        <p>{t('typesContent')}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ARGALA_TYPES.map((a, i) => (
            <motion.div
              key={a.icon}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 hover:border-gold-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: a.color + '20', color: a.color }}
                >
                  {a.house}
                </div>
                <div>
                  <h4 className="text-gold-light font-semibold text-sm">{lt(a.name as LocaleText, locale)}</h4>
                  <span className="text-text-secondary/70 text-xs font-mono">
                    {tl({ en: 'Virodha:', hi: 'विरोध:', sa: 'विरोध:' }, locale)} {a.virodha}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{lt(a.desc as LocaleText, locale)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 3: Virodha Argala ─────────────────────────────── */}
      <LessonSection number={3} title={t('virodhaTitle')}>
        <p>{t('virodhaContent')}</p>
        <p>{t('virodhaContent2')}</p>

        {/* Virodha table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{tl({ en: 'Argala House', hi: 'अर्गला भाव', sa: 'अर्गला भाव' }, locale)}</th>
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{tl({ en: 'Virodha House', hi: 'विरोध भाव', sa: 'विरोध भाव' }, locale)}</th>
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{tl({ en: 'Dynamic', hi: 'गतिशीलता', sa: 'गतिशीलता' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {VIRODHA_TABLE.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                >
                  <td className="py-3 px-4 text-gold-primary font-mono">{row.argala}</td>
                  <td className="py-3 px-4 text-text-secondary font-mono">{row.virodha}</td>
                  <td className="py-3 px-4 text-text-secondary">{lt(row.desc as LocaleText, locale)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key rule callout */}
        <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/80 text-sm">
            {locale === 'en'
              ? 'KEY RULE: Argala planets >= Virodha planets → Argala HOLDS. Virodha planets > Argala planets → Argala BLOCKED.'
              : 'मुख्य नियम: अर्गला ग्रह >= विरोध ग्रह → अर्गला बनी रहती है। विरोध ग्रह > अर्गला ग्रह → अर्गला अवरुद्ध।'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 4: Worked Example ─────────────────────────────── */}
      <LessonSection number={4} title={t('exampleTitle')}>
        <p>{t('exampleContent')}</p>

        <div className="mt-6 space-y-4">
          {EXAMPLE_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-gold-primary font-mono text-xs px-2 py-0.5 rounded bg-gold-primary/10">
                    {step.house}
                  </span>
                  <span className="text-gold-light font-semibold text-sm">{lt(step.type as LocaleText, locale)}</span>
                  <ArrowRight className="w-3 h-3 text-text-secondary/65" />
                  <span className="text-text-secondary text-sm">{lt(step.planets as LocaleText, locale)}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{lt(step.result as LocaleText, locale)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20">
          <p className="text-emerald-300/80 text-sm font-semibold mb-1">
            {tl({ en: 'Verdict: This 7th house is WELL-SUPPORTED', hi: 'निष्कर्ष: यह 7वाँ भाव सुसमर्थित है', sa: 'निष्कर्ष: यह 7वाँ भाव सुसमर्थित है' }, locale)}
          </p>
          <p className="text-emerald-200/60 text-sm">
            {locale === 'en'
              ? 'Three active Argalas (Dhana, Sukha, Labha) with only one partial obstruction attempt that fails. Marriage has strong financial, emotional, and achievement support.'
              : 'तीन सक्रिय अर्गलाएँ (धन, सुख, लाभ) और केवल एक आंशिक बाधा प्रयास जो विफल होता है। विवाह को मजबूत वित्तीय, भावनात्मक और उपलब्धि सहायता प्राप्त है।'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 5: Reading Argala ─────────────────────────────── */}
      <LessonSection number={5} title={t('readingTitle')}>
        <p>{t('readingContent')}</p>
        <p>{t('supportedContent')}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-emerald-300 font-semibold text-sm">{tl({ en: 'Supported House', hi: 'समर्थित भाव', sa: 'समर्थित भाव' }, locale)}</h4>
            </div>
            <p className="text-emerald-200/60 text-sm">
              {locale === 'en'
                ? 'Life area flourishes with active backing. Results come with external help. Planets bring their significations as gifts.'
                : 'जीवन क्षेत्र सक्रिय सहायता से फलता-फूलता है। बाहरी सहायता से परिणाम आते हैं।'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="flex items-center gap-2 mb-2">
              <ShieldX className="w-5 h-5 text-red-400" />
              <h4 className="text-red-300 font-semibold text-sm">{tl({ en: 'Obstructed House', hi: 'अवरुद्ध भाव', sa: 'अवरुद्ध भाव' }, locale)}</h4>
            </div>
            <p className="text-red-200/60 text-sm">
              {locale === 'en'
                ? 'Life area faces counter-forces. Results require more personal effort. External circumstances work against easy fulfillment.'
                : 'जीवन क्षेत्र प्रतिरोधी शक्तियों का सामना करता है। परिणामों के लिए अधिक व्यक्तिगत प्रयास आवश्यक है।'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Section 6: Remedies ────────────────────────────────────── */}
      <LessonSection number={6} title={t('remediesTitle')}>
        <p>{t('remediesContent')}</p>
      </LessonSection>

      {/* ── Section 7: Special Rules ──────────────────────────────── */}
      <LessonSection number={7} title={t('specialTitle')}>
        <p>{t('specialContent')}</p>
        <div className="mt-4 space-y-3">
          {SPECIAL_RULES.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30"
            >
              <p className="text-text-secondary text-sm leading-relaxed">{(rule as Record<string, string>)[locale] || rule.en}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 8: Practical Tips ─────────────────────────────── */}
      <LessonSection number={8} title={t('practicalTitle')}>
        <div className="space-y-3">
          {PRACTICAL_TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <Star className="w-4 h-4 text-gold-primary flex-shrink-0 mt-1" />
              <p className="text-text-secondary text-sm leading-relaxed">{(tip as Record<string, string>)[locale] || tip.en}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 9: Cross References ───────────────────────────── */}
      <LessonSection number={9} title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/jaimini'}
              className="block p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{lt(ref.label as LocaleText, locale)}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{lt(ref.desc as LocaleText, locale)}</p>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {tl({ en: 'Analyze Your Argala', hi: 'अपनी अर्गला का विश्लेषण करें', sa: 'अपनी अर्गला का विश्लेषण करें' }, locale)}
        </Link>
      </div>
    </div>
  );
}
