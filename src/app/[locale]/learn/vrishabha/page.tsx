'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import ClassicalReference from '@/components/learn/ClassicalReference';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'वृषभ', transliteration: 'Vrishabha', meaning: { en: 'The Bull — the second sign, symbol of strength, stability, and material abundance', hi: 'वृषभ — द्वितीय राशि, शक्ति, स्थिरता और भौतिक समृद्धि का प्रतीक' } },
  { devanagari: 'पृथ्वी तत्त्व', transliteration: 'Prithvi Tattva', meaning: { en: 'Earth element — grounding, nourishing, stable, material', hi: 'पृथ्वी तत्त्व — भूमिकारक, पोषक, स्थिर, भौतिक' } },
  { devanagari: 'स्थिर राशि', transliteration: 'Sthira Rashi', meaning: { en: 'Fixed sign — sustains, preserves, and consolidates what was initiated', hi: 'स्थिर राशि — जो आरम्भ हुआ उसे बनाये रखती, संरक्षित करती और सुदृढ़ करती है' } },
  { devanagari: 'शुक्र क्षेत्र', transliteration: 'Shukra Kshetra', meaning: { en: 'Domain of Venus — Vrishabha is the nocturnal home of Venus', hi: 'शुक्र का क्षेत्र — वृषभ शुक्र का रात्रिकालीन गृह' } },
  { devanagari: 'उच्च चन्द्र', transliteration: 'Uchcha Chandra', meaning: { en: 'Exalted Moon — the Moon reaches its highest dignity at 3° Vrishabha', hi: 'उच्च चन्द्र — चन्द्रमा 3° वृषभ पर सर्वोच्च गरिमा' } },
  { devanagari: 'वैश्य', transliteration: 'Vaishya', meaning: { en: 'The merchant class — Vrishabha embodies wealth creation, trade, and material stewardship', hi: 'वैश्य वर्ण — वृषभ धन सृजन, व्यापार और भौतिक प्रबन्धन का मूलरूप' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Earth (Prithvi)', hi: 'पृथ्वी तत्त्व' },
  modality: { en: 'Fixed (Sthira)', hi: 'स्थिर (Fixed)' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्री (स्त्रीलिंग)' },
  ruler: { en: 'Venus (Shukra)', hi: 'शुक्र' },
  symbol: { en: 'The Bull', hi: 'वृषभ (बैल)' },
  degreeRange: { en: '30° to 60° of the zodiac', hi: 'राशि चक्र का 30° से 60°' },
  direction: { en: 'South (Dakshina)', hi: 'दक्षिण दिशा' },
  season: { en: 'Vasanta (Spring — latter half)', hi: 'वसन्त ऋतु (उत्तरार्ध)' },
  color: { en: 'White / Cream', hi: 'श्वेत / मलाई' },
  bodyPart: { en: 'Face, throat, neck, vocal cords, cervical spine', hi: 'मुख, कण्ठ, गर्दन, स्वर तन्तु, ग्रीवा मेरुदण्ड' },
  caste: { en: 'Vaishya (Merchant)', hi: 'वैश्य' },
  nature: { en: 'Saumya (Gentle/Benefic)', hi: 'सौम्य (शान्त/शुभ)' },
};

// ─── Nakshatras in Vrishabha ───────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Krittika (Padas 2-4)', hi: 'कृत्तिका (पाद 2-4)' },
    range: { en: '30° - 40° (0°-10° Vrishabha)', hi: '30° - 40° (0°-10° वृषभ)' },
    ruler: { en: 'Sun', hi: 'सूर्य' },
    deity: { en: 'Agni (God of Fire)', hi: 'अग्नि देव' },
    qualities: { en: 'The fire of purification in the earth sign — these padas produce natives who are materially ambitious yet morally sharp. Krittika in Taurus has the cutting discrimination of the Sun applied to practical matters: food quality, financial integrity, and aesthetic standards. The native is an excellent judge of value — they know real gold from fool\'s gold. Can be harshly critical of anything that falls below their standards. Strong appetite, commanding voice, and a penetrating gaze that sees through pretense.', hi: 'पृथ्वी राशि में शुद्धिकरण की अग्नि — ये पाद भौतिक महत्त्वाकांक्षी किन्तु नैतिक रूप से तीक्ष्ण जातक बनाते हैं। वृषभ में कृत्तिका व्यावहारिक विषयों पर सूर्य का छेदक विवेक: खाद्य गुणवत्ता, वित्तीय ईमानदारी, सौन्दर्य मानक। मूल्य का उत्कृष्ट निर्णायक। सशक्त भूख, आधिकारिक स्वर।' },
  },
  {
    name: { en: 'Rohini', hi: 'रोहिणी' },
    range: { en: '40° - 53°20\' (10°-23°20\' Vrishabha)', hi: '40° - 53°20\' (10°-23°20\' वृषभ)' },
    ruler: { en: 'Moon', hi: 'चन्द्रमा' },
    deity: { en: 'Brahma (Creator God) / Prajapati', hi: 'ब्रह्मा (सृष्टिकर्ता) / प्रजापति' },
    qualities: { en: 'The crown jewel of the lunar mansions — Rohini is considered the most beautiful and fertile nakshatra. The Moon is exalted in this region, making it the most emotionally nourishing placement in the entire zodiac. Natives are physically attractive with expressive eyes, sensual presence, and a natural magnetism that draws others. Exceptional talent in music, dance, art, and any creative field. Material prosperity comes naturally. Rohini was the Moon\'s favorite wife among the 27 nakshatra-wives — symbolizing the soul\'s deepest comfort zone. Can be possessive, luxury-addicted, and resistant to change.', hi: 'चन्द्र भवनों का मुकुट रत्न — रोहिणी सबसे सुन्दर और उर्वर नक्षत्र। इस क्षेत्र में चन्द्र उच्च, सम्पूर्ण राशि चक्र में सबसे भावनात्मक रूप से पोषक स्थिति। जातक शारीरिक रूप से आकर्षक — अभिव्यंजक नेत्र, कामुक उपस्थिति, स्वाभाविक आकर्षण। संगीत, नृत्य, कला में असाधारण प्रतिभा। भौतिक समृद्धि स्वाभाविक। अधिकारी, विलासिता-आसक्त।' },
  },
  {
    name: { en: 'Mrigashira (Padas 1-2)', hi: 'मृगशिरा (पाद 1-2)' },
    range: { en: '53°20\' - 60° (23°20\'-30° Vrishabha)', hi: '53°20\' - 60° (23°20\'-30° वृषभ)' },
    ruler: { en: 'Mars', hi: 'मंगल' },
    deity: { en: 'Soma (Moon God / Sacred Plant)', hi: 'सोम (चन्द्र देव / पवित्र वनस्पति)' },
    qualities: { en: 'The searching deer — Mrigashira\'s first two padas in Taurus combine Mars\' active seeking with Venus\' sensual appreciation. The native is eternally curious about beautiful things: fine food, music, art, nature, and romantic partners. The deer symbolizes gentle alertness — always searching, always moving toward the next beautiful experience. Good for perfumery, gastronomy, textile design, and botanical research. Can be restless within relationships, always wondering if something better exists. The Mars rulership adds a competitive edge to an otherwise gentle placement.', hi: 'खोजी मृग — वृषभ में मृगशिरा के प्रथम दो पाद मंगल की सक्रिय खोज और शुक्र की इन्द्रिय रसज्ञता का संयोग। जातक सुन्दर वस्तुओं के प्रति शाश्वत जिज्ञासु: उत्कृष्ट भोजन, संगीत, कला, प्रकृति। सुगन्ध विज्ञान, पाकशास्त्र, वस्त्र डिज़ाइन के लिए शुभ। सम्बन्धों में अस्थिर — सदा बेहतर की खोज।' },
  },
];

