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
import LJ from '@/messages/learn/mangal-dosha.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { ShieldAlert, ShieldCheck, AlertTriangle, Heart, Sparkles, Ban } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

const DOSHA_HOUSES = [
  { house: '1st', hi: '1ला', area: 'Personality / Self', hi_area: 'व्यक्तित्व', severity: 'Moderate', cls: 'text-amber-400' },
  { house: '2nd', hi: '2रा', area: 'Family / Speech', hi_area: 'परिवार / वाणी', severity: 'Moderate', cls: 'text-amber-400' },
  { house: '4th', hi: '4था', area: 'Domestic Peace', hi_area: 'गृह शान्ति', severity: 'Moderate', cls: 'text-amber-400' },
  { house: '7th', hi: '7वाँ', area: 'Marriage itself', hi_area: 'विवाह स्वयं', severity: 'Severe', cls: 'text-red-400' },
  { house: '8th', hi: '8वाँ', area: 'Marital Longevity', hi_area: 'दाम्पत्य दीर्घायु', severity: 'Severe', cls: 'text-red-400' },
  { house: '12th', hi: '12वाँ', area: 'Intimacy / Losses', hi_area: 'अन्तरंगता / हानि', severity: 'Mild-Moderate', cls: 'text-amber-400/70' },
];

const CANCELLATIONS = [
  { en: 'Mars in own sign (Aries/Scorpio) or exalted (Capricorn)', hi: 'मंगल स्वगृही (मेष/वृश्चिक) या उच्च (मकर)' },
  { en: 'Mars conjunct or aspected by Jupiter', hi: 'गुरु की युति या दृष्टि' },
  { en: 'Mars in Jupiter\'s signs (Sagittarius/Pisces)', hi: 'मंगल गुरु की राशि (धनु/मीन) में' },
  { en: '7th lord in a kendra (1, 4, 7, 10)', hi: '7वें भाव का स्वामी केन्द्र में' },
  { en: 'Mars in 2nd house in Gemini or Virgo', hi: 'मंगल 2रे भाव में मिथुन या कन्या में' },
  { en: 'Both partners have Mangal Dosha', hi: 'दोनों साथियों में मांगलिक दोष' },
  { en: 'Mars aspected by benefics from 7th house', hi: '7वें भाव से शुभ ग्रह की दृष्टि' },
  { en: 'Mars in 1st/8th in Leo or Aquarius', hi: '1ले/8वें भाव में सिंह/कुम्भ में' },
  { en: 'Mars in 4th conjunct Moon', hi: '4थे भाव में मंगल-चन्द्र युति' },
  { en: 'Native over 28 years of age (Mars matures)', hi: '28 वर्ष की आयु के बाद (मंगल परिपक्व)' },
];

