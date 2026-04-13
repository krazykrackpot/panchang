'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown } from 'lucide-react';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/muhurtas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



export default function LearnMuhurtasPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const isDevanagari = isIndicLocale(locale);

  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedNight, setExpandedNight] = useState<number | null>(null);

  const daytime = MUHURTA_DATA.filter(m => m.period === 'day');
  const nighttime = MUHURTA_DATA.filter(m => m.period === 'night');

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400 border-emerald-500/20';
    if (nature === 'inauspicious') return 'text-red-400 border-red-500/20';
    return 'text-amber-400 border-amber-500/20';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('whatContent')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('astronomyContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Daytime Muhurta = (Sunset - Sunrise) / 15</p>
          <p className="text-gold-light font-mono text-sm mt-1">Nighttime Muhurta = (Next Sunrise - Sunset) / 15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">Equinox: ~48 min each | Summer day: ~55-60 min | Winter day: ~38-42 min</p>
        </div>
      </LessonSection>

      {/* Abhijit Muhurta */}
      <LessonSection title={t('abhijitTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('abhijitContent')}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/30">
          <p className="text-gold-light font-mono text-sm mb-1">
            {!isIndicLocale(locale) ? 'Abhijit Window Calculation:' : 'अभिजित् गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">Local Noon = (Sunrise + Sunset) / 2</p>
          <p className="text-gold-light/80 font-mono text-xs">Abhijit Start = Noon - (1 Muhurta Duration / 2)</p>
          <p className="text-gold-light/80 font-mono text-xs">Abhijit End = Noon + (1 Muhurta Duration / 2)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {!isIndicLocale(locale) ? 'Typically ~11:36 AM to 12:24 PM at equinox (varies by latitude/season)' : 'विषुव पर सामान्यतः ~11:36 से 12:24 (अक्षांश/ऋतु से भिन्न)'}
          </p>
        </div>
      </LessonSection>

      {/* Brahma Muhurta */}
      <LessonSection title={t('brahmaTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('brahmaContent')}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-indigo-400/20">
          <p className="text-indigo-300 font-mono text-sm mb-1">
            {!isIndicLocale(locale) ? 'Brahma Muhurta Timing:' : 'ब्रह्म मुहूर्त समय:'}
          </p>
          <p className="text-indigo-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Start = Sunrise - (2 × Night Muhurta Duration) ≈ 96 minutes before sunrise'
              : 'आरम्भ = सूर्योदय - (2 × रात्रि मुहूर्त अवधि) ≈ सूर्योदय से 96 मिनट पहले'}
          </p>
          <p className="text-indigo-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'End = Sunrise — the period ends exactly at dawn'
              : 'समाप्ति = सूर्योदय — यह अवधि ठीक भोर में समाप्त होती है'}
          </p>
          <p className="text-indigo-200/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'At equinox: ~4:24 AM to 6:00 AM | Summer: ~3:30 AM to 5:00 AM | Winter: ~5:20 AM to 7:00 AM'
              : 'विषुव: ~4:24 से 6:00 | ग्रीष्म: ~3:30 से 5:00 | शीत: ~5:20 से 7:00'}
          </p>
        </div>
      </LessonSection>

      {/* Rahu Kaal, Yamaganda, Gulika */}
      <LessonSection title={t('rahuKaalTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('rahuKaalContent')}
        </p>
        <div className="mt-4 overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-red-500/15">
          <p className="text-red-300 text-xs uppercase tracking-widest font-bold mb-3">
            {!isIndicLocale(locale) ? 'Weekday Segment Positions (1-8 of daytime)' : 'सप्ताह के दिन खण्ड स्थिति (दिवा 1-8)'}
          </p>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-red-500/15">
              <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Day' : 'दिन'}</th>
              <th className="text-left py-2 px-2 text-red-300">{!isIndicLocale(locale) ? 'Rahu Kaal' : 'राहु काल'}</th>
              <th className="text-left py-2 px-2 text-amber-300">{!isIndicLocale(locale) ? 'Yamaganda' : 'यमगण्ड'}</th>
              <th className="text-left py-2 px-2 text-purple-300">{!isIndicLocale(locale) ? 'Gulika' : 'गुलिक'}</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Sunday' : 'रवि'}</td><td className="py-1.5 px-2">8th</td><td className="py-1.5 px-2">5th</td><td className="py-1.5 px-2">7th</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Monday' : 'सोम'}</td><td className="py-1.5 px-2">2nd</td><td className="py-1.5 px-2">4th</td><td className="py-1.5 px-2">6th</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Tuesday' : 'मंगल'}</td><td className="py-1.5 px-2">7th</td><td className="py-1.5 px-2">3rd</td><td className="py-1.5 px-2">5th</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Wednesday' : 'बुध'}</td><td className="py-1.5 px-2">5th</td><td className="py-1.5 px-2">2nd</td><td className="py-1.5 px-2">4th</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Thursday' : 'गुरु'}</td><td className="py-1.5 px-2">6th</td><td className="py-1.5 px-2">1st</td><td className="py-1.5 px-2">3rd</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Friday' : 'शुक्र'}</td><td className="py-1.5 px-2">4th</td><td className="py-1.5 px-2">7th</td><td className="py-1.5 px-2">2nd</td></tr>
              <tr><td className="py-1.5 px-2">{!isIndicLocale(locale) ? 'Saturday' : 'शनि'}</td><td className="py-1.5 px-2">3rd</td><td className="py-1.5 px-2">6th</td><td className="py-1.5 px-2">1st</td></tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Choghadiya */}
      <LessonSection title={t('choghadiyaTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('choghadiyaContent')}
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Amrit', planet: !isIndicLocale(locale) ? 'Jupiter' : 'गुरु', nature: 'best', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
            { name: 'Shubh', planet: !isIndicLocale(locale) ? 'Venus' : 'शुक्र', nature: 'good', color: 'text-emerald-300 border-emerald-500/15 bg-emerald-500/3' },
            { name: 'Labh', planet: !isIndicLocale(locale) ? 'Mercury' : 'बुध', nature: 'good', color: 'text-green-300 border-green-500/15 bg-green-500/3' },
            { name: 'Char', planet: !isIndicLocale(locale) ? 'Moon' : 'चन्द्र', nature: 'travel', color: 'text-amber-300 border-amber-500/15 bg-amber-500/3' },
            { name: 'Udveg', planet: !isIndicLocale(locale) ? 'Sun' : 'सूर्य', nature: 'avoid', color: 'text-red-300 border-red-500/15 bg-red-500/3' },
            { name: 'Kaal', planet: !isIndicLocale(locale) ? 'Saturn' : 'शनि', nature: 'avoid', color: 'text-red-400 border-red-500/20 bg-red-500/5' },
            { name: 'Rog', planet: !isIndicLocale(locale) ? 'Mars' : 'मंगल', nature: 'avoid', color: 'text-red-300 border-red-500/15 bg-red-500/3' },
          ].map((ch) => (
            <div key={ch.name} className={`rounded-lg border p-3 ${ch.color}`}>
              <p className="font-bold text-sm">{ch.name}</p>
              <p className="text-xs opacity-70">{ch.planet}</p>
              <p className="text-xs uppercase tracking-wider mt-1 opacity-50">{ch.nature}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Hora */}
      <LessonSection title={t('horaTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('horaContent')}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Chaldean Order (descending orbital period):' : 'कल्डियन क्रम (अवरोही कक्षा अवधि):'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon → (repeat)'
              : 'शनि → गुरु → मंगल → सूर्य → शुक्र → बुध → चन्द्र → (पुनः)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-3">
            {!isIndicLocale(locale) ? 'Why does Sunday follow Saturday?' : 'शनिवार के बाद रविवार क्यों?'}
          </p>
          <p className="text-gold-light/50 font-mono text-xs">
            {locale === 'en'
              ? 'Saturday 1st hora = Saturn. Count 24 horas through the Chaldean cycle → 25th hora (= next day\'s 1st) = Sun → Sunday!'
              : 'शनिवार की 1ली होरा = शनि। 24 होरा गिनें → 25वीं (= अगले दिन की 1ली) = सूर्य → रविवार!'}
          </p>
        </div>
      </LessonSection>

      {/* Selecting Best Time */}
      <LessonSection title={t('selectingTitle')}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {t('selectingContent')}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-emerald-400/20">
          <p className="text-emerald-300 font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Quick Muhurta Checklist:' : 'त्वरित मुहूर्त जाँचसूची:'}
          </p>
          <div className="space-y-1">
            {(locale === 'en'
              ? [
                  '1. No eclipse, no Adhika Masa',
                  '2. Appropriate Tithi for the activity',
                  '3. Suitable Nakshatra (Fixed/Movable/Dual)',
                  '4. No Vyatipata or Vaidhriti Yoga',
                  '5. Matching Vara (weekday planet)',
                  '6. Outside Rahu Kaal, Yamaganda, Gulika',
                  '7. Favorable Choghadiya (Amrit/Shubh/Labh)',
                  '8. Correct Hora for the activity type',
                ]
              : [
                  '1. कोई ग्रहण नहीं, अधिक मास नहीं',
                  '2. कार्य के लिए उचित तिथि',
                  '3. उपयुक्त नक्षत्र (स्थिर/चर/द्वि)',
                  '4. व्यतीपात या वैधृति योग नहीं',
                  '5. मेल खाता वार (सप्ताह का दिन)',
                  '6. राहु काल, यमगण्ड, गुलिक से बाहर',
                  '7. अनुकूल चौघड़िया (अमृत/शुभ/लाभ)',
                  '8. कार्य प्रकार के लिए सही होरा',
                ]
            ).map((step) => (
              <p key={step} className="text-emerald-200/80 font-mono text-xs">{step}</p>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 30 Muhurtas List */}
      <LessonSection title={t('completeList')}>
        <h4 className="text-lg text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {!isIndicLocale(locale) ? 'Daytime Muhurtas (1-15)' : isDevanagari ? 'दिवा मुहूर्त (1-15)' : 'दिवामुहूर्ताः (1-15)'}
        </h4>
        <div className="space-y-3 mb-10">
          {daytime.map((m, i) => {
            const isExpanded = expandedDay === m.number;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${m.number === 8 ? 'border-gold-primary/40 ring-1 ring-gold-primary/20' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gold-primary font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{tObj(m.name)}</span>
                        {m.number === 8 && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-xs rounded-full font-bold uppercase">Abhijit</span>}
                        <span className="ml-2 text-text-secondary/70 text-xs">{tObj(m.deity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? (!isIndicLocale(locale) ? 'Auspicious' : 'शुभ') : (!isIndicLocale(locale) ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {tObj(m.significance)}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {!isIndicLocale(locale) ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tObj(m.bestFor)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <h4 className="text-lg text-indigo-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {!isIndicLocale(locale) ? 'Nighttime Muhurtas (16-30)' : isDevanagari ? 'रात्रि मुहूर्त (16-30)' : 'रात्रिमुहूर्ताः (16-30)'}
        </h4>
        <div className="space-y-3">
          {nighttime.map((m, i) => {
            const isExpanded = expandedNight === m.number;
            const isBrahma = m.number === 26 || m.number === 27;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${isBrahma ? 'border-indigo-400/30 ring-1 ring-indigo-400/15' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedNight(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-300/80 font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{tObj(m.name)}</span>
                        {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold">{!isIndicLocale(locale) ? 'BRAHMA' : 'ब्राह्म'}</span>}
                        <span className="ml-2 text-text-secondary/70 text-xs">{tObj(m.deity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? (!isIndicLocale(locale) ? 'Auspicious' : 'शुभ') : (!isIndicLocale(locale) ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {tObj(m.significance)}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {!isIndicLocale(locale) ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tObj(m.bestFor)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Links */}
      <div className="mt-8 space-y-3">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {!isIndicLocale(locale) ? 'Explore Further' : 'और जानें'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: !isIndicLocale(locale) ? 'Muhurta AI — Find Auspicious Times' : 'मुहूर्त AI — शुभ समय खोजें', href: '/muhurta-ai', color: 'border-emerald-500/20 hover:border-emerald-500/40' },
            { label: !isIndicLocale(locale) ? 'Daily Panchang' : 'दैनिक पंचांग', href: '/panchang', color: 'border-gold-primary/20 hover:border-gold-primary/40' },
            { label: !isIndicLocale(locale) ? 'Muhurta Wheel & Conflict Analysis' : 'मुहूर्त चक्र और विरोध विश्लेषण', href: '/panchang/muhurta', color: 'border-gold-primary/20 hover:border-gold-primary/40' },
            { label: !isIndicLocale(locale) ? 'Module 17-1: Muhurta Foundations' : 'मॉड्यूल 17-1: मुहूर्त आधार', href: '/learn/modules/17-1', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: !isIndicLocale(locale) ? 'Module 17-2: Activity-Specific Rules' : 'मॉड्यूल 17-2: कार्य-विशिष्ट नियम', href: '/learn/modules/17-2', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: !isIndicLocale(locale) ? 'Module 17-3: Chandra & Tara Balam' : 'मॉड्यूल 17-3: चन्द्र और तारा बलम', href: '/learn/modules/17-3', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: !isIndicLocale(locale) ? 'Module 17-4: Panchaka & Lagna Shuddhi' : 'मॉड्यूल 17-4: पंचक और लग्न शुद्धि', href: '/learn/modules/17-4', color: 'border-blue-500/20 hover:border-blue-500/40' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border ${link.color} transition-colors text-sm text-gold-light hover:bg-gold-primary/5`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
