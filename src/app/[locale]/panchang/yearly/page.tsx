'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const MONTHS = [
  { en: 'January', hi: 'जनवरी', sa: 'जनवरी', mai: 'जनवरी', mr: 'जनवरी', ta: 'January', te: 'January', bn: 'January', kn: 'January', gu: 'January' }, { en: 'February', hi: 'फरवरी', sa: 'फरवरी', mai: 'फरवरी', mr: 'फरवरी', ta: 'February', te: 'February', bn: 'February', kn: 'February', gu: 'February' },
  { en: 'March', hi: 'मार्च', sa: 'मार्च', mai: 'मार्च', mr: 'मार्च', ta: 'March', te: 'March', bn: 'March', kn: 'March', gu: 'March' }, { en: 'April', hi: 'अप्रैल', sa: 'अप्रैल', mai: 'अप्रैल', mr: 'अप्रैल', ta: 'April', te: 'April', bn: 'April', kn: 'April', gu: 'April' },
  { en: 'May', hi: 'मई', sa: 'मई', mai: 'मई', mr: 'मई', ta: 'May', te: 'May', bn: 'May', kn: 'May', gu: 'May' }, { en: 'June', hi: 'जून', sa: 'जून', mai: 'जून', mr: 'जून', ta: 'June', te: 'June', bn: 'June', kn: 'June', gu: 'June' },
  { en: 'July', hi: 'जुलाई', sa: 'जुलाई', mai: 'जुलाई', mr: 'जुलाई', ta: 'July', te: 'July', bn: 'July', kn: 'July', gu: 'July' }, { en: 'August', hi: 'अगस्त', sa: 'अगस्त', mai: 'अगस्त', mr: 'अगस्त', ta: 'August', te: 'August', bn: 'August', kn: 'August', gu: 'August' },
  { en: 'September', hi: 'सितम्बर', sa: 'सितम्बर', mai: 'सितम्बर', mr: 'सितम्बर', ta: 'September', te: 'September', bn: 'September', kn: 'September', gu: 'September' }, { en: 'October', hi: 'अक्टूबर', sa: 'अक्टूबर', mai: 'अक्टूबर', mr: 'अक्टूबर', ta: 'October', te: 'October', bn: 'October', kn: 'October', gu: 'October' },
  { en: 'November', hi: 'नवम्बर', sa: 'नवम्बर', mai: 'नवम्बर', mr: 'नवम्बर', ta: 'November', te: 'November', bn: 'November', kn: 'November', gu: 'November' }, { en: 'December', hi: 'दिसम्बर', sa: 'दिसम्बर', mai: 'दिसम्बर', mr: 'दिसम्बर', ta: 'December', te: 'December', bn: 'December', kn: 'December', gu: 'December' },
];
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_HI = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

interface DayData {
  date: string;
  tithi?: { name: LocaleText; paksha: string; number: number };
  nakshatra?: { name: LocaleText };
  isFestival?: boolean;
  festivalName?: string;
}

export default function YearlyPanchangPage() {
  const locale = useLocale();
  const isHi = isDevanagariLocale(locale);
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
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 md:p-6">
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
                          <div className={`text-xs leading-tight mt-0.5 ${isKrishna ? 'text-indigo-400' : 'text-amber-400'}`}>
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
                <div className="flex justify-center gap-4 mt-4 text-xs text-text-tertiary">
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
