'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { BookOpen, ArrowRight, Scale, Globe } from 'lucide-react';

const LABELS = {
  title: { en: 'Smarta & Vaishnava Calendar Systems', hi: 'स्मार्त और वैष्णव पंचांग पद्धतियाँ' },
  subtitle: { en: 'Why professional panchangs sometimes disagree by ±1 day — and which system to follow', hi: 'व्यावसायिक पंचांग कभी-कभी ±1 दिन से क्यों भिन्न होते हैं — और कौन सी पद्धति अपनाएँ' },
  sameAstronomy: { en: 'Same Astronomy, Different Rules', hi: 'एक ही खगोल, भिन्न नियम' },
  sameAstronomyDesc: { en: 'Both Smarta and Vaishnava traditions use the same astronomical calculations — the same Moon, the same tithis, the same sunrise. The only difference is which DATE-SELECTION rule applies when a tithi spans two consecutive solar days.', hi: 'स्मार्त और वैष्णव दोनों परम्पराएँ एक ही खगोलीय गणना का उपयोग करती हैं — वही चन्द्रमा, वही तिथियाँ, वही सूर्योदय। अन्तर केवल इसमें है कि जब तिथि दो लगातार सौर दिनों में फैली हो तो कौन सा तिथि-चयन नियम लागू हो।' },
  viddhaKey: { en: 'The Viddha Concept', hi: 'विद्ध अवधारणा' },
  viddhaKeyDesc: { en: 'A tithi is "Viddha" (contaminated) when the previous tithi is present at sunrise. Smartas ignore this — they use the tithi at the required Kala window. Vaishnavas reject the Viddha day entirely and observe the festival on the next day when the tithi is "Shuddha" (pure).', hi: 'तिथि "विद्ध" (दूषित) तब होती है जब सूर्योदय पर पिछली तिथि विद्यमान हो। स्मार्त इसे अनदेखा करते हैं — वे आवश्यक काल विन्डो पर तिथि का उपयोग करते हैं। वैष्णव विद्ध दिन को पूर्णतः अस्वीकार करते हैं और अगले दिन त्योहार मनाते हैं जब तिथि "शुद्ध" हो।' },
  ekadashi: { en: 'Ekadashi: The Biggest Battleground', hi: 'एकादशी: सबसे बड़ा विवाद बिन्दु' },
  ekadashiDesc: { en: 'Smarta and Vaishnava Ekadashi dates differ about 4–6 times per year. Smarta: fast when Ekadashi is at sunrise. Vaishnava: Ekadashi must be "Shuddha" — if Dashami touches sunrise, skip to the next day.', hi: 'स्मार्त और वैष्णव एकादशी तिथियाँ वर्ष में लगभग 4-6 बार भिन्न होती हैं। स्मार्त: सूर्योदय पर एकादशी होने पर उपवास। वैष्णव: एकादशी "शुद्ध" होनी चाहिए — दशमी सूर्योदय को स्पर्श करे तो अगले दिन उपवास।' },
  learnMore: { en: 'Learn the full curriculum', hi: 'पूरा पाठ्यक्रम सीखें' },
  relatedTopics: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
} as const;

const COMPARISON_TABLE = [
  { aspect: 'Default rule', aspectHi: 'मूल नियम', smarta: 'Udaya Tithi', smartaHi: 'उदय तिथि', vaishnava: 'Shuddha Tithi', vaishnavHi: 'शुद्ध तिथि' },
  { aspect: 'Viddha tithi', aspectHi: 'विद्ध तिथि', smarta: 'Accepted', smartaHi: 'स्वीकृत', vaishnava: 'Rejected', vaishnavHi: 'अस्वीकृत' },
  { aspect: 'Ekadashi fast', aspectHi: 'एकादशी उपवास', smarta: 'Day tithi is at sunrise', smartaHi: 'सूर्योदय पर जो तिथि हो', vaishnava: 'Day tithi is "pure"', vaishnavHi: 'जब तिथि "शुद्ध" हो' },
  { aspect: 'Parana', aspectHi: 'पारण', smarta: 'Before Dwadashi ends', smartaHi: 'द्वादशी समाप्ति पहले', vaishnava: 'After sunrise, before 1/4 Dwadashi', vaishnavHi: 'सूर्योदय बाद, 1/4 द्वादशी पहले' },
  { aspect: 'Authority', aspectHi: 'प्रामाणिक ग्रन्थ', smarta: 'Dharmasindhu, Nirnayasindhu', smartaHi: 'धर्मसिन्धु, निर्णयसिन्धु', vaishnava: 'Hari Bhakti Vilasa, Navadvipa Panjika', vaishnavHi: 'हरि भक्ति विलास, नवद्वीप पंजिका' },
  { aspect: 'Followers', aspectHi: 'अनुयायी', smarta: 'Most Hindu families', smartaHi: 'अधिकांश हिन्दू परिवार', vaishnava: 'ISKCON, Gaudiya Vaishnavas', vaishnavHi: 'इस्कॉन, गौड़ीय वैष्णव' },
] as const;

const RELATED = [
  { name: { en: 'Festival Timing Rules', hi: 'त्योहार नियम' }, href: '/learn/festival-rules' },
  { name: { en: 'Adhika Masa', hi: 'अधिक मास' }, href: '/learn/adhika-masa' },
  { name: { en: 'Tithis', hi: 'तिथियाँ' }, href: '/learn/tithis' },
  { name: { en: 'Masa (Lunar Months)', hi: 'मास' }, href: '/learn/masa' },
];

