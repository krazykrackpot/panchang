'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles, Clock, AlertTriangle, Orbit } from 'lucide-react';
import type { PanchangData, Locale, HoraSlot } from '@/types/panchang';
import type { PersonalizedDay } from '@/lib/personalization/types';

// ---------------------------------------------------------------------------
// Labels (en / hi)
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: "Today's Cosmic Weather",
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    vara: 'Vara',
    hora: 'Hora Now',
    rahuKaal: 'Rahu Kaal',
    moonTransit: 'Moon Transit',
    shukla: 'Shukla',
    krishna: 'Krishna',
    fastDay: 'fast day',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    neutral: 'Neutral',
    rulingPlanet: 'Ruling planet',
    rahuActive: 'Rahu Kaal active now!',
    rahuUpcoming: 'Rahu Kaal',
    bestHora: 'Best hora now',
    wisdom: 'wisdom, education',
    wealth: 'wealth, finance',
    energy: 'energy, action',
    communication: 'intellect, trade',
    beauty: 'love, luxury',
    discipline: 'patience, karma',
    emotions: 'mind, intuition',
    houseLabel: 'house',
    moonInYour: 'Moon transiting your',
    masa: 'Masa',
    samvatsara: 'Samvatsara',
  },
  hi: {
    heading: 'आज का ब्रह्माण्डीय मौसम',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    vara: 'वार',
    hora: 'वर्तमान होरा',
    rahuKaal: 'राहु काल',
    moonTransit: 'चन्द्र गोचर',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रत दिवस',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    rulingPlanet: 'स्वामी ग्रह',
    rahuActive: 'राहु काल अभी सक्रिय!',
    rahuUpcoming: 'राहु काल',
    bestHora: 'वर्तमान शुभ होरा',
    wisdom: 'ज्ञान, शिक्षा',
    wealth: 'धन, वित्त',
    energy: 'शक्ति, क्रिया',
    communication: 'बुद्धि, व्यापार',
    beauty: 'प्रेम, विलास',
    discipline: 'धैर्य, कर्म',
    emotions: 'मन, अन्तर्ज्ञान',
    houseLabel: 'भाव',
    moonInYour: 'चन्द्र आपके',
    masa: 'मास',
    samvatsara: 'सम्वत्सर',
  },
  sa: {
    heading: 'अद्य ब्रह्माण्डवातावरणम्',
    tithi: 'तिथिः',
    nakshatra: 'नक्षत्रम्',
    yoga: 'योगः',
    vara: 'वारः',
    hora: 'वर्तमानहोरा',
    rahuKaal: 'राहुकालः',
    moonTransit: 'चन्द्रगोचरः',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रतदिवसः',
    auspicious: 'शुभम्',
    inauspicious: 'अशुभम्',
    neutral: 'सामान्यम्',
    rulingPlanet: 'स्वामिग्रहः',
    rahuActive: 'राहुकालः अधुना सक्रियः!',
    rahuUpcoming: 'राहुकालः',
    bestHora: 'वर्तमानशुभहोरा',
    wisdom: 'ज्ञानम्, शिक्षा',
    wealth: 'धनम्, वित्तम्',
    energy: 'शक्तिः, क्रिया',
    communication: 'बुद्धिः, वाणिज्यम्',
    beauty: 'प्रेम, विलासः',
    discipline: 'धैर्यम्, कर्म',
    emotions: 'मनः, अन्तर्ज्ञानम्',
    houseLabel: 'भावः',
    moonInYour: 'चन्द्रः भवतः',
    masa: 'मासः',
    samvatsara: 'सम्वत्सरः',
  },
};

// ---------------------------------------------------------------------------
// Hora domain descriptions keyed by planet english name (lowercase)
// ---------------------------------------------------------------------------
const HORA_DOMAINS: Record<string, { en: string; hi: string; sa: string }> = {
  jupiter: { en: 'wisdom, education', hi: 'ज्ञान, शिक्षा', sa: 'ज्ञानम्, शिक्षा' },
  venus: { en: 'love, luxury, arts', hi: 'प्रेम, विलास, कला', sa: 'प्रेम, विलासः, कला' },
  mercury: { en: 'intellect, trade', hi: 'बुद्धि, व्यापार', sa: 'बुद्धिः, वाणिज्यम्' },
  sun: { en: 'authority, vitality', hi: 'अधिकार, ऊर्जा', sa: 'अधिकारः, ऊर्जा' },
  moon: { en: 'mind, intuition', hi: 'मन, अन्तर्ज्ञान', sa: 'मनः, अन्तर्ज्ञानम्' },
  mars: { en: 'energy, action', hi: 'शक्ति, क्रिया', sa: 'शक्तिः, क्रिया' },
  saturn: { en: 'patience, discipline', hi: 'धैर्य, अनुशासन', sa: 'धैर्यम्, अनुशासनम्' },
};

