'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import type { Locale } from '@/types/panchang';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const GANDA_MULA = [
  {
    id: 1, name: { en: 'Ashwini', hi: 'अश्विनी' }, sign: { en: 'Aries (Mesha)', hi: 'मेष' },
    ruler: { en: 'Ketu', hi: 'केतु' }, deity: { en: 'Ashwini Kumaras (Divine Physicians)', hi: 'अश्विनी कुमार (दैवीय चिकित्सक)' },
    junction: { en: 'Pisces → Aries (Water → Fire)', hi: 'मीन → मेष (जल → अग्नि)' },
    affected: { en: 'Father', hi: 'पिता' },
    criticalPadas: '1, 2',
    nature: { en: 'Swift, healing, energetic', hi: 'तीव्र, उपचारक, ऊर्जावान' },
    effects: {
      en: 'Birth in Ashwini may affect the father\'s health or career. The native is inherently a healer — drawn to medicine, alternative therapies, or emergency services. Pada 1-2 (in Aries navamsha) intensifies the fire element, making the child extremely restless and action-oriented. Positive: exceptional courage, pioneering spirit, and quick decision-making. The twin Ashwini Kumaras grant regenerative abilities.',
      hi: 'अश्विनी में जन्म पिता के स्वास्थ्य या कैरियर को प्रभावित कर सकता है। जातक जन्मजात उपचारक होता है — चिकित्सा, वैकल्पिक चिकित्सा, या आपातकालीन सेवाओं की ओर आकर्षित। पाद 1-2 (मेष नवांश में) अग्नि तत्व को तीव्र करता है। सकारात्मक: असाधारण साहस, अग्रणी भावना और शीघ्र निर्णय क्षमता।',
    },
    upayas: {
      en: [
        'Perform Ashwini Nakshatra Shanti Puja on the 27th day after birth',
        'Recite Ketu Beej Mantra: "Om Sram Sreem Sroum Sah Ketave Namah" — 17,000 times',
        'Donate a cow, blankets, and saptadhanya (seven grains) to a temple or Brahmin',
        'Worship Lord Ganesha on Tuesdays and Saturdays',
        'Father should not see the newborn for 12 days (traditional; 27 days for pada 1)',
        'Light a ghee lamp before Lord Dhanvantari (deity of healing)',
      ],
      hi: [
        'जन्म के 27वें दिन अश्विनी नक्षत्र शान्ति पूजा',
        'केतु बीज मन्त्र: "ॐ स्रां स्रीं स्रौं सः केतवे नमः" — 17,000 बार',
        'गाय, कम्बल और सप्तधान्य का दान',
        'मंगलवार और शनिवार को भगवान गणेश की पूजा',
        'पिता 12 दिनों तक नवजात को न देखें (पाद 1 के लिए 27 दिन)',
        'भगवान धन्वन्तरि के समक्ष घी का दीपक',
      ],
    },
  },
  {
    id: 9, name: { en: 'Ashlesha', hi: 'आश्लेषा' }, sign: { en: 'Cancer (Karka)', hi: 'कर्क' },
    ruler: { en: 'Mercury', hi: 'बुध' }, deity: { en: 'Naga (Serpent deities)', hi: 'नाग (सर्प देवता)' },
    junction: { en: 'Cancer → Leo (Water → Fire)', hi: 'कर्क → सिंह (जल → अग्नि)' },
    affected: { en: 'Mother-in-law', hi: 'सास' },
    criticalPadas: '3, 4',
    nature: { en: 'Mystical, penetrating, coiling', hi: 'रहस्यमय, भेदक, कुण्डलित' },
    effects: {
      en: 'Ashlesha is ruled by the Nagas — serpent deities of the underworld. Birth here may create tension with in-laws, especially mother-in-law. The native possesses deep intuition, hypnotic charm, and psychological penetration. Pada 3-4 (at the Cancer-Leo junction) is most challenging. Negative tendencies: manipulation, jealousy, possessiveness. Positive: extraordinary research ability, kundalini awakening potential, and healing through tantra/yoga.',
      hi: 'आश्लेषा नागों (पाताल के सर्प देवताओं) द्वारा शासित। यहाँ जन्म ससुराल, विशेषकर सास के साथ तनाव उत्पन्न कर सकता है। जातक में गहन अन्तर्ज्ञान, सम्मोहक आकर्षण और मनोवैज्ञानिक भेदन शक्ति। पाद 3-4 सबसे चुनौतीपूर्ण। नकारात्मक: छल, ईर्ष्या। सकारात्मक: असाधारण अनुसन्धान क्षमता, कुण्डलिनी जागरण और तन्त्र/योग से उपचार।',
    },
    upayas: {
      en: [
        'Perform Naga Puja (Serpent worship) — especially on Nag Panchami',
        'Recite Budh Beej Mantra: "Om Bram Breem Broum Sah Budhaye Namah" — 9,000 times',
        'Donate green cloth, moong dal, emerald (if affordable), and books',
        'Offer milk to a Naga idol or anthill on auspicious days',
        'Worship Lord Vishnu — recite Vishnu Sahasranama weekly',
        'Keep a silver serpent idol at home for protection',
      ],
      hi: [
        'नाग पूजा — विशेषकर नाग पंचमी पर',
        'बुध बीज मन्त्र: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः" — 9,000 बार',
        'हरा वस्त्र, मूंग दाल, पन्ना (यदि सम्भव) और पुस्तकों का दान',
        'शुभ दिनों पर नाग प्रतिमा या बाँबी में दूध अर्पण',
        'भगवान विष्णु की पूजा — साप्ताहिक विष्णु सहस्रनाम पाठ',
        'घर में चाँदी की सर्प प्रतिमा रखें',
      ],
    },
  },
  {
    id: 10, name: { en: 'Magha', hi: 'मघा' }, sign: { en: 'Leo (Simha)', hi: 'सिंह' },
    ruler: { en: 'Ketu', hi: 'केतु' }, deity: { en: 'Pitris (Ancestors)', hi: 'पितृ (पूर्वज)' },
    junction: { en: 'Cancer → Leo (Water → Fire)', hi: 'कर्क → सिंह (जल → अग्नि)' },
    affected: { en: 'Mother', hi: 'माता' },
    criticalPadas: '1, 2',
    nature: { en: 'Royal, ancestral, authoritative', hi: 'राजसी, पैतृक, अधिकारपूर्ण' },
    effects: {
      en: 'Magha is the throne room of the zodiac — ruled by the Pitris (ancestors). Birth here may affect the mother\'s health. The native carries strong ancestral karma, a natural sense of authority, and expects respect. Pada 1 (Aries navamsha, Ketu-Mars) is most intense. The native may struggle with ego, entitlement, or inability to accept subordinate roles. Positive: leadership, generosity, connection to lineage, and ability to command large groups.',
      hi: 'मघा राशिचक्र का सिंहासन कक्ष — पितरों (पूर्वजों) द्वारा शासित। यहाँ जन्म माता के स्वास्थ्य को प्रभावित कर सकता है। जातक में दृढ़ पूर्वज कर्म, प्राकृतिक अधिकार भावना। पाद 1 सबसे तीव्र। जातक अहम्, अधिकार-भावना से संघर्ष कर सकता है। सकारात्मक: नेतृत्व, उदारता, वंश से जुड़ाव।',
    },
    upayas: {
      en: [
        'Perform Pitru Tarpan (ancestor offerings) on Amavasya',
        'Recite Ketu Beej Mantra: "Om Sram Sreem Sroum Sah Ketave Namah" — 17,000 times',
        'Donate blankets, sesame seeds, and perform Anna Daan (food donation)',
        'Worship ancestors through Shraddha ceremony annually',
        'Mother should not see the newborn for 12 days (traditional)',
        'Perform Magha Nakshatra Shanti Havan with qualified priest',
      ],
      hi: [
        'अमावस्या पर पितृ तर्पण',
        'केतु बीज मन्त्र: "ॐ स्रां स्रीं स्रौं सः केतवे नमः" — 17,000 बार',
        'कम्बल, तिल और अन्न दान',
        'वार्षिक श्राद्ध कर्म द्वारा पूर्वज पूजन',
        'माता 12 दिनों तक नवजात को न देखें',
        'योग्य पुरोहित के साथ मघा नक्षत्र शान्ति हवन',
      ],
    },
  },
  {
    id: 18, name: { en: 'Jyeshtha', hi: 'ज्येष्ठा' }, sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' },
    ruler: { en: 'Mercury', hi: 'बुध' }, deity: { en: 'Indra (King of Gods)', hi: 'इन्द्र (देवराज)' },
    junction: { en: 'Scorpio → Sagittarius (Water → Fire)', hi: 'वृश्चिक → धनु (जल → अग्नि)' },
    affected: { en: 'Elder brother/sister', hi: 'बड़ा भाई/बहन' },
    criticalPadas: '3, 4',
    nature: { en: 'Protective, senior, fierce', hi: 'रक्षात्मक, ज्येष्ठ, उग्र' },
    effects: {
      en: 'Jyeshtha means "the eldest" — ruled by Indra, king of heaven. Birth here may create rivalry with or separation from elder siblings. The native has a fierce protective instinct and will fight for those they love. Pada 3-4 (at the Scorpio-Sagittarius cusp) intensifies transformation. Negative: jealousy of those in power, chronic dissatisfaction. Positive: strategic brilliance, protective leadership, and deep occult knowledge.',
      hi: 'ज्येष्ठा अर्थात् "सबसे बड़ा" — इन्द्र (स्वर्ग के राजा) द्वारा शासित। यहाँ जन्म बड़े भाई-बहनों से प्रतिद्वंद्विता या अलगाव उत्पन्न कर सकता है। जातक में प्रबल रक्षात्मक प्रवृत्ति। पाद 3-4 परिवर्तन को तीव्र करता है। नकारात्मक: सत्तासीनों से ईर्ष्या। सकारात्मक: रणनीतिक प्रतिभा, रक्षात्मक नेतृत्व।',
    },
    upayas: {
      en: [
        'Perform Jyeshtha Nakshatra Shanti Puja',
        'Recite Budh Beej Mantra: "Om Bram Breem Broum Sah Budhaye Namah" — 9,000 times',
        'Donate green vegetables, books, and emerald on Wednesdays',
        'Worship Lord Indra — offer Arghya (water offering) facing East at sunrise',
        'Elder siblings should avoid seeing newborn for 12 days (pada 3-4: 27 days)',
        'Maintain good relationship with elder siblings — serve them respectfully',
      ],
      hi: [
        'ज्येष्ठा नक्षत्र शान्ति पूजा',
        'बुध बीज मन्त्र: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः" — 9,000 बार',
        'बुधवार को हरी सब्जियाँ, पुस्तकें और पन्ना दान',
        'इन्द्र देव की पूजा — सूर्योदय में पूर्व की ओर अर्घ्य',
        'बड़ा भाई/बहन 12 दिनों तक नवजात को न देखें (पाद 3-4: 27 दिन)',
        'बड़े भाई-बहनों से अच्छा सम्बन्ध रखें',
      ],
    },
  },
  {
    id: 19, name: { en: 'Moola', hi: 'मूल' }, sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' },
    ruler: { en: 'Ketu', hi: 'केतु' }, deity: { en: 'Nirriti (Goddess of Destruction)', hi: 'निर्ऋति (विनाश की देवी)' },
    junction: { en: 'Scorpio → Sagittarius (Water → Fire)', hi: 'वृश्चिक → धनु (जल → अग्नि)' },
    affected: { en: 'Father / family wealth', hi: 'पिता / पारिवारिक सम्पत्ति' },
    criticalPadas: '1',
    nature: { en: 'Uprooting, foundational, destructive-creative', hi: 'उन्मूलक, मूलभूत, विनाशात्मक-सृजनात्मक' },
    effects: {
      en: 'Moola is the most feared Ganda Mula nakshatra — the "root" that uproots. Ruled by Nirriti (goddess of destruction and dissolution), it sits at the galactic center of the Milky Way. Pada 1 is the most inauspicious and traditionally requires extensive shanti. Birth here may bring financial hardship to the family or health issues to the father in the child\'s early years. HOWEVER: Moola natives often become great researchers, philosophers, spiritual seekers, and truth-finders. They tear down illusions to reach the foundation of reality. Many great saints were born in Moola.',
      hi: 'मूल सबसे भयंकर गण्ड मूल नक्षत्र — "जड़" जो उखाड़ता है। निर्ऋति (विनाश और विलय की देवी) द्वारा शासित, आकाशगंगा के केन्द्र पर स्थित। पाद 1 सबसे अशुभ और पारम्परिक रूप से व्यापक शान्ति अपेक्षित। यहाँ जन्म बच्चे के प्रारम्भिक वर्षों में परिवार को आर्थिक कठिनाई या पिता को स्वास्थ्य समस्या ला सकता है। परन्तु: मूल जातक प्रायः महान शोधकर्ता, दार्शनिक, आध्यात्मिक साधक और सत्यान्वेषी बनते हैं। वे भ्रमों को नष्ट कर यथार्थ की नींव तक पहुँचते हैं। अनेक महान सन्त मूल में जन्मे थे।',
    },
    upayas: {
      en: [
        'CRITICAL: Perform Moola Nakshatra Shanti Maha Puja within 27 days of birth',
        'Recite Ketu Beej Mantra: "Om Sram Sreem Sroum Sah Ketave Namah" — 17,000 times over 40 days',
        'Perform Maha Mrityunjaya Havan for protection and longevity',
        'Donate a cow, gold, blankets, and saptadhanya (seven grains)',
        'Worship Lord Ganesha daily — He removes all Mula obstacles',
        'Father should not see the newborn for 27 days (pada 1) or 12 days (other padas)',
        'Keep a Cat\'s Eye gemstone (Vaidurya) after astrological consultation',
        'Perform Rudra Abhishek on Mondays for Shiva\'s protection',
        'Feed Brahmins and the poor on the child\'s monthly birthday for the first year',
      ],
      hi: [
        'अत्यावश्यक: जन्म के 27 दिनों के भीतर मूल नक्षत्र शान्ति महापूजा',
        'केतु बीज मन्त्र: "ॐ स्रां स्रीं स्रौं सः केतवे नमः" — 40 दिनों में 17,000 बार',
        'सुरक्षा और दीर्घायु के लिए महामृत्युंजय हवन',
        'गाय, सोना, कम्बल और सप्तधान्य का दान',
        'प्रतिदिन भगवान गणेश की पूजा — वे सभी मूल बाधाएँ दूर करते हैं',
        'पिता 27 दिनों (पाद 1) या 12 दिनों (अन्य पाद) तक नवजात को न देखें',
        'ज्योतिषीय परामर्श के बाद वैदूर्य (लहसुनिया) रत्न धारण',
        'सोमवार को रुद्राभिषेक — शिव की सुरक्षा हेतु',
        'प्रथम वर्ष में बच्चे की मासिक जयन्ती पर ब्राह्मण और गरीबों को भोजन',
      ],
    },
  },
  {
    id: 27, name: { en: 'Revati', hi: 'रेवती' }, sign: { en: 'Pisces (Meena)', hi: 'मीन' },
    ruler: { en: 'Mercury', hi: 'बुध' }, deity: { en: 'Pushan (Nourisher, Protector of journeys)', hi: 'पूषन (पोषक, यात्रा रक्षक)' },
    junction: { en: 'Pisces → Aries (Water → Fire)', hi: 'मीन → मेष (जल → अग्नि)' },
    affected: { en: 'Younger siblings', hi: 'छोटे भाई/बहन' },
    criticalPadas: '4',
    nature: { en: 'Gentle, nourishing, concluding', hi: 'सौम्य, पोषक, समापन' },
    effects: {
      en: 'Revati is the gentlest and most benign of the Ganda Mula nakshatras — the last nakshatra of the zodiac, signifying completion and spiritual transcendence. Ruled by Pushan (nourisher), the dosha effect is mild. Only Pada 4 (at the very end of Pisces, the Pisces-Aries junction) carries significant Ganda Mula energy. Birth here may delay the welfare of younger siblings. The native is exceptionally compassionate, artistic, and spiritually evolved. They are natural caregivers and guides for others\' journeys.',
      hi: 'रेवती गण्ड मूल नक्षत्रों में सबसे सौम्य — राशिचक्र का अन्तिम नक्षत्र, पूर्णता और आध्यात्मिक अतिक्रमण का प्रतीक। पूषन (पोषक) द्वारा शासित, दोष का प्रभाव हल्का। केवल पाद 4 (मीन के अन्त में) में महत्त्वपूर्ण गण्ड मूल ऊर्जा। यहाँ जन्म छोटे भाई-बहनों के कल्याण में विलम्ब कर सकता है। जातक असाधारण रूप से दयालु, कलात्मक और आध्यात्मिक रूप से विकसित।',
    },
    upayas: {
      en: [
        'Perform Revati Nakshatra Shanti Puja — lighter ceremony than Moola',
        'Recite Budh Beej Mantra: "Om Bram Breem Broum Sah Budhaye Namah" — 9,000 times',
        'Donate green items, books, and sweets to children',
        'Worship Lord Vishnu — recite Vishnu Sahasranama',
        'Offer food to fish (symbolizing Pushan\'s protection of water creatures)',
        'Younger siblings should avoid seeing newborn for 12 days (pada 4 only)',
      ],
      hi: [
        'रेवती नक्षत्र शान्ति पूजा — मूल से हल्की विधि',
        'बुध बीज मन्त्र: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः" — 9,000 बार',
        'हरी वस्तुएँ, पुस्तकें और बच्चों को मिठाइयाँ दान',
        'भगवान विष्णु की पूजा — विष्णु सहस्रनाम पाठ',
        'मछलियों को भोजन (पूषन की जल जीवों की रक्षा का प्रतीक)',
        'छोटे भाई-बहन 12 दिनों तक नवजात को न देखें (केवल पाद 4)',
      ],
    },
  },
];

