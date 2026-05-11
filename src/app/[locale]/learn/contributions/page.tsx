import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';

export const revalidate = 604800; // 7 days -- static content

const LABELS: Record<string, LocaleText> = {
  title: { en: 'Indian Contributions to Science', hi: 'विज्ञान में भारतीय योगदान', sa: 'विज्ञाने भारतीययोगदानम्', ta: 'அறிவியலுக்கான இந்திய பங்களிப்புகள்', bn: 'বিজ্ঞানে ভারতীয় অবদান' },
  subtitle: {
    en: 'From zero to calculus, from gravity to the speed of light -- India\'s mathematical and scientific legacy shaped the modern world.',
    hi: 'शून्य से कैलकुलस तक, गुरुत्वाकर्षण से प्रकाश की गति तक -- भारत की गणितीय और वैज्ञानिक विरासत ने आधुनिक विश्व को आकार दिया।',
    sa: 'शून्यात् कलनगणनापर्यन्तं, गुरुत्वात् प्रकाशवेगपर्यन्तम् -- भारतस्य गणितवैज्ञानिकपरम्परा आधुनिकविश्वम् अरूपयत्।',
    ta: 'சுழியத்திலிருந்து கால்குலஸ் வரை, புவியீர்ப்பிலிருந்து ஒளியின் வேகம் வரை -- இந்தியாவின் கணித மற்றும் அறிவியல் மரபு நவீன உலகை வடிவமைத்தது.',
    bn: 'শূন্য থেকে ক্যালকুলাস, মহাকর্ষ থেকে আলোর গতি পর্যন্ত -- ভারতের গণিত ও বৈজ্ঞানিক ঐতিহ্য আধুনিক বিশ্বকে রূপ দিয়েছে।',
  },
  backToLearn: { en: 'Back to Learn', hi: 'सीखें पर वापस', sa: 'अध्ययनं प्रति', ta: 'கற்றலுக்குத் திரும்பு', bn: 'শেখায় ফিরুন' },
  articles: { en: 'articles', hi: 'लेख', sa: 'लेखाः', ta: 'கட்டுரைகள்', bn: 'নিবন্ধ' },
};

