'use client';

import { useState, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { findMuhuratDates, type MuhuratActivity, type MuhuratDate } from '@/lib/calendar/muhurat-calendar';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L('Muhurta Annual Calendar', 'मुहूर्त वार्षिक पंचांग', 'முகூர்த்த ஆண்டு நாள்காட்டி', 'মুহূর্ত বার্ষিক পঞ্জিকা'),
  subtitle: L('Color-coded auspicious days by activity — full year at a glance', 'गतिविधि अनुसार शुभ दिन — पूरे वर्ष की एक नज़र', 'செயல்பாட்டின்படி சுப நாட்கள் — முழு ஆண்டு ஒரு பார்வையில்', 'কার্যকলাপ অনুযায়ী শুভ দিন — পুরো বছর এক নজরে'),
  activity: L('Activity', 'गतिविधि', 'செயல்பாடு', 'কার্যকলাপ'),
  back: L('Muhurta AI', 'मुहूर्त AI', 'முகூர்த்த AI', 'মুহূর্ত AI'),
  legend: L('Legend', 'संकेत', 'குறியீடு', 'চিহ্ন'),
  excellent: L('Excellent', 'उत्तम', 'சிறந்தது', 'উত্তম'),
  good: L('Good', 'शुभ', 'நல்லது', 'শুভ'),
  acceptable: L('Acceptable', 'स्वीकार्य', 'ஏற்றுக்கொள்ளத்தக்கது', 'গ্রহণযোগ্য'),
  noData: L('No auspicious dates found', 'कोई शुभ तिथि नहीं', 'சுப நாட்கள் இல்லை', 'কোনো শুভ তারিখ নেই'),
};

const ACTIVITIES: { key: MuhuratActivity; label: { en: string; hi: string } }[] = [
  { key: 'marriage', label: { en: 'Marriage', hi: 'विवाह' } },
  { key: 'griha_pravesh', label: { en: 'Griha Pravesh', hi: 'गृह प्रवेश' } },
  { key: 'mundan', label: { en: 'Mundan', hi: 'मुण्डन' } },
  { key: 'vehicle', label: { en: 'Vehicle', hi: 'वाहन' } },
  { key: 'travel', label: { en: 'Travel', hi: 'यात्रा' } },
  { key: 'property', label: { en: 'Property', hi: 'सम्पत्ति' } },
  { key: 'business', label: { en: 'Business', hi: 'व्यापार' } },
  { key: 'education', label: { en: 'Education', hi: 'शिक्षा' } },
];

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_HI = ['जन', 'फर', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];

function qualityColor(q: 'excellent' | 'good' | 'acceptable'): string {
  if (q === 'excellent') return 'bg-emerald-400/70';
  if (q === 'good') return 'bg-emerald-400/35';
  return 'bg-amber-500/30';
}

function qualityDot(q: 'excellent' | 'good' | 'acceptable'): string {
  if (q === 'excellent') return 'bg-emerald-400';
  if (q === 'good') return 'bg-emerald-400/60';
  return 'bg-amber-500/60';
}

