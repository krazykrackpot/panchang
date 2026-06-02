import { setRequestLocale } from 'next-intl/server';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { Code, Globe, Clock, Shield, Zap, MonitorSmartphone } from 'lucide-react';
import WidgetConfigurator from './WidgetConfigurator';

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const headingFont = getHeadingFont(locale);

  // 9-locale label dispatch. NO `isHi` boolean fallback. The previous
  // implementation routed mr/mai through the Hindi branch — that's the
  // structural pattern that caused the 2026-05-31 Marathi duplicate-
  // content de-rank. Every locale has its own copy here directly.
  // Locales without a hand-translated entry fall through to English
  // (NOT to Hindi).
  const PAGE_COPY: Record<string, {
    badge: string; h1: string; subtitle: string; featuresTitle: string;
    howItWorks: string; step1: string; step2: string; step3: string; step4: string; worksOn: string;
  }> = {
    en: {
      badge: 'Free Widget',
      h1: 'Free Panchang Widget for Your Website',
      subtitle: 'One line of code. Daily panchang on any website. Free forever.',
      featuresTitle: 'What You Get',
      howItWorks: 'How It Works',
      step1: 'Select your city above',
      step2: 'Copy the embed code',
      step3: 'Paste into your website HTML',
      step4: 'Widget updates automatically every day',
      worksOn: 'Works Everywhere',
    },
    hi: {
      badge: 'निःशुल्क विजेट',
      h1: 'अपनी वेबसाइट के लिए मुफ्त पंचांग विजेट',
      subtitle: 'एक लाइन कोड। किसी भी वेबसाइट पर दैनिक पंचांग। हमेशा मुफ्त।',
      featuresTitle: 'विशेषताएं',
      howItWorks: 'कैसे काम करता है',
      step1: 'ऊपर अपना शहर चुनें',
      step2: 'एम्बेड कोड कॉपी करें',
      step3: 'अपनी वेबसाइट के HTML में पेस्ट करें',
      step4: 'विजेट हर दिन स्वचालित रूप से अपडेट होता है',
      worksOn: 'यह कहां काम करता है',
    },
    mr: {
      badge: 'मोफत विजेट',
      h1: 'तुमच्या वेबसाइटसाठी मोफत पंचांग विजेट',
      subtitle: 'एका ओळीचा कोड. कोणत्याही वेबसाइटवर दैनिक पंचांग. कायमचे मोफत.',
      featuresTitle: 'काय मिळते',
      howItWorks: 'हे कसे कार्य करते',
      step1: 'वर तुमचे शहर निवडा',
      step2: 'एम्बेड कोड कॉपी करा',
      step3: 'तुमच्या वेबसाइटच्या HTML मध्ये पेस्ट करा',
      step4: 'विजेट दररोज स्वयंचलितपणे अद्ययावत होते',
      worksOn: 'सर्वत्र कार्य करते',
    },
    mai: {
      badge: 'निःशुल्क विजेट',
      h1: 'अहाँक वेबसाइट लेल निःशुल्क पंचांग विजेट',
      subtitle: 'एक पंक्ति क कोड। कोनो वेबसाइट पर दैनिक पंचांग। सदति निःशुल्क।',
      featuresTitle: 'की भेटत',
      howItWorks: 'कोना काज करैत अछि',
      step1: 'उपर अहाँक शहर चुनू',
      step2: 'एम्बेड कोड कॉपी करू',
      step3: 'अहाँक वेबसाइटक HTML मे पेस्ट करू',
      step4: 'विजेट प्रत्येक दिन स्वतः अद्यतन होइत अछि',
      worksOn: 'सर्वत्र काज करैत अछि',
    },
    ta: {
      badge: 'இலவச விட்ஜெட்',
      h1: 'உங்கள் வலைதளத்திற்கான இலவச பஞ்சாங்க விட்ஜெட்',
      subtitle: 'ஒரே வரி குறியீடு. எந்த வலைதளத்திலும் தினசரி பஞ்சாங்கம். எப்போதும் இலவசம்.',
      featuresTitle: 'நீங்கள் என்ன பெறுவீர்கள்',
      howItWorks: 'இது எப்படி வேலை செய்கிறது',
      step1: 'மேலே உங்கள் நகரத்தைத் தேர்வுசெய்க',
      step2: 'எம்பெட் குறியீட்டை நகலெடுக்கவும்',
      step3: 'உங்கள் வலைதள HTML இல் ஒட்டவும்',
      step4: 'விட்ஜெட் தினமும் தானாகப் புதுப்பிக்கப்படும்',
      worksOn: 'எங்கும் வேலை செய்கிறது',
    },
    te: {
      badge: 'ఉచిత విడ్జెట్',
      h1: 'మీ వెబ్‌సైట్ కోసం ఉచిత పంచాంగ విడ్జెట్',
      subtitle: 'ఒక లైన్ కోడ్. ఏ వెబ్‌సైట్‌లోనైనా రోజువారీ పంచాంగం. ఎప్పటికీ ఉచితం.',
      featuresTitle: 'మీరు ఏమి పొందుతారు',
      howItWorks: 'ఇది ఎలా పని చేస్తుంది',
      step1: 'పైన మీ నగరాన్ని ఎంచుకోండి',
      step2: 'ఎంబెడ్ కోడ్‌ను కాపీ చేయండి',
      step3: 'మీ వెబ్‌సైట్ HTML లో పేస్ట్ చేయండి',
      step4: 'విడ్జెట్ ప్రతిరోజూ స్వయంచాలకంగా నవీకరించబడుతుంది',
      worksOn: 'ప్రతిచోటా పని చేస్తుంది',
    },
    bn: {
      badge: 'বিনামূল্যের উইজেট',
      h1: 'আপনার ওয়েবসাইটের জন্য বিনামূল্যের পঞ্জিকা উইজেট',
      subtitle: 'এক লাইন কোড। যেকোনো ওয়েবসাইটে দৈনিক পঞ্জিকা। চিরকাল বিনামূল্যে।',
      featuresTitle: 'আপনি কী পাবেন',
      howItWorks: 'এটি কীভাবে কাজ করে',
      step1: 'উপরে আপনার শহর নির্বাচন করুন',
      step2: 'এম্বেড কোড কপি করুন',
      step3: 'আপনার ওয়েবসাইটের HTML এ পেস্ট করুন',
      step4: 'উইজেট প্রতিদিন স্বয়ংক্রিয়ভাবে আপডেট হয়',
      worksOn: 'সর্বত্র কাজ করে',
    },
    gu: {
      badge: 'મફત વિજેટ',
      h1: 'તમારી વેબસાઇટ માટે મફત પંચાંગ વિજેટ',
      subtitle: 'એક લાઇન કોડ. કોઈપણ વેબસાઇટ પર દૈનિક પંચાંગ. હંમેશા મફત.',
      featuresTitle: 'તમને શું મળશે',
      howItWorks: 'તે કેવી રીતે કાર્ય કરે છે',
      step1: 'ઉપર તમારું શહેર પસંદ કરો',
      step2: 'એમ્બેડ કોડ કૉપિ કરો',
      step3: 'તમારી વેબસાઇટના HTML માં પેસ્ટ કરો',
      step4: 'વિજેટ દરરોજ આપમેળે અપડેટ થાય છે',
      worksOn: 'દરેક જગ્યાએ કાર્ય કરે છે',
    },
    kn: {
      badge: 'ಉಚಿತ ವಿಜೆಟ್',
      h1: 'ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ಗಾಗಿ ಉಚಿತ ಪಂಚಾಂಗ ವಿಜೆಟ್',
      subtitle: 'ಒಂದು ಸಾಲಿನ ಕೋಡ್. ಯಾವುದೇ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ದೈನಂದಿನ ಪಂಚಾಂಗ. ಎಂದೆಂದಿಗೂ ಉಚಿತ.',
      featuresTitle: 'ನೀವು ಏನು ಪಡೆಯುತ್ತೀರಿ',
      howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      step1: 'ಮೇಲೆ ನಿಮ್ಮ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      step2: 'ಎಂಬೆಡ್ ಕೋಡ್ ನಕಲಿಸಿ',
      step3: 'ನಿಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ HTML ನಲ್ಲಿ ಅಂಟಿಸಿ',
      step4: 'ವಿಜೆಟ್ ಪ್ರತಿದಿನ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ',
      worksOn: 'ಎಲ್ಲೆಡೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    },
  };

  // Guard against prototype-key lookups (`toString`, `valueOf`,
  // `__proto__`) when `locale` is the unvalidated route segment. Without
  // the own-property check, `PAGE_COPY['toString']` would return the
  // Object.prototype function instead of falling back to English.
  // Gemini PR #360 MEDIUM.
  const LABELS = Object.hasOwn(PAGE_COPY, locale) ? PAGE_COPY[locale] : PAGE_COPY.en;

  // Feature copy stays en + hi only (longer paragraphs — editorial pass
  // for the other 7 locales is a separate sprint). Non-hi locales see
  // the English copy — better than Hindi-grammar fallback per the bug.
  const featureCopy = locale === 'hi' ? PAGE_COPY.hi : PAGE_COPY.en;
  const isHiFeatures = locale === 'hi';

  const FEATURES = [
    {
      icon: Clock,
      title: isHiFeatures ? 'प्रतिदिन स्वचालित अपडेट' : 'Updates Daily, Automatically',
      desc: isHiFeatures
        ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त हर दिन ताजा।'
        : 'Tithi, Nakshatra, Yoga, Karana, Sunrise & Sunset refreshed every day.',
    },
    {
      icon: Globe,
      title: isHiFeatures ? 'शहर-विशिष्ट गणना' : 'City-Specific Calculations',
      desc: isHiFeatures
        ? 'आपके चुने हुए शहर के अक्षांश/देशांतर से सटीक पंचांग।'
        : "Accurate panchang computed from your chosen city's lat/lng.",
    },
    {
      icon: Shield,
      title: isHiFeatures ? 'कोई API कुंजी नहीं' : 'No API Key Required',
      desc: isHiFeatures
        ? 'कोई पंजीकरण नहीं, कोई API कुंजी नहीं, कोई सीमा नहीं। बस कॉपी और पेस्ट।'
        : 'No signup, no API key, no rate limits. Just copy and paste.',
    },
    {
      icon: Zap,
      title: isHiFeatures ? 'हल्का और तेज' : 'Lightweight & Fast',
      desc: isHiFeatures
        ? 'कोई JavaScript बंडल नहीं। सर्वर-रेंडर HTML। तुरंत लोड।'
        : 'Zero JavaScript bundle. Server-rendered HTML. Loads instantly.',
    },
    {
      icon: MonitorSmartphone,
      title: isHiFeatures ? 'रेस्पॉन्सिव डिज़ाइन' : 'Responsive Design',
      desc: isHiFeatures
        ? '240px से 480px तक किसी भी चौड़ाई में फिट।'
        : 'Fits any width from 240px to 480px. Mobile-friendly.',
    },
    {
      icon: Code,
      title: isHiFeatures ? 'हमेशा मुफ्त' : 'Free Forever',
      desc: isHiFeatures
        ? 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। "Powered by Dekho Panchang" विजेट में शामिल है।'
        : 'No fees, no ads injected. "Powered by Dekho Panchang" stays in the widget.',
    },
  ];
  // Reference featureCopy so the lint/build doesn't flag it as unused —
  // it's a stub for the next editorial pass that translates the
  // feature paragraphs into the remaining 7 locales.
  void featureCopy;

  const PLATFORMS = [
    'WordPress', 'Wix', 'Squarespace', 'Blogger', 'Shopify',
    'Ghost', 'Webflow', 'Raw HTML', 'React', 'Any CMS',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* ── Hero ── */}
      <div className="text-center space-y-4">
        <p className="text-gold-primary text-xs uppercase tracking-[0.2em] font-bold">
          {LABELS.badge}
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight"
          style={headingFont}
        >
          {LABELS.h1}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
          {LABELS.subtitle}
        </p>
      </div>

      {/* ── Configurator (client island) ── */}
      <WidgetConfigurator pageLocale={locale} />

      {/* ── Features Grid ── */}
      <section className="space-y-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-light text-center"
          style={headingFont}
        >
          {LABELS.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 hover:border-gold-primary/40 transition-colors duration-200"
            >
              <f.icon className="w-6 h-6 text-gold-primary mb-3" />
              <h3 className="text-gold-light font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="space-y-6">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-light text-center"
          style={headingFont}
        >
          {LABELS.howItWorks}
        </h2>
        <div className="max-w-xl mx-auto space-y-4">
          {[LABELS.step1, LABELS.step2, LABELS.step3, LABELS.step4].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/20 border border-gold-primary/40 flex items-center justify-center text-gold-light font-bold text-sm">
                {i + 1}
              </div>
              <p className="text-text-primary text-sm pt-1">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Works Everywhere ── */}
      <section className="space-y-6 text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-light"
          style={headingFont}
        >
          {LABELS.worksOn}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="bg-bg-secondary border border-gold-primary/12 rounded-xl px-4 py-2 text-text-secondary text-sm font-medium"
            >
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
