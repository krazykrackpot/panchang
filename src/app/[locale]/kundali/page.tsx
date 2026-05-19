import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import KundaliClient from './Client';

export const revalidate = 86400;

export default async function KundaliPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const HOUSES = [
    { num: 1, name: 'Lagna / Ascendant', nameHi: 'लग्न / प्रथम भाव', area: 'Self, personality, physical body, general temperament', areaHi: 'व्यक्तित्व, शरीर, सामान्य स्वभाव' },
    { num: 2, name: '2nd House (Dhana)', nameHi: 'द्वितीय भाव (धन)', area: 'Wealth, family, speech, food habits, early education', areaHi: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा' },
    { num: 3, name: '3rd House (Sahaja)', nameHi: 'तृतीय भाव (सहज)', area: 'Siblings, courage, short journeys, communication, skills', areaHi: 'भाई-बहन, साहस, लघु यात्रा, संवाद, कौशल' },
    { num: 4, name: '4th House (Sukha)', nameHi: 'चतुर्थ भाव (सुख)', area: 'Mother, home, vehicles, property, domestic happiness', areaHi: 'माता, गृह, वाहन, सम्पत्ति, गृहस्थ सुख' },
    { num: 5, name: '5th House (Putra)', nameHi: 'पंचम भाव (पुत्र)', area: 'Children, intelligence, creativity, romance, past-life merit', areaHi: 'सन्तान, बुद्धि, सृजनशीलता, प्रेम, पूर्वजन्म पुण्य' },
    { num: 6, name: '6th House (Ripu)', nameHi: 'षष्ठ भाव (रिपु)', area: 'Enemies, disease, debts, daily work, service, litigation', areaHi: 'शत्रु, रोग, ऋण, दैनिक कार्य, सेवा, मुकदमे' },
    { num: 7, name: '7th House (Kalatra)', nameHi: 'सप्तम भाव (कलत्र)', area: 'Marriage, partnerships, business associates, public dealings', areaHi: 'विवाह, साझेदारी, व्यापार सहयोगी, सार्वजनिक व्यवहार' },
    { num: 8, name: '8th House (Ayu)', nameHi: 'अष्टम भाव (आयु)', area: 'Longevity, transformation, inheritance, occult, sudden events', areaHi: 'आयु, परिवर्तन, विरासत, गुप्त विद्या, अचानक घटनाएँ' },
    { num: 9, name: '9th House (Dharma)', nameHi: 'नवम भाव (धर्म)', area: 'Fortune, father, guru, long journeys, higher learning, dharma', areaHi: 'भाग्य, पिता, गुरु, दीर्घ यात्रा, उच्च शिक्षा, धर्म' },
    { num: 10, name: '10th House (Karma)', nameHi: 'दशम भाव (कर्म)', area: 'Career, reputation, authority, public image, government', areaHi: 'करियर, प्रतिष्ठा, अधिकार, सार्वजनिक छवि, शासन' },
    { num: 11, name: '11th House (Labha)', nameHi: 'एकादश भाव (लाभ)', area: 'Gains, income, elder siblings, social networks, aspirations', areaHi: 'लाभ, आय, बड़े भाई-बहन, सामाजिक नेटवर्क, आकांक्षाएँ' },
    { num: 12, name: '12th House (Vyaya)', nameHi: 'द्वादश भाव (व्यय)', area: 'Losses, expenses, foreign lands, spirituality, liberation', areaHi: 'व्यय, हानि, विदेश, आध्यात्मिकता, मोक्ष' },
  ];

  return (
    <>
      {/* ── Interactive client component FIRST — form must be above the fold ── */}
      <KundaliClient />

      {/* ── Server-rendered SEO content BELOW the form (crawlable but not blocking conversion) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {isHi ? (<>
            <h2 className="text-gold-light text-xl font-bold">कुण्डली (जन्म कुण्डली) क्या है?</h2>
            <p>कुण्डली (जन्म पत्रिका या जातक चार्ट) वैदिक ज्योतिष का मूल आधार है। यह जन्म के सटीक समय और स्थान पर आकाश में ग्रहों की स्थिति का मानचित्र है। 12 भावों (houses) में 9 ग्रहों (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु) का स्थान यह दर्शाता है कि जीवन के विभिन्न क्षेत्रों &mdash; स्वास्थ्य, करियर, विवाह, सन्तान, धन &mdash; पर किन ग्रहों का प्रभाव है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">कुण्डली बनाने के लिए क्या चाहिए?</h3>
            <p><strong>तीन आवश्यक जानकारी:</strong></p>
            <ul className="list-disc ml-4 space-y-1">
              <li><strong>जन्म तिथि:</strong> दिन, मास, वर्ष</li>
              <li><strong>जन्म समय:</strong> जितना सटीक हो उतना अच्छा (लग्न हर 2 घंटे में बदलता है, नक्षत्र पाद ~3.2 घंटे)</li>
              <li><strong>जन्म स्थान:</strong> अक्षांश और देशान्तर (शहर का नाम पर्याप्त है &mdash; हम स्वतः निर्देशांक ज्ञात कर लेते हैं)</li>
            </ul>
            <p>जन्म समय महत्वपूर्ण है क्योंकि लग्न (Ascendant) प्रत्येक ~2 घंटे में बदलता है, और भाव-स्वामित्व, ग्रह-बल तथा दशा-काल की गणना लग्न पर निर्भर करती है। 4-5 मिनट की त्रुटि भी परिणाम बदल सकती है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">उत्तर भारतीय बनाम दक्षिण भारतीय चार्ट</h3>
            <p><strong>उत्तर भारतीय (हीरा/डायमंड):</strong> भाव स्थिर रहते हैं, राशियाँ बदलती हैं। लग्न सदा शीर्ष-मध्य (हीरा) में। यह पद्धति उत्तर भारत, नेपाल और श्रीलंका में प्रचलित है।</p>
            <p><strong>दक्षिण भारतीय (ग्रिड):</strong> राशियाँ स्थिर रहती हैं, ग्रह बदलते हैं। मेष सदा ऊपर-बाँयें। तमिलनाडु, कर्नाटक, केरल और आन्ध्र प्रदेश में प्रचलित। हमारा गणक दोनों शैलियों का समर्थन करता है।</p>
          </>) : (<>
            <h2 className="text-gold-light text-xl font-bold">What is a Kundali (Birth Chart)?</h2>
            <p>A Kundali (also called Janam Patrika, Janam Kundli, or natal chart) is the foundational tool of Vedic astrology. It is a map of the sky at the exact moment and location of your birth, showing the positions of 9 celestial bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu) across 12 houses. Each house governs a specific domain of life &mdash; health, career, marriage, children, wealth, spirituality &mdash; and the planets placed there reveal the karmic patterns and potential of that domain.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">What Do You Need to Generate a Kundali?</h3>
            <p><strong>Three essential inputs:</strong></p>
            <ul className="list-disc ml-4 space-y-1">
              <li><strong>Date of birth:</strong> Day, month, and year</li>
              <li><strong>Time of birth:</strong> As precise as possible (the Ascendant changes every ~2 hours; nakshatra pada shifts every ~3.2 hours)</li>
              <li><strong>Place of birth:</strong> Latitude and longitude (entering a city name is sufficient &mdash; we resolve the coordinates automatically)</li>
            </ul>
            <p>Birth time accuracy is critical because the Ascendant (Lagna) changes approximately every 2 hours. House lordships, planetary strengths, and dasha periods are all calculated from the Ascendant, so even a 4&ndash;5 minute error can shift the entire chart interpretation.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">North Indian vs South Indian Chart Styles</h3>
            <p><strong>North Indian (Diamond/Kendra):</strong> Houses are fixed in position; signs rotate. The Ascendant is always at the top-centre diamond. This style is used across North India, Nepal, and Sri Lanka.</p>
            <p><strong>South Indian (Grid):</strong> Signs are fixed in position; planets move between them. Aries is always in the top-left cell. Used in Tamil Nadu, Karnataka, Kerala, and Andhra Pradesh. Our tool supports both styles &mdash; toggle between them after generating your chart.</p>
          </>)}

          {/* 12 Houses table */}
          <h3 className="text-gold-light text-lg font-bold mt-6">
            {isHi ? '12 भावों का संक्षिप्त विवरण' : 'The 12 Houses at a Glance'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-center py-2 px-2 text-gold-dark font-bold w-12">#</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'भाव' : 'House'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'जीवन क्षेत्र' : 'Life Area'}</th>
                </tr>
              </thead>
              <tbody>
                {HOUSES.map((h) => (
                  <tr key={h.num} className="border-b border-gold-primary/5">
                    <td className="py-1.5 px-2 text-center text-gold-light font-bold">{h.num}</td>
                    <td className="py-1.5 px-3 text-text-primary font-medium text-xs">{isHi ? h.nameHi : h.name}</td>
                    <td className="py-1.5 px-3 text-text-secondary text-xs">{isHi ? h.areaHi : h.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isHi ? (
            <p className="mt-4">नीचे दिए गए फॉर्म में अपनी जन्म जानकारी भरें। हमारा गणक स्वतः ग्रह स्थिति, लग्न, दशा-अन्तर्दशा, योग, दोष, शडबल, अष्टकवर्ग और सम्पूर्ण विश्लेषण (टिप्पणी) उत्पन्न करेगा &mdash; सब कुछ आपके ब्राउज़र में, बिना किसी बाहरी API के।</p>
          ) : (
            <p className="mt-4">Enter your birth details in the form below. Our engine will compute planetary positions, Ascendant, Vimshottari dasha periods, yogas, doshas, Shadbala, Ashtakavarga, and a comprehensive interpretive commentary (Tippanni) &mdash; all computed locally in your browser using Meeus algorithms, with no external APIs.</p>
          )}

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/matching`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'कुण्डली मिलान \u2192' : 'Kundali Matching \u2192'}</Link>
            <Link href={`/${locale}/sade-sati`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'साढ़े साती जाँच \u2192' : 'Sade Sati Check \u2192'}</Link>
            <Link href={`/${locale}/learn/kundali`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'कुण्डली पढ़ना सीखें \u2192' : 'Learn to Read a Kundali \u2192'}</Link>
            <Link href={`/${locale}/learn/grahas`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'नवग्रह \u2192' : 'Nine Planets \u2192'}</Link>
          </div>
        </article>
      </section>
    </>
  );
}
