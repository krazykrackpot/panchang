'use client';

import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Inline LABELS (en + hi) ────────────────────────────────────────────────

const LABELS = {
  title: {
    en: 'Ashtakavarga Dasha — Timing Predictions from Bindu Scores',
    hi: 'अष्टकवर्ग दशा — बिन्दु अंकों से समय भविष्यवाणी',
  },
  subtitle: {
    en: 'Using Ashtakavarga bindu totals to predict dasha period quality and transit outcomes',
    hi: 'दशा काल की गुणवत्ता और गोचर परिणामों की भविष्यवाणी के लिए अष्टकवर्ग बिन्दु का उपयोग',
  },
} as const;

// ─── Data ────────────────────────────────────────────────────────────────────

const SIGNS_SHORT = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SIGNS_SHORT_HI = ['मे', 'वृ', 'मि', 'क', 'सिं', 'कन्', 'तु', 'वृश्', 'ध', 'म', 'कुं', 'मी'];

/** Example BAV table: 7 planets × 12 signs */
const EXAMPLE_BAV: { planet: string; planetHi: string; color: string; scores: number[] }[] = [
  { planet: 'Sun',     planetHi: 'सूर्य', color: '#f59e0b', scores: [5, 3, 4, 6, 4, 3, 5, 2, 6, 3, 4, 3] },
  { planet: 'Moon',    planetHi: 'चन्द्र', color: '#e2e8f0', scores: [4, 5, 3, 6, 2, 4, 5, 3, 4, 5, 3, 5] },
  { planet: 'Mars',    planetHi: 'मंगल', color: '#ef4444', scores: [3, 2, 5, 3, 4, 2, 3, 5, 4, 6, 3, 1] },
  { planet: 'Mercury', planetHi: 'बुध',  color: '#22c55e', scores: [5, 6, 4, 5, 3, 7, 4, 3, 5, 4, 6, 2] },
  { planet: 'Jupiter', planetHi: 'गुरु', color: '#f0d48a', scores: [6, 4, 5, 7, 5, 4, 6, 3, 7, 5, 4, 5] },
  { planet: 'Venus',   planetHi: 'शुक्र', color: '#ec4899', scores: [4, 5, 3, 4, 6, 5, 4, 3, 5, 4, 6, 3] },
  { planet: 'Saturn',  planetHi: 'शनि',  color: '#3b82f6', scores: [3, 2, 4, 5, 3, 6, 5, 1, 4, 6, 3, 7] },
];

const SAV_EXAMPLE = [30, 27, 28, 36, 27, 31, 32, 20, 35, 33, 29, 26];

const PREDICTION_LEVELS = [
  { range: '40+', label: { en: 'Highly Favorable', hi: 'अत्यन्त अनुकूल' }, color: 'text-emerald-300', bg: 'bg-emerald-500/10', desc: { en: 'The dasha lord has strong Ashtakavarga support across the zodiac. Material success, good health, and overall prosperity.', hi: 'दशा स्वामी का राशिचक्र में प्रबल अष्टकवर्ग समर्थन। भौतिक सफलता, स्वास्थ्य और समृद्धि।' } },
  { range: '30-39', label: { en: 'Favorable', hi: 'अनुकूल' }, color: 'text-emerald-400', bg: 'bg-emerald-500/8', desc: { en: 'Adequate Ashtakavarga support. Positive outcomes with some areas of moderate challenge.', hi: 'पर्याप्त अष्टकवर्ग समर्थन। कुछ मध्यम चुनौतियों के साथ सकारात्मक परिणाम।' } },
  { range: '20-29', label: { en: 'Moderate', hi: 'मध्यम' }, color: 'text-amber-400', bg: 'bg-amber-500/8', desc: { en: 'Average scores indicate both opportunities and obstacles in roughly equal measure.', hi: 'औसत अंक अवसरों और बाधाओं दोनों को लगभग समान मात्रा में इंगित करते हैं।' } },
  { range: '<20', label: { en: 'Challenging', hi: 'कठिन' }, color: 'text-red-400', bg: 'bg-red-500/8', desc: { en: 'Low Ashtakavarga support. Obstacles and delays likely. Remedial measures recommended.', hi: 'न्यून अष्टकवर्ग समर्थन। बाधाएँ और देरी सम्भव। उपचारात्मक उपाय अनुशंसित।' } },
];