// ─── Planetary Dignities ───────────────────────────────────────────────
const PLANETARY_DIGNITIES = {
  exalted: [
    { planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' }, degree: { en: '3° Vrishabha', hi: '3° वृषभ' }, effect: { en: 'The Moon is exalted in Taurus — the mind finds its deepest peace in the garden of Venus. This is the most emotionally stable, sensually fulfilled, and materially contented Moon placement. The native has a calm, nurturing disposition, excellent taste in food and art, and a natural ability to create comfort for themselves and others. The mother is typically gentle, beautiful, and materially prosperous. Memory is exceptional — they remember textures, flavors, melodies, and emotional nuances that others miss. The 3° point is where lunar receptivity is at absolute maximum.', hi: 'चन्द्रमा वृषभ में उच्च — मन शुक्र के उपवन में गहनतम शान्ति पाता है। सर्वाधिक भावनात्मक रूप से स्थिर, इन्द्रिय-तृप्त और भौतिक रूप से सन्तुष्ट चन्द्र स्थिति। शान्त, पोषक स्वभाव, उत्कृष्ट रसज्ञता। माता प्रायः सौम्य, सुन्दर और भौतिक रूप से समृद्ध। 3° अंश पर चन्द्र ग्राह्यता चरम।' } },
    { planet: { en: 'Rahu', hi: 'राहु' }, degree: { en: 'Vrishabha (full sign)', hi: 'वृषभ (पूर्ण राशि)' }, effect: { en: 'Rahu is considered exalted in Taurus by many classical authorities. The shadow planet of insatiable desire in the sign of material abundance creates an extraordinary drive for wealth, luxury, and sensual experience. The native may accumulate great riches through unconventional means — foreign trade, technology, entertainment, or industries that were nonexistent before. Rahu here amplifies Venusian qualities to extreme levels: extraordinary beauty, magnetic charm, or artistic genius that breaks conventional boundaries.', hi: 'अनेक शास्त्रीय प्राधिकारियों के अनुसार राहु वृषभ में उच्च। भौतिक समृद्धि की राशि में अतृप्त इच्छा का छाया ग्रह धन, विलासिता और इन्द्रिय अनुभव की असाधारण प्रेरणा। अपरम्परागत माध्यमों से महान सम्पत्ति — विदेशी व्यापार, प्रौद्योगिकी, मनोरंजन। शुक्र गुणों को चरम तक बढ़ाता है।' } },
  ],
  debilitated: [
    { planet: { en: 'Ketu', hi: 'केतु' }, degree: { en: 'Vrishabha (full sign)', hi: 'वृषभ (पूर्ण राशि)' }, effect: { en: 'Ketu is debilitated in Taurus — the planet of detachment in the sign that values attachment to material comfort. The native may feel disconnected from physical pleasures, unable to enjoy food, beauty, or sensual experience despite being surrounded by abundance. Financial losses through spiritual negligence or detachment from practical matters. However, this placement can produce profound spiritual advancement when the native consciously releases attachment to material security and finds inner peace independent of external comfort.', hi: 'केतु वृषभ में नीच — भौतिक सुख से आसक्ति की राशि में वैराग्य का ग्रह। जातक शारीरिक सुखों से विलग — समृद्धि से घिरे होने पर भी भोजन, सौन्दर्य या इन्द्रिय अनुभव का आनन्द न ले पाना। भौतिक सुरक्षा से आसक्ति त्यागने पर गहन आध्यात्मिक प्रगति सम्भव।' } },
  ],
  ownSign: [
    { planet: { en: 'Venus (Shukra)', hi: 'शुक्र' }, range: { en: '30° - 60° (full sign)', hi: '30° - 60° (पूर्ण राशि)' }, effect: { en: 'Venus rules Taurus — the goddess of beauty in her garden. This is Venus at her most grounded and productive. While Venus in Libra is the artist and diplomat, Venus in Taurus is the farmer, the chef, the singer, and the craftsman. The native creates tangible beauty — objects you can touch, food you can taste, music that vibrates through the body. Material prosperity comes naturally through Venus\'s grace, but it is earned through steady effort rather than luck. The voice is often melodious and the physical form attractive.', hi: 'शुक्र वृषभ का स्वामी — सौन्दर्य की देवी अपने उपवन में। सबसे भूमिगत और उत्पादक शुक्र। वृषभ में शुक्र कृषक, रसोइया, गायक और शिल्पकार। जातक स्पर्शनीय सौन्दर्य रचता है। भौतिक समृद्धि स्वाभाविक किन्तु स्थिर प्रयास से। स्वर प्रायः मधुर और शारीरिक रूप आकर्षक।' } },
    { planet: { en: 'Moon (Chandra) — Moolatrikona', hi: 'चन्द्रमा — मूलत्रिकोण' }, range: { en: '4° - 20° Vrishabha', hi: '4° - 20° वृषभ' }, effect: { en: 'The Moon has its moolatrikona in Taurus from 4° to 20°, overlapping significantly with Rohini nakshatra. This is where the mind operates at its most balanced: emotionally stable, aesthetically sensitive, and practically grounded. The native in this range has excellent emotional intelligence — they sense others\' needs instinctively and create environments of comfort and beauty. This is the ideal placement for counselors, chefs, musicians, interior designers, and anyone whose work requires emotional attunement combined with practical skill.', hi: 'चन्द्रमा का मूलत्रिकोण वृषभ में 4° से 20° — रोहिणी नक्षत्र से महत्त्वपूर्ण अतिव्यापन। मन सर्वाधिक सन्तुलित: भावनात्मक रूप से स्थिर, सौन्दर्यबोधी, व्यावहारिक। उत्कृष्ट भावनात्मक बुद्धि — दूसरों की आवश्यकताओं को सहज अनुभव। परामर्शदाता, रसोइया, संगीतकार, आन्तरिक डिज़ाइनर के लिए आदर्श स्थिति।' } },
  ],
};

// ─── Each Planet in Vrishabha ──────────────────────────────────────────
const PLANETS_IN_SIGN: { planet: ML; dignity: string; effect: ML }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Neutral',
    effect: { en: 'The Sun in Venus\'s earth sign — the king in the treasury. Authority is expressed through material accomplishment rather than martial conquest. The native earns respect through wealth, aesthetic achievement, and the ability to provide. The father may be connected to finance, agriculture, or the arts. Government roles involving treasury, taxation, or natural resources suit this placement. The solar ego attaches to possessions and status symbols. Can be stubborn about values and resistant to financial risk. The voice carries authority — excellent for public speaking and singing.', hi: 'शुक्र की पृथ्वी राशि में सूर्य — कोषागार में राजा। भौतिक उपलब्धि से अधिकार व्यक्त। धन, सौन्दर्य उपलब्धि और प्रदान करने की क्षमता से सम्मान। पिता वित्त, कृषि या कला से सम्बद्ध। कोषागार, कराधान सम्बन्धी शासकीय भूमिकाएँ उपयुक्त। स्वर में अधिकार — लोक वक्तृत्व और गायन के लिए उत्कृष्ट।' },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' },
    dignity: 'Exalted (3°) / Moolatrikona (4°-20°)',
    effect: { en: 'The Moon reaches its absolute peak in Taurus — the mind is at its most peaceful, receptive, and emotionally balanced. The native has an almost preternatural calm that soothes everyone around them. Taste, both literal and aesthetic, is refined and reliable. Memory is extraordinary — they remember flavors, fragrances, melodies, and emotional textures that others forget. The mother is typically nurturing, beautiful, and materially comfortable. Material security is essential for emotional wellbeing — poverty creates severe anxiety. Exceptional talent for cooking, gardening, music, textile arts, and any work that transforms raw material into beauty.', hi: 'चन्द्रमा वृषभ में अपने शिखर पर — मन सर्वाधिक शान्त, ग्राही और भावनात्मक रूप से सन्तुलित। जातक की अलौकिक शान्ति सबको सुखद। स्वाद और सौन्दर्यबोध परिष्कृत। असाधारण स्मृति — स्वाद, सुगन्ध, धुन। माता पोषक, सुन्दर और भौतिक रूप से सम्पन्न। पाकशास्त्र, बागवानी, संगीत में असाधारण प्रतिभा।' },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Neutral',
    effect: { en: 'Mars in Venus\'s earth sign directs aggressive energy toward material acquisition and physical pleasure. The native fights for wealth, property, and sensual enjoyment with stubborn determination. Once they decide they want something, they pursue it with bulldozer-like persistence. Excellent for real estate, agriculture, construction, food industry, and any career requiring physical stamina applied to material production. Can be possessive, jealous, and materialistic. Domestic arguments over money and possessions are common. Physical stamina is exceptional — these are the marathon runners, not the sprinters.', hi: 'शुक्र की पृथ्वी राशि में मंगल भौतिक अर्जन और शारीरिक सुख की ओर आक्रामक ऊर्जा। धन, सम्पत्ति और इन्द्रिय सुख के लिए हठी दृढ़ संकल्प। भूसम्पत्ति, कृषि, निर्माण, खाद्य उद्योग के लिए उत्कृष्ट। अधिकारी, ईर्ष्यालु और भौतिकवादी। असाधारण शारीरिक सहनशक्ति — ये मैराथन धावक हैं, स्प्रिंटर नहीं।' },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Friend\'s sign',
    effect: { en: 'Mercury in Venus\'s sign — the intellect applied to beautiful and practical matters. The native thinks in concrete terms: numbers, textures, flavors, and tangible outcomes. Excellent business sense with a talent for negotiation that combines charm with practical calculation. Writing style is sensual and evocative — they describe physical experiences vividly. Good for finance, accounting, luxury goods marketing, food criticism, agricultural science, and landscape architecture. The voice is pleasant and communication style is deliberate rather than rapid. Can be mentally stubborn, refusing to change opinions once formed.', hi: 'शुक्र की राशि में बुध — सुन्दर और व्यावहारिक विषयों पर बुद्धि। ठोस शब्दों में विचार: संख्या, बनावट, स्वाद, स्पर्शनीय परिणाम। उत्कृष्ट व्यापारिक समझ — आकर्षण और व्यावहारिक गणना का मिश्रण। वित्त, लेखा, विलासिता विपणन, खाद्य आलोचना के लिए शुभ। स्वर सुखद और संवाद शैली विचारशील।' },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)' },
    dignity: 'Neutral',
    effect: { en: 'Jupiter in Taurus expands material abundance — the teacher in the treasury. Wealth grows through ethical means, educational ventures, and wise investment. The native has a generous, abundant philosophy of life: there is enough for everyone, and sharing increases rather than diminishes prosperity. Knowledge is applied practically — they learn what they can use, not abstract theory. Excellent for banking, investment advising, agricultural education, culinary arts education, and philanthropy. Children tend to be materially fortunate. The body tends toward fullness and the appetite toward richness. Can be overindulgent and complacent about spiritual growth.', hi: 'वृषभ में गुरु भौतिक समृद्धि विस्तारित — कोषागार में शिक्षक। नैतिक माध्यमों, शैक्षिक उद्यमों और बुद्धिमान निवेश से धन वृद्धि। उदार, प्रचुर जीवन दर्शन। बैंकिंग, निवेश परामर्श, कृषि शिक्षा, पाक कला और परोपकार के लिए उत्कृष्ट। अत्यधिक भोग और आध्यात्मिक विकास में आत्मसन्तुष्टि सम्भव।' },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Own sign',
    effect: { en: 'Venus in her own earthy home — the goddess tending her garden. This is Venus at maximum groundedness: beauty is not abstract but tangible — handcrafted objects, prepared food, cultivated flowers, a well-designed home. The native has extraordinary aesthetic sense applied to material reality. Wealth accumulates steadily through creative and artistic endeavors. Relationships are loyal, sensual, and deeply committed — they love with their whole body, not just their mind. The voice is often remarkably beautiful. Can be possessive in love, resistant to change, and addicted to comfort. Marriage is typically stable and materially prosperous.', hi: 'शुक्र अपने पार्थिव गृह में — देवी अपने उपवन की सेवा करती हुई। अधिकतम भूमिगत शुक्र: सौन्दर्य स्पर्शनीय — हस्तनिर्मित वस्तुएँ, तैयार भोजन, उपजाये पुष्प। भौतिक वास्तविकता पर असाधारण सौन्दर्यबोध। सृजनात्मक और कलात्मक प्रयासों से स्थिर धन संचय। सम्बन्ध निष्ठावान, कामुक और गहन। स्वर प्रायः अद्भुत सुन्दर।' },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Friend\'s sign',
    effect: { en: 'Saturn in Venus\'s earth sign — discipline applied to material accumulation. The native builds wealth slowly but surely, stone by stone, year by year. Nothing is wasted, nothing is rushed. Excellent for architecture, civil engineering, mining, agriculture at industrial scale, and any long-term material enterprise. The body is strong but may age with stiffness in the neck and throat. The voice may be deep, slow, and deliberate. Relationships are serious and long-lasting — they marry for security and stay for duty. Can be excessively frugal, emotionally cold, and resistant to pleasure. Financial security comes late but is rock-solid when it arrives.', hi: 'शुक्र की पृथ्वी राशि में शनि — भौतिक संचय पर अनुशासन। जातक धीरे किन्तु निश्चित रूप से धन निर्माण — पत्थर दर पत्थर, वर्ष दर वर्ष। वास्तुकला, सिविल अभियान्त्रिकी, खनन, औद्योगिक कृषि के लिए उत्कृष्ट। सम्बन्ध गम्भीर और दीर्घकालिक। अत्यधिक मितव्ययी और सुख-विरोधी। वित्तीय सुरक्षा देर से किन्तु सुदृढ़।' },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Exalted (per many authorities)',
    effect: { en: 'Rahu exalted in Taurus — the insatiable appetite in the sign of abundance. The native desires wealth, luxury, and sensual experience beyond all conventional limits. They may accumulate extraordinary riches through foreign connections, technology, entertainment, or industries that disrupt traditional markets. Beauty and charm are amplified to almost supernatural levels — movie stars, models, and cultural icons often have this placement. Can create obsessive attachment to material possessions, addictive consumption patterns, and relationships driven by physical attraction rather than emotional depth. When spiritualized, transforms desire into appreciation and abundance into generosity.', hi: 'राहु वृषभ में उच्च — प्रचुरता की राशि में अतृप्त भूख। जातक सभी परम्परागत सीमाओं से परे धन, विलासिता और इन्द्रिय अनुभव चाहता है। विदेशी सम्पर्क, प्रौद्योगिकी, मनोरंजन से असाधारण सम्पत्ति। सौन्दर्य और आकर्षण लगभग अलौकिक स्तर तक। भौतिक वस्तुओं के प्रति जुनूनी आसक्ति सम्भव।' },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Debilitated (per many authorities)',
    effect: { en: 'Ketu debilitated in Taurus — the monk in the marketplace. The planet of spiritual detachment struggles in the sign that values material attachment above all. The native may feel fundamentally disconnected from physical pleasures — food tastes bland, music fails to move, beauty seems hollow. Financial losses through neglect or unworldly decisions are possible. The throat and vocal cords may be affected — speech impediments or a strangely flat voice. However, this placement holds profound spiritual potential: by releasing attachment to material security, the native can achieve genuine inner freedom that no amount of wealth could provide. Past-life wealth creates present-life indifference to money.', hi: 'केतु वृषभ में नीच — बाज़ार में सन्यासी। भौतिक आसक्ति की राशि में आध्यात्मिक वैराग्य का ग्रह। जातक शारीरिक सुखों से मूलभूत रूप से विलग — भोजन स्वादहीन, संगीत प्रभावहीन। उपेक्षा से वित्तीय हानि। कण्ठ और स्वर तन्तु प्रभावित। भौतिक सुरक्षा से आसक्ति त्यागने पर गहन आध्यात्मिक सम्भावना।' },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY = {
  appearance: { en: 'Classical texts describe Vrishabha natives as having a strong, well-built frame with broad shoulders, a thick neck, and a tendency toward heaviness with age. The face is typically round or square with large, soft, expressive eyes — often described as "bovine" in their gentle beauty. Lips are full, the complexion is fair or glowing, and the overall impression is one of solidity and sensual appeal. The walk is slow and deliberate — they move like they own the ground beneath them. Hair tends to be thick and lustrous.', hi: 'शास्त्रीय ग्रन्थ वृषभ जातकों को सशक्त, सुनिर्मित काया — चौड़े कन्धे, मोटी गर्दन, आयु के साथ भारीपन बताते हैं। चेहरा गोल या वर्गाकार — बड़े, कोमल, अभिव्यंजक नेत्र। ओष्ठ भरे, वर्ण गोरा या दीप्तिमान। चाल धीमी और विचारशील — जैसे पृथ्वी उनकी हो। केश घने और चमकदार।' },
  strengths: { en: 'Patience, reliability, determination, financial acumen, aesthetic sensibility, loyalty in relationships, physical endurance, nurturing nature, practical wisdom, steady work ethic, ability to create comfort and beauty in any environment, exceptional taste in food and art, and the rare gift of making others feel safe and grounded.', hi: 'धैर्य, विश्वसनीयता, दृढ़ संकल्प, वित्तीय कुशाग्रता, सौन्दर्य संवेदनशीलता, सम्बन्धों में निष्ठा, शारीरिक सहनशक्ति, पोषक स्वभाव, व्यावहारिक बुद्धि, स्थिर कार्य नैतिकता, किसी भी वातावरण में सुख और सौन्दर्य रचने की क्षमता।' },
  weaknesses: { en: 'Stubbornness (the defining Taurus shadow), possessiveness in relationships, materialism, resistance to change, laziness when unstimulated, jealousy, overindulgence in food and drink, inability to let go of people or possessions past their time, complacency, and a tendency to equate self-worth with net worth.', hi: 'हठ (वृषभ की प्रमुख छाया), सम्बन्धों में अधिकार-भावना, भौतिकवाद, परिवर्तन-प्रतिरोध, उत्तेजना के बिना आलस्य, ईर्ष्या, भोजन-पेय में अत्यधिक भोग, व्यक्तियों या वस्तुओं को उनके समय के बाद भी न छोड़ पाना, और आत्ममूल्य को सम्पत्ति से जोड़ना।' },
  temperament: { en: 'Kapha-dominant (earth-water). Cool, steady, nurturing, but sluggish when imbalanced. The bull is famously patient — it takes enormous provocation to anger a Taurus native. But once angered, the fury is terrifying and unstoppable. They don\'t hold grudges silently like Scorpio; they charge like the bull they are, horns lowered, destroying everything in their path. The remedy is physical activity, dietary discipline, and environments that stimulate without overwhelming. Sedentary luxury makes them stagnant; productive labor makes them magnificent.', hi: 'कफ प्रधान (पृथ्वी-जल)। शीतल, स्थिर, पोषक, किन्तु असन्तुलन में मन्द। बैल प्रसिद्ध रूप से धैर्यवान — वृषभ जातक को क्रोधित करने में अत्यधिक उकसावा। किन्तु एक बार क्रोधित होने पर क्रोध भयंकर और अरोक्य। बैठे रहने की विलासिता स्थिरता लाती है; उत्पादक श्रम भव्यता।' },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER = {
  suited: { en: 'Banking, finance, and investment management, real estate development and architecture, agriculture and food production, restaurant and hospitality industry, music and vocal arts, jewelry and gemstone trade, textile and fashion design, perfumery and cosmetics, interior design and landscaping, art dealing and auction houses, wine and spirits industry, luxury goods retail, veterinary medicine, and botanical research.', hi: 'बैंकिंग, वित्त और निवेश प्रबन्धन, भूसम्पत्ति विकास और वास्तुकला, कृषि और खाद्य उत्पादन, रेस्तराँ और आतिथ्य उद्योग, संगीत और स्वर कला, रत्न व्यापार, वस्त्र और फ़ैशन डिज़ाइन, सुगन्ध और सौन्दर्य प्रसाधन, आन्तरिक डिज़ाइन, कला विक्रय, विलासिता खुदरा, पशु चिकित्सा।' },
  workStyle: { en: 'Vrishabha natives work at a steady, sustainable pace — they are the tortoise that beats the hare. They need a comfortable workspace (good chair, pleasant temperature, perhaps background music) and dislike chaos, noise, and disruption. They excel in long-term projects that require patience and attention to quality. Deadlines stress them — they prefer to set their own rhythm. They are excellent team members when valued and compensated fairly, but become passive-aggressive when they feel exploited. Their greatest professional strength is the ability to turn raw material into finished beauty, whether that material is flour, fabric, stone, or sound.', hi: 'वृषभ जातक स्थिर, सतत गति से कार्य करते हैं — कछुआ जो खरगोश को हराता है। आरामदायक कार्यस्थल चाहिए। दीर्घकालिक परियोजनाओं में उत्कृष्ट जिनमें धैर्य और गुणवत्ता आवश्यक। सम्मान मिलने पर उत्कृष्ट सहयोगी। सबसे बड़ी व्यावसायिक शक्ति: कच्चे माल को तैयार सौन्दर्य में बदलना।' },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: [
    { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, reason: { en: 'Earth-earth trine harmony — shared practicality, attention to quality, and appreciation for tangible results. Virgo\'s analytical precision complements Taurus\'s sensual appreciation. Both signs value cleanliness, order, and quality over quantity. Mercury-Venus friendship ensures smooth communication. Together they create beautifully organized, materially abundant lives. The relationship may lack excitement but never lacks stability.', hi: 'पृथ्वी-पृथ्वी त्रिकोण — साझा व्यावहारिकता, गुणवत्ता ध्यान और स्पर्शनीय परिणामों की सराहना। कन्या की विश्लेषणात्मक सटीकता वृषभ की इन्द्रिय रसज्ञता की पूरक। बुध-शुक्र मैत्री सुचारु संवाद। स्थिरता कभी कमी नहीं।' } },
    { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, reason: { en: 'Adjacent signs with deep natural affinity — Moon is exalted in Taurus and rules Cancer, creating an emotional-material axis of extraordinary nurturing power. Both signs prioritize home, family, and emotional security. Cancer\'s emotional depth complements Taurus\'s material steadiness. Together they create the warmest, most nurturing home environment in the zodiac. The relationship revolves around food, family, and creating a safe haven.', hi: 'गहन स्वाभाविक आत्मीयता — चन्द्र वृषभ में उच्च और कर्क का स्वामी, असाधारण पोषक शक्ति की भावनात्मक-भौतिक धुरी। दोनों गृह, परिवार और भावनात्मक सुरक्षा को प्राथमिकता। राशि चक्र का सबसे गर्म, सबसे पोषक गृह वातावरण।' } },
  ],
  challenging: [
    { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, reason: { en: 'Fixed square tension — both are stubborn and neither will yield. Taurus wants comfort and stability; Leo wants admiration and drama. Venus-Sun friction can create power struggles over money (Taurus saves, Leo spends) and lifestyle (Taurus prefers quiet evenings, Leo demands social display). However, both signs are fiercely loyal, and when they find common ground — usually around family pride and material achievement — they form an unbreakable alliance.', hi: 'स्थिर वर्ग तनाव — दोनों हठी और कोई नहीं झुकता। वृषभ सुख और स्थिरता, सिंह प्रशंसा और नाटक। शुक्र-सूर्य घर्षण — धन और जीवनशैली पर सत्ता संघर्ष। किन्तु दोनों अत्यन्त निष्ठावान — पारिवारिक गर्व पर सहमत होने पर अटूट गठबन्धन।' } },
    { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, reason: { en: 'Fixed opposition — the most fundamental clash of values in the zodiac. Taurus values personal possessions, Aquarius values collective sharing. Taurus clings to tradition, Aquarius demands revolution. Venus\'s sensual comfort versus Saturn\'s austere idealism. Both are immovably stubborn. Compromise feels like surrender to both sides. However, this axis teaches the balance between personal security and social responsibility — between having and sharing, between tradition and progress.', hi: 'स्थिर विरोध — राशि चक्र में मूल्यों का सबसे मूलभूत संघर्ष। वृषभ व्यक्तिगत सम्पत्ति, कुम्भ सामूहिक बँटवारा। वृषभ परम्परा से चिपटता, कुम्भ क्रान्ति माँगता। दोनों अचल रूप से हठी। किन्तु यह धुरी व्यक्तिगत सुरक्षा और सामाजिक उत्तरदायित्व का सन्तुलन सिखाती है।' } },
  ],
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES = {
  deity: { en: 'Goddess Lakshmi and Lord Krishna are the primary deities for Vrishabha natives. Lakshmi embodies Venus\'s grace — beauty, abundance, and prosperity flowing from devotion. Krishna, the divine cowherd who played in Vrindavan, directly connects to the bull/cow symbolism of Taurus and represents the highest expression of Venusian qualities: divine love, artistic beauty (the flute), and the ability to enjoy material creation without attachment.', hi: 'देवी लक्ष्मी और भगवान कृष्ण वृषभ जातकों के प्रमुख देवता। लक्ष्मी शुक्र की कृपा — भक्ति से प्रवाहित सौन्दर्य, प्रचुरता और समृद्धि। कृष्ण दिव्य गोपाल — वृन्दावन में क्रीड़ा, वृषभ के गोवंश प्रतीकवाद से सीधा सम्बन्ध, शुक्र गुणों की सर्वोच्च अभिव्यक्ति: दिव्य प्रेम, कलात्मक सौन्दर्य (वंशी)।' },
  mantra: { en: 'The Venus beej mantra "Om Draam Dreem Draum Sah Shukraya Namah" should be chanted 16,000 times during Venus hora on Fridays. For daily practice, chant 108 times. The Shri Suktam (hymn to Lakshmi from the Rig Veda) recited on Fridays brings both spiritual and material abundance.', hi: 'शुक्र बीज मन्त्र "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः" शुक्रवार को शुक्र होरा में 16,000 बार। दैनिक अभ्यास में 108 बार। श्री सूक्तम् (ऋग्वेद से लक्ष्मी स्तुति) शुक्रवार को पाठ आध्यात्मिक और भौतिक प्रचुरता।' },
  practices: { en: 'Wear diamond (Heera) or white sapphire on the middle finger of the right hand in platinum or silver setting on a Friday during Venus hora — only if prescribed by a qualified Jyotishi. Donate white clothes, rice, sugar, ghee, or camphor on Fridays. Fasting on Fridays strengthens Venus. Offer white flowers (jasmine, lotus) to Lakshmi. Maintain a beautiful, clean home — Venus is strengthened by aesthetic order in the living environment. Singing, playing music, or engaging in any creative art naturally channels Venus energy.', hi: 'हीरा या श्वेत नीलम दाहिने हाथ की मध्यमा में प्लेटिनम या रजत जड़ित शुक्रवार को शुक्र होरा में — केवल योग्य ज्योतिषी के निर्देश पर। शुक्रवार को श्वेत वस्त्र, चावल, शक्कर, घी, कपूर दान। शुक्रवार व्रत शुक्र सशक्त। लक्ष्मी को श्वेत पुष्प। सुन्दर, स्वच्छ गृह बनाये रखना — सौन्दर्य व्यवस्था से शुक्र सशक्त।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: { en: 'The bull (Vrishabha) occupies a sacred position in Vedic civilization. Nandi, the divine bull, serves as the vahana (vehicle) of Lord Shiva — representing the disciplined channeling of primal energy through devotion. In the Rig Veda, the bull symbolizes Indra\'s virility and the abundance of the monsoon rains that nourish the earth. The Kamadhenu (wish-fulfilling cow) emerged from the churning of the cosmic ocean, representing the earth\'s inexhaustible capacity to provide when properly tended. Taurus as a zodiacal symbol captures this entire spectrum: the raw power of the bull, the nurturing abundance of the cow, and the sacred connection between humanity and the earth.', hi: 'वैदिक सभ्यता में वृषभ (बैल) पवित्र स्थान रखता है। नन्दी दिव्य वृषभ — भगवान शिव का वाहन, भक्ति से आदि ऊर्जा का अनुशासित संचालन। ऋग्वेद में वृषभ इन्द्र की वीर्यशक्ति और मानसून की प्रचुरता। कामधेनु (कामना पूर्ण करने वाली गाय) समुद्र मन्थन से प्रकट — पृथ्वी की अक्षय प्रदान क्षमता। राशि प्रतीक के रूप में वृषभ सम्पूर्ण स्पेक्ट्रम: बैल की कच्ची शक्ति, गाय की पोषक प्रचुरता, मानवता और पृथ्वी का पवित्र सम्बन्ध।' },
  symbolism: { en: 'The bull stands firm — this is the essential Taurus quality. While Aries charges forward, Taurus plants its hooves and says "I will not be moved." The horns of the bull point upward, connecting earth to sky, matter to spirit. In tantric symbolism, the bull represents Shakti (creative energy) grounded in Prakriti (nature) — the power of manifestation itself. The lesson of Vrishabha is that true wealth is not what you accumulate but what you cultivate. The farmer who tends the earth with patience and love will always be fed; the hoarder who hoards from fear will always feel poor.', hi: 'बैल दृढ़ खड़ा रहता है — यह मूलभूत वृषभ गुण। जबकि मेष आगे बढ़ता है, वृषभ अपने खुर गाड़ कर कहता है "मैं नहीं हिलूँगा।" बैल के सींग ऊपर — पृथ्वी से आकाश, पदार्थ से आत्मा। तान्त्रिक प्रतीकवाद में वृषभ प्रकृति में भूमिगत शक्ति — अभिव्यक्ति की शक्ति। वृषभ का पाठ: सच्ची सम्पत्ति संचय नहीं बल्कि खेती — धैर्य और प्रेम से पृथ्वी की सेवा।' },
};

// ─── Cross Links ───────────────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/shukra' as const, label: { en: 'Venus (Shukra) — Ruler of Vrishabha', hi: 'शुक्र — वृषभ का स्वामी' } },
  { href: '/learn/mesha' as const, label: { en: 'Mesha (Aries) — Previous Sign', hi: 'मेष — पिछली राशि' } },
  { href: '/learn/mithuna' as const, label: { en: 'Mithuna (Gemini) — Next Sign', hi: 'मिथुन — अगली राशि' } },
  { href: '/learn/rashis' as const, label: { en: 'All 12 Rashis Overview', hi: 'सभी 12 राशियों का अवलोकन' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र भवन' } },
  { href: '/learn/chandra' as const, label: { en: 'Moon (Chandra) — Exalted in Vrishabha', hi: 'चन्द्र — वृषभ में उच्च' } },
  { href: '/learn/compatibility' as const, label: { en: 'Compatibility & Matching', hi: 'अनुकूलता और मिलान' } },
  { href: '/learn/planet-in-house' as const, label: { en: 'Planets in Houses', hi: 'भावों में ग्रह' } },
  { href: '/learn/remedies' as const, label: { en: 'Vedic Remedies Guide', hi: 'वैदिक उपाय मार्गदर्शिका' } },
  { href: '/learn/wealth' as const, label: { en: 'Wealth & Finance in Jyotish', hi: 'ज्योतिष में धन और वित्त' } },
];

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
export default function VrishabhaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let sectionNum = 0;
  const next = () => ++sectionNum;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="text-8xl mb-4">&#9801;</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-2" style={hf}>
          {ml({ en: 'Vrishabha', hi: 'वृषभ' })}
        </h1>
        <p className="text-xl text-text-secondary mb-1" style={bf}>
          {ml({ en: 'Taurus — The Bull', hi: 'वृषभ — बैल' })}
        </p>
        <p className="text-text-secondary/80 italic text-sm max-w-xl mx-auto mb-6" style={bf}>
          {ml({ en: 'Where the fire of Aries finds its ground — Vrishabha is the garden where seeds become trees and desire becomes wealth.', hi: 'जहाँ मेष की अग्नि भूमि पाती है — वृषभ वह उपवन जहाँ बीज वृक्ष बनते और इच्छा सम्पत्ति।' })}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {ml({ en: 'Earth Element', hi: 'पृथ्वी तत्त्व' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {ml({ en: 'Fixed / Sthira', hi: 'स्थिर राशि' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {ml({ en: 'Ruler: Venus', hi: 'स्वामी: शुक्र' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {ml({ en: '30° – 60°', hi: '30° – 60°' })}
          </span>
        </div>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {TERMS.map((t) => (
          <SanskritTermCard key={t.transliteration} term={ml(t.meaning)} transliteration={t.transliteration} meaning={ml(t.meaning)} devanagari={t.devanagari} />
        ))}
      </div>

      {/* ── 1. Overview & Characteristics ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Characteristics', hi: 'अवलोकन एवं विशेषताएँ' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Vrishabha (Taurus) is the second sign of the sidereal zodiac, spanning 30° to 60°. If Mesha was the spark, Vrishabha is the earth that receives and nurtures that spark into a growing flame. Ruled by Venus (Shukra), the planet of beauty, wealth, and sensual pleasure, Vrishabha embodies the principle of material manifestation — turning potential into tangible reality. This is the sign of the farmer, the artist, the banker, and the singer: people who transform raw material into something beautiful and valuable.', hi: 'वृषभ सायन राशि चक्र की द्वितीय राशि है, 30° से 60° तक। यदि मेष चिंगारी थी तो वृषभ वह पृथ्वी जो उस चिंगारी को पोषित कर बढ़ती ज्वाला बनाती है। शुक्र शासित — सौन्दर्य, धन और इन्द्रिय सुख का ग्रह। भौतिक अभिव्यक्ति का सिद्धान्त — सम्भावना को स्पर्शनीय वास्तविकता में बदलना।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3 text-center">
              <div className="text-text-secondary/60 text-xs uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-text-primary text-sm font-medium" style={bf}>{ml(val)}</div>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Swarupa (Sign Descriptions)" />
      </LessonSection>

      {/* ── 2. Personality & Temperament ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Classical Physical Description', hi: 'शास्त्रीय शारीरिक वर्णन' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.appearance)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Temperament', hi: 'स्वभाव' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.temperament)}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'शक्तियाँ' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.strengths)}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PERSONALITY.weaknesses)}</p>
            </div>
          </div>
        </div>
        <ClassicalReference shortName="JP" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in This Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Vrishabha', hi: 'वृषभ के नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Vrishabha. Krittika\'s later padas bring solar fire into earth, Rohini provides the crown jewel of lunar beauty, and Mrigashira\'s early padas add the searching curiosity of Mars.', hi: 'तीन नक्षत्र वृषभ में। कृत्तिका के बाद के पाद पृथ्वी में सौर अग्नि, रोहिणी चन्द्र सौन्दर्य का मुकुट रत्न, और मृगशिरा के प्रारम्भिक पाद मंगल की खोजी जिज्ञासा।' })}</p>
        <div className="space-y-4">
          {NAKSHATRAS_IN_SIGN.map((n) => (
            <div key={ml(n.name)} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-gold-light font-bold" style={hf}>{ml(n.name)}</h4>
                <span className="text-xs text-text-secondary/70 bg-bg-primary/50 px-2 py-0.5 rounded">{ml(n.range)}</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-2 text-xs">
                <span className="text-text-secondary">{ml({ en: 'Ruler:', hi: 'स्वामी:' })} <span className="text-gold-primary">{ml(n.ruler)}</span></span>
                <span className="text-text-secondary">{ml({ en: 'Deity:', hi: 'देवता:' })} <span className="text-gold-primary">{ml(n.deity)}</span></span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.qualities)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Vrishabha', hi: 'वृषभ में ग्रहों की गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Vrishabha hosts the Moon\'s exaltation — the mind at its most peaceful. Rahu finds exaltation here too (per many authorities), amplifying material desire. Ketu is debilitated, struggling with detachment in the sign of attachment. Venus stands in her own home as the undisputed queen.', hi: 'वृषभ में चन्द्र उच्च — मन सर्वाधिक शान्त। राहु भी यहाँ उच्च (अनेक प्राधिकारी), भौतिक इच्छा विस्तारित। केतु नीच — आसक्ति की राशि में वैराग्य। शुक्र स्वगृह में निर्विवाद रानी।' })}</p>

        <h4 className="text-emerald-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Exalted Here', hi: 'यहाँ उच्च' })}</h4>
        {PLANETARY_DIGNITIES.exalted.map((p) => (
          <div key={ml(p.planet)} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        <h4 className="text-red-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Debilitated Here', hi: 'यहाँ नीच' })}</h4>
        {PLANETARY_DIGNITIES.debilitated.map((p) => (
          <div key={ml(p.planet)} className="bg-red-500/5 border border-red-500/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{ml(p.degree)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}

        <h4 className="text-gold-primary font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Own Sign / Moolatrikona', hi: 'स्वराशि / मूलत्रिकोण' })}</h4>
        {PLANETARY_DIGNITIES.ownSign.map((p) => (
          <div key={ml(p.planet)} className="bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className="text-xs text-gold-primary bg-gold-primary/10 px-2 py-0.5 rounded-full">{ml(p.range)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18-21 — Uccha, Neecha, Moolatrikona" />
      </LessonSection>

      {/* ── 5. Each Planet in Vrishabha ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Vrishabha', hi: 'वृषभ में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'How each of the nine Vedic planets behaves when placed in Vrishabha. Venus\'s earthy, sensual energy colors every planet with materialism, aesthetic sensitivity, and a desire for tangible results.', hi: 'वृषभ में स्थित प्रत्येक नवग्रह का व्यवहार। शुक्र की पार्थिव, इन्द्रिय ऊर्जा प्रत्येक ग्रह को भौतिकवाद, सौन्दर्यबोध और स्पर्शनीय परिणामों की इच्छा से रंगती है।' })}</p>
        <div className="space-y-4">
          {PLANETS_IN_SIGN.map((p) => (
            <div key={ml(p.planet)} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-gold-light font-bold" style={hf}>{ml(p.planet)}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  p.dignity.includes('Own') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-primary' :
                  'bg-bg-primary/50 border-gold-primary/15 text-text-secondary'
                }`}>{p.dignity}</span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 3-5 — Graha in Rashi Effects" />
      </LessonSection>

      {/* ── 6. Career & Professional Life ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Life', hi: 'करियर एवं व्यावसायिक जीवन' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(CAREER.suited)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Work Style', hi: 'कार्य शैली' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(CAREER.workStyle)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'A Vrishabha native forced into constant change, uncertainty, and instability — such as a volatile startup with no revenue — will become deeply anxious and underperform. They need material security as a foundation before they can create. Give them stability and watch them build empires.', hi: 'निरन्तर परिवर्तन, अनिश्चितता और अस्थिरता में धकेला गया वृषभ जातक — बिना राजस्व के अस्थिर स्टार्टअप — गहन चिन्तित होगा। सृजन से पूर्व भौतिक सुरक्षा आधार चाहिए। स्थिरता दें और साम्राज्य निर्माण देखें।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility', hi: 'अनुकूलता' })}>
        <h4 className="text-emerald-400 font-bold text-sm mb-3" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वोत्तम मेल' })}</h4>
        {COMPATIBILITY.best.map((c) => (
          <div key={ml(c.sign)} className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 mb-3">
            <span className="text-gold-light font-bold text-sm" style={hf}>{ml(c.sign)}</span>
            <p className="text-text-primary text-sm leading-relaxed mt-1" style={bf}>{ml(c.reason)}</p>
          </div>
        ))}
        <h4 className="text-amber-400 font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण मेल' })}</h4>
        {COMPATIBILITY.challenging.map((c) => (
          <div key={ml(c.sign)} className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4 mb-3">
            <span className="text-gold-light font-bold text-sm" style={hf}>{ml(c.sign)}</span>
            <p className="text-text-primary text-sm leading-relaxed mt-1" style={bf}>{ml(c.reason)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठाता देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.deity)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mantra', hi: 'मन्त्र' })}</h4>
            <p className="text-gold-primary text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
              ॐ द्रां द्रीं द्रौं सः शुक्राय नमः
            </p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.mantra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Practical Remedies', hi: 'व्यावहारिक उपाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES.practices)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 79 — Graha Shanti (Planetary Remedies)" />
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Sacred Bull', hi: 'पवित्र वृषभ' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Symbolism', hi: 'प्रतीकवाद' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.symbolism)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Vrishabha governs the throat, neck, thyroid gland, face, lower jaw, and cervical vertebrae. The second sign\'s connection to the throat makes Taurus natives particularly susceptible to thyroid disorders, tonsillitis, cervical spondylosis, and vocal cord strain. When Venus is strong and well-placed, the native enjoys a beautiful complexion, melodious voice, and robust physical constitution with good stamina. A weak or afflicted Venus can manifest as thyroid imbalance, chronic sore throats, dental problems, or skin conditions affecting the face and neck. Ayurvedically, Vrishabha is predominantly Kapha — the earth-water constitution that gives the sign its characteristic sturdiness but also tendency toward weight gain, sluggish metabolism, and fluid retention. Dietary recommendations emphasize warm, light, and stimulating foods: ginger tea, leafy greens, turmeric-spiced preparations, and moderate portions. Heavy, cold, and excessively sweet foods aggravate the natural Kapha tendency. Exercise should be regular and sustained rather than intense — walking, swimming, yoga, and gardening suit this sign better than competitive sports. Mentally, Vrishabha natives are prone to stubbornness-induced stress and attachment-related anxiety; they benefit enormously from practices that cultivate detachment without sacrificing their natural appreciation for beauty and comfort.', hi: 'वृषभ कण्ठ, गर्दन, थायरॉइड ग्रन्थि, मुख, निचला जबड़ा और ग्रीवा कशेरुकाओं का शासक है। द्वितीय राशि का कण्ठ से सम्बन्ध वृषभ जातकों को थायरॉइड विकार, टॉन्सिलाइटिस, सर्वाइकल स्पॉन्डिलोसिस और स्वर तन्तु तनाव के प्रति विशेष संवेदनशील बनाता है। जब शुक्र बली और शुभ स्थित हो तो जातक को सुन्दर रंगत, मधुर स्वर और दृढ़ शारीरिक संरचना मिलती है। दुर्बल शुक्र थायरॉइड असन्तुलन, पुराना गला दर्द, दन्त समस्या या त्वचा रोग दे सकता है। आयुर्वेदिक दृष्टि से वृषभ प्रधानतः कफ प्रकृति है — पृथ्वी-जल संविधान जो दृढ़ता देता है किन्तु भार वृद्धि, मन्द चयापचय और जल प्रतिधारण की प्रवृत्ति भी। आहार में ऊष्ण, हल्के और उत्तेजक पदार्थ — अदरक चाय, हरी पत्तेदार सब्जियाँ, हल्दी युक्त व्यंजन और संयमित मात्रा अनुशंसित। भारी, शीतल और अत्यधिक मीठे पदार्थ कफ बढ़ाते हैं। व्यायाम नियमित और सतत हो — पैदल, तैराकी, योग और बागवानी उपयुक्त। मानसिक रूप से हठ-जनित तनाव और आसक्ति-सम्बन्धी चिन्ता से ग्रस्त; वैराग्य अभ्यास अत्यन्त लाभकारी।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Throat, neck, thyroid, cervical spine, lower jaw, face, vocal cords, tonsils', hi: 'कण्ठ, गर्दन, थायरॉइड, ग्रीवा मेरुदण्ड, निचला जबड़ा, मुख, स्वर तन्तु, टॉन्सिल' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Kapha dominant. Favour warm, light, pungent foods. Avoid excess dairy, sweets, and cold foods. Regular moderate exercise essential to counter natural sluggishness.', hi: 'कफ प्रधान। ऊष्ण, हल्के, तीक्ष्ण आहार अनुकूल। अतिरिक्त दुग्ध, मिठाई और शीतल पदार्थ वर्जित। स्वाभाविक आलस्य से बचने हेतु नियमित संयमित व्यायाम अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Vrishabha in chart interpretation requires looking beyond the Sun sign — where this sign falls in your chart determines how its Venusian, earthy energy expresses in your life.', hi: 'कुण्डली व्याख्या में वृषभ को समझने के लिए सूर्य राशि से परे देखना आवश्यक — यह राशि आपकी कुण्डली में जहाँ पड़ती है वहाँ शुक्र की भौतिक ऊर्जा कैसे अभिव्यक्त होती है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Vrishabha is your Lagna', hi: 'यदि वृषभ आपका लग्न है' }, content: { en: 'Venus becomes your lagna lord, making beauty, comfort, and material security central life themes. Krittika lagna natives (Sun nakshatra in Venus sign) carry a fire-earth tension — creative passion grounded in practicality. Rohini lagna (Moon nakshatra) produces the most classically Taurean personality — sensual, artistic, magnetic. Mrigashira lagna (Mars nakshatra) adds restless curiosity to the otherwise stable Taurus frame. The lagna lord Venus must be assessed for dignity — in own sign or exalted, the native builds lasting wealth; debilitated or combust, material life faces recurring obstacles.', hi: 'शुक्र लग्नेश बनता है — सौन्दर्य, आराम और भौतिक सुरक्षा केन्द्रीय जीवन विषय। कृत्तिका लग्न (सूर्य नक्षत्र) अग्नि-पृथ्वी तनाव — व्यावहारिकता में आधारित सृजनात्मक जुनून। रोहिणी लग्न (चन्द्र नक्षत्र) सबसे शास्त्रीय वृषभ व्यक्तित्व — कामुक, कलात्मक, आकर्षक। मृगशिरा लग्न (मंगल नक्षत्र) स्थिर वृषभ में बेचैन जिज्ञासा जोड़ता है। लग्नेश शुक्र की गरिमा का आकलन अनिवार्य।' } },
            { title: { en: 'If Vrishabha is your Moon sign', hi: 'यदि वृषभ आपकी चन्द्र राशि है' }, content: { en: 'Moon is exalted in Taurus — this is one of the best placements for emotional stability. The mind is calm, sensory-oriented, and finds peace through beauty, music, and nature. Emotional responses are measured rather than reactive. However, this placement can create deep attachment to comfort and resistance to change. The native processes emotions slowly but thoroughly. Rohini Moon is the most emotionally refined placement in all of Jyotish — artistic sensitivity and magnetic charm. Krittika Moon adds fire and purificatory intensity to the emotional nature.', hi: 'चन्द्र वृषभ में उच्च — भावनात्मक स्थिरता के लिए सर्वोत्तम स्थानों में से एक। मन शान्त, इन्द्रिय-उन्मुख और सौन्दर्य, संगीत, प्रकृति से शान्ति पाता है। भावनात्मक प्रतिक्रियाएँ संयमित होती हैं। किन्तु आराम से गहरी आसक्ति और परिवर्तन का प्रतिरोध। रोहिणी चन्द्र ज्योतिष में सबसे भावनात्मक रूप से परिष्कृत — कलात्मक संवेदनशीलता और चुम्बकीय आकर्षण। कृत्तिका चन्द्र भावनात्मक प्रकृति में अग्नि और शुद्धिकारक तीव्रता जोड़ता है।' } },
            { title: { en: 'Vrishabha in divisional charts', hi: 'विभागीय कुण्डलियों में वृषभ' }, content: { en: 'In Navamsha (D9), Vrishabha indicates a spouse who is sensual, loyal, comfort-loving, and possibly connected to finance or the arts. In Dashamsha (D10), it suggests a career in banking, agriculture, luxury goods, hospitality, music, or any field where Venus\'s aesthetic sense meets earth\'s practicality. Vrishabha in D9 with a strong Venus often indicates a beautiful, stable marriage.', hi: 'नवांश (D9) में वृषभ जीवनसाथी को इंगित करता है जो कामुक, वफादार, आरामपसन्द और सम्भवतः वित्त या कला से जुड़ा। दशमांश (D10) में बैंकिंग, कृषि, विलासिता, आतिथ्य, संगीत या ऐसा क्षेत्र जहाँ शुक्र का सौन्दर्य बोध पृथ्वी की व्यावहारिकता से मिलता है। D9 में बली शुक्र के साथ वृषभ प्रायः सुन्दर, स्थिर विवाह।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Taurus is lazy. Reality: Taurus conserves energy strategically — they work with sustained effort, not bursts. Misconception: Taurus is materialistic. Reality: Taurus understands that material security is the foundation for spiritual growth — Lakshmi must be honored before Saraswati can be pursued. Misconception: Taurus resists all change. Reality: Taurus resists unnecessary change — they are the quality control of the zodiac, ensuring that change is genuine progress, not mere restlessness.', hi: 'भ्रान्ति: वृषभ आलसी है। सत्य: वृषभ रणनीतिक रूप से ऊर्जा संरक्षित करता है — सतत प्रयास करता है, विस्फोट नहीं। भ्रान्ति: वृषभ भौतिकवादी है। सत्य: वृषभ समझता है कि भौतिक सुरक्षा आध्यात्मिक विकास की नींव है। भ्रान्ति: वृषभ सब परिवर्तन का विरोध करता है। सत्य: वृषभ अनावश्यक परिवर्तन का विरोध करता है — वह राशिचक्र का गुणवत्ता नियन्त्रक है।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Vrishabha in a chart is not just about identifying "Taurus traits" — it is about understanding where Venus\'s earth energy anchors the chart. The house where Vrishabha falls reveals where you build lasting value, where patience is your greatest asset, and where attachment may become your greatest obstacle.', hi: 'कुण्डली में वृषभ पढ़ना केवल "वृषभ लक्षण" पहचानना नहीं — यह समझना है कि शुक्र की भौतिक ऊर्जा कुण्डली को कहाँ स्थिर करती है। जिस भाव में वृषभ पड़ता है वह बताता है कि आप कहाँ स्थायी मूल्य बनाते हैं, कहाँ धैर्य सबसे बड़ी सम्पत्ति है, और कहाँ आसक्ति सबसे बड़ी बाधा बन सकती है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Vrishabha as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Vrishabha as House Cusp', hi: 'भाव शिखर के रूप में वृषभ' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Vrishabha falls on different house cusps in a chart, it brings Venus\'s earthy, aesthetic, and stabilizing energy to that life domain. Here is how Taurus colours each house:', hi: 'जब वृषभ कुण्डली में विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में शुक्र की भौतिक, सौन्दर्यात्मक और स्थिरकारी ऊर्जा लाता है। यहाँ वृषभ प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Venus-ruled personality — attractive, patient, comfort-seeking. Strong physical constitution with love of beauty and sensory pleasures. Wealth accumulation is a natural talent.', hi: 'शुक्र शासित व्यक्तित्व — आकर्षक, धैर्यवान, आरामपसन्द। सौन्दर्य और इन्द्रिय सुख प्रेमी दृढ़ शारीरिक संरचना। धन संचय स्वाभाविक प्रतिभा।' } },
            { house: '2nd', effect: { en: 'Excellent for wealth — Venus in its own domain of speech and finances. Melodious voice, love of fine food, strong family values. Accumulates assets steadily over time.', hi: 'धन के लिए उत्कृष्ट — वाणी और वित्त के अपने क्षेत्र में शुक्र। मधुर स्वर, उत्तम भोजन प्रेम, दृढ़ पारिवारिक मूल्य। समय के साथ सम्पत्ति का स्थिर संचय।' } },
            { house: '3rd', effect: { en: 'Artistic communication style. Siblings may be in creative or financial fields. Courage expressed through persistence rather than aggression. Skilled in music, writing, or design.', hi: 'कलात्मक संवाद शैली। भाई-बहन सृजनात्मक या वित्तीय क्षेत्रों में। साहस आक्रामकता से नहीं बल्कि दृढ़ता से। संगीत, लेखन या डिज़ाइन में कुशल।' } },
            { house: '4th', effect: { en: 'Beautiful, comfortable home. Strong attachment to mother and homeland. Real estate investments prosper. Emotional security through material stability. Love of gardens and land.', hi: 'सुन्दर, आरामदायक गृह। माता और मातृभूमि से गहरा लगाव। भूसम्पत्ति निवेश सफल। भौतिक स्थिरता से भावनात्मक सुरक्षा। बाग और भूमि प्रेम।' } },
            { house: '5th', effect: { en: 'Creative talents in arts, music, and luxury trades. Romantic but possessive in love. Children may be artistically inclined. Speculation brings steady gains when Venus is strong.', hi: 'कला, संगीत और विलासिता व्यापार में सृजनात्मक प्रतिभा। प्रेम में रोमांटिक किन्तु अधिकारी। सन्तान कलात्मक प्रवृत्ति। शुक्र बली हो तो सट्टे में स्थिर लाभ।' } },
            { house: '6th', effect: { en: 'Throat and thyroid related health issues. Enemies are wealthy or artistic. Service in beauty, hospitality, or finance industries. Debt management through patient planning.', hi: 'कण्ठ और थायरॉइड सम्बन्धी स्वास्थ्य समस्याएँ। शत्रु धनवान या कलात्मक। सौन्दर्य, आतिथ्य या वित्त उद्योग में सेवा। धैर्यपूर्ण योजना से ऋण प्रबन्धन।' } },
            { house: '7th', effect: { en: 'Spouse is attractive, loyal, and comfort-loving. Marriage brings material prosperity. Business partnerships in Venus-related fields thrive. Strong commitment but risk of possessiveness.', hi: 'जीवनसाथी आकर्षक, वफादार और आरामपसन्द। विवाह भौतिक समृद्धि लाता है। शुक्र-सम्बन्धित क्षेत्रों में व्यापारिक साझेदारी फलती है। दृढ़ प्रतिबद्धता किन्तु अधिकार भावना का जोखिम।' } },
            { house: '8th', effect: { en: 'Inheritance and spouse\'s wealth prosper. Hidden resources and insurance benefits. Transformation through sensory experiences. Interest in tantric practices. Long life when Venus is strong.', hi: 'विरासत और जीवनसाथी का धन समृद्ध। छिपे संसाधन और बीमा लाभ। इन्द्रिय अनुभवों से रूपान्तरण। तान्त्रिक साधनाओं में रुचि। शुक्र बली हो तो दीर्घायु।' } },
            { house: '9th', effect: { en: 'Fortune through art, beauty, and luxury. Father may be in finance or creative fields. Dharma expressed through aesthetic cultivation. Pilgrimages to beautiful, sacred places.', hi: 'कला, सौन्दर्य और विलासिता से भाग्य। पिता वित्त या सृजनात्मक क्षेत्र में। सौन्दर्य संवर्धन से धर्म अभिव्यक्ति। सुन्दर, पवित्र स्थानों की तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Career in arts, luxury, finance, beauty, or hospitality. Professional reputation for reliability and aesthetic sense. Slow but steady career rise. Authority earned through consistent quality.', hi: 'कला, विलासिता, वित्त, सौन्दर्य या आतिथ्य में करियर। विश्वसनीयता और सौन्दर्य बोध की व्यावसायिक प्रतिष्ठा। धीमी किन्तु स्थिर करियर वृद्धि। सुसंगत गुणवत्ता से अधिकार।' } },
            { house: '11th', effect: { en: 'Gains through artistic and financial networks. Wealthy friends and social circle. Elder siblings in creative fields. Aspirations revolve around material security and aesthetic achievement.', hi: 'कलात्मक और वित्तीय नेटवर्क से लाभ। धनवान मित्र और सामाजिक वृत्त। बड़े भाई-बहन सृजनात्मक क्षेत्रों में। आकांक्षाएँ भौतिक सुरक्षा और सौन्दर्य उपलब्धि के इर्दगिर्द।' } },
            { house: '12th', effect: { en: 'Expenditure on luxury, beauty, and comfort. Foreign residence in pleasant locations. Spiritual growth through sensory renunciation. Bedroom pleasures and private artistic pursuits.', hi: 'विलासिता, सौन्दर्य और आराम पर व्यय। सुखद स्थानों पर विदेशी निवास। इन्द्रिय त्याग से आध्यात्मिक विकास। शयनकक्ष सुख और निजी कलात्मक साधना।' } },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-light font-bold text-sm" style={hf}>{item.house} House</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Vrishabha (Taurus) is the second sign — ruled by Venus, element earth, fixed modality. It represents material manifestation, patience, and the power to sustain.', hi: 'वृषभ द्वितीय राशि — शुक्र शासित, पृथ्वी तत्त्व, स्थिर स्वभाव। भौतिक अभिव्यक्ति, धैर्य और बनाये रखने की शक्ति।' }),
        ml({ en: 'Moon is exalted at 3° (emotional peace), Rahu exalted (material desire amplified), Ketu debilitated (detachment struggles). Venus owns the sign. Moon moolatrikona 4°-20°.', hi: 'चन्द्र 3° पर उच्च (भावनात्मक शान्ति), राहु उच्च, केतु नीच। शुक्र स्वामी। चन्द्र मूलत्रिकोण 4°-20°।' }),
        ml({ en: 'Three nakshatras: Krittika padas 2-4 (30°-40°, Sun), Rohini (40°-53°20\', Moon), Mrigashira padas 1-2 (53°20\'-60°, Mars).', hi: 'तीन नक्षत्र: कृत्तिका पाद 2-4 (30°-40°, सूर्य), रोहिणी (40°-53°20\', चन्द्र), मृगशिरा पाद 1-2 (53°20\'-60°, मंगल)।' }),
        ml({ en: 'Best compatibility with Virgo and Cancer (earth/water harmony). Career strength in finance, agriculture, music, art, luxury goods, and hospitality.', hi: 'कन्या और कर्क से सर्वोत्तम अनुकूलता। वित्त, कृषि, संगीत, कला, विलासिता और आतिथ्य में करियर शक्ति।' }),
      ]} />

      {/* ── Cross-links ── */}
      <div className="mt-12 border-t border-gold-primary/10 pt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">{ml({ en: 'Explore Further', hi: 'और जानें' })}</h3>
        <div className="flex flex-wrap gap-2">
          {CROSS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm rounded-lg border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-colors" style={bf}>
              {ml(link.label)}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
