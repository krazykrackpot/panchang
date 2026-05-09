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

      {/* Visual: Solar vs Lunar year */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="text-text-primary font-medium">Solar Year: 365.25 days</span>
          <div className="flex-1 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Moon className="w-5 h-5 text-blue-400" />
          <span className="text-text-primary font-medium">Lunar Year: 354.37 days</span>
          <div className="flex-1 h-3 rounded-full bg-blue-500/20 border border-blue-500/30" style={{ width: '97%' }} />
        </div>
        <p className="text-text-secondary text-sm">{isHi ? '10.88 दिन का अन्तर प्रतिवर्ष संचित होता है — ~32.5 महीनों में ~33 दिन, जो एक अतिरिक्त मास की आवश्यकता बनाता है।' : 'The 10.88-day gap accumulates each year — ~33 days in ~32.5 months, requiring an extra month to be inserted.'}</p>
      </div>

      {/* Content sections */}
      {([
        [LABELS.whatIs, LABELS.whatIsDesc],
        [LABELS.howDetected, LABELS.howDetectedDesc],
        [LABELS.naming, LABELS.namingDesc],
        [LABELS.festivals, LABELS.festivalsDesc],
      ] as [Record<string, string>, Record<string, string>][]).map(([title, desc], i) => (
        <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>{tl(title, locale)}</h3>
          <p className="text-text-primary leading-relaxed">{tl(desc, locale)}</p>
        </div>
      ))}

      {/* Why called Purushottam Maas */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-emerald-500/15">
        <h3 className="text-xl font-semibold text-emerald-400 mb-3" style={hf}>
          {isHi ? 'पुरुषोत्तम मास क्यों कहते हैं?' : 'Why Is It Called Purushottam Maas?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पद्म पुराण के अनुसार, जब अधिक मास को कोई देवता स्वामी नहीं मिला (क्योंकि सभी 12 मासों के पहले से स्वामी थे), तो यह मास भगवान विष्णु के पास गया। विष्णु ने इसे अपनाया और इसे &quot;पुरुषोत्तम&quot; (सर्वश्रेष्ठ पुरुष) नाम दिया। इसलिए इसे &quot;मल मास&quot; (अशुद्ध मास — क्योंकि इसमें त्योहार नहीं मनाये जाते) और &quot;पुरुषोत्तम मास&quot; (पवित्र मास — क्योंकि विष्णु पूजा विशेष रूप से फलदायी है) दोनों कहते हैं।</>
            : <>According to the Padma Purana, when Adhika Masa could not find a deity patron (since all 12 months already had one), it approached Lord Vishnu. Vishnu adopted it and gave it the name &quot;Purushottam&quot; (Supreme Being). Hence it is called both &quot;Mal Maas&quot; (impure month — because festivals are not observed) and &quot;Purushottam Maas&quot; (sacred month — because Vishnu worship is especially fruitful).</>}
        </p>
      </div>

      {/* Activities */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>
          {isHi ? 'अधिक मास में क्या करें / क्या न करें' : 'Do\'s and Don\'ts During Adhika Masa'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4">
            <p className="text-emerald-400 font-bold text-sm mb-2">{isHi ? 'शुभ कार्य' : 'Recommended'}</p>
            <ul className="text-text-secondary text-xs space-y-1.5">
              <li>{isHi ? '• जप, ध्यान, मन्त्र पाठ' : '• Japa, meditation, mantra recitation'}</li>
              <li>{isHi ? '• दान (विशेषतः अन्नदान, वस्त्रदान)' : '• Charity (especially food, clothing)'}</li>
              <li>{isHi ? '• विष्णु/कृष्ण पूजा' : '• Vishnu/Krishna worship'}</li>
              <li>{isHi ? '• तीर्थ यात्रा, नदी स्नान' : '• Pilgrimages, sacred river bathing'}</li>
              <li>{isHi ? '• भागवत पुराण पठन' : '• Reading Bhagavat Purana'}</li>
            </ul>
          </div>
          <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4">
            <p className="text-red-400 font-bold text-sm mb-2">{isHi ? 'वर्जित कार्य' : 'Prohibited'}</p>
            <ul className="text-text-secondary text-xs space-y-1.5">
              <li>{isHi ? '• विवाह संस्कार' : '• Marriage ceremonies'}</li>
              <li>{isHi ? '• गृह प्रवेश, नया व्यवसाय' : '• Housewarming, new business'}</li>
              <li>{isHi ? '• मुण्डन, उपनयन' : '• Mundan, Upanayana (thread ceremony)'}</li>
              <li>{isHi ? '• त्योहार अनुष्ठान' : '• Festival rituals'}</li>
              <li>{isHi ? '• प्रमुख निवेश/खरीद' : '• Major investments/purchases'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Metonic Cycle */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-blue-500/15">
        <h3 className="text-lg font-semibold text-blue-300 mb-3" style={hf}>
          {isHi ? 'मेटोनिक चक्र — 19 वर्षों का प्रतिमान' : 'The Metonic Cycle — The 19-Year Pattern'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>19 सौर वर्षों में ठीक 235 चन्द्र मास होते हैं (19 × 12 = 228 + 7 अधिक = 235)। इसका अर्थ है कि 19 वर्षों में ठीक 7 अधिक मास आते हैं। यह मेटोनिक चक्र कहलाता है, जिसे ग्रीक खगोलविद मेटन ने 432 ई.पू. में खोजा था — किन्तु भारतीय ज्योतिष ग्रन्थ इसे इससे भी पहले वर्णित करते हैं। यही कारण है कि अधिक मास लगभग हर 32.5 महीनों में आता है (235/7 ≈ 33.6 महीने प्रति अधिक मास)।</>
            : <>In 19 solar years there are exactly 235 lunar months (19 × 12 = 228 + 7 Adhika = 235). This means exactly 7 Adhika months occur in 19 years. This is the Metonic cycle, discovered by the Greek astronomer Meton in 432 BCE — though Indian astronomical texts describe it even earlier. This is why Adhika Masa occurs approximately every 32.5 months (235/7 ≈ 33.6 months per Adhika).</>}
        </p>
      </div>

      {/* Examples table */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
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