const DASHA_STEPS = [
  { step: 1, title: { en: 'Find the Dasha Lord\'s Position', hi: 'दशा स्वामी की स्थिति ज्ञात करें' }, desc: { en: 'Identify which sign and house the current Maha Dasha lord occupies in the natal chart.', hi: 'पहचानें कि वर्तमान महा दशा स्वामी जन्म कुण्डली में किस राशि और भाव में स्थित है।' } },
  { step: 2, title: { en: 'Check BAV in Dasha Lord\'s Sign', hi: 'दशा स्वामी की राशि में BAV जाँचें' }, desc: { en: 'Look up the dasha lord\'s own Bhinnashtakavarga score in the sign it occupies. A score of 4+ is the threshold for favorable results.', hi: 'दशा स्वामी का अपनी राशि में भिन्नाष्टकवर्ग अंक देखें। 4+ अनुकूल परिणामों की सीमा है।' } },
  { step: 3, title: { en: 'Check SAV of That Sign', hi: 'उस राशि का SAV जाँचें' }, desc: { en: 'Check the Sarvashtakavarga total for the sign containing the dasha lord. SAV 28+ is above average; the higher the SAV, the more support from all planetary sources.', hi: 'दशा स्वामी वाली राशि का सर्वाष्टकवर्ग योग जाँचें। SAV 28+ औसत से ऊपर है।' } },
  { step: 4, title: { en: 'Check BAV Along Transit Path', hi: 'गोचर पथ में BAV जाँचें' }, desc: { en: 'During the dasha period, the dasha lord will transit multiple signs. Check its BAV scores in each transit sign to identify favorable and challenging sub-periods.', hi: 'दशा काल में दशा स्वामी अनेक राशियों से गुज़रेगा। प्रत्येक गोचर राशि में BAV देखें।' } },
  { step: 5, title: { en: 'Synthesize the Prediction', hi: 'भविष्यवाणी संश्लेषित करें' }, desc: { en: 'High BAV in own sign + high SAV of that sign = strongly favorable dasha. Low BAV + low SAV = challenging. Mixed = moderate with specific windows of opportunity.', hi: 'अपनी राशि में उच्च BAV + उस राशि का उच्च SAV = अत्यन्त अनुकूल दशा।' } },
];

const PREDICTION_CHECKLIST = [
  { rule: { en: 'Planet with BAV total 40+ across 12 signs → prosperous dasha overall', hi: 'BAV कुल 40+ → समग्र रूप से समृद्ध दशा' }, icon: '1' },
  { rule: { en: 'Planet with BAV total <20 → struggles in that planet\'s significations', hi: 'BAV कुल <20 → उस ग्रह के संकेतों में कठिनाइयाँ' }, icon: '2' },
  { rule: { en: 'Jupiter+Saturn both transiting high SAV signs → major positive events', hi: 'गुरु+शनि दोनों उच्च SAV राशियों में → प्रमुख सकारात्मक घटनाएँ' }, icon: '3' },
  { rule: { en: 'Dasha lord in sign with BAV 0-1 → acute difficulties during that transit', hi: 'दशा स्वामी BAV 0-1 राशि में → उस गोचर में तीव्र कठिनाइयाँ' }, icon: '4' },
  { rule: { en: 'Transit through high BAV + high SAV sign → peak results for that planet', hi: 'उच्च BAV + उच्च SAV राशि में गोचर → उस ग्रह के शिखर परिणाम' }, icon: '5' },
  { rule: { en: 'Rahu dasha → use Saturn\'s BAV; Ketu dasha → use Mars\'s BAV', hi: 'राहु दशा → शनि का BAV; केतु दशा → मंगल का BAV उपयोग करें' }, icon: '6' },
];

