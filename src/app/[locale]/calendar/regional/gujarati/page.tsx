'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  title: {
    en: 'Gujarati Calendar (Vikram Samvat)',
    hi: 'गुजराती कैलेंडर (विक्रम संवत्)',
    gu: 'ગુજરાતી કૅલેન્ડર (વિક્રમ સંવત)',
    ta: 'குஜராத்தி நாட்காட்டி (விக்கிரம் சம்வத்)',
    te: 'గుజరాతీ క్యాలెండర్ (విక్రమ సంవత్)',
    bn: 'গুজরাটি ক্যালেন্ডার (বিক্রম সংবৎ)',
    kn: 'ಗುಜರಾತಿ ಕ್ಯಾಲೆಂಡರ್ (ವಿಕ್ರಮ ಸಂವತ್)',
  },
  intro: {
    en: 'The Gujarati calendar follows the Vikram Samvat era, a lunisolar system used across Gujarat by approximately 60 million Gujarati speakers. What makes the Gujarati calendar distinctive is its New Year date: unlike most Indian calendars that begin in Chaitra (March/April), the Gujarati New Year — called Bestu Varas — falls on Kartik Shukla Pratipada, the day after Diwali (October/November). The Vikram Samvat year 2082 corresponds to 2025–2026 CE. The calendar is used for determining religious festivals, muhurtas, and the annual cycle of vrats and observances that shape Gujarati Hindu life.',
    hi: 'गुजराती कैलेंडर विक्रम संवत् युग का अनुसरण करता है, जो गुजरात में लगभग 6 करोड़ गुजराती भाषियों द्वारा उपयोग किया जाने वाला चान्द्र-सौर प्रणाली है। गुजराती कैलेंडर की विशिष्टता इसकी नव वर्ष तिथि है: अधिकांश भारतीय कैलेंडर के विपरीत जो चैत्र में शुरू होते हैं, गुजराती नव वर्ष — जिसे बेस्टु वरस कहते हैं — दीवाली के अगले दिन कार्तिक शुक्ल प्रतिपदा को पड़ता है। विक्रम संवत् 2082, 2025-2026 ई. के अनुरूप है।',
    gu: 'ગુજરાતી કૅલેન્ડર વિક્રમ સંવત યુગને અનુસરે છે, ગુજરાતમાં લગભગ 6 કરોડ ગુજરાતી ભાષીઓ દ્વારા ઉપયોગ થતી ચાંદ્ર-સૌર પ્રણાળી. ગુજરાતી કૅલેન્ડરની વિશેષતા તેની નવા વર્ષની તારીખ છે: બેસ્તુ વર્સ — દિવાળીના બીજા દિવસે કારતક સુદ એકમ. વિક્રમ સંવત 2082, ઈ.સ. 2025-2026ને અનુરૂપ છે.',
  },
  monthsTitle: {
    en: 'The 12 Gujarati Months',
    hi: '12 गुजराती मास',
    gu: '12 ગુજરાતી મહિના',
    ta: '12 குஜராத்தி மாதங்கள்',
    te: '12 గుజరాతీ నెలలు',
    bn: '১২টি গুজরাটি মাস',
    kn: '12 ಗುಜರಾತಿ ತಿಂಗಳುಗಳು',
  },
  monthsIntro: {
    en: 'Gujarati months follow the Amanta system (month ends on Amavasya/New Moon). Uniquely, the Gujarati calendar year begins with Kartik — not Chaitra — so the sequence below reflects the Gujarati year order. The Vikram Samvat uses the same Sanskrit lunar month names as Hindi/North Indian calendars but the year start differs.',
    hi: 'गुजराती मास अमान्त प्रणाली का अनुसरण करते हैं (मास अमावस्या पर समाप्त होता है)। विशेष रूप से, गुजराती कैलेंडर वर्ष चैत्र के बजाय कार्तिक से शुरू होता है। विक्रम संवत् हिन्दी/उत्तर भारतीय कैलेंडर के समान संस्कृत चान्द्र मास नामों का उपयोग करता है लेकिन वर्ष का आरम्भ भिन्न है।',
    gu: 'ગુજરાતી મહિના અમાંત પ્રણાળીને અનુસરે છે (મહિનો અમાસ પર પૂરો થાય છે). ખાસ રીતે, ગુજરાતી વર્ષ ચૈત્ર નહીં, કારતકથી શરૂ થાય છે.',
  },
  festivalsTitle: {
    en: 'Major Gujarati Festivals',
    hi: 'प्रमुख गुजराती त्योहार',
    gu: 'મુખ્ય ગુજરાતી તહેવારો',
    ta: 'முக்கிய குஜராத்தி திருவிழாக்கள்',
    te: 'ముఖ్యమైన గుజరాతీ పండుగలు',
    bn: 'প্রধান গুজরাটি উৎসব',
    kn: 'ಪ್ರಮುಖ ಗುಜರಾತಿ ಹಬ್ಬಗಳು',
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
  },
  calendarText: {
    en: 'The Vikram Samvat is lunisolar: months are lunar (Amanta — New Moon to New Moon), but the year is recalibrated against the solar cycle through an intercalary month (Adhika Masa) every ~33 months. The era is traditionally attributed to Emperor Vikramaditya of Ujjain (57 BCE), making Vikram Samvat 57 years ahead of the Common Era. The Gujarati variant of Vikram Samvat uses the Amanta month system and begins in Kartik, distinguishing it from the Purnimanta Vikram Samvat used in parts of North India (UP, Bihar, Rajasthan) which begins in Chaitra. The Gujarati Panchang publishes detailed predictions for each Samvat year, including agricultural forecasts, gold and commodity price trends (Gujaratis being historically merchant communities), and auspicious muhurtas for major business and life events.',
    hi: 'विक्रम संवत् चान्द्र-सौर है: मास चान्द्र हैं (अमान्त — अमावस्या से अमावस्या तक), लेकिन वर्ष हर ~33 माह में अधिक मास जोड़कर सौर चक्र के साथ पुनर्कैलिब्रेट किया जाता है। यह युग परम्परागत रूप से उज्जैन के सम्राट विक्रमादित्य (57 ईसा पूर्व) को श्रेय दिया जाता है। गुजराती पंचांग प्रत्येक संवत् वर्ष के लिए विस्तृत भविष्यवाणियाँ प्रकाशित करता है।',
    gu: 'વિક્રમ સંવત ચાંદ્ર-સૌર છે: મહિના ચાંદ્ર (અમાંત — અમાસ થી અમાસ), પરંતુ ~33 મહિને અધિક માસ ઉમેરીને સૌર ચક્ર સાથે ફરી ગોઠવવામાં આવે છે. આ યુગ પરંપરાગત રીતે ઉજ્જૈનના સમ્રાટ વિક્રમાદિત્ય (57 ઈ.પૂ.)ને શ્રેય આપવામાં આવે છે.',
  },
};

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

