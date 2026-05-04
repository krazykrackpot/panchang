import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Circle, Cpu, Globe } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-zero.json';

export const revalidate = 604800; // 7 days — static educational content



/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BRAHMAGUPTA_RULES = [
  { rule: { en: 'zero + zero = zero', hi: 'शून्य + शून्य = शून्य', sa: 'शून्य + शून्य = शून्य', mai: 'शून्य + शून्य = शून्य', mr: 'शून्य + शून्य = शून्य', ta: 'சுழியம் + சுழியம் = சுழியம்', te: 'సున్నా + సున్నా = సున్నా', bn: 'শূন্য + শূন্য = শূন্য', kn: 'ಸೊನ್ನೆ + ಸೊನ್ನೆ = ಸೊನ್ನೆ', gu: 'શૂન્ય + શૂન્ય = શૂન્ય' }, sanskrit: 'शून्यं शून्येन संयुक्तं शून्यम्' },
  { rule: { en: 'positive + zero = positive', hi: 'धन + शून्य = धन', sa: 'धन + शून्य = धन', mai: 'धन + शून्य = धन', mr: 'धन + शून्य = धन', ta: 'நேர்மறை + சுழியம் = நேர்மறை', te: 'ధనాత్మకం + సున్నా = ధనాత్మకం', bn: 'ধনাত্মক + শূন্য = ধনাত্মক', kn: 'ಧನಾತ್ಮಕ + ಸೊನ್ನೆ = ಧನಾತ್ಮಕ', gu: 'ધન + શૂન્ય = ધન' }, sanskrit: 'धनं शून्येन संयुक्तं धनम्' },
  { rule: { en: 'negative + zero = negative', hi: 'ऋण + शून्य = ऋण', sa: 'ऋण + शून्य = ऋण', mai: 'ऋण + शून्य = ऋण', mr: 'ऋण + शून्य = ऋण', ta: 'எதிர்மறை + சுழியம் = எதிர்மறை', te: 'ఋణాత్మకం + సున్నా = ఋణాత్మకం', bn: 'ঋণাত্মক + শূন্য = ঋণাত্মক', kn: 'ಋಣಾತ್ಮಕ + ಸೊನ್ನೆ = ಋಣಾತ್ಮಕ', gu: 'ઋણ + શૂન્ય = ઋણ' }, sanskrit: 'ऋणं शून्येन संयुक्तं ऋणम्' },
  { rule: { en: 'zero × any number = zero', hi: 'शून्य × कोई भी = शून्य', sa: 'शून्य × कोई भी = शून्य', mai: 'शून्य × कोई भी = शून्य', mr: 'शून्य × कोई भी = शून्य', ta: 'சுழியம் × எந்த எண்ணும் = சுழியம்', te: 'సున్నా × ఏ సంఖ్య = సున్నా', bn: 'শূন্য × যেকোনো সংখ্যা = শূন্য', kn: 'ಸೊನ್ನೆ × ಯಾವುದೇ ಸಂಖ್ಯೆ = ಸೊನ್ನೆ', gu: 'શૂન્ય × કોઈ પણ = શૂન્ય' }, sanskrit: 'शून्यं धनर्णयोः कृतिः शून्यम्' },
  { rule: { en: 'positive × negative = negative', hi: 'धन × ऋण = ऋण', sa: 'धन × ऋण = ऋण', mai: 'धन × ऋण = ऋण', mr: 'धन × ऋण = ऋण', ta: 'நேர்மறை × எதிர்மறை = எதிர்மறை', te: 'ధనాత్మకం × ఋణాత్మకం = ఋణాత్మకం', bn: 'ধনাত্মক × ঋণাত্মক = ঋণাত্মক', kn: 'ಧನಾತ್ಮಕ × ಋಣಾತ್ಮಕ = ಋಣಾತ್ಮಕ', gu: 'ધન × ઋણ = ઋણ' }, sanskrit: 'धनर्णयोः घातो ऋणम्' },
  { rule: { en: '0 ÷ 0 = 0 (his one error!)', hi: '0 ÷ 0 = 0 (उनकी एकमात्र त्रुटि!)', sa: '0 ÷ 0 = 0 (उनकी एकमात्र त्रुटि!)', mai: '0 ÷ 0 = 0 (उनकी एकमात्र त्रुटि!)', mr: '0 ÷ 0 = 0 (उनकी एकमात्र त्रुटि!)', ta: '0 ÷ 0 = 0 (அவரது ஒரே பிழை!)', te: '0 ÷ 0 = 0 (అతని ఒక్క తప్పు!)', bn: '0 ÷ 0 = 0 (তাঁর একমাত্র ভুল!)', kn: '0 ÷ 0 = 0 (ಅವರ ಒಂದು ತಪ್ಪು!)', gu: '0 ÷ 0 = 0 (તેમની એક ભૂલ!)' }, sanskrit: 'शून्यं शून्यहृतं शून्यम् ✗' },
];

