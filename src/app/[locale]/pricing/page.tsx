'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useSubscription } from '@/hooks/useSubscription';
import type { Locale } from '@/types/panchang';
import { trackSubscriptionStarted, trackCheckoutStarted, trackCheckoutCompleted } from '@/lib/analytics';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const PLANS = [
  {
    key: 'free',
    name: { en: 'Free', hi: 'नि:शुल्क' },
    priceINR: { monthly: 0, annual: 0 },
    priceUSD: { monthly: 0, annual: 0 },
    features: [
      { en: 'Daily Panchang (with ads)', hi: 'दैनिक पंचांग (विज्ञापन सहित)', included: true },
      { en: '2 Kundali/day', hi: '2 कुण्डली/दिन', included: true },
      { en: '2 AI Chats/day', hi: '2 AI चैट/दिन', included: true },
      { en: '3 Saved Charts', hi: '3 सहेजे गए चार्ट', included: true },
      { en: 'Basic Yogas & Tippanni', hi: 'मूल योग और टिप्पणी', included: true },
      { en: 'Full Shadbala/Bhavabala', hi: 'पूर्ण षड्बल/भावबल', included: false },
      { en: 'Varshaphal / KP / Prashna', hi: 'वर्षफल / केपी / प्रश्न', included: false },
      { en: 'All 17 Varga Charts', hi: 'सभी 17 वर्ग चार्ट', included: false },
    ],
  },
  {
    key: 'pro',
    name: { en: 'Pro', hi: 'प्रो' },
    priceINR: { monthly: 149, annual: 1199 },
    priceUSD: { monthly: 5, annual: 39 },
    badge: { en: '7-day free trial', hi: '7 दिन नि:शुल्क परीक्षण' },
    features: [
      { en: 'Ad-free Panchang', hi: 'विज्ञापन-मुक्त पंचांग', included: true },
      { en: 'Unlimited Kundali', hi: 'असीमित कुण्डली', included: true },
      { en: '20 AI Chats/day', hi: '20 AI चैट/दिन', included: true },
      { en: '25 Saved Charts', hi: '25 सहेजे गए चार्ट', included: true },
      { en: 'Full Shadbala & Yogas', hi: 'पूर्ण षड्बल और योग', included: true },
      { en: 'Varshaphal / KP / Prashna', hi: 'वर्षफल / केपी / प्रश्न', included: true },
      { en: 'All 17 Varga Charts', hi: 'सभी 17 वर्ग चार्ट', included: true },
      { en: 'Full Tippanni + Classical Refs', hi: 'पूर्ण टिप्पणी + शास्त्रीय संदर्भ', included: true },
    ],
  },
  {
    key: 'jyotishi',
    name: { en: 'Jyotishi', hi: 'ज्योतिषी' },
    priceINR: { monthly: 499, annual: 3999 },
    priceUSD: { monthly: 15, annual: 119 },
    features: [
      { en: 'Everything in Pro', hi: 'प्रो की सभी सुविधाएं', included: true },
      { en: 'Unlimited AI Chat', hi: 'असीमित AI चैट', included: true },
      { en: 'Unlimited Saved Charts', hi: 'असीमित सहेजे गए चार्ट', included: true },
      { en: 'Unlimited Muhurta AI', hi: 'असीमित मुहूर्त AI', included: true },
      { en: 'Batch Processing (50 charts)', hi: 'बैच प्रोसेसिंग (50 चार्ट)', included: true },
      { en: 'Custom PDF Branding', hi: 'कस्टम PDF ब्रांडिंग', included: true },
      { en: 'API Access', hi: 'API एक्सेस', included: true },
      { en: 'Priority Support', hi: 'प्राथमिकता समर्थन', included: true },
    ],
  },
] as const;

