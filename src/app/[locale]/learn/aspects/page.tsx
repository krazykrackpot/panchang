'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Eye, Target, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/aspects.json';

/* Labels migrated to src/messages/learn/aspects.json — accessed via LT + t() */

/* ── Planet data for diagram ─────────────────────────────────────── */
const PLANETS = [
  { id: 'jupiter', name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, color: '#facc15', aspects: [5, 7, 9], label: 'Guru' },
  { id: 'mars', name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, color: '#ef4444', aspects: [4, 7, 8], label: 'Mangal' },
  { id: 'saturn', name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#60a5fa', aspects: [3, 7, 10], label: 'Shani' },
  { id: 'rahu', name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, color: '#a78bfa', aspects: [5, 7, 9], label: 'Rahu' },
  { id: 'ketu', name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, color: '#c084fc', aspects: [5, 7, 9], label: 'Ketu' },
  { id: 'sun', name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, color: '#d4a853', aspects: [7], label: 'Surya' },
  { id: 'moon', name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, color: '#e2e8f0', aspects: [7], label: 'Chandra' },
  { id: 'mercury', name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, color: '#34d399', aspects: [7], label: 'Budha' },
  { id: 'venus', name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, color: '#f0abfc', aspects: [7], label: 'Shukra' },
];

/* Aspect strength table data */
const ASPECT_RULES = [
  { planet: { en: 'All planets', hi: 'सभी ग्रह', sa: 'सर्वे ग्रहाः' }, aspects: '7th', full: '7th', threeQ: '\u2014', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Mars (special)', hi: 'मंगल (विशेष)', sa: 'मङ्गलः (विशेषः)' }, aspects: '4th, 8th', full: '8th', threeQ: '4th', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Jupiter (special)', hi: 'बृहस्पति (विशेष)', sa: 'बृहस्पतिः (विशेषः)' }, aspects: '5th, 9th', full: '5th, 9th', threeQ: '\u2014', half: '\u2014', quarter: '\u2014' },
  { planet: { en: 'Saturn (special)', hi: 'शनि (विशेष)', sa: 'शनिः (विशेषः)' }, aspects: '3rd, 10th', full: '10th', threeQ: '3rd', half: '\u2014', quarter: '\u2014' },
];

