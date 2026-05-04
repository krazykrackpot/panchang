'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/gun-milan.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Heart, ShieldAlert, Star, Users, Scale, Zap, Moon, Brain, Droplets, AlertTriangle } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

// ── Ashta Kuta data ────────────────────────────────────────────────────

const KUTAS = [
  { num: 1, name: 'Varna', hi: 'वर्ण', max: 1, measures: 'Spiritual compatibility / ego levels', hi_m: 'आध्यात्मिक अनुकूलता / अहंकार स्तर', icon: Star },
  { num: 2, name: 'Vashya', hi: 'वश्य', max: 2, measures: 'Mutual attraction / dominance dynamics', hi_m: 'पारस्परिक आकर्षण / प्रभुत्व', icon: Users },
  { num: 3, name: 'Tara', hi: 'तारा', max: 3, measures: 'Destiny compatibility / health of the bond', hi_m: 'भाग्य अनुकूलता / सम्बन्ध स्वास्थ्य', icon: Star },
  { num: 4, name: 'Yoni', hi: 'योनि', max: 4, measures: 'Physical & sexual compatibility', hi_m: 'शारीरिक एवं यौन अनुकूलता', icon: Heart },
  { num: 5, name: 'Graha Maitri', hi: 'ग्रह मैत्री', max: 5, measures: 'Mental wavelength / friendship of Moon lords', hi_m: 'मानसिक तारतम्य / चन्द्र स्वामी मैत्री', icon: Brain },
  { num: 6, name: 'Gana', hi: 'गण', max: 6, measures: 'Temperament match (Deva, Manushya, Rakshasa)', hi_m: 'स्वभाव मिलान (देव, मनुष्य, राक्षस)', icon: Zap },
  { num: 7, name: 'Bhakoot', hi: 'भकूट', max: 7, measures: 'Emotional compatibility / prosperity factor', hi_m: 'भावनात्मक अनुकूलता / समृद्धि कारक', icon: Scale },
  { num: 8, name: 'Nadi', hi: 'नाड़ी', max: 8, measures: 'Genetic & health compatibility / progeny', hi_m: 'आनुवंशिक एवं स्वास्थ्य अनुकूलता / सन्तान', icon: Droplets },
];