/* ─── Zodiac Wheel Diagram ──────────────────────────────────────── */
const SIGNS = [
  { en: 'Ari', hi: 'मेष', element: 'fire' },
  { en: 'Tau', hi: 'वृष', element: 'earth' },
  { en: 'Gem', hi: 'मिथु', element: 'air' },
  { en: 'Can', hi: 'कर्क', element: 'water' },
  { en: 'Leo', hi: 'सिंह', element: 'fire' },
  { en: 'Vir', hi: 'कन्या', element: 'earth' },
  { en: 'Lib', hi: 'तुला', element: 'air' },
  { en: 'Sco', hi: 'वृश्चि', element: 'water' },
  { en: 'Sag', hi: 'धनु', element: 'fire' },
  { en: 'Cap', hi: 'मकर', element: 'earth' },
  { en: 'Aqu', hi: 'कुम्भ', element: 'air' },
  { en: 'Pis', hi: 'मीन', element: 'water' },
] as const;

const ELEMENT_STYLES: Record<string, { fill: string; stroke: string }> = {
  fire:  { fill: 'rgba(239, 68, 68, 0.15)',  stroke: 'rgba(239, 68, 68, 0.3)' },
  earth: { fill: 'rgba(16, 185, 129, 0.1)',  stroke: 'rgba(16, 185, 129, 0.2)' },
  air:   { fill: 'rgba(14, 165, 233, 0.1)',  stroke: 'rgba(14, 165, 233, 0.2)' },
  water: { fill: 'rgba(59, 130, 246, 0.15)', stroke: 'rgba(59, 130, 246, 0.3)' },
};

