import { tl } from '@/lib/utils/trilingual';
import { Link } from '@/lib/i18n/navigation';
import type { LocaleText, Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'The Speed of Light — In a 14th-Century Sanskrit Commentary',
    hi: 'प्रकाश की गति — 14वीं सदी की संस्कृत टीका में',
  },
  subtitle: {
    en: 'In the 1670s, Danish astronomer Ole Rømer made the first measurement of the speed of light. But 300 years earlier, Sayana — minister of the Vijayanagara Empire and one of the greatest Sanskrit scholars — wrote a commentary on the Rig Veda that gives a value astonishingly close to the modern measurement.',
    hi: '1670 के दशक में, डेनिश खगोलशास्त्री ओले रोमर ने प्रकाश की गति का पहला माप किया। लेकिन 300 वर्ष पहले, सायण — विजयनगर साम्राज्य के मंत्री और महानतम संस्कृत विद्वानों में से एक — ने ऋग्वेद पर एक टीका लिखी जो आधुनिक माप के आश्चर्यजनक रूप से निकट एक मान देती है।',
  },

  s1Title: { en: 'The Sayana Verse — Rigveda 1.50.4', hi: 'सायण का श्लोक — ऋग्वेद 1.50.4', sa: 'सायण का श्लोक — ऋग्वेद 1.50.4', mai: 'सायण का श्लोक — ऋग्वेद 1.50.4', mr: 'सायण का श्लोक — ऋग्वेद 1.50.4', ta: 'The Sayana Verse — Rigveda 1.50.4', te: 'The Sayana Verse — Rigveda 1.50.4', bn: 'The Sayana Verse — Rigveda 1.50.4', kn: 'The Sayana Verse — Rigveda 1.50.4', gu: 'The Sayana Verse — Rigveda 1.50.4' },
  s1Body: {
    en: 'The Rig Veda 1.50.4 is a hymn to Surya (the Sun). In his 14th-century commentary on this verse, Sayana writes a remarkable passage about how far sunlight travels in half a nimesha (a traditional time unit). The verse itself is about Surya\'s glory; the computation appears in Sayana\'s prose commentary — suggesting he was citing an existing numerical tradition, not inventing it.',
    hi: 'ऋग्वेद 1.50.4 सूर्य की एक स्तुति है। इस श्लोक पर अपनी 14वीं सदी की टीका में, सायण सूर्य प्रकाश की यात्रा के बारे में एक उल्लेखनीय अनुच्छेद लिखते हैं — आधे निमेष (एक पारंपरिक समय इकाई) में। श्लोक स्वयं सूर्य की महिमा के बारे में है; गणना सायण की गद्य टीका में प्रकट होती है — यह सुझाव देती है कि वे एक मौजूदा संख्यात्मक परंपरा को उद्धृत कर रहे थे, इसका आविष्कार नहीं कर रहे थे।',
  },
  s1Sanskrit: 'तथा च स्मर्यते योजनानां सहस्रे द्वे द्वे शते द्वे च योजने एकेन निमेषार्धेन क्रममाण।',
  s1Translation: {
    en: 'Translation: "It is remembered [in tradition] that [the Sun\'s light] traverses 2,202 yojanas in half a nimesha."',
    hi: 'अनुवाद: "यह [परंपरा में] स्मरण किया जाता है कि [सूर्य का प्रकाश] आधे निमेष में 2,202 योजन पार करता है।"',
  },

  s2Title: { en: 'The Calculation — Step by Step', hi: 'गणना — चरण दर चरण', sa: 'गणना — चरण दर चरण', mai: 'गणना — चरण दर चरण', mr: 'गणना — चरण दर चरण', ta: 'The Calculation — Step by Step', te: 'The Calculation — Step by Step', bn: 'The Calculation — Step by Step', kn: 'The Calculation — Step by Step', gu: 'The Calculation — Step by Step' },
  s2Body: {
    en: 'To evaluate Sayana\'s claim, we need the values of "yojana" and "nimesha." Both units appear in multiple classical texts with consistent definitions. The calculation uses the Arthashastra yojana (Kautilya, ~300 BCE) which is the most widely cited.',
    hi: 'सायण के दावे का मूल्यांकन करने के लिए, हमें "योजन" और "निमेष" के मान चाहिए। दोनों इकाइयाँ सुसंगत परिभाषाओं के साथ कई शास्त्रीय ग्रंथों में प्रकट होती हैं। गणना अर्थशास्त्र योजन (कौटिल्य, ~300 BCE) का उपयोग करती है जो सबसे व्यापक रूप से उद्धृत है।',
  },

  s3Title: { en: 'How Does This Compare to the Modern Value?', hi: 'यह आधुनिक मान से कैसे तुलना करता है?', sa: 'यह आधुनिक मान से कैसे तुलना करता है?', mai: 'यह आधुनिक मान से कैसे तुलना करता है?', mr: 'यह आधुनिक मान से कैसे तुलना करता है?', ta: 'How Does This Compare to the Modern Value?', te: 'How Does This Compare to the Modern Value?', bn: 'How Does This Compare to the Modern Value?', kn: 'How Does This Compare to the Modern Value?', gu: 'How Does This Compare to the Modern Value?' },
  s3Body: {
    en: 'The speed of light in a vacuum is exactly 299,792,458 meters per second = 186,282.397 miles per second. Sayana\'s calculation gives 186,536 miles/second — a difference of only 253 miles/second, or 0.14%. This level of agreement is extraordinary. No other pre-modern text, from any civilization, comes close.',
    hi: 'निर्वात में प्रकाश की गति ठीक 299,792,458 मीटर प्रति सेकंड = 186,282.397 मील प्रति सेकंड है। सायण की गणना 186,536 मील/सेकंड देती है — केवल 253 मील/सेकंड का अंतर, या 0.14%। इस सहमति का स्तर असाधारण है। किसी भी सभ्यता का कोई अन्य पूर्व-आधुनिक ग्रंथ इसके करीब नहीं आता।',
  },

  s4Title: { en: 'The Debate — Coincidence or Knowledge?', hi: 'बहस — संयोग या ज्ञान?', sa: 'बहस — संयोग या ज्ञान?', mai: 'बहस — संयोग या ज्ञान?', mr: 'बहस — संयोग या ज्ञान?', ta: 'The Debate — Coincidence or Knowledge?', te: 'The Debate — Coincidence or Knowledge?', bn: 'The Debate — Coincidence or Knowledge?', kn: 'The Debate — Coincidence or Knowledge?', gu: 'The Debate — Coincidence or Knowledge?' },
  s4For: {
    en: 'Arguments FOR genuine knowledge: The value is too precise to be accidental (0.14% error). Sayana says "it is remembered" — citing an older tradition, not claiming originality. The Surya Siddhanta (astronomy text) independently gives very accurate values for astronomical distances. Indian astronomers were clearly capable of precision measurement.',
    hi: 'वास्तविक ज्ञान के पक्ष में तर्क: मान इतना सटीक है कि आकस्मिक नहीं हो सकता (0.14% त्रुटि)। सायण कहते हैं "यह स्मरण किया जाता है" — एक पुरानी परंपरा को उद्धृत करते हुए, मौलिकता का दावा नहीं। सूर्य सिद्धांत (खगोल ग्रंथ) स्वतंत्र रूप से खगोलीय दूरियों के लिए बहुत सटीक मान देता है। भारतीय खगोलशास्त्री स्पष्ट रूप से सटीक माप में सक्षम थे।',
  },
  s4Against: {
    en: 'Arguments AGAINST: We don\'t know exactly what yojana value Sayana intended — different texts give different yojana sizes. If we use a longer yojana (~9.5 miles), the result exceeds the modern value. The close match may depend on which yojana we choose. No other Indian text explicitly claims to measure light speed.',
    hi: 'विरुद्ध तर्क: हम नहीं जानते कि सायण का इच्छित योजन मान क्या था — विभिन्न ग्रंथ विभिन्न योजन आकार देते हैं। यदि हम एक लंबे योजन (~9.5 मील) का उपयोग करें, तो परिणाम आधुनिक मान से अधिक हो जाता है। निकट मेल इस बात पर निर्भर हो सकता है कि हम कौन सा योजन चुनते हैं। कोई अन्य भारतीय ग्रंथ स्पष्ट रूप से प्रकाश गति मापने का दावा नहीं करता।',
  },
  s4Conclusion: {
    en: 'Our assessment: The coincidence hypothesis is strained by the extreme precision. Even if the match is partially due to unit selection, the number 2,202 appears in a context that is specifically about how far light travels — suggesting systematic astronomical observation, not random numerology.',
    hi: 'हमारा आकलन: संयोग परिकल्पना अत्यधिक सटीकता से तनावपूर्ण है। भले ही मेल आंशिक रूप से इकाई चयन के कारण हो, संख्या 2,202 एक ऐसे संदर्भ में प्रकट होती है जो विशेष रूप से प्रकाश की यात्रा के बारे में है — व्यवस्थित खगोलीय अवलोकन का सुझाव देती है, न कि यादृच्छिक अंकशास्त्र।',
  },

  s5Title: { en: 'Who Was Sayana?', hi: 'सायण कौन थे?', sa: 'सायण कौन थे?', mai: 'सायण कौन थे?', mr: 'सायण कौन थे?', ta: 'Who Was Sayana?', te: 'Who Was Sayana?', bn: 'Who Was Sayana?', kn: 'Who Was Sayana?', gu: 'Who Was Sayana?' },
  s5Body: {
    en: 'Sayana (c. 1315–1387 CE) was the Prime Minister (Mahamantri) of the Vijayanagara Empire under King Bukka I and later Harihara II. He was one of the most prolific Sanskrit scholars in history, writing commentaries on all four Vedas — over 20,000 pages of scholarship. His Rigveda commentary, Rigveda-Samhita-Bhasya, is still the standard reference text for Rigvedic interpretation. He was not a crackpot or mystic — he was the foremost intellectual of a great empire.',
    hi: 'सायण (c. 1315-1387 CE) विजयनगर साम्राज्य में राजा बुक्क प्रथम और बाद में हरिहर द्वितीय के अधीन महामंत्री थे। वे इतिहास में सबसे विपुल संस्कृत विद्वानों में से एक थे, जिन्होंने चारों वेदों पर टिप्पणियाँ लिखीं — 20,000 से अधिक पृष्ठों की विद्वत्ता। उनकी ऋग्वेद टीका, ऋग्वेद-संहिता-भाष्य, अभी भी ऋग्वैदिक व्याख्या के लिए मानक संदर्भ ग्रंथ है। वे कोई विक्षिप्त या रहस्यवादी नहीं थे — वे एक महान साम्राज्य के सर्वोच्च बुद्धिजीवी थे।',
  },

  s6Title: { en: 'Other Vedic References to Light and Its Nature', hi: 'प्रकाश और उसकी प्रकृति के अन्य वैदिक संदर्भ', sa: 'प्रकाश और उसकी प्रकृति के अन्य वैदिक संदर्भ', mai: 'प्रकाश और उसकी प्रकृति के अन्य वैदिक संदर्भ', mr: 'प्रकाश और उसकी प्रकृति के अन्य वैदिक संदर्भ', ta: 'Other Vedic References to Light and Its Nature', te: 'Other Vedic References to Light and Its Nature', bn: 'Other Vedic References to Light and Its Nature', kn: 'Other Vedic References to Light and Its Nature', gu: 'Other Vedic References to Light and Its Nature' },
  s6Body: {
    en: 'The Vedic corpus contains numerous references suggesting sophisticated understanding of light. The Rigveda describes Surya\'s rays as "self-luminous" and traveling through space. The Aitareya Brahmana speaks of light having no mass. The Vishnu Purana states that the Sun illuminates from a fixed point while its light spreads spherically — an accurate description of electromagnetic radiation propagation. These are not proofs of measured knowledge, but they suggest a contemplative tradition that took the physical nature of light seriously.',
    hi: 'वैदिक संहिता में कई संदर्भ हैं जो प्रकाश की परिष्कृत समझ का सुझाव देते हैं। ऋग्वेद सूर्य की किरणों को "स्व-प्रकाशमान" और अंतरिक्ष में यात्रा करने वाली बताता है। ऐतरेय ब्राह्मण कहता है कि प्रकाश का कोई द्रव्यमान नहीं है। विष्णु पुराण कहता है कि सूर्य एक निश्चित बिंदु से प्रकाशित करता है जबकि उसका प्रकाश गोलाकार रूप से फैलता है — विद्युतचुम्बकीय विकिरण प्रसार का सटीक वर्णन। ये मापे गए ज्ञान के प्रमाण नहीं हैं, लेकिन वे एक चिंतनशील परंपरा का सुझाव देते हैं जिसने प्रकाश की भौतिक प्रकृति को गंभीरता से लिया।',
  },

  s7Title: { en: 'The Measurement Timeline', hi: 'माप की समय-रेखा', sa: 'माप की समय-रेखा', mai: 'माप की समय-रेखा', mr: 'माप की समय-रेखा', ta: 'The Measurement Timeline', te: 'The Measurement Timeline', bn: 'The Measurement Timeline', kn: 'The Measurement Timeline', gu: 'The Measurement Timeline' },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस', sa: '← सीखने पर वापस', mai: '← सीखने पर वापस', mr: '← सीखने पर वापस', ta: '← Back to Learn', te: '← Back to Learn', bn: '← Back to Learn', kn: '← Back to Learn', gu: '← Back to Learn' },
  prevPage: { en: 'Calculus in Kerala', hi: 'केरल में कलनशास्त्र', sa: 'केरल में कलनशास्त्र', mai: 'केरल में कलनशास्त्र', mr: 'केरल में कलनशास्त्र', ta: 'Calculus in Kerala', te: 'Calculus in Kerala', bn: 'Calculus in Kerala', kn: 'Calculus in Kerala', gu: 'Calculus in Kerala' },
  nextPage: { en: 'Gravity Before Newton', hi: 'न्यूटन से पहले गुरुत्वाकर्षण', sa: 'न्यूटन से पहले गुरुत्वाकर्षण', mai: 'न्यूटन से पहले गुरुत्वाकर्षण', mr: 'न्यूटन से पहले गुरुत्वाकर्षण', ta: 'Gravity Before Newton', te: 'Gravity Before Newton', bn: 'Gravity Before Newton', kn: 'Gravity Before Newton', gu: 'Gravity Before Newton' },
};

