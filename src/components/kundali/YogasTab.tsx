'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import InfoBlock from '@/components/ui/InfoBlock';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale, LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Planet name extraction from formation rule (English) to generate activation
// guidance. Maps yoga → involved planet IDs by keyword matching.
// ---------------------------------------------------------------------------

const PLANET_KEYWORDS: { keyword: string; id: number; en: string; hi: string }[] = [
  { keyword: 'sun', id: 0, en: 'Sun', hi: 'सूर्य' },
  { keyword: 'moon', id: 1, en: 'Moon', hi: 'चन्द्र' },
  { keyword: 'mars', id: 2, en: 'Mars', hi: 'मंगल' },
  { keyword: 'mercury', id: 3, en: 'Mercury', hi: 'बुध' },
  { keyword: 'jupiter', id: 4, en: 'Jupiter', hi: 'बृहस्पति' },
  { keyword: 'venus', id: 5, en: 'Venus', hi: 'शुक्र' },
  { keyword: 'saturn', id: 6, en: 'Saturn', hi: 'शनि' },
  { keyword: 'rahu', id: 7, en: 'Rahu', hi: 'राहु' },
  { keyword: 'ketu', id: 8, en: 'Ketu', hi: 'केतु' },
];

// Well-known yoga → planet mappings (supplements keyword extraction)
const YOGA_PLANET_MAP: Record<string, number[]> = {
  mangala_dosha: [2],
  kala_sarpa: [7, 8],
  hansa: [4],
  malavya: [5],
  shasha: [6],
  ruchaka: [2],
  bhadra: [3],
  gajakesari: [4, 1],
  chandra_mangala: [1, 2],
  sunafa: [1],
  anafa: [1],
  durudhara: [1],
  kemadruma: [1],
  adhi: [4, 5, 3],
  chandradhi: [4, 5, 3],
  vasumati: [4, 5, 3],
  amala: [4, 5],
  budhaditya: [0, 3],
  veshi: [0],
  voshi: [0],
  ubhayachari: [0],
  lakshmi: [5],
  saraswati: [4, 5, 3],
  mahabhagya: [0, 1],
  raja_yoga: [4, 6],
  viparita_raja: [6],
  neechabhanga: [],
  dhana_yoga: [4, 5],
};

/** Extract involved planets for a yoga — uses static map first, then keyword extraction */
function getInvolvedPlanets(yoga: YogaComplete): { id: number; en: string; hi: string }[] {
  // Check static map first
  const mapped = YOGA_PLANET_MAP[yoga.id];
  if (mapped && mapped.length > 0) {
    return mapped.map(id => {
      const pk = PLANET_KEYWORDS.find(p => p.id === id)!;
      return { id, en: pk.en, hi: pk.hi };
    });
  }

  // Fall back to keyword extraction from formation rule + description (English text)
  const text = `${yoga.formationRule.en} ${yoga.description.en}`.toLowerCase();
  const found: { id: number; en: string; hi: string }[] = [];
  const seen = new Set<number>();
  for (const pk of PLANET_KEYWORDS) {
    if (!seen.has(pk.id) && text.includes(pk.keyword)) {
      seen.add(pk.id);
      found.push({ id: pk.id, en: pk.en, hi: pk.hi });
    }
  }
  return found;
}

/** Generate activation guidance text for a present yoga */
function getActivationNote(yoga: YogaComplete, isEn: boolean): string | null {
  if (!yoga.present) return null;
  const planets = getInvolvedPlanets(yoga);
  if (planets.length === 0) return null;

  const planetNames = planets.map(p => isEn ? p.en : p.hi);

  if (yoga.isAuspicious) {
    if (isEn) {
      const dashaList = planetNames.map(n => `${n} Mahadasha`).join(', ');
      const antarList = planetNames.map(n => `${n} Antardasha`).join(' or ');
      return `This yoga activates most strongly during ${dashaList}, or ${antarList}. These are your peak windows to pursue its promises — plan major life moves accordingly.`;
    } else {
      const dashaList = planetNames.map(n => `${n} महादशा`).join(', ');
      const antarList = planetNames.map(n => `${n} अन्तर्दशा`).join(' या ');
      return `यह योग ${dashaList}, या ${antarList} के समय सबसे प्रभावी होता है। इन अवधियों में इसके शुभ फल चरम पर होते हैं — बड़े निर्णय इन्हीं काल में लें।`;
    }
  } else {
    if (isEn) {
      const periodList = planetNames.map(n => `${n}`).join(' or ');
      return `The effects of this yoga are felt most during ${periodList} dasha/antardasha periods. Remedial measures (mantras, charity, gemstones) during these periods can significantly reduce negative impact.`;
    } else {
      const periodList = planetNames.map(n => `${n}`).join(' या ');
      return `इस योग का प्रभाव ${periodList} दशा/अन्तर्दशा में सबसे अधिक अनुभव होता है। इन अवधियों में उपचार (मन्त्र, दान, रत्न) से नकारात्मक प्रभाव काफी कम हो सकता है।`;
    }
  }
}