// Ekadashi tithi numbers (both shukla and krishna)
const EKADASHI_TITHIS = [11, 26]; // 11 = Shukla Ekadashi, 26 = Krishna Ekadashi
const FAST_TITHIS = [11, 26, 4, 19, 8, 23, 14, 29, 30]; // Ekadashi, Chaturthi, Ashtami, Chaturdashi, Amavasya, Purnima

// ---------------------------------------------------------------------------
// Helper: is time "HH:MM" within a range
// ---------------------------------------------------------------------------
function isTimeInRange(nowHHMM: string, start: string, end: string): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const n = toMin(nowHHMM);
  const s = toMin(start);
  const e = toMin(end);
  return n >= s && n < e;
}

function getCurrentHora(horas: HoraSlot[] | undefined, nowHHMM: string): HoraSlot | null {
  if (!horas || horas.length === 0) return null;
  return horas.find(h => isTimeInRange(nowHHMM, h.startTime, h.endTime)) || null;
}

// House transit implications (1-12)
const HOUSE_IMPLICATIONS: Record<number, { en: string; hi: string }> = {
  1: { en: 'focus on self, new beginnings', hi: 'आत्म-ध्यान, नई शुरुआत' },
  2: { en: 'finances and family matters', hi: 'धन और परिवार के मामले' },
  3: { en: 'communication and courage', hi: 'संवाद और साहस' },
  4: { en: 'home comfort and inner peace', hi: 'घरेलू सुख और मानसिक शान्ति' },
  5: { en: 'creativity and romance', hi: 'रचनात्मकता और प्रेम' },
  6: { en: 'health and overcoming challenges', hi: 'स्वास्थ्य और चुनौतियों पर विजय' },
  7: { en: 'partnerships and relationships', hi: 'साझेदारी और सम्बन्ध' },
  8: { en: 'transformation and hidden matters', hi: 'परिवर्तन और गुप्त मामले' },
  9: { en: 'luck, dharma, and higher learning', hi: 'भाग्य, धर्म और उच्च शिक्षा' },
  10: { en: 'career and public recognition', hi: 'करियर और सार्वजनिक मान्यता' },
  11: { en: 'gains and social connections', hi: 'लाभ और सामाजिक सम्पर्क' },
  12: { en: 'rest, spirituality, and letting go', hi: 'विश्राम, अध्यात्म और त्याग' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface MorningBriefingProps {
  panchangData: PanchangData;
  personalizedDay: PersonalizedDay | null;
  locale: Locale;
}

export default function MorningBriefing({ panchangData, personalizedDay, locale }: MorningBriefingProps) {
  const L = LABELS[locale] || LABELS.en;

  // Current time as HH:MM
  const nowHHMM = useMemo(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  // Rahu Kaal status
  const rahuKaal = panchangData.rahuKaal;
  const rahuActive = rahuKaal ? isTimeInRange(nowHHMM, rahuKaal.start, rahuKaal.end) : false;

  // Current Hora
  const currentHora = getCurrentHora(panchangData.hora, nowHHMM);
  const horaDomain = currentHora
    ? HORA_DOMAINS[currentHora.planet.en.toLowerCase()] || null
    : null;

  // Fast day check
  const isFastDay = FAST_TITHIS.includes(panchangData.tithi.number);
  const isEkadashi = EKADASHI_TITHIS.includes(panchangData.tithi.number);

  // Moon transit house (from personalized data)
  const moonHouse = personalizedDay?.chandraBala?.houseFromMoon || null;
  const moonImplication = moonHouse ? (HOUSE_IMPLICATIONS[moonHouse] || null) : null;

  // Paksha label
  const pakshaLabel = panchangData.tithi.paksha === 'shukla' ? L.shukla : L.krishna;

  // Yoga nature label
  const yogaNatureLabel = panchangData.yoga.nature === 'auspicious'
    ? L.auspicious
    : panchangData.yoga.nature === 'inauspicious'
      ? L.inauspicious
      : L.neutral;

  // Gregorian date display
  const gregDate = panchangData.date; // "YYYY-MM-DD"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.5 }}
      className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0f0d2e]/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-purple-500/15 via-purple-400/10 to-gold-primary/10 border-b border-purple-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.heading}
          </h3>
        </div>
        <span className="text-xs text-text-secondary/70 font-mono">{gregDate}</span>
      </div>

      {/* Hindu calendar line */}
      {(panchangData.masa || panchangData.samvatsara) && (
        <div className="px-5 py-2 bg-gold-primary/[0.04] border-b border-purple-500/10 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary/80">
          {panchangData.samvatsara && (
            <span>
              <span className="text-gold-primary/70 font-semibold">{L.samvatsara}:</span>{' '}
              {panchangData.samvatsara[locale] || panchangData.samvatsara.en}
            </span>
          )}
          {panchangData.masa && (
            <span>
              <span className="text-gold-primary/70 font-semibold">{L.masa}:</span>{' '}
              {panchangData.masa[locale] || panchangData.masa.en}
            </span>
          )}
          {panchangData.vikramSamvat && (
            <span>
              <span className="text-gold-primary/70 font-semibold">VS:</span> {panchangData.vikramSamvat}
            </span>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Tithi */}
        <BriefingCell
          label={L.tithi}
          icon={<Moon className="w-4 h-4" />}
          value={panchangData.tithi.name[locale] || panchangData.tithi.name.en}
          sub={
            <>
              {pakshaLabel}
              {(isEkadashi || isFastDay) && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400">
                  {L.fastDay}
                </span>
              )}
            </>
          }
        />

        {/* 2. Nakshatra */}
        <BriefingCell
          label={L.nakshatra}
          icon={<Sparkles className="w-4 h-4" />}
          value={panchangData.nakshatra.name[locale] || panchangData.nakshatra.name.en}
          sub={`${L.rulingPlanet}: ${panchangData.nakshatra.rulerName[locale] || panchangData.nakshatra.rulerName.en}`}
        />

        {/* 3. Yoga */}
        <BriefingCell
          label={L.yoga}
          icon={<Orbit className="w-4 h-4" />}
          value={panchangData.yoga.name[locale] || panchangData.yoga.name.en}
          sub={
            <span className={
              panchangData.yoga.nature === 'auspicious'
                ? 'text-emerald-400'
                : panchangData.yoga.nature === 'inauspicious'
                  ? 'text-red-400'
                  : 'text-text-secondary'
            }>
              {yogaNatureLabel}
            </span>
          }
        />

        {/* 4. Vara */}
        <BriefingCell
          label={L.vara}
          icon={<Sun className="w-4 h-4" />}
          value={panchangData.vara.name[locale] || panchangData.vara.name.en}
          sub={`${L.rulingPlanet}: ${panchangData.vara.ruler[locale] || panchangData.vara.ruler.en}`}
        />

        {/* 5. Hora suggestion */}
        {currentHora && (
          <BriefingCell
            label={L.hora}
            icon={<Clock className="w-4 h-4" />}
            value={currentHora.planet[locale] || currentHora.planet.en}
            sub={
              horaDomain
                ? (horaDomain as Record<string, string>)[locale] || horaDomain.en
                : `${currentHora.startTime} - ${currentHora.endTime}`
            }
            highlight={currentHora.nature === 'auspicious'}
          />
        )}

        {/* 6. Rahu Kaal */}
        {rahuKaal && (
          <BriefingCell
            label={L.rahuKaal}
            icon={<AlertTriangle className="w-4 h-4" />}
            value={`${rahuKaal.start} - ${rahuKaal.end}`}
            sub={rahuActive ? L.rahuActive : L.rahuUpcoming}
            warning={rahuActive}
          />
        )}

        {/* 7. Moon transit (personal) */}
        {moonHouse && moonImplication && (
          <BriefingCell
            label={L.moonTransit}
            icon={<Moon className="w-4 h-4" />}
            value={`${moonHouse}${(locale !== 'hi' && String(locale) !== 'sa') ? ordinalSuffix(moonHouse) : ''} ${L.houseLabel}`}
            sub={(moonImplication as Record<string, string>)[locale === 'sa' ? 'en' : locale] || moonImplication.en}
            className="col-span-2 lg:col-span-1"
            personal
          />
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: individual cell
// ---------------------------------------------------------------------------
interface BriefingCellProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  sub: React.ReactNode;
  highlight?: boolean;
  warning?: boolean;
  personal?: boolean;
  className?: string;
}

function BriefingCell({ label, icon, value, sub, highlight, warning, personal, className }: BriefingCellProps) {
  const borderClass = warning
    ? 'border-amber-500/30 bg-amber-500/[0.06]'
    : highlight
      ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
      : personal
        ? 'border-purple-400/20 bg-purple-500/[0.04]'
        : 'border-white/[0.06] bg-white/[0.02]';

  const iconColor = warning
    ? 'text-amber-400'
    : highlight
      ? 'text-emerald-400'
      : personal
        ? 'text-purple-400'
        : 'text-gold-primary/70';

  return (
    <div className={`rounded-xl border p-3.5 ${borderClass} ${className || ''}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/60">
          {label}
        </span>
      </div>
      <p className="text-base font-semibold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </p>
      <p className="text-xs text-text-secondary mt-1 leading-snug">
        {sub}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ordinal suffix for English house numbers
// ---------------------------------------------------------------------------
function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
