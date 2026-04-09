'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { computePersonalTransits } from '@/lib/transit/personal-transits';
import { authedFetch } from '@/lib/api/authed-fetch';
import type { PersonalTransit } from '@/lib/transit/personal-transits';

interface Props {
  locale: string;
}

export default function TransitForecastWidget({ locale }: Props) {
  const user = useAuthStore(s => s.user);
  const [transits, setTransits] = useState<PersonalTransit[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChart, setHasChart] = useState(false);
  const isHi = locale !== 'en';

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    authedFetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        const chartData = data.chartData || data.chart_data;
        if (chartData?.ashtakavarga?.savTable && chartData?.ascendant?.sign) {
          setHasChart(true);
          const t = computePersonalTransits(chartData.ascendant.sign, chartData.ashtakavarga.savTable);
          // Pick top 2 by absolute deviation from mean SAV (~25)
          const sorted = [...t].sort((a, b) => Math.abs(b.savBindu - 25) - Math.abs(a.savBindu - 25));
          setTransits(sorted.slice(0, 2));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // Not logged in — show CTA
  if (!user) {
    return (
      <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 text-center">
        <p className="text-gold-light text-sm font-semibold mb-1">
          {isHi ? 'व्यक्तिगत गोचर पूर्वानुमान' : 'Personalized Transit Forecast'}
        </p>
        <p className="text-text-secondary/70 text-xs mb-3">
          {isHi ? 'अपनी जन्म कुण्डली बनाएं और देखें कि वर्तमान ग्रह गोचर आपको कैसे प्रभावित कर रहे हैं' : 'Generate your birth chart to see how current planetary transits affect you'}
        </p>
        <a href={`/${locale}/kundali`} className="inline-block px-4 py-2 rounded-lg bg-gold-primary/20 text-gold-light text-xs font-bold border border-gold-primary/30 hover:bg-gold-primary/30 transition-colors">
          {isHi ? 'कुण्डली बनाएं →' : 'Generate Kundali →'}
        </a>
      </div>
    );
  }

  if (loading) return null;
  if (!hasChart) return null;
  if (transits.length === 0) return null;

  return (
    <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold-light text-sm font-bold">
          {isHi ? 'आपका गोचर पूर्वानुमान' : 'Your Transit Forecast'}
        </h3>
        <a href={`/${locale}/kundali`} className="text-gold-primary/70 text-[10px] hover:text-gold-light transition-colors">
          {isHi ? 'विस्तार →' : 'Details →'}
        </a>
      </div>
      <div className="space-y-2">
        {transits.map(t => {
          const dotColor = t.quality === 'strong' ? 'bg-emerald-400' : t.quality === 'weak' ? 'bg-red-400' : 'bg-amber-400';
          return (
            <div key={t.planetId} className="flex items-center gap-2.5">
              <GrahaIconById id={t.planetId} size={18} />
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <p className="text-text-secondary/80 text-xs flex-1">
                {isHi ? t.interpretation.hi : t.interpretation.en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
