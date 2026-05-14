import Link from 'next/link';
import CalendarClient from './Client';

export const revalidate = 86400;

// Major Hindu festivals for 2026 with approximate dates — server-rendered for SEO
const FESTIVALS_2026 = [
  { name: 'Makar Sankranti', nameHi: 'मकर संक्रान्ति', date: '14 Jan 2026', desc: 'Sun enters Capricorn. Kite flying, til-gur sweets.', descHi: 'सूर्य का मकर राशि प्रवेश। पतंग उत्सव, तिल-गुड़।' },
  { name: 'Vasant Panchami', nameHi: 'वसन्त पंचमी', date: '2 Feb 2026', desc: 'Saraswati Puja. Start of spring season.', descHi: 'सरस्वती पूजा। वसन्त ऋतु का आरम्भ।' },
  { name: 'Maha Shivaratri', nameHi: 'महा शिवरात्रि', date: '16 Feb 2026', desc: 'Night of Lord Shiva. Fasting and night-long worship.', descHi: 'शिव की रात्रि। उपवास और रात्रि पूजन।' },
  { name: 'Holi', nameHi: 'होली', date: '13 Mar 2026', desc: 'Festival of colours. Holika Dahan on the eve.', descHi: 'रंगों का त्योहार। पूर्व संध्या को होलिका दहन।' },
  { name: 'Ugadi / Gudi Padwa', nameHi: 'उगादि / गुड़ी पड़वा', date: '29 Mar 2026', desc: 'Hindu New Year (lunisolar). Chaitra Shukla Pratipada.', descHi: 'हिन्दू नववर्ष। चैत्र शुक्ल प्रतिपदा।' },
  { name: 'Ram Navami', nameHi: 'राम नवमी', date: '6 Apr 2026', desc: 'Birth of Lord Rama. Chaitra Shukla Navami.', descHi: 'भगवान राम का जन्मोत्सव। चैत्र शुक्ल नवमी।' },
  { name: 'Hanuman Jayanti', nameHi: 'हनुमान जयन्ती', date: '12 Apr 2026', desc: 'Birth of Lord Hanuman. Chaitra Purnima.', descHi: 'हनुमान जयन्ती। चैत्र पूर्णिमा।' },
  { name: 'Akshaya Tritiya', nameHi: 'अक्षय तृतीया', date: '30 Apr 2026', desc: 'Auspicious for new beginnings. Gold purchases.', descHi: 'नई शुरुआत के लिए शुभ। स्वर्ण खरीद।' },
  { name: 'Buddha Purnima', nameHi: 'बुद्ध पूर्णिमा', date: '12 May 2026', desc: 'Birth of Gautama Buddha. Vaishakha Purnima.', descHi: 'गौतम बुद्ध का जन्मदिन। वैशाख पूर्णिमा।' },
  { name: 'Guru Purnima', nameHi: 'गुरु पूर्णिमा', date: '10 Jul 2026', desc: 'Honouring spiritual teachers. Ashadha Purnima.', descHi: 'गुरु वन्दना। आषाढ़ पूर्णिमा।' },
  { name: 'Raksha Bandhan', nameHi: 'रक्षा बन्धन', date: '8 Aug 2026', desc: 'Brother-sister bond. Shravana Purnima.', descHi: 'भाई-बहन का बन्धन। श्रावण पूर्णिमा।' },
  { name: 'Janmashtami', nameHi: 'जन्माष्टमी', date: '23 Aug 2026', desc: 'Birth of Lord Krishna. Bhadrapada Krishna Ashtami.', descHi: 'श्री कृष्ण जन्मोत्सव। भाद्रपद कृष्ण अष्टमी।' },
  { name: 'Ganesh Chaturthi', nameHi: 'गणेश चतुर्थी', date: '2 Sep 2026', desc: 'Birth of Lord Ganesha. 10-day celebration.', descHi: 'गणेश जन्मोत्सव। 10 दिवसीय उत्सव।' },
  { name: 'Navaratri', nameHi: 'नवरात्रि', date: '12\u201321 Oct 2026', desc: 'Nine nights of Goddess Durga worship.', descHi: 'देवी दुर्गा की नौ रात्रियों का उत्सव।' },
  { name: 'Dussehra', nameHi: 'दशहरा', date: '22 Oct 2026', desc: 'Victory of Rama over Ravana. Vijayadashami.', descHi: 'राम की रावण पर विजय। विजयादशमी।' },
  { name: 'Diwali', nameHi: 'दीपावली', date: '10 Nov 2026', desc: 'Festival of lights. Kartika Amavasya.', descHi: 'दीपों का त्योहार। कार्तिक अमावस्या।' },
  { name: 'Chhath Puja', nameHi: 'छठ पूजा', date: '14 Nov 2026', desc: 'Sun worship. Kartika Shukla Shashthi.', descHi: 'सूर्य पूजा। कार्तिक शुक्ल षष्ठी।' },
  { name: 'Dev Diwali', nameHi: 'देव दीवाली', date: '25 Nov 2026', desc: 'Diwali of the Gods. Kartika Purnima.', descHi: 'देवताओं की दीपावली। कार्तिक पूर्णिमा।' },
];

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <>
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {isHi ? (<>
            <h2 className="text-gold-light text-xl font-bold">हिन्दू त्योहार कैलेंडर 2026</h2>
            <p>हिन्दू कैलेंडर (पंचांग) चन्द्र-सौर प्रणाली पर आधारित है जिसमें मास, तिथि, नक्षत्र, योग और करण पाँच अंगों से मिलकर बनते हैं। प्रत्येक त्योहार और व्रत की तिथि चन्द्रमा की कला (तिथि) और मास (अमान्त या पूर्णिमान्त) से निर्धारित होती है। यही कारण है कि ग्रेगोरियन कैलेंडर पर तारीखें प्रतिवर्ष बदलती हैं।</p>
            <p>यह कैलेंडर आपके स्थान के अनुसार सटीक तिथि, एकादशी पारण समय, पूर्णिमा, अमावस्या, चतुर्थी, प्रदोष और ग्रहण सहित सम्पूर्ण पंचांग प्रदान करता है। प्रत्येक त्योहार पर क्लिक करें &mdash; विस्तृत विधि, महत्व और पूजा पद्धति देखें।</p>
          </>) : (<>
            <h2 className="text-gold-light text-xl font-bold">Hindu Festival Calendar 2026</h2>
            <p>The Hindu calendar (Panchang) follows a lunisolar system where months, tithis (lunar days), nakshatras (lunar mansions), yogas, and karanas form the five limbs of timekeeping. Every festival and vrat date is determined by the Moon&apos;s phase (tithi) and the lunar month (Amanta or Purnimanta convention), which is why Gregorian dates shift each year.</p>
            <p>This calendar provides location-accurate dates for all major festivals, Ekadashi fasting days with Parana (fast-breaking) times, Purnima, Amavasya, Chaturthi, Pradosham, and eclipses. Click on any festival to see detailed puja vidhi, significance, and observance instructions.</p>
          </>)}

          {/* 2026 festival table */}
          <h3 className="text-gold-light text-lg font-bold mt-6">
            {isHi ? '2026 के प्रमुख त्योहार' : 'Major Festivals in 2026'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'तिथि (अनुमानित)' : 'Date (Approx.)'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'विवरण' : 'Description'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVALS_2026.map((f, i) => (
                  <tr key={i} className="border-b border-gold-primary/5">
                    <td className="py-1.5 px-3 text-gold-light font-medium whitespace-nowrap">{isHi ? f.nameHi : f.name}</td>
                    <td className="py-1.5 px-3 text-text-primary whitespace-nowrap">{f.date}</td>
                    <td className="py-1.5 px-3 text-text-secondary text-xs">{isHi ? f.descHi : f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isHi ? (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">कैलेंडर की विशेषताएँ</h3>
            <p>हमारा कैलेंडर स्थान-आधारित है &mdash; सभी तिथि समय, सूर्योदय/सूर्यास्त, और एकादशी पारण खिड़कियाँ आपके शहर के अनुसार गणना की जाती हैं। आप पश्चिमी मास (जनवरी-दिसम्बर), हिन्दू चन्द्र मास (चैत्र-फाल्गुन), या तिथि ग्रिड दृश्य में देख सकते हैं। फ़िल्टर करें: केवल त्योहार, एकादशी, पूर्णिमा, अमावस्या, चतुर्थी, प्रदोष, या ग्रहण। ICS निर्यात से अपने Apple/Google कैलेंडर में जोड़ें।</p>
          </>) : (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">Calendar Features</h3>
            <p>Our calendar is location-aware &mdash; all tithi timings, sunrise/sunset, and Ekadashi Parana windows are computed for your city. Switch between Western months (January&ndash;December), Hindu lunar months (Chaitra&ndash;Phalguna), or a visual Tithi Grid view. Filter by category: festivals only, Ekadashi, Purnima, Amavasya, Chaturthi, Pradosham, or eclipses. Export to your Apple or Google Calendar via ICS download.</p>
          </>)}

          <p className="text-xs text-text-secondary/60 mt-2">
            {isHi
              ? '* ऊपर दी गई तारीखें अनुमानित हैं। सटीक तिथि आपके स्थान पर निर्भर करती है। नीचे अपना शहर दर्ज करें।'
              : '* Dates above are approximate. Exact dates depend on your location. Enter your city below for precise timings.'}
          </p>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/panchang`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'आज का पंचांग \u2192' : "Today\u2019s Panchang \u2192"}</Link>
            <Link href={`/${locale}/learn/tithis`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'तिथियों के बारे में जानें \u2192' : 'Learn about Tithis \u2192'}</Link>
            <Link href={`/${locale}/learn/muhurtas`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'मुहूर्त सीखें \u2192' : 'Learn about Muhurtas \u2192'}</Link>
            <Link href={`/${locale}/vedic-time`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'वैदिक समय \u2192' : 'Vedic Time \u2192'}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <CalendarClient />
    </>
  );
}
