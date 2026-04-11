'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Ashtakavarga — The 8-Fold Transit Scoring System', hi: 'अष्टकवर्ग — आठ-गुणा गोचर अंक प्रणाली', sa: 'अष्टकवर्गः — अष्टगुणगोचराङ्कपद्धतिः' },
  subtitle: { en: 'A numerical system that predicts the strength of planetary transits through every sign', hi: 'एक संख्यात्मक प्रणाली जो प्रत्येक राशि में ग्रह गोचर की शक्ति का पूर्वानुमान करती है', sa: 'संख्यात्मकपद्धतिः या प्रत्येकराशौ ग्रहगोचरस्य बलं पूर्वानुमानयति' },

  whatTitle: { en: 'What is Ashtakavarga?', hi: 'अष्टकवर्ग क्या है?', sa: 'अष्टकवर्गः कः?' },
  whatContent: {
    en: '"Ashta" means eight, "Varga" means division or group. Ashtakavarga is a system where each planet receives benefic points (called Bindus) from eight sources: the seven classical planets (Sun through Saturn) and the Lagna (Ascendant). Each source either contributes a Bindu (1) or does not (0) to each of the 12 signs, creating a comprehensive scoring matrix for every planet.',
    hi: '"अष्ट" का अर्थ आठ, "वर्ग" का अर्थ विभाग। अष्टकवर्ग एक प्रणाली है जिसमें प्रत्येक ग्रह को आठ स्रोतों से शुभ अंक (बिन्दु) प्राप्त होते हैं: सात शास्त्रीय ग्रह (सूर्य से शनि) और लग्न। प्रत्येक स्रोत प्रत्येक 12 राशियों को बिन्दु (1) देता है या नहीं (0), हर ग्रह के लिए एक व्यापक अंक मैट्रिक्स बनाता है।',
    sa: '"अष्ट" इत्यर्थः अष्टौ, "वर्गः" इत्यर्थः विभागः। अष्टकवर्गः पद्धतिः यत्र प्रत्येकग्रहः अष्टस्रोतेभ्यः शुभाङ्कान् (बिन्दून्) प्राप्नोति।'
  },
  whatContent2: {
    en: 'There are two key tables in Ashtakavarga: the Bhinna Ashtakavarga (BAV) which is the individual scoring table for each planet, and the Sarvashtakavarga (SAV) which combines all individual scores into a grand total for each sign. The BAV tells you how a specific planet will perform when transiting a given sign; the SAV tells you the overall strength of a sign across all planetary transits.',
    hi: 'अष्टकवर्ग में दो प्रमुख तालिकाएँ हैं: भिन्न अष्टकवर्ग (BAV) जो प्रत्येक ग्रह की व्यक्तिगत अंक तालिका है, और सर्वाष्टकवर्ग (SAV) जो सभी व्यक्तिगत अंकों को प्रत्येक राशि के लिए कुल योग में संयोजित करता है। BAV बताता है कि कोई विशिष्ट ग्रह किसी राशि में गोचर करते समय कैसा प्रदर्शन करेगा; SAV बताता है कि सभी ग्रह गोचरों में राशि की समग्र शक्ति क्या है।',
    sa: 'अष्टकवर्गे द्वे प्रमुखसारण्यौ स्तः: भिन्नाष्टकवर्गः (BAV) यः प्रत्येकग्रहस्य व्यक्तिगताङ्कसारणी, सर्वाष्टकवर्गश्च (SAV) यः सर्वान् अङ्कान् समाहृत्य प्रत्येकराशेः महायोगं करोति।'
  },
  whatContent3: {
    en: 'Why does Ashtakavarga matter? It answers a critical question that basic transit analysis cannot: two people with the same Moon sign will experience the same Saturn transit very differently. Ashtakavarga explains WHY — the bindu score for Saturn in that sign in their individual charts will differ, making one person\'s transit productive and the other\'s challenging.',
    hi: 'अष्टकवर्ग क्यों महत्वपूर्ण है? यह एक महत्वपूर्ण प्रश्न का उत्तर देता है जो सामान्य गोचर विश्लेषण नहीं दे सकता: एक ही चन्द्र राशि के दो व्यक्ति एक ही शनि गोचर को बहुत भिन्न अनुभव करेंगे। अष्टकवर्ग बताता है क्यों — उनकी व्यक्तिगत कुण्डलियों में उस राशि में शनि का बिन्दु स्कोर भिन्न होगा।',
    sa: 'अष्टकवर्गः किमर्थं महत्त्वपूर्णः? एकस्याः चन्द्रराशेः द्वौ व्यक्तौ एकं शनिगोचरं भिन्नतया अनुभवतः। अष्टकवर्गः कारणं वदति।'
  },

  readTitle: { en: 'How to Read the Ashtakavarga Table', hi: 'अष्टकवर्ग तालिका कैसे पढ़ें', sa: 'अष्टकवर्गसारणीं कथं पठेत्' },
  readContent: {
    en: 'Each planet\'s Bhinna Ashtakavarga (BAV) is a row of 12 numbers — one for each sign (Aries through Pisces). Each number ranges from 0 to 8, representing how many of the 8 sources contribute a benefic point to that sign for that planet.',
    hi: 'प्रत्येक ग्रह का भिन्न अष्टकवर्ग (BAV) 12 संख्याओं की एक पंक्ति है — प्रत्येक राशि (मेष से मीन) के लिए एक। प्रत्येक संख्या 0 से 8 तक होती है, यह दर्शाती है कि 8 स्रोतों में से कितने उस राशि में उस ग्रह को शुभ बिन्दु देते हैं।',
    sa: 'प्रत्येकग्रहस्य भिन्नाष्टकवर्गः 12 सङ्ख्यानां पङ्क्तिः — प्रत्येकराशये एका। प्रत्येका सङ्ख्या 0 तः 8 पर्यन्तम्।'
  },

  thresholdTitle: { en: 'The Rule of Four', hi: 'चार का नियम', sa: 'चतुर्नियमः' },
  thresholdContent: {
    en: 'The critical threshold in Ashtakavarga is 4 bindus. When a planet transits a sign where it has 4 or more bindus in its BAV, the transit tends to give favourable results in that planet\'s significations. Below 4 bindus, the transit is likely to bring challenges, delays, or unfavourable outcomes. The higher the score, the stronger the positive effect; a score of 0-1 can indicate significant difficulties.',
    hi: '4 बिन्दु अष्टकवर्ग की महत्वपूर्ण सीमा है। जब कोई ग्रह उस राशि में गोचर करता है जहाँ BAV में 4 या अधिक बिन्दु हैं, तो गोचर उस ग्रह के संकेतों में अनुकूल परिणाम देता है। 4 से कम बिन्दु पर गोचर कठिनाइयाँ या प्रतिकूल परिणाम ला सकता है।',
    sa: '4 बिन्दवः अष्टकवर्गस्य महत्त्वपूर्णा सीमा। यदा ग्रहः तस्यां राशौ गोचरं करोति यत्र BAV मध्ये 4 वा अधिकाः बिन्दवः सन्ति, तदा गोचरः अनुकूलफलानि ददाति।'
  },
  savTitle: { en: 'Sarvashtakavarga (SAV) — The Grand Total', hi: 'सर्वाष्टकवर्ग (SAV) — महायोग', sa: 'सर्वाष्टकवर्गः (SAV) — महायोगः' },
  savContent: {
    en: 'The SAV row sums all seven planets\' BAV scores for each sign. The total SAV across all 12 signs is always 337 points. The average per sign is about 28. Signs scoring 28 or above in SAV are considered strong — any planet transiting that sign tends to give better-than-average results. Signs below 25 are weak — transits through these signs tend to be more challenging regardless of the specific planet.',
    hi: 'SAV पंक्ति प्रत्येक राशि के लिए सातों ग्रहों के BAV अंकों का योग है। 12 राशियों में कुल SAV सदा 337 अंक होता है। प्रति राशि औसत लगभग 28 है। 28 या अधिक SAV वाली राशियाँ शक्तिशाली हैं; 25 से कम कमज़ोर हैं।',
    sa: 'SAV पङ्क्तिः प्रत्येकराशये सप्तग्रहाणां BAV अङ्कानां योगः। 12 राशिषु सम्पूर्णं SAV सदा 337 अङ्काः। प्रतिराशि औसतं 28। 28 वा अधिकं शक्तिमत्; 25 अधः दुर्बलम्।'
  },

  practicalTitle: { en: 'Practical Use — Transit Scoring with Ashtakavarga', hi: 'व्यावहारिक प्रयोग — अष्टकवर्ग से गोचर अंकन', sa: 'व्यावहारिकप्रयोगः — अष्टकवर्गेण गोचराङ्कनम्' },
  practicalContent: {
    en: 'The real power of Ashtakavarga is in predicting transit quality. Instead of simply saying "Saturn is transiting Capricorn," you can say "Saturn is transiting Capricorn where it has 6 bindus in my chart — this will be a productive, structured transit for me." Here is a worked example:',
    hi: 'अष्टकवर्ग की वास्तविक शक्ति गोचर गुणवत्ता की भविष्यवाणी में है। केवल "शनि मकर में गोचर कर रहा है" कहने के बजाय, आप कह सकते हैं "शनि मकर में गोचर कर रहा है जहाँ मेरी कुण्डली में 6 बिन्दु हैं — यह मेरे लिए उत्पादक गोचर होगा।"',
    sa: 'अष्टकवर्गस्य वास्तविकशक्तिः गोचरगुणवत्तायाः भविष्यवाण्याम्।'
  },

  workedTitle: { en: 'Worked Example', hi: 'कार्यशील उदाहरण', sa: 'कार्यशीलोदाहरणम्' },

  trikonaTitle: { en: 'Trikona Shodhana — Advanced Reduction', hi: 'त्रिकोण शोधन — उन्नत न्यूनीकरण', sa: 'त्रिकोणशोधनम् — उन्नतन्यूनीकरणम्' },
  trikonaContent: {
    en: 'Trikona Shodhana is an advanced technique that reduces the BAV to yield more precise results. The basic principle: signs that share the same lord (Trikona signs) should have their minimum bindu value subtracted from all three. For example, Aries and Scorpio are both ruled by Mars. If Aries has 5 bindus and Scorpio has 3, subtract 3 from both: Aries becomes 2 and Scorpio becomes 0. This refined table is used for precise timing within a transit.',
    hi: 'त्रिकोण शोधन एक उन्नत तकनीक है जो अधिक सटीक परिणामों के लिए BAV को न्यूनीकृत करती है। मूल सिद्धान्त: एक ही स्वामी वाली राशियों (त्रिकोण राशियों) से उनका न्यूनतम बिन्दु मूल्य घटाया जाना चाहिए। उदाहरण: मेष और वृश्चिक दोनों मंगल शासित हैं। यदि मेष में 5 और वृश्चिक में 3 बिन्दु हैं, तो दोनों से 3 घटाएँ: मेष 2 और वृश्चिक 0 हो जाता है।',
    sa: 'त्रिकोणशोधनम् उन्नततन्त्रम् यत् BAV न्यूनीकरोति। मूलसिद्धान्तः: एकस्वामिराशिभ्यः न्यूनतमबिन्दुमूल्यं विशोध्यते।'
  },
  trikonaContent2: {
    en: 'Ekadhipati Shodhana extends this principle specifically to signs sharing the same lord (dual-lordship signs). Mars rules Aries and Scorpio; Jupiter rules Sagittarius and Pisces; Saturn rules Capricorn and Aquarius; Mercury rules Gemini and Virgo; Venus rules Taurus and Libra. For each such pair, the lower value is subtracted from both. This gives a "net strength" that shows where a planet truly delivers its strongest results during transit.',
    hi: 'एकाधिपति शोधन इस सिद्धान्त को विशेष रूप से एक ही स्वामी वाली राशियों (द्वि-स्वामित्व राशियों) पर लागू करता है। मंगल मेष और वृश्चिक शासित करता है; गुरु धनु और मीन; शनि मकर और कुम्भ; बुध मिथुन और कन्या; शुक्र वृषभ और तुला। प्रत्येक ऐसी जोड़ी में निम्न मूल्य दोनों से घटाया जाता है।',
    sa: 'एकाधिपतिशोधनम् एतत् सिद्धान्तं विशेषतः एकस्वामिराशिषु प्रयुज्यते। मङ्गलः मेषवृश्चिकयोः; गुरुः धनुमीनयोः; शनिः मकरकुम्भयोः।'
  },

  kakshyaTitle: { en: 'Kakshya Transits — Fine Timing within a Sign', hi: 'कक्ष्या गोचर — राशि के भीतर सूक्ष्म समय', sa: 'कक्ष्यागोचरः — राशेः अन्तः सूक्ष्मकालनिर्धारणम्' },
  kakshyaContent: {
    en: 'Each sign of 30 degrees is divided into 8 Kakshyas (divisions) of 3 degrees 45 minutes each, ruled by the 8 Ashtakavarga contributors in a fixed order: Saturn (0-3\u00b045\'), Jupiter (3\u00b045\'-7\u00b030\'), Mars (7\u00b030\'-11\u00b015\'), Sun (11\u00b015\'-15\u00b0), Venus (15\u00b0-18\u00b045\'), Mercury (18\u00b045\'-22\u00b030\'), Moon (22\u00b030\'-26\u00b015\'), Lagna (26\u00b015\'-30\u00b0). When a transiting planet passes through the Kakshya of a source that contributed a Bindu, that specific 3-4 day window yields positive results.',
    hi: '30 अंश की प्रत्येक राशि 8 कक्ष्याओं (विभागों) में विभाजित है, प्रत्येक 3 अंश 45 कला की। क्रम: शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र, लग्न। जब गोचरी ग्रह उस कक्ष्या से गुज़रता है जिसके स्रोत ने बिन्दु दिया, वह विशिष्ट 3-4 दिन का काल शुभ होता है।',
    sa: '30 अंशानां प्रत्येका राशिः 8 कक्ष्यासु विभज्यते, प्रत्येका 3 अंश 45 कला। यदा गोचरग्रहः तस्याः कक्ष्यायां गच्छति यस्याः स्रोतः बिन्दुं दत्तवान्, तत् सूक्ष्मकालखण्डं शुभम्।'
  },

  modulesTitle: { en: 'Related Lessons & Tools', hi: 'सम्बन्धित पाठ और उपकरण', sa: 'सम्बद्धपाठसाधनानि' },
  tryIt: { en: 'Generate Your Kundali — View Your Ashtakavarga', hi: 'अपनी कुण्डली बनाएँ — अष्टकवर्ग देखें', sa: 'स्वकुण्डलीं जनयतु — अष्टकवर्गं पश्यतु' },
};

