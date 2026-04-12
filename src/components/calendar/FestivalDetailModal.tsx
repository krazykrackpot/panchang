'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Flame, Star, Clock, AlertTriangle, Sun, Moon, Check, Copy, ChevronDown } from 'lucide-react';
import type { Locale, Trilingual } from '@/types/panchang';
import type { FestivalDetail, EkadashiDetail } from '@/lib/constants/festival-details';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import type { PujaVidhi, MantraDetail as MantraType } from '@/lib/constants/puja-vidhi/types';
import { tl } from '@/lib/utils/trilingual';

interface FestivalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  festivalName: Trilingual;
  festivalDate: string;
  festivalCategory: string;
  detail: FestivalDetail | null;
  ekadashiDetail: EkadashiDetail | null;
  // Parana (fast-breaking) info
  paranaDate?: string;
  paranaStart?: string;
  paranaEnd?: string;
  paranaNote?: Trilingual;
  paranaSunrise?: string;
  paranaHariVasaraEnd?: string;
  paranaDwadashiEnd?: string;
  paranaEarlyEnd?: boolean;
  paranaMadhyahnaStart?: string;
  paranaMadhyahnaEnd?: string;
  // Eclipse info
  eclipseType?: 'solar' | 'lunar';
  eclipseMagnitude?: string;
  eclipseMaxTime?: string;
  sutakStart?: string;
  sutakEnd?: string;
  sutakApplicable?: boolean;
  eclipsePhases?: { name: Trilingual; time: string }[];
  festivalSlug?: string;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];

const L = {
  mythology: { en: 'Story & Origin', hi: 'कथा एवं उत्पत्ति', sa: 'कथा उत्पत्तिश्च' },
  observance: { en: 'How to Observe', hi: 'पालन विधि', sa: 'पालनविधिः' },
  significance: { en: 'Significance', hi: 'महत्व', sa: 'महत्त्वम्' },
  deity: { en: 'Deity', hi: 'देवता', sa: 'देवता' },
  fasting: { en: 'Fasting Rules', hi: 'व्रत नियम', sa: 'व्रतनियमाः' },
  benefit: { en: 'Benefit', hi: 'फल', sa: 'फलम्' },
  story: { en: 'Legend', hi: 'कथा', sa: 'कथा' },
  close: { en: 'Close', hi: 'बन्द करें', sa: 'पिधानम्' },
};

const LP = {
  parana: { en: 'Parana (Fast Breaking)', hi: 'पारण (व्रत तोड़ना)', sa: 'पारणम् (व्रतभङ्गः)' },
  paranaWindow: { en: 'Parana Window', hi: 'पारण समय', sa: 'पारणसमयः' },
  to: { en: 'to', hi: 'से', sa: 'पर्यन्तम्' },
  on: { en: 'on', hi: 'को', sa: 'दिने' },
  eclipseInfo: { en: 'Eclipse Details', hi: 'ग्रहण विवरण', sa: 'ग्रहणविवरणम्' },
  magnitude: { en: 'Type', hi: 'प्रकार', sa: 'प्रकारः' },
  maxTime: { en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'परमग्रहणम्' },
  sutak: { en: 'Sutak Period', hi: 'सूतक काल', sa: 'सूतककालः' },
  sutakNote: {
    en: 'During Sutak, avoid eating, cooking, and starting auspicious activities. Temples remain closed.',
    hi: 'सूतक काल में भोजन, पाक, और शुभ कार्य वर्जित हैं। मन्दिर बन्द रहते हैं।',
    sa: 'सूतककाले भोजनं पाकः शुभकार्याणि च वर्जितानि। मन्दिराणि पिहितानि तिष्ठन्ति।',
  },
  noSutak: {
    en: 'Sutak is not applicable for penumbral lunar eclipses.',
    hi: 'उपच्छाया चन्द्र ग्रहण में सूतक लागू नहीं होता।',
    sa: 'उपच्छायाचन्द्रग्रहणे सूतकं न प्रवर्तते।',
  },
  phases: { en: 'Eclipse Phases', hi: 'ग्रहण चरण', sa: 'ग्रहणचरणाः' },
};

