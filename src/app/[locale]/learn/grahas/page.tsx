'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { GRAHAS } from '@/lib/constants/grahas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ── Inline labels ────────────────────────────────────────────────── */
const L = {
  overviewTitle: { en: 'The Navagraha — Nine Cosmic Forces', hi: 'नवग्रह — नौ ब्रह्माण्डीय शक्तियाँ', sa: 'नवग्रहाः — नव ब्रह्माण्डशक्तयः', ta: 'நவகிரகங்கள் — ஒன்பது அண்ட சக்திகள்' },
  overviewContent: {
    en: 'In Jyotish Shastra, the word "Graha" does not mean "planet" — it means "that which grasps or seizes." The nine Grahas are cosmic forces that grip human consciousness and shape destiny. They include two luminaries (Sun and Moon), five visible planets (Mars, Mercury, Jupiter, Venus, Saturn), and two shadow points (Rahu and Ketu — the lunar nodes). Unlike Western astrology, Vedic astrology excludes the outer planets Uranus, Neptune, and Pluto, considering the Navagraha sufficient for complete life analysis.',
    hi: 'ज्योतिष शास्त्र में "ग्रह" शब्द का अर्थ "ग्रहण करना" है — अर्थात् जो मानव चेतना को पकड़ लेता है। नौ ग्रह ब्रह्माण्डीय शक्तियाँ हैं जो मानव जीवन को प्रभावित करती हैं। इनमें दो ज्योतिर्मण्डल (सूर्य और चन्द्र), पाँच दृश्य ग्रह (मंगल, बुध, बृहस्पति, शुक्र, शनि) और दो छाया बिन्दु (राहु और केतु — चन्द्र के पात) सम्मिलित हैं।',
    sa: 'ज्योतिषशास्त्रे "ग्रहः" इति शब्दः "ग्रहणम्" इत्यर्थः — यः मानवचेतनां गृह्णाति। नवग्रहाः ब्रह्माण्डशक्तयः ये मानवजीवनं प्रभावयन्ति।'
  },
  overviewContent2: {
    en: 'Each Graha rules specific days of the week (Vara), specific Nakshatras, and specific Dashas (planetary periods). The Sun rules Sunday, Moon rules Monday, Mars rules Tuesday, Mercury rules Wednesday, Jupiter rules Thursday, Venus rules Friday, and Saturn rules Saturday. Rahu and Ketu, being shadow points, do not rule weekdays but have powerful Dasha periods of 18 and 7 years respectively.',
    hi: 'प्रत्येक ग्रह विशिष्ट वार, नक्षत्र और दशा पर शासन करता है। सूर्य रविवार, चन्द्र सोमवार, मंगल मंगलवार, बुध बुधवार, बृहस्पति गुरुवार, शुक्र शुक्रवार और शनि शनिवार पर राज्य करता है। राहु और केतु छाया ग्रह होने के कारण वार पर शासन नहीं करते, किन्तु उनकी दशा अत्यन्त प्रभावशाली होती है।',
    sa: 'प्रत्येकः ग्रहः विशिष्टवारं, नक्षत्रं, दशां च शासयति।'
  },
  beneficMaleficTitle: { en: 'Natural Benefics vs Malefics', hi: 'नैसर्गिक शुभ और पाप ग्रह', sa: 'नैसर्गिकशुभपापग्रहाः' },
  beneficMaleficContent: {
    en: 'The classification of planets as natural benefics (Shubha Graha) or natural malefics (Papa Graha) is fundamental to Jyotish. This classification determines how a planet behaves by default — before considering its house lordship, aspects, or conjunctions. A benefic planet tends to give positive results, while a malefic creates challenges. However, this is just the starting point: a natural malefic can become a functional benefic (Yoga Karaka) if it rules auspicious houses, and vice versa.',
    hi: 'ग्रहों का नैसर्गिक शुभ या पाप वर्गीकरण ज्योतिष का मूलभूत सिद्धान्त है। यह वर्गीकरण निर्धारित करता है कि कोई ग्रह स्वभावतः कैसा व्यवहार करेगा — भाव स्वामित्व, दृष्टि या युति से पहले। शुभ ग्रह सकारात्मक फल देता है, जबकि पाप ग्रह चुनौतियाँ उत्पन्न करता है। परन्तु यह केवल आरम्भ बिन्दु है — पाप ग्रह भी कार्यात्मक शुभ (योगकारक) बन सकता है।',
    sa: 'ग्रहाणां शुभपापवर्गीकरणं ज्योतिषस्य मूलसिद्धान्तः।'
  },
  beneficNote: {
    en: 'Moon is benefic when waxing (Shukla Paksha, above ~120° from Sun) and malefic when waning (Krishna Paksha). Mercury is benefic when alone or with benefics, but becomes malefic when conjunct with malefics.',
    hi: 'चन्द्र शुक्ल पक्ष (सूर्य से ~120° से अधिक) में शुभ और कृष्ण पक्ष में पाप होता है। बुध अकेला या शुभ ग्रहों के साथ शुभ होता है, किन्तु पाप ग्रहों की युति में पाप बन जाता है।',
    sa: 'चन्द्रः शुक्लपक्षे शुभः कृष्णपक्षे पापः। बुधः एकाकी शुभैः सह वा शुभः, पापैः सह पापः।'
  },
  friendshipTitle: { en: 'Planetary Friendships (Naisargika Maitri)', hi: 'ग्रह मित्रता (नैसर्गिक मैत्री)', sa: 'ग्रहमैत्री (नैसर्गिकमैत्री)' },
  friendshipContent: {
    en: 'The Naisargika Maitri (natural friendship) system classifies relationships between planets as Friend (Mitra), Neutral (Sama), or Enemy (Shatru). This relationship is determined by which signs each planet rules relative to the other. When a planet sits in a friend\'s sign, it feels comfortable and gives good results. In an enemy\'s sign, the planet struggles. This system also determines the Graha Maitri score in Kundali matching (Ashtakuta). Beyond natural friendships, there is also Tatkalika Maitri (temporal friendship) — planets in the 2nd, 3rd, 4th, 10th, 11th, or 12th from each other become temporal friends; otherwise temporal enemies.',
    hi: 'नैसर्गिक मैत्री प्रणाली ग्रहों के सम्बन्धों को मित्र, सम और शत्रु में वर्गीकृत करती है। जब कोई ग्रह मित्र की राशि में बैठता है तो वह सहज रहता है और शुभ फल देता है। शत्रु की राशि में ग्रह कठिनाई अनुभव करता है। नैसर्गिक मैत्री के अतिरिक्त तात्कालिक मैत्री भी होती है — जो ग्रह एक दूसरे से 2, 3, 4, 10, 11 या 12वें स्थान पर हों वे तात्कालिक मित्र बनते हैं।',
    sa: 'नैसर्गिकमैत्रीपद्धतिः ग्रहसम्बन्धान् मित्र-सम-शत्रुषु वर्गीकरोति।'
  },
  dignityTitle: { en: 'Planetary Dignities — Strength by Sign', hi: 'ग्रह बल — राशि अनुसार', sa: 'ग्रहबलम् — राश्यनुसारम्' },
  dignityContent: {
    en: 'A planet\'s strength varies dramatically based on which Rashi (sign) it occupies. Vedic astrology defines five levels of dignity: Exaltation (Uccha) where the planet is at maximum strength, Moolatrikona where it functions with authority, Own Sign (Swakshetra) where it is comfortable, Friendly sign where it functions well, and Debilitation (Neecha) where it is at minimum strength. The specific degrees of exaltation and debilitation are critical — a planet at its exact exaltation degree is like a king on his throne.',
    hi: 'किसी ग्रह का बल इस बात पर निर्भर करता है कि वह किस राशि में स्थित है। वैदिक ज्योतिष पाँच स्तर परिभाषित करता है: उच्च (अधिकतम बल), मूलत्रिकोण (अधिकारपूर्ण कार्य), स्वक्षेत्र (सहज), मित्र राशि (सुचारु कार्य), और नीच (न्यूनतम बल)। उच्च और नीच के विशिष्ट अंश अत्यन्त महत्वपूर्ण हैं।',
    sa: 'ग्रहस्य बलं राश्यनुसारं नाटकीयरूपेण भिद्यते। उच्चे ग्रहः परमबली, नीचे न्यूनतमबली।'
  },
  combustionTitle: { en: 'Combustion (Asta Graha)', hi: 'अस्त ग्रह (Combustion)', sa: 'अस्तग्रहः (दाहः)' },
  combustionContent: {
    en: 'When a planet comes too close to the Sun, it becomes "combust" (Asta) — overwhelmed by the Sun\'s brilliance and losing its power to deliver results. Combustion weakens a planet significantly. The combust planet\'s significations suffer: if Mercury is combust, intellect and communication may be affected; if Venus is combust, relationships and comforts diminish. The Moon has the widest combustion range (12°), while Venus has the narrowest among visible planets (8°). Rahu and Ketu are never considered combust.',
    hi: 'जब कोई ग्रह सूर्य के अत्यन्त निकट आता है, तो वह "अस्त" हो जाता है — सूर्य की प्रखरता से अभिभूत होकर अपना फल देने की शक्ति खो देता है। अस्त ग्रह के कारकत्व प्रभावित होते हैं: बुध अस्त हो तो बुद्धि और संवाद प्रभावित; शुक्र अस्त हो तो सम्बन्ध और सुख-सुविधाएँ कम। चन्द्र की अस्त सीमा सबसे अधिक (12°) और शुक्र की सबसे कम (8°) होती है।',
    sa: 'यदा ग्रहः सूर्यस्य अत्यन्तनिकटं गच्छति तदा "अस्तः" भवति — सूर्यस्य तेजसा अभिभूतः स्वफलं दातुं शक्तिं त्यजति।'
  },
  retrogradeTitle: { en: 'Retrograde Motion (Vakri Graha)', hi: 'वक्री ग्रह (Retrograde)', sa: 'वक्रीग्रहः (प्रतिगमनम्)' },
  retrogradeContent: {
    en: 'Retrograde (Vakri) motion occurs when a planet appears to move backward through the zodiac from Earth\'s perspective. In Jyotish, retrograde planets are considered strong — contrary to popular Western belief that retrograde weakens a planet. A Vakri Graha has special intensity: it is closer to the Earth (for superior planets) and its energy is directed inward. Mars, Mercury, Jupiter, Venus, and Saturn can be retrograde. The Sun and Moon are never retrograde. Rahu and Ketu are always retrograde (their mean motion is always backward).',
    hi: 'वक्री गति तब होती है जब पृथ्वी से देखने पर ग्रह राशिचक्र में पीछे चलता दिखाई देता है। ज्योतिष में वक्री ग्रह बलवान माना जाता है — पश्चिमी मान्यता के विपरीत। वक्री ग्रह की ऊर्जा विशेष तीव्रता रखती है: वह पृथ्वी के निकट होता है और उसकी शक्ति अन्तर्मुखी होती है। मंगल, बुध, बृहस्पति, शुक्र और शनि वक्री हो सकते हैं। सूर्य और चन्द्र कभी वक्री नहीं होते। राहु और केतु सदा वक्री रहते हैं।',
    sa: 'वक्रीगतिः यदा पृथिव्याः दृष्ट्या ग्रहः राशिचक्रे प्रतिगच्छन् दृश्यते। ज्योतिषे वक्रीग्रहः बलवान् मन्यते।'
  },
  retrogradeNote: {
    en: 'A debilitated planet that is also retrograde (Vakri-Neecha) is considered equivalent to an exalted planet by some classical authorities — its energy reverses the debilitation. This is called Neecha Bhanga (cancellation of debilitation).',
    hi: 'नीच राशि का वक्री ग्रह (वक्री-नीच) कुछ शास्त्रकारों के अनुसार उच्च ग्रह के समान माना जाता है — उसकी ऊर्जा नीचता को उलट देती है। इसे नीच भंग कहते हैं।',
    sa: 'नीचराशिस्थो वक्रीग्रहः केषाञ्चित् शास्त्रकाराणामनुसारम् उच्चग्रहसमः मन्यते। इदं नीचभङ्गम् उच्यते।'
  },
  aspectsTitle: { en: 'Planetary Aspects (Graha Drishti)', hi: 'ग्रह दृष्टि (Planetary Aspects)', sa: 'ग्रहदृष्टिः' },
  aspectsContent: {
    en: 'In Vedic astrology, every planet casts a full aspect (Drishti) on the 7th house from itself. However, Mars, Jupiter, and Saturn have additional special aspects. These aspects allow a planet to influence houses and planets it does not physically occupy — making Drishti analysis essential for chart interpretation. Unlike Western astrology which uses aspect angles between planets, Vedic aspects are cast from house to house.',
    hi: 'वैदिक ज्योतिष में प्रत्येक ग्रह अपने सातवें भाव पर पूर्ण दृष्टि डालता है। इसके अतिरिक्त मंगल, बृहस्पति और शनि की विशेष दृष्टियाँ हैं। ये दृष्टियाँ ग्रह को उन भावों और ग्रहों को प्रभावित करने की अनुमति देती हैं जहाँ वह शारीरिक रूप से स्थित नहीं है।',
    sa: 'ज्योतिषे प्रत्येकः ग्रहः स्वसप्तमभावे पूर्णदृष्टिं पातयति। मङ्गलः, बृहस्पतिः, शनिश्च विशेषदृष्टीः अपि धारयन्ति।'
  },
  karakatvaTitle: { en: 'Karakatva — What Each Planet Signifies', hi: 'कारकत्व — प्रत्येक ग्रह क्या दर्शाता है', sa: 'कारकत्वम् — प्रत्येकग्रहः किं सूचयति' },
  karakatvaContent: {
    en: 'Karakatva means "significatorship" — the life areas each planet naturally governs regardless of its house placement. These significations are permanent and universal. For example, Jupiter is always the Karaka (significator) of children and wisdom, even if it sits in the 6th house. When analyzing any life area, Jyotish considers both the house ruler and the natural Karaka. If both are strong, results are excellent; if both are weak, that life area suffers.',
    hi: 'कारकत्व का अर्थ है — जीवन के वे क्षेत्र जिन पर प्रत्येक ग्रह स्वाभाविक रूप से शासन करता है, चाहे वह किसी भी भाव में हो। ये कारकत्व स्थायी और सार्वभौमिक हैं। उदाहरण के लिए, बृहस्पति सदैव सन्तान और ज्ञान का कारक है, भले ही वह छठे भाव में हो। किसी भी जीवन क्षेत्र के विश्लेषण में भाव स्वामी और नैसर्गिक कारक दोनों का विचार किया जाता है।',
    sa: 'कारकत्वम् — जीवनक्षेत्राणि येषु प्रत्येकः ग्रहः स्वाभाविकरूपेण शासनं करोति।'
  },
  dashaTitle: { en: 'Planetary Periods (Vimshottari Dasha)', hi: 'ग्रह महादशा (विंशोत्तरी दशा)', sa: 'ग्रहमहादशा (विंशोत्तरीदशा)' },
  dashaContent: {
    en: 'The Vimshottari Dasha system assigns each planet a specific period during which it becomes the primary influence on a person\'s life. The total cycle spans 120 years. The starting Dasha is determined by the Moon\'s Nakshatra at birth. During a planet\'s Mahadasha (major period), its condition in the birth chart — sign, house, aspects, dignity — becomes activated. Each Mahadasha is subdivided into Antardashas (sub-periods) ruled by each of the 9 planets in sequence.',
    hi: 'विंशोत्तरी दशा प्रणाली प्रत्येक ग्रह को एक विशिष्ट अवधि प्रदान करती है जिसमें वह व्यक्ति के जीवन पर प्रमुख प्रभाव डालता है। कुल चक्र 120 वर्ष का होता है। आरम्भिक दशा जन्म समय चन्द्र के नक्षत्र से निर्धारित होती है। महादशा काल में ग्रह की जन्म कुण्डली में स्थिति — राशि, भाव, दृष्टि, बल — सक्रिय हो जाती है।',
    sa: 'विंशोत्तरीदशापद्धतिः प्रत्येकस्मै ग्रहाय विशिष्टकालं ददाति यस्मिन् सः जीवने प्रमुखप्रभावः भवति।'
  },
  upagrahaTitle: { en: 'Upagrahas — Shadow Sub-Planets', hi: 'उपग्रह — छाया उपग्रह', sa: 'उपग्रहाः — छायोपग्रहाः' },
  upagrahaContent: {
    en: 'Beyond the nine Grahas, Vedic astrology recognizes five mathematical points called Upagrahas (sub-planets). These are not physical bodies but calculated points derived from the Sun\'s longitude. They add subtle layers of influence — especially in muhurta (electional) and prashna (horary) astrology. Classical texts like BPHS give them specific significations that refine chart analysis.',
    hi: 'नौ ग्रहों से परे, वैदिक ज्योतिष पाँच गणितीय बिन्दुओं को मान्यता देता है जिन्हें उपग्रह कहते हैं। ये भौतिक पिण्ड नहीं हैं बल्कि सूर्य के भोगांश से व्युत्पन्न गणनात्मक बिन्दु हैं। ये सूक्ष्म प्रभाव की परतें जोड़ते हैं — विशेषकर मुहूर्त और प्रश्न ज्योतिष में।',
    sa: 'नवग्रहेभ्यः परम्, वैदिकज्योतिषं पञ्चगणितीयबिन्दून् मान्यतां ददाति ये उपग्रहाः उच्यन्ते।'
  },
  aspectStrengthTitle: { en: 'Aspect Strength — Full, Three-Quarter, Half, Quarter', hi: 'दृष्टि बल — पूर्ण, तीन-चौथाई, अर्ध, चतुर्थांश', sa: 'दृष्टिबलम् — पूर्णं, त्रिपादं, अर्धं, पादम्' },
  aspectStrengthContent: {
    en: 'Not all special aspects carry equal strength. Classical texts assign fractional Drishti values: Full aspect (100%) on the 7th house for all planets. Mars: full on 4th and 8th, three-quarter (75%) on some reckonings. Jupiter: full on 5th and 9th. Saturn: full on 3rd and 10th. The practical significance: a full aspect has the power to significantly modify a house\'s results, while a partial aspect adds a subtle influence. In chart interpretation, always prioritize full aspects over partial ones.',
    hi: 'सभी विशेष दृष्टियाँ समान बल नहीं रखतीं। शास्त्रीय ग्रन्थ आंशिक दृष्टि मान प्रदान करते हैं: सभी ग्रहों की 7वें भाव पर पूर्ण दृष्टि (100%)। मंगल: 4थे और 8वें पर पूर्ण। बृहस्पति: 5वें और 9वें पर पूर्ण। शनि: 3रे और 10वें पर पूर्ण।',
    sa: 'सर्वाः विशेषदृष्टयः न समानबलाः। शास्त्रीयग्रन्थाः आंशिकदृष्टिमानानि प्रददति।'
  },
  crossRefTitle: { en: 'Related Learning Modules', hi: 'सम्बन्धित अध्ययन', sa: 'सम्बद्धपाठाः' },
  significanceContent: {
    en: 'The Navagraha form the foundation of all Jyotish analysis. In a Kundali (birth chart), each Graha occupies a specific Rashi and Nakshatra, creating a unique celestial fingerprint for the moment of birth. The Vimshottari Dasha system uses the Moon\'s Nakshatra lord to unfold a 120-year predictive timeline. The Grahas are not merely astronomical objects — they represent cosmic forces that influence human life according to Vedic tradition.',
    hi: 'नवग्रह समस्त ज्योतिष विश्लेषण का आधार हैं। कुण्डली में प्रत्येक ग्रह विशिष्ट राशि और नक्षत्र में स्थित होता है, जन्म क्षण की एक अद्वितीय खगोलीय छाप बनाता है। विंशोत्तरी दशा प्रणाली चन्द्र के नक्षत्र स्वामी से 120 वर्ष की भविष्यवाणी समयरेखा प्रस्तुत करती है।',
    sa: 'नवग्रहाः समस्तज्योतिषविश्लेषणस्य आधारः। कुण्डल्यां प्रत्येकः ग्रहः विशिष्टराश्यां नक्षत्रे च स्थितः, जन्मक्षणस्य अद्वितीयां खगोलीयछापं रचयति।'
  },
};

