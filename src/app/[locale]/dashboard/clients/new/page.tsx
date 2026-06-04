'use client';

/**
 * Add Client form — /dashboard/clients/new.
 *
 * Two required fields (name + birth_date + place). Birth time + email are
 * encouraged but optional. POST to /api/pandit/clients creates the
 * unlinked-mode record. After save, navigate to the client detail.
 *
 * Spec §5.1 (Path B), §18.8 (sacred-act framing).
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { PaywallModal } from '@/components/pandit/PaywallModal';

interface BirthLocation {
  lat: number;
  lng: number;
  name: string;
  timezone: string;
}

export default function AddClientPage() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const localePrefix = `/${params?.locale ?? 'en'}`;
  const { user, initialized } = useAuthStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallUsage, setPaywallUsage] = useState<{ unlinked_count: number; linked_count: number } | undefined>(undefined);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeEstimated, setTimeEstimated] = useState(false);
  const [place, setPlace] = useState('');
  const [location, setLocation] = useState<BirthLocation | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/dashboard');
    }
  }, [initialized, user, router]);

  const hasName = name.trim().length > 0;
  const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const hasPlace = !!location;
  const canSubmit = hasName && hasDate && hasPlace && !saving;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (!user || !location) return;
    setError(null);
    setSaving(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Authentication not available');
        setSaving(false);
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) {
        setError('Your session expired. Please sign in again.');
        setSaving(false);
        return;
      }

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await fetch('/api/pandit/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: name.trim(),
          birth_data: {
            date,
            time: time || undefined,
            place: location.name,
            lat: location.lat,
            lng: location.lng,
            tz: location.timezone,
            time_estimated: !time || timeEstimated,
          },
          contact_email: email.trim() || undefined,
          contact_phone: phone.trim() || undefined,
          tags,
          pandit_notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        if (res.status === 402 && body.error === 'cap_exceeded') {
          // Free-tier cap hit. Fetch the live usage snapshot to seed the
          // paywall modal with exact roster counts (better than guessing).
          try {
            const sub = getSupabase();
            const sess = sub ? (await sub.auth.getSession()).data.session : null;
            const t = sess?.access_token;
            if (t) {
              const u = await fetch('/api/pandit/subscription', {
                headers: { Authorization: `Bearer ${t}` },
              });
              if (u.ok) {
                const ub = await u.json();
                setPaywallUsage({
                  unlinked_count: ub.usage?.unlinked_count ?? 0,
                  linked_count: ub.usage?.linked_count ?? 0,
                });
              }
            }
          } catch (e) {
            console.error('[AddClient] paywall usage fetch failed:', e);
          }
          setPaywallOpen(true);
        } else if (res.status === 409) {
          setError(body.message || 'This client already exists in your roster.');
        } else {
          console.error('[AddClient] POST failed:', body);
          setError(body.message || body.error || 'Could not save. Please retry.');
        }
        setSaving(false);
        return;
      }

      const body = (await res.json()) as { client: { id: string } };
      router.push(`/dashboard/clients/${body.client.id}`);
    } catch (err) {
      console.error('[AddClient] uncaught:', err);
      setError('Could not reach the server. Please retry.');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="text-[12px] text-text-secondary hover:text-gold-light transition mb-2 inline-block"
        >
          ← Roster
        </Link>
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Add a new client
        </h1>
        <p
          className="text-base text-[color:var(--color-text-devanagari)] mt-1"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          नया जजमान जोड़ें
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live chart preview placeholder */}
        <div className="lg:col-span-5">
          <div
            className="
              sticky top-6 rounded-2xl
              bg-gradient-to-br from-[#1a1f4e]/50 via-[#111638]/70 to-[#0a0e27]
              border border-gold-primary/15 p-5
            "
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-base font-bold text-gold-light"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Live chart preview
              </h3>
              {timeEstimated && (
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-link-paused)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-link-paused)]" />
                  approximate
                </span>
              )}
            </div>

            <div
              className={`
                aspect-square relative rounded-lg border transition-all
                ${timeEstimated ? 'border-[color:var(--color-link-paused)]/40 bg-[color:var(--color-link-paused)]/5' : 'border-gold-primary/15 bg-bg-primary/30'}
              `}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-2">
                <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
                <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="rgba(212,168,83,0.4)" strokeWidth="0.5" />
                {hasDate && (
                  <text x="50" y="20" textAnchor="middle" fill="#f0d48a" fontSize="6" className="planet-entrance">
                    {/* Lagna placeholder until P3 wires real engine */}
                    Lagna
                  </text>
                )}
              </svg>
              {!hasDate && (
                <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-[11px] text-center px-4">
                  Enter birth date to begin charting
                </div>
              )}
            </div>

            <p className="mt-4 text-[11px] text-text-tertiary text-center">
              Full chart wires in once we save the client.
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="lg:col-span-7 space-y-5">
          {error && (
            <div className="rounded-xl border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)]">
              {error}
            </div>
          )}

          <Field label="Full name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mrs. Sunita Sharma"
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-bg-secondary/40 border border-gold-primary/15
                text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:border-gold-primary/40 transition
              "
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of birth" required>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:border-gold-primary/40 transition
                "
              />
            </Field>

            <Field label="Time of birth">
              <div className="space-y-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="
                    w-full px-4 py-2.5 rounded-lg
                    bg-bg-secondary/40 border border-gold-primary/15
                    text-text-primary placeholder:text-text-tertiary
                    focus:outline-none focus:border-gold-primary/40 transition
                  "
                />
                <label className="flex items-center gap-2 text-[12px] text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeEstimated}
                    onChange={(e) => setTimeEstimated(e.target.checked)}
                    className="w-3.5 h-3.5 accent-gold-primary"
                  />
                  Birth time is approximate
                </label>
              </div>
            </Field>
          </div>

          <Field label="Place of birth" required>
            <LocationSearch
              value={place}
              onSelect={(loc) => {
                setLocation({
                  lat: loc.lat,
                  lng: loc.lng,
                  name: loc.name,
                  timezone: loc.timezone || 'Asia/Kolkata',
                });
                setPlace(loc.name);
              }}
              placeholder="Type city, e.g. Mumbai…"
            />
            {location && (
              <p className="mt-1.5 text-[11px] text-[color:var(--color-state-active)]">
                ✓ {location.name} · {location.timezone}
              </p>
            )}
          </Field>

          <div className="mt-8 pt-6 border-t border-gold-primary/10">
            <p className="text-[11px] uppercase tracking-wider text-text-tertiary font-semibold mb-4">
              Optional
            </p>

            <Field label="Email">
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="
                    w-full px-4 py-2.5 rounded-lg
                    bg-bg-secondary/40 border border-gold-primary/15
                    text-text-primary placeholder:text-text-tertiary
                    focus:outline-none focus:border-gold-primary/40 transition
                  "
                />
                {email ? (
                  <p className="text-[12px] text-[color:var(--color-state-active)]">
                    ✓ You can invite them to claim their account after saving.
                  </p>
                ) : (
                  <p className="text-[11px] text-text-tertiary">
                    Want to share readings directly to their phone later? Add email now.
                  </p>
                )}
              </div>
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98202 11122"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:border-gold-primary/40 transition
                "
              />
            </Field>

            <Field label="Tags">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="career-focused, monthly, high-priority"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:border-gold-primary/40 transition
                "
              />
              <p className="mt-1 text-[11px] text-text-tertiary">
                Comma-separated. Used to filter your roster.
              </p>
            </Field>

            <Field label="Private notes">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything you want to remember about this client…"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:border-gold-primary/40 transition resize-none
                "
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-text-tertiary">
              {canSubmit ? '✓ Ready to save' : 'Name, date of birth, and place are required'}
            </p>
            <div className="flex gap-2">
              <Link
                href="/dashboard/clients"
                className="px-4 py-2.5 rounded-lg text-[12px] text-text-secondary hover:text-text-primary transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`
                  px-5 py-2.5 rounded-lg text-sm font-semibold transition
                  ${canSubmit ? 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light shadow-md shadow-gold-primary/30' : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'}
                `}
              >
                {saving ? 'Saving…' : 'Add client'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        localePrefix={localePrefix}
        usage={paywallUsage}
      />
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
