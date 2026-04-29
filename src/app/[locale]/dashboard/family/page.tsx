'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  Users, AlertTriangle, Shield, Star, Loader2, ChevronDown, Search,
  ArrowRight, Clock, Calendar, CheckCircle2,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLocationStore } from '@/stores/location-store';
import { getSupabase } from '@/lib/supabase/client';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import type { DoshaInsight } from '@/lib/kundali/tippanni-types';
import { computeMemberStatus, type MemberStatus } from '@/lib/kundali/family-synthesis/member-status';
import { findCollectiveMuhurta, type CollectiveMuhurtaWindow, type FamilyMemberInput } from '@/lib/kundali/family-synthesis/collective-muhurta';
import { getAllExtendedActivities } from '@/lib/muhurta/activity-rules-extended';
import { getPlanetaryPositions, toSidereal, getRashiNumber, dateToJD } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { findArticleSlug, getMoonSignEffect, TRANSIT_ARTICLES } from '@/lib/content/transit-articles';
import { RASHIS } from '@/lib/constants/rashis';
import FamilyCard from '@/components/dashboard/FamilyCard';
import type { Locale } from '@/types/panchang';
import type { BirthData, KundaliData } from '@/types/kundali';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  pageTitle:        { en: 'Family Command Center', hi: 'परिवार कमांड सेंटर', ta: 'குடும்பக் கட்டுப்பாட்டு மையம்', bn: 'পরিবার কমান্ড সেন্টার' },
  members:          { en: 'members', hi: 'सदस्य', ta: 'உறுப்பினர்கள்', bn: 'সদস্য' },
  needsAttention:   { en: 'needs attention', hi: 'ध्यान चाहिए', ta: 'கவனம் தேவை', bn: 'মনোযোগ প্রয়োজন' },
  needAttention:    { en: 'need attention', hi: 'ध्यान चाहिए', ta: 'கவனம் தேவை', bn: 'মনোযোগ প্রয়োজন' },
  signInPrompt:     { en: 'Sign in to access your family dashboard', hi: 'अपने परिवार डैशबोर्ड तक पहुँचने के लिए साइन इन करें', ta: 'உங்கள் குடும்ப டாஷ்போர்டை அணுக உள்நுழையவும்', bn: 'আপনার পরিবার ড্যাশবোর্ড অ্যাক্সেস করতে সাইন ইন করুন' },
  noChartsTitle:    { en: 'No Charts Found', hi: 'कोई कुंडली नहीं मिली', ta: 'சார்ட்டுகள் இல்லை', bn: 'কোনো কুণ্ডলী পাওয়া যায়নি' },
  noChartsDesc:     { en: 'Generate your kundali first to use the Family Command Center.', hi: 'फैमिली कमांड सेंटर का उपयोग करने के लिए पहले अपनी कुंडली बनाएं।', ta: 'குடும்பக் கட்டுப்பாட்டு மையத்தைப் பயன்படுத்த முதலில் உங்கள் குண்டலியை உருவாக்கவும்.', bn: 'পরিবার কমান্ড সেন্টার ব্যবহার করতে প্রথমে আপনার কুণ্ডলী তৈরি করুন।' },
  goToKundali:      { en: 'Go to Kundali', hi: 'कुंडली पर जाएं', ta: 'குண்டலிக்கு செல்லவும்', bn: 'কুণ্ডলীতে যান' },
  onlyYouTitle:     { en: 'Only Your Chart Found', hi: 'केवल आपकी कुंडली मिली', ta: 'உங்கள் சார்ட் மட்டுமே கிடைத்தது', bn: 'শুধুমাত্র আপনার কুণ্ডলী পাওয়া গেছে' },
  onlyYouDesc:      { en: 'Add family members by saving their charts on the Kundali page with a relationship tag.', hi: 'कुंडली पृष्ठ पर रिश्ते का टैग लगाकर परिवार के सदस्यों की कुंडली सहेजें।', ta: 'குண்டலி பக்கத்தில் உறவு குறிச்சொல்லுடன் குடும்ப உறுப்பினர்களின் சார்ட்டுகளைச் சேமிக்கவும்.', bn: 'কুণ্ডলী পৃষ্ঠায় সম্পর্কের ট্যাগ দিয়ে পরিবারের সদস্যদের কুণ্ডলী সংরক্ষণ করুন।' },
  loading:          { en: 'Computing family status...', hi: 'परिवार स्थिति की गणना हो रही है...', ta: 'குடும்ப நிலையைக் கணக்கிடுகிறது...', bn: 'পরিবারের অবস্থা গণনা করা হচ্ছে...' },
  statusCards:      { en: 'Member Status', hi: 'सदस्य स्थिति', ta: 'உறுப்பினர் நிலை', bn: 'সদস্যের অবস্থা' },
  collectiveTitle:  { en: 'Collective Muhurta Finder', hi: 'सामूहिक मुहूर्त खोजें', ta: 'கூட்டு முஹூர்த்தம் கண்டுபிடிப்பான்', bn: 'সম্মিলিত মুহূর্ত অনুসন্ধান' },
  activity:         { en: 'Activity', hi: 'गतिविधि', ta: 'செயல்பாடு', bn: 'কার্যকলাপ' },
  month:            { en: 'Month', hi: 'माह', ta: 'மாதம்', bn: 'মাস' },
  findBestTime:     { en: 'Find Best Time for Everyone', hi: 'सबके लिए सर्वोत्तम समय खोजें', ta: 'அனைவருக்கும் சிறந்த நேரத்தைக் கண்டறியவும்', bn: 'সবার জন্য সেরা সময় খুঁজুন' },
  scanning:         { en: 'Scanning...', hi: 'खोज रहे हैं...', ta: 'ஸ்கேன் செய்கிறது...', bn: 'স্ক্যান করা হচ্ছে...' },
  bestWindows:      { en: 'Best collective windows', hi: 'सर्वोत्तम सामूहिक समय', ta: 'சிறந்த கூட்டு நேரங்கள்', bn: 'সেরা সম্মিলিত সময়' },
  score:            { en: 'Score', hi: 'अंक', ta: 'மதிப்பெண்', bn: 'স্কোর' },
  noWindows:        { en: 'No suitable collective windows found for this period.', hi: 'इस अवधि के लिए कोई उपयुक्त सामूहिक समय नहीं मिला।', ta: 'இந்த காலத்திற்கு பொருத்தமான கூட்டு நேரங்கள் காணப்படவில்லை.', bn: 'এই সময়ের জন্য কোনো উপযুক্ত সম্মিলিত সময় পাওয়া যায়নি।' },
  critical:         { en: 'CRITICAL', hi: 'गंभीर', ta: 'முக்கியம்', bn: 'জরুরি' },
  watch:            { en: 'WATCH', hi: 'ध्यान दें', ta: 'கவனம்', bn: 'নজরে রাখুন' },
  stable:           { en: 'STABLE', hi: 'स्थिर', ta: 'நிலையானது', bn: 'স্থিতিশীল' },
  favorable:        { en: 'FAVORABLE', hi: 'अनुकूल', ta: 'சாதகமான', bn: 'অনুকূল' },
  dashaLabel:       { en: 'Dasha', hi: 'दशा', ta: 'தசை', bn: 'দশা' },
  antarEnds:        { en: 'Antar ends', hi: 'अंतर्दशा समाप्ति', ta: 'அந்தர தசை முடிவு', bn: 'অন্তর্দশা শেষ' },
  dashaTransition:  { en: 'Dasha transition approaching', hi: 'दशा परिवर्तन निकट', ta: 'தசை மாற்றம் நெருங்குகிறது', bn: 'দশা পরিবর্তন আসন্ন' },
  sadeSatiLabel:    { en: 'Sade Sati', hi: 'साढ़े साती', ta: 'சாடே சாதி', bn: 'সাড়ে সাতি' },
  rising:           { en: 'Rising', hi: 'आरोही', ta: 'உயர்வு', bn: 'উত্থান' },
  peak:             { en: 'Peak', hi: 'चरम', ta: 'உச்சம்', bn: 'শীর্ষ' },
  setting:          { en: 'Setting', hi: 'अवरोही', ta: 'இறக்கம்', bn: 'অবরোহ' },
  familyDynamics:   { en: 'Family Dynamics', hi: 'पारिवारिक गतिशीलता', ta: 'குடும்ப இயக்கவியல்', bn: 'পারিবারিক গতিশীলতা' },
  self:             { en: 'Self', hi: 'स्वयं', ta: 'நான்', bn: 'নিজে' },
  spouse:           { en: 'Spouse', hi: 'जीवनसाथी', ta: 'வாழ்க்கைத் துணை', bn: 'জীবনসঙ্গী' },
  child:            { en: 'Child', hi: 'संतान', ta: 'குழந்தை', bn: 'সন্তান' },
  parent:           { en: 'Parent', hi: 'माता-पिता', ta: 'பெற்றோர்', bn: 'পিতা-মাতা' },
  sibling:          { en: 'Sibling', hi: 'भाई-बहन', ta: 'உடன்பிறப்பு', bn: 'ভাই-বোন' },
  friend:           { en: 'Friend', hi: 'मित्र', ta: 'நண்பர்', bn: 'বন্ধু' },
  other:            { en: 'Other', hi: 'अन्य', ta: 'மற்றவை', bn: 'অন্যান্য' },
  error:            { en: 'Something went wrong. Please try again.', hi: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।', ta: 'ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.', bn: 'কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
};

