'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import HouseHighlightChart from '@/components/learn/HouseHighlightChart';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/bhavas.json';

const CLASSIFICATION_COLORS: Record<string, string> = {
  'Kendra': '#d4a853',
  'Trikona': '#34d399',
  'Dusthana': '#f87171',
  'Upachaya': '#fbbf24',
  'Maraka': '#c084fc',
};

const CLASSIFICATIONS = [
  { titleKey: 'kendraTitle' as const, descKey: 'kendraDesc' as const, houses: [1, 4, 7, 10], color: '#d4a853', textColor: 'text-gold-primary', border: 'border-gold-primary/20 bg-gold-primary/5' },
  { titleKey: 'trikonaTitle' as const, descKey: 'trikonaDesc' as const, houses: [1, 5, 9], color: '#34d399', textColor: 'text-emerald-400', border: 'border-emerald-400/20 bg-emerald-400/5' },
  { titleKey: 'dusthanaTitle' as const, descKey: 'dusthanaDesc' as const, houses: [6, 8, 12], color: '#f87171', textColor: 'text-red-400', border: 'border-red-400/20 bg-red-400/5' },
  { titleKey: 'upachayaTitle' as const, descKey: 'upachayaDesc' as const, houses: [3, 6, 10, 11], color: '#fbbf24', textColor: 'text-amber-400', border: 'border-amber-400/20 bg-amber-400/5' },
];

function getClassBadges(classification: string) {
  return classification.split(', ').map((cls) => ({
    label: cls,
    color: CLASSIFICATION_COLORS[cls] || '#d4a853',
  }));
}

export default function LearnBhavasPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Bhava" devanagari="भाव" transliteration="Bhāva" meaning="House / State of being" />
        <SanskritTermCard term="Lagna" devanagari="लग्न" transliteration="Lagna" meaning="Ascendant (1st House cusp)" />
        <SanskritTermCard term="Kendra" devanagari="केन्द्र" transliteration="Kendra" meaning="Angular houses (1,4,7,10)" />
        <SanskritTermCard term="Trikona" devanagari="त्रिकोण" transliteration="Trikoṇa" meaning="Trine houses (1,5,9)" />
      </div>

      <LessonSection number={1} title={t('whatTitle')}>
        <p>{t('whatContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Lagna = Rising sign at birth = 1st House</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Lagna shifts ~1 Rashi every 2 hours as Earth rotates</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">12 Rashis × 2 hours = 24 hours = full rotation</p>
        </div>
      </LessonSection>

      <LessonSection number={2} title={t('howTitle')}>
        <p>{t('howContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Whole-Sign System (Vedic standard):</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">If Lagna is in Mesha (Aries) → 1st house = all of Mesha (0°-30°)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">2nd house = all of Vrishabha (Taurus) 30°-60°</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">...and so on for all 12 houses</p>
          <p className="text-gold-light font-mono text-sm mt-3">Placidus System (KP method):</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Houses = unequal arcs based on time-based trisection</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">House cusps calculated from LST and geographic latitude</p>
        </div>
      </LessonSection>

      <LessonSection number={3} title={t('lagnaTitle')}>
        <p>{t('lagnaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">LST (Local Sidereal Time) = GST + Longitude/15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Lagna longitude = atan(sin(LST) / (cos(LST) × cos(ε) - tan(φ) × sin(ε)))</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">where ε = obliquity (~23.44°), φ = geographic latitude</p>
        </div>
      </LessonSection>

      {/* Section 4: Classifications with charts */}
      <LessonSection number={4} title={t('classTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CLASSIFICATIONS.map((item) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${item.border} flex flex-col items-center`}
            >
              <HouseHighlightChart
                highlightHouses={item.houses}
                highlightColor={item.color}
                size={200}
                showAllNumbers
              />
              <div className="mt-4 text-center">
                <h4 className={`font-bold text-lg ${item.textColor} mb-2`}>{t(item.titleKey)}</h4>
                <p className="text-text-secondary text-sm">{t(item.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: All 12 Houses with individual diagrams */}
      <LessonSection number={5} title={t('housesTitle')} variant="highlight">
        <div className="space-y-8">
          {L.houses.map((h, i) => {
            const badges = getClassBadges(h.classification);
            const primaryColor = badges[0]?.color || '#d4a853';

            return (
              <motion.div
                key={h.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Chart */}
                  <div className="flex-shrink-0">
                    <HouseHighlightChart
                      highlightHouses={[h.num]}
                      highlightColor={primaryColor}
                      size={160}
                      showAllNumbers
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                      <span
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}20`, border: `2px solid ${primaryColor}50`, color: primaryColor }}
                      >
                        {h.num}
                      </span>
                      <div>
                        <div className="text-gold-light font-bold text-lg">{lt(h.name as LocaleText, locale)}</div>
                        <div className="text-gold-primary/60 text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{h.saLabel}</div>
                      </div>
                    </div>

                    {/* Classification badges */}
                    <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                      {badges.map((b) => (
                        <span
                          key={b.label}
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${b.color}18`, color: b.color, border: `1px solid ${b.color}40` }}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>

                    <p className="text-text-secondary text-sm mb-2">{lt(h.significations as LocaleText, locale)}</p>
                    <p className="text-text-secondary/75 text-xs">
                      {t('bodyPartLabel')}{' '}
                      <span className="text-gold-light/70">{lt(h.bodyPart as LocaleText, locale)}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}
