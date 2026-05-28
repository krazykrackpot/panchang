import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { CAREER_CONTENT } from '@/lib/career/career-content';
import { CAREER_ACTIVITY_IDS, type CareerActivityId } from '@/types/muhurta-ai';
import { tl } from '@/lib/utils/trilingual';
import CareerMuhurtaClient from './CareerMuhurtaClient';

// Force-dynamic: CareerMuhurtaClient computes `dates` from `todayInTimezone()`
// inside a `useMemo` (CareerMuhurtaClient.tsx:86) and the resulting verdicts are
// rendered directly. With ISR-caching that useMemo would run at cache-generation
// time on the server, then re-run at hydration on the client — and any cross-day-
// boundary serve would mismatch slot text, raise React #418, kill the entire React
// tree, and silently drop all client-side analytics events. That's exactly what
// happened to /choghadiya/[date] + /gauri-panchang/[date] on 2026-05-28 (fixed by
// removing the client embed in PR #267 + #269). This page is also per-user-city
// driven from the client location store, so cacheing was adding no value.
export const dynamic = 'force-dynamic';

export default async function CareerMuhurtaIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isTa = locale === 'ta';
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  const headline = isTa
    ? 'தொழில் முகூர்த்தம் — வேலை நேர்காணல், ஒப்பந்தம், பதவி உயர்வுக்கான நல்ல நேரம்'
    : isHi
      ? 'करियर मुहूर्त — नौकरी इंटरव्यू, अनुबंध, पदोन्नति के लिए शुभ समय'
      : 'Career Muhurta — Auspicious Times for Job Interviews, Contracts, Promotions';

  const intro = isTa
    ? 'வைதீக சோதிட முகூர்த்த சாஸ்திரம் ஒவ்வொரு தொழில் முடிவுக்கும் — வேலைக்கான விண்ணப்பம், நேர்காணல், ஊதிய பேச்சுவார்த்தை, ஒப்பந்தம், ராஜினாமா — அதற்கான சிறந்த நேரத்தை வழங்குகிறது. கீழே உங்கள் தேவையான செயலைத் தேர்ந்தெடுத்து, அடுத்த 30 நாட்களின் சிறந்த நேரங்களைக் காணுங்கள்.'
    : isHi
      ? 'वैदिक ज्योतिष मुहूर्त शास्त्र प्रत्येक करियर निर्णय — नौकरी आवेदन, इंटरव्यू, वेतन वार्ता, अनुबंध, त्यागपत्र — के लिए सबसे अनुकूल समय बताता है। नीचे अपनी आवश्यक गतिविधि चुनें और अगले 30 दिनों के सर्वश्रेष्ठ समय देखें।'
      : 'Vedic astrology muhurta science specifies the most favourable time for every career decision — job applications, interviews, salary negotiations, contract signings, resignations, promotions, and business launches. Pick your activity below to see the best windows over the next 30 days for your location.';

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {headline}
        </h1>
        <p className="text-text-primary text-lg mt-4 leading-relaxed">{intro}</p>

        {/* Activity grid — pure SSR for SEO. Picking an activity navigates
            to the per-activity landing page which has the full 30-day
            calendar + classical content. */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAREER_ACTIVITY_IDS.map((id) => {
            const c = CAREER_CONTENT[id];
            return (
              <Link
                key={id}
                href={`/${locale}/career-muhurta/${c.slug}`}
                className="block rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 transition-all"
              >
                <h3 className="text-gold-light font-semibold text-base mb-1">
                  {tl(c.name, locale)}
                </h3>
                <p className="text-text-secondary text-xs italic mb-2">
                  {c.classicalName.sanskrit} ({c.classicalName.transliteration})
                </p>
                <p className="text-text-secondary text-sm leading-snug">
                  {tl(c.oneLiner, locale).split('—')[0].trim()}
                </p>
              </Link>
            );
          })}
        </section>

        {/* Classical context section */}
        <section className="mt-10 space-y-4 text-text-secondary leading-relaxed">
          <h2 className="text-gold-light text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'தொழில் முகூர்த்தம் ஏன் முக்கியம்?' : isHi ? 'करियर मुहूर्त क्यों आवश्यक है?' : 'Why Career Muhurta Matters'}
          </h2>
          <p>
            {isTa
              ? 'ஒவ்வொரு தொழில் தீர்மானமும் — ஒரு புதிய பணியில் சேருவது, ஒரு ஒப்பந்தத்தில் கையெழுத்திடுவது, ஒரு பதவி உயர்வை கேட்பது — அந்தத் தீர்மானத்தின் நீடித்த விளைவைச் சுமக்கிறது. வைதீக சாஸ்திரம் கூறுகிறது: செயலின் தரம் அதன் சங்கல்ப தருணத்தின் தரத்தைப் பிரதிபலிக்கிறது. சரியான முகூர்த்தம் வெற்றியை உத்தரவாதம் செய்யாது — ஆனால் சாதகமான வானியல் ஆதரவின் கீழ் தொடங்கப்படும்போது சாத்தியக்கூறுகள் அதிகரிக்கின்றன.'
              : isHi
                ? 'प्रत्येक करियर निर्णय — एक नई भूमिका में सम्मिलित होना, अनुबंध पर हस्ताक्षर करना, पदोन्नति की मांग — उस निर्णय के स्थायी प्रभाव को धारण करता है। वैदिक शास्त्र कहता है: कार्य की गुणवत्ता उसके सङ्कल्प क्षण की गुणवत्ता को प्रतिबिंबित करती है। सही मुहूर्त सफलता की गारंटी नहीं देता — परन्तु अनुकूल ज्योतिषीय समर्थन के साथ शुरू होने पर सम्भावनाएँ बढ़ जाती हैं।'
                : 'Every career decision — joining a new role, signing a contract, asking for a promotion — carries the durable consequences of that decision. The Vedic tradition holds that the quality of an act reflects the quality of its sankalpa — the moment of intent. A favourable muhurta does not guarantee success; it raises the probability that the act lands well when launched under supportive astronomical conditions.'}
          </p>
          <p>
            {isTa
              ? 'இந்தத் தொழில் முகூர்த்த கருவி ஒவ்வொரு செயலுக்கும் — பாரம்பரிய தமிழ் மற்றும் சமஸ்கிருத மூலங்களின் அடிப்படையில் — அதற்கான சரியான நட்சத்திரம், திதி, கிழமை, ஹோரை ஆகியவற்றைக் கண்காணித்து, அடுத்த 30 நாட்களின் சிறந்த நேர சாளரங்களைக் காட்டுகிறது.'
              : isHi
                ? 'यह करियर मुहूर्त उपकरण प्रत्येक गतिविधि के लिए — पारम्परिक संस्कृत और तमिल स्रोतों के आधार पर — सही नक्षत्र, तिथि, वार, होरा को ट्रैक करता है और अगले 30 दिनों में सर्वश्रेष्ठ समय खण्ड दिखाता है।'
                : 'This Career Muhurta tool tracks the right nakshatra, tithi, weekday, and hora for each activity — based on classical Sanskrit and Tamil sources — and shows the strongest windows in the next 30 days for your location.'}
          </p>
        </section>

        {/* Internal navigation */}
        <nav className="flex flex-wrap gap-3 mt-10 text-sm">
          <Link href={`/${locale}/muhurta-ai`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'முகூர்த்த AI →' : isHi ? 'मुहूर्त AI →' : 'Muhurta AI →'}
          </Link>
          <Link href={`/${locale}/learn/career-muhurta`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'விளக்கம் →' : isHi ? 'विस्तृत जानकारी →' : 'Learn the theory →'}
          </Link>
          <Link href={`/${locale}/choghadiya`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'சௌகாடியா →' : isHi ? 'चौघड़िया →' : 'Choghadiya →'}
          </Link>
          <Link href={`/${locale}/gauri-panchang`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'கௌரி பஞ்சாங்கம் →' : isHi ? 'गौरी पंचांग →' : 'Gauri Panchang →'}
          </Link>
        </nav>
      </div>

      {/* Interactive: lets the user pick an activity + location and see
          the best windows for the next 30 days right here on the index. */}
      <CareerMuhurtaClient defaultActivity={'job_interview' as CareerActivityId} />
    </main>
  );
}