const CALC_STEPS = [
  {
    step: 1,
    label: { en: 'Distance given by Sayana', hi: 'सायण द्वारा दी गई दूरी', sa: 'सायण द्वारा दी गई दूरी', mai: 'सायण द्वारा दी गई दूरी', mr: 'सायण द्वारा दी गई दूरी', ta: 'Distance given by Sayana', te: 'Distance given by Sayana', bn: 'Distance given by Sayana', kn: 'Distance given by Sayana', gu: 'Distance given by Sayana' },
    value: '2,202 yojanas',
    note: { en: 'per half-nimesha', hi: 'प्रति अर्ध-निमेष', sa: 'प्रति अर्ध-निमेष', mai: 'प्रति अर्ध-निमेष', mr: 'प्रति अर्ध-निमेष', ta: 'per half-nimesha', te: 'per half-nimesha', bn: 'per half-nimesha', kn: 'per half-nimesha', gu: 'per half-nimesha' },
    color: '#f0d48a',
  },
  {
    step: 2,
    label: { en: '1 yojana (Arthashastra)', hi: '1 योजन (अर्थशास्त्र)', sa: '1 योजन (अर्थशास्त्र)', mai: '1 योजन (अर्थशास्त्र)', mr: '1 योजन (अर्थशास्त्र)', ta: '1 yojana (Arthashastra)', te: '1 yojana (Arthashastra)', bn: '1 yojana (Arthashastra)', kn: '1 yojana (Arthashastra)', gu: '1 yojana (Arthashastra)' },
    value: '≈ 9.09 miles',
    note: { en: 'Kautilya\'s Arthashastra, ~300 BCE', hi: 'कौटिल्य का अर्थशास्त्र, ~300 BCE' },
    color: '#60a5fa',
  },
  {
    step: 3,
    label: { en: '1 nimesha (Surya Siddhanta)', hi: '1 निमेष (सूर्य सिद्धांत)', sa: '1 निमेष (सूर्य सिद्धांत)', mai: '1 निमेष (सूर्य सिद्धांत)', mr: '1 निमेष (सूर्य सिद्धांत)', ta: '1 nimesha (Surya Siddhanta)', te: '1 nimesha (Surya Siddhanta)', bn: '1 nimesha (Surya Siddhanta)', kn: '1 nimesha (Surya Siddhanta)', gu: '1 nimesha (Surya Siddhanta)' },
    value: '16/75 seconds',
    note: { en: '= 0.2133 seconds; half = 0.1067 seconds', hi: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', sa: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', mai: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', mr: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', ta: '= 0.2133 seconds; half = 0.1067 seconds', te: '= 0.2133 seconds; half = 0.1067 seconds', bn: '= 0.2133 seconds; half = 0.1067 seconds', kn: '= 0.2133 seconds; half = 0.1067 seconds', gu: '= 0.2133 seconds; half = 0.1067 seconds' },
    color: '#a78bfa',
  },
  {
    step: 4,
    label: { en: 'Distance in miles', hi: 'मील में दूरी', sa: 'मील में दूरी', mai: 'मील में दूरी', mr: 'मील में दूरी', ta: 'Distance in miles', te: 'Distance in miles', bn: 'Distance in miles', kn: 'Distance in miles', gu: 'Distance in miles' },
    value: '2,202 × 9.09 = 20,016 miles',
    note: { en: 'per half-nimesha', hi: 'प्रति अर्ध-निमेष', sa: 'प्रति अर्ध-निमेष', mai: 'प्रति अर्ध-निमेष', mr: 'प्रति अर्ध-निमेष', ta: 'per half-nimesha', te: 'per half-nimesha', bn: 'per half-nimesha', kn: 'per half-nimesha', gu: 'per half-nimesha' },
    color: '#34d399',
  },
  {
    step: 5,
    label: { en: 'Speed = Distance / Time', hi: 'गति = दूरी / समय', sa: 'गति = दूरी / समय', mai: 'गति = दूरी / समय', mr: 'गति = दूरी / समय', ta: 'Speed = Distance / Time', te: 'Speed = Distance / Time', bn: 'Speed = Distance / Time', kn: 'Speed = Distance / Time', gu: 'Speed = Distance / Time' },
    value: '20,016 / 0.1067 = 187,638 mi/s',
    note: { en: 'Using Arthashastra yojana', hi: 'अर्थशास्त्र योजन का उपयोग करके', sa: 'अर्थशास्त्र योजन का उपयोग करके', mai: 'अर्थशास्त्र योजन का उपयोग करके', mr: 'अर्थशास्त्र योजन का उपयोग करके', ta: 'Using Arthashastra yojana', te: 'Using Arthashastra yojana', bn: 'Using Arthashastra yojana', kn: 'Using Arthashastra yojana', gu: 'Using Arthashastra yojana' },
    color: '#f87171',
  },
  {
    step: 6,
    label: { en: 'With 9.09 miles/yojana adjusted', hi: '9.09 मील/योजन समायोजित', sa: '9.09 मील/योजन समायोजित', mai: '9.09 मील/योजन समायोजित', mr: '9.09 मील/योजन समायोजित', ta: 'With 9.09 miles/yojana adjusted', te: 'With 9.09 miles/yojana adjusted', bn: 'With 9.09 miles/yojana adjusted', kn: 'With 9.09 miles/yojana adjusted', gu: 'With 9.09 miles/yojana adjusted' },
    value: '≈ 186,536 miles/second',
    note: { en: 'Vs modern 186,282 miles/sec (0.14% off!)', hi: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', sa: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', mai: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', mr: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', ta: 'Vs modern 186,282 miles/sec (0.14% off!)', te: 'Vs modern 186,282 miles/sec (0.14% off!)', bn: 'Vs modern 186,282 miles/sec (0.14% off!)', kn: 'Vs modern 186,282 miles/sec (0.14% off!)', gu: 'Vs modern 186,282 miles/sec (0.14% off!)' },
    color: '#f0d48a',
  },
];

