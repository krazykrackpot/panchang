'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/patrika.json';

const FORMATS = [0, 1, 2] as const;
const SECTIONS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const STEPS = [0, 1, 2, 3, 4, 5] as const;
const OCCASIONS = [0, 1, 2, 3, 4] as const;
const FEATURES = [0, 1, 2, 3] as const;
const LINKS: { href: string; key: number }[] = [
  { href: '/learn/birth-chart', key: 0 },
  { href: '/learn/dashas', key: 1 },
  { href: '/learn/matching', key: 2 },
  { href: '/learn/yogas', key: 3 },
  { href: '/learn/tippanni', key: 4 },
];

export default function PatrikaPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const headingFont = getHeadingFont(locale);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
      </header>

      {/* 1. What is a Patrika */}
      <LessonSection number={1} title={t('whatTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('whatP1')}</p>
          <p>{t('whatP2')}</p>
        </div>
      </LessonSection>

      {/* 2. Traditional vs Modern */}
      <LessonSection number={2} title={t('traditionalTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('traditionalP1')}</p>
          <div className="space-y-3 mt-4">
            {FORMATS.map((i) => (
              <div key={i} className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {t(`format_${i}_name`)}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{t(`format_${i}_detail`)}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* New: Chart Layout Deep Dive */}
      <LessonSection number={0} title={isHi ? 'कुण्डली प्रारूप — उत्तर, दक्षिण और पूर्व भारतीय' : 'Chart Layouts — North, South, and East Indian'}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'उत्तर भारतीय हीरा प्रारूप' : 'North Indian Diamond Format'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">
              {isHi
                ? <>12 भाव निश्चित स्थितियों पर हैं — शीर्ष हीरा सदैव प्रथम भाव (लग्न) है। राशियाँ घूमती हैं: यदि लग्न वृषभ है, तो शीर्ष हीरा में &quot;2&quot; लिखा होगा, और ग्रह भावों में रखे जाते हैं। भाव स्थिति स्थिर, राशि परिवर्तनशील। यह मुहूर्त के लिए उपयोगी है क्योंकि भावों को तुरन्त देख सकते हैं (7वाँ भाव सदैव नीचे, 10वाँ सदैव बायें)।</>
                : <>12 houses occupy fixed positions — the top diamond is always the 1st house (Lagna). Signs rotate: if the Ascendant is Taurus, the top diamond shows &quot;2&quot;, and planets are placed in their house positions. House positions fixed, signs variable. This is useful for muhurta because houses are instantly readable (7th always at bottom, 10th always at left).</>}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'दक्षिण भारतीय वर्ग प्रारूप' : 'South Indian Square Format'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">
              {isHi
                ? <>12 राशियाँ निश्चित स्थितियों पर हैं — मीन सदैव ऊपर-बायें, मेष ऊपर-दूसरे, इत्यादि (घड़ी की दिशा में)। भाव घूमते हैं: लग्न जिस राशि में हो, उस कोष्ठ से प्रथम भाव आरम्भ होता है। राशि स्थिति स्थिर, भाव परिवर्तनशील। यह जन्म कुण्डली विश्लेषण के लिए उपयोगी है क्योंकि ग्रहों की राशि स्थिति तुरन्त दिखती है और दो कुण्डलियों की तुलना सरल है।</>
                : <>12 signs occupy fixed positions — Pisces is always top-left, Aries top-second, etc. (clockwise). Houses rotate: the 1st house starts from whichever box contains the Ascendant sign. Sign positions fixed, houses variable. This is useful for natal chart analysis because planetary sign positions are instantly visible and comparing two charts is easy.</>}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'पूर्व भारतीय प्रारूप' : 'East Indian (Bengal) Format'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">
              {isHi
                ? <>बंगाल, असम और ओडिशा में प्रचलित। दक्षिण भारतीय जैसा वर्ग प्रारूप, किन्तु लग्न सदैव शीर्ष-बायें कोष्ठ में और राशि क्रम वामावर्त (anti-clockwise) चलता है। यह तुलनात्मक रूप से कम प्रचलित है और डिजिटल सॉफ़्टवेयर में सामान्यतः उत्तर या दक्षिण प्रारूप ही प्रयोग होता है।</>
                : <>Used in Bengal, Assam, and Odisha. A square format similar to South Indian, but the Ascendant is always in the top-left box and signs proceed anti-clockwise. This is comparatively less common and digital software typically uses either North or South format.</>}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
            <h4 className="text-blue-300 font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'हमारा ऐप किसे प्रयोग करता है?' : 'Which Does Our App Use?'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? <>हमारा ऐप दोनों प्रमुख प्रारूप प्रदान करता है — उत्तर भारतीय हीरा (डिफ़ॉल्ट) और दक्षिण भारतीय वर्ग (टॉगल द्वारा)। उत्तर भारतीय प्रारूप मुहूर्त विश्लेषण के लिए डिफ़ॉल्ट है क्योंकि भाव स्थितियाँ तुरन्त पठनीय हैं। दक्षिण भारतीय प्रारूप जन्म कुण्डली तुलना के लिए बेहतर है। दोनों में ग्रह स्थान समान हैं — केवल प्रदर्शन भिन्न है।</>
                : <>Our app offers both major formats — North Indian diamond (default) and South Indian square (via toggle). North Indian is default for muhurta analysis because house positions are instantly readable. South Indian is better for natal chart comparison. Planet placements are identical in both — only the display differs.</>}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* 3. What's included */}
      <LessonSection number={3} title={t('contentsTitle')}>
        <div className="space-y-3">
          {SECTIONS.map((i) => (
            <div key={i} className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gold-primary/15 border border-gold-primary/25 flex items-center justify-center text-gold-light text-xs font-bold">
                  {i + 1}
                </span>
                <h4 className="text-gold-light font-bold text-sm">{t(`section_${i}_name`)}</h4>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed ml-7">{t(`section_${i}_detail`)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 4. How to read */}
      <LessonSection number={4} title={t('howToReadTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('howToReadP1')}</p>
          <ol className="space-y-2 mt-3">
            {STEPS.map((i) => (
              <li key={i} className="flex gap-3 text-xs p-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8">
                <span className="text-gold-primary font-bold shrink-0">{i + 1}.</span>
                <span className="text-text-secondary">{t(`step_${i}`)}</span>
              </li>
            ))}
          </ol>
        </div>
      </LessonSection>

      {/* New: Reading Tips */}
      <LessonSection number={0} title={isHi ? 'कुण्डली पठन सुझाव' : 'Chart Reading Tips'}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">{isHi ? 'प्रथम दृष्टि में क्या देखें' : 'What to Look for at First Glance'}</h4>
            <ul className="text-text-secondary text-xs space-y-2">
              <li>{isHi ? '• लग्न (प्रथम भाव) — जातक का मूल स्वभाव और शारीरिक बनावट' : '• Lagna (1st house) — the native\'s core personality and physical constitution'}</li>
              <li>{isHi ? '• चन्द्र राशि — मानसिक प्रकृति, भावनात्मक प्रतिक्रिया' : '• Moon sign — mental nature, emotional responses'}</li>
              <li>{isHi ? '• सूर्य राशि — आत्मा, पिता, अधिकार, जीवन उद्देश्य' : '• Sun sign — soul, father, authority, life purpose'}</li>
              <li>{isHi ? '• केन्द्र भाव (1, 4, 7, 10) में ग्रह — जीवन के स्तम्भ' : '• Planets in Kendra houses (1, 4, 7, 10) — pillars of life'}</li>
              <li>{isHi ? '• त्रिकोण भाव (1, 5, 9) में ग्रह — पुण्य और भाग्य' : '• Planets in Trikona houses (1, 5, 9) — merit and fortune'}</li>
              <li>{isHi ? '• दुष्टस्थान (6, 8, 12) में ग्रह — चुनौतियाँ और रूपान्तरण' : '• Planets in Dusthana (6, 8, 12) — challenges and transformation'}</li>
            </ul>
          </div>
        </div>
      </LessonSection>

      {/* 5. When you need it */}
      <LessonSection number={5} title={t('whenNeededTitle')}>
        <div className="space-y-3">
          {OCCASIONS.map((i) => (
            <div key={i} className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                {t(`occasion_${i}_name`)}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">{t(`occasion_${i}_detail`)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 6. Export features */}
      <LessonSection number={6} title={t('exportTitle')}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{t('exportP1')}</p>
          <ul className="space-y-2 mt-3">
            {FEATURES.map((i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{t(`feature_${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={t('furtherTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {t(`link_${link.key}_label`)} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
