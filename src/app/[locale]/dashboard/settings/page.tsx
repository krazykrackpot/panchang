'use client';

/**
 * /dashboard/settings — Pandit-only settings page.
 *
 * Letterhead (name, subtitle, address, logo URL, signature URL, contact
 * email/phone) + alert preferences (email enabled, lookahead days,
 * past_threshold_months, weekly digest enabled, digest day) +
 * default report locale.
 *
 * Pandit CRM P9.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { PanditSettings } from '@/lib/pandit/types';

const LOCALES: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी · Hindi' },
  { code: 'mr', label: 'मराठी · Marathi' },
  { code: 'mai', label: 'मैथिली · Maithili' },
  { code: 'gu', label: 'ગુજરાતી · Gujarati' },
  { code: 'bn', label: 'বাংলা · Bengali' },
  { code: 'ta', label: 'தமிழ் · Tamil' },
  { code: 'te', label: 'తెలుగు · Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ · Kannada' },
];

const DIGEST_DAYS: PanditSettings['digest_day'][] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export default function PanditSettingsPage() {
  const { user, initialized } = useAuthStore();
  const [settings, setSettings] = useState<PanditSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state mirrors the loaded settings; saves call PATCH with the
  // fields the user actually touched. For simplicity, every save sends
  // the full current state.
  const [letterheadName, setLetterheadName] = useState('');
  const [letterheadSubtitle, setLetterheadSubtitle] = useState('');
  const [letterheadAddress, setLetterheadAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [defaultReportLocale, setDefaultReportLocale] = useState('en');
  const [alertEmailEnabled, setAlertEmailEnabled] = useState(true);
  const [alertLookaheadDays, setAlertLookaheadDays] = useState('14');
  const [pastThresholdMonths, setPastThresholdMonths] = useState('12');
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(true);
  const [digestDay, setDigestDay] = useState<PanditSettings['digest_day']>('monday');

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Auth not configured');
        setLoading(false);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError('No session');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/pandit/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error || 'Failed to load');
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { settings: PanditSettings; is_default: boolean };
      setSettings(body.settings);
      // Pre-fill form
      setLetterheadName(body.settings.letterhead_name ?? '');
      setLetterheadSubtitle(body.settings.letterhead_subtitle ?? '');
      setLetterheadAddress(body.settings.letterhead_address ?? '');
      setLogoUrl(body.settings.logo_url ?? '');
      setSignatureUrl(body.settings.signature_url ?? '');
      setContactEmail(body.settings.contact_email ?? '');
      setContactPhone(body.settings.contact_phone ?? '');
      setDefaultReportLocale(body.settings.default_report_locale ?? 'en');
      setAlertEmailEnabled(body.settings.alert_email_enabled ?? true);
      setAlertLookaheadDays(String(body.settings.alert_lookahead_days ?? 14));
      setPastThresholdMonths(String(body.settings.past_threshold_months ?? 12));
      setWeeklyDigestEnabled(body.settings.weekly_digest_enabled ?? true);
      setDigestDay(body.settings.digest_day ?? 'monday');
      setLoading(false);
    } catch (e) {
      console.error('[PanditSettingsPage] uncaught:', e);
      setError('Could not reach the server.');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized) load();
  }, [load, initialized]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error('No session');

      const lookaheadN = Number(alertLookaheadDays);
      const pastN = Number(pastThresholdMonths);
      if (!Number.isInteger(lookaheadN) || lookaheadN < 1 || lookaheadN > 90) {
        throw new Error('Alert lookahead must be 1-90 days');
      }
      if (!Number.isInteger(pastN) || pastN < 1 || pastN > 60) {
        throw new Error('Past threshold must be 1-60 months');
      }

      const res = await fetch('/api/pandit/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          letterhead_name: letterheadName,
          letterhead_subtitle: letterheadSubtitle,
          letterhead_address: letterheadAddress,
          logo_url: logoUrl,
          signature_url: signatureUrl,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          default_report_locale: defaultReportLocale,
          alert_email_enabled: alertEmailEnabled,
          alert_lookahead_days: lookaheadN,
          past_threshold_months: pastN,
          weekly_digest_enabled: weeklyDigestEnabled,
          digest_day: digestDay,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(body.message || body.error || `HTTP ${res.status}`);
      }
      const body = (await res.json()) as { settings: PanditSettings };
      setSettings(body.settings);
      setSuccessMsg('Settings saved');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      console.error('[PanditSettingsPage] save failed:', e);
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-48 bg-bg-secondary/50 rounded" />
          <div className="h-48 bg-bg-secondary/30 rounded-2xl" />
          <div className="h-32 bg-bg-secondary/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-[12px] text-text-secondary hover:text-gold-light transition mb-2 inline-block"
        >
          ← Dashboard
        </Link>
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Pandit settings
        </h1>
        <p className="text-[13px] text-text-secondary mt-1">
          Your letterhead, alert preferences, default report locale.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)] mb-4">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg border border-[color:var(--color-state-active)]/30 bg-[color:var(--color-state-active)]/10 p-3 text-[13px] text-[color:var(--color-state-active)] mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Letterhead */}
        <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
          <h2
            className="text-base font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Letterhead
          </h2>
          <p className="text-[12px] text-text-secondary mb-4">
            Appears on the cover page of every branded PDF you generate
            for a client.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name" required>
              <input
                type="text"
                value={letterheadName}
                onChange={(e) => setLetterheadName(e.target.value)}
                placeholder="e.g., Pandit Aditya Kumar Jha"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Subtitle">
              <input
                type="text"
                value={letterheadSubtitle}
                onChange={(e) => setLetterheadSubtitle(e.target.value)}
                placeholder="e.g., Jyotish Acharya · Mumbai"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Address">
              <input
                type="text"
                value={letterheadAddress}
                onChange={(e) => setLetterheadAddress(e.target.value)}
                placeholder="e.g., 21 Sahakar Nagar, Mumbai 400049"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Contact email">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="aditya@dekhopanchang.com"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Contact phone">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98201 12345"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Logo URL (optional)">
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…/logo.png"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Signature URL (optional)">
              <input
                type="url"
                value={signatureUrl}
                onChange={(e) => setSignatureUrl(e.target.value)}
                placeholder="https://…/signature.png"
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Default report locale">
              <select
                value={defaultReportLocale}
                onChange={(e) => setDefaultReportLocale(e.target.value)}
                className="w-full px-3 py-2 rounded-lg cursor-pointer bg-bg-secondary/40 border border-gold-primary/15 text-text-primary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              >
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* Alerts */}
        <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
          <h2
            className="text-base font-bold text-gold-light mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Alerts
          </h2>
          <p className="text-[12px] text-text-secondary mb-4">
            How far ahead the alerts engine looks for dasha and transit events.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Lookahead window (days)">
              <input
                type="number"
                min={1}
                max={90}
                value={alertLookaheadDays}
                onChange={(e) => setAlertLookaheadDays(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
            <Field label="Past threshold (months without consultation)">
              <input
                type="number"
                min={1}
                max={60}
                value={pastThresholdMonths}
                onChange={(e) => setPastThresholdMonths(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary/40 border border-gold-primary/15 text-text-primary focus:outline-none focus:border-gold-primary/40 transition text-sm"
              />
            </Field>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-[13px] text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={alertEmailEnabled}
                onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                className="w-4 h-4 accent-gold-primary"
              />
              Email me when a critical alert fires
            </label>
            <label className="flex items-center gap-2 text-[13px] text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigestEnabled}
                onChange={(e) => setWeeklyDigestEnabled(e.target.checked)}
                className="w-4 h-4 accent-gold-primary"
              />
              Send me a weekly digest of notable alerts
            </label>
            {weeklyDigestEnabled && (
              <div className="ml-6 mt-1">
                <Field label="Digest day">
                  <select
                    value={digestDay}
                    onChange={(e) => setDigestDay(e.target.value as PanditSettings['digest_day'])}
                    className="px-3 py-1.5 rounded-lg cursor-pointer bg-bg-secondary/40 border border-gold-primary/15 text-text-primary focus:outline-none focus:border-gold-primary/40 transition text-sm capitalize"
                  >
                    {DIGEST_DAYS.map((d) => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`
              px-6 py-2.5 rounded-lg text-sm font-semibold transition
              ${saving ? 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
                : 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary shadow-md shadow-gold-primary/30 hover:from-gold-light hover:shadow-lg hover:shadow-gold-primary/40'}
            `}
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>

      {/* Footer hint */}
      {settings?.created_at && (
        <p className="mt-6 text-[11px] text-text-tertiary text-center">
          Settings last updated{' '}
          {settings.updated_at && new Date(settings.updated_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] text-text-secondary mb-1.5">
        {label}
        {required && <span className="text-[color:var(--color-alert-critical)] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
