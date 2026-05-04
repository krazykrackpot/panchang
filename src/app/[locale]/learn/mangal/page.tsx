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

      {/* ── 2. Dignities ── */}
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

      {/* ── 6. Planetary Relationships ── */}
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

      {/* ── 7. Remedies ── */}
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