/* Key combos */
const KEY_COMBOS = [
  { combo: { en: 'Jupiter aspecting 7th house', hi: 'बृहस्पति की 7वें भाव पर दृष्टि', sa: 'बृहस्पतेः सप्तमभावे दृष्टिः' },
    effect: { en: 'Marriage protected, good spouse, harmonious partnership. One of the best aspects for marital happiness.', hi: 'विवाह सुरक्षित, अच्छा जीवनसाथी, सामंजस्यपूर्ण सम्बन्ध। वैवाहिक सुख के लिए सर्वोत्तम दृष्टियों में से एक।', sa: 'विवाहरक्षितः, सुजीवनसहचरः, सामञ्जस्यपूर्णसम्बन्धः।' },
    nature: 'benefic' },
  { combo: { en: 'Saturn aspecting 7th house', hi: 'शनि की 7वें भाव पर दृष्टि', sa: 'शनेः सप्तमभावे दृष्टिः' },
    effect: { en: 'Delayed marriage, older or mature spouse. Partnership demands patience and responsibility. Marriage improves with age.', hi: 'विवाह में विलम्ब, वयस्क या परिपक्व जीवनसाथी। सम्बन्ध में धैर्य और उत्तरदायित्व की माँग। आयु के साथ विवाह सुधरता है।', sa: 'विवाहविलम्बः, वयस्कः परिपक्वः वा जीवनसहचरः।' },
    nature: 'malefic' },
  { combo: { en: 'Mars aspecting 7th house', hi: 'मंगल की 7वें भाव पर दृष्टि', sa: 'मङ्गलस्य सप्तमभावे दृष्टिः' },
    effect: { en: 'Passionate but conflictual marriage (Mangal Dosha from aspect). Spouse is energetic and assertive. Needs outlet for aggression.', hi: 'जोशपूर्ण किन्तु संघर्षपूर्ण विवाह (दृष्टि से मांगलिक दोष)। जीवनसाथी ऊर्जावान और दृढ़। आक्रामकता के लिए निकास आवश्यक।', sa: 'उत्साहपूर्णं किन्तु संघर्षपूर्णं विवाहम् (दृष्ट्या मङ्गलदोषः)।' },
    nature: 'malefic' },
  { combo: { en: 'Jupiter aspecting Moon', hi: 'बृहस्पति की चन्द्र पर दृष्टि', sa: 'बृहस्पतेः चन्द्रे दृष्टिः' },
    effect: { en: 'Gaja Kesari potential — emotional wisdom, optimism, generosity. The mind is blessed with philosophical depth and contentment.', hi: 'गज केसरी की सम्भावना — भावनात्मक ज्ञान, आशावाद, उदारता। मन दार्शनिक गहराई और सन्तोष से आशीर्वादित।', sa: 'गजकेसरीसम्भावना — भावनात्मकज्ञानम्, आशावादः, औदार्यम्।' },
    nature: 'benefic' },
  { combo: { en: 'Saturn aspecting Moon', hi: 'शनि की चन्द्र पर दृष्टि', sa: 'शनेः चन्द्रे दृष्टिः' },
    effect: { en: 'Emotional restriction, discipline, and potential for depression (Visha Yoga tendency). The mind becomes serious, brooding, and prone to worry. However, it also gives deep focus and emotional resilience over time.', hi: 'भावनात्मक प्रतिबन्ध, अनुशासन और अवसाद की सम्भावना (विष योग प्रवृत्ति)। मन गम्भीर और चिन्ताग्रस्त होता है, किन्तु गहन एकाग्रता और भावनात्मक दृढ़ता भी देता है।', sa: 'भावनात्मकप्रतिबन्धः, अनुशासनम्, अवसादसम्भावना च (विषयोगप्रवृत्तिः)।' },
    nature: 'malefic' },
  { combo: { en: 'Mars aspecting Saturn', hi: 'मंगल की शनि पर दृष्टि', sa: 'मङ्गलस्य शनौ दृष्टिः' },
    effect: { en: 'Friction, frustration, accident-prone periods. Fire (Mars) meets ice (Saturn) — creates intense tension. Can manifest as muscular-skeletal issues, workplace conflicts, or engineering/military excellence when channelled.', hi: 'घर्षण, निराशा, दुर्घटना-प्रवण काल। अग्नि (मंगल) और हिम (शनि) का मिलन — तीव्र तनाव। सही दिशा में अभियान्त्रिकी/सैन्य उत्कृष्टता में परिवर्तित हो सकता है।', sa: 'घर्षणम्, निराशा, दुर्घटनाप्रवणकालः। अग्निः (मङ्गलः) हिमेन (शनिना) सह — तीव्रतनावः।' },
    nature: 'malefic' },
];

const RELATED_LINKS = [
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' } },
  { href: '/learn/grahas', label: { en: 'Learn: The Nine Planets', hi: 'पढ़ें: नवग्रह', sa: 'पठत: नवग्रहाः' } },
  { href: '/learn/bhavas', label: { en: 'Learn: The 12 Houses', hi: 'पढ़ें: 12 भाव', sa: 'पठत: 12 भावाः' } },
];

