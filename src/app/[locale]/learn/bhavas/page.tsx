'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import HouseHighlightChart from '@/components/learn/HouseHighlightChart';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Bhavas — The 12 Houses of Life', hi: 'भाव — जीवन के 12 क्षेत्र', sa: 'भावाः — जीवनस्य द्वादशक्षेत्राणि' },
  subtitle: { en: 'How the sky is divided into 12 areas of human experience', hi: 'आकाश को मानवीय अनुभव के 12 क्षेत्रों में कैसे बाँटा जाता है', sa: 'आकाशं मानवानुभवस्य द्वादशक्षेत्रेषु कथं विभज्यते' },
  whatTitle: { en: 'What is a Bhava?', hi: 'भाव क्या है?', sa: 'भावः कः?' },
  whatContent: {
    en: 'A Bhava (house) is one of 12 divisions of the sky as seen from a specific location at a specific time. While Rashis divide the ecliptic by the stars (sidereal), Bhavas divide it relative to the horizon at the moment of birth. The 1st house (Lagna) is the sign rising on the eastern horizon — this is why your exact birth time and location matter so much in Jyotish.',
    hi: 'भाव आकाश के 12 विभागों में से एक है जो किसी विशेष स्थान से विशेष समय पर दिखाई देता है। जहाँ राशियाँ सिद्धान्तिक रूप से ज्योतिषीय पथ को विभाजित करती हैं, भाव जन्म के क्षण क्षितिज के सापेक्ष उसे विभाजित करते हैं। प्रथम भाव (लग्न) पूर्वी क्षितिज पर उदित होने वाली राशि है।',
    sa: 'भावः आकाशस्य द्वादशविभागेषु अन्यतमः यः विशिष्टस्थानात् विशिष्टसमये दृश्यते। लग्नं पूर्वक्षितिजे उदयमानराशिः।'
  },
  howTitle: { en: 'How Houses Are Calculated', hi: 'भाव कैसे निर्धारित होते हैं', sa: 'भावाः कथं निर्धार्यन्ते' },
  howContent: {
    en: 'In Vedic astrology, the most common system is the Whole-Sign house system: whichever Rashi the Lagna (ascendant) falls in becomes the entire 1st house. The next Rashi becomes the 2nd house, and so on. This differs from Western astrology\'s Placidus system where houses can span unequal arcs. Our KP System tool uses the Placidus system for sub-lord calculations.',
    hi: 'वैदिक ज्योतिष में सबसे सामान्य पद्धति पूर्ण-राशि भाव पद्धति है: जिस राशि में लग्न पड़ता है वह सम्पूर्ण प्रथम भाव बन जाता है। अगली राशि द्वितीय भाव बनती है, इत्यादि। हमारा KP प्रणाली उपकरण प्लेसिडस पद्धति का उपयोग करता है।',
    sa: 'वैदिकज्योतिषे प्रचलिता पद्धतिः पूर्णराशिभावपद्धतिः — यस्यां राशौ लग्नं पतति सा सकला प्रथमभावः भवति।'
  },
  lagnaTitle: { en: 'The Lagna (Ascendant)', hi: 'लग्न (उदय राशि)', sa: 'लग्नम् (उदयराशिः)' },
  lagnaContent: {
    en: 'The Lagna is the most important point in a Kundali. It represents you — your body, personality, and approach to life. The Lagna changes approximately every 2 hours as the Earth rotates, which is why birth time accuracy is critical. A difference of just 4 minutes can shift the Lagna to a different Navamsha (D9 division).',
    hi: 'लग्न कुण्डली का सबसे महत्वपूर्ण बिन्दु है। यह आपका प्रतिनिधित्व करता है — आपका शरीर, व्यक्तित्व, और जीवन दृष्टिकोण। पृथ्वी के घूमने के साथ लग्न लगभग हर 2 घण्टे में बदलता है।',
    sa: 'लग्नं कुण्डल्यां सर्वाधिकमहत्त्वपूर्णं बिन्दुम्। तत् त्वां प्रतिनिधयति — शरीरं, व्यक्तित्वं, जीवनदृष्टिम् च।'
  },
  classTitle: { en: 'House Classifications', hi: 'भावों का वर्गीकरण', sa: 'भावानां वर्गीकरणम्' },
  kendraTitle: { en: 'Kendra (Angular): 1, 4, 7, 10', hi: 'केन्द्र: 1, 4, 7, 10', sa: 'केन्द्रम्: 1, 4, 7, 10' },
  kendraDesc: { en: 'Pillars of the chart. Planets here are strongest and most influential. These represent self (1st), home (4th), partnership (7th), and career (10th).', hi: 'कुण्डली के स्तम्भ। यहाँ ग्रह सबसे शक्तिशाली होते हैं। ये स्व (1), गृह (4), साझेदारी (7), और कर्म (10) का प्रतिनिधित्व करते हैं।', sa: 'कुण्डल्याः स्तम्भाः। अत्र ग्रहाः बलिष्ठतमाः।' },
  trikonaTitle: { en: 'Trikona (Trine): 1, 5, 9', hi: 'त्रिकोण: 1, 5, 9', sa: 'त्रिकोणम्: 1, 5, 9' },
  trikonaDesc: { en: 'Most auspicious houses. The 5th (Purva Punya — past-life merit) and 9th (Bhagya — fortune) bring blessings. A planet ruling both a Kendra and Trikona becomes a Yoga Karaka — the best planet in the chart.', hi: 'सबसे शुभ भाव। 5वाँ (पूर्व पुण्य) और 9वाँ (भाग्य) शुभफल देते हैं। केन्द्र और त्रिकोण दोनों का स्वामी योगकारक बनता है।', sa: 'शुभतमभावाः। पञ्चमः (पूर्वपुण्यम्) नवमः (भाग्यम्) च शुभफलं ददति।' },
  dusthanaTitle: { en: 'Dusthana (Malefic): 6, 8, 12', hi: 'दुःस्थान: 6, 8, 12', sa: 'दुःस्थानम्: 6, 8, 12' },
  dusthanaDesc: { en: 'Challenging houses representing enemies and disease (6th), transformation and death (8th), and losses and liberation (12th). Malefic planets here can give strength through adversity. The 8th house also governs longevity and occult knowledge.', hi: 'कठिन भाव — शत्रु और रोग (6), परिवर्तन और मृत्यु (8), हानि और मोक्ष (12)। पाप ग्रह यहाँ विपत्ति से शक्ति दे सकते हैं।', sa: 'कठिनभावाः — शत्रुरोगौ (6), परिवर्तनमृत्यू (8), हानिमोक्षौ (12) च।' },
  upachayaTitle: { en: 'Upachaya (Growth): 3, 6, 10, 11', hi: 'उपचय: 3, 6, 10, 11', sa: 'उपचयम्: 3, 6, 10, 11' },
  upachayaDesc: { en: 'Houses that improve over time. Malefic planets (Mars, Saturn, Rahu) actually thrive in Upachaya houses, getting stronger as you age. Natural malefics in the 3rd give courage; in the 6th, power over enemies; in the 10th, career success.', hi: 'समय के साथ सुधरने वाले भाव। पाप ग्रह (मंगल, शनि, राहु) उपचय भावों में वास्तव में फलते-फूलते हैं।', sa: 'कालेन सुधरन्ति एते भावाः। पापग्रहाः उपचयभावेषु वस्तुतः वर्धन्ते।' },
  housesTitle: { en: 'All 12 Houses — Detailed', hi: 'सम्पूर्ण 12 भाव — विस्तृत', sa: 'सम्पूर्णाः 12 भावाः — विस्तृतम्' },
  tryIt: { en: 'Generate Your Kundali to See Your Houses →', hi: 'अपने भाव देखने के लिए कुण्डली बनाएँ →', sa: 'स्वभावान् द्रष्टुं कुण्डलीं रचयतु →' },
};

