'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { LOCALIZED_TRANSIT_ARTICLES, type LocalizedMoonSignEffect } from '@/lib/content/transit-articles-with-overlay';
import { RASHIS } from '@/lib/constants/rashis';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/types/panchang';

// Chrome labels per locale. en+hi authored consistently with the
// rest of the project; ta/te/bn/gu/kn/mai/mr arrive via the
// pre-commit Gemini overlay sync. Hindi serves as the canonical
// fallback for Maithili and Marathi (Devanagari sister languages)
// until the sync fills their own entries.
const CHROME: Record<string, Record<string, string>> = {
  en: {
    published: 'Published',
    keyThemes: 'Key Themes',
    howAffectsYou: 'How This Transit Affects You',
    findMoonSign: 'Find your Moon sign (Chandra Rashi) below. Transit effects are read from the Moon sign, not the ascendant.',
    yourSign: 'YOUR SIGN',
    dosAndDonts: "Dos & Don'ts",
    remedy: 'Remedy: ',
    keyDates: 'Key Dates',
    retroHeading: 'Retrograde Period  –  What to Know',
    viewTimeline: 'View Transit Timeline',
    generateKundali: 'Generate Your Kundali',
  },
  hi: {
    published: 'प्रकाशित',
    keyThemes: 'प्रमुख विषय',
    howAffectsYou: 'आपकी चन्द्र राशि पर प्रभाव',
    findMoonSign: 'नीचे अपनी चन्द्र राशि खोजें। गोचर फल चन्द्र राशि से पढ़ा जाता है, लग्न से नहीं।',
    yourSign: 'आपकी राशि',
    dosAndDonts: 'क्या करें और क्या न करें',
    remedy: 'उपाय: ',
    keyDates: 'महत्वपूर्ण तिथियाँ',
    retroHeading: 'वक्री गुरु  –  ध्यान दें',
    viewTimeline: 'गोचर टाइमलाइन देखें',
    generateKundali: 'अपनी कुण्डली बनाएँ',
  },
};
const c = (key: string, locale: string) => CHROME[locale]?.[key] ?? CHROME.en[key];

const INTL_LOCALE_TAGS: Record<string, string> = {
  en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
  bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', mai: 'mai-IN', mr: 'mr-IN',
};

// Render the ordinal house suffix per locale. EN uses 1st/2nd/3rd/Nth;
// Devanagari locales use वाँ भाव. Others fall back to EN until proper
// suffix tables are added — better than a wrong Hindi suffix.
function houseSuffix(house: number, locale: string): string {
  if (locale === 'hi' || locale === 'mai' || locale === 'mr' || locale === 'sa') return 'वाँ भाव';
  if (house === 1) return 'st house';
  if (house === 2) return 'nd house';
  if (house === 3) return 'rd house';
  return 'th house';
}

const PLANET_COLORS: Record<number, string> = {
  0: '#FF9500', 1: '#C0C0C0', 2: '#F87171', 3: '#50C878',
  4: '#FFD700', 5: '#FF69B4', 6: '#6B8DD6', 7: '#B8860B', 8: '#808080',
};

