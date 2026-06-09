// Server component — runs at request time on the server, giving the layout's
// permanentRedirect() / notFound() priority over rendering. Previously
// 'use client' which short-circuited the server-side redirect (PRs #330,
// #362, #367 all tried to fix from the layout side; all bypassed by this
// page's client-side `if (!yoga) return ...` fallback). 2026-06-02 audit.
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { Star, Shield, AlertTriangle, BookOpen, Gem, Users, ArrowRight, CheckCircle2, XCircle, Sparkles, Clock, Compass, TrendingUp } from 'lucide-react';
import { pickByScript, getBodyFont, getHeadingFont } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
// Use the overlay-merged version so /mai/ pages render real Maithili
// content from yoga-mai-overlay.json. For non-mai locales the data is
// structurally identical to the canonical YOGA_DETAIL_DATA. See
// src/lib/constants/yoga-details-with-overlay.ts.
import { YOGA_DETAIL_DATA_WITH_OVERLAY as YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details-with-overlay';
import MiniChart from '@/components/kundali/MiniChart';
import AuthorByline from '@/components/ui/AuthorByline';

// ─── Yoga-to-image mapping ─────────────────────────────────────────────────
const YOGA_IMAGE_MAP: Record<string, string> = {
  gajakesari: 'gajakesari',
  budhaditya: 'budhaditya',
  kala_sarpa: 'kala_sarpa',
  mangala_dosha: 'mangala_dosha',
  chandra_mangala: 'chandra_mangala',
  kemadruma: 'kemadruma',
  neechabhanga_raja: 'neechabhanga',
  viparita_raja: 'viparita_raja',
  saraswati: 'saraswati',
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  dosha: 'mangala_dosha',
  mahapurusha: 'mahapurusha',
  moon_based: 'kemadruma',
  sun_based: 'budhaditya',
  raja: 'raja_yoga',
  wealth: 'dhana',
  inauspicious: 'viparita_raja',
  other: 'saraswati',
};

function DefaultYogaIcon({ size = 128, auspicious }: { size?: number; auspicious: boolean }) {
  const color = auspicious ? '#4ac870' : '#e87b35';
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dy-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="56" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
      <circle cx="64" cy="64" r="44" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2" />
      <polygon points="64,20 98,82 30,82" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <polygon points="64,108 30,46 98,46" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="64" cy="64" r="16" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="64" cy="64" r="4" fill={color} opacity="0.6" />
      <text x="64" y="120" textAnchor="middle" fill={color} fontSize="11" fontFamily="serif" opacity="0.7">
        {auspicious ? '✦ शुभ ✦' : '⚠ अशुभ ⚠'}
      </text>
    </svg>
  );
}

