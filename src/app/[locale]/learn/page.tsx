'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight, Clock, Star, CheckCircle, Sparkles, Calendar, Diamond, Library } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';

const STATS = { modules: 104, references: 45, labs: 5, tracks: 11 };

export default function LearnPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const L = {
    en: {
      heroTitle: 'Learn Vedic Astrology',
      heroSub: 'The most comprehensive free Jyotish course online — 3 structured tracks from cosmic foundations to advanced prediction',
      freeForever: 'Free forever. No account needed.',
      chooseTrack: 'Choose Your Track',
      labsTitle: 'Interactive Labs',
      labsSub: 'Input your data, watch the engine calculate step by step',
      refTitle: 'Reference Library',
      refSub: 'Quick-access deep dives — use alongside the course or independently',
    },
    hi: {
      heroTitle: 'वैदिक ज्योतिष सीखें',
      heroSub: 'सबसे व्यापक निःशुल्क ज्योतिष पाठ्यक्रम — ब्रह्माण्डीय आधार से उन्नत भविष्यवाणी तक 3 संरचित ट्रैक',
      freeForever: 'सदा नि:शुल्क। खाते की आवश्यकता नहीं।',
      chooseTrack: 'अपना ट्रैक चुनें',
      labsTitle: 'इंटरैक्टिव प्रयोगशाला',
      labsSub: 'अपना डेटा दें, इंजन को चरणबद्ध गणना करते देखें',
      refTitle: 'संदर्भ पुस्तकालय',
      refSub: 'विशिष्ट विषयों पर त्वरित गहन अध्ययन',
    },
    sa: {
      heroTitle: 'वैदिकज्योतिषं पठतु',
      heroSub: 'सर्वव्यापकं निःशुल्कं ज्योतिषपाठ्यक्रमम् — ब्रह्माण्डाधारात् उन्नतभविष्यवाणीपर्यन्तम्',
      freeForever: 'सदा नि:शुल्कम्।',
      chooseTrack: 'स्वमार्गं चिनुत',
      labsTitle: 'अन्तरक्रियात्मकप्रयोगशाला',
      labsSub: 'स्वदत्तांशं दत्तवान् यन्त्रस्य गणनां पश्यतु',
      refTitle: 'सन्दर्भपुस्तकालयः',
      refSub: 'विशिष्टविषयेषु त्वरितगहनाध्ययनम्',
    },
  };
  const l = L[locale] || L.en;

  // 3 Mega Tracks
  const TRACKS = [
    {
      href: '/learn/track/cosmology',
      icon: Sparkles,
      gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
      border: 'border-gold-primary/12 hover:border-gold-primary/35',
      glow: 'hover:shadow-gold-primary/10',
      iconColor: 'text-[#f0d48a]',
      title: { en: 'Hindu Cosmology & Mathematics', hi: 'हिन्दू ब्रह्माण्ड विज्ञान एवं गणित', sa: 'हिन्दूब्रह्माण्डविज्ञानं गणितं च' },
      subtitle: { en: 'The universe, time, planets, stars, and the mathematical framework', hi: 'ब्रह्माण्ड, समय, ग्रह, तारे और गणितीय ढाँचा', sa: 'ब्रह्माण्डं कालः ग्रहाः ताराः गणितीयढाञ्चश्च' },
      stats: { en: '26 modules · 13 references', hi: '26 मॉड्यूल · 13 संदर्भ', sa: '26 मॉड्यूलाः · 13 सन्दर्भाः' },
      topics: { en: 'Cosmic time scales · Navagraha · 12 Rashis · 27 Nakshatras · Ayanamsha · Precession · Eclipses · Classical texts', hi: 'ब्रह्माण्डीय समय · नवग्रह · 12 राशि · 27 नक्षत्र · अयनांश · पुरस्सरण · ग्रहण · शास्त्रीय ग्रन्थ', sa: 'ब्रह्माण्डीयकालः · नवग्रहाः · 12 राशयः · 27 नक्षत्राणि · अयनांशः · ग्रहणम्' },
    },
    {
      href: '/learn/track/panchang',
      icon: Calendar,
      gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
      border: 'border-gold-primary/12 hover:border-gold-primary/35',
      glow: 'hover:shadow-gold-primary/10',
      iconColor: 'text-[#f0d48a]',
      title: { en: 'Panchang — The Daily Practice', hi: 'पञ्चाङ्ग — दैनिक अभ्यास', sa: 'पञ्चाङ्गम् — दैनिकाभ्यासः' },
      subtitle: { en: 'Reading the cosmic weather that governs every day', hi: 'प्रत्येक दिन को नियन्त्रित करने वाला ब्रह्माण्डीय मौसम पढ़ना', sa: 'प्रत्येकदिनं नियन्त्रयति इति ब्रह्माण्डमौसमं पठतु' },
      stats: { en: '11 modules · 9 references', hi: '11 मॉड्यूल · 9 संदर्भ', sa: '11 मॉड्यूलाः · 9 सन्दर्भाः' },
      topics: { en: 'Tithi · Nakshatra · Yoga · Karana · Vara · Muhurta · Hora · Festivals · Calendar systems', hi: 'तिथि · नक्षत्र · योग · करण · वार · मुहूर्त · होरा · त्योहार · पंचांग', sa: 'तिथिः · नक्षत्रं · योगः · करणं · वारः · मुहूर्तः · होरा' },
    },
    {
      href: '/learn/track/kundali',
      icon: Diamond,
      gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
      border: 'border-gold-primary/12 hover:border-gold-primary/35',
      glow: 'hover:shadow-gold-primary/10',
      iconColor: 'text-[#f0d48a]',
      title: { en: 'Kundali — Your Personal Cosmic Map', hi: 'कुण्डली — आपका व्यक्तिगत ब्रह्माण्डीय मानचित्र', sa: 'कुण्डली — भवतः व्यक्तिगतब्रह्माण्डमानचित्रम्' },
      subtitle: { en: 'From birth chart basics to advanced predictive techniques', hi: 'जन्म कुण्डली की मूल बातों से उन्नत भविष्यवाणी तकनीकों तक', sa: 'जन्मकुण्डलीमूलतत्त्वेभ्यः उन्नतभविष्यवाणीपर्यन्तम्' },
      stats: { en: '51 modules · 25 references · 5 labs', hi: '51 मॉड्यूल · 25 संदर्भ · 5 लैब', sa: '51 मॉड्यूलाः · 25 सन्दर्भाः · 5 प्रयोगशालाः' },
      topics: { en: 'Houses · Dashas · Yogas · Shadbala · Predictions · Matching · Remedies · Jaimini · KP System', hi: 'भाव · दशा · योग · षड्बल · भविष्यवाणी · मिलान · उपाय · जैमिनी · केपी', sa: 'भावाः · दशाः · योगाः · षड्बलं · भविष्यवाणी · मेलनम् · उपायाः' },
    },
  ];

  // Labs
  const LABS = [
    { href: '/learn/labs/panchang', title: { en: 'Compute Your Panchang', hi: 'पंचांग गणना', sa: 'पञ्चाङ्गगणना' }, color: 'amber' },
    { href: '/learn/labs/moon', title: { en: 'Trace Your Moon', hi: 'चन्द्र खोज', sa: 'चन्द्रान्वेषणम्' }, color: 'indigo' },
    { href: '/learn/labs/dasha', title: { en: 'Dasha Timeline', hi: 'दशा समयरेखा', sa: 'दशासमयरेखा' }, color: 'violet' },
    { href: '/learn/labs/shadbala', title: { en: 'Shadbala Breakdown', hi: 'षड्बल विश्लेषण', sa: 'षड्बलविश्लेषणम्' }, color: 'emerald' },
    { href: '/learn/labs/kp', title: { en: 'KP Sub-Lord Lookup', hi: 'केपी उप-स्वामी', sa: 'केपी उपस्वामी' }, color: 'cyan' },
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
      { name: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, href: '/learn/dashas' },
      { name: { en: 'Shadbala', hi: 'षड्बल', sa: 'षड्बलम्' }, href: '/learn/shadbala' },
      { name: { en: 'Bhavabala', hi: 'भावबल', sa: 'भावबलम्' }, href: '/learn/bhavabala' },
      { name: { en: 'Avasthas', hi: 'अवस्थाएँ', sa: 'अवस्थाः' }, href: '/learn/avasthas' },
      { name: { en: 'Sphutas', hi: 'स्फुट', sa: 'स्फुटाः' }, href: '/learn/sphutas' },
      { name: { en: 'Ashtakavarga', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्गः' }, href: '/learn/ashtakavarga' },
      { name: { en: 'Jaimini', hi: 'जैमिनी', sa: 'जैमिनी' }, href: '/learn/jaimini' },
      { name: { en: 'Argala', hi: 'अर्गला', sa: 'अर्गला' }, href: '/learn/argala' },
      { name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साडेसाती' }, href: '/learn/sade-sati' },
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
              {locale === 'en' ? 'The Complete Jyotish Course' : locale === 'hi' ? 'सम्पूर्ण ज्योतिष पाठ्यक्रम' : 'सम्पूर्णज्योतिषपाठ्यक्रमम्'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={hf}>
            <span className="text-gold-gradient">{l.heroTitle}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-8" style={bf}>{l.heroSub}</p>

          <div className="flex flex-wrap gap-6 mb-6">
            {[
              { val: STATS.modules, label: locale === 'en' ? 'Modules' : 'मॉड्यूल', icon: BookOpen },
              { val: STATS.references, label: locale === 'en' ? 'References' : 'संदर्भ', icon: Star },
              { val: STATS.labs, label: locale === 'en' ? 'Labs' : 'प्रयोगशाला', icon: CheckCircle },
              { val: STATS.tracks, label: locale === 'en' ? 'Tracks' : 'ट्रैक', icon: Clock },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-gold-dark" />
                <span className="text-gold-light font-bold text-lg">{s.val}</span>
                <span className="text-text-secondary text-sm">{s.label}</span>
              </div>
            ))}
          </div>
          <span className="text-text-secondary/75 text-sm">{l.freeForever}</span>
          <div className="flex justify-center mt-5">
            <ShareRow
              pageTitle={l.heroTitle}
              shareText={locale === 'en'
                ? 'Learn Vedic Astrology — 104 free modules from basics to advanced — Dekho Panchang'
                : locale === 'hi'
                  ? 'वैदिक ज्योतिष सीखें — 104 निःशुल्क मॉड्यूल — Dekho Panchang'
                  : 'वैदिकज्योतिषं पठतु — 104 निःशुल्कमॉड्यूलाः — Dekho Panchang'}
              locale={locale}
            />
          </div>
        </div>
      </motion.div>

      {/* ── 3 Mega Track Cards ── */}
      <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={hf}>{l.chooseTrack}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {TRACKS.map((track, i) => {
          const Icon = track.icon;
          return (
            <motion.div
              key={track.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={track.href} className="block group">
                <div className={`relative overflow-hidden rounded-2xl border ${track.border} bg-gradient-to-br ${track.gradient} p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] ${track.glow} hover:shadow-2xl min-h-[280px] flex flex-col`}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/3 blur-2xl" />

                  <div className="relative z-10 flex-1">
                    <Icon className={`w-10 h-10 ${track.iconColor} mb-4`} />
                    <h3 className="text-xl sm:text-2xl font-bold text-gold-light mb-2 group-hover:text-gold-primary transition-colors" style={hf}>
                      {track.title[locale]}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 leading-relaxed" style={bf}>
                      {track.subtitle[locale]}
                    </p>
                    <div className={`inline-block text-xs px-3 py-1 rounded-full ${track.iconColor} bg-white/5 border border-white/10 font-medium mb-3`}>
                      {track.stats[locale]}
                    </div>
                    <p className="text-text-tertiary text-xs leading-relaxed" style={bf}>
                      {track.topics[locale]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-gold-primary/70 group-hover:text-gold-primary transition-colors">
                    <span className="text-sm font-medium">{locale === 'en' ? 'Explore Track' : 'ट्रैक देखें'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Interactive Labs ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
            &#9881;
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gold-gradient" style={hf}>{l.labsTitle}</h2>
            <p className="text-text-secondary text-sm" style={bf}>{l.labsSub}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {LABS.map(lab => (
            <Link key={lab.href} href={lab.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10 hover:border-gold-primary/30 transition-all group text-center">
              <h3 className="text-gold-light font-bold text-sm mb-1 group-hover:text-gold-primary" style={bf}>{lab.title[locale]}</h3>
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
                    {locale === 'en' ? 'Free Resource' : locale === 'hi' ? 'निःशुल्क संसाधन' : 'निःशुल्कसाधनम्'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">28 texts</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200 group-hover:text-amber-100 transition-colors mb-1" style={hf}>
                  {locale === 'en' ? 'Classical Jyotish Text Library' : locale === 'hi' ? 'शास्त्रीय ज्योतिष ग्रंथागार' : 'शास्त्रीयज्योतिषग्रंथागारम्'}
                </h3>
                <p className="text-amber-200/55 text-sm leading-relaxed" style={bf}>
                  {locale === 'en'
                    ? 'Parashara · Varahamihira · Jaimini · Krishnamurti · Surya Siddhanta — all free via archive.org'
                    : locale === 'hi'
                    ? 'पाराशर · वराहमिहिर · जैमिनी · कृष्णमूर्ति · सूर्य सिद्धान्त — archive.org पर निःशुल्क'
                    : 'पाराशरः · वराहमिहिरः · जैमिनिः · कृष्णमूर्तिः — archive.org इत्यत्र निःशुल्काः'}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-amber-400/70 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-semibold hidden sm:inline">
                  {locale === 'en' ? 'Browse Library' : locale === 'hi' ? 'ग्रंथागार देखें' : 'ग्रंथागारं पश्यतु'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ── Reference Library (grouped by track) ── */}
      <div>
        <h2 className="text-2xl font-bold text-gold-gradient mb-2" style={hf}>{l.refTitle}</h2>
        <p className="text-text-secondary text-sm mb-6" style={bf}>{l.refSub}</p>
        <div className="space-y-6">
          {REF_GROUPS.map(group => (
            <div key={group.label.en}>
              <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3" style={bf}>{group.label[locale]}</h3>
              <div className="flex flex-wrap gap-2">
                {group.refs.map(ref => (
                  <Link key={ref.href} href={ref.href}
                    className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
                    style={bf}>
                    {ref.name[locale]}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
