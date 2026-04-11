'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: '4.32 Billion Years — How Did the Ancients Know?',
    hi: '4.32 अरब वर्ष — प्राचीनों को यह कैसे पता था?',
  },
  subtitle: {
    en: 'Modern science tells us Earth is 4.54 billion years old. These numbers were discovered in the 20th century. So how do you explain that ancient Indian texts describe cosmic cycles of 4.32 billion years — written thousands of years ago?',
    hi: 'आधुनिक विज्ञान बताता है कि पृथ्वी 4.54 अरब वर्ष पुरानी है। ये संख्याएँ 20वीं सदी में खोजी गईं। तो आप यह कैसे समझाएंगे कि प्राचीन भारतीय ग्रंथ 4.32 अरब वर्षों के ब्रह्मांडीय चक्रों का वर्णन करते हैं — हजारों वर्ष पहले लिखे गए?',
  },

  s1Title: { en: 'The Hindu Time Scale — From Kali to Kalpa', hi: 'हिंदू काल-पैमाना — कलि से कल्प तक' },
  s1Body: {
    en: 'Hindu cosmology divides time into nested cycles of extraordinary scale. The smallest named unit relevant here is the Kali Yuga (432,000 years). From there, each step multiplies by factors of 2, 4, and 1000, culminating in the Kalpa — one "day of Brahma" — equal to 4.32 billion years. Brahma\'s full lifespan spans 311 trillion years. These numbers were not symbolic or metaphorical. Ancient Indian astronomers used them to compute planetary positions, eclipse cycles, and the cosmic calendar with mathematical precision.',
    hi: 'हिंदू ब्रह्मांड-विज्ञान समय को असाधारण पैमाने के नेस्टेड चक्रों में विभाजित करता है। यहाँ सबसे छोटी नामित इकाई कलि युग (432,000 वर्ष) है। वहाँ से, प्रत्येक कदम 2, 4 और 1000 के गुणनखंडों से गुणित होता है, कल्प में परिणत होता है — ब्रह्मा का एक "दिन" — 4.32 अरब वर्षों के बराबर। ब्रह्मा का पूर्ण जीवनकाल 311 खरब वर्षों में फैला है। ये संख्याएँ प्रतीकात्मक या रूपकात्मक नहीं थीं। प्राचीन भारतीय खगोलशास्त्रियों ने इनका उपयोग ग्रहीय स्थिति, ग्रहण चक्र और ब्रह्मांडीय कैलेंडर की गणितीय सटीकता के साथ गणना करने के लिए किया।',
  },

  s2Title: { en: 'The Math: How the Yugas Add Up', hi: 'गणित: युग कैसे जुड़ते हैं' },
  s2Body: {
    en: 'The four Yugas within one Mahayuga follow a descending ratio of 4:3:2:1 — a deliberate mathematical proportion reflecting decreasing cosmic virtue. Precisely 1,000 Mahayugas form one Kalpa. This nested structure allowed astronomers to perform modular arithmetic on cosmic time — finding where any date falls within the grand cycle, like a cosmic odometer.',
    hi: 'एक महायुग के भीतर चार युग 4:3:2:1 के अवरोही अनुपात का अनुसरण करते हैं — एक जानबूझकर गणितीय अनुपात जो घटते हुए ब्रह्मांडीय सद्गुण को दर्शाता है। ठीक 1,000 महायुग एक कल्प बनाते हैं। इस नेस्टेड संरचना ने खगोलशास्त्रियों को ब्रह्मांडीय समय पर मॉड्यूलर अंकगणित करने की अनुमति दी — एक ब्रह्मांडीय ओडोमीटर की तरह किसी भी तिथि को महान चक्र में खोजना।',
  },

  s3Title: { en: 'Compare With Modern Science: A 95% Match', hi: 'आधुनिक विज्ञान से तुलना: 95% मिलान' },
  s3Body: {
    en: 'The coincidence — if it is one — is striking. The Kalpa of 4.32 billion years falls within 5% of the modern scientific estimate for Earth\'s age (4.54 billion years). The Universe\'s age (13.8 billion years) is approximately 3.2 Kalpas. We do not claim ancient India measured radiometric decay rates. But we do note: a civilization that thought this deeply about cosmic time scales was not operating on ignorance.',
    hi: 'संयोग — यदि यह है — तो उल्लेखनीय है। 4.32 अरब वर्षों का कल्प पृथ्वी की आयु के आधुनिक वैज्ञानिक अनुमान (4.54 अरब वर्ष) के 5% के भीतर आता है। ब्रह्मांड की आयु (13.8 अरब वर्ष) लगभग 3.2 कल्प है। हम यह दावा नहीं करते कि प्राचीन भारत ने रेडियोमेट्रिक क्षय दर मापी। लेकिन हम यह अवश्य कहते हैं: एक सभ्यता जो ब्रह्मांडीय समय के पैमाने के बारे में इतनी गहराई से सोचती थी, वह अज्ञानता पर काम नहीं कर रही थी।',
  },

  s4Title: { en: 'The Sources: Surya Siddhanta and Vishnu Purana', hi: 'स्रोत: सूर्य सिद्धांत और विष्णु पुराण' },
  s4Body: {
    en: 'The most precise numerical treatment of Hindu time cycles comes from two canonical sources. The Surya Siddhanta (compiled ~400 CE, based on older tradition) opens with a precise astronomical statement: "A Kalpa equals 4,320,000,000 years — one day of Brahma." It then uses this number to derive the number of planetary revolutions since the start of creation. The Vishnu Purana describes the full nested hierarchy from Kali Yuga to Brahma\'s lifespan with consistent, interlocking numbers — suggesting a coherent mathematical framework rather than folklore.',
    hi: 'हिंदू समय चक्रों का सबसे सटीक संख्यात्मक उपचार दो प्रामाणिक स्रोतों से आता है। सूर्य सिद्धांत (~400 ई. संकलित, पुरानी परंपरा पर आधारित) एक सटीक खगोलीय कथन के साथ खुलता है: "एक कल्प 4,320,000,000 वर्षों के बराबर है — ब्रह्मा का एक दिन।" फिर वह इस संख्या का उपयोग सृष्टि की शुरुआत से ग्रहीय चक्करों की संख्या निकालने के लिए करता है। विष्णु पुराण कलि युग से ब्रह्मा के जीवनकाल तक पूर्ण नेस्टेड पदानुक्रम का सुसंगत, अंतर-संबंधित संख्याओं के साथ वर्णन करता है।',
  },

  s5Title: { en: 'Carl Sagan on Hindu Cosmology', hi: 'हिंदू ब्रह्मांड-विज्ञान पर कार्ल सागन' },
  s5Quote: {
    en: '"The Hindu religion is the only one of the world\'s great faiths dedicated to the idea that the Cosmos itself undergoes an immense, indeed an infinite, number of deaths and rebirths. It is the only religion in which the time scales correspond to those of modern scientific cosmology. Its cycles run from our ordinary day and night to a day and night of Brahma, 8.64 billion years long — longer than the age of the Earth or the Sun, about half the time since the Big Bang."',
    hi: '"हिंदू धर्म विश्व के महान धर्मों में एकमात्र है जो इस विचार को समर्पित है कि ब्रह्मांड स्वयं असंख्य, वास्तव में अनंत, मृत्युओं और पुनर्जन्मों से गुजरता है। यह एकमात्र धर्म है जिसके समय-पैमाने आधुनिक वैज्ञानिक ब्रह्मांड-विज्ञान के समान हैं। इसके चक्र हमारे साधारण दिन-रात से लेकर ब्रह्मा के दिन-रात तक चलते हैं, जो 8.64 अरब वर्ष लंबे हैं — पृथ्वी या सूर्य की आयु से अधिक, बिग बैंग के बाद से लगभग आधा समय।"',
  },

  s6Title: { en: 'Our App Uses This Framework Directly', hi: 'हमारा ऐप इस ढाँचे का सीधे उपयोग करता है' },
  s6Body: {
    en: 'The Hindu time framework is not just historical curiosity — it is the active foundation of every Vedic calculation in this app. Samvatsara (the 60-year Jupiter-Saturn cycle) is a sub-cycle of larger Yuga time. The current Kali Yuga start (3102 BCE) is used as the epoch for astronomical computations in the Surya Siddhanta. Vedic Time calculations show your current position within the Yuga hierarchy. Even our Panchang uses the sidereal year count from the Kali Yuga epoch.',
    hi: 'हिंदू समय ढाँचा केवल ऐतिहासिक जिज्ञासा नहीं है — यह इस ऐप में प्रत्येक वैदिक गणना की सक्रिय नींव है। संवत्सर (60 वर्षीय बृहस्पति-शनि चक्र) बड़े युग समय का एक उप-चक्र है। वर्तमान कलि युग की शुरुआत (3102 BCE) सूर्य सिद्धांत में खगोलीय गणनाओं के युग के रूप में उपयोग की जाती है। वैदिक समय गणनाएँ युग पदानुक्रम के भीतर आपकी वर्तमान स्थिति दिखाती हैं।',
  },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस' },
  gravity: { en: 'Gravity (500 yrs before Newton)', hi: 'गुरुत्वाकर्षण (न्यूटन से 500 वर्ष पूर्व)' },
  vedicTime: { en: 'Vedic Time Tool', hi: 'वैदिक समय उपकरण' },
};

