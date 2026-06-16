'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { pickByScript } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/lib/i18n/config';

// Three-state card:
//   - 'idle'   : not subscribed; show "Enable" + collapsible form
//   - 'pending': OTP sent; collect 6-digit code
//   - 'active' : verified; show manage controls
//
// Auth: uses the user's Supabase session access token to call /api/whatsapp/*.
// Dismiss state persisted in localStorage (independent of subscription state)
// so a user who dismisses the card without subscribing isn't pestered.

const DISMISS_KEY = 'dp-whatsapp-optin-dismissed';

type FlowState = 'idle' | 'pending' | 'active' | 'loading';

interface SubscriptionInfo {
  id: string;
  phone_e164: string;
  locale: string;
  send_time_local: string;
  send_at_sunrise: boolean;
  verified_at: string | null;
}

const SEND_TIME_OPTIONS = [
  { value: 'sunrise',   label_en: 'At sunrise',         label_hi: 'सूर्योदय पर' },
  { value: '06:00:00',  label_en: 'Early morning (6 AM)', label_hi: 'सुबह 6 बजे' },
  { value: '08:00:00',  label_en: 'Morning (8 AM)',     label_hi: 'सुबह 8 बजे' },
  { value: '18:00:00',  label_en: 'Evening (6 PM)',     label_hi: 'शाम 6 बजे' },
] as const;

