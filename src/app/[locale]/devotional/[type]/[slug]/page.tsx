'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, BookOpen, Languages, MessageCircle, Share2, Clock, Star, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import type { DevotionalType } from '@/lib/content/devotional-content';
import {
  getDevotionalItemL10n,
  DEVOTIONAL_ITEMS_L10N,
  TYPE_LABELS_L10N,
  DAY_NAMES_L10N,
  pickLoc,
} from '@/lib/content/devotional-locale-overlay';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

type TabKey = 'devanagari' | 'transliteration' | 'meaning';

/**
 * Page-chrome labels per locale. Devanagari script content (devanagari
 * tab, transliteration tab body, sacred mantra text) intentionally
 * stays as-is for every locale — only the chrome surrounding it gets
 * localised.
 */
const LABELS: Record<string, {
  breadcrumb: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
  bestDay: string;
  share: string;
  significance: string;
  morePrayers: (deity: string) => string;
  back: string;
  notFound: string;
  backToList: string;
}> = {
  en: {
    breadcrumb: 'Devotional',
    devanagari: 'Devanagari', transliteration: 'Transliteration', meaning: 'Meaning',
    bestDay: 'Best day: ',
    share: 'Share',
    significance: 'Significance & When to Recite',
    morePrayers: (d) => `More ${d} Prayers`,
    back: 'Back to Devotional',
    notFound: 'Content not found.',
    backToList: 'Browse All Devotional Content',
  },
  hi: {
    breadcrumb: 'भक्ति',
    devanagari: 'देवनागरी', transliteration: 'लिप्यंतरण', meaning: 'अर्थ',
    bestDay: 'सर्वोत्तम दिन: ',
    share: 'शेयर करें',
    significance: 'महत्व और पाठ विधि',
    morePrayers: (d) => `${d} के अन्य पाठ`,
    back: 'वापस जाएँ',
    notFound: 'सामग्री नहीं मिली।',
    backToList: 'सम्पूर्ण भक्ति संग्रह',
  },
  sa: {
    breadcrumb: 'भक्तिः',
    devanagari: 'देवनागरी', transliteration: 'लिप्यन्तरणम्', meaning: 'अर्थः',
    bestDay: 'श्रेष्ठदिनम्: ',
    share: 'विभजतु',
    significance: 'महत्त्वं पाठविधिश्च',
    morePrayers: (d) => `${d}स्य अन्ये पाठाः`,
    back: 'प्रतिगच्छतु',
    notFound: 'सामग्री न प्राप्ता।',
    backToList: 'समस्तं भक्तिसंग्रहम्',
  },
  mai: {
    breadcrumb: 'भक्ति',
    devanagari: 'देवनागरी', transliteration: 'लिप्यंतरण', meaning: 'अर्थ',
    bestDay: 'सर्वोत्तम दिन: ',
    share: 'शेयर करू',
    significance: 'महत्व आ पाठ विधि',
    morePrayers: (d) => `${d} क आन पाठ`,
    back: 'वापस जाउ',
    notFound: 'सामग्री नहि भेटल।',
    backToList: 'सम्पूर्ण भक्ति संग्रह',
  },
  mr: {
    breadcrumb: 'भक्ती',
    devanagari: 'देवनागरी', transliteration: 'लिप्यंतर', meaning: 'अर्थ',
    bestDay: 'सर्वोत्तम दिवस: ',
    share: 'शेअर करा',
    significance: 'महत्त्व आणि पठण विधि',
    morePrayers: (d) => `${d} ची इतर प्रार्थना`,
    back: 'मागे जा',
    notFound: 'सामग्री सापडली नाही.',
    backToList: 'संपूर्ण भक्ती संग्रह',
  },
  ta: {
    breadcrumb: 'பக்தி',
    devanagari: 'தேவநாகரி', transliteration: 'ஒலி பெயர்ப்பு', meaning: 'பொருள்',
    bestDay: 'சிறந்த நாள்: ',
    share: 'பகிர்',
    significance: 'முக்கியத்துவம் & எப்போது ஓத வேண்டும்',
    morePrayers: (d) => `மேலும் ${d} பிரார்த்தனைகள்`,
    back: 'பக்திக்குத் திரும்பு',
    notFound: 'உள்ளடக்கம் கிடைக்கவில்லை.',
    backToList: 'அனைத்து பக்தி உள்ளடக்கங்களையும் காண்க',
  },
  te: {
    breadcrumb: 'భక్తి',
    devanagari: 'దేవనాగరి', transliteration: 'లిప్యంతరం', meaning: 'అర్థం',
    bestDay: 'ఉత్తమ దినం: ',
    share: 'భాగస్వామ్యం చేయండి',
    significance: 'ప్రాముఖ్యత మరియు పఠన విధానం',
    morePrayers: (d) => `మరిన్ని ${d} ప్రార్థనలు`,
    back: 'భక్తికి తిరిగి వెళ్ళు',
    notFound: 'కంటెంట్ కనుగొనబడలేదు.',
    backToList: 'మొత్తం భక్తి సంగ్రహాన్ని చూడండి',
  },
  kn: {
    breadcrumb: 'ಭಕ್ತಿ',
    devanagari: 'ದೇವನಾಗರಿ', transliteration: 'ಲಿಪ್ಯಂತರ', meaning: 'ಅರ್ಥ',
    bestDay: 'ಉತ್ತಮ ದಿನ: ',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    significance: 'ಮಹತ್ವ ಮತ್ತು ಪಠಣ ವಿಧಾನ',
    morePrayers: (d) => `ಇನ್ನಷ್ಟು ${d} ಪ್ರಾರ್ಥನೆಗಳು`,
    back: 'ಭಕ್ತಿಗೆ ಹಿಂತಿರುಗಿ',
    notFound: 'ವಿಷಯ ಸಿಗಲಿಲ್ಲ.',
    backToList: 'ಸಂಪೂರ್ಣ ಭಕ್ತಿ ಸಂಗ್ರಹವನ್ನು ನೋಡಿ',
  },
  gu: {
    breadcrumb: 'ભક્તિ',
    devanagari: 'દેવનાગરી', transliteration: 'લિપ્યંતર', meaning: 'અર્થ',
    bestDay: 'શ્રેષ્ઠ દિવસ: ',
    share: 'શેર કરો',
    significance: 'મહત્ત્વ અને પાઠ વિધિ',
    morePrayers: (d) => `વધુ ${d} પ્રાર્થનાઓ`,
    back: 'ભક્તિ પર પાછા જાઓ',
    notFound: 'સામગ્રી મળી નથી.',
    backToList: 'સંપૂર્ણ ભક્તિ સંગ્રહ જુઓ',
  },
  bn: {
    breadcrumb: 'ভক্তি',
    devanagari: 'দেবনাগরী', transliteration: 'লিপ্যন্তর', meaning: 'অর্থ',
    bestDay: 'সেরা দিন: ',
    share: 'শেয়ার করুন',
    significance: 'গুরুত্ব ও পাঠের নিয়ম',
    morePrayers: (d) => `আরও ${d} প্রার্থনা`,
    back: 'ভক্তিতে ফিরে যান',
    notFound: 'বিষয়বস্তু পাওয়া যায়নি।',
    backToList: 'সম্পূর্ণ ভক্তি সংগ্রহ দেখুন',
  },
};