function L(key: keyof typeof LABELS, locale: string): string {
  return tl(LABELS[key], locale);
}

// ---------------------------------------------------------------------------
// Saved chart type (matches dashboard)
// ---------------------------------------------------------------------------

interface SavedChart {
  id: string;
  label: string;
  birth_data: BirthData;
  is_primary: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Attention level styles
// ---------------------------------------------------------------------------

const ATTENTION_STYLES: Record<string, { dot: string; border: string; bg: string; label: string }> = {
  critical:  { dot: 'bg-red-500',    border: 'border-red-500/30',    bg: 'bg-red-500/10',    label: 'text-red-400' },
  watch:     { dot: 'bg-amber-500',  border: 'border-amber-500/20',  bg: 'bg-amber-500/10',  label: 'text-amber-400' },
  stable:    { dot: 'bg-emerald-500', border: 'border-emerald-500/15', bg: 'bg-emerald-500/10', label: 'text-emerald-400' },
  favorable: { dot: 'bg-blue-400',   border: 'border-blue-400/20',   bg: 'bg-blue-400/10',   label: 'text-blue-400' },
};

// ---------------------------------------------------------------------------
// Month helpers
// ---------------------------------------------------------------------------

function getMonthOptions(): { value: string; label: string }[] {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    options.push({ value: `${y}-${m}`, label });
  }
  return options;
}