const YUGA_DATA = [
  { name: 'Satya Yuga', sanskrit: 'सत्य युग', years: 1728000, color: '#f0d48a', desc: { en: 'Golden Age — full cosmic virtue', hi: 'स्वर्ण युग — पूर्ण ब्रह्मांडीय सद्गुण' } },
  { name: 'Treta Yuga', sanskrit: 'त्रेता युग', years: 1296000, color: '#93c5fd', desc: { en: 'Silver Age — three-quarters virtue', hi: 'रजत युग — तीन-चौथाई सद्गुण' } },
  { name: 'Dwapara Yuga', sanskrit: 'द्वापर युग', years: 864000, color: '#c4b5fd', desc: { en: 'Copper Age — half virtue', hi: 'ताम्र युग — आधा सद्गुण' } },
  { name: 'Kali Yuga', sanskrit: 'कलि युग', years: 432000, color: '#f87171', desc: { en: 'Iron Age — quarter virtue (current)', hi: 'लौह युग — एक-चौथाई सद्गुण (वर्तमान)' } },
];

const SCALE_COMPARE = [
  { label: { en: 'Kali Yuga', hi: 'कलि युग' }, value: '432,000', unit: { en: 'years', hi: 'वर्ष' }, color: '#f87171' },
  { label: { en: 'Mahayuga', hi: 'महायुग' }, value: '4.32 million', unit: { en: 'years', hi: 'वर्ष' }, color: '#fbbf24' },
  { label: { en: 'Kalpa (1 day of Brahma)', hi: 'कल्प (ब्रह्मा का 1 दिन)' }, value: '4.32 billion', unit: { en: 'years', hi: 'वर्ष' }, color: '#a78bfa' },
  { label: { en: "Brahma's lifespan", hi: 'ब्रह्मा का जीवनकाल' }, value: '311 trillion', unit: { en: 'years', hi: 'वर्ष' }, color: '#34d399' },
];

