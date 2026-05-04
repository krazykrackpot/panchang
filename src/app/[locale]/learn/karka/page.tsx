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
  { devanagari: 'कर्क', transliteration: 'Karka', meaning: { en: 'The Crab — the fourth sign, symbol of protection, nurturing, and emotional depth', hi: 'कर्क — चतुर्थ राशि, रक्षा, पोषण और भावनात्मक गहनता का प्रतीक' } },
  { devanagari: 'जल तत्त्व', transliteration: 'Jala Tattva', meaning: { en: 'Water element — emotional, intuitive, receptive, flowing', hi: 'जल तत्त्व — भावनात्मक, अन्तर्ज्ञानी, ग्राही, प्रवाहमान' } },
  { devanagari: 'चर राशि', transliteration: 'Chara Rashi', meaning: { en: 'Cardinal/movable sign — initiates emotional connections and domestic action', hi: 'चर राशि — भावनात्मक सम्बन्ध और गृहस्थ कर्म आरम्भ करने वाली' } },
  { devanagari: 'चन्द्र क्षेत्र', transliteration: 'Chandra Kshetra', meaning: { en: 'Domain of the Moon — Karka is the Moon\'s only home and own sign', hi: 'चन्द्र का क्षेत्र — कर्क चन्द्रमा का एकमात्र गृह और स्वराशि' } },
  { devanagari: 'मातृ भाव', transliteration: 'Matri Bhava', meaning: { en: 'The maternal principle — Karka embodies the universal mother archetype', hi: 'मातृ भाव — कर्क सार्वभौमिक माता मूलरूप' } },
  { devanagari: 'उच्च गुरु', transliteration: 'Uchcha Guru', meaning: { en: 'Exalted Jupiter — Jupiter reaches its highest dignity at 5° Karka', hi: 'उच्च गुरु — बृहस्पति 5° कर्क पर सर्वोच्च गरिमा' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Water (Jala)', hi: 'जल तत्त्व' },
  modality: { en: 'Cardinal (Chara)', hi: 'चर (Cardinal)' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्री (स्त्रीलिंग)' },
  ruler: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' },
  symbol: { en: 'The Crab', hi: 'कर्कट (केंकड़ा)' },
  degreeRange: { en: '90° to 120° of the zodiac', hi: 'राशि चक्र का 90° से 120°' },
  direction: { en: 'North (Uttara)', hi: 'उत्तर दिशा' },
  season: { en: 'Grishma (Summer — peak)', hi: 'ग्रीष्म ऋतु (चरम)' },
  color: { en: 'White / Silver / Pale', hi: 'श्वेत / रजत / पीला' },
  bodyPart: { en: 'Chest, breasts, stomach, womb, lymphatic system', hi: 'वक्ष, स्तन, उदर, गर्भाशय, लसीका तन्त्र' },
  caste: { en: 'Brahmana (Priestly)', hi: 'ब्राह्मण' },
  nature: { en: 'Saumya (Gentle/Benefic)', hi: 'सौम्य (शान्त/शुभ)' },
};

// ─── Nakshatras in Karka ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Punarvasu (Pada 4)', hi: 'पुनर्वसु (पाद 4)' },
    range: { en: '90° - 93°20\' (0°-3°20\' Karka)', hi: '90° - 93°20\' (0°-3°20\' कर्क)' },
    ruler: { en: 'Jupiter', hi: 'गुरु (बृहस्पति)' },
    deity: { en: 'Aditi (Cosmic Mother)', hi: 'अदिति (ब्रह्माण्डीय माता)' },
    qualities: { en: 'The final pada of Punarvasu falls in Cancer, combining Jupiter\'s expansive wisdom with the Moon\'s emotional depth. This is the most nurturing expression of Punarvasu — "return of the light" manifests as returning home, emotional renewal, and the restoration of inner peace after crisis. The native has an instinctive ability to create emotional safe havens for others. Maternal wisdom guides their teaching and counseling. Jupiter exalted at 5° falls just beyond this nakshatra\'s boundary, but the Jovian energy permeates the early degrees of Cancer with philosophical depth and spiritual optimism.', hi: 'पुनर्वसु का अन्तिम पाद कर्क में — गुरु के विस्तृत ज्ञान और चन्द्र की भावनात्मक गहनता का संयोग। पुनर्वसु की सबसे पोषक अभिव्यक्ति — "प्रकाश की वापसी" गृह वापसी, भावनात्मक नवीकरण और संकट के बाद आन्तरिक शान्ति की पुनर्स्थापना। दूसरों के लिए भावनात्मक सुरक्षित आश्रय बनाने की सहज क्षमता।' },
  },
  {
    name: { en: 'Pushya', hi: 'पुष्य' },
    range: { en: '93°20\' - 106°40\' (3°20\'-16°40\' Karka)', hi: '93°20\' - 106°40\' (3°20\'-16°40\' कर्क)' },
    ruler: { en: 'Saturn', hi: 'शनि' },
    deity: { en: 'Brihaspati (Guru of the Gods)', hi: 'बृहस्पति (देवगुरु)' },
    qualities: { en: 'Pushya is considered the most auspicious nakshatra — "the nourisher" who feeds both body and spirit. Saturn\'s discipline in the Moon\'s sign creates structured nurturing: the parent who establishes routines, the teacher who demands excellence with love, the organization that feeds the hungry. This is the nakshatra of institutional care — hospitals, schools, temples, and orphanages. The native has an old soul, mature beyond their years, with a deep sense of duty to family and community. Pushya Nakshatra is considered so auspicious that activities begun under it rarely fail. Emotionally steady despite Cancer\'s fluctuations, grounded by Saturn\'s sobering influence.', hi: 'पुष्य सबसे शुभ नक्षत्र — "पोषक" जो शरीर और आत्मा दोनों का पोषण। चन्द्र की राशि में शनि का अनुशासन संरचित पोषण: दिनचर्या स्थापित करने वाले माता-पिता, प्रेम से उत्कृष्टता माँगने वाले शिक्षक। संस्थागत देखभाल का नक्षत्र — अस्पताल, विद्यालय, मन्दिर। प्राचीन आत्मा, आयु से परे परिपक्व, परिवार और समुदाय के प्रति कर्तव्य।' },
  },
  {
    name: { en: 'Ashlesha', hi: 'आश्लेषा' },
    range: { en: '106°40\' - 120° (16°40\'-30° Karka)', hi: '106°40\' - 120° (16°40\'-30° कर्क)' },
    ruler: { en: 'Mercury', hi: 'बुध' },
    deity: { en: 'Sarpa (Serpent deities / Naga)', hi: 'सर्प (नाग देवता)' },
    qualities: { en: 'The serpent\'s embrace — Ashlesha is the most psychologically complex nakshatra in Cancer. Mercury\'s analytical intelligence applied through the Moon\'s emotional lens creates penetrating emotional insight that borders on manipulation. The native reads people with uncanny accuracy, sensing hidden motives, suppressed emotions, and unspoken fears. Excellent for psychology, occult research, detective work, pharmaceutical chemistry, and any field requiring deep knowledge of hidden processes. The serpent symbolism suggests both poison and medicine — the native can heal or harm with equal skill. Kundalini energy is potent here. Can be emotionally toxic, manipulative, and possessive when operating from the shadow.', hi: 'सर्प का आलिंगन — आश्लेषा कर्क का मनोवैज्ञानिक रूप से सबसे जटिल नक्षत्र। चन्द्र के भावनात्मक लेंस से बुध की विश्लेषणात्मक बुद्धि — हेरफेर की सीमा तक भेदक भावनात्मक अन्तर्दृष्टि। छिपे उद्देश्य, दबी भावनाएँ अद्भुत सटीकता से पढ़ना। मनोविज्ञान, गुप्त शोध, जासूसी, औषध रसायन के लिए उत्कृष्ट। सर्प प्रतीक — विष और औषधि दोनों।' },
  },
];

