'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import InfoCard from '@/components/ui/InfoCard';
import GoldDivider from '@/components/ui/GoldDivider';
import { Compass, BookOpen, Telescope, Moon as MoonIcon, Eclipse } from 'lucide-react';
import { VaraIcon, NakshatraIcon, TithiIcon } from '@/components/icons/PanchangIcons';
import TodayPanchangWidget from '@/components/panchang/TodayPanchangWidget';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isDevanagari = locale === 'hi' || locale === 'sa';

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Celestial orb background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold-primary/5 via-transparent to-gold-dark/5 blur-3xl" />

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          {/* Sanskrit shloka */}
          <motion.p
            variants={fadeInUp}
            className="text-gold-dark text-sm tracking-widest mb-6"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं
          </motion.p>

          {/* Main tagline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
          >
            <span className="text-gold-gradient">{t('tagline')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/panchang"
              className="group px-8 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300 flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              {t('explorePanchang')}
            </Link>
            <Link
              href="/kundali"
              className="px-8 py-3 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              {t('generateKundali')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeInUp}>
            <InfoCard
              icon={<VaraIcon size={56} />}
              title={t('panchangTitle')}
              description={t('panchangDesc')}
              href="/panchang"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <InfoCard
              icon={<NakshatraIcon size={56} />}
              title={t('kundaliTitle')}
              description={t('kundaliDesc')}
              href="/kundali"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <InfoCard
              icon={<TithiIcon size={56} />}
              title={t('tippanniTitle')}
              description={t('tippanniDesc')}
              href="/kundali"
            />
          </motion.div>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Today's Panchang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}>
            <span className="text-gold-gradient">{t('todayPanchang')}</span>
          </h2>
          <TodayPanchangWidget />
          <div className="text-center mt-8">
            <Link
              href="/panchang"
              className="text-gold-primary hover:text-gold-light transition-colors text-sm font-medium"
            >
              {t('viewFull')} &rarr;
            </Link>
          </div>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Why Panchang is Science */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}>
              <span className="text-gold-gradient">{t('scienceTitle')}</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {t('scienceDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="glass-card rounded-xl p-8">
              <Telescope className="w-10 h-10 text-gold-primary mb-4" />
              <h3 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('sciencePoint1Title')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('sciencePoint1')}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass-card rounded-xl p-8">
              <MoonIcon className="w-10 h-10 text-gold-primary mb-4" />
              <h3 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('sciencePoint2Title')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('sciencePoint2')}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass-card rounded-xl p-8">
              <Eclipse className="w-10 h-10 text-gold-primary mb-4" />
              <h3 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('sciencePoint3Title')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('sciencePoint3')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
