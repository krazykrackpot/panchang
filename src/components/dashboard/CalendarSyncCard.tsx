'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Link2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels (10 locales)
// ---------------------------------------------------------------------------

const LABELS = {
  en: {
    title: 'Vedic Calendar Sync',
    desc: 'Get festival dates, eclipse alerts, and dasha transitions right in your calendar.',
    download: 'Download .ics',
    subscribe: 'Subscribe URL',
    copied: 'Copied!',
    categories: 'Festivals, Eclipses, Vrats & more',
    howTo: 'How to subscribe',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL → paste the link above.',
    howToApple: 'Apple Calendar: File → New Calendar Subscription → paste the link above.',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web → paste the link above.',
    howToNote: 'Subscribed calendars auto-update when new events are added.',
  },
  hi: {
    title: 'वैदिक कैलेण्डर सिंक',
    desc: 'त्योहार तिथियाँ, ग्रहण सूचनाएँ और दशा परिवर्तन सीधे अपने कैलेण्डर में पाएँ।',
    download: '.ics डाउनलोड करें',
    subscribe: 'सब्सक्राइब URL',
    copied: 'कॉपी हो गया!',
    categories: 'त्योहार, ग्रहण, व्रत और अधिक',
    howTo: 'सब्सक्राइब कैसे करें',
    howToGoogle: 'Google Calendar: सेटिंग्स → अन्य कैलेण्डर जोड़ें → URL से → ऊपर का लिंक पेस्ट करें।',
    howToApple: 'Apple Calendar: फ़ाइल → नया कैलेण्डर सब्सक्रिप्शन → ऊपर का लिंक पेस्ट करें।',
    howToOutlook: 'Outlook: कैलेण्डर जोड़ें → वेब से सब्सक्राइब → ऊपर का लिंक पेस्ट करें।',
    howToNote: 'सब्सक्राइब किये गये कैलेण्डर नये कार्यक्रम जोड़ने पर स्वतः अपडेट होते हैं।',
  },
  sa: {
    title: 'वैदिककालसूचीसमन्वयः',
    desc: 'उत्सवतिथयः ग्रहणसूचनाः दशापरिवर्तनानि च स्वकालसूच्यां प्राप्नुवन्तु।',
    download: '.ics अवतारयतु',
    subscribe: 'सब्सक्राइब URL',
    copied: 'कॉपी!',
    categories: 'उत्सवाः, ग्रहणानि, व्रतानि, अधिकं च',
    howTo: 'सब्सक्राइब कथम्',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'सब्सक्राइब कालसूची स्वतः अद्यतनं भवति।',
  },
  ta: {
    title: 'வேத நாட்காட்டி ஒத்திசைவு',
    desc: 'திருவிழா தேதிகள், கிரகண எச்சரிக்கைகள், தசா மாற்றங்களை உங்கள் நாட்காட்டியில் பெறுங்கள்.',
    download: '.ics பதிவிறக்கம்',
    subscribe: 'சந்தா URL',
    copied: 'நகலெடுக்கப்பட்டது!',
    categories: 'திருவிழாக்கள், கிரகணங்கள், விரதங்கள் & மேலும்',
    howTo: 'சந்தா எப்படி',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL → மேலே உள்ள இணைப்பை ஒட்டவும்.',
    howToApple: 'Apple Calendar: File → New Calendar Subscription → மேலே உள்ள இணைப்பை ஒட்டவும்.',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web → மேலே உள்ள இணைப்பை ஒட்டவும்.',
    howToNote: 'சந்தா நாட்காட்டிகள் புதிய நிகழ்வுகள் சேர்க்கப்படும்போது தானாக புதுப்பிக்கப்படும்.',
  },
  te: {
    title: 'వేద క్యాలెండర్ సింక్',
    desc: 'పండుగ తేదీలు, గ్రహణ హెచ్చరికలు మరియు దశా మార్పులను మీ క్యాలెండర్‌లో పొందండి.',
    download: '.ics డౌన్‌లోడ్',
    subscribe: 'సబ్‌స్క్రైబ్ URL',
    copied: 'కాపీ అయింది!',
    categories: 'పండుగలు, గ్రహణాలు, వ్రతాలు & ఇంకా',
    howTo: 'సబ్‌స్క్రైబ్ ఎలా',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'సబ్‌స్క్రైబ్ క్యాలెండర్‌లు ఆటోమాటిక్‌గా అప్‌డేట్ అవుతాయి.',
  },
  bn: {
    title: 'বৈদিক ক্যালেন্ডার সিংক',
    desc: 'উৎসবের তারিখ, গ্রহণ সতর্কতা এবং দশা পরিবর্তন সরাসরি আপনার ক্যালেন্ডারে পান।',
    download: '.ics ডাউনলোড',
    subscribe: 'সাবস্ক্রাইব URL',
    copied: 'কপি হয়েছে!',
    categories: 'উৎসব, গ্রহণ, ব্রত ও আরও',
    howTo: 'সাবস্ক্রাইব কিভাবে',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'সাবস্ক্রাইব ক্যালেন্ডার স্বয়ংক্রিয়ভাবে আপডেট হয়।',
  },
  kn: {
    title: 'ವೈದಿಕ ಕ್ಯಾಲೆಂಡರ್ ಸಿಂಕ್',
    desc: 'ಹಬ್ಬದ ದಿನಾಂಕಗಳು, ಗ್ರಹಣ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ದಶಾ ಪರಿವರ್ತನೆಗಳನ್ನು ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.',
    download: '.ics ಡೌನ್‌ಲೋಡ್',
    subscribe: 'ಸಬ್‌ಸ್ಕ್ರೈಬ್ URL',
    copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
    categories: 'ಹಬ್ಬಗಳು, ಗ್ರಹಣಗಳು, ವ್ರತಗಳು & ಇನ್ನೂ',
    howTo: 'ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಹೇಗೆ',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತವೆ.',
  },
  mr: {
    title: 'वैदिक कॅलेंडर सिंक',
    desc: 'सण तारखा, ग्रहण सूचना आणि दशा बदल थेट आपल्या कॅलेंडरमध्ये मिळवा.',
    download: '.ics डाउनलोड करा',
    subscribe: 'सबस्क्राइब URL',
    copied: 'कॉपी झाले!',
    categories: 'सण, ग्रहण, व्रत आणि अधिक',
    howTo: 'सबस्क्राइब कसे करावे',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'सबस्क्राइब केलेले कॅलेंडर आपोआप अपडेट होतात.',
  },
  gu: {
    title: 'વૈદિક કેલેન્ડર સિંક',
    desc: 'તહેવારની તારીખો, ગ્રહણ ચેતવણીઓ અને દશા પરિવર્તન સીધા તમારા કેલેન્ડરમાં મેળવો.',
    download: '.ics ડાઉનલોડ',
    subscribe: 'સબ્સ્ક્રાઇબ URL',
    copied: 'કૉપી થયું!',
    categories: 'તહેવારો, ગ્રહણ, વ્રત અને વધુ',
    howTo: 'સબ્સ્ક્રાઇબ કેવી રીતે',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'સબ્સ્ક્રાઇબ કેલેન્ડર આપોઆપ અપડેટ થાય છે.',
  },
  mai: {
    title: 'वैदिक कैलेण्डर सिंक',
    desc: 'त्योहारक तिथि, ग्रहण सूचना आ दशा परिवर्तन सोझे अपन कैलेण्डरमे पाबू।',
    download: '.ics डाउनलोड करू',
    subscribe: 'सब्सक्राइब URL',
    copied: 'कॉपी भेल!',
    categories: 'त्योहार, ग्रहण, व्रत आ आर',
    howTo: 'सब्सक्राइब कोना करू',
    howToGoogle: 'Google Calendar: Settings → Add other calendars → From URL',
    howToApple: 'Apple Calendar: File → New Calendar Subscription',
    howToOutlook: 'Outlook: Add calendar → Subscribe from web',
    howToNote: 'सब्सक्राइब कैलेण्डर अपने आप अपडेट होइत अछि।',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

interface Props {
  locale: string;
}

export default function CalendarSyncCard({ locale }: Props) {
  const loc = (locale as Locale) || 'en';
  const L = LABELS[loc] || LABELS.en;
  const isHi = isDevanagariLocale(loc);
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const { lat, lng, timezone, name: locationName } = useLocationStore();
  const [copied, setCopied] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  // Build the export URL with user's location
  const currentYear = new Date().getFullYear();
  const exportParams = `year=${currentYear}&category=all${
    lat != null ? `&lat=${lat}` : ''
  }${lng != null ? `&lon=${lng}` : ''}${
    timezone ? `&timezone=${encodeURIComponent(timezone)}` : ''
  }${locationName ? `&location=${encodeURIComponent(locationName)}` : ''}`;

  const exportPath = `/api/calendar/export?${exportParams}`;

  // webcal:// URL for calendar subscription (auto-updating, inline disposition)
  const webcalUrl = `webcal://dekhopanchang.com${exportPath}&subscribe=1`;

  const copySubscribeUrl = async () => {
    try {
      await navigator.clipboard.writeText(webcalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text from a temporary input
      const input = document.createElement('input');
      input.value = webcalUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.42, ease: 'easeOut' as const }}>
      <div className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gold-primary" />
          <h3 className="text-gold-light font-semibold text-lg" style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
            {L.title}
          </h3>
        </div>

        <p className="text-text-secondary text-sm mb-2" style={bf}>{L.desc}</p>

        <p className="text-text-secondary/70 text-xs mb-4" style={bf}>{L.categories}</p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* ICS Download */}
          <a
            href={exportPath}
            download="vedic-calendar-2026.ics"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
          >
            <Download className="w-4 h-4" />
            {L.download}
          </a>

          {/* Copy Subscribe URL */}
          <button
            onClick={copySubscribeUrl}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              copied
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-gold-primary/25 bg-gold-primary/5 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/40'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? L.copied : L.subscribe}
          </button>
        </div>

        {/* How-to toggle */}
        <button
          onClick={() => setShowHowTo(!showHowTo)}
          className="flex items-center gap-1.5 text-text-secondary/70 text-xs hover:text-text-secondary transition-colors"
          style={bf}
        >
          {showHowTo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {L.howTo}
        </button>

        {showHowTo && (
          <div className="mt-3 space-y-2 pl-1 border-l-2 border-gold-primary/10 ml-1">
            {[
              { icon: '📅', text: L.howToGoogle },
              { icon: '🍎', text: L.howToApple },
              { icon: '📧', text: L.howToOutlook },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-text-secondary/80 pl-3" style={bf}>
                <span className="shrink-0">{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
            <p className="text-xs text-gold-dark/60 pl-3 pt-1" style={bf}>{L.howToNote}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
