'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredConsent, storeConsent, updateConsentMode } from './consent-mode';

// Inline LABELS pattern — matches the privacy/terms pages. The cookie banner is
// the first thing every user sees; copy must exist for every locale we ship.
// English is the safety net; regional translations should be reviewed by native
// speakers but we prefer translated copy over an English fallback for compliance.
const COPY = {
  en: {
    title: 'We value your privacy',
    description:
      'We use cookies to enhance your experience, show personalized ads, and analyze site traffic. You can accept all cookies or reject non-essential ones.',
    accept: 'Accept all',
    reject: 'Reject all',
    learnMore: 'Privacy Policy',
  },
  hi: {
    title: 'हम आपकी गोपनीयता को महत्व देते हैं',
    description:
      'हम आपके अनुभव को बेहतर बनाने, वैयक्तिकृत विज्ञापन दिखाने और साइट ट्रैफ़िक का विश्लेषण करने के लिए कुकीज़ का उपयोग करते हैं। आप सभी कुकीज़ स्वीकार कर सकते हैं या गैर-आवश्यक को अस्वीकार कर सकते हैं।',
    accept: 'सभी स्वीकार करें',
    reject: 'सभी अस्वीकार करें',
    learnMore: 'गोपनीयता नीति',
  },
  sa: {
    title: 'वयं तव गोपनीयतायाः सम्मानं कुर्मः',
    description:
      'वयं भवतः अनुभवस्य संवर्धनार्थं, वैयक्तिकविज्ञापनप्रदर्शनार्थं, स्थलसञ्चारस्य विश्लेषणार्थं च कुकीसाधनं प्रयुञ्ज्महे। भवान् सर्वाणि स्वीकर्तुं वा अनावश्यकानि निराकर्तुं वा शक्नोति।',
    accept: 'सर्वाणि स्वीकुर्वन्तु',
    reject: 'सर्वाणि निराकुर्वन्तु',
    learnMore: 'गोपनीयतानीतिः',
  },
  ta: {
    title: 'உங்கள் தனியுரிமைக்கு நாங்கள் மதிப்பளிக்கிறோம்',
    description:
      'உங்கள் அனுபவத்தை மேம்படுத்தவும், தனிப்பயனாக்கப்பட்ட விளம்பரங்களைக் காட்டவும், தள போக்குவரத்தைப் பகுப்பாய்வு செய்யவும் குக்கீகளைப் பயன்படுத்துகிறோம். நீங்கள் அனைத்தையும் ஏற்கலாம் அல்லது அத்தியாவசியமற்றவற்றை நிராகரிக்கலாம்.',
    accept: 'அனைத்தையும் ஏற்கவும்',
    reject: 'அனைத்தையும் நிராகரிக்கவும்',
    learnMore: 'தனியுரிமைக் கொள்கை',
  },
  te: {
    title: 'మీ గోప్యతకు మేము విలువ ఇస్తాము',
    description:
      'మీ అనుభవాన్ని మెరుగుపరచడానికి, వ్యక్తిగతీకరించిన ప్రకటనలను చూపడానికి మరియు సైట్ ట్రాఫిక్‌ను విశ్లేషించడానికి మేము కుకీలను ఉపయోగిస్తాము. మీరు అన్నిటినీ అంగీకరించవచ్చు లేదా అనవసరమైనవాటిని తిరస్కరించవచ్చు.',
    accept: 'అన్నీ అంగీకరించండి',
    reject: 'అన్నీ తిరస్కరించండి',
    learnMore: 'గోప్యతా విధానం',
  },
  bn: {
    title: 'আমরা আপনার গোপনীয়তাকে মূল্য দিই',
    description:
      'আমরা আপনার অভিজ্ঞতা উন্নত করতে, ব্যক্তিগতকৃত বিজ্ঞাপন দেখাতে এবং সাইট ট্র্যাফিক বিশ্লেষণ করতে কুকিজ ব্যবহার করি। আপনি সমস্ত কুকিজ গ্রহণ করতে পারেন বা অপ্রয়োজনীয়গুলি প্রত্যাখ্যান করতে পারেন।',
    accept: 'সব গ্রহণ করুন',
    reject: 'সব প্রত্যাখ্যান করুন',
    learnMore: 'গোপনীয়তা নীতি',
  },
  kn: {
    title: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ನಾವು ಗೌರವಿಸುತ್ತೇವೆ',
    description:
      'ನಿಮ್ಮ ಅನುಭವವನ್ನು ಸುಧಾರಿಸಲು, ವೈಯಕ್ತೀಕರಿಸಿದ ಜಾಹೀರಾತುಗಳನ್ನು ತೋರಿಸಲು ಮತ್ತು ಸೈಟ್ ಟ್ರಾಫಿಕ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸಲು ನಾವು ಕುಕೀಸ್ ಬಳಸುತ್ತೇವೆ. ನೀವು ಎಲ್ಲವನ್ನೂ ಸ್ವೀಕರಿಸಬಹುದು ಅಥವಾ ಅನಗತ್ಯವಾದವುಗಳನ್ನು ತಿರಸ್ಕರಿಸಬಹುದು.',
    accept: 'ಎಲ್ಲವನ್ನೂ ಸ್ವೀಕರಿಸಿ',
    reject: 'ಎಲ್ಲವನ್ನೂ ತಿರಸ್ಕರಿಸಿ',
    learnMore: 'ಗೌಪ್ಯತಾ ನೀತಿ',
  },
  mr: {
    title: 'आम्ही आपल्या गोपनीयतेला महत्त्व देतो',
    description:
      'आपला अनुभव सुधारण्यासाठी, वैयक्तिकृत जाहिराती दाखवण्यासाठी आणि साइट रहदारीचे विश्लेषण करण्यासाठी आम्ही कुकीजचा वापर करतो. आपण सर्व स्वीकारू शकता किंवा अनावश्यक नाकारू शकता.',
    accept: 'सर्व स्वीकारा',
    reject: 'सर्व नाकारा',
    learnMore: 'गोपनीयता धोरण',
  },
  gu: {
    title: 'અમે તમારી ગોપનીયતાને મહત્વ આપીએ છીએ',
    description:
      'અમે તમારા અનુભવને બહેતર બનાવવા, વ્યક્તિગત જાહેરાતો બતાવવા અને સાઇટ ટ્રાફિકનું વિશ્લેષણ કરવા માટે કૂકીઝનો ઉપયોગ કરીએ છીએ. તમે બધી સ્વીકારી શકો છો અથવા બિન-આવશ્યકને નકારી શકો છો.',
    accept: 'બધું સ્વીકારો',
    reject: 'બધું નકારો',
    learnMore: 'ગોપનીયતા નીતિ',
  },
  mai: {
    title: 'हम अहाँक गोपनीयताक सम्मान करैत छी',
    description:
      'हम अहाँक अनुभव सुधारबाक लेल, वैयक्तिकृत विज्ञापन देखेबाक लेल आ साइट ट्रैफ़िकक विश्लेषण करबाक लेल कुकीजक उपयोग करैत छी। अहाँ सब किछु स्वीकार कऽ सकैत छी वा गैर-आवश्यक केँ अस्वीकार कऽ सकैत छी।',
    accept: 'सब स्वीकार करू',
    reject: 'सब अस्वीकार करू',
    learnMore: 'गोपनीयता नीति',
  },
} as const;

