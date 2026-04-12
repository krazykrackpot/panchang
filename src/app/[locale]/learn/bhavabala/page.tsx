'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Home, Triangle, Layers, Eye, Shield, Gem, Compass } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

// ─── Trilingual Labels ────────────────────────────────────────────────────────
const L = {
  title: { en: 'Bhavabala — House Strength', hi: 'भावबल — भाव शक्ति', sa: 'भावबलम् — भावशक्तिः' , ta: 'பாவபலம் — பாவ வலிமை' },
  subtitle: {
    en: 'While Shadbala measures a planet\'s power, Bhavabala quantifies the strength of each house. A house can function well even with a weak lord if it receives strong benefic aspects. The interplay of lord strength, positional dignity, and received aspects determines which life areas flourish.',
    hi: 'जहाँ षड्बल ग्रह की शक्ति मापता है, भावबल प्रत्येक भाव की शक्ति परिमाणित करता है। कमजोर स्वामी वाला भाव भी शुभ दृष्टियों से अच्छा कार्य कर सकता है। स्वामी बल, स्थानीय गरिमा और प्राप्त दृष्टियों का अन्तःक्रिया निर्धारित करता है कि कौन से जीवन क्षेत्र फलते-फूलते हैं।',
    sa: 'यत्र षड्बलं ग्रहस्य शक्तिं मापयति, तत्र भावबलं प्रत्येकस्य भावस्य शक्तिं परिमापयति।',
  },

  whatTitle: { en: 'What is Bhavabala?', hi: 'भावबल क्या है?', sa: 'भावबलं किम्?' },
  whatP1: {
    en: 'Bhavabala ("house strength") is a numerical assessment of each of the 12 houses in a birth chart, measured in Shashtiamshas. It answers a fundamentally different question than Shadbala: while Shadbala asks "How powerful is this planet?", Bhavabala asks "How well-supported is this life area?" A house represents a domain of life — wealth, marriage, career, health. Its Bhavabala score tells you whether that domain will function smoothly or face friction.',
    hi: 'भावबल ("भाव शक्ति") जन्म कुण्डली के प्रत्येक 12 भावों का संख्यात्मक आकलन है, षष्ट्यंशों में मापा जाता है। यह षड्बल से मूलभूत रूप से भिन्न प्रश्न का उत्तर देता है: षड्बल पूछता है "यह ग्रह कितना शक्तिशाली है?", भावबल पूछता है "यह जीवन क्षेत्र कितना समर्थित है?" भाव जीवन के एक क्षेत्र का प्रतिनिधित्व करता है — धन, विवाह, करियर, स्वास्थ्य।',
    sa: 'भावबलं प्रत्येकस्य 12 भावस्य साङ्ख्यिकम् आकलनम्। षड्बलं पृच्छति "ग्रहः कियत् शक्तिमान्?" भावबलं पृच्छति "जीवनक्षेत्रं कियत् सुसमर्थितम्?"',
  },
  whatP2: {
    en: 'The key insight: a house with a weak lord (low Shadbala) but receiving Jupiter\'s full aspect can still produce excellent results. Conversely, a house whose lord has high Shadbala but receives Saturn\'s harsh aspect may underperform. Bhavabala captures this total picture.',
    hi: 'मुख्य अन्तर्दृष्टि: कमजोर स्वामी (कम षड्बल) वाला भाव जिस पर गुरु की पूर्ण दृष्टि हो — उत्कृष्ट फल दे सकता है। इसके विपरीत, उच्च षड्बल स्वामी वाला भाव जिस पर शनि की कठोर दृष्टि हो — कम प्रदर्शन कर सकता है। भावबल यह सम्पूर्ण चित्र पकड़ता है।',
    sa: 'मुख्यम् — दुर्बलस्वामियुक्तोऽपि भावः गुरुदृष्ट्या उत्कृष्टफलं दद्यात्।',
  },

  threeTitle: { en: 'The 3 Components of Bhavabala', hi: 'भावबल के 3 घटक', sa: 'भावबलस्य 3 अङ्गानि' },

  adhipatiTitle: { en: '1. Bhavadhipati Bala — Lord\'s Contribution', hi: '1. भावाधिपति बल — स्वामी का योगदान', sa: '1. भावाधिपतिबलम्' },
  adhipatiDesc: {
    en: 'The Shadbala of the house lord directly contributes to the house\'s strength. If the 7th house lord (marriage) has high Shadbala, the 7th house inherits proportional strength. This is the most significant component — a strong lord is like a capable manager running the department. The contribution is calculated as a fraction of the lord\'s total Shadbala.',
    hi: 'भाव स्वामी का षड्बल सीधे भाव की शक्ति में योगदान देता है। यदि 7वें भाव (विवाह) के स्वामी का उच्च षड्बल है, तो 7वाँ भाव आनुपातिक शक्ति प्राप्त करता है। यह सबसे महत्वपूर्ण घटक है — बलवान स्वामी एक सक्षम प्रबन्धक की तरह है।',
    sa: 'भावस्वामिनः षड्बलं साक्षात् भावस्य शक्तौ योगदानं करोति।',
  },

  digBhavaTitle: { en: '2. Bhava Dig Bala — Positional Strength', hi: '2. भाव दिग् बल — स्थानीय शक्ति', sa: '2. भावदिग्बलम्' },
  digBhavaDesc: {
    en: 'Inherent strength of the house position itself. Kendras (1,4,7,10) carry the highest positional dignity as the four pillars of the chart. The 1st and 7th houses on the horizon axis are the strongest positions. Dusthanas (6,8,12) carry inherently lower Bhava Dig Bala — not because they are "bad" houses, but because their significations involve challenges (enemies, transformation, loss) that naturally resist easy outcomes.',
    hi: 'भाव स्थिति की अन्तर्निहित शक्ति। केन्द्र (1,4,7,10) कुण्डली के चार स्तम्भों के रूप में सर्वोच्च स्थानीय गरिमा रखते हैं। 1ला और 7वाँ भाव क्षितिज अक्ष पर सबसे शक्तिशाली। दुःस्थान (6,8,12) स्वाभाविक रूप से कम भाव दिग्बल रखते हैं — क्योंकि उनके कारकत्व चुनौतियों को दर्शाते हैं।',
    sa: 'भावस्थानस्य स्वाभाविकं बलम्। केन्द्राणि (1,4,7,10) उच्चतमं स्थानीयगौरवं धारयन्ति।',
  },

  drishtiBhavaTitle: { en: '3. Bhava Drishti Bala — Aspectual Strength', hi: '3. भाव दृष्टि बल — दृष्टिगत शक्ति', sa: '3. भावदृष्टिबलम्' },
  drishtiBhavaDesc: {
    en: 'The net effect of all planetary aspects falling on the house. Jupiter\'s aspect on any house is the single most beneficial influence — it adds wisdom, expansion, and protection to that house\'s matters. Venus and Mercury aspects add refinement and skill. Conversely, Saturn\'s aspect adds restriction and delay, Mars adds aggression and conflict, and Rahu/Ketu add confusion and karmic intensity. The net Drishti Bala can be positive or negative.',
    hi: 'भाव पर पड़ने वाली सभी ग्रहीय दृष्टियों का शुद्ध प्रभाव। गुरु की दृष्टि सबसे लाभकारी — ज्ञान, विस्तार और सुरक्षा जोड़ती है। शुक्र और बुध परिष्कार जोड़ते हैं। शनि प्रतिबन्ध, मंगल आक्रामकता, राहु/केतु भ्रम जोड़ते हैं। शुद्ध दृष्टि बल सकारात्मक या नकारात्मक हो सकता है।',
    sa: 'भावे पतन्तीनां सर्वग्रहीयदृष्टीनां शुद्धप्रभावः। गुरुदृष्टिः सर्वलाभकारिणी।',
  },

  houseTitle: { en: 'The 12 Houses — Significations & Life Domains', hi: '12 भाव — कारकत्व एवं जीवन क्षेत्र', sa: '12 भावाः — कारकत्वानि जीवनक्षेत्राणि च' },
  houses: [
    { num: 1, name: { en: 'Tanu (Self)', hi: 'तनु (आत्म)', sa: 'तनुभावः' }, significations: { en: 'Physical body, appearance, personality, health, vitality, fame, beginnings', hi: 'शरीर, रूप, व्यक्तित्व, स्वास्थ्य, जीवनशक्ति, यश, आरम्भ' }, classification: 'kendra' },
    { num: 2, name: { en: 'Dhana (Wealth)', hi: 'धन', sa: 'धनभावः' }, significations: { en: 'Family, accumulated wealth, speech, food habits, right eye, early education, death (maraka)', hi: 'परिवार, संचित धन, वाणी, खान-पान, दायाँ नेत्र, प्रारम्भिक शिक्षा', sa: '' }, classification: 'maraka' },
    { num: 3, name: { en: 'Sahaja (Siblings)', hi: 'सहज (भाई-बहन)', sa: 'सहजभावः' }, significations: { en: 'Siblings, courage, communication, short journeys, arms/shoulders, hobbies, effort', hi: 'भाई-बहन, साहस, संवाद, छोटी यात्रा, भुजाएं, शौक, प्रयास' }, classification: 'upachaya' },
    { num: 4, name: { en: 'Sukha (Happiness)', hi: 'सुख', sa: 'सुखभावः' }, significations: { en: 'Mother, home, property, vehicles, inner peace, education, heart, chest', hi: 'माता, गृह, सम्पत्ति, वाहन, आन्तरिक शान्ति, शिक्षा, हृदय' }, classification: 'kendra' },
    { num: 5, name: { en: 'Putra (Children)', hi: 'पुत्र (सन्तान)', sa: 'पुत्रभावः' }, significations: { en: 'Children, intelligence, creativity, romance, past-life merit (Purva Punya), mantras, stomach', hi: 'सन्तान, बुद्धि, सृजनशीलता, प्रेम, पूर्व पुण्य, मन्त्र, उदर' }, classification: 'trikona' },
    { num: 6, name: { en: 'Ripu (Enemies)', hi: 'रिपु (शत्रु)', sa: 'रिपुभावः' }, significations: { en: 'Enemies, diseases, debts, obstacles, service, maternal uncle, digestive system', hi: 'शत्रु, रोग, ऋण, बाधाएं, सेवा, मामा, पाचन तन्त्र' }, classification: 'dusthana' },
    { num: 7, name: { en: 'Kalatra (Spouse)', hi: 'कलत्र (जीवनसाथी)', sa: 'कलत्रभावः' }, significations: { en: 'Marriage, spouse, business partnerships, foreign travel, public dealings, death (maraka)', hi: 'विवाह, जीवनसाथी, व्यापारिक साझेदारी, विदेश यात्रा, सार्वजनिक व्यवहार' }, classification: 'kendra' },
    { num: 8, name: { en: 'Ayur (Longevity)', hi: 'आयु', sa: 'आयुर्भावः' }, significations: { en: 'Longevity, sudden events, inheritance, occult, transformation, reproductive organs, research', hi: 'आयु, अचानक घटनाएं, विरासत, गूढ़, रूपान्तरण, प्रजनन अंग, शोध' }, classification: 'dusthana' },
    { num: 9, name: { en: 'Dharma (Fortune)', hi: 'धर्म (भाग्य)', sa: 'धर्मभावः' }, significations: { en: 'Father, guru, fortune, higher education, pilgrimage, religion, philosophy, thighs', hi: 'पिता, गुरु, भाग्य, उच्च शिक्षा, तीर्थयात्रा, धर्म, दर्शन' }, classification: 'trikona' },
    { num: 10, name: { en: 'Karma (Career)', hi: 'कर्म (वृत्ति)', sa: 'कर्मभावः' }, significations: { en: 'Career, reputation, authority, government, achievement, knees, public image', hi: 'करियर, प्रतिष्ठा, अधिकार, सरकार, उपलब्धि, घुटने, सार्वजनिक छवि' }, classification: 'kendra' },
    { num: 11, name: { en: 'Labha (Gains)', hi: 'लाभ', sa: 'लाभभावः' }, significations: { en: 'Income, gains, elder siblings, friends, fulfilled desires, ankles, social networks', hi: 'आय, लाभ, बड़े भाई-बहन, मित्र, पूर्ण इच्छाएं, टखने, सामाजिक जाल' }, classification: 'upachaya' },
    { num: 12, name: { en: 'Vyaya (Loss)', hi: 'व्यय (हानि)', sa: 'व्ययभावः' }, significations: { en: 'Losses, expenses, foreign lands, moksha, bed pleasures, left eye, sleep, isolation, spirituality', hi: 'हानि, व्यय, विदेश, मोक्ष, शय्या सुख, बायाँ नेत्र, निद्रा, एकान्त, आध्यात्मिकता' }, classification: 'dusthana' },
  ],

  classTitle: { en: 'House Classifications', hi: 'भाव वर्गीकरण', sa: 'भाववर्गीकरणम्' },
  classifications: [
    { key: 'kendra', label: { en: 'Kendra (Angular)', hi: 'केन्द्र' }, houses: '1, 4, 7, 10', desc: { en: 'The four pillars of life. Planets here act with full force. Kendra lords are neutral — they need Trikona connections to produce Raja Yoga.', hi: 'जीवन के चार स्तम्भ। यहाँ ग्रह पूर्ण बल से कार्य करते हैं। केन्द्रेश तटस्थ — राजयोग के लिए त्रिकोण सम्बन्ध चाहिए।' }, color: 'text-emerald-400', bgColor: 'bg-emerald-500/5', borderColor: 'border-emerald-500/15' },
    { key: 'trikona', label: { en: 'Trikona (Trinal)', hi: 'त्रिकोण' }, houses: '1, 5, 9', desc: { en: 'The fortune triangle — Lakshmi sthanas. Most auspicious houses. Their lords are always benefic, regardless of natural malefic/benefic nature.', hi: 'भाग्य त्रिकोण — लक्ष्मी स्थान। सर्वाधिक शुभ भाव। इनके स्वामी सदैव शुभ, प्राकृतिक स्वभाव चाहे जो हो।' }, color: 'text-blue-300', bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/15' },
    { key: 'dusthana', label: { en: 'Dusthana (Challenging)', hi: 'दुःस्थान' }, houses: '6, 8, 12', desc: { en: 'Houses of enemies, transformation, and loss. Their lords become functional malefics. Planets placed here face obstruction — but can produce Viparita Raja Yoga if dusthana lords occupy other dusthanas.', hi: 'शत्रु, रूपान्तरण और हानि के भाव। इनके स्वामी कार्यात्मक पाप बनते हैं। यहाँ ग्रह बाधित — पर दुःस्थानेश अन्य दुःस्थान में विपरीत राजयोग बनाते हैं।' }, color: 'text-red-400', bgColor: 'bg-red-500/5', borderColor: 'border-red-500/15' },
    { key: 'upachaya', label: { en: 'Upachaya (Growth)', hi: 'उपचय' }, houses: '3, 6, 10, 11', desc: { en: 'Houses that improve with age and effort. Malefic planets (Sun, Mars, Saturn, Rahu) actually do WELL here — they provide the drive, aggression, and persistence needed for growth. Results strengthen over time.', hi: 'समय और प्रयास से सुधरने वाले भाव। पाप ग्रह (सूर्य, मंगल, शनि, राहु) यहाँ अच्छा करते हैं — विकास के लिए आवश्यक आवेग और दृढ़ता देते हैं। फल समय से मजबूत होते हैं।' }, color: 'text-amber-400', bgColor: 'bg-amber-500/5', borderColor: 'border-amber-500/15' },
    { key: 'maraka', label: { en: 'Maraka (Death-inflicting)', hi: 'मारक' }, houses: '2, 7', desc: { en: 'Houses whose lords can trigger health crises during their dasha periods, especially in old age. The 2nd is a mild maraka (family, sustenance); the 7th is a stronger maraka (partnerships, public). Malefics as maraka lords intensify the effect.', hi: '2रा और 7वाँ भाव जिनके स्वामी दशा में स्वास्थ्य संकट उत्पन्न कर सकते हैं। 2रा हल्का मारक; 7वाँ प्रबल। पाप मारकेश प्रभाव तीव्र करते हैं।' }, color: 'text-violet-400', bgColor: 'bg-violet-500/5', borderColor: 'border-violet-500/15' },
  ],

  readingTitle: { en: 'Reading Your Bhavabala', hi: 'अपना भावबल कैसे पढ़ें', sa: 'स्वभावबलं कथं पठेत्' },
  readingP1: {
    en: 'Your strongest Bhavabala house represents the life area that functions most smoothly — opportunities flow naturally, efforts bear fruit easily, and the universe seems to cooperate. If the 10th house is strongest, career success comes relatively easily. If the 5th, creativity and children are blessed.',
    hi: 'सबसे बलवान भावबल का भाव वह जीवन क्षेत्र दर्शाता है जो सबसे सहज कार्य करता है — अवसर स्वाभाविक रूप से आते हैं, प्रयास सहज फलते हैं। 10वाँ सबसे बलवान हो तो करियर सहज, 5वाँ तो सन्तान और सृजनशीलता आशीर्वादित।',
    sa: 'बलवत्तमभावबलस्य भावः सहजतमं कार्यं करोति — अवसराणि स्वाभाविकतया आगच्छन्ति।',
  },
  readingP2: {
    en: 'Your weakest house demands conscious effort and targeted remedies. Strengthen the house lord (gemstone, mantra), perform remedies for malefics aspecting it, and direct deliberate attention to that life area. Weakness does not mean failure — it means that area requires cultivation rather than assumption.',
    hi: 'सबसे कमजोर भाव सचेतन प्रयास और लक्षित उपचार माँगता है। भावेश को सशक्त करें (रत्न, मन्त्र), दृष्टि डालने वाले पापग्रहों के उपचार करें। कमजोरी विफलता नहीं — उस क्षेत्र में सचेतन विकास की आवश्यकता।',
    sa: 'दुर्बलतमः भावः सचेतनप्रयासम् उपचारं च अपेक्षते।',
  },

  remedyTitle: { en: 'Remedies by House', hi: 'भाव अनुसार उपचार', sa: 'भावानुसारम् उपचाराः' },
  remedies: [
    { house: 1, remedy: { en: 'Surya Namaskar at sunrise, Ruby/Garnet for weak Lagna lord, recite Lagna lord\'s mantra', hi: 'सूर्य नमस्कार, कमजोर लग्नेश के लिए माणिक/गार्नेट, लग्नेश मन्त्र' } },
    { house: 2, remedy: { en: 'Donate food on Mondays, keep family harmony, Saraswati mantra for speech', hi: 'सोमवार को भोजन दान, पारिवारिक सद्भाव, सरस्वती मन्त्र' } },
    { house: 3, remedy: { en: 'Regular exercise, serve younger siblings, Hanuman Chalisa for courage', hi: 'नियमित व्यायाम, छोटे भाई-बहन की सेवा, हनुमान चालीसा' } },
    { house: 4, remedy: { en: 'Serve mother, maintain home altar, donate milk, Chandra mantra on Mondays', hi: 'माता सेवा, गृह पूजा स्थान, दूध दान, सोमवार चन्द्र मन्त्र' } },
    { house: 5, remedy: { en: 'Ganesha puja for obstacles to children, creative practice, Saraswati yantra', hi: 'सन्तान बाधा के लिए गणेश पूजा, सृजनात्मक अभ्यास, सरस्वती यन्त्र' } },
    { house: 6, remedy: { en: 'Feed stray animals, Durga worship for enemy protection, health regimen', hi: 'आवारा पशुओं को खिलाना, शत्रु सुरक्षा हेतु दुर्गा पूजा, स्वास्थ्य नियम' } },
    { house: 7, remedy: { en: 'Venus strengthening (diamond/white sapphire), couple rituals, Parvati-Shiva worship', hi: 'शुक्र सशक्तीकरण (हीरा), दम्पति अनुष्ठान, पार्वती-शिव पूजा' } },
    { house: 8, remedy: { en: 'Maha Mrityunjaya japa, donate black sesame, insurance planning, Kali worship', hi: 'महामृत्युंजय जप, काले तिल दान, बीमा, काली पूजा' } },
    { house: 9, remedy: { en: 'Respect guru/father, pilgrimage, Vishnu Sahasranama, donate yellow items on Thursdays', hi: 'गुरु/पिता सम्मान, तीर्थयात्रा, विष्णु सहस्रनाम, गुरुवार पीले वस्तु दान' } },
    { house: 10, remedy: { en: 'Sun worship, serve authority with integrity, donate wheat, Aditya Hridaya Stotra', hi: 'सूर्य पूजा, ईमानदारी से अधिकारी सेवा, गेहूँ दान, आदित्य हृदय स्तोत्र' } },
    { house: 11, remedy: { en: 'Network with integrity, serve elder siblings, donate to causes aligned with 11th lord', hi: 'ईमानदारी से नेटवर्किंग, बड़े भाई-बहन सेवा, 11वें भावेश-सम्बन्धित दान' } },
    { house: 12, remedy: { en: 'Meditation practice, donate to hospitals/ashrams, Vishnu Shayan puja, foreign charity', hi: 'ध्यान अभ्यास, अस्पताल/आश्रम दान, विष्णु शयन पूजा, विदेश में दान' } },
  ],

  linksTitle: { en: 'Continue Learning', hi: 'आगे पढ़ें', sa: 'अग्रे पठत' },
};

export default function LearnBhavabalaPage() {
  const locale = useLocale() as Locale;
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  const t = (obj: Record<string, string | undefined>) => obj[locale] || obj.en || '';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedComponent, setExpandedComponent] = useState<number | null>(0);
  const [expandedClass, setExpandedClass] = useState<string | null>('kendra');

  const classificationColor = (cls: string) => {
    switch (cls) {
      case 'kendra': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'trikona': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'dusthana': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'upachaya': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'maraka': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default: return 'bg-gold-primary/10 text-gold-light border-gold-primary/20';
    }
  };

  const components = [
    { title: L.adhipatiTitle, desc: L.adhipatiDesc, icon: Shield, color: 'text-amber-400' },
    { title: L.digBhavaTitle, desc: L.digBhavaDesc, icon: Compass, color: 'text-emerald-400' },
    { title: L.drishtiBhavaTitle, desc: L.drishtiBhavaDesc, icon: Eye, color: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t(L.title)}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t(L.subtitle)}</p>
      </motion.div>

      {/* ═══ What is Bhavabala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.whatTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP1)}</p>
        <p className="text-text-secondary leading-relaxed">{t(L.whatP2)}</p>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Bhavabala = Bhavadhipati Bala + Bhava Dig Bala + Bhava Drishti Bala</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Unit: Shashtiamshas | Computed for each of the 12 houses</p>
        </div>
      </motion.section>

      {/* ═══ 3 Components ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t(L.threeTitle)}</h2>
        {components.map((comp, i) => {
          const Icon = comp.icon;
          const isExpanded = expandedComponent === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedComponent(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${comp.color}`} />
                  <span className={`font-bold text-lg ${comp.color}`} style={headingFont}>{t(comp.title)}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gold-primary/10 pt-4">
                      <p className="text-text-secondary leading-relaxed">{t(comp.desc)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ 12 Houses Table ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.houseTitle)}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/15">
                <th className="text-left py-3 px-3">#</th>
                <th className="text-left py-3 px-3">{isHi ? 'भाव' : 'House'}</th>
                <th className="text-left py-3 px-3">{isHi ? 'कारकत्व' : 'Significations'}</th>
                <th className="text-center py-3 px-3">{isHi ? 'वर्ग' : 'Type'}</th>
              </tr>
            </thead>
            <tbody>
              {L.houses.map((h) => (
                <motion.tr key={h.num} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="border-t border-gold-primary/8">
                  <td className="py-2.5 px-3 text-gold-primary font-bold">{h.num}</td>
                  <td className="py-2.5 px-3 text-gold-light font-medium whitespace-nowrap">{t(h.name)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs leading-relaxed">{t(h.significations)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded border ${classificationColor(h.classification)}`}>
                      {h.classification === 'kendra' ? (isHi ? 'केन्द्र' : 'Kendra') :
                       h.classification === 'trikona' ? (isHi ? 'त्रिकोण' : 'Trikona') :
                       h.classification === 'dusthana' ? (isHi ? 'दुःस्थान' : 'Dusthana') :
                       h.classification === 'upachaya' ? (isHi ? 'उपचय' : 'Upachaya') :
                       (isHi ? 'मारक' : 'Maraka')}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ House Classifications ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t(L.classTitle)}</h2>
        {L.classifications.map((cls) => {
          const isExp = expandedClass === cls.key;
          return (
            <div key={cls.key} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden border ${cls.borderColor}`}>
              <button onClick={() => setExpandedClass(isExp ? null : cls.key)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${cls.color}`} style={headingFont}>{t(cls.label)}</span>
                  <span className="text-text-tertiary text-xs">{isHi ? 'भाव' : 'Houses'}: {cls.houses}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExp ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className={`px-6 pb-5 border-t ${cls.borderColor} pt-4`}>
                      <p className="text-text-secondary leading-relaxed text-sm">{t(cls.desc)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Reading Your Bhavabala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.readingTitle)}</h2>
        <p className="text-text-secondary leading-relaxed">{t(L.readingP1)}</p>
        <p className="text-text-secondary leading-relaxed">{t(L.readingP2)}</p>
      </motion.section>

      {/* ═══ Remedies per House ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t(L.remedyTitle)}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/15">
                <th className="text-left py-3 px-3">{isHi ? 'भाव' : 'House'}</th>
                <th className="text-left py-3 px-3">{isHi ? 'उपचार' : 'Remedies'}</th>
              </tr>
            </thead>
            <tbody>
              {L.remedies.map((r) => (
                <tr key={r.house} className="border-t border-gold-primary/8">
                  <td className="py-2 px-3 text-gold-primary font-bold">{r.house}</td>
                  <td className="py-2 px-3 text-text-secondary text-xs leading-relaxed">{t(r.remedy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t(L.linksTitle)}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/modules/18-2', label: { en: 'Module 18-2: Bhavabala Deep Dive', hi: 'मॉड्यूल 18-2: भावबल विस्तार' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {t(link.label)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