const CLASSICAL_REFS = [
  { text: { en: 'BPHS Ch.66-72', hi: 'बृहत् पराशर होरा शास्त्र अ.66-72' }, desc: { en: 'Comprehensive rules for predicting dasha results from Ashtakavarga bindus. Covers BAV totals, transit scoring, and Shodhana-based timing.', hi: 'अष्टकवर्ग बिन्दुओं से दशा परिणामों की भविष्यवाणी के व्यापक नियम।' } },
  { text: { en: 'Phaladeepika Ch.18 (Mantreshwara)', hi: 'फलदीपिका अ.18 (मन्त्रेश्वर)' }, desc: { en: 'Mantreshwara\'s rules on bindu-based timing: how to use reduced Ashtakavarga scores to time events within a dasha period.', hi: 'बिन्दु-आधारित समय निर्धारण पर मन्त्रेश्वर के नियम।' } },
  { text: { en: 'Jataka Parijata on Transit Scoring', hi: 'जातक पारिजात — गोचर अंक' }, desc: { en: 'Vaidyanatha Dikshita\'s method of combining Ashtakavarga with Vimshottari Dasha for precise period-level predictions.', hi: 'सटीक अवधि-स्तरीय भविष्यवाणी के लिए अष्टकवर्ग को विंशोत्तरी दशा से जोड़ने की विधि।' } },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LearnAshtakavargaDashaPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const l = (obj: { en: string; hi: string }) => isHi ? obj.hi : obj.en;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(LABELS.title)}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{l(LABELS.subtitle)}</p>
      </div>

      {/* Sanskrit Term Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Dasha" meaning="Planetary period" />
        <SanskritTermCard term="Bindu" devanagari="बिन्दु" transliteration="Bindu" meaning="Benefic point" />
        <SanskritTermCard term="Bhinna" devanagari="भिन्न" transliteration="Bhinna" meaning="Individual (BAV)" />
        <SanskritTermCard term="Sarva" devanagari="सर्व" transliteration="Sarva" meaning="Combined (SAV)" />
        <SanskritTermCard term="Pinda" devanagari="पिण्ड" transliteration="Pinda" meaning="Weighted total" />
        <SanskritTermCard term="Gochara" devanagari="गोचर" transliteration="Gochara" meaning="Transit" />
      </div>

      {/* ─── Section 1: Introduction ─── */}
      <LessonSection number={1} title={l({ en: 'What is Ashtakavarga Dasha?', hi: 'अष्टकवर्ग दशा क्या है?' })}>
        <p style={bodyFont}>
          {l({
            en: 'Ashtakavarga Dasha is a method of predicting the quality of planetary dasha periods using bindu (point) totals from the Ashtakavarga system. While standard Vimshottari Dasha interpretation focuses on the dasha lord\'s dignity, house rulership, and aspects, Ashtakavarga Dasha adds a numerical dimension — how much "support" each planet has across the zodiac.',
            hi: 'अष्टकवर्ग दशा, अष्टकवर्ग प्रणाली के बिन्दु (अंक) योग का उपयोग करके ग्रह दशा काल की गुणवत्ता की भविष्यवाणी करने की विधि है। जहाँ मानक विंशोत्तरी दशा व्याख्या दशा स्वामी की गरिमा, भाव स्वामित्व और दृष्टि पर केन्द्रित होती है, अष्टकवर्ग दशा एक संख्यात्मक आयाम जोड़ती है।',
          })}
        </p>
        <p className="mt-3" style={bodyFont}>
          {l({
            en: 'A planet might be well-placed by sign (exalted, own sign) but have low Ashtakavarga support — meaning its dasha won\'t deliver the full promise. Conversely, a debilitated planet with high bindu totals can surprise with better-than-expected results during its dasha.',
            hi: 'एक ग्रह राशि के अनुसार अच्छी स्थिति में हो सकता है (उच्च, स्वराशि) लेकिन अष्टकवर्ग समर्थन कम हो — अर्थात् उसकी दशा पूर्ण वादा पूरा नहीं करेगी। इसके विपरीत, उच्च बिन्दु योग वाला नीच ग्रह अपनी दशा में अपेक्षा से बेहतर परिणाम दे सकता है।',
          })}
        </p>
        <div className="mt-4 p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl">
          <p className="text-gold-light text-sm font-semibold mb-2" style={headingFont}>
            {l({ en: 'Classical Sources', hi: 'शास्त्रीय स्रोत' })}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
            {l({
              en: 'BPHS (Brihat Parashara Hora Shastra) Chapters 66-72 provide the foundation. Phaladeepika Chapter 18 by Mantreshwara offers practical rules for bindu-based timing. These texts establish that Ashtakavarga scores are not just for transit analysis — they fundamentally modify dasha predictions.',
              hi: 'बृहत् पराशर होरा शास्त्र (BPHS) अध्याय 66-72 आधार प्रदान करते हैं। मन्त्रेश्वर की फलदीपिका अध्याय 18 बिन्दु-आधारित समय निर्धारण के व्यावहारिक नियम देती है।',
            })}
          </p>
        </div>
      </LessonSection>

      {/* ─── Section 2: Foundation Recap ─── */}
      <LessonSection number={2} title={l({ en: 'Foundation Recap: SAV and BAV', hi: 'आधार पुनरावलोकन: SAV और BAV' })}>
        <p style={bodyFont}>
          {l({
            en: 'Before predicting dasha results, you need two Ashtakavarga tables from the natal chart. For a deeper introduction, see the Ashtakavarga reference page.',
            hi: 'दशा परिणामों की भविष्यवाणी से पहले, आपको जन्म कुण्डली से दो अष्टकवर्ग तालिकाओं की आवश्यकता है। विस्तृत परिचय के लिए अष्टकवर्ग संदर्भ पृष्ठ देखें।',
          })}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BAV card */}
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {l({ en: 'Bhinna Ashtakavarga (BAV)', hi: 'भिन्न अष्टकवर्ग (BAV)' })}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {l({
                en: 'Each planet\'s individual bindu score in each of the 12 signs. Tells you how strong a planet is in a specific sign — for both natal placement and transit.',
                hi: 'प्रत्येक ग्रह का 12 राशियों में व्यक्तिगत बिन्दु अंक। बताता है कि एक ग्रह किसी विशेष राशि में कितना बलवान है।',
              })}
            </p>
          </div>
          {/* SAV card */}
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {l({ en: 'Sarva Ashtakavarga (SAV)', hi: 'सर्वाष्टकवर्ग (SAV)' })}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {l({
                en: 'Total bindus in each sign from all 7 planets + Lagna combined. The grand total is always 337. Signs with SAV 28+ are above average; signs below 25 are weak zones.',
                hi: 'सभी 7 ग्रहों + लग्न के संयुक्त बिन्दु। कुल योग सदैव 337 है। SAV 28+ वाली राशियाँ औसत से ऊपर; 25 से नीचे कमज़ोर क्षेत्र।',
              })}
            </p>
          </div>
        </div>

        {/* Bindu meaning scale */}
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {l({ en: 'BAV Score Scale', hi: 'BAV अंक पैमाना' })}
          </p>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="flex-1 h-10 rounded flex items-center justify-center text-xs font-mono font-bold"
                style={{
                  backgroundColor: n < 4 ? `rgba(239,68,68,${0.1 + n * 0.08})` : `rgba(34,197,94,${0.1 + (n - 4) * 0.1})`,
                  color: n < 4 ? '#ef4444' : '#22c55e',
                  border: n === 4 ? '2px solid #f0d48a' : '1px solid transparent',
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-red-400">{l({ en: 'Weak (0-3)', hi: 'दुर्बल (0-3)' })}</span>
            <span className="text-gold-light">{l({ en: 'Threshold = 4', hi: 'सीमा = 4' })}</span>
            <span className="text-emerald-400">{l({ en: 'Strong (5-8)', hi: 'बलवान (5-8)' })}</span>
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 3: Method — Step-by-Step ─── */}
      <LessonSection number={3} title={l({ en: 'Method: Predicting Dasha Results', hi: 'विधि: दशा परिणामों की भविष्यवाणी' })} variant="highlight">
        <p style={bodyFont}>
          {l({
            en: 'Follow these five steps to assess any Maha Dasha period using Ashtakavarga. The engine in our Kundali tool automates this process, but understanding the method deepens your interpretive skill.',
            hi: 'अष्टकवर्ग का उपयोग करके किसी भी महा दशा काल का मूल्यांकन करने के लिए इन पाँच चरणों का पालन करें।',
          })}
        </p>

        <div className="mt-4 space-y-3">
          {DASHA_STEPS.map((s) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: s.step * 0.08 }}
              className="flex gap-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
                  {l(s.title)}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                  {l(s.desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Worked Example */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {l({ en: 'Worked Example: Jupiter Maha Dasha', hi: 'कार्य उदाहरण: गुरु महा दशा' })}
          </p>
          <div className="space-y-2 text-xs font-mono">
            <p className="text-text-secondary">
              {l({ en: 'Step 1: Jupiter is in Cancer (sign 4) in the natal chart', hi: 'चरण 1: जन्म कुण्डली में गुरु कर्क (राशि 4) में है' })}
            </p>
            <p className="text-text-secondary">
              {l({ en: 'Step 2: Jupiter\'s BAV in Cancer = 7 bindus (excellent)', hi: 'चरण 2: कर्क में गुरु का BAV = 7 बिन्दु (उत्कृष्ट)' })}
            </p>
            <p className="text-text-secondary">
              {l({ en: 'Step 3: SAV of Cancer = 36 (well above 28 average)', hi: 'चरण 3: कर्क का SAV = 36 (28 औसत से बहुत ऊपर)' })}
            </p>
            <p className="text-text-secondary">
              {l({ en: 'Step 4: Jupiter BAV total across all 12 signs = 61 (highly favorable)', hi: 'चरण 4: सभी 12 राशियों में गुरु BAV योग = 61 (अत्यन्त अनुकूल)' })}
            </p>
            <p className="text-emerald-400 font-bold mt-2">
              {l({ en: 'Prediction: Highly favorable dasha. Jupiter is exalted in Cancer with strong BAV and SAV support. Expect wealth, wisdom, spiritual growth, and children\'s prosperity during this 16-year period.', hi: 'भविष्यवाणी: अत्यन्त अनुकूल दशा। गुरु कर्क में उच्च है, प्रबल BAV और SAV समर्थन के साथ। इस 16 वर्षीय अवधि में धन, ज्ञान, आध्यात्मिक वृद्धि और सन्तान समृद्धि की अपेक्षा करें।' })}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 4: Transit Scoring with Ashtakavarga ─── */}
      <LessonSection number={4} title={l({ en: 'Transit Scoring with Ashtakavarga', hi: 'अष्टकवर्ग से गोचर अंकन' })}>
        <p style={bodyFont}>
          {l({
            en: 'Beyond dasha prediction, Ashtakavarga excels at evaluating transits (Gochara Phal). When a planet transits a sign, its effect is filtered through that sign\'s SAV and the planet\'s own BAV score there.',
            hi: 'दशा भविष्यवाणी के अतिरिक्त, अष्टकवर्ग गोचर मूल्यांकन (गोचर फल) में उत्कृष्ट है। जब कोई ग्रह किसी राशि में गोचर करता है, तो उसका प्रभाव उस राशि के SAV और ग्रह के BAV से छनता है।',
          })}
        </p>

        {/* Key transit rules */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <h4 className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
              {l({ en: 'Saturn Transit', hi: 'शनि गोचर' })}
            </h4>
            <p className="text-text-secondary text-xs" style={bodyFont}>
              {l({
                en: 'Saturn stays ~2.5 years per sign. Through high SAV signs (28+): disciplined growth. Through low SAV signs (<25): heavy karmic pressure, delays, restructuring.',
                hi: 'शनि प्रति राशि ~2.5 वर्ष रहता है। उच्च SAV (28+) में: अनुशासित वृद्धि। न्यून SAV (<25) में: कठिन कार्मिक दबाव, देरी।',
              })}
            </p>
          </div>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <h4 className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
              {l({ en: 'Jupiter Transit', hi: 'गुरु गोचर' })}
            </h4>
            <p className="text-text-secondary text-xs" style={bodyFont}>
              {l({
                en: 'Jupiter stays ~1 year per sign. Through high SAV: expansion, luck, opportunities. Through low SAV: muted blessings, over-optimism without backing.',
                hi: 'गुरु प्रति राशि ~1 वर्ष रहता है। उच्च SAV में: विस्तार, भाग्य, अवसर। न्यून SAV में: मन्द आशीर्वाद।',
              })}
            </p>
          </div>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 sm:col-span-2">
            <h4 className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
              {l({ en: 'Double Transit (Dviguna Gochara)', hi: 'द्विगुण गोचर' })}
            </h4>
            <p className="text-text-secondary text-xs" style={bodyFont}>
              {l({
                en: 'When both Jupiter AND Saturn simultaneously transit signs with high SAV (28+), major positive life events manifest: marriage, promotion, property purchase, childbirth. This "double transit through strong signs" is one of the most reliable timing tools in Vedic astrology.',
                hi: 'जब गुरु और शनि दोनों एक साथ उच्च SAV (28+) राशियों में गोचर करें, तो प्रमुख सकारात्मक जीवन घटनाएँ घटित होती हैं: विवाह, पदोन्नति, सम्पत्ति, सन्तान प्राप्ति।',
              })}
            </p>
          </div>
        </div>

        {/* Kakshya */}
        <div className="mt-4 p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl">
          <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
            {l({ en: 'Kakshya — Finer Timing Within a Sign', hi: 'कक्ष्या — राशि के भीतर सूक्ष्म समय' })}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-3" style={bodyFont}>
            {l({
              en: 'Each 30-degree sign is divided into 8 sub-divisions of 3 degrees 45 minutes each, called Kakshya. Each Kakshya is ruled by one of the 8 contributors (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Lagna). When a transiting planet passes through a Kakshya whose ruler contributed a bindu in that sign, the transit gives positive results for that ~2-day window.',
              hi: 'प्रत्येक 30 अंश की राशि को 3 अंश 45 मिनट के 8 उपभागों में विभाजित किया जाता है, जिन्हें कक्ष्या कहते हैं। जब गोचरी ग्रह उस कक्ष्या से गुज़रता है जिसका स्वामी ने उस राशि में बिन्दु दिया है, तो गोचर ~2 दिन के लिए सकारात्मक परिणाम देता है।',
            })}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-xs">
            {[
              { n: 1, ruler: 'Saturn', rulerHi: 'शनि', color: '#3b82f6' },
              { n: 2, ruler: 'Jupiter', rulerHi: 'गुरु', color: '#f0d48a' },
              { n: 3, ruler: 'Mars', rulerHi: 'मंगल', color: '#ef4444' },
              { n: 4, ruler: 'Sun', rulerHi: 'सूर्य', color: '#f59e0b' },
              { n: 5, ruler: 'Venus', rulerHi: 'शुक्र', color: '#ec4899' },
              { n: 6, ruler: 'Mercury', rulerHi: 'बुध', color: '#22c55e' },
              { n: 7, ruler: 'Moon', rulerHi: 'चन्द्र', color: '#e2e8f0' },
              { n: 8, ruler: 'Lagna', rulerHi: 'लग्न', color: '#a855f7' },
            ].map((k) => (
              <div key={k.n} className="rounded p-1.5 border border-gold-primary/10 bg-bg-primary/50 text-center">
                <div className="font-mono text-text-secondary text-[10px]">{k.n}</div>
                <div className="text-[10px] font-medium mt-0.5" style={{ color: k.color }}>
                  {isHi ? k.rulerHi : k.ruler}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 5: BAV Table Visual ─── */}
      <LessonSection number={5} title={l({ en: 'BAV Scoring Table (Example)', hi: 'BAV अंक तालिका (उदाहरण)' })}>
        <p style={bodyFont}>
          {l({
            en: 'Below is a complete Bhinnashtakavarga table for an example chart. Each row shows a planet\'s bindu score in each of the 12 signs. The rightmost column shows the total — this total determines dasha quality.',
            hi: 'नीचे एक उदाहरण कुण्डली की पूर्ण भिन्नाष्टकवर्ग तालिका है। प्रत्येक पंक्ति प्रत्येक 12 राशियों में ग्रह का बिन्दु अंक दिखाती है। दाँयां स्तम्भ कुल दिखाता है — यही दशा गुणवत्ता निर्धारित करता है।',
          })}
        </p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">{l({ en: 'Planet', hi: 'ग्रह' })}</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">
                    {isHi ? SIGNS_SHORT_HI[i] : s}
                  </th>
                ))}
                <th className="text-center py-2 px-1 text-gold-dark font-bold">{l({ en: 'Total', hi: 'योग' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {EXAMPLE_BAV.map((row) => {
                const total = row.scores.reduce((a, b) => a + b, 0);
                return (
                  <tr key={row.planet}>
                    <td className="py-2 px-1 font-medium" style={{ color: row.color }}>
                      {isHi ? row.planetHi : row.planet}
                    </td>
                    {row.scores.map((score, i) => (
                      <td key={i} className={`text-center py-2 px-1 font-mono ${score >= 5 ? 'text-emerald-400' : score >= 4 ? 'text-emerald-400/70' : score <= 1 ? 'text-red-400' : score <= 2 ? 'text-red-400/70' : 'text-amber-400'}`}>
                        {score}
                      </td>
                    ))}
                    <td className={`text-center py-2 px-1 font-mono font-bold ${total >= 40 ? 'text-emerald-300' : total >= 30 ? 'text-emerald-400' : total < 20 ? 'text-red-400' : 'text-amber-400'}`}>
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs">
            {l({ en: 'Green = 5+ (strong) | Yellow-green = 4 (threshold) | Yellow = 3 (mixed) | Red = 0-2 (weak)', hi: 'हरा = 5+ (बलवान) | हल्का हरा = 4 (सीमा) | पीला = 3 (मिश्रित) | लाल = 0-2 (दुर्बल)' })}
          </p>
        </div>

        {/* SAV Bar Chart */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {l({ en: 'SAV by Sign (Bar Chart)', hi: 'राशि अनुसार SAV (बार चार्ट)' })}
          </p>
          <div className="flex items-end gap-1 h-32">
            {SAV_EXAMPLE.map((score, i) => {
              const maxH = 36;
              const pct = (score / maxH) * 100;
              const color = score >= 28 ? '#22c55e' : score <= 24 ? '#ef4444' : '#f59e0b';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono" style={{ color }}>{score}</span>
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${pct}%`, backgroundColor: color, opacity: 0.7 }}
                  />
                  <span className="text-[9px] text-text-secondary font-mono">
                    {isHi ? SIGNS_SHORT_HI[i] : SIGNS_SHORT[i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px]">
            <span className="text-text-tertiary">{l({ en: 'Total: 354 | Avg: ~29.5', hi: 'कुल: 354 | औसत: ~29.5' })}</span>
            <span className="text-emerald-400/70">{l({ en: '28+ = above average', hi: '28+ = औसत से ऊपर' })}</span>
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 6: Practical Prediction Rules ─── */}
      <LessonSection number={6} title={l({ en: 'Practical Prediction Rules', hi: 'व्यावहारिक भविष्यवाणी नियम' })}>
        <p style={bodyFont}>
          {l({
            en: 'These are the core rules for predicting dasha quality from Ashtakavarga, distilled from BPHS, Phaladeepika, and practical application:',
            hi: 'अष्टकवर्ग से दशा गुणवत्ता की भविष्यवाणी के मूल नियम, BPHS, फलदीपिका और व्यावहारिक अनुप्रयोग से:',
          })}
        </p>

        {/* Prediction Levels */}
        <div className="mt-4 space-y-2">
          {PREDICTION_LEVELS.map((level) => (
            <div key={level.range} className={`p-3 rounded-lg border border-gold-primary/10 ${level.bg}`}>
              <div className="flex items-center gap-3 mb-1">
                <span className={`font-mono font-bold text-sm ${level.color}`}>{level.range}</span>
                <span className={`text-sm font-semibold ${level.color}`} style={headingFont}>
                  {l(level.label)}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {l(level.desc)}
              </p>
            </div>
          ))}
        </div>

        {/* Prediction Checklist Card */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <h4 className="text-gold-light text-sm font-bold mb-3" style={headingFont}>
            {l({ en: 'Prediction Checklist', hi: 'भविष्यवाणी जाँच-सूची' })}
          </h4>
          <div className="space-y-2">
            {PREDICTION_CHECKLIST.map((item) => (
              <div key={item.icon} className="flex gap-3 items-start">
                <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold">
                  {item.icon}
                </div>
                <p className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                  {l(item.rule)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 7: Dasha Prediction Flowchart ─── */}
      <LessonSection number={7} title={l({ en: 'Dasha Prediction Flowchart', hi: 'दशा भविष्यवाणी प्रवाह-चित्र' })}>
        <p style={bodyFont}>
          {l({
            en: 'Use this visual decision tree to quickly assess any Maha Dasha:',
            hi: 'किसी भी महा दशा का तुरन्त मूल्यांकन करने के लिए इस दृश्य निर्णय वृक्ष का उपयोग करें:',
          })}
        </p>

        <div className="mt-4 space-y-3">
          {/* Flowchart nodes */}
          {[
            { q: { en: 'Is the dasha lord\'s BAV total >= 40?', hi: 'क्या दशा स्वामी का BAV कुल >= 40 है?' }, yes: { en: 'Highly Favorable Period', hi: 'अत्यन्त अनुकूल काल' }, no: { en: 'Continue checking...', hi: 'आगे जाँचें...' }, yesColor: 'text-emerald-300', noColor: 'text-amber-400' },
            { q: { en: 'Is BAV total >= 30?', hi: 'क्या BAV कुल >= 30 है?' }, yes: { en: 'Favorable — good with some challenges', hi: 'अनुकूल — कुछ चुनौतियों के साथ अच्छा' }, no: { en: 'Continue checking...', hi: 'आगे जाँचें...' }, yesColor: 'text-emerald-400', noColor: 'text-amber-400' },
            { q: { en: 'Is BAV total >= 20?', hi: 'क्या BAV कुल >= 20 है?' }, yes: { en: 'Moderate — mixed results, plan carefully', hi: 'मध्यम — मिश्रित, सावधानी से योजना बनाएँ' }, no: { en: 'Challenging — remedies recommended', hi: 'कठिन — उपचार अनुशंसित' }, yesColor: 'text-amber-400', noColor: 'text-red-400' },
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4"
            >
              <p className="text-gold-light text-sm font-semibold mb-2" style={headingFont}>{l(node.q)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/15">
                  <span className="text-[10px] text-emerald-400/60 uppercase tracking-wider font-bold">
                    {l({ en: 'YES', hi: 'हाँ' })}
                  </span>
                  <p className={`text-xs font-medium mt-0.5 ${node.yesColor}`}>{l(node.yes)}</p>
                </div>
                <div className="p-2 rounded bg-red-500/5 border border-red-500/15">
                  <span className="text-[10px] text-red-400/60 uppercase tracking-wider font-bold">
                    {l({ en: 'NO', hi: 'नहीं' })}
                  </span>
                  <p className={`text-xs font-medium mt-0.5 ${node.noColor}`}>{l(node.no)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Section 8: Classical References ─── */}
      <LessonSection number={8} title={l({ en: 'Classical References', hi: 'शास्त्रीय संदर्भ' })}>
        <div className="space-y-3">
          {CLASSICAL_REFS.map((ref, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl"
            >
              <h4 className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
                {l(ref.text)}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {l(ref.desc)}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Section 9: Related Modules ─── */}
      <LessonSection number={9} title={l({ en: 'Related Learning', hi: 'सम्बन्धित अध्ययन' })}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/ashtakavarga', label: { en: 'Ashtakavarga Fundamentals', hi: 'अष्टकवर्ग मूल तत्त्व' } },
            { href: '/learn/dashas', label: { en: 'Dashas — Planetary Periods', hi: 'दशाएँ — ग्रह अवधि' } },
            { href: '/learn/transit-guide', label: { en: 'Transit Guide (Gochar)', hi: 'गोचर मार्गदर्शिका' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala — Six-Fold Strength', hi: 'षड्बल — छह प्रकार का बल' } },
            { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
            { href: '/transits', label: { en: 'Current Transits', hi: 'वर्तमान गोचर' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {l(mod.label)}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {l({ en: 'See Ashtakavarga Dasha in Your Chart', hi: 'अपनी कुण्डली में अष्टकवर्ग दशा देखें' })} →
        </Link>
      </div>
    </div>
  );
}