const CLASSIFICATIONS = [
  { title: L.kendraTitle, desc: L.kendraDesc, houses: [1, 4, 7, 10], color: '#d4a853', textColor: 'text-gold-primary', border: 'border-gold-primary/20 bg-gold-primary/5' },
  { title: L.trikonaTitle, desc: L.trikonaDesc, houses: [1, 5, 9], color: '#34d399', textColor: 'text-emerald-400', border: 'border-emerald-400/20 bg-emerald-400/5' },
  { title: L.dusthanaTitle, desc: L.dusthanaDesc, houses: [6, 8, 12], color: '#f87171', textColor: 'text-red-400', border: 'border-red-400/20 bg-red-400/5' },
  { title: L.upachayaTitle, desc: L.upachayaDesc, houses: [3, 6, 10, 11], color: '#fbbf24', textColor: 'text-amber-400', border: 'border-amber-400/20 bg-amber-400/5' },
];

const HOUSES = [
  { num: 1, sa: 'तनु', name: { en: 'Tanu Bhava', hi: 'तनु भाव', sa: 'तनुभावः' }, significations: { en: 'Self, body, appearance, personality, health, head, beginnings', hi: 'स्व, शरीर, रूप, व्यक्तित्व, स्वास्थ्य, सिर, आरम्भ', sa: 'आत्मा, शरीरं, रूपं, व्यक्तित्वं, आरम्भः' }, bodyPart: { en: 'Head', hi: 'सिर', sa: 'शिरः' }, classification: 'Kendra, Trikona' },
  { num: 2, sa: 'धन', name: { en: 'Dhana Bhava', hi: 'धन भाव', sa: 'धनभावः' }, significations: { en: 'Wealth, family, speech, food, face, right eye, values', hi: 'धन, परिवार, वाणी, भोजन, मुख, दायाँ नेत्र, मूल्य', sa: 'धनं, कुटुम्बं, वाक्, आहारः, मुखम्' }, bodyPart: { en: 'Face, mouth', hi: 'मुख', sa: 'मुखम्' }, classification: 'Maraka' },
  { num: 3, sa: 'सहज', name: { en: 'Sahaja Bhava', hi: 'सहज भाव', sa: 'सहजभावः' }, significations: { en: 'Courage, siblings, communication, short travel, hands, hobbies', hi: 'साहस, भाई-बहन, संवाद, छोटी यात्रा, हाथ, शौक', sa: 'शौर्यं, भ्रातरः, संवादः, लघुयात्रा' }, bodyPart: { en: 'Arms, shoulders', hi: 'भुजाएँ, कन्धे', sa: 'भुजौ, स्कन्धौ' }, classification: 'Upachaya' },
  { num: 4, sa: 'सुख', name: { en: 'Sukha Bhava', hi: 'सुख भाव', sa: 'सुखभावः' }, significations: { en: 'Home, mother, happiness, vehicles, land, education, chest', hi: 'गृह, माता, सुख, वाहन, भूमि, शिक्षा, छाती', sa: 'गृहं, माता, सुखं, वाहनं, भूमिः' }, bodyPart: { en: 'Chest, heart', hi: 'छाती, हृदय', sa: 'उरः, हृदयम्' }, classification: 'Kendra' },
  { num: 5, sa: 'पुत्र', name: { en: 'Putra Bhava', hi: 'पुत्र भाव', sa: 'पुत्रभावः' }, significations: { en: 'Children, intelligence, creativity, romance, past-life merit, mantras', hi: 'सन्तान, बुद्धि, सृजनशीलता, प्रेम, पूर्व पुण्य, मन्त्र', sa: 'सन्तानः, बुद्धिः, सृजनशीलता, पूर्वपुण्यम्' }, bodyPart: { en: 'Stomach', hi: 'उदर', sa: 'उदरम्' }, classification: 'Trikona' },
  { num: 6, sa: 'रिपु', name: { en: 'Ripu Bhava', hi: 'रिपु भाव', sa: 'रिपुभावः' }, significations: { en: 'Enemies, disease, debts, service, competition, maternal uncle', hi: 'शत्रु, रोग, ऋण, सेवा, प्रतिस्पर्धा, मामा', sa: 'शत्रवः, रोगः, ऋणं, सेवा, प्रतिस्पर्धा' }, bodyPart: { en: 'Waist, intestines', hi: 'कमर, आँतें', sa: 'कटिः, आन्त्राणि' }, classification: 'Dusthana, Upachaya' },
  { num: 7, sa: 'कलत्र', name: { en: 'Kalatra Bhava', hi: 'कलत्र भाव', sa: 'कलत्रभावः' }, significations: { en: 'Marriage, spouse, partnerships, business, public dealings, desire', hi: 'विवाह, जीवनसाथी, साझेदारी, व्यापार, जनसम्पर्क', sa: 'विवाहः, पत्नी, साझेदारी, व्यापारः' }, bodyPart: { en: 'Lower abdomen', hi: 'अधो-उदर', sa: 'अधोदरम्' }, classification: 'Kendra, Maraka' },
  { num: 8, sa: 'आयुः', name: { en: 'Ayur Bhava', hi: 'आयुर् भाव', sa: 'आयुर्भावः' }, significations: { en: 'Longevity, transformation, death, inheritance, occult, research, chronic illness', hi: 'आयु, परिवर्तन, मृत्यु, विरासत, गूढ़ विद्या, शोध', sa: 'आयुः, परिवर्तनं, मृत्युः, दायः, गूढविद्या' }, bodyPart: { en: 'Reproductive organs', hi: 'प्रजनन अंग', sa: 'प्रजननाङ्गानि' }, classification: 'Dusthana' },
  { num: 9, sa: 'धर्म', name: { en: 'Dharma Bhava', hi: 'धर्म भाव', sa: 'धर्मभावः' }, significations: { en: 'Fortune, dharma, father, guru, pilgrimage, higher learning, law', hi: 'भाग्य, धर्म, पिता, गुरु, तीर्थ, उच्च शिक्षा, कानून', sa: 'भाग्यं, धर्मः, पिता, गुरुः, तीर्थयात्रा' }, bodyPart: { en: 'Thighs', hi: 'जाँघें', sa: 'ऊरू' }, classification: 'Trikona' },
  { num: 10, sa: 'कर्म', name: { en: 'Karma Bhava', hi: 'कर्म भाव', sa: 'कर्मभावः' }, significations: { en: 'Career, status, authority, government, fame, father\'s profession, knees', hi: 'व्यवसाय, प्रतिष्ठा, अधिकार, सरकार, यश, पिता का व्यवसाय', sa: 'व्यवसायः, प्रतिष्ठा, अधिकारः, शासनं, यशः' }, bodyPart: { en: 'Knees', hi: 'घुटने', sa: 'जानुनी' }, classification: 'Kendra, Upachaya' },
  { num: 11, sa: 'लाभ', name: { en: 'Labha Bhava', hi: 'लाभ भाव', sa: 'लाभभावः' }, significations: { en: 'Gains, income, aspirations, elder siblings, social networks, fulfilment', hi: 'लाभ, आय, आकांक्षा, बड़े भाई-बहन, सामाजिक सम्बन्ध', sa: 'लाभः, आयः, आकाङ्क्षा, ज्येष्ठभ्रातरः' }, bodyPart: { en: 'Calves, ankles', hi: 'पिण्डली, टखने', sa: 'जङ्घा, गुल्फौ' }, classification: 'Upachaya' },
  { num: 12, sa: 'व्यय', name: { en: 'Vyaya Bhava', hi: 'व्यय भाव', sa: 'व्ययभावः' }, significations: { en: 'Losses, moksha, foreign lands, expenses, sleep, isolation, meditation, feet', hi: 'हानि, मोक्ष, विदेश, खर्च, निद्रा, एकान्त, ध्यान, पैर', sa: 'हानिः, मोक्षः, विदेशः, व्ययः, निद्रा, ध्यानम्' }, bodyPart: { en: 'Feet', hi: 'पैर', sa: 'पादौ' }, classification: 'Dusthana' },
];

