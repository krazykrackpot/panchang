'use client';

import { motion } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels (10 locales)
// ---------------------------------------------------------------------------

const LABELS = {
  en: { title: 'Vedic Calendar Sync', desc: 'Get festival dates, eclipse alerts, and dasha transitions right in your calendar.', download: 'Download .ics', categories: 'Festivals, Eclipses, Vrats & more' },
  hi: { title: 'वैदिक कैलेण्डर सिंक', desc: 'त्योहार तिथियाँ, ग्रहण सूचनाएँ और दशा परिवर्तन सीधे अपने कैलेण्डर में पाएँ।', download: '.ics डाउनलोड करें', categories: 'त्योहार, ग्रहण, व्रत और अधिक' },
  sa: { title: 'वैदिककालसूचीसमन्वयः', desc: 'उत्सवतिथयः ग्रहणसूचनाः दशापरिवर्तनानि च स्वकालसूच्यां प्राप्नुवन्तु।', download: '.ics अवतारयतु', categories: 'उत्सवाः, ग्रहणानि, व्रतानि, अधिकं च' },
  ta: { title: 'வேத நாட்காட்டி ஒத்திசைவு', desc: 'திருவிழா தேதிகள், கிரகண எச்சரிக்கைகள், தசா மாற்றங்களை உங்கள் நாட்காட்டியில் பெறுங்கள்.', download: '.ics பதிவிறக்கம்', categories: 'திருவிழாக்கள், கிரகணங்கள், விரதங்கள் & மேலும்' },
  te: { title: 'వేద క్యాలెండర్ సింక్', desc: 'పండుగ తేదీలు, గ్రహణ హెచ్చరికలు మరియు దశా మార్పులను మీ క్యాలెండర్‌లో పొందండి.', download: '.ics డౌన్‌లోడ్', categories: 'పండుగలు, గ్రహణాలు, వ్రతాలు & ఇంకా' },
  bn: { title: 'বৈদিক ক্যালেন্ডার সিংক', desc: 'উৎসবের তারিখ, গ্রহণ সতর্কতা এবং দশা পরিবর্তন সরাসরি আপনার ক্যালেন্ডারে পান।', download: '.ics ডাউনলোড', categories: 'উৎসব, গ্রহণ, ব্রত ও আরও' },
  kn: { title: 'ವೈದಿಕ ಕ್ಯಾಲೆಂಡರ್ ಸಿಂಕ್', desc: 'ಹಬ್ಬದ ದಿನಾಂಕಗಳು, ಗ್ರಹಣ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ದಶಾ ಪರಿವರ್ತನೆಗಳನ್ನು ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.', download: '.ics ಡೌನ್‌ಲೋಡ್', categories: 'ಹಬ್ಬಗಳು, ಗ್ರಹಣಗಳು, ವ್ರತಗಳು & ಇನ್ನೂ' },
  mr: { title: 'वैदिक कॅलेंडर सिंक', desc: 'सण तारखा, ग्रहण सूचना आणि दशा बदल थेट आपल्या कॅलेंडरमध्ये मिळवा.', download: '.ics डाउनलोड करा', categories: 'सण, ग्रहण, व्रत आणि अधिक' },
  gu: { title: 'વૈદિક કેલેન્ડર સિંક', desc: 'તહેવારની તારીખો, ગ્રહણ ચેતવણીઓ અને દશા પરિવર્તન સીધા તમારા કેલેન્ડરમાં મેળવો.', download: '.ics ડાઉનલોડ', categories: 'તહેવારો, ગ્રહણ, વ્રત અને વધુ' },
  mai: { title: 'वैदिक कैलेण्डर सिंक', desc: 'त्योहारक तिथि, ग्रहण सूचना आ दशा परिवर्तन सोझे अपन कैलेण्डरमे पाबू।', download: '.ics डाउनलोड करू', categories: 'त्योहार, ग्रहण, व्रत आ आर' },
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

  const { lat, lng, timezone, name: locationName } = useLocationStore();

  // Build the export URL with user's location
  const currentYear = new Date().getFullYear();
  const exportUrl = `/api/calendar/export?year=${currentYear}&category=all${
    lat != null ? `&lat=${lat}` : ''
  }${lng != null ? `&lon=${lng}` : ''}${
    timezone ? `&timezone=${encodeURIComponent(timezone)}` : ''
  }${locationName ? `&location=${encodeURIComponent(locationName)}` : ''}`;

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.42, ease: 'easeOut' as const }}>
      <div className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gold-primary" />
          <h3
            className="text-gold-light font-semibold text-lg"
            style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {L.title}
          </h3>
        </div>

        <p
          className="text-text-secondary text-sm mb-2"
          style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
        >
          {L.desc}
        </p>

        <p className="text-text-secondary/70 text-xs mb-4" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {L.categories}
        </p>

        <a
          href={exportUrl}
          download="vedic-calendar-2026.ics"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
        >
          <Download className="w-4 h-4" />
          {L.download}
        </a>
      </div>
    </motion.div>
  );
}
