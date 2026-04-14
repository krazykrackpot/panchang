import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Minus, TrendingDown } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-negative-numbers.json';


/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BRAHMAGUPTA_RULES = [
  { rule: { en: '(+) × (−) = (−)  [fortune × debt = debt]', hi: '(+) × (−) = (−)  [धन × ऋण = ऋण]', sa: '(+) × (−) = (−)  [धनम् × ऋणम् = ऋणम्]', mai: '(+) × (−) = (−)  [धन × ऋण = ऋण]', mr: '(+) × (−) = (−)  [धन × ऋण = ऋण]', ta: '(+) × (−) = (−)  [செல்வம் × கடன் = கடன்]', te: '(+) × (−) = (−)  [ధనం × ఋణం = ఋణం]', bn: '(+) × (−) = (−)  [ধন × ঋণ = ঋণ]', kn: '(+) × (−) = (−)  [ಧನ × ಋಣ = ಋಣ]', gu: '(+) × (−) = (−)  [ધન × ઋણ = ઋણ]' }, sign: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { rule: { en: '(−) × (−) = (+)  [debt × debt = fortune]', hi: '(−) × (−) = (+)  [ऋण × ऋण = धन]', sa: '(−) × (−) = (+)  [ऋणम् × ऋणम् = धनम्]', mai: '(−) × (−) = (+)  [ऋण × ऋण = धन]', mr: '(−) × (−) = (+)  [ऋण × ऋण = धन]', ta: '(−) × (−) = (+)  [கடன் × கடன் = செல்வம்]', te: '(−) × (−) = (+)  [ఋణం × ఋణం = ధనం]', bn: '(−) × (−) = (+)  [ঋণ × ঋণ = ধন]', kn: '(−) × (−) = (+)  [ಋಣ × ಋಣ = ಧನ]', gu: '(−) × (−) = (+)  [ઋણ × ઋણ = ધન]' }, sign: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { rule: { en: '(+) × (+) = (+)  [fortune × fortune = fortune]', hi: '(+) × (+) = (+)  [धन × धन = धन]', sa: '(+) × (+) = (+)  [धनम् × धनम् = धनम्]', mai: '(+) × (+) = (+)  [धन × धन = धन]', mr: '(+) × (+) = (+)  [धन × धन = धन]', ta: '(+) × (+) = (+)  [செல்வம் × செல்வம் = செல்வம்]', te: '(+) × (+) = (+)  [ధనం × ధనం = ధనం]', bn: '(+) × (+) = (+)  [ধন × ধন = ধন]', kn: '(+) × (+) = (+)  [ಧನ × ಧನ = ಧನ]', gu: '(+) × (+) = (+)  [ધન × ધન = ધન]' }, sign: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { rule: { en: '0 − (+) = (−)  [zero minus fortune = debt]', hi: '0 − (+) = (−)  [शून्य − धन = ऋण]', sa: '0 − (+) = (−)  [शून्यम् − धनम् = ऋणम्]', mai: '0 − (+) = (−)  [शून्य − धन = ऋण]', mr: '0 − (+) = (−)  [शून्य − धन = ऋण]', ta: '0 − (+) = (−)  [பூஜ்யம் கழிக்க செல்வம் = கடன்]', te: '0 − (+) = (−)  [సున్న తీసివేయి ధనం = ఋణం]', bn: '0 − (+) = (−)  [শূন্য বিয়োগ ধন = ঋণ]', kn: '0 − (+) = (−)  [ಶೂನ್ಯ ಕಳೆ ಧನ = ಋಣ]', gu: '0 − (+) = (−)  [શૂન્ય ઓછું ધન = ઋણ]' }, sign: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { rule: { en: '(+) + (−) = difference of the two', hi: '(+) + (−) = दोनों का अंतर', sa: '(+) + (−) = उभयोः अन्तरम्', mai: '(+) + (−) = दूनूक अन्तर', mr: '(+) + (−) = दोन्हींचा फरक', ta: '(+) + (−) = இரண்டின் வேறுபாடு', te: '(+) + (−) = రెండింటి భేదం', bn: '(+) + (−) = দুটির পার্থক্য', kn: '(+) + (−) = ಎರಡರ ವ್ಯತ್ಯಾಸ', gu: '(+) + (−) = બેનો તફાવત' }, sign: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  { rule: { en: '0 ÷ 0 = 0  (his one error — undefined!)', hi: '0 ÷ 0 = 0  (उनकी एकमात्र त्रुटि — अपरिभाषित!)', sa: '0 ÷ 0 = 0  (तस्य एकमात्रा त्रुटिः — अपरिभाषितम्!)', mai: '0 ÷ 0 = 0  (हुनकर एकमात्र त्रुटि — अपरिभाषित!)', mr: '0 ÷ 0 = 0  (त्यांची एकमेव चूक — अपरिभाषित!)', ta: '0 ÷ 0 = 0  (அவரது ஒரே பிழை — வரையறுக்கப்படாதது!)', te: '0 ÷ 0 = 0  (అతని ఒకే తప్పు — నిర్వచించబడనిది!)', bn: '0 ÷ 0 = 0  (তাঁর একমাত্র ভুল — অনির্ধারিত!)', kn: '0 ÷ 0 = 0  (ಅವರ ಏಕೈಕ ತಪ್ಪು — ಅನಿರ್ವಚನೀಯ!)', gu: '0 ÷ 0 = 0  (તેમની એકમાત્ર ભૂલ — અવ્યાખ્યાયિત!)' }, sign: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
];

const EUROPEAN_RESISTANCE = [
  { who: 'René Descartes', year: '1637 CE', stance: { en: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', hi: 'ऋणात्मक जड़ों को "झूठी" कहा — उन्हें वास्तविक समाधान के रूप में स्वीकार करने से इनकार कर दिया', sa: 'ऋणात्मकमूलानि "मिथ्या" इति उक्तवान् — तानि वास्तविकसमाधानरूपेण स्वीकर्तुं निराकृतवान्', mai: 'ऋणात्मक जड़ केँ "झूठ" कहलनि — ओकरा वास्तविक समाधानक रूपमे स्वीकार करबासँ इनकार कएलनि', mr: 'ऋणात्मक मूळांना "खोटी" म्हणाले — त्यांना खरे उत्तर म्हणून स्वीकारण्यास नकार दिला', ta: 'எதிர்மறை மூலங்களை "பொய்யானவை" (fausses) என்றழைத்தார் — அவற்றை உண்மையான தீர்வுகளாக ஏற்க மறுத்தார்', te: 'ఋణాత్మక మూలాలను "తప్పుడువి" (fausses) అని పిలిచారు — వాటిని నిజమైన పరిష్కారాలుగా అంగీకరించడానికి నిరాకరించారు', bn: 'ঋণাত্মক বীজগুলিকে "মিথ্যা" (fausses) বলেছিলেন — সত্যিকারের সমাধান হিসেবে গ্রহণ করতে অস্বীকার করেছিলেন', kn: 'ಋಣಾತ್ಮಕ ಮೂಲಗಳನ್ನು "ಸುಳ್ಳು" (fausses) ಎಂದು ಕರೆದರು — ನಿಜವಾದ ಪರಿಹಾರಗಳೆಂದು ಒಪ್ಪಿಕೊಳ್ಳಲು ನಿರಾಕರಿಸಿದರು', gu: 'ઋણાત્મક મૂળને "ખોટા" (fausses) કહ્યા — તેમને વાસ્તવિક ઉકેલ તરીકે સ્વીકારવાનો ઇનકાર કર્યો' }, color: 'border-red-400/50' },
  { who: 'Blaise Pascal', year: '1650 CE', stance: { en: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', hi: '"शून्य से कम कुछ भी नहीं हो सकता" — उनके लिए शून्य से घटाव निरर्थक था', sa: '"शून्यात् न्यूनं किमपि न भवितुम् अर्हति" — तस्य कृते शून्यात् व्यवकलनं निरर्थकम् आसीत्', mai: '"शून्यसँ कम किछु नहि भऽ सकैत अछि" — हुनका लेल शून्यसँ घटाव निरर्थक छल', mr: '"शून्यापेक्षा कमी काहीच असू शकत नाही" — त्यांच्यासाठी शून्यातून वजाबाकी निरर्थक होती', ta: '"பூஜ்யத்தை விட குறைவாக எதுவும் இருக்க முடியாது" — பூஜ்யத்திலிருந்து கழிப்பது அவருக்கு அர்த்தமற்றதாக இருந்தது', te: '"సున్న కంటే తక్కువ ఏదీ ఉండదు" — సున్న నుండి తీసివేయడం అతనికి అర్థరహితంగా ఉంది', bn: '"শূন্যের কম কিছু হতে পারে না" — শূন্য থেকে বিয়োগ তাঁর কাছে অর্থহীন ছিল', kn: '"ಶೂನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ ಏನೂ ಇರಲಾರದು" — ಶೂನ್ಯದಿಂದ ಕಳೆಯುವುದು ಅವರಿಗೆ ಅರ್ಥಹೀನವಾಗಿತ್ತು', gu: '"શૂન્યથી ઓછું કશું હોઈ શકે નહીં" — શૂન્યમાંથી બાદબાકી તેમના માટે અર્થહીન હતી' }, color: 'border-red-400/40' },
  { who: 'Antoine Arnauld', year: '1667 CE', stance: { en: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', hi: 'तर्क दिया कि -1/1 = 1/-1 विरोधाभासी था — एक छोटी संख्या बड़े को कैसे विभाजित कर सकती है?', sa: 'तर्कितवान् यत् -1/1 = 1/-1 विरुद्धम् — लघुसंख्या बृहत्संख्यां कथं विभजेत्?', mai: 'तर्क देलनि जे -1/1 = 1/-1 विरोधाभासी छल — एक छोट संख्या पैग केँ कोना विभाजित कऽ सकैत अछि?', mr: '-1/1 = 1/-1 विरोधाभासी असल्याचा युक्तिवाद केला — लहान संख्या मोठ्याला कशी विभागू शकते?', ta: '-1/1 = 1/-1 முரண்பாடானது என்று வாதிட்டார் — ஒரு சிறிய எண் பெரியதை எப்படி வகுக்க முடியும்?', te: '-1/1 = 1/-1 విరుద్ధమని వాదించారు — చిన్న సంఖ్య పెద్దదాన్ని ఎలా భాగించగలదు?', bn: '-1/1 = 1/-1 বিরোধাভাসমূলক বলে যুক্তি দিয়েছিলেন — একটি ছোট সংখ্যা কীভাবে বড়টিকে ভাগ করতে পারে?', kn: '-1/1 = 1/-1 ವಿರೋಧಾಭಾಸವೆಂದು ವಾದಿಸಿದರು — ಚಿಕ್ಕ ಸಂಖ್ಯೆ ದೊಡ್ಡದನ್ನು ಹೇಗೆ ಭಾಗಿಸಬಲ್ಲದು?', gu: '-1/1 = 1/-1 વિરોધાભાસી છે એવી દલીલ કરી — નાની સંખ્યા મોટાને કેવી રીતે ભાગી શકે?' }, color: 'border-orange-400/40' },
  { who: 'Francis Maseres', year: '1758 CE', stance: { en: 'Wrote books arguing negatives should be abolished from mathematics entirely', hi: 'किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से पूरी तरह समाप्त किया जाना चाहिए', sa: 'पुस्तकानि लिखितवान् तर्कयन् यत् ऋणात्मकसंख्याः गणितात् सम्पूर्णतया निवार्याः', mai: 'किताब लिखलनि ई तर्क दैत जे ऋणात्मक संख्या केँ गणितसँ पूरा तरहें समाप्त कएल जाय', mr: 'ऋणात्मक संख्या गणितातून पूर्णपणे काढून टाकल्या पाहिजेत असा युक्तिवाद करणारी पुस्तके लिहिली', ta: 'எதிர்மறை எண்களை கணிதத்திலிருந்து முழுமையாக நீக்க வேண்டும் என்று புத்தகங்கள் எழுதினார்', te: 'ఋణాత్మక సంఖ్యలను గణితం నుండి పూర్తిగా తొలగించాలని పుస్తకాలు రాశారు', bn: 'ঋণাত্মক সংখ্যা গণিত থেকে সম্পূর্ণ বাদ দেওয়া উচিত বলে বই লিখেছিলেন', kn: 'ಋಣಾತ್ಮಕ ಸಂಖ್ಯೆಗಳನ್ನು ಗಣಿತಶಾಸ್ತ್ರದಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ರದ್ದುಗೊಳಿಸಬೇಕೆಂದು ಪುಸ್ತಕಗಳನ್ನು ಬರೆದರು', gu: 'ઋણાત્મક સંખ્યાઓને ગણિતમાંથી સંપૂર્ણપણે નાબૂદ કરવી જોઈએ એમ દલીલ કરતા પુસ્તકો લખ્યા' }, color: 'border-amber-400/40' },
  { who: 'William Frend', year: '1796 CE', stance: { en: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', hi: 'अपनी बीजगणित पाठ्यपुस्तक में ऋणात्मक संख्याओं का उपयोग करने से इनकार किया — उन्हें "बेतुका" कहा', sa: 'स्वस्य बीजगणितपाठ्यपुस्तके ऋणात्मकसंख्यानाम् उपयोगं कर्तुं निराकृतवान् — ताः "असम्बद्धाः" इति उक्तवान्', mai: 'अपन बीजगणित पाठ्यपुस्तकमे ऋणात्मक संख्याक उपयोग करबासँ इनकार कएलनि — ओकरा "बेतुका" कहलनि', mr: 'आपल्या बीजगणित पाठ्यपुस्तकात ऋणात्मक संख्या वापरण्यास नकार दिला — त्यांना "मूर्खपणा" म्हणाले', ta: 'தனது இயற்கணிதப் பாடநூலில் எதிர்மறை எண்களைப் பயன்படுத்த மறுத்தார் — அவற்றை "அபத்தமானவை" என்றழைத்தார்', te: 'తన బీజగణిత పాఠ్యపుస్తకంలో ఋణాత్మక సంఖ్యలను ఉపయోగించడానికి నిరాకరించారు — వాటిని "అసంబద్ధం" అని పిలిచారు', bn: 'তাঁর বীজগণিত পাঠ্যবইতে ঋণাত্মক সংখ্যা ব্যবহার করতে অস্বীকার করেছিলেন — সেগুলিকে "অযৌক্তিক" বলেছিলেন', kn: 'ತಮ್ಮ ಬೀಜಗಣಿತ ಪಠ್ಯಪುಸ್ತಕದಲ್ಲಿ ಋಣಾತ್ಮಕ ಸಂಖ್ಯೆಗಳನ್ನು ಬಳಸಲು ನಿರಾಕರಿಸಿದರು — ಅವುಗಳನ್ನು "ಅಸಂಬದ್ಧ" ಎಂದು ಕರೆದರು', gu: 'પોતાના બીજગણિત પાઠ્યપુસ્તકમાં ઋણાત્મક સંખ્યાઓ વાપરવાનો ઇનકાર કર્યો — તેમને "વાહિયાત" કહ્યા' }, color: 'border-amber-400/30' },
];

const JYOTISH_USES = [
  { use: { en: 'Retrograde velocity (−°/day when planet moves backward)', hi: 'वक्री वेग (जब ग्रह पीछे चलता है तो −°/दिन)', sa: 'वक्रगतिवेगः (यदा ग्रहः पश्चाद् गच्छति तदा −°/दिनम्)', mai: 'वक्री वेग (जखन ग्रह पाछाँ चलैत अछि तँ −°/दिन)', mr: 'वक्री वेग (जेव्हा ग्रह मागे जातो तेव्हा −°/दिवस)', ta: 'வக்ர வேகம் (கிரகம் பின்நோக்கிச் செல்லும்போது −°/நாள்)', te: 'వక్ర వేగం (గ్రహం వెనుకకు కదిలినప్పుడు −°/రోజు)', bn: 'বক্রগতি বেগ (গ্রহ পিছনের দিকে চললে −°/দিন)', kn: 'ವಕ್ರ ವೇಗ (ಗ್ರಹ ಹಿಂದಕ್ಕೆ ಚಲಿಸಿದಾಗ −°/ದಿನ)', gu: 'વક્ર ગતિ (ગ્રહ પાછળ જાય ત્યારે −°/દિવસ)' } },
  { use: { en: 'Longitude difference between planets (can be negative going east)', hi: 'ग्रहों के बीच देशांतर अंतर (पूर्व की ओर जाने पर ऋणात्मक हो सकता है)', sa: 'ग्रहाणां मध्ये देशान्तरान्तरम् (पूर्वदिशि गमने ऋणात्मकं भवितुम् अर्हति)', mai: 'ग्रहक बीच देशान्तर अन्तर (पूर्व दिशामे जाय पर ऋणात्मक भऽ सकैत अछि)', mr: 'ग्रहांमधील रेखांश अंतर (पूर्वेकडे जाताना ऋणात्मक असू शकतो)', ta: 'கிரகங்களுக்கிடையேயான தீர்க்கரேகை வேறுபாடு (கிழக்கே செல்லும்போது எதிர்மறையாக இருக்கலாம்)', te: 'గ్రహాల మధ్య రేఖాంశ భేదం (తూర్పువైపు నడుస్తే ఋణాత్మకంగా ఉండవచ్చు)', bn: 'গ্রহগুলির মধ্যে দ্রাঘিমা পার্থক্য (পূর্বদিকে গেলে ঋণাত্মক হতে পারে)', kn: 'ಗ್ರಹಗಳ ನಡುವಿನ ರೇಖಾಂಶ ವ್ಯತ್ಯಾಸ (ಪೂರ್ವಕ್ಕೆ ಹೋದಾಗ ಋಣಾತ್ಮಕವಾಗಬಹುದು)', gu: 'ગ્રહો વચ્ચે રેખાંશ તફાવત (પૂર્વ તરફ જતાં ઋણાત્મક હોઈ શકે)' } },
  { use: { en: 'Manda/shighra samskara corrections (signed ±)', hi: 'मंद/शीघ्र संस्कार सुधार (±चिह्नित)', sa: 'मन्द/शीघ्रसंस्कारसंशोधनम् (±चिह्नितम्)', mai: 'मन्द/शीघ्र संस्कार सुधार (±चिह्नित)', mr: 'मंद/शीघ्र संस्कार दुरुस्ती (±चिन्हांकित)', ta: 'மந்த/சீக்ர சம்ஸ்கார திருத்தங்கள் (± குறி)', te: 'మంద/శీఘ్ర సంస్కార దిద్దుబాట్లు (± గుర్తు)', bn: 'মন্দ/শীঘ্র সংস্কার সংশোধন (± চিহ্নিত)', kn: 'ಮಂದ/ಶೀಘ್ರ ಸಂಸ್ಕಾರ ತಿದ್ದುಪಡಿ (± ಚಿಹ್ನೆ)', gu: 'મંદ/શીઘ્ર સંસ્કાર સુધારા (± ચિહ્ન)' } },
  { use: { en: 'Latitude of planets (north = +, south = −)', hi: 'ग्रहों का अक्षांश (उत्तर = +, दक्षिण = −)', sa: 'ग्रहाणाम् अक्षांशः (उत्तरम् = +, दक्षिणम् = −)', mai: 'ग्रहक अक्षांश (उत्तर = +, दक्षिण = −)', mr: 'ग्रहांचे अक्षांश (उत्तर = +, दक्षिण = −)', ta: 'கிரகங்களின் அட்சரேகை (வடக்கு = +, தெற்கு = −)', te: 'గ్రహాల అక్షాంశం (ఉత్తరం = +, దక్షిణం = −)', bn: 'গ্রহের অক্ষাংশ (উত্তর = +, দক্ষিণ = −)', kn: 'ಗ್ರಹಗಳ ಅಕ್ಷಾಂಶ (ಉತ್ತರ = +, ದಕ್ಷಿಣ = −)', gu: 'ગ્રહોનું અક્ષાંશ (ઉત્તર = +, દક્ષિણ = −)' } },
  { use: { en: 'Equation of time corrections (can be positive or negative)', hi: 'समय के समीकरण सुधार (धनात्मक या ऋणात्मक हो सकते हैं)', sa: 'कालसमीकरणसंशोधनम् (धनात्मकं वा ऋणात्मकं वा भवितुम् अर्हति)', mai: 'समयक समीकरण सुधार (धनात्मक वा ऋणात्मक भऽ सकैत अछि)', mr: 'वेळ समीकरण दुरुस्ती (धनात्मक किंवा ऋणात्मक असू शकते)', ta: 'நேர சமன்பாட்டுத் திருத்தங்கள் (நேர்மறை அல்லது எதிர்மறையாக இருக்கலாம்)', te: 'సమయ సమీకరణ దిద్దుబాట్లు (ధనాత్మకం లేదా ఋణాత్మకం కావచ్చు)', bn: 'সময়ের সমীকরণ সংশোধন (ধনাত্মক বা ঋণাত্মক হতে পারে)', kn: 'ಸಮಯ ಸಮೀಕರಣ ತಿದ್ದುಪಡಿ (ಧನಾತ್ಮಕ ಅಥವಾ ಋಣಾತ್ಮಕ ಆಗಬಹುದು)', gu: 'સમયના સમીકરણ સુધારા (ધનાત્મક કે ઋણાત્મક હોઈ શકે)' } },
];

const SANSKRIT_TERMS = [
  { term: 'Dhana', transliteration: 'dhana', meaning: 'fortune, wealth — the positive number', devanagari: 'धन' },
  { term: 'Rina', transliteration: 'ṛṇa', meaning: 'debt — the negative number', devanagari: 'ऋण' },
  { term: 'Brahmasphutasiddhanta', transliteration: 'Brahma-sphuṭa-siddhānta', meaning: 'Correctly Established Doctrine of Brahma (628 CE)', devanagari: 'ब्रह्मस्फुटसिद्धान्त' },
  { term: 'Ganitasarasangraha', transliteration: 'Gaṇita-sāra-saṅgraha', meaning: 'Compendium of the Essence of Mathematics — Mahavira, ~850 CE', devanagari: 'गणितसारसंग्रह' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function NegativeNumbersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const hi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gold-primary/10"
              style={{
                width: `${(i % 4 + 1) * 2}px`,
                height: `${(i % 4 + 1) * 2}px`,
                left: `${(i * 19 + 3) % 100}%`,
                top: `${(i * 29 + 7) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-amber-500/10 border border-red-500/30 flex items-center justify-center">
                <Minus className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gold-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t('title')} locale={locale} />
            </div>
          </div>

          <div
            className="mt-10"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-10 py-7">
              <div className="text-center">
                <div
                  className="text-6xl sm:text-7xl font-black text-gold-primary"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  धन
                </div>
                <div className="text-text-secondary mt-1 text-sm">dhana = positive</div>
              </div>
              <div className="text-4xl text-gold-primary/40 font-thin">/</div>
              <div className="text-center">
                <div
                  className="text-6xl sm:text-7xl font-black text-red-400"
                  style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                >
                  ऋण
                </div>
                <div className="text-text-secondary mt-1 text-sm">rina = negative/debt</div>
              </div>
              <div className="text-text-secondary/50 text-xs mt-1 sm:mt-0 sm:ml-2 text-center">
                {hi ? 'ब्रह्मगुप्त, 628 ईस्वी' : 'Brahmagupta, 628 CE'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p>{t('s1Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-gold-primary/10 to-transparent border border-gold-primary/20 p-5">
              <div
                className="text-2xl font-bold text-gold-primary mb-1"
                style={{ fontFamily: 'var(--font-devanagari-heading)' }}
              >
                धन
              </div>
              <div className="text-gold-light font-semibold text-sm mb-1">dhana (fortune)</div>
              <div className="text-text-secondary text-sm">
                {hi ? 'सम्पदा, लाभ, धनात्मक संख्या — हमारे पास जो है वह' : 'Wealth, profit, positive number — what we have'}
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-5">
              <div
                className="text-2xl font-bold text-red-400 mb-1"
                style={{ fontFamily: 'var(--font-devanagari-heading)' }}
              >
                ऋण
              </div>
              <div className="text-red-400/80 font-semibold text-sm mb-1">rina (debt)</div>
              <div className="text-text-secondary text-sm">
                {hi ? 'कर्ज़, हानि, ऋणात्मक संख्या — हम पर जो बकाया है वह' : 'Debt, loss, negative number — what we owe'}
              </div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Intro')}</p>
          <div className="mt-6 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'ब्रह्मगुप्त के ऋण-धन नियम (628 ईस्वी)' : "Brahmagupta's rina-dhana rules (628 CE)"}
            </h4>
            {BRAHMAGUPTA_RULES.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${item.sign}`}
              >
                <span className="text-xs font-mono w-4 flex-shrink-0 opacity-60">{i + 1}.</span>
                <span className="font-mono text-sm flex-1">{lt(item.rule as LocaleText, locale)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="text-amber-400 font-semibold text-sm mb-1">
              {hi ? 'उनकी एकमात्र त्रुटि:' : 'His one error:'}
            </div>
            <div className="font-mono text-text-primary text-sm">
              0 ÷ 0 = 0 <span className="text-red-400 ml-2">✗ (undefined)</span>
            </div>
            <div className="text-text-secondary text-xs mt-2">
              {hi
                ? 'भास्कर II (1150 ईस्वी) ने इसे परिष्कृत किया: n÷0 = अनन्त (∞), जहाँ n≠0 — फिर भी पूरी तरह सही नहीं, लेकिन करीब।'
                : 'Bhaskara II (1150 CE) refined this: n÷0 = ananta (∞) where n≠0 — still not fully correct, but closer.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
          <div className="mt-5 bg-white/[0.02] border border-gold-primary/15 rounded-xl p-5">
            <div className="text-gold-light font-semibold text-sm mb-3">
              {hi ? 'महावीर का योगदान (गणितसारसंग्रह, ~850 ईस्वी)' : "Mahavira's contributions (Ganitasarasangraha, ~850 CE)"}
            </div>
            <ul className="space-y-2">
              {[
                { en: 'Extended Brahmagupta\'s rules to more complex expressions', hi: 'ब्रह्मगुप्त के नियमों को अधिक जटिल व्यंजकों तक बढ़ाया' },
                { en: 'Systematic treatment of losses and debts in commercial arithmetic', hi: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', sa: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', mai: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', mr: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', ta: 'Systematic treatment of losses and debts in commercial arithmetic', te: 'Systematic treatment of losses and debts in commercial arithmetic', bn: 'Systematic treatment of losses and debts in commercial arithmetic', kn: 'Systematic treatment of losses and debts in commercial arithmetic', gu: 'Systematic treatment of losses and debts in commercial arithmetic' },
                { en: 'Worked with negative results in subtraction sequences', hi: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', sa: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', mai: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', mr: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', ta: 'Worked with negative results in subtraction sequences', te: 'Worked with negative results in subtraction sequences', bn: 'Worked with negative results in subtraction sequences', kn: 'Worked with negative results in subtraction sequences', gu: 'Worked with negative results in subtraction sequences' },
                { en: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', hi: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', sa: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', mai: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', mr: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', ta: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', te: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', bn: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', kn: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', gu: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-gold-primary/60 mt-0.5">•</span>
                  <span>{lt(item as LocaleText, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-6 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'यूरोपीय विरोध की समयरेखा' : 'Timeline of European resistance'}
            </h4>
            {EUROPEAN_RESISTANCE.map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${item.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{item.year}</div>
                  <div className="text-text-secondary/70 text-xs">{item.who}</div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed italic">&ldquo;{lt(item.stance as LocaleText, locale)}&rdquo;</div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-4 text-sm text-text-secondary">
            <span className="text-gold-light font-semibold">{hi ? 'तुलना: ' : 'Comparison: '}</span>
            {hi
              ? 'भारत में 628 ईस्वी में स्वीकृत। यूरोप में ~1800 ईस्वी तक पूर्ण स्वीकृति। अंतर: 1,200 वर्ष।'
              : 'Accepted in India by 628 CE. Fully accepted in Europe by ~1800 CE. Gap: 1,200 years.'}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <p>{t('s5Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">
                  {hi ? 'भारत — क्यों जल्दी स्वीकार किया' : 'India — why early acceptance'}
                </span>
              </div>
              <ul className="space-y-2 text-text-secondary text-sm">
                {[
                  { en: 'Active banking & credit economy needed debt arithmetic', hi: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', sa: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', mai: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', mr: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', ta: 'Active banking & credit economy needed debt arithmetic', te: 'Active banking & credit economy needed debt arithmetic', bn: 'Active banking & credit economy needed debt arithmetic', kn: 'Active banking & credit economy needed debt arithmetic', gu: 'Active banking & credit economy needed debt arithmetic' },
                  { en: 'Rina (debt) legally codified in Arthashastra & Manusmriti', hi: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', sa: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', mai: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', mr: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', ta: 'Rina (debt) legally codified in Arthashastra & Manusmriti', te: 'Rina (debt) legally codified in Arthashastra & Manusmriti', bn: 'Rina (debt) legally codified in Arthashastra & Manusmriti', kn: 'Rina (debt) legally codified in Arthashastra & Manusmriti', gu: 'Rina (debt) legally codified in Arthashastra & Manusmriti' },
                  { en: 'Astronomical calculations require signed numbers', hi: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', sa: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', mai: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', mr: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', ta: 'Astronomical calculations require signed numbers', te: 'Astronomical calculations require signed numbers', bn: 'Astronomical calculations require signed numbers', kn: 'Astronomical calculations require signed numbers', gu: 'Astronomical calculations require signed numbers' },
                  { en: 'Philosophical tradition comfortable with "void" (shunya)', hi: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', sa: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', mai: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', mr: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', ta: 'Philosophical tradition comfortable with "void" (shunya)', te: 'Philosophical tradition comfortable with "void" (shunya)', bn: 'Philosophical tradition comfortable with "void" (shunya)', kn: 'Philosophical tradition comfortable with "void" (shunya)', gu: 'Philosophical tradition comfortable with "void" (shunya)' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-emerald-400/60 mt-0.5">+</span>
                    <span>{lt(item as LocaleText, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400 font-semibold text-sm">
                  {hi ? 'यूरोप — क्यों 1,200 साल लगे' : 'Europe — why 1,200 years'}
                </span>
              </div>
              <ul className="space-y-2 text-text-secondary text-sm">
                {[
                  { en: 'Greek geometry dominated — no negative lengths possible', hi: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', sa: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', mai: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', mr: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', ta: 'Greek geometry dominated — no negative lengths possible', te: 'Greek geometry dominated — no negative lengths possible', bn: 'Greek geometry dominated — no negative lengths possible', kn: 'Greek geometry dominated — no negative lengths possible', gu: 'Greek geometry dominated — no negative lengths possible' },
                  { en: 'Barter economies needed less abstract arithmetic', hi: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', sa: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', mai: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', mr: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', ta: 'Barter economies needed less abstract arithmetic', te: 'Barter economies needed less abstract arithmetic', bn: 'Barter economies needed less abstract arithmetic', kn: 'Barter economies needed less abstract arithmetic', gu: 'Barter economies needed less abstract arithmetic' },
                  { en: 'Philosophical block: "Nothing can be less than nothing"', hi: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', sa: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', mai: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', mr: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', ta: 'Philosophical block: "Nothing can be less than nothing"', te: 'Philosophical block: "Nothing can be less than nothing"', bn: 'Philosophical block: "Nothing can be less than nothing"', kn: 'Philosophical block: "Nothing can be less than nothing"', gu: 'Philosophical block: "Nothing can be less than nothing"' },
                  { en: 'Church viewed zero and negatives with theological suspicion', hi: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', sa: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', mai: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', mr: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', ta: 'Church viewed zero and negatives with theological suspicion', te: 'Church viewed zero and negatives with theological suspicion', bn: 'Church viewed zero and negatives with theological suspicion', kn: 'Church viewed zero and negatives with theological suspicion', gu: 'Church viewed zero and negatives with theological suspicion' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-red-400/60 mt-0.5">−</span>
                    <span>{lt(item as LocaleText, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 space-y-2">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-3">
              {hi ? 'इस ऐप में ऋणात्मक संख्याओं के उपयोग' : 'Uses of negative numbers in this app'}
            </h4>
            {JYOTISH_USES.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3"
              >
                <TrendingDown className="w-4 h-4 text-gold-primary/60 flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary text-sm">{lt(item.use as LocaleText, locale)}</span>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य संस्कृत शब्द' : 'Key Sanskrit Terms'}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/learn/contributions"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {t('backToContributions')}
          </Link>
          <Link
            href="/learn/contributions/fibonacci"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t('nextPage')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