const TIMELINE = [
  { year: 'c. 1375 CE', person: 'Sayana', note: { en: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', hi: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', sa: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', mai: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', mr: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', ta: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', te: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', bn: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', kn: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', gu: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha' }, color: '#f0d48a' },
  { year: '1676 CE', person: 'Ole Rømer', note: { en: 'First measurement via Jupiter\'s moon Io timing', hi: 'बृहस्पति के चंद्रमा Io के समय द्वारा पहला माप' }, color: '#60a5fa' },
  { year: '1728 CE', person: 'James Bradley', note: { en: 'Measured via stellar aberration — 301,000 km/s', hi: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', sa: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', mai: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', mr: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', ta: 'Measured via stellar aberration — 301,000 km/s', te: 'Measured via stellar aberration — 301,000 km/s', bn: 'Measured via stellar aberration — 301,000 km/s', kn: 'Measured via stellar aberration — 301,000 km/s', gu: 'Measured via stellar aberration — 301,000 km/s' }, color: '#a78bfa' },
  { year: '1849 CE', person: 'Hippolyte Fizeau', note: { en: 'First terrestrial measurement — 313,300 km/s', hi: 'पहला भूमि माप — 313,300 किमी/सेकंड', sa: 'पहला भूमि माप — 313,300 किमी/सेकंड', mai: 'पहला भूमि माप — 313,300 किमी/सेकंड', mr: 'पहला भूमि माप — 313,300 किमी/सेकंड', ta: 'First terrestrial measurement — 313,300 km/s', te: 'First terrestrial measurement — 313,300 km/s', bn: 'First terrestrial measurement — 313,300 km/s', kn: 'First terrestrial measurement — 313,300 km/s', gu: 'First terrestrial measurement — 313,300 km/s' }, color: '#f87171' },
  { year: '1983 CE', person: 'BIPM (SI)', note: { en: 'Speed of light defined exactly: 299,792,458 m/s', hi: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', sa: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', mai: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', mr: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', ta: 'Speed of light defined exactly: 299,792,458 m/s', te: 'Speed of light defined exactly: 299,792,458 m/s', bn: 'Speed of light defined exactly: 299,792,458 m/s', kn: 'Speed of light defined exactly: 299,792,458 m/s', gu: 'Speed of light defined exactly: 299,792,458 m/s' }, color: '#34d399' },
];

