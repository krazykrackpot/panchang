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
  { devanagari: 'कुम्भ', transliteration: 'Kumbha', meaning: { en: 'The water pot — vessel of cosmic knowledge', hi: 'जल कलश — ब्रह्मांडीय ज्ञान का पात्र' } },
  { devanagari: 'घट', transliteration: 'Ghaṭa', meaning: { en: 'Earthen pitcher — alternative name for this sign', hi: 'मिट्टी का घड़ा — इस राशि का वैकल्पिक नाम' } },
  { devanagari: 'शनिक्षेत्र', transliteration: 'Śanikṣetra', meaning: { en: 'Saturn\'s field — the second domain of the taskmaster', hi: 'शनि का क्षेत्र — कर्मदाता का द्वितीय स्थान' } },
  { devanagari: 'वायुराशि', transliteration: 'Vāyurāśi', meaning: { en: 'Air sign — intellectual, social, and humanitarian', hi: 'वायु राशि — बौद्धिक, सामाजिक और मानवतावादी' } },
  { devanagari: 'कुम्भमेल', transliteration: 'Kumbhamela', meaning: { en: 'The great gathering — sacred festival named for this sign', hi: 'महान सभा — इस राशि के नाम पर पवित्र उत्सव' } },
  { devanagari: 'लोकसेवा', transliteration: 'Lokasevā', meaning: { en: 'Service to the world — the Aquarian ideal', hi: 'विश्व सेवा — कुम्भ का आदर्श' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Air (Vayu Tattva)', hi: 'वायु तत्त्व' },
  modality: { en: 'Fixed (Sthira — stable, determined)', hi: 'स्थिर (अचल, दृढ़निश्चयी)' },
  gender: { en: 'Masculine (Purusha)', hi: 'पुल्लिंग (पुरुष)' },
  ruler: { en: 'Saturn (Shani) — co-ruled by Rahu per some traditions', hi: 'शनि — कुछ परम्पराओं में राहु सह-स्वामी' },
  symbol: { en: 'The Water-Bearer ♒ — a figure pouring cosmic waters', hi: 'जल-वाहक ♒ — दिव्य जल उड़ेलती आकृति' },
  degreeRange: { en: '300° to 330° of the zodiac', hi: 'राशिचक्र के 300° से 330°' },
  direction: { en: 'West (Paschima)', hi: 'पश्चिम दिशा' },
  season: { en: 'Shishira Ritu (Late Winter)', hi: 'शिशिर ऋतु (शीत काल का अन्त)' },
  color: { en: 'Dark blue / Variegated / Electric blue', hi: 'गहरा नीला / चित्रित / विद्युत नीला' },
  bodyPart: { en: 'Ankles, calves, shins, circulatory system', hi: 'टखने, पिण्डलियाँ, नलियाँ, रक्त संचार तन्त्र' },
};

// ─── Nakshatras in Kumbha ──────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Dhanishtha (padas 3-4)', hi: 'धनिष्ठा (पद 3-4)' },
    range: { en: '300°00\' to 306°40\' (padas 3-4 in Kumbha)', hi: '300°00\' से 306°40\' (पद 3-4 कुम्भ में)' },
    lord: { en: 'Mars (Mangal)', hi: 'मंगल' },
    nature: { en: 'Dhanishtha means "the wealthiest" — padas 3-4 in Aquarius shift the material wealth theme toward collective abundance and community resources. Mars\'s drive combines with Saturn\'s social vision to produce leaders of cooperatives, unions, and humanitarian organizations. Musical talent persists — especially percussion, electronic music, and group performance. The native builds wealth through networks and group enterprises rather than individual accumulation. Philanthropic ambition replaces personal greed.', hi: 'धनिष्ठा का अर्थ है "सबसे धनवान" — कुम्भ में पद 3-4 भौतिक धन विषय को सामूहिक समृद्धि और सामुदायिक संसाधनों की ओर मोड़ते हैं। मंगल की प्रेरणा शनि की सामाजिक दृष्टि के साथ सहकारिताओं, संघों और मानवतावादी संगठनों के नेता बनाती है। संगीत प्रतिभा बनी रहती है — विशेषकर ताल, इलेक्ट्रॉनिक संगीत। जातक नेटवर्क और सामूहिक उद्यमों से धन बनाता है।' },
  },
  {
    name: { en: 'Shatabhisha', hi: 'शतभिषा' },
    range: { en: '306°40\' to 320°00\' (all 4 padas in Kumbha)', hi: '306°40\' से 320°00\' (सभी 4 पद कुम्भ में)' },
    lord: { en: 'Rahu', hi: 'राहु' },
    nature: { en: 'Shatabhisha means "hundred physicians" or "hundred healers" — the nakshatra of healing, scientific research, and the penetrating gaze that sees through illusion. Rahu\'s rulership in Saturn\'s air sign creates unconventional thinkers who break barriers in medicine, technology, and social reform. The symbolism of "a hundred stars" or "an empty circle" points to collective consciousness and the dissolution of individual ego into universal awareness. The native is often a loner who works for the many — a researcher in a lab, a programmer building systems used by millions, a healer who treats diseases others cannot diagnose.', hi: 'शतभिषा का अर्थ है "सौ वैद्य" या "सौ चिकित्सक" — चिकित्सा, वैज्ञानिक शोध और भ्रम को भेदने वाली दृष्टि का नक्षत्र। शनि की वायु राशि में राहु का स्वामित्व चिकित्सा, प्रौद्योगिकी और सामाजिक सुधार में बाधाएँ तोड़ने वाले अपरम्परागत विचारक बनाता है। "सौ तारों" या "खाली वृत्त" का प्रतीकवाद सामूहिक चेतना और व्यक्तिगत अहंकार के सार्वभौमिक जागरूकता में विलय की ओर इंगित करता है। जातक प्रायः अकेला जो अनेकों के लिए कार्य करता है।' },
  },
  {
    name: { en: 'Purva Bhadrapada (padas 1-3)', hi: 'पूर्वभाद्रपद (पद 1-3)' },
    range: { en: '320°00\' to 330°00\' (padas 1-3 in Kumbha)', hi: '320°00\' से 330°00\' (पद 1-3 कुम्भ में)' },
    lord: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    nature: { en: 'Purva Bhadrapada means "the former lucky feet" — the nakshatra of radical transformation, scorching intensity, and the fire that burns away falsehood. Jupiter\'s rulership brings philosophical depth to Saturn\'s social vision. The symbol is the front of a funeral cot — death of the old self to birth the new. The native possesses a dual nature: outwardly conventional but inwardly revolutionary. This nakshatra produces reformers, revolutionaries, and spiritual iconoclasts who challenge established order from a position of deep knowledge. Padas 1-3 in Kumbha bring the most socially oriented expression.', hi: 'पूर्वभाद्रपद का अर्थ है "पहले भाग्यशाली पद" — आमूल परिवर्तन, तीव्र ताप और मिथ्या को जलाने वाली अग्नि का नक्षत्र। गुरु का स्वामित्व शनि की सामाजिक दृष्टि में दार्शनिक गहराई। प्रतीक अर्थी का अगला भाग — पुराने स्वयं की मृत्यु नये का जन्म। जातक बाहर से परम्परागत किन्तु अन्दर से क्रान्तिकारी। सुधारक, क्रान्तिकारी और आध्यात्मिक मूर्तिभंजक। पद 1-3 कुम्भ में सबसे सामाजिक अभिव्यक्ति।' },
  },
];