const ARTICLES: { slug: string; title: LocaleText; description: LocaleText; icon: string }[] = [
  {
    slug: 'zero',
    title: { en: 'Zero -- The Most Dangerous Idea', hi: 'शून्य -- सबसे खतरनाक विचार', ta: 'சுழியம் -- மிக ஆபத்தான கருத்து', bn: 'শূন্য -- সবচেয়ে বিপজ্জনক ধারণা' },
    description: { en: 'How Brahmagupta turned nothingness into the foundation of all computation.', hi: 'कैसे ब्रह्मगुप्त ने शून्यता को सम्पूर्ण गणना की नींव बनाया।', ta: 'பிரம்மகுப்தர் எப்படி வெறுமையை கணிப்பின் அடித்தளமாக மாற்றினார்.', bn: 'ব্রহ্মগুপ্ত কীভাবে শূন্যতাকে সমস্ত গণনার ভিত্তিতে পরিণত করেছিলেন।' },
    icon: '0',
  },
  {
    slug: 'sine',
    title: { en: 'Sine Is Sanskrit -- Jya to Sine', hi: 'साइन संस्कृत है -- ज्या से साइन', ta: 'சைன் சமஸ்கிருதம் -- ஜ்யா முதல் சைன் வரை', bn: 'সাইন সংস্কৃত -- জ্যা থেকে সাইন' },
    description: { en: 'The trigonometric function that powers GPS, music, and physics began as a Sanskrit word.', hi: 'त्रिकोणमितीय फ़ंक्शन जो GPS, संगीत और भौतिकी को शक्ति देता है, एक संस्कृत शब्द से शुरू हुआ।', ta: 'GPS, இசை, இயற்பியலுக்கு ஆற்றல் தரும் முக்கோணவியல் செயல்பாடு ஒரு சமஸ்கிருத வார்த்தையாகத் தொடங்கியது.', bn: 'যে ত্রিকোণমিতিক ফাংশন GPS, সঙ্গীত এবং পদার্থবিদ্যাকে চালিত করে তা একটি সংস্কৃত শব্দ হিসেবে শুরু হয়েছিল।' },
    icon: 'sin',
  },
  {
    slug: 'pi',
    title: { en: 'Pi = 3.1416 -- Aryabhata\'s Approximation', hi: 'पाई = 3.1416 -- आर्यभट्ट का सन्निकटन', ta: 'பை = 3.1416 -- ஆர்யபட்டரின் தோராயம்', bn: 'পাই = ৩.১৪১৬ -- আর্যভট্টের সান্নিকটন' },
    description: { en: 'In 499 CE Aryabhata nailed pi to four decimal places -- 1100 years before Europe.', hi: '499 ई. में आर्यभट्ट ने पाई को चार दशमलव स्थानों तक सटीक किया -- यूरोप से 1100 वर्ष पहले।', ta: '499 கி.பி.-ல் ஆர்யபட்டர் பையை நான்கு தசம இடங்களுக்கு கணக்கிட்டார் -- ஐரோப்பாவுக்கு 1100 ஆண்டுகள் முன்பு.', bn: '৪৯৯ খ্রিস্টাব্দে আর্যভট্ট পাই-কে চার দশমিক স্থান পর্যন্ত সঠিক করেছিলেন -- ইউরোপের ১১০০ বছর আগে।' },
    icon: 'pi',
  },
  {
    slug: 'negative-numbers',
    title: { en: 'Negative Numbers -- Debt Before Descartes', hi: 'ऋणात्मक संख्याएँ -- देकार्ट से पहले ऋण', ta: 'எதிர்மறை எண்கள் -- டெகார்ட்டுக்கு முன் கடன்', bn: 'ঋণাত্মক সংখ্যা -- দেকার্তের আগে ঋণ' },
    description: { en: 'Indian mathematicians used negative numbers centuries before Europeans accepted them.', hi: 'भारतीय गणितज्ञों ने यूरोपीयों द्वारा स्वीकार करने से सदियों पहले ऋणात्मक संख्याओं का उपयोग किया।', ta: 'ஐரோப்பியர்கள் ஏற்றுக்கொள்வதற்கு நூற்றாண்டுகள் முன்பே இந்திய கணிதவியலாளர்கள் எதிர்மறை எண்களைப் பயன்படுத்தினர்.', bn: 'ইউরোপীয়দের গ্রহণ করার বহু শতাব্দী আগে ভারতীয় গণিতবিদরা ঋণাত্মক সংখ্যা ব্যবহার করেছিলেন।' },
    icon: '-n',
  },
  {
    slug: 'binary',
    title: { en: 'Binary Code -- 1800 Years Before Computers', hi: 'बाइनरी कोड -- कंप्यूटर से 1800 वर्ष पहले', ta: 'பைனரி குறியீடு -- கணினிகளுக்கு 1800 ஆண்டுகள் முன்பு', bn: 'বাইনারি কোড -- কম্পিউটারের ১৮০০ বছর আগে' },
    description: { en: 'Pingala\'s chandas shastra encoded binary mathematics in Vedic metre patterns.', hi: 'पिंगल के छन्दःशास्त्र ने वैदिक छन्द पद्धतियों में बाइनरी गणित को कोडित किया।', ta: 'பிங்களரின் சந்தஸ் சாஸ்திரம் வேத சந்தங்களில் பைனரி கணிதத்தை குறியீடாக்கியது.', bn: 'পিঙ্গলের ছন্দঃশাস্ত্র বৈদিক ছন্দ পদ্ধতিতে বাইনারি গণিত এনকোড করেছিল।' },
    icon: '01',
  },
  {
    slug: 'fibonacci',
    title: { en: 'Fibonacci Started With Indian Music', hi: 'फिबोनाची भारतीय संगीत से शुरू हुआ', ta: 'ஃபிபொனச்சி இந்திய இசையிலிருந்து தொடங்கியது', bn: 'ফিবোনাচি শুরু হয়েছিল ভারতীয় সঙ্গীত থেকে' },
    description: { en: 'The Fibonacci sequence was discovered by Indian scholars studying musical rhythms.', hi: 'फिबोनाची अनुक्रम भारतीय विद्वानों ने संगीत लय का अध्ययन करते हुए खोजा था।', ta: 'ஃபிபொனச்சி தொடர் இசை தாளங்களை ஆய்வு செய்த இந்திய அறிஞர்களால் கண்டுபிடிக்கப்பட்டது.', bn: 'ফিবোনাচি ক্রমটি সঙ্গীতের ছন্দ অধ্যয়নরত ভারতীয় পণ্ডিতরা আবিষ্কার করেছিলেন।' },
    icon: 'Fn',
  },
  {
    slug: 'al-khwarizmi',
    title: { en: 'Al-Khwarizmi -- The Bridge to Europe', hi: 'अल-ख्वारिज़्मी -- यूरोप का सेतु', ta: 'அல்-குவாரிஸ்மி -- ஐரோப்பாவுக்கான பாலம்', bn: 'আল-খোয়ারিজমি -- ইউরোপের সেতু' },
    description: { en: 'How a Baghdad scholar transmitted Indian numerals to the world and gave us "algorithm".', hi: 'कैसे एक बगदाद के विद्वान ने भारतीय अंकों को विश्व में प्रसारित किया और हमें "एल्गोरिदम" दिया।', ta: 'ஒரு பாக்தாத் அறிஞர் எப்படி இந்திய எண்களை உலகிற்கு கொண்டு சென்று "அல்காரிதம்" கொடுத்தார்.', bn: 'বাগদাদের একজন পণ্ডিত কীভাবে ভারতীয় সংখ্যা বিশ্বে প্রেরণ করেছিলেন এবং আমাদের "অ্যালগরিদম" দিয়েছিলেন।' },
    icon: 'x',
  },
  {
    slug: 'calculus',
    title: { en: 'Calculus -- Kerala, Not Cambridge', hi: 'कैलकुलस -- केरल, कैम्ब्रिज नहीं', ta: 'கால்குலஸ் -- கேரளா, கேம்பிரிட்ஜ் அல்ல', bn: 'ক্যালকুলাস -- কেরালা, কেমব্রিজ নয়' },
    description: { en: 'The Kerala School developed infinite series and proto-calculus 200 years before Newton.', hi: 'केरल स्कूल ने न्यूटन से 200 वर्ष पहले अनंत श्रेणी और प्रोटो-कैलकुलस विकसित किया।', ta: 'நியூட்டனுக்கு 200 ஆண்டுகள் முன்பு கேரளப் பள்ளி எல்லையற்ற தொடர்களையும் முன்-கால்குலஸையும் உருவாக்கியது.', bn: 'কেরালা স্কুল নিউটনের ২০০ বছর আগে অসীম ধারা এবং প্রোটো-ক্যালকুলাস উন্নত করেছিল।' },
    icon: 'dx',
  },
  {
    slug: 'pythagoras',
    title: { en: 'The "Pythagorean" Theorem -- 300 Years Before Pythagoras', hi: '"पाइथागोरस" प्रमेय -- पाइथागोरस से 300 वर्ष पहले', ta: '"பித்தகோரஸ்" தேற்றம் -- பித்தகோரஸுக்கு 300 ஆண்டுகள் முன்பு', bn: '"পিথাগোরিয়ান" উপপাদ্য -- পিথাগোরাসের ৩০০ বছর আগে' },
    description: { en: 'Baudhayana\'s Shulba Sutra described this theorem centuries before Greece.', hi: 'बौधायन के शुल्ब सूत्र ने यूनान से सदियों पहले इस प्रमेय का वर्णन किया।', ta: 'பௌதாயனரின் சுல்ப சூத்திரம் கிரேக்கத்திற்கு நூற்றாண்டுகள் முன்பு இந்த தேற்றத்தை விவரித்தது.', bn: 'বৌধায়নের শুল্ব সূত্র গ্রিসের শতাব্দী আগে এই উপপাদ্য বর্ণনা করেছিল।' },
    icon: 'a2',
  },
  {
    slug: 'kerala-school',
    title: { en: 'Kerala School -- When India Invented Calculus', hi: 'केरल स्कूल -- जब भारत ने कैलकुलस का आविष्कार किया', ta: 'கேரளப் பள்ளி -- இந்தியா கால்குலஸை கண்டுபிடித்தபோது', bn: 'কেরালা স্কুল -- যখন ভারত ক্যালকুলাস আবিষ্কার করেছিল' },
    description: { en: 'Madhava and the Kerala astronomers who changed the world from a village.', hi: 'माधव और केरल खगोलविद जिन्होंने एक गाँव से विश्व बदल दिया।', ta: 'மாதவர் மற்றும் கேரள வானியலாளர்கள் ஒரு கிராமத்திலிருந்து உலகை மாற்றினர்.', bn: 'মাধব এবং কেরালার জ্যোতির্বিদরা যারা একটি গ্রাম থেকে বিশ্ব পরিবর্তন করেছিলেন।' },
    icon: 'inf',
  },
  {
    slug: 'earth-rotation',
    title: { en: 'Earth Rotates -- 1000 Years Before Europe', hi: 'पृथ्वी घूमती है -- यूरोप से 1000 वर्ष पहले', ta: 'பூமி சுழல்கிறது -- ஐரோப்பாவுக்கு 1000 ஆண்டுகள் முன்பு', bn: 'পৃথিবী ঘোরে -- ইউরোপের ১০০০ বছর আগে' },
    description: { en: 'Aryabhata stated that Earth rotates on its axis in 499 CE.', hi: 'आर्यभट्ट ने 499 ई. में कहा कि पृथ्वी अपनी धुरी पर घूमती है।', ta: '499 கி.பி.-ல் ஆர்யபட்டர் பூமி தன் அச்சில் சுழல்கிறது என்று கூறினார்.', bn: '৪৯৯ খ্রিস্টাব্দে আর্যভট্ট বলেছিলেন যে পৃথিবী তার অক্ষে ঘোরে।' },
    icon: 'E',
  },
  {
    slug: 'gravity',
    title: { en: 'Gravity -- 500 Years Before Newton', hi: 'गुरुत्वाकर्षण -- न्यूटन से 500 वर्ष पहले', ta: 'புவியீர்ப்பு -- நியூட்டனுக்கு 500 ஆண்டுகள் முன்பு', bn: 'মহাকর্ষ -- নিউটনের ৫০০ বছর আগে' },
    description: { en: 'Bhaskaracharya described gravitational attraction in the 12th century.', hi: 'भास्कराचार्य ने 12वीं शताब्दी में गुरुत्वाकर्षण बल का वर्णन किया।', ta: '12-ஆம் நூற்றாண்டில் பாஸ்கராச்சார்யர் புவியீர்ப்பு ஈர்ப்பை விவரித்தார்.', bn: 'দ্বাদশ শতাব্দীতে ভাস্করাচার্য মহাকর্ষীয় আকর্ষণ বর্ণনা করেছিলেন।' },
    icon: 'g',
  },
  {
    slug: 'speed-of-light',
    title: { en: 'Speed of Light -- 14th Century Text', hi: 'प्रकाश की गति -- 14वीं शताब्दी का ग्रंथ', ta: 'ஒளியின் வேகம் -- 14-ஆம் நூற்றாண்டு நூல்', bn: 'আলোর গতি -- ১৪শ শতাব্দীর গ্রন্থ' },
    description: { en: 'Sayana\'s Rig Veda commentary gives a remarkably accurate speed of light.', hi: 'सायण की ऋग्वेद टीका में प्रकाश की गति का उल्लेखनीय रूप से सटीक मान दिया गया है।', ta: 'சாயணரின் ரிக் வேத விளக்கவுரை ஒளியின் வேகத்தை குறிப்பிடத்தக்க துல்லியத்துடன் கொடுக்கிறது.', bn: 'সায়নের ঋগ্বেদ ভাষ্যে আলোর গতির উল্লেখযোগ্যভাবে সঠিক মান দেওয়া হয়েছে।' },
    icon: 'c',
  },
  {
    slug: 'cosmic-time',
    title: { en: '4.32 Billion Years -- Cosmic Time', hi: '4.32 अरब वर्ष -- ब्रह्मांडीय समय', ta: '4.32 பில்லியன் ஆண்டுகள் -- பிரபஞ்ச நேரம்', bn: '৪.৩২ বিলিয়ন বছর -- মহাজাগতিক সময়' },
    description: { en: 'Vedic cosmology\'s age of the universe aligns remarkably with modern geology.', hi: 'वैदिक ब्रह्मांड विज्ञान में ब्रह्मांड की आयु आधुनिक भूविज्ञान से आश्चर्यजनक रूप से मेल खाती है।', ta: 'வேத அண்டவியலின் பிரபஞ்ச வயது நவீன புவியியலுடன் குறிப்பிடத்தக்க வகையில் ஒத்துப்போகிறது.', bn: 'বৈদিক মহাজাগতিক বিদ্যায় মহাবিশ্বের বয়স আধুনিক ভূতত্ত্বের সাথে আশ্চর্যজনকভাবে মিলে যায়।' },
    icon: 'T',
  },
  {
    slug: 'timeline',
    title: { en: 'Timeline -- 5000 Years of Discovery', hi: 'समयरेखा -- 5000 वर्षों की खोज', ta: 'காலவரிசை -- 5000 ஆண்டுகள் கண்டுபிடிப்பு', bn: 'সময়রেখা -- ৫০০০ বছরের আবিষ্কার' },
    description: { en: 'A visual timeline of India\'s contributions from Harappan weights to space missions.', hi: 'हड़प्पा के बाटों से अंतरिक्ष मिशनों तक भारत के योगदान की दृश्य समयरेखा।', ta: 'ஹரப்பா எடைகள் முதல் விண்வெளி பயணங்கள் வரை இந்தியாவின் பங்களிப்புகளின் காட்சி காலவரிசை.', bn: 'হরপ্পা ওজন থেকে মহাকাশ অভিযান পর্যন্ত ভারতের অবদানের চাক্ষুষ সময়রেখা।' },
    icon: '-->',
  },
];

export default async function ContributionsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt(LABELS[key], locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link href="/learn" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" />
        {t('backToLearn')}
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gold-primary" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={hf}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-base max-w-2xl mx-auto">{t('subtitle')}</p>
        <div className="mt-3 text-text-tertiary text-sm">{ARTICLES.length} {t('articles')}</div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/contributions/${article.slug}`}
            className="group rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-all duration-300 p-5 flex flex-col"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold-primary font-mono text-sm font-bold">{article.icon}</span>
              </div>
              <h2 className="text-gold-light font-bold text-sm leading-snug group-hover:text-gold-primary transition-colors" style={hf}>
                {lt(article.title, locale)}
              </h2>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed flex-1">
              {lt(article.description, locale)}
            </p>
            <div className="flex items-center gap-1 mt-3 text-gold-primary/60 group-hover:text-gold-primary text-xs transition-colors">
              <span>{isDevanagari ? 'पढ़ें' : 'Read'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
