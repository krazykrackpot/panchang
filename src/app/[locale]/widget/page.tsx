import { getHeadingFont } from '@/lib/utils/locale-fonts';
import { Code, Globe, Clock, Shield, Zap, MonitorSmartphone } from 'lucide-react';
import WidgetConfigurator from './WidgetConfigurator';

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const headingFont = getHeadingFont(locale);

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  const LABELS = {
    badge: isHi ? 'निःशुल्क विजेट' : 'Free Widget',
    h1: isHi
      ? 'अपनी वेबसाइट के लिए मुफ्त पंचांग विजेट'
      : 'Free Panchang Widget for Your Website',
    subtitle: isHi
      ? 'एक लाइन कोड। किसी भी वेबसाइट पर दैनिक पंचांग। हमेशा मुफ्त।'
      : 'One line of code. Daily panchang on any website. Free forever.',
    featuresTitle: isHi ? 'विशेषताएं' : 'What You Get',
    howItWorks: isHi ? 'कैसे काम करता है' : 'How It Works',
    step1: isHi ? 'ऊपर अपना शहर चुनें' : 'Select your city above',
    step2: isHi ? 'एम्बेड कोड कॉपी करें' : 'Copy the embed code',
    step3: isHi ? 'अपनी वेबसाइट के HTML में पेस्ट करें' : 'Paste into your website HTML',
    step4: isHi ? 'विजेट हर दिन स्वचालित रूप से अपडेट होता है' : 'Widget updates automatically every day',
    worksOn: isHi ? 'यह कहां काम करता है' : 'Works Everywhere',
  };

  const FEATURES = [
    {
      icon: Clock,
      title: isHi ? 'प्रतिदिन स्वचालित अपडेट' : 'Updates Daily, Automatically',
      desc: isHi
        ? 'तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त हर दिन ताजा।'
        : 'Tithi, Nakshatra, Yoga, Karana, Sunrise & Sunset refreshed every day.',
    },
    {
      icon: Globe,
      title: isHi ? 'शहर-विशिष्ट गणना' : 'City-Specific Calculations',
      desc: isHi
        ? 'आपके चुने हुए शहर के अक्षांश/देशांतर से सटीक पंचांग।'
        : 'Accurate panchang computed from your chosen city\'s lat/lng.',
    },
    {
      icon: Shield,
      title: isHi ? 'कोई API कुंजी नहीं' : 'No API Key Required',
      desc: isHi
        ? 'कोई पंजीकरण नहीं, कोई API कुंजी नहीं, कोई सीमा नहीं। बस कॉपी और पेस्ट।'
        : 'No signup, no API key, no rate limits. Just copy and paste.',
    },
    {
      icon: Zap,
      title: isHi ? 'हल्का और तेज' : 'Lightweight & Fast',
      desc: isHi
        ? 'कोई JavaScript बंडल नहीं। सर्वर-रेंडर HTML। तुरंत लोड।'
        : 'Zero JavaScript bundle. Server-rendered HTML. Loads instantly.',
    },
    {
      icon: MonitorSmartphone,
      title: isHi ? 'रेस्पॉन्सिव डिज़ाइन' : 'Responsive Design',
      desc: isHi
        ? '250px से 600px तक किसी भी चौड़ाई में फिट।'
        : 'Fits any width from 250px to 600px. Mobile-friendly.',
    },
    {
      icon: Code,
      title: isHi ? 'हमेशा मुफ्त' : 'Free Forever',
      desc: isHi
        ? 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। "Powered by Dekho Panchang" विजेट में शामिल है।'
        : 'No fees, no ads injected. "Powered by Dekho Panchang" stays in the widget.',
    },
  ];

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
      <WidgetConfigurator />

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
