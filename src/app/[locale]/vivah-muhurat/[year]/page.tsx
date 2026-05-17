/**
 * Shubh Vivah Muhurat [year]  –  Server Component (shell) + Client Island (data)
 *
 * The server renders the SEO-rich static content (headings, restriction explanations,
 * cross-links, FAQs). The actual date scanning happens in the client island which
 * calls /api/muhurta-scan. This avoids running the heavy unifiedScan() during the
 * build, which causes OOM on the build worker.
 *
 * The static content is what Google indexes. The client island hydrates with real data.
 */

import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { Calendar, Sparkles, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import VivahClient from './VivahClient';

// Only allow 2026 and 2027
const VALID_YEARS = [2026, 2027];

// ─── Labels ──────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  title: {
    en: 'Shubh Vivah Muhurat',
    hi: 'शुभ विवाह मुहूर्त',
    ta: 'சுப விவாஹ முகூர்த்தம்',
    bn: 'শুভ বিবাহ মুহূর্ত',
  },
  subtitle: {
    en: 'Auspicious Hindu Marriage Dates',
    hi: 'शुभ हिन्दू विवाह तिथियाँ',
    ta: 'சுப இந்து திருமண நாட்கள்',
    bn: 'শুভ হিন্দু বিবাহ তারিখ',
  },
  restrictionsTitle: {
    en: 'Restricted Periods',
    hi: 'निषिद्ध काल',
    ta: 'தடைக்காலங்கள்',
    bn: 'নিষিদ্ধ কাল',
  },
  chaturmasNote: {
    en: 'Chaturmas (Devshayani to Prabodhini Ekadashi)  –  marriages traditionally avoided during this four-month period per Dharmasindhu.',
    hi: 'चातुर्मास (देवशयनी से प्रबोधिनी एकादशी)  –  धर्मसिन्धु के अनुसार इस चार मास के काल में विवाह वर्जित।',
    ta: 'சாதுர்மாஸ் (தேவசயனி முதல் பிரபோதினி ஏகாதசி வரை)  –  இந்த நான்கு மாத காலத்தில் திருமணம் தவிர்க்கப்படும்.',
    bn: 'চাতুর্মাস (দেবশয়নী থেকে প্রবোধিনী একাদশী)  –  এই চার মাসে বিবাহ নিষিদ্ধ।',
  },
  combustionNote: {
    en: 'Venus or Jupiter combustion  –  when either benefic is too close to the Sun, marriages are prohibited per Muhurta Chintamani.',
    hi: 'शुक्र या गुरु अस्त  –  जब कोई भी शुभ ग्रह सूर्य के अत्यधिक निकट हो, मुहूर्त चिन्तामणि के अनुसार विवाह वर्जित।',
    ta: 'சுக்ர அல்லது குரு அஸ்தம்  –  முகூர்த்த சிந்தாமணி படி திருமணம் தடை.',
    bn: 'শুক্র বা গুরু অস্ত  –  মুহূর্ত চিন্তামণি অনুসারে বিবাহ নিষিদ্ধ।',
  },
  kharmasNote: {
    en: 'Kharmas (Sun in Sagittarius)  –  inauspicious solar month for new beginnings per classical texts.',
    hi: 'खरमास (सूर्य धनु राशि में)  –  शास्त्रीय ग्रन्थों के अनुसार नए कार्यों के लिए अशुभ सौर मास।',
    ta: 'கர்மாஸ் (சூரியன் தனுசு ராசியில்)  –  புதிய தொடக்கங்களுக்கு அசுப சூரிய மாதம்.',
    bn: 'খরমাস (সূর্য ধনু রাশিতে)  –  নতুন কাজের জন্য অশুভ সৌর মাস।',
  },
  crossLinkMuhurtaAi: {
    en: 'Find personalised muhurta with birth data',
    hi: 'जन्म डेटा से व्यक्तिगत मुहूर्त खोजें',
    ta: 'பிறப்பு தரவுடன் தனிப்பயன் முகூர்த்தம் கண்டறியுங்கள்',
    bn: 'জন্ম তথ্যের সাথে ব্যক্তিগত মুহূর্ত খুঁজুন',
  },
  crossLinkMatching: {
    en: 'Check Kundali matching for compatibility',
    hi: 'कुण्डली मिलान से अनुकूलता जाँचें',
    ta: 'குண்டலி பொருத்தம் சரிபார்க்கவும்',
    bn: 'কুণ্ডলী মিলান পরীক্ষা করুন',
  },
  crossLinkLearn: {
    en: 'Learn classical rules of Vivah Muhurta',
    hi: 'विवाह मुहूर्त के शास्त्रीय नियम सीखें',
    ta: 'விவாஹ முகூர்த்தத்தின் சாஸ்திரீய விதிகளை அறியுங்கள்',
    bn: 'বিবাহ মুহূর্তের শাস্ত্রীয় নিয়ম শিখুন',
  },
  classicalBasis: {
    en: 'Computed using 36 classical rules from Muhurta Chintamani, Dharmasindhu, and BPHS. Scores above 50 indicate auspicious windows.',
    hi: 'मुहूर्त चिन्तामणि, धर्मसिन्धु और BPHS से 36 शास्त्रीय नियमों द्वारा गणना। 50 से अधिक अंक शुभ मुहूर्त दर्शाते हैं।',
    ta: 'முகூர்த்த சிந்தாமணி, தர்மசிந்து மற்றும் BPHS இலிருந்து 36 சாஸ்திரீய விதிகளால் கணக்கிடப்பட்டது.',
    bn: 'মুহূর্ত চিন্তামণি, ধর্মসিন্ধু এবং BPHS থেকে 36 শাস্ত্রীয় নিয়মে গণনা করা হয়েছে।',
  },
  seoIntro: {
    en: 'Looking for the most auspicious date for a Hindu wedding? This page lists every Shubh Vivah Muhurat  –  computed from classical Jyotish texts using a 36-rule scoring engine that evaluates Panchanga Shuddhi (tithi, nakshatra, yoga, karana, vara), planetary positions, lagna strength, and special yogas. Each date shows its score, the best 2-hour lagna window, and the active nakshatra and tithi. Dates during Venus/Jupiter combustion, Chaturmas, and Kharmas are automatically excluded.',
    hi: 'हिन्दू विवाह के लिए सबसे शुभ तिथि खोज रहे हैं? यह पृष्ठ प्रत्येक शुभ विवाह मुहूर्त प्रदर्शित करता है  –  36-नियम स्कोरिंग इंजन से गणना जो पंचांग शुद्धि (तिथि, नक्षत्र, योग, करण, वार), ग्रह स्थिति, लग्न बल और विशेष योगों का मूल्यांकन करता है। प्रत्येक तिथि का अंक, सर्वोत्तम 2 घंटे की लग्न खिड़की, और सक्रिय नक्षत्र व तिथि दिखाई गई है।',
    ta: 'இந்து திருமணத்திற்கான மிகவும் சுபமான நாளை தேடுகிறீர்களா? இந்தப் பக்கம் ஒவ்வொரு சுப விவாஹ முகூர்த்தத்தையும் பட்டியலிடுகிறது.',
    bn: 'হিন্দু বিবাহের জন্য সবচেয়ে শুভ তারিখ খুঁজছেন? এই পৃষ্ঠাটি প্রতিটি শুভ বিবাহ মুহূর্ত প্রদর্শন করে।',
  },
};