/* ── Planet detail data (expanded from original) ──────────────────── */
const PLANET_DETAILS: Record<number, {
  orbit: string;
  dignity: { en: string; hi: string; sa: string };
  signifies: { en: string; hi: string; sa: string };
  dashaYears: number;
  exaltDeg: string;
  debilDeg: string;
  moolatrikona: { en: string; hi: string };
  ownSigns: { en: string; hi: string };
  combustionDeg: string;
  karakatva: { en: string; hi: string };
}> = {
  0: {
    orbit: '1 year', dashaYears: 6,
    dignity: { en: 'Exalted in Aries (10°), Debilitated in Libra (10°)', hi: 'मेष 10° में उच्च, तुला 10° में नीच', sa: 'मेषे 10° उच्चः, तुलायां 10° नीचः' },
    signifies: { en: 'Soul, authority, father, government, health, vitality, gold', hi: 'आत्मा, अधिकार, पिता, सरकार, स्वास्थ्य, जीवन शक्ति', sa: 'आत्मा, अधिकारः, पिता, राज्यं, आरोग्यं, जीवनशक्तिः' },
    exaltDeg: 'Aries 10°', debilDeg: 'Libra 10°',
    moolatrikona: { en: 'Leo 0°-20°', hi: 'सिंह 0°-20°' },
    ownSigns: { en: 'Leo', hi: 'सिंह' },
    combustionDeg: '—',
    karakatva: { en: 'Atmakaraka (soul), father, king, government authority, bones, heart, right eye, copper, ruby, wheat, temple, east direction', hi: 'आत्मकारक, पिता, राजा, सरकारी अधिकार, अस्थि, हृदय, दायाँ नेत्र, ताम्र, माणिक्य' },
  },
  1: {
    orbit: '27.3 days', dashaYears: 10,
    dignity: { en: 'Exalted in Taurus (3°), Debilitated in Scorpio (3°)', hi: 'वृषभ 3° में उच्च, वृश्चिक 3° में नीच', sa: 'वृषभे 3° उच्चः, वृश्चिके 3° नीचः' },
    signifies: { en: 'Mind, emotions, mother, public, liquids, travel, silver', hi: 'मन, भावनाएँ, माता, जनता, तरल पदार्थ, यात्रा', sa: 'मनः, भावाः, माता, जनता, द्रवपदार्थाः, यात्रा' },
    exaltDeg: 'Taurus 3°', debilDeg: 'Scorpio 3°',
    moolatrikona: { en: 'Taurus 4°-30°', hi: 'वृषभ 4°-30°' },
    ownSigns: { en: 'Cancer', hi: 'कर्क' },
    combustionDeg: '12°',
    karakatva: { en: 'Mind (Manas), mother, queen, public opinion, water, milk, pearl, silver, left eye, Monday, northwest direction, white things', hi: 'मन, माता, रानी, जनमत, जल, दूध, मोती, चाँदी, बायाँ नेत्र, सोमवार' },
  },
  2: {
    orbit: '1.88 years', dashaYears: 7,
    dignity: { en: 'Exalted in Capricorn (28°), Debilitated in Cancer (28°)', hi: 'मकर 28° में उच्च, कर्क 28° में नीच', sa: 'मकरे 28° उच्चः, कर्कटे 28° नीचः' },
    signifies: { en: 'Energy, courage, siblings, property, surgery, military, copper', hi: 'ऊर्जा, साहस, भाई-बहन, सम्पत्ति, शल्य चिकित्सा', sa: 'ऊर्जा, शौर्यं, भ्रातरः, सम्पत्तिः, शल्यचिकित्सा' },
    exaltDeg: 'Capricorn 28°', debilDeg: 'Cancer 28°',
    moolatrikona: { en: 'Aries 0°-12°', hi: 'मेष 0°-12°' },
    ownSigns: { en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक' },
    combustionDeg: '17°',
    karakatva: { en: 'Courage, brothers, commander, land, blood, surgery, fire, weapons, police, coral, red things, Tuesday, south direction', hi: 'साहस, भाई, सेनापति, भूमि, रक्त, शल्य, अग्नि, शस्त्र, पुलिस, मूँगा, मंगलवार' },
  },
  3: {
    orbit: '88 days', dashaYears: 17,
    dignity: { en: 'Exalted in Virgo (15°), Debilitated in Pisces (15°)', hi: 'कन्या 15° में उच्च, मीन 15° में नीच', sa: 'कन्यायाम् 15° उच्चः, मीने 15° नीचः' },
    signifies: { en: 'Intelligence, speech, trade, writing, mathematics, friends, green', hi: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मित्र', sa: 'बुद्धिः, वाक्, वाणिज्यं, लेखनं, गणितं, मित्राणि' },
    exaltDeg: 'Virgo 15°', debilDeg: 'Pisces 15°',
    moolatrikona: { en: 'Virgo 16°-20°', hi: 'कन्या 16°-20°' },
    ownSigns: { en: 'Gemini, Virgo', hi: 'मिथुन, कन्या' },
    combustionDeg: '14° (12° if retro)',
    karakatva: { en: 'Intellect, speech, trade, writing, mathematics, maternal uncle, skin, emerald, green things, Wednesday, north direction, astrology', hi: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मामा, त्वचा, पन्ना, बुधवार, ज्योतिष' },
  },
  4: {
    orbit: '11.86 years', dashaYears: 16,
    dignity: { en: 'Exalted in Cancer (5°), Debilitated in Capricorn (5°)', hi: 'कर्क 5° में उच्च, मकर 5° में नीच', sa: 'कर्कटे 5° उच्चः, मकरे 5° नीचः' },
    signifies: { en: 'Wisdom, fortune, children, dharma, guru, expansion, gold', hi: 'ज्ञान, भाग्य, सन्तान, धर्म, गुरु, विस्तार', sa: 'ज्ञानं, भाग्यं, सन्तानाः, धर्मः, गुरुः, विस्तारः' },
    exaltDeg: 'Cancer 5°', debilDeg: 'Capricorn 5°',
    moolatrikona: { en: 'Sagittarius 0°-10°', hi: 'धनु 0°-10°' },
    ownSigns: { en: 'Sagittarius, Pisces', hi: 'धनु, मीन' },
    combustionDeg: '11°',
    karakatva: { en: 'Wisdom, children, dharma, guru/teacher, wealth, fortune, fat/liver, yellow sapphire, gold, Thursday, northeast direction, sacred texts', hi: 'ज्ञान, सन्तान, धर्म, गुरु, धन, भाग्य, यकृत, पुखराज, स्वर्ण, गुरुवार, शास्त्र' },
  },
  5: {
    orbit: '225 days', dashaYears: 20,
    dignity: { en: 'Exalted in Pisces (27°), Debilitated in Virgo (27°)', hi: 'मीन 27° में उच्च, कन्या 27° में नीच', sa: 'मीने 27° उच्चः, कन्यायां 27° नीचः' },
    signifies: { en: 'Love, beauty, luxury, art, spouse, vehicles, diamonds', hi: 'प्रेम, सौन्दर्य, विलासिता, कला, जीवनसाथी, वाहन', sa: 'प्रेम, सौन्दर्यं, विलासः, कला, पत्नी, वाहनानि' },
    exaltDeg: 'Pisces 27°', debilDeg: 'Virgo 27°',
    moolatrikona: { en: 'Libra 0°-15°', hi: 'तुला 0°-15°' },
    ownSigns: { en: 'Taurus, Libra', hi: 'वृषभ, तुला' },
    combustionDeg: '8° (10° if retro)',
    karakatva: { en: 'Spouse (wife), love, beauty, art, music, luxury, vehicles, diamond, semen, southeast direction, Friday, perfume, flowers', hi: 'पत्नी, प्रेम, सौन्दर्य, कला, संगीत, विलास, वाहन, हीरा, शुक्रवार, सुगन्ध, पुष्प' },
  },
  6: {
    orbit: '29.46 years', dashaYears: 19,
    dignity: { en: 'Exalted in Libra (20°), Debilitated in Aries (20°)', hi: 'तुला 20° में उच्च, मेष 20° में नीच', sa: 'तुलायाम् 20° उच्चः, मेषे 20° नीचः' },
    signifies: { en: 'Discipline, karma, longevity, delays, servants, iron, blue sapphire', hi: 'अनुशासन, कर्म, दीर्घायु, विलम्ब, सेवक', sa: 'अनुशासनं, कर्म, दीर्घायुः, विलम्बः, सेवकाः' },
    exaltDeg: 'Libra 20°', debilDeg: 'Aries 20°',
    moolatrikona: { en: 'Aquarius 0°-20°', hi: 'कुम्भ 0°-20°' },
    ownSigns: { en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ' },
    combustionDeg: '15°',
    karakatva: { en: 'Longevity, karma, discipline, servants, old age, sorrow, iron, blue sapphire, Saturday, west direction, oil, black things, democracy', hi: 'आयु, कर्म, अनुशासन, सेवक, वृद्धावस्था, दुःख, लोहा, नीलम, शनिवार, तेल' },
  },
  7: {
    orbit: '18.6 years (nodal cycle)', dashaYears: 18,
    dignity: { en: 'Strong in Taurus, Gemini, Virgo, Aquarius', hi: 'वृषभ/मिथुन/कन्या/कुम्भ में बलवान', sa: 'वृषभ/मिथुन/कन्या/कुम्भराशिषु बलवान्' },
    signifies: { en: 'Obsession, foreign, unconventional, sudden gains, illusion, hessonite', hi: 'आसक्ति, विदेश, अपारम्परिक, आकस्मिक लाभ', sa: 'आसक्तिः, विदेशः, अपारम्परिकं, आकस्मिकलाभः' },
    exaltDeg: 'Taurus/Gemini (varies)', debilDeg: 'Scorpio/Sagittarius',
    moolatrikona: { en: 'Gemini (some authorities)', hi: 'मिथुन (कुछ शास्त्रकारों के अनुसार)' },
    ownSigns: { en: 'Aquarius (co-ruler)', hi: 'कुम्भ (सह-स्वामी)' },
    combustionDeg: 'Never combust',
    karakatva: { en: 'Foreign lands, outcasts, illusion, sudden events, paternal grandfather, serpents, hessonite (gomed), southwest direction, manipulation, obsession', hi: 'विदेश, बहिष्कृत, माया, आकस्मिक घटनाएँ, दादा, सर्प, गोमेद' },
  },
  8: {
    orbit: '18.6 years (nodal cycle)', dashaYears: 7,
    dignity: { en: 'Strong in Scorpio, Sagittarius, Pisces', hi: 'वृश्चिक/धनु/मीन में बलवान', sa: 'वृश्चिक/धनु/मीनराशिषु बलवान्' },
    signifies: { en: 'Detachment, moksha, past karma, spiritual insight, cat\'s eye', hi: 'वैराग्य, मोक्ष, पूर्व कर्म, आध्यात्मिक अन्तर्दृष्टि', sa: 'वैराग्यं, मोक्षः, पूर्वकर्म, आध्यात्मिकदृष्टिः' },
    exaltDeg: 'Scorpio/Sagittarius (varies)', debilDeg: 'Taurus/Gemini',
    moolatrikona: { en: 'Sagittarius (some authorities)', hi: 'धनु (कुछ शास्त्रकारों के अनुसार)' },
    ownSigns: { en: 'Scorpio (co-ruler)', hi: 'वृश्चिक (सह-स्वामी)' },
    combustionDeg: 'Never combust',
    karakatva: { en: 'Moksha, spiritual liberation, maternal grandfather, ascetics, flag, cat\'s eye (vaidurya), abstract knowledge, sharp objects, epidemics', hi: 'मोक्ष, आध्यात्मिक मुक्ति, नाना, संन्यासी, ध्वज, वैडूर्य, अमूर्त ज्ञान' },
  },
};

/* ── Friendship table ─────────────────────────────────────────────── */
const FRIENDSHIP_TABLE = [
  { planet: 'Sun / सूर्य', friends: 'Moon, Mars, Jupiter', neutrals: 'Mercury', enemies: 'Venus, Saturn' },
  { planet: 'Moon / चन्द्र', friends: 'Sun, Mercury', neutrals: 'Mars, Jupiter, Venus, Saturn', enemies: 'None' },
  { planet: 'Mars / मंगल', friends: 'Sun, Moon, Jupiter', neutrals: 'Venus, Saturn', enemies: 'Mercury' },
  { planet: 'Mercury / बुध', friends: 'Sun, Venus', neutrals: 'Mars, Jupiter, Saturn', enemies: 'Moon' },
  { planet: 'Jupiter / बृहस्पति', friends: 'Sun, Moon, Mars', neutrals: 'Saturn', enemies: 'Mercury, Venus' },
  { planet: 'Venus / शुक्र', friends: 'Mercury, Saturn', neutrals: 'Mars, Jupiter', enemies: 'Sun, Moon' },
  { planet: 'Saturn / शनि', friends: 'Mercury, Venus', neutrals: 'Jupiter', enemies: 'Sun, Moon, Mars' },
];

/* ── Dignity table ────────────────────────────────────────────────── */
const DIGNITY_TABLE = [
  { planet: 'Sun', exalt: 'Aries 10°', moola: 'Leo 0°-20°', own: 'Leo', debil: 'Libra 10°' },
  { planet: 'Moon', exalt: 'Taurus 3°', moola: 'Taurus 4°-30°', own: 'Cancer', debil: 'Scorpio 3°' },
  { planet: 'Mars', exalt: 'Capricorn 28°', moola: 'Aries 0°-12°', own: 'Aries, Scorpio', debil: 'Cancer 28°' },
  { planet: 'Mercury', exalt: 'Virgo 15°', moola: 'Virgo 16°-20°', own: 'Gemini, Virgo', debil: 'Pisces 15°' },
  { planet: 'Jupiter', exalt: 'Cancer 5°', moola: 'Sagittarius 0°-10°', own: 'Sagittarius, Pisces', debil: 'Capricorn 5°' },
  { planet: 'Venus', exalt: 'Pisces 27°', moola: 'Libra 0°-15°', own: 'Taurus, Libra', debil: 'Virgo 27°' },
  { planet: 'Saturn', exalt: 'Libra 20°', moola: 'Aquarius 0°-20°', own: 'Capricorn, Aquarius', debil: 'Aries 20°' },
];

/* ── Combustion ranges ────────────────────────────────────────────── */
const COMBUSTION_TABLE = [
  { planet: 'Moon / चन्द्र', degrees: '12°', note: 'Widest range; Amavasya = fully combust' },
  { planet: 'Mars / मंगल', degrees: '17°', note: 'Courage and energy diminished' },
  { planet: 'Mercury / बुध', degrees: '14° (12° retro)', note: 'Frequently combust due to proximity to Sun' },
  { planet: 'Jupiter / बृहस्पति', degrees: '11°', note: 'Wisdom and fortune weakened' },
  { planet: 'Venus / शुक्र', degrees: '8° (10° retro)', note: 'Narrowest; relationships suffer' },
  { planet: 'Saturn / शनि', degrees: '15°', note: 'Discipline and longevity affected' },
];

/* ── Special aspects ──────────────────────────────────────────────── */
const SPECIAL_ASPECTS = [
  { planet: 'Mars / मंगल', aspects: '4th, 7th, 8th', desc: { en: 'Mars aspects the 4th (property, home), 7th (spouse, partnerships), and 8th (longevity, hidden matters) from its position. This makes Mars influential over domestic life, marriage, and transformative events.', hi: 'मंगल अपने स्थान से 4थे (सम्पत्ति), 7वें (जीवनसाथी) और 8वें (आयु, गूढ़ विषय) भाव पर दृष्टि डालता है।' } },
  { planet: 'Jupiter / बृहस्पति', aspects: '5th, 7th, 9th', desc: { en: 'Jupiter aspects the 5th (children, intelligence), 7th (marriage), and 9th (dharma, fortune). Jupiter\'s aspects are considered highly benefic — they protect and nourish the houses they touch.', hi: 'बृहस्पति 5वें (सन्तान, बुद्धि), 7वें (विवाह) और 9वें (धर्म, भाग्य) भाव पर दृष्टि डालता है। बृहस्पति की दृष्टि अत्यन्त शुभ मानी जाती है।' } },
  { planet: 'Saturn / शनि', aspects: '3rd, 7th, 10th', desc: { en: 'Saturn aspects the 3rd (courage, effort), 7th (partnerships), and 10th (career, authority). Saturn\'s aspects bring discipline, delays, and lessons to these houses — they mature over time.', hi: 'शनि 3रे (साहस), 7वें (साझेदारी) और 10वें (व्यवसाय, अधिकार) भाव पर दृष्टि डालता है। शनि की दृष्टि अनुशासन, विलम्ब और शिक्षा लाती है।' } },
  { planet: 'Rahu / राहु', aspects: '5th, 7th, 9th', desc: { en: 'Rahu casts aspects like Jupiter (5th, 7th, 9th) but with an obsessive, unconventional, and amplifying quality. Some authorities do not accept Rahu\'s special aspects.', hi: 'राहु बृहस्पति जैसी दृष्टि (5, 7, 9) डालता है किन्तु आसक्ति और अपारम्परिकता के साथ। कुछ शास्त्रकार राहु की विशेष दृष्टि स्वीकार नहीं करते।' } },
  { planet: 'Ketu / केतु', aspects: '5th, 7th, 9th', desc: { en: 'Ketu\'s aspects mirror Rahu\'s — 5th, 7th, 9th — but with a spiritual, detaching, and karmic quality. Ketu\'s influence strips away material attachment from the houses it aspects.', hi: 'केतु की दृष्टि राहु जैसी (5, 7, 9) होती है किन्तु आध्यात्मिक, वैरागिक और कार्मिक गुण के साथ।' } },
];

/* ── Upagraha data ───────────────────────────────────────────────── */
const UPAGRAHAS = [
  { name: { en: 'Dhuma', hi: 'धूम', sa: 'धूमः' }, formula: { en: 'Sun + 133°20\'', hi: 'सूर्य + 133°20\'', sa: 'सूर्यः + 133°20\'' }, signifies: { en: 'Smoke, pollution, confusion, inauspiciousness. Dhuma in a house creates haze and unclear outcomes. Associated with obstacles from hidden enemies and confusion in decisions.', hi: 'धुआँ, प्रदूषण, भ्रम, अशुभता। धूम किसी भाव में धुंध और अस्पष्ट परिणाम बनाता है। छिपे शत्रुओं से बाधा और निर्णयों में भ्रम से जुड़ा।', sa: 'धूमः, प्रदूषणम्, भ्रमः, अशुभता।' } },
  { name: { en: 'Vyatipata', hi: 'व्यतीपात', sa: 'व्यतीपातः' }, formula: { en: '360° - Dhuma', hi: '360° - धूम', sa: '360° - धूमः' }, signifies: { en: 'Calamity, extreme misfortune. Vyatipata is considered one of the most inauspicious Upagrahas. Its placement shows where sudden reversals and unexpected disasters may occur. Particularly feared in muhurta calculations.', hi: 'आपदा, अत्यधिक दुर्भाग्य। व्यतीपात सबसे अशुभ उपग्रहों में से एक माना जाता है। इसका स्थान दर्शाता है कहाँ अचानक उलटफेर हो सकते हैं।', sa: 'विपत्तिः, अत्यधिकदुर्भाग्यम्।' } },
  { name: { en: 'Parivesha', hi: 'परिवेश', sa: 'परिवेषः' }, formula: { en: 'Vyatipata + 180°', hi: 'व्यतीपात + 180°', sa: 'व्यतीपातः + 180°' }, signifies: { en: 'Halo, encirclement, boundary. Parivesha can indicate being surrounded by obstacles or protective boundaries. It sometimes shows a sense of entrapment but also divine protection through circles of grace.', hi: 'प्रभामण्डल, परिवेष्टन, सीमा। परिवेश बाधाओं से घिरे होने या रक्षात्मक सीमाओं को दर्शा सकता है।', sa: 'प्रभामण्डलम्, परिवेष्टनम्, सीमा।' } },
  { name: { en: 'Indra Chapa (Indra Dhanus)', hi: 'इन्द्र चाप', sa: 'इन्द्रचापः' }, formula: { en: '360° - Parivesha', hi: '360° - परिवेश', sa: '360° - परिवेषः' }, signifies: { en: 'Rainbow, Indra\'s bow. Associated with sudden fortune or disaster depending on dignity. Can indicate government favor or punishment, dramatic turns of fate, and encounters with authority. Named after Indra, king of the Devas.', hi: 'इन्द्रधनुष, इन्द्र का धनुष। स्थिति के अनुसार अचानक सौभाग्य या आपदा। सरकारी कृपा या दण्ड, भाग्य के नाटकीय मोड़ दर्शा सकता है।', sa: 'इन्द्रधनुः। स्थित्यनुसारं आकस्मिकसौभाग्यम् आपदा वा।' } },
  { name: { en: 'Upaketu', hi: 'उपकेतु', sa: 'उपकेतुः' }, formula: { en: 'Indra Chapa + 16°40\'', hi: 'इन्द्र चाप + 16°40\'', sa: 'इन्द्रचापः + 16°40\'' }, signifies: { en: 'Sub-Ketu, secondary shadow. Functions like a minor Ketu — bringing detachment, spiritual inclination, and sudden events. Upaketu in a house can indicate unexpected losses but also sudden spiritual insights. Its effects are more subtle than Ketu but in a similar vein.', hi: 'उप-केतु, द्वितीयक छाया। लघु केतु जैसा कार्य करता है — वैराग्य, आध्यात्मिक प्रवृत्ति और अचानक घटनाएँ लाता है।', sa: 'उपकेतुः, द्वितीयकच्छाया। लघुकेतुवत् कार्यं करोति — वैराग्यम्, आध्यात्मिकप्रवृत्तिम्, आकस्मिकघटनाश्च आनयति।' } },
];

/* ── Cross-reference links ────────────────────────────────────────── */
const CROSS_REFS = [
  { href: '/learn/nakshatras', label: { en: 'Nakshatras — 27 Lunar Mansions', hi: 'नक्षत्र — 27 चन्द्र गृह' }, desc: { en: 'Each Nakshatra is ruled by a specific Graha', hi: 'प्रत्येक नक्षत्र एक विशिष्ट ग्रह द्वारा शासित' } },
  { href: '/learn/kundali', label: { en: 'Kundali — Birth Chart Basics', hi: 'कुण्डली — जन्म कुण्डली मूल बातें' }, desc: { en: 'How Grahas are placed in houses and signs', hi: 'ग्रह भावों और राशियों में कैसे स्थित होते हैं' } },
  { href: '/learn/bhavas', label: { en: 'Bhavas — The 12 Houses', hi: 'भाव — 12 भाव' }, desc: { en: 'The houses that Grahas occupy and influence', hi: 'वे भाव जिनमें ग्रह स्थित होते हैं और प्रभावित करते हैं' } },
  { href: '/learn/dashas', label: { en: 'Dashas — Planetary Periods', hi: 'दशा — ग्रह काल' }, desc: { en: 'How planetary periods unfold across life', hi: 'ग्रह काल जीवन में कैसे प्रकट होते हैं' } },
  { href: '/learn/yogas', label: { en: 'Yogas — Planetary Combinations', hi: 'योग — ग्रह संयोग' }, desc: { en: 'Special combinations formed by Grahas', hi: 'ग्रहों द्वारा बनने वाले विशेष संयोग' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का गोचर' }, desc: { en: 'Saturn\'s transit over your Moon sign', hi: 'आपकी चन्द्र राशि पर शनि का गोचर' } },
];

export default function LearnGrahasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const loc = isDevanagariLocale(locale) ? 'hi' as const : 'en' as const; // fallback sa→hi for inline labels that only have en/hi

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {((L.overviewTitle as Record<string, string>)[locale] ?? L.overviewTitle.en)}
        </h2>
        <p className="text-text-secondary">{t('grahasSubtitle')}</p>
      </div>

      {/* ── Sanskrit Key Terms ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="That which grasps" />
        <SanskritTermCard term="Uccha" devanagari="उच्च" transliteration="Ucca" meaning="Exalted (strongest)" />
        <SanskritTermCard term="Neecha" devanagari="नीच" transliteration="Nīca" meaning="Debilitated (weakest)" />
        <SanskritTermCard term="Vakri" devanagari="वक्री" transliteration="Vakrī" meaning="Retrograde" />
        <SanskritTermCard term="Asta" devanagari="अस्त" transliteration="Asta" meaning="Combust (near Sun)" />
        <SanskritTermCard term="Drishti" devanagari="दृष्टि" transliteration="Dṛṣṭi" meaning="Aspect (planetary glance)" />
        <SanskritTermCard term="Mitra" devanagari="मित्र" transliteration="Mitra" meaning="Friend (planet)" />
        <SanskritTermCard term="Shatru" devanagari="शत्रु" transliteration="Śatru" meaning="Enemy (planet)" />
        <SanskritTermCard term="Karaka" devanagari="कारक" transliteration="Kāraka" meaning="Significator" />
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Daśā" meaning="Planetary period" />
      </div>

      {/* ── Section 1: Overview ───────────────────────────────────── */}
      <LessonSection number={1} title={!isDevanagariLocale(locale) ? 'What are the Navagraha?' : isDevanagariLocale(locale) ? 'नवग्रह क्या हैं?' : 'नवग्रहाः के?'}>
        <p>{((L.overviewContent as Record<string, string>)[locale] ?? L.overviewContent.en)}</p>
        <p className="mt-3">{((L.overviewContent2 as Record<string, string>)[locale] ?? L.overviewContent2.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-1">
            {!isDevanagariLocale(locale) ? 'Graha ≠ Planet. Graha = "That which seizes" (√grah = to grasp)' : 'ग्रह ≠ ग्रह। ग्रह = "जो पकड़ता है" (√ग्रह् = ग्रहण करना)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {!isDevanagariLocale(locale) ? '7 physical bodies + 2 mathematical shadow points = 9 Grahas' : '7 भौतिक पिण्ड + 2 गणितीय छाया बिन्दु = 9 ग्रह'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 2: Benefics vs Malefics ───────────────────────── */}
      <LessonSection number={2} title={((L.beneficMaleficTitle as Record<string, string>)[locale] ?? L.beneficMaleficTitle.en)}>
        <p>{((L.beneficMaleficContent as Record<string, string>)[locale] ?? L.beneficMaleficContent.en)}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5">
            <h4 className="text-emerald-400 font-bold mb-2">{!isDevanagariLocale(locale) ? 'Natural Benefics (Shubha)' : 'नैसर्गिक शुभ ग्रह'}</h4>
            <div className="space-y-1 text-text-secondary text-sm">
              <p>♃ {!isDevanagariLocale(locale) ? 'Jupiter — Greatest benefic (Guru)' : 'बृहस्पति — सर्वोत्तम शुभ (गुरु)'}</p>
              <p>♀ {!isDevanagariLocale(locale) ? 'Venus — Benefic of beauty and love' : 'शुक्र — सौन्दर्य और प्रेम का शुभ ग्रह'}</p>
              <p>☽ {!isDevanagariLocale(locale) ? 'Moon — Benefic when waxing (Shukla Paksha)' : 'चन्द्र — शुक्ल पक्ष में शुभ'}</p>
              <p>☿ {!isDevanagariLocale(locale) ? 'Mercury — Benefic when unafflicted' : 'बुध — अपीड़ित होने पर शुभ'}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-red-400/20 bg-red-400/5">
            <h4 className="text-red-400 font-bold mb-2">{!isDevanagariLocale(locale) ? 'Natural Malefics (Papa)' : 'नैसर्गिक पाप ग्रह'}</h4>
            <div className="space-y-1 text-text-secondary text-sm">
              <p>☉ {!isDevanagariLocale(locale) ? 'Sun — Separative, burning influence' : 'सूर्य — पृथक करने वाला, दाहक प्रभाव'}</p>
              <p>♂ {!isDevanagariLocale(locale) ? 'Mars — Aggressive, conflict-prone' : 'मंगल — आक्रामक, संघर्षशील'}</p>
              <p>♄ {!isDevanagariLocale(locale) ? 'Saturn — Restrictive, delays, karma' : 'शनि — प्रतिबन्धक, विलम्ब, कर्म'}</p>
              <p>☊ {!isDevanagariLocale(locale) ? 'Rahu — Obsessive, illusory, amplifying' : 'राहु — आसक्तिकर, मायावी, प्रवर्धक'}</p>
              <p>☋ {!isDevanagariLocale(locale) ? 'Ketu — Detaching, karmic, spiritual' : 'केतु — विरक्तिकर, कार्मिक, आध्यात्मिक'}</p>
              <p>☽ {!isDevanagariLocale(locale) ? 'Moon — Malefic when waning (Krishna Paksha)' : 'चन्द्र — कृष्ण पक्ष में पाप'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">{((L.beneficNote as Record<string, string>)[locale] ?? L.beneficNote.en)}</p>
        </div>
      </LessonSection>

      {/* ── Section 3: Planetary Friendships ──────────────────────── */}
      <LessonSection number={3} title={((L.friendshipTitle as Record<string, string>)[locale] ?? L.friendshipTitle.en)}>
        <p>{((L.friendshipContent as Record<string, string>)[locale] ?? L.friendshipContent.en)}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-primary font-semibold">{!isDevanagariLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400 font-semibold">{!isDevanagariLocale(locale) ? 'Friends (Mitra)' : 'मित्र'}</th>
                <th className="text-left py-2 px-3 text-amber-400 font-semibold">{!isDevanagariLocale(locale) ? 'Neutral (Sama)' : 'सम'}</th>
                <th className="text-left py-2 px-3 text-red-400 font-semibold">{!isDevanagariLocale(locale) ? 'Enemies (Shatru)' : 'शत्रु'}</th>
              </tr>
            </thead>
            <tbody>
              {FRIENDSHIP_TABLE.map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-2 px-3 text-emerald-400/80">{row.friends}</td>
                  <td className="py-2 px-3 text-amber-400/80">{row.neutrals}</td>
                  <td className="py-2 px-3 text-red-400/80">{row.enemies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {!isDevanagariLocale(locale) ? 'Panchada Maitri (5-fold) = Natural + Temporal combined:' : 'पंचधा मैत्री = नैसर्गिक + तात्कालिक संयुक्त:'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Friend + Friend = Adhi Mitra (great friend) | Enemy + Enemy = Adhi Shatru (great enemy)'
              : 'मित्र + मित्र = अधिमित्र | शत्रु + शत्रु = अधिशत्रु'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 4: Planetary Dignities ────────────────────────── */}
      <LessonSection number={4} title={((L.dignityTitle as Record<string, string>)[locale] ?? L.dignityTitle.en)}>
        <p>{((L.dignityContent as Record<string, string>)[locale] ?? L.dignityContent.en)}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-primary font-semibold">{!isDevanagariLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400 font-semibold">{!isDevanagariLocale(locale) ? 'Exaltation (Uccha)' : 'उच्च'}</th>
                <th className="text-left py-2 px-3 text-amber-400 font-semibold">{!isDevanagariLocale(locale) ? 'Moolatrikona' : 'मूलत्रिकोण'}</th>
                <th className="text-left py-2 px-3 text-blue-400 font-semibold">{!isDevanagariLocale(locale) ? 'Own Sign (Swakshetra)' : 'स्वक्षेत्र'}</th>
                <th className="text-left py-2 px-3 text-red-400 font-semibold">{!isDevanagariLocale(locale) ? 'Debilitation (Neecha)' : 'नीच'}</th>
              </tr>
            </thead>
            <tbody>
              {DIGNITY_TABLE.map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-2 px-3 text-emerald-400/80">{row.exalt}</td>
                  <td className="py-2 px-3 text-amber-400/80">{row.moola}</td>
                  <td className="py-2 px-3 text-blue-400/80">{row.own}</td>
                  <td className="py-2 px-3 text-red-400/80">{row.debil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {!isDevanagariLocale(locale) ? 'Strength hierarchy: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated' : 'बल क्रम: उच्च > मूलत्रिकोण > स्वक्षेत्र > मित्र > सम > शत्रु > नीच'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {!isDevanagariLocale(locale) ? 'Note: Rahu & Ketu dignities are debated; listed signs are from Parashari tradition' : 'नोट: राहु और केतु की गरिमा विवादित है; सूचीबद्ध राशियाँ पाराशरी परम्परा से हैं'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 5: Combustion ─────────────────────────────────── */}
      <LessonSection number={5} title={((L.combustionTitle as Record<string, string>)[locale] ?? L.combustionTitle.en)}>
        <p>{((L.combustionContent as Record<string, string>)[locale] ?? L.combustionContent.en)}</p>
        <div className="mt-4 space-y-2">
          {COMBUSTION_TABLE.map((row) => (
            <div key={row.planet} className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
              <span className="text-gold-light font-medium text-sm w-36 flex-shrink-0">{row.planet}</span>
              <span className="text-red-400 font-mono text-sm w-28 flex-shrink-0">{!isDevanagariLocale(locale) ? 'within' : ''} {row.degrees} {!isDevanagariLocale(locale) ? 'of Sun' : 'सूर्य से'}</span>
              <span className="text-text-secondary/75 text-xs">{!isDevanagariLocale(locale) ? row.note : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">
            {locale === 'en'
              ? 'Rahu and Ketu are shadow points (lunar nodes) and cannot be combust. Some texts also exempt a planet in its own sign from full combustion effects.'
              : 'राहु और केतु छाया बिन्दु हैं और अस्त नहीं हो सकते। कुछ ग्रन्थ स्वराशि में स्थित ग्रह को पूर्ण अस्त प्रभाव से मुक्त मानते हैं।'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 6: Retrograde ─────────────────────────────────── */}
      <LessonSection number={6} title={((L.retrogradeTitle as Record<string, string>)[locale] ?? L.retrogradeTitle.en)}>
        <p>{((L.retrogradeContent as Record<string, string>)[locale] ?? L.retrogradeContent.en)}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isDevanagariLocale(locale) ? 'Can Be Retrograde' : 'वक्री हो सकते हैं'}</div>
            <p className="text-text-secondary text-sm">Mars, Mercury, Jupiter, Venus, Saturn</p>
          </div>
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isDevanagariLocale(locale) ? 'Never Retrograde' : 'कभी वक्री नहीं'}</div>
            <p className="text-text-secondary text-sm">Sun, Moon</p>
          </div>
          <div className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/50 text-center">
            <div className="text-gold-primary font-bold text-lg mb-1">{!isDevanagariLocale(locale) ? 'Always Retrograde' : 'सदा वक्री'}</div>
            <p className="text-text-secondary text-sm">Rahu, Ketu ({!isDevanagariLocale(locale) ? 'mean motion' : 'मध्यम गति'})</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/80 text-sm italic">{((L.retrogradeNote as Record<string, string>)[locale] ?? L.retrogradeNote.en)}</p>
        </div>
      </LessonSection>

      {/* ── Section 7: Planetary Aspects ──────────────────────────── */}
      <LessonSection number={7} title={((L.aspectsTitle as Record<string, string>)[locale] ?? L.aspectsTitle.en)}>
        <p>{((L.aspectsContent as Record<string, string>)[locale] ?? L.aspectsContent.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm">
            {!isDevanagariLocale(locale) ? 'Universal Rule: All planets aspect the 7th house from themselves (full 100% Drishti)' : 'सार्वभौमिक नियम: सभी ग्रह अपने 7वें भाव पर पूर्ण दृष्टि (100%) डालते हैं'}
          </p>
        </div>
        <div className="space-y-4">
          {SPECIAL_ASPECTS.map((item) => (
            <motion.div
              key={item.planet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-semibold">{item.planet}</span>
                <span className="text-gold-primary/70 text-xs font-mono px-2 py-0.5 rounded bg-gold-primary/10">{!isDevanagariLocale(locale) ? 'Aspects:' : 'दृष्टि:'} {item.aspects}</span>
              </div>
              <p className="text-text-secondary text-sm">{item.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 7b: Aspect Strength ─────────────────────────── */}
      <LessonSection title={((L.aspectStrengthTitle as Record<string, string>)[locale] ?? L.aspectStrengthTitle.en)} variant="formula">
        <p>{((L.aspectStrengthContent as Record<string, string>)[locale] ?? L.aspectStrengthContent.en)}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-semibold">{!isDevanagariLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">3rd</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">4th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">5th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">7th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">8th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">9th</th>
                <th className="text-center py-2 px-3 text-gold-light font-semibold">10th</th>
              </tr>
            </thead>
            <tbody>
              {[
                { planet: 'All Planets', h3: '25%', h4: '75%', h5: '50%', h7: '100%', h8: '25%', h9: '50%', h10: '25%' },
                { planet: 'Mars / मंगल', h3: '25%', h4: '100%', h5: '50%', h7: '100%', h8: '100%', h9: '50%', h10: '25%' },
                { planet: 'Jupiter / बृहस्पति', h3: '25%', h4: '75%', h5: '100%', h7: '100%', h8: '25%', h9: '100%', h10: '25%' },
                { planet: 'Saturn / शनि', h3: '100%', h4: '75%', h5: '50%', h7: '100%', h8: '25%', h9: '50%', h10: '100%' },
              ].map((row) => (
                <tr key={row.planet} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2 px-3 text-gold-light font-medium text-xs">{row.planet}</td>
                  {[row.h3, row.h4, row.h5, row.h7, row.h8, row.h9, row.h10].map((val, j) => (
                    <td key={j} className={`py-2 px-3 text-center text-xs font-mono ${val === '100%' ? 'text-gold-primary font-bold' : 'text-text-secondary/75'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 7c: Upagrahas ────────────────────────────────── */}
      <LessonSection title={((L.upagrahaTitle as Record<string, string>)[locale] ?? L.upagrahaTitle.en)}>
        <p>{((L.upagrahaContent as Record<string, string>)[locale] ?? L.upagrahaContent.en)}</p>
        <div className="mt-4 space-y-3">
          {UPAGRAHAS.map((upa, i) => (
            <motion.div
              key={upa.name.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-semibold">{upa.name[locale]}</span>
                <span className="text-gold-primary/50 text-xs font-mono px-2 py-0.5 rounded bg-gold-primary/5">{upa.formula[loc]}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{upa.signifies[locale]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 8: Karakatva ──────────────────────────────────── */}
      <LessonSection number={8} title={((L.karakatvaTitle as Record<string, string>)[locale] ?? L.karakatvaTitle.en)}>
        <p>{((L.karakatvaContent as Record<string, string>)[locale] ?? L.karakatvaContent.en)}</p>
        <div className="mt-4 space-y-3">
          {GRAHAS.map((g) => {
            const details = PLANET_DETAILS[g.id];
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5" style={{ color: g.color }}>{g.symbol}</span>
                <div>
                  <span className="text-gold-light font-semibold text-sm">{g.name[locale]}</span>
                  <p className="text-text-secondary text-xs mt-1">{details.karakatva[loc]}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ── Section 9: Complete Planet Profiles ───────────────────── */}
      <LessonSection number={9} title={t('completeList')}>
        <div className="space-y-4">
          {GRAHAS.map((g, i) => {
            const details = PLANET_DETAILS[g.id];
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" style={{ color: g.color }}>{g.symbol}</span>
                  <div className="flex-1">
                    <div className="text-gold-light font-semibold">{g.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/75 text-xs">{g.name.en}</div>}
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary/70 text-xs font-mono">{details.orbit}</span>
                    <div className="text-gold-primary/70 text-xs">{details.dashaYears} yr Dasha</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{details.signifies[locale]}</p>
                <p className="text-text-secondary/75 text-xs italic mb-2">{details.dignity[locale]}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary/70">
                  <div><span className="text-gold-primary/60">{!isDevanagariLocale(locale) ? 'Own Sign:' : 'स्वराशि:'}</span> {details.ownSigns[loc]}</div>
                  <div><span className="text-gold-primary/60">{!isDevanagariLocale(locale) ? 'Moolatrikona:' : 'मूलत्रिकोण:'}</span> {details.moolatrikona[loc]}</div>
                  <div><span className="text-gold-primary/60">{!isDevanagariLocale(locale) ? 'Combustion:' : 'अस्त:'}</span> {details.combustionDeg}</div>
                  <div><span className="text-gold-primary/60">{!isDevanagariLocale(locale) ? 'Dasha:' : 'दशा:'}</span> {details.dashaYears} {!isDevanagariLocale(locale) ? 'years' : 'वर्ष'}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ── Section 10: Dasha Brief ───────────────────────────────── */}
      <LessonSection number={10} title={((L.dashaTitle as Record<string, string>)[locale] ?? L.dashaTitle.en)}>
        <p>{((L.dashaContent as Record<string, string>)[locale] ?? L.dashaContent.en)}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {[
            { name: 'Ketu', years: 7, color: '#95a5a6' },
            { name: 'Venus', years: 20, color: '#e8e6e3' },
            { name: 'Sun', years: 6, color: '#e67e22' },
            { name: 'Moon', years: 10, color: '#ecf0f1' },
            { name: 'Mars', years: 7, color: '#e74c3c' },
            { name: 'Rahu', years: 18, color: '#8e44ad' },
            { name: 'Jupiter', years: 16, color: '#f39c12' },
            { name: 'Saturn', years: 19, color: '#3498db' },
            { name: 'Mercury', years: 17, color: '#2ecc71' },
          ].map((d) => (
            <div
              key={d.name}
              className="flex flex-col items-center p-2 rounded-lg border border-gold-primary/10 bg-bg-primary/30"
              style={{ minWidth: '70px' }}
            >
              <span className="text-xs font-semibold" style={{ color: d.color }}>{d.name}</span>
              <span className="text-gold-primary text-lg font-bold">{d.years}</span>
              <span className="text-text-secondary/70 text-xs">{!isDevanagariLocale(locale) ? 'years' : 'वर्ष'}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <p className="text-gold-light/60 font-mono text-xs">
            {!isDevanagariLocale(locale) ? 'Total: 7+20+6+10+7+18+16+19+17 = 120 years' : 'कुल: 7+20+6+10+7+18+16+19+17 = 120 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* ── Significance (preserved) ──────────────────────────────── */}
      <LessonSection title={t('significanceSection')} variant="highlight">
        <p>{((L.significanceContent as Record<string, string>)[locale] ?? L.significanceContent.en)}</p>
      </LessonSection>

      {/* ── Section 11: Cross References ──────────────────────────── */}
      <LessonSection number={11} title={((L.crossRefTitle as Record<string, string>)[locale] ?? L.crossRefTitle.en)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/nakshatras'}
              className="block p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{ref.label[loc]}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{ref.desc[loc]}</p>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}
