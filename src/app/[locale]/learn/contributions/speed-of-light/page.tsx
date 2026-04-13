import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-speed-of-light.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */

const CALC_STEPS = [
  {
    step: 1,
    label: { en: 'Distance given by Sayana', hi: 'सायण द्वारा दी गई दूरी', sa: 'सायण द्वारा दी गई दूरी', mai: 'सायण द्वारा दी गई दूरी', mr: 'सायण द्वारा दी गई दूरी', ta: 'Distance given by Sayana', te: 'Distance given by Sayana', bn: 'Distance given by Sayana', kn: 'Distance given by Sayana', gu: 'Distance given by Sayana' },
    value: '2,202 yojanas',
    note: { en: 'per half-nimesha', hi: 'प्रति अर्ध-निमेष', sa: 'प्रति अर्ध-निमेष', mai: 'प्रति अर्ध-निमेष', mr: 'प्रति अर्ध-निमेष', ta: 'per half-nimesha', te: 'per half-nimesha', bn: 'per half-nimesha', kn: 'per half-nimesha', gu: 'per half-nimesha' },
    color: '#f0d48a',
  },
  {
    step: 2,
    label: { en: '1 yojana (Arthashastra)', hi: '1 योजन (अर्थशास्त्र)', sa: '1 योजन (अर्थशास्त्र)', mai: '1 योजन (अर्थशास्त्र)', mr: '1 योजन (अर्थशास्त्र)', ta: '1 யோஜனை (அர்த்தசாஸ்திரம்)', te: '1 యోజనం (అర్థశాస్త్రం)', bn: '1 যোজন (অর্থশাস্ত্র)', kn: '1 ಯೋಜನ (ಅರ್ಥಶಾಸ್ತ್ರ)', gu: '1 યોજન (અર્થશાસ્ત્ર)' },
    value: '≈ 9.09 miles',
    note: { en: 'Kautilya\'s Arthashastra, ~300 BCE', hi: 'कौटिल्य का अर्थशास्त्र, ~300 BCE' },
    color: '#60a5fa',
  },
  {
    step: 3,
    label: { en: '1 nimesha (Surya Siddhanta)', hi: '1 निमेष (सूर्य सिद्धांत)', sa: '1 निमेष (सूर्य सिद्धांत)', mai: '1 निमेष (सूर्य सिद्धांत)', mr: '1 निमेष (सूर्य सिद्धांत)', ta: '1 நிமேஷம் (சூர்ய சித்தாந்தம்)', te: '1 నిమేషం (సూర్య సిద్ధాంతం)', bn: '1 নিমেষ (সূর্য সিদ্ধান্ত)', kn: '1 ನಿಮೇಷ (ಸೂರ್ಯ ಸಿದ್ಧಾಂತ)', gu: '1 નિમેષ (સૂર્ય સિદ્ધાંત)' },
    value: '16/75 seconds',
    note: { en: '= 0.2133 seconds; half = 0.1067 seconds', hi: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', sa: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', mai: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', mr: '= 0.2133 सेकंड; आधा = 0.1067 सेकंड', ta: '= 0.2133 வினாடிகள்; பாதி = 0.1067 வினாடிகள்', te: '= 0.2133 సెకన్లు; సగం = 0.1067 సెకన్లు', bn: '= 0.2133 সেকেন্ড; অর্ধেক = 0.1067 সেকেন্ড', kn: '= 0.2133 ಸೆಕೆಂಡುಗಳು; ಅರ್ಧ = 0.1067 ಸೆಕೆಂಡುಗಳು', gu: '= 0.2133 સેકન્ડ; અર્ધ = 0.1067 સેકન્ડ' },
    color: '#a78bfa',
  },
  {
    step: 4,
    label: { en: 'Distance in miles', hi: 'मील में दूरी', sa: 'मील में दूरी', mai: 'मील में दूरी', mr: 'मील में दूरी', ta: 'Distance in miles', te: 'Distance in miles', bn: 'Distance in miles', kn: 'Distance in miles', gu: 'Distance in miles' },
    value: '2,202 × 9.09 = 20,016 miles',
    note: { en: 'per half-nimesha', hi: 'प्रति अर्ध-निमेष', sa: 'प्रति अर्ध-निमेष', mai: 'प्रति अर्ध-निमेष', mr: 'प्रति अर्ध-निमेष', ta: 'per half-nimesha', te: 'per half-nimesha', bn: 'per half-nimesha', kn: 'per half-nimesha', gu: 'per half-nimesha' },
    color: '#34d399',
  },
  {
    step: 5,
    label: { en: 'Speed = Distance / Time', hi: 'गति = दूरी / समय', sa: 'गति = दूरी / समय', mai: 'गति = दूरी / समय', mr: 'गति = दूरी / समय', ta: 'Speed = Distance / Time', te: 'Speed = Distance / Time', bn: 'Speed = Distance / Time', kn: 'Speed = Distance / Time', gu: 'Speed = Distance / Time' },
    value: '20,016 / 0.1067 = 187,638 mi/s',
    note: { en: 'Using Arthashastra yojana', hi: 'अर्थशास्त्र योजन का उपयोग करके', sa: 'अर्थशास्त्र योजन का उपयोग करके', mai: 'अर्थशास्त्र योजन का उपयोग करके', mr: 'अर्थशास्त्र योजन का उपयोग करके', ta: 'Using Arthashastra yojana', te: 'Using Arthashastra yojana', bn: 'Using Arthashastra yojana', kn: 'Using Arthashastra yojana', gu: 'Using Arthashastra yojana' },
    color: '#f87171',
  },
  {
    step: 6,
    label: { en: 'With 9.09 miles/yojana adjusted', hi: '9.09 मील/योजन समायोजित', sa: '9.09 मील/योजन समायोजित', mai: '9.09 मील/योजन समायोजित', mr: '9.09 मील/योजन समायोजित', ta: 'With 9.09 miles/yojana adjusted', te: 'With 9.09 miles/yojana adjusted', bn: 'With 9.09 miles/yojana adjusted', kn: 'With 9.09 miles/yojana adjusted', gu: 'With 9.09 miles/yojana adjusted' },
    value: '≈ 186,536 miles/second',
    note: { en: 'Vs modern 186,282 miles/sec (0.14% off!)', hi: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', sa: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', mai: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', mr: 'बनाम आधुनिक 186,282 मील/सेकंड (0.14% का अंतर!)', ta: 'Vs modern 186,282 miles/sec (0.14% off!)', te: 'Vs modern 186,282 miles/sec (0.14% off!)', bn: 'Vs modern 186,282 miles/sec (0.14% off!)', kn: 'Vs modern 186,282 miles/sec (0.14% off!)', gu: 'Vs modern 186,282 miles/sec (0.14% off!)' },
    color: '#f0d48a',
  },
];

const TIMELINE = [
  { year: 'c. 1375 CE', person: 'Sayana', note: { en: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', hi: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', sa: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', mai: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', mr: 'ऋव 1.50.4 पर टीका — आधे निमेष में 2,202 योजन', ta: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', te: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', bn: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', kn: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha', gu: 'Commentary on RV 1.50.4 — 2,202 yojanas in half nimesha' }, color: '#f0d48a' },
  { year: '1676 CE', person: 'Ole Rømer', note: { en: 'First measurement via Jupiter\'s moon Io timing', hi: 'बृहस्पति के चंद्रमा Io के समय द्वारा पहला माप' }, color: '#60a5fa' },
  { year: '1728 CE', person: 'James Bradley', note: { en: 'Measured via stellar aberration — 301,000 km/s', hi: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', sa: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', mai: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', mr: 'तारकीय विपथन द्वारा मापा — 301,000 किमी/सेकंड', ta: 'Measured via stellar aberration — 301,000 km/s', te: 'Measured via stellar aberration — 301,000 km/s', bn: 'Measured via stellar aberration — 301,000 km/s', kn: 'Measured via stellar aberration — 301,000 km/s', gu: 'Measured via stellar aberration — 301,000 km/s' }, color: '#a78bfa' },
  { year: '1849 CE', person: 'Hippolyte Fizeau', note: { en: 'First terrestrial measurement — 313,300 km/s', hi: 'पहला भूमि माप — 313,300 किमी/सेकंड', sa: 'पहला भूमि माप — 313,300 किमी/सेकंड', mai: 'पहला भूमि माप — 313,300 किमी/सेकंड', mr: 'पहला भूमि माप — 313,300 किमी/सेकंड', ta: 'First terrestrial measurement — 313,300 km/s', te: 'First terrestrial measurement — 313,300 km/s', bn: 'First terrestrial measurement — 313,300 km/s', kn: 'First terrestrial measurement — 313,300 km/s', gu: 'First terrestrial measurement — 313,300 km/s' }, color: '#f87171' },
  { year: '1983 CE', person: 'BIPM (SI)', note: { en: 'Speed of light defined exactly: 299,792,458 m/s', hi: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', sa: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', mai: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', mr: 'प्रकाश की गति ठीक परिभाषित: 299,792,458 मी/सेकंड', ta: 'Speed of light defined exactly: 299,792,458 m/s', te: 'Speed of light defined exactly: 299,792,458 m/s', bn: 'Speed of light defined exactly: 299,792,458 m/s', kn: 'Speed of light defined exactly: 299,792,458 m/s', gu: 'Speed of light defined exactly: 299,792,458 m/s' }, color: '#34d399' },
];

export default async function SpeedOfLightPage({ params }: { params: Promise<{ locale: string }> }) {
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

      {/* ── Section 1: The Verse ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s1Body')}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">
            {isHi ? 'सायण, ऋग्वेद-संहिता-भाष्य, 1.50.4 पर (~1375 CE)' : 'Sayana, Rigveda-Samhita-Bhasya, on 1.50.4 (~1375 CE)'}
          </p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {t('s1Sanskrit')}
          </p>
          <p className="text-text-secondary text-sm italic leading-relaxed">
            {t('s1Translation')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'दूरी' : 'Distance'}</div>
            <div className="text-gold-light font-bold text-lg font-mono">2,202</div>
            <div className="text-text-secondary text-xs">{isHi ? 'योजन' : 'yojanas'}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'समय' : 'Time'}</div>
            <div className="text-gold-light font-bold text-lg font-mono">½</div>
            <div className="text-text-secondary text-xs">{isHi ? 'निमेष' : 'nimesha'}</div>
          </div>
        </div>
      </div>

      {/* ── Section 2: The Calculation ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s2Body')}</p>

        <div className="space-y-3">
          {CALC_STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0a0e27]"
                style={{ background: step.color }}
              >
                {step.step}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-secondary text-xs">{l(step.label)}</span>
                  <span className="text-text-secondary text-xs">→</span>
                  <span className="text-text-primary font-mono font-semibold text-sm">{step.value}</span>
                </div>
                <div className="text-text-secondary text-xs mt-0.5 italic">{l(step.note)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Comparison ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s3Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'सायण (~1375 CE)' : 'Sayana (~1375 CE)'}</div>
            <div className="text-gold-light text-xl font-bold font-mono">186,536</div>
            <div className="text-text-secondary text-xs">{isHi ? 'मील/सेकंड' : 'miles/second'}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'आधुनिक मान' : 'Modern Value'}</div>
            <div className="text-text-primary text-xl font-bold font-mono">186,282</div>
            <div className="text-text-secondary text-xs">{isHi ? 'मील/सेकंड (निर्वात में)' : 'miles/second (in vacuum)'}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-center">
            <div className="text-text-secondary text-xs mb-1">{isHi ? 'त्रुटि' : 'Difference'}</div>
            <div className="text-emerald-400 text-xl font-bold">0.14%</div>
            <div className="text-text-secondary text-xs">{isHi ? '253 मील/सेकंड का अंतर' : '253 miles/sec difference'}</div>
          </div>
        </div>
      </div>

      {/* ── Section 4: The Debate ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-xs mb-2 uppercase tracking-wide">{isHi ? 'पक्ष में' : 'In Favor'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{t('s4For')}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2 uppercase tracking-wide">{isHi ? 'विरुद्ध' : 'Against'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{t('s4Against')}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
          <p className="text-blue-200 font-semibold text-xs mb-1">{isHi ? 'हमारा आकलन' : 'Our Assessment'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{t('s4Conclusion')}</p>
        </div>
      </div>

      {/* ── Section 5: Who Was Sayana ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s5Body')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Period', hi: 'काल', sa: 'काल', mai: 'काल', mr: 'काल', ta: 'Period', te: 'Period', bn: 'Period', kn: 'Period', gu: 'Period' }, value: 'c. 1315–1387 CE' },
            { label: { en: 'Role', hi: 'भूमिका', sa: 'भूमिका', mai: 'भूमिका', mr: 'भूमिका', ta: 'Role', te: 'Role', bn: 'Role', kn: 'Role', gu: 'Role' }, value: 'Mahamantri' },
            { label: { en: 'Empire', hi: 'साम्राज्य', sa: 'साम्राज्य', mai: 'साम्राज्य', mr: 'साम्राज्य', ta: 'Empire', te: 'Empire', bn: 'Empire', kn: 'Empire', gu: 'Empire' }, value: 'Vijayanagara' },
            { label: { en: 'Pages written', hi: 'लिखे पृष्ठ', sa: 'लिखे पृष्ठ', mai: 'लिखे पृष्ठ', mr: 'लिखे पृष्ठ', ta: 'Pages written', te: 'Pages written', bn: 'Pages written', kn: 'Pages written', gu: 'Pages written' }, value: '20,000+' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Other References ─────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{t('s6Body')}</p>
      </div>

      {/* ── Section 7: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{t('s7Title')}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-14 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed">{l(item.note)}</div>
                </div>
              </div>
            ))}
          </div>
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
            ← {t('prevPage')}
          </Link>
          <Link href="/learn/contributions/gravity" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('nextPage')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
