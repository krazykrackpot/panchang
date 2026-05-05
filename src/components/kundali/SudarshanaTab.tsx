'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHA_ABBREVIATIONS, GRAHAS } from '@/lib/constants/grahas';
import { generateSudarshana, type RingData, type RingSegment } from '@/lib/kundali/sudarshana';
import type { DetailedRingAnalysis } from '@/lib/kundali/sudarshana-interpretation';
import type { KundaliData } from '@/types/kundali';
import { dateToJD, getPlanetaryPositions, toSidereal, getAyanamsha, getRashiNumber, type AyanamshaType } from '@/lib/ephem/astronomical';

interface SudarshanaTabProps {
  kundali: KundaliData;
  locale: string;
}

// Full locale-aware sign names for the SVG
const SIGN_NAMES: Record<number, Record<string, string>> = {
  1:  { en: 'Aries',    hi: 'मेष',     ta: 'மேஷம்',    bn: 'মেষ' },
  2:  { en: 'Taurus',   hi: 'वृषभ',    ta: 'ரிஷபம்',   bn: 'বৃষ' },
  3:  { en: 'Gemini',   hi: 'मिथुन',   ta: 'மிதுனம்',   bn: 'মিথুন' },
  4:  { en: 'Cancer',   hi: 'कर्क',    ta: 'கடகம்',    bn: 'কর্কট' },
  5:  { en: 'Leo',      hi: 'सिंह',    ta: 'சிம்மம்',   bn: 'সিংহ' },
  6:  { en: 'Virgo',    hi: 'कन्या',   ta: 'கன்னி',    bn: 'কন্যা' },
  7:  { en: 'Libra',    hi: 'तुला',    ta: 'துலாம்',    bn: 'তুলা' },
  8:  { en: 'Scorpio',  hi: 'वृश्चिक',  ta: 'விருச்சிகம்', bn: 'বৃশ্চিক' },
  9:  { en: 'Sagitt.',  hi: 'धनु',     ta: 'தனுசு',    bn: 'ধনু' },
  10: { en: 'Capri.',   hi: 'मकर',     ta: 'மகரம்',    bn: 'মকর' },
  11: { en: 'Aquarius', hi: 'कुम्भ',   ta: 'கும்பம்',   bn: 'কুম্ভ' },
  12: { en: 'Pisces',   hi: 'मीन',     ta: 'மீனம்',    bn: 'মீன' },
};

// Planet colors keyed by planet id (0=Sun through 8=Ketu)
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#c0c0c0', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f1c40f', 5: '#e91e9f', 6: '#95a5a6', 7: '#3498db', 8: '#9b59b6',
};

// Full locale-aware planet names
const PLANET_NAMES: Record<number, Record<string, string>> = {
  0: { en: 'Sun',     hi: 'सूर्य',    ta: 'சூரியன்',  bn: 'সূর্য' },
  1: { en: 'Moon',    hi: 'चन्द्र',   ta: 'சந்திரன்', bn: 'চন্দ্র' },
  2: { en: 'Mars',    hi: 'मंगल',    ta: 'செவ்வாய்', bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध',     ta: 'புதன்',   bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', ta: 'வியாழன்', bn: 'বৃহস্পতি' },
  5: { en: 'Venus',   hi: 'शुक्र',   ta: 'சுக்கிரன்', bn: 'শুক্র' },
  6: { en: 'Saturn',  hi: 'शनि',    ta: 'சனி',     bn: 'শনি' },
  7: { en: 'Rahu',    hi: 'राहु',    ta: 'ராகு',    bn: 'রাহু' },
  8: { en: 'Ketu',    hi: 'केतु',    ta: 'கேது',    bn: 'কেতু' },
};

// Ring configuration — large, bold visualization
const OUTER_R = 400;
const MID_R = 300;
const INNER_R = 200;
const CENTER_R = 100;

const SVG_SIZE = 900;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;

