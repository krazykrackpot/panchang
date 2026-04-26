'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { computeHinduMonths, formatMonthDate } from '@/lib/calendar/hindu-months';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/masa.json';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const MONTHS_DETAIL = [
  { n: 1, sa: 'चैत्रः' },
  { n: 2, sa: 'वैशाखः' },
  { n: 3, sa: 'ज्येष्ठः' },
  { n: 4, sa: 'आषाढः' },
  { n: 5, sa: 'श्रावणः' },
  { n: 6, sa: 'भाद्रपदः' },
  { n: 7, sa: 'आश्विनः' },
  { n: 8, sa: 'कार्तिकः' },
  { n: 9, sa: 'मार्गशीर्षः' },
  { n: 10, sa: 'पौषः' },
  { n: 11, sa: 'माघः' },
  { n: 12, sa: 'फाल्गुनः' },
];

const RITU_COLORS = [
  'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  'text-amber-400 border-amber-500/20 bg-amber-500/5',
  'text-blue-400 border-blue-500/20 bg-blue-500/5',
  'text-gold-light border-gold-primary/20 bg-gold-primary/5',
  'text-sky-300 border-sky-500/20 bg-sky-500/5',
  'text-indigo-300 border-indigo-500/20 bg-indigo-500/5',
];

export default function MasaPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);

  const currentYear = new Date().getFullYear();
  const hinduMonths = useMemo(() => computeHinduMonths(currentYear), [currentYear]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {t('title', locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {t('subtitle', locale)}
        </p>
      </div>

      {/* Two Systems */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {t('twoSystemsTitle', locale)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold text-sm mb-2">{t('amantLabel', locale)}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('amantDesc', locale)}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-2">{t('purnimantLabel', locale)}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('purnimantDesc', locale)}</p>
          </div>
        </div>

        {/* Visual diagram */}
        <svg viewBox="0 0 600 120" className="w-full max-w-2xl mx-auto">
          {/* Amant line */}
          <line x1="50" y1="35" x2="550" y2="35" stroke="#4a9eff" strokeWidth="2" opacity="0.4" />
          <text x="30" y="20" fill="#4a9eff" fontSize="9" fontWeight="bold">Amant</text>
          {/* Amant month boundaries (New Moons) */}
          {[50, 200, 350, 500].map((x, i) => (
            <g key={`a${i}`}>
              <circle cx={x} cy={35} r={4} fill="#4a9eff" />
              <text x={x} y={55} textAnchor="middle" fill="#4a9eff" fontSize="7" opacity="0.6">{['Amavasya', 'Amavasya', 'Amavasya', 'Amavasya'][i]}</text>
            </g>
          ))}
          <text x={125} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Chaitra</text>
          <text x={275} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Vaishakha</text>
          <text x={425} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Jyeshtha</text>

          {/* Purnimant line */}
          <line x1="50" y1="90" x2="550" y2="90" stroke="#f0d48a" strokeWidth="2" opacity="0.4" />
          <text x="20" y="78" fill="#f0d48a" fontSize="9" fontWeight="bold">Purnimant</text>
          {/* Purnimant boundaries (Full Moons) — offset ~15 days */}
          {[125, 275, 425].map((x, i) => (
            <g key={`p${i}`}>
              <circle cx={x} cy={90} r={4} fill="#f0d48a" />
              <text x={x} y={110} textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.6">Purnima</text>
            </g>
          ))}
          <text x={200} y={85} textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">Chaitra</text>
          <text x={350} y={85} textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">Vaishakha</text>

          {/* Connecting arrows showing offset */}
          <line x1="125" y1="40" x2="125" y2="85" stroke="#ff6b6b" strokeWidth="0.5" strokeDasharray="3 2" />
          <text x="135" y="65" fill="#ff6b6b" fontSize="7">~15d offset</text>
        </svg>
      </div>

      {/* Adhika Masa */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
        <h3 className="text-violet-400 font-bold text-lg mb-4" style={hf}>
          {t('adhikaMasaTitle', locale)}
        </h3>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>{t('adhikaMasaIntro', locale)}</p>
          <p><span className="text-violet-300 font-bold">{t('adhikaHowLabel', locale)}</span> {t('adhikaHowDesc', locale)}</p>
          <p><span className="text-violet-300 font-bold">{t('adhikaNameLabel', locale)}</span> {t('adhikaNameDesc', locale)}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">{t('inauspiciousLabel', locale)}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('inauspiciousDesc', locale)}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">{t('auspiciousLabel', locale)}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('auspiciousDesc', locale)}</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
          <div className="text-violet-300 text-xs">
            <span className="font-bold">{'\u{1F4A1}'} {t('adhikaMathLabel', locale)}</span> {t('adhikaMathDesc', locale)}
          </div>
        </div>
      </div>

      {/* Month naming — why are they named this way */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {t('monthNamingTitle', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('monthNamingDesc', locale)}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">{t('monthCol', locale)}</th>
              <th className="text-left py-2 px-2 text-gold-dark">{t('purnimaNakshatraCol', locale)}</th>
              <th className="text-left py-2 px-2 text-gold-dark">{t('deityCol', locale)}</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {MONTHS_DETAIL.map(m => (
                <tr key={m.n} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium" style={hf}>{t(`month_${m.n}_name`, locale)}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{t(`month_${m.n}_nakshatra`, locale)}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{t(`month_${m.n}_deity`, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exact dates for current year */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {locale === 'en' ? `${t('exactDatesTitle', locale)} ${currentYear}` : `${currentYear} ${t('exactDatesTitle', locale)}`}
        </h3>
        <p className="text-text-secondary text-xs mb-3">
          {t('computedFrom', locale)}
        </p>
        {hinduMonths.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-2 text-gold-dark">#</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('monthCol', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('startCol', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('endCol', locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('daysCol', locale)}</th>
              </tr></thead>
              <tbody className="divide-y divide-gold-primary/5">
                {hinduMonths.map(m => {
                  const start = new Date(m.startDate);
                  const end = new Date(m.endDate);
                  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
                  const todayStr = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getDate().toString().padStart(2,'0')}`;
                  const isCurrent = todayStr >= m.startDate && todayStr < m.endDate;
                  // Use actual computed month name — NOT the hardcoded positional name
                  const monthName = locale === 'hi' ? m.hi : m.en;
                  return (
                    <tr key={`${m.n}-${m.startDate}`} className={`hover:bg-gold-primary/3 ${isCurrent ? 'bg-gold-primary/8' : ''} ${m.isAdhika ? 'italic' : ''}`}>
                      <td className="py-1.5 px-2 text-text-tertiary">{m.n}</td>
                      <td className="py-1.5 px-2 font-medium" style={hf}>
                        <span className={m.isAdhika ? 'text-violet-400' : 'text-gold-light'}>{monthName}</span>
                        {isCurrent && <span className="ml-1 text-xs px-1 py-0.5 rounded bg-gold-primary/20 text-gold-primary not-italic">{t('nowLabel', locale)}</span>}
                        {m.isAdhika && <span className="ml-1 text-xs px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 not-italic">{locale === 'hi' ? 'अधिक' : 'Adhika'}</span>}
                      </td>
                      <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(m.startDate, locale)}</td>
                      <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(m.endDate, locale)}</td>
                      <td className="py-1.5 px-2 text-text-tertiary">{days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-tertiary text-xs">{t('computing', locale)}</p>
        )}
      </div>

      {/* Detailed month cards */}
      <div>
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={hf}>
          {t('detailedTitle', locale)}
        </h3>
        <div className="space-y-4">
          {MONTHS_DETAIL.map((m) => (
            <motion.div key={m.n} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-sm shrink-0">{m.n}</div>
                <div>
                  <div className="text-gold-light font-bold text-lg" style={hf}>{t(`month_${m.n}_name`, locale)} <span className="text-text-tertiary text-xs font-normal" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({m.sa})</span></div>
                  <div className="text-text-tertiary text-xs">{t(`month_${m.n}_nakshatra`, locale)} {t('nakshatraBasedNaming', locale)} · {t(`month_${m.n}_deity`, locale)}</div>
                </div>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-3">{t(`month_${m.n}_significance`, locale)}</p>
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
                <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">{t('keyFestivals', locale)}</div>
                <div className="text-text-secondary text-xs">{t(`month_${m.n}_festivals`, locale)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Six Ritus */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {t('rituTitle', locale)}
        </h3>
        <p className="text-text-secondary text-xs mb-4 leading-relaxed">{t('rituDesc', locale)}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const color = RITU_COLORS[i - 1];
            return (
              <div key={i} className={`p-3 rounded-xl border ${color}`}>
                <div className={`font-bold text-sm mb-0.5 ${color.split(' ')[0]}`}>{t(`ritu_${i}_name`, locale)}</div>
                <div className="text-text-tertiary text-xs">{t(`ritu_${i}_months`, locale)}</div>
                <div className="text-text-secondary text-xs mt-1">{t(`ritu_${i}_desc`, locale)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
