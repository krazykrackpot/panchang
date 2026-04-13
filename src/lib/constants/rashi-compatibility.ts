import type { LocaleText } from '@/types/panchang';
/**
 * Rashi Compatibility Content — 78 unique pair entries
 *
 * Each pair's content is programmatically generated from three astrological factors:
 * 1. Element compatibility (Fire/Earth/Air/Water)
 * 2. Lord (ruler) friendship (Graha Maitri)
 * 3. House distance (1-12)
 *
 * Scores follow Ashta Kuta scale (0-36).
 */

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

type ML = Record<string, string>;

export interface RashiPairContent {
  rashi1: number;       // lower ID
  rashi2: number;       // higher or equal ID
  score: number;        // 0-36 (Ashta Kuta scale)
  oneLiner: ML;         // tooltip for heatmap (1 sentence)
  summary: ML;          // 2-3 sentences overview
  temperament: ML;      // 2-3 sentences
  communication: ML;    // 2-3 sentences
  romance: ML;          // 2-3 sentences
  career: ML;           // 2-3 sentences
  challenges: ML;       // 2-3 sentences
  remedies: ML;         // 2-3 sentences
}

// ──────────────────────────────────────────────────────────────
// Foundational Data
// ──────────────────────────────────────────────────────────────

const RASHI_NAMES: Record<number, LocaleText> = {
  1:  { en: 'Aries', hi: 'मेष', sa: 'मेषः', mai: 'मेष', mr: 'मेष', ta: 'Aries', te: 'Aries', bn: 'Aries', kn: 'Aries', gu: 'Aries' },
  2:  { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः', mai: 'वृषभ', mr: 'वृषभ', ta: 'Taurus', te: 'Taurus', bn: 'Taurus', kn: 'Taurus', gu: 'Taurus' },
  3:  { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्', mai: 'मिथुन', mr: 'मिथुन', ta: 'Gemini', te: 'Gemini', bn: 'Gemini', kn: 'Gemini', gu: 'Gemini' },
  4:  { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः', mai: 'कर्क', mr: 'कर्क', ta: 'Cancer', te: 'Cancer', bn: 'Cancer', kn: 'Cancer', gu: 'Cancer' },
  5:  { en: 'Leo', hi: 'सिंह', sa: 'सिंहः', mai: 'सिंह', mr: 'सिंह', ta: 'Leo', te: 'Leo', bn: 'Leo', kn: 'Leo', gu: 'Leo' },
  6:  { en: 'Virgo', hi: 'कन्या', sa: 'कन्या', mai: 'कन्या', mr: 'कन्या', ta: 'Virgo', te: 'Virgo', bn: 'Virgo', kn: 'Virgo', gu: 'Virgo' },
  7:  { en: 'Libra', hi: 'तुला', sa: 'तुला', mai: 'तुला', mr: 'तुला', ta: 'Libra', te: 'Libra', bn: 'Libra', kn: 'Libra', gu: 'Libra' },
  8:  { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः', mai: 'वृश्चिक', mr: 'वृश्चिक', ta: 'Scorpio', te: 'Scorpio', bn: 'Scorpio', kn: 'Scorpio', gu: 'Scorpio' },
  9:  { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः', mai: 'धनु', mr: 'धनु', ta: 'Sagittarius', te: 'Sagittarius', bn: 'Sagittarius', kn: 'Sagittarius', gu: 'Sagittarius' },
  10: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः', mai: 'मकर', mr: 'मकर', ta: 'Capricorn', te: 'Capricorn', bn: 'Capricorn', kn: 'Capricorn', gu: 'Capricorn' },
  11: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः', mai: 'कुम्भ', mr: 'कुम्भ', ta: 'Aquarius', te: 'Aquarius', bn: 'Aquarius', kn: 'Aquarius', gu: 'Aquarius' },
  12: { en: 'Pisces', hi: 'मीन', sa: 'मीनः', mai: 'मीन', mr: 'मीन', ta: 'Pisces', te: 'Pisces', bn: 'Pisces', kn: 'Pisces', gu: 'Pisces' },
};

type Element = 'fire' | 'earth' | 'air' | 'water';
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';

const RASHI_ELEMENT: Record<number, Element> = {
  1: 'fire', 2: 'earth', 3: 'air', 4: 'water',
  5: 'fire', 6: 'earth', 7: 'air', 8: 'water',
  9: 'fire', 10: 'earth', 11: 'air', 12: 'water',
};

const RASHI_LORD: Record<number, Planet> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
  5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
  9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

const LORD_NAME_HI: Record<Planet, string> = {
  Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि',
};

const LORD_NAME_SA: Record<Planet, string> = {
  Sun: 'सूर्यः', Moon: 'चन्द्रः', Mars: 'मङ्गलः', Mercury: 'बुधः',
  Jupiter: 'बृहस्पतिः', Venus: 'शुक्रः', Saturn: 'शनिः',
};

// ──────────────────────────────────────────────────────────────
// Graha Maitri (Lord Friendship)
// ──────────────────────────────────────────────────────────────

type Relation = 'friend' | 'enemy' | 'neutral' | 'same';

const FRIENDS: Record<Planet, Planet[]> = {
  Sun:     ['Moon', 'Mars', 'Jupiter'],
  Moon:    ['Sun', 'Mercury'],
  Mars:    ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus:   ['Mercury', 'Saturn'],
  Saturn:  ['Mercury', 'Venus'],
};

const ENEMIES: Record<Planet, Planet[]> = {
  Sun:     ['Venus', 'Saturn'],
  Moon:    [],
  Mars:    ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus:   ['Sun', 'Moon'],
  Saturn:  ['Sun', 'Moon', 'Mars'],
};

function getLordRelation(lord1: Planet, lord2: Planet): Relation {
  if (lord1 === lord2) return 'same';
  const l1FriendsL2 = FRIENDS[lord1].includes(lord2);
  const l1EnemyL2 = ENEMIES[lord1].includes(lord2);
  const l2FriendsL1 = FRIENDS[lord2].includes(lord1);
  const l2EnemyL1 = ENEMIES[lord2].includes(lord1);

  // Combined friendship: average both directions
  // friend+friend=friend, enemy+enemy=enemy, friend+enemy=neutral, friend+neutral=friend, enemy+neutral=neutral
  if (l1FriendsL2 && l2FriendsL1) return 'friend';
  if (l1EnemyL2 && l2EnemyL1) return 'enemy';
  if ((l1FriendsL2 && l2EnemyL1) || (l1EnemyL2 && l2FriendsL1)) return 'neutral';
  if (l1FriendsL2 || l2FriendsL1) return 'friend';
  if (l1EnemyL2 || l2EnemyL1) return 'enemy';
  return 'neutral';
}

// ──────────────────────────────────────────────────────────────
// Element Compatibility Text
// ──────────────────────────────────────────────────────────────

function elementKey(e1: Element, e2: Element): string {
  const order: Element[] = ['fire', 'earth', 'air', 'water'];
  const i1 = order.indexOf(e1), i2 = order.indexOf(e2);
  return i1 <= i2 ? `${e1}-${e2}` : `${e2}-${e1}`;
}

interface ElementText {
  temperament: ML;
  romance: ML;
}

const ELEMENT_COMPAT: Record<string, ElementText> = {
  'fire-fire': {
    temperament: {
      en: 'Both signs radiate passionate, action-oriented energy that fuels mutual enthusiasm. Their shared fire element creates instant understanding but also ego clashes when neither yields. The dynamic is electric but requires conscious humility from both.',
      hi: 'दोनों राशियाँ उत्साही, क्रियाशील ऊर्जा से भरी हैं जो एक-दूसरे के उत्साह को बढ़ाती हैं। साझा अग्नि तत्व तात्कालिक समझ बनाता है लेकिन अहंकार का टकराव भी होता है।',
      sa: 'उभे राशी तीव्रभावनाप्रधाने क्रियाशीले च स्तः, परस्परं उत्साहं वर्धयतः। साझम् अग्नितत्त्वं तात्कालिकं बोधं जनयति, किन्तु अहङ्कारसङ्घर्षोऽपि भवति यदा न कोऽपि नम्रतां स्वीकरोति।',
    },
    romance: {
      en: 'Romantic chemistry ignites fast — sparks fly from the first meeting. Passion runs deep but can burn out if both compete for the spotlight. They need to channel fire into shared adventures rather than power struggles.',
      hi: 'रोमांटिक रसायन तेज़ी से जलता है — पहली मुलाक़ात से ही चिंगारी उड़ती है। जुनून गहरा है लेकिन प्रतिस्पर्धा से बचना ज़रूरी है।',
      sa: 'प्रणयरसायनं शीघ्रं प्रज्वलति — प्रथममिलनादेव विस्फुलिङ्गाः उत्पतन्ति। अनुरागो गहनः, किन्तु उभयोः प्रतिस्पर्धायां दग्धो भवितुं शक्नोति। शक्तिसङ्घर्षं विहाय साहसिकयात्रासु अग्निं नियोजयेयुः।',
    },
  },
  'earth-earth': {
    temperament: {
      en: 'Two earth signs create a bedrock of stability, reliability, and practical wisdom. They build together methodically, valuing security and tangible results. The risk is stagnation — comfort can breed complacency if neither pushes for growth.',
      hi: 'दो पृथ्वी राशियाँ स्थिरता, विश्वसनीयता और व्यावहारिक बुद्धि की नींव बनाती हैं। दोनों सुरक्षा और मूर्त परिणाम को महत्व देती हैं।',
      sa: 'द्वे पृथ्वीराशी स्थैर्यस्य विश्वसनीयतायाः व्यावहारिकप्रज्ञायाश्च आधारशिलां रचयतः। ते क्रमशः निर्मान्ति, सुरक्षां मूर्तफलं च मन्यमाने। भयं स्थैर्यजन्यालस्यस्य — सुखं प्रमादं जनयति यदा न कोऽपि वृद्धिं प्रेरयति।',
    },
    romance: {
      en: 'Romance is steady, sensual, and deeply loyal. They express love through acts of service and material comfort. However, both may struggle to articulate emotions, leading to unspoken resentments that build over time.',
      hi: 'प्रेम स्थिर, संवेदनशील और गहराई से वफ़ादार है। वे सेवा और भौतिक आराम से प्रेम व्यक्त करते हैं।',
      sa: 'प्रणयः स्थिरः इन्द्रियसुखप्रदः गहनभक्तियुक्तश्च भवति। तौ सेवाकर्मभिः भौतिकसुखेन च प्रेम प्रकटयतः। तथापि उभावपि भावनानां अभिव्यक्तौ कष्टं अनुभवतः, येन अनुक्तं वैमनस्यं कालेन वर्धते।',
    },
  },
  'air-air': {
    temperament: {
      en: 'Two air signs create an intellectually vibrant bond full of ideas, conversation, and social engagement. Mental stimulation is their love language. The challenge is grounding — both may float between plans without committing to action.',
      hi: 'दो वायु राशियाँ विचारों, संवाद और सामाजिक जुड़ाव से भरा बौद्धिक रूप से जीवंत बंधन बनाती हैं।',
      sa: 'द्वे वायुराशी विचारैः संवादेन सामाजिकसंलग्नतया च पूर्णं बौद्धिकतेजस्वि बन्धनं रचयतः। मानसिकं प्रेरणं तयोः प्रेमभाषा अस्ति। आव्हानं स्थैर्ये — उभे योजनानां मध्ये विचरतः, कर्मणि न बध्नीतः।',
    },
    romance: {
      en: 'Romance thrives on mental connection — witty banter, shared interests, and intellectual exploration. Emotional depth can be lacking, as both tend to rationalize feelings rather than sitting with them.',
      hi: 'प्रेम मानसिक जुड़ाव पर फलता-फूलता है — बुद्धिमत्तापूर्ण बातचीत और साझा रुचियाँ। भावनात्मक गहराई की कमी हो सकती है।',
      sa: 'प्रणयो मानसिकसम्बन्धे पुष्यति — चतुरपरिहासः, साझारुचयः, बौद्धिकान्वेषणं च। भावनात्मिका गहनता न्यूना भवितुम् अर्हति, यतः उभौ भावनानां युक्तिकरणं कुरुतः, न तु तासु स्थितौ तिष्ठतः।',
    },
  },
  'water-water': {
    temperament: {
      en: 'Two water signs share an ocean-deep emotional bond, intuitive understanding, and psychic sensitivity. They feel each other without words. The danger is codependency — they can drown in shared emotions without an anchor of rationality.',
      hi: 'दो जल राशियाँ गहरे भावनात्मक बंधन, सहज समझ और मानसिक संवेदनशीलता साझा करती हैं। ख़तरा सह-निर्भरता का है।',
      sa: 'द्वे जलराशी सागरगम्भीरं भावबन्धनं, सहजबोधं, मानसिकसंवेदनशीलतां च विभजतः। तौ विना वचनैः परस्परम् अनुभवतः। भयं सहनिर्भरतायाः — तौ युक्तेः आलम्बनं विना साझाभावेषु निमज्जितौ भवेताम्।',
    },
    romance: {
      en: 'Romance is deeply soulful, nurturing, and all-consuming. They create a private emotional world that outsiders rarely penetrate. Mood swings can amplify each other, turning minor upsets into tidal waves of feeling.',
      hi: 'प्रेम गहराई से आत्मीय, पोषणकारी और सर्वव्यापी है। वे एक निजी भावनात्मक दुनिया बनाते हैं।',
      sa: 'प्रणयो गहनात्मीयः पोषणकारी सर्वग्रासी च भवति। तौ एकं गोपनीयं भावजगत् रचयतः यत् बहिर्जनाः विरलं प्रविशन्ति। मनोदशापरिवर्तनानि परस्परं वर्धयन्ति, लघुदुःखानि भावतरङ्गेषु परिणमयन्ति।',
    },
  },
  'fire-earth': {
    temperament: {
      en: 'Fire\'s spontaneous energy meets Earth\'s methodical steadiness — a pairing that can either forge steel or smother flames. Earth provides grounding that fire needs, while fire brings excitement that earth secretly craves.',
      hi: 'अग्नि की स्वतःस्फूर्त ऊर्जा पृथ्वी की व्यवस्थित स्थिरता से मिलती है — यह जोड़ी या तो इस्पात गढ़ती है या लपटों को दबाती है।',
      sa: 'अग्नेः स्वतःस्फूर्तं तेजः पृथिव्याः क्रमबद्धस्थैर्येण मिलति — एषा युगलता लोहं वा निर्माति ज्वालां वा निवारयति। पृथिवी अग्नये आवश्यकं स्थैर्यं ददाति, अग्निश्च पृथिव्यै गूढमभिलषितम् उत्साहम् आनयति।',
    },
    romance: {
      en: 'Fire desires passion and grand gestures, while Earth shows love through quiet reliability and sensual comfort. Misunderstandings arise when fire feels restricted and earth feels destabilized.',
      hi: 'अग्नि जुनून और भव्य इशारे चाहती है, जबकि पृथ्वी शांत विश्वसनीयता से प्रेम दर्शाती है।',
      sa: 'अग्निः तीव्रानुरागं भव्यचेष्टाश्च वाञ्छति, पृथिवी तु शान्तविश्वसनीयतया इन्द्रियसुखेन च प्रेम प्रकटयति। यदा अग्निः निरुद्धम् अनुभवति पृथिवी च अस्थिरताम्, तदा भ्रान्तयो जायन्ते।',
    },
  },
  'fire-air': {
    temperament: {
      en: 'Air fans fire\'s flames into a brilliant blaze — this is one of the most naturally synergistic element pairings. Both are active, outgoing, and future-oriented. The combination sparkles with intellectual and creative energy.',
      hi: 'वायु अग्नि की लपटों को शानदार ज्वाला में बदलती है — यह सबसे स्वाभाविक रूप से तालमेल वाली जोड़ियों में से एक है।',
      sa: 'वायुः अग्नेः ज्वालाः उज्ज्वलप्रभायां वर्धयति — एतत् सर्वाधिकं स्वाभाविकसामञ्जस्ययुक्तं तत्त्वयुगलम्। उभौ क्रियाशीलौ बहिर्मुखौ भविष्योन्मुखौ च। संयोगो बौद्धिकसृजनात्मकतेजसा स्फुरति।',
    },
    romance: {
      en: 'Romance is exciting, spontaneous, and never dull. Fire brings passion while air brings variety and mental stimulation. Both value independence, making this a relationship of equals who inspire each other.',
      hi: 'प्रेम रोमांचक, स्वतःस्फूर्त और कभी नीरस नहीं होता। अग्नि जुनून लाती है जबकि वायु विविधता और मानसिक उत्तेजना लाती है।',
      sa: 'प्रणयो रोमाञ्चकः स्वतःस्फूर्तः न कदापि नीरसो भवति। अग्निः अनुरागम् आनयति वायुस्तु वैविध्यं मानसिकप्रेरणं च। उभौ स्वातन्त्र्यं मन्येते, अतः समानयोः परस्परप्रेरकयोः सम्बन्धो भवति।',
    },
  },
  'fire-water': {
    temperament: {
      en: 'Fire and water create steam — intense, transformative, but volatile. Fire\'s directness can scald water\'s sensitivity, while water\'s emotional depth can extinguish fire\'s enthusiasm. When balanced, they produce powerful creative and healing energy.',
      hi: 'अग्नि और जल भाप बनाते हैं — तीव्र, परिवर्तनकारी, लेकिन अस्थिर। संतुलित होने पर वे शक्तिशाली सृजनात्मक ऊर्जा उत्पन्न करते हैं।',
      sa: 'अग्निजले वाष्पम् उत्पादयतः — तीव्रं परिवर्तनकारि किन्तु चञ्चलम्। अग्नेः ऋजुता जलस्य संवेदनशीलतां दहति, जलस्य भावगम्भीरता च अग्नेः उत्साहं शमयति। सामयस्थे सति ते शक्तिशालिनीं सृजनात्मिकचिकित्सकशक्तिम् उत्पादयतः।',
    },
    romance: {
      en: 'The attraction is magnetic — fire is drawn to water\'s mystery, water to fire\'s warmth. But fire evaporates water\'s feelings with bluntness, and water dampens fire\'s joy with moodiness. Requires extraordinary emotional intelligence from both.',
      hi: 'आकर्षण चुंबकीय है — अग्नि जल के रहस्य की ओर खिंचती है, जल अग्नि की गर्मी की ओर। लेकिन दोनों को असाधारण भावनात्मक बुद्धि की आवश्यकता है।',
      sa: 'आकर्षणं चुम्बकवत् — अग्निः जलस्य रहस्येण आकृष्यते, जलं च अग्नेः उष्णतया। किन्तु अग्निः स्पष्टवादेन जलस्य भावान् शोषयति, जलं च मनोदशापरिवर्तनेन अग्नेः आनन्दं म्लानयति। उभयतः असाधारणभावबुद्धिः अपेक्ष्यते।',
    },
  },
  'earth-air': {
    temperament: {
      en: 'Earth and air operate on fundamentally different wavelengths — earth is slow, tangible, and rooted, while air is quick, abstract, and restless. This pairing challenges both to grow beyond their comfort zones.',
      hi: 'पृथ्वी और वायु मूलभूत रूप से अलग तरंगदैर्ध्य पर काम करती हैं — पृथ्वी धीमी और ठोस है, जबकि वायु तेज़ और अमूर्त है।',
      sa: 'पृथिवी वायुश्च मूलतः भिन्नतरङ्गदैर्घ्ये प्रवर्तेते — पृथिवी मन्दा स्थूला स्थिरमूला च, वायुस्तु शीघ्रः सूक्ष्मः चञ्चलश्च। एतद् युगलं उभौ स्वसुखक्षेत्रात् परं वर्धितुं प्रेरयति।',
    },
    romance: {
      en: 'Romance requires patience and translation between love languages. Earth shows love through stability and touch; air through words and ideas. They can build something lasting if earth appreciates air\'s intellect and air values earth\'s dependability.',
      hi: 'प्रेम के लिए धैर्य और प्रेम भाषाओं के बीच अनुवाद की आवश्यकता है। पृथ्वी स्थिरता से प्रेम दिखाती है; वायु शब्दों और विचारों से।',
      sa: 'प्रणयाय धैर्यं प्रेमभाषयोर्मध्ये अनुवादश्च अपेक्ष्यते। पृथिवी स्थैर्येण स्पर्शेन च प्रेम दर्शयति; वायुः शब्दैः विचारैश्च। यदि पृथिवी वायोः प्रज्ञां मन्येत वायुश्च पृथिव्याः विश्वसनीयतां, तर्हि चिरस्थायि किमपि निर्मातुं शक्नुयाताम्।',
    },
  },
  'earth-water': {
    temperament: {
      en: 'Earth and water form one of nature\'s most harmonious pairings — water nourishes earth, earth gives water form and direction. Together they create fertile ground for growth, comfort, and emotional security.',
      hi: 'पृथ्वी और जल प्रकृति की सबसे सामंजस्यपूर्ण जोड़ियों में से एक बनाते हैं — जल पृथ्वी को पोषित करता है, पृथ्वी जल को दिशा देती है।',
      sa: 'पृथिवी जलं च प्रकृतेः सर्वाधिकसामञ्जस्ययुक्तं युगलम् — जलं पृथिवीं पोषयति, पृथिवी जलाय रूपं दिशां च ददाति। मिलित्वा ते वृद्ध्यै सुखाय भावसुरक्षायै च उर्वरां भूमिं रचयतः।',
    },
    romance: {
      en: 'Romance is deeply nurturing, loyal, and emotionally rich. Earth provides the safety water needs to open up, while water helps earth access buried emotions. This combination builds the kind of love that weathers all storms.',
      hi: 'प्रेम गहराई से पोषणकारी, वफ़ादार और भावनात्मक रूप से समृद्ध है। पृथ्वी वह सुरक्षा देती है जो जल को खुलने के लिए चाहिए।',
      sa: 'प्रणयो गहनपोषणकारी भक्तियुक्तो भावसमृद्धश्च भवति। पृथिवी जलाय उद्घाटनार्थम् आवश्यकं सुरक्षां ददाति, जलं च पृथिव्यै गुप्तभावानां प्रवेशं साधयति। एषः संयोगः तादृशं प्रेम निर्माति यत् सर्वान् प्रकोपान् सहते।',
    },
  },
  'air-water': {
    temperament: {
      en: 'Air and water speak different emotional languages — air intellectualizes while water feels deeply. Air can seem cold and detached to water, while water appears overwhelmingly emotional to air. Understanding requires conscious effort from both.',
      hi: 'वायु और जल अलग-अलग भावनात्मक भाषाएँ बोलते हैं — वायु बौद्धिक होती है जबकि जल गहराई से महसूस करता है।',
      sa: 'वायुजले भिन्नभावभाषे वदतः — वायुः बुद्ध्या विश्लेषयति यदा जलं गहनम् अनुभवति। वायुः जलाय शीतलो विरक्तश्च प्रतिभाति, जलं तु वायवे अत्यधिकभावनाशीलम्। अवबोधो उभयतः सचेतनप्रयत्नम् अपेक्षते।',
    },
    romance: {
      en: 'The attraction stems from fascination with the unfamiliar. Air is intrigued by water\'s emotional depth, water by air\'s intellectual sparkle. Long-term success depends on air learning to feel and water learning to articulate.',
      hi: 'आकर्षण अपरिचित के प्रति आकर्षण से उपजता है। वायु जल की भावनात्मक गहराई से आकर्षित होती है, जल वायु की बौद्धिक चमक से।',
      sa: 'आकर्षणम् अपरिचितस्य कौतुकात् जायते। वायुः जलस्य भावगम्भीर्येण मुग्धो भवति, जलं च वायोः बौद्धिकतेजसा। दीर्घकालिकसाफल्यं वायोः भावानुभवशिक्षायां जलस्य च अभिव्यक्तिशिक्षायाम् आश्रितम्।',
    },
  },
};

// ──────────────────────────────────────────────────────────────
// Lord Relationship Text
// ──────────────────────────────────────────────────────────────

interface LordRelText {
  communication: ML;
  career: ML;
}

const LORD_REL_TEXT: Record<Relation, LordRelText> = {
  same: {
    communication: {
      en: 'Sharing the same planetary ruler gives both signs an innate understanding of each other\'s communication style. Conversations flow naturally, with shared vocabulary and instinctive awareness of unspoken cues. Disagreements are rare, though echo-chamber thinking is a risk.',
      hi: 'एक ही ग्रह स्वामी होने से दोनों राशियों को एक-दूसरे की संवाद शैली की सहज समझ मिलती है। बातचीत स्वाभाविक रूप से बहती है।',
      sa: 'एकस्य एव ग्रहस्वामिनः साझाकरणेन उभयोः राश्योः परस्परसंवादशैल्याः सहजबोधो भवति। संभाषणं स्वाभाविकं प्रवहति, साझाशब्दसम्पत्त्या अनुक्तसङ्केतानां सहजावबोधेन च। विवादो विरलः, यद्यपि प्रतिध्वनिकक्षचिन्तनस्य भयम् अस्ति।',
    },
    career: {
      en: 'Professional collaboration benefits from shared planetary energy — both approach work with similar values, timing, and strategy. They can build an empire together, though they may share the same blind spots. Complementary skill sets within the shared framework are key.',
      hi: 'व्यावसायिक सहयोग साझा ग्रहीय ऊर्जा से लाभान्वित होता है — दोनों समान मूल्यों और रणनीति के साथ काम करते हैं।',
      sa: 'व्यावसायिकसहयोगः साझाग्रहशक्त्या लाभं प्राप्नोति — उभौ समानमूल्यैः कालनिर्णयेन रणनीत्या च कार्यं प्रति गच्छतः। ते मिलित्वा साम्राज्यं निर्मातुं शक्नुवन्तः, यद्यपि समानान्धबिन्दून् विभजेयुः।',
    },
  },
  friend: {
    communication: {
      en: 'Their ruling planets share a natural friendship, creating an easy communicative rapport. Ideas are received warmly, and both feel heard without having to over-explain. This planetary amity smooths over rough edges in conversation.',
      hi: 'उनके स्वामी ग्रहों की प्राकृतिक मित्रता आसान संवाद तालमेल बनाती है। विचारों को गर्मजोशी से स्वीकार किया जाता है।',
      sa: 'तयोः अधिपतिग्रहौ स्वाभाविकमैत्रीं विभजतः, येन सुगमसंवादसौहार्दं जायते। विचाराः सादरं गृह्यन्ते, उभौ च अतिस्पष्टीकरणं विना श्रुतौ अनुभवतः। एषा ग्रहमैत्री संभाषणस्य कठोरधाराः शमयति।',
    },
    career: {
      en: 'Friendly planetary rulers create a supportive professional dynamic. They naturally complement each other\'s strengths and willingly cover each other\'s weaknesses. Joint ventures and partnerships are favored with this combination.',
      hi: 'मित्र ग्रह स्वामी एक सहायक व्यावसायिक गतिशीलता बनाते हैं। वे स्वाभाविक रूप से एक-दूसरे की ताकत को पूरा करते हैं।',
      sa: 'मित्रग्रहस्वामिनौ सहायकव्यावसायिकगतिशीलतां रचयतः। तौ स्वाभाविकतया परस्परबलानि पूरयतः, दौर्बल्यानि च स्वेच्छया आवृणुतः। संयुक्तव्यापाराः भागीदारित्वानि च अनेन संयोगेन अनुकूलानि भवन्ति।',
    },
  },
  neutral: {
    communication: {
      en: 'Their planetary rulers maintain a neutral relationship — neither naturally supportive nor conflicting. Communication works but requires conscious effort. Neither instinctively understands the other\'s wavelength, demanding patience and active listening.',
      hi: 'उनके ग्रह स्वामी तटस्थ संबंध रखते हैं — न स्वाभाविक रूप से सहायक, न विरोधी। संवाद सचेतन प्रयास माँगता है।',
      sa: 'तयोः ग्रहस्वामिनौ तटस्थसम्बन्धं पालयतः — न स्वाभाविकसहायकौ न विरोधिनौ। संवादो भवति किन्तु सचेतनप्रयत्नम् अपेक्षते। न कश्चित् सहजतया अपरस्य तरङ्गदैर्घ्यम् अवगच्छति, धैर्यं सक्रियश्रवणं च अपेक्ष्यते।',
    },
    career: {
      en: 'Professional compatibility is workable but unremarkable. They can collaborate effectively on structured projects with clear role definitions. Success depends more on individual maturity than inherent planetary synergy.',
      hi: 'व्यावसायिक अनुकूलता कारगर है लेकिन असाधारण नहीं। वे स्पष्ट भूमिका परिभाषा वाली परियोजनाओं पर प्रभावी सहयोग कर सकते हैं।',
      sa: 'व्यावसायिकानुकूलता कार्यसाध्या किन्तु असाधारणा न। तौ स्पष्टभूमिकापरिभाषायुक्तासु संरचितयोजनासु प्रभावशालिसहयोगं कर्तुं शक्नुतः। साफल्यं सहजग्रहसामञ्जस्यात् अधिकं वैयक्तिकपरिपक्वतायाम् आश्रितम्।',
    },
  },
  enemy: {
    communication: {
      en: 'Their ruling planets are in natural enmity, creating an undercurrent of friction in communication. Misinterpretation is common — what one intends as helpful advice, the other perceives as criticism. Conscious diplomacy is essential.',
      hi: 'उनके स्वामी ग्रहों में प्राकृतिक शत्रुता है, जो संवाद में घर्षण की अन्तर्धारा बनाती है। गलत व्याख्या आम है।',
      sa: 'तयोः अधिपतिग्रहौ स्वाभाविकवैरे स्तः, येन संवादे घर्षणस्य अन्तर्धारा जायते। मिथ्याव्याख्या सामान्या — यत् एकः सहायकपरामर्शरूपेण इच्छति, तत् अपरः समालोचनारूपेण गृह्णाति। सचेतनकूटनीतिः अत्यावश्यका।',
    },
    career: {
      en: 'Professional partnership faces inherent tension from clashing planetary energies. Competing ambitions and differing work styles create friction. Success is possible but requires clearly defined boundaries and mutual respect for separate domains.',
      hi: 'व्यावसायिक साझेदारी टकराती ग्रहीय ऊर्जाओं से निहित तनाव का सामना करती है। स्पष्ट सीमाओं और आपसी सम्मान की आवश्यकता है।',
      sa: 'व्यावसायिकभागीदारित्वं संघर्षग्रहशक्तिभ्यः सहजतनावं सम्मुखीकरोति। प्रतिस्पर्धिमहत्त्वाकाङ्क्षाः भिन्नकार्यशैल्यश्च घर्षणं जनयन्ति। साफल्यं सम्भवति किन्तु स्पष्टपरिभाषितसीमानां पृथक्क्षेत्रेषु पारस्परिकसम्मानस्य च आवश्यकता अस्ति।',
    },
  },
};

// ──────────────────────────────────────────────────────────────
// House Distance Text
// ──────────────────────────────────────────────────────────────

interface DistanceText {
  challenges: ML;
  remedies: ML;
}

const DISTANCE_TEXT: Record<number, DistanceText> = {
  1: {
    challenges: {
      en: 'Being the same sign intensifies all shared traits — both strengths and weaknesses are doubled. The biggest challenge is lack of perspective; neither can offer what the other is missing. Ego battles arise from seeing your own flaws mirrored back.',
      hi: 'एक ही राशि होने से सभी साझा गुण तीव्र हो जाते हैं — ताकत और कमज़ोरी दोनों दोगुनी होती हैं।',
      sa: 'एकराशित्वेन सर्वे साझागुणाः तीव्रीभवन्ति — बलानि दौर्बल्यानि च द्विगुणानि। महत्तमं आव्हानं दृष्टिकोणाभावः; न कश्चित् अपरस्य न्यूनतां पूरयितुं शक्नोति। स्वदोषान् प्रतिबिम्बितान् दृष्ट्वा अहङ्कारयुद्धानि जायन्ते।',
    },
    remedies: {
      en: 'Cultivate individual interests and separate friend circles to maintain distinct identities. Practice the art of compromise since natural tendencies align too closely. Worship the rashi\'s ruling deity together for harmony.',
      hi: 'अलग-अलग रुचियाँ और मित्र मंडल विकसित करें। समझौते की कला का अभ्यास करें। सामंजस्य के लिए राशि के अधिपति देवता की एक साथ पूजा करें।',
      sa: 'पृथक्परिचयरक्षणार्थं वैयक्तिकरुचीः पृथक्मित्रमण्डलानि च पोषयतु। स्वाभाविकप्रवृत्तयः अत्यधिकसमानत्वात् समझौतकलायां अभ्यासं कुरुतम्। सामञ्जस्यार्थं राशेः अधिपतिदेवतायाः मिलित्वा पूजनं कुरुतम्।',
    },
  },
  2: {
    challenges: {
      en: 'The 2/12 axis creates tension around finances, values, and self-worth. One partner may feel they give more than they receive. Hidden expenses, differing spending habits, and unspoken expectations about material comfort cause friction.',
      hi: '2/12 अक्ष वित्त, मूल्यों और आत्म-मूल्य के आसपास तनाव बनाता है। एक साथी को लग सकता है कि वे जितना मिलता है उससे अधिक देते हैं।',
      sa: 'द्वितीय-द्वादशभावाक्षः वित्ते मूल्येषु आत्ममूल्ये च तनावं जनयति। एकः भागी अनुभवेत् यत् सः यत् प्राप्नोति ततोऽधिकं ददाति। गुप्तव्ययाः भिन्नव्ययशीलानि भौतिकसुखविषये अनुक्ताशाश्च घर्षणं कुर्वन्ति।',
    },
    remedies: {
      en: 'Maintain transparent finances and discuss material expectations early. Chant the Lakshmi mantra together on Fridays for financial harmony. Donate to charity jointly to transform the 12th house loss into spiritual gain.',
      hi: 'पारदर्शी वित्त रखें और भौतिक अपेक्षाओं पर जल्दी चर्चा करें। शुक्रवार को लक्ष्मी मंत्र का जाप करें।',
      sa: 'पारदर्शीवित्तं पालयतम्, भौतिकाशाः शीघ्रं चर्चयतम्। आर्थिकसामञ्जस्यार्थं शुक्रवासरे मिलित्वा लक्ष्मीमन्त्रं जपतम्। द्वादशभावहानिं आध्यात्मिकलाभे परिवर्तयितुं मिलित्वा दानं कुरुतम्।',
    },
  },
  3: {
    challenges: {
      en: 'The 3/11 axis is naturally supportive, but challenges arise from over-familiarity breeding casualness. Communication becomes so easy that important matters aren\'t given due weight. The friendship element may overshadow deeper emotional intimacy.',
      hi: '3/11 अक्ष स्वाभाविक रूप से सहायक है, लेकिन अत्यधिक परिचितता से लापरवाही उत्पन्न होती है।',
      sa: 'तृतीय-एकादशभावाक्षः स्वाभाविकसहायकः, किन्तु अतिपरिचयात् औदासीन्यं जायते। संवादः इत्थं सुलभो भवति यत् महत्त्वपूर्णविषयाः उचितगौरवं न लभन्ते। मैत्रीतत्त्वं गहनभावात्मिकसान्निध्यम् आच्छादयेत्।',
    },
    remedies: {
      en: 'Schedule dedicated time for serious emotional conversations beyond daily banter. Pursue a shared learning activity or short travels together. Offer green items on Wednesdays to strengthen Mercury\'s communicative blessings.',
      hi: 'दैनिक मज़ाक से परे गंभीर भावनात्मक बातचीत के लिए समर्पित समय निर्धारित करें। बुधवार को हरी वस्तुएँ अर्पित करें।',
      sa: 'दैनिकपरिहासात् परं गम्भीरभावसंवादार्थं समर्पितं कालं नियोजयतम्। साझाविद्याभ्यासं लघुयात्रां वा मिलित्वा कुरुतम्। बुधस्य संवादवरदानं दृढयितुं बुधवासरे हरितवस्तूनि अर्पयतम्।',
    },
  },
  4: {
    challenges: {
      en: 'The 4/10 axis creates tension between home life and career ambitions. One partner craves domestic comfort while the other chases public achievement. Balancing nurturing needs with professional growth is the central struggle.',
      hi: '4/10 अक्ष घरेलू जीवन और व्यावसायिक महत्वाकांक्षाओं के बीच तनाव बनाता है।',
      sa: 'चतुर्थ-दशमभावाक्षः गृहजीवनस्य व्यावसायिकमहत्त्वाकाङ्क्षायाश्च मध्ये तनावं जनयति। एकः भागी गार्हस्थ्यसुखं वाञ्छति यदा अपरः लोककीर्तिम् अनुसरति। पोषणावश्यकतानां व्यावसायिकवृद्ध्योः सामयस्थापनं मुख्यं संघर्षम्।',
    },
    remedies: {
      en: 'Create a shared home ritual that both partners value — cooking together, evening prayers, or garden time. Honor the Moon with Monday fasts and white offerings to strengthen emotional bonding. Set career boundaries that protect family time.',
      hi: 'एक साझा घरेलू अनुष्ठान बनाएँ जो दोनों साथी महत्व दें। सोमवार का व्रत रखें और भावनात्मक जुड़ाव मज़बूत करें।',
      sa: 'उभौ भागिनौ यत् मन्येते तादृशं साझागृहविधिं रचयतम् — सहपाकः सायंप्रार्थना उद्यानकालो वा। भावबन्धनं दृढयितुं सोमवासरे उपवासेन श्वेतार्पणेन च चन्द्रं सम्मानयतम्। कुटुम्बकालरक्षार्थं व्यावसायिकसीमाः निर्धारयतम्।',
    },
  },
  5: {
    challenges: {
      en: 'The 5/9 trine is naturally excellent, yet challenges exist: over-optimism leads to unrealistic expectations, and both may assume the relationship will sustain itself without effort. Complacency from perceived ease is the hidden trap.',
      hi: '5/9 त्रिकोण स्वाभाविक रूप से उत्कृष्ट है, फिर भी अति-आशावाद अवास्तविक अपेक्षाओं की ओर ले जाता है।',
      sa: 'पञ्चम-नवमत्रिकोणः स्वाभाविकतया उत्तमः, तथापि आव्हानानि सन्ति — अत्याशावादः अवास्तविकाशासु नयति, उभौ च मन्येयातां यत् सम्बन्धः प्रयत्नं विना स्वयं स्थास्यति। अनुभूतसौकर्यात् जातं आत्मसन्तोषं गुप्तजालम्।',
    },
    remedies: {
      en: 'Don\'t take the natural harmony for granted — invest in growth together through spiritual practice or creative projects. Worship Jupiter on Thursdays with yellow offerings. Engage in philosophical discussions to deepen the dharmic bond.',
      hi: 'प्राकृतिक सामंजस्य को हल्के में न लें — आध्यात्मिक अभ्यास से एक साथ विकास में निवेश करें। गुरुवार को पीले वस्त्र अर्पित करें।',
      sa: 'स्वाभाविकसामञ्जस्यं सामान्यं मा मन्यध्वम् — आध्यात्मिकाभ्यासेन सृजनात्मकयोजनाभिर्वा मिलित्वा वृद्धौ निवेशं कुरुतम्। गुरुवासरे पीतार्पणैः बृहस्पतिं पूजयतम्। धार्मिकबन्धनं गहनयितुं दार्शनिकसंवादे प्रवर्तध्वम्।',
    },
  },
  6: {
    challenges: {
      en: 'The 6/8 axis is one of the most challenging — it brings conflicts around health, debts, secrets, and power dynamics. One partner may feel dominated or undermined. Hidden resentments, unaddressed grievances, and control issues plague this pairing.',
      hi: '6/8 अक्ष सबसे चुनौतीपूर्ण में से एक है — यह स्वास्थ्य, ऋण, रहस्य और सत्ता की गतिशीलता के बारे में संघर्ष लाता है।',
      sa: 'षष्ठ-अष्टमभावाक्षः सर्वाधिकचुनौतीपूर्णेषु एकः — सः स्वास्थ्ये ऋणे रहस्ये सत्ताव्यवस्थायां च संघर्षान् आनयति। एकः भागी शासितः अवमानितो वा अनुभवेत्। गुप्तवैमनस्यानि असम्बोधितपरिवादाः नियन्त्रणसमस्याश्च एतद् युगलं पीडयन्ति।',
    },
    remedies: {
      en: 'Prioritize individual health and self-care to avoid codependent patterns. Perform Rahu-Ketu shanti puja to ease the karmic intensity. Maintain absolute transparency about finances and hidden matters. Seek counseling early rather than late.',
      hi: 'सह-निर्भर पैटर्न से बचने के लिए व्यक्तिगत स्वास्थ्य को प्राथमिकता दें। राहु-केतु शांति पूजा करें। वित्त और छिपे मामलों में पूर्ण पारदर्शिता रखें।',
      sa: 'सहनिर्भरतापद्धतिं परिहर्तुं वैयक्तिकस्वास्थ्यं स्वपरिचर्यां च प्राथमिकतां कुरुतम्। कार्मिकतीव्रतां शमयितुं राहुकेतुशान्तिपूजां कुरुतम्। वित्तविषये गुप्तविषयेषु च पूर्णपारदर्शिता पालयतम्। विलम्बात् पूर्वमेव परामर्शं गृह्णीतम्।',
    },
  },
  7: {
    challenges: {
      en: 'The 1/7 opposition creates powerful attraction but equally powerful tension. Each partner embodies what the other lacks, making the relationship both magnetic and frustrating. The challenge is integrating opposite approaches without losing individual identity.',
      hi: '1/7 विपक्ष शक्तिशाली आकर्षण लेकिन उतना ही शक्तिशाली तनाव बनाता है। प्रत्येक साथी वह मूर्त रूप देता है जो दूसरे में नहीं है।',
      sa: 'प्रथम-सप्तमविपक्षः शक्तिशालम् आकर्षणं किन्तु समानतया शक्तिशालं तनावं जनयति। प्रत्येकं भागी अपरस्य न्यूनतां मूर्तयति, येन सम्बन्धः चुम्बकवत् आकर्षकः कुण्ठाप्रदश्च भवति। वैयक्तिकपरिचयं विना विपरीतदृष्टिकोणानाम् एकीकरणम् आव्हानम्।',
    },
    remedies: {
      en: 'Practice seeing your partner as a mirror — what triggers you reveals your own shadow. Perform Venus puja on Fridays for marital harmony. Develop shared goals that require both skill sets, turning opposition into complementarity.',
      hi: 'अपने साथी को दर्पण के रूप में देखने का अभ्यास करें। शुक्रवार को शुक्र पूजा करें। साझा लक्ष्य विकसित करें जो दोनों कौशल सेट की आवश्यकता हो।',
      sa: 'भागिनं दर्पणरूपेण द्रष्टुम् अभ्यसतम् — यत् त्वां प्रेरयति तत् तव छायां प्रकटयति। वैवाहिकसामञ्जस्यार्थं शुक्रवासरे शुक्रपूजां कुरुतम्। उभयकौशलसम्पत्तिम् अपेक्षमाणान् साझालक्ष्यान् विकसयतम्, विपक्षं पूरकत्वे परिवर्तयन्तः।',
    },
  },
  8: {
    challenges: {
      en: 'The 6/8 axis from the other direction brings transformation through crisis. Deep secrets, inheritance disputes, and psychological power games define the difficult side. One partner may feel perpetually vulnerable or exposed.',
      hi: '6/8 अक्ष दूसरी दिशा से संकट के माध्यम से परिवर्तन लाता है। गहरे रहस्य और मनोवैज्ञानिक शक्ति खेल कठिन पक्ष को परिभाषित करते हैं।',
      sa: 'षष्ठ-अष्टमभावाक्षः विपरीतदिशातः सङ्कटद्वारा परिवर्तनम् आनयति। गहनरहस्यानि दायविवादाः मानसिकसत्ताक्रीडाश्च कठिनपक्षं परिभाषयन्ति। एकः भागी सदा असुरक्षितं प्रकटितं वा अनुभवेत्।',
    },
    remedies: {
      en: 'Embrace transformation as a shared journey rather than resisting change. Practice Mahamrityunjaya mantra for healing and overcoming obstacles. Maintain healthy boundaries around privacy while building trust incrementally.',
      hi: 'परिवर्तन को विरोध करने के बजाय साझा यात्रा के रूप में अपनाएँ। महामृत्युंजय मंत्र का अभ्यास करें। विश्वास धीरे-धीरे बनाएँ।',
      sa: 'परिवर्तनविरोधात् परं तत् साझायात्रारूपेण स्वीकुरुतम्। चिकित्सायै विघ्ननिवारणाय च महामृत्युञ्जयमन्त्रम् अभ्यसतम्। विश्वासं क्रमशः निर्मायमानौ गोपनीयतायाः परितः स्वस्थसीमाः पालयतम्।',
    },
  },
  9: {
    challenges: {
      en: 'The 5/9 trine from the higher octave is supremely fortunate, but the challenge lies in different philosophical or spiritual orientations. One may be more traditional, the other progressive. Intellectual arrogance or guru-complex can disrupt the bond.',
      hi: '5/9 त्रिकोण उच्च स्तर से अत्यंत शुभ है, लेकिन चुनौती विभिन्न दार्शनिक या आध्यात्मिक उन्मुखताओं में है।',
      sa: 'उच्चस्तरात् पञ्चम-नवमत्रिकोणः परमशुभः, किन्तु आव्हानं भिन्नदार्शनिकाध्यात्मिकदिशासु विद्यते। एकः सम्प्रदायवादी स्यात्, अपरः प्रगतिशीलः। बौद्धिकाहङ्कारः गुरुग्रन्थिर्वा बन्धनं विघ्नयेत्।',
    },
    remedies: {
      en: 'Explore each other\'s belief systems with genuine curiosity rather than judgment. Travel to sacred places together. Worship Jupiter with turmeric offerings on Thursdays. Teach each other — the 5/9 axis thrives when both are simultaneously teacher and student.',
      hi: 'एक-दूसरे की विश्वास प्रणालियों को निर्णय के बजाय जिज्ञासा से जानें। पवित्र स्थानों की एक साथ यात्रा करें। गुरुवार को हल्दी अर्पित करें।',
      sa: 'निर्णयात् परं सत्यजिज्ञासया परस्परविश्वासपद्धतीः अन्वेषयतम्। मिलित्वा पुण्यस्थलानि गच्छतम्। गुरुवासरे हरिद्रार्पणैः बृहस्पतिं पूजयतम्। परस्परं शिक्षयतम् — पञ्चम-नवमाक्षः तदा पुष्यति यदा उभौ एककालं गुरुशिष्यौ भवतः।',
    },
  },
  10: {
    challenges: {
      en: 'The 4/10 axis from the career side emphasizes public perception and social duty over private bonding. Both may prioritize status or external achievement over emotional intimacy. The relationship can feel more like a partnership than a romance.',
      hi: '4/10 अक्ष करियर पक्ष से निजी जुड़ाव पर सार्वजनिक धारणा और सामाजिक कर्तव्य पर ज़ोर देता है।',
      sa: 'व्यावसायिकपक्षात् चतुर्थ-दशमभावाक्षः गोपनीयबन्धनात् उपरि लोकधारणां सामाजिककर्तव्यं च बलयति। उभौ प्रतिष्ठां बाह्यसिद्धिं वा भावात्मिकसान्निध्यात् उपरि प्राथमिकतां दद्याताम्। सम्बन्धः प्रणयात् अधिकं भागीदारित्ववत् अनुभूयेत।',
    },
    remedies: {
      en: 'Deliberately carve out private, unscheduled time away from social obligations. Honor Saturn through Saturday charity and disciplined joint routines. Build respect for each other\'s ambitions while nurturing the emotional foundation.',
      hi: 'सामाजिक दायित्वों से दूर जानबूझकर निजी, अनिर्धारित समय निकालें। शनिवार को दान दें और अनुशासित संयुक्त दिनचर्या बनाएँ।',
      sa: 'सामाजिकदायित्वेभ्यः दूरे सायत्नं गोपनीयम् अनियोजितकालं निश्चिनुतम्। शनिवासरे दानेन अनुशासितसंयुक्तदिनचर्यया च शनिं सम्मानयतम्। भावनात्मिकाधारं पोषयन्तौ परस्परमहत्त्वाकाङ्क्षासु सम्मानं निर्मातम्।',
    },
  },
  11: {
    challenges: {
      en: 'The 3/11 axis from the gains side is supportive — the main challenge is keeping the relationship from becoming purely transactional or social. Friendship is strong but deeper emotional or spiritual bonding may be neglected.',
      hi: '3/11 अक्ष लाभ पक्ष से सहायक है — मुख्य चुनौती संबंध को पूर्णतः लेन-देन या सामाजिक बनने से रोकना है।',
      sa: 'लाभपक्षात् तृतीय-एकादशभावाक्षः सहायकः — मुख्यम् आव्हानं सम्बन्धं केवलं व्यावहारिकं सामाजिकं वा भवितुं निवारयितुम्। मैत्री दृढा किन्तु गहनभावात्मिकाध्यात्मिकबन्धनम् उपेक्षितं स्यात्।',
    },
    remedies: {
      en: 'Move beyond social friendship into vulnerable emotional sharing. Pursue a shared humanitarian cause to elevate the 11th house energy. Donate together on Saturdays. Celebrate each other\'s achievements genuinely rather than competitively.',
      hi: 'सामाजिक मित्रता से आगे बढ़कर संवेदनशील भावनात्मक साझाकरण में जाएँ। साझा मानवीय उद्देश्य अपनाएँ। शनिवार को एक साथ दान करें।',
      sa: 'सामाजिकमैत्र्याः परं सुभग्नभावसाझाकरणे प्रविशतम्। एकादशभावशक्तिम् उन्नेतुं साझामानवीयध्येयम् अनुसरतम्। शनिवासरे मिलित्वा दानं कुरुतम्। प्रतिस्पर्धया विना सत्यतया परस्परसिद्धीः उत्सवयतम्।',
    },
  },
  12: {
    challenges: {
      en: 'The 2/12 axis from the loss side is spiritually potent but materially draining. One partner may feel they constantly sacrifice for the other. Hidden fears, unacknowledged expenses, and escapist tendencies (substance, fantasy) are risks.',
      hi: '2/12 अक्ष हानि पक्ष से आध्यात्मिक रूप से शक्तिशाली लेकिन भौतिक रूप से क्षयकारी है।',
      sa: 'हानिपक्षात् द्वितीय-द्वादशभावाक्षः आध्यात्मिकतया शक्तिशालः किन्तु भौतिकतया क्षयकारी। एकः भागी अनुभवेत् यत् सः सततम् अपरार्थं त्यजति। गुप्तभयानि अस्वीकृतव्ययाः पलायनवृत्तयश्च भयम् उत्पादयन्ति।',
    },
    remedies: {
      en: 'Channel the 12th house energy into shared spiritual practice — meditation, temple visits, or charitable service. Chant Vishnu Sahasranama together for divine protection. Be vigilant about balanced giving and receiving in the relationship.',
      hi: 'बारहवें भाव की ऊर्जा को साझा आध्यात्मिक अभ्यास में प्रवाहित करें — ध्यान, मंदिर दर्शन, या दान सेवा। विष्णु सहस्रनाम का जाप करें।',
      sa: 'द्वादशभावशक्तिं साझाध्यात्मिकाभ्यासे नियोजयतम् — ध्यानं देवालययात्रा दानसेवा वा। दिव्यरक्षणार्थं मिलित्वा विष्णुसहस्रनाम जपतम्। सम्बन्धे समदानप्रतिग्रहणविषये सजागौ भवतम्।',
    },
  },
};

// ──────────────────────────────────────────────────────────────
// Score Calculation
// ──────────────────────────────────────────────────────────────

function getHouseDistance(r1: number, r2: number): number {
  if (r1 === r2) return 1;
  // Forward distance from r1 to r2 (1-indexed: adjacent signs = 2)
  const fwd = ((r2 - r1 + 12) % 12) + 1;
  // Backward distance
  const bwd = ((r1 - r2 + 12) % 12) + 1;
  // Use the canonical (shorter) distance for symmetric pairs
  return Math.min(fwd, bwd);
}

// Distance quality: positive distances get bonus, negative get penalty
const DISTANCE_SCORE_MOD: Record<number, number> = {
  1: 2,    // same sign — moderate
  2: -2,   // 2/12 — resource tension
  3: 3,    // 3/11 — good friendship
  4: 1,    // 4/10 — comfort/career tension
  5: 5,    // 5/9 trine — excellent
  6: -5,   // 6/8 — challenging
  7: 2,    // 1/7 opposition — attraction
  // distances 8-12 mirror 6-2 (since we use min distance)
};

const ELEMENT_SCORE: Record<string, number> = {
  'fire-fire': 4,
  'earth-earth': 4,
  'air-air': 4,
  'water-water': 4,
  'fire-air': 5,
  'earth-water': 5,
  'fire-earth': -1,
  'fire-water': -2,
  'earth-air': -2,
  'air-water': -1,
};

const LORD_SCORE: Record<Relation, number> = {
  same: 5,
  friend: 4,
  neutral: 1,
  enemy: -3,
};

function computeScore(r1: number, r2: number): number {
  const elem1 = RASHI_ELEMENT[r1];
  const elem2 = RASHI_ELEMENT[r2];
  const eKey = elementKey(elem1, elem2);
  const lord1 = RASHI_LORD[r1];
  const lord2 = RASHI_LORD[r2];
  const relation = getLordRelation(lord1, lord2);
  const dist = getHouseDistance(r1, r2);

  // Base score of 18 (midpoint), add modifiers
  let score = 18;
  score += ELEMENT_SCORE[eKey] || 0;
  score += LORD_SCORE[relation];
  score += DISTANCE_SCORE_MOD[dist] || 0;

  // Bonus for same-element trine (dist 5 or 9 maps to 5)
  if (elem1 === elem2 && dist === 5) {
    score += 4; // extra trine bonus
  }

  // Penalty for enemy lords + 6/8 distance
  if (relation === 'enemy' && dist === 6) {
    score -= 3;
  }

  return Math.max(0, Math.min(36, score));
}

// ──────────────────────────────────────────────────────────────
// Content Generation
// ──────────────────────────────────────────────────────────────

function generateOneLiner(r1: number, r2: number, score: number): ML {
  const n1 = RASHI_NAMES[r1];
  const n2 = RASHI_NAMES[r2];
  const elem1 = RASHI_ELEMENT[r1];
  const elem2 = RASHI_ELEMENT[r2];
  const dist = getHouseDistance(r1, r2);

  let qualityEn: string;
  let qualityHi: string;
  let qualitySa: string;
  if (score >= 28) {
    qualityEn = 'highly harmonious';
    qualityHi = 'अत्यधिक सामंजस्यपूर्ण';
    qualitySa = 'अत्यन्तसामञ्जस्ययुक्तम्';
  } else if (score >= 22) {
    qualityEn = 'naturally compatible';
    qualityHi = 'स्वाभाविक रूप से अनुकूल';
    qualitySa = 'स्वाभाविकानुकूलम्';
  } else if (score >= 16) {
    qualityEn = 'workable with effort';
    qualityHi = 'प्रयास से कारगर';
    qualitySa = 'प्रयत्नेन साध्यम्';
  } else {
    qualityEn = 'challenging but transformative';
    qualityHi = 'चुनौतीपूर्ण लेकिन परिवर्तनकारी';
    qualitySa = 'आव्हानपूर्णं किन्तु परिवर्तनकारि';
  }

  if (r1 === r2) {
    return {
      en: `Two ${n1.en} natives share identical strengths and shadows — a ${qualityEn} pairing that mirrors the self.`,
      hi: `दो ${n1.hi} जातक समान शक्तियाँ और छायाएँ साझा करते हैं — एक ${qualityHi} जोड़ी।`,
      sa: `द्वौ ${n1.sa} जातकौ समानबलानि छायाश्च विभजतः — आत्मप्रतिबिम्बकं ${qualitySa} युगलम्।`,
    };
  }

  const elemDescEn = elem1 === elem2
    ? `fellow ${elem1} signs`
    : `${elem1} meets ${elem2}`;
  const elemDescHi = elem1 === elem2
    ? `सम-तत्व राशियाँ`
    : `${ELEMENT_HI[elem1]} और ${ELEMENT_HI[elem2]} का मिलन`;
  const elemDescSa = elem1 === elem2
    ? `समतत्त्वराशी`
    : `${ELEMENT_SA[elem1]}${ELEMENT_SA[elem2]}तत्त्वयोः संयोगः`;

  const distDescSa = dist === 7 ? 'विपक्षाक्षे' : dist === 5 ? 'त्रिकोणसामञ्जस्ये' : `${dist}-भावान्तरे`;

  return {
    en: `${n1.en} and ${n2.en} — ${elemDescEn}, ${dist === 7 ? 'opposite axis' : dist === 5 ? 'trine harmony' : `${dist} houses apart`} — a ${qualityEn} bond scoring ${score}/36.`,
    hi: `${n1.hi} और ${n2.hi} — ${elemDescHi} — ${qualityHi} बंधन, अंक ${score}/36।`,
    sa: `${n1.sa} ${n2.sa} च — ${elemDescSa}, ${distDescSa} — ${qualitySa} बन्धनम्, अङ्काः ${score}/36।`,
  };
}

const ELEMENT_HI: Record<Element, string> = {
  fire: 'अग्नि', earth: 'पृथ्वी', air: 'वायु', water: 'जल',
};

const ELEMENT_SA: Record<Element, string> = {
  fire: 'अग्नि', earth: 'पृथिवी', air: 'वायु', water: 'जल',
};

function generateSummary(r1: number, r2: number, score: number): ML {
  const n1 = RASHI_NAMES[r1];
  const n2 = RASHI_NAMES[r2];
  const elem1 = RASHI_ELEMENT[r1];
  const elem2 = RASHI_ELEMENT[r2];
  const lord1 = RASHI_LORD[r1];
  const lord2 = RASHI_LORD[r2];
  const relation = getLordRelation(lord1, lord2);
  const dist = getHouseDistance(r1, r2);

  const lordRelEn: Record<Relation, string> = {
    same: `Both ruled by ${lord1}, they share a deep planetary resonance`,
    friend: `${lord1} and ${lord2} are natural allies, blessing this pair with planetary goodwill`,
    neutral: `${lord1} and ${lord2} maintain a neutral stance, offering neither strong support nor opposition`,
    enemy: `${lord1} and ${lord2} are in natural enmity, adding an undercurrent of friction`,
  };

  const lordRelHi: Record<Relation, string> = {
    same: `दोनों ${LORD_NAME_HI[lord1]} द्वारा शासित, वे गहरा ग्रहीय अनुनाद साझा करते हैं`,
    friend: `${LORD_NAME_HI[lord1]} और ${LORD_NAME_HI[lord2]} प्राकृतिक मित्र हैं, इस जोड़ी को ग्रहीय सद्भावना प्रदान करते हैं`,
    neutral: `${LORD_NAME_HI[lord1]} और ${LORD_NAME_HI[lord2]} तटस्थ स्थिति में हैं, न मज़बूत समर्थन न विरोध`,
    enemy: `${LORD_NAME_HI[lord1]} और ${LORD_NAME_HI[lord2]} प्राकृतिक शत्रुता में हैं, घर्षण की अन्तर्धारा जोड़ते हैं`,
  };

  const lordRelSa: Record<Relation, string> = {
    same: `उभे ${LORD_NAME_SA[lord1]}शासिते, ते गहनं ग्रहानुनादं विभजतः`,
    friend: `${LORD_NAME_SA[lord1]} ${LORD_NAME_SA[lord2]} च स्वाभाविकमित्रे, एतद् युगलं ग्रहसौहार्देन अनुगृह्णीतः`,
    neutral: `${LORD_NAME_SA[lord1]} ${LORD_NAME_SA[lord2]} च तटस्थस्थितौ स्तः, न बलवत् साहाय्यं न विरोधम् अर्पयतः`,
    enemy: `${LORD_NAME_SA[lord1]} ${LORD_NAME_SA[lord2]} च स्वाभाविकवैरे स्तः, घर्षणस्य अन्तर्धारां योजयतः`,
  };

  const distDescEn = dist === 1 ? 'As the same sign' :
    dist === 5 ? 'In a natural trine (5/9 axis)' :
    dist === 7 ? 'On the opposition axis (1/7)' :
    dist === 6 ? 'In the difficult 6/8 axis' :
    dist === 3 ? 'In the friendly 3/11 axis' :
    `Placed ${dist} houses apart`;

  const distDescHi = dist === 1 ? 'एक ही राशि होने से' :
    dist === 5 ? 'प्राकृतिक त्रिकोण (5/9 अक्ष) में' :
    dist === 7 ? 'विपक्ष अक्ष (1/7) पर' :
    dist === 6 ? 'कठिन 6/8 अक्ष में' :
    dist === 3 ? 'मैत्रीपूर्ण 3/11 अक्ष में' :
    `${dist} भावों की दूरी पर`;

  const distDescSa = dist === 1 ? 'एकराशित्वेन' :
    dist === 5 ? 'स्वाभाविकत्रिकोणे (५/९ अक्षे)' :
    dist === 7 ? 'विपक्षाक्षे (१/७)' :
    dist === 6 ? 'कठिने ६/८ अक्षे' :
    dist === 3 ? 'मैत्रीपूर्णे ३/११ अक्षे' :
    `${dist}-भावान्तरे स्थिते`;

  const name1En = r1 === r2 ? `Two ${n1.en} natives` : `${n1.en} and ${n2.en}`;
  const name1Hi = r1 === r2 ? `दो ${n1.hi} जातक` : `${n1.hi} और ${n2.hi}`;
  const name1Sa = r1 === r2 ? `द्वौ ${n1.sa} जातकौ` : `${n1.sa} ${n2.sa} च`;

  const verdictEn = score >= 28 ? 'This is one of the most auspicious pairings in Vedic astrology.' :
    score >= 22 ? 'This pairing carries strong potential for lasting harmony.' :
    score >= 16 ? 'This combination can work well with conscious effort and mutual understanding.' :
    'This is a karmically intense pairing that demands significant effort from both sides.';

  const verdictHi = score >= 28 ? 'यह वैदिक ज्योतिष में सबसे शुभ जोड़ियों में से एक है।' :
    score >= 22 ? 'इस जोड़ी में स्थायी सामंजस्य की प्रबल संभावना है।' :
    score >= 16 ? 'यह संयोजन सचेतन प्रयास और आपसी समझ से अच्छा काम कर सकता है।' :
    'यह कार्मिक रूप से तीव्र जोड़ी है जो दोनों पक्षों से महत्वपूर्ण प्रयास माँगती है।';

  const verdictSa = score >= 28 ? 'एतत् वैदिकज्योतिषे सर्वाधिकशुभयुगलेषु एकम्।' :
    score >= 22 ? 'एतद् युगलं चिरस्थायिसामञ्जस्यस्य प्रबलसम्भावनां वहति।' :
    score >= 16 ? 'एतत् संयोजनं सचेतनप्रयत्नेन पारस्परिकावबोधेन च सुष्ठु कार्यं कर्तुं शक्नोति।' :
    'एतत् कार्मिकतया तीव्रं युगलं यत् उभयतः महत्त्वपूर्णं प्रयत्नम् अपेक्षते।';

  return {
    en: `${name1En} form a ${elem1}-${elem2} combination with a compatibility score of ${score}/36. ${lordRelEn[relation]}. ${distDescEn}, ${verdictEn}`,
    hi: `${name1Hi} ${ELEMENT_HI[elem1]}-${ELEMENT_HI[elem2]} संयोजन बनाते हैं, अनुकूलता अंक ${score}/36। ${lordRelHi[relation]}। ${distDescHi}, ${verdictHi}`,
    sa: `${name1Sa} ${ELEMENT_SA[elem1]}-${ELEMENT_SA[elem2]} संयोजनं रचयतः, अनुकूलताङ्काः ${score}/36। ${lordRelSa[relation]}। ${distDescSa}, ${verdictSa}`,
  };
}

function generatePairContent(r1: number, r2: number): RashiPairContent {
  const score = computeScore(r1, r2);
  const elem1 = RASHI_ELEMENT[r1];
  const elem2 = RASHI_ELEMENT[r2];
  const eKey = elementKey(elem1, elem2);
  const lord1 = RASHI_LORD[r1];
  const lord2 = RASHI_LORD[r2];
  const relation = getLordRelation(lord1, lord2);
  const dist = getHouseDistance(r1, r2);

  const elemData = ELEMENT_COMPAT[eKey];
  const lordData = LORD_REL_TEXT[relation];
  const distData = DISTANCE_TEXT[dist];

  return {
    rashi1: r1,
    rashi2: r2,
    score,
    oneLiner: generateOneLiner(r1, r2, score),
    summary: generateSummary(r1, r2, score),
    temperament: elemData.temperament,
    communication: lordData.communication,
    romance: elemData.romance,
    career: lordData.career,
    challenges: distData.challenges,
    remedies: distData.remedies,
  };
}

// ──────────────────────────────────────────────────────────────
// Generate All 78 Pairs
// ──────────────────────────────────────────────────────────────

function generateAllPairs(): RashiPairContent[] {
  const pairs: RashiPairContent[] = [];
  for (let r1 = 1; r1 <= 12; r1++) {
    for (let r2 = r1; r2 <= 12; r2++) {
      pairs.push(generatePairContent(r1, r2));
    }
  }
  return pairs;
}

export const RASHI_PAIR_CONTENT: RashiPairContent[] = generateAllPairs();

// ──────────────────────────────────────────────────────────────
// Lookup Helper
// ──────────────────────────────────────────────────────────────

const pairIndex = new Map<string, RashiPairContent>();
for (const p of RASHI_PAIR_CONTENT) {
  pairIndex.set(`${p.rashi1}-${p.rashi2}`, p);
}

/**
 * Get compatibility content for any two rashis (order-independent).
 * Returns undefined for invalid rashi IDs (outside 1-12).
 */
export function getPairContent(r1: number, r2: number): RashiPairContent | undefined {
  if (r1 < 1 || r1 > 12 || r2 < 1 || r2 > 12) return undefined;
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  return pairIndex.get(`${lo}-${hi}`);
}
