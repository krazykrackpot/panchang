'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  title: {
    en: 'Telugu Calendar (Panchangam)',
    hi: 'तेलुगु कैलेंडर (पंचांगम्)',
    te: 'తెలుగు పంచాంగం',
    ta: 'தெலுங்கு நாட்காட்டி (பஞ்சாங்கம்)',
    bn: 'তেলেগু ক্যালেন্ডার (পঞ্চাঙ্গম্)',
    kn: 'ತೆಲುಗು ಕ್ಯಾಲೆಂಡರ್ (ಪಂಚಾಂಗಂ)',
    gu: 'તેલુગુ કેલેન્ડર (પંચાંગ)',
  },
  intro: {
    en: 'The Telugu Panchangam is a lunisolar calendar used by approximately 80 million Telugu speakers across Andhra Pradesh, Telangana, and the global Telugu diaspora. Unlike the Tamil solar calendar, the Telugu system follows the Chandramana (lunar) tradition — months run from one New Moon to the next, and the year begins on Chaitra Shukla Pratipada (the first lunar day after the New Moon in March/April). This day is celebrated as Ugadi, the Telugu New Year. The Telugu calendar is closely aligned with the broader Vedic Panchanga tradition, tracking Tithi, Vara, Nakshatra, Yoga, and Karana alongside month names that correspond to the Sanskrit lunar month sequence.',
    hi: 'तेलुगु पंचांगम् एक चान्द्र-सौर कैलेंडर है जिसका उपयोग आन्ध्र प्रदेश, तेलंगाना और विश्वभर के लगभग 8 करोड़ तेलुगु भाषियों द्वारा किया जाता है। तमिल सौर कैलेंडर के विपरीत, तेलुगु प्रणाली चान्द्रमान (चन्द्र) परम्परा का पालन करती है — मास एक अमावस्या से अगली तक चलते हैं, और वर्ष चैत्र शुक्ल प्रतिपदा को आरम्भ होता है। इस दिन को उगादि (तेलुगु नव वर्ष) के रूप में मनाया जाता है।',
    te: 'తెలుగు పంచాంగం ఆంధ్రప్రదేశ్, తెలంగాణ మరియు ప్రపంచవ్యాప్తంగా ఉన్న సుమారు 8 కోట్ల తెలుగు మాట్లాడేవారు ఉపయోగించే చాంద్రమాన పంచాంగం. తమిళ సౌర పంచాంగానికి భిన్నంగా, తెలుగు వ్యవస్థ చంద్రమాన సంప్రదాయాన్ని అనుసరిస్తుంది — నెలలు ఒక అమావాస్య నుండి తదుపరి అమావాస్య వరకు ఉంటాయి, మరియు సంవత్సరం చైత్ర శుద్ధ పాడ్యమి రోజు ప్రారంభమవుతుంది. ఈ రోజును ఉగాది (తెలుగు నూతన సంవత్సరం) గా జరుపుకుంటారు.',
  },
  monthsTitle: {
    en: 'The 12 Telugu Months',
    hi: '12 तेलुगु मास',
    te: '12 తెలుగు నెలలు',
    ta: '12 தெலுங்கு மாதங்கள்',
    bn: '১২টি তেলেগু মাস',
    kn: '12 ತೆಲುಗು ತಿಂಗಳುಗಳು',
    gu: '12 તેલુગુ મહિના',
  },
  monthsIntro: {
    en: 'Telugu months follow the Sanskrit lunar month names. Each month begins on the day after Amavasya (New Moon) and ends on the following Amavasya. When a lunar month is skipped due to solar alignment, an intercalary month (Adhika Masa) is inserted approximately every 33 months.',
    hi: 'तेलुगु मास संस्कृत चान्द्र मास नामों का अनुसरण करते हैं। प्रत्येक मास अमावस्या के अगले दिन आरम्भ होकर अगली अमावस्या पर समाप्त होता है। जब सौर संरेखण के कारण एक चान्द्र मास छूट जाता है, तो लगभग हर 33 माह में अधिक मास जोड़ा जाता है।',
    te: 'తెలుగు నెలలు సంస్కృత చంద్రమాన నెల పేర్లను అనుసరిస్తాయి. ప్రతి నెల అమావాస్య మరుసటి రోజు ప్రారంభమై, తదుపరి అమావాస్యనాడు ముగుస్తుంది. సౌర అమరికతో ఒక చంద్ర మాసం వదిలిపోయినప్పుడు, సుమారు 33 నెలలకు ఒకసారి అధిక మాసం చేర్చబడుతుంది.',
  },
  festivalsTitle: {
    en: 'Major Telugu Festivals',
    hi: 'प्रमुख तेलुगु त्योहार',
    te: 'ముఖ్యమైన తెలుగు పండుగలు',
    ta: 'முக்கிய தெலுங்கு திருவிழாக்கள்',
    bn: 'প্রধান তেলেগু উৎসব',
    kn: 'ಪ್ರಮುಖ ತೆಲುಗು ಹಬ್ಬಗಳು',
    gu: 'મુખ્ય તેલુગુ તહેવારો',
  },
  ugadiTitle: {
    en: 'Ugadi — Telugu New Year',
    hi: 'उगादि — तेलुगु नव वर्ष',
    te: 'ఉగాది — తెలుగు నూతన సంవత్సరం',
  },
  ugadiText: {
    en: 'Ugadi (from Sanskrit "Yuga Adi" — beginning of an era) falls on Chaitra Shukla Pratipada, typically in late March or early April. It is celebrated simultaneously as the Telugu and Kannada New Year. The day begins with an oil bath (Abhyanga Snanam), followed by prayers and the preparation of "Ugadi Pachadi" — a chutney combining six tastes: raw mango (sourness), jaggery (sweetness), neem flowers (bitterness), tamarind (tartness), green chilli (heat), and salt (pungency). These six tastes symbolise the six experiences of life — joy, sorrow, surprise, fear, disgust, and anger — reminding celebrants to embrace all of life\'s experiences in the year ahead. The Panchangam Sravanam (recitation of the new year\'s almanac) is a central ceremony, where priests read out predictions for the year based on the ruling planet, tithi, and nakshatra of Ugadi.',
    hi: 'उगादि (संस्कृत "युग आदि" — एक युग का आरम्भ) चैत्र शुक्ल प्रतिपदा को मनाया जाता है, आमतौर पर मार्च के अन्त या अप्रैल के आरम्भ में। इसे एक साथ तेलुगु और कन्नड़ नव वर्ष के रूप में मनाया जाता है। "उगादि पचड़ी" — कच्चा आम, गुड़, नीम के फूल, इमली, हरी मिर्च और नमक मिलाकर बनाई जाती है। ये छह स्वाद जीवन के छह अनुभवों का प्रतीक हैं। पंचांगम् श्रवणम् एक केन्द्रीय समारोह है जहाँ पुजारी उगादि के शासक ग्रह, तिथि और नक्षत्र के आधार पर वार्षिक भविष्यवाणियाँ पढ़ते हैं।',
    te: 'ఉగాది (సంస్కృతం "యుగ ఆది" — ఒక యుగం ప్రారంభం) చైత్ర శుద్ధ పాడ్యమి రోజు వస్తుంది, సాధారణంగా మార్చి చివరి లేదా ఏప్రిల్ ప్రారంభంలో. దీన్ని తెలుగు మరియు కన్నడ నూతన సంవత్సరంగా ఏకకాలంలో జరుపుకుంటారు. "ఉగాది పచ్చడి" — పచ్చి మామిడికాయ, బెల్లం, వేప పూలు, చింతపండు, పచ్చి మిరప, ఉప్పు కలిపి తయారు చేస్తారు. ఈ ఆరు రుచులు జీవితంలోని ఆరు అనుభవాలను సూచిస్తాయి. పంచాంగ శ్రవణం ఒక కేంద్ర వేడుక, ఇక్కడ పూజారులు ఉగాది నాటి రాజ్యపాలక గ్రహం, తిథి మరియు నక్షత్రం ఆధారంగా వార్షిక అంచనాలు చదువుతారు.',
  },
  calendarTitle: {
    en: 'Calendar Characteristics',
    hi: 'कैलेंडर विशेषताएँ',
    te: 'పంచాంగ లక్షణాలు',
    ta: 'நாட்காட்டி சிறப்பியல்புகள்',
    bn: 'পঞ্জিকার বৈশিষ্ট্য',
    kn: 'ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು',
    gu: 'પંચાંગ લક્ષણો',
  },
  calendarText: {
    en: 'The Telugu Panchangam is lunisolar: months are lunar (New Moon to New Moon, Amanta system), but the year is calibrated against the solar cycle through the addition of Adhika Masa. Telugu months use the Amanta reckoning (month ends on Amavasya), identical to the system used across Karnataka, Maharashtra, and most of South India. The 60-year Jovian cycle (Prabhava through Akshaya) names each year, and Telugu almanacs publish detailed predictions for each named year — agricultural outlooks, rainfall forecasts, and auspicious periods for major life events. The Telugu calendar is used for determining muhurtas (auspicious timings), tithi-based fasting days, and the annual cycle of festivals tied to the agricultural and religious calendar of the Deccan plateau.',
    hi: 'तेलुगु पंचांगम् चान्द्र-सौर है: मास चान्द्र हैं (अमावस्या से अमावस्या तक, अमान्त प्रणाली), लेकिन वर्ष अधिक मास जोड़कर सौर चक्र के साथ कैलिब्रेट किया जाता है। 60-वर्षीय गुरु चक्र (प्रभव से अक्षय) प्रत्येक वर्ष का नाम देता है। तेलुगु पंचांगम् मुहूर्त निर्धारण, तिथि-आधारित व्रत दिवसों और दक्कन पठार के कृषि एवं धार्मिक कैलेंडर से जुड़े उत्सवों के वार्षिक चक्र के लिए उपयोग किया जाता है।',
    te: 'తెలుగు పంచాంగం చాంద్రమాన సౌర: నెలలు చంద్ర (అమావాస్య నుండి అమావాస్య వరకు, అమాంత వ్యవస్థ), కానీ సంవత్సరం అధిక మాసం జోడించడం ద్వారా సౌర చక్రంతో కాలిబ్రేట్ చేయబడుతుంది. 60 సంవత్సరాల గురు చక్రం (ప్రభవ నుండి అక్షయ వరకు) ప్రతి సంవత్సరానికి పేరు ఇస్తుంది. తెలుగు పంచాంగం ముహూర్తాల నిర్ణయానికి, తిథి ఆధారిత ఉపవాస రోజులకు మరియు దక్కన్ పీఠభూమి కృషి-మత పంచాంగంతో ముడిపడిన పండుగల వార్షిక చక్రానికి ఉపయోగించబడుతుంది.',
  },
};

