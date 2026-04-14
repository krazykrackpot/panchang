import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-sine.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const JYA_TABLE = [
  { deg: '3.75°', aryabhata: '225', modern: '224.86', error: '0.06%' },
  { deg: '7.50°', aryabhata: '449', modern: '448.75', error: '0.05%' },
  { deg: '11.25°', aryabhata: '671', modern: '670.72', error: '0.04%' },
  { deg: '15.00°', aryabhata: '890', modern: '889.82', error: '0.02%' },
  { deg: '18.75°', aryabhata: '1105', modern: '1105.1', error: '0.01%' },
  { deg: '22.50°', aryabhata: '1315', modern: '1315.6', error: '0.05%' },
  { deg: '30.00°', aryabhata: '1719', modern: '1719.0', error: '0.00%' },
  { deg: '45.00°', aryabhata: '2431', modern: '2431.1', error: '0.00%' },
  { deg: '60.00°', aryabhata: '3438', modern: '3437.7', error: '0.01%' },
  { deg: '90.00°', aryabhata: '3438', modern: '3437.7', error: '0.01%' },
];

const TRANSLATION_CHAIN = [
  { lang: 'Sanskrit', word: 'Jya / Jiva (ज्या / जीवा)', meaning: { en: 'Bowstring', hi: 'धनुष की प्रत्यंचा' }, year: '499 CE', color: '#f0d48a' },
  { lang: 'Arabic', word: 'Jiba (جيب)', meaning: { en: 'Transliteration of Jiva', hi: 'जीवा का ध्वन्यात्मक लिप्यंतरण', sa: 'जीवा का ध्वन्यात्मक लिप्यंतरण', mai: 'जीवा का ध्वन्यात्मक लिप्यंतरण', mr: 'जीवा का ध्वन्यात्मक लिप्यंतरण', ta: 'ஜீவாவின் ஒலிபெயர்ப்பு', te: 'జీవ యొక్క లిప్యంతరీకరణ', bn: 'জীবা-র প্রতিবর্ণীকরণ', kn: 'ಜೀವಾದ ಲಿಪ್ಯಂತರ', gu: 'જીવાનું લિપ્યંતરણ' }, year: '~800 CE', color: '#60a5fa' },
  { lang: 'Arabic (misread)', word: 'Jaib (جيب)', meaning: { en: 'Fold / Pocket / Bosom', hi: 'मोड़ / जेब / वक्ष', sa: 'मोड़ / जेब / वक्ष', mai: 'मोड़ / जेब / वक्ष', mr: 'मोड़ / जेब / वक्ष', ta: 'மடிப்பு / பை / மார்பு', te: 'మడత / జేబు / ఒడి', bn: 'ভাঁজ / পকেট / বক্ষ', kn: 'ಮಡಿಕೆ / ಜೇಬು / ಎದೆ', gu: 'વળાંક / ખિસ્સું / છાતી' }, year: '~900 CE', color: '#f87171' },
  { lang: 'Latin', word: 'Sinus', meaning: { en: 'Bay / Fold / Curve', hi: 'खाड़ी / मोड़ / वक्र', sa: 'खाड़ी / मोड़ / वक्र', mai: 'खाड़ी / मोड़ / वक्र', mr: 'खाड़ी / मोड़ / वक्र', ta: 'வளைகுடா / மடிப்பு / வளைவு', te: 'అఖాతం / మడత / వక్రం', bn: 'উপসাগর / ভাঁজ / বক্র', kn: 'ಕೊಲ್ಲಿ / ಮಡಿಕೆ / ವಕ್ರ', gu: 'ખાડી / વળાંક / વક્ર' }, year: '~1150 CE', color: '#a78bfa' },
  { lang: 'English', word: 'Sine', meaning: { en: 'Mathematical function', hi: 'गणितीय फ़ंक्शन', sa: 'गणितीय फ़ंक्शन', mai: 'गणितीय फ़ंक्शन', mr: 'गणितीय फ़ंक्शन', ta: 'கணிதச் சார்பு', te: 'గణిత ప్రమేయం', bn: 'গাণিতিক ফাংশন', kn: 'ಗಣಿತ ಕಾರ್ಯ', gu: 'ગણિતીય ફંક્શન' }, year: '~1600 CE', color: '#34d399' },
];

