'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { ArrowRight } from 'lucide-react';

interface ProfileBannerData {
  display_name: string;
  moon_sign: number;
  ascendant_sign: number;
  moonRashiName: { en: string; hi: string; sa: string } | null;
  lagnaRashiName: { en: string; hi: string; sa: string } | null;
  moonNakshatraName: { en: string; hi: string; sa: string } | null;
  currentDasha: { maha: { planetName: { en: string; hi: string; sa: string } } } | null;
  spiActive: boolean;
}

export default function ProfileBanner({ locale, bf }: { locale: string; bf: React.CSSProperties }) {
  const { user, initialized } = useAuthStore();
  const [data, setData] = useState<ProfileBannerData | null>(null);
  const isIndic = locale === 'hi' || locale === 'sa';

  const fetchProfile = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.snapshot) return;
      setData({
        display_name: json.profile?.display_name || '',
        moon_sign: json.snapshot.moon_sign,
        ascendant_sign: json.snapshot.ascendant_sign,
        moonRashiName: json.snapshot.moonRashiName,
        lagnaRashiName: json.snapshot.lagnaRashiName,
        moonNakshatraName: json.snapshot.moonNakshatraName,
        currentDasha: json.snapshot.currentDasha,
        spiActive: json.snapshot.sade_sati?.isActive || false,
      });
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (initialized && user) fetchProfile();
  }, [initialized, user, fetchProfile]);

  if (!data) return null;

  const t = (texts: { en: string; hi: string; ta?: string }) =>
    isIndic ? texts.hi : texts.en;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="animate-fade-in-up">
        <Link href="/profile" className="block group">
          <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-r from-gold-primary/[0.04] via-transparent to-gold-primary/[0.04] hover:border-gold-primary/30 transition-all px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <RashiIconById id={data.moon_sign} size={44} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gold-light font-semibold text-sm truncate" style={bf}>
                    {data.display_name || t({ en: 'Your Vedic Profile', hi: 'आपकी वैदिक कुंडली' })}
                  </span>
                  {data.spiActive && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium shrink-0">
                      {t({ en: 'Sade Sati', hi: 'साढ़े साती' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary/70" style={bf}>
                  <span>{t({ en: 'Moon', hi: 'चन्द्र' })}: <span className="text-gold-primary/80">{data.moonRashiName?.[locale as 'en' | 'hi' | 'sa'] || data.moonRashiName?.en}</span></span>
                  <span className="text-gold-primary/20">|</span>
                  <span>{t({ en: 'Lagna', hi: 'लग्न' })}: <span className="text-gold-primary/80">{data.lagnaRashiName?.[locale as 'en' | 'hi' | 'sa'] || data.lagnaRashiName?.en}</span></span>
                  {data.currentDasha && (
                    <>
                      <span className="text-gold-primary/20">|</span>
                      <span>{t({ en: 'Dasha', hi: 'दशा' })}: <span className="text-gold-primary/80">{data.currentDasha.maha.planetName?.[locale as 'en' | 'hi' | 'sa'] || data.currentDasha.maha.planetName?.en}</span></span>
                    </>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary/55 group-hover:text-gold-primary/60 transition-colors shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
