'use client';
import { tl } from '@/lib/utils/trilingual';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { DashaEntry } from '@/types/kundali';
import type { Locale,  LocaleText} from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Planet interpretations (brief, for the alert card)
// ---------------------------------------------------------------------------
const PLANET_INTERPRETATIONS: Record<string, LocaleText> = {
  sun:     { en: 'Authority, career recognition, vitality', hi: 'अधिकार, करियर में मान्यता, जीवन शक्ति', sa: 'अधिकार, करियर में मान्यता, जीवन शक्ति', mai: 'अधिकार, करियर में मान्यता, जीवन शक्ति', mr: 'अधिकार, करियर में मान्यता, जीवन शक्ति', ta: 'Authority, career recognition, vitality', te: 'Authority, career recognition, vitality', bn: 'Authority, career recognition, vitality', kn: 'Authority, career recognition, vitality', gu: 'Authority, career recognition, vitality' },
  moon:    { en: 'Emotional peace, public image, mother\'s blessings', hi: 'मानसिक शान्ति, सार्वजनिक छवि, माता का आशीर्वाद' },
  mars:    { en: 'Energy, courage, property matters, competition', hi: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', sa: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', mai: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', mr: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', ta: 'Energy, courage, property matters, competition', te: 'Energy, courage, property matters, competition', bn: 'Energy, courage, property matters, competition', kn: 'Energy, courage, property matters, competition', gu: 'Energy, courage, property matters, competition' },
  mercury: { en: 'Communication, business, intellect, education', hi: 'संवाद, व्यापार, बुद्धि, शिक्षा', sa: 'संवाद, व्यापार, बुद्धि, शिक्षा', mai: 'संवाद, व्यापार, बुद्धि, शिक्षा', mr: 'संवाद, व्यापार, बुद्धि, शिक्षा', ta: 'Communication, business, intellect, education', te: 'Communication, business, intellect, education', bn: 'Communication, business, intellect, education', kn: 'Communication, business, intellect, education', gu: 'Communication, business, intellect, education' },
  jupiter: { en: 'Wisdom, expansion, wealth, spiritual growth', hi: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', sa: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', mai: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', mr: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', ta: 'Wisdom, expansion, wealth, spiritual growth', te: 'Wisdom, expansion, wealth, spiritual growth', bn: 'Wisdom, expansion, wealth, spiritual growth', kn: 'Wisdom, expansion, wealth, spiritual growth', gu: 'Wisdom, expansion, wealth, spiritual growth' },
  venus:   { en: 'Love, luxury, arts, marriage, material comfort', hi: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', sa: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', mai: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', mr: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', ta: 'Love, luxury, arts, marriage, material comfort', te: 'Love, luxury, arts, marriage, material comfort', bn: 'Love, luxury, arts, marriage, material comfort', kn: 'Love, luxury, arts, marriage, material comfort', gu: 'Love, luxury, arts, marriage, material comfort' },
  saturn:  { en: 'Discipline, hard work, karma, restructuring', hi: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', sa: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', mai: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', mr: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', ta: 'Discipline, hard work, karma, restructuring', te: 'Discipline, hard work, karma, restructuring', bn: 'Discipline, hard work, karma, restructuring', kn: 'Discipline, hard work, karma, restructuring', gu: 'Discipline, hard work, karma, restructuring' },
  rahu:    { en: 'Ambition, foreign connections, technology, unconventional paths', hi: 'महत्वाकांक्षा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग', sa: 'महत्वाकांक्षा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग', mai: 'महत्वाकांक्षा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग', mr: 'महत्वाकांक्षा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग', ta: 'Ambition, foreign connections, technology, unconventional paths', te: 'Ambition, foreign connections, technology, unconventional paths', bn: 'Ambition, foreign connections, technology, unconventional paths', kn: 'Ambition, foreign connections, technology, unconventional paths', gu: 'Ambition, foreign connections, technology, unconventional paths' },
  ketu:    { en: 'Spirituality, detachment, past-life karma, liberation', hi: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', sa: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', mai: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', mr: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', ta: 'Spirituality, detachment, past-life karma, liberation', te: 'Spirituality, detachment, past-life karma, liberation', bn: 'Spirituality, detachment, past-life karma, liberation', kn: 'Spirituality, detachment, past-life karma, liberation', gu: 'Spirituality, detachment, past-life karma, liberation' },
};