const FUNCTIONS = [
  { sanskrit: 'Jya (ज्या)', english: 'Sine', formula: 'sin(θ)', desc: { en: 'Half the chord — the original definition', hi: 'आधी जीवा — मूल परिभाषा', sa: 'आधी जीवा — मूल परिभाषा', mai: 'आधी जीवा — मूल परिभाषा', mr: 'आधी जीवा — मूल परिभाषा', ta: 'நாணின் பாதி — மூல வரையறை', te: 'జ్యా సగం — మూల నిర్వచనం', bn: 'জ্যার অর্ধেক — মূল সংজ্ঞা', kn: 'ಜ್ಯಾದ ಅರ್ಧ — ಮೂಲ ವ್ಯಾಖ್ಯಾನ', gu: 'જીવાનો અર્ધ — મૂળ વ્યાખ્યા' } },
  { sanskrit: 'Kojya (कोज्या)', english: 'Cosine', formula: 'cos(θ)', desc: { en: 'Complement-jya — defined by Aryabhata', hi: 'पूरक-ज्या — आर्यभट द्वारा परिभाषित', sa: 'पूरक-ज्या — आर्यभट द्वारा परिभाषित', mai: 'पूरक-ज्या — आर्यभट द्वारा परिभाषित', mr: 'पूरक-ज्या — आर्यभट द्वारा परिभाषित', ta: 'கோஜ்யா — ஆர்யபடரால் வரையறுக்கப்பட்டது', te: 'కోజ్యా — ఆర్యభట నిర్వచించారు', bn: 'কোজ্যা — আর্যভট কর্তৃক সংজ্ঞায়িত', kn: 'ಕೋಜ್ಯಾ — ಆರ್ಯಭಟರಿಂದ ವ್ಯಾಖ್ಯಾನಿತ', gu: 'કોજ્યા — આર્યભટ દ્વારા વ્યાખ્યાયિત' } },
  { sanskrit: 'Utkrama-jya (उत्क्रमज्या)', english: 'Versine', formula: '1 − cos(θ)', desc: { en: 'Reverse jya — used in eclipse geometry', hi: 'उलटी ज्या — ग्रहण ज्यामिति में उपयोग', sa: 'उलटी ज्या — ग्रहण ज्यामिति में उपयोग', mai: 'उलटी ज्या — ग्रहण ज्यामिति में उपयोग', mr: 'उलटी ज्या — ग्रहण ज्यामिति में उपयोग', ta: 'உத்க்ரமஜ்யா — கிரகண வடிவியலில் பயன்படுத்தப்படுகிறது', te: 'ఉత్క్రమజ్యా — గ్రహణ జ్యామితిలో ఉపయోగించబడింది', bn: 'উৎক্রমজ্যা — গ্রহণ জ্যামিতিতে ব্যবহৃত', kn: 'ಉತ್ಕ್ರಮಜ್ಯಾ — ಗ್ರಹಣ ರೇಖಾಗಣಿತದಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ', gu: 'ઉત્ક્રમજ્યા — ગ્રહણ ભૂમિતિમાં વપરાય છે' } },
  { sanskrit: 'Trijya (त्रिज्या)', english: 'Radius / R = 3438', formula: 'R = 3438\'', desc: { en: 'The base radius in arc-minutes', hi: 'चाप-मिनट में आधार त्रिज्या', sa: 'चाप-मिनट में आधार त्रिज्या', mai: 'चाप-मिनट में आधार त्रिज्या', mr: 'चाप-मिनट में आधार त्रिज्या', ta: 'வில்-நிமிடங்களில் அடிப்படை ஆரம்', te: 'ఆర్క్-నిమిషాలలో ఆధార వ్యాసార్ధం', bn: 'আর্ক-মিনিটে ভিত্তি ব্যাসার্ধ', kn: 'ಆರ್ಕ್-ನಿಮಿಷಗಳಲ್ಲಿ ಆಧಾರ ತ್ರಿಜ್ಯ', gu: 'આર્ક-મિનિટમાં આધાર ત્રિજ્યા' } },
];

