'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown, Clock, AlertTriangle, BookOpen, Shield, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { ShareRow } from '@/components/ui/ShareButton';
import AdUnit from '@/components/ads/AdUnit';
import AuthorByline from '@/components/ui/AuthorByline';
import type { Locale } from '@/types/panchang';

// ─── Inline LABELS (en + hi, ta/bn fall back to en) ─────────────────────────
const L: Record<string, Record<string, string>> = {
  title: { en: 'Dasha Sandhi — Junction Periods Between Planetary Dashas', hi: 'दशा सन्धि — ग्रह दशाओं के संक्रमण काल' },
  subtitle: { en: 'The critical transition windows where one planetary period gives way to the next — and why the ancients warned about them.', hi: 'वह संवेदनशील संक्रमण काल जहाँ एक ग्रह की दशा दूसरे को मार्ग देती है — और प्राचीन ऋषियों ने इनके बारे में क्यों चेतावनी दी।' },

  // Section 1 — Introduction
  introTitle: { en: 'What is Dasha Sandhi?', hi: 'दशा सन्धि क्या है?' },
  introP1: { en: 'In Vedic astrology, the term "Sandhi" (सन्धि) means junction, joint, or meeting point. Dasha Sandhi refers to the transitional period at the junction of two consecutive planetary Dashas — the twilight zone where the influence of one planetary lord wanes and the next begins to assert itself.', hi: 'वैदिक ज्योतिष में "सन्धि" शब्द का अर्थ है संधि, जोड़ या मिलन बिंदु। दशा सन्धि दो क्रमागत ग्रह दशाओं के संक्रमण काल को संदर्भित करती है — वह संध्या-काल जहाँ एक ग्रह स्वामी का प्रभाव क्षीण होता है और अगला अपना प्रभाव स्थापित करना आरम्भ करता है।' },
  introP2: { en: 'Just as dawn and dusk are neither day nor night — possessing a liminal, unsettled quality — Dasha Sandhi is a period of vulnerability and uncertainty. The native experiences a blurring of themes: the old life structure hasn\'t fully dissolved, yet the new one hasn\'t crystallized. This is why classical texts universally advise caution during these windows.', hi: 'जैसे उषा और संध्या न दिन हैं न रात — एक अनिश्चित, अस्थिर गुणवत्ता रखती हैं — दशा सन्धि भी असुरक्षा और अनिश्चितता का काल है। जातक विषयों का धुँधलापन अनुभव करता है: पुरानी जीवन संरचना पूरी तरह विलीन नहीं हुई, फिर भी नई स्फटिकित नहीं हुई। इसीलिए शास्त्रीय ग्रंथ सर्वसम्मति से इन अवधियों में सावधानी की सलाह देते हैं।' },
  introP3: { en: 'Classical references: Brihat Parashara Hora Shastra (BPHS) Chapter 46 explicitly discusses the effects of Dasha junctions. Phaladeepika by Mantreshwara (Ch.20) notes that the last portion of a Dasha and the beginning of the next carry mixed, unreliable results. The Uttara Kalamrita further elaborates on remedial measures during these sensitive windows.', hi: 'शास्त्रीय संदर्भ: बृहत् पाराशर होरा शास्त्र (BPHS) अध्याय 46 में दशा संधि के प्रभावों पर स्पष्ट चर्चा है। मन्त्रेश्वर द्वारा लिखित फलदीपिका (अध्याय 20) में बताया गया है कि दशा का अंतिम भाग और अगली का आरम्भ मिश्रित, अविश्वसनीय फल देता है। उत्तर कालामृत इन संवेदनशील अवधियों में उपचारात्मक उपायों पर विस्तार से प्रकाश डालता है।' },

  // Section 2 — Types
  typesTitle: { en: 'Types of Dasha Sandhi', hi: 'दशा सन्धि के प्रकार' },
  mahaSandhiTitle: { en: 'Maha Dasha Sandhi', hi: 'महादशा सन्धि' },
  mahaSandhiDesc: { en: 'The junction between two major planetary periods. This is the most powerful and consequential Sandhi. It marks a fundamental shift in life direction — the thematic landscape of your entire existence changes. The Sandhi window spans the last 10% of the outgoing Maha Dasha and the first 10% of the incoming one.', hi: 'दो प्रमुख ग्रह अवधियों के बीच का संधि काल। यह सबसे शक्तिशाली और परिणामी सन्धि है। यह जीवन दिशा में मौलिक परिवर्तन को चिह्नित करती है। सन्धि अवधि निवर्तमान महादशा के अंतिम 10% और आगामी के प्रथम 10% तक फैली होती है।' },
  mahaSandhiDuration: { en: 'Duration: Typically 1.5 to 4 years depending on the Dasha lengths involved. For example, Saturn (19y) to Mercury (17y) Sandhi spans approximately 3.6 years (1.9y + 1.7y).', hi: 'अवधि: सामान्यतः 1.5 से 4 वर्ष, सम्बद्ध दशा अवधियों पर निर्भर। उदाहरण: शनि (19 वर्ष) से बुध (17 वर्ष) सन्धि लगभग 3.6 वर्ष (1.9 + 1.7) तक फैली होती है।' },

  antarSandhiTitle: { en: 'Antar Dasha Sandhi', hi: 'अन्तर्दशा सन्धि' },
  antarSandhiDesc: { en: 'The junction between two sub-periods within a Maha Dasha. More frequent but less intense than Maha Dasha Sandhi. These transitions shift the "sub-theme" while the overarching Maha Dasha theme continues. Calculated as the last 10% of the outgoing Antar Dasha + first 10% of the incoming Antar Dasha.', hi: 'एक महादशा के भीतर दो उप-अवधियों के बीच का संधि काल। महादशा सन्धि से अधिक बारम्बार किन्तु कम तीव्र। ये संक्रमण "उप-विषय" को बदलते हैं जबकि व्यापक महादशा विषय जारी रहता है।' },
  antarSandhiDuration: { en: 'Duration: Typically 1 to 6 months. Shifts are noticeable but manageable.', hi: 'अवधि: सामान्यतः 1 से 6 मास। परिवर्तन ध्यान देने योग्य किन्तु प्रबन्धनीय।' },

  pratyantarSandhiTitle: { en: 'Pratyantar Dasha Sandhi', hi: 'प्रत्यन्तर दशा सन्धि' },
  pratyantarSandhiDesc: { en: 'The junction between two sub-sub-periods. These are brief fluctuations — a few days to a few weeks. While individually minor, they create the fine texture of daily life experience. Most people don\'t notice these consciously, but they correlate with mood shifts, minor events, and changes in focus.', hi: 'दो प्रत्यन्तर अवधियों के बीच का संधि काल। ये संक्षिप्त उतार-चढ़ाव हैं — कुछ दिनों से कुछ सप्ताह तक। व्यक्तिगत रूप से मामूली होते हुए भी, ये दैनिक जीवन अनुभव की सूक्ष्म बनावट बनाते हैं।' },
  pratyantarSandhiDuration: { en: 'Duration: Days to weeks. Felt as subtle shifts in energy, focus, or mood.', hi: 'अवधि: कुछ दिनों से सप्ताह तक। ऊर्जा, ध्यान या मनोदशा में सूक्ष्म परिवर्तन अनुभव होता है।' },

  // Section 3 — Calculation
  calcTitle: { en: 'How Sandhi Duration is Calculated', hi: 'सन्धि अवधि की गणना कैसे होती है' },
  calcIntro: { en: 'The calculation follows a straightforward principle: the Sandhi window is the last 10% of the outgoing Dasha plus the first 10% of the incoming Dasha. Here is a step-by-step worked example:', hi: 'गणना एक सरल सिद्धांत पर आधारित है: सन्धि अवधि निवर्तमान दशा के अंतिम 10% और आगामी दशा के प्रथम 10% का योग है। यहाँ चरण-दर-चरण उदाहरण है:' },
  calcStep1: { en: 'Step 1: Identify the two consecutive Maha Dashas. Example: Saturn Maha Dasha (19 years) followed by Mercury Maha Dasha (17 years).', hi: 'चरण 1: दो क्रमागत महादशाओं को पहचानें। उदाहरण: शनि महादशा (19 वर्ष) के बाद बुध महादशा (17 वर्ष)।' },
  calcStep2: { en: 'Step 2: Calculate 10% of the outgoing Dasha duration. Saturn: 19 years x 10% = 1.9 years (approximately 1 year, 10 months, 24 days).', hi: 'चरण 2: निवर्तमान दशा की अवधि का 10% गणना करें। शनि: 19 वर्ष x 10% = 1.9 वर्ष (लगभग 1 वर्ष, 10 मास, 24 दिन)।' },
  calcStep3: { en: 'Step 3: Calculate 10% of the incoming Dasha duration. Mercury: 17 years x 10% = 1.7 years (approximately 1 year, 8 months, 12 days).', hi: 'चरण 3: आगामी दशा की अवधि का 10% गणना करें। बुध: 17 वर्ष x 10% = 1.7 वर्ष (लगभग 1 वर्ष, 8 मास, 12 दिन)।' },
  calcStep4: { en: 'Step 4: The total Sandhi window = 1.9 + 1.7 = 3.6 years. This window is centered on the exact Dasha transition date.', hi: 'चरण 4: कुल सन्धि अवधि = 1.9 + 1.7 = 3.6 वर्ष। यह अवधि दशा संक्रमण की सटीक तिथि के चारों ओर केन्द्रित है।' },
  calcStep5: { en: 'Step 5: Determine intensity. Saturn and Mercury are neutral to each other (neither friends nor enemies), so this Sandhi is rated "moderate" — confusion and mixed signals are likely, but without the turbulence of an enemy transition.', hi: 'चरण 5: तीव्रता निर्धारित करें। शनि और बुध एक-दूसरे के प्रति तटस्थ हैं (न मित्र न शत्रु), इसलिए यह सन्धि "मध्यम" श्रेणी की है — भ्रम और मिश्रित संकेत संभव, किन्तु शत्रुता वाले संक्रमण जैसी अशांति नहीं।' },

  // Section 4 — Effects
  effectsTitle: { en: 'Effects and Significance', hi: 'प्रभाव और महत्त्व' },
  effectsIntro: { en: 'The effects during Dasha Sandhi depend primarily on two factors: the natural relationship between the outgoing and incoming lords, and whether these planets are functional benefics or malefics for the specific Lagna.', hi: 'दशा सन्धि के दौरान प्रभाव मुख्यतः दो कारकों पर निर्भर करते हैं: निवर्तमान और आगामी स्वामी के बीच नैसर्गिक सम्बन्ध, और क्या ये ग्रह विशिष्ट लग्न के लिए कार्यात्मक शुभ या अशुभ हैं।' },
  effectsGeneral: { en: 'General vulnerability patterns during Sandhi:', hi: 'सन्धि के दौरान सामान्य असुरक्षा प्रवृत्तियाँ:' },

  // Section 5 — Classical Texts
  classicalTitle: { en: 'Classical Text References', hi: 'शास्त्रीय ग्रन्थ संदर्भ' },

  // Section 6 — Modern Context
  modernTitle: { en: 'Modern Context: Psychology of Transition', hi: 'आधुनिक संदर्भ: संक्रमण का मनोविज्ञान' },
  modernP1: { en: 'From a psychological perspective, Dasha Sandhi maps remarkably well onto what developmental psychology calls "liminal periods" — threshold states where identity is in flux. Just as adolescence (the sandhi between childhood and adulthood) is marked by confusion, identity experimentation, and heightened vulnerability, planetary Sandhi periods bring analogous inner turbulence.', hi: 'मनोवैज्ञानिक दृष्टिकोण से, दशा सन्धि विकासात्मक मनोविज्ञान में "सीमान्त अवधि" कहलाने वाली अवस्थाओं से उल्लेखनीय रूप से मेल खाती है — वे दहलीज अवस्थाएँ जहाँ पहचान परिवर्तनशील होती है।' },
  modernP2: { en: 'William Bridges\' "Transitions" model describes three phases: Ending (letting go of the old), the Neutral Zone (confusion, between identities), and New Beginning. This maps directly to the Sandhi experience: the tail of the outgoing Dasha is the Ending, the junction itself is the Neutral Zone, and the early incoming Dasha is the New Beginning.', hi: 'विलियम ब्रिज का "ट्रांजिशन" मॉडल तीन चरणों का वर्णन करता है: समाप्ति (पुराने को छोड़ना), तटस्थ क्षेत्र (भ्रम, पहचानों के बीच), और नई शुरुआत। यह सन्धि अनुभव से सीधे मेल खाता है।' },
  modernP3: { en: 'The practical insight: knowing that confusion and instability during Sandhi is structurally normal (not a personal failing) can itself be therapeutic. It is the cosmic equivalent of jet lag — disorienting but temporary, and best navigated with patience rather than panic.', hi: 'व्यावहारिक अंतर्दृष्टि: यह जानना कि सन्धि के दौरान भ्रम और अस्थिरता संरचनात्मक रूप से सामान्य है (व्यक्तिगत असफलता नहीं), स्वयं चिकित्सात्मक हो सकता है। यह जेट लैग का ब्रह्माण्डीय समतुल्य है।' },

  // Section 7 — Remedies
  remediesTitle: { en: 'Remedial Measures During Sandhi', hi: 'सन्धि काल में उपचारात्मक उपाय' },
  remediesIntro: { en: 'Classical texts prescribe specific remedies to navigate Sandhi periods smoothly. These should ideally begin before the Sandhi window opens:', hi: 'शास्त्रीय ग्रन्थ सन्धि काल को सुचारू रूप से पार करने के लिए विशिष्ट उपाय बताते हैं। ये आदर्श रूप से सन्धि अवधि आरम्भ होने से पहले शुरू करने चाहिए:' },

  // Navigation
  relatedTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
  shareText: { en: 'Dasha Sandhi — Junction Periods Between Planetary Dashas. Learn about the most critical transition windows in Vedic Astrology.', hi: 'दशा सन्धि — ग्रह दशाओं के संक्रमण काल। वैदिक ज्योतिष में सबसे संवेदनशील संक्रमण अवधियों के बारे में जानें।' },
};

