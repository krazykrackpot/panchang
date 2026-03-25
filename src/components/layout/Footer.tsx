'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative z-10 mt-20">
      <GoldDivider />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-gold-gradient text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('common.copyright')}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t('metadata.description')}
            </p>
          </div>

          {/* Panchang Links */}
          <div>
            <h4 className="text-gold-light text-sm font-semibold mb-3 uppercase tracking-wider">
              {t('nav.panchang')}
            </h4>
            <div className="flex flex-col gap-2">
              {['tithi', 'nakshatra', 'yoga', 'karana', 'muhurta', 'grahan', 'rashi'].map((item) => (
                <Link
                  key={item}
                  href={`/panchang/${item}`}
                  className="text-text-secondary hover:text-gold-light text-sm transition-colors"
                >
                  {t(`nav.${item}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-light text-sm font-semibold mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/panchang" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
                {t('nav.panchang')}
              </Link>
              <Link href="/kundali" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
                {t('nav.kundali')}
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </div>

        <div className="gold-divider mt-8 mb-6" />

        <div className="text-center text-text-secondary text-xs">
          <p>&copy; 2026 {t('common.copyright')}. Built with astronomical precision.</p>
          <p className="mt-1 text-gold-dark" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            ॐ ज्योतिषां ज्योतिः
          </p>
        </div>
      </div>
    </footer>
  );
}
