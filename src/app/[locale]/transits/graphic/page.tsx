'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { RASHIS } from '@/lib/constants/rashis';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};
const PLANET_NAMES = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function GraphicTransitPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ day: number; planets: { id: number; rashi: number; isRetrograde: boolean }[] }[]>([]);

  const locationStore = useLocationStore();

  useEffect(() => { locationStore.detect(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const lat = locationStore.lat ?? 0;
    const lng = locationStore.lng ?? 0;
    const tzOffset = -(new Date().getTimezoneOffset() / 60);
    setLoading(true);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const results: typeof data = [];

    for (let d = 1; d <= daysInMonth; d++) {
      try {
        const p = computePanchang({ year, month: month + 1, day: d, lat, lng, tzOffset, locationName: locationStore.name || '' });
        results.push({
          day: d,
          planets: p.planets.map(pl => ({ id: pl.id, rashi: pl.rashi || 1, isRetrograde: pl.isRetrograde || false })),
        });
      } catch { /* skip */ }
    }
    setData(results);
    setLoading(false);
  }, [year, month, locationStore.lat, locationStore.lng, locationStore.name]);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // Detect sign changes and retrogrades
  const events = useMemo(() => {
    const evts: { day: number; planet: number; type: 'ingress' | 'retro_start' | 'retro_end'; fromSign?: number; toSign?: number }[] = [];
    for (let i = 1; i < data.length; i++) {
      for (const pl of data[i].planets) {
        const prev = data[i - 1].planets.find(p => p.id === pl.id);
        if (!prev) continue;
        if (pl.rashi !== prev.rashi) {
          evts.push({ day: data[i].day, planet: pl.id, type: 'ingress', fromSign: prev.rashi, toSign: pl.rashi });
        }
        if (pl.isRetrograde && !prev.isRetrograde) {
          evts.push({ day: data[i].day, planet: pl.id, type: 'retro_start' });
        }
        if (!pl.isRetrograde && prev.isRetrograde) {
          evts.push({ day: data[i].day, planet: pl.id, type: 'retro_end' });
        }
      }
    }
    return evts;
  }, [data]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'ग्राफिक गोचर पंचांग' : 'Graphic Transit Ephemeris'}
          </h1>
          <p className="text-text-secondary text-sm">{isHi ? 'मासिक ग्रह गति — राशि परिवर्तन और वक्री गति' : 'Monthly planet positions — sign changes and retrogrades'}</p>
          <Link href="/transits" className="text-xs text-gold-primary/60 hover:text-gold-primary mt-2 inline-block">
            {isHi ? '← गोचर सूची' : '← Transit List'}
          </Link>
        </div>

        {/* Month/Year nav */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gold-primary/10 text-gold-primary"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-xl font-bold text-gold-light">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gold-primary/10 text-gold-primary"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gold-primary mx-auto" /></div>
        ) : (
          <>
            {/* Graphic grid: rows = planets, columns = days */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto mb-8">
              <table className="w-full text-[10px]">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1 text-gold-dark">Planet</th>
                    {data.map(d => (
                      <th key={d.day} className="px-0.5 py-1 text-text-tertiary font-normal">{d.day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0,2,3,4,5,6,7,8].map(pid => ( // skip Moon (1) — changes sign daily
                    <tr key={pid}>
                      <td className="px-2 py-1 font-bold" style={{ color: PLANET_COLORS[pid] }}>{PLANET_NAMES[pid]}</td>
                      {data.map(d => {
                        const pl = d.planets.find(p => p.id === pid);
                        if (!pl) return <td key={d.day} />;
                        const prev = d.day > 1 ? data[d.day - 2]?.planets.find(p => p.id === pid) : null;
                        const changed = prev && prev.rashi !== pl.rashi;
                        return (
                          <td key={d.day} className={`px-0.5 py-1 text-center ${changed ? 'bg-gold-primary/20 font-bold' : ''} ${pl.isRetrograde ? 'italic text-red-400' : ''}`}
                            style={{ color: changed ? '#f0d48a' : PLANET_COLORS[pid], opacity: 0.8 }}
                            title={`${PLANET_NAMES[pid]} in ${RASHIS[(pl.rashi - 1) % 12]?.name.en}${pl.isRetrograde ? ' ℞' : ''}`}>
                            {RASHIS[(pl.rashi - 1) % 12]?.name.en?.substring(0, 3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Events this month */}
            {events.length > 0 && (
              <div>
                <h3 className="text-gold-light text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {isHi ? 'इस माह की प्रमुख घटनाएं' : 'Key Events This Month'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {events.map((evt, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 border ${evt.type === 'ingress' ? 'border-gold-primary/20' : 'border-red-500/20'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLANET_COLORS[evt.planet] }} />
                        <span className="text-gold-light text-xs font-bold">{PLANET_NAMES[evt.planet]}</span>
                        <span className="text-text-tertiary text-[10px]">{MONTHS[month]} {evt.day}</span>
                      </div>
                      <div className="text-text-secondary text-xs">
                        {evt.type === 'ingress' && `${RASHIS[(evt.fromSign! - 1) % 12]?.name[locale]} → ${RASHIS[(evt.toSign! - 1) % 12]?.name[locale]}`}
                        {evt.type === 'retro_start' && (isHi ? 'वक्री गति आरम्भ ℞' : 'Retrograde begins ℞')}
                        {evt.type === 'retro_end' && (isHi ? 'मार्गी गति ↑' : 'Direct motion resumes ↑')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