const SIGNS_SHORT = [
  { en: 'Ari', hi: 'मे' }, { en: 'Tau', hi: 'वृ' }, { en: 'Gem', hi: 'मि' },
  { en: 'Can', hi: 'क' }, { en: 'Leo', hi: 'सिं' }, { en: 'Vir', hi: 'कन्' },
  { en: 'Lib', hi: 'तु' }, { en: 'Sco', hi: 'वृश्' }, { en: 'Sag', hi: 'ध' },
  { en: 'Cap', hi: 'म' }, { en: 'Aqu', hi: 'कुं' }, { en: 'Pis', hi: 'मी' },
];

const EXAMPLE_BAV = {
  planet: { en: 'Saturn', hi: 'शनि' },
  color: '#3b82f6',
  scores: [3, 2, 4, 5, 3, 6, 5, 1, 4, 6, 3, 7],
  total: 49,
};

const SAV_EXAMPLE = [30, 24, 29, 32, 26, 35, 31, 22, 28, 33, 27, 20];

const SCORE_MEANINGS = [
  { range: '0-1', en: 'Very difficult transit. Significant obstacles, health concerns, or losses in that planet\'s significations.', hi: 'अत्यन्त कठिन गोचर। उस ग्रह के संकेतों में महत्वपूर्ण बाधाएँ, स्वास्थ्य चिन्ताएँ, या हानि।', sa: 'अत्यन्तकठिनगोचरः। बाधाः, स्वास्थ्यचिन्ताः, हानिश्च।', color: 'text-red-400' },
  { range: '2-3', en: 'Below average. Some challenges; results come with effort and delay. Mixed outcomes.', hi: 'औसत से नीचे। कुछ कठिनाइयाँ; परिणाम प्रयास और देरी से आते हैं।', sa: 'औसतात् न्यूनम्। किञ्चित् कठिनतायाः; फलानि प्रयत्नेन विलम्बेन च।', color: 'text-amber-400' },
  { range: '4', en: 'Neutral/threshold. Average transit, neither strongly positive nor negative.', hi: 'तटस्थ/सीमा। औसत गोचर, न तो प्रबल सकारात्मक न नकारात्मक।', sa: 'तटस्थम्/सीमा। औसतगोचरः।', color: 'text-text-secondary' },
  { range: '5-6', en: 'Good transit. Favourable results, opportunities, smooth progress in that planet\'s areas.', hi: 'अच्छा गोचर। अनुकूल परिणाम, अवसर, उस ग्रह के क्षेत्रों में सुचारू प्रगति।', sa: 'शुभगोचरः। अनुकूलफलानि, अवसराः, सुचारुप्रगतिः।', color: 'text-emerald-400' },
  { range: '7-8', en: 'Excellent transit. Strong positive results, major gains, peak performance in that area.', hi: 'उत्कृष्ट गोचर। प्रबल सकारात्मक परिणाम, प्रमुख लाभ, उस क्षेत्र में शिखर प्रदर्शन।', sa: 'उत्कृष्टगोचरः। प्रबलशुभफलानि, प्रमुखलाभाः।', color: 'text-emerald-300 font-bold' },
];

