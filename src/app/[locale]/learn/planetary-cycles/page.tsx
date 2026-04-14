'use client';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/planetary-cycles.json';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Orbit, Clock, Target, Star, Eye, Telescope, Calculator } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ── Labels ──────────────────────────────────────────────────────
const L = {
  en: {
    badge: 'Reference',
    title: 'Planetary Orbital Periods in Jyotish',
    sub: 'How ancient Indians measured the cosmos without telescopes -- and embedded that knowledge into every astrological prediction you use today.',
    hook: 'When your grandmother says "Sade Sati lasts 7.5 years," she is implicitly stating that Saturn takes 30 years to orbit the Sun. When an astrologer says "Jupiter changes sign every year," he is saying Jupiter\'s orbital period is ~12 years. Every Jyotish timing prediction is built on orbital mechanics -- and the ancient Indians got the numbers RIGHT.',
    sec1: 'They Knew the Orbits',
    sec1sub: 'Surya Siddhanta vs NASA JPL -- the grand comparison',
    sec1note: 'The Surya Siddhanta\'s solar year is accurate to 3.5 MINUTES over an entire year. Saturn\'s period error is 6.5 days over 29.5 YEARS -- that is 99.94% accurate, WITHOUT TELESCOPES.',
    sec2: 'Sade Sati -- Orbital Mechanics in Action',
    sec2sub: 'Saturn\'s 30-year orbit, divided into 12 signs',
    sec2text1: 'Saturn takes ~29.5 years to orbit the Sun, spending ~2.5 years in each sign. Sade Sati is Saturn transiting the 12th, 1st, and 2nd houses from your Moon sign -- three signs, three windows of 2.5 years each.',
    sec2text2: 'This is not mysticism. It is an observable transit window built on a precisely measured orbital period. The ancient Indians measured Saturn\'s period as 29.471 years (modern: 29.457). The error is 5 DAYS over nearly 30 years.',
    sec2calc: 'Saturn period = 29.5 years\nSigns in zodiac = 12\nTime per sign = 29.5 / 12 = 2.458 years = 2.5 years\nSade Sati = 3 signs x 2.5 = 7.5 years',
    sec3: 'Jupiter Transit -- The 12-Year Wealth Cycle',
    sec3sub: 'Jupiter\'s orbit as a cosmic clock',
    sec3text1: 'Jupiter takes ~11.86 years to orbit -- roughly 1 year per sign. Jyotish teaches that Jupiter in the 2nd, 5th, 7th, 9th, and 11th from your Moon brings prosperity. That means ~5 out of 12 years are "Jupiter-favorable" -- about 42% of the time.',
    sec3text2: 'The 60-year Samvatsara cycle = 5 Jupiter orbits = 2 Saturn orbits (the LCM of 12 and 30). Jupiter and Saturn conjoin every ~19.86 years. Three conjunctions = ~60 years = one complete Samvatsara. This is orbital resonance, not coincidence.',
    sec4: 'Vimshottari Dasha -- 120 Years from Orbital Harmonics',
    sec4sub: 'How dasha periods encode planetary cycles',
    sec4text: 'The total 120-year Dasha cycle = 2 x 60 (Samvatsara) = 4 Saturn semi-orbits = 10 Jupiter orbits. The system is designed to cover the complete interplay of the two slowest visible planets.',
    sec4formula: 'Antardasha of planet X in Mahadasha of Y = (X_period / 120) x Y_period',
    sec4formulaLabel: 'This formula creates 81 unique timing windows (9 x 9) from just 9 orbital parameters.',
    sec5: 'Nakshatras -- The Moon\'s Daily Stations',
    sec5sub: '27 divisions calibrated to the Moon',
    sec5text: 'The Moon\'s sidereal period is 27.32 days. The 27 Nakshatras are 27 "stations" the Moon visits -- each spanning 13 degrees 20 arcminutes, approximately one day of lunar motion. The Moon moves ~13.2 degrees per day -- almost exactly one nakshatra. The ancient Indians did not just know the Moon\'s period; they built a 27-division coordinate system CALIBRATED to it. This is equivalent to constructing a ruler where each mark represents one day of lunar travel.',
    sec6: 'Eclipse Prediction -- Rahu, Ketu & the Saros Cycle',
    sec6sub: 'The lunar nodes and eclipse mechanics',
    sec6intro: 'Rahu and Ketu are not physical bodies -- they are the two points where the Moon\'s tilted orbit crosses the ecliptic (the Sun\'s apparent path). The Moon\'s orbit is inclined ~5.1° to the ecliptic, creating two intersection points that slowly regress westward, completing a full cycle in 18.613 years.',
    sec6how: 'How Eclipses Happen',
    sec6howText: 'An eclipse requires THREE alignments: (1) New Moon or Full Moon (Sun-Moon conjunction/opposition), (2) Moon must be NEAR a node (Rahu or Ketu), and (3) The angular distance from the node must be within the eclipse limit (~18° for solar, ~12° for lunar). When all three conditions align, the Moon\'s shadow falls on Earth (solar eclipse) or Earth\'s shadow falls on the Moon (lunar eclipse).',
    sec6saros: 'The Saros Cycle -- What Exactly Repeats?',
    sec6sarosText: 'Eclipses happen 4-7 times every year (solar and lunar combined) -- they are not rare. What IS rare is a SPECIFIC TYPE of eclipse at a SPECIFIC LOCATION. The Saros cycle answers: "When will THIS particular eclipse happen again in nearly the same way?"\n\nAfter exactly 18 years, 11 days, and 8 hours, three cosmic clocks realign simultaneously: (1) the Moon returns to the same phase (new/full), (2) the Moon is at the same distance from Earth (same apparent size), and (3) the Moon is near the same node (Rahu or Ketu). This means the SAME eclipse geometry repeats -- same type (total/partial/annular), similar duration, similar path on Earth (shifted ~120° west due to the extra 8 hours).\n\nThe Surya Siddhanta encoded this as the Rahu-Ketu nodal period (18.6 years). The slight difference (18.03 vs 18.61 years) means each Saros repetition drifts slightly, and after ~1,200-1,500 years, a Saros series ends.',
    sec6types: [
      { type: 'Solar (Surya Grahan)', desc: 'New Moon at node. Moon blocks the Sun. Shadow on Earth = 100-170 km wide.' },
      { type: 'Lunar (Chandra Grahan)', desc: 'Full Moon at node. Earth blocks sunlight. The Moon turns copper-red (Rayleigh scattering).' },
      { type: 'Annular (Valayakara)', desc: 'Moon at apogee (far point). Appears smaller than Sun, creating a ring of fire.' },
    ],
    sec6accuracy: 'The Surya Siddhanta\'s eclipse predictions matched observed eclipses to within 15-20 minutes of time and ~0.5° of position -- remarkable for naked-eye astronomy.',
    sec6nodalDiagram: 'Lunar Nodes (Rahu & Ketu)',
    sec6eclipseDiagram: 'Eclipse Geometry',
    sec7: 'How Did They Measure This?',
    sec7sub: 'Centuries of patient observation -- five key techniques',
    sec7methods: [
      { name: 'Gnomon (Shanku)', desc: 'A vertical pole casting shadows on a level surface. Measure shadow length at noon daily to track the Sun\'s declination through the year. The time between two successive shortest shadows (summer solstices) = one tropical year. Over 100+ years of daily measurements, the error reduces to ~1 minute/year. The Surya Siddhanta\'s 365.258756 days implies ~1000 years of accumulated gnomon data.', detail: 'Standard: 12-angula pole (Surya Siddhanta). A flat north-south line inscribed in stone. Noon shadow length = f(declination). Equinoxes: shadow aligns exactly east-west. Solstices: shortest/longest noon shadows. The Samrat Yantra at Jantar Mantar is a giant precision gnomon.' },
      { name: 'Star Transits (Meridian Observations)', desc: 'Note the exact time a planet crosses the local meridian (highest point) and compare with a reference star like Spica (Chitra). The angular difference = planet\'s ecliptic longitude. Repeated over months, this traces the planet\'s motion against fixed stars. Stars rise ~3 min 56 sec earlier each night (sidereal vs solar day) -- this offset was precisely known.', detail: 'Tools: A plumb line (Lamba-yantra) for the meridian, a water clock (Jala-yantra) for timing. Multiple observers at the same site reduced personal error. Cross-checking with known star positions gave ~0.5° accuracy per observation.' },
      { name: 'Occultations (Lunar Covering of Stars)', desc: 'When the Moon passes in front of a star, the star vanishes and reappears at precise moments. The Moon moves ~0.5° per hour, so timing an occultation to 1 minute gives position to ~0.008° -- the most precise naked-eye method available.', detail: 'Critical observations: Moon occulting Aldebaran (Rohini), Regulus (Magha), Spica (Chitra), Antares (Jyeshtha). These four bright ecliptic stars provided regular calibration points every month.' },
      { name: 'Synodic Periods (Opposition Counting)', desc: 'Record the date when a planet is exactly opposite the Sun (rises at sunset = opposition). Wait for the next opposition. The interval = one synodic period. Average over 10+ cycles to reduce error. Over 50+ cycles (centuries), the error drops to hours.', detail: 'Key formula: 1/P_sidereal = 1/P_earth - 1/P_synodic (outer planets). For inner planets: 1/P_sidereal = 1/P_earth + 1/P_synodic. This is the mathematical bridge from observable synodic periods to true orbital periods.' },
      { name: 'Long Baselines (Guru-Shishya Parampara)', desc: 'Temple astronomers (Jyotirvid) maintained continuous daily observations passed from teacher to student across generations. Multiple sites across India provided independent verification. The five Siddhantas (Surya, Brahma, Paulisha, Romaka, Vasishtha) represent ~2000 years of accumulated observational data.', detail: 'Modern parallel: This is exactly how astronomical catalogs work -- decades of observations from multiple observatories, averaged and refined. The Indian system added a uniquely robust transmission mechanism through formalized oral-textual tradition.' },
    ],
    sec7closing: 'The Jantar Mantar observatories (1730s) achieved 2-arcsecond accuracy -- but the orbital periods were already known 1000+ years earlier from patient naked-eye observation.',
    // Mathematical derivation section
    secMath: 'Mathematical Derivation: How They Calculated Orbital Periods',
    secMathSub: 'From naked-eye observation to precise orbital mechanics',
    secMathIntro: 'The ancient Indians could not directly observe a planet completing its orbit. Instead, they used an elegant indirect method: observe what you CAN see (synodic periods), then derive what you CANNOT see (sidereal periods) using mathematics.',
    secMathSteps: [
      { title: 'Step 1: Observe Opposition', desc: 'For an outer planet like Saturn, note the date when it rises exactly at sunset (opposition -- directly opposite the Sun). This is observable with the naked eye.' },
      { title: 'Step 2: Wait for Next Opposition', desc: 'Count the days until the next opposition. For Saturn, this is ~378.09 days. This is the SYNODIC period (P_syn) -- the time for Earth to "lap" Saturn.' },
      { title: 'Step 3: The Key Insight', desc: 'During one synodic period, Earth completes slightly more than one orbit while the planet moves only a small arc. The angular rates subtract: ω_planet = ω_earth - ω_synodic.' },
      { title: 'Step 4: Derive Sidereal Period', desc: 'Since angular rate = 360°/period, we get: 1/P_sidereal = 1/P_earth - 1/P_synodic. This single equation converts the observable synodic period into the true orbital period.' },
      { title: 'Step 5: Average Over Many Cycles', desc: 'One measurement has ~1-day error. But 50 oppositions (spanning ~52 years for Saturn) give 50 independent measurements. Averaging reduces error to ~0.02 days. The Surya Siddhanta likely used 200+ years of data.' },
    ],
    secMathSaturn: 'Worked Example: Saturn (Shani)',
    secMathSaturnSteps: [
      'Observed synodic period: P_syn = 378.09 days',
      'Earth\'s period: P_earth = 365.26 days',
      '1/P_sid = 1/365.26 - 1/378.09',
      '1/P_sid = 0.002738 - 0.002645 = 0.0000927',
      'P_sid = 1/0.0000927 = 10,787 days',
      '= 29.53 years',
      'Surya Siddhanta: 10,765.77 d = 29.47 yr  ✓',
      'NASA JPL modern: 10,759.22 d = 29.46 yr  ✓',
    ],
    secMathMoon: 'Moon\'s Period (Direct Observation)',
    secMathMoonSteps: [
      '1. Note which star the Moon is near tonight',
      '2. Count nights until it returns to that same star',
      '3. Single measurement: ~27.3 days',
      '4. Average over 100 returns: 27.32166 days',
      '5. Surya Siddhanta value: 27.321674 days',
      '6. Error: 1.1 seconds per orbit!',
    ],
    secMathJupiter: 'Worked Example: Jupiter (Guru)',
    secMathJupiterSteps: [
      'Observed synodic period: P_syn = 398.88 days',
      'Earth\'s period: P_earth = 365.26 days',
      '1/P_sid = 1/365.26 - 1/398.88',
      '1/P_sid = 0.002738 - 0.002507 = 0.000231',
      'P_sid = 1/0.000231 = 4,329 days',
      '= 11.85 years',
      'Surya Siddhanta: 4,332.32 d = 11.86 yr  ✓',
    ],
    secMathFormula: 'The Master Formula',
    secMathFormulaOuter: 'Outer planets (Mars, Jupiter, Saturn):',
    secMathFormulaInner: 'Inner planets (Mercury, Venus):',
    secMathFormulaExplain: 'Where:',
    secMathFormulaTerms: [
      { term: 'P_sidereal', meaning: 'The TRUE orbital period — time for the planet to go once around the Sun and return to the same star. This is what we want to find, but cannot directly observe.' },
      { term: 'P_earth', meaning: 'Earth\'s orbital period = 365.26 days. Known precisely from gnomon measurements (see measurement section above).' },
      { term: 'P_synodic', meaning: 'The OBSERVABLE period — time between two successive identical alignments of Sun-Earth-Planet (e.g., opposition to opposition). This is what ancient astronomers could directly count in days.' },
    ],
    secMathFormulaWhy: 'Why does this work? Earth orbits faster than outer planets. The synodic period measures how long Earth takes to "lap" the planet — like two runners on a circular track. If you know the track speed of both runners, you can compute the slower runner\'s speed from how often the faster one passes them. For inner planets (Mercury, Venus), THEY are the faster runners, so the formula adds instead of subtracts.',
    secMathVisual: 'Synodic Period: Earth Overtaking Saturn',
    closing: 'Every time you read a Panchang entry, check your Sade Sati status, or look at your Dasha timeline -- you are using orbital mechanics measured by Indian astronomers who watched the sky for centuries with nothing but their eyes, a gnomon, and extraordinary patience. The numbers are real. The science is sound. The tradition preserves it.',
    relatedLinks: 'Continue Exploring',
    backToLearn: 'Back to Learn',
    tblPlanet: 'Planet',
    tblSanskrit: 'Sanskrit',
    tblVedic: 'Vedic Period (Surya Siddhanta)',
    tblModern: 'Modern (NASA JPL)',
    tblError: 'Error',
    tblJyotish: 'How Jyotish Uses It',
    tblDashaPlanet: 'Dasha Planet',
    tblYears: 'Years',
    tblConnection: 'Orbital Connection',
  },
  hi: {
    badge: 'सन्दर्भ',
    title: 'ज्योतिष में ग्रह कक्षीय काल',
    sub: 'प्राचीन भारतीयों ने बिना दूरबीन के ब्रह्माण्ड को कैसे मापा -- और उस ज्ञान को हर ज्योतिषीय भविष्यवाणी में कैसे समाहित किया।',
    hook: 'जब आपकी दादी कहती हैं "साढ़े साती 7.5 वर्ष चलती है," तो वे परोक्ष रूप से कह रही हैं कि शनि को सूर्य की परिक्रमा में 30 वर्ष लगते हैं। जब कोई ज्योतिषी कहता है "बृहस्पति हर वर्ष राशि बदलता है," तो वह कह रहा है कि बृहस्पति का कक्षीय काल ~12 वर्ष है। हर ज्योतिषीय समय-गणना कक्षीय यांत्रिकी पर आधारित है -- और प्राचीन भारतीयों ने ये संख्याएँ सही पाईं।',
    sec1: 'वे कक्षाएँ जानते थे',
    sec1sub: 'सूर्य सिद्धान्त बनाम नासा JPL -- महान तुलना',
    sec1note: 'सूर्य सिद्धान्त का सौर वर्ष पूरे वर्ष में केवल 3.5 मिनट की त्रुटि रखता है। शनि के काल में 29.5 वर्षों में केवल 6.5 दिन की त्रुटि -- यह 99.94% सटीक है, बिना दूरबीन के।',
    sec2: 'साढ़े साती -- कक्षीय यांत्रिकी क्रियाशील',
    sec2sub: 'शनि की 30-वर्षीय कक्षा, 12 राशियों में विभक्त',
    sec2text1: 'शनि को सूर्य की परिक्रमा में ~29.5 वर्ष लगते हैं, प्रत्येक राशि में ~2.5 वर्ष बिताता है। साढ़े साती = शनि का चन्द्र राशि से 12वें, 1ले और 2रे भाव में गोचर -- तीन राशियाँ, प्रत्येक 2.5 वर्ष।',
    sec2text2: 'यह रहस्यवाद नहीं है। यह एक सटीक रूप से मापे गए कक्षीय काल पर निर्मित प्रेक्षणीय गोचर खिड़की है। प्राचीन भारतीयों ने शनि का काल 29.471 वर्ष मापा (आधुनिक: 29.457)। त्रुटि लगभग 30 वर्षों में केवल 5 दिन है।',
    sec2calc: 'शनि काल = 29.5 वर्ष\nराशि चक्र = 12\nप्रति राशि = 29.5 / 12 = 2.458 वर्ष = 2.5 वर्ष\nसाढ़े साती = 3 राशि x 2.5 = 7.5 वर्ष',
    sec3: 'बृहस्पति गोचर -- 12-वर्षीय समृद्धि चक्र',
    sec3sub: 'बृहस्पति की कक्षा एक ब्रह्माण्डीय घड़ी के रूप में',
    sec3text1: 'बृहस्पति को ~11.86 वर्ष लगते हैं -- लगभग 1 वर्ष प्रति राशि। ज्योतिष कहता है कि चन्द्र से 2, 5, 7, 9, 11वें भाव में बृहस्पति समृद्धि लाता है। अर्थात 12 में से ~5 वर्ष "बृहस्पति-अनुकूल" हैं -- लगभग 42%।',
    sec3text2: '60-वर्षीय संवत्सर = 5 बृहस्पति कक्षाएँ = 2 शनि कक्षाएँ। बृहस्पति-शनि युति हर ~19.86 वर्ष। तीन युतियाँ = ~60 वर्ष = एक संवत्सर। यह कक्षीय अनुनाद है, संयोग नहीं।',
    sec4: 'विंशोत्तरी दशा -- कक्षीय सामंजस्य से 120 वर्ष',
    sec4sub: 'दशा काल कैसे ग्रह चक्रों को कूटबद्ध करते हैं',
    sec4text: 'कुल 120-वर्षीय दशा चक्र = 2 x 60 (संवत्सर) = 4 शनि अर्ध-कक्षाएँ = 10 बृहस्पति कक्षाएँ। यह प्रणाली दो सबसे धीमे दृश्य ग्रहों की पूर्ण अन्तर्क्रिया को समेटने के लिए बनाई गई है।',
    sec4formula: 'X की अन्तर्दशा Y की महादशा में = (X_काल / 120) x Y_काल',
    sec4formulaLabel: 'यह सूत्र केवल 9 कक्षीय मापदंडों से 81 अद्वितीय समय-खिड़कियाँ (9 x 9) बनाता है।',
    sec5: 'नक्षत्र -- चन्द्रमा के दैनिक स्थान',
    sec5sub: 'चन्द्रमा के लिए अंशांकित 27 विभाजन',
    sec5text: 'चन्द्रमा का नाक्षत्र काल 27.32 दिन है। 27 नक्षत्र 27 "पड़ाव" हैं जिन पर चन्द्रमा रुकता है -- प्रत्येक 13 अंश 20 कला का, लगभग एक दिन की चन्द्र गति। चन्द्रमा ~13.2 अंश/दिन चलता है -- लगभग ठीक एक नक्षत्र। प्राचीन भारतीयों ने केवल चन्द्रमा का काल नहीं जाना; उन्होंने उससे अंशांकित 27-विभाजन निर्देशांक प्रणाली बनाई।',
    sec6: 'ग्रहण भविष्यवाणी -- राहु, केतु एवं सारोस चक्र',
    sec6sub: 'चन्द्र पात एवं ग्रहण यांत्रिकी',
    sec6intro: 'राहु और केतु भौतिक पिंड नहीं हैं -- ये वे दो बिन्दु हैं जहाँ चन्द्रमा की झुकी कक्षा क्रान्तिवृत्त (सूर्य का दृश्य पथ) को काटती है। चन्द्र कक्षा क्रान्तिवृत्त से ~5.1° झुकी है, जिससे दो प्रतिच्छेदन बिन्दु बनते हैं जो धीरे-धीरे पश्चिम की ओर सरकते हैं, 18.613 वर्ष में पूर्ण चक्र पूरा करते हैं।',
    sec6how: 'ग्रहण कैसे होते हैं',
    sec6howText: 'ग्रहण के लिए तीन संरेखण आवश्यक हैं: (1) अमावस्या या पूर्णिमा (सूर्य-चन्द्र युति/प्रतियुति), (2) चन्द्रमा किसी पात (राहु या केतु) के निकट हो, (3) पात से कोणीय दूरी ग्रहण सीमा के भीतर हो (~18° सूर्य ग्रहण, ~12° चन्द्र ग्रहण)।',
    sec6saros: 'सारोस चक्र -- वास्तव में क्या दोहराता है?',
    sec6sarosText: 'ग्रहण हर वर्ष 4-7 बार होते हैं (सूर्य और चन्द्र मिलाकर) -- ये दुर्लभ नहीं हैं। दुर्लभ यह है कि एक विशिष्ट प्रकार का ग्रहण किसी विशिष्ट स्थान पर हो। सारोस चक्र बताता है: "यही ग्रहण लगभग उसी रूप में कब दोहराएगा?"\n\nठीक 18 वर्ष, 11 दिन, 8 घंटे बाद तीन ब्रह्माण्डीय घड़ियाँ एक साथ पुनःसंरेखित होती हैं: (1) चन्द्रमा उसी कला में लौटता है (अमावस्या/पूर्णिमा), (2) चन्द्रमा पृथ्वी से उतनी ही दूरी पर होता है (समान दृश्य आकार), (3) चन्द्रमा उसी पात (राहु/केतु) के निकट होता है। अर्थात वही ग्रहण ज्यामिति दोहराती है -- वही प्रकार, समान अवधि, समान पथ (8 घंटे के कारण ~120° पश्चिम खिसका)।\n\nसूर्य सिद्धान्त ने इसे राहु-केतु पातीय काल (18.6 वर्ष) के रूप में कूटबद्ध किया। 18.03 और 18.61 वर्ष का अन्तर = प्रत्येक सारोस दोहराव थोड़ा खिसकता है, और ~1200-1500 वर्षों बाद एक सारोस श्रृंखला समाप्त हो जाती है।',
    sec6types: [
      { type: 'सूर्य ग्रहण', desc: 'अमावस्या को पात पर। चन्द्रमा सूर्य को ढकता है। पृथ्वी पर छाया = 100-170 किमी चौड़ी।' },
      { type: 'चन्द्र ग्रहण', desc: 'पूर्णिमा को पात पर। पृथ्वी सूर्य का प्रकाश रोकती है। चन्द्रमा ताम्रवर्ण हो जाता है।' },
      { type: 'वलयाकार ग्रहण', desc: 'चन्द्रमा अपभू (दूरस्थ बिन्दु) पर। सूर्य से छोटा दिखता है, अग्नि वलय बनाता है।' },
    ],
    sec6accuracy: 'सूर्य सिद्धान्त की ग्रहण भविष्यवाणियाँ प्रेक्षित ग्रहणों से 15-20 मिनट के भीतर और ~0.5° स्थिति में मिलती थीं -- नग्न-नेत्र खगोलविज्ञान के लिए उल्लेखनीय।',
    sec6nodalDiagram: 'चन्द्र पात (राहु एवं केतु)',
    sec6eclipseDiagram: 'ग्रहण ज्यामिति',
    sec7: 'उन्होंने यह कैसे मापा?',
    sec7sub: 'शताब्दियों का धैर्यपूर्ण प्रेक्षण -- पाँच प्रमुख विधियाँ',
    sec7methods: [
      { name: 'शंकु (Gnomon)', desc: 'समतल सतह पर ऊर्ध्वाधर दण्ड की छाया। दैनिक मध्याह्न छाया लम्बाई मापकर सूर्य की क्रान्ति का वार्षिक अनुसरण। दो क्रमिक लघुतम छायाओं (ग्रीष्म अयनान्त) का अन्तराल = एक उष्णकटिबन्धीय वर्ष। 100+ वर्षों के दैनिक माप से त्रुटि ~1 मिनट/वर्ष हो जाती है।', detail: 'मानक: 12-अंगुल दण्ड (सूर्य सिद्धान्त)। पाषाण में उत्तर-दक्षिण रेखा। जन्तर मन्तर का सम्राट यन्त्र एक विशाल परिशुद्ध शंकु है।' },
      { name: 'तारा गोचर (याम्योत्तर प्रेक्षण)', desc: 'ग्रह के याम्योत्तर पार (उच्चतम बिन्दु) का सटीक समय नोट करें और चित्रा (Spica) जैसे सन्दर्भ तारे से तुलना करें। कोणीय अन्तर = ग्रह का क्रान्तिवृत्तीय देशान्तर। महीनों तक दोहराने पर स्थिर तारों के विरुद्ध ग्रह गति का मानचित्रण होता है।', detail: 'उपकरण: लम्ब-यन्त्र (याम्योत्तर के लिए), जल-यन्त्र (समय के लिए)। एक प्रेक्षण में ~0.5° सटीकता।' },
      { name: 'प्रच्छादन (चन्द्र-तारा आवरण)', desc: 'जब चन्द्रमा किसी तारे को ढकता है, तारा अदृश्य होकर सटीक क्षणों में पुनः प्रकट होता है। चन्द्रमा ~0.5°/घंटा चलता है, अतः 1 मिनट की समय-सटीकता से ~0.008° स्थिति सटीकता -- सबसे सटीक नग्न-नेत्र विधि।', detail: 'प्रमुख प्रेक्षण: रोहिणी (Aldebaran), मघा (Regulus), चित्रा (Spica), ज्येष्ठा (Antares) का चन्द्र-आवरण। ये चार तारे प्रतिमास अंशांकन बिन्दु देते थे।' },
      { name: 'सिनोडिक काल (प्रतियुति गणना)', desc: 'ग्रह के सूर्य के ठीक विपरीत होने (सूर्यास्त पर उदय = प्रतियुति) की तिथि नोट करें। अगली प्रतियुति की प्रतीक्षा करें। अन्तराल = एक सिनोडिक काल। 10+ चक्रों का औसत लें। 50+ चक्रों (शताब्दियों) में त्रुटि घंटों में आ जाती है।', detail: 'मूल सूत्र: 1/P_नाक्षत्र = 1/P_पृथ्वी - 1/P_सिनोडिक (बाह्य ग्रह)। आन्तरिक ग्रहों के लिए: 1/P_नाक्षत्र = 1/P_पृथ्वी + 1/P_सिनोडिक।' },
      { name: 'दीर्घ आधार रेखा (गुरु-शिष्य परम्परा)', desc: 'मन्दिर खगोलविदों (ज्योतिर्विद) ने निरन्तर दैनिक प्रेक्षण बनाए रखे जो गुरु से शिष्य को पीढ़ियों तक हस्तान्तरित हुए। भारत भर में अनेक स्थलों से स्वतन्त्र सत्यापन। पाँच सिद्धान्त ~2000 वर्षों के संचित आँकड़ों का प्रतिनिधित्व करते हैं।', detail: 'आधुनिक समानान्तर: ठीक ऐसे ही आज खगोलीय सूचीपत्र काम करते हैं -- अनेक वेधशालाओं से दशकों के प्रेक्षण, औसत एवं परिष्कृत।' },
    ],
    sec7closing: 'जन्तर मन्तर वेधशालाओं (1730 के दशक) ने 2-arc-second सटीकता प्राप्त की -- परन्तु कक्षीय काल 1000+ वर्ष पहले से धैर्यपूर्ण नग्न-नेत्र प्रेक्षण से ज्ञात थे।',
    // Mathematical derivation section
    secMath: 'गणितीय व्युत्पत्ति: कक्षीय काल कैसे गणना किए गए',
    secMathSub: 'नग्न-नेत्र प्रेक्षण से सटीक कक्षीय यांत्रिकी तक',
    secMathIntro: 'प्राचीन भारतीय ग्रह की पूरी परिक्रमा सीधे नहीं देख सकते थे। उन्होंने एक सुन्दर अप्रत्यक्ष विधि अपनाई: जो दिखता है (सिनोडिक काल) उसे प्रेक्षित करो, फिर गणित से जो नहीं दिखता (नाक्षत्र काल) उसे व्युत्पन्न करो।',
    secMathSteps: [
      { title: 'चरण 1: प्रतियुति प्रेक्षित करो', desc: 'शनि जैसे बाह्य ग्रह के लिए, वह तिथि नोट करो जब वह ठीक सूर्यास्त पर उदय हो (प्रतियुति)। यह नग्न नेत्रों से दिखता है।' },
      { title: 'चरण 2: अगली प्रतियुति की प्रतीक्षा', desc: 'अगली प्रतियुति तक दिन गिनो। शनि के लिए ~378.09 दिन। यह सिनोडिक काल (P_syn) है -- पृथ्वी द्वारा शनि को "पछाड़ने" का समय।' },
      { title: 'चरण 3: मूल अन्तर्दृष्टि', desc: 'एक सिनोडिक काल में, पृथ्वी एक कक्षा से थोड़ा अधिक पूरा करती है जबकि ग्रह केवल एक छोटा चाप चलता है। कोणीय दरें घटती हैं: ω_ग्रह = ω_पृथ्वी - ω_सिनोडिक।' },
      { title: 'चरण 4: नाक्षत्र काल व्युत्पन्न करो', desc: 'चूँकि कोणीय दर = 360°/काल, हमें मिलता है: 1/P_नाक्षत्र = 1/P_पृथ्वी - 1/P_सिनोडिक। यह एक समीकरण प्रेक्षणीय सिनोडिक काल को वास्तविक कक्षीय काल में बदलता है।' },
      { title: 'चरण 5: अनेक चक्रों का औसत', desc: 'एक माप में ~1 दिन की त्रुटि। 50 प्रतियुतियाँ (शनि के लिए ~52 वर्ष) 50 स्वतन्त्र माप देती हैं। औसत से त्रुटि ~0.02 दिन हो जाती है। सूर्य सिद्धान्त ने सम्भवतः 200+ वर्षों के आँकड़ों का उपयोग किया।' },
    ],
    secMathSaturn: 'उदाहरण: शनि',
    secMathSaturnSteps: [
      'प्रेक्षित सिनोडिक काल: P_syn = 378.09 दिन',
      'पृथ्वी का काल: P_earth = 365.26 दिन',
      '1/P_sid = 1/365.26 - 1/378.09',
      '1/P_sid = 0.002738 - 0.002645 = 0.0000927',
      'P_sid = 1/0.0000927 = 10,787 दिन',
      '= 29.53 वर्ष',
      'सूर्य सिद्धान्त: 10,765.77 दि = 29.47 वर्ष  ✓',
      'नासा JPL: 10,759.22 दि = 29.46 वर्ष  ✓',
    ],
    secMathMoon: 'चन्द्रमा का काल (प्रत्यक्ष प्रेक्षण)',
    secMathMoonSteps: [
      '1. आज रात चन्द्रमा किस तारे के निकट है, नोट करो',
      '2. उसी तारे पर लौटने तक रातें गिनो',
      '3. एक माप: ~27.3 दिन',
      '4. 100 चक्रों का औसत: 27.32166 दिन',
      '5. सूर्य सिद्धान्त मान: 27.321674 दिन',
      '6. त्रुटि: प्रति कक्षा 1.1 सेकंड!',
    ],
    secMathJupiter: 'उदाहरण: बृहस्पति (गुरु)',
    secMathJupiterSteps: [
      'प्रेक्षित सिनोडिक काल: P_syn = 398.88 दिन',
      'पृथ्वी का काल: P_earth = 365.26 दिन',
      '1/P_sid = 1/365.26 - 1/398.88',
      '1/P_sid = 0.002738 - 0.002507 = 0.000231',
      'P_sid = 1/0.000231 = 4,329 दिन',
      '= 11.85 वर्ष',
      'सूर्य सिद्धान्त: 4,332.32 दि = 11.86 वर्ष  ✓',
    ],
    secMathFormula: 'मूल सूत्र',
    secMathFormulaOuter: 'बाह्य ग्रह (मंगल, बृहस्पति, शनि):',
    secMathFormulaInner: 'आन्तरिक ग्रह (बुध, शुक्र):',
    secMathFormulaExplain: 'जहाँ:',
    secMathFormulaTerms: [
      { term: 'P_sidereal', meaning: 'वास्तविक कक्षीय काल — ग्रह को सूर्य की एक पूर्ण परिक्रमा कर उसी तारे पर लौटने में लगने वाला समय। यही हमें ज्ञात करना है, परन्तु सीधे प्रेक्षित नहीं किया जा सकता।' },
      { term: 'P_earth', meaning: 'पृथ्वी का कक्षीय काल = 365.26 दिन। शंकु माप से सटीक रूप से ज्ञात (ऊपर माप विभाग देखें)।' },
      { term: 'P_synodic', meaning: 'प्रेक्षणीय काल — सूर्य-पृथ्वी-ग्रह के दो क्रमिक समान संरेखणों के बीच का समय (जैसे प्रतियुति से प्रतियुति)। प्राचीन खगोलविद इसे सीधे दिनों में गिन सकते थे।' },
    ],
    secMathFormulaWhy: 'यह क्यों काम करता है? पृथ्वी बाह्य ग्रहों से तेज़ चलती है। सिनोडिक काल मापता है कि पृथ्वी को ग्रह को "पछाड़ने" में कितना समय लगता है — जैसे गोल मैदान पर दो धावक। यदि दोनों धावकों की गति ज्ञात हो, तो जितनी बार तेज़ धावक धीमे को पार करे, उससे धीमे की गति ज्ञात हो सकती है। आन्तरिक ग्रहों (बुध, शुक्र) के लिए वे तेज़ धावक हैं, इसलिए सूत्र में घटाव के बजाय जोड़ होता है।',
    secMathVisual: 'सिनोडिक काल: पृथ्वी शनि को पछाड़ रही है',
    closing: 'जब भी आप पञ्चाङ्ग पढ़ते हैं, साढ़े साती जाँचते हैं, या दशा समयरेखा देखते हैं -- आप उन भारतीय खगोलविदों द्वारा मापी गई कक्षीय यांत्रिकी का उपयोग कर रहे हैं जिन्होंने शताब्दियों तक केवल अपनी आँखों, एक शंकु, और असाधारण धैर्य से आकाश का प्रेक्षण किया। संख्याएँ वास्तविक हैं। विज्ञान सुदृढ़ है। परम्परा इसे सुरक्षित रखती है।',
    relatedLinks: 'आगे अन्वेषण करें',
    backToLearn: 'वापस सीखें',
    tblPlanet: 'ग्रह',
    tblSanskrit: 'संस्कृत',
    tblVedic: 'वैदिक काल (सूर्य सिद्धान्त)',
    tblModern: 'आधुनिक (NASA JPL)',
    tblError: 'त्रुटि',
    tblJyotish: 'ज्योतिष में उपयोग',
    tblDashaPlanet: 'दशा ग्रह',
    tblYears: 'वर्ष',
    tblConnection: 'कक्षीय सम्बन्ध',
  },
};

