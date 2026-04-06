/**
 * Varga (Divisional Chart) Tippanni — comprehensive per-chart commentary
 * Two sections per chart: (1) Overall Commentary, (2) 1-2 Year Prognosis
 * Reference: BPHS Ch.6-7, Jataka Parijata, Saravali, Phaladeepika
 */

import type { Locale } from '@/types/panchang';
import type { KundaliData, DivisionalChart, PlanetPosition, DashaEntry } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';
import { generateDashaPrognosis } from './dasha-prognosis';

type Bi = { en: string; hi: string };

export interface VargaChartTippanni {
  chart: string;
  label: Bi;
  meaning: Bi;
  strength: 'strong' | 'moderate' | 'weak';
  overallCommentary: Bi;     // Detailed interpretation of this chart
  prognosis: Bi;             // Next 1-2 year forecast
  keyFindings: Bi[];         // Bullet points
}

export interface VargaSynthesis {
  overall: Bi;
  strongAreas: Bi[];
  weakAreas: Bi[];
  vargaInsights: VargaChartTippanni[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const PN: Record<number, Bi> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

const BENEFICS = new Set([1, 3, 4, 5]);
const MALEFICS = new Set([0, 2, 6, 7, 8]);
const KENDRAS = new Set([1, 4, 7, 10]);
const TRIKONAS = new Set([1, 5, 9]);
const DUSTHANAS = new Set([6, 8, 12]);
const GOOD = new Set([1, 2, 3, 4, 5, 7, 9, 10, 11]);

function signLord(sign: number): number {
  return ({ 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 } as Record<number, number>)[sign] ?? 0;
}

function planetsIn(chart: { houses: number[][] }, house: number): number[] {
  return chart.houses[(house - 1) % 12] || [];
}

function ord(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  return n + (s[(n - 20) % 10] || s[n] || s[0]);
}

function rashiName(sign: number, locale: string): string {
  return RASHIS[(sign - 1) % 12]?.name[locale as Locale] || '';
}

function findCurrentDasha(dashas: DashaEntry[]): { maha: DashaEntry; antar?: DashaEntry } | null {
  const now = new Date();
  for (const d of dashas) {
    if (now >= new Date(d.startDate) && now <= new Date(d.endDate)) {
      let antar: DashaEntry | undefined;
      if (d.subPeriods) {
        antar = d.subPeriods.find(s => now >= new Date(s.startDate) && now <= new Date(s.endDate));
      }
      return { maha: d, antar };
    }
  }
  return null;
}

// Planet name -> id mapping
function planetId(name: string): number {
  const map: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
  return map[name] ?? -1;
}

// ─── Drekkana faces (36 archetypes — Varahamihira, Brihat Jataka Ch.27) ────
// Index = (sign-1)*3 + (face-1), face = floor((longitude%30)/10)+1, sign = floor(longitude/30)+1

const DREKKANA_FACES: Array<{ archetype: Bi; quality: Bi }> = [
  // Aries: faces 1-3 (index 0-2)
  { archetype: { en: 'The Warrior', hi: 'योद्धा' }, quality: { en: 'Aggressive pioneer; bold, impulsive, initiating force — planet here gains martial vigour and competitive drive.', hi: 'आक्रामक अग्रदूत; साहसी, आवेगशील, प्रारंभ-शक्ति — यहाँ ग्रह युद्ध-वृत्ति और प्रतिस्पर्धी प्रेरणा पाता है।' } },
  { archetype: { en: 'The Amazon', hi: 'योद्धा-स्त्री' }, quality: { en: 'Fierce feminine energy in conflict; emotional battles, protective instincts, warrior-mother archetype.', hi: 'संघर्ष में तीव्र स्त्री-ऊर्जा; भावनात्मक युद्ध, सुरक्षात्मक वृत्ति, योद्धा-माता आदर्श।' } },
  { archetype: { en: 'The Armed Noble', hi: 'सशस्त्र अभिजात' }, quality: { en: 'Disciplined martial authority; force combined with status — leadership through demonstrated courage.', hi: 'अनुशासित सैन्य-अधिकार; बल और प्रतिष्ठा का संयोग — सिद्ध साहस द्वारा नेतृत्व।' } },
  // Taurus: faces 1-3 (index 3-5)
  { archetype: { en: 'The Adorned Beauty', hi: 'अलंकृत सौंदर्य' }, quality: { en: 'Sensual abundance; love of beauty, art, and pleasure — planet here gains receptivity and magnetic attraction.', hi: 'इंद्रिय-प्राचुर्य; सौंदर्य, कला और आनंद-प्रेम — यहाँ ग्रह ग्रहणशीलता और आकर्षण पाता है।' } },
  { archetype: { en: 'The Toiler', hi: 'परिश्रमी' }, quality: { en: 'Patient builder; steady accumulation through persistent, earthy effort — productive and reliable.', hi: 'धैर्यवान निर्माता; निरंतर भूमिगत प्रयास से संचय — उत्पादक और विश्वसनीय।' } },
  { archetype: { en: 'The Steadfast Guardian', hi: 'अटल संरक्षक' }, quality: { en: 'Stubborn protector of resources; fierce when provoked, immovable in defence of what is valued.', hi: 'संसाधनों का जिद्दी रक्षक; उकसाने पर भयंकर, मूल्यवान वस्तु की रक्षा में अडिग।' } },
  // Gemini: faces 1-3 (index 6-8)
  { archetype: { en: 'The Learned Maiden', hi: 'विद्वान कन्या' }, quality: { en: 'Intellectual beauty; writing, communication, and mental agility — charm combined with quick wit.', hi: 'बौद्धिक सौंदर्य; लेखन, संचार और मानसिक चपलता — आकर्षण और तीव्र बुद्धि का संयोग।' } },
  { archetype: { en: 'The Merchant-Scholar', hi: 'व्यापारी-विद्वान' }, quality: { en: 'Commercial intelligence; knowledge united with practical exchange — versatile communicator and trader.', hi: 'वाणिज्यिक बुद्धि; ज्ञान और व्यावहारिक विनिमय का एकीकरण — बहुमुखी संचारक।' } },
  { archetype: { en: 'The Focused Archer', hi: 'एकाग्र धनुर्धर' }, quality: { en: 'Sharp mental aim; precision in argument and analysis — debates skillfully, cuts to the truth.', hi: 'तीव्र मानसिक लक्ष्य; तर्क और विश्लेषण में सटीकता — कुशल वाद-विवाद, सत्य की खोज।' } },
  // Cancer: faces 1-3 (index 9-11)
  { archetype: { en: 'The Nurturing Mother', hi: 'पोषण-माता' }, quality: { en: 'Deep nourishment and care; emotional intuition, psychic receptivity, and protective love.', hi: 'गहरा पोषण और देखभाल; भावनात्मक अंतर्ज्ञान, मानसिक ग्रहणशीलता और सुरक्षात्मक प्रेम।' } },
  { archetype: { en: 'The Serpent Keeper', hi: 'नाग-पालक' }, quality: { en: 'Holder of hidden emotional power; karmic wisdom through suffering, occult sensitivity.', hi: 'छिपी भावनात्मक शक्ति का धारक; कष्ट से कार्मिक ज्ञान, गुप्त संवेदनशीलता।' } },
  { archetype: { en: 'The Weeping Woman', hi: 'करुणा-नारी' }, quality: { en: 'Deep emotional sensitivity; grief transformed into compassion — profound empathy and emotional intelligence.', hi: 'गहरी भावनात्मक संवेदनशीलता; शोक से करुणा — गहरी सहानुभूति और भावनात्मक बुद्धि।' } },
  // Leo: faces 1-3 (index 12-14)
  { archetype: { en: 'The Crowned King', hi: 'मुकुटधारी राजा' }, quality: { en: 'Regal natural authority; born to lead, radiate, and inspire — commanding presence and dignity.', hi: 'राजसी प्राकृतिक अधिकार; नेतृत्व, प्रकाश और प्रेरणा के लिए जन्मे — प्रभावशाली उपस्थिति।' } },
  { archetype: { en: 'The Blazing Champion', hi: 'ज्वलंत योद्धा' }, quality: { en: 'Fierce solar pride; power expressed through dramatic action, passionate defence of honour.', hi: 'तीव्र सौर-गर्व; नाटकीय कार्य और सम्मान की भावुक रक्षा में व्यक्त शक्ति।' } },
  { archetype: { en: 'The Ritual King', hi: 'अनुष्ठान-राजा' }, quality: { en: 'Power sanctified by dharma; rulership through ceremony, tradition, and divine mandate — kingly magnanimity.', hi: 'धर्म द्वारा पवित्र शक्ति; समारोह, परंपरा और दिव्य-आदेश से शासन — राजकीय उदारता।' } },
  // Virgo: faces 1-3 (index 15-17)
  { archetype: { en: 'The Grain Maiden', hi: 'धान्य-कन्या' }, quality: { en: 'Humble practical service; discrimination between pure and impure, healing through detail and diligence.', hi: 'विनम्र व्यावहारिक सेवा; शुद्ध-अशुद्ध का विवेक, विस्तार और परिश्रम से उपचार।' } },
  { archetype: { en: 'The Analyst', hi: 'विश्लेषक' }, quality: { en: 'Methodical intelligence; accounting, classification, and systematic problem-solving — perfects what it touches.', hi: 'क्रमबद्ध बुद्धि; लेखा, वर्गीकरण और व्यवस्थित समस्या-समाधान — जो छूता है उसे परिष्कृत करता है।' } },
  { archetype: { en: 'The Discerning Traveller', hi: 'विवेकशील यात्री' }, quality: { en: 'Discriminating movement; strategic journeys in search of knowledge and improvement — critical observer.', hi: 'विवेकशील गति; ज्ञान और सुधार की खोज में रणनीतिक यात्राएं — आलोचनात्मक पर्यवेक्षक।' } },
  // Libra: faces 1-3 (index 18-20)
  { archetype: { en: 'The Just Judge', hi: 'न्यायी न्यायाधीश' }, quality: { en: 'Fair weigher of opposites; diplomatic, balanced, seeking harmony through rational deliberation.', hi: 'विपरीतताओं का न्यायपूर्ण तुलाकार; कूटनीतिक, संतुलित, तर्कसंगत विचार-विमर्श से सौहार्द।' } },
  { archetype: { en: 'The Social Grace', hi: 'सामाजिक सौजन्य' }, quality: { en: 'Aesthetic and social mastery; arts, beauty, relationship harmony — natural magnetism and charm.', hi: 'सौंदर्य और सामाजिक निपुणता; कला, सौंदर्य, संबंध-सौहार्द — प्राकृतिक चुंबकत्व।' } },
  { archetype: { en: 'The Righteous Sword', hi: 'धर्मी तलवार' }, quality: { en: 'Justice enforced; balance restored through decisive action — fights for fairness, cuts through deception.', hi: 'न्याय का प्रवर्तन; निर्णायक कार्य से संतुलन — निष्पक्षता के लिए लड़ता है, कपट काटता है।' } },
  // Scorpio: faces 1-3 (index 21-23)
  { archetype: { en: 'The Serpent Queen', hi: 'नागिन रानी' }, quality: { en: 'Occult power and hidden control; penetrates surface to reach core truth — magnetic and dangerous.', hi: 'गुप्त शक्ति और छिपा नियंत्रण; मूल सत्य तक पहुँचने के लिए सतह भेदना — चुंबकीय और घातक।' } },
  { archetype: { en: 'The Investigator', hi: 'जांचकर्ता' }, quality: { en: 'Relentless seeker of the hidden; research, investigation, and exposure of secrets — psychological depth.', hi: 'छिपे की अथक खोज; अनुसंधान, जांच और रहस्य उद्घाटन — मनोवैज्ञानिक गहराई।' } },
  { archetype: { en: 'The Transformer', hi: 'परिवर्तक' }, quality: { en: 'Death-and-rebirth cycle; profound alchemical transformation and spiritual regeneration from destruction.', hi: 'मृत्यु-पुनर्जन्म चक्र; विनाश से गहरा कायाकल्प और आध्यात्मिक पुनर्जन्म।' } },
  // Sagittarius: faces 1-3 (index 24-26)
  { archetype: { en: 'The Centaur Archer', hi: 'अश्व-धनुर्धर' }, quality: { en: 'Adventurous truth-seeker; aims high, explores distant horizons — bold philosophical questioning.', hi: 'साहसिक सत्य-साधक; ऊँचा लक्ष्य, दूर-क्षितिज अन्वेषण — साहसी दार्शनिक प्रश्न।' } },
  { archetype: { en: 'The Dharma Teacher', hi: 'धर्म-गुरु' }, quality: { en: 'Philosophical guide and guru; wisdom transmitted through teaching, scripture, and lived example.', hi: 'दार्शनिक मार्गदर्शक और गुरु; शिक्षण, शास्त्र और जीवन-उदाहरण से ज्ञान-प्रसार।' } },
  { archetype: { en: 'The Summit Seeker', hi: 'शिखर-अन्वेषक' }, quality: { en: 'Aspiring toward the highest truth; spiritual mountain-climber reaching for transcendent knowledge.', hi: 'उच्चतम सत्य की ओर आकांक्षा; अतिक्रामक ज्ञान के लिए आध्यात्मिक पर्वतारोहण।' } },
  // Capricorn: faces 1-3 (index 27-29)
  { archetype: { en: 'The Crocodile', hi: 'मगरमच्छ' }, quality: { en: 'Patient predator of achievement; lurks below the surface, waits for the right moment, seizes decisively.', hi: 'उपलब्धि का धैर्यवान शिकारी; सतह के नीचे इंतजार, सही समय पर दृढ़ता से ग्रहण।' } },
  { archetype: { en: 'The Mountain Climber', hi: 'पर्वतारोही' }, quality: { en: 'Determined ascent through toil; earthy ambition, step-by-step mastery — built to last.', hi: 'परिश्रम से दृढ़ आरोहण; भूमिगत महत्वाकांक्षा, क्रमशः महारत — स्थायित्व के लिए निर्मित।' } },
  { archetype: { en: 'The Enduring Sovereign', hi: 'चिरस्थायी संप्रभु' }, quality: { en: 'Authority through tested endurance; rules with gravitas and the weight of hard-won experience.', hi: 'परखी सहनशक्ति से अधिकार; गंभीरता और कठिन अनुभव के भार से शासन।' } },
  // Aquarius: faces 1-3 (index 30-32)
  { archetype: { en: 'The Water Bearer', hi: 'जल-वाहक' }, quality: { en: 'Universal distributor of wisdom; progressive, altruistic, pouring knowledge for collective benefit.', hi: 'ज्ञान का सार्वभौमिक वितरक; प्रगतिशील, परोपकारी, सामूहिक लाभ के लिए ज्ञान प्रदान।' } },
  { archetype: { en: 'The Innovator', hi: 'नवप्रवर्तक' }, quality: { en: 'Radical thinker and inventor; breaks existing forms to create new systems, technologies, and social structures.', hi: 'कट्टरपंथी विचारक और आविष्कारक; नई प्रणालियाँ, प्रौद्योगिकियाँ और सामाजिक संरचनाएं।' } },
  { archetype: { en: 'The Humanitarian Healer', hi: 'मानवतावादी उपचारक' }, quality: { en: 'Service to humanity at scale; combines scientific understanding with compassionate action for all.', hi: 'बड़े पैमाने पर मानवता-सेवा; वैज्ञानिक समझ और सर्वहित करुणापूर्ण कार्य का संयोग।' } },
  // Pisces: faces 1-3 (index 33-35)
  { archetype: { en: 'The Dreaming Fish', hi: 'स्वप्न-मछली' }, quality: { en: 'Boundless imagination and spiritual receptivity; psychic, visionary, dissolving into the cosmic ocean.', hi: 'असीमित कल्पना और आध्यात्मिक ग्रहणशीलता; मानसिक, द्रष्टा, ब्रह्मांडीय सागर में विलीन।' } },
  { archetype: { en: 'The Mystic Meditator', hi: 'रहस्यमय ध्यानी' }, quality: { en: 'Contemplative seeker of the formless; inward journey transcending mundane reality toward liberation.', hi: 'निराकार का चिंतनशील साधक; सांसारिक वास्तविकता से परे मुक्ति की ओर अंतर्यात्रा।' } },
  { archetype: { en: 'The Liberated Soul', hi: 'मुक्त आत्मा' }, quality: { en: 'Moksha-seeking consciousness; spiritual liberation, complete dissolution of ego, return to the source.', hi: 'मोक्ष-साधना चेतना; आध्यात्मिक मुक्ति, अहंकार का पूर्ण विसर्जन, स्रोत में वापसी।' } },
];

/** Return the Drekkana face (0-35) from sidereal longitude (0-360) */
function getDrekkanaFace(longitude: number): { faceIndex: number; sign: number; face: number } {
  const norm = ((longitude % 360) + 360) % 360;
  const sign = Math.floor(norm / 30) + 1;          // 1-12
  const face = Math.floor((norm % 30) / 10) + 1;   // 1-3
  const faceIndex = (sign - 1) * 3 + (face - 1);   // 0-35
  return { faceIndex, sign, face };
}

// ─── Chart-specific commentary generators ──────────────────────────────────

// Domain descriptions for each varga
const VARGA_DOMAINS: Record<string, { domain: Bi; desc: Bi }> = {
  D1: { domain: { en: 'Overall Life & Personality', hi: 'समग्र जीवन एवं व्यक्तित्व' }, desc: { en: 'The Rashi chart is the master chart from which all other divisional charts are derived. It shows the overall life trajectory, physical constitution, temperament, and general karmic pattern of the native.', hi: 'राशि चार्ट मास्टर चार्ट है जिससे अन्य सभी विभागीय चार्ट व्युत्पन्न होते हैं। यह जातक के समग्र जीवन पथ, शारीरिक संरचना, स्वभाव और सामान्य कार्मिक प्रारूप को दर्शाता है।' } },
  BC: { domain: { en: 'Actual House Occupancy', hi: 'वास्तविक भाव अधिवास' }, desc: { en: 'The Bhav Chalit chart shows where planets actually function in terms of house significations. Planets near cusp boundaries may shift houses from D1, revealing their true house influence. This is critical for prediction accuracy.', hi: 'भाव चलित चार्ट दर्शाता है कि ग्रह वास्तव में किस भाव में कार्य करते हैं। संधि के निकट ग्रह D1 से भाव बदल सकते हैं।' } },
  D2: { domain: { en: 'Wealth & Financial Prosperity', hi: 'धन एवं वित्तीय समृद्धि' }, desc: { en: 'The Hora chart divides each sign into Solar and Lunar halves. Sun\'s hora indicates wealth through effort, authority, and government. Moon\'s hora indicates wealth through public dealings, trade, and emotional intelligence. The balance of planets between these two horas reveals the native\'s wealth potential and earning style.', hi: 'होरा चार्ट प्रत्येक राशि को सौर और चंद्र अर्ध में विभाजित करता है। सूर्य होरा प्रयास, अधिकार से धन दर्शाता है। चंद्र होरा व्यापार, सार्वजनिक व्यवहार से।' } },
  D3: { domain: { en: 'Siblings, Courage & Initiative', hi: 'भाई-बहन, साहस एवं पहल' }, desc: { en: 'The Drekkana chart reveals the native\'s relationship with siblings, courage in adversity, and capacity for self-initiative. Strong benefics in D3 kendras indicate supportive siblings and innate bravery. The 3rd house of D3 is especially significant for younger siblings.', hi: 'द्रेष्काण चार्ट भाई-बहनों से संबंध, विपत्ति में साहस और आत्म-पहल की क्षमता दर्शाता है। D3 केंद्र में शुभ ग्रह सहायक सहोदर और जन्मजात वीरता दर्शाते हैं।' } },
  D4: { domain: { en: 'Property, Fortune & Fixed Assets', hi: 'संपत्ति, भाग्य एवं स्थावर संपदा' }, desc: { en: 'The Chaturthamsha chart governs immovable property, landed assets, vehicles, and general fortune (bhagya). A strong D4 indicates inheritance of property, successful real estate ventures, and comfortable living conditions. The 4th house here shows the home environment.', hi: 'चतुर्थांश चार्ट अचल संपत्ति, भूमि, वाहन और सामान्य भाग्य को नियंत्रित करता है। मजबूत D4 संपत्ति विरासत और सुखद जीवन स्थिति दर्शाता है।' } },
  D5: { domain: { en: 'Fame, Authority & Spiritual Merit', hi: 'यश, अधिकार एवं पुण्य' }, desc: { en: 'The Panchamsha chart relates to fame, dignity, authority, and accumulated spiritual merit (poorva punya). It shows the native\'s capacity to command respect and exercise power with wisdom. Strong D5 indicates recognition and honor in society.', hi: 'पंचमांश चार्ट यश, प्रतिष्ठा, अधिकार और संचित पूर्व पुण्य से संबंधित है। यह सम्मान और बुद्धिमत्ता से शक्ति प्रयोग की क्षमता दर्शाता है।' } },
  D6: { domain: { en: 'Health, Disease & Enemies', hi: 'स्वास्थ्य, रोग एवं शत्रु' }, desc: { en: 'The Shashthamsha chart reveals vulnerability to diseases, the nature of enemies, and legal disputes. Malefics in D6 kendras can indicate chronic health issues. Benefics in the 6th house of D6 actually give strength to overcome enemies and disease.', hi: 'षष्ठांश चार्ट रोग, शत्रुओं और कानूनी विवादों की प्रवृत्ति दर्शाता है। D6 केंद्र में पाप ग्रह दीर्घकालिक स्वास्थ्य समस्याओं का संकेत दे सकते हैं।' } },
  D7: { domain: { en: 'Children & Progeny', hi: 'संतान एवं वंशवृद्धि' }, desc: { en: 'The Saptamsha chart is the primary indicator for children — their number, nature, relationship with the native, and their success. The 5th house of D7 shows the first child, 7th shows the second. Jupiter\'s placement is crucial here.', hi: 'सप्तमांश चार्ट संतान का प्राथमिक सूचक है — उनकी संख्या, स्वभाव, जातक से संबंध और उनकी सफलता। D7 का 5वां भाव प्रथम संतान दर्शाता है।' } },
  D8: { domain: { en: 'Longevity & Sudden Events', hi: 'दीर्घायु एवं अप्रत्याशित घटनाएं' }, desc: { en: 'The Ashtamsha chart reveals longevity, sudden events, accidents, and transformative experiences. A strong D8 with benefics in kendras indicates long life and the ability to weather crises. The 8th house here shows the nature of the end.', hi: 'अष्टमांश चार्ट दीर्घायु, आकस्मिक घटनाएं, दुर्घटनाएं और परिवर्तनकारी अनुभव दर्शाता है। केंद्र में शुभ ग्रहों वाला मजबूत D8 दीर्घ जीवन दर्शाता है।' } },
  D9: { domain: { en: 'Marriage, Dharma & Soul Nature', hi: 'विवाह, धर्म एवं आत्म स्वरूप' }, desc: { en: 'The Navamsha is the most important divisional chart after D1. It reveals the soul\'s true nature (dharma), the quality of marriage and partnerships, spiritual evolution, and confirms or denies the promises of the birth chart. Planets that are strong in both D1 and D9 deliver powerful results. The D9 lagna shows your inner self — who you become after midlife. The 7th house of D9 is the primary indicator of spouse nature.', hi: 'नवांश D1 के बाद सबसे महत्वपूर्ण विभागीय चार्ट है। यह आत्मा का सच्चा स्वरूप (धर्म), विवाह की गुणवत्ता, आध्यात्मिक विकास दर्शाता है। D1 और D9 दोनों में बलवान ग्रह शक्तिशाली फल देते हैं। D9 लग्न आपका आन्तरिक स्व दर्शाता है। D9 का 7वाँ भाव जीवनसाथी का प्राथमिक सूचक है।' } },
  D10: { domain: { en: 'Career, Profession & Public Life', hi: 'करियर, व्यवसाय एवं सार्वजनिक जीवन' }, desc: { en: 'The Dasamsha is one of the most important divisional charts. It reveals the nature of career, professional achievements, fame in one\'s field, and relationship with authority figures. The 10th house and its lord in D10 are paramount for career success.', hi: 'दशांश सबसे महत्वपूर्ण विभागीय चार्टों में से एक है। यह करियर, व्यावसायिक उपलब्धियाँ, क्षेत्र में प्रसिद्धि और अधिकारियों से संबंध दर्शाता है।' } },
  D12: { domain: { en: 'Parents, Ancestry & Lineage', hi: 'माता-पिता, वंशावली' }, desc: { en: 'The Dwadasamsha chart shows the relationship with parents, family lineage, and inherited traits. The 4th house represents the mother and the 9th/10th the father. Strong D12 indicates a distinguished family background and good relationship with parents.', hi: 'द्वादशांश चार्ट माता-पिता से संबंध, पारिवारिक वंशावली और विरासत में मिले गुण दर्शाता है। 4वां भाव माता और 9वां/10वां पिता का प्रतिनिधित्व करता है।' } },
  D16: { domain: { en: 'Vehicles, Comforts & Luxuries', hi: 'वाहन, सुख एवं विलासिता' }, desc: { en: 'The Shodasamsha chart governs vehicles, conveyances, and material comforts. In the modern context, this extends to cars, properties used for pleasure, and technological devices. Strong Venus or Jupiter in D16 indicates acquisition of luxurious items.', hi: 'षोडशांश चार्ट वाहन, यातायात साधन और भौतिक सुखों को नियंत्रित करता है। आधुनिक संदर्भ में यह कार, सुख-संपत्ति और तकनीकी उपकरणों तक विस्तृत है।' } },
  D20: { domain: { en: 'Spiritual Progress & Upasana', hi: 'आध्यात्मिक प्रगति एवं उपासना' }, desc: { en: 'The Vimshamsha chart reveals spiritual inclinations, devotional practices (upasana), and progress on the spiritual path. Jupiter and Ketu\'s placement here is crucial. A strong D20 indicates natural inclination toward meditation, mantra, and spiritual wisdom.', hi: 'विंशांश चार्ट आध्यात्मिक प्रवृत्तियों, भक्ति साधनाओं और आध्यात्मिक मार्ग पर प्रगति दर्शाता है। गुरु और केतु की स्थिति यहाँ महत्वपूर्ण है।' } },
  D24: { domain: { en: 'Education, Learning & Knowledge', hi: 'शिक्षा, विद्या एवं ज्ञान' }, desc: { en: 'The Chaturvimshamsha chart governs education, academic achievements, and the nature of knowledge the native acquires. Mercury and Jupiter\'s strength here determines intellectual capacity. The 4th house shows formal education, 5th shows creative intelligence.', hi: 'चतुर्विंशांश चार्ट शिक्षा, शैक्षणिक उपलब्धियों और ज्ञान की प्रकृति को नियंत्रित करता है। बुध और गुरु की शक्ति बौद्धिक क्षमता निर्धारित करती है।' } },
  D27: { domain: { en: 'Strengths, Vitality & Stamina', hi: 'बल, ओज एवं सहनशक्ति' }, desc: { en: 'The Nakshatramsha chart indicates physical and mental strength, vitality, and endurance. Mars and Sun\'s placement here reveals the native\'s stamina and fighting spirit. A strong D27 indicates robust health and the ability to sustain effort.', hi: 'नक्षत्रांश चार्ट शारीरिक और मानसिक बल, ओज और सहनशक्ति दर्शाता है। मंगल और सूर्य की स्थिति जातक की सहनशीलता और लड़ाकू भावना दर्शाती है।' } },
  D30: { domain: { en: 'Misfortunes, Evils & Suffering', hi: 'दुर्भाग्य, पाप एवं कष्ट' }, desc: { en: 'The Trimshamsha chart reveals vulnerability to misfortune, evil influences, and suffering. It specifically shows dangers from hidden enemies, black magic, and negative karmic patterns. Benefics in D30 kendras protect against such influences.', hi: 'त्रिंशांश चार्ट दुर्भाग्य, बुरे प्रभावों और कष्टों के प्रति संवेदनशीलता दर्शाता है। D30 केंद्र में शुभ ग्रह ऐसे प्रभावों से रक्षा करते हैं।' } },
  D40: { domain: { en: 'Auspicious/Inauspicious Effects (Maternal)', hi: 'शुभाशुभ प्रभाव (मातृपक्ष)' }, desc: { en: 'The Khavedamsha chart shows auspicious and inauspicious effects inherited from the maternal side. It indicates the blessings or karmic debts from the mother\'s lineage and how they manifest in the native\'s life.', hi: 'खवेदांश चार्ट मातृपक्ष से विरासत में मिले शुभ और अशुभ प्रभाव दर्शाता है। यह माता के वंश से मिले आशीर्वाद या कार्मिक ऋण को दर्शाता है।' } },
  D45: { domain: { en: 'General Indications (Paternal)', hi: 'सामान्य संकेत (पितृपक्ष)' }, desc: { en: 'The Akshavedamsha chart reveals effects inherited from the paternal lineage. It shows the father\'s karmic legacy and how it shapes the native\'s destiny, character, and life opportunities.', hi: 'अक्षवेदांश चार्ट पितृवंश से विरासत में मिले प्रभावों को दर्शाता है। यह पिता की कार्मिक विरासत और जातक के भाग्य पर उसके प्रभाव को दर्शाता है।' } },
  D60: { domain: { en: 'Past Life Karma & Overall Assessment', hi: 'पूर्वजन्म कर्म एवं समग्र मूल्यांकन' }, desc: { en: 'The Shashtiamsha is considered the most subtle and important divisional chart by Parashara. It reveals past life karmic patterns and their present-life fruition. Each of the 60 divisions has a specific deity and quality. Strong D60 confirms the promises of other charts.', hi: 'षष्ट्यंश को पराशर द्वारा सबसे सूक्ष्म और महत्वपूर्ण विभागीय चार्ट माना गया है। यह पूर्वजन्म के कार्मिक प्रारूपों और उनके वर्तमान जीवन में फलित होने को दर्शाता है।' } },
};

// ─── Core analysis ──────────────────────────────────────────────────────────

function analyzeChart(
  chartKey: string,
  chart: { houses: number[][]; ascendantSign: number },
  kundali: KundaliData,
  locale: string,
): VargaChartTippanni {
  const domain = VARGA_DOMAINS[chartKey] || { domain: { en: chartKey, hi: chartKey }, desc: { en: '', hi: '' } };
  const ascLord = signLord(chart.ascendantSign);
  const ascLordName = PN[ascLord] || PN[0];
  const ascRashi = rashiName(chart.ascendantSign, locale);

  // Find lagna lord house
  let ascLordHouse = 1;
  for (let h = 0; h < 12; h++) {
    if (chart.houses[h].includes(ascLord)) { ascLordHouse = h + 1; break; }
  }

  // Count benefics/malefics in key houses
  let beneficInGood = 0, maleficInDusthana = 0, beneficInKendra = 0;
  const planetHouseMap: Record<number, number> = {};
  for (let h = 0; h < 12; h++) {
    for (const pid of chart.houses[h]) {
      planetHouseMap[pid] = h + 1;
      if (BENEFICS.has(pid) && GOOD.has(h + 1)) beneficInGood++;
      if (BENEFICS.has(pid) && KENDRAS.has(h + 1)) beneficInKendra++;
      if (MALEFICS.has(pid) && DUSTHANAS.has(h + 1)) maleficInDusthana++;
    }
  }

  const strength: 'strong' | 'moderate' | 'weak' = beneficInGood >= 3 ? 'strong' : beneficInGood >= 1 ? 'moderate' : 'weak';

  // ─── Key findings ────────────────────────────────────────────
  const findings: Bi[] = [];

  // Lagna lord
  findings.push({
    en: `${chartKey} Ascendant: ${rashiName(chart.ascendantSign, 'en')} — Lagna lord ${ascLordName.en} placed in the ${ord(ascLordHouse)} house${GOOD.has(ascLordHouse) ? ' (favorable position)' : DUSTHANAS.has(ascLordHouse) ? ' (challenging — dusthana placement)' : ''}.`,
    hi: `${chartKey} लग्न: ${rashiName(chart.ascendantSign, 'hi')} — लग्नेश ${ascLordName.hi} ${ascLordHouse}वें भाव में${GOOD.has(ascLordHouse) ? ' (अनुकूल स्थिति)' : DUSTHANAS.has(ascLordHouse) ? ' (चुनौतीपूर्ण — दुःस्थान)' : ''}।`,
  });

  // Planets in 1st house
  const h1 = planetsIn(chart, 1);
  if (h1.length > 0) {
    const names = h1.map(p => PN[p]?.en || '').join(', ');
    const namesHi = h1.map(p => PN[p]?.hi || '').join(', ');
    const hasBenefic = h1.some(p => BENEFICS.has(p));
    findings.push({
      en: `${names} in ${chartKey} lagna — ${hasBenefic ? 'benefic influence strengthens this domain naturally' : 'malefic influence brings challenges requiring conscious effort'}.`,
      hi: `${namesHi} ${chartKey} लग्न में — ${hasBenefic ? 'शुभ प्रभाव इस क्षेत्र को स्वाभाविक रूप से सशक्त करता है' : 'पाप प्रभाव चुनौतियाँ लाता है, सचेत प्रयास आवश्यक'}।`,
    });
  }

  // Jupiter check
  const jupHouse = planetHouseMap[4];
  if (jupHouse && KENDRAS.has(jupHouse)) {
    findings.push({
      en: `Jupiter in ${ord(jupHouse)} house of ${chartKey} — powerful protection and growth. Jupiter's grace is active in this life area.`,
      hi: `${chartKey} के ${jupHouse}वें भाव में गुरु — शक्तिशाली सुरक्षा और विकास। गुरु कृपा इस जीवन क्षेत्र में सक्रिय।`,
    });
  }

  // Venus check (for D2, D16, D4)
  const venHouse = planetHouseMap[5];
  if (venHouse && ['D2', 'D4', 'D16'].includes(chartKey)) {
    findings.push({
      en: `Venus in ${ord(venHouse)} house — ${GOOD.has(venHouse) ? 'enhances material comforts and aesthetic pleasures' : 'material desires may face obstacles'}.`,
      hi: `${venHouse}वें भाव में शुक्र — ${GOOD.has(venHouse) ? 'भौतिक सुख और सौंदर्य संवर्धन' : 'भौतिक इच्छाओं में बाधा संभव'}।`,
    });
  }

  // Saturn check
  const satHouse = planetHouseMap[6];
  if (satHouse) {
    findings.push({
      en: `Saturn in ${ord(satHouse)} house — ${DUSTHANAS.has(satHouse) ? 'karmic delays in this area; patience and perseverance yield eventual results' : KENDRAS.has(satHouse) ? 'structured approach brings steady, long-term success' : 'moderate Saturn influence, disciplined effort helps'}.`,
      hi: `${satHouse}वें भाव में शनि — ${DUSTHANAS.has(satHouse) ? 'इस क्षेत्र में कार्मिक विलंब; धैर्य और लगन से परिणाम' : KENDRAS.has(satHouse) ? 'व्यवस्थित दृष्टिकोण से दीर्घकालिक सफलता' : 'मध्यम शनि प्रभाव, अनुशासित प्रयास सहायक'}।`,
    });
  }

  // Rahu-Ketu axis
  const rahuH = planetHouseMap[7];
  const ketuH = planetHouseMap[8];
  if (rahuH && ketuH) {
    findings.push({
      en: `Rahu-Ketu axis in ${ord(rahuH)}-${ord(ketuH)} houses — karmic growth axis active in these domains. Rahu brings obsessive desire, Ketu brings detachment and spiritual insight.`,
      hi: `राहु-केतु अक्ष ${rahuH}-${ketuH} भावों में — इन क्षेत्रों में कार्मिक विकास अक्ष सक्रिय। राहु तीव्र इच्छा, केतु वैराग्य और आध्यात्मिक अंतर्दृष्टि लाता है।`,
    });
  }

  // ─── D3-specific: Drekkana face archetypes per planet ────────
  if (chartKey === 'D3' && kundali.planets && kundali.planets.length > 0) {
    const SIGN_NAMES: Record<number, Bi> = {
      1: { en: 'Aries', hi: 'मेष' }, 2: { en: 'Taurus', hi: 'वृष' }, 3: { en: 'Gemini', hi: 'मिथुन' },
      4: { en: 'Cancer', hi: 'कर्क' }, 5: { en: 'Leo', hi: 'सिंह' }, 6: { en: 'Virgo', hi: 'कन्या' },
      7: { en: 'Libra', hi: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक' }, 9: { en: 'Sagittarius', hi: 'धनु' },
      10: { en: 'Capricorn', hi: 'मकर' }, 11: { en: 'Aquarius', hi: 'कुंभ' }, 12: { en: 'Pisces', hi: 'मीन' },
    };
    // Add section header
    findings.push({
      en: '— Drekkana Face Archetypes (Varahamihira, Brihat Jataka Ch.27) —',
      hi: '— द्रेष्काण मुख आदर्श (वराहमिहिर, बृहज्जातक अ.27) —',
    });
    for (const pp of kundali.planets) {
      const pid = pp.planet.id;
      if (pid === 7 || pid === 8) continue; // skip Rahu/Ketu — shadow, no physical face
      const { faceIndex, sign, face } = getDrekkanaFace(pp.longitude);
      const df = DREKKANA_FACES[faceIndex];
      if (!df) continue;
      const signNameEn = SIGN_NAMES[sign]?.en || '';
      const signNameHi = SIGN_NAMES[sign]?.hi || '';
      const pName = PN[pid];
      if (!pName) continue;
      findings.push({
        en: `${pName.en} — "${df.archetype.en}" (${signNameEn} face ${face}): ${df.quality.en}`,
        hi: `${pName.hi} — "${df.archetype.hi}" (${signNameHi} मुख ${face}): ${df.quality.hi}`,
      });
    }
  }

  // ─── Overall Commentary ──────────────────────────────────────
  const strengthWord = { strong: { en: 'strong', hi: 'बलवान' }, moderate: { en: 'moderate', hi: 'मध्यम' }, weak: { en: 'weak', hi: 'दुर्बल' } }[strength];

  const overallCommentary: Bi = {
    en: `${domain.desc.en}\n\nIn your chart, ${chartKey} shows ${strengthWord.en} strength with ${rashiName(chart.ascendantSign, 'en')} rising. The lagna lord ${ascLordName.en} is placed in the ${ord(ascLordHouse)} house${GOOD.has(ascLordHouse) ? ', which supports positive outcomes in this domain' : DUSTHANAS.has(ascLordHouse) ? ', suggesting challenges that require remedial measures and conscious effort' : ''}. ${beneficInKendra > 0 ? `With ${beneficInKendra} benefic(s) in kendras, there is inherent support for this area of life.` : 'The absence of benefics in kendras suggests that results in this domain come through sustained effort rather than natural fortune.'}${maleficInDusthana > 0 ? ` ${maleficInDusthana} malefic(s) in dusthanas here can actually be protective — malefics in the 6th house defeat enemies.` : ''}`,
    hi: `${domain.desc.hi}\n\nआपके चार्ट में, ${chartKey} ${strengthWord.hi} बल दर्शाता है, ${rashiName(chart.ascendantSign, 'hi')} उदय हो रहा है। लग्नेश ${ascLordName.hi} ${ascLordHouse}वें भाव में स्थित हैं${GOOD.has(ascLordHouse) ? ', जो इस क्षेत्र में अनुकूल परिणामों का समर्थन करता है' : DUSTHANAS.has(ascLordHouse) ? ', जो चुनौतियों का संकेत है जिनके लिए उपचारात्मक उपाय आवश्यक हैं' : ''}। ${beneficInKendra > 0 ? `केंद्र में ${beneficInKendra} शुभ ग्रह से इस जीवन क्षेत्र में स्वाभाविक समर्थन मिलता है।` : 'केंद्र में शुभ ग्रहों की अनुपस्थिति बताती है कि इस क्षेत्र में परिणाम निरंतर प्रयास से आते हैं।'}`,
  };

  // ─── Prognosis (next 1-2 years) — layered domain-specific engine ─
  const currentDasha = findCurrentDasha(kundali.dashas);
  let prognosis: Bi;

  if (currentDasha) {
    const mahaPid = planetId(currentDasha.maha.planet);
    const antarPid = currentDasha.antar ? planetId(currentDasha.antar.planet) : -1;
    const mahaHouseInChart = planetHouseMap[mahaPid];
    const antarHouseInChart = antarPid >= 0 ? planetHouseMap[antarPid] : undefined;

    const mahaName = currentDasha.maha.planetName;
    const antarName = currentDasha.antar?.planetName;

    prognosis = generateDashaPrognosis({
      chartKey,
      domainEn: domain.domain.en,
      domainHi: domain.domain.hi,
      mahaPlanetId: mahaPid,
      mahaPlanetNameEn: mahaName.en,
      mahaPlanetNameHi: mahaName.hi,
      mahaHouse: mahaHouseInChart,
      antarPlanetId: antarPid,
      antarPlanetNameEn: antarName?.en || '',
      antarPlanetNameHi: antarName?.hi || '',
      antarHouse: antarHouseInChart,
      antarEndDate: currentDasha.antar?.endDate,
      ascendantSign: chart.ascendantSign,
      beneficsInKendra: beneficInKendra,
      maleficsInDusthana: maleficInDusthana,
    });
  } else {
    prognosis = {
      en: `Dasha data not available for prognosis. Generate a kundali with accurate birth time for detailed timing predictions in ${domain.domain.en.toLowerCase()}.`,
      hi: `प्रगति के लिए दशा डेटा उपलब्ध नहीं। ${domain.domain.hi} में विस्तृत समय पूर्वानुमान के लिए सटीक जन्म समय के साथ कुण्डली बनाएं।`,
    };
  }

  // Determine chart meaning
  const dcMeaning = (VARGA_DOMAINS[chartKey]?.domain) || { en: chartKey, hi: chartKey };
  const dcLabel = VARGA_DOMAINS[chartKey]?.domain || { en: chartKey, hi: chartKey };

  return {
    chart: chartKey,
    label: dcLabel,
    meaning: dcMeaning,
    strength,
    overallCommentary,
    prognosis,
    keyFindings: findings,
  };
}

// ─── Main export ────────────────────────────────────────────────────────────

export function generateVargaTippanni(kundali: KundaliData, locale: Locale): VargaSynthesis {
  const vargaInsights: VargaChartTippanni[] = [];
  const strongAreas: Bi[] = [];
  const weakAreas: Bi[] = [];

  // D1
  vargaInsights.push(analyzeChart('D1', kundali.chart, kundali, locale));

  // Bhav Chalit
  if (kundali.bhavChalitChart) {
    vargaInsights.push(analyzeChart('BC', kundali.bhavChalitChart, kundali, locale));
  }

  // D9
  vargaInsights.push(analyzeChart('D9', kundali.navamshaChart, kundali, locale));

  // All other divisional charts
  if (kundali.divisionalCharts) {
    for (const [key, dc] of Object.entries(kundali.divisionalCharts)) {
      vargaInsights.push(analyzeChart(key, dc, kundali, locale));
    }
  }

  // Categorize
  for (const v of vargaInsights) {
    if (v.strength === 'strong') strongAreas.push(v.meaning);
    else if (v.strength === 'weak') weakAreas.push(v.meaning);
  }

  // Synthesis
  const strongCount = vargaInsights.filter(v => v.strength === 'strong').length;
  const weakCount = vargaInsights.filter(v => v.strength === 'weak').length;
  const total = vargaInsights.length;

  let overallEn: string, overallHi: string;
  if (strongCount > total * 0.5) {
    overallEn = `Across ${total} divisional charts analyzed, ${strongCount} show strong varga strength — this is an excellent overall chart. The native has accumulated significant positive karma across multiple life domains. Key benefic placements in kendras and trikonas provide natural support. Focus particularly on D9 (marriage/dharma) and D10 (career) for the most impactful life outcomes. The D60 (Shashtiamsha) confirms the overall karmic trajectory.`;
    overallHi = `विश्लेषित ${total} विभागीय चार्टों में ${strongCount} मजबूत वर्ग बल दिखाते हैं — यह उत्कृष्ट समग्र कुंडली है। जातक ने कई जीवन क्षेत्रों में महत्वपूर्ण सकारात्मक कर्म संचित किए हैं। D9 (विवाह/धर्म) और D10 (करियर) पर विशेष ध्यान दें।`;
  } else if (weakCount > total * 0.4) {
    overallEn = `The varga analysis reveals ${weakCount} out of ${total} charts showing weakness — this indicates karmic lessons across multiple areas. However, this is not deterministic; remedial measures, gemstones, mantras, and conscious effort can significantly mitigate challenges. The strong charts (${strongCount}) show areas of natural talent and support that can be leveraged. Past life karma (D60) shapes the foundation, but present actions (D1, D10) determine the outcome.`;
    overallHi = `वर्ग विश्लेषण ${total} में से ${weakCount} चार्ट में दुर्बलता दर्शाता है — यह कई क्षेत्रों में कार्मिक शिक्षा का संकेत है। हालांकि, उपचारात्मक उपाय, रत्न, मंत्र और सचेत प्रयास चुनौतियों को काफी हद तक कम कर सकते हैं। मजबूत चार्ट (${strongCount}) प्राकृतिक प्रतिभा के क्षेत्र दर्शाते हैं।`;
  } else {
    overallEn = `The varga analysis presents a balanced picture with ${strongCount} strong, ${total - strongCount - weakCount} moderate, and ${weakCount} weak charts out of ${total} total. This is a typical and workable configuration — most people have a mix of strengths and growth areas. The divisional charts that show strength indicate domains where results come naturally, while weaker charts point to areas requiring more conscious effort, remedial practices, or spiritual growth. The current dasha period will activate specific charts — check the prognosis section of each chart for timing insights.`;
    overallHi = `वर्ग विश्लेषण ${total} में से ${strongCount} बलवान, ${total - strongCount - weakCount} मध्यम और ${weakCount} दुर्बल चार्टों के साथ संतुलित चित्र प्रस्तुत करता है। यह एक विशिष्ट और साध्य विन्यास है। शक्तिशाली चार्ट स्वाभाविक परिणामों के क्षेत्र दर्शाते हैं, जबकि कमजोर चार्ट अधिक प्रयास की आवश्यकता वाले क्षेत्र इंगित करते हैं।`;
  }

  return {
    overall: { en: overallEn, hi: overallHi },
    strongAreas,
    weakAreas,
    vargaInsights,
  };
}