export default async function SinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t('title')} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: What Is Jya ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s1Body')}</p>
            <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/15">
              <p className="text-gold-light text-xs font-semibold mb-1">{tl({ en: 'Original Sanskrit Verse', hi: 'मूल संस्कृत श्लोक', sa: 'मूलं संस्कृतश्लोकः' }, locale)}</p>
              <p className="text-text-primary text-sm font-mono">ज्या = अर्धज्या = sin(θ)</p>
              <p className="text-text-secondary text-xs mt-1">{tl({ en: '"Jya" = bowstring of bow | "Ardha" = half', hi: '"ज्या" = धनुष की प्रत्यंचा | "अर्ध" = आधा', sa: '"ज्या" = धनुषः प्रत्यञ्चा | "अर्ध" = अर्धम्' }, locale)}</p>
            </div>
          </div>
          {/* TWO diagrams side by side: Greek chord vs Indian half-chord */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Greek approach: full chord */}
            <div className="text-center">
              <div className="text-red-400 text-xs font-bold mb-2 uppercase tracking-wider">{tl({ en: 'Greek Method — Full Chord', hi: 'यूनानी विधि — पूर्ण जीवा', sa: 'ग्रीकपद्धतिः — पूर्णजीवा' }, locale)}</div>
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.3" />
                <circle cx="100" cy="100" r="2.5" fill="#f87171" opacity="0.5" />
                {/* Full chord */}
                <line x1="36" y1="60" x2="180" y2="60" stroke="#f87171" strokeWidth="2.5" />
                {/* Radii to endpoints */}
                <line x1="100" y1="100" x2="36" y2="60" stroke="#f87171" strokeWidth="1" opacity="0.4" />
                <line x1="100" y1="100" x2="180" y2="60" stroke="#f87171" strokeWidth="1" opacity="0.4" />
                {/* Arc */}
                <path d="M 36 60 A 80 80 0 0 1 180 60" fill="none" stroke="#f87171" strokeWidth="2" opacity="0.6" />
                <text x="100" y="50" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">crd(2θ)</text>
                <text x="100" y="180" textAnchor="middle" fill="#8a8478" fontSize="7">{tl({ en: "Ptolemy's chord → full chord", hi: "टॉलेमी का जीवा → पूरी जीवा", sa: "टॉलेमी का जीवा → पूरी जीवा" }, locale)}</text>
                <text x="100" y="192" textAnchor="middle" fill="#8a8478" fontSize="7">{tl({ en: 'Awkward — needs double angle', hi: 'अजीब, दो कोणों की आवश्यकता', sa: 'कठिनम् — द्विकोणापेक्षा' }, locale)}</text>
              </svg>
            </div>

            {/* Indian approach: half-chord = Jya = sine */}
            <div className="text-center">
              <div className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">{tl({ en: 'Indian Method — Ardha-jya (= Sine!)', hi: 'भारतीय विधि — अर्धज्या (= Sine!)', sa: 'भारतीयपद्धतिः — अर्धज्या (= Sine!)' }, locale)}</div>
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.3" />
                <circle cx="100" cy="100" r="2.5" fill="#34d399" opacity="0.5" />
                {/* Half chord = sine */}
                <line x1="100" y1="40" x2="170" y2="40" stroke="#34d399" strokeWidth="3" />
                {/* Perpendicular to center */}
                <line x1="100" y1="100" x2="100" y2="40" stroke="#f0d48a" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
                {/* Radius to point */}
                <line x1="100" y1="100" x2="170" y2="40" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
                {/* Arc from top */}
                <path d="M 100 20 A 80 80 0 0 1 170 40" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.6" />
                {/* Angle */}
                <path d="M 100 80 A 20 20 0 0 1 112 76" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="116" y="82" fill="#fbbf24" fontSize="10">θ</text>
                <text x="140" y="35" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">sin(θ)</text>
                <text x="88" y="72" textAnchor="end" fill="#f0d48a" fontSize="7" opacity="0.7">cos(θ)</text>
                <text x="100" y="180" textAnchor="middle" fill="#8a8478" fontSize="7">{tl({ en: "Aryabhata's Jya → SINE is born", hi: "आर्यभट की ज्या → SINE का जन्म", sa: "आर्यभट की ज्या → SINE का जन्म" }, locale)}</text>
                <text x="100" y="192" textAnchor="middle" fill="#34d399" fontSize="7">{tl({ en: 'Elegant — one angle, directly useful', hi: 'सुंदर, प्रत्यक्ष, एक कोण पर्याप्त', sa: 'सुन्दरम् — एकः कोणः, प्रत्यक्षोपयोगी' }, locale)}</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs text-text-secondary leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {tl({ en: '💡 Greeks worked with full chords — needing two points on the circle. Indians simplified the idea: take HALF the chord (Ardha-jya) — it directly relates to a single angle. This small innovation IS the sine function, and it made all of trigonometry possible.', hi: '💡 यूनानियों ने पूर्ण जीवा (chord) के साथ काम किया — जिसमें दो बिन्दुओं की आवश्यकता थी। भारतीयों ने विचार को सरल किया: आधी जीवा लें (अर्धज्या) — यह सीधे एक कोण से सम्बन्धित है। यह छोटा सा नवाचार ही sine फ़ंक्शन है, और इसने सम्पूर्ण त्रिकोणमिति को सम्भव बनाया।', sa: '💡 यूनानियों ने पूर्ण जीवा (chord) के साथ काम किया — जिसमें दो बिन्दुओं की आवश्यकता थी। भारतीयों ने विचार को सरल किया: आधी जीवा लें (अर्धज्या) — यह सीधे एक कोण से सम्बन्धित है। यह छोटा सा नवाचार ही sine फ़ंक्शन है, और इसने सम्पूर्ण त्रिकोणमिति को सम्भव बनाया।' }, locale)}
          </div>

          {/* Original detailed bowstring diagram */}
          <div className="flex justify-center mt-4">
            <svg viewBox="0 0 260 220" className="w-full max-w-[250px]">
              <defs>
                <linearGradient id="sineGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
              </defs>
              {/* Circle (the "bow") */}
              <circle cx="130" cy="110" r="85" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
              {/* Center point */}
              <circle cx="130" cy="110" r="3" fill="#f0d48a" />
              {/* Chord (full Jya) */}
              <line x1="55" y1="65" x2="205" y2="65" stroke="url(#sineGold)" strokeWidth="2.5" />
              <text x="130" y="55" textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">{tl({ en: 'Jya (full chord)', hi: 'ज्या (पूर्ण जीवा)', sa: 'ज्या (पूर्णजीवा)' }, locale)}</text>
              {/* Half chord = Ardha-jya = sine */}
              <line x1="130" y1="65" x2="205" y2="65" stroke="#34d399" strokeWidth="3" />
              <text x="170" y="80" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">{tl({ en: 'Ardha-jya = sin', hi: 'अर्धज्या = sin', sa: 'अर्धज्या = sin' }, locale)}</text>
              {/* Perpendicular from center to chord */}
              <line x1="130" y1="110" x2="130" y2="65" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Radius line */}
              <line x1="130" y1="110" x2="205" y2="65" stroke="#f0d48a" strokeWidth="1.2" opacity="0.5" />
              <text x="175" y="100" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.7">{tl({ en: 'Radius R', hi: 'त्रिज्या R', sa: 'त्रिज्या R' }, locale)}</text>
              {/* Angle arc */}
              <path d="M 155 110 A 25 25 0 0 0 144 88" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
              <text x="162" y="100" fill="#fbbf24" fontSize="8">θ</text>
              {/* Labels */}
              <text x="130" y="200" textAnchor="middle" fill="#8a8478" fontSize="7">{tl({ en: 'Circle = Bow | Jya = Bowstring', hi: 'वृत्त = धनुष | ज्या = प्रत्यंचा', sa: 'वृत्तम् = धनुः | ज्या = प्रत्यञ्चा' }, locale)}</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Section 2: Aryabhata's Jya Table ────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-2" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s2Body')}</p>

        {/* Source quote */}
        <div className="p-4 rounded-xl bg-gold-primary/8 border-l-4 border-gold-primary/50 mb-6">
          <p className="text-gold-light text-xs font-semibold mb-1">{tl({ en: 'Classical Source', hi: 'मूल स्रोत', sa: 'शास्त्रीयस्रोतः' }, locale)}</p>
          <p className="text-text-primary text-sm italic font-mono">आर्यभटीय, गणितपाद, श्लोक १२</p>
          <p className="text-text-secondary text-xs mt-1 font-mono">मखि भखि फखि धखि नखि नखि मखि फखि...</p>
          <p className="text-text-secondary text-xs mt-1">{t('s2Source')}</p>
        </div>

        {/* Accuracy table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{tl({ en: 'Angle', hi: 'कोण', sa: 'कोणः' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Aryabhata (499 CE)', hi: 'आर्यभट (499 ई.)', sa: 'आर्यभटः (499 CE)' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Modern Value', hi: 'आधुनिक मान', sa: 'आधुनिकमानम्' }, locale)}</th>
                <th className="text-right text-gold-light py-2">{tl({ en: 'Error', hi: 'त्रुटि', sa: 'त्रुटिः' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {JYA_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="text-text-primary py-1.5 pr-4 font-mono">{row.deg}</td>
                  <td className="text-right text-text-primary py-1.5 pr-4 font-mono">{row.aryabhata}</td>
                  <td className="text-right text-text-secondary py-1.5 pr-4 font-mono">{row.modern}</td>
                  <td className={`text-right py-1.5 font-mono ${parseFloat(row.error) < 0.05 ? 'text-emerald-400' : 'text-amber-400'}`}>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs mt-2 italic">{tl({ en: '* Values on scale of R=3438 (radius in arc-minutes)', hi: '* मान R=3438 (चाप-मिनट त्रिज्या) के पैमाने पर', sa: '* मानानि R=3438 (चापकलायाः त्रिज्यायाः) मापदण्डे' }, locale)}</p>
      </div>

      {/* ── Section 3: The Mistranslation Chain ──────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s3Body')}</p>

        {/* Translation chain flow */}
        <div className="flex flex-col gap-3">
          {TRANSLATION_CHAIN.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0e27]" style={{ background: step.color }}>
                {i + 1}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: step.color }}>{step.lang}</span>
                  <span className="text-text-secondary text-xs">·</span>
                  <span className="text-text-primary text-sm font-mono font-semibold">{step.word}</span>
                  <span className="text-text-secondary text-xs">·</span>
                  <span className="text-text-secondary text-xs">{lt(step.meaning as LocaleText, locale)}</span>
                  <span className="ml-auto text-text-secondary text-xs">{step.year}</span>
                </div>
              </div>
              {i < TRANSLATION_CHAIN.length - 1 && (
                <div className="flex-shrink-0 text-text-secondary text-xs">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-200 text-xs">
            {tl({ en: '⚡ The moment "Jiba" was misread as "Jaib" (pocket) — a vowel mis-insertion error, a limitation of written Arabic. This single misreading changed the name of "sine" forever. The mathematics was unchanged.', hi: '⚡ वह क्षण जब "जिबा" को गलती से "जैब" (जेब) पढ़ा गया — यह एक अनुचित स्वर जोड़ने की त्रुटि थी, जो अरबी लिपि की एक सीमा है। इस एक पढ़ने की गलती ने "sine" का नाम बदल दिया, लेकिन गणित वही रहा।', sa: '⚡ वह क्षण जब "जिबा" को गलती से "जैब" (जेब) पढ़ा गया — यह एक अनुचित स्वर जोड़ने की त्रुटि थी, जो अरबी लिपि की एक सीमा है। इस एक पढ़ने की गलती ने "sine" का नाम बदल दिया, लेकिन गणित वही रहा।' }, locale)}
          </p>
        </div>
      </div>

      {/* ── Section 4: Accuracy Comparison ─────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s4Body')}</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Year computed', hi: 'गणना वर्ष', sa: 'गणना वर्ष', mai: 'गणना वर्ष', mr: 'गणना वर्ष', ta: 'கணக்கிடப்பட்ட ஆண்டு', te: 'గణించిన సంవత్సరం', bn: 'গণনা করা বছর', kn: 'ಲೆಕ್ಕ ಹಾಕಿದ ವರ್ಷ', gu: 'ગણતરી કરેલ વર્ષ' }, value: '499 CE' },
            { label: { en: 'Values given', hi: 'दिए गए मान', sa: 'दिए गए मान', mai: 'दिए गए मान', mr: 'दिए गए मान', ta: 'கொடுக்கப்பட்ட மதிப்புகள்', te: 'ఇచ్చిన విలువలు', bn: 'প্রদত্ত মান', kn: 'ನೀಡಲಾದ ಮೌಲ್ಯಗಳು', gu: 'આપેલ કિંમતો' }, value: '24' },
            { label: { en: 'Interval', hi: 'अंतराल', sa: 'अंतराल', mai: 'अंतराल', mr: 'अंतराल', ta: 'இடைவெளி', te: 'అంతరం', bn: 'ব্যবধান', kn: 'ಅಂತರ', gu: 'અંતર' }, value: '3.75°' },
            { label: { en: 'Worst error', hi: 'सर्वाधिक त्रुटि', sa: 'सर्वाधिक त्रुटि', mai: 'सर्वाधिक त्रुटि', mr: 'सर्वाधिक त्रुटि', ta: 'மோசமான பிழை', te: 'చెత్త తప్పు', bn: 'সবচেয়ে বড় ত্রুটি', kn: 'ಅತ್ಯಂತ ಕೆಟ್ಟ ದೋಷ', gu: 'સૌથી ખરાબ ભૂલ' }, value: '< 0.2%' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-xl font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{lt(stat.label as LocaleText, locale)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Full Trigonometry System ─────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s5Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FUNCTIONS.map((fn, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-gold-light font-semibold text-sm">{fn.sanskrit}</span>
                <span className="text-emerald-400 font-mono text-sm">{fn.formula}</span>
              </div>
              <div className="text-text-secondary text-xs">{isHi ? fn.english + ' — ' : ''}{lt(fn.desc as LocaleText, locale)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: App Connection ──────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s6Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🪐', label: { en: 'Planet Longitudes', hi: 'ग्रह देशान्तर', sa: 'ग्रह देशान्तर', mai: 'ग्रह देशान्तर', mr: 'ग्रह देशान्तर', ta: 'கிரக தீர்க்கரேகைகள்', te: 'గ్రహ రేఖాంశాలు', bn: 'গ্রহ দ্রাঘিমাংশ', kn: 'ಗ್ರಹ ರೇಖಾಂಶ', gu: 'ગ્રહ રેખાંશ' }, detail: { en: 'Ecliptic ↔ Equatorial conversion uses sin/cos', hi: 'क्रांतिवृत्त ↔ भूमध्यरेखीय रूपांतरण sin/cos उपयोग', sa: 'क्रांतिवृत्त ↔ भूमध्यरेखीय रूपांतरण sin/cos उपयोग', mai: 'क्रांतिवृत्त ↔ भूमध्यरेखीय रूपांतरण sin/cos उपयोग', mr: 'क्रांतिवृत्त ↔ भूमध्यरेखीय रूपांतरण sin/cos उपयोग', ta: 'கிரகவட்டம் ↔ நிலநடுக்கோட்டு மாற்றம் sin/cos பயன்படுத்துகிறது', te: 'క్రాంతివృత్తం ↔ భూమధ్యరేఖ మార్పిడి sin/cos ఉపయోగిస్తుంది', bn: 'ক্রান্তিবৃত্ত ↔ বিষুবরেখা রূপান্তর sin/cos ব্যবহার করে', kn: 'ಕ್ರಾಂತಿವೃತ್ತ ↔ ಭೂಮಧ್ಯರೇಖೆ ಪರಿವರ್ತನೆ sin/cos ಬಳಸುತ್ತದೆ', gu: 'ક્રાંતિવૃત્ત ↔ વિષુવવૃત્ત રૂપાંતર sin/cos વાપરે છે' } },
            { icon: '🌅', label: { en: 'Sunrise / Sunset', hi: 'सूर्योदय / सूर्यास्त', sa: 'सूर्योदय / सूर्यास्त', mai: 'सूर्योदय / सूर्यास्त', mr: 'सूर्योदय / सूर्यास्त', ta: 'சூரிய உதயம் / அஸ்தமனம்', te: 'సూర్యోదయం / సూర్యాస్తమయం', bn: 'সূর্যোদয় / সূর্যাস্ত', kn: 'ಸೂರ್ಯೋದಯ / ಸೂರ್ಯಾಸ್ತ', gu: 'સૂર્યોદય / સૂર્યાસ્ત' }, detail: { en: 'Spherical triangle solved via sine rule', hi: 'गोलाकार त्रिकोण ज्या नियम से हल', sa: 'गोलाकार त्रिकोण ज्या नियम से हल', mai: 'गोलाकार त्रिकोण ज्या नियम से हल', mr: 'गोलाकार त्रिकोण ज्या नियम से हल', ta: 'சைன் விதி மூலம் கோள முக்கோணம் தீர்க்கப்படுகிறது', te: 'సైన్ నియమం ద్వారా గోళ త్రిభుజం పరిష్కరించబడింది', bn: 'সাইন নিয়মের মাধ্যমে গোলাকার ত্রিভুজ সমাধান', kn: 'ಸೈನ್ ನಿಯಮದ ಮೂಲಕ ಗೋಲ ತ್ರಿಕೋಣ ಪರಿಹರಿಸಲಾಗಿದೆ', gu: 'સાઈન નિયમ દ્વારા ગોળાકાર ત્રિકોણ ઉકેલાય છે' } },
            { icon: '🌑', label: { en: 'Eclipse Geometry', hi: 'ग्रहण ज्यामिति', sa: 'ग्रहण ज्यामिति', mai: 'ग्रहण ज्यामिति', mr: 'ग्रहण ज्यामिति', ta: 'கிரகண வடிவவியல்', te: 'గ్రహణ జ్యామితి', bn: 'গ্রহণ জ্যামিতি', kn: 'ಗ್ರಹಣ ಜ್ಯಾಮಿತಿ', gu: 'ગ્રહણ ભૂમિતિ' }, detail: { en: 'Magnitude computed with versine formula', hi: 'परिमाण उत्क्रमज्या सूत्र से गणित', sa: 'परिमाण उत्क्रमज्या सूत्र से गणित', mai: 'परिमाण उत्क्रमज्या सूत्र से गणित', mr: 'परिमाण उत्क्रमज्या सूत्र से गणित', ta: 'வேர்சைன் சூத்திரத்தால் அளவு கணக்கிடப்படுகிறது', te: 'వెర్‌సైన్ సూత్రంతో పరిమాణం గణించబడింది', bn: 'ভার্সাইন সূত্রে পরিমাণ গণনা', kn: 'ವರ್‌ಸೈನ್ ಸೂತ್ರದಿಂದ ಪ್ರಮಾಣ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ', gu: 'વર્સાઈન સૂત્ર વડે પરિમાણ ગણતરી' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-text-primary text-sm font-semibold mb-1">{lt(item.label as LocaleText, locale)}</div>
                <div className="text-text-secondary text-xs">{lt(item.detail as LocaleText, locale)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 7: Chain Summary ─────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s7Title')}</h3>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {[
            { text: 'ज्या (Jya)', sub: 'Sanskrit, 499 CE', color: '#f0d48a' },
            { text: '→', color: '#8a8478' },
            { text: 'Jiba جيب', sub: 'Arabic, ~800 CE', color: '#60a5fa' },
            { text: '→', color: '#8a8478' },
            { text: 'Jaib جيب', sub: 'Misread, ~900 CE', color: '#f87171' },
            { text: '→', color: '#8a8478' },
            { text: 'Sinus', sub: 'Latin, ~1150 CE', color: '#a78bfa' },
            { text: '→', color: '#8a8478' },
            { text: 'Sine', sub: 'English, ~1600 CE', color: '#34d399' },
          ].map((item, i) => (
            item.text === '→'
              ? <span key={i} className="text-xl" style={{ color: item.color }}>→</span>
              : (
                <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="font-bold font-mono" style={{ color: item.color }}>{item.text}</span>
                  {item.sub && <span className="text-text-secondary text-xs mt-0.5">{item.sub}</span>}
                </div>
              )
          ))}
        </div>
        <p className="text-text-secondary text-xs mt-4 italic">
          {tl({ en: 'The mathematics was always Indian. Only the name got lost.', hi: 'गणित हमेशा भारतीय था। केवल नाम खो गया।', sa: 'गणितं सर्वदा भारतीयमेव आसीत्। केवलं नाम एव नष्टम् अभवत्।' }, locale)}
        </p>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/earth-rotation" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('earthRotation')} →
          </Link>
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('calculus')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