// ─── Planetary Dignities in Kumbha ─────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  rulerAndMoolatrikona: { en: 'Saturn (Shani) — own sign and moolatrikona 0°-20°. This is Saturn\'s most powerful position, where the planet of structure and reform operates with both ownership authority and purest expression. The moolatrikona range (0°-20°) produces Saturn\'s highest vision: not mere restriction, but structured liberation — building systems that free humanity from suffering.', hi: 'शनि — स्वराशि और मूलत्रिकोण 0°-20°। यह शनि की सबसे शक्तिशाली स्थिति, जहाँ संरचना और सुधार का ग्रह स्वामित्व अधिकार और शुद्धतम अभिव्यक्ति दोनों से। मूलत्रिकोण (0°-20°) शनि की उच्चतम दृष्टि: केवल प्रतिबन्ध नहीं, बल्कि संरचित मुक्ति — मानवता को पीड़ा से मुक्त करने वाली प्रणालियाँ।' },
  exalted: { en: 'No planet has its exaltation point in Aquarius. The sign is too radical, too future-oriented, and too collective for any single planet to find its "highest" personal expression here — Kumbha demands that individual brilliance serve the group.', hi: 'किसी ग्रह का उच्च बिन्दु कुम्भ में नहीं। राशि इतनी क्रान्तिकारी, भविष्योन्मुखी और सामूहिक है कि कोई एकल ग्रह यहाँ अपनी "उच्चतम" व्यक्तिगत अभिव्यक्ति नहीं पाता — कुम्भ माँगता है कि व्यक्तिगत प्रतिभा समूह की सेवा करे।' },
  debilitated: { en: 'No planet has its debilitation point in Aquarius either. The absence of both exaltation and debilitation in this sign reflects its egalitarian nature — Kumbha neither elevates nor humbles any single planet, treating all with Saturn\'s impartial, democratic vision.', hi: 'किसी ग्रह का नीच बिन्दु भी कुम्भ में नहीं। इस राशि में उच्च और नीच दोनों की अनुपस्थिति इसकी समतावादी प्रकृति दर्शाती है — कुम्भ किसी ग्रह को न उठाता है न विनम्र करता है, सभी के साथ शनि की निष्पक्ष, लोकतान्त्रिक दृष्टि।' },
  coRuler: { en: 'Rahu is considered the co-ruler of Aquarius by many Jyotish traditions. Rahu\'s innovative, boundary-breaking, and foreign-connecting energy aligns naturally with the Aquarian impulse toward progress, technology, and unconventional thought. When interpreting Kumbha placements, both Saturn and Rahu\'s significations should be considered.', hi: 'राहु कई ज्योतिष परम्पराओं में कुम्भ का सह-स्वामी माना जाता है। राहु की नवीन, सीमा-तोड़ और विदेशी-जोड़ने वाली ऊर्जा कुम्भ की प्रगति, प्रौद्योगिकी और अपरम्परागत चिन्तन की प्रेरणा से स्वाभाविक रूप से मेल खाती है। कुम्भ स्थितियों की व्याख्या में शनि और राहु दोनों के कारकत्व विचारणीय।' },
};

