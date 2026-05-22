'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { BookOpen, ArrowRight, Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

const LABELS = {
  title: { en: 'Festival Timing Rules (Kala-Vyapti)', hi: 'त्योहार समय नियम (काल-व्याप्ति)' },
  subtitle: { en: 'Why the same tithi can fall on two calendar days  –  and how the correct observation day is determined', hi: 'एक ही तिथि दो कैलेंडर दिनों पर क्यों पड़ सकती है  –  और सही दिन कैसे निर्धारित होता है' },
  theProblem: { en: 'The Problem', hi: 'समस्या' },
  theProblemDesc: { en: 'A tithi lasts ~23 hours 37 minutes, which rarely aligns with a 24-hour solar day. When a tithi spans two calendar days, the question arises: on which day should the festival be observed? The answer depends on the Kala (time window) associated with each festival.', hi: 'एक तिथि लगभग 23 घण्टे 37 मिनट की होती है, जो 24 घण्टे के सौर दिन से मेल नहीं खाती। जब तिथि दो दिनों पर पड़ती है, तो प्रश्न होता है: किस दिन त्योहार मनायें? उत्तर प्रत्येक त्योहार से जुड़े काल (समय खण्ड) पर निर्भर करता है।' },
  learnMore: { en: 'Study the full curriculum', hi: 'पूरा पाठ्यक्रम पढ़ें' },
  relatedTopics: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
} as const;

const RULES = [
  { icon: Sunrise, name: { en: 'Udaya Tithi (Sunrise)', hi: 'उदय तिथि (सूर्योदय)' }, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    desc: { en: 'Default rule. The tithi prevailing at sunrise determines the day. Used for: Holi, Hanuman Jayanti, Dussehra, Govardhan Puja, Bhai Dooj.', hi: 'मूल नियम। सूर्योदय पर जो तिथि हो, वह दिन। होली, हनुमान जयन्ती, दशहरा, गोवर्धन पूजा, भाई दूज।' } },
  { icon: Sun, name: { en: 'Madhyahna (Midday)', hi: 'मध्याह्न' }, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    desc: { en: 'Middle 1/5th of daytime (~10:45 AM – 1:30 PM). Used when the deity was born at midday. Festivals: Ram Navami, Ganesh Chaturthi, Akshaya Tritiya, Hartalika Teej.', hi: 'दिन का मध्य 1/5 भाग (~10:45 – 1:30)। देवता का जन्म मध्याह्न में हुआ। राम नवमी, गणेश चतुर्थी, अक्षय तृतीया, हरतालिका तीज।' } },
  { icon: Sunset, name: { en: 'Pradosh (Evening)', hi: 'प्रदोष (सन्ध्या)' }, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    desc: { en: 'Sunset to ~96 minutes after (4 ghatis). For lamp-lighting and evening worship. Festivals: Diwali (Lakshmi Puja), Dhanteras, Karwa Chauth.', hi: 'सूर्यास्त से ~96 मिनट (4 घटी)। दीप जलाने और सन्ध्या पूजा के लिए। दीपावली, धनतेरस, करवा चौथ।' } },
  { icon: Moon, name: { en: 'Nishita Kaal (Midnight)', hi: 'निशीथ काल (मध्यरात्रि)' }, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    desc: { en: 'The 8th muhurta of the night (~11:40 PM – 12:28 AM). Deities associated with the deep night. Festivals: Janmashtami (Krishna born at midnight), Maha Shivaratri, Narak Chaturdashi.', hi: 'रात्रि का 8वाँ मुहूर्त (~11:40 – 12:28)। गहन रात्रि के देवता। जन्माष्टमी (कृष्ण जन्म), महाशिवरात्रि, नरक चतुर्दशी।' } },
  { icon: Clock, name: { en: 'Arunodaya (Pre-Dawn)', hi: 'अरुणोदय (भोर)' }, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    desc: { en: '4 ghatis (~96 min) before sunrise. For pre-dawn ritual baths and purification. Used for: Narak Chaturdashi (Abhyang Snan), Chhath Puja.', hi: 'सूर्योदय से ~96 मिनट पहले। भोर के स्नान और शुद्धि के लिए। नरक चतुर्दशी (अभ्यंग स्नान), छठ पूजा।' } },
];

const RELATED = [
  { name: { en: 'Adhika Masa', hi: 'अधिक मास' }, href: '/learn/adhika-masa' },
  { name: { en: 'Tithis', hi: 'तिथियाँ' }, href: '/learn/tithis' },
  { name: { en: 'Muhurtas', hi: 'मुहूर्त' }, href: '/learn/muhurtas' },
  { name: { en: 'Masa (Months)', hi: 'मास' }, href: '/learn/masa' },
];