export default function FestivalDetailModal({
  isOpen,
  onClose,
  locale,
  festivalName,
  festivalDate,
  festivalCategory,
  detail,
  ekadashiDetail,
  paranaDate,
  paranaStart,
  paranaEnd,
  paranaNote,
  paranaSunrise,
  paranaHariVasaraEnd,
  paranaDwadashiEnd,
  paranaEarlyEnd,
  paranaMadhyahnaStart,
  paranaMadhyahnaEnd,
  eclipseType,
  eclipseMagnitude,
  eclipseMaxTime,
  sutakStart,
  sutakEnd,
  sutakApplicable,
  eclipsePhases,
  festivalSlug,
}: FestivalDetailModalProps) {
  // Puja lookup with slug mapping for mismatches
  const PUJA_SLUG_MAP: Record<string, string> = {
    'vat-savitri-vrat': 'vat-savitri',
    'amavasya': 'amavasya-tarpan',
    'pradosham-shukla': 'pradosham',
    'pradosham-krishna': 'pradosham',
    'sankashti-chaturthi-shukla': 'sankashti-chaturthi',
  };
  const resolvedPujaSlug = festivalSlug ? (PUJA_VIDHIS[festivalSlug] ? festivalSlug : PUJA_SLUG_MAP[festivalSlug] || festivalSlug) : undefined;
  const hasPujaVidhi = resolvedPujaSlug ? !!PUJA_VIDHIS[resolvedPujaSlug] : false;
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {};
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const dateObj = new Date(festivalDate + 'T00:00:00');
  const dayStr = dateObj.getDate();
  const monthStr = locale === 'en'
    ? MONTH_NAMES[dateObj.getMonth()]
    : MONTH_NAMES_HI[dateObj.getMonth()];
  const yearStr = dateObj.getFullYear();

  const categoryColorMap: Record<string, string> = {
    festival: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    ekadashi: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    purnima: 'from-amber-400/20 to-amber-500/5 border-amber-400/30',
    amavasya: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    chaturthi: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
    pradosham: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
    sankranti: 'from-red-500/20 to-red-600/5 border-red-500/30',
  };

  const hasContent = detail || ekadashiDetail || paranaStart || eclipseType;
  const hasParana = paranaStart && paranaEnd;
  const hasEclipse = eclipseType && eclipsePhases;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full z-50 max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl border ${categoryColorMap[festivalCategory] || 'border-gold-primary/20'} bg-gradient-to-b overflow-hidden flex flex-col max-h-[85vh]`}>
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-[#1a1040]/40 hover:bg-bg-tertiary transition-colors"
                  aria-label={tl(L.close, locale)}
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#1a1040]/40 flex flex-col items-center justify-center border border-gold-primary/20">
                    <span className="text-gold-light text-2xl font-bold leading-none">{dayStr}</span>
                    <span className="text-text-secondary text-xs uppercase">{locale === 'en' || String(locale) === 'ta' ? monthStr?.slice(0, 3) : monthStr?.slice(0, 4)}</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient leading-tight" style={headingFont}>
                      {tl(festivalName, locale)}
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                      {dayStr} {monthStr} {yearStr}
                      {festivalCategory && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gold-primary/20 bg-gold-primary/10 text-gold-dark font-bold uppercase">
                          {festivalCategory}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto px-6 pb-6 space-y-5 flex-1 custom-scrollbar">
                {hasContent ? (
                  <>
                    {/* Ekadashi-specific: story + benefit */}
                    {ekadashiDetail && (
                      <>
                        <Section
                          icon={<BookOpen className="w-4 h-4" />}
                          title={tl(L.story, locale)}
                          content={tl(ekadashiDetail.story, locale)}
                          headingFont={headingFont}
                          bodyFont={bodyFont}
                        />
                        <Section
                          icon={<Star className="w-4 h-4" />}
                          title={tl(L.benefit, locale)}
                          content={tl(ekadashiDetail.benefit, locale)}
                          headingFont={headingFont}
                          bodyFont={bodyFont}
                          highlight
                        />
                      </>
                    )}

                    {/* Festival detail: mythology, observance, significance */}
                    {detail && (
                      <>
                        <Section
                          icon={<BookOpen className="w-4 h-4" />}
                          title={tl(L.mythology, locale)}
                          content={tl(detail.mythology, locale)}
                          headingFont={headingFont}
                          bodyFont={bodyFont}
                        />
                        <Section
                          icon={<Flame className="w-4 h-4" />}
                          title={tl(L.observance, locale)}
                          content={tl(detail.observance, locale)}
                          headingFont={headingFont}
                          bodyFont={bodyFont}
                        />
                        <Section
                          icon={<Star className="w-4 h-4" />}
                          title={tl(L.significance, locale)}
                          content={tl(detail.significance, locale)}
                          headingFont={headingFont}
                          bodyFont={bodyFont}
                        />

                        {detail.deity && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gold-primary font-bold" style={headingFont}>{tl(L.deity, locale)}:</span>
                            <span className="text-text-primary" style={bodyFont}>{tl(detail.deity, locale)}</span>
                          </div>
                        )}

                        {detail.isFast && detail.fastNote && (
                          <Section
                            icon={<Clock className="w-4 h-4" />}
                            title={tl(L.fasting, locale)}
                            content={tl(detail.fastNote, locale)}
                            headingFont={headingFont}
                            bodyFont={bodyFont}
                            highlight
                          />
                        )}
                      </>
                    )}

                    {/* Parana (fast-breaking) section */}
                    {hasParana && (
                      <div className="rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider" style={headingFont}>
                            {tl(LP.parana, locale)}
                          </h3>
                          {paranaDate && paranaDate !== festivalDate && (
                            <span className="ml-auto text-xs text-text-secondary font-mono">
                              {(() => {
                                const pd = new Date(paranaDate + 'T00:00:00');
                                return `${pd.getDate()} ${locale === 'en' || String(locale) === 'ta' ? MONTH_NAMES[pd.getMonth()]?.slice(0, 3) : MONTH_NAMES_HI[pd.getMonth()]?.slice(0, 4)}`;
                              })()}
                            </span>
                          )}
                        </div>

                        {/* Recommended window — prominent */}
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center mb-3">
                          <div className="text-xs text-emerald-400/70 uppercase tracking-wider mb-1" style={headingFont}>
                            {tl(LP.paranaWindow, locale)}
                          </div>
                          <div className="text-2xl font-bold text-emerald-300 font-mono tracking-tight">
                            {paranaStart} — {paranaEnd}
                          </div>
                        </div>

                        {/* ─── Three Rules Summary ─── */}
                        <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-3 mb-3">
                          <div className="text-xs text-gold-primary/70 uppercase tracking-wider font-bold mb-2">
                            {locale === 'en' || String(locale) === 'ta' ? 'Three Rules of Parana' : locale === 'hi' ? 'पारण के तीन नियम' : 'पारणस्य त्रयो नियमाः'}
                          </div>
                          <div className="space-y-1 text-xs" style={bodyFont}>
                            <div className="flex items-start gap-2">
                              <span className="text-blue-400 font-bold mt-0.5">1.</span>
                              <span className="text-text-secondary">
                                {locale === 'en' || String(locale) === 'ta' ? 'Do NOT break fast during Hari Vasara (first 1/4 of Dwadashi)' : locale === 'hi' ? 'हरि वासर (द्वादशी के प्रथम 1/4) में पारण न करें' : 'हरिवासरे (द्वादश्याः प्रथमचतुर्थांशे) पारणं न कुर्यात्'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold mt-0.5">2.</span>
                              <span className="text-text-secondary">
                                {locale === 'en' || String(locale) === 'ta' ? 'Do NOT break fast during Madhyahna (midday period)' : locale === 'hi' ? 'मध्याह्न (दोपहर) में पारण न करें' : 'मध्याह्ने पारणं न कुर्यात्'}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-orange-400 font-bold mt-0.5">3.</span>
                              <span className="text-text-secondary">
                                {locale === 'en' || String(locale) === 'ta' ? 'MUST break fast before Dwadashi tithi ends' : locale === 'hi' ? 'द्वादशी तिथि समाप्ति से पहले पारण अवश्य करें' : 'द्वादशीतिथ्यन्तात् पूर्वं पारणम् अवश्यम्'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ─── Timeline ─── */}
                        {(paranaSunrise || paranaDwadashiEnd) && (
                          <div className="space-y-1.5 mb-3">
                            {/* Sunrise */}
                            {paranaSunrise && (
                              <div className="flex items-center justify-between text-xs rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] px-3 py-2">
                                <span className="text-amber-300/80 font-medium" style={bodyFont}>
                                  {locale === 'en' || String(locale) === 'ta' ? 'Sunrise' : locale === 'hi' ? 'सूर्योदय' : 'सूर्योदयः'}
                                </span>
                                <span className="text-amber-300 font-mono font-bold">{paranaSunrise}</span>
                              </div>
                            )}

                            {/* Hari Vasara — show contextually */}
                            {paranaHariVasaraEnd && (
                              <div className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 ${
                                paranaHariVasaraEnd === paranaSunrise
                                  ? 'bg-emerald-500/10 border border-emerald-500/15'
                                  : paranaEarlyEnd
                                  ? 'bg-red-500/10 border border-red-500/20'
                                  : 'bg-blue-500/10 border border-blue-500/15'
                              }`}>
                                <span className={`font-medium ${
                                  paranaHariVasaraEnd === paranaSunrise ? 'text-emerald-300/80' : paranaEarlyEnd ? 'text-red-300/80' : 'text-blue-300/80'
                                }`} style={bodyFont}>
                                  {paranaHariVasaraEnd === paranaSunrise
                                    ? (locale === 'en' || String(locale) === 'ta' ? 'Hari Vasara — already over before sunrise' : locale === 'hi' ? 'हरि वासर — सूर्योदय से पहले समाप्त' : 'हरिवासरः — सूर्योदयात् पूर्वं समाप्तः')
                                    : (locale === 'en' || String(locale) === 'ta' ? 'Hari Vasara ends (no food before)' : locale === 'hi' ? 'हरि वासर समाप्ति (इससे पहले भोजन वर्जित)' : 'हरिवासरान्तः')
                                  }
                                </span>
                                {paranaHariVasaraEnd !== paranaSunrise && (
                                  <span className={`font-mono font-bold ${paranaEarlyEnd ? 'text-red-300' : 'text-blue-300'}`}>{paranaHariVasaraEnd}</span>
                                )}
                              </div>
                            )}

                            {/* Madhyahna */}
                            {paranaMadhyahnaStart && paranaMadhyahnaEnd && (
                              <div className="flex items-center justify-between text-xs rounded-lg bg-amber-500/10 border border-amber-500/15 px-3 py-2">
                                <span className="text-amber-300/80 font-medium" style={bodyFont}>
                                  {locale === 'en' || String(locale) === 'ta' ? 'Madhyahna (no food during)' : locale === 'hi' ? 'मध्याह्न (इसमें भोजन वर्जित)' : 'मध्याह्नः (वर्जनीयः)'}
                                </span>
                                <span className="text-amber-300 font-mono font-bold">{paranaMadhyahnaStart}–{paranaMadhyahnaEnd}</span>
                              </div>
                            )}

                            {/* Dwadashi end */}
                            {paranaDwadashiEnd && (
                              <div className="flex items-center justify-between text-xs rounded-lg bg-orange-500/10 border border-orange-500/15 px-3 py-2">
                                <span className="text-orange-300/80 font-medium" style={bodyFont}>
                                  {locale === 'en' || String(locale) === 'ta' ? 'Dwadashi ends (must eat before)' : locale === 'hi' ? 'द्वादशी समाप्ति (इससे पहले खाएँ)' : 'द्वादशीतिथ्यन्तः (अस्मात् पूर्वं भोजनम्)'}
                                </span>
                                <span className="text-orange-300 font-mono font-bold">{paranaDwadashiEnd}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Special notes */}
                        {paranaEarlyEnd && (
                          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 mb-3">
                            <p className="text-red-300 text-xs leading-relaxed" style={bodyFont}>
                              {locale === 'en'
                                ? 'Dwadashi ends very early — break fast immediately after sunrise. Hari Vasara restriction is overridden by Dwadashi deadline.'
                                : locale === 'hi'
                                ? 'द्वादशी बहुत जल्दी समाप्त हो रही है — सूर्योदय के तुरंत बाद पारण करें। द्वादशी की समय सीमा के कारण हरि वासर प्रतिबंध लागू नहीं।'
                                : 'द्वादशी शीघ्रं समाप्यते — सूर्योदयानन्तरं तूर्णं पारणं कुर्यात्।'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Eclipse section */}
                    {hasEclipse && (
                      <>
                        {/* Eclipse type + magnitude */}
                        <div className="rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20">
                          <div className="flex items-center gap-2 mb-3">
                            {eclipseType === 'solar'
                              ? <Sun className="w-4 h-4 text-amber-400" />
                              : <Moon className="w-4 h-4 text-blue-300" />}
                            <h3 className="text-sm font-bold text-red-300 uppercase tracking-wider" style={headingFont}>
                              {tl(LP.eclipseInfo, locale)}
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="rounded-lg bg-[#1a1040]/40 p-3 text-center">
                              <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                                {tl(LP.magnitude, locale)}
                              </div>
                              <div className="text-lg font-bold text-red-300 capitalize">
                                {eclipseMagnitude}
                              </div>
                            </div>
                            <div className="rounded-lg bg-[#1a1040]/40 p-3 text-center">
                              <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                                {tl(LP.maxTime, locale)}
                              </div>
                              <div className="text-lg font-bold text-amber-300 font-mono">
                                {eclipseMaxTime}
                              </div>
                            </div>
                          </div>

                          {/* Phase timeline */}
                          <div className="mb-3">
                            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2" style={headingFont}>
                              {tl(LP.phases, locale)}
                            </div>
                            <div className="space-y-1.5">
                              {eclipsePhases!.map((phase, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-text-primary/80" style={bodyFont}>
                                    {tl(phase.name, locale)}
                                  </span>
                                  <span className="text-gold-light font-mono text-xs font-bold">
                                    {phase.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Sutak period */}
                        <div className={`rounded-xl p-4 ${sutakApplicable ? 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20' : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${sutakApplicable ? 'text-amber-400' : 'text-text-secondary'}`} />
                            <h3 className={`text-sm font-bold uppercase tracking-wider ${sutakApplicable ? 'text-amber-300' : 'text-text-secondary'}`} style={headingFont}>
                              {tl(LP.sutak, locale)}
                            </h3>
                          </div>
                          {sutakApplicable ? (
                            <>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 rounded-lg bg-[#1a1040]/40 p-3 text-center">
                                  <div className="text-xl font-bold text-amber-300 font-mono">
                                    {sutakStart} — {sutakEnd}
                                  </div>
                                </div>
                              </div>
                              <p className="text-text-primary/70 text-xs leading-relaxed" style={bodyFont}>
                                {tl(LP.sutakNote, locale)}
                              </p>
                            </>
                          ) : (
                            <p className="text-text-secondary text-xs" style={bodyFont}>
                              {tl(LP.noSutak, locale)}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center text-text-secondary text-sm" style={bodyFont}>
                    {locale === 'en'
                      ? 'Detailed information for this event will be added soon.'
                      : 'इस आयोजन की विस्तृत जानकारी शीघ्र जोड़ी जाएगी।'}
                  </div>
                )}

                {/* Puja Vidhi — inline */}
                {hasPujaVidhi && resolvedPujaSlug && <InlinePujaVidhi puja={PUJA_VIDHIS[resolvedPujaSlug]} locale={locale} headingFont={headingFont} bodyFont={bodyFont} />}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Inline Puja Vidhi (rendered inside the modal) ───────────────────────────

function InlineMantra({ mantra, locale, bodyFont }: { mantra: MantraType; locale: Locale; bodyFont: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
  const copy = () => {
    navigator.clipboard.writeText(mantra.devanagari).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="rounded-lg bg-gold-primary/3 border border-gold-primary/10 p-3 relative">
      <button onClick={copy} className="absolute top-2 right-2 p-1 rounded text-gold-primary/40 hover:text-gold-light" aria-label="Copy">
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{mantra.name[lk as keyof typeof mantra.name]}</p>
      <p className="text-gold-light text-base leading-relaxed pr-6" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{mantra.devanagari}</p>
      <p className="text-text-secondary/75 text-xs italic mt-1">{mantra.iast}</p>
      <p className="text-text-secondary text-xs mt-1" style={bodyFont}>{mantra.meaning[lk as keyof typeof mantra.meaning]}</p>
      {mantra.japaCount && <span className="text-gold-primary/50 text-xs mt-1 inline-block">{mantra.japaCount}x</span>}
    </div>
  );
}

function InlinePujaVidhi({ puja, locale, headingFont, bodyFont }: { puja: PujaVidhi; locale: Locale; headingFont: React.CSSProperties; bodyFont: React.CSSProperties }) {
  const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
  const t = (tri: { en: string; hi: string; sa: string }) => tri[locale] || tri.en;

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gold-primary/20" />
        <span className="text-gold-primary text-xs font-bold uppercase tracking-wider" style={headingFont}>
          {locale === 'en' || String(locale) === 'ta' ? 'Puja Vidhi' : 'पूजा विधि'}
        </span>
        <div className="flex-1 h-px bg-gold-primary/20" />
      </div>

      {/* Deity + Muhurta */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gold-dark text-xs">{locale === 'en' || String(locale) === 'ta' ? 'Deity' : 'देवता'}:</span>
        <span className="text-gold-light font-bold" style={bodyFont}>{t(puja.deity)}</span>
        <span className="text-gold-primary/30">|</span>
        <span className="text-gold-dark text-xs">{locale === 'en' || String(locale) === 'ta' ? 'Muhurta' : 'मुहूर्त'}:</span>
        <span className="text-text-secondary text-xs" style={bodyFont}>{t(puja.muhurtaDescription)}</span>
      </div>

      {/* Samagri */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-3">
        <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
          {locale === 'en' || String(locale) === 'ta' ? 'Materials (Samagri)' : 'सामग्री'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {puja.samagri.map((item, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/8 border border-gold-primary/10 text-text-secondary" style={bodyFont}>
              {t(item.name)}{item.quantity ? ` (${item.quantity})` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Vidhi Steps */}
      <div>
        <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
          {locale === 'en' || String(locale) === 'ta' ? 'Procedure' : 'विधि'}
        </p>
        <div className="space-y-2">
          {puja.vidhiSteps.map((step) => (
            <div key={step.step} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-gold-primary/15 text-gold-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step.step}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-gold-light text-xs font-semibold" style={bodyFont}>{t(step.title)}</span>
                <p className="text-text-secondary/70 text-xs leading-relaxed" style={bodyFont}>{t(step.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mantras */}
      <div>
        <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
          {locale === 'en' || String(locale) === 'ta' ? 'Mantras' : 'मन्त्र'}
        </p>
        <div className="space-y-2">
          {puja.mantras.map((m) => (
            <InlineMantra key={m.id} mantra={m} locale={locale} bodyFont={bodyFont} />
          ))}
        </div>
      </div>

      {/* Aarti */}
      {puja.aarti && (
        <div className="rounded-xl bg-orange-500/5 border border-orange-500/15 p-3">
          <p className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">{locale === 'en' || String(locale) === 'ta' ? 'Aarti' : 'आरती'}</p>
          <p className="text-gold-light text-sm whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {puja.aarti.devanagari}
          </p>
        </div>
      )}

      {/* Naivedya */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-3">
        <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{locale === 'en' || String(locale) === 'ta' ? 'Offering (Naivedya)' : 'नैवेद्य'}</p>
        <p className="text-text-secondary text-xs" style={bodyFont}>{t(puja.naivedya)}</p>
      </div>

      {/* Precautions */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-3">
        <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">{locale === 'en' || String(locale) === 'ta' ? 'Precautions' : 'सावधानियाँ'}</p>
        <ul className="space-y-1">
          {puja.precautions.map((p, i) => (
            <li key={i} className="flex gap-2 text-text-secondary text-xs" style={bodyFont}>
              <AlertTriangle className="w-3 h-3 text-amber-400/60 flex-shrink-0 mt-0.5" />
              <span>{t(p)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Phala */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 p-3">
        <p className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">{locale === 'en' || String(locale) === 'ta' ? 'Benefits (Phala)' : 'फल'}</p>
        <p className="text-text-secondary text-xs" style={bodyFont}>{t(puja.phala)}</p>
      </div>

      {/* Visarjan */}
      {puja.visarjan && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-3">
          <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{locale === 'en' || String(locale) === 'ta' ? 'Visarjan (Conclusion)' : 'विसर्जन'}</p>
          <p className="text-text-secondary text-xs" style={bodyFont}>{t(puja.visarjan)}</p>
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  content,
  headingFont,
  bodyFont,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ${highlight ? 'border border-gold-primary/20' : 'border border-gold-primary/10'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gold-primary">{icon}</span>
        <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
          {title}
        </h3>
      </div>
      <p className="text-text-primary/90 text-sm leading-relaxed" style={bodyFont}>
        {content}
      </p>
    </div>
  );
}
