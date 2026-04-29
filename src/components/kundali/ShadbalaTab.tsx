'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { Locale, LocaleText } from '@/types/panchang';
import ShadbalaRadar from './ShadbalaRadar';

/* ------------------------------------------------------------------ */
/*  Static data — hoisted to module level                             */
/* ------------------------------------------------------------------ */

const PLANET_LABELS: Record<string, LocaleText> = {
  Sun: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, Moon: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
  Mars: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, Mercury: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  Jupiter: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, Venus: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
  Saturn: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શনિ' },
};

const ROW_LABELS: { key: string; en: string; hi: string }[] = [
  { key: 'rank', en: 'Relative Rank', hi: 'सापेक्ष क्रम' },
  { key: 'sthana', en: 'Sthana Bala', hi: 'स्थान बल' },
  { key: 'disha', en: 'Dig Bala', hi: 'दिग्बल' },
  { key: 'kala', en: 'Kala Bala', hi: 'कालबल' },
  { key: 'chesta', en: 'Chesta Bala', hi: 'चेष्टाबल' },
  { key: 'naisargika', en: 'Naisargika Bala', hi: 'नैसर्गिक बल' },
  { key: 'drishti', en: 'Drik Bala', hi: 'दृक्बल' },
  { key: 'divider1', en: '', hi: '' },
  { key: 'total', en: 'Total Pinda', hi: 'कुल पिण्ड' },
  { key: 'rupas', en: 'Rupas', hi: 'रूप' },
  { key: 'minReq', en: 'Min. Required', hi: 'न्यूनतम' },
  { key: 'ratio', en: 'Strength Ratio', hi: 'बल अनुपात' },
  { key: 'divider2', en: '', hi: '' },
  { key: 'ishta', en: 'Ishta Phala', hi: 'इष्ट फल' },
  { key: 'kashta', en: 'Kashta Phala', hi: 'कष्ट फल' },
];

/** Planet themes for interpretive commentary */
const PLANET_THEMES_EN: Record<string, { themes: string; strongMsg: string; weakMsg: string }> = {
  Sun: {
    themes: 'self-confidence, authority, father, government, vitality',
    strongMsg: 'Your sense of self is powerful. Leadership comes naturally, and you command respect in positions of authority.',
    weakMsg: 'Self-confidence may waver. Asserting authority or connecting with father figures could be challenging areas.',
  },
  Moon: {
    themes: 'emotions, mother, mental peace, public image, nurturing',
    strongMsg: 'Emotional intelligence is a core strength. Your intuition is reliable, and you connect well with people.',
    weakMsg: 'Emotional stability may fluctuate. Mental peace requires active cultivation — mindfulness practices can help.',
  },
  Mars: {
    themes: 'courage, energy, siblings, property, technical skill',
    strongMsg: 'You have abundant energy and physical courage. Technical skills and competitive situations are your forte.',
    weakMsg: 'Physical energy or initiative may run low. Courage under pressure is a skill you are still building.',
  },
  Mercury: {
    themes: 'intellect, communication, business, humor, adaptability',
    strongMsg: 'Sharp intellect and quick communication are your assets. Business acumen and analytical thinking come naturally.',
    weakMsg: 'Clear communication or analytical thinking may require extra effort. Detail-oriented work can feel draining.',
  },
  Jupiter: {
    themes: 'wisdom, expansion, children, fortune, spirituality, teaching',
    strongMsg: 'Wisdom, optimism, and good fortune flow abundantly. Teaching, mentoring, or spiritual pursuits bring fulfillment.',
    weakMsg: 'Luck may not come easily. Finding a guru, expanding horizons, or experiencing abundance requires patience.',
  },
  Venus: {
    themes: 'love, beauty, luxury, creativity, marriage, harmony',
    strongMsg: 'Aesthetic sense, romantic fulfillment, and material comforts are naturally accessible. Creativity flows easily.',
    weakMsg: 'Romance, luxury, or artistic expression may feel blocked. Cultivating beauty in daily life is the remedy.',
  },
  Saturn: {
    themes: 'discipline, patience, longevity, karma, structure, hard work',
    strongMsg: 'Discipline and perseverance are your pillars. You build lasting structures and gain respect through hard work.',
    weakMsg: 'Patience and discipline may not come naturally. Structure feels restrictive — but embracing it brings rewards.',
  },
};

