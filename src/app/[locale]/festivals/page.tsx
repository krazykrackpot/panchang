import { getLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Calendar, Sparkles, MapPin, ChevronRight } from 'lucide-react';

// ─── Festival data ────────────────────────────────────────────────────────────

const FESTIVALS = [
  {
    slug: 'makar-sankranti',
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति' },
    desc: { en: "Sun's northward transit — sesame sweets, kite flying, Ganga bathing.", hi: 'सूर्य की उत्तरायण यात्रा — तिल, पतंग, गंगा स्नान।' },
    month: 'January',
  },
  {
    slug: 'vasant-panchami',
    name: { en: 'Vasant Panchami', hi: 'वसंत पंचमी' },
    desc: { en: 'Goddess Saraswati puja — start of spring, day to begin new learning.', hi: 'सरस्वती पूजा — वसन्त आगमन, विद्यारम्भ का शुभ दिन।' },
    month: 'January–February',
  },
  {
    slug: 'holika-dahan',
    name: { en: 'Holika Dahan', hi: 'होलिका दहन' },
    desc: { en: 'Bonfire ritual on Purnima eve symbolising victory of devotion over evil.', hi: 'पूर्णिमा की रात्रि होलिका दहन — भक्ति की असुर पर विजय।' },
    month: 'February–March',
  },
  {
    slug: 'holi',
    name: { en: 'Holi', hi: 'होली' },
    desc: { en: 'Festival of colours — spring celebration of joy, love, and renewal.', hi: 'रंगों का त्योहार — वसन्त उत्सव, प्रेम और आनन्द का पर्व।' },
    month: 'February–March',
  },
  {
    slug: 'ram-navami',
    name: { en: 'Ram Navami', hi: 'रामनवमी' },
    desc: { en: 'Birthday of Lord Rama — Madhyahna Muhurta puja on Chaitra Shukla Navami.', hi: 'भगवान राम का जन्मोत्सव — चैत्र शुक्ल नवमी पर मध्याह्न मुहूर्त पूजा।' },
    month: 'March–April',
  },
  {
    slug: 'hanuman-jayanti',
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती' },
    desc: { en: 'Birth anniversary of Hanuman — sunrise abhishek, Sundarkand path.', hi: 'हनुमान जन्मोत्सव — सूर्योदय अभिषेक, सुन्दरकाण्ड पाठ।' },
    month: 'April',
  },
  {
    slug: 'akshaya-tritiya',
    name: { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया' },
    desc: { en: 'All-day auspicious muhurta — ideal for gold purchase, weddings, new ventures.', hi: 'सम्पूर्ण दिन शुभ मुहूर्त — स्वर्ण क्रय, विवाह, नए उद्यम के लिए उत्तम।' },
    month: 'April–May',
  },
  {
    slug: 'guru-purnima',
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा' },
    desc: { en: 'Full Moon honouring the Guru — Vyasa Puja, gratitude, spiritual renewal.', hi: 'गुरु सम्मान की पूर्णिमा — व्यास पूजा, कृतज्ञता, आध्यात्मिक नवीकरण।' },
    month: 'June–July',
  },
  {
    slug: 'hartalika-teej',
    name: { en: 'Hartalika Teej', hi: 'हरतालिका तीज' },
    desc: { en: "Women's fast for Shiva–Parvati union — Pradosh Kaal puja, no food or water.", hi: 'शिव-पार्वती मिलन का व्रत — प्रदोष काल पूजा, निर्जला उपवास।' },
    month: 'August–September',
  },
  {
    slug: 'ganesh-chaturthi',
    name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी' },
    desc: { en: 'Ten-day festival of Ganesha — Madhyahna Muhurta installation, immersion on Anant Chaturdashi.', hi: 'दस दिवसीय गणेश उत्सव — मध्याह्न स्थापना, अनन्त चतुर्दशी पर विसर्जन।' },
    month: 'August–September',
  },
  {
    slug: 'dussehra',
    name: { en: 'Dussehra', hi: 'दशहरा' },
    desc: { en: "Vijayadashami — Aparahna Muhurta Ravana dahan, Shastra Puja, Shami worship.", hi: 'विजयादशमी — अपराह्न मुहूर्त रावण दहन, शस्त्र पूजा, शमी पूजन।' },
    month: 'October',
  },
  {
    slug: 'dhanteras',
    name: { en: 'Dhanteras', hi: 'धनतेरस' },
    desc: { en: 'Dhanvantari Jayanti — Pradosh Kaal gold and silver purchase, Yama Deepam.', hi: 'धनवंतरि जयन्ती — प्रदोष काल स्वर्ण-रजत क्रय, यम दीपम।' },
    month: 'October–November',
  },
  {
    slug: 'narak-chaturdashi',
    name: { en: 'Narak Chaturdashi', hi: 'नरक चतुर्दशी' },
    desc: { en: 'Chhoti Diwali — Arunodaya Kaal oil bath before sunrise, Abhyanga Snana.', hi: 'छोटी दीपावली — अरुणोदय काल में सूर्योदय से पूर्व अभ्यंग स्नान।' },
    month: 'October–November',
  },
  {
    slug: 'diwali',
    name: { en: 'Diwali', hi: 'दीपावली' },
    desc: { en: 'Festival of lights — Lakshmi Puja at Pradosh Kaal, fireworks, diyas.', hi: 'दीपों का पर्व — प्रदोष काल लक्ष्मी पूजा, आतिशबाजी, दीपोत्सव।' },
    month: 'October–November',
  },
  {
    slug: 'govardhan-puja',
    name: { en: 'Govardhan Puja', hi: 'गोवर्धन पूजा' },
    desc: { en: "Krishna's victory over Indra — Annakut offering, Go Puja at sunrise.", hi: 'इन्द्र पर कृष्ण की विजय — अन्नकूट भोग, सूर्योदय पर गो पूजा।' },
    month: 'October–November',
  },
  {
    slug: 'bhai-dooj',
    name: { en: 'Bhai Dooj', hi: 'भाई दूज' },
    desc: { en: "Brothers' day — sisters apply tilak at Madhyahna, blessing ritual.", hi: "भाई-बहन का पर्व — मध्याह्न में बहन का तिलक, आशीर्वाद अनुष्ठान।" },
    month: 'October–November',
  },
  {
    slug: 'chhath-puja',
    name: { en: 'Chhath Puja', hi: 'छठ पूजा' },
    desc: { en: 'Four-day Sun worship — Arghya at sunset then sunrise, riverbank rituals.', hi: 'चार दिवसीय सूर्य उपासना — सायं व प्रातः अर्घ्य, नदी तट पर अनुष्ठान।' },
    month: 'October–November',
  },
  {
    slug: 'janmashtami',
    name: { en: 'Janmashtami', hi: 'जन्माष्टमी' },
    desc: { en: "Krishna's birth at Nishita Kaal midnight — fasting, Dahi Handi, bhajan.", hi: 'निशीथ काल में कृष्ण जन्म — उपवास, दही हांडी, भजन-कीर्तन।' },
    month: 'August',
  },
  {
    slug: 'raksha-bandhan',
    name: { en: 'Raksha Bandhan', hi: 'रक्षाबंधन' },
    desc: { en: "Bond of protection — tying rakhi during Aparahna, avoiding Bhadra.", hi: 'रक्षा का बंधन — अपराह्न में राखी, भद्रा काल का परिहार।' },
    month: 'July–August',
  },
  {
    slug: 'maha-shivaratri',
    name: { en: 'Maha Shivaratri', hi: 'महाशिवरात्रि' },
    desc: { en: "Night of Shiva — four Prahar pujas, Nishita Kaal as the most sacred watch.", hi: 'शिव की महारात्रि — चार प्रहर पूजा, निशीथ काल सर्वाधिक पवित्र।' },
    month: 'February–March',
  },
] as const;

// Top cities shown inline on each card (first 6); rest available via the festival page
const TOP_CITIES = [
  { slug: 'delhi',      name: 'Delhi' },
  { slug: 'mumbai',     name: 'Mumbai' },
  { slug: 'bangalore',  name: 'Bangalore' },
  { slug: 'kolkata',    name: 'Kolkata' },
  { slug: 'varanasi',   name: 'Varanasi' },
  { slug: 'new-york',   name: 'New York' },
] as const;

// All 15 cities — linked from the "View all cities" section on each card
const ALL_CITIES = [
  { slug: 'delhi',       name: 'Delhi' },
  { slug: 'mumbai',      name: 'Mumbai' },
  { slug: 'bangalore',   name: 'Bangalore' },
  { slug: 'chennai',     name: 'Chennai' },
  { slug: 'kolkata',     name: 'Kolkata' },
  { slug: 'hyderabad',   name: 'Hyderabad' },
  { slug: 'pune',        name: 'Pune' },
  { slug: 'ahmedabad',   name: 'Ahmedabad' },
  { slug: 'jaipur',      name: 'Jaipur' },
  { slug: 'lucknow',     name: 'Lucknow' },
  { slug: 'varanasi',    name: 'Varanasi' },
  { slug: 'patna',       name: 'Patna' },
  { slug: 'bhopal',      name: 'Bhopal' },
  { slug: 'chandigarh',  name: 'Chandigarh' },
  { slug: 'new-york',    name: 'New York' },
] as const;

const CURRENT_YEAR = 2026;
const NEXT_YEAR = 2027;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FestivalsHubPage() {
  const locale = await getLocale();
  const isHindi = locale === 'hi';

  const label = {
    heading:    isHindi ? 'हिन्दू त्योहार — तिथि, मुहूर्त और समय' : 'Hindu Festival Dates & Timings',
    subheading: isHindi
      ? `२०${CURRENT_YEAR - 2000} और २०${NEXT_YEAR - 2000} के लिए भारत और विश्व के शहरों में सटीक तिथि, मुहूर्त और पूजा समय।`
      : `Exact dates, Tithi, Muhurta, and city-specific puja timings for ${CURRENT_YEAR} & ${NEXT_YEAR} — computed from classical Vedic algorithms for ${ALL_CITIES.length} cities.`,
    introPara: isHindi
      ? 'प्रत्येक त्योहार पृष्ठ पर आपको मिलेगा: काल-व्याप्ति आधारित सटीक तारीख, सूर्योदय और तिथि समय, शहर-विशेष पूजा मुहूर्त, व्रत एवं अनुष्ठान विधि, और ऐतिहासिक-पौराणिक संदर्भ।'
      : 'Every festival page shows: the exact date by Kala-Vyapti (tithi prevalence) rule, city-specific sunrise and tithi times, the auspicious puja muhurta window, observance rituals, and the mythology behind the celebration.',
    cityTimings: isHindi ? 'शहर-विशेष समय' : 'City-specific timings',
    viewAll:     isHindi ? 'सभी शहर देखें →' : 'View all cities →',
    allCities:   isHindi ? 'सभी शहर' : 'All cities',
    festivals:   isHindi ? 'त्योहार' : 'Festivals',
    year:        isHindi ? 'वर्ष' : 'Year',
  };

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2d1b69]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1a1040]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-text-secondary mb-6">
            <Link href="/" className="hover:text-gold-light transition-colors">
              {isHindi ? 'होम' : 'Home'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold-primary">{isHindi ? 'त्योहार' : 'Festivals'}</span>
          </nav>

          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-7 h-7 text-gold-primary" />
            <Sparkles className="w-5 h-5 text-gold-light/70" />
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {label.heading}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-6">
            {label.subheading}
          </p>
          <p className="text-text-secondary/80 text-sm max-w-2xl mx-auto leading-relaxed">
            {label.introPara}
          </p>

          {/* Year quick-links */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            {[CURRENT_YEAR, NEXT_YEAR].map((yr) => (
              <span
                key={yr}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2d1b69]/50 to-[#1a1040]/60 border border-gold-primary/20 text-gold-light text-sm font-medium"
              >
                {yr}
              </span>
            ))}
            <span className="text-text-secondary/60 text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {ALL_CITIES.length} {isHindi ? 'शहर' : 'cities'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Festival grid ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {FESTIVALS.map((festival) => {
            const name = isHindi ? festival.name.hi : festival.name.en;
            const desc = isHindi ? festival.desc.hi : festival.desc.en;

            return (
              <article
                key={festival.slug}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 hover:border-gold-primary/40 transition-all duration-200 group flex flex-col"
              >
                {/* Festival name + month */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2
                    className="text-gold-light font-bold text-lg leading-snug group-hover:text-gold-primary transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {name}
                  </h2>
                  <span className="shrink-0 text-xs text-text-secondary/60 bg-[#2d1b69]/30 px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5">
                    {festival.month}
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
                  {desc}
                </p>

                {/* City pills — top 6, both years */}
                <div className="space-y-3">
                  {[CURRENT_YEAR, NEXT_YEAR].map((yr) => (
                    <div key={yr}>
                      <p className="text-xs text-text-secondary/50 mb-1.5 font-medium">{yr}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {TOP_CITIES.map((city) => (
                          <Link
                            key={city.slug}
                            href={`/festivals/${festival.slug}/${yr}/${city.slug}` as `/${string}`}
                            className="text-xs text-gold-primary/80 hover:text-gold-light bg-gold-primary/8 hover:bg-gold-primary/15 border border-gold-primary/15 hover:border-gold-primary/35 px-2.5 py-1 rounded-full transition-all duration-150"
                          >
                            {city.name}
                          </Link>
                        ))}
                        {/* More cities link */}
                        <Link
                          href={`/festivals/${festival.slug}/${yr}/delhi` as `/${string}`}
                          className="text-xs text-text-secondary/50 hover:text-gold-primary/70 px-2.5 py-1 transition-colors duration-150"
                        >
                          +{ALL_CITIES.length - TOP_CITIES.length} {isHindi ? 'और' : 'more'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* ── All cities reference ─────────────────────────────────────── */}
        <div className="mt-14 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8">
          <h2
            className="text-gold-light font-bold text-xl mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isHindi ? 'सभी उपलब्ध शहर' : 'All Available Cities'}
          </h2>
          <p className="text-text-secondary text-sm mb-5">
            {isHindi
              ? 'प्रत्येक शहर के निर्देशांक से सटीक सूर्योदय, तिथि और पूजा मुहूर्त की गणना की जाती है।'
              : 'Each city page uses exact coordinates to compute sunrise, tithi end-time, and puja muhurta specific to that location.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_CITIES.map((city) => (
              <span
                key={city.slug}
                className="text-sm text-text-secondary/70 bg-[#2d1b69]/25 border border-gold-primary/12 px-3 py-1.5 rounded-lg"
              >
                {city.name}
              </span>
            ))}
          </div>
          <p className="text-text-secondary/50 text-xs mt-4">
            {isHindi
              ? `त्योहार के नाम पर क्लिक करके शहर चुनें। प्रत्येक त्योहार × शहर × ${CURRENT_YEAR}/${NEXT_YEAR} का अलग पृष्ठ उपलब्ध है।`
              : `Select a festival above, then pick your city. Separate pages exist for every festival × city × ${CURRENT_YEAR}/${NEXT_YEAR} combination.`}
          </p>
        </div>
      </section>
    </main>
  );
}