const SCORE_RANGES = [
  { min: 0, max: 17, label: 'Not Recommended', hi: 'अनुशंसित नहीं', cls: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { min: 18, max: 24, label: 'Acceptable', hi: 'स्वीकार्य', cls: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { min: 25, max: 31, label: 'Good Match', hi: 'अच्छा मिलान', cls: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { min: 32, max: 36, label: 'Excellent Match', hi: 'उत्कृष्ट मिलान', cls: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-400/30' },
];

export default function LearnGunMilanPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* ── Hero ── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Gun Milan scores compatibility on 8 factors (kutas) totalling 36 points — 18+ is the minimum threshold for marriage.',
        'Nadi Kuta (8 points) is the single heaviest factor — a Nadi Dosha (0/8) is considered a serious red flag.',
        'Gun Milan is a screening tool. Chart-level analysis (7th house, Venus, dasha compatibility) is equally important.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Nakshatra" explanation="The Moon's constellation at birth — the foundation of all Gun Milan calculations" />
        <BeginnerNote term="Kuta" explanation="A matching factor or criterion — literally 'peak' or 'point' in Sanskrit" />
        <BeginnerNote term="Dosha" explanation="A defect or affliction in the chart that may indicate challenges" />
      </div>

      {/* ── Introduction ── */}
      <LessonSection title={isHi ? 'गुण मिलान क्या है?' : 'What is Gun Milan?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* ── The 8 Kutas ── */}
      <LessonSection number={1} title={t('kutasTitle')}>
        <p style={bf}>{t('kutasContent')}</p>
        <div className="mt-4 space-y-3">
          {KUTAS.map(k => (
            <div key={k.num} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
                <k.icon size={18} className="text-gold-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold-light font-semibold text-sm">
                    {k.num}. {isHi ? k.hi : k.name}
                    {!isHi && <span className="text-gold-dark ml-1">({k.hi})</span>}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary border border-gold-primary/20 font-bold">
                    {k.max} {isHi ? 'अंक' : 'pts'}
                  </span>
                </div>
                <p className="text-text-secondary text-xs" style={bf}>
                  {isHi ? k.hi_m : k.measures}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
          <p className="text-gold-light text-sm font-semibold text-center">
            {isHi ? 'कुल: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36 अंक' : 'Total: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36 points'}
          </p>
        </div>
        <ClassicalReference
          shortName="Brihat Parashara Hora Shastra"
          chapter="Marriage Matching chapters"
        />
      </LessonSection>

      {/* ── Score Interpretation ── */}
      <LessonSection number={2} title={t('scoresTitle')}>
        <p style={bf}>{t('scoresContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCORE_RANGES.map(r => (
            <div key={r.label} className={`p-4 rounded-xl border ${r.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-sm ${r.cls}`}>
                  {isHi ? r.hi : r.label}
                </span>
                <span className="text-text-secondary text-xs font-mono">
                  {r.min}–{r.max}/36
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${r.cls.replace('text-', 'bg-')}`}
                  style={{ width: `${(r.max / 36) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Nadi Dosha Warning ── */}
      <LessonSection number={3} title={isHi ? 'नाड़ी दोष: सबसे गम्भीर कूट' : 'Nadi Dosha: The Most Critical Kuta'} variant="highlight">
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <ShieldAlert size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-sm font-medium">
            {isHi
              ? 'जब दोनों का नक्षत्र एक ही नाड़ी (आदि, मध्य, अन्त) में हो, तो नाड़ी कूट 0/8 होता है। यह सन्तान स्वास्थ्य के लिए सबसे गम्भीर चेतावनी माना जाता है।'
              : 'When both partners\' Nakshatras fall in the same Nadi (Aadi, Madhya, Antya), Nadi Kuta scores 0/8. This is considered the most serious warning for progeny and health compatibility.'}
          </p>
        </div>
        <p className="text-text-secondary text-sm" style={bf}>
          {isHi
            ? 'नाड़ी दोष निवारण तब होता है जब दोनों का नक्षत्र समान हो परन्तु राशि भिन्न हो, या जब दोनों की राशि समान हो परन्तु नक्षत्र भिन्न हो।'
            : 'Nadi Dosha is cancelled when both have the same Nakshatra but different Rashis, or when both have the same Rashi but different Nakshatras. Several other exceptions exist in BPHS.'}
        </p>
      </LessonSection>

      {/* ── Mangal Dosha ── */}
      <LessonSection number={4} title={t('mangalTitle')}>
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-amber-300 text-sm font-medium">
            {isHi
              ? 'मांगलिक दोष गुण मिलान के 36 अंकों से अलग है — यह एक स्वतन्त्र जाँच है।'
              : 'Mangal Dosha is separate from the 36-point Gun Milan score — it is an independent check.'}
          </p>
        </div>
        <p style={bf}>{t('mangalContent')}</p>
        <ClassicalReference
          shortName="BPHS"
          chapter="Mangal Dosha cancellation rules (10+ conditions)"
        />
      </LessonSection>

      {/* ── Beyond Gun Milan ── */}
      <LessonSection number={5} title={t('beyondTitle')}>
        <p style={bf}>{t('beyondContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { text: isHi ? 'सप्तम भाव और उसके स्वामी की स्थिति' : '7th house and its lord\'s placement', cls: 'text-gold-primary' },
            { text: isHi ? 'शुक्र की स्थिति (विवाह कारक)' : 'Venus placement (significator of marriage)', cls: 'text-gold-primary' },
            { text: isHi ? 'गुरु की सप्तम पर दृष्टि' : 'Jupiter\'s aspect on the 7th house', cls: 'text-gold-primary' },
            { text: isHi ? 'दशा अनुकूलता (वर्तमान और आगामी)' : 'Dasha compatibility (current and upcoming)', cls: 'text-gold-primary' },
            { text: isHi ? 'नवांश कुण्डली (डी-9) विश्लेषण' : 'Navamsha (D-9) chart analysis', cls: 'text-gold-primary' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <p className={`text-sm ${item.cls}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Regional Traditions ── */}
      <LessonSection number={6} title={t('regionalTitle')}>
        <p style={bf}>{t('regionalContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <h4 className="text-gold-light font-semibold text-sm mb-1">{isHi ? 'उत्तर भारत — अष्ट कूट' : 'North India — Ashta Kuta'}</h4>
            <p className="text-text-secondary text-xs">{isHi ? '8 कारक, 36 अंक। नक्षत्र आधारित।' : '8 factors, 36 points. Nakshatra-based.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <h4 className="text-gold-light font-semibold text-sm mb-1">{isHi ? 'दक्षिण भारत — दश कूट / पोरुत्तम' : 'South India — Dasha Kuta / Poruttham'}</h4>
            <p className="text-text-secondary text-xs">{isHi ? '10 कारक, रज्जु + वेध + स्त्री दीर्घ अतिरिक्त।' : '10 factors, includes Rajju + Vedha + Stree Deergha.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── Summary ── */}
      <LessonSection title={t('summaryTitle')}>
        <p style={bf}>{t('summaryContent')}</p>
      </LessonSection>

      {/* ── Source disclaimer ── */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* ── Explore Further ── */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/matching', label: isHi ? 'कुण्डली मिलान उपकरण' : 'Kundali Matching Tool' },
            { href: '/learn/matching', label: isHi ? 'मिलान मार्गदर्शिका' : 'Matching Guide' },
            { href: '/learn/compatibility', label: isHi ? 'अनुकूलता' : 'Compatibility' },
            { href: '/learn/mangal-dosha', label: isHi ? 'मांगलिक दोष' : 'Mangal Dosha' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/doshas', label: isHi ? 'दोष' : 'Doshas' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
              style={bf}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
