import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, BookOpen, Globe, Hash } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-al-khwarizmi.json';

export const revalidate = 604800; // 7 days — static educational content



/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const WHAT_HE_TRANSMITTED = [
  { item: { en: 'The Hindu decimal place-value system', hi: 'हिन्दू दशमलव स्थान-मान प्रणाली', sa: 'हिन्दूदशमलवस्थानमानप्रणाली', mai: 'हिन्दू दशमलव स्थान-मान प्रणाली', mr: 'हिंदू दशांश स्थान-मूल्य प्रणाली', ta: 'இந்து தசம இட-மதிப்பு முறை', te: 'హిందూ దశాంశ స్థాన-విలువ వ్యవస్థ', bn: 'হিন্দু দশমিক স্থান-মান পদ্ধতি', kn: 'ಹಿಂದೂ ದಶಮಾಂಶ ಸ್ಥಳ-ಮೌಲ್ಯ ವ್ಯವಸ್ಥೆ', gu: 'હિન્દુ દશાંશ સ્થાન-મૂલ્ય પ્રણાલી' }, source: 'Brahmagupta, 628 CE', color: 'border-gold-primary/60' },
  { item: { en: 'Zero as a number and placeholder (shunya → sifr → zero)', hi: 'शून्य एक संख्या और स्थानधारक के रूप में (शून्य → सिफ़्र → ज़ीरो)', sa: 'शून्यम् सङ्ख्यारूपेण स्थानधारकरूपेण च', mai: 'शून्य एकटा संख्या आ स्थानधारक (शून्य → सिफ़्र → ज़ीरो)', mr: 'शून्य एक संख्या आणि स्थानधारक (शून्य → सिफ़्र → झिरो)', ta: 'சுழியம் ஒரு எண் மற்றும் இடம்பிடிப்பான் (சுன்யா → சிஃப்ர் → ஜீரோ)', te: 'సున్నా ఒక సంఖ్య మరియు ప్లేస్‌హోల్డర్ (శూన్య → సిఫ్ర్ → జీరో)', bn: 'শূন্য একটি সংখ্যা এবং স্থানধারক (শূন্য → সিফ্র → জিরো)', kn: 'ಸೊನ್ನೆ ಒಂದು ಸಂಖ್ಯೆ ಮತ್ತು ಸ್ಥಳಧಾರಕ (ಶೂನ್ಯ → ಸಿಫ್ರ್ → ಜೀರೋ)', gu: 'શૂન્ય એક સંખ્યા અને સ્થાનધારક (શૂન્ય → સિફ્ર → ઝીરો)' }, source: 'Brahmagupta, 628 CE', color: 'border-amber-400/60' },
  { item: { en: 'Hindu methods of arithmetic: addition, subtraction, multiplication, division', hi: 'हिन्दू अंकगणित विधियाँ: जोड़, घटाव, गुणा, भाग', sa: 'हिन्दूअङ्कगणितविधयः: योगः वियोगः गुणनं विभाजनं च', mai: 'हिन्दू अंकगणित विधि: जोड़, घटाव, गुणा, भाग', mr: 'हिंदू अंकगणित पद्धती: बेरीज, वजाबाकी, गुणाकार, भागाकार', ta: 'இந்து கணித முறைகள்: கூட்டல், கழித்தல், பெருக்கல், வகுத்தல்', te: 'హిందూ అంకగణిత పద్ధతులు: కూడిక, తీసివేత, గుణకారం, భాగహారం', bn: 'হিন্দু পাটিগণিত পদ্ধতি: যোগ, বিয়োগ, গুণ, ভাগ', kn: 'ಹಿಂದೂ ಅಂಕಗಣಿತ ವಿಧಾನಗಳು: ಸೇರ್ಪಡೆ, ಕಳೆಯುವಿಕೆ, ಗುಣಾಕಾರ, ಭಾಗಾಕಾರ', gu: 'હિન્દુ અંકગણિત પદ્ધતિઓ: સરવાળો, બાદબાકી, ગુણાકાર, ભાગાકાર' }, source: 'Indian tradition', color: 'border-emerald-400/60' },
  { item: { en: 'Algebraic techniques from Indian quadratic equation methods', hi: 'भारतीय द्विघात समीकरण विधियों से बीजगणितीय तकनीकें', sa: 'भारतीयद्विघातसमीकरणविधिभ्यः बीजगणिततन्त्राणि', mai: 'भारतीय द्विघात समीकरण विधिसँ बीजगणितीय तकनीक', mr: 'भारतीय वर्ग समीकरण पद्धतींतून बीजगणित तंत्रे', ta: 'இந்திய இருபடி சமன்பாட்டு முறைகளிலிருந்து இயற்கணிதத் தொழில்நுட்பங்கள்', te: 'భారతీయ వర్గ సమీకరణ పద్ధతుల నుండి బీజగణిత పద్ధతులు', bn: 'ভারতীয় দ্বিঘাত সমীকরণ পদ্ধতি থেকে বীজগণিত কৌশল', kn: 'ಭಾರತೀಯ ವರ್ಗ ಸಮೀಕರಣ ವಿಧಾನಗಳಿಂದ ಬೀಜಗಣಿತ ತಂತ್ರಗಳು', gu: 'ભારતીય દ્વિઘાત સમીકરણ પદ્ધતિઓમાંથી બીજગણિત તકનીકો' }, source: 'Brahmagupta, 628 CE', color: 'border-blue-400/60' },
];

