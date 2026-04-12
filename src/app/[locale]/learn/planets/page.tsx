'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/planets.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const NAVAGRAHA = [
  { nameKey: 'navagraha_sun', natureKey: 'nature_sun', sanskrit: 'Surya', color: '#f59e0b', id: 0 },
  { nameKey: 'navagraha_moon', natureKey: 'nature_moon', sanskrit: 'Chandra', color: '#e2e8f0', id: 1 },
  { nameKey: 'navagraha_mars', natureKey: 'nature_mars', sanskrit: 'Mangal', color: '#ef4444', id: 2 },
  { nameKey: 'navagraha_mercury', natureKey: 'nature_mercury', sanskrit: 'Budha', color: '#22c55e', id: 3 },
  { nameKey: 'navagraha_jupiter', natureKey: 'nature_jupiter', sanskrit: 'Guru', color: '#f0d48a', id: 4 },
  { nameKey: 'navagraha_venus', natureKey: 'nature_venus', sanskrit: 'Shukra', color: '#ec4899', id: 5 },
  { nameKey: 'navagraha_saturn', natureKey: 'nature_saturn', sanskrit: 'Shani', color: '#3b82f6', id: 6 },
  { nameKey: 'navagraha_rahu', natureKey: 'nature_rahu', sanskrit: 'Rahu', color: '#6366f1', id: 7 },
  { nameKey: 'navagraha_ketu', natureKey: 'nature_ketu', sanskrit: 'Ketu', color: '#9ca3af', id: 8 },
];

const ELEMENT_GRID = [
  {
    elementKey: 'element_fire', signsKey: 'signs_fire', color: 'border-red-400/20 bg-red-400/5',
    planets: [
      { pKey: 'navagraha_sun', descKey: 'fire_sun' },
      { pKey: 'navagraha_moon', descKey: 'fire_moon' },
      { pKey: 'navagraha_mars', descKey: 'fire_mars' },
      { pKey: 'navagraha_mercury', descKey: 'fire_mercury' },
      { pKey: 'navagraha_jupiter', descKey: 'fire_jupiter' },
      { pKey: 'navagraha_venus', descKey: 'fire_venus' },
      { pKey: 'navagraha_saturn', descKey: 'fire_saturn' },
    ],
  },
  {
    elementKey: 'element_earth', signsKey: 'signs_earth', color: 'border-emerald-400/20 bg-emerald-400/5',
    planets: [
      { pKey: 'navagraha_sun', descKey: 'earth_sun' },
      { pKey: 'navagraha_moon', descKey: 'earth_moon' },
      { pKey: 'navagraha_mars', descKey: 'earth_mars' },
      { pKey: 'navagraha_mercury', descKey: 'earth_mercury' },
      { pKey: 'navagraha_jupiter', descKey: 'earth_jupiter' },
      { pKey: 'navagraha_venus', descKey: 'earth_venus' },
      { pKey: 'navagraha_saturn', descKey: 'earth_saturn' },
    ],
  },
  {
    elementKey: 'element_air', signsKey: 'signs_air', color: 'border-sky-400/20 bg-sky-400/5',
    planets: [
      { pKey: 'navagraha_sun', descKey: 'air_sun' },
      { pKey: 'navagraha_moon', descKey: 'air_moon' },
      { pKey: 'navagraha_mars', descKey: 'air_mars' },
      { pKey: 'navagraha_mercury', descKey: 'air_mercury' },
      { pKey: 'navagraha_jupiter', descKey: 'air_jupiter' },
      { pKey: 'navagraha_venus', descKey: 'air_venus' },
      { pKey: 'navagraha_saturn', descKey: 'air_saturn' },
    ],
  },
  {
    elementKey: 'element_water', signsKey: 'signs_water', color: 'border-blue-400/20 bg-blue-400/5',
    planets: [
      { pKey: 'navagraha_sun', descKey: 'water_sun' },
      { pKey: 'navagraha_moon', descKey: 'water_moon' },
      { pKey: 'navagraha_mars', descKey: 'water_mars' },
      { pKey: 'navagraha_mercury', descKey: 'water_mercury' },
      { pKey: 'navagraha_jupiter', descKey: 'water_jupiter' },
      { pKey: 'navagraha_venus', descKey: 'water_venus' },
      { pKey: 'navagraha_saturn', descKey: 'water_saturn' },
    ],
  },
];

