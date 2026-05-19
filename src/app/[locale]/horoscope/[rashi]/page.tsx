// src/app/[locale]/horoscope/[rashi]/page.tsx
// NO 'use client'  –  this is a Server Component for SEO indexability

import { notFound } from 'next/navigation';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from './HoroscopeClient';
import { RashiArticle } from './RashiArticle';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { scoreLabel, getScoreBgClass } from '@/lib/horoscope/score-utils';
import { Link } from '@/lib/i18n/navigation';

function ordinal(n: number): string {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

export default async function RashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  // Generate today's horoscope server-side  –  this is the SSR content Google indexes
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date: today });

  const vedicName = rashi.name.hi || rashi.name.en;
  const westernName = rashi.name.en;
  const localeName = tl(rashi.name, locale);

  const isHi = isDevanagariLocale(locale);
  const ruler = tl(rashi.rulerName, locale);
  const element = tl(rashi.element, locale);

  // Transit summary for context
  const ts = horoscope.transitSummary;
  const moonTransit = tl(ts.moonTransitSignName, locale);
  const jupTransit = tl(ts.jupiterSignName, locale);
  const satTransit = tl(ts.saturnSignName, locale);

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* ═══ SSR: H1 + primary answer ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-bold text-gold-light text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi
            ? `${vedicName} राशिफल आज — ${today}`
            : `${vedicName} (${westernName}) Horoscope Today — ${today}`}
        </h1>

        {/* Primary answer paragraph — what Google shows in featured snippets */}
        <p suppressHydrationWarning className="text-text-primary text-base sm:text-lg mt-4 text-center leading-relaxed max-w-2xl mx-auto">
          {tl(horoscope.insight, locale)}
        </p>

        {/* ═══ SSR: Overall score + area scores as visual bars ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? 'आज का स्कोर' : "Today's Score"}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gold-light">{horoscope.overallScore}</span>
              <span className="text-text-secondary text-sm">/10</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${horoscope.overallScore >= 7 ? 'bg-emerald-500/20 text-emerald-400' : horoscope.overallScore >= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                {scoreLabel(horoscope.overallScore, locale)}
              </span>
            </div>
          </div>

          {/* Area score bars with text descriptions */}
          <div className="space-y-4">
            {([
              { key: 'career' as const, en: 'Career', hi: 'करियर' },
              { key: 'love' as const, en: 'Love', hi: 'प्रेम' },
              { key: 'health' as const, en: 'Health', hi: 'स्वास्थ्य' },
              { key: 'finance' as const, en: 'Finance', hi: 'वित्त' },
              { key: 'spirituality' as const, en: 'Spirituality', hi: 'आध्यात्म' },
            ]).map(({ key, en, hi }) => {
              const area = horoscope.areas[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-secondary text-sm font-medium">{isHi ? hi : en}</span>
                    <span className="text-gold-light text-sm font-semibold">{area.score}/10</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreBgClass(area.score)}`} style={{ width: `${area.score * 10}%` }} />
                  </div>
                  {/* Full area prediction text — this is the SEO-critical content */}
                  <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
                    {tl(area.text, locale)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ SSR: Transit Summary — rich astro context ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <h2 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'आज का ग्रह गोचर' : "Today's Planetary Transits"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'चन्द्र' : 'Moon'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{moonTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {isHi ? `${ts.moonHouseFromNatal}वाँ भाव` : `${ordinal(ts.moonHouseFromNatal)} house`}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'गुरु' : 'Jupiter'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{jupTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {isHi ? `${ts.jupiterHouse}वाँ भाव` : `${ordinal(ts.jupiterHouse)} house`}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'शनि' : 'Saturn'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{satTransit}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {isHi ? `${ts.saturnHouse}वाँ भाव` : `${ordinal(ts.saturnHouse)} house`}
              </div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'राहु' : 'Rahu'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(ts.rahuSignName, locale)}</div>
              <div className="text-text-secondary/60 text-xs mt-0.5">
                {isHi ? `${ts.rahuHouse}वाँ भाव` : `${ordinal(ts.rahuHouse)} house`}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SSR: Do's and Don'ts ═══ */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 rounded-2xl p-5">
            <h3 className="text-emerald-400 font-semibold mb-3">
              {isHi ? '✓ करें' : '✓ Do'}
            </h3>
            <ul className="space-y-2">
              {horoscope.dosAndDonts.dos.map((d, i) => (
                <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                  <span className="text-emerald-400/60 shrink-0">•</span>
                  <span>{tl(d, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20 rounded-2xl p-5">
            <h3 className="text-red-400 font-semibold mb-3">
              {isHi ? '✗ न करें' : '✗ Avoid'}
            </h3>
            <ul className="space-y-2">
              {horoscope.dosAndDonts.donts.map((d, i) => (
                <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                  <span className="text-red-400/60 shrink-0">•</span>
                  <span>{tl(d, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ SSR: Lucky Items + Remedy ═══ */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6">
          <h2 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'शुभ संकेत और उपाय' : 'Lucky Indicators & Remedy'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'शुभ रंग' : 'Lucky Colour'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(horoscope.luckyColor, locale)}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'शुभ अंक' : 'Lucky Number'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyNumber}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'शुभ समय' : 'Lucky Time'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyTime}</div>
            </div>
            <div className="text-center p-3 bg-white/[0.03] rounded-xl">
              <div className="text-text-secondary text-xs">{isHi ? 'शुभ दिशा' : 'Lucky Direction'}</div>
              <div className="text-gold-light text-sm font-semibold mt-1">{tl(horoscope.luckyDirection, locale)}</div>
            </div>
          </div>

          {/* Remedy */}
          <div className="border-t border-gold-primary/10 pt-4 mt-2">
            <h3 className="text-gold-light text-sm font-semibold mb-2">{isHi ? 'आज का उपाय' : "Today's Remedy"}</h3>
            <p className="text-amber-300/90 text-sm font-medium">{tl(horoscope.remedy.mantra, locale)}</p>
            <p className="text-text-secondary text-sm mt-1">{tl(horoscope.remedy.practical, locale)}</p>
          </div>
        </div>

        {/* ═══ SSR: Rashi info for SEO context ═══ */}
        <div className="mt-6 text-text-secondary text-sm leading-relaxed space-y-2">
          <p>
            {isHi
              ? `${vedicName} राशि (${westernName}) ${element} तत्व की राशि है जिसके स्वामी ${ruler} हैं। यह राशिफल ${vedicName} चन्द्र राशि (Moon Sign) वालों के लिए है — वैदिक ज्योतिष में चन्द्र राशि सबसे सटीक दैनिक भविष्यवाणी देती है।`
              : `${westernName} (${vedicName}) is a ${tl(rashi.element, 'en')} sign ruled by ${tl(rashi.rulerName, 'en')}. This horoscope is for ${westernName} Moon Sign — in Vedic astrology, the Moon sign provides the most accurate daily predictions based on actual planetary transits.`}
          </p>
        </div>

        {/* ═══ SSR: Internal links — related rashis + tools ═══ */}
        <nav className="mt-6 space-y-3" aria-label="Related horoscopes">
          <h3 className="text-gold-light text-sm font-semibold">{isHi ? 'अन्य राशिफल' : 'Other Rashis'}</h3>
          <div className="flex flex-wrap gap-2">
            {RASHIS.filter(r => r.id !== rashi.id).map(r => (
              <Link
                key={r.slug}
                href={`/horoscope/${r.slug}`}
                className="text-xs text-gold-primary/70 hover:text-gold-light transition-colors px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06]"
              >
                {tl(r.name, locale)}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'आज का पंचांग' : "Today's Panchang"}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'राहु काल' : 'Rahu Kaal'}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'होरा' : 'Hora'}
            </Link>
            <span className="text-text-secondary/30">·</span>
            <Link href="/charts" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'कुण्डली' : 'Kundali'}
            </Link>
          </div>
        </nav>
      </div>

      {/* Client island: interactive widget with full functionality */}
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} />

      {/* SSR: Static editorial content  –  always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