export default function YogasTab({ yogas, locale, isDevanagari, headingFont }: {
  yogas: YogaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [filter, setFilter] = useState<'all' | 'present' | 'auspicious' | 'inauspicious'>('all');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  // Deduplicate yogas by ID — keep the one that's present, or first occurrence
  const deduped = useMemo(() => {
    const seen = new Map<string, YogaComplete>();
    for (const y of yogas) {
      const existing = seen.get(y.id);
      if (!existing || (y.present && !existing.present)) {
        seen.set(y.id, y);
      }
    }
    return [...seen.values()];
  }, [yogas]);

  const filtered = deduped.filter(y => {
    if (filter === 'present') return y.present;
    if (filter === 'auspicious') return y.isAuspicious;
    if (filter === 'inauspicious') return !y.isAuspicious;
    return true;
  });

  const presentCount = deduped.filter(y => y.present).length;
  const auspiciousPresent = deduped.filter(y => y.present && y.isAuspicious).length;
  const inauspiciousPresent = deduped.filter(y => y.present && !y.isAuspicious).length;

  const CATEGORY_LABELS: Record<string, LocaleText> = {
    dosha: { en: 'Doshas', hi: 'दोष', sa: 'दोष', mai: 'दोष', mr: 'दोष', ta: 'தோஷங்கள்', te: 'దోషాలు', bn: 'দোষ', kn: 'ದೋಷಗಳು', gu: 'દોષ' },
    mahapurusha: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष', sa: 'पंच महापुरुष', mai: 'पंच महापुरुष', mr: 'पंच महापुरुष', ta: 'பஞ்ச மகாபுருஷ', te: 'పంచ మహాపురుష', bn: 'পঞ্চ মহাপুরুষ', kn: 'ಪಂಚ ಮಹಾಪುರುಷ', gu: 'પંચ મહાપુરુષ' },
    moon_based: { en: 'Moon-Based Yogas', hi: 'चन्द्र आधारित योग', sa: 'चन्द्र आधारित योग', mai: 'चन्द्र आधारित योग', mr: 'चन्द्र आधारित योग', ta: 'சந்திர யோகங்கள்', te: 'చంద్ర యోగాలు', bn: 'চন্দ্র যোগ', kn: 'ಚಂದ್ರ ಯೋಗಗಳು', gu: 'ચંદ્ર યોગ' },
    sun_based: { en: 'Sun-Based Yogas', hi: 'सूर्य आधारित योग', sa: 'सूर्य आधारित योग', mai: 'सूर्य आधारित योग', mr: 'सूर्य आधारित योग', ta: 'சூரிய யோகங்கள்', te: 'సూర్య యోగాలు', bn: 'সূর্য যোগ', kn: 'ಸೂರ್ಯ ಯೋಗಗಳು', gu: 'સૂર્ય યોગ' },
    raja: { en: 'Raja Yogas', hi: 'राजयोग', sa: 'राजयोग', mai: 'राजयोग', mr: 'राजयोग', ta: 'ராஜ யோகங்கள்', te: 'రాజ యోగాలు', bn: 'রাজ যোগ', kn: 'ರಾಜ ಯೋಗಗಳು', gu: 'રાજ યોગ' },
    wealth: { en: 'Wealth Yogas', hi: 'धनयोग', sa: 'धनयोग', mai: 'धनयोग', mr: 'धनयोग', ta: 'தன யோகங்கள்', te: 'ధన యోగాలు', bn: 'ধন যোগ', kn: 'ಧನ ಯೋಗಗಳು', gu: 'ધન યોગ' },
    inauspicious: { en: 'Inauspicious Yogas', hi: 'अशुभ योग', sa: 'अशुभ योग', mai: 'अशुभ योग', mr: 'अशुभ योग', ta: 'அசுப யோகங்கள்', te: 'అశుభ యోగాలు', bn: 'অশুভ যোগ', kn: 'ಅಶುಭ ಯೋಗಗಳು', gu: 'અશુભ યોગ' },
    other: { en: 'Other Yogas', hi: 'अन्य योग', sa: 'अन्य योग', mai: 'अन्य योग', mr: 'अन्य योग', ta: 'பிற யோகங்கள்', te: 'ఇతర యోగాలు', bn: 'অন্যান্য যোগ', kn: 'ಇತರ ಯೋಗಗಳು', gu: 'અન્ય યોગ' },
  };

  const categories = ['dosha', 'mahapurusha', 'moon_based', 'sun_based', 'raja', 'wealth', 'inauspicious', 'other'];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Yogas Analysis' : 'योग विश्लेषण'}
      </h3>

      {/* Summary badges */}
      <div className="flex justify-center gap-4 text-sm">
        <span className="px-3 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20">
          {locale === 'en' || isTamil ? `${presentCount} Present` : `${presentCount} उपस्थित`}
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          {locale === 'en' || isTamil ? `${auspiciousPresent} Auspicious` : `${auspiciousPresent} शुभ`}
        </span>
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {locale === 'en' || isTamil ? `${inauspiciousPresent} Inauspicious` : `${inauspiciousPresent} अशुभ`}
        </span>
      </div>

      <InfoBlock
        id="kundali-yogas"
        title={isDevanagari ? 'योग क्या हैं?' : 'What are Yogas?'}
        defaultOpen={false}
      >
        {isDevanagari
          ? 'वैदिक ज्योतिष में "योग" एक विशिष्ट ग्रह संयोजन है जो एक निश्चित परिणाम उत्पन्न करता है — जैसे एक ब्रह्मांडीय नुस्खा। राजयोग शक्ति और अधिकार लाते हैं, धनयोग धन लाते हैं, महापुरुष योग असाधारण व्यक्तित्व बनाते हैं (केवल 5 होते हैं), और अशुभ योग चुनौतियाँ लाते हैं जो चरित्र निर्माण करती हैं। "उपस्थित" का अर्थ है कि यह संयोजन आपकी कुण्डली में विद्यमान है। "शक्ति" दिखाती है कि यह कितनी प्रभावशाली ढंग से काम करता है। हरा = शुभ, लाल = चुनौतीपूर्ण किंतु प्रायः परिवर्तनकारी।'
          : 'In Vedic astrology, a \'Yoga\' is a specific planetary combination that produces a defined result — like a cosmic recipe. Raja Yogas bring power and authority, Dhana Yogas bring wealth, Mahapurusha Yogas create exceptional personalities (only 5 exist), and Inauspicious Yogas bring challenges that build character. \'Present\' means the combination exists in your chart. \'Strength\' shows how powerfully it operates. Green = auspicious, Red = challenging but often transformative.'}
      </InfoBlock>

      {/* Filters */}
      <div className="flex justify-center gap-2 flex-wrap">
        {([
          { key: 'all' as const, label: locale === 'en' || isTamil ? 'All' : 'सभी' },
          { key: 'present' as const, label: locale === 'en' || isTamil ? 'Present' : 'उपस्थित' },
          { key: 'auspicious' as const, label: locale === 'en' || isTamil ? 'Auspicious' : 'शुभ' },
          { key: 'inauspicious' as const, label: locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ' },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Yogas grouped by category */}
      {categories.map(cat => {
        const catYogas = filtered.filter(y => y.category === cat);
        if (catYogas.length === 0) return null;
        const catLabel = CATEGORY_LABELS[cat] || { en: cat, hi: cat };
        return (
          <div key={cat}>
            <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-3 font-bold" style={bodyFont}>
              {tl(catLabel, locale)}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {catYogas.map(y => (
                <div key={y.id}
                  className={`rounded-xl p-3 border transition-all cursor-pointer ${
                    y.present
                      ? 'border-gold-primary/30 bg-gold-primary/5'
                      : 'border-gold-primary/5 bg-bg-primary/20 opacity-50'
                  }`}
                  onClick={() => setExpandedYoga(expandedYoga === y.id ? null : y.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-light font-medium text-sm" style={bodyFont}>{tl(y.name, locale)}</span>
                      {y.present && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                          y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {y.strength}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        y.isAuspicious ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {y.isAuspicious ? (locale === 'en' || isTamil ? 'Auspicious' : 'शुभ') : (locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${y.present ? 'bg-gold-primary/20 text-gold-light' : 'bg-bg-primary/50 text-text-secondary/70'}`}>
                        {y.present ? (locale === 'en' || isTamil ? 'Present' : 'है') : (locale === 'en' || isTamil ? 'Absent' : 'नहीं')}
                      </span>
                    </div>
                  </div>
                  {expandedYoga === y.id && (() => {
                    const activationNote = y.present ? getActivationNote(y, locale === 'en' || isTamil) : null;
                    return (
                      <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-2">
                        <p className="text-text-secondary text-xs" style={bodyFont}>{tl(y.description, locale)}</p>
                        <p className="text-gold-dark text-xs italic" style={bodyFont}>
                          {locale === 'en' || isTamil ? 'Rule' : 'नियम'}: {tl(y.formationRule, locale)}
                        </p>
                        {activationNote && (
                          <div className="mt-1.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-gold-primary/10">
                            <p className="text-xs font-medium text-gold-primary/80 mb-0.5" style={bodyFont}>
                              {locale === 'en' || isTamil ? 'When does this activate?' : 'यह कब सक्रिय होता है?'}
                            </p>
                            <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                              {activationNote}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