const JOURNEY = [
  { year: '~300 CE', place: { en: 'Bakhshali, India', hi: 'बख्शाली, भारत', sa: 'बख्शाली, भारत', mai: 'बख्शाली, भारत', mr: 'बख्शाली, भारत', ta: 'பக்ஷாலி, இந்தியா', te: 'బఖ్షాలి, భారతదేశం', bn: 'বখশালি, ভারত', kn: 'ಬಖ್ಷಾಲಿ, ಭಾರತ', gu: 'બખશાલી, ભારત' }, event: { en: 'Earliest physical zero dot on birch bark manuscript', hi: 'भोजपत्र पांडुलिपि पर सबसे पुराना भौतिक शून्य बिंदु', sa: 'भोजपत्र पांडुलिपि पर सबसे पुराना भौतिक शून्य बिंदु', mai: 'भोजपत्र पांडुलिपि पर सबसे पुराना भौतिक शून्य बिंदु', mr: 'भोजपत्र पांडुलिपि पर सबसे पुराना भौतिक शून्य बिंदु', ta: 'பூர்ஜ பட்டை கையெழுத்துப் பிரதியில் மிகப் பழமையான சுழியப் புள்ளி', te: 'భూర్జ పత్ర వ్రాతప్రతిపై తొలి భౌతిక సున్నా చుక్క', bn: 'ভূর্জপত্র পাণ্ডুলিপিতে প্রাচীনতম শূন্য বিন্দু', kn: 'ಭೂರ್ಜ ತೊಗಟೆ ಹಸ್ತಪ್ರತಿಯಲ್ಲಿ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಸೊನ್ನೆ ಚುಕ್ಕೆ', gu: 'ભોજપત્ર હસ્તપ્રતમાં સૌથી જૂનું શૂન્ય ચિહ્ન' }, color: 'border-gold-primary/60' },
  { year: '628 CE', place: { en: 'Ujjain, India', hi: 'उज्जैन, भारत', sa: 'उज्जैन, भारत', mai: 'उज्जैन, भारत', mr: 'उज्जैन, भारत', ta: 'உஜ்ஜைன், இந்தியா', te: 'ఉజ్జయిని, భారతదేశం', bn: 'উজ্জয়িনী, ভারত', kn: 'ಉಜ್ಜಯಿನಿ, ಭಾರತ', gu: 'ઉજ્જૈન, ભારત' }, event: { en: 'Brahmagupta defines zero as a full number with arithmetic rules', hi: 'ब्रह्मगुप्त शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करते हैं', sa: 'ब्रह्मगुप्त शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करते हैं', mai: 'ब्रह्मगुप्त शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करते हैं', mr: 'ब्रह्मगुप्त शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करते हैं', ta: 'பிரம்மகுப்தர் சுழியத்தை கணித விதிகளுடன் முழு எண்ணாக வரையறுக்கிறார்', te: 'బ్రహ్మగుప్తుడు సున్నాను అంకగణిత నియమాలతో పూర్తి సంఖ్యగా నిర్వచిస్తాడు', bn: 'ব্রহ্মগুপ্ত শূন্যকে পাটিগণিত নিয়মসহ পূর্ণ সংখ্যা হিসেবে সংজ্ঞায়িত করেন', kn: 'ಬ್ರಹ್ಮಗುಪ್ತರು ಸೊನ್ನೆಯನ್ನು ಅಂಕಗಣಿತ ನಿಯಮಗಳೊಂದಿಗೆ ಪೂರ್ಣ ಸಂಖ್ಯೆಯಾಗಿ ವ್ಯಾಖ್ಯಾನಿಸುತ್ತಾರೆ', gu: 'બ્રહ્મગુપ્ત શૂન્યને અંકગણિત નિયમો સાથે પૂર્ણ સંખ્યા તરીકે વ્યાખ્યાયિત કરે છે' }, color: 'border-amber-400/60' },
  { year: '825 CE', place: { en: 'Baghdad, Iraq', hi: 'बगदाद, इराक', sa: 'बगदाद, इराक', mai: 'बगदाद, इराक', mr: 'बगदाद, इराक', ta: 'பாக்தாத், ஈராக்', te: 'బాగ్దాద్, ఇరాక్', bn: 'বাগদাদ, ইরাক', kn: 'ಬಾಗ್ದಾದ್, ಇರಾಕ್', gu: 'બગદાદ, ઇરાક' }, event: { en: "Al-Khwarizmi translates Indian numerals — gives us 'algorithm'", hi: 'अल-ख्वारिज्मी भारतीय अंकों का अनुवाद करते हैं — हमें "एल्गोरिदम" देते हैं', sa: 'अल-ख्वारिज्मी भारतीय अंकों का अनुवाद करते हैं — हमें "एल्गोरिदम" देते हैं', mai: 'अल-ख्वारिज्मी भारतीय अंकों का अनुवाद करते हैं — हमें "एल्गोरिदम" देते हैं', mr: 'अल-ख्वारिज्मी भारतीय अंकों का अनुवाद करते हैं — हमें "एल्गोरिदम" देते हैं', ta: "அல்-குவாரிஸ்மி இந்திய எண்களை மொழிபெயர்க்கிறார் — 'அல்காரிதம்' தருகிறார்", te: "అల్-ఖ్వారిజ్మీ భారతీయ అంకెలను అనువదిస్తాడు — 'అల్గోరిథమ్' ఇస్తాడు", bn: "আল-খোয়ারিজমি ভারতীয় সংখ্যা অনুবাদ করেন — 'অ্যালগরিদম' দেন", kn: "ಅಲ್-ಖ್ವಾರಿಜ್ಮಿ ಭಾರತೀಯ ಅಂಕಿಗಳನ್ನು ಅನುವಾದಿಸುತ್ತಾರೆ — 'ಅಲ್ಗಾರಿದಮ್' ನೀಡುತ್ತಾರೆ", gu: "અલ-ખ્વારિઝમી ભારતીય અંકોનો અનુવાદ કરે છે — 'અલ્ગોરિધમ' આપે છે" }, color: 'border-blue-400/60' },
  { year: '1202 CE', place: { en: 'Pisa, Italy', hi: 'पीसा, इटली', sa: 'पीसा, इटली', mai: 'पीसा, इटली', mr: 'पीसा, इटली', ta: 'பீசா, இத்தாலி', te: 'పిసా, ఇటలీ', bn: 'পিসা, ইতালি', kn: 'ಪಿಸಾ, ಇಟಲಿ', gu: 'પિસા, ઇટાલી' }, event: { en: 'Fibonacci publishes Liber Abaci, introducing zero to Europe', hi: 'फिबोनाची लिबर अबासी प्रकाशित करते हैं, यूरोप को शून्य से परिचित कराते हैं', sa: 'फिबोनाची लिबर अबासी प्रकाशित करते हैं, यूरोप को शून्य से परिचित कराते हैं', mai: 'फिबोनाची लिबर अबासी प्रकाशित करते हैं, यूरोप को शून्य से परिचित कराते हैं', mr: 'फिबोनाची लिबर अबासी प्रकाशित करते हैं, यूरोप को शून्य से परिचित कराते हैं', ta: 'ஃபிபொனச்சி லிபர் அபாசியை வெளியிடுகிறார், ஐரோப்பாவுக்கு சுழியத்தை அறிமுகப்படுத்துகிறார்', te: 'ఫిబొనాచీ లిబర్ అబాసిని ప్రచురిస్తాడు, ఐరోపాకు సున్నాను పరిచయం చేస్తాడు', bn: 'ফিবোনাচ্চি লিবের আবাসি প্রকাশ করেন, ইউরোপে শূন্য পরিচয় করান', kn: 'ಫಿಬೊನಾಚಿ ಲಿಬರ್ ಅಬಾಸಿ ಪ್ರಕಟಿಸುತ್ತಾರೆ, ಯೂರೋಪ್‌ಗೆ ಸೊನ್ನೆಯನ್ನು ಪರಿಚಯಿಸುತ್ತಾರೆ', gu: 'ફિબોનાચી લિબર અબાસી પ્રકાશિત કરે છે, યુરોપને શૂન્યનો પરિચય કરાવે છે' }, color: 'border-emerald-400/60' },
  { year: '1299 CE', place: { en: 'Florence, Italy', hi: 'फ्लोरेंस, इटली', sa: 'फ्लोरेंस, इटली', mai: 'फ्लोरेंस, इटली', mr: 'फ्लोरेंस, इटली', ta: 'புளோரன்ஸ், இத்தாலி', te: 'ఫ్లారెన్స్, ఇటలీ', bn: 'ফ্লোরেন্স, ইতালি', kn: 'ಫ್ಲಾರೆನ್ಸ್, ಇಟಲಿ', gu: 'ફ્લોરેન્સ, ઇટાલી' }, event: { en: "Florence BANS Indian numerals — calls them 'Saracen numerals'", hi: 'फ्लोरेंस ने भारतीय अंकों पर प्रतिबंध लगाया — उन्हें "सारासेन अंक" कहा', sa: 'फ्लोरेंस ने भारतीय अंकों पर प्रतिबंध लगाया — उन्हें "सारासेन अंक" कहा', mai: 'फ्लोरेंस ने भारतीय अंकों पर प्रतिबंध लगाया — उन्हें "सारासेन अंक" कहा', mr: 'फ्लोरेंस ने भारतीय अंकों पर प्रतिबंध लगाया — उन्हें "सारासेन अंक" कहा', ta: "புளோரன்ஸ் இந்திய எண்களைத் தடை செய்கிறது — 'சாரசன் எண்கள்' என்கிறது", te: "ఫ్లారెన్స్ భారతీయ అంకెలను నిషేధిస్తుంది — 'సారసెన్ అంకెలు' అంటుంది", bn: "ফ্লোরেন্স ভারতীয় সংখ্যা নিষিদ্ধ করে — 'স্যারাসেন সংখ্যা' বলে", kn: "ಫ್ಲಾರೆನ್ಸ್ ಭಾರತೀಯ ಅಂಕಿಗಳನ್ನು ನಿಷೇಧಿಸುತ್ತದೆ — 'ಸಾರಸೆನ್ ಅಂಕಿಗಳು' ಎನ್ನುತ್ತದೆ", gu: "ફ્લોરેન્સ ભારતીય અંકો પર પ્રતિબંધ મૂકે છે — 'સારાસેન અંકો' કહે છે" }, color: 'border-red-400/60' },
  { year: '~1500 CE', place: { en: 'All of Europe', hi: 'सारा यूरोप', sa: 'सारा यूरोप', mai: 'सारा यूरोप', mr: 'सारा यूरोप', ta: 'முழு ஐரோப்பா', te: 'మొత్తం ఐరోపా', bn: 'সমগ্র ইউরোপ', kn: 'ಇಡೀ ಯೂರೋಪ್', gu: 'સમગ્ર યુરોપ' }, event: { en: 'Indian numerals finally win. Zero universally accepted. Modern math begins.', hi: 'भारतीय अंक अंततः जीत गए। शून्य सार्वभौमिक रूप से स्वीकृत। आधुनिक गणित शुरू।', sa: 'भारतीय अंक अंततः जीत गए। शून्य सार्वभौमिक रूप से स्वीकृत। आधुनिक गणित शुरू।', mai: 'भारतीय अंक अंततः जीत गए। शून्य सार्वभौमिक रूप से स्वीकृत। आधुनिक गणित शुरू।', mr: 'भारतीय अंक अंततः जीत गए। शून्य सार्वभौमिक रूप से स्वीकृत। आधुनिक गणित शुरू।', ta: 'இந்திய எண்கள் இறுதியில் வெற்றி பெறுகின்றன. சுழியம் உலகளவில் ஏற்கப்படுகிறது. நவீன கணிதம் தொடங்குகிறது.', te: 'భారతీయ అంకెలు చివరకు గెలుస్తాయి. సున్నా విశ్వవ్యాప్తంగా ఆమోదించబడింది. ఆధునిక గణితం ప్రారంభమవుతుంది.', bn: 'ভারতীয় সংখ্যা অবশেষে জয়ী হয়। শূন্য সর্বজনীনভাবে গৃহীত। আধুনিক গণিত শুরু হয়।', kn: 'ಭಾರತೀಯ ಅಂಕಿಗಳು ಅಂತಿಮವಾಗಿ ಗೆಲ್ಲುತ್ತವೆ. ಸೊನ್ನೆ ಸಾರ್ವತ್ರಿಕವಾಗಿ ಸ್ವೀಕೃತ. ಆಧುನಿಕ ಗಣಿತ ಪ್ರಾರಂಭ.', gu: 'ભારતીય અંકો આખરે જીતે છે. શૂન્ય સાર્વભૌમિક રીતે સ્વીકૃત. આધુનિક ગણિત શરૂ થાય છે.' }, color: 'border-violet-400/60' },
];

