#!/usr/bin/env node
/**
 * Replace English-copy ta/te/bn/kn/gu values with real translations
 * in the 6 specified files.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');

// ── Translation maps ────────────────────────────────────────────────────────

// Short labels: exact English → { ta, te, bn, kn, gu }
const SHORT = {
  // Planet names
  'Sun':     { ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
  'Moon':    { ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
  'Mars':    { ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
  'Mercury': { ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  'Jupiter': { ta: 'குரு', te: 'గురుడు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
  'Venus':   { ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
  'Saturn':  { ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
  'Rahu':    { ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' },
  'Ketu':    { ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ' },

  // Rashi names
  'Aries':       { ta: 'மேஷம்', te: 'మేషం', bn: 'মেষ', kn: 'ಮೇಷ', gu: 'મેષ' },
  'Taurus':      { ta: 'ரிஷபம்', te: 'వృషభం', bn: 'বৃষ', kn: 'ವೃಷಭ', gu: 'વૃષભ' },
  'Gemini':      { ta: 'மிதுனம்', te: 'మిథునం', bn: 'মিথুন', kn: 'ಮಿಥುನ', gu: 'મિથુન' },
  'Cancer':      { ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક' },
  'Leo':         { ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ' },
  'Virgo':       { ta: 'கன்னி', te: 'కన్య', bn: 'কন্যা', kn: 'ಕನ್ಯಾ', gu: 'કન્યા' },
  'Libra':       { ta: 'துலாம்', te: 'తుల', bn: 'তুলা', kn: 'ತುಲಾ', gu: 'તુલા' },
  'Scorpio':     { ta: 'விருச்சிகம்', te: 'వృశ్చికం', bn: 'বৃশ্চিক', kn: 'ವೃಶ್ಚಿಕ', gu: 'વૃશ્ચિક' },
  'Sagittarius': { ta: 'தனுசு', te: 'ధనుస్సు', bn: 'ধনু', kn: 'ಧನು', gu: 'ધન' },
  'Capricorn':   { ta: 'மகரம்', te: 'మకరం', bn: 'মকর', kn: 'ಮಕರ', gu: 'મકર' },
  'Aquarius':    { ta: 'கும்பம்', te: 'కుంభం', bn: 'কুম্ভ', kn: 'ಕುಂಭ', gu: 'કુંભ' },
  'Pisces':      { ta: 'மீனம்', te: 'మీనం', bn: 'মীন', kn: 'ಮೀನ', gu: 'મીન' },

  // Functional nature labels
  'Badhak (Obstructor)':         { ta: 'பாதக (தடையாளர்)', te: 'బాధక (అవరోధకుడు)', bn: 'বাধক (প্রতিবন্ধক)', kn: 'ಬಾಧಕ (ಅಡ್ಡಗಾಲು)', gu: 'બાધક (અવરોધક)' },
  'Yoga Karaka (Supreme Benefic)': { ta: 'யோககாரகன் (உச்ச சுபன்)', te: 'యోగకారకుడు (సర్వోత్తమ శుభుడు)', bn: 'যোগকারক (শ্রেষ্ঠ শুভ)', kn: 'ಯೋಗಕಾರಕ (ಶ್ರೇಷ್ಠ ಶುಭ)', gu: 'યોગકારક (શ્રેષ્ઠ શુભ)' },
  'Functional Benefic':            { ta: 'செயல்பாட்டு சுபன்', te: 'క్రియాత్మక శుభుడు', bn: 'ক্রিয়াত্মক শুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಶುಭ', gu: 'ક્રિયાત્મક શુભ' },
  'Functional Malefic':            { ta: 'செயல்பாட்டு பாபன்', te: 'క్రియాత్మక అశుభుడు', bn: 'ক্রিয়াত্মক অশুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಅಶುಭ', gu: 'ક્રિયાત્મક અશુભ' },
  'Functional Malefic (Shadow Planet)': { ta: 'செயல்பாட்டு பாபன் (நிழல் கிரகம்)', te: 'క్రియాత్మక అశుభుడు (ఛాయా గ్రహం)', bn: 'ক্রিয়াত্মক অশুভ (ছায়া গ্রহ)', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಅಶುಭ (ಛಾಯಾ ಗ್ರಹ)', gu: 'ક્રિયાત્મક અશુભ (છાયા ગ્રહ)' },
  'Neutral (Kendra Lord)':         { ta: 'நடுநிலை (கேந்திர அதிபதி)', te: 'తటస్థ (కేంద్రాధిపతి)', bn: 'তটস্থ (কেন্দ্রাধিপতি)', kn: 'ತಟಸ್ಥ (ಕೇಂದ್ರಾಧಿಪತಿ)', gu: 'તટસ્થ (કેન્દ્રાધિપતિ)' },
  'Neutral':                       { ta: 'நடுநிலை', te: 'తటస్థ', bn: 'তটস্থ', kn: 'ತಟಸ್ಥ', gu: 'તટસ્થ' },
  'Maraka (Death Inflictor)':      { ta: 'மாரகன் (மரண காரகன்)', te: 'మారకుడు (మరణ కారకుడు)', bn: 'মারক (মৃত্যু কারক)', kn: 'ಮಾರಕ (ಮೃತ್ಯು ಕಾರಕ)', gu: 'મારક (મૃત્યુ કારક)' },

  // Strength words
  'strong':   { ta: 'வலிமை', te: 'బలవంతం', bn: 'বলবান', kn: 'ಬಲವಂತ', gu: 'બળવાન' },
  'moderate': { ta: 'மத்திமம்', te: 'మధ్యమం', bn: 'মধ্যম', kn: 'ಮಧ್ಯಮ', gu: 'મધ્યમ' },
  'weak':     { ta: 'பலவீனம்', te: 'దుర్బలం', bn: 'দুর্বল', kn: 'ದುರ್ಬಲ', gu: 'દુર્બળ' },

  // Dosha relation labels
  'father':                     { ta: 'தந்தை', te: 'తండ్రి', bn: 'পিতা', kn: 'ತಂದೆ', gu: 'પિતા' },
  'mother-in-law':              { ta: 'மாமியார்', te: 'అత్తగారు', bn: 'শাশুড়ি', kn: 'ಅತ್ತೆ', gu: 'સાસુ' },
  'mother':                     { ta: 'தாய்', te: 'తల్లి', bn: 'মাতা', kn: 'ತಾಯಿ', gu: 'માતા' },
  'elder brother/sister':       { ta: 'மூத்த சகோதரர்/சகோதரி', te: 'అన్న/అక్క', bn: 'বড় ভাই/বোন', kn: 'ಅಣ್ಣ/ಅಕ್ಕ', gu: 'મોટો ભાઈ/બહેન' },
  'father / family prosperity': { ta: 'தந்தை / குடும்ப செழிப்பு', te: 'తండ్రి / కుటుంబ సమృద్ధి', bn: 'পিতা / পারিবারিক সমৃদ্ধি', kn: 'ತಂದೆ / ಕುಟುಂಬ ಸಮೃದ್ಧಿ', gu: 'પિતા / પારિવારિક સમૃદ્ધિ' },
  'younger sibling':            { ta: 'இளைய உடன்பிறப்பு', te: 'తమ్ముడు/చెల్లెలు', bn: 'ছোট ভাই/বোন', kn: 'ತಮ್ಮ/ತಂಗಿ', gu: 'નાનો ભાઈ/બહેન' },

  // Gemstone names
  'Ruby (Manikya)':            { ta: 'மாணிக்கம்', te: 'మాణిక్యం', bn: 'মাণিক্য', kn: 'ಮಾಣಿಕ್ಯ', gu: 'માણેક' },
  'Pearl (Moti)':              { ta: 'முத்து', te: 'ముత్యం', bn: 'মুক্তা', kn: 'ಮುತ್ತು', gu: 'મોતી' },
  'Red Coral (Moonga)':        { ta: 'பவளம்', te: 'పగడం', bn: 'প্রবাল', kn: 'ಹವಳ', gu: 'મૂંગા' },
  'Emerald (Panna)':           { ta: 'மரகதம்', te: 'మరకతం', bn: 'পান্না', kn: 'ಪಚ್ಚೆ', gu: 'પન્ના' },
  'Yellow Sapphire (Pukhraj)': { ta: 'புஷ்பராகம்', te: 'పుష్యరాగం', bn: 'পোখরাজ', kn: 'ಪುಷ್ಯರಾಗ', gu: 'પોખરાજ' },
  'Diamond (Heera)':           { ta: 'வைரம்', te: 'వజ్రం', bn: 'হীরা', kn: 'ವಜ್ರ', gu: 'હીરા' },
  'Blue Sapphire (Neelam)':    { ta: 'நீலம்', te: 'నీలం', bn: 'নীলম', kn: 'ನೀಲ', gu: 'નીલમ' },
  'Hessonite Garnet (Gomed)':  { ta: 'கோமேதகம்', te: 'గోమేధికం', bn: 'গোমেদ', kn: 'ಗೋಮೇಧಿಕ', gu: 'ગોમેદ' },

  // Mantra labels
  'Om Suryaya Namah (108 times)':        { ta: 'ஓம் சூர்யாய நம: (108 முறை)', te: 'ఓం సూర్యాయ నమః (108 సార్లు)', bn: 'ওঁ সূর্যায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಸೂರ್ಯಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ સૂર્યાય નમઃ (108 વખત)' },
  'Om Chandraya Namah (108 times)':      { ta: 'ஓம் சந்த்ராய நம: (108 முறை)', te: 'ఓం చంద్రాయ నమః (108 సార్లు)', bn: 'ওঁ চন্দ্রায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಚಂದ್ರಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ ચંદ્રાય નમઃ (108 વખત)' },
  'Om Mangalaya Namah (108 times)':      { ta: 'ஓம் மங்களாய நம: (108 முறை)', te: 'ఓం మంగళాయ నమః (108 సార్లు)', bn: 'ওঁ মঙ্গলায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಮಂಗಳಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ મંગળાય નમઃ (108 વખત)' },
  'Om Budhaya Namah (108 times)':        { ta: 'ஓம் புதாய நம: (108 முறை)', te: 'ఓం బుధాయ నమః (108 సార్లు)', bn: 'ওঁ বুধায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಬುಧಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ બુધાય નમઃ (108 વખત)' },
  'Om Gurave Namah (108 times)':         { ta: 'ஓம் குரவே நம: (108 முறை)', te: 'ఓం గురవే నమః (108 సార్లు)', bn: 'ওঁ গুরবে নমঃ (১০৮ বার)', kn: 'ಓಂ ಗುರವೇ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ ગુરવે નમઃ (108 વખત)' },
  'Om Shukraya Namah (108 times)':       { ta: 'ஓம் சுக்ராய நம: (108 முறை)', te: 'ఓం శుక్రాయ నమః (108 సార్లు)', bn: 'ওঁ শুক্রায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಶುಕ್ರಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ શુક્રાય નમઃ (108 વખત)' },
  'Om Shanaischaraya Namah (108 times)': { ta: 'ஓம் சனைச்சராய நம: (108 முறை)', te: 'ఓం శనైశ్చరాయ నమః (108 సార్లు)', bn: 'ওঁ শনৈশ্চরায় নমঃ (১০৮ বার)', kn: 'ಓಂ ಶನೈಶ್ಚರಾಯ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ શનૈશ્ચરાય નમઃ (108 વખત)' },
  'Om Rahave Namah (108 times)':         { ta: 'ஓம் ராகவே நம: (108 முறை)', te: 'ఓం రాహవే నమః (108 సార్లు)', bn: 'ওঁ রাহবে নমঃ (১০৮ বার)', kn: 'ಓಂ ರಾಹವೇ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ રાહવે નમઃ (108 વખત)' },
  'Om Ketave Namah (108 times)':         { ta: 'ஓம் கேதவே நம: (108 முறை)', te: 'ఓం కేతవే నమః (108 సార్లు)', bn: 'ওঁ কেতবে নমঃ (১০৮ বার)', kn: 'ಓಂ ಕೇತವೇ ನಮಃ (108 ಬಾರಿ)', gu: 'ઓમ કેતવે નમઃ (108 વખત)' },
};

// Longer phrase translations: exact English → { ta, te, bn, kn, gu }
// These are used for template-literal free note fields and descriptions
const PHRASES = {
  // ── functional-nature.ts notes ──
  'Rules both a kendra and trikona — the most beneficial planet in the chart':
    { ta: 'கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆள்கிறது — ஜாதகத்தின் மிகச் சிறந்த சுபக் கிரகம்', te: 'కేంద్ర మరియు త్రికోణ రెండింటినీ ఏలుతుంది — జాతకంలో అత్యంత శుభ గ్రహం', bn: 'কেন্দ্র ও ত্রিকোণ উভয়ের অধিপতি — কুণ্ডলীর সর্বশ্রেষ্ঠ গ্রহ', kn: 'ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣ ಎರಡನ್ನೂ ಆಳುತ್ತದೆ — ಜಾತಕದ ಅತ್ಯಂತ ಶುಭ ಗ್ರಹ', gu: 'કેન્દ્ર અને ત્રિકોણ બંનેના સ્વામી — કુંડળીનો સર્વશ્રેષ્ઠ ગ્રહ' },
  'Lagna + trikona lord — doubly auspicious':
    { ta: 'லக்னம் + திரிகோண அதிபதி — இரட்டை சுபம்', te: 'లగ్నం + త్రికోణ అధిపతి — ద్విగుణ శుభం', bn: 'লগ্ন + ত্রিকোণ স্বামী — দ্বিগুণ শুভ', kn: 'ಲಗ್ನ + ತ್ರಿಕೋಣ ಅಧಿಪತಿ — ದ್ವಿಗುಣ ಶುಭ', gu: 'લગ્ન + ત્રિકોણ સ્વામી — દ્વિગુણ શુભ' },
  'Lagna lord — always auspicious regardless of other lordships':
    { ta: 'லக்னாதிபதி — மற்ற அதிபத்தியங்களைப் பொருட்படுத்தாமல் எப்போதும் சுபம்', te: 'లగ్నాధిపతి — ఇతర అధిపత్యాలతో సంబంధం లేకుండా ఎల్లప్పుడూ శుభం', bn: 'লগ্নেশ — অন্য স্বামিত্ব নির্বিশেষে সর্বদা শুভ', kn: 'ಲಗ್ನಾಧಿಪತಿ — ಇತರ ಅಧಿಪತ್ಯಗಳ ಹೊರತಾಗಿಯೂ ಸದಾ ಶುಭ', gu: 'લગ્નેશ — અન્ય સ્વામિત્વથી નિરપેક્ષ, સદા શુભ' },

  // Varga chart meanings (kundali-calc.ts)
  'Wealth & financial prosperity':       { ta: 'செல்வம் & நிதி வளம்', te: 'సంపద & ఆర్థిక సమృద్ధి', bn: 'ধন ও আর্থিক সমৃদ্ধি', kn: 'ಸಂಪತ್ತು & ಆರ್ಥಿಕ ಸಮೃದ್ಧಿ', gu: 'ધન અને આર્થિક સમૃદ્ધિ' },
  'Siblings, courage & co-borns':        { ta: 'உடன்பிறப்புகள், தைரியம் & சகோதரர்கள்', te: 'సోదరులు, ధైర్యం & సహజాతులు', bn: 'ভাই-বোন, সাহস ও সহোদর', kn: 'ಒಡಹುಟ್ಟಿದವರು, ಧೈರ್ಯ & ಸಹೋದರರು', gu: 'ભાઈ-બહેન, સાહસ અને સહોદર' },
  'Property, fortune & fixed assets':    { ta: 'சொத்து, அதிர்ஷ்டம் & நிலையான சொத்துக்கள்', te: 'ఆస్తి, అదృష్టం & స్థిర ఆస్తులు', bn: 'সম্পত্তি, ভাগ্য ও স্থাবর সম্পদ', kn: 'ಆಸ್ತಿ, ಭಾಗ್ಯ & ಸ್ಥಿರ ಸ್ವತ್ತುಗಳು', gu: 'સંપત્તિ, ભાગ્ય અને સ્થાવર સંપદા' },
  'Fame, authority & spiritual merit':   { ta: 'புகழ், அதிகாரம் & ஆன்மீகப் புண்ணியம்', te: 'కీర్తి, అధికారం & పుణ్యం', bn: 'যশ, অধিকার ও পুণ্য', kn: 'ಕೀರ್ತಿ, ಅಧಿಕಾರ & ಪುಣ್ಯ', gu: 'યશ, અધિકાર અને પુણ્ય' },
  'Health, disease & enemies':           { ta: 'ஆரோக்கியம், நோய் & எதிரிகள்', te: 'ఆరోగ్యం, రోగం & శత్రువులు', bn: 'স্বাস্থ্য, রোগ ও শত্রু', kn: 'ಆರೋಗ್ಯ, ರೋಗ & ಶತ್ರುಗಳು', gu: 'સ્વાસ્થ્ય, રોગ અને શત્રુ' },
  'Children & progeny':                  { ta: 'குழந்தைகள் & சந்ததி', te: 'సంతానం & వంశవృద్ధి', bn: 'সন্তান ও বংশবৃদ্ধি', kn: 'ಮಕ್ಕಳು & ಸಂತತಿ', gu: 'સંતાન અને વંશવૃદ્ધિ' },
  'Longevity & unexpected events':       { ta: 'நீண்ட ஆயுள் & எதிர்பாராத நிகழ்வுகள்', te: 'దీర్ఘాయుష్షు & ఊహించని సంఘటనలు', bn: 'দীর্ঘায়ু ও অপ্রত্যাশিত ঘটনা', kn: 'ದೀರ್ಘಾಯುಷ್ಯ & ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳು', gu: 'દીર્ઘાયુ અને અણધારી ઘટનાઓ' },
  'Career, profession & public life':    { ta: 'தொழில், வாழ்வாதாரம் & பொது வாழ்க்கை', te: 'వృత్తి, ఉద్యోగం & సామాజిక జీవితం', bn: 'কর্মজীবন, পেশা ও সার্বজনীন জীবন', kn: 'ವೃತ್ತಿ, ಉದ್ಯೋಗ & ಸಾರ್ವಜನಿಕ ಜೀವನ', gu: 'કારકિર્દી, વ્યવસાય અને જાહેર જીવન' },
  'Parents, ancestry & lineage':         { ta: 'பெற்றோர், பூர்வீகம் & வம்சாவளி', te: 'తల్లిదండ్రులు, వంశావళి', bn: 'পিতা-মাতা, বংশাবলি', kn: 'ಹೆತ್ತವರು, ಪೂರ್ವಜರು & ವಂಶಾವಳಿ', gu: 'માતા-પિતા, વંશાવળી' },
  'Vehicles, comforts & luxuries':       { ta: 'வாகனங்கள், சுகம் & ஆடம்பரங்கள்', te: 'వాహనాలు, సుఖం & విలాసాలు', bn: 'বাহন, সুখ ও বিলাসিতা', kn: 'ವಾಹನಗಳು, ಸುಖ & ವಿಲಾಸ', gu: 'વાહન, સુખ અને વિલાસ' },
  'Spiritual progress & upasana':        { ta: 'ஆன்மீக முன்னேற்றம் & உபாசனை', te: 'ఆధ్యాత్మిక పురోగతి & ఉపాసన', bn: 'আধ্যাত্মিক প্রগতি ও উপাসনা', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಗತಿ & ಉಪಾಸನೆ', gu: 'આધ્યાત્મિક પ્રગતિ અને ઉપાસના' },
  'Education, learning & knowledge':     { ta: 'கல்வி, கற்றல் & ஞானம்', te: 'విద్య, అభ్యాసం & జ్ఞానం', bn: 'শিক্ষা, বিদ্যা ও জ্ঞান', kn: 'ಶಿಕ್ಷಣ, ವಿದ್ಯಾಭ್ಯಾಸ & ಜ್ಞಾನ', gu: 'શિક્ષણ, વિદ્યા અને જ્ઞાન' },
  'Strengths, vitality & stamina':       { ta: 'பலம், உயிர்ச்சக்தி & சகிப்புத்தன்மை', te: 'బలం, ఓజస్సు & సహనశక్తి', bn: 'বল, ওজ ও সহনশক্তি', kn: 'ಬಲ, ಓಜಸ್ಸು & ಸಹನಶಕ್ತಿ', gu: 'બળ, ઓજ અને સહનશક્તિ' },
  'Misfortunes, evils & suffering':      { ta: 'துர்பாக்கியம், தீமை & துன்பம்', te: 'దుర్భాగ్యం, పాపం & బాధ', bn: 'দুর্ভাগ্য, পাপ ও কষ্ট', kn: 'ದುರ್ಭಾಗ್ಯ, ಪಾಪ & ಕಷ್ಟ', gu: 'દુર્ભાગ્ય, પાપ અને કષ્ટ' },
  'Auspicious/inauspicious (maternal)':  { ta: 'சுபாசுபம் (தாய் வழி)', te: 'శుభాశుభ ప్రభావం (మాతృపక్షం)', bn: 'শুভাশুভ প্রভাব (মাতৃপক্ষ)', kn: 'ಶುಭಾಶುಭ ಪ್ರಭಾವ (ಮಾತೃಪಕ್ಷ)', gu: 'શુભાશુભ પ્રભાવ (માતૃપક્ષ)' },
  'General indications (paternal)':      { ta: 'பொதுக் குறிப்புகள் (தந்தை வழி)', te: 'సామాన్య సంకేతాలు (పితృపక్షం)', bn: 'সাধারণ সংকেত (পিতৃপক্ষ)', kn: 'ಸಾಮಾನ್ಯ ಸಂಕೇತಗಳು (ಪಿತೃಪಕ್ಷ)', gu: 'સામાન્ય સંકેત (પિતૃપક્ષ)' },
  'Past life karma & overall assessment': { ta: 'முற்பிறவி வினை & ஒட்டுமொத்த மதிப்பீடு', te: 'పూర్వజన్మ కర్మ & సమగ్ర మూల్యాంకనం', bn: 'পূর্বজন্ম কর্ম ও সমগ্র মূল্যায়ন', kn: 'ಪೂರ್ವಜನ್ಮ ಕರ್ಮ & ಸಮಗ್ರ ಮೌಲ್ಯಮಾಪನ', gu: 'પૂર્વજન્મ કર્મ અને સમગ્ર મૂલ્યાંકન' },

  // Jaimini career fields
  'government service, authority, administration':       { ta: 'அரசுப் பணி, அதிகாரம், நிர்வாகம்', te: 'ప్రభుత్వ సేవ, అధికారం, పరిపాలన', bn: 'সরকারি চাকরি, কর্তৃত্ব, প্রশাসন', kn: 'ಸರ್ಕಾರಿ ಸೇವೆ, ಅಧಿಕಾರ, ಆಡಳಿತ', gu: 'સરકારી સેવા, અધિકાર, વહીવટ' },
  'agriculture, food, water management, psychology':     { ta: 'விவசாயம், உணவு, நீர் மேலாண்மை, உளவியல்', te: 'వ్యవసాయం, ఆహారం, జల నిర్వహణ, మనోవిజ్ఞానం', bn: 'কৃষি, খাদ্য, জল ব্যবস্থাপনা, মনোবিজ্ঞান', kn: 'ಕೃಷಿ, ಆಹಾರ, ಜಲ ನಿರ್ವಹಣೆ, ಮನೋವಿಜ್ಞಾನ', gu: 'કૃષિ, ખાદ્ય, જળ વ્યવસ્થાપન, મનોવિજ્ઞાન' },
  'military, surgery, engineering, sports':              { ta: 'இராணுவம், அறுவை சிகிச்சை, பொறியியல், விளையாட்டு', te: 'సైన్యం, శస్త్రచికిత్స, ఇంజనీరింగ్, క్రీడలు', bn: 'সেনা, শল্যচিকিৎসা, প্রকৌশল, খেলা', kn: 'ಸೇನೆ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಎಂಜಿನಿಯರಿಂಗ್, ಕ್ರೀಡೆ', gu: 'સેના, શલ્ય ચિકિત્સા, એન્જિનિયરિંગ, રમતગમત' },
  'business, communications, publishing, accountancy':   { ta: 'வணிகம், தகவல் தொடர்பு, பதிப்பகம், கணக்கியல்', te: 'వ్యాపారం, సమాచారం, ప్రచురణ, అకౌంటింగ్', bn: 'ব্যবসা, যোগাযোগ, প্রকাশনা, হিসাবরক্ষণ', kn: 'ವ್ಯಾಪಾರ, ಸಂವಹನ, ಪ್ರಕಾಶನ, ಲೆಕ್ಕಪತ್ರ', gu: 'વ્યાપાર, સંચાર, પ્રકાશન, હિસાબી' },
  'law, teaching, philosophy, banking':                  { ta: 'சட்டம், கற்பித்தல், தத்துவம், வங்கியியல்', te: 'న్యాయం, బోధన, తత్వశాస్త్రం, బ్యాంకింగ్', bn: 'আইন, শিক্ষণ, দর্শন, ব্যাংকিং', kn: 'ಕಾನೂನು, ಬೋಧನೆ, ತತ್ವಶಾಸ್ತ್ರ, ಬ್ಯಾಂಕಿಂಗ್', gu: 'કાયદો, અધ્યાપન, દર્શન, બેંકિંગ' },
  'arts, entertainment, luxury goods, beauty':           { ta: 'கலை, பொழுதுபோக்கு, ஆடம்பரப் பொருட்கள், அழகு', te: 'కళలు, వినోదం, విలాసవస్తువులు, అందం', bn: 'কলা, বিনোদন, বিলাসিতা, সৌন্দর্য', kn: 'ಕಲೆ, ಮನೋರಂಜನೆ, ವಿಲಾಸ ವಸ್ತುಗಳು, ಸೌಂದರ್ಯ', gu: 'કલા, મનોરંજન, વિલાસી વસ્તુઓ, સૌંદર્ય' },
  'judiciary, engineering, mining, real estate':          { ta: 'நீதித்துறை, பொறியியல், சுரங்கம், ரியல் எஸ்டேட்', te: 'న్యాయవ్యవస్థ, ఇంజనీరింగ్, మైనింగ్, రియల్ ఎస్టేట్', bn: 'বিচারব্যবস্থা, প্রকৌশল, খনন, রিয়েল এস্টেট', kn: 'ನ್ಯಾಯಾಂಗ, ಎಂಜಿನಿಯರಿಂಗ್, ಗಣಿಗಾರಿಕೆ, ರಿಯಲ್ ಎಸ್ಟೇಟ್', gu: 'ન્યાયતંત્ર, એન્જિનિયરિંગ, ખનન, રિયલ એસ્ટેટ' },
};

// ── Regex-based replacement function ────────────────────────────────────────

function translateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // For each locale (ta, te, bn, kn, gu), find patterns like:
  //   ta: 'English text'  or  ta: `English text`
  // where the value is pure ASCII (English copy), and replace with the translation.

  for (const [en, translations] of Object.entries(SHORT)) {
    for (const [lang, translated] of Object.entries(translations)) {
      // Match:  lang: 'exactEnglish'  (with possible backtick or single/double quote)
      const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Try single-quoted
      const re1 = new RegExp(`${lang}: '${escaped}'`, 'g');
      const replacement1 = `${lang}: '${translated}'`;
      const before1 = content;
      content = content.replace(re1, replacement1);
      if (content !== before1) count += (before1.match(re1) || []).length;

      // Try backtick-quoted (for template literals like `Maraka (Death Inflictor)`)
      const re2 = new RegExp(`${lang}: \`${escaped}\``, 'g');
      const replacement2 = `${lang}: \`${translated}\``;
      const before2 = content;
      content = content.replace(re2, replacement2);
      if (content !== before2) count += (before2.match(re2) || []).length;
    }
  }

  for (const [en, translations] of Object.entries(PHRASES)) {
    for (const [lang, translated] of Object.entries(translations)) {
      const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re1 = new RegExp(`${lang}: '${escaped}'`, 'g');
      const replacement1 = `${lang}: '${translated}'`;
      const before1 = content;
      content = content.replace(re1, replacement1);
      if (content !== before1) count += (before1.match(re1) || []).length;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return count;
}

// ── Process all 6 files ────────────────────────────────────────────────────

const files = [
  'src/lib/tippanni/varga-tippanni.ts',
  'src/lib/tippanni/doshas-extended.ts',
  'src/lib/jaimini/jaimini-calc.ts',
  'src/lib/kundali/functional-nature.ts',
  'src/lib/kundali/tippanni-planets.ts',
  'src/lib/ephem/kundali-calc.ts',
];

let total = 0;
for (const f of files) {
  const fullPath = path.join(ROOT, f);
  const n = translateFile(fullPath);
  console.log(`  ${f}: ${n} replacements`);
  total += n;
}
console.log(`\nTotal: ${total} replacements across ${files.length} files`);