const JUNCTIONS = [
  { fromIdx: 11, toIdx: 0, naksEn: 'Revati | Ashwini', naksHi: 'रेवती | अश्विनी' },
  { fromIdx: 3, toIdx: 4, naksEn: 'Ashlesha | Magha', naksHi: 'आश्लेषा | मघा' },
  { fromIdx: 7, toIdx: 8, naksEn: 'Jyeshtha | Moola', naksHi: 'ज्येष्ठा | मूल' },
];

function ZodiacWheel({ locale }: { locale: string }) {
  const cx = 200, cy = 200, outerR = 170, innerR = 95, midR = (outerR + innerR) / 2;
  const segAngle = (2 * Math.PI) / 12;
  // Aries at 12 o'clock: segment 0 starts at -90deg offset
  const startOffset = -Math.PI / 2 - segAngle / 2;

  function arcPath(i: number, r1: number, r2: number) {
    const a1 = startOffset + i * segAngle;
    const a2 = a1 + segAngle;
    const x1o = cx + r2 * Math.cos(a1), y1o = cy + r2 * Math.sin(a1);
    const x2o = cx + r2 * Math.cos(a2), y2o = cy + r2 * Math.sin(a2);
    const x2i = cx + r1 * Math.cos(a2), y2i = cy + r1 * Math.sin(a2);
    const x1i = cx + r1 * Math.cos(a1), y1i = cy + r1 * Math.sin(a1);
    return `M${x1o},${y1o} A${r2},${r2} 0 0,1 ${x2o},${y2o} L${x2i},${y2i} A${r1},${r1} 0 0,0 ${x1i},${y1i} Z`;
  }

  function labelPos(i: number) {
    const a = startOffset + (i + 0.5) * segAngle;
    return { x: cx + midR * Math.cos(a), y: cy + midR * Math.sin(a) };
  }

  function junctionPos(fromIdx: number) {
    // Junction is at the boundary between fromIdx and fromIdx+1
    const a = startOffset + (fromIdx + 1) * segAngle;
    return {
      markerX: cx + outerR * Math.cos(a),
      markerY: cy + outerR * Math.sin(a),
      labelX: cx + (outerR + 30) * Math.cos(a),
      labelY: cy + (outerR + 30) * Math.sin(a),
    };
  }

  const legendItems = [
    { label: locale === 'en' ? 'Fire' : 'अग्नि', color: 'rgba(239, 68, 68, 0.5)' },
    { label: locale === 'en' ? 'Earth' : 'पृथ्वी', color: 'rgba(16, 185, 129, 0.4)' },
    { label: locale === 'en' ? 'Air' : 'वायु', color: 'rgba(14, 165, 233, 0.4)' },
    { label: locale === 'en' ? 'Water' : 'जल', color: 'rgba(59, 130, 246, 0.5)' },
  ];

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto" role="img" aria-label="Zodiac wheel showing Ganda Mula junctions">
      <defs>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Segments */}
      {SIGNS.map((sign, i) => {
        const es = ELEMENT_STYLES[sign.element];
        const lp = labelPos(i);
        return (
          <g key={i}>
            <path d={arcPath(i, innerR, outerR)} fill={es.fill} stroke={es.stroke} strokeWidth={1} />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              fill="#f0d48a" fontSize={locale === 'en' ? 11 : 10} fontWeight="600">
              {sign[locale === 'en' ? 'en' : 'hi']}
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <circle cx={cx} cy={cy} r={innerR - 5} fill="rgba(10, 14, 39, 0.8)" stroke="rgba(212, 168, 83, 0.2)" strokeWidth={1} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#d4a853" fontSize={12} fontWeight="700">
        {locale === 'en' ? 'Ganda Mula' : 'गण्ड मूल'}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#8a8478" fontSize={10}>
        {locale === 'en' ? 'Junctions' : 'सन्धि'}
      </text>

      {/* Junction markers */}
      {JUNCTIONS.map((j, i) => {
        const pos = junctionPos(j.fromIdx);
        // Determine text-anchor based on position relative to center
        const dx = pos.labelX - cx;
        const anchor = Math.abs(dx) < 5 ? 'middle' : dx > 0 ? 'start' : 'end';
        return (
          <g key={`j-${i}`}>
            {/* Glowing gold diamond marker */}
            <polygon
              points={`${pos.markerX},${pos.markerY - 7} ${pos.markerX + 5},${pos.markerY} ${pos.markerX},${pos.markerY + 7} ${pos.markerX - 5},${pos.markerY}`}
              fill="#d4a853" stroke="#f0d48a" strokeWidth={1}
              filter="url(#glow-gold)"
            />
            {/* Nakshatra label */}
            <text x={pos.labelX} y={pos.labelY} textAnchor={anchor} dominantBaseline="central"
              fill="#f0d48a" fontSize={8} fontWeight="500">
              {locale === 'en' ? j.naksEn : j.naksHi}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {legendItems.map((item, i) => (
        <g key={`leg-${i}`}>
          <rect x={10 + i * 90} y={380} width={10} height={10} rx={2} fill={item.color} />
          <text x={24 + i * 90} y={389} fill="#8a8478" fontSize={9}>{item.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Junction Flow Diagram ─────────────────────────────────────── */
const JUNCTION_DATA = [
  {
    waterEn: 'Pisces', waterHi: 'मीन', fireEn: 'Aries', fireHi: 'मेष',
    naksEn: 'Revati (27) | Ashwini (1)', naksHi: 'रेवती (27) | अश्विनी (1)',
    labelEn: 'Junction 1', labelHi: 'सन्धि 1',
  },
  {
    waterEn: 'Cancer', waterHi: 'कर्क', fireEn: 'Leo', fireHi: 'सिंह',
    naksEn: 'Ashlesha (9) | Magha (10)', naksHi: 'आश्लेषा (9) | मघा (10)',
    labelEn: 'Junction 2', labelHi: 'सन्धि 2',
  },
  {
    waterEn: 'Scorpio', waterHi: 'वृश्चिक', fireEn: 'Sagittarius', fireHi: 'धनु',
    naksEn: 'Jyeshtha (18) | Moola (19)', naksHi: 'ज्येष्ठा (18) | मूल (19)',
    labelEn: 'Junction 3', labelHi: 'सन्धि 3',
  },
];

function JunctionFlow({ locale }: { locale: string }) {
  const isEn = locale === 'en';
  const rowH = 90, padY = 20;
  const svgH = JUNCTION_DATA.length * rowH + padY * 2;
  const waterX = 40, waterW = 110, fireX = 250, fireW = 110, arrowY = 28;

  return (
    <svg viewBox={`0 0 400 ${svgH}`} className="w-full max-w-lg mx-auto" role="img" aria-label="Junction flow diagram showing water to fire transitions">
      <defs>
        <linearGradient id="water-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>
        <linearGradient id="fire-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
          <stop offset="100%" stopColor="rgba(239, 68, 68, 0.3)" />
        </linearGradient>
        <filter id="spark-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {JUNCTION_DATA.map((j, i) => {
        const y = padY + i * rowH;
        const arrowStartX = waterX + waterW + 6;
        const arrowEndX = fireX - 6;
        const arrowMidX = (arrowStartX + arrowEndX) / 2;
        const boxH = 38;

        return (
          <g key={i}>
            {/* Junction label */}
            <text x={200} y={y} textAnchor="middle" fill="#8a8478" fontSize={10} fontWeight="600" letterSpacing="0.05em">
              {isEn ? j.labelEn : j.labelHi}
            </text>

            {/* Water box */}
            <rect x={waterX} y={y + 10} width={waterW} height={boxH} rx={8}
              fill="url(#water-grad)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth={1} />
            {/* Water element indicator (small circle) */}
            <circle cx={waterX + 16} cy={y + arrowY + 2} r={5} fill="rgba(59, 130, 246, 0.5)" />
            <text x={waterX + waterW / 2 + 8} y={y + arrowY + 3} textAnchor="middle" dominantBaseline="central"
              fill="rgba(147, 197, 253, 1)" fontSize={13} fontWeight="600">
              {isEn ? j.waterEn : j.waterHi}
            </text>

            {/* Arrow line */}
            <line x1={arrowStartX} y1={y + arrowY + 2} x2={arrowEndX - 8} y2={y + arrowY + 2}
              stroke="rgba(212, 168, 83, 0.4)" strokeWidth={1.5} strokeDasharray="4 3" />
            {/* Arrowhead */}
            <polygon
              points={`${arrowEndX - 8},${y + arrowY - 2} ${arrowEndX},${y + arrowY + 2} ${arrowEndX - 8},${y + arrowY + 6}`}
              fill="rgba(212, 168, 83, 0.6)" />
            {/* Gold spark at center of arrow */}
            <polygon
              points={`${arrowMidX},${y + arrowY - 5} ${arrowMidX + 4},${y + arrowY + 2} ${arrowMidX},${y + arrowY + 9} ${arrowMidX - 4},${y + arrowY + 2}`}
              fill="#d4a853" filter="url(#spark-glow)" />

            {/* Fire box */}
            <rect x={fireX} y={y + 10} width={fireW} height={boxH} rx={8}
              fill="url(#fire-grad)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth={1} />
            {/* Fire element indicator (small triangle) */}
            <polygon
              points={`${fireX + 16},${y + arrowY - 3} ${fireX + 21},${y + arrowY + 5} ${fireX + 11},${y + arrowY + 5}`}
              fill="rgba(239, 68, 68, 0.5)" />
            <text x={fireX + fireW / 2 + 8} y={y + arrowY + 3} textAnchor="middle" dominantBaseline="central"
              fill="rgba(252, 165, 165, 1)" fontSize={13} fontWeight="600">
              {isEn ? j.fireEn : j.fireHi}
            </text>

            {/* Nakshatra names below */}
            <text x={200} y={y + boxH + 20} textAnchor="middle" fill="#f0d48a" fontSize={10}>
              {isEn ? j.naksEn : j.naksHi}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function GandaMulaModule() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link href="/learn" className="text-sm text-text-secondary hover:text-gold-light transition-colors">
        &larr; {locale === 'en' ? 'Back to Learn' : 'सीखें पर वापस'}
      </Link>

      {/* Title */}
      <motion.div {...fadeInUp} className="text-center my-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={hf}>
          <span className="text-gold-gradient">
            {locale === 'en' ? 'Ganda Mula Nakshatras' : 'गण्ड मूल नक्षत्र'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {locale === 'en'
            ? 'The 6 nakshatras at the water-fire sign junctions — their effects, significance, and remedies'
            : '6 नक्षत्र जो जल-अग्नि राशि सन्धि पर स्थित हैं — प्रभाव, महत्त्व और उपाय'}
        </p>
      </motion.div>

      <GoldDivider />

      {/* Introduction */}
      <motion.section {...fadeInUp} className="my-10">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8" style={bf}>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {locale === 'en' ? 'What are Ganda Mula Nakshatras?' : 'गण्ड मूल नक्षत्र क्या हैं?'}
          </h2>
          <div className="text-text-secondary space-y-4 leading-relaxed">
            {locale === 'en' ? (
              <>
                <p>In Vedic astrology, <strong className="text-gold-primary">Ganda Mula</strong> (also called <em>Mula Nakshatra</em>) refers to <strong>6 specific nakshatras</strong> that fall at the junction points where a water sign transitions into a fire sign. The word "Ganda" means a knot or joint, and "Mula" means root — together signifying a karmic knot at the root of one&apos;s birth.</p>
                <p>These junctions create a turbulent energetic transition. Water (emotion, dissolution) collides with fire (action, creation), producing a powerful but unstable energy at the moment of birth. This is neither inherently good nor bad — it is <strong>intense</strong>.</p>
                <p>The three water-fire junctions in the zodiac are:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Pisces → Aries</strong>: Revati (27) and Ashwini (1)</li>
                  <li><strong>Cancer → Leo</strong>: Ashlesha (9) and Magha (10)</li>
                  <li><strong>Scorpio → Sagittarius</strong>: Jyeshtha (18) and Moola (19)</li>
                </ul>
                <p>Birth in these nakshatras — especially in the <strong>critical padas</strong> closest to the junction — is believed to create challenges for specific family members (father, mother, siblings, in-laws) and requires <strong>Ganda Mula Shanti Puja</strong> to mitigate the effects.</p>
                <p className="text-gold-primary/80 font-semibold">Important: Ganda Mula does not mean the child is cursed. Many great leaders, saints, and achievers were born in these nakshatras. The shanti puja channels the intense energy constructively.</p>
              </>
            ) : (
              <>
                <p>वैदिक ज्योतिष में <strong className="text-gold-primary">गण्ड मूल</strong> (मूल नक्षत्र भी कहा जाता है) उन <strong>6 विशिष्ट नक्षत्रों</strong> को कहते हैं जो जल राशि से अग्नि राशि के संक्रमण बिन्दु पर स्थित हैं। &quot;गण्ड&quot; का अर्थ है गाँठ और &quot;मूल&quot; का अर्थ है जड़ — मिलकर जन्म की जड़ में एक कार्मिक गाँठ।</p>
                <p>ये सन्धियाँ एक अशान्त ऊर्जा संक्रमण उत्पन्न करती हैं। जल (भावना, विलय) अग्नि (क्रिया, सृष्टि) से टकराता है, जन्म के क्षण में एक शक्तिशाली किन्तु अस्थिर ऊर्जा उत्पन्न करता है।</p>
                <p>राशिचक्र में तीन जल-अग्नि सन्धियाँ:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>मीन → मेष</strong>: रेवती (27) और अश्विनी (1)</li>
                  <li><strong>कर्क → सिंह</strong>: आश्लेषा (9) और मघा (10)</li>
                  <li><strong>वृश्चिक → धनु</strong>: ज्येष्ठा (18) और मूल (19)</li>
                </ul>
                <p>इन नक्षत्रों में जन्म — विशेषकर सन्धि के निकटतम <strong>संवेदनशील पादों</strong> में — विशिष्ट परिवार के सदस्यों के लिए चुनौतियाँ उत्पन्न करता है और <strong>गण्ड मूल शान्ति पूजा</strong> आवश्यक होती है।</p>
                <p className="text-gold-primary/80 font-semibold">महत्त्वपूर्ण: गण्ड मूल का अर्थ यह नहीं कि बच्चा अभिशप्त है। अनेक महान नेता, सन्त और उपलब्धिकर्ता इन नक्षत्रों में जन्मे। शान्ति पूजा तीव्र ऊर्जा को रचनात्मक रूप देती है।</p>
              </>
            )}
          </div>
        </div>
      </motion.section>

      <GoldDivider />

      {/* Diagrams Section */}
      <motion.section {...fadeInUp} className="my-10 space-y-8">
        <h2 className="text-2xl font-bold text-gold-light text-center" style={hf}>
          {locale === 'en' ? 'The Three Water-Fire Junctions' : 'तीन जल-अग्नि सन्धियाँ'}
        </h2>
        <ZodiacWheel locale={locale} />
        <JunctionFlow locale={locale} />
      </motion.section>

      <GoldDivider />

      {/* Individual Nakshatra Cards */}
      <div className="space-y-8 my-10">
        {GANDA_MULA.map((nak, idx) => (
          <motion.section
            key={nak.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gold-primary/5 border-b border-gold-primary/10 flex items-center gap-4">
                <NakshatraIconById id={nak.id} size={40} />
                <div>
                  <h3 className="text-xl font-bold text-gold-light" style={hf}>
                    {nak.name[locale === 'en' ? 'en' : 'hi']}
                  </h3>
                  <p className="text-text-secondary text-xs">
                    {nak.sign[locale === 'en' ? 'en' : 'hi']} &mdash; {locale === 'en' ? 'Ruler' : 'स्वामी'}: {nak.ruler[locale === 'en' ? 'en' : 'hi']} &mdash; {locale === 'en' ? 'Deity' : 'देवता'}: {nak.deity[locale === 'en' ? 'en' : 'hi']}
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5" style={bf}>
                {/* Quick facts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg bg-bg-secondary/40 p-3">
                    <div className="text-xs uppercase tracking-wider text-text-secondary/75">{locale === 'en' ? 'Junction' : 'सन्धि'}</div>
                    <div className="text-text-primary mt-0.5">{nak.junction[locale === 'en' ? 'en' : 'hi']}</div>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 p-3">
                    <div className="text-xs uppercase tracking-wider text-text-secondary/75">{locale === 'en' ? 'Affected Relation' : 'प्रभावित सम्बन्ध'}</div>
                    <div className="text-text-primary mt-0.5">{nak.affected[locale === 'en' ? 'en' : 'hi']}</div>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 p-3">
                    <div className="text-xs uppercase tracking-wider text-text-secondary/75">{locale === 'en' ? 'Critical Padas' : 'संवेदनशील पाद'}</div>
                    <div className="text-red-400 font-semibold mt-0.5">{locale === 'en' ? 'Pada' : 'पाद'} {nak.criticalPadas}</div>
                  </div>
                </div>

                {/* Effects */}
                <div>
                  <h4 className="text-sm font-bold text-gold-primary uppercase tracking-wider mb-2">{locale === 'en' ? 'Effects & Significance' : 'प्रभाव और महत्त्व'}</h4>
                  <p className="text-text-secondary leading-relaxed text-sm">{nak.effects[locale === 'en' ? 'en' : 'hi']}</p>
                </div>

                {/* Upayas */}
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-5">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">{locale === 'en' ? 'Upayas (Remedies)' : 'उपाय'}</h4>
                  <ol className="space-y-2 text-sm text-text-secondary">
                    {(locale === 'en' ? nak.upayas.en : nak.upayas.hi).map((upaya, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-400/60 font-mono shrink-0">{i + 1}.</span>
                        <span>{upaya}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <GoldDivider />

      {/* General remedies */}
      <motion.section {...fadeInUp} className="my-10">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8" style={bf}>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {locale === 'en' ? 'General Ganda Mula Shanti Vidhi' : 'सामान्य गण्ड मूल शान्ति विधि'}
          </h2>
          <div className="text-text-secondary space-y-3 leading-relaxed text-sm">
            {locale === 'en' ? (
              <>
                <p>Regardless of which Ganda Mula nakshatra the child is born in, the following general procedure is recommended:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li><strong>Timing:</strong> The Shanti Puja should ideally be performed on the <strong>27th day</strong> after birth, when the Moon returns to the same nakshatra. If not possible, perform it at the earliest auspicious Muhurta.</li>
                  <li><strong>Priest:</strong> Engage a qualified Vedic priest (Purohit) who knows the specific Nakshatra Shanti procedures from Dharmashastra.</li>
                  <li><strong>Havan:</strong> Perform a Havan (fire ceremony) with specific Samidha (firewood), ghee, and grains. The mantras are nakshatra-specific.</li>
                  <li><strong>Daan (Donation):</strong> Donate items associated with the nakshatra lord (Ketu: cow, blankets, seven grains; Mercury: green cloth, books, moong dal).</li>
                  <li><strong>Mantra Japa:</strong> Complete the specified count of the nakshatra lord&apos;s beej mantra (typically 9,000 for Mercury or 17,000 for Ketu).</li>
                  <li><strong>Separation period:</strong> The affected family member (father, mother, elder sibling, etc.) traditionally avoids seeing the newborn for 12-27 days depending on the pada severity.</li>
                  <li><strong>Ongoing:</strong> Annual observance on the birth nakshatra day with small puja and charity is beneficial for life.</li>
                </ol>
              </>
            ) : (
              <>
                <p>बच्चा किसी भी गण्ड मूल नक्षत्र में जन्मा हो, निम्न सामान्य विधि अनुशंसित है:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li><strong>समय:</strong> शान्ति पूजा जन्म के <strong>27वें दिन</strong> करनी चाहिए, जब चन्द्रमा उसी नक्षत्र में लौटता है। यदि सम्भव न हो, शीघ्रातिशीघ्र शुभ मुहूर्त में करें।</li>
                  <li><strong>पुरोहित:</strong> योग्य वैदिक पुरोहित जो धर्मशास्त्र से नक्षत्र शान्ति विधि जानते हों।</li>
                  <li><strong>हवन:</strong> विशिष्ट समिधा, घी और अनाज के साथ हवन। मन्त्र नक्षत्र-विशिष्ट हैं।</li>
                  <li><strong>दान:</strong> नक्षत्र स्वामी से सम्बद्ध वस्तुएँ (केतु: गाय, कम्बल, सप्तधान्य; बुध: हरा वस्त्र, पुस्तकें, मूंग दाल)।</li>
                  <li><strong>मन्त्र जप:</strong> नक्षत्र स्वामी के बीज मन्त्र की निर्धारित संख्या पूर्ण करें।</li>
                  <li><strong>पृथक्करण काल:</strong> प्रभावित परिवार का सदस्य पारम्परिक रूप से 12-27 दिनों तक नवजात को नहीं देखता।</li>
                  <li><strong>निरन्तर:</strong> जन्म नक्षत्र दिवस पर वार्षिक छोटी पूजा और दान जीवनभर लाभकारी।</li>
                </ol>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
