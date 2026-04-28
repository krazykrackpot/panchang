import { getLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generatePersonLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { Mail, Globe, Code, BookOpen, Calculator, Shield } from 'lucide-react';

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
      { icon: 'book', label: 'Birth Chart Analysis', desc: 'Complete Kundali generation with Vimshottari Dasha, Shadbala, Ashtakavarga, Yogas, Doshas, and interpretive Tippanni — all computed locally, no external APIs.' },
      { icon: 'code', label: 'Open Computation', desc: 'All astronomical calculations use the Meeus algorithm suite. Sun positions accurate to ~0.01 degrees, Moon to ~0.5 degrees. No black-box APIs — pure, verifiable mathematics.' },
      { icon: 'shield', label: 'Privacy First', desc: 'Your birth data stays yours. We use Supabase with Row Level Security — users can only access their own data. No selling personal information to third parties.' },
      { icon: 'globe', label: 'Multilingual', desc: 'Available in 10 languages including Hindi, Tamil, Bengali, Telugu, Kannada, Marathi, Gujarati, Maithili, and Sanskrit. Real translations, not machine-generated.' },
      { icon: 'learn', label: '100+ Learning Modules', desc: 'A structured curriculum covering everything from Panchang basics to advanced Jaimini Jyotish, Shadbala, KP System, and Ashtakavarga — free for everyone.' },
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
  const l = (CONTENT as Record<string, typeof CONTENT.en>)[locale] || CONTENT.en;

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
