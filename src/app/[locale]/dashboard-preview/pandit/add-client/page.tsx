'use client';

/**
 * Add Client modal preview — "sacred act" framing with live chart preview.
 * Spec §18.8.
 *
 * Two required fields. Live chart preview on the left fills in as Pandit
 * types — they feel the engine immediately.
 */

import { useState } from 'react';
import Link from 'next/link';

export default function AddClientPreview() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [estimated, setEstimated] = useState(false);
  const [place, setPlace] = useState('');
  const [email, setEmail] = useState('');

  const hasName = name.trim().length > 0;
  const hasDate = date.length === 10;
  const hasPlace = place.trim().length > 0;
  const chartReady = hasName && hasDate && hasPlace;
  const planetsVisible = hasDate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/en/dashboard-preview/pandit/clients"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live chart preview */}
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
              {estimated && (
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-link-paused)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-link-paused)]" />
                  approximate
                </span>
              )}
            </div>

            <div
              className={`
                aspect-square relative rounded-lg border transition-all
                ${estimated ? 'border-[color:var(--color-link-paused)]/40 bg-[color:var(--color-link-paused)]/5' : 'border-gold-primary/15 bg-bg-primary/30'}
              `}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-2">
                <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
                <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="rgba(212,168,83,0.4)" strokeWidth="0.5" />
                {planetsVisible && (
                  <>
                    <text x="50" y="20" textAnchor="middle" fill="#f0d48a" fontSize="6" fontFamily="sans-serif" className="planet-entrance">
                      Tula
                    </text>
                    <text x="32" y="50" textAnchor="middle" fill="#e74c3c" fontSize="4" className="planet-entrance">Ma</text>
                    <text x="50" y="50" textAnchor="middle" fill="#ecf0f1" fontSize="4" className="planet-entrance">Mo</text>
                    <text x="68" y="50" textAnchor="middle" fill="#f39c12" fontSize="4" className="planet-entrance">Ju</text>
                    <text x="50" y="80" textAnchor="middle" fill="#e67e22" fontSize="4" className="planet-entrance">Su</text>
                  </>
                )}
              </svg>
              {!hasDate && (
                <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-[11px] text-center px-4">
                  Enter birth date to begin charting
                </div>
              )}
            </div>

            {chartReady && (
              <div className="mt-4 space-y-2 text-[12px]">
                <p className="text-text-secondary">
                  Lagna: <span className="text-gold-light font-medium">Tula 5°10'</span>
                </p>
                <p className="text-text-secondary">
                  Janma rashi:{' '}
                  <span className="text-[color:var(--color-text-devanagari)]" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                    तुला
                  </span>{' '}
                  <span className="text-text-primary tabular-nums">5°10'</span>
                </p>
                <p className="text-text-secondary">
                  Nakshatra: <span className="text-text-primary">Svati</span>
                </p>
              </div>
            )}

            {!chartReady && hasDate && (
              <p className="mt-4 text-[11px] text-text-tertiary">
                Add place of birth to compute lagna and full chart.
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="space-y-5">
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
                      checked={estimated}
                      onChange={(e) => setEstimated(e.target.checked)}
                      className="w-3.5 h-3.5 accent-gold-primary"
                    />
                    Birth time is approximate
                  </label>
                </div>
              </Field>
            </div>

            <Field label="Place of birth" required>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Type city, e.g. Mumbai…"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-bg-secondary/40 border border-gold-primary/15
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:border-gold-primary/40 transition
                "
              />
            </Field>

            {/* Optional */}
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
                    placeholder="e.g., client@example.com"
                    className="
                      w-full px-4 py-2.5 rounded-lg
                      bg-bg-secondary/40 border border-gold-primary/15
                      text-text-primary placeholder:text-text-tertiary
                      focus:outline-none focus:border-gold-primary/40 transition
                    "
                  />
                  {email && (
                    <p className="text-[12px] text-[color:var(--color-state-active)]">
                      ✓ You can invite them after adding to start sharing readings directly.
                    </p>
                  )}
                  {!email && (
                    <p className="text-[11px] text-text-tertiary">
                      Want to share readings to their phone later? Add email now.
                    </p>
                  )}
                </div>
              </Field>

              <Field label="Tags">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="
                      px-2.5 py-1 rounded-full text-[11px]
                      text-text-tertiary border border-dashed border-gold-primary/20
                      hover:border-gold-primary/40 hover:text-text-secondary transition
                    "
                  >
                    + Add tag
                  </button>
                </div>
              </Field>

              <Field label="Private notes">
                <textarea
                  rows={3}
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

            {/* Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-text-tertiary">
                {chartReady ? '✓ Ready to save' : 'Three fields required to add this client'}
              </p>
              <div className="flex gap-2">
                <Link
                  href="/en/dashboard-preview/pandit/clients"
                  className="px-4 py-2.5 rounded-lg text-[12px] text-text-secondary hover:text-text-primary transition"
                >
                  Cancel
                </Link>
                <button
                  disabled={!chartReady}
                  className={`
                    px-5 py-2.5 rounded-lg text-sm font-semibold transition
                    ${chartReady ? 'bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary hover:from-gold-light shadow-md shadow-gold-primary/30' : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'}
                  `}
                >
                  Add client
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
