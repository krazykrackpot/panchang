'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Patrika — Your Complete Astrological Document', hi: 'पत्रिका — आपका सम्पूर्ण ज्योतिषीय दस्तावेज़' , ta: 'பத்திரிகை — முழுமையான ஜோதிட ஆவணம்' },
  subtitle: {
    en: 'Understanding the traditional format of a Janam Kundali document and how to use it',
    hi: 'जन्म कुण्डली दस्तावेज़ के पारम्परिक प्रारूप और उसके उपयोग को समझें',
  },

  whatTitle: { en: 'What is a Patrika?', hi: 'पत्रिका क्या है?' },
  whatP1: {
    en: 'A Patrika (पत्रिका) — also called Janam Patri, Janam Kundali, or Janma Patrika — is the complete astrological document prepared at a person\'s birth. Traditionally, it was handwritten by the family astrologer on a folded sheet of paper or a small booklet, and kept safely throughout life as a reference for all major life decisions.',
    hi: 'पत्रिका — जिसे जन्म पत्री, जन्म कुण्डली या जन्म पत्रिका भी कहते हैं — एक व्यक्ति के जन्म पर तैयार किया जाने वाला सम्पूर्ण ज्योतिषीय दस्तावेज़ है। पारम्परिक रूप से, यह परिवार के ज्योतिषी द्वारा कागज़ पर हस्तलिखित किया जाता था और जीवन भर सभी प्रमुख निर्णयों के लिए सुरक्षित रखा जाता था।',
  },
  whatP2: {
    en: 'The Patrika is more than a chart — it is a comprehensive record that includes birth data, planetary positions with exact degrees, house placements, Vimshottari Dasha periods, active Yogas, Dosha analysis, and compatibility-relevant information. It serves as the "source document" that any astrologer can reference for consultations throughout your life.',
    hi: 'पत्रिका केवल एक चार्ट नहीं — यह एक व्यापक अभिलेख है जिसमें जन्म डेटा, सटीक अंशों के साथ ग्रह स्थितियाँ, भाव स्थान, विंशोत्तरी दशा अवधियाँ, सक्रिय योग, दोष विश्लेषण और मिलान-सम्बन्धित जानकारी शामिल है। यह "स्रोत दस्तावेज़" है जिसे कोई भी ज्योतिषी जीवन भर परामर्श के लिए सन्दर्भित कर सकता है।',
  },

  traditionalTitle: { en: 'Traditional Format vs Modern Digital', hi: 'पारम्परिक प्रारूप बनाम आधुनिक डिजिटल' },
  traditionalP1: {
    en: 'Traditional Patrikas were handwritten documents, often on specially prepared paper, sometimes with decorative borders and auspicious symbols. The astrologer would calculate everything manually using Panchangs and ephemeris tables. A single Patrika could take hours to prepare. The format varied by region:',
    hi: 'पारम्परिक पत्रिकाएँ हस्तलिखित दस्तावेज़ होती थीं, अक्सर विशेष तैयार कागज़ पर, कभी-कभी सजावटी किनारों और शुभ प्रतीकों के साथ। ज्योतिषी पंचांग और खगोलीय सारणियों से सब कुछ मैन्युअल रूप से गणना करता। एक पत्रिका तैयार करने में घंटों लग सकते थे:',
  },
  formats: [
    { format: { en: 'North Indian booklet', hi: 'उत्तर भारतीय पुस्तिका' }, detail: { en: 'A folded booklet with diamond-shaped charts, red ink for headings, and detailed handwritten calculations. Often enclosed in a red cloth.', hi: 'हीरे आकार के चार्ट के साथ एक मुड़ी पुस्तिका, शीर्षकों के लिए लाल स्याही और विस्तृत हस्तलिखित गणनाएँ। अक्सर लाल कपड़े में लिपटी।' } },
    { format: { en: 'South Indian palm leaf', hi: 'दक्षिण भारतीय ताड़ पत्र' }, detail: { en: 'Grid-style charts engraved or written on dried palm leaves, following the Tamil/Kannada tradition. Some families possess centuries-old collections (Nadi Granthas).', hi: 'तमिल/कन्नड़ परम्परा में सूखे ताड़ पत्रों पर उत्कीर्ण या लिखित ग्रिड शैली के चार्ट। कुछ परिवारों के पास सदियों पुराने संग्रह (नाड़ी ग्रन्थ) हैं।' } },
    { format: { en: 'Modern digital', hi: 'आधुनिक डिजिटल' }, detail: { en: 'Software-generated documents with exact calculations, multi-language support, color-coded charts, and printable PDF format. Our Patrika tab provides this — calculated to arc-second precision.', hi: 'सटीक गणनाओं, बहुभाषा समर्थन, रंग-कोडित चार्ट और प्रिंट करने योग्य PDF प्रारूप के साथ सॉफ्टवेयर-जनित दस्तावेज़। हमारा पत्रिका टैब यह प्रदान करता है — कला-सेकंड सटीकता तक गणना।' } },
  ],

  contentsTitle: { en: 'What is Included in a Patrika', hi: 'पत्रिका में क्या शामिल है' },
  sections: [
    { section: { en: 'Birth Data', hi: 'जन्म डेटा' }, detail: { en: 'Name, date, time (to the minute), place, timezone, and coordinates. This is the foundation — any error here makes the entire document unreliable. Our system records latitude/longitude for precise astronomical calculations.', hi: 'नाम, तिथि, समय (मिनट तक), स्थान, समय क्षेत्र और निर्देशांक। यह नींव है — यहाँ कोई त्रुटि सम्पूर्ण दस्तावेज़ को अविश्वसनीय बनाती है।' } },
    { section: { en: 'Birth Chart (Rashi Chart / D1)', hi: 'जन्म कुण्डली (राशि चार्ट / D1)' }, detail: { en: 'The main chart showing all 9 planets in 12 houses. The Ascendant sign, planet positions, and retrograde status are all encoded. This is what most people think of as "the Kundali."', hi: 'सभी 9 ग्रहों को 12 भावों में दिखाने वाला मुख्य चार्ट। लग्न राशि, ग्रह स्थितियाँ और वक्री स्थिति सभी कोडित। यही वह है जिसे अधिकांश लोग "कुण्डली" समझते हैं।' } },
    { section: { en: 'Planet Positions Table', hi: 'ग्रह स्थिति सारणी' }, detail: { en: 'Exact degree, minute, and second for each planet. Sign, nakshatra, nakshatra lord, and pada are listed. This table is essential for any astrologer to verify calculations independently.', hi: 'प्रत्येक ग्रह के लिए सटीक अंश, कला और विकला। राशि, नक्षत्र, नक्षत्र स्वामी और पाद सूचीबद्ध। यह सारणी किसी भी ज्योतिषी के लिए स्वतंत्र रूप से गणनाएँ सत्यापित करने के लिए आवश्यक।' } },
    { section: { en: 'Navamsha Chart (D9)', hi: 'नवांश चार्ट (D9)' }, detail: { en: 'The most important divisional chart — confirms the D1 reading and reveals marriage, dharma, and the soul\'s deeper nature. A planet strong in both D1 and D9 is reliably powerful.', hi: 'सबसे महत्वपूर्ण विभागीय चार्ट — D1 पठन की पुष्टि करता है और विवाह, धर्म और आत्मा के गहरे स्वरूप को प्रकट करता है।' } },
    { section: { en: 'Vimshottari Dasha Table', hi: 'विंशोत्तरी दशा सारणी' }, detail: { en: 'Complete Mahadasha and Antardasha periods from birth through the full 120-year cycle. Each period shows start/end dates. This is the timing roadmap of your life.', hi: 'जन्म से सम्पूर्ण 120-वर्ष चक्र तक की पूर्ण महादशा और अन्तर्दशा अवधियाँ। प्रत्येक अवधि आरम्भ/समाप्ति तिथियाँ दिखाती है। यह आपके जीवन का समय मानचित्र है।' } },
    { section: { en: 'Yogas', hi: 'योग' }, detail: { en: 'All identified Yogas — Raja, Dhana, Pancha Mahapurusha, Viparita, and others. Each yoga\'s forming planets and houses are listed so any astrologer can verify.', hi: 'सभी पहचाने गए योग — राज, धन, पंच महापुरुष, विपरीत आदि। प्रत्येक योग के निर्माण ग्रह और भाव सूचीबद्ध।' } },
    { section: { en: 'Dosha Analysis', hi: 'दोष विश्लेषण' }, detail: { en: 'Manglik status, Kala Sarpa, Pitru Dosha, and other challenging combinations with cancellation analysis. Essential for marriage matching.', hi: 'मांगलिक स्थिति, काल सर्प, पितृ दोष और अन्य चुनौतीपूर्ण संयोग, रद्दीकरण विश्लेषण सहित। विवाह मिलान के लिए आवश्यक।' } },
    { section: { en: 'Matching Data', hi: 'मिलान डेटा' }, detail: { en: 'Moon sign, nakshatra, pada, gana, nadi, vashya, and other Ashta Kuta factors needed for compatibility matching with a potential partner.', hi: 'चन्द्र राशि, नक्षत्र, पाद, गण, नाड़ी, वश्य और अन्य अष्ट कूट कारक जो सम्भावित साथी के साथ मिलान के लिए आवश्यक।' } },
  ],

  howToReadTitle: { en: 'How to Read Each Section', hi: 'प्रत्येक खण्ड कैसे पढ़ें' },
  howToReadP1: {
    en: 'A Patrika is designed to be self-contained — any qualified astrologer should be able to pick it up and give a reading without needing additional calculations. Here is how to approach each section:',
    hi: 'पत्रिका को स्व-सम्पूर्ण बनाया गया है — कोई भी योग्य ज्योतिषी इसे उठाकर बिना अतिरिक्त गणनाओं के पठन दे सकता है। प्रत्येक खण्ड कैसे देखें:',
  },
  readingSteps: [
    { step: { en: 'Start with the Rashi chart — identify the Ascendant, Moon, and Sun positions', hi: 'राशि चार्ट से शुरू करें — लग्न, चन्द्र और सूर्य की स्थिति पहचानें' } },
    { step: { en: 'Check the planet positions table for exact degrees and dignities (exalted/debilitated/retrograde)', hi: 'सटीक अंश और गरिमा (उच्च/नीच/वक्री) के लिए ग्रह स्थिति सारणी देखें' } },
    { step: { en: 'Cross-reference D1 with D9 (Navamsha) — planets strong in both are confirmed strengths', hi: 'D1 की D9 (नवांश) से तुलना करें — दोनों में बलवान ग्रह पुष्ट शक्तियाँ हैं' } },
    { step: { en: 'Note active Yogas — these define your major life themes and talents', hi: 'सक्रिय योग नोट करें — ये आपके प्रमुख जीवन विषय और प्रतिभाएँ परिभाषित करते हैं' } },
    { step: { en: 'Check Dasha periods — identify which period you are currently running', hi: 'दशा अवधियाँ देखें — पहचानें कि वर्तमान में कौन सी अवधि चल रही है' } },
    { step: { en: 'Review Dosha analysis for marriage considerations or challenging periods', hi: 'विवाह विचार या चुनौतीपूर्ण अवधियों के लिए दोष विश्लेषण समीक्षा करें' } },
  ],

  whenNeededTitle: { en: 'When You Need a Patrika', hi: 'पत्रिका कब चाहिए' },
  occasions: [
    { occasion: { en: 'Marriage matching (Kundali Milan)', hi: 'विवाह मिलान (कुण्डली मिलान)' }, detail: { en: 'The most common use — both families exchange Patrikas and an astrologer performs Ashta Kuta matching to assess compatibility. The 36-point Guna Milan system requires data from both charts.', hi: 'सबसे सामान्य उपयोग — दोनों परिवार पत्रिकाएँ आदान-प्रदान करते हैं और ज्योतिषी अनुकूलता का आकलन करने के लिए अष्ट कूट मिलान करता है।' } },
    { occasion: { en: 'Muhurta selection (auspicious timing)', hi: 'मुहूर्त चयन (शुभ समय)' }, detail: { en: 'Before starting a business, buying property, or performing ceremonies, the Patrika is consulted to identify favorable transit periods aligned with your Dasha.', hi: 'व्यापार शुरू करने, सम्पत्ति खरीदने या समारोह करने से पहले, आपकी दशा के अनुरूप अनुकूल गोचर अवधियों की पहचान के लिए पत्रिका देखी जाती है।' } },
    { occasion: { en: 'Career consultation', hi: 'कैरियर परामर्श' }, detail: { en: 'When facing career crossroads, an astrologer examines the 10th house, its lord, Dashamsha (D10), current Dasha, and relevant transits from your Patrika.', hi: 'कैरियर चौराहों पर, ज्योतिषी आपकी पत्रिका से 10वाँ भाव, उसका स्वामी, दशमांश, वर्तमान दशा और सम्बन्धित गोचर की जाँच करता है।' } },
    { occasion: { en: 'Health concerns', hi: 'स्वास्थ्य चिन्ताएँ' }, detail: { en: 'The 6th and 8th houses, their lords, and afflictions to specific body-part significators help identify vulnerable periods and organ systems.', hi: '6वाँ और 8वाँ भाव, उनके स्वामी और विशिष्ट शरीर-भाग सूचकों की पीड़ा कमज़ोर अवधियों और अंग प्रणालियों की पहचान में सहायक।' } },
    { occasion: { en: 'Naming a child (Namakarana)', hi: 'नामकरण' }, detail: { en: 'The baby\'s Moon nakshatra pada determines the first syllable of the name. The Patrika provides this information for the naming ceremony.', hi: 'शिशु का चन्द्र नक्षत्र पाद नाम का प्रथम अक्षर निर्धारित करता है। पत्रिका नामकरण संस्कार के लिए यह जानकारी प्रदान करती है।' } },
  ],

  exportTitle: { en: 'Export and Print Features', hi: 'निर्यात और प्रिंट सुविधाएँ' },
  exportP1: {
    en: 'On Dekho Panchang, the Patrika tab of your generated Kundali provides a complete, printable document. You can:',
    hi: 'देखो पंचांग पर, आपकी जनरेट कुण्डली का पत्रिका टैब एक सम्पूर्ण, प्रिंट करने योग्य दस्तावेज़ प्रदान करता है। आप:',
  },
  exportFeatures: [
    { feature: { en: 'Print as PDF — generates a beautifully formatted document suitable for sharing with astrologers or family', hi: 'PDF के रूप में प्रिंट — ज्योतिषियों या परिवार के साथ साझा करने के लिए सुन्दर स्वरूपित दस्तावेज़' } },
    { feature: { en: 'Save to your account — access your Patrika anytime from any device', hi: 'अपने खाते में सहेजें — किसी भी उपकरण से कभी भी अपनी पत्रिका देखें' } },
    { feature: { en: 'Share link — generate a unique URL for your chart that others can view', hi: 'लिंक साझा करें — अपनी कुण्डली का एक अद्वितीय URL बनाएँ जो अन्य देख सकें' } },
    { feature: { en: 'Bilingual output — Patrika generated in English + Hindi/Sanskrit', hi: 'द्विभाषी आउटपुट — अंग्रेज़ी + हिन्दी/संस्कृत में पत्रिका' } },
  ],

  furtherTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
  furtherLinks: [
    { href: '/learn/birth-chart', label: { en: 'Understanding Your Birth Chart', hi: 'जन्म कुण्डली समझें' } },
    { href: '/learn/dashas', label: { en: 'Dashas — Life Timing', hi: 'दशा — जीवन समय' } },
    { href: '/learn/matching', label: { en: 'Kundali Matching (Ashta Kuta)', hi: 'कुण्डली मिलान (अष्ट कूट)' } },
    { href: '/learn/yogas', label: { en: 'Yogas: Planetary Combinations', hi: 'योग: ग्रह संयोग' } },
    { href: '/learn/tippanni', label: { en: 'Tippanni: Chart Interpretation', hi: 'टिप्पणी: कुण्डली व्याख्या' } },
  ],
};

