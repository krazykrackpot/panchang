'use client';

import { useMemo } from 'react';
import { Info, Gem, BookOpen, Heart, Calendar, Sparkles, Shield, CheckCircle } from 'lucide-react';
import type { RemedySection, RemedyItem } from '@/lib/kundali/tippanni-types';
import type { DomainReading, DomainRemedy, DomainType } from '@/lib/kundali/domain-synthesis/types';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import { tl } from '@/lib/utils/trilingual';
import { generateActionPlan } from '@/lib/kundali/domain-synthesis/narrator-v2';
import { GEMSTONE_COLORS } from '@/lib/remedies/gemstone-engine';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SummaryRemediesProps {
  remedies: RemedySection;
  domains: DomainReading[];
  remedyNote?: string;
  locale: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SECTION_CLS =
  'rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8';

const ITEM_CLS =
  'p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5';

const isDevLocale = (l: string) => l === 'hi' || l === 'sa';

/** Planet name -> planet ID lookup for gemstone color dots */
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  // Hindi variants
  'सूर्य': 0, 'चन्द्र': 1, 'मंगल': 2, 'बुध': 3, 'गुरु': 4,
  'शुक्र': 5, 'शनि': 6, 'राहु': 7, 'केतु': 8,
};

const REMEDY_TYPE_ICON: Record<DomainRemedy['type'], typeof Gem> = {
  gemstone: Gem,
  mantra: BookOpen,
  charity: Heart,
  ritual: Sparkles,
  lifestyle: Shield,
};

const REMEDY_TYPE_LABEL: Record<DomainRemedy['type'], { en: string; hi: string }> = {
  gemstone: { en: 'Gemstone', hi: 'रत्न' },
  mantra: { en: 'Mantra', hi: 'मन्त्र' },
  charity: { en: 'Charity', hi: 'दान' },
  ritual: { en: 'Ritual', hi: 'अनुष्ठान' },
  lifestyle: { en: 'Lifestyle', hi: 'जीवनशैली' },
};

