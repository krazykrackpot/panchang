'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { PanchangData, Locale } from '@/types/panchang';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon } from '@/components/icons/PanchangIcons';

export default function TodayPanchangWidget() {
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale() as Locale;
  const t = useTranslations('panchang');

  useEffect(() => {
    const now = new Date();
    const tzOffset = -now.getTimezoneOffset() / 60;

    const fetchWithLocation = (lat: number, lng: number, name: string) => {
      fetch(`/api/panchang?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&lat=${lat}&lng=${lng}&tz=${tzOffset}&location=${encodeURIComponent(name)}`)
        .then((res) => res.json())
        .then((data) => {
          setPanchang(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    // Try browser geolocation first
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWithLocation(pos.coords.latitude, pos.coords.longitude, ''),
        () => {
          // Fallback: IP-based detection
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              if (data.latitude && data.longitude) {
                fetchWithLocation(data.latitude, data.longitude, data.city || '');
              } else {
                fetchWithLocation(28.6139, 77.209, 'New Delhi');
              }
            })
            .catch(() => fetchWithLocation(28.6139, 77.209, 'New Delhi'));
        },
        { timeout: 3000 }
      );
    } else {
      fetchWithLocation(28.6139, 77.209, 'New Delhi');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" />
      </div>
    );
  }

  if (!panchang) return null;

  const elements = [
    { label: t('tithi'), value: panchang.tithi.name[locale], sub: panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna'), Icon: TithiIcon },
    { label: t('nakshatra'), value: panchang.nakshatra.name[locale], sub: panchang.nakshatra.deity[locale], Icon: NakshatraIcon },
    { label: t('yoga'), value: panchang.yoga.name[locale], sub: panchang.yoga.meaning[locale], Icon: YogaIcon },
    { label: t('karana'), value: panchang.karana.name[locale], sub: '', Icon: KaranaIcon },
    { label: t('vara'), value: panchang.vara.name[locale], sub: panchang.vara.ruler[locale], Icon: VaraIcon },
  ];

  return (
    <div>
      {panchang.location?.name && (
        <p className="text-text-secondary text-xs text-center mb-3">
          {panchang.location.name}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {elements.map((el, i) => (
          <motion.div
            key={el.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card rounded-xl p-5 text-center"
          >
            <div className="flex justify-center mb-2"><el.Icon size={48} /></div>
            <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">{el.label}</div>
            <div className="text-gold-light text-lg font-semibold" style={locale !== 'en' ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
              {el.value}
            </div>
            {el.sub && (
              <div className="text-text-secondary text-xs mt-1">{el.sub}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
