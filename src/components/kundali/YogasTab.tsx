'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import InfoBlock from '@/components/ui/InfoBlock';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale, LocaleText } from '@/types/panchang';

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
                  {expandedYoga === y.id && (
                    <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                      <p className="text-text-secondary text-xs" style={bodyFont}>{tl(y.description, locale)}</p>
                      <p className="text-gold-dark text-xs italic" style={bodyFont}>
                        {locale === 'en' || isTamil ? 'Rule' : 'नियम'}: {tl(y.formationRule, locale)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
