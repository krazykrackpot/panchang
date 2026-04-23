'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { SadeSatiAnalysis } from '@/lib/kundali/sade-sati-analysis';
import type { Locale, LocaleText } from '@/types/panchang';

function intensityColor(v: number): string {
  if (v < 3) return 'text-green-400';
  if (v < 5) return 'text-gold-light';
  if (v < 7) return 'text-orange-400';
  return 'text-red-400';
}

function intensityLabel(v: number): LocaleText {
  if (v < 3) return { en: 'Mild', hi: 'हल्का', sa: 'हल्का', mai: 'हल्का', mr: 'हल्का', ta: 'லேசான', te: 'తేలికైన', bn: 'মৃদু', kn: 'ಮೃದು', gu: 'હળવું' };
  if (v < 5) return { en: 'Moderate', hi: 'मध्यम', sa: 'मध्यम', mai: 'मध्यम', mr: 'मध्यम', ta: 'மிதமான', te: 'మోస్తరు', bn: 'মাঝারি', kn: 'ಮಧ್ಯಮ', gu: 'મધ્યમ' };
  if (v < 7) return { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'चुनौतीपूर्ण', mai: 'चुनौतीपूर्ण', mr: 'चुनौतीपूर्ण', ta: 'சவாலான', te: 'సవాలుదాయకం', bn: 'চ্যালেঞ্জিং', kn: 'ಸವಾಲಿನ', gu: 'પડકારજનક' };
  return { en: 'Intense', hi: 'तीव्र', sa: 'तीव्र', mai: 'तीव्र', mr: 'तीव्र', ta: 'தீவிரமான', te: 'తీవ్రమైన', bn: 'তীব্র', kn: 'ತೀವ್ರ', gu: 'તીવ્ર' };
}

function intensityStrokeColor(v: number): string {
  if (v < 3) return '#4ade80';
  if (v < 5) return '#d4a853';
  if (v < 7) return '#fb923c';
  return '#f87171';
}

const SECTION_LABELS: Record<string, LocaleText> = {
  summary: { en: 'Summary', hi: 'सारांश', sa: 'सारांश', mai: 'सारांश', mr: 'सारांश', ta: 'சுருக்கம்', te: 'సారాంశం', bn: 'সারাংশ', kn: 'ಸಾರಾಂಶ', gu: 'સારાંશ' },
  phaseEffect: { en: 'Phase Effect', hi: 'चरण प्रभाव', sa: 'चरण प्रभाव', mai: 'चरण प्रभाव', mr: 'चरण प्रभाव', ta: 'கட்ட விளைவு', te: 'దశ ప్రభావం', bn: 'পর্যায় প্রভাব', kn: 'ಹಂತ ಪ್ರಭಾವ', gu: 'તબક્કા અસર' },
  saturnNature: { en: "Saturn's Nature for Your Ascendant", hi: 'आपके लग्न के लिए शनि का स्वभाव', sa: 'आपके लग्न के लिए शनि का स्वभाव', mai: 'आपके लग्न के लिए शनि का स्वभाव', mr: 'आपके लग्न के लिए शनि का स्वभाव', ta: "Saturn's Nature for Your Ascendant", te: "Saturn's Nature for Your Ascendant", bn: "Saturn's Nature for Your Ascendant", kn: "Saturn's Nature for Your Ascendant", gu: "Saturn's Nature for Your Ascendant" },
  moonStrength: { en: 'Moon Strength', hi: 'चन्द्र बल', sa: 'चन्द्र बल', mai: 'चन्द्र बल', mr: 'चन्द्र बल', ta: 'சந்திர பலம்', te: 'చంద్ర బలం', bn: 'চন্দ্র বল', kn: 'ಚಂದ್ರ ಬಲ', gu: 'ચંદ્ર બળ' },
  dashaInterplay: { en: 'Dasha Interplay', hi: 'दशा अन्तर्क्रिया', sa: 'दशा अन्तर्क्रिया', mai: 'दशा अन्तर्क्रिया', mr: 'दशा अन्तर्क्रिया', ta: 'தசா இடைவினை', te: 'దశ పరస్పర క్రియ', bn: 'দশা মিথস্ক্রিয়া', kn: 'ದಶಾ ಪರಸ್ಪರ ಕ್ರಿಯೆ', gu: 'દશા આંતરક્રિયા' },
  ashtakavargaInsight: { en: 'Ashtakavarga Insight', hi: 'अष्टकवर्ग अंतर्दृष्टि', sa: 'अष्टकवर्ग अंतर्दृष्टि', mai: 'अष्टकवर्ग अंतर्दृष्टि', mr: 'अष्टकवर्ग अंतर्दृष्टि', ta: 'அஷ்டகவர்க்க நுண்ணறிவு', te: 'అష్టకవర్గ అంతర్దృష్టి', bn: 'অষ্টকবর্গ অন্তর্দৃষ্টি', kn: 'ಅಷ್ಟಕವರ್ಗ ಒಳನೋಟ', gu: 'અષ્ટકવર્ગ આંતરદૃષ્ટિ' },
  nakshatraTransit: { en: 'Nakshatra Transit', hi: 'नक्षत्र गोचर', sa: 'नक्षत्र गोचर', mai: 'नक्षत्र गोचर', mr: 'नक्षत्र गोचर', ta: 'நட்சத்திர கோசாரம்', te: 'నక్షత్ర గోచారం', bn: 'নক্ষত্র গোচর', kn: 'ನಕ್ಷತ್ರ ಗೋಚಾರ', gu: 'નક્ષત્ર ગોચર' },
  houseEffect: { en: 'House Effects', hi: 'भाव प्रभाव', sa: 'भाव प्रभाव', mai: 'भाव प्रभाव', mr: 'भाव प्रभाव', ta: 'வீட்டு விளைவுகள்', te: 'భావ ప్రభావాలు', bn: 'ভাব প্রভাব', kn: 'ಭಾವ ಪ್ರಭಾವ', gu: 'ભાવ પ્રભાવ' },
};