// ─── Maha Dasha durations (Vimshottari) ─────────────────────────────────────
const MAHA_DASHA_YEARS: Record<string, number> = {
  Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16,
  Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};

// ─── Friendship / Enmity data (mirroring the engine) ────────────────────────
const FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
  Rahu: ['Saturn', 'Venus'],
  Ketu: ['Mars', 'Jupiter'],
};

const ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
  Rahu: ['Sun', 'Moon', 'Mars'],
  Ketu: ['Venus', 'Saturn'],
};

function getRelationship(outgoing: string, incoming: string): 'friend' | 'enemy' | 'neutral' {
  if ((FRIENDS[outgoing] ?? []).includes(incoming)) return 'friend';
  if ((ENEMIES[outgoing] ?? []).includes(incoming)) return 'enemy';
  return 'neutral';
}

// ─── Transition effect pairs ────────────────────────────────────────────────
const TRANSITION_EFFECTS: { from: string; to: string; en: string; hi: string }[] = [
  { from: 'Sun', to: 'Moon', en: 'Authority gives way to emotional sensitivity. Career confidence softens into introspection. Public life recedes, private life intensifies.', hi: 'अधिकार भावनात्मक संवेदनशीलता को मार्ग देता है। कार्य-आत्मविश्वास आत्मनिरीक्षण में नरम होता है।' },
  { from: 'Moon', to: 'Mars', en: 'Emotional comfort zone disrupted by assertive energy. Passive becomes active. Relationships may face friction as directness replaces diplomacy.', hi: 'भावनात्मक सुविधा क्षेत्र आक्रामक ऊर्जा से बाधित। निष्क्रिय सक्रिय बनता है।' },
  { from: 'Mars', to: 'Rahu', en: 'Physical courage meets obsessive ambition. Action becomes compulsive. Risk of over-extension, unconventional career pivots, foreign connections.', hi: 'शारीरिक साहस जुनूनी महत्वाकांक्षा से मिलता है। कार्य बाध्यकारी हो जाता है।' },
  { from: 'Jupiter', to: 'Saturn', en: 'Expansion contracts. Optimism meets reality. Wisdom must be tested by discipline. Financial abundance may tighten. Patience becomes essential.', hi: 'विस्तार सिकुड़ता है। आशावाद यथार्थ से मिलता है। ज्ञान अनुशासन द्वारा परीक्षित होना चाहिए।' },
  { from: 'Saturn', to: 'Mercury', en: 'Heavy discipline lightens into intellectual curiosity. Responsibilities may shift from physical labor to mental work. Communication opens up.', hi: 'भारी अनुशासन बौद्धिक जिज्ञासा में हल्का होता है। जिम्मेदारियाँ शारीरिक श्रम से मानसिक कार्य में बदल सकती हैं।' },
  { from: 'Mercury', to: 'Ketu', en: 'Analytical mind meets spiritual detachment. Intellectual pursuits may feel meaningless. Inner seeking intensifies. Business interests wane.', hi: 'विश्लेषणात्मक मन आध्यात्मिक वैराग्य से मिलता है। बौद्धिक खोज अर्थहीन लग सकती है।' },
  { from: 'Venus', to: 'Sun', en: 'Pleasure and comfort give way to ambition and authority. Relationship focus shifts to career focus. Luxury may be sacrificed for recognition.', hi: 'सुख और आराम महत्वाकांक्षा और अधिकार को मार्ग देते हैं। सम्बन्ध केन्द्र से कार्य केन्द्र पर स्थानांतरण।' },
  { from: 'Ketu', to: 'Venus', en: 'Spiritual detachment suddenly meets material desire. Ascetic tendencies clash with sensuality. Past-life patterns around love resurface.', hi: 'आध्यात्मिक वैराग्य अचानक भौतिक इच्छा से मिलता है। तपस्वी प्रवृत्ति इंद्रियजन्यता से टकराती है।' },
  { from: 'Rahu', to: 'Jupiter', en: 'Obsessive worldly pursuit gives way to wisdom-seeking. Unconventional paths may be replaced by traditional values. Guru figures appear.', hi: 'जुनूनी सांसारिक खोज ज्ञान-अन्वेषण को मार्ग देती है। अपरम्परागत मार्ग पारम्परिक मूल्यों से प्रतिस्थापित हो सकते हैं।' },
];

