'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { TITHIS } from '@/lib/constants/tithis';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/tithis.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ─── Tithi categories ─── */
const CATEGORIES = [
  {
    nameKey: 'catNandaName', meaningKey: 'catNandaMeaning', natureKey: 'catNandaNature',
    tithis: '1, 6, 11',
    color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
  },
  {
    nameKey: 'catBhadraName', meaningKey: 'catBhadraMeaning', natureKey: 'catBhadraNature',
    tithis: '2, 7, 12',
    color: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
  },
  {
    nameKey: 'catJayaName', meaningKey: 'catJayaMeaning', natureKey: 'catJayaNature',
    tithis: '3, 8, 13',
    color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
  },
  {
    nameKey: 'catRiktaName', meaningKey: 'catRiktaMeaning', natureKey: 'catRiktaNature',
    tithis: '4, 9, 14',
    color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
  },
  {
    nameKey: 'catPurnaName', meaningKey: 'catPurnaMeaning', natureKey: 'catPurnaNature',
    tithis: '5, 10, 15',
    color: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
  },
];

/* ─── Planet lordship keys for each tithi 1-15 ─── */
const TITHI_PLANET_KEYS = [
  'planet1', // 1 Pratipada - Sun
  'planet2', // 2 Dwitiya - Moon
  'planet3', // 3 Tritiya - Mars
  'planet4', // 4 Chaturthi - Mercury
  'planet5', // 5 Panchami - Jupiter
  'planet6', // 6 Shashthi - Venus
  'planet7', // 7 Saptami - Saturn
  'planet8', // 8 Ashtami - Rahu
  'planet3', // 9 Navami - Mars again
  'planet1', // 10 Dashami - Sun
  'planet2', // 11 Ekadashi - Moon
  'planet4', // 12 Dwadashi - Mercury
  'planet5', // 13 Trayodashi - Jupiter
  'planet7', // 14 Chaturdashi - Saturn
  'planet6', // 15 Purnima/Amavasya - Venus
];

/* ─── Special Tithis data ─── */
const SPECIAL_TITHIS = [
  { nameKey: 'specialAmavasyaName', descKey: 'specialAmavasyaDesc', color: 'text-slate-300', border: 'border-slate-500/25' },
  { nameKey: 'specialPurnimaName', descKey: 'specialPurnimaDesc', color: 'text-gold-light', border: 'border-gold-primary/25' },
  { nameKey: 'specialEkadashiName', descKey: 'specialEkadashiDesc', color: 'text-blue-300', border: 'border-blue-500/25' },
  { nameKey: 'specialChaturthiName', descKey: 'specialChaturthiDesc', color: 'text-amber-400', border: 'border-amber-500/25' },
  { nameKey: 'specialChaturdashiName', descKey: 'specialChaturdashiDesc', color: 'text-indigo-400', border: 'border-indigo-500/25' },
];

/* ─── Muhurta Activity Guide ─── */
const MUHURTA_GUIDE = [
  { actKey: 'actMarriage', good: '2, 3, 5, 7, 10, 11, 13', avoid: '4, 8, 9, 14, Amavasya', noteKey: 'actMarriageNote' },
  { actKey: 'actGrihaPravesh', good: '2, 3, 5, 7, 10, 11, 13', avoid: '4, 8, 9, 14, Amavasya', noteKey: 'actGrihaPraveshNote' },
  { actKey: 'actBusiness', good: '1, 2, 3, 5, 6, 10, 11', avoid: '4, 8, 9, 14', noteKey: 'actBusinessNote' },
  { actKey: 'actEducation', good: '1, 2, 3, 5, 10, 11', avoid: '4, 9, 14, Amavasya', noteKey: 'actEducationNote' },
  { actKey: 'actSurgery', good: '4, 9, 14', avoid: '8, Amavasya, Purnima', noteKey: 'actSurgeryNote' },
  { actKey: 'actFasting', good: '11 (Ekadashi), Purnima, Amavasya, 4, 8', avoid: '-', noteKey: 'actFastingNote' },
  { actKey: 'actCharity', good: 'Purnima, 5, 10, 11, 15', avoid: '4, 9, 14', noteKey: 'actCharityNote' },
];

/* ─── Cross-references ─── */
const CROSS_REFS = [
  { href: '/learn/nakshatras', labelKey: 'refNakshatras', descKey: 'refNakshatrasDesc' },
  { href: '/learn/karanas', labelKey: 'refKaranas', descKey: 'refKaranasDesc' },
  { href: '/learn/yogas', labelKey: 'refYogas', descKey: 'refYogasDesc' },
  { href: '/learn/muhurtas', labelKey: 'refMuhurtas', descKey: 'refMuhurtasDesc' },
  { href: '/learn/masa', labelKey: 'refMasa', descKey: 'refMasaDesc' },
];