const TRANSMISSION_CHAIN = [
  { step: '1', label: { en: 'Indian Mathematicians', hi: 'भारतीय गणितज्ञ', sa: 'भारतीयगणितज्ञाः', mai: 'भारतीय गणितज्ञ', mr: 'भारतीय गणितज्ञ', ta: 'இந்திய கணிதவியலாளர்கள்', te: 'భారతీయ గణితశాస్త్రజ్ఞులు', bn: 'ভারতীয় গণিতবিদ', kn: 'ಭಾರತೀಯ ಗಣಿತಜ್ಞರು', gu: 'ભારતીય ગણિતશાસ્ત્રીઓ' }, detail: 'Aryabhata, Brahmagupta, Bhaskara', period: '499-628 CE', color: 'border-gold-primary/60' },
  { step: '2', label: { en: 'House of Wisdom, Baghdad', hi: 'बैत अल-हिक्मा, बगदाद', sa: 'बैत अल्-हिक्मा, बगदाद', mai: 'बैत अल-हिक्मा, बगदाद', mr: 'बैत अल-हिक्मा, बगदाद', ta: 'ஞான இல்லம், பாக்தாத்', te: 'జ్ఞాన గృహం, బాగ్దాద్', bn: 'জ্ঞানগৃহ, বাগদাদ', kn: 'ಜ್ಞಾನ ಗೃಹ, ಬಾಗ್ದಾದ್', gu: 'જ્ઞાનગૃહ, બગદાદ' }, detail: "Al-Khwarizmi's translations", period: '~825 CE', color: 'border-blue-400/60' },
  { step: '3', label: { en: 'Latin Translations', hi: 'लैटिन अनुवाद', sa: 'लैटिन्-अनुवादाः', mai: 'लैटिन अनुवाद', mr: 'लॅटिन अनुवाद', ta: 'லத்தீன் மொழிபெயர்ப்புகள்', te: 'లాటిన్ అనువాదాలు', bn: 'ল্যাটিন অনুবাদ', kn: 'ಲ್ಯಾಟಿನ್ ಅನುವಾದಗಳು', gu: 'લેટિન અનુવાદો' }, detail: 'Adelard of Bath, Robert of Chester', period: '12th century', color: 'border-violet-400/60' },
  { step: '4', label: { en: '"Arabic Numerals" in Europe', hi: 'यूरोप में "अरबी अंक"', sa: 'यूरोपे "अरबीअङ्काः"', mai: 'यूरोपमे "अरबी अंक"', mr: 'युरोपमधील "अरबी अंक"', ta: 'ஐரோப்பாவில் "அரபு எண்கள்"', te: 'ఐరోపాలో "అరబిక్ అంకెలు"', bn: 'ইউরোপে "আরবি সংখ্যা"', kn: 'ಯೂರೋಪ್‌ನಲ್ಲಿ "ಅರೇಬಿಕ್ ಅಂಕಿಗಳು"', gu: 'યુરોપમાં "અરબી અંકો"' }, detail: 'Actually Hindu numerals', period: '13th century+', color: 'border-red-400/60' },
];

