/**
 * /for-pandits — public marketing landing for the Pandit CRM.
 *
 * SSR-renderable (no auth, no client-side data dependencies) so it's
 * crawlable + fast. Locale-aware. All CTAs route to /settings#workspace
 * (the persona toggle from Pandit CRM P1). Signed-out visitors hit the
 * existing /settings auth gate which surfaces the AuthModal; once signed
 * in they're returned to /settings and can flip account_type → 'pandit'.
 *
 * Pandit CRM — marketing.
 */

import type { Metadata } from 'next';
import { Link } from '@/lib/i18n/navigation';
import { FREE_TIER_UNLINKED_CAP } from '@/lib/pandit/subscription';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = 'Pandit CRM — manage your practice on Dekho Panchang';
  const description =
    'Free for 5 clients. Branded PDFs, dasha alerts, calendar, family charts. Built for jyotishis who want to focus on the consultation, not the spreadsheet.';
  return {
    title,
    description,
    openGraph: { title, description, locale },
    alternates: { canonical: `/${locale}/for-pandits` },
  };
}

const FEATURES = [
  {
    title: 'Full chart engine',
    description:
      'North + South Indian charts, Vimshottari + Yogini dashas, 24 sphutas, 16 vargas, shadbala, KP — generated from birth details in seconds. No external API.',
  },
  {
    title: 'Branded PDFs in 9 languages',
    description:
      'Your letterhead, your signature, your contact. Send a kundali, tippanni, or muhurta pick in English, हिंदी, தமிழ், বাংলা, मराठी, ગુજરાતી, ಕನ್ನಡ, తెలుగు, or मैथिली.',
  },
  {
    title: 'Alerts before events',
    description:
      'Dasha sandhi, sade sati phases, birthdays, follow-up dates — surfaced 7–14 days ahead. Daily cron watches your whole roster so you never miss a transition.',
  },
  {
    title: 'Family charts + synthesis',
    description:
      'Add spouse, children, parents. See compatibility, shared dasha periods, family-level patterns. Holistic view at a single client opens a richer reading.',
  },
  {
    title: 'Linked clients on the platform',
    description:
      'Invite a client by email — they sign up and your tippanni/charts push straight to their Dekho Panchang dashboard. They keep what you send; you keep the relationship.',
  },
  {
    title: 'GDPR-ready exports',
    description:
      'One-click JSON bundle per client — full birth data, family, consultations, deliverables, alerts. Hand to a client on request, or back up your practice.',
  },
];

// All CTAs route to /settings#workspace (the persona toggle, P1 spec).
// Signed-out users hit the existing /settings auth gate which surfaces
// the AuthModal; once signed in they're returned to /settings and can
// flip account_type → 'pandit' from the Workspace section.
const CTA_HREF = '/settings#workspace';

const PRICING = [
  {
    name: 'Free',
    price: '₹0',
    cadence: 'forever',
    features: [
      `Up to ${FREE_TIER_UNLINKED_CAP} unlinked clients`,
      'Unlimited LINKED clients (no count against cap)',
      'Full chart engine + tippanni',
      'Branded PDF letterhead',
      'All 9 locales',
    ],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    priceInr: '₹999',
    cadence: 'per month',
    features: [
      'Everything in Free',
      'Unlimited clients (no 5-client cap)',
      'Birthday + dasha + sade sati alerts',
      'Daily cron watches your roster',
      'Priority support',
    ],
    cta: 'Upgrade after 5 clients',
    highlighted: true,
  },
  {
    name: 'Unlimited',
    price: '$29.99',
    priceInr: '₹2,999',
    cadence: 'per month',
    features: [
      'Everything in Pro',
      'Founding pandit recognition',
      'Priority feature requests',
      'Lifetime grandfathered pricing on future features (white-label, API, team seats)',
    ],
    cta: 'Support the project',
    highlighted: false,
  },
];

