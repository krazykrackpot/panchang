'use client';

import { useState, useEffect, useCallback } from 'react';
import { authedFetch } from '@/lib/api/authed-fetch';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyMarriageDetail from './FamilyMarriageDetail';
import FamilyChildDetail from './FamilyChildDetail';
import type { FamilyReading, ChildDynamics } from '@/lib/kundali/family-synthesis/types';

interface FamilyCardProps {
  locale: string;
}

const LABELS = {
  title:    { en: 'Your Family', hi: 'आपका परिवार' },
  marriage: { en: 'Marriage', hi: 'विवाह' },
  children: { en: 'Children', hi: 'संतान' },
  view:     { en: 'View', hi: 'देखें' },
  loading:  { en: 'Loading family insights...', hi: 'पारिवारिक अंतर्दृष्टि लोड हो रही है...' },
  error:    { en: 'Could not load family insights.', hi: 'पारिवारिक अंतर्दृष्टि लोड नहीं हो सकी।' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  return tl(LABELS[key], locale);
}

export default function FamilyCard({ locale }: FamilyCardProps) {
  const [familyReading, setFamilyReading] = useState<FamilyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<'none' | 'marriage' | string>('none');
  const [selectedChild, setSelectedChild] = useState<ChildDynamics | null>(null);

  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  const fetchFamilyReading = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authedFetch('/api/family-synthesis', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 404) {
          // No primary kundali or no family charts — don't show the card
          setFamilyReading(null);
          setLoading(false);
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setFamilyReading(data.familyReading);
    } catch (err) {
      console.error('[FamilyCard] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilyReading();
  }, [fetchFamilyReading]);

  // Don't render if no family data
  if (!loading && !error && !familyReading) return null;
  if (loading) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 bg-white/[0.06] rounded" />
          <div className="h-3 w-full bg-white/[0.04] rounded" />
          <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-red-500/20 p-5">
        <p className="text-red-400 text-sm">{label('error', locale)}</p>
      </div>
    );
  }
  if (!familyReading) return null;

  // Detail views
  if (detailView === 'marriage' && familyReading.marriageDynamics) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <FamilyMarriageDetail
          dynamics={familyReading.marriageDynamics}
          locale={locale}
          onClose={() => setDetailView('none')}
        />
      </div>
    );
  }
  if (detailView.startsWith('child:') && selectedChild) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <FamilyChildDetail
          childName={selectedChild.childName}
          dynamics={selectedChild.dynamics}
          locale={locale}
          onClose={() => { setDetailView('none'); setSelectedChild(null); }}
        />
      </div>
    );
  }

  // Compact card view
  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
      {/* Header */}
      <h3 className="text-gold-light text-base font-semibold tracking-wide mb-4" style={headingStyle}>
        {label('title', locale)}
      </h3>

      <div className="space-y-3">
        {/* Marriage sub-card */}
        {familyReading.marriageDynamics && (
          <button
            type="button"
            onClick={() => setDetailView('marriage')}
            className="w-full text-left rounded-xl bg-white/[0.02] border border-gold-primary/10 hover:border-gold-primary/25 p-3.5 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-primary text-sm font-medium" style={bodyStyle}>
                {label('marriage', locale)}
              </span>
              <span className="text-gold-primary text-xs">
                {label('view', locale)} &rarr;
              </span>
            </div>
            {familyReading.marriageDynamics.gunaScore !== undefined && (
              <span className="text-text-secondary text-xs">
                {familyReading.marriageDynamics.gunaScore}/36 {locale === 'hi' || locale === 'sa' ? 'गुण मिलान' : 'Guna Milan'}
              </span>
            )}
            <p className="text-text-secondary text-xs mt-1 line-clamp-2" style={bodyStyle}>
              {tl(familyReading.marriageDynamics.currentDynamic, locale).substring(0, 120)}...
            </p>
          </button>
        )}

        {/* Children sub-cards */}
        {familyReading.childrenDynamics.map((child) => (
          <button
            key={child.chartId}
            type="button"
            onClick={() => { setSelectedChild(child); setDetailView(`child:${child.chartId}`); }}
            className="w-full text-left rounded-xl bg-white/[0.02] border border-gold-primary/10 hover:border-gold-primary/25 p-3.5 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-primary text-sm font-medium" style={bodyStyle}>
                {child.childName}
              </span>
              <span className="text-gold-primary text-xs">
                {label('view', locale)} &rarr;
              </span>
            </div>
            <p className="text-text-secondary text-xs line-clamp-2" style={bodyStyle}>
              {tl(child.dynamics.currentDynamic, locale).substring(0, 120)}...
            </p>
          </button>
        ))}
      </div>

      {/* Family summary */}
      {familyReading.familySummary && (
        <p className="mt-4 text-text-secondary text-xs leading-relaxed italic" style={bodyStyle}>
          {tl(familyReading.familySummary, locale)}
        </p>
      )}
    </div>
  );
}