const PHASE_LABELS: Record<string, LocaleText> = {
  rising: { en: 'Rising (12th House Transit)', hi: 'उदय (द्वादश भाव गोचर)', sa: 'उदय (द्वादश भाव गोचर)', mai: 'उदय (द्वादश भाव गोचर)', mr: 'उदय (द्वादश भाव गोचर)', ta: 'உதயம் (12ம் வீடு கோசாரம்)', te: 'ఉదయం (12వ భావ గోచారం)', bn: 'উদয় (১২শ ভাব গোচর)', kn: 'ಉದಯ (12ನೇ ಭಾವ ಗೋಚಾರ)', gu: 'ઉદય (12મો ભાવ ગોચર)' },
  peak: { en: 'Peak (1st House Transit)', hi: 'शिखर (प्रथम भाव गोचर)', sa: 'शिखर (प्रथम भाव गोचर)', mai: 'शिखर (प्रथम भाव गोचर)', mr: 'शिखर (प्रथम भाव गोचर)', ta: 'உச்சம் (1ம் வீடு கோசாரம்)', te: 'శిఖరం (1వ భావ గోచారం)', bn: 'শীর্ষ (১ম ভাব গোচর)', kn: 'ಶಿಖರ (1ನೇ ಭಾವ ಗೋಚಾರ)', gu: 'શિખર (1લો ભાવ ગોચર)' },
  setting: { en: 'Setting (2nd House Transit)', hi: 'अस्त (द्वितीय भाव गोचर)', sa: 'अस्त (द्वितीय भाव गोचर)', mai: 'अस्त (द्वितीय भाव गोचर)', mr: 'अस्त (द्वितीय भाव गोचर)', ta: 'அஸ்தமனம் (2ம் வீடு கோசாரம்)', te: 'అస్తమనం (2వ భావ గోచారం)', bn: 'অস্ত (২য় ভাব গোচর)', kn: 'ಅಸ್ತ (2ನೇ ಭಾವ ಗೋಚಾರ)', gu: 'અસ્ત (2જો ભાવ ગોચર)' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  essential: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  recommended: { bg: 'bg-gold-primary/10', text: 'text-gold-light', border: 'border-gold-primary/20' },
  optional: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const PRIORITY_LABELS: Record<string, LocaleText> = {
  essential: { en: 'Essential', hi: 'अनिवार्य', sa: 'अनिवार्य', mai: 'अनिवार्य', mr: 'अनिवार्य', ta: 'அத்தியாவசியம்', te: 'అవసరం', bn: 'অত্যাবশ্যক', kn: 'ಅತ್ಯಗತ್ಯ', gu: 'આવશ્યક' },
  recommended: { en: 'Recommended', hi: 'अनुशंसित', sa: 'अनुशंसित', mai: 'अनुशंसित', mr: 'अनुशंसित', ta: 'பரிந்துரைக்கப்படுகிறது', te: 'సిఫార్సు చేయబడింది', bn: 'প্রস্তাবিত', kn: 'ಶಿಫಾರಸು', gu: 'ભલામણ' },
  optional: { en: 'Optional', hi: 'वैकल्पिक', sa: 'वैकल्पिक', mai: 'वैकल्पिक', mr: 'वैकल्पिक', ta: 'விருப்பத்திற்குரியது', te: 'ఐచ్ఛికం', bn: 'ঐচ্ছিক', kn: 'ಐಚ್ಛಿಕ', gu: 'વૈકલ્પિક' },
};

export default function SadeSatiTab({ sadeSati, locale, isDevanagari, headingFont }: {
  sadeSati: SadeSatiAnalysis;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  const interp = sadeSati.interpretation;
  const interpretationKeys = Object.keys(SECTION_LABELS).filter(k => {
    const val = interp[k as keyof typeof interp];
    return val && (val as LocaleText)[lk]?.trim();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Sade Sati Analysis' : 'साढ़े साती विश्लेषण'}
      </h3>

      {/* ── Status Banner ── */}
      {sadeSati.isActive ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-red-500/30 bg-red-500/5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-red-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
                {locale === 'en' || isTamil ? 'Sade Sati Active' : 'साढ़े साती सक्रिय'}
              </div>
              <div className="text-text-secondary text-sm mt-1" style={bodyFont}>
                {sadeSati.cycleStart} &mdash; {sadeSati.cycleEnd}
                {sadeSati.currentPhase && (
                  <span className="ml-2 text-gold-light">
                    ({PHASE_LABELS[sadeSati.currentPhase]?.[lk] || sadeSati.currentPhase})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timeline progress — shows elapsed vs remaining years */}
          {(() => {
            const startYr = parseInt(String(sadeSati.cycleStart));
            const endYr = parseInt(String(sadeSati.cycleEnd));
            const totalYrs = endYr - startYr;
            const currentYr = new Date().getFullYear();
            const elapsedYrs = Math.min(totalYrs, Math.max(0, currentYr - startYr));
            const remainingYrs = totalYrs - elapsedYrs;
            return (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>{sadeSati.cycleStart}</span>
                <span className="text-gold-light font-semibold">
                  {locale === 'en' || isTamil ? `${elapsedYrs} of ${totalYrs} years` : `${totalYrs} में से ${elapsedYrs} वर्ष`}
                  {remainingYrs > 0 && <span className="text-text-tertiary ml-1">({locale === 'en' || isTamil ? `${remainingYrs} remaining` : `${remainingYrs} शेष`})</span>}
                </span>
                <span>{sadeSati.cycleEnd}</span>
              </div>
              <div className="h-2.5 rounded-full bg-gold-primary/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sadeSati.phaseProgress * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-gold-primary"
                />
              </div>
            </div>
            );
          })()}
        </motion.div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-green-500/30 bg-green-500/5 text-center">
          <div className="text-green-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
            {locale === 'en' || isTamil ? 'Not in Sade Sati' : 'साढ़े साती नहीं'}
          </div>
          {sadeSati.allCycles.length > 0 && (() => {
            const nextCycle = sadeSati.allCycles.find(c => !c.isActive && c.startYear > new Date().getFullYear());
            if (!nextCycle) return null;
            return (
              <div className="text-text-secondary text-sm mt-2" style={bodyFont}>
                {locale === 'en' || isTamil ? `Next cycle: ${nextCycle.startYear} — ${nextCycle.endYear}` : `अगला चक्र: ${nextCycle.startYear} — ${nextCycle.endYear}`}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Intensity Gauge (only if active) ── */}
      {sadeSati.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
        >
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-6" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Intensity Gauge' : 'तीव्रता मापक'}
          </h4>

          <div className="flex flex-col items-center gap-6">
            {/* Circular SVG gauge */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-primary/60" strokeLinecap="round"
                  strokeDasharray="235.6 78.5" transform="rotate(135 60 60)" />
                {/* Value arc */}
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={intensityStrokeColor(sadeSati.overallIntensity)}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(sadeSati.overallIntensity / 10) * 235.6} ${314.16 - (sadeSati.overallIntensity / 10) * 235.6}`}
                  transform="rotate(135 60 60)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${intensityColor(sadeSati.overallIntensity)}`}>
                  {sadeSati.overallIntensity.toFixed(1)}<span className="text-base text-text-secondary/50">/10</span>
                </span>
                <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>
                  {intensityLabel(sadeSati.overallIntensity)[lk]}
                </span>
              </div>
            </div>

            {/* Intensity factors as bars */}
            {sadeSati.intensityFactors.length > 0 && (
              <div className="w-full max-w-md space-y-2.5">
                {sadeSati.intensityFactors.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-right text-xs text-text-secondary truncate" style={bodyFont}>
                      {f.description[lk]}
                    </div>
                    <div className="flex-1 bg-gold-primary/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(f.score / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' as const }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: intensityStrokeColor(f.score) }}
                      />
                    </div>
                    <span className={`w-6 text-right text-xs font-mono font-bold ${intensityColor(f.score)}`}>
                      {f.score.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Interpretation Sections (expandable cards) ── */}
      {interpretationKeys.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-2" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Detailed Interpretation' : 'विस्तृत व्याख्या'}
          </h4>
          {interpretationKeys.map((key) => {
            const label = SECTION_LABELS[key];
            const text = (interp[key as keyof typeof interp] as LocaleText)[lk];
            const isOpen = expandedSection === key;
            return (
              <motion.div
                key={key}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden"
                layout
              >
                <button
                  onClick={() => setExpandedSection(isOpen ? '' : key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gold-primary/5 transition-colors"
                >
                  <span className="text-gold-light text-sm font-bold" style={headingFont}>
                    {label[lk]}
                  </span>
                  <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                        {text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Timeline ── */}
      {sadeSati.allCycles.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Sade Sati Timeline' : 'साढ़े साती समयरेखा'}
          </h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gold-primary/20" />
            <div className="space-y-4">
              {sadeSati.allCycles.map((cycle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex items-start gap-4 pl-2 ${cycle.isActive ? '' : 'opacity-60'}`}
                >
                  <div className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    cycle.isActive ? 'border-gold-primary bg-gold-primary/20' : 'border-gold-primary/30 bg-bg-primary/40'
                  }`}>
                    {cycle.isActive && <div className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold font-mono text-sm ${cycle.isActive ? 'text-gold-light' : 'text-text-secondary'}`}>
                        {cycle.startYear} &mdash; {cycle.endYear}
                      </span>
                      {cycle.isActive && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light border border-gold-primary/30">
                          {locale === 'en' || isTamil ? 'Active' : 'सक्रिय'}
                        </span>
                      )}
                    </div>
                    {cycle.phases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {cycle.phases.map((ph, j) => (
                          <span key={j} className={`text-xs px-2 py-0.5 rounded border ${
                            cycle.isActive && sadeSati.currentPhase === ph.phase
                              ? 'bg-gold-primary/15 text-gold-light border-gold-primary/30 font-bold'
                              : 'text-text-tertiary border-gold-primary/10'
                          }`}>
                            {ph.phase === 'rising' ? (locale === 'en' || isTamil ? 'Rising' : 'उदय') :
                             ph.phase === 'peak' ? (locale === 'en' || isTamil ? 'Peak' : 'शिखर') :
                             (locale === 'en' || isTamil ? 'Setting' : 'अस���त')}
                            {' '}{ph.startYear}-{ph.endYear}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nakshatra transit sub-items for active cycle */}
                    {cycle.isActive && sadeSati.nakshatraTimeline.length > 0 && (
                      <div className="mt-3 ml-1 space-y-1">
                        <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1.5">
                          {locale === 'en' || isTamil ? 'Nakshatra Transits' : 'नक्षत्र गोचर'}
                        </div>
                        {sadeSati.nakshatraTimeline.map((nt, k) => {
                          const nak = NAKSHATRAS[nt.nakshatra - 1];
                          const nakName = nak?.name?.[locale as 'en' | 'hi' | 'sa'] || nak?.name?.en || '';
                          const yearLabel = nt.firstYear === nt.lastYear ? String(nt.firstYear) : `${nt.firstYear}–${nt.lastYear}`;
                          return (
                            <div
                              key={k}
                              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                                nt.isBirthNakshatra
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                                  : nt.isCurrent
                                    ? 'bg-gold-primary/10 border-gold-primary/25 text-gold-light'
                                    : 'border-transparent text-text-secondary'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                nt.isCurrent ? 'bg-gold-primary animate-pulse' : nt.isBirthNakshatra ? 'bg-amber-400' : 'bg-text-tertiary/40'
                              }`} />
                              <span className="flex-1">{nakName}</span>
                              <span className="font-mono text-xs opacity-70">{yearLabel}</span>
                              {nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300">
                                  {locale === 'en' || isTamil ? 'Birth' : 'जन्म'}
                                </span>
                              )}
                              {nt.isCurrent && !nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-primary/15 border border-gold-primary/25 text-gold-light">
                                  {locale === 'en' || isTamil ? 'Now' : 'अभी'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Remedies (only if active) ── */}
      {sadeSati.isActive && sadeSati.remedies.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Remedies' : 'उपाय'}
          </h4>
          {(['essential', 'recommended', 'optional'] as const).map(priority => {
            const items = sadeSati.remedies.filter(r => r.priority === priority);
            if (items.length === 0) return null;
            const pc = PRIORITY_COLORS[priority];
            return (
              <div key={priority} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                    {PRIORITY_LABELS[priority][lk]}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`rounded-xl p-4 border ${pc.border} ${pc.bg}`}
                    >
                      <div className={`font-bold text-sm mb-1 ${pc.text}`} style={headingFont}>
                        {r.title[lk]}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                        {r.description[lk]}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