const FAQ = [
  {
    q: 'What is an "unlinked" vs "linked" client?',
    a: 'A client you add by birth details alone is unlinked — they don\'t have a Dekho Panchang account yet. If you invite them by email and they accept, they become linked — your tippanni and charts push to their dashboard. Linked clients don\'t count against the free-tier 5-client cap. So inviting clients onto the platform actually unlocks more roster slots.',
  },
  {
    q: 'Do you charge per client?',
    a: 'No. Pro is flat-rate for unlimited clients. The 5-client cap only applies to the free tier and only to unlinked clients. Once you have 5 unlinked, the next one either needs to be linked (invite them) or you upgrade to Pro.',
  },
  {
    q: 'Is this real Jyotish or just templates?',
    a: 'Real. Local Meeus computation, Lahiri ayanamsha default (configurable), BPHS-aligned yogas and shadbala, 16 varga charts, Vimshottari dashas to L5. No external astrology API. Verified within 1–2 minutes of Prokerala / Shubh Panchang on standard tithis and planetary positions.',
  },
  {
    q: 'Can my clients see what I send them?',
    a: 'Only if they\'re linked. Pushed deliverables show up in their Dekho Panchang dashboard with a "From your Pandit" badge. They can view, ack, or download. You see when they first opened it.',
  },
  {
    q: 'What about pandit_notes — are those private?',
    a: 'Yes. pandit_notes are pandit-only. The seeker never sees them, even when linked. The platform separates "what the client gets" (deliverables with visibility=client_pushed) from "what stays in your CRM" (everything else).',
  },
  {
    q: 'Can I export everything if I leave?',
    a: 'Yes. Per-client GDPR export gives you a JSON bundle of all data. Your practice, your records.',
  },
];

export default async function ForPanditsPage(_props: PageProps) {
  // The `Link` import from @/lib/i18n/navigation auto-prefixes the
  // current locale on the href, so the component body doesn't need
  // to read the locale param directly. generateMetadata above still
  // uses it for the canonical URL + openGraph locale field.

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold-primary/15">
        <div className="absolute inset-0 yantra-bg opacity-30" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="mb-4">
            <span
              className="inline-block text-3xl"
              style={{ fontFamily: 'var(--font-devanagari-heading)', color: '#f0d48a' }}
            >
              ॐ
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-light mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Run your practice.<br />We handle the math.
          </h1>
          <p
            className="text-[color:var(--color-text-devanagari)] text-lg mb-3"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            आपकी ज्योतिष-यात्रा यहीं से प्रारम्भ होती है।
          </p>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed text-base sm:text-lg">
            A CRM built for jyotishis. Add clients by birth details. We compute the charts, track the dashas, alert you before transitions. You focus on the consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={CTA_HREF}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary font-semibold text-base shadow-lg shadow-gold-primary/30 hover:from-gold-light hover:shadow-xl hover:shadow-gold-primary/40 transition-all"
            >
              Start free — {FREE_TIER_UNLINKED_CAP} clients on us
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-base text-text-secondary hover:text-gold-light transition"
            >
              See pricing →
            </Link>
          </div>
          <p className="text-[12px] text-text-tertiary mt-6">
            Already a member?{' '}
            <Link href="/dashboard" className="text-gold-primary hover:text-gold-light transition">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-light text-center mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          What you get
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
          Everything you&apos;d build yourself in spreadsheets and PDFs — except correct, multilingual, and synced to your clients in real time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-6 hover:border-gold-primary/40 transition"
            >
              <h3
                className="text-base font-bold text-gold-light mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {f.title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gold-primary/15 bg-bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2
            className="text-2xl sm:text-3xl font-bold text-gold-light text-center mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pricing
          </h2>
          <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
            Pandits in India: prices shown in ₹ below. Everyone else: USD. Toggle inside the dashboard once you sign in.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-gold-primary/40 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] shadow-lg shadow-gold-primary/15'
                    : 'border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27]'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-[10px] uppercase tracking-wider text-gold-primary font-bold mb-2">
                    Most popular
                  </div>
                )}
                <h3
                  className="text-lg font-bold text-gold-light mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-gold-light">{tier.price}</span>
                    <span className="text-[12px] text-text-secondary">{tier.cadence}</span>
                  </div>
                  {tier.priceInr && (
                    <div className="text-[12px] text-text-tertiary mt-0.5">
                      or {tier.priceInr} / month (India)
                    </div>
                  )}
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="text-[12px] text-text-secondary flex gap-2">
                      <span className="text-gold-primary flex-none">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={CTA_HREF}
                  className={`w-full text-center rounded-xl py-2.5 text-[13px] font-semibold transition ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-gold-primary to-gold-light text-bg-primary hover:opacity-90'
                      : 'border border-gold-primary/30 text-gold-light hover:border-gold-primary/60'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-tertiary text-center mt-8">
            Cancel anytime via Stripe billing portal. Linked clients always stay linked even if you downgrade.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-light text-center mb-12"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Questions
        </h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-gold-primary/10 pb-6 last:border-b-0">
              <h3 className="text-base font-bold text-gold-light mb-2">{item.q}</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gold-primary/15 bg-bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold text-gold-light mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your first 5 clients are on us
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            No card. No setup. Add a client, see the chart, decide.
          </p>
          <Link
            href={CTA_HREF}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark text-bg-primary font-semibold text-base shadow-lg shadow-gold-primary/30 hover:from-gold-light transition-all"
          >
            Start free
          </Link>
        </div>
      </section>
    </div>
  );
}