export default function LearnAshtakavargaPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Ashtakavarga" meaning="Eight-fold division" />
        <SanskritTermCard term="Bindu" devanagari="बिन्दु" transliteration="Bindu" meaning="Point (benefic dot)" />
        <SanskritTermCard term="Bhinna" devanagari="भिन्न" transliteration="Bhinna" meaning="Individual / separate" />
        <SanskritTermCard term="Sarva" devanagari="सर्व" transliteration="Sarva" meaning="Combined / all" />
        <SanskritTermCard term="Shodhana" devanagari="शोधन" transliteration="Shodhana" meaning="Reduction / purification" />
      </div>

      {/* Section 1: What is Ashtakavarga */}
      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p style={bodyFont}>{L.whatContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.whatContent2[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.whatContent3[locale]}</p>

        {/* 8 sources visual */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: { en: 'Sun', hi: 'सूर्य' }, color: '#f59e0b' },
            { name: { en: 'Moon', hi: 'चन्द्र' }, color: '#e2e8f0' },
            { name: { en: 'Mars', hi: 'मंगल' }, color: '#ef4444' },
            { name: { en: 'Mercury', hi: 'बुध' }, color: '#22c55e' },
            { name: { en: 'Jupiter', hi: 'गुरु' }, color: '#f0d48a' },
            { name: { en: 'Venus', hi: 'शुक्र' }, color: '#ec4899' },
            { name: { en: 'Saturn', hi: 'शनि' }, color: '#3b82f6' },
            { name: { en: 'Lagna', hi: 'लग्न' }, color: '#a855f7' },
          ].map((src, i) => (
            <motion.div
              key={src.name.en}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg p-2 border border-gold-primary/10 bg-bg-primary/50 text-center"
            >
              <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: src.color }} />
              <span className="text-xs font-medium" style={{ color: src.color }}>
                {isHi ? src.name.hi : src.name.en}
              </span>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 2: How to Read the Table */}
      <LessonSection number={2} title={L.readTitle[locale]}>
        <p style={bodyFont}>{L.readContent[locale]}</p>

        {/* Example BAV table */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {isHi ? 'उदाहरण: शनि BAV' : 'Example: Saturn BAV'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">{isHi ? 'ग्रह' : 'Planet'}</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">{isHi ? s.hi : s.en}</th>
                ))}
                <th className="text-center py-2 px-1 text-gold-dark">{isHi ? 'योग' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 font-medium" style={{ color: EXAMPLE_BAV.color }}>
                  {isHi ? EXAMPLE_BAV.planet.hi : EXAMPLE_BAV.planet.en}
                </td>
                {EXAMPLE_BAV.scores.map((score, i) => (
                  <td key={i} className={`text-center py-2 px-1 font-mono ${score >= 4 ? 'text-emerald-400' : score <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                    {score}
                  </td>
                ))}
                <td className="text-center py-2 px-1 font-mono text-text-secondary">{EXAMPLE_BAV.total}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs">
            {isHi
              ? 'हरा = 4+ (शुभ) | पीला = 3 (मध्यम) | लाल = 0-2 (कठिन)'
              : 'Green = 4+ (favourable) | Yellow = 3 (mixed) | Red = 0-2 (challenging)'}
          </p>
        </div>

        {/* Score meanings */}
        <div className="mt-4">
          <p className="text-gold-light text-sm font-semibold mb-2" style={headingFont}>
            {isHi ? 'बिन्दु स्कोर अर्थ' : 'Bindu Score Meanings'}
          </p>
          <div className="space-y-2">
            {SCORE_MEANINGS.map((sm) => (
              <div key={sm.range} className="flex gap-3 items-start">
                <div className={`w-12 flex-shrink-0 text-right text-xs font-mono ${sm.color}`}>{sm.range}</div>
                <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                  {locale === 'en' || String(locale) === 'ta' ? sm.en : locale === 'hi' ? sm.hi : sm.sa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* Section 2b: Threshold */}
      <LessonSection number={3} title={L.thresholdTitle[locale]}>
        <p style={bodyFont}>{L.thresholdContent[locale]}</p>

        {/* Visual bar */}
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
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
            <span className="text-red-400">{isHi ? 'कठिन' : 'Challenging'}</span>
            <span className="text-gold-light">{isHi ? 'सीमा = 4' : 'Threshold = 4'}</span>
            <span className="text-emerald-400">{isHi ? 'अनुकूल' : 'Favourable'}</span>
          </div>
        </div>
      </LessonSection>

      {/* Section 4: SAV */}
      <LessonSection number={4} title={L.savTitle[locale]}>
        <p style={bodyFont}>{L.savContent[locale]}</p>

        {/* SAV example */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {isHi ? 'उदाहरण: सर्वाष्टकवर्ग (SAV)' : 'Example: Sarvashtakavarga (SAV)'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">SAV</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">{isHi ? s.hi : s.en}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 font-medium text-gold-light">{isHi ? 'योग' : 'Total'}</td>
                {SAV_EXAMPLE.map((score, i) => (
                  <td key={i} className={`text-center py-2 px-1 font-mono font-bold ${score >= 28 ? 'text-emerald-400' : score <= 24 ? 'text-red-400' : 'text-amber-400'}`}>
                    {score}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs font-mono">
            {isHi ? 'कुल: 337 | औसत प्रति राशि: ~28' : 'Total: 337 | Average per sign: ~28'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Practical worked example */}
      <LessonSection number={5} title={L.practicalTitle[locale]} variant="highlight">
        <p style={bodyFont}>{L.practicalContent[locale]}</p>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3" style={headingFont}>
            {L.workedTitle[locale]}
          </p>
          <div className="space-y-2 text-gold-light/80 font-mono text-xs">
            <p>{isHi ? 'स्थिति: शनि वर्तमान में मकर में गोचर कर रहा है' : 'Situation: Saturn is currently transiting Capricorn'}</p>
            <p>{isHi ? 'आपके BAV में शनि का मकर स्कोर: 6 बिन्दु' : 'Your Saturn BAV score in Capricorn: 6 bindus'}</p>
            <p className="text-emerald-400">{isHi ? 'निष्कर्ष: शनि अपनी स्वराशि मकर में 6 बिन्दु (4+ सीमा से ऊपर) के साथ गोचर कर रहा है।' : 'Analysis: Saturn transiting its own sign Capricorn with 6 bindus (above 4 threshold).'}</p>
            <p className="text-emerald-400">{isHi ? 'यह गोचर करियर में संरचित वृद्धि, अनुशासन से सफलता, और स्थिर प्रगति लाएगा।' : 'This transit will bring structured career growth, disciplined success, and steady progress.'}</p>
            <div className="mt-3 border-t border-gold-primary/10 pt-3">
              <p>{isHi ? 'तुलना: मित्र की कुण्डली में शनि का मकर स्कोर: 2 बिन्दु' : 'Compare: Your friend\'s Saturn BAV score in Capricorn: 2 bindus'}</p>
              <p className="text-red-400">{isHi ? 'उसी शनि-मकर गोचर में, आपके मित्र को कठिनाइयाँ, देरी और बाधाएँ अनुभव होंगी।' : 'During the same Saturn-in-Capricorn transit, your friend will experience obstacles, delays, and pressure.'}</p>
              <p className="text-amber-400 mt-1">{isHi ? 'एक ही गोचर, दो बहुत अलग अनुभव — यह अष्टकवर्ग की शक्ति है।' : 'Same transit, two very different experiences — this is the power of Ashtakavarga.'}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Trikona Shodhana */}
      <LessonSection number={6} title={L.trikonaTitle[locale]}>
        <p style={bodyFont}>{L.trikonaContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.trikonaContent2[locale]}</p>

        {/* Ekadhipati pairs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { lord: { en: 'Mars', hi: 'मंगल' }, pair: { en: 'Aries & Scorpio', hi: 'मेष & वृश्चिक' }, color: '#ef4444' },
            { lord: { en: 'Jupiter', hi: 'गुरु' }, pair: { en: 'Sagittarius & Pisces', hi: 'धनु & मीन' }, color: '#f0d48a' },
            { lord: { en: 'Saturn', hi: 'शनि' }, pair: { en: 'Capricorn & Aquarius', hi: 'मकर & कुम्भ' }, color: '#3b82f6' },
            { lord: { en: 'Mercury', hi: 'बुध' }, pair: { en: 'Gemini & Virgo', hi: 'मिथुन & कन्या' }, color: '#22c55e' },
            { lord: { en: 'Venus', hi: 'शुक्र' }, pair: { en: 'Taurus & Libra', hi: 'वृषभ & तुला' }, color: '#ec4899' },
          ].map((item) => (
            <div key={item.lord.en} className="rounded-lg p-3 border border-gold-primary/10 bg-bg-primary/50">
              <div className="text-sm font-bold mb-1" style={{ color: item.color }}>
                {isHi ? item.lord.hi : item.lord.en}
              </div>
              <div className="text-text-secondary text-xs">{isHi ? item.pair.hi : item.pair.en}</div>
            </div>
          ))}
        </div>

        {/* Worked reduction example */}
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {isHi ? 'शोधन उदाहरण (शनि BAV):' : 'Reduction Example (Saturn BAV):'}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>{isHi ? 'शोधन पूर्व: मेष = 3, वृश्चिक = 1 (मंगल जोड़ी)' : 'Before: Aries = 3, Scorpio = 1 (Mars pair)'}</p>
            <p>{isHi ? 'न्यूनतम = 1, दोनों से घटाएँ' : 'Minimum = 1, subtract from both'}</p>
            <p className="text-emerald-400">{isHi ? 'शोधन पश्चात: मेष = 2, वृश्चिक = 0' : 'After: Aries = 2, Scorpio = 0'}</p>
            <p className="text-text-tertiary mt-1">{isHi ? 'वृश्चिक में शनि गोचर अब निष्प्रभावी प्रतीत होता है।' : 'Saturn transit through Scorpio now appears ineffective.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 7: Kakshya */}
      <LessonSection number={7} title={L.kakshyaTitle[locale]}>
        <p style={bodyFont}>{L.kakshyaContent[locale]}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'कक्ष्या' : 'Kakshya'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'स्वामी' : 'Ruler'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'अंश सीमा' : 'Degree Range'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { n: 1, ruler: { en: 'Saturn', hi: 'शनि' }, range: '0\u00b0 - 3\u00b045\u2032', color: '#3b82f6' },
                { n: 2, ruler: { en: 'Jupiter', hi: 'गुरु' }, range: '3\u00b045\u2032 - 7\u00b030\u2032', color: '#f0d48a' },
                { n: 3, ruler: { en: 'Mars', hi: 'मंगल' }, range: '7\u00b030\u2032 - 11\u00b015\u2032', color: '#ef4444' },
                { n: 4, ruler: { en: 'Sun', hi: 'सूर्य' }, range: '11\u00b015\u2032 - 15\u00b0', color: '#f59e0b' },
                { n: 5, ruler: { en: 'Venus', hi: 'शुक्र' }, range: '15\u00b0 - 18\u00b045\u2032', color: '#ec4899' },
                { n: 6, ruler: { en: 'Mercury', hi: 'बुध' }, range: '18\u00b045\u2032 - 22\u00b030\u2032', color: '#22c55e' },
                { n: 7, ruler: { en: 'Moon', hi: 'चन्द्र' }, range: '22\u00b030\u2032 - 26\u00b015\u2032', color: '#e2e8f0' },
                { n: 8, ruler: { en: 'Lagna', hi: 'लग्न' }, range: '26\u00b015\u2032 - 30\u00b0', color: '#a855f7' },
              ].map((k) => (
                <tr key={k.n} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-mono text-text-secondary">{k.n}</td>
                  <td className="py-2 px-2 font-medium" style={{ color: k.color }}>
                    {isHi ? k.ruler.hi : k.ruler.en}
                  </td>
                  <td className="py-2 px-2 text-text-secondary font-mono">{k.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 8: Related modules */}
      <LessonSection number={8} title={L.modulesTitle[locale]}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/18-3', label: { en: 'Lesson 18-3: Ashtakavarga Applications', hi: 'पाठ 18-3: अष्टकवर्ग अनुप्रयोग', sa: 'पाठः 18-3: अष्टकवर्गानुप्रयोगाः' } },
            { href: '/learn/modules/12-1', label: { en: 'Lesson 12-1: Transit Analysis', hi: 'पाठ 12-1: गोचर विश्लेषण', sa: 'पाठः 12-1: गोचरविश्लेषणम्' } },
            { href: '/learn/gochar', label: { en: 'Reference: Gochar (Transits)', hi: 'सन्दर्भ: गोचर', sa: 'सन्दर्भः: गोचरः' } },
            { href: '/kundali', label: { en: 'Tool: Generate Kundali', hi: 'उपकरण: कुण्डली बनाएँ', sa: 'साधनम्: कुण्डलीजननम्' } },
            { href: '/transits', label: { en: 'Tool: Current Transits', hi: 'उपकरण: वर्तमान गोचर', sa: 'साधनम्: वर्तमानगोचरः' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {mod.label[locale]}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]} →
        </Link>
      </div>
    </div>
  );
}
