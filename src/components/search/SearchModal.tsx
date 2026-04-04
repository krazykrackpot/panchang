'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';

interface SearchItem {
  title: string;
  titleHi?: string;
  href: string;
  category: string;
  keywords?: string[];
}

// Static search index — all navigable pages, tools, festivals, pujas
const SEARCH_INDEX: SearchItem[] = [
  // Core pages
  { title: 'Today\'s Panchang', titleHi: 'आज का पंचांग', href: '/panchang', category: 'Pages', keywords: ['tithi', 'nakshatra', 'yoga', 'karana', 'sunrise', 'sunset', 'rahu kalam'] },
  { title: 'Birth Chart (Kundali)', titleHi: 'जन्म कुण्डली', href: '/kundali', category: 'Pages', keywords: ['kundali', 'horoscope', 'birth chart', 'janam', 'lagna'] },
  { title: 'Kundali Matching', titleHi: 'कुण्डली मिलान', href: '/matching', category: 'Pages', keywords: ['guna milan', 'compatibility', 'ashta kuta', 'marriage'] },
  { title: 'Muhurta AI', titleHi: 'मुहूर्त AI', href: '/muhurta-ai', category: 'Pages', keywords: ['auspicious time', 'shubh muhurat', 'marriage date', 'griha pravesh'] },
  { title: 'My Profile', titleHi: 'मेरी कुंडली', href: '/profile', category: 'Pages', keywords: ['profile', 'birth details', 'rashi', 'nakshatra'] },
  { title: 'Settings', titleHi: 'सेटिंग्स', href: '/settings', category: 'Pages', keywords: ['settings', 'preferences', 'birth data', 'ayanamsha'] },

  // Calendars
  { title: 'Festival Calendar', titleHi: 'त्योहार पंचांग', href: '/calendar', category: 'Calendars', keywords: ['festivals', 'vrat', 'ekadashi', 'purnima', 'amavasya'] },
  { title: 'Planet Transits', titleHi: 'ग्रह गोचर', href: '/transits', category: 'Calendars', keywords: ['gochar', 'transit', 'planet movement'] },
  { title: 'Retrograde Calendar', titleHi: 'वक्री पंचांग', href: '/retrograde', category: 'Calendars', keywords: ['retrograde', 'vakri', 'mercury retrograde'] },
  { title: 'Eclipse Calendar', titleHi: 'ग्रहण पंचांग', href: '/eclipses', category: 'Calendars', keywords: ['solar eclipse', 'lunar eclipse', 'surya grahan', 'chandra grahan'] },
  { title: 'Muhurat Calendar', titleHi: 'मुहूर्त पंचांग', href: '/muhurat', category: 'Calendars', keywords: ['muhurat', 'auspicious dates', 'marriage dates', 'griha pravesh'] },
  { title: 'Regional Calendars', titleHi: 'क्षेत्रीय पंचांग', href: '/regional', category: 'Calendars', keywords: ['tamil', 'telugu', 'kannada', 'regional'] },

  // Tools
  { title: 'Sade Sati Check', titleHi: 'साढ़े साती', href: '/sade-sati', category: 'Tools', keywords: ['sade sati', 'saturn', 'shani', '7.5 years'] },
  { title: 'Sign Calculator', titleHi: 'राशि गणक', href: '/sign-calculator', category: 'Tools', keywords: ['rashi', 'zodiac', 'sun sign', 'moon sign'] },
  { title: 'Baby Names', titleHi: 'शिशु नाम', href: '/baby-names', category: 'Tools', keywords: ['baby names', 'nakshatra names', 'naming ceremony'] },
  { title: 'Shraddha Calculator', titleHi: 'श्राद्ध गणक', href: '/shraddha', category: 'Tools', keywords: ['shraddha', 'pitru', 'ancestor', 'tarpan'] },
  { title: 'Vedic Time', titleHi: 'वैदिक समय', href: '/vedic-time', category: 'Tools', keywords: ['ghati', 'pala', 'vipala', 'muhurta', 'prahar'] },
  { title: 'Prashna Kundali', titleHi: 'प्रश्न कुण्डली', href: '/prashna', category: 'Tools', keywords: ['prashna', 'horary', 'question'] },
  { title: 'Ashtamangala Prashna', titleHi: 'अष्टमंगल प्रश्न', href: '/prashna-ashtamangala', category: 'Tools', keywords: ['ashtamangala', 'kerala', 'prashna'] },
  { title: 'Upagraha', titleHi: 'उपग्रह', href: '/upagraha', category: 'Tools', keywords: ['upagraha', 'gulika', 'mandi'] },
  { title: 'Varshaphal', titleHi: 'वर्षफल', href: '/varshaphal', category: 'Tools', keywords: ['varshaphal', 'solar return', 'annual chart', 'tajika'] },
  { title: 'KP System', titleHi: 'केपी पद्धति', href: '/kp-system', category: 'Tools', keywords: ['kp', 'krishnamurti', 'sub lord', 'placidus'] },
  { title: 'Kaal Nirnaya', titleHi: 'काल निर्णय', href: '/kaal-nirnaya', category: 'Tools', keywords: ['kaal', 'nirnaya', 'hora', 'choghadiya'] },
  { title: 'Nivas Shool', titleHi: 'निवास शूल', href: '/nivas-shool', category: 'Tools', keywords: ['nivas', 'shool', 'direction', 'travel'] },

  // Rituals
  { title: 'Puja Vidhi', titleHi: 'पूजा विधि', href: '/puja', category: 'Rituals', keywords: ['puja', 'vidhi', 'ritual', 'ceremony'] },
  { title: 'Sankalpa Generator', titleHi: 'सङ्कल्प', href: '/sankalpa', category: 'Rituals', keywords: ['sankalpa', 'vow', 'ritual declaration'] },
  { title: 'Devotional Guide', titleHi: 'भक्ति मार्गदर्शिका', href: '/devotional', category: 'Rituals', keywords: ['devotional', 'bhakti', 'stotras', 'chalisa'] },

  // Festivals & Pujas
  { title: 'Diwali Puja', titleHi: 'दिवाली पूजा', href: '/puja/diwali', category: 'Festivals', keywords: ['diwali', 'deepavali', 'lakshmi', 'ganesh'] },
  { title: 'Ganesh Chaturthi Puja', titleHi: 'गणेश चतुर्थी', href: '/puja/ganesh-chaturthi', category: 'Festivals', keywords: ['ganesh', 'chaturthi', 'vinayaka'] },
  { title: 'Maha Shivaratri Puja', titleHi: 'महाशिवरात्रि', href: '/puja/maha-shivaratri', category: 'Festivals', keywords: ['shivaratri', 'shiva', 'mahadev', 'lingam'] },
  { title: 'Navaratri Puja', titleHi: 'नवरात्रि', href: '/puja/navaratri', category: 'Festivals', keywords: ['navaratri', 'durga', 'navratri', 'garba'] },
  { title: 'Holi Puja', titleHi: 'होली', href: '/puja/holi', category: 'Festivals', keywords: ['holi', 'holika', 'colors'] },
  { title: 'Ram Navami Puja', titleHi: 'राम नवमी', href: '/puja/ram-navami', category: 'Festivals', keywords: ['ram', 'navami', 'rama'] },
  { title: 'Janmashtami Puja', titleHi: 'जन्माष्टमी', href: '/puja/janmashtami', category: 'Festivals', keywords: ['janmashtami', 'krishna', 'gokulashtami'] },
  { title: 'Makar Sankranti', titleHi: 'मकर संक्रांति', href: '/puja/makar-sankranti', category: 'Festivals', keywords: ['sankranti', 'pongal', 'uttarayan'] },
  { title: 'Raksha Bandhan', titleHi: 'रक्षा बंधन', href: '/puja/raksha-bandhan', category: 'Festivals', keywords: ['rakhi', 'raksha bandhan', 'brother sister'] },
  { title: 'Chhath Puja', titleHi: 'छठ पूजा', href: '/puja/chhath', category: 'Festivals', keywords: ['chhath', 'surya', 'bihar'] },
  { title: 'Ekadashi Vrat', titleHi: 'एकादशी व्रत', href: '/puja/ekadashi', category: 'Festivals', keywords: ['ekadashi', 'fasting', 'vishnu', 'parana'] },
  { title: 'Satyanarayan Puja', titleHi: 'सत्यनारायण पूजा', href: '/puja/satyanarayan', category: 'Festivals', keywords: ['satyanarayan', 'katha', 'vishnu'] },
  { title: 'Karva Chauth', titleHi: 'करवा चौथ', href: '/puja/karva-chauth', category: 'Festivals', keywords: ['karva chauth', 'moon', 'husband'] },
  { title: 'Akshaya Tritiya', titleHi: 'अक्षय तृतीया', href: '/puja/akshaya-tritiya', category: 'Festivals', keywords: ['akshaya', 'tritiya', 'gold'] },
  { title: 'Vasant Panchami', titleHi: 'वसन्त पंचमी', href: '/puja/vasant-panchami', category: 'Festivals', keywords: ['vasant', 'saraswati', 'basant'] },
  { title: 'Guru Purnima', titleHi: 'गुरु पूर्णिमा', href: '/puja/guru-purnima', category: 'Festivals', keywords: ['guru', 'purnima', 'vyasa'] },
  { title: 'Dussehra', titleHi: 'दशहरा', href: '/puja/dussehra', category: 'Festivals', keywords: ['dussehra', 'vijayadashami', 'ravana', 'rama'] },
  { title: 'Dhanteras', titleHi: 'धनतेरस', href: '/puja/dhanteras', category: 'Festivals', keywords: ['dhanteras', 'dhanvantari', 'gold', 'wealth'] },

  // Graha Shanti
  { title: 'Surya (Sun) Shanti', titleHi: 'सूर्य शान्ति', href: '/puja/surya-shanti', category: 'Graha Shanti', keywords: ['surya', 'sun', 'graha shanti'] },
  { title: 'Chandra (Moon) Shanti', titleHi: 'चन्द्र शान्ति', href: '/puja/chandra-shanti', category: 'Graha Shanti', keywords: ['chandra', 'moon', 'graha shanti'] },
  { title: 'Shani (Saturn) Shanti', titleHi: 'शनि शान्ति', href: '/puja/shani-shanti', category: 'Graha Shanti', keywords: ['shani', 'saturn', 'sade sati', 'graha shanti'] },
  { title: 'Rahu Shanti', titleHi: 'राहु शान्ति', href: '/puja/rahu-shanti', category: 'Graha Shanti', keywords: ['rahu', 'graha shanti', 'kaal sarp'] },

  // Learn
  { title: 'Learn Jyotish', titleHi: 'ज्योतिष सीखें', href: '/learn', category: 'Learn', keywords: ['learn', 'course', 'tutorial', 'basics'] },
  { title: 'Ganda Mula Nakshatras', titleHi: 'गण्ड मूल नक्षत्र', href: '/learn/modules/24-1', category: 'Learn', keywords: ['ganda mula', 'mula nakshatra', 'ashwini', 'ashlesha', 'magha', 'moola', 'revati'] },

  // Pricing
  { title: 'Pricing & Plans', titleHi: 'मूल्य और योजनाएं', href: '/pricing', category: 'Pages', keywords: ['pricing', 'pro', 'jyotishi', 'upgrade', 'subscribe'] },
];