// ---------------------------------------------------------------------------
// Planet accent colors
// ---------------------------------------------------------------------------
const PLANET_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  sun:     { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'shadow-orange-500/15' },
  moon:    { border: 'border-sky-400/30', bg: 'bg-sky-400/10', text: 'text-sky-300', glow: 'shadow-sky-400/15' },
  mars:    { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/15' },
  mercury: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/15' },
  jupiter: { border: 'border-amber-400/30', bg: 'bg-amber-400/10', text: 'text-amber-300', glow: 'shadow-amber-400/15' },
  venus:   { border: 'border-pink-400/30', bg: 'bg-pink-400/10', text: 'text-pink-300', glow: 'shadow-pink-400/15' },
  saturn:  { border: 'border-indigo-400/30', bg: 'bg-indigo-400/10', text: 'text-indigo-300', glow: 'shadow-indigo-400/15' },
  rahu:    { border: 'border-slate-400/30', bg: 'bg-slate-400/10', text: 'text-slate-300', glow: 'shadow-slate-400/15' },
  ketu:    { border: 'border-violet-400/30', bg: 'bg-violet-400/10', text: 'text-violet-300', glow: 'shadow-violet-400/15' },
};

const DEFAULT_COLOR = { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-300', glow: 'shadow-purple-500/15' };

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Upcoming Dasha Transition',
    headingPlural: 'Upcoming Dasha Transitions',
    mahadasha: 'Mahadasha',
    antardasha: 'Antardasha',
    beginsIn: (n: number) => n === 0 ? 'Begins today' : n === 1 ? 'Begins tomorrow' : `Begins in ${n} days`,
    viewDasha: 'View Dasha Timeline',
    noTransitions: 'No dasha transitions in the next 90 days',
  },
  hi: {
    heading: 'आगामी दशा परिवर्तन',
    headingPlural: 'आगामी दशा परिवर्तन',
    mahadasha: 'महादशा',
    antardasha: 'अन्तर्दशा',
    beginsIn: (n: number) => n === 0 ? 'आज आरम्भ' : n === 1 ? 'कल आरम्भ' : `${n} दिनों में आरम्भ`,
    viewDasha: 'दशा समयरेखा देखें',
    noTransitions: 'अगले 90 दिनों में कोई दशा परिवर्तन नहीं',
  },
  sa: {
    heading: 'आगामिदशापरिवर्तनम्',
    headingPlural: 'आगामिदशापरिवर्तनानि',
    mahadasha: 'महादशा',
    antardasha: 'अन्तर्दशा',
    beginsIn: (n: number) => n === 0 ? 'अद्य आरम्भः' : n === 1 ? 'श्वः आरम्भः' : `${n} दिनेषु आरम्भः`,
    viewDasha: 'दशासमयरेखां पश्यतु',
    noTransitions: 'आगामिषु ९० दिनेषु दशापरिवर्तनं नास्ति',
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UpcomingTransition {
  planet: string;
  planetName: LocaleText;
  level: 'maha' | 'antar';
  startDate: string;
  daysUntil: number;
}

// ---------------------------------------------------------------------------
// Find upcoming transitions
// ---------------------------------------------------------------------------
function findUpcomingTransitions(dashaTimeline: DashaEntry[]): UpcomingTransition[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const limit = new Date(today.getTime() + 90 * 86400000);
  const transitions: UpcomingTransition[] = [];

  for (const maha of dashaTimeline) {
    const mahaStart = new Date(maha.startDate);
    // Check mahadasha start
    if (mahaStart >= today && mahaStart <= limit) {
      const diffMs = mahaStart.getTime() - today.getTime();
      const daysUntil = Math.round(diffMs / 86400000);
      transitions.push({
        planet: maha.planet,
        planetName: maha.planetName,
        level: 'maha',
        startDate: maha.startDate,
        daysUntil,
      });
    }

    // Check antardasha starts
    if (maha.subPeriods) {
      for (const antar of maha.subPeriods) {
        const antarStart = new Date(antar.startDate);
        if (antarStart >= today && antarStart <= limit) {
          const diffMs = antarStart.getTime() - today.getTime();
          const daysUntil = Math.round(diffMs / 86400000);
          transitions.push({
            planet: antar.planet,
            planetName: antar.planetName,
            level: 'antar',
            startDate: antar.startDate,
            daysUntil,
          });
        }
      }
    }
  }

  // Sort by soonest first
  transitions.sort((a, b) => a.daysUntil - b.daysUntil);
  // Return first 3 max
  return transitions.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface DashaTransitionAlertProps {
  dashaTimeline: DashaEntry[];
  locale: Locale;
  kundaliId?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashaTransitionAlert({ dashaTimeline, locale, kundaliId }: DashaTransitionAlertProps) {
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || (isDevanagariLocale(locale) ? LABELS.hi : LABELS.en);
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  const transitions = useMemo(() => {
    if (!dashaTimeline || dashaTimeline.length === 0) return [];
    return findUpcomingTransitions(dashaTimeline);
  }, [dashaTimeline]);

  if (transitions.length === 0) return null;

  const dashaLink = kundaliId
    ? `/kundali/${kundaliId}#dasha` as const
    : '/dashboard/dashas' as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/40 to-[#0a0e27] backdrop-blur-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={headingFont}>
            {transitions.length === 1 ? L.heading : L.headingPlural}
          </h3>
        </div>

        {/* Transition cards */}
        <div className="space-y-3 mt-4">
          {transitions.map((tr, i) => {
            const planetKey = tr.planet.toLowerCase();
            const colors = PLANET_COLORS[planetKey] || DEFAULT_COLOR;
            const interp = PLANET_INTERPRETATIONS[planetKey];
            const isUrgent = tr.daysUntil <= 7;
            const dateFormatted = new Date(tr.startDate).toLocaleDateString(
              isHi ? 'hi-IN' : 'en-IN',
              { month: 'short', day: 'numeric', year: 'numeric' }
            );

            return (
              <motion.div
                key={`${tr.level}-${tr.planet}-${tr.startDate}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className={`relative p-4 rounded-xl border ${colors.border} ${isUrgent ? `shadow-lg ${colors.glow}` : ''} transition-all`}
                style={{
                  background: isUrgent
                    ? 'linear-gradient(135deg, rgba(127,29,29,0.12), rgba(30,20,60,0.5))'
                    : 'linear-gradient(135deg, rgba(45,27,105,0.25), rgba(10,14,39,0.5))',
                }}
              >
                {/* Urgency glow ring for <= 7 days */}
                {isUrgent && (
                  <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/25 animate-pulse pointer-events-none" />
                )}

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Planet color accent + countdown */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      <Clock className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : `${colors.bg} ${colors.text} border ${colors.border}`
                    }`}>
                      {tr.daysUntil}d
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm font-bold ${colors.text}`} style={bodyFont}>
                        {tr.planetName[locale] || tr.planetName.en}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                        tr.level === 'maha'
                          ? 'bg-gold-primary/15 text-gold-light border-gold-primary/25'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                      }`}>
                        {tr.level === 'maha' ? L.mahadasha : L.antardasha}
                      </span>
                    </div>

                    <p className="text-text-primary text-sm font-medium" style={bodyFont}>
                      {L.beginsIn(tr.daysUntil)} ({dateFormatted})
                    </p>

                    {interp && (
                      <p className="text-text-secondary text-xs mt-1 leading-relaxed" style={bodyFont}>
                        {isHi ? interp.hi : interp.en}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Link to dasha page */}
        <div className="mt-4 text-center">
          <Link
            href={dashaLink}
            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            style={bodyFont}
          >
            {L.viewDasha}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
