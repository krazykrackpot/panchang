'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Locale } from '@/types/panchang';

const MONTHS = [
  { en: 'January', hi: 'जनवरी' }, { en: 'February', hi: 'फरवरी' },
  { en: 'March', hi: 'मार्च' }, { en: 'April', hi: 'अप्रैल' },
  { en: 'May', hi: 'मई' }, { en: 'June', hi: 'जून' },
  { en: 'July', hi: 'जुलाई' }, { en: 'August', hi: 'अगस्त' },
  { en: 'September', hi: 'सितम्बर' }, { en: 'October', hi: 'अक्टूबर' },
  { en: 'November', hi: 'नवम्बर' }, { en: 'December', hi: 'दिसम्बर' },
];
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_HI = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

interface DayData {
  date: string;
  tithi?: { name: { en: string; hi: string; sa: string }; paksha: string; number: number };
  nakshatra?: { name: { en: string; hi: string; sa: string } };
  isFestival?: boolean;
  festivalName?: string;
}

export default function YearlyPanchangPage() {
  const locale = useLocale();
  const isHi = locale !== 'en';
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthData, setMonthData] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());

  // Fetch panchang data for each day of the active month
  useEffect(() => {
    const fetchMonth = async () => {
      setLoading(true);
      const daysInMonth = new Date(year, activeMonth + 1, 0).getDate();
      const data: Record<string, DayData> = {};
      // Fetch in batches of 5
      for (let d = 1; d <= daysInMonth; d += 5) {
        const batch = [];
        for (let i = d; i < d + 5 && i <= daysInMonth; i++) {
          const dateStr = `${year}-${(activeMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
          batch.push(
            fetch(`/api/panchang?date=${dateStr}`).then(r => r.json()).then(p => {
              data[dateStr] = {
                date: dateStr,
                tithi: p.tithi,
                nakshatra: p.nakshatra,
              };
            }).catch(() => {})
          );
        }
        await Promise.all(batch);
      }
      setMonthData(data);
      setLoading(false);
    };
    fetchMonth();
  }, [year, activeMonth]);

  const daysInMonth = new Date(year, activeMonth + 1, 0).getDate();
  const firstDay = new Date(year, activeMonth, 1).getDay();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  const weekdays = isHi ? WEEKDAYS_HI : WEEKDAYS_EN;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? 'वार्षिक पञ्चाङ्ग' : 'Yearly Panchang'}
            </h1>
            <p className="text-text-secondary text-sm">{isHi ? 'प्रत्येक दिन की तिथि और नक्षत्र एक नजर में' : 'Daily tithi and nakshatra at a glance'}</p>
            <div className="mt-3">
              <Link href="/panchang" className="text-sm text-gold-primary/60 hover:text-gold-primary transition-colors">
                {isHi ? '← दैनिक पञ्चाङ्ग' : '← Daily Panchang'}
              </Link>
            </div>
          </div>

          {/* Year selector */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg hover:bg-gold-primary/10 text-gold-primary"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-2xl font-bold text-gold-light font-mono">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg hover:bg-gold-primary/10 text-gold-primary"><ChevronRight className="w-5 h-5" /></button>
          </div>

          {/* Month tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {MONTHS.map((m, i) => (
              <button key={i} onClick={() => setActiveMonth(i)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${activeMonth === i ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                {isHi ? m.hi : m.en}
              </button>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            {loading && (
              <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gold-primary mx-auto" /></div>
            )}
            {!loading && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map(d => (
                    <div key={d} className="text-center text-gold-dark text-xs font-bold py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, d) => {
                    const day = d + 1;
                    const dateStr = `${year}-${(activeMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const data = monthData[dateStr];
                    const isToday = dateStr === todayStr;
                    const isKrishna = data?.tithi?.paksha === 'krishna';
                    const isPurnima = data?.tithi?.number === 15 && data?.tithi?.paksha === 'shukla';
                    const isAmavasya = data?.tithi?.number === 30 || (data?.tithi?.number === 15 && data?.tithi?.paksha === 'krishna');

                    return (
                      <Link key={day} href={`/panchang?date=${dateStr}`}
                        className={`rounded-lg p-1.5 text-center transition-all hover:bg-gold-primary/10 cursor-pointer min-h-[60px] flex flex-col items-center justify-start
                          ${isToday ? 'ring-2 ring-gold-primary bg-gold-primary/10' : ''}
                          ${isPurnima ? 'bg-amber-500/5' : isAmavasya ? 'bg-indigo-500/5' : ''}`}>
                        <div className={`text-sm font-bold ${isToday ? 'text-gold-primary' : isKrishna ? 'text-text-secondary' : 'text-text-primary'}`}>{day}</div>
                        {data?.tithi && (
                          <div className={`text-[8px] leading-tight mt-0.5 ${isKrishna ? 'text-indigo-400' : 'text-amber-400'}`}>
                            {data.tithi.name[locale as Locale]?.substring(0, 6)}
                          </div>
                        )}
                        {data?.nakshatra && (
                          <div className="text-[7px] text-text-tertiary leading-tight mt-0.5">
                            {data.nakshatra.name[locale as Locale]?.substring(0, 5)}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-[10px] text-text-tertiary">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> {isHi ? 'शुक्ल' : 'Shukla'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> {isHi ? 'कृष्ण' : 'Krishna'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold-primary" /> {isHi ? 'आज' : 'Today'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