export default function LearnMangalDoshaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Mangal Dosha forms when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house — roughly 40% of all charts have it.',
        'Classical texts (BPHS Ch. 81) provide 10+ cancellation rules — the dosha is neutralised far more often than feared.',
        'Mars matures after age 28 and its aggressive energy naturally stabilises — the dosha\'s intensity diminishes with age.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Mangal Dosha" explanation="When Mars (Mangal/Kuja) is in specific houses from Lagna, Moon, or Venus — said to create friction in married life" />
        <BeginnerNote term="Kuja Dosha" explanation="Another name for Mangal Dosha — 'Kuja' is the Sanskrit name for Mars" />
        <BeginnerNote term="Cancellation" explanation="Classical conditions under which the dosha is neutralised — there are 10+ rules in BPHS" />
      </div>

      {/* Intro */}
      <LessonSection title={isHi ? 'मांगलिक दोष क्या है?' : 'What is Mangal Dosha?'}>
        <p style={bf}>{t('intro')}</p>
      </LessonSection>

      {/* Severity */}
      <LessonSection number={1} title={t('severityTitle')}>
        <p style={bf}>{t('severityContent')}</p>
        <div className="mt-4 space-y-2">
          {DOSHA_HOUSES.map(h => (
            <div key={h.house} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <span className="w-10 text-gold-light text-sm font-bold">{isHi ? h.hi : h.house}</span>
              <span className="flex-1 text-text-primary text-sm">{isHi ? h.hi_area : h.area}</span>
              <span className={`text-xs font-semibold ${h.cls}`}>{h.severity}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-text-secondary italic">
          {isHi ? 'लग्न से दोष सबसे बलवान, चन्द्र से मध्यम, शुक्र से सबसे हल्का।' : 'Dosha from Lagna is strongest, from Moon moderate, from Venus mildest.'}
        </div>
      </LessonSection>

      {/* Cancellation Rules */}
      <LessonSection number={2} title={t('cancellationTitle')} variant="highlight">
        <p style={bf}>{t('cancellationContent')}</p>
        <div className="mt-4 space-y-2">
          {CANCELLATIONS.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-text-primary">{isHi ? c.hi : c.en}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" author="Maharshi Parashara" chapter="Ch. 81 — Manglik Dosha formation and cancellation rules" />
      </LessonSection>

      {/* Misconceptions */}
      <LessonSection number={3} title={t('misconceptionsTitle')}>
        <p style={bf}>{t('misconceptionsContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { myth: isHi ? '"मांगलिक पति/पत्नी की मृत्यु होगी"' : '"A Manglik causes spouse\'s death"', reality: isHi ? 'बीपीएचएस में "दाम्पत्य कलह" है, मृत्यु नहीं' : 'BPHS says "marital discord", not death', icon: Ban },
            { myth: isHi ? '"दोष कभी नहीं जाता"' : '"The dosha never goes away"', reality: isHi ? '28 के बाद मंगल परिपक्व होता है' : 'Mars matures after age 28', icon: ShieldCheck },
            { myth: isHi ? '"केवल मांगलिक से विवाह करो"' : '"Must marry only a Manglik"', reality: isHi ? '10+ अन्य निवारण नियम हैं' : '10+ other cancellation rules exist', icon: Heart },
            { myth: isHi ? '"कुम्भ विवाह दोष दूर करता है"' : '"Kumbh Vivah removes it"', reality: isHi ? 'किसी प्रामाणिक ग्रन्थ में नहीं' : 'Not found in any authoritative text', icon: AlertTriangle },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={16} className="text-red-400" />
                <span className="text-red-300 text-xs line-through">{item.myth}</span>
              </div>
              <p className="text-emerald-400 text-xs">{item.reality}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Remedies */}
      <LessonSection number={4} title={t('remediesTitle')}>
        <p style={bf}>{t('remediesContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { remedy: isHi ? 'मांगलिक मिलान' : 'Mangal Dosha Matching', desc: isHi ? 'दोनों साथियों में दोष — परस्पर निवारण' : 'Both partners have dosha — mutual neutralisation', primary: true },
            { remedy: isHi ? 'कुज शान्ति पूजा' : 'Kuja Shanti Puja', desc: isHi ? 'लाल पुष्प, लाल वस्त्र, मंगल मन्त्र' : 'Red flowers, red cloth, Mars mantras', primary: true },
            { remedy: isHi ? 'मंगलवार उपवास' : 'Tuesday Fasting', desc: isHi ? 'मंगल का दिन' : 'Mars\'s day', primary: false },
            { remedy: isHi ? 'मूँगा (रेड कोरल)' : 'Red Coral (Moonga)', desc: isHi ? 'दक्षिण हाथ की अनामिका में' : 'On the ring finger of right hand', primary: false },
            { remedy: isHi ? 'हनुमान चालीसा' : 'Hanuman Chalisa', desc: isHi ? 'हनुमान मंगल की आक्रामकता शान्त करते हैं' : 'Hanuman pacifies Mars\'s aggression', primary: false },
            { remedy: isHi ? 'मसूर दाल / गुड़ दान' : 'Donate Red Lentils / Jaggery', desc: isHi ? 'मंगलवार को' : 'On Tuesdays', primary: false },
          ].map((r, i) => (
            <div key={i} className={`p-3 rounded-xl border ${r.primary ? 'bg-gold-primary/5 border-gold-primary/20' : 'bg-white/[0.03] border-gold-primary/10'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={12} className="text-gold-primary" />
                <span className="text-gold-light text-sm font-semibold">{r.remedy}</span>
              </div>
              <p className="text-text-secondary text-xs">{r.desc}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Muhurta Chintamani" author="Daivagna Acharya Shri Ram" chapter="Remedial measures for Mangal Dosha" />
      </LessonSection>

      {/* Source */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* Explore Further */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/mangal-dosha', label: isHi ? 'मांगलिक दोष चेकर' : 'Mangal Dosha Checker' },
            { href: '/learn/matching', label: isHi ? 'कुण्डली मिलान' : 'Kundali Matching' },
            { href: '/learn/doshas', label: isHi ? 'सभी दोष' : 'All Doshas' },
            { href: '/matching', label: isHi ? 'अष्ट कूट मिलान' : 'Ashta Kuta Milan' },
            { href: '/learn/remedies', label: isHi ? 'उपाय' : 'Remedies' },
            { href: '/learn/marriage', label: isHi ? 'विवाह ज्योतिष' : 'Marriage Astrology' },
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