export default function TransitArticlePage() {
  const locale = useLocale() as Locale;
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const article = LOCALIZED_TRANSIT_ARTICLES[slug];
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const { birthRashi, isSet: hasBirthData, loadFromStorage } = useBirthDataStore();
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  const [expandedRashi, setExpandedRashi] = useState<number | null>(null);

  // Auto-expand user's Moon sign
  useEffect(() => {
    if (hasBirthData && birthRashi > 0 && expandedRashi === null) {
      setExpandedRashi(birthRashi);
      // Scroll to it after a short delay
      setTimeout(() => {
        const el = document.getElementById(`moon-sign-${birthRashi}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [hasBirthData, birthRashi, expandedRashi]);

  if (!article) return notFound();

  const planetColor = PLANET_COLORS[article.planetId] || '#FFD700';
  const toRashi = RASHIS.find(r => r.id === article.toSignId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* ═══ Hero ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <GrahaIconById id={article.planetId} size={56} />
          {toRashi && <RashiIconById id={toRashi.id} size={40} />}
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
          style={headingFont}
        >
          <span className="text-gold-gradient">{tl(article.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-sm mb-2" style={bodyFont}>
          {tl(article.duration, locale)}
        </p>
        <p className="text-text-secondary/60 text-xs">
          {c('published', locale)}{' '}
          {new Date(article.publishDate).toLocaleDateString(INTL_LOCALE_TAGS[locale] ?? 'en-US', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </motion.div>

      {/* ═══ Overview ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 mb-8"
      >
        <div className="prose-transit" style={bodyFont}>
          {tl(article.overview, locale).split('\n\n').map((para, i) => (
            <p
              key={i}
              className={`text-text-primary/90 text-sm sm:text-base leading-relaxed mb-4 last:mb-0 ${i === 0 ? 'first-letter:text-3xl first-letter:font-bold first-letter:text-gold-light first-letter:float-left first-letter:mr-1.5 first-letter:mt-0.5' : ''}`}
            >
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* ═══ General Themes ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
          <Sparkles className="inline-block w-5 h-5 mr-2 -mt-0.5 text-gold-primary" />
          {c('keyThemes', locale)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {article.generalThemes.map((theme, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border-l-2 border-gold-primary/30 border border-gold-primary/8 rounded-xl p-4"
            >
              <p className="text-text-primary/85 text-sm leading-relaxed" style={bodyFont}>
                {tl(theme, locale)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Moon Sign Effects ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {c('howAffectsYou', locale)}
        </h2>
        <p className="text-text-secondary text-xs mb-6" style={bodyFont}>
          {c('findMoonSign', locale)}
        </p>

        <div className="space-y-2">
          {article.moonSignEffects.map((effect: LocalizedMoonSignEffect) => {
            const rashi = RASHIS.find(r => r.id === effect.rashiId);
            const isExpanded = expandedRashi === effect.rashiId;
            const isUserSign = hasBirthData && birthRashi === effect.rashiId;

            return (
              <div
                key={effect.rashiId}
                id={`moon-sign-${effect.rashiId}`}
                className={`rounded-xl border transition-all ${
                  isUserSign
                    ? 'border-gold-primary/30 bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27]'
                    : 'border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/15 via-[#1a1040]/20 to-[#0a0e27]'
                }`}
              >
                {/* Accordion header */}
                <button
                  onClick={() => setExpandedRashi(isExpanded ? null : effect.rashiId)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <RashiIconById id={effect.rashiId} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-text-primary" style={headingFont}>
                        {rashi ? tl(rashi.name, locale) : ''}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark font-semibold">
                        {effect.house}{houseSuffix(effect.house, locale)}
                      </span>
                      {isUserSign && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light font-bold">
                          {c('yourSign', locale)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gold-primary/70 mt-0.5" style={bodyFont}>
                      {tl(effect.headline, locale)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-primary/50 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 pb-5 overflow-hidden"
                  >
                    {/* Body paragraphs */}
                    <div className="mb-4">
                      {tl(effect.body, locale).split('\n\n').map((para, i) => (
                        <p key={i} className="text-text-primary/80 text-sm leading-relaxed mb-3 last:mb-0" style={bodyFont}>
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Dos and Don'ts */}
                    <div className="bg-bg-primary/30 border border-gold-primary/8 rounded-lg p-4 mb-3">
                      <h4 className="text-xs font-bold text-gold-light mb-2 uppercase tracking-wider">
                        {c('dosAndDonts', locale)}
                      </h4>
                      <ul className="space-y-1.5">
                        {effect.dosAndDonts.map((item, i) => {
                          // Decide ✓/✗ from the EN authored text, not the
                          // translated string — translators don't keep the
                          // "Do " / "Don't" prefix uniformly, but the EN
                          // prefix is the source of truth.
                          const isDo = item.en.startsWith('Do ') || item.en.startsWith('Do\'');
                          return (
                            <li key={i} className="text-xs text-text-primary/70 leading-relaxed flex gap-2" style={bodyFont}>
                              <span className={isDo ? 'text-green-400' : 'text-amber-400'}>
                                {isDo ? '✓' : '✗'}
                              </span>
                              {tl(item, locale)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Remedy */}
                    <div className="bg-[#6366f1]/6 border border-[#6366f1]/15 rounded-lg p-3">
                      <p className="text-xs text-[#c4b5fd] leading-relaxed" style={bodyFont}>
                        <strong className="text-[#e0d4ff]">{c('remedy', locale)}</strong>
                        {tl(effect.remedy, locale)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ Key Dates ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
          <Calendar className="inline-block w-5 h-5 mr-2 -mt-0.5 text-gold-primary" />
          {c('keyDates', locale)}
        </h2>
        <div className="relative pl-8">
          <div
            className="absolute left-3 top-0 bottom-0 w-[2px]"
            style={{ background: `linear-gradient(to bottom, ${planetColor}40, ${planetColor}05)` }}
          />
          {article.keyDates.map((kd, i) => {
            const dateObj = new Date(kd.date + 'T12:00:00Z');
            const dateStr = dateObj.toLocaleDateString(INTL_LOCALE_TAGS[locale] ?? 'en-US', {
              day: 'numeric', month: 'short', timeZone: 'UTC',
            });
            const isPast = kd.date < new Date().toISOString().split('T')[0];
            return (
              <div key={i} className={`mb-4 relative ${isPast ? 'opacity-50' : ''}`}>
                <div
                  className="absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-bg-primary"
                  style={{ background: isPast ? '#8a8478' : planetColor }}
                />
                <div className="text-xs text-text-secondary font-semibold mb-0.5">{dateStr}</div>
                <div className="text-sm font-bold text-text-primary mb-0.5" style={headingFont}>{tl(kd.event, locale)}</div>
                <p className="text-xs text-text-secondary/70 leading-relaxed" style={bodyFont}>{tl(kd.significance, locale)}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ Retrograde Note ═══ */}
      {article.retrogradeNote && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-amber-500/6 border border-amber-500/20 rounded-2xl p-5 mb-10"
        >
          <h3 className="text-sm font-bold text-amber-400 mb-2" style={headingFont}>
            {c('retroHeading', locale)}
          </h3>
          <p className="text-xs text-text-primary/70 leading-relaxed" style={bodyFont}>
            {tl(article.retrogradeNote, locale)}
          </p>
        </motion.div>
      )}

      {/* ═══ Cross-links ═══ */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href={`/${locale}/transits`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-semibold hover:bg-gold-primary/20 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          {c('viewTimeline', locale)}
        </Link>
        <Link
          href={`/${locale}/kundali`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-semibold hover:bg-gold-primary/20 transition-colors"
        >
          {c('generateKundali', locale)}
        </Link>
      </div>
    </div>
  );
}
