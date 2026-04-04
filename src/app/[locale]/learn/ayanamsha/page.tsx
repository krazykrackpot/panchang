'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Locale } from '@/types/panchang';

export default function AyanamshaPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'अयनांश — विषुव अग्रगमन' : 'Ayanamsha — The Precession of Equinoxes'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'अयनांश ज्योतिष का सबसे मूलभूत सुधारक कारक है। यह समझना कि पृथ्वी की धुरी क्यों लड़खड़ाती है, आपकी कुण्डली की हर गणना की नींव है।'
            : 'Ayanamsha is the most fundamental correction factor in Jyotish. Understanding why Earth\'s axis wobbles is the foundation of every calculation in your birth chart.'}
        </p>
      </div>

      {/* ═══ WHAT IS PRECESSION? ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {isHi ? 'पृथ्वी का लड़खड़ाना — विषुव अग्रगमन क्या है?' : "Earth's Wobble — What Is Precession?"}
        </h3>

        {/* Spinning top analogy + SVG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {isHi
                ? 'एक लट्टू (spinning top) की कल्पना करें। जब यह घूमती है, तो इसकी धुरी एक वृत्त बनाती है — यह "प्रिसेशन" है। पृथ्वी भी बिल्कुल ऐसा करती है! पृथ्वी की धुरी 23.5° झुकी है और यह धीरे-धीरे एक शंकु (cone) में घूमती है। एक पूर्ण वृत्त पूरा करने में ~25,772 वर्ष लगते हैं।'
                : 'Imagine a spinning top. As it spins, its axis traces a circle in the air — that\'s "precession." Earth does exactly the same thing! Earth\'s axis is tilted 23.5° and it slowly traces a cone in space. One full circle takes ~25,772 years.'}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-text-secondary">{isHi ? 'गति: प्रति वर्ष 50.3 कोणीय सेकंड (arc-seconds)' : 'Rate: 50.3 arc-seconds per year'}</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-text-secondary">{isHi ? 'पूर्ण चक्र: ~25,772 वर्ष (प्लेटोनिक वर्ष)' : 'Full cycle: ~25,772 years (Platonic Year)'}</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-text-secondary">{isHi ? 'कारण: सूर्य-चंद्र का पृथ्वी के उभार पर गुरुत्वाकर्षण खिंचाव' : 'Cause: Sun & Moon\'s gravitational pull on Earth\'s equatorial bulge'}</span></div>
            </div>
          </div>

          {/* Precession cone SVG */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-[280px]">
              {/* Background */}
              <defs>
                <linearGradient id="axisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
                <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4a9eff" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Earth */}
              <circle cx="150" cy="180" r="35" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
              <ellipse cx="150" cy="180" rx="35" ry="10" fill="none" stroke="#2ecc71" strokeWidth="0.8" opacity="0.3" />
              <text x="150" y="184" textAnchor="middle" fill="#4a9eff" fontSize="8" opacity="0.6">Earth</text>

              {/* Precession cone */}
              <ellipse cx="150" cy="50" rx="60" ry="20" fill="none" stroke="#f0d48a" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

              {/* Current axis */}
              <line x1="150" y1="180" x2="120" y2="30" stroke="url(#axisGrad)" strokeWidth="2" />
              <circle cx="120" cy="30" r="4" fill="#f0d48a" />
              <text x="105" y="22" fill="#f0d48a" fontSize="8" fontWeight="bold">North Pole</text>

              {/* Cone lines */}
              <line x1="150" y1="180" x2="90" y2="50" stroke="#f0d48a" strokeWidth="0.5" opacity="0.2" />
              <line x1="150" y1="180" x2="210" y2="50" stroke="#f0d48a" strokeWidth="0.5" opacity="0.2" />

              {/* Arrow on ellipse showing direction */}
              <path d="M 175 35 L 185 40 L 178 44" fill="none" stroke="#f0d48a" strokeWidth="1" />

              {/* Labels */}
              <text x="150" y="72" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.7">Precession circle</text>
              <text x="150" y="82" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.5">~25,772 years</text>

              {/* Tilt angle */}
              <line x1="150" y1="180" x2="150" y2="120" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
              <path d="M 150 140 Q 145 135 140 132" fill="none" stroke="#ff6b6b" strokeWidth="0.8" />
              <text x="132" y="140" fill="#ff6b6b" fontSize="7">23.5°</text>

              {/* Polaris marker */}
              <text x="118" y="12" fill="#f0d48a" fontSize="6" opacity="0.5">{isHi ? '(ध्रुव तारा आज)' : '(Polaris today)'}</text>

              {/* Vega marker (future pole star) */}
              <circle cx="180" cy="38" r="2" fill="#4a9eff" opacity="0.4" />
              <text x="192" y="42" fill="#4a9eff" fontSize="6" opacity="0.5">{isHi ? 'वेगा (~14,000 CE)' : 'Vega (~14,000 CE)'}</text>
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
          <p className="text-text-secondary text-xs leading-relaxed">
            {isHi
              ? '💡 आज ध्रुव तारा (Polaris) उत्तरी ध्रुव पर है। ~14,000 CE में, प्रिसेशन के कारण, वेगा (Vega) ध्रुव तारा बनेगा। ~26,000 CE में फिर Polaris होगा। यह चक्र शाश्वत है।'
              : '💡 Today, Polaris marks the North Pole. By ~14,000 CE, due to precession, Vega will become the pole star. By ~26,000 CE, Polaris will return. This cycle is eternal — and it\'s the reason your Vedic chart differs from your Western chart.'}
          </p>
        </div>
      </div>

      {/* ═══ THE TWO ZODIACS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {isHi ? 'दो राशिचक्र — क्या अंतर है?' : 'Two Zodiacs — What\'s the Difference?'}
        </h3>

        {/* Enhanced Ayanamsha diagram */}
        <svg viewBox="0 0 600 320" className="w-full max-w-2xl mx-auto mb-6">
          {/* Tropical zodiac ring */}
          <circle cx="300" cy="160" r="130" fill="none" stroke="#4a9eff" strokeWidth="2" opacity="0.3" />
          <text x="300" y="20" textAnchor="middle" fill="#4a9eff" fontSize="12" fontWeight="bold">{isHi ? 'सायन (Tropical)' : 'Tropical (Western)'}</text>
          <text x="300" y="34" textAnchor="middle" fill="#4a9eff" fontSize="9" opacity="0.6">{isHi ? '0° = विषुव बिंदु (बदलता रहता है)' : '0° = Equinox point (shifts over time)'}</text>

          {/* Sidereal zodiac ring (slightly rotated) */}
          <g transform="rotate(-24, 300, 160)">
            <circle cx="300" cy="160" r="120" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.3" />
          </g>
          <text x="300" y="300" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold">{isHi ? 'निरयन (Sidereal)' : 'Sidereal (Indian/Vedic)'}</text>
          <text x="300" y="314" textAnchor="middle" fill="#f0d48a" fontSize="9" opacity="0.6">{isHi ? '0° = चित्रा तारा (Spica) से विपरीत, स्थिर' : '0° = Opposite Spica (Chitra nakshatra), FIXED'}</text>

          {/* Sign markers - Tropical */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = 300 + 130 * Math.cos(angle);
            const y = 160 + 130 * Math.sin(angle);
            const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
            return <text key={i} x={x} y={y} textAnchor="middle" fill="#4a9eff" fontSize="7" opacity="0.5">{signs[i]}</text>;
          })}

          {/* Ayanamsha arc */}
          <path d="M 430 160 A 130 130 0 0 0 420 105" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
          <text x="445" y="130" fill="#ff6b6b" fontSize="13" fontWeight="bold">~24°</text>
          <text x="445" y="145" fill="#ff6b6b" fontSize="9">{isHi ? 'अयनांश' : 'Ayanamsha'}</text>

          {/* Equinox point */}
          <circle cx="430" cy="160" r="5" fill="#4a9eff" />
          <text x="455" y="165" fill="#4a9eff" fontSize="8">{isHi ? 'विषुव' : 'Equinox'}</text>

          {/* Example: "Your Sun" */}
          <g>
            <circle cx="360" cy="60" r="8" fill="#e67e22" opacity="0.8" />
            <text x="360" y="64" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">☉</text>
            <line x1="370" y1="65" x2="420" y2="80" stroke="#e67e22" strokeWidth="0.5" strokeDasharray="3 2" />
            <text x="430" y="75" fill="#e67e22" fontSize="8">{isHi ? 'सूर्य 15° मेष (Tropical)' : 'Sun at 15° Aries (Tropical)'}</text>
            <text x="430" y="87" fill="#f0d48a" fontSize="8">{isHi ? '= 21° मीन (Sidereal!) ← अयनांश सुधार' : '= 21° Pisces (Sidereal!) ← Ayanamsha correction'}</text>
          </g>
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-400 font-bold text-sm mb-2">{isHi ? 'सायन (Tropical) — पश्चिमी' : 'Tropical — Western Astrology'}</div>
            <ul className="text-text-secondary text-xs space-y-1.5 leading-relaxed">
              <li>• {isHi ? '0° मेष = वसंत विषुव (Vernal Equinox)' : '0° Aries = Vernal Equinox (~March 21)'}</li>
              <li>• {isHi ? 'ऋतुओं से जुड़ा — "कब" महत्वपूर्ण' : 'Tied to seasons — "when" matters'}</li>
              <li>• {isHi ? 'हर वर्ष 50.3″ खिसकता है (तारों से)' : 'Drifts 50.3″/year relative to stars'}</li>
              <li>• {isHi ? '~2,000 वर्षों में 1 राशि का अंतर' : '~2,000 years = 1 full sign difference'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <div className="text-gold-light font-bold text-sm mb-2">{isHi ? 'निरयन (Sidereal) — वैदिक' : 'Sidereal — Vedic/Indian Astrology'}</div>
            <ul className="text-text-secondary text-xs space-y-1.5 leading-relaxed">
              <li>• {isHi ? '0° मेष = स्थिर तारा संदर्भ (चित्रा/Spica 180°)' : '0° Aries = Fixed star reference (Chitra/Spica at 180°)'}</li>
              <li>• {isHi ? 'तारा-मंडल से जुड़ा — "कहाँ" महत्वपूर्ण' : 'Tied to star constellations — "where" matters'}</li>
              <li>• {isHi ? 'स्थिर — नक्षत्र हमेशा अपनी जगह' : 'Fixed — nakshatras always in their place'}</li>
              <li>• {isHi ? 'सुधार: निरयन° = सायन° − अयनांश°' : 'Correction: Sidereal° = Tropical° − Ayanamsha°'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══ THE FORMULA ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {isHi ? 'गणना — अयनांश कैसे निकालें?' : 'The Calculation — How Ayanamsha Is Computed'}
        </h3>

        <div className="p-4 bg-bg-primary/80 rounded-xl border border-gold-primary/10 font-mono text-sm mb-6">
          <div className="text-gold-light mb-2">{isHi ? '// लाहिरी अयनांश सूत्र (IAE)' : '// Lahiri Ayanamsha Formula (Indian Astronomical Ephemeris)'}</div>
          <div className="text-emerald-300">T = (JD − 2451545.0) / 36525.0  <span className="text-text-tertiary">// centuries from J2000.0</span></div>
          <div className="text-emerald-300 mt-1">Ayanamsha = 23.85306° + 1.39722° × T + 0.00018° × T² − 0.000005° × T³</div>
          <div className="text-text-tertiary text-xs mt-3">{isHi ? '// J2000.0 (1 जनवरी 2000, 12:00 TT) पर: 23°51\'11" = 23.85306°' : '// At J2000.0 (Jan 1, 2000, 12:00 TT): 23°51\'11" = 23.85306°'}</div>
          <div className="text-text-tertiary text-xs">{isHi ? '// गति: ~50.3" प्रति वर्ष (1.39722° प्रति शताब्दी)' : '// Rate: ~50.3" per year (1.39722° per century)'}</div>
        </div>

        {/* Worked example */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-6">
          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदाहरण: 2026 के लिए गणना' : 'Worked Example: Calculate for 2026'}</div>
          <div className="font-mono text-xs text-text-secondary space-y-1.5">
            <div>1. JD for Jan 1, 2026 = 2461041.5</div>
            <div>2. T = (2461041.5 − 2451545.0) / 36525.0 = <span className="text-gold-light">0.26003</span></div>
            <div>3. Ayanamsha = 23.85306 + 1.39722 × 0.26003 + 0.00018 × 0.26003²</div>
            <div>   = 23.85306 + 0.36330 + 0.00001</div>
            <div>   = <span className="text-gold-light font-bold">24.2164°</span></div>
            <div className="text-emerald-300 mt-2">{isHi ? '→ 2026 में, आपकी सायन स्थिति से 24.22° घटाएं = निरयन स्थिति' : '→ In 2026, subtract 24.22° from your tropical position = sidereal position'}</div>
          </div>
        </div>

        {/* Your sign might be different! */}
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
          <div className="text-red-400 font-bold text-sm mb-2">
            {isHi ? '⚠ आपकी राशि बदल सकती है!' : '⚠ Your Sign Might Be Different!'}
          </div>
          <p className="text-text-secondary text-xs leading-relaxed mb-3">
            {isHi
              ? '~24° का अंतर = ~80% लोगों की पश्चिमी (Tropical) राशि उनकी वैदिक (Sidereal) राशि से अलग है। यदि आपकी पश्चिमी सूर्य राशि "मेष" (Aries) है और सूर्य 24° से कम पर है, तो वैदिक में आप "मीन" (Pisces) हैं!'
              : '~24° difference means ~80% of people have a different Western sign than their Vedic sign. If your Western Sun is "Aries" but at less than 24°, in Vedic astrology you\'re actually Pisces!'}
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded-lg bg-bg-secondary/50">
              <div className="text-blue-400 font-bold">Western</div>
              <div className="text-text-secondary">Aries ♈ (15°)</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10">
              <div className="text-red-400 font-bold">−24.2°</div>
              <div className="text-text-tertiary">Ayanamsha</div>
            </div>
            <div className="p-2 rounded-lg bg-gold-primary/10">
              <div className="text-gold-light font-bold">Vedic</div>
              <div className="text-text-secondary">Pisces ♓ (20.8°)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ AYANAMSHA SYSTEMS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {isHi ? 'अयनांश पद्धतियाँ — कौन सी सही है?' : 'Ayanamsha Systems — Which One Is Correct?'}
        </h3>
        <p className="text-text-secondary text-xs mb-4 leading-relaxed">
          {isHi
            ? 'विभिन्न विद्वानों ने स्थिर तारा संदर्भ बिंदु अलग-अलग माना है, जिससे अयनांश मान में मामूली अंतर होता है। भारत सरकार ने 1956 में लाहिरी (चित्रपक्ष) को आधिकारिक मानक घोषित किया।'
            : 'Different scholars chose slightly different fixed star reference points, leading to small variations in the ayanamsha value. The Indian Government officially adopted Lahiri (Chitrapaksha) as the standard in 1956.'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'पद्धति' : 'System'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? '2026 मान' : '2026 Value'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'संदर्भ बिंदु' : 'Reference Point'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'उपयोग' : 'Usage'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { name: 'Lahiri (Chitrapaksha)', value: '24.22°', ref: { en: 'Spica (Chitra) at exactly 180°', hi: 'चित्रा तारा ठीक 180° पर' }, use: { en: 'Indian Govt official, most astrologers in India', hi: 'भारत सरकार आधिकारिक, अधिकांश भारतीय ज्योतिषी' }, highlight: true },
                { name: 'KP (Krishnamurti)', value: '24.13°', ref: { en: 'Close to Lahiri, ~6\' difference', hi: 'लाहिरी के निकट, ~6\' अंतर' }, use: { en: 'KP System practitioners', hi: 'केपी पद्धति अनुयायी' }, highlight: false },
                { name: 'Raman', value: '22.82°', ref: { en: 'CV Raman\'s own calibration', hi: 'सी.वी. रमन का स्वयं का अंशांकन' }, use: { en: 'Followers of Dr. B.V. Raman', hi: 'डॉ. बी.वी. रमन के अनुयायी' }, highlight: false },
                { name: 'BV Raman', value: '22.73°', ref: { en: 'B.V. Raman\'s system', hi: 'बी.वी. रमन पद्धति' }, use: { en: 'Some South Indian astrologers', hi: 'कुछ दक्षिण भारतीय ज्योतिषी' }, highlight: false },
                { name: 'Yukteshwar', value: '22.09°', ref: { en: 'Sri Yukteshwar Giri', hi: 'श्री युक्तेश्वर गिरि' }, use: { en: 'Yogananda/SRF tradition', hi: 'योगानंद/SRF परंपरा' }, highlight: false },
                { name: 'Fagan-Bradley', value: '24.87°', ref: { en: 'Aldebaran at 15° Taurus', hi: 'अल्डेबैरन 15° वृषभ पर' }, use: { en: 'Western sidereal astrology', hi: 'पश्चिमी सायन ज्योतिष' }, highlight: false },
              ].map((sys, i) => (
                <tr key={i} className={`hover:bg-gold-primary/3 ${sys.highlight ? 'bg-gold-primary/5' : ''}`}>
                  <td className={`py-2 px-3 font-medium ${sys.highlight ? 'text-gold-light' : 'text-text-primary'}`}>{sys.name}</td>
                  <td className="py-2 px-3 text-gold-light font-mono">{sys.value}</td>
                  <td className="py-2 px-3 text-text-secondary">{isHi ? sys.ref.hi : sys.ref.en}</td>
                  <td className="py-2 px-3 text-text-secondary">{isHi ? sys.use.hi : sys.use.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-tertiary text-xs mt-3">
          {isHi
            ? '💡 अंतर छोटा लगता है (~1-2°), लेकिन यह ग्रह-राशि सीमा पर स्थित ग्रहों की राशि बदल सकता है। अधिकांश स्थितियों में लाहिरी सबसे विश्वसनीय है।'
            : '💡 The difference seems small (~1-2°), but it can change the sign of planets near sign boundaries. In most cases, Lahiri is the most reliable and widely tested system.'}
        </p>
      </div>

      {/* ═══ HISTORICAL TIMELINE ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {isHi ? 'ऐतिहासिक परिप्रेक्ष्य' : 'Historical Perspective'}
        </h3>
        <div className="space-y-3">
          {[
            { year: '~500 BCE', event: { en: 'Tropical and Sidereal zodiacs were nearly aligned (ayanamsha ≈ 0°). This is when the Indian and Greek systems agreed.', hi: 'सायन और निरयन राशिचक्र लगभग एकसमान थे (अयनांश ≈ 0°)।' }, color: 'border-emerald-500/20' },
            { year: '~285 CE', event: { en: 'Surya Siddhanta documents precession rate of 54"/year — remarkably close to modern value of 50.3"/year.', hi: 'सूर्य सिद्धान्त में प्रिसेशन दर 54"/वर्ष — आधुनिक 50.3"/वर्ष से बहुत निकट।' }, color: 'border-amber-500/20' },
            { year: '505 CE', event: { en: 'Varahamihira\'s Pancha Siddhantika acknowledges precession and documents the divergence between tropical and sidereal systems.', hi: 'वराहमिहिर के पञ्चसिद्धान्तिका में प्रिसेशन की स्वीकृति और दोनों प्रणालियों का अंतर प्रलेखित।' }, color: 'border-amber-500/20' },
            { year: '1956 CE', event: { en: 'Indian Government\'s Calendar Reform Committee (under Meghnad Saha) adopts Lahiri Ayanamsha as official standard for all Hindu calendars and ephemeris.', hi: 'भारत सरकार की कैलेंडर सुधार समिति (मेघनाद साहा) ने लाहिरी अयनांश को सभी हिंदू पंचांगों के लिए आधिकारिक मानक स्वीकार किया।' }, color: 'border-gold-primary/30' },
            { year: '2026 CE', event: { en: `Current Lahiri Ayanamsha: ~24.22°. The tropical equinox has moved ~24° from where it was when the two systems aligned ~2,500 years ago.`, hi: 'वर्तमान लाहिरी अयनांश: ~24.22°। विषुव ~2,500 वर्ष पहले की स्थिति से ~24° आगे बढ़ गया है।' }, color: 'border-blue-500/20' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className={`flex gap-4 p-3 rounded-xl border ${item.color}`}>
              <div className="text-gold-light font-mono text-xs font-bold w-20 shrink-0">{item.year}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{isHi ? item.event.hi : item.event.en}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ WHY IT MATTERS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={hf}>
          {isHi ? 'आपकी कुण्डली पर प्रभाव' : 'Impact on Your Chart'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{isHi ? 'ग्रह स्थिति' : 'Planet Positions'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'सभी 9 ग्रहों की राशि, नक्षत्र, और पाद स्थिति अयनांश सुधार पर निर्भर करती है।' : 'All 9 planets\' sign, nakshatra, and pada placements depend on the ayanamsha correction.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{isHi ? 'लग्न (Ascendant)' : 'Ascendant'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'लग्न राशि — कुण्डली का सबसे महत्वपूर्ण बिंदु — अयनांश से सीधे प्रभावित। गलत अयनांश = गलत लग्न = गलत कुण्डली।' : 'The Lagna — the most critical point in your chart — is directly affected. Wrong ayanamsha = wrong lagna = wrong chart.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{isHi ? 'दशा गणना' : 'Dasha Timing'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'विंशोत्तरी दशा चंद्र के नक्षत्र पर आधारित है। नक्षत्र बदलने = दशा आरंभ/समाप्ति तिथियाँ बदलना।' : 'Vimshottari Dasha is based on Moon\'s nakshatra. A different nakshatra = different dasha start/end dates.'}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a href={`/${locale}/panchang`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors text-sm">
          {isHi ? 'आज का अयनांश देखें →' : "See Today's Ayanamsha →"}
        </a>
      </div>
    </div>
  );
}
