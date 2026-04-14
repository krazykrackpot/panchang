'use client';

import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/combustion.json';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Flame, Sun, Shield, BookOpen } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';


/* ── Planet combustion data ──────────────────────────────────────── */
const PLANETS = [
  { name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, deg: 12, retroDeg: null, color: '#c0c0c0',
    effect: { en: 'Emotional instability, mind overshadowed by ego, mother\'s health concerns, difficulty in public image. This is common — roughly 25% of charts have it. The mind becomes servant to willpower rather than an independent faculty.', hi: 'भावनात्मक अस्थिरता, अहंकार से मन आच्छादित, माता के स्वास्थ्य की चिन्ता, सार्वजनिक छवि में कठिनाई। लगभग 25% कुण्डलियों में यह होता है।', sa: 'भावनात्मकअस्थिरता, अहङ्कारेण मनः आच्छादितम्, मातुः स्वास्थ्यचिन्ता।' },
    remedy: { en: 'Pearl gemstone, Monday fasting, Chandra Namaskar', hi: 'मोती रत्न, सोमवार व्रत, चन्द्र नमस्कार', sa: 'मुक्तारत्नम्, सोमवासरव्रतम्' },
    rating: 2 },
  { name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, deg: 14, retroDeg: 12, color: '#4ade80',
    effect: { en: 'Communication becomes unclear, business judgment clouded, education disrupted, skin issues possible. THE MOST COMMON combustion — roughly 60% of charts, since Mercury never strays far from the Sun. Less harmful precisely because of its frequency.', hi: 'संवाद अस्पष्ट, व्यापार निर्णय धुँधला, शिक्षा बाधित, त्वचा समस्याएँ। सबसे सामान्य अस्त — लगभग 60% कुण्डलियों में, क्योंकि बुध सूर्य से कभी दूर नहीं जाता।', sa: 'संवादः अस्पष्टः, वाणिज्यनिर्णयः धूमिलः, शिक्षा बाधिता। सर्वसामान्यः अस्तः।' },
    remedy: { en: 'Emerald gemstone, Wednesday Vishnu worship, green charity', hi: 'पन्ना रत्न, बुधवार विष्णु पूजा, हरित दान', sa: 'मरकतरत्नम्, बुधवासरे विष्णुपूजा' },
    rating: 1 },
  { name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, deg: 10, retroDeg: 8, color: '#f472b6',
    effect: { en: 'Relationship confusion, lack of romantic expression, spouse difficulties, kidney and reproductive issues possible. The planet of love loses its charm under the Sun\'s domineering presence — love becomes duty rather than joy.', hi: 'सम्बन्ध भ्रम, रोमांटिक अभिव्यक्ति की कमी, जीवनसाथी कठिनाइयाँ, वृक्क समस्याएँ सम्भव। प्रेम का ग्रह सूर्य के प्रभुत्व में आकर्षण खो देता है।', sa: 'सम्बन्धभ्रमः, प्रणयाभिव्यक्तेः अभावः, जीवनसहचरकठिनताः।' },
    remedy: { en: 'Diamond or white sapphire, Friday fasting, Lakshmi puja', hi: 'हीरा या श्वेत पुखराज, शुक्रवार व्रत, लक्ष्मी पूजा', sa: 'वज्रम् अथवा श्वेतपुष्परागः, शुक्रवासरव्रतम्' },
    rating: 2 },
  { name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, deg: 17, retroDeg: null, color: '#ef4444',
    effect: { en: 'Courage suppressed, action blocked, blood and heat issues, sibling problems. The warrior planet loses its fighting spirit — initiative gives way to passivity, and the native may struggle to assert themselves in competitive situations.', hi: 'साहस दमित, कार्य अवरुद्ध, रक्त-ताप समस्याएँ, भाई-बहन समस्याएँ। योद्धा ग्रह अपनी लड़ाकू भावना खो देता है — पहल निष्क्रियता में बदल जाती है।', sa: 'शौर्यं दमितम्, कर्म अवरुद्धम्, रक्ततापपीडा, भ्रातृसमस्याः।' },
    remedy: { en: 'Red coral, Tuesday Hanuman puja, donate red lentils', hi: 'मूंगा, मंगलवार हनुमान पूजा, लाल मसूर दान', sa: 'प्रवालम्, मङ्गलवासरे हनुमत्पूजा' },
    rating: 2 },
  { name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, deg: 11, retroDeg: null, color: '#facc15',
    effect: { en: 'Poor judgment, lack of wise counsel, children delayed, liver issues possible. THE MOST HARMFUL combustion — Jupiter is the great benefic, teacher of the gods. When the Guru is silenced, the native loses access to divine wisdom and makes avoidable mistakes.', hi: 'खराब निर्णय, बुद्धिमान परामर्श की कमी, सन्तान विलम्ब, यकृत समस्याएँ। सबसे हानिकारक अस्त — गुरु महान शुभ ग्रह है, देवताओं का शिक्षक। जब गुरु मौन है, जातक दिव्य ज्ञान से वंचित रहता है।', sa: 'निर्णयदोषः, विवेकपरामर्शाभावः, सन्तानविलम्बः। सर्वाधिकहानिकरः अस्तः — गुरुः महाशुभग्रहः।' },
    remedy: { en: 'Yellow sapphire, Thursday guru puja, donate turmeric', hi: 'पुखराज, गुरुवार गुरु पूजा, हल्दी दान', sa: 'पुष्परागः, गुरुवासरे गुरुपूजा' },
    rating: 3 },
  { name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, deg: 15, retroDeg: null, color: '#60a5fa',
    effect: { en: 'Discipline breaks down, structural collapse, chronic issues worsen, career instability. Saturn\'s patient, methodical energy is disrupted by the Sun\'s impatience — long-term plans get derailed by ego-driven impulsive decisions.', hi: 'अनुशासन टूट जाता है, संरचनात्मक पतन, दीर्घकालिक समस्याएँ बिगड़ती हैं, करियर अस्थिरता। शनि की धैर्यपूर्ण ऊर्जा सूर्य की अधीरता से बाधित — दीर्घकालिक योजनाएँ अहंकार-प्रेरित आवेगी निर्णयों से पटरी से उतरती हैं।', sa: 'अनुशासनं भग्नम्, संरचनात्मकपतनम्, दीर्घकालिकसमस्याः वर्धन्ते, वृत्तिअस्थिरता।' },
    remedy: { en: 'Blue sapphire (with caution), Saturday Shani puja, donate black sesame', hi: 'नीलम (सावधानी से), शनिवार शनि पूजा, काले तिल दान', sa: 'नीलमणिः (सावधानेन), शनिवासरे शनिपूजा' },
    rating: 2 },
];