function tl(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

export default function SmartaVaishnavPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const isHi = locale === 'hi' || locale === 'mai' || locale === 'mr';

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {tl(LABELS.title, locale)}
        </h2>
        <p className="text-text-secondary text-lg">{tl(LABELS.subtitle, locale)}</p>
      </div>

      {/* Same Astronomy visual */}
      <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-5 h-5 text-gold-primary" />
          <h3 className="text-xl font-semibold text-gold-light" style={hf}>{tl(LABELS.sameAstronomy, locale)}</h3>
        </div>
        <p className="text-text-primary leading-relaxed mb-4">{tl(LABELS.sameAstronomyDesc, locale)}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="text-amber-400 font-bold text-sm">{isHi ? 'वही चन्द्रमा' : 'Same Moon'}</div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
            <div className="text-blue-400 font-bold text-sm">{isHi ? 'वही तिथियाँ' : 'Same Tithis'}</div>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
            <div className="text-red-400 font-bold text-sm">{isHi ? 'भिन्न नियम' : 'Different Rules'}</div>
          </div>
        </div>
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Smarta card */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="text-xl font-semibold text-amber-400 mb-3" style={hf}>
            {isHi ? 'स्मार्त परम्परा' : 'Smarta Tradition'}
          </h3>
          <ul className="space-y-2 text-text-primary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              <span>{isHi ? 'उदय तिथि (सूर्योदय पर तिथि) मूल नियम' : 'Udaya Tithi (tithi at sunrise) is the default'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              <span>{isHi ? 'विद्ध तिथि स्वीकृत — काल विन्डो निर्णायक' : 'Viddha tithi accepted — Kala window decides'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              <span>{isHi ? 'धर्मसिन्धु और निर्णयसिन्धु प्रामाणिक' : 'Authority: Dharmasindhu, Nirnayasindhu'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              <span>{isHi ? 'अधिकांश हिन्दू परिवार और व्यावसायिक पंचांग' : 'Most Hindu families and professional panchangs'}</span>
            </li>
          </ul>
        </div>

        {/* Vaishnava card */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <h3 className="text-xl font-semibold text-blue-300 mb-3" style={hf}>
            {isHi ? 'वैष्णव परम्परा' : 'Vaishnava Tradition'}
          </h3>
          <ul className="space-y-2 text-text-primary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">-</span>
              <span>{isHi ? 'शुद्ध तिथि — सूर्योदय पर तिथि "शुद्ध" होनी चाहिए' : 'Shuddha Tithi — tithi must be "pure" at sunrise'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">-</span>
              <span>{isHi ? 'विद्ध तिथि अस्वीकृत — अगले दिन खिसकाएँ' : 'Viddha tithi rejected — shift to next day'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">-</span>
              <span>{isHi ? 'हरि भक्ति विलास और नवद्वीप पंजिका प्रामाणिक' : 'Authority: Hari Bhakti Vilasa, Navadvipa Panjika'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 mt-0.5">-</span>
              <span>{isHi ? 'इस्कॉन, गौड़ीय वैष्णव, श्री वैष्णव' : 'ISKCON, Gaudiya Vaishnavas, Sri Vaishnavism'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Viddha concept */}
      <div className="rounded-2xl border border-white/5 bg-bg-secondary/30 p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-3" style={hf}>{tl(LABELS.viddhaKey, locale)}</h3>
        <p className="text-text-primary leading-relaxed">{tl(LABELS.viddhaKeyDesc, locale)}</p>
      </div>

      {/* Ekadashi */}
      <div className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-6">
        <h3 className="text-xl font-semibold text-purple-300 mb-3" style={hf}>{tl(LABELS.ekadashi, locale)}</h3>
        <p className="text-text-primary leading-relaxed">{tl(LABELS.ekadashiDesc, locale)}</p>
      </div>

      {/* Quick Reference Table */}
      <div className="rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 p-6">
        <h3 className="text-xl font-semibold text-gold-light mb-4" style={hf}>
          <Globe className="inline w-5 h-5 mr-2 mb-1" />
          {isHi ? 'त्वरित सन्दर्भ सारणी' : 'Quick Reference Table'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-text-secondary font-medium">{isHi ? 'पहलू' : 'Aspect'}</th>
                <th className="py-2 pr-4 text-amber-400 font-medium">{isHi ? 'स्मार्त' : 'Smarta'}</th>
                <th className="py-2 text-blue-300 font-medium">{isHi ? 'वैष्णव' : 'Vaishnava'}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map(row => (
                <tr key={row.aspect} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-gold-light font-medium">{isHi ? row.aspectHi : row.aspect}</td>
                  <td className="py-3 pr-4 text-text-primary">{isHi ? row.smartaHi : row.smarta}</td>
                  <td className="py-3 text-text-primary">{isHi ? row.vaishnavHi : row.vaishnava}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep dive link */}
      <Link
        href="/learn/modules/27-3"
        className="flex items-center gap-3 rounded-2xl border border-gold-primary/20 bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors p-5"
      >
        <BookOpen className="w-6 h-6 text-gold-primary flex-shrink-0" />
        <div className="flex-1">
          <div className="text-gold-light font-semibold">{tl(LABELS.learnMore, locale)}</div>
          <div className="text-text-secondary text-sm">Module 27.3 — Viddha rules, Ekadashi deep dive, geographic variation, quiz</div>
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
