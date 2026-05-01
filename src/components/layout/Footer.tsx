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
      { href: '/cosmic-blueprint', label: { en: 'Cosmic Blueprint', hi: 'ब्रह्मांडीय नक्शा', ta: 'கோள வரைபடம்', bn: 'মহাজাগতিক ব্লুপ্রিন্ট' } },
      { href: '/tropical-compare', label: { en: 'Vedic vs Tropical', hi: 'वैदिक vs उष्णकटिबंधीय', ta: 'வேதம் vs வெப்பமண்டலம்', bn: 'বৈদিক vs ট্রপিক্যাল' } },
      { href: '/sign-shift', label: { en: 'Sign Shift', hi: 'राशि परिवर्तन', ta: 'ராசி மாற்றம்', bn: 'রাশি পরিবর্তন' } },
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
      { href: '/events', label: { en: 'Celestial Events', hi: 'खगोलीय घटनाएँ', ta: 'வான் நிகழ்வுகள்', bn: 'জ্যোতির্বিদ্যা ঘটনা' } },
      { href: '/muhurat', label: { en: 'Muhurat Calendar', hi: 'मुहूर्त कैलेंडर', ta: 'முகூர்த்த நாள்காட்டி', bn: 'মুহূর্ত ক্যালেন্ডার' } },
      { href: '/choghadiya', label: { en: 'Choghadiya', hi: 'चौघड़िया', ta: 'சோகடியா', bn: 'চৌঘড়িয়া' } },
      { href: '/rahu-kaal', label: { en: 'Rahu Kaal', hi: 'राहु काल', ta: 'ராகு காலம்', bn: 'রাহু কাল' } },
      { href: '/lunar-calendar', label: { en: 'Lunar Calendar', hi: 'चंद्र कैलेंडर', ta: 'சந்திர நாட்காட்டி', bn: 'চন্দ্র ক্যালেন্ডার' } },
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
      { href: '/glossary', label: { en: 'Glossary', hi: 'शब्दकोश', ta: 'சொற்பொருள்', bn: 'শব্দকোষ' } },
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
    <footer className="relative z-10 mt-16 border-t border-gold-primary/15 bg-gradient-to-b from-[#0d1130] to-[#080b1e]">
      {/* Subtle top texture line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 4-column link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {SECTIONS.map((section) => (
            <div key={t(section.title, 'en')}>
              <h3 className="text-gold-primary text-xs font-bold uppercase tracking-widest mb-4">
                {t(section.title, locale)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-xs hover:text-gold-light transition-colors py-1 inline-block"
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
        <div className="border-t border-gold-primary/12 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gold-primary text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                Dekho Panchang
              </span>
              <span className="text-text-secondary text-xs">&copy; 2026</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="https://x.com/dekhopanchang" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="text-text-secondary hover:text-gold-light transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.youtube.com/@DekhoPanchang" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="text-text-secondary hover:text-[#ff0000] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/dekhopanchang/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-text-secondary hover:text-[#e4405f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
            <Link href="/about" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'About', hi: 'परिचय', ta: 'பற்றி', bn: 'সম্পর্কে' }, locale)}
            </Link>
            <Link href="/about/methodology" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Methodology', hi: 'गणना पद्धति', ta: 'முறையியல்', bn: 'পদ্ধতি' }, locale)}
            </Link>
            <Link href="/about#contact" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Contact', hi: 'संपर्क', ta: 'தொடர்பு', bn: 'যোগাযোগ' }, locale)}
            </Link>
            <Link href="/privacy" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Privacy', hi: 'गोपनीयता', ta: 'தனியுரிமை', bn: 'গোপনীয়তা' }, locale)}
            </Link>
            <Link href="/terms" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Terms', hi: 'शर्तें', ta: 'விதிமுறைகள்', bn: 'শর্তাবলী' }, locale)}
            </Link>
          </div>

          <p className="text-gold-dark/60 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            ॐ ज्योतिषां ज्योतिः
          </p>
        </div>
      </div>
    </footer>
  );
}