export default function MuhurtaAnnualPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const isTa = locale === 'ta';
  const isBn = locale === 'bn';
  const t = (obj: Record<string, string>) => isTa ? (obj.ta ?? obj.en) : isBn ? (obj.bn ?? obj.en) : isHi ? obj.hi : obj.en;
  const headingFont = { fontFamily: isHi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedActivity, setSelectedActivity] = useState<MuhuratActivity>('marriage');

  const { lat, lng } = useLocationStore();
  const useLat = lat || 28.6139; // fallback for display
  const useLng = lng || 77.2090;

  // Compute muhurat dates for the selected activity across all 12 months
  const annualDates = useMemo(() => {
    const results: Map<string, MuhuratDate> = new Map();
    for (let m = 1; m <= 12; m++) {
      try {
        const dates = findMuhuratDates(year, m, selectedActivity, useLat, useLng);
        for (const d of dates) {
          results.set(d.date, d);
        }
      } catch {
        console.error(`[muhurta-annual] computation failed for month ${m}`);
      }
    }
    return results;
  }, [selectedActivity, year, useLat, useLng]);

  const monthNames = isHi ? MONTH_NAMES_HI : MONTH_NAMES_EN;

  // Build 12 mini-month grids
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, m) => {
      const firstDay = new Date(year, m, 1);
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const startDow = firstDay.getDay(); // 0=Sun
      const days: { day: number; date: string; muhurat: MuhuratDate | null }[] = [];

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ day: d, date: dateStr, muhurat: annualDates.get(dateStr) || null });
      }

      return { month: m, name: monthNames[m], startDow, days };
    });
  }, [year, annualDates, monthNames]);

  const activityLabel = ACTIVITIES.find(a => a.key === selectedActivity)?.label;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link href="/muhurta-ai" className="inline-flex items-center gap-1 text-text-secondary hover:text-gold-light text-sm mb-6 transition-colors">
        <ArrowLeft size={14} />
        {t(LABELS.back)}
      </Link>

      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title)}</span>
        </h1>
        <p className="text-text-secondary text-sm">{t(LABELS.subtitle)}</p>
      </div>

      {/* Controls: Year nav + Activity selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Year navigation */}
        <div className="flex items-center gap-3">
          <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-gold-light transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-gold-light font-bold text-lg min-w-[4ch] text-center">{year}</span>
          <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-gold-light transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Activity selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {ACTIVITIES.map(a => (
            <button
              key={a.key}
              onClick={() => setSelectedActivity(a.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedActivity === a.key
                  ? 'bg-gold-primary/20 border border-gold-primary/40 text-gold-light'
                  : 'bg-white/5 border border-white/8 text-text-secondary hover:border-gold-primary/20 hover:text-text-primary'
              }`}
            >
              {isHi ? a.label.hi : a.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center mb-6 text-xs text-text-secondary">
        <span className="font-medium">{t(LABELS.legend)}:</span>
        <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-sm ${qualityDot('excellent')}`} />{t(LABELS.excellent)}</span>
        <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-sm ${qualityDot('good')}`} />{t(LABELS.good)}</span>
        <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded-sm ${qualityDot('acceptable')}`} />{t(LABELS.acceptable)}</span>
      </div>

      {/* 12-month grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map(m => (
          <div key={m.month} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-3">
            {/* Month name */}
            <h3 className="text-gold-light text-sm font-bold text-center mb-2">{m.name} {year}</h3>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 gap-px text-center text-[10px] text-text-secondary/60 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-px">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: m.startDow }, (_, i) => (
                <div key={`e${i}`} className="h-6" />
              ))}
              {/* Day cells */}
              {m.days.map(d => (
                <div
                  key={d.day}
                  className={`h-6 flex items-center justify-center rounded-sm text-[10px] ${
                    d.muhurat
                      ? `${qualityColor(d.muhurat.quality)} text-white font-bold cursor-pointer hover:ring-1 hover:ring-gold-primary/50`
                      : 'text-text-secondary/40'
                  }`}
                  title={d.muhurat ? `${d.date}: ${d.muhurat.quality} for ${isHi ? activityLabel?.hi : activityLabel?.en}` : undefined}
                >
                  {d.day}
                </div>
              ))}
            </div>

            {/* Count */}
            <div className="text-center mt-1.5 text-[10px] text-text-secondary/50">
              {m.days.filter(d => d.muhurat).length} {isHi ? 'शुभ दिन' : 'auspicious'}
            </div>
          </div>
        ))}
      </div>

      {/* Total count */}
      <div className="text-center mt-6 text-sm text-text-secondary">
        <Calendar size={14} className="inline mr-1 text-gold-primary" />
        {annualDates.size} {isHi ? 'शुभ दिन' : 'auspicious days'} {isHi ? 'वर्ष' : 'in'} {year} {isHi ? 'में' : ''} {isHi ? '' : `for ${activityLabel?.en}`}
        {isHi ? ` ${activityLabel?.hi} के लिए` : ''}
      </div>
    </div>
  );
}
