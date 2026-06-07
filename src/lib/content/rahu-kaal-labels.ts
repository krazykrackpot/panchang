/**
 * Locale-aware label table for /rahu-kaal pages.
 *
 * en/hi/sa are authored canonical copy maintained here; mai/mr/te/kn/gu/bn
 * sourced from a Gemini-translated overlay JSON built by
 * scripts/translate-rahu-kaal-via-gemini.py.
 *
 * Consumers: page.tsx (SSR) + Client.tsx (interactive island).
 *
 * Helper:
 *   pickRahuLabel(key, locale)              → string with locale → hi → en fallback
 *   formatRahuLabel(key, locale, vars)      → substitutes {WEEKDAY}/{DATE}/{RAHU}/etc.
 */
import overlay from '@/lib/constants/rahu-kaal-labels-overlay.json';

type Overlay = Record<string, Record<string, string>>;
const OVERLAY = overlay as Overlay;

const AUTHORED: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Rahu Kaal Today',
    rahuKaal: 'Rahu Kaal',
    yamaganda: 'Yamaganda',
    gulika: 'Gulika Kaal',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    timeline: 'Timeline',
    whatIs: 'What is Rahu Kaal?',
    whatIsText: 'Rahu Kaal (also spelled Rahu Kalam) is a period of approximately 90 minutes each day that is considered inauspicious in Vedic astrology. It is ruled by the shadow planet Rahu, one of the nine celestial bodies (Navagraha). During this time, starting new ventures, journeys, or important activities is traditionally avoided. Rahu Kaal occurs at different times each day based on the day of the week and the local sunrise/sunset times.',
    howCalc: 'How is it Calculated?',
    howCalcText: 'The day (sunrise to sunset) is divided into 8 equal parts. Each part is assigned to a planet in a fixed weekly sequence. The segment assigned to Rahu is Rahu Kaal. For example, on Monday, Rahu Kaal falls in the 2nd segment; on Saturday, it falls in the 6th. Yamaganda (ruled by Yama) and Gulika Kaal (ruled by Saturn\'s son Gulika) are similarly calculated from different segments of the day.',
    avoid: 'Activities to Avoid During Rahu Kaal',
    avoidItems: 'Starting a new business or venture|Signing important contracts or agreements|Beginning a journey or travel|Purchasing property or vehicles|Conducting marriage or engagement ceremonies|Starting construction of a new building|Filing legal documents|Making major financial investments',
    seeAlso: 'See Also',
    inauspicious: 'Inauspicious',
    caution: 'Caution',
    city: 'City',
    todaysPanchang: "Today's Panchang",
    choghadiya: 'Choghadiya',
    horaChart: 'Hora Chart',
    auspiciousMuhurat: 'Auspicious Muhurat',
    festivalCalendar: 'Festival Calendar',
    headline: 'Rahu Kaal Today — {WEEKDAY}, {DATE}',
    primaryAnswer: "Today's Rahu Kaal on {WEEKDAY} is {START} to {END} (Delhi). Avoid starting new ventures during this period.",
    introNote: 'Rahu Kaal is a ~90-minute inauspicious period every day. It is calculated from sunrise and sunset, so times differ for each city.',
    edu1Heading: 'What is Rahu Kaal?',
    edu1Body: 'Rahu Kaal is an inauspicious time period in Vedic astrology that occurs daily for approximately 90 minutes. It is calculated by dividing the time between sunrise and sunset into 8 equal parts. Each day of the week has Rahu Kaal in a different segment — Sunday in the 8th part, Monday in the 2nd, Tuesday in the 7th, Wednesday in the 5th, Thursday in the 6th, Friday in the 4th, and Saturday in the 3rd part.',
    edu2Heading: 'What to Avoid During Rahu Kaal?',
    edu2Body: 'During Rahu Kaal, it is considered inauspicious to start new ventures, sign contracts, begin travel, or make important decisions. However, continuing work that was already started before Rahu Kaal is not affected.',
    edu3HeadingTemplate: 'Rahu Kaal Order for {WEEKDAY}',
    edu3BodyTemplate: 'On {WEEKDAY}, Rahu Kaal falls in the {RAHU} segment after sunrise. Yamaganda falls in the {YAMA} segment, and Gulika Kaal in the {GULIKA} segment.',
    ord1: '1st', ord2: '2nd', ord3: '3rd', ord4: '4th', ord5: '5th', ord6: '6th', ord7: '7th', ord8: '8th',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का राहु काल',
    rahuKaal: 'राहु काल',
    yamaganda: 'यमगण्ड',
    gulika: 'गुलिक काल',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    timeline: 'समयरेखा',
    whatIs: 'राहु काल क्या है?',
    whatIsText: 'राहु काल (राहु कालम्) प्रतिदिन लगभग 90 मिनट की एक अवधि है जिसे वैदिक ज्योतिष में अशुभ माना जाता है। यह छाया ग्रह राहु द्वारा शासित है, जो नवग्रहों में से एक है। इस समय नए कार्य, यात्रा या महत्वपूर्ण गतिविधियां शुरू करना परम्परागत रूप से वर्जित है। राहु काल प्रतिदिन सप्ताह के दिन और स्थानीय सूर्योदय/सूर्यास्त समय के आधार पर अलग-अलग समय पर होता है।',
    howCalc: 'इसकी गणना कैसे होती है?',
    howCalcText: 'दिन (सूर्योदय से सूर्यास्त) को 8 समान भागों में विभाजित किया जाता है। प्रत्येक भाग एक निश्चित साप्ताहिक क्रम में एक ग्रह को सौंपा जाता है। राहु को सौंपा गया भाग राहु काल है। यमगण्ड (यम द्वारा शासित) और गुलिक काल (शनि पुत्र गुलिक द्वारा शासित) की गणना भी इसी प्रकार दिन के अलग-अलग भागों से की जाती है।',
    avoid: 'राहु काल में टालने योग्य कार्य',
    avoidItems: 'नया व्यापार या उद्यम शुरू करना|महत्वपूर्ण अनुबंध या समझौतों पर हस्ताक्षर करना|यात्रा या सफर शुरू करना|सम्पत्ति या वाहन खरीदना|विवाह या सगाई समारोह करना|नए भवन का निर्माण शुरू करना|कानूनी दस्तावेज दाखिल करना|बड़ा वित्तीय निवेश करना',
    seeAlso: 'यह भी देखें',
    inauspicious: 'अशुभ',
    caution: 'सावधानी',
    city: 'शहर',
    todaysPanchang: 'आज का पंचांग',
    choghadiya: 'चौघड़िया',
    horaChart: 'होरा',
    auspiciousMuhurat: 'शुभ मुहूर्त',
    festivalCalendar: 'त्योहार कैलेंडर',
    headline: 'आज का राहु काल — {WEEKDAY}, {DATE}',
    primaryAnswer: 'आज {WEEKDAY} को राहु काल {START} से {END} तक है (दिल्ली)। इस अवधि में नए कार्य आरंभ न करें।',
    introNote: 'राहु काल प्रतिदिन ~90 मिनट का अशुभ काल है। यह सूर्योदय और सूर्यास्त से गणना किया जाता है, इसलिए प्रत्येक शहर के लिए समय अलग होता है।',
    edu1Heading: 'राहु काल क्या है?',
    edu1Body: 'राहु काल वैदिक ज्योतिष में एक अशुभ समय खण्ड है जो प्रतिदिन लगभग 90 मिनट का होता है। इसकी गणना सूर्योदय से सूर्यास्त तक के समय को 8 भागों में विभाजित करके की जाती है। प्रत्येक दिन का राहु काल अलग क्रम में आता है — रविवार को 8वाँ भाग, सोमवार को 2रा, मंगलवार को 7वाँ, बुधवार को 5वाँ, गुरुवार को 6ठा, शुक्रवार को 4था, और शनिवार को 3रा भाग राहु काल होता है।',
    edu2Heading: 'राहु काल में क्या नहीं करना चाहिए?',
    edu2Body: 'राहु काल में नए कार्य आरंभ करना, अनुबंध पर हस्ताक्षर करना, यात्रा प्रारंभ करना, या कोई महत्वपूर्ण निर्णय लेना वर्जित माना जाता है। हालाँकि, पहले से शुरू किए गए कार्यों को जारी रखने में कोई बाधा नहीं है।',
    edu3HeadingTemplate: 'आज {WEEKDAY} को राहु काल का क्रम',
    edu3BodyTemplate: '{WEEKDAY} को राहु काल सूर्योदय से {RAHU} भाग में आता है। यमगण्ड {YAMA} भाग में, और गुलिक काल {GULIKA} भाग में आता है।',
    ord1: '1ले', ord2: '2रे', ord3: '3रे', ord4: '4थे', ord5: '5वें', ord6: '6ठे', ord7: '7वें', ord8: '8वें',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    title: 'अद्य राहुकालः',
    rahuKaal: 'राहुकालः',
    yamaganda: 'यमगण्डः',
    gulika: 'गुलिककालः',
    sunrise: 'सूर्योदयः',
    sunset: 'सूर्यास्तः',
    timeline: 'समयरेखा',
    whatIs: 'राहुकालः किम्?',
    whatIsText: 'राहुकालः प्रतिदिनं प्रायः नवतिनिमेषाणां कालखण्डमस्ति यत् वैदिकज्योतिषे अशुभं मन्यते। एषः छायाग्रहेण राहुणा शासितः, यः नवग्रहेषु अन्यतमः। अस्मिन् काले नवकार्याणां यात्रायाः महत्त्वपूर्णकार्याणां वा आरम्भः परम्परया वर्जितः।',
    howCalc: 'गणना कथं भवति?',
    howCalcText: 'दिनं (सूर्योदयात् सूर्यास्तपर्यन्तम्) अष्टसमभागेषु विभज्यते। प्रत्येकं भागः निश्चितसाप्ताहिकक्रमेण एकस्मै ग्रहाय दीयते। राहवे दत्तं खण्डं राहुकालः। यमगण्डः गुलिककालश्च एवमेव दिनस्य भिन्नखण्डेभ्यः गण्यन्ते।',
    avoid: 'राहुकाले वर्जनीयानि कार्याणि',
    avoidItems: 'नवव्यापारस्य आरम्भः|महत्त्वपूर्णानुबन्धेषु हस्ताक्षरम्|यात्रायाः आरम्भः|सम्पत्तेः वाहनस्य वा क्रयणम्|विवाहसगाईसमारोहः|नवभवनस्य निर्माणारम्भः|विधिदस्तावेजदाखिला|वृहद्वित्तीयनिवेशः',
    seeAlso: 'एतदपि पश्यतु',
    inauspicious: 'अशुभम्',
    caution: 'सावधानता',
    city: 'नगरम्',
    todaysPanchang: 'अद्यतनं पञ्चाङ्गम्',
    choghadiya: 'चौघड़ियम्',
    horaChart: 'होरा',
    auspiciousMuhurat: 'शुभमुहूर्तः',
    festivalCalendar: 'पर्वकालसारिणी',
    headline: 'अद्य राहुकालः — {WEEKDAY}, {DATE}',
    primaryAnswer: 'अद्य {WEEKDAY} दिने राहुकालः {START} तः {END} पर्यन्तम् (देहली)। अस्मिन् काले नवकार्याणि न आरभेत्।',
    introNote: 'राहुकालः प्रतिदिनं प्रायः ९० निमेषाणाम् अशुभकालः। एषः सूर्योदयसूर्यास्तकालात् गण्यते, अतः प्रत्येकनगरकृते समयः भिन्नः।',
    edu1Heading: 'राहुकालः किम्?',
    edu1Body: 'राहुकालः वैदिकज्योतिषे अशुभं कालखण्डम् अस्ति यत् प्रतिदिनं प्रायः ९० निमेषाणाम् भवति।',
    edu2Heading: 'राहुकाले किं वर्जनीयम्?',
    edu2Body: 'राहुकाले नवकार्याणाम् आरम्भः, अनुबन्धहस्ताक्षरम्, यात्रारम्भः, महत्त्वपूर्णनिर्णयश्च वर्जितः।',
    edu3HeadingTemplate: '{WEEKDAY} दिने राहुकालक्रमः',
    edu3BodyTemplate: '{WEEKDAY} दिने राहुकालः सूर्योदयात् {RAHU} खण्डे भवति। यमगण्डः {YAMA} खण्डे, गुलिककालः {GULIKA} खण्डे।',
    ord1: 'प्रथमे', ord2: 'द्वितीये', ord3: 'तृतीये', ord4: 'चतुर्थे', ord5: 'पञ्चमे', ord6: 'षष्ठे', ord7: 'सप्तमे', ord8: 'अष्टमे',
  },
};

/** Resolve a label with authored → overlay → hi → en fallback. */
export function pickRahuLabel(key: string, locale: string): string {
  const authored = AUTHORED[locale]?.[key];
  if (authored !== undefined) return authored;
  const ov = OVERLAY[locale]?.[key];
  if (ov !== undefined) return ov;
  return AUTHORED.hi?.[key] ?? AUTHORED.en?.[key] ?? '';
}

/** Render a label with `{VAR}` placeholders substituted. Unknown
 *  placeholders are left in place — defensive against template typos. */
export function formatRahuLabel(
  key: string,
  locale: string,
  vars: Record<string, string>,
): string {
  const template = pickRahuLabel(key, locale);
  return template.replace(/\{([A-Z_]+)\}/g, (m, name: string) => vars[name] ?? m);
}

/** Per-locale 1..8 ordinal pick (used by edu3 body). */
export function ordinalRahu(n: number, locale: string): string {
  const key = `ord${n}`;
  return pickRahuLabel(key, locale) || String(n);
}
