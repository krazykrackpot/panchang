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
  { devanagari: 'तुला', transliteration: 'Tulā', meaning: { en: 'Balance / Scales — the symbol of justice', hi: 'तुला — न्याय का प्रतीक' } },
  { devanagari: 'शुक्र', transliteration: 'Śukra', meaning: { en: 'Venus — ruler of Tula', hi: 'शुक्र — तुला का स्वामी' } },
  { devanagari: 'चर', transliteration: 'Chara', meaning: { en: 'Cardinal / Movable — the modality of Tula', hi: 'चर — तुला की प्रकृति' } },
  { devanagari: 'वायु', transliteration: 'Vāyu', meaning: { en: 'Air — the element of Tula', hi: 'वायु — तुला का तत्त्व' } },
  { devanagari: 'साम्य', transliteration: 'Sāmya', meaning: { en: 'Equilibrium / Equality', hi: 'साम्य — समता, सन्तुलन' } },
  { devanagari: 'कूटनीति', transliteration: 'Kūṭanīti', meaning: { en: 'Diplomacy — Libra\'s natural gift', hi: 'कूटनीति — तुला की स्वाभाविक प्रतिभा' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Air (Vayu Tattva)', hi: 'वायु तत्त्व' },
  modality: { en: 'Cardinal / Movable (Chara)', hi: 'चर' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुल्लिंग (पुरुष)' },
  ruler: { en: 'Venus (Shukra)', hi: 'शुक्र' },
  symbol: { en: 'Scales / Balance ♎', hi: 'तराजू ♎' },
  degreeRange: { en: '180° to 210° of the zodiac', hi: 'राशिचक्र के 180° से 210°' },
  direction: { en: 'West', hi: 'पश्चिम' },
  season: { en: 'Sharad (Autumn)', hi: 'शरद ऋतु' },
  color: { en: 'White, light blue, pastel shades', hi: 'श्वेत, हल्का नीला, पेस्टल रंग' },
  bodyPart: { en: 'Kidneys, lower back, bladder, adrenal glands, skin', hi: 'गुर्दे, पीठ का निचला भाग, मूत्राशय, अधिवृक्क ग्रन्थियाँ, त्वचा' },
};

// ─── Nakshatras in Tula ────────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Chitra padas 3-4 (180° – 186°40\')', hi: 'चित्रा पाद 3-4 (180° – 186°40\')' },
    ruler: { en: 'Mars', hi: 'मंगल' },
    deity: { en: 'Tvashtar (the celestial architect)', hi: 'त्वष्टर् (दिव्य वास्तुकार)' },
    desc: {
      en: 'The last two padas of Chitra fall in Libra, bringing Mars\'s creative construction energy into Venus\'s aesthetic domain. Tvashtar the divine architect fashions beauty with structural integrity — these natives are designers, fashion creators, jewelers, and architects who merge form with function. Mars in Venus\'s sign creates a dynamic tension between beauty and force, diplomacy and directness. The shakti is the power to accumulate merit through beautiful creation. This is the birth point of Libra — where raw creative energy first meets the demand for harmony.',
      hi: 'चित्रा के अन्तिम दो पाद तुला में पड़ते हैं, जो शुक्र के सौन्दर्य क्षेत्र में मंगल की सृजनात्मक निर्माण ऊर्जा लाते हैं। त्वष्टर् संरचनात्मक अखण्डता के साथ सुन्दरता रचता है — ये जातक डिज़ाइनर, फैशन रचनाकार, जौहरी और वास्तुकार होते हैं जो रूप को कार्य से मिलाते हैं। यह तुला का जन्म बिन्दु है — जहाँ कच्ची सृजनात्मक ऊर्जा पहली बार सामंजस्य की माँग से मिलती है।',
    },
  },
  {
    name: { en: 'Swati (186°40\' – 200°)', hi: 'स्वाति (186°40\' – 200°)' },
    ruler: { en: 'Rahu', hi: 'राहु' },
    deity: { en: 'Vayu (god of wind)', hi: 'वायु (पवन देव)' },
    desc: {
      en: 'Swati is the heart of Libra — the independent, self-driven nakshatra of the wind god. Rahu as ruler gives unconventional approaches to trade, relationships, and social climbing. These natives are natural entrepreneurs, diplomats, and independent spirits who bend without breaking, like a blade of grass in the wind. The shakti is the power to scatter like the wind (pradhvamsa shakti). Freedom, movement, and adaptability define them. They are the traders, negotiators, and social architects who build networks across cultures. Coral is traditionally associated. Swati natives resist all forms of confinement — physical, emotional, or institutional.',
      hi: 'स्वाति तुला का हृदय है — वायु देव का स्वतन्त्र, आत्म-प्रेरित नक्षत्र। राहु स्वामी होने से व्यापार, सम्बन्ध और सामाजिक उन्नति में अपरम्परागत दृष्टिकोण आता है। ये जातक स्वाभाविक उद्यमी, राजनयिक और स्वतन्त्र प्रवृत्ति के होते हैं जो हवा में तिनके की भाँति झुकते हैं किन्तु टूटते नहीं। स्वतन्त्रता, गति और अनुकूलनशीलता इन्हें परिभाषित करती है। ये व्यापारी, वार्ताकार और सामाजिक वास्तुकार हैं।',
    },
  },
  {
    name: { en: 'Vishakha padas 1-3 (200° – 210°)', hi: 'विशाखा पाद 1-3 (200° – 210°)' },
    ruler: { en: 'Jupiter', hi: 'गुरु' },
    deity: { en: 'Indra-Agni (king of gods and fire god)', hi: 'इन्द्र-अग्नि (देवराज और अग्निदेव)' },
    desc: {
      en: 'The first three padas of Vishakha fall in Libra, bridging toward Scorpio. Jupiter as nakshatra lord in Venus\'s sign creates a fascinating tension between dharmic purpose and aesthetic pleasure. Indra-Agni as dual deity gives both regal ambition and fiery determination. These natives are driven by a single-minded goal — they will cross any boundary to achieve it. The shakti is the power to achieve many goals (vyapana shakti). Politicians, evangelists, and purpose-driven entrepreneurs. The transition from Libra\'s diplomacy to Scorpio\'s intensity begins here — the velvet glove concealing an iron fist.',
      hi: 'विशाखा के पहले तीन पाद तुला में पड़ते हैं, वृश्चिक की ओर सेतु बनाते हैं। शुक्र की राशि में गुरु शासित नक्षत्र धार्मिक उद्देश्य और सौन्दर्यात्मक आनन्द के बीच आकर्षक तनाव बनाता है। इन्द्र-अग्नि दोहरे देवता राजसी महत्वाकांक्षा और अग्निमय दृढ़ संकल्प देते हैं। ये जातक एकल-लक्ष्य से प्रेरित होते हैं। तुला की कूटनीति से वृश्चिक की तीव्रता में संक्रमण यहाँ शुरू होता है।',
    },
  },
];

