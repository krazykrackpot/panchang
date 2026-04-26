'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { BookOpen, ArrowRight, Calendar, Sun, Moon } from 'lucide-react';

const LABELS = {
  title: { en: 'Adhika Masa (Intercalary Month)', hi: 'अधिक मास (मलमास)' },
  subtitle: { en: 'How the Hindu calendar reconciles lunar months with the solar year', hi: 'हिन्दू कैलेंडर चन्द्र मास और सौर वर्ष का समन्वय कैसे करता है' },
  whatIs: { en: 'What is Adhika Masa?', hi: 'अधिक मास क्या है?' },
  whatIsDesc: { en: 'A lunar year has only 354 days (12 months of ~29.5 days), while the solar year has 365 days. This 11-day gap accumulates, and without correction, festivals would drift through seasons. Every ~2.7 years, an extra month (Adhika Masa) is inserted to realign the two calendars.', hi: 'चन्द्र वर्ष में केवल 354 दिन होते हैं जबकि सौर वर्ष में 365। यह 11 दिन का अन्तर बढ़ता है। लगभग हर 2.7 वर्ष में एक अतिरिक्त मास (अधिक मास) जोड़ा जाता है।' },
  howDetected: { en: 'How is it detected?', hi: 'इसका पता कैसे चलता है?' },
  howDetectedDesc: { en: 'A lunar month in which no solar Sankranti (Sun entering a new sidereal sign) occurs is declared Adhika. If the Sun is in the same sign at both the starting and ending New Moon conjunctions, no transit happened within that month.', hi: 'जिस चन्द्र मास में कोई सौर संक्रान्ति (सूर्य का नई राशि में प्रवेश) नहीं होती, वह अधिक मास है। यदि आरम्भ और अन्त दोनों अमावस्या पर सूर्य एक ही राशि में हो, तो कोई संक्रान्ति नहीं हुई।' },
  naming: { en: 'Naming Convention', hi: 'नामकरण नियम' },
  namingDesc: { en: 'The Adhika month takes the name of the natural (Nija) month it precedes. For example, in 2029 the Sun stays in Pisces (Meena) across two consecutive New Moons — the Adhika month is called "Adhika Chaitra" because Chaitra is the natural month that follows.', hi: 'अधिक मास अपने बाद आने वाले निज मास का नाम लेता है। उदाहरण: 2029 में सूर्य दो क्रमिक अमावस्या पर मीन राशि में रहता है — अधिक मास "अधिक चैत्र" कहलाता है।' },
  festivals: { en: 'Festivals During Adhika Masa', hi: 'अधिक मास में त्योहार' },
  festivalsDesc: { en: 'Festivals are NOT observed during Adhika months — only during the Nija (regular) month. However, the Adhika month itself is considered sacred for extra spiritual practices like japa, daan, and Vishnu puja.', hi: 'अधिक मास में त्योहार नहीं मनाये जाते — केवल निज मास में। परन्तु अधिक मास स्वयं जप, दान और विष्णु पूजा के लिए पवित्र माना जाता है।' },
  examples: { en: 'Recent & Upcoming Examples', hi: 'हाल के और आगामी उदाहरण' },
  learnMore: { en: 'Learn the full algorithm', hi: 'पूरा एल्गोरिदम सीखें' },
  relatedTopics: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
} as const;

const EXAMPLES = [
  { year: 2026, month: 'Adhika Jyeshtha', period: 'May – Jun', hi: 'अधिक ज्येष्ठ' },
  { year: 2027, month: 'No Adhika', period: '—', hi: 'कोई अधिक मास नहीं' },
  { year: 2029, month: 'Adhika Chaitra', period: 'Mar – Apr', hi: 'अधिक चैत्र' },
  { year: 2031, month: 'Adhika Shravana', period: 'Aug – Sep', hi: 'अधिक श्रावण' },
];

const RELATED = [
  { name: { en: 'Masa (Lunar Months)', hi: 'मास' }, href: '/learn/masa' },
  { name: { en: 'Festival Timing Rules', hi: 'त्योहार नियम' }, href: '/learn/festival-rules' },
  { name: { en: 'Tithis', hi: 'तिथियाँ' }, href: '/learn/tithis' },
];

function tl(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

export default function AdhikaMasaPage() {
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

      {/* Visual: Solar vs Lunar year */}
      <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="text-text-primary font-medium">Solar Year: 365 days</span>
          <div className="flex-1 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Moon className="w-5 h-5 text-blue-400" />
          <span className="text-text-primary font-medium">Lunar Year: 354 days</span>
          <div className="flex-1 h-3 rounded-full bg-blue-500/20 border border-blue-500/30" style={{ width: '97%' }} />
        </div>
        <p className="text-text-secondary text-sm">11-day gap per year accumulates to ~33 days every 3 years, requiring an extra month.</p>
      </div>

      {/* Content sections */}
      {([
        [LABELS.whatIs, LABELS.whatIsDesc],
        [LABELS.howDetected, LABELS.howDetectedDesc],
        [LABELS.naming, LABELS.namingDesc],
        [LABELS.festivals, LABELS.festivalsDesc],
      ] as [Record<string, string>, Record<string, string>][]).map(([title, desc], i) => (
        <div key={i} className="rounded-2xl border border-white/5 bg-bg-secondary/30 p-6">
          <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>{tl(title, locale)}</h3>
          <p className="text-text-primary leading-relaxed">{tl(desc, locale)}</p>
        </div>
      ))}

      {/* Examples table */}
      <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-4" style={hf}>
          <Calendar className="inline w-5 h-5 mr-2 mb-1" />
          {tl(LABELS.examples, locale)}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-text-secondary text-sm font-medium">Year</th>
                <th className="py-2 pr-4 text-text-secondary text-sm font-medium">Adhika Month</th>
                <th className="py-2 text-text-secondary text-sm font-medium">Period</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map(ex => (
                <tr key={ex.year} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-gold-light font-mono">{ex.year}</td>
                  <td className="py-3 pr-4 text-text-primary">{locale === 'hi' ? ex.hi : ex.month}</td>
                  <td className="py-3 text-text-secondary">{ex.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep dive link */}
      <Link
        href="/learn/modules/27-2"
        className="flex items-center gap-3 rounded-2xl border border-gold-primary/20 bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors p-5"
      >
        <BookOpen className="w-6 h-6 text-gold-primary flex-shrink-0" />
        <div className="flex-1">
          <div className="text-gold-light font-semibold">{tl(LABELS.learnMore, locale)}</div>
          <div className="text-text-secondary text-sm">Module 27.2 — Detection algorithm, Amanta vs Purnimanta, Kshaya Masa</div>
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