// ─── General vulnerability patterns ─────────────────────────────────────────
const VULNERABILITY_PATTERNS = [
  { icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10', en: 'Decision paralysis: Important decisions feel impossible because neither the old nor new framework feels reliable.', hi: 'निर्णय पक्षाघात: महत्वपूर्ण निर्णय असम्भव लगते हैं क्योंकि न पुराना न नया ढाँचा विश्वसनीय लगता है।' },
  { icon: Clock, color: 'text-amber-400', bgColor: 'bg-amber-500/10', en: 'Health fluctuations: The body reflects the cosmic transition. Sleep disruption, digestive changes, and energy swings are common.', hi: 'स्वास्थ्य उतार-चढ़ाव: शरीर ब्रह्माण्डीय संक्रमण को प्रतिबिम्बित करता है। नींद बाधा, पाचन परिवर्तन और ऊर्जा उतार-चढ़ाव सामान्य हैं।' },
  { icon: Heart, color: 'text-pink-400', bgColor: 'bg-pink-500/10', en: 'Relationship turbulence: Existing relationships are re-evaluated. Some end naturally; new ones may begin but feel premature.', hi: 'सम्बन्ध अशांति: मौजूदा सम्बन्धों का पुनर्मूल्यांकन होता है। कुछ स्वाभाविक रूप से समाप्त; नए शुरू हो सकते हैं पर समयपूर्व लगते हैं।' },
  { icon: Sparkles, color: 'text-violet-400', bgColor: 'bg-violet-500/10', en: 'Career shifts: Professional direction feels unclear. Old roles lose meaning before new ones crystallize. The temptation to make drastic changes is strong but risky.', hi: 'कार्य परिवर्तन: पेशेवर दिशा अस्पष्ट लगती है। पुरानी भूमिकाएँ नई के स्फटिकित होने से पहले अर्थ खो देती हैं।' },
  { icon: Shield, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', en: 'Spiritual openings: Paradoxically, Sandhi periods are excellent for spiritual practice. The loosening of planetary grip creates space for meditation, self-inquiry, and inner work.', hi: 'आध्यात्मिक द्वार: विरोधाभासी रूप से, सन्धि काल आध्यात्मिक साधना के लिए उत्कृष्ट है। ग्रह-पकड़ का ढीला होना ध्यान, आत्म-अन्वेषण और आन्तरिक कार्य के लिए स्थान बनाता है।' },
];

// ─── Classical text quotes ──────────────────────────────────────────────────
const CLASSICAL_QUOTES = [
  { source: 'BPHS Ch.46', en: '"At the junction of two Dashas, the native experiences confusion of purpose and instability of fortune. The last portion of any Dasha carries the seed of the next — observe the transits of both lords carefully during this period."', hi: '"दो दशाओं के संधि काल में जातक उद्देश्य का भ्रम और भाग्य की अस्थिरता अनुभव करता है। किसी भी दशा का अंतिम भाग अगली का बीज धारण करता है — इस काल में दोनों स्वामियों के गोचर को सावधानीपूर्वक देखें।"' },
  { source: 'Phaladeepika Ch.20', en: '"The results of a Dasha are strongest in its middle portion and weakest at its beginning and end. At the junction, the native should perform remedial measures for both the outgoing and incoming lords."', hi: '"दशा के फल उसके मध्य भाग में सबसे प्रबल और आरम्भ व अंत में सबसे कमज़ोर होते हैं। संधि पर, जातक को निवर्तमान और आगामी दोनों स्वामियों के लिए उपचारात्मक उपाय करने चाहिए।"' },
  { source: 'Uttara Kalamrita', en: '"During the Sandhi of Maha Dashas, charitable acts, mantra japa, and fasting on the days ruled by both planets bring protection. The native should avoid initiating new ventures and instead consolidate existing ones."', hi: '"महादशा की सन्धि के दौरान, दान, मंत्र जप, और दोनों ग्रहों के दिनों में उपवास सुरक्षा प्रदान करते हैं। जातक को नए उपक्रम शुरू करने से बचना चाहिए और मौजूदा को समेकित करना चाहिए।"' },
];

// ─── Remedies ───────────────────────────────────────────────────────────────
const REMEDIES = [
  { category: { en: 'Mantras', hi: 'मन्त्र' }, color: 'text-amber-400', items: [
    { en: 'Recite the Beej Mantra of the outgoing planet daily during the first half of the Sandhi window.', hi: 'सन्धि अवधि के प्रथम भाग में निवर्तमान ग्रह का बीज मन्त्र प्रतिदिन जपें।' },
    { en: 'Switch to the incoming planet\'s Beej Mantra in the second half. This eases the energetic handover.', hi: 'द्वितीय भाग में आगामी ग्रह के बीज मन्त्र पर स्विच करें। यह ऊर्जात्मक हस्तांतरण को सुगम बनाता है।' },
    { en: 'The Maha Mrityunjaya Mantra is universally protective during all Sandhi periods.', hi: 'महामृत्युंजय मन्त्र सभी सन्धि काल में सार्वभौमिक रूप से रक्षात्मक है।' },
  ]},
  { category: { en: 'Charitable Acts (Daan)', hi: 'दान' }, color: 'text-emerald-400', items: [
    { en: 'Donate items associated with the outgoing planet on its weekday (e.g., black sesame on Saturday for Saturn).', hi: 'निवर्तमान ग्रह से सम्बन्धित वस्तुओं का उसके वार पर दान करें (जैसे शनिवार को काले तिल शनि के लिए)।' },
    { en: 'Feed animals or birds associated with both planets. Crows (Saturn), green parrots (Mercury), dogs (Ketu), cows (Venus/Moon).', hi: 'दोनों ग्रहों से जुड़े पशु-पक्षियों को भोजन कराएँ। कौवे (शनि), हरे तोते (बुध), कुत्ते (केतु), गाय (शुक्र/चन्द्र)।' },
    { en: 'Donate to educational institutions during Mercury or Jupiter Sandhi. Donate to hospitals during Saturn Sandhi.', hi: 'बुध या गुरु सन्धि में शैक्षिक संस्थानों को दान। शनि सन्धि में अस्पतालों को दान।' },
  ]},
  { category: { en: 'Gemstones', hi: 'रत्न' }, color: 'text-cyan-400', items: [
    { en: 'Wear the gemstone of the incoming planet\'s lord — but only if it is a functional benefic for your Lagna. Consult your chart.', hi: 'आगामी ग्रह स्वामी का रत्न धारण करें — किन्तु केवल तभी जब वह आपके लग्न के लिए कार्यात्मक शुभ हो। अपनी कुण्डली देखें।' },
    { en: 'If the incoming lord is a malefic, strengthen the Lagna lord instead for overall stability.', hi: 'यदि आगामी स्वामी अशुभ है, तो समग्र स्थिरता के लिए लग्न स्वामी को बलवान करें।' },
  ]},
  { category: { en: 'Practical Wisdom', hi: 'व्यावहारिक ज्ञान' }, color: 'text-violet-400', items: [
    { en: 'Avoid major irreversible decisions (marriage, property, career change) during the peak of Sandhi if possible.', hi: 'यदि सम्भव हो, सन्धि के चरम पर प्रमुख अपरिवर्तनीय निर्णय (विवाह, सम्पत्ति, कार्य परिवर्तन) से बचें।' },
    { en: 'Increase meditation and contemplative practices. Sandhi is nature\'s invitation to pause and recalibrate.', hi: 'ध्यान और चिन्तनशील अभ्यास बढ़ाएँ। सन्धि प्रकृति का रुकने और पुनर्अंशांकन का निमन्त्रण है।' },
    { en: 'Journal your experiences. The themes that emerge during Sandhi often preview the entire incoming Dasha\'s agenda.', hi: 'अपने अनुभवों को लिखें। सन्धि के दौरान उभरने वाले विषय अक्सर पूरी आगामी दशा की रूपरेखा का पूर्वावलोकन देते हैं।' },
  ]},
];

// ─── Related links ──────────────────────────────────────────────────────────
const RELATED = [
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/avasthas', label: { en: 'Avasthas — Planetary States', hi: 'अवस्थाएँ — ग्रह दशाएँ' } },
  { href: '/learn/transit-guide', label: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शिका' } },
  { href: '/learn/remedies', label: { en: 'Vedic Remedies', hi: 'वैदिक उपाय' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati', hi: 'साढ़े साती' } },
];

// ─── Vimshottari sequence for timeline visual ───────────────────────────────
const VIMSHOTTARI_SEQUENCE = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
const PLANET_COLORS: Record<string, string> = {
  Sun: '#f59e0b', Moon: '#94a3b8', Mars: '#ef4444', Rahu: '#6366f1',
  Jupiter: '#f0d48a', Saturn: '#64748b', Mercury: '#22c55e', Ketu: '#a855f7', Venus: '#ec4899',
};
const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Rahu: 'राहु',
  Jupiter: 'गुरु', Saturn: 'शनि', Mercury: 'बुध', Ketu: 'केतु', Venus: 'शुक्र',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashaSandhiPage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const t = (key: string) => (L[key]?.[locale] || L[key]?.en || '');

  const [expandedType, setExpandedType] = useState<number | null>(0);
  const [expandedRemedy, setExpandedRemedy] = useState<number | null>(null);

  // Build relationship matrix for table
  const matrixPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-gold-primary" />
          <span className="text-gold-primary text-xs uppercase tracking-widest font-bold">
            {tl({ en: 'Predictive Astrology', hi: 'भविष्यवाणी ज्योतिष', sa: 'भविष्यवाणीज्योतिषम्' }, locale)}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl" style={bf}>{t('subtitle')}</p>
        <div className="mt-4">
          <AuthorByline />
        </div>
      </motion.div>

      {/* ═══ 1. Introduction ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light flex items-center gap-2" style={hf}>
          <BookOpen className="w-5 h-5 text-gold-primary" />
          {t('introTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bf}>{t('introP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bf}>{t('introP2')}</p>

        {/* Sandhi visual — dawn/dusk analogy */}
        <div className="relative rounded-xl overflow-hidden h-20 my-6">
          <div className="absolute inset-0 flex">
            <div className="w-1/3 bg-gradient-to-r from-indigo-900/60 to-amber-900/40 flex items-center justify-center">
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                {tl({ en: 'Outgoing Dasha', hi: 'निवर्तमान दशा', sa: 'निवर्तमानदशा' }, locale)}
              </span>
            </div>
            <div className="w-1/3 bg-gradient-to-r from-amber-900/40 via-amber-600/20 to-amber-900/40 flex items-center justify-center border-x border-amber-500/30 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent" />
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider relative z-10">
                {tl({ en: 'Sandhi Zone', hi: 'सन्धि क्षेत्र', sa: 'सन्धिक्षेत्रम्' }, locale)}
              </span>
            </div>
            <div className="w-1/3 bg-gradient-to-r from-amber-900/40 to-violet-900/60 flex items-center justify-center">
              <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">
                {tl({ en: 'Incoming Dasha', hi: 'आगामी दशा', sa: 'आगामीदशा' }, locale)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-text-secondary leading-relaxed text-sm" style={bf}>{t('introP3')}</p>
      </motion.section>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* ═══ 2. Types of Sandhi ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={hf}>{t('typesTitle')}</h2>

        {[
          { titleKey: 'mahaSandhiTitle', descKey: 'mahaSandhiDesc', durKey: 'mahaSandhiDuration', color: 'text-red-400', bgColor: 'bg-red-500/8 border-red-500/20', icon: AlertTriangle, intensity: 'Most Intense' },
          { titleKey: 'antarSandhiTitle', descKey: 'antarSandhiDesc', durKey: 'antarSandhiDuration', color: 'text-amber-400', bgColor: 'bg-amber-500/8 border-amber-500/20', icon: Clock, intensity: 'Moderate' },
          { titleKey: 'pratyantarSandhiTitle', descKey: 'pratyantarSandhiDesc', durKey: 'pratyantarSandhiDuration', color: 'text-emerald-400', bgColor: 'bg-emerald-500/8 border-emerald-500/20', icon: Sparkles, intensity: 'Subtle' },
        ].map((type, i) => {
          const Icon = type.icon;
          const isExpanded = expandedType === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedType(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${type.color}`} />
                  <span className={`font-bold text-base ${type.color}`} style={hf}>{t(type.titleKey)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${type.bgColor}`}>{type.intensity}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gold-primary/10 pt-4 space-y-3">
                      <p className="text-text-secondary leading-relaxed text-sm" style={bf}>{t(type.descKey)}</p>
                      <div className={`p-3 rounded-xl border ${type.bgColor}`}>
                        <p className={`text-sm font-medium ${type.color}`} style={bf}>{t(type.durKey)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ 3. Calculation Walkthrough ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gold-light" style={hf}>{t('calcTitle')}</h2>
        <p className="text-text-secondary leading-relaxed text-sm" style={bf}>{t('calcIntro')}</p>

        {/* Worked Example: Saturn → Mercury */}
        <div className="space-y-3">
          {['calcStep1', 'calcStep2', 'calcStep3', 'calcStep4', 'calcStep5'].map((key, i) => (
            <div key={key} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center">
                <span className="text-gold-light text-sm font-bold">{i + 1}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed pt-1" style={bf}>{t(key)}</p>
            </div>
          ))}
        </div>

        {/* Visual timeline — Saturn → Mercury Sandhi */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gold-dark uppercase tracking-wider mb-3">
            {tl({ en: 'Visual Timeline: Saturn → Mercury Sandhi', hi: 'दृश्य समयरेखा: शनि → बुध सन्धि', sa: 'दृश्यसमयरेखा: शनिबुधसन्धिः' }, locale)}
          </h3>
          <div className="relative rounded-xl overflow-hidden border border-gold-primary/10 bg-[#0a0e27]/80">
            <svg viewBox="0 0 600 120" className="w-full h-auto" aria-label="Saturn to Mercury Dasha Sandhi timeline">
              {/* Saturn Dasha bar */}
              <rect x="20" y="30" width="250" height="30" rx="4" fill="#64748b" opacity="0.4" />
              <text x="145" y="50" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                {locale === 'hi' ? 'शनि महादशा (19 वर्ष)' : 'Saturn Maha Dasha (19y)'}
              </text>

              {/* Sandhi zone overlay on Saturn side */}
              <rect x="220" y="30" width="50" height="30" rx="0" fill="#f59e0b" opacity="0.25" />
              {/* Sandhi zone overlay on Mercury side */}
              <rect x="270" y="30" width="45" height="30" rx="0" fill="#f59e0b" opacity="0.25" />

              {/* Mercury Dasha bar */}
              <rect x="270" y="30" width="230" height="30" rx="4" fill="#22c55e" opacity="0.3" />
              <text x="385" y="50" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold">
                {locale === 'hi' ? 'बुध महादशा (17 वर्ष)' : 'Mercury Maha Dasha (17y)'}
              </text>

              {/* Transition line */}
              <line x1="270" y1="25" x2="270" y2="68" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
              <text x="270" y="20" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                {locale === 'hi' ? 'संक्रमण तिथि' : 'TRANSITION DATE'}
              </text>

              {/* Sandhi bracket */}
              <line x1="220" y1="72" x2="315" y2="72" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="220" y1="68" x2="220" y2="76" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="315" y1="68" x2="315" y2="76" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="267" y="86" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">
                {locale === 'hi' ? 'सन्धि (3.6 वर्ष)' : 'SANDHI (3.6 years)'}
              </text>

              {/* Duration labels */}
              <text x="233" y="102" textAnchor="middle" fill="#94a3b8" fontSize="8">1.9y</text>
              <text x="300" y="102" textAnchor="middle" fill="#94a3b8" fontSize="8">1.7y</text>

              {/* 10% labels */}
              <text x="233" y="112" textAnchor="middle" fill="#64748b" fontSize="7">10%</text>
              <text x="300" y="112" textAnchor="middle" fill="#64748b" fontSize="7">10%</text>
            </svg>
          </div>
        </div>

        {/* Vimshottari Dasha Durations Reference Table */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-gold-dark uppercase tracking-wider mb-2">
            {tl({ en: 'Vimshottari Dasha Durations (for reference)', hi: 'विंशोत्तरी दशा अवधि (संदर्भ हेतु)', sa: 'विंशोत्तरीदशाकालाः (सन्दर्भार्थम्)' }, locale)}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' }, locale)}</th>
                  <th className="text-center py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tl({ en: 'Years', hi: 'वर्ष', sa: 'वर्षाणि' }, locale)}</th>
                  <th className="text-center py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tl({ en: '10% (Sandhi share)', hi: '10% (सन्धि अंश)', sa: '10% (सन्धिभागः)' }, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {VIMSHOTTARI_SEQUENCE.map(planet => (
                  <tr key={planet} className="border-b border-gold-primary/6 hover:bg-gold-primary/5 transition-colors">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLANET_COLORS[planet] }} />
                      <span className="text-text-primary font-medium">
                        {locale === 'hi' ? PLANET_HI[planet] : planet}
                      </span>
                    </td>
                    <td className="text-center py-2 px-3 text-text-secondary">{MAHA_DASHA_YEARS[planet]}</td>
                    <td className="text-center py-2 px-3 text-amber-400 font-medium">
                      {(MAHA_DASHA_YEARS[planet] * 0.1).toFixed(1)}y ({Math.round(MAHA_DASHA_YEARS[planet] * 0.1 * 12)}m)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* ═══ 4. Effects and Significance ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
        <h2 className="text-2xl font-bold text-gold-gradient" style={hf}>{t('effectsTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bf}>{t('effectsIntro')}</p>

        {/* Vulnerability patterns */}
        <h3 className="text-sm font-bold text-gold-dark uppercase tracking-wider">{t('effectsGeneral')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VULNERABILITY_PATTERNS.map((pattern, i) => {
            const Icon = pattern.icon;
            return (
              <div key={i} className={`p-4 rounded-xl ${pattern.bgColor} border border-gold-primary/8`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${pattern.color} flex-shrink-0 mt-0.5`} />
                  <p className="text-text-secondary text-sm leading-relaxed" style={bf}>
                    {tl({ en: pattern.en, hi: pattern.hi }, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specific transition effects */}
        <h3 className="text-sm font-bold text-gold-dark uppercase tracking-wider mt-6">
          {tl({ en: 'Specific Transition Effects', hi: 'विशिष्ट संक्रमण प्रभाव', sa: 'विशिष्टसंक्रमणप्रभावाः' }, locale)}
        </h3>
        <div className="space-y-2">
          {TRANSITION_EFFECTS.map((eff, i) => {
            const rel = getRelationship(eff.from, eff.to);
            const relColor = rel === 'friend' ? 'text-emerald-400 bg-emerald-500/10' : rel === 'enemy' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10';
            const relLabel = rel === 'friend'
              ? tl({ en: 'Mild', hi: 'सौम्य', sa: 'सौम्यम्' }, locale)
              : rel === 'enemy'
                ? tl({ en: 'Intense', hi: 'तीव्र', sa: 'तीव्रम्' }, locale)
                : tl({ en: 'Moderate', hi: 'मध्यम', sa: 'मध्यमम्' }, locale);
            return (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLANET_COLORS[eff.from] }} />
                  <span className="text-text-primary font-bold text-sm">
                    {locale === 'hi' ? PLANET_HI[eff.from] : eff.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gold-dark" />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLANET_COLORS[eff.to] }} />
                  <span className="text-text-primary font-bold text-sm">
                    {locale === 'hi' ? PLANET_HI[eff.to] : eff.to}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${relColor}`}>{relLabel}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bf}>
                  {tl(eff, locale)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Intensity Matrix */}
        <h3 className="text-sm font-bold text-gold-dark uppercase tracking-wider mt-6">
          {tl({ en: 'Sandhi Intensity Matrix — All Planet Pairs', hi: 'सन्धि तीव्रता मैट्रिक्स — सभी ग्रह जोड़े', sa: 'सन्धितीव्रतामैट्रिक्स — सर्वग्रहयुग्मानि' }, locale)}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-1.5 text-gold-dark border border-gold-primary/10 bg-gold-primary/5">
                  {tl({ en: 'From \\ To', hi: 'से \\ को', sa: 'अतः \\ प्रति' }, locale)}
                </th>
                {matrixPlanets.map(p => (
                  <th key={p} className="p-1.5 border border-gold-primary/10 bg-gold-primary/5" style={{ color: PLANET_COLORS[p] }}>
                    {locale === 'hi' ? PLANET_HI[p]?.slice(0, 3) : p.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixPlanets.map(from => (
                <tr key={from}>
                  <td className="p-1.5 font-bold border border-gold-primary/10 bg-gold-primary/5" style={{ color: PLANET_COLORS[from] }}>
                    {locale === 'hi' ? PLANET_HI[from]?.slice(0, 3) : from.slice(0, 3)}
                  </td>
                  {matrixPlanets.map(to => {
                    if (from === to) return <td key={to} className="p-1.5 border border-gold-primary/10 text-center text-text-secondary/30">-</td>;
                    const rel = getRelationship(from, to);
                    const bg = rel === 'friend' ? 'bg-emerald-500/15 text-emerald-400' : rel === 'enemy' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/10 text-amber-400';
                    const label = rel === 'friend' ? (locale === 'hi' ? 'मि' : 'F') : rel === 'enemy' ? (locale === 'hi' ? 'श' : 'E') : (locale === 'hi' ? 'त' : 'N');
                    return (
                      <td key={to} className={`p-1.5 border border-gold-primary/10 text-center font-bold ${bg}`} title={`${from} → ${to}: ${rel}`}>
                        {label}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4 mt-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/15 border border-emerald-500/30" /> {tl({ en: 'F = Friend (Mild)', hi: 'मि = मित्र (सौम्य)', sa: 'मि = मित्रम् (सौम्यम्)' }, locale)}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500/30" /> {tl({ en: 'N = Neutral (Moderate)', hi: 'त = तटस्थ (मध्यम)', sa: 'त = तटस्थम् (मध्यमम्)' }, locale)}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/15 border border-red-500/30" /> {tl({ en: 'E = Enemy (Intense)', hi: 'श = शत्रु (तीव्र)', sa: 'श = शत्रुः (तीव्रम्)' }, locale)}</span>
          </div>
        </div>
      </motion.section>

      {/* ═══ 5. Classical Text References ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-gold-light flex items-center gap-2" style={hf}>
          <BookOpen className="w-5 h-5 text-gold-primary" />
          {t('classicalTitle')}
        </h2>
        <div className="space-y-4">
          {CLASSICAL_QUOTES.map((quote, i) => (
            <div key={i} className="border-l-2 border-gold-primary/40 pl-4 py-2">
              <p className="text-text-secondary leading-relaxed italic text-sm" style={bf}>
                {tl(quote, locale)}
              </p>
              <p className="text-gold-dark text-xs mt-2 font-bold uppercase tracking-wider">
                -- {quote.source}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 6. Modern Context ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light flex items-center gap-2" style={hf}>
          <Sparkles className="w-5 h-5 text-violet-400" />
          {t('modernTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bf}>{t('modernP1')}</p>

        {/* Bridges model comparison */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {[
            { label: { en: 'Ending', hi: 'समाप्ति' }, sub: { en: 'Outgoing Dasha tail', hi: 'निवर्तमान दशा पूंछ' }, color: 'border-indigo-500/30 bg-indigo-500/10', textColor: 'text-indigo-300' },
            { label: { en: 'Neutral Zone', hi: 'तटस्थ क्षेत्र' }, sub: { en: 'Junction itself', hi: 'संधि स्वयं' }, color: 'border-amber-500/30 bg-amber-500/10', textColor: 'text-amber-300' },
            { label: { en: 'New Beginning', hi: 'नई शुरुआत' }, sub: { en: 'Incoming Dasha head', hi: 'आगामी दशा शीर्ष' }, color: 'border-emerald-500/30 bg-emerald-500/10', textColor: 'text-emerald-300' },
          ].map((phase, i) => (
            <div key={i} className={`p-3 rounded-xl border text-center ${phase.color}`}>
              <p className={`font-bold text-sm ${phase.textColor}`} style={hf}>{tl(phase.label, locale)}</p>
              <p className="text-text-secondary text-xs mt-1" style={bf}>{tl(phase.sub, locale)}</p>
            </div>
          ))}
        </div>

        <p className="text-text-secondary leading-relaxed" style={bf}>{t('modernP2')}</p>
        <p className="text-text-secondary leading-relaxed" style={bf}>{t('modernP3')}</p>
      </motion.section>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* ═══ 7. Remedies ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient flex items-center gap-2" style={hf}>
          <Shield className="w-6 h-6 text-emerald-400" />
          {t('remediesTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed text-sm" style={bf}>{t('remediesIntro')}</p>

        {REMEDIES.map((remedy, i) => {
          const isExpanded = expandedRemedy === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedRemedy(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <span className={`font-bold text-base ${remedy.color}`} style={hf}>{tl(remedy.category, locale)}</span>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gold-primary/10 pt-4 space-y-2">
                      {remedy.items.map((item, j) => (
                        <div key={j} className="flex gap-2 items-start">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${remedy.color.replace('text-', 'bg-')}`} />
                          <p className="text-text-secondary text-sm leading-relaxed" style={bf}>
                            {tl(item, locale)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Related Topics ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-gold-light" style={hf}>{t('relatedTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          {RELATED.map((r, i) => (
            <Link key={i} href={r.href} className="px-4 py-2 rounded-lg bg-gold-primary/8 border border-gold-primary/15 text-text-primary text-sm hover:bg-gold-primary/15 hover:border-gold-primary/30 transition-all flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-gold-dark" />
              {tl(r.label, locale)}
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══ Share ═══ */}
      <div className="flex justify-center">
        <ShareRow
          pageTitle={t('title')}
          shareText={t('shareText')}
          locale={locale as Locale}
        />
      </div>
    </div>
  );
}
