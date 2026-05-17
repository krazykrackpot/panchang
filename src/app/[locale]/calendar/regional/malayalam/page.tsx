'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  title: {
    en: 'Malayalam Calendar (Kollavarsham)',
    hi: 'मलयालम कैलेंडर (कोल्लावर्षम्)',
    ta: 'மலையாள நாட்காட்டி (கொல்லவர்ஷம்)',
    te: 'మలయాళం కేలండర్ (కొల్లవర్షం)',
    bn: 'মালয়ালম ক্যালেন্ডার (কোল্লাভার্ষম)',
    kn: 'ಮಲಯಾಳಂ ಕ್ಯಾಲೆಂಡರ್ (ಕೊಲ್ಲವರ್ಷಂ)',
    gu: 'મલયાળમ કેલેન્ડર (કોલ્લાવર્ષમ)',
  },
  intro: {
    en: 'The Malayalam calendar, known as Kollavarsham (Kolla Era), is a solar sidereal calendar used exclusively in Kerala by approximately 40 million Malayalam speakers. Like the Tamil calendar, months are defined by the Sun\'s transit through the twelve Rashis — making Malayalam month dates nearly fixed relative to the Gregorian calendar. The Kolla Era is believed to have begun in 825 CE, making 2026 CE correspond to year 1201–1202 ME (Malayalam Era). The calendar governs the agricultural and festival cycle of Kerala, from the grand Onam harvest festival to the monsoon-season Karkidakam Ramayana reading tradition.',
    hi: 'मलयालम कैलेंडर, जिसे कोल्लावर्षम् (कोल्ल युग) के नाम से जाना जाता है, केवल केरल में लगभग 4 करोड़ मलयालम भाषियों द्वारा उपयोग किया जाने वाला सौर नाक्षत्रिक कैलेंडर है। तमिल कैलेंडर की तरह, मास सूर्य के बारह राशियों में गोचर से परिभाषित होते हैं। कोल्ल युग 825 ई. में शुरू हुआ माना जाता है। कैलेंडर केरल के कृषि और उत्सव चक्र को नियंत्रित करता है — महान ओणम फसल उत्सव से लेकर मानसून-कालीन कर्कटकम रामायण पठन परम्परा तक।',
  },
  monthsTitle: {
    en: 'The 12 Malayalam Months',
    hi: '12 मलयालम मास',
    ta: '12 மலையாள மாதங்கள்',
    te: '12 మలయాళం నెలలు',
    bn: '১২টি মালয়ালম মাস',
    kn: '12 ಮಲಯಾಳಂ ತಿಂಗಳುಗಳು',
    gu: '12 મળ્યયાળ મહિના',
  },
  monthsIntro: {
    en: 'Malayalam months begin when the Sun enters each new Rashi (zodiac sign). The order starts from Chingam (Simha/Leo) rather than Mesha, as the Kerala agricultural year traditionally begins with the post-monsoon harvest season. Month lengths vary from 29 to 32 days depending on the Sun\'s speed through each sign.',
    hi: 'मलयालम मास तब शुरू होते हैं जब सूर्य प्रत्येक नई राशि में प्रवेश करता है। क्रम चिंगम (सिंह) से शुरू होता है, न कि मेष से, क्योंकि केरल का कृषि वर्ष परम्परागत रूप से मानसून के बाद की फसल के मौसम से शुरू होता है।',
  },
  festivalsTitle: {
    en: 'Major Malayalam Festivals',
    hi: 'प्रमुख मलयालम त्योहार',
    ta: 'முக்கிய மலையாள திருவிழாக்கள்',
    te: 'ముఖ్యమైన మలయాళం పండుగలు',
    bn: 'প্রধান মালয়ালম উৎসব',
    kn: 'ಪ್ರಮುಖ ಮಲಯಾಳಂ ಹಬ್ಬಗಳು',
    gu: 'મુખ્ય મળ્યયાળ તહેવારો',
  },
  vishuTitle: {
    en: 'Vishu — Malayalam New Year',
    hi: 'विशु — मलयालम नव वर्ष',
  },
  vishuText: {
    en: 'Vishu falls on Medam 1 (the Sun\'s entry into Mesha/Aries), typically April 14–15 — the same astronomical event as Tamil Puthandu and Sinhala/Tamil New Year in Sri Lanka. The defining tradition is the "Vishukkani" — an auspicious arrangement viewed first thing upon waking. The Kani (auspicious sight) is prepared the night before: a large brass bell-metal uruli (vessel) is filled with Kani Konna flowers (golden shower blossoms of Cassia fistula), raw rice, betel leaves, lemon, cucumber, a jackfruit section, a coconut, golden-coloured cloth, coins, a lit lamp, a mirror, and a Vishnu idol. On waking, elders cover their eyes and are led to view the Kani first — the belief being that what you see first on Vishu determines your fortune for the year. "Vishukkaineettam" (gift-giving of money, especially coins and new notes from elders to children) follows, and the day includes fireworks, new clothes (Puthukodi), and a grand feast (Sadya).',
    hi: 'विशु मेदम 1 (सूर्य का मेष/aries में प्रवेश) पर पड़ता है, आमतौर पर 14-15 अप्रैल — तमिल पुथाण्डु के समान खगोलीय घटना। परिभाषित परम्परा "विशुक्कनि" है — जागने पर पहले देखा जाने वाला शुभ दृश्य। कनि (शुभ दृश्य) रात पहले तैयार की जाती है: एक बड़े पीतल के उरुली (बर्तन) को कनिकोन्ना फूलों, कच्चे चावल, बेलपत्र, नींबू, खीरा, कटहल, नारियल, सोने के रंग के कपड़े, सिक्कों, जलते दीपक, दर्पण और विष्णु प्रतिमा से भरा जाता है।',
  },
  onamTitle: {
    en: 'Onam — The Grand Harvest Festival',
    hi: 'ओणम् — महान फसल उत्सव',
  },
  onamText: {
    en: 'Onam is the most celebrated festival in Kerala, occurring in Chingam (August–September) during the Thiruvonam nakshatra. Lasting 10 days (Atham to Thiruvonam), it commemorates the mythical return of the benevolent Asura king Mahabali from the netherworld to visit his beloved subjects. The festival is celebrated with the Pookalam (flower carpet arranged in intricate concentric patterns using fresh flowers), the Onam Sadya (a vegetarian feast of 26 dishes served on banana leaves — including Avial, Sambar, Rasam, Parippu Curry, Olan, Erissery, Kaalan, Pachadi, Pickles, Payasam, and more), Vallam Kali (snake boat races on rivers and backwaters — the Nehru Trophy Boat Race is the most famous), Pulikali (tiger dance procession), and Thiruvathira Kali dance. Onam is a secular festival celebrated by Keralites of all religions.',
    hi: 'ओणम् केरल का सबसे बड़ा उत्सव है, जो चिंगम में थिरुवोणम नक्षत्र के दौरान होता है। 10 दिनों तक चलने वाला यह पर्व पौराणिक राजा महाबली की वापसी का स्मरण कराता है। पूक्कलम (फूलों की आलंकारिक कालीन), ओणम सद्या (केले के पत्ते पर परोसे जाने वाले 26 व्यंजनों का शाकाहारी भोज), और वल्लम काळि (साँप नौका दौड़) इस उत्सव की विशेषताएँ हैं।',
  },
  calendarTitle: {
    en: 'Kollavarsham — Calendar Characteristics',
    hi: 'कोल्लावर्षम् — कैलेंडर विशेषताएँ',
    ta: 'கொல்லவர்ஷம் — நாட்காட்டி சிறப்பியல்புகள்',
    te: 'కొల్లవర్షం — పంచాంగ లక్షణాలు',
    bn: 'কোল্লাভার্ষম — পঞ্জিকার বৈশিষ্ট্য',
    kn: 'ಕೊಲ್ಲವರ್ಷಂ — ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು',
    gu: 'કોલ્લાવર્ષમ — પંચાંગ લક્ષણો',
  },
  calendarText: {
    en: 'The Kollavarsham is purely solar — months track the Sun\'s zodiacal transit, not the Moon. This means no intercalary months are needed (unlike the lunisolar North Indian system), and dates remain consistent year to year. However, the Malayalam calendar does incorporate lunar elements (Tithi, Nakshatra) for determining religious festival timings, making it a hybrid in practice. The calendar year begins in Chingam (Leo) rather than Mesha (Aries), which distinguishes it from the Tamil, Telugu, and Kannada new years. Karkidakam (Cancer, mid-July to mid-August) is considered an inauspicious month — the peak monsoon period when illness is common, weddings are avoided, and the tradition of reading the Ramayana (Karkidaka Ramayana) at home and in temples is observed throughout the month.',
    hi: 'कोल्लावर्षम् पूर्णतः सौर है — मास सूर्य के राशि गोचर को ट्रैक करते हैं, चन्द्रमा को नहीं। इसका अर्थ है कि उत्तर भारतीय चान्द्र-सौर प्रणाली के विपरीत कोई अधिक मास की आवश्यकता नहीं है। कैलेंडर वर्ष चिंगम (सिंह) में शुरू होता है। कर्कटकम (कर्क, मध्य जुलाई से मध्य अगस्त) एक अशुभ माह माना जाता है — चरम मानसून काल जब रामायण पठन (कर्कटक रामायणम्) की परम्परा पूरे महीने घरों और मन्दिरों में मनाई जाती है।',
  },
};

