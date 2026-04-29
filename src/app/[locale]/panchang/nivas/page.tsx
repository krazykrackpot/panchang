'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Compass, ArrowLeft, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import type { PanchangData, Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl as _tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import { useLocationStore } from '@/stores/location-store';
import PMSG from '@/messages/pages/panchang-inline.json';

const msg = (key: string, locale: string): string =>
  lt((PMSG as unknown as Record<string, LocaleText>)[key], locale);

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
}

// ──────────────────────────────────────────────────────────────
// Shiva Vaas descriptions — hoisted to module level
// ──────────────────────────────────────────────────────────────
const SHIVA_DESC: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; activities: LocaleText }> = {
  'Kailash (Mountain)': {
    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
    desc: { en: 'Shiva resides in his divine abode atop Kailash with Parvati. He is serene, benevolent, and easily pleased. Best time for Shiva puja, abhishek, and auspicious activities.', hi: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।', ta: 'சிவன் பார்வதியுடன் கயிலாயத்தின் மீது தனது தெய்வீக இருப்பிடத்தில் வசிக்கிறார். அவர் அமைதியான, கருணையுள்ள, எளிதில் மகிழ்விக்கக்கூடியவர். சிவ பூஜை, அபிஷேகம் மற்றும் சுப நிகழ்வுகளுக்கு சிறந்த நேரம்.', bn: 'শিব পার্বতীর সাথে কৈলাসের চূড়ায় তাঁর দিব্য নিবাসে বিরাজ করেন। তিনি শান্ত, দয়ালু এবং সহজে প্রসন্ন হন। শিব পূজা, অভিষেক ও শুভ কাজের জন্য সেরা সময়।' } as LocaleText,
    activities: { en: 'Shiva puja, abhishek, marriage, business launch', hi: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ', ta: 'சிவ பூஜை, அபிஷேகம், திருமணம், வணிக தொடக்கம்', bn: 'শিব পূজা, অভিষেক, বিবাহ, ব্যবসা শুরু' } as LocaleText,
  },
  'Shamshan (Cremation Ground)': {
    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
    desc: { en: 'Shiva dwells in the cremation ground in his fierce Rudra/Bhairava form. Auspicious activities should be avoided; Tantric rites may be performed by adepts.', hi: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।', ta: 'சிவன் தனது உக்கிரமான ருத்ர/பைரவ வடிவத்தில் சுடுகாட்டில் வசிக்கிறார். சுப நிகழ்வுகளைத் தவிர்க்க வேண்டும்; தாந்திரீக சடங்குகளை நிபுணர்கள் செய்யலாம்.', bn: 'শিব তাঁর ভয়ংকর রুদ্র/ভৈরব রূপে শ্মশানে বাস করেন। শুভ কাজ এড়ানো উচিত; তান্ত্রিক অনুষ্ঠান বিশেষজ্ঞরা করতে পারেন।' } as LocaleText,
    activities: { en: 'Avoid auspicious events; Rudra worship, ancestral rites', hi: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य', ta: 'சுப நிகழ்வுகளைத் தவிர்க்கவும்; ருத்ர வழிபாடு, முன்னோர் சடங்குகள்', bn: 'শুভ অনুষ্ঠান এড়িয়ে চলুন; রুদ্র পূজা, পূর্বপুরুষ শ্রাদ্ধ' } as LocaleText,
  },
  "Gori's Abode (Auspicious)": {
    nColor: 'text-pink-300', border: 'border-pink-500/25', bg: 'from-pink-500/5',
    desc: { en: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", hi: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।', ta: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", bn: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus." } as LocaleText,
    activities: { en: 'Marriage, family rituals, home purchase, Gauri puja', hi: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा', ta: 'திருமணம், குடும்ப சடங்குகள், வீடு வாங்குதல், கௌரி பூஜை', bn: 'বিবাহ, পারিবারিক অনুষ্ঠান, গৃহ ক্রয়, গৌরী পূজা' } as LocaleText,
  },
  'Sports & Play': {
    nColor: 'text-amber-300', border: 'border-amber-500/25', bg: 'from-amber-500/5',
    desc: { en: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", hi: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।', ta: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", bn: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported." } as LocaleText,
    activities: { en: 'Arts, music, dance; avoid critical ventures', hi: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें', ta: 'கலைகள், இசை, நடனம்; முக்கியமான முயற்சிகளைத் தவிர்க்கவும்', bn: 'কলা, সংগীত, নৃত্য; গুরুত্বপূর্ণ উদ্যোগ এড়িয়ে চলুন' } as LocaleText,
  },
  'Deep Meditation (Samadhi)': {
    nColor: 'text-violet-300', border: 'border-violet-500/25', bg: 'from-violet-500/5',
    desc: { en: 'Shiva is in deep Samadhi — beyond the phenomenal world. Sacred for meditation and spiritual practice, but mundane activities may not receive divine support.', hi: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।', ta: 'சிவன் ஆழ்ந்த சமாதியில் உள்ளார் — புலன் உலகத்திற்கு அப்பாற்பட்டது. தியானம் மற்றும் ஆன்மிக பயிற்சிக்கு புனிதமானது, ஆனால் உலகியல் நடவடிக்கைகள் தெய்வீக ஆதரவைப் பெறாமல் போகலாம்.', bn: 'শিব গভীর সমাধিতে — জাগতিক জগতের ঊর্ধ্বে। ধ্যান ও আধ্যাত্মিক সাধনার জন্য পবিত্র, কিন্তু জাগতিক কাজ দৈব সমর্থন নাও পেতে পারে।' } as LocaleText,
    activities: { en: 'Meditation, japa, fasting. Avoid worldly ventures.', hi: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।', ta: 'தியானம், ஜபம், விரதம். உலகியல் முயற்சிகளைத் தவிர்க்கவும்.', bn: 'ধ্যান, জপ, উপবাস। জাগতিক উদ্যোগ এড়িয়ে চলুন।' } as LocaleText,
  },
};

// ──────────────────────────────────────────────────────────────
// Agni Vaas descriptions
// ──────────────────────────────────────────────────────────────
const AGNI_DESC: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; ritualNote: LocaleText }> = {
  'Sky (Akasha)': {
    nColor: 'text-sky-300', border: 'border-sky-500/25', bg: 'from-sky-500/5',
    desc: { en: 'Agni resides in the celestial sky. Fire rituals are carried directly to the devatas.', hi: 'अग्नि आकाश में हैं। अग्नि अनुष्ठान सीधे देवताओं तक पहुँचते हैं।', ta: 'அக்னி வான வெளியில் வசிக்கிறார். அக்னி சடங்குகள் நேரடியாக தேவர்களை அடைகின்றன.', bn: 'অগ্নি আকাশে অবস্থান করেন। অগ্নি অনুষ্ঠান সরাসরি দেবতাদের কাছে পৌঁছায়।' } as LocaleText,
    ritualNote: { en: 'Homa & Yajna highly effective — offerings rise unimpeded', hi: 'होम और यज्ञ अत्यंत प्रभावी — आहुतियाँ बाधारहित ऊर्ध्वगामी', ta: 'ஹோமம் & யக்ஞம் மிகவும் பயனுள்ளது — படையல்கள் தடையின்றி மேலெழும்', bn: 'হোম ও যজ্ঞ অত্যন্ত ফলপ্রসূ — আহুতি বাধাহীনভাবে ঊর্ধ্বগামী' } as LocaleText,
  },
  'Earth (Bhumi)': {
    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
    desc: { en: 'Agni is grounded in the earth plane. Fire rituals nourish the land and people.', hi: 'अग्नि पृथ्वी पर हैं। अग्नि अनुष्ठान भूमि और लोगों को पोषित करते हैं।', ta: 'அக்னி பூமியில் நிலைகொண்டுள்ளார். அக்னி சடங்குகள் நிலத்தையும் மக்களையும் வளர்க்கின்றன.', bn: 'অগ্নি পৃথিবীতে অবস্থান করেন। অগ্নি অনুষ্ঠান ভূমি ও মানুষকে পুষ্ট করে।' } as LocaleText,
    ritualNote: { en: 'Agriculture blessings, prosperity rituals, Griha Pravesh powerful', hi: 'कृषि, समृद्धि, गृह प्रवेश अग्नि कार्य विशेष प्रभावी', ta: 'விவசாய ஆசீர்வாதம், செழிப்பு சடங்குகள், கிருஹ பிரவேசம் சக்திவாய்ந்தது', bn: 'কৃষি আশীর্বাদ, সমৃদ্ধি অনুষ্ঠান, গৃহপ্রবেশ শক্তিশালী' } as LocaleText,
  },
  'Patala': {
    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
    desc: { en: 'Agni descends to the netherworld. Fire rituals may have reversed or weakened effects.', hi: 'अग्नि पाताल में हैं। अग्नि अनुष्ठानों के उलटे या कमजोर प्रभाव।', ta: 'அக்னி பாதாளத்தில் இறங்குகிறார். அக்னி சடங்குகள் எதிர்மாறான அல்லது பலவீனமான பலன்களைத் தரலாம்.', bn: 'অগ্নি পাতালে অবতরণ করেছেন। অগ্নি অনুষ্ঠানের বিপরীত বা দুর্বল ফল হতে পারে।' } as LocaleText,
    ritualNote: { en: 'Major Yajnas should be postponed. Simple Deepa worship permitted.', hi: 'बड़े यज्ञ स्थगित करें। साधारण दीप पूजा कर सकते हैं।', ta: 'பெரிய யக்ஞங்களை ஒத்திவையுங்கள். எளிய தீப வழிபாடு அனுமதிக்கப்படுகிறது.', bn: 'বড় যজ্ঞ স্থগিত করুন। সাধারণ দীপ পূজা অনুমোদিত।' } as LocaleText,
  },
  'Water (Jal)': {
    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
    desc: { en: 'Agni is submerged in water — the Vadavagni (submarine fire of Hindu cosmology).', hi: 'अग्नि जल में हैं — वडवाग्नि (हिंदू ब्रह्माण्ड की समुद्री अग्नि)।', ta: 'அக்னி நீரில் மூழ்கியுள்ளார் — வடவாக்னி (இந்து அண்டவியலின் கடலடி நெருப்பு).', bn: 'অগ্নি জলে নিমজ্জিত — বড়বাগ্নি (হিন্দু সৃষ্টিতত্ত্বের সমুদ্র অগ্নি)।' } as LocaleText,
    ritualNote: { en: 'Rituals combining fire + water (abhishek after homa) uniquely powerful', hi: 'अग्नि + जल संयुक्त अनुष्ठान (होम बाद अभिषेक) विशेष शक्तिशाली', ta: 'நெருப்பு + நீர் இணைந்த சடங்குகள் (ஹோமத்திற்குப் பின் அபிஷேகம்) தனித்துவமாக சக்தி வாய்ந்தது', bn: 'অগ্নি + জল সংযুক্ত অনুষ্ঠান (হোমের পর অভিষেক) বিশেষ শক্তিশালী' } as LocaleText,
  },
};

// ──────────────────────────────────────────────────────────────
// Chandra Vaas descriptions
// ──────────────────────────────────────────────────────────────
const CHANDRA_DESC: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; activities: LocaleText }> = {
  "Brahma's Abode": {
    nColor: 'text-gold-light', border: 'border-gold-primary/25', bg: 'from-gold-primary/5',
    desc: { en: 'Moon faces East in Deva (celestial) abode. Divine energy flows freely — prayers answered with ease. Most auspicious pada for sacred activities.', hi: 'चंद्रमा पूर्व दिशा में देव निवास में हैं। दिव्य ऊर्जा स्वतंत्र प्रवाहित। प्रार्थनाएं सुनी जाती हैं — सर्वोत्तम शुभ पाद।', ta: 'சந்திரன் கிழக்கு நோக்கி தேவ (தெய்வீக) வசிப்பிடத்தில் உள்ளார். தெய்வீக ஆற்றல் சுதந்திரமாகப் பாய்கிறது — பிரார்த்தனைகள் எளிதில் ஏற்கப்படுகின்றன. புனித செயல்களுக்கு மிகவும் சுப பாதம்.', bn: 'চন্দ্র পূর্ব দিকে দেব (স্বর্গীয়) আবাসে রয়েছেন। দিব্যশক্তি স্বাধীনভাবে প্রবাহিত — প্রার্থনা সহজে শোনা হয়। পবিত্র কর্মের জন্য সর্বোত্তম শুভ পদ।' } as LocaleText,
    activities: { en: 'All auspicious work, puja, sacred ceremonies', hi: 'सभी शुभ कार्य, पूजा, पवित्र समारोह', ta: 'அனைத்து சுப பணிகள், பூஜை, புனித விழாக்கள்', bn: 'সমস্ত শুভ কর্ম, পূজা, পবিত্র অনুষ্ঠান' } as LocaleText,
  },
  "Indra's Abode": {
    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
    desc: { en: 'Moon faces South in Nara (human) abode — ordinary activity plane. Results are as expected, neither elevated nor hindered.', hi: 'चंद्रमा दक्षिण दिशा में मानव निवास में हैं। परिणाम सामान्य — न उन्नत, न बाधित।', ta: 'சந்திரன் தெற்கு நோக்கி நர (மனித) வசிப்பிடத்தில் — சாதாரண செயல்பாட்டுத் தளம். பலன்கள் எதிர்பார்த்தபடி — உயர்வும் இல்லை, தடையும் இல்லை.', bn: 'চন্দ্র দক্ষিণ দিকে নর (মানব) আবাসে — সাধারণ কর্মক্ষেত্র। ফলাফল প্রত্যাশিত — উন্নতও নয়, বাধাগ্রস্তও নয়।' } as LocaleText,
    activities: { en: 'Daily work, business, social activities', hi: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधियाँ', ta: 'தினசரி பணி, வணிகம், சமூக நடவடிக்கைகள்', bn: 'দৈনিক কাজ, ব্যবসা, সামাজিক কার্যকলাপ' } as LocaleText,
  },
  "Yama's Abode": {
    nColor: 'text-amber-400', border: 'border-amber-500/25', bg: 'from-amber-500/5',
    desc: { en: 'Moon faces West in Pashava (animal) abode — instinctual, reactive energy. Actions driven by impulse. Avoid important decisions.', hi: 'चंद्रमा पश्चिम दिशा में पशव निवास में हैं — सहज, प्रतिक्रियाशील ऊर्जा। महत्वपूर्ण निर्णयों से बचें।', ta: 'சந்திரன் மேற்கு நோக்கி பசவ (விலங்கு) வசிப்பிடத்தில் — உள்ளுணர்வு, எதிர்வினை ஆற்றல். தூண்டுதலால் இயக்கப்படும் செயல்கள். முக்கிய முடிவுகளைத் தவிர்க்கவும்.', bn: 'চন্দ্র পশ্চিম দিকে পশব (পশু) আবাসে — সহজাত, প্রতিক্রিয়াশীল শক্তি। আবেগ দ্বারা চালিত কর্ম। গুরুত্বপূর্ণ সিদ্ধান্ত এড়িয়ে চলুন।' } as LocaleText,
    activities: { en: 'Physical labor, farming; avoid important decisions', hi: 'शारीरिक श्रम, खेती; महत्वपूर्ण निर्णयों से बचें', ta: 'உடல் உழைப்பு, விவசாயம்; முக்கிய முடிவுகளைத் தவிர்க்கவும்', bn: 'শারীরিক শ্রম, কৃষি; গুরুত্বপূর্ণ সিদ্ধান্ত এড়িয়ে চলুন' } as LocaleText,
  },
  "Soma's Abode": {
    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
    desc: { en: 'Moon faces North in Rakshasa (demonic) abode — turbulent, obstructive energy. Activities face opposition or hidden obstacles.', hi: 'चंद्रमा उत्तर दिशा में राक्षस निवास में हैं — अशांत, अवरोधक ऊर्जा। विरोध या छिपी बाधाएं।', ta: 'சந்திரன் வடக்கு நோக்கி ராக்ஷச (அரக்க) வசிப்பிடத்தில் — கொந்தளிப்பான, தடையான ஆற்றல். செயல்களுக்கு எதிர்ப்பு அல்லது மறைந்த தடைகள்.', bn: 'চন্দ্র উত্তর দিকে রাক্ষস আবাসে — অশান্ত, প্রতিরোধী শক্তি। কর্মকাণ্ডে বিরোধিতা বা লুকানো বাধা।' } as LocaleText,
    activities: { en: 'Avoid sacred activities; protective rites permitted', hi: 'पवित्र गतिविधियों से बचें; सुरक्षात्मक अनुष्ठान संभव', ta: 'புனித செயல்களைத் தவிர்க்கவும்; பாதுகாப்பு சடங்குகள் அனுமதிக்கப்படும்', bn: 'পবিত্র কর্ম এড়িয়ে চলুন; সুরক্ষামূলক অনুষ্ঠান অনুমোদিত' } as LocaleText,
  },
};

export default function NivasShoolPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const tl = (obj: unknown): string => _tl(obj as LocaleText, locale);

  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 0, lng: 0, name: '', tz: 0 });
  const [selectedDate, setSelectedDate] = useState('');

  // Initialize date on client only
  useEffect(() => {
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
  }, []);

  // Detect location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
            setLocation({ lat: latitude, lng: longitude, name, tz: -new Date().getTimezoneOffset() / 60 });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`, tz: -new Date().getTimezoneOffset() / 60 });
          }
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              let name = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
              try {
                const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=10`);
                const geoData = await geo.json();
                const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
                const country = geoData.address?.country || '';
                name = [city, country].filter(Boolean).join(', ') || name;
              } catch { /* use coordinate fallback */ }
              let tz = -(new Date().getTimezoneOffset() / 60);
              if (data.utc_offset) {
                const sign = data.utc_offset[0] === '-' ? -1 : 1;
                const hh = parseInt(data.utc_offset.slice(1, 3), 10);
                const mm = parseInt(data.utc_offset.slice(3, 5), 10);
                tz = sign * (hh + mm / 60);
              }
              setLocation({ lat: data.latitude, lng: data.longitude, name, tz });
            }
          } catch (err) {
            console.error('[nivas] IP geolocation fallback failed:', err);
            setLoading(false);
          }
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchPanchang = useCallback(() => {
    if (!selectedDate) return;
    if (location.lat === 0 && location.lng === 0) return;
    setLoading(true);
    const [year, month, day] = selectedDate.split('-').map(Number);
    // Location store timezone takes priority over browser timezone
    const ianaTimezone = useLocationStore.getState().timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(location.name)}`)
      .then(res => res.json())
      .then(data => { setPanchang(data); setLoading(false); })
      .catch((err) => { console.error('[nivas] fetch failed:', err); setLoading(false); });
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{isDevanagari ? 'पंचांग पर वापस' : 'Back to Panchang'}</span>
        </Link>

        {/* Date & location header */}
        <div className="text-center mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-secondary border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 mb-2"
          />
          {location.name && (
            <p className="text-text-secondary text-xs">{location.name}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
          </div>
        ) : panchang ? (
          <>
            {/* Section heading */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3"><Compass className="w-14 h-14 text-indigo-400" /></div>
              <h1 className={`text-3xl font-bold mb-2 text-indigo-400`} style={headingFont}>{msg('nivasShool', locale)}</h1>
              <p className="text-text-secondary text-sm max-w-xl mx-auto">{msg('nivasShoolDesc', locale)}</p>
            </div>

            <div className="text-center mb-6">
              <Link href="/nivas-shool" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                {msg('learnNivasShool', locale)} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Disha Shool */}
              {panchang.dishaShool && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-orange-500/25 bg-gradient-to-br from-orange-500/5 to-transparent lg:col-span-1">
                  <div className="text-orange-400 text-xs uppercase tracking-widest font-bold mb-3">{isDevanagari ? 'दिशा शूल' : 'Disha Shool'}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-xl font-bold">
                        {(tl(panchang.dishaShool.direction) || panchang.dishaShool.direction?.en || 'N').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-text-primary font-bold text-lg" style={headingFont}>{tl(panchang.dishaShool.direction) || panchang.dishaShool.direction.en}</div>
                      <div className="text-text-secondary text-xs">{isDevanagari ? 'इस दिशा में यात्रा से बचें' : 'Avoid travel in this direction'}</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-500/10">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{isDevanagari ? 'उपाय' : 'Remedy'}</div>
                    <div className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(panchang.dishaShool.remedy)}</div>
                  </div>
                </motion.div>
              )}

              {/* Shiva Vaas */}
              {panchang.shivaVaas && (() => {
                const shivaName = panchang.shivaVaas.name?.en || (panchang.shivaVaas as unknown as { en: string }).en || '';
                const nature = panchang.shivaVaas.nature || 'neutral';
                const tithiList = panchang.shivaVaas.tithis || [];
                const d = SHIVA_DESC[shivaName] || SHIVA_DESC['Kailash (Mountain)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold">
                        {msg('shivaVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-2" style={headingFont}>{panchang.shivaVaas.name?.[locale] || shivaName}</div>
                    {tithiList.length > 0 && (
                      <div className="text-text-tertiary text-xs mb-2">{msg('tithisLabel', locale)}: {tithiList.join(', ')}</div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('activities', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.activities, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Agni Vaas */}
              {panchang.agniVaas && (() => {
                const agniName = panchang.agniVaas.name?.en || (panchang.agniVaas as unknown as { en: string }).en || '';
                const nature = panchang.agniVaas.nature || 'neutral';
                const validUntil = panchang.agniVaas.validUntil;
                const d = AGNI_DESC[agniName] || AGNI_DESC['Sky (Akasha)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                        {msg('agniVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-1" style={headingFont}>{panchang.agniVaas.name?.[locale] || agniName}</div>
                    {validUntil && (
                      <div className={`text-xs font-medium ${d.nColor} mb-2`}>
                        {_tl({ en: `Until ${validUntil}`, hi: `${validUntil} तक`, ta: `Until ${validUntil}`, bn: `Until ${validUntil}` } as LocaleText, locale)}
                      </div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('fireRitualImpact', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.ritualNote, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Chandra Vaas */}
              {panchang.chandraVaas && (() => {
                const chandraName = panchang.chandraVaas.name?.en || (panchang.chandraVaas as unknown as { en: string }).en || '';
                const direction = panchang.chandraVaas.direction;
                const nature = panchang.chandraVaas.nature || 'neutral';
                const d = CHANDRA_DESC[chandraName] || CHANDRA_DESC["Brahma's Abode"];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-blue-400 text-xs uppercase tracking-widest font-bold">
                        {msg('chandraVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{panchang.chandraVaas.name?.[locale] || chandraName}</div>
                      {direction && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 border border-blue-500/20">
                          <Compass className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300 text-xs font-bold">{(direction[locale] || direction.en || '')}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('activities', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.activities, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Rahu Vaas */}
              {panchang.rahuVaas && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-purple-500/25 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                      {msg('rahuVaas', locale)}
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-red-400 bg-black/20 border border-red-500/25">{msg('avoid', locale)}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Compass className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{tl(panchang.rahuVaas.direction)}</div>
                      <div className="text-text-tertiary text-xs">{msg('rahuFacing', locale)}</div>
                    </div>
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed mb-3">
                    {msg('rahuVaasDesc', locale)}
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/20 border border-purple-500/20">
                    <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('rahuGuidance', locale)}</div>
                    <div className="text-xs font-medium text-purple-300">
                      {msg('rahuGuidanceDesc', locale)}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <GoldDivider />

            {/* Back to panchang CTA */}
            <div className="text-center mt-8">
              <Link
                href="/panchang"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20 hover:bg-gold-primary/20 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {isDevanagari ? 'पंचांग पर वापस जाएं' : 'Back to Full Panchang'}
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-text-secondary py-20">
            {isDevanagari ? 'डेटा लोड नहीं हो सका' : 'Could not load data'}
          </div>
        )}
      </div>
    </div>
  );
}
