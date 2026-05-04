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
  { devanagari: 'मंगल', transliteration: 'Maṅgala', meaning: { en: 'The auspicious one — Mars, the warrior planet', hi: 'शुभ — मंगल, योद्धा ग्रह' } },
  { devanagari: 'भूमिपुत्र', transliteration: 'Bhūmiputra', meaning: { en: 'Son of the Earth', hi: 'पृथ्वी का पुत्र' } },
  { devanagari: 'कुज', transliteration: 'Kuja', meaning: { en: 'Born from the earth (Ku = Earth)', hi: 'भूमि से उत्पन्न (कु = पृथ्वी)' } },
  { devanagari: 'अंगारक', transliteration: 'Aṅgāraka', meaning: { en: 'The burning coal, the fiery one', hi: 'अंगार जैसा, अग्निमय' } },
  { devanagari: 'लोहितांग', transliteration: 'Lohitāṅga', meaning: { en: 'The red-bodied one', hi: 'लाल शरीर वाले' } },
  { devanagari: 'सेनापति', transliteration: 'Senāpati', meaning: { en: 'Commander of the celestial army', hi: 'देव सेना के सेनापति' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Capricorn (Makara) — deepest exaltation at 28°', hi: 'मकर — 28° पर परम उच्च' },
  debilitation: { en: 'Cancer (Karka) — deepest debilitation at 28°', hi: 'कर्क — 28° पर परम नीच' },
  ownSign: { en: 'Aries (Mesha) & Scorpio (Vrishchika)', hi: 'मेष एवं वृश्चिक' },
  moolatrikona: { en: 'Aries 0°–12°', hi: 'मेष 0°–12°' },
  friends: { en: 'Sun, Moon, Jupiter', hi: 'सूर्य, चन्द्र, गुरु' },
  enemies: { en: 'Mercury', hi: 'बुध' },
  neutral: { en: 'Venus, Saturn', hi: 'शुक्र, शनि' },
};

// ─── Astronomical Profile ──────────────────────────────────────────────
const ASTRONOMICAL = {
  orbitalPeriod: { en: 'Sidereal orbital period: ~687 days (approximately 1.88 years). Mars takes nearly two years to complete one orbit around the Sun, spending roughly 45-60 days in each sign depending on whether it is direct or retrograde. This means Mars transits are relatively slow and impactful — unlike the Moon which changes signs every 2.25 days, a Mars transit through a sign is felt for weeks. Mars enters and exits signs at predictable intervals, making its transits important for timing property transactions, surgeries, and competitive endeavors.', hi: 'नाक्षत्रिक कक्षीय अवधि: ~687 दिन (लगभग 1.88 वर्ष)। मंगल को सूर्य की एक परिक्रमा पूर्ण करने में लगभग दो वर्ष लगते हैं, प्रत्येक राशि में लगभग 45-60 दिन मार्गी या वक्री के अनुसार। मंगल गोचर अपेक्षाकृत धीमे और प्रभावशाली — सम्पत्ति लेन-देन, शल्य और प्रतिस्पर्धी प्रयासों के समय निर्धारण के लिए महत्त्वपूर्ण।' },
  dailyMotion: { en: 'Average daily motion: ~0°31\'27" (about half a degree per day when direct). Mars\'s daily motion varies more dramatically than any other visible planet — from about 0°40\' at its fastest (when direct and near perihelion) to apparent standstill during retrograde stations, and up to -0°24\' when retrograde. This variability reflects Mars\'s astrological nature: sometimes charging forward with unstoppable momentum, sometimes stalling in frustration, sometimes retreating to regroup. The speed of Mars at birth in your chart affects how quickly its significations manifest.', hi: 'औसत दैनिक गति: ~0°31\'27" (मार्गी में प्रतिदिन लगभग आधा अंश)। मंगल की दैनिक गति किसी भी दृश्य ग्रह से अधिक नाटकीय रूप से बदलती है — सबसे तीव्र ~0°40\' से वक्री में स्थिर, और वक्री में -0°24\' तक। यह परिवर्तनशीलता मंगल के ज्योतिषीय स्वभाव को दर्शाती है: कभी अजेय गति से आगे, कभी निराशा में रुकना, कभी पीछे हटना।' },
  synodicPeriod: { en: 'Synodic period: ~779.9 days (approximately 2 years and 50 days). This is the time between successive Mars-Sun conjunctions as seen from Earth. Mars is the only planet whose synodic period is significantly longer than its orbital period. Every ~2 years, Mars reaches opposition (directly opposite the Sun), appearing brightest and closest to Earth — this is when Mars is at its most powerful astrologically and often correlates with periods of heightened aggression, conflict, and energy in mundane astrology.', hi: 'आवर्तन काल: ~779.9 दिन (लगभग 2 वर्ष 50 दिन)। पृथ्वी से देखे गए क्रमिक मंगल-सूर्य युतियों का अन्तराल। प्रत्येक ~2 वर्ष में मंगल प्रतिपक्ष (सूर्य के ठीक विपरीत) पहुँचता है, सबसे चमकीला और निकटतम — यह ज्योतिषीय रूप से सबसे शक्तिशाली और सांसारिक ज्योतिष में आक्रामकता, संघर्ष और ऊर्जा की अवधि।' },
  retrograde: { en: 'Retrograde: Every ~26 months, lasting about 58-81 days. Mars retrogrades less frequently than any other true planet, making each Mars retrograde period particularly significant. During retrograde, Mars\'s energy turns inward — anger becomes frustration, initiative becomes procrastination, and external conflicts become internal wrestling. Surgeries should be avoided during Mars retrograde if possible. Military campaigns and property transactions initiated during Mars retrograde tend to face unexpected reversals. However, retrograde Mars is excellent for revisiting unfinished physical projects, resolving old conflicts, and internal martial arts practice.', hi: 'वक्री गति: प्रत्येक ~26 माह, लगभग 58-81 दिन। मंगल किसी भी वास्तविक ग्रह से कम बार वक्री होता है, प्रत्येक अवधि विशेष रूप से महत्त्वपूर्ण। वक्री में मंगल ऊर्जा अन्तर्मुखी — क्रोध निराशा, पहल विलम्ब, बाह्य संघर्ष आन्तरिक कुश्ती बन जाते हैं। सम्भव हो तो वक्री में शल्य से बचें। सम्पत्ति लेन-देन में अप्रत्याशित उलटफेर।' },
  combustion: { en: 'Combustion: Mars becomes combust when within 17° of the Sun. A combust Mars loses its independent courage and initiative — the native\'s aggression becomes subservient to ego (Sun) rather than directed by practical necessity. Combust Mars can indicate: father who suppresses the native\'s independence, inability to stand up for oneself despite having the energy to do so, and anger that simmers internally rather than being expressed healthily. In mundane astrology, combust Mars can correlate with military forces controlled by dictatorial leadership rather than acting on strategic necessity.', hi: 'अस्त: मंगल सूर्य से 17° के भीतर अस्त होता है। अस्त मंगल स्वतन्त्र साहस और पहल खो देता है — जातक की आक्रामकता व्यावहारिक आवश्यकता के बजाय अहंकार (सूर्य) के अधीन। अस्त मंगल: पिता जो स्वतन्त्रता दबाए, ऊर्जा होने पर भी अपने लिए खड़े न हो पाना, क्रोध जो आन्तरिक रूप से सुलगता रहे।' },
  astroVsAstrol: { en: 'Astronomically, Mars is the fourth planet from the Sun with a diameter of 6,779 km — roughly half the Earth\'s size. Its distinctive red color comes from iron oxide (rust) on its surface, which perfectly aligns with the Jyotish association of Mars with iron (Loha), blood (Rakta), and the color red. Mars has two small moons — Phobos (Fear) and Deimos (Terror) — named after the Greek god of war\'s attendants, echoing the Vedic understanding of Mars as Bhayankara (the terrifying one). The planet\'s thin atmosphere and barren landscape mirror Mars\'s astrological nature: stripped of comfort, focused on survival, raw and unforgiving.', hi: 'खगोलीय रूप से मंगल सूर्य से चौथा ग्रह, व्यास 6,779 किमी — पृथ्वी का लगभग आधा। विशिष्ट लाल रंग सतह पर आयरन ऑक्साइड (जंग) से — ज्योतिषीय सम्बन्ध लोहा, रक्त और लाल रंग से पूर्णतः मेल। दो छोटे चन्द्रमा फोबोस (भय) और डीमोस (आतंक) — वैदिक समझ "भयंकर" की प्रतिध्वनि। विरल वातावरण और बंजर भूदृश्य मंगल के ज्योतिषीय स्वभाव का दर्पण।' },
};

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  assessStrength: { en: 'To assess Mars\'s strength in your chart, check these factors: (1) Sign placement — exalted in Capricorn, own signs Aries/Scorpio, debilitated in Cancer. (2) House placement — Mars is strongest in the 10th house (Digbala) and in upachaya houses (3, 6, 10, 11) where it improves over time. (3) Aspects — Jupiter\'s aspect tempers aggression with wisdom; Saturn\'s creates frustrated energy. (4) Retrograde status — retrograde Mars at birth can indicate suppressed anger or internalized aggression. (5) Nakshatra — Mrigashira, Chitra, and Dhanishtha are Mars-ruled nakshatras where Mars feels most natural. (6) Manglik status — Mars in 1/2/4/7/8/12 from lagna and Moon creates Manglik Dosha affecting marriage.', hi: 'कुण्डली में मंगल बल का आकलन: (1) राशि — मकर में उच्च, मेष/वृश्चिक स्वराशि, कर्क में नीच। (2) भाव — 10वें में दिग्बल, उपचय (3, 6, 10, 11) में समय के साथ सुधरता। (3) दृष्टि — गुरु की दृष्टि आक्रामकता को ज्ञान से संयमित; शनि की निराशाजनक ऊर्जा। (4) वक्री — जन्म पर वक्री दबा हुआ क्रोध। (5) नक्षत्र — मृगशिरा, चित्रा, धनिष्ठा मंगल-शासित। (6) मांगलिक — लग्न और चन्द्र से 1/2/4/7/8/12 में।' },
  strongIndicators: { en: 'Signs of a strong Mars in your life: You take initiative naturally — when problems arise, you act rather than wait. Physical energy is abundant and you enjoy exercise or sports. Courage comes easily; you don\'t back down from necessary confrontations. Property matters resolve favorably. Siblings are supportive or successful. Competitive situations energize rather than intimidate you. Recovery from illness or surgery is quick. You have natural mechanical or engineering aptitude. Anger is expressed cleanly and dissipates quickly rather than festering.', hi: 'बलवान मंगल के संकेत: स्वाभाविक रूप से पहल — समस्या पर प्रतीक्षा नहीं, कर्म। प्रचुर शारीरिक ऊर्जा और व्यायाम/खेल में आनन्द। साहस सहज; आवश्यक टकराव से पीछे नहीं हटना। सम्पत्ति मामले अनुकूल। भाई-बहन सहायक। प्रतिस्पर्धा उत्साहित करती है। बीमारी/शल्य से शीघ्र स्वास्थ्य लाभ। यान्त्रिक योग्यता। क्रोध स्वच्छ रूप से प्रकट और शीघ्र शान्त।' },
  weakIndicators: { en: 'Signs of a weak Mars: Chronic passivity — unable to assert yourself even when boundaries are violated. Physical lethargy, low stamina, and frequent illnesses. Property disputes that drag on without resolution. Sibling relationships are strained or absent. Accident-prone but in a victim pattern (things happen TO you rather than you causing them). Suppressed anger that manifests as passive-aggression, resentment, or psychosomatic illness. Blood pressure issues, anemia, or inflammatory conditions. Inability to start or complete physical projects. Fear of conflict even when conflict is necessary for justice.', hi: 'दुर्बल मंगल के संकेत: दीर्घकालिक निष्क्रियता — सीमा उल्लंघन पर भी स्वयं को स्थापित न कर पाना। शारीरिक सुस्ती, कम सहनशक्ति। सम्पत्ति विवाद जो लटके रहें। भाई-बहन सम्बन्ध तनावपूर्ण। दुर्घटना-प्रवण किन्तु पीड़ित पैटर्न। दबा हुआ क्रोध — निष्क्रिय-आक्रामकता या मनोदैहिक रोग। रक्तचाप, रक्ताल्पता, सूजन। संघर्ष का भय।' },
  whenToRemediate: { en: 'Seek remedies when: Mars is debilitated (in Cancer), combust, retrograde and afflicted, in trikasthana (6/8/12) causing health/legal issues, or when Manglik Dosha is affecting marriage prospects. Also during Mars Mahadasha if Mars is poorly placed. Do NOT seek Mars remedies when: Mars is exalted, in own sign, Digbali in the 10th, or strong in upachaya houses — strengthening an already-strong Mars can increase aggression, accident risk, rash behavior, and conflicts. Mars energy should be CHANNELED, not amplified, when it is already strong. Physical exercise, competitive sports, and martial arts are the best outlets for excess Mars energy.', hi: 'उपाय कब: मंगल नीच (कर्क), अस्त, वक्री और पीड़ित, त्रिकस्थान (6/8/12) में स्वास्थ्य/कानूनी समस्या, मांगलिक दोष विवाह प्रभावित कर रहा हो। पीड़ित मंगल महादशा में। उपाय कब नहीं: उच्च, स्वराशि, 10वें में दिग्बली — बलवान मंगल को और बल देना आक्रामकता, दुर्घटना जोखिम बढ़ा सकता है। बलवान मंगल को बढ़ाना नहीं, निर्देशित करना चाहिए।' },
  misconceptions: { en: 'Common misconceptions about Mars: (1) "Manglik Dosha means you can\'t marry" — Wrong. Over 40% of charts have some form of Manglik placement. It means the marriage needs careful partner matching, not avoidance. (2) "Mars is always bad" — Mars in 3rd, 6th, 10th, and 11th houses gives excellent results. Mars is the planet of courage, land ownership, and protective strength. (3) "Red Coral will control anger" — Red Coral amplifies Mars energy. If Mars is already causing anger, the Coral can make it worse. (4) "Women with strong Mars are masculine" — Strong Mars gives women courage, independence, and professional success. It does not affect femininity. (5) "Mars retrograde is always terrible" — It is excellent for resolving old property disputes, completing unfinished physical projects, and internal martial arts practice.', hi: 'मंगल भ्रान्तियाँ: (1) "मांगलिक = विवाह नहीं" — 40% से अधिक कुण्डलियों में मांगलिक। सावधान मिलान आवश्यक, विवाह से बचाव नहीं। (2) "मंगल सदा अशुभ" — 3, 6, 10, 11 भावों में उत्कृष्ट। (3) "मूँगा क्रोध नियन्त्रित करेगा" — पहले से क्रोध हो तो मूँगा बढ़ा सकता है। (4) "बलवान मंगल वाली महिला पुरुषत्वपूर्ण" — बलवान मंगल साहस, स्वतन्त्रता और व्यावसायिक सफलता देता है। (5) "वक्री मंगल सदा भयंकर" — पुराने सम्पत्ति विवाद और अधूरी परियोजनाओं के लिए उत्कृष्ट।' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Younger siblings, warriors, soldiers, surgeons, police, firefighters, athletes', hi: 'छोटे भाई-बहन, योद्धा, सैनिक, शल्य चिकित्सक, पुलिस, अग्निशमन, खिलाड़ी' },
  bodyParts: { en: 'Blood, muscles, bone marrow, head, male reproductive organs, adrenal glands', hi: 'रक्त, माँसपेशियाँ, अस्थि मज्जा, मस्तक, पुरुष प्रजनन अंग, अधिवृक्क ग्रन्थि' },
  professions: { en: 'Military, surgery, engineering, real estate, mining, martial arts, sports, metalwork', hi: 'सेना, शल्य चिकित्सा, अभियान्त्रिकी, भूसम्पत्ति, खनन, युद्ध कला, खेल, धातुकर्म' },
  materials: { en: 'Red coral (Moonga), copper, iron, red lentils (masoor), red cloth, blood-red stones', hi: 'मूँगा, ताम्र, लोहा, मसूर दाल, लाल वस्त्र, रक्तवर्ण पत्थर' },
  direction: { en: 'South (Dakshina)', hi: 'दक्षिण' },
  day: { en: 'Tuesday (Mangalavara)', hi: 'मंगलवार' },
  color: { en: 'Blood red / scarlet', hi: 'रक्त लाल / सिन्दूरी' },
  season: { en: 'Grishma (Summer)', hi: 'ग्रीष्म ऋतु' },
  taste: { en: 'Bitter (Tikta)', hi: 'तिक्त (कड़वा)' },
  guna: { en: 'Tamas', hi: 'तमस्' },
  element: { en: 'Fire (Agni)', hi: 'अग्नि तत्त्व' },
  gender: { en: 'Masculine', hi: 'पुल्लिंग' },
  nature: { en: 'Malefic (Krura Graha) — cruel but courageous, destructive but protective', hi: 'क्रूर ग्रह — निर्दय किन्तु साहसी, विनाशक किन्तु रक्षक' },
};

// ─── Mars in 12 Signs ──────────────────────────────────────────────────
const MARS_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Own sign / Moolatrikona',
    effect: { en: 'Mars in its own sign and moolatrikona — the warrior in his fortress. Maximum energy, initiative, courage, and competitive drive. The native is a natural leader who thrives in crisis situations. Quick decision-making, physical strength, and fearlessness define this placement. Can be impulsive, aggressive, and accident-prone if uncontrolled. Excellent for military careers, entrepreneurship, sports, and any field requiring raw courage. The 0°-12° range (moolatrikona) gives the purest martial expression — disciplined aggression rather than blind rage.', hi: 'मंगल अपनी राशि और मूलत्रिकोण में — योद्धा अपने दुर्ग में। अधिकतम ऊर्जा, पहल, साहस और प्रतिस्पर्धी प्रेरणा। जातक स्वाभाविक नेता जो संकट में फलता-फूलता है। शीघ्र निर्णय, शारीरिक बल और निर्भयता। सेना, उद्यमिता, खेल के लिए उत्कृष्ट।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Neutral',
    effect: { en: 'Mars in Venus\'s earth sign — aggressive energy directed toward material acquisition and sensual enjoyment. The native fights for wealth, property, and physical pleasures. Stubborn determination that can bulldoze through obstacles. Good for real estate, agriculture, and food industry. The fiery planet in an earthy sign produces practical ambition rather than idealistic crusading. Can be possessive, jealous, and materialistic. Physical stamina is exceptional. May experience conflicts over money and relationships.', hi: 'शुक्र की पृथ्वी राशि में मंगल — भौतिक अर्जन और इन्द्रिय सुख की ओर निर्देशित आक्रामक ऊर्जा। धन, सम्पत्ति और भौतिक सुखों के लिए संघर्ष। हठी दृढ़ संकल्प। भूसम्पत्ति, कृषि और खाद्य उद्योग के लिए शुभ। अत्यधिक शारीरिक सहनशक्ति।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Mars in Mercury\'s sign — the sword meets the pen. Aggressive communication, sharp debating skills, and a mind that attacks problems analytically. The native is a formidable arguer and can weaponize words. Good for law, investigative journalism, technical writing, and competitive academics. Physical energy is scattered across many projects. Sibling relationships may be combative. Can be sarcastic, argumentative, and mentally restless. The hands are skilled — good for surgery, mechanical work, and martial arts that require precision.', hi: 'बुध की राशि में मंगल — तलवार और कलम का मिलन। आक्रामक संवाद, तीक्ष्ण वाद-विवाद कौशल। जातक शब्दों को हथियार बना सकता है। विधि, खोजी पत्रकारिता और तकनीकी लेखन के लिए शुभ। भाई-बहन सम्बन्ध संघर्षपूर्ण हो सकते हैं।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Debilitated',
    effect: { en: 'Mars is debilitated here — the warrior drowns in emotional waters. Aggression turns inward, producing passive-aggressive behavior, suppressed anger, and emotional volatility. The native fights for home, family, and mother but may do so destructively. The deepest fall at 28° means martial energy is most weakened when directed through emotional channels. Property disputes and domestic conflicts are common. However, Neecha Bhanga can produce fierce protectors of family and homeland — soldiers who fight from love, not anger. Cooking, agriculture, and emotional healing can channel this energy positively.', hi: 'मंगल यहाँ नीच — योद्धा भावनात्मक जल में डूबता है। आक्रामकता अन्तर्मुखी, दबा हुआ क्रोध और भावनात्मक अस्थिरता। 28° पर परम नीच। सम्पत्ति विवाद और घरेलू संघर्ष सामान्य। नीच भंग परिवार के उग्र रक्षक बना सकता है।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Friend\'s sign',
    effect: { en: 'Mars in the Sun\'s sign — the general serves the king. Courageous, dignified, and theatrically aggressive. The native fights for honor, recognition, and noble causes. Natural leadership in military, politics, and sports. Physical presence is commanding — broad-chested, strong-jawed, and magnetically intimidating. Can be arrogant, domineering, and violent when pride is wounded. Excellent for government service, performing arts, and competitive leadership. Children may be born with similar warrior qualities.', hi: 'सूर्य की राशि में मंगल — सेनापति राजा की सेवा में। साहसी, गरिमामय और नाटकीय रूप से आक्रामक। सम्मान, मान्यता और उत्तम कारणों के लिए संघर्ष। सेना, राजनीति और खेल में स्वाभाविक नेतृत्व। शारीरिक उपस्थिति आधिकारिक।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Enemy\'s sign',
    effect: { en: 'Mars in Mercury\'s earth sign — precision warfare. The native is methodical, analytical, and devastatingly efficient in conflict. Energy is channeled through detailed planning rather than impulsive action. Excellent for surgery, engineering, quality control, forensic science, and military strategy. Can be hyper-critical, anxious about health, and obsessive about perfection. Digestive fire is strong but may cause acidity. The hands are extraordinarily skilled — watchmakers, surgeons, and craftsmen with Mars in Virgo produce flawless work through disciplined practice.', hi: 'बुध की पृथ्वी राशि में मंगल — सूक्ष्म युद्ध कौशल। जातक व्यवस्थित, विश्लेषणात्मक और संघर्ष में विनाशकारी रूप से कुशल। शल्य चिकित्सा, अभियान्त्रिकी, फोरेंसिक विज्ञान और सैन्य रणनीति के लिए उत्कृष्ट। अत्यधिक आलोचनात्मक और पूर्णतावादी।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Neutral',
    effect: { en: 'Mars in Venus\'s air sign — the warrior in the court of diplomacy. Aggression is refined into assertiveness, competition into negotiation. The native fights for justice, fairness, and aesthetic ideals. Excellent for trial lawyers, union leaders, and activists. Relationships are passionate but contentious — the native both desires partnership and fights within it. Can indicate Manglik effects on marriage. Physical grace combined with combative instinct produces excellent dancers, martial artists, and fencers.', hi: 'शुक्र की वायु राशि में मंगल — कूटनीति के दरबार में योद्धा। आक्रामकता दृढ़ता में परिष्कृत, प्रतिस्पर्धा बातचीत में। न्याय और निष्पक्षता के लिए संघर्ष। मुकदमा वकीलों और कार्यकर्ताओं के लिए उत्कृष्ट। सम्बन्ध भावुक किन्तु विवादास्पद।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Own sign',
    effect: { en: 'Mars in its own water sign — the covert operative. This is the most psychologically intense Mars placement. The native fights from the shadows — strategic, patient, and devastating when they strike. Research, intelligence, surgery, tantra, and occult investigation are natural domains. Emotional intensity is extreme — grudges last forever and revenge is served ice-cold. Sexual energy is powerful and can be transmuted into spiritual practice. Secrets are both weapon and treasure. Can be manipulative, vindictive, and obsessively controlling. The most feared Mars placement by enemies.', hi: 'मंगल अपनी जल राशि में — गुप्त कार्यकर्ता। मनोवैज्ञानिक रूप से सबसे तीव्र मंगल स्थिति। छाया से लड़ता है — रणनीतिक, धैर्यवान और विनाशकारी। शोध, गुप्तचर, शल्य चिकित्सा, तन्त्र स्वाभाविक क्षेत्र। यौन ऊर्जा शक्तिशाली। शत्रुओं द्वारा सबसे भयंकर मंगल स्थिति।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Friend\'s sign',
    effect: { en: 'Mars in Jupiter\'s fire sign — the dharmic warrior, the crusader for truth. Courage is guided by moral principles and philosophical conviction. The native fights for higher ideals — religion, education, justice, and truth. Excellent for military officers with ethical codes, sports coaches, adventure guides, and religious leaders who take action. Physical energy is expansive and loves outdoor activities, horse riding, and long-distance travel. Can be fanatical, self-righteous, and preachy about beliefs.', hi: 'गुरु की अग्नि राशि में मंगल — धार्मिक योद्धा, सत्य का सेनानी। साहस नैतिक सिद्धान्तों और दार्शनिक विश्वास से निर्देशित। धर्म, शिक्षा, न्याय और सत्य के लिए संघर्ष। नैतिक सैन्य अधिकारियों, खेल प्रशिक्षकों और साहसिक मार्गदर्शकों के लिए उत्कृष्ट।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Exalted',
    effect: { en: 'Mars is exalted here — the general who wins through strategy, discipline, and patience. This is Mars at its most effective: controlled aggression, calculated risk-taking, and relentless perseverance. The native rises to the top through sheer determination and organizational skill. Government positions, corporate leadership, and military command come naturally. The deepest exaltation at 28° produces people who build empires — they plan for decades and execute with precision. Physical endurance is legendary. Can be ruthlessly ambitious and emotionally cold in pursuit of goals.', hi: 'मंगल यहाँ उच्च — रणनीति, अनुशासन और धैर्य से विजय पाने वाला सेनापति। सबसे प्रभावी मंगल: नियन्त्रित आक्रामकता, परिकलित जोखिम और अथक दृढ़ता। 28° पर परम उच्च साम्राज्य निर्माता — दशकों की योजना और सटीक क्रियान्वयन। शारीरिक सहनशक्ति अभूतपूर्व।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Neutral',
    effect: { en: 'Mars in Saturn\'s air sign — the revolutionary, the freedom fighter. Aggression is directed toward social reform, technological innovation, and breaking unjust systems. The native fights for the collective rather than personal gain. Excellent for social activists, engineers, technologists, and humanitarian workers. Energy is expressed through networks, groups, and organizations. Can be erratic, rebellious without cause, and emotionally detached from the consequences of their actions. Scientific temperament combined with warrior instinct produces innovators who disrupt industries.', hi: 'शनि की वायु राशि में मंगल — क्रान्तिकारी, स्वतन्त्रता सेनानी। सामाजिक सुधार, तकनीकी नवाचार और अन्यायपूर्ण व्यवस्थाओं को तोड़ने की ओर। सामाजिक कार्यकर्ताओं, अभियन्ताओं और मानवतावादी कार्यकर्ताओं के लिए उत्कृष्ट। उद्योगों को बदलने वाले नवप्रवर्तक।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Neutral',
    effect: { en: 'Mars in Jupiter\'s water sign — the spiritual warrior, the compassionate fighter. Aggression is softened by empathy and spiritual awareness. The native fights for the helpless, the suffering, and the forgotten. Excellent for charitable organizations, spiritual practice with physical discipline (yoga, martial arts with spiritual foundations), and creative arts that channel passionate emotion. Energy can dissipate in fantasy, escapism, or misdirected compassion. When focused, produces saints who fight injustice and artists who channel rage into beauty.', hi: 'गुरु की जल राशि में मंगल — आध्यात्मिक योद्धा, करुणामय सेनानी। सहानुभूति और आध्यात्मिक जागरूकता से कोमल आक्रामकता। असहाय, पीड़ित और भुलाये हुओं के लिए संघर्ष। दान संगठनों और आध्यात्मिक अनुशासन के लिए उत्कृष्ट।' } },
];

// ─── Mars in 12 Houses ─────────────────────────────────────────────────
const MARS_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Powerful physical presence — athletic build, scars or marks on the head/face, and a combative personality. The native is courageous, self-driven, and naturally dominant. Quick temper but equally quick action. Mars in the 1st is one of the Manglik placements affecting marriage — the native\'s intensity can overwhelm partners. Excellent for sports, military, entrepreneurship, and any field requiring personal initiative. Health is generally robust but prone to fevers, accidents, and blood-related conditions. The native leads from the front.', hi: 'शक्तिशाली शारीरिक उपस्थिति — खिलाड़ी जैसी काया, मस्तक/चेहरे पर निशान, संघर्षशील व्यक्तित्व। साहसी, स्वप्रेरित और स्वाभाविक रूप से प्रभावी। शीघ्र क्रोध किन्तु शीघ्र कर्म। मांगलिक स्थिति — विवाह प्रभावित। खेल, सेना, उद्यमिता के लिए उत्कृष्ट।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Aggressive wealth accumulation and harsh speech. The native earns through courage, competition, and forceful action — real estate, military contracting, surgery, or engineering. Speech is blunt, commanding, and can wound. Family dynamics may be contentious with frequent arguments. Fond of spicy, hot food. Can indicate injury to the face or right eye. This is a Manglik placement when reckoned from lagna. Financial ups and downs from impulsive spending or risky investments, but the earning capacity is strong.', hi: 'आक्रामक धन संचय और कठोर वाणी। साहस, प्रतिस्पर्धा और बलपूर्वक कार्य से कमाई — भूसम्पत्ति, शल्य चिकित्सा या अभियान्त्रिकी। वाणी स्पष्ट, आधिकारिक और घातक। पारिवारिक गतिशीलता संघर्षपूर्ण। मसालेदार भोजन प्रिय। आवेगी खर्च से आर्थिक उतार-चढ़ाव।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Exceptional courage, powerful communication, and dynamic relationships with siblings. The native is bold in expression — writes forcefully, speaks commandingly, and acts decisively on short notice. Younger siblings may be martial in character. Excellent for military communication, sports journalism, adventure travel, and technical training. Physical stamina in the arms and hands is outstanding. The native thrives on challenges and short-term projects that demand immediate action. Can be combative with neighbors and during short journeys.', hi: 'असाधारण साहस, शक्तिशाली संवाद और भाई-बहनों से गतिशील सम्बन्ध। अभिव्यक्ति में निर्भीक — बलपूर्वक लिखता है, आधिकारिक बोलता है। सैन्य संचार, खेल पत्रकारिता और साहसिक यात्रा के लिए उत्कृष्ट। भुजाओं और हाथों में असाधारण शारीरिक सहनशक्ति।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Domestic turbulence — Mars burns the house of peace and comfort. Frequent changes of residence, property disputes, and strained relationship with mother. However, the native may own land, vehicles, and property acquired through aggressive dealing. The heart is restless and inner peace is elusive. Home environment may include fire hazards, weapons, or construction activity. This is a major Manglik placement. Real estate and construction are excellent career paths. Can indicate early separation from birthplace or a hot climate at home.', hi: 'घरेलू अशान्ति — मंगल शान्ति और सुख के भाव को जलाता है। बार-बार निवास परिवर्तन, सम्पत्ति विवाद और माता से तनावपूर्ण सम्बन्ध। तथापि आक्रामक सौदेबाजी से भूमि और सम्पत्ति। प्रमुख मांगलिक स्थिति। भूसम्पत्ति और निर्माण उत्कृष्ट करियर।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Sharp intelligence with a competitive edge — the native excels in debate, strategy games, and speculative ventures. Children may be fewer or born through difficulty, but are likely to have strong, martial characters. Romance is passionate, intense, and sometimes turbulent. Excellent for competitive sports coaching, political strategy, military education, and speculative trading. The native\'s creative expression has a combative quality — action films, war literature, competitive art. Mantra practice can be powerful but requires discipline to avoid misdirecting the fiery energy.', hi: 'प्रतिस्पर्धी बढ़त के साथ तीक्ष्ण बुद्धि — वाद-विवाद, रणनीति खेल और सट्टा उद्यमों में उत्कृष्ट। संतान कम या कठिनाई से, किन्तु सशक्त चरित्र की। रोमांस भावुक, तीव्र और कभी-कभी अशान्त। प्रतिस्पर्धी खेल प्रशिक्षण और सट्टा व्यापार के लिए उत्कृष्ट।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'One of the best placements for Mars — the warrior in the house of enemies. The native crushes opposition, overcomes disease, and thrives in competitive environments. Excellent for military, police, litigation, medicine, and any adversarial profession. Victory in lawsuits, competitive exams, and physical confrontations. The native is an excellent strategist in hostile situations. Can indicate maternal uncle with martial qualities. Health is robust with strong immunity but may include blood disorders, fevers, or surgical interventions. Enemies fear this native.', hi: 'मंगल के लिए सर्वोत्तम स्थितियों में — शत्रु के भाव में योद्धा। जातक विरोध को कुचलता है, रोग पर विजय पाता है। सेना, पुलिस, मुकदमेबाजी और चिकित्सा के लिए उत्कृष्ट। मुकदमों, प्रतिस्पर्धी परीक्षाओं और शारीरिक संघर्षों में विजय। शत्रु इस जातक से भयभीत।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'The most discussed Manglik placement — Mars in the 7th creates passionate but turbulent partnerships. The spouse is likely to be strong-willed, physically active, and possibly connected to engineering, military, or sports. Marriage may be delayed or involve conflict. Sexual energy in the relationship is strong but can become aggressive. Business partnerships are competitive. The native dominates in relationships and must learn compromise. Foreign travel through marriage or business is indicated. When well-aspected, produces power couples who achieve together through shared ambition.', hi: 'सबसे चर्चित मांगलिक स्थिति — सप्तम में मंगल भावुक किन्तु अशान्त साझेदारियाँ। जीवनसाथी दृढ़, शारीरिक रूप से सक्रिय। विवाह में विलम्ब या संघर्ष सम्भव। सम्बन्ध में प्रबल यौन ऊर्जा। व्यापारिक साझेदारियाँ प्रतिस्पर्धी। सुदृष्ट होने पर शक्ति दम्पति बनाता है।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Transformative and dangerous placement — Mars in the house of death, surgery, and hidden power. The native may face accidents, surgical procedures, or near-death experiences that fundamentally transform them. Excellent for surgeons, forensic investigators, tantra practitioners, and insurance/inheritance professionals. Sexual intensity is extreme. Hidden enemies are dangerous but the native has the instinct to survive. This is a Manglik placement. Inheritance through conflict is possible. Research into hidden matters, including occult and underground activities, comes naturally.', hi: 'परिवर्तनकारी और जोखिमपूर्ण — मृत्यु, शल्य और गुप्त शक्ति के भाव में मंगल। दुर्घटना, शल्य या मृत्यु-निकट अनुभव जो मौलिक रूप से बदल दें। शल्य चिकित्सकों, फोरेंसिक अन्वेषकों और तन्त्र साधकों के लिए उत्कृष्ट। मांगलिक स्थिति। गुप्त शोध स्वाभाविक।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'The warrior pilgrim — Mars channels aggression toward religious duty, higher education, and righteous causes. The native fights for their beliefs and may be a zealous defender of faith. Relationship with father may involve conflict or the father may have martial qualities. Long-distance travel for adventure, military duty, or religious mission. Good for sports at international level, military law, or religious leadership that involves action rather than contemplation. Can be dogmatic and aggressive about philosophical positions.', hi: 'योद्धा तीर्थयात्री — मंगल आक्रामकता को धार्मिक कर्तव्य, उच्च शिक्षा और धार्मिक कारणों की ओर। विश्वासों के लिए संघर्ष। पिता से संघर्ष या पिता में सैन्य गुण। साहसिक, सैन्य कर्तव्य या धार्मिक मिशन हेतु दीर्घ यात्रा। अन्तर्राष्ट्रीय खेल के लिए शुभ।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Mars is Digbali (directionally strong) in the 10th — the commander on the battlefield of career. This is the most powerful placement for professional success through courage, leadership, and competitive drive. Government authority, military command, corporate leadership, and surgical excellence are all indicated. The native\'s career defines their martial identity — they are known for their courage and decisiveness at work. Can be ruthlessly ambitious and create enemies through professional aggression. Honors and awards for bravery or professional excellence are likely.', hi: 'मंगल दशम भाव में दिग्बली — करियर के युद्धक्षेत्र में सेनापति। साहस, नेतृत्व और प्रतिस्पर्धी प्रेरणा से व्यावसायिक सफलता के लिए सबसे शक्तिशाली स्थिति। सरकारी अधिकार, सैन्य कमान, कॉर्पोरेट नेतृत्व। वीरता के लिए सम्मान और पुरस्कार सम्भव।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for wealth and fulfillment of ambitions through competitive effort. The native achieves goals through aggressive networking, strategic friendships, and organized group action. Elder siblings may be martial in character. Income from engineering, military, real estate, or sports-related ventures. Social circle includes warriors, athletes, and competitive personalities. Political connections through action-oriented groups. Financial gains are steady and increase with age. The native\'s desires are ambitious and their drive to fulfill them is relentless.', hi: 'प्रतिस्पर्धी प्रयास से धन और महत्वाकांक्षा पूर्ति के लिए उत्कृष्ट। आक्रामक नेटवर्किंग और रणनीतिक मित्रता से लक्ष्य प्राप्ति। बड़े भाई-बहन सैन्य चरित्र के। अभियान्त्रिकी, सेना या भूसम्पत्ति से आय। वित्तीय लाभ स्थिर और आयु के साथ बढ़ते हैं।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Mars loses its outward aggression here — energy is spent on hidden activities, foreign lands, and spiritual warfare. The native may work in hospitals, prisons, military intelligence, or foreign postings. Expenditure through legal disputes, medical bills, or foreign investments. Bed pleasures are intense. Dreams may be violent or involve conflict. This is a Manglik placement from the 7th house perspective. The native\'s aggression operates covertly. Can indicate incarceration or involuntary isolation in extreme cases. When spiritually directed, produces warriors who conquer the inner demons through tapas and meditation.', hi: 'मंगल बाह्य आक्रामकता खो देता है — ऊर्जा गुप्त गतिविधियों, विदेश और आध्यात्मिक युद्ध पर। अस्पताल, जेल, सैन्य गुप्तचर या विदेशी पोस्टिंग। कानूनी विवाद या चिकित्सा व्यय। स्वप्न हिंसक हो सकते हैं। आध्यात्मिक रूप से निर्देशित होने पर तपस्या से आन्तरिक राक्षसों को जीतने वाले योद्धा।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 7,
  overview: {
    en: 'Mangal Mahadasha lasts 7 years — a period of action, conflict, transformation, and physical vitality. During this period, the native\'s relationship with siblings, property, courage, and physical body come into focus. Mars dasha demands action — sitting still is not an option. The native will either build or destroy, conquer or be conquered. Real estate transactions, surgical procedures, sibling dynamics, and romantic intensity peak during this period. For Manglik charts, this dasha can trigger marriage or significant relationship events.',
    hi: 'मंगल महादशा 7 वर्ष चलती है — कर्म, संघर्ष, परिवर्तन और शारीरिक जीवनशक्ति की अवधि। इस अवधि में भाई-बहन, सम्पत्ति, साहस और शारीरिक शरीर पर ध्यान केन्द्रित। मंगल दशा कर्म माँगती है — स्थिर बैठना विकल्प नहीं। भूसम्पत्ति लेन-देन, शल्य प्रक्रियाएँ और रोमांटिक तीव्रता चरम पर।',
  },
  strongMars: {
    en: 'If Mars is well-placed (own sign, exalted, or in upachaya houses 3/6/10/11): Property acquisition, victory over enemies, professional advancement through courage, physical fitness, successful surgeries, sibling support, marriage for Manglik natives, leadership positions, and mechanical/engineering breakthroughs.',
    hi: 'यदि मंगल सुस्थित (स्वराशि, उच्च, या उपचय भाव 3/6/10/11 में): सम्पत्ति अर्जन, शत्रुओं पर विजय, साहस से व्यावसायिक उन्नति, शारीरिक फिटनेस, सफल शल्य, भाई-बहन सहयोग, मांगलिक जातकों का विवाह, नेतृत्व पद।',
  },
  weakMars: {
    en: 'If Mars is afflicted (debilitated, combust, or in trikasthana 6/8/12): Accidents, surgical complications, blood disorders, property disputes, sibling conflicts, domestic violence, legal battles, burns, criminal involvement, anger management issues, and marital discord especially for Manglik placements.',
    hi: 'यदि मंगल पीड़ित (नीच, अस्त, या त्रिकस्थान 6/8/12 में): दुर्घटना, शल्य जटिलताएँ, रक्त विकार, सम्पत्ति विवाद, भाई-बहन संघर्ष, घरेलू हिंसा, कानूनी लड़ाइयाँ, जलन, क्रोध प्रबन्धन समस्या, वैवाहिक कलह।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', count: '10,000 times in 40 days', en: 'The Mangal Beej Mantra — chant facing south on Tuesdays, preferably during Mars hora or at noon', hi: 'मंगल बीज मन्त्र — मंगलवार को दक्षिण दिशा की ओर मुख करके जाप करें, मंगल होरा या मध्याह्न में सर्वोत्तम' },
  gemstone: { en: 'Red Coral (Moonga) — set in gold or copper, worn on the ring finger of the right hand on a Tuesday during Shukla Paksha. Minimum 5 carats. Must touch the skin. Never wear with Emerald (Mercury\'s stone) as Mars and Mercury are enemies.', hi: 'मूँगा — स्वर्ण या ताम्र में जड़ित, मंगलवार को शुक्ल पक्ष में दाहिने हाथ की अनामिका में धारण करें। न्यूनतम 5 कैरेट। पन्ने (बुध का रत्न) के साथ कभी न पहनें क्योंकि मंगल और बुध शत्रु हैं।' },
  charity: { en: 'Donate red lentils (masoor dal), copper, red cloth, jaggery, or sharp implements on Tuesdays. Feed monkeys with jaggery and gram. Donate blood if medically appropriate.', hi: 'मंगलवार को मसूर दाल, ताम्र, लाल वस्त्र, गुड़ या धारदार वस्तुएँ दान करें। बन्दरों को गुड़ और चना खिलाएँ। चिकित्सकीय रूप से उचित हो तो रक्तदान करें।' },
  fasting: { en: 'Tuesday fasting — consume only one meal of wheat and jaggery, or eat only red-colored foods. Some traditions recommend Hanuman Vrat (fasting with recitation of Hanuman Chalisa on Tuesdays).', hi: 'मंगलवार का उपवास — केवल गेहूँ और गुड़ का एक भोजन, या केवल लाल रंग के खाद्य पदार्थ। कुछ परम्पराओं में हनुमान व्रत (मंगलवार को हनुमान चालीसा पाठ के साथ उपवास)।' },
  worship: { en: 'Worship Lord Hanuman on Tuesdays — recite Hanuman Chalisa and offer sindoor (vermilion), red flowers, and jasmine oil. Visit Hanuman temples. For Manglik Dosha specifically: Mangal Puja at a Navagraha temple, and keeping a Hanuman idol in the home facing south.', hi: 'मंगलवार को हनुमान जी की पूजा — हनुमान चालीसा पाठ, सिन्दूर, लाल पुष्प और चमेली तेल अर्पित करें। हनुमान मन्दिर जाएँ। मांगलिक दोष हेतु: नवग्रह मन्दिर में मंगल पूजा, दक्षिण मुखी हनुमान प्रतिमा घर में रखें।' },
  yantra: { en: 'Mangal Yantra — a 3×3 magic square with a sum of 21 in each row/column. Install on a copper plate, worship on Tuesdays. Can also install a triangular yantra representing Mars\'s fiery energy.', hi: 'मंगल यन्त्र — 3×3 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 21 है। ताम्र पत्र पर स्थापित करें, मंगलवार को पूजन करें।' },
  dietary: { en: 'Dietary recommendations for strengthening Mars: Consume red lentils (masoor dal), jaggery, honey, pomegranate, red apples, beetroot, and iron-rich foods like spinach and dates. Spiced food with turmeric, black pepper, and ginger activates Mars energy. Avoid cold, stale, and leftover food during Mars remedial periods — Mars demands freshness and heat. Eat protein-rich meals to support physical vitality. Red-colored fruits and vegetables naturally resonate with Mars vibration. For weakened Mars, cook with iron vessels (kadhai/tawa) — the iron transfers to food and strengthens blood.', hi: 'मंगल बल बढ़ाने के आहार: मसूर दाल, गुड़, शहद, अनार, लाल सेब, चुकन्दर, और लौह-समृद्ध खाद्य जैसे पालक और खजूर। हल्दी, काली मिर्च और अदरक से मसालेदार भोजन मंगल ऊर्जा सक्रिय करता है। बासी और ठंडा भोजन बचें। प्रोटीन-समृद्ध भोजन। लाल रंग के फल-सब्जी मंगल से अनुकूल। दुर्बल मंगल हेतु लोहे के बर्तन (कढ़ाई/तवा) में पकाएँ।' },
  colorTherapy: { en: 'Color therapy for Mars: Wear red, scarlet, crimson, orange-red, or copper colors on Tuesdays and during competitive situations (interviews, court hearings, sports events). Avoid green (Mercury\'s color, Mars\'s enemy) on Tuesdays. A red thread (Mauli) tied on the right wrist is a simple daily Mars remedy. Sindoor (vermilion) applied at the parting of hair (for married women) or on the forehead is a traditional Mars activation. Your exercise space should have warm, energizing colors — red or orange accents. Red coral beads as a necklace or bracelet carry Mars energy even without a formal gemstone prescription.', hi: 'मंगल रंग चिकित्सा: मंगलवार और प्रतिस्पर्धी स्थितियों (साक्षात्कार, न्यायालय, खेल) में लाल, सिन्दूरी, ताम्र रंग पहनें। मंगलवार को हरा (बुध का रंग, मंगल का शत्रु) न पहनें। दाहिनी कलाई पर लाल धागा (मौली) सरल दैनिक उपाय। सिन्दूर माँग या माथे पर पारम्परिक मंगल सक्रियण। व्यायाम स्थल में गरम, ऊर्जावान रंग। मूँगा मालाएँ मंगल ऊर्जा वहन करती हैं।' },
  behavioral: { en: 'Behavioral remedies (most powerful): (1) Exercise vigorously and regularly — Mars strengthens through physical exertion. Running, weightlifting, swimming, or any intense sport channels Mars energy constructively. (2) Practice a martial art — karate, kendo, boxing, or even fencing. The discipline of controlled combat is the purest Mars expression. (3) Complete physical projects — finish building, repairing, or organizing something tangible. Mars hates incompletion. (4) Stand up for someone weaker — Mars is the protector. Defending the vulnerable strengthens Mars directly. (5) Donate blood regularly if medically appropriate — blood is Mars\'s element. (6) Learn basic first aid or emergency response — Mars governs surgery and crisis management. (7) Cook with fire (grill, tandoor, open flame) rather than microwave — Mars resonates with direct fire. (8) Resolve conflicts directly rather than avoiding them — Mars weakens through suppression and strengthens through honest confrontation.', hi: 'व्यवहारिक उपाय: (1) नियमित कठोर व्यायाम — दौड़, भारोत्तोलन, तैराकी। (2) युद्ध कला अभ्यास — कराटे, मुक्केबाजी। नियन्त्रित युद्ध का अनुशासन शुद्धतम मंगल अभिव्यक्ति। (3) शारीरिक परियोजनाएँ पूर्ण करें — मंगल अधूरापन से घृणा करता है। (4) कमज़ोर की रक्षा — मंगल रक्षक है। (5) नियमित रक्तदान। (6) प्राथमिक चिकित्सा सीखें। (7) खुली आग पर पकाएँ। (8) संघर्षों को सीधे सुलझाएँ — मंगल दमन से दुर्बल और ईमानदार टकराव से बलवान।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Mangal (Mars) was born from the sweat drops of Lord Shiva that fell upon the earth — hence his name Bhumiputra (Son of the Earth) and Kuja (Born from Ku/Earth). In another tradition, when Sati immolated herself and Shiva\'s tear of grief fell on the earth, Mangal was born from that cosmic sorrow transformed into fierce energy. He was raised by Mother Earth (Bhumi Devi) and trained in warfare by the gods. His connection to Shiva explains why Hanuman (Shiva\'s avatar in one tradition) is the primary deity for Mars remedies. Mars represents Kartikeya (Skanda/Murugan), the commander of the divine army.',
    hi: 'मंगल (भौम) भगवान शिव के पसीने की बूँदों से उत्पन्न हुए जो पृथ्वी पर गिरीं — इसलिए उनका नाम भूमिपुत्र (पृथ्वी का पुत्र) और कुज (कु/पृथ्वी से जन्म)। एक अन्य परम्परा में सती के आत्मदाह पर शिव का अश्रु पृथ्वी पर गिरा, उस ब्रह्मांडीय शोक से मंगल उत्पन्न। भूमि देवी ने पालन किया। मंगल कार्तिकेय (स्कन्द/मुरुगन) दिव्य सेना के सेनापति का प्रतिनिधित्व करता है।',
  },
  temples: {
    en: 'Major Mangal temples: Vaitheeswaran Kovil (Tamil Nadu) — the Navagraha temple dedicated to Mars, where devotees pray for healing from disease (Mars governs surgery and blood); Mangalnath Temple (Ujjain, Madhya Pradesh) — considered the birthplace of Mars according to Matsya Purana, located on the banks of the Shipra river; various Hanuman temples serve as Mars remedy centers, with the Salasar Balaji (Rajasthan) and Mehandipur Balaji (Rajasthan) being particularly powerful for Mangal Dosha remedies.',
    hi: 'प्रमुख मंगल मन्दिर: वैद्ध्यनाथ कोविल (तमिलनाडु) — मंगल को समर्पित नवग्रह मन्दिर; मंगलनाथ मन्दिर (उज्जैन, मध्य प्रदेश) — मत्स्य पुराण के अनुसार मंगल का जन्मस्थान, क्षिप्रा नदी के तट पर; सालासर बालाजी (राजस्थान) और मेहंदीपुर बालाजी (राजस्थान) विशेष रूप से मंगल दोष उपचार के लिए शक्तिशाली।',
  },
  stotra: {
    en: 'The Mangal Kavacham from Skanda Purana is the primary protective hymn. The Navagraha Stotra verse for Mars: "Dharanee Garbha Sambhootam Vidyut Kanti Samaprabham, Kumaram Shakti Hastam Cha Mangalam Pranamaamyaham" — "I bow to Mars, born from Earth\'s womb, brilliant as lightning, the youthful one bearing the shakti (lance) in hand." Hanuman Chalisa is the most popular remedy text, as Hanuman is Mars\'s presiding deity.',
    hi: 'स्कन्द पुराण से मंगल कवचम् प्राथमिक सुरक्षात्मक स्तुति है। नवग्रह स्तोत्र का मंगल श्लोक: "धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम्, कुमारं शक्तिहस्तं च मंगलं प्रणमाम्यहम्" — "पृथ्वी के गर्भ से उत्पन्न, विद्युत के समान कान्तिमान, हाथ में शक्ति धारण करने वाले कुमार मंगल को प्रणाम।" हनुमान चालीसा सबसे लोकप्रिय उपाय ग्रन्थ।',
  },
  festivals: {
    en: 'Hanuman Jayanti (Chaitra Purnima) is the most significant festival connected to Mars through its presiding deity Hanuman. Devotees fast, recite Hanuman Chalisa 108 times, and apply sindoor at Hanuman temples. Mangala Gauri Vrat is observed by married women on Tuesdays during Shravana month for marital harmony — directly addressing Manglik Dosha through devotional practice. Angarki Chaturthi (when Chaturthi falls on a Tuesday) is considered extremely auspicious for Mars-related remedies and Ganesha worship. Skanda Shashthi celebrates Kartikeya (Mars\'s deity form) with particular fervor in South India, involving six days of fasting and culminating in the symbolic slaying of the demon Surapadman — representing the conquest of inner demons through martial discipline.',
    hi: 'हनुमान जयन्ती (चैत्र पूर्णिमा) अधिष्ठाता देवता हनुमान से मंगल का सबसे महत्त्वपूर्ण त्योहार। भक्त उपवास, हनुमान चालीसा 108 बार पाठ, और सिन्दूर अर्पण। मंगला गौरी व्रत विवाहित महिलाएँ श्रावण मास के मंगलवार को वैवाहिक सामंजस्य हेतु — मांगलिक दोष निवारण। अंगारकी चतुर्थी (मंगलवार को चतुर्थी) मंगल उपाय और गणेश पूजा के लिए अत्यन्त शुभ। स्कन्द षष्ठी कार्तिकेय (मंगल का देवता रूप) का उत्सव।',
  },
  otherTraditions: {
    en: 'In Buddhist tradition, Mars is associated with the wrathful deities (Dharmapalas) who protect the Dharma through fierce compassion — destroying obstacles to enlightenment just as Mars destroys enemies. The concept of the "dharma protector" who uses force for righteous ends is a direct parallel to Mangal as Senapati (commander). In Jain tradition, Mars energy is channeled through the concept of Purushartha (self-effort) — the Jain emphasis on Kayotsarga (body mortification) and intense physical austerity mirrors Mars\'s relationship with physical discipline. The Greco-Roman Mars/Ares, Norse Tyr, and Celtic Neit all embody the same archetypal warrior energy, demonstrating the universal recognition of Mars as the planet of courage, conflict, and physical transformation.',
    hi: 'बौद्ध परम्परा में मंगल क्रोधी देवताओं (धर्मपालों) से जुड़ा — उग्र करुणा से धर्म की रक्षा, बाधाओं का विनाश। "धर्म रक्षक" की अवधारणा सीधे मंगल सेनापति से समानान्तर। जैन परम्परा में पुरुषार्थ (स्व-प्रयत्न) और कायोत्सर्ग (शारीरिक तपस्या) मंगल के शारीरिक अनुशासन सम्बन्ध का दर्पण। ग्रीको-रोमन मार्स/एरीस, नोर्स टायर — सभी समान आर्कीटाइपल योद्धा ऊर्जा।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'King and commander — authority backed by force. Sun-Mars conjunction creates powerful leadership and military authority. Both are fire planets that reinforce courage, ambition, and dominance. Can be excessively aggressive when combined.', hi: 'राजा और सेनापति — बल द्वारा समर्थित अधिकार। सूर्य-मंगल युति शक्तिशाली नेतृत्व और सैन्य अधिकार। दोनों अग्नि ग्रह साहस और प्रभुत्व को बल देते हैं।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Chandra-Mangala Yoga — emotional courage and wealth through aggressive business. Mars heats the cool Moon, producing passionate action driven by feeling. The mother may be strong-willed. Property gains through emotional decisions.', hi: 'चन्द्र-मंगल योग — भावनात्मक साहस और आक्रामक व्यापार से धन। मंगल शीतल चन्द्र को गरम करता है। माता दृढ़ संकल्प वाली। भावनात्मक निर्णयों से सम्पत्ति लाभ।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Warrior versus diplomat — Mars acts, Mercury thinks. Their conjunction creates internal tension between impulse and analysis. Can produce skilled surgeons (Mars precision + Mercury dexterity) but also verbal aggression and intellectual bullying. Never wear Red Coral and Emerald together.', hi: 'योद्धा बनाम कूटनीतिज्ञ — मंगल कर्म करता है, बुध सोचता है। युति आवेग और विश्लेषण के बीच आन्तरिक तनाव। कुशल शल्य चिकित्सक बना सकती है किन्तु मौखिक आक्रामकता भी। मूँगा और पन्ना कभी एक साथ न पहनें।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'The dharmic warrior — courage guided by wisdom and moral principle. Mars-Jupiter conjunction or mutual aspect creates powerful Raja Yogas and Dhana Yogas. Jupiter tempers Mars\'s aggression with righteousness. Excellent for military officers with ethical codes, religious leaders who take action, and judges who enforce justice.', hi: 'धार्मिक योद्धा — ज्ञान और नैतिक सिद्धान्त से निर्देशित साहस। मंगल-गुरु युति शक्तिशाली राज योग और धन योग। गुरु मंगल की आक्रामकता को धार्मिकता से संयमित करता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Passion meets pleasure — Mars-Venus conjunction creates intense romantic and sexual energy. Can produce passionate artists, dancers, and athletes with aesthetic grace. In excess, leads to affairs, sexual aggression, and relationship instability. Their combined energy drives the fashion, beauty, and luxury industries.', hi: 'जुनून और आनन्द का मिलन — मंगल-शुक्र युति तीव्र रोमांटिक और यौन ऊर्जा। भावुक कलाकार, नर्तक और सौन्दर्य कुशल खिलाड़ी। अधिकता में प्रेम सम्बन्ध और यौन आक्रामकता।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Fire meets ice — the most frustrating planetary combination. Mars wants to act NOW; Saturn demands patience and delay. Their conjunction creates enormous pressure that either forges diamonds or shatters glass. Accident-prone but builds incredible resilience. When channeled properly, produces engineers, builders, and warriors who endure impossible hardships.', hi: 'अग्नि और हिम का मिलन — सबसे निराशाजनक ग्रह संयोजन। मंगल अभी कर्म चाहता है; शनि धैर्य और विलम्ब माँगता है। प्रचण्ड दबाव जो हीरे गढ़ता या काँच तोड़ता है। दुर्घटना-प्रवण किन्तु अविश्वसनीय सहनशीलता।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Angarak Yoga — amplified aggression, unconventional warfare, and explosive energy. Mars-Rahu conjunction can produce fearless risk-takers, demolition experts, and boundary-breakers. In negative expression: accidents, explosions, criminal violence, and reckless behavior. The native may use technology or chemicals as weapons.', hi: 'अंगारक योग — प्रवर्धित आक्रामकता, अपरम्परागत युद्ध और विस्फोटक ऊर्जा। मंगल-राहु युति निर्भय जोखिम लेने वाले बनाती है। नकारात्मक रूप में: दुर्घटना, विस्फोट, आपराधिक हिंसा।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Mars-Ketu conjunction creates Pishach Yoga in some traditions — fierce but directionless energy. The native acts from subconscious impulse rather than conscious decision. Excellent for martial arts with spiritual foundations, surgery performed with intuitive precision, and occult warfare. Can indicate accidents through electrical or fire-related causes.', hi: 'मंगल-केतु युति कुछ परम्पराओं में पिशाच योग — उग्र किन्तु दिशाहीन ऊर्जा। अवचेतन आवेग से कर्म। आध्यात्मिक नींव वाली युद्ध कला और अन्तर्ज्ञानी शल्य के लिए उत्कृष्ट। विद्युत या अग्नि से दुर्घटना संकेतित।' } },
];

// ─── Key Yogas involving Mars ─────────────────────────────────────────
const KEY_YOGAS = [
  {
    name: { en: 'Ruchaka Yoga (Pancha Mahapurusha)', hi: 'रुचक योग (पंच महापुरुष)' },
    condition: { en: 'Mars in its own sign (Aries/Scorpio) or exalted (Capricorn) AND in a Kendra (1st, 4th, 7th, 10th) from Lagna', hi: 'मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में और लग्न से केन्द्र (1, 4, 7, 10) में' },
    effect: { en: 'One of the five Mahapurusha Yogas — produces a "brilliant person." The native has exceptional physical strength, courage, military or administrative ability, and commanding presence. They rise to positions of authority through personal valor. Longevity is strong. The native may have a reddish complexion and athletic build. This yoga produces military commanders, sports champions, surgical pioneers, and fearless entrepreneurs who build empires through personal courage and strategic brilliance.',
      hi: 'पंच महापुरुष योगों में — "प्रतिभाशाली व्यक्ति" उत्पन्न करता है। असाधारण शारीरिक बल, साहस, सैन्य/प्रशासनिक योग्यता और आधिकारिक उपस्थिति। व्यक्तिगत वीरता से अधिकार पद। दीर्घायु। सैन्य कमांडर, खेल चैम्पियन, शल्य अग्रणी और निर्भय उद्यमी जो साहस और रणनीति से साम्राज्य बनाते हैं।' },
  },
  {
    name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष' },
    condition: { en: 'Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna, Moon, or Venus', hi: 'लग्न, चन्द्र, या शुक्र से भाव 1, 2, 4, 7, 8, या 12 में मंगल' },
    effect: { en: 'The most discussed dosha in marriage compatibility. Mars in these houses aspects the 7th house of marriage or occupies houses that directly affect domestic harmony. Effects vary from mild to severe based on: which house Mars occupies, whether it is in own/exalted sign (cancellation), whether it aspects benefics, and the overall chart balance. Cancellation conditions include: Mars in Cancer/Capricorn/Aries/Scorpio, Mars aspected by Jupiter, or both partners being Manglik. Over 40% of charts have some Manglik placement — it is NOT a sentence of doom but a factor requiring conscious partnership work.',
      hi: 'विवाह अनुकूलता में सबसे चर्चित दोष। इन भावों में मंगल सप्तम पर दृष्टि या घरेलू सामंजस्य प्रभावित करने वाले भाव। प्रभाव मंगल की राशि, भाव, शुभ दृष्टि और सम्पूर्ण कुण्डली सन्तुलन पर निर्भर। भंग: मंगल कर्क/मकर/मेष/वृश्चिक में, गुरु दृष्टि, या दोनों साथी मांगलिक। 40% से अधिक कुण्डलियों में — विनाश का वाक्य नहीं, सचेत साझेदारी कार्य का संकेत।' },
  },
  {
    name: { en: 'Angarak Yoga (Mars-Rahu)', hi: 'अंगारक योग (मंगल-राहु)' },
    condition: { en: 'Mars conjunct Rahu in the same sign', hi: 'मंगल और राहु एक राशि में युति' },
    effect: { en: 'Amplified, unconventional aggression — Mars\'s fire combined with Rahu\'s insatiable desire creates explosive energy. The native may take extraordinary risks, use technology or chemicals as weapons, or pursue forbidden paths with relentless determination. In positive expression: fearless innovators who break boundaries that others dare not approach, demolition experts (literal and metaphorical), and pioneers in dangerous fields. In negative expression: accidents, explosions, criminal violence, and self-destructive recklessness. Requires strong Jupiter aspect for positive channeling.',
      hi: 'प्रवर्धित, अपरम्परागत आक्रामकता — मंगल की अग्नि और राहु की अतृप्त इच्छा का विस्फोटक संयोजन। असाधारण जोखिम, प्रौद्योगिकी या रसायन हथियार के रूप। सकारात्मक: निर्भय नवप्रवर्तक जो सीमाएँ तोड़ते हैं। नकारात्मक: दुर्घटना, विस्फोट, आपराधिक हिंसा। सकारात्मक संचालन हेतु गुरु दृष्टि आवश्यक।' },
  },
  {
    name: { en: 'Guru-Mangal Yoga', hi: 'गुरु-मंगल योग' },
    condition: { en: 'Mars and Jupiter conjunct in the same sign or in mutual aspect (especially 1-7 axis)', hi: 'मंगल और गुरु एक राशि में युति या परस्पर दृष्टि (विशेषतः 1-7 अक्ष)' },
    effect: { en: 'The dharmic warrior — courage guided by wisdom and righteousness. This is a powerful Dhana Yoga (wealth combination) and Raja Yoga (power combination). The native fights only for just causes and wins through moral authority combined with physical courage. Excellent for military officers with ethical codes, judges who enforce justice, and religious leaders who take action. Property and land come through righteous means. Children inherit both courage and wisdom.',
      hi: 'धार्मिक योद्धा — ज्ञान और धर्म से निर्देशित साहस। शक्तिशाली धन योग और राज योग। केवल न्यायपूर्ण कारणों के लिए संघर्ष और नैतिक अधिकार से विजय। नैतिक सैन्य अधिकारियों, न्यायाधीशों और कर्मठ धार्मिक नेताओं के लिए उत्कृष्ट। धार्मिक मार्ग से सम्पत्ति। संतान में साहस और ज्ञान दोनों।' },
  },
  {
    name: { en: 'Kuja Dosha Bhanga (Cancellation)', hi: 'कुज दोष भंग (निवारण)' },
    condition: { en: 'Various: Mars in own/exalted sign, Jupiter aspecting Mars, Mars in 2nd in Gemini/Virgo, both partners Manglik, Mars in 1st in Aries/Leo/Aquarius', hi: 'विभिन्न: मंगल स्वराशि/उच्च, गुरु दृष्टि, द्वितीय में मिथुन/कन्या, दोनों मांगलिक, प्रथम में मेष/सिंह/कुम्भ' },
    effect: { en: 'Critical to understand: Manglik Dosha is NOT absolute. Over a dozen classical conditions cancel or reduce the dosha. When Mars is in its own sign or exalted, its energy is disciplined rather than destructive — the marriage may still be intense but is not harmful. Jupiter\'s aspect infuses wisdom and dharma into Mars\'s energy. When both partners are Manglik, their energies match and the dosha neutralizes mutually. A thorough Jyotishi will check ALL cancellation conditions before declaring a chart strongly Manglik.',
      hi: 'समझना महत्त्वपूर्ण: मांगलिक दोष निरपेक्ष नहीं। दर्जनों शास्त्रीय स्थितियाँ दोष का भंग या न्यूनीकरण करती हैं। स्वराशि/उच्च में मंगल अनुशासित है, विनाशक नहीं। गुरु दृष्टि ज्ञान और धर्म भरती है। दोनों मांगलिक होने पर ऊर्जा मेल और पारस्परिक निष्प्रभाव। योग्य ज्योतिषी सभी भंग स्थितियाँ जाँचेगा।' },
  },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/chandra', label: { en: 'Chandra — The Moon', hi: 'चन्द्र' } },
  { href: '/learn/budha', label: { en: 'Budha — Mercury', hi: 'बुध' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function MangalPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-mars/15 border border-graha-mars/30 mb-4">
          <span className="text-4xl">♂</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Mangal — Mars', hi: 'मंगल — भौम' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Bhumiputra — son of the Earth, commander of the celestial army, the planet of courage, conflict, and transformation in Vedic astrology.', hi: 'भूमिपुत्र — पृथ्वी का पुत्र, देव सेना का सेनापति, वैदिक ज्योतिष में साहस, संघर्ष और परिवर्तन का ग्रह।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Mangal is the commander-in-chief (Senapati) of the Navagrahas, the embodiment of raw physical energy, courage, and the will to fight. As a Krura (cruel) graha, he destroys through fire, cuts through surgery, and conquers through warfare — but this destruction serves creation. He represents younger siblings, property and land, blood and vitality, the military, and the primal survival instinct. Without Mars, no building is erected, no surgery performed, no battle won, and no athlete achieves greatness. He is the planet that converts intention into physical action.', hi: 'मंगल नवग्रहों का सेनापति, कच्ची शारीरिक ऊर्जा, साहस और संघर्ष की इच्छा का मूर्तिमान रूप है। क्रूर ग्रह होने से वह अग्नि से नष्ट करता है, शल्य से काटता है और युद्ध से जीतता है — किन्तु यह विनाश सृजन की सेवा करता है। वह छोटे भाई-बहन, सम्पत्ति, रक्त, सेना और प्रारम्भिक उत्तरजीविता प्रवृत्ति का प्रतिनिधित्व करता है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mars is the first planet in the Jyotish system that orbits outside Earth — the first "outer planet." Its astronomical behavior, including dramatic retrograde periods, wide speed variations, and distinctive red color, directly mirror its astrological symbolism of variable energy, strategic retreat, and fiery aggression.', hi: 'मंगल ज्योतिष पद्धति में पृथ्वी के बाहर कक्षा करने वाला प्रथम ग्रह — पहला "बाह्य ग्रह।" इसका खगोलीय व्यवहार — नाटकीय वक्री अवधि, व्यापक गति भिन्नता, और विशिष्ट लाल रंग — सीधे ज्योतिषीय प्रतीकवाद से मेल खाता है।' })}</p>
        <div className="space-y-3">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2 capitalize" style={hf}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Ch. 1 — Mean motions of Mars (Kuja)" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'Mars\'s dignity determines whether its energy is disciplined or destructive. In Capricorn at 28°, Mars is exalted — the warrior operates with strategic precision, patience, and organizational brilliance. In Cancer at 28°, Mars is debilitated — aggressive energy is trapped in emotional waters, producing passive-aggressive behavior and misdirected anger. Mars has two own signs: Aries (cardinal fire — the charge) and Scorpio (fixed water — the ambush), reflecting its dual nature as both the open warrior and the covert operative.', hi: 'मंगल की गरिमा यह निर्धारित करती है कि उसकी ऊर्जा अनुशासित है या विनाशक। मकर 28° में मंगल उच्च — योद्धा रणनीतिक सूक्ष्मता से कार्य करता है। कर्क 28° में नीच — आक्रामक ऊर्जा भावनात्मक जल में फँसी। मंगल की दो स्वराशियाँ: मेष (खुला आक्रमण) और वृश्चिक (गुप्त घात)।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha" />
      </LessonSection>

      {/* ── 3. Mars in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Mars in the Twelve Signs', hi: 'बारह राशियों में मंगल' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The sign placement of Mars determines how aggressive, courageous, and physical energy is expressed. Mars in fire signs (Aries, Leo, Sagittarius) is most natural — direct, bold, and action-oriented. In earth signs, Mars builds and constructs. In air signs, Mars fights with words and ideas. In water signs, Mars fights through emotions, often producing the most psychologically complex warriors.', hi: 'मंगल की राशि स्थिति यह निर्धारित करती है कि आक्रामक, साहसिक और शारीरिक ऊर्जा कैसे व्यक्त होती है। अग्नि राशियों में सबसे स्वाभाविक — प्रत्यक्ष और कर्मठ। पृथ्वी राशियों में निर्माण करता है। वायु राशियों में शब्दों से लड़ता है। जल राशियों में भावनाओं से।' })}</p>
        {MARS_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity === 'Own sign' || s.dignity.includes('Own sign') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  s.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
                  s.dignity.includes('Enemy') ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Mars in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Mars in the Twelve Houses', hi: 'बारह भावों में मंगल' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines the arena where Mars\'s warrior energy operates. Mars is Digbali (directionally strong) in the 10th house — the house of career and public action. In Upachaya houses (3, 6, 10, 11), Mars improves with age and produces excellent results. Mars in houses 1, 2, 4, 7, 8, or 12 creates Manglik Dosha — a significant factor in marriage compatibility analysis.', hi: 'भाव स्थिति यह निर्धारित करती है कि मंगल की योद्धा ऊर्जा किस क्षेत्र में कार्य करती है। मंगल दशम भाव में दिग्बली — करियर और सार्वजनिक कर्म। उपचय भावों (3, 6, 10, 11) में आयु के साथ सुधरता है। भाव 1, 2, 4, 7, 8 या 12 में मांगलिक दोष।' })}</p>
        {MARS_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-mars/15 border border-graha-mars/30 flex items-center justify-center text-graha-mars text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Mangal Mahadasha (7 Years)', hi: 'मंगल महादशा (7 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Mars Dasha', hi: 'बलवान मंगल दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongMars)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Mars Dasha', hi: 'दुर्बल मंगल दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakMars)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 7. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mars is perhaps the most misunderstood planet in Jyotish — feared for its aggression but essential for courage, property ownership, and physical vitality. Understanding how to assess Mars in your own chart and when remedies are genuinely needed versus when Mars energy simply needs proper channeling is crucial for practical application.', hi: 'मंगल ज्योतिष में शायद सबसे गलत समझा जाने वाला ग्रह — आक्रामकता के लिए भयभीत किन्तु साहस, सम्पत्ति और शारीरिक जीवनशक्ति के लिए आवश्यक। अपनी कुण्डली में मंगल का आकलन करना और उपाय कब आवश्यक हैं बनाम ऊर्जा को दिशा देना — यह समझना व्यावहारिक अनुप्रयोग के लिए महत्त्वपूर्ण।' })}</p>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'How to Assess Mars\'s Strength', hi: 'मंगल के बल का आकलन कैसे करें' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.assessStrength)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Signs of a Strong Mars', hi: 'बलवान मंगल के संकेत' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.strongIndicators)}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Signs of a Weak Mars', hi: 'दुर्बल मंगल के संकेत' })}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.weakIndicators)}</p>
            </div>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'When to Seek Remedies', hi: 'उपाय कब करें' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.whenToRemediate)}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
            <h4 className="text-amber-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions', hi: 'आम भ्रान्तियाँ' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 8. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mars\'s friendships and enmities reflect the warrior\'s alliances on the cosmic battlefield. His friendship with Sun, Moon, and Jupiter forms the axis of dharmic action — courage guided by authority, nurtured by compassion, and directed by wisdom. His enmity with Mercury represents the eternal tension between action and analysis, the sword and the pen.', hi: 'मंगल की मैत्री और शत्रुता ब्रह्मांडीय युद्धक्षेत्र पर योद्धा के गठबन्धनों को दर्शाती है। सूर्य, चन्द्र और गुरु से मैत्री धार्मिक कर्म की धुरी — अधिकार से निर्देशित, करुणा से पोषित, ज्ञान से निर्दिष्ट साहस। बुध से शत्रुता कर्म और विश्लेषण का शाश्वत तनाव।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri" />
      </LessonSection>

      {/* ── Key Yogas Involving Mars ── */}
      <LessonSection number={next()} title={ml({ en: 'Key Yogas Involving Mangal', hi: 'मंगल से सम्बन्धित प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Mars participates in several critical yogas that can dramatically enhance or complicate a chart. The Ruchaka Mahapurusha Yoga makes Mars a king-maker, while Manglik Dosha is the most discussed compatibility factor in Hindu marriage. Understanding these yogas — especially the many cancellation conditions for Manglik Dosha — prevents both unnecessary fear and careless dismissal.', hi: 'मंगल कई महत्त्वपूर्ण योगों में भाग लेता है जो कुण्डली को नाटकीय रूप से बढ़ा या जटिल बना सकते हैं। रुचक महापुरुष योग मंगल को राजनिर्माता बनाता है, जबकि मांगलिक दोष हिन्दू विवाह में सबसे चर्चित अनुकूलता कारक है। इन योगों — विशेषतः मांगलिक दोष के भंग — को समझना अनावश्यक भय और लापरवाह उपेक्षा दोनों से बचाता है।' })}</p>
        <div className="space-y-4">
          {KEY_YOGAS.map((yoga, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(yoga.name)}</h4>
              <p className="text-gold-dark text-xs mb-2 italic" style={bf}>{ml(yoga.condition)}</p>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(yoga.effect)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 34-35 — Mahapurusha Yogas & Kuja Dosha" />
      </LessonSection>

      {/* ── Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Mars', hi: 'मंगल के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Mars is weak, afflicted, or causing Manglik Dosha. A well-placed Mars generally does not need remedies — its energy should be channeled through physical activity, competitive endeavors, and courageous action rather than suppressed. Consult a qualified Jyotishi before wearing gemstones, as amplifying Mars energy incorrectly can increase aggression and accident risk.', hi: 'उपाय तब निर्धारित किये जाते हैं जब मंगल दुर्बल, पीड़ित हो या मांगलिक दोष उत्पन्न कर रहा हो। सुस्थित मंगल को प्रायः उपाय की आवश्यकता नहीं — शारीरिक गतिविधि और साहसिक कर्म से ऊर्जा का संचालन करें। रत्न धारण से पूर्व ज्योतिषी से परामर्श अनिवार्य।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Red Coral (Moonga)', hi: 'रत्न — मूँगा' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship — Hanuman', hi: 'पूजा — हनुमान' } },
          { key: 'yantra', title: { en: 'Mangal Yantra', hi: 'मंगल यन्त्र' } },
          { key: 'dietary', title: { en: 'Dietary Recommendations', hi: 'आहार अनुशंसाएँ' } },
          { key: 'colorTherapy', title: { en: 'Color Therapy', hi: 'रंग चिकित्सा' } },
          { key: 'behavioral', title: { en: 'Behavioral Remedies', hi: 'व्यवहारिक उपाय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Mars remedies work best when combined with physical discipline: regular exercise, martial arts, competitive sports, and channeling anger into constructive action. Suppressing Mars energy causes it to explode — the remedy is direction, not suppression.', hi: 'मंगल उपाय शारीरिक अनुशासन के साथ सबसे अच्छे काम करते हैं: नियमित व्यायाम, युद्ध कला, प्रतिस्पर्धी खेल, और क्रोध को रचनात्मक कर्म में बदलना। मंगल ऊर्जा को दबाना विस्फोट करवाता है — उपाय दिशा है, दमन नहीं।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 8. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Origin Story', hi: 'उत्पत्ति कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mangal Stotra & Kavacham', hi: 'मंगल स्तोत्र एवं कवचम्' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Festivals & Observances', hi: 'त्योहार एवं अनुष्ठान' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.festivals)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Mars in Other Traditions', hi: 'अन्य परम्पराओं में मंगल' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.otherTraditions)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Skanda Purana" chapter="Mangal Kavacham" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Mars is Bhumiputra — son of Earth. Its placement reveals your courage, physical energy, property matters, and relationship with siblings.', hi: 'मंगल भूमिपुत्र है — इसकी स्थिति आपका साहस, शारीरिक ऊर्जा, सम्पत्ति और भाई-बहन सम्बन्ध प्रकट करती है।' }),
        ml({ en: 'Exalted in Capricorn (28°), debilitated in Cancer (28°). Own signs Aries & Scorpio. Moolatrikona Aries 0°-12°.', hi: 'मकर 28° में उच्च, कर्क 28° में नीच। स्वराशि मेष और वृश्चिक। मूलत्रिकोण मेष 0°-12°।' }),
        ml({ en: 'Friends: Sun, Moon, Jupiter. Enemy: Mercury. Mars in houses 1/2/4/7/8/12 creates Manglik Dosha — significant for marriage.', hi: 'मित्र: सूर्य, चन्द्र, गुरु। शत्रु: बुध। भाव 1/2/4/7/8/12 में मंगल मांगलिक दोष — विवाह के लिए महत्त्वपूर्ण।' }),
        ml({ en: 'Mahadasha: 7 years. Remedy: Red Coral, red lentil/copper charity, Tuesday fasting, Hanuman worship.', hi: 'महादशा: 7 वर्ष। उपाय: मूँगा, मसूर/ताम्र दान, मंगलवार व्रत, हनुमान पूजा।' }),
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