/* ─── Phase diagram data ─── */
const PHASE_ITEMS = [
  { angle: '0\u00b0', tithiKey: 'phaseAmavasya', phase: '\u25cf' },
  { angle: '12\u00b0', tithiKey: 'phaseShukla1', phase: '\u25d1' },
  { angle: '90\u00b0', tithiKey: 'phaseShukla8', phase: '\u25d1' },
  { angle: '180\u00b0', tithiKey: 'phasePurnima', phase: '\u25cb' },
  { angle: '192\u00b0', tithiKey: 'phaseKrishna1', phase: '\u25d1' },
  { angle: '270\u00b0', tithiKey: 'phaseKrishna8', phase: '\u25d1' },
  { angle: '348\u00b0', tithiKey: 'phaseKrishna14', phase: '\u25d1' },
  { angle: '360\u00b0', tithiKey: 'phaseAmavasya', phase: '\u25cf' },
];

function getCategoryForTithi(num: number): string {
  const n = num <= 15 ? num : num - 15;
  const mod = n % 5;
  if (mod === 1) return 'Nanda';
  if (mod === 2) return 'Bhadra';
  if (mod === 3) return 'Jaya';
  if (mod === 4) return 'Rikta';
  return 'Purna'; // mod === 0
}

function getCategoryColor(cat: string): string {
  switch (cat) {
    case 'Nanda': return 'text-emerald-400';
    case 'Bhadra': return 'text-blue-300';
    case 'Jaya': return 'text-amber-400';
    case 'Rikta': return 'text-red-400';
    case 'Purna': return 'text-violet-400';
    default: return 'text-text-secondary';
  }
}