const TELUGU_MONTHS = [
  { name: 'Chaitra', telugu: 'చైత్రం', nameHi: 'चैत्र', rashi: 'Mesha–Vrishabha', gregorian: 'Mar – Apr' },
  { name: 'Vaishakha', telugu: 'వైశాఖం', nameHi: 'वैशाख', rashi: 'Vrishabha–Mithuna', gregorian: 'Apr – May' },
  { name: 'Jyeshtha', telugu: 'జ్యేష్ఠం', nameHi: 'ज्येष्ठ', rashi: 'Mithuna–Kataka', gregorian: 'May – Jun' },
  { name: 'Ashadha', telugu: 'ఆషాఢం', nameHi: 'आषाढ', rashi: 'Kataka–Simha', gregorian: 'Jun – Jul' },
  { name: 'Shravana', telugu: 'శ్రావణం', nameHi: 'श्रावण', rashi: 'Simha–Kanya', gregorian: 'Jul – Aug' },
  { name: 'Bhadrapada', telugu: 'భాద్రపదం', nameHi: 'भाद्रपद', rashi: 'Kanya–Tula', gregorian: 'Aug – Sep' },
  { name: 'Ashvija', telugu: 'ఆశ్వయుజం', nameHi: 'आश्विन', rashi: 'Tula–Vrischika', gregorian: 'Sep – Oct' },
  { name: 'Kartika', telugu: 'కార్తీకం', nameHi: 'कार्तिक', rashi: 'Vrischika–Dhanus', gregorian: 'Oct – Nov' },
  { name: 'Margashira', telugu: 'మార్గశిరం', nameHi: 'मार्गशीर्ष', rashi: 'Dhanus–Makara', gregorian: 'Nov – Dec' },
  { name: 'Pushya', telugu: 'పుష్యం', nameHi: 'पौष', rashi: 'Makara–Kumbha', gregorian: 'Dec – Jan' },
  { name: 'Magha', telugu: 'మాఘం', nameHi: 'माघ', rashi: 'Kumbha–Meena', gregorian: 'Jan – Feb' },
  { name: 'Phalguna', telugu: 'ఫాల్గుణం', nameHi: 'फाल्गुन', rashi: 'Meena–Mesha', gregorian: 'Feb – Mar' },
];