function t(key: string, locale: string): string {
  return LABELS[key]?.[locale] ?? LABELS[key]?.en ?? key;
}

export default async function VivahMuhuratPage({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year: yearStr } = await params;
  setRequestLocale(locale);
  const year = parseInt(yearStr, 10);

  if (!VALID_YEARS.includes(year)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b69]/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-gold-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-gold-primary" />
            <span className="text-sm font-medium text-gold-light">{year}</span>
          </div>
          <h1
            className="text-3xl font-bold text-gold-light md:text-5xl"
            style={{ fontFamily: locale === 'hi' ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
          >
            {t('title', locale)} {year}
          </h1>
          <p className="mt-3 text-lg text-text-secondary md:text-xl">
            {t('subtitle', locale)}
          </p>
          <p className="mt-4 text-sm text-text-secondary/70">
            {t('classicalBasis', locale)}
          </p>
        </div>
      </section>

      {/* SEO introductory paragraph (visible to Google) */}
      <section className="mx-auto max-w-5xl px-4">
        <p className="mb-4 text-text-secondary leading-relaxed">
          {t('seoIntro', locale)}
        </p>
        <p className="mb-8 text-text-secondary text-sm leading-relaxed">
          {locale === 'hi'
            ? 'विवाह मुहूर्त चयन फलित ज्योतिष का सबसे कठोर अनुप्रयोग है। यह सिद्धान्तिक खगोल विज्ञान (सटीक ग्रह स्थितियाँ, सौर मास सीमाएँ, अस्त गणना) को मुहूर्त चिन्तामणि और धर्मसिन्धु के शास्त्रीय व्याख्यात्मक नियमों के साथ संयोजित करता है। यह अन्धविश्वास नहीं है — यह एक व्यवस्थित ढाँचा है जहाँ प्रत्येक नियम का खगोलीय आधार है: शुक्र अस्त का अर्थ है प्रेम का ग्रह अदृश्य है, चातुर्मास मानसून से मेल खाता है जब यात्रा असम्भव थी, और 11 शुभ नक्षत्र उनके प्रमाणित स्थिरता गुणों के लिए चुने गए हैं।'
            : 'Marriage muhurta selection is the most rigorous application of Phalit Jyotish. It combines Siddhantic astronomy (exact planetary positions, solar month boundaries, combustion calculations) with classical interpretive rules from the Muhurta Chintamani and Dharmasindhu. The result is not superstition — it is a systematic framework where every rule has an astronomical basis: Venus combustion means the planet of love is invisible, Chaturmas coincides with the monsoon when travel was impossible, and the 11 auspicious nakshatras are selected for their demonstrated stability characteristics.'}
        </p>
      </section>

      {/* Restriction Notices */}
      <section className="mx-auto max-w-5xl px-4">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gold-light">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          {t('restrictionsTitle', locale)}
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4">
            <span className="mb-1 inline-block rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
              {locale === 'hi' ? 'शुक्र/गुरु अस्त' : 'Venus/Jupiter Combustion'}
            </span>
            <p className="mt-2 text-sm text-text-secondary">{t('combustionNote', locale)}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4">
            <span className="mb-1 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
              {locale === 'hi' ? 'चातुर्मास' : 'Chaturmas'}
            </span>
            <p className="mt-2 text-sm text-text-secondary">{t('chaturmasNote', locale)}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4">
            <span className="mb-1 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
              {locale === 'hi' ? 'खरमास' : 'Kharmas'}
            </span>
            <p className="mt-2 text-sm text-text-secondary">{t('kharmasNote', locale)}</p>
          </div>
        </div>
      </section>

      {/* Client island  –  handles scanning, month-by-month display, location selector */}
      <section className="mx-auto mt-10 max-w-5xl px-4">
        <VivahClient year={year} locale={locale} />
      </section>

      {/* Cross-links */}
      <section className="mx-auto mt-12 max-w-5xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/muhurta-ai"
            className="group flex items-center gap-3 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 transition-colors hover:border-gold-primary/40"
          >
            <Calendar className="h-6 w-6 text-gold-primary" />
            <div className="flex-1">
              <p className="font-medium text-gold-light">{locale === 'hi' ? 'मुहूर्त AI' : 'Muhurta AI'}</p>
              <p className="text-sm text-text-secondary">{t('crossLinkMuhurtaAi', locale)}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gold-primary/60 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/matching"
            className="group flex items-center gap-3 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 transition-colors hover:border-gold-primary/40"
          >
            <Sparkles className="h-6 w-6 text-gold-primary" />
            <div className="flex-1">
              <p className="font-medium text-gold-light">{locale === 'hi' ? 'कुण्डली मिलान' : 'Kundali Matching'}</p>
              <p className="text-sm text-text-secondary">{t('crossLinkMatching', locale)}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gold-primary/60 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/learn/vivah-muhurta"
            className="group flex items-center gap-3 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 transition-colors hover:border-gold-primary/40"
          >
            <Info className="h-6 w-6 text-gold-primary" />
            <div className="flex-1">
              <p className="font-medium text-gold-light">{locale === 'hi' ? 'विवाह मुहूर्त सीखें' : 'Learn Vivah Muhurta'}</p>
              <p className="text-sm text-text-secondary">{t('crossLinkLearn', locale)}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gold-primary/60 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Link to the other year */}
        <div className="mt-6 text-center">
          <Link
            href={`/vivah-muhurat/${year === 2026 ? 2027 : 2026}`}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-gold-primary/10 px-5 py-2 text-sm font-medium text-gold-light transition-colors hover:bg-gold-primary/20"
          >
            <Calendar className="h-4 w-4" />
            {locale === 'hi'
              ? `शुभ विवाह मुहूर्त ${year === 2026 ? 2027 : 2026} देखें`
              : `View Vivah Muhurat ${year === 2026 ? 2027 : 2026}`}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