const DIGNITY_TABLE = [
  { planetKey: 'navagraha_sun', color: '#f59e0b', exaltKey: 'dignity_exalt_sun', debiKey: 'dignity_debi_sun', ownKey: 'dignity_own_sun', moolaKey: 'dignity_moola_sun' },
  { planetKey: 'navagraha_moon', color: '#e2e8f0', exaltKey: 'dignity_exalt_moon', debiKey: 'dignity_debi_moon', ownKey: 'dignity_own_moon', moolaKey: 'dignity_moola_moon' },
  { planetKey: 'navagraha_mars', color: '#ef4444', exaltKey: 'dignity_exalt_mars', debiKey: 'dignity_debi_mars', ownKey: 'dignity_own_mars', moolaKey: 'dignity_moola_mars' },
  { planetKey: 'navagraha_mercury', color: '#22c55e', exaltKey: 'dignity_exalt_mercury', debiKey: 'dignity_debi_mercury', ownKey: 'dignity_own_mercury', moolaKey: 'dignity_moola_mercury' },
  { planetKey: 'navagraha_jupiter', color: '#f0d48a', exaltKey: 'dignity_exalt_jupiter', debiKey: 'dignity_debi_jupiter', ownKey: 'dignity_own_jupiter', moolaKey: 'dignity_moola_jupiter' },
  { planetKey: 'navagraha_venus', color: '#ec4899', exaltKey: 'dignity_exalt_venus', debiKey: 'dignity_debi_venus', ownKey: 'dignity_own_venus', moolaKey: 'dignity_moola_venus' },
  { planetKey: 'navagraha_saturn', color: '#3b82f6', exaltKey: 'dignity_exalt_saturn', debiKey: 'dignity_debi_saturn', ownKey: 'dignity_own_saturn', moolaKey: 'dignity_moola_saturn' },
];

const TABLE_COLUMNS = ['col_planet', 'col_sign', 'col_house', 'col_degree', 'col_nakshatra', 'col_pada', 'col_retro'];