export default function SudarshanaTab({ kundali, locale }: SudarshanaTabProps) {
  const isTamil = locale === 'ta';
  const isEn = locale === 'en' || isTamil;

  // Calculate current age from birth date
  const birthYear = parseInt(kundali.birthData.date.slice(0, 4), 10);
  const now = new Date();
  const defaultAge = Math.max(1, Math.min(120, now.getFullYear() - birthYear));

  const [age, setAge] = useState(defaultAge);
  const [showTransits, setShowTransits] = useState(false);

  const data = useMemo(
    () => generateSudarshana(kundali, age),
    [kundali, age],
  );

  // Compute transit planet positions for birth date + age years
  const transitPlanets = useMemo(() => {
    if (!showTransits) return null;
    try {
      const birthDate = kundali.birthData.date; // ISO date string
      const [y, m, d] = birthDate.split('-').map(Number);
      // Target date = birth + age years (use ms arithmetic per CLAUDE.md rule P)
      const birthMs = Date.UTC(y, m - 1, d, 12);
      const targetMs = birthMs + age * 365.25 * 24 * 60 * 60 * 1000;
      const targetDate = new Date(targetMs);
      const tYear = targetDate.getUTCFullYear();
      const tMonth = targetDate.getUTCMonth() + 1;
      const tDay = targetDate.getUTCDate();
      const jd = dateToJD(tYear, tMonth, tDay, 12);
      const positions = getPlanetaryPositions(jd);
      const ayanamsha = getAyanamsha(jd, (kundali.birthData?.ayanamsha as AyanamshaType) || 'lahiri');

      // Map each planet to its sidereal rashi
      return positions.map((p, i) => {
        const sidLng = toSidereal(p.longitude, jd, ayanamsha);
        const rashi = getRashiNumber(sidLng);
        const graha = GRAHAS[i];
        return {
          id: i,
          abbr: GRAHA_ABBREVIATIONS[i] || graha?.name?.en?.slice(0, 2) || `P${i}`,
          name: graha?.name || { en: `Planet ${i}`, hi: `ग्रह ${i}`, sa: `ग्रह ${i}` },
          rashi,
        };
      });
    } catch {
      console.error('[sudarshana] Transit computation failed for age', age);
      return null;
    }
  }, [showTransits, age, kundali.birthData.date]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold-light mb-2">
          {isEn ? 'Sudarshana Chakra' : 'सुदर्शन चक्र'}
        </h2>
        <p className="text-text-secondary text-sm max-w-xl mx-auto mb-3">
          {isEn
            ? 'Three concentric rings show your chart from three perspectives — Lagna (identity), Moon (emotions), and Sun (soul purpose) — simultaneously for each year of life.'
            : 'तीन संकेन्द्रित वलय आपकी कुण्डली को तीन दृष्टिकोणों से दर्शाते हैं — लग्न (पहचान), चन्द्र (भावनाएँ), और सूर्य (आत्म-उद्देश्य)।'}
        </p>
        <details className="inline-block text-left bg-white/[0.02] border border-gold-primary/10 rounded-xl max-w-lg mx-auto">
          <summary className="px-4 py-2 cursor-pointer text-xs text-gold-primary hover:text-gold-light transition-colors">
            {isEn ? 'How to use the Sudarshana Chakra' : 'सुदर्शन चक्र का उपयोग कैसे करें'}
          </summary>
          <div className="px-4 pb-3 text-xs text-text-secondary leading-relaxed">
            {isEn
              ? 'Slide the age slider to any year. The highlighted segment in each ring shows which house (life area) is activated that year from each reference point. When multiple rings highlight the same house, that area becomes intensely important. The outer gold ring = Lagna perspective (external events), the silver middle ring = Moon (emotional experience), the amber inner ring = Sun (soul growth).'
              : 'आयु स्लाइडर को किसी भी वर्ष पर खिसकाएँ। प्रत्येक वलय में हाइलाइट खण्ड बताता है कि उस वर्ष कौन-सा भाव सक्रिय है। जब कई वलय एक ही भाव को हाइलाइट करें, तो वह क्षेत्र अत्यन्त महत्वपूर्ण हो जाता है।'}
          </div>
        </details>
      </div>

      {/* Age slider + Transit toggle */}
      <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">{isEn ? 'Age' : 'आयु'}</span>
          <span className="text-gold-light font-bold text-lg">{age}</span>
          <div className="flex items-center gap-3">
            <span className="text-text-secondary text-xs">
              {isEn ? `Year ${data.birthYear + age}` : `वर्ष ${data.birthYear + age}`}
            </span>
            <button
              onClick={() => setShowTransits(!showTransits)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                showTransits
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-text-secondary hover:text-gold-light hover:border-gold-primary/30'
              }`}
            >
              {showTransits
                ? (isEn ? '● Transits ON' : '● गोचर चालू')
                : (isEn ? '○ Show Transits' : '○ गोचर दिखाएँ')}
            </button>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={120}
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full accent-gold-primary h-2 rounded-full appearance-none bg-white/5 cursor-pointer"
          aria-label={isEn ? 'Select age' : 'आयु चुनें'}
        />
        <div className="flex justify-between text-[10px] text-text-secondary/40 mt-1">
          <span>1</span>
          <span>30</span>
          <span>60</span>
          <span>90</span>
          <span>120</span>
        </div>
      </div>

      {/* SVG Chakra */}
      <div className="flex justify-center">
        <div className="overflow-x-auto max-w-full">
          <SudarshanaChakra
            lagnaRing={data.lagnaRing}
            chandraRing={data.chandraRing}
            suryaRing={data.suryaRing}
            locale={locale}
            transitPlanets={transitPlanets}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(212, 168, 83, 0.7)' }} />
          <span>{isEn ? 'Lagna (outer)' : 'लग्न (बाहरी)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(236, 240, 241, 0.5)' }} />
          <span>{isEn ? 'Chandra (middle)' : 'चन्द्र (मध्य)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(230, 126, 34, 0.6)' }} />
          <span>{isEn ? 'Surya (inner)' : 'सूर्य (आन्तर)'}</span>
        </div>
      </div>

      {/* Educational context */}
      <details className="bg-white/[0.02] border border-gold-primary/10 rounded-xl group">
        <summary className="px-5 py-3 cursor-pointer text-sm text-gold-primary hover:text-gold-light transition-colors flex items-center gap-2">
          <span className="text-base">📖</span>
          {isEn ? 'What is Sudarshana Chakra?' : 'सुदर्शन चक्र क्या है?'}
          <span className="ml-auto text-text-secondary/40 text-xs group-open:rotate-90 transition-transform">▶</span>
        </summary>
        <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
          {data.educationalNote}
        </p>
      </details>

      {/* Convergence insight */}
      {data.interpretation.convergenceNote && (
        <div className="bg-gradient-to-r from-purple-500/10 via-gold-primary/10 to-purple-500/10 border border-gold-primary/20 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-2">
            {isEn ? 'Convergence Insight' : 'अभिसरण विश्लेषण'}
          </h3>
          <p className="text-sm text-text-primary/85 leading-relaxed">
            {data.interpretation.convergenceNote}
          </p>
        </div>
      )}

      {/* This Year's Focus — practical convergence/divergence summary */}
      <ThisYearFocus
        lagnaHouse={data.interpretation.lagna.house}
        chandraHouse={data.interpretation.chandra.house}
        suryaHouse={data.interpretation.surya.house}
        lagnaTheme={data.interpretation.lagna.theme}
        chandraTheme={data.interpretation.chandra.theme}
        suryaTheme={data.interpretation.surya.theme}
        lagnaSign={data.interpretation.lagna.signId}
        chandraSign={data.interpretation.chandra.signId}
        suryaSign={data.interpretation.surya.signId}
        age={age}
        isEn={isEn}
        locale={locale}
      />

      {/* Detailed ring analysis */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6 space-y-4">
        <h3 className="text-gold-light font-semibold">
          {isEn ? `Age ${age} — Annual Analysis` : `आयु ${age} — वार्षिक विश्लेषण`}
        </h3>

        <DetailedRingSection
          ring={data.interpretation.lagna}
          label={isEn ? 'From Lagna (Ascendant)' : 'लग्न से'}
          color="rgba(212, 168, 83, 0.6)"
          isEn={isEn}
          locale={locale}
        />
        <DetailedRingSection
          ring={data.interpretation.chandra}
          label={isEn ? 'From Chandra (Moon)' : 'चन्द्र से'}
          color="rgba(236, 240, 241, 0.5)"
          isEn={isEn}
          locale={locale}
        />
        <DetailedRingSection
          ring={data.interpretation.surya}
          label={isEn ? 'From Surya (Sun)' : 'सूर्य से'}
          color="rgba(230, 126, 34, 0.6)"
          isEn={isEn}
          locale={locale}
        />
      </div>

      {/* Focus areas */}
      {data.interpretation.focusAreas.length > 0 && (
        <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-3">
            {isEn ? 'Focus Areas This Year' : 'इस वर्ष के प्रमुख क्षेत्र'}
          </h3>
          <ul className="space-y-2">
            {data.interpretation.focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary/80">
                <span className="text-gold-primary mt-0.5 shrink-0">●</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cycle & life stage context */}
      <div className="bg-gradient-to-r from-purple-500/8 to-blue-500/8 border border-purple-400/15 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-sm mb-2">
          {isEn
            ? `Life Stage: ${data.interpretation.cycleContext.lifeStage} (Cycle ${data.interpretation.cycleContext.cycleNumber})`
            : `जीवन चरण: ${data.interpretation.cycleContext.lifeStage} (चक्र ${data.interpretation.cycleContext.cycleNumber})`}
        </h3>
        <p className="text-sm text-text-secondary/85 leading-relaxed">
          {data.interpretation.cycleContext.cycleTheme}
        </p>
      </div>

      {/* Vimshottari Dasha overlay */}
      {data.interpretation.dashaContext && (
        <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
          <h3 className="text-gold-light font-semibold text-sm mb-2">
            {isEn ? 'Running Dasha Influence' : 'वर्तमान दशा प्रभाव'}
            <span className="ml-2 text-xs text-text-secondary font-normal">
              {data.interpretation.dashaContext.mahadasha}
              {data.interpretation.dashaContext.antardasha && `–${data.interpretation.dashaContext.antardasha}`}
            </span>
          </h3>
          <p className="text-sm text-text-secondary/85 leading-relaxed">
            {data.interpretation.dashaContext.dashaInfluence}
          </p>
        </div>
      )}

      {/* Monthly sub-periods */}
      <div className="bg-white/[0.02] border border-gold-primary/10 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-sm mb-3">
          {isEn ? 'Monthly Sub-Periods (from Lagna)' : 'मासिक उप-अवधि (लग्न से)'}
        </h3>
        <p className="text-xs text-text-secondary/60 mb-3">
          {isEn
            ? 'Each year divides into 12 monthly sub-periods, each ruled by the next sign from the activated house. The sub-lord colors that month\'s specific themes.'
            : 'प्रत्येक वर्ष 12 मासिक उप-अवधियों में विभाजित होता है, प्रत्येक सक्रिय भाव से अगली राशि द्वारा शासित।'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {data.interpretation.monthlySubPeriods.map(sp => (
            <div
              key={sp.month}
              className="bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-2 text-center hover:border-gold-primary/20 transition-colors"
            >
              <div className="text-[10px] text-text-secondary/50 mb-0.5">
                {isEn ? `Month ${sp.month}` : `मास ${sp.month}`}
              </div>
              <div className="text-xs text-text-primary font-medium">
                {tl(sp.signName, locale)}
              </div>
              <div className="text-[10px] text-gold-primary/70 mt-0.5">
                {sp.lordPlanetName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year comparison */}
      {data.interpretation.yearDelta && age > 1 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <h3 className="text-text-secondary font-semibold text-sm mb-2">
            {isEn ? 'Compared to Last Year' : 'पिछले वर्ष की तुलना में'}
          </h3>
          <p className="text-sm text-text-secondary/80 leading-relaxed">
            {data.interpretation.yearDelta}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── This Year's Focus — practical convergence/divergence summary ──────────

// Short house theme labels for the focus summary
const HOUSE_THEME_SHORT: Record<number, { en: string; hi: string }> = {
  1:  { en: 'self & health', hi: 'आत्म एवं स्वास्थ्य' },
  2:  { en: 'wealth & family', hi: 'धन एवं परिवार' },
  3:  { en: 'courage & communication', hi: 'साहस एवं संवाद' },
  4:  { en: 'home & emotional peace', hi: 'घर एवं मानसिक शान्ति' },
  5:  { en: 'creativity & children', hi: 'रचनात्मकता एवं संतान' },
  6:  { en: 'health & service', hi: 'स्वास्थ्य एवं सेवा' },
  7:  { en: 'partnerships & marriage', hi: 'साझेदारी एवं विवाह' },
  8:  { en: 'transformation & hidden matters', hi: 'परिवर्तन एवं गुप्त विषय' },
  9:  { en: 'fortune & higher learning', hi: 'भाग्य एवं उच्च शिक्षा' },
  10: { en: 'career & reputation', hi: 'करियर एवं प्रतिष्ठा' },
  11: { en: 'gains & aspirations', hi: 'लाभ एवं आकांक्षाएँ' },
  12: { en: 'spirituality & letting go', hi: 'आध्यात्मिकता एवं त्याग' },
};

function ThisYearFocus({
  lagnaHouse, chandraHouse, suryaHouse,
  lagnaTheme, chandraTheme, suryaTheme,
  lagnaSign, chandraSign, suryaSign,
  age, isEn, locale,
}: {
  lagnaHouse: number; chandraHouse: number; suryaHouse: number;
  lagnaTheme: string; chandraTheme: string; suryaTheme: string;
  lagnaSign: number; chandraSign: number; suryaSign: number;
  age: number; isEn: boolean; locale: string;
}) {
  // Determine convergence: are 2+ rings pointing to the same house?
  const houses = [lagnaHouse, chandraHouse, suryaHouse];
  const uniqueHouses = new Set(houses);
  const allSame = uniqueHouses.size === 1;
  const twoSame = uniqueHouses.size === 2;

  // Activated signs for monthly tip
  const activatedSigns = [lagnaSign, chandraSign, suryaSign];
  const signNames = activatedSigns.map(id => {
    const nameObj = SIGN_NAMES[id];
    return nameObj ? (nameObj[locale] || nameObj.en) : '?';
  });
  const uniqueSignNames = [...new Set(signNames)];

  const lt = (h: number) => HOUSE_THEME_SHORT[h] || { en: `house ${h}`, hi: `${h} भाव` };

  let summaryEn: string;
  let summaryHi: string;

  if (allSame) {
    const theme = lt(lagnaHouse);
    summaryEn = `Strong convergence at age ${age} — all three references (Lagna, Moon, Sun) activate the ${ordinal(lagnaHouse)} house. "${theme.en}" is THE dominant theme this year. Focus your energy here for maximum impact. This level of alignment is rare and signals a pivotal year.`;
    summaryHi = `आयु ${age} पर तीव्र अभिसरण — तीनों संदर्भ (लग्न, चन्द्र, सूर्य) ${lagnaHouse}वाँ भाव सक्रिय करते हैं। "${theme.hi}" इस वर्ष का प्रमुख विषय है। अधिकतम प्रभाव के लिए यहाँ अपनी ऊर्जा केन्द्रित करें।`;
  } else if (twoSame) {
    // Find which two match and which is different
    const matchedHouse = houses.find((h, i) => houses.indexOf(h) !== i)!;
    const differentHouse = houses.find(h => h !== matchedHouse)!;
    const matchTheme = lt(matchedHouse);
    const diffTheme = lt(differentHouse);
    summaryEn = `Partial convergence at age ${age} — two references align on the ${ordinal(matchedHouse)} house ("${matchTheme.en}"), making it your primary arena. But the third ring activates the ${ordinal(differentHouse)} house ("${diffTheme.en}"), adding a secondary thread. Prioritize "${matchTheme.en}" while keeping "${diffTheme.en}" on your radar.`;
    summaryHi = `आयु ${age} पर आंशिक अभिसरण — दो संदर्भ ${matchedHouse}वें भाव ("${matchTheme.hi}") पर एकत्र हैं, जो प्राथमिक क्षेत्र है। तीसरा वलय ${differentHouse}वाँ भाव ("${diffTheme.hi}") सक्रिय करता है। "${matchTheme.hi}" को प्राथमिकता दें, "${diffTheme.hi}" पर भी ध्यान रखें।`;
  } else {
    const t1 = lt(lagnaHouse);
    const t2 = lt(chandraHouse);
    const t3 = lt(suryaHouse);
    summaryEn = `Divergent focus at age ${age} — your identity (Lagna → "${t1.en}"), emotions (Moon → "${t2.en}"), and purpose (Sun → "${t3.en}") are activated in different life areas. Expect to juggle multiple priorities. This is a year of breadth rather than depth — balance is key.`;
    summaryHi = `आयु ${age} पर विविध केन्द्र — आपकी पहचान (लग्न → "${t1.hi}"), भावनाएँ (चन्द्र → "${t2.hi}"), और उद्देश्य (सूर्य → "${t3.hi}") विभिन्न क्षेत्रों में सक्रिय हैं। अनेक प्राथमिकताओं को सँभालने की अपेक्षा करें — सन्तुलन महत्त्वपूर्ण है।`;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-500/8 via-gold-primary/8 to-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-2">
        {isEn ? `This Year's Focus (Age ${age})` : `इस वर्ष का केन्द्र (आयु ${age})`}
      </h3>
      <p className="text-sm text-text-primary/85 leading-relaxed mb-3">
        {isEn ? summaryEn : summaryHi}
      </p>
      <div className="mt-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-gold-primary/10">
        <p className="text-xs text-gold-primary/80 font-medium mb-0.5">
          {isEn ? 'Monthly intensity tip' : 'मासिक तीव्रता सुझाव'}
        </p>
        <p className="text-xs text-text-secondary/80 leading-relaxed">
          {isEn
            ? `When transiting Moon passes through ${uniqueSignNames.join(', ')}, the themes above intensify for a few days each month. Track these windows in your monthly panchang for optimal timing.`
            : `जब गोचर चन्द्रमा ${uniqueSignNames.join(', ')} से गुजरे, तो उपरोक्त विषय कुछ दिनों के लिए तीव्र होते हैं। सर्वोत्तम समय के लिए मासिक पंचांग देखें।`}
        </p>
      </div>
    </div>
  );
}