export default function SearchModal() {
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => { setMounted(true); setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent)); }, []);

  // Cmd+K / Ctrl+K handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 8); // Show popular items when empty
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(item => {
      const title = (item.title + ' ' + (item.titleHi || '')).toLowerCase();
      const kw = (item.keywords || []).join(' ').toLowerCase();
      return title.includes(q) || kw.includes(q) || item.href.includes(q);
    }).slice(0, 12);
  }, [query]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      window.location.href = `/${locale}${results[selectedIdx].href}`;
      setOpen(false);
    }
  }

  if (!mounted || !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary/60 border border-gold-primary/10 rounded-lg hover:border-gold-primary/25 hover:text-text-secondary transition-all"
        aria-label="Search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{locale === 'en' ? 'Search' : 'खोजें'}</span>
        <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded bg-bg-secondary/50 border border-gold-primary/10 text-text-secondary/40 font-mono ml-1" suppressHydrationWarning>
          {isMac ? '⌘' : 'Ctrl+'}K
        </kbd>
      </button>
    );
  }

  const modal = (
    <div className="fixed inset-0 z-[9999]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gold-primary/10">
            <Search className="w-5 h-5 text-gold-primary/50 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
              onKeyDown={handleKeyDown}
              placeholder={locale === 'en' ? 'Search pages, festivals, tools...' : 'पृष्ठ, त्योहार, उपकरण खोजें...'}
              className="flex-1 bg-transparent text-text-primary text-base placeholder:text-text-secondary/40 focus:outline-none"
              autoComplete="off"
            />
            <button onClick={() => setOpen(false)} className="text-text-secondary/40 hover:text-text-secondary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center text-text-secondary/40 text-sm">
                {locale === 'en' ? 'No results found' : 'कोई परिणाम नहीं'}
              </div>
            ) : (
              results.map((item, i) => (
                <a
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`flex items-center justify-between px-5 py-3 transition-colors ${
                    i === selectedIdx ? 'bg-gold-primary/10' : 'hover:bg-gold-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-text-secondary/30 uppercase tracking-wider w-16 shrink-0">{item.category}</span>
                    <span className={`text-sm truncate ${i === selectedIdx ? 'text-gold-light font-semibold' : 'text-text-primary'}`}>
                      {locale === 'en' ? item.title : (item.titleHi || item.title)}
                    </span>
                  </div>
                  {i === selectedIdx && <ArrowRight className="w-3.5 h-3.5 text-gold-primary/50 shrink-0" />}
                </a>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-gold-primary/10 flex items-center justify-between text-xs text-text-secondary/30">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1 py-0.5 rounded bg-bg-secondary/50 border border-gold-primary/10 font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-bg-secondary/50 border border-gold-primary/10 font-mono">↵</kbd> open</span>
              <span><kbd className="px-1 py-0.5 rounded bg-bg-secondary/50 border border-gold-primary/10 font-mono">esc</kbd> close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
