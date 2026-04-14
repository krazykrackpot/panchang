'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/dashas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



const DASHA_PERIODS = [
  { planet: 'Ketu', planetHi: 'केतु', planetSa: 'केतुः', years: 7, color: '#9ca3af', nakshatras: 'Ashwini, Magha, Moola', nakshatrasHi: 'अश्विनी, मघा, मूल' },
  { planet: 'Venus', planetHi: 'शुक्र', planetSa: 'शुक्रः', years: 20, color: '#ec4899', nakshatras: 'Bharani, P.Phalguni, P.Ashadha', nakshatrasHi: 'भरणी, पू.फाल्गुनी, पू.आषाढ़ा' },
  { planet: 'Sun', planetHi: 'सूर्य', planetSa: 'सूर्यः', years: 6, color: '#f59e0b', nakshatras: 'Krittika, U.Phalguni, U.Ashadha', nakshatrasHi: 'कृत्तिका, उ.फाल्गुनी, उ.आषाढ़ा' },
  { planet: 'Moon', planetHi: 'चन्द्र', planetSa: 'चन्द्रः', years: 10, color: '#e2e8f0', nakshatras: 'Rohini, Hasta, Shravana', nakshatrasHi: 'रोहिणी, हस्त, श्रवण' },
  { planet: 'Mars', planetHi: 'मंगल', planetSa: 'मङ्गलः', years: 7, color: '#ef4444', nakshatras: 'Mrigashira, Chitra, Dhanishta', nakshatrasHi: 'मृगशिरा, चित्रा, धनिष्ठा' },
  { planet: 'Rahu', planetHi: 'राहु', planetSa: 'राहुः', years: 18, color: '#6366f1', nakshatras: 'Ardra, Swati, Shatabhisha', nakshatrasHi: 'आर्द्रा, स्वाती, शतभिषा' },
  { planet: 'Jupiter', planetHi: 'गुरु', planetSa: 'गुरुः', years: 16, color: '#f0d48a', nakshatras: 'Punarvasu, Vishakha, P.Bhadra', nakshatrasHi: 'पुनर्वसु, विशाखा, पू.भाद्रपद' },
  { planet: 'Saturn', planetHi: 'शनि', planetSa: 'शनिः', years: 19, color: '#3b82f6', nakshatras: 'Pushya, Anuradha, U.Bhadra', nakshatrasHi: 'पुष्य, अनुराधा, उ.भाद्रपद' },
  { planet: 'Mercury', planetHi: 'बुध', planetSa: 'बुधः', years: 17, color: '#22c55e', nakshatras: 'Ashlesha, Jyeshtha, Revati', nakshatrasHi: 'आश्लेषा, ज्येष्ठा, रेवती' },
];