// ─── Detailed ring section (replaces old InterpretationCard) ───────────────

function DetailedRingSection({
  ring,
  label,
  color,
  isEn,
  locale,
}: {
  ring: DetailedRingAnalysis;
  label: string;
  color: string;
  isEn: boolean;
  locale: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{label}</span>
            <span className="text-xs text-text-secondary">
              → {isEn ? `${ordinal(ring.house)} house` : `${ring.house} भाव`} ({tl(ring.signName, locale)})
            </span>
          </div>
          <p className="text-xs text-text-secondary/70 mt-0.5">{ring.theme}</p>
        </div>
        <span className={`text-text-secondary/40 text-xs mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {/* Detailed house theme */}
          <p className="text-sm text-text-primary/85 leading-relaxed">
            {ring.detailedTheme}
          </p>

          {/* Lord analysis */}
          <div className="bg-white/[0.02] rounded-lg px-3 py-2.5">
            <p className="text-xs text-gold-primary/80 font-medium mb-1">
              {isEn ? `Sign Lord: ${ring.lordPlanetName}` : `राशि स्वामी: ${ring.lordPlanetName}`}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {ring.lordAnalysis}
            </p>
          </div>

          {/* Planets in activated house */}
          {ring.planetsPresent.length > 0 && (
            <div>
              <p className="text-xs text-text-secondary/60 font-medium mb-1.5">
                {isEn
                  ? `Planets in ${tl(ring.signName, locale)}:`
                  : `${tl(ring.signName, locale)} में ग्रह:`}
              </p>
              <div className="space-y-1.5">
                {ring.planetsPresent.map(p => (
                  <div key={p.id} className="flex gap-2 text-xs">
                    <span className="text-gold-light font-medium shrink-0 w-16">{p.name}</span>
                    <span className="text-text-secondary/70">{p.brief}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {ring.planetsPresent.length === 0 && (
            <p className="text-xs text-text-secondary/50 italic">
              {isEn ? 'No planets occupy this sign — themes are shaped primarily by the sign lord.' : 'इस राशि में कोई ग्रह नहीं — विषय मुख्यतः राशि स्वामी द्वारा निर्धारित।'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SVG Sudarshana Chakra ──────────────────────────────────────────────────

function SudarshanaChakra({
  lagnaRing,
  chandraRing,
  suryaRing,
  locale,
  transitPlanets,
}: {
  lagnaRing: RingData;
  chandraRing: RingData;
  suryaRing: RingData;
  locale: string;
  transitPlanets?: { id: number; abbr: string; rashi: number }[] | null;
}) {
  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="max-w-full h-auto"
    >
      <defs>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pl-glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="sc-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0a3e" stopOpacity={0.6} />
          <stop offset="60%" stopColor="#0a0e27" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#0a0e27" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Background radial glow */}
      <circle cx={CX} cy={CY} r={OUTER_R + 40} fill="url(#sc-bg-glow)" />

      {/* Ring borders — Lagna (outer) */}
      <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(212,168,83,0.5)" strokeWidth={3} />
      <circle cx={CX} cy={CY} r={MID_R} fill="none" stroke="rgba(212,168,83,0.25)" strokeWidth={2} />
      {/* Ring borders — Chandra (middle) */}
      <circle cx={CX} cy={CY} r={MID_R} fill="none" stroke="rgba(236,240,241,0.35)" strokeWidth={2.5} />
      <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(236,240,241,0.2)" strokeWidth={2} />
      {/* Ring borders — Surya (inner) */}
      <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(230,126,34,0.4)" strokeWidth={2.5} />
      <circle cx={CX} cy={CY} r={CENTER_R} fill="none" stroke="rgba(230,126,34,0.25)" strokeWidth={2} />
      {/* Center fill */}
      <circle cx={CX} cy={CY} r={CENTER_R} fill="rgba(26,10,62,0.5)" stroke="rgba(212,168,83,0.15)" strokeWidth={1.5} />

      {/* Segment divider lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x2 = CX + OUTER_R * Math.cos(angle);
        const y2 = CY + OUTER_R * Math.sin(angle);
        const x1 = CX + CENTER_R * Math.cos(angle);
        const y1 = CY + CENTER_R * Math.sin(angle);
        const isCardinal = i % 3 === 0;
        return (
          <line
            key={`div-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(212, 168, 83, 0.12)"
            strokeWidth={isCardinal ? 1 : 0.7}
          />
        );
      })}

      {/* Highlighted segments (active houses) */}
      <HighlightSegment index={lagnaRing.activatedIndex} outerR={OUTER_R} innerR={MID_R} color="rgba(212, 168, 83, 0.12)" />
      <HighlightSegment index={chandraRing.activatedIndex} outerR={MID_R} innerR={INNER_R} color="rgba(236, 240, 241, 0.08)" />
      <HighlightSegment index={suryaRing.activatedIndex} outerR={INNER_R} innerR={CENTER_R} color="rgba(230, 126, 34, 0.1)" />

      {/* Ring labels and planets */}
      <RingLabels ring={lagnaRing} outerR={OUTER_R} innerR={MID_R} color="rgba(212, 168, 83, 0.7)" locale={locale} />
      <RingLabels ring={chandraRing} outerR={MID_R} innerR={INNER_R} color="rgba(236, 240, 241, 0.55)" locale={locale} />
      <RingLabels ring={suryaRing} outerR={INNER_R} innerR={CENTER_R} color="rgba(230, 126, 34, 0.6)" locale={locale} />

      {/* Ring labels near top of each band */}
      <text x={CX} y={CY - OUTER_R + 18} textAnchor="middle" fill="rgba(212,168,83,0.5)" fontSize={10} fontWeight="bold" letterSpacing={3}>LAGNA</text>
      <text x={CX} y={CY - MID_R + 18} textAnchor="middle" fill="rgba(236,240,241,0.4)" fontSize={10} fontWeight="bold" letterSpacing={3}>CHANDRA</text>
      <text x={CX} y={CY - INNER_R + 18} textAnchor="middle" fill="rgba(230,126,34,0.4)" fontSize={10} fontWeight="bold" letterSpacing={3}>SURYA</text>

      {/* House numbers at cardinal positions outside outer ring */}
      {[0, 3, 6, 9].map(i => {
        const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
        const r = OUTER_R + 25;
        return (
          <text key={`h${i}`} x={CX + r * Math.cos(angle)} y={CY + r * Math.sin(angle) + 4}
            textAnchor="middle" fill="rgba(212,168,83,0.35)" fontSize={13} fontWeight="bold">
            H{i + 1}
          </text>
        );
      })}

      {/* Transit planet overlay — rendered on the outer ring with distinct style */}
      {transitPlanets && transitPlanets.length > 0 && (() => {
        // Place transit planets on the outer ring based on their rashi position
        const lagnaStart = lagnaRing.startSign;
        const transitR = OUTER_R - 25; // slightly inside the outer ring boundary

        return (
          <g>
            {transitPlanets.map((tp) => {
              // Calculate which segment this transit planet falls in
              const houseIndex = ((tp.rashi - lagnaStart + 12) % 12);
              const segAngle = (2 * Math.PI) / 12;
              const startAngle = houseIndex * segAngle - Math.PI / 2;
              const midAngle = startAngle + segAngle / 2;
              const dx = CX + transitR * Math.cos(midAngle);
              const dy = CY + transitR * Math.sin(midAngle);
              const tColor = PLANET_COLORS[tp.id] || '#60a5fa';

              return (
                <g key={`transit-${tp.id}`}>
                  {/* Dashed circle outline — distinct from solid natal dots */}
                  <circle cx={dx} cy={dy} r={7} fill="none" stroke={tColor} strokeWidth={2} strokeDasharray="3 2" opacity={0.85} />
                  <circle cx={dx} cy={dy} r={3} fill={tColor} opacity={0.6} />
                  {/* "T:" prefix label */}
                  <text x={dx} y={dy + 18} textAnchor="middle" fill={tColor} fontSize={10} fontWeight="600" opacity={0.8}>
                    T:{tp.abbr}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Center label */}
      <text x={CX} y={CY - 12} textAnchor="middle" fill="rgba(212,168,83,0.7)" fontSize={18} fontWeight="bold" letterSpacing={4}>
        SUDARSHANA
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fill="rgba(212,168,83,0.4)" fontSize={12} letterSpacing={4}>
        CHAKRA
      </text>
    </svg>
  );
}

// ─── Highlight a segment (pie slice) ────────────────────────────────────────

function HighlightSegment({
  index,
  outerR,
  innerR,
  color,
}: {
  index: number;
  outerR: number;
  innerR: number;
  color: string;
}) {
  const startAngle = (index * 30 - 90) * (Math.PI / 180);
  const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

  const outerX1 = CX + outerR * Math.cos(startAngle);
  const outerY1 = CY + outerR * Math.sin(startAngle);
  const outerX2 = CX + outerR * Math.cos(endAngle);
  const outerY2 = CY + outerR * Math.sin(endAngle);
  const innerX1 = CX + innerR * Math.cos(endAngle);
  const innerY1 = CY + innerR * Math.sin(endAngle);
  const innerX2 = CX + innerR * Math.cos(startAngle);
  const innerY2 = CY + innerR * Math.sin(startAngle);

  const d = [
    `M ${outerX1} ${outerY1}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerX2} ${outerY2}`,
    `L ${innerX1} ${innerY1}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerX2} ${innerY2}`,
    'Z',
  ].join(' ');

  return <path d={d} fill={color} />;
}

// ─── Ring labels (full sign names + colored planet dots) ────────────────────

function RingLabels({
  ring,
  outerR,
  innerR,
  color,
  locale,
}: {
  ring: RingData;
  outerR: number;
  innerR: number;
  color: string;
  locale: string;
}) {
  const midR = (outerR + innerR) / 2;
  const isActive = (i: number) => i === ring.activatedIndex;

  return (
    <g>
      {ring.segments.map((seg, i) => {
        const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);
        const labelR = midR + (outerR - innerR) * 0.22; // sign name slightly outward
        const planetR = midR - (outerR - innerR) * 0.15; // planets in mid-band
        const x = CX + labelR * Math.cos(midAngle);
        const y = CY + labelR * Math.sin(midAngle);
        const active = isActive(i);

        const signName = SIGN_NAMES[seg.signId]?.[locale] || SIGN_NAMES[seg.signId]?.en || '?';

        return (
          <g key={`${ring.label}-${i}`}>
            {/* Full sign name */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={active ? '#f0d48a' : color}
              fontSize={active ? 15 : 13}
              fontWeight={active ? 'bold' : '600'}
              filter={active ? 'url(#glow-gold)' : undefined}
              opacity={active ? 1 : 0.65}
            >
              {signName}
            </text>
            {/* Colored planet dots + names */}
            {seg.planets.map((p, pi) => {
              const planetColor = PLANET_COLORS[p.id] || '#f0d48a';
              const name = PLANET_NAMES[p.id]?.[locale] || PLANET_NAMES[p.id]?.en || p.abbr;
              const offsetAngle = midAngle + (pi - (seg.planets.length - 1) / 2) * 0.15;
              const dx = CX + planetR * Math.cos(offsetAngle);
              const dy = CY + planetR * Math.sin(offsetAngle);
              const dotSize = (p.id === 0 || p.id === 1) ? 10 : 8;

              return (
                <g key={`${ring.label}-p-${p.id}`}>
                  {/* Glow halo */}
                  <circle cx={dx} cy={dy} r={dotSize * 2} fill={planetColor} opacity={0.12} filter="url(#pl-glow)" />
                  {/* Main dot */}
                  <circle cx={dx} cy={dy} r={dotSize} fill={planetColor} opacity={0.9} />
                  {/* Inner bright core for Sun/Moon */}
                  {(p.id === 0 || p.id === 1) && (
                    <circle cx={dx} cy={dy} r={dotSize * 0.45} fill="#fff" opacity={0.4} />
                  )}
                  {/* Full name label below */}
                  <text x={dx} y={dy + dotSize + 14} textAnchor="middle" fill={planetColor} fontSize={13} fontWeight="bold">
                    {name}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// ─── Ordinal helper ─────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