const PLANET_THEMES_HI: Record<string, { themes: string; strongMsg: string; weakMsg: string }> = {
  Sun: {
    themes: 'आत्मविश्वास, अधिकार, पिता, सरकार, जीवन शक्ति',
    strongMsg: 'आत्मबोध शक्तिशाली है। नेतृत्व सहज है और अधिकार के पदों पर सम्मान मिलता है।',
    weakMsg: 'आत्मविश्वास डगमगा सकता है। अधिकार जताना या पिता से सम्बन्ध चुनौतीपूर्ण हो सकता है।',
  },
  Moon: {
    themes: 'भावनाएँ, माता, मानसिक शान्ति, जनसम्पर्क',
    strongMsg: 'भावनात्मक बुद्धि मूल शक्ति है। अन्तर्ज्ञान विश्वसनीय है।',
    weakMsg: 'भावनात्मक स्थिरता में उतार-चढ़ाव हो सकता है। मानसिक शान्ति के लिए सक्रिय प्रयास चाहिए।',
  },
  Mars: {
    themes: 'साहस, ऊर्जा, भाई-बहन, सम्पत्ति, तकनीकी कौशल',
    strongMsg: 'प्रचुर ऊर्जा और शारीरिक साहस है। तकनीकी कौशल और प्रतिस्पर्धा आपकी विशेषता है।',
    weakMsg: 'शारीरिक ऊर्जा या पहल कम हो सकती है। दबाव में साहस अभी विकसित हो रहा है।',
  },
  Mercury: {
    themes: 'बुद्धि, संवाद, व्यापार, हास्य, अनुकूलनशीलता',
    strongMsg: 'तीक्ष्ण बुद्धि और तेज संवाद आपकी संपत्ति है। व्यापारिक कुशलता सहज है।',
    weakMsg: 'स्पष्ट संवाद या विश्लेषणात्मक सोच में अतिरिक्त प्रयास लग सकता है।',
  },
  Jupiter: {
    themes: 'ज्ञान, विस्तार, संतान, भाग्य, आध्यात्मिकता, शिक्षण',
    strongMsg: 'ज्ञान, आशावाद और सौभाग्य प्रचुर है। शिक्षण और आध्यात्मिक साधना संतोषदायक हैं।',
    weakMsg: 'भाग्य सहज नहीं आ सकता। गुरु खोजना या विस्तार में धैर्य चाहिए।',
  },
  Venus: {
    themes: 'प्रेम, सौन्दर्य, विलासिता, रचनात्मकता, विवाह',
    strongMsg: 'सौन्दर्य बोध, रोमांटिक पूर्णता और भौतिक सुख सहज हैं। रचनात्मकता स्वतः बहती है।',
    weakMsg: 'प्रेम, विलासिता या कलात्मक अभिव्यक्ति अवरुद्ध लग सकती है।',
  },
  Saturn: {
    themes: 'अनुशासन, धैर्य, दीर्घायु, कर्म, संरचना, परिश्रम',
    strongMsg: 'अनुशासन और दृढ़ता आपके स्तम्भ हैं। कठिन परिश्रम से स्थायी सम्मान मिलता है।',
    weakMsg: 'धैर्य और अनुशासन सहज नहीं हो सकते। संरचना को अपनाने से पुरस्कार मिलते हैं।',
  },
};

/** Plain-language explanation of each of the 6 strengths */
const STRENGTH_EXPLANATIONS_EN: { name: string; key: string; desc: string }[] = [
  { name: 'Sthana Bala', key: 'positional', desc: 'How comfortable is the planet in its current sign and house? Exalted or own-sign planets score high.' },
  { name: 'Dig Bala', key: 'directional', desc: 'Is the planet in the angular house where it is most powerful? Jupiter and Mercury thrive in the 1st house, Sun and Mars in the 10th.' },
  { name: 'Kala Bala', key: 'temporal', desc: 'Was the planet strong at your specific time, day, and month of birth? Day-born charts favor the Sun; night-born charts favor the Moon.' },
  { name: 'Cheshta Bala', key: 'motional', desc: 'Is the planet moving at an optimal speed? Retrograde planets and those near their stationary points gain cheshta strength.' },
  { name: 'Naisargika Bala', key: 'natural', desc: 'The planet\'s inherent luminosity. Sun is naturally strongest, followed by Moon, Venus, Jupiter, Mars, Mercury, Saturn.' },
  { name: 'Drik Bala', key: 'aspectual', desc: 'Are benefics (Jupiter, Venus) aspecting this planet? Benefic aspects add strength; malefic aspects (Saturn, Mars) reduce it.' },
];

