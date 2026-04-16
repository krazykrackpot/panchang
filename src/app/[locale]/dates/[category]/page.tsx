'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft, Clock, Moon, Sun } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { buildYearlyTithiTable, type TithiEntry } from '@/lib/calendar/tithi-table';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── Category Configuration ──────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { tithiNumbers: number[]; pakshaFilter?: 'shukla' | 'krishna' }> = {
  ekadashi: { tithiNumbers: [11] },
  purnima: { tithiNumbers: [15], pakshaFilter: 'shukla' },
  amavasya: { tithiNumbers: [30] },
  pradosham: { tithiNumbers: [13] },
  chaturthi: { tithiNumbers: [4] },
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ekadashi: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
  purnima: { en: 'Purnima', hi: 'पूर्णिमा', sa: 'पूर्णिमा' },
  amavasya: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावस्या' },
  pradosham: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषम्' },
  chaturthi: { en: 'Chaturthi', hi: 'चतुर्थी', sa: 'चतुर्थी' },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_SHORT_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Calendar',
    completeDates: 'Complete Dates & Timings',
    next: 'Next',
    total: 'total in',
    date: 'Date',
    day: 'Day',
    name: 'Name',
    timings: 'Timings',
    paksha: 'Paksha',
    shukla: 'Shukla',
    krishna: 'Krishna',
    noEntries: 'No dates found for this month',
    jumpTo: 'Jump to month',
    aboutEkadashi: 'About Ekadashi',
    aboutEkadashiText: 'Ekadashi is the eleventh day (Tithi) of each lunar fortnight in the Hindu calendar. There are two Ekadashis every month -- one in Shukla Paksha (waxing moon) and one in Krishna Paksha (waning moon), giving approximately 24 Ekadashis per year. Fasting on Ekadashi (Ekadashi Vrat) is one of the most important observances in Hinduism, believed to purify the body and mind. Each Ekadashi has a unique name and spiritual significance tied to stories from the Puranas.',
    aboutPurnima: 'About Purnima',
    aboutPurnimaText: 'Purnima is the full moon day, the fifteenth Tithi of Shukla Paksha. It occurs once every lunar month (approximately every 29.5 days) and is considered one of the most auspicious days in the Hindu calendar. Many major festivals like Guru Purnima, Sharad Purnima, and Holi fall on Purnima. Fasting and charity on Purnima are believed to bring spiritual merit. The full moon also marks the boundary between months in the Purnimant calendar system.',
    aboutAmavasya: 'About Amavasya',
    aboutAmavasyaText: 'Amavasya is the new moon day, the last Tithi (30th) of Krishna Paksha when the moon is not visible. It occurs once every lunar month and marks the end of the month in the Amanta calendar system. Amavasya is considered significant for Pitru Tarpan (offerings to ancestors), Shani Puja, and Kali worship. While considered inauspicious for starting new ventures, Amavasya holds deep spiritual significance for meditation and introspective practices.',
    aboutPradosham: 'About Pradosham',
    aboutPradoshamText: 'Pradosham (also called Pradosh Vrat) falls on the thirteenth Tithi (Trayodashi) of each lunar fortnight -- both Shukla and Krishna Paksha. The word "Pradosha" refers to the twilight period, and the vrat is observed in the evening during the twilight hours. Pradosham is dedicated to Lord Shiva and is considered highly auspicious for Shiva worship. When Pradosham falls on Saturday, it is called Shani Pradosham, and when on Monday, it is called Soma Pradosham -- both are considered especially powerful.',
    aboutChaturthi: 'About Chaturthi',
    aboutChaturthiText: 'Chaturthi is the fourth Tithi of each lunar fortnight, sacred to Lord Ganesha. Krishna Chaturthi (also called Sankashti Chaturthi) falls in the waning moon phase and is observed with fasting and moonrise-based Ganesh Puja. Shukla Chaturthi in the waxing phase is called Vinayaka Chaturthi. The most celebrated Chaturthi is Ganesh Chaturthi (Bhadrapada Shukla Chaturthi), the grand 10-day festival. Monthly Sankashti Chaturthi vrat involves fasting until moonrise and is believed to remove obstacles.',
    viewCalendar: 'View Festival Calendar',
  },
  hi: {
    back: 'कैलेंडर',
    completeDates: 'सम्पूर्ण तिथियाँ और समय',
    next: 'अगला',
    total: 'कुल',
    date: 'तिथि',
    day: 'दिन',
    name: 'नाम',
    timings: 'समय',
    paksha: 'पक्ष',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    noEntries: 'इस माह कोई तिथि नहीं मिली',
    jumpTo: 'माह पर जाएँ',
    aboutEkadashi: 'एकादशी के बारे में',
    aboutEkadashiText: 'एकादशी हिन्दू पंचांग में प्रत्येक चान्द्र पक्ष की ग्यारहवीं तिथि है। प्रत्येक माह में दो एकादशियाँ होती हैं — एक शुक्ल पक्ष में और एक कृष्ण पक्ष में, जिससे वर्ष में लगभग 24 एकादशियाँ आती हैं। एकादशी व्रत हिन्दू धर्म के सबसे महत्वपूर्ण व्रतों में से एक है जो शरीर और मन को शुद्ध करता है।',
    aboutPurnima: 'पूर्णिमा के बारे में',
    aboutPurnimaText: 'पूर्णिमा पूर्ण चन्द्रमा का दिन है, शुक्ल पक्ष की पन्द्रहवीं तिथि। यह प्रत्येक चान्द्र मास में एक बार आती है और हिन्दू पंचांग के सबसे शुभ दिनों में से एक मानी जाती है। गुरु पूर्णिमा, शरद पूर्णिमा और होली जैसे प्रमुख त्योहार पूर्णिमा को पड़ते हैं।',
    aboutAmavasya: 'अमावस्या के बारे में',
    aboutAmavasyaText: 'अमावस्या कृष्ण पक्ष की अन्तिम तिथि (30वीं) है जब चन्द्रमा दिखाई नहीं देता। यह अमान्त पंचांग में मास के अन्त का चिह्न है। अमावस्या पितृ तर्पण, शनि पूजा और काली पूजा के लिए महत्वपूर्ण है।',
    aboutPradosham: 'प्रदोष के बारे में',
    aboutPradoshamText: 'प्रदोष व्रत प्रत्येक चान्द्र पक्ष की त्रयोदशी (13वीं) तिथि को पड़ता है। "प्रदोष" शब्द सन्ध्याकाल को सूचित करता है और यह व्रत सन्ध्या के समय मनाया जाता है। प्रदोष भगवान शिव को समर्पित है। शनिवार को शनि प्रदोष और सोमवार को सोम प्रदोष कहा जाता है।',
    aboutChaturthi: 'चतुर्थी के बारे में',
    aboutChaturthiText: 'चतुर्थी प्रत्येक चान्द्र पक्ष की चौथी तिथि है, जो भगवान गणेश को समर्पित है। कृष्ण चतुर्थी (संकष्टी चतुर्थी) में चन्द्रोदय तक उपवास और गणेश पूजा की जाती है। सबसे प्रसिद्ध चतुर्थी गणेश चतुर्थी (भाद्रपद शुक्ल चतुर्थी) है।',
    viewCalendar: 'त्योहार कैलेंडर देखें',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    completeDates: 'सम्पूर्णतिथयः समयश्च',
    next: 'अग्रिम',
    total: 'कुल',
    date: 'दिनाङ्कः',
    day: 'वासरः',
    name: 'नाम',
    timings: 'कालः',
    paksha: 'पक्षः',
    shukla: 'शुक्लः',
    krishna: 'कृष्णः',
    noEntries: 'अस्मिन् मासे तिथिः न प्राप्ता',
    jumpTo: 'मासं गच्छतु',
    aboutEkadashi: 'एकादश्याः विषये',
    aboutEkadashiText: 'एकादशी हिन्दूपञ्चाङ्गे प्रत्येकपक्षस्य एकादशतिथिः। प्रत्येकमासे द्वे एकादश्यौ भवतः — एका शुक्लपक्षे एका कृष्णपक्षे। एकादशीव्रतं हिन्दूधर्मस्य महत्वपूर्णव्रतेषु अन्यतमम्।',
    aboutPurnima: 'पूर्णिमायाः विषये',
    aboutPurnimaText: 'पूर्णिमा पूर्णचन्द्रदिनम् शुक्लपक्षस्य पञ्चदशतिथिः। एतत् हिन्दूपञ्चाङ्गस्य शुभतमदिनेषु अन्यतमम्।',
    aboutAmavasya: 'अमावस्यायाः विषये',
    aboutAmavasyaText: 'अमावस्या कृष्णपक्षस्य अन्तिमा तिथिः यदा चन्द्रमाः न दृश्यते। पितृतर्पणाय शनिपूजायै महत्वपूर्णा।',
    aboutPradosham: 'प्रदोषस्य विषये',
    aboutPradoshamText: 'प्रदोषव्रतं प्रत्येकपक्षस्य त्रयोदशीतिथौ भवति। एतत् शिवदेवाय समर्पितम्।',
    aboutChaturthi: 'चतुर्थ्याः विषये',
    aboutChaturthiText: 'चतुर्थी प्रत्येकपक्षस्य चतुर्थतिथिः गणेशदेवाय समर्पिता। कृष्णचतुर्थी सङ्कष्टिचतुर्थी इति कथ्यते।',
    viewCalendar: 'पर्वपञ्चाङ्गं पश्यतु',
  },
};