const SANSKRIT_TERMS = [
  { term: 'Shunya', transliteration: 'śūnya', meaning: 'void, empty — the philosophical concept behind zero', devanagari: 'शून्य' },
  { term: 'Brahmasphutasiddhanta', transliteration: 'Brahma-sphuṭa-siddhānta', meaning: 'The Correctly Established Doctrine of Brahma (628 CE)', devanagari: 'ब्रह्मस्फुटसिद्धान्त' },
  { term: 'Kuttaka', transliteration: 'kuṭṭaka', meaning: 'Pulverizer — Chapter 18 where zero rules appear', devanagari: 'कुट्टक' },
  { term: 'Ananta', transliteration: 'ananta', meaning: 'infinity — introduced by Bhaskara II for n÷0', devanagari: 'अनन्त' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function ZeroPage({ params }: { params: Promise<{ locale: string }> }) {
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
                <Circle className="w-10 h-10 text-gold-primary" />
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
                className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-gold-primary via-yellow-300 to-gold-primary bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                0
              </span>
              <span className="text-text-secondary mt-2 text-sm sm:text-base">
                {hi ? 'ब्रह्मगुप्त द्वारा परिभाषित, 628 ईस्वी — उज्जैन, भारत' : 'Defined by Brahmagupta, 628 CE — Ujjain, India'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <p>{t('s1Body')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { civ: 'Rome', problem: { en: 'No zero → counting boards required for every calculation', hi: 'शून्य नहीं → हर गणना के लिए काउंटिंग बोर्ड चाहिए', sa: 'शून्य नहीं → हर गणना के लिए काउंटिंग बोर्ड चाहिए', mai: 'शून्य नहीं → हर गणना के लिए काउंटिंग बोर्ड चाहिए', mr: 'शून्य नहीं → हर गणना के लिए काउंटिंग बोर्ड चाहिए', ta: 'சுழியம் இல்லை → ஒவ்வொரு கணக்கீட்டிற்கும் எண்ணும் பலகை தேவை', te: 'సున్నా లేదు → ప్రతి గణనకు లెక్కింపు పలకలు అవసరం', bn: 'শূন্য নেই → প্রতিটি গণনার জন্য গণনা বোর্ড প্রয়োজন', kn: 'ಸೊನ್ನೆ ಇಲ್ಲ → ಪ್ರತಿ ಲೆಕ್ಕಾಚಾರಕ್ಕೂ ಎಣಿಕೆ ಹಲಗೆ ಬೇಕು', gu: 'શૂન્ય નથી → દરેક ગણતરી માટે ગણતરી પાટિયાં જરૂરી' }, color: 'border-red-500/30' },
              { civ: 'Greece', problem: { en: 'Philosophical block — "Nothing cannot be Something"', hi: 'दार्शनिक बाधा — "शून्य कुछ नहीं हो सकता"', sa: 'दार्शनिक बाधा — "शून्य कुछ नहीं हो सकता"', mai: 'दार्शनिक बाधा — "शून्य कुछ नहीं हो सकता"', mr: 'दार्शनिक बाधा — "शून्य कुछ नहीं हो सकता"', ta: 'தத்துவத் தடை — "ஒன்றுமில்லாமை ஒன்று ஆக முடியாது"', te: 'తాత్విక అడ్డంకి — "శూన్యం ఏదైనా కాలేదు"', bn: 'দার্শনিক বাধা — "শূন্য কিছু হতে পারে না"', kn: 'ತಾತ್ವಿಕ ಅಡಚಣೆ — "ಏನೂ ಇಲ್ಲದ್ದು ಏನಾದರೂ ಆಗಲಾರದು"', gu: 'દાર્શનિક અવરોધ — "કંઈ નહીં તે કંઈક ન બની શકે"' }, color: 'border-blue-500/30' },
              { civ: 'Babylon', problem: { en: 'Placeholder zero only — never a number', hi: 'केवल स्थान-धारक शून्य — कभी संख्या नहीं', sa: 'केवल स्थान-धारक शून्य — कभी संख्या नहीं', mai: 'केवल स्थान-धारक शून्य — कभी संख्या नहीं', mr: 'केवल स्थान-धारक शून्य — कभी संख्या नहीं', ta: 'இடம் பிடிப்பான் சுழியம் மட்டும் — ஒருபோதும் எண் அல்ல', te: 'ప్లేస్‌హోల్డర్ సున్నా మాత్రమే — ఎప్పుడూ సంఖ్య కాదు', bn: 'শুধু স্থানধারক শূন্য — কখনো সংখ্যা নয়', kn: 'ಸ್ಥಳಧಾರಕ ಸೊನ್ನೆ ಮಾತ್ರ — ಎಂದಿಗೂ ಸಂಖ್ಯೆ ಅಲ್ಲ', gu: 'માત્ર સ્થાનધારક શૂન્ય — ક્યારેય સંખ્યા નહીં' }, color: 'border-amber-500/30' },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 bg-white/[0.02] border ${item.color}`}
              >
                <div className="text-gold-light font-bold mb-2">{item.civ}</div>
                <div className="text-text-secondary text-sm">{lt(item.problem as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Intro')}</p>

          <div
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-2xl sm:text-3xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {t('s2QuoteMain')}
            </div>
            <div className="text-gold-light/70 text-sm italic">{t('s2QuoteTrans')}</div>
            <div className="text-text-secondary/60 text-xs mt-1">— Brahmasphutasiddhanta, Ch. 18, 628 CE</div>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'ब्रह्मगुप्त के शून्य के 6 नियम' : "Brahmagupta's 6 Rules for Zero"}
            </h4>
            {BRAHMAGUPTA_RULES.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3"
              >
                <span className="text-gold-primary/60 text-xs font-mono w-5 flex-shrink-0">{i + 1}.</span>
                <span className="text-text-primary text-sm flex-1">{lt(item.rule as LocaleText, locale)}</span>
                <span
                  className="text-gold-primary/50 text-xs hidden sm:block"
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  {item.sanskrit}
                </span>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="bg-white/[0.03] border border-gold-primary/20 rounded-xl p-5 text-center flex-1 max-w-xs">
              <div className="text-4xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>·</div>
              <div className="text-gold-light font-semibold text-sm">{hi ? 'बख्शाली बिंदु (~300 ईस्वी)' : 'Bakhshali dot (~300 CE)'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'पृथ्वी पर सबसे पुराना शून्य' : "Earth's oldest zero"}</div>
            </div>
            <ArrowRight className="text-gold-primary/50 w-6 h-6 rotate-0 sm:rotate-0" />
            <div className="bg-white/[0.03] border border-gold-primary/20 rounded-xl p-5 text-center flex-1 max-w-xs">
              <div className="text-4xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>0</div>
              <div className="text-gold-light font-semibold text-sm">{hi ? 'ब्रह्मगुप्त संख्या (628 ईस्वी)' : 'Brahmagupta number (628 CE)'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'स्थान-धारक से पूर्ण संख्या' : 'Placeholder to full number'}</div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-6 overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'सभ्यता' : 'Civilization'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'शून्य का प्रकार' : 'Zero Type'}</th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold">{hi ? 'अंकगणित?' : 'Arithmetic?'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { civ: 'Babylon (~300 BCE)', type: { en: 'Placeholder only', hi: 'केवल स्थान-धारक', sa: 'केवल स्थान-धारक', mai: 'केवल स्थान-धारक', mr: 'केवल स्थान-धारक', ta: 'இடம் பிடிப்பான் மட்டும்', te: 'ప్లేస్‌హోల్డర్ మాత్రమే', bn: 'স্থানধারক মাত্র', kn: 'ಸ್ಥಳಧಾರಕ ಮಾತ್ರ', gu: 'સ્થાનધારક માત્ર' }, arith: false },
                  { civ: 'Maya (~350 CE)', type: { en: 'Placeholder only', hi: 'केवल स्थान-धारक', sa: 'केवल स्थान-धारक', mai: 'केवल स्थान-धारक', mr: 'केवल स्थान-धारक', ta: 'இடம் பிடிப்பான் மட்டும்', te: 'ప్లేస్‌హోల్డర్ మాత్రమే', bn: 'স্থানধারক মাত্র', kn: 'ಸ್ಥಳಧಾರಕ ಮಾತ್ರ', gu: 'સ્થાનધારક માત્ર' }, arith: false },
                  { civ: 'India — Bakhshali (~300 CE)', type: { en: 'Placeholder dot', hi: 'स्थान-धारक बिंदु', sa: 'स्थान-धारक बिंदु', mai: 'स्थान-धारक बिंदु', mr: 'स्थान-धारक बिंदु', ta: 'இடம் பிடிப்பான் புள்ளி', te: 'ప్లేస్‌హోల్డర్ బిందువు', bn: 'স্থানধারক বিন্দু', kn: 'ಸ್ಥಳಧಾರಕ ಬಿಂದು', gu: 'સ્થાનધારક બિંદુ' }, arith: false },
                  { civ: 'India — Brahmagupta (628 CE)', type: { en: 'FULL NUMBER with rules', hi: 'नियमों के साथ पूर्ण संख्या', sa: 'नियमों के साथ पूर्ण संख्या', mai: 'नियमों के साथ पूर्ण संख्या', mr: 'नियमों के साथ पूर्ण संख्या', ta: 'விதிகளுடன் முழு எண்', te: 'నియమాలతో పూర్ణ సంఖ్య', bn: 'নিয়ম সহ পূর্ণ সংখ্যা', kn: 'ನಿಯಮಗಳೊಂದಿಗೆ ಪೂರ್ಣ ಸಂಖ್ಯೆ', gu: 'નિયમો સાથે પૂર્ણ સંખ્યા' }, arith: true },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/[0.05] ${row.arith ? 'bg-gold-primary/5' : ''}`}
                  >
                    <td className="py-3 px-3 text-text-primary font-medium">{row.civ}</td>
                    <td className="py-3 px-3 text-text-secondary">{lt(row.type as LocaleText, locale)}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.arith ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {row.arith ? (hi ? 'हाँ!' : 'YES!') : (hi ? 'नहीं' : 'No')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <p>{t('s5Body')}</p>
          <div className="mt-6 space-y-4">
            {JOURNEY.map((stop, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${stop.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{stop.year}</div>
                  <div className="text-text-secondary/70 text-xs">{lt(stop.place as LocaleText, locale)}</div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed">{lt(stop.event as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Cpu className="w-5 h-5" />, label: { en: 'Binary Code', hi: 'बाइनरी कोड', sa: 'बाइनरी कोड', mai: 'बाइनरी कोड', mr: 'बाइनरी कोड', ta: 'இருமக் குறியீடு', te: 'బైనరీ కోడ్', bn: 'বাইনারি কোড', kn: 'ಬೈನರಿ ಕೋಡ್', gu: 'બાઈનરી કોડ' }, dep: { en: 'Requires 0 and 1', hi: '0 और 1 आवश्यक', sa: '0 और 1 आवश्यक', mai: '0 और 1 आवश्यक', mr: '0 और 1 आवश्यक', ta: '0 மற்றும் 1 தேவை', te: '0 మరియు 1 అవసరం', bn: '0 এবং 1 প্রয়োজন', kn: '0 ಮತ್ತು 1 ಅಗತ್ಯ', gu: '0 અને 1 જરૂરી' } },
              { icon: <Globe className="w-5 h-5" />, label: { en: 'GPS', hi: 'जीपीएस', sa: 'जीपीएस', mai: 'जीपीएस', mr: 'जीपीएस', ta: 'GPS', te: 'GPS', bn: 'GPS', kn: 'GPS', gu: 'GPS' }, dep: { en: 'Continuous calculus', hi: 'निरंतर कलन', sa: 'निरंतर कलन', mai: 'निरंतर कलन', mr: 'निरंतर कलन', ta: 'தொடர் நுண்கணிதம்', te: 'నిరంతర కలనశాస్త్రం', bn: 'ধারাবাহিক ক্যালকুলাস', kn: 'ನಿರಂತರ ಕಲನಶಾಸ್ತ್ರ', gu: 'સતત કેલ્ક્યુલસ' } },
              { icon: <Circle className="w-5 h-5" />, label: { en: 'Calculus', hi: 'कलन', sa: 'कलन', mai: 'कलन', mr: 'कलन', ta: 'நுண்கணிதம்', te: 'కలనశాస్త్రం', bn: 'ক্যালকুলাস', kn: 'ಕಲನಶಾಸ್ತ್ರ', gu: 'કેલ્ક્યુલસ' }, dep: { en: 'Limits → 0', hi: 'सीमाएँ → 0', sa: 'सीमाएँ → 0', mai: 'सीमाएँ → 0', mr: 'सीमाएँ → 0', ta: 'எல்லைகள் → 0', te: 'హద్దులు → 0', bn: 'সীমা → 0', kn: 'ಮಿತಿಗಳು → 0', gu: 'સીમાઓ → 0' } },
              { icon: <ArrowRight className="w-5 h-5" />, label: { en: 'Algebra', hi: 'बीजगणित', sa: 'बीजगणित', mai: 'बीजगणित', mr: 'बीजगणित', ta: 'இயற்கணிதம்', te: 'బీజగణితం', bn: 'বীজগণিত', kn: 'ಬೀಜಗಣಿತ', gu: 'બીજગણિત' }, dep: { en: 'Equations need 0', hi: 'समीकरणों को 0 चाहिए', sa: 'समीकरणों को 0 चाहिए', mai: 'समीकरणों को 0 चाहिए', mr: 'समीकरणों को 0 चाहिए', ta: 'சமன்பாடுகளுக்கு 0 தேவை', te: 'సమీకరణాలకు 0 అవసరం', bn: 'সমীকরণে 0 প্রয়োজন', kn: 'ಸಮೀಕರಣಗಳಿಗೆ 0 ಬೇಕು', gu: 'સમીકરણોને 0 જોઈએ' } },
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

        {/* ═══ SECTION 7 ═══ */}
        <LessonSection number={7} title={t('s7Title')} variant="formula">
          <p>{t('s7Body')}</p>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="text-amber-400 font-semibold text-sm mb-1">
              {hi ? 'ब्रह्मगुप्त की एकमात्र त्रुटि:' : "Brahmagupta's one error:"}
            </div>
            <div className="font-mono text-text-primary">0 ÷ 0 = 0 &nbsp;<span className="text-red-400">✗</span></div>
            <div className="text-text-secondary text-xs mt-2">
              {hi ? 'भास्कर II (1150 ईस्वी): n ÷ 0 = अनन्त (∞) जहाँ n≠0 — यह भी पूरी तरह सही नहीं, लेकिन करीब था।' : 'Bhaskara II (1150 CE): n ÷ 0 = ananta (∞) where n≠0 — still not fully correct, but closer.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 ═══ */}
        <LessonSection number={8} title={t('s8Title')} variant="highlight">
          <p>{t('s8Body')}</p>
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
            href="/learn/contributions/pi"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {hi ? 'अगला: π और आर्यभट' : 'Next: π and Aryabhata'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