const OTHER_DASHA_SYSTEMS = [
  {
    name: { en: 'Yogini Dasha', hi: 'योगिनी दशा', sa: 'योगिनीदशा' },
    cycle: '36 years',
    planets: '8',
    desc: { en: 'Uses 8 Yoginis (Mangala, Pingala, Dhanya, Bhramari, Bhadrika, Ulka, Siddha, Sankata) mapped to planets. Shorter cycle makes it effective for quick-results timing. Popular in North India.', hi: '8 योगिनियों का उपयोग — छोटा चक्र त्वरित फल समय निर्धारण के लिए प्रभावी। उत्तर भारत में लोकप्रिय।', sa: '8 योगिनीनां प्रयोगः — लघुचक्रं त्वरितफलकालनिर्धारणे प्रभावी।' },
    when: { en: 'Quick timing, North Indian tradition, when Vimshottari seems off', hi: 'त्वरित समय, उत्तर भारतीय परम्परा', sa: 'त्वरितकालनिर्धारणम्' },
  },
  {
    name: { en: 'Ashtottari Dasha', hi: 'अष्टोत्तरी दशा', sa: 'अष्टोत्तरीदशा' },
    cycle: '108 years',
    planets: '8 (excludes Ketu)',
    desc: { en: 'A 108-year cycle using 8 planets (Ketu excluded). Prescribed when Rahu is in a Kendra or Trikona from Lagna lord, or when birth is during Krishna Paksha daytime or Shukla Paksha nighttime.', hi: '108 वर्ष का चक्र, 8 ग्रह (केतु छोड़कर)। राहु लग्नेश से केन्द्र या त्रिकोण में हो तब विहित।', sa: '108 वर्षाणां चक्रं, 8 ग्रहाः (केतुः वर्जितः)।' },
    when: { en: 'Rahu in Kendra/Trikona from Lagna lord, specific birth-time conditions', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में', sa: 'राहुः लग्नेशात् केन्द्रे/त्रिकोणे' },
  },
  {
    name: { en: 'Chara Dasha (Jaimini)', hi: 'चर दशा (जैमिनी)', sa: 'चरदशा (जैमिनीया)' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'A sign-based (rashi) dasha from Jaimini system. Each sign runs for a period determined by its lord\'s distance from it. Uses Chara Karakas (variable significators) instead of fixed planetary rulers. Powerful for career and relationship timing.', hi: 'जैमिनी प्रणाली की राशि-आधारित दशा। प्रत्येक राशि उसके स्वामी की दूरी से निर्धारित अवधि तक चलती है। चर कारकों का प्रयोग।', sa: 'जैमिनीपद्धत्याः राश्याधारिता दशा।' },
    when: { en: 'Jaimini astrology, career/relationship predictions, sign-based analysis', hi: 'जैमिनी ज्योतिष, करियर/सम्बन्ध भविष्यवाणी', sa: 'जैमिनीज्योतिषम्, जीविका/सम्बन्धभविष्यवाणी' },
  },
  {
    name: { en: 'Kalachakra Dasha', hi: 'कालचक्र दशा', sa: 'कालचक्रदशा' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'An extremely complex sign-based dasha that moves in a serpentine (savya/apsavya) pattern through the zodiac. Considered highly accurate by scholars but difficult to compute manually. Based on the Moon\'s Navamsa position.', hi: 'अत्यन्त जटिल राशि-आधारित दशा जो सर्पाकार (सव्य/अपसव्य) पैटर्न में चलती है। विद्वानों द्वारा अत्यन्त सटीक माना जाता है।', sa: 'अत्यन्तजटिला राश्याधारिता दशा या सर्पाकारपद्धत्या चलति।' },
    when: { en: 'Advanced practitioners, when other systems give contradictory results', hi: 'उन्नत अभ्यासकर्ता, जब अन्य प्रणालियाँ विरोधाभासी परिणाम दें', sa: 'उन्नतप्रयोक्तारः' },
  },
];

const MAHADASHA_THEMES = [
  { planet: 'Ketu', planetHi: 'केतु', years: 7, color: '#9ca3af', themes: { en: 'Spiritual awakening, detachment, loss and letting go, past-life karma surfacing, sudden changes, isolation, research, occult interests. Often starts life with confusion about direction.', hi: 'आध्यात्मिक जागृति, वैराग्य, हानि, पूर्वजन्म कर्म, अचानक परिवर्तन, एकान्त, शोध, गूढ़ रुचियाँ।', sa: 'आध्यात्मिकजागरणम्, वैराग्यम्, हानिः, पूर्वजन्मकर्म, आकस्मिकपरिवर्तनानि, एकान्तम्, शोधः, गूढरुचयः।', mai: 'आध्यात्मिक जागृति, वैराग्य, हानि, पूर्वजन्म कर्म, अचानक परिवर्तन, एकान्त, शोध, गूढ़ रुचि।', mr: 'आध्यात्मिक जागृती, वैराग्य, हानी, पूर्वजन्म कर्म, अचानक बदल, एकांत, संशोधन, गूढ आवडी.', ta: 'ஆன்மீக விழிப்பு, பற்றின்மை, இழப்பு, முற்பிறவி கர்மா வெளிப்படுதல், திடீர் மாற்றங்கள், தனிமை, ஆராய்ச்சி, மறைமுக ஆர்வங்கள். பெரும்பாலும் திசை குழப்பத்துடன் வாழ்க்கை தொடங்கும்.', te: 'ఆధ్యాత్మిక మేల్కొలుపు, వైరాగ్యం, నష్టం, పూర్వజన్మ కర్మ బయటపడటం, ఆకస్మిక మార్పులు, ఏకాంతం, పరిశోధన, అతీంద్రియ ఆసక్తులు. తరచుగా దిశ గురించి గందరగోళంతో జీవితం ప్రారంభమవుతుంది.', bn: 'আধ্যাত্মিক জাগরণ, বৈরাগ্য, ক্ষতি, পূর্বজন্ম কর্ম প্রকাশ, আকস্মিক পরিবর্তন, নির্জনতা, গবেষণা, গূঢ় আগ্রহ। প্রায়ই দিকনির্দেশনার বিভ্রান্তি নিয়ে জীবন শুরু হয়।', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ, ವೈರಾಗ್ಯ, ನಷ್ಟ, ಪೂರ್ವಜನ್ಮ ಕರ್ಮ ಹೊರಹೊಮ್ಮುವಿಕೆ, ಆಕಸ್ಮಿಕ ಬದಲಾವಣೆಗಳು, ಏಕಾಂತ, ಸಂಶೋಧನೆ, ಅತೀಂದ್ರಿಯ ಆಸಕ್ತಿಗಳು. ಹೆಚ್ಚಾಗಿ ದಿಕ್ಕಿನ ಗೊಂದಲದೊಂದಿಗೆ ಜೀವನ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.', gu: 'આધ્યાત્મિક જાગૃતિ, વૈરાગ્ય, નુકશાન, પૂર્વજન્મ કર્મ પ્રગટ થવું, અચાનક ફેરફારો, એકાંત, સંશોધન, ગૂઢ રુચિઓ. ઘણીવાર દિશાના મૂંઝવણ સાથે જીવન શરૂ થાય છે.' } },
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, color: '#ec4899', themes: { en: 'Romance, marriage, luxury, artistic pursuits, vehicles, comfort, financial gains, beauty, partnerships. The longest Dasha — often defines the prime creative and romantic years.', hi: 'रोमांस, विवाह, विलास, कलात्मक गतिविधियाँ, वाहन, आराम, वित्तीय लाभ, सौन्दर्य। सबसे लम्बी दशा — प्रमुख रचनात्मक और रोमांटिक वर्षों को परिभाषित करती है।', sa: 'प्रणयः, विवाहः, विलासः, कलात्मकक्रियाः, वाहनानि, सुखम्, आर्थिकलाभः, सौन्दर्यम्। दीर्घतमा दशा — प्रमुखसृजनात्मकप्रणयवर्षाणि परिभाषयति।', mai: 'रोमांस, विवाह, विलास, कलात्मक गतिविधि, वाहन, आराम, आर्थिक लाभ, सौन्दर्य। सभसँ लम्बा दशा — प्रमुख रचनात्मक आ रोमांटिक वर्ष केँ परिभाषित करैत अछि।', mr: 'प्रणय, विवाह, विलास, कलात्मक कार्ये, वाहने, आराम, आर्थिक लाभ, सौंदर्य. सर्वात लांब दशा — प्रमुख सर्जनशील आणि रोमँटिक वर्षे परिभाषित करते.', ta: 'காதல், திருமணம், ஆடம்பரம், கலைப் பயிற்சிகள், வாகனங்கள், வசதி, நிதி ஆதாயங்கள், அழகு. நீண்ட திசை — முக்கிய படைப்பு மற்றும் காதல் ஆண்டுகளை வரையறுக்கிறது.', te: 'ప్రేమ, వివాహం, విలాసం, కళాత్మక కార్యక్రమాలు, వాహనాలు, సౌకర్యం, ఆర్థిక లాభాలు, అందం. అతి దీర్ఘ దశ — ప్రధాన సృజనాత్మక మరియు ప్రణయ సంవత్సరాలను నిర్వచిస్తుంది.', bn: 'প্রণয়, বিবাহ, বিলাসিতা, শিল্পকলা, যানবাহন, আরাম, আর্থিক লাভ, সৌন্দর্য। দীর্ঘতম দশা — প্রধান সৃজনশীল ও রোমান্টিক বছরগুলি নির্ধারণ করে।', kn: 'ಪ್ರೇಮ, ವಿವಾಹ, ವೈಭವ, ಕಲಾತ್ಮಕ ಚಟುವಟಿಕೆ, ವಾಹನ, ಸೌಕರ್ಯ, ಆರ್ಥಿಕ ಲಾಭ, ಸೌಂದರ್ಯ. ದೀರ್ಘ ದಶೆ — ಪ್ರಮುಖ ಸೃಜನಶೀಲ ಮತ್ತು ಪ್ರಣಯ ವರ್ಷಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.', gu: 'પ્રણય, લગ્ન, વૈભવ, કલાત્મક પ્રવૃત્તિ, વાહનો, આરામ, આર્થિક લાભ, સૌંદર્ય. સૌથી લાંબી દશા — મુખ્ય સર્જનાત્મક અને રોમેન્ટિક વર્ષો નક્કી કરે.' } },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, color: '#f59e0b', themes: { en: 'Career authority, government connections, father-related events, self-confidence, leadership, health vitality, ego development, recognition. Short but impactful.', hi: 'करियर अधिकार, सरकारी सम्पर्क, पिता सम्बन्धित घटनाएँ, आत्मविश्वास, नेतृत्व, स्वास्थ्य, मान्यता। छोटी लेकिन प्रभावशाली।', sa: 'वृत्त्यधिकारः, शासनसम्पर्कः, पितृसम्बन्धिघटनाः, आत्मविश्वासः, नायकत्वम्, स्वास्थ्यम्, मान्यता। लघ्वी किन्तु प्रभावशालिनी।', mai: 'करियर अधिकार, सरकारी सम्पर्क, पिता सम्बन्धित घटना, आत्मविश्वास, नेतृत्व, स्वास्थ्य, मान्यता। छोट मुदा प्रभावशाली।', mr: 'करिअर अधिकार, सरकारी संपर्क, वडिलांशी संबंधित घटना, आत्मविश्वास, नेतृत्व, आरोग्य, मान्यता. छोटी पण प्रभावशाली.', ta: 'தொழில் அதிகாரம், அரசு தொடர்புகள், தந்தை சம்பந்த நிகழ்வுகள், தன்னம்பிக்கை, தலைமை, ஆரோக்ய வீரியம், அங்கீகாரம். குறுகிய ஆனால் தாக்கமான.', te: 'వృత్తి అధికారం, ప్రభుత్వ సంబంధాలు, తండ్రి సంబంధిత సంఘటనలు, ఆత్మవిశ్వాసం, నాయకత్వం, ఆరోగ్య శక్తి, గుర్తింపు. చిన్నది కానీ ప్రభావవంతమైనది.', bn: 'কর্মজীবনে কর্তৃত্ব, সরকারি সংযোগ, পিতা-সংক্রান্ত ঘটনা, আত্মবিশ্বাস, নেতৃত্ব, স্বাস্থ্য প্রাণশক্তি, স্বীকৃতি। সংক্ষিপ্ত কিন্তু প্রভাবশালী।', kn: 'ವೃತ್ತಿ ಅಧಿಕಾರ, ಸರ್ಕಾರಿ ಸಂಪರ್ಕ, ತಂದೆ ಸಂಬಂಧಿತ ಘಟನೆ, ಆತ್ಮವಿಶ್ವಾಸ, ನಾಯಕತ್ವ, ಆರೋಗ್ಯ ಚೈತನ್ಯ, ಮನ್ನಣೆ. ಚಿಕ್ಕದು ಆದರೆ ಪ್ರಭಾವಶಾಲಿ.', gu: 'કારકિર્દી સત્તા, સરકારી સંબંધો, પિતા-સંબંધિત ઘટનાઓ, આત્મવિશ્વાસ, નેતૃત્વ, સ્વાસ્થ્ય ઊર્જા, માન્યતા. ટૂંકી પણ પ્રભાવશાળી.' } },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, color: '#e2e8f0', themes: { en: 'Emotional growth, mother-related events, mental peace (or disturbance if afflicted), travel, public life, nurturing, domestic changes, intuition development.', hi: 'भावनात्मक विकास, माता सम्बन्धित घटनाएँ, मानसिक शान्ति, यात्रा, सार्वजनिक जीवन, पोषण, घरेलू परिवर्तन, अन्तर्ज्ञान।', sa: 'भावनात्मकविकासः, मातृसम्बन्धिघटनाः, मानसिकशान्तिः, यात्रा, सार्वजनिकजीवनम्, पोषणम्, गार्हस्थ्यपरिवर्तनम्, अन्तर्ज्ञानम्।', mai: 'भावनात्मक विकास, माता सम्बन्धित घटना, मानसिक शान्ति, यात्रा, सार्वजनिक जीवन, पोषण, घरेलू परिवर्तन, अन्तर्ज्ञान।', mr: 'भावनात्मक विकास, आई-संबंधित घटना, मानसिक शांती, प्रवास, सार्वजनिक जीवन, पोषण, घरगुती बदल, अंतर्ज्ञान.', ta: 'உணர்ச்சி வளர்ச்சி, தாய் தொடர்பான நிகழ்வுகள், மன அமைதி (பாதிக்கப்பட்டால் கலக்கம்), பயணம், பொது வாழ்க்கை, பராமரிப்பு, வீட்டு மாற்றங்கள், உள்ளுணர்வு வளர்ச்சி.', te: 'భావోద్వేగ వృద్ధి, తల్లి సంబంధిత సంఘటనలు, మానసిక శాంతి (బాధితమైతే అశాంతి), ప్రయాణం, ప్రజా జీవితం, పోషణ, గృహ మార్పులు, అంతర్దృష్టి అభివృద్ధి.', bn: 'আবেগের বৃদ্ধি, মা-সংক্রান্ত ঘটনা, মানসিক শান্তি (পীড়িত হলে অশান্তি), ভ্রমণ, জনজীবন, পরিচর্যা, গৃহ পরিবর্তন, অন্তর্দৃষ্টি বিকাশ।', kn: 'ಭಾವನಾತ್ಮಕ ಬೆಳವಣಿಗೆ, ತಾಯಿ ಸಂಬಂಧಿತ ಘಟನೆ, ಮಾನಸಿಕ ಶಾಂತಿ (ಪೀಡಿತವಾದರೆ ಅಶಾಂತಿ), ಪ್ರಯಾಣ, ಸಾರ್ವಜನಿಕ ಜೀವನ, ಪೋಷಣೆ, ಮನೆ ಬದಲಾವಣೆ, ಅಂತಃಪ್ರಜ್ಞೆ ಬೆಳವಣಿಗೆ.', gu: 'ભાવનાત્મક વૃદ્ધિ, માતા-સંબંધિત ઘટનાઓ, માનસિક શાંતિ (પીડિત હોય તો અશાંતિ), પ્રવાસ, જાહેર જીવન, પરિચર્યા, ઘરના ફેરફારો, અંતર્જ્ઞાન વિકાસ.' } },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, color: '#ef4444', themes: { en: 'Property, land, siblings, courage, surgery, competition, physical energy, technical skills, disputes, construction. High-energy period with risk of accidents if afflicted.', hi: 'सम्पत्ति, भूमि, भाई-बहन, साहस, शल्य, प्रतियोगिता, शारीरिक ऊर्जा, तकनीकी कौशल, विवाद। उच्च-ऊर्जा काल।', sa: 'सम्पत्तिः, भूमिः, भ्रातृभगिन्यः, शौर्यम्, शल्यम्, प्रतियोगिता, शारीरिकोर्जा, तान्त्रिककौशलम्, विवादः। उच्चोर्जाकालः।', mai: 'सम्पत्ति, भूमि, भाय-बहिन, साहस, शल्य, प्रतियोगिता, शारीरिक ऊर्जा, तकनीकी कौशल, विवाद। उच्च-ऊर्जा काल।', mr: 'मालमत्ता, जमीन, भाऊ-बहीण, शौर्य, शस्त्रक्रिया, स्पर्धा, शारीरिक ऊर्जा, तांत्रिक कौशल्य, वाद. उच्च-ऊर्जा काळ.', ta: 'சொத்து, நிலம், உடன்பிறப்புகள், தைரியம், அறுவை சிகிச்சை, போட்டி, உடல் ஆற்றல், தொழில்நுட்ப திறன், தகராறுகள்.高 ஆற்றல் காலம், பாதிக்கப்பட்டால் விபத்து அபாயம்.', te: 'ఆస్తి, భూమి, తోబుట్టువులు, ధైర్యం, శస్త్రచికిత్స, పోటీ, శారీరక శక్తి, సాంకేతిక నైపుణ్యాలు, వివాదాలు. అధిక శక్తి కాలం, బాధితమైతే ప్రమాద ప్రమాదం.', bn: 'সম্পত্তি, জমি, ভাইবোন, সাহস, অস্ত্রোপচার, প্রতিযোগিতা, শারীরিক শক্তি, প্রযুক্তিগত দক্ষতা, বিবাদ। উচ্চ-শক্তি সময়কাল, পীড়িত হলে দুর্ঘটনার ঝুঁকি।', kn: 'ಆಸ್ತಿ, ಭೂಮಿ, ಒಡಹುಟ್ಟಿದವರು, ಧೈರ್ಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಸ್ಪರ್ಧೆ, ಶಾರೀರಿಕ ಶಕ್ತಿ, ತಾಂತ್ರಿಕ ಕೌಶಲ, ವಿವಾದ. ಉನ್ನತ-ಶಕ್ತಿ ಅವಧಿ, ಪೀಡಿತವಾದರೆ ಅಪಘಾತ ಅಪಾಯ.', gu: 'સંપત્તિ, જમીન, ભાઈ-બહેન, સાહસ, શસ્ત્રક્રિયા, સ્પર્ધા, શારીરિક ઊર્જા, ટેકનિકલ કુશળતા, વિવાદ. ઉચ્ચ-ઊર્જા સમયગાળો, પીડિત હોય તો દુર્ઘટના જોખમ.' } },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, color: '#6366f1', themes: { en: 'Foreign connections, unconventional paths, technology, obsessive desires, material ambition, illusions, sudden rise or fall, breaking taboos, innovation. Can give extraordinary worldly success or deep confusion.', hi: 'विदेश सम्पर्क, अपरम्परागत मार्ग, प्रौद्योगिकी, जुनूनी इच्छाएँ, भौतिक महत्वाकांक्षा, माया, अचानक उत्थान या पतन। असाधारण सांसारिक सफलता या गहरा भ्रम।', sa: 'विदेशसम्पर्कः, अपरम्परागतमार्गः, प्रौद्योगिकी, व्यसनेच्छाः, भौतिकमहत्त्वाकाङ्क्षा, माया, आकस्मिकोत्थानं पतनं वा। असाधारणसांसारिकसफलता गहनो भ्रमो वा।', mai: 'विदेश सम्पर्क, अपरम्परागत मार्ग, प्रौद्योगिकी, जुनूनी इच्छा, भौतिक महत्वाकांक्षा, माया, अचानक उत्थान वा पतन। असाधारण सांसारिक सफलता वा गहन भ्रम।', mr: 'विदेश संपर्क, अपारंपरिक मार्ग, तंत्रज्ञान, ध्यासग्रस्त इच्छा, भौतिक महत्त्वाकांक्षा, माया, अचानक उदय किंवा पतन. असाधारण सांसारिक यश किंवा खोल भ्रम.', ta: 'வெளிநாட்டு தொடர்புகள், வழக்கத்திற்கு மாறான பாதைகள், தொழில்நுட்பம், ஆவேச ஆசைகள், பொருள் லட்சியம், மாயை, திடீர் எழுச்சி அல்லது வீழ்ச்சி, விலக்கு மீறல், புதுமை. அசாதாரண உலக வெற்றி அல்லது ஆழ்ந்த குழப்பம் தரலாம்.', te: 'విదేశీ సంబంధాలు, అసాంప్రదాయ మార్గాలు, సాంకేతికత, వ్యామోహ కోరికలు, భౌతిక ఆకాంక్ష, భ్రమలు, ఆకస్మిక ఎదుగుదల లేదా పతనం, నిషేధ ఉల్లంఘన, ఆవిష్కరణ. అసాధారణ ప్రాపంచిక విజయం లేదా లోతైన గందరగోళం ఇవ్వవచ్చు.', bn: 'বিদেশী সংযোগ, অপ্রচলিত পথ, প্রযুক্তি, আচ্ছন্ন আকাঙ্ক্ষা, বৈষয়িক উচ্চাকাঙ্ক্ষা, মায়া, আকস্মিক উত্থান বা পতন, নিষেধ ভঙ্গ, উদ্ভাবন। অসাধারণ পার্থিব সাফল্য বা গভীর বিভ্রান্তি দিতে পারে।', kn: 'ವಿದೇಶಿ ಸಂಪರ್ಕ, ಅಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗ, ತಂತ್ರಜ್ಞಾನ, ವ್ಯಾಮೋಹ ಬಯಕೆ, ಭೌತಿಕ ಮಹತ್ವಾಕಾಂಕ್ಷೆ, ಭ್ರಮೆ, ಆಕಸ್ಮಿಕ ಏಳಿಗೆ ಅಥವಾ ಪತನ, ನಿಷೇಧ ಮುರಿಯುವಿಕೆ, ನಾವೀನ್ಯ. ಅಸಾಮಾನ್ಯ ಲೌಕಿಕ ಯಶಸ್ಸು ಅಥವಾ ಆಳ ಗೊಂದಲ ನೀಡಬಹುದು.', gu: 'વિદેશી સંબંધો, અપરંપરાગત માર્ગ, ટેકનોલોજી, ઘેલછા ઇચ્છાઓ, ભૌતિક મહત્વાકાંક્ષા, ભ્રમ, અચાનક ઉદય કે પતન, વર્જિત ભંગ, નવીનતા. અસાધારણ સાંસારિક સફળતા કે ઊંડી મૂંઝવણ આપી શકે.' } },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, color: '#f0d48a', themes: { en: 'Wisdom, children, education, dharma, wealth expansion, marriage (for women), spiritual growth, teaching, legal matters, optimism. Generally the most auspicious period.', hi: 'ज्ञान, संतान, शिक्षा, धर्म, धन विस्तार, विवाह (महिलाओं के लिए), आध्यात्मिक वृद्धि, शिक्षण। सामान्यतः सर्वाधिक शुभ काल।', sa: 'ज्ञानम्, सन्तानम्, शिक्षा, धर्मः, धनविस्तारः, विवाहः (स्त्रीणां कृते), आध्यात्मिकवृद्धिः, शिक्षणम्। सामान्यतः सर्वाधिकशुभकालः।', mai: 'ज्ञान, सन्तान, शिक्षा, धर्म, धन विस्तार, विवाह (महिलाक लेल), आध्यात्मिक वृद्धि, शिक्षण। सामान्यतः सर्वाधिक शुभ काल।', mr: 'ज्ञान, संतती, शिक्षण, धर्म, धन विस्तार, विवाह (स्त्रियांसाठी), आध्यात्मिक वाढ, अध्यापन. सामान्यतः सर्वात शुभ काळ.', ta: 'ஞானம், குழந்தைகள், கல்வி, தர்மம், செல்வ விரிவாக்கம், திருமணம் (பெண்களுக்கு), ஆன்மீக வளர்ச்சி, கற்பித்தல், சட்ட விஷயங்கள், நம்பிக்கை. பொதுவாக மிகவும் சுபமான காலம்.', te: 'జ్ఞానం, సంతానం, విద్య, ధర్మం, సంపద విస్తరణ, వివాహం (స్త్రీలకు), ఆధ్యాత్మిక వృద్ధి, బోధన, న్యాయ విషయాలు, ఆశావాదం. సాధారణంగా అత్యంత శుభ కాలం.', bn: 'জ্ঞান, সন্তান, শিক্ষা, ধর্ম, সম্পদ সম্প্রসারণ, বিবাহ (মহিলাদের জন্য), আধ্যাত্মিক বৃদ্ধি, শিক্ষাদান, আইনি বিষয়, আশাবাদ। সাধারণত সবচেয়ে শুভ সময়কাল।', kn: 'ಜ್ಞಾನ, ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಧರ್ಮ, ಸಂಪತ್ತು ವಿಸ್ತರಣೆ, ವಿವಾಹ (ಮಹಿಳೆಯರಿಗೆ), ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ, ಬೋಧನೆ, ಕಾನೂನು ವಿಷಯ, ಆಶಾವಾದ. ಸಾಮಾನ್ಯವಾಗಿ ಅತ್ಯಂತ ಶುಭ ಅವಧಿ.', gu: 'જ્ઞાન, સંતાન, શિક્ષણ, ધર્મ, સંપત્તિ વિસ્તરણ, લગ્ન (મહિલાઓ માટે), આધ્યાત્મિક વૃદ્ધિ, અધ્યાપન, કાનૂની બાબતો, આશાવાદ. સામાન્ય રીતે સૌથી શુભ સમયગાળો.' } },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, color: '#3b82f6', themes: { en: 'Hard work, discipline, career structure, service, longevity, chronic health matters, karma, delays that build character, responsibility, democratic values, justice. Slow but lasting results.', hi: 'कठिन परिश्रम, अनुशासन, करियर संरचना, सेवा, दीर्घायु, दीर्घकालिक स्वास्थ्य, कर्म, चरित्र निर्माण, उत्तरदायित्व। धीमे लेकिन स्थायी परिणाम।', sa: 'कठिनपरिश्रमः, अनुशासनम्, वृत्तिसंरचना, सेवा, दीर्घायुः, दीर्घकालिकस्वास्थ्यम्, कर्म, चरित्रनिर्माणम्, उत्तरदायित्वम्। मन्दानि किन्तु स्थायिफलानि।', mai: 'कठिन परिश्रम, अनुशासन, करियर संरचना, सेवा, दीर्घायु, दीर्घकालिक स्वास्थ्य, कर्म, चरित्र निर्माण, उत्तरदायित्व। धीमा मुदा स्थायी परिणाम।', mr: 'कठोर मेहनत, शिस्त, करिअर संरचना, सेवा, दीर्घायुष्य, दीर्घकालीन आरोग्य, कर्म, चारित्र्य निर्माण, जबाबदारी. मंद पण कायम टिकणारे निकाल.', ta: 'கடின உழைப்பு, ஒழுக்கம், தொழில் அமைப்பு, சேவை, நீண்ட ஆயுள், நாள்பட்ட உடல்நலம், கர்மா, குணத்தை உருவாக்கும் தாமதங்கள், பொறுப்பு, நீதி. மெதுவான ஆனால் நிலையான முடிவுகள்.', te: 'కఠిన శ్రమ, క్రమశిక్షణ, వృత్తి నిర్మాణం, సేవ, దీర్ఘాయువు, దీర్ఘకాలిక ఆరోగ్యం, కర్మ, వ్యక్తిత్వాన్ని నిర్మించే జాప్యాలు, బాధ్యత, న్యాయం. నెమ్మదిగా కానీ శాశ్వత ఫలితాలు.', bn: 'কঠোর পরিশ্রম, শৃঙ্খলা, কর্মজীবন কাঠামো, সেবা, দীর্ঘায়ু, দীর্ঘস্থায়ী স্বাস্থ্য, কর্ম, চরিত্র গড়ার বিলম্ব, দায়িত্ব, ন্যায়বিচার। ধীর কিন্তু স্থায়ী ফলাফল।', kn: 'ಕಠಿಣ ಪರಿಶ್ರಮ, ಶಿಸ್ತು, ವೃತ್ತಿ ಸಂರಚನೆ, ಸೇವೆ, ದೀರ್ಘಾಯುಷ್ಯ, ದೀರ್ಘಕಾಲಿಕ ಆರೋಗ್ಯ, ಕರ್ಮ, ವ್ಯಕ್ತಿತ್ವ ನಿರ್ಮಿಸುವ ವಿಳಂಬ, ಹೊಣೆ, ನ್ಯಾಯ. ನಿಧಾನ ಆದರೆ ಶಾಶ್ವತ ಫಲಿತಾಂಶ.', gu: 'સખત મહેનત, શિસ્ત, કારકિર્દી માળખું, સેવા, દીર્ઘાયુ, લાંબા ગાળાનું સ્વાસ્થ્ય, કર્મ, ચરિત્ર બનાવતો વિલંબ, જવાબદારી, ન્યાય. ધીમું પણ કાયમી પરિણામ.' } },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, color: '#22c55e', themes: { en: 'Business, commerce, communication, writing, learning, friendships, intellectual pursuits, adaptability, travel for education, maternal uncle. Period of mental agility and versatility.', hi: 'व्यापार, वाणिज्य, संवाद, लेखन, विद्या, मित्रता, बौद्धिक गतिविधियाँ, अनुकूलनशीलता। मानसिक चपलता और बहुमुखता का काल।', sa: 'वाणिज्यम्, सम्वादः, लेखनम्, विद्या, मैत्री, बौद्धिकक्रियाः, अनुकूलनशीलता। मानसिकचपलतायाः बहुमुखतायाश्च कालः।', mai: 'व्यापार, वाणिज्य, सम्वाद, लेखन, विद्या, मित्रता, बौद्धिक गतिविधि, अनुकूलनशीलता। मानसिक चपलता आ बहुमुखताक काल।', mr: 'व्यापार, वाणिज्य, संवाद, लेखन, विद्या, मैत्री, बौद्धिक कार्ये, अनुकूलनक्षमता. मानसिक चपळता आणि बहुमुखतेचा काळ.', ta: 'வணிகம், வர்த்தகம், தொடர்பு, எழுத்து, கற்றல், நட்பு, அறிவுப் பயிற்சிகள், தகவமைப்பு, கல்விப் பயணம், தாய்மாமா. மன சுறுசுறுப்பு மற்றும் பன்முகத்தன்மை காலம்.', te: 'వ్యాపారం, వాణిజ్యం, సంభాషణ, రచన, విద్య, స్నేహం, బుద్ధిపూర్వక కార్యకలాపాలు, అనుకూలత, విద్యా ప్రయాణం, మేనమామ. మానసిక చురుకుదనం మరియు బహుముఖ ప్రజ్ఞ కాలం.', bn: 'ব্যবসা, বাণিজ্য, যোগাযোগ, লেখালেখি, শিক্ষা, বন্ধুত্ব, বুদ্ধিবৃত্তিক সাধনা, অভিযোজনযোগ্যতা, শিক্ষামূলক ভ্রমণ, মাতুল। মানসিক তীক্ষ্ণতা ও বহুমুখিতার সময়কাল।', kn: 'ವ್ಯಾಪಾರ, ವಾಣಿಜ್ಯ, ಸಂವಹನ, ಬರವಣಿಗೆ, ಕಲಿಕೆ, ಸ್ನೇಹ, ಬೌದ್ಧಿಕ ಅನ್ವೇಷಣೆ, ಹೊಂದಾಣಿಕೆ, ಶೈಕ್ಷಣಿಕ ಪ್ರಯಾಣ, ಸೋದರ ಮಾವ. ಮಾನಸಿಕ ಚುರುಕುತನ ಮತ್ತು ಬಹುಮುಖತೆಯ ಅವಧಿ.', gu: 'વેપાર, વાણિજ્ય, સંવાદ, લેખન, શિક્ષણ, મિત્રતા, બૌદ્ધિક શોધ, અનુકૂલનક્ષમતા, શૈક્ષણિક પ્રવાસ, મામા. માનસિક ચપળતા અને બહુમુખીતાનો સમયગાળો.' } },
];