// ─── Planetary Dignities ───────────────────────────────────────────────
const PLANETARY_DIGNITIES = {
  exalted: [
    { planet: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)' }, degree: { en: '5° Karka', hi: '5° कर्क' }, effect: { en: 'Jupiter is exalted in Cancer — wisdom nourished by emotional intelligence reaches its peak expression. This is the guru who teaches through love, the philosopher who understands that knowledge without compassion is sterile. The native possesses profound wisdom that flows from emotional depth rather than intellectual accumulation. They are the counselors, the spiritual mothers/fathers, the teachers who transform students through care rather than rigor. Wealth comes through nurturing professions — education, healthcare, hospitality, real estate. Children are typically wise, emotionally mature, and spiritually inclined. At 5°, in the heart of Pushya nakshatra territory, Jupiter\'s blessing is at its most potent.', hi: 'गुरु कर्क में उच्च — भावनात्मक बुद्धि से पोषित ज्ञान शिखर अभिव्यक्ति। प्रेम से सिखाने वाला गुरु, करुणा बिना ज्ञान बाँझ समझने वाला दार्शनिक। बौद्धिक संचय नहीं भावनात्मक गहनता से प्रवाहित गहन ज्ञान। परामर्शदाता, आध्यात्मिक माता-पिता, देखभाल से छात्रों को रूपान्तरित करने वाले शिक्षक। 5° पर पुष्य क्षेत्र में गुरु का आशीर्वाद सर्वाधिक शक्तिशाली।' } },
  ],
  debilitated: [
    { planet: { en: 'Mars (Mangal)', hi: 'मंगल' }, degree: { en: '28° Karka', hi: '28° कर्क' }, effect: { en: 'Mars is debilitated in Cancer — the warrior drowns in emotional waters. Aggression turns inward as passive-aggressive behavior, suppressed anger, and emotional volatility. The native fights for home, family, and mother but may do so destructively — domestic conflicts, property disputes, and family feuds are common. At 28° in Ashlesha nakshatra, Mars\'s debilitation reaches its depth in the serpent\'s territory — anger becomes venomous rather than direct, and confrontation takes the form of emotional manipulation rather than honest combat. However, Neecha Bhanga (cancellation of debilitation) can transform this into fierce maternal protection — the lioness defending her cubs.', hi: 'मंगल कर्क में नीच — योद्धा भावनात्मक जल में डूबता है। आक्रामकता अन्तर्मुखी — निष्क्रिय-आक्रामक व्यवहार, दबा क्रोध, भावनात्मक अस्थिरता। 28° पर आश्लेषा में नीच गहनतम — क्रोध प्रत्यक्ष नहीं विषैला, ईमानदार युद्ध नहीं भावनात्मक हेरफेर। नीच भंग उग्र मातृ रक्षा में रूपान्तर — शावकों की रक्षा करती सिंहनी।' } },
  ],
  ownSign: [
    { planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' }, range: { en: '90° - 120° (full sign)', hi: '90° - 120° (पूर्ण राशि)' }, effect: { en: 'The Moon rules Cancer and is completely at home here — the mother in her own kitchen, the queen in her own palace. This is the Moon at its most nurturing, emotionally expressive, and intuitively powerful. The native has extraordinary emotional intelligence — they sense moods, read atmospheres, and respond to unspoken needs with preternatural accuracy. Memory is powerful and emotionally charged — they remember how things felt, not just what happened. The home is their temple, family their religion, and cooking their meditation. Unlike the Moon exalted in Taurus (peaceful contentment), Moon in Cancer is actively nurturing — constantly feeding, protecting, and emotionally engaging with those in their care.', hi: 'चन्द्रमा कर्क का स्वामी और पूर्णतः स्वगृह में — माता अपने रसोईघर में, रानी अपने महल में। सर्वाधिक पोषक, भावनात्मक रूप से अभिव्यंजक और अन्तर्ज्ञानी रूप से शक्तिशाली चन्द्र। असाधारण भावनात्मक बुद्धि — मनोदशा अनुभव, वातावरण पढ़ना, अनकहे आवश्यकताओं की प्रतिक्रिया। स्मृति शक्तिशाली और भावनात्मक रूप से आवेशित। गृह मन्दिर, परिवार धर्म, पाककला ध्यान।' } },
  ],
};

