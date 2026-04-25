'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import dynamic from 'next/dynamic';
import LessonSection from '@/components/learn/LessonSection';
import { ChevronRight } from 'lucide-react';

// Lazy-load the heavy animator component
const YogaAnimator = dynamic(() => import('@/components/learn/YogaAnimator'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gold-primary border-t-transparent animate-spin" />
    </div>
  ),
});

/* ── Inline labels (4 active locales: en, hi, ta, bn) ─────────────────────── */
const LABELS = {
  title: {
    en: 'Yoga Formation Animator',
    hi: 'योग निर्माण एनीमेटर',
    ta: 'யோக அமைப்பு அனிமேட்டர்',
    bn: 'যোগ গঠন অ্যানিমেটর',
  },
  subtitle: {
    en: 'An interactive tool that animates how planets form classical Jyotish yogas — watch conditions tick green as each planet moves into position.',
    hi: 'एक अन्तरक्रियात्मक उपकरण जो दर्शाता है कि ग्रह कैसे शास्त्रीय ज्योतिष योग बनाते हैं।',
    ta: 'கிரகங்கள் எவ்வாறு யோகங்களை உருவாக்குகின்றன என்பதை அனிமேஷன் மூலம் காண்பிக்கும் ஒரு ஊடாடும் கருவி.',
    bn: 'একটি ইন্টারেক্টিভ টুল যা দেখায় কীভাবে গ্রহগুলি ক্লাসিকাল জ্যোতিষ যোগ তৈরি করে।',
  },
  s1Title: {
    en: 'Interactive Yoga Animator',
    hi: 'अन्तरक्रियात्मक योग एनीमेटर',
    ta: 'ஊடாடும் யோக அனிமேட்டர்',
    bn: 'ইন্টারেক্টিভ যোগ অ্যানিমেটর',
  },
  s2Title: {
    en: 'What is a Yoga?',
    hi: 'योग क्या है?',
    ta: 'யோகம் என்றால் என்ன?',
    bn: 'যোগ কী?',
  },
  s2Body: {
    en: 'In Jyotish (Vedic astrology), a "yoga" is a specific planetary combination that modifies the results of a birth chart. Unlike Western aspects, yogas are precise rules from classical texts like BPHS (Brihat Parashara Hora Shastra) specifying which planets must occupy which houses, signs, or mutual positions. When the conditions are met, the native receives the yoga\'s characteristic blessings or challenges throughout life — especially during the dasha of the planets involved.',
    hi: 'ज्योतिष में "योग" एक विशिष्ट ग्रह संयोजन है जो जन्म कुण्डली के फलों को संशोधित करता है। बृहत पाराशर होरा शास्त्र (BPHS) जैसे शास्त्रीय ग्रंथ स्पष्ट नियम देते हैं कि कौन से ग्रह किन भावों या राशियों में हों। जब शर्तें पूरी होती हैं, तो जातक को विशेषतः संबंधित ग्रहों की दशा में उस योग के फल मिलते हैं।',
    ta: 'ஜ்யோதிஷத்தில் "யோகம்" என்பது ஒரு குறிப்பிட்ட கிரக கலவை, இது ஜாதக பலன்களை மாற்றும். BPHS போன்ற சாஸ்திர நூல்கள் எந்த கிரகங்கள் எந்த வீட்டில் இருக்க வேண்டும் என்று தெளிவான விதிகளை தருகின்றன.',
    bn: 'জ্যোতিষে "যোগ" হল একটি নির্দিষ্ট গ্রহীয় সমন্বয় যা জন্মকুণ্ডলীর ফলাফল পরিবর্তন করে। BPHS-এর মতো শাস্ত্রীয় গ্রন্থগুলি স্পষ্ট নিয়ম দেয় যে কোন গ্রহ কোন ঘরে থাকতে হবে।',
  },
  s3Title: {
    en: 'The Five Mahapurusha Yogas',
    hi: 'पाँच महापुरुष योग',
    ta: 'ஐந்து மகாபுருஷ யோகங்கள்',
    bn: 'পাঁচটি মহাপুরুষ যোগ',
  },
  s3Body: {
    en: 'The Pancha Mahapurusha ("five great person") yogas are among the most celebrated in classical Jyotish. Each is formed by one of the five visible planets — Mars, Mercury, Jupiter, Venus, Saturn — being in a kendra (angular house: 1st, 4th, 7th, 10th from Lagna) AND in its own sign or exaltation sign. The Sun and Moon are excluded because they always hold supreme status. Each yoga confers the characteristic qualities of its planet in an exalted, worldly form.',
    hi: 'पंच महापुरुष योग ज्योतिष के सर्वाधिक प्रसिद्ध योगों में हैं। ये पाँच दृश्यमान ग्रहों — मंगल, बुध, बृहस्पति, शुक्र, शनि — में से एक के केन्द्र (लग्न से 1, 4, 7, 10) में स्वराशि या उच्च राशि में होने से बनते हैं।',
    ta: 'பஞ்ச மகாபுருஷ யோகங்கள் ஜ்யோதிஷத்தில் மிகவும் பிரபலமானவை. செவ்வாய், புதன், வியாழன், சுக்கிரன், சனி ஆகிய ஐந்து கிரகங்களில் ஒன்று கேந்திரத்தில் சொந்த அல்லது உச்ச ராசியில் இருக்கும்போது உருவாகின்றன.',
    bn: 'পঞ্চ মহাপুরুষ যোগ জ্যোতিষের সবচেয়ে বিখ্যাত যোগগুলির মধ্যে অন্যতম। মঙ্গল, বুধ, বৃহস্পতি, শুক্র, শনি — এই পাঁচটি দৃশ্যমান গ্রহের একটি কেন্দ্রে নিজ রাশি বা উচ্চ রাশিতে থাকলে গঠিত হয়।',
  },
  s4Title: {
    en: 'Kendra and Trikona: The Power Grid',
    hi: 'केन्द्र और त्रिकोण: शक्ति का ढाँचा',
    ta: 'கேந்திரம் மற்றும் திரிகோணம்: சக்தி அமைப்பு',
    bn: 'কেন্দ্র ও ত্রিকোণ: শক্তির কাঠামো',
  },
  s4Body: {
    en: 'The 12 houses of a chart are classified into groups based on their strength and significations. Kendras (1, 4, 7, 10) are the angular houses — the pillars of manifestation in the material world. Trikonas (1, 5, 9) are the trinal houses — the pillars of luck, dharma, and accumulated merit. The 1st house is both kendra and trikona, making Lagna extraordinarily powerful. When a kendra lord and trikona lord unite, they create "Raja Yoga" — combinations for success, authority, and prosperity.',
    hi: 'केन्द्र (1, 4, 7, 10) भौतिक जगत में अभिव्यक्ति के स्तम्भ हैं। त्रिकोण (1, 5, 9) भाग्य, धर्म और संचित पुण्य के स्तम्भ हैं। जब केन्द्र और त्रिकोण के स्वामी एक साथ आते हैं, तो राज योग बनता है।',
    ta: 'கேந்திரங்கள் (1, 4, 7, 10) பொருள் உலகில் வெளிப்பாட்டின் தூண்கள். திரிகோணங்கள் (1, 5, 9) அதிர்ஷ்டம் மற்றும் தர்மத்தின் தூண்கள். கேந்திர-திரிகோண அதிபர்கள் சேரும்போது ராஜ யோகம் உருவாகும்.',
    bn: 'কেন্দ্র (১, ৪, ৭, ১০) বস্তুজগতে প্রকাশের স্তম্ভ। ত্রিকোণ (১, ৫, ৯) ভাগ্য ও ধর্মের স্তম্ভ। কেন্দ্র-ত্রিকোণের স্বামীরা একসাথে এলে রাজ যোগ তৈরি হয়।',
  },
  deeperStudy: {
    en: 'Deeper Study',
    hi: 'गहन अध्ययन',
    ta: 'ஆழமான ஆய்வு',
    bn: 'গভীর অধ্যয়ন',
  },
  linkYogas: {
    en: 'Complete Yoga Reference',
    hi: 'सम्पूर्ण योग सन्दर्भ',
    ta: 'முழுமையான யோக குறிப்பு',
    bn: 'সম্পূর্ণ যোগ রেফারেন্স',
  },
  linkKundali: {
    en: 'Check Yogas in Your Chart',
    hi: 'अपनी कुण्डली में योग जाँचें',
    ta: 'உங்கள் ஜாதகத்தில் யோகங்களை சரிபாருங்கள்',
    bn: 'আপনার কুণ্ডলীতে যোগ পরীক্ষা করুন',
  },
  linkDashas: {
    en: 'When Yogas Activate: Dashas',
    hi: 'योग कब फल देते हैं: दशाएँ',
    ta: 'யோகங்கள் எப்போது செயல்படும்: தசைகள்',
    bn: 'যোগ কখন সক্রিয় হয়: দশা',
  },
};