const FAQ = [
  {
    q: { en: 'Can I cancel anytime?', hi: 'क्या मैं कभी भी रद्द कर सकता हूं?' },
    a: {
      en: 'Yes, you can cancel your subscription at any time. You will retain access to your plan until the end of the current billing period.',
      hi: 'हां, आप अपनी सदस्यता कभी भी रद्द कर सकते हैं। वर्तमान बिलिंग अवधि समाप्त होने तक आपकी योजना की पहुंच बनी रहेगी।',
    },
  },
  {
    q: { en: 'What happens after the trial?', hi: 'परीक्षण के बाद क्या होता है?' },
    a: {
      en: 'After your 7-day free trial ends, you will be automatically downgraded to the Free plan unless you choose to subscribe. No charges are made during the trial.',
      hi: '7 दिन के नि:शुल्क परीक्षण की समाप्ति के बाद, यदि आप सदस्यता नहीं लेते हैं तो आपको स्वचालित रूप से नि:शुल्क योजना में डाउनग्रेड कर दिया जाएगा।',
    },
  },
  {
    q: { en: 'Can I switch plans?', hi: 'क्या मैं योजना बदल सकता हूं?' },
    a: {
      en: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, the change takes effect at the next billing cycle.',
      hi: 'हां, आप कभी भी अपनी योजना अपग्रेड या डाउनग्रेड कर सकते हैं। अपग्रेड करने पर, आपको नई सुविधाओं तक तुरंत पहुंच मिलती है।',
    },
  },
  {
    q: { en: 'What payment methods are accepted?', hi: 'कौन सी भुगतान विधियां स्वीकार की जाती हैं?' },
    a: {
      en: 'In India: UPI, credit/debit cards, and net banking. Internationally: credit/debit cards, Apple Pay, and Google Pay.',
      hi: 'भारत में: UPI, क्रेडिट/डेबिट कार्ड और नेट बैंकिंग। अंतर्राष्ट्रीय: क्रेडिट/डेबिट कार्ड, Apple Pay और Google Pay।',
    },
  },
  {
    q: { en: 'Is my data safe?', hi: 'क्या मेरा डेटा सुरक्षित है?' },
    a: {
      en: 'All data is encrypted in transit and at rest. We are GDPR compliant and never share your personal birth data with third parties.',
      hi: 'सभी डेटा ट्रांज़िट और रेस्ट में एन्क्रिप्टेड है। हम GDPR अनुपालक हैं और आपके व्यक्तिगत जन्म डेटा को तृतीय पक्षों के साथ कभी साझा नहीं करते।',
    },
  },
];

const LABELS = {
  heading: {
    en: 'Unlock the Full Power of Vedic Astrology',
    hi: 'वैदिक ज्योतिष की पूर्ण शक्ति अनलॉक करें',
    ta: 'வேத ஜோதிடத்தின் முழு சக்தியைத் திறக்கவும்',
    te: 'వేద జ్యోతిషం యొక్క పూర్తి శక్తిని అన్‌లాక్ చేయండి',
    bn: 'বৈদিক জ্যোতিষের পূর্ণ শক্তি আনলক করুন',
    kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷದ ಪೂರ್ಣ ಶಕ್ತಿಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
    mr: 'वैदिक ज्योतिषाची पूर्ण शक्ती अनलॉक करा',
    gu: 'વૈદિક જ્યોતિષની સંપૂર્ણ શક્તિ અનલૉક કરો',
    mai: 'वैदिक ज्योतिषक पूर्ण शक्ति अनलॉक करू',
  },
  subtitle: {
    en: 'Choose the plan that fits your practice',
    hi: 'अपनी साधना के अनुरूप योजना चुनें',
    ta: 'உங்கள் பயிற்சிக்கு ஏற்ற திட்டத்தைத் தேர்ந்தெடுக்கவும்',
    te: 'మీ అభ్యాసానికి తగిన ప్లాన్ ఎంచుకోండి',
    bn: 'আপনার সাধনার উপযুক্ত পরিকল্পনা বেছে নিন',
    kn: 'ನಿಮ್ಮ ಅಭ್ಯಾಸಕ್ಕೆ ಹೊಂದುವ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    mr: 'आपल्या साधनेला अनुरूप योजना निवडा',
    gu: 'તમારી સાધના માટે યોગ્ય યોજના પસંદ કરો',
    mai: 'अपन साधनाक अनुरूप योजना चुनू',
  },
  monthly: { en: 'Monthly', hi: 'मासिक', ta: 'மாதாந்திர', te: 'నెలవారీ', bn: 'মাসিক', kn: 'ಮಾಸಿಕ', mr: 'मासिक', gu: 'માસિક', mai: 'मासिक' },
  annual: { en: 'Annual', hi: 'वार्षिक', ta: 'ஆண்டு', te: 'వార్షిక', bn: 'বার্ষিক', kn: 'ವಾರ್ಷಿಕ', mr: 'वार्षिक', gu: 'વાર્ષિક', mai: 'वार्षिक' },
  savePercent: { en: 'Save ~33%', hi: '~33% बचाएं', ta: '~33% சேமிக்கவும்', te: '~33% ఆదా', bn: '~৩৩% সাশ্রয়', kn: '~33% ಉಳಿತಾಯ', mr: '~33% बचत', gu: '~33% બચત', mai: '~33% बचत' },
  perMonth: { en: '/mo', hi: '/माह', ta: '/மாதம்', te: '/నెల', bn: '/মাস', kn: '/ತಿಂಗಳು', mr: '/महिना', gu: '/મહિનો', mai: '/मास' },
  perYear: { en: '/yr', hi: '/वर्ष', ta: '/ஆண்டு', te: '/సంవత్సరం', bn: '/বছর', kn: '/ವರ್ಷ', mr: '/वर्ष', gu: '/વર્ષ', mai: '/वर्ष' },
  currentPlan: { en: 'Current Plan', hi: 'वर्तमान योजना', ta: 'தற்போதைய திட்டம்', te: 'ప్రస్తుత ప్లాన్', bn: 'বর্তমান পরিকল্পনা', kn: 'ಪ್ರಸ್ತುತ ಯೋಜನೆ', mr: 'सध्याची योजना', gu: 'વર્તમાન યોજના', mai: 'वर्तमान योजना' },
  getStarted: { en: 'Get Started', hi: 'शुरू करें', ta: 'தொடங்கு', te: 'ప్రారంభించండి', bn: 'শুরু করুন', kn: 'ಪ್ರಾರಂಭಿಸಿ', mr: 'सुरू करा', gu: 'શરૂ કરો', mai: 'शुरू करू' },
  startTrial: { en: 'Start Free Trial', hi: 'नि:शुल्क परीक्षण शुरू करें', ta: 'இலவச சோதனையைத் தொடங்கு', te: 'ఉచిత ట్రయల్ ప్రారంభించండి', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন', kn: 'ಉಚಿತ ಟ್ರಯಲ್ ಪ್ರಾರಂಭಿಸಿ', mr: 'विनामूल्य चाचणी सुरू करा', gu: 'મફત ટ્રાયલ શરૂ કરો', mai: 'निःशुल्क परीक्षण शुरू करू' },
  mostPopular: { en: 'Most Popular', hi: 'सबसे लोकप्रिय', ta: 'மிகவும் பிரபலமான', te: 'అత్యంత జనాదరణ', bn: 'সবচেয়ে জনপ্রিয়', kn: 'ಅತ್ಯಂತ ಜನಪ್ರಿಯ', mr: 'सर्वात लोकप्रिय', gu: 'સૌથી લોકપ્રિય', mai: 'सबसँ लोकप्रिय' },
  faq: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न', ta: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', te: 'తరచుగా అడిగే ప్రశ్నలు', bn: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন', kn: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು', mr: 'वारंवार विचारले जाणारे प्रश्न', gu: 'વારંવાર પૂછાતા પ્રશ્નો', mai: 'बारंबार पुछल जाय वाला प्रश्न' },
};

