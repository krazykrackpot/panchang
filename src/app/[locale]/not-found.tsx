// Round 2 UI-7 — not-found.tsx must render in the user's locale. Lesson J:
// "render English if regional translation is missing — never undefined or
// key path." Previous version was hardcoded English even when a Hindi/Tamil/
// Bengali/etc user landed on a typo URL — same UX failure as the Sprint-17
// i18n bombing for the navbar, but on 404 surface.
import { Link } from '@/lib/i18n/navigation';
import { useLocale } from 'next-intl';

type Locale = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai';

interface NotFoundCopy {
  title: string;
  body: string;
  home: string;
  panchang: string;
}

const COPY: Record<Locale, NotFoundCopy> = {
  en: {
    title: 'Page Not Found',
    body: 'The celestial path you seek does not exist. Perhaps the stars have a different alignment in mind.',
    home: 'Return Home',
    panchang: 'View Panchang',
  },
  hi: {
    title: 'पृष्ठ नहीं मिला',
    body: 'आप जिस मार्ग की खोज कर रहे हैं वह यहाँ नहीं है। शायद तारों की कोई अन्य योजना है।',
    home: 'मुख्य पृष्ठ पर जाएँ',
    panchang: 'पंचांग देखें',
  },
  ta: {
    title: 'பக்கம் காணப்படவில்லை',
    body: 'நீங்கள் தேடும் வழி இல்லை. வானம் வேறு வழியை வடிவமைத்துள்ளது.',
    home: 'முகப்பு பக்கம்',
    panchang: 'பஞ்சாங்கம் காண்க',
  },
  te: {
    title: 'పేజీ కనుగొనబడలేదు',
    body: 'మీరు వెతుకుతున్న మార్గం లేదు. బహుశా నక్షత్రాలు మరొక మార్గాన్ని సిద్ధం చేశాయి.',
    home: 'హోమ్‌కు తిరిగి',
    panchang: 'పంచాంగం చూడండి',
  },
  bn: {
    title: 'পৃষ্ঠা পাওয়া যায়নি',
    body: 'আপনি যে পথ খুঁজছেন তা এখানে নেই। হয়তো নক্ষত্রগুলি অন্য পথ স্থির করেছে।',
    home: 'মূল পৃষ্ঠায় ফিরুন',
    panchang: 'পঞ্জিকা দেখুন',
  },
  gu: {
    title: 'પેજ મળ્યું નથી',
    body: 'તમે જે માર્ગ શોધી રહ્યા છો તે અહીં નથી. કદાચ તારાઓએ બીજો માર્ગ વિચાર્યો છે.',
    home: 'મુખ્ય પૃષ્ઠ',
    panchang: 'પંચાંગ જુઓ',
  },
  kn: {
    title: 'ಪುಟ ಸಿಗಲಿಲ್ಲ',
    body: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಮಾರ್ಗ ಇಲ್ಲ. ಬಹುಶಃ ನಕ್ಷತ್ರಗಳು ಬೇರೆ ಮಾರ್ಗವನ್ನು ಯೋಜಿಸಿವೆ.',
    home: 'ಮುಖ್ಯ ಪುಟಕ್ಕೆ',
    panchang: 'ಪಂಚಾಂಗ ನೋಡಿ',
  },
  mai: {
    title: 'पन्ना नहि भेटल',
    body: 'अहाँ जे रास्ता ताकि रहल छी ओ एतय नहि अछि। शायद तारा कोनो आन योजना केने अछि।',
    home: 'मुख्य पन्ना',
    panchang: 'पंचांग देखू',
  },
};

export default function NotFound() {
  const locale = (useLocale() as Locale) ?? 'en';
  // Lesson J — fall back to en when an unexpected locale slips through.
  const t = COPY[locale] ?? COPY.en;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            404
          </div>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold-primary to-transparent" />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t.title}
        </h1>

        <p className="text-text-secondary mb-8 leading-relaxed">
          {t.body}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300"
          >
            {t.home}
          </Link>
          <Link
            href="/panchang"
            className="px-6 py-3 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
          >
            {t.panchang}
          </Link>
        </div>
      </div>
    </div>
  );
}