const FESTIVALS = [
  { month: 'Chaitra', en: 'Ugadi (Telugu New Year, Chaitra Shukla Pratipada), Sri Rama Navami (Chaitra Shukla Navami)', hi: 'उगादि (तेलुगु नव वर्ष), श्री राम नवमी', te: 'ఉగాది (తెలుగు నూతన సంవత్సరం, చైత్ర శుద్ధ పాడ్యమి), శ్రీ రామ నవమి (చైత్ర శుద్ధ నవమి)' },
  { month: 'Shravana', en: 'Varalakshmi Vratam (Friday before Shravana Purnima — one of the most important women\'s festivals in Telugu households)', hi: 'वरलक्ष्मी व्रतम् (श्रावण पूर्णिमा से पहले शुक्रवार)', te: 'వరలక్ష్మీ వ్రతం (శ్రావణ పూర్ణిమకు ముందు శుక్రవారం — తెలుగు ఇళ్లలో అత్యంత ముఖ్యమైన స్త్రీల పండుగలలో ఒకటి)' },
  { month: 'Bhadrapada', en: 'Vinayaka Chaturthi (Ganesh festival — 10-day celebration, immersion on Chaturdashi)', hi: 'विनायक चतुर्थी (गणेश उत्सव — 10 दिवसीय उत्सव)', te: 'వినాయక చవితి (గణేశ పండుగ — 10 రోజుల వేడుక, చతుర్దశి నాడు నిమజ్జనం)' },
  { month: 'Ashvija', en: 'Dasara / Vijayadashami (9-night Navaratri culminating in Vijayadashami — celebration of Mahishasura\'s defeat)', hi: 'दशहरा / विजयदशमी (9-रात्रि नवरात्रि)', te: 'దసరా / విజయదశమి (9 రాత్రుల నవరాత్రి, విజయదశమితో ముగింపు — మహిషాసుర వధ వేడుక)' },
  { month: 'Kartika', en: 'Deepavali (Kartika Amavasya — festival of lights), Kartika Purnima (sacred bathing in rivers)', hi: 'दीपावली (कार्तिक अमावस्या), कार्तिक पूर्णिमा (नदी स्नान)', te: 'దీపావళి (కార్తీక అమావాస్య — దీపాల పండుగ), కార్తీక పూర్ణిమ (నదులలో పవిత్ర స్నానం)' },
  { month: 'Magha', en: 'Sankranti / Pongal (Makara Sankranti — the most important harvest festival; 3 days: Bhogi, Sankranti, Kanuma)', hi: 'संक्रान्ति / पोंगल (मकर संक्रान्ति — 3 दिवसीय फसल उत्सव)', te: 'సంక్రాంతి (మకర సంక్రాంతి — అత్యంత ముఖ్యమైన పంట పండుగ; 3 రోజులు: భోగి, సంక్రాంతి, కనుమ)' },
];

