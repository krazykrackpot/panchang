'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const L = {
  title: { en: 'Gochar — Transits & Predictions', hi: 'गोचर — ग्रह गति और भविष्यवाणी', sa: 'गोचरः — ग्रहगतिः भविष्यवाणी च' , ta: 'கோசாரம் — கோசாரங்கள் & கணிப்புகள்' },
  subtitle: { en: 'How current planetary movements trigger events in your life', hi: 'कैसे वर्तमान ग्रह गति आपके जीवन में घटनाएँ प्रेरित करती है', sa: 'कथं वर्तमानग्रहगतिः जीवने घटनाः प्रेरयति' },
  whatTitle: { en: 'What is Gochar?', hi: 'गोचर क्या है?', sa: 'गोचरः कः?' },
  whatContent: {
    en: 'Gochar (transit) is the study of current planetary positions as they move through the zodiac, measured relative to your birth Moon sign (Janma Rashi). While Dashas reveal WHICH planet activates when, Gochar shows the CURRENT cosmic weather — the ongoing movements that colour daily and monthly experiences. Jyotish uses both systems together for accurate predictions.',
    hi: 'गोचर वर्तमान ग्रह स्थितियों का अध्ययन है जब वे राशिचक्र में गति करते हैं, जो आपकी जन्म चन्द्र राशि (जन्म राशि) के सापेक्ष मापा जाता है। जहाँ दशा बताती है कौन सा ग्रह कब सक्रिय होता है, गोचर वर्तमान ब्रह्माण्डीय मौसम दिखाता है।',
    sa: 'गोचरः वर्तमानग्रहस्थितीनां अध्ययनम् यदा ते राशिचक्रे गच्छन्ति, जन्मचन्द्रराशेः सापेक्षं मीयते।'
  },
  whatContent2: {
    en: 'Think of Dashas as the "script" of your life movie and Gochar as the "weather" during filming. The script determines the major themes, but the weather affects how each scene plays out. A positive Dasha with challenging transits may bring delayed success; a difficult Dasha with supportive transits may soften the blow. The interplay of both creates the nuanced texture of real life events.',
    hi: 'दशा को अपने जीवन की फिल्म की "स्क्रिप्ट" और गोचर को फिल्मांकन के दौरान "मौसम" समझें। स्क्रिप्ट प्रमुख विषय निर्धारित करती है, लेकिन मौसम प्रत्येक दृश्य को प्रभावित करता है।',
    sa: 'दशां जीवनचलनचित्रस्य "लेख्यम्" इति गोचरं च "ऋतुम्" इति चिन्तयतु।'
  },
  moonTitle: { en: 'Why the Moon Sign Matters', hi: 'चन्द्र राशि क्यों महत्वपूर्ण है', sa: 'चन्द्रराशिः किमर्थं महत्त्वपूर्णा' },
  moonContent: {
    en: 'In Vedic astrology, transits are primarily judged from the Moon sign (Chandra Rashi), not the Sun sign used in Western astrology. The Moon represents the mind, emotions, and daily experiences — it is the lens through which we perceive reality. When Saturn transits your Moon sign, you feel it emotionally and practically.',
    hi: 'वैदिक ज्योतिष में गोचर मुख्य रूप से चन्द्र राशि से आँका जाता है, न कि पश्चिमी ज्योतिष में प्रयुक्त सूर्य राशि से। चन्द्र मन, भावनाओं और दैनिक अनुभवों का प्रतिनिधित्व करता है।',
    sa: 'वैदिकज्योतिषे गोचरः प्रधानतः चन्द्रराशेः आकल्यते, न सूर्यराशेः।'
  },
  moonContent2: {
    en: 'Advanced practitioners also check transits from the Lagna (Ascendant) and from the relevant house lord. For example, for career matters, transits over the 10th house lord and from the Dashamsha (D10) chart are considered. But for general predictions, the Moon sign remains the primary reference.',
    hi: 'उन्नत अभ्यासकर्ता लग्न और सम्बन्धित भाव स्वामी से भी गोचर जाँचते हैं। उदाहरण के लिए, करियर मामलों में 10वें भाव के स्वामी पर गोचर और दशमांश (D10) कुण्डली से देखा जाता है।',
    sa: 'उन्नतप्रयोक्तारः लग्नात् सम्बद्धभावस्वामिनश्च गोचरं परीक्षन्ते।'
  },
  saturnTitle: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का 7.5 वर्ष का गोचर', sa: 'साढेसाती — शनेः सार्धसप्तवर्षगोचरः' },
  saturnContent: {
    en: 'Sade Sati is perhaps the most discussed transit in Jyotish. It occurs when Saturn (which takes ~29.5 years to orbit) transits through the 12th, 1st, and 2nd houses from your Moon sign — approximately 7.5 years (2.5 years in each sign). It brings transformation through challenges: restructuring career, relationships, and self-identity.',
    hi: 'साढ़े साती ज्योतिष में सबसे अधिक चर्चित गोचर है। यह तब होती है जब शनि आपकी चन्द्र राशि से 12वें, 1ले और 2रे भाव से गोचर करता है — लगभग 7.5 वर्ष।',
    sa: 'साढेसाती ज्योतिषे सर्वाधिकचर्चितगोचरः। शनिः चन्द्रराशेः 12, 1, 2 भावेभ्यः गोचरं करोति।'
  },
  saturnContent2: {
    en: 'Not always negative — for well-placed Saturn in birth charts (Saturn in own sign, exaltation, or Yogakaraka position), Sade Sati can bring discipline, career advancement, and spiritual maturity. The key factor is Saturn\'s natal strength and its relationship with the Moon. A Taurus Moon native (Saturn friendly sign) will experience a very different Sade Sati than a Cancer Moon native (Saturn debilitated from Moon\'s sign).',
    hi: 'हमेशा नकारात्मक नहीं — जन्म कुण्डली में अच्छी स्थिति वाले शनि (स्वराशि, उच्च, या योगकारक) के लिए साढ़े साती अनुशासन, करियर उन्नति और आध्यात्मिक परिपक्वता ला सकती है। मुख्य कारक शनि का जन्मकालीन बल और चन्द्र के साथ उसका सम्बन्ध है।',
    sa: 'सर्वदा नकारात्मकं न — सुस्थितशनेः कृते अनुशासनं, जीविकोन्नतिं, आध्यात्मिकपरिपक्वतां च आनयति।'
  },
  jupiterTitle: { en: 'Jupiter Transit — The Great Benefic', hi: 'गुरु गोचर — महान शुभ ग्रह', sa: 'गुरुगोचरः — महाशुभग्रहः' },
  jupiterContent: {
    en: 'Jupiter (Guru) takes ~12 years for one full orbit, spending about 1 year in each sign. Jupiter transiting the 2nd, 5th, 7th, 9th, and 11th houses from Moon is considered highly auspicious. The 5th and 9th (trikona) transits are especially powerful — bringing wisdom, fortune, children, and spiritual growth. Jupiter in the 8th from Moon can bring sudden unexpected events.',
    hi: 'गुरु एक पूर्ण कक्षा में ~12 वर्ष लेता है, प्रत्येक राशि में लगभग 1 वर्ष रहता है। चन्द्र से 2, 5, 7, 9 और 11वें भाव में गुरु का गोचर अत्यन्त शुभ माना जाता है।',
    sa: 'गुरुः पूर्णकक्षायां ~12 वर्षाणि गृह्णाति। चन्द्रात् 2, 5, 7, 9, 11 भावेषु गुरोः गोचरः अत्यन्तशुभः।'
  },
  doubleTransitTitle: { en: 'Double Transit Theory (Gochar Prabhav)', hi: 'दोहरा गोचर सिद्धान्त (गोचर प्रभाव)', sa: 'द्विगोचरसिद्धान्तः (गोचरप्रभावः)' },
  doubleTransitContent: {
    en: 'One of the most powerful predictive tools in Jyotish: for a major event to manifest, BOTH Jupiter and Saturn must simultaneously aspect the relevant house (by transit). Jupiter provides the blessing/opportunity and Saturn provides the structural manifestation. For marriage, both must aspect the 7th house from Moon; for career change, the 10th house; for children, the 5th house.',
    hi: 'ज्योतिष में सबसे शक्तिशाली भविष्यवाणी उपकरणों में से एक: किसी प्रमुख घटना के प्रकट होने के लिए गुरु और शनि दोनों को एक साथ सम्बन्धित भाव को दृष्टि करनी चाहिए। गुरु आशीर्वाद/अवसर और शनि संरचनात्मक अभिव्यक्ति प्रदान करता है।',
    sa: 'ज्योतिषे शक्तिमत्तमं भविष्यवाणीसाधनम्: प्रमुखघटनायाः प्रकटीकरणाय गुरुः शनिश्च एकस्मिन् काले सम्बद्धभावं दृष्टिं कुर्याताम्।'
  },
  doubleTransitContent2: {
    en: 'Jupiter aspects the 5th, 7th, and 9th houses from its position (in addition to the house it occupies). Saturn aspects the 3rd, 7th, and 10th houses. By tracking where both are transiting, you can identify which houses in your chart are "activated" for major events in a given year.',
    hi: 'गुरु अपनी स्थिति से 5वें, 7वें और 9वें भाव को दृष्टि करता है। शनि 3रे, 7वें और 10वें भाव को दृष्टि करता है। दोनों के गोचर को ट्रैक करके, आप पहचान सकते हैं कि किसी वर्ष में कौन से भाव "सक्रिय" हैं।',
    sa: 'गुरुः 5, 7, 9 भावान् दृष्टिं करोति। शनिः 3, 7, 10 भावान्। उभयोः गोचरं अनुसरन् कः भावः सक्रियः इति ज्ञातुं शक्यते।'
  },
  rahuKetuTitle: { en: 'Rahu-Ketu Axis Transit', hi: 'राहु-केतु अक्ष गोचर', sa: 'राहुकेत्वक्षगोचरः' },
  rahuKetuContent: {
    en: 'Rahu and Ketu (the lunar nodes) always transit in opposite signs, moving retrograde through the zodiac in ~18 years (~1.5 years per sign). Rahu over your Moon brings obsessive desires, material ambition, and sometimes confusion about identity; Ketu over your Moon brings detachment, spiritual inclination, and letting go of attachments.',
    hi: 'राहु और केतु सदा विपरीत राशियों में गोचर करते हैं, ~18 वर्षों में वक्री गति से। चन्द्र पर राहु आसक्ति और भौतिक महत्वाकांक्षा लाता है; चन्द्र पर केतु वैराग्य और आध्यात्मिक प्रवृत्ति लाता है।',
    sa: 'राहुकेतू सदा विपरीतराशिषु गोचरतः, ~18 वर्षेषु वक्रगत्या।'
  },
  rahuKetuContent2: {
    en: 'The Rahu-Ketu axis transiting the 1st-7th house axis can significantly reshape identity and relationships — often manifesting as a major relationship beginning or ending. The 4th-10th axis transit restructures home/career balance. The 5th-11th axis affects children, creativity, and social networks. Pay special attention when the transiting nodes conjunct natal planets.',
    hi: 'राहु-केतु अक्ष का 1-7 भाव अक्ष पर गोचर पहचान और सम्बन्धों को महत्वपूर्ण रूप से पुनर्गठित कर सकता है। 4-10 अक्ष गृह/करियर सन्तुलन को पुनर्गठित करता है। 5-11 अक्ष संतान, रचनात्मकता और सामाजिक नेटवर्क को प्रभावित करता है।',
    sa: 'राहुकेत्वक्षस्य 1-7 भावाक्षे गोचरः पहचानं सम्बन्धांश्च पुनर्गठयितुं शक्नोति।'
  },
  ashtakavargaTitle: { en: 'Ashtakavarga — Transit Scoring System', hi: 'अष्टकवर्ग — गोचर अंक प्रणाली', sa: 'अष्टकवर्गः — गोचराङ्कपद्धतिः' },
  ashtakavargaContent: {
    en: 'Ashtakavarga is a numerical system that scores each planet\'s transit effectiveness through each sign. Each of the 7 planets (Sun through Saturn) and the Lagna contribute "bindus" (points, 0 or 1) to each sign, creating an 8x12 matrix. A sign with 4+ bindus for a planet gives good results when that planet transits there; below 4 gives challenges.',
    hi: 'अष्टकवर्ग एक संख्यात्मक प्रणाली है जो प्रत्येक राशि में प्रत्येक ग्रह के गोचर की प्रभावशीलता को अंकित करती है। 7 ग्रहों में से प्रत्येक और लग्न प्रत्येक राशि को "बिन्दु" (अंक) प्रदान करते हैं। 4+ बिन्दु = शुभ गोचर; 4 से कम = कठिनाई।',
    sa: 'अष्टकवर्गः संख्यात्मकपद्धतिः या प्रत्येकराशौ प्रत्येकग्रहस्य गोचरप्रभावशीलतां अङ्कयति।'
  },
  ashtakavargaContent2: {
    en: 'The Sarvashtakavarga (total of all planet contributions) gives a quick overview: signs with 28+ total points are highly supportive for any transit, while those below 22 are weak. This system is remarkably accurate for predicting financial outcomes — Saturn transiting a sign where it has high Ashtakavarga bindus brings career rewards even during Sade Sati.',
    hi: 'सर्वाष्टकवर्ग (सभी ग्रहों के योगदान का कुल) एक त्वरित अवलोकन देता है: 28+ कुल अंक वाली राशियाँ अत्यन्त सहायक हैं, 22 से कम वाली दुर्बल। यह प्रणाली आर्थिक परिणामों की भविष्यवाणी में उल्लेखनीय रूप से सटीक है।',
    sa: 'सर्वाष्टकवर्गः (सर्वग्रहयोगदानस्य कुलम्) त्वरितावलोकनं ददाति: 28+ अंकैः सह राशयः अत्यन्तसहायकाः।'
  },
  speedTitle: { en: 'Transit Speeds & Effects', hi: 'गोचर गति और प्रभाव', sa: 'गोचरगतिः प्रभावाः च' },
  transitHouseTitle: { en: 'Transit Through Houses — Quick Guide', hi: 'भावों में गोचर — त्वरित मार्गदर्शिका', sa: 'भावेषु गोचरः — त्वरितमार्गदर्शिका' },
  balamTitle: { en: 'Chandra Balam & Tara Balam', hi: 'चन्द्र बलम और तारा बलम', sa: 'चन्द्रबलं ताराबलं च' },
  balamContent: {
    en: 'Two important transit indicators: Chandra Balam checks if the Moon\'s current transit position (counted from your birth Moon) is in a favourable house (3, 6, 7, 10, 11 from birth Moon are good). Tara Balam divides the 27 nakshatras into 9 groups of 3, each with different qualities. Together, these determine daily auspiciousness for muhurta selection.',
    hi: 'दो महत्वपूर्ण गोचर सूचक: चन्द्र बलम जाँचता है कि चन्द्र की वर्तमान गोचर स्थिति शुभ भाव में है या नहीं। तारा बलम 27 नक्षत्रों को 9 समूहों में विभाजित करता है।',
    sa: 'द्वौ महत्त्वपूर्णगोचरसूचकौ: चन्द्रबलं ताराबलं च।'
  },
  modulesTitle: { en: 'Related Lesson Modules & Tools', hi: 'सम्बन्धित पाठ मॉड्यूल और उपकरण', sa: 'सम्बद्धपाठखण्डाः साधनानि च' },
  tryIt: { en: 'View Current Transits', hi: 'वर्तमान गोचर देखें', sa: 'वर्तमानगोचरं पश्यतु' },
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

