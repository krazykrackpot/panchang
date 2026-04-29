'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { computeUpcomingTransitions } from '@/lib/transit/personal-transits';
import { findArticleSlug } from '@/lib/content/transit-articles';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// House-to-domain mapping (bilingual)
// ---------------------------------------------------------------------------

const HOUSE_DOMAINS: Record<number, { en: string; hi: string; ta: string; bn: string }> = {
  1:  { en: 'self & health',           hi: 'स्वास्थ्य',           ta: 'சுயம் & ஆரோக்கியம்',    bn: 'স্বাস্থ্য' },
  2:  { en: 'wealth & family',         hi: 'धन और परिवार',       ta: 'செல்வம் & குடும்பம்',     bn: 'ধন ও পরিবার' },
  3:  { en: 'courage & siblings',      hi: 'साहस और भाई-बहन',   ta: 'தைரியம் & உடன்பிறப்பு',  bn: 'সাহস ও ভাইবোন' },
  4:  { en: 'home & mother',           hi: 'गृह और माता',        ta: 'இல்லம் & தாய்',          bn: 'গৃহ ও মাতা' },
  5:  { en: 'children & intellect',    hi: 'संतान और बुद्धि',    ta: 'குழந்தை & அறிவு',        bn: 'সন্তান ও বুদ্ধি' },
  6:  { en: 'health & challenges',     hi: 'रोग और शत्रु',       ta: 'சுகாதாரம் & சவால்கள்',    bn: 'রোগ ও শত্রু' },
  7:  { en: 'marriage & partnerships', hi: 'विवाह और साझेदारी',  ta: 'திருமணம் & பங்குதாரம்',   bn: 'বিবাহ ও অংশীদারিত্ব' },
  8:  { en: 'transformation',          hi: 'परिवर्तन',           ta: 'மாற்றம்',                bn: 'পরিবর্তন' },
  9:  { en: 'fortune & dharma',        hi: 'भाग्य और धर्म',      ta: 'அதிர்ஷ்டம் & தர்மம்',    bn: 'ভাগ্য ও ধর্ম' },
  10: { en: 'career & status',         hi: 'कर्म और यश',         ta: 'தொழில் & அந்தஸ்து',      bn: 'কর্ম ও যশ' },
  11: { en: 'gains & aspirations',     hi: 'लाभ और इच्छाएं',     ta: 'லாபம் & இலக்குகள்',      bn: 'লাভ ও আকাঙ্ক্ষা' },
  12: { en: 'liberation & loss',       hi: 'मोक्ष और व्यय',      ta: 'விடுதலை & இழப்பு',       bn: 'মোক্ষ ও ব্যয়' },
};

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  en: { title: 'Upcoming Transits', noTransits: 'No major transits in the next 6 months', enters: 'Enters your', house: 'house', days: 'days', supportive: 'Supportive', highlyFavorable: 'Highly favorable', moderate: 'Moderate', challenging: 'Challenging', sav: 'SAV', viewTransits: 'View Transit Analysis' },
  hi: { title: 'आगामी गोचर', noTransits: 'अगले 6 महीनों में कोई बड़ा गोचर नहीं', enters: 'आपके', house: 'भाव में प्रवेश', days: 'दिन', supportive: 'सहायक', highlyFavorable: 'अत्यंत शुभ', moderate: 'मध्यम', challenging: 'चुनौतीपूर्ण', sav: 'SAV', viewTransits: 'गोचर विश्लेषण देखें' },
  sa: { title: 'आगामिगोचराः', noTransits: 'षण्मासेषु महत्त्वपूर्णं गोचरं नास्ति', enters: 'भवतः', house: 'भावे प्रवेशः', days: 'दिनानि', supportive: 'सहायकम्', highlyFavorable: 'अत्यन्तशुभम्', moderate: 'मध्यमम्', challenging: 'कठिनम्', sav: 'SAV', viewTransits: 'गोचरविश्लेषणं पश्यतु' },
  ta: { title: 'வரவிருக்கும் பெயர்ச்சிகள்', noTransits: 'அடுத்த 6 மாதங்களில் முக்கிய பெயர்ச்சிகள் இல்லை', enters: 'உங்கள்', house: 'பாவத்தில் நுழைகிறது', days: 'நாட்கள்', supportive: 'ஆதரவான', highlyFavorable: 'மிகவும் சாதகமான', moderate: 'நடுத்தரம்', challenging: 'சவாலான', sav: 'SAV', viewTransits: 'பெயர்ச்சி பகுப்பாய்வைக் காண்க' },
  te: { title: 'రాబోయే గోచారాలు', noTransits: 'తదుపరి 6 నెలల్లో ప్రధాన గోచారాలు లేవు', enters: 'మీ', house: 'భావంలో ప్రవేశం', days: 'రోజులు', supportive: 'సహాయకరం', highlyFavorable: 'అత్యంత అనుకూలం', moderate: 'మధ్యస్థం', challenging: 'సవాలు', sav: 'SAV', viewTransits: 'గోచార విశ్లేషణ చూడండి' },
  bn: { title: 'আসন্ন গোচর', noTransits: 'পরবর্তী ৬ মাসে কোনো বড় গোচর নেই', enters: 'আপনার', house: 'ভাবে প্রবেশ', days: 'দিন', supportive: 'সহায়ক', highlyFavorable: 'অত্যন্ত শুভ', moderate: 'মধ্যম', challenging: 'চ্যালেঞ্জিং', sav: 'SAV', viewTransits: 'গোচর বিশ্লেষণ দেখুন' },
  kn: { title: 'ಮುಂಬರುವ ಗೋಚಾರ', noTransits: 'ಮುಂದಿನ 6 ತಿಂಗಳಲ್ಲಿ ಪ್ರಮುಖ ಗೋಚಾರಗಳಿಲ್ಲ', enters: 'ನಿಮ್ಮ', house: 'ಭಾವದಲ್ಲಿ ಪ್ರವೇಶ', days: 'ದಿನಗಳು', supportive: 'ಸಹಾಯಕ', highlyFavorable: 'ಅತ್ಯಂತ ಅನುಕೂಲ', moderate: 'ಮಧ್ಯಮ', challenging: 'ಸವಾಲು', sav: 'SAV', viewTransits: 'ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ ನೋಡಿ' },
  mr: { title: 'आगामी गोचर', noTransits: 'पुढील 6 महिन्यांत कोणताही मोठा गोचर नाही', enters: 'तुमच्या', house: 'भावात प्रवेश', days: 'दिवस', supportive: 'सहाय्यक', highlyFavorable: 'अत्यंत शुभ', moderate: 'मध्यम', challenging: 'आव्हानात्मक', sav: 'SAV', viewTransits: 'गोचर विश्लेषण पहा' },
  gu: { title: 'આગામી ગોચર', noTransits: 'આગામી 6 મહિનામાં કોઈ મોટો ગોચર નથી', enters: 'તમારા', house: 'ભાવમાં પ્રવેશ', days: 'દિવસ', supportive: 'સહાયક', highlyFavorable: 'અત્યંત શુભ', moderate: 'મધ્યમ', challenging: 'પડકારજનક', sav: 'SAV', viewTransits: 'ગોચર વિશ્લેષણ જુઓ' },
  mai: { title: 'आगामी गोचर', noTransits: 'अगिला 6 महीनामे कोनो पैग गोचर नहि', enters: 'अहाँक', house: 'भावमे प्रवेश', days: 'दिन', supportive: 'सहायक', highlyFavorable: 'अत्यंत शुभ', moderate: 'मध्यम', challenging: 'चुनौतीपूर्ण', sav: 'SAV', viewTransits: 'गोचर विश्लेषण देखू' },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TransitCountdownProps {
  ascendantSign: number;       // 1-12
  savTable: number[];          // 12 entries, raw Sarvashtakavarga per sign
  reducedSavTable?: number[];  // 12 entries, post-Shodhana (preferred for quality scoring)
  locale: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ScoredTransit {
  planetId: number;
  planetName: string;
  planetColor: string;
  toSignName: string;
  fromSignName: string;
  house: number;
  domain: string;
  sav: number;
  quality: 'highly_favorable' | 'supportive' | 'moderate' | 'challenging';
  qualityLabel: string;
  daysUntil: number;
  approximateDate: string;
  articleSlug: string | null;
}

// Thresholds: reduced SAV (post-Shodhana) averages ~8 per sign vs raw ~28.
// Use lower thresholds when scoring against the reduced table.
function getQuality(sav: number, isReduced: boolean): ScoredTransit['quality'] {
  if (isReduced) {
    if (sav >= 16) return 'highly_favorable';
    if (sav >= 14) return 'supportive';
    if (sav >= 8)  return 'moderate';
    return 'challenging';
  }
  if (sav >= 32) return 'highly_favorable';
  if (sav >= 28) return 'supportive';
  if (sav >= 22) return 'moderate';
  return 'challenging';
}

function getQualityColor(quality: ScoredTransit['quality']): string {
  switch (quality) {
    case 'highly_favorable': return 'text-emerald-400';
    case 'supportive': return 'text-emerald-400';
    case 'moderate': return 'text-gold-light';
    case 'challenging': return 'text-red-400';
  }
}

function getQualityBg(quality: ScoredTransit['quality']): string {
  switch (quality) {
    case 'highly_favorable': return 'bg-emerald-500';
    case 'supportive': return 'bg-emerald-500';
    case 'moderate': return 'bg-gold-primary';
    case 'challenging': return 'bg-red-500';
  }
}

function getQualityBorder(quality: ScoredTransit['quality']): string {
  switch (quality) {
    case 'highly_favorable': return 'border-emerald-500/30';
    case 'supportive': return 'border-emerald-500/20';
    case 'moderate': return 'border-gold-primary/20';
    case 'challenging': return 'border-red-500/20';
  }
}

function getQualityLabel(quality: ScoredTransit['quality'], L: (typeof LABELS)['en']): string {
  switch (quality) {
    case 'highly_favorable': return L.highlyFavorable;
    case 'supportive': return L.supportive;
    case 'moderate': return L.moderate;
    case 'challenging': return L.challenging;
  }
}

// Max SAV is theoretically 48 (8 contributors x 8 max per sign = not quite, but ~48 is the ceiling)
// Practical range is roughly 18-35. We'll scale the bar out of 40.
const SAV_BAR_MAX = 40;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransitCountdown({ ascendantSign, savTable, reducedSavTable, locale }: TransitCountdownProps) {
  const L = LABELS[locale as keyof typeof LABELS] || LABELS.en;
  const isDeva = isDevanagariLocale(locale as Locale);

  // Prefer reducedSavTable (post-Shodhana) for quality scoring — more accurate for transit prediction.
  const scoringTable = reducedSavTable ?? savTable;
  const isReduced = !!reducedSavTable;

  const scoredTransits = useMemo<ScoredTransit[]>(() => {
    const raw = computeUpcomingTransitions();
    if (!raw.length) return [];

    const scored: ScoredTransit[] = raw.map((t) => {
      const house = ((t.toSignId - ascendantSign + 12) % 12) + 1;
      const sav = scoringTable[t.toSignId - 1] || 0;
      const quality = getQuality(sav, isReduced);
      const graha = GRAHAS[t.planetId];
      const toRashi = RASHIS[t.toSignId - 1];
      const fromRashi = RASHIS[t.fromSignId - 1];
      const domainObj = HOUSE_DOMAINS[house] || HOUSE_DOMAINS[1];

      return {
        planetId: t.planetId,
        planetName: tl(graha?.name || t.planetName, locale),
        planetColor: graha?.color || '#888',
        toSignName: tl(toRashi?.name, locale),
        fromSignName: tl(fromRashi?.name, locale),
        house,
        domain: (domainObj as Record<string, string>)[locale] || domainObj.en,
        sav,
        quality,
        qualityLabel: getQualityLabel(quality, L),
        daysUntil: t.daysUntil,
        approximateDate: t.approximateDate,
        articleSlug: findArticleSlug(t.planetId, t.toSignId),
      };
    });

    // Sort by impact: challenging and highly favorable first (most impactful), then by days
    scored.sort((a, b) => {
      // Priority: challenging > highly_favorable > supportive > moderate
      const priorityMap: Record<string, number> = {
        challenging: 0,
        highly_favorable: 1,
        supportive: 2,
        moderate: 3,
      };
      const pDiff = (priorityMap[a.quality] ?? 3) - (priorityMap[b.quality] ?? 3);
      if (pDiff !== 0) return pDiff;
      return a.daysUntil - b.daysUntil;
    });

    return scored.slice(0, 3);
  }, [ascendantSign, savTable, locale, L]);

  // Don't render empty state — the KeyDatesTimeline component on the dashboard
  // already shows upcoming events (dasha transitions, solar return, etc.).
  // Showing "No major transits" alongside those events is contradictory.
  if (scoredTransits.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' as const }}
      className="mb-6 p-5 rounded-2xl border border-gold-primary/15 bg-bg-secondary"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold-primary" />
          <h3 className={`text-gold-light text-lg font-bold ${isDeva ? 'font-devanagari-heading' : ''}`}>
            {L.title}
          </h3>
        </div>
        <Link
          href={'/transits' as const}
          className="text-xs text-gold-primary/70 hover:text-gold-light flex items-center gap-1 transition-colors"
        >
          {L.viewTransits}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Transit cards */}
      <div className="space-y-4">
        {scoredTransits.map((t, i) => {
          const barWidth = Math.min(100, Math.round((t.sav / SAV_BAR_MAX) * 100));

          return (
            <motion.div
              key={`${t.planetId}-${t.toSignName}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3, ease: 'easeOut' as const }}
              className={`p-3 rounded-xl border ${getQualityBorder(t.quality)} bg-[#0a0e27]/40`}
            >
              <div className="flex items-start justify-between mb-2">
                {/* Planet + sign */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.planetColor }}
                  />
                  <span className={`font-semibold text-text-primary ${isDeva ? 'font-devanagari-heading' : ''}`}>
                    {t.planetName}
                  </span>
                  <ArrowRight className="w-3 h-3 text-text-secondary" />
                  <span className={`text-text-primary ${isDeva ? 'font-devanagari-body' : ''}`}>
                    {t.toSignName}
                  </span>
                </div>

                {/* Days countdown */}
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="text-xl font-bold text-gold-light tabular-nums">
                    {t.daysUntil}
                  </span>
                  <span className="text-xs text-text-secondary ml-1">{L.days}</span>
                </div>
              </div>

              {/* House + domain */}
              <p className={`text-sm text-text-secondary mb-2 ${isDeva ? 'font-devanagari-body' : ''}`}>
                {L.enters}{' '}
                <span className="text-text-primary font-medium">
                  {t.house}{locale === 'en' ? getSuffix(t.house) : ''}
                </span>{' '}
                {L.house}{' '}
                <span className="text-text-secondary">({t.domain})</span>
              </p>

              {/* SAV bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-[#1a1e3a] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getQualityBg(t.quality)} transition-all duration-500`}
                    style={{ width: `${barWidth}%`, opacity: 0.8 }}
                  />
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  {L.sav}: {t.sav}
                </span>
                <span className={`text-xs font-medium whitespace-nowrap ${getQualityColor(t.quality)}`}>
                  {t.qualityLabel}
                </span>
              </div>

              {/* Link to transit article if published */}
              {t.articleSlug && (
                <Link
                  href={`/learn/transits/${t.articleSlug}` as '/learn/transits/jupiter-in-cancer-2026'}
                  className="mt-2 flex items-center gap-1.5 text-xs text-gold-primary/70 hover:text-gold-light transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  {locale === 'hi' ? 'विस्तृत विश्लेषण पढ़ें' : 'Read detailed analysis'}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// English ordinal suffix helper
function getSuffix(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
