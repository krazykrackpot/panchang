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
import SectionNav from '@/components/learn/SectionNav';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'राहु', transliteration: 'Rahu', meaning: { en: 'The seizer — the ascending (north) lunar node', hi: 'ग्रासक — चन्द्र का आरोही (उत्तर) पात' } },
  { devanagari: 'छायाग्रह', transliteration: 'Chhaaya Graha', meaning: { en: 'Shadow planet — no physical body', hi: 'छाया ग्रह — कोई भौतिक शरीर नहीं' } },
  { devanagari: 'स्वर्भानु', transliteration: 'Svarbhanu', meaning: { en: 'The one who eclipses the luminaries', hi: 'जो ज्योतियों को ग्रहण करता है' } },
  { devanagari: 'तमोग्रह', transliteration: 'Tamograha', meaning: { en: 'Planet of darkness and illusion', hi: 'अन्धकार और माया का ग्रह' } },
  { devanagari: 'भयंकर', transliteration: 'Bhayankara', meaning: { en: 'The terrifying one', hi: 'भयंकर — भय उत्पन्न करने वाला' } },
  { devanagari: 'अर्धकाय', transliteration: 'Ardhakaya', meaning: { en: 'The half-bodied one (only the head)', hi: 'अर्धकाय — केवल सिर वाला' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Taurus (Vrishabha) per Parashari tradition; Gemini (Mithuna) per some Jaimini scholars. Deepest exaltation at 20° Taurus.', hi: 'पराशरी परम्परा में वृषभ; कुछ जैमिनी विद्वानों के अनुसार मिथुन। वृषभ 20° पर परम उच्च।' },
  debilitation: { en: 'Scorpio (Vrishchika) per Parashari tradition; Sagittarius (Dhanu) per some. Deepest debilitation at 20° Scorpio.', hi: 'पराशरी परम्परा में वृश्चिक; कुछ के अनुसार धनु। वृश्चिक 20° पर परम नीच।' },
  ownSign: { en: 'No classical own sign — but functions like Saturn. Co-rules Aquarius (Kumbha) per some modern traditions.', hi: 'शास्त्रीय रूप से कोई स्वराशि नहीं — किन्तु शनि की भाँति कार्य करता है। कुछ आधुनिक परम्पराओं में कुम्भ का सह-स्वामी।' },
  moolatrikona: { en: 'Virgo (Kanya) per some authorities — debated among classical texts', hi: 'कुछ आचार्यों के अनुसार कन्या — शास्त्रीय ग्रन्थों में विवादित' },
  friends: { en: 'Venus, Saturn, Mercury', hi: 'शुक्र, शनि, बुध' },
  enemies: { en: 'Sun, Moon, Mars', hi: 'सूर्य, चन्द्र, मंगल' },
  neutral: { en: 'Jupiter', hi: 'गुरु' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Paternal grandfather, foreigners, outcasts, diplomats, spies, magicians, politicians', hi: 'दादा (पितामह), विदेशी, बहिष्कृत, राजनयिक, जासूस, जादूगर, राजनेता' },
  bodyParts: { en: 'Head (no body), nervous system, skin diseases, breathing disorders, phobias', hi: 'सिर (शरीर नहीं), तन्त्रिका तन्त्र, त्वचा रोग, श्वास विकार, भय' },
  professions: { en: 'Technology, foreign trade, aviation, cinema, politics, speculation, gambling, research', hi: 'प्रौद्योगिकी, विदेश व्यापार, विमानन, सिनेमा, राजनीति, सट्टा, जुआ, शोध' },
  materials: { en: 'Hessonite garnet (Gomed), lead, iron, blue/black cloth, electrical equipment', hi: 'गोमेद, सीसा, लोहा, नीला/काला वस्त्र, विद्युत उपकरण' },
  direction: { en: 'South-West', hi: 'दक्षिण-पश्चिम' },
  day: { en: 'Saturday (shared with Saturn)', hi: 'शनिवार (शनि के साथ साझा)' },
  color: { en: 'Smoky blue / Ultraviolet', hi: 'धूम्र नीला / पराबैंगनी' },
  season: { en: 'No specific season — operates outside natural cycles', hi: 'कोई विशेष ऋतु नहीं — प्राकृतिक चक्रों से बाहर कार्य करता है' },
  taste: { en: 'Tasteless / Artificial', hi: 'स्वादहीन / कृत्रिम' },
  guna: { en: 'Tamas', hi: 'तमस्' },
  element: { en: 'Air (Vayu) — illusion, intangibility', hi: 'वायु तत्त्व — माया, अमूर्तता' },
  gender: { en: 'Feminine (per BPHS)', hi: 'स्त्रीलिंग (BPHS के अनुसार)' },
  nature: { en: 'Malefic (Krura Graha) — amplifies whatever it touches. The great magnifier.', hi: 'पापी (क्रूर ग्रह) — जो छूता है उसे बढ़ाता है। महान विस्तारक।' },
};

// ─── Rahu in 12 Signs ─────────────────────────────────────────────────
const RAHU_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Neutral',
    effect: { en: 'Rahu in Aries (Ketu in Libra) — the axis of self vs. partnership. Rahu here craves independent identity, leadership, and pioneering action. The native is driven to assert themselves boldly, sometimes recklessly. Military, sports, entrepreneurship, and risk-taking ventures attract. Past-life comfort in relationships (Ketu in Libra) pushes the soul to develop courage and self-reliance in this lifetime.', hi: 'राहु मेष में (केतु तुला में) — स्व बनाम साझेदारी की धुरी। राहु यहाँ स्वतन्त्र पहचान, नेतृत्व और अग्रणी कार्य की लालसा रखता है। जातक साहसपूर्वक आत्म-स्थापना करता है, कभी-कभी लापरवाही से। सेना, खेल, उद्यमिता आकर्षित करते हैं।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Exalted',
    effect: { en: 'Rahu is exalted in Taurus (Ketu in Scorpio) — the axis of material security vs. transformation. Rahu here obsessively pursues wealth, luxury, sensory pleasure, and material accumulation. Exceptional talent for finance, real estate, food industries, and beauty. The native can amass great wealth but must guard against greed and possessiveness. Venus-ruled Taurus amplifies Rahu\'s magnetism — powerful attraction and charisma. This is one of Rahu\'s strongest placements for worldly success.', hi: 'राहु वृषभ में उच्च है (केतु वृश्चिक में) — भौतिक सुरक्षा बनाम परिवर्तन की धुरी। राहु यहाँ जुनूनी रूप से धन, विलास, इन्द्रिय सुख और भौतिक संचय का पीछा करता है। वित्त, सम्पत्ति, खाद्य उद्योग और सौन्दर्य में असाधारण प्रतिभा। महान धन संचय कर सकता है।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Friendly',
    effect: { en: 'Rahu in Gemini (Ketu in Sagittarius) — the axis of information vs. wisdom. Rahu here hungers for knowledge, communication, media, and technology. Brilliant networkers, writers, programmers, and social media experts. The native collects information voraciously but may struggle to find deeper meaning. Mercury\'s rulership gives exceptional verbal skills. Good for journalism, digital marketing, trading, and polyglot abilities. Can produce master manipulators of language and information.', hi: 'राहु मिथुन में (केतु धनु में) — सूचना बनाम ज्ञान की धुरी। राहु यहाँ ज्ञान, संचार, मीडिया और प्रौद्योगिकी की भूख रखता है। उत्कृष्ट नेटवर्कर, लेखक, प्रोग्रामर। सूचना लोभपूर्वक संग्रह करता है किन्तु गहरे अर्थ खोजने में कठिनाई।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Rahu in Cancer (Ketu in Capricorn) — the axis of emotional roots vs. worldly ambition. Rahu here craves emotional security, nurturing, and a sense of belonging. The native may obsess over home, family lineage, and patriotism. Can indicate foreign settlement with deep homesickness. Moon-ruled sign makes emotions intense and fluctuating. Good for real estate, hospitality, food business, and politics. The challenge: distinguishing genuine feelings from manufactured emotional drama.', hi: 'राहु कर्क में (केतु मकर में) — भावनात्मक जड़ें बनाम सांसारिक महत्वाकांक्षा की धुरी। राहु यहाँ भावनात्मक सुरक्षा, पोषण और अपनत्व की लालसा रखता है। घर, वंश और देशभक्ति पर जुनून। विदेश बसने पर गहरी पीड़ा।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Rahu in Leo (Ketu in Aquarius) — the axis of personal glory vs. collective service. Rahu here craves fame, recognition, creative expression, and center stage. Powerful placement for politics, entertainment, social media influence, and leadership positions. The native desires to be seen as royal, special, and extraordinary. Sun-ruled sign creates tension — Rahu eclipses the soul, giving outward glamour but inner identity confusion. Must guard against narcissism and hollow fame.', hi: 'राहु सिंह में (केतु कुम्भ में) — व्यक्तिगत यश बनाम सामूहिक सेवा की धुरी। राहु यहाँ प्रसिद्धि, मान्यता, सृजनात्मक अभिव्यक्ति और केन्द्र मंच की लालसा रखता है। राजनीति, मनोरंजन, सोशल मीडिया प्रभाव के लिए शक्तिशाली। बाह्य आकर्षण किन्तु आन्तरिक पहचान भ्रम।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Moolatrikona (disputed)',
    effect: { en: 'Rahu in Virgo (Ketu in Pisces) — the axis of analytical mastery vs. spiritual surrender. Rahu here obsessively pursues perfection, health, service, and technical skill. Exceptional placement for medicine, technology, data analysis, and quality control. The native develops extraordinary attention to detail. Mercury\'s sign gives Rahu strong intellectual power. Can indicate obsession with health, diet fads, and anxiety disorders. Past-life spiritual comfort (Ketu in Pisces) drives the soul toward mastering the material world.', hi: 'राहु कन्या में (केतु मीन में) — विश्लेषणात्मक निपुणता बनाम आध्यात्मिक समर्पण की धुरी। राहु यहाँ पूर्णता, स्वास्थ्य, सेवा और तकनीकी कौशल का जुनूनी पीछा करता है। चिकित्सा, प्रौद्योगिकी, डेटा विश्लेषण के लिए असाधारण। स्वास्थ्य और आहार का जुनून।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Friendly',
    effect: { en: 'Rahu in Libra (Ketu in Aries) — the axis of relationships vs. independence. Rahu here craves partnerships, social status, luxury, and diplomatic finesse. Exceptional for law, diplomacy, fashion, art dealing, and public relations. The native is drawn to beautiful, powerful, or foreign partners. Venus-ruled sign amplifies desire for harmony and aesthetic perfection. Can indicate unconventional marriages or relationships with people from different backgrounds. Must guard against people-pleasing and loss of self in relationships.', hi: 'राहु तुला में (केतु मेष में) — सम्बन्ध बनाम स्वतन्त्रता की धुरी। राहु यहाँ साझेदारी, सामाजिक प्रतिष्ठा, विलास और राजनयिक कुशलता की लालसा रखता है। विधि, राजनय, फैशन, कला और जनसम्पर्क के लिए उत्कृष्ट। अपरम्परागत विवाह संभव।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Debilitated',
    effect: { en: 'Rahu is debilitated in Scorpio (Ketu in Taurus) — the axis of hidden power vs. material comfort. Rahu here is drawn to the occult, taboo, hidden wealth, and transformative experiences — but struggles to control these forces. Obsession with secrets, conspiracies, and power dynamics. Can indicate sudden gains and losses, involvement with inheritances or insurance. Mars-ruled sign intensifies Rahu\'s already volatile nature. Tantra, research, surgery, and underground activities attract. Must guard against manipulation, jealousy, and self-destruction.', hi: 'राहु वृश्चिक में नीच है (केतु वृषभ में) — गुप्त शक्ति बनाम भौतिक सुख की धुरी। राहु यहाँ गूढ़, वर्जित, छिपे धन और परिवर्तनकारी अनुभवों की ओर खिंचता है — किन्तु इन शक्तियों को नियन्त्रित करने में संघर्ष। रहस्य और शक्ति गतिशीलता का जुनून।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Neutral',
    effect: { en: 'Rahu in Sagittarius (Ketu in Gemini) — the axis of belief vs. information. Rahu here craves higher knowledge, philosophy, religion, foreign travel, and guru status. The native may adopt unconventional belief systems, become attracted to foreign religions, or seek teaching authority. Jupiter\'s sign gives Rahu expansiveness but also potential for religious hypocrisy. Good for international business, publishing, law, and academia. Past-life expertise in communication (Ketu in Gemini) drives the soul toward finding ultimate truth.', hi: 'राहु धनु में (केतु मिथुन में) — विश्वास बनाम सूचना की धुरी। राहु यहाँ उच्च ज्ञान, दर्शन, धर्म, विदेश यात्रा और गुरु पद की लालसा रखता है। अपरम्परागत विश्वास प्रणालियाँ अपना सकता है। अन्तर्राष्ट्रीय व्यापार, प्रकाशन, विधि के लिए शुभ।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Friendly',
    effect: { en: 'Rahu in Capricorn (Ketu in Cancer) — the axis of worldly achievement vs. emotional roots. Rahu here is intensely ambitious, driven to climb social hierarchies and achieve institutional power. Saturn-ruled sign channels Rahu\'s desire into disciplined, systematic ambition. Excellent for corporate leadership, government authority, large-scale business, and structural engineering. The native may sacrifice family comfort for career. Can reach very high positions but at emotional cost. One of Rahu\'s most productive placements when well-aspected.', hi: 'राहु मकर में (केतु कर्क में) — सांसारिक उपलब्धि बनाम भावनात्मक जड़ों की धुरी। राहु यहाँ अत्यन्त महत्वाकांक्षी, सामाजिक पदानुक्रम में चढ़ने और संस्थागत शक्ति प्राप्त करने के लिए प्रेरित। शनि-शासित राशि अनुशासित महत्वाकांक्षा देती है।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Co-ruler (per some)',
    effect: { en: 'Rahu in Aquarius (Ketu in Leo) — the axis of collective innovation vs. personal creativity. Rahu here thrives in technology, social movements, networking, and unconventional communities. Some traditions consider Rahu the co-ruler of Aquarius (alongside Saturn), making this a strong placement. The native is drawn to humanitarian causes, scientific research, and digital innovation. Excellent for tech startups, social media, AI, space science, and democratic institutions. Can indicate an eccentric genius or a revolutionary figure.', hi: 'राहु कुम्भ में (केतु सिंह में) — सामूहिक नवाचार बनाम व्यक्तिगत सृजनात्मकता की धुरी। राहु यहाँ प्रौद्योगिकी, सामाजिक आन्दोलन, नेटवर्किंग में समृद्ध होता है। कुछ परम्पराएँ राहु को कुम्भ का सह-स्वामी मानती हैं। मानवतावादी कार्य और वैज्ञानिक शोध की ओर।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Neutral',
    effect: { en: 'Rahu in Pisces (Ketu in Virgo) — the axis of spiritual imagination vs. practical analysis. Rahu here craves mystical experiences, spiritual authority, and transcendence — but through unconventional means. The native may be drawn to psychedelics, foreign spiritual traditions, virtual reality, or cinema. Jupiter-ruled sign gives Rahu access to intuition and faith, but can produce spiritual bypassing or guru fraud. Good for film, photography, meditation retreats, and charitable work. Must learn to distinguish genuine spirituality from escapism.', hi: 'राहु मीन में (केतु कन्या में) — आध्यात्मिक कल्पना बनाम व्यावहारिक विश्लेषण की धुरी। राहु यहाँ रहस्यमय अनुभव, आध्यात्मिक अधिकार और अतिक्रमण की लालसा रखता है — किन्तु अपरम्परागत साधनों से। सिनेमा, फोटोग्राफी, ध्यान और दान कार्य के लिए शुभ।' } },
];

// ─── Rahu in 12 Houses ────────────────────────────────────────────────
const RAHU_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Rahu in the ascendant gives a powerful, magnetic personality with an unconventional appearance or aura. The native is driven by ambition, restlessness, and a hunger for new experiences. Can indicate foreign connections from birth, mixed-culture identity, or an unusual physical feature. Strong desire to stand out. Ketu in the 7th creates detachment from conventional partnerships — the native attracts unusual relationships. One of the most intense Rahu placements for personal transformation.', hi: 'लग्न में राहु शक्तिशाली, चुम्बकीय व्यक्तित्व देता है। जातक महत्वाकांक्षा, बेचैनी और नए अनुभवों की भूख से प्रेरित। विदेशी सम्बन्ध, मिश्र-संस्कृति पहचान संभव। 7वें में केतु पारम्परिक साझेदारी से वैराग्य।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Rahu in the house of wealth creates an insatiable desire for money, possessions, and status symbols. Speech may be unusual — foreign accents, multilingual ability, or persuasive/deceptive communication. Family background may be unconventional or involve foreign elements. Can amass great wealth through technology, foreign trade, or speculation. Food habits may be unusual or include foreign cuisines. Must guard against lying or exaggeration in speech. Ketu in 8th brings past-life comfort with occult and transformation.', hi: '2nd भाव में राहु धन, सम्पत्ति और प्रतिष्ठा चिह्नों की अतृप्त इच्छा उत्पन्न करता है। वाणी असामान्य — विदेशी उच्चारण, बहुभाषी क्षमता। पारिवारिक पृष्ठभूमि अपरम्परागत। प्रौद्योगिकी या विदेशी व्यापार से अपार धन संभव।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Rahu in the 3rd gives extraordinary courage, communication skills, and a restless mind that constantly seeks new information. Exceptional for media, writing, technology, marketing, and short-distance travel. The native may have an unusual relationship with siblings or step-siblings. Digital communication and social media thrive here. Ketu in 9th detaches from conventional religion and father — the native may reject inherited belief systems. One of the best placements for modern entrepreneurship and content creation.', hi: '3rd भाव में राहु असाधारण साहस, संवाद कौशल और अथक जिज्ञासु मन देता है। मीडिया, लेखन, प्रौद्योगिकी, विपणन के लिए उत्कृष्ट। भाई-बहनों से असामान्य सम्बन्ध। 9वें में केतु पारम्परिक धर्म और पिता से वैराग्य।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Rahu in the 4th creates a deep craving for emotional security, property, and a sense of belonging — often through unconventional means. The native may settle in a foreign land, own unusual properties, or have a non-traditional home environment. Mother may be of foreign origin or unconventional. Education may be disrupted or pursued in foreign institutions. Real estate, automobiles, and land dealings attract. Ketu in 10th detaches from conventional career ambition — the native\'s reputation may be unpredictable.', hi: '4th भाव में राहु भावनात्मक सुरक्षा, सम्पत्ति और अपनत्व की गहरी लालसा — प्रायः अपरम्परागत साधनों से। विदेश में बसना, असामान्य सम्पत्ति, अपारम्परिक गृह वातावरण। माता विदेशी या अपरम्परागत। 10वें में केतु करियर से वैराग्य।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Rahu in the 5th amplifies creative expression, speculation, romance, and intelligence — but with an unconventional twist. The native may be drawn to foreign education, unusual creative arts, stock markets, or gambling. Children may come late, through unusual circumstances, or have foreign connections. Romance tends toward cross-cultural or unconventional relationships. Excellent for cinema, technology innovation, and speculative finance. Ketu in 11th detaches from social networks and large gains — the native may be a lone genius rather than a team player.', hi: '5th भाव में राहु सृजनात्मक अभिव्यक्ति, सट्टा, प्रेम और बुद्धि को बढ़ाता है — अपरम्परागत ढंग से। विदेशी शिक्षा, असामान्य कलाओं, शेयर बाजार की ओर आकर्षण। सन्तान विलम्ब से या असामान्य परिस्थितियों में। सिनेमा और प्रौद्योगिकी नवाचार के लिए उत्कृष्ट।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Rahu in the 6th is a powerful placement — Rahu thrives in overcoming enemies, competition, and obstacles through unconventional methods. Excellent for litigation, foreign medical practice, military intelligence, and competitive examination. The native defeats adversaries through cunning and strategy. Can indicate unusual diseases or foreign-origin health issues, but also exceptional healing abilities. Ketu in 12th enhances spiritual liberation and detachment from worldly losses. This is considered one of Rahu\'s best house placements.', hi: '6th भाव में राहु शक्तिशाली स्थिति — शत्रुओं, प्रतिस्पर्धा और बाधाओं पर अपरम्परागत विधियों से विजय। मुकदमेबाजी, विदेशी चिकित्सा, सैन्य गुप्तचर के लिए उत्कृष्ट। चालाकी और रणनीति से प्रतिद्वन्द्वियों को पराजित करता है। 12वें में केतु आध्यात्मिक मुक्ति बढ़ाता है।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'Rahu in the 7th creates an intense desire for partnerships — often with someone from a different culture, religion, or social background. The native may have multiple relationships before finding stability. Business partnerships may involve foreign elements. The spouse may be unconventional, charismatic, or from a different background. Good for international business, diplomacy, and cross-cultural work. Ketu in 1st creates an unusual self-image — the native may appear detached or spiritual while being driven by partnership desires.', hi: '7th भाव में राहु साझेदारी की तीव्र इच्छा — प्रायः भिन्न संस्कृति, धर्म या सामाजिक पृष्ठभूमि से। स्थिरता पूर्व अनेक सम्बन्ध। जीवनसाथी अपरम्परागत या भिन्न पृष्ठभूमि का। अन्तर्राष्ट्रीय व्यापार और राजनय के लिए शुभ। 1st में केतु असामान्य आत्म-छवि।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Rahu in the 8th is intensely transformative — the native is drawn to hidden knowledge, occult sciences, research, and forbidden territories. Sudden wealth through inheritance, insurance, or speculative means is possible. Sexual energy is powerful and unconventional. Interest in tantra, astrology, forensics, and underground economies. Health crises can be sudden and unusual. Longevity may be affected by unexpected events. Ketu in 2nd detaches from family wealth and conventional speech. This placement produces detectives, researchers, and tantrikas.', hi: '8th भाव में राहु अत्यन्त परिवर्तनकारी — गुप्त ज्ञान, गूढ़ विज्ञान, शोध और वर्जित क्षेत्रों की ओर आकर्षण। विरासत, बीमा या सट्टे से अचानक धन। तन्त्र, ज्योतिष, फोरेन्सिक में रुचि। 2nd में केतु पारिवारिक धन से वैराग्य।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Rahu in the 9th hungers for higher wisdom, foreign travel, and spiritual authority — but through unconventional paths. The native may adopt a foreign religion, become a guru figure, or challenge traditional beliefs. Father may be of foreign origin, absent, or unconventional. Long-distance travel for education or pilgrimage is likely. Excellent for international law, academia, publishing, and interfaith dialogue. Ketu in 3rd gives past-life expertise in communication and courage. Must guard against false guru syndrome and religious hypocrisy.', hi: '9th भाव में राहु उच्च ज्ञान, विदेश यात्रा और आध्यात्मिक अधिकार की भूख — अपरम्परागत मार्गों से। विदेशी धर्म अपनाना, गुरु बनना या पारम्परिक विश्वासों को चुनौती। पिता विदेशी या अपरम्परागत। अन्तर्राष्ट्रीय विधि और शिक्षा के लिए उत्कृष्ट।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Rahu in the 10th is one of the most powerful placements for worldly success — the native is obsessively driven to achieve fame, authority, and professional recognition. Career often involves technology, foreign connections, unconventional fields, or public-facing roles. Can rise to very high positions through determination and sometimes manipulation. Politics, cinema, technology leadership, and corporate power attract. The native\'s reputation may be controversial. Ketu in 4th detaches from domestic comfort and homeland. This placement has produced many world leaders and tech moguls.', hi: '10th भाव में राहु सांसारिक सफलता के लिए सबसे शक्तिशाली स्थितियों में — प्रसिद्धि, अधिकार और व्यावसायिक मान्यता प्राप्त करने का जुनून। प्रौद्योगिकी, विदेशी सम्बन्ध, अपरम्परागत क्षेत्रों में करियर। बहुत ऊँचे पदों पर पहुँच सकता है। 4th में केतु घरेलू सुख से वैराग्य।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Rahu in the 11th is exceptionally auspicious for wealth and gains — the native achieves desires through large networks, technology, foreign connections, and unconventional means. Friendships with powerful, foreign, or unusual people. Income from technology, speculation, or international sources. Elder siblings may be foreign or unconventional. Excellent for tech entrepreneurs, social media influencers, and network marketing. Ketu in 5th detaches from conventional creative expression and romantic attachment. One of the best Rahu placements overall — material success almost guaranteed when well-aspected.', hi: '11th भाव में राहु धन और लाभ के लिए अत्यन्त शुभ — बड़े नेटवर्क, प्रौद्योगिकी, विदेशी सम्बन्धों से इच्छाएँ पूर्ण। शक्तिशाली और विदेशी मित्र। प्रौद्योगिकी और अन्तर्राष्ट्रीय स्रोतों से आय। 5th में केतु पारम्परिक सृजनात्मकता और प्रेम से वैराग्य।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Rahu in the 12th creates a powerful pull toward foreign lands, spiritual seeking, isolation, and hidden pleasures. The native may settle abroad, work in hospitals or ashrams, or develop interest in dreams and the subconscious. Expenditure may be excessive or on unusual items. Sleep disturbances, vivid dreams, and astral experiences are common. Good for foreign settlement, import/export, spiritual retreats, and work in isolation. Ketu in 6th destroys enemies and diseases from past-life merit. Must guard against escapism, addiction, and self-undoing.', hi: '12th भाव में राहु विदेश, आध्यात्मिक खोज, एकान्त और गुप्त सुखों की ओर शक्तिशाली खिंचाव। विदेश बसना, अस्पतालों या आश्रमों में कार्य। अत्यधिक या असामान्य व्यय। नींद में व्यवधान, सजीव स्वप्न। 6th में केतु शत्रुओं और रोगों का नाश।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 18,
  overview: {
    en: 'Rahu\'s Vimshottari Mahadasha lasts 18 years — the longest of all planetary periods, equal to Saturn. This extended period brings profound transformation, obsessive pursuit of worldly goals, and encounters with foreign elements. The native\'s relationship with illusion, desire, technology, and unconventional paths comes into sharp focus. Career can see dramatic rises or falls. Foreign travel and settlement are highly likely. Rahu dasha often begins a completely new chapter in life — the person who enters it is not the person who exits it.',
    hi: 'राहु की विंशोत्तरी महादशा 18 वर्ष चलती है — शनि के बराबर, सबसे लम्बी अवधि। यह विस्तारित काल गहन परिवर्तन, सांसारिक लक्ष्यों का जुनूनी पीछा और विदेशी तत्वों से मुठभेड़ लाता है। माया, इच्छा, प्रौद्योगिकी और अपरम्परागत मार्गों से सम्बन्ध स्पष्ट होता है। करियर में नाटकीय उत्थान या पतन। विदेश यात्रा अत्यन्त सम्भव।',
  },
  strongResult: {
    en: 'If Rahu is well-placed (exalted, in friendly sign, or in upachaya houses 3/6/10/11): Sudden rise in career, foreign opportunities, technological breakthroughs, massive wealth accumulation, political power, fame through media or entertainment, unconventional success that defies tradition.',
    hi: 'यदि राहु सुस्थित है (उच्च, मित्र राशि, या उपचय भाव 3/6/10/11 में): करियर में अचानक उत्थान, विदेशी अवसर, प्रौद्योगिकी सफलता, अपार धन संचय, राजनीतिक शक्ति, मीडिया या मनोरंजन से प्रसिद्धि।',
  },
  weakResult: {
    en: 'If Rahu is afflicted (debilitated, with malefics, or in dusthana without benefic aspect): Scandals, fraud exposure, sudden downfall, legal troubles, immigration problems, addiction, mental confusion, phobias, snake-related fears, skin diseases, mysterious illnesses.',
    hi: 'यदि राहु पीड़ित है (नीच, पापी ग्रहों के साथ, या शुभ दृष्टि बिना दुस्थान में): घोटाले, धोखाधड़ी उजागर, अचानक पतन, कानूनी कठिनाइयाँ, आव्रजन समस्याएँ, व्यसन, मानसिक भ्रम, भय, त्वचा रोग, रहस्यमय बीमारियाँ।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', transliteration: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', count: '18,000 times in 40 days', en: 'The Rahu Beej Mantra — chant during Rahu Kaal or at night, preferably on Saturdays. Use a Gomed (hessonite) mala if available.', hi: 'राहु बीज मन्त्र — राहु काल में या रात्रि में जाप करें, अधिमानतः शनिवार को। यदि उपलब्ध हो तो गोमेद माला का उपयोग करें।' },
  gemstone: { en: 'Hessonite Garnet (Gomed) — set in silver or panchdhatu (five-metal alloy), worn on the middle finger of the right hand on a Saturday during Rahu Kaal. Minimum 4 carats. Must touch the skin. WARNING: Rahu gemstones amplify Rahu\'s energy — only wear if Rahu is a yogakaraka or well-placed. A badly-placed Rahu with Gomed will intensify problems.', hi: 'गोमेद — रजत या पंचधातु में जड़ित, शनिवार को राहु काल में दाहिने हाथ की मध्यमा में धारण करें। न्यूनतम 4 कैरेट। त्वचा स्पर्श अनिवार्य। चेतावनी: राहु रत्न राहु की ऊर्जा बढ़ाता है — केवल तभी धारण करें जब राहु योगकारक या सुस्थित हो।' },
  charity: { en: 'Donate blue/black cloth, sesame seeds (til), iron utensils, mustard oil, or blankets on Saturdays. Feed birds, especially crows. Donate to leprosy patients or mentally ill persons.', hi: 'शनिवार को नीला/काला वस्त्र, तिल, लोहे के बर्तन, सरसों का तेल या कम्बल दान करें। पक्षियों को विशेषकर कौओं को खिलाएँ। कुष्ठ रोगियों या मानसिक रोगियों को दान करें।' },
  fasting: { en: 'Saturday fasting — abstain from alcohol, non-vegetarian food, and tobacco. Some traditions prescribe fasting on the day of Rahu-ruled nakshatra (Ardra, Swati, Shatabhisha).', hi: 'शनिवार का उपवास — मद्य, माँसाहार और तम्बाकू से परहेज। कुछ परम्पराओं में राहु-शासित नक्षत्र (आर्द्रा, स्वाति, शतभिषा) के दिन उपवास।' },
  worship: { en: 'Worship Goddess Durga or Saraswati. Recite Rahu Kavach or Rahu Stotra. Perform Nag Puja (serpent worship) at Rahu temples. The most powerful remedy: offer Durga Saptashati path on Saturday evenings. Lighting a mustard oil lamp at a crossroad on Saturday evening.', hi: 'देवी दुर्गा या सरस्वती की उपासना करें। राहु कवच या राहु स्तोत्र का पाठ करें। राहु मन्दिर में नाग पूजा करें। सबसे शक्तिशाली उपाय: शनिवार सन्ध्या को दुर्गा सप्तशती पाठ। शनिवार सन्ध्या को चौराहे पर सरसों तेल का दीपक जलाएँ।' },
  yantra: { en: 'Rahu Yantra — a 3x3 magic square with specific numerical arrangement. Install on a silver plate or bhojpatra, worship on Saturdays during Rahu Kaal. Keep in the south-west corner of the home.', hi: 'राहु यन्त्र — विशिष्ट संख्यात्मक व्यवस्था का 3x3 जादुई वर्ग। रजत पत्र या भोजपत्र पर स्थापित करें, शनिवार को राहु काल में पूजन करें। घर के दक्षिण-पश्चिम कोने में रखें।' },
  dietary: { en: 'Rahu responds to garlic, onions, coconut, and strong-flavored foods. Eating coconut on Saturdays is a simple but effective Rahu pacification. Avoid excessively processed or artificial foods during Rahu dasha — ironic since Rahu rules artificial things, but consuming them amplifies Rahu\'s chaotic energy. Black urad dal with garlic on Saturdays is a traditional Rahu dietary remedy. Drinking coconut water and using coconut oil in cooking helps balance Rahu\'s smoky, agitating energy with cool, nourishing lunar qualities.', hi: 'राहु लहसुन, प्याज, नारियल और तीव्र स्वाद वाले खाद्य पदार्थों से प्रतिक्रिया करता है। शनिवार को नारियल खाना सरल किन्तु प्रभावी राहु शान्ति। राहु दशा में अत्यधिक प्रसंस्कृत भोजन से बचें। शनिवार को लहसुन के साथ काली उड़द दाल पारम्परिक राहु आहार उपाय। नारियल पानी और नारियल तेल राहु की अशान्त ऊर्जा को शान्त चन्द्र गुणों से सन्तुलित करता है।' },
  behavioral: { en: 'Rahu behavioral remedies focus on honesty, transparency, and grounding. Since Rahu represents illusion and deception, the most powerful counter is radical truthfulness. Wear blue or black clothing on Saturdays. Avoid gossip, manipulation, and hidden agendas — these amplify Rahu\'s negative side. Practice digital detox regularly (Rahu rules technology addiction). Spend time in nature, barefoot on earth, to ground Rahu\'s ethereal, destabilizing energy. Avoid gambling and speculative risks during Rahu transits. The single most effective behavioral remedy: honest self-examination — seeing through your own illusions before they consume you.', hi: 'राहु व्यावहारिक उपाय ईमानदारी, पारदर्शिता और भूमि से जुड़ाव पर केन्द्रित हैं। राहु माया और छल का प्रतिनिधि, अतः सबसे शक्तिशाली प्रतिकार मूलगत सत्यनिष्ठा। शनिवार को नीला या काला वस्त्र पहनें। गपशप, छलकपट और छिपे इरादों से बचें। नियमित डिजिटल विषहरण (राहु प्रौद्योगिकी व्यसन शासित करता है)। प्रकृति में समय बिताएँ, नंगे पैर भूमि पर।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'During the Samudra Manthan (churning of the cosmic ocean), a demon named Svarbhanu disguised himself as a deva and drank the Amrit (nectar of immortality). The Sun and Moon recognized him and alerted Lord Vishnu, who severed his head with the Sudarshana Chakra. But the Amrit had already passed his throat — so the head (Rahu) and the body (Ketu) both became immortal. Rahu eternally chases the Sun and Moon to swallow them — this is the mythological explanation for eclipses. Every eclipse is Rahu\'s revenge, and this cosmic chase drives the 18-month nodal transit cycle through the zodiac.',
    hi: 'समुद्र मन्थन के दौरान, स्वर्भानु नामक दैत्य ने देव का वेष धारण कर अमृत पी लिया। सूर्य और चन्द्र ने उसे पहचाना और भगवान विष्णु को सचेत किया, जिन्होंने सुदर्शन चक्र से उसका सिर काट दिया। किन्तु अमृत कण्ठ से नीचे उतर चुका था — अतः सिर (राहु) और धड़ (केतु) दोनों अमर हो गए। राहु शाश्वत रूप से सूर्य और चन्द्र को निगलने का पीछा करता है — यह ग्रहणों की पौराणिक व्याख्या है।',
  },
  temples: {
    en: 'Major Rahu temples: Thirunageswaram Rahu Temple (Tamil Nadu) — one of the Navagraha temples, the primary Rahu worship site; Srikalahasti Temple (Andhra Pradesh) — where Rahu-Ketu dosha remedies are performed; Naganathaswamy Temple (Kumbakonam) — dedicated to serpent deities associated with Rahu. Rahu is also worshipped at crossroads (chauraha) in folk traditions across India.',
    hi: 'प्रमुख राहु मन्दिर: तिरुनागेश्वरम् राहु मन्दिर (तमिलनाडु) — नवग्रह मन्दिरों में एक, प्रमुख राहु पूजा स्थल; श्रीकालहस्ती मन्दिर (आन्ध्र प्रदेश) — राहु-केतु दोष उपचार; नागनाथस्वामी मन्दिर (कुम्भकोणम्) — राहु से सम्बन्धित सर्प देवताओं को समर्पित। राहु की पूजा लोक परम्पराओं में चौराहों पर भी होती है।',
  },
  keyHymn: {
    en: 'The Rahu Kavach from the Skanda Purana is the most potent protective hymn. The opening verse: "Ardhakaayam Mahaaveeryam Chandraadityavimardanam / Simhikaagarbhasambhootam Tam Rahum Pranamaamyaham" — "I bow to Rahu, the half-bodied one of great valor, born from Simhika\'s womb, who eclipses the Sun and Moon."',
    hi: 'स्कन्द पुराण का राहु कवच सबसे शक्तिशाली रक्षात्मक स्तुति है। प्रारम्भिक श्लोक: "अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम् / सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम्" — "मैं राहु को प्रणाम करता हूँ, महान पराक्रम वाले अर्धकाय, सिंहिका के गर्भ से जन्मे, सूर्य और चन्द्र को ग्रसने वाले।"',
  },
  samudraManthanFull: {
    en: 'The full Samudra Manthan story reveals Rahu\'s nature perfectly. The Devas and Asuras churned the cosmic ocean using Mount Mandara as the churning rod and Vasuki (the serpent king) as the rope. From the ocean emerged both poison (Halahala, drunk by Shiva) and nectar (Amrit). When the Amrit appeared, the Asuras tried to seize it. Lord Vishnu assumed the form of Mohini — the most beautiful woman ever created — and offered to distribute the nectar fairly. The Asuras, bewitched by her beauty, agreed. Mohini served the Devas first. Svarbhanu, a shrewd Asura, saw through the deception and disguised himself as a Deva, sitting between the Sun and Moon. He drank the Amrit — but before it could pass his throat, the Sun and Moon exposed him, and Vishnu severed his head with the Sudarshana Chakra. This story encodes Rahu\'s entire astrological nature: deception, disguise, crossing boundaries, seizing what isn\'t rightfully yours, and the consequences of illusion.',
    hi: 'पूर्ण समुद्र मन्थन कथा राहु की प्रकृति को पूर्णतः प्रकट करती है। देवों और असुरों ने मन्दर पर्वत को मथनी और वासुकि (नागराज) को रस्सी के रूप में ब्रह्माण्डीय समुद्र मथा। समुद्र से विष (हलाहल, शिव द्वारा पीया) और अमृत दोनों निकले। जब अमृत प्रकट हुआ, असुरों ने छीनने का प्रयास किया। भगवान विष्णु ने मोहिनी रूप धारण किया — सबसे सुन्दर नारी — और अमृत समान वितरण का प्रस्ताव रखा। स्वर्भानु ने छल देखा और देव का वेष धारण किया, सूर्य और चन्द्र के बीच बैठा। अमृत पीया — किन्तु कण्ठ से नीचे जाने से पहले सूर्य-चन्द्र ने उजागर किया और विष्णु ने सुदर्शन चक्र से सिर काटा।',
  },
  whyRahuChases: {
    en: 'Why does Rahu eternally chase the Sun and Moon? Because they are the ones who exposed him. The Sun (Surya) and Moon (Chandra) recognized Svarbhanu\'s disguise and alerted Vishnu. In revenge, Rahu\'s severed head perpetually chases them across the sky. When he catches them, an eclipse occurs — Rahu swallows the luminary. But because Rahu has no body, the swallowed Sun or Moon passes through his severed throat and reappears. This myth explains both solar and lunar eclipses, and encodes the astrological principle that Rahu-Sun and Rahu-Moon conjunctions (Grahan Yoga) represent the eclipsing of ego and mind — temporary but intense periods of darkness and confusion that ultimately reveal hidden truth.',
    hi: 'राहु शाश्वत रूप से सूर्य और चन्द्र का पीछा क्यों करता है? क्योंकि उन्होंने ही उसे उजागर किया। सूर्य और चन्द्र ने स्वर्भानु का वेष पहचाना और विष्णु को सचेत किया। प्रतिशोध में राहु का कटा सिर शाश्वत रूप से उनका पीछा करता है। जब पकड़ता है, ग्रहण होता है — राहु ज्योति निगलता है। किन्तु शरीर न होने से निगला सूर्य या चन्द्र कटे कण्ठ से गुजरकर फिर प्रकट होता है। यह कथा सूर्य और चन्द्र दोनों ग्रहणों की व्याख्या करती है।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Rahu eclipses the Sun — illusion obscures the soul. Grahan Yoga (Rahu-Sun conjunction) creates identity crisis, father issues, and government troubles. But can also give sudden fame and political power.', hi: 'राहु सूर्य को ग्रहण करता है — माया आत्मा को ढकती है। ग्रहण योग (राहु-सूर्य युति) पहचान संकट, पितृ समस्या और सरकारी कठिनाइयाँ। किन्तु अचानक प्रसिद्धि और राजनीतिक शक्ति भी दे सकता है।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Rahu-Moon conjunction is Grahan Yoga on the mind — mental restlessness, anxiety, obsessive thoughts, and emotional volatility. Mother may face challenges. But can also give sharp intuition, psychic abilities, and public popularity.', hi: 'राहु-चन्द्र युति मन पर ग्रहण योग — मानसिक अशान्ति, चिन्ता, जुनूनी विचार। माता को कठिनाइयाँ। किन्तु तीक्ष्ण अन्तर्ज्ञान और जनप्रियता भी दे सकता है।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Rahu amplifies Mars\'s aggression — accident-prone, surgical situations, blood-related issues. Angarak Yoga (Rahu-Mars conjunction) is highly volatile. But can give extraordinary courage, military success, and technical engineering talent.', hi: 'राहु मंगल की आक्रामकता बढ़ाता है — दुर्घटना प्रवण, शल्य स्थितियाँ। अंगारक योग (राहु-मंगल युति) अत्यन्त अस्थिर। किन्तु असाधारण साहस और तकनीकी प्रतिभा भी दे सकता है।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Rahu with Mercury creates exceptional intelligence, communication talent, and technological aptitude. The native excels in programming, data analysis, trading, and strategic communication. Can indicate cunning or deceptive intelligence if afflicted.', hi: 'राहु बुध के साथ असाधारण बुद्धि, संवाद प्रतिभा और तकनीकी योग्यता बनाता है। प्रोग्रामिंग, डेटा विश्लेषण, व्यापार में उत्कृष्ट। पीड़ित होने पर छली बुद्धि।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Rahu-Jupiter conjunction is Guru Chandal Yoga — the guru is contaminated by the outcaste. Can indicate unconventional spiritual paths, foreign gurus, or religious hypocrisy. But also produces brilliant philosophers, researchers, and cross-cultural educators.', hi: 'राहु-गुरु युति गुरु चाण्डाल योग — गुरु चाण्डाल से दूषित। अपरम्परागत आध्यात्मिक मार्ग, विदेशी गुरु या धार्मिक पाखण्ड। किन्तु उत्कृष्ट दार्शनिक और शोधकर्ता भी बनाता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Rahu amplifies Venus\'s desire nature — intense attraction, luxury obsession, creative talent, and material magnetism. Excellent for entertainment, fashion, beauty industries, and artistic expression. Can indicate unconventional relationships or excessive indulgence.', hi: 'राहु शुक्र की इच्छा प्रकृति बढ़ाता है — तीव्र आकर्षण, विलास जुनून, सृजनात्मक प्रतिभा। मनोरंजन, फैशन, सौन्दर्य उद्योग के लिए उत्कृष्ट। अपरम्परागत सम्बन्ध या अत्यधिक भोग संभव।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Rahu-Saturn conjunction combines discipline with obsession — can create extreme workaholics, political operators, or systematic manipulators. The Shani-Rahu conjunction (Shrapit Yoga) indicates past-life karmic debt. But also gives extraordinary perseverance and capacity for long-term strategic achievement.', hi: 'राहु-शनि युति अनुशासन और जुनून मिलाती है — अत्यधिक कर्मठ, राजनीतिक संचालक। श्रापित योग पूर्व जन्म के कार्मिक ऋण का संकेत। किन्तु असाधारण दृढ़ता और दीर्घकालिक रणनीतिक उपलब्धि भी देता है।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Axis partner', hi: 'धुरी साझीदार' }, note: { en: 'Rahu and Ketu are always exactly 180° apart — they form a single karmic axis. Rahu shows where the soul is heading (future desire), Ketu shows where it has been (past-life mastery). Together they define the fundamental tension of the incarnation. Their transit axis (18-month cycle) is one of the most powerful timing tools in Jyotish.', hi: 'राहु और केतु सदा ठीक 180° पर — एक कार्मिक धुरी बनाते हैं। राहु दिखाता है आत्मा कहाँ जा रही है (भविष्य की इच्छा), केतु दिखाता है कहाँ रही है (पूर्व जन्म की निपुणता)। साथ में अवतार का मूल तनाव परिभाषित करते हैं।' } },
];

// ─── Astronomical Profile ─────────────────────────────────────────────
const ASTRONOMICAL = {
  nodalCycle: { en: 'The lunar nodes (Rahu and Ketu) complete one full cycle through the zodiac in approximately 18.61 years, spending about 18 months (1.55 years) in each sign. Unlike the planets, the nodes move backward (retrograde) through the zodiac as their natural motion — they transit from Aries to Pisces to Aquarius, not the other way. This backward motion through the signs is why Rahu and Ketu are said to be "always retrograde." The 18.6-year cycle is one of the most important timing mechanisms in Vedic astrology, governing eclipse seasons, karmic turning points, and generational shifts.', hi: 'चन्द्र पात (राहु और केतु) लगभग 18.61 वर्षों में राशिचक्र का एक पूर्ण चक्र पूरा करते हैं, प्रत्येक राशि में लगभग 18 महीने (1.55 वर्ष) बिताते हैं। ग्रहों के विपरीत, पात राशिचक्र में पीछे (वक्री) चलते हैं — मेष से मीन से कुम्भ, उल्टा नहीं। यह 18.6 वर्ष का चक्र वैदिक ज्योतिष में सबसे महत्वपूर्ण समय तन्त्रों में एक है।' },
  eclipseMechanism: { en: 'Rahu causes solar eclipses when the Sun, Moon, and Rahu align at a new Moon near the ascending node. Rahu causes lunar eclipses when the Sun, Earth, and Moon align with Rahu at a full Moon. Eclipses can only occur when the Sun is within approximately 18 degrees of a node — this creates the "eclipse season" (about 34 days) that occurs roughly every 6 months as the Sun crosses each node. The mythological story of Rahu swallowing the Sun and Moon is a poetic description of this precise astronomical mechanism. Ancient Indian astronomers calculated eclipse timings with remarkable accuracy using nodal positions.', hi: 'राहु सूर्यग्रहण तब करता है जब सूर्य, चन्द्र और राहु अमावस्या पर आरोही पात के निकट संरेखित हों। राहु चन्द्रग्रहण तब करता है जब सूर्य, पृथ्वी और चन्द्र पूर्णिमा पर राहु के साथ संरेखित हों। ग्रहण केवल तभी हो सकते हैं जब सूर्य पात से लगभग 18 अंश भीतर हो। प्राचीन भारतीय खगोलविदों ने पात स्थितियों से ग्रहण समय की उल्लेखनीय सटीकता से गणना की।' },
  meanVsTrue: { en: 'There are two methods for calculating Rahu\'s position: Mean Node and True Node. The Mean Node moves at a constant average rate (about 0.053 degrees/day retrograde). The True Node accounts for gravitational perturbations and oscillates around the mean position, sometimes briefly moving direct. Most traditional Indian astrologers use the Mean Node (which is always retrograde), while Western sidereal astrologers often prefer the True Node. The difference between Mean and True Rahu can be up to 1.5 degrees — enough to change the nakshatra pada in some cases. This app uses the True Node system by default.', hi: 'राहु की स्थिति गणना की दो विधियाँ हैं: मध्य पात और सत्य पात। मध्य पात एक स्थिर औसत गति (लगभग 0.053 अंश/दिन वक्री) से चलता है। सत्य पात गुरुत्वाकर्षण विक्षोभ के लिए समायोजन करता है और मध्य स्थिति के चारों ओर दोलन करता है। अधिकांश पारम्परिक भारतीय ज्योतिषी मध्य पात (जो सदा वक्री) का उपयोग करते हैं। मध्य और सत्य राहु में 1.5 अंश तक अन्तर हो सकता है।' },
  alwaysRetrograde: { en: 'Rahu is always retrograde in the Mean Node system — this is not an affliction but its natural state. In the True Node system, Rahu occasionally moves direct for brief periods (a few days at a time), but the overwhelming majority of its motion is retrograde. This perpetual backward motion through the zodiac is astronomically caused by the regression of the lunar orbital plane due to the Sun\'s gravitational pull. In Jyotish, this retrograde nature symbolizes Rahu\'s connection to the past, to karma, and to the reversal of normal expectations — Rahu operates by unconventional means precisely because it moves against the current.', hi: 'मध्य पात प्रणाली में राहु सदा वक्री है — यह कोई पीड़ा नहीं बल्कि इसकी स्वाभाविक अवस्था है। सत्य पात प्रणाली में राहु कभी-कभी संक्षेप में (कुछ दिनों के लिए) मार्गी होता है, किन्तु इसकी अधिकांश गति वक्री है। राशिचक्र में यह शाश्वत पश्चगामी गति खगोलीय रूप से सूर्य के गुरुत्वाकर्षण से चन्द्र कक्षा तल के प्रतिगमन के कारण है। ज्योतिष में यह वक्री स्वभाव अतीत, कर्म और सामान्य अपेक्षाओं के उलट से सम्बन्ध प्रतीक है।' },
};

// ─── Notable Yogas ────────────────────────────────────────────────────
const NOTABLE_YOGAS = [
  { name: { en: 'Grahan Yoga (Rahu + Sun/Moon)', hi: 'ग्रहण योग (राहु + सूर्य/चन्द्र)' },
    condition: { en: 'Rahu conjunct the Sun or Moon within the same sign, especially within 10 degrees. The closer the conjunction, the more intense the effect.', hi: 'राहु एक ही राशि में सूर्य या चन्द्र से युत, विशेषकर 10 अंश के भीतर। जितनी निकट युति, उतना तीव्र प्रभाव।' },
    effect: { en: 'Rahu-Sun Grahan Yoga eclipses the ego, authority, and relationship with father. The native may struggle with identity, face government opposition, or have an absent/complex father figure. However, it also grants magnetic charisma and ability to command attention through unconventional means — many politicians and media personalities have this yoga. Rahu-Moon Grahan Yoga eclipses the mind — anxiety, obsessive thinking, and emotional instability, but also sharp intuition and public appeal. Frequency: approximately 7-8% of charts for each variant.', hi: 'राहु-सूर्य ग्रहण योग अहंकार, अधिकार और पिता से सम्बन्ध को ग्रसित करता है। पहचान में संघर्ष, सरकारी विरोध। किन्तु चुम्बकीय करिश्मा और अपरम्परागत ध्यान आकर्षित करने की क्षमता भी। राहु-चन्द्र ग्रहण योग मन को ग्रसित — चिन्ता और जुनूनी सोच, किन्तु तीक्ष्ण अन्तर्ज्ञान और जनप्रियता भी। आवृत्ति: प्रत्येक रूप में लगभग 7-8%।' } },
  { name: { en: 'Guru Chandal Yoga (Rahu + Jupiter)', hi: 'गुरु चाण्डाल योग (राहु + गुरु)' },
    condition: { en: 'Rahu conjunct Jupiter in the same sign. Some authorities also consider the mutual aspect (Rahu in the 7th from Jupiter).', hi: 'राहु गुरु के साथ एक ही राशि में युत। कुछ आचार्य पारस्परिक दृष्टि (राहु गुरु से 7वें में) भी मानते हैं।' },
    effect: { en: 'The guru is "contaminated" by the outcaste — traditional wisdom clashes with unconventional thinking. The native may adopt foreign spiritual traditions, question established religious authority, or become a guru figure through non-traditional paths. This yoga produces boundary-crossing philosophers, interfaith leaders, and academics who challenge orthodoxy. Negatively, it can indicate religious hypocrisy, false gurus, or using spiritual authority for material gain. Jupiter\'s expansion meets Rahu\'s obsession — the combination can create both brilliant teachers and charismatic frauds. Frequency: approximately 7% of charts.', hi: 'गुरु चाण्डाल से "दूषित" — पारम्परिक ज्ञान अपरम्परागत सोच से टकराता है। विदेशी आध्यात्मिक परम्पराएँ अपनाना, स्थापित धार्मिक अधिकार को चुनौती, या अपरम्परागत मार्गों से गुरु बनना। सीमा-तोड़ दार्शनिक और अन्तर्धर्मीय नेता। नकारात्मक: धार्मिक पाखण्ड या झूठे गुरु। आवृत्ति: लगभग 7%।' } },
  { name: { en: 'Kala Sarpa Yoga (All planets between Rahu-Ketu)', hi: 'काल सर्प योग (सभी ग्रह राहु-केतु के बीच)' },
    condition: { en: 'All seven visible planets (Sun through Saturn) are hemmed between Rahu and Ketu — all on one side of the nodal axis. Must be strict: no planet should cross the Rahu-Ketu line.', hi: 'सभी सात दृश्य ग्रह (सूर्य से शनि) राहु और केतु के बीच घिरे — पात धुरी के एक ही ओर। कड़ाई से: कोई ग्रह राहु-केतु रेखा पार न करे।' },
    effect: { en: 'One of the most debated yogas in Jyotish. Strict Kala Sarpa is relatively rare (about 3-5% of charts). It intensifies the karmic axis — the native\'s entire life is dominated by the Rahu-Ketu themes of desire vs. detachment. Can indicate dramatic life swings, persistent obstacles that feel fated, and intense spiritual transformation. Many successful people have partial Kala Sarpa — the restriction forces focused energy. The fear around this yoga is largely exaggerated; its effects depend heavily on the houses involved and the dignity of the nodes. Remedies include Kaal Sarpa Dosha puja at Trimbakeshwar.', hi: 'ज्योतिष में सबसे विवादित योगों में एक। कड़ा काल सर्प अपेक्षाकृत दुर्लभ (लगभग 3-5%)। कार्मिक धुरी को तीव्र करता है। नाटकीय जीवन उतार-चढ़ाव, भाग्य-जैसी बाधाएँ और तीव्र आध्यात्मिक परिवर्तन। भय अत्यधिक अतिशयोक्ति; प्रभाव भावों और पातों की गरिमा पर निर्भर। उपाय: त्र्यम्बकेश्वर पर काल सर्प पूजा। आवृत्ति: लगभग 3-5%।' } },
  { name: { en: 'Angarak Yoga (Rahu + Mars)', hi: 'अंगारक योग (राहु + मंगल)' },
    condition: { en: 'Rahu conjunct Mars in the same sign. Intensified if in the 1st, 4th, 7th, or 8th house.', hi: 'राहु मंगल के साथ एक ही राशि में युत। 1, 4, 7 या 8वें भाव में हो तो तीव्र।' },
    effect: { en: 'Rahu amplifies Mars\'s already volatile energy — creating explosive aggression, accident-proneness, and rash decision-making. The native may be drawn to danger, conflict, and high-risk situations. Surgical situations and blood-related health issues are possible. However, when channeled positively, Angarak Yoga gives extraordinary courage, technical engineering genius, athletic ability, and military leadership. Many successful surgeons, engineers, and athletes have this combination. The key is conscious channeling — Mars-Rahu energy without direction is destructive; with direction, it is unstoppable. Frequency: approximately 7% of charts.', hi: 'राहु मंगल की पहले से अस्थिर ऊर्जा को बढ़ाता है — विस्फोटक आक्रामकता, दुर्घटना प्रवणता। खतरे और संघर्ष की ओर आकर्षण। शल्य और रक्त-सम्बन्धी स्वास्थ्य। किन्तु सकारात्मक रूप से असाधारण साहस, तकनीकी प्रतिभा और सैन्य नेतृत्व। अनेक सफल शल्य चिकित्सक और अभियन्ता। दिशा बिना विनाशकारी; दिशा के साथ अजेय। आवृत्ति: लगभग 7%।' } },
];

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  rahuDashaSurvival: {
    en: 'Rahu Mahadasha (18 years) is the longest planetary period and often the most disorienting. Survival strategy: (1) Expect obsession — Rahu will fixate your mind on one thing; the key is choosing that thing wisely. (2) Embrace foreignness — travel, cross-cultural work, and unconventional paths are Rahu\'s domain. (3) Avoid shortcuts — Rahu tempts with "too good to be true" opportunities; verify everything. (4) Technology and media will be prominent — lean into these areas. (5) The first 3 years and last 3 years are the most turbulent (Rahu-Rahu and Rahu-Saturn antardashas). (6) Ground yourself — daily routine, physical exercise, and contact with earth counteract Rahu\'s disorienting energy.',
    hi: 'राहु महादशा (18 वर्ष) सबसे लम्बी और प्रायः सबसे भ्रमित करने वाली। उत्तरजीविता रणनीति: (1) जुनून की अपेक्षा — राहु मन को एक चीज पर केन्द्रित करेगा; कुंजी उसे बुद्धिमानी से चुनना। (2) विदेशीपन अपनाएँ — यात्रा और अपरम्परागत मार्ग राहु के क्षेत्र। (3) शॉर्टकट से बचें — राहु "बहुत अच्छा" अवसरों का प्रलोभन देता है। (4) प्रौद्योगिकी प्रमुख होगी। (5) प्रथम 3 और अन्तिम 3 वर्ष सबसे अशान्त। (6) भूमि से जुड़ें — दैनिक दिनचर्या और शारीरिक व्यायाम।',
  },
  wealthVsChaos: {
    en: 'When does Rahu give wealth vs. chaos? Wealth indicators: Rahu in upachaya houses (3rd, 6th, 10th, 11th), Rahu exalted in Taurus, Rahu with friendly planets (Mercury, Venus, Saturn), Rahu in signs ruled by friendly planets, and Rahu in the 2nd house with benefic aspect. Chaos indicators: Rahu debilitated in Scorpio, Rahu conjunct enemies (Sun, Moon, Mars) without benefic aspect, Rahu in the 8th or 12th without mitigation, and Rahu involved in Kala Sarpa Yoga with malefics. The single most important factor: Rahu\'s dispositor (the lord of the sign Rahu occupies). If the dispositor is strong and well-placed, Rahu delivers its positive results; if weak and afflicted, chaos follows.',
    hi: 'राहु कब धन देता है बनाम अराजकता? धन संकेत: उपचय भावों (3, 6, 10, 11) में राहु, वृषभ में उच्च, मित्र ग्रहों (बुध, शुक्र, शनि) के साथ, और शुभ दृष्टि के साथ 2nd भाव। अराजकता संकेत: वृश्चिक में नीच, शत्रुओं (सूर्य, चन्द्र, मंगल) से युत बिना शुभ दृष्टि, 8वें या 12वें में बिना शमन। सबसे महत्वपूर्ण कारक: राहु का अधिपति (राहु जिस राशि में बैठा उसका स्वामी)। अधिपति बलवान तो राहु सकारात्मक; दुर्बल तो अराजकता।',
  },
  misconceptions: {
    en: 'The most dangerous misconception about Rahu is that it is "purely malefic." Rahu is the planet of ambition, innovation, technology, and worldly achievement — without Rahu energy, there would be no entrepreneurship, no scientific breakthroughs, no cross-cultural exchange. Many of the most successful people in history have strong Rahu placements. The second misconception: "Rahu always causes scandals." Rahu amplifies whatever it touches — if it touches good planets in good houses, it amplifies success. The third misconception: "Rahu remedies can prevent all Rahu effects." Rahu\'s energy must be channeled, not suppressed. The most effective Rahu remedy is conscious pursuit of dharmic ambition — directing Rahu\'s immense drive toward service rather than selfishness.',
    hi: 'राहु के बारे में सबसे खतरनाक भ्रान्ति कि यह "पूर्णतः पापी" है। राहु महत्वाकांक्षा, नवाचार, प्रौद्योगिकी और सांसारिक उपलब्धि का ग्रह है — राहु ऊर्जा के बिना उद्यमिता, वैज्ञानिक सफलता, या अन्तर-सांस्कृतिक आदान-प्रदान नहीं होता। दूसरी भ्रान्ति: "राहु सदा घोटाले करता है।" राहु जो छूता है उसे बढ़ाता है — यदि शुभ ग्रह शुभ भावों में तो सफलता बढ़ाता है। तीसरी भ्रान्ति: "राहु उपाय सब रोक सकते हैं।" राहु ऊर्जा को दिशा देनी चाहिए, दबाना नहीं।',
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/ketu', label: { en: 'Ketu — The South Node', hi: 'केतु — दक्षिण पात' } },
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/transit-guide', label: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शिका' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/chandra', label: { en: 'Chandra — The Moon', hi: 'चन्द्र' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function RahuPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  const SECTIONS = [
    { id: 'section-1', label: ml({ en: 'Overview', hi: 'परिचय' }) },
    { id: 'section-2', label: ml({ en: 'Astronomy', hi: 'खगोल' }) },
    { id: 'section-3', label: ml({ en: 'Dignities', hi: 'गरिमा' }) },
    { id: 'section-4', label: ml({ en: 'Axis', hi: 'धुरी' }) },
    { id: 'section-5', label: ml({ en: 'In 12 Signs', hi: '12 राशियों में' }) },
    { id: 'section-6', label: ml({ en: 'In 12 Houses', hi: '12 भावों में' }) },
    { id: 'section-7', label: ml({ en: 'Dasha', hi: 'दशा' }) },
    { id: 'section-8', label: ml({ en: 'Yogas', hi: 'योग' }) },
    { id: 'section-9', label: ml({ en: 'Practical', hi: 'व्यावहारिक' }) },
    { id: 'section-10', label: ml({ en: 'Relationships', hi: 'सम्बन्ध' }) },
    { id: 'section-11', label: ml({ en: 'Remedies', hi: 'उपाय' }) },
    { id: 'section-12', label: ml({ en: 'Mythology', hi: 'पौराणिक कथा' }) },
    { id: 'section-13', label: ml({ en: 'Modern World', hi: 'आधुनिक संसार' }) },
    { id: 'section-14', label: ml({ en: 'Antardashas', hi: 'अन्तर्दशाएँ' }) },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-rahu/15 border border-graha-rahu/30 mb-4">
          <span className="text-4xl">&#9738;</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Rahu — The North Lunar Node', hi: 'राहु — उत्तर चन्द्र पात' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The shadow planet of obsession, illusion, and worldly desire. Chhaya Graha — the headless demon who eternally chases the luminaries. Always retrograde, always amplifying, always pushing the soul toward its karmic destiny.', hi: 'जुनून, माया और सांसारिक इच्छा का छाया ग्रह। छायाग्रह — बिना सिर का दैत्य जो शाश्वत रूप से ज्योतियों का पीछा करता है। सदा वक्री, सदा विस्तारक, सदा आत्मा को कार्मिक नियति की ओर धकेलता है।' })}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-graha-rahu/10 border border-graha-rahu/20 text-sm text-text-secondary">
          {ml({ en: 'Always Retrograde | Chhaya Graha (Shadow Planet) | No Physical Body', hi: 'सदा वक्री | छाया ग्रह | कोई भौतिक शरीर नहीं' })}
        </div>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Rahu is a Chhaya Graha (shadow planet) — it has no physical body, no mass, no light of its own. It is the mathematical point where the Moon\'s ascending orbital path crosses the ecliptic (the Sun\'s apparent path). Despite being a mere point in space, Rahu is one of the most powerful forces in Vedic astrology. Rahu is the great amplifier — whatever sign, house, or planet it touches, it magnifies obsessively. It represents the unfulfilled desires of past lives, the karmic hunger that drives the soul forward. Rahu is the head without a body — all appetite, no digestion. It craves endlessly but can never be satisfied.', hi: 'राहु एक छाया ग्रह है — इसका कोई भौतिक शरीर, द्रव्यमान या स्वयं का प्रकाश नहीं। यह वह गणितीय बिन्दु है जहाँ चन्द्र की आरोही कक्षा क्रान्तिवृत्त को काटती है। अन्तरिक्ष में मात्र एक बिन्दु होने के बावजूद, राहु वैदिक ज्योतिष की सबसे शक्तिशाली शक्तियों में से एक है। राहु महान विस्तारक है — जिस राशि, भाव या ग्रह को छूता है, जुनूनी रूप से बढ़ाता है। यह पूर्व जन्मों की अतृप्त इच्छाओं, कार्मिक भूख का प्रतिनिधित्व करता है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-graha-rahu/15 p-3">
              <span className="text-graha-rahu text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala (Shadow Planets)" />
      </LessonSection>

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <div className="space-y-4">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
              <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{key === 'nodalCycle' ? ml({ en: '18.6-Year Nodal Cycle', hi: '18.6 वर्ष का पात चक्र' }) : key === 'eclipseMechanism' ? ml({ en: 'Eclipse Mechanism', hi: 'ग्रहण तन्त्र' }) : key === 'meanVsTrue' ? ml({ en: 'Mean Node vs. True Node', hi: 'मध्य पात बनाम सत्य पात' }) : ml({ en: 'Always Retrograde — The Natural State', hi: 'सदा वक्री — स्वाभाविक अवस्था' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Ch. 2 — True Motions of Nodes" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'Rahu\'s dignities are debated among classical authorities. Unlike the seven visible planets, Rahu has no universally agreed-upon own sign. The Parashari tradition places exaltation in Taurus and debilitation in Scorpio, while some Jaimini scholars argue for Gemini and Sagittarius respectively. What is universally agreed: Rahu functions like Saturn — it is disciplined, strategic, and patient when well-placed, and chaotic, deceptive, and destructive when afflicted. Rahu is ALWAYS retrograde in the true node system — this is its natural state, not an affliction.', hi: 'राहु की गरिमाएँ शास्त्रीय आचार्यों में विवादित हैं। सात दृश्य ग्रहों के विपरीत, राहु की कोई सर्वसम्मत स्वराशि नहीं। पराशरी परम्परा उच्च वृषभ में और नीच वृश्चिक में रखती है, जबकि कुछ जैमिनी विद्वान मिथुन और धनु का तर्क देते हैं। सर्वसम्मत: राहु शनि की भाँति कार्य करता है। राहु सत्य पात प्रणाली में सदा वक्री है — यह इसकी स्वाभाविक स्थिति है।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-graha-rahu/15 p-3">
              <span className="text-graha-rahu text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Uccha-Neecha of Chhaya Grahas" author="Maharishi Parashara" />
      </LessonSection>

      {/* ── 3. The Rahu-Ketu Axis ── */}
      <LessonSection number={next()} title={ml({ en: 'The Rahu-Ketu Axis — The Karmic Highway', hi: 'राहु-केतु धुरी — कार्मिक राजमार्ग' })}>
        <p style={bf}>{ml({ en: 'Rahu and Ketu are never separate — they are always exactly 180 degrees apart, forming a single axis of karmic destiny. Rahu represents where the soul is going (the future, unfulfilled desires, what it craves), while Ketu represents where the soul has been (the past, mastered skills, what it has already experienced). The sign axis they occupy defines the fundamental life tension of the incarnation:', hi: 'राहु और केतु कभी अलग नहीं — वे सदा ठीक 180 अंश पर, कार्मिक नियति की एक धुरी बनाते हैं। राहु प्रतिनिधित्व करता है आत्मा कहाँ जा रही है (भविष्य, अतृप्त इच्छाएँ), जबकि केतु प्रतिनिधित्व करता है आत्मा कहाँ रही है (भूत, निपुण कौशल)। उनकी राशि धुरी अवतार का मूल जीवन तनाव परिभाषित करती है:' })}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[
            { axis: { en: 'Aries-Libra', hi: 'मेष-तुला' }, theme: { en: 'Self vs. Partnership', hi: 'स्व बनाम साझेदारी' } },
            { axis: { en: 'Taurus-Scorpio', hi: 'वृषभ-वृश्चिक' }, theme: { en: 'Security vs. Transformation', hi: 'सुरक्षा बनाम परिवर्तन' } },
            { axis: { en: 'Gemini-Sagittarius', hi: 'मिथुन-धनु' }, theme: { en: 'Information vs. Wisdom', hi: 'सूचना बनाम ज्ञान' } },
            { axis: { en: 'Cancer-Capricorn', hi: 'कर्क-मकर' }, theme: { en: 'Emotional Roots vs. Worldly Ambition', hi: 'भावनात्मक जड़ें बनाम सांसारिक महत्वाकांक्षा' } },
            { axis: { en: 'Leo-Aquarius', hi: 'सिंह-कुम्भ' }, theme: { en: 'Personal Glory vs. Collective Service', hi: 'व्यक्तिगत यश बनाम सामूहिक सेवा' } },
            { axis: { en: 'Virgo-Pisces', hi: 'कन्या-मीन' }, theme: { en: 'Analytical Mastery vs. Spiritual Surrender', hi: 'विश्लेषणात्मक निपुणता बनाम आध्यात्मिक समर्पण' } },
          ].map((a, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/15 rounded-xl p-4">
              <span className="text-graha-rahu font-bold text-sm" style={hf}>{ml(a.axis)}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(a.theme)}</p>
            </div>
          ))}
        </div>
        <p style={bf} className="mt-4 text-text-secondary text-sm">{ml({ en: 'The nodal axis transits through the zodiac in approximately 18.6 years, spending about 18 months in each sign pair. Each transit activates the karmic themes of that axis for the entire world, while also triggering personal transformations based on where it falls in your birth chart.', hi: 'पात धुरी लगभग 18.6 वर्षों में राशिचक्र से गुजरती है, प्रत्येक राशि जोड़ी में लगभग 18 महीने बिताती है। प्रत्येक गोचर पूरे विश्व के लिए उस धुरी के कार्मिक विषयों को सक्रिय करता है, साथ ही आपकी जन्म कुण्डली में इसकी स्थिति के अनुसार व्यक्तिगत परिवर्तन भी लाता है।' })}</p>
        <ClassicalReference shortName="BPHS" chapter="Ch. 26 — Dasha Effects of Rahu-Ketu" />
      </LessonSection>

      {/* ── 4. Rahu in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Rahu in the Twelve Signs', hi: 'बारह राशियों में राहु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu\'s sign placement shows where the soul obsessively craves experience in this lifetime. Remember: wherever Rahu sits, Ketu sits in the opposite sign — so every Rahu placement must be read as half of an axis. Rahu amplifies the qualities of its sign beyond normal limits, creating both extraordinary potential and dangerous excess.', hi: 'राहु की राशि स्थिति दिखाती है कि आत्मा इस जन्म में कहाँ जुनूनी रूप से अनुभव चाहती है। स्मरण रहे: जहाँ राहु बैठता है, विपरीत राशि में केतु बैठता है — अतः प्रत्येक राहु स्थिति को धुरी के अर्ध भाग के रूप में पढ़ना चाहिए।' })}</p>
        {RAHU_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity.includes('Co-ruler') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-graha-rahu/10 border-graha-rahu/30 text-graha-rahu'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 5. Rahu in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Rahu in the Twelve Houses', hi: 'बारह भावों में राहु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines which area of life Rahu obsessively drives expansion. Rahu in Upachaya houses (3rd, 6th, 10th, 11th) is considered highly beneficial — the amplification energy works positively in houses that improve over time. Rahu in Kendra (1st, 4th, 7th, 10th) gives visible worldly impact. In Dusthana (6th, 8th, 12th) the results are mixed but can be powerful for overcoming obstacles and spiritual transformation.', hi: 'भाव स्थिति निर्धारित करती है कि राहु जीवन के किस क्षेत्र में जुनूनी विस्तार करता है। उपचय भावों (3, 6, 10, 11) में राहु अत्यन्त लाभकारी माना जाता है। केन्द्र (1, 4, 7, 10) में प्रत्यक्ष सांसारिक प्रभाव। दुस्थान (6, 8, 12) में मिश्रित किन्तु शक्तिशाली।' })}</p>
        {RAHU_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-rahu/15 border border-graha-rahu/30 flex items-center justify-center text-graha-rahu text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Shadow Planets in Houses)" />
      </LessonSection>

      {/* ── 6. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Rahu Mahadasha (18 Years)', hi: 'राहु महादशा (18 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Rahu Dasha', hi: 'बलवान राहु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongResult)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Rahu Dasha', hi: 'दुर्बल राहु दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakResult)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Notable Yogas ── */}
      <LessonSection number={next()} title={ml({ en: 'Notable Rahu Yogas', hi: 'राहु के प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu participates in some of the most dramatic yogas in Jyotish — from the feared Grahan Yoga and Kala Sarpa to the transformative Guru Chandal. These combinations reveal whether Rahu functions as a cosmic accelerator of ambition or a source of karmic chaos.', hi: 'राहु ज्योतिष के कुछ सबसे नाटकीय योगों में भाग लेता है — भयंकर ग्रहण योग और काल सर्प से लेकर परिवर्तनकारी गुरु चाण्डाल तक। ये संयोग प्रकट करते हैं कि राहु महत्वाकांक्षा का ब्रह्माण्डीय त्वरक या कार्मिक अराजकता का स्रोत है।' })}</p>
        <div className="space-y-4">
          {NOTABLE_YOGAS.map((yoga, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-5">
              <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(yoga.name)}</h4>
              <p className="text-graha-rahu text-xs mb-2" style={bf}>{ml(yoga.condition)}</p>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(yoga.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 26 — Rahu Yoga Phala" />
      </LessonSection>

      {/* ── 9. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application — Navigating Rahu', hi: 'व्यावहारिक अनुप्रयोग — राहु को नेविगेट करना' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu\'s 18-year dasha and 18-month sign transits are among the most intense periods in Vedic astrology. Understanding when Rahu gives wealth vs. chaos — and how to survive Rahu Mahadasha — is essential practical knowledge for every astrology student.', hi: 'राहु की 18-वर्षीय दशा और 18-महीने की राशि गोचर वैदिक ज्योतिष की सबसे तीव्र अवधियों में हैं। राहु कब धन देता है बनाम अराजकता — और राहु महादशा में कैसे उत्तरजीवी रहें — हर ज्योतिष छात्र के लिए आवश्यक व्यावहारिक ज्ञान है।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-5">
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Rahu Mahadasha Survival Guide', hi: 'राहु महादशा उत्तरजीविता मार्गदर्शिका' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.rahuDashaSurvival)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-5">
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'When Does Rahu Give Wealth vs. Chaos?', hi: 'राहु कब धन देता है बनाम अराजकता?' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.wealthVsChaos)}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions — Rahu is NOT Always Malefic', hi: 'सामान्य भ्रान्तियाँ — राहु सदा पापी नहीं' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 10. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu acts as an amplifier for any planet it conjoins — but the nature of that amplification depends on whether the planet is Rahu\'s friend or enemy. Friendly conjunctions produce extraordinary results; enemy conjunctions create volatile, unpredictable situations. Rahu\'s aspects (5th, 7th, 9th from itself per some traditions) also carry this amplification energy.', hi: 'राहु किसी भी ग्रह के साथ युत होने पर विस्तारक का कार्य करता है — किन्तु विस्तार की प्रकृति मित्रता या शत्रुता पर निर्भर करती है। मित्र युति असाधारण परिणाम देती है; शत्रु युति अस्थिर, अप्रत्याशित स्थितियाँ बनाती है।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-graha-rahu/15 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  ml(r.relation).includes('Axis') ? 'bg-graha-rahu/10 border-graha-rahu/30 text-graha-rahu' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri (Shadow Planets)" />
      </LessonSection>

      {/* ── 8. Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Rahu', hi: 'राहु के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu remedies are prescribed when Rahu is poorly placed, afflicting key houses, or during a difficult Rahu Mahadasha. Important: Rahu gemstones (Gomed) AMPLIFY Rahu — only wear if Rahu is a yogakaraka for your lagna. For a malefic Rahu, worship and charity are safer than gemstones. Always consult a qualified Jyotishi before wearing Rahu\'s gemstone.', hi: 'राहु के उपाय तब निर्धारित किये जाते हैं जब राहु अशुभ स्थिति में हो, मुख्य भावों को पीड़ित कर रहा हो, या कठिन राहु महादशा चल रही हो। महत्वपूर्ण: राहु रत्न (गोमेद) राहु को बढ़ाता है — केवल तभी धारण करें जब राहु आपके लग्न का योगकारक हो। योग्य ज्योतिषी से परामर्श अनिवार्य।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-rahu/20 rounded-xl p-5 mb-4">
          <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-graha-rahu text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Hessonite Garnet (Gomed)', hi: 'रत्न — गोमेद' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Puja', hi: 'पूजा एवं उपासना' } },
          { key: 'yantra', title: { en: 'Rahu Yantra', hi: 'राहु यन्त्र' } },
          { key: 'dietary', title: { en: 'Dietary Remedies (Ahara)', hi: 'आहार उपाय' } },
          { key: 'behavioral', title: { en: 'Behavioral Remedies (Achara)', hi: 'आचार उपाय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-graha-rahu/15 p-4 mb-3">
            <h4 className="text-graha-rahu font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Rahu remedies work best when combined with behavioral awareness: recognizing when you are being driven by obsession rather than genuine need, developing contentment alongside ambition, and channeling Rahu\'s immense energy into dharmic rather than adharmic pursuits. The most powerful Rahu remedy is honest self-awareness — seeing through your own illusions.', hi: 'राहु के उपाय व्यावहारिक जागरूकता के साथ सबसे अच्छे काम करते हैं: पहचानना कि कब जुनून चला रहा है न कि वास्तविक आवश्यकता, महत्वाकांक्षा के साथ सन्तोष विकसित करना, और राहु की अपार ऊर्जा को धार्मिक कार्यों में लगाना। सबसे शक्तिशाली राहु उपाय ईमानदार आत्म-जागरूकता है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Samudra Manthan — Origin of Rahu', hi: 'समुद्र मन्थन — राहु की उत्पत्ति' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Rahu Kavach — The Protective Hymn', hi: 'राहु कवच — रक्षात्मक स्तुति' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.keyHymn)}</p>
          </div>
          <div>
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'The Full Story of Samudra Manthan', hi: 'समुद्र मन्थन की पूर्ण कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.samudraManthanFull)}</p>
          </div>
          <div>
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Why Rahu Chases the Sun and Moon', hi: 'राहु सूर्य और चन्द्र का पीछा क्यों करता है' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.whyRahuChases)}</p>
          </div>
          <div>
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Skanda Purana" chapter="Rahu Kavach" />
      </LessonSection>

      {/* ── 13. Rahu in the Modern World ── */}
      <LessonSection number={next()} title={ml({ en: 'Rahu in the Modern World', hi: 'आधुनिक संसार में राहु' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Rahu is often called the most "modern" planet in Vedic astrology because its significations align perfectly with the defining forces of the 21st century. Understanding Rahu\'s modern manifestations helps bridge classical wisdom with contemporary life.', hi: 'राहु को प्रायः वैदिक ज्योतिष में सबसे "आधुनिक" ग्रह कहा जाता है क्योंकि इसके कारकत्व 21वीं सदी की परिभाषित शक्तियों से पूर्णतः मेल खाते हैं। राहु की आधुनिक अभिव्यक्तियों को समझना शास्त्रीय ज्ञान को समकालीन जीवन से जोड़ता है।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Technology & Social Media', hi: 'प्रौद्योगिकी और सोशल मीडिया' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Rahu rules technology, artificial intelligence, social media, cryptocurrency, and virtual reality — all things that amplify human desire through illusion. Social media is pure Rahu: the construction of an idealized identity (illusion), the obsessive pursuit of followers and likes (insatiable hunger), and the blurring of truth and fiction (maya). People with strong Rahu placements often thrive in tech industries, digital marketing, and social media influence. During Rahu dasha, technology becomes either a powerful tool for advancement or a trap of addiction and distraction. The key is conscious use — Rahu technology serves beautifully when directed by dharmic intention, and destroys when driven by ego.', hi: 'राहु प्रौद्योगिकी, कृत्रिम बुद्धिमत्ता, सोशल मीडिया, क्रिप्टोकरेंसी और आभासी वास्तविकता शासित करता है — सब जो माया से मानव इच्छा बढ़ाते हैं। सोशल मीडिया शुद्ध राहु: आदर्शित पहचान का निर्माण (माया), फॉलोअर्स का जुनूनी पीछा (अतृप्त भूख), और सत्य-कल्पना का धुँधलापन। प्रबल राहु वाले प्रायः तकनीकी उद्योगों में सफल। कुंजी सचेत उपयोग — धार्मिक इरादे से निर्देशित राहु प्रौद्योगिकी सुन्दर सेवा करती है।' })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Immigration & Cross-Cultural Life', hi: 'आव्रजन और अन्तर-सांस्कृतिक जीवन' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Rahu is the primary indicator of foreign travel, immigration, and cross-cultural experience. The global Indian diaspora, international students, and expat communities are all Rahu phenomena. Rahu in the 4th house (leaving homeland), 7th house (foreign spouse), 9th house (foreign education), or 12th house (foreign settlement) often manifests as the native building a life far from their birthplace. Rahu dasha frequently triggers the first international move. The current era of globalization is a collective Rahu transit — boundaries dissolve, cultures mix, and the "foreign" becomes the new normal. For anyone analyzing immigration timing in a chart, Rahu transits and dashas are the first place to look.', hi: 'राहु विदेश यात्रा, आव्रजन और अन्तर-सांस्कृतिक अनुभव का प्रमुख संकेतक। वैश्विक भारतीय प्रवासी, अन्तर्राष्ट्रीय छात्र सब राहु घटनाएँ। 4वें भाव में राहु (मातृभूमि छोड़ना), 7वें (विदेशी जीवनसाथी), 9वें (विदेशी शिक्षा), 12वें (विदेश बसना) प्रायः जन्मभूमि से दूर जीवन निर्माण। राहु दशा प्रायः पहले अन्तर्राष्ट्रीय कदम का प्रवर्तक। वर्तमान वैश्वीकरण युग सामूहिक राहु गोचर।' })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-2" style={hf}>{ml({ en: 'Rahu and Political Power', hi: 'राहु और राजनीतिक शक्ति' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({ en: 'Rahu is the planet of politics par excellence. Where Jupiter represents the wise philosopher-king, Rahu represents the charismatic populist who rises through mass appeal, media manipulation, and unconventional strategy. Many world leaders — both benevolent and tyrannical — have dominant Rahu placements. Rahu in the 10th house is particularly associated with political success through public spectacle. Rahu conjunct the Sun (Grahan Yoga) in leaders\' charts often indicates the ability to command massive followings through personal magnetism, but also the danger of ego corruption. The Rahu politician is a boundary-breaker — they change the rules rather than play by them.', hi: 'राहु सर्वोत्कृष्ट राजनीति का ग्रह। गुरु बुद्धिमान दार्शनिक-राजा, राहु करिश्माई लोकवादी जो जनता की अपील, मीडिया हेरफेर और अपरम्परागत रणनीति से उभरता है। अनेक विश्व नेता — परोपकारी और निरंकुश दोनों — में प्रमुख राहु स्थिति। 10वें भाव में राहु विशेष रूप से सार्वजनिक तमाशे से राजनीतिक सफलता। राहु राजनेता नियम-तोड़क — नियमों से खेलने के बजाय बदलता है।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Rahu is a Chhaya Graha (shadow planet) — always retrograde, no physical body. It amplifies whatever it touches.', hi: 'राहु छाया ग्रह है — सदा वक्री, कोई भौतिक शरीर नहीं। जो छूता है उसे बढ़ाता है।' }),
        ml({ en: 'Exalted in Taurus, debilitated in Scorpio (Parashari). Functions like Saturn. No classical own sign — co-rules Aquarius per some.', hi: 'वृषभ में उच्च, वृश्चिक में नीच (पराशरी)। शनि की भाँति कार्य करता है। शास्त्रीय स्वराशि नहीं — कुछ के अनुसार कुम्भ का सह-स्वामी।' }),
        ml({ en: 'Friends: Venus, Saturn, Mercury. Enemies: Sun, Moon, Mars. Rahu-Ketu axis defines the soul\'s karmic direction.', hi: 'मित्र: शुक्र, शनि, बुध। शत्रु: सूर्य, चन्द्र, मंगल। राहु-केतु धुरी आत्मा की कार्मिक दिशा परिभाषित करती है।' }),
        ml({ en: 'Mahadasha: 18 years (longest). Best in upachaya houses (3/6/10/11). Remedy: Gomed gemstone (with caution), Durga worship, Rahu Kavach.', hi: 'महादशा: 18 वर्ष (सबसे लम्बी)। उपचय भावों (3/6/10/11) में सर्वोत्तम। उपाय: गोमेद (सावधानी से), दुर्गा पूजा, राहु कवच।' }),
      ]} />

      {/* ── 14. Rahu Antardasha Phases ── */}
      <LessonSection number={next()} title={ml({ en: 'Rahu Mahadasha — Key Antardashas', hi: 'राहु महादशा — मुख्य अन्तर्दशाएँ' })}>
        <p style={bf} className="mb-4">{ml({
          en: 'The 18-year Rahu Mahadasha unfolds through 9 antardashas (sub-periods). The most critical ones determine whether Rahu dasha brings spectacular success or chaotic downfall. Understanding the key sub-periods helps navigation.',
          hi: '18-वर्षीय राहु महादशा 9 अन्तर्दशाओं (उप-अवधियों) से प्रकट होती है। सबसे महत्वपूर्ण निर्धारित करती हैं कि राहु दशा शानदार सफलता या अराजक पतन लाती है। मुख्य उप-अवधियों को समझना नेविगेशन में सहायता करता है।'
        })}</p>
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-1" style={hf}>
              {ml({ en: 'Rahu-Rahu (2 years 8 months) — Opening Intensity', hi: 'राहु-राहु (2 वर्ष 8 माह) — प्रारम्भिक तीव्रता' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'The opening sub-period sets the tone for the entire 18 years. Rahu\'s themes crystallize: obsessive desire, foreign connections, technology involvement, and unconventional paths. This period is often disorienting — the native feels pulled in directions that make no logical sense. New career directions emerge. Relocation is common. The key: don\'t resist the change, but verify every "opportunity" carefully — Rahu-Rahu is notorious for presenting mirages alongside genuine openings.',
              hi: 'प्रारम्भिक उप-अवधि पूरे 18 वर्षों का स्वर तय करती है। राहु के विषय स्पष्ट: जुनूनी इच्छा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग। यह अवधि प्रायः भ्रमित करने वाली। नए करियर दिशा उभरती। स्थानान्तरण सामान्य। कुंजी: परिवर्तन का विरोध न करें, किन्तु हर "अवसर" सावधानी से सत्यापित करें।'
            })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-1" style={hf}>
              {ml({ en: 'Rahu-Jupiter (2 years 5 months) — Expansion or Excess', hi: 'राहु-गुरु (2 वर्ष 5 माह) — विस्तार या अतिरेक' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'Jupiter\'s sub-period within Rahu dasha can bring either spectacular expansion (education, foreign travel, spiritual growth, wealth) or dangerous over-extension. Guru Chandal themes activate — unconventional philosophy, foreign gurus, and religious exploration. If Jupiter is strong in the natal chart, this sub-period often marks the biggest career advancement and financial gains of the entire Rahu dasha. If Jupiter is weak, watch for hubris, over-promising, and getting involved with questionable spiritual/educational institutions.',
              hi: 'राहु दशा में गुरु की अन्तर्दशा शानदार विस्तार (शिक्षा, विदेश यात्रा, आध्यात्मिक विकास, धन) या खतरनाक अति-विस्तार ला सकती है। गुरु चाण्डाल विषय सक्रिय। यदि गुरु जन्म कुण्डली में बलवान, यह अन्तर्दशा प्रायः पूरी राहु दशा की सबसे बड़ी करियर उन्नति। यदि गुरु दुर्बल, अहंकार और संदिग्ध संस्थाओं से सावधान।'
            })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-1" style={hf}>
              {ml({ en: 'Rahu-Saturn (2 years 10 months) — The Karmic Pressure Cooker', hi: 'राहु-शनि (2 वर्ष 10 माह) — कार्मिक प्रेशर कुकर' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'The final major sub-period of Rahu dasha. Shrapit Yoga themes intensify — karmic debts come due, chronic obstacles resurface, and the native faces the accumulated consequences of choices made during the dasha. This is often the most challenging sub-period. However, for those who used the dasha well, Rahu-Saturn brings institutional recognition, government connections, and long-term structural achievements. Saturn demands accountability for everything Rahu attempted during the preceding years. The transition out of Rahu dasha into Jupiter dasha (if next) often feels like emerging from a tunnel into daylight.',
              hi: 'राहु दशा की अन्तिम प्रमुख अन्तर्दशा। श्रापित योग विषय तीव्र — कार्मिक ऋण देय, दीर्घकालिक बाधाएँ पुनः सतह। प्रायः सबसे चुनौतीपूर्ण अन्तर्दशा। किन्तु जिन्होंने दशा अच्छी उपयोग की, राहु-शनि संस्थागत मान्यता और दीर्घकालिक संरचनात्मक उपलब्धियाँ। शनि पूर्ववर्ती वर्षों में राहु के प्रयासों की जवाबदेही माँगता है।'
            })}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-rahu/12 rounded-xl p-4">
            <h4 className="text-graha-rahu font-bold text-sm mb-1" style={hf}>
              {ml({ en: 'Rahu-Mercury (2 years 7 months) — Technology & Communication', hi: 'राहु-बुध (2 वर्ष 7 माह) — प्रौद्योगिकी और संवाद' })}
            </h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml({
              en: 'Mercury is Rahu\'s friend — this sub-period often brings the most productive professional results. Technology ventures, communication projects, media presence, and intellectual achievements peak. Business deals, contracts, and partnerships involving foreign elements flourish. Writing, publishing, and digital content creation are especially favored. The native\'s social media presence or digital business may explode during this period. Mind stays sharp and strategic. Good for starting tech companies, writing books, or building information-based businesses.',
              hi: 'बुध राहु का मित्र — यह अन्तर्दशा प्रायः सबसे उत्पादक व्यावसायिक परिणाम। प्रौद्योगिकी उपक्रम, संचार परियोजनाएँ, मीडिया उपस्थिति और बौद्धिक उपलब्धियाँ शिखर। विदेशी तत्वों वाले व्यापारिक सौदे फलते-फूलते। लेखन, प्रकाशन और डिजिटल सामग्री विशेष अनुकूल। सोशल मीडिया या डिजिटल व्यवसाय विस्फोट कर सकता है। तकनीकी कम्पनियाँ शुरू करने के लिए अच्छा।'
            })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Quick Reference Table ── */}
      <div className="mt-12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-rahu/15 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-sm mb-4" style={hf}>
          {ml({ en: 'Rahu Quick Reference', hi: 'राहु त्वरित सन्दर्भ' })}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Nodal Cycle', hi: 'पात चक्र' })}</span>
            <span className="text-text-primary" style={bf}>18.61 {ml({ en: 'years', hi: 'वर्ष' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Dasha Duration', hi: 'दशा अवधि' })}</span>
            <span className="text-text-primary" style={bf}>18 {ml({ en: 'years', hi: 'वर्ष' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Motion', hi: 'गति' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Always Retrograde', hi: 'सदा वक्री' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Sign Duration', hi: 'राशि अवधि' })}</span>
            <span className="text-text-primary" style={bf}>~18 {ml({ en: 'months/sign', hi: 'माह/राशि' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Exaltation', hi: 'उच्च' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Taurus 20°', hi: 'वृषभ 20°' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Debilitation', hi: 'नीच' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Scorpio 20°', hi: 'वृश्चिक 20°' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Gemstone', hi: 'रत्न' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Hessonite (Gomed)', hi: 'गोमेद' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Day', hi: 'दिन' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Saturday', hi: 'शनिवार' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Best Houses', hi: 'सर्वोत्तम भाव' })}</span>
            <span className="text-text-primary" style={bf}>3, 6, 10, 11</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Functions Like', hi: 'जैसा कार्य करता है' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Saturn', hi: 'शनि' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Nakshatra Lordship', hi: 'नक्षत्र स्वामित्व' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'Ardra, Swati, Shatabhisha', hi: 'आर्द्रा, स्वाति, शतभिषा' })}</span>
          </div>
          <div className="bg-bg-primary/30 rounded-lg p-3">
            <span className="text-gold-dark text-xs block mb-1">{ml({ en: 'Eclipse Type', hi: 'ग्रहण प्रकार' })}</span>
            <span className="text-text-primary" style={bf}>{ml({ en: 'At Ascending Node', hi: 'आरोही पात पर' })}</span>
          </div>
        </div>
      </div>

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
      <SectionNav sections={SECTIONS} />
    </main>
  );
}
