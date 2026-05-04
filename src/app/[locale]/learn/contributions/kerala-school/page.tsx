import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-kerala-school.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export const revalidate = 604800; // 7 days — static educational content


/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const CONVERGENCE_TABLE = [
  { terms: 10, raw: '3.04184', corrected: '3.14159257...', actual: '3.14159265...' },
  { terms: 20, raw: '3.09162', corrected: '3.14159265348...', actual: '3.14159265...' },
  { terms: 50, raw: '3.12159', corrected: '3.14159265358979...', actual: '3.14159265...' },
  { terms: 100, raw: '3.13159', corrected: '3.14159265358979323...', actual: '3.14159265...' },
];

const SINE_TERMS = [
  { term: 'x', value: '0.52360', running: '0.52360' },
  { term: '\u2212x\u00B3/3!', value: '\u22120.02392', running: '0.49968' },
  { term: '+x\u2075/5!', value: '+0.00033', running: '0.50001' },
  { term: '\u2212x\u2077/7!', value: '\u22120.0000027', running: '0.50000' },
];

const SCHOOL_CHAIN = [
  {
    name: { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव', sa: 'संगमग्राम के माधव', mai: 'संगमग्राम के माधव', mr: 'संगमग्राम के माधव', ta: 'சங்கமக்கிராமத்தின் மாதவர்', te: 'సంగమగ్రామ మాధవుడు', bn: 'সঙ্গমগ্রামের মাধব', kn: 'ಸಂಗಮಗ್ರಾಮದ ಮಾಧವ', gu: 'સંગમગ્રામના માધવ' },
    years: '~1340\u20131425 CE',
    role: { en: 'Founder', hi: 'संस्थापक', sa: 'संस्थापक', mai: 'संस्थापक', mr: 'संस्थापक', ta: 'நிறுவனர்', te: 'స్థాపకుడు', bn: 'প্রতিষ্ঠাতা', kn: 'ಸ್ಥಾಪಕ', gu: 'સ્થાપક' },
    contrib: {
      en: 'Discovered infinite series for \u03C0, sin, cos, arctan. Invented series acceleration correction terms. Computed \u03C0 to 11 decimal places.',
      hi: '\u03C0, sin, cos, arctan के लिए अनन्त श्रेणी की खोज। श्रेणी-त्वरण सुधार पदों का आविष्कार। \u03C0 का 11 दशमलव तक मान।',
    },
  },
  {
    name: { en: 'Parameshvara', hi: 'परमेश्वर', sa: 'परमेश्वर', mai: 'परमेश्वर', mr: 'परमेश्वर', ta: 'பரமேஸ்வரர்', te: 'పరమేశ్వరుడు', bn: 'পরমেশ্বর', kn: 'ಪರಮೇಶ್ವರ', gu: 'પરમેશ્વર' },
    years: '~1360\u20131455 CE',
    role: { en: 'Observer', hi: 'प्रेक्षक', sa: 'प्रेक्षक', mai: 'प्रेक्षक', mr: 'प्रेक्षक', ta: 'பார்வையாளர்', te: 'పరిశీలకుడు', bn: 'পর্যবেক্ষক', kn: 'ವೀಕ್ಷಕ', gu: 'નિરીક્ષક' },
    contrib: {
      en: 'Conducted 55 years of systematic astronomical observations \u2014 the longest observational program in pre-telescopic history. Created the Drigganita system based on empirical corrections.',
      hi: '55 वर्षों तक व्यवस्थित खगोलीय प्रेक्षण \u2014 दूरबीन-पूर्व इतिहास में सबसे लम्बा प्रेक्षण कार्यक्रम। अनुभवजन्य सुधारों पर आधारित दृग्गणित प्रणाली।',
    },
  },
  {
    name: { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी', sa: 'नीलकण्ठ सोमयाजी', mai: 'नीलकण्ठ सोमयाजी', mr: 'नीलकण्ठ सोमयाजी', ta: 'நீலகண்ட சோமயாஜி', te: 'నీలకంఠ సోమయాజి', bn: 'নীলকণ্ঠ সোমযাজী', kn: 'ನೀಲಕಂಠ ಸೋಮಯಾಜಿ', gu: 'નીલકંઠ સોમયાજી' },
    years: '~1444\u20131544 CE',
    role: { en: 'Astronomer-Theorist', hi: 'खगोलशास्त्री-सिद्धान्तकार', sa: 'खगोलशास्त्री-सिद्धान्तकार', mai: 'खगोलशास्त्री-सिद्धान्तकार', mr: 'खगोलशास्त्री-सिद्धान्तकार', ta: 'வானியலாளர்-கோட்பாட்டாளர்', te: 'ఖగోళ శాస్త్రవేత్త-సిద్ధాంతకర్త', bn: 'জ্যোতির্বিদ-তত্ত্ববিদ', kn: 'ಖಗೋಳ ಶಾಸ್ತ್ರಜ್ಞ-ಸಿದ್ಧಾಂತಕಾರ', gu: 'ખગોળશાસ્ત્રી-સિદ્ધાંતકાર' },
    contrib: {
      en: 'Wrote Tantrasangraha (1500 CE). Developed partial heliocentric model (Mercury and Venus orbit Sun) \u2014 identical to Tycho Brahe\'s model, 88 years before Brahe.',
      hi: 'तन्त्रसंग्रह (1500 ई.) लिखा। आंशिक सौर-केन्द्रीय मॉडल (बुध और शुक्र सूर्य की परिक्रमा) \u2014 ब्राहे से 88 वर्ष पहले।',
    },
  },
  {
    name: { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव', sa: 'ज्येष्ठदेव', mai: 'ज्येष्ठदेव', mr: 'ज्येष्ठदेव', ta: 'ஜ்யேஷ்ட தேவர்', te: 'జ్యేష్ఠదేవుడు', bn: 'জ্যেষ্ঠদেব', kn: 'ಜ್ಯೇಷ್ಠದೇವ', gu: 'જ્યેષ્ઠદેવ' },
    years: '~1500\u20131575 CE',
    role: { en: 'Textbook Author', hi: 'पाठ्यग्रन्थ लेखक', sa: 'पाठ्यग्रन्थ लेखक', mai: 'पाठ्यग्रन्थ लेखक', mr: 'पाठ्यग्रन्थ लेखक', ta: 'பாடநூல் ஆசிரியர்', te: 'పాఠ్యపుస్తక రచయిత', bn: 'পাঠ্যপুস্তক লেখক', kn: 'ಪಠ್ಯಪುಸ್ತಕ ಲೇಖಕ', gu: 'પાઠ્યપુસ્તક લેખક' },
    contrib: {
      en: 'Wrote Yuktibhasha (~1530 CE) \u2014 the world\'s first calculus textbook. Contains full proofs of all Kerala results. Written in Malayalam (vernacular) for accessibility.',
      hi: 'युक्तिभाषा (~1530 ई.) लिखी \u2014 विश्व की पहली कलनशास्त्र पाठ्यपुस्तक। सभी केरल परिणामों के पूर्ण प्रमाण। सुगम्यता के लिए मलयालम (स्थानीय भाषा) में।',
    },
  },
  {
    name: { en: 'Achyuta Pisharati', hi: 'अच्युत पिशारटि', sa: 'अच्युत पिशारटि', mai: 'अच्युत पिशारटि', mr: 'अच्युत पिशारटि', ta: 'அச்சுத பிஷாரடி', te: 'అచ్యుత పిషారతి', bn: 'অচ্যুত পিষারতি', kn: 'ಅಚ್ಯುತ ಪಿಶಾರಟಿ', gu: 'અચ્યુત પિષારતી' },
    years: '~1550\u20131621 CE',
    role: { en: 'Last Major Figure', hi: 'अन्तिम प्रमुख व्यक्ति', sa: 'अन्तिम प्रमुख व्यक्ति', mai: 'अन्तिम प्रमुख व्यक्ति', mr: 'अन्तिम प्रमुख व्यक्ति', ta: 'கடைசி முக்கிய நபர்', te: 'చివరి ప్రధాన వ్యక్తి', bn: 'শেষ প্রধান ব্যক্তি', kn: 'ಕೊನೆಯ ಪ್ರಮುಖ ವ್ಯಕ್ತಿ', gu: 'છેલ્લી મુખ્ય વ્યક્તિ' },
    contrib: {
      en: 'Applied tropical corrections to Kerala astronomical models. Extended the tradition for another generation before it gradually declined under colonial pressures.',
      hi: 'केरल खगोलीय मॉडलों में उष्णकटिबन्धीय सुधार लागू किए। औपनिवेशिक दबावों में क्रमिक पतन से पहले एक और पीढ़ी तक परम्परा बढ़ाई।',
    },
  },
];

const ATTRIBUTION_TABLE = [
  { western: 'Leibniz series for \u03C0', euroWho: 'Leibniz', euroWhen: '1674', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~324 years' },
  { western: 'Gregory series for arctan', euroWho: 'Gregory', euroWhen: '1671', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~321 years' },
  { western: 'Taylor/Maclaurin series', euroWho: 'Taylor', euroWhen: '1715', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~365 years' },
  { western: "Newton's sine series", euroWho: 'Newton', euroWhen: '~1666', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~316 years' },
  { western: "Euler's series acceleration", euroWho: 'Euler', euroWhen: '~1740', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~390 years' },
  { western: 'Tychonic planetary model', euroWho: 'Brahe', euroWhen: '1588', keralaWho: 'Nilakantha', keralaWhen: '1500', gap: '88 years' },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const sectionCard = 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6';


export default async function KeralaSchoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: LocaleText | Record<string, string>) => lt(obj as LocaleText, locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t('title')} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: The Setting ────────────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s1Body')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: { en: 'Founder', hi: 'संस्थापक', sa: 'संस्थापक', mai: 'संस्थापक', mr: 'संस्थापक', ta: 'நிறுவனர்', te: 'స్థాపకుడు', bn: 'প্রতিষ্ঠাতা', kn: 'ಸ್ಥಾಪಕ', gu: 'સ્થાપક' }, value: 'Madhava (~1340)' },
            { label: { en: 'Location', hi: 'स्थान', sa: 'स्थान', mai: 'स्थान', mr: 'स्थान', ta: 'இடம்', te: 'స్థానం', bn: 'স্থান', kn: 'ಸ್ಥಳ', gu: 'સ્થાન' }, value: 'Irinjalakuda, Kerala' },
            { label: { en: 'Duration', hi: 'अवधि', sa: 'अवधि', mai: 'अवधि', mr: 'अवधि', ta: 'காலம்', te: 'కాలం', bn: 'সময়কাল', kn: 'ಅವಧಿ', gu: 'સમયગાળો' }, value: '~200 years' },
            { label: { en: 'Key text', hi: 'प्रमुख ग्रन्थ', sa: 'प्रमुख ग्रन्थ', mai: 'प्रमुख ग्रन्थ', mr: 'प्रमुख ग्रन्थ', ta: 'முக்கிய நூல்', te: 'ముఖ్య గ్రంథం', bn: 'মূল গ্রন্থ', kn: 'ಪ್ರಮುಖ ಗ್ರಂಥ', gu: 'મુખ્ય ગ્રંથ' }, value: 'Yuktibhasha' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-text-secondary text-xs font-semibold mb-1">{t('whyKerala')}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{t('s1Why')}</p>
        </div>
      </div>

      {/* ── Section 2: Madhava's Pi Series ───────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s2Body')}</p>

        {/* Main formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{t('madhavaLeibnizSeries')}</p>
          <p className="text-gold-light text-xl font-mono tracking-wider">&pi;/4 = 1 &minus; 1/3 + 1/5 &minus; 1/7 + 1/9 &minus; ...</p>
          <p className="text-text-secondary text-xs mt-2">{t('madhavaLeibnizDate')}</p>
        </div>

        {/* Slow convergence explanation */}
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s2Slow')}</p>

        {/* Correction term */}
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{t('s2Genius')}</p>
        <div className="p-5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 mb-5 text-center">
          <p className="text-xs text-emerald-300 mb-2">{t('correctionTerm')}</p>
          <p className="text-emerald-200 text-lg font-mono">(-1)<sup>N+1</sup> &times; (N/2) / ((N/2)&sup2; + 1)</p>
          <p className="text-text-secondary text-xs mt-2">{t('addCorrection')}</p>
        </div>

        {/* Convergence table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{t('terms')}</th>
                <th className="text-left text-gold-light py-2 pr-3">{t('rawSeries')}</th>
                <th className="text-left text-gold-light py-2 pr-3">{t('withCorrection')}</th>
                <th className="text-right text-gold-light py-2">{t('actualPi')}</th>
              </tr>
            </thead>
            <tbody>
              {CONVERGENCE_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-3 text-text-primary font-semibold">{row.terms}</td>
                  <td className="py-2 pr-3 text-red-400 font-mono">{row.raw}</td>
                  <td className="py-2 pr-3 text-emerald-400 font-mono">{row.corrected}</td>
                  <td className="text-right py-2 text-text-secondary font-mono">{row.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">{t('s2Result')}</p>
      </div>

      {/* ── Section 3: Sine and Cosine Series ────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s3Body')}</p>

        {/* Sine formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{t('sineSeries')}</p>
          <p className="text-gold-light text-lg font-mono">sin(x) = x &minus; x&sup3;/3! + x&#8309;/5! &minus; x&#8311;/7! + ...</p>
          <p className="text-text-secondary text-xs mt-2">{t('factorialNote')}</p>
        </div>

        {/* Worked example */}
        <div className="p-5 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-5">
          <p className="text-amber-300 font-semibold text-xs mb-3">
            {t('workedExample')}
          </p>
          <p className="text-text-secondary text-xs mb-3">{t('s3Worked')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-500/15">
                  <th className="text-left text-amber-300 py-1.5 pr-3">{t('term')}</th>
                  <th className="text-left text-amber-300 py-1.5 pr-3">{t('value')}</th>
                  <th className="text-right text-amber-300 py-1.5">{t('runningSum')}</th>
                </tr>
              </thead>
              <tbody>
                {SINE_TERMS.map((row, i) => (
                  <tr key={i} className="border-b border-amber-500/8">
                    <td className="py-1.5 pr-3 text-text-primary font-mono">{row.term}</td>
                    <td className="py-1.5 pr-3 text-text-secondary font-mono">{row.value}</td>
                    <td className="text-right py-1.5 text-amber-200 font-mono font-semibold">{row.running}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-emerald-300 text-xs mt-3 font-semibold">
            {t('sineResult')}
          </p>
        </div>

        {/* Cosine series */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4 text-center">
          <p className="text-xs text-text-secondary mb-2">{t('cosineSeries')}</p>
          <p className="text-gold-light text-lg font-mono">cos(x) = 1 &minus; x&sup2;/2! + x&#8308;/4! &minus; x&#8310;/6! + ...</p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{t('s3Cosine')}</p>
      </div>

      {/* ── Section 4: Arctangent Series ─────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s4Body')}</p>

        {/* Arctan formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{t('arctanSeries')}</p>
          <p className="text-gold-light text-lg font-mono mb-2">arctan(x) = x &minus; x&sup3;/3 + x&#8309;/5 &minus; x&#8311;/7 + ...</p>
          <p className="text-text-secondary text-xs">{t('arctanValid')}</p>
        </div>

        {/* Faster convergence with 1/sqrt(3) */}
        <div className="p-5 rounded-xl bg-purple-500/8 border border-purple-500/20 mb-5 text-center">
          <p className="text-xs text-purple-300 mb-2">{t('arctanSetting')}</p>
          <p className="text-purple-200 text-base font-mono">{t('s4Formula')}</p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">{t('s4Insight')}</p>
      </div>

      {/* ── Section 5: What IS Calculus ───────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s5Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {[
            { num: '1', name: { en: 'Derivatives', hi: 'अवकलज', sa: 'अवकलज', mai: 'अवकलज', mr: 'अवकलज', ta: 'வகையீடுகள்', te: 'అవకలజాలు', bn: 'অন্তরজ', kn: 'ವ್ಯುತ್ಪನ್ನ', gu: 'અવકલજ' }, desc: { en: 'Rates of change. How fast is something moving at this instant?', hi: 'परिवर्तन की दर। इस क्षण कुछ कितनी तेज़ी से बदल रहा है?', sa: 'परिवर्तन की दर। इस क्षण कुछ कितनी तेज़ी से बदल रहा है?', mai: 'परिवर्तन की दर। इस क्षण कुछ कितनी तेज़ी से बदल रहा है?', mr: 'परिवर्तन की दर। इस क्षण कुछ कितनी तेज़ी से बदल रहा है?', ta: 'மாற்ற விகிதம். இந்த கணத்தில் ஏதாவது எவ்வளவு வேகமாக நகர்கிறது?', te: 'మార్పు రేటు. ఈ క్షణంలో ఏదైనా ఎంత వేగంగా కదులుతోంది?', bn: 'পরিবর্তনের হার। এই মুহূর্তে কিছু কত দ্রুত নড়ছে?', kn: 'ಬದಲಾವಣೆಯ ದರ. ಈ ಕ್ಷಣದಲ್ಲಿ ಏನಾದರೂ ಎಷ್ಟು ವೇಗವಾಗಿ ಚಲಿಸುತ್ತಿದೆ?', gu: 'પરિવર્તનનો દર. આ ક્ષણે કંઈક કેટલી ઝડપથી ગતિ કરી રહ્યું છે?' }, status: { en: 'Partial work', hi: 'आंशिक कार्य', sa: 'आंशिक कार्य', mai: 'आंशिक कार्य', mr: 'आंशिक कार्य', ta: 'ஓரளவு கார்யம்', te: 'పాక్షిక కార్యం', bn: 'আংশিক কাজ', kn: 'ಭಾಗಶಃ ಕಾರ್ಯ', gu: 'આંશિક કાર્ય' } },
            { num: '2', name: { en: 'Integrals', hi: 'समाकलन', sa: 'समाकलन', mai: 'समाकलन', mr: 'समाकलन', ta: 'தொகையீடுகள்', te: 'సమాకలనాలు', bn: 'সমাকলন', kn: 'ಸಮಾಕಲನ', gu: 'સમાકલન' }, desc: { en: 'Accumulation. What is the total area under this curve?', hi: 'संचय। इस वक्र के नीचे कुल क्षेत्रफल क्या है?', sa: 'संचय। इस वक्र के नीचे कुल क्षेत्रफल क्या है?', mai: 'संचय। इस वक्र के नीचे कुल क्षेत्रफल क्या है?', mr: 'संचय। इस वक्र के नीचे कुल क्षेत्रफल क्या है?', ta: 'திரட்டல். இந்த வளைவின் கீழ் மொத்த பரப்பளவு என்ன?', te: 'సంచయం. ఈ వక్రం కింద మొత్తం వైశాల్యం ఎంత?', bn: 'সঞ্চয়। এই বক্ররেখার নীচে মোট ক্ষেত্রফল কত?', kn: 'ಸಂಚಯ. ಈ ವಕ್ರದ ಕೆಳಗಿನ ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ ಎಷ್ಟು?', gu: 'સંચય. આ વક્ર હેઠળનો કુલ વિસ્તાર કેટલો છે?' }, status: { en: 'Partial work', hi: 'आंशिक कार्य', sa: 'आंशिक कार्य', mai: 'आंशिक कार्य', mr: 'आंशिक कार्य', ta: 'ஓரளவு கார்யம்', te: 'పాక్షిక కార్యం', bn: 'আংশিক কাজ', kn: 'ಭಾಗಶಃ ಕಾರ್ಯ', gu: 'આંશિક કાર્ય' } },
            { num: '3', name: { en: 'Infinite Series', hi: 'अनन्त श्रेणी', sa: 'अनन्त श्रेणी', mai: 'अनन्त श्रेणी', mr: 'अनन्त श्रेणी', ta: 'அனந்த தொடர்', te: 'అనంత శ్రేణి', bn: 'অসীম ধারা', kn: 'ಅನಂತ ಶ್ರೇಣಿ', gu: 'અનંત શ્રેણી' }, desc: { en: 'Expressing functions as infinite sums of simpler terms.', hi: 'फलनों को सरल पदों के अनन्त योग के रूप में व्यक्त करना।', sa: 'फलनों को सरल पदों के अनन्त योग के रूप में व्यक्त करना।', mai: 'फलनों को सरल पदों के अनन्त योग के रूप में व्यक्त करना।', mr: 'फलनों को सरल पदों के अनन्त योग के रूप में व्यक्त करना।', ta: 'சார்புகளை எளிய பதங்களின் அனந்த கூட்டுத்தொகையாக வெளிப்படுத்துதல்.', te: 'ప్రమేయాలను సరళ పదాల అనంత మొత్తాలుగా వ్యక్తం చేయడం.', bn: 'ফাংশনগুলিকে সরলতর পদগুলির অসীম সমষ্টি হিসেবে প্রকাশ করা।', kn: 'ಕಾರ್ಯಗಳನ್ನು ಸರಳ ಪದಗಳ ಅನಂತ ಮೊತ್ತಗಳಾಗಿ ವ್ಯಕ್ತಪಡಿಸುವುದು.', gu: 'ફંક્શનોને સરળ પદોના અનંત સરવાળા તરીકે વ્યક્ત કરવા.' }, status: { en: 'Fully mastered', hi: 'पूर्ण अधिकार', sa: 'पूर्ण अधिकार', mai: 'पूर्ण अधिकार', mr: 'पूर्ण अधिकार', ta: 'முழுமையாகக் கைவரப்பெற்றது', te: 'పూర్తిగా ప్రావీణ్యం', bn: 'সম্পূর্ণ দক্ষতা', kn: 'ಸಂಪೂರ್ಣ ಪ್ರಾವೀಣ್ಯ', gu: 'સંપૂર્ણ નિપુણતા' } },
          ].map((pillar, i) => (
            <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/[0.02] border-gold-primary/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gold-primary/15 text-gold-light'}`}>{pillar.num}</span>
                <span className={`font-semibold text-sm ${i === 2 ? 'text-emerald-300' : 'text-text-primary'}`}>{l(pillar.name)}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-2">{l(pillar.desc)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${i === 2 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-primary/10 text-gold-dark'}`}>{l(pillar.status)}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-gold-light text-xs font-semibold mb-1">{t('criticalArgument')}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{t('s5Key')}</p>
        </div>
      </div>

      {/* ── Section 6: Nilakantha ────────────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s6Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-xs mb-2">{t('nilakanthaModel')}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('nilakanthaDesc')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{t('braheModel')}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('braheDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 7: Yuktibhasha ───────────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s7Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s7Body')}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s7Method')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Language', hi: 'भाषा', sa: 'भाषा', mai: 'भाषा', mr: 'भाषा', ta: 'மொழி', te: 'భాష', bn: 'ভাষা', kn: 'ಭಾಷೆ', gu: 'ભાષા' }, value: { en: 'Malayalam', hi: 'मलयालम', sa: 'मलयालम', mai: 'मलयालम', mr: 'मलयालम', ta: 'மலையாளம்', te: 'మలయాళం', bn: 'মালায়ালাম', kn: 'ಮಲಯಾಳಂ', gu: 'મલયાલમ' } },
            { label: { en: 'Written', hi: 'रचना', sa: 'रचना', mai: 'रचना', mr: 'रचना', ta: 'எழுதப்பட்டது', te: 'రాయబడింది', bn: 'লেখা হয়েছে', kn: 'ಬರೆಯಲಾಗಿದೆ', gu: 'લખાયેલ' }, value: { en: '~1530 CE', hi: '~1530 ई.', sa: '~1530 ई.', mai: '~1530 ई.', mr: '~1530 ई.', ta: '~1530 கி.பி.', te: '~1530 క్రీ.శ.', bn: '~১৫৩০ খ্রি.', kn: '~1530 ಕ್ರಿ.ಶ.', gu: '~1530 ઈ.સ.' } },
            { label: { en: 'Contains', hi: 'विषयवस्तु', sa: 'विषयवस्तु', mai: 'विषयवस्तु', mr: 'विषयवस्तु', ta: 'கொண்டுள்ளது', te: 'కలిగి ఉంది', bn: 'ধারণ করে', kn: 'ಒಳಗೊಂಡಿದೆ', gu: 'સમાવે છે' }, value: { en: 'Full proofs', hi: 'पूर्ण प्रमाण', sa: 'पूर्ण प्रमाण', mai: 'पूर्ण प्रमाण', mr: 'पूर्ण प्रमाण', ta: 'முழு நிரூபணங்கள்', te: 'పూర్తి నిరూపణలు', bn: 'সম্পূর্ণ প্রমাণ', kn: 'ಪೂರ್ಣ ಸಾಕ್ಷ್ಯಗಳು', gu: 'સંપૂર્ણ પુરાવાઓ' } },
            { label: { en: 'Significance', hi: 'महत्त्व', sa: 'महत्त्व', mai: 'महत्त्व', mr: 'महत्त्व', ta: 'முக்கியத்துவம்', te: 'ప్రాముఖ్యత', bn: 'তাৎপর্য', kn: 'ಮಹತ್ವ', gu: 'મહત્ત્વ' }, value: { en: '1st calculus text', hi: 'प्रथम कलन ग्रन्थ', sa: 'प्रथम कलन ग्रन्थ', mai: 'प्रथम कलन ग्रन्थ', mr: 'प्रथम कलन ग्रन्थ', ta: 'முதல் கணிதவியல் நூல்', te: 'మొదటి కలనగణిత గ్రంథం', bn: 'প্রথম ক্যালকুলাস গ্রন্থ', kn: 'ಮೊದಲ ಕ್ಯಾಲ್ಕುಲಸ್ ಗ್ರಂಥ', gu: 'પ્રથમ કેલ્ક્યુલસ ગ્રંથ' } },
          ].map((fact, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{typeof fact.value === 'string' ? fact.value : l(fact.value)}</div>
              <div className="text-text-secondary text-xs mt-1">{l(fact.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 8: Transmission Question ─────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s8Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s8Body')}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s8Evidence')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{t('transmission1')}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('transmission1Desc')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <p className="text-blue-300 font-semibold text-xs mb-2">{t('transmission2')}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('transmission2Desc')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-xs mb-2">{t('transmission3')}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('transmission3Desc')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <p className="text-emerald-300 font-semibold text-xs mb-2">{t('beyondDebate')}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{t('s8Conclusion')}</p>
        </div>
      </div>

      {/* ── Section 9: App Connection ────────────────────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s9Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s9Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: { en: 'Planetary Positions', hi: 'ग्रहीय स्थिति', sa: 'ग्रहीय स्थिति', mai: 'ग्रहीय स्थिति', mr: 'ग्रहीय स्थिति', ta: 'கிரக நிலைகள்', te: 'గ్రహ స్థానాలు', bn: 'গ্রহ অবস্থান', kn: 'ಗ್ರಹ ಸ್ಥಾನಗಳು', gu: 'ગ્રહ સ્થિતિઓ' }, desc: { en: 'Series approximations compute Sun/Moon longitude for every Panchang request', hi: 'प्रत्येक पंचांग अनुरोध के लिए श्रेणी-सन्निकटन सूर्य/चन्द्र देशान्तर गणना', sa: 'प्रत्येक पंचांग अनुरोध के लिए श्रेणी-सन्निकटन सूर्य/चन्द्र देशान्तर गणना', mai: 'प्रत्येक पंचांग अनुरोध के लिए श्रेणी-सन्निकटन सूर्य/चन्द्र देशान्तर गणना', mr: 'प्रत्येक पंचांग अनुरोध के लिए श्रेणी-सन्निकटन सूर्य/चन्द्र देशान्तर गणना', ta: 'ஒவ்வொரு பஞ்சாங்க கோரிக்கைக்கும் தொடர் தோராயங்கள் சூரியன்/சந்திரன் தீர்க்கரேகையைக் கணக்கிடுகின்றன', te: 'ప్రతి పంచాంగ అభ్యర్థనకు శ్రేణి సన్నికర్షాలు సూర్య/చంద్ర రేఖాంశాన్ని లెక్కిస్తాయి', bn: 'প্রতিটি পঞ্চাঙ্গ অনুরোধের জন্য ধারা সান্নিধ্য সূর্য/চন্দ্র দ্রাঘিমাংশ গণনা করে', kn: 'ಪ್ರತಿ ಪಂಚಾಂಗ ವಿನಂತಿಗೆ ಶ್ರೇಣಿ ಸಮೀಪನಗಳು ಸೂರ್ಯ/ಚಂದ್ರ ರೇಖಾಂಶವನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತವೆ', gu: 'દરેક પંચાંગ વિનંતી માટે શ્રેણી સંનિકટનો સૂર્ય/ચંદ્ર રેખાંશ ગણે છે' } },
            { title: { en: 'Sunrise/Sunset', hi: 'सूर्योदय/अस्त', sa: 'सूर्योदय/अस्त', mai: 'सूर्योदय/अस्त', mr: 'सूर्योदय/अस्त', ta: 'சூரிய உதயம்/அஸ்தமனம்', te: 'సూర్యోదయం/సూర్యాస్తమయం', bn: 'সূর্যোদয়/সূর্যাস্ত', kn: 'ಸೂರ್ಯೋದಯ/ಸೂರ್ಯಾಸ್ತ', gu: 'સૂર્યોદય/સૂર્યાસ્ત' }, desc: { en: 'Trigonometric series (sin/cos) compute exact rise and set times', hi: 'त्रिकोणमितीय श्रेणी (sin/cos) सटीक उदय और अस्त समय', sa: 'त्रिकोणमितीय श्रेणी (sin/cos) सटीक उदय और अस्त समय', mai: 'त्रिकोणमितीय श्रेणी (sin/cos) सटीक उदय और अस्त समय', mr: 'त्रिकोणमितीय श्रेणी (sin/cos) सटीक उदय और अस्त समय', ta: 'முக்கோணவியல் தொடர்கள் (sin/cos) துல்லியமான உதயம் மற்றும் அஸ்தமன நேரங்களைக் கணக்கிடுகின்றன', te: 'త్రికోణమితి శ్రేణులు (sin/cos) ఖచ్చితమైన ఉదయ మరియు అస్తమయ సమయాలను లెక్కిస్తాయి', bn: 'ত্রিকোণমিতি ধারা (sin/cos) সঠিক উদয় ও অস্ত সময় গণনা করে', kn: 'ತ್ರಿಕೋಣಮಿತಿ ಶ್ರೇಣಿಗಳು (sin/cos) ನಿಖರ ಉದಯ ಮತ್ತು ಅಸ್ತಮಯ ಸಮಯಗಳನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತವೆ', gu: 'ત્રિકોણમિતીય શ્રેણીઓ (sin/cos) ચોક્કસ ઉદય અને અસ્ત સમય ગણે છે' } },
            { title: { en: 'Eclipse Timing', hi: 'ग्रहण समय', sa: 'ग्रहण समय', mai: 'ग्रहण समय', mr: 'ग्रहण समय', ta: 'கிரகண நேரம்', te: 'గ్రహణ సమయం', bn: 'গ্রহণের সময়', kn: 'ಗ್ರಹಣ ಸಮಯ', gu: 'ગ્રહણ સમય' }, desc: { en: 'High-precision series compute shadow angles and contact times', hi: 'उच्च-सटीक श्रेणी छाया कोण और सम्पर्क समय', sa: 'उच्च-सटीक श्रेणी छाया कोण और सम्पर्क समय', mai: 'उच्च-सटीक श्रेणी छाया कोण और सम्पर्क समय', mr: 'उच्च-सटीक श्रेणी छाया कोण और सम्पर्क समय', ta: 'உயர்-துல்லிய தொடர்கள் நிழல் கோணங்களையும் தொடர்பு நேரங்களையும் கணக்கிடுகின்றன', te: 'అధిక-ఖచ్చితత్వ శ్రేణులు నీడ కోణాలు మరియు సంపర్క సమయాలను లెక్కిస్తాయి', bn: 'উচ্চ-নির্ভুলতা ধারা ছায়া কোণ এবং সংযোগ সময় গণনা করে', kn: 'ಉನ್ನತ-ನಿಖರತೆ ಶ್ರೇಣಿಗಳು ನೆರಳು ಕೋನ ಮತ್ತು ಸಂಪರ್ಕ ಸಮಯಗಳನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತವೆ', gu: 'ઉચ્ચ-ચોકસાઈ શ્રેણીઓ પડછાયા ખૂણા અને સંપર્ક સમય ગણે છે' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <p className="text-gold-light font-semibold text-sm mb-1">{l(item.title)}</p>
              <p className="text-text-secondary text-xs leading-relaxed">{l(item.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 10: The Mathematicians Timeline ──────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{t('s10Title')}</h3>

        <div className="space-y-4">
          {SCHOOL_CHAIN.map((person, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-gold-primary/8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                  {i + 1}
                </div>
                {i < SCHOOL_CHAIN.length - 1 && (
                  <div className="w-px h-4 bg-gold-primary/20 mx-auto mt-1" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-text-primary font-semibold text-sm">{l(person.name)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark">{person.years}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{l(person.role)}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{l(person.contrib)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 11: Attribution Comparison Table ─────────────── */}
      <div className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s11Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s11Body')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{t('westernName')}</th>
                <th className="text-left text-gold-light py-2 pr-3">{t('attributedTo')}</th>
                <th className="text-left text-gold-light py-2 pr-3">{t('keralaDiscoverer')}</th>
                <th className="text-right text-gold-light py-2">{t('yearsEarlier')}</th>
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTION_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2.5 pr-3 text-text-primary font-semibold">{row.western}</td>
                  <td className="py-2.5 pr-3">
                    <span className="text-text-secondary">{row.euroWho}</span>
                    <span className="text-text-secondary/60 ml-1">({row.euroWhen})</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-emerald-400 font-semibold">{row.keralaWho}</span>
                    <span className="text-emerald-400/60 ml-1">({row.keralaWhen})</span>
                  </td>
                  <td className="text-right py-2.5 text-amber-400 font-bold">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            &larr; {t('prevPage')}
          </Link>
          <Link href="/learn/contributions/pythagoras" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('nextPage')} &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}
