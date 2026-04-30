'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/transits.json';
import { getHeadingFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { TRANSIT_ARTICLES } from '@/lib/content/transit-articles';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const TRANSIT_DURATIONS = [
  { planetKey: 'td0Planet', durationKey: 'td0Duration', impactKey: 'td0Impact' },
  { planetKey: 'td1Planet', durationKey: 'td1Duration', impactKey: 'td1Impact' },
  { planetKey: 'td2Planet', durationKey: 'td2Duration', impactKey: 'td2Impact' },
  { planetKey: 'td3Planet', durationKey: 'td3Duration', impactKey: 'td3Impact' },
];

const ACTIVATION_FACTORS = [
  { factorKey: 'af0Factor', detailKey: 'af0Detail' },
  { factorKey: 'af1Factor', detailKey: 'af1Detail' },
  { factorKey: 'af2Factor', detailKey: 'af2Detail' },
  { factorKey: 'af3Factor', detailKey: 'af3Detail' },
];

const SAV_THRESHOLDS = [
  { rangeKey: 'sav0Range', meaningKey: 'sav0Meaning', color: 'text-emerald-400' },
  { rangeKey: 'sav1Range', meaningKey: 'sav1Meaning', color: 'text-amber-400' },
  { rangeKey: 'sav2Range', meaningKey: 'sav2Meaning', color: 'text-red-400' },
];

const RADAR_FEATURES = [
  { featureKey: 'rf0Feature', detailKey: 'rf0Detail' },
  { featureKey: 'rf1Feature', detailKey: 'rf1Detail' },
  { featureKey: 'rf2Feature', detailKey: 'rf2Detail' },
];

const FAVORABLE_ADVICE_KEYS = ['fav0', 'fav1', 'fav2'];
const CHALLENGING_ADVICE_KEYS = ['chal0', 'chal1', 'chal2', 'chal3'];
const DASHA_POINT_KEYS = ['dp0', 'dp1', 'dp2', 'dp3'];

const FURTHER_LINKS = [
  { href: '/learn/ashtakavarga', labelKey: 'fl0' },
  { href: '/learn/sade-sati', labelKey: 'fl1' },
  { href: '/learn/gochar', labelKey: 'fl2' },
  { href: '/learn/dashas', labelKey: 'fl3' },
  { href: '/learn/birth-chart', labelKey: 'fl4' },
];

const PLANET_COLORS: Record<number, string> = {
  0: '#FF9500', 1: '#C0C0C0', 2: '#F87171', 3: '#50C878',
  4: '#FFD700', 5: '#FF69B4', 6: '#6B8DD6', 7: '#B8860B', 8: '#808080',
};

export default function TransitsPage() {
  const locale = useLocale();
  const headingFont = getHeadingFont(locale);
  const isDevanagari = isDevanagariLocale(locale);
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const loc = (locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
  const articles = Object.values(TRANSIT_ARTICLES);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title', locale)}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle', locale)}</p>
      </header>

      {/* 1. What are transits */}
      <LessonSection number={1} title={t('whatTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('whatP1', locale)}</p>
          <p>{t('whatP2', locale)}</p>
        </div>
      </LessonSection>

      {/* 2. Slow planets */}
      <LessonSection number={2} title={t('slowPlanetsTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('slowPlanetsP1', locale)}</p>
          <div className="space-y-3 mt-4">
            {TRANSIT_DURATIONS.map((td, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gold-light font-bold text-sm">{t(td.planetKey, locale)}</span>
                  <span className="text-text-secondary/40 text-xs ml-auto">{t(td.durationKey, locale)}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{t(td.impactKey, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 3. How transits activate */}
      <LessonSection number={3} title={t('activationTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('activationP1', locale)}</p>
          <div className="space-y-3 mt-4">
            {ACTIVATION_FACTORS.map((af, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-xs mb-1">{t(af.factorKey, locale)}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{t(af.detailKey, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 4. Ashtakavarga */}
      <LessonSection number={4} title={t('ashtakavargaTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('ashtakavargaP1', locale)}</p>
          <div className="space-y-2 mt-4">
            {SAV_THRESHOLDS.map((s, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                <span className={`font-bold text-xs shrink-0 ${s.color}`}>{t(s.rangeKey, locale)}</span>
                <span className="text-text-secondary text-xs">{t(s.meaningKey, locale)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs">
            <Link href="/learn/ashtakavarga" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {t('ashtakavargaLink', locale)}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 5. Transit Radar */}
      <LessonSection number={5} title={t('radarTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('radarP1', locale)}</p>
          <div className="space-y-3 mt-4">
            {RADAR_FEATURES.map((rf, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-3">
                <h4 className="text-gold-light font-semibold text-xs mb-1">{t(rf.featureKey, locale)}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{t(rf.detailKey, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 6. Practical advice */}
      <LessonSection number={6} title={t('practicalTitle', locale)}>
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-3" style={headingFont}>
              {t('favorableLabel', locale)}
            </h4>
            <ul className="space-y-2">
              {FAVORABLE_ADVICE_KEYS.map((key, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-emerald-400 shrink-0 mt-0.5">&#x2022;</span>
                  <span className="text-text-secondary">{t(key, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 p-4">
            <h4 className="text-red-400 font-bold text-sm mb-3" style={headingFont}>
              {t('challengingLabel', locale)}
            </h4>
            <ul className="space-y-2">
              {CHALLENGING_ADVICE_KEYS.map((key, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-red-400 shrink-0 mt-0.5">&#x2022;</span>
                  <span className="text-text-secondary">{t(key, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LessonSection>

      {/* 7. Dasha interaction */}
      <LessonSection number={7} title={t('dashaInteractionTitle', locale)}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('dashaInteractionP1', locale)}</p>
          <ul className="space-y-2 mt-3">
            {DASHA_POINT_KEYS.map((key, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{t(key, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </LessonSection>

      {/* ═══ Transit Articles Index ═══ */}
      {articles.length > 0 && (
        <LessonSection title={locale === 'hi' ? 'गोचर विश्लेषण लेख' : 'Transit Analysis Articles'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {articles.map((article) => {
              const toRashi = RASHIS.find(r => r.id === article.toSignId);
              const fromRashi = RASHIS.find(r => r.id === article.fromSignId);
              const planetColor = PLANET_COLORS[article.planetId] || '#FFD700';
              const overview = article.overview[loc] || article.overview.en;
              const excerpt = overview.slice(0, 160).trimEnd() + '…';
              return (
                <Link
                  key={article.slug}
                  href={`/learn/transits/${article.slug}` as '/learn/transits/jupiter-in-cancer-2026'}
                  className="group block rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 p-5 transition-all duration-200"
                >
                  {/* Planet + sign icons */}
                  <div className="flex items-center gap-2 mb-3">
                    <GrahaIconById id={article.planetId} size={36} />
                    {fromRashi && (
                      <>
                        <span className="text-text-secondary/40 text-xs mx-1">→</span>
                        <RashiIconById id={article.toSignId} size={28} />
                      </>
                    )}
                    <span
                      className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full border"
                      style={{ color: planetColor, borderColor: `${planetColor}33` }}
                    >
                      {article.duration.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-gold-light font-bold text-sm leading-snug mb-1 group-hover:text-gold-primary transition-colors"
                    style={headingFont}
                  >
                    {article.title[loc] || article.title.en}
                  </h3>

                  {/* From → To */}
                  {fromRashi && toRashi && (
                    <p className="text-text-secondary/60 text-xs mb-2" style={bodyFont}>
                      {fromRashi.name[loc] || fromRashi.name.en}
                      {' → '}
                      {toRashi.name[loc] || toRashi.name.en}
                      {' · '}
                      {new Date(article.exactDate).toLocaleDateString(
                        locale === 'hi' ? 'hi-IN' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric' },
                      )}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-3" style={bodyFont}>
                    {excerpt}
                  </p>

                  <span className="mt-3 inline-block text-gold-primary/60 text-xs group-hover:text-gold-primary transition-colors">
                    {locale === 'hi' ? 'पूरा लेख पढ़ें →' : 'Read full article →'}
                  </span>
                </Link>
              );
            })}
          </div>
        </LessonSection>
      )}

      {/* Further learning */}
      <LessonSection title={t('furtherTitle', locale)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FURTHER_LINKS.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {t(link.labelKey, locale)} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
