'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, Check, ChevronDown } from 'lucide-react';
import { generateSankalpa } from '@/lib/puja/sankalpa-generator';
import type { PujaVidhi } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ─────────────────────────────────────── */

const LABELS = {
  en: {
    personalize: 'Personalize with your name & gotra',
    name: 'Your name (Devanagari)',
    gotra: 'Select Gotra',
    copied: 'Copied!',
    fields: 'Panchang Fields',
    samvatsara: 'Samvatsara',
    ayana: 'Ayana',
    ritu: 'Ritu',
    masa: 'Masa',
    paksha: 'Paksha',
    tithi: 'Tithi',
    vara: 'Vara',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
  },
  hi: {
    personalize: 'नाम और गोत्र से व्यक्तिगत बनाएं',
    name: 'आपका नाम (देवनागरी)',
    gotra: 'गोत्र चुनें',
    copied: 'कॉपी हुआ!',
    fields: 'पंचांग तत्त्व',
    samvatsara: 'संवत्सर',
    ayana: 'अयन',
    ritu: 'ऋतु',
    masa: 'मास',
    paksha: 'पक्ष',
    tithi: 'तिथि',
    vara: 'वार',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
  },
  sa: {
    personalize: 'नामगोत्राभ्यां स्वीकुरुत',
    name: 'भवतः नाम (देवनागरी)',
    gotra: 'गोत्रं चिनुत',
    copied: 'प्रतिलिपितम्!',
    fields: 'पञ्चाङ्गतत्त्वानि',
    samvatsara: 'संवत्सरः',
    ayana: 'अयनम्',
    ritu: 'ऋतुः',
    masa: 'मासः',
    paksha: 'पक्षः',
    tithi: 'तिथिः',
    vara: 'वासरः',
    nakshatra: 'नक्षत्रम्',
    yoga: 'योगः',
  },
};

const GOTRAS = [
  'भारद्वाज', 'कश्यप', 'वशिष्ठ', 'गौतम', 'जमदग्नि',
  'विश्वामित्र', 'अत्रि', 'अगस्त्य', 'अंगिरस', 'भृगु',
  'शाण्डिल्य', 'कौण्डिन्य', 'मौद्गल्य', 'गर्ग', 'पराशर',
];

/* ── Props ─────────────────────────────────────────────────── */

interface SankalpaDisplayProps {
  puja: PujaVidhi;
  locale: Locale;
  date?: Date;
  lat?: number;
  lng?: number;
  timezoneOffset?: number;
}

/* ── Component ─────────────────────────────────────────────── */

export default function SankalpaDisplay({
  puja,
  locale,
  date,
  lat,
  lng,
  timezoneOffset,
}: SankalpaDisplayProps) {
  const l = LABELS[locale];
  const isDevanagari = (locale === 'hi' || String(locale) === 'sa');
  const bodyFont = isDevanagari ? 'var(--font-devanagari-body)' : undefined;

  const canCompute = date != null && lat != null && lng != null && timezoneOffset != null;

  const [showPersonalize, setShowPersonalize] = useState(false);
  const [userName, setUserName] = useState('');
  const [gotra, setGotra] = useState('');
  const [copied, setCopied] = useState(false);

  const generated = useMemo(() => {
    if (!canCompute) return null;
    try {
      return generateSankalpa({
        date,
        lat,
        lng,
        timezoneOffset,
        userName: userName || undefined,
        gotra: gotra || undefined,
        pujaDeity: puja.deity.sa,
        festivalSlug: puja.festivalSlug,
      });
    } catch {
      return null;
    }
  }, [canCompute, date, lat, lng, timezoneOffset, userName, gotra, puja.deity.sa, puja.festivalSlug]);

  const handleCopy = useCallback(async () => {
    const text = generated?.devanagari ?? puja.sankalpa[locale];
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }, [generated, puja.sankalpa, locale]);

  /* ── Static fallback (no date/location) ──────────────────── */

  if (!canCompute || !generated) {
    return (
      <div className="relative rounded-lg border border-gold-primary/15 bg-gold-primary/[0.04] p-4">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 text-gold-primary/70 hover:text-gold-primary transition-colors"
          aria-label="Copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <p
          className="text-gold-light/90 text-sm leading-relaxed pr-10"
          style={bodyFont ? { fontFamily: bodyFont } : undefined}
        >
          {puja.sankalpa[locale]}
        </p>
      </div>
    );
  }

  /* ── Dynamic sankalpa with personalization ────────────────── */

  const fieldEntries: { key: string; label: string; value: string }[] = [
    { key: 'samvatsara', label: l.samvatsara, value: generated.fields.samvatsara },
    { key: 'ayana', label: l.ayana, value: generated.fields.ayana },
    { key: 'ritu', label: l.ritu, value: generated.fields.ritu },
    { key: 'masa', label: l.masa, value: generated.fields.masa },
    { key: 'paksha', label: l.paksha, value: generated.fields.paksha },
    { key: 'tithi', label: l.tithi, value: generated.fields.tithi },
    { key: 'vara', label: l.vara, value: generated.fields.vara },
    { key: 'nakshatra', label: l.nakshatra, value: generated.fields.nakshatra },
    { key: 'yoga', label: l.yoga, value: generated.fields.yoga },
  ];

  return (
    <div className="space-y-4">
      {/* ── Sankalpa text ──────────────────────────────────────── */}
      <div className="relative rounded-lg border border-gold-primary/20 bg-gold-primary/[0.04] p-5">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 text-gold-primary/70 hover:text-gold-primary transition-colors"
          aria-label="Copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <p
          className="text-gold-light text-lg leading-loose whitespace-pre-line pr-10"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {generated.devanagari}
        </p>
      </div>

      {/* ── Personalize toggle ─────────────────────────────────── */}
      <button
        onClick={() => setShowPersonalize(!showPersonalize)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gold-primary/10 hover:bg-gold-primary/15 border border-gold-primary/15 text-gold-primary/80 hover:text-gold-primary transition-colors"
        style={bodyFont ? { fontFamily: bodyFont } : undefined}
      >
        <User className="w-4 h-4" />
        <span>{l.personalize}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showPersonalize ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showPersonalize && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg border border-gold-primary/10 bg-gold-primary/[0.02]">
              {/* Name input */}
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder={l.name}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-gold-primary/15 text-gold-light placeholder:text-text-secondary/55 text-sm focus:outline-none focus:border-gold-primary/40 transition-colors"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              />

              {/* Gotra dropdown */}
              <div className="relative flex-1">
                <select
                  value={gotra}
                  onChange={e => setGotra(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-gold-primary/15 text-gold-light text-sm appearance-none focus:outline-none focus:border-gold-primary/40 transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  <option value="" className="bg-[#0a0e27] text-text-secondary">
                    {l.gotra}
                  </option>
                  {GOTRAS.map(g => (
                    <option key={g} value={g} className="bg-[#0a0e27] text-gold-light">
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/65 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Panchang field badges ──────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {fieldEntries.map(f => (
          <span
            key={f.key}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-gold-primary/[0.06] border border-gold-primary/10 text-text-secondary/70"
          >
            <span className="text-text-secondary/65">{f.label}:</span>
            <span
              className="font-semibold text-gold-primary/80"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {f.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