// ─── Each Planet in Karka ──────────────────────────────────────────────
const PLANETS_IN_SIGN: { planet: ML; dignity: string; effect: ML }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Friend\'s sign',
    effect: { en: 'The Sun in the Moon\'s sign — the king at home with his mother. Authority is expressed through nurturing and emotional leadership rather than command. The native leads by caring — they are the boss who remembers birthdays, the politician who connects with voters\' feelings, the father who is emotionally present. Government roles in welfare, healthcare, education, and family services suit this placement. The father-mother relationship is significant — the native often reconciles the solar (paternal) and lunar (maternal) principles in their personality. Can be moody in authority, taking professional criticism personally, and too emotionally invested in subordinates\' problems.', hi: 'चन्द्र की राशि में सूर्य — माता के साथ गृह में राजा। आदेश नहीं पोषण और भावनात्मक नेतृत्व से अधिकार। जन्मदिन याद रखने वाला अधिकारी, मतदाताओं की भावनाओं से जुड़ने वाला राजनेता। कल्याण, स्वास्थ्य, शिक्षा, पारिवारिक सेवाओं में शासकीय भूमिका। पिता-माता सम्बन्ध महत्त्वपूर्ण।' },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्रमा' },
    dignity: 'Own sign',
    effect: { en: 'The Moon in its own sign is the mother in her element — emotionally expressive, instinctively nurturing, and deeply attuned to the rhythms of nature and family. The native\'s emotional life is rich, vivid, and intensely experienced. They feel everything deeply — joy, sorrow, nostalgia, anticipation. The mother is typically the most important person in their life, for better or worse. Food, home, and family are central to their identity. They have an extraordinary memory for emotional experiences and an intuitive understanding of others\' feelings. Can be excessively clingy, moody, emotionally manipulative, and unable to let go of the past. Tidal emotional cycles follow the Moon\'s actual phases.', hi: 'चन्द्रमा स्वराशि में — माता अपने तत्त्व में, भावनात्मक रूप से अभिव्यंजक, सहज पोषक। जातक का भावनात्मक जीवन समृद्ध, जीवन्त और तीव्रता से अनुभव। सब कुछ गहनता से अनुभव — आनन्द, दुःख, उत्कण्ठा। माता प्रायः जीवन की सबसे महत्त्वपूर्ण व्यक्ति। भोजन, गृह, परिवार पहचान का केन्द्र। अत्यधिक चिपकू, मनमौजी, भावनात्मक रूप से हेरफेरी, अतीत न छोड़ पाना।' },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Debilitated (28°)',
    effect: { en: 'Mars debilitated in Cancer — aggressive energy trapped in emotional waters produces internal turbulence. The native may struggle with suppressed anger that manifests as passive-aggressive behavior, stomach problems, and domestic conflict. Property disputes, maternal relationship tension, and difficulty with emotional boundaries are common. At its worst, this placement creates the person who uses emotional guilt as a weapon. At its best, through Neecha Bhanga, it creates fierce protectors of family, home, and homeland — soldiers who fight from love rather than anger. Cooking with fire (Mars in water sign) can be a therapeutic outlet. Real estate, agriculture, and water-related engineering are constructive career channels.', hi: 'मंगल कर्क में नीच — भावनात्मक जल में फँसी आक्रामक ऊर्जा आन्तरिक अशान्ति। दबा क्रोध निष्क्रिय-आक्रामक व्यवहार, उदर समस्या, घरेलू संघर्ष। सम्पत्ति विवाद, मातृ सम्बन्ध तनाव। सबसे बुरा: भावनात्मक अपराधबोध हथियार के रूप में। सबसे अच्छा: नीच भंग से परिवार और मातृभूमि का उग्र रक्षक — प्रेम से लड़ने वाला सैनिक।' },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Enemy\'s sign',
    effect: { en: 'Mercury in the Moon\'s sign — the intellect submerged in emotion. The native thinks with their heart and feels with their mind, creating a unique emotional-intellectual hybrid intelligence. They are excellent at reading between the lines, understanding subtext, and communicating emotional truths that purely rational minds miss. Writing is evocative and emotionally resonant — poetry, memoir, and psychological fiction are natural genres. Business sense is strong for consumer-facing products because they instinctively understand what people want (emotionally). Can be too subjective in analysis, taking logical problems personally, and unable to separate facts from feelings.', hi: 'चन्द्र की राशि में बुध — भावना में डूबी बुद्धि। हृदय से विचार और मन से अनुभव — अद्वितीय भावनात्मक-बौद्धिक संकर बुद्धि। पंक्तियों के बीच पढ़ने, सन्दर्भ समझने और भावनात्मक सत्य संवाद में उत्कृष्ट। कविता, संस्मरण, मनोवैज्ञानिक कथा। उपभोक्ता उत्पादों के लिए सशक्त व्यापार समझ। विश्लेषण में अत्यधिक व्यक्तिपरक।' },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु (बृहस्पति)' },
    dignity: 'Exalted (5°)',
    effect: { en: 'Jupiter exalted in Cancer — the pinnacle of emotional wisdom. This is the most benefic planetary placement in Vedic astrology: the great benefic at its maximum strength in the sign of nurturing. The native radiates warmth, generosity, and deep wisdom that comes from emotional understanding rather than book learning. They are natural counselors, spiritual guides, and educators who transform through love. Wealth flows easily and is shared generously — they attract abundance by giving freely. Children are typically fortunate, wise, and devoted. The mother may be deeply spiritual or culturally prominent. At 5°, overlapping with Pushya nakshatra, this placement represents the highest ideal of the guru-parent: one who nourishes both body and soul.', hi: 'गुरु कर्क में उच्च — भावनात्मक ज्ञान का शिखर। वैदिक ज्योतिष में सबसे शुभ ग्रह स्थिति: पोषण की राशि में अधिकतम शक्ति पर महान शुभ। ऊष्मा, उदारता और पुस्तकीय ज्ञान नहीं भावनात्मक समझ से गहन ज्ञान। स्वाभाविक परामर्शदाता, आध्यात्मिक मार्गदर्शक, प्रेम से रूपान्तरित करने वाले शिक्षक। 5° पर पुष्य नक्षत्र — शरीर और आत्मा दोनों का पोषण करने वाले गुरु-माता/पिता।' },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Neutral',
    effect: { en: 'Venus in the Moon\'s sign — beauty expressed through emotional care and domestic artistry. The native creates beautiful homes, cooks exquisitely, and expresses love through tangible acts of care rather than words or grand gestures. Relationships are deeply nurturing — they love by feeding, protecting, and creating emotional security. Artistic expression has a sentimental, nostalgic quality — vintage aesthetics, family portraits, traditional crafts, and comfort food elevated to art. Wealth comes through hospitality, healthcare, food industry, and domestic products. Can be clingy in love, emotionally needy, and unable to distinguish between nurturing and controlling. Marriage brings emotional depth and domestic happiness.', hi: 'चन्द्र की राशि में शुक्र — भावनात्मक देखभाल और गृहस्थ कलात्मकता से सौन्दर्य। सुन्दर गृह, उत्कृष्ट पाककला, देखभाल के स्पर्शनीय कर्मों से प्रेम। कलात्मक अभिव्यक्ति भावुक, उत्कण्ठामयी — विन्टेज सौन्दर्यशास्त्र, पारिवारिक चित्र, पारम्परिक शिल्प। आतिथ्य, स्वास्थ्य, खाद्य उद्योग से धन। प्रेम में चिपकू, भावनात्मक रूप से अभावग्रस्त।' },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Enemy\'s sign',
    effect: { en: 'Saturn in the Moon\'s sign — duty and restriction in the house of emotions. The native\'s emotional expression is guarded, cautious, and often delayed. They may have experienced early childhood emotional deprivation — a distant mother, cold home environment, or premature responsibilities that forced adult maturity too soon. Emotional trust develops slowly but once given, is rock-solid and permanent. Excellent for institutional care, elder care, real estate management, and any profession requiring emotional discipline. The native is the emotional backbone of their family — carrying burdens silently and providing stability through their mere presence. Can be emotionally repressed, chronically anxious about security, and unable to express vulnerability.', hi: 'चन्द्र की राशि में शनि — भावनाओं के गृह में कर्तव्य और प्रतिबन्ध। भावनात्मक अभिव्यक्ति सतर्क, सावधान, प्रायः विलम्बित। प्रारम्भिक बाल्यावस्था में भावनात्मक अभाव — दूरवर्ती माता, शीतल गृह वातावरण। भावनात्मक विश्वास धीमा किन्तु दिये जाने पर चट्टान सदृश। संस्थागत देखभाल, वृद्ध देखभाल, भूसम्पत्ति प्रबन्धन के लिए उत्कृष्ट।' },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Neutral',
    effect: { en: 'Rahu in Cancer amplifies emotional desires to obsessive levels — the insatiable hunger for emotional security, maternal love, and belonging. The native may have experienced disrupted nurturing in early life, creating a lifelong quest for the perfect home, the perfect mother, the perfect emotional connection. They may idealize domestic life while simultaneously feeling like an outsider in their own family. Excellent for real estate investment, immigration services, food industry innovation, and creating emotional connections through media. Can produce smothering parents who project their unmet childhood needs onto their children. The growth direction (Ketu in Capricorn) asks them to develop self-sufficiency and find inner security rather than depending on external nurturing.', hi: 'कर्क में राहु भावनात्मक इच्छाओं को जुनूनी स्तर तक बढ़ाता है — भावनात्मक सुरक्षा, मातृ प्रेम और अपनत्व की अतृप्त भूख। प्रारम्भिक जीवन में बाधित पोषण — आदर्श गृह, आदर्श माता की आजीवन खोज। भूसम्पत्ति निवेश, खाद्य उद्योग नवाचार के लिए उत्कृष्ट। विकास दिशा (मकर में केतु) — आन्तरिक सुरक्षा।' },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Neutral',
    effect: { en: 'Ketu in Cancer indicates past-life mastery of nurturing, emotional connection, and domestic life — the soul has already been the devoted mother, the family patriarch, the guardian of home and tradition. In this life, the native may feel strangely detached from family expectations, uncomfortable with emotional displays, and unable to create the stable home that Cancer craves. They may physically leave their homeland or emotionally detach from their birth family. Food may be unappealing or eating patterns irregular. The growth direction (Rahu in Capricorn) pulls toward public achievement, career ambition, and building structure in the outer world rather than the inner domestic sphere. When integrated, creates spiritual teachers who have transcended family attachment while honoring family duty.', hi: 'कर्क में केतु पूर्वजन्म में पोषण, भावनात्मक सम्बन्ध और गृहस्थ जीवन में निपुणता। पारिवारिक अपेक्षाओं से विचित्र वैराग्य, भावनात्मक प्रदर्शन से असुविधा। भौतिक रूप से मातृभूमि छोड़ना या जन्म परिवार से भावनात्मक वैराग्य। विकास दिशा (मकर में राहु) — सार्वजनिक उपलब्धि और करियर महत्त्वाकांक्षा। एकीकृत होने पर पारिवारिक आसक्ति से परे किन्तु कर्तव्य का सम्मान करने वाले आध्यात्मिक शिक्षक।' },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY = {
  appearance: { en: 'Classical texts describe Karka natives as having a round or moon-shaped face with soft, expressive features. The body tends toward fullness, especially around the chest and stomach area. The complexion is typically pale or fair with a luminous quality — they seem to glow, especially under moonlight. Eyes are large, watery, and deeply expressive — you can read their entire emotional state in their eyes. Movement is indirect and sideways (like the crab) — they rarely approach anything directly, preferring to circle around before committing. The overall impression is of softness, receptivity, and quiet emotional power.', hi: 'शास्त्रीय ग्रन्थ कर्क जातकों को गोल या चन्द्राकार मुख — कोमल, अभिव्यंजक रूपरेखा। शरीर पूर्णता की ओर, विशेषतः वक्ष और उदर। वर्ण पीला या गोरा — दीप्तिमान गुणवत्ता, विशेषतः चाँदनी में। नेत्र बड़े, सजल, गहन अभिव्यंजक — नेत्रों में सम्पूर्ण भावनात्मक स्थिति। चाल अप्रत्यक्ष और पार्श्विक (केंकड़े सदृश)। समग्र प्रभाव कोमलता, ग्राह्यता और शान्त भावनात्मक शक्ति।' },
  strengths: { en: 'Emotional intelligence, nurturing instinct, protectiveness, intuition, memory, empathy, loyalty to family, ability to create comfort and safety, culinary talent, artistic sensitivity, tenacity (the crab\'s grip), adaptability to emotional environments, and the rare gift of making anyone feel like they belong.', hi: 'भावनात्मक बुद्धि, पोषक सहज प्रवृत्ति, रक्षात्मकता, अन्तर्ज्ञान, स्मृति, सहानुभूति, परिवार के प्रति निष्ठा, सुख और सुरक्षा रचने की क्षमता, पाककला प्रतिभा, कलात्मक संवेदनशीलता, दृढ़ता (केंकड़े की पकड़), और किसी को भी अपनत्व का अनुभव कराने का दुर्लभ वरदान।' },
  weaknesses: { en: 'Moodiness, emotional manipulation, clinginess, inability to let go of the past, passive-aggressive behavior, self-pity, tendency to mother everyone (including people who don\'t want it), insecurity masking as protectiveness, hoarding (emotional and material), difficulty with direct confrontation, and retreating into the shell at the first sign of criticism.', hi: 'मनमौजीपन, भावनात्मक हेरफेर, चिपकूपन, अतीत न छोड़ पाना, निष्क्रिय-आक्रामक व्यवहार, आत्मदया, सबका पालन-पोषण (अनिच्छुक लोगों का भी), रक्षात्मकता के मुखौटे में असुरक्षा, संग्रहण (भावनात्मक और भौतिक), प्रत्यक्ष संघर्ष में कठिनाई, आलोचना के संकेत पर कवच में छिपना।' },
  temperament: { en: 'Kapha-dominant (water-earth). Cool, moist, nurturing, but stagnant when imbalanced. The crab is a creature of the tides — Karka natives experience emotional cycles that mirror the Moon\'s waxing and waning. During the waxing phase they are generous, outgoing, and creatively productive. During the waning phase they withdraw, brood, and need solitude. Understanding this cycle is the key to Karka wellbeing. The remedy for Kapha imbalance is gentle movement: swimming, walking by water, gentle yoga, and creative expression that gives form to emotions. Suppressed emotions manifest as stomach problems, breast issues, and water retention.', hi: 'कफ प्रधान (जल-पृथ्वी)। शीतल, आर्द्र, पोषक, किन्तु असन्तुलन में स्थिर। केंकड़ा ज्वार-भाटा का प्राणी — कर्क जातक चन्द्र के शुक्ल-कृष्ण पक्ष सदृश भावनात्मक चक्र। शुक्ल पक्ष में उदार, बहिर्मुखी, सृजनात्मक। कृष्ण पक्ष में वापसी, चिन्तन, एकान्त। दबी भावनाएँ उदर समस्या और जल प्रतिधारण।' },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER = {
  suited: { en: 'Healthcare and nursing, psychology and counseling, early childhood education, hospitality and hotel management, restaurant and catering, real estate and property management, social work, elder care and hospice, marine biology and oceanography, dairy and agriculture, interior decoration and home staging, historical preservation, museum curation, maternal healthcare, midwifery, and any profession involving care of home, family, or community.', hi: 'स्वास्थ्य और नर्सिंग, मनोविज्ञान और परामर्श, बाल शिक्षा, आतिथ्य और होटल प्रबन्धन, रेस्तराँ और खानपान, भूसम्पत्ति, सामाजिक कार्य, वृद्ध देखभाल, समुद्री जीवविज्ञान, डेयरी और कृषि, आन्तरिक सज्जा, ऐतिहासिक संरक्षण, संग्रहालय, मातृ स्वास्थ्य, दाई, और गृह-परिवार-समुदाय की देखभाल।' },
  workStyle: { en: 'Karka natives work best in environments that feel like family — small teams with personal bonds, organizations with strong welfare cultures, and roles where they can nurture growth in others. They need emotional safety in the workplace: a trusting boss, supportive colleagues, and work that feels meaningful rather than merely profitable. They excel at building organizational culture, onboarding new employees, and creating spaces where people feel they belong. Large, impersonal corporations drain them unless they can create their own micro-culture within the larger structure. Their greatest professional strength is loyalty — once committed, they will defend their organization with the tenacity of the crab defending its shell.', hi: 'कर्क जातक परिवार जैसे वातावरण में सर्वोत्तम — व्यक्तिगत बन्धन वाली छोटी टीम, सशक्त कल्याण संस्कृति वाले संगठन, दूसरों के विकास का पोषण करने वाली भूमिकाएँ। कार्यस्थल में भावनात्मक सुरक्षा: विश्वसनीय अधिकारी, सहायक सहकर्मी। संगठनात्मक संस्कृति निर्माण में उत्कृष्ट। सबसे बड़ी व्यावसायिक शक्ति निष्ठा — केंकड़ा अपने कवच की दृढ़ता से रक्षा।' },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: [
    { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, reason: { en: 'Water-water trine — deep emotional understanding without words. Both signs operate on instinct, intuition, and unspoken emotional bonds. Scorpio\'s emotional intensity matches Cancer\'s emotional depth. Mars-Moon trine creates passionate yet protective partnership. Both are fiercely loyal and will defend each other against the world. The relationship is private, intense, and emotionally transformative. Can become co-dependent if neither maintains outside friendships.', hi: 'जल-जल त्रिकोण — शब्दों बिना गहन भावनात्मक समझ। दोनों सहज प्रवृत्ति, अन्तर्ज्ञान और अनकहे भावनात्मक बन्धनों से। वृश्चिक की भावनात्मक तीव्रता कर्क की भावनात्मक गहनता से मेल। मंगल-चन्द्र त्रिकोण भावुक किन्तु रक्षात्मक। सम्बन्ध निजी, तीव्र, भावनात्मक रूप से रूपान्तरकारी।' } },
    { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, reason: { en: 'Water trine with spiritual dimension — Cancer provides the nest, Pisces provides the dream. Moon-Jupiter compatibility creates a nurturing-wisdom axis that feels divinely ordained. Both signs are emotionally sensitive, intuitively connected, and oriented toward caring for others. Cancer grounds Pisces\' tendency to float away; Pisces lifts Cancer\'s tendency to cling. Together they create families that are both materially secure and spiritually rich.', hi: 'आध्यात्मिक आयाम के साथ जल त्रिकोण — कर्क घोंसला, मीन स्वप्न। चन्द्र-गुरु अनुकूलता पोषण-ज्ञान धुरी। दोनों भावनात्मक रूप से संवेदनशील, अन्तर्ज्ञानी रूप से जुड़े। कर्क मीन को भूमि देता; मीन कर्क को ऊँचा उठाता। भौतिक और आध्यात्मिक दोनों से समृद्ध परिवार।' } },
  ],
  challenging: [
    { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, reason: { en: 'Cardinal square — both want to lead but through fundamentally different methods. Aries charges ahead; Cancer circles protectively. Aries\' bluntness wounds Cancer\'s sensitivity; Cancer\'s moodiness frustrates Aries\' need for forward movement. Mars debilitated in Cancer tells the whole story — warrior energy is weakened by emotional waters. However, mature versions of this pairing create complete families: Aries provides and protects materially, Cancer nurtures and protects emotionally.', hi: 'चर वर्ग — दोनों नेतृत्व चाहते किन्तु मूलभूत रूप से भिन्न विधियों से। मेष की स्पष्टवादिता कर्क की संवेदनशीलता आहत; कर्क का मनमौजीपन मेष को निराश। कर्क में मंगल नीच पूरी कहानी। परिपक्व रूप में पूर्ण परिवार: मेष भौतिक रक्षा, कर्क भावनात्मक पोषण।' } },
    { sign: { en: 'Libra (Tula)', hi: 'तुला' }, reason: { en: 'Cardinal square from the other side — both are relationship-oriented but with incompatible needs. Cancer wants emotional intimacy and domestic privacy; Libra wants social elegance and public harmony. Cancer nurtures through food and touch; Libra nurtures through beauty and conversation. Moon-Venus can create initial attraction, but the fundamental discord between private emotion (Cancer) and public grace (Libra) creates ongoing tension. Both avoid direct confrontation, leading to unresolved issues that fester.', hi: 'दूसरी ओर से चर वर्ग — दोनों सम्बन्ध-उन्मुख किन्तु असंगत आवश्यकताओं से। कर्क भावनात्मक अन्तरंगता और गृहस्थ गोपनीयता; तुला सामाजिक शालीनता और सार्वजनिक सामंजस्य। कर्क भोजन और स्पर्श से पोषण; तुला सौन्दर्य और वार्ता से। निजी भावना और सार्वजनिक शालीनता के बीच मूलभूत विसंगति।' } },
  ],
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES = {
  deity: { en: 'Goddess Parvati (Divine Mother) and Lord Shiva as Ardhanarishwara (half-male, half-female) are primary deities for Karka natives. Parvati embodies the Moon\'s nurturing, protective energy — the mother who creates, sustains, and fiercely defends. The Chandra (Moon) deity Himself is worshipped on Mondays. Durga, Parvati\'s fierce form, represents Cancer\'s protective rage — the crab that clamps down when its family is threatened.', hi: 'देवी पार्वती (दिव्य माता) और भगवान शिव अर्धनारीश्वर कर्क जातकों के प्रमुख देवता। पार्वती चन्द्र की पोषक, रक्षात्मक ऊर्जा — सृजन, पालन और उग्र रक्षा करने वाली माता। सोमवार को चन्द्र देव की पूजा। दुर्गा पार्वती का उग्र रूप — कर्क का रक्षात्मक क्रोध, परिवार पर संकट में दबोचने वाला केंकड़ा।' },
  mantra: { en: 'The Moon beej mantra "Om Shraam Shreem Shraum Sah Chandraya Namah" should be chanted 11,000 times during Moon hora on Mondays. For daily practice, chant 108 times. The Chandra Kavacham or Lalita Sahasranama (for Parvati worship) are powerful monthly practices during the full moon.', hi: 'चन्द्र बीज मन्त्र "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः" सोमवार को चन्द्र होरा में 11,000 बार। दैनिक अभ्यास में 108 बार। चन्द्र कवचम् या ललिता सहस्रनाम (पार्वती पूजा) पूर्णिमा पर शक्तिशाली मासिक अभ्यास।' },
  practices: { en: 'Wear natural pearl (Moti) on the little finger of the right hand in silver setting on a Monday during Moon hora — only if prescribed by a qualified Jyotishi. Donate white rice, milk, white cloth, silver items, or white flowers on Mondays. Fasting on Mondays strengthens the Moon. Offer milk and water to a Shiva Lingam. Keep a silver bowl of water in the bedroom to absorb negative lunar energy. Spend time near water — rivers, lakes, or the ocean — to naturally harmonize with lunar rhythms. Cooking and feeding others is the most natural Cancer remedy.', hi: 'प्राकृतिक मोती दाहिने हाथ की कनिष्ठिका में रजत जड़ित सोमवार को चन्द्र होरा में — केवल योग्य ज्योतिषी के निर्देश पर। सोमवार को श्वेत चावल, दूध, श्वेत वस्त्र, रजत वस्तुएँ दान। सोमवार व्रत चन्द्र सशक्त। शिव लिंग पर दूध और जल। शयनकक्ष में रजत पात्र में जल। जल के समीप समय — नदी, झील, सागर। पाककला और दूसरों को खिलाना कर्क का सबसे स्वाभाविक उपाय।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: { en: 'The crab holds deep significance across multiple mythological traditions. In Vedic cosmology, Karka (the crab) represents the point of maximum lunar influence — the summer solstice, when the Sun reaches its northernmost point and begins its southern journey (Dakshinayana). This turning point mirrors the crab\'s sideways movement: the shift from expansion to contraction, from outward growth to inward reflection. The Moon\'s rulership connects Karka to Soma, the sacred plant-deity whose juice grants immortality, wisdom, and poetic inspiration. The chest and stomach — Cancer\'s body parts — are where we literally nourish ourselves and where we feel emotions most viscerally. The womb, Cancer\'s deepest symbol, is the original home: the first shelter, the primal ocean.', hi: 'केंकड़ा अनेक पौराणिक परम्पराओं में गहन महत्त्व रखता है। वैदिक ब्रह्माण्ड विज्ञान में कर्क अधिकतम चन्द्र प्रभाव — ग्रीष्म संक्रान्ति, जब सूर्य उत्तरतम बिन्दु पर और दक्षिणायन आरम्भ। यह मोड़ केंकड़े की पार्श्विक गति सदृश: विस्तार से संकुचन, बाहरी विकास से आन्तरिक चिन्तन। चन्द्र का शासन कर्क को सोम से जोड़ता है — अमरत्व, ज्ञान और काव्य प्रेरणा। गर्भ कर्क का गहनतम प्रतीक — मूल गृह: प्रथम आश्रय, आदि सागर।' },
  symbolism: { en: 'The crab carries its home on its back — this is the quintessential Cancer truth. Wherever the native goes, they carry their emotional world with them: memories, family bonds, cultural roots, and the invisible shelter of their inner life. The hard shell protects an incredibly soft interior — Cancer natives present a tough exterior precisely because their interior is so vulnerable. The pincers grip with extraordinary tenacity — once a Cancer loves, they never let go (for better or worse). The sideways approach symbolizes Cancer\'s indirect communication: they rarely say what they mean directly, preferring to circle around emotional truths through stories, humor, cooking, and acts of service. The lesson of Karka is that true strength is the courage to be vulnerable, and true power is the ability to nurture life.', hi: 'केंकड़ा अपना गृह पीठ पर ढोता है — यह सार्वभौमिक कर्क सत्य। जहाँ भी जातक जाये, भावनात्मक संसार साथ: स्मृतियाँ, पारिवारिक बन्धन, सांस्कृतिक जड़ें। कठोर कवच अविश्वसनीय कोमल आन्तरिक की रक्षा — बाहरी कठोरता क्योंकि आन्तरिक अत्यन्त संवेदनशील। चिमटे असाधारण दृढ़ता से पकड़ते — एक बार कर्क प्रेम करे, कभी न छोड़े। कर्क का पाठ: सच्ची शक्ति संवेदनशील होने का साहस, और सच्ची शक्ति जीवन का पोषण करने की क्षमता।' },
};

// ─── Cross Links ───────────────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/chandra' as const, label: { en: 'Moon (Chandra) — Ruler of Karka', hi: 'चन्द्र — कर्क का स्वामी' } },
  { href: '/learn/mithuna' as const, label: { en: 'Mithuna (Gemini) — Previous Sign', hi: 'मिथुन — पिछली राशि' } },
  { href: '/learn/rashis' as const, label: { en: 'All 12 Rashis Overview', hi: 'सभी 12 राशियों का अवलोकन' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र भवन' } },
  { href: '/learn/guru' as const, label: { en: 'Jupiter (Guru) — Exalted in Karka', hi: 'गुरु — कर्क में उच्च' } },
  { href: '/learn/mangal' as const, label: { en: 'Mars (Mangal) — Debilitated in Karka', hi: 'मंगल — कर्क में नीच' } },
  { href: '/learn/mangal-dosha' as const, label: { en: 'Manglik Dosha Explained', hi: 'मांगलिक दोष विस्तार से' } },
  { href: '/learn/compatibility' as const, label: { en: 'Compatibility & Matching', hi: 'अनुकूलता और मिलान' } },
  { href: '/learn/planet-in-house' as const, label: { en: 'Planets in Houses', hi: 'भावों में ग्रह' } },
  { href: '/learn/remedies' as const, label: { en: 'Vedic Remedies Guide', hi: 'वैदिक उपाय मार्गदर्शिका' } },
];

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
export default function KarkaPage() {
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
        <div className="text-8xl mb-4">&#9803;</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-2" style={hf}>
          {ml({ en: 'Karka', hi: 'कर्क' })}
        </h1>
        <p className="text-xl text-text-secondary mb-1" style={bf}>
          {ml({ en: 'Cancer — The Crab', hi: 'कर्क — केंकड़ा' })}
        </p>
        <p className="text-text-secondary/80 italic text-sm max-w-xl mx-auto mb-6" style={bf}>
          {ml({ en: 'The sign where the cosmos learns to feel — Karka is the womb of the zodiac, the original home, where consciousness discovers the power of nurturing.', hi: 'राशि जहाँ ब्रह्माण्ड अनुभव करना सीखता है — कर्क राशि चक्र का गर्भ, मूल गृह, जहाँ चेतना पोषण की शक्ति खोजती है।' })}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {ml({ en: 'Water Element', hi: 'जल तत्त्व' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {ml({ en: 'Cardinal / Chara', hi: 'चर राशि' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {ml({ en: 'Ruler: Moon', hi: 'स्वामी: चन्द्र' })}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {ml({ en: '90° – 120°', hi: '90° – 120°' })}
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
        <p style={bf} className="mb-4">{ml({ en: 'Karka (Cancer) is the fourth sign of the sidereal zodiac, spanning 90° to 120°. After the fire of Aries, the earth of Taurus, and the air of Gemini, Cancer introduces the final classical element: water — the medium of emotion, intuition, memory, and nurturing. Ruled by the Moon (Chandra), the fastest-moving celestial body and the one most intimately connected to human emotion, Karka embodies the principle of care: the instinct to feed, protect, shelter, and emotionally connect with others. This is the sign of the mother, the home, the womb, and the ancestral lineage.', hi: 'कर्क सायन राशि चक्र की चतुर्थ राशि है, 90° से 120° तक। मेष की अग्नि, वृषभ की पृथ्वी और मिथुन की वायु के बाद कर्क अन्तिम शास्त्रीय तत्त्व प्रस्तुत करता है: जल — भावना, अन्तर्ज्ञान, स्मृति और पोषण का माध्यम। चन्द्रमा शासित — सबसे तीव्रगामी खगोलीय पिण्ड और मानव भावना से सबसे घनिष्ठ। कर्क देखभाल का सिद्धान्त: खिलाने, रक्षा करने, आश्रय देने और भावनात्मक रूप से जुड़ने की सहज प्रवृत्ति।' })}</p>
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

      {/* ── 3. Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Karka', hi: 'कर्क के नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Karka. Punarvasu\'s final pada brings Jupiterian renewal, Pushya provides the most auspicious nurturing energy in the entire zodiac, and Ashlesha adds the serpent\'s psychological depth and transformative power.', hi: 'तीन नक्षत्र कर्क में। पुनर्वसु का अन्तिम पाद गुरु का नवीकरण, पुष्य सम्पूर्ण राशि चक्र की सबसे शुभ पोषक ऊर्जा, और आश्लेषा सर्प की मनोवैज्ञानिक गहनता और रूपान्तरकारी शक्ति।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Karka', hi: 'कर्क में ग्रहों की गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Karka hosts Jupiter\'s exaltation — wisdom at its most compassionate. Mars reaches its debilitation here — warrior energy weakened by emotional waters. The Moon stands in her own home as the undisputed guardian of this deeply emotional sign.', hi: 'कर्क में गुरु उच्च — सबसे करुणामय ज्ञान। मंगल यहाँ नीच — भावनात्मक जल से दुर्बल योद्धा ऊर्जा। चन्द्रमा स्वगृह में इस गहन भावनात्मक राशि की निर्विवाद संरक्षक।' })}</p>

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

        <h4 className="text-gold-primary font-bold text-sm mb-3 mt-4" style={hf}>{ml({ en: 'Own Sign', hi: 'स्वराशि' })}</h4>
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

      {/* ── 5. Each Planet in Karka ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Karka', hi: 'कर्क में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'How each of the nine Vedic planets behaves when placed in Karka. The Moon\'s watery, emotional energy colors every planet with sensitivity, nurturing instinct, and an orientation toward home and family.', hi: 'कर्क में स्थित प्रत्येक नवग्रह का व्यवहार। चन्द्र की जलीय, भावनात्मक ऊर्जा प्रत्येक ग्रह को संवेदनशीलता, पोषक सहज प्रवृत्ति और गृह-परिवार उन्मुखता से रंगती है।' })}</p>
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

      {/* ── 6. Career ── */}
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
          {ml({ en: 'A Karka native in a cold, competitive, emotionally barren workplace — where people are treated as numbers and relationships are transactional — will wither and become physically ill. They need to feel that their work matters to actual human beings, not just to a balance sheet. The moment they feel cared for at work, their productivity and loyalty become extraordinary.', hi: 'शीतल, प्रतिस्पर्धी, भावनात्मक रूप से बंजर कार्यस्थल में कर्क जातक — जहाँ लोग संख्याएँ और सम्बन्ध लेनदेन — मुरझायेगा और शारीरिक रूप से बीमार। कार्य वास्तविक मनुष्यों के लिए मायने रखे। कार्यस्थल पर देखभाल महसूस होते ही उत्पादकता और निष्ठा असाधारण।' })}
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
              ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः
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
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Cosmic Crab', hi: 'ब्रह्माण्डीय कर्कट' })}</h4>
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
        <p style={bf} className="mb-3">{ml({ en: 'Karka governs the chest, breasts, stomach, uterus, ovaries, and the lymphatic system. As a water sign ruled by the Moon, Cancer natives are highly sensitive to emotional states manifesting as physical ailments — stress directly impacts the stomach, and emotional eating is a characteristic vulnerability. The chest area is prone to congestion, bronchial issues, and in women, breast-related concerns. Gastric problems — acidity, ulcers, bloating, and irritable bowel syndrome — are the signature health challenges of this sign. When the Moon is strong and well-placed, the native enjoys good digestive capacity, strong nurturing instincts, emotional resilience, and a healthy relationship with food and comfort. A weak or afflicted Moon manifests as chronic water retention, hormonal imbalances, depression, anxiety disorders, and a tendency to somatize emotional pain into physical symptoms. Ayurvedically, Karka is predominantly Kapha with a strong water element — the constitution that gives emotional depth and nurturing capacity but also tendency toward lethargy, weight gain through emotional eating, and fluid-related disorders. Dietary recommendations emphasize easily digestible, warm, freshly cooked foods: khichdi, warm soups, steamed vegetables, and mild spices like cumin, coriander, and fennel. Cold, heavy, and processed foods aggravate the sensitive stomach. Exercise should be gentle and emotionally soothing — swimming (water element), walking near water, gentle yoga, and tai chi. Mental health is paramount — Karka natives must develop boundaries to prevent absorbing others\' emotional pain, and regular emotional processing through journaling, therapy, or trusted confidants is not optional but essential.', hi: 'कर्क वक्ष, स्तन, उदर, गर्भाशय, अण्डाशय और लसीका तन्त्र का शासक है। चन्द्र शासित जल राशि होने से कर्क जातक भावनात्मक अवस्थाओं के शारीरिक रोगों में प्रकट होने के प्रति अत्यधिक संवेदनशील — तनाव सीधे उदर को प्रभावित करता है और भावनात्मक भोजन विशिष्ट दुर्बलता है। वक्ष क्षेत्र में जमाव, श्वासनली समस्याएँ और स्त्रियों में स्तन सम्बन्धी चिन्ताएँ। गैस्ट्रिक समस्याएँ — अम्लता, व्रण, फूलना और चिड़चिड़ा आँत्र — इस राशि की विशिष्ट स्वास्थ्य चुनौतियाँ। बली चन्द्र में अच्छी पाचन क्षमता, दृढ़ पोषण सहज प्रवृत्ति, भावनात्मक लचीलापन। दुर्बल चन्द्र पुराना जल प्रतिधारण, हार्मोनल असन्तुलन, अवसाद, चिन्ता विकार। आयुर्वेदिक रूप से कर्क प्रधानतः कफ प्रकृति — जल तत्त्व प्रबल। आहार में सुपाच्य, ऊष्ण, ताजा पकी खिचड़ी, गरम सूप, भाप सब्जियाँ और जीरा, धनिया, सौंफ जैसे हल्के मसाले। शीतल, भारी और प्रसंस्कृत आहार संवेदनशील उदर बिगाड़ता है। व्यायाम कोमल और भावनात्मक रूप से शान्तिदायक — तैराकी, जल किनारे पैदल, सौम्य योग। मानसिक स्वास्थ्य सर्वोपरि — सीमाएँ विकसित करना, नियमित भावनात्मक प्रसंस्करण अनिवार्य।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Chest, breasts, stomach, uterus, ovaries, lymphatic system, oesophagus, upper digestive tract', hi: 'वक्ष, स्तन, उदर, गर्भाशय, अण्डाशय, लसीका तन्त्र, ग्रसिका, ऊपरी पाचन मार्ग' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Kapha dominant (water-heavy). Favour warm, light, freshly cooked foods with mild spices. Avoid cold, heavy, and emotionally-triggered eating. Gentle water-based exercise ideal.', hi: 'कफ प्रधान (जल-भारी)। ऊष्ण, हल्के, ताजा पके हल्के मसालों वाले आहार अनुकूल। शीतल, भारी और भावनात्मक भोजन वर्जित। सौम्य जल-आधारित व्यायाम आदर्श।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Karka in chart interpretation means identifying where the Moon\'s nurturing, protective, and emotionally sensitive energy manifests in the native\'s life. This sign\'s placement reveals where you give and receive care, where emotional security is paramount, and where the past exerts its strongest pull.', hi: 'कुण्डली व्याख्या में कर्क को समझने का अर्थ है पहचानना कि चन्द्र की पोषक, रक्षात्मक और भावनात्मक रूप से संवेदनशील ऊर्जा जातक के जीवन में कहाँ प्रकट होती है। इस राशि का स्थान बताता है कि आप कहाँ देखभाल देते-लेते हैं, कहाँ भावनात्मक सुरक्षा सर्वोपरि है, और कहाँ अतीत सबसे मजबूत खिंचाव डालता है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Karka is your Lagna', hi: 'यदि कर्क आपका लग्न है' }, content: { en: 'The Moon becomes your lagna lord — making emotional cycles directly visible in your physical appearance and life direction. Punarvasu lagna (Jupiter nakshatra pada 4) creates an optimistic, philosophical personality with the ability to regenerate after loss. Pushya lagna (Saturn nakshatra) produces the most disciplined and service-oriented Cancer — Saturn\'s structure channels the Moon\'s emotions into productive nurturing. Ashlesha lagna (Mercury nakshatra) creates a psychologically complex personality with deep insight into human motivation but also capacity for manipulation. The Moon\'s phase at birth significantly colours the lagna lord\'s strength — a full Moon lagna lord is far stronger than a dark Moon one.', hi: 'चन्द्र लग्नेश बनता है — भावनात्मक चक्र सीधे शारीरिक दिखावट और जीवन दिशा में दिखते हैं। पुनर्वसु लग्न (गुरु नक्षत्र पद 4) आशावादी, दार्शनिक व्यक्तित्व। पुष्य लग्न (शनि नक्षत्र) सबसे अनुशासित और सेवा-उन्मुख कर्क। आश्लेषा लग्न (बुध नक्षत्र) मनोवैज्ञानिक रूप से जटिल व्यक्तित्व। जन्म समय चन्द्र कला लग्नेश की शक्ति को महत्वपूर्ण रूप से रंगती है।' } },
            { title: { en: 'If Karka is your Moon sign', hi: 'यदि कर्क आपकी चन्द्र राशि है' }, content: { en: 'Moon in its own sign creates powerful emotional intelligence but also extreme sensitivity. The native is deeply empathetic, intuitively aware of others\' feelings, and possesses a remarkable memory — especially for emotional events. This is the most nurturing Moon placement but also the most emotionally vulnerable. The native must learn that not all emotions they feel belong to them — they absorb the emotional atmosphere around them like a sponge. Pushya Moon is considered one of the most auspicious placements in Jyotish — Saturn\'s discipline channels Cancer\'s emotions into selfless service and spiritual development.', hi: 'स्वराशि में चन्द्र शक्तिशाली भावनात्मक बुद्धि किन्तु अत्यधिक संवेदनशीलता। जातक गहन सहानुभूतिशील, सहज रूप से दूसरों की भावनाओं से अवगत, और उल्लेखनीय स्मृति — विशेषकर भावनात्मक घटनाओं की। सबसे पोषक किन्तु सबसे भावनात्मक रूप से भेद्य। जातक को सीखना चाहिए कि सभी अनुभूत भावनाएँ उनकी नहीं — वे आसपास का भावनात्मक वातावरण स्पंज की तरह सोख लेते हैं। पुष्य चन्द्र ज्योतिष में सबसे शुभ स्थानों में से एक।' } },
            { title: { en: 'Karka in divisional charts', hi: 'विभागीय कुण्डलियों में कर्क' }, content: { en: 'In Navamsha (D9), Karka indicates a spouse who is nurturing, emotionally sensitive, domestic-oriented, and possibly connected to healthcare, hospitality, or food industries. In Dashamsha (D10), it suggests careers in nursing, counseling, real estate, food services, childcare, or any profession involving care-giving and emotional intelligence.', hi: 'नवांश (D9) में कर्क जीवनसाथी को इंगित करता है जो पोषक, भावनात्मक रूप से संवेदनशील, गृहस्थ-उन्मुख और सम्भवतः स्वास्थ्य, आतिथ्य या खाद्य उद्योग से जुड़ा। दशमांश (D10) में नर्सिंग, परामर्श, भूसम्पत्ति, खाद्य सेवाएँ, शिशु देखभाल या देखभाल और भावनात्मक बुद्धि वाले किसी व्यवसाय में करियर।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Cancer is weak and overly emotional. Reality: Cancer\'s shell exists because the interior is powerful — the crab protects what matters most with fierce determination. Misconception: Cancer natives are clingy. Reality: Cancer\'s attachment comes from genuine love and investment, not insecurity — though insecure Moon placements can distort this. Misconception: Cancer is only about family and home. Reality: Karka\'s cardinal modality makes it an initiator — many Cancer natives build empires, they just build them to shelter and feed people. Misconception: Cancer males are effeminate. Reality: the warrior Mars is debilitated here because Cancer\'s strength is protection, not aggression — a fundamentally different but equally valid form of masculine power.', hi: 'भ्रान्ति: कर्क कमजोर और अत्यधिक भावुक है। सत्य: कर्क का कवच इसलिए है क्योंकि आन्तरिक शक्तिशाली है — केकड़ा जो सबसे महत्वपूर्ण है उसे उग्र दृढ़ता से रक्षा करता है। भ्रान्ति: कर्क जातक चिपकू हैं। सत्य: कर्क का लगाव सच्चे प्रेम और निवेश से आता है। भ्रान्ति: कर्क केवल परिवार और गृह। सत्य: कर्क की चर प्रकृति उसे आरम्भकर्ता बनाती है — अनेक कर्क जातक साम्राज्य बनाते हैं, बस लोगों को आश्रय और भोजन देने के लिए। भ्रान्ति: कर्क पुरुष स्त्रैण हैं। सत्य: रक्षा आक्रमण से भिन्न किन्तु समान रूप से वैध पुरुष शक्ति।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Karka in a chart reveals where the native\'s deepest emotional needs live, where nurturing energy flows naturally, and where the past — family karma, childhood patterns, ancestral memory — shapes present behavior. The house where Cancer falls is where you care most deeply, and where emotional wounds take longest to heal.', hi: 'कुण्डली में कर्क पढ़ना बताता है कि जातक की गहनतम भावनात्मक आवश्यकताएँ कहाँ हैं, पोषण ऊर्जा कहाँ स्वाभाविक रूप से बहती है, और अतीत — पारिवारिक कर्म, बचपन के प्रतिमान, पैतृक स्मृति — वर्तमान व्यवहार को कहाँ आकार देता है। जिस भाव में कर्क पड़ता है वहाँ आप सबसे गहराई से परवाह करते हैं, और भावनात्मक घाव ठीक होने में सबसे लम्बा समय लेते हैं।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Karka as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Karka as House Cusp', hi: 'भाव शिखर के रूप में कर्क' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Karka falls on different house cusps, it brings the Moon\'s nurturing, emotional, and protective energy to that life domain. Here is how Cancer colours each house:', hi: 'जब कर्क विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में चन्द्र की पोषक, भावनात्मक और रक्षात्मक ऊर्जा लाता है। यहाँ कर्क प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Moon-ruled personality — emotionally expressive, nurturing, with changing moods visible in the face. Strong maternal instincts. Physical appearance fluctuates with emotional states.', hi: 'चन्द्र शासित व्यक्तित्व — भावनात्मक रूप से अभिव्यक्त, पोषक, बदलते मनोभाव चेहरे पर दिखते हैं। दृढ़ मातृ सहज प्रवृत्ति। शारीरिक दिखावट भावनात्मक अवस्था से बदलती है।' } },
            { house: '2nd', effect: { en: 'Wealth tied to emotional security. Income from food, hospitality, or care industries. Family wealth fluctuates with Moon cycles. Comfort eating and emotional spending patterns.', hi: 'धन भावनात्मक सुरक्षा से जुड़ा। खाद्य, आतिथ्य या देखभाल उद्योगों से आय। पारिवारिक धन चन्द्र चक्र से बदलता है। भावनात्मक भोजन और व्यय पैटर्न।' } },
            { house: '3rd', effect: { en: 'Communication driven by emotions. Writing that touches the heart. Nurturing relationship with siblings. Short travels for emotional reasons — visiting family, pilgrimage to ancestral places.', hi: 'भावनाओं से प्रेरित संवाद। हृदय स्पर्शी लेखन। भाई-बहनों से पोषक सम्बन्ध। भावनात्मक कारणों से लघु यात्राएँ — परिवार मिलना, पैतृक स्थानों की तीर्थयात्रा।' } },
            { house: '4th', effect: { en: 'Cancer in its natural house — deep emotional bond with home and mother. Beautiful, emotionally nourishing living space. Real estate success. Ancestral property inheritance likely.', hi: 'कर्क अपने स्वाभाविक भाव में — गृह और माता से गहरा भावनात्मक बन्धन। सुन्दर, भावनात्मक रूप से पोषक रहने का स्थान। भूसम्पत्ति सफलता। पैतृक सम्पत्ति विरासत सम्भव।' } },
            { house: '5th', effect: { en: 'Creative expression through emotional depth — poetry, music, drama. Deep love for children. Romance driven by emotional connection over physical attraction. Intuitive speculation ability.', hi: 'भावनात्मक गहराई से सृजनात्मक अभिव्यक्ति — काव्य, संगीत, नाटक। सन्तान से गहरा प्रेम। शारीरिक आकर्षण से अधिक भावनात्मक सम्बन्ध से प्रेम। सहज अनुमान क्षमता।' } },
            { house: '6th', effect: { en: 'Stomach and digestive health challenges. Service in healthcare, nutrition, or counseling. Emotional nature of enemies — conflicts arise from hurt feelings. Illness triggered by emotional stress.', hi: 'उदर और पाचन स्वास्थ्य चुनौतियाँ। स्वास्थ्य, पोषण या परामर्श में सेवा। शत्रुओं की भावनात्मक प्रकृति — आहत भावनाओं से संघर्ष। भावनात्मक तनाव से रोग।' } },
            { house: '7th', effect: { en: 'Spouse is nurturing, emotionally sensitive, and family-oriented. Marriage provides emotional security. Partner may be in food, real estate, or healthcare. Emotional compatibility is essential for partnership success.', hi: 'जीवनसाथी पोषक, भावनात्मक रूप से संवेदनशील और परिवार-उन्मुख। विवाह भावनात्मक सुरक्षा प्रदान करता है। साथी खाद्य, भूसम्पत्ति या स्वास्थ्य में। भावनात्मक अनुकूलता अनिवार्य।' } },
            { house: '8th', effect: { en: 'Deep emotional transformation through crisis. Inheritance from maternal side. Psychic and intuitive abilities strong. Hidden emotional depths that others rarely see. Interest in past-life therapy and emotional healing.', hi: 'संकट से गहन भावनात्मक रूपान्तरण। मातृ पक्ष से विरासत। मानसिक और अन्तर्ज्ञान क्षमताएँ प्रबल। छिपी भावनात्मक गहराइयाँ। पूर्वजन्म चिकित्सा और भावनात्मक उपचार में रुचि।' } },
            { house: '9th', effect: { en: 'Dharma rooted in emotional wisdom and ancestral tradition. Father is nurturing and protective. Fortune through caring professions and homeland connections. Pilgrimages to water bodies and maternal ancestral sites.', hi: 'भावनात्मक ज्ञान और पैतृक परम्परा में धर्म। पिता पोषक और रक्षात्मक। देखभाल व्यवसायों और मातृभूमि से भाग्य। जल निकायों और मातृ पैतृक स्थलों की तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Career in nursing, hospitality, real estate, food industry, counseling, or childcare. Public image is nurturing and approachable. Career success fluctuates with emotional states and Moon cycles.', hi: 'नर्सिंग, आतिथ्य, भूसम्पत्ति, खाद्य उद्योग, परामर्श या शिशु देखभाल में करियर। सार्वजनिक छवि पोषक और सुलभ। करियर सफलता भावनात्मक अवस्थाओं और चन्द्र चक्र से बदलती है।' } },
            { house: '11th', effect: { en: 'Gains through nurturing networks and community care. Friends are like family. Elder siblings are protective and maternal. Aspirations involve building safe spaces and providing for others.', hi: 'पोषक नेटवर्क और सामुदायिक देखभाल से लाभ। मित्र परिवार जैसे। बड़े भाई-बहन रक्षात्मक और मातृवत। सुरक्षित स्थान बनाने और दूसरों के लिए प्रदान करने की आकांक्षाएँ।' } },
            { house: '12th', effect: { en: 'Expenditure on family and emotional security. Spiritual growth through emotional surrender and compassion. Foreign residence near water. Dreams are vivid, prophetic, and emotionally charged.', hi: 'परिवार और भावनात्मक सुरक्षा पर व्यय। भावनात्मक समर्पण और करुणा से आध्यात्मिक विकास। जल निकट विदेशी निवास। स्वप्न स्पष्ट, भविष्यसूचक और भावनात्मक।' } },
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
        ml({ en: 'Karka (Cancer) is the fourth sign — ruled by Moon, element water, cardinal modality. It represents nurturing, emotional intelligence, and the primal instinct to protect and provide.', hi: 'कर्क चतुर्थ राशि — चन्द्र शासित, जल तत्त्व, चर स्वभाव। पोषण, भावनात्मक बुद्धि और रक्षा-प्रदान की आदि सहज प्रवृत्ति।' }),
        ml({ en: 'Jupiter is exalted at 5° (emotional wisdom at its peak), Mars is debilitated at 28° (warrior energy weakened by emotion), Moon owns the sign.', hi: 'गुरु 5° पर उच्च (भावनात्मक ज्ञान शिखर), मंगल 28° पर नीच (भावना से दुर्बल योद्धा ऊर्जा), चन्द्र स्वामी।' }),
        ml({ en: 'Three nakshatras: Punarvasu pada 4 (90°-93°20\', Jupiter), Pushya (93°20\'-106°40\', Saturn), Ashlesha (106°40\'-120°, Mercury).', hi: 'तीन नक्षत्र: पुनर्वसु पाद 4 (90°-93°20\', गुरु), पुष्य (93°20\'-106°40\', शनि), आश्लेषा (106°40\'-120°, बुध)।' }),
        ml({ en: 'Best compatibility with Scorpio and Pisces (water trines). Career strength in healthcare, hospitality, real estate, education, counseling, and all caring professions.', hi: 'वृश्चिक और मीन से सर्वोत्तम अनुकूलता (जल त्रिकोण)। स्वास्थ्य, आतिथ्य, भूसम्पत्ति, शिक्षा, परामर्श और सभी देखभाल व्यवसायों में करियर शक्ति।' }),
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
