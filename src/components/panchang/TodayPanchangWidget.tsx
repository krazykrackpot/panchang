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
    const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const fetchWithLocation = (lat: number, lng: number, name: string) => {
      fetch(`/api/panchang?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(name)}`)
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

  // Format transition end time — always includes date
  const MONTHS = locale === 'en'
    ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    : ['जन.','फर.','मार्च','अप्रै.','मई','जून','जुला.','अग.','सित.','अक्टू.','नव.','दिस.'];
  const endTimeStr = (tr?: { endTime: string; endDate?: string }) => {
    if (!tr) return '';
    const prefix = locale === 'en' ? 'ends' : 'समाप्ति';
    if (tr.endDate) {
      const [, m, d] = tr.endDate.split('-').map(Number);
      return `${prefix} ${tr.endTime}, ${d} ${MONTHS[m - 1]}`;
    }
    return `${prefix} ${tr.endTime}`;
  };

  const elements = [
    { label: t('tithi'), value: panchang.tithi.name[locale], sub: panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna'), timing: endTimeStr(panchang.tithiTransition), Icon: TithiIcon },
    { label: t('nakshatra'), value: panchang.nakshatra.name[locale], sub: panchang.nakshatra.deity[locale], timing: endTimeStr(panchang.nakshatraTransition), Icon: NakshatraIcon },
    { label: t('yoga'), value: panchang.yoga.name[locale], sub: panchang.yoga.meaning[locale], timing: endTimeStr(panchang.yogaTransition), Icon: YogaIcon },
    { label: t('karana'), value: panchang.karana.name[locale], sub: '', timing: endTimeStr(panchang.karanaTransition), Icon: KaranaIcon },
    { label: t('vara'), value: panchang.vara.name[locale], sub: panchang.vara.ruler[locale], timing: '', Icon: VaraIcon },
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
            {el.timing && (
              <div className="font-mono text-[10px] text-gold-primary/70 mt-1">{el.timing}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Hora-based quick activity planner */}
      {panchang.hora && panchang.hora.length > 0 && (() => {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const currentHora = panchang.hora.find((h: { startTime: string; endTime: string; planetId: number }) => {
          const [sh, sm] = h.startTime.split(':').map(Number);
          const [eh, em] = h.endTime.split(':').map(Number);
          const start = sh * 60 + sm;
          const end = eh * 60 + em;
          return nowMinutes >= start && nowMinutes < end;
        });
        const HORA_ACTIVITIES: Record<number, { en: string; hi: string }> = {
          0: { en: 'Government work, authority matters, health', hi: 'सरकारी कार्य, स्वास्थ्य' },
          1: { en: 'Travel, liquids, public relations', hi: 'यात्रा, तरल पदार्थ, जनसंपर्क' },
          2: { en: 'Property, machinery, legal battles', hi: 'संपत्ति, मशीनरी, कानूनी कार्य' },
          3: { en: 'Communication, trade, learning', hi: 'संचार, व्यापार, शिक्षा' },
          4: { en: 'Education, finance, spiritual practice', hi: 'शिक्षा, वित्त, आध्यात्मिक' },
          5: { en: 'Romance, arts, luxury purchases', hi: 'प्रेम, कला, विलासिता' },
          6: { en: 'Labor, iron work, mining, discipline', hi: 'श्रम, लोहा, खनन, अनुशासन' },
        };
        if (!currentHora) return null;
        const activity = HORA_ACTIVITIES[currentHora.planetId] || HORA_ACTIVITIES[0];
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-6 glass-card rounded-xl p-4 text-center border border-gold-primary/15">
            <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">
              {locale === 'en' ? 'Current Hora — Best Activity Now' : 'वर्तमान होरा — अभी सर्वोत्तम कार्य'}
            </div>
            <div className="text-gold-light font-bold text-lg" style={locale !== 'en' ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
              {currentHora.startTime} – {currentHora.endTime}
            </div>
            <div className="text-text-secondary text-xs mt-1">{locale === 'en' ? activity.en : activity.hi}</div>
          </motion.div>
        );
      })()}
    </div>
  );
}