const FESTIVALS = [
  { month: 'Kartik', en: 'Bestu Varas / Gujarati New Year (Kartik Shukla Pratipada, day after Diwali — Chopda Pujan, new account books, Sal Mubarak greetings)', hi: 'बेस्टु वरस / गुजराती नव वर्ष (कार्तिक शुक्ल प्रतिपदा — चोपड़ा पूजन, नई खाता-बहियाँ)', gu: 'બેસ્તુ વર્સ / ગુજરાતી નવું વર્ષ (કારતક સુ. 1, દિવાળી પછી — ચોપડા પૂજન, નવી ચોપડીઓ)' },
  { month: 'Maha', en: 'Uttarayan / Makar Sankranti (January 14 — the biggest kite festival in India; Ahmedabad\'s International Kite Festival draws hundreds of thousands)', hi: 'उत्तरायण / मकर संक्रान्ति (14 जनवरी — भारत का सबसे बड़ा पतंग उत्सव; अहमदाबाद अंतर्राष्ट्रीय पतंग महोत्सव)', gu: 'ઉત્તરાયણ / મકર સંક્રાન્તિ (14 જાન્યુ. — ભારતનો સૌથી મોટો પતંગ ઉત્સવ; અમદાવાદ આંતરરાષ્ટ્રીય પતંગ મહોત્સવ)' },
  { month: 'Shravan', en: 'Janmashtami (Shravan Krishna Ashtami — Lord Krishna\'s birthday; grand celebrations at Dwarka and Mathura-Vrindavan style events across Gujarat)', hi: 'जन्माष्टमी (श्रावण कृष्ण अष्टमी — भगवान कृष्ण जन्मदिन; द्वारका में भव्य उत्सव)', gu: 'જન્માષ્ટમી (શ્રાવણ વદ 8 — ભગવાન કૃષ્ણ જન્મ; દ્વારકામાં ભવ્ય ઉત્સવ)' },
  { month: 'Aso', en: 'Navratri (9 nights of Garba and Dandiya Raas — the most celebrated Navratri in India; UNESCO Intangible Cultural Heritage), Diwali (Aso Amavasya)', hi: 'नवरात्रि (9 रात्रि गरबा और डांडिया रास — भारत में सबसे अधिक मनाई जाने वाली नवरात्रि; यूनेस्को अमूर्त सांस्कृतिक विरासत), दीवाली (आसो अमावस्या)', gu: 'નવરાત્રિ (9 રાત ગરબા અને ડાંડિયા રાસ — ભારતમાં સૌથી ઉજવ્વાઈ જ; UNESCO અમૂર્ત સાંસ્કૃતિક ધરોહર), દિવાળી (આસો અમાસ)' },
];

export default function GujaratiCalendarPage() {
  const locale = useLocale() as Locale;
  const isGu = String(locale) === 'gu';
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    if (isGu && entry.gu) return entry.gu;
    return entry[locale] || entry.en;
  };
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : isGu ? { fontFamily: 'var(--font-gujarati-heading)' } : { fontFamily: 'var(--font-heading)' };

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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isGu ? 'મહિનો' : isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isGu ? 'ગુજરાતી' : 'Gujarati'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isGu ? 'ગ્રેગોરિયન' : isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isGu ? 'નોંધ' : isHi ? 'नोट' : 'Note'}</th>
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

        {/* Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isGu ? (f.gu || f.en) : isHi ? f.hi : f.en}
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

        {/* Calendar Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarText')}
          </p>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {isGu ? 'સંબંધિત પ્રાદેશિક પંચાંગ' : isHi ? 'सम्बन्धित कैलेंडर' : 'Related Regional Calendars'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/bengali`, label: { en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर', gu: 'બંગાળી પંચાંગ' } },
              { href: `/${locale}/calendar/regional/mithila`, label: { en: 'Mithila Calendar (Panjika)', hi: 'मिथिला कैलेंडर', gu: 'મૈથિળ પંચાંગ' } },
              { href: `/${locale}/calendar/regional/tamil`, label: { en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर', gu: 'તમિળ પંચાંગ' } },
              { href: `/${locale}/calendar`, label: { en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', gu: 'તહેવાર કૅલેન્ડર 2026' } },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isGu ? (link.label.gu || link.label.en) : isHi ? link.label.hi : link.label.en}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
