'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { YOGAS } from '@/lib/constants/yogas';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown, Crown, Coins, Star, AlertTriangle, Sparkles } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/yogas.json';

const t_ = L as unknown as Record<string, LocaleText>;

// ─── Kundali Yoga data (Raja, Dhana, Mahapurusha, etc.) ─────────────────────
interface KYogaDef { id: string; nameKey: string; category: string; planets: string; conditionKey: string; effectKey: string; classical: string; strength: 'rare' | 'common' | 'moderate'; auspicious: boolean; }

const KY_CATEGORIES = [
  { key: 'mahapurusha', labelKey: 'cat_mahapurusha_label', icon: Crown, color: 'text-amber-400', descKey: 'cat_mahapurusha_desc' },
  { key: 'raja', labelKey: 'cat_raja_label', icon: Crown, color: 'text-gold-light', descKey: 'cat_raja_desc' },
  { key: 'dhana', labelKey: 'cat_dhana_label', icon: Coins, color: 'text-emerald-400', descKey: 'cat_dhana_desc' },
  { key: 'chandra', labelKey: 'cat_chandra_label', icon: Star, color: 'text-blue-300', descKey: 'cat_chandra_desc' },
  { key: 'special', labelKey: 'cat_special_label', icon: Sparkles, color: 'text-violet-400', descKey: 'cat_special_desc' },
  { key: 'inauspicious', labelKey: 'cat_inauspicious_label', icon: AlertTriangle, color: 'text-red-400', descKey: 'cat_inauspicious_desc' },
];

