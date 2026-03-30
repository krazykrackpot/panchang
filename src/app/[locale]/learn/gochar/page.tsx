'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Gochar — Transits & Predictions', hi: 'गोचर — ग्रह गति और भविष्यवाणी', sa: 'गोचरः — ग्रहगतिः भविष्यवाणी च' },
  subtitle: { en: 'How current planetary movements trigger events in your life', hi: 'कैसे वर्तमान ग्रह गति आपके जीवन में घटनाएँ प्रेरित करती है', sa: 'कथं वर्तमानग्रहगतिः जीवने घटनाः प्रेरयति' },
  whatTitle: { en: 'What is Gochar?', hi: 'गोचर क्या है?', sa: 'गोचरः कः?' },
  whatContent: {
    en: 'Gochar (transit) is the study of current planetary positions as they move through the zodiac, measured relative to your birth Moon sign (Janma Rashi). While Dashas reveal WHICH planet activates when, Gochar shows the CURRENT cosmic weather — the ongoing movements that colour daily and monthly experiences. Jyotish uses both systems together for accurate predictions.',
    hi: 'गोचर वर्तमान ग्रह स्थितियों का अध्ययन है जब वे राशिचक्र में गति करते हैं, जो आपकी जन्म चन्द्र राशि (जन्म राशि) के सापेक्ष मापा जाता है। जहाँ दशा बताती है कौन सा ग्रह कब सक्रिय होता है, गोचर वर्तमान ब्रह्माण्डीय मौसम दिखाता है।',
    sa: 'गोचरः वर्तमानग्रहस्थितीनां अध्ययनम् यदा ते राशिचक्रे गच्छन्ति, जन्मचन्द्रराशेः सापेक्षं मीयते।'
  },
  moonTitle: { en: 'Why the Moon Sign Matters', hi: 'चन्द्र राशि क्यों महत्वपूर्ण है', sa: 'चन्द्रराशिः किमर्थं महत्त्वपूर्णा' },
  moonContent: {
    en: 'In Vedic astrology, transits are primarily judged from the Moon sign (Chandra Rashi), not the Sun sign used in Western astrology. The Moon represents the mind, emotions, and daily experiences. When Saturn transits your Moon sign, you feel it emotionally and practically. Our Panchang page shows all current planetary positions so you can track transits against your birth chart.',
    hi: 'वैदिक ज्योतिष में गोचर मुख्य रूप से चन्द्र राशि से आँका जाता है, न कि पश्चिमी ज्योतिष में प्रयुक्त सूर्य राशि से। चन्द्र मन, भावनाओं और दैनिक अनुभवों का प्रतिनिधित्व करता है।',
    sa: 'वैदिकज्योतिषे गोचरः प्रधानतः चन्द्रराशेः आकल्यते, न सूर्यराशेः।'
  },
  saturnTitle: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का 7.5 वर्ष का गोचर', sa: 'साढेसाती — शनेः सार्धसप्तवर्षगोचरः' },
  saturnContent: {
    en: 'Sade Sati is perhaps the most discussed transit in Jyotish. It occurs when Saturn (which takes ~29.5 years to orbit) transits through the 12th, 1st, and 2nd houses from your Moon sign — approximately 7.5 years (2.5 years in each sign). It brings transformation through challenges: restructuring career, relationships, and self-identity. Not always negative — for well-placed Saturn in birth charts, it can bring discipline and achievement.',
    hi: 'साढ़े साती ज्योतिष में सबसे अधिक चर्चित गोचर है। यह तब होती है जब शनि (जो कक्षा में ~29.5 वर्ष लेता है) आपकी चन्द्र राशि से 12वें, 1ले और 2रे भाव से गोचर करता है — लगभग 7.5 वर्ष। यह चुनौतियों के माध्यम से परिवर्तन लाता है।',
    sa: 'साढेसाती ज्योतिषे सर्वाधिकचर्चितगोचरः। शनिः चन्द्रराशेः 12, 1, 2 भावेभ्यः गोचरं करोति — लगभगं 7.5 वर्षाणि।'
  },
  jupiterTitle: { en: 'Jupiter Transit — The Great Benefic', hi: 'गुरु गोचर — महान शुभ ग्रह', sa: 'गुरुगोचरः — महाशुभग्रहः' },
  jupiterContent: {
    en: 'Jupiter (Guru) takes ~12 years for one full orbit, spending about 1 year in each sign. Jupiter transiting the 2nd, 5th, 7th, 9th, and 11th houses from Moon is considered highly auspicious. The 5th and 9th (trikona) transits are especially powerful — bringing wisdom, fortune, children, and spiritual growth. Jupiter in the 8th from Moon can bring sudden unexpected events.',
    hi: 'गुरु एक पूर्ण कक्षा में ~12 वर्ष लेता है, प्रत्येक राशि में लगभग 1 वर्ष रहता है। चन्द्र से 2, 5, 7, 9 और 11वें भाव में गुरु का गोचर अत्यन्त शुभ माना जाता है।',
    sa: 'गुरुः पूर्णकक्षायां ~12 वर्षाणि गृह्णाति। चन्द्रात् 2, 5, 7, 9, 11 भावेषु गुरोः गोचरः अत्यन्तशुभः।'
  },
  rahuKetuTitle: { en: 'Rahu-Ketu Axis Transit', hi: 'राहु-केतु अक्ष गोचर', sa: 'राहुकेत्वक्षगोचरः' },
  rahuKetuContent: {
    en: 'Rahu and Ketu (the lunar nodes) always transit in opposite signs, moving retrograde through the zodiac in ~18 years. Rahu over your Moon brings obsessive desires and material ambition; Ketu over your Moon brings detachment and spiritual inclination. The Rahu-Ketu axis transiting the 1st-7th house axis can significantly reshape identity and relationships.',
    hi: 'राहु और केतु सदा विपरीत राशियों में गोचर करते हैं, ~18 वर्षों में वक्री गति से राशिचक्र में चलते हैं। चन्द्र पर राहु आसक्ति और भौतिक महत्वाकांक्षा लाता है; चन्द्र पर केतु वैराग्य और आध्यात्मिक प्रवृत्ति लाता है।',
    sa: 'राहुकेतू सदा विपरीतराशिषु गोचरतः, ~18 वर्षेषु वक्रगत्या राशिचक्रे चलतः।'
  },
  speedTitle: { en: 'Transit Speeds & Effects', hi: 'गोचर गति और प्रभाव', sa: 'गोचरगतिः प्रभावाः च' },
  balamTitle: { en: 'Chandra Balam & Tara Balam', hi: 'चन्द्र बलम और तारा बलम', sa: 'चन्द्रबलं ताराबलं च' },
  balamContent: {
    en: 'Two important transit indicators our software calculates: Chandra Balam checks if the Moon\'s current transit position (counted from your birth Moon) is in a favourable house (3, 6, 7, 10, 11 from birth Moon are good). Tara Balam divides the 27 nakshatras into 9 groups of 3, each with different qualities. Together, these determine daily auspiciousness for muhurta selection.',
    hi: 'हमारा सॉफ़्टवेयर दो महत्वपूर्ण गोचर सूचक गणना करता है: चन्द्र बलम जाँचता है कि चन्द्र की वर्तमान गोचर स्थिति शुभ भाव में है या नहीं। तारा बलम 27 नक्षत्रों को 9 समूहों में विभाजित करता है।',
    sa: 'अस्माकं सॉफ़्टवेयरं द्वौ महत्त्वपूर्णगोचरसूचकौ गणयति।'
  },
  tryIt: { en: 'View Current Transits →', hi: 'वर्तमान गोचर देखें →', sa: 'वर्तमानगोचरं पश्यतु →' },
};