const STRENGTH_EXPLANATIONS_HI: { name: string; key: string; desc: string }[] = [
  { name: 'स्थान बल', key: 'positional', desc: 'ग्रह अपनी वर्तमान राशि और भाव में कितना सहज है? उच्च या स्वराशि ग्रहों का स्कोर अधिक होता है।' },
  { name: 'दिग्बल', key: 'directional', desc: 'क्या ग्रह उस केन्द्र भाव में है जहाँ वह सबसे शक्तिशाली है? बृहस्पति-बुध लग्न में, सूर्य-मंगल दशम में प्रबल हैं।' },
  { name: 'कालबल', key: 'temporal', desc: 'क्या जन्म के समय, दिन और मास में ग्रह शक्तिशाली था? दिन के जन्म में सूर्य, रात में चन्द्र प्रबल होता है।' },
  { name: 'चेष्टाबल', key: 'motional', desc: 'क्या ग्रह इष्टतम गति पर है? वक्री ग्रह और स्थिर बिन्दु के निकट ग्रहों को चेष्टाबल मिलता है।' },
  { name: 'नैसर्गिक बल', key: 'natural', desc: 'ग्रह की स्वाभाविक प्रभावशीलता। सूर्य सबसे शक्तिशाली, फिर चन्द्र, शुक्र, बृहस्पति, मंगल, बुध, शनि।' },
  { name: 'दृक्बल', key: 'aspectual', desc: 'क्या शुभ ग्रह (बृहस्पति, शुक्र) इस ग्रह को देख रहे हैं? शुभ दृष्टि बल बढ़ाती है; पाप दृष्टि घटाती है।' },
];