export default function WhatsAppOptInCard({ locale }: { locale: Locale }) {
  const { user, initialized } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<FlowState>('loading');
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [phone, setPhone] = useState('+91');
  const [sendTime, setSendTime] = useState<string>('sunrise');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Fetch initial state (does the user have a subscription already?)
  const refreshState = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase
      .from('user_whatsapp_subscriptions')
      .select('id, phone_e164, locale, send_time_local, send_at_sunrise, verified_at, verification_expires_at')
      .eq('user_id', user.id)
      .is('opted_out_at', null)
      .maybeSingle();
    if (!data) {
      setSub(null);
      setState('idle');
      return;
    }
    setSub({
      id: data.id,
      phone_e164: data.phone_e164,
      locale: data.locale,
      send_time_local: data.send_time_local,
      send_at_sunrise: data.send_at_sunrise,
      verified_at: data.verified_at,
    });
    setState(data.verified_at ? 'active' : 'pending');
  }, [user]);

  useEffect(() => {
    if (!initialized || !user) {
      setState('loading');
      return;
    }
    // Phase 5 closed-beta gate. Check eligibility before doing anything;
    // non-beta users see nothing at all (no card, no banner, no error).
    // Defense-in-depth — /api/whatsapp/optin also enforces server-side.
    (async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
        if (!session) return;
        const res = await fetch('/api/whatsapp/eligibility', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const j = await res.json().catch(() => ({ eligible: false }));
        if (!j.eligible) return; // Stays invisible

        try {
          if (localStorage.getItem(DISMISS_KEY)) {
            // Previously dismissed: still load to show active state if
            // they DID subscribe before dismissing (so they can manage)
            await refreshState();
            setVisible(true);
            return;
          }
        } catch { /* localStorage blocked; fall through */ }

        setVisible(true);
        await refreshState();
      } catch (err) {
        console.error('[WhatsAppOptInCard] eligibility check failed:', err);
        // Fail closed: don't show the card on transient errors
      }
    })();
  }, [initialized, user, refreshState]);

  if (!visible || state === 'loading') return null;
  // If user opted out / never subscribed AND dismissed, hide
  if (state === 'idle') {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return null;
    } catch { /* ignore */ }
  }

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setVisible(false);
  };

  // ─── API helpers ────────────────────────────────────────────────────────
  async function callApi(path: string, init: RequestInit): Promise<Response> {
    const supabase = getSupabase();
    const { data: { session } } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
    if (!session) throw new Error('Not signed in');
    return fetch(path, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async function submitOptin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const send_at_sunrise = sendTime === 'sunrise';
      const body = {
        phone_e164: phone.trim(),
        locale,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        send_time_local: send_at_sunrise ? '06:00:00' : sendTime,
        send_at_sunrise,
      };
      const res = await callApi('/api/whatsapp/optin', { method: 'POST', body: JSON.stringify(body) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Opt-in failed');
      setInfo(L('otp_sent'));
      await refreshState();
      // Auto-focus OTP input (handled by autoFocus in the rendered input)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function submitVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await callApi('/api/whatsapp/verify', {
        method: 'POST',
        body: JSON.stringify({ code: otp.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? 'Verification failed');
      setInfo(L('verified'));
      setOtp('');
      await refreshState();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function submitOptout() {
    if (!confirm(L('confirm_optout'))) return;
    setBusy(true);
    setError(null);
    try {
      const res = await callApi('/api/whatsapp/optout', { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'Opt-out failed');
      }
      setSub(null);
      setState('idle');
      setInfo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  function L(k: keyof typeof TEXT.en): string {
    return pickByScript(TEXT.en[k], TEXT.hi[k], locale);
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 via-bg-secondary/40 to-bg-primary p-5">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute top-3 right-3 p-1 text-text-secondary hover:text-gold-light transition-colors"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <MessageCircle className="text-emerald-400 w-6 h-6 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-gold-light font-semibold text-sm">{L('title')}</h3>
          <p className="text-text-secondary text-xs">{L('subtitle')}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}
      {info && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg px-3 py-2 mb-3">
          {info}
        </div>
      )}

      {state === 'idle' && (
        <form onSubmit={submitOptin} className="space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919876543210"
            required
            pattern="\+[1-9][0-9]{6,14}"
            className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary/50"
          />
          <select
            value={sendTime}
            onChange={(e) => setSendTime(e.target.value)}
            className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-sm text-text-primary"
          >
            {SEND_TIME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {locale === 'en' ? o.label_en : o.label_hi}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {L('enable')}
          </button>
        </form>
      )}

      {state === 'pending' && sub && (
        <form onSubmit={submitVerify} className="space-y-3">
          <p className="text-text-secondary text-xs">
            {L('otp_prompt').replace('{phone}', sub.phone_e164)}
          </p>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            required
            pattern="\d{6}"
            autoFocus
            className="w-full bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-center text-lg font-mono text-text-primary tracking-widest"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setState('idle'); setOtp(''); setSub(null); }}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-gold-light"
            >
              <ArrowLeft size={12} />
              {L('change_phone')}
            </button>
            <button
              type="submit"
              disabled={busy || otp.length !== 6}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {L('verify')}
            </button>
          </div>
        </form>
      )}

      {state === 'active' && sub && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 text-sm">
            <Check size={16} />
            <span>{L('active').replace('{phone}', sub.phone_e164)}</span>
          </div>
          <p className="text-text-secondary text-xs">
            {sub.send_at_sunrise
              ? L('sched_sunrise')
              : L('sched_fixed').replace('{time}', sub.send_time_local.slice(0, 5))}
          </p>
          <button
            type="button"
            onClick={submitOptout}
            disabled={busy}
            className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {busy ? '…' : L('optout')}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── i18n labels — en + hi for v1, others fall back to en ────────────────
const TEXT = {
  en: {
    title: 'Daily panchang on WhatsApp',
    subtitle: 'Free — tithi, nakshatra, sunrise. Reply STOP anytime.',
    enable: 'Enable',
    otp_prompt: 'We sent a 6-digit code to {phone}. Enter it below:',
    otp_sent: 'OTP sent. Check your WhatsApp.',
    verified: 'Subscribed! Your first message arrives tomorrow.',
    verify: 'Verify',
    change_phone: 'Change number',
    active: 'Active on {phone}',
    sched_sunrise: 'Sent at sunrise each day.',
    sched_fixed: 'Sent daily at {time} local time.',
    optout: 'Unsubscribe',
    confirm_optout: 'Stop daily WhatsApp panchang?',
  },
  hi: {
    title: 'WhatsApp पर दैनिक पंचांग',
    subtitle: 'मुफ्त — तिथि, नक्षत्र, सूर्योदय। कभी भी STOP लिखकर बंद करें।',
    enable: 'चालू करें',
    otp_prompt: 'हमने {phone} पर 6-अंकीय कोड भेजा है। नीचे दर्ज करें:',
    otp_sent: 'OTP भेजा गया। WhatsApp देखें।',
    verified: 'सक्रिय! पहला संदेश कल मिलेगा।',
    verify: 'सत्यापित करें',
    change_phone: 'नंबर बदलें',
    active: '{phone} पर सक्रिय',
    sched_sunrise: 'प्रतिदिन सूर्योदय पर भेजा जाता है।',
    sched_fixed: 'प्रतिदिन {time} स्थानीय समय पर भेजा जाता है।',
    optout: 'सदस्यता समाप्त करें',
    confirm_optout: 'दैनिक WhatsApp पंचांग बंद करें?',
  },
};