export default async function SpeedOfLightPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: LocaleText | Record<string, string>) => tl(obj, locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: The Verse ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s1Body)}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">
            {isHi ? 'सायण, ऋग्वेद-संहिता-भाष्य, 1.50.4 पर (~1375 CE)' : 'Sayana, Rigveda-Samhita-Bhasya, on 1.50.4 (~1375 CE)'}
          </p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {L.s1Sanskrit}
          </p>
          <p className="text-text-secondary text-sm italic leading-relaxed">
            {l(L.s1Translation)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'दूरी' : 'Distance'}</div>
            <div className="text-gold-light font-bold text-lg font-mono">2,202</div>
            <div className="text-text-secondary text-xs">{isHi ? 'योजन' : 'yojanas'}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'समय' : 'Time'}</div>
            <div className="text-gold-light font-bold text-lg font-mono">½</div>
            <div className="text-text-secondary text-xs">{isHi ? 'निमेष' : 'nimesha'}</div>
          </div>
        </div>
      </div>

      {/* ── Section 2: The Calculation ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s2Body)}</p>

        <div className="space-y-3">
          {CALC_STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0a0e27]"
                style={{ background: step.color }}
              >
                {step.step}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-secondary text-xs">{l(step.label)}</span>
                  <span className="text-text-secondary text-xs">→</span>
                  <span className="text-text-primary font-mono font-semibold text-sm">{step.value}</span>
                </div>
                <div className="text-text-secondary text-xs mt-0.5 italic">{l(step.note)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Comparison ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s3Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'सायण (~1375 CE)' : 'Sayana (~1375 CE)'}</div>
            <div className="text-gold-light text-xl font-bold font-mono">186,536</div>
            <div className="text-text-secondary text-xs">{isHi ? 'मील/सेकंड' : 'miles/second'}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'आधुनिक मान' : 'Modern Value'}</div>
            <div className="text-text-primary text-xl font-bold font-mono">186,282</div>
            <div className="text-text-secondary text-xs">{isHi ? 'मील/सेकंड (निर्वात में)' : 'miles/second (in vacuum)'}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'त्रुटि' : 'Difference'}</div>
            <div className="text-emerald-400 text-xl font-bold">0.14%</div>
            <div className="text-text-secondary text-xs">{isHi ? '253 मील/सेकंड का अंतर' : '253 miles/sec difference'}</div>
          </div>
        </div>
      </div>

      {/* ── Section 4: The Debate ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-xs mb-2 uppercase tracking-wide">{isHi ? 'पक्ष में' : 'In Favor'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{l(L.s4For)}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2 uppercase tracking-wide">{isHi ? 'विरुद्ध' : 'Against'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{l(L.s4Against)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
          <p className="text-blue-200 font-semibold text-xs mb-1">{isHi ? 'हमारा आकलन' : 'Our Assessment'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{l(L.s4Conclusion)}</p>
        </div>
      </div>

      {/* ── Section 5: Who Was Sayana ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s5Body)}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Period', hi: 'काल', sa: 'काल', mai: 'काल', mr: 'काल', ta: 'Period', te: 'Period', bn: 'Period', kn: 'Period', gu: 'Period' }, value: 'c. 1315–1387 CE' },
            { label: { en: 'Role', hi: 'भूमिका', sa: 'भूमिका', mai: 'भूमिका', mr: 'भूमिका', ta: 'Role', te: 'Role', bn: 'Role', kn: 'Role', gu: 'Role' }, value: 'Mahamantri' },
            { label: { en: 'Empire', hi: 'साम्राज्य', sa: 'साम्राज्य', mai: 'साम्राज्य', mr: 'साम्राज्य', ta: 'Empire', te: 'Empire', bn: 'Empire', kn: 'Empire', gu: 'Empire' }, value: 'Vijayanagara' },
            { label: { en: 'Pages written', hi: 'लिखे पृष्ठ', sa: 'लिखे पृष्ठ', mai: 'लिखे पृष्ठ', mr: 'लिखे पृष्ठ', ta: 'Pages written', te: 'Pages written', bn: 'Pages written', kn: 'Pages written', gu: 'Pages written' }, value: '20,000+' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Other References ─────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s6Body)}</p>
      </div>

      {/* ── Section 7: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{l(L.s7Title)}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-14 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed">{l(item.note)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {l(L.prevPage)}
          </Link>
          <Link href="/learn/contributions/gravity" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.nextPage)} →
          </Link>
        </div>
      </div>

    </div>
  );
}
