'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/vara.json';
import { isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = L as unknown as Record<string, LocaleText>;

/** Style-only VARA data — all translatable text lives in vara.json keyed by vara_{i}_{field} */
const VARA_STYLES = [
  { day: 0, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
  { day: 1, color: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
  { day: 2, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  { day: 3, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
  { day: 4, color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
  { day: 5, color: 'text-pink-300', border: 'border-pink-500/20', bg: 'bg-pink-500/5' },
  { day: 6, color: 'text-slate-300', border: 'border-slate-500/20', bg: 'bg-slate-500/5' },
];

const ANGA_KEYS = [
  { nameKey: 'angaTithiName', descKey: 'angaTithiDesc', color: 'text-amber-400' },
  { nameKey: 'angaNakshatraName', descKey: 'angaNakshatraDesc', color: 'text-blue-300' },
  { nameKey: 'angaYogaName', descKey: 'angaYogaDesc', color: 'text-emerald-400' },
  { nameKey: 'angaKaranaName', descKey: 'angaKaranaDesc', color: 'text-violet-400' },
  { nameKey: 'angaVaraName', descKey: 'angaVaraDesc', color: 'text-gold-light' },
];

const ORBITAL_KEYS = [
  { key: 'orbitalSaturn', period: '29.5 yr', color: 'text-slate-300', border: 'border-slate-500/20' },
  { key: 'orbitalJupiter', period: '11.9 yr', color: 'text-yellow-400', border: 'border-yellow-500/20' },
  { key: 'orbitalMars', period: '1.88 yr', color: 'text-red-400', border: 'border-red-500/20' },
  { key: 'orbitalSun', period: '1 yr', color: 'text-amber-400', border: 'border-amber-500/20' },
  { key: 'orbitalVenus', period: '225 d', color: 'text-pink-300', border: 'border-pink-500/20' },
  { key: 'orbitalMercury', period: '88 d', color: 'text-emerald-400', border: 'border-emerald-500/20' },
  { key: 'orbitalMoon', period: '27.3 d', color: 'text-blue-300', border: 'border-blue-500/20' },
];

const SKIP3_KEYS = [
  { abbr: 'Sa', key: 'skipSaturn', color: 'text-slate-300', border: 'border-slate-500/25' },
  { abbr: 'Su', key: 'skipSun', color: 'text-amber-400', border: 'border-amber-500/25' },
  { abbr: 'Mo', key: 'skipMoon', color: 'text-blue-300', border: 'border-blue-500/25' },
  { abbr: 'Ma', key: 'skipMars', color: 'text-red-400', border: 'border-red-500/25' },
  { abbr: 'Me', key: 'skipMercury', color: 'text-emerald-400', border: 'border-emerald-500/25' },
  { abbr: 'Ju', key: 'skipJupiter', color: 'text-yellow-400', border: 'border-yellow-500/25' },
  { abbr: 'Ve', key: 'skipVenus', color: 'text-pink-300', border: 'border-pink-500/25' },
];

/* Static cross-cultural table — not locale-dependent, always displayed in original scripts */
const CROSS_CULTURAL = [
  { planet: 'Sun', sa: 'रविवासरः', hi: 'रविवार', en: 'Sunday', latin: 'Dies Solis / Dimanche', jp: '日曜日 (Nichiyōbi)' },
  { planet: 'Moon', sa: 'सोमवासरः', hi: 'सोमवार', en: 'Monday', latin: 'Dies Lunae / Lundi', jp: '月曜日 (Getsuyōbi)' },
  { planet: 'Mars', sa: 'मङ्गलवासरः', hi: 'मंगलवार', en: 'Tuesday', latin: 'Dies Martis / Mardi', jp: '火曜日 (Kayōbi)' },
  { planet: 'Mercury', sa: 'बुधवासरः', hi: 'बुधवार', en: 'Wednesday', latin: 'Dies Mercurii / Mercredi', jp: '水曜日 (Suiyōbi)' },
  { planet: 'Jupiter', sa: 'गुरुवासरः', hi: 'गुरुवार', en: 'Thursday', latin: 'Dies Jovis / Jeudi', jp: '木曜日 (Mokuyōbi)' },
  { planet: 'Venus', sa: 'शुक्रवासरः', hi: 'शुक्रवार', en: 'Friday', latin: 'Dies Veneris / Vendredi', jp: '金曜日 (Kinyōbi)' },
  { planet: 'Saturn', sa: 'शनिवासरः', hi: 'शनिवार', en: 'Saturday', latin: 'Dies Saturni / Samedi', jp: '土曜日 (Doyōbi)' },
];

export default function VaraPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const headingFont = isIndicLocale(locale) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // Which day is today?
  const todayDay = new Date().getDay();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {t('subtitle')}
        </p>
      </div>

      {/* The 5 Angas visual */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">{t('panchangaTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {ANGA_KEYS.map((anga, i) => (
            <div key={i} className={`px-4 py-3 rounded-xl border border-gold-primary/15 text-center min-w-[100px] ${i === 4 ? 'bg-gold-primary/10 border-gold-primary/30 ring-1 ring-gold-primary/20' : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]'}`}>
              <div className={`font-bold text-sm ${anga.color}`} style={headingFont}>{t(anga.nameKey)}</div>
              <div className="text-text-tertiary text-xs mt-0.5">{t(anga.descKey)}</div>
            </div>
          ))}
        </div>
        <p className="text-text-tertiary text-xs text-center mt-3">{t('varaHighlightNote')}</p>
      </div>

      {/* India's Contribution: Why This Order? */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={headingFont}>
          {t('indiaGiftTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {t('indiaGiftDesc')}
        </p>

        {/* Step 1: Orbital Speed Order */}
        <div className="mb-6">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {t('step1Title')}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {t('step1Desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {ORBITAL_KEYS.map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                {i > 0 && <span className="text-text-tertiary text-xs mb-0.5">&rarr;</span>}
                <div className={`px-3 py-2 rounded-lg border ${p.border} text-center min-w-[70px]`}>
                  <div className={`font-bold text-xs ${p.color}`}>{t(p.key)}</div>
                  <div className="text-text-tertiary text-xs">{p.period}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-xs text-center">{t('orbitalCaption')}</p>
        </div>

        {/* Step 2: Hora System */}
        <div className="mb-6">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {t('step2Title')}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {t('step2Desc')}
          </p>

          {/* Hora table for Saturday-Sunday showing the derivation */}
          <div className="overflow-x-auto mb-3">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{t('saturdayHoras')}</div>
              <div className="flex flex-wrap gap-1 text-xs">
                {['Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma'].map((h, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded ${i === 0 ? 'bg-gold-primary/20 text-gold-light font-bold ring-1 ring-gold-primary/40' : 'bg-white/5 text-text-tertiary'}`}>
                    {i+1}:{h}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-xs">
                <span className="text-text-tertiary">{t('hora25th')}</span>
                <span className="text-amber-400 font-bold ml-1">{t('hora25thResult')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: The Derivation */}
        <div className="mb-6">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {t('step3Title')}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {t('step3Desc')}
          </p>

          {/* Visual: the skip-3 derivation */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <div className="text-center space-y-2 text-xs">
              <div className="text-text-tertiary">{t('orbitalOrderLabel')} <span className="text-slate-300">Sa</span> <span className="text-yellow-400">Ju</span> <span className="text-red-400">Ma</span> <span className="text-amber-400">Su</span> <span className="text-pink-300">Ve</span> <span className="text-emerald-400">Me</span> <span className="text-blue-300">Mo</span> (repeat)</div>
              <div className="text-text-secondary">{t('readEvery3rd')}</div>
              <div className="flex flex-wrap justify-center gap-2">
                {SKIP3_KEYS.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-gold-primary">&rarr;</span>}
                    <div className={`px-2.5 py-1.5 rounded-lg border ${d.border}`}>
                      <div className={`font-bold text-sm ${d.color}`}>{d.abbr}</div>
                      <div className="text-xs text-text-tertiary">{t(d.key)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gold-primary text-xs font-medium mt-2">
                {t('derivationResult')}
              </p>
            </div>
          </div>
        </div>

        {/* Historical context */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-indigo-500/15">
          <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-2">
            {t('historicalTitle')}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed space-y-2">
            <p>{t('historicalP1')}</p>
            <p>{t('historicalP2')}</p>
            <p className="text-indigo-300 font-medium">{t('historicalTip')}</p>
          </div>
        </div>

        {/* Cross-cultural names table */}
        <div className="mt-6 overflow-x-auto">
          <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>{t('crossCulturalTitle')}</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-2 text-gold-dark">{t('thPlanet')}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('thSanskrit')}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{t('thHindi')}</th>
                <th className="text-left py-2 px-2 text-gold-dark">English</th>
                <th className="text-left py-2 px-2 text-gold-dark">Latin/French</th>
                <th className="text-left py-2 px-2 text-gold-dark">Japanese</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {CROSS_CULTURAL.map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-1.5 px-2 text-text-secondary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sa}</td>
                  <td className="py-1.5 px-2 text-text-secondary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.hi}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.en}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.latin}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.jp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-2 text-center">{t('japaneseNote')}</p>
        </div>
      </div>

      {/* Day detail cards */}
      <div className="space-y-4">
        {VARA_STYLES.map((vara, i) => {
          const isToday = vara.day === todayDay;
          const varaName = t(`vara_${i}_name`);
          const natureTxt = t(`vara_${i}_nature`);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl border ${vara.border} overflow-hidden ${isToday ? 'ring-2 ring-gold-primary/30' : ''}`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 ${vara.bg}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-black ${vara.color}`} style={headingFont}>{varaName}</span>
                  <span className="text-text-secondary text-xs">{t(`vara_${i}_planet`)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isToday && <span className="px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light text-xs font-bold animate-pulse">{t('today')}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${natureTxt.includes('Cruel') || natureTxt.includes('क्रूर') || natureTxt.includes('கொடூர') || natureTxt.includes('క్రూర') || natureTxt.includes('ক্রূর') || natureTxt.includes('ಕ್ರೂರ') || natureTxt.includes('ક્રૂર') ? 'border-red-500/20 text-red-400' : natureTxt.includes('Benefic') || natureTxt.includes('शुभ') || natureTxt.includes('சுப') || natureTxt.includes('శుభ') || natureTxt.includes('শুভ') || natureTxt.includes('ಶುಭ') || natureTxt.includes('શુભ') ? 'border-emerald-500/20 text-emerald-400' : 'border-amber-500/20 text-amber-400'}`}>
                    {natureTxt}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Significance */}
                <p className="text-text-secondary text-xs leading-relaxed">{t(`vara_${i}_significance`)}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Favourable */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
                    <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">{t('favorableActivities')}</div>
                    <div className="text-text-secondary text-xs leading-relaxed">{t(`vara_${i}_activities`)}</div>
                  </div>
                  {/* Avoid */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
                    <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">{t('avoid')}</div>
                    <div className="text-text-secondary text-xs leading-relaxed">{t(`vara_${i}_avoid`)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span>{t('deity')}: <span className="text-gold-light">{t(`vara_${i}_deity`)}</span></span>
                  <span>{t('hora')}: <span className="text-text-secondary">{t(`vara_${i}_hora`)}</span></span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Vara in Muhurta */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-3" style={headingFont}>
          {t('muhurtaTitle')}
        </h3>
        <div className="text-text-secondary text-xs leading-relaxed space-y-2">
          <p>{t('muhurtaIntro')}</p>
          <ul className="space-y-1 ml-4">
            <li>&bull; {t('muhurtaRule1')}</li>
            <li>&bull; {t('muhurtaRule2')}</li>
            <li>&bull; {t('muhurtaRule3')}</li>
            <li>&bull; {t('muhurtaRule4')}</li>
            <li>&bull; {t('muhurtaRule5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
