'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import RetrogradeVisualizer from '@/components/learn/RetrogradeVisualizer';
import LessonSection from '@/components/learn/LessonSection';
import { tl } from '@/lib/utils/trilingual';

/* ── Page strings (inline LABELS — no locale file needed for this tool page) ── */
const LABELS = {
  title: {
    en: 'Retrograde Motion Visualizer',
    hi: 'वक्री गति दृश्यावलोकन',
    ta: 'வக்ர இயக்க காட்சிப்படுத்தி',
    bn: 'বক্রগতি ভিজ্যুয়ালাইজার',
  },
  subtitle: {
    en: 'An interactive animation explaining why planets appear to reverse direction in the sky',
    hi: 'एक अन्तरक्रियात्मक चित्रण जो बताता है कि ग्रह आकाश में उल्टी दिशा में क्यों जाते प्रतीत होते हैं',
    ta: 'கிரகங்கள் ஏன் வானில் திசை மாற்றுவது போல் தோன்றுகின்றன என்பதை விளக்கும் ஒரு ஊடாடும் அனிமேஷன்',
    bn: 'একটি ইন্টারেক্টিভ অ্যানিমেশন যা ব্যাখ্যা করে কেন গ্রহগুলি আকাশে বিপরীত দিকে যাচ্ছে বলে মনে হয়',
  },
  s1title: {
    en: 'Interactive Simulation',
    hi: 'अन्तरक्रियात्मक अनुकरण',
    ta: 'ஊடாடும் உருவகப்படுத்தல்',
    bn: 'ইন্টারেক্টিভ সিমুলেশন',
  },
  s2title: {
    en: 'How Retrograde Motion Works',
    hi: 'वक्री गति कैसे काम करती है',
    ta: 'வக்ர இயக்கம் எவ்வாறு செயல்படுகிறது',
    bn: 'বক্রগতি কীভাবে কাজ করে',
  },
  explainHelio: {
    en: '"From Above" view shows the solar system from outside — Earth and the planet orbiting the Sun. When Earth (faster, inner orbit) catches up with and overtakes an outer planet, the planet appears to slow down, stop, reverse, stop again, then continue forward. This is purely an effect of perspective, like two cars on a highway.',
    hi: '"ऊपर से" दृश्य सौरमण्डल को बाहर से दिखाता है — सूर्य की परिक्रमा करती पृथ्वी और ग्रह। जब पृथ्वी (तेज, आन्तरिक कक्षा) किसी बाहरी ग्रह से आगे निकलती है, तो वह ग्रह धीमा, रुकता, उल्टा चलता, फिर रुकता और आगे बढ़ता प्रतीत होता है। यह केवल दृष्टिकोण का प्रभाव है, जैसे राजमार्ग पर दो कारें।',
    ta: '"மேலிருந்து" காட்சி சூரிய குடும்பத்தை வெளியிலிருந்து காட்டுகிறது — சூரியனை சுற்றும் பூமி மற்றும் கிரகம். பூமி (வேகமான, உள் சுற்றுப்பாதை) ஒரு வெளி கிரகத்தை முந்தும்போது, அந்த கிரகம் மெதுவாக, நிற்க, தலைகீழாக நகர, மீண்டும் நிற்க, பிறகு முன்னோக்கி தொடர தோன்றுகிறது. இது நெடுஞ்சாலையில் இரண்டு கார்கள் போல், முற்றிலும் கண்ணோட்டத்தின் விளைவு.',
    bn: '"উপর থেকে" ভিউ সৌরজগৎকে বাইরে থেকে দেখায় — সূর্যকে প্রদক্ষিণ করা পৃথিবী ও গ্রহ। যখন পৃথিবী (দ্রুত, ভেতরের কক্ষপথ) একটি বাইরের গ্রহকে অতিক্রম করে, তখন গ্রহটি ধীর হতে, থামতে, বিপরীতে যেতে, আবার থামতে এবং তারপর সামনে এগোতে দেখায়। এটি নিছক দৃষ্টিভঙ্গির প্রভাব, যেমন হাইওয়েতে দুটি গাড়ি।',
  },
  explainGeo: {
    en: '"From Earth" view shows what an observer sees from Earth — the planet moving left to right (direct), then appearing to pause, reverse direction (retrograde, shown in red), pause again, and continue forward. This is the geocentric view that ancient astronomers recorded and what Jyotish uses.',
    hi: '"पृथ्वी से" दृश्य दिखाता है कि पृथ्वी से एक पर्यवेक्षक क्या देखता है — ग्रह बाएं से दाएं (सीधा), फिर रुकता, दिशा बदलता (वक्री, लाल में), फिर रुकता और आगे बढ़ता। यह भूकेन्द्रीय दृष्टिकोण है जिसे प्राचीन खगोलशास्त्रियों ने दर्ज किया और ज्योतिष उपयोग करता है।',
    ta: '"பூமியிலிருந்து" காட்சி பூமியிலிருந்து ஒரு பார்வையாளர் என்ன பார்க்கிறார் என்பதை காட்டுகிறது — கிரகம் இடமிருந்து வலமாக (நேரடி), பின்னர் இடைநிறுத்தி, திசை மாற்றி (வக்ர, சிவப்பில் காட்டப்பட்டது), மீண்டும் இடைநிறுத்தி, தொடர்கிறது. இது பண்டைய வானியல் வல்லுநர்கள் பதிவு செய்த மற்றும் ஜ்யோதிஷ் பயன்படுத்தும் புவிமைய பார்வை.',
    bn: '"পৃথিবী থেকে" ভিউ দেখায় পৃথিবী থেকে একজন পর্যবেক্ষক কী দেখেন — গ্রহটি বাম থেকে ডানে (সরাসরি), তারপর বিরতি দিয়ে, দিক পরিবর্তন করে (বক্রগতি, লালে দেখানো), আবার বিরতি দিয়ে, সামনে চলতে থাকে। এটি সেই ভূকেন্দ্রিক দৃষ্টিভঙ্গি যা প্রাচীন জ্যোতির্বিদরা রেকর্ড করেছিলেন এবং জ্যোতিষ ব্যবহার করে।',
  },
  s3title: {
    en: 'Why Inner Planets Also Go Retrograde',
    hi: 'आन्तरिक ग्रह भी वक्री क्यों होते हैं',
    ta: 'உள் கிரகங்களும் ஏன் வக்ரமாகின்றன',
    bn: 'ভেতরের গ্রহগুলিও কেন বক্রগতিতে যায়',
  },
  innerPlanetExplain: {
    en: 'Mercury and Venus orbit inside Earth\'s orbit. They go retrograde when they pass between Earth and the Sun (inferior conjunction). From Earth\'s perspective, they too appear to loop backward before continuing forward. Mercury retrogrades 3–4 times a year for ~21 days each. Venus retrogrades every ~18 months for ~40 days — rarer but longer.',
    hi: 'बुध और शुक्र पृथ्वी की कक्षा के अन्दर परिक्रमा करते हैं। जब वे पृथ्वी और सूर्य के बीच से गुजरते हैं (अधःसंयोग), तो वक्री होते हैं। पृथ्वी से देखने पर वे भी पीछे की ओर जाते और फिर आगे बढ़ते प्रतीत होते हैं। बुध वर्ष में 3-4 बार ~21 दिनों के लिए वक्री होता है। शुक्र हर ~18 माह में ~40 दिनों के लिए — दुर्लभ पर लम्बा।',
    ta: 'புதன் மற்றும் சுக்கிரன் பூமியின் சுற்றுப்பாதைக்கு உள்ளே சுற்றுகின்றன. அவை பூமிக்கும் சூரியனுக்கும் இடையில் கடக்கும்போது (கீழ் சேர்க்கை) வக்கிரமாகின்றன. பூமியின் பார்வையில், அவையும் பின்னோக்கி சுழலி தொடர்கின்றன. புதன் ஆண்டுக்கு 3-4 முறை ~21 நாட்களுக்கு வக்கிரமாகுகிறது. சுக்கிரன் ~18 மாதங்களுக்கு ஒருமுறை ~40 நாட்களுக்கு — அரிதான ஆனால் நீண்ட.',
    bn: 'বুধ ও শুক্র পৃথিবীর কক্ষপথের ভেতরে ঘোরে। যখন তারা পৃথিবী ও সূর্যের মাঝখান দিয়ে যায় (অধঃসংযোগ), তখন বক্রগতিতে যায়। পৃথিবীর দৃষ্টিকোণ থেকে, তারাও পেছনে লুপ করে তারপর এগিয়ে চলে। বুধ বছরে ৩-৪ বার ~২১ দিন করে বক্রগতিতে যায়। শুক্র প্রতি ~১৮ মাসে একবার ~৪০ দিনের জন্য — বিরল কিন্তু দীর্ঘ।',
  },
  navVisual: {
    en: 'Interactive Visualizer',
    hi: 'अन्तरक्रियात्मक दृश्यावलोकन',
    ta: 'ஊடாடும் காட்சிப்படுத்தி',
    bn: 'ইন্টারেক্টিভ ভিজ্যুয়ালাইজার',
  },
  navRetroEffects: {
    en: 'Retrograde Effects',
    hi: 'वक्री प्रभाव',
    ta: 'வக்ர விளைவுகள்',
    bn: 'বক্রগতির প্রভাব',
  },
  navRetroCalendar: {
    en: 'Retrograde Calendar',
    hi: 'वक्री कैलेंडर',
    ta: 'வக்ர நாட்காட்டி',
    bn: 'বক্রগতি ক্যালেন্ডার',
  },
  navPlanets: {
    en: 'Learn Planets',
    hi: 'ग्रह विस्तार',
    ta: 'கிரகங்களை அறிக',
    bn: 'গ্রহ শিখুন',
  },
} as const;