function getMonthDateRange(monthVal: string): [string, string] {
  const [y, m] = monthVal.split('-').map(Number);
  const start = `${y}-${String(m).padStart(2, '0')}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return [start, end];
}

// ---------------------------------------------------------------------------
// Current transit Saturn/Jupiter signs (computed once)
// ---------------------------------------------------------------------------

function getCurrentTransitSigns(): { saturnSign: number; jupiterSign: number } {
  const now = new Date();
  const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 12);
  const planets = getPlanetaryPositions(jd);
  // planets[6] = Saturn, planets[4] = Jupiter — these are tropical longitudes
  const saturnSid = toSidereal(planets[6].longitude, jd);
  const jupiterSid = toSidereal(planets[4].longitude, jd);
  return {
    saturnSign: getRashiNumber(saturnSid),
    jupiterSign: getRashiNumber(jupiterSid),
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FamilyCommandCenter() {
  const locale = useLocale() as Locale;
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  const { user, initialized: authInit } = useAuthStore();
  const { lat, lng, timezone } = useLocationStore();

  // --- State ---
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [memberStatuses, setMemberStatuses] = useState<MemberStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collective muhurta state
  const [selectedActivity, setSelectedActivity] = useState<ExtendedActivityId>('marriage');
  const [selectedMonth, setSelectedMonth] = useState(() => getMonthOptions()[0]?.value ?? '');
  const [muhurtaWindows, setMuhurtaWindows] = useState<CollectiveMuhurtaWindow[]>([]);
  const [muhurtaScanning, setMuhurtaScanning] = useState(false);
  const [muhurtaScanned, setMuhurtaScanned] = useState(false);

  const activities = useMemo(() => getAllExtendedActivities(), []);
  const monthOptions = useMemo(() => getMonthOptions(), []);

  // --- Fetch saved charts and compute member statuses ---
  const loadFamilyData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Supabase client not available');
        setLoading(false);
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from('saved_charts')
        .select('id, label, birth_data, is_primary, created_at')
        .order('created_at', { ascending: true });

      if (fetchErr) {
        console.error('[FamilyCommand] fetch charts error:', fetchErr);
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      const savedCharts = (data ?? []) as SavedChart[];
      setCharts(savedCharts);

      if (savedCharts.length === 0) {
        setMemberStatuses([]);
        setLoading(false);
        return;
      }

      // Compute current transit positions once
      const { saturnSign, jupiterSign } = getCurrentTransitSigns();
      const today = new Date();

      // Generate kundali for each chart and compute status
      const statuses: MemberStatus[] = [];
      for (const chart of savedCharts) {
        try {
          const bd = chart.birth_data;
          // generateKundali expects BirthData with all fields
          const kundali: KundaliData = generateKundali({
            name: bd.name ?? chart.label,
            date: bd.date,
            time: bd.time,
            place: bd.place ?? '',
            lat: bd.lat,
            lng: bd.lng,
            timezone: bd.timezone ?? 'UTC',
            ayanamsha: bd.ayanamsha ?? 'lahiri',
            relationship: bd.relationship,
          });

          // Generate tippanni for authoritative dosha detection (single source of truth)
          const tippanni = generateTippanni(kundali, locale as 'en' | 'hi' | 'sa');
          const tippanniDoshas = tippanni.doshas.map((d: DoshaInsight) => ({
            name: d.name,
            present: d.present,
            severity: d.severity,
            effectiveSeverity: d.effectiveSeverity,
          }));

          const status = computeMemberStatus({
            name: bd.name ?? chart.label,
            relationship: bd.relationship ?? (chart.is_primary ? 'self' : 'other'),
            chartId: chart.id,
            kundali,
            currentSaturnSign: saturnSign,
            currentJupiterSign: jupiterSign,
            today,
            tippanniDoshas,
          });
          statuses.push(status);
        } catch (err) {
          console.error(`[FamilyCommand] Error computing status for chart ${chart.id}:`, err);
          // Skip this chart but continue with others
        }
      }

      // Sort by attention level: critical > watch > stable > favorable
      const ORDER: Record<string, number> = { critical: 0, watch: 1, stable: 2, favorable: 3 };
      statuses.sort((a, b) => (ORDER[a.attention] ?? 9) - (ORDER[b.attention] ?? 9));

      setMemberStatuses(statuses);
    } catch (err) {
      console.error('[FamilyCommand] loadFamilyData error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authInit && user) {
      loadFamilyData();
    } else if (authInit && !user) {
      setLoading(false);
    }
  }, [authInit, user, loadFamilyData]);

  // --- Collective muhurta scan ---
  const handleMuhurtaScan = useCallback(() => {
    if (memberStatuses.length === 0) return;
    if (!lat || !lng) return;

    setMuhurtaScanning(true);
    setMuhurtaScanned(false);

    // NOTE: requestAnimationFrame prevents UI freeze but still runs on the main thread.
    // For truly non-blocking computation, a Web Worker would be needed. The muhurta scan
    // is fast enough (~50-200ms) that this is acceptable for now.
    requestAnimationFrame(() => {
      try {
        const [startDate, endDate] = getMonthDateRange(selectedMonth);

        // Build member inputs from charts
        const members: FamilyMemberInput[] = [];
        for (const chart of charts) {
          try {
            const bd = chart.birth_data;
            const kundali = generateKundali({
              name: bd.name ?? chart.label,
              date: bd.date,
              time: bd.time,
              place: bd.place ?? '',
              lat: bd.lat,
              lng: bd.lng,
              timezone: bd.timezone ?? 'UTC',
              ayanamsha: bd.ayanamsha ?? 'lahiri',
            });

            // Get birth nakshatra (1-27) and rashi (1-12) from Moon position
            const moonPos = kundali.planets[1]; // Moon = index 1
            members.push({
              name: bd.name ?? chart.label,
              birthNakshatra: moonPos?.nakshatra?.id ?? 1,
              birthRashi: moonPos?.sign ?? 1,
            });
          } catch (err) {
            console.error(`[FamilyCommand] muhurta: skip chart ${chart.id}:`, err);
          }
        }

        if (members.length === 0) {
          setMuhurtaWindows([]);
          setMuhurtaScanning(false);
          setMuhurtaScanned(true);
          return;
        }

        // Compute tz offset for the location
        const now = new Date();
        const tz = getUTCOffsetForDate(
          now.getUTCFullYear(),
          now.getUTCMonth() + 1,
          now.getUTCDate(),
          timezone ?? 'UTC',
        );

        const result = findCollectiveMuhurta({
          members,
          activity: selectedActivity,
          startDate,
          endDate,
          lat,
          lng,
          tz,
        });

        setMuhurtaWindows(result.topWindows);
      } catch (err) {
        console.error('[FamilyCommand] muhurta scan error:', err);
        setMuhurtaWindows([]);
      } finally {
        setMuhurtaScanning(false);
        setMuhurtaScanned(true);
      }
    });
  }, [memberStatuses, charts, selectedActivity, selectedMonth, lat, lng, timezone]);

  // --- Derived counts ---
  const attentionCount = memberStatuses.filter(
    (s) => s.attention === 'critical' || s.attention === 'watch',
  ).length;

  // =========================================================================
  // Render: auth gate
  // =========================================================================

  if (!authInit) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
          <Users className="w-12 h-12 text-gold-primary/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gold-light mb-3" style={headingStyle}>
            {L('pageTitle', locale)}
          </h1>
          <p className="text-text-secondary mb-6" style={bodyStyle}>
            {L('signInPrompt', locale)}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gold-primary/15 hover:bg-gold-primary/25 text-gold-light px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Render: loading
  // =========================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-5xl mx-auto px-4 pt-24">
          <div className="flex items-center gap-3 mb-8">
            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
            <span className="text-text-secondary text-sm" style={bodyStyle}>
              {L('loading', locale)}
            </span>
          </div>
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-2xl p-4 animate-pulse">
                <div className="h-4 w-24 bg-white/[0.06] rounded mb-3" />
                <div className="h-3 w-full bg-white/[0.04] rounded mb-2" />
                <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Render: error
  // =========================================================================

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-sm mb-4" style={bodyStyle}>{L('error', locale)}</p>
          <button
            type="button"
            onClick={loadFamilyData}
            className="text-gold-primary text-sm hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Render: no charts
  // =========================================================================

  if (charts.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
          <Users className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gold-light mb-2" style={headingStyle}>
            {L('noChartsTitle', locale)}
          </h1>
          <p className="text-text-secondary text-sm mb-6" style={bodyStyle}>
            {L('noChartsDesc', locale)}
          </p>
          <Link
            href="/kundali"
            className="inline-flex items-center gap-2 bg-gold-primary/15 hover:bg-gold-primary/25 text-gold-light px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {L('goToKundali', locale)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Render: main dashboard
  // =========================================================================

  const hasFamilyMembers = charts.length > 1 || charts.some((c) => c.birth_data.relationship && c.birth_data.relationship !== 'self');

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-2" style={headingStyle}>
            {L('pageTitle', locale)}
          </h1>
          <p className="text-text-secondary text-sm" style={bodyStyle}>
            {memberStatuses.length} {L('members', locale)}
            {attentionCount > 0 && (
              <span className="ml-2 text-amber-400">
                · {attentionCount}{' '}
                {attentionCount === 1 ? L('needsAttention', locale) : L('needAttention', locale)}
              </span>
            )}
          </p>
        </div>

        {/* ── Only-self hint ── */}
        {!hasFamilyMembers && (
          <div className="mb-6 rounded-xl bg-blue-400/5 border border-blue-400/15 p-4">
            <p className="text-blue-300 text-sm font-medium mb-1" style={bodyStyle}>
              {L('onlyYouTitle', locale)}
            </p>
            <p className="text-text-secondary text-xs" style={bodyStyle}>
              {L('onlyYouDesc', locale)}
            </p>
          </div>
        )}

        {/* ── Status Cards Grid ── */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gold-light mb-4 flex items-center gap-2" style={headingStyle}>
            <Shield className="w-5 h-5 text-gold-primary/60" />
            {L('statusCards', locale)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberStatuses.map((ms) => (
              <MemberStatusCard key={ms.chartId} status={ms} locale={locale} bodyStyle={bodyStyle} />
            ))}
          </div>
        </section>

        {/* ── Collective Muhurta ── */}
        {hasFamilyMembers && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gold-light mb-4 flex items-center gap-2" style={headingStyle}>
              <Calendar className="w-5 h-5 text-gold-primary/60" />
              {L('collectiveTitle', locale)}
            </h2>
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-5 backdrop-blur-sm">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Activity select */}
                <div className="flex-1">
                  <label className="text-text-secondary text-xs mb-1 block" style={bodyStyle}>
                    {L('activity', locale)}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedActivity}
                      onChange={(e) => {
                        setSelectedActivity(e.target.value as ExtendedActivityId);
                        setMuhurtaScanned(false);
                      }}
                      className="w-full bg-white/[0.04] border border-gold-primary/15 rounded-lg px-3 py-2 text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold-primary/40"
                    >
                      {activities.map((a) => (
                        <option key={a.id} value={a.id}>
                          {tl(a.label, locale)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Month select */}
                <div className="sm:w-48">
                  <label className="text-text-secondary text-xs mb-1 block" style={bodyStyle}>
                    {L('month', locale)}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setMuhurtaScanned(false);
                      }}
                      className="w-full bg-white/[0.04] border border-gold-primary/15 rounded-lg px-3 py-2 text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold-primary/40"
                    >
                      {monthOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Scan button */}
              <button
                type="button"
                onClick={handleMuhurtaScan}
                disabled={muhurtaScanning || !lat || !lng}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-primary/15 hover:bg-gold-primary/25 disabled:opacity-40 disabled:cursor-not-allowed text-gold-light px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {muhurtaScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {L('scanning', locale)}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    {L('findBestTime', locale)}
                  </>
                )}
              </button>

              {!lat && !lng && (
                <p className="text-amber-400/80 text-xs mt-2">
                  Set your location first to find muhurta windows.
                </p>
              )}

              {/* Results */}
              {muhurtaScanned && (
                <div className="mt-5 pt-4 border-t border-gold-primary/10">
                  {muhurtaWindows.length === 0 ? (
                    <p className="text-text-secondary text-sm" style={bodyStyle}>
                      {L('noWindows', locale)}
                    </p>
                  ) : (
                    <>
                      <h3 className="text-text-primary text-sm font-medium mb-3" style={bodyStyle}>
                        {L('bestWindows', locale)}
                      </h3>
                      <div className="space-y-3">
                        {muhurtaWindows.slice(0, 5).map((w, idx) => (
                          <MuhurtaWindowCard key={`${w.date}-${w.startTime}-${idx}`} window={w} rank={idx + 1} locale={locale} bodyStyle={bodyStyle} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Family Dynamics (existing FamilyCard) ── */}
        <section>
          <h2 className="text-lg font-semibold text-gold-light mb-4 flex items-center gap-2" style={headingStyle}>
            <Star className="w-5 h-5 text-gold-primary/60" />
            {L('familyDynamics', locale)}
          </h2>
          <FamilyCard locale={locale} />
        </section>
      </div>
    </div>
  );
}

// ===========================================================================
// Sub-components
// ===========================================================================

function MemberStatusCard({
  status,
  locale,
  bodyStyle,
}: {
  status: MemberStatus;
  locale: string;
  bodyStyle?: React.CSSProperties;
}) {
  const style = ATTENTION_STYLES[status.attention] ?? ATTENTION_STYLES.stable;
  const relKey = status.relationship as keyof typeof LABELS;
  const relLabel = LABELS[relKey] ? L(relKey, locale) : status.relationship;
  const phaseKey = status.sadeSati.phase as keyof typeof LABELS | null;

  return (
    <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${style.border} rounded-2xl p-4 backdrop-blur-sm transition-colors`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-text-primary text-sm font-semibold" style={bodyStyle}>
            {status.name}
          </h3>
          <span className="text-text-secondary text-xs">{relLabel}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.label}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {L(status.attention as keyof typeof LABELS, locale)}
        </span>
      </div>

      {/* Dasha */}
      <div className="mb-2">
        <span className="text-text-secondary text-xs">{L('dashaLabel', locale)}: </span>
        <span className="text-text-primary text-xs font-medium">
          {status.currentDasha.mahaLord} &ndash; {status.currentDasha.antarLord}
        </span>
        <span className="text-text-secondary text-xs ml-2">
          ({L('antarEnds', locale)} {status.currentDasha.antarEnd})
        </span>
      </div>

      {/* Dasha transition warning */}
      {status.currentDasha.isDashaTransition && (
        <div className="flex items-center gap-1.5 mb-2 text-amber-400 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{L('dashaTransition', locale)}</span>
        </div>
      )}

      {/* Sade Sati */}
      {status.sadeSati.isActive && phaseKey && (() => {
        const SADE_SATI_DESC: Record<string, string> = {
          rising: 'initial phase \u2014 Saturn enters the sign before your Moon',
          peak: 'most intense phase \u2014 Saturn is on your Moon sign',
          setting: 'final phase \u2014 Saturn is in the sign after your Moon, intensity decreasing',
        };
        const desc = SADE_SATI_DESC[phaseKey] ?? '';
        return (
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-medium"
              title={`Sade Sati (${phaseKey} phase): Saturn is transiting near the natal Moon sign. This 7.5-year period brings karmic lessons, discipline, and transformation. ${phaseKey} phase is the ${desc}.`}
            >
              {L('sadeSatiLabel', locale)} ({L(phaseKey, locale)})
            </span>
          </div>
        );
      })()}

      {/* Dosha flags */}
      {status.doshaFlags && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {status.doshaFlags.manglik && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${status.doshaFlags.manglikCancelled ? 'border-green-500/20 text-green-400 bg-green-500/10' : 'border-red-500/20 text-red-400 bg-red-500/10'}`}
              title={status.doshaFlags.manglikCancelled
                ? 'Manglik Dosha (Cancelled): Mars is in a Manglik house but cancellation conditions are met (e.g., Mars in own sign, Jupiter\'s aspect, benefic conjunction). The dosha is effectively neutralized \u2014 no special remedies needed.'
                : 'Manglik Dosha: Mars is in a marital house (1st, 2nd, 4th, 7th, 8th, or 12th). This can cause delays or conflicts in marriage. Remedies include Kumbh Vivah, Mangal Shanti Puja, and marrying another Manglik.'}
            >
              ♂ Manglik{status.doshaFlags.manglikCancelled ? ' ✓' : ''}
            </span>
          )}
          {status.doshaFlags.kaalSarpa && (() => {
            const ksType = status.doshaFlags.kaalSarpaType ?? '';
            const KS_THEMES: Record<string, string> = {
              'Anant': 'self-identity and health', 'Kulika': 'wealth and family',
              'Vasuki': 'courage and communication', 'Shankhapala': 'home and emotional security',
              'Padma': 'children and creativity', 'Mahapadma': 'enemies and health',
              'Takshaka': 'marriage and partnerships', 'Karkotak': 'longevity and transformation',
              'Shankhachud': 'luck and dharma', 'Ghatak': 'career and reputation',
              'Vishdhar': 'gains and ambitions', 'Sheshnag': 'foreign lands and liberation',
            };
            const theme = KS_THEMES[ksType] ?? 'various life areas';
            return (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/20 text-purple-400 bg-purple-500/10"
                title={`Kaal Sarpa Dosha${ksType ? ` (${ksType})` : ''}: All planets are hemmed between Rahu and Ketu. This karmic pattern causes periodic obstacles and delays.${ksType ? ` The ${ksType} type specifically affects ${theme}.` : ''} Remedies: Kaal Sarp Nivaran Puja at Trimbakeshwar, Maha Mrityunjaya Mantra.`}
              >
                ☊ Kaal Sarpa{ksType ? ` (${ksType})` : ''}
              </span>
            );
          })()}
          {status.doshaFlags.moolaNakshatra && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-400 bg-amber-500/10"
              title="Ganda Mula Nakshatra: Born in a junction nakshatra at the border between water and fire signs. Traditionally requires Mula Shanti puja for the child's wellbeing."
            >
              ✦ Ganda Mula
            </span>
          )}
        </div>
      )}

      {/* Transit alerts (top 2) */}
      {status.transitAlerts.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/[0.04] space-y-1">
          {status.transitAlerts.slice(0, 2).map((alert, i) => {
            const sevColor =
              alert.severity === 'positive'
                ? 'text-emerald-400'
                : alert.severity === 'challenging'
                  ? 'text-red-400'
                  : 'text-text-secondary';
            return (
              <p key={i} className={`text-xs ${sevColor}`} style={bodyStyle}>
                {alert.description}
              </p>
            );
          })}
        </div>
      )}

      {/* Upcoming transit article links — personalized to this member's Moon sign */}
      {(() => {
        const moonSign = status.sadeSati.moonSign;
        if (!moonSign || moonSign < 1 || moonSign > 12) return null;
        const moonRashi = RASHIS[moonSign - 1];
        // Find upcoming transit articles that are relevant
        const articleLinks = Object.values(TRANSIT_ARTICLES)
          .filter(a => new Date(a.endDate) > new Date()) // not expired
          .slice(0, 2) // max 2
          .map(a => {
            const effect = getMoonSignEffect(a.slug, moonSign);
            if (!effect) return null;
            const house = effect.house;
            return { slug: a.slug, planetId: a.planetId, title: a.title, headline: effect.headline, house };
          })
          .filter(Boolean);

        if (articleLinks.length === 0) return null;
        return (
          <div className="mt-2 pt-2 border-t border-white/[0.04] space-y-1.5">
            {articleLinks.map((link) => link && (
              <Link
                key={link.slug}
                href={`/learn/transits/${link.slug}` as '/learn/transits/jupiter-in-cancer-2026'}
                className="flex items-start gap-2 text-xs text-gold-primary/60 hover:text-gold-light transition-colors group"
              >
                <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span style={bodyStyle}>
                  <span className="text-gold-primary/80 font-medium">{link.title.en.split(':')[0]}</span>
                  {' — '}
                  {link.house}{locale === 'en' ? (link.house === 1 ? 'st' : link.house === 2 ? 'nd' : link.house === 3 ? 'rd' : 'th') : ''} {locale === 'hi' ? 'भाव' : 'house'}
                  {': '}{link.headline}
                </span>
              </Link>
            ))}
          </div>
        );
      })()}

      {/* Attention reason */}
      <p className="mt-2 text-text-secondary text-[11px] italic" style={bodyStyle}>
        {status.attentionReason}
      </p>
    </div>
  );
}

function MuhurtaWindowCard({
  window: w,
  rank,
  locale,
  bodyStyle,
}: {
  window: CollectiveMuhurtaWindow;
  rank: number;
  locale: string;
  bodyStyle?: React.CSSProperties;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-gold-primary/15 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gold-primary/15 text-gold-light text-xs flex items-center justify-center font-semibold">
            {rank}
          </span>
          <span className="text-text-primary text-sm font-medium" style={bodyStyle}>
            {w.date}
          </span>
          <span className="text-text-secondary text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {w.startTime} &ndash; {w.endTime}
          </span>
        </div>
        <span className="text-gold-light text-sm font-semibold">
          {L('score', locale)}: {w.collectiveScore}
        </span>
      </div>
      {/* Per-member scores */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {w.memberScores.map((ms) => (
          <span key={ms.name} className="text-text-secondary text-xs" style={bodyStyle}>
            {ms.name}: <span className="text-text-primary font-medium">{ms.score}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
