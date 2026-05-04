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
  { devanagari: 'वृश्चिक', transliteration: 'Vṛśchika', meaning: { en: 'Scorpion — the creature that transforms through destruction', hi: 'वृश्चिक — विनाश द्वारा परिवर्तन करने वाला प्राणी' } },
  { devanagari: 'मंगल', transliteration: 'Maṅgala', meaning: { en: 'Mars — ruler of Vrishchika', hi: 'मंगल — वृश्चिक का स्वामी' } },
  { devanagari: 'स्थिर', transliteration: 'Sthira', meaning: { en: 'Fixed — the modality of Vrishchika', hi: 'स्थिर — वृश्चिक की प्रकृति' } },
  { devanagari: 'जल', transliteration: 'Jala', meaning: { en: 'Water — the element of Vrishchika', hi: 'जल — वृश्चिक का तत्त्व' } },
  { devanagari: 'मृत्युञ्जय', transliteration: 'Mṛtyuñjaya', meaning: { en: 'Conqueror of death — Scorpio\'s transformation power', hi: 'मृत्युंजय — वृश्चिक की परिवर्तन शक्ति' } },
  { devanagari: 'गुप्तविद्या', transliteration: 'Guptavidyā', meaning: { en: 'Hidden knowledge / Occult science', hi: 'गुप्तविद्या — गूढ़ ज्ञान' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Water (Jala Tattva)', hi: 'जल तत्त्व' },
  modality: { en: 'Fixed (Sthira)', hi: 'स्थिर' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्रीलिंग (स्त्री)' },
  ruler: { en: 'Mars (Mangal)', hi: 'मंगल' },
  symbol: { en: 'Scorpion ♏', hi: 'बिच्छू ♏' },
  degreeRange: { en: '210° to 240° of the zodiac', hi: 'राशिचक्र के 210° से 240°' },
  direction: { en: 'North', hi: 'उत्तर' },
  season: { en: 'Hemanta (Early Winter)', hi: 'हेमन्त ऋतु' },
  color: { en: 'Deep red, maroon, dark crimson', hi: 'गहरा लाल, मैरून, गहरा किरमिज़ी' },
  bodyPart: { en: 'Reproductive organs, bladder, excretory system, pelvis', hi: 'प्रजनन अंग, मूत्राशय, उत्सर्जन तन्त्र, श्रोणि' },
};

// ─── Nakshatras in Vrishchika ──────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Vishakha pada 4 (210° – 213°20\')', hi: 'विशाखा पाद 4 (210° – 213°20\')' },
    ruler: { en: 'Jupiter', hi: 'गुरु' },
    deity: { en: 'Indra-Agni (king of gods and fire god)', hi: 'इन्द्र-अग्नि (देवराज और अग्निदेव)' },
    desc: {
      en: 'Only the fourth pada of Vishakha falls in Scorpio — the transition point from Libra\'s diplomacy to Scorpio\'s intensity. Jupiter as nakshatra lord in Mars\'s water sign creates zealous crusaders who pursue their goals with obsessive determination. The dual deity Indra-Agni gives both royal ambition and destructive fire. This pada is the most intense of all Vishakha — the purpose becomes so focused it borders on fanaticism. The shakti is the power to achieve many goals (vyapana shakti), but in Scorpio\'s water, the goals turn inward — psychological mastery, occult research, and power over hidden forces.',
      hi: 'विशाखा का केवल चौथा पाद वृश्चिक में पड़ता है — तुला की कूटनीति से वृश्चिक की तीव्रता में संक्रमण बिन्दु। मंगल की जल राशि में गुरु शासित नक्षत्र उत्साही धर्मयोद्धा बनाता है जो जुनूनी दृढ़ संकल्प से लक्ष्य का पीछा करते हैं। यह पाद सभी विशाखा में सबसे तीव्र है — उद्देश्य इतना केन्द्रित हो जाता है कि कट्टरता की सीमा छूता है।',
    },
  },
  {
    name: { en: 'Anuradha (213°20\' – 226°40\')', hi: 'अनुराधा (213°20\' – 226°40\')' },
    ruler: { en: 'Saturn', hi: 'शनि' },
    deity: { en: 'Mitra (god of friendship and cosmic order)', hi: 'मित्र (मैत्री और ब्रह्माण्डीय व्यवस्था के देव)' },
    desc: {
      en: 'Anuradha is the heart of Scorpio — the nakshatra of devotion, friendship, and organizational power. Saturn as ruler gives discipline and endurance to Mars\'s fierce energy. Mitra as deity brings the capacity for deep, loyal friendships that endure through crisis. These natives are the power behind institutions — the devoted second-in-command, the loyal friend who appears in the darkest hour, the organizational genius who builds structures in hostile environments. The shakti is the power of worship (radhana shakti). Anuradha natives succeed in foreign lands and hostile environments where others fail. Numerology, astrology, and occult organizations attract them strongly.',
      hi: 'अनुराधा वृश्चिक का हृदय है — भक्ति, मैत्री और संगठनात्मक शक्ति का नक्षत्र। शनि स्वामी होने से मंगल की उग्र ऊर्जा को अनुशासन और सहनशक्ति मिलती है। मित्र देवता गहरी, वफादार मित्रता की क्षमता देता है जो संकट में भी टिकती है। ये जातक संस्थाओं के पीछे की शक्ति हैं — समर्पित उप-प्रमुख, अन्धकारमय समय में प्रकट होने वाला वफादार मित्र। विदेशी भूमि और प्रतिकूल वातावरण में सफल।',
    },
  },
  {
    name: { en: 'Jyeshtha (226°40\' – 240°)', hi: 'ज्येष्ठा (226°40\' – 240°)' },
    ruler: { en: 'Mercury', hi: 'बुध' },
    deity: { en: 'Indra (king of the gods)', hi: 'इन्द्र (देवराज)' },
    desc: {
      en: 'Jyeshtha is the eldest, the chief, the most senior — the nakshatra of protective authority and earned leadership. Mercury as ruler in Mars\'s water sign gives strategic intelligence, psychological acumen, and the ability to manipulate information for protection or power. Indra as deity confers kingship earned through battle, not birth. These natives are the eldest siblings, the protective matriarch/patriarch, the intelligence officers who guard secrets. The shakti is the power to rise and conquer (arohana shakti). Jyeshtha marks the end of Scorpio — where the scorpion\'s transformation culminates in either regeneration or self-destruction. The gandanta zone (239°-240°) is among the most karmically intense degrees in the zodiac.',
      hi: 'ज्येष्ठा सबसे बड़ा, प्रमुख, सबसे वरिष्ठ — रक्षात्मक अधिकार और अर्जित नेतृत्व का नक्षत्र। मंगल की जल राशि में बुध स्वामी रणनीतिक बुद्धि, मनोवैज्ञानिक कुशाग्रता और सूचना को सुरक्षा या शक्ति के लिए संचालित करने की क्षमता देता है। इन्द्र देवता युद्ध से अर्जित राजत्व प्रदान करता है, जन्म से नहीं। ये जातक ज्येष्ठ भाई-बहन, रक्षात्मक कुलपति, गोपनीयता की रक्षा करने वाले गुप्तचर अधिकारी हैं। गण्डान्त क्षेत्र (239°-240°) राशिचक्र की सबसे कार्मिक रूप से तीव्र अंशों में है।',
    },
  },
];