type L = 'en' | 'hi' | 'ta' | 'bn';
function t(obj: Record<string, string>, locale: string): string {
  return (obj as Record<string, string>)[locale] ?? obj['en'] ?? '';
}

export default function RetrogradeVisualizerPage() {
  const locale = useLocale();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-3">
          {t(LABELS.title, locale)}
        </h1>
        <p className="text-text-secondary leading-relaxed">
          {t(LABELS.subtitle, locale)}
        </p>
      </motion.div>

      {/* Section 1: The visualizer itself */}
      <LessonSection number={1} title={t(LABELS.s1title, locale)} variant="default">
        <RetrogradeVisualizer locale={locale} />
      </LessonSection>

      {/* Section 2: How it works */}
      <LessonSection number={2} title={t(LABELS.s2title, locale)} variant="highlight">
        <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                {tl({ en: 'From Above (Heliocentric)', hi: 'ऊपर से (सौर-केन्द्रीय)', sa: 'ऊपर से (सौर-केन्द्रीय)' }, locale)}
              </span>
            </div>
            <p>{t(LABELS.explainHelio, locale)}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                {tl({ en: 'From Earth (Geocentric / Jyotish)', hi: 'पृथ्वी से (भू-केन्द्रीय / ज्योतिष)', sa: 'पृथ्वी से (भू-केन्द्रीय / ज्योतिष)' }, locale)}
              </span>
            </div>
            <p>{t(LABELS.explainGeo, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 3: Inner planets */}
      <LessonSection number={3} title={t(LABELS.s3title, locale)} variant="formula">
        <p className="text-text-secondary leading-relaxed text-sm">
          {t(LABELS.innerPlanetExplain, locale)}
        </p>

        {/* Quick-reference table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-text-secondary border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 pr-4 text-gold-dark font-semibold">
                  {tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' }, locale)}
                </th>
                <th className="text-left py-2 pr-4 text-gold-dark font-semibold">
                  {tl({ en: 'Frequency', hi: 'आवृत्ति', sa: 'आवृत्तिः' }, locale)}
                </th>
                <th className="text-left py-2 pr-4 text-gold-dark font-semibold">
                  {tl({ en: 'Duration', hi: 'अवधि', sa: 'अवधिः' }, locale)}
                </th>
                <th className="text-left py-2 text-gold-dark font-semibold">
                  {tl({ en: 'Orbit type', hi: 'कक्षा प्रकार', sa: 'कक्षाप्रकारः' }, locale)}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { planet: { en: 'Mercury', hi: 'बुध', ta: 'புதன்', bn: 'বুধ' }, freq: { en: '3–4× / year', hi: '3–4 बार/वर्ष', ta: 'ஆண்டுக்கு 3–4 முறை', bn: 'বছরে ৩–৪ বার' }, dur: '~21d', type: { en: 'Inner', hi: 'आन्तरिक', ta: 'உள்', bn: 'ভেতরের' }, color: '#50C878' },
                { planet: { en: 'Venus',   hi: 'शुक्र', ta: 'சுக்கிரன்', bn: 'শুক্র' }, freq: { en: 'Every 18 months', hi: 'हर 18 माह', ta: 'ஒவ்வொரு 18 மாதமும்', bn: 'প্রতি ১৮ মাসে' }, dur: '~40d', type: { en: 'Inner', hi: 'आन्तरिक', ta: 'உள்', bn: 'ভেতরের' }, color: '#FF69B4' },
                { planet: { en: 'Mars',    hi: 'मंगल', ta: 'செவ்வாய்', bn: 'মঙ্গল' }, freq: { en: 'Every 26 months', hi: 'हर 26 माह', ta: 'ஒவ்வொரு 26 மாதமும்', bn: 'প্রতি ২৬ মাসে' }, dur: '~72d', type: { en: 'Outer', hi: 'बाह्य', ta: 'வெளி', bn: 'বাইরের' }, color: '#DC143C' },
                { planet: { en: 'Jupiter', hi: 'बृहस्पति', ta: 'குரு', bn: 'বৃহস্পতি' }, freq: { en: '4 months/year', hi: '4 माह/वर्ष', ta: 'ஆண்டுக்கு 4 மாதங்கள்', bn: 'বছরে ৪ মাস' }, dur: '~120d', type: { en: 'Outer', hi: 'बाह्य', ta: 'வெளி', bn: 'বাইরের' }, color: '#FFD700' },
                { planet: { en: 'Saturn',  hi: 'शनि', ta: 'சனி', bn: 'শনি' }, freq: { en: '4.5 months/year', hi: '4.5 माह/वर्ष', ta: 'ஆண்டுக்கு 4.5 மாதங்கள்', bn: 'বছরে ৪.৫ মাস' }, dur: '~138d', type: { en: 'Outer', hi: 'बाह्य', ta: 'வெளி', bn: 'বாইரের' }, color: '#4169E1' },
              ].map((row) => (
                <tr key={row.planet.en} className="border-b border-gold-primary/8">
                  <td className="py-2 pr-4 font-semibold" style={{ color: row.color }}>
                    {t(row.planet, locale)}
                  </td>
                  <td className="py-2 pr-4">{t(row.freq, locale)}</td>
                  <td className="py-2 pr-4">{row.dur}</td>
                  <td className="py-2">{t(row.type, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/learn/retrograde-effects' as const, label: t(LABELS.navRetroEffects, locale) },
          { href: '/retrograde' as const, label: t(LABELS.navRetroCalendar, locale) },
          { href: '/learn/planets' as const, label: t(LABELS.navPlanets, locale) },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium hover:bg-gold-primary/20 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