export default function LearnTithisPage() {
  const locale = useLocale() as Locale;
  const headingFont = isDevanagariLocale(locale) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const tx = (key: string) => t(key, locale);

  const shukla = TITHIS.filter(ti => ti.paksha === 'shukla');
  const krishna = TITHIS.filter(ti => ti.paksha === 'krishna');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {tx('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {tx('subtitle')}
        </p>
      </div>

      {/* Key Takeaway */}
      <KeyTakeaway locale={locale} points={[
        'A Tithi is one of 30 lunar days defined by each 12-degree increment of the Moon-Sun angular distance.',
        'Tithis fall into 5 categories (Nanda, Bhadra, Jaya, Rikta, Purna) that determine their inherent auspiciousness.',
        'The same tithi in Shukla Paksha (waxing) and Krishna Paksha (waning) carries different energy and ritual significance.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Tithi" explanation="A lunar day -- the time it takes for the Moon to gain 12 degrees over the Sun, forming the basis of the Hindu calendar" />
        <BeginnerNote term="Paksha" explanation="A lunar fortnight -- Shukla Paksha (waxing, bright half) runs from Amavasya to Purnima; Krishna Paksha (waning, dark half) from Purnima to Amavasya" />
        <BeginnerNote term="Kshaya Tithi" explanation="A 'lost' tithi that begins and ends within the same sunrise-to-sunrise day, considered inauspicious for most activities" />
      </div>

      {/* 1. What Is a Tithi? */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('whatIs')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <p>{tx('whatIsBody')}</p>
          <p>{tx('angularDist')}</p>

          {/* Visual: Sun-Moon angle diagram */}
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 max-w-md w-full">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4 text-center">
                {tx('tithiFormulaCaption')}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {PHASE_ITEMS.map((item, i) => (
                  <div key={i} className="px-1.5 py-2 rounded-lg border border-gold-primary/10">
                    <div className="text-lg mb-1">{item.phase}</div>
                    <div className="text-gold-primary font-mono font-bold">{item.angle}</div>
                    <div className="text-text-secondary/70 text-xs">{tx(item.tithiKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Calculation Formula */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('calcTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <div className="p-5 bg-bg-primary/50 rounded-xl border border-gold-primary/15">
            <p className="text-gold-light font-mono text-base mb-2">D = (Moon_longitude - Sun_longitude + 360) mod 360</p>
            <p className="text-gold-light font-mono text-base mb-3">Tithi_number = floor(D / 12) + 1</p>
            <div className="text-text-secondary/75 font-mono text-xs space-y-1">
              <p>{tx('formulaShukla')}</p>
              <p>{tx('formulaKrishna')}</p>
              <p>{tx('formulaChange')}</p>
            </div>
          </div>

          {/* Worked example */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
            <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
              {tx('workedEx')}
            </div>
            <p className="text-sm">{tx('workedExBody')}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
              <p>Moon = 87.5\u00b0, Sun = 42.3\u00b0</p>
              <p>D = (87.5 - 42.3 + 360) mod 360 = 45.2\u00b0</p>
              <p>Tithi = floor(45.2 / 12) + 1 = floor(3.767) + 1 = 3 + 1 = <span className="text-gold-primary font-bold">4 (Shukla Chaturthi)</span></p>
              <p>{tx('workedExEnd')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <WhyItMatters locale={locale}>
        Tithis are the foundation of the Hindu calendar and determine the timing of every festival, vrat (fast), and sacred ritual. Choosing the right tithi for an activity (muhurta) is considered more important than choosing the right weekday. A ceremony performed on an inauspicious Rikta tithi can be undermined regardless of other favourable factors.
      </WhyItMatters>

      <ClassicalReference shortName="SS" chapter="Ch. 12" topic="Astronomical basis for tithi calculation from Sun-Moon elongation" />

      {/* 3. The 30 Tithis: Shukla & Krishna */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('pakshaTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-6">
          {/* Shukla Paksha */}
          <div>
            <h4 className="text-lg text-gold-light mb-2 font-bold" style={headingFont}>
              {tx('shuklaLabel')}
            </h4>
            <p className="text-sm mb-4">{tx('shuklaDesc')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {shukla.map((ti, i) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                return (
                  <motion.div
                    key={`s-${ti.number}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
                  >
                    <div className="text-gold-primary text-lg font-bold">{ti.number}</div>
                    <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/75 text-xs">{ti.name.en}</div>}
                    <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
                    <div className={`text-xs mt-1 font-medium ${catColor}`}>{cat}</div>
                    <div className="text-text-tertiary text-xs">{t(TITHI_PLANET_KEYS[ti.number - 1], locale)}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Krishna Paksha */}
          <div>
            <h4 className="text-lg text-indigo-300/80 mb-2 font-bold" style={headingFont}>
              {tx('krishnaLabel')}
            </h4>
            <p className="text-sm mb-4">{tx('krishnaDesc')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {krishna.map((ti, i) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                return (
                  <motion.div
                    key={`k-${ti.number}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
                  >
                    <div className="text-indigo-300/80 text-lg font-bold">{ti.number - 15}</div>
                    <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/75 text-xs">{ti.name.en}</div>}
                    <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
                    <div className={`text-xs mt-1 font-medium ${catColor}`}>{cat}</div>
                    <div className="text-text-tertiary text-xs">{t(TITHI_PLANET_KEYS[(ti.number - 15) - 1], locale)}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. Tithi Lordship Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('lordshipTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{tx('lordshipDesc')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thNumber')}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thTithi')}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thDeity')}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thPlanet')}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thCategory')}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thDegrees')}</th>
              </tr>
            </thead>
            <tbody>
              {shukla.map((ti) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                const startDeg = (ti.number - 1) * 12;
                const endDeg = ti.number * 12;
                return (
                  <tr key={ti.number} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className="py-2 px-3 text-gold-primary font-bold">{ti.number}</td>
                    <td className="py-2 px-3 text-gold-light font-medium">{ti.name[locale]}{locale !== 'en' && <span className="text-text-tertiary text-xs ml-1">({ti.name.en})</span>}</td>
                    <td className="py-2 px-3 text-text-secondary">{ti.deity[locale]}</td>
                    <td className="py-2 px-3 text-text-secondary">{t(TITHI_PLANET_KEYS[ti.number - 1], locale)}</td>
                    <td className={`py-2 px-3 font-medium ${catColor}`}>{cat}</td>
                    <td className="py-2 px-3 text-text-tertiary font-mono text-xs">{startDeg}\u00b0\u2013{endDeg}\u00b0</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* 5. Tithi Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('categoriesTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{tx('categoriesDesc')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.nameKey}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-5 border ${cat.border} ${cat.bg}`}
            >
              <div className={`text-lg font-bold ${cat.color} mb-1`} style={headingFont}>{tx(cat.nameKey)}</div>
              <div className="text-text-secondary/75 text-xs mb-2">{tx(cat.meaningKey)}</div>
              <div className="text-text-tertiary text-xs font-mono mb-3">
                {tx('tithisLabel')}: {cat.tithis}
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{tx(cat.natureKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* Category pattern visual */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
            {tx('cyclicPatternLabel')}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: 15 }, (_, i) => i + 1).map(n => {
              const cat = getCategoryForTithi(n);
              const color = getCategoryColor(cat);
              return (
                <div key={n} className="flex flex-col items-center px-2 py-1.5 rounded-lg border border-gold-primary/10 min-w-[40px]">
                  <div className="text-gold-primary font-bold text-sm">{n}</div>
                  <div className={`text-xs font-medium ${color}`}>{cat.substring(0, 2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 6. Special Tithis */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tx('specialTitle')}
        </h3>
        <div className="space-y-5">
          {SPECIAL_TITHIS.map((st, i) => (
            <motion.div
              key={st.nameKey}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-5 border ${st.border} bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]`}
            >
              <div className={`text-lg font-bold ${st.color} mb-2`} style={headingFont}>
                {tx(st.nameKey)}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{tx(st.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 7. Kshaya & Vriddhi Tithis */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('kshayaTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5">
          {/* Kshaya */}
          <div className="rounded-xl p-5 border border-red-500/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <div className="text-red-400 font-bold text-base mb-2" style={headingFont}>
              {tx('kshayaSubtitle')}
            </div>
            <p className="text-sm leading-relaxed">{tx('kshayaDesc')}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg text-xs space-y-1">
              <p className="text-gold-light font-mono">
                {tx('kshayaExample')}
              </p>
              <p className="text-text-tertiary">
                {tx('kshayaExplanation')}
              </p>
            </div>
          </div>

          {/* Vriddhi */}
          <div className="rounded-xl p-5 border border-emerald-500/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <div className="text-emerald-400 font-bold text-base mb-2" style={headingFont}>
              {tx('vriddhiSubtitle')}
            </div>
            <p className="text-sm leading-relaxed">{tx('vriddhiDesc')}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg text-xs space-y-1">
              <p className="text-gold-light font-mono">
                {tx('vriddhiExample')}
              </p>
              <p className="text-text-tertiary">
                {tx('vriddhiExplanation')}
              </p>
            </div>
          </div>

          {/* Visual: Moon speed variation */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
              {tx('moonSpeedCaption')}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-center text-xs">
              <div className="px-4 py-3 rounded-lg border border-red-500/15 bg-red-500/5">
                <div className="text-red-400 font-bold">{tx('perigeeLabel')}</div>
                <div className="text-text-secondary font-mono">~15.4\u00b0/day</div>
                <div className="text-text-tertiary text-xs mt-1">{tx('perigeeResult')}</div>
              </div>
              <div className="px-4 py-3 rounded-lg border border-gold-primary/15">
                <div className="text-gold-light font-bold">{tx('averageLabel')}</div>
                <div className="text-text-secondary font-mono">~13.2\u00b0/day</div>
                <div className="text-text-tertiary text-xs mt-1">{tx('averageResult')}</div>
              </div>
              <div className="px-4 py-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5">
                <div className="text-emerald-400 font-bold">{tx('apogeeLabel')}</div>
                <div className="text-text-secondary font-mono">~11.8\u00b0/day</div>
                <div className="text-text-tertiary text-xs mt-1">{tx('apogeeResult')}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. Dwi-Tithi Rule */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('dwiTithiTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{tx('dwiTithiDesc')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
            <div className="text-blue-300 font-bold text-sm mb-2" style={headingFont}>
              {tx('dwiEkadashiTitle')}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tx('dwiEkadashiDesc')}
            </p>
          </div>
          <div className="rounded-xl p-4 border border-gold-primary/20 bg-gold-primary/5">
            <div className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {tx('dwiOthersTitle')}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tx('dwiOthersDesc')}
            </p>
          </div>
        </div>
      </motion.section>

      {/* 9. Tithis & Muhurta Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('muhurtaTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{tx('muhurtaDesc')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{tx('thActivity')}</th>
                <th className="text-left py-2 px-3 text-emerald-400 text-xs uppercase tracking-wider">{tx('thGoodTithis')}</th>
                <th className="text-left py-2 px-3 text-red-400 text-xs uppercase tracking-wider">{tx('thAvoid')}</th>
                <th className="text-left py-2 px-3 text-text-tertiary text-xs uppercase tracking-wider">{tx('thNote')}</th>
              </tr>
            </thead>
            <tbody>
              {MUHURTA_GUIDE.map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2.5 px-3 text-gold-light font-medium">{tx(row.actKey)}</td>
                  <td className="py-2.5 px-3 text-emerald-400/80 font-mono text-xs">{row.good}</td>
                  <td className="py-2.5 px-3 text-red-400/80 font-mono text-xs">{row.avoid}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{tx(row.noteKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* 10. Cross-References */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('crossRef')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/nakshatras'}
              className="rounded-xl p-4 border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-bold text-sm group-hover:text-gold-primary transition-colors" style={headingFont}>
                {tx(ref.labelKey)}
              </div>
              <div className="text-text-tertiary text-xs mt-1 leading-relaxed">{tx(ref.descKey)}</div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {tx('tryIt')}
        </Link>
      </div>
    </div>
  );
}
