'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import { lt } from '@/lib/learn/translations';
import LearnLink from '@/components/ui/LearnLink';
import InfoBlock from '@/components/ui/InfoBlock';
import type { LocaleText } from '@/types/panchang';
import type { ScoredBirthSlot } from '@/lib/caesarean/types';
import MSG from '@/messages/pages/caesarean-muhurta.json';
import ScanForm from './components/ScanForm';
import type { ScanFormData } from './components/ScanForm';
import SlotCard from './components/SlotCard';
import ClassicalTips from './components/ClassicalTips';

const msg = (key: string, locale: string) =>
  lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

export default function CaesareanMuhurtaPage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const { detect: detectLocation } = useLocationStore();

  // Detect location on mount
  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  // --- State ---
  const [slots, setSlots] = useState<ScoredBirthSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  // AbortController for in-flight requests
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleScan = useCallback(async (data: ScanFormData) => {
    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setSlots([]);
    setHasScanned(true);

    try {
      const res = await fetch('/api/caesarean-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          startDate: data.startDate,
          endDate: data.endDate,
          lat: data.lat,
          lng: data.lng,
          timezone: data.timezone,
          opStart: data.opStart,
          opEnd: data.opEnd,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const result = await res.json();
      setSlots(result.slots || []);
    } catch (err) {
      // Don't report aborted requests as errors
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('[caesarean-muhurta] Scan failed:', err);
      setError(err instanceof Error ? err.message : 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-8">
        {/* Page header */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-gold-light mb-2"
            style={headingFont}
          >
            {msg('pageTitle', locale)}
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto" style={bodyFont}>
            {msg('pageSubtitle', locale)}
          </p>
        </div>

        {/* Ethical disclaimer */}
        <div className="mb-6 flex items-start gap-3 bg-amber-500/8 border border-amber-500/15 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
            {msg('disclaimer', locale)}
          </p>
        </div>

        {/* Scan form */}
        <ScanForm loading={loading} onScan={handleScan} />

        {/* Error banner */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
            <p className="text-text-secondary text-sm">{msg('formScanning', locale)}</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasScanned && (
          <section className="mt-8">
            <h2
              className="text-lg font-semibold text-gold-light mb-4"
              style={headingFont}
            >
              {msg('resultsTitle', locale)}
            </h2>

            {slots.length === 0 ? (
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-6 text-center">
                <p className="text-text-secondary text-sm">{msg('noResults', locale)}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot, i) => (
                  <SlotCard key={`${slot.date}-${slot.time}`} slot={slot} rank={i + 1} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Classical tips */}
        <div className="mt-12">
          <ClassicalTips />
        </div>

        {/* Editorial SEO content */}
        <section className="mt-12 space-y-6">
          <InfoBlock
            id="caesarean-muhurta-intro"
            title={msg('edTitle', locale)}
            defaultOpen={false}
          >
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {msg('edIntro', locale)}
            </p>
          </InfoBlock>

          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-5 space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {msg('edScoringTitle', locale)}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {msg('edScoring', locale)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <LearnLink
              href="/muhurta-ai"
              label={isDevanagari ? 'मुहूर्त AI स्कैनर' : 'Muhurta AI Scanner'}
              showIcon
            />
            <LearnLink
              href="/charts"
              label={isDevanagari ? 'कुण्डली बनायें' : 'Generate Kundali'}
              showIcon
            />
          </div>
        </section>
      </div>
    </main>
  );
}