const TRANSIT_HOUSES = [
  { house: 1, saturn: { en: 'Stress, health issues, identity crisis', hi: 'तनाव, स्वास्थ्य, पहचान संकट' }, jupiter: { en: 'Confidence, new beginnings, weight gain', hi: 'आत्मविश्वास, नई शुरुआत' }, nature: 'mixed' },
  { house: 2, saturn: { en: 'Financial pressure, family tensions', hi: 'आर्थिक दबाव, पारिवारिक तनाव' }, jupiter: { en: 'Wealth increase, good speech, family harmony', hi: 'धन वृद्धि, मधुर वाणी' }, nature: 'mixed' },
  { house: 3, saturn: { en: 'Courage, effort rewarded, short travels', hi: 'साहस, प्रयास फलित, छोटी यात्राएँ' }, jupiter: { en: 'Reduced initiative, lethargy, elder sibling issues', hi: 'पहल में कमी, आलस्य' }, nature: 'mixed' },
  { house: 4, saturn: { en: 'Domestic unrest, mother\'s health, property issues', hi: 'घरेलू अशान्ति, माता स्वास्थ्य' }, jupiter: { en: 'Home comforts, vehicle, maternal happiness', hi: 'गृह सुख, वाहन, मातृ सुख' }, nature: 'mixed' },
  { house: 5, saturn: { en: 'Children issues, reduced creativity, speculation loss', hi: 'संतान समस्या, रचनात्मकता में कमी' }, jupiter: { en: 'Children, education, romance, spiritual growth', hi: 'संतान, शिक्षा, प्रेम, आध्यात्मिक वृद्धि' }, nature: 'mixed' },
  { house: 6, saturn: { en: 'Victory over enemies, health improvement', hi: 'शत्रुओं पर विजय, स्वास्थ्य सुधार' }, jupiter: { en: 'Debt/disease issues, legal troubles', hi: 'ऋण/रोग, कानूनी परेशानी' }, nature: 'mixed' },
  { house: 7, saturn: { en: 'Relationship strain, partnership issues', hi: 'सम्बन्ध तनाव, साझेदारी समस्या' }, jupiter: { en: 'Marriage, partnerships, travel, expansion', hi: 'विवाह, साझेदारी, यात्रा' }, nature: 'mixed' },
  { house: 8, saturn: { en: 'Chronic illness, accidents, transformation', hi: 'दीर्घ रोग, दुर्घटना, परिवर्तन' }, jupiter: { en: 'Sudden events, inheritance, occult interest', hi: 'अचानक घटनाएँ, विरासत' }, nature: 'mixed' },
  { house: 9, saturn: { en: 'Father issues, dharma questioning, delayed fortune', hi: 'पिता समस्या, धर्म प्रश्न, विलम्बित भाग्य' }, jupiter: { en: 'Fortune, pilgrimage, guru\'s grace, promotion', hi: 'भाग्य, तीर्थयात्रा, गुरु कृपा' }, nature: 'mixed' },
  { house: 10, saturn: { en: 'Career restructuring, heavy responsibility', hi: 'करियर पुनर्गठन, भारी ज़िम्मेदारी' }, jupiter: { en: 'Career peak, recognition, authority', hi: 'करियर शिखर, मान्यता, अधिकार' }, nature: 'mixed' },
  { house: 11, saturn: { en: 'Gains through hard work, elder sibling support', hi: 'कठिन परिश्रम से लाभ' }, jupiter: { en: 'Maximum gains, fulfilled desires, social expansion', hi: 'अधिकतम लाभ, इच्छा पूर्ति' }, nature: 'good' },
  { house: 12, saturn: { en: 'Expenditure, isolation, foreign travel, spiritual retreat', hi: 'व्यय, एकांत, विदेश यात्रा' }, jupiter: { en: 'Expenses, spiritual growth, foreign settlement', hi: 'व्यय, आध्यात्मिक वृद्धि, विदेश' }, nature: 'mixed' },
];