// ─── Planetary Dignities Here ──────────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  exalted: {
    planet: { en: 'Saturn (exalted at 20° Libra)', hi: 'शनि (तुला 20° पर उच्च)' },
    desc: {
      en: 'Saturn reaches its highest dignity at 20° of Libra. The planet of discipline, justice, and karmic reckoning finds perfect expression in the sign of balance and fairness. Exalted Saturn is the impartial judge — blind to privilege, relentless in applying the law equally. In Venus\'s air sign, Saturn\'s harshness is tempered by diplomacy. This placement produces the finest judges, labor rights advocates, constitutional scholars, and organizational leaders who build just systems. Saturn at 20° Libra can single-handedly elevate an otherwise ordinary chart into one of enduring institutional power and social authority.',
      hi: 'शनि तुला 20° पर अपनी उच्चतम गरिमा प्राप्त करता है। अनुशासन, न्याय और कार्मिक गणना का ग्रह सन्तुलन और निष्पक्षता की राशि में पूर्ण अभिव्यक्ति पाता है। उच्च शनि निष्पक्ष न्यायाधीश है — विशेषाधिकार के प्रति अन्धा, विधि को समान रूप से लागू करने में अथक। शुक्र की वायु राशि में शनि की कठोरता कूटनीति से नरम होती है। यह स्थिति श्रेष्ठ न्यायाधीश, श्रम अधिकार अधिवक्ता और संवैधानिक विद्वान बनाती है।',
    },
  },
  debilitated: {
    planet: { en: 'Sun (debilitated at 10° Libra)', hi: 'सूर्य (तुला 10° पर नीच)' },
    desc: {
      en: 'The Sun falls to its lowest dignity at 10° of Libra. The planet of ego, authority, and individual will is profoundly weakened in the sign of compromise and partnership. Libra demands consensus; the Sun demands obedience. The native struggles to assert personal identity — always deferring to others, seeking approval, or defining themselves through relationships. Father may be weak, absent, or dependent. Self-confidence requires external validation. However, Neecha Bhanga (cancellation of debilitation) is very common: if Venus is strong, or if Saturn (exalted here) aspects, the debilitation is neutralized — producing diplomats and consensus-builders of extraordinary skill.',
      hi: 'सूर्य तुला 10° पर अपनी न्यूनतम गरिमा में है। अहंकार, अधिकार और व्यक्तिगत इच्छाशक्ति का ग्रह समझौते और साझेदारी की राशि में गहरे रूप से दुर्बल है। तुला सहमति माँगती है; सूर्य आज्ञाकारिता माँगता है। जातक व्यक्तिगत पहचान स्थापित करने में संघर्ष करता है। पिता कमज़ोर, अनुपस्थित या आश्रित हो सकते हैं। तथापि नीच भंग बहुत सामान्य है — यदि शुक्र बलवान है या शनि (यहाँ उच्च) दृष्टि करता है।',
    },
  },
  moolatrikona: {
    planet: { en: 'Venus (0°-5° of Libra)', hi: 'शुक्र (तुला 0°-5°)' },
    desc: {
      en: 'Venus\'s moolatrikona zone spans the first 5° of Libra — a narrow but powerful zone at the very beginning of the sign. In this zone, Venus operates as the consummate diplomat: graceful, fair-minded, and aesthetically precise. Per BPHS Chapter 4, this is where Venus gives its most reliable and constructive results. Venus at 0°-5° Libra is the master negotiator, the supreme aesthete, and the bridge-builder between opposing forces. Note that Venus also owns Taurus, but Libra is the moolatrikona — the "office" where Venus works most effectively.',
      hi: 'शुक्र का मूलत्रिकोण क्षेत्र तुला के पहले 5° में फैला है — राशि के ठीक शुरुआत में एक संकीर्ण किन्तु शक्तिशाली क्षेत्र। इस क्षेत्र में शुक्र पूर्ण राजनयिक के रूप में कार्य करता है: शालीन, निष्पक्ष और सौन्दर्यात्मक रूप से सूक्ष्म। बृहत् पराशर होरा शास्त्र अध्याय 4 के अनुसार यह वह क्षेत्र है जहाँ शुक्र सबसे विश्वसनीय और रचनात्मक फल देता है।',
    },
  },
  note: {
    en: 'Libra hosts a dramatic polarity: Saturn exalted and Sun debilitated in the same sign. This is the zodiac\'s statement that impersonal justice (Saturn) triumphs over personal ego (Sun) when balance is the arena. Venus as ruler adds the mediating principle of beauty and diplomacy between these extremes.',
    hi: 'तुला एक नाटकीय ध्रुवीयता को आश्रय देती है: एक ही राशि में शनि उच्च और सूर्य नीच। यह राशिचक्र का यह कथन है कि जब सन्तुलन मैदान हो, तब निर्वैयक्तिक न्याय (शनि) व्यक्तिगत अहंकार (सूर्य) पर विजय पाता है। शुक्र स्वामी के रूप में इन दोनों चरम सीमाओं के बीच सौन्दर्य और कूटनीति का मध्यस्थ सिद्धान्त जोड़ता है।',
  },
};