const VENUS_ANTARDASHA_EXAMPLE = [
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, duration: '(20x20)/120 = 3y 4m', durationHi: '(20x20)/120 = 3 वर्ष 4 माह' },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, duration: '(20x6)/120 = 1y 0m', durationHi: '(20x6)/120 = 1 वर्ष 0 माह' },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, duration: '(20x10)/120 = 1y 8m', durationHi: '(20x10)/120 = 1 वर्ष 8 माह' },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, duration: '(20x18)/120 = 3y 0m', durationHi: '(20x18)/120 = 3 वर्ष 0 माह' },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, duration: '(20x16)/120 = 2y 8m', durationHi: '(20x16)/120 = 2 वर्ष 8 माह' },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, duration: '(20x19)/120 = 3y 2m', durationHi: '(20x19)/120 = 3 वर्ष 2 माह' },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, duration: '(20x17)/120 = 2y 10m', durationHi: '(20x17)/120 = 2 वर्ष 10 माह' },
  { planet: 'Ketu', planetHi: 'केतु', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
];

const EVENT_TIMING = [
  { event: { en: 'Marriage', hi: 'विवाह', sa: 'विवाह', mai: 'विवाह', mr: 'विवाह', ta: 'திருமணம்', te: 'వివాహం', bn: 'বিবাহ', kn: 'ವಿವಾಹ', gu: 'વિવાહ' }, dashas: { en: 'Venus Dasha, Jupiter Dasha (for women), 7th lord Dasha, Venus Antardasha in any benefic Dasha', hi: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा', sa: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा', mai: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा', mr: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा', ta: 'சுக்கிர தசை, குரு தசை (பெண்களுக்கு), 7ம் அதிபதி தசை, எந்த சுப தசையிலும் சுக்கிர அந்தர்தசை', te: 'శుక్ర దశ, గురు దశ (స్త్రీలకు), 7వ అధిపతి దశ, ఏ శుభ దశలోనైనా శుక్ర అంతర్దశ', bn: 'শুক্র দশা, বৃহস্পতি দশা (মহিলাদের জন্য), সপ্তমেশ দশা, যেকোনো শুভ দশায় শুক্র অন্তর্দশা', kn: 'ಶುಕ್ರ ದಶೆ, ಗುರು ದಶೆ (ಮಹಿಳೆಯರಿಗೆ), 7ನೇ ಅಧಿಪತಿ ದಶೆ, ಯಾವುದೇ ಶುಭ ದಶೆಯಲ್ಲಿ ಶುಕ್ರ ಅಂತರ್ದಶೆ', gu: 'શુક્ર દશા, ગુરુ દશા (સ્ત્રીઓ માટે), 7મા અધિપતિ દશા, કોઈપણ શુભ દશામાં શુક્ર અંતર્દશા' }, color: '#ec4899' },
  { event: { en: 'Career Rise', hi: 'करियर उन्नति', sa: 'करियर उन्नति', mai: 'करियर उन्नति', mr: 'करियर उन्नति', ta: 'தொழில் உயர்வு', te: 'వృత్తి ఎదుగుదల', bn: 'কর্মজীবন উত্থান', kn: 'ವೃತ್ತಿ ಏರಿಕೆ', gu: 'કારકિર્દી ઉત્થાન' }, dashas: { en: 'Sun Dasha, Saturn Dasha (10th lord), 10th lord Dasha, Yogakaraka Dasha. Saturn-Sun or Sun-Saturn periods for government positions.', hi: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।', sa: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।', mai: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।', mr: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।', ta: 'சூரிய தசை, சனி தசை (10ம் அதிபதி), 10ம் அதிபதி தசை, யோககாரக தசை. அரசு பதவிகளுக்கு சனி-சூரிய அல்லது சூரிய-சனி காலங்கள்.', te: 'సూర్య దశ, శని దశ (10వ అధిపతి), 10వ అధిపతి దశ, యోగకారక దశ. ప్రభుత్వ పదవులకు శని-సూర్య లేదా సూర్య-శని కాలాలు.', bn: 'সূর্য দশা, শনি দশা (দশমেশ), দশমেশ দশা, যোগকারক দশা। সরকারি পদের জন্য শনি-সূর্য বা সূর্য-শনি কাল।', kn: 'ಸೂರ್ಯ ದಶೆ, ಶನಿ ದಶೆ (10ನೇ ಅಧಿಪತಿ), 10ನೇ ಅಧಿಪತಿ ದಶೆ, ಯೋಗಕಾರಕ ದಶೆ. ಸರ್ಕಾರಿ ಹುದ್ದೆಗಳಿಗೆ ಶನಿ-ಸೂರ್ಯ ಅಥವಾ ಸೂರ್ಯ-ಶನಿ ಅವಧಿಗಳು.', gu: 'સૂર્ય દશા, શનિ દશા (10મા અધિપતિ), 10મા અધિપતિ દશા, યોગકારક દશા. સરકારી પદો માટે શનિ-સૂર્ય અથવા સૂર્ય-શનિ સમયગાળા.' }, color: '#f59e0b' },
  { event: { en: 'Children', hi: 'संतान', sa: 'संतान', mai: 'संतान', mr: 'संतान', ta: 'குழந்தைகள்', te: 'సంతానం', bn: 'সন্তান', kn: 'ಮಕ್ಕಳು', gu: 'સંતાન' }, dashas: { en: 'Jupiter Dasha (primary karaka for children), 5th lord Dasha, Venus Antardasha in Jupiter Dasha, Putrakaraka Dasha (Jaimini).', hi: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।', sa: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।', mai: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।', mr: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।', ta: 'குரு தசை (குழந்தைகளுக்கான முதன்மை காரகம்), 5ம் அதிபதி தசை, குரு தசையில் சுக்கிர அந்தர்தசை, புத்ரகாரக தசை (ஜைமினி).', te: 'గురు దశ (సంతానానికి ప్రాథమిక కారకం), 5వ అధిపతి దశ, గురు దశలో శుక్ర అంతర్దశ, పుత్రకారక దశ (జైమిని).', bn: 'বৃহস্পতি দশা (সন্তানের প্রাথমিক কারক), পঞ্চমেশ দশা, বৃহস্পতি দশায় শুক্র অন্তর্দশা, পুত্রকারক দশা (জৈমিনি)।', kn: 'ಗುರು ದಶೆ (ಮಕ್ಕಳ ಪ್ರಾಥಮಿಕ ಕಾರಕ), 5ನೇ ಅಧಿಪತಿ ದಶೆ, ಗುರು ದಶೆಯಲ್ಲಿ ಶುಕ್ರ ಅಂತರ್ದಶೆ, ಪುತ್ರಕಾರಕ ದಶೆ (ಜೈಮಿನಿ).', gu: 'ગુરુ દશા (સંતાનનો પ્રાથમિક કારક), 5મા અધિપતિ દશા, ગુરુ દશામાં શુક્ર અંતર્દશા, પુત્રકારક દશા (જૈમિની).' }, color: '#f0d48a' },
  { event: { en: 'Education', hi: 'शिक्षा', sa: 'शिक्षा', mai: 'शिक्षा', mr: 'शिक्षा', ta: 'கல்வி', te: 'విద్య', bn: 'শিক্ষা', kn: 'ಶಿಕ್ಷಣ', gu: 'શિક્ષા' }, dashas: { en: 'Mercury Dasha, Jupiter Dasha, 4th/5th/9th lord Dasha. Higher education peaks during Jupiter periods; technical skills during Mercury or Mars.', hi: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।', sa: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।', mai: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।', mr: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।', ta: 'புதன் தசை, குரு தசை, 4/5/9ம் அதிபதி தசை. குரு காலங்களில் உயர்கல்வி உச்சம்; புதன் அல்லது செவ்வாய் காலத்தில் தொழில்நுட்ப திறன்கள்.', te: 'బుధ దశ, గురు దశ, 4/5/9వ అధిపతి దశ. గురు కాలాలలో ఉన్నత విద్య శిఖరం; బుధ లేదా కుజ కాలంలో సాంకేతిక నైపుణ్యాలు.', bn: 'বুধ দশা, বৃহস্পতি দশা, চতুর্থ/পঞ্চম/নবমেশ দশা। বৃহস্পতি কালে উচ্চশিক্ষা শীর্ষে; বুধ বা মঙ্গল কালে প্রযুক্তিগত দক্ষতা।', kn: 'ಬುಧ ದಶೆ, ಗುರು ದಶೆ, 4/5/9ನೇ ಅಧಿಪತಿ ದಶೆ. ಗುರು ಅವಧಿಗಳಲ್ಲಿ ಉನ್ನತ ಶಿಕ್ಷಣ ಉತ್ತುಂಗ; ಬುಧ ಅಥವಾ ಕುಜ ಅವಧಿಯಲ್ಲಿ ತಾಂತ್ರಿಕ ಕೌಶಲ.', gu: 'બુધ દશા, ગુરુ દશા, 4/5/9મા અધિપતિ દશા. ગુરુ સમયગાળામાં ઉચ્ચ શિક્ષણ ટોચ પર; બુધ અથવા મંગળ સમયે ટેકનિકલ કુશળતા.' }, color: '#22c55e' },
  { event: { en: 'Foreign Travel/Settlement', hi: 'विदेश यात्रा/बसना', sa: 'विदेश यात्रा/बसना', mai: 'विदेश यात्रा/बसना', mr: 'विदेश यात्रा/बसना', ta: 'வெளிநாட்டு பயணம்/குடியேற்றம்', te: 'విదేశీ ప్రయాణం/స్థిరపడటం', bn: 'বিদেশ ভ্রমণ/বসতি', kn: 'ವಿದೇಶ ಪ್ರಯಾಣ/ನೆಲೆಸುವಿಕೆ', gu: 'વિદેશ યાત્રા/વસવાટ' }, dashas: { en: 'Rahu Dasha (primary), 12th lord Dasha, Moon Dasha (if 12th lord or in 12th), Ketu Dasha for spiritual pilgrimages abroad.', hi: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।', sa: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।', mai: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।', mr: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।', ta: 'ராகு தசை (முதன்மை), 12ம் அதிபதி தசை, சந்திர தசை (12ம் அதிபதி அல்லது 12ல் இருந்தால்), ஆன்மீக யாத்திரைகளுக்கு கேது தசை.', te: 'రాహు దశ (ప్రాథమిక), 12వ అధిపతి దశ, చంద్ర దశ (12వ అధిపతి లేదా 12లో ఉంటే), ఆధ్యాత్మిక తీర్థయాత్రలకు కేతు దశ.', bn: 'রাহু দশা (প্রাথমিক), দ্বাদশেশ দশা, চন্দ্র দশা (দ্বাদশেশ বা দ্বাদশে থাকলে), আধ্যাত্মিক তীর্থযাত্রায় কেতু দশা।', kn: 'ರಾಹು ದಶೆ (ಪ್ರಾಥಮಿಕ), 12ನೇ ಅಧಿಪತಿ ದಶೆ, ಚಂದ್ರ ದಶೆ (12ನೇ ಅಧಿಪತಿ ಅಥವಾ 12ರಲ್ಲಿದ್ದರೆ), ಆಧ್ಯಾತ್ಮಿಕ ತೀರ್ಥಯಾತ್ರೆಗಳಿಗೆ ಕೇತು ದಶೆ.', gu: 'રાહુ દશા (પ્રાથમિક), 12મા અધિપતિ દશા, ચંદ્ર દશા (12મા અધિપતિ અથવા 12માં હોય તો), આધ્યાત્મિક યાત્રાઓ માટે કેતુ દશા.' }, color: '#6366f1' },
  { event: { en: 'Health Crisis', hi: 'स्वास्थ्य संकट', sa: 'स्वास्थ्य संकट', mai: 'स्वास्थ्य संकट', mr: 'स्वास्थ्य संकट', ta: 'ஆரோக்கிய நெருக்கடி', te: 'ఆరోగ్య సంక్షోభం', bn: 'স্বাস্থ্য সংকট', kn: 'ಆರೋಗ್ಯ ಬಿಕ್ಕಟ್ಟು', gu: 'આરોગ્ય સંકટ' }, dashas: { en: 'Dasha of planets in 6th/8th house, Dasha of debilitated planets, Saturn Dasha (chronic conditions), Mars Dasha (surgery, accidents), Ketu Dasha (mysterious ailments).', hi: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।', sa: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।', mai: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।', mr: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।', ta: '6/8ம் வீட்டில் உள்ள கிரகங்களின் தசை, நீசக் கிரகங்களின் தசை, சனி தசை (நாள்பட்ட நிலைமைகள்), செவ்வாய் தசை (அறுவை சிகிச்சை, விபத்துகள்), கேது தசை (மர்மமான நோய்கள்).', te: '6/8వ భావంలోని గ్రహాల దశ, నీచ గ్రహాల దశ, శని దశ (దీర్ఘకాలిక పరిస్థితులు), కుజ దశ (శస్త్రచికిత్స, ప్రమాదాలు), కేతు దశ (రహస్యమైన వ్యాధులు).', bn: 'ষষ্ঠ/অষ্টম ভাবে গ্রহের দশা, নীচ গ্রহের দশা, শনি দশা (দীর্ঘস্থায়ী অবস্থা), মঙ্গল দশা (অস্ত্রোপচার, দুর্ঘটনা), কেতু দশা (রহস্যময় অসুস্থতা)।', kn: '6/8ನೇ ಭಾವದಲ್ಲಿನ ಗ್ರಹಗಳ ದಶೆ, ನೀಚ ಗ್ರಹಗಳ ದಶೆ, ಶನಿ ದಶೆ (ದೀರ್ಘಕಾಲಿಕ ಪರಿಸ್ಥಿತಿಗಳು), ಕುಜ ದಶೆ (ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಅಪಘಾತಗಳು), ಕೇತು ದಶೆ (ರಹಸ್ಯ ಕಾಯಿಲೆಗಳು).', gu: '6/8મા ભાવમાં ગ્રહોની દશા, નીચ ગ્રહોની દશા, શનિ દશા (ક્રોનિક સ્થિતિઓ), મંગળ દશા (શસ્ત્રક્રિયા, અકસ્માતો), કેતુ દશા (રહસ્યમય બીમારીઓ).' }, color: '#ef4444' },
];

