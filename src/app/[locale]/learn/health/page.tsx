'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronDown, Heart, Hospital, ShieldAlert, Stethoscope, Thermometer, Leaf } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/health.json';
import { isIndicLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ── Zodiac body map data ────────────────────────────────────────── */
const SIGN_KEYS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;
const BODY_ZONES: { signKey: typeof SIGN_KEYS[number]; color: string; y: number; h: number }[] = [
  { signKey: 'Aries', color: '#ef4444', y: 0, h: 42 },
  { signKey: 'Taurus', color: '#22c55e', y: 42, h: 32 },
  { signKey: 'Gemini', color: '#eab308', y: 74, h: 40 },
  { signKey: 'Cancer', color: '#94a3b8', y: 114, h: 38 },
  { signKey: 'Leo', color: '#d4a853', y: 152, h: 36 },
  { signKey: 'Virgo', color: '#4ade80', y: 188, h: 34 },
  { signKey: 'Libra', color: '#f472b6', y: 222, h: 32 },
  { signKey: 'Scorpio', color: '#b91c1c', y: 254, h: 34 },
  { signKey: 'Sagittarius', color: '#a855f7', y: 288, h: 38 },
  { signKey: 'Capricorn', color: '#78716c', y: 326, h: 34 },
  { signKey: 'Aquarius', color: '#3b82f6', y: 360, h: 36 },
  { signKey: 'Pisces', color: '#2dd4bf', y: 396, h: 34 },
];

/* ── Planet disease table ────────────────────────────────────────── */
const PLANET_HEALTH: { planetKey: string; partsKey: string; diseasesKey: string; color: string }[] = [
  { planetKey: 'planetSun', partsKey: 'sunParts', diseasesKey: 'sunDiseases', color: 'text-amber-400' },
  { planetKey: 'planetMoon', partsKey: 'moonParts', diseasesKey: 'moonDiseases', color: 'text-blue-300' },
  { planetKey: 'planetMars', partsKey: 'marsParts', diseasesKey: 'marsDiseases', color: 'text-red-400' },
  { planetKey: 'planetMercury', partsKey: 'mercuryParts', diseasesKey: 'mercuryDiseases', color: 'text-emerald-400' },
  { planetKey: 'planetJupiter', partsKey: 'jupiterParts', diseasesKey: 'jupiterDiseases', color: 'text-yellow-400' },
  { planetKey: 'planetVenus', partsKey: 'venusParts', diseasesKey: 'venusDiseases', color: 'text-pink-400' },
  { planetKey: 'planetSaturn', partsKey: 'saturnParts', diseasesKey: 'saturnDiseases', color: 'text-slate-400' },
  { planetKey: 'planetRahu', partsKey: 'rahuParts', diseasesKey: 'rahuDiseases', color: 'text-cyan-400' },
  { planetKey: 'planetKetu', partsKey: 'ketuParts', diseasesKey: 'ketuDiseases', color: 'text-violet-400' },
];

/* ── Health per Lagna sign ───────────────────────────────────────── */
const LAGNA_HEALTH: { signKey: string; constitutionKey: string; vulnerabilityKey: string; color: string }[] = [
  { signKey: 'signAries', constitutionKey: 'lagnaAriesConstitution', vulnerabilityKey: 'lagnaAriesVulnerability', color: 'text-red-400' },
  { signKey: 'signTaurus', constitutionKey: 'lagnaTaurusConstitution', vulnerabilityKey: 'lagnaTaurusVulnerability', color: 'text-emerald-400' },
  { signKey: 'signGemini', constitutionKey: 'lagnaGeminiConstitution', vulnerabilityKey: 'lagnaGeminiVulnerability', color: 'text-yellow-300' },
  { signKey: 'signCancer', constitutionKey: 'lagnaCancerConstitution', vulnerabilityKey: 'lagnaCancerVulnerability', color: 'text-blue-300' },
  { signKey: 'signLeo', constitutionKey: 'lagnaLeoConstitution', vulnerabilityKey: 'lagnaLeoVulnerability', color: 'text-amber-400' },
  { signKey: 'signVirgo', constitutionKey: 'lagnaVirgoConstitution', vulnerabilityKey: 'lagnaVirgoVulnerability', color: 'text-green-400' },
  { signKey: 'signLibra', constitutionKey: 'lagnaLibraConstitution', vulnerabilityKey: 'lagnaLibraVulnerability', color: 'text-pink-300' },
  { signKey: 'signScorpio', constitutionKey: 'lagnaScorpioConstitution', vulnerabilityKey: 'lagnaScorpioVulnerability', color: 'text-red-500' },
  { signKey: 'signSagittarius', constitutionKey: 'lagnaSagittariusConstitution', vulnerabilityKey: 'lagnaSagittariusVulnerability', color: 'text-violet-400' },
  { signKey: 'signCapricorn', constitutionKey: 'lagnaCapricornConstitution', vulnerabilityKey: 'lagnaCapricornVulnerability', color: 'text-slate-300' },
  { signKey: 'signAquarius', constitutionKey: 'lagnaAquariusConstitution', vulnerabilityKey: 'lagnaAquariusVulnerability', color: 'text-cyan-400' },
  { signKey: 'signPisces', constitutionKey: 'lagnaPiscesConstitution', vulnerabilityKey: 'lagnaPiscesVulnerability', color: 'text-indigo-400' },
];

/* ── Ayurvedic constitution data ─────────────────────────────────── */
const DOSHAS: { doshaKey: string; elementsKey: string; signsKey: string; traitsKey: string; color: string }[] = [
  { doshaKey: 'doshaPitta', elementsKey: 'pittaElements', signsKey: 'pittaSigns', traitsKey: 'pittaTraits', color: 'from-red-500/20 to-amber-500/20' },
  { doshaKey: 'doshaKapha', elementsKey: 'kaphaElements', signsKey: 'kaphaSigns', traitsKey: 'kaphaTraits', color: 'from-green-500/20 to-emerald-500/20' },
  { doshaKey: 'doshaVata', elementsKey: 'vataElements', signsKey: 'vataSigns', traitsKey: 'vataTraits', color: 'from-blue-500/20 to-cyan-500/20' },
  { doshaKey: 'doshaKaphaPitta', elementsKey: 'kaphaPittaElements', signsKey: 'kaphaPittaSigns', traitsKey: 'kaphaPittaTraits', color: 'from-indigo-500/20 to-purple-500/20' },
];

/* ── SVG Body Map Component ──────────────────────────────────────── */
function ZodiacBodyMap({ locale }: { locale: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <svg viewBox="0 0 680 460" className="w-full">
        <defs>
          <filter id="hb-glow"><feGaussianBlur stdDeviation="6" /><feComposite in="SourceGraphic" /></filter>
          <linearGradient id="hb-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Body silhouette outline */}
        <ellipse cx="340" cy="24" rx="32" ry="24" fill="none" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
        <line x1="340" y1="48" x2="340" y2="260" stroke="rgba(212,168,83,0.15)" strokeWidth="1.5" />
        <line x1="340" y1="90" x2="270" y2="160" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="90" x2="410" y2="160" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="260" x2="300" y2="420" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        <line x1="340" y1="260" x2="380" y2="420" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />
        {/* Zone stripes */}
        {BODY_ZONES.map((z, i) => {
          const isActive = hovered === i;
          const barY = z.y + 4;
          const barH = z.h - 4;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Left label band */}
              <rect x="0" y={barY} width="200" height={barH} rx="6"
                fill={isActive ? z.color : 'transparent'}
                fillOpacity={isActive ? 0.15 : 0}
                stroke={z.color} strokeWidth={isActive ? 1.5 : 0.5} strokeOpacity={isActive ? 0.8 : 0.25}
              />
              <text x="10" y={barY + barH / 2} dominantBaseline="middle"
                fill={z.color} fontSize="11" fontWeight="bold" opacity={isActive ? 1 : 0.7}>
                {t(`sign${z.signKey}`, locale)}
              </text>
              <text x="196" y={barY + barH / 2} dominantBaseline="middle" textAnchor="end"
                fill="rgba(255,255,255,0.5)" fontSize="9" opacity={isActive ? 1 : 0.5}>
                {t(`parts${z.signKey}`, locale)}
              </text>
              {/* Connector to center body */}
              <line x1="200" y1={barY + barH / 2} x2="310" y2={barY + barH / 2}
                stroke={z.color} strokeWidth={isActive ? 1 : 0.3} strokeOpacity={isActive ? 0.6 : 0.15}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* Center body zone indicator */}
              <rect x="310" y={barY + 2} width="60" height={barH - 4} rx="4"
                fill={z.color} fillOpacity={isActive ? 0.25 : 0.06}
                stroke={z.color} strokeWidth={isActive ? 1 : 0} strokeOpacity={0.5}
              />
              {/* Right connector */}
              <line x1="370" y1={barY + barH / 2} x2="480" y2={barY + barH / 2}
                stroke={z.color} strokeWidth={isActive ? 1 : 0.3} strokeOpacity={isActive ? 0.6 : 0.15}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* Right rashi number */}
              <circle cx="500" cy={barY + barH / 2} r="12"
                fill={isActive ? z.color : 'transparent'} fillOpacity={isActive ? 0.2 : 0}
                stroke={z.color} strokeWidth={isActive ? 1.5 : 0.5} strokeOpacity={isActive ? 0.8 : 0.3}
              />
              <text x="500" y={barY + barH / 2} textAnchor="middle" dominantBaseline="middle"
                fill={z.color} fontSize="10" fontWeight="bold" opacity={isActive ? 1 : 0.6}>
                {i + 1}
              </text>
            </g>
          );
        })}
        {/* Title */}
        <text x="340" y="452" textAnchor="middle" fill="rgba(212,168,83,0.5)" fontSize="10" fontStyle="italic">
          {t('svgFooter', locale)}
        </text>
      </svg>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function HealthAstrologyPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const [expandedLagna, setExpandedLagna] = useState<number | null>(null);

  /* House items for section 1 */
  const HOUSES = [
    { house: '1st', icon: Heart, labelKey: 'house1Label', descKey: 'house1Desc', color: 'text-emerald-400' },
    { house: '6th', icon: ShieldAlert, labelKey: 'house6Label', descKey: 'house6Desc', color: 'text-amber-400' },
    { house: '8th', icon: Thermometer, labelKey: 'house8Label', descKey: 'house8Desc', color: 'text-red-400' },
    { house: '12th', icon: Hospital, labelKey: 'house12Label', descKey: 'house12Desc', color: 'text-violet-400' },
  ];

  /* Timing items for section 4 */
  const TIMING_ITEMS = [
    { triggerKey: 'timing1Trigger', effectKey: 'timing1Effect', severity: 'high' as const },
    { triggerKey: 'timing2Trigger', effectKey: 'timing2Effect', severity: 'high' as const },
    { triggerKey: 'timing3Trigger', effectKey: 'timing3Effect', severity: 'medium' as const },
    { triggerKey: 'timing4Trigger', effectKey: 'timing4Effect', severity: 'high' as const },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Stethoscope className="w-3.5 h-3.5" />
          {t('badgeMedicalAstrology', locale)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t('title', locale)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t('subtitle', locale)}</p>
      </motion.div>

      <KeyTakeaway locale={locale} points={[
        'Each zodiac sign governs a specific body region (Aries = head, Pisces = feet), forming the Kala Purusha (Cosmic Person) map.',
        'The 6th house (disease), 8th house (chronic illness/surgery), and 1st house (vitality) are the primary health indicators in a chart.',
        'Planetary transits over natal health indicators, combined with Dasha periods, help identify vulnerable health windows.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Kala Purusha" explanation="The Cosmic Person -- the Vedic mapping of the 12 zodiac signs to body parts, from Aries (head) to Pisces (feet)" />
        <BeginnerNote term="Maraka" explanation="A death-inflicting planet -- lords of the 2nd and 7th houses that can trigger health crises during their Dasha periods" />
        <BeginnerNote term="Vata/Pitta/Kapha" explanation="The three Ayurvedic doshas (body constitutions) that correspond to Air, Fire, and Water signs in the chart" />
      </div>

      {/* SVG Body Map */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <ZodiacBodyMap locale={locale} />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {t('bodyMapCaption', locale)}
          </p>
        </div>
      </motion.div>

      <WhyItMatters locale={locale}>
        Medical astrology identifies constitutional vulnerabilities and timing windows -- not diagnoses. A chart showing Mars afflicting the 6th house does not mean the person will get a specific disease; it indicates a predisposition toward inflammatory conditions that can be managed with awareness. Always consult qualified medical professionals for health decisions.
      </WhyItMatters>

      <ClassicalReference shortName="CS" chapter="Sutra Sthana" topic="Ayurvedic constitution types (Vata, Pitta, Kapha) that map to astrological elements" />

      {/* Section 1: Medical Astrology Basics */}
      <LessonSection number={1} title={t('sec1Title', locale)} variant="highlight">
        <div className="space-y-4">
          {HOUSES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.house} className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-gold-light font-bold text-sm mb-1" style={hf}>{t(item.labelKey, locale)}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(item.descKey, locale)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Planet-Body Part Table */}
      <LessonSection number={2} title={t('sec2Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec2Intro', locale)}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{t('thPlanet', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{t('thBodyParts', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs">{t('thDiseases', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {PLANET_HEALTH.map((p, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className={`py-2.5 px-3 font-bold ${p.color}`} style={hf}>{t(p.planetKey, locale)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{t(p.partsKey, locale)}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{t(p.diseasesKey, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 3: Health Per Lagna Sign */}
      <LessonSection number={3} title={t('sec3Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec3Intro', locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LAGNA_HEALTH.map((l, i) => {
            const isOpen = expandedLagna === i;
            return (
              <motion.div key={i} layout className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 overflow-hidden">
                <button onClick={() => setExpandedLagna(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-3 text-left">
                  <span className={`font-bold text-sm ${l.color}`} style={hf}>{t(l.signKey, locale)}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-3 pb-3 space-y-1.5">
                        <div>
                          <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{t('constitution', locale)}</span>
                          <p className="text-text-secondary text-xs">{t(l.constitutionKey, locale)}</p>
                        </div>
                        <div>
                          <span className="text-red-400/80 text-xs uppercase tracking-wider font-bold">{t('vulnerability', locale)}</span>
                          <p className="text-text-tertiary text-xs">{t(l.vulnerabilityKey, locale)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 4: Timing of Health Events */}
      <LessonSection number={4} title={t('sec4Title', locale)} variant="formula">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {t('sec4Intro', locale)}
          </p>
          {TIMING_ITEMS.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.severity === 'high' ? 'border-red-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]' : 'border-amber-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Activity className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                <span className="text-gold-light font-bold text-sm" style={hf}>{t(item.triggerKey, locale)}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-6">{t(item.effectKey, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Ayurvedic Constitution */}
      <LessonSection number={5} title={t('sec5Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec5Intro', locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOSHAS.map((d, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-xl bg-gradient-to-br ${d.color} border border-gold-primary/10`}>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-gold-light" />
                <h4 className="text-gold-light font-bold text-base" style={hf}>{t(d.doshaKey, locale)}</h4>
              </div>
              <p className="text-text-secondary text-xs mb-2 font-medium">{t(d.elementsKey, locale)}</p>
              <p className="text-gold-dark text-xs mb-2">{t(d.signsKey, locale)}</p>
              <p className="text-text-tertiary text-xs leading-relaxed">{t(d.traitsKey, locale)}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
          <p className="text-text-tertiary text-xs leading-relaxed">
            {t('sec5Method', locale)}
          </p>
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/kundali' as const, labelKey: 'navKundali' },
          { href: '/learn/planets' as const, labelKey: 'navPlanets' },
          { href: '/learn/planet-in-house' as const, labelKey: 'navPlanetInHouse' },
        ].map((link) => (
          <Link key={link.href} href={link.href}
            className="px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium hover:bg-gold-primary/20 transition-colors">
            {t(link.labelKey, locale)}
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