const INDIAN_SOURCES = [
  { name: { en: 'Aryabhata', hi: 'आर्यभट', sa: 'आर्यभटः', mai: 'आर्यभट', mr: 'आर्यभट', ta: 'ஆர்யபட்டர்', te: 'ఆర్యభట్ట', bn: 'আর্যভট', kn: 'ಆರ್ಯಭಟ', gu: 'આર્યભટ' }, year: '499 CE', contributions: { en: 'Place-value system, zero, trigonometry, pi approximation (3.1416)', hi: 'स्थान-मान प्रणाली, शून्य, त्रिकोणमिति, पाई सन्निकटन (3.1416)', sa: 'स्थानमानप्रणाली, शून्यम्, त्रिकोणमितिः, पाई सन्निकटनम्', mai: 'स्थान-मान प्रणाली, शून्य, त्रिकोणमिति, पाई सन्निकटन', mr: 'स्थान-मूल्य प्रणाली, शून्य, त्रिकोणमिती, पाई अंदाज', ta: 'இட-மதிப்பு முறை, சுழியம், முக்கோணவியல், பை தோராயம்', te: 'స్థాన-విలువ వ్యవస్థ, సున్నా, త్రికోణమితి, పై అంచనా', bn: 'স্থান-মান পদ্ধতি, শূন্য, ত্রিকোণমিতি, পাই সান্নিকট্য', kn: 'ಸ್ಥಳ-ಮೌಲ್ಯ ವ್ಯವಸ್ಥೆ, ಸೊನ್ನೆ, ತ್ರಿಕೋಣಮಿತಿ, ಪೈ ಅಂದಾಜು', gu: 'સ્થાન-મૂલ્ય પ્રણાલી, શૂન્ય, ત્રિકોણમિતિ, પાઈ અંદાજ' }, color: 'border-gold-primary/60' },
  { name: { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त', sa: 'ब्रह्मगुप्तः', mai: 'ब्रह्मगुप्त', mr: 'ब्रह्मगुप्त', ta: 'பிரம்மகுப்தர்', te: 'బ్రహ్మగుప్తుడు', bn: 'ব্রহ্মগুপ্ত', kn: 'ಬ್ರಹ್ಮಗುಪ್ತ', gu: 'બ્રહ્મગુપ્ત' }, year: '628 CE', contributions: { en: 'Rules for zero and negative numbers, quadratic formula, Brahmasphutasiddhanta', hi: 'शून्य और ऋणात्मक संख्याओं के नियम, द्विघात सूत्र, ब्रह्मस्फुटसिद्धान्त', sa: 'शून्यऋणसंख्यानियमाः, द्विघातसूत्रम्, ब्रह्मस्फुटसिद्धान्तम्', mai: 'शून्य आ ऋणात्मक संख्याक नियम, द्विघात सूत्र, ब्रह्मस्फुटसिद्धान्त', mr: 'शून्य आणि ऋण संख्या नियम, वर्ग सूत्र, ब्रह्मस्फुटसिद्धान्त', ta: 'சுழியம் மற்றும் எதிர்மறை எண் விதிகள், இருபடி சூத்திரம், பிரம்மஸ்புடசித்தாந்தம்', te: 'సున్నా మరియు రుణ సంఖ్య నియమాలు, వర్గ సూత్రం, బ్రహ్మస్ఫుటసిద్ధాంతం', bn: 'শূন্য ও ঋণাত্মক সংখ্যার নিয়ম, দ্বিঘাত সূত্র, ব্রহ্মস্ফুটসিদ্ধান্ত', kn: 'ಸೊನ್ನೆ ಮತ್ತು ಋಣ ಸಂಖ್ಯೆ ನಿಯಮಗಳು, ವರ್ಗ ಸೂತ್ರ, ಬ್ರಹ್ಮಸ್ಫುಟಸಿದ್ಧಾಂತ', gu: 'શૂન્ય અને ઋણ સંખ્યા નિયમો, દ્વિઘાત સૂત્ર, બ્રહ્મસ્ફુટસિદ્ધાન્ત' }, color: 'border-amber-400/60' },
  { name: { en: 'Bhaskara I', hi: 'भास्कर प्रथम', sa: 'भास्करः प्रथमः', mai: 'भास्कर प्रथम', mr: 'भास्कर प्रथम', ta: 'பாஸ்கரர் I', te: 'భాస్కరుడు I', bn: 'ভাস্কর ১ম', kn: 'ಭಾಸ್ಕರ I', gu: 'ભાસ્કર I' }, year: '629 CE', contributions: { en: 'Commentaries on Aryabhata, sine approximation formula', hi: 'आर्यभट पर टीकाएँ, ज्या सन्निकटन सूत्र', sa: 'आर्यभटटीकाः, ज्यासन्निकटनसूत्रम्', mai: 'आर्यभट पर टीका, ज्या सन्निकटन सूत्र', mr: 'आर्यभटावर भाष्ये, ज्या अंदाज सूत्र', ta: 'ஆர்யபட்டர் உரைகள், சைன் தோராய சூத்திரம்', te: 'ఆర్యభట్ట వ్యాఖ్యానాలు, సైన్ అంచనా సూత్రం', bn: 'আর্যভটের ভাষ্য, সাইন সান্নিকট্য সূত্র', kn: 'ಆರ್ಯಭಟ ವ್ಯಾಖ್ಯಾನಗಳು, ಸೈನ್ ಅಂದಾಜು ಸೂತ್ರ', gu: 'આર્યભટ ટીકાઓ, સાઇન અંદાજ સૂત્ર' }, color: 'border-emerald-400/60' },
  { name: { en: 'Mahavira', hi: 'महावीर', sa: 'महावीरः', mai: 'महावीर', mr: 'महावीर', ta: 'மகாவீரர்', te: 'మహావీరుడు', bn: 'মহাবীর', kn: 'ಮಹಾವೀರ', gu: 'મહાવીર' }, year: '850 CE', contributions: { en: 'Detailed fraction operations, combinatorics, Ganita Sara Sangraha', hi: 'विस्तृत भिन्न संक्रियाएँ, क्रमचय-संचय, गणित सार संग्रह', sa: 'विस्तृतभिन्नसङ्क्रियाः, क्रमचयसंचयः, गणितसारसङ्ग्रहः', mai: 'विस्तृत भिन्न संक्रिया, क्रमचय-संचय, गणित सार संग्रह', mr: 'तपशीलवार अपूर्णांक क्रिया, क्रमचय-संचय, गणित सार संग्रह', ta: 'விரிவான பின்ன செயல்பாடுகள், சேர்வியல், கணித சார சங்கிரகம்', te: 'వివరమైన భిన్న సంక్రియలు, క్రమచయ-సంచయం, గణిత సార సంగ్రహం', bn: 'বিস্তৃত ভগ্নাংশ ক্রিয়া, সমবায়বিদ্যা, গণিত সার সংগ্রহ', kn: 'ವಿವರವಾದ ಭಿನ್ನರಾಶಿ ಕಾರ್ಯಗಳು, ಕ್ರಮಚಯ-ಸಂಚಯ, ಗಣಿತ ಸಾರ ಸಂಗ್ರಹ', gu: 'વિગતવાર અપૂર્ણાંક ક્રિયાઓ, ક્રમચય-સંચય, ગણિત સાર સંગ્રહ' }, color: 'border-violet-400/60' },
];

const SANSKRIT_TERMS = [
  { term: 'Hisab al-Hind', transliteration: 'ḥisāb al-hind', meaning: 'Hindu calculation — the Arabic name for Indian arithmetic', devanagari: 'हिसाब अल-हिन्द' },
  { term: 'Shunya', transliteration: 'śūnya', meaning: 'void/empty — became Arabic sifr, then Latin zephirum, then zero', devanagari: 'शून्य' },
  { term: 'Brahmasphutasiddhanta', transliteration: 'Brahma-sphuṭa-siddhānta', meaning: 'The Correctly Established Doctrine of Brahma (628 CE)', devanagari: 'ब्रह्मस्फुटसिद्धान्त' },
  { term: 'Algoritmi', transliteration: 'al-Khwārizmī', meaning: 'Latinized name that gave us the word "algorithm"', devanagari: 'अल्गोरित्मी' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function AlKhwarizmiPage({ params }: { params: Promise<{ locale: string }> }) {
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-gold-primary" />
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
            <div className="inline-flex flex-col items-center bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-8 py-6">
              <span
                className="text-2xl sm:text-3xl text-gold-primary font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {hi ? 'किताब अल-जम्अ वल-तफ़रीक़ बि-हिसाब अल-हिन्द' : 'Kitab al-Jam\' wa-l-Tafriq bi-Hisab al-Hind'}
              </span>
              <span className="text-text-secondary mt-2 text-sm sm:text-base">
                {hi ? '"हिन्दू गणना के अनुसार जोड़ और घटाव की पुस्तक" — अल-ख्वारिज्मी, ~825 ईस्वी' : '"The Book of Addition and Subtraction According to Hindu Calculation" — Al-Khwarizmi, ~825 CE'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p>{t('s1Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: { en: 'Original Title', hi: 'मूल शीर्षक', sa: 'मूलशीर्षकम्', mai: 'मूल शीर्षक', mr: 'मूळ शीर्षक', ta: 'அசல் தலைப்பு', te: 'అసలు శీర్షిక', bn: 'মূল শিরোনাম', kn: 'ಮೂಲ ಶೀರ್ಷಿಕೆ', gu: 'મૂળ શીર્ષક' }, value: "Kitab al-Jam' wa-l-Tafriq bi-Hisab al-Hind", color: 'border-gold-primary/30' },
              { label: { en: 'Translation', hi: 'अनुवाद', sa: 'अनुवादः', mai: 'अनुवाद', mr: 'अनुवाद', ta: 'மொழிபெயர்ப்பு', te: 'అనువాదం', bn: 'অনুবাদ', kn: 'ಅನುವಾದ', gu: 'અનુવાદ' }, value: { en: 'The Book of Addition and Subtraction According to Hindu Calculation', hi: 'हिन्दू गणना के अनुसार जोड़ और घटाव की पुस्तक', sa: 'हिन्दूगणनानुसारं योगवियोगपुस्तकम्', mai: 'हिन्दू गणनाक अनुसार जोड़ आ घटावक किताब', mr: 'हिंदू गणनेनुसार बेरीज आणि वजाबाकीचे पुस्तक', ta: 'இந்துக் கணக்கீட்டின்படி கூட்டல் மற்றும் கழித்தல் புத்தகம்', te: 'హిందూ లెక్కింపు ప్రకారం కూడిక మరియు తీసివేత పుస్తకం', bn: 'হিন্দু গণনা অনুসারে যোগ ও বিয়োগের বই', kn: 'ಹಿಂದೂ ಲೆಕ್ಕಾಚಾರದ ಪ್ರಕಾರ ಸೇರ್ಪಡೆ ಮತ್ತು ಕಳೆಯುವಿಕೆಯ ಪುಸ್ತಕ', gu: 'હિન્દુ ગણતરી મુજબ સરવાળા અને બાદબાકીનું પુસ્તક' }, color: 'border-amber-400/30' },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 bg-white/[0.02] border ${item.color}`}
              >
                <div className="text-gold-light font-bold mb-2">{typeof item.label === 'string' ? item.label : lt(item.label as LocaleText, locale)}</div>
                <div className="text-text-secondary text-sm">{typeof item.value === 'string' ? item.value : lt(item.value as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Body')}</p>
          <div className="mt-6 space-y-3">
            {WHAT_HE_TRANSMITTED.map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${item.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <span className="text-gold-primary/60 text-xs font-mono">{i + 1}.</span>
                </div>
                <div className="flex-1">
                  <div className="text-text-primary text-sm">{lt(item.item as LocaleText, locale)}</div>
                  <div className="text-text-secondary/70 text-xs mt-1">{hi ? 'स्रोत:' : 'Source:'} {item.source}</div>
                </div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
          <div className="mt-6 space-y-4">
            {TRANSMISSION_CHAIN.map((stop, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${stop.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center">
                    <span className="text-gold-primary font-bold text-sm">{stop.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-gold-light font-semibold text-sm">{lt(stop.label as LocaleText, locale)}</div>
                  <div className="text-text-secondary text-xs mt-1">{stop.detail}</div>
                  <div className="text-text-secondary/60 text-xs mt-0.5">{stop.period}</div>
                </div>
                {i < TRANSMISSION_CHAIN.length - 1 && (
                  <div className="flex-shrink-0 self-center">
                    <ArrowRight className="w-4 h-4 text-gold-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { term: { en: '"Arabic Numerals"', hi: '"अरबी अंक"', sa: '"अरबीअङ्काः"', mai: '"अरबी अंक"', mr: '"अरबी अंक"', ta: '"அரபு எண்கள்"', te: '"అరబిక్ అంకెలు"', bn: '"আরবি সংখ্যা"', kn: '"ಅರೇಬಿಕ್ ಅಂಕಿಗಳು"', gu: '"અરબી અંકો"' }, desc: { en: 'What Europe called them', hi: 'यूरोप ने इन्हें क्या कहा', sa: 'यूरोपः तान् किम् अवदत्', mai: 'यूरोप एकरा की कहलक', mr: 'युरोपने त्यांना काय म्हटले', ta: 'ஐரோப்பா அவற்றை எவ்வாறு அழைத்தது', te: 'ఐరోపా వాటిని ఏమని పిలిచింది', bn: 'ইউরোপ এগুলিকে কী বলেছিল', kn: 'ಯೂರೋಪ್ ಅವುಗಳನ್ನು ಏನೆಂದು ಕರೆಯಿತು', gu: 'યુરોપે તેમને શું કહ્યા' }, color: 'border-red-500/30' },
              { term: { en: '"Hindu Numerals"', hi: '"हिन्दू अंक"', sa: '"हिन्दूअङ्काः"', mai: '"हिन्दू अंक"', mr: '"हिंदू अंक"', ta: '"இந்து எண்கள்"', te: '"హిందూ అంకెలు"', bn: '"হিন্দু সংখ্যা"', kn: '"ಹಿಂದೂ ಅಂಕಿಗಳು"', gu: '"હિન્દુ અંકો"' }, desc: { en: 'What Arabs called them (al-arqam al-hindiyyah)', hi: 'अरबों ने इन्हें क्या कहा (अल-अरक़ाम अल-हिन्दिय्या)', sa: 'अरबाः तान् किम् अवदन् (अल्-अर्क़ाम् अल्-हिन्दिय्या)', mai: 'अरब लोक एकरा की कहलनि (अल-अरक़ाम अल-हिन्दिय्या)', mr: 'अरबांनी त्यांना काय म्हटले (अल-अरक़ाम अल-हिन्दिय्या)', ta: 'அரபியர் அவற்றை எவ்வாறு அழைத்தனர் (அல்-அர்காம் அல்-ஹிந்தியா)', te: 'అరబ్బులు వాటిని ఏమని పిలిచారు (అల్-అర్కాం అల్-హిందియ్యా)', bn: 'আরবরা এগুলিকে কী বলেছিল (আল-আরকাম আল-হিন্দিয়্যা)', kn: 'ಅರಬ್ಬರು ಅವುಗಳನ್ನು ಏನೆಂದು ಕರೆದರು (ಅಲ್-ಅರ್ಕಾಮ್ ಅಲ್-ಹಿಂದಿಯ್ಯಾ)', gu: 'અરબોએ તેમને શું કહ્યા (અલ-અરકામ અલ-હિન્દિય્યા)' }, color: 'border-emerald-500/30' },
              { term: { en: '"Hindsa"', hi: '"हिन्दसा"', sa: '"हिन्दसा"', mai: '"हिन्दसा"', mr: '"हिन्दसा"', ta: '"ஹிந்த்ஸா"', te: '"హిందసా"', bn: '"হিন্দসা"', kn: '"ಹಿಂದ್ಸಾ"', gu: '"હિન્દસા"' }, desc: { en: 'Arabic word for numerals — from "Hind" (India)', hi: 'अंकों का अरबी शब्द — "हिन्द" (भारत) से', sa: 'अङ्कानां अरबीशब्दः — "हिन्द" (भारतम्) इत्यस्मात्', mai: 'अंकक अरबी शब्द — "हिन्द" (भारत) सँ', mr: 'अंकांसाठी अरबी शब्द — "हिंद" (भारत) पासून', ta: 'எண்களுக்கான அரபு வார்த்தை — "ஹிந்த்" (இந்தியா) இலிருந்து', te: 'అంకెలకు అరబిక్ పదం — "హింద్" (భారతదేశం) నుండి', bn: 'সংখ্যার জন্য আরবি শব্দ — "হিন্দ" (ভারত) থেকে', kn: 'ಅಂಕಿಗಳ ಅರೇಬಿಕ್ ಪದ — "ಹಿಂದ್" (ಭಾರತ) ಇಂದ', gu: 'અંકો માટે અરબી શબ્દ — "હિન્દ" (ભારત) પરથી' }, color: 'border-blue-500/30' },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 bg-white/[0.02] border ${item.color}`}
              >
                <div className="text-gold-light font-bold mb-2 text-lg">{lt(item.term as LocaleText, locale)}</div>
                <div className="text-text-secondary text-sm">{lt(item.desc as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <p>{t('s5Body')}</p>
          <div
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div className="text-gold-primary/60 text-xs uppercase tracking-widest mb-3 font-bold">
              {hi ? 'शब्द व्युत्पत्ति' : 'Etymology'}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              {[
                { word: 'Al-Khwarizmi', sub: { en: 'Persian name', hi: 'फ़ारसी नाम' } },
                { word: '→', sub: { en: '', hi: '' } },
                { word: 'Algoritmi', sub: { en: 'Latinized', hi: 'लैटिनीकृत' } },
                { word: '→', sub: { en: '', hi: '' } },
                { word: 'Algorithm', sub: { en: 'English', hi: 'अंग्रेजी' } },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg sm:text-xl font-bold ${item.word === '→' ? 'text-gold-primary/40' : 'text-gold-light'}`}>
                    {item.word}
                  </div>
                  {item.sub.en && (
                    <div className="text-text-secondary/60 text-xs mt-0.5">{hi ? item.sub.hi : item.sub.en}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-text-secondary/60 text-xs mt-4 italic">
              {hi ? 'शब्द "एल्गोरिदम" अल-ख्वारिज्मी के नाम से आया — लेकिन जो प्रक्रियाएँ उन्होंने वर्णित कीं, वे भारतीय मूल की थीं' : 'The word "algorithm" came from his name — but the procedures he described were Indian in origin'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 space-y-4">
            {INDIAN_SOURCES.map((source, i) => (
              <div
                key={i}
                className={`rounded-xl bg-white/[0.02] border-l-4 ${source.color} p-5`}
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-gold-light font-bold text-lg">{lt(source.name as LocaleText, locale)}</span>
                  <span className="text-gold-primary/50 text-xs font-mono">{source.year}</span>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed">{lt(source.contributions as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t('s7Title')} variant="formula">
          <p>{t('s7Body')}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Hash className="w-5 h-5" />, label: { en: 'Numeral System', hi: 'अंक प्रणाली', sa: 'अङ्कप्रणाली', mai: 'अंक प्रणाली', mr: 'अंक प्रणाली', ta: 'எண் முறை', te: 'అంక వ్యవస్థ', bn: 'সংখ্যা পদ্ধতি', kn: 'ಅಂಕಿ ವ್ಯವಸ್ಥೆ', gu: 'અંક પ્રણાલી' }, dep: { en: 'Used by 8 billion people', hi: '8 अरब लोग उपयोग करते हैं', sa: '8 अर्बुदजनाः उपयुञ्जन्ति', mai: '8 अरब लोक उपयोग करैत छथि', mr: '8 अब्ज लोक वापरतात', ta: '8 பில்லியன் மக்கள் பயன்படுத்துகின்றனர்', te: '8 బిలియన్ మంది ఉపయోగిస్తారు', bn: '8 বিলিয়ন মানুষ ব্যবহার করে', kn: '8 ಬಿಲಿಯನ್ ಜನರು ಬಳಸುತ್ತಾರೆ', gu: '8 અબજ લોકો ઉપયોગ કરે છે' } },
              { icon: <Globe className="w-5 h-5" />, label: { en: 'Zero', hi: 'शून्य', sa: 'शून्यम्', mai: 'शून्य', mr: 'शून्य', ta: 'சுழியம்', te: 'సున్నా', bn: 'শূন্য', kn: 'ಸೊನ್ನೆ', gu: 'શૂન્ય' }, dep: { en: 'Foundation of computing', hi: 'कंप्यूटिंग की नींव', sa: 'गणनायाः आधारः', mai: 'कंप्यूटिंगक नींव', mr: 'संगणनाचा पाया', ta: 'கணிப்பொறியின் அடிப்படை', te: 'కంప్యూటింగ్ పునాది', bn: 'কম্পিউটিংয়ের ভিত্তি', kn: 'ಕಂಪ್ಯೂಟಿಂಗ್ ಅಡಿಪಾಯ', gu: 'કમ્પ્યુટિંગનો પાયો' } },
              { icon: <BookOpen className="w-5 h-5" />, label: { en: 'Algebra', hi: 'बीजगणित', sa: 'बीजगणितम्', mai: 'बीजगणित', mr: 'बीजगणित', ta: 'இயற்கணிதம்', te: 'బీజగణితం', bn: 'বীজগণিত', kn: 'ಬೀಜಗಣಿತ', gu: 'બીજગણિત' }, dep: { en: 'Indian quadratic methods', hi: 'भारतीय द्विघात विधियाँ', sa: 'भारतीयद्विघातविधयः', mai: 'भारतीय द्विघात विधि', mr: 'भारतीय वर्ग पद्धती', ta: 'இந்திய இருபடி முறைகள்', te: 'భారతీయ వర్గ పద్ధతులు', bn: 'ভারতীয় দ্বিঘাত পদ্ধতি', kn: 'ಭಾರತೀಯ ವರ್ಗ ವಿಧಾನಗಳು', gu: 'ભારતીય દ્વિઘાત પદ્ધતિઓ' } },
              { icon: <ArrowRight className="w-5 h-5" />, label: { en: 'Algorithms', hi: 'एल्गोरिदम', sa: 'अल्गोरिदमाः', mai: 'एल्गोरिदम', mr: 'अल्गोरिदम', ta: 'வழிமுறைகள்', te: 'అల్గారిథమ్‌లు', bn: 'অ্যালগরিদম', kn: 'ಅಲ್ಗಾರಿದಮ್‌ಗಳು', gu: 'અલ્ગોરિધમ' }, dep: { en: 'Power every computer', hi: 'हर कंप्यूटर को शक्ति दें', sa: 'सर्वं सङ्गणकम् शक्तिं ददाति', mai: 'हर कंप्यूटरकेँ शक्ति दैत अछि', mr: 'प्रत्येक संगणकाला शक्ती देतात', ta: 'ஒவ்வொரு கணினிக்கும் சக்தி', te: 'ప్రతి కంప్యూటర్‌కు శక్తి', bn: 'প্রতিটি কম্পিউটারকে চালায়', kn: 'ಪ್ರತಿ ಕಂಪ್ಯೂಟರ್‌ಗೆ ಶಕ್ತಿ', gu: 'દરેક કમ્પ્યુટરને શક્તિ' } },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/[0.03] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-primary flex justify-center mb-2">{item.icon}</div>
                <div className="text-gold-light font-semibold text-sm">{lt(item.label as LocaleText, locale)}</div>
                <div className="text-text-secondary text-xs mt-1">{lt(item.dep as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य शब्द' : 'Key Terms'}>
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
            href="/learn/contributions/zero"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {hi ? 'अगला: शून्य का आविष्कार' : 'Next: The Invention of Zero'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