const KY_DATA: KYogaDef[] = [
  { id: 'ruchaka', category: 'mahapurusha', nameKey: 'yoga_ruchaka_name', planets: 'Mars', conditionKey: 'yoga_ruchaka_condition', effectKey: 'yoga_ruchaka_effect', classical: 'BPHS Ch.34', strength: 'rare', auspicious: true },
  { id: 'bhadra', category: 'mahapurusha', nameKey: 'yoga_bhadra_name', planets: 'Mercury', conditionKey: 'yoga_bhadra_condition', effectKey: 'yoga_bhadra_effect', classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'hamsa', category: 'mahapurusha', nameKey: 'yoga_hamsa_name', planets: 'Jupiter', conditionKey: 'yoga_hamsa_condition', effectKey: 'yoga_hamsa_effect', classical: 'BPHS Ch.34', strength: 'rare', auspicious: true },
  { id: 'malavya', category: 'mahapurusha', nameKey: 'yoga_malavya_name', planets: 'Venus', conditionKey: 'yoga_malavya_condition', effectKey: 'yoga_malavya_effect', classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'shasha', category: 'mahapurusha', nameKey: 'yoga_shasha_name', planets: 'Saturn', conditionKey: 'yoga_shasha_condition', effectKey: 'yoga_shasha_effect', classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'dharma_karma', category: 'raja', nameKey: 'yoga_dharma_karma_name', planets: '9th+10th lords', conditionKey: 'yoga_dharma_karma_condition', effectKey: 'yoga_dharma_karma_effect', classical: 'BPHS Ch.34 v.15', strength: 'rare', auspicious: true },
  { id: 'adhi', category: 'raja', nameKey: 'yoga_adhi_name', planets: 'Benefics 6/7/8 from Moon', conditionKey: 'yoga_adhi_condition', effectKey: 'yoga_adhi_effect', classical: 'Phaladeepika Ch.6 v.10', strength: 'rare', auspicious: true },
  { id: 'lakshmi', category: 'dhana', nameKey: 'yoga_lakshmi_name', planets: '9th+Lagna lords', conditionKey: 'yoga_lakshmi_condition', effectKey: 'yoga_lakshmi_effect', classical: 'BPHS Ch.36 v.4', strength: 'rare', auspicious: true },
  { id: 'gajakesari', category: 'dhana', nameKey: 'yoga_gajakesari_name', planets: 'Jupiter+Moon', conditionKey: 'yoga_gajakesari_condition', effectKey: 'yoga_gajakesari_effect', classical: 'Phaladeepika Ch.6 v.1', strength: 'common', auspicious: true },
  { id: 'sunafa', category: 'chandra', nameKey: 'yoga_sunafa_name', planets: 'Planet 2nd from Moon', conditionKey: 'yoga_sunafa_condition', effectKey: 'yoga_sunafa_effect', classical: 'Phaladeepika Ch.6 v.3', strength: 'common', auspicious: true },
  { id: 'kemadruma', category: 'chandra', nameKey: 'yoga_kemadruma_name', planets: 'Moon isolated', conditionKey: 'yoga_kemadruma_condition', effectKey: 'yoga_kemadruma_effect', classical: 'Phaladeepika Ch.6 v.8', strength: 'common', auspicious: false },
  { id: 'neechabhanga', category: 'special', nameKey: 'yoga_neechabhanga_name', planets: 'Debilitated planet', conditionKey: 'yoga_neechabhanga_condition', effectKey: 'yoga_neechabhanga_effect', classical: 'BPHS Ch.34 v.22', strength: 'rare', auspicious: true },
  { id: 'viparita', category: 'special', nameKey: 'yoga_viparita_name', planets: '6/8/12 lords', conditionKey: 'yoga_viparita_condition', effectKey: 'yoga_viparita_effect', classical: 'BPHS Ch.35 v.7', strength: 'moderate', auspicious: true },
  { id: 'parivartana', category: 'special', nameKey: 'yoga_parivartana_name', planets: '2 planets exchanging', conditionKey: 'yoga_parivartana_condition', effectKey: 'yoga_parivartana_effect', classical: 'BPHS Ch.35', strength: 'moderate', auspicious: true },
  { id: 'kala_sarpa', category: 'inauspicious', nameKey: 'yoga_kala_sarpa_name', planets: 'All between Rahu-Ketu', conditionKey: 'yoga_kala_sarpa_condition', effectKey: 'yoga_kala_sarpa_effect', classical: 'Manasagari', strength: 'moderate', auspicious: false },
  { id: 'guru_chandal', category: 'inauspicious', nameKey: 'yoga_guru_chandal_name', planets: 'Jupiter+Rahu', conditionKey: 'yoga_guru_chandal_condition', effectKey: 'yoga_guru_chandal_effect', classical: 'BPHS Ch.35', strength: 'common', auspicious: false },
];