// ─── Planetary Dignities Here ──────────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  ownSign: {
    planet: { en: 'Mars (second sign — Scorpio is Mars\'s water sign)', hi: 'मंगल (दूसरी राशि — वृश्चिक मंगल की जल राशि)' },
    desc: {
      en: 'Scorpio is Mars\'s second own sign (the first being Aries). While Mars in Aries is the warrior charging into battle with visible force, Mars in Scorpio is the strategist who wins through intelligence, patience, and hidden power. This is the deeper, more psychological expression of Martian energy — the commando rather than the infantry soldier, the surgeon rather than the butcher. Mars here gives extraordinary endurance, emotional intensity, and the capacity to survive what would destroy others. The native never forgets an injury but also never forgets a kindness.',
      hi: 'वृश्चिक मंगल की दूसरी स्वराशि है (पहली मेष)। जबकि मेष में मंगल दृश्य बल से युद्ध में आक्रमण करने वाला योद्धा है, वृश्चिक में मंगल रणनीतिकार है जो बुद्धि, धैर्य और छिपी शक्ति से जीतता है। यह मंगल ऊर्जा की गहरी, अधिक मनोवैज्ञानिक अभिव्यक्ति है — कमाण्डो न कि पैदल सैनिक, शल्य चिकित्सक न कि कसाई। जातक कभी चोट नहीं भूलता किन्तु कभी कृपा भी नहीं भूलता।',
    },
  },
  debilitated: {
    planet: { en: 'Moon (debilitated at 3° Scorpio = 213° zodiac)', hi: 'चन्द्र (वृश्चिक 3° = 213° पर नीच)' },
    desc: {
      en: 'The Moon falls to its lowest dignity at 3° of Scorpio. The gentle, nurturing mind is overwhelmed by Scorpio\'s emotional intensity, suspicion, and transformative upheaval. Moon in Scorpio creates a mind that cannot rest — constantly probing, suspecting, and emotionally cycling through intense states. Psychological sensitivity borders on psychic ability but also produces anxiety, jealousy, and obsessive thinking. Mother may face emotional difficulties or the relationship with mother is complex. However, this is one of the most psychologically perceptive placements — therapists, detectives, and researchers often have this Moon. Neecha Bhanga through strong Mars or Jupiter can produce extraordinary emotional resilience.',
      hi: 'चन्द्र वृश्चिक 3° पर अपनी न्यूनतम गरिमा में है। कोमल, पालन-पोषण करने वाला मन वृश्चिक की भावनात्मक तीव्रता, सन्देह और परिवर्तनकारी उथल-पुथल से अभिभूत है। वृश्चिक में चन्द्र ऐसा मन बनाता है जो विश्राम नहीं कर सकता — लगातार जाँचता, सन्देह करता और तीव्र अवस्थाओं से गुज़रता। मनोवैज्ञानिक संवेदनशीलता मानसिक क्षमता की सीमा छूती है किन्तु चिन्ता, ईर्ष्या और जुनूनी सोच भी पैदा करती है।',
    },
  },
  ketuNote: {
    en: 'Some classical authorities consider Ketu to be exalted in Scorpio (and Rahu exalted in Taurus). This is debated — BPHS does not explicitly state nodal exaltation, but the tradition is widespread. Ketu in Scorpio resonates deeply: the headless shadow planet of liberation in the sign of death and transformation. If accepted, this makes Scorpio the sign where both the physical ruler (Mars) and the spiritual liberator (Ketu) are strong.',
    hi: 'कुछ शास्त्रीय अधिकारी केतु को वृश्चिक में उच्च मानते हैं (और राहु को वृषभ में)। यह विवादित है — बृहत् पराशर होरा शास्त्र स्पष्ट रूप से नोडल उच्चता नहीं बताता, किन्तु परम्परा व्यापक है। वृश्चिक में केतु गहराई से गूँजता है: मृत्यु और परिवर्तन की राशि में मुक्ति का शिरोहीन छाया ग्रह।',
  },
  note: {
    en: 'Scorpio is Mars\'s water sign — where martial energy goes underground. The Moon\'s debilitation here reveals the sign\'s fundamental nature: too intense for comfort, too deep for surface living. Planets in Scorpio are tested through crisis — those that survive emerge transformed. There is no casual transit through Scorpio.',
    hi: 'वृश्चिक मंगल की जल राशि है — जहाँ सैन्य ऊर्जा भूमिगत हो जाती है। चन्द्र का यहाँ नीच होना राशि की मौलिक प्रकृति प्रकट करता है: आराम के लिए बहुत तीव्र, सतही जीवन के लिए बहुत गहरी। वृश्चिक में ग्रहों की संकट से परीक्षा होती है — जो बचते हैं वे रूपान्तरित होकर उभरते हैं।',
  },
};

