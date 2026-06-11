import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';
import { Link } from '@/lib/i18n/navigation';
import { engineDate as ed, nextUpcoming, todayInIst } from '@/lib/seo/regional-faq-dates';

const LABELS = {
  title: {
    en: 'Gujarati Calendar (Vikram Samvat)',
    hi: 'गुजराती कैलेंडर (विक्रम संवत्)',
    gu: 'ગુજરાતી કૅલેન્ડર (વિક્રમ સંવત)',
    ta: 'குஜராத்தி நாட்காட்டி (விக்கிரம் சம்வத்)',
    te: 'గుజరాతీ క్యాలెండర్ (విక్రమ సంవత్)',
    bn: 'গুজরাটি ক্যালেন্ডার (বিক্রম সংবৎ)',
    kn: 'ಗುಜರಾತಿ ಕ್ಯಾಲೆಂಡರ್ (ವಿಕ್ರಮ ಸಂವತ್)',
    mr: 'गुजराती दिनदर्शिका (विक्रम संवत्)', mai: 'गुजराती कैलेंडर (विक्रम संवत्)',
  },
  intro: {
    en: 'The Gujarati calendar follows the Vikram Samvat era, a lunisolar system used across Gujarat by approximately 70 million Gujarati speakers worldwide. What makes the Gujarati calendar distinctive is its New Year date: unlike most Indian calendars that begin in Chaitra (March/April), the Gujarati New Year — called Bestu Varas — falls on Kartik Shukla Pratipada, the day after Diwali (October/November). The Vikram Samvat year 2083 corresponds to November 2026 – October 2027 CE. The calendar is used for determining religious festivals, muhurtas, agricultural timing, and the annual cycle of vrats and observances that shape Gujarati Hindu life. Gujarat\'s merchant communities (Vaishya Vanias, Patels, Lohanas) have historically relied on the Vikram Samvat Panchang for auspicious business timings — Chopda Pujan on Diwali and the new financial year beginning with Bestu Varas remain cornerstones of Gujarati commercial culture.',
    hi: 'गुजराती कैलेंडर विक्रम संवत् युग का अनुसरण करता है, जो गुजरात में लगभग 7 करोड़ गुजराती भाषियों द्वारा उपयोग किया जाने वाला चान्द्र-सौर प्रणाली है। गुजराती कैलेंडर की विशिष्टता इसकी नव वर्ष तिथि है: अधिकांश भारतीय कैलेंडर के विपरीत जो चैत्र में शुरू होते हैं, गुजराती नव वर्ष — जिसे बेस्टु वरस कहते हैं — दीवाली के अगले दिन कार्तिक शुक्ल प्रतिपदा को पड़ता है। विक्रम संवत् 2083, नवम्बर 2026 – अक्टूबर 2027 ई. के अनुरूप है। गुजरात के व्यापारी समुदायों ने ऐतिहासिक रूप से शुभ व्यापारिक समय के लिए विक्रम संवत् पंचांग पर भरोसा किया है।',
    gu: 'ગુજરાતી કૅલેન્ડર વિક્રમ સંવત યુગને અનુસરે છે, ગુજરાતમાં અને વિશ્વભરમાં લગભગ 7 કરોડ ગુજરાતી ભાષીઓ દ્વારા ઉપયોગ થતી ચાંદ્ર-સૌર પ્રણાળી. ગુજરાતી કૅલેન્ડરની વિશેષતા તેની નવા વર્ષની તારીખ છે: બેસ્તુ વર્સ — દિવાળીના બીજા દિવસે કારતક સુદ એકમ. વિક્રમ સંવત 2083, નવેમ્બર 2026 – ઓક્ટોબર 2027 ને અનુરૂપ છે. ગુજરાતના વેપારી સમુદાયોએ ઐતિહાસિક રીતે શુભ ધંધાકીય સમય માટે વિક્રમ સંવત પંચાંગ પર ભરોસો રાખ્યો છે.',
  },
  monthsTitle: {
    en: 'The 12 Gujarati Months',
    hi: '12 गुजराती मास',
    gu: '12 ગુજરાતી મહિના',
    ta: '12 குஜராத்தி மாதங்கள்',
    te: '12 గుజరాతీ నెలలు',
    bn: '১২টি গুজরাটি মাস',
    kn: '12 ಗುಜರಾತಿ ತಿಂಗಳುಗಳು',
    mr: '12 गुजराती महिने', mai: '12 गुजराती मास',
  },
  monthsIntro: {
    en: 'Gujarati months follow the Amanta system (month ends on Amavasya/New Moon). Uniquely, the Gujarati calendar year begins with Kartik — not Chaitra — so the sequence below reflects the Gujarati year order. The Vikram Samvat uses the same Sanskrit lunar month names as Hindi/North Indian calendars but the year start differs. Each lunar month has two fortnights (pakshas): Shukla Paksha (bright, waxing) and Krishna Paksha (dark, waning), with 15 tithis each.',
    hi: 'गुजराती मास अमान्त प्रणाली का अनुसरण करते हैं (मास अमावस्या पर समाप्त होता है)। विशेष रूप से, गुजराती कैलेंडर वर्ष चैत्र के बजाय कार्तिक से शुरू होता है। विक्रम संवत् हिन्दी/उत्तर भारतीय कैलेंडर के समान संस्कृत चान्द्र मास नामों का उपयोग करता है लेकिन वर्ष का आरम्भ भिन्न है। प्रत्येक चान्द्र मास में दो पक्ष हैं: शुक्ल पक्ष (उजला) और कृष्ण पक्ष (अंधेरा)।',
    gu: 'ગુજરાતી મહિના અમાંત પ્રણાળીને અનુસરે છે (મહિનો અમાસ પર પૂરો થાય છે). ખાસ રીતે, ગુજરાતી વર્ષ ચૈત્ર નહીં, કારતકથી શરૂ થાય છે. દરેક ચાંદ્ર મહિનામાં બે પક્ષ છે: સુદ (શુક્લ, વધતો ચંદ્ર) અને વદ (કૃષ્ણ, ઘટતો ચંદ્ર).',
  },
  festivalsTitle: {
    en: 'Major Gujarati Festivals by Month',
    hi: 'मास अनुसार प्रमुख गुजराती त्योहार',
    gu: 'મહિના પ્રમાણે મુખ્ય ગુજરાતી તહેવારો',
    ta: 'மாதம் வாரியாக முக்கிய குஜராத்தி திருவிழாக்கள்',
    te: 'నెల వారీ ప్రధాన గుజరాతీ పండుగలు',
    bn: 'মাস অনুসারে প্রধান গুজরাটি উৎসব',
    kn: 'ತಿಂಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ಗುಜರಾತಿ ಹಬ್ಬಗಳು',
    mr: 'महिन्यानुसार प्रमुख गुजराती सण', mai: 'मास अनुसार प्रमुख गुजराती पर्व',
  },
  bestuTitle: {
    en: 'Bestu Varas — Gujarati New Year',
    hi: 'बेस्टु वरस — गुजराती नव वर्ष',
    gu: 'બેસ્તુ વર્સ — ગુજરાતી નવું વર્ષ',
  },
  bestuText: {
    en: 'Bestu Varas (from Gujarati "bestu" — new, "varas" — year) falls on Kartik Shukla Pratipada, the day after Diwali — typically in October or November. The timing is deeply symbolic: Diwali represents the end of the old year (in the Vikram Samvat reckoning used in Gujarat), and Bestu Varas its triumphant new beginning. Merchants and business owners perform "Chopda Pujan" on Diwali day — worship of account books and financial ledgers, invoking Lakshmi and Ganesha\'s blessings on the new business year. On Bestu Varas morning, new account books are opened with the auspicious inscription "Shubh Labh" (auspicious profit). Families exchange greetings of "Sal Mubarak" (happy new year). The day is celebrated with special foods, new clothes, visits to temples, and the exchange of Mithai (sweets). In Ahmedabad and Surat, large public gatherings and kite-flying add to the celebrations, with the festive energy of Diwali carrying naturally into the new year.',
    hi: 'बेस्टु वरस (गुजराती "बेस्टु" — नया, "वरस" — वर्ष) कार्तिक शुक्ल प्रतिपदा को पड़ता है, दीवाली के अगले दिन। व्यापारी और व्यापार मालिक दीवाली के दिन "चोपड़ा पूजन" करते हैं — खाता-बहियों और वित्तीय बहीखातों की पूजा, नए व्यापारिक वर्ष पर लक्ष्मी और गणेश का आशीर्वाद प्राप्त करते हैं। बेस्टु वरस की सुबह, नई खाता-बहियाँ शुभ शिलालेख "शुभ लाभ" के साथ खोली जाती हैं। परिवार "सल मुबारक" (शुभ नव वर्ष) की शुभकामनाएं देते हैं।',
    gu: 'બેસ્તુ વર્સ (ગુજ. "બેસ્તુ" — નવું, "વર્સ" — વર્ષ) કારતક સુદ એકમ, દિવાળીના બીજા દિવસ, સામાન્ય રીતે ઓક્ટોબર-નવેમ્બરમાં. વેપારીઓ અને ધંધાવાળા દિવાળીએ "ચોપડા પૂજન" કરે છે — ખાતા-ચોપડાઓની પૂજા, નવા ધંધાકીય વર્ષ પર લક્ષ્મી-ગણેશ આશીર્વાદ. બેસ્તુ વર્સ સવારે, "શુભ લાભ" લખ્યા સાથે નવી ચોપડીઓ ખોલવામાં આવે છે. "સાલ મુબારક" (ખુશ નવું વર્ષ) ની શુભેચ્છા આપ-લે.',
  },
  calendarTitle: {
    en: 'Vikram Samvat — Calendar Characteristics',
    hi: 'विक्रम संवत् — कैलेंडर विशेषताएँ',
    gu: 'વિક્રમ સંવત — પંચાંગ લક્ષણો',
    ta: 'விக்கிரம் சம்வத் — நாட்காட்டி சிறப்பியல்புகள்',
    te: 'విక్రమ సంవత్ — పంచాంగ లక్షణాలు',
    bn: 'বিক্রম সংবৎ — পঞ্জিকার বৈশিষ্ট্য',
    kn: 'ವಿಕ್ರಮ ಸಂವತ್ — ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು',
    mr: 'विक्रम संवत् — दिनदर्शिकेची वैशिष्ट्ये', mai: 'विक्रम संवत् — पंचांग लक्षण',
  },
  calendarText: {
    en: 'The Vikram Samvat is lunisolar: months are lunar (Amanta — New Moon to New Moon), but the year is recalibrated against the solar cycle through an intercalary month (Adhika Masa) every ~33 months. The era is traditionally attributed to Emperor Vikramaditya of Ujjain (57 BCE), making Vikram Samvat 57 years ahead of the Common Era. The Gujarati variant of Vikram Samvat uses the Amanta month system and begins in Kartik, distinguishing it from the Purnimanta Vikram Samvat used in parts of North India (UP, Bihar, Rajasthan) which begins in Chaitra. The Gujarati Panchang publishes detailed predictions for each Samvat year, including agricultural forecasts, gold and commodity price trends (Gujaratis being historically merchant communities), and auspicious muhurtas for major business and life events.',
    hi: 'विक्रम संवत् चान्द्र-सौर है: मास चान्द्र हैं (अमान्त — अमावस्या से अमावस्या तक), लेकिन वर्ष हर ~33 माह में अधिक मास जोड़कर सौर चक्र के साथ पुनर्कैलिब्रेट किया जाता है। यह युग परम्परागत रूप से उज्जैन के सम्राट विक्रमादित्य (57 ईसा पूर्व) को श्रेय दिया जाता है। गुजराती पंचांग प्रत्येक संवत् वर्ष के लिए विस्तृत भविष्यवाणियाँ प्रकाशित करता है।',
    gu: 'વિક્રમ સંવત ચાંદ્ર-સૌર છે: મહિના ચાંદ્ર (અમાંત — અમાસ થી અમાસ), પરંતુ ~33 મહિને અધિક માસ ઉમેરીને સૌર ચક્ર સાથે ફરી ગોઠવવામાં આવે છે. આ યુગ પરંપરાગત રીતે ઉજ્જૈનના સમ્રાટ વિક્રમાદિત્ય (57 ઈ.પૂ.)ને શ્રેય આપવામાં આવે છે. ગુજરાતી પંચાંગ દરેક સંવત વર્ષ માટે વિગતવાર ભવિષ્યવાણીઓ પ્રકાશિત કરે છે.',
  },
  navratriTitle: {
    en: 'Navratri in Gujarat — Nine Nights of Garba & Dandiya Raas',
    hi: 'गुजरात में नवरात्रि — गरबा और डांडिया रास की नौ रातें',
    gu: 'ગુજરાતમાં નવરાત્રિ — ગરબા અને ડાંડિયા રાસની નવ રાત',
  },
  navratriText: {
    en: 'Navratri is Gujarat\'s most celebrated festival — a nine-night extravaganza of devotion, music, and dance that transforms the entire state into a whirling spectacle of colour and rhythm. While Navratri is observed across India, Gujarat\'s celebrations are unmatched in scale and fervour. The festival honours Goddess Durga in her nine forms (Navadurga), with each night dedicated to a different manifestation: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kaalratri, Mahagauri, and Siddhidatri. The heart of Gujarati Navratri is Garba — a circular devotional dance performed around a centrally placed "Garbi" (an earthen lamp or image of the Goddess). Hundreds to thousands of dancers form concentric circles, clapping and stepping in rhythmic patterns that accelerate through the night. Dandiya Raas follows Garba, with dancers wielding decorated wooden sticks (dandiyas) in pairs, creating a percussive, energetic display. In Ahmedabad, Vadodara (Baroda), Surat, and Rajkot, massive grounds host Navratri events with tens of thousands of participants. The Vadodara Navratri at United Way is internationally renowned and has drawn over 30,000 dancers on a single night. Falguni Pathak, the "Queen of Dandiya," has become synonymous with Mumbai\'s Gujarati Navratri celebrations, drawing massive crowds. Traditional Garba songs invoke Amba Mata (Mother Goddess), with lyrics praising her shakti (divine feminine power). The nine colours of Navratri — one for each day — add a visual dimension, with participants coordinating their attire. Devotees observe fasts, visit Amba Mata temples (especially the famous Ambaji temple in Banaskantha), and perform aarti each evening before the Garba begins.',
    hi: 'नवरात्रि गुजरात का सबसे प्रसिद्ध त्योहार है — भक्ति, संगीत और नृत्य का नौ रात का महोत्सव जो पूरे राज्य को रंग और लय के घूमते दृश्य में बदल देता है। गुजराती नवरात्रि का हृदय गरबा है — "गरबी" (मिट्टी का दीपक या देवी की मूर्ति) के चारों ओर एक वृत्ताकार भक्ति नृत्य। डांडिया रास में नर्तक सजी हुई लकड़ी की छड़ियों से जोड़ी में नृत्य करते हैं। अहमदाबाद, वडोदरा, सूरत और राजकोट में विशाल मैदान हज़ारों प्रतिभागियों की मेज़बानी करते हैं। फालगुनी पाठक "डांडिया की रानी" के रूप में प्रसिद्ध हैं। नौ रातों में से प्रत्येक देवी दुर्गा के एक रूप को समर्पित है।',
    gu: 'નવરાત્રિ ગુજરાતનો સૌથી ઉજવાતો તહેવાર છે — ભક્તિ, સંગીત અને નૃત્યની નવ રાતનો મહોત્સવ. ગુજરાતી નવરાત્રિનું હૃદય ગરબા છે — "ગરબી" (માટીનો દીવો કે દેવીની મૂર્તિ) ની આસપાસ વર્તુળાકાર ભક્તિ નૃત્ય. ડાંડિયા રાસમાં નર્તકો શણગારેલી લાકડીઓથી જોડીમાં રમે છે. અમદાવાદ, વડોદરા, સૂરત અને રાજકોટમાં હજારો ભાગ લે છે. ફાલગુની પાઠક "ડાંડિયાની રાણી" તરીકે ઓળખાય છે. નવ રાત દેવી દુર્ગાના નવ સ્વરૂપોને સમર્પિત છે.',
  },
  vikramSamvatTitle: {
    en: 'Vikram Samvat — The Gujarati Era',
    hi: 'विक्रम संवत् — गुजराती युग',
    gu: 'વિક્રમ સંવત — ગુજરાતી યુગ',
  },
  vikramSamvatText: {
    en: 'The Vikram Samvat (VS) is one of the oldest calendar eras in continuous use, traditionally dated to 57 BCE and attributed to the legendary King Vikramaditya of Ujjain. The era runs 57 years ahead of the Common Era (CE): to calculate the current Vikram Samvat year in the Gujarati system, add 57 to the current CE year (after Diwali) or 56 (before Diwali, since the Gujarati VS year begins in Kartik). Thus, from Bestu Varas in November 2026, the Gujarati Vikram Samvat year is 2083, and it runs until Diwali 2027. The Gujarati variant of the Vikram Samvat is distinctive in two key ways. First, it uses the Amanta (Amant) month-ending system where each month concludes on Amavasya (New Moon), in contrast to the Purnimanta system used in North India (UP, Bihar, Rajasthan) where months end on Purnima (Full Moon). Second, and most importantly, the Gujarati Vikram Samvat year begins in Kartik — the day after Diwali — rather than in Chaitra (March/April) as in the North Indian Vikram Samvat. This means that for about six months (Kartik to Chaitra), the Gujarati VS year number is one ahead of the North Indian VS year. The Vikram Samvat is used not only in Gujarat but also by Jains throughout India (who follow the same Kartik-start convention), and by Hindu communities in Nepal (which uses a Chaitra-start variant as its official calendar). The era\'s longevity — over 2,080 years of unbroken use — makes it one of the most enduring calendar systems in human history.',
    hi: 'विक्रम संवत् (वि.सं.) सबसे पुरानी निरन्तर उपयोग में रहने वाली कैलेंडर युगों में से एक है, जो परम्परागत रूप से 57 ईसा पूर्व से है और उज्जैन के पौराणिक राजा विक्रमादित्य को श्रेय दिया जाता है। गुजराती प्रणाली में, दीवाली के बाद वर्तमान ई. वर्ष में 57 जोड़ें। नवम्बर 2026 में बेस्टु वरस से गुजराती विक्रम संवत् 2083 आरम्भ होता है। गुजराती संवत् अमान्त मास प्रणाली और कार्तिक से वर्षारम्भ का उपयोग करता है — उत्तर भारतीय चैत्र-शुरू पूर्णिमान्त प्रणाली से भिन्न। यह युग 2,080+ वर्षों के अटूट उपयोग के साथ मानव इतिहास की सबसे टिकाऊ कैलेंडर प्रणालियों में से एक है।',
    gu: 'વિક્રમ સંવત (વિ.સં.) સતત ઉપયોગમાં રહેલી સૌથી જૂની કૅલેન્ડર યુગોમાંનું એક છે, પરંપરાગત રીતે 57 ઈ.પૂ.નું, ઉજ્જૈનના પૌરાણિક રાજા વિક્રમાદિત્યને શ્રેય. ગુજરાતી પ્રણાળીમાં, દિવાળી પછી વર્તમાન ઈ.સ. વર્ષમાં 57 ઉમેરો. નવેમ્બર 2026માં બેસ્તુ વર્સથી ગુજરાતી વિક્રમ સંવત 2083 શરૂ થાય છે. ગુજરાતી સંવત અમાંત માસ પ્રણાળી અને કારતકથી વર્ષારંભ વાપરે છે. 2,080+ વર્ષના અતૂટ ઉપયોગ સાથે, આ માનવ ઈતિહાસની સૌથી ટકાઉ પંચાંગ પ્રણાળીઓમાંની એક છે.',
  },
  relatedTitle: {
    en: 'Related Regional Calendars',
    hi: 'सम्बन्धित प्रादेशिक कैलेंडर',
    gu: 'સંબંધિત પ્રાદેશિક પંચાંગ',
    ta: 'தொடர்புடைய பிராந்திய நாள்காட்டிகள்',
    te: 'సంబంధిత ప్రాంతీయ క్యాలెండర్లు',
    bn: 'সম্পর্কিত আঞ্চলিক পঞ্জিকা',
    kn: 'ಸಂಬಂಧಿತ ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗಗಳು',
    mr: 'संबंधित प्रादेशिक दिनदर्शिका', mai: 'संबंधित प्रादेशिक पंचांग',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// Gujarati Months — Amanta system, year starts from Kartik
// ═══════════════════════════════════════════════════════════════════════════

const GUJARATI_MONTHS = [
  { name: 'Kartik', gujarati: 'કારતક', nameHi: 'कार्तिक', gregorian: 'Oct – Nov', note: 'Year begins' },
  { name: 'Magshar', gujarati: 'માગશર', nameHi: 'मार्गशीर्ष', gregorian: 'Nov – Dec', note: '' },
  { name: 'Posh', gujarati: 'પોષ', nameHi: 'पौष', gregorian: 'Dec – Jan', note: '' },
  { name: 'Maha', gujarati: 'મહા', nameHi: 'माघ', gregorian: 'Jan – Feb', note: '' },
  { name: 'Phagan', gujarati: 'ફાગણ', nameHi: 'फाल्गुन', gregorian: 'Feb – Mar', note: '' },
  { name: 'Chaitra', gujarati: 'ચૈત્ર', nameHi: 'चैत्र', gregorian: 'Mar – Apr', note: '' },
  { name: 'Vaishakh', gujarati: 'વૈશાખ', nameHi: 'वैशाख', gregorian: 'Apr – May', note: '' },
  { name: 'Jeth', gujarati: 'જેઠ', nameHi: 'ज्येष्ठ', gregorian: 'May – Jun', note: '' },
  { name: 'Ashadh', gujarati: 'અષાઢ', nameHi: 'आषाढ', gregorian: 'Jun – Jul', note: '' },
  { name: 'Shravan', gujarati: 'શ્રાવણ', nameHi: 'श्रावण', gregorian: 'Jul – Aug', note: '' },
  { name: 'Bhadarvo', gujarati: 'ભાદ્રપદ', nameHi: 'भाद्रपद', gregorian: 'Aug – Sep', note: '' },
  { name: 'Aso', gujarati: 'આસો', nameHi: 'आश्विन', gregorian: 'Sep – Oct', note: 'Year ends' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Gujarati Month → Gregorian Conversion Table (2026–2027)
// Lunar months — approximate Gregorian ranges based on Amanta reckoning
// ═══════════════════════════════════════════════════════════════════════════

const MONTH_CONVERSION = [
  { gujarati: 'Kartik 2083', guj: 'કારતક ૨૦૮૩', range2026: '9 Nov 2026 – 7 Dec 2026', range2027: '29 Oct 2027 – 27 Nov 2027' },
  { gujarati: 'Magshar', guj: 'માગશર', range2026: '8 Dec 2026 – 5 Jan 2027', range2027: '28 Nov 2027 – 26 Dec 2027' },
  { gujarati: 'Posh', guj: 'પોષ', range2026: '6 Jan 2027 – 3 Feb 2027', range2027: '27 Dec 2027 – 24 Jan 2028' },
  { gujarati: 'Maha', guj: 'મહા', range2026: '4 Feb 2027 – 4 Mar 2027', range2027: '25 Jan 2028 – 22 Feb 2028' },
  { gujarati: 'Phagan', guj: 'ફાગણ', range2026: '5 Mar 2027 – 3 Apr 2027', range2027: '23 Feb 2028 – 22 Mar 2028' },
  { gujarati: 'Chaitra', guj: 'ચૈત્ર', range2026: '4 Apr 2027 – 2 May 2027', range2027: '23 Mar 2028 – 20 Apr 2028' },
  { gujarati: 'Vaishakh', guj: 'વૈશાખ', range2026: '3 May 2027 – 1 Jun 2027', range2027: '21 Apr 2028 – 19 May 2028' },
  { gujarati: 'Jeth', guj: 'જેઠ', range2026: '2 Jun 2027 – 30 Jun 2027', range2027: '20 May 2028 – 18 Jun 2028' },
  { gujarati: 'Ashadh', guj: 'અષાઢ', range2026: '1 Jul 2027 – 30 Jul 2027', range2027: '19 Jun 2028 – 17 Jul 2028' },
  { gujarati: 'Shravan', guj: 'શ્રાવણ', range2026: '31 Jul 2027 – 28 Aug 2027', range2027: '18 Jul 2028 – 16 Aug 2028' },
  { gujarati: 'Bhadarvo', guj: 'ભાદ્રપદ', range2026: '29 Aug 2027 – 27 Sep 2027', range2027: '17 Aug 2028 – 14 Sep 2028' },
  { gujarati: 'Aso', guj: 'આસો', range2026: '28 Sep 2027 – 27 Oct 2027', range2027: '15 Sep 2028 – 14 Oct 2028' },
];

const FESTIVALS = [
  { month: 'Kartik', en: 'Bestu Varas / Gujarati New Year (Kartik Shukla Pratipada, day after Diwali — Chopda Pujan, new account books, Sal Mubarak greetings), Annakut (Kartik Shukla Dwitiya — 56 Bhog offered to Shrinathji at Nathdwara), Dev Diwali (Kartik Purnima — Ghats lit with diyas)', hi: 'बेस्टु वरस / गुजराती नव वर्ष (कार्तिक शुक्ल प्रतिपदा — चोपड़ा पूजन), अन्नकूट (कार्तिक शुक्ल द्वितीया — श्रीनाथजी को 56 भोग), देव दीवाली (कार्तिक पूर्णिमा)', gu: 'બેસ્તુ વર્સ / ગુજરાતી નવું વર્ષ (કારતક સુ. 1 — ચોપડા પૂજન), અન્નકૂટ (કારતક સુ. 2 — શ્રીનાથજીને 56 ભોગ), દેવ દિવાળી (કારતક પૂનમ)' },
  { month: 'Maha', en: 'Uttarayan / Makar Sankranti (January 14 — the biggest kite festival in India; Ahmedabad\'s International Kite Festival draws hundreds of thousands; Undhiyu and Jalebi feasting)', hi: 'उत्तरायण / मकर संक्रान्ति (14 जनवरी — भारत का सबसे बड़ा पतंग उत्सव; अहमदाबाद अंतर्राष्ट्रीय पतंग महोत्सव; ऊंधिया-जलेबी)', gu: 'ઉત્તરાયણ / મકર સંક્રાન્તિ (14 જાન્યુ. — ભારતનો સૌથી મોટો પતંગ ઉત્સવ; અમદાવાદ આંતરરાષ્ટ્રીય પતંગ મહોત્સવ; ઊંધિયું-જલેબી)' },
  { month: 'Phagan', en: 'Maha Shivaratri (Phagan Krishna Chaturdashi — all-night worship at Somnath Temple), Holi / Dhuleti (Phagan Purnima — colours festival, especially vibrant in Dwarka and Mathura)', hi: 'महा शिवरात्रि (फाल्गुन कृष्ण चतुर्दशी — सोमनाथ मन्दिर में रात्रि पूजा), होली / धुलेटी (फाल्गुन पूर्णिमा)', gu: 'મહા શિવરાત્રી (ફાગણ વદ 14 — સોમનાથ મંદિરમાં રાત્રિ પૂજા), હોળી / ધુળેટી (ફાગણ પૂનમ)' },
  { month: 'Chaitra', en: 'Ram Navami (Chaitra Shukla Navami — Lord Rama\'s birthday), Hanuman Jayanti (Chaitra Purnima)', hi: 'राम नवमी (चैत्र शुक्ल नवमी), हनुमान जयन्ती (चैत्र पूर्णिमा)', gu: 'રામ નવમી (ચૈત્ર સુ. 9), હનુમાન જયંતી (ચૈત્ર પૂનમ)' },
  { month: 'Ashadh', en: 'Rath Yatra (Ashadh Shukla Dwitiya — Lord Jagannath\'s chariot procession through Ahmedabad; one of the largest Rath Yatras outside Puri, with over 1 million attendees)', hi: 'रथ यात्रा (आषाढ शुक्ल द्वितीया — अहमदाबाद में भगवान जगन्नाथ की रथ यात्रा; पुरी के बाहर सबसे बड़ी)', gu: 'રથયાત્રા (અષાઢ સુ. 2 — અમદાવાદમાં ભગવાન જગન્નાથની રથયાત્રા; પુરી બહારની સૌથી મોટી, 10 લાખ+ ભક્તો)' },
  { month: 'Shravan', en: 'Janmashtami (Shravan Krishna Ashtami — Lord Krishna\'s birthday; grand celebrations at Dwarka, Dakor, and across Gujarat; Dahi Handi events)', hi: 'जन्माष्टमी (श्रावण कृष्ण अष्टमी — भगवान कृष्ण जन्मदिन; द्वारका, डाकोर में भव्य उत्सव)', gu: 'જન્માષ્ટમી (શ્રાવણ વદ 8 — ભગવાન કૃષ્ણ જન્મ; દ્વારકા, ડાકોરમાં ભવ્ય ઉત્સવ; દહીં હાંડી)' },
  { month: 'Bhadarvo', en: 'Ganesh Chaturthi (Bhadarvo Shukla Chaturthi — Ganpati Sthapana, especially grand in Surat and South Gujarat Marathi-influenced areas)', hi: 'गणेश चतुर्थी (भाद्रपद शुक्ल चतुर्थी — गणपति स्थापना, सूरत में भव्य)', gu: 'ગણેશ ચતુર્થી (ભાદ્રપદ સુ. 4 — ગણપતિ સ્થાપન, સૂરતમાં ભવ્ય)' },
  { month: 'Aso', en: 'Navratri (9 nights of Garba and Dandiya Raas — Gujarat\'s biggest festival; UNESCO Intangible Cultural Heritage), Dussehra / Vijaya Dashami (Aso Shukla Dashami — Ravana effigy burning), Sharad Purnima (Aso Purnima — moonlit night of Ras-Lila), Diwali (Aso Amavasya — last day of the Gujarati year)', hi: 'नवरात्रि (9 रात्रि गरबा और डांडिया रास — गुजरात का सबसे बड़ा त्योहार; UNESCO अमूर्त सांस्कृतिक विरासत), दशहरा (आसो शुक्ल दशमी), शरद पूर्णिमा (आसो पूर्णिमा), दीवाली (आसो अमावस्या — गुजराती वर्ष का अन्तिम दिन)', gu: 'નવરાત્રિ (9 રાત ગરબા અને ડાંડિયા રાસ — ગુજરાતનો સૌથી મોટો તહેવાર; UNESCO અમૂર્ત સાંસ્કૃતિક ધરોહર), દશેરા (આસો સુ. 10), શરદ પૂનમ (આસો પૂનમ), દિવાળી (આસો અમાસ — ગુજરાતી વર્ષનો છેલ્લો દિવસ)' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Gujarati Festival Dates — engine-driven, NEXT upcoming occurrence only.
// Computed for Ahmedabad (IST canonical).
// ═══════════════════════════════════════════════════════════════════════════
interface GujaratiFestival { en: string; hi: string; gu: string; engineKey: string; tithi: string }
const GUJARATI_FESTIVALS: GujaratiFestival[] = [
  { en: 'Uttarayan / Makar Sankranti',                hi: 'उत्तरायण / मकर संक्रान्ति',         gu: 'ઉત્તરાયણ / મકર સંક્રાન્તિ',           engineKey: 'Uttarayan',                          tithi: 'Pausha (Solar — Capricorn ingress)' },
  { en: 'Maha Shivaratri',                            hi: 'महा शिवरात्रि',                     gu: 'મહા શિવરાત્રી',                       engineKey: 'Maha Shivaratri',                    tithi: 'Phalguna Krishna Chaturdashi' },
  { en: 'Holi / Dhuleti',                             hi: 'होली / धुलेटी',                     gu: 'હોળી / ધુળેટી',                       engineKey: 'Holi',                                tithi: 'Phalguna Purnima' },
  { en: 'Ram Navami',                                 hi: 'राम नवमी',                          gu: 'રામ નવમી',                            engineKey: 'Ram Navami',                         tithi: 'Chaitra Shukla Navami' },
  { en: 'Hanuman Jayanti',                            hi: 'हनुमान जयन्ती',                    gu: 'હનુમાન જયંતી',                       engineKey: 'Hanuman Jayanti',                    tithi: 'Chaitra Purnima' },
  { en: 'Akshaya Tritiya',                            hi: 'अक्षय तृतीया',                      gu: 'અક્ષય તૃતીયા',                        engineKey: 'Akshaya Tritiya',                    tithi: 'Vaishakha Shukla Tritiya' },
  { en: 'Vat Savitri Vrat',                           hi: 'वट सावित्री व्रत',                  gu: 'વટ સાવિત્રી વ્રત',                    engineKey: 'Vat Savitri Vrat',                   tithi: 'Jyeshtha Purnima' },
  { en: 'Jagannath Rath Yatra (Ahmedabad)',           hi: 'जगन्नाथ रथ यात्रा (अहमदाबाद)',     gu: 'જગન્નાથ રથયાત્રા (અમદાવાદ)',         engineKey: 'Jagannath Rath Yatra',               tithi: 'Ashadha Shukla Dwitiya' },
  { en: 'Janmashtami',                                hi: 'जन्माष्टमी',                        gu: 'જન્માષ્ટમી',                          engineKey: 'Janmashtami',                        tithi: 'Bhadrapada Krishna Ashtami' },
  { en: 'Ganesh Chaturthi',                           hi: 'गणेश चतुर्थी',                      gu: 'ગણેશ ચતુર્થી',                        engineKey: 'Ganesh Chaturthi',                   tithi: 'Bhadrapada Shukla Chaturthi' },
  { en: 'Navratri begins (Ghatasthapana)',            hi: 'नवरात्रि आरम्भ (घटस्थापना)',       gu: 'નવરાત્રિ શરૂ (ઘટસ્થાપના)',           engineKey: 'Ghatasthapana (Navratri Day 1)',     tithi: 'Ashwin Shukla Pratipada' },
  { en: 'Dussehra / Vijaya Dashami',                  hi: 'दशहरा / विजया दशमी',                gu: 'દશેરા / વિજયા દશમી',                  engineKey: 'Sindoor Khela / Vijaya Dashami',     tithi: 'Ashwin Shukla Dashami' },
  { en: 'Sharad Purnima',                             hi: 'शरद पूर्णिमा',                       gu: 'શરદ પૂનમ',                             engineKey: 'Sharad Purnima',                     tithi: 'Ashwin Purnima' },
  { en: 'Dhanteras',                                  hi: 'धनतेरस',                            gu: 'ધનતેરસ',                              engineKey: 'Dhanteras',                          tithi: 'Kartik Krishna Trayodashi' },
  { en: 'Diwali (Gujarati Year End)',                 hi: 'दीवाली (गुजराती वर्ष का अन्त)',    gu: 'દિવાળી (ગુજરાતી વર્ષનો અંત)',        engineKey: 'Diwali',                              tithi: 'Ashwin Amavasya' },
  { en: 'Bestu Varas / Gujarati New Year',            hi: 'बेस्टु वरस / गुजराती नव वर्ष',     gu: 'બેસ્તુ વર્સ / ગુજરાતી નવું વર્ષ',     engineKey: 'Gujarati New Year',                  tithi: 'Kartik Shukla Pratipada' },
  { en: 'Annakut',                                    hi: 'अन्नकूट',                           gu: 'અન્નકૂટ',                             engineKey: 'Govardhan Puja',                     tithi: 'Kartik Shukla Pratipada/Dwitiya' },
  { en: 'Labh Pancham',                               hi: 'लाभ पंचमी',                         gu: 'લાભ પાંચમ',                          engineKey: 'Labh Pancham',                       tithi: 'Kartik Shukla Panchami' },
  { en: 'Bhai Beej',                                  hi: 'भाई बीज',                           gu: 'ભાઈ બીજ',                            engineKey: 'Bhai Dooj',                          tithi: 'Kartik Shukla Dwitiya' },
  { en: 'Dev Diwali',                                 hi: 'देव दीवाली',                        gu: 'દેવ દિવાળી',                          engineKey: 'Dev Diwali',                         tithi: 'Kartik Purnima' },
];

// FAQ data for structured data
const FAQ_DATA = [
  // All year-specific dates resolved via ed(year, festivalKey, locale)
  // against festival-generator.ts. Drift between FAQ schema and the
  // festival table is now structurally impossible. Hand-coded dates
  // here were 1-7 days stale during the 2026-06-10 audit.
  {
    q: { en: 'When is Gujarati New Year 2026?', hi: 'गुजराती नव वर्ष 2026 कब है?', gu: 'ગુજરાતી નવું વર્ષ 2026 ક્યારે છે?' },
    a: {
      en: `Gujarati New Year 2026 (Bestu Varas, Vikram Samvat 2083) falls on ${ed(2026,'Gujarati New Year (Bestu Varas)','en')}. It is the day after Diwali (${ed(2026,'Diwali','en')}). The tithi is Kartik Shukla Pratipada. On Diwali evening, Gujarati families perform Chopda Pujan (worship of account books) and on Bestu Varas morning, new account books are opened with "Shubh Labh" inscriptions. Families greet each other with "Sal Mubarak" (happy new year).`,
      hi: `गुजराती नव वर्ष 2026 (बेस्टु वरस, विक्रम संवत् 2083) ${ed(2026,'Gujarati New Year (Bestu Varas)','hi')} को पड़ता है। यह दीवाली (${ed(2026,'Diwali','hi')}) के अगले दिन है। तिथि कार्तिक शुक्ल प्रतिपदा है। दीवाली की शाम को चोपड़ा पूजन और बेस्टु वरस की सुबह "शुभ लाभ" के साथ नई खाता-बहियाँ खोली जाती हैं।`,
      gu: `ગુજરાતી નવું વર્ષ 2026 (બેસ્તુ વર્સ, વિક્રમ સંવત 2083) ${ed(2026,'Gujarati New Year (Bestu Varas)','gu')}ના રોજ છે. તે દિવાળી (${ed(2026,'Diwali','gu')}) ના બીજા દિવસે છે. તિથિ કારતક સુદ એકમ છે.`,
    },
  },
  {
    q: { en: 'What is the Gujarati calendar system?', hi: 'गुजराती कैलेंडर प्रणाली क्या है?', gu: 'ગુજરાતી કૅલેન્ડર પ્રણાળી શું છે?' },
    a: { en: 'The Gujarati calendar is a lunisolar system based on the Vikram Samvat era (dating from 57 BCE). It uses the Amanta month system where months run from New Moon (Amavasya) to New Moon. What makes it unique among Indian calendars is that the Gujarati year begins in Kartik (October/November), the day after Diwali, rather than in Chaitra (March/April) like most North Indian calendars. The calendar includes an intercalary month (Adhika Masa or Purushottam Mas) approximately every 33 months to reconcile the lunar and solar cycles. It is the primary calendar for determining festival dates, muhurtas (auspicious timings), vrats (fasts), and agricultural activities across Gujarat.', hi: 'गुजराती कैलेंडर विक्रम संवत् युग (57 ई.पू.) पर आधारित चान्द्रसौर प्रणाली है। यह अमान्त मास प्रणाली का उपयोग करता है जहाँ मास अमावस्या से अमावस्या तक चलता है। इसकी विशिष्टता यह है कि गुजराती वर्ष चैत्र के बजाय कार्तिक में, दीवाली के अगले दिन, शुरू होता है। ~33 माह में एक अधिक मास जोड़ा जाता है।', gu: 'ગુજરાતી કૅલેન્ડર વિક્રમ સંવત યુગ (57 ઈ.પૂ.) પર આધારિત ચાંદ્ર-સૌર પ્રણાળી છે. અમાંત માસ પ્રણાળી વપરાય છે જ્યાં મહિનો અમાસથી અમાસ સુધી ચાલે છે. વિશેષતા: ગુજરાતી વર્ષ ચૈત્ર નહીં, કારતકમાં, દિવાળી પછી, શરૂ થાય છે.' },
  },
  {
    q: { en: 'When is Navratri 2026 in Gujarat?', hi: 'गुजरात में नवरात्रि 2026 कब है?', gu: 'ગુજરાતમાં નવરાત્રી 2026 ક્યારે છે?' },
    a: {
      en: `Navratri 2026 in Gujarat begins on ${ed(2026,'Ghatasthapana (Navratri Day 1)','en')} (Ghatasthapana, Ashwin Shukla Pratipada) and culminates with Dussehra / Vijaya Dashami on ${ed(2026,'Sindoor Khela / Vijaya Dashami','en')}. Garba and Dandiya Raas events are held nightly across Gujarat, with the largest celebrations in Ahmedabad, Vadodara, Surat, and Rajkot. Each night is dedicated to one of the nine forms of Goddess Durga (Navadurga).`,
      hi: `गुजरात में नवरात्रि 2026 ${ed(2026,'Ghatasthapana (Navratri Day 1)','hi')} (घटस्थापना, आश्विन शुक्ल प्रतिपदा) से शुरू होती है। दशहरा / विजया दशमी ${ed(2026,'Sindoor Khela / Vijaya Dashami','hi')} को है। अहमदाबाद, वडोदरा, सूरत और राजकोट में सबसे बड़े उत्सव होते हैं।`,
      gu: `ગુજરાતમાં નવરાત્રી 2026 ${ed(2026,'Ghatasthapana (Navratri Day 1)','gu')} (ઘટસ્થાપના, આસો સુદ 1) થી શરૂ થાય છે. દશેરા ${ed(2026,'Sindoor Khela / Vijaya Dashami','gu')}ના રોજ છે. અમદાવાદ, વડોદરા, સૂરત અને રાજકોટમાં સૌથી મોટા ઉત્સવ.`,
    },
  },
  {
    q: { en: 'How does the Gujarati calendar differ from the North Indian calendar?', hi: 'गुजराती कैलेंडर उत्तर भारतीय कैलेंडर से कैसे भिन्न है?', gu: 'ગુજરાતી કૅલેન્ડર ઉત્તર ભારતીય કૅલેન્ડરથી કેવી રીતે અલગ છે?' },
    a: { en: 'The Gujarati and North Indian (Hindi) calendars are both based on the Vikram Samvat era (57 BCE), but differ in two fundamental ways. First, the month-ending convention: Gujarat uses the Amanta system (months end on Amavasya/New Moon), while North India uses the Purnimanta system (months end on Purnima/Full Moon). This means during Krishna Paksha (waning fortnight), the same day has different month names in Gujarat vs North India. Second, the year start: the Gujarati calendar year begins in Kartik (October/November, day after Diwali), while the North Indian Vikram Samvat year begins in Chaitra (March/April). As a result, between Kartik and Chaitra, the Gujarati VS year number is one ahead of the North Indian VS year. Both systems share the same 12 Sanskrit month names and the same festival tithis — only the structural conventions differ.', hi: 'गुजराती और उत्तर भारतीय (हिन्दी) कैलेंडर दोनों विक्रम संवत् (57 ई.पू.) पर आधारित हैं, लेकिन दो मूलभूत अंतर हैं। प्रथम, मास-समापन प्रणाली: गुजरात अमान्त (अमावस्या पर मास समाप्त) और उत्तर भारत पूर्णिमान्त (पूर्णिमा पर) उपयोग करता है। द्वितीय, वर्षारम्भ: गुजराती वर्ष कार्तिक (अक्टूबर/नवम्बर) में और उत्तर भारतीय चैत्र (मार्च/अप्रैल) में शुरू होता है। कार्तिक से चैत्र तक, गुजराती संवत् वर्ष संख्या एक अधिक होती है।', gu: 'ગુજરાતી અને ઉત્તર ભારતીય (હિન્દી) કૅલેન્ડર બંને વિક્રમ સંવત (57 ઈ.પૂ.) પર આધારિત છે, પરંતુ બે મૂળભૂત તફાવત છે. પહેલું: ગુજરાત અમાંત (મહિનો અમાસ પર પૂરો) અને ઉત્તર ભારત પૂર્ણિમાંત (પૂનમ પર) વાપરે છે. બીજું: ગુજરાતી વર્ષ કારતક (ઓક્ટોબર/નવેમ્બર)માં અને ઉત્તર ભારતીય ચૈત્ર (માર્ચ/એપ્રિલ)માં શરૂ થાય છે.' },
  },
  {
    q: { en: 'What is the current Vikram Samvat year?', hi: 'वर्तमान विक्रम संवत् वर्ष क्या है?', gu: 'વર્તમાન વિક્રમ સંવત વર્ષ શું છે?' },
    a: {
      en: `The current Gujarati Vikram Samvat year is 2082 (started day after Diwali 2025). Vikram Samvat 2083 will begin on ${ed(2026,'Gujarati New Year (Bestu Varas)','en')} (Bestu Varas, the day after Diwali 2026). In the North Indian reckoning (Chaitra start), VS 2083 began in spring 2026. To convert: CE year + 57 = approximate VS year (after Bestu Varas). The Vikram Samvat era is attributed to 57 BCE and is 57 years ahead of the Common Era, making it one of the oldest continuously used calendrical systems.`,
      hi: `वर्तमान गुजराती विक्रम संवत् वर्ष 2082 है (दीवाली 2025 के अगले दिन से शुरू)। विक्रम संवत् 2083 ${ed(2026,'Gujarati New Year (Bestu Varas)','hi')} (बेस्टु वरस) से शुरू होगा। रूपान्तरण: ई. वर्ष + 57 = अनुमानित वि.सं. वर्ष (बेस्टु वरस के बाद)।`,
      gu: `વર્તમાન ગુજરાતી વિક્રમ સંવત વર્ષ 2082 છે (દિવાળી 2025 પછી શરૂ થયું). વિક્રમ સંવત 2083 ${ed(2026,'Gujarati New Year (Bestu Varas)','gu')} (બેસ્તુ વર્સ) થી શરૂ થશે. રૂપાંતરણ: ઈ.સ. વર્ષ + 57 = અંદાજિત વિ.સં. વર્ષ.`,
    },
  },
  {
    q: { en: 'What is Chopda Pujan and when is it performed?', hi: 'चोपड़ा पूजन क्या है और कब किया जाता है?', gu: 'ચોપડા પૂજન શું છે અને ક્યારે કરવામાં આવે છે?' },
    a: { en: 'Chopda Pujan is a distinctly Gujarati and Marwari tradition performed on Diwali evening (the last day of the Gujarati calendar year). "Chopda" means account books or ledgers, and "Pujan" means worship. Business owners and merchants ceremonially worship their financial records, ledgers, and account books, invoking the blessings of Goddess Lakshmi (wealth) and Lord Ganesha (auspicious beginnings) for the forthcoming business year. The old account books are ritually closed and new ones are opened with the inscription "Shubh Labh" (auspicious profit). This tradition reflects the deep mercantile heritage of Gujarati culture, where business prosperity and divine blessing are inseparable.', hi: 'चोपड़ा पूजन गुजराती और मारवाड़ी परम्परा है जो दीवाली की शाम (गुजराती वर्ष का अन्तिम दिन) को की जाती है। "चोपड़ा" का अर्थ खाता-बहियाँ और "पूजन" का अर्थ पूजा है। व्यापारी अपने वित्तीय अभिलेखों की पूजा करते हैं, लक्ष्मी और गणेश का आशीर्वाद प्राप्त करते हैं। पुरानी बहियाँ बन्द की जाती हैं और "शुभ लाभ" के साथ नई खोली जाती हैं।', gu: 'ચોપડા પૂજન ગુજરાતી અને મારવાડી પરંપરા છે જે દિવાળીની સાંજે (ગુજરાતી વર્ષના છેલ્લા દિવસે) કરવામાં આવે છે. "ચોપડા" એટલે ખાતા-ચોપડાઓ અને "પૂજન" એટલે પૂજા. વેપારીઓ પોતાના નાણાકીય દસ્તાવેજોની પૂજા કરે છે, લક્ષ્મી-ગણેશના આશીર્વાદ માંગે છે. "શુભ લાભ" સાથે નવી ચોપડીઓ ખોલવામાં આવે છે.' },
  },
];

const RELATED_LINKS = [
  { slug: 'navaratri', en: 'Navratri Puja Guide', hi: 'नवरात्रि पूजा विधि', gu: 'નવરાત્રી પૂજા માર્ગદર્શિકા' },
  { slug: 'diwali', en: 'Diwali / Chopda Pujan Guide', hi: 'दीवाली / चोपड़ा पूजन विधि', gu: 'દિવાળી / ચોપડા પૂજન માર્ગદર્શિકા' },
  { slug: 'makar-sankranti', en: 'Uttarayan / Makar Sankranti', hi: 'उत्तरायण / मकर संक्रान्ति', gu: 'ઉત્તરાયણ / મકર સંક્રાન્તિ' },
  { slug: 'janmashtami', en: 'Janmashtami Puja', hi: 'जन्माष्टमी पूजा', gu: 'જન્માષ્ટમી પૂજા' },
  { slug: 'holi', en: 'Holi / Dhuleti Puja', hi: 'होली / धुलेटी पूजा', gu: 'હોળી / ધુળેટી પૂજા' },
  { slug: 'ganesh-chaturthi', en: 'Ganesh Chaturthi Puja', hi: 'गणेश चतुर्थी पूजा', gu: 'ગણેશ ચતુર્થી પૂજા' },
];

export default async function GujaratiCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  setRequestLocale(localeParam);
  const locale = localeParam as Locale;
  const isGu = locale === 'gu';
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, locale);
  const hf = isGu
    ? { fontFamily: 'var(--font-gujarati-heading)' }
    : isHi
      ? { fontFamily: 'var(--font-devanagari-heading)' }
      : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
            {L('title')}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* Month Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('monthsTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {L('monthsIntro')}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colMonth', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Gujarati', hi: 'गुजराती', gu: 'ગુજરાતી' } as LocaleText, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colGregorian', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Note', hi: 'नोट', gu: 'નોંધ' } as LocaleText, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {GUJARATI_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isGu ? m.gujarati : isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.gujarati}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Gujarati Month to Gregorian Conversion Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Gujarati Month to Gregorian Conversion (2026–2027)', hi: 'गुजराती मास से ग्रेगोरियन रूपान्तरण (2026–2027)', gu: 'ગુજરાતી મહિનાથી ગ્રેગોરિયન રૂપાંતર (2026–2027)' } as LocaleText, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {tl({ en: 'Approximate Gregorian date ranges for each Gujarati lunar month in Vikram Samvat 2083 (2026–27) and VS 2084 (2027–28). Lunar months vary by 1–2 days year to year due to the Moon\'s elliptical orbit. The Gujarati year runs from Kartik (post-Diwali) through Aso (ending at Diwali).', hi: 'विक्रम संवत् 2083 (2026–27) और वि.सं. 2084 (2027–28) में प्रत्येक गुजराती चान्द्र मास की अनुमानित ग्रेगोरियन तिथि सीमाएं। चान्द्र मास चन्द्रमा की कक्षा के कारण 1-2 दिन भिन्न हो सकते हैं। गुजराती वर्ष कार्तिक (दीवाली के बाद) से आसो (दीवाली पर समाप्त) तक चलता है।', gu: 'વિક્રમ સંવત 2083 (2026–27) અને વિ.સં. 2084 (2027–28) માં દરેક ગુજરાતી ચાંદ્ર મહિનાની અંદાજિત ગ્રેગોરિયન તારીખ શ્રેણીઓ. ચાંદ્ર મહિના ચંદ્રની કક્ષાને કારણે 1-2 દિવસ બદલાય છે.' } as LocaleText, locale)}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Gujarati Month', hi: 'गुजराती मास', gu: 'ગુજરાતી મહિનો' } as LocaleText, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: "Gujarati", hi: "गुजराती", gu: "ગુજરાતી" }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">VS 2083 (2026–27)</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">VS 2084 (2027–28)</th>
                </tr>
              </thead>
              <tbody>
                {MONTH_CONVERSION.map((m, i) => (
                  <tr key={m.gujarati} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{m.gujarati}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{m.guj}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.range2026}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.range2027}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Festivals by Month */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isGu ? f.gu : isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bestu Varas */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('bestuTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('bestuText')}
          </p>
        </section>

        {/* Navratri in Gujarat */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('navratriTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('navratriText')}
          </p>
        </section>

        {/* Vikram Samvat Section */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('vikramSamvatTitle')}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>{L('vikramSamvatText')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">2082</div>
                <div className="text-text-secondary text-xs">{tl({ en: 'Vikram Samvat (Oct 2025 – Nov 2026)', hi: 'विक्रम संवत् (अक्टूबर 2025 – नवम्बर 2026)', gu: 'વિક્રમ સંવત (ઓક્ટો. 2025 – નવે. 2026)' } as LocaleText, locale)}</div>
              </div>
              <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-lg mb-1">2083</div>
                <div className="text-text-secondary text-xs">{tl({ en: 'Vikram Samvat (Nov 2026 – Oct 2027)', hi: 'विक्रम संवत् (नवम्बर 2026 – अक्टूबर 2027)', gu: 'વિક્રમ સંવત (નવે. 2026 – ઓક્ટો. 2027)' } as LocaleText, locale)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarText')}
          </p>
        </section>

        {/* Upcoming Gujarati Festival Dates — engine-driven */}
        {(() => {
          const nowIso = todayInIst();
          const upcoming = GUJARATI_FESTIVALS
            .map((f) => {
              const hit = nextUpcoming(f.engineKey, locale, nowIso);
              return hit ? { f, iso: hit.iso, display: hit.display } : null;
            })
            .filter((x): x is { f: GujaratiFestival; iso: string; display: string } => x !== null)
            .sort((a, b) => a.iso.localeCompare(b.iso));
          return (
            <section>
              <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
                {tl({ en: 'Upcoming Gujarati Festival Dates — Tithi & Exact Dates', hi: 'आगामी गुजराती त्योहार — तिथि और सटीक दिनांक', gu: 'આગામી ગુજરાતી તહેવાર — તિથિ અને ચોક્કસ તારીખો' } as LocaleText, locale)}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {tl({
                  en: 'Upcoming dates for major Gujarati festivals with tithi (lunar day), computed for Ahmedabad. Includes Uttarayan, Janmashtami, Navratri, Diwali, Bestu Varas (Gujarati New Year), and Dev Diwali. Dates auto-update daily from our panchang engine — never stale.',
                  hi: 'अहमदाबाद सन्दर्भ के साथ प्रमुख गुजराती त्योहारों की आगामी तिथियां। उत्तरायण, जन्माष्टमी, नवरात्रि, दीवाली, बेस्टु वरस (गुजराती नव वर्ष) और देव दीवाली — सभी तिथियां पंचांग engine से गणित और स्वतः अद्यतित।',
                  gu: 'અમદાવાદ સંદર્ભ સાથે મુખ્ય ગુજરાતી તહેવારોની આગામી તારીખો. ઉત્તરાયણ, જન્માષ્ટમી, નવરાત્રિ, દિવાળી, બેસ્તુ વર્સ (ગુજરાતી નવું વર્ષ), દેવ દિવાળી — બધી તારીખો પંચાંગ એન્જિનમાંથી ગણતરી અને દરરોજ સ્વતઃ-અપડેટ.',
                } as LocaleText, locale)}
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Festival', hi: 'त्योहार', gu: 'તહેવાર' } as LocaleText, locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Date', hi: 'दिनांक', gu: 'તારીખ' } as LocaleText, locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Tithi', hi: 'तिथि', gu: 'તિથિ' } as LocaleText, locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(({ f, iso, display }, i) => (
                      <tr key={`${f.en}-${iso}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                        <td className="px-4 py-2.5 text-text-primary font-medium">{isGu ? f.gu : isHi ? f.hi : f.en}</td>
                        <td className="px-4 py-2.5 text-amber-400/80">{display}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {/* History & Cultural Significance (SEO long-form) */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'History & Cultural Significance of the Gujarati Calendar', hi: 'गुजराती कैलेंडर का इतिहास और सांस्कृतिक महत्व', gu: 'ગુજરાતી કૅલેન્ડરનો ઈતિહાસ અને સાંસ્કૃતિક મહત્વ' } as LocaleText, locale)}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {tl({
                en: 'The Gujarati calendar\'s roots extend over two millennia to the founding of the Vikram Samvat era in 57 BCE. Gujarat\'s adoption of the Kartik-start variant reflects a deeply pragmatic cultural choice: the post-Diwali new year aligns with the beginning of the agricultural resting period after the Kharif harvest and the start of the winter trading season. For Gujarat\'s historically powerful merchant communities — the Vaishya Vanias, Lohanas, Patels, and Jains — this timing was commercially significant. The new financial year opening with Chopda Pujan and Bestu Varas meant that account reconciliation, debt settlement, and new credit arrangements all happened during the festive period, binding commerce and celebration together in a way unique to Gujarati culture.',
                hi: 'गुजराती कैलेंडर की जड़ें 57 ई.पू. में विक्रम संवत् युग की स्थापना से दो सहस्राब्दियों से अधिक पुरानी हैं। गुजरात का कार्तिक-शुरू संस्करण अपनाना एक व्यावहारिक सांस्कृतिक चयन है: दीवाली के बाद नया वर्ष खरीफ फसल के बाद कृषि विश्राम काल और शीतकालीन व्यापार मौसम की शुरुआत से मेल खाता है। गुजरात के व्यापारी समुदायों के लिए नए वित्तीय वर्ष का चोपड़ा पूजन और बेस्टु वरस के साथ खुलना व्यापारिक रूप से महत्वपूर्ण था।',
                gu: 'ગુજરાતી કૅલેન્ડરના મૂળ 57 ઈ.પૂ.માં વિક્રમ સંવત યુગની સ્થાપના સુધી બે સહસ્ત્રાબ્દીથી વધુ જૂના છે. ગુજરાતનો કારતક-શરૂ સંસ્કરણ અપનાવવો એ વ્યાવહારિક સાંસ્કૃતિક પસંદગી છે: દિવાળી પછી નવું વર્ષ ખરીફ લણણી પછીના કૃષિ વિશ્રામ અને શિયાળાના વેપાર મોસમની શરૂઆત સાથે મેળ ખાય છે.',
              } as LocaleText, locale)}
            </p>
            <p>
              {tl({
                en: 'The Gujarati Panchang (almanac) has been an indispensable part of household and business life for centuries. Published annually by traditional jyotish scholars and panchang houses, these almanacs contain far more than festival dates — they include daily tithi, nakshatra, yoga, and karana calculations; planetary positions and transits; agricultural planting guides keyed to lunar phases; commodity price forecasts (a tradition particularly cherished by Gujarat\'s trading communities); auspicious muhurtas for weddings, house-warming (griha pravesh), vehicle purchases, and new business ventures; and detailed interpretations of the Samvatsara (year) name and its predicted effects. The Gujarati diaspora — one of the largest Indian communities abroad, with significant populations in East Africa, the United Kingdom, the United States, Canada, and Australia — continues to follow the Vikram Samvat calendar for all religious and cultural observances, maintaining an unbroken connection to their ancestral timekeeping tradition.',
                hi: 'गुजराती पंचांग (पंचाँग) सदियों से घर और व्यापार जीवन का अनिवार्य अंग रहा है। पारम्परिक ज्योतिष विद्वानों द्वारा वार्षिक प्रकाशित, इन पंचांगों में त्योहार तिथियों से कहीं अधिक शामिल है — दैनिक तिथि, नक्षत्र, योग, करण; ग्रह स्थिति; कृषि मार्गदर्शन; वस्तु मूल्य पूर्वानुमान; विवाह, गृह प्रवेश, वाहन खरीद के शुभ मुहूर्त; और संवत्सर नाम की विस्तृत व्याख्या। गुजराती प्रवासी — पूर्वी अफ्रीका, ब्रिटेन, अमेरिका, कनाडा और ऑस्ट्रेलिया में — सभी धार्मिक अनुष्ठानों के लिए विक्रम संवत् कैलेंडर का अनुसरण जारी रखते हैं।',
                gu: 'ગુજરાતી પંચાંગ સદીઓથી ઘર અને ધંધાના જીવનનો અનિવાર્ય ભાગ રહ્યું છે. પરંપરાગત જ્યોતિષ વિદ્વાનો દ્વારા વાર્ષિક પ્રકાશિત, આ પંચાંગોમાં તહેવાર તારીખો ઉપરાંત ઘણું વધુ છે — દૈનિક તિથિ, નક્ષત્ર, યોગ, કરણ; ગ્રહ સ્થિતિ; કૃષિ માર્ગદર્શન; ચીજવસ્તુ ભાવ આગાહી; લગ્ન, ગૃહ પ્રવેશ, વાહન ખરીદી માટેના શુભ મુહૂર્ત. ગુજરાતી ડાયસ્પોરા — પૂર્વ આફ્રિકા, બ્રિટન, અમેરિકા, કેનેડા, ઓસ્ટ્રેલિયામાં — તમામ ધાર્મિક ક્રિયાઓ માટે વિક્રમ સંવત કૅલેન્ડર અનુસરે છે.',
              } as LocaleText, locale)}
            </p>
            <p>
              {tl({
                en: 'The Jain community, which has deep historical ties to Gujarat, follows the same Kartik-start Vikram Samvat system. Mahavir Jayanti, Paryushana, and Diwali (marking Mahavira\'s Nirvana) are all determined by this shared calendar, making the Gujarati Vikram Samvat a truly interfaith institution. The calendar\'s intercalary month (Adhika Masa, also called Purushottam Mas) — added approximately every 33 months — is considered inauspicious for major ceremonies like weddings but is prized for extra spiritual practices, fasting, and charitable acts.',
                hi: 'जैन समुदाय, जिसके गुजरात से गहरे ऐतिहासिक सम्बन्ध हैं, उसी कार्तिक-शुरू विक्रम संवत् प्रणाली का अनुसरण करता है। महावीर जयन्ती, पर्युषण और दीवाली (महावीर के निर्वाण का प्रतीक) सभी इसी साझा कैलेंडर से निर्धारित होती हैं। अधिक मास (पुरुषोत्तम मास) — लगभग हर 33 माह में — विवाह जैसे बड़े अनुष्ठानों के लिए अशुभ माना जाता है लेकिन अतिरिक्त आध्यात्मिक साधना, उपवास और दान के लिए श्रेष्ठ है।',
                gu: 'જૈન સમુદાય, જેના ગુજરાત સાથે ઊંડા ઐતિહાસિક સંબંધો છે, એ જ કારતક-શરૂ વિક્રમ સંવત પ્રણાળીને અનુસરે છે. મહાવીર જયંતી, પર્યુષણ અને દિવાળી (મહાવીરના નિર્વાણનું પ્રતીક) આ જ વહેંચાયેલ કૅલેન્ડરથી નક્કી થાય છે. અધિક માસ (પુરુષોત્તમ માસ) — લગભગ દર 33 મહિને — લગ્ન જેવા મોટા સંસ્કાર માટે અશુભ મનાય છે પણ આધ્યાત્મિક સાધના, ઉપવાસ અને દાન માટે ઉત્તમ છે.',
              } as LocaleText, locale)}
            </p>
          </div>
        </section>

        {/* FAQ Section (visible + structured data) */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {tl({ en: 'Frequently Asked Questions (FAQ)', hi: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)', gu: 'વારંવાર પૂછાતા પ્રશ્નો (FAQ)' } as LocaleText, locale)}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <details key={faq.q.en} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isGu ? faq.q.gu : isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isGu ? faq.a.gu : isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_DATA.map((faq) => ({
                '@type': 'Question',
                name: tl(faq.q, locale),
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: tl(faq.a, locale),
                },
              })),
            }),
          }}
        />

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link
                key={link.slug}
                href={`/puja/${link.slug}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isGu ? link.gu : isHi ? link.hi : link.en}
              </Link>
            ))}
            <Link
              href="/calendar"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {tl({ en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', gu: 'તહેવાર કૅલેન્ડર 2026' } as LocaleText, locale)}
            </Link>
            <Link
              href="/calendar/regional/bengali"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {tl({ en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर (पंजिका)', gu: 'બંગાળી પંચાંગ (પંજિકા)' } as LocaleText, locale)}
            </Link>
            <Link
              href="/calendar/regional/tamil"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {tl({ en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर (पंचांगम्)', gu: 'તમિળ પંચાંગ (પંચાંગમ)' } as LocaleText, locale)}
            </Link>
            <Link
              href="/calendar/regional/mithila"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {tl({ en: 'Mithila Calendar (Panjika)', hi: 'मिथिला कैलेंडर (पंजिका)', gu: 'મૈથિળ પંચાંગ (પંજિકા)' } as LocaleText, locale)}
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
