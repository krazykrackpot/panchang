'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import type { DoshaInsight } from '@/lib/kundali/tippanni-types';
import { computeMemberStatus, type MemberStatus } from '@/lib/kundali/family-synthesis/member-status';
import { getPlanetaryPositions, toSidereal, getRashiNumber, dateToJD } from '@/lib/ephem/astronomical';
import type { BirthData, KundaliData } from '@/types/kundali';
import { ArrowRight } from 'lucide-react';

interface SavedChart {
  id: string;
  label: string;
  birth_data: BirthData;
  is_primary: boolean;
  created_at: string;
}

// Badge style map keyed by dosha type
const BADGE: Record<string, { border: string; text: string; bg: string }> = {
  manglik:       { border: 'border-red-500/20',    text: 'text-red-400',    bg: 'bg-red-500/10' },
  manglikOk:     { border: 'border-green-500/20',  text: 'text-green-400',  bg: 'bg-green-500/10' },
  kaalSarpa:     { border: 'border-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  gandaMula:     { border: 'border-amber-500/20',  text: 'text-amber-400',  bg: 'bg-amber-500/10' },
  sadeSati:      { border: 'border-blue-500/20',   text: 'text-blue-400',   bg: 'bg-blue-500/10' },
};

function getCurrentTransitSigns(): { saturnSign: number; jupiterSign: number } {
  const now = new Date();
  const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 12);
  const planets = getPlanetaryPositions(jd);
  // planets[6] = Saturn, planets[4] = Jupiter — tropical longitudes converted to sidereal
  const saturnSid = toSidereal(planets[6].longitude, jd);
  const jupiterSid = toSidereal(planets[4].longitude, jd);
  return { saturnSign: getRashiNumber(saturnSid), jupiterSign: getRashiNumber(jupiterSid) };
}

const REL_LABELS: Record<string, string> = {
  self: 'You', spouse: 'Spouse', child: 'Child', parent: 'Parent',
  sibling: 'Sibling', friend: 'Friend', other: 'Other',
};