export default function PatrikaPage() {
  const locale = useLocale() as Locale;
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {((L.title as Record<string, string>)[locale] ?? L.title.en)}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{isHi ? L.subtitle.hi : L.subtitle.en}</p>
      </header>

      {/* 1. What is a Patrika */}
      <LessonSection number={1} title={isHi ? L.whatTitle.hi : L.whatTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.whatP1.hi : L.whatP1.en}</p>
          <p>{isHi ? L.whatP2.hi : L.whatP2.en}</p>
        </div>
      </LessonSection>

      {/* 2. Traditional vs Modern */}
      <LessonSection number={2} title={isHi ? L.traditionalTitle.hi : L.traditionalTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.traditionalP1.hi : L.traditionalP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.formats.map((f, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {isHi ? f.format.hi : f.format.en}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? f.detail.hi : f.detail.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 3. What's included */}
      <LessonSection number={3} title={isHi ? L.contentsTitle.hi : L.contentsTitle.en}>
        <div className="space-y-3">
          {L.sections.map((s, i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center text-gold-light text-xs font-bold">
                  {i + 1}
                </span>
                <h4 className="text-gold-light font-bold text-sm">{isHi ? s.section.hi : s.section.en}</h4>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed ml-7">{isHi ? s.detail.hi : s.detail.en}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 4. How to read */}
      <LessonSection number={4} title={isHi ? L.howToReadTitle.hi : L.howToReadTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.howToReadP1.hi : L.howToReadP1.en}</p>
          <ol className="space-y-2 mt-3">
            {L.readingSteps.map((s, i) => (
              <li key={i} className="flex gap-3 text-xs p-2 rounded-lg bg-bg-primary/30">
                <span className="text-gold-primary font-bold shrink-0">{i + 1}.</span>
                <span className="text-text-secondary">{isHi ? s.step.hi : s.step.en}</span>
              </li>
            ))}
          </ol>
        </div>
      </LessonSection>

      {/* 5. When you need it */}
      <LessonSection number={5} title={isHi ? L.whenNeededTitle.hi : L.whenNeededTitle.en}>
        <div className="space-y-3">
          {L.occasions.map((o, i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {isHi ? o.occasion.hi : o.occasion.en}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">{isHi ? o.detail.hi : o.detail.en}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 6. Export features */}
      <LessonSection number={6} title={isHi ? L.exportTitle.hi : L.exportTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.exportP1.hi : L.exportP1.en}</p>
          <ul className="space-y-2 mt-3">
            {L.exportFeatures.map((f, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{isHi ? f.feature.hi : f.feature.en}</span>
              </li>
            ))}
          </ul>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={isHi ? L.furtherTitle.hi : L.furtherTitle.en}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {L.furtherLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {isHi ? link.label.hi : link.label.en} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
