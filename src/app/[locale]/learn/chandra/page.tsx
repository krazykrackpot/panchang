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
  { devanagari: 'चन्द्र', transliteration: 'Chandra', meaning: { en: 'The Moon — lord of the mind', hi: 'चन्द्र — मन के स्वामी' } },
  { devanagari: 'मनोकारक', transliteration: 'Manokāraka', meaning: { en: 'Significator of the mind', hi: 'मन का कारक' } },
  { devanagari: 'सोम', transliteration: 'Soma', meaning: { en: 'The nectarine one, giver of Soma', hi: 'सोम — अमृत देने वाले' } },
  { devanagari: 'शीतांशु', transliteration: 'Shītāṃshu', meaning: { en: 'The cool-rayed one', hi: 'शीतल किरणों वाले' } },
  { devanagari: 'निशाकर', transliteration: 'Nishākara', meaning: { en: 'Maker of the night', hi: 'रात्रि का निर्माता' } },
  { devanagari: 'शशि', transliteration: 'Shashī', meaning: { en: 'The one who carries the hare (lunar mark)', hi: 'खरगोश चिह्न वाले' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Taurus (Vrishabha) — deepest exaltation at 3°', hi: 'वृषभ — 3° पर परम उच्च' },
  debilitation: { en: 'Scorpio (Vrishchika) — deepest debilitation at 3°', hi: 'वृश्चिक — 3° पर परम नीच' },
  ownSign: { en: 'Cancer (Karka)', hi: 'कर्क' },
  moolatrikona: { en: 'Taurus 4°–20°', hi: 'वृषभ 4°–20°' },
  friends: { en: 'Sun, Mercury', hi: 'सूर्य, बुध' },
  enemies: { en: 'None — Moon has no natural enemies', hi: 'कोई नहीं — चन्द्र का कोई शत्रु नहीं' },
  neutral: { en: 'Mars, Jupiter, Venus, Saturn', hi: 'मंगल, गुरु, शुक्र, शनि' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Mother, queen, nurse, healer, public, common people', hi: 'माता, रानी, दाई, वैद्य, जनता, सामान्य जन' },
  bodyParts: { en: 'Mind, blood, fluids, left eye (male) / right eye (female), breasts, stomach, lungs', hi: 'मन, रक्त, शरीर के तरल, बायाँ नेत्र (पुरुष) / दायाँ नेत्र (स्त्री), वक्ष, उदर, फेफड़े' },
  professions: { en: 'Nursing, shipping, agriculture, dairy, hospitality, psychology, public service, midwifery', hi: 'नर्सिंग, नौवहन, कृषि, डेयरी, आतिथ्य, मनोविज्ञान, लोक सेवा, दाई' },
  materials: { en: 'Pearl (Moti), silver, rice, white cloth, milk, camphor, white sandalwood', hi: 'मोती, चाँदी, चावल, श्वेत वस्त्र, दूध, कपूर, श्वेत चन्दन' },
  direction: { en: 'North-West (Vayavya)', hi: 'वायव्य (उत्तर-पश्चिम)' },
  day: { en: 'Monday (Somavara)', hi: 'सोमवार' },
  color: { en: 'White / pale silver', hi: 'श्वेत / हल्का रजत' },
  season: { en: 'Varsha (Monsoon)', hi: 'वर्षा ऋतु' },
  taste: { en: 'Salty (Lavana)', hi: 'लवण (नमकीन)' },
  guna: { en: 'Sattva', hi: 'सत्त्व' },
  element: { en: 'Water (Jala)', hi: 'जल तत्त्व' },
  gender: { en: 'Feminine', hi: 'स्त्रीलिंग' },
  nature: { en: 'Benefic when waxing (Shukla Paksha), malefic when waning (Krishna Paksha)', hi: 'शुक्ल पक्ष में शुभ, कृष्ण पक्ष में अशुभ' },
};

// ─── Moon in 12 Signs ──────────────────────────────────────────────────
const MOON_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Neutral',
    effect: { en: 'Moon in Mars\'s fire sign creates an emotionally impulsive, courageous, and restless mind. Feelings are intense but short-lived. The native acts first and reflects later. Quick to anger but equally quick to forgive. There is a pioneering emotional spirit that thrives on new experiences. Excellent for competitive fields, sports psychology, and emergency services. The mind needs constant stimulation and can become irritable if bored.', hi: 'मंगल की अग्नि राशि में चन्द्र भावनात्मक रूप से आवेगी, साहसी और अशान्त मन बनाता है। भावनाएँ तीव्र किन्तु अल्पकालिक। जातक पहले कार्य करता है, बाद में विचार। क्रोध शीघ्र आता है किन्तु क्षमा भी उतनी ही शीघ्र। प्रतिस्पर्धी क्षेत्रों के लिए उत्तम।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Exalted',
    effect: { en: 'Moon is exalted here — the mind finds its deepest peace and stability. Emotional security comes through material comfort, beauty, and sensory pleasures. The native has a naturally calm, patient, and nurturing temperament. Excellent taste in art, music, and food. Strong attachment to home, family, and land. Financial acumen is strong. The deepest exaltation at 3° produces people who are emotionally unshakeable — steady, reliable, and deeply compassionate. Can become possessive or resistant to change if afflicted.', hi: 'चन्द्र यहाँ उच्च है — मन को गहनतम शान्ति और स्थिरता मिलती है। भौतिक सुख, सौन्दर्य और इन्द्रिय सुखों से भावनात्मक सुरक्षा। स्वाभाविक रूप से शान्त, धैर्यवान और पोषक स्वभाव। कला, संगीत और भोजन में उत्तम रुचि। 3° पर परम उच्च भावनात्मक रूप से अडिग व्यक्ति बनाता है।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: 'Neutral',
    effect: { en: 'Moon in Mercury\'s dual air sign creates a quick, curious, and mentally versatile mind. The native processes emotions through communication — talking, writing, and analyzing feelings rather than simply experiencing them. Excellent for journalism, teaching, and counseling. The mind is adaptable but may scatter across too many interests. Emotional nature can be perceived as superficial because feelings are expressed intellectually. Strong desire for variety in relationships and social connections.', hi: 'बुध की द्वैत वायु राशि में चन्द्र तीव्र, जिज्ञासु और मानसिक रूप से बहुमुखी मन बनाता है। जातक संवाद से भावनाओं को संसाधित करता है — बात करके, लिखकर, विश्लेषण करके। पत्रकारिता, शिक्षण और परामर्श के लिए उत्तम। मन अनुकूलनीय किन्तु बहुत रुचियों में बिखर सकता है।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Own sign',
    effect: { en: 'Moon in its own sign — the queen on her throne. This is the most emotionally sensitive, intuitive, and nurturing placement. The native absorbs the feelings of everyone around them like a psychic sponge. Deep attachment to mother, home, and homeland. Natural ability in cooking, caregiving, real estate, and anything involving public welfare. Memory is exceptionally strong, especially for emotional events. The domestic life is of paramount importance. Can become moody, clingy, or overly protective if the Moon is waning or afflicted.', hi: 'चन्द्र अपनी राशि में — रानी अपने सिंहासन पर। सबसे भावनात्मक रूप से संवेदनशील, अन्तर्ज्ञानी और पोषक स्थिति। जातक सबकी भावनाओं को आत्मसात करता है। माता, घर और मातृभूमि से गहरा लगाव। खाना पकाना, देखभाल, भूमि सम्पत्ति में स्वाभाविक योग्यता। स्मृति अत्यन्त सशक्त।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: 'Friend\'s sign',
    effect: { en: 'Moon in the Sun\'s sign — the mind seeks recognition, drama, and creative self-expression. Emotionally generous, warm-hearted, and fiercely loyal. The native has a regal emotional bearing and expects to be treated with respect. Excellent for performing arts, politics, and any role involving public attention. Children bring great emotional fulfillment. The ego and emotions merge — the native feels deeply hurt by disrespect. Leadership comes naturally through emotional charisma rather than cold authority.', hi: 'सूर्य की राशि में चन्द्र — मन मान्यता, नाटक और सृजनात्मक आत्माभिव्यक्ति चाहता है। भावनात्मक रूप से उदार, उष्ण हृदय और प्रबल निष्ठावान। प्रदर्शन कला, राजनीति और सार्वजनिक ध्यान वाली भूमिकाओं के लिए उत्तम। संतान से गहरी भावनात्मक तृप्ति।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Friend\'s sign',
    effect: { en: 'Moon in Mercury\'s earth sign creates a discriminating, analytical, and service-oriented emotional nature. The native processes feelings through logic — organizing, categorizing, and often worrying about details. Excellent for healthcare, nutrition, accounting, and any precision work. The mind finds peace in order and routine. Can be overly critical of self and others. Health consciousness is strong but may tip into anxiety about bodily functions. The emotional nature serves others before self, which is both a strength and a vulnerability.', hi: 'बुध की पृथ्वी राशि में चन्द्र विवेकशील, विश्लेषणात्मक और सेवा-उन्मुख भावनात्मक स्वभाव बनाता है। जातक तर्क से भावनाओं को संसाधित करता है। स्वास्थ्य देखभाल, पोषण, लेखा और सूक्ष्म कार्य के लिए उत्तम। मन को व्यवस्था और दिनचर्या में शान्ति मिलती है।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Neutral',
    effect: { en: 'Moon in Venus\'s air sign — the mind craves harmony, beauty, and balanced relationships. Diplomatic and socially graceful, the native is skilled at reading others\' emotions and mediating conflicts. Aesthetics deeply affect mood — an ugly environment causes genuine distress. Partnership is central to emotional wellbeing; loneliness is intolerable. Excellent for art, design, law, and diplomacy. Decision-making can be agonizingly slow as the mind weighs all perspectives. Justice and fairness are emotional needs, not just intellectual ideals.', hi: 'शुक्र की वायु राशि में चन्द्र — मन सामंजस्य, सौन्दर्य और सन्तुलित सम्बन्ध चाहता है। कूटनीतिक और सामाजिक रूप से कुशल। साझेदारी भावनात्मक कल्याण का केन्द्र। कला, डिज़ाइन, विधि और कूटनीति के लिए उत्कृष्ट। निर्णय लेना कष्टदायक रूप से धीमा हो सकता है।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Debilitated',
    effect: { en: 'Moon is debilitated here — the mind plunges into deep, turbulent emotional waters. Intense, secretive, and psychologically penetrating. The native experiences emotions at their most extreme — love becomes obsession, hurt becomes desire for revenge. Yet this placement produces the most powerful intuition, research ability, and capacity for psychological transformation. The deepest fall at 3° means the mind is perpetually processing hidden fears, past traumas, and power dynamics. Neecha Bhanga (cancellation) is common and can produce brilliant psychologists, detectives, and healers who transform through understanding darkness.', hi: 'चन्द्र यहाँ नीच है — मन गहरे, अशान्त भावनात्मक जल में डूबता है। तीव्र, गोपनीय और मनोवैज्ञानिक रूप से भेदक। 3° पर परम नीचता — मन निरन्तर गुप्त भय, पुराने आघात और शक्ति गतिशीलता संसाधित करता है। नीच भंग सामान्य है और उत्कृष्ट मनोवैज्ञानिक और अन्वेषक बना सकता है।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Neutral',
    effect: { en: 'Moon in Jupiter\'s fire sign — the mind is optimistic, philosophical, and freedom-loving. Emotional fulfillment comes through higher learning, travel, and spiritual seeking. The native has a generous, jovial temperament that lifts others\' spirits. Teaching and preaching feel emotionally natural. Can be restless, moralistic, or preachy about beliefs. Long-distance travel and foreign cultures nourish the soul. The mind needs big visions and grand purposes — petty details cause emotional suffocation.', hi: 'गुरु की अग्नि राशि में चन्द्र — मन आशावादी, दार्शनिक और स्वतन्त्रता-प्रेमी। उच्च शिक्षा, यात्रा और आध्यात्मिक खोज से भावनात्मक तृप्ति। उदार, हँसमुख स्वभाव। शिक्षण और उपदेश भावनात्मक रूप से स्वाभाविक। दीर्घ यात्रा और विदेशी संस्कृतियाँ आत्मा का पोषण करती हैं।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: 'Neutral',
    effect: { en: 'Moon in Saturn\'s earth sign — the mind is disciplined, reserved, and emotionally austere. Feelings are suppressed or expressed through duty and responsibility rather than warmth. The native may have experienced emotional deprivation in early life, especially from the mother. Emotional maturity comes late but runs very deep. Excellent for government service, large organizations, and long-term planning. Ambition is emotionally driven. The native earns emotional security through achievement, status, and material stability rather than personal relationships.', hi: 'शनि की पृथ्वी राशि में चन्द्र — मन अनुशासित, संयमित और भावनात्मक रूप से तपस्वी। भावनाएँ दबी रहती हैं या कर्तव्य के माध्यम से व्यक्त होती हैं। प्रारम्भिक जीवन में भावनात्मक अभाव सम्भव। भावनात्मक परिपक्वता देर से आती है किन्तु बहुत गहरी होती है।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: 'Neutral',
    effect: { en: 'Moon in Saturn\'s air sign — the mind is humanitarian, detached, and intellectually oriented. Emotions are processed through social ideals rather than personal attachments. The native feels deeply about collective injustice but may struggle with intimate emotional bonds. Excellent for social work, technology, scientific research, and activism. Friendships are valued more than family ties. The emotional nature is unconventional — the native may shock others with their emotional detachment from tradition while being passionately committed to abstract causes.', hi: 'शनि की वायु राशि में चन्द्र — मन मानवतावादी, विरक्त और बौद्धिक रूप से उन्मुख। भावनाएँ सामाजिक आदर्शों से संसाधित होती हैं। सामूहिक अन्याय के प्रति गहरी अनुभूति किन्तु अन्तरंग सम्बन्धों में कठिनाई। सामाजिक कार्य, प्रौद्योगिकी और सक्रियतावाद के लिए उत्कृष्ट।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Neutral',
    effect: { en: 'Moon in Jupiter\'s water sign — the most empathetic, imaginative, and spiritually receptive placement. The native\'s emotional boundaries are porous — they feel the suffering of the world as their own. Extraordinary artistic and musical talent. Dreams are vivid and often prophetic. Natural healing ability through touch, prayer, or simply presence. Can be escapist, delusional, or addicted to substances if afflicted. The mind seeks merge with the divine. Excellent for charity, music, painting, spiritual counseling, and monastic life.', hi: 'गुरु की जल राशि में चन्द्र — सबसे सहानुभूतिपूर्ण, कल्पनाशील और आध्यात्मिक रूप से ग्रहणशील स्थिति। जातक की भावनात्मक सीमाएँ छिद्रित — संसार की पीड़ा को अपनी मानता है। असाधारण कलात्मक और संगीत प्रतिभा। स्वप्न स्पष्ट और प्रायः भविष्यसूचक।' } },
];

// ─── Moon in 12 Houses ─────────────────────────────────────────────────
const MOON_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Moon in the ascendant creates a personality dominated by emotions, nurturing instincts, and public appeal. The native is physically attractive with a round, pleasant face and pale complexion. Mood fluctuations directly affect health and appearance. The person is approachable, empathetic, and popular with the masses. Mother\'s influence on personality is paramount. When the Moon is waxing and well-aspected, this produces charismatic public figures, healers, and nurturers. Waning or afflicted Moon here creates emotional instability and identity confusion.', hi: 'लग्न में चन्द्र भावनाओं, पोषण प्रवृत्ति और जनता से लोकप्रियता से प्रभावित व्यक्तित्व बनाता है। गोल, सुखद चेहरा और गोरा रंग। मनोदशा सीधे स्वास्थ्य को प्रभावित करती है। माता का व्यक्तित्व पर सर्वाधिक प्रभाव।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Wealth accumulation through public-facing work, food industry, liquids, or caregiving professions. The voice is melodious and emotionally expressive — excellent for singing or public speaking. Family life is emotionally rich and the native values domestic traditions. Fluctuating finances that mirror emotional cycles. The left eye may be sensitive. Fond of good food and may overindulge in comfort eating. Inherited wealth from the mother\'s side is indicated. Speech carries emotional weight and can move people to tears or laughter.', hi: 'जनता से जुड़े कार्य, खाद्य उद्योग या देखभाल व्यवसायों से धन संचय। मधुर और भावनात्मक वाणी — गायन के लिए उत्कृष्ट। पारिवारिक जीवन भावनात्मक रूप से समृद्ध। भावनात्मक चक्रों के अनुसार वित्त में उतार-चढ़ाव। माता पक्ष से विरासत संभव।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Creative communication, emotional writing, and strong bonds with siblings — especially sisters. The mind is curious and restless, seeking constant mental stimulation through short trips, conversations, and new skills. Excellent for poets, lyricists, bloggers, and emotional storytellers. Hands are expressive and skilled in artistic crafts. The native may change residences frequently. Courage fluctuates with emotional state — bold when happy, timid when low. Younger siblings may be emotionally dependent on the native.', hi: 'सृजनात्मक संवाद, भावनात्मक लेखन और भाई-बहनों से प्रगाढ़ बन्ध — विशेषतः बहनों से। मन जिज्ञासु और अशान्त। कवियों, गीतकारों और भावनात्मक कथाकारों के लिए उत्कृष्ट। साहस भावनात्मक स्थिति के साथ बदलता है।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Moon is Digbali (directionally strong) in the 4th house — this is the most powerful placement for emotional wellbeing. The native has a beautiful home, loving mother, and deep inner peace. Property ownership, vehicles, and domestic comforts come naturally. Strong connection to homeland and ancestral roots. The heart is content and the mind is at ease. Academic success, especially in early education. When afflicted, the native is restless despite material comfort — the mind cannot settle. This placement can produce great real estate professionals, interior designers, and psychologists.', hi: 'चन्द्र चतुर्थ भाव में दिग्बली — भावनात्मक कल्याण के लिए सबसे शक्तिशाली स्थिति। सुन्दर घर, स्नेहमयी माता और गहरी आन्तरिक शान्ति। सम्पत्ति, वाहन और घरेलू सुख स्वाभाविक। मातृभूमि और पैतृक जड़ों से गहरा जुड़ाव। शैक्षिक सफलता, विशेषतः प्रारम्भिक शिक्षा में।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Emotionally creative, romantic, and deeply attached to children. The mind is imaginative and artistically gifted — painting, music, theater, and cinema are natural domains. Strong intuitive intelligence that excels in speculation and investment. Children are a primary source of emotional fulfillment, especially daughters. Romance is deeply emotional and the native falls in love easily. Mantra siddhi is strong when combined with genuine devotion. Past-life merits bring innate wisdom and spiritual inclination. Can become emotionally dramatic or overly attached to romantic partners.', hi: 'भावनात्मक रूप से सृजनात्मक, रोमांटिक और संतान से गहरा लगाव। कल्पनाशील और कलात्मक — चित्रकला, संगीत, रंगमंच स्वाभाविक क्षेत्र। सट्टा और निवेश में उत्कृष्ट अन्तर्ज्ञान। संतान भावनात्मक तृप्ति का प्राथमिक स्रोत। मन्त्र सिद्धि प्रबल।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Emotional disturbance through enemies, illness, and service demands. The native may suffer from stomach issues, water-related ailments, or psychosomatic disorders. However, this placement gives strong service instinct — excellent for nursing, social work, and caregiving professions. Enemies are often female. The mother may face health challenges. The native overcomes obstacles through emotional resilience rather than brute force. Fluctuating health that mirrors mental state. Can produce excellent doctors and healers who understand that illness has emotional roots.', hi: 'शत्रुओं, रोग और सेवा माँगों से भावनात्मक अशान्ति। उदर विकार, जल-सम्बन्धी रोग या मनोदैहिक विकार सम्भव। तथापि सेवा प्रवृत्ति प्रबल — नर्सिंग और सामाजिक कार्य के लिए उत्कृष्ट। माता को स्वास्थ्य चुनौतियाँ हो सकती हैं।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'The spouse is emotionally nurturing, attractive, and possibly connected to public-facing professions. Marriage is emotionally intense and the native defines their identity through partnership. The partner may have Moon-like qualities — fair, caring, moody. Business partnerships benefit from public dealings and the food/hospitality industry. Multiple relationships are possible if Moon is afflicted. Foreign travel or settlement through marriage is indicated. The native needs emotional validation from their partner above all else.', hi: 'जीवनसाथी भावनात्मक रूप से पोषक, आकर्षक। विवाह भावनात्मक रूप से तीव्र। साथी में चन्द्र-जैसे गुण — गोरा, स्नेही, मनमौजी। विवाह के माध्यम से विदेश यात्रा या बसावट संकेतित। जातक को साथी से भावनात्मक प्रमाणन सबसे अधिक चाहिए।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Deep psychological intensity, psychic abilities, and emotional transformation through crisis. The native is drawn to occult sciences, tantra, and the mysteries of death and rebirth. Emotional life is turbulent — the mind processes hidden fears, ancestral karma, and subconscious patterns. Inheritance from the mother or through marriage. Chronic health issues related to lungs, blood, or reproductive system. Sexual energy is intense and can be channeled into spiritual practices. This placement produces powerful healers, astrologers, and researchers who are comfortable with the shadow side of existence.', hi: 'गहन मनोवैज्ञानिक तीव्रता, पराभौतिक क्षमताएँ और संकट से भावनात्मक परिवर्तन। गूढ़ विज्ञान, तन्त्र और मृत्यु के रहस्यों की ओर आकर्षण। माता या विवाह से विरासत। फेफड़े, रक्त या प्रजनन तन्त्र से सम्बन्धित स्वास्थ्य समस्याएँ। शक्तिशाली उपचारक और ज्योतिषी बनाता है।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Deeply fortunate placement — the mind is oriented toward dharma, philosophy, and spiritual growth. The native\'s mother is religious and influential in shaping moral values. Long-distance travel, especially pilgrimage, brings emotional nourishment. Natural inclination toward teaching, preaching, and sharing wisdom. The guru-disciple relationship is emotionally significant. Luck is strong and comes through intuitive decisions rather than calculated planning. Foreign education or settlement brings emotional satisfaction. The native\'s faith is emotionally anchored — they believe because they feel, not because they analyze.', hi: 'अत्यन्त भाग्यशाली स्थिति — मन धर्म, दर्शन और आध्यात्मिक विकास की ओर। माता धार्मिक और नैतिक मूल्य गढ़ने में प्रभावशाली। तीर्थयात्रा भावनात्मक पोषण देती है। शिक्षण और ज्ञान साझा करने की स्वाभाविक प्रवृत्ति। भाग्य प्रबल और अन्तर्ज्ञान-आधारित।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Public career, fame through emotional connection with the masses, and a professional life centered on nurturing or public welfare. The native may hold government positions or work in hospitality, healthcare, or food industries. Career fluctuations mirror emotional cycles — success when the mind is stable, struggles when disturbed. Mother may be professionally accomplished or influential in career choices. This placement produces popular leaders, actors, and public servants who win hearts rather than arguments. The native\'s reputation depends on emotional authenticity.', hi: 'सार्वजनिक करियर, जनता से भावनात्मक जुड़ाव से यश। सरकारी पद या आतिथ्य, स्वास्थ्य देखभाल, खाद्य उद्योग में कार्य। करियर में उतार-चढ़ाव भावनात्मक चक्रों से मेल खाते हैं। माता करियर विकल्पों में प्रभावशाली। हृदय जीतने वाले लोकप्रिय नेता बनाता है।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Excellent for fulfilling desires, gaining wealth through social networks, and building emotional bonds with large groups. Elder siblings, especially sisters, are supportive. Income comes from public-facing businesses, water-related industries, or caregiving. The native has a large circle of friends and is emotionally generous with resources. Community involvement brings deep satisfaction. Political connections through emotional appeal rather than ideology. Financial gains fluctuate but trend upward over time. The native\'s ambitions are emotionally driven — they want success for the people they love.', hi: 'इच्छाओं की पूर्ति, सामाजिक नेटवर्क से धन और बड़े समूहों से भावनात्मक बन्ध के लिए उत्कृष्ट। बड़ी बहनें सहायक। जनता से जुड़े व्यवसाय या देखभाल से आय। बड़ा मित्र मण्डल और संसाधनों में भावनात्मक उदारता। वित्तीय लाभ में उतार-चढ़ाव किन्तु समय के साथ ऊपर की ओर।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'The mind dissolves into dreams, spiritual seeking, and otherworldly experiences. Excellent for meditation, charitable work, and living in foreign lands. The native may feel emotionally disconnected from material life, seeking solace in isolation, ashrams, or hospitals. Sleep is deep and dreams are vivid — often carrying spiritual messages. Expenditure on mother\'s care, foreign travel, or spiritual pursuits. The left eye may have issues. Can indicate emotional loneliness or separation from mother. When well-placed, produces saints, mystics, and compassionate healers who serve without expectation of return.', hi: 'मन स्वप्न, आध्यात्मिक खोज और परलौकिक अनुभवों में विलीन। ध्यान, दान और विदेश में निवास के लिए उत्कृष्ट। भौतिक जीवन से भावनात्मक विच्छेद। नींद गहरी और स्वप्न स्पष्ट — प्रायः आध्यात्मिक सन्देश। माता की देखभाल या आध्यात्मिक कार्यों पर व्यय। सन्त और करुणामय उपचारक बनाता है।' } },
];

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 10,
  overview: {
    en: 'Chandra Mahadasha lasts 10 years — a deeply transformative period focused on emotions, the mind, mother, public life, and domestic affairs. The waxing or waning state of the natal Moon dramatically affects outcomes. A strong, waxing Moon in a benefic sign and house brings a decade of emotional fulfillment, material prosperity, and public recognition. A weak, waning Moon in debilitation or affliction can bring mental disturbance, relationship instability, and health issues related to fluids, blood, and the mind. During Moon dasha, dreams become more vivid, intuition sharpens, and the native\'s relationship with water, travel, and the feminine principle intensifies.',
    hi: 'चन्द्र महादशा 10 वर्ष चलती है — भावनाओं, मन, माता, सार्वजनिक जीवन और घरेलू मामलों पर केन्द्रित गहन परिवर्तनकारी अवधि। जन्म चन्द्र की शुक्ल या कृष्ण पक्ष स्थिति परिणामों को नाटकीय रूप से प्रभावित करती है। बलवान, शुक्ल पक्ष चन्द्र भावनात्मक तृप्ति, भौतिक समृद्धि और लोकप्रियता का दशक लाता है।',
  },
  strongMoon: {
    en: 'If Moon is waxing and well-placed (own sign, exalted, or in kendra/trikona): Purchase of property and vehicles, mother\'s blessings, marriage or birth of children, public recognition, success in hospitality/food/agriculture, mental peace, spiritual growth, foreign travel, and strong intuitive decisions that bring luck.',
    hi: 'यदि चन्द्र शुक्ल पक्ष का और सुस्थित (स्वराशि, उच्च, या केन्द्र/त्रिकोण में): सम्पत्ति और वाहन, माता का आशीर्वाद, विवाह या सन्तान, सार्वजनिक मान्यता, आतिथ्य/कृषि में सफलता, मानसिक शान्ति, आध्यात्मिक उन्नति।',
  },
  weakMoon: {
    en: 'If Moon is waning and afflicted (debilitated, in dusthana, or with malefics): Depression, anxiety, insomnia, blood disorders, chest and lung issues, troubled relationship with mother, domestic discord, financial instability from impulsive spending, water-related accidents, and emotional breakdowns. Rahu-Moon (Grahan Yoga) in dasha can bring severe mental health challenges.',
    hi: 'यदि चन्द्र कृष्ण पक्ष का और पीड़ित (नीच, दुस्थान या पापग्रहों के साथ): अवसाद, चिन्ता, अनिद्रा, रक्त विकार, वक्ष और फेफड़ों की समस्या, माता से कठिन सम्बन्ध, घरेलू कलह, आवेगी खर्च से आर्थिक अस्थिरता, भावनात्मक विघटन।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः', transliteration: 'Om Shraam Shreem Shraum Sah Chandraya Namah', count: '11,000 times in 40 days', en: 'The Chandra Beej Mantra — chant facing north-west on Mondays during Shukla Paksha, ideally at night under moonlight', hi: 'चन्द्र बीज मन्त्र — सोमवार को शुक्ल पक्ष में वायव्य दिशा में रात्रि में चन्द्रमा की रोशनी में जाप करें' },
  gemstone: { en: 'Pearl (Moti) — set in silver, worn on the little finger of the right hand on a Monday during Shukla Paksha evening. Minimum 4 carats. Must touch the skin. Alternatively, Moonstone can be used as a more accessible option.', hi: 'मोती — चाँदी में जड़ित, सोमवार को शुक्ल पक्ष की सायंकाल दाहिने हाथ की कनिष्ठिका में धारण करें। न्यूनतम 4 कैरेट। त्वचा को स्पर्श करना आवश्यक। वैकल्पिक रूप से चन्द्रकान्त मणि।' },
  charity: { en: 'Donate rice, white cloth, silver, milk, curd, white flowers (jasmine), or camphor on Mondays. Feed cows with rice and sugar. Donate to women\'s shelters or orphanages.', hi: 'सोमवार को चावल, श्वेत वस्त्र, चाँदी, दूध, दही, श्वेत पुष्प (चमेली) या कपूर दान करें। गायों को चावल और शक्कर खिलाएँ। महिला आश्रय या अनाथालय में दान।' },
  fasting: { en: 'Monday fasting — consume only milk, curd, rice, and white-colored foods. Some traditions recommend fasting for 16 consecutive Mondays (Solah Somvar Vrat) for marriage or mental peace.', hi: 'सोमवार का उपवास — केवल दूध, दही, चावल और श्वेत खाद्य पदार्थ। कुछ परम्पराओं में विवाह या मानसिक शान्ति हेतु 16 लगातार सोमवार (सोलह सोमवार व्रत) का विधान।' },
  worship: { en: 'Offer water mixed with milk and white flowers to Shiva Linga on Mondays. Recite Chandra Kavacham or Chandra Ashtottara Shatanamavali. Visit Chandra temples on Mondays. Keep a silver bowl of water on the bedside table to absorb negative lunar energy during sleep.', hi: 'सोमवार को शिवलिंग पर दूध मिश्रित जल और श्वेत पुष्प अर्पित करें। चन्द्र कवचम् या चन्द्र अष्टोत्तर शतनामावली का पाठ करें। सोमवार को चन्द्र मन्दिर जाएँ।' },
  yantra: { en: 'Chandra Yantra — a 3×3 magic square with a sum of 18 in each row/column. Install on a silver plate, worship on Mondays during Shukla Paksha. Place in the north-west corner of the home.', hi: 'चन्द्र यन्त्र — 3×3 जादुई वर्ग जिसमें प्रत्येक पंक्ति/स्तम्भ का योग 18 है। चाँदी के पत्र पर स्थापित करें, सोमवार को शुक्ल पक्ष में पूजन करें। घर के वायव्य कोने में रखें।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Chandra (Soma) was born from the mind of Brahma during the cosmic creation, or from the churning of the Ocean of Milk (Samudra Manthan) according to another tradition. He married the 27 daughters of Daksha — these are the 27 Nakshatras. However, he favored Rohini above all others, causing the remaining 26 wives to complain to their father. Daksha cursed Chandra to wane and die, but the curse was partially reversed by Shiva, resulting in the monthly waxing and waning cycle. This mythological story encodes the Moon\'s orbital relationship with the nakshatras — spending roughly one day in each of the 27 lunar mansions.',
    hi: 'चन्द्र (सोम) सृष्टि के समय ब्रह्मा के मन से उत्पन्न हुए, या एक अन्य परम्परा के अनुसार समुद्र मन्थन से। उन्होंने दक्ष की 27 पुत्रियों — 27 नक्षत्रों — से विवाह किया। किन्तु वे सबसे अधिक रोहिणी को प्रेम करते थे, जिससे शेष 26 पत्नियों ने पिता से शिकायत की। दक्ष ने चन्द्र को क्षीण होकर मरने का शाप दिया, किन्तु शिव ने शाप आंशिक रूप से उलट दिया — जिससे मासिक शुक्ल-कृष्ण पक्ष का चक्र बना।',
  },
  temples: {
    en: 'Major Chandra temples: Somnath Temple (Gujarat) — the first of the twelve Jyotirlingas, named after Soma (Moon), where Chandra worshipped Shiva to reverse Daksha\'s curse; Thingaloor Kailasanathar Temple (Tamil Nadu) — one of the Navagraha temples dedicated to Chandra; Chandranath Temple (Maharashtra/Jharkhand) — dedicated to Shiva as lord of the Moon. The Somnath temple has been destroyed and rebuilt multiple times, symbolizing the Moon\'s own cycle of death and rebirth.',
    hi: 'प्रमुख चन्द्र मन्दिर: सोमनाथ मन्दिर (गुजरात) — बारह ज्योतिर्लिंगों में प्रथम, सोम (चन्द्र) के नाम पर, जहाँ चन्द्र ने दक्ष के शाप को उलटने के लिए शिव की पूजा की; तिंगलूर कैलासनाथर मन्दिर (तमिलनाडु) — चन्द्र को समर्पित नवग्रह मन्दिरों में से एक; चन्द्रनाथ मन्दिर (महाराष्ट्र/झारखण्ड)।',
  },
  stotra: {
    en: 'The Chandra Kavacham from Markandeya Purana is the primary protective hymn for the Moon. The Chandra Ashtottara Shatanamavali (108 names of the Moon) is recited for mental peace. Additionally, Chapter 2 of the Navagraha Stotra (attributed to Vyasa) contains the Moon verse: "Dadhi Shankha Tusharabham Kshirodarnava Sambhavam, Namami Shashinam Somam Shambhor Mukuta Bhushanam" — "I bow to the Moon, white as curd, conch, and snow, born from the Ocean of Milk, the jewel on Shiva\'s crown."',
    hi: 'मार्कण्डेय पुराण से चन्द्र कवचम् चन्द्र के लिए प्राथमिक सुरक्षात्मक स्तुति है। चन्द्र अष्टोत्तर शतनामावली (चन्द्र के 108 नाम) मानसिक शान्ति हेतु पढ़ी जाती है। नवग्रह स्तोत्र का चन्द्र श्लोक: "दधि शंख तुषाराभं क्षीरोदार्णव सम्भवम्, नमामि शशिनं सोमं शम्भोर्मुकुट भूषणम्" — "दही, शंख और हिम के समान श्वेत, क्षीर सागर से उत्पन्न, शम्भु के मुकुट के आभूषण चन्द्र को नमन।"',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Father and mother — complementary luminaries. Sun gives soul, Moon gives mind. Together they form the foundation of the horoscope. Sun-Moon conjunction (Amavasya) weakens the Moon but concentrates purpose.', hi: 'पिता और माता — परस्पर पूरक ज्योतियाँ। सूर्य आत्मा देता है, चन्द्र मन। अमावस्या पर चन्द्र दुर्बल किन्तु उद्देश्य केन्द्रित।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Chandra-Mangala Yoga when conjunct — wealth through emotional courage and aggressive business instincts. Mars heats the cool Moon, producing passionate but sometimes volatile emotions. Good for real estate and hospitality ventures.', hi: 'युति में चन्द्र-मंगल योग — भावनात्मक साहस और आक्रामक व्यापारिक बुद्धि से धन। मंगल शीतल चन्द्र को गरम करता है। भूसम्पत्ति और आतिथ्य उद्यमों के लिए शुभ।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Mind and intellect aligned — emotional intelligence combined with analytical clarity. Excellent for writers, counselors, and communicators. Mercury helps the Moon articulate feelings that otherwise remain vague and overwhelming.', hi: 'मन और बुद्धि एकरूप — भावनात्मक बुद्धि और विश्लेषणात्मक स्पष्टता। लेखकों, परामर्शदाताओं और संवादकर्ताओं के लिए उत्कृष्ट। बुध चन्द्र को अस्पष्ट भावनाओं को स्पष्ट करने में सहायता करता है।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Gajakesari Yoga when in mutual kendras — one of the most celebrated yogas bringing wisdom, wealth, and reputation. Jupiter expands and protects the emotional mind. The guru nurtures the mother principle. Excellent for teaching, counseling, and spiritual guidance.', hi: 'परस्पर केन्द्रों में गजकेसरी योग — ज्ञान, धन और प्रतिष्ठा देने वाले सबसे प्रसिद्ध योगों में से एक। गुरु भावनात्मक मन का विस्तार और रक्षा करता है।' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Moon-Venus conjunction creates artistic sensitivity, love of beauty, and romantic nature. Both are feminine, watery energies. Can produce exceptional artists, musicians, and designers. In excess, creates emotional indulgence and attachment to luxury.', hi: 'चन्द्र-शुक्र युति कलात्मक संवेदनशीलता, सौन्दर्य प्रेम और रोमांटिक स्वभाव बनाती है। दोनों स्त्रैण, जलीय ऊर्जाएँ। असाधारण कलाकार और संगीतकार बना सकती है।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Vish Yoga (poison combination) when conjunct — Saturn constricts the emotional mind, producing depression, emotional isolation, and delayed motherly affection. However, this gives extraordinary emotional endurance and maturity. Sade Sati (Saturn\'s 7.5-year transit over Moon) is the most feared transit in Jyotish.', hi: 'युति में विष योग — शनि भावनात्मक मन को संकुचित करता है, अवसाद और भावनात्मक एकान्त देता है। तथापि असाधारण भावनात्मक सहनशीलता। साढ़ेसाती (चन्द्र पर शनि का गोचर) ज्योतिष में सबसे भयंकर गोचर।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Grahan Yoga — Rahu eclipses the Moon, creating illusion, anxiety, and obsessive thinking. Can produce irrational fears, phobias, and mental disturbance. In positive expression, gives extraordinary imagination and psychic ability. The most challenging conjunction for mental health in Jyotish.', hi: 'ग्रहण योग — राहु चन्द्र को ग्रसित करता है, भ्रम, चिन्ता और जुनूनी विचार उत्पन्न करता है। अतार्किक भय और मानसिक अशान्ति। सकारात्मक रूप में असाधारण कल्पनाशक्ति और पराभौतिक क्षमता।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Ketu detaches the mind from material concerns — spiritual liberation but worldly confusion. Moon-Ketu conjunction (Shrapit Yoga in some traditions) can indicate past-life emotional karma. The native may feel emotionally disconnected, having difficulty expressing or even identifying their feelings. Powerful for meditation and moksha.', hi: 'केतु मन को भौतिक चिन्ताओं से विरक्त करता है — आध्यात्मिक मुक्ति किन्तु सांसारिक भ्रम। चन्द्र-केतु युति पूर्वजन्म के भावनात्मक कर्म। भावनाओं को पहचानने में कठिनाई। ध्यान और मोक्ष के लिए शक्तिशाली।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/mangal', label: { en: 'Mangal — Mars', hi: 'मंगल' } },
  { href: '/learn/budha', label: { en: 'Budha — Mercury', hi: 'बुध' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/doshas', label: { en: 'Doshas in Kundali', hi: 'कुण्डली में दोष' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function ChandraPage() {
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-moon/15 border border-graha-moon/30 mb-4">
          <span className="text-4xl">☽</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Chandra — The Moon', hi: 'चन्द्र — चन्द्र देव' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Manokaraka — the significator of the mind, the queen of the night, the nourisher of all life and emotions in Vedic astrology.', hi: 'मनोकारक — मन का कारक, रात्रि की रानी, वैदिक ज्योतिष में सभी जीवन और भावनाओं का पोषक।' })}
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
        <p style={bf}>{ml({ en: 'Chandra is the queen of the Navagrahas, the mind (Manas) of the Kaal Purusha, and the mirror that reflects the soul\'s light into the world of experience. Unlike the Sun which represents the eternal, unchanging soul, the Moon represents the ever-changing mind — fluctuating emotions, thoughts, memories, and moods. She governs the mother, public life, fluids in the body, fertility, and the capacity to nurture. In Vedic astrology, the Moon sign (Rashi) is considered more important than the Sun sign because the mind is the instrument through which the soul operates in daily life.', hi: 'चन्द्र नवग्रहों की रानी, काल पुरुष का मन (मनस्), और वह दर्पण है जो आत्मा के प्रकाश को अनुभव की दुनिया में प्रतिबिम्बित करता है। सूर्य शाश्वत अपरिवर्तनशील आत्मा है, चन्द्र सतत परिवर्तनशील मन — भावनाएँ, विचार, स्मृतियाँ और मनोदशाएँ। वे माता, जनजीवन, शरीर के तरल, प्रजनन और पोषण क्षमता का शासन करती हैं।' })}</p>
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
        <p style={bf}>{ml({ en: 'A planet\'s dignity determines whether it can express its full potential or is constrained. Moon in Taurus at 3° is at the peak of its power — here the mind finds perfect emotional stability and material security. In Scorpio at 3°, the Moon is deeply disturbed — the mind is pulled into emotional intensity, fear, and psychological transformation. The waxing or waning phase (Paksha Bala) is equally important — a Full Moon in debilitation may be stronger than a New Moon in exaltation.', hi: 'ग्रह की गरिमा यह निर्धारित करती है कि वह अपनी पूर्ण क्षमता व्यक्त कर सकता है या बाधित है। वृषभ में 3° पर चन्द्र अपनी शक्ति के शिखर पर — मन को पूर्ण भावनात्मक स्थिरता मिलती है। वृश्चिक में 3° पर चन्द्र गहराई से विचलित — मन भावनात्मक तीव्रता और भय में खिंचता है।' })}</p>
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

      {/* ── 3. Moon in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Moon in the Twelve Signs', hi: 'बारह राशियों में चन्द्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The Moon sign is your Rashi — the most important sign in Vedic astrology. It determines your emotional nature, mental patterns, and how you process the world. While Western astrology emphasizes the Sun sign, Jyotish considers the Moon sign the primary lens through which life is experienced. Predictions (Phalita Jyotish) and transit analysis (Gochar) are read primarily from the Moon sign.', hi: 'चन्द्र राशि आपकी राशि है — वैदिक ज्योतिष में सबसे महत्त्वपूर्ण। यह आपकी भावनात्मक प्रकृति, मानसिक पैटर्न और संसार को कैसे संसाधित करते हैं निर्धारित करती है। फलित ज्योतिष और गोचर विश्लेषण मुख्यतः चन्द्र राशि से पढ़ा जाता है।' })}</p>
        {MOON_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity === 'Own sign' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 4. Moon in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Moon in the Twelve Houses', hi: 'बारह भावों में चन्द्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'The house placement determines the area of life where the Moon\'s nurturing energy concentrates. Moon is Digbali (directionally strong) in the 4th house — the house of home, mother, and emotional security. In Kendras (1, 4, 7, 10) it gives visible emotional influence. In Trikonas (1, 5, 9) it brings intuitive wisdom. In Upachayas (3, 6, 10, 11) it grows stronger over time.', hi: 'भाव स्थिति यह निर्धारित करती है कि चन्द्र की पोषक ऊर्जा जीवन के किस क्षेत्र में केन्द्रित होती है। चन्द्र चतुर्थ भाव में दिग्बली — घर, माता और भावनात्मक सुरक्षा का भाव। केन्द्रों में प्रत्यक्ष भावनात्मक प्रभाव। त्रिकोणों में अन्तर्ज्ञानी ज्ञान।' })}</p>
        {MOON_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-moon/15 border border-graha-moon/30 flex items-center justify-center text-graha-moon text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 5. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Chandra Mahadasha (10 Years)', hi: 'चन्द्र महादशा (10 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Moon Dasha', hi: 'बलवान चन्द्र दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongMoon)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Moon Dasha', hi: 'दुर्बल चन्द्र दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakMoon)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 6. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Chandra\'s relationships are unique among the Navagrahas — she has no natural enemies. The Moon considers everyone either a friend or neutral, reflecting her nurturing nature that embraces all. However, some planets (Rahu, Ketu) are considered enemies in practice due to their eclipsing effect on the mind. The Moon\'s friendships and neutralities govern how conjunctions and aspects affect emotional and mental wellbeing.', hi: 'नवग्रहों में चन्द्र के सम्बन्ध अद्वितीय हैं — उसका कोई स्वाभाविक शत्रु नहीं। चन्द्र सभी को मित्र या सम मानती है, जो उसके पोषक स्वभाव को दर्शाता है। तथापि राहु, केतु व्यवहार में शत्रु माने जाते हैं क्योंकि वे मन को ग्रसित करते हैं।' })}</p>
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
      <LessonSection number={next()} title={ml({ en: 'Remedies for Moon', hi: 'चन्द्र के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when the Moon is weak (waning, debilitated, or afflicted by malefics like Rahu or Saturn). A strong, waxing Moon rarely needs remedies. Moon remedies focus on calming the mind, strengthening emotional resilience, and improving the relationship with the mother. Consult a qualified Jyotishi before wearing gemstones.', hi: 'उपाय तब निर्धारित किये जाते हैं जब चन्द्र दुर्बल हो (कृष्ण पक्ष, नीच, या राहु-शनि जैसे पापग्रहों से पीड़ित)। बलवान शुक्ल पक्ष चन्द्र को प्रायः उपाय की आवश्यकता नहीं। चन्द्र उपाय मन को शान्त करने, भावनात्मक सहनशीलता बढ़ाने और माता सम्बन्ध सुधारने पर केन्द्रित।' })}</p>

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
          { key: 'gemstone', title: { en: 'Gemstone — Pearl (Moti)', hi: 'रत्न — मोती' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Stotra', hi: 'पूजा एवं स्तोत्र' } },
          { key: 'yantra', title: { en: 'Chandra Yantra', hi: 'चन्द्र यन्त्र' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Moon remedies work best when combined with emotional self-care: spending time near water, maintaining a regular sleep schedule, nurturing the relationship with mother, practicing meditation, and avoiding emotional triggers during Krishna Paksha (waning Moon).', hi: 'चन्द्र उपाय भावनात्मक आत्म-देखभाल के साथ सबसे अच्छे काम करते हैं: जल के निकट समय बिताना, नियमित नींद, माता सम्बन्ध का पोषण, ध्यान अभ्यास, कृष्ण पक्ष में भावनात्मक उत्तेजकों से बचना।' })}
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
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Chandra Stotra & Kavacham', hi: 'चन्द्र स्तोत्र एवं कवचम्' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="Markandeya Purana" chapter="Chandra Kavacham" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Moon is the Manokaraka — the mind significator. Its placement reveals your emotional nature, mental health, and relationship with mother.', hi: 'चन्द्र मनोकारक है — इसकी स्थिति आपकी भावनात्मक प्रकृति, मानसिक स्वास्थ्य और माता सम्बन्ध प्रकट करती है।' }),
        ml({ en: 'Exalted in Taurus (3°), debilitated in Scorpio (3°). Own sign Cancer. Moolatrikona Taurus 4°-20°.', hi: 'वृषभ 3° में उच्च, वृश्चिक 3° में नीच। स्वराशि कर्क। मूलत्रिकोण वृषभ 4°-20°।' }),
        ml({ en: 'Friends: Sun, Mercury. Enemies: None. Moon is the only planet with no natural enemies — reflecting her all-embracing nurturing nature.', hi: 'मित्र: सूर्य, बुध। शत्रु: कोई नहीं। चन्द्र एकमात्र ग्रह है जिसका कोई स्वाभाविक शत्रु नहीं।' }),
        ml({ en: 'Mahadasha: 10 years. Remedy: Pearl, rice/milk charity, Monday fasting, Chandra Kavacham, Shiva worship.', hi: 'महादशा: 10 वर्ष। उपाय: मोती, चावल/दूध दान, सोमवार व्रत, चन्द्र कवचम्, शिव पूजा।' }),
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