export default function TeluguCalendarPage() {
  const locale = useLocale() as Locale;
  const isTe = String(locale) === 'te';
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    if (isTe && entry.te) return entry.te;
    return entry[locale] || entry.en;
  };
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : isTe ? { fontFamily: 'var(--font-telugu-heading)' } : { fontFamily: 'var(--font-heading)' };

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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTe ? 'నెల' : isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTe ? 'తెలుగు' : 'Telugu'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTe ? 'రాశి' : isHi ? 'राशि' : 'Rashi (Zodiac)'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTe ? 'గ్రెగోరియన్' : isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                </tr>
              </thead>
              <tbody>
                {TELUGU_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isTe ? m.telugu : isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.telugu}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.rashi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
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
                  {isTe ? (f.te || f.en) : isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ugadi */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('ugadiTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('ugadiText')}
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
            {isTe ? 'సంబంధిత పంచాంగాలు' : isHi ? 'सम्बन्धित कैलेंडर' : 'Related Regional Calendars'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/tamil`, label: { en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर', te: 'తమిళ పంచాంగం' } },
              { href: `/${locale}/calendar/regional/kannada`, label: { en: 'Kannada Calendar (Panchangam)', hi: 'कन्नड़ कैलेंडर', te: 'కన్నడ పంచాంగం' } },
              { href: `/${locale}/calendar/regional/malayalam`, label: { en: 'Malayalam Calendar (Kollavarsham)', hi: 'मलयालम कैलेंडर', te: 'మలయాళం పంచాంగం' } },
              { href: `/${locale}/calendar`, label: { en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', te: 'పండుగల పంచాంగం 2026' } },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isTe ? (link.label.te || link.label.en) : isHi ? link.label.hi : link.label.en}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