// ── Data ────────────────────────────────────────────────────────
interface OrbitalRow {
  planet: Record<string, string>;
  sanskrit: string;
  vedic: string;
  modern: string;
  error: string;
  jyotish: Record<string, string>;
}

const ORBITAL_DATA: OrbitalRow[] = [
  { planet: { en: 'Moon (sidereal)', hi: 'चन्द्र (नाक्षत्र)', sa: 'चन्द्र (नाक्षत्र)', mai: 'चन्द्र (नाक्षत्र)', mr: 'चन्द्र (नाक्षत्र)', ta: 'சந்திரன் (நாட்சத்திர)', te: 'చంద్రుడు (నక్షత్ర)', bn: 'চন্দ্র (নাক্ষত্রিক)', kn: 'ಚಂದ್ರ (ನಾಕ್ಷತ್ರಿಕ)', gu: 'ચંદ્ર (નાક્ષત્રિક)' }, sanskrit: 'Chandra', vedic: '27.321674 d', modern: '27.321661 d', error: '1.1 sec', jyotish: { en: '27 Nakshatras (one per day)', hi: '27 नक्षत्र (एक प्रतिदिन)', sa: '27 नक्षत्र (एक प्रतिदिन)', mai: '27 नक्षत्र (एक प्रतिदिन)', mr: '27 नक्षत्र (एक प्रतिदिन)', ta: '27 நட்சத்திரங்கள் (நாளுக்கு ஒன்று)', te: '27 నక్షత్రాలు (రోజుకు ఒకటి)', bn: '27 নক্ষত্র (প্রতিদিন একটি)', kn: '27 ನಕ್ಷತ್ರಗಳು (ದಿನಕ್ಕೆ ಒಂದು)', gu: '27 નક્ષત્રો (દરરોજ એક)' } },
  { planet: { en: 'Moon (synodic)', hi: 'चन्द्र (सिनोडिक)', sa: 'चन्द्र (सिनोडिक)', mai: 'चन्द्र (सिनोडिक)', mr: 'चन्द्र (सिनोडिक)', ta: 'சந்திரன் (சினோடிக்)', te: 'చంద్రుడు (సినోడిక్)', bn: 'চন্দ্র (সিনোডিক)', kn: 'ಚಂದ್ರ (ಸಿನೋಡಿಕ್)', gu: 'ચંદ્ર (સિનોડિક)' }, sanskrit: '--', vedic: '29.530589 d', modern: '29.530589 d', error: '~0', jyotish: { en: '30 Tithis per lunar month', hi: '30 तिथि प्रति मास', sa: '30 तिथि प्रति मास', mai: '30 तिथि प्रति मास', mr: '30 तिथि प्रति मास', ta: 'சந்திர மாதத்திற்கு 30 திதிகள்', te: 'చంద్ర మాసానికి 30 తిథులు', bn: 'চান্দ্র মাসে 30 তিথি', kn: 'ಚಂದ್ರ ಮಾಸಕ್ಕೆ 30 ತಿಥಿಗಳು', gu: 'ચંદ્ર માસમાં 30 તિથિ' } },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, sanskrit: 'Budha', vedic: '87.969 d', modern: '87.969 d', error: '~0', jyotish: { en: 'Fastest graha, 3-4 retrogrades/yr', hi: 'सबसे तीव्र ग्रह, 3-4 वक्री/वर्ष', sa: 'सबसे तीव्र ग्रह, 3-4 वक्री/वर्ष', mai: 'सबसे तीव्र ग्रह, 3-4 वक्री/वर्ष', mr: 'सबसे तीव्र ग्रह, 3-4 वक्री/वर्ष', ta: 'வேகமான கிரகம், ஆண்டுக்கு 3-4 வக்ரம்', te: 'వేగవంతమైన గ్రహం, సంవత్సరానికి 3-4 వక్రగతులు', bn: 'দ্রুততম গ্রহ, বছরে ৩-৪ বক্রগতি', kn: 'ವೇಗದ ಗ್ರಹ, ವರ್ಷಕ್ಕೆ 3-4 ವಕ್ರಗತಿ', gu: 'સૌથી ઝડપી ગ્રહ, વર્ષે 3-4 વક્રગતિ' } },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, sanskrit: 'Shukra', vedic: '224.698 d', modern: '224.701 d', error: '4 min', jyotish: { en: '20-yr Dasha (longest = most human impact)', hi: '20 वर्ष दशा (सबसे लम्बी)', sa: '20 वर्ष दशा (सबसे लम्बी)', mai: '20 वर्ष दशा (सबसे लम्बी)', mr: '20 वर्ष दशा (सबसे लम्बी)', ta: '20 ஆண்டு தசை (நீண்ட = அதிக மனித தாக்கம்)', te: '20 సంవత్సర దశ (పొడవైన = అత్యధిక మానవ ప్రభావం)', bn: '20 বছর দশা (দীর্ঘতম = সর্বাধিক মানব প্রভাব)', kn: '20 ವರ್ಷ ದಶೆ (ಅತ್ಯಂತ ದೀರ್ಘ = ಅತ್ಯಧಿಕ ಮಾನವ ಪ್ರಭಾವ)', gu: '20 વર્ષ દશા (સૌથી લાંબી = સૌથી વધુ માનવ પ્રભાવ)' } },
  { planet: { en: 'Sun (Earth)', hi: 'सूर्य (पृथ्वी)', sa: 'सूर्य (पृथ्वी)', mai: 'सूर्य (पृथ्वी)', mr: 'सूर्य (पृथ्वी)', ta: 'சூரியன் (பூமி)', te: 'సూర్యుడు (భూమి)', bn: 'সূর্য (পৃথিবী)', kn: 'ಸೂರ್ಯ (ಭೂಮಿ)', gu: 'સૂર્ય (પૃથ્વી)' }, sanskrit: 'Surya', vedic: '365.258756 d', modern: '365.256363 d', error: '3.5 min', jyotish: { en: 'Solar year, Sankranti, Ayana', hi: 'सौर वर्ष, संक्रान्ति, अयन', sa: 'सौर वर्ष, संक्रान्ति, अयन', mai: 'सौर वर्ष, संक्रान्ति, अयन', mr: 'सौर वर्ष, संक्रान्ति, अयन', ta: 'சூரிய வருடம், சங்க்ராந்தி, அயனம்', te: 'సౌర సంవత్సరం, సంక్రాంతి, అయనం', bn: 'সৌর বছর, সংক্রান্তি, অয়ন', kn: 'ಸೌರ ವರ್ಷ, ಸಂಕ್ರಾಂತಿ, ಅಯನ', gu: 'સૌર વર્ષ, સંક્રાંતિ, અયન' } },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, sanskrit: 'Mangala', vedic: '686.997 d', modern: '686.971 d', error: '37 min', jyotish: { en: '~2-yr cycle, retrograde every 26 mo', hi: '~2 वर्ष चक्र, 26 माह में वक्री', sa: '~2 वर्ष चक्र, 26 माह में वक्री', mai: '~2 वर्ष चक्र, 26 माह में वक्री', mr: '~2 वर्ष चक्र, 26 माह में वक्री', ta: '~2 ஆண்டு சுழற்சி, 26 மாதங்களுக்கு ஒருமுறை வக்ரம்', te: '~2 సంవత్సర చక్రం, ప్రతి 26 నెలలకు వక్రగతి', bn: '~২ বছর চক্র, প্রতি ২৬ মাসে বক্রগতি', kn: '~2 ವರ್ಷ ಚಕ್ರ, ಪ್ರತಿ 26 ತಿಂಗಳಿಗೆ ವಕ್ರಗತಿ', gu: '~2 વર્ષ ચક્ર, દર 26 મહિને વક્રગતિ' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, sanskrit: 'Guru', vedic: '4,332.32 d', modern: '4,332.59 d', error: '0.27 d', jyotish: { en: '12 yrs = 12 signs. 60-yr Samvatsara = 5 orbits', hi: '12 वर्ष = 12 राशि। 60 वर्ष संवत्सर = 5 कक्षाएँ', sa: '12 वर्ष = 12 राशि। 60 वर्ष संवत्सर = 5 कक्षाएँ', mai: '12 वर्ष = 12 राशि। 60 वर्ष संवत्सर = 5 कक्षाएँ', mr: '12 वर्ष = 12 राशि। 60 वर्ष संवत्सर = 5 कक्षाएँ', ta: '12 ஆண்டுகள் = 12 ராசிகள். 60 ஆண்டு சம்வத்சரம் = 5 சுற்றுகள்', te: '12 సంవత్సరాలు = 12 రాశులు. 60 సంవత్సర సంవత్సరం = 5 కక్ష్యలు', bn: '12 বছর = 12 রাশি। 60 বছর সংবৎসর = 5 কক্ষপথ', kn: '12 ವರ್ಷ = 12 ರಾಶಿಗಳು. 60 ವರ್ಷ ಸಂವತ್ಸರ = 5 ಕಕ್ಷೆಗಳು', gu: '12 વર્ષ = 12 રાશિ. 60 વર્ષ સંવત્સર = 5 ભ્રમણ' } },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, sanskrit: 'Shani', vedic: '10,765.77 d', modern: '10,759.22 d', error: '6.55 d / 29.5 yr', jyotish: { en: 'Sade Sati = 7.5 yrs = quarter orbit', hi: 'साढ़े साती = 7.5 वर्ष = चौथाई कक्षा', sa: 'साढ़े साती = 7.5 वर्ष = चौथाई कक्षा', mai: 'साढ़े साती = 7.5 वर्ष = चौथाई कक्षा', mr: 'साढ़े साती = 7.5 वर्ष = चौथाई कक्षा', ta: 'சாடே சாதி = 7.5 ஆண்டுகள் = கால் சுற்று', te: 'సాడే సాతి = 7.5 సంవత్సరాలు = పావు కక్ష్య', bn: 'সাড়ে সাতি = ৭.৫ বছর = এক চতুর্থাংশ কক্ষপথ', kn: 'ಸಾಡೆ ಸಾತಿ = 7.5 ವರ್ಷ = ಕಾಲು ಕಕ್ಷೆ', gu: 'સાડા સાતી = 7.5 વર્ષ = ચોથા ભાગની ભ્રમણકક્ષા' } },
  { planet: { en: 'Rahu/Ketu', hi: 'राहु/केतु', sa: 'राहु/केतु', mai: 'राहु/केतु', mr: 'राहु/केतु', ta: 'ராகு/கேது', te: 'రాహు/కేతు', bn: 'রাহু/কেতু', kn: 'ರಾಹು/ಕೇತು', gu: 'રાહુ/કેતુ' }, sanskrit: '--', vedic: '~6,793 d', modern: '6,798.38 d', error: '5.4 d / 18.6 yr', jyotish: { en: '18-yr Rahu Dasha. Saros eclipse cycle', hi: '18 वर्ष राहु दशा। सारोस ग्रहण चक्र', sa: '18 वर्ष राहु दशा। सारोस ग्रहण चक्र', mai: '18 वर्ष राहु दशा। सारोस ग्रहण चक्र', mr: '18 वर्ष राहु दशा। सारोस ग्रहण चक्र', ta: '18 ஆண்டு ராகு தசை. சரோஸ் கிரகண சுழற்சி', te: '18 సంవత్సర రాహు దశ. సరోస్ గ్రహణ చక్రం', bn: '18 বছর রাহু দশা। স্যারোস গ্রহণ চক্র', kn: '18 ವರ್ಷ ರಾಹು ದಶೆ. ಸಾರೋಸ್ ಗ್ರಹಣ ಚಕ್ರ', gu: '18 વર્ષ રાહુ દશા. સરોસ ગ્રહણ ચક્ર' } },
];

