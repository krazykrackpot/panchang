'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/patrika.json';

const FORMATS = [0, 1, 2] as const;
const SECTIONS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const STEPS = [0, 1, 2, 3, 4, 5] as const;
const OCCASIONS = [0, 1, 2, 3, 4] as const;
const FEATURES = [0, 1, 2, 3] as const;
const LINKS: { href: string; key: number }[] = [
  { href: '/learn/birth-chart', key: 0 },
  { href: '/learn/dashas', key: 1 },
  { href: '/learn/matching', key: 2 },
  { href: '/learn/yogas', key: 3 },
  { href: '/learn/tippanni', key: 4 },
];

export default function PatrikaPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const headingFont = getHeadingFont(locale);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
      </header>

      {/* 1. What is a Patrika */}
      <LessonSection number={1} title={t('whatTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('whatP1')}</p>
          <p>{t('whatP2')}</p>
        </div>
      </LessonSection>

      {/* 2. Traditional vs Modern */}
      <LessonSection number={2} title={t('traditionalTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('traditionalP1')}</p>
          <div className="space-y-3 mt-4">
            {FORMATS.map((i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {t(`format_${i}_name`)}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{t(`format_${i}_detail`)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 3. What's included */}
      <LessonSection number={3} title={t('contentsTitle')}>
        <div className="space-y-3">
          {SECTIONS.map((i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center text-gold-light text-xs font-bold">
                  {i + 1}
                </span>
                <h4 className="text-gold-light font-bold text-sm">{t(`section_${i}_name`)}</h4>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed ml-7">{t(`section_${i}_detail`)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 4. How to read */}
      <LessonSection number={4} title={t('howToReadTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('howToReadP1')}</p>
          <ol className="space-y-2 mt-3">
            {STEPS.map((i) => (
              <li key={i} className="flex gap-3 text-xs p-2 rounded-lg bg-bg-primary/30">
                <span className="text-gold-primary font-bold shrink-0">{i + 1}.</span>
                <span className="text-text-secondary">{t(`step_${i}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      </LessonSection>

      {/* 5. When you need it */}
      <LessonSection number={5} title={t('whenNeededTitle')}>
        <div className="space-y-3">
          {OCCASIONS.map((i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {t(`occasion_${i}_name`)}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">{t(`occasion_${i}_detail`)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 6. Export features */}
      <LessonSection number={6} title={t('exportTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('exportP1')}</p>
          <ul className="space-y-2 mt-3">
            {FEATURES.map((i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{t(`feature_${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={t('furtherTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {t(`link_${link.key}_label`)} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
