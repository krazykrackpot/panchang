/**
 * Upcoming Celestial Events Engine
 *
 * Aggregates retrograde periods, eclipses, and combustion events from existing
 * calendar engines and annotates each with a "survival guide" of do's and don'ts
 * drawn from Vedic astrology traditions.
 *
 * Architecture: thin aggregation layer over retro-combust.ts and eclipse-data.ts.
 * No redundant astronomical computation.
 */

import { generateRetrogradeCalendar, generateCombustionCalendar, type RetroPeriod } from './retro-combust';
import { getEclipsesForYear, type EclipseData } from './eclipse-data';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SurvivalGuideItem {
  en: string;
  hi: string;
  [key: string]: string | undefined;
}

export interface KeyDate {
  date: string;
  label: { en: string; hi: string };
}

export interface SurvivalGuide {
  dos: SurvivalGuideItem[];
  donts: SurvivalGuideItem[];
  keyDates: KeyDate[];
}

export interface CelestialEvent {
  id: string;
  type: 'retrograde' | 'eclipse' | 'combustion';
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  date: string;       // YYYY-MM-DD (start date)
  endDate?: string;    // YYYY-MM-DD (for retrogrades/combustions)
  planet?: number;     // planet ID (0-based)
  planetColor?: string;
  daysUntil: number;
  isActive: boolean;   // true if currently between start and end date
  survivalGuide: SurvivalGuide;
}

// ---------------------------------------------------------------------------
// Survival Guide Content (hardcoded per planet/event type)
// ---------------------------------------------------------------------------

const RETROGRADE_GUIDES: Record<number, { dos: SurvivalGuideItem[]; donts: SurvivalGuideItem[] }> = {
  // Saturn (6)
  6: {
    dos: [
      { en: 'Review long-term commitments and restructure plans', hi: 'दीर्घकालिक प्रतिबद्धताओं की समीक्षा करें और योजनाएं पुनर्गठित करें' },
      { en: 'Practice patience and complete pending tasks', hi: 'धैर्य रखें और अधूरे कार्यों को पूरा करें' },
      { en: 'Focus on self-discipline and spiritual practice', hi: 'आत्म-अनुशासन और आध्यात्मिक साधना पर ध्यान दें' },
    ],
    donts: [
      { en: 'Start new long-term ventures or major investments', hi: 'नए दीर्घकालिक उद्यम या बड़े निवेश शुरू न करें' },
      { en: 'Sign long-term contracts or make binding commitments', hi: 'दीर्घकालिक अनुबंध या बाध्यकारी प्रतिबद्धताएं न करें' },
      { en: 'Rush important decisions — delays are natural now', hi: 'महत्वपूर्ण निर्णयों में जल्दबाजी न करें — विलंब स्वाभाविक है' },
    ],
  },
  // Mercury (3)
  3: {
    dos: [
      { en: 'Review and revise documents carefully', hi: 'दस्तावेजों की सावधानीपूर्वक समीक्षा और संशोधन करें' },
      { en: 'Back up digital data and important files', hi: 'डिजिटल डेटा और महत्वपूर्ण फाइलों का बैकअप लें' },
      { en: 'Reconnect with old contacts and revisit past ideas', hi: 'पुराने संपर्कों से जुड़ें और पिछले विचारों पर पुनर्विचार करें' },
    ],
    donts: [
      { en: 'Sign important contracts or legal documents', hi: 'महत्वपूर्ण अनुबंध या कानूनी दस्तावेज़ पर हस्ताक्षर न करें' },
      { en: 'Buy electronics or start new communication projects', hi: 'इलेक्ट्रॉनिक्स न खरीदें या नई संचार परियोजनाएं शुरू न करें' },
      { en: 'Launch products or make major announcements', hi: 'उत्पाद लॉन्च या बड़ी घोषणाएं न करें' },
    ],
  },
  // Jupiter (4)
  4: {
    dos: [
      { en: 'Focus on inner growth and revisit personal beliefs', hi: 'आंतरिक विकास और व्यक्तिगत विश्वासों पर पुनर्विचार करें' },
      { en: 'Deepen spiritual practice and self-study', hi: 'आध्यात्मिक साधना और स्वाध्याय को गहरा करें' },
      { en: 'Reflect on past opportunities and lessons learned', hi: 'पिछले अवसरों और सीखे गए पाठों पर चिंतन करें' },
    ],
    donts: [
      { en: 'Expand business aggressively or over-commit resources', hi: 'व्यापार का आक्रामक विस्तार या संसाधनों की अधिक प्रतिबद्धता न करें' },
      { en: 'Take unnecessary legal risks or litigation', hi: 'अनावश्यक कानूनी जोखिम या मुकदमेबाज़ी से बचें' },
      { en: 'Make impulsive religious or philosophical commitments', hi: 'आवेगपूर्ण धार्मिक या दार्शनिक प्रतिबद्धताएं न करें' },
    ],
  },
  // Venus (5)
  5: {
    dos: [
      { en: 'Reflect on relationship patterns and values', hi: 'संबंधों के पैटर्न और मूल्यों पर चिंतन करें' },
      { en: 'Revisit creative projects and artistic pursuits', hi: 'रचनात्मक परियोजनाओं और कलात्मक कार्यों पर पुनर्विचार करें' },
      { en: 'Appreciate existing beauty and comforts in life', hi: 'जीवन की मौजूदा सुंदरता और सुख-सुविधाओं की सराहना करें' },
    ],
    donts: [
      { en: 'Start new romantic relationships impulsively', hi: 'आवेगपूर्ण रूप से नए रोमांटिक संबंध शुरू न करें' },
      { en: 'Make major luxury purchases or cosmetic changes', hi: 'बड़ी विलासिता की खरीदारी या कॉस्मेटिक बदलाव न करें' },
      { en: 'Overspend on entertainment or indulgences', hi: 'मनोरंजन या भोग-विलास पर अधिक खर्च न करें' },
    ],
  },
  // Mars (2)
  2: {
    dos: [
      { en: 'Channel energy into completing existing projects', hi: 'मौजूदा परियोजनाओं को पूरा करने में ऊर्जा लगाएं' },
      { en: 'Practice anger management and physical exercise', hi: 'क्रोध प्रबंधन और शारीरिक व्यायाम का अभ्यास करें' },
      { en: 'Review strategies and avoid confrontation', hi: 'रणनीतियों की समीक्षा करें और टकराव से बचें' },
    ],
    donts: [
      { en: 'Start new competitive ventures or fights', hi: 'नए प्रतिस्पर्धी उद्यम या लड़ाई शुरू न करें' },
      { en: 'Undergo elective surgery if avoidable', hi: 'यदि संभव हो तो ऐच्छिक शल्य चिकित्सा से बचें' },
      { en: 'Make aggressive moves in business or legal matters', hi: 'व्यापार या कानूनी मामलों में आक्रामक कदम न उठाएं' },
    ],
  },
};