interface DashaRow {
  planet: Record<string, string>;
  years: number;
  connection: Record<string, string>;
}

const DASHA_DATA: DashaRow[] = [
  { planet: { en: 'Ketu', hi: 'केतु', sa: 'केतु', mai: 'केतु', mr: 'केतु', ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ' }, years: 7, connection: { en: 'Half of Rahu-Ketu nodal period (~18.6/2 = 9.3, rounded)', hi: 'राहु-केतु पातीय काल का आधा (~18.6/2 = 9.3)', sa: 'राहु-केतु पातीय काल का आधा (~18.6/2 = 9.3)', mai: 'राहु-केतु पातीय काल का आधा (~18.6/2 = 9.3)', mr: 'राहु-केतु पातीय काल का आधा (~18.6/2 = 9.3)', ta: 'ராகு-கேது முடிச்சுக் காலத்தின் பாதி (~18.6/2 = 9.3, முழுமையாக்கப்பட்டது)', te: 'రాహు-కేతు నోడల్ కాలం యొక్క సగం (~18.6/2 = 9.3, సమీపించబడింది)', bn: 'রাহু-কেতু নোডাল পিরিয়ডের অর্ধেক (~18.6/2 = 9.3, পূর্ণাঙ্কিত)', kn: 'ರಾಹು-ಕೇತು ಗ್ರಂಥಿ ಅವಧಿಯ ಅರ್ಧ (~18.6/2 = 9.3, ಸುತ್ತಿಕೊಂಡಿದೆ)', gu: 'રાહુ-કેતુ નોડલ અવધિનો અડધો ભાગ (~18.6/2 = 9.3, પૂર્ણાંકિત)' } },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, years: 20, connection: { en: 'Venus synodic cycle = 584 d. 20 x 365 / 584 = 12.5 synodic returns', hi: 'शुक्र सिनोडिक = 584 दिन। 20 x 365 / 584 = 12.5 चक्र', sa: 'शुक्र सिनोडिक = 584 दिन। 20 x 365 / 584 = 12.5 चक्र', mai: 'शुक्र सिनोडिक = 584 दिन। 20 x 365 / 584 = 12.5 चक्र', mr: 'शुक्र सिनोडिक = 584 दिन। 20 x 365 / 584 = 12.5 चक्र', ta: 'சுக்கிரன் சினோடிக் சுழற்சி = 584 நாட்கள். 20 x 365 / 584 = 12.5 சினோடிக் திரும்புதல்கள்', te: 'శుక్ర సైనోడిక్ చక్రం = 584 రోజులు. 20 x 365 / 584 = 12.5 సైనోడిక్ తిరుగుళ్ళు', bn: 'শুক্র সিনোডিক চক্র = ৫৮৪ দিন। 20 x 365 / 584 = 12.5 সিনোডিক প্রত্যাবর্তন', kn: 'ಶುಕ್ರ ಸೈನೋಡಿಕ್ ಚಕ್ರ = 584 ದಿನ. 20 x 365 / 584 = 12.5 ಸೈನೋಡಿಕ್ ಮರಳುವಿಕೆ', gu: 'શુક્ર સાયનોડિક ચક્ર = 584 દિવસ. 20 x 365 / 584 = 12.5 સાયનોડિક પ્રત્યાવર્તન' } },
  { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, years: 6, connection: { en: '~6 solar returns', hi: '~6 सौर वापसी', sa: '~6 सौर वापसी', mai: '~6 सौर वापसी', mr: '~6 सौर वापसी', ta: '~6 சூரிய திரும்புதல்கள்', te: '~6 సౌర తిరుగుళ్ళు', bn: '~6 সৌর প্রত্যাবর্তন', kn: '~6 ಸೌರ ಮರಳುವಿಕೆಗಳು', gu: '~6 સૌર પ્રત્યાવર્તન' } },
  { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, years: 10, connection: { en: '~130 lunar sidereal months (10 x 12.37)', hi: '~130 चन्द्र नाक्षत्र मास', sa: '~130 चन्द्र नाक्षत्र मास', mai: '~130 चन्द्र नाक्षत्र मास', mr: '~130 चन्द्र नाक्षत्र मास', ta: '~130 சந்திர நாட்சத்திர மாதங்கள் (10 x 12.37)', te: '~130 చంద్ర నక్షత్ర మాసాలు (10 x 12.37)', bn: '~১৩০ চান্দ্র নাক্ষত্রিক মাস (10 x 12.37)', kn: '~130 ಚಂದ್ರ ನಾಕ್ಷತ್ರಿಕ ಮಾಸಗಳು (10 x 12.37)', gu: '~130 ચંદ્ર નાક્ષત્રિક માસ (10 x 12.37)' } },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, years: 7, connection: { en: '~3.5 Mars synodic cycles (7 x 365 / 780 = 3.27)', hi: '~3.5 मंगल सिनोडिक चक्र', sa: '~3.5 मंगल सिनोडिक चक्र', mai: '~3.5 मंगल सिनोडिक चक्र', mr: '~3.5 मंगल सिनोडिक चक्र', ta: '~3.5 செவ்வாய் சினோடிக் சுழற்சிகள் (7 x 365 / 780 = 3.27)', te: '~3.5 కుజ సైనోడిక్ చక్రాలు (7 x 365 / 780 = 3.27)', bn: '~3.5 মঙ্গল সিনোডিক চক্র (7 x 365 / 780 = 3.27)', kn: '~3.5 ಮಂಗಳ ಸೈನೋಡಿಕ್ ಚಕ್ರಗಳು (7 x 365 / 780 = 3.27)', gu: '~3.5 મંગળ સાયનોડિક ચક્ર (7 x 365 / 780 = 3.27)' } },
  { planet: { en: 'Rahu', hi: 'राहु', sa: 'राहु', mai: 'राहु', mr: 'राहु', ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' }, years: 18, connection: { en: 'ONE complete Rahu-Ketu orbital cycle (18.6 yrs)', hi: 'एक पूर्ण राहु-केतु कक्षीय चक्र (18.6 वर्ष)', sa: 'एक पूर्ण राहु-केतु कक्षीय चक्र (18.6 वर्ष)', mai: 'एक पूर्ण राहु-केतु कक्षीय चक्र (18.6 वर्ष)', mr: 'एक पूर्ण राहु-केतु कक्षीय चक्र (18.6 वर्ष)', ta: 'ஒரு முழுமையான ராகு-கேது சுற்றுப்பாதை சுழற்சி (18.6 ஆண்டுகள்)', te: 'ఒక పూర్తి రాహు-కేతు కక్ష్య చక్రం (18.6 సంవత్సరాలు)', bn: 'একটি সম্পূর্ণ রাহু-কেতু কক্ষপথ চক্র (18.6 বছর)', kn: 'ಒಂದು ಪೂರ್ಣ ರಾಹು-ಕೇತು ಕಕ್ಷೆ ಚಕ್ರ (18.6 ವರ್ಷ)', gu: 'એક સંપૂર્ણ રાહુ-કેતુ ભ્રમણકક્ષા ચક્ર (18.6 વર્ષ)' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, years: 16, connection: { en: '~1.35 Jupiter orbits. Close to synodic period count', hi: '~1.35 बृहस्पति कक्षाएँ', sa: '~1.35 बृहस्पति कक्षाएँ', mai: '~1.35 बृहस्पति कक्षाएँ', mr: '~1.35 बृहस्पति कक्षाएँ', ta: '~1.35 வியாழன் சுற்றுகள். சினோடிக் காலத்திற்கு நெருக்கமானது', te: '~1.35 గురు కక్ష్యలు. సైనోడిక్ కాల లెక్కకు దగ్గర', bn: '~1.35 বৃহস্পতি কক্ষপথ। সিনোডিক পিরিয়ড গণনার কাছাকাছি', kn: '~1.35 ಗುರು ಕಕ್ಷೆಗಳು. ಸೈನೋಡಿಕ್ ಅವಧಿ ಎಣಿಕೆಗೆ ಹತ್ತಿರ', gu: '~1.35 ગુરુ ભ્રમણકક્ષા. સાયનોડિક અવધિ ગણતરીની નજીક' } },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, years: 19, connection: { en: '~Jupiter-Saturn synodic period (19.86 yrs)', hi: '~बृहस्पति-शनि सिनोडिक काल (19.86 वर्ष)', sa: '~बृहस्पति-शनि सिनोडिक काल (19.86 वर्ष)', mai: '~बृहस्पति-शनि सिनोडिक काल (19.86 वर्ष)', mr: '~बृहस्पति-शनि सिनोडिक काल (19.86 वर्ष)', ta: '~வியாழன்-சனி சினோடிக் காலம் (19.86 ஆண்டுகள்)', te: '~గురు-శని సైనోడిక్ కాలం (19.86 సంవత్సరాలు)', bn: '~বৃহস্পতি-শনি সিনোডিক পিরিয়ড (19.86 বছর)', kn: '~ಗುರು-ಶನಿ ಸೈನೋಡಿಕ್ ಅವಧಿ (19.86 ವರ್ಷ)', gu: '~ગુરુ-શનિ સાયનોડિક અવધિ (19.86 વર્ષ)' } },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, years: 17, connection: { en: '~70.7 Mercury sidereal periods (17 x 365 / 87.97)', hi: '~70.7 बुध नाक्षत्र काल', sa: '~70.7 बुध नाक्षत्र काल', mai: '~70.7 बुध नाक्षत्र काल', mr: '~70.7 बुध नाक्षत्र काल', ta: '~70.7 புதன் நாட்சத்திர காலங்கள் (17 x 365 / 87.97)', te: '~70.7 బుధ నక్షత్ర కాలాలు (17 x 365 / 87.97)', bn: '~70.7 বুধ নাক্ষত্র কাল (17 x 365 / 87.97)', kn: '~70.7 ಬುಧ ನಕ್ಷತ್ರ ಅವಧಿಗಳು (17 x 365 / 87.97)', gu: '~70.7 બુધ નક્ષત્ર કાળ (17 x 365 / 87.97)' } },
];

// ── Saturn orbit visual data ────────────────────────────────────
const SIGNS_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SIGNS_HI = ['मेष', 'वृष', 'मिथु', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

// ── Helpers ─────────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const SectionIcon = ({ icon: Icon, className = '' }: { icon: typeof Orbit; className?: string }) => (
  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gold-primary/15 border border-gold-primary/20 shrink-0 ${className}`}>
    <Icon className="w-5 h-5 text-gold-light" />
  </div>
);

// ── SVG: Lunar Nodes Diagram (compact, fills space) ─────────────
function NodalDiagram({ isHi }: { isHi: boolean }) {
  // Tighter viewBox, larger orbits relative to container
  const cx = 200, cy = 110, r = 150;
  return (
    <svg viewBox="0 0 400 215" className="w-full">
      <defs>
        <linearGradient id="eclipticGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="moonOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle key={i} cx={20 + (i * 27) % 370} cy={8 + (i * 31) % 195} r={0.4 + (i % 3) * 0.3} fill="#f0d48a" opacity={0.1 + (i % 4) * 0.08} />
      ))}

      {/* Ecliptic plane (horizontal ellipse — the Sun's path) */}
      <ellipse cx={cx} cy={cy} rx={r} ry={36} fill="none" stroke="url(#eclipticGrad)" strokeWidth="2.5" strokeDasharray="8 4" />

      {/* Moon orbit (tilted ellipse — ~5.1° exaggerated to 15° for visibility) */}
      <g transform={`rotate(-15, ${cx}, ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={r} ry={36} fill="none" stroke="url(#moonOrbitGrad)" strokeWidth="2.5" />
      </g>

      {/* Legend (top-left, compact) */}
      <line x1="8" y1="12" x2="22" y2="12" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
      <text x="25" y="15" fill="#f59e0b" fontSize="6.5" opacity="0.9">{isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}</text>
      <line x1="8" y1="24" x2="22" y2="24" stroke="#818cf8" strokeWidth="2" />
      <text x="25" y="27" fill="#818cf8" fontSize="6.5" opacity="0.9">{isHi ? 'चन्द्र कक्षा' : "Moon's orbit"}</text>

      {/* ── Rahu node (ascending) — left intersection ── */}
      <circle cx={cx - r + 8} cy={cy + 12} r="14" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="2.5" filter="url(#nodeGlow)" />
      <text x={cx - r + 8} y={cy + 16} textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">
        {isHi ? 'रा' : 'Ra'}
      </text>
      {/* Label below */}
      <text x={cx - r + 8} y={cy + 35} textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">
        {isHi ? 'राहु' : 'Rahu'}
      </text>
      <text x={cx - r + 8} y={cy + 46} textAnchor="middle" fill="#fca5a5" fontSize="7" opacity="0.7">
        {isHi ? 'आरोही पात' : 'Ascending Node'}
      </text>
      {/* Up arrow showing Moon crossing upward */}
      <path d={`M ${cx - r - 8} ${cy + 5} L ${cx - r + 8} ${cy - 8} L ${cx - r + 24} ${cy + 5}`} fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.5" markerMid="url(#arrowUp)" />
      <text x={cx - r - 14} y={cy - 2} fill="#818cf8" fontSize="6" opacity="0.6" textAnchor="end">{isHi ? 'चन्द्र ↗' : 'Moon ↗'}</text>

      {/* ── Ketu node (descending) — right intersection ── */}
      <circle cx={cx + r - 8} cy={cy - 12} r="14" fill="rgba(168,85,247,0.25)" stroke="#a855f7" strokeWidth="2.5" filter="url(#nodeGlow)" />
      <text x={cx + r - 8} y={cy - 8} textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">
        {isHi ? 'के' : 'Ke'}
      </text>
      {/* Label above */}
      <text x={cx + r - 8} y={cy - 32} textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold">
        {isHi ? 'केतु' : 'Ketu'}
      </text>
      <text x={cx + r - 8} y={cy - 43} textAnchor="middle" fill="#c084fc" fontSize="7" opacity="0.7">
        {isHi ? 'अवरोही पात' : 'Descending Node'}
      </text>
      {/* Down arrow showing Moon crossing downward */}
      <text x={cx + r + 20} y={cy + 2} fill="#818cf8" fontSize="6" opacity="0.6">{isHi ? 'चन्द्र ↘' : 'Moon ↘'}</text>

      {/* Earth at center (this is geocentric view) */}
      <circle cx={cx} cy={cy} r="12" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="bold">
        {isHi ? 'पृथ्वी' : 'Earth'}
      </text>

      {/* Nodal line (Rahu-Ketu axis) */}
      <line x1={cx - r + 8} y1={cy + 12} x2={cx + r - 8} y2={cy - 12} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.3" />
      <text x={cx} y={cy + 24} textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.5">
        {isHi ? '← राहु-केतु अक्ष →' : '← Rahu-Ketu axis →'}
      </text>

      {/* Moon position on its orbit */}
      <circle cx={cx + 80} cy={cy - 30} r="7" fill="rgba(226,232,240,0.2)" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x={cx + 80} y={cy - 27} textAnchor="middle" fill="#e2e8f0" fontSize="6" fontWeight="bold">{isHi ? 'चन्द्र' : 'Moon'}</text>

      {/* Bottom explanation */}
      <text x={cx} y={196} textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.8">
        {isHi ? 'राहु-केतु धीरे-धीरे राशि चक्र में पीछे खिसकते हैं' : 'Rahu & Ketu slowly drift backward through the zodiac'}
      </text>
      <text x={cx} y={208} textAnchor="middle" fill="#f0d48a" fontSize="6.5" opacity="0.55">
        {isHi ? 'एक पूर्ण चक्र = 18.6 वर्ष — यही सारोस ग्रहण चक्र का आधार है' : 'One full loop = 18.6 years — this is why eclipses repeat on a similar schedule'}
      </text>
    </svg>
  );
}

// ── SVG: Synodic Period Visual ──────────────────────────────────
function SynodicVisual({ isHi }: { isHi: boolean }) {
  const cx = 180, cy = 150;
  // Show Earth at two positions and Saturn barely moving
  const earthR = 70, saturnR = 130;
  // Position 1: Earth and Saturn at opposition (aligned with Sun)
  const e1Angle = -90 * Math.PI / 180;
  const s1Angle = -90 * Math.PI / 180;
  // Position 2: ~378 days later, Earth has gone 373° (slightly past full orbit), Saturn has gone ~12.2°
  const e2Angle = (-90 + 373) * Math.PI / 180;
  const s2Angle = (-90 + 12.2) * Math.PI / 180;

  return (
    <svg viewBox="0 0 360 300" className="w-full max-w-[340px]">
      <defs>
        <linearGradient id="orbitGold2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8a6d2b" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Saturn orbit */}
      <circle cx={cx} cy={cy} r={saturnR} fill="none" stroke="#f0d48a" strokeWidth="0.8" opacity="0.2" />
      {/* Earth orbit */}
      <circle cx={cx} cy={cy} r={earthR} fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3" />

      {/* Sun center */}
      <circle cx={cx} cy={cy} r="10" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold">{isHi ? 'सूर्य' : 'Sun'}</text>

      {/* Earth Position 1 */}
      <circle cx={cx + earthR * Math.cos(e1Angle)} cy={cy + earthR * Math.sin(e1Angle)} r="7" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={cx + earthR * Math.cos(e1Angle)} y={cy + earthR * Math.sin(e1Angle) - 12} textAnchor="middle" fill="#93c5fd" fontSize="6" fontWeight="bold">E₁</text>

      {/* Earth Position 2 */}
      <circle cx={cx + earthR * Math.cos(e2Angle)} cy={cy + earthR * Math.sin(e2Angle)} r="7" fill="rgba(59,130,246,0.5)" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={cx + earthR * Math.cos(e2Angle) + 12} y={cy + earthR * Math.sin(e2Angle) + 4} textAnchor="start" fill="#93c5fd" fontSize="6" fontWeight="bold">E₂</text>

      {/* Earth orbit arc (showing full+ revolution) */}
      <circle cx={cx} cy={cy} r={earthR} fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 2" />

      {/* Saturn Position 1 */}
      <circle cx={cx + saturnR * Math.cos(s1Angle)} cy={cy + saturnR * Math.sin(s1Angle)} r="8" fill="rgba(240,212,138,0.2)" stroke="#f0d48a" strokeWidth="1.5" />
      <text x={cx + saturnR * Math.cos(s1Angle) - 14} y={cy + saturnR * Math.sin(s1Angle) + 4} textAnchor="end" fill="#f0d48a" fontSize="6" fontWeight="bold">S₁</text>

      {/* Saturn Position 2 (barely moved) */}
      <circle cx={cx + saturnR * Math.cos(s2Angle)} cy={cy + saturnR * Math.sin(s2Angle)} r="8" fill="rgba(240,212,138,0.4)" stroke="#f0d48a" strokeWidth="1.5" />
      <text x={cx + saturnR * Math.cos(s2Angle) + 14} y={cy + saturnR * Math.sin(s2Angle) + 4} textAnchor="start" fill="#f0d48a" fontSize="6" fontWeight="bold">S₂</text>

      {/* Saturn arc (tiny movement ~12°) */}
      <path d={`M ${cx + saturnR * Math.cos(s1Angle)} ${cy + saturnR * Math.sin(s1Angle)} A ${saturnR} ${saturnR} 0 0 1 ${cx + saturnR * Math.cos(s2Angle)} ${cy + saturnR * Math.sin(s2Angle)}`} fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.6" />

      {/* Opposition alignment lines */}
      <line x1={cx} y1={cy} x2={cx + saturnR * Math.cos(s1Angle)} y2={cy + saturnR * Math.sin(s1Angle)} stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
      <line x1={cx} y1={cy} x2={cx + saturnR * Math.cos(s2Angle)} y2={cy + saturnR * Math.sin(s2Angle)} stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />

      {/* Labels */}
      <text x={cx} y={18} textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">
        {isHi ? 'सिनोडिक काल: पृथ्वी शनि को पछाड़ती है' : 'Synodic Period: Earth Overtaking Saturn'}
      </text>

      <text x={20} y={cy + 8} fill="#ef4444" fontSize="7" opacity="0.7">
        {isHi ? 'प्रतियुति 1' : 'Opposition 1'}
      </text>
      <text x={cx + saturnR * Math.cos(s2Angle) + 14} y={cy + saturnR * Math.sin(s2Angle) + 18} fill="#22c55e" fontSize="7" opacity="0.7">
        {isHi ? 'प्रतियुति 2' : 'Opposition 2'}
      </text>

      {/* Bottom annotation */}
      <text x={cx} y={280} textAnchor="middle" fill="#94a3b8" fontSize="7">
        {isHi ? '378 दिनों में: पृथ्वी = 1.035 चक्कर | शनि = 12.2° चाप' : '378 days: Earth = 1.035 orbits | Saturn = 12.2° arc'}
      </text>
      <text x={cx} y={295} textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold">
        1/P_sid = 1/P_earth - 1/P_syn
      </text>
    </svg>
  );
}

// ── SVG: Saros Timeline ─────────────────────────────────────────
function SarosTimeline({ isHi }: { isHi: boolean }) {
  const eclipses = [
    { year: '2008', type: isHi ? 'कुल सूर्य' : 'Total Solar', x: 40 },
    { year: '2026', type: isHi ? 'कुल सूर्य' : 'Total Solar', x: 160 },
    { year: '2044', type: isHi ? 'कुल सूर्य' : 'Total Solar', x: 280 },
  ];
  return (
    <svg viewBox="0 0 360 80" className="w-full">
      {/* Timeline bar */}
      <line x1="30" y1="35" x2="330" y2="35" stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />

      {eclipses.map((e, i) => (
        <g key={i}>
          <circle cx={e.x} cy="35" r="8" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" />
          <text x={e.x} y="39" textAnchor="middle" fill="#fca5a5" fontSize="6" fontWeight="bold">{i + 1}</text>
          <text x={e.x} y="18" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold">{e.year}</text>
          <text x={e.x} y="58" textAnchor="middle" fill="#94a3b8" fontSize="6">{e.type}</text>
          {i < eclipses.length - 1 && (
            <>
              <line x1={e.x + 12} y1="35" x2={eclipses[i + 1].x - 12} y2="35" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
              <text x={(e.x + eclipses[i + 1].x) / 2} y="72" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="bold">
                18y 11d 8h
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function PlanetaryCyclesPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const t = (key: string) => lt((LJ as unknown as Record<string, LocaleText>)[key], locale);
  const l = (L as Record<string, typeof L.en>)[locale] || L.en;

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative z-10">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-gold-light/70 hover:text-indigo-200 text-xs uppercase tracking-wider mb-6 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {t('backToLearn')}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Orbit className="w-6 h-6 text-gold-light" />
            <span className="text-gold-light text-xs uppercase tracking-widest font-bold">{t('badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight" style={hf}>
            {t('title')}
          </h1>
          <p className="text-indigo-200/60 text-base sm:text-lg max-w-3xl mb-8" style={bf}>{t('sub')}</p>

          {/* Hook quote */}
          <div className="border-l-2 border-gold-primary/40 pl-5 py-2">
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed italic max-w-3xl" style={bf}>
              {t('hook')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════ SECTION 1: Grand Comparison Table ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Target} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{t('sec1')}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{t('sec1sub')}</p>
          </div>
        </div>

        {/* Table container */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblPlanet')}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider hidden sm:table-cell" style={hf}>{t('tblSanskrit')}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblVedic')}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblModern')}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblError')}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider hidden lg:table-cell" style={hf}>{t('tblJyotish')}</th>
                </tr>
              </thead>
              <tbody>
                {ORBITAL_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-indigo-500/8 hover:bg-indigo-500/5 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium" style={bf}>{isHi ? row.planet.hi : row.planet.en}</td>
                    <td className="px-4 py-3 text-violet-300/70 hidden sm:table-cell" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sanskrit}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-300/80 text-xs">{row.vedic}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-300/80 text-xs">{row.modern}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-300/90 text-xs font-bold">{row.error}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs hidden lg:table-cell" style={bf}>{isHi ? row.jyotish.hi : row.jyotish.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Highlight callout */}
          <div className="px-5 py-4 bg-gold-primary/5 border-t border-gold-primary/12">
            <p className="text-gold-light text-sm font-medium leading-relaxed" style={bf}>{t('sec1note')}</p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 2: Sade Sati ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Clock} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec2}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec2sub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Explanation */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec2text1}</p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec2text2}</p>
            <pre className="bg-black/30 rounded-xl border border-indigo-500/15 px-4 py-3 text-xs text-emerald-300/80 font-mono whitespace-pre-wrap leading-relaxed">
              {l.sec2calc}
            </pre>
          </div>

          {/* Saturn orbit SVG */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-[300px]">
              <defs>
                <linearGradient id="satGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
                <linearGradient id="sadeSatiArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Orbit circle */}
              <circle cx="160" cy="160" r="130" fill="none" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
              {/* Sign markers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 160 + 130 * Math.cos(angle);
                const y = 160 + 130 * Math.sin(angle);
                const lx = 160 + 112 * Math.cos(angle);
                const ly = 160 + 112 * Math.sin(angle);
                const isSadeSati = i >= 11 || i <= 1; // 12th, 1st, 2nd from sign 0
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isSadeSati ? 14 : 10} fill={isSadeSati ? 'rgba(239,68,68,0.15)' : 'rgba(240,212,138,0.08)'} stroke={isSadeSati ? '#ef4444' : '#f0d48a'} strokeWidth={isSadeSati ? 1.5 : 0.5} strokeOpacity={isSadeSati ? 0.6 : 0.3} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={isSadeSati ? '#fca5a5' : '#f0d48a'} fontSize="7" fontWeight={isSadeSati ? 'bold' : 'normal'} opacity={isSadeSati ? 1 : 0.6}>
                      {isHi ? SIGNS_HI[i] : SIGNS_EN[i]}
                    </text>
                    {/* 2.5yr label */}
                    <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="middle" fill="#f0d48a" fontSize="5" opacity="0.3">
                      2.5y
                    </text>
                  </g>
                );
              })}
              {/* Center */}
              <circle cx="160" cy="160" r="24" fill="rgba(240,212,138,0.05)" stroke="#f0d48a" strokeWidth="0.5" opacity="0.4" />
              <text x="160" y="155" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.8">{isHi ? 'चन्द्र' : 'Moon'}</text>
              <text x="160" y="165" textAnchor="middle" fill="#f0d48a" fontSize="6" opacity="0.5">{isHi ? 'राशि' : 'Sign'}</text>
              {/* Sade Sati arc label */}
              <text x="160" y="22" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                {isHi ? 'साढ़े साती = 7.5 वर्ष' : 'Sade Sati = 7.5 yrs'}
              </text>
              {/* Saturn icon */}
              <circle cx={160 + 130 * Math.cos((-90 + 330) * Math.PI / 180)} cy={160 + 130 * Math.sin((-90 + 330) * Math.PI / 180)} r="5" fill="#f0d48a" opacity="0.9" />
              <text x={160 + 130 * Math.cos((-90 + 330) * Math.PI / 180)} y={160 + 130 * Math.sin((-90 + 330) * Math.PI / 180) - 10} textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold">{isHi ? 'शनि' : 'Saturn'}</text>
            </svg>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 3: Jupiter Transit ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Star} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec3}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec3sub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jupiter orbit clock */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-[300px]">
              <circle cx="160" cy="160" r="130" fill="none" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 160 + 130 * Math.cos(angle);
                const y = 160 + 130 * Math.sin(angle);
                // Favorable: 2nd(1), 5th(4), 7th(6), 9th(8), 11th(10) from sign 0
                const favorable = [1, 4, 6, 8, 10].includes(i);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={favorable ? 14 : 10} fill={favorable ? 'rgba(34,197,94,0.15)' : 'rgba(240,212,138,0.08)'} stroke={favorable ? '#22c55e' : '#f0d48a'} strokeWidth={favorable ? 1.5 : 0.5} strokeOpacity={favorable ? 0.6 : 0.3} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={favorable ? '#86efac' : '#f0d48a'} fontSize="7" fontWeight={favorable ? 'bold' : 'normal'} opacity={favorable ? 1 : 0.6}>
                      {isHi ? SIGNS_HI[i] : SIGNS_EN[i]}
                    </text>
                  </g>
                );
              })}
              <circle cx="160" cy="160" r="24" fill="rgba(240,212,138,0.05)" stroke="#f0d48a" strokeWidth="0.5" opacity="0.4" />
              <text x="160" y="155" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.8">{isHi ? 'चन्द्र' : 'Moon'}</text>
              <text x="160" y="165" textAnchor="middle" fill="#f0d48a" fontSize="6" opacity="0.5">{isHi ? 'राशि' : 'Sign'}</text>
              {/* Label */}
              <text x="160" y="22" textAnchor="middle" fill="#86efac" fontSize="8" fontWeight="bold">
                {isHi ? '5/12 वर्ष अनुकूल = 42%' : '5/12 years favorable = 42%'}
              </text>
            </svg>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec3text1}</p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec3text2}</p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { num: '60', label: isHi ? 'संवत्सर चक्र' : 'Samvatsara cycle', unit: isHi ? 'वर्ष' : 'yrs' },
                { num: '5', label: isHi ? 'बृहस्पति कक्षाएँ' : 'Jupiter orbits', unit: 'x 12' },
                { num: '2', label: isHi ? 'शनि कक्षाएँ' : 'Saturn orbits', unit: 'x 30' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-black/20 border border-indigo-500/10">
                  <div className="text-2xl font-bold text-gold-light font-mono">{item.num}</div>
                  <div className="text-xs text-gold-light/50 mt-0.5">{item.unit}</div>
                  <div className="text-xs text-text-tertiary mt-1" style={bf}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 4: Vimshottari Dasha ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Orbit} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec4}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec4sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] overflow-hidden">
          <div className="p-6">
            <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bf}>{l.sec4text}</p>
          </div>

          {/* Dasha table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gold-primary/12">
                  <th className="text-left px-5 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblDashaPlanet')}</th>
                  <th className="text-center px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblYears')}</th>
                  <th className="text-left px-5 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{t('tblConnection')}</th>
                </tr>
              </thead>
              <tbody>
                {DASHA_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-indigo-500/8 hover:bg-indigo-500/5 transition-colors">
                    <td className="px-5 py-3 text-text-primary font-medium" style={bf}>{isHi ? row.planet.hi : row.planet.en}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light font-mono font-bold text-sm">
                        {row.years}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary text-xs" style={bf}>{isHi ? row.connection.hi : row.connection.en}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-gold-primary/5 border-t border-gold-primary/15">
                  <td className="px-5 py-3 text-gold-light font-bold" style={hf}>{isHi ? 'कुल' : 'Total'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light font-mono font-bold text-sm">
                      120
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gold-light text-xs font-medium" style={bf}>
                    = 2 x 60 (Samvatsara) = 10 Jupiter orbits = 4 Saturn semi-orbits
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Formula */}
          <div className="px-5 py-4 bg-black/20 border-t border-indigo-500/10">
            <pre className="text-emerald-300/80 font-mono text-xs mb-2">{l.sec4formula}</pre>
            <p className="text-text-tertiary text-xs" style={bf}>{l.sec4formulaLabel}</p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 5: Nakshatras ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Star} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec5}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec5sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
          <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bf}>{l.sec5text}</p>

          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: '27.32', label: isHi ? 'दिन (नाक्षत्र काल)' : 'days (sidereal period)', sub: isHi ? 'चन्द्रमा' : 'Moon' },
              { num: '27', label: isHi ? 'नक्षत्र' : 'Nakshatras', sub: isHi ? 'चन्द्र स्थान' : 'lunar stations' },
              { num: '13.33', label: isHi ? 'अंश प्रत्येक' : 'degrees each', sub: '360 / 27' },
              { num: '13.2', label: isHi ? 'अंश/दिन' : 'deg/day', sub: isHi ? 'चन्द्र गति' : 'lunar motion' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
                <div className="text-xl sm:text-2xl font-bold text-gold-light font-mono">{item.num}</div>
                <div className="text-xs text-text-secondary mt-1" style={bf}>{item.label}</div>
                <div className="text-xs text-text-tertiary mt-0.5 font-mono">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 6: Eclipse / Rahu-Ketu (ENHANCED) ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Eye} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec6}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec6sub}</p>
          </div>
        </div>

        {/* Intro */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
          <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec6intro}</p>
        </div>

        {/* Nodal Diagram */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] px-5 py-3">
          <NodalDiagram isHi={isHi} />
        </div>

        {/* How Eclipses Happen */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
          <h3 className="text-lg font-bold text-gold-light" style={hf}>{l.sec6how}</h3>
          <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec6howText}</p>
        </div>

        {/* Saros Cycle */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
          <h3 className="text-lg font-bold text-gold-light" style={hf}>{l.sec6saros}</h3>
          <div className="text-text-secondary text-sm leading-relaxed space-y-3" style={bf}>
            {l.sec6sarosText.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>

          {/* Saros Timeline */}
          <SarosTimeline isHi={isHi} />

          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">18.03</div>
              <div className="text-xs text-text-secondary mt-1" style={bf}>{isHi ? 'सारोस चक्र (वर्ष)' : 'Saros Cycle (yrs)'}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">18.61</div>
              <div className="text-xs text-text-secondary mt-1" style={bf}>{isHi ? 'राहु-केतु काल (वर्ष)' : 'Rahu-Ketu Period (yrs)'}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">223</div>
              <div className="text-xs text-text-secondary mt-1" style={bf}>{isHi ? 'सिनोडिक मास' : 'Synodic months'}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">242</div>
              <div className="text-xs text-text-secondary mt-1" style={bf}>{isHi ? 'ड्रैकोनिक मास' : 'Draconic months'}</div>
            </div>
          </div>
        </div>

        {/* Accuracy callout */}
        <div className="px-5 py-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
          <p className="text-gold-light text-sm font-medium leading-relaxed" style={bf}>{l.sec6accuracy}</p>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 8: Mathematical Derivation ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Calculator} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.secMath}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.secMathSub}</p>
          </div>
        </div>

        {/* Intro */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
          <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.secMathIntro}</p>
        </div>

        {/* 5-step derivation */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-3">
          {l.secMathSteps.map((step, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/15 border border-indigo-500/8">
              <div className="w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shrink-0">
                <span className="text-gold-light font-mono text-xs font-bold">{i + 1}</span>
              </div>
              <div>
                <h4 className="text-gold-light text-sm font-bold mb-1" style={hf}>{step.title}</h4>
                <p className="text-text-secondary text-xs leading-relaxed" style={bf}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Synodic Visual */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 flex items-center justify-center">
          <SynodicVisual isHi={isHi} />
        </div>

        {/* Master Formula */}
        <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 space-y-5">
          <h3 className="text-lg font-bold text-gold-light" style={hf}>{l.secMathFormula}</h3>

          {/* The two formulas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-indigo-500/15">
              <p className="text-text-secondary text-xs mb-2" style={bf}>{l.secMathFormulaOuter}</p>
              <pre className="text-emerald-300/90 font-mono text-sm font-bold">1/P_sidereal = 1/P_earth - 1/P_synodic</pre>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-indigo-500/15">
              <p className="text-text-secondary text-xs mb-2" style={bf}>{l.secMathFormulaInner}</p>
              <pre className="text-emerald-300/90 font-mono text-sm font-bold">1/P_sidereal = 1/P_earth + 1/P_synodic</pre>
            </div>
          </div>

          {/* Variable explanations */}
          <div className="space-y-2">
            <p className="text-gold-light text-sm font-bold" style={hf}>{l.secMathFormulaExplain}</p>
            {l.secMathFormulaTerms.map((t, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-black/15 border border-indigo-500/6">
                <code className="text-emerald-300/90 font-mono text-xs font-bold whitespace-nowrap shrink-0 mt-0.5">{t.term}</code>
                <p className="text-text-secondary text-xs leading-relaxed" style={bf}>{t.meaning}</p>
              </div>
            ))}
          </div>

          {/* Intuitive explanation */}
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/12">
            <p className="text-text-secondary text-xs leading-relaxed" style={bf}>{l.secMathFormulaWhy}</p>
          </div>
        </div>

        {/* Worked examples side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saturn */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 space-y-3">
            <h3 className="text-base font-bold text-gold-light" style={hf}>{l.secMathSaturn}</h3>
            <div className="space-y-1.5">
              {l.secMathSaturnSteps.map((step, i) => (
                <div key={i} className={`font-mono text-xs ${i >= 6 ? 'text-amber-300/90 font-bold' : i >= 3 ? 'text-emerald-300/80' : 'text-text-secondary'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Jupiter */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 space-y-3">
            <h3 className="text-base font-bold text-gold-light" style={hf}>{l.secMathJupiter}</h3>
            <div className="space-y-1.5">
              {l.secMathJupiterSteps.map((step, i) => (
                <div key={i} className={`font-mono text-xs ${i >= 6 ? 'text-amber-300/90 font-bold' : i >= 3 ? 'text-emerald-300/80' : 'text-text-secondary'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Moon */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 space-y-3">
            <h3 className="text-base font-bold text-gold-light" style={hf}>{l.secMathMoon}</h3>
            <div className="space-y-1.5">
              {l.secMathMoonSteps.map((step, i) => (
                <div key={i} className={`font-mono text-xs ${i >= 4 ? 'text-amber-300/90 font-bold' : 'text-text-secondary'}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 7: How They Measured (ENHANCED) ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Telescope} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec7}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec7sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
          {l.sec7methods.map((method, i) => (
            <div key={i} className="p-5 rounded-xl bg-black/15 border border-indigo-500/8 space-y-3">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-gold-light font-mono text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-gold-light text-sm font-bold mb-1" style={hf}>{method.name}</h4>
                  <p className="text-text-secondary text-xs leading-relaxed" style={bf}>{method.desc}</p>
                </div>
              </div>
              {/* Expanded detail */}
              <div className="ml-12 p-3 rounded-lg bg-black/20 border border-indigo-500/6">
                <p className="text-text-tertiary text-xs leading-relaxed whitespace-pre-wrap" style={bf}>{method.detail}</p>
              </div>
            </div>
          ))}

          <p className="text-text-tertiary text-xs leading-relaxed pt-3 border-t border-indigo-500/10" style={bf}>
            {l.sec7closing}
          </p>
        </div>
      </motion.section>

      {/* ══════════════ CLOSING ══════════════ */}
      <motion.section {...fadeUp}>
        <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-8">
          <p className="text-indigo-100/80 text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto" style={bf}>
            {t('closing')}
          </p>
        </div>
      </motion.section>

      {/* ══════════════ RELATED LINKS ══════════════ */}
      <motion.section {...fadeUp} className="space-y-4">
        <h3 className="text-gold-light text-sm uppercase tracking-widest font-bold" style={hf}>{t('relatedLinks')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/learn/cosmology', label: { en: 'Cosmic Time Scales -- Yugas & Kalpas', hi: 'ब्रह्माण्डीय कालमान -- युग एवं कल्प', sa: 'ब्रह्माण्डीय कालमान -- युग एवं कल्प', mai: 'ब्रह्माण्डीय कालमान -- युग एवं कल्प', mr: 'ब्रह्माण्डीय कालमान -- युग एवं कल्प', ta: 'அண்ட கால அளவுகள் -- யுகங்கள் & கல்பங்கள்', te: 'విశ్వ కాల ప్రమాణాలు -- యుగాలు & కల్పాలు', bn: 'মহাজাগতিক সময়সীমা -- যুগ ও কল্প', kn: 'ಬ್ರಹ್ಮಾಂಡ ಕಾಲ ಮಾಪಕ -- ಯುಗಗಳು ಮತ್ತು ಕಲ್ಪಗಳು', gu: 'બ્રહ્માંડ કાળ માપ -- યુગ અને કલ્પ' } },
            { href: '/learn/vedanga', label: { en: 'Vedanga Jyotisha & Indian Astronomy', hi: 'वेदांग ज्योतिष एवं भारतीय खगोल', sa: 'वेदांग ज्योतिष एवं भारतीय खगोल', mai: 'वेदांग ज्योतिष एवं भारतीय खगोल', mr: 'वेदांग ज्योतिष एवं भारतीय खगोल', ta: 'வேதாங்க ஜோதிடம் & இந்திய வானியல்', te: 'వేదాంగ జ్యోతిషం & భారతీయ ఖగోళ శాస్త్రం', bn: 'বেদাঙ্গ জ্যোতিষ ও ভারতীয় জ্যোতির্বিদ্যা', kn: 'ವೇದಾಂಗ ಜ್ಯೋತಿಷ ಮತ್ತು ಭಾರತೀಯ ಖಗೋಳಶಾಸ್ತ್ರ', gu: 'વેદાંગ જ્યોતિષ અને ભારતીય ખગોળવિદ્યા' } },
            { href: '/learn/track/cosmology', label: { en: 'Cosmology Track', hi: 'ब्रह्माण्डविद्या ट्रैक', sa: 'ब्रह्माण्डविद्या ट्रैक', mai: 'ब्रह्माण्डविद्या ट्रैक', mr: 'ब्रह्माण्डविद्या ट्रैक', ta: 'அண்டவியல் பாதை', te: 'విశ్వోత్పత్తి ట్రాక్', bn: 'সৃষ্টিতত্ত্ব ট্র্যাক', kn: 'ವಿಶ್ವವಿಜ್ಞಾನ ಟ್ರ್ಯಾಕ್', gu: 'બ્રહ્માંડવિદ્યા ટ્રેક' } },
            { href: '/learn/dashas', label: { en: 'Dashas -- Planetary Periods', hi: 'दशा -- ग्रह काल', sa: 'दशा -- ग्रह काल', mai: 'दशा -- ग्रह काल', mr: 'दशा -- ग्रह काल', ta: 'தசைகள் -- கிரக காலங்கள்', te: 'దశలు -- గ్రహ కాలాలు', bn: 'দশা -- গ্রহ কাল', kn: 'ದಶೆಗಳು -- ಗ್ರಹ ಅವಧಿಗಳು', gu: 'દશાઓ -- ગ્રહ કાળ' } },
            { href: '/sade-sati', label: { en: 'Check Your Sade Sati', hi: 'अपनी साढ़े साती जाँचें', sa: 'अपनी साढ़े साती जाँचें', mai: 'अपनी साढ़े साती जाँचें', mr: 'अपनी साढ़े साती जाँचें', ta: 'உங்கள் சாடே சாதி சரிபார்க்கவும்', te: 'మీ సాడే సాతి తనిఖీ చేయండి', bn: 'আপনার সাড়ে সাতি পরীক্ষা করুন', kn: 'ನಿಮ್ಮ ಸಾಡೆ ಸಾತಿ ಪರಿಶೀಲಿಸಿ', gu: 'તમારી સાડા સાતી ચકાસો' } },
          ].map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500/8 to-transparent border border-indigo-500/12 hover:border-gold-primary/25 hover:bg-indigo-500/12 transition-all group"
            >
              <span className="text-text-primary text-sm group-hover:text-indigo-200 transition-colors" style={bf}>
                {isHi ? link.label.hi : link.label.en}
              </span>
              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-light transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
