'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';
import MantraCard from '@/components/puja/MantraCard';
import HeroCard from '@/components/puja/HeroCard';
import PujaMode from '@/components/puja/PujaMode';
import { computePujaMuhurta } from '@/lib/puja/muhurta-compute';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale } from '@/types/panchang';

type DisplayMode = 'devanagari' | 'iast' | 'both';

const LABELS = {
  en: {
    samagri: 'Materials',
    samagriSa: 'Samagri',
    ready: 'items ready',
    sankalpa: 'Sankalpa',
    sankalpaSa: 'Resolution',
    vidhi: 'Procedure',
    vidhiSa: 'Puja Vidhi',
    mantras: 'Mantras',
    mantrasSa: 'Mantras',
    stotras: 'Stotras',
    stotrasSa: 'Hymns',
    aarti: 'Aarti',
    aartiSa: 'Aarti',
    naivedya: 'Naivedya',
    naivedyaSa: 'Food Offering',
    precautions: 'Precautions',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'Benefits',
    phalaSa: 'Phala',
    visarjan: 'Visarjan',
    visarjanSa: 'Closing Ritual',
    muhurta: 'Timing',
    festival: 'Festival',
    vrat: 'Vrat',
    verses: 'verses',
    comingSoon: 'Puja Vidhi coming soon',
    comingSoonDesc: 'This puja vidhi is being prepared. Please check back later.',
    backToPuja: 'Back to Puja Vidhi',
    devanagari: 'Devanagari',
    iast: 'IAST',
    both: 'Both',
  },
  hi: {
    samagri: 'सामग्री',
    samagriSa: 'Materials',
    ready: 'तैयार',
    sankalpa: 'सङ्कल्प',
    sankalpaSa: 'Resolution',
    vidhi: 'पूजा विधि',
    vidhiSa: 'Procedure',
    mantras: 'मन्त्र',
    mantrasSa: 'Mantras',
    stotras: 'स्तोत्र',
    stotrasSa: 'Hymns',
    aarti: 'आरती',
    aartiSa: 'Aarti',
    naivedya: 'नैवेद्य',
    naivedyaSa: 'Food Offering',
    precautions: 'सावधानियाँ',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'फल',
    phalaSa: 'Benefits',
    visarjan: 'विसर्जन',
    visarjanSa: 'Closing Ritual',
    muhurta: 'समय',
    festival: 'त्योहार',
    vrat: 'व्रत',
    verses: 'श्लोक',
    comingSoon: 'पूजा विधि शीघ्र आ रही है',
    comingSoonDesc: 'यह पूजा विधि तैयार की जा रही है। कृपया बाद में देखें।',
    backToPuja: 'पूजा विधि पर वापस',
    devanagari: 'देवनागरी',
    iast: 'IAST',
    both: 'दोनों',
  },
  sa: {
    samagri: 'सामग्री',
    samagriSa: 'Materials',
    ready: 'सज्जम्',
    sankalpa: 'सङ्कल्पः',
    sankalpaSa: 'Resolution',
    vidhi: 'पूजाविधिः',
    vidhiSa: 'Procedure',
    mantras: 'मन्त्राः',
    mantrasSa: 'Mantras',
    stotras: 'स्तोत्राणि',
    stotrasSa: 'Hymns',
    aarti: 'आरती',
    aartiSa: 'Aarti',
    naivedya: 'नैवेद्यम्',
    naivedyaSa: 'Food Offering',
    precautions: 'सावधानताः',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'फलम्',
    phalaSa: 'Benefits',
    visarjan: 'विसर्जनम्',
    visarjanSa: 'Closing Ritual',
    muhurta: 'समयः',
    festival: 'उत्सवः',
    vrat: 'व्रतम्',
    verses: 'श्लोकाः',
    comingSoon: 'पूजाविधिः शीघ्रम् आगच्छति',
    comingSoonDesc: 'इयं पूजाविधिः सज्जीक्रियते। कृपया पश्चात् पश्यतु।',
    backToPuja: 'पूजाविधिं प्रति',
    devanagari: 'देवनागरी',
    iast: 'IAST',
    both: 'उभयम्',
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

function SectionAccordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  accentColor,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div {...fadeInUp} className="glass-card rounded-xl border border-gold-primary/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-center gap-3 hover:bg-gold-primary/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h2
            className={`text-lg font-bold ${accentColor || 'text-gold-light'}`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <span className="text-text-secondary/50 text-xs">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary/50 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-gold-primary/5">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PujaVidhiPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const slug = params.slug as string;
  const l = LABELS[locale];
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const puja = useMemo(() => getPujaVidhiBySlug(slug), [slug]);

  const storageKey = `puja-samagri-${slug}-${new Date().getFullYear()}`;

  const [samagriChecked, setSamagriChecked] = useState<boolean[]>(() => {
    if (typeof window === 'undefined') return new Array(puja?.samagri.length ?? 0).fill(false);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === (puja?.samagri.length ?? 0)) return parsed;
      }
    } catch {}
    return new Array(puja?.samagri.length ?? 0).fill(false);
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(samagriChecked)); } catch {}
  }, [samagriChecked, storageKey]);

  const [pujaMode, setPujaMode] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    () => new Set(puja?.vidhiSteps.map(s => s.step) ?? [])
  );

  // Mantra map for step references
  const mantraMap = useMemo(() => {
    if (!puja) return new Map();
    const m = new Map();
    for (const mantra of puja.mantras) {
      m.set(mantra.id, mantra);
    }
    return m;
  }, [puja]);

  const computedMuhurta = useMemo(() => {
    if (puja?.muhurtaType !== 'computed' || !puja.muhurtaWindow) return undefined;
    const now = new Date();
    try {
      return computePujaMuhurta(
        puja.muhurtaWindow.type,
        now.getFullYear(), now.getMonth() + 1, now.getDate(),
        46.46, 6.79, 1  // Default: Corseaux, Switzerland
      );
    } catch { return undefined; }
  }, [puja]);

  if (!puja) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeInUp} className="glass-card rounded-xl border border-gold-primary/10 p-10">
            <h1
              className="text-2xl font-bold text-gold-light mb-4"
              style={headingFont}
            >
              {l.comingSoon}
            </h1>
            <p className="text-text-secondary mb-6">{l.comingSoonDesc}</p>
            <Link
              href={`/${locale}/puja`}
              className="inline-block px-6 py-2.5 rounded-lg bg-gold-primary/15 text-gold-primary border border-gold-primary/25 hover:bg-gold-primary/25 transition-colors font-medium"
            >
              {l.backToPuja}
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const checkedCount = samagriChecked.filter(Boolean).length;

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const toggleSamagri = (idx: number) => {
    setSamagriChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <HeroCard
          puja={puja}
          locale={locale}
          computedMuhurta={computedMuhurta}
          locationName="Corseaux"
          timezone="CET"
        />

        {/* Start Puja buttons */}
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => { setQuickMode(false); setPujaMode(true); }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-primary/80 to-gold-primary text-[#0a0e27] font-bold text-sm hover:from-gold-primary hover:to-gold-light transition-all shadow-lg shadow-gold-primary/20"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {locale === 'en' ? 'Start Full Puja' : locale === 'hi' ? 'पूर्ण पूजा आरम्भ करें' : 'पूर्णपूजाम् आरभतु'}
          </button>
          <button
            onClick={() => { setQuickMode(true); setPujaMode(true); }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gold-primary/25 text-gold-primary font-bold text-sm hover:bg-gold-primary/10 transition-all"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {locale === 'en' ? 'Quick Mode (~15 min)' : locale === 'hi' ? 'संक्षिप्त (~15 मिनट)' : 'संक्षिप्तम् (~15 निमेषाः)'}
          </button>
        </motion.div>

        <GoldDivider />

        {/* 1. Samagri Section */}
        <SectionAccordion
          title={l.samagri}
          subtitle={l.samagriSa}
          defaultOpen
        >
          <div className="mb-3">
            <span className="text-sm text-gold-primary/70">
              {checkedCount} / {puja.samagri.length} {l.ready}
            </span>
            <div className="w-full h-1.5 rounded-full bg-gold-primary/10 mt-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-primary/60 to-gold-primary"
                animate={{ width: `${(checkedCount / puja.samagri.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {puja.samagri.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleSamagri(idx)}
                className={`flex items-start gap-3 p-3 rounded-lg text-left transition-colors border ${
                  samagriChecked[idx]
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-gold-primary/[0.02] border-gold-primary/8 hover:bg-gold-primary/5'
                }`}
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                    samagriChecked[idx]
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gold-primary/30'
                  }`}
                >
                  {samagriChecked[idx] && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-medium ${
                      samagriChecked[idx] ? 'text-emerald-300 line-through opacity-70' : 'text-gold-light'
                    }`}
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                  >
                    {item.name[locale]}
                  </span>
                  {item.quantity && (
                    <span className="text-text-secondary/50 text-xs ml-2">({item.quantity})</span>
                  )}
                  {item.note && (
                    <p className="text-text-secondary/40 text-xs mt-0.5">{item.note[locale]}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </SectionAccordion>

        {/* 2. Sankalpa Section */}
        <SectionAccordion
          title={l.sankalpa}
          subtitle={l.sankalpaSa}
          defaultOpen
        >
          <div className="rounded-lg border border-gold-primary/15 bg-gold-primary/[0.04] p-4">
            <p
              className="text-gold-light/90 text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {puja.sankalpa[locale]}
            </p>
          </div>
        </SectionAccordion>

        {/* 3. Puja Vidhi Section */}
        <SectionAccordion
          title={l.vidhi}
          subtitle={l.vidhiSa}
          defaultOpen
        >
          <div className="space-y-3">
            {puja.vidhiSteps.map((step) => {
              const isOpen = expandedSteps.has(step.step);
              const linkedMantra = step.mantraRef ? mantraMap.get(step.mantraRef) : null;
              return (
                <div
                  key={step.step}
                  className="rounded-lg border border-gold-primary/10 overflow-hidden"
                >
                  <button
                    onClick={() => toggleStep(step.step)}
                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-gold-primary/5 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary/30 to-gold-primary/10 flex items-center justify-center text-gold-primary text-sm font-bold flex-shrink-0 border border-gold-primary/20">
                      {step.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-gold-light font-semibold text-sm"
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                      >
                        {step.title[locale]}
                      </span>
                      {step.duration && (
                        <span className="text-text-secondary/40 text-xs ml-2">({step.duration})</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary/40 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 ml-11 border-t border-gold-primary/5 pt-3 space-y-3">
                          <p
                            className="text-text-secondary text-sm leading-relaxed"
                            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                          >
                            {step.description[locale]}
                          </p>
                          {linkedMantra && (
                            <div className="mt-3">
                              <MantraCard
                                mantra={linkedMantra}
                                displayMode={displayMode}
                                showMeaning
                                showJapaCount
                                locale={locale}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </SectionAccordion>

        {/* 4. Mantras Section */}
        <SectionAccordion
          title={l.mantras}
          subtitle={l.mantrasSa}
        >
          {/* Display mode toggle */}
          <div className="flex items-center gap-1 mb-4 bg-gold-primary/5 rounded-lg p-1 w-fit border border-gold-primary/10">
            {(['devanagari', 'iast', 'both'] as DisplayMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  displayMode === mode
                    ? 'bg-gold-primary/20 text-gold-primary border border-gold-primary/25'
                    : 'text-text-secondary/60 hover:text-text-secondary border border-transparent'
                }`}
              >
                {l[mode]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {puja.mantras.map((mantra) => (
              <MantraCard
                key={mantra.id}
                mantra={mantra}
                displayMode={displayMode}
                showMeaning
                showJapaCount
                locale={locale}
              />
            ))}
          </div>
        </SectionAccordion>

        {/* 5. Stotras Section */}
        {puja.stotras && puja.stotras.length > 0 && (
          <SectionAccordion
            title={l.stotras}
            subtitle={l.stotrasSa}
          >
            <div className="space-y-3">
              {puja.stotras.map((stotra, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gold-primary/10 p-4 bg-gold-primary/[0.02]"
                >
                  <h3
                    className="text-gold-light font-semibold text-sm mb-1"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                  >
                    {stotra.name[locale]}
                    {locale !== 'en' && (
                      <span className="text-text-secondary/40 text-xs ml-2 font-normal">
                        ({stotra.name.en})
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-text-secondary/50 mb-2">
                    {stotra.verseCount && (
                      <span>
                        {stotra.verseCount} {l.verses}
                      </span>
                    )}
                    {stotra.duration && <span>{stotra.duration}</span>}
                  </div>
                  {stotra.note && (
                    <p className="text-text-secondary/60 text-xs">{stotra.note[locale]}</p>
                  )}
                  {stotra.text && (
                    <div className="mt-3 p-3 rounded-md bg-gold-primary/[0.03] border border-gold-primary/8">
                      <p
                        className="text-gold-light/80 text-base leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                      >
                        {stotra.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionAccordion>
        )}

        {/* 6. Aarti Section */}
        {puja.aarti && (
          <SectionAccordion
            title={l.aarti}
            subtitle={l.aartiSa}
          >
            <div className="mb-3">
              <h3
                className="text-gold-light font-semibold text-base mb-3"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
              >
                {puja.aarti.name[locale]}
              </h3>
              {/* Display mode toggle */}
              <div className="flex items-center gap-1 mb-4 bg-gold-primary/5 rounded-lg p-1 w-fit border border-gold-primary/10">
                {(['devanagari', 'iast', 'both'] as DisplayMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      displayMode === mode
                        ? 'bg-gold-primary/20 text-gold-primary border border-gold-primary/25'
                        : 'text-text-secondary/60 hover:text-text-secondary border border-transparent'
                    }`}
                  >
                    {l[mode]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gold-primary/10 p-5 bg-gold-primary/[0.02] space-y-3">
              {(displayMode === 'devanagari' || displayMode === 'both') && (
                <p
                  className="text-gold-light text-lg leading-loose whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                >
                  {puja.aarti.devanagari}
                </p>
              )}
              {displayMode === 'both' && (
                <div className="border-t border-gold-primary/10 my-3" />
              )}
              {(displayMode === 'iast' || displayMode === 'both') && (
                <p className="text-text-secondary/70 text-sm italic leading-loose whitespace-pre-line">
                  {puja.aarti.iast}
                </p>
              )}
            </div>
          </SectionAccordion>
        )}

        {/* 7. Naivedya Section */}
        <SectionAccordion
          title={l.naivedya}
          subtitle={l.naivedyaSa}
        >
          <p
            className="text-text-secondary text-sm leading-relaxed"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {puja.naivedya[locale]}
          </p>
        </SectionAccordion>

        {/* 8. Precautions Section */}
        <SectionAccordion
          title={l.precautions}
          subtitle={l.precautionsSa}
          accentColor="text-amber-400"
        >
          <ul className="space-y-2">
            {puja.precautions.map((p, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/10 bg-amber-500/[0.04]"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400 text-xs font-bold border border-amber-500/20">
                  !
                </span>
                <p
                  className="text-text-secondary text-sm leading-relaxed"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {p[locale]}
                </p>
              </li>
            ))}
          </ul>
        </SectionAccordion>

        {/* 9. Phala Section */}
        <SectionAccordion
          title={l.phala}
          subtitle={l.phalaSa}
        >
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
            <p
              className="text-emerald-300/90 text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {puja.phala[locale]}
            </p>
          </div>
        </SectionAccordion>

        {/* 10. Visarjan Section */}
        {puja.visarjan && (
          <SectionAccordion
            title={l.visarjan}
            subtitle={l.visarjanSa}
          >
            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {puja.visarjan[locale]}
            </p>
          </SectionAccordion>
        )}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            href={`/${locale}/puja`}
            className="text-gold-primary/60 hover:text-gold-primary text-sm transition-colors"
          >
            {l.backToPuja}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {pujaMode && puja && (
          <PujaMode
            puja={puja}
            locale={locale}
            quickMode={quickMode}
            onClose={() => setPujaMode(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