const TRANSIT_SPEEDS = [
  { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, speed: '~2.25 days/sign', effect: { en: 'Daily mood, short-term events', hi: 'दैनिक मनोदशा, अल्पकालिक घटनाएँ', sa: 'दैनिकमनोदशा, अल्पकालिकघटनाः' }, color: '#e2e8f0' },
  { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, speed: '~1 month/sign', effect: { en: 'Monthly themes, seasonal patterns', hi: 'मासिक विषय, मौसमी स्वरूप', sa: 'मासिकविषयाः, ऋतुस्वरूपाणि' }, color: '#f59e0b' },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, speed: '~1 month/sign', effect: { en: 'Communication, trade, learning', hi: 'संवाद, व्यापार, अध्ययन', sa: 'संवादः, व्यापारः, अध्ययनम्' }, color: '#22c55e' },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, speed: '~1 month/sign', effect: { en: 'Relationships, luxury, art', hi: 'सम्बन्ध, विलासिता, कला', sa: 'सम्बन्धाः, विलासिता, कला' }, color: '#ec4899' },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, speed: '~1.5 months/sign', effect: { en: 'Energy, conflict, property', hi: 'ऊर्जा, संघर्ष, सम्पत्ति', sa: 'ऊर्जा, संघर्षः, सम्पत्तिः' }, color: '#ef4444' },
  { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, speed: '~1 year/sign', effect: { en: 'Growth, wisdom, fortune — major life themes', hi: 'विकास, ज्ञान, भाग्य — प्रमुख जीवन विषय', sa: 'विकासः, ज्ञानं, भाग्यम्' }, color: '#f0d48a' },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, speed: '~2.5 years/sign', effect: { en: 'Karma, structure, discipline — long-term transformation', hi: 'कर्म, संरचना, अनुशासन — दीर्घकालिक परिवर्तन', sa: 'कर्म, संरचना, अनुशासनम्' }, color: '#3b82f6' },
  { planet: { en: 'Rahu/Ketu', hi: 'राहु/केतु', sa: 'राहुः/केतुः' }, speed: '~1.5 years/sign', effect: { en: 'Obsessions, past-life patterns, karmic shifts', hi: 'आसक्ति, पूर्वजन्म स्वरूप, कार्मिक परिवर्तन', sa: 'आसक्तिः, पूर्वजन्मस्वरूपाणि' }, color: '#6366f1' },
];

