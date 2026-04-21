'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

// ---------------------------------------------------------------------------
// Footer link sections — ~35 links for SEO link equity distribution
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    title: { en: 'Tools', hi: 'उपकरण', ta: 'கருவிகள்', bn: 'সরঞ্জাম' },
    links: [
      { href: '/kundali', label: { en: 'Kundali', hi: 'कुण्डली', ta: 'குண்டலி', bn: 'কুণ্ডলি' } },
      { href: '/matching', label: { en: 'Matching', hi: 'गुण मिलान', ta: 'பொருத்தம்', bn: 'গুণ মিলন' } },
      { href: '/sign-calculator', label: { en: 'Sign Calculator', hi: 'राशि खोजें', ta: 'ராசி கணிப்பான்', bn: 'রাশি ক্যালকুলেটর' } },
      { href: '/muhurta-ai', label: { en: 'Muhurta AI', hi: 'मुहूर्त AI', ta: 'முகூர்த்தம் AI', bn: 'মুহূর্ত AI' } },
      { href: '/varshaphal', label: { en: 'Varshaphal', hi: 'वर्षफल', ta: 'வர்ஷபலன்', bn: 'বর্ষফল' } },
      { href: '/kp-system', label: { en: 'KP System', hi: 'KP पद्धति', ta: 'KP முறை', bn: 'KP পদ্ধতি' } },
      { href: '/prashna', label: { en: 'Prashna', hi: 'प्रश्न', ta: 'பிரச்சினை', bn: 'প্রশ্ন' } },
      { href: '/baby-names', label: { en: 'Baby Names', hi: 'बच्चों के नाम', ta: 'குழந்தை பெயர்கள்', bn: 'শিশুর নাম' } },
      { href: '/sade-sati', label: { en: 'Sade Sati', hi: 'साढ़े साती', ta: 'சனிப்பெயர்ச்சி', bn: 'সাড়ে সাতি' } },
    ],
  },
  {
    title: { en: 'Calendars', hi: 'कैलेंडर', ta: 'நாள்காட்டிகள்', bn: 'ক্যালেন্ডার' },
    links: [
      { href: '/panchang', label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग', ta: 'தினசரி பஞ்சாங்கம்', bn: 'দৈনিক পঞ্জিকা' } },
      { href: '/calendar', label: { en: 'Festival Calendar', hi: 'त्योहार कैलेंडर', ta: 'பண்டிகை நாட்காட்டி', bn: 'উৎসব ক্যালেন্ডার' } },
      { href: '/transits', label: { en: 'Transit Calendar', hi: 'गोचर कैलेंडर', ta: 'கோசார நாள்காட்டி', bn: 'গোচর ক্যালেন্ডার' } },
      { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री कैलेंडर', ta: 'வக்கிர நாள்காட்டி', bn: 'বক্র ক্যালেন্ডার' } },
      { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण कैलेंडर', ta: 'கிரகண நாள்காட்டி', bn: 'গ্রহণ ক্যালেন্ডার' } },
      { href: '/muhurat', label: { en: 'Muhurat Calendar', hi: 'मुहूर्त कैलेंडर', ta: 'முகூர்த்த நாள்காட்டி', bn: 'মুহূর্ত ক্যালেন্ডার' } },
      { href: '/choghadiya', label: { en: 'Choghadiya', hi: 'चौघड़िया', ta: 'சோகடியா', bn: 'চৌঘড়িয়া' } },
      { href: '/rahu-kaal', label: { en: 'Rahu Kaal', hi: 'राहु काल', ta: 'ராகு காலம்', bn: 'রাহু কাল' } },
    ],
  },
  {
    title: { en: 'Learn', hi: 'सीखें', ta: 'கற்றுக்கொள்', bn: 'শিখুন' },
    links: [
      { href: '/learn', label: { en: 'All Topics', hi: 'सभी विषय', ta: 'அனைத்து தலைப்புகள்', bn: 'সব বিষয়' } },
      { href: '/learn/grahas', label: { en: 'Grahas', hi: 'ग्रह', ta: 'கிரகங்கள்', bn: 'গ্রহ' } },
      { href: '/learn/rashis', label: { en: 'Rashis', hi: 'राशियाँ', ta: 'ராசிகள்', bn: 'রাশি' } },
      { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', ta: 'நட்சத்திரங்கள்', bn: 'নক্ষত্র' } },
      { href: '/learn/tithis', label: { en: 'Tithis', hi: 'तिथियाँ', ta: 'திதிகள்', bn: 'তিথি' } },
      { href: '/learn/yogas', label: { en: 'Yogas', hi: 'योग', ta: 'யோகங்கள்', bn: 'যোগ' } },
      { href: '/learn/karanas', label: { en: 'Karanas', hi: 'करण', ta: 'கரணங்கள்', bn: 'করণ' } },
      { href: '/learn/kundali', label: { en: 'Kundali Reading', hi: 'कुण्डली पठन', ta: 'குண்டலி படிப்பு', bn: 'কুণ্ডলি পাঠ' } },
    ],
  },
  {
    title: { en: 'Deep Dives', hi: 'गहन अध्ययन', ta: 'ஆழ்ந்த பகுப்பாய்வு', bn: 'গভীর বিশ্লেষণ' },
    links: [
      { href: '/panchang/tithi', label: { en: 'Tithi', hi: 'तिथि', ta: 'திதி', bn: 'তিথি' } },
      { href: '/panchang/nakshatra', label: { en: 'Nakshatra', hi: 'नक्षत्र', ta: 'நட்சத்திரம்', bn: 'নক্ষত্র' } },
      { href: '/panchang/yoga', label: { en: 'Yoga', hi: 'योग', ta: 'யோகம்', bn: 'যোগ' } },
      { href: '/panchang/karana', label: { en: 'Karana', hi: 'करण', ta: 'கரணம்', bn: 'করণ' } },
      { href: '/panchang/muhurta', label: { en: 'Muhurta', hi: 'मुहूर्त', ta: 'முகூர்த்தம்', bn: 'মুহূর্ত' } },
      { href: '/panchang/rashi', label: { en: 'Rashi', hi: 'राशि', ta: 'ராசி', bn: 'রাশি' } },
      { href: '/panchang/masa', label: { en: 'Masa', hi: 'मास', ta: 'மாதம்', bn: 'মাস' } },
      { href: '/panchang/grahan', label: { en: 'Grahan', hi: 'ग्रहण', ta: 'கிரகணம்', bn: 'গ্রহণ' } },
      { href: '/panchang/samvatsara', label: { en: 'Samvatsara', hi: 'संवत्सर', ta: 'சம்வத்சரம்', bn: 'সংবৎসর' } },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function t(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="relative z-10 mt-16 border-t border-gold-primary/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 4-column link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {SECTIONS.map((section) => (
            <div key={t(section.title, 'en')}>
              <h3 className="text-gold-primary/80 text-xs font-semibold uppercase tracking-wider mb-3">
                {t(section.title, locale)}
              </h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary/70 text-xs hover:text-gold-light transition-colors"
                    >
                      {t(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-primary/8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gold-primary/60 text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Dekho Panchang
            </span>
            <span className="text-text-secondary/55 text-xs">&copy; 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-secondary/60">
            <Link href="/about" className="hover:text-gold-light transition-colors">
              {locale === 'hi' ? 'परिचय' : 'About'}
            </Link>
            <Link href="/privacy" className="hover:text-gold-light transition-colors">
              {locale === 'hi' ? 'गोपनीयता' : 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:text-gold-light transition-colors">
              {locale === 'hi' ? 'शर्तें' : 'Terms'}
            </Link>
          </div>

          <p className="text-gold-dark/40 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            ॐ ज्योतिषां ज्योतिः
          </p>
        </div>
      </div>
    </footer>
  );
}