function t(obj: { en: string; hi: string; ta?: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string }, locale: string): string {
  if (String(locale) === 'mr' && obj.mr) return obj.mr;
  if (String(locale) === 'gu' && obj.gu) return obj.gu;
  if (String(locale) === 'mai' && obj.mai) return obj.mai;
  if (String(locale) === 'te' && obj.te) return obj.te;
  if (String(locale) === 'bn' && obj.bn) return obj.bn;
  if (String(locale) === 'kn' && obj.kn) return obj.kn;
  if (String(locale) === 'ta' && obj.ta) return obj.ta;
  return !isDevanagariLocale(locale) ? obj.en : obj.hi;
}

export default function PricingPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : {};

  const { tier: currentTier } = useSubscription();
  const searchParams = useSearchParams();

  // Track checkout completion when user returns from Stripe/Razorpay
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      trackCheckoutCompleted({ tier: currentTier, provider: 'stripe' });
    }
  }, [searchParams, currentTier]);

  const [currency, setCurrency] = useState<'INR' | 'USD'>(() => {
    if (typeof window === 'undefined') return 'INR';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Asia/') ? 'INR' : 'USD';
  });
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCheckout = async (tier: 'pro' | 'jyotishi') => {
    const user = useAuthStore.getState().user;
    if (!user) {
      alert(!isDevanagariLocale(locale) ? 'Please sign in first' : 'पहले साइन इन करें');
      return;
    }
    try {
      // Get auth token for the API call
      const supabase = (await import('@/lib/supabase/client')).getSupabase();
      const session = await supabase?.auth.getSession();
      const token = session?.data.session?.access_token;
      if (!token) {
        alert(!isDevanagariLocale(locale) ? 'Please sign in first' : 'पहले साइन इन करें');
        return;
      }

      trackCheckoutStarted({ tier, billing, currency: currency.toLowerCase() as 'usd' | 'inr' });
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier, billing, currency }),
      });
      const data = await res.json();
      if (data.url) {
        trackSubscriptionStarted({ tier, period: billing, currency: currency.toLowerCase() as 'usd' | 'inr' });
        window.location.href = data.url;
      } else if (data.error) alert(data.error);
    } catch {
      alert('Checkout failed');
    }
  };

  const formatPrice = (amount: number) => {
    if (amount === 0) {
      return !isDevanagariLocale(locale) ? 'Free' : 'नि:शुल्क';
    }
    return currency === 'INR' ? `₹${amount}` : `$${amount}`;
  };

  const getPrice = (plan: (typeof PLANS)[number]) => {
    const prices = currency === 'INR' ? plan.priceINR : plan.priceUSD;
    return prices[billing];
  };

  const getMonthlyEquivalent = (plan: (typeof PLANS)[number]) => {
    const prices = currency === 'INR' ? plan.priceINR : plan.priceUSD;
    if (billing === 'annual' && prices.annual > 0) {
      return prices.monthly * 12;
    }
    return null;
  };

  return (
    <main className="min-h-screen pb-20" style={bodyFont}>
      {/* Hero */}
      <section className="relative pt-24 pb-12 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
        >
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent"
            style={headingFont}
          >
            {t(LABELS.heading, locale)}
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
            {t(LABELS.subtitle, locale)}
          </p>
        </motion.div>
      </section>

      {/* Toggles */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 px-4">
        {/* Billing toggle */}
        <div className="flex items-center gap-3 rounded-full bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billing === 'monthly'
                ? 'bg-[#d4a853] text-[#0a0e27]'
                : 'text-white/75 hover:text-white/80'
            }`}
          >
            {t(LABELS.monthly, locale)}
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billing === 'annual'
                ? 'bg-[#d4a853] text-[#0a0e27]'
                : 'text-white/75 hover:text-white/80'
            }`}
          >
            {t(LABELS.annual, locale)}
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              {t(LABELS.savePercent, locale)}
            </span>
          </button>
        </div>

        {/* Currency toggle */}
        <div className="flex items-center gap-3 rounded-full bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'INR'
                ? 'bg-[#d4a853] text-[#0a0e27]'
                : 'text-white/75 hover:text-white/80'
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currency === 'USD'
                ? 'bg-[#d4a853] text-[#0a0e27]'
                : 'text-white/75 hover:text-white/80'
            }`}
          >
            USD ($)
          </button>
        </div>
      </section>

      {/* Plan cards */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
        {PLANS.map((plan, i) => {
          const price = getPrice(plan);
          const crossedOut = getMonthlyEquivalent(plan);
          const isPro = plan.key === 'pro';
          const isJyotishi = plan.key === 'jyotishi';
          const isFree = plan.key === 'free';
          const isCurrentPlan = currentTier === plan.key;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const }}
              className={`relative rounded-2xl p-6 md:p-8 border backdrop-blur-sm flex flex-col ${
                isPro
                  ? 'border-[#d4a853]/40 bg-gradient-to-br from-[#d4a853]/10 to-transparent'
                  : isJyotishi
                    ? 'border-[#d4a853]/20 bg-white/[0.03]'
                    : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              {/* Badge */}
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] text-xs font-bold px-4 py-1 rounded-full">
                  {t(LABELS.mostPopular, locale)}
                </div>
              )}

              {/* Plan name */}
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={headingFont}
              >
                {t(plan.name, locale)}
              </h2>

              {/* Trial badge */}
              {'badge' in plan && plan.badge && (
                <span className="inline-block text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full mb-3 w-fit">
                  {t(plan.badge, locale)}
                </span>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#f0d48a] to-[#d4a853] bg-clip-text text-transparent">
                    {formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-white/65 text-sm">
                      {billing === 'monthly'
                        ? t(LABELS.perMonth, locale)
                        : t(LABELS.perYear, locale)}
                    </span>
                  )}
                </div>
                {crossedOut !== null && crossedOut > 0 && (
                  <p className="text-sm text-white/65 mt-1">
                    <span className="line-through">{formatPrice(crossedOut)}</span>
                    <span className="text-green-400 ml-2">
                      {locale === 'en'
                        ? `Save ${formatPrice(crossedOut - price)}`
                        : `${formatPrice(crossedOut - price)} बचाएं`}
                    </span>
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    {feat.included ? (
                      <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feat.included ? 'text-white/80' : 'text-white/55'
                      }
                    >
                      {t(feat, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isFree ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-white/5 text-white/65 border border-white/10 cursor-not-allowed"
                >
                  {t(LABELS.currentPlan, locale)}
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.key as 'pro' | 'jyotishi')}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-white/5 text-white/65 border border-white/10 cursor-not-allowed'
                      : isPro
                        ? 'bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] hover:shadow-lg hover:shadow-[#d4a853]/20'
                        : 'bg-white/10 text-white border border-[#d4a853]/30 hover:bg-[#d4a853]/10 hover:border-[#d4a853]/50'
                  }`}
                >
                  {isCurrentPlan
                    ? t(LABELS.currentPlan, locale)
                    : isPro
                      ? t(LABELS.startTrial, locale)
                      : t(LABELS.getStarted, locale)}
                </button>
              )}
            </motion.div>
          );
        })}
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent"
          style={headingFont}
        >
          {t(LABELS.faq, locale)}
        </motion.h2>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-white/90">
                  {t(item.q, locale)}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#d4a853] shrink-0 transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25 }}
                  className="px-6 pb-4"
                >
                  <p className="text-white/75 leading-relaxed">
                    {t(item.a, locale)}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
