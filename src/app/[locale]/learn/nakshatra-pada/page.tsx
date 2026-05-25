'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

const NAK_SLUGS = ['ashwini','bharani','krittika','rohini','mrigashira','ardra','punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni','hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula','purva-ashadha','uttara-ashadha','shravana','dhanishta','shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati'];

const ELEMENT_DOT: Record<string, string> = {
  Fire: 'bg-red-400', Earth: 'bg-emerald-400', Air: 'bg-cyan-400', Water: 'bg-blue-400',
};

const NAVAMSHA_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export default function NakshatraPadaIndex() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'नक्षत्र पद विश्लेषण' : 'Nakshatra Pada Analysis'}
        </h1>
        <p className="text-text-secondary text-lg">
          {isHi ? '27 नक्षत्र × 4 पद = 108 अद्वितीय व्यक्तित्व प्रोफाइल। शिशु नाम अक्षर सहित।' : '27 nakshatras × 4 padas = 108 unique personality profiles. Including baby name starting syllables.'}
        </p>
      </div>

      {/* What is a Pada? */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gold-light" style={hf}>
          {isHi ? 'पद क्या है?' : 'What Is a Pada?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>प्रत्येक नक्षत्र 13°20&apos; (800 कला-मिनट) का क्षेत्र कवर करता है। इसे चार समान भागों में विभाजित करने पर प्रत्येक भाग 3°20&apos; (200 कला-मिनट) का होता है  –  यही एक &quot;पद&quot; है। 27 नक्षत्र × 4 पद = 108 पद  –  यह संख्या वैदिक परम्परा में पवित्र है (108 जप माला मनकों का आधार)।</>
            : <>Each nakshatra spans 13°20&apos; (800 arcminutes) of the zodiac. Dividing this into four equal parts gives segments of 3°20&apos; (200 arcminutes) each  –  this is one &quot;pada.&quot; 27 nakshatras × 4 padas = 108 padas  –  a number sacred in Vedic tradition (the basis for the 108 japa mala beads).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>प्रत्येक पद एक नवांश राशि से मेल खाता है। पहला नक्षत्र (अश्विनी) मेष राशि में है, अतः इसके चार पद मेष, वृषभ, मिथुन और कर्क नवांश से जुड़ते हैं। यह प्रतिमान क्रमशः दोहराता है  –  हर नवाँ पद मेष नवांश पर लौटता है। नवांश (D-9) कुण्डली वस्तुतः पदों का ही विस्तार है।</>
            : <>Each pada maps to a navamsha sign. The first nakshatra (Ashwini) is in Aries, so its four padas correspond to Aries, Taurus, Gemini, and Cancer navamshas. This pattern repeats cyclically  –  every 9th pada returns to Aries navamsha. The Navamsha (D-9) chart is effectively an expansion of the pada system.</>}
        </p>
      </div>

      {/* Why Pada Matters */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gold-light" style={hf}>
          {isHi ? 'पद क्यों महत्त्वपूर्ण है?' : 'Why Does Pada Matter?'}
        </h3>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-gold-light font-medium">{isHi ? '1. नाम अक्षर:' : '1. Naming syllable:'}</span>{' '}
            {isHi
              ? <>प्रत्येक पद का एक विशिष्ट आरम्भिक अक्षर है। जैमिनी ज्योतिष में, शिशु का नामकरण जन्म नक्षत्र के पद के अनुसार किया जाता है। यह अक्षर ग्रह-नक्षत्र ऊर्जा के साथ अनुनाद बनाता है।</>
              : <>Each pada has a specific starting syllable. In Jyotish, a child&apos;s name is chosen based on the birth nakshatra&apos;s pada. This syllable resonates with the planetary-nakshatra energy.</>}
          </p>
          <p>
            <span className="text-gold-light font-medium">{isHi ? '2. विंशोत्तरी दशा:' : '2. Vimshottari Dasha:'}</span>{' '}
            {isHi
              ? <>दशा प्रारम्भिक ग्रह नक्षत्र से निर्धारित होता है, किन्तु शेष दशा अवधि पद के भीतर चन्द्रमा की सटीक स्थिति से गणित होती है। 0.5° चन्द्र भोगांश त्रुटि पद बदल सकती है, जो दशा प्रारम्भिक ग्रह ही बदल देती है  –  यही कारण है कि सटीक चन्द्र गणना इतनी महत्त्वपूर्ण है।</>
              : <>The dasha starting planet is determined by the nakshatra, but the remaining dasha duration is calculated from the Moon&apos;s exact position within the pada. A 0.5° Moon longitude error can change the pada, which changes the dasha starting planet entirely  –  this is why accurate Moon computation is so critical.</>}
          </p>
          <p>
            <span className="text-gold-light font-medium">{isHi ? '3. अष्टकूट मिलान:' : '3. Ashta Kuta matching:'}</span>{' '}
            {isHi
              ? <>गुण मिलान में नाडी कूट (8 अंक) नक्षत्र पद पर निर्भर करता है। यह 36 में से 8 अंक  –  सर्वाधिक भारांक  –  देता है। पद की एक त्रुटि नाडी दोष का गलत निदान कर सकती है।</>
              : <>In Guna matching, Nadi Kuta (8 points) depends on the nakshatra pada. This carries the highest weight  –  8 out of 36 points. A single pada error can produce a false Nadi Dosha diagnosis.</>}
          </p>
        </div>
      </div>

      {/* 27×4 Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-text-secondary text-xs uppercase tracking-wider py-2 px-3 border-b border-white/10">
                {isHi ? 'नक्षत्र' : 'Nakshatra'}
              </th>
              {[1, 2, 3, 4].map(p => (
                <th key={p} className="text-center text-text-secondary text-xs uppercase tracking-wider py-2 px-3 border-b border-white/10">
                  {isHi ? `पद ${p}` : `Pada ${p}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 27 }, (_, n) => {
              const nakData = NAKSHATRAS[n];
              const nakName = tl(nakData?.name, locale) || NAK_SLUGS[n];
              return (
                <tr key={n} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 px-3">
                    <span className="text-gold-light text-sm font-medium">{nakName}</span>
                    <span className="text-text-secondary/50 text-xs ml-2">#{n + 1}</span>
                  </td>
                  {[1, 2, 3, 4].map(p => {
                    const profile = NAKSHATRA_PADA_PROFILES.find(pr => pr.nakshatraId === n + 1 && pr.pada === p);
                    const slug = `${NAK_SLUGS[n]}-pada-${p}`;
                    const dotColor = ELEMENT_DOT[profile?.element || ''] || 'bg-gold-primary';
                    // Navamsha sign: (nakshatraIndex * 4 + padaIndex) % 12
                    const navamshaIndex = (n * 4 + (p - 1)) % 12;
                    return (
                      <td key={p} className="py-2 px-3 text-center">
                        <Link href={`/learn/nakshatra-pada/${slug}`}
                          className="inline-flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-white/5 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all group">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <span className="text-gold-light text-sm font-bold group-hover:text-gold-primary">{profile?.syllable || ' – '}</span>
                          </div>
                          <span className="text-text-secondary/40 text-[10px]">{NAVAMSHA_SIGNS[navamshaIndex]}</span>
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-text-secondary">
        {Object.entries(ELEMENT_DOT).map(([elem, color]) => (
          <div key={elem} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{elem}</span>
          </div>
        ))}
      </div>

      {/* Navamsha Mapping Explanation */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gold-light" style={hf}>
          {isHi ? 'नवांश मैपिंग कैसे काम करती है' : 'How Navamsha Mapping Works'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>108 पदों को 12 नवांश राशियों पर मैप करने का नियम सरल है: प्रथम पद (अश्विनी पद 1) = मेष नवांश, दूसरा = वृषभ, तीसरा = मिथुन ... 12वाँ = मीन, 13वाँ पुनः मेष। प्रत्येक अग्नि राशि (मेष/सिंह/धनु) का प्रथम पद मेष नवांश से आरम्भ होता है। प्रत्येक पृथ्वी राशि (वृषभ/कन्या/मकर) मकर से। प्रत्येक वायु राशि (मिथुन/तुला/कुम्भ) तुला से। प्रत्येक जल राशि (कर्क/वृश्चिक/मीन) कर्क से। यही कारण है कि नवांश को &quot;D-9&quot; कहते हैं  –  9 पद = 1 पूर्ण राशि (9 × 3°20&apos; = 30°)।</>
            : <>The rule for mapping 108 padas to 12 navamsha signs is simple: first pada (Ashwini pada 1) = Aries navamsha, second = Taurus, third = Gemini ... 12th = Pisces, 13th back to Aries. Each fire sign (Aries/Leo/Sagittarius) starts its first pada from Aries navamsha. Each earth sign (Taurus/Virgo/Capricorn) from Capricorn. Each air sign (Gemini/Libra/Aquarius) from Libra. Each water sign (Cancer/Scorpio/Pisces) from Cancer. This is why the navamsha is called &quot;D-9&quot;  –  9 padas = 1 full sign (9 × 3°20&apos; = 30°).</>}
        </p>
      </div>

      {/* Cross-links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/learn/nakshatras" className="px-4 py-2 rounded-full border border-white/10 bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors text-sm">
          {isHi ? '27 नक्षत्र' : '27 Nakshatras'}
        </Link>
        <Link href="/learn/matching" className="px-4 py-2 rounded-full border border-white/10 bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors text-sm">
          {isHi ? 'अष्टकूट मिलान' : 'Ashta Kuta Matching'}
        </Link>
        <Link href="/learn/dashas" className="px-4 py-2 rounded-full border border-white/10 bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors text-sm">
          {isHi ? 'दशा प्रणाली' : 'Dasha System'}
        </Link>
        <Link href="/baby-names" className="px-4 py-2 rounded-full border border-white/10 bg-bg-secondary/50 text-text-secondary hover:text-gold-light hover:border-gold-primary/20 transition-colors text-sm">
          {isHi ? 'शिशु नाम खोज' : 'Baby Name Finder'}
        </Link>
      </div>
    </div>
  );
}