type Locale = 'en' | 'hi' | 'ta' | 'bn';

function tl(obj: Record<string, string>, locale: string): string {
  return (obj as Record<string, string>)[locale] ?? obj.en ?? '';
}

export default function YogaAnimatorPage() {
  const locale = useLocale() as Locale;

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary text-xs font-bold uppercase tracking-widest mb-2">
          Interactive Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient">
          {tl(LABELS.title, locale)}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {tl(LABELS.subtitle, locale)}
        </p>
      </div>

      {/* ── Animator ── */}
      <LessonSection title={tl(LABELS.s1Title, locale)}>
        <div className="py-2">
          <YogaAnimator locale={locale} />
        </div>
      </LessonSection>

      {/* ── Educational content ── */}
      <LessonSection title={tl(LABELS.s2Title, locale)}>
        <p className="text-text-secondary leading-relaxed">{tl(LABELS.s2Body, locale)}</p>
      </LessonSection>

      <LessonSection title={tl(LABELS.s3Title, locale)}>
        <p className="text-text-secondary leading-relaxed">{tl(LABELS.s3Body, locale)}</p>
      </LessonSection>

      <LessonSection title={tl(LABELS.s4Title, locale)}>
        <p className="text-text-secondary leading-relaxed">{tl(LABELS.s4Body, locale)}</p>
      </LessonSection>

      {/* ── Cross-links ── */}
      <div className="border-t border-gold-primary/10 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">
          {tl(LABELS.deeperStudy, locale)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/yogas',  label: LABELS.linkYogas,   color: '#d4a853' },
            { href: '/kundali',      label: LABELS.linkKundali, color: '#50d890' },
            { href: '/learn/dashas', label: LABELS.linkDashas,  color: '#80b8f0' },
          ].map(({ href, label, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all group"
            >
              <span className="text-sm font-semibold" style={{ color }}>
                {tl(label, locale)}
              </span>
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                style={{ color }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