const DIFFICULTY_BADGE: Record<DomainRemedy['difficulty'], { label: string; cls: string }> = {
  easy: { label: 'Easy', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  moderate: { label: 'Moderate', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  intensive: { label: 'Intensive', cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
};

function domainLabel(domain: DomainType, locale: string): string {
  const cfg = getDomainConfig(domain);
  if (cfg) return tl(cfg.name, locale);
  // Fallback: capitalize
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ClassicalRemedyColumn({
  title,
  items,
  locale,
  renderExtra,
}: {
  title: string;
  items: RemedyItem[];
  locale: string;
  renderExtra?: (item: RemedyItem) => React.ReactNode;
}) {
  if (items.length === 0) return null;
  const isDev = isDevLocale(locale);

  return (
    <div>
      <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className={ITEM_CLS}>
            <div className="flex items-center gap-2">
              {renderExtra?.(item)}
              <p
                className="text-gold-light text-sm font-semibold"
                style={isDev ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {item.name}
              </p>
            </div>
            <p className="text-text-secondary/70 text-xs mt-0.5">
              {locale === 'hi' || locale === 'sa' ? 'के लिए' : 'For'}: {item.planet}
            </p>
            <p className="text-text-secondary text-xs mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SummaryRemedies({ remedies, domains, remedyNote, locale }: SummaryRemediesProps) {
  const isEn = locale === 'en' || locale === 'ta' || locale === 'bn';
  const isDev = isDevLocale(locale);

  // Filter domains that have remedies
  const domainsWithRemedies = useMemo(
    () => domains.filter((d) => d.remedies.length > 0),
    [domains],
  );

  // ActionPlan is generated on-the-fly from DomainReading, not stored on it
  const actionPlans = useMemo(
    () =>
      domainsWithRemedies.map((d) => ({
        domain: d.domain,
        plan: generateActionPlan(d, locale),
      })),
    [domainsWithRemedies, locale],
  );

  // Merge action plans into a single consolidated plan (first domain's plan as primary)
  const primaryPlan = actionPlans.length > 0 ? actionPlans[0].plan : null;

  const hasClassical =
    remedies.gemstones.length > 0 ||
    remedies.mantras.length > 0 ||
    remedies.practices.length > 0;

  const hasAnything = hasClassical || domainsWithRemedies.length > 0 || remedyNote;

  if (!hasAnything) return null;

  return (
    <div className="space-y-6">
      {/* ===== 1. Life Stage Advisory ===== */}
      {remedyNote && (
        <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p
            className="text-text-primary text-sm leading-relaxed"
            style={isDev ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {remedyNote}
          </p>
        </div>
      )}

      {/* ===== 2. By Planet — Classical ===== */}
      {hasClassical && (
        <section className={SECTION_CLS}>
          <h3 className="text-xl text-gold-light font-semibold mb-6">
            {isEn ? 'Classical Remedies by Planet' : 'ग्रह आधारित शास्त्रीय उपाय'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClassicalRemedyColumn
              title={isEn ? 'Gemstones' : 'रत्न'}
              items={remedies.gemstones}
              locale={locale}
              renderExtra={(item) => {
                const pid = PLANET_NAME_TO_ID[item.planet];
                const color = pid != null ? GEMSTONE_COLORS[pid] : '#d4a853';
                return (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/20"
                    style={{ backgroundColor: color }}
                  />
                );
              }}
            />
            <ClassicalRemedyColumn
              title={isEn ? 'Mantras' : 'मन्त्र'}
              items={remedies.mantras}
              locale={locale}
            />
            <ClassicalRemedyColumn
              title={isEn ? 'Charitable Practices' : 'दानशील कार्य'}
              items={remedies.practices}
              locale={locale}
            />
          </div>
        </section>
      )}

      {/* ===== 3. By Life Area — Practical ===== */}
      {domainsWithRemedies.length > 0 && (
        <section className={SECTION_CLS}>
          <h3 className="text-xl text-gold-light font-semibold mb-6">
            {isEn ? 'Practical Remedies by Life Area' : 'जीवन क्षेत्र अनुसार व्यावहारिक उपाय'}
          </h3>
          <div className="space-y-6">
            {domainsWithRemedies.map((dr) => (
              <div key={dr.domain}>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">
                  {domainLabel(dr.domain, locale)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dr.remedies.map((rem, i) => {
                    const Icon = REMEDY_TYPE_ICON[rem.type];
                    const typeLabel = REMEDY_TYPE_LABEL[rem.type];
                    const badge = DIFFICULTY_BADGE[rem.difficulty];
                    return (
                      <div key={i} className={ITEM_CLS}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-gold-primary/60 shrink-0" />
                          <p className="text-gold-light text-sm font-semibold">
                            {tl(rem.name, locale)}
                          </p>
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.5 rounded border ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-text-secondary/70 text-xs mb-1">
                          {isEn ? typeLabel.en : typeLabel.hi}
                          {rem.targetPlanetId != null && (
                            <> &middot; {isEn ? 'Planet' : 'ग्रह'} #{rem.targetPlanetId}</>
                          )}
                        </p>
                        <p className="text-text-secondary text-xs leading-relaxed">
                          {tl(rem.instructions, locale)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 4. This Week's Action Plan ===== */}
      {primaryPlan && (
        <section className={SECTION_CLS}>
          <h3 className="text-xl text-gold-light font-semibold mb-6">
            {isEn ? "This Week's Action Plan" : 'इस सप्ताह की कार्य योजना'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Lifestyle guidance */}
            <div className={ITEM_CLS}>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="text-gold-dark text-sm uppercase tracking-wider">
                  {isEn ? 'Lifestyle' : 'जीवनशैली'}
                </h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tl(primaryPlan.lifestyle, locale)}
              </p>
            </div>

            {/* Best days */}
            {primaryPlan.bestDays.length > 0 && (
              <div className={ITEM_CLS}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gold-primary" />
                  <h4 className="text-gold-dark text-sm uppercase tracking-wider">
                    {isEn ? 'Best Days' : 'शुभ दिन'}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {primaryPlan.bestDays.map((day, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid */}
            <div className={ITEM_CLS}>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-rose-400" />
                <h4 className="text-gold-dark text-sm uppercase tracking-wider">
                  {isEn ? 'Avoid' : 'सावधानी'}
                </h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tl(primaryPlan.avoid, locale)}
              </p>
            </div>

            {/* Weekly practice */}
            <div className={ITEM_CLS}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-gold-dark text-sm uppercase tracking-wider">
                  {isEn ? 'Weekly Practice' : 'साप्ताहिक अभ्यास'}
                </h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tl(primaryPlan.weeklyPractice, locale)}
              </p>
            </div>
          </div>

          {/* Affirmation — full width */}
          <div className="mt-5 p-4 rounded-lg bg-gradient-to-r from-gold-primary/5 to-transparent border border-gold-primary/10 text-center">
            <p className="text-text-secondary/60 text-xs uppercase tracking-widest mb-2">
              {isEn ? 'Daily Affirmation' : 'दैनिक प्रतिज्ञा'}
            </p>
            <p
              className="text-gold-light text-base italic leading-relaxed"
              style={isDev ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
            >
              &ldquo;{tl(primaryPlan.affirmation, locale)}&rdquo;
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
