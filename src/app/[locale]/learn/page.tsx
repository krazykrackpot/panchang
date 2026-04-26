'use client';

import { tl } from '@/lib/utils/trilingual';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight, ChevronDown, Clock, Star, CheckCircle, Sparkles, Library, ArrowRight, Flame } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import type { Locale } from '@/types/panchang';
import L from '@/messages/learn/learn-index.json';
import AuthorByline from '@/components/ui/AuthorByline';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import LearningPath from '@/components/learn/LearningPath';

const STATS = { modules: 104, references: 45, labs: 6, phases: 12 };

export default function LearnPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  /** Safe trilingual access — falls back to en for unknown locales */
  const tri = (obj: LocaleText | Record<string, string>) => tl(obj, locale);

  // Item 3: Reference library toggle
  const [showRefs, setShowRefs] = useState(false);

  // Item 4: Streak counter from learning progress store
  const { streak, hydrated, hydrateFromStorage } = useLearningProgressStore();
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  // Labs
  const LABS = [
    { href: '/learn/labs/panchang', title: { en: 'Compute Your Panchang', hi: 'पंचांग गणना', sa: 'पञ्चाङ्गगणना' }, color: 'amber' },
    { href: '/learn/labs/moon', title: { en: 'Trace Your Moon', hi: 'चन्द्र खोज', sa: 'चन्द्रान्वेषणम्' }, color: 'indigo' },
    { href: '/learn/labs/dasha', title: { en: 'Dasha Timeline', hi: 'दशा समयरेखा', sa: 'दशासमयरेखा' }, color: 'violet' },
    { href: '/learn/labs/shadbala', title: { en: 'Shadbala Breakdown', hi: 'षड्बल विश्लेषण', sa: 'षड्बलविश्लेषणम्' }, color: 'emerald' },
    { href: '/learn/labs/kp', title: { en: 'KP Sub-Lord Lookup', hi: 'केपी उप-स्वामी', sa: 'केपी उपस्वामी' }, color: 'cyan' },
    { href: '/learn/yoga-animator', title: { en: 'Yoga Formation Animator', hi: 'योग निर्माण एनीमेटर', sa: 'योगनिर्माणचित्रणम्' }, color: 'amber' },
  ];

  // Reference library grouped by track
  const REF_GROUPS = [
    { label: { en: 'Cosmology & Mathematics', hi: 'ब्रह्माण्ड एवं गणित', sa: 'ब्रह्माण्डं गणितं च' }, refs: [
      { name: { en: 'Cosmology', hi: 'ब्रह्माण्ड', sa: 'ब्रह्माण्डम्' }, href: '/learn/cosmology' },
      { name: { en: 'Grahas', hi: 'ग्रह', sa: 'ग्रहाः' }, href: '/learn/grahas' },
      { name: { en: 'Rashis', hi: 'राशियाँ', sa: 'राशयः' }, href: '/learn/rashis' },
      { name: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, href: '/learn/nakshatras' },
      { name: { en: 'Ayanamsha', hi: 'अयनांश', sa: 'अयनांशः' }, href: '/learn/ayanamsha' },
      { name: { en: 'Aspects', hi: 'दृष्टि', sa: 'दृष्टिः' }, href: '/learn/aspects' },
      { name: { en: 'Retrograde', hi: 'वक्री', sa: 'वक्री' }, href: '/learn/retrograde-effects' },
      { name: { en: 'Combustion', hi: 'अस्त', sa: 'अस्तम्' }, href: '/learn/combustion' },
      { name: { en: 'Eclipses (Grahan)', hi: 'ग्रहण', sa: 'ग्रहणम्' }, href: '/learn/eclipses' },
      { name: { en: 'Remedies', hi: 'उपाय', sa: 'उपायाः' }, href: '/learn/remedies' },
      { name: { en: 'Classical Texts', hi: 'शास्त्रीय ग्रन्थ', sa: 'शास्त्रीयग्रन्थाः' }, href: '/learn/classical-texts' },
      { name: { en: 'Text Library', hi: 'ग्रंथागार', sa: 'ग्रंथागारम्' }, href: '/learn/library' },
      { name: { en: 'Vedanga Heritage', hi: 'वेदांग विरासत', sa: 'वेदाङ्गपरम्परा' }, href: '/learn/vedanga' },
      { name: { en: 'Observatories', hi: 'वेधशालाएं', sa: 'वेधशालाः' }, href: '/learn/observatories' },
    ]},
    { label: { en: 'Panchang & Calendar', hi: 'पंचांग', sa: 'पञ्चाङ्गम्' }, refs: [
      { name: { en: 'Tithis', hi: 'तिथियाँ', sa: 'तिथयः' }, href: '/learn/tithis' },
      { name: { en: 'Yogas', hi: 'योग', sa: 'योगाः' }, href: '/learn/yogas' },
      { name: { en: 'Karanas', hi: 'करण', sa: 'करणानि' }, href: '/learn/karanas' },
      { name: { en: 'Vara', hi: 'वार', sa: 'वारः' }, href: '/learn/vara' },
      { name: { en: 'Muhurtas', hi: 'मुहूर्त', sa: 'मुहूर्ताः' }, href: '/learn/muhurtas' },
      { name: { en: 'Hora', hi: 'होरा', sa: 'होरा' }, href: '/learn/hora' },
      { name: { en: 'Masa', hi: 'मास', sa: 'मासः' }, href: '/learn/masa' },
      { name: { en: 'Transit Guide', hi: 'गोचर', sa: 'गोचरः' }, href: '/learn/transit-guide' },
      { name: { en: 'Eclipses (Grahan)', hi: 'ग्रहण', sa: 'ग्रहणम्' }, href: '/learn/eclipses' },
    ]},
    { label: { en: 'Kundali & Prediction', hi: 'कुण्डली एवं भविष्यवाणी', sa: 'कुण्डली भविष्यवाणी च' }, refs: [
      { name: { en: 'Planets', hi: 'ग्रह स्थिति', sa: 'ग्रहस्थितयः' }, href: '/learn/planets' },
      { name: { en: 'Planet-in-House', hi: 'ग्रह भाव में', sa: 'ग्रहभावे' }, href: '/learn/planet-in-house' },
      { name: { en: 'Yoga Animator', hi: 'योग एनीमेटर', sa: 'योगचित्रणम्' }, href: '/learn/yoga-animator' },
      { name: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, href: '/learn/dashas' },
      { name: { en: 'Shadbala', hi: 'षड्बल', sa: 'षड्बलम्' }, href: '/learn/shadbala' },
      { name: { en: 'Bhavabala', hi: 'भावबल', sa: 'भावबलम्' }, href: '/learn/bhavabala' },
      { name: { en: 'Avasthas', hi: 'अवस्थाएँ', sa: 'अवस्थाः' }, href: '/learn/avasthas' },
      { name: { en: 'Sphutas', hi: 'स्फुट', sa: 'स्फुटाः' }, href: '/learn/sphutas' },
      { name: { en: 'Ashtakavarga', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्गः' }, href: '/learn/ashtakavarga' },
      { name: { en: 'Ashtakavarga Dasha', hi: 'अष्टकवर्ग दशा', sa: 'अष्टकवर्गदशा' }, href: '/learn/ashtakavarga-dasha' },
      { name: { en: 'Jaimini', hi: 'जैमिनी', sa: 'जैमिनी' }, href: '/learn/jaimini' },
      { name: { en: 'Argala', hi: 'अर्गला', sa: 'अर्गला' }, href: '/learn/argala' },
      { name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साडेसाती' }, href: '/learn/sade-sati' },
      { name: { en: 'Grahan Yoga', hi: 'ग्रहण योग', sa: 'ग्रहणयोगः' }, href: '/learn/grahan-yoga' },
      { name: { en: 'Career', hi: 'कैरियर', sa: 'व्यवसायः' }, href: '/learn/career' },
      { name: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः' }, href: '/learn/marriage' },
      { name: { en: 'Wealth', hi: 'धन', sa: 'धनम्' }, href: '/learn/wealth' },
      { name: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्' }, href: '/learn/health' },
      { name: { en: 'Matching', hi: 'मिलान', sa: 'मेलनम्' }, href: '/learn/matching' },
      { name: { en: 'Compatibility', hi: 'अनुकूलता', sa: 'अनुकूलता' }, href: '/learn/compatibility' },
      { name: { en: 'Advanced Houses', hi: 'उन्नत भाव', sa: 'उन्नतभावाः' }, href: '/learn/advanced-houses' },
    ]},
  ];

  return (
    <div>
      {/* ── Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10 mb-10"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-primary text-xs uppercase tracking-widest font-bold">
              {t('completeCourse')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={hf}>
            <span className="text-gold-gradient">{t('heroTitle')}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-6" style={bf}>{t('heroSub')}</p>

          {/* Item 1: Start Learning CTA + Item 4: Streak badge */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link href="/learn/modules/0-1" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gold-primary/20 border-2 border-gold-primary/40 text-gold-light text-lg font-bold hover:bg-gold-primary/30 hover:border-gold-primary/60 transition-all">
              <Sparkles className="w-6 h-6" />
              {locale === 'hi' ? 'सीखना शुरू करें — मॉड्यूल 0.1' : locale === 'ta' ? 'கற்றலைத் தொடங்குங்கள்' : locale === 'bn' ? 'শেখা শুরু করুন' : 'Start Learning — Module 0.1'}
              <ArrowRight className="w-5 h-5" />
            </Link>
            {hydrated && streak.streakDays > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold">
                <Flame className="w-5 h-5" />
                {locale === 'hi' ? `${streak.streakDays} दिन स्ट्रीक` : locale === 'ta' ? `${streak.streakDays} நாள் தொடர்` : locale === 'bn' ? `${streak.streakDays} দিন ধারাবাহিক` : `Day ${streak.streakDays} streak`}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mb-6">
            {[
              { val: STATS.modules, label: t('modules'), icon: BookOpen },
              { val: STATS.references, label: t('references'), icon: Star },
              { val: STATS.labs, label: t('labs'), icon: CheckCircle },
              { val: STATS.phases, label: t('tracks'), icon: Clock },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-gold-dark" />
                <span className="text-gold-light font-bold text-lg">{s.val}</span>
                <span className="text-text-secondary text-sm">{s.label}</span>
              </div>
            ))}
          </div>
          <span className="text-text-secondary/75 text-sm">{t('freeForever')}</span>
          <div className="flex justify-center mt-5">
            <ShareRow
              pageTitle={t('heroTitle')}
              shareText={locale === 'en'
                ? 'Learn Vedic Astrology — 104 free modules from basics to advanced — Dekho Panchang'
                : isDevanagari
                  ? 'वैदिक ज्योतिष सीखें — 104 निःशुल्क मॉड्यूल — Dekho Panchang'
                  : 'वैदिकज्योतिषं पठतु — 104 निःशुल्कमॉड्यूलाः — Dekho Panchang'}
              locale={locale as Locale}
            />
          </div>
        </div>
      </motion.div>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* ── Learning Path (sequential phases) ── */}
      <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={hf}>
        {locale === 'hi' ? 'आपकी सीखने की यात्रा' :
         locale === 'ta' ? 'உங்கள் கற்றல் பயணம்' :
         locale === 'bn' ? 'আপনার শেখার যাত্রা' :
         'Your Learning Journey'}
      </h2>
      <p className="text-text-secondary text-sm mb-8 max-w-2xl" style={bf}>
        {locale === 'hi' ? '12 चरण, मूल बातों से लेकर उन्नत भविष्यवाणी तक — क्रमानुसार ऊपर बढ़ें।' :
         locale === 'ta' ? '12 நிலைகள், அடிப்படையிலிருந்து மேம்பட்ட கணிப்பு வரை — வரிசையாக மேலே செல்லுங்கள்.' :
         locale === 'bn' ? '12টি পর্যায়, মূল বিষয় থেকে উন্নত ভবিষ্যদ্বাণী পর্যন্ত — ক্রমানুসারে উপরে উঠুন।' :
         '12 phases, from foundations to advanced prediction — work your way up.'}
      </p>
      <div className="mb-16">
        <LearningPath />
      </div>

      {/* ── Interactive Labs ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
            &#9881;
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gold-gradient" style={hf}>{t('labsTitle')}</h2>
            <p className="text-text-secondary text-sm" style={bf}>{t('labsSub')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {LABS.map(lab => (
            <Link key={lab.href} href={lab.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10 hover:border-gold-primary/30 transition-all group text-center">
              <h3 className="text-gold-light font-bold text-sm mb-1 group-hover:text-gold-primary" style={bf}>{tri(lab.title)}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Classical Text Library Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <Link href="/learn/library" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 hover:border-amber-500/50 bg-gradient-to-r from-[#1a1200]/80 via-[#1a1000]/60 to-[#0a0e27] p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-all duration-500" />
            <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-amber-700/5 blur-3xl" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Library className="w-7 h-7 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500/70">
                     {t('freeResource')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">28 texts</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors mb-1" style={hf}>
                   {t('classicalTextLibrary')}
                </h3>
                <p className="text-amber-200/55 text-sm leading-relaxed" style={bf}>
                  {locale === 'en'
                    ? 'Parashara · Varahamihira · Jaimini · Krishnamurti · Surya Siddhanta — all free via archive.org'
                    : isDevanagari
                    ? 'पाराशर · वराहमिहिर · जैमिनी · कृष्णमूर्ति · सूर्य सिद्धान्त — archive.org पर निःशुल्क'
                    : 'पाराशरः · वराहमिहिरः · जैमिनिः · कृष्णमूर्तिः — archive.org इत्यत्र निःशुल्काः'}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-amber-400/70 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-semibold hidden sm:inline">
                   {t('browseLibrary')}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Web Stories Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <Link href="/stories" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-500/45 bg-gradient-to-r from-[#1a0a30]/80 via-[#150a25]/60 to-[#0a0e27] p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-all duration-500" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400/70">
                     {t('webStories')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-medium">
                     {t('fiveStories')}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-purple-200 group-hover:text-purple-100 transition-colors mb-1" style={hf}>
                   {t('indianContributionsStories')}
                </h3>
                <p className="text-purple-200/55 text-sm leading-relaxed" style={bf}>
                  {locale === 'en'
                    ? 'Sine · Zero · Calculus · Pythagoras · Speed of Light — 8-slide visual stories for mobile'
                    : isDevanagari
                    ? 'ज्या · शून्य · कलन · पाइथागोरस · प्रकाश गति — 8 स्लाइड दृश्य कहानियाँ'
                    : 'ज्या · शून्यम् · कलनम् · पाइथागोरसः · प्रकाशगतिः'}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-purple-400/70 group-hover:text-purple-400 transition-colors">
                <span className="text-sm font-semibold hidden sm:inline">
                   {t('exploreStories')}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Reference Library (grouped by track, collapsible) ── */}
      <div>
        <h2 className="text-2xl font-bold text-gold-gradient mb-2" style={hf}>{t('refTitle')}</h2>
        <p className="text-text-secondary text-sm mb-4" style={bf}>{t('refSub')}</p>

        <button
          onClick={() => setShowRefs(!showRefs)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gold-primary/20 hover:border-gold-primary/40 bg-gold-primary/5 hover:bg-gold-primary/10 text-gold-light text-sm font-medium transition-all mb-6"
        >
          {showRefs
            ? (locale === 'hi' ? 'संदर्भ पुस्तकालय छुपाएँ' : locale === 'ta' ? 'குறிப்பு நூலகத்தை மறை' : locale === 'bn' ? 'রেফারেন্স লাইব্রেরি লুকান' : 'Hide Reference Library')
            : (locale === 'hi' ? `संदर्भ पुस्तकालय देखें (${REF_GROUPS.reduce((s, g) => s + g.refs.length, 0)} विषय)` : locale === 'ta' ? `குறிப்பு நூலகம் (${REF_GROUPS.reduce((s, g) => s + g.refs.length, 0)} தலைப்புகள்)` : locale === 'bn' ? `রেফারেন্স লাইব্রেরি (${REF_GROUPS.reduce((s, g) => s + g.refs.length, 0)} বিষয়)` : `Browse Reference Library (${REF_GROUPS.reduce((s, g) => s + g.refs.length, 0)} topics)`)}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRefs ? 'rotate-180' : ''}`} />
        </button>

        {showRefs && (
          <div className="space-y-6">
            {REF_GROUPS.map(group => (
              <div key={group.label.en}>
                <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3" style={bf}>{tri(group.label)}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.refs.map(ref => (
                    <Link key={ref.href} href={ref.href}
                      className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
                      style={bf}>
                      {tri(ref.name)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <AuthorByline />
      </div>
    </div>
  );
}
