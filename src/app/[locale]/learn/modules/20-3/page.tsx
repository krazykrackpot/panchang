'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-3.json';

const META: ModuleMeta = {
  id: 'mod_20_3', phase: 7, topic: 'KP System', moduleNumber: '20.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q20_3_01', type: 'mcq',
    question: {
      en: 'How many levels of significatorship does KP recognize for connecting a planet to a house?',
      hi: 'केपी एक ग्रह को भाव से जोड़ने के लिए कारकत्व के कितने स्तर मान्य करता है?',
    },
    options: [
      { en: '2 levels', hi: '2 स्तर', sa: '2 स्तराः', mai: '2 स्तर', mr: '2 स्तर', ta: '2 நிலைகள்', te: '2 స్థాయిలు', bn: '২টি স্তর', kn: '2 ಹಂತಗಳು', gu: '2 સ્તર' },
      { en: '3 levels', hi: '3 स्तर', sa: '3 स्तराः', mai: '3 स्तर', mr: '3 स्तर', ta: '3 நிலைகள்', te: '3 స్థాయిలు', bn: '৩টি স্তর', kn: '3 ಹಂತಗಳು', gu: '3 સ્તર' },
      { en: '4 levels', hi: '4 स्तर', sa: '4 स्तराः', mai: '4 स्तर', mr: '4 स्तर', ta: '4 நிலைகள்', te: '4 స్థాయిలు', bn: '৪টি স্তর', kn: '4 ಹಂತಗಳು', gu: '4 સ્તર' },
      { en: '5 levels', hi: '5 स्तर', sa: '5 स्तराः', mai: '5 स्तर', mr: '5 स्तर', ta: '5 நிலைகள்', te: '5 స్థాయిలు', bn: '৫টি স্তর', kn: '5 ಹಂತಗಳು', gu: '5 સ્તર' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'KP uses 4 levels: Level 1 (planet occupying the house), Level 2 (planet in the star of an occupant), Level 3 (planet owning the house sign), Level 4 (planet in the star of the owner). Level 1 is strongest.',
      hi: 'केपी 4 स्तरों का उपयोग करता है: स्तर 1 (भाव में निवासी ग्रह), स्तर 2 (निवासी के नक्षत्र में ग्रह), स्तर 3 (भाव राशि का स्वामी ग्रह), स्तर 4 (स्वामी के नक्षत्र में ग्रह)। स्तर 1 सबसे प्रबल है।',
    },
  },
  {
    id: 'q20_3_02', type: 'mcq',
    question: {
      en: 'Which level of significatorship is the STRONGEST in KP?',
      hi: 'केपी में कारकत्व का कौन-सा स्तर सबसे प्रबल है?',
    },
    options: [
      { en: 'Level 4 — planet in the star of the house owner', hi: 'स्तर 4 — भाव स्वामी के नक्षत्र में ग्रह', sa: 'स्तरः 4 — भावस्वामिनः नक्षत्रे ग्रहः', mai: 'स्तर 4 — भाव स्वामीक नक्षत्रमे ग्रह', mr: 'स्तर 4 — भाव स्वामीच्या नक्षत्रात ग्रह', ta: 'நிலை 4 — பாவ அதிபதியின் நட்சத்திரத்தில் கிரகம்', te: 'స్థాయి 4 — భావాధిపతి నక్షత్రంలో గ్రహం', bn: 'স্তর ৪ — ভাবাধিপতির নক্ষত্রে গ্রহ', kn: 'ಹಂತ 4 — ಭಾವಾಧಿಪತಿಯ ನಕ್ಷತ್ರದಲ್ಲಿ ಗ್ರಹ', gu: 'સ્તર 4 — ભાવ સ્વામીના નક્ષત્રમાં ગ્રહ' },
      { en: 'Level 3 — planet owning the house sign', hi: 'स्तर 3 — भाव राशि का स्वामी ग्रह', sa: 'स्तरः 3 — भावराशेः स्वामी ग्रहः', mai: 'स्तर 3 — भाव राशिक स्वामी ग्रह', mr: 'स्तर 3 — भाव राशीचा स्वामी ग्रह', ta: 'நிலை 3 — பாவ ராசியை ஆளும் கிரகம்', te: 'స్థాయి 3 — భావ రాశిని స్వంతం చేసుకున్న గ్రహం', bn: 'স্তর ৩ — ভাব রাশির মালিক গ্রহ', kn: 'ಹಂತ 3 — ಭಾವ ರಾಶಿಯ ಒಡೆಯ ಗ್ರಹ', gu: 'સ્તર 3 — ભાવ રાશિનો માલિક ગ્રહ' },
      { en: 'Level 2 — planet in the star of an occupant', hi: 'स्तर 2 — निवासी के नक्षत्र में ग्रह', sa: 'स्तरः 2 — निवासिनः नक्षत्रे ग्रहः', mai: 'स्तर 2 — निवासीक नक्षत्रमे ग्रह', mr: 'स्तर 2 — निवासीच्या नक्षत्रात ग्रह', ta: 'நிலை 2 — குடியிருப்பாளரின் நட்சத்திரத்தில் கிரகம்', te: 'స్థాయి 2 — నివాసి నక్షత్రంలో గ్రహం', bn: 'স্তর ২ — অধিবাসীর নক্ষত্রে গ্রহ', kn: 'ಹಂತ 2 — ನಿವಾಸಿಯ ನಕ್ಷತ್ರದಲ್ಲಿ ಗ್ರಹ', gu: 'સ્તર 2 — નિવાસીના નક્ષત્રમાં ગ્રહ' },
      { en: 'Level 1 — planet occupying the house', hi: 'स्तर 1 — भाव में निवासी ग्रह', sa: 'स्तरः 1 — भावे निवसन् ग्रहः', mai: 'स्तर 1 — भावमे निवासी ग्रह', mr: 'स्तर 1 — भावातील निवासी ग्रह', ta: 'நிலை 1 — பாவத்தில் அமர்ந்த கிரகம்', te: 'స్థాయి 1 — భావంలో ఉన్న గ్రహం', bn: 'স্তর ১ — ভাবে অবস্থিত গ্রহ', kn: 'ಹಂತ 1 — ಭಾವದಲ್ಲಿ ಇರುವ ಗ್ರಹ', gu: 'સ્તર 1 — ભાવમાં બેઠેલો ગ્રહ' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'Level 1 (occupancy) is the strongest because a planet physically present in a house directly activates that house\'s significations. The strength decreases from Level 1 to Level 4.',
      hi: 'स्तर 1 (निवास) सबसे प्रबल है क्योंकि भाव में भौतिक रूप से उपस्थित ग्रह सीधे उस भाव के कारकत्व सक्रिय करता है। प्रबलता स्तर 1 से स्तर 4 तक घटती जाती है।',
    },
  },
  {
    id: 'q20_3_03', type: 'true_false',
    question: {
      en: 'In KP, a planet in the star (nakshatra) of a house occupant signifies that house more strongly than the house owner itself.',
      hi: 'केपी में, भाव निवासी के नक्षत्र में स्थित ग्रह उस भाव का कारक भाव स्वामी से अधिक प्रबल रूप से होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Level 2 (star of occupant) is stronger than Level 3 (ownership). In KP, the star connection to an occupant planet carries more weight than mere sign ownership, because occupancy represents direct activation.',
      hi: 'सत्य। स्तर 2 (निवासी का नक्षत्र) स्तर 3 (स्वामित्व) से प्रबल है। केपी में निवासी ग्रह से नक्षत्र सम्बन्ध केवल राशि स्वामित्व से अधिक महत्त्वपूर्ण है, क्योंकि निवास प्रत्यक्ष सक्रियता का प्रतिनिधित्व करता है।',
    },
  },
  {
    id: 'q20_3_04', type: 'mcq',
    question: {
      en: 'For judging marriage in KP, which house combination is examined?',
      hi: 'केपी में विवाह का आकलन करने के लिए कौन-सा भाव संयोजन जाँचा जाता है?',
    },
    options: [
      { en: 'Houses 1, 5, 9', hi: 'भाव 1, 5, 9', sa: 'भावाः 1, 5, 9', mai: 'भाव 1, 5, 9', mr: 'भाव 1, 5, 9', ta: 'பாவங்கள் 1, 5, 9', te: 'భావాలు 1, 5, 9', bn: 'ভাব ১, ৫, ৯', kn: 'ಭಾವಗಳು 1, 5, 9', gu: 'ભાવ 1, 5, 9' },
      { en: 'Houses 2, 7, 11', hi: 'भाव 2, 7, 11', sa: 'भावाः 2, 7, 11', mai: 'भाव 2, 7, 11', mr: 'भाव 2, 7, 11', ta: 'பாவங்கள் 2, 7, 11', te: 'భావాలు 2, 7, 11', bn: 'ভাব ২, ৭, ১১', kn: 'ಭಾವಗಳು 2, 7, 11', gu: 'ભાવ 2, 7, 11' },
      { en: 'Houses 4, 7, 10', hi: 'भाव 4, 7, 10', sa: 'भावाः 4, 7, 10', mai: 'भाव 4, 7, 10', mr: 'भाव 4, 7, 10', ta: 'பாவங்கள் 4, 7, 10', te: 'భావాలు 4, 7, 10', bn: 'ভাব ৪, ৭, ১০', kn: 'ಭಾವಗಳು 4, 7, 10', gu: 'ભાવ 4, 7, 10' },
      { en: 'Houses 3, 6, 12', hi: 'भाव 3, 6, 12', sa: 'भावाः 3, 6, 12', mai: 'भाव 3, 6, 12', mr: 'भाव 3, 6, 12', ta: 'பாவங்கள் 3, 6, 12', te: 'భావాలు 3, 6, 12', bn: 'ভাব ৩, ৬, ১২', kn: 'ಭಾವಗಳು 3, 6, 12', gu: 'ભાવ 3, 6, 12' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Marriage in KP is judged through houses 2 (family addition), 7 (spouse/partnership), and 11 (fulfillment of desire). Planets signifying all three houses at strong levels indicate marriage during their dasha/bhukti periods.',
      hi: 'केपी में विवाह का आकलन भाव 2 (परिवार वृद्धि), 7 (जीवनसाथी/साझेदारी), और 11 (इच्छा पूर्ति) से होता है। प्रबल स्तरों पर तीनों भावों का कारक ग्रह अपनी दशा/भुक्ति में विवाह का संकेत देता है।',
    },
  },
  {
    id: 'q20_3_05', type: 'mcq',
    question: {
      en: 'If Jupiter occupies the 7th house, which planets become Level 2 significators of the 7th house?',
      hi: 'यदि गुरु सप्तम भाव में स्थित है, तो कौन-से ग्रह सप्तम भाव के स्तर 2 कारक बनते हैं?',
    },
    options: [
      { en: 'Planets in the sign of Jupiter', hi: 'गुरु की राशि में स्थित ग्रह', sa: 'गुरोः राशौ स्थिताः ग्रहाः', mai: 'गुरुक राशिमे स्थित ग्रह', mr: 'गुरूच्या राशीतील ग्रह', ta: 'குருவின் ராசியில் உள்ள கிரகங்கள்', te: 'గురు రాశిలో ఉన్న గ్రహాలు', bn: 'বৃহস্পতির রাশিতে গ্রহ', kn: 'ಗುರುವಿನ ರಾಶಿಯಲ್ಲಿ ಗ್ರಹಗಳು', gu: 'ગુરુની રાશિમાં ગ્રહો' },
      { en: 'Planets in the nakshatra of Jupiter', hi: 'गुरु के नक्षत्र में स्थित ग्रह', sa: 'गुरोः नक्षत्रे स्थिताः ग्रहाः', mai: 'गुरुक नक्षत्रमे स्थित ग्रह', mr: 'गुरूच्या नक्षत्रातील ग्रह', ta: 'குருவின் நட்சத்திரத்தில் உள்ள கிரகங்கள்', te: 'గురు నక్షత్రంలో ఉన్న గ్రహాలు', bn: 'বৃহস্পতির নক্ষত্রে গ্রহ', kn: 'ಗುರುವಿನ ನಕ್ಷತ್ರದಲ್ಲಿ ಗ್ರಹಗಳು', gu: 'ગુરુના નક્ષત્રમાં ગ્રહો' },
      { en: 'Planets aspecting Jupiter', hi: 'गुरु पर दृष्टि डालने वाले ग्रह', sa: 'गुरुं पश्यन्तः ग्रहाः', mai: 'गुरु पर दृष्टि दयवला ग्रह', mr: 'गुरूकडे पाहणारे ग्रह', ta: 'குருவைப் பார்க்கும் கிரகங்கள்', te: 'గురుని చూస్తున్న గ్రహాలు', bn: 'বৃহস্পতিকে দৃষ্টিকারী গ্রহ', kn: 'ಗುರುವನ್ನು ನೋಡುವ ಗ್ರಹಗಳು', gu: 'ગુરુને જોનારા ગ્રહો' },
      { en: 'Planets conjunct Jupiter', hi: 'गुरु के साथ युति वाले ग्रह', sa: 'गुरुणा सह युक्ताः ग्रहाः', mai: 'गुरुक संग युति वला ग्रह', mr: 'गुरूसोबत युती असलेले ग्रह', ta: 'குருவுடன் சேர்ந்த கிரகங்கள்', te: 'గురుతో కలిసిన గ్రహాలు', bn: 'বৃহস্পতির সাথে যুত গ্রহ', kn: 'ಗುರುವಿನೊಂದಿಗೆ ಸೇರಿದ ಗ್ರಹಗಳು', gu: 'ગુરુ સાથે યુતિ ગ્રહો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Level 2 significators are planets placed in the nakshatra (star) of a house occupant. Since Jupiter occupies the 7th, any planet in Punarvasu, Vishakha, or Purva Bhadrapada (Jupiter\'s nakshatras) becomes a Level 2 significator of the 7th house.',
      hi: 'स्तर 2 कारक वे ग्रह हैं जो भाव निवासी के नक्षत्र (तारा) में स्थित हैं। चूँकि गुरु सप्तम में है, पुनर्वसु, विशाखा या पूर्वा भाद्रपद (गुरु के नक्षत्र) में स्थित कोई भी ग्रह सप्तम भाव का स्तर 2 कारक बनता है।',
    },
  },
  {
    id: 'q20_3_06', type: 'true_false',
    question: {
      en: 'A planet can signify multiple houses simultaneously through different levels.',
      hi: 'एक ग्रह विभिन्न स्तरों के माध्यम से एक साथ अनेक भावों का कारक हो सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. A planet might occupy the 5th house (Level 1 significator of 5th), be in the star of a 7th house occupant (Level 2 significator of 7th), and own the 3rd house sign (Level 3 significator of 3rd) — all simultaneously.',
      hi: 'सत्य। एक ग्रह पंचम भाव में बैठा हो (पंचम का स्तर 1 कारक), सप्तम भाव निवासी के नक्षत्र में हो (सप्तम का स्तर 2 कारक), और तृतीय भाव राशि का स्वामी हो (तृतीय का स्तर 3 कारक) — सब एक साथ।',
    },
  },
  {
    id: 'q20_3_07', type: 'mcq',
    question: {
      en: 'In the significator table, what resolves a conflict when a planet signifies both supportive and adverse houses?',
      hi: 'कारक सारणी में, जब कोई ग्रह सहायक और प्रतिकूल दोनों भावों का कारक हो तो विरोधाभास का समाधान क्या करता है?',
    },
    options: [
      { en: 'The planet\'s natural benefic/malefic status', hi: 'ग्रह की प्राकृतिक शुभ/अशुभ स्थिति' },
      { en: 'The planet\'s sub-lord connection', hi: 'ग्रह का उप-स्वामी सम्बन्ध' },
      { en: 'The planet\'s retrograde status', hi: 'ग्रह की वक्री स्थिति' },
      { en: 'The planet\'s combustion status', hi: 'ग्रह की अस्त स्थिति' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When a planet signifies both favorable and unfavorable houses for an event, KP uses the planet\'s sub-lord to break the tie. If the sub-lord favors the positive houses, the event happens with some challenges.',
      hi: 'जब कोई ग्रह किसी घटना के लिए अनुकूल और प्रतिकूल दोनों भावों का कारक हो, तो केपी ग्रह के उप-स्वामी का उपयोग करके विरोधाभास सुलझाता है। यदि उप-स्वामी सकारात्मक भावों का पक्ष लेता है, तो घटना कुछ चुनौतियों सहित घटित होती है।',
    },
  },
  {
    id: 'q20_3_08', type: 'mcq',
    question: {
      en: 'Which event is predicted when a planet strongly signifies houses 6, 8, and 12?',
      hi: 'जब कोई ग्रह भाव 6, 8 और 12 का प्रबल कारक हो तो कौन-सी घटना की भविष्यवाणी होती है?',
    },
    options: [
      { en: 'Marriage', hi: 'विवाह', sa: 'विवाह', mai: 'विवाह', mr: 'विवाह', ta: 'திருமணம்', te: 'వివాహం', bn: 'বিবাহ', kn: 'ವಿವಾಹ', gu: 'લગ્ન' },
      { en: 'Promotion at work', hi: 'कार्य में पदोन्नति', sa: 'कार्य में पदोन्नति', mai: 'कार्य में पदोन्नति', mr: 'कार्य में पदोन्नति', ta: 'பணியில் பதவி உயர்வு', te: 'ఉద్యోగంలో పదోన్నతి', bn: 'কর্মে পদোন্নতি', kn: 'ಕೆಲಸದಲ್ಲಿ ಬಡ್ತಿ', gu: 'કામમાં બઢતી' },
      { en: 'Denial or obstruction of the queried event', hi: 'पूछी गई घटना का निषेध या अवरोध', sa: 'पूछी गई घटना का निषेध या अवरोध', mai: 'पूछी गई घटना का निषेध या अवरोध', mr: 'पूछी गई घटना का निषेध या अवरोध', ta: 'கேட்கப்பட்ட நிகழ்வின் மறுப்பு அல்லது தடை', te: 'అడిగిన సంఘటన యొక్క తిరస్కారం లేదా అడ్డంకి', bn: 'জিজ্ঞাসিত ঘটনার প্রত্যাখ্যান বা বাধা', kn: 'ಕೇಳಲಾದ ಘಟನೆಯ ನಿರಾಕರಣೆ ಅಥವಾ ಅಡ್ಡಿ', gu: 'પૂછેલી ઘટનાનો ઇનકાર અથવા અવરોધ' },
      { en: 'Foreign travel for education', hi: 'शिक्षा हेतु विदेश यात्रा', sa: 'शिक्षा हेतु विदेश यात्रा', mai: 'शिक्षा हेतु विदेश यात्रा', mr: 'शिक्षा हेतु विदेश यात्रा', ta: 'கல்விக்காக வெளிநாட்டு பயணம்', te: 'విద్య కోసం విదేశ యాత్ర', bn: 'শিক্ষার জন্য বিদেশ যাত্রা', kn: 'ಶಿಕ್ಷಣಕ್ಕಾಗಿ ವಿದೇಶ ಪ್ರಯಾಣ', gu: 'શિક્ષા માટે વિદેશ યાત્રા' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Houses 6, 8, 12 are generally considered adverse (enemies, obstacles, losses). If a planet strongly signifies these houses, it tends to deny or block the event being queried, or bring difficulties.',
      hi: 'भाव 6, 8, 12 सामान्यतः प्रतिकूल माने जाते हैं (शत्रु, बाधाएँ, हानि)। यदि कोई ग्रह इन भावों का प्रबल कारक है, तो यह पूछी जा रही घटना को रोकता या अवरुद्ध करता है, या कठिनाइयाँ लाता है।',
    },
  },
  {
    id: 'q20_3_09', type: 'true_false',
    question: {
      en: 'In KP, house ownership (Level 3) is considered more important than star-lord connection to an occupant (Level 2).',
      hi: 'केपी में भाव स्वामित्व (स्तर 3) को निवासी से नक्षत्र-स्वामी सम्बन्ध (स्तर 2) से अधिक महत्त्वपूर्ण माना जाता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. KP reverses the traditional priority: Level 2 (star of occupant) outranks Level 3 (ownership). This is because occupancy represents direct house activation, and being in the star of an occupant channels that energy.',
      hi: 'असत्य। केपी पारम्परिक प्राथमिकता को उलट देता है: स्तर 2 (निवासी का नक्षत्र) स्तर 3 (स्वामित्व) से ऊपर है। ऐसा इसलिए क्योंकि निवास प्रत्यक्ष भाव सक्रियता का प्रतिनिधित्व करता है, और निवासी के नक्षत्र में होना उस ऊर्जा को प्रवाहित करता है।',
    },
  },
  {
    id: 'q20_3_10', type: 'mcq',
    question: {
      en: 'When does an event predicted by the significator table actually occur?',
      hi: 'कारक सारणी द्वारा भविष्यवाणित घटना वास्तव में कब घटित होती है?',
    },
    options: [
      { en: 'During transit of the slowest planet', hi: 'सबसे धीमे ग्रह के गोचर के दौरान', sa: 'सबसे धीमे ग्रह के गोचर के दौरान', mai: 'सबसे धीमे ग्रह के गोचर के दौरान', mr: 'सबसे धीमे ग्रह के गोचर के दौरान', ta: 'மெதுவான கிரகத்தின் கோசார காலத்தில்', te: 'నెమ్మదిగా ఉన్న గ్రహం గోచరంలో', bn: 'সবচেয়ে ধীর গ্রহের গোচরে', kn: 'ನಿಧಾನ ಗ್ರಹದ ಗೋಚರದಲ್ಲಿ', gu: 'સૌથી ધીમા ગ્રહના ગોચરમાં' },
      { en: 'During the dasha/bhukti of the strongest significator', hi: 'सबसे प्रबल कारक की दशा/भुक्ति के दौरान', sa: 'सबसे प्रबल कारक की दशा/भुक्ति के दौरान', mai: 'सबसे प्रबल कारक की दशा/भुक्ति के दौरान', mr: 'सबसे प्रबल कारक की दशा/भुक्ति के दौरान', ta: 'வலிமையான காரகரின் தசா/புக்தியில்', te: 'బలమైన కారక దశా/భుక్తిలో', bn: 'শক্তিশালী কারকের দশা/ভুক্তিতে', kn: 'ಬಲಿಷ್ಠ ಕಾರಕನ ದಶಾ/ಭುಕ್ತಿಯಲ್ಲಿ', gu: 'સૌથી બળવાન કારકની દશા/ભુક્તિમાં' },
      { en: 'On the native\'s birthday each year', hi: 'प्रत्येक वर्ष जातक के जन्मदिन पर' },
      { en: 'When Jupiter transits the relevant house', hi: 'जब गुरु सम्बन्धित भाव में गोचर करता है', sa: 'जब गुरु सम्बन्धित भाव में गोचर करता है', mai: 'जब गुरु सम्बन्धित भाव में गोचर करता है', mr: 'जब गुरु सम्बन्धित भाव में गोचर करता है', ta: 'குரு சம்பந்தப்பட்ட பாவத்தில் கோசரிக்கும்போது', te: 'గురువు సంబంధిత భావంలో గోచరించినప్పుడు', bn: 'বৃহস্পতি সংশ্লিষ্ট ভাবে গোচর করলে', kn: 'ಗುರು ಸಂಬಂಧಿತ ಭಾವದಲ್ಲಿ ಗೋಚರಿಸಿದಾಗ', gu: 'ગુરુ સંબંધિત ભાવમાં ગોચર કરે ત્યારે' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In KP, events manifest during the Vimshottari dasha/bhukti/antara period of the planet that most strongly signifies the relevant houses. The ruling planets method (Module 20-4) further refines the timing.',
      hi: 'केपी में घटनाएँ उस ग्रह की विंशोत्तरी दशा/भुक्ति/अन्तरा अवधि में प्रकट होती हैं जो सम्बन्धित भावों का सबसे प्रबल कारक है। शासक ग्रह विधि (मॉड्यूल 20-4) समय को और परिशोधित करती है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 4-Level Significator System', hi: '4-स्तरीय कारक पद्धति', sa: '4-स्तरीय कारक पद्धति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In KP astrology, every planet is connected to certain houses through a precise 4-level hierarchy. Understanding these levels is essential because they determine WHICH planets will deliver results for WHICH life areas, and in what order of strength. Unlike traditional astrology where house lordship dominates, KP gives the highest priority to occupancy and star-lord connections.', hi: 'केपी ज्योतिष में प्रत्येक ग्रह एक सटीक 4-स्तरीय पदानुक्रम के माध्यम से कुछ भावों से जुड़ा होता है। इन स्तरों को समझना आवश्यक है क्योंकि ये निर्धारित करते हैं कि कौन-से ग्रह किन जीवन क्षेत्रों के लिए परिणाम देंगे, और प्रबलता के किस क्रम में। पारम्परिक ज्योतिष जहाँ भाव स्वामित्व प्रधान है, वहीं केपी निवास और नक्षत्र-स्वामी सम्बन्धों को सर्वोच्च प्राथमिकता देता है।', sa: 'केपी ज्योतिष में प्रत्येक ग्रह एक सटीक 4-स्तरीय पदानुक्रम के माध्यम से कुछ भावों से जुड़ा होता है। इन स्तरों को समझना आवश्यक है क्योंकि ये निर्धारित करते हैं कि कौन-से ग्रह किन जीवन क्षेत्रों के लिए परिणाम देंगे, और प्रबलता के किस क्रम में। पारम्परिक ज्योतिष जहाँ भाव स्वामित्व प्रधान है, वहीं केपी निवास और नक्षत्र-स्वामी सम्बन्धों को सर्वोच्च प्राथमिकता देता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>स्तर 1 (सबसे प्रबल): भाव में भौतिक रूप से निवासी ग्रह। यदि मंगल सप्तम भाव में बैठा है, तो मंगल सप्तम का स्तर 1 कारक है। स्तर 2: स्तर 1 निवासी के नक्षत्र (तारा) में स्थित ग्रह। यदि मंगल सप्तम में है और शनि मृगशिरा (मंगल-शासित नक्षत्र) में है, तो शनि सप्तम का स्तर 2 कारक बनता है। स्तर 3: भाव सन्धि पर स्थित राशि का स्वामी ग्रह। यदि सप्तम सन्धि पर तुला है, तो शुक्र (तुला स्वामी) स्तर 3 कारक है। स्तर 4 (सबसे दुर्बल): स्तर 3 स्वामी के नक्षत्र में स्थित ग्रह।</>
            : <>Level 1 (Strongest): Planets physically OCCUPYING a house. If Mars sits in the 7th house, Mars is a Level 1 significator of the 7th house. Level 2: Planets placed in the NAKSHATRA (star) of a Level 1 occupant. If Mars occupies the 7th and Saturn is in Mrigashira (a Mars-ruled nakshatra), Saturn becomes a Level 2 significator of the 7th. Level 3: Planets OWNING the sign on the house cusp. If Libra is on the 7th cusp, Venus (Libra&apos;s lord) is a Level 3 significator. Level 4 (Weakest): Planets in the nakshatra of a Level 3 owner.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>&quot;ग्रह जिस नक्षत्र में बैठता है उसके स्वामी का फल देता है&quot; यह अवधारणा वैदिक ज्योतिष के नाड़ी ग्रन्थों तक जाती है। कृष्णमूर्ति ने इस सिद्धान्त को विस्तारित करके एक औपचारिक 4-स्तरीय पदानुक्रम में व्यवस्थित किया: ग्रह न केवल अपने नक्षत्र स्वामी का फल देता है, बल्कि उसके नक्षत्रों में स्थित ग्रह उसके भाव कारकत्व को प्रवाहित करते हैं। यह द्विदिशात्मक नक्षत्र-स्वामी सिद्धान्त केपी का सबसे शक्तिशाली विश्लेषणात्मक उपकरण है, पारम्परिक स्वामित्व-आधारित विश्लेषण से कहीं अधिक विभेदक।</>
            : <>The concept that &quot;a planet gives the results of the lord of the nakshatra it occupies&quot; traces back to Vedic astrology&apos;s nadi grantha texts. Krishnamurti systematized this into a formal 4-level hierarchy by extending the principle: not only does a planet give results of its star lord, but planets in ITS stars channel its house significations. This bidirectional star-lord principle is KP&apos;s most powerful analytical tool, far more discriminating than traditional ownership-based analysis.</>}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Building the Significator Table', hi: 'कारक सारणी निर्माण', sa: 'कारक सारणी निर्माण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कारक सारणी बनाने के लिए, प्रत्येक भाव (1 से 12) का विश्लेषण करें और 4 स्तरों में से प्रत्येक पर जुड़े सभी ग्रहों को सूचीबद्ध करें। स्तर 1 से आरम्भ करें: कौन-से ग्रह भाव में बैठे हैं? फिर स्तर 2: कौन-से ग्रह उन निवासियों के नक्षत्रों में हैं? फिर स्तर 3: सन्धि पर स्थित राशि का स्वामी कौन-सा ग्रह है? अन्त में स्तर 4: उस स्वामी के नक्षत्र में कौन-से ग्रह हैं? परिणाम प्रत्येक ग्रह के भाव कारकत्व का व्यापक मानचित्र है।</>
            : <>To build the significator table, you analyze each house (1 through 12) and list all planets connected to it at each of the 4 levels. Start with Level 1: which planets occupy the house? Then Level 2: which planets are in the nakshatras of those occupants? Then Level 3: which planet owns the sign on the cusp? Finally Level 4: which planets are in the nakshatra of that owner? The result is a comprehensive map of every planet&apos;s house significations.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For predicting a specific event, identify the relevant house group. Marriage = houses 2, 7, 11. Career = houses 2, 6, 10, 11. Foreign travel = houses 3, 9, 12. Then find all planets that signify the relevant houses at strong levels (ideally Levels 1-2). The planet with the strongest combined signification of the event&apos;s houses will deliver the event during its dasha/bhukti/antara period.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">विवाह विश्लेषण:</span> भाव 2, 7, 11 विवाह समूह हैं। सप्तम भाव में गुरु (स्तर 1)। गुरु के नक्षत्रों (पुनर्वसु, विशाखा, पूर्वा भाद्रपद) में: शुक्र, बुध (सप्तम के स्तर 2 कारक)। सप्तम सन्धि पर तुला — स्वामी शुक्र (स्तर 3)। शुक्र के नक्षत्रों (भरणी, पूर्वा फाल्गुनी, पूर्वाषाढ़ा) में: सूर्य, मंगल (स्तर 4)। इसी प्रकार द्वितीय और एकादश भाव के लिए बनाएँ। शुक्र स्तर 2 (सप्तम) + स्तर 3 (सप्तम) + सम्भवतः द्वितीय/एकादश का स्तर 1 या 2 = शुक्र सबसे प्रबल विवाह कारक है। विवाह शुक्र दशा या भुक्ति में सर्वाधिक सम्भावित।</>
            : <><span className="text-gold-light font-medium">Marriage analysis:</span> Houses 2, 7, 11 are the marriage group. 7th house contains Jupiter (Level 1). Planets in Jupiter&apos;s stars (Punarvasu, Vishakha, Purva Bhadrapada): Venus, Mercury (Level 2 significators of 7th). 7th cusp has Libra — owner Venus (Level 3). Planets in Venus&apos;s stars (Bharani, Purva Phalguni, Purva Ashadha): Sun, Mars (Level 4). Similarly build for 2nd and 11th houses. Venus appears as Level 2 (7th) + Level 3 (7th) + perhaps Level 1 or 2 for 2nd/11th = Venus is the strongest marriage significator. Marriage most likely in Venus dasha or bhukti.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Resolving Conflicts', hi: 'विरोधाभास समाधान', sa: 'विरोधाभास समाधान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यवहार में, अनेक ग्रह किसी दी गई घटना के लिए अनुकूल और प्रतिकूल दोनों भावों का कारक होते हैं। शुक्र स्तर 2 पर सप्तम भाव (विवाह) का कारक हो सकता है किन्तु स्तर 1 पर द्वादश भाव (वियोग, हानि) का भी। क्या इसका अर्थ तलाक सहित विवाह है? आवश्यक नहीं। केपी ऐसे विरोधाभासों का समाधान उप स्वामी सम्बन्ध द्वारा करता है। शुक्र के उप स्वामी की जाँच करें: यदि शुक्र का उप-स्वामी भाव 2, 7, 11 का 6, 8, 12 से अधिक प्रबल कारक है, तो शुक्र विवाह देगा — सम्भवतः कुछ चुनौतियों सहित (द्वादश भाव का स्पर्श), किन्तु अन्ततः सकारात्मक।</>
            : <>In practice, many planets signify BOTH favorable and unfavorable houses for a given event. Venus might signify the 7th house (marriage) at Level 2 but also the 12th house (separation, loss) at Level 1. Does this mean marriage with divorce? Not necessarily. KP resolves such conflicts through the Sub Lord connection. Examine Venus&apos;s Sub Lord: if Venus&apos;s sub-lord signifies 2, 7, 11 more strongly than 6, 8, 12, then Venus will deliver marriage — perhaps with some challenges (the 12th house touch), but ultimately positive.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          If the sub-lord tilts toward 6, 8, 12, then Venus&apos;s period may bring relationship difficulties or denial of marriage. This sub-lord tiebreaker is what makes KP&apos;s predictions so specific — it does not just say &quot;Venus is related to marriage&quot; but specifies whether Venus will actually DELIVER marriage or create obstacles.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;केपी में भी पाराशरी की तरह केवल भाव स्वामित्व ही मायने रखता है।&quot; पाराशरी से केपी में जाने पर यह सबसे सामान्य त्रुटि है। केपी में स्वामित्व (स्तर 3) वास्तव में निवासी से नक्षत्र-स्वामी सम्बन्ध (स्तर 2) से दुर्बल है। सप्तम भाव निवासी के नक्षत्र में ग्रह स्वयं सप्तम भाव स्वामी से प्रबल विवाह सूचक है। प्राथमिकताओं का यह उलटाव केपी का मूलभूत सिद्धान्त है और इसकी उपेक्षा गलत फलादेश देती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;In KP, only house ownership matters, just like in Parashari.&quot; This is the most common error when transitioning from Parashari to KP. In KP, ownership (Level 3) is actually WEAKER than star-lord connection to an occupant (Level 2). A planet in the star of a 7th house occupant is a stronger marriage indicator than the 7th house owner itself. This reversal of priorities is fundamental to KP and ignoring it leads to incorrect predictions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Building the significator table manually for all 12 houses is tedious work that used to take KP practitioners 30-60 minutes per chart. Our KP System tool automates this entirely — it computes all 4 levels of significatorship for every planet across all 12 houses and presents a clean, sortable significator table. This allows the astrologer to immediately see which planets are the strongest significators for any event, dramatically speeding up the analysis process while eliminating human calculation errors.', hi: 'सभी 12 भावों के लिए कारक सारणी मैनुअली बनाना थकाऊ कार्य है जिसमें केपी अभ्यासकर्ताओं को प्रति कुण्डली 30-60 मिनट लगते थे। हमारा केपी सिस्टम उपकरण इसे पूर्णतः स्वचालित करता है — यह सभी 12 भावों में प्रत्येक ग्रह के लिए कारकत्व के सभी 4 स्तर गणित करता है और एक स्वच्छ, क्रमबद्ध कारक सारणी प्रस्तुत करता है। इससे ज्योतिषी तत्काल देख सकता है कि किसी भी घटना के लिए कौन-से ग्रह सबसे प्रबल कारक हैं, जो मानवीय गणना त्रुटियों को समाप्त करते हुए विश्लेषण प्रक्रिया को नाटकीय रूप से तेज़ करता है।', sa: 'सभी 12 भावों के लिए कारक सारणी मैनुअली बनाना थकाऊ कार्य है जिसमें केपी अभ्यासकर्ताओं को प्रति कुण्डली 30-60 मिनट लगते थे। हमारा केपी सिस्टम उपकरण इसे पूर्णतः स्वचालित करता है — यह सभी 12 भावों में प्रत्येक ग्रह के लिए कारकत्व के सभी 4 स्तर गणित करता है और एक स्वच्छ, क्रमबद्ध कारक सारणी प्रस्तुत करता है। इससे ज्योतिषी तत्काल देख सकता है कि किसी भी घटना के लिए कौन-से ग्रह सबसे प्रबल कारक हैं, जो मानवीय गणना त्रुटियों को समाप्त करते हुए विश्लेषण प्रक्रिया को नाटकीय रूप से तेज़ करता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module20_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