const ECLIPSE_GUIDES: Record<string, { dos: SurvivalGuideItem[]; donts: SurvivalGuideItem[] }> = {
  solar: {
    dos: [
      { en: 'Meditate and set positive intentions for the cycle ahead', hi: 'ध्यान करें और आगामी चक्र के लिए सकारात्मक संकल्प लें' },
      { en: 'Perform charity, donate food or clothes', hi: 'दान-पुण्य करें, भोजन या वस्त्र दान करें' },
      { en: 'Chant mantras — especially Surya mantra (108 times)', hi: 'मंत्र जाप करें — विशेषकर सूर्य मंत्र (108 बार)' },
    ],
    donts: [
      { en: 'Start new ventures or sign important contracts', hi: 'नए उद्यम शुरू न करें या महत्वपूर्ण अनुबंधों पर हस्ताक्षर न करें' },
      { en: 'Eat or cook food during the eclipse period (Sutak)', hi: 'ग्रहण काल (सूतक) में भोजन न करें और न बनाएं' },
      { en: 'Look directly at the eclipse without proper eye protection', hi: 'उचित आंख सुरक्षा के बिना ग्रहण को सीधे न देखें' },
    ],
  },
  lunar: {
    dos: [
      { en: 'Practice meditation and mantra japa', hi: 'ध्यान और मंत्र जाप का अभ्यास करें' },
      { en: 'Perform acts of charity and compassion', hi: 'दान और करुणा के कार्य करें' },
      { en: 'Take a ritual bath after the eclipse ends', hi: 'ग्रहण समाप्ति के बाद स्नान करें' },
    ],
    donts: [
      { en: 'Eat or cook food during the eclipse (Sutak rules)', hi: 'ग्रहण के दौरान भोजन न करें और न पकाएं (सूतक नियम)' },
      { en: 'Start new work or begin important undertakings', hi: 'नया काम शुरू न करें या महत्वपूर्ण कार्य आरंभ न करें' },
      { en: 'Sleep during the eclipse period', hi: 'ग्रहण के समय सोएं नहीं' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Planet name helpers
// ---------------------------------------------------------------------------

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'बृहस्पति' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
};

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

/**
 * Gather upcoming celestial events (retrogrades + eclipses) relative to a
 * reference date. Returns events within the next `daysAhead` days, sorted
 * by date ascending.
 *
 * Also includes events that are currently active (started before reference
 * date but haven't ended yet).
 */
export function getUpcomingEvents(
  year: number,
  month: number,
  day: number,
  daysAhead: number = 60,
): CelestialEvent[] {
  const refDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const refMs = new Date(`${refDateStr}T00:00:00Z`).getTime();
  const horizonMs = refMs + daysAhead * 86400000;
  const horizonStr = new Date(horizonMs).toISOString().slice(0, 10);

  const events: CelestialEvent[] = [];

  // ── Retrogrades ───────────────────────────────────────────────────────
  // Check current year and next year to catch events spanning year boundary
  const yearsToCheck = month >= 11 ? [year, year + 1] : [year];
  const seenRetro = new Set<string>();

  for (const y of yearsToCheck) {
    const retros = generateRetrogradeCalendar(y);
    for (const r of retros) {
      const key = `retro-${r.planetId}-${r.startDate}`;
      if (seenRetro.has(key)) continue;
      seenRetro.add(key);

      // Include if: starts within horizon OR currently active (started before ref, ends after ref)
      const startsInWindow = r.startDate >= refDateStr && r.startDate <= horizonStr;
      const isActive = r.startDate <= refDateStr && r.endDate >= refDateStr;
      if (!startsInWindow && !isActive) continue;

      const startMs = new Date(`${r.startDate}T00:00:00Z`).getTime();
      const daysUntil = isActive ? 0 : Math.ceil((startMs - refMs) / 86400000);
      const pName = PLANET_NAMES[r.planetId] || { en: `Planet ${r.planetId}`, hi: `ग्रह ${r.planetId}` };
      const guide = RETROGRADE_GUIDES[r.planetId] || RETROGRADE_GUIDES[6];

      events.push({
        id: `${r.planetId === 6 ? 'saturn' : r.planetId === 3 ? 'mercury' : r.planetId === 4 ? 'jupiter' : r.planetId === 5 ? 'venus' : 'mars'}-retrograde-${r.startDate.slice(0, 7)}`,
        type: 'retrograde',
        title: {
          en: `${pName.en} Retrograde`,
          hi: `${pName.hi} वक्री`,
        },
        description: {
          en: `${pName.en} turns retrograde from ${formatDateEN(r.startDate)} to ${formatDateEN(r.endDate)} (${r.durationDays} days)`,
          hi: `${pName.hi} ${formatDateHI(r.startDate)} से ${formatDateHI(r.endDate)} तक वक्री (${r.durationDays} दिन)`,
        },
        date: r.startDate,
        endDate: r.endDate,
        planet: r.planetId,
        planetColor: r.planetColor,
        daysUntil,
        isActive,
        survivalGuide: {
          dos: guide.dos,
          donts: guide.donts,
          keyDates: buildRetroKeyDates(r),
        },
      });
    }
  }

  // ── Eclipses ──────────────────────────────────────────────────────────
  for (const y of yearsToCheck) {
    const eclipses = getEclipsesForYear(y);
    for (const ecl of eclipses) {
      if (ecl.date < refDateStr || ecl.date > horizonStr) continue;

      const eclMs = new Date(`${ecl.date}T00:00:00Z`).getTime();
      const daysUntil = Math.ceil((eclMs - refMs) / 86400000);
      const isSolar = ecl.kind === 'solar';
      const eclType = isSolar ? 'solar' : 'lunar';
      const subtype = ecl.type;
      const guide = ECLIPSE_GUIDES[eclType] || ECLIPSE_GUIDES.solar;

      events.push({
        id: `${eclType}-eclipse-${ecl.date}`,
        type: 'eclipse',
        title: {
          en: `${capitalize(subtype)} ${isSolar ? 'Solar' : 'Lunar'} Eclipse`,
          hi: `${ECLIPSE_SUBTYPE_HI[subtype] || subtype} ${isSolar ? 'सूर्य' : 'चन्द्र'} ग्रहण`,
        },
        description: {
          en: `A ${subtype} ${eclType} eclipse on ${formatDateEN(ecl.date)}`,
          hi: `${formatDateHI(ecl.date)} को ${ECLIPSE_SUBTYPE_HI[subtype] || subtype} ${isSolar ? 'सूर्य' : 'चन्द्र'} ग्रहण`,
        },
        date: ecl.date,
        planet: isSolar ? 0 : 1,
        planetColor: isSolar ? '#e67e22' : '#ecf0f1',
        daysUntil,
        isActive: false,
        survivalGuide: {
          dos: guide.dos,
          donts: guide.donts,
          keyDates: [{ date: ecl.date, label: { en: 'Eclipse day', hi: 'ग्रहण दिवस' } }],
        },
      });
    }
  }

  // Sort by date ascending, active events first
  events.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.date.localeCompare(b.date);
  });

  return events;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ECLIPSE_SUBTYPE_HI: Record<string, string> = {
  total: 'पूर्ण',
  partial: 'आंशिक',
  annular: 'वलयाकार',
  penumbral: 'उपछाया',
  hybrid: 'संकर',
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_HI = ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अग', 'सित', 'अक्तू', 'नव', 'दिस'];

function formatDateEN(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${MONTH_EN[m - 1]} ${d}`;
}

function formatDateHI(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTH_HI[m - 1]}`;
}

function buildRetroKeyDates(r: RetroPeriod): KeyDate[] {
  const dates: KeyDate[] = [
    { date: r.startDate, label: { en: 'Retrograde begins', hi: 'वक्री आरम्भ' } },
    { date: r.endDate, label: { en: 'Goes direct', hi: 'मार्गी होता है' } },
  ];
  // Add midpoint
  const startMs = new Date(`${r.startDate}T00:00:00Z`).getTime();
  const endMs = new Date(`${r.endDate}T00:00:00Z`).getTime();
  const midMs = startMs + (endMs - startMs) / 2;
  const midDate = new Date(midMs).toISOString().slice(0, 10);
  dates.splice(1, 0, { date: midDate, label: { en: 'Deepest retrograde', hi: 'गहनतम वक्री' } });
  return dates;
}