const SCIENCE_COMPARE = [
  { label: { en: 'Kali Yuga', hi: 'कलि युग' }, vedic: '432,000 yrs', modern: { en: '~Holocene epoch', hi: '~होलोसीन काल' }, match: 'context', color: '#f87171' },
  { label: { en: 'Kalpa', hi: 'कल्प' }, vedic: '4.32 billion yrs', modern: { en: "Earth's age: 4.54 B yrs", hi: 'पृथ्वी की आयु: 4.54 अरब वर्ष' }, match: '95%', color: '#a78bfa' },
  { label: { en: "Brahma's day+night", hi: 'ब्रह्मा का दिन+रात' }, vedic: '8.64 billion yrs', modern: { en: 'Age of Sun: 4.6 B | Half Universe: ~7 B', hi: 'सूर्य की आयु: 4.6 अरब | आधा ब्रह्मांड: ~7 अरब' }, match: 'order', color: '#60a5fa' },
  { label: { en: 'Universe lifespan (est.)', hi: 'ब्रह्मांड जीवनकाल (अनुमानित)' }, vedic: '~311 trillion yrs', modern: { en: 'Unknown — far beyond current 13.8 B', hi: 'अज्ञात — वर्तमान 13.8 अरब से बहुत आगे' }, match: 'open', color: '#34d399' },
];

