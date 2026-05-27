'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft, MapPin } from 'lucide-react';
import { findMuhuratDates, type MuhuratActivity, type MuhuratDate } from '@/lib/calendar/muhurat-calendar';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import LocationSearch from '@/components/ui/LocationSearch';
import type { Locale } from '@/lib/i18n/config';

// ─── Labels ────────────────────────────────────────────────────
const L = (en: string, hi: string, ta?: string, bn?: string) => ({ en, hi, ta: ta ?? en, bn: bn ?? en });

const LABELS = {
  title: L('Muhurta Annual Calendar', 'मुहूर्त वार्षिक पंचांग', 'முகூர்த்த ஆண்டு நாள்காட்டி', 'মুহূর্ত বার্ষিক পঞ্জিকা'),
  subtitle: L('Color-coded auspicious days by activity  –  full year at a glance', 'गतिविधि अनुसार शुभ दिन  –  पूरे वर्ष की एक नज़र', 'செயல்பாட்டின்படி சுப நாட்கள்  –  முழு ஆண்டு ஒரு பார்வையில்', 'কার্যকলাপ অনুযায়ী শুভ দিন  –  পুরো বছর এক নজরে'),
  activity: L('Activity', 'गतिविधि', 'செயல்பாடு', 'কার্যকলাপ'),
  back: L('Muhurta AI', 'मुहूर्त AI', 'முகூர்த்த AI', 'মুহূর্ত AI'),
  legend: L('Legend', 'संकेत', 'குறியீடு', 'চিহ্ন'),
  excellent: L('Excellent', 'उत्तम', 'சிறந்தது', 'উত্তম'),
  good: L('Good', 'शुभ', 'நல்லது', 'শুভ'),
  acceptable: L('Acceptable', 'स्वीकार्य', 'ஏற்றுக்கொள்ளத்தக்கது', 'গ্রহণযোগ্য'),
  noData: L('No auspicious dates found', 'कोई शुभ तिथि नहीं', 'சுப நாட்கள் இல்லை', 'কোনো শুভ তারিখ নেই'),
  locationRequired: L(
    'Set your location to see muhurta dates',
    'मुहूर्त दिनांक देखने के लिए अपना स्थान निर्धारित करें',
    'முகூர்த்த தேதிகளைப் பார்க்க உங்கள் இருப்பிடத்தை அமைக்கவும்',
    'মুহূর্ত তারিখ দেখতে আপনার অবস্থান সেট করুন',
  ),
  locationRequiredHint: L(
    'Muhurta calculations depend on local sunrise/sunset and timezone — they cannot be computed without a location.',
    'मुहूर्त गणना स्थानीय सूर्योदय/सूर्यास्त और समय क्षेत्र पर निर्भर है — स्थान के बिना गणना नहीं हो सकती।',
    'முகூர்த்த கணக்கீடுகள் உள்ளூர் சூரிய உதயம்/அஸ்தமனம் மற்றும் நேர மண்டலத்தை சார்ந்திருக்கின்றன — இருப்பிடம் இல்லாமல் கணக்கிட முடியாது.',
    'মুহূর্ত গণনা স্থানীয় সূর্যোদয়/অস্ত এবং সময় অঞ্চলের উপর নির্ভর করে — অবস্থান ছাড়া গণনা করা যায় না।',
  ),
  searchCity: L('Search your city', 'अपना शहर खोजें', 'உங்கள் நகரத்தைத் தேடுங்கள்', 'আপনার শহর খুঁজুন'),
  changeLocation: L('Change location', 'स्थान बदलें', 'இருப்பிடத்தை மாற்று', 'অবস্থান পরিবর্তন'),
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

  const { lat, lng, name: locationName, detect: detectLocation } = useLocationStore();
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Try auto-detecting location on mount only if we don't already have
  // a stored one — otherwise we'd overwrite the user's manually picked
  // city every time they hit the page (e.g. user picked Corseaux, came
  // back tomorrow, geo-detected back to Lausanne). No hardcoded Delhi
  // fallback either — muhurta dates depend on local sunrise/sunset and
  // timezone (CLAUDE.md: "No hardcoded locations").
  useEffect(() => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      detectLocation();
    }
  }, [detectLocation, lat, lng]);

  // typeof NaN === 'number', so guard against parse/store errors. Lat 0
  // (Equator) and Lng 0 (Prime Meridian) are intentionally supported.
  const hasLocation =
    typeof lat === 'number' && !isNaN(lat) &&
    typeof lng === 'number' && !isNaN(lng);

  // Compute muhurat dates for the selected activity across all 12 months.
  // Gated on hasLocation — the page renders a location prompt otherwise.
  const annualDates = useMemo(() => {
    const results: Map<string, MuhuratDate> = new Map();
    if (!hasLocation) return results;
    for (let m = 1; m <= 12; m++) {
      try {
        const dates = findMuhuratDates(year, m, selectedActivity, lat!, lng!);
        for (const d of dates) {
          results.set(d.date, d);
        }
      } catch (err) {
        console.error(`[muhurta-annual] computation failed for month ${m}:`, err);
      }
    }
    return results;
  }, [selectedActivity, year, lat, lng, hasLocation]);

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
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title)}</span>
        </h1>
        <p className="text-text-secondary text-sm">{t(LABELS.subtitle)}</p>
      </div>

      {/* Location: required for accurate muhurta computation */}
      <div className="flex flex-col items-center gap-2 mb-6">
        {hasLocation ? (
          <button
            onClick={() => setShowLocationSearch(s => !s)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 hover:border-gold-primary/40 transition-colors"
          >
            <MapPin className="w-4 h-4 text-gold-primary" />
            <span className="text-text-primary text-sm font-medium">{locationName || `${lat!.toFixed(2)}, ${lng!.toFixed(2)}`}</span>
            <span className="text-text-secondary text-xs">· {t(LABELS.changeLocation)}</span>
          </button>
        ) : (
          <button
            onClick={() => setShowLocationSearch(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-400/40 hover:bg-amber-500/15 transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium">{t(LABELS.locationRequired)}</span>
          </button>
        )}
        {showLocationSearch && (
          <div className="w-full max-w-sm">
            <LocationSearch
              value=""
              onSelect={(loc) => {
                useLocationStore.getState().setLocation(loc.lat, loc.lng, loc.name, loc.timezone || 'UTC');
                setShowLocationSearch(false);
              }}
              placeholder={t(LABELS.searchCity)}
            />
          </div>
        )}
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

      {/* Location-required empty state: muhurta depends on local sunrise/sunset
          and timezone — computing with a placeholder would show wrong dates. */}
      {!hasLocation && (
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-8 text-center">
          <MapPin className="w-10 h-10 text-gold-primary/60 mx-auto mb-3" />
          <p className="text-gold-light font-semibold mb-2">{t(LABELS.locationRequired)}</p>
          <p className="text-text-secondary text-xs max-w-md mx-auto">{t(LABELS.locationRequiredHint)}</p>
        </div>
      )}

      {/* 12-month grid  –  3 columns on desktop, 2 on tablet, 1 on mobile */}
      {hasLocation && (
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
      )}

      {/* Total count */}
      {hasLocation && (
        <div className="text-center mt-6 text-sm text-text-secondary">
          <Calendar size={14} className="inline mr-1 text-gold-primary" />
          {annualDates.size} {isHi ? 'शुभ दिन' : 'auspicious days'} {isHi ? 'वर्ष' : 'in'} {year} {isHi ? 'में' : ''} {isHi ? '' : `for ${activityLabel?.en}`}
          {isHi ? ` ${activityLabel?.hi} के लिए` : ''}
        </div>
      )}
    </div>
  );
}