export default function DevotionalItemPage() {
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  void router;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;
  const L = LABELS[locale] ?? LABELS.en;

  const type = params.type as DevotionalType;
  const slug = params.slug as string;

  const item = useMemo(() => getDevotionalItemL10n(type, slug), [type, slug]);
  const relatedItems = useMemo(() => {
    if (!item) return [];
    return DEVOTIONAL_ITEMS_L10N.filter(
      (r) => r.deity.toLowerCase().includes(item.deity.toLowerCase()) && r.slug !== item.slug,
    );
  }, [item]);

  const [activeTab, setActiveTab] = useState<TabKey>('devanagari');

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary text-lg">{L.notFound}</p>
        <Link
          href="/devotional"
          className="text-gold-primary hover:text-gold-light mt-4 inline-block"
        >
          &larr; {L.back}
        </Link>
      </div>
    );
  }

  const title = pickLoc(item.titleLoc, locale);
  const typeName = pickLoc(TYPE_LABELS_L10N[type], locale);
  // The "Meaning" tab body is the SEO-meaningful prose paragraph.
  // Devanagari + transliteration stay as-is across locales (sacred text).
  const meaningBody = pickLoc(item.meaningLoc, locale);
  const significanceBody = pickLoc(item.significanceLoc, locale);

  const tabContent: Record<TabKey, string> = {
    devanagari: item.devanagari,
    transliteration: item.transliteration,
    meaning: meaningBody,
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `${item.title.en}  –  ${typeName}`;
    if (navigator.share) {
      navigator.share({ title: text, url }).catch(() => {
        // User cancelled  –  not an error
      });
    } else {
      // Fallback: open WhatsApp share
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 flex-wrap">
        <Link
          href="/devotional"
          className="hover:text-gold-primary transition-colors"
        >
          {L.breadcrumb}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/devotional?type=${type}`}
          className="hover:text-gold-primary transition-colors"
        >
          {typeName}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gold-light">{title}</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block px-3 py-1 rounded-full bg-gold-primary/10 text-gold-primary text-xs font-bold uppercase tracking-wider mb-3">
          {typeName} &middot; {item.deity}
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
          style={headingFont}
        >
          <span className="text-gold-gradient">{title}</span>
        </h1>

        {/* Best time to recite */}
        {item.deityDay !== undefined && (
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm mt-2">
            <Clock className="w-4 h-4 text-gold-dark" />
            <span>
              {L.bestDay}
              <span className="text-gold-light font-semibold">
                {pickLoc(DAY_NAMES_L10N[item.deityDay], locale)}
              </span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-primary/10 text-gold-primary hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          {L.share}
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl bg-bg-secondary/80 border border-gold-primary/10 p-1 gap-1">
          {(['devanagari', 'transliteration', 'meaning'] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gold-primary/20 text-gold-light shadow-sm'
                  : 'text-text-secondary hover:text-gold-primary hover:bg-gold-primary/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab === 'devanagari' && (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                {tab === 'transliteration' && (
                  <Languages className="w-3.5 h-3.5" />
                )}
                {tab === 'meaning' && (
                  <MessageCircle className="w-3.5 h-3.5" />
                )}
                {L[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content card */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 mb-8"
      >
        <div
          className={`whitespace-pre-wrap leading-relaxed ${
            activeTab === 'devanagari'
              ? 'text-gold-primary text-lg sm:text-xl'
              : activeTab === 'transliteration'
              ? 'text-text-primary text-base sm:text-lg italic'
              : 'text-text-secondary text-base sm:text-lg'
          }`}
          style={
            activeTab === 'devanagari'
              ? { fontFamily: 'var(--font-devanagari-body)' }
              : undefined
          }
        >
          {tabContent[activeTab]}
        </div>
      </motion.div>

      <GoldDivider />

      {/* Significance section */}
      <div className="my-8">
        <h2
          className="text-2xl font-bold text-gold-light mb-4 flex items-center gap-2"
          style={headingFont}
        >
          <Star className="w-5 h-5 text-gold-primary" />
          {L.significance}
        </h2>
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <p
            className="text-text-secondary leading-relaxed"
            style={bodyFont}
          >
            {significanceBody}
          </p>
        </div>
      </div>

      {/* Related items */}
      {relatedItems.length > 0 && (
        <div className="my-8">
          <h2
            className="text-2xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.morePrayers(item.deity)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedItems.slice(0, 6).map((rel) => (
              <Link
                key={`${rel.type}-${rel.slug}`}
                href={`/devotional/${rel.type}/${rel.slug}`}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 p-4 transition-colors group"
              >
                <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-1">
                  {pickLoc(TYPE_LABELS_L10N[rel.type], locale)}
                </div>
                <div
                  className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                  style={headingFont}
                >
                  {pickLoc(rel.titleLoc, locale)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10 text-center">
        <Link
          href="/devotional"
          className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {L.backToList}
        </Link>
      </div>
    </div>
  );
}