export default function CosmicTimePage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  const totalMahayuga = YUGA_DATA.reduce((sum, y) => sum + y.years, 0);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </motion.div>

      {/* ── Section 1: The Time Scale ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s1Body)}</p>

        <div className="space-y-3">
          {SCALE_COMPARE.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex-shrink-0 w-2 h-8 rounded-full" style={{ background: item.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-text-primary text-sm font-semibold">{l(item.label)}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-text-secondary text-xs ml-1">{l(item.unit)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 2: The Math ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s2Body)}</p>

        <div className="space-y-3 mb-5">
          {YUGA_DATA.map((yuga, i) => {
            const pct = Math.round((yuga.years / totalMahayuga) * 100);
            return (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold" style={{ color: yuga.color }}>{yuga.name}</span>
                    <span className="text-text-secondary text-xs ml-2" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{yuga.sanskrit}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm" style={{ color: yuga.color }}>{yuga.years.toLocaleString()}</span>
                    <span className="text-text-secondary text-xs ml-1">{isHi ? 'वर्ष' : 'years'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: yuga.color }} />
                  </div>
                  <span className="text-text-secondary text-xs w-8 text-right">{pct}%</span>
                </div>
                <p className="text-text-secondary text-xs">{l(yuga.desc)}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center">
          <p className="text-text-secondary text-xs mb-1">{isHi ? '1 महायुग = सत्य + त्रेता + द्वापर + कलि' : '1 Mahayuga = Satya + Treta + Dwapara + Kali'}</p>
          <p className="text-gold-light text-lg font-mono font-bold">1,728,000 + 1,296,000 + 864,000 + 432,000</p>
          <p className="text-gold-light text-2xl font-mono font-bold mt-1">= 4,320,000 {isHi ? 'वर्ष' : 'years'}</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? '× 1,000 = 1 कल्प = 4,320,000,000 वर्ष' : '× 1,000 = 1 Kalpa = 4,320,000,000 years'}</p>
        </div>
      </motion.div>

      {/* ── Section 3: Compare With Science ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s3Body)}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{isHi ? 'इकाई' : 'Unit'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'वैदिक' : 'Vedic'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आधुनिक विज्ञान' : 'Modern Science'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'मिलान' : 'Match'}</th>
              </tr>
            </thead>
            <tbody>
              {SCIENCE_COMPARE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-4" style={{ color: row.color }}>{l(row.label)}</td>
                  <td className="text-right text-text-primary py-2 pr-4 font-mono">{row.vedic}</td>
                  <td className="text-right text-text-secondary py-2 pr-4">{l(row.modern)}</td>
                  <td className="text-right py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.match === '95%' ? 'bg-emerald-500/15 text-emerald-300' :
                      row.match === 'order' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-white/5 text-text-secondary'
                    }`}>
                      {row.match}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-200 text-xs">
            {isHi
              ? 'Kalpa (4.32 अरब वर्ष) बनाम पृथ्वी की आयु (4.54 अरब वर्ष): केवल 5% अंतर। यह रेडियोमेट्रिक डेटिंग के बिना हासिल किया गया, हजारों वर्ष पहले।'
              : 'Kalpa (4.32 billion years) vs Earth\'s age (4.54 billion years): only 5% difference. Achieved without radiometric dating, thousands of years ago.'}
          </p>
        </div>
      </motion.div>

      {/* ── Section 4: Sources ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s4Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20">
            <p className="text-gold-light font-semibold text-sm mb-2">{isHi ? 'सूर्य सिद्धांत (~400 CE)' : 'Surya Siddhanta (~400 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-3">
              {isHi
                ? 'प्राचीनतम जीवित खगोलीय ग्रंथों में से एक। एक कल्प = 4,320,000,000 वर्ष की सटीक संख्या प्रदान करता है और ग्रहीय चक्करों की गणना इसी आधार पर करता है।'
                : 'One of the oldest surviving astronomical texts. Gives the precise number: 1 Kalpa = 4,320,000,000 years, and derives planetary revolutions from this epoch.'}
            </p>
            <div className="p-2 rounded-lg bg-white/[0.04] border border-gold-primary/10">
              <p className="text-gold-light font-mono text-xs">{isHi ? '1 कल्प = 4,32,00,00,000 वर्ष' : '1 Kalpa = 4,320,000,000 years'}</p>
              <p className="text-text-secondary text-xs mt-0.5">{isHi ? '= 1000 महायुग × 4,320,000' : '= 1000 Mahayugas × 4,320,000'}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-sm mb-2">{isHi ? 'विष्णु पुराण' : 'Vishnu Purana'}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-3">
              {isHi
                ? 'कलि युग से ब्रह्मा के जीवनकाल तक पूर्ण नेस्टेड पदानुक्रम का वर्णन करता है। संख्याएँ सुसंगत और परस्पर जुड़ी हुई हैं — लोककथा नहीं, गणित।'
                : 'Describes the full nested hierarchy from Kali Yuga to Brahma\'s lifespan. Numbers are consistent and interlocking — not folklore, but mathematics.'}
            </p>
            <div className="p-2 rounded-lg bg-white/[0.04] border border-purple-500/10">
              <p className="text-purple-300 font-mono text-xs">{isHi ? 'ब्रह्मा का जीवनकाल = 311,040,000,000,000 वर्ष' : "Brahma's lifespan = 311,040,000,000,000 years"}</p>
              <p className="text-text-secondary text-xs mt-0.5">{isHi ? '= 2 × 360 × 1000 × 2 × 1000 महायुग' : '= 2 × 360 × 1000 × 2 × 1000 Mahayugas'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Section 5: Carl Sagan ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{l(L.s5Title)}</h3>

        <div className="p-5 rounded-xl bg-blue-500/8 border-l-4 border-blue-400/50 mb-5">
          <p className="text-blue-100 text-sm leading-relaxed italic mb-3">{l(L.s5Quote)}</p>
          <p className="text-blue-300 text-xs font-semibold">— Carl Sagan, Cosmos (1980)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: { en: "Sagan's \"day of Brahma\"", hi: 'सागन का "ब्रह्मा का दिन"' }, value: '8.64 billion yrs', color: '#60a5fa' },
            { label: { en: 'Age of Earth (modern)', hi: 'पृथ्वी की आयु (आधुनिक)' }, value: '4.54 billion yrs', color: '#34d399' },
            { label: { en: 'Kalpa (1 day of Brahma)', hi: 'कल्प (ब्रह्मा का 1 दिन)' }, value: '4.32 billion yrs', color: '#f0d48a' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div className="font-mono text-base font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-text-secondary text-xs">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 6: App Connection ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s6Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {[
            { label: { en: 'Samvatsara (60-yr cycle)', hi: 'संवत्सर (60 वर्षीय चक्र)' }, detail: { en: 'Jupiter-Saturn conjunction cycle — sub-unit of Yuga time', hi: 'बृहस्पति-शनि संयुति चक्र — युग काल की उप-इकाई' }, color: '#f0d48a' },
            { label: { en: 'Kali Yuga epoch (3102 BCE)', hi: 'कलि युग युग (3102 BCE)' }, detail: { en: 'Starting date used in Surya Siddhanta for all planetary positions', hi: 'सूर्य सिद्धांत में सभी ग्रहीय स्थितियों के लिए उपयोग की जाने वाली प्रारंभिक तिथि' }, color: '#f87171' },
            { label: { en: 'Vedic Time display', hi: 'वैदिक समय प्रदर्शन' }, detail: { en: 'Shows your current Manvantara, Mahayuga, Yuga, and position within Kali Yuga', hi: 'आपका वर्तमान मन्वंतर, महायुग, युग और कलि युग के भीतर स्थिति दिखाता है' }, color: '#a78bfa' },
            { label: { en: 'Ayanamsha (precession)', hi: 'अयनांश (अग्रगमन)' }, detail: { en: 'Precession cycle (~26,000 yrs) is a sub-harmonic of Yuga mathematics', hi: 'अग्रगमन चक्र (~26,000 वर्ष) युग गणित का एक उप-हार्मोनिक है' }, color: '#34d399' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: item.color }} />
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: item.color }}>{l(item.label)}</div>
                <div className="text-text-secondary text-xs">{l(item.detail)}</div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/vedic-time"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/25 text-gold-light text-sm font-semibold hover:bg-gold-primary/25 transition-colors"
        >
          {isHi ? 'वैदिक समय उपकरण देखें' : 'Explore Vedic Time Tool'} →
        </Link>
      </motion.div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/gravity" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            ← {l(L.gravity)}
          </Link>
          <Link href="/vedic-time" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.vedicTime)} →
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