function KundaliYogasSection({ locale }: { locale: string }) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedCategory, setExpandedCategory] = useState<string | null>('mahapurusha');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);
  const t = (key: string) => lt(t_[key], locale);

  return (
    <div className="mt-12 space-y-8">
      <div className="border-t border-gold-primary/15 pt-8">
        <h2 className="text-2xl font-bold text-gold-gradient mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('kundaliYogasTitle')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {t('kundaliYogasDesc')}
        </p>
      </div>

      {/* How Yogas Form */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h3 className="text-gold-light font-bold text-lg mb-3" style={headingFont}>{t('howYogasForm')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { typeKey: 'formConjunction', descKey: 'formConjunctionDesc', icon: '\u2295' },
            { typeKey: 'formAspect', descKey: 'formAspectDesc', icon: '\u25C8' },
            { typeKey: 'formExchange', descKey: 'formExchangeDesc', icon: '\u21C4' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gold-light font-bold text-sm mb-1">{t(item.typeKey)}</div>
              <div className="text-text-secondary text-xs">{t(item.descKey)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* House classification */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{t('houseClassification')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 font-bold mb-1">{t('kendras')} (1, 4, 7, 10)</div>
            <div className="text-text-secondary leading-relaxed">{t('kendrasDesc')}</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold mb-1">{t('trikonas')} (1, 5, 9)</div>
            <div className="text-text-secondary leading-relaxed">{t('trikonasDesc')}</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="text-red-400 font-bold mb-1">{t('dusthanas')} (6, 8, 12)</div>
            <div className="text-text-secondary leading-relaxed">{t('dusthanasDesc')}</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="text-amber-400 font-bold mb-1">{t('upachayas')} (3, 6, 10, 11)</div>
            <div className="text-text-secondary leading-relaxed">{t('upachayasDesc')}</div>
          </div>
        </div>
      </div>

      {/* Yoga categories with accordions */}
      {KY_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const yogasInCat = KY_DATA.filter(y => y.category === cat.key);
        const isExpanded = expandedCategory === cat.key;
        return (
          <div key={cat.key} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
            <button onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${cat.color}`} />
                <div className="text-left">
                  <div className={`font-bold text-lg ${cat.color}`} style={headingFont}>{t(cat.labelKey)}</div>
                  <div className="text-text-secondary text-xs">{yogasInCat.length} {t('yogasCount')}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 pb-4 border-t border-gold-primary/10 pt-4">
                    <p className="text-text-secondary text-sm leading-relaxed">{t(cat.descKey)}</p>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {yogasInCat.map((yoga) => {
                      const isYE = expandedYoga === yoga.id;
                      return (
                        <div key={yoga.id} className={`rounded-xl border ${yoga.auspicious ? 'border-emerald-500/15' : 'border-red-500/15'} overflow-hidden`}>
                          <button onClick={() => setExpandedYoga(isYE ? null : yoga.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/3 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${yoga.auspicious ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span className="text-gold-light font-bold text-sm" style={headingFont}>{t(yoga.nameKey)}</span>
                              <span className="text-text-tertiary text-xs">{yoga.planets}</span>
                              {yoga.strength === 'rare' && <span className="px-1.5 py-0.5 rounded text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20">{t('rare')}</span>}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isYE ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isYE && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="px-4 pb-4 space-y-3">
                                  <div><div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">{t('formationRule')}</div><div className="text-text-secondary text-xs leading-relaxed">{t(yoga.conditionKey)}</div></div>
                                  <div><div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">{t('effects')}</div><div className="text-text-secondary text-xs leading-relaxed">{t(yoga.effectKey)}</div></div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-text-tertiary text-xs">{yoga.classical}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${yoga.auspicious ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>{yoga.auspicious ? t('auspicious') : t('inauspicious')}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center">
        <h3 className="text-gold-light font-bold text-lg mb-2" style={headingFont}>{t('checkYogasCta')}</h3>
        <p className="text-text-secondary text-xs mb-4">{t('checkYogasDesc')}</p>
        <a href={`/${locale}/kundali`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors text-sm">{t('generateKundali')}</a>
      </div>
    </div>
  );
}

export default function LearnYogasPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt(t_[key], locale);

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('yogasTitle')}
        </h2>
        <p className="text-text-secondary">{t('yogasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('yogasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('yogasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Yoga = floor((Sun° + Moon°) / 13.333°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Sum increases ~14°/day → ~1 Yoga/day</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">27 Yogas × 13°20&apos; = 360°</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {YOGAS.map((y, i) => (
            <motion.div
              key={y.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 flex items-center gap-3"
            >
              <span className="text-gold-primary/60 text-lg font-bold w-8 text-center">{y.number}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gold-light font-semibold text-sm">{y.name[locale]}</div>
                {locale !== 'en' && <div className="text-text-secondary/75 text-xs">{y.name.en}</div>}
              </div>
              <div className="text-right">
                <div className="text-text-secondary text-xs">{y.meaning[locale]}</div>
                <div className={`text-xs ${natureColor(y.nature)}`}>
                  {y.nature === 'auspicious' ? t('auspicious') :
                   y.nature === 'inauspicious' ? t('inauspicious') :
                   t('neutral')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/yoga"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PART 2: KUNDALI YOGAS — Planetary Combinations in Birth Chart
      ═══════════════════════════════════════════════════════════════ */}
      <KundaliYogasSection locale={locale} />
    </div>
  );
}
