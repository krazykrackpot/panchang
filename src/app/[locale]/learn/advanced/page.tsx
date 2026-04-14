'use client';


import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/advanced.json';

const TOOLS_GRID = [
  { name: { en: 'Varshaphal', hi: 'वर्षफल', sa: 'वर्षफलम्' }, link: '/varshaphal', desc: { en: 'Annual predictions from solar return', hi: 'सौर प्रत्यावर्तन से वार्षिक भविष्यवाणी', sa: 'सौरप्रत्यावर्तनात् वार्षिकभविष्यवाणी' }, color: '#f59e0b' },
  { name: { en: 'KP System', hi: 'KP प्रणाली', sa: 'KP पद्धतिः' }, link: '/kp-system', desc: { en: 'Sub-lord based precise analysis', hi: 'उप-स्वामी आधारित सटीक विश्लेषण', sa: 'उपस्वामिआधारितसूक्ष्मविश्लेषणम्' }, color: '#3b82f6' },
  { name: { en: 'Prashna', hi: 'प्रश्न', sa: 'प्रश्नः' }, link: '/prashna', desc: { en: 'Horary chart for specific questions', hi: 'विशिष्ट प्रश्नों के लिए होररी कुण्डली', sa: 'विशिष्टप्रश्नानां होररीकुण्डली' }, color: '#8b5cf6' },
  { name: { en: 'Ashtamangala', hi: 'अष्टमंगल', sa: 'अष्टमङ्गलम्' }, link: '/prashna-ashtamangala', desc: { en: 'Kerala divination tradition', hi: 'केरल भविष्यवाणी परम्परा', sa: 'केरलभविष्यवाणीपरम्परा' }, color: '#ec4899' },
  { name: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्त AI' }, link: '/muhurta-ai', desc: { en: 'AI-scored auspicious time finder', hi: 'AI-अंकित शुभ समय खोजक', sa: 'AI-अङ्कितशुभसमयान्वेषकः' }, color: '#22c55e' },
  { name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढेसाती' }, link: '/sade-sati', desc: { en: 'Saturn transit analysis', hi: 'शनि गोचर विश्लेषण', sa: 'शनिगोचरविश्लेषणम्' }, color: '#6366f1' },
];

const MODULE_LINKS = [
  { label: { en: 'Module 15-3: Shadbala Deep Dive', hi: 'मॉड्यूल 15-3: षड्बल विस्तार', sa: 'मॉड्यूल 15-3: षड्बलविस्तारः' }, href: '/learn/modules/15-3' },
  { label: { en: 'Module 15-4: Ashtakavarga Deep Dive', hi: 'मॉड्यूल 15-4: अष्टकवर्ग विस्तार', sa: 'मॉड्यूल 15-4: अष्टकवर्गविस्तारः' }, href: '/learn/modules/15-4' },
];

export default function LearnAdvancedPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Varshaphal" devanagari="वर्षफल" transliteration="Varṣaphala" meaning="Annual result" />
        <SanskritTermCard term="Tajika" devanagari="ताजिक" transliteration="Tājika" meaning="Annual horoscopy system" />
        <SanskritTermCard term="Prashna" devanagari="प्रश्न" transliteration="Praśna" meaning="Question / Horary" />
        <SanskritTermCard term="Muhurta" devanagari="मुहूर्त" transliteration="Muhūrta" meaning="Auspicious moment" />
        <SanskritTermCard term="Shadbala" devanagari="षड्बल" transliteration="Ṣaḍbala" meaning="Six strengths" />
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Aṣṭakavarga" meaning="Eight-source points" />
      </div>

      {/* 1. Varshaphal */}
      <LessonSection number={1} title={t('varshaphalTitle')}>
        <p>{t('varshaphalContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'How our Varshaphal engine works:', hi: 'हमारा वर्षफल इंजन कैसे काम करता है:', sa: 'अस्माकं वर्षफलयन्त्रं कथं कार्यं करोति:', ta: 'எங்கள் வர்ஷபல என்ஜின் எப்படி செயல்படுகிறது:', te: 'మా వర్షఫల ఇంజిన్ ఎలా పని చేస్తుంది:', bn: 'আমাদের বর্ষফল ইঞ্জিন কীভাবে কাজ করে:', kn: 'ನಮ್ಮ ವರ್ಷಫಲ ಎಂಜಿನ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ:', gu: 'અમારું વર્ષફળ ઇંજિન કેવી રીતે કાર્ય કરે છે:', mai: 'हमर वर्षफल इंजन कोना काम करैत अछि:', mr: 'आमचे वर्षफल इंजिन कसे काम करते:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {tl({ en: 'Find exact JD when Sun returns to birth longitude (binary search)', hi: 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)', sa: 'सटीकं JD अन्विष्यतु यदा सूर्यः जन्मदेशान्तरे पुनरागच्छति (द्विआधारीखोजः)', ta: 'சூரியன் பிறப்பு தீர்க்கரேகைக்கு திரும்பும் சரியான JD கண்டுபிடியுங்கள் (பைனரி தேடல்)', te: 'సూర్యుడు జన్మ రేఖాంశానికి తిరిగి వచ్చే ఖచ్చితమైన JD కనుగొనండి (బైనరీ సెర్చ్)', bn: 'সূর্য জন্ম দ্রাঘিমায় ফিরে আসে তখন সঠিক JD খুঁজুন (বাইনারি অনুসন্ধান)', kn: 'ಸೂರ್ಯ ಜನ್ಮ ರೇಖಾಂಶಕ್ಕೆ ಹಿಂತಿರುಗುವ ನಿಖರ JD ಹುಡುಕಿ (ಬೈನರಿ ಸರ್ಚ್)', gu: 'સૂર્ય જ્યારે જન્મ રેખાંશ પર પાછા ફરે ત્યારે ચોક્કસ JD શોધો (બાઈનરી સર્ચ)', mai: 'सटीक JD खोजू जखन सूर्य जन्म देशांतर पर लौटैत अछि (बाइनरी खोज)', mr: 'सूर्य जन्म रेखांशावर परत येतो तेव्हाचे अचूक JD शोधा (बायनरी शोध)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {tl({ en: 'Compute full chart for that moment (all 9 planets + houses)', hi: 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)', sa: 'तस्य क्षणस्य पूर्णकुण्डलीं गणयतु (सर्वे 9 ग्रहाः + भावाः)', ta: 'அந்த தருணத்திற்கான முழு ஜாதகத்தை கணக்கிடுங்கள் (அனைத்து 9 கிரகங்கள் + வீடுகள்)', te: 'ఆ క్షణానికి పూర్తి చార్ట్ లెక్కించండి (అన్ని 9 గ్రహాలు + భావాలు)', bn: 'সেই মুহূর্তের জন্য পূর্ণ কুণ্ডলী গণনা করুন (সব 9 গ্রহ + ভাব)', kn: 'ಆ ಕ್ಷಣಕ್ಕೆ ಪೂರ್ಣ ಕುಂಡಲಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ (ಎಲ್ಲ 9 ಗ್ರಹಗಳು + ಭಾವಗಳು)', gu: 'તે ક્ષણ માટે સંપૂર્ण ચાર્ટ ગણો (તમામ 9 ગ્રહ + ભાવ)', mai: 'ओहि क्षणक पूर्ण कुंडली गणना करू (सभ 9 ग्रह + भाव)', mr: 'त्या क्षणासाठी पूर्ण कुंडली गणना करा (सर्व 9 ग्रह + भाव)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {tl({ en: 'Muntha = (Birth Lagna sign + age) mod 12', hi: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12', sa: 'मुन्था = (जन्मलग्नराशिः + वयः) mod 12', ta: 'முந்தா = (பிறப்பு லக்ன ராசி + வயது) mod 12', te: 'మూన్‌తా = (జన్మ లగ్న రాశి + వయసు) mod 12', bn: 'মুন্থা = (জন্ম লগ্ন রাশি + বয়স) mod 12', kn: 'ಮುನ್ಥಾ = (ಜನ್ಮ ಲಗ್ನ ರಾಶಿ + ವಯಸ್ಸು) mod 12', gu: 'મૂન્થા = (જન્મ લગ્ન રાશિ + ઉંમર) mod 12', mai: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12', mr: 'मुन्था = (जन्म लग्न राशी + वय) mod 12' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {tl({ en: 'Calculate 16 Sahams (sensitive points for life areas)', hi: '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)', sa: 'षोडश सहमाः गणयतु (जीवनक्षेत्राणां संवेदनशीलबिन्दवः)', ta: '16 சகங்களை கணக்கிடுங்கள் (வாழ்க்கை பகுதிகளுக்கான உணர்திறன் புள்ளிகள்)', te: '16 సహమాలను లెక్కించండి (జీవిత రంగాలకు సున్నితమైన బిందువులు)', bn: '16 সহম গণনা করুন (জীবন ক্ষেত্রের সংবেদনশীল বিন্দু)', kn: '16 ಸಹಮಗಳನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ (ಜೀವನ ಕ್ಷೇತ್ರಗಳ ಸೂಕ್ಷ್ಮ ಬಿಂದುಗಳು)', gu: '16 સહમ ગણો (જીવન ક્ષેત્રો માટેના સંવેદनशील બિંદુઓ)', mai: '16 सहम गणना करू (जीवन क्षेत्रक संवेदनशील बिंदु)', mr: '16 सहम गणना करा (जीवन क्षेत्रांसाठी संवेदनशील बिंदू)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {tl({ en: 'Generate Mudda Dasha (year-compressed planetary periods)', hi: 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)', sa: 'मुद्दादशां निर्मातु (वर्षसंकुचिताः ग्रहावधयः)', ta: 'முத்தா தசையை உருவாக்குங்கள் (ஆண்டு-சுருக்கப்பட்ட கிரக காலங்கள்)', te: 'ముద్దా దశను రూపొందించండి (సంవత్సర-సంకుచిత గ్రహ కాలాలు)', bn: 'মুদ্দা দশা তৈরি করুন (বছর-সংকুচিত গ্রহ সময়কাল)', kn: 'ಮುದ್ದಾ ದಶೆ ರಚಿಸಿ (ವರ್ಷ-ಸಂಕುಚಿತ ಗ್ರಹ ಅವಧಿಗಳು)', gu: 'મૂદ્દા દશા ઉત્પન્ન કરો (વર્ષ-સંકુચિત ગ્રહ અવધિ)', mai: 'मुद्दा दशा उत्पन्न करू (वर्ष-संकुचित ग्रह अवधि)', mr: 'मुद्दा दशा निर्माण करा (वर्ष-संकुचित ग्रह कालावधी)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {tl({ en: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', hi: 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)', sa: 'ताजिकयोगानां विश्लेषणं कुरुतु (इत्थशाल, ईसराफ, नक्त, आदि)', ta: 'தாஜிக யோகங்களை பகுப்பாய்வு செய்யுங்கள் (இத்தஷால், ஈஸரஃபா, நக்தா, முதலியன)', te: 'తాజిక యోగాలను విశ్లేషించండి (ఇత్థశాల, ఈసరాఫ, నక్త, మొదలైనవి)', bn: 'তাজিক যোগ বিশ্লেষণ করুন (ইথশাল, ইসারাফ, নক্ত, ইত্যাদি)', kn: 'ತಾಜಿಕ ಯೋಗಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ (ಇತ್ಥಶಾಲ, ಈಸರಾಫ, ನಕ್ತ, ಇತ್ಯಾದಿ)', gu: 'તાઝિક યોગોનું વિશ્લેષણ કરો (ઇત્થશાલ, ઈસરાફ, નક્ત, વગેરે)', mai: 'ताजिक योगक विश्लेषण करू (इत्थशाल, ईसराफ, नक्त, आदि)', mr: 'ताजिक योगांचे विश्लेषण करा (इत्थशाल, ईसराफ, नक्त, इ.)' }, locale)}</p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{t('varshaphalCalc')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {tl({ en: 'Tajika Yogas — Unique to Varshaphal:', hi: 'ताजिक योग — वर्षफल के लिए विशिष्ट:', sa: 'ताजिकयोगाः — वर्षफलाय विशिष्टाः:', ta: 'தாஜிக யோகங்கள் — வர்ஷபலத்திற்கு தனித்துவமானவை:', te: 'తాజిక యోగాలు — వర్షఫలానికి ప్రత్యేకమైనవి:', bn: 'তাজিক যোগ — বর্ষফলের জন্য অনন্য:', kn: 'ತಾಜಿಕ ಯೋಗಗಳು — ವರ್ಷಫಲಕ್ಕೆ ವಿಶಿಷ್ಟ:', gu: 'તાઝિક યોગ — વર્ષફળ માટે વિશિષ્ટ:', mai: 'ताजिक योग — वर्षफलक लेल विशिष्ट:', mr: 'ताजिक योग — वर्षफलासाठी विशिष्ट:' }, locale)}
          </p>
          <p className="text-amber-200/80 text-xs leading-relaxed">{t('tajikaYogas')}</p>
        </div>
      </LessonSection>

      {/* 2. KP System */}
      <LessonSection number={2} title={t('kpTitle')}>
        <p>{t('kpContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'KP Sub-Lord Division Example:', hi: 'KP उप-स्वामी विभाजन उदाहरण:', sa: 'KP उप-स्वामि-विभाजन-उदाहरणम्:', ta: 'KP உப-அதிபதி பிரிவு உதாரணம்:', te: 'KP ఉప-స్వామి విభజన ఉదాహరణ:', bn: 'KP উপ-অধিপতি বিভাগ উদাহরণ:', kn: 'KP ಉಪ-ಸ್ವಾಮಿ ವಿಭಾಗ ಉದಾಹರಣ:', gu: 'KP પેટા-સ્વામી વિભાગ ઉદાહરણ:', mai: 'KP उप-स्वामी विभाजन उदाहरण:', mr: 'KP उप-स्वामी विभाजन उदाहरण:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {tl({ en: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, hi: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, sa: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, ta: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, te: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, bn: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, kn: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, gu: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, mai: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, mr: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):` }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Star Lord: Ketu (7 years)</p>
          <p className="text-gold-light/60 font-mono text-xs">Sub-divisions (proportional to Dasha years):</p>
          <p className="text-gold-light/60 font-mono text-xs">  Ke-Ke: 0°00&apos;-0°46&apos;40&quot; | Ke-Ve: 0°46&apos;40&quot;-2°53&apos;20&quot; | ...</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Each planet at a specific degree has: Sign lord + Star lord + Sub-lord'
              : 'प्रत्येक विशिष्ट अंश पर ग्रह का: राशि स्वामी + नक्षत्र स्वामी + उप-स्वामी'}
          </p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{t('kpCalc')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-blue-400/15">
          <p className="text-blue-300 font-mono text-sm mb-2">
            {tl({ en: 'The Significator Table — Heart of KP:', hi: 'कारक तालिका — KP का हृदय:', sa: 'कारक-तालिका — KP-स्य हृदयम्:', ta: 'காரக அட்டவணை — KP இன் இதயம்:', te: 'కారక పట్టిక — KP యొక్క హృదయం:', bn: 'কারক তালিকা — KP-এর হৃদয়:', kn: 'ಕಾರಕ ಕೋಷ್ಟಕ — KP ಯ ಹೃದಯ:', gu: 'કારક કોષ્ટક — KP નું હૃદય:', mai: 'कारक तालिका — KP केँ हृदय:', mr: 'कारक तक्ता — KP चे हृदय:' }, locale)}
          </p>
          <p className="text-blue-200/80 text-xs leading-relaxed">{t('kpSignificator')}</p>
        </div>
      </LessonSection>

      {/* 3. Prashna */}
      <LessonSection number={3} title={t('prashnaTitle')}>
        <p>{t('prashnaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-purple-400/20">
          <p className="text-purple-300 font-mono text-sm mb-2">
            {tl({ en: 'Ashtamangala Prashna — Kerala Tradition:', hi: 'अष्टमंगल प्रश्न — केरल परम्परा:', sa: 'अष्टमङ्गल-प्रश्नः — केरल-परम्परा:', ta: 'அஷ்டமங்கல பிரஷ்னா — கேரள மரபு:', te: 'అష్టమంగళ ప్రశ్న — కేరళ సంప్రదాయం:', bn: 'অষ্টমঙ্গল প্রশ্ন — কেরল ঐতিহ্য:', kn: 'ಅಷ್ಟಮಂಗಲ ಪ್ರಶ್ನ — ಕೇರಳ ಸಂಪ್ರದಾಯ:', gu: 'અષ્ટમંગળ પ્રશ્ન — કેરળ પરંપરા:', mai: 'अष्टमंगल प्रश्न — केरल परम्परा:', mr: 'अष्टमंगल प्रश्न — केरळ परंपरा:' }, locale)}
          </p>
          <p className="text-purple-200/80 font-mono text-xs">{t('ashtamangalaContent')}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { item: tl({ en: 'Mirror', hi: 'दर्पण', sa: 'दर्पणः', ta: 'கண்ணாடி', te: 'అద్దం', bn: 'দর্পণ', kn: 'ಕನ್ನಡಿ', gu: 'દર્પણ', mai: 'दर्पण', mr: 'आरसा' }, locale), meaning: tl({ en: 'Self-reflection, clarity', hi: 'आत्मचिन्तन, स्पष्टता', sa: 'आत्मचिन्तनम्, स्पष्टता', ta: 'சுய-தரிசனம், தெளிவு', te: 'ఆత్మ-ప్రతిబింబం, స్పష్టత', bn: 'আত্মচিন্তন, স্বচ্ছতা', kn: 'ಆತ್ಮಚಿಂತನ, ಸ್ಪಷ್ಟತೆ', gu: 'આત્મ-ચિંતન, સ્પષ્ટતા', mai: 'आत्मचिन्तन, स्पष्टता', mr: 'आत्मचिंतन, स्पष्टता' }, locale) },
            { item: tl({ en: 'Vessel', hi: 'कलश', sa: 'कलशः', ta: 'கலசம்', te: 'కలశం', bn: 'কলস', kn: 'ಕಲಶ', gu: 'કળશ', mai: 'कलश', mr: 'कलश' }, locale), meaning: tl({ en: 'Abundance, containment', hi: 'प्रचुरता, धारण', sa: 'प्रचुरता, धारणम्', ta: 'வளம், கொள்திறன்', te: 'సమృద్ధి, ధారణ', bn: 'প্রাচুর্য, ধারণ', kn: 'ಸಮೃದ್ಧಿ, ಧಾರಣ', gu: 'વિપુળતા, ધારણ', mai: 'प्रचुरता, धारण', mr: 'विपुलता, धारण' }, locale) },
            { item: tl({ en: 'Gold Fish', hi: 'स्वर्णमीन', sa: 'स्वर्णमीनः', ta: 'தங்க மீன்', te: 'బంగారు చేప', bn: 'সোনার মাছ', kn: 'ಚಿನ್ನದ ಮೀನು', gu: 'સોનેરી માછલી', mai: 'सोनमछली', mr: 'सोनमासा' }, locale), meaning: tl({ en: 'Prosperity, fertility', hi: 'समृद्धि, उर्वरता', sa: 'समृद्धिः, उर्वरता', ta: 'செழிப்பு, வளமை', te: 'సంపద, సారవంతత', bn: 'সমৃদ্ধি, উর্বরতা', kn: 'ಸಮೃದ್ಧಿ, ಫಲವತ್ತತೆ', gu: 'સમૃદ્ધિ, ફળદ્રુપતા', mai: 'समृद्धि, उर्वरता', mr: 'समृद्धी, सुपीकता' }, locale) },
            { item: tl({ en: 'Lamp', hi: 'दीप', sa: 'दीपः', ta: 'விளக்கு', te: 'దీపం', bn: 'দীপ', kn: 'ದೀಪ', gu: 'દીપ', mai: 'दीप', mr: 'दीप' }, locale), meaning: tl({ en: 'Wisdom, dispelling darkness', hi: 'ज्ञान, अन्धकार निवारण', sa: 'ज्ञानम्, तमोनिवारणम्', ta: 'ஞானம், இருள் நீக்கல்', te: 'జ్ఞానం, చీకటి తొలగింపు', bn: 'জ্ঞান, অন্ধকার দূরীকরণ', kn: 'ಜ್ಞಾನ, ಅಂಧಕಾರ ನಿವಾರಣೆ', gu: 'જ્ઞાન, અંધકાર નિવારણ', mai: 'ज्ञान, अन्हार दूर करब', mr: 'ज्ञान, अंधकार निवारण' }, locale) },
            { item: tl({ en: 'Throne', hi: 'सिंहासन', sa: 'सिंहासनम्', ta: 'சிம்மாசனம்', te: 'సింహాసనం', bn: 'সিংহাসন', kn: 'ಸಿಂಹಾಸನ', gu: 'સિંહાસન', mai: 'सिंहासन', mr: 'सिंहासन' }, locale), meaning: tl({ en: 'Authority, power', hi: 'अधिकार, शक्ति', sa: 'अधिकारः, शक्तिः', ta: 'அதிகாரம், சக்தி', te: 'అధికారం, శక్తి', bn: 'কর্তৃত্ব, শক্তি', kn: 'ಅಧಿಕಾರ, ಶಕ್ತಿ', gu: 'સત્તા, શક્તિ', mai: 'अधिकार, शक्ति', mr: 'अधिकार, शक्ती' }, locale) },
            { item: tl({ en: 'Bull', hi: 'वृषभ', sa: 'वृषभः', ta: 'காளை', te: 'వృషభం', bn: 'বৃষভ', kn: 'ವೃಷಭ', gu: 'વૃષભ', mai: 'वृषभ', mr: 'बैल' }, locale), meaning: tl({ en: 'Strength, dharma', hi: 'बल, धर्म', sa: 'बलम्, धर्मः', ta: 'வலிமை, தர்மம்', te: 'బలం, ధర్మం', bn: 'শক্তি, ধর্ম', kn: 'ಬಲ, ಧರ್ಮ', gu: 'બળ, ધર્મ', mai: 'बल, धर्म', mr: 'बळ, धर्म' }, locale) },
            { item: tl({ en: 'Flag', hi: 'ध्वज', sa: 'ध्वजः', ta: 'கொடி', te: 'జెండా', bn: 'পতাকা', kn: 'ಧ್ವಜ', gu: 'ધ્વજ', mai: 'ध्वज', mr: 'ध्वज' }, locale), meaning: tl({ en: 'Victory, announcement', hi: 'विजय, घोषणा', sa: 'विजयः, घोषणा', ta: 'வெற்றி, அறிவிப்பு', te: 'విజయం, ప్రకటన', bn: 'বিজয়, ঘোষণা', kn: 'ವಿಜಯ, ಘೋಷಣೆ', gu: 'વિજય, ઘોષણા', mai: 'विजय, घोषणा', mr: 'विजय, घोषणा' }, locale) },
            { item: tl({ en: 'Fan', hi: 'व्यजन', sa: 'व्यजनम्', ta: 'விசிறி', te: 'విసనకర్ర', bn: 'পাখা', kn: 'ಬೀಸಣಿಗೆ', gu: 'પંખો', mai: 'पंखा', mr: 'पंखा' }, locale), meaning: tl({ en: 'Royal service, comfort', hi: 'राजसेवा, सुविधा', sa: 'राजसेवा, सुखम्', ta: 'அரச சேவை, வசதி', te: 'రాజసేవ, సౌకర్యం', bn: 'রাজসেবা, সুবিধা', kn: 'ರಾಜಸೇವೆ, ಸೌಕರ್ಯ', gu: 'રાજસેવા, સુવિધા', mai: 'राजसेवा, सुविधा', mr: 'राजसेवा, सुविधा' }, locale) },
          ].map((a) => (
            <div key={a.item} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-purple-400/10">
              <p className="text-purple-300 font-bold text-sm">{a.item}</p>
              <p className="text-text-secondary text-xs mt-1">{a.meaning}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 4. Muhurta AI */}
      <LessonSection number={4} title={t('muhurtaTitle')}>
        <p>{t('muhurtaContent')}</p>
        <p className="mt-3 text-text-secondary text-sm">{t('muhurtaFactors')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-emerald-400/20">
          <p className="text-emerald-300 font-mono text-sm mb-2">
            {tl({ en: 'Multi-Factor Scoring Example (Marriage):', hi: 'बहु-कारक अंकन उदाहरण (विवाह):', sa: 'बहु-कारक-अङ्कन-उदाहरणम् (विवाहः):', ta: 'பல-காரண மதிப்பீட்டு உதாரணம் (திருமணம்):', te: 'బహు-కారక స్కోరింగ్ ఉదాహరణ (వివాహం):', bn: 'বহু-কারক স্কোরিং উদাহরণ (বিবাহ):', kn: 'ಬಹು-ಅಂಶ ಅಂಕ ಉದಾಹರಣ (ವಿವಾಹ):', gu: 'બહુ-ઘટક સ્કોરિંગ ઉદાહરણ (વિવાહ):', mai: 'बहु-कारक अंकन उदाहरण (विवाह):', mr: 'बहु-घटक गुणांकन उदाहरण (विवाह):' }, locale)}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Tithi: Dwithiya, Thrithiya, Panchami, Saptami, Dashami → High score'
              : 'तिथि: द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी → उच्च अंक'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Nakshatra: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta → Excellent'
              : 'नक्षत्र: रोहिणी, मृगशिरा, मघा, उत्तर फाल्गुनी, हस्त → उत्तम'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Must avoid: Rahu Kaal, Varjyam, eclipses, retrograde Venus'
              : 'बचना चाहिए: राहु काल, वर्ज्यम, ग्रहण, वक्री शुक्र'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Score = Σ(weight_i × factor_i) / max_possible → 0-100%'
              : 'अंक = Σ(भार_i × कारक_i) / अधिकतम_सम्भव → 0-100%'}
          </p>
        </div>
      </LessonSection>

      {/* 5. Shadbala */}
      <LessonSection number={5} title={t('shadbalaTitle')}>
        <p>{t('shadbalaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'The Six Components:', hi: 'छह घटक:', sa: 'षट् घटकाः:', ta: 'ஆறு கூறுகள்:', te: 'ఆరు భాగాలు:', bn: 'ছয়টি উপাদান:', kn: 'ಆರು ಘಟಕಗಳು:', gu: 'છ ઘટકો:', mai: 'छह घटक:', mr: 'सहा घटक:' }, locale)}
          </p>
          <p className="text-gold-light/80 text-xs leading-relaxed">{t('shadbalaComponents')}</p>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {tl({ en: 'Minimum Shadbala Thresholds (in Rupas):', hi: 'न्यूनतम षड्बल सीमा (रूपों में):', sa: 'न्यूनतम-षड्बल-सीमाः (रूपेषु):', ta: 'குறைந்தபட்ச ஷட்பல வரம்பு (ரூபாவில்):', te: 'కనిష్ఠ షడ్బల సీమలు (రూపాలలో):', bn: 'ন্যূনতম ষড়্বল সীমা (রূপায়):', kn: 'ಕನಿಷ್ಠ ಷಡ್ಬಲ ಮಿತಿಗಳು (ರೂಪಗಳಲ್ಲಿ):', gu: 'ન્યૂનતમ ષડ્બળ સીમા (રૂપામાં):', mai: 'न्यूनतम षड्बल सीमा (रूपमे):', mr: 'किमान षड्बल मर्यादा (रूपांमध्ये):' }, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { planet: tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale), threshold: '6.5' },
              { planet: tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale), threshold: '6.0' },
              { planet: tl({ en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', ta: 'செவ்வாய்', te: 'మంగళుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ', mai: 'मंगल', mr: 'मंगळ' }, locale), threshold: '5.0' },
              { planet: tl({ en: 'Mercury', hi: 'बुध', sa: 'बुधः', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ', mai: 'बुध', mr: 'बुध' }, locale), threshold: '7.0' },
              { planet: tl({ en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', ta: 'குரு', te: 'గురుడు', bn: 'গুরু', kn: 'ಗುರು', gu: 'ગુરુ', mai: 'गुरु', mr: 'गुरू' }, locale), threshold: '6.5' },
              { planet: tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર', mai: 'शुक्र', mr: 'शुक्र' }, locale), threshold: '5.5' },
              { planet: tl({ en: 'Saturn', hi: 'शनि', sa: 'शनिः', ta: 'சனி', te: 'శనిగ్రహం', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ', mai: 'शनि', mr: 'शनी' }, locale), threshold: '5.0' },
            ].map((p) => (
              <div key={p.planet} className="flex justify-between text-text-secondary">
                <span>{p.planet}</span>
                <span className="text-gold-light font-mono">{p.threshold}</span>
              </div>
            ))}
          </div>
          <p className="text-amber-200/50 text-xs mt-2">
            {locale === 'en'
              ? 'Planets exceeding their threshold can deliver their promises. Below = weak results.'
              : 'सीमा पार करने वाले ग्रह अपने वादे पूरे कर सकते हैं। नीचे = कमज़ोर परिणाम।'}
          </p>
        </div>
      </LessonSection>

      {/* 6. Ashtakavarga */}
      <LessonSection number={6} title={t('ashtakavargaTitle')}>
        <p>{t('ashtakavargaContent')}</p>
        <p className="mt-3 text-text-secondary text-sm">{t('ashtakavargaUse')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-cyan-400/15">
          <p className="text-cyan-300 font-mono text-sm mb-2">
            {tl({ en: 'Sarvashtakavarga Score Interpretation:', hi: 'सर्वाष्टकवर्ग अंक व्याख्या:', sa: 'सर्वाष्टकवर्ग-अङ्क-व्याख्या:', ta: 'சர்வாஷ்டகவர்க்க மதிப்பெண் விளக்கம்:', te: 'సర్వాష్టకవర్గ స్కోర్ వివరణ:', bn: 'সর্বাষ্টকবর্গ স্কোর ব্যাখ্যা:', kn: 'ಸರ್ವಾಷ್ಟಕವರ್ಗ ಅಂಕ ವಿವರಣೆ:', gu: 'સર્વાષ્ટકવર્ગ સ્કોર અર્થઘટન:', mai: 'सर्वाष्टकवर्ग अंक व्याख्या:', mr: 'सर्वाष्टकवर्ग गुण व्याख्या:' }, locale)}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-emerald-300 font-mono">30-56 {tl({ en: 'Bindus: Strong sign — favorable transits, strong house', hi: 'बिन्दु: प्रबल राशि — अनुकूल गोचर', sa: 'बिन्दवः: प्रबल-राशिः — अनुकूल-गोचराः, बलिष्ठ-भावः', ta: 'பிந்து: வலிமையான ராசி — சாதகமான கோசரம், வலிமையான பாவம்', te: 'బిందువులు: బలమైన రాశి — అనుకూల గోచరాలు, బలమైన భావం', bn: 'বিন্দু: শক্তিশালী রাশি — অনুকূল গোচর, শক্তিশালী ভাব', kn: 'ಬಿಂದು: ಬಲಿಷ್ಠ ರಾಶಿ — ಅನುಕೂಲ ಗೋಚರ, ಬಲಿಷ್ಠ ಭಾವ', gu: 'બિંદુ: બળવાન રાશિ — અનુકૂળ ગોચર, બળવાન ભાવ', mai: 'बिन्दु: प्रबल राशि — अनुकूल गोचर, बलिष्ठ भाव', mr: 'बिंदू: बलवान राशी — अनुकूल गोचर, बलवान भाव' }, locale)}</p>
            <p className="text-amber-300 font-mono">25-29 {tl({ en: 'Bindus: Average — mixed results during transits', hi: 'बिन्दु: सामान्य — मिश्रित परिणाम', sa: 'बिन्दवः: सामान्यः — गोचर-काले मिश्रित-फलानि', ta: 'பிந்து: சராசரி — கோசர காலத்தில் கலவையான பலன்கள்', te: 'బిందువులు: సాధారణం — గోచర కాలంలో మిశ్రమ ఫలితాలు', bn: 'বিন্দু: গড় — গোচরকালে মিশ্র ফলাফল', kn: 'ಬಿಂದು: ಸಾಮಾನ್ಯ — ಗೋಚರ ಸಮಯದಲ್ಲಿ ಮಿಶ್ರ ಫಲಗಳು', gu: 'બિંદુ: સામાન્ય — ગોચર સમયે મિશ્ર પરિણામ', mai: 'बिन्दु: सामान्य — गोचरमे मिश्रित परिणाम', mr: 'बिंदू: सामान्य — गोचरात मिश्र परिणाम' }, locale)}</p>
            <p className="text-red-300 font-mono">0-24  {tl({ en: 'Bindus: Weak sign — challenging transits, weak house', hi: 'बिन्दु: दुर्बल राशि — कठिन गोचर', sa: 'बिन्दवः: दुर्बल-राशिः — कठिन-गोचराः, दुर्बल-भावः', ta: 'பிந்து: பலவீனமான ராசி — கடினமான கோசரம், பலவீனமான பாவம்', te: 'బిందువులు: బలహీన రాశి — కఠిన గోచరాలు, బలహీన భావం', bn: 'বিন্দু: দুর্বল রাশি — কঠিন গোচর, দুর্বল ভাব', kn: 'ಬಿಂದು: ದುರ್ಬಲ ರಾಶಿ — ಕಠಿಣ ಗೋಚರ, ದುರ್ಬಲ ಭಾವ', gu: 'બિંદુ: નિર્બળ રાશિ — કઠિન ગોચર, નિર્બળ ભાવ', mai: 'बिन्दु: दुर्बल राशि — कठिन गोचर, दुर्बल भाव', mr: 'बिंदू: दुर्बल राशी — कठीण गोचर, दुर्बल भाव' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* 7. Putting It Together */}
      <LessonSection number={7} title={t('practiceTitle')} variant="highlight">
        <p>{t('practiceContent')}</p>

        <div className="mt-4 mb-6">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {tl({ en: 'Related Learn Modules', hi: 'सम्बन्धित शिक्षा मॉड्यूल', sa: 'सम्बद्धाः शिक्षा-मॉड्यूलाः', ta: 'தொடர்புடைய கற்றல் தொகுதிகள்', te: 'సంబంధిత అభ్యాస మాడ్యూళ్ళు', bn: 'সম্পর্কিত শিক্ষা মডিউল', kn: 'ಸಂಬಂಧಿತ ಕಲಿಕಾ ಮಾಡ್ಯೂಲ್‌ಗಳು', gu: 'સંબંધિત શિક્ષણ મોડ્યૂલ', mai: 'संबंधित शिक्षा मॉड्यूल', mr: 'संबंधित शिक्षण मॉड्युल' }, locale)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {MODULE_LINKS.map((ml) => (
              <Link
                key={ml.href}
                href={ml.href}
                className="inline-block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg px-3 py-2 border border-blue-500/15 hover:border-blue-500/30 transition-colors text-xs text-blue-300"
              >
                {lt(ml.label as LocaleText, locale)}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS_GRID.map((tool, i) => (
            <motion.div
              key={tool.name.en}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={tool.link}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-all"
              >
                <div className="text-sm font-semibold mb-1" style={{ color: tool.color }}>{lt(tool.name as LocaleText, locale)}</div>
                <p className="text-text-secondary text-xs">{lt(tool.desc as LocaleText, locale)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </LessonSection>
    </div>
  );
}