// ─── Each Planet in Kumbha ─────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Enemy\'s sign',
    effect: {
      en: 'Sun in Aquarius places the sovereign in the domain of democracy and social equality. The ego must serve the collective — personal glory is sacrificed for group achievement. The native\'s authority comes from representing something larger than themselves: a movement, an organization, a cause. Government service in social welfare, humanitarian leadership, and scientific administration suit well. The father may be involved in social work or unconventional professions. Self-identity is tied to group membership and ideological belonging rather than personal accomplishment.',
      hi: 'कुम्भ में सूर्य राजा को लोकतन्त्र और सामाजिक समानता के क्षेत्र में रखता है। अहंकार को सामूहिक की सेवा करनी होगी — व्यक्तिगत गौरव समूह उपलब्धि के लिए त्यागा। जातक का अधिकार स्वयं से बड़ी किसी चीज़ के प्रतिनिधित्व से — आन्दोलन, संगठन, कारण। सामाजिक कल्याण में सरकारी सेवा, मानवतावादी नेतृत्व और वैज्ञानिक प्रशासन उपयुक्त।'
    },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Moon in Aquarius creates an emotionally detached but socially conscious mind. The native processes feelings through intellectual analysis and often appears emotionally cool or distant. However, they care deeply about collective suffering — the pain of a community moves them more than personal heartbreak. Friendships matter more than intimate relationships. The mother may be unconventional, scientifically inclined, or involved in social causes. Emotional security comes from belonging to a group or movement that shares the native\'s ideals. Can be emotionally erratic and prone to sudden shifts in mood.',
      hi: 'कुम्भ में चन्द्र भावनात्मक रूप से विरक्त किन्तु सामाजिक रूप से सचेत मन बनाता है। जातक बौद्धिक विश्लेषण से भावनाओं को संसाधित करता है और प्रायः भावनात्मक रूप से शीतल दिखता है। तथापि सामूहिक पीड़ा गहराई से प्रभावित करती है। मित्रताएँ अन्तरंग सम्बन्धों से अधिक महत्त्वपूर्ण। माता अपरम्परागत या सामाजिक कारणों में संलग्न। भावनात्मक सुरक्षा आदर्श साझा करने वाले समूह से।'
    },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Neutral',
    effect: {
      en: 'Mars in Aquarius creates the revolutionary — aggressive energy directed toward social reform, technological innovation, and dismantling unjust systems. The native fights for the collective rather than personal gain. Energy is expressed through networks, organizations, and group action. Scientific temperament combined with warrior instinct produces innovators who disrupt entire industries. Excellent for social activists, engineers, technologists, and humanitarian workers. Can be erratic, rebellious without cause, and emotionally detached from the consequences of their revolutionary zeal.',
      hi: 'कुम्भ में मंगल क्रान्तिकारी बनाता है — सामाजिक सुधार, तकनीकी नवाचार और अन्यायपूर्ण व्यवस्थाओं को तोड़ने की ओर निर्देशित आक्रामक ऊर्जा। जातक व्यक्तिगत लाभ के बजाय सामूहिक के लिए लड़ता है। वैज्ञानिक स्वभाव और योद्धा प्रवृत्ति का संयोग पूरे उद्योगों को बदलने वाले नवप्रवर्तक। सामाजिक कार्यकर्ता, अभियन्ता और मानवतावादी कार्यकर्ताओं के लिए उत्कृष्ट।'
    },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Neutral',
    effect: {
      en: 'Mercury in Aquarius produces a brilliantly original, inventive, and systems-oriented intellect. The native thinks in networks, patterns, and interconnected systems rather than linear sequences. Technology, programming, data science, and network architecture come naturally. Communication is progressive, sometimes eccentric, and always oriented toward the future. The native generates ideas that are ahead of their time — often misunderstood in youth but vindicated decades later. Scientific writing, social media strategy, and technological education are excellent career paths.',
      hi: 'कुम्भ में बुध शानदार मौलिक, आविष्कारशील और प्रणाली-उन्मुख बुद्धि बनाता है। जातक रैखिक अनुक्रमों के बजाय नेटवर्क, प्रतिमानों और अन्तर्सम्बन्धित प्रणालियों में सोचता है। प्रौद्योगिकी, प्रोग्रामिंग, डेटा विज्ञान स्वाभाविक। संवाद प्रगतिशील, कभी-कभी विलक्षण, सदा भविष्योन्मुखी। विचार अपने समय से आगे — युवावस्था में अक्सर गलत समझे किन्तु दशकों बाद प्रमाणित।'
    },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    dignity: 'Neutral',
    effect: {
      en: 'Jupiter in Aquarius expands wisdom into the collective and humanitarian domain. The native teaches not individuals but communities; builds not temples but institutions of social welfare. Philosophical thinking is progressive, inclusive, and sometimes iconoclastic — challenging traditional interpretations in favor of universal principles. Philanthropy is systematic rather than charitable. The native may found educational institutions, social enterprises, or reform movements. Teaching through technology, online education, and democratized knowledge platforms align perfectly with this placement.',
      hi: 'कुम्भ में गुरु ज्ञान को सामूहिक और मानवतावादी क्षेत्र में विस्तृत करता है। जातक व्यक्तियों को नहीं बल्कि समुदायों को पढ़ाता है; मन्दिर नहीं बल्कि सामाजिक कल्याण संस्थान बनाता है। दार्शनिक चिन्तन प्रगतिशील, समावेशी और कभी-कभी मूर्तिभंजक। परोपकार व्यवस्थित। शैक्षिक संस्थान, सामाजिक उद्यम या सुधार आन्दोलन। प्रौद्योगिकी और ऑनलाइन शिक्षा से ज्ञान का लोकतन्त्रीकरण।'
    },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Venus in Aquarius creates unconventional, progressive, and intellectually driven relationships. The native is attracted to unique, eccentric, or socially conscious partners. Love is expressed through shared ideals, intellectual companionship, and collaborative projects rather than traditional romance. Artistic expression is avant-garde, digital, or community-oriented — electronic music, digital art, installation art, and social commentary through creative media. Friendship often precedes and sometimes replaces romantic attachment. Open relationships and non-traditional partnership structures may appeal.',
      hi: 'कुम्भ में शुक्र अपरम्परागत, प्रगतिशील और बौद्धिक रूप से प्रेरित सम्बन्ध बनाता है। जातक अनूठे, विलक्षण या सामाजिक रूप से सचेत साथियों की ओर आकर्षित। प्रेम साझा आदर्शों, बौद्धिक साहचर्य और सहयोगी परियोजनाओं से व्यक्त। कलात्मक अभिव्यक्ति अवांगार्द, डिजिटल या समुदाय-उन्मुख। मित्रता प्रायः रोमांटिक लगाव से पहले और कभी-कभी उसके स्थान पर।'
    },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Own sign / Moolatrikona (0°-20°)',
    effect: {
      en: 'Saturn in its own sign and moolatrikona achieves its highest expression — the visionary reformer who builds systems that liberate humanity from unnecessary suffering. This is Saturn at its most philosophical: not the stern taskmaster of Capricorn, but the wise architect of social justice and democratic institutions. The native works tirelessly for causes larger than themselves, building structures that outlast their personal ambition. Late-blooming success in social reform, democratic governance, scientific research, and humanitarian law. The 0°-20° moolatrikona range produces the purest Saturnian vision: patient, principled, and profoundly impersonal.',
      hi: 'शनि अपनी स्वराशि और मूलत्रिकोण में उच्चतम अभिव्यक्ति प्राप्त करता है — दूरदर्शी सुधारक जो मानवता को अनावश्यक पीड़ा से मुक्त करने वाली प्रणालियाँ बनाता है। यह शनि सबसे दार्शनिक रूप में: मकर का कठोर कर्मदाता नहीं, बल्कि सामाजिक न्याय और लोकतान्त्रिक संस्थानों का ज्ञानी वास्तुकार। 0°-20° मूलत्रिकोण शुद्धतम शनि दृष्टि: धैर्यवान, सिद्धान्तनिष्ठ और गहन रूप से निर्वैयक्तिक।'
    },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Co-ruler (strong placement)',
    effect: {
      en: 'Rahu in its co-ruled sign Aquarius is exceptionally powerful. The shadow planet\'s desire for innovation, unconventional paths, and boundary-breaking finds its most constructive expression here. The native may be a technological visionary, a social media pioneer, or a disruptive entrepreneur who transforms industries. Foreign connections, multicultural networks, and digital communities amplify Rahu\'s reach. Scientific breakthroughs, particularly in computing, aerospace, and alternative medicine, are strongly indicated. The challenge is maintaining ethical grounding while pursuing revolutionary change.',
      hi: 'राहु अपनी सह-शासित राशि कुम्भ में असाधारण रूप से शक्तिशाली। छाया ग्रह की नवाचार, अपरम्परागत मार्गों और सीमा-तोड़ने की इच्छा यहाँ सबसे रचनात्मक अभिव्यक्ति पाती है। जातक तकनीकी दूरदर्शी, सामाजिक मीडिया अग्रणी या उद्योगों को बदलने वाला विघटनकारी उद्यमी। विदेशी सम्पर्क और डिजिटल समुदाय राहु की पहुँच बढ़ाते हैं। कम्प्यूटिंग, एयरोस्पेस में वैज्ञानिक सफलताएँ।'
    },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Neutral',
    effect: {
      en: 'Ketu in Aquarius brings past-life mastery of collective consciousness, group dynamics, and social reform — producing current-life disillusionment with organizations, networks, and ideological movements. The native has natural understanding of group psychology but prefers spiritual solitude over social engagement. May abandon promising social movements for personal spiritual practice. The challenge is integrating collective wisdom with individual spiritual path rather than rejecting social responsibility entirely. Can produce brilliant loners who contribute through solitary research or artistic creation.',
      hi: 'कुम्भ में केतु पूर्व जन्म में सामूहिक चेतना, समूह गतिशीलता और सामाजिक सुधार की महारत — वर्तमान जन्म में संगठनों और वैचारिक आन्दोलनों से मोहभंग। जातक को समूह मनोविज्ञान की स्वाभाविक समझ किन्तु सामाजिक संलग्नता पर आध्यात्मिक एकान्त प्राथमिकता। सामाजिक आन्दोलन छोड़कर व्यक्तिगत आध्यात्मिक साधना। एकान्त शोध या कलात्मक सृजन से योगदान करने वाले प्रतिभाशाली एकाकी।'
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Visionary and future-oriented — sees possibilities that others cannot imagine for decades. Genuinely humanitarian — motivated by the wellbeing of communities, not personal advancement. Intellectually original and inventive — the sign of paradigm-shifters, scientists, and social architects. Independent thinker who refuses to follow convention merely because it is conventional. Loyal to principles and causes above personal relationships. Democratic instinct that treats all humans as equals regardless of birth, wealth, or status. Capacity for objective, impartial analysis unclouded by emotional bias.',
    hi: 'दूरदर्शी और भविष्योन्मुखी — वे सम्भावनाएँ देखता है जो अन्य दशकों तक कल्पना नहीं कर सकते। वास्तव में मानवतावादी — व्यक्तिगत उन्नति नहीं बल्कि समुदायों के कल्याण से प्रेरित। बौद्धिक रूप से मौलिक और आविष्कारशील — प्रतिमान-परिवर्तकों, वैज्ञानिकों और सामाजिक वास्तुकारों की राशि। स्वतन्त्र विचारक। सिद्धान्तों और कारणों के प्रति व्यक्तिगत सम्बन्धों से अधिक वफादार। लोकतान्त्रिक प्रवृत्ति।'
  },
  weaknesses: {
    en: 'Emotionally detached to the point of coldness — can theorize about suffering without feeling it. Stubborn contrarianism that opposes convention even when convention is correct. Alienating eccentricity that makes genuine intimacy difficult. Prone to ideological rigidity disguised as open-mindedness. Can be condescending toward those perceived as intellectually inferior. Difficulty maintaining close personal relationships due to prioritizing abstract causes over present people. Unpredictable behavior that oscillates between intense social engagement and sudden withdrawal.',
    hi: 'भावनात्मक रूप से इतना विरक्त कि शीतल — बिना अनुभव किए पीड़ा पर सिद्धान्त बना सकता है। हठी विपरीतवाद जो परम्परा सही होने पर भी विरोध करता है। अलगाव पैदा करने वाली विलक्षणता जो वास्तविक अन्तरंगता कठिन बनाती है। खुले दिमाग के रूप में छिपी वैचारिक कठोरता। बौद्धिक रूप से कमतर माने जाने वालों के प्रति कृपालु। अमूर्त कारणों को वर्तमान लोगों से ऊपर रखने से अन्तरंग सम्बन्ध बनाए रखने में कठिनाई।'
  },
  temperament: {
    en: 'The Aquarian temperament is sanguine-melancholic — intellectually warm but emotionally cool. Vata dominates the constitution, producing a nervous, quick-moving energy that operates primarily through the mind rather than the body. The native lives in the world of ideas, networks, and systems. They are simultaneously the most social sign (vast networks, group consciousness) and the most solitary (emotional independence, intellectual isolation). Saturn\'s influence gives persistence and patience; Rahu\'s co-rulership adds restlessness and sudden breaks from routine.',
    hi: 'कुम्भ का स्वभाव बौद्धिक रूप से उष्ण किन्तु भावनात्मक रूप से शीतल। वात प्रधान संरचना, तन्त्रिका, तीव्र गति ऊर्जा जो शरीर से अधिक मन से संचालित। जातक विचारों, नेटवर्क और प्रणालियों की दुनिया में रहता है। एक साथ सबसे सामाजिक (विशाल नेटवर्क, सामूहिक चेतना) और सबसे एकान्त (भावनात्मक स्वतन्त्रता, बौद्धिक अलगाव)। शनि का प्रभाव दृढ़ता और धैर्य; राहु की सह-शासन अस्थिरता और अचानक परिवर्तन।'
  },
  appearance: {
    en: 'Medium to tall build with a lean, sometimes angular frame. The calves and ankles are often prominent or unusually shaped. The face has an alert, intelligent quality — high forehead suggesting active cerebral activity. Eyes are wide-set and observant, with a distant, contemplative gaze. The native may dress unconventionally or adopt a distinctive personal style that signals intellectual independence. Posture often appears slightly detached — present but mentally elsewhere. Complexion varies but tends toward a clear, sometimes pale quality.',
    hi: 'मध्यम से लम्बी काया, पतला, कभी-कभी कोणीय ढाँचा। पिण्डलियाँ और टखने प्रायः प्रमुख। चेहरे में सतर्क, बुद्धिमान गुण — ऊँचा माथा सक्रिय मस्तिष्कीय गतिविधि। आँखें चौड़ी और अवलोकनशील, दूरस्थ, चिन्तनशील दृष्टि। जातक अपरम्परागत रूप से वस्त्र पहन सकता है या विशिष्ट व्यक्तिगत शैली। मुद्रा थोड़ी विरक्त — उपस्थित किन्तु मानसिक रूप से कहीं और।'
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Software engineer, data scientist, network architect, aerospace engineer, electrical engineer, social worker, NGO director, political activist, union organizer, research scientist, inventor, futurist, astrologer, astronomer, alternative healer, acupuncturist, psychiatrist, radio/television broadcaster, social media strategist, renewable energy engineer, environmental scientist, cooperative manager, democratic politician',
    hi: 'सॉफ्टवेयर इंजीनियर, डेटा वैज्ञानिक, नेटवर्क वास्तुकार, एयरोस्पेस इंजीनियर, विद्युत इंजीनियर, सामाजिक कार्यकर्ता, एनजीओ निदेशक, राजनीतिक कार्यकर्ता, शोध वैज्ञानिक, आविष्कारक, भविष्यवादी, ज्योतिषी, खगोलशास्त्री, वैकल्पिक चिकित्सक, मनोचिकित्सक, प्रसारक, नवीकरणीय ऊर्जा इंजीनियर, पर्यावरण वैज्ञानिक, सहकारी प्रबन्धक, लोकतान्त्रिक राजनेता'
  },
  nature: {
    en: 'Aquarius natives excel in careers that combine intellectual innovation with social impact. They need roles that allow them to build systems, challenge conventions, and serve communities larger than themselves. The ideal Kumbha career involves solving complex problems that affect many people simultaneously — designing technology that connects millions, researching cures that heal populations, or building organizations that democratize access to resources.',
    hi: 'कुम्भ जातक ऐसे करियर में उत्कृष्ट होते हैं जो बौद्धिक नवाचार को सामाजिक प्रभाव से जोड़ते हैं। उन्हें ऐसी भूमिकाएँ चाहिए जो प्रणालियाँ बनाने, परम्पराओं को चुनौती देने और स्वयं से बड़े समुदायों की सेवा की अनुमति दें। आदर्श कुम्भ करियर: जटिल समस्याओं को हल करना जो एक साथ अनेक लोगों को प्रभावित करती हैं।'
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Gemini (Mithuna) — fellow air sign that matches Aquarius\'s intellectual energy and need for variety. Libra (Tula) — air-sign harmony with shared love of ideas, justice, and social engagement. Sagittarius (Dhanu) — shared idealism, love of freedom, and progressive outlook. Aries (Mesha) — fire fuels air; mutual respect for independence and direct action.',
    hi: 'मिथुन — सह-वायु राशि जो कुम्भ की बौद्धिक ऊर्जा और विविधता की आवश्यकता से मेल। तुला — विचारों, न्याय और सामाजिक संलग्नता के साझा प्रेम में वायु-राशि सामंजस्य। धनु — साझा आदर्शवाद, स्वतन्त्रता प्रेम और प्रगतिशील दृष्टिकोण। मेष — अग्नि वायु को पोषित; स्वतन्त्रता का परस्पर सम्मान।'
  },
  challenging: {
    en: 'Taurus (Vrishabha) — the Bull\'s material attachment and resistance to change clashes with Aquarius\'s progressive vision. Scorpio (Vrischika) — both are fixed signs; Scorpio\'s emotional intensity overwhelms Aquarius\'s intellectual detachment. Leo (Simha) — opposite sign; the Lion\'s need for personal attention conflicts with Aquarius\'s collective orientation.',
    hi: 'वृषभ — भौतिक आसक्ति और परिवर्तन प्रतिरोध कुम्भ की प्रगतिशील दृष्टि से टकराता है। वृश्चिक — दोनों स्थिर; भावनात्मक तीव्रता बौद्धिक विरक्ति को अभिभूत करती है। सिंह — विपरीत राशि; व्यक्तिगत ध्यान की आवश्यकता कुम्भ के सामूहिक अभिविन्यास से टकराती है।'
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Shani Dev is the primary deity, as with Capricorn. Additionally, Lord Dattatreya — the combined form of Brahma, Vishnu, and Shiva representing cosmic unity — resonates with Aquarius\'s universalist vision. Narayana in his Matsya (Fish) avatara, who saved the Vedas from the cosmic deluge, also aligns with the Water-Bearer\'s theme of preserving and distributing cosmic knowledge.',
    hi: 'मकर की तरह भगवान शनि देव प्राथमिक देवता। इसके अतिरिक्त, भगवान दत्तात्रेय — ब्रह्मा, विष्णु और शिव का संयुक्त रूप जो ब्रह्मांडीय एकता का प्रतिनिधित्व करता है — कुम्भ की सार्वभौमिक दृष्टि से गूँजता है। मत्स्य अवतार में नारायण, जिन्होंने प्रलय से वेदों की रक्षा की, जल-वाहक के दिव्य ज्ञान वितरण विषय से मेल।'
  },
  practices: {
    en: 'Same Saturn remedies as Capricorn apply: Shani Beej Mantra, Blue Sapphire (with caution), Saturday fasting, black sesame donation. Additionally for Aquarius: Rahu remedies may be needed — donate blue cloth, electrical equipment, or technology to educational institutions. Serve mentally ill or marginalized communities. Practice detached meditation (Vipassana) to balance the air element. Distribute knowledge freely through teaching, writing, or creating open-source technology. The most powerful Aquarius remedy is building something that serves people you will never meet.',
    hi: 'मकर जैसे शनि उपाय: शनि बीज मन्त्र, नीलम (सावधानी से), शनिवार व्रत, काला तिल दान। कुम्भ हेतु अतिरिक्त: राहु उपाय — नीला वस्त्र, विद्युत उपकरण या प्रौद्योगिकी शैक्षिक संस्थानों को दान। मानसिक रोगी या हाशिए के समुदायों की सेवा। वायु तत्त्व सन्तुलन हेतु विपश्यना ध्यान। शिक्षण, लेखन या ओपन-सोर्स तकनीक से ज्ञान मुक्त वितरण। सबसे शक्तिशाली कुम्भ उपाय: ऐसा कुछ बनाना जो उन लोगों की सेवा करे जिनसे आप कभी नहीं मिलेंगे।'
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The Kumbha (water pot) is one of the most sacred symbols in Hindu tradition. During the Samudra Manthan (churning of the cosmic ocean), the Kumbha containing Amrita (the nectar of immortality) emerged from the churning. As Dhanvantari, the divine physician, carried the pot, drops of nectar fell at four places on earth — Haridwar, Prayagraj (Allahabad), Nashik, and Ujjain — which became the sites of the Kumbh Mela, the largest human gathering on Earth. The Water-Bearer of Aquarius represents this act of cosmic distribution — taking divine knowledge and making it available to all beings without discrimination. The pot itself symbolizes the body as a vessel for consciousness; the water symbolizes knowledge that must flow freely to nourish all. The Kumbh Mela\'s timing is determined by Jupiter\'s transit through specific signs — connecting Jupiter\'s wisdom to Aquarius\'s distribution principle. In the Kala Purusha (cosmic being), Aquarius corresponds to the shins and calves — the limbs that carry the body forward, just as Aquarian ideas carry civilization into the future.',
    hi: 'कुम्भ (जल कलश) हिन्दू परम्परा के सबसे पवित्र प्रतीकों में। समुद्र मन्थन (ब्रह्मांडीय सागर का मन्थन) में अमृत (अमरत्व का अमृत) युक्त कुम्भ प्रकट हुआ। धन्वन्तरि के ले जाते समय अमृत की बूँदें पृथ्वी पर चार स्थानों — हरिद्वार, प्रयागराज, नासिक और उज्जैन — पर गिरीं जो कुम्भ मेला स्थल बने, पृथ्वी का सबसे बड़ा मानव समागम। कुम्भ का जल-वाहक इस ब्रह्मांडीय वितरण का प्रतिनिधित्व करता है — दिव्य ज्ञान लेकर बिना भेदभाव सभी प्राणियों को उपलब्ध कराना। कलश शरीर चेतना का पात्र; जल ज्ञान जो सबको पोषित करने हेतु मुक्त बहना चाहिए। काल पुरुष में कुम्भ पिण्डलियों से सम्बन्धित — अंग जो शरीर को आगे ले जाते हैं, जैसे कुम्भ विचार सभ्यता को भविष्य में।'
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'All Twelve Rashis', hi: 'सभी बारह राशियाँ' } },
  { href: '/learn/shani', label: { en: 'Shani (Saturn) — Ruler of Kumbha', hi: 'शनि — कुम्भ का स्वामी' } },
  { href: '/learn/rahu', label: { en: 'Rahu — Co-ruler of Kumbha', hi: 'राहु — कुम्भ का सह-स्वामी' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/meena', label: { en: 'Meena (Pisces) — Next Sign', hi: 'मीन — अगली राशि' } },
  { href: '/learn/makara', label: { en: 'Makara (Capricorn) — Previous Sign', hi: 'मकर — पिछली राशि' } },
  { href: '/learn/sade-sati', label: { en: 'Sade Sati — Saturn\'s Transit', hi: 'साढ़ेसाती — शनि का गोचर' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function KumbhaPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
          <span className="text-4xl">♒</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Kumbha — Aquarius', hi: 'कुम्भ राशि — जल-वाहक' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The eleventh sign of the zodiac — Saturn\'s airy domain of innovation, collective consciousness, humanitarian vision, and the democratic distribution of cosmic knowledge.', hi: 'राशिचक्र की एकादश राशि — शनि का वायव्य क्षेत्र, नवाचार, सामूहिक चेतना, मानवतावादी दृष्टि और दिव्य ज्ञान का लोकतान्त्रिक वितरण।' })}
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
        <p style={bf}>{ml({ en: 'Kumbha (Aquarius) is the eleventh sign of the zodiac, spanning 300° to 330°. Ruled by Saturn (Shani) with Rahu as co-ruler per many traditions, it is the fixed air sign — combining intellectual clarity with unwavering determination. The Water-Bearer symbolizes the cosmic act of distributing divine knowledge to all beings without discrimination. As the natural ruler of the eleventh house (Labha Bhava), Aquarius governs gains, fulfillment of desires, large organizations, friendships, elder siblings, and the collective aspirations of humanity. It is the sign where individual wisdom becomes collective liberation — where Saturn\'s discipline serves Rahu\'s vision of a radically different future.', hi: 'कुम्भ राशिचक्र की एकादश राशि है, 300° से 330° तक। शनि द्वारा शासित, कई परम्पराओं में राहु सह-स्वामी, यह स्थिर वायु राशि है — बौद्धिक स्पष्टता को अटल दृढ़ता से जोड़ती है। जल-वाहक बिना भेदभाव सभी प्राणियों को दिव्य ज्ञान वितरण का ब्रह्मांडीय कृत्य। एकादश भाव (लाभ भाव) का स्वाभाविक शासक — लाभ, इच्छा पूर्ति, बड़े संगठन, मित्रता और मानवता की सामूहिक आकांक्षाएँ।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svaroopa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <div className="space-y-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'शक्तियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Temperament & Constitution', hi: 'स्वभाव एवं संरचना' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक रूप' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
          </div>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Adhyaya" />
      </LessonSection>

      {/* ── 3. Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Kumbha', hi: 'कुम्भ में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Aquarius contains parts of three nakshatras whose lords — Mars, Rahu, and Jupiter — create a powerful progression: collective wealth-building (Dhanishtha/Mars), scientific healing and penetrating insight (Shatabhisha/Rahu), and radical philosophical transformation (Purva Bhadrapada/Jupiter). Together they embody the Aquarian journey from material cooperation through intellectual breakthrough to revolutionary wisdom.', hi: 'कुम्भ में तीन नक्षत्रों के अंश जिनके स्वामी — मंगल, राहु और गुरु — एक शक्तिशाली क्रम: सामूहिक धन-निर्माण (धनिष्ठा/मंगल), वैज्ञानिक चिकित्सा और भेदक अन्तर्दृष्टि (शतभिषा/राहु), और आमूल दार्शनिक परिवर्तन (पूर्वभाद्रपद/गुरु)।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">{ml(n.lord)}</span>
            </div>
            <p className="text-text-secondary text-xs mb-2">{ml(n.range)}</p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.nature)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Nakshatra Vibhaga" />
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Kumbha', hi: 'कुम्भ में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Aquarius is unique among the signs: no planet is exalted here, and no planet is debilitated. This egalitarian absence reflects the sign\'s democratic nature — Kumbha neither elevates nor humbles individual planets but demands that all serve the collective good. Saturn rules with moolatrikona authority (0°-20°), while Rahu co-rules with innovative vision.', hi: 'कुम्भ राशियों में अनूठी: कोई ग्रह यहाँ उच्च नहीं, कोई नीच नहीं। यह समतावादी अनुपस्थिति राशि की लोकतान्त्रिक प्रकृति दर्शाती है — कुम्भ न व्यक्तिगत ग्रहों को उठाता है न विनम्र करता है बल्कि सभी से सामूहिक हित की सेवा माँगता है। शनि मूलत्रिकोण अधिकार (0°-20°) से शासन, राहु नवीन दृष्टि से सह-शासन।' })}</p>
        <div className="space-y-3">
          {Object.entries(PLANETARY_DIGNITIES_HERE).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha-Adi" />
      </LessonSection>

      {/* ── 5. Each Planet in Kumbha ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Aquarius', hi: 'कुम्भ में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Planets in Aquarius must align their individual nature with collective purpose. Personal planets (Sun, Moon, Venus) find their natural self-expression challenged by the sign\'s impersonal, group-oriented demands. Intellectual planets (Mercury, Jupiter) thrive in Kumbha\'s innovative atmosphere. Saturn and Rahu find their fullest expression here.', hi: 'कुम्भ में ग्रहों को अपनी व्यक्तिगत प्रकृति को सामूहिक उद्देश्य से संरेखित करना होता है। व्यक्तिगत ग्रह (सूर्य, चन्द्र, शुक्र) की स्वाभाविक आत्म-अभिव्यक्ति राशि की निर्वैयक्तिक माँगों से चुनौतीपूर्ण। बौद्धिक ग्रह (बुध, गुरु) कुम्भ के नवीन वातावरण में फलते हैं।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              {p.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Own') || p.dignity.includes('Moolatrikona') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  p.dignity.includes('Co-ruler') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                  p.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
                  p.dignity.includes('Enemy') ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{p.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala" />
      </LessonSection>

      {/* ── 6. Career Tendencies ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Life', hi: 'करियर एवं व्यावसायिक जीवन' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.nature)}</p>
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'The Aquarian career reaches its peak when the native stops asking "what can I achieve?" and starts asking "what can I build that will serve people I will never meet?" The shift from personal ambition to systemic impact is the defining transition of the Kumbha professional life.', hi: 'कुम्भ करियर चरम पर तब पहुँचता है जब जातक "मैं क्या प्राप्त कर सकता हूँ?" पूछना बन्द कर "मैं ऐसा क्या बना सकता हूँ जो उन लोगों की सेवा करे जिनसे मैं कभी नहीं मिलूँगा?" पूछना शुरू करता है। व्यक्तिगत महत्वाकांक्षा से प्रणालीगत प्रभाव में यह बदलाव कुम्भ व्यावसायिक जीवन का निर्णायक संक्रमण है।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वोत्तम जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
        <ClassicalReference shortName="JP" chapter="Ch. 19 — Vivaha (Marriage)" />
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्री देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Practices & Remedial Measures', hi: 'साधना एवं उपचारात्मक उपाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Aquarius remedies work differently from other signs — the most effective remedy is not personal worship but collective service. Building systems that help others, sharing knowledge freely, and creating technology that democratizes access to resources align the native with Kumbha\'s highest vibration. Saturn is pleased by service; Rahu is pleased by innovation. Do both, and the sign becomes your greatest ally.', hi: 'कुम्भ उपाय अन्य राशियों से भिन्न — सबसे प्रभावी उपाय व्यक्तिगत पूजा नहीं बल्कि सामूहिक सेवा। दूसरों की मदद करने वाली प्रणालियाँ बनाना, ज्ञान मुक्त रूप से बाँटना और संसाधनों तक पहुँच लोकतान्त्रिक करने वाली तकनीक। शनि सेवा से प्रसन्न; राहु नवाचार से। दोनों करें, और राशि आपकी सबसे बड़ी सहयोगी बने।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Characteristics" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Kumbha (Aquarius) is the eleventh sign — air element, fixed quality, ruled by Saturn (moolatrikona 0°-20°) with Rahu as co-ruler. Spans 300°-330°.', hi: 'कुम्भ एकादश राशि — वायु तत्त्व, स्थिर गुण, शनि द्वारा शासित (मूलत्रिकोण 0°-20°) राहु सह-स्वामी। 300°-330°।' }),
        ml({ en: 'No planet is exalted or debilitated here — reflecting the sign\'s egalitarian nature. Body: ankles, calves, circulatory system.', hi: 'कोई ग्रह यहाँ उच्च या नीच नहीं — राशि की समतावादी प्रकृति। शरीर: टखने, पिण्डलियाँ, रक्त संचार।' }),
        ml({ en: 'Three nakshatras: Dhanishtha padas 3-4 (Mars), Shatabhisha (Rahu), Purva Bhadrapada padas 1-3 (Jupiter).', hi: 'तीन नक्षत्र: धनिष्ठा पद 3-4 (मंगल), शतभिषा (राहु), पूर्वभाद्रपद पद 1-3 (गुरु)।' }),
        ml({ en: 'Remedy: Blue Sapphire (with caution), Saturday fasting, service to marginalized communities, and building systems that serve people you will never meet.', hi: 'उपाय: नीलम (सावधानी से), शनिवार व्रत, हाशिए के समुदायों की सेवा, और ऐसी प्रणालियाँ बनाना जो अज्ञात लोगों की सेवा करें।' }),
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
