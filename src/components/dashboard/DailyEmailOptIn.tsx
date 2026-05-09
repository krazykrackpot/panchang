'use client';

import { useState, useEffect } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { tl } from '@/lib/utils/trilingual';

const DISMISS_KEY = 'dp-email-optin-dismissed';

const LABELS = {
  en: {
    message: 'Get your daily panchang + rashifal at sunrise',
    enable: 'Enable',
    enabled: 'Enabled',
  },
  hi: {
    message: 'सूर्योदय पर दैनिक पंचांग + राशिफल प्राप्त करें',
    enable: 'चालू करें',
    enabled: 'सक्रिय',
  },
};

/**
 * Compact inline email opt-in strip for the dashboard.
 *
 * Only shown when:
 *   - User is logged in
 *   - daily_panchang_email is false in their profile
 *   - User hasn't dismissed this strip (persisted in localStorage)
 *
 * On enable: updates user_profiles.daily_panchang_email = true
 * and notification_prefs.daily_panchang = true in Supabase.
 */
export default function DailyEmailOptIn({ locale }: { locale: string }) {
  const { user, initialized } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const isHi = locale !== 'en';
  const L = isHi ? LABELS.hi : LABELS.en;

  useEffect(() => {
    if (!initialized || !user) return;

    // Check localStorage dismissal
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      console.error('[DailyEmailOptIn] localStorage read failed');
    }

    // Check if already opted in
    const supabase = getSupabase();
    if (!supabase) return;

    supabase
      .from('user_profiles')
      .select('daily_panchang_email')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('[DailyEmailOptIn] fetch failed:', error.message);
          return;
        }
        // Only show if not already opted in
        if (!data?.daily_panchang_email) {
          setVisible(true);
        }
      });
  }, [initialized, user]);

  const handleEnable = async () => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        daily_panchang_email: true,
        notification_prefs: { daily_panchang: true },
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      console.error('[DailyEmailOptIn] update failed:', error.message);
      return;
    }

    setDone(true);
    // Auto-hide after 2 seconds
    setTimeout(() => setVisible(false), 2000);
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      console.error('[DailyEmailOptIn] localStorage write failed');
    }
  };

  if (!visible) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#2d1b69]/40 to-[#1a1040]/40 border border-gold-primary/15 px-4 py-3">
      <Mail className="w-4 h-4 text-gold-primary shrink-0" />
      <p className="text-text-secondary text-sm flex-1">{L.message}</p>
      {done ? (
        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
          <Check className="w-3.5 h-3.5" />
          {L.enabled}
        </span>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEnable}
            disabled={saving}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-gold-primary text-bg-primary hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {saving ? '...' : L.enable}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-text-secondary/50 hover:text-text-secondary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
