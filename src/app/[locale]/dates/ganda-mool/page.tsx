'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Clock, AlertTriangle, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { useLocationStore } from '@/stores/location-store';
import AuthorByline from '@/components/ui/AuthorByline';

// ─── Labels ──────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  title: {
    en: 'Ganda Mool Nakshatra Dates',
    hi: 'गण्ड मूल नक्षत्र तिथियां',
  },
  subtitle: {
    en: 'Complete list of dates when Moon transits through the 6 Ganda Mool Nakshatras',
    hi: '6 गण्ड मूल नक्षत्रों में चन्द्र गोचर की सम्पूर्ण तिथि सूची',
  },
  back: { en: 'Calendar', hi: 'कैलेंडर' },
  loading: { en: 'Computing Ganda Mool dates...', hi: 'गण्ड मूल तिथियां गणना हो रही हैं...' },
  date: { en: 'Date', hi: 'तिथि' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र' },
  ruler: { en: 'Ruler', hi: 'स्वामी' },
  start: { en: 'Start', hi: 'आरम्भ' },
  end: { en: 'End', hi: 'समाप्ति' },
  duration: { en: 'Duration', hi: 'अवधि' },
  hours: { en: 'hrs', hi: 'घंटे' },
  total: { en: 'total periods in', hi: 'कुल अवधियां' },
  noEntries: { en: 'No Ganda Mool dates found', hi: 'कोई गण्ड मूल तिथि नहीं मिली' },
  jumpTo: { en: 'Jump to month', hi: 'महीने पर जाएं' },
  whatIs: { en: 'What is Ganda Mool?', hi: 'गण्ड मूल क्या है?' },
  whatIsText: {
    en: 'Ganda Mool refers to 6 nakshatras that fall at the junctions (sandhi) between water signs (Cancer, Scorpio, Pisces) and fire signs (Leo, Sagittarius, Aries). These junctions are considered energetically turbulent because they mark the transition between two fundamentally different elemental energies. The word "Ganda" means knot or obstacle, and "Mool" means root — together signifying a root-level karmic knot.',
    hi: 'गण्ड मूल उन 6 नक्षत्रों को कहते हैं जो जल राशियों (कर्क, वृश्चिक, मीन) और अग्नि राशियों (सिंह, धनु, मेष) की संधि पर आते हैं। इन संधियों को ऊर्जात्मक रूप से अशांत माना जाता है क्योंकि ये दो मूलभूत रूप से भिन्न तात्विक ऊर्जाओं के संक्रमण को चिह्नित करती हैं। "गण्ड" का अर्थ है गांठ या बाधा, और "मूल" का अर्थ है जड़ — दोनों मिलकर एक मूल-स्तरीय कार्मिक गांठ को दर्शाते हैं।',
  },
  nakshatras: { en: 'The 6 Ganda Mool Nakshatras', hi: '6 गण्ड मूल नक्षत्र' },
  nakshatrasText: {
    en: 'Ashwini (Aries 0-13.33) — ruled by Ketu, at the Pisces-Aries junction. Ashlesha (Cancer 16.67-30) — ruled by Mercury, at the Cancer-Leo junction. Magha (Leo 0-13.33) — ruled by Ketu, at the Cancer-Leo junction. Jyeshtha (Scorpio 16.67-30) — ruled by Mercury, at the Scorpio-Sagittarius junction. Mula (Sagittarius 0-13.33) — ruled by Ketu, at the Scorpio-Sagittarius junction. Revati (Pisces 16.67-30) — ruled by Mercury, at the Pisces-Aries junction.',
    hi: 'अश्विनी (मेष 0-13.33) — केतु, मीन-मेष संधि। आश्लेषा (कर्क 16.67-30) — बुध, कर्क-सिंह संधि। मघा (सिंह 0-13.33) — केतु, कर्क-सिंह संधि। ज्येष्ठा (वृश्चिक 16.67-30) — बुध, वृश्चिक-धनु संधि। मूल (धनु 0-13.33) — केतु, वृश्चिक-धनु संधि। रेवती (मीन 16.67-30) — बुध, मीन-मेष संधि।',
  },
  remediesTitle: { en: 'Ganda Mool Shanti Puja', hi: 'गण्ड मूल शांति पूजा' },
  remediesText: {
    en: 'If a child is born during a Ganda Mool nakshatra, a shanti puja is traditionally performed on the 27th day after birth. This puja neutralizes the negative effects associated with the birth nakshatra. The specific rituals vary depending on which of the 6 nakshatras the child is born under. Generally, it involves: (1) Havan with specific mantras for the nakshatra deity, (2) Dana (charity) of items associated with the nakshatra ruler, (3) Recitation of the Nakshatra Sukta from the Yajurveda. Some traditions also prescribe that the father should not see the newborn for a specific period if born in certain Ganda Mool nakshatras — though modern practice has largely relaxed this rule.',
    hi: 'यदि कोई बालक गण्ड मूल नक्षत्र में जन्म लेता है, तो जन्म के 27वें दिन परम्परागत रूप से शांति पूजा की जाती है। यह पूजा जन्म नक्षत्र से जुड़े नकारात्मक प्रभावों को शांत करती है। विशिष्ट अनुष्ठान इस बात पर निर्भर करते हैं कि बालक किस नक्षत्र में जन्मा है। सामान्यतः इसमें शामिल हैं: (1) नक्षत्र देवता के विशिष्ट मन्त्रों से हवन, (2) नक्षत्र स्वामी से सम्बन्धित वस्तुओं का दान, (3) यजुर्वेद के नक्षत्र सूक्त का पाठ।',
  },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

interface GMEntry {
  nakshatraId: number;
  nakshatraName: LocaleText;
  ruler: string;
  rulerName: LocaleText;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  month: number;
}

const NAK_COLORS: Record<number, string> = {
  1: 'text-emerald-400',
  9: 'text-purple-400',
  10: 'text-amber-400',
  18: 'text-red-400',
  19: 'text-orange-400',
  27: 'text-cyan-400',
};

export default function GandaMoolPage() {
  const locale = useLocale() as Locale;
  const L = (key: string) => LABELS[key]?.[locale] || LABELS[key]?.en || key;
  const isDev = isDevanagariLocale(locale);
  const { lat, lng, name: locName, timezone } = useLocationStore();

  const [year, setYear] = useState(2026);
  const [entries, setEntries] = useState<GMEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lat == null || lng == null) return;
    setLoading(true);
    setError('');
    const tz = timezone || 'UTC';
    fetch(`/api/ganda-mool?year=${year}&lat=${lat}&lon=${lng}&tz=${encodeURIComponent(tz)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setEntries(data.entries || []);
      })
      .catch((err) => {
        console.error('[ganda-mool] fetch failed:', err);
        setError('Failed to load Ganda Mool dates. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [year, lat, lng, timezone]);

  const byMonth = useMemo(() => {
    const map = new Map<number, GMEntry[]>();
    for (const e of entries) {
      const arr = map.get(e.month) || [];
      arr.push(e);
      map.set(e.month, arr);
    }
    return map;
  }, [entries]);

  const months = isDev ? MONTH_NAMES_HI : MONTH_NAMES;

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD(`/${locale}/dates/ganda-mool`, locale)) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link href="/calendar" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>{L('back')}</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-gold-primary" />
            <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('title')} {year}
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto">{L('subtitle')}</p>

          {/* Year nav */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg bg-bg-secondary hover:bg-gold-primary/10 text-gold-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold text-gold-light">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg bg-bg-secondary hover:bg-gold-primary/10 text-gold-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {locName && (
            <p className="text-text-secondary text-sm mt-2">
              {locName}
            </p>
          )}
        </motion.div>

        {/* Summary bar */}
        {!loading && !error && (
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-gold-primary/10 text-gold-light text-sm font-medium">
              {entries.length} {L('total')} {year}
            </span>
          </div>
        )}

        <GoldDivider className="mb-8" />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{L('loading')}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-400">{error}</div>
        )}

        {/* Table by month */}
        {!loading && !error && entries.length > 0 && (
          <div className="space-y-10">
            {Array.from(byMonth.entries()).sort(([a], [b]) => a - b).map(([m, monthEntries]) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m * 0.03 }}
              >
                <h2 className={`text-xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
                  {months[m - 1]} {year}
                </h2>
                <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold-primary/20">
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('date')}</th>
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('nakshatra')}</th>
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('ruler')}</th>
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('start')}</th>
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('end')}</th>
                          <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('duration')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthEntries.map((e, i) => {
                          const dateObj = new Date(e.startDate + 'T12:00:00');
                          const dayName = dateObj.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
                          const dateDisplay = dateObj.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' });
                          return (
                            <tr key={i} className="border-b border-gold-primary/8 last:border-b-0 hover:bg-gold-primary/5 transition-colors">
                              <td className="px-4 py-3 text-text-primary">
                                <span className="font-medium">{dateDisplay}</span>
                                <span className="text-text-secondary ml-1 text-xs">({dayName})</span>
                              </td>
                              <td className={`px-4 py-3 font-semibold ${NAK_COLORS[e.nakshatraId] || 'text-gold-light'}`}>
                                {tl(e.nakshatraName, locale)}
                              </td>
                              <td className="px-4 py-3 text-text-secondary">
                                {tl(e.rulerName, locale)}
                              </td>
                              <td className="px-4 py-3 text-text-primary font-mono text-xs">{e.startTime}</td>
                              <td className="px-4 py-3 text-text-primary font-mono text-xs">{e.endTime}</td>
                              <td className="px-4 py-3 text-text-secondary">{e.durationHours} {L('hours')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16 text-text-secondary">{L('noEntries')}</div>
        )}

        <GoldDivider className="my-12" />

        {/* Learn section */}
        <div className="space-y-10 max-w-3xl mx-auto">
          <section>
            <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('whatIs')}
            </h2>
            <p className="text-text-primary leading-relaxed">{L('whatIsText')}</p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('nakshatras')}
            </h2>
            <p className="text-text-primary leading-relaxed">{L('nakshatrasText')}</p>
          </section>

          <section>
            <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('remediesTitle')}
            </h2>
            <p className="text-text-primary leading-relaxed">{L('remediesText')}</p>
          </section>
        </div>

        <GoldDivider className="my-12" />
        <AuthorByline />
      </div>
    </main>
  );
}