export default function LearnGocharPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {((L.title as Record<string, string>)[locale] ?? L.title.en)}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{((L.subtitle as Record<string, string>)[locale] ?? L.subtitle.en)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Gochar" devanagari="गोचर" transliteration="Gocara" meaning="Transit / Planetary movement" />
        <SanskritTermCard term="Janma Rashi" devanagari="जन्म राशि" transliteration="Janma Rasi" meaning="Birth Moon sign" />
        <SanskritTermCard term="Sade Sati" devanagari="साढ़ेसाती" transliteration="Sadhesati" meaning="Saturn's 7.5 year transit" />
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Ashtakavarga" meaning="8-fold transit strength" />
        <SanskritTermCard term="Vedha" devanagari="वेध" transliteration="Vedha" meaning="Transit obstruction" />
        <SanskritTermCard term="Bindu" devanagari="बिन्दु" transliteration="Bindu" meaning="Ashtakavarga point" />
      </div>

      {/* Section 1: What is Gochar */}
      <LessonSection number={1} title={((L.whatTitle as Record<string, string>)[locale] ?? L.whatTitle.en)}>
        <p style={bodyFont}>{((L.whatContent as Record<string, string>)[locale] ?? L.whatContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.whatContent2 as Record<string, string>)[locale] ?? L.whatContent2.en)}</p>
      </LessonSection>

      {/* Section 2: Moon sign */}
      <LessonSection number={2} title={((L.moonTitle as Record<string, string>)[locale] ?? L.moonTitle.en)}>
        <p style={bodyFont}>{((L.moonContent as Record<string, string>)[locale] ?? L.moonContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.moonContent2 as Record<string, string>)[locale] ?? L.moonContent2.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {!isDevanagariLocale(locale) ? 'Transit house = Current planet sign - Birth Moon sign + 1' : 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Example: If birth Moon is Taurus (2) and Saturn is currently in Cancer (4) → Saturn transit in 3rd house from Moon'
              : 'उदाहरण: यदि जन्म चन्द्र वृषभ (2) में है और शनि वर्तमान में कर्क (4) में → चन्द्र से 3रे भाव में शनि गोचर'}
          </p>
        </div>
      </LessonSection>

      {/* Section 3: Transit Speeds */}
      <LessonSection number={3} title={((L.speedTitle as Record<string, string>)[locale] ?? L.speedTitle.en)}>
        <div className="space-y-2">
          {TRANSIT_SPEEDS.map((ts, i) => (
            <motion.div
              key={ts.planet.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3"
            >
              <div className="w-16 text-right text-sm font-semibold flex-shrink-0" style={{ color: ts.color }}>
                {ts.planet[locale]}
              </div>
              <div className="w-40 text-text-secondary text-xs font-mono flex-shrink-0">{ts.speed}</div>
              <div className="text-text-secondary/70 text-xs" style={bodyFont}>{ts.effect[locale]}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-text-secondary/75 text-sm italic" style={bodyFont}>
          {locale === 'en'
            ? 'Slower planets (Jupiter, Saturn, Rahu/Ketu) have the most profound and lasting effects since they influence a house for months or years. Fast-moving planets (Moon, Sun, Mercury, Venus) are used for fine-tuning predictions within the framework set by the slow movers.'
            : 'धीमे ग्रह (गुरु, शनि, राहु/केतु) सबसे गहरे और स्थायी प्रभाव डालते हैं क्योंकि वे महीनों या वर्षों तक एक भाव को प्रभावित करते हैं। तीव्र ग्रह (चन्द्र, सूर्य, बुध, शुक्र) धीमे ग्रहों द्वारा निर्धारित ढाँचे के भीतर भविष्यवाणियों को सूक्ष्म-समायोजित करते हैं।'}
        </p>
      </LessonSection>

      {/* Section 4: Sade Sati */}
      <LessonSection number={4} title={((L.saturnTitle as Record<string, string>)[locale] ?? L.saturnTitle.en)}>
        <p style={bodyFont}>{((L.saturnContent as Record<string, string>)[locale] ?? L.saturnContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.saturnContent2 as Record<string, string>)[locale] ?? L.saturnContent2.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-blue-400/20">
          <p className="text-blue-300 font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Three Phases of Sade Sati:' : 'साढ़े साती के तीन चरण:'}
          </p>
          <div className="space-y-1">
            <p className="text-blue-200/80 font-mono text-xs">
              {!isDevanagariLocale(locale) ? '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction' : 'प्रथम चरण (चन्द्र से 12वाँ): उदय चरण — मानसिक तनाव, आर्थिक दबाव, दिशा पर संदेह'}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {!isDevanagariLocale(locale) ? '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval' : 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन, स्वास्थ्य चुनौती, करियर उथल-पुथल'}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {!isDevanagariLocale(locale) ? '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments' : 'तृतीय चरण (चन्द्र से 2रा): अस्त चरण — आर्थिक पुनर्गठन, वाणी सम्बन्धी, पारिवारिक समायोजन'}
            </p>
          </div>
          <p className="text-blue-200/50 font-mono text-xs mt-2">
            {!isDevanagariLocale(locale) ? 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life' : 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Jupiter Transit */}
      <LessonSection number={5} title={((L.jupiterTitle as Record<string, string>)[locale] ?? L.jupiterTitle.en)}>
        <p style={bodyFont}>{((L.jupiterContent as Record<string, string>)[locale] ?? L.jupiterContent.en)}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">
              {!isDevanagariLocale(locale) ? 'Auspicious Jupiter transit houses' : 'शुभ गुरु गोचर भाव'}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {locale === 'en'
                ? '2nd (wealth), 5th (children/education), 7th (marriage/partnership), 9th (fortune/dharma), 11th (gains/desires fulfilled)'
                : '2रा (धन), 5वाँ (संतान/शिक्षा), 7वाँ (विवाह/साझेदारी), 9वाँ (भाग्य/धर्म), 11वाँ (लाभ/इच्छा पूर्ति)'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">
              {!isDevanagariLocale(locale) ? 'Challenging Jupiter transit houses' : 'कठिन गुरु गोचर भाव'}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {locale === 'en'
                ? '3rd (reduced initiative), 6th (debt/health), 8th (sudden events), 10th (heavy workload), 12th (expenses/loss)'
                : '3रा (पहल में कमी), 6ठा (ऋण/स्वास्थ्य), 8वाँ (अचानक घटनाएँ), 10वाँ (भारी कार्यभार), 12वाँ (व्यय/हानि)'}
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Double Transit Theory */}
      <LessonSection number={6} title={((L.doubleTransitTitle as Record<string, string>)[locale] ?? L.doubleTransitTitle.en)} variant="highlight">
        <p style={bodyFont}>{((L.doubleTransitContent as Record<string, string>)[locale] ?? L.doubleTransitContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.doubleTransitContent2 as Record<string, string>)[locale] ?? L.doubleTransitContent2.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Double Transit Examples:' : 'दोहरा गोचर उदाहरण:'}
          </p>
          <div className="space-y-1.5 text-gold-light/80 font-mono text-xs">
            <p>{!isDevanagariLocale(locale) ? 'Marriage: Jupiter + Saturn both aspect 7th house from Moon' : 'विवाह: गुरु + शनि दोनों चन्द्र से 7वें भाव को दृष्टि करें'}</p>
            <p>{!isDevanagariLocale(locale) ? 'Job change: Jupiter + Saturn both aspect 10th house from Moon' : 'नौकरी परिवर्तन: गुरु + शनि दोनों 10वें भाव को दृष्टि करें'}</p>
            <p>{!isDevanagariLocale(locale) ? 'Child birth: Jupiter + Saturn both aspect 5th house from Moon' : 'संतान जन्म: गुरु + शनि दोनों 5वें भाव को दृष्टि करें'}</p>
            <p>{!isDevanagariLocale(locale) ? 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon' : 'सम्पत्ति खरीद: गुरु + शनि दोनों 4वें भाव को दृष्टि करें'}</p>
          </div>
          <p className="text-gold-light/50 font-mono text-xs mt-2 italic">
            {!isDevanagariLocale(locale) ? 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.' : 'नोट: घटना को चल रही दशा का समर्थन भी होना चाहिए — दोहरा गोचर समय विंडो देता है, दशा वादा देती है।'}
          </p>
        </div>
      </LessonSection>

      {/* Section 7: Rahu-Ketu */}
      <LessonSection number={7} title={((L.rahuKetuTitle as Record<string, string>)[locale] ?? L.rahuKetuTitle.en)}>
        <p style={bodyFont}>{((L.rahuKetuContent as Record<string, string>)[locale] ?? L.rahuKetuContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.rahuKetuContent2 as Record<string, string>)[locale] ?? L.rahuKetuContent2.en)}</p>
      </LessonSection>

      {/* Section 8: Ashtakavarga */}
      <LessonSection number={8} title={((L.ashtakavargaTitle as Record<string, string>)[locale] ?? L.ashtakavargaTitle.en)}>
        <p style={bodyFont}>{((L.ashtakavargaContent as Record<string, string>)[locale] ?? L.ashtakavargaContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.ashtakavargaContent2 as Record<string, string>)[locale] ?? L.ashtakavargaContent2.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Ashtakavarga Scoring:' : 'अष्टकवर्ग अंकन:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-red-400/10 border border-red-400/15">
              <span className="text-red-400 font-mono font-bold">0-2</span>
              <span className="text-text-secondary ml-2">{!isDevanagariLocale(locale) ? 'Very weak' : 'अत्यन्त दुर्बल'}</span>
            </div>
            <div className="p-2 rounded bg-amber-400/10 border border-amber-400/15">
              <span className="text-amber-400 font-mono font-bold">3</span>
              <span className="text-text-secondary ml-2">{!isDevanagariLocale(locale) ? 'Below average' : 'औसत से नीचे'}</span>
            </div>
            <div className="p-2 rounded bg-blue-400/10 border border-blue-400/15">
              <span className="text-blue-400 font-mono font-bold">4-5</span>
              <span className="text-text-secondary ml-2">{!isDevanagariLocale(locale) ? 'Good' : 'शुभ'}</span>
            </div>
            <div className="p-2 rounded bg-emerald-400/10 border border-emerald-400/15">
              <span className="text-emerald-400 font-mono font-bold">6-8</span>
              <span className="text-text-secondary ml-2">{!isDevanagariLocale(locale) ? 'Excellent' : 'उत्कृष्ट'}</span>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 9: Transit through houses table */}
      <LessonSection number={9} title={((L.transitHouseTitle as Record<string, string>)[locale] ?? L.transitHouseTitle.en)}>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark w-12">{!isDevanagariLocale(locale) ? 'House' : 'भाव'}</th>
                <th className="text-left py-2 px-2 text-blue-400">{!isDevanagariLocale(locale) ? 'Saturn Transit Effect' : 'शनि गोचर प्रभाव'}</th>
                <th className="text-left py-2 px-2 text-amber-400">{!isDevanagariLocale(locale) ? 'Jupiter Transit Effect' : 'गुरु गोचर प्रभाव'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {TRANSIT_HOUSES.map((th) => (
                <tr key={th.house} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 text-gold-light font-mono font-bold">{th.house}</td>
                  <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{isHi ? th.saturn.hi : th.saturn.en}</td>
                  <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{isHi ? th.jupiter.hi : th.jupiter.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 10: Chandra Balam & Tara Balam */}
      <LessonSection number={10} title={((L.balamTitle as Record<string, string>)[locale] ?? L.balamTitle.en)}>
        <p style={bodyFont}>{((L.balamContent as Record<string, string>)[locale] ?? L.balamContent.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Chandra Balam (Moon Strength):' : 'चन्द्र बलम (चन्द्र शक्ति):'}
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
            {!isDevanagariLocale(locale) ? 'Tara Balam (Star Strength):' : 'तारा बलम (तारा शक्ति):'}
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

      {/* Section 11: Related modules and tools */}
      <LessonSection number={11} title={((L.modulesTitle as Record<string, string>)[locale] ?? L.modulesTitle.en)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/12-1', label: { en: 'Lesson 12-1: Introduction to Transits', hi: 'पाठ 12-1: गोचर परिचय' } },
            { href: '/learn/modules/12-2', label: { en: 'Lesson 12-2: Saturn & Jupiter Transits', hi: 'पाठ 12-2: शनि और गुरु गोचर' } },
            { href: '/learn/modules/12-3', label: { en: 'Lesson 12-3: Ashtakavarga System', hi: 'पाठ 12-3: अष्टकवर्ग प्रणाली' } },
            { href: '/transits', label: { en: 'Current Transit Positions', hi: 'वर्तमान गोचर स्थितियाँ' }, tool: true },
            { href: '/sade-sati', label: { en: 'Sade Sati Calculator', hi: 'साढ़े साती कैलकुलेटर' }, tool: true },
            { href: '/calendar', label: { en: 'Transit Calendar', hi: 'गोचर कैलेंडर' }, tool: true },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border hover:border-gold-primary/30 transition-colors block ${
                'tool' in mod ? 'border-blue-400/15 bg-blue-400/3' : 'border-gold-primary/10'
              }`}
            >
              <span className={`text-xs font-medium ${'tool' in mod ? 'text-blue-300' : 'text-gold-light'}`} style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
              </span>
              {'tool' in mod && (
                <span className="text-text-tertiary text-xs block mt-0.5">
                  {!isDevanagariLocale(locale) ? 'Tool' : 'उपकरण'} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/transits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {((L.tryIt as Record<string, string>)[locale] ?? L.tryIt.en)} →
        </Link>
      </div>
    </div>
  );
}