// Default location: Delhi (for server computation — location-independent tithi table)
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;
const DEFAULT_TZ = 'Asia/Kolkata';

// ─── Animation Variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────
function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function formatDateDisplay(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES;
  return `${d} ${months[m - 1]}`;
}

// ─── Component ───────────────────────────────────────────────────
export default function DateCategoryPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const category = (params?.category as string) || 'ekadashi';
  const config = CATEGORY_CONFIG[category];
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;
  const catLabel = CATEGORY_LABELS[category]?.[locale] || CATEGORY_LABELS[category]?.en || category;

  const [year, setYear] = useState(new Date().getFullYear());

  // Generate tithi table and filter entries
  const entries = useMemo(() => {
    if (!config) return [];
    const table = buildYearlyTithiTable(year, DEFAULT_LAT, DEFAULT_LON, DEFAULT_TZ);
    return table.entries
      .filter(e => {
        if (!config.tithiNumbers.includes(e.number)) return false;
        if (config.pakshaFilter && e.paksha !== config.pakshaFilter) return false;
        return e.sunriseDate.startsWith(`${year}`);
      })
      .sort((a, b) => a.sunriseDate.localeCompare(b.sunriseDate));
  }, [year, config]);

  // Group by month
  const monthlyGroups = useMemo(() => {
    const groups: Record<number, TithiEntry[]> = {};
    for (let m = 1; m <= 12; m++) groups[m] = [];
    for (const e of entries) {
      const month = parseInt(e.sunriseDate.split('-')[1], 10);
      if (groups[month]) groups[month].push(e);
    }
    return groups;
  }, [entries]);

  // Find next upcoming date
  const today = new Date().toISOString().slice(0, 10);
  const nextEntry = entries.find(e => e.sunriseDate >= today);

  if (!config) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary text-lg">Category not found.</p>
      </div>
    );
  }

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/dates/${category}`, locale);

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/calendar" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-light transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {L.back}
          </Link>
        </motion.div>

        {/* H1 Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
          style={headingFont}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {catLabel} {year} — {L.completeDates}
        </motion.h1>

        {/* Year Navigator */}
        <motion.div
          className="flex items-center gap-4 mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setYear(y => y - 1)}
            className="p-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {[year - 1, year, year + 1].map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  y === year
                    ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                    : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button
            onClick={() => setYear(y => y + 1)}
            className="p-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary border border-gold-primary/15">
            <Calendar className="w-5 h-5 text-gold-primary" />
            <span className="text-text-primary font-semibold">{entries.length}</span>
            <span className="text-text-secondary">{catLabel} {L.total} {year}</span>
          </div>
          {nextEntry && year === new Date().getFullYear() && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">
                {L.next}: {formatDateDisplay(nextEntry.sunriseDate, locale)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Month Quick Nav */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <span className="text-text-secondary text-sm self-center mr-1">{L.jumpTo}:</span>
          {MONTH_NAMES.map((m, idx) => {
            const count = monthlyGroups[idx + 1]?.length || 0;
            return (
              <a
                key={m}
                href={`#month-${idx + 1}`}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  count > 0
                    ? 'bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 border border-gold-primary/15'
                    : 'bg-bg-secondary/50 text-text-secondary/50 cursor-default border border-transparent'
                }`}
              >
                {(isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES)[idx].slice(0, 3)}
                {count > 0 && <span className="ml-1 text-gold-primary/70">({count})</span>}
              </a>
            );
          })}
        </motion.div>

        <GoldDivider className="mb-10" />

        {/* Monthly Sections */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
          const monthEntries = monthlyGroups[month] || [];
          const monthName = (isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES)[month - 1];

          return (
            <motion.section
              key={month}
              id={`month-${month}`}
              className="mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={0}
            >
              <h2
                className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2"
                style={headingFont}
              >
                {month % 2 === 0 ? <Moon className="w-5 h-5 text-gold-primary/60" /> : <Sun className="w-5 h-5 text-gold-primary/60" />}
                {monthName} {year}
                <span className="text-sm font-normal text-text-secondary ml-2">
                  ({monthEntries.length} {catLabel})
                </span>
              </h2>

              {monthEntries.length === 0 ? (
                <p className="text-text-secondary text-sm italic pl-7">{L.noEntries}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gold-primary/10 bg-bg-secondary/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold-primary/10 text-text-secondary">
                        <th className="text-left px-4 py-3 font-medium">{L.date}</th>
                        <th className="text-left px-4 py-3 font-medium">{L.day}</th>
                        <th className="text-left px-4 py-3 font-medium">{L.name}</th>
                        <th className="text-left px-4 py-3 font-medium">{L.timings}</th>
                        <th className="text-left px-4 py-3 font-medium">{L.paksha}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthEntries.map((entry, idx) => {
                        const dow = getDayOfWeek(entry.sunriseDate);
                        const dayName = isDevanagariLocale(locale) ? DAY_NAMES_SHORT_HI[dow] : DAY_NAMES_SHORT[dow];
                        const isUpcoming = entry.sunriseDate >= today && entry.sunriseDate === nextEntry?.sunriseDate;
                        return (
                          <motion.tr
                            key={`${entry.sunriseDate}-${entry.paksha}-${idx}`}
                            className={`border-b border-gold-primary/5 transition-colors hover:bg-gold-primary/5 ${
                              isUpcoming ? 'bg-emerald-500/5' : ''
                            }`}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={idx}
                          >
                            <td className="px-4 py-3 text-text-primary font-medium whitespace-nowrap">
                              {formatDateDisplay(entry.sunriseDate, locale)}
                              {isUpcoming && (
                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                                  {L.next}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{dayName}</td>
                            <td className="px-4 py-3 text-text-primary">{tl(entry.name, locale)}</td>
                            <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-mono text-xs">
                              {entry.startLocal} — {entry.endLocal}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                entry.paksha === 'shukla'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                              }`}>
                                {entry.paksha === 'shukla' ? L.shukla : L.krishna}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          );
        })}

        <GoldDivider className="my-10" />

        {/* Educational Section */}
        <motion.section
          className="mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <h2
            className="text-2xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L[`about${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof L] || `About ${catLabel}`}
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-3xl">
            {L[`about${category.charAt(0).toUpperCase() + category.slice(1)}Text` as keyof typeof L] || ''}
          </p>
        </motion.section>

        {/* Link to Calendar */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 border border-gold-primary/20 hover:border-gold-primary/40 transition-all font-medium"
          >
            <Calendar className="w-5 h-5" />
            {L.viewCalendar}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
