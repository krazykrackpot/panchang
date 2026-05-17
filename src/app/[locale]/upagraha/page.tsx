import { setRequestLocale } from 'next-intl/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { sunLongitude, toSidereal, normalizeDeg, getRashiNumber, dateToJD } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import Link from 'next/link';
import UpagrahaClient from './Client';

export const revalidate = 86400;

// ─── Upagraha Definitions ──────────────────────────────────────
interface UpagrahaRow {
  nameEn: string;
  nameHi: string;
  nameSa: string;
  longitude: number;
  rashiNumber: number;
  rashiEn: string;
  rashiHi: string;
  degrees: string;
  nature: 'malefic' | 'benefic' | 'mixed';
}

interface UpagrahaInfo {
  nameEn: string;
  nameHi: string;
  nameSa: string;
  nature: 'malefic' | 'benefic' | 'mixed';
  natureEn: string;
  natureHi: string;
  formulaEn: string;
  formulaHi: string;
  descriptionEn: string;
  descriptionHi: string;
  effectsEn: string;
  effectsHi: string;
}

const UPAGRAHA_INFO: UpagrahaInfo[] = [
  {
    nameEn: 'Dhuma', nameHi: 'धूम', nameSa: 'धूमः',
    nature: 'malefic', natureEn: 'Malefic', natureHi: 'पापी',
    formulaEn: 'Sun + 133°20\'', formulaHi: 'सूर्य + 133°20\'',
    descriptionEn: 'Dhuma (smoke) is the first upagraha, derived by adding 133°20\' to the Sun\'s longitude. It represents pollution, deception, and smoke-like obscuration. In BPHS (Brihat Parashara Hora Shastra), Dhuma is classified as a malefic shadow sub-planet that causes confusion and obscuration in the house it occupies.',
    descriptionHi: 'धूम (धुआँ) प्रथम उपग्रह है, सूर्य के अंश में 133°20\' जोड़कर प्राप्त होता है। यह प्रदूषण, छल और धुएँ जैसी अस्पष्टता का प्रतिनिधित्व करता है। बृहत् पराशर होरा शास्त्र में धूम को पापी छाया उपग्रह माना गया है जो जिस भाव में हो वहाँ भ्रम और अस्पष्टता उत्पन्न करता है।',
    effectsEn: 'Creates confusion, misunderstandings, and smoke-screens. Can indicate respiratory issues, pollution exposure, or deceptive situations. Strong in fiery signs (Aries, Leo, Sagittarius).',
    effectsHi: 'भ्रम, ग़लतफ़हमी और छलावा उत्पन्न करता है। श्वसन समस्या, प्रदूषण या छलपूर्ण परिस्थितियों का सूचक। अग्नि राशियों (मेष, सिंह, धनु) में प्रबल।',
  },
  {
    nameEn: 'Vyatipata', nameHi: 'व्यतीपात', nameSa: 'व्यतीपातः',
    nature: 'malefic', natureEn: 'Malefic', natureHi: 'पापी',
    formulaEn: '360° - Dhuma', formulaHi: '360° - धूम',
    descriptionEn: 'Vyatipata is derived by subtracting Dhuma from 360°. The name means "great fall" or "calamity". It represents sudden reversals, accidents, and unexpected disasters. Vyatipata Yoga (when Sun and Moon have equal declination on opposite sides) is one of the most inauspicious yogas in the Panchang.',
    descriptionHi: 'व्यतीपात धूम को 360° में से घटाकर प्राप्त होता है। नाम का अर्थ "महान पतन" या "विपत्ति" है। यह अचानक उलटफेर, दुर्घटना और अप्रत्याशित आपदा का प्रतिनिधित्व करता है। व्यतीपात योग पंचांग में सबसे अशुभ योगों में से एक है।',
    effectsEn: 'Sudden setbacks, accidents, financial reversals. Indicates areas of life where unexpected falls may occur. Its house placement shows vulnerability zones.',
    effectsHi: 'अचानक असफलता, दुर्घटना, आर्थिक उलटफेर। जीवन के उन क्षेत्रों का सूचक जहाँ अप्रत्याशित पतन हो सकता है।',
  },
  {
    nameEn: 'Parivesha', nameHi: 'परिवेश', nameSa: 'परिवेषः',
    nature: 'benefic', natureEn: 'Benefic', natureHi: 'शुभ',
    formulaEn: 'Vyatipata + 180°', formulaHi: 'व्यतीपात + 180°',
    descriptionEn: 'Parivesha (halo) is derived by adding 180° to Vyatipata. It represents the halo around the sun or moon -- an aura of divine protection. Unlike its parent Vyatipata, Parivesha is benefic and brings a protective shield around the native in the house it occupies.',
    descriptionHi: 'परिवेश (प्रभामण्डल) व्यतीपात में 180° जोड़कर प्राप्त होता है। यह सूर्य या चन्द्रमा के चारों ओर प्रभामण्डल -- दिव्य सुरक्षा कवच का प्रतिनिधित्व करता है। व्यतीपात के विपरीत, परिवेश शुभ है और जिस भाव में हो वहाँ सुरक्षा कवच प्रदान करता है।',
    effectsEn: 'Divine protection, aura of authority, insulation from harm. Strengthens the house it occupies. Particularly powerful in Kendra (1, 4, 7, 10) or Trikona (1, 5, 9) houses.',
    effectsHi: 'दिव्य सुरक्षा, अधिकार का तेज, हानि से बचाव। जिस भाव में हो उसे बलवान करता है। केन्द्र (1, 4, 7, 10) या त्रिकोण (1, 5, 9) में विशेष शक्तिशाली।',
  },
  {
    nameEn: 'Indrachapa (Kodanda)', nameHi: 'इन्द्रचाप (कोदण्ड)', nameSa: 'इन्द्रचापः',
    nature: 'malefic', natureEn: 'Malefic', natureHi: 'पापी',
    formulaEn: '360° - Parivesha', formulaHi: '360° - परिवेश',
    descriptionEn: 'Indrachapa (Indra\'s bow / rainbow) is derived by subtracting Parivesha from 360°. Despite its beautiful name, it is classified as malefic. It represents Indra\'s weapon and carries aggressive, warlike energy. Where placed, it can indicate conflicts, legal battles, or competitive pressures.',
    descriptionHi: 'इन्द्रचाप (इन्द्र धनुष / इन्द्रधनुष) परिवेश को 360° में से घटाकर प्राप्त होता है। सुन्दर नाम के बावजूद यह पापी वर्गीकृत है। यह इन्द्र के अस्त्र का प्रतिनिधित्व करता है और आक्रामक, युद्ध जैसी ऊर्जा रखता है।',
    effectsEn: 'Conflicts, legal disputes, competitive challenges. Can indicate sudden attacks or aggression directed at the native. Powerful in martial signs (Aries, Scorpio).',
    effectsHi: 'संघर्ष, कानूनी विवाद, प्रतिस्पर्धात्मक चुनौतियाँ। अचानक आक्रमण या शत्रुता का सूचक। मंगल राशियों (मेष, वृश्चिक) में प्रबल।',
  },
  {
    nameEn: 'Upaketu', nameHi: 'उपकेतु', nameSa: 'उपकेतुः',
    nature: 'malefic', natureEn: 'Malefic', natureHi: 'पापी',
    formulaEn: 'Indrachapa + 16°40\'', formulaHi: 'इन्द्रचाप + 16°40\'',
    descriptionEn: 'Upaketu is the fifth upagraha, derived by adding 16°40\' to Indrachapa. As a sub-node of Ketu, it amplifies Ketu\'s effects -- spiritual detachment, sudden losses, and unexpected turns. It indicates where karmic debts manifest most acutely.',
    descriptionHi: 'उपकेतु पाँचवाँ उपग्रह है, इन्द्रचाप में 16°40\' जोड़कर प्राप्त होता है। केतु का उप-बिन्दु होने से यह केतु के प्रभावों को बढ़ाता है -- आध्यात्मिक वैराग्य, अचानक हानि और अप्रत्याशित मोड़।',
    effectsEn: 'Amplifies Ketu energy -- spiritual awakening through loss, detachment, past-life karma surfacing. Can indicate hidden diseases or sudden separations.',
    effectsHi: 'केतु ऊर्जा को बढ़ाता है -- हानि द्वारा आध्यात्मिक जागृति, वैराग्य, पूर्वजन्म कर्म का प्रकटीकरण। गुप्त रोग या अचानक वियोग का सूचक।',
  },
  {
    nameEn: 'Gulika (Mandi)', nameHi: 'गुलिक (मान्दि)', nameSa: 'गुलिकः',
    nature: 'malefic', natureEn: 'Highly Malefic', natureHi: 'अत्यन्त पापी',
    formulaEn: 'Saturn\'s portion of the day/night', formulaHi: 'दिन/रात्रि में शनि का भाग',
    descriptionEn: 'Gulika (also called Mandi) is the most feared upagraha. Unlike the five above which derive from the Sun\'s longitude, Gulika is calculated from Saturn\'s assigned portion of the day. Each weekday divides the daylight into 8 parts ruled by the seven planets (the 8th is lordless). Saturn\'s portion is Gulika time, and the ascendant at that moment gives Gulika\'s sign and degree.',
    descriptionHi: 'गुलिक (मान्दि भी कहते हैं) सबसे भयावह उपग्रह है। ऊपर के पाँच उपग्रह सूर्य अंश से निकलते हैं, किन्तु गुलिक शनि के दिन/रात्रि भाग से गणना होता है। प्रत्येक वार का दिन 8 भागों में बँटता है जिन पर सात ग्रहों का शासन होता है (8वाँ भाग स्वामीहीन)। शनि का भाग गुलिक काल है।',
    effectsEn: 'The most malefic sub-planet. Its house placement indicates chronic obstacles, health issues, and karmic debts. Gulika in Lagna is especially feared. Gulika Kaal timing is used in Muhurta to avoid starting important activities.',
    effectsHi: 'सबसे पापी उपग्रह। भाव स्थिति दीर्घकालिक बाधा, स्वास्थ्य समस्या और कर्म ऋण दर्शाती है। लग्न में गुलिक अत्यन्त भयावह। गुलिक काल मुहूर्त में महत्वपूर्ण कार्यों से बचने के लिए प्रयुक्त।',
  },
];

function formatDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

export default async function UpagrahaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Compute upagraha positions from Sun's longitude (Delhi reference for SSR)
  let upagrahaRows: UpagrahaRow[] = [];
  try {
    const jd = dateToJD(year, month, day, 12); // noon UT
    const sunTrop = sunLongitude(jd);
    const sunSid = toSidereal(sunTrop, jd);

    // Compute the 5 Sun-derived upagrahas
    const dhuma = normalizeDeg(sunSid + 133 + 20 / 60);
    const vyatipata = normalizeDeg(360 - dhuma);
    const parivesha = normalizeDeg(vyatipata + 180);
    const indrachapa = normalizeDeg(360 - parivesha);
    const upaketu = normalizeDeg(indrachapa + 16 + 40 / 60);

    const positions = [
      { nameEn: 'Dhuma', nameHi: 'धूम', nameSa: 'धूमः', longitude: dhuma, nature: 'malefic' as const },
      { nameEn: 'Vyatipata', nameHi: 'व्यतीपात', nameSa: 'व्यतीपातः', longitude: vyatipata, nature: 'malefic' as const },
      { nameEn: 'Parivesha', nameHi: 'परिवेश', nameSa: 'परिवेषः', longitude: parivesha, nature: 'benefic' as const },
      { nameEn: 'Indrachapa', nameHi: 'इन्द्रचाप', nameSa: 'इन्द्रचापः', longitude: indrachapa, nature: 'malefic' as const },
      { nameEn: 'Upaketu', nameHi: 'उपकेतु', nameSa: 'उपकेतुः', longitude: upaketu, nature: 'malefic' as const },
    ];

    upagrahaRows = positions.map(p => {
      const rashiNum = getRashiNumber(p.longitude);
      const rashi = RASHIS.find(r => r.id === rashiNum);
      return {
        ...p,
        rashiNumber: rashiNum,
        rashiEn: rashi?.name.en || '',
        rashiHi: rashi?.name.hi || '',
        degrees: formatDeg(p.longitude % 30),
      };
    });
  } catch (err) {
    console.error('[upagraha] SSR computation failed:', err);
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `उपग्रह — छाया ग्रह — ${dateStr}` : `Upagraha — Shadow Planets — ${dateStr}`}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
          {isHi
            ? `आज ${dateStr} को पाँच सूर्य-आधारित उपग्रहों (धूम, व्यतीपात, परिवेश, इन्द्रचाप, उपकेतु) की स्थिति और गुलिक/मान्दि की गणना। ये छाया ग्रह कुण्डली विश्लेषण और मुहूर्त में प्रयुक्त होते हैं।`
            : `Today's positions (${dateStr}) for the five Sun-derived upagrahas (Dhuma, Vyatipata, Parivesha, Indrachapa, Upaketu) plus Gulika/Mandi. These shadow sub-planets are used in chart analysis and Muhurta selection.`}
        </p>

        {/* ═══ Today's Upagraha Positions Table ═══ */}
        {upagrahaRows.length > 0 && (
          <div className="mt-6 rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'उपग्रह' : 'Upagraha'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'राशि' : 'Sign'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'अंश' : 'Degrees'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'प्रकृति' : 'Nature'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {upagrahaRows.map(row => (
                  <tr key={row.nameEn} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2 px-4 text-text-primary font-medium">{isHi ? row.nameHi : row.nameEn}</td>
                    <td className="py-2 px-4 text-gold-primary">{isHi ? row.rashiHi : row.rashiEn}</td>
                    <td className="py-2 px-4 text-text-secondary font-mono">{row.degrees}</td>
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.nature === 'malefic' ? 'bg-red-500/15 text-red-300' :
                        row.nature === 'benefic' ? 'bg-emerald-500/15 text-emerald-300' :
                        'bg-amber-500/15 text-amber-300'
                      }`}>
                        {row.nature === 'malefic' ? (isHi ? 'पापी' : 'Malefic') :
                         row.nature === 'benefic' ? (isHi ? 'शुभ' : 'Benefic') :
                         (isHi ? 'मिश्र' : 'Mixed')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ About Each Upagraha ═══ */}
        <div className="mt-8 space-y-6">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'उपग्रहों का विस्तृत विवरण' : 'Detailed Upagraha Guide'}
          </h2>
          {UPAGRAHA_INFO.map(info => (
            <div key={info.nameEn} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] p-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-text-primary font-bold text-base">
                  {isHi ? info.nameHi : info.nameEn}
                  <span className="text-text-secondary text-xs font-normal ml-2">({isHi ? info.nameSa : info.nameSa})</span>
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  info.nature === 'malefic' ? 'bg-red-500/15 text-red-300' :
                  info.nature === 'benefic' ? 'bg-emerald-500/15 text-emerald-300' :
                  'bg-amber-500/15 text-amber-300'
                }`}>
                  {isHi ? info.natureHi : info.natureEn}
                </span>
              </div>
              <p className="text-text-secondary text-xs mb-2">
                {isHi ? `सूत्र: ${info.formulaHi}` : `Formula: ${info.formulaEn}`}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                {isHi ? info.descriptionHi : info.descriptionEn}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                <span className="text-gold-primary/80 font-medium">{isHi ? 'प्रभाव: ' : 'Effects: '}</span>
                {isHi ? info.effectsHi : info.effectsEn}
              </p>
            </div>
          ))}
        </div>

        {/* ═══ Calculation Method ═══ */}
        <div className="mt-8 space-y-3 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'गणना विधि' : 'Calculation Method'}
          </h2>
          <p>
            {isHi
              ? 'पाँच मुख्य उपग्रह (धूम, व्यतीपात, परिवेश, इन्द्रचाप, उपकेतु) केवल सूर्य की निरयन (साइडरियल) स्थिति से निकाले जाते हैं। सूर्य का अंश ज्ञात होने पर क्रमशः 133°20\' जोड़कर धूम, फिर 360° में से घटाकर व्यतीपात, 180° जोड़कर परिवेश, पुनः 360° में से घटाकर इन्द्रचाप, और 16°40\' जोड़कर उपकेतु प्राप्त होता है। ये गणनाएँ बृहत् पराशर होरा शास्त्र के अध्याय 25 में वर्णित हैं।'
              : 'The five primary upagrahas (Dhuma, Vyatipata, Parivesha, Indrachapa, Upaketu) are derived solely from the Sun\'s sidereal longitude. Starting with the Sun\'s position, add 133°20\' for Dhuma, subtract from 360° for Vyatipata, add 180° for Parivesha, subtract from 360° for Indrachapa, and add 16°40\' for Upaketu. These formulae are described in BPHS Chapter 25.'}
          </p>
          <p>
            {isHi
              ? 'गुलिक (मान्दि) की गणना भिन्न है -- यह शनि के दैनिक भाग से निकलता है। सूर्योदय से सूर्यास्त तक के समय को 8 भागों में बाँटा जाता है, प्रत्येक भाग पर एक ग्रह का शासन होता है। शनि का भाग गुलिक काल है। उस समय पर लग्न (उदय राशि) ही गुलिक की राशि और अंश है।'
              : 'Gulika (Mandi) is computed differently -- from Saturn\'s daily portion. The daylight hours are divided into 8 equal parts, each ruled by a planet. Saturn\'s segment is Gulika Kaal. The ascendant (rising sign) at that moment gives Gulika\'s sign and degree placement.'}
          </p>
        </div>

        {/* Internal links */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'राहु काल' : 'Rahu Kaal'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/vedic-time" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'वैदिक समय' : 'Vedic Time'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/kundali" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'कुण्डली' : 'Kundali'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive upagraha cards, chart positions ═══ */}
      <UpagrahaClient />
    </div>
  );
}