function tl(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

export default function FestivalRulesPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {tl(LABELS.title, locale)}
        </h2>
        <p className="text-text-secondary text-lg">{tl(LABELS.subtitle, locale)}</p>
      </div>

      {/* The Problem */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>{tl(LABELS.theProblem, locale)}</h3>
        <p className="text-text-primary leading-relaxed">{tl(LABELS.theProblemDesc, locale)}</p>
      </div>

      {/* Purnimant vs Amant */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>
          {isHi ? 'पूर्णिमान्त बनाम अमान्त  –  एक ही त्योहार, भिन्न मास नाम' : 'Purnimant vs Amant  –  Same Festival, Different Month Names'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>भारत में दो मास-गणना प्रणालियाँ हैं। अमान्त (दक्षिण भारत, गुजरात) में मास अमावस्या (नई चन्द्रमा) पर समाप्त होता है। पूर्णिमान्त (उत्तर भारत) में मास पूर्णिमा पर समाप्त होता है। इसका अर्थ है कि कृष्ण पक्ष (पूर्णिमा के बाद) में पूर्णिमान्त मास अमान्त से एक मास आगे है। दीपावली अमान्त में कार्तिक अमावस्या पर है  –  लेकिन पूर्णिमान्त में भी यही तिथि कार्तिक अमावस्या है (क्योंकि कृष्ण पक्ष में दोनों प्रणालियाँ मेल खाती हैं)। समस्या शुक्ल पक्ष के त्योहारों में आती है।</>
            : <>India uses two month-counting systems. In Amant (South India, Gujarat), the month ends at Amavasya (new moon). In Purnimant (North India), the month ends at Purnima (full moon). During Krishna Paksha (after full moon), the Purnimant month is one ahead of Amant. Diwali is on Kartik Amavasya in Amant  –  and also Kartik Amavasya in Purnimant (because both systems align during Krishna Paksha). The divergence appears for Shukla Paksha festivals.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>उदाहरण: होली पूर्णिमा पर है। अमान्त में यह &quot;फाल्गुन पूर्णिमा&quot; है। पूर्णिमान्त में यह &quot;फाल्गुन पूर्णिमा&quot; ही है (क्योंकि पूर्णिमा पर मास समाप्त होता है, अतः यह फाल्गुन का अन्तिम दिन है)। किन्तु राम नवमी (चैत्र शुक्ल नवमी) अमान्त में &quot;चैत्र&quot; में है, पूर्णिमान्त में भी &quot;चैत्र&quot;  –  यहाँ भी मेल। विसंगति तब प्रकट होती है जब कृष्ण पक्ष के त्योहारों को सन्दर्भित करते हैं। हमारा ऐप सभी त्योहार परिभाषाओं में अमान्त मास नामों का उपयोग करता है (मुख्यधारा के सन्दर्भ पंचांगों के अनुरूप)।</>
            : <>Example: Holi is on Purnima. In Amant it is &quot;Phalguna Purnima.&quot; In Purnimant it is also &quot;Phalguna Purnima&quot; (since Purnima ends the month, it is the last day of Phalguna). But discrepancies appear when Krishna Paksha festivals are referenced across systems. Our app uses Amant month names for all festival definitions (matching mainstream reference panchangs).</>}
        </p>
      </div>

      {/* Rules cards */}
      <div className="space-y-4">
        {RULES.map((rule, i) => {
          const Icon = rule.icon;
          return (
            <div key={i} className={`rounded-2xl border ${rule.color} p-5`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-text-primary">{tl(rule.name, locale)}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-8">{tl(rule.desc, locale)}</p>
            </div>
          );
        })}
      </div>

      {/* Dwi-tithi and Kshaya */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>
          {isHi ? 'द्वि-तिथि, क्षय तिथि और अधिक तिथि' : 'Dwi-Tithi, Kshaya Tithi, and Adhika Tithi'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">द्वि-तिथि (Spanning):</span> जब एक ही तिथि दो क्रमिक सूर्योदय पर उपस्थित हो  –  अर्थात तिथि इतनी लम्बी है कि दो दिनों पर फैलती है। सामान्य नियम: एकादशी के लिए दूसरा दिन चुनें (व्रत लम्बा होता है); अन्य सभी तिथियों के लिए पहला दिन।</>
            : <><span className="text-gold-light font-medium">Dwi-tithi (Spanning):</span> When the same tithi is present at two consecutive sunrises  –  the tithi is long enough to span two days. General rule: for Ekadashi, choose the second day (longer fast); for all other tithis, choose the first day.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">क्षय तिथि (Compressed):</span> जब तिथि एक सूर्योदय और अगले सूर्योदय के बीच पूर्ण हो जाती है  –  किसी भी सूर्योदय पर मौजूद नहीं। यह दुर्लभ है (~2% दिनों पर)। त्योहार पिछले दिन मनाया जाता है।</>
            : <><span className="text-gold-light font-medium">Kshaya Tithi (Compressed):</span> When a tithi completes entirely between one sunrise and the next  –  it is not present at any sunrise. This is rare (~2% of days). The festival is observed on the previous day.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">अधिक तिथि:</span> जब एक अतिरिक्त तिथि सम्मिलित हो  –  एक ही नम्बर की तिथि दो बार आती है। त्योहार दूसरी (निज) तिथि पर मनाया जाता है, पहली (अधिक) पर नहीं।</>
            : <><span className="text-gold-light font-medium">Adhika Tithi:</span> When an extra tithi is inserted  –  the same numbered tithi occurs twice. The festival is observed on the second (Nija) occurrence, not the first (Adhika).</>}
        </p>
      </div>

      {/* Smartha vs Vaishnava */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-blue-500/15">
        <h3 className="text-lg font-semibold text-blue-300 mb-3" style={hf}>
          {isHi ? 'स्मार्त बनाम वैष्णव  –  एकादशी विवाद' : 'Smartha vs Vaishnava  –  The Ekadashi Debate'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>एकादशी व्रत के लिए स्मार्त और वैष्णव सम्प्रदाय भिन्न नियमों का पालन करते हैं। स्मार्त परम्परा उदय तिथि (सूर्योदय पर तिथि) का अनुसरण करती है। वैष्णव परम्परा अतिरिक्त प्रतिबन्ध जोड़ती है: एकादशी में दशमी का &quot;वेध&quot; (संस्पर्श) नहीं होना चाहिए  –  यदि सूर्योदय पर दशमी शेष है, तो एकादशी व्रत अगले दिन (द्वादशी) पर होता है। यही कारण है कि कभी-कभी स्मार्त और वैष्णव एकादशी अलग-अलग दिनों पर पड़ती है।</>
            : <>For Ekadashi fasting, Smartha and Vaishnava traditions follow different rules. The Smartha tradition follows Udaya Tithi (tithi at sunrise). The Vaishnava tradition adds an extra restriction: Ekadashi must not have &quot;Vedha&quot; (contamination) from Dashami  –  if Dashami lingers past sunrise, the Ekadashi fast shifts to the next day (Dwadashi). This is why Smartha and Vaishnava Ekadashis sometimes fall on different days.</>}
        </p>
      </div>

      {/* Visual timeline */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gold-light mb-4" style={hf}>Day Timeline</h3>
        <div className="flex h-10 rounded-lg overflow-hidden text-xs font-medium">
          <div className="bg-rose-500/20 text-rose-300 flex items-center justify-center border-r border-white/10" style={{ width: '7%' }}>Aruno.</div>
          <div className="bg-amber-500/20 text-amber-300 flex items-center justify-center border-r border-white/10" style={{ width: '4%' }}>SR</div>
          <div className="bg-amber-500/10 text-amber-200 flex items-center justify-center border-r border-white/10" style={{ width: '15%' }}>Pratah</div>
          <div className="bg-orange-500/20 text-orange-300 flex items-center justify-center border-r border-white/10" style={{ width: '15%' }}>Madhyahna</div>
          <div className="bg-yellow-500/10 text-yellow-200 flex items-center justify-center border-r border-white/10" style={{ width: '15%' }}>Aparahna</div>
          <div className="bg-purple-500/20 text-purple-300 flex items-center justify-center border-r border-white/10" style={{ width: '14%' }}>Pradosh</div>
          <div className="bg-indigo-500/10 text-indigo-200 flex items-center justify-center border-r border-white/10" style={{ width: '20%' }}>Night</div>
          <div className="bg-indigo-500/20 text-indigo-300 flex items-center justify-center" style={{ width: '10%' }}>Nishita</div>
        </div>
        <div className="flex text-[10px] text-text-secondary mt-1 justify-between px-1">
          <span>4:30</span><span>6:00</span><span>9:36</span><span>1:12</span><span>4:48</span><span>6:00</span><span>9:00</span><span>11:40</span><span>12:28</span>
        </div>
      </div>

      {/* Deep dive link */}
      <Link
        href="/learn/modules/27-1"
        className="flex items-center gap-3 rounded-2xl border border-gold-primary/20 bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors p-5"
      >
        <BookOpen className="w-6 h-6 text-gold-primary flex-shrink-0" />
        <div className="flex-1">
          <div className="text-gold-light font-semibold">{tl(LABELS.learnMore, locale)}</div>
          <div className="text-text-secondary text-sm">Module 27.1  –  The Dharmasindhu algorithm, overlap detection, tie-breaking rules</div>
        </div>
        <ArrowRight className="w-5 h-5 text-gold-primary flex-shrink-0" />
      </Link>

      {/* Related */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">{tl(LABELS.relatedTopics, locale)}</h3>
        <div className="flex flex-wrap gap-3">
          {RELATED.map(r => (
            <Link key={r.href} href={r.href} className="px-4 py-2 rounded-full border border-white/10 bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors text-sm">
              {tl(r.name, locale)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
