import { getLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generatePersonLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { Mail, Globe, Code, BookOpen, Calculator, Shield } from 'lucide-react';

export const revalidate = 604800; // 7 days — static text page

// ---------------------------------------------------------------------------
// Inline multilingual content — server component, fully SSR for AdSense bot
// ---------------------------------------------------------------------------

const CONTENT = {
  en: {
    title: 'About Dekho Panchang',
    subtitle: 'Where ancient astronomical wisdom meets modern computation',
    authorHeading: 'About the Author',
    authorIntro: 'Dekho Panchang is built and maintained by',
    authorName: 'Aditya Kumar',
    authorHeritage: 'a Maithil Brahmin with deep roots in the Vedic tradition.',
    authorMission: 'This project was born from a simple conviction: that the astronomical and astrological wisdom preserved in texts like the Surya Siddhanta and Brihat Parashara Hora Shastra deserves to be accessible to everyone — not locked behind paywalls or simplified beyond recognition.',
    authorApproach: 'Every calculation on this site is done from first principles. Planetary positions use Jean Meeus\'s astronomical algorithms. Panchang elements are computed using classical Jyotish rules. There are no external astrology APIs — just mathematics, the same mathematics our ancestors encoded thousands of years ago, now running in your browser.',
    authorClosing: 'This is a passion project, not a corporation. If you find value in it, that is the best reward.',
    whatWeOffer: 'What We Offer',
    features: [
      { icon: 'calc', label: 'Precise Panchang', desc: 'Daily Tithi, Nakshatra, Yoga, Karana, and Muhurta timings computed for your exact location using astronomical algorithms verified within 1-2 minutes of reference sources.' },
      { icon: 'book', label: 'Professional-Grade Birth Chart', desc: '25+ analysis modules: Vimshottari/Ashtottari/Yogini Dashas, Shadbala (6-fold strength), Ashtakavarga, 16 divisional charts (D1-D60), 144 yoga patterns, KP System (Placidus sub-lords), Jaimini Karakas, Avasthas, Argala, Bhava Chalit — plus AI-powered chart chat. Computed locally from Swiss Ephemeris, no external APIs.' },
      { icon: 'code', label: 'NASA JPL Ephemeris Precision', desc: 'Primary engine: Swiss Ephemeris powered by NASA JPL DE441 planetary ephemeris — arcsecond accuracy for all 9 planets, the same data used by NASA for spacecraft navigation. Meeus algorithms as fallback. No black-box APIs — open, verifiable astronomical computation.' },
      { icon: 'shield', label: 'Privacy First', desc: 'Your birth data stays yours. We use Supabase with Row Level Security — users can only access their own data. No selling personal information to third parties.' },
      { icon: 'globe', label: 'Multilingual', desc: 'Available in 10 languages including Hindi, Tamil, Bengali, Telugu, Kannada, Marathi, Gujarati, Maithili, and Sanskrit. Real translations, not machine-generated.' },
      { icon: 'learn', label: '100+ Learning Modules', desc: 'A structured curriculum covering everything from Panchang basics to advanced Jaimini Jyotish, Shadbala, KP System, and Ashtakavarga — free for everyone.' },
    ],
    accuracyHeading: 'Accuracy & Methodology',
    accuracy: [
      { title: 'Ephemeris', text: 'Swiss Ephemeris v2.10 powered by NASA JPL DE441 — the same planetary ephemeris used by NASA for spacecraft navigation. Sub-arcsecond accuracy for Sun, Moon, and all planets including true lunar nodes (Rahu/Ketu).' },
      { title: 'Ayanamsha', text: 'Lahiri (Chitrapaksha) Ayanamsha as default — the Indian government standard used by the Indian Astronomical Ephemeris. Krishnamurti Ayanamsha available for KP System analysis.' },
      { title: 'Verification', text: '3,005 automated tests covering panchang accuracy, kundali computation, dasha periods, yoga detection, and festival dates. Regularly cross-verified against Prokerala and professional Hindu almanacs for multiple locations worldwide.' },
      { title: 'Sunrise Model', text: 'Swiss Ephemeris atmospheric refraction model accounting for observer elevation, temperature, and pressure. Verified within ±1 minute of professional panchang sources across Delhi, Bangalore, and New York.' },
    ],
    heritage: [
      { title: 'The Surya Siddhanta', text: 'The Surya Siddhanta (c. 400 CE) is one of the most remarkable astronomical texts in human history. It accurately calculates the sidereal year at 365.2563627 days — a figure astonishingly close to the modern value of 365.25636 days. It provides precise formulas for planetary positions, eclipse predictions, and the precession of equinoxes.' },
      { title: 'Aryabhata\'s Revolution', text: 'Aryabhata (476 CE) proposed that the Earth rotates on its axis — over a millennium before Copernicus. His Aryabhatiya contains sophisticated sine tables, pi accurate to 4 decimal places (3.1416), and algorithms for planetary calculations still admired today.' },
      { title: 'The Panchang System', text: 'The Panchang ("five limbs") is a lunisolar calendar tracking five astronomical elements: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (luni-solar angle), Karana (half-tithi), and Vara (weekday). It simultaneously tracks the Moon\'s position relative to the Sun and against fixed stars.' },
      { title: 'Ayanamsha: The Critical Correction', text: 'Indian astronomy accounts for precession of equinoxes through Ayanamsha — the angular difference between tropical and sidereal zodiacs. This ~50.3 arc-seconds/year precession completes one cycle in ~25,920 years. The Lahiri Ayanamsha is ~24 degrees currently.' },
      { title: 'Eclipses: Predictive Power', text: 'Indian astronomers identified Rahu and Ketu as the ascending and descending nodes of the Moon\'s orbit — where eclipses occur. The Saros cycle (~18 years) was independently discovered. Ancient eclipse computation tables show remarkable accuracy when verified against modern calculations.' },
    ],
    contactHeading: 'Contact Us',
    contactIntro: 'We would love to hear from you. Whether you have a question about our calculations, want to report a bug, or just want to say hello — reach out.',
    contactEmail: 'General inquiries',
    contactPrivacy: 'Privacy & data requests',
    contactLegal: 'Legal & terms',
    contactResponse: 'We typically respond within 48 hours.',
    heritageHeading: 'The Scientific Heritage of Indian Astronomy',
  },
  hi: {
    title: 'देखो पंचांग के बारे में',
    subtitle: 'जहाँ प्राचीन खगोलीय ज्ञान आधुनिक गणना से मिलता है',
    authorHeading: 'लेखक के बारे में',
    authorIntro: 'देखो पंचांग का निर्माण और रखरखाव',
    authorName: 'आदित्य कुमार',
    authorHeritage: 'द्वारा किया जाता है — एक मैथिल ब्राह्मण जिनकी जड़ें वैदिक परम्परा में गहरी हैं।',
    authorMission: 'यह परियोजना एक सरल विश्वास से जन्मी है: सूर्य सिद्धान्त और बृहत् पराशर होरा शास्त्र जैसे ग्रन्थों में संरक्षित खगोलीय और ज्योतिषीय ज्ञान सभी के लिए सुलभ होना चाहिए।',
    authorApproach: 'इस साइट पर प्रत्येक गणना मूल सिद्धान्तों से की जाती है। ग्रहों की स्थिति जीन मीउस के खगोलीय एल्गोरिदम पर आधारित है। पञ्चाङ्ग तत्व शास्त्रीय ज्योतिष नियमों से गणित हैं। कोई बाहरी ज्योतिष API नहीं — केवल गणित।',
    authorClosing: 'यह एक जुनून की परियोजना है, कोई निगम नहीं। यदि आपको इसमें मूल्य मिलता है, तो वही सबसे बड़ा पुरस्कार है।',
    whatWeOffer: 'हम क्या प्रदान करते हैं',
    features: [
      { icon: 'calc', label: 'सटीक पंचांग', desc: 'आपके सटीक स्थान के लिए दैनिक तिथि, नक्षत्र, योग, करण और मुहूर्त समय की गणना।' },
      { icon: 'book', label: 'जन्म कुण्डली विश्लेषण', desc: 'विंशोत्तरी दशा, षड्बल, अष्टकवर्ग, योग, दोष और टिप्पणी सहित पूर्ण कुण्डली।' },
      { icon: 'code', label: 'खुली गणना', desc: 'सभी गणनाएं मीउस एल्गोरिदम पर आधारित हैं। कोई बाहरी API नहीं — शुद्ध गणित।' },
      { icon: 'shield', label: 'गोपनीयता प्रथम', desc: 'आपका जन्म डेटा आपका है। Row Level Security के साथ Supabase।' },
      { icon: 'globe', label: 'बहुभाषी', desc: '10 भाषाओं में उपलब्ध — हिन्दी, तमिल, बंगाली, तेलुगु, कन्नड़, मराठी, गुजराती, मैथिली और संस्कृत।' },
      { icon: 'learn', label: '100+ शिक्षण मॉड्यूल', desc: 'पंचांग मूल बातों से लेकर उन्नत ज्योतिष तक संरचित पाठ्यक्रम — सभी के लिए मुफ्त।' },
    ],
    accuracyHeading: 'सटीकता और कार्यप्रणाली',
    accuracy: [
      { title: 'पंचांग', text: 'स्विस एफ़ेमेरिस v2.10 — NASA JPL DE441 ग्रहीय पंचांग पर आधारित। सभी ग्रहों के लिए उप-आर्क-सेकंड सटीकता — वही डेटा जो NASA अन्तरिक्ष यान नेविगेशन के लिए उपयोग करता है।' },
      { title: 'अयनांश', text: 'लाहिरी (चित्रापक्ष) अयनांश मानक — भारत सरकार का आधिकारिक मानक। KP प्रणाली विश्लेषण के लिए कृष्णमूर्ति अयनांश भी उपलब्ध।' },
      { title: 'सत्यापन', text: '3,005 स्वचालित परीक्षण — पंचांग सटीकता, कुण्डली गणना, दशा अवधि, योग पहचान और त्योहार तिथियों को कवर करते हैं। प्रोकेराला और पेशेवर हिन्दू पंचांगों से नियमित रूप से सत्यापित।' },
      { title: 'सूर्योदय मॉडल', text: 'स्विस एफ़ेमेरिस वायुमण्डलीय अपवर्तन मॉडल। दिल्ली, बेंगलुरु और न्यूयॉर्क में पेशेवर पंचांग स्रोतों से ±1 मिनट के भीतर सत्यापित।' },
    ],
    heritage: [
      { title: 'सूर्य सिद्धान्त', text: 'सूर्य सिद्धान्त (लगभग 400 ई.) मानव इतिहास के सबसे उल्लेखनीय खगोलीय ग्रन्थों में से एक है। यह नाक्षत्र वर्ष की गणना 365.2563627 दिनों पर करता है — जो आधुनिक मान के आश्चर्यजनक रूप से निकट है।' },
      { title: 'आर्यभट की क्रान्ति', text: 'आर्यभट (476 ई.) ने प्रस्तावित किया कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से एक सहस्राब्दी पहले। उनके आर्यभटीय में परिष्कृत ज्या सारणियाँ और पाई 4 दशमलव तक सटीक (3.1416) है।' },
      { title: 'पञ्चाङ्ग प्रणाली', text: 'पञ्चाङ्ग ("पाँच अंग") एक चान्द्र-सौर कालदर्शिका है जो प्रतिदिन पाँच खगोलीय तत्वों — तिथि, नक्षत्र, योग, करण और वार — को ट्रैक करती है।' },
      { title: 'अयनांश: महत्वपूर्ण सुधार', text: 'भारतीय खगोल विज्ञान अयनांश के माध्यम से विषुव अयन गति का हिसाब रखता है — साायन और निरायन राशिचक्रों के बीच का कोणीय अन्तर। यह ~50.3 आर्क-सेकंड/वर्ष प्रिसेशन ~25,920 वर्षों में एक चक्र पूरा करती है।' },
      { title: 'ग्रहण: भविष्यवाणी शक्ति', text: 'भारतीय खगोलविदों ने राहु और केतु को चन्द्रमा की कक्षा के आरोही और अवरोही पात बिन्दुओं के रूप में पहचाना — जहाँ ग्रहण होते हैं।' },
    ],
    contactHeading: 'संपर्क करें',
    contactIntro: 'हम आपसे सुनना चाहेंगे। चाहे आपका कोई प्रश्न हो, बग रिपोर्ट करना हो, या बस नमस्ते कहना हो — संपर्क करें।',
    contactEmail: 'सामान्य पूछताछ',
    contactPrivacy: 'गोपनीयता और डेटा अनुरोध',
    contactLegal: 'कानूनी और शर्तें',
    contactResponse: 'हम आमतौर पर 48 घंटों के भीतर उत्तर देते हैं।',
    heritageHeading: 'भारतीय खगोल विज्ञान की वैज्ञानिक विरासत',
  },
};

function getIcon(icon: string) {
  const cls = 'w-6 h-6 text-gold-primary';
  switch (icon) {
    case 'calc': return <Calculator className={cls} />;
    case 'book': return <BookOpen className={cls} />;
    case 'code': return <Code className={cls} />;
    case 'shield': return <Shield className={cls} />;
    case 'globe': return <Globe className={cls} />;
    case 'learn': return <BookOpen className={cls} />;
    default: return <Globe className={cls} />;
  }
}

export default async function AboutPage() {
  const locale = await getLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (CONTENT as unknown as Record<string, typeof CONTENT.en>)[locale] || CONTENT.en;

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Person JSON-LD — E-E-A-T signal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(generatePersonLD()) }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-primary/30 bg-gold-primary/10">
          <span className="text-gold-light text-sm font-medium">{l.title}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent"
          style={headingFont}
        >
          {l.title}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{l.subtitle}</p>
      </div>

      {/* Author Section — E-E-A-T */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.authorHeading}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 space-y-4">
          <p className="text-text-primary leading-relaxed text-lg">
            {l.authorIntro} <span className="text-gold-light font-semibold">{l.authorName}</span> — {l.authorHeritage}
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">{l.authorMission}</p>
          <p className="text-text-secondary leading-relaxed text-lg">{l.authorApproach}</p>
          <p className="text-text-secondary leading-relaxed text-lg italic">{l.authorClosing}</p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.whatWeOffer}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {l.features.map((f, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center">
                  {getIcon(f.icon)}
                </div>
                <h3 className="text-gold-light font-semibold">{f.label}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accuracy & Methodology — addresses ChatGPT/LLM "accuracy not clear" criticism */}
      {l.accuracy && (
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.accuracyHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {l.accuracy.map((a: { title: string; text: string }, i: number) => (
              <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
                <h3 className="text-gold-light font-semibold text-sm mb-2">{a.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Heritage */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.heritageHeading}</h2>
        <div className="space-y-6">
          {l.heritage.map((h, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gold-light mb-3" style={headingFont}>{h.title}</h3>
              <p className="text-text-secondary leading-relaxed text-lg">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us — required by AdSense */}
      <section className="max-w-4xl mx-auto mb-16" id="contact">
        <h2 className="text-2xl font-bold text-gold-light mb-6" style={headingFont}>{l.contactHeading}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8">
          <p className="text-text-secondary text-lg leading-relaxed mb-8">{l.contactIntro}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactEmail}</p>
                <a href="mailto:hello@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  hello@dekhopanchang.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactPrivacy}</p>
                <a href="mailto:privacy@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  privacy@dekhopanchang.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-gold-primary" />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{l.contactLegal}</p>
                <a href="mailto:legal@dekhopanchang.com" className="text-gold-light hover:text-gold-primary transition-colors font-medium">
                  legal@dekhopanchang.com
                </a>
              </div>
            </div>
          </div>
          <p className="text-text-secondary/60 text-sm mt-6">{l.contactResponse}</p>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gold-primary/10">
            <span className="text-text-secondary text-sm">{locale === 'hi' ? 'हमसे जुड़ें' : locale === 'ta' ? 'எங்களை தொடருங்கள்' : locale === 'bn' ? 'আমাদের অনুসরণ করুন' : 'Follow us'}:</span>
            <a href="https://x.com/dekhopanchang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @dekhopanchang
            </a>
            <a href="https://www.youtube.com/@DekhoPanchang" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-[#ff0000] hover:border-[#ff0000]/30 transition-all text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>
            <a href="https://www.instagram.com/dekhopanchang/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-text-secondary hover:text-[#e4405f] hover:border-[#e4405f]/30 transition-all text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-text-secondary/50 text-sm">
          Dekho Panchang &mdash; dekhopanchang.com
        </p>
      </div>
    </main>
  );
}