export default function LearnGocharPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Gochar" devanagari="गोचर" transliteration="Gocara" meaning="Transit / Planetary movement" />
        <SanskritTermCard term="Janma Rashi" devanagari="जन्म राशि" transliteration="Janma Rāśi" meaning="Birth Moon sign" />
        <SanskritTermCard term="Sade Sati" devanagari="साढ़ेसाती" transliteration="Sāḍhesātī" meaning="Saturn's 7.5 year transit" />
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Aṣṭakavarga" meaning="8-fold transit strength" />
      </div>

      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p>{L.whatContent[locale]}</p>
      </LessonSection>

      <LessonSection number={2} title={L.moonTitle[locale]}>
        <p>{L.moonContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {locale === 'en' ? 'Transit house = Current planet sign - Birth Moon sign + 1' : 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Example: If birth Moon is Taurus (2) and Saturn is currently in Cancer (4) → Saturn transit in 3rd house from Moon'
              : 'उदाहरण: यदि जन्म चन्द्र वृषभ (2) में है और शनि वर्तमान में कर्क (4) में → चन्द्र से 3रे भाव में शनि गोचर'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={3} title={L.speedTitle[locale]}>
        <div className="space-y-2">
          {TRANSIT_SPEEDS.map((ts, i) => (
            <motion.div
              key={ts.planet.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 glass-card rounded-lg p-3 border border-gold-primary/5"
            >
              <div className="w-16 text-right text-sm font-semibold flex-shrink-0" style={{ color: ts.color }}>
                {ts.planet[locale]}
              </div>
              <div className="w-40 text-text-secondary text-xs font-mono flex-shrink-0">{ts.speed}</div>
              <div className="text-text-secondary/70 text-xs">{ts.effect[locale]}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-text-secondary/60 text-sm italic">
          {locale === 'en'
            ? 'Slower planets (Jupiter, Saturn, Rahu/Ketu) have the most profound and lasting effects since they influence a house for months or years.'
            : 'धीमे ग्रह (गुरु, शनि, राहु/केतु) सबसे गहरे और स्थायी प्रभाव डालते हैं क्योंकि वे महीनों या वर्षों तक एक भाव को प्रभावित करते हैं।'}
        </p>
      </LessonSection>

      <LessonSection number={4} title={L.saturnTitle[locale]}>
        <p>{L.saturnContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-blue-400/20">
          <p className="text-blue-300 font-mono text-sm mb-2">
            {locale === 'en' ? 'Three Phases of Sade Sati:' : 'साढ़े साती के तीन चरण:'}
          </p>
          <div className="space-y-1">
            <p className="text-blue-200/80 font-mono text-xs">
              {locale === 'en' ? '1st Phase (12th from Moon): Mental stress, financial pressure' : 'प्रथम चरण (चन्द्र से 12वाँ): मानसिक तनाव, आर्थिक दबाव'}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {locale === 'en' ? '2nd Phase (1st from Moon): Peak intensity — identity transformation' : 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन'}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {locale === 'en' ? '3rd Phase (2nd from Moon): Financial restructuring, speech issues' : 'तृतीय चरण (चन्द्र से 2रा): आर्थिक पुनर्गठन, वाणी सम्बन्धी'}
            </p>
          </div>
          <p className="text-blue-200/50 font-mono text-xs mt-2">
            {locale === 'en' ? 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life' : 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={5} title={L.jupiterTitle[locale]}>
        <p>{L.jupiterContent[locale]}</p>
      </LessonSection>

      <LessonSection number={6} title={L.rahuKetuTitle[locale]}>
        <p>{L.rahuKetuContent[locale]}</p>
      </LessonSection>

      <LessonSection number={7} title={L.balamTitle[locale]} variant="highlight">
        <p>{L.balamContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Chandra Balam (Moon Strength):' : 'चन्द्र बलम (चन्द्र शक्ति):'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Favourable houses from birth Moon: 3, 6, 7, 10, 11'
              : 'जन्म चन्द्र से शुभ भाव: 3, 6, 7, 10, 11'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Unfavourable: 1, 2, 4, 5, 8, 9, 12'
              : 'अशुभ: 1, 2, 4, 5, 8, 9, 12'}
          </p>
          <p className="text-gold-light font-mono text-sm mb-2 mt-3">
            {locale === 'en' ? 'Tara Balam (Star Strength):' : 'तारा बलम (तारा शक्ति):'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? '9 Taras: Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Parama Mitra'
              : '9 तारा: जन्म, सम्पत्, विपत्, क्षेम, प्रत्यरि, साधक, वध, मित्र, परम मित्र'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Favourable Taras: 2 (Sampat), 4 (Kshema), 6 (Sadhaka), 8 (Mitra), 9 (Parama Mitra)'
              : 'शुभ तारा: 2 (सम्पत्), 4 (क्षेम), 6 (साधक), 8 (मित्र), 9 (परम मित्र)'}
          </p>
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/transits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}