export default function FamilyDoshaStrip({ locale }: { locale: string }) {
  const { user } = useAuthStore();
  const [statuses, setStatuses] = useState<MemberStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCharts, setHasCharts] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    try {
      const { data, error } = await sb
        .from('saved_charts')
        .select('*')
        .order('created_at');

      if (error) {
        console.error('[FamilyDoshaStrip] fetch error:', error);
        setLoading(false);
        return;
      }

      const charts = (data ?? []) as SavedChart[];
      if (charts.length === 0) { setHasCharts(false); setLoading(false); return; }
      setHasCharts(true);

      const { saturnSign, jupiterSign } = getCurrentTransitSigns();
      const today = new Date();
      const results: MemberStatus[] = [];

      for (const chart of charts) {
        try {
          const bd = chart.birth_data;
          const kundali: KundaliData = generateKundali({
            name: bd.name ?? chart.label,
            date: bd.date,
            time: bd.time,
            place: bd.place ?? '',
            lat: bd.lat,
            lng: bd.lng,
            timezone: bd.timezone ?? 'UTC',
            ayanamsha: bd.ayanamsha ?? 'lahiri',
            relationship: bd.relationship,
          });
          // Use tippanni engine for authoritative dosha detection (single source of truth)
          const tippanni = generateTippanni(kundali, 'en');
          const tippanniDoshas = tippanni.doshas.map((d: DoshaInsight) => ({
            name: d.name, present: d.present, severity: d.severity, effectiveSeverity: d.effectiveSeverity,
          }));
          results.push(computeMemberStatus({
            name: bd.name ?? chart.label,
            relationship: bd.relationship ?? (chart.is_primary ? 'self' : 'other'),
            chartId: chart.id,
            kundali,
            currentSaturnSign: saturnSign,
            currentJupiterSign: jupiterSign,
            today,
            tippanniDoshas,
          }));
        } catch (err) {
          console.error(`[FamilyDoshaStrip] kundali error for ${chart.id}:`, err);
        }
      }
      setStatuses(results);
    } catch (err) {
      console.error('[FamilyDoshaStrip] load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Don't render if not logged in, no charts, or still loading with nothing
  if (!user || loading) {
    if (loading && user) {
      return (
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-5 animate-pulse">
          <div className="h-4 w-40 bg-white/5 rounded mb-3" />
          <div className="h-3 w-full bg-white/5 rounded mb-2" />
          <div className="h-3 w-3/4 bg-white/5 rounded" />
        </div>
      );
    }
    return null;
  }
  if (!hasCharts) return null;

  // Build badge list per member
  const rows = statuses.map((m) => {
    const badges: { key: string; label: string; style: typeof BADGE['manglik']; tooltip: string }[] = [];
    const d = m.doshaFlags;

    if (d.manglik && !d.manglikCancelled) {
      badges.push({ key: 'manglik', label: 'Manglik', style: BADGE.manglik, tooltip: 'Manglik Dosha: Mars is in a marital house (1st, 2nd, 4th, 7th, 8th, or 12th). This can cause delays or conflicts in marriage. Remedies include Kumbh Vivah, Mangal Shanti Puja, and marrying another Manglik.' });
    } else if (d.manglik && d.manglikCancelled) {
      badges.push({ key: 'manglikOk', label: 'Manglik (cancelled)', style: BADGE.manglikOk, tooltip: 'Manglik Dosha (Cancelled): Mars is in a Manglik house but cancellation conditions are met (e.g., Mars in own sign, Jupiter\'s aspect, benefic conjunction). The dosha is effectively neutralized \u2014 no special remedies needed.' });
    }
    if (d.kaalSarpa) {
      const ksType = d.kaalSarpaType ?? '';
      const KS_THEMES: Record<string, string> = {
        'Anant': 'self-identity and health', 'Kulika': 'wealth and family',
        'Vasuki': 'courage and communication', 'Shankhapala': 'home and emotional security',
        'Padma': 'children and creativity', 'Mahapadma': 'enemies and health',
        'Takshaka': 'marriage and partnerships', 'Karkotak': 'longevity and transformation',
        'Shankhachud': 'luck and dharma', 'Ghatak': 'career and reputation',
        'Vishdhar': 'gains and ambitions', 'Sheshnag': 'foreign lands and liberation',
      };
      const theme = KS_THEMES[ksType] ?? 'various life areas';
      badges.push({ key: 'kaalSarpa', label: `Kaal Sarpa${ksType ? ` (${ksType})` : ''}`, style: BADGE.kaalSarpa, tooltip: `Kaal Sarpa Dosha${ksType ? ` (${ksType})` : ''}: All planets are hemmed between Rahu and Ketu. This karmic pattern causes periodic obstacles and delays.${ksType ? ` The ${ksType} type specifically affects ${theme}.` : ''} Remedies: Kaal Sarp Nivaran Puja at Trimbakeshwar, Maha Mrityunjaya Mantra.` });
    }
    if (d.moolaNakshatra) {
      badges.push({ key: 'gandaMula', label: `Ganda Mula${d.moolaNakshatraName ? ` (${d.moolaNakshatraName})` : ''}`, style: BADGE.gandaMula, tooltip: 'Ganda Mula Nakshatra: Born in a junction nakshatra at the border between water and fire signs. Traditionally requires Mula Shanti puja for the child\'s wellbeing.' });
    }
    if (m.sadeSati.isActive && m.sadeSati.phase) {
      const SADE_SATI_DESC: Record<string, string> = {
        rising: 'initial phase \u2014 Saturn enters the sign before your Moon',
        peak: 'most intense phase \u2014 Saturn is on your Moon sign',
        setting: 'final phase \u2014 Saturn is in the sign after your Moon, intensity decreasing',
      };
      const desc = SADE_SATI_DESC[m.sadeSati.phase] ?? '';
      badges.push({ key: 'sadeSati', label: `Sade Sati (${m.sadeSati.phase})`, style: BADGE.sadeSati, tooltip: `Sade Sati (${m.sadeSati.phase} phase): Saturn is transiting near the natal Moon sign. This 7.5-year period brings karmic lessons, discipline, and transformation. ${m.sadeSati.phase} phase is the ${desc}.` });
    }
    return { ...m, badges };
  });

  const anyDosha = rows.some((r) => r.badges.length > 0);

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gold-light tracking-wide">Family Health Check</h3>
        <Link href="/dashboard/family" className="text-[11px] text-gold-primary/70 hover:text-gold-primary flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {!anyDosha ? (
        <p className="text-xs text-text-secondary">No active doshas detected across family members.</p>
      ) : (
        <div className="space-y-0">
          {rows.map((r) => (
            <div key={r.chartId} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <div className="w-24 shrink-0">
                <span className="text-sm text-text-primary font-medium block truncate">{r.name}</span>
                <span className="text-[10px] text-text-secondary">{REL_LABELS[r.relationship] ?? r.relationship}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.badges.length === 0 ? (
                  <span className="text-[11px] text-text-secondary italic">no active doshas</span>
                ) : (
                  r.badges.map((b) => (
                    <span key={b.key} className={`text-[10px] px-2 py-0.5 rounded-full border ${b.style.border} ${b.style.text} ${b.style.bg}`} title={b.tooltip}>
                      {b.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
