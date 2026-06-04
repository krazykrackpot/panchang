/**
 * Tippanni viewer + editor — the centerpiece.
 * Spec §18.5.
 *
 * The Pandit's actual product: their voice + the engine's analysis.
 * Letterhead preview, section toggles, inline rich text, push button as
 * moment-of-action.
 */

import Link from 'next/link';
import {
  MOCK_PANDIT,
  MOCK_TIPPANNI_SECTIONS,
  getClientById,
} from '@/lib/pandit/mock-fixtures';

export default function TippanniEditor() {
  const client = getClientById('client-001')!; // Mrs Sharma

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/en/dashboard-preview/pandit/clients/${client.id}`}
          className="text-[12px] text-text-secondary hover:text-gold-light transition mb-2 inline-block"
        >
          ← {client.full_name}'s deliverables
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mt-1">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-gold-light"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Tippanni · Annual reading 2026-27
            </h1>
            <p className="text-[12px] text-text-secondary mt-1">
              Draft auto-generated 4 minutes ago · for{' '}
              <span className="text-text-primary">{client.full_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LocaleSelect />
            <button
              className="
                text-[12px] px-3 py-1.5 rounded-lg text-text-secondary
                border border-gold-primary/15 hover:border-gold-primary/30 hover:text-text-primary transition
              "
            >
              Regenerate
            </button>
            <button
              className="
                text-[12px] px-3 py-1.5 rounded-lg text-gold-light
                bg-gold-primary/15 border border-gold-primary/30 hover:bg-gold-primary/25 transition
              "
            >
              Author mode
            </button>
          </div>
        </div>
      </div>

      {/* The reading itself — letterhead + sections */}
      <article
        className="
          rounded-2xl bg-gradient-to-br from-[#1a1f4e]/30 via-[#111638]/50 to-[#0a0e27]
          border border-gold-primary/15
          p-6 sm:p-8 mb-6
        "
      >
        {/* Letterhead preview */}
        <header className="border-b border-gold-primary/15 pb-6 mb-8 flex items-start gap-4">
          <div
            className="flex-none w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-3xl"
            style={{
              backgroundColor: MOCK_PANDIT.accent_color,
              fontFamily: 'var(--font-devanagari-heading)',
            }}
          >
            {MOCK_PANDIT.logo_initial}
          </div>
          <div className="flex-1">
            <h2
              className="text-2xl font-bold text-gold-light uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {MOCK_PANDIT.full_name_en}
            </h2>
            <p
              className="text-[13px] text-[color:var(--color-text-devanagari)] mt-0.5"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {MOCK_PANDIT.full_name_hi}
            </p>
            <p className="text-[12px] text-text-secondary mt-1">
              {MOCK_PANDIT.letterhead_subtitle}
            </p>
          </div>
          <div className="text-right text-[11px] text-text-tertiary">
            aditya@dekhopanchang.com
            <br />+91 98201 12345
          </div>
        </header>

        {/* Salutation in Devanagari */}
        <p
          className="text-lg text-[color:var(--color-text-devanagari)] mb-6"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          श्रीमती शर्मा जी,
        </p>

        {/* Sections */}
        <div className="space-y-6">
          {MOCK_TIPPANNI_SECTIONS.map((sec, i) => (
            <TippanniSectionView key={sec.id} section={sec} index={i + 1} />
          ))}
        </div>

        {/* Add custom section */}
        <button className="mt-6 w-full text-left p-4 rounded-lg border border-dashed border-gold-primary/20 hover:border-gold-primary/40 hover:bg-gold-primary/5 text-text-tertiary hover:text-gold-light text-[13px] transition">
          + Add custom section
        </button>

        {/* Signature */}
        <footer className="mt-12 pt-8 border-t border-gold-primary/15">
          <p className="text-[12px] text-text-secondary mb-1">With reverence,</p>
          <div
            className="text-xl text-gold-light mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pandit Aditya Kumar Jha
          </div>
          <div className="w-32 h-px bg-gold-primary/30" />
          <p className="text-[11px] text-text-tertiary mt-1">Signature</p>
        </footer>
      </article>

      {/* Delivery panel */}
      <div
        className="
          rounded-2xl bg-gradient-to-br
          from-[color:var(--color-pandit-violet)]/20 to-[color:var(--color-pandit-violet)]/8
          border border-[color:var(--color-pandit-violet-light)]/30
          p-5 sm:p-6
        "
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3
              className="text-base font-bold text-white mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to deliver to {client.full_name}?
            </h3>
            <p className="text-[12px] text-text-secondary">
              Mrs. Sharma will see this in her dashboard immediately. She'll also get an email if she's opted
              in to Pandit notifications.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-2 rounded-lg text-[12px] text-text-secondary border border-gold-primary/15 hover:border-gold-primary/30 hover:text-text-primary transition">
              Save draft
            </button>
            <button className="px-4 py-2 rounded-lg text-[12px] text-gold-light bg-gold-primary/15 border border-gold-primary/30 hover:bg-gold-primary/25 transition">
              Download PDF
            </button>
            <button
              className="
                px-5 py-2.5 rounded-lg text-sm font-semibold
                bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary
                shadow-md shadow-gold-primary/30
                hover:from-gold-light hover:shadow-lg hover:shadow-gold-primary/40
                transition-all
              "
            >
              ▮ Push to Mrs. Sharma's dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TippanniSectionView({
  section,
  index,
}: {
  section: typeof MOCK_TIPPANNI_SECTIONS[number];
  index: number;
}) {
  return (
    <section
      className={`
        rounded-lg p-5 transition
        ${section.enabled ? 'border border-gold-primary/12 bg-bg-primary/30' : 'border border-dashed border-gold-primary/8 bg-bg-primary/10 opacity-60'}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[11px] text-text-tertiary font-medium tabular-nums">
            §{index}
          </span>
          <div>
            <h3
              className="font-bold text-gold-light text-base"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {section.title_en}
            </h3>
            <p
              className="text-[12px] text-[color:var(--color-text-devanagari)] mt-0.5"
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            >
              {section.title_hi}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={section.enabled}
            className="w-4 h-4 accent-gold-primary"
          />
          <span className="text-[11px] text-text-secondary">Include</span>
        </label>
      </div>

      {section.enabled && (
        <div className="space-y-3">
          <p
            className="text-[15px] text-[color:var(--color-text-pandit-author)] leading-relaxed"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            {section.body_hi}
          </p>
          <p className="text-[14px] text-text-primary leading-relaxed italic">
            {section.body_en}
          </p>
          {section.citation && (
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider mt-2">
              Classical reference: <span className="text-gold-primary">{section.citation}</span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function LocaleSelect() {
  return (
    <select
      className="
        text-[12px] px-3 py-1.5 rounded-lg text-text-primary cursor-pointer
        bg-bg-secondary border border-gold-primary/15 hover:border-gold-primary/30 transition
      "
      defaultValue="hi"
    >
      <option value="hi">हिन्दी · Hindi</option>
      <option value="en">English</option>
      <option value="mr">मराठी · Marathi</option>
      <option value="bn">বাংলা · Bengali</option>
      <option value="ta">தமிழ் · Tamil</option>
    </select>
  );
}