export default function LearnDashasPage() {
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const locale = useLocale();
  const isHi = isIndicLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Dasa" meaning="Planetary Period" />
        <SanskritTermCard term="Maha Dasha" devanagari="महादशा" transliteration="Mahadasa" meaning="Major Period (years)" />
        <SanskritTermCard term="Antardasha" devanagari="अन्तर्दशा" transliteration="Antardasa" meaning="Sub-period (months)" />
        <SanskritTermCard term="Pratyantara" devanagari="प्रत्यन्तर" transliteration="Pratyantara" meaning="Sub-sub-period (days)" />
        <SanskritTermCard term="Vimshottari" devanagari="विंशोत्तरी" transliteration="Vimsottari" meaning="Of 120 (years)" />
      </div>

      {/* Section 1: What is a Dasha */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p style={bodyFont}>{t('whatContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent2')}</p>
      </LessonSection>

      {/* Section 2: Vimshottari System */}
      <LessonSection number={2} title={t('vimshottariTitle')}>
        <p style={bodyFont}>{t('vimshottariContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('vimshottariContent2')}</p>

        {/* Dasha periods visual bar chart */}
        <div className="mt-6 space-y-2">
          {DASHA_PERIODS.map((d, i) => (
            <motion.div
              key={d.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-20 text-right text-sm font-semibold" style={{ color: d.color }}>
                {!isIndicLocale(locale) ? d.planet : d.planetHi}
              </div>
              <div
                className="h-8 rounded-md flex items-center px-3 text-xs font-mono text-white/80"
                style={{
                  width: `${(d.years / 20) * 100}%`,
                  minWidth: '60px',
                  backgroundColor: `${d.color}33`,
                  border: `1px solid ${d.color}55`,
                }}
              >
                {d.years} {!isIndicLocale(locale) ? 'yrs' : 'वर्ष'}
              </div>
              <div className="text-text-secondary/75 text-xs hidden sm:block">
                {isHi ? d.nakshatrasHi : d.nakshatras}
              </div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/70 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {!isIndicLocale(locale) ? 'years' : 'वर्ष'}
          </div>
        </div>
      </LessonSection>

      {/* Section 3: Full reference table */}
      <LessonSection number={3} title={t('birthNakshatraTitle')}>
        <p style={bodyFont}>{t('birthNakshatraContent')}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Years' : 'वर्ष'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Ruling Nakshatras (1-9)' : 'शासित नक्षत्र (1-9)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? '(10-18)' : '(10-18)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? '(19-27)' : '(19-27)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {DASHA_PERIODS.map((d) => {
                const naks = d.nakshatras.split(', ');
                return (
                  <tr key={d.planet} className="hover:bg-gold-primary/3">
                    <td className="py-2 px-2 font-medium" style={{ color: d.color }}>
                      {!isIndicLocale(locale) ? d.planet : d.planetHi}
                    </td>
                    <td className="py-2 px-2 text-text-secondary font-mono">{d.years}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[0]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[1]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 4: Calculating Dasha Balance */}
      <LessonSection number={4} title={t('calcTitle')}>
        <p style={bodyFont}>{t('calcContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Step-by-Step Calculation:' : 'चरणबद्ध गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {!isIndicLocale(locale) ? 'Find Moon\'s Nakshatra at birth (e.g., Pushya)' : 'जन्म के समय चन्द्र का नक्षत्र ज्ञात करें (जैसे, पुष्य)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {!isIndicLocale(locale) ? 'Nakshatra lord = Dasha lord at birth (Pushya lord = Saturn)' : 'नक्षत्र स्वामी = जन्म पर दशा स्वामी (पुष्य स्वामी = शनि)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {!isIndicLocale(locale) ? 'Moon\'s progress through Nakshatra = elapsed portion of Dasha' : 'नक्षत्र में चन्द्र की प्रगति = दशा का बीता हुआ भाग'}</p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">
            {!isIndicLocale(locale) ? 'Example: Moon at 10° in Pushya (3°20\' to 16°40\')' : 'उदाहरण: पुष्य में चन्द्र 10° पर (3°20\' से 16°40\')'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {!isIndicLocale(locale) ? 'Progress = (10° - 3.333°) / 13.333° = 50%' : 'प्रगति = (10° - 3.333°) / 13.333° = 50%'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {!isIndicLocale(locale) ? 'Remaining Saturn Dasha = 19 × (1 - 0.50) = 9.5 years' : 'शेष शनि दशा = 19 × (1 - 0.50) = 9.5 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Worked example */}
      <LessonSection number={5} title={t('workedExampleTitle')}>
        <p style={bodyFont}>{t('workedExampleContent')}</p>
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <p className="text-gold-light font-mono text-sm mb-3">
              {!isIndicLocale(locale) ? 'Given: Moon at 14°30\' Aries (Mesha)' : 'दिया गया: मेष में चन्द्र 14°30\' पर'}
            </p>
            <div className="space-y-1.5 text-gold-light/80 font-mono text-xs">
              <p>{!isIndicLocale(locale) ? 'Step 1: Identify Nakshatra' : 'चरण 1: नक्षत्र पहचानें'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? '14°30\' Aries falls in Bharani (13°20\' - 26°40\' Aries)' : '14°30\' मेष भरणी में आता है (13°20\' - 26°40\' मेष)'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 2: Nakshatra lord' : 'चरण 2: नक्षत्र स्वामी'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Bharani lord = Venus → Birth Dasha = Venus Maha Dasha' : 'भरणी स्वामी = शुक्र → जन्म दशा = शुक्र महादशा'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 3: Calculate progress through Nakshatra' : 'चरण 3: नक्षत्र में प्रगति गणना'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Moon position within Bharani = 14°30\' - 13°20\' = 1°10\' = 1.167°' : 'भरणी में चन्द्र स्थिति = 14°30\' - 13°20\' = 1°10\' = 1.167°'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Nakshatra span = 13°20\' = 13.333°' : 'नक्षत्र विस्तार = 13°20\' = 13.333°'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Progress = 1.167 / 13.333 = 8.75% elapsed' : 'प्रगति = 1.167 / 13.333 = 8.75% बीता'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 4: Calculate remaining Dasha' : 'चरण 4: शेष दशा गणना'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Venus total = 20 years' : 'शुक्र कुल = 20 वर्ष'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Remaining = 20 × (1 - 0.0875) = 18.25 years = 18 years 3 months' : 'शेष = 20 × (1 - 0.0875) = 18.25 वर्ष = 18 वर्ष 3 माह'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 5: Sequence after Venus' : 'चरण 5: शुक्र के बाद का क्रम'}</p>
              <p className="pl-4 text-gold-light/60">{locale === 'en'
                ? 'Venus (18y 3m remaining) → Sun (6y) → Moon (10y) → Mars (7y) → Rahu (18y) → Jupiter (16y) → Saturn (19y) → Mercury (17y) → Ketu (7y)'
                : 'शुक्र (18 वर्ष 3 माह शेष) → सूर्य (6) → चन्द्र (10) → मंगल (7) → राहु (18) → गुरु (16) → शनि (19) → बुध (17) → केतु (7)'}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Sub-periods hierarchy */}
      <LessonSection number={6} title={t('subTitle')}>
        <p style={bodyFont}>{t('subContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('subContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Antardasha Duration Formula:' : 'अन्तर्दशा अवधि सूत्र:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Antardasha of B in Maha Dasha of A = (Years_A x Years_B) / 120
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Example: Mercury Antardasha in Saturn Maha Dasha = (19 x 17) / 120 = 2.69 years ~ 2 yrs 8 months 9 days'
              : 'उदाहरण: शनि महादशा में बुध अन्तर्दशा = (19 x 17) / 120 = 2.69 वर्ष ~ 2 वर्ष 8 माह 9 दिन'}
          </p>
        </div>

        {/* Sub-period hierarchy visual */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { level: { en: 'Maha Dasha', hi: 'महादशा', sa: 'महादशा', mai: 'महादशा', mr: 'महादशा', ta: 'மகா தசா', te: 'మహాదశ', bn: 'মহাদশা', kn: 'ಮಹಾದಶಾ', gu: 'મહાદશા' }, duration: { en: 'Years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'வருடங்கள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષો' }, example: { en: 'Saturn: 19 years', hi: 'शनि: 19 वर्ष', sa: 'शनि: 19 वर्ष', mai: 'शनि: 19 वर्ष', mr: 'शनि: 19 वर्ष', ta: 'சனி: 19 ஆண்டுகள்', te: 'శని: 19 సంవత్సరాలు', bn: 'শনি: ১৯ বছর', kn: 'ಶನಿ: 19 ವರ್ಷ', gu: 'શનિ: 19 વર્ષ' }, color: 'border-gold-primary/30 bg-gold-primary/5' },
            { level: { en: 'Antardasha', hi: 'अन्तर्दशा', sa: 'अन्तर्दशा', mai: 'अन्तर्दशा', mr: 'अन्तर्दशा', ta: 'அந்தர்தசா', te: 'అంతర్దశ', bn: 'অন্তর্দশা', kn: 'ಅಂತರ್ದಶಾ', gu: 'અંતર્દશા' }, duration: { en: 'Months', hi: 'माह', sa: 'माह', mai: 'माह', mr: 'माह', ta: 'மாதங்கள்', te: 'నెలలు', bn: 'মাস', kn: 'ತಿಂಗಳುಗಳು', gu: 'મહિનાઓ' }, example: { en: 'Sa-Me: 2y 8m', hi: 'शनि-बुध: 2 वर्ष 8 माह', sa: 'शनि-बुध: 2 वर्ष 8 माह', mai: 'शनि-बुध: 2 वर्ष 8 माह', mr: 'शनि-बुध: 2 वर्ष 8 माह', ta: 'ச-பு: 2வ 8மா', te: 'శ-బు: 2సం 8నె', bn: 'শ-বু: 2ব 8মা', kn: 'ಶ-ಬು: 2ವ 8ತಿ', gu: 'શ-બુ: 2વ 8મ' }, color: 'border-blue-400/30 bg-blue-400/5' },
            { level: { en: 'Pratyantara', hi: 'प्रत्यन्तर', sa: 'प्रत्यन्तर', mai: 'प्रत्यन्तर', mr: 'प्रत्यन्तर', ta: 'ப்ரத்யந்தர தசா', te: 'ప్రత్యంతర దశ', bn: 'প্রত্যন্তর দশা', kn: 'ಪ್ರತ್ಯಂತರ ದಶಾ', gu: 'પ્રત્યંતર દશા' }, duration: { en: 'Weeks', hi: 'सप्ताह', sa: 'सप्ताह', mai: 'सप्ताह', mr: 'सप्ताह', ta: 'வாரங்கள்', te: 'వారాలు', bn: 'সপ্তাহ', kn: 'ವಾರಗಳು', gu: 'સપ્તાહો' }, example: { en: 'Sa-Me-Ve: ~5m', hi: 'शनि-बुध-शुक्र: ~5 माह', sa: 'शनि-बुध-शुक्र: ~5 माह', mai: 'शनि-बुध-शुक्र: ~5 माह', mr: 'शनि-बुध-शुक्र: ~5 माह', ta: 'ச-பு-சு: ~5மா', te: 'శ-బు-శు: ~5నె', bn: 'শ-বু-শু: ~5মা', kn: 'ಶ-ಬು-ಶು: ~5ತಿ', gu: 'શ-બુ-શુ: ~5મ' }, color: 'border-violet-400/30 bg-violet-400/5' },
            { level: { en: 'Sookshma', hi: 'सूक्ष्म', sa: 'सूक्ष्म', mai: 'सूक्ष्म', mr: 'सूक्ष्म', ta: 'சூக்ஷ்ம தசா', te: 'సూక్ష్మ దశ', bn: 'সূক্ষ্ম দশা', kn: 'ಸೂಕ್ಷ್ಮ ದಶಾ', gu: 'સૂક્ષ્મ દશા' }, duration: { en: 'Days', hi: 'दिन', sa: 'दिन', mai: 'दिन', mr: 'दिन', ta: 'நாட்கள்', te: 'రోజులు', bn: 'দিন', kn: 'ದಿನಗಳು', gu: 'દિવસો' }, example: { en: '~2-10 days', hi: '~2-10 दिन', sa: '~2-10 दिन', mai: '~2-10 दिन', mr: '~2-10 दिन', ta: '~2-10 days', te: '~2-10 days', bn: '~2-10 days', kn: '~2-10 days', gu: '~2-10 days' }, color: 'border-emerald-400/30 bg-emerald-400/5' },
            { level: { en: 'Prana', hi: 'प्राण', sa: 'प्राण', mai: 'प्राण', mr: 'प्राण', ta: 'பிராணன்', te: 'ప్రాణం', bn: 'প্রাণ', kn: 'ಪ್ರಾಣ', gu: 'પ્રાણ' }, duration: { en: 'Hours', hi: 'घण्टे', sa: 'घण्टे', mai: 'घण्टे', mr: 'घण्टे', ta: 'மணி', te: 'గంటలు', bn: 'ঘণ্টা', kn: 'ಗಂಟೆಗಳು', gu: 'કલાકો' }, example: { en: '~hours', hi: '~घण्टे', sa: '~घण्टे', mai: '~घण्टे', mr: '~घण्टे', ta: '~hours', te: '~hours', bn: '~hours', kn: '~hours', gu: '~hours' }, color: 'border-amber-400/30 bg-amber-400/5' },
          ].map((item, i) => (
            <motion.div
              key={item.level.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-lg p-3 border ${item.color}`}
            >
              <div className="text-gold-light text-xs font-bold mb-1" style={headingFont}>{isHi ? item.level.hi : item.level.en}</div>
              <div className="text-text-secondary text-xs font-mono">{isHi ? item.duration.hi : item.duration.en}</div>
              <div className="text-text-tertiary text-xs mt-1">{isHi ? item.example.hi : item.example.en}</div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 7: Other Dasha Systems */}
      <LessonSection number={7} title={t('otherTitle')}>
        <p style={bodyFont}>{t('otherContent')}</p>
        <div className="mt-4 space-y-3">
          {OTHER_DASHA_SYSTEMS.map((sys, i) => (
            <motion.div
              key={sys.name.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-bold text-sm" style={headingFont}>{tObj(sys.name)}</span>
                <span className="text-text-tertiary text-xs font-mono">{sys.cycle} / {sys.planets} {!isIndicLocale(locale) ? 'planets' : 'ग्रह'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(sys.desc)}</p>
              <div className="mt-2 text-xs text-emerald-400/80 font-mono">
                {!isIndicLocale(locale) ? 'Best used when: ' : 'सर्वोत्तम उपयोग: '}{tObj(sys.when)}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Interpretation */}
      <LessonSection number={8} title={t('interpretTitle')} variant="highlight">
        <p style={bodyFont}>{t('interpretContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: { en: 'Benefic Dasha Lord in Kendra/Trikona', hi: 'शुभ दशा स्वामी केन्द्र/त्रिकोण में', sa: 'शुभदशास्वामी केन्द्रे/त्रिकोणे' }, result: { en: 'Prosperity, success, good health', hi: 'समृद्धि, सफलता, अच्छा स्वास्थ्य', sa: 'समृद्धिः, सफलता, सुस्वास्थ्यम्' }, color: 'emerald' },
            { label: { en: 'Dasha Lord in Dusthana (6,8,12)', hi: 'दशा स्वामी दुःस्थान (6,8,12) में', sa: 'दशास्वामी दुःस्थाने (6,8,12)' }, result: { en: 'Challenges, health issues, obstacles', hi: 'कठिनाइयाँ, स्वास्थ्य समस्याएँ, बाधाएँ', sa: 'कठिनतायाः, स्वास्थ्यसमस्याः, बाधाः' }, color: 'red' },
            { label: { en: 'Dasha Lord exalted or in own sign', hi: 'दशा स्वामी उच्च या स्वराशि में', sa: 'दशास्वामी उच्चे स्वराशौ वा' }, result: { en: 'Enhanced positive results', hi: 'उन्नत शुभ परिणाम', sa: 'उन्नतशुभफलानि' }, color: 'emerald' },
            { label: { en: 'Dasha Lord debilitated or combust', hi: 'दशा स्वामी नीच या अस्त', sa: 'दशास्वामी नीचे अस्ते वा' }, result: { en: 'Weakened results, delays', hi: 'कमज़ोर परिणाम, देरी', sa: 'दुर्बलफलानि, विलम्बः' }, color: 'amber' },
            { label: { en: 'Yogakaraka Dasha (owns Kendra + Trikona)', hi: 'योगकारक दशा (केन्द्र + त्रिकोण स्वामी)', sa: 'योगकारकदशा (केन्द्र + त्रिकोणस्वामी)' }, result: { en: 'Raja Yoga results — power, wealth, status', hi: 'राजयोग फल — शक्ति, धन, प्रतिष्ठा', sa: 'राजयोगफलानि — शक्तिः, धनं, प्रतिष्ठा' }, color: 'emerald' },
            { label: { en: 'Maha Dasha & Antardasha lords are enemies', hi: 'महादशा और अन्तर्दशा स्वामी शत्रु', sa: 'महादशा-अन्तर्दशास्वामिनौ शत्रू' }, result: { en: 'Internal conflict, contradictory events', hi: 'आन्तरिक संघर्ष, विरोधाभासी घटनाएँ', sa: 'आन्तरिकसंघर्षः, विरोधाभासीघटनाः' }, color: 'red' },
          ].map((item) => {
            const colorClasses: Record<string, string> = {
              emerald: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400',
              amber: 'border-amber-400/20 bg-amber-400/5 text-amber-400',
              red: 'border-red-400/20 bg-red-400/5 text-red-400',
            };
            const cls = colorClasses[item.color] || colorClasses.amber;
            return (
            <div key={item.label.en} className={`rounded-lg p-3 border ${cls.split(' ').slice(0, 2).join(' ')}`}>
              <div className={`${cls.split(' ')[2]} text-sm font-semibold mb-1`} style={headingFont}>{tObj(item.label)}</div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{tObj(item.result)}</div>
            </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 9: When to use which system */}
      <LessonSection number={9} title={t('preferenceTitle')}>
        <div className="space-y-3">
          {[
            { system: { en: 'Vimshottari', hi: 'विंशोत्तरी', sa: 'विंशोत्तरी', mai: 'विंशोत्तरी', mr: 'विंशोत्तरी', ta: 'விம்சோத்தரி', te: 'విమ్శోత్తరి', bn: 'বিংশোত্তরী', kn: 'ವಿಂಶೋತ್ತರಿ', gu: 'વિંશોત્તરી' }, condition: { en: 'Default system for all charts. Use unless specific conditions warrant another system. Works best when Moon is strong and well-placed.', hi: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।', sa: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।', mai: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।', mr: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।', ta: 'அனைத்து ஜாதகங்களுக்கும் இயல்புநிலை முறை. குறிப்பிட்ட நிபந்தனைகள் மற்றொரு முறையை நியாயப்படுத்தாத வரை பயன்படுத்தவும். சந்திரன் வலுவாகவும் நல்ல நிலையிலும் இருக்கும்போது சிறப்பாக செயல்படும்.', te: 'అన్ని చార్టులకు డిఫాల్ట్ వ్యవస్థ. నిర్దిష్ట పరిస్థితులు మరొక వ్యవస్థను సమర్థించకపోతే వాడండి. చంద్రుడు బలంగా మరియు మంచి స్థానంలో ఉన్నప్పుడు బాగా పనిచేస్తుంది.', bn: 'সমস্ত চার্টের জন্য ডিফল্ট পদ্ধতি। নির্দিষ্ট শর্ত অন্য পদ্ধতি সমর্থন না করলে ব্যবহার করুন। চন্দ্র শক্তিশালী ও সুস্থিত হলে সবচেয়ে ভালো কাজ করে।', kn: 'ಎಲ್ಲಾ ಚಾರ್ಟ್‌ಗಳಿಗೆ ಡೀಫಾಲ್ಟ್ ವ್ಯವಸ್ಥೆ. ನಿರ್ದಿಷ್ಟ ಪರಿಸ್ಥಿತಿಗಳು ಇನ್ನೊಂದು ವ್ಯವಸ್ಥೆಯನ್ನು ಸಮರ್ಥಿಸದಿದ್ದರೆ ಬಳಸಿ. ಚಂದ್ರ ಬಲವಾಗಿ ಮತ್ತು ಉತ್ತಮ ಸ್ಥಾನದಲ್ಲಿದ್ದಾಗ ಉತ್ತಮವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.', gu: 'બધા ચાર્ટ માટે ડિફોલ્ટ પ્રણાલી. ચોક્કસ શરતો બીજી પ્રણાલીને ન્યાયસંગત ન બનાવે ત્યાં સુધી વાપરો. ચંદ્ર મજબૂત અને સારી સ્થિતિમાં હોય ત્યારે શ્રેષ્ઠ કાર્ય કરે છે.' }, color: '#f0d48a' },
            { system: { en: 'Yogini', hi: 'योगिनी', sa: 'योगिनी', mai: 'योगिनी', mr: 'योगिनी', ta: 'யோகினி', te: 'యోగిని', bn: 'যোগিনী', kn: 'ಯೋಗಿನಿ', gu: 'યોગિની' }, condition: { en: 'Cross-verify Vimshottari predictions. Shorter 36-year cycle catches micro-timing that Vimshottari may miss. Use as secondary confirmation.', hi: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।', sa: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।', mai: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।', mr: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।', ta: 'விம்சோத்தரி கணிப்புகளை குறுக்கு-சரிபார்ப்பு செய்யவும். குறுகிய 36-வருட சுழற்சி விம்சோத்தரி தவறவிடக்கூடிய நுண்-நேரத்தை பிடிக்கிறது. இரண்டாம் நிலை உறுதிப்படுத்தலாக பயன்படுத்தவும்.', te: 'విమ్శోత్తరి అంచనాలను క్రాస్-వెరిఫై చేయండి. చిన్న 36-సంవత్సర చక్రం విమ్శోత్తరి తప్పించుకోగల సూక్ష్మ-సమయాన్ని పట్టుకుంటుంది. ద్వితీయ నిర్ధారణగా వాడండి.', bn: 'বিংশোত্তরী পূর্বাভাস ক্রস-ভেরিফাই করুন। সংক্ষিপ্ত 36-বছরের চক্র বিংশোত্তরী মিস করতে পারে এমন মাইক্রো-টাইমিং ধরে। দ্বিতীয় নিশ্চিতকরণ হিসাবে ব্যবহার করুন।', kn: 'ವಿಂಶೋತ್ತರಿ ಭವಿಷ್ಯವಾಣಿಗಳನ್ನು ಅಡ್ಡ-ಪರಿಶೀಲಿಸಿ. ಚಿಕ್ಕ 36-ವರ್ಷದ ಚಕ್ರ ವಿಂಶೋತ್ತರಿ ತಪ್ಪಿಸಬಹುದಾದ ಸೂಕ್ಷ್ಮ-ಸಮಯವನ್ನು ಹಿಡಿಯುತ್ತದೆ. ದ್ವಿತೀಯ ದೃಢೀಕರಣವಾಗಿ ಬಳಸಿ.', gu: 'વિંશોત્તરી આગાહીઓને ક્રોસ-વેરિફાય કરો. ટૂંકું 36-વર્ષનું ચક્ર વિંશોત્તરી ચૂકી શકે તેવી સૂક્ષ્મ-ટાઈમિંગ પકડે છે. દ્વિતીયક પુષ્ટિ તરીકે વાપરો.' }, color: '#ec4899' },
            { system: { en: 'Ashtottari', hi: 'अष्टोत्तरी', sa: 'अष्टोत्तरी', mai: 'अष्टोत्तरी', mr: 'अष्टोत्तरी', ta: 'அஷ்டோத்தரி', te: 'అష్టోత్తరి', bn: 'অষ্টোত্তরী', kn: 'ಅಷ್ಟೋತ್ತರಿ', gu: 'અષ્ટોત્તરી' }, condition: { en: 'When Rahu is in Kendra/Trikona from Lagna lord, or the person is born during Krishna Paksha daytime / Shukla Paksha nighttime.', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।', sa: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।', mai: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।', mr: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।', ta: 'ராகு லக்னாதிபதியிலிருந்து கேந்திர/திரிகோணத்தில் இருக்கும்போது, அல்லது நபர் கிருஷ்ண பக்ஷ பகல் / சுக்ல பக்ஷ இரவில் பிறந்திருக்கும்போது.', te: 'రాహు లగ్నాధిపతి నుండి కేంద్ర/త్రికోణంలో ఉన్నప్పుడు, లేదా వ్యక్తి కృష్ణ పక్ష పగలు / శుక్ల పక్ష రాత్రి పుట్టినప్పుడు.', bn: 'রাহু লগ্নাধিপতি থেকে কেন্দ্র/ত্রিকোণে থাকলে, অথবা ব্যক্তি কৃষ্ণ পক্ষ দিবা / শুক্ল পক্ষ রাত্রিতে জন্মগ্রহণ করলে।', kn: 'ರಾಹು ಲಗ್ನಾಧಿಪತಿಯಿಂದ ಕೇಂದ್ರ/ತ್ರಿಕೋಣದಲ್ಲಿರುವಾಗ, ಅಥವಾ ವ್ಯಕ್ತಿ ಕೃಷ್ಣ ಪಕ್ಷ ಹಗಲು / ಶುಕ್ಲ ಪಕ್ಷ ರಾತ್ರಿ ಹುಟ್ಟಿದಾಗ.', gu: 'રાહુ લગ્નાધિપતિથી કેન્દ્ર/ત્રિકોણમાં હોય ત્યારે, અથવા વ્યક્તિ કૃષ્ણ પક્ષ દિવસે / શુક્લ પક્ષ રાત્રે જન્મ્યા હોય ત્યારે.' }, color: '#6366f1' },
            { system: { en: 'Chara (Jaimini)', hi: 'चर (जैमिनी)', sa: 'चर (जैमिनी)', mai: 'चर (जैमिनी)', mr: 'चर (जैमिनी)', ta: 'சர (ஜைமினி)', te: 'చర (జైమిని)', bn: 'চর (জৈমিনি)', kn: 'ಚರ (ಜೈಮಿನಿ)', gu: 'ચર (જૈમિની)' }, condition: { en: 'For career/relationship timing and when using Jaimini techniques (Chara Karakas, Padas). Best for event-specific predictions like marriage or job change.', hi: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।', sa: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।', mai: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।', mr: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।', ta: 'தொழில்/உறவு நேரத்திற்கும் ஜைமினி நுட்பங்களை (சர காரகங்கள், பாதங்கள்) பயன்படுத்தும்போதும். திருமணம் அல்லது வேலை மாற்றம் போன்ற நிகழ்வு-குறிப்பிட்ட கணிப்புகளுக்கு சிறந்தது.', te: 'వృత్తి/సంబంధ సమయం కోసం మరియు జైమిని పద్ధతులు (చర కారకాలు, పాదాలు) వాడేటప్పుడు. వివాహం లేదా ఉద్యోగ మార్పు వంటి సంఘటన-నిర్దిష్ట అంచనాలకు ఉత్తమం.', bn: 'কর্মজীবন/সম্পর্কের সময়ের জন্য এবং জৈমিনি কৌশল (চর কারক, পদ) ব্যবহার করার সময়। বিবাহ বা চাকরি পরিবর্তনের মতো ঘটনা-নির্দিষ্ট পূর্বাভাসের জন্য সেরা।', kn: 'ವೃತ್ತಿ/ಸಂಬಂಧ ಸಮಯಕ್ಕೆ ಮತ್ತು ಜೈಮಿನಿ ತಂತ್ರಗಳನ್ನು (ಚರ ಕಾರಕಗಳು, ಪಾದಗಳು) ಬಳಸುವಾಗ. ಮದುವೆ ಅಥವಾ ಉದ್ಯೋಗ ಬದಲಾವಣೆಯಂತಹ ಘಟನೆ-ನಿರ್ದಿಷ್ಟ ಭವಿಷ್ಯವಾಣಿಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.', gu: 'કારકિર્દી/સંબંધ ટાઈમિંગ માટે અને જૈમિની તકનીકો (ચર કારક, પદ) વાપરતી વખતે. લગ્ન અથવા નોકરી બદલવા જેવી ઘટના-વિશિષ્ટ આગાહીઓ માટે શ્રેષ્ઠ.' }, color: '#22c55e' },
          ].map((item) => (
            <div key={item.system.en} className="flex gap-3 items-start">
              <div className="w-24 flex-shrink-0 text-sm font-bold text-right pt-0.5" style={{ color: item.color }}>
                {isHi ? item.system.hi : item.system.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? item.condition.hi : item.condition.en}
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 10: Finding Your Current Dasha */}
      <LessonSection number={10} title={t('findYourTitle')}>
        <p style={bodyFont}>{t('findYourContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('findYourContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'How to find it:' : 'कैसे खोजें:'}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>1. {!isIndicLocale(locale) ? 'Go to /kundali and enter your birth details' : '/kundali पर जाएँ और जन्म विवरण दर्ज करें'}</p>
            <p>2. {!isIndicLocale(locale) ? 'Click on the "Dashas" tab in the results' : 'परिणामों में "दशा" टैब पर क्लिक करें'}</p>
            <p>3. {!isIndicLocale(locale) ? 'The highlighted row is your current Maha Dasha' : 'हाइलाइट पंक्ति आपकी वर्तमान महादशा है'}</p>
            <p>4. {!isIndicLocale(locale) ? 'Expand it to see Antardashas — the highlighted sub-row is your current Antardasha' : 'इसे विस्तार करें अन्तर्दशाएँ देखने के लिए — हाइलाइट उप-पंक्ति आपकी वर्तमान अन्तर्दशा है'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 11: Antardasha Calculation */}
      <LessonSection number={11} title={t('antardashaCalcTitle')}>
        <p style={bodyFont}>{t('antardashaCalcContent')}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {!isIndicLocale(locale) ? 'Venus Maha Dasha (20 years) — All 9 Antardashas' : 'शुक्र महादशा (20 वर्ष) — सभी 9 अन्तर्दशाएँ'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Antardasha' : 'अन्तर्दशा'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Calculation' : 'गणना'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {VENUS_ANTARDASHA_EXAMPLE.map((ad) => (
                <tr key={ad.planet} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-medium text-text-secondary">
                    {!isIndicLocale(locale) ? `Venus-${ad.planet}` : `शुक्र-${ad.planetHi}`}
                  </td>
                  <td className="py-2 px-2 text-text-secondary font-mono">
                    {isHi ? ad.durationHi : ad.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs font-mono">
            {!isIndicLocale(locale) ? 'Total: 3y4m + 1y + 1y8m + 1y2m + 3y + 2y8m + 3y2m + 2y10m + 1y2m = 20 years' : 'कुल: 3वर्ष4माह + 1वर्ष + 1वर्ष8माह + 1वर्ष2माह + 3वर्ष + 2वर्ष8माह + 3वर्ष2माह + 2वर्ष10माह + 1वर्ष2माह = 20 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 12: Maha Dasha Themes */}
      <LessonSection number={12} title={t('mahadashaThemesTitle')}>
        <p style={bodyFont}>{t('mahadashaThemesContent')}</p>
        <div className="mt-4 space-y-3">
          {MAHADASHA_THEMES.map((md, i) => (
            <motion.div
              key={md.planet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: md.color }} />
                <span className="font-bold text-sm" style={{ color: md.color, ...headingFont }}>
                  {isHi ? md.planetHi : md.planet}
                </span>
                <span className="text-text-tertiary text-xs font-mono">{md.years} {!isIndicLocale(locale) ? 'years' : 'वर्ष'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {isHi ? md.themes.hi : md.themes.en}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 13: Dasha Sandhi */}
      <LessonSection number={13} title={t('sandhiTitle')} variant="highlight">
        <p style={bodyFont}>{t('sandhiContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('sandhiContent2')}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { from: { en: 'Jupiter → Saturn', hi: 'गुरु → शनि', sa: 'गुरु → शनि', mai: 'गुरु → शनि', mr: 'गुरु → शनि', ta: 'குரு → சனி', te: 'గురు → శని', bn: 'বৃহস্পতি → শনি', kn: 'ಗುರು → ಶನಿ', gu: 'ગુરુ → શનિ' }, friction: { en: 'High', hi: 'उच्च', sa: 'उच्च', mai: 'उच्च', mr: 'उच्च', ta: 'உயர்', te: 'అధికం', bn: 'উচ্চ', kn: 'ಹೆಚ್ಚು', gu: 'ઉચ્ચ' }, desc: { en: 'Expansion → contraction. Optimism to reality check. Career restructuring.', hi: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।', sa: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।', mai: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।', mr: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।', ta: 'விரிவாக்கம் → சுருக்கம். நம்பிக்கை முதல் யதார்த்தப் பரிசோதனை வரை. தொழில் மறுசீரமைப்பு.', te: 'విస్తరణ → సంకోచం. ఆశావాదం నుండి వాస్తవ తనిఖీ వరకు. వృత్తి పునర్నిర్మాణం.', bn: 'সম্প্রসারণ → সংকোচন। আশাবাদ থেকে বাস্তবতা যাচাই। কর্মজীবন পুনর্গঠন।', kn: 'ವಿಸ್ತರಣೆ → ಸಂಕೋಚನ. ಆಶಾವಾದದಿಂದ ವಾಸ್ತವ ಪರಿಶೀಲನೆ. ವೃತ್ತಿ ಪುನರ್ರಚನೆ.', gu: 'વિસ્તરણ → સંકોચન. આશાવાદથી વાસ્તવિકતા ચકાસણી. કારકિર્દી પુનર્ગઠન.' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Venus → Sun', hi: 'शुक्र → सूर्य', sa: 'शुक्र → सूर्य', mai: 'शुक्र → सूर्य', mr: 'शुक्र → सूर्य', ta: 'சுக்கிரன் → சூரியன்', te: 'శుక్ర → సూర్య', bn: 'শুক্র → সূর্য', kn: 'ಶುಕ್ರ → ಸೂರ್ಯ', gu: 'શુક્ર → સૂર્ય' }, friction: { en: 'High', hi: 'उच्च', sa: 'उच्च', mai: 'उच्च', mr: 'उच्च', ta: 'உயர்', te: 'అధికం', bn: 'উচ্চ', kn: 'ಹೆಚ್ಚು', gu: 'ઉચ્ચ' }, desc: { en: 'Pleasure → duty. Partnership focus to individual authority. Lifestyle shift.', hi: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।', sa: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।', mai: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।', mr: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।', ta: 'இன்பம் → கடமை. கூட்டாண்மை கவனம் முதல் தனிப்பட்ட அதிகாரம் வரை. வாழ்க்கைமுறை மாற்றம்.', te: 'ఆనందం → కర్తవ్యం. భాగస్వామ్య దృష్టి నుండి వ్యక్తిగత అధికారం వరకు. జీవనశైలి మార్పు.', bn: 'আনন্দ → কর্তব্য। অংশীদারিত্ব ফোকাস থেকে ব্যক্তিগত কর্তৃত্ব। জীবনধারা পরিবর্তন।', kn: 'ಆನಂದ → ಕರ್ತವ್ಯ. ಸಹಭಾಗಿತ್ವ ಗಮನದಿಂದ ವೈಯಕ್ತಿಕ ಅಧಿಕಾರಕ್ಕೆ. ಜೀವನಶೈಲಿ ಬದಲಾವಣೆ.', gu: 'આનંદ → ફરજ. ભાગીદારી ધ્યાનથી વ્યક્તિગત સત્તા સુધી. જીવનશૈલી પરિવર્તન.' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Saturn → Mercury', hi: 'शनि → बुध', sa: 'शनि → बुध', mai: 'शनि → बुध', mr: 'शनि → बुध', ta: 'சனி → புதன்', te: 'శని → బుధ', bn: 'শনি → বুধ', kn: 'ಶನಿ → ಬುಧ', gu: 'શનિ → બુધ' }, friction: { en: 'Medium', hi: 'मध्यम', sa: 'मध्यम', mai: 'मध्यम', mr: 'मध्यम', ta: 'மத்திய', te: 'మధ్యమం', bn: 'মধ্যম', kn: 'ಮಧ್ಯಮ', gu: 'મધ્યમ' }, desc: { en: 'Heavy → light. Slow and deep to fast and versatile. Relief period.', hi: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।', sa: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।', mai: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।', mr: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।', ta: 'கனம் → லேசு. மெதுவும் ஆழமும் முதல் வேகமும் பன்முகமும் வரை. நிவாரண காலம்.', te: 'భారం → తేలిక. నెమ్మదిగా మరియు లోతుగా నుండి వేగంగా మరియు బహుముఖంగా. ఉపశమన కాలం.', bn: 'ভারী → হালকা। ধীর ও গভীর থেকে দ্রুত ও বহুমুখী। স্বস্তির কাল।', kn: 'ಭಾರ → ಹಗುರ. ನಿಧಾನ ಮತ್ತು ಆಳದಿಂದ ವೇಗ ಮತ್ತು ಬಹುಮುಖಕ್ಕೆ. ಪರಿಹಾರ ಅವಧಿ.', gu: 'ભારે → હળવું. ધીમું અને ઊંડું થી ઝડપી અને બહુમુખી. રાહતનો સમયગાળો.' }, color: 'border-amber-400/20 bg-amber-400/5' },
            { from: { en: 'Mercury → Ketu', hi: 'बुध → केतु', sa: 'बुध → केतु', mai: 'बुध → केतु', mr: 'बुध → केतु', ta: 'புதன் → கேது', te: 'బుధ → కేతు', bn: 'বুধ → কেতু', kn: 'ಬುಧ → ಕೇತು', gu: 'બુધ → કેતુ' }, friction: { en: 'High', hi: 'उच्च', sa: 'उच्च', mai: 'उच्च', mr: 'उच्च', ta: 'உயர்', te: 'అధికం', bn: 'উচ্চ', kn: 'ಹೆಚ್ಚು', gu: 'ઉચ્ચ' }, desc: { en: 'Rational → mystical. Worldly activity to spiritual withdrawal. Confusion possible.', hi: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।', sa: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।', mai: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।', mr: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।', ta: 'பகுத்தறிவு → ஆன்மீக. உலக செயல்பாடு முதல் ஆன்மீக விலகல் வரை. குழப்பம் ஏற்படலாம்.', te: 'హేతుబద్ధం → ఆధ్యాత్మికం. ప్రాపంచిక కార్యకలాపం నుండి ఆధ్యాత్మిక ఉపసంహరణ వరకు. గందరగోళం సాధ్యం.', bn: 'যুক্তিসঙ্গত → আধ্যাত্মিক। পার্থিব কর্মকাণ্ড থেকে আধ্যাত্মিক প্রত্যাহার। বিভ্রান্তি সম্ভব।', kn: 'ತರ್ಕಬದ್ಧ → ಅತೀಂದ್ರಿಯ. ಲೌಕಿಕ ಚಟುವಟಿಕೆಯಿಂದ ಆಧ್ಯಾತ್ಮಿಕ ಹಿಂತೆಗೆತಕ್ಕೆ. ಗೊಂದಲ ಸಾಧ್ಯ.', gu: 'તર્કસંગત → આધ્યાત્મિક. ભૌતિક પ્રવૃત્તિથી આધ્યાત્મિક નિવૃત્તિ સુધી. મૂંઝવણ શક્ય.' }, color: 'border-red-400/20 bg-red-400/5' },
          ].map((item) => (
            <div key={item.from.en} className={`rounded-lg p-3 border ${item.color}`}>
              <div className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
                {isHi ? item.from.hi : item.from.en}
              </div>
              <div className="text-text-tertiary text-xs font-mono mb-1">
                {!isIndicLocale(locale) ? `Friction: ${item.friction.en}` : `घर्षण: ${item.friction.hi}`}
              </div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{isHi ? item.desc.hi : item.desc.en}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 14: Event Timing */}
      <LessonSection number={14} title={t('eventTimingTitle')}>
        <p style={bodyFont}>{t('eventTimingContent')}</p>
        <div className="mt-4 space-y-3">
          {EVENT_TIMING.map((et, i) => (
            <motion.div
              key={et.event.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 items-start"
            >
              <div className="w-28 flex-shrink-0 text-right text-sm font-bold pt-0.5" style={{ color: et.color, ...headingFont }}>
                {isHi ? et.event.hi : et.event.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? et.dashas.hi : et.dashas.en}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 15: Related modules */}
      <LessonSection number={15} title={t('modulesTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/11-1', label: { en: 'Lesson 11-1: Vimshottari Dasha System', hi: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली', sa: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली', mai: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली', mr: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली', ta: 'பாடம் 11-1: விம்சோத்தரி தசா முறை', te: 'పాఠం 11-1: విమ్శోత్తరి దశ వ్యవస్థ', bn: 'পাঠ ১১-১: বিংশোত্তরী দশা পদ্ধতি', kn: 'ಪಾಠ 11-1: ವಿಂಶೋತ್ತರಿ ದಶಾ ವ್ಯವಸ್ಥೆ', gu: 'પાઠ 11-1: વિંશોત્તરી દશા પદ્ધતિ' } },
            { href: '/learn/modules/11-2', label: { en: 'Lesson 11-2: Antardasha & Pratyantardasha', hi: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा', sa: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा', mai: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा', mr: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा', ta: 'பாடம் 11-2: அந்தர்தசா & ப்ரத்யந்தர்தசா', te: 'పాఠం 11-2: అంతర్దశ & ప్రత్యంతర్దశ', bn: 'পাঠ ১১-২: অন্তর্দশা ও প্রত্যন্তর্দশা', kn: 'ಪಾಠ 11-2: ಅಂತರ್ದಶಾ & ಪ್ರತ್ಯಂತರ್ದಶಾ', gu: 'પાઠ 11-2: અંતર્દશા અને પ્રત્યંતર્દશા' } },
            { href: '/learn/modules/11-3', label: { en: 'Lesson 11-3: Advanced Dasha Interpretation', hi: 'पाठ 11-3: उन्नत दशा व्याख्या', sa: 'पाठ 11-3: उन्नत दशा व्याख्या', mai: 'पाठ 11-3: उन्नत दशा व्याख्या', mr: 'पाठ 11-3: उन्नत दशा व्याख्या', ta: 'பாடம் 11-3: மேம்பட்ட தசா விளக்கம்', te: 'పాఠం 11-3: ఆధునిక దశ వ్యాఖ్యానం', bn: 'পাঠ ১১-৩: উন্নত দশা ব্যাখ্যা', kn: 'ಪಾಠ 11-3: ಮುಂದುವರಿದ ದಶಾ ವ್ಯಾಖ್ಯಾನ', gu: 'પાઠ 11-3: ઉન્નત દશા અર્થઘટન' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')} →
        </Link>
      </div>
    </div>
  );
}