/* ── SVG Combustion Distance Diagram ────────────────────────────── */
function CombustionDiagram({ locale }: { locale: Locale }) {
  const cx = 250, cy = 200;
  const maxRadius = 170;
  const maxDeg = 17; // Mars has the largest distance
  const scale = (deg: number) => 40 + (deg / maxDeg) * (maxRadius - 40);

  return (
    <svg viewBox="0 0 500 400" className="w-full max-w-[540px] mx-auto">
      <defs>
        <radialGradient id="comb-sun" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="40%" stopColor="#d97706" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
        </radialGradient>
        <filter id="comb-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx={cx} cy={cy} r="180" fill="url(#comb-sun)" opacity="0.15" />

      {/* Concentric combustion rings — sorted outermost first */}
      {[...PLANETS].sort((a, b) => b.deg - a.deg).map((p, i) => {
        const r = scale(p.deg);
        const labelAngle = -90 + i * 55; // spread labels around
        const rad = (labelAngle * Math.PI) / 180;
        const lx = cx + (r + 14) * Math.cos(rad);
        const ly = cy + (r + 14) * Math.sin(rad);
        return (
          <g key={p.name.en}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
            <text x={lx} y={ly} fill={p.color} fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
              {lt(p.name as LocaleText, locale)} {p.deg}{p.retroDeg ? `/${p.retroDeg}R` : ''}
            </text>
          </g>
        );
      })}

      {/* Central Sun */}
      <circle cx={cx} cy={cy} r="28" fill="url(#comb-sun)" filter="url(#comb-glow)" />
      <text x={cx} y={cy + 1} fill="#1a1a2e" fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
        {tl({ en: 'SUN', hi: 'सूर्य', sa: 'सूर्य' }, locale)}
      </text>

      {/* Legend */}
      <text x={cx} y="385" fill="#a0a0b8" fontSize="10" textAnchor="middle">
        {tl({ en: 'Distance in degrees (° longitude) — R = retrograde distance', hi: 'दूरी अंशों में (° देशान्तर) — R = वक्री दूरी', sa: 'दूरी अंशों में (° देशान्तर) — R = वक्री दूरी' }, locale)}
      </text>
    </svg>
  );
}

/* ── Severity stars ──────────────────────────────────────────────── */
function SeverityStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Flame key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-orange-400' : 'text-text-tertiary/30'}`} />
      ))}
    </span>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function CombustionPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm mb-4">
            <Flame className="w-4 h-4" />
            {tl({ en: 'Planetary Condition', hi: 'ग्रह अवस्था', sa: 'ग्रह अवस्था' }, locale)}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('title')}
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Section 1: What is Combustion */}
        <LessonSection number={1} title={t('whatTitle')}>
          <p>{t('whatP1')}</p>
          <p>{t('whatP2')}</p>
        </LessonSection>

        {/* SVG Diagram */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 mb-6">
          <CombustionDiagram locale={locale} />
        </motion.div>

        {/* Section 2: Effects Per Planet */}
        <LessonSection number={2} title={t('effectsTitle')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLANETS.map((p) => (
              <motion.div key={p.name.en}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 hover:border-gold-primary/25 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg" style={{ color: p.color }}>
                    {lt(p.name as LocaleText, locale)}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary font-mono">{p.deg}{p.retroDeg ? `/${p.retroDeg}R` : ''}</span>
                    <SeverityStars rating={p.rating} />
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{lt(p.effect as LocaleText, locale)}</p>
                <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-300/80">{lt(p.remedy as LocaleText, locale)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* Section 3: Combustion vs Other Weaknesses */}
        <LessonSection number={3} title={t('vsTitle')} variant="highlight">
          <p>{t('vsP1')}</p>
          <p>{t('vsP2')}</p>
          <div className="mt-4 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10 font-mono text-sm text-gold-light">
            <code>abs(planet_longitude - sun_longitude) &lt; combustion_distance</code>
          </div>
        </LessonSection>

        {/* Related Links */}
        <LessonSection title={t('relatedTitle')}>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ', sa: 'कुण्डलीनिर्माणम्' } },
              { href: '/learn/planets', label: { en: 'Learn: Planets', hi: 'सीखें: ग्रह', sa: 'अध्ययनम्: ग्रहाः' } },
              { href: '/learn/remedies', label: { en: 'Learn: Remedies', hi: 'सीखें: उपाय', sa: 'अध्ययनम्: उपायाः' } },
            ].map(link => (
              <Link key={link.href} href={link.href as '/'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold-primary/20 bg-gold-primary/5 text-gold-light text-sm hover:bg-gold-primary/15 transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                {lt(link.label as LocaleText, locale)}
              </Link>
            ))}
          </div>
        </LessonSection>
      </div>
    </div>
  );
}
