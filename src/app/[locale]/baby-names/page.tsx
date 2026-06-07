'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { resolveBirthTimezone } from '@/lib/utils/timezone';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { pickBabyLabel } from '@/lib/content/baby-names-labels';

export default function BabyNamesPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const L = (key: string): string => pickBabyLabel(key, locale);

  const [selectedNak, setSelectedNak] = useState(0);
  const [selectedPada, setSelectedPada] = useState(0); // 0 = all padas

  // Birth details for auto-detection
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthPlaceName, setBirthPlaceName] = useState('');
  const [birthLat, setBirthLat] = useState<number | null>(null);
  const [birthLng, setBirthLng] = useState<number | null>(null);
  const [birthTz, setBirthTz] = useState<string | null>(null);
  const [detectedNak, setDetectedNak] = useState(0);
  const [detectedPada, setDetectedPada] = useState(0);

  // Auto-fill from user profile
  const { user, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || !user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_time_known, birth_place, birth_lat, birth_lng, birth_timezone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        // Round 3 R3-UI-4 — surface profile load errors.
        if (error) console.error('[baby-names] profile load failed:', error.message);
        if (data?.date_of_birth && data?.birth_lat != null) {
          setBirthDate(data.date_of_birth);
          if (data.time_of_birth && data.birth_time_known) setBirthTime(data.time_of_birth.substring(0, 5));
          setBirthPlaceName(data.birth_place || '');
          setBirthLat(data.birth_lat);
          setBirthLng(data.birth_lng);
          // ALWAYS resolve timezone from coordinates  –  never trust stored birth_timezone
          if (data.birth_lat && data.birth_lng) {
            resolveBirthTimezone(Number(data.birth_lat), Number(data.birth_lng)).then(tz => setBirthTz(tz));
          }
        }
      });
  }, [initialized, user]);

  // Server action: compute nakshatra on server where Swiss Ephemeris is available
  useEffect(() => {
    if (!birthDate || birthLat == null || birthLng == null || !birthTz) return;
    let cancelled = false;
    computeBirthSignsAction(birthDate, birthTime, birthLat, birthLng, birthTz)
      .then(b => {
        if (cancelled) return;
        setDetectedNak(b.moonNakshatra);
        setDetectedPada(b.moonPada);
        setSelectedNak(b.moonNakshatra);
        setSelectedPada(b.moonPada);
      })
      .catch((err) => console.error('[baby-names] Birth sign computation failed:', err));
    return () => { cancelled = true; };
  }, [birthDate, birthTime, birthLat, birthLng, birthTz]);

  const syllables = useMemo(() => {
    if (!selectedNak) return [];
    const data = NAKSHATRA_SYLLABLES[selectedNak];
    if (!data) return [];
    if (selectedPada > 0 && selectedPada <= 4) {
      return [data[selectedPada - 1]];
    }
    return data;
  }, [selectedNak, selectedPada]);

  // Locale-aware syllable script picker. NAKSHATRA_SYLLABLES carries
  // all 10 locale fields; fall back to en if a locale is missing (defensive).
  const sylFor = (s: typeof syllables[number]): string =>
    (s as Record<string, string | undefined>)[locale] ?? s.en ?? '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{L('heroTitle')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {L('heroSubtitle')}
        </p>
      </motion.div>

      {/* Static educational content for SEO */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <p className="text-text-primary text-base leading-relaxed mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {L('intro1')}
          </p>
          <p className="text-text-secondary/80 text-base leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {L('intro2')}
          </p>
        </div>
      </div>

      {/* Educational sub-cards */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {L('whyTitle')}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L('whyBody')}
            </p>
          </div>
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {L('howTitle')}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L('howBody')}
            </p>
          </div>
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {L('modernTitle')}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L('modernBody')}
            </p>
          </div>
        </div>
      </div>

      {/* Birth details  –  compact row */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {L('enterBirth')}
        </label>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
            className="bg-transparent border border-gold-primary/15 rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 [color-scheme:dark]" />
          <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)}
            className="bg-transparent border border-gold-primary/15 rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 [color-scheme:dark]" />
          <div className="w-48">
            <LocationSearch
              value={birthPlaceName}
              onSelect={(loc) => { setBirthPlaceName(loc.name); setBirthLat(loc.lat); setBirthLng(loc.lng); setBirthTz(loc.timezone); }}
              placeholder={L('birthCityPlaceholder')}
            />
          </div>
        </div>
        {detectedNak > 0 && (
          <p className="text-center text-gold-primary text-xs mt-3">
            {L('detectedLabel')}: {tl(NAKSHATRAS[detectedNak - 1]?.name, locale)} {L('pada')} {detectedPada}
          </p>
        )}
      </div>

      {/* Nakshatra selector */}
      <div className="mb-6">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {L('selectNakshatra')}
          {detectedNak > 0 && <span className="text-text-secondary/65 font-normal ml-2">({L('orChangeBelow')})</span>}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {NAKSHATRAS.map(n => {
            const isDetected = detectedNak === n.id;
            const isSelected = selectedNak === n.id;
            return (
              <button key={n.id} onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
                className={`rounded-xl text-center transition-all ${
                  isSelected
                    ? 'col-span-2 row-span-2 p-4 bg-gradient-to-br from-gold-primary/15 to-gold-primary/5 border-gold-primary/50 border-2 shadow-xl shadow-gold-primary/15 ring-1 ring-gold-primary/20'
                    : isDetected
                    ? 'p-2.5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/30 border-2 border-dashed'
                    : 'p-2.5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20'
                }`}>
                <div className="flex justify-center">
                  <NakshatraIconById id={n.id} size={isSelected ? 48 : 24} />
                </div>
                <div className={`mt-1 font-medium ${isSelected ? 'text-gold-light text-sm' : 'text-text-secondary text-xs'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(n.name, locale)}
                </div>
                {isSelected && detectedPada > 0 && (
                  <div className="text-gold-primary/60 text-xs mt-1">{L('pada')} {detectedPada}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedNak > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Explanation: What are Padas? */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/12 p-5 mb-6">
              <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
                {L('padaTitle')}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {L('padaBody')}
              </p>
            </div>

            {/* Pada selector */}
            <div className="mb-8">
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
                {L('selectPada')}
                {detectedPada > 0 && <span className="text-gold-primary font-normal ml-2"> –  {L('pada')} {detectedPada}</span>}
              </label>
              <div className="flex justify-center gap-3">
                <button onClick={() => setSelectedPada(0)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedPada === 0 ? 'bg-gradient-to-br from-gold-primary/20 to-gold-primary/10 text-gold-light border border-gold-primary/40' : 'bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] text-text-secondary border border-gold-primary/8 hover:border-gold-primary/20'}`}>
                  {L('allPadas')}
                </button>
                {[1, 2, 3, 4].map(p => (
                  <button key={p} onClick={() => setSelectedPada(p)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedPada === p
                        ? 'bg-gradient-to-br from-gold-primary/20 to-gold-primary/10 text-gold-light border-2 border-gold-primary/50'
                        : p === detectedPada
                        ? 'bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] text-gold-primary border-2 border-gold-primary/30 border-dashed'
                        : 'bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] text-text-secondary border border-gold-primary/8 hover:border-gold-primary/20'
                    }`}>
                    {L('pada')} {p}
                  </button>
                ))}
              </div>
            </div>

            <GoldDivider />

            {/* Syllables  –  the main result */}
            <div className="my-8">
              <h3 className="text-gold-light text-xl font-bold mb-2 text-center" style={headingFont}>
                {L('syllablesTitle')}
              </h3>
              <p className="text-text-secondary/75 text-sm text-center mb-6">
                {L('syllableHint')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {syllables.map((syl, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] rounded-2xl p-6 border-2 border-gold-primary/25 min-w-[110px] text-center shadow-lg shadow-gold-primary/10"
                  >
                    <div className="text-5xl font-bold text-gold-light mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                      {sylFor(syl)}
                    </div>
                    <div className="text-text-secondary text-sm">
                      {locale === 'en' ? syl.hi : syl.en}
                    </div>
                    <div className="text-text-secondary/55 text-xs mt-1">
                      {L('pada')} {selectedPada || (i + 1)}
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-text-secondary/65 text-xs text-center mt-6">
                {L('exampleHint')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready Reckoner  –  full Nakshatra × Pada syllable table */}
      <GoldDivider />
      <div className="my-10">
        <h3 className="text-gold-gradient text-2xl font-bold mb-2 text-center" style={headingFont}>
          {L('referenceTitle')}
        </h3>
        <p className="text-text-secondary/70 text-sm text-center mb-6">
          {L('referenceSubtitle')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map(n => {
            const syls = NAKSHATRA_SYLLABLES[n.id];
            const isHighlighted = n.id === selectedNak;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
                className={`rounded-xl p-4 transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-gold-primary/15 via-gold-primary/5 to-transparent border-2 border-gold-primary/40 shadow-lg shadow-gold-primary/10 ring-1 ring-gold-primary/15'
                    : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20 hover:bg-[#1a1040]/40'
                }`}
              >
                {/* Nakshatra header */}
                <div className="flex items-center gap-3 mb-3">
                  <NakshatraIconById id={n.id} size={isHighlighted ? 28 : 22} />
                  <div>
                    <span className={`font-bold ${isHighlighted ? 'text-gold-light text-base' : 'text-text-primary text-sm'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {tl(n.name, locale)}
                    </span>
                    <span className="text-text-secondary/55 text-xs ml-2">#{n.id}</span>
                  </div>
                </div>
                {/* 4 Pada syllables in a row */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map(pi => {
                    const syl = syls?.[pi];
                    const isThisPada = isHighlighted && (selectedPada === 0 || selectedPada === pi + 1);
                    return (
                      <div key={pi} className={`rounded-lg py-2 px-1 text-center ${
                        isThisPada
                          ? 'bg-gold-primary/20 border border-gold-primary/40'
                          : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8'
                      }`}>
                        <div className={`font-bold ${isThisPada ? 'text-gold-light text-lg' : 'text-text-secondary text-sm'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {syl ? sylFor(syl) : ' – '}
                        </div>
                        <div className="text-xs text-text-secondary/55 mt-0.5">P{pi + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <RelatedLinks type="learn" links={getLearnLinksForTool('/baby-names')} locale={locale} />
    </div>
  );
}