export default function ShadbalaTab({ shadbala, locale, isDevanagari, headingFont }: {
  shadbala: ShadBalaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const isEn = locale === 'en' || isTamil;
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const pThemes = isEn ? PLANET_THEMES_EN : PLANET_THEMES_HI;
  const strengthExplanations = isEn ? STRENGTH_EXPLANATIONS_EN : STRENGTH_EXPLANATIONS_HI;

  // Derive strongest / weakest planet for the practical implication
  const analysis = useMemo(() => {
    const sorted = [...shadbala].sort((a, b) => b.strengthRatio - a.strengthRatio);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const adequate = shadbala.filter(s => s.strengthRatio >= 1.0).length;
    const inadequate = shadbala.filter(s => s.strengthRatio < 1.0).length;
    return { strongest, weakest, adequate, inadequate };
  }, [shadbala]);

  function getValue(s: ShadBalaComplete, key: string): string {
    switch (key) {
      case 'rank': return String(s.rank);
      case 'sthana': return s.sthanaBala.toFixed(2);
      case 'disha': return s.digBala.toFixed(2);
      case 'kala': return s.kalaBala.toFixed(2);
      case 'chesta': return s.cheshtaBala.toFixed(2);
      case 'naisargika': return s.naisargikaBala.toFixed(2);
      case 'drishti': return (s.drikBala >= 0 ? '+' : '') + s.drikBala.toFixed(2);
      case 'total': return s.totalPinda.toFixed(2);
      case 'rupas': return s.rupas.toFixed(2);
      case 'minReq': return s.minRequired.toFixed(2);
      case 'ratio': return s.strengthRatio.toFixed(4);
      case 'ishta': return s.ishtaPhala.toFixed(2);
      case 'kashta': return s.kashtaPhala.toFixed(2);
      default: return '';
    }
  }

  function getColor(s: ShadBalaComplete, key: string): string {
    if (key === 'ratio') {
      return s.strengthRatio >= 1.5 ? 'text-green-400' : s.strengthRatio >= 1.0 ? 'text-gold-light' : 'text-red-400';
    }
    if (key === 'drishti') return s.drikBala >= 0 ? 'text-green-400' : 'text-red-400';
    if (key === 'rank') return s.rank <= 2 ? 'text-green-400 font-bold' : 'text-text-secondary';
    return 'text-text-secondary';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {isEn ? 'Shadbala — Six-Fold Strength' : 'षड्बल — छह प्रकार का बल'}
      </h3>
      <p className="text-text-secondary text-xs text-center max-w-2xl mx-auto" style={bodyFont}>
        {isEn
          ? 'Classical six-component planetary strength calculation. Values in Shashtiamshas (60ths of a Rupa). Strength Ratio above 1.0 indicates adequate strength.'
          : 'शास्त्रीय षड्बल गणना। मान षष्ट्यंशों में। बल अनुपात 1.0 से अधिक पर्याप्त बल दर्शाता है।'}
      </p>

      {/* Strength Overview — instant visual via progress bars */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'Strength at a Glance' : 'एक नज़र में बल'}
        </h4>
        <div className="space-y-2.5">
          {shadbala.map(s => {
            const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
            const ratio = s.strengthRatio;
            const barPct = Math.min(ratio * 50, 100); // 2.0x = 100%
            const barColor = ratio >= 1.5 ? '#34d399' : ratio >= 1.0 ? '#d4a853' : '#ef4444';
            return (
              <div key={s.planetId} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-20 shrink-0">
                  <GrahaIconById id={s.planetId} size={16} />
                  <span className="text-text-primary text-xs font-medium truncate" style={bodyFont}>{tl(label, locale)}</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barPct}%`, backgroundColor: barColor }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-mono font-bold" style={{ color: barColor }}>
                  {ratio.toFixed(1)}x
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gold-primary/10 text-[10px] text-text-secondary/50">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />{isEn ? '< 1.0x Weak' : '< 1.0x कमजोर'}</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-primary/60" />{isEn ? '1.0-1.5x Adequate' : '1.0-1.5x पर्याप्त'}</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />{isEn ? '≥ 1.5x Strong' : '≥ 1.5x शक्तिशाली'}</div>
        </div>
      </div>

      {/* Strength Radar — interactive spider chart with drill-down */}
      <div className="rounded-xl bg-gradient-to-b from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6">
        <ShadbalaRadar shadbala={shadbala} locale={locale} />
      </div>

      {/* A) Per-planet strength summary cards */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'What Your Planetary Strengths Mean' : 'आपके ग्रह बल का अर्थ'}
        </h4>
        <div className="space-y-3">
          {shadbala.map(s => {
            const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
            const theme = pThemes[s.planet];
            if (!theme) return null;
            const isStrong = s.strengthRatio >= 1.0;
            const isVeryStrong = s.strengthRatio >= 1.5;
            const ratioColor = isVeryStrong ? 'text-green-400' : isStrong ? 'text-gold-light' : 'text-red-400';
            const borderColor = isVeryStrong ? 'border-green-500/30' : isStrong ? 'border-gold-primary/20' : 'border-red-500/25';
            return (
              <div key={s.planetId} className={`border-l-2 ${borderColor} pl-4 py-1`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <GrahaIconById id={s.planetId} size={18} />
                  <span className="text-gold-light font-bold text-sm" style={bodyFont}>{tl(label, locale)}</span>
                  <span className={`font-mono text-xs font-bold ${ratioColor}`}>
                    {s.strengthRatio.toFixed(2)}x
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${isVeryStrong ? 'bg-green-500/10 border-green-500/20 text-green-400' : isStrong ? 'bg-gold-primary/10 border-gold-primary/20 text-gold-light' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {isVeryStrong ? (isEn ? 'Very Strong' : 'अत्यन्त शक्तिशाली') : isStrong ? (isEn ? 'Adequate' : 'पर्याप्त') : (isEn ? 'Weak' : 'कमजोर')}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {isStrong ? theme.strongMsg : theme.weakMsg}
                </p>
                <p className="text-text-secondary/50 text-xs mt-1 italic" style={bodyFont}>
                  {isEn ? 'Themes: ' : 'विषय: '}{theme.themes}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* B) What the 6 strengths mean in plain language */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'Understanding the Six Strengths' : 'छह बलों को समझें'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strengthExplanations.map(ex => (
            <div key={ex.key} className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/8">
              <p className="text-gold-light font-bold text-xs mb-1" style={bodyFont}>{ex.name}</p>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* C) Practical implication — lean into strongest, remedy weakest */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>
          {isEn ? 'Practical Takeaway' : 'व्यावहारिक निष्कर्ष'}
        </h4>
        <div className="space-y-3">
          {analysis.strongest && pThemes[analysis.strongest.planet] && (
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                <GrahaIconById id={analysis.strongest.planetId} size={14} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                <span className="text-green-400 font-bold">
                  {isEn ? `Your strongest planet is ${analysis.strongest.planet}` : `आपका सबसे शक्तिशाली ग्रह ${tl(PLANET_LABELS[analysis.strongest.planet] || { en: analysis.strongest.planet, hi: analysis.strongest.planet }, locale)} है`}
                </span>
                {' '}{isEn ? `(${analysis.strongest.strengthRatio.toFixed(2)}x).` : `(${analysis.strongest.strengthRatio.toFixed(2)}x)।`}
                {' '}{isEn
                  ? `Lean into ${pThemes[analysis.strongest.planet]!.themes} for maximum success and natural fulfillment.`
                  : `अधिकतम सफलता के लिए ${pThemes[analysis.strongest.planet]!.themes} पर ध्यान दें।`}
              </p>
            </div>
          )}
          {analysis.weakest && pThemes[analysis.weakest.planet] && (
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <GrahaIconById id={analysis.weakest.planetId} size={14} />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                <span className="text-red-400 font-bold">
                  {isEn ? `Your weakest planet is ${analysis.weakest.planet}` : `आपका सबसे कमजोर ग्रह ${tl(PLANET_LABELS[analysis.weakest.planet] || { en: analysis.weakest.planet, hi: analysis.weakest.planet }, locale)} है`}
                </span>
                {' '}{isEn ? `(${analysis.weakest.strengthRatio.toFixed(2)}x).` : `(${analysis.weakest.strengthRatio.toFixed(2)}x)।`}
                {' '}{isEn
                  ? `Remedial measures (gemstones, mantras, charity) for this planet would be most beneficial.`
                  : `इस ग्रह के उपचार (रत्न, मन्त्र, दान) सबसे लाभदायक होंगे।`}
              </p>
            </div>
          )}
          <p className="text-text-secondary/60 text-xs" style={bodyFont}>
            {isEn
              ? `Overall: ${analysis.adequate} of 7 planets have adequate strength. ${analysis.inadequate > 0 ? `${analysis.inadequate} planet${analysis.inadequate > 1 ? 's' : ''} could benefit from strengthening.` : 'All planets meet their minimum strength requirements.'}`
              : `कुल: 7 में से ${analysis.adequate} ग्रहों की शक्ति पर्याप्त है। ${analysis.inadequate > 0 ? `${analysis.inadequate} ग्रह${analysis.inadequate > 1 ? 'ों' : ''} को सुदृढ़ करने से लाभ होगा।` : 'सभी ग्रह अपनी न्यूनतम शक्ति पूरी करते हैं।'}`}
          </p>
        </div>
      </div>

      {/* Original data table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left py-3 px-2 text-text-secondary text-xs" style={bodyFont}></th>
              {shadbala.map(s => {
                const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
                return (
                  <th key={s.planetId} className="text-center py-3 px-2 min-w-[70px]">
                    <GrahaIconById id={s.planetId} size={20} />
                    <p className="text-gold-light text-xs font-medium mt-1" style={bodyFont}>{tl(label, locale)}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(row => {
              if (row.key.startsWith('divider')) {
                return <tr key={row.key}><td colSpan={8} className="py-1"><div className="border-t border-gold-primary/15" /></td></tr>;
              }
              const isSummary = ['total', 'rupas', 'ratio'].includes(row.key);
              return (
                <tr key={row.key} className={isSummary ? 'bg-gold-primary/5' : 'hover:bg-gold-primary/3'}>
                  <td className={`py-2 px-2 text-xs ${isSummary ? 'text-gold-light font-bold' : 'text-text-secondary'}`} style={bodyFont}>
                    {tl(row, locale)}
                  </td>
                  {shadbala.map(s => (
                    <td key={s.planetId} className={`py-2 px-2 text-center font-mono text-xs ${isSummary ? 'font-bold ' : ''}${getColor(s, row.key)}`}>
                      {getValue(s, row.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