const MALAYALAM_MONTHS = [
  { name: 'Chingam', malayalam: 'ചിങ്ങം', nameHi: 'चिंगम', rashi: 'Simha (Leo)', gregorian: 'Aug 17 – Sep 16' },
  { name: 'Kanni', malayalam: 'കന്നി', nameHi: 'कन्नि', rashi: 'Kanya (Virgo)', gregorian: 'Sep 17 – Oct 17' },
  { name: 'Thulam', malayalam: 'തുലാം', nameHi: 'तुलाम', rashi: 'Tula (Libra)', gregorian: 'Oct 18 – Nov 15' },
  { name: 'Vrischikam', malayalam: 'വൃശ്ചികം', nameHi: 'वृश्चिकम', rashi: 'Vrischika (Scorpio)', gregorian: 'Nov 16 – Dec 15' },
  { name: 'Dhanu', malayalam: 'ധനു', nameHi: 'धनु', rashi: 'Dhanus (Sagittarius)', gregorian: 'Dec 16 – Jan 13' },
  { name: 'Makaram', malayalam: 'മകരം', nameHi: 'मकरम', rashi: 'Makara (Capricorn)', gregorian: 'Jan 14 – Feb 12' },
  { name: 'Kumbham', malayalam: 'കുംഭം', nameHi: 'कुंभम', rashi: 'Kumbha (Aquarius)', gregorian: 'Feb 13 – Mar 13' },
  { name: 'Meenam', malayalam: 'മീനം', nameHi: 'मीनम', rashi: 'Meena (Pisces)', gregorian: 'Mar 14 – Apr 13' },
  { name: 'Medam', malayalam: 'മേടം', nameHi: 'मेदम', rashi: 'Mesha (Aries)', gregorian: 'Apr 14 – May 14' },
  { name: 'Edavam', malayalam: 'ഇടവം', nameHi: 'इदवम', rashi: 'Vrishabha (Taurus)', gregorian: 'May 15 – Jun 14' },
  { name: 'Midhunam', malayalam: 'മിഥുനം', nameHi: 'मिथुनम', rashi: 'Mithuna (Gemini)', gregorian: 'Jun 15 – Jul 15' },
  { name: 'Karkidakam', malayalam: 'കർക്കടകം', nameHi: 'कर्कटकम', rashi: 'Kataka (Cancer)', gregorian: 'Jul 16 – Aug 16' },
];