// ─── Category badges ───────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string; labelHi: string }> = {
  dosha:         { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Dosha', labelHi: 'दोष' },
  mahapurusha:   { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Pancha Mahapurusha', labelHi: 'पञ्च महापुरुष' },
  moon_based:    { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Moon-Based', labelHi: 'चन्द्र आधारित' },
  sun_based:     { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Sun-Based', labelHi: 'सूर्य आधारित' },
  raja:          { bg: 'bg-gold-primary/15', text: 'text-gold-light', label: 'Raja Yoga', labelHi: 'राज योग' },
  wealth:        { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Dhana Yoga', labelHi: 'धन योग' },
  inauspicious:  { bg: 'bg-orange-500/15', text: 'text-orange-400', label: 'Inauspicious', labelHi: 'अशुभ' },
  other:         { bg: 'bg-cyan-500/15', text: 'text-cyan-400', label: 'Special', labelHi: 'विशेष' },
};

export default async function YogaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const yoga = YOGA_DETAIL_DATA[slug];
  // The layout's resolveCanonicalYogaSlug() permanentRedirects hyphen and
  // uppercase variants before we get here. Any slug that reaches this
  // function and still isn't in YOGA_DETAIL_DATA is a real 404.
  if (!yoga) notFound();

  const cat = CATEGORY_STYLES[yoga.category] || CATEGORY_STYLES.other;
  // Per-script font (Devanagari for hi/mr/mai/sa; Tamil/Telugu/Bengali/
  // Kannada/Gujarati for their locales; English default for en). Replaces
  // the prior `isHi ? devanagari : undefined` which left mr/mai/sa pages
  // rendering Devanagari text in the Latin body font.
  const bodyStyle = getBodyFont(locale);
  const headStyle = getHeadingFont(locale);
  // Short alias for the en/hi script-aware label picker. Devanagari locales
  // (hi/mr/mai/sa) get `hi`, everything else gets `en` — replaces the
  // previous `isHi ?` ternaries scattered through this JSX.
  const T = (en: string, hi: string) => pickByScript(en, hi, locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Hero Section ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 mb-8 text-center">
        <div className="flex justify-center mb-6">
          {/* Hero image — dramatic photo/painting. Falls back to geometric yantra SVG */}
          {(() => {
            const imageSlug = YOGA_IMAGE_MAP[slug] || CATEGORY_IMAGE_MAP[yoga.category];
            if (imageSlug) {
              return (
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-gold-primary/30 shadow-[0_0_30px_rgba(212,168,83,0.2)]">
                  {/* Double-cast on `yoga.name`: type is `LocaleText & { sa: string }`,
                      which TS narrows in a way that drops `LocaleText`'s index
                      signature. tl() needs the index signature, so we re-widen via
                      `unknown as Record<string,string>`. Gemini #181 suggested
                      removing — verified TS2345 reappears without the cast. */}
                  <Image
                    src={`/images/yogas/${imageSlug}.jpg`}
                    alt={tl(yoga.name as unknown as Record<string, string>, locale)}
                    fill
                    sizes="(max-width: 768px) 160px, 192px"
                    className="object-cover"
                    priority
                  />
                </div>
              );
            }
            return <DefaultYogaIcon size={140} auspicious={yoga.isAuspicious} />;
          })()}
        </div>

        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-primary/15 text-gold-light text-xs font-bold uppercase tracking-wider">
            {T('Kundali Yoga', 'कुण्डली योग')}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cat.bg} text-xs font-semibold uppercase tracking-wider ${cat.text}`}>
            {T(cat.label, cat.labelHi)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-[Cinzel] text-gold-light mb-2" style={headStyle}>
          {T(yoga.name.en, yoga.name.hi)}
        </h1>

        {yoga.name.sa && (
          <p className="text-text-secondary text-lg italic" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {yoga.name.sa}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <span className={`inline-flex items-center gap-1 text-sm ${yoga.isAuspicious ? 'text-emerald-400' : 'text-red-400'}`}>
            {yoga.isAuspicious ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {yoga.isAuspicious ? (T('Auspicious', 'शुभ')) : (T('Inauspicious', 'अशुभ'))}
          </span>
          <span className="text-text-secondary text-sm">
            {T('Expected frequency', 'अपेक्षित आवृत्ति')}: ~{yoga.frequency}%
          </span>
        </div>

        {/* Formation rule — prominent */}
        <div className="mt-6 bg-white/[0.03] border border-gold-primary/10 rounded-xl px-6 py-4">
          <p className="text-sm text-text-secondary mb-1">{T('Formation Rule', 'निर्माण नियम')}</p>
          <p className="text-gold-light text-lg" style={bodyStyle}>
            {tl(yoga.formationRule, locale)}
          </p>
        </div>

        {/* Example chart position */}
        {yoga.chartPositions && yoga.chartPositions.length > 0 && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs text-text-secondary mb-2 uppercase tracking-wider font-bold">
              {T('Example Chart Position', 'उदाहरण कुण्डली')}
            </p>
            <MiniChart positions={yoga.chartPositions} size={220} />
            <p className="text-[10px] text-text-secondary/50 mt-1.5">
              {T('Aries Lagna example — actual positions will vary', 'मेष लग्न उदाहरण — वास्तविक स्थिति भिन्न हो सकती है')}
            </p>
          </div>
        )}
      </div>

      {/* ── What is this Yoga? ───────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
          <BookOpen size={20} className="text-gold-primary" />
          {T('What is this Yoga?', 'यह योग क्या है?')}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6 space-y-4">
          {/* Locale-indexed lookup beats the previous hardcoded `locale === 'mai'` check —
              generalizes to any future locale added to detailedDescription's overlay without
              touching the render code. Falls back to isHi ? .hi : .en when the locale isn't
              in the overlay (English source vs Devanagari-script chrome).
              Gemini PR #412 cycle-1 MED. */}
          {((yoga.detailedDescription as Record<string, string[] | undefined>)[locale] ?? pickByScript(yoga.detailedDescription.en, yoga.detailedDescription.hi, locale)).map((para, i) => (
            <p key={i} className="text-text-primary leading-relaxed" style={bodyStyle}>{para}</p>
          ))}
        </div>
      </section>

      {/* ── Effects ──────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
          <Star size={20} className="text-gold-primary" />
          {T('Effects When Present', 'प्रभाव')}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {yoga.effects.map((effect, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-5">
              <p className="text-sm text-gold-primary font-semibold mb-1">{tl(effect.area, locale)}</p>
              <p className="text-text-primary text-sm leading-relaxed" style={bodyStyle}>
                {tl(effect.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Shows Up In Life ──────────────────────── */}
      {yoga.realWorldManifestation && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <Compass size={20} className="text-gold-primary" />
            {T('How It Shows Up In Life', 'जीवन में कैसे प्रकट होता है')}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6">
            <p className="text-text-primary leading-relaxed" style={bodyStyle}>
              {tl(yoga.realWorldManifestation, locale)}
            </p>
          </div>
        </section>
      )}

      {/* ── Strength Factors ─────────────────────────────── */}
      {yoga.strengthFactors && yoga.strengthFactors.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <TrendingUp size={20} className="text-gold-primary" />
            {T('What Strengthens This Yoga', 'योग को क्या प्रबल बनाता है')}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6">
            <ul className="space-y-3">
              {yoga.strengthFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Sparkles size={16} className="text-gold-primary mt-1 shrink-0" />
                  <span className="text-text-primary text-sm leading-relaxed" style={bodyStyle}>{tl(f, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── When It Activates ────────────────────────────── */}
      {yoga.activationTiming && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <Clock size={20} className="text-gold-primary" />
            {T('When This Yoga Activates', 'दशा सक्रियण')}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6">
            <p className="text-text-primary leading-relaxed" style={bodyStyle}>
              {tl(yoga.activationTiming, locale)}
            </p>
          </div>
        </section>
      )}

      {/* ── Practical Guidance ───────────────────────────── */}
      {yoga.practicalGuidance && yoga.practicalGuidance.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <BookOpen size={20} className="text-gold-primary" />
            {T('Practical Guidance', 'व्यावहारिक मार्गदर्शन')}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6">
            <ul className="space-y-3">
              {yoga.practicalGuidance.map((g, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 mt-1 shrink-0" />
                  <span className="text-text-primary text-sm leading-relaxed" style={bodyStyle}>{tl(g, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Cancellation Conditions ──────────────────────── */}
      {yoga.cancellations && yoga.cancellations.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <Shield size={20} className="text-gold-primary" />
            {T('Cancellation Conditions', 'भंग की शर्तें')}
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-6">
            <ul className="space-y-3">
              {yoga.cancellations.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle size={16} className="text-amber-500 mt-1 shrink-0" />
                  <span className="text-text-primary text-sm" style={bodyStyle}>{tl(c, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Remedies ─────────────────────────────────────── */}
      {yoga.remedies && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light flex items-center gap-2 mb-4" style={headStyle}>
            <Gem size={20} className="text-gold-primary" />
            {T('Remedies', 'उपाय')}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {yoga.remedies.gemstone && (
              <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-5 text-center">
                <Gem size={24} className="text-gold-primary mx-auto mb-2" />
                <p className="text-xs text-text-secondary mb-1">{T('Gemstone', 'रत्न')}</p>
                <p className="text-gold-light font-semibold" style={bodyStyle}>{tl(yoga.remedies.gemstone, locale)}</p>
              </div>
            )}
            {yoga.remedies.mantra && (
              <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-5 text-center">
                <BookOpen size={24} className="text-gold-primary mx-auto mb-2" />
                <p className="text-xs text-text-secondary mb-1">{T('Mantra', 'मन्त्र')}</p>
                <p className="text-gold-light font-semibold text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{yoga.remedies.mantra}</p>
              </div>
            )}
            {yoga.remedies.charity && (
              <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/8 rounded-xl p-5 text-center">
                <Users size={24} className="text-gold-primary mx-auto mb-2" />
                <p className="text-xs text-text-secondary mb-1">{T('Charity', 'दान')}</p>
                <p className="text-gold-light font-semibold" style={bodyStyle}>{tl(yoga.remedies.charity, locale)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Classical Reference ───────────────────────────── */}
      {yoga.classicalReference && (
        <section className="mb-8">
          <div className="bg-gold-primary/5 border border-gold-primary/15 rounded-xl p-6">
            <p className="text-xs text-gold-primary font-semibold uppercase tracking-wider mb-2">{T('Classical Reference', 'शास्त्रीय सन्दर्भ')}</p>
            <blockquote className="text-text-primary italic text-sm border-l-2 border-gold-primary/30 pl-4" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
              {yoga.classicalReference.verse}
            </blockquote>
            <p className="text-text-secondary text-xs mt-2"> &ndash; {yoga.classicalReference.source}</p>
          </div>
        </section>
      )}

      {/* ── Related Yogas ────────────────────────────────── */}
      {yoga.relatedYogas && yoga.relatedYogas.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-[Cinzel] text-gold-light mb-4" style={headStyle}>
            {T('Related Yogas', 'सम्बन्धित योग')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {yoga.relatedYogas.map(relatedSlug => (
              <Link key={relatedSlug} href={`/learn/yoga/${relatedSlug}` as any} className="px-4 py-2 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-xl text-gold-light text-sm hover:border-gold-primary/40 transition-colors">
                {relatedSlug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTAs ─────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-[Cinzel] text-gold-light mb-2" style={headStyle}>
            {T('Do you have this yoga?', 'क्या आपकी कुण्डली में यह योग है?')}
          </h3>
          <p className="text-text-secondary text-xs mb-3" style={bodyStyle}>
            {T('Generate your free Kundali and check 173 yogas', 'मुफ़्त कुण्डली बनाएँ और 173 योगों की जाँच करें')}
          </p>
          <Link href="/kundali" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-primary text-bg-primary font-bold rounded-xl hover:bg-gold-light transition-colors text-sm">
            {T('Generate Kundali', 'कुण्डली बनाएँ')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="bg-gradient-to-r from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-[Cinzel] text-gold-light mb-2" style={headStyle}>
            {T('Yoga Formation Animator', 'योग निर्माण एनीमेटर')}
          </h3>
          <p className="text-text-secondary text-xs mb-3" style={bodyStyle}>
            {T('Watch planets animate step-by-step into yoga formations', 'ग्रहों को चरण दर चरण कुण्डली में योग बनाते देखें')}
          </p>
          <Link href="/learn/yoga-animator" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-primary/10 border border-gold-primary/30 text-gold-light font-semibold rounded-xl hover:bg-gold-primary/20 transition-colors text-sm">
            {T('Open Animator', 'एनीमेशन देखें')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    <AuthorByline />
    </div>
  );
}
