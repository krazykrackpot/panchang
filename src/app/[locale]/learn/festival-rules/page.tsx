'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { BookOpen, ArrowRight, Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

const LABELS = {
  title: { en: 'Festival Timing Rules (Kala-Vyapti)', hi: 'त्योहार समय नियम (काल-व्याप्ति)' },
  subtitle: { en: 'Why the same tithi can fall on two calendar days — and how the correct observation day is determined', hi: 'एक ही तिथि दो कैलेंडर दिनों पर क्यों पड़ सकती है — और सही दिन कैसे निर्धारित होता है' },
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
      <div className="rounded-2xl border border-white/5 bg-bg-secondary/30 p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>{tl(LABELS.theProblem, locale)}</h3>
        <p className="text-text-primary leading-relaxed">{tl(LABELS.theProblemDesc, locale)}</p>
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

      {/* Visual timeline */}
      <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 p-6">
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
          <div className="text-text-secondary text-sm">Module 27.1 — The Dharmasindhu algorithm, overlap detection, tie-breaking rules</div>
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
