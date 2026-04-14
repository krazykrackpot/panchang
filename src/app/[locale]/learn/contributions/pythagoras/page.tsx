import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-pythagoras.json';


/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

const PYTHAGOREAN_TRIPLES = [
  { a: 3, b: 4, c: 5, check: '9 + 16 = 25' },
  { a: 5, b: 12, c: 13, check: '25 + 144 = 169' },
  { a: 8, b: 15, c: 17, check: '64 + 225 = 289' },
  { a: 7, b: 24, c: 25, check: '49 + 576 = 625' },
];

const TIMELINE = [
  { year: '~1800 BCE', source: 'Plimpton 322 (Babylon)', content: { en: 'Lists Pythagorean triples — no general theorem', hi: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', sa: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', mai: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', mr: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', ta: 'பைதாகரஸ் முக்கூட்டுகளைப் பட்டியலிடுகிறது — பொது தேற்றம் இல்லை', te: 'పైథాగరియన్ త్రయాలను జాబితా చేస్తుంది — సాధారణ సిద్ధాంతం లేదు', bn: 'পাইথাগোরীয় ত্রয়ী তালিকাভুক্ত — কোনো সাধারণ উপপাদ্য নেই', kn: 'ಪೈಥಾಗೊರಿಯನ್ ತ್ರಿವಳಿಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ — ಯಾವುದೇ ಸಾಮಾನ್ಯ ಪ್ರಮೇಯವಿಲ್ಲ', gu: 'પાયથાગોરિયન ત્રિપુટીઓની યાદી — કોઈ સામાન્ય પ્રમેય નહીં' }, color: '#60a5fa' },
  { year: '~800 BCE', source: 'Baudhayana Sulba Sutra', content: { en: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', hi: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', sa: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', mai: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', mr: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', ta: 'பொது தேற்றம் கூறப்பட்டது + √2 ஐந்து தசம இடங்கள் வரை + முக்கூட்டுகள் (3,4,5), (5,12,13), (8,15,17), (7,24,25)', te: 'సాధారణ సిద్ధాంతం చెప్పబడింది + √2 5 దశాంశ స్థానాల వరకు + త్రయాలు (3,4,5), (5,12,13), (8,15,17), (7,24,25)', bn: 'সাধারণ উপপাদ্য বর্ণিত + √2 পাঁচ দশমিক স্থান পর্যন্ত + ত্রয়ী (3,4,5), (5,12,13), (8,15,17), (7,24,25)', kn: 'ಸಾಮಾನ್ಯ ಪ್ರಮೇಯ ಹೇಳಲಾಗಿದೆ + √2 5 ದಶಮಾಂಶ ಸ್ಥಾನಗಳವರೆಗೆ + ತ್ರಿವಳಿಗಳು (3,4,5), (5,12,13), (8,15,17), (7,24,25)', gu: 'સામાન્ય પ્રમેય જણાવ્યું + √2 5 દશાંશ સ્થાન સુધી + ત્રિપુટીઓ (3,4,5), (5,12,13), (8,15,17), (7,24,25)' }, color: '#f0d48a' },
  { year: '~600 BCE', source: 'Apastamba Sulba Sutra', content: { en: 'Refined √2, additional geometric constructions', hi: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', sa: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', mai: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', mr: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', ta: 'செம்மைப்படுத்தப்பட்ட √2, கூடுதல் வடிவியல் கட்டமைப்புகள்', te: 'పరిష్కృత √2, అదనపు జ్యామితీయ నిర్మాణాలు', bn: 'পরিমার্জিত √2, অতিরিক্ত জ্যামিতিক নির্মাণ', kn: 'ಪರಿಷ್ಕೃತ √2, ಹೆಚ್ಚುವರಿ ಜ್ಯಾಮಿತೀಯ ರಚನೆಗಳು', gu: 'પરિષ્કૃત √2, વધારાના ભૌમિતિક બાંધકામો' }, color: '#d4a853' },
  { year: '~570 BCE', source: 'Pythagoras born', content: { en: 'Born in Samos, Greece — 230 years after Baudhayana', hi: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', sa: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', mai: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', mr: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', ta: 'கிரீஸின் சாமோஸில் பிறந்தார் — பௌதாயனருக்குப் பின் 230 ஆண்டுகள்', te: 'గ్రీస్‌లోని సామోస్‌లో జన్మించారు — బౌధాయన తర్వాత 230 సంవత్సరాలు', bn: 'গ্রিসের সামোসে জন্ম — বৌধায়নের ২৩০ বছর পরে', kn: 'ಗ್ರೀಸ್‌ನ ಸಾಮೋಸ್‌ನಲ್ಲಿ ಜನಿಸಿದರು — ಬೌಧಾಯನರ 230 ವರ್ಷಗಳ ನಂತರ', gu: 'ગ્રીસના સામોસમાં જન્મ — બૌધાયન પછી 230 વર્ષ' }, color: '#a78bfa' },
  { year: '~300 BCE', source: "Euclid's Elements, Book I, Prop. 47", content: { en: "Earliest surviving formal Greek proof", hi: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', sa: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', mai: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', mr: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', ta: "எஞ்சியிருக்கும் மிகப் பழமையான முறையான கிரேக்க நிரூபணம்", te: "మిగిలి ఉన్న అత్యంత పురాతన అధికారిక గ్రీక్ నిరూపణ", bn: "বিদ্যমান প্রাচীনতম আনুষ্ঠানিক গ্রিক প্রমাণ", kn: "ಉಳಿದಿರುವ ಅತ್ಯಂತ ಪುರಾತನ ಔಪಚಾರಿಕ ಗ್ರೀಕ್ ಸಾಕ್ಷ್ಯ", gu: "અસ્તિત્વમાં રહેલો સૌથી પ્રાચીન ઔપચારિક ગ્રીક પુરાવો" }, color: '#34d399' },
  { year: '499 CE', source: 'Aryabhatiya', content: { en: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", hi: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', sa: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', mai: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', mr: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', ta: "வானியல் கணக்கீடுகளுக்குத் தேற்றத்தைப் பயன்படுத்துகிறது — கிரக தூரங்கள், கிரகண வடிவியல்", te: "ఖగోళ గణనలకు సిద్ధాంతాన్ని ఉపయోగిస్తుంది — గ్రహ దూరాలు, గ్రహణ జ్యామితి", bn: "জ্যোতির্বিদ্যা গণনার জন্য উপপাদ্য ব্যবহার করে — গ্রহের দূরত্ব, গ্রহণ জ্যামিতি", kn: "ಖಗೋಳ ಲೆಕ್ಕಾಚಾರಗಳಿಗಾಗಿ ಪ್ರಮೇಯವನ್ನು ಬಳಸುತ್ತಾರೆ — ಗ್ರಹ ದೂರಗಳು, ಗ್ರಹಣ ಜ್ಯಾಮಿತಿ", gu: "ખગોળીય ગણતરીઓ માટે પ્રમેયનો ઉપયોગ — ગ્રહ અંતર, ગ્રહણ ભૂમિતિ" }, color: '#fbbf24' },
];

const SQRT2_COMPARISON = [
  { label: 'Baudhayana (~800 BCE)', value: '1.4142156', delta: '+0.0000021', color: '#f0d48a' },
  { label: 'Apastamba (~600 BCE)', value: '1.4142135', delta: '~0.0000000', color: '#d4a853' },
  { label: 'Modern (IEEE 754)', value: '1.4142136', delta: 'reference', color: '#34d399' },
];

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default async function PythagorasPage({ params }: { params: Promise<{ locale: string }> }) {
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

      {/* ── Section 1: The Sulba Sutras ──────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s1Body')}</p>
            <p className="text-text-secondary text-sm leading-relaxed">{t('s1Texts')}</p>
          </div>
          {/* Sulba Sutra lineage */}
          <div className="space-y-2">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
              {isHi ? 'प्रमुख शुल्ब सूत्र' : 'Principal Sulba Sutras'}
            </p>
            {[
              { name: 'Baudhayana', date: '~800 BCE', note: { en: 'Oldest — contains the general theorem', hi: 'सबसे पुराना — सामान्य प्रमेय', sa: 'सबसे पुराना — सामान्य प्रमेय', mai: 'सबसे पुराना — सामान्य प्रमेय', mr: 'सबसे पुराना — सामान्य प्रमेय', ta: 'மிகப் பழமையானது — பொது தேற்றம் கொண்டுள்ளது', te: 'అత్యంత పురాతనమైనది — సాధారణ సిద్ధాంతం కలిగి ఉంది', bn: 'সবচেয়ে পুরানো — সাধারণ উপপাদ্য রয়েছে', kn: 'ಅತ್ಯಂತ ಪುರಾತನ — ಸಾಮಾನ್ಯ ಪ್ರಮೇಯವನ್ನು ಹೊಂದಿದೆ', gu: 'સૌથી જૂનું — સામાન્ય પ્રમેય ધરાવે છે' }, accent: '#f0d48a' },
              { name: 'Manava', date: '~750 BCE', note: { en: 'Geometric transformations', hi: 'ज्यामितीय परिवर्तन', sa: 'ज्यामितीय परिवर्तन', mai: 'ज्यामितीय परिवर्तन', mr: 'ज्यामितीय परिवर्तन', ta: 'வடிவியல் உருமாற்றங்கள்', te: 'జ్యామితీయ పరివర్తనలు', bn: 'জ্যামিতিক রূপান্তর', kn: 'ಜ್ಯಾಮಿತೀಯ ಪರಿವರ್ತನೆ', gu: 'ભૌમિતિક પરિવર્તનો' }, accent: '#d4a853' },
              { name: 'Apastamba', date: '~600 BCE', note: { en: 'Refined √2, additional constructions', hi: 'परिष्कृत √2', sa: 'परिष्कृत √2', mai: 'परिष्कृत √2', mr: 'परिष्कृत √2', ta: 'நுணுக்கமான √2, கூடுதல் கட்டுமானங்கள்', te: 'శుద్ధీకరించిన √2, అదనపు నిర్మాణాలు', bn: 'পরিমার্জিত √2, অতিরিক্ত নির্মাণ', kn: 'ಪರಿಷ್ಕೃತ √2, ಹೆಚ್ಚುವರಿ ನಿರ್ಮಾಣಗಳು', gu: 'શુદ્ધ √2, વધારાના નિર્માણો' }, accent: '#fbbf24' },
              { name: 'Katyayana', date: '~300 BCE', note: { en: 'Generalised geometric transformations', hi: 'सामान्यीकृत ज्यामितीय परिवर्तन', sa: 'सामान्यीकृत ज्यामितीय परिवर्तन', mai: 'सामान्यीकृत ज्यामितीय परिवर्तन', mr: 'सामान्यीकृत ज्यामितीय परिवर्तन', ta: 'பொதுமைப்படுத்தப்பட்ட வடிவியல் உருமாற்றங்கள்', te: 'సాధారణీకరించిన జ్యామితీయ పరివర్తనలు', bn: 'সাধারণীকৃত জ্যামিতিক রূপান্তর', kn: 'ಸಾಮಾನ್ಯೀಕರಿಸಿದ ಜ್ಯಾಮಿತೀಯ ಪರಿವರ್ತನೆಗಳು', gu: 'સામાન્યીકૃત ભૌમિતિક પરિવર્તનો' }, accent: '#a78bfa' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-xs font-mono mt-0.5" style={{ color: s.accent }}>{s.date}</span>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{s.name} Sulba Sutra</p>
                  <p className="text-text-secondary text-xs">{lt(s.note as LocaleText, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Baudhayana's Exact Quote ─────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s2Body')}</p>

        {/* Sanskrit quote block */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center mb-6">
          <p
            className="text-gold-primary text-lg font-bold mb-2 leading-relaxed"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}
          >
            {t('s2Quote')}
          </p>
          <p className="text-gold-light/80 text-sm italic mb-1">{t('s2QuoteTrans')}</p>
          <p className="text-text-secondary/60 text-xs">{t('s2Source')}</p>
        </div>

        {/* SVG Diagram: rectangle with diagonal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto">
            <defs>
              <linearGradient id="pyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0d48a" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
              <filter id="pyGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Rectangle */}
            <rect x="40" y="30" width="160" height="110" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.3" />
            {/* Right angle marker */}
            <path d="M 40 140 L 40 120 L 60 120" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
            {/* Length label (b) */}
            <line x1="40" y1="160" x2="200" y2="160" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="120" y="175" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">b</text>
            {/* Height label (a) */}
            <line x1="215" y1="30" x2="215" y2="140" stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="228" y="90" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">a</text>
            {/* Diagonal */}
            <line x1="40" y1="30" x2="200" y2="140" stroke="url(#pyGold)" strokeWidth="2.5" filter="url(#pyGlow)" />
            <text x="108" y="78" textAnchor="middle" fill="#f0d48a" fontSize="11" fontWeight="bold" transform="rotate(-34, 108, 78)">c (diagonal)</text>
            {/* Formula */}
            <text x="140" y="192" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold">a² + b² = c²</text>
          </svg>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'बौधायन की व्याख्या' : "Baudhayana's meaning"}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? '"आयत का विकर्ण" वह दोनों क्षेत्रफल उत्पन्न करता है जो "लम्बाई और चौड़ाई अलग-अलग" उत्पन्न करती हैं। अर्थात: c² = a² + b²। सभी आयतों के लिए सामान्य नियम।'
                  : '"The diagonal of a rectangle produces" the area that "its length and breadth produce separately." In modern notation: c² = a² + b². A general rule for ALL rectangles.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <p className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'महत्त्व' : 'Significance'}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'यह एक विशेष मामला नहीं है — यह एक सामान्य प्रमेय है। बौधायन ने इसे सभी आयतों पर लागू होने वाले सार्वभौमिक नियम के रूप में कहा।'
                  : 'This is not a special case — it is a general theorem. Baudhayana states it as a universal rule applying to all rectangles.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: √2 Accuracy ───────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s3Body')}</p>

        {/* Formula display */}
        <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center mb-5">
          <p className="text-gold-primary font-mono text-base font-bold mb-1">{t('s3Formula')}</p>
          <p className="text-text-secondary text-xs">
            {isHi ? '= 1.4142156... (आधुनिक: 1.4142135...)' : '= 1.4142156... (modern: 1.4142135...)'}
          </p>
        </div>

        {/* Accuracy comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 pr-4 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'स्रोत' : 'Source'}</th>
                <th className="text-right py-2 pr-4 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'मान' : 'Value'}</th>
                <th className="text-right py-2 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'अंतर' : 'Delta'}</th>
              </tr>
            </thead>
            <tbody>
              {SQRT2_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 text-text-secondary text-xs" style={{ color: row.color }}>{row.label}</td>
                  <td className="py-2 pr-4 text-right text-text-primary font-mono text-xs">{row.value}</td>
                  <td className="py-2 text-right text-text-secondary text-xs">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary/60 text-xs mt-3 italic">
          {isHi
            ? 'बौधायन का मान आधुनिक मान से केवल 0.0000021 अलग है — 5 दशमलव स्थानों तक सही।'
            : "Baudhayana's value differs from the modern value by only 0.0000021 — correct to 5 decimal places."}
        </p>
      </div>

      {/* ── Section 4: Pythagorean Triples ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s4Body')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PYTHAGOREAN_TRIPLES.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/15 text-center"
            >
              <p className="text-gold-light font-bold text-base mb-1">({t.a}, {t.b}, {t.c})</p>
              <p className="text-text-secondary text-xs font-mono">{t.check}</p>
              <p className="text-gold-dark text-xs mt-1">✓</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-xs mt-4 italic">
          {isHi
            ? 'इन सभी का उपयोग वेदी निर्माण में सटीक समकोण बनाने के लिए किया गया था।'
            : 'All used in altar construction to create precise right angles using rope-and-peg geometry.'}
        </p>
      </div>

      {/* ── Section 5: The Altar ─────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s5Body')}</p>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'सूत्र' : 'The formula'}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'यदि मूल वर्ग की भुजा s है, तो दोगुने क्षेत्रफल वाले वर्ग की भुजा = मूल का विकर्ण = s√2। विकर्ण² = s² + s² = 2s²।'
                  : 'If original square has side s, the doubled-area square has side = diagonal of original = s√2. Because: diagonal² = s² + s² = 2s².'}
              </p>
            </div>
          </div>
          {/* SVG: square doubled via diagonal */}
          <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto">
            <defs>
              <linearGradient id="altarGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0d48a" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
            </defs>
            {/* Original small square */}
            <rect x="20" y="60" width="80" height="80" fill="#f0d48a" fillOpacity="0.07" stroke="#d4a853" strokeWidth="1.5" />
            <text x="60" y="105" textAnchor="middle" fill="#d4a853" fontSize="10" fontWeight="bold">s</text>
            <text x="60" y="155" textAnchor="middle" fill="#8a6d2b" fontSize="9">{isHi ? 'मूल वेदी' : 'original altar'}</text>
            {/* Arrow */}
            <text x="115" y="100" fill="#8a8478" fontSize="18">→</text>
            {/* Diagonal of original */}
            <line x1="20" y1="140" x2="100" y2="60" stroke="url(#altarGold)" strokeWidth="2" strokeDasharray="5 3" />
            <text x="48" y="90" fill="#f0d48a" fontSize="8">s√2</text>
            {/* New larger square (rotated 45°, side = s√2) */}
            <g transform="translate(170, 100)">
              <rect x="-56" y="-56" width="80" height="80" fill="#f0d48a" fillOpacity="0.10" stroke="#f0d48a" strokeWidth="1.5" transform="rotate(45)" />
              <text x="0" y="5" textAnchor="middle" fill="#f0d48a" fontSize="10" fontWeight="bold">s√2</text>
              <text x="0" y="82" textAnchor="middle" fill="#8a8478" fontSize="9">{isHi ? 'दोगुनी वेदी' : 'doubled altar'}</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Section 6: Pythagoras ────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s6Body')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: { en: 'Baudhayana stated it', hi: 'बौधायन ने कहा', sa: 'बौधायन ने कहा', mai: 'बौधायन ने कहा', mr: 'बौधायन ने कहा', ta: 'பௌதாயனர் கூறினார்', te: 'బౌధాయన దీనిని చెప్పారు', bn: 'বৌধায়ন এটি বলেছিলেন', kn: 'ಬೌಧಾಯನ ಇದನ್ನು ಹೇಳಿದರು', gu: 'બૌધાયને તે જણાવ્યું' }, date: '~800 BCE', color: '#f0d48a', note: { en: 'General theorem + triples + √2', hi: 'सामान्य प्रमेय + त्रिक + √2', sa: 'सामान्य प्रमेय + त्रिक + √2', mai: 'सामान्य प्रमेय + त्रिक + √2', mr: 'सामान्य प्रमेय + त्रिक + √2', ta: 'பொதுத் தேற்றம் + மும்மைகள் + √2', te: 'సాధారణ సిద్ధాంతం + త్రయాలు + √2', bn: 'সাধারণ উপপাদ্য + ত্রয়ী + √2', kn: 'ಸಾಮಾನ್ಯ ಪ್ರಮೇಯ + ತ್ರಿಕಗಳು + √2', gu: 'સામાન્ય પ્રમેય + ત્રિપુટી + √2' } },
            { label: { en: 'Pythagoras born', hi: 'पाइथागोरस का जन्म', sa: 'पाइथागोरस का जन्म', mai: 'पाइथागोरस का जन्म', mr: 'पाइथागोरस का जन्म', ta: 'பைதாகரஸ் பிறந்தார்', te: 'పైథాగరస్ జన్మించారు', bn: 'পাইথাগোরাস জন্মগ্রহণ করেন', kn: 'ಪೈಥಾಗೊರಸ್ ಜನಿಸಿದರು', gu: 'પાયથાગોરસનો જન્મ' }, date: '~570 BCE', color: '#a78bfa', note: { en: '230 years after Baudhayana', hi: 'बौधायन के 230 वर्ष बाद', sa: 'बौधायन के 230 वर्ष बाद', mai: 'बौधायन के 230 वर्ष बाद', mr: 'बौधायन के 230 वर्ष बाद', ta: 'பௌதாயனருக்கு 230 ஆண்டுகள் பின்னர்', te: 'బౌధాయనుని తర్వాత 230 సంవత్సరాలు', bn: 'বৌধায়নের 230 বছর পরে', kn: 'ಬೌಧಾಯನನ ನಂತರ 230 ವರ್ಷಗಳು', gu: 'બૌધાયન પછી 230 વર્ષ' } },
            { label: { en: "Euclid's formal proof", hi: 'यूक्लिड का औपचारिक प्रमाण', sa: 'यूक्लिड का औपचारिक प्रमाण', mai: 'यूक्लिड का औपचारिक प्रमाण', mr: 'यूक्लिड का औपचारिक प्रमाण', ta: "Euclid's formal proof", te: "Euclid's formal proof", bn: "Euclid's formal proof", kn: "Euclid's formal proof", gu: "Euclid's formal proof" }, date: '~300 BCE', color: '#34d399', note: { en: 'Earliest surviving Greek proof', hi: 'सबसे पुराना जीवित ग्रीक प्रमाण', sa: 'सबसे पुराना जीवित ग्रीक प्रमाण', mai: 'सबसे पुराना जीवित ग्रीक प्रमाण', mr: 'सबसे पुराना जीवित ग्रीक प्रमाण', ta: 'எஞ்சியிருக்கும் மிகப் பழமையான கிரேக்க நிரூபணம்', te: 'మిగిలి ఉన్న అత్యంత పురాతన గ్రీక్ నిరూపణ', bn: 'বিদ্যমান প্রাচীনতম গ্রিক প্রমাণ', kn: 'ಉಳಿದಿರುವ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಗ್ರೀಕ್ ಸಾಕ್ಷ್ಯ', gu: 'અસ્તિત્વમાં રહેલો સૌથી પ્રાચીન ગ્રીક પુરાવો' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
              <p className="text-xs font-mono font-bold mb-1" style={{ color: item.color }}>{item.date}</p>
              <p className="text-text-primary text-sm font-semibold mb-1">{lt(item.label as LocaleText, locale)}</p>
              <p className="text-text-secondary text-xs">{lt(item.note as LocaleText, locale)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-text-secondary leading-relaxed">
          {isHi
            ? 'निष्पक्ष मूल्यांकन: भारतीयों ने इसे खोजा और व्यावहारिक रूप से उपयोग किया। ग्रीक परम्परा ने सम्भवतः पहला औपचारिक निगमनात्मक प्रमाण दिया — हालाँकि पाइथागोरस का कोई लिखित कार्य स्वयं नहीं बचा, इसलिए यह भी पूरी तरह अनिश्चित है।'
            : "Fair assessment: Indians discovered and systematically applied the theorem. The Greek tradition likely provided the first formal deductive proof — though no written work by Pythagoras himself survives, making even this attribution uncertain."}
        </div>
      </div>

      {/* ── Section 7: Timeline / Sources ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s7Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s7Body')}</p>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start"
              >
                <span className="text-xs font-mono w-16 flex-shrink-0 text-right mt-1" style={{ color: item.color }}>
                  {item.year}
                </span>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 border-2" style={{ borderColor: item.color, backgroundColor: `${item.color}33` }} />
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-semibold">{item.source}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{lt(item.content as LocaleText, locale)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cross-references ─────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { href: '/learn/contributions/sine', label: t('crossSine') },
          { href: '/learn/contributions/zero', label: t('crossZero') },
          { href: '/learn/contributions/pi', label: t('crossPi') },
          { href: '/learn/contributions/timeline', label: t('crossTimeline') },
        ].map((ref, i) => (
          <Link
            key={i}
            href={ref.href}
            className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-gold-light text-sm text-center hover:bg-gold-primary/15 transition-colors"
          >
            {ref.label} →
          </Link>
        ))}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/zero" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('crossZero')} →
          </Link>
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('crossSine')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