/* ── SVG Aspect Wheel ─────────────────────────────────────────── */
function AspectWheel({ selectedPlanet, locale }: { selectedPlanet: typeof PLANETS[0] | null; locale: Locale }) {
  const cx = 200, cy = 200, r = 160, innerR = 120;
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  // Position each house label around the circle (house 1 at top, clockwise)
  const housePos = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return {
      x: cx + (r + 22) * Math.cos(angle),
      y: cy + (r + 22) * Math.sin(angle),
    };
  };

  // Inner point for aspect lines
  const innerPos = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return {
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
    };
  };

  // Segment boundaries
  const segmentPath = (house: number) => {
    const startAngle = ((house - 1.5) * 30 - 90) * (Math.PI / 180);
    const endAngle = ((house - 0.5) * 30 - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    return `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`;
  };

  const sourceHouse = 1; // Planet always placed in house 1 for demo
  const from = innerPos(sourceHouse);

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[400px] mx-auto">
      <defs>
        <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="aspectGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="url(#wheelBg)" stroke="#d4a85333" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#d4a85322" strokeWidth="1" />

      {/* Segments */}
      {houses.map((h) => {
        const isSource = selectedPlanet && h === sourceHouse;
        const isAspected = selectedPlanet && selectedPlanet.aspects.includes(h);
        let fillColor = 'transparent';
        if (isSource) fillColor = selectedPlanet.color + '30';
        else if (isAspected) fillColor = selectedPlanet.color + '18';
        return (
          <path key={h} d={segmentPath(h)} fill={fillColor} stroke="#d4a85320" strokeWidth="0.5" />
        );
      })}

      {/* Dividing lines */}
      {houses.map((h) => {
        const angle = ((h - 1.5) * 30 - 90) * (Math.PI / 180);
        const ox = cx + r * Math.cos(angle);
        const oy = cy + r * Math.sin(angle);
        const ix = cx + innerR * Math.cos(angle);
        const iy = cy + innerR * Math.sin(angle);
        return <line key={h} x1={ix} y1={iy} x2={ox} y2={oy} stroke="#d4a85325" strokeWidth="0.5" />;
      })}

      {/* Aspect lines */}
      {selectedPlanet && selectedPlanet.aspects.map((targetHouse) => {
        const to = innerPos(targetHouse);
        return (
          <line
            key={targetHouse}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={selectedPlanet.color}
            strokeWidth="2.5"
            strokeDasharray={targetHouse === 7 ? 'none' : '6 3'}
            opacity="0.85"
            filter="url(#aspectGlow)"
          />
        );
      })}

      {/* House labels */}
      {houses.map((h) => {
        const pos = housePos(h);
        const isAspected = selectedPlanet && selectedPlanet.aspects.includes(h);
        const isSource = selectedPlanet && h === sourceHouse;
        return (
          <text
            key={h} x={pos.x} y={pos.y}
            textAnchor="middle" dominantBaseline="central"
            className="text-xs font-bold"
            fill={isSource ? (selectedPlanet?.color || '#d4a853') : isAspected ? (selectedPlanet?.color || '#d4a853') : '#8b8fa3'}
          >
            {h}
          </text>
        );
      })}

      {/* Source planet marker */}
      {selectedPlanet && (
        <>
          <circle
            cx={innerPos(sourceHouse).x} cy={innerPos(sourceHouse).y}
            r="10" fill={selectedPlanet.color + '40'} stroke={selectedPlanet.color} strokeWidth="1.5"
          />
          <text
            x={innerPos(sourceHouse).x} y={innerPos(sourceHouse).y}
            textAnchor="middle" dominantBaseline="central"
            className="text-xs font-bold" fill={selectedPlanet.color}
          >
            {selectedPlanet.label.substring(0, 2)}
          </text>
        </>
      )}

      {/* Aspect target markers */}
      {selectedPlanet && selectedPlanet.aspects.map((targetHouse) => {
        const pos = innerPos(targetHouse);
        return (
          <circle key={targetHouse}
            cx={pos.x} cy={pos.y} r="5"
            fill={selectedPlanet.color + '50'} stroke={selectedPlanet.color} strokeWidth="1"
          />
        );
      })}

      {/* Center text */}
      {!selectedPlanet && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          className="text-xs" fill="#8b8fa3">
          {lt((LT as unknown as Record<string, LocaleText>)['selectPlanet'], locale)}
        </text>
      )}
      {selectedPlanet && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
          className="text-xs font-bold" fill={selectedPlanet.color}>
          {tl(selectedPlanet.name, locale)}
        </text>
      )}
    </svg>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function AspectsPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const t = (key: string) => lt((LT as unknown as Record<string, LocaleText>)[key], locale);
  const [selected, setSelected] = useState<typeof PLANETS[0] | null>(PLANETS[0]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {t('subtitle')}
        </p>
      </div>

      {/* Section 1: What are Aspects */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-gold-light" />
          <h3 className="text-gold-gradient text-xl font-bold" style={headingFont}>{t('whatTitle')}</h3>
        </div>
        <div className="space-y-3" style={bodyFont}>
          <p className="text-text-secondary text-sm leading-relaxed">{t('whatContent')}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{t('whatContent2')}</p>
          <p className="text-text-secondary text-sm leading-relaxed">{t('whatContent3')}</p>
        </div>
      </motion.div>

      {/* Interactive Aspect Diagram */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-2" style={headingFont}>{t('diagramTitle')}</h3>
        <p className="text-text-secondary text-xs mb-4" style={bodyFont}>{t('diagramHint')}</p>

        {/* Planet selector buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PLANETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selected?.id === p.id
                  ? 'border-current bg-white/5 scale-105'
                  : 'border-white/10 hover:border-white/25 bg-white/2'
              }`}
              style={{ color: p.color }}
            >
              {tl(p.name, locale)}
            </button>
          ))}
        </div>

        <AspectWheel selectedPlanet={selected} locale={locale} />

        {selected && (
          <div className="mt-4 text-center">
            <p className="text-xs text-text-secondary" style={bodyFont}>
              <span style={{ color: selected.color }} className="font-bold">{tl(selected.name, locale)}</span>
              {' '}{t('placedIn')}
              {' \u2192 '}{t('aspectsHouses')}{': '}
              <span style={{ color: selected.color }} className="font-bold">
                {selected.aspects.join(', ')}
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Section 2: Aspect Rules Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-gold-light" />
          <h3 className="text-gold-gradient text-xl font-bold" style={headingFont}>{t('rulesTitle')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="py-2 px-3 text-left text-gold-light font-bold" style={headingFont}>{t('planet')}</th>
                <th className="py-2 px-3 text-left text-gold-light font-bold" style={headingFont}>{t('aspects')}</th>
                <th className="py-2 px-3 text-center text-emerald-400 font-bold">{t('full')}</th>
                <th className="py-2 px-3 text-center text-yellow-400 font-bold">{t('threeQ')}</th>
                <th className="py-2 px-3 text-center text-orange-400 font-bold">{t('half')}</th>
                <th className="py-2 px-3 text-center text-red-400 font-bold">{t('quarter')}</th>
              </tr>
            </thead>
            <tbody>
              {ASPECT_RULES.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-text-primary font-medium" style={bodyFont}>{tl(row.planet, locale)}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{row.aspects}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400">{row.full}</td>
                  <td className="py-2.5 px-3 text-center text-yellow-400">{row.threeQ}</td>
                  <td className="py-2.5 px-3 text-center text-orange-400">{row.half}</td>
                  <td className="py-2.5 px-3 text-center text-red-400">{row.quarter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section 3: What Each Planet's Aspect Does */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-5" style={headingFont}>{t('effectTitle')}</h3>
        <div className="space-y-4" style={bodyFont}>
          {[
            { label: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, color: '#facc15', textKey: 'jupiterEffect' },
            { label: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#60a5fa', textKey: 'saturnEffect' },
            { label: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, color: '#ef4444', textKey: 'marsEffect' },
            { label: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, color: '#a78bfa', textKey: 'rahuEffect' },
            { label: { en: 'Sun / Moon / Mercury / Venus', hi: 'सूर्य / चन्द्र / बुध / शुक्र', sa: 'सूर्य / चन्द्र / बुध / शुक्र' }, color: '#d4a853', textKey: 'othersEffect' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 p-4 bg-white/2">
              <h4 className="text-sm font-bold mb-2" style={{ color: item.color, ...headingFont }}>
                {tl(item.label, locale)}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.textKey)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Key Aspect Combinations */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-5" style={headingFont}>{t('combosTitle')}</h3>
        <div className="space-y-3">
          {KEY_COMBOS.map((combo, i) => (
            <div key={i}
              className={`rounded-xl p-4 border ${
                combo.nature === 'benefic' ? 'border-emerald-500/15 bg-emerald-500/3' : 'border-red-500/10 bg-red-500/3'
              }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${combo.nature === 'benefic' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <h4 className="text-sm font-bold text-text-primary" style={headingFont}>{tl(combo.combo, locale)}</h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-4" style={bodyFont}>
                {tl(combo.effect, locale)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 5: Math / Engine */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-violet-400/15 bg-violet-400/3">
        <h3 className="text-violet-300 text-lg font-bold mb-3" style={headingFont}>{t('mathTitle')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{t('mathContent')}</p>
      </motion.div>

      {/* Related Links */}
      <div>
        <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>{t('relatedTitle')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RELATED_LINKS.map((link, i) => (
            <Link key={i} href={link.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 hover:border-gold-primary/30 transition-colors flex items-center justify-between group">
              <span className="text-sm text-text-primary font-medium" style={bodyFont}>{tl(link.label, locale)}</span>
              <ArrowRight className="w-4 h-4 text-gold-primary/50 group-hover:text-gold-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