type LocaleKey = keyof typeof COPY;

interface CookieConsentProps {
  locale: string;
}

export default function CookieConsent({ locale }: CookieConsentProps) {
  // null = pre-mount (SSR) — render nothing to avoid hydration mismatch.
  // false = decided already, hide. true = undecided, show.
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      // Returning user. Re-apply consent so personalized ads work even if the
      // inline default script ran before localStorage was readable (rare but
      // possible on cold starts).
      updateConsentMode(stored.status);
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  if (show !== true) return null;

  const copy = (COPY as Record<string, (typeof COPY)[LocaleKey]>)[locale] || COPY.en;

  const handleAccept = () => {
    storeConsent('accepted');
    updateConsentMode('accepted');
    setShow(false);
  };

  const handleReject = () => {
    storeConsent('rejected');
    // No gtag update — Consent Mode v2 defaults already 'denied'.
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      aria-modal="false"
      className="fixed bottom-0 inset-x-0 z-[90] p-3 sm:p-5 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-gold-primary/30 bg-bg-secondary/95 backdrop-blur-md shadow-2xl shadow-bg-primary/60 p-4 sm:p-6 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2
              id="cookie-consent-title"
              className="text-base sm:text-lg font-semibold text-gold-light mb-1.5"
            >
              {copy.title}
            </h2>
            <p
              id="cookie-consent-desc"
              className="text-sm text-text-secondary leading-relaxed"
            >
              {copy.description}{' '}
              <Link
                href={`/${locale}/privacy`}
                className="underline text-gold-primary hover:text-gold-light transition-colors"
              >
                {copy.learnMore}
              </Link>
            </p>
          </div>
          <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[160px] shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
            >
              {copy.accept}
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gold-primary/30 bg-transparent text-text-primary font-semibold text-sm hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
            >
              {copy.reject}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