const FESTIVALS = [
  { month: 'Chingam', en: 'Onam (10-day harvest festival — Atham to Thiruvonam; Pookalam, Sadya, Vallam Kali snake boat races)', hi: 'ओणम् (10 दिवसीय फसल उत्सव — पूक्कलम, सद्या, वल्लम काळि)' },
  { month: 'Medam', en: 'Vishu (Malayalam New Year, Medam 1 — Vishukkani, Vishukkaineettam, feast)', hi: 'विशु (मलयालम नव वर्ष, मेदम 1 — विशुक्कनि, विशुक्कैनीट्टम्)' },
  { month: 'Vrischikam', en: 'Thrissur Pooram (Vrischikam — the largest temple festival in Kerala, featuring caparisoned elephants and fireworks at Vadakkunnathan temple)', hi: 'त्रिशूर पूरम् (वृश्चिकम् — केरल का सबसे बड़ा मन्दिर उत्सव)' },
  { month: 'Dhanu', en: 'Thiruvathira (Dhanu — women\'s festival honouring Shiva and Parvati; Thiruvathira Kali dance performed overnight)', hi: 'तिरुवातिरा (धनु — महिलाओं का उत्सव; तिरुवातिरा काळि नृत्य)' },
  { month: 'Kumbham', en: 'Shivaratri (Kumbham — all-night vigil at Shiva temples across Kerala)', hi: 'शिवरात्रि (कुंभम् — केरल के शिव मन्दिरों में रात्रि जागरण)' },
  { month: 'Karkidakam', en: 'Karkidaka Ramayana (entire month — daily recitation of Adhyatma Ramayana at homes and temples; considered spiritually protective during the difficult monsoon month)', hi: 'कर्कटक रामायणम् (पूरा माह — आध्यात्म रामायण का दैनिक पठन)' },
];

export default function MalayalamCalendarPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    return entry[locale] || entry.en;
  };
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Malayalam</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'राशि' : 'Rashi (Zodiac)'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                </tr>
              </thead>
              <tbody>
                {MALAYALAM_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.malayalam}</td>
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
                  {isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Vishu */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('vishuTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('vishuText')}
          </p>
        </section>

        {/* Onam */}
        <section className="bg-gradient-to-br from-green-900/15 via-bg-secondary/40 to-bg-primary border border-green-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('onamTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('onamText')}
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
            {isHi ? 'सम्बन्धित कैलेंडर' : 'Related Regional Calendars'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/tamil`, label: { en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर' } },
              { href: `/${locale}/calendar/regional/telugu`, label: { en: 'Telugu Calendar (Panchangam)', hi: 'तेलुगु कैलेंडर' } },
              { href: `/${locale}/calendar/regional/kannada`, label: { en: 'Kannada Calendar (Panchangam)', hi: 'कन्नड़ कैलेंडर' } },
              { href: `/${locale}/calendar`, label: { en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026' } },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isHi ? link.label.hi : link.label.en}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