export default function LearnPlanetsPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('title', locale)}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{t('subtitle', locale)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="Planet (seizer)" />
        <SanskritTermCard term="Sthiti" devanagari="स्थिति" transliteration="Sthiti" meaning="Position / placement" />
        <SanskritTermCard term="Uchcha" devanagari="उच्च" transliteration="Uccha" meaning="Exaltation" />
        <SanskritTermCard term="Neecha" devanagari="नीच" transliteration="Nicha" meaning="Debilitation" />
        <SanskritTermCard term="Vakri" devanagari="वक्री" transliteration="Vakri" meaning="Retrograde" />
      </div>

      {/* Section 1: What are Planetary Positions */}
      <LessonSection number={1} title={t('whatTitle', locale)}>
        <p style={bodyFont}>{t('whatContent', locale)}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent2', locale)}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent3', locale)}</p>
      </LessonSection>

      {/* Section 2: Navagraha grid */}
      <LessonSection number={2} title={t('navagrahaTitle', locale)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {NAVAGRAHA.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="text-gold-light font-bold text-sm" style={headingFont}>
                  {t(g.nameKey, locale)}
                </span>
                <span className="text-text-tertiary text-xs font-mono">
                  {g.sanskrit}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {t(g.natureKey, locale)}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 3: Reading the Planets Table */}
      <LessonSection number={3} title={t('readingTitle', locale)}>
        <p style={bodyFont}>{t('readingContent', locale)}</p>

        {/* Example table structure */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                {TABLE_COLUMNS.map(col => (
                  <th key={col} className="text-left py-2 px-2 text-gold-dark">
                    {t(col, locale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              <tr className="text-text-secondary">
                <td className="py-2 px-2 font-medium" style={{ color: '#ef4444' }}>{t('example_mars', locale)}</td>
                <td className="py-2 px-2">{t('example_capricorn', locale)}</td>
                <td className="py-2 px-2 font-mono">10</td>
                <td className="py-2 px-2 font-mono">28\u00b015&apos;</td>
                <td className="py-2 px-2">{t('example_dhanishta', locale)}</td>
                <td className="py-2 px-2 font-mono">3</td>
                <td className="py-2 px-2">-</td>
              </tr>
              <tr className="text-text-secondary">
                <td className="py-2 px-2 font-medium" style={{ color: '#f0d48a' }}>{t('example_jupiter', locale)}</td>
                <td className="py-2 px-2">{t('example_cancer', locale)}</td>
                <td className="py-2 px-2 font-mono">4</td>
                <td className="py-2 px-2 font-mono">5\u00b012&apos;</td>
                <td className="py-2 px-2">{t('example_pushya', locale)}</td>
                <td className="py-2 px-2 font-mono">1</td>
                <td className="py-2 px-2 text-amber-400">R</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* What each column means */}
        <div className="mt-6 space-y-4">
          {[
            { titleKey: 'signMeaning', descKey: 'signDesc', color: 'border-violet-400/20 bg-violet-400/5' },
            { titleKey: 'houseMeaning', descKey: 'houseDesc', color: 'border-emerald-400/20 bg-emerald-400/5' },
            { titleKey: 'nakshatraMeaning', descKey: 'nakshatraDesc', color: 'border-amber-400/20 bg-amber-400/5' },
            { titleKey: 'retroMeaning', descKey: 'retroDesc', color: 'border-sky-400/20 bg-sky-400/5' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-4 border ${item.color}`}
            >
              <div className="text-gold-light text-sm font-bold mb-1" style={headingFont}>{t(item.titleKey, locale)}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t(item.descKey, locale)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Planet-in-Sign Element Grid */}
      <LessonSection number={4} title={t('elementTitle', locale)}>
        <p style={bodyFont}>{t('elementContent', locale)}</p>

        <div className="mt-6 space-y-6">
          {ELEMENT_GRID.map((el, elIdx) => (
            <motion.div
              key={el.elementKey}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: elIdx * 0.1 }}
              className={`rounded-2xl p-4 border ${el.color}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gold-light text-sm font-bold" style={headingFont}>{t(el.elementKey, locale)}</span>
                <span className="text-text-tertiary text-xs font-mono">
                  ({t(el.signsKey, locale)})
                </span>
              </div>
              <div className="space-y-2">
                {el.planets.map((pl) => (
                  <div key={pl.descKey} className="flex gap-3 items-start">
                    <div className="w-16 flex-shrink-0 text-xs font-semibold text-gold-dark text-right pt-0.5" style={headingFont}>
                      {t(pl.pKey, locale)}
                    </div>
                    <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                      {t(pl.descKey, locale)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Key Dignities */}
      <LessonSection number={5} title={t('dignityTitle', locale)} variant="highlight">
        <p style={bodyFont}>{t('dignityContent', locale)}</p>

        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{t('col_planet', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('exaltationLabel', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('debilitationLabel', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('ownSignLabel', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('moolTriLabel', locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {DIGNITY_TABLE.map((row) => (
                <tr key={row.planetKey} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-medium" style={{ color: row.color }}>
                    {t(row.planetKey, locale)}
                  </td>
                  <td className="py-2 px-2 text-emerald-400">{t(row.exaltKey, locale)}</td>
                  <td className="py-2 px-2 text-red-400">{t(row.debiKey, locale)}</td>
                  <td className="py-2 px-2 text-text-secondary">{t(row.ownKey, locale)}</td>
                  <td className="py-2 px-2 text-text-secondary/70">{t(row.moolaKey, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { labelKey: 'exaltationLabel', descKey: 'dignity_exalt_desc', color: 'emerald' },
            { labelKey: 'debilitationLabel', descKey: 'dignity_debi_desc', color: 'red' },
            { labelKey: 'ownSignLabel', descKey: 'dignity_own_desc', color: 'blue' },
            { labelKey: 'moolTriLabel', descKey: 'dignity_moola_desc', color: 'amber' },
          ].map((item) => {
            const colorClasses: Record<string, string> = {
              emerald: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400',
              amber: 'border-amber-400/20 bg-amber-400/5 text-amber-400',
              red: 'border-red-400/20 bg-red-400/5 text-red-400',
              blue: 'border-blue-400/20 bg-blue-400/5 text-blue-400',
            };
            const cls = colorClasses[item.color] || colorClasses.amber;
            return (
            <div key={item.labelKey} className={`rounded-lg p-3 border ${cls.split(' ').slice(0, 2).join(' ')}`}>
              <div className={`${cls.split(' ')[2]} text-sm font-semibold mb-1`} style={headingFont}>{t(item.labelKey, locale)}</div>
              <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t(item.descKey, locale)}</div>
            </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 6: Related modules */}
      <LessonSection number={6} title={t('modulesTitle', locale)}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/9-1', labelKey: 'link_9_1' },
            { href: '/learn/modules/9-3', labelKey: 'link_9_3' },
            { href: '/learn/modules/2-1', labelKey: 'link_2_1' },
            { href: '/learn/modules/2-3', labelKey: 'link_2_3' },
            { href: '/learn/grahas', labelKey: 'link_grahas' },
            { href: '/kundali', labelKey: 'link_kundali' },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {t(mod.labelKey, locale)}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt', locale)} →
        </Link>
      </div>
    </div>
  );
}