// ─── Each Planet in Tula ───────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun in Tula', hi: 'तुला में सूर्य' }, dignity: 'Debilitated',
    effect: {
      en: 'The ego dissolves in the desire for partnership and compromise. Sun in Libra creates individuals who define themselves through relationships rather than independent achievement. Decision-making is slow due to excessive weighing of all perspectives. At 10° (deepest fall), the native may completely lose sense of personal direction. However, this produces extraordinary diplomats, mediators, and partnership specialists. Father may be weak or the native has a complex relationship with authority. Neecha Bhanga through strong Venus or Saturn\'s exaltation here is very common and can produce world-class negotiators.',
      hi: 'अहंकार साझेदारी और समझौते की इच्छा में विलीन होता है। तुला में सूर्य ऐसे व्यक्ति बनाता है जो स्वतन्त्र उपलब्धि से नहीं, सम्बन्धों से स्वयं को परिभाषित करते हैं। निर्णय लेने में विलम्ब। 10° पर जातक व्यक्तिगत दिशा खो सकता है। तथापि यह असाधारण राजनयिक और मध्यस्थ बनाता है। बलवान शुक्र या शनि उच्च द्वारा नीच भंग बहुत सामान्य है।',
    },
  },
  {
    planet: { en: 'Moon in Tula', hi: 'तुला में चन्द्र' }, dignity: 'Neutral',
    effect: {
      en: 'The mind that seeks harmony above all else. Moon in Libra creates emotionally graceful, socially skilled, and aesthetically sensitive individuals. They need beauty in their environment to feel emotionally stable. Conflict of any kind disturbs their inner peace disproportionately. Can be emotionally codependent — the native\'s mood shifts based on relationship status. Mother may be charming, artistic, or overly concerned with appearances. Excellent for interior design, couples therapy, and event planning. Emotional decisions are slow but usually fair.',
      hi: 'सबसे ऊपर सामंजस्य चाहने वाला मन। तुला में चन्द्र भावनात्मक रूप से शालीन, सामाजिक रूप से कुशल और सौन्दर्यात्मक रूप से संवेदनशील व्यक्ति बनाता है। भावनात्मक स्थिरता के लिए वातावरण में सुन्दरता आवश्यक है। किसी भी प्रकार का संघर्ष उनकी आन्तरिक शान्ति को अनुपात से अधिक विचलित करता है। भावनात्मक रूप से सह-निर्भर हो सकते हैं।',
    },
  },
  {
    planet: { en: 'Mars in Tula', hi: 'तुला में मंगल' }, dignity: 'Neutral',
    effect: {
      en: 'The warrior forced to negotiate. Mars in Libra creates assertive diplomats, competitive lawyers, and aggressive aesthetic perfectioners. Action is filtered through the lens of fairness — the native fights for justice rather than personal gain. Can be passive-aggressive, channeling Mars\'s directness through Libra\'s indirectness. Relationships involve power dynamics and competitive partnerships. Excellent for litigation, fashion marketing, and competitive arts. Marriage may involve conflict or attraction to strong-willed partners.',
      hi: 'बातचीत करने को विवश योद्धा। तुला में मंगल मुखर राजनयिक, प्रतिस्पर्धी वकील और आक्रामक सौन्दर्य पूर्णतावादी बनाता है। कार्य निष्पक्षता के दृष्टिकोण से छनता है — जातक व्यक्तिगत लाभ के बजाय न्याय के लिए लड़ता है। निष्क्रिय-आक्रामक हो सकता है। विवाह में संघर्ष या दृढ़ इच्छाशक्ति वाले साथी से आकर्षण हो सकता है।',
    },
  },
  {
    planet: { en: 'Mercury in Tula', hi: 'तुला में बुध' }, dignity: 'Friend\'s sign',
    effect: {
      en: 'The communicator in the salon — Mercury in Libra is articulate, charming, and balanced in expression. These natives think in terms of relationships and comparisons, naturally seeing both sides of every argument. Excellent for contract law, public relations, and literary criticism. Writing style is elegant and measured. Communication is diplomatic, sometimes to the point of evasiveness. Good for translation work, cultural mediation, and editorial roles. The mind excels at weighing evidence and finding the balanced conclusion.',
      hi: 'सैलून में संवादक — तुला में बुध स्पष्टभाषी, आकर्षक और अभिव्यक्ति में सन्तुलित है। ये जातक सम्बन्धों और तुलनाओं में सोचते हैं, स्वाभाविक रूप से हर तर्क के दोनों पक्ष देखते हैं। अनुबन्ध विधि, जनसम्पर्क और साहित्यिक आलोचना के लिए उत्कृष्ट। लेखन शैली सुरुचिपूर्ण और संयमित।',
    },
  },
  {
    planet: { en: 'Jupiter in Tula', hi: 'तुला में गुरु' }, dignity: 'Neutral',
    effect: {
      en: 'The guru of relationships — Jupiter in Libra expands the native\'s capacity for partnership, justice, and aesthetic appreciation. These are the marriage counselors, ethical philosophers, and social justice advocates. Wisdom is expressed through fairness rather than proclamation. Children may be artistically gifted. Wealth comes through partnerships, legal work, or the beauty industry. Can be over-generous in relationships, giving more than what\'s balanced. Religion and philosophy are approached through the lens of equity and beauty.',
      hi: 'सम्बन्धों के गुरु — तुला में गुरु साझेदारी, न्याय और सौन्दर्यात्मक प्रशंसा की क्षमता का विस्तार करता है। ये विवाह परामर्शदाता, नैतिक दार्शनिक और सामाजिक न्याय अधिवक्ता होते हैं। ज्ञान उद्घोषणा से नहीं, निष्पक्षता से व्यक्त होता है। धन साझेदारी, विधिक कार्य या सौन्दर्य उद्योग से आता है।',
    },
  },
  {
    planet: { en: 'Venus in Tula', hi: 'तुला में शुक्र' }, dignity: 'Own sign / Moolatrikona',
    effect: {
      en: 'The queen in her own court — Venus in Libra is at its most refined, diplomatic, and aesthetically powerful. Love, beauty, and harmony are expressed with supreme grace. These natives have an almost supernatural ability to create beauty and resolve conflicts. Relationships are central to their identity and usually harmonious. Fashion, design, music, and diplomacy are natural domains. The first 5° (moolatrikona zone) is even more potent — producing master aesthetes and peacemakers. Can be indecisive and overly dependent on external validation.',
      hi: 'अपने दरबार में रानी — तुला में शुक्र अपने सबसे परिष्कृत, कूटनीतिक और सौन्दर्यात्मक रूप से शक्तिशाली रूप में है। प्रेम, सौन्दर्य और सामंजस्य सर्वोच्च शालीनता से व्यक्त होते हैं। ये जातक सुन्दरता बनाने और संघर्ष सुलझाने की लगभग अलौकिक क्षमता रखते हैं। पहले 5° (मूलत्रिकोण) और भी अधिक शक्तिशाली। अनिर्णायक और बाह्य मान्यता पर अत्यधिक निर्भर हो सकते हैं।',
    },
  },
  {
    planet: { en: 'Saturn in Tula', hi: 'तुला में शनि' }, dignity: 'Exalted',
    effect: {
      en: 'The impartial judge at the peak of his power — Saturn in Libra is the finest expression of justice in the entire zodiac. At 20° (deepest exaltation), Saturn delivers fair, measured, and enduring judgments. The native builds institutions, legal frameworks, and social systems that outlast them. Discipline is exercised through fairness, not force. Career in judiciary, constitutional law, human resources, or organizational leadership. Can be cold and impersonal — justice without mercy. Marriage may be late but usually stable and based on mutual respect rather than passion.',
      hi: 'अपनी शक्ति के शिखर पर निष्पक्ष न्यायाधीश — तुला में शनि सम्पूर्ण राशिचक्र में न्याय की श्रेष्ठतम अभिव्यक्ति है। 20° पर शनि निष्पक्ष, संयमित और स्थायी निर्णय देता है। जातक संस्थाएँ, विधिक ढाँचे और सामाजिक प्रणालियाँ बनाता है जो उससे अधिक जीवित रहती हैं। न्यायपालिका, संवैधानिक विधि, मानव संसाधन में करियर। विवाह विलम्बित किन्तु स्थिर।',
    },
  },
  {
    planet: { en: 'Rahu in Tula', hi: 'तुला में राहु' }, dignity: 'Neutral',
    effect: {
      en: 'The obsessive diplomat — Rahu in Libra amplifies the hunger for partnership, social status, and aesthetic perfection. These natives pursue relationships and social connections with unusual intensity. Foreign partnerships, unconventional marriages, and cross-cultural alliances are indicated. Can become manipulative in pursuit of harmony — using charm as a weapon. The beauty and fashion industry attracts strongly. Social climbing through strategic alliances. The native must learn that genuine harmony cannot be manufactured through manipulation.',
      hi: 'जुनूनी राजनयिक — तुला में राहु साझेदारी, सामाजिक प्रतिष्ठा और सौन्दर्यात्मक पूर्णता की भूख को बढ़ाता है। विदेशी साझेदारी, अपरम्परागत विवाह और अन्तर-सांस्कृतिक गठबन्धन इंगित। सामंजस्य की खोज में जोड़-तोड़ कर सकता है — आकर्षण को हथियार के रूप में प्रयोग। सौन्दर्य और फैशन उद्योग प्रबल आकर्षण।',
    },
  },
  {
    planet: { en: 'Ketu in Tula', hi: 'तुला में केतु' }, dignity: 'Neutral',
    effect: {
      en: 'Detachment from partnership and social validation — Ketu in Libra means the native has mastered relationships in past lives and now finds them unfulfilling. Marriage may feel like a formality. Social graces come naturally but are used without investment. Artistic talent is present but the native is detached from the outcome. Drawn toward Aries (opposite sign) themes — independence, self-assertion, and solo achievement. Can appear cold in relationships despite being spiritually compassionate. The lesson: move from pleasing others to discovering the self.',
      hi: 'साझेदारी और सामाजिक मान्यता से वैराग्य — तुला में केतु का अर्थ है जातक ने पूर्वजन्म में सम्बन्धों पर महारत हासिल की है और अब उन्हें अपूर्ण पाता है। विवाह औपचारिकता लग सकता है। सामाजिक शालीनता स्वाभाविक आती है किन्तु निवेश के बिना। मेष (विपरीत राशि) विषयों की ओर आकर्षित — स्वतन्त्रता और आत्म-स्थापना।',
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Natural diplomacy, aesthetic sensibility, fairness and justice orientation, social grace, ability to see all perspectives, charm and likeability, partnership skills, conflict resolution, appreciation of beauty in all forms, intellectual balance, gift for creating harmony',
    hi: 'स्वाभाविक कूटनीति, सौन्दर्यात्मक संवेदनशीलता, निष्पक्षता और न्याय भावना, सामाजिक शालीनता, सभी दृष्टिकोणों को देखने की क्षमता, आकर्षण, साझेदारी कौशल, संघर्ष समाधान, सौन्दर्य की प्रशंसा, बौद्धिक सन्तुलन',
  },
  weaknesses: {
    en: 'Chronic indecisiveness, people-pleasing at the cost of authenticity, avoidance of necessary conflict, dependency on relationships for self-worth, superficiality in pursuit of appearances, passive aggression, difficulty with solitude, tendency to intellectualize emotions rather than feel them',
    hi: 'दीर्घकालिक अनिर्णय, प्रामाणिकता की कीमत पर लोगों को प्रसन्न करना, आवश्यक संघर्ष से बचाव, आत्म-मूल्य के लिए सम्बन्धों पर निर्भरता, दिखावे की खोज में सतहीपन, निष्क्रिय आक्रामकता, एकान्त में कठिनाई',
  },
  temperament: {
    en: 'Tula natives are the diplomats and aesthetes of the zodiac. They move through the world seeking balance — in relationships, environments, ideas, and beauty. Their cardinal air nature makes them initiators of social movements, partnerships, and aesthetic trends. They are genuinely distressed by injustice, ugliness, or discord. Unlike Aries (opposite sign) who charges forward alone, Libra advances through alliance and consensus. Their greatest strength — seeing all sides — is also their greatest weakness: they can become paralyzed by the desire to be fair to everyone. At their best, they are the peacemakers who forge unity from diversity.',
    hi: 'तुला जातक राशिचक्र के राजनयिक और सौन्दर्यप्रेमी हैं। वे सन्तुलन खोजते हुए संसार में विचरण करते हैं — सम्बन्धों, वातावरण, विचारों और सौन्दर्य में। उनकी चर वायु प्रकृति उन्हें सामाजिक आन्दोलनों, साझेदारियों और सौन्दर्यात्मक प्रवृत्तियों के प्रवर्तक बनाती है। अन्याय, कुरूपता या कलह से वे वास्तव में व्यथित होते हैं। उनकी सबसे बड़ी शक्ति — सभी पक्ष देखना — उनकी सबसे बड़ी दुर्बलता भी है: सबके प्रति निष्पक्ष होने की इच्छा से पंगु हो सकते हैं।',
  },
  appearance: {
    en: 'Well-proportioned and symmetrical features, attractive and pleasant countenance, dimpled smile, clear complexion, graceful movements, refined dress sense with attention to coordination, medium height with elegant build, eyes that convey warmth and approachability',
    hi: 'सुगठित और सममित आकृति, आकर्षक और सुखद मुखाकृति, गड्ढेदार मुस्कान, स्पष्ट वर्ण, शालीन हाव-भाव, समन्वय पर ध्यान देने वाली परिष्कृत वेशभूषा, सुरुचिपूर्ण शरीर संरचना के साथ मध्यम ऊँचाई',
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Law (especially constitutional and contract law), diplomacy and foreign service, fashion design and luxury retail, interior design and architecture, marriage counseling and mediation, art curation and gallery management, public relations and corporate communications, beauty industry (cosmetics, skincare), event planning and hospitality, music and performing arts, human rights advocacy, jewelry design',
    hi: 'विधि (विशेषतः संवैधानिक और अनुबन्ध विधि), कूटनीति और विदेश सेवा, फैशन डिज़ाइन और विलासिता खुदरा, इंटीरियर डिज़ाइन, विवाह परामर्श और मध्यस्थता, कला क्यूरेशन, जनसम्पर्क, सौन्दर्य उद्योग, आयोजन प्रबन्धन, संगीत और प्रदर्शन कला, मानवाधिकार',
  },
  insight: {
    en: 'Libra natives thrive in roles that require negotiation, aesthetic judgment, and interpersonal finesse. They are the bridge-builders of the professional world — connecting opposing parties, creating beautiful environments, and ensuring fairness in transactions. They do poorly in isolated, combative, or aesthetically barren environments. The ideal Libra career involves partnership (business or creative), has an aesthetic component, and contributes to social harmony. They are often the power behind the throne rather than on it.',
    hi: 'तुला जातक उन भूमिकाओं में फलते-फूलते हैं जो बातचीत, सौन्दर्यात्मक निर्णय और पारस्परिक कुशलता की माँग करती हैं। वे व्यावसायिक जगत के सेतु-निर्माता हैं — विरोधी पक्षों को जोड़ते हैं, सुन्दर वातावरण बनाते हैं और लेन-देन में निष्पक्षता सुनिश्चित करते हैं। आदर्श तुला करियर में साझेदारी, सौन्दर्य घटक और सामाजिक सामंजस्य में योगदान शामिल है।',
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Gemini (Mithuna): Air with air — intellectual stimulation, social dynamism, and endless conversation. Aquarius (Kumbha): Air with air — shared idealism, humanitarian vision, and mutual respect for independence. Leo (Simha): Opposite sign attraction — Leo provides boldness and warmth that Libra admires, while Libra provides the grace and diplomacy that Leo needs. Sagittarius (Dhanu): Fire with air — philosophical connection, shared love of culture, and optimistic partnership.',
    hi: 'मिथुन: वायु-वायु — बौद्धिक उत्तेजना, सामाजिक गतिशीलता। कुम्भ: वायु-वायु — साझा आदर्शवाद और स्वतन्त्रता का सम्मान। सिंह: विपरीत राशि आकर्षण — सिंह साहस और उष्णता देता है, तुला शालीनता और कूटनीति। धनु: अग्नि-वायु — दार्शनिक जुड़ाव और आशावादी साझेदारी।',
  },
  challenging: {
    en: 'Cancer (Karka): Water with air — Cancer\'s emotional intensity overwhelms Libra\'s intellectual detachment. Different definitions of security. Capricorn (Makara): Both cardinal — power struggles over leadership style. Saturn\'s austerity clashes with Venus\'s indulgence. Aries (Mesha): Opposite sign tension — Aries\' directness wounds Libra\'s sensitivity. Can work if mutual respect develops. Virgo (Kanya): Earth with air — Virgo\'s criticism punctures Libra\'s need for approval.',
    hi: 'कर्क: जल-वायु — कर्क की भावनात्मक तीव्रता तुला की बौद्धिक अलगाव को अभिभूत करती है। मकर: दोनों चर — नेतृत्व शैली पर सत्ता संघर्ष। मेष: विपरीत राशि तनाव — मेष की सीधापन तुला की संवेदनशीलता को घायल करता है। कन्या: कन्या की आलोचना तुला की स्वीकृति आवश्यकता को भेदती है।',
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Goddess Lakshmi is the primary deity for Tula Rashi — the embodiment of beauty, prosperity, and graceful abundance. Venus (Shukra) was the guru of the Asuras (demons) in mythology, possessing the Sanjeevani Vidya (knowledge of resurrection). Lord Kartikeya (Murugan) also resonates with Libra\'s martial-aesthetic balance. Worshipping Lakshmi strengthens Venus and enhances the native\'s capacity for harmony, beauty, and prosperous partnerships.',
    hi: 'देवी लक्ष्मी तुला राशि की प्राथमिक देवी हैं — सौन्दर्य, समृद्धि और शालीन प्रचुरता का मूर्त रूप। शुक्र पौराणिक कथाओं में असुरों के गुरु थे, संजीवनी विद्या के स्वामी। भगवान कार्तिकेय भी तुला के सैन्य-सौन्दर्य सन्तुलन से गुंजायमान हैं। लक्ष्मी की उपासना शुक्र को बल देती है।',
  },
  practices: {
    en: 'Chant the Shukra Beej Mantra: Om Draam Dreem Draum Sah Shukraya Namah — especially on Fridays. Wear diamond (Heera) or white sapphire in silver on the ring finger after consulting a Jyotishi. Donate white rice, white cloth, sugar, and white flowers on Fridays. Fast on Fridays consuming only dairy and fruits. Offer white flowers to Goddess Lakshmi. Recite Shri Suktam or Lakshmi Ashtottara. Practice artistic expression — singing, painting, or dance — as a form of devotional practice. Maintain harmony in relationships as a living remedy.',
    hi: 'शुक्र बीज मन्त्र जपें: ॐ द्रां द्रीं द्रौं सः शुक्राय नमः — विशेषतः शुक्रवार को। ज्योतिषी से परामर्श के बाद अनामिका में चाँदी में हीरा या श्वेत नीलम धारण करें। शुक्रवार को श्वेत चावल, श्वेत वस्त्र, शर्करा और श्वेत पुष्प दान करें। शुक्रवार को दुग्ध और फल का उपवास। देवी लक्ष्मी को श्वेत पुष्प अर्पित करें। श्री सूक्तम् या लक्ष्मी अष्टोत्तर का पाठ करें।',
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The scales of Tula connect to the ancient concept of Rta (cosmic order) in Vedic tradition. The Rigveda describes Rta as the fundamental principle that governs the balance of the universe — day and night, seasons, the movement of celestial bodies. Libra\'s scales are the visible symbol of this invisible order. In Hindu mythology, Yama (the god of death and justice) weighs the karma of the deceased on a cosmic scale — good deeds against bad deeds, determining the soul\'s next destination. This makes Libra not merely the sign of social pleasantries, but the sign of cosmic accounting. The Dharma Shastra tradition links justice (nyaya) to the concept of samata (equality) — judging all beings by the same standard, which is the essence of the Tula archetype.',
    hi: 'तुला का तराजू वैदिक परम्परा में ऋत (ब्रह्माण्डीय व्यवस्था) की प्राचीन अवधारणा से जुड़ता है। ऋग्वेद ऋत को उस मौलिक सिद्धान्त के रूप में वर्णित करता है जो ब्रह्माण्ड के सन्तुलन को नियन्त्रित करता है — दिन-रात, ऋतुएँ, खगोलीय पिण्डों की गति। तुला का तराजू इस अदृश्य व्यवस्था का दृश्य प्रतीक है। हिन्दू पौराणिक कथाओं में यम (मृत्यु और न्याय के देव) मृतक के कर्म को ब्रह्माण्डीय तराजू पर तोलते हैं। धर्मशास्त्र परम्परा न्याय को समता से जोड़ती है — सभी प्राणियों को एक ही मानदण्ड से आँकना।',
  },
  vedic: {
    en: 'Shukra (Venus) occupies a unique position in Vedic mythology as the guru of the Asuras — the opponents of the Devas. This is not a moral judgment but a cosmological one: just as day needs night, the cosmic order requires both forces. Shukra possesses the Sanjeevani Vidya — the knowledge to resurrect the dead — making Venus the only graha associated with regeneration and immortality. In the Mahabharata, Shukra is described as having lost one eye while fighting with Vishnu, earning the name Shukracharya (the one-eyed teacher). This mythological detail explains Venus\'s association with perception of beauty through a single lens — selective, aesthetic, and refined rather than comprehensive. The Brihat Samhita associates Venus with art, marriage, precious stones, music, and diplomacy — all Libran domains.',
    hi: 'शुक्र वैदिक पौराणिक कथाओं में असुरों के गुरु के रूप में एक अनूठे स्थान पर हैं। शुक्र संजीवनी विद्या के स्वामी हैं — मृतकों को पुनर्जीवित करने का ज्ञान — जो शुक्र को पुनरुत्थान और अमरत्व से जुड़ा एकमात्र ग्रह बनाता है। महाभारत में शुक्र को विष्णु से लड़ते हुए एक नेत्र खोने का वर्णन है, जिससे शुक्राचार्य नाम मिला। बृहत् संहिता शुक्र को कला, विवाह, रत्न, संगीत और कूटनीति से जोड़ती है।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/shukra', label: { en: 'Shukra — Venus (Tula\'s Ruler)', hi: 'शुक्र — तुला का स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/vrishchika', label: { en: 'Vrishchika (Scorpio) — Next Rashi', hi: 'वृश्चिक — अगली राशि' } },
  { href: '/learn/kanya', label: { en: 'Kanya (Virgo) — Previous Rashi', hi: 'कन्या — पिछली राशि' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn (Exalted in Tula)', hi: 'शनि — तुला में उच्च' } },
  { href: '/learn/surya', label: { en: 'Surya — Sun (Debilitated in Tula)', hi: 'सूर्य — तुला में नीच' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function TulaPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/15 border border-cyan-500/30 mb-4">
          <span className="text-4xl">♎</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Tula — Libra', hi: 'तुला राशि' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The seventh sign of the zodiac — the cosmic scales, ruled by Venus, embodying balance, beauty, and the art of partnership.', hi: 'राशिचक्र की सातवीं राशि — ब्रह्माण्डीय तराजू, शुक्र द्वारा शासित, सन्तुलन, सौन्दर्य और साझेदारी की कला का मूर्त रूप।' })}
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
        <p style={bf}>{ml({ en: 'Tula (Libra) is the seventh sign of the zodiac, spanning 180° to 210° of the ecliptic — the exact midpoint of the zodiacal circle. It is a cardinal air sign ruled by Venus (Shukra), the planet of beauty, love, and harmony. Libra occupies the descendant point of the natural chart (7th house), making it fundamentally about the "other" — partnerships, marriage, open enemies, and the balance between self and society. The scales symbol represents not just social justice but cosmic equilibrium: the point where the ecliptic crosses from northern to southern declination at the autumn equinox.', hi: 'तुला राशिचक्र की सातवीं राशि है, क्रान्तिवृत्त के 180° से 210° तक — राशिचक्र का ठीक मध्य बिन्दु। यह शुक्र द्वारा शासित चर वायु राशि है। तुला प्राकृतिक कुण्डली के अस्त बिन्दु (7वें भाव) पर स्थित है, जो इसे मूलतः "दूसरे" के बारे में बनाता है — साझेदारी, विवाह और आत्म व समाज के बीच सन्तुलन। तराजू प्रतीक केवल सामाजिक न्याय नहीं बल्कि ब्रह्माण्डीय सन्तुलन का प्रतिनिधित्व करता है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-cyan-500/5 rounded-lg border border-cyan-500/15 p-3">
              <span className="text-cyan-400 text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
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
        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-cyan-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक स्वरूप' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 3. Nakshatras in Tula ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Tula', hi: 'तुला में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Three nakshatras occupy Libra, each adding a distinctive layer to Venus\'s harmonious domain. Chitra brings creative architecture, Swati adds independent entrepreneurship, and Vishakha introduces determined purposefulness. The nakshatra placement determines whether Libra\'s energy manifests as aesthetic creation, social networking, or focused ambition.', hi: 'तीन नक्षत्र तुला में स्थित हैं, प्रत्येक शुक्र के सामंजस्यपूर्ण क्षेत्र में एक विशिष्ट परत जोड़ता है। चित्रा सृजनात्मक वास्तुकला लाता है, स्वाति स्वतन्त्र उद्यमशीलता जोड़ता है, और विशाखा दृढ़ उद्देश्यपूर्णता का परिचय देता है।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-cyan-500/15 rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">{ml(n.ruler)}</span>
              <span className="text-xs text-text-secondary italic">{ml(n.deity)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.desc)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Tula', hi: 'तुला में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml(PLANETARY_DIGNITIES_HERE.note)}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.exalted.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Exalted</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.exalted.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">Moolatrikona</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.moolatrikona.desc)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.planet)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">Debilitated</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PLANETARY_DIGNITIES_HERE.debilitated.desc)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha and Ch. 4 — Moolatrikona" />
      </LessonSection>

      {/* ── 5. Each Planet in Tula ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Tula', hi: 'तुला में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Every planet in Libra is filtered through Venus\'s aesthetic and relational lens. Saturn finds exaltation through impartial justice. The Sun struggles with ego dissolution. Friends of Venus (Mercury, Saturn) express elegantly. Mars brings competitive energy to partnerships. Jupiter seeks wisdom through equity. The shadow planets amplify or dissolve Libra\'s relationship-oriented nature.', hi: 'तुला में प्रत्येक ग्रह शुक्र के सौन्दर्यात्मक और सम्बन्धात्मक लेंस से छनता है। शनि निष्पक्ष न्याय द्वारा उच्चता पाता है। सूर्य अहंकार विलयन से संघर्ष करता है। शुक्र के मित्र (बुध, शनि) सुरुचिपूर्वक अभिव्यक्त होते हैं। छाया ग्रह तुला की सम्बन्ध-उन्मुख प्रकृति को बढ़ाते या विलीन करते हैं।' })}</p>
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
        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-4 mt-4">
          <h4 className="text-cyan-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Libra natives who work in isolation or in harsh, competitive environments without aesthetic value often become deeply unhappy. Their productivity and creativity flourish when the workspace is beautiful, the team is harmonious, and their work contributes to fairness or beauty in the world.', hi: 'तुला जातक जो एकान्त में या सौन्दर्य मूल्य के बिना कठोर, प्रतिस्पर्धी वातावरण में काम करते हैं, प्रायः गहरे रूप से दुखी होते हैं। उनकी उत्पादकता और सृजनात्मकता तब फलती-फूलती है जब कार्यस्थल सुन्दर हो और उनका कार्य निष्पक्षता या सौन्दर्य में योगदान करे।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'As the sign of partnership itself, Libra takes relationships more seriously than any other sign. Compatibility depends on finding someone who shares their values of fairness, beauty, and intellectual engagement while providing the decisiveness that Libra often lacks. Air and fire signs energize Libra; earth and water signs ground them.', hi: 'साझेदारी की राशि होने के कारण तुला किसी भी अन्य राशि से अधिक गम्भीरता से सम्बन्ध लेती है। अनुकूलता ऐसे व्यक्ति को खोजने पर निर्भर करती है जो निष्पक्षता, सौन्दर्य और बौद्धिक संलग्नता के उनके मूल्य साझा करे जबकि वह निर्णायकता प्रदान करे जो तुला में प्रायः नहीं होती।' })}</p>
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
          {ml({ en: 'For Libra natives, the most powerful remedy is cultivating decisiveness. Practice making choices without needing everyone\'s approval. The scales must swing before they balance — commit to a direction, then adjust. Harmony that requires self-erasure is not harmony but avoidance.', hi: 'तुला जातकों के लिए सबसे शक्तिशाली उपाय निर्णायकता विकसित करना है। सबकी स्वीकृति के बिना विकल्प चुनने का अभ्यास करें। तराजू सन्तुलित होने से पहले झूलता है — एक दिशा चुनें, फिर समायोजित करें। जो सामंजस्य आत्म-विलोप की माँग करे, वह सामंजस्य नहीं बल्कि बचाव है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Vedic Context', hi: 'पौराणिक कथा एवं वैदिक संदर्भ' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Scales of Cosmic Order', hi: 'ब्रह्माण्डीय व्यवस्था का तराजू' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Venus in Vedic Mythology', hi: 'वैदिक पौराणिक कथाओं में शुक्र' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.vedic)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BS" chapter="Brihat Samhita — Venus and Aesthetic Associations" />
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Tula governs the kidneys, lower back, adrenal glands, bladder, and skin — the organs of filtration, balance, and external appearance. As an air sign ruled by Venus, Libra natives are particularly susceptible to kidney disorders — stones, infections, and chronic kidney disease — as well as lower back pain, lumbar spondylosis, and skin conditions that affect appearance. The adrenal glands, which sit atop the kidneys, are vulnerable to exhaustion from Libra\'s constant effort to maintain equilibrium in relationships and environment. When Venus is strong and well-placed, the native enjoys a beautiful complexion, symmetrical features, good skin health, and strong kidneys with excellent fluid balance. They have a natural sense of physical harmony and move with grace. A weak or afflicted Venus manifests as chronic lower back pain, recurring urinary tract infections, skin problems (acne, rashes, eczema on visible areas), kidney stones, and hormonal imbalance affecting skin and reproductive health. Ayurvedically, Tula is a Vata-Kapha combination — the air element gives lightness and social fluidity, while Venus\'s water tendency adds Kapha qualities. This creates a constitution that is outwardly pleasant but internally prone to congestion, sluggish kidneys, and lymphatic stagnation. Dietary recommendations emphasize hydration above all — warm water with lemon, herbal teas, and water-rich fruits. Foods that support kidney health: cranberry, watermelon, celery, parsley. Avoid excessive salt, sugar, and alcohol — all of which stress the kidneys. Exercise should emphasize the lower back — yoga twists, Pilates core work, swimming, and dance suit this sign perfectly. Mentally, Tula natives are prone to relationship-dependent mood disorders, decision paralysis from seeing too many sides, and chronic people-pleasing that leads to burnout. Assertiveness training and learning to tolerate temporary disharmony are essential mental health practices.', hi: 'तुला गुर्दों, पीठ के निचले भाग, अधिवृक्क ग्रन्थियों, मूत्राशय और त्वचा का शासक है — निस्पन्दन, सन्तुलन और बाह्य दिखावट के अंग। शुक्र शासित वायु राशि होने से तुला जातक गुर्दा विकारों — पथरी, संक्रमण और पुराना गुर्दा रोग — तथा पीठ के निचले दर्द, कटि स्पॉन्डिलोसिस और दिखावट को प्रभावित करने वाले त्वचा रोगों के प्रति संवेदनशील। अधिवृक्क ग्रन्थियाँ सम्बन्धों में सन्तुलन बनाये रखने के निरन्तर प्रयास से थकान के प्रति भेद्य। बली शुक्र में सुन्दर रंगत, सममित आकृति, अच्छा त्वचा स्वास्थ्य और मजबूत गुर्दे। दुर्बल शुक्र — पुराना पीठ दर्द, बार-बार मूत्र पथ संक्रमण, त्वचा समस्याएँ, गुर्दे की पथरी और हार्मोनल असन्तुलन। आयुर्वेदिक रूप से तुला वात-कफ संयोजन। आहार में सर्वोपरि जलयोजन — गरम नींबू पानी, हर्बल चाय, जलयुक्त फल। गुर्दा स्वास्थ्य सहायक: क्रैनबेरी, तरबूज, अजवाइन। अतिरिक्त नमक, शर्करा और मद्य वर्जित। व्यायाम पीठ के निचले भाग पर ज़ोर — योग मोड़, पिलाटिज़, तैराकी और नृत्य। मानसिक रूप से सम्बन्ध-निर्भर मनोदशा विकार, निर्णय पक्षाघात और लोगों को प्रसन्न करने की पुरानी प्रवृत्ति से बचना — दृढ़ता प्रशिक्षण और अस्थायी असामंजस्य सहन करना सीखना अनिवार्य।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Kidneys, lower back, adrenal glands, bladder, skin, lumbar spine, urinary system', hi: 'गुर्दे, पीठ का निचला भाग, अधिवृक्क ग्रन्थियाँ, मूत्राशय, त्वचा, कटि मेरुदण्ड, मूत्र तन्त्र' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Vata-Kapha combination. Prioritize hydration and kidney-supporting foods. Avoid excess salt, sugar, and alcohol. Lower back exercises and assertiveness practices essential.', hi: 'वात-कफ संयोजन। जलयोजन और गुर्दा-सहायक आहार प्राथमिकता। अतिरिक्त नमक, शर्करा और मद्य वर्जित। पीठ के निचले व्यायाम और दृढ़ता अभ्यास अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Tula in chart interpretation means identifying where Venus\'s balancing, aesthetic, and partnership-oriented energy operates in the native\'s life. Where Libra falls reveals where you seek harmony, beauty, and just relationships — and where indecisiveness or excessive compromise may undermine your own interests.', hi: 'कुण्डली व्याख्या में तुला को समझने का अर्थ है पहचानना कि शुक्र की सन्तुलनकारी, सौन्दर्यात्मक और साझेदारी-उन्मुख ऊर्जा जातक के जीवन में कहाँ कार्य करती है। तुला जहाँ पड़ता है वहाँ सामंजस्य, सौन्दर्य और न्यायपूर्ण सम्बन्ध चाहते हैं — और अनिर्णय या अत्यधिक समझौता कहाँ स्वहित कमज़ोर कर सकता है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Tula is your Lagna', hi: 'यदि तुला आपका लग्न है' }, content: { en: 'Venus becomes your lagna lord, making relationships, aesthetics, and social harmony the defining axis of your identity. Chitra padas 3-4 (Mars nakshatra) creates a dynamic personality with creative ambition and architectural vision — Mars brings drive to Venus\'s aesthetics. Swati lagna (Rahu nakshatra) produces a fiercely independent personality despite Libra\'s partnership orientation — these natives are self-made diplomats who value personal freedom within relationships. Vishakha padas 1-3 (Jupiter nakshatra) adds focused determination and moral purpose to Libra\'s natural balance. Venus as lagna lord in an enemy\'s sign creates tension between the desire for harmony and the environment\'s resistance to it.', hi: 'शुक्र लग्नेश बनता है — सम्बन्ध, सौन्दर्य और सामाजिक सामंजस्य पहचान का परिभाषित अक्ष। चित्रा पद 3-4 (मंगल नक्षत्र) सृजनात्मक महत्वाकांक्षा और वास्तुशिल्प दृष्टि वाला गतिशील व्यक्तित्व। स्वाति लग्न (राहु नक्षत्र) तुला की साझेदारी अभिविन्यास के बावजूद उग्र स्वतन्त्र व्यक्तित्व। विशाखा पद 1-3 (गुरु नक्षत्र) केन्द्रित दृढ़ संकल्प और नैतिक उद्देश्य। शत्रु राशि में शुक्र लग्नेश सामंजस्य इच्छा और वातावरण के प्रतिरोध में तनाव।' } },
            { title: { en: 'If Tula is your Moon sign', hi: 'यदि तुला आपकी चन्द्र राशि है' }, content: { en: 'The mind naturally seeks balance, fairness, and aesthetic harmony in all experiences. Emotions are filtered through the lens of relationship — Libra Moon natives define themselves through their connections with others, for better or worse. Emotional peace depends heavily on relational harmony — conflict in relationships directly disturbs mental equilibrium. Swati Moon creates a wind-like emotional nature — independent, changeable, and difficult to pin down despite the desire for partnership. Vishakha Moon produces intensely focused emotional determination — once emotionally committed, this Moon does not waver.', hi: 'मन स्वाभाविक रूप से सभी अनुभवों में सन्तुलन, निष्पक्षता और सौन्दर्य सामंजस्य खोजता है। भावनाएँ सम्बन्ध के लेंस से छनती हैं — तुला चन्द्र जातक अपने सम्बन्धों से स्वयं को परिभाषित करते हैं। भावनात्मक शान्ति सम्बन्ध सामंजस्य पर निर्भर। स्वाति चन्द्र वायु-जैसी भावनात्मक प्रकृति — स्वतन्त्र, परिवर्तनशील। विशाखा चन्द्र तीव्र केन्द्रित भावनात्मक दृढ़ संकल्प।' } },
            { title: { en: 'Tula in divisional charts', hi: 'विभागीय कुण्डलियों में तुला' }, content: { en: 'In Navamsha (D9), Tula indicates a spouse who is charming, aesthetically refined, socially skilled, and possibly in law, fashion, diplomacy, or the arts. In Dashamsha (D10), it suggests careers in law, diplomacy, fashion design, interior decoration, counseling, mediation, or any field requiring negotiation skills and aesthetic judgment.', hi: 'नवांश (D9) में तुला जीवनसाथी को इंगित करता है जो आकर्षक, सौन्दर्य रूप से परिष्कृत, सामाजिक रूप से कुशल और सम्भवतः कानून, फैशन, कूटनीति या कलाओं में। दशमांश (D10) में कानून, कूटनीति, फैशन डिज़ाइन, आन्तरिक सज्जा, परामर्श, मध्यस्थता या वार्ता कौशल और सौन्दर्य निर्णय वाले क्षेत्र में करियर।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Libra is indecisive. Reality: Libra sees the valid arguments on every side — what appears as indecision is actually comprehensive analysis of fairness implications. Misconception: Libra avoids conflict. Reality: Libra delays conflict until a fair resolution is possible — they prefer strategic timing over impulsive confrontation. Misconception: Libra is superficial about beauty. Reality: for Venus, beauty is not superficial — it is a manifestation of cosmic order (rta). Misconception: Libra is weak. Reality: Saturn is exalted in Libra — this sign\'s strength lies in structural justice, systemic fairness, and the patient dismantling of imbalance.', hi: 'भ्रान्ति: तुला अनिर्णयी है। सत्य: तुला हर पक्ष के वैध तर्क देखता है — जो अनिर्णय दिखता है वह वास्तव में निष्पक्षता प्रभावों का व्यापक विश्लेषण। भ्रान्ति: तुला संघर्ष से बचता है। सत्य: तुला संघर्ष को तब तक विलम्बित करता है जब तक निष्पक्ष समाधान सम्भव न हो। भ्रान्ति: तुला सौन्दर्य में सतही है। सत्य: शुक्र के लिए सौन्दर्य ब्रह्माण्डीय व्यवस्था (ऋत) की अभिव्यक्ति है। भ्रान्ति: तुला कमज़ोर है। सत्य: शनि तुला में उच्च — संरचनात्मक न्याय, व्यवस्थित निष्पक्षता और असन्तुलन का धैर्यपूर्ण विघटन।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Tula in a chart reveals where the native seeks balance, beauty, and partnership in their life. The house where Libra falls is where you naturally negotiate, harmonize, and seek fairness — but also where you must learn that true balance sometimes requires the courage to be temporarily unbalanced in service of justice.', hi: 'कुण्डली में तुला पढ़ना बताता है कि जातक अपने जीवन में कहाँ सन्तुलन, सौन्दर्य और साझेदारी चाहता है। जिस भाव में तुला पड़ता है वहाँ आप स्वाभाविक रूप से वार्ता, सामंजस्य और निष्पक्षता चाहते हैं — किन्तु सीखना है कि सच्चे सन्तुलन के लिए कभी-कभी न्याय की सेवा में अस्थायी रूप से असन्तुलित होने का साहस चाहिए।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Tula as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Tula as House Cusp', hi: 'भाव शिखर के रूप में तुला' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Tula falls on different house cusps, it brings Venus\'s harmonizing, aesthetic, and justice-oriented energy to that life domain. Here is how Libra colours each house:', hi: 'जब तुला विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में शुक्र की सामंजस्यकारी, सौन्दर्यात्मक और न्याय-उन्मुख ऊर्जा लाता है। यहाँ तुला प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Venus-ruled personality — charming, diplomatic, aesthetically refined. Attractive appearance with balanced features. Natural mediator who values harmony above personal gain.', hi: 'शुक्र शासित व्यक्तित्व — आकर्षक, कूटनीतिक, सौन्दर्य रूप से परिष्कृत। सन्तुलित आकृतियों वाला आकर्षक रूप। व्यक्तिगत लाभ से ऊपर सामंजस्य।' } },
            { house: '2nd', effect: { en: 'Wealth through art, beauty, law, or diplomatic professions. Pleasant, persuasive speech. Family values centred on refinement and social grace. Balanced approach to financial management.', hi: 'कला, सौन्दर्य, कानून या कूटनीतिक व्यवसायों से धन। सुखद, प्रेरक वाणी। परिष्कार और सामाजिक शालीनता वाले पारिवारिक मूल्य। वित्तीय प्रबन्धन में सन्तुलित दृष्टिकोण।' } },
            { house: '3rd', effect: { en: 'Diplomatic communication style. Artistic writing and design skills. Harmonious sibling relationships. Short travels for cultural, social, or artistic purposes.', hi: 'कूटनीतिक संवाद शैली। कलात्मक लेखन और डिज़ाइन कौशल। भाई-बहनों से सामंजस्यपूर्ण सम्बन्ध। सांस्कृतिक, सामाजिक या कलात्मक उद्देश्यों से लघु यात्राएँ।' } },
            { house: '4th', effect: { en: 'Beautifully decorated, harmonious home. Mother is refined and socially gracious. Property in aesthetic locations. Emotional security through relational harmony at home.', hi: 'सुन्दर सजा, सामंजस्यपूर्ण गृह। माता परिष्कृत और सामाजिक रूप से शालीन। सौन्दर्य स्थानों पर सम्पत्ति। गृह में सम्बन्ध सामंजस्य से भावनात्मक सुरक्षा।' } },
            { house: '5th', effect: { en: 'Creative expression through beauty, fashion, and design. Romantic nature is idealistic and partnership-focused. Children may be artistically talented and socially adept.', hi: 'सौन्दर्य, फैशन और डिज़ाइन से सृजनात्मक अभिव्यक्ति। रोमांटिक प्रकृति आदर्शवादी और साझेदारी-केन्द्रित। सन्तान कलात्मक प्रतिभा और सामाजिक कुशलता।' } },
            { house: '6th', effect: { en: 'Kidney and lower back health issues. Enemies are charming and deceptive. Service in beauty, fashion, or legal professions. Resolves conflicts through negotiation rather than confrontation.', hi: 'गुर्दा और पीठ के निचले स्वास्थ्य समस्याएँ। शत्रु आकर्षक और छलपूर्ण। सौन्दर्य, फैशन या कानूनी व्यवसायों में सेवा। टकराव के बजाय वार्ता से संघर्ष समाधान।' } },
            { house: '7th', effect: { en: 'Libra in its natural house — marriage and partnerships are central to life fulfilment. Spouse is attractive, diplomatic, and socially refined. Excellent for business partnerships and legal collaborations.', hi: 'तुला अपने स्वाभाविक भाव में — विवाह और साझेदारी जीवन पूर्णता का केन्द्र। जीवनसाथी आकर्षक, कूटनीतिक और सामाजिक रूप से परिष्कृत। व्यापारिक साझेदारी और कानूनी सहयोग के लिए उत्कृष्ट।' } },
            { house: '8th', effect: { en: 'Transformation through relationships and shared resources. Spouse brings wealth and refinement. Interest in the aesthetics of death and transformation — art as healing. Legal inheritance matters.', hi: 'सम्बन्धों और साझा संसाधनों से रूपान्तरण। जीवनसाथी धन और परिष्कार लाता है। मृत्यु और रूपान्तरण के सौन्दर्य में रुचि — उपचार के रूप में कला। कानूनी विरासत मामले।' } },
            { house: '9th', effect: { en: 'Dharma expressed through justice, law, and creating beautiful systems. Father is diplomatic and cultured. Fortune through art, beauty, and international diplomacy. Pilgrimage to aesthetically beautiful sacred sites.', hi: 'न्याय, कानून और सुन्दर प्रणालियों से धर्म। पिता कूटनीतिक और सुसंस्कृत। कला, सौन्दर्य और अन्तरराष्ट्रीय कूटनीति से भाग्य। सौन्दर्यात्मक पवित्र स्थलों की तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Career in law, diplomacy, fashion, art direction, counseling, or public relations. Public reputation for fairness and aesthetic judgment. Professional success through relationship-building and negotiation.', hi: 'कानून, कूटनीति, फैशन, कला निर्देशन, परामर्श या जनसम्पर्क में करियर। निष्पक्षता और सौन्दर्य निर्णय की सार्वजनिक प्रतिष्ठा। सम्बन्ध-निर्माण और वार्ता से व्यावसायिक सफलता।' } },
            { house: '11th', effect: { en: 'Gains through artistic, legal, and diplomatic networks. Friends are cultured and socially influential. Aspirations involve creating fairness and beauty at scale — systemic justice.', hi: 'कलात्मक, कानूनी और कूटनीतिक नेटवर्क से लाभ। मित्र सुसंस्कृत और सामाजिक रूप से प्रभावशाली। बड़े पैमाने पर निष्पक्षता और सौन्दर्य — व्यवस्थित न्याय की आकांक्षाएँ।' } },
            { house: '12th', effect: { en: 'Expenditure on beauty, art, and maintaining social appearances. Foreign residence in culturally refined locations. Spiritual growth through dissolution of ego in partnership. Private aesthetic and creative life.', hi: 'सौन्दर्य, कला और सामाजिक दिखावट बनाये रखने पर व्यय। सांस्कृतिक रूप से परिष्कृत स्थानों पर विदेशी निवास। साझेदारी में अहंकार विसर्जन से आध्यात्मिक विकास। निजी सौन्दर्य और सृजनात्मक जीवन।' } },
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
        ml({ en: 'Tula (Libra) is the cardinal air sign ruled by Venus — the seat of balance, beauty, partnership, and cosmic justice in the zodiac.', hi: 'तुला शुक्र द्वारा शासित चर वायु राशि है — राशिचक्र में सन्तुलन, सौन्दर्य, साझेदारी और ब्रह्माण्डीय न्याय का स्थान।' }),
        ml({ en: 'Saturn is exalted at 20° and Sun is debilitated at 10° in Libra. Venus\'s moolatrikona is 0°-5°. This polarity of impersonal justice over personal ego defines the sign.', hi: 'तुला में शनि 20° पर उच्च और सूर्य 10° पर नीच है। शुक्र का मूलत्रिकोण 0°-5° है। व्यक्तिगत अहंकार पर निर्वैयक्तिक न्याय की यह ध्रुवीयता राशि को परिभाषित करती है।' }),
        ml({ en: 'Nakshatras: Chitra padas 3-4 (Mars), Swati (Rahu), Vishakha padas 1-3 (Jupiter). Each brings creative architecture, independent enterprise, and focused determination.', hi: 'नक्षत्र: चित्रा पाद 3-4 (मंगल), स्वाति (राहु), विशाखा पाद 1-3 (गुरु)। प्रत्येक सृजनात्मक वास्तु, स्वतन्त्र उद्यम और दृढ़ संकल्प लाता है।' }),
        ml({ en: 'Libra natives are natural diplomats and aesthetes. Remedy: worship Lakshmi, chant Shukra Beej Mantra, wear diamond, and cultivate decisive action alongside harmony.', hi: 'तुला जातक स्वाभाविक राजनयिक और सौन्दर्यप्रेमी हैं। उपाय: लक्ष्मी पूजा, शुक्र बीज मन्त्र, हीरा धारण, और सामंजस्य के साथ निर्णायक कार्य विकसित करें।' }),
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