// ─── Each Planet in Vrishchika ─────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun in Vrishchika', hi: 'वृश्चिक में सूर्य' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The soul illuminating the depths — Sun in Scorpio creates intensely perceptive, private, and transformative individuals. The ego operates through hidden influence rather than visible display. These natives have X-ray vision into human motivation. Research, investigation, surgery, and intelligence work are natural domains. Father may have a secretive or intense personality. Authority is exercised behind the scenes. Tremendous regenerative power — they rise from crises that would destroy others. Can be controlling and suspicious.',
      hi: 'गहराइयों को प्रकाशित करने वाली आत्मा — वृश्चिक में सूर्य तीव्र रूप से अन्तर्दृष्टिपूर्ण, एकान्त और परिवर्तनकारी व्यक्ति बनाता है। अहंकार दृश्य प्रदर्शन से नहीं, छिपे प्रभाव से कार्य करता है। शोध, अन्वेषण, शल्य चिकित्सा और गुप्तचर कार्य स्वाभाविक क्षेत्र। पिता का व्यक्तित्व गोपनीय या तीव्र हो सकता है। असाधारण पुनरुत्थान शक्ति।',
    },
  },
  {
    planet: { en: 'Moon in Vrishchika', hi: 'वृश्चिक में चन्द्र' }, dignity: 'Debilitated',
    effect: {
      en: 'The mind submerged in the ocean of intensity. Moon in Scorpio creates the most psychologically complex and emotionally intense placement. At 3° (deepest fall), emotions are volcanic — erupting with devastating force after long periods of containment. Jealousy, possessiveness, and obsessive attachment are shadows. But the gifts are extraordinary: psychological perception that borders on psychic ability, emotional resilience forged through crisis, and healing power born from personal suffering. Therapists, occultists, crisis counselors, and emergency responders often have this Moon. Mother\'s life may involve emotional trauma.',
      hi: 'तीव्रता के सागर में डूबा मन। वृश्चिक में चन्द्र सबसे मनोवैज्ञानिक रूप से जटिल और भावनात्मक रूप से तीव्र स्थिति बनाता है। 3° पर भावनाएँ ज्वालामुखी हैं — लम्बे समय तक रोकने के बाद विनाशकारी बल से विस्फोट। ईर्ष्या, अधिकार-भाव और जुनूनी आसक्ति छायाएँ हैं। किन्तु प्रतिभाएँ असाधारण: मानसिक क्षमता की सीमा छूती मनोवैज्ञानिक अवधारणा, संकट से गढ़ी भावनात्मक लचीलापन।',
    },
  },
  {
    planet: { en: 'Mars in Vrishchika', hi: 'वृश्चिक में मंगल' }, dignity: 'Own sign',
    effect: {
      en: 'The warrior in his underground fortress — Mars in Scorpio is strategic, patient, and devastatingly effective. This is Mars at its most powerful and dangerous: the energy goes deep rather than wide. These natives never reveal their full hand. They plan for months and strike decisively. Surgery, military intelligence, espionage, crisis management, and research are ideal domains. Physical stamina is extraordinary. Sexual energy is intense and transformative. The native makes a formidable ally and a terrifying enemy. Manglik dosha is especially pronounced here — channel the energy into rigorous physical and professional discipline.',
      hi: 'अपने भूमिगत दुर्ग में योद्धा — वृश्चिक में मंगल रणनीतिक, धैर्यवान और विनाशकारी रूप से प्रभावी है। ये जातक कभी अपना पूरा पत्ता नहीं दिखाते। महीनों योजना बनाते हैं और निर्णायक रूप से प्रहार करते हैं। शल्य चिकित्सा, सैन्य गुप्तचर, जासूसी, संकट प्रबन्धन और शोध आदर्श क्षेत्र। शारीरिक सहनशक्ति असाधारण।',
    },
  },
  {
    planet: { en: 'Mercury in Vrishchika', hi: 'वृश्चिक में बुध' }, dignity: 'Neutral',
    effect: {
      en: 'The detective\'s mind — Mercury in Scorpio gives penetrating analytical ability focused on hidden information. These natives think in terms of power dynamics, hidden motives, and psychological undercurrents. Excellent for forensic accounting, criminal investigation, psychotherapy, cryptography, and investigative journalism. Speech can be cutting and sarcastic. Writing is often dark, psychological, and probing. Research skills are exceptional. Can be intellectually manipulative — using information as a weapon. The mind never accepts surface explanations.',
      hi: 'जासूस का मन — वृश्चिक में बुध छिपी सूचना पर केन्द्रित भेदक विश्लेषणात्मक क्षमता देता है। ये जातक शक्ति गतिशीलता, छिपे उद्देश्य और मनोवैज्ञानिक अन्तर्धाराओं में सोचते हैं। फोरेंसिक लेखा, आपराधिक अन्वेषण, मनोचिकित्सा, कूटलेखन और खोजी पत्रकारिता के लिए उत्कृष्ट। वाणी तीखी और व्यंग्यपूर्ण हो सकती है।',
    },
  },
  {
    planet: { en: 'Jupiter in Vrishchika', hi: 'वृश्चिक में गुरु' }, dignity: 'Neutral',
    effect: {
      en: 'The guru who descends into the underworld — Jupiter in Scorpio expands wisdom through transformation, crisis, and occult knowledge. These natives seek truth in the hidden dimensions: Tantra, depth psychology, research into death and rebirth, and the mystical traditions. Children may be intense or gifted. Wealth comes through inheritance, insurance, research funding, or other people\'s money. Can become dogmatic about alternative or occult philosophies. Excellent for teaching subjects that others fear — death, sexuality, power dynamics, and the shadow side of human nature.',
      hi: 'अधोलोक में उतरने वाला गुरु — वृश्चिक में गुरु परिवर्तन, संकट और गूढ़ ज्ञान के माध्यम से ज्ञान का विस्तार करता है। ये जातक छिपे आयामों में सत्य खोजते हैं: तन्त्र, गहन मनोविज्ञान, मृत्यु और पुनर्जन्म पर शोध। धन विरासत, बीमा या दूसरों के धन से आता है। मृत्यु, कामुकता और शक्ति गतिशीलता जैसे विषय पढ़ाने के लिए उत्कृष्ट।',
    },
  },
  {
    planet: { en: 'Venus in Vrishchika', hi: 'वृश्चिक में शुक्र' }, dignity: 'Neutral',
    effect: {
      en: 'Love as total surrender — Venus in Scorpio creates the most intensely passionate and possessive romantic nature in the zodiac. Relationships are all or nothing. The native experiences love as a transformative force that strips away pretense. Physical intimacy is deeply important and merges with emotional and spiritual dimensions. Jealousy and obsessive attachment are constant risks. Beauty is perceived in dark, unconventional, and taboo forms. The arts express through themes of death, desire, and transformation. Can attract complicated karmic relationships. Marriage involves power dynamics.',
      hi: 'पूर्ण समर्पण के रूप में प्रेम — वृश्चिक में शुक्र राशिचक्र में सबसे तीव्र उत्कट और अधिकारी प्रेम प्रकृति बनाता है। सम्बन्ध सब कुछ या कुछ नहीं होते हैं। शारीरिक अन्तरंगता गहरे रूप से महत्त्वपूर्ण है। ईर्ष्या और जुनूनी आसक्ति निरन्तर जोखिम। सौन्दर्य अन्धकारपूर्ण, अपरम्परागत रूपों में दिखता है। कला मृत्यु, इच्छा और परिवर्तन के विषयों से व्यक्त होती है।',
    },
  },
  {
    planet: { en: 'Saturn in Vrishchika', hi: 'वृश्चिक में शनि' }, dignity: 'Neutral',
    effect: {
      en: 'The karmic excavator — Saturn in Scorpio forces confrontation with the deepest fears and hidden debts of the soul. This placement creates individuals who endure prolonged periods of psychological pressure, chronic health challenges (especially reproductive or excretory), and transformative suffering. The reward: unshakeable inner strength. These are the crisis managers, the surgeons who work in war zones, and the therapists who sit with trauma. Career involves long-term research, underground work (mining, archaeology, plumbing), or institutional reform. Nothing is superficial — every experience is processed to its karmic root.',
      hi: 'कार्मिक उत्खनक — वृश्चिक में शनि आत्मा के सबसे गहरे भय और छिपे ऋणों का सामना करने को विवश करता है। यह दीर्घकालिक मनोवैज्ञानिक दबाव, दीर्घकालिक स्वास्थ्य चुनौतियाँ और परिवर्तनकारी पीड़ा सहने वाले व्यक्ति बनाता है। प्रतिफल: अटूट आन्तरिक शक्ति। ये संकट प्रबन्धक, युद्ध क्षेत्र के शल्य चिकित्सक और आघात के साथ बैठने वाले चिकित्सक हैं।',
    },
  },
  {
    planet: { en: 'Rahu in Vrishchika', hi: 'वृश्चिक में राहु' }, dignity: 'Neutral',
    effect: {
      en: 'The shadow amplifying the shadow — Rahu in Scorpio creates an obsessive fascination with death, power, the occult, and hidden dimensions of reality. These natives are drawn to taboo subjects, forbidden knowledge, and the dark side of human experience. Can indicate past-life karmic debts involving betrayal, violence, or sexual transgression that must be resolved. Extraordinary research ability in hidden subjects. Can become manipulative, paranoid, or obsessed with conspiracy theories. The positive expression: transformative healers who use unconventional methods to heal deep wounds.',
      hi: 'छाया को बढ़ाती छाया — वृश्चिक में राहु मृत्यु, शक्ति, गूढ़ विद्या और वास्तविकता के छिपे आयामों के प्रति जुनूनी आकर्षण बनाता है। निषिद्ध विषयों, वर्जित ज्ञान और मानवीय अनुभव के अन्धकार पक्ष की ओर आकर्षित। विश्वासघात या हिंसा से जुड़े पूर्वजन्म कार्मिक ऋण। सकारात्मक अभिव्यक्ति: गहरे घावों को भरने वाले परिवर्तनकारी चिकित्सक।',
    },
  },
  {
    planet: { en: 'Ketu in Vrishchika', hi: 'वृश्चिक में केतु' }, dignity: 'Exalted (per some traditions)',
    effect: {
      en: 'The liberator in the house of death — Ketu in Scorpio is considered exalted by many classical authorities. The headless planet of moksha in the sign of transformation creates profound spiritual depth, intuitive occult knowledge, and detachment from the fear of death. Past-life mastery of Scorpionic themes (transformation, power, hidden knowledge) means the native arrives with innate psychic sensitivity. Healing ability is natural and often unexplained. Interest in Tantra, Kundalini, and liberation through surrender. Can indicate past-life involvement in mystical traditions. Physical vitality may be unpredictable. The native seeks Taurus (opposite) themes: simplicity, nature, and material stability.',
      hi: 'मृत्यु के भवन में मुक्तिदाता — वृश्चिक में केतु को अनेक शास्त्रीय अधिकारी उच्च मानते हैं। परिवर्तन की राशि में मोक्ष का शिरोहीन ग्रह गहन आध्यात्मिक गहराई, सहज गूढ़ ज्ञान और मृत्यु भय से वैराग्य बनाता है। वृश्चिक विषयों में पूर्वजन्म की महारत — जातक सहज मानसिक संवेदनशीलता लेकर आता है। तन्त्र, कुण्डलिनी और समर्पण द्वारा मुक्ति में रुचि।',
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Extraordinary emotional resilience, penetrating perception, fierce loyalty, investigative brilliance, transformative power, psychological depth, crisis management ability, resourcefulness in extreme conditions, healing capacity born from personal suffering, unwavering determination, strategic thinking',
    hi: 'असाधारण भावनात्मक लचीलापन, भेदक अन्तर्दृष्टि, उग्र वफादारी, अन्वेषणात्मक प्रतिभा, परिवर्तनकारी शक्ति, मनोवैज्ञानिक गहराई, संकट प्रबन्धन क्षमता, चरम स्थितियों में संसाधनशीलता, व्यक्तिगत पीड़ा से जन्मी चिकित्सा क्षमता, अटल दृढ़ संकल्प',
  },
  weaknesses: {
    en: 'Jealousy and possessiveness, tendency toward manipulation, difficulty forgiving perceived betrayals, obsessive thinking, control issues, secretiveness that borders on paranoia, self-destructive behavior when wounded, vindictiveness, emotional extremes that exhaust relationships, difficulty with vulnerability and trust',
    hi: 'ईर्ष्या और अधिकार-भाव, जोड़-तोड़ की प्रवृत्ति, कथित विश्वासघात को क्षमा करने में कठिनाई, जुनूनी सोच, नियन्त्रण समस्याएँ, भयग्रस्तता की सीमा छूती गोपनीयता, घायल होने पर आत्म-विनाशकारी व्यवहार, प्रतिशोध, विश्वास और भेद्यता में कठिनाई',
  },
  temperament: {
    en: 'Vrishchika natives live at an emotional depth that most other signs cannot fathom. Their fixed water nature makes them the deep ocean — still on the surface but churning with powerful currents beneath. They experience life as a continuous process of death and rebirth: shedding old identities, surviving crises, and emerging transformed. Trust is their most precious currency — once broken, rarely restored. They are fiercely protective of their inner circle and utterly relentless against perceived enemies. Their greatest fear is vulnerability; their greatest strength is the willingness to face what others cannot. At their highest, they are the phoenix — destroyed and reborn, carrying wisdom from the ashes.',
    hi: 'वृश्चिक जातक ऐसी भावनात्मक गहराई में जीते हैं जिसकी अधिकांश राशियाँ कल्पना नहीं कर सकतीं। उनकी स्थिर जल प्रकृति उन्हें गहरा सागर बनाती है — सतह पर शान्त किन्तु नीचे शक्तिशाली धाराओं से मन्थित। वे जीवन को मृत्यु और पुनर्जन्म की निरन्तर प्रक्रिया के रूप में अनुभव करते हैं। विश्वास उनकी सबसे मूल्यवान मुद्रा है — एक बार टूटा तो विरले ही पुनर्स्थापित। अपने सर्वोच्च रूप में वे फ़ीनिक्स हैं — नष्ट और पुनर्जीवित, राख से ज्ञान लेकर।',
  },
  appearance: {
    en: 'Intense and magnetic eyes (the most recognized Scorpio trait), sharp features, medium to compact build with surprising physical strength, dark or deep-toned complexion, penetrating gaze that makes others feel exposed, composed and controlled body language that conceals inner intensity, often wears dark or deep colors',
    hi: 'तीव्र और आकर्षक आँखें (सबसे प्रसिद्ध वृश्चिक लक्षण), तीक्ष्ण आकृति, आश्चर्यजनक शारीरिक शक्ति वाला मध्यम से सुगठित शरीर, गहरा वर्ण, भेदक दृष्टि जो दूसरों को उजागर महसूस कराती है, नियन्त्रित शारीरिक भाषा जो आन्तरिक तीव्रता छुपाती है',
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Surgery and emergency medicine, criminal investigation and forensics, psychotherapy and depth psychology, intelligence and espionage, research (especially pharmaceutical, nuclear, or genetic), insurance and risk assessment, mining and underground resources, occult sciences and Tantra, crisis management and disaster response, pathology and laboratory medicine, financial derivatives and debt trading, military special operations',
    hi: 'शल्य चिकित्सा और आपातकालीन चिकित्सा, आपराधिक अन्वेषण और फोरेंसिक, मनोचिकित्सा और गहन मनोविज्ञान, गुप्तचर और जासूसी, शोध (विशेषतः औषधीय, परमाणु या आनुवंशिक), बीमा और जोखिम मूल्यांकन, खनन, गूढ़ विज्ञान और तन्त्र, संकट प्रबन्धन, विकृति विज्ञान, सैन्य विशेष अभियान',
  },
  insight: {
    en: 'Scorpio natives thrive in environments that would destroy others — high-stakes, high-pressure, and high-secrecy. They are the people you call when the situation is desperate and conventional approaches have failed. Their capacity to work with death, crisis, hidden information, and taboo subjects makes them invaluable in fields that most people avoid. The ideal Scorpio career involves transformation of some kind: transforming disease into health (surgery), chaos into order (crisis management), hidden crime into justice (investigation), or psychological wounds into wisdom (therapy).',
    hi: 'वृश्चिक जातक ऐसे वातावरण में फलते-फूलते हैं जो दूसरों को नष्ट कर देता — उच्च-दाँव, उच्च-दबाव और उच्च-गोपनीयता। वे वो लोग हैं जिन्हें आप तब बुलाते हैं जब स्थिति निराशाजनक हो और पारम्परिक दृष्टिकोण विफल हो गये हों। आदर्श वृश्चिक करियर में किसी प्रकार का परिवर्तन शामिल है: रोग को स्वास्थ्य में (शल्य चिकित्सा), अराजकता को व्यवस्था में (संकट प्रबन्धन), छिपे अपराध को न्याय में (अन्वेषण)।',
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Cancer (Karka): Water with water — deep emotional understanding, shared need for security, and mutual nurturing create an intensely bonded partnership. Pisces (Meena): Water with water — spiritual connection, shared intuitive depth, and complementary emotional rhythms. Virgo (Kanya): Earth with water — Virgo\'s analysis channels Scorpio\'s intensity productively. Mutual respect for depth and precision. Capricorn (Makara): Earth with water — shared ambition, strategic alignment, and mutual respect for power.',
    hi: 'कर्क: जल-जल — गहरी भावनात्मक समझ, सुरक्षा की साझा आवश्यकता। मीन: जल-जल — आध्यात्मिक जुड़ाव, साझा सहजज्ञान गहराई। कन्या: पृथ्वी-जल — कन्या का विश्लेषण वृश्चिक की तीव्रता को उत्पादक रूप से प्रवाहित करता है। मकर: पृथ्वी-जल — साझा महत्वाकांक्षा और शक्ति का पारस्परिक सम्मान।',
  },
  challenging: {
    en: 'Leo (Simha): Fixed fire vs. fixed water — intense attraction but equally intense power struggles. Neither sign yields. Aquarius (Kumbha): Fixed air vs. fixed water — Aquarius\'s detachment infuriates Scorpio\'s emotional intensity. Fundamentally different relationship needs. Aries (Mesha): Both Mars-ruled — too much aggression, competition, and ego. Can work as allies but romance is explosive. Taurus (Vrishabha): Opposite sign — magnetic attraction but Taurus\'s possessiveness meets Scorpio\'s possessiveness in a deadlock.',
    hi: 'सिंह: स्थिर अग्नि बनाम स्थिर जल — तीव्र आकर्षण किन्तु समान तीव्र सत्ता संघर्ष। कुम्भ: कुम्भ की अनासक्ति वृश्चिक की तीव्रता को क्रोधित करती है। मेष: दोनों मंगल-शासित — अत्यधिक आक्रामकता और प्रतिस्पर्धा। वृषभ: विपरीत राशि — चुम्बकीय आकर्षण किन्तु दोनों का अधिकार-भाव गतिरोध बनाता है।',
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Shiva in his Mahakal (Great Time / Destroyer) form is the primary deity for Vrishchika Rashi. Shiva as Mahamrityunjaya (Conqueror of Death) embodies Scorpio\'s power to transcend mortality through transformation. Lord Hanuman, the celibate warrior-devotee, resonates with Mars\'s protective and fierce energy. Goddess Kali, who dances on the corpse of ego, represents Scorpio\'s ultimate teaching: liberation through the destruction of attachment.',
    hi: 'भगवान शिव महाकाल (महान काल / संहारक) रूप में वृश्चिक राशि के प्राथमिक देवता हैं। शिव महामृत्युंजय के रूप में परिवर्तन द्वारा मृत्यु पर विजय पाने की वृश्चिक शक्ति का मूर्त रूप हैं। भगवान हनुमान, ब्रह्मचारी योद्धा-भक्त, मंगल की रक्षात्मक और उग्र ऊर्जा से गुंजायमान हैं। देवी काली अहंकार के शव पर नृत्य करती हैं — आसक्ति के विनाश द्वारा मुक्ति।',
  },
  practices: {
    en: 'Chant the Mangal Beej Mantra: Om Kraam Kreem Kraum Sah Bhaumaya Namah — especially on Tuesdays. Also chant Mahamrityunjaya Mantra for transformation and healing. Wear red coral (Moonga) in gold on the ring finger after consulting a Jyotishi. Donate red lentils (masoor dal), red cloth, sharp instruments, and jaggery on Tuesdays. Fast on Tuesdays consuming only one meal. Worship Lord Hanuman with sindoor and jasmine oil. Visit Mahakal temple in Ujjain or any Jyotirlinga. Practice Kundalini meditation and Pranayama for channeling Scorpio\'s intense energy.',
    hi: 'मंगल बीज मन्त्र जपें: ॐ क्रां क्रीं क्रौं सः भौमाय नमः — विशेषतः मंगलवार को। परिवर्तन और चिकित्सा के लिए महामृत्युंजय मन्त्र भी जपें। ज्योतिषी से परामर्श के बाद अनामिका में स्वर्ण में मूँगा धारण करें। मंगलवार को मसूर दाल, लाल वस्त्र और गुड़ दान करें। मंगलवार को एक भोजन का उपवास। भगवान हनुमान की सिन्दूर और चमेली तेल से पूजा करें। उज्जैन के महाकाल मन्दिर जाएँ। कुण्डलिनी ध्यान और प्राणायाम का अभ्यास करें।',
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'In Hindu mythology, the scorpion connects to several transformative narratives. The most resonant is the churning of the cosmic ocean (Samudra Manthan), where both poison (Halahala) and nectar (Amrita) emerged from the same source — perfectly encapsulating Scorpio\'s dual nature of destruction and regeneration. When the deadly poison threatened to destroy all creation, Lord Shiva swallowed it, holding it in his throat (hence Neelkantha — the blue-throated one). This act defines the Scorpio archetype: the willingness to absorb destruction for the sake of cosmic preservation. The scorpion itself appears in the story of the sage Durvasa, whose curse (a scorpion\'s sting of karma) set in motion the churning. In Tamil tradition, the Vrischikam month is sacred to Lord Murugan (Kartikeya), connecting Mars-ruled Scorpio to the warrior deity.',
    hi: 'हिन्दू पौराणिक कथाओं में वृश्चिक अनेक परिवर्तनकारी कथाओं से जुड़ता है। सबसे गूँजने वाली समुद्र मन्थन है, जहाँ एक ही स्रोत से विष (हलाहल) और अमृत दोनों निकले — वृश्चिक की विनाश और पुनरुत्थान की द्वैत प्रकृति का पूर्ण मूर्तिमान। जब घातक विष सृष्टि को नष्ट करने की धमकी दे रहा था, भगवान शिव ने उसे पी लिया, अपने कण्ठ में रोक लिया (अतः नीलकण्ठ)। यह कृत्य वृश्चिक आदर्श को परिभाषित करता है: ब्रह्माण्डीय संरक्षण के लिए विनाश को अवशोषित करने की तत्परता।',
  },
  vedic: {
    en: 'Mars (Mangal) is described in the Puranas as the son of the Earth (Bhumi Devi) and Lord Vishnu in his Varaha (Boar) avatar. Born from the sweat of Shiva in some traditions, Mars carries both creative and destructive potential. The Skanda Purana describes Mars as having a red complexion, four arms, and carrying weapons. His day is Tuesday (Mangalvara), his gem is red coral, and his direction is south. The Nadi texts describe Scorpio as the "sign of the serpent hole" — where planetary energy goes underground and operates through hidden channels. Varahamihira in Brihat Samhita associates the Scorpio region of the sky with hidden waters, poisons, insects, and transformative substances — the raw materials of both death and medicine.',
    hi: 'पुराणों में मंगल को पृथ्वी (भूमि देवी) और भगवान विष्णु के वराह अवतार का पुत्र बताया गया है। कुछ परम्पराओं में शिव के पसीने से जन्मा, मंगल सृजनात्मक और विनाशकारी दोनों क्षमता रखता है। स्कन्द पुराण मंगल को लाल वर्ण, चार भुजा और शस्त्र धारी बताता है। नाड़ी ग्रन्थ वृश्चिक को "सर्प-बिल की राशि" बताते हैं — जहाँ ग्रह ऊर्जा भूमिगत होकर छिपे मार्गों से कार्य करती है। वराहमिहिर बृहत् संहिता में वृश्चिक क्षेत्र को छिपे जल, विष, कीट और परिवर्तनकारी पदार्थों से जोड़ते हैं।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/mangal', label: { en: 'Mangal — Mars (Vrishchika\'s Ruler)', hi: 'मंगल — वृश्चिक का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/dhanu', label: { en: 'Dhanu (Sagittarius) — Next Rashi', hi: 'धनु — अगली राशि' } },
  { href: '/learn/tula', label: { en: 'Tula (Libra) — Previous Rashi', hi: 'तुला — पिछली राशि' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/ketu', label: { en: 'Ketu — South Node (Exalted here per some)', hi: 'केतु — कुछ मतों में यहाँ उच्च' } },
  { href: '/learn/chandra', label: { en: 'Chandra — Moon (Debilitated here)', hi: 'चन्द्र — यहाँ नीच' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function VrishchikaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/15 border border-blue-500/30 mb-4">
          <span className="text-4xl">♏</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Vrishchika — Scorpio', hi: 'वृश्चिक राशि' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The eighth sign of the zodiac — the transformative scorpion, ruled by Mars, embodying intensity, hidden power, and the cycle of death and rebirth.', hi: 'राशिचक्र की आठवीं राशि — परिवर्तनकारी वृश्चिक, मंगल द्वारा शासित, तीव्रता, छिपी शक्ति और मृत्यु-पुनर्जन्म चक्र का मूर्त रूप।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Sign Overview ── */}
      <LessonSection number={next()} title={ml({ en: 'Sign Overview', hi: 'राशि परिचय' })}>
        <p style={bf}>{ml({ en: 'Vrishchika (Scorpio) is the eighth sign of the zodiac, spanning 210° to 240° of the ecliptic. It is a fixed water sign ruled by Mars — the planet of energy, aggression, and transformation. While Aries (Mars\'s first sign) expresses Martian energy as visible force, Scorpio channels it underground — into hidden power, emotional intensity, and psychological depth. In the natural zodiac, Scorpio rules the 8th house — the house of death, transformation, occult knowledge, inheritance, and the deepest mysteries of existence. This is not the death that ends, but the death that transforms: the snake shedding its skin, the phoenix rising from ashes.', hi: 'वृश्चिक राशिचक्र की आठवीं राशि है, क्रान्तिवृत्त के 210° से 240° तक। यह मंगल — ऊर्जा, आक्रामकता और परिवर्तन के ग्रह — द्वारा शासित स्थिर जल राशि है। जबकि मेष मंगल ऊर्जा को दृश्य बल के रूप में व्यक्त करता है, वृश्चिक इसे भूमिगत करता है — छिपी शक्ति, भावनात्मक तीव्रता और मनोवैज्ञानिक गहराई में। प्राकृतिक राशिचक्र में वृश्चिक 8वें भाव पर शासन करता है — मृत्यु, परिवर्तन, गूढ़ ज्ञान और अस्तित्व के गहनतम रहस्यों का भाव।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-blue-500/5 rounded-lg border border-blue-500/15 p-3">
              <span className="text-blue-400 text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svarupa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <p style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'गुण' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-blue-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक स्वरूप' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in Vrishchika ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Vrishchika', hi: 'वृश्चिक में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Scorpio, each intensifying the sign\'s transformative power in a unique direction. Vishakha\'s final pada brings zealous purpose, Anuradha adds loyal organizational power, and Jyeshtha culminates in protective authority. The Jyeshtha-Mula gandanta junction (239°-240° to 240°-253°20\') is among the most karmically charged transitions in the zodiac.', hi: 'तीन नक्षत्र वृश्चिक में स्थित हैं, प्रत्येक एक अनूठी दिशा में राशि की परिवर्तनकारी शक्ति को तीव्र करता है। विशाखा का अन्तिम पाद उत्साही उद्देश्य लाता है, अनुराधा वफादार संगठनात्मक शक्ति जोड़ता है, और ज्येष्ठा रक्षात्मक अधिकार में समाप्त होता है।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">{ml(n.ruler)}</span>
              <span className="text-xs text-text-secondary italic">{ml(n.deity)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.desc)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Vrishchika', hi: 'वृश्चिक में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml(PLANETARY_DIGNITIES_HERE.note)}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.ownSign.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">Own Sign</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.ownSign.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">Debilitated</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-amber-500/20 rounded-xl p-5">
            <p className="text-text-secondary text-sm leading-relaxed italic" style={bf}>{ml({ en: PLANETARY_DIGNITIES_HERE.ketuNote.en, hi: PLANETARY_DIGNITIES_HERE.ketuNote.hi })}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha and Ch. 4 — Own Signs" />
      </LessonSection>

      {/* ── 5. Each Planet in Vrishchika ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Vrishchika', hi: 'वृश्चिक में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Every planet in Scorpio is tested by fire and water simultaneously. Friends of Mars (Sun, Moon, Jupiter) navigate the intensity with varying degrees of comfort. The Sun finds a powerful ally; the Moon finds its most difficult placement. Mercury gains investigative depth. Venus experiences love as total transformation. Saturn endures the deepest karmic excavation. Rahu amplifies obsession; Ketu finds liberation.', hi: 'वृश्चिक में प्रत्येक ग्रह एक साथ अग्नि और जल से परीक्षित होता है। मंगल के मित्र (सूर्य, चन्द्र, गुरु) विभिन्न स्तरों की सुविधा से तीव्रता को नेविगेट करते हैं। सूर्य शक्तिशाली सहयोगी पाता है; चन्द्र अपनी सबसे कठिन स्थिति। बुध अन्वेषणात्मक गहराई पाता है। शुक्र प्रेम को पूर्ण परिवर्तन के रूप में अनुभव करता है।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                p.dignity.includes('Own') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                p.dignity.includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
              }`}>{p.dignity}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 6. Career ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Tendencies', hi: 'करियर एवं व्यावसायिक प्रवृत्तियाँ' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.insight)}</p>
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-blue-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Scorpio natives who work in shallow, superficial, or politically naive environments feel like a deep-sea creature forced to live in a puddle. Their power emerges in crises, depth, and situations where others have given up. The path to professional satisfaction is not comfort — it is meaningful confrontation with what matters.', hi: 'वृश्चिक जातक जो उथले, सतही या राजनीतिक रूप से भोले वातावरण में काम करते हैं, गहरे समुद्र के प्राणी की तरह महसूस करते हैं जो पोखर में रहने को विवश हो। उनकी शक्ति संकट, गहराई और उन स्थितियों में उभरती है जहाँ दूसरों ने हार मान ली हो।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Scorpio takes relationships with the intensity of a blood oath. Compatibility requires a partner who can handle emotional depth without drowning, who values loyalty as fiercely as Scorpio does, and who will not betray trust under any circumstance. Water and earth signs provide the depth and stability Scorpio needs; fire and air signs bring excitement but often cannot sustain the emotional intensity.', hi: 'वृश्चिक सम्बन्धों को रक्त शपथ की तीव्रता से लेता है। अनुकूलता ऐसे साथी की माँग करती है जो बिना डूबे भावनात्मक गहराई सँभाल सके, जो वृश्चिक की तरह वफादारी को मूल्यवान माने। जल और पृथ्वी राशियाँ गहराई और स्थिरता देती हैं।' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वश्रेष्ठ जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ी' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्र देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Recommended Practices', hi: 'अनुशंसित अभ्यास' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'For Scorpio natives, the deepest remedy is learning to forgive. The scorpion\'s sting is most dangerous to itself — holding grudges poisons the holder. The Mahamrityunjaya Mantra teaches that liberation comes not from conquering death but from releasing attachment. Transform your intensity into healing rather than revenge.', hi: 'वृश्चिक जातकों के लिए सबसे गहरा उपाय क्षमा करना सीखना है। बिच्छू का डंक स्वयं के लिए सबसे खतरनाक है — द्वेष रखना धारक को विषाक्त करता है। महामृत्युंजय मन्त्र सिखाता है कि मुक्ति मृत्यु पर विजय से नहीं, आसक्ति छोड़ने से आती है। अपनी तीव्रता को प्रतिशोध से नहीं, चिकित्सा में बदलें।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Vedic Context', hi: 'पौराणिक कथा एवं वैदिक संदर्भ' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Scorpion in Hindu Mythology', hi: 'हिन्दू पौराणिक कथाओं में वृश्चिक' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mars in the Puranas', hi: 'पुराणों में मंगल' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.vedic)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BS" chapter="Brihat Samhita — Mars and Transformation Associations" />
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Vrishchika governs the reproductive organs, excretory system, pelvis, bladder, and the colon — the organs of generation, elimination, and transformation. As a water sign ruled by Mars, Scorpio natives are susceptible to disorders of the reproductive system — STIs, menstrual irregularities, prostate issues, and pelvic inflammatory conditions. The excretory system is vulnerable to hemorrhoids, fistulas, and chronic constipation. Mars\'s surgical association means Scorpio natives are more likely than other signs to require surgical intervention at some point in their lives. Infections, especially in the urogenital area, are signature health challenges. When Mars is strong and well-placed, the native possesses remarkable recuperative power — Scorpio can recover from illnesses that would debilitate other signs. They have strong immune defenses, powerful detoxification capacity, and an instinctive understanding of what the body needs to heal. A weak or afflicted Mars manifests as chronic reproductive health issues, frequent infections (especially fungal and bacterial), inflammatory conditions, surgical complications, and a tendency toward self-destructive habits — substance abuse, extreme fasting, or pushing through illness instead of resting. Ayurvedically, Vrishchika is predominantly Pitta — Mars\'s fire in water creates steam, which manifests as intense metabolic fire but also inflammatory tendencies. Dietary recommendations emphasize cooling anti-inflammatory foods: turmeric, neem, aloe vera juice, pomegranate, and bitter greens. Avoid excessively spicy, fermented, and acidic foods that inflame Pitta. Red meat and alcohol are particularly aggravating for this constitution. Exercise should be intense but controlled — martial arts, power yoga, high-intensity interval training, and competitive sports channel Mars\'s warrior energy productively. Swimming combines the water element with physical intensity. Mentally, Vrishchika natives are prone to obsessive thought patterns, inability to let go of grudges, and psychological intensity that can become self-consuming — regular emotional release through therapy, intense physical exercise, or transformative spiritual practices (Vipassana, shamanic breathwork) is essential rather than optional.', hi: 'वृश्चिक प्रजनन अंगों, उत्सर्जन तन्त्र, श्रोणि, मूत्राशय और बृहदान्त्र का शासक है — उत्पत्ति, उन्मूलन और रूपान्तरण के अंग। मंगल शासित जल राशि होने से वृश्चिक जातक प्रजनन तन्त्र विकारों — STI, मासिक अनियमितता, प्रोस्टेट समस्याएँ और श्रोणि शोथ — के प्रति संवेदनशील। उत्सर्जन तन्त्र बवासीर, भगन्दर और पुराने कब्ज से भेद्य। मंगल का शल्य सम्बन्ध — शल्य हस्तक्षेप की अधिक सम्भावना। संक्रमण, विशेषकर मूत्रजननांग क्षेत्र में, विशिष्ट स्वास्थ्य चुनौतियाँ। बली मंगल में उल्लेखनीय स्वास्थ्य लाभ शक्ति — वृश्चिक उन रोगों से ठीक हो सकता है जो अन्य राशियों को दुर्बल कर दें। दुर्बल मंगल — पुरानी प्रजनन स्वास्थ्य समस्याएँ, बार-बार संक्रमण, शोथ स्थितियाँ, शल्य जटिलताएँ और आत्म-विनाशकारी आदतें। आयुर्वेदिक रूप से वृश्चिक प्रधानतः पित्त — जल में मंगल की अग्नि भाप बनाती है। आहार में शीतल शोथ-रोधी — हल्दी, नीम, एलोवेरा रस, अनार और कड़वी हरी सब्जियाँ। अत्यधिक तीखे, किण्वित और अम्लीय पदार्थ वर्जित। व्यायाम तीव्र किन्तु नियन्त्रित — मार्शल आर्ट्स, पावर योग, HIIT। तैराकी जल तत्त्व और शारीरिक तीव्रता संयोजित। मानसिक रूप से जुनूनी विचार प्रतिमान, क्षमा में असमर्थता और आत्म-उपभोगी मनोवैज्ञानिक तीव्रता — चिकित्सा, तीव्र व्यायाम या रूपान्तरकारी आध्यात्मिक साधना से नियमित भावनात्मक मुक्ति अनिवार्य।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Reproductive organs, excretory system, pelvis, bladder, colon, prostate/uterus, urogenital tract', hi: 'प्रजनन अंग, उत्सर्जन तन्त्र, श्रोणि, मूत्राशय, बृहदान्त्र, प्रोस्टेट/गर्भाशय, मूत्रजननांग मार्ग' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Pitta dominant (fire-in-water). Favour cooling, anti-inflammatory foods. Avoid excess spicy, fermented, and acidic items. Intense but controlled exercise essential. Emotional release practices mandatory.', hi: 'पित्त प्रधान (जल में अग्नि)। शीतल, शोथ-रोधी आहार अनुकूल। अतिरिक्त तीखे, किण्वित और अम्लीय पदार्थ वर्जित। तीव्र किन्तु नियन्त्रित व्यायाम अनिवार्य। भावनात्मक मुक्ति साधना अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Vrishchika in chart interpretation means identifying where Mars\'s intense, transformative, and penetrating energy operates in the native\'s life. Where Scorpio falls reveals where you experience the deepest crises and the most profound transformations — and where the power to destroy and regenerate is concentrated.', hi: 'कुण्डली व्याख्या में वृश्चिक को समझने का अर्थ है पहचानना कि मंगल की तीव्र, रूपान्तरकारी और भेदक ऊर्जा जातक के जीवन में कहाँ कार्य करती है। वृश्चिक जहाँ पड़ता है वहाँ गहनतम संकट और सबसे गहन रूपान्तरण — और विनाश और पुनर्जनन की शक्ति केन्द्रित है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Vrishchika is your Lagna', hi: 'यदि वृश्चिक आपका लग्न है' }, content: { en: 'Mars becomes your lagna lord, making intensity, transformation, and hidden power the defining qualities of your personality. Vishakha pada 4 (Jupiter nakshatra) creates a zealously purposeful personality that pursues goals with obsessive determination — the missionary or crusader archetype. Anuradha lagna (Saturn nakshatra) produces the most disciplined and devotionally loyal Scorpio — Saturn\'s structure channels Mars\'s intensity into sustained commitment. Jyeshtha lagna (Mercury nakshatra) creates a psychologically complex elder-statesman personality with protective authority and sharp intellect. Mars as lagna lord makes physical fitness and courage non-negotiable life themes — a sedentary Scorpio rising is a deeply unhappy one.', hi: 'मंगल लग्नेश बनता है — तीव्रता, रूपान्तरण और छिपी शक्ति व्यक्तित्व के परिभाषित गुण। विशाखा पद 4 (गुरु नक्षत्र) उत्साहपूर्ण उद्देश्यपूर्ण व्यक्तित्व। अनुराधा लग्न (शनि नक्षत्र) सबसे अनुशासित और भक्तिपूर्ण वफादार वृश्चिक। ज्येष्ठा लग्न (बुध नक्षत्र) मनोवैज्ञानिक रूप से जटिल बड़ा-राजनेता व्यक्तित्व। मंगल लग्नेश शारीरिक तन्दुरुस्ती और साहस को अनिवार्य जीवन विषय बनाता है।' } },
            { title: { en: 'If Vrishchika is your Moon sign', hi: 'यदि वृश्चिक आपकी चन्द्र राशि है' }, content: { en: 'Moon is debilitated in Scorpio — this is one of the most emotionally intense placements in Jyotish. The mind is deeply perceptive, psychologically aware, and intensely private. Emotions run deep but are rarely shown on the surface. This placement creates extraordinary emotional courage — the ability to confront truths that others cannot bear to face. However, it also creates a tendency toward jealousy, possessiveness, and emotional manipulation when the native feels threatened. Anuradha Moon creates deep devotional attachment — loyalty so intense it becomes a defining life theme. Jyeshtha Moon produces protective, elder-sibling-type emotional patterns — the native instinctively shields loved ones from danger.', hi: 'वृश्चिक में चन्द्र नीच — ज्योतिष में सबसे भावनात्मक रूप से तीव्र स्थानों में से एक। मन गहन अवलोकनशील, मनोवैज्ञानिक रूप से जागरूक और तीव्र रूप से निजी। भावनाएँ गहरी किन्तु सतह पर शायद ही दिखती हैं। असाधारण भावनात्मक साहस — जो सत्य दूसरे सहन नहीं कर सकते उनका सामना करने की क्षमता। किन्तु ईर्ष्या, अधिकार भावना और भावनात्मक छलकपट की प्रवृत्ति। अनुराधा चन्द्र गहन भक्तिपूर्ण लगाव। ज्येष्ठा चन्द्र रक्षात्मक बड़े-भाई-बहन भावनात्मक प्रतिमान।' } },
            { title: { en: 'Vrishchika in divisional charts', hi: 'विभागीय कुण्डलियों में वृश्चिक' }, content: { en: 'In Navamsha (D9), Vrishchika indicates a spouse who is intense, secretive, transformative, and possibly connected to research, medicine, occult sciences, or crisis management. In Dashamsha (D10), it suggests careers in surgery, forensic science, criminal investigation, psychology, occult research, mining, insurance, or any field involving penetration beneath surfaces.', hi: 'नवांश (D9) में वृश्चिक जीवनसाथी को इंगित करता है जो तीव्र, गोपनीय, रूपान्तरकारी और सम्भवतः शोध, चिकित्सा, गूढ़ विज्ञान या संकट प्रबन्धन से जुड़ा। दशमांश (D10) में शल्य, फोरेंसिक विज्ञान, आपराधिक अन्वेषण, मनोविज्ञान, गूढ़ शोध, खनन, बीमा या सतह के नीचे भेदन वाले क्षेत्र में करियर।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Scorpio is vengeful. Reality: Scorpio has a long memory and a strong sense of justice — what appears as revenge is often the delayed enforcement of a boundary that was violated. Misconception: Scorpio is obsessed with death. Reality: Scorpio understands that death is part of the transformation cycle — they are obsessed with truth, not death. Misconception: Scorpio is manipulative. Reality: Scorpio understands power dynamics instinctively — using that understanding to manipulate or to protect depends on the chart\'s overall dignity. Misconception: Scorpio cannot trust. Reality: Scorpio trusts completely once their rigorous vetting process is passed — the issue is that most people cannot pass it.', hi: 'भ्रान्ति: वृश्चिक प्रतिशोधी है। सत्य: वृश्चिक की लम्बी स्मृति और न्याय बोध — जो प्रतिशोध दिखता है वह प्रायः उल्लंघित सीमा का विलम्बित प्रवर्तन। भ्रान्ति: वृश्चिक मृत्यु से ग्रस्त है। सत्य: वृश्चिक समझता है कि मृत्यु रूपान्तरण चक्र का भाग — सत्य से ग्रस्त, मृत्यु से नहीं। भ्रान्ति: वृश्चिक छलपूर्ण है। सत्य: वृश्चिक शक्ति गतिशीलता सहज रूप से समझता है — उपयोग कुण्डली की समग्र गरिमा पर निर्भर। भ्रान्ति: वृश्चिक विश्वास नहीं कर सकता। सत्य: कठोर जाँच प्रक्रिया पार होने पर पूर्ण विश्वास — समस्या अधिकांश लोग पार नहीं कर पाते।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Vrishchika in a chart reveals where the native confronts the deepest truths, experiences the most profound transformations, and holds the greatest hidden power. The house where Scorpio falls is where you will face your fears, die metaphorically, and be reborn — and where the courage to embrace that process determines whether the power becomes destructive or regenerative.', hi: 'कुण्डली में वृश्चिक पढ़ना बताता है कि जातक कहाँ गहनतम सत्यों का सामना करता है, सबसे गहन रूपान्तरण अनुभव करता है, और सबसे बड़ी छिपी शक्ति रखता है। जिस भाव में वृश्चिक पड़ता है वहाँ अपने भयों का सामना, रूपक मृत्यु और पुनर्जन्म — और उस प्रक्रिया को स्वीकार करने का साहस निर्धारित करता है कि शक्ति विनाशकारी बनती है या पुनर्जनक।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Vrishchika as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Vrishchika as House Cusp', hi: 'भाव शिखर के रूप में वृश्चिक' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Vrishchika falls on different house cusps, it brings Mars\'s intense, transformative, and penetrating energy to that life domain. Here is how Scorpio colours each house:', hi: 'जब वृश्चिक विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में मंगल की तीव्र, रूपान्तरकारी और भेदक ऊर्जा लाता है। यहाँ वृश्चिक प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Mars-ruled personality — intense gaze, magnetic presence, powerful physique. Deep psychological awareness. Transformation is a constant life theme. Others sense hidden power.', hi: 'मंगल शासित व्यक्तित्व — तीव्र दृष्टि, चुम्बकीय उपस्थिति, शक्तिशाली काया। गहन मनोवैज्ञानिक जागरूकता। रूपान्तरण निरन्तर जीवन विषय। दूसरे छिपी शक्ति अनुभव करते हैं।' } },
            { house: '2nd', effect: { en: 'Wealth through hidden channels — inheritance, insurance, research. Powerful, penetrating speech. Family secrets and deep family bonds. Financial crises followed by complete regeneration.', hi: 'छिपे माध्यमों से धन — विरासत, बीमा, शोध। शक्तिशाली, भेदक वाणी। पारिवारिक रहस्य और गहरे पारिवारिक बन्धन। वित्तीय संकट के बाद पूर्ण पुनर्जनन।' } },
            { house: '3rd', effect: { en: 'Intense, probing communication style. Writing about hidden truths, investigations, and psychology. Complex sibling dynamics with deep bonds. Short travels for research or investigative purposes.', hi: 'तीव्र, परीक्षण संवाद शैली। छिपे सत्य, अन्वेषण और मनोविज्ञान पर लेखन। गहरे बन्धन वाले जटिल भाई-बहन गतिशीलता। शोध या अन्वेषण हेतु लघु यात्राएँ।' } },
            { house: '4th', effect: { en: 'Intense emotional depth at home. Family secrets and transformative childhood experiences. Property through inheritance or hidden sources. Emotional security through psychological self-knowledge.', hi: 'घर पर तीव्र भावनात्मक गहराई। पारिवारिक रहस्य और रूपान्तरकारी बचपन अनुभव। विरासत या छिपे स्रोतों से सम्पत्ति। मनोवैज्ञानिक आत्मज्ञान से भावनात्मक सुरक्षा।' } },
            { house: '5th', effect: { en: 'Creative expression through intensity — dark art, psychological drama, transformative performance. Deep, all-consuming romantic experiences. Children with strong personalities and hidden depths.', hi: 'तीव्रता से सृजनात्मक अभिव्यक्ति — गहन कला, मनोवैज्ञानिक नाटक। गहरे, सर्वग्राही रोमांटिक अनुभव। दृढ़ व्यक्तित्व और छिपी गहराई वाली सन्तान।' } },
            { house: '6th', effect: { en: 'Reproductive and excretory health issues. Powerful enemies but equally powerful ability to defeat them. Service in crisis management, surgery, or forensics. Transforms through overcoming disease.', hi: 'प्रजनन और उत्सर्जन स्वास्थ्य समस्याएँ। शक्तिशाली शत्रु किन्तु समान रूप से शक्तिशाली पराजय क्षमता। संकट प्रबन्धन, शल्य या फोरेंसिक में सेवा। रोग पर विजय से रूपान्तरण।' } },
            { house: '7th', effect: { en: 'Spouse is intense, secretive, and transformative. Marriage involves deep power dynamics and emotional intensity. Business partnerships in research, insurance, or occult fields. Relationships transform the native completely.', hi: 'जीवनसाथी तीव्र, गोपनीय और रूपान्तरकारी। विवाह में गहन शक्ति गतिशीलता और भावनात्मक तीव्रता। शोध, बीमा या गूढ़ क्षेत्रों में व्यापारिक साझेदारी। सम्बन्ध जातक को पूर्णतः रूपान्तरित।' } },
            { house: '8th', effect: { en: 'Scorpio in its natural house — extraordinary occult power, deep research ability, and transformative capacity. Inheritance is significant. Sexual and psychological depth. Long life through regenerative capacity.', hi: 'वृश्चिक अपने स्वाभाविक भाव में — असाधारण गूढ़ शक्ति, गहन शोध क्षमता और रूपान्तरकारी सामर्थ्य। विरासत महत्वपूर्ण। यौन और मनोवैज्ञानिक गहराई। पुनर्जनन क्षमता से दीर्घायु।' } },
            { house: '9th', effect: { en: 'Dharma through transformative truth-seeking. Father is intense and possibly connected to occult or research. Fortune through crisis navigation and hidden knowledge. Pilgrimage to places of transformation and power.', hi: 'रूपान्तरकारी सत्य-खोज से धर्म। पिता तीव्र और सम्भवतः गूढ़ या शोध से जुड़े। संकट नेविगेशन और गूढ़ ज्ञान से भाग्य। रूपान्तरण और शक्ति स्थानों की तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Career in surgery, research, psychology, criminal investigation, crisis management, or occult sciences. Public reputation for intensity and hidden power. Career involves multiple transformations and reinventions.', hi: 'शल्य, शोध, मनोविज्ञान, आपराधिक अन्वेषण, संकट प्रबन्धन या गूढ़ विज्ञान में करियर। तीव्रता और छिपी शक्ति की सार्वजनिक प्रतिष्ठा। करियर में अनेक रूपान्तरण और पुनर्आविष्कार।' } },
            { house: '11th', effect: { en: 'Gains through hidden channels and powerful networks. Friends are influential and secretive. Aspirations involve systemic transformation — changing structures from within. Elder siblings have intense personalities.', hi: 'छिपे माध्यमों और शक्तिशाली नेटवर्क से लाभ। मित्र प्रभावशाली और गोपनीय। व्यवस्थित रूपान्तरण — भीतर से संरचनाएँ बदलने की आकांक्षाएँ। बड़े भाई-बहन तीव्र व्यक्तित्व।' } },
            { house: '12th', effect: { en: 'Expenditure on hidden pursuits and occult research. Foreign residence connected to transformative experiences. Spiritual growth through confronting deepest fears and shadow work. Powerful dream life with prophetic and cathartic quality.', hi: 'गूढ़ साधनाओं और गुप्त शोध पर व्यय। रूपान्तरकारी अनुभवों से जुड़ा विदेशी निवास। गहनतम भयों और छाया कार्य से आध्यात्मिक विकास। भविष्यसूचक और विरेचक गुणवत्ता वाला शक्तिशाली स्वप्न जीवन।' } },
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
        ml({ en: 'Vrishchika (Scorpio) is the fixed water sign ruled by Mars — the seat of transformation, hidden power, and the death-rebirth cycle in the zodiac.', hi: 'वृश्चिक मंगल द्वारा शासित स्थिर जल राशि है — राशिचक्र में परिवर्तन, छिपी शक्ति और मृत्यु-पुनर्जन्म चक्र का स्थान।' }),
        ml({ en: 'Mars owns Scorpio (second sign). Moon is debilitated at 3°. Ketu is considered exalted here by many traditions. No planet has moolatrikona in Scorpio.', hi: 'मंगल वृश्चिक का स्वामी (दूसरी राशि)। चन्द्र 3° पर नीच। केतु यहाँ अनेक परम्पराओं में उच्च माना जाता है। वृश्चिक में किसी ग्रह का मूलत्रिकोण नहीं।' }),
        ml({ en: 'Nakshatras: Vishakha pada 4 (Jupiter), Anuradha (Saturn), Jyeshtha (Mercury). Each brings zealous purpose, loyal devotion, and protective authority.', hi: 'नक्षत्र: विशाखा पाद 4 (गुरु), अनुराधा (शनि), ज्येष्ठा (बुध)। प्रत्येक उत्साही उद्देश्य, वफादार भक्ति और रक्षात्मक अधिकार लाता है।' }),
        ml({ en: 'Scorpio natives transform through crisis and emerge stronger. Remedy: worship Shiva Mahakal, chant Mahamrityunjaya Mantra, wear red coral, and learn to forgive.', hi: 'वृश्चिक जातक संकट से रूपान्तरित होकर और शक्तिशाली उभरते हैं। उपाय: शिव महाकाल पूजा, महामृत्युंजय मन्त्र, मूँगा धारण, और क्षमा करना सीखें।' }),
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