const CLASSIFICATION_COLORS: Record<string, string> = {
  'Kendra': '#d4a853',
  'Trikona': '#34d399',
  'Dusthana': '#f87171',
  'Upachaya': '#fbbf24',
  'Maraka': '#c084fc',
};

function getClassBadges(classification: string) {
  return classification.split(', ').map((cls) => ({
    label: cls,
    color: CLASSIFICATION_COLORS[cls] || '#d4a853',
  }));
}

export default function LearnBhavasPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Bhava" devanagari="भाव" transliteration="Bhāva" meaning="House / State of being" />
        <SanskritTermCard term="Lagna" devanagari="लग्न" transliteration="Lagna" meaning="Ascendant (1st House cusp)" />
        <SanskritTermCard term="Kendra" devanagari="केन्द्र" transliteration="Kendra" meaning="Angular houses (1,4,7,10)" />
        <SanskritTermCard term="Trikona" devanagari="त्रिकोण" transliteration="Trikoṇa" meaning="Trine houses (1,5,9)" />
      </div>

      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p>{L.whatContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Lagna = Rising sign at birth = 1st House</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Lagna shifts ~1 Rashi every 2 hours as Earth rotates</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">12 Rashis × 2 hours = 24 hours = full rotation</p>
        </div>
      </LessonSection>

      <LessonSection number={2} title={L.howTitle[locale]}>
        <p>{L.howContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Whole-Sign System (Vedic standard):</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">If Lagna is in Mesha (Aries) → 1st house = all of Mesha (0°-30°)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">2nd house = all of Vrishabha (Taurus) 30°-60°</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">...and so on for all 12 houses</p>
          <p className="text-gold-light font-mono text-sm mt-3">Placidus System (KP method):</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Houses = unequal arcs based on time-based trisection</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">House cusps calculated from LST and geographic latitude</p>
        </div>
      </LessonSection>

      <LessonSection number={3} title={L.lagnaTitle[locale]}>
        <p>{L.lagnaContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">LST (Local Sidereal Time) = GST + Longitude/15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Lagna longitude = atan(sin(LST) / (cos(LST) × cos(ε) - tan(φ) × sin(ε)))</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">where ε = obliquity (~23.44°), φ = geographic latitude</p>
        </div>
      </LessonSection>

      {/* Section 4: Classifications with charts */}
      <LessonSection number={4} title={L.classTitle[locale]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CLASSIFICATIONS.map((item) => (
            <motion.div
              key={item.title[locale]}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${item.border} flex flex-col items-center`}
            >
              <HouseHighlightChart
                highlightHouses={item.houses}
                highlightColor={item.color}
                size={200}
                showAllNumbers
              />
              <div className="mt-4 text-center">
                <h4 className={`font-bold text-lg ${item.textColor} mb-2`}>{item.title[locale]}</h4>
                <p className="text-text-secondary text-sm">{item.desc[locale]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: All 12 Houses with individual diagrams */}
      <LessonSection number={5} title={L.housesTitle[locale]} variant="highlight">
        <div className="space-y-8">
          {HOUSES.map((h, i) => {
            const badges = getClassBadges(h.classification);
            const primaryColor = badges[0]?.color || '#d4a853';

            return (
              <motion.div
                key={h.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 border border-gold-primary/10"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Chart */}
                  <div className="flex-shrink-0">
                    <HouseHighlightChart
                      highlightHouses={[h.num]}
                      highlightColor={primaryColor}
                      size={160}
                      showAllNumbers
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                      <span
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}20`, border: `2px solid ${primaryColor}50`, color: primaryColor }}
                      >
                        {h.num}
                      </span>
                      <div>
                        <div className="text-gold-light font-bold text-lg">{h.name[locale]}</div>
                        <div className="text-gold-primary/60 text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{h.sa}</div>
                      </div>
                    </div>

                    {/* Classification badges */}
                    <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                      {badges.map((b) => (
                        <span
                          key={b.label}
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${b.color}18`, color: b.color, border: `1px solid ${b.color}40` }}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>

                    <p className="text-text-secondary text-sm mb-2">{h.significations[locale]}</p>
                    <p className="text-text-secondary/60 text-xs">
                      {locale === 'en' ? 'Body part:' : locale === 'hi' ? 'शरीर का अंग:' : 'शरीरावयवः:'}{' '}
                      <span className="text-gold-light/70">{h.bodyPart[locale]}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}
