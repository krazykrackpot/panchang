'use client';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/eclipses.json';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import EclipseAnimation from '@/components/learn/EclipseAnimation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';


/* ─── Eclipse types data ─── */
const ECLIPSE_TYPES = [
  {
    name: { en: 'Total Solar Eclipse', hi: 'पूर्ण सूर्य ग्रहण', sa: 'पूर्ण सूर्य ग्रहण', mai: 'पूर्ण सूर्य ग्रहण', mr: 'पूर्ण सूर्य ग्रहण', ta: 'Total Solar Eclipse', te: 'Total Solar Eclipse', bn: 'Total Solar Eclipse', kn: 'Total Solar Eclipse', gu: 'Total Solar Eclipse' },
    color: 'text-amber-300', border: 'border-amber-500/20', bg: 'bg-amber-500/5',
    symbol: '☀',
    condition: { en: 'Moon\'s disk completely covers the Sun. |β| < ~0.9°', hi: 'चन्द्र बिम्ब सूर्य को पूर्णतः ढकता है। |β| < ~0.9°' },
    desc: {
      en: 'The most spectacular celestial event. Day turns to night for up to ~7.5 minutes along the path of totality. The solar corona — the Sun\'s outer atmosphere — blazes into view. Stars appear in daytime. Moon must be near perigee (close to Earth) so its apparent disk is large enough to cover the Sun completely.',
      hi: 'सबसे शानदार खगोलीय घटना। पूर्णता के पथ पर ~7.5 मिनट तक दिन रात में बदल जाता है। सूर्य का बाहरी वायुमण्डल — कोरोना — दृश्यमान होता है। दिन में तारे दिखते हैं। चन्द्रमा उपभू के निकट होना चाहिए ताकि उसका प्रत्यक्ष बिम्ब सूर्य को पूर्णतः ढकने के लिए पर्याप्त बड़ा हो।',
    },
  },
  {
    name: { en: 'Annular Solar Eclipse', hi: 'कण्कण सूर्य ग्रहण', sa: 'कण्कण सूर्य ग्रहण', mai: 'कण्कण सूर्य ग्रहण', mr: 'कण्कण सूर्य ग्रहण', ta: 'Annular Solar Eclipse', te: 'Annular Solar Eclipse', bn: 'Annular Solar Eclipse', kn: 'Annular Solar Eclipse', gu: 'Annular Solar Eclipse' },
    color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5',
    symbol: '⊙',
    condition: { en: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', hi: 'चन्द्रमा अपभू के निकट — प्रत्यक्ष बिम्ब सूर्य से छोटा। अग्नि-वलय दृश्यमान।', sa: 'चन्द्रमा अपभू के निकट — प्रत्यक्ष बिम्ब सूर्य से छोटा। अग्नि-वलय दृश्यमान।', mai: 'चन्द्रमा अपभू के निकट — प्रत्यक्ष बिम्ब सूर्य से छोटा। अग्नि-वलय दृश्यमान।', mr: 'चन्द्रमा अपभू के निकट — प्रत्यक्ष बिम्ब सूर्य से छोटा। अग्नि-वलय दृश्यमान।', ta: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', te: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', bn: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', kn: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', gu: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.' },
    desc: {
      en: 'The Moon covers the Sun\'s centre but its apparent diameter is slightly smaller (Moon is near apogee — far from Earth), leaving a brilliant ring of sunlight around the dark lunar disk. Annular eclipses produce no corona-viewing opportunity, but the "ring of fire" is striking. They are more frequent than total solar eclipses because the Moon spends more time near apogee.',
      hi: 'चन्द्रमा सूर्य के केन्द्र को ढकता है परन्तु उसका प्रत्यक्ष व्यास थोड़ा छोटा होता है (चन्द्रमा अपभू के निकट — पृथ्वी से दूर), जिससे अँधेरे चन्द्र बिम्ब के चारों ओर सूर्य के प्रकाश की एक तेजस्वी वलय रहती है।',
    },
  },
  {
    name: { en: 'Partial Solar Eclipse', hi: 'आंशिक सूर्य ग्रहण', sa: 'आंशिक सूर्य ग्रहण', mai: 'आंशिक सूर्य ग्रहण', mr: 'आंशिक सूर्य ग्रहण', ta: 'Partial Solar Eclipse', te: 'Partial Solar Eclipse', bn: 'Partial Solar Eclipse', kn: 'Partial Solar Eclipse', gu: 'Partial Solar Eclipse' },
    color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5',
    symbol: '◑',
    condition: { en: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', hi: 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। 0.9° < |β| < ~1.6°', sa: 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। 0.9° < |β| < ~1.6°', mai: 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। 0.9° < |β| < ~1.6°', mr: 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। 0.9° < |β| < ~1.6°', ta: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', te: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', bn: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', kn: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', gu: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°' },
    desc: {
      en: 'The Moon passes across only a part of the Sun\'s disk. The penumbra (partial shadow) sweeps a wide region on either side of the central path. A partial solar eclipse is visible over a much larger geographic area than a total or annular eclipse. At maximum, the Sun appears as a crescent.',
      hi: 'चन्द्रमा केवल सूर्य के बिम्ब के एक भाग को पार करता है। उपछाया (आंशिक छाया) केन्द्रीय पथ के दोनों ओर एक विस्तृत क्षेत्र में फैलती है। आंशिक सूर्य ग्रहण पूर्ण या कण्कण ग्रहण की तुलना में बहुत बड़े भौगोलिक क्षेत्र में दृश्यमान होता है।',
    },
  },
  {
    name: { en: 'Total Lunar Eclipse (Blood Moon)', hi: 'पूर्ण चन्द्र ग्रहण (रक्त चन्द्र)', sa: 'पूर्ण चन्द्र ग्रहण (रक्त चन्द्र)', mai: 'पूर्ण चन्द्र ग्रहण (रक्त चन्द्र)', mr: 'पूर्ण चन्द्र ग्रहण (रक्त चन्द्र)', ta: 'Total Lunar Eclipse (Blood Moon)', te: 'Total Lunar Eclipse (Blood Moon)', bn: 'Total Lunar Eclipse (Blood Moon)', kn: 'Total Lunar Eclipse (Blood Moon)', gu: 'Total Lunar Eclipse (Blood Moon)' },
    color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5',
    symbol: '🌑',
    condition: { en: 'Moon fully inside Earth\'s umbral shadow. |β| < ~0.5°', hi: 'चन्द्रमा पृथ्वी की उपछाया में पूर्णतः। |β| < ~0.5°' },
    desc: {
      en: 'The Moon passes completely into the darkest part of Earth\'s shadow (umbra). The Moon does not go dark — instead it turns deep red or copper-orange. Earth\'s atmosphere refracts sunlight, bending red wavelengths (which scatter least) around the planet and onto the Moon. The exact colour depends on atmospheric conditions: clear air produces a bright orange-red; heavy volcanic dust can make the Moon nearly black.',
      hi: 'चन्द्रमा पृथ्वी की छाया (उपछाया) के सबसे अँधेरे भाग में पूरी तरह प्रवेश करता है। चन्द्रमा काला नहीं होता — बल्कि गहरे लाल या ताम्र-नारंगी रंग में बदल जाता है। पृथ्वी का वायुमण्डल सूर्यप्रकाश को अपवर्तित करता है, लाल तरंगदैर्घ्य को ग्रह के चारों ओर चन्द्रमा पर मोड़ता है।',
    },
  },
  {
    name: { en: 'Partial Lunar Eclipse', hi: 'आंशिक चन्द्र ग्रहण', sa: 'आंशिक चन्द्र ग्रहण', mai: 'आंशिक चन्द्र ग्रहण', mr: 'आंशिक चन्द्र ग्रहण', ta: 'Partial Lunar Eclipse', te: 'Partial Lunar Eclipse', bn: 'Partial Lunar Eclipse', kn: 'Partial Lunar Eclipse', gu: 'Partial Lunar Eclipse' },
    color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5',
    symbol: '◑',
    condition: { en: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', hi: 'चन्द्रमा आंशिक रूप से उपछाया में प्रवेश करता है। 0.5° < |β| < ~1.0°', sa: 'चन्द्रमा आंशिक रूप से उपछाया में प्रवेश करता है। 0.5° < |β| < ~1.0°', mai: 'चन्द्रमा आंशिक रूप से उपछाया में प्रवेश करता है। 0.5° < |β| < ~1.0°', mr: 'चन्द्रमा आंशिक रूप से उपछाया में प्रवेश करता है। 0.5° < |β| < ~1.0°', ta: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', te: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', bn: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', kn: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', gu: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°' },
    desc: {
      en: 'Only part of the Moon enters Earth\'s umbral (dark inner) shadow. The umbral portion takes on a reddish-brown hue while the rest of the Moon remains its normal colour. The boundary between the lit and shadowed parts is visibly curved, demonstrating Earth\'s spherical shape — an observation known to ancient Indian astronomers.',
      hi: 'चन्द्रमा का केवल एक भाग पृथ्वी की उपछाया (गहरी आन्तरिक छाया) में प्रवेश करता है। उपछाया वाला भाग लाल-भूरा रंग लेता है जबकि शेष चन्द्रमा अपने सामान्य रंग में रहता है।',
    },
  },
  {
    name: { en: 'Penumbral Lunar Eclipse', hi: 'उपछाया चन्द्र ग्रहण', sa: 'उपछाया चन्द्र ग्रहण', mai: 'उपछाया चन्द्र ग्रहण', mr: 'उपछाया चन्द्र ग्रहण', ta: 'Penumbral Lunar Eclipse', te: 'Penumbral Lunar Eclipse', bn: 'Penumbral Lunar Eclipse', kn: 'Penumbral Lunar Eclipse', gu: 'Penumbral Lunar Eclipse' },
    color: 'text-slate-400', border: 'border-slate-500/20', bg: 'bg-slate-500/5',
    symbol: '○',
    condition: { en: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', hi: 'चन्द्रमा केवल उपच्छाया में प्रवेश करता है। 1.0° < |β| < ~1.6°', sa: 'चन्द्रमा केवल उपच्छाया में प्रवेश करता है। 1.0° < |β| < ~1.6°', mai: 'चन्द्रमा केवल उपच्छाया में प्रवेश करता है। 1.0° < |β| < ~1.6°', mr: 'चन्द्रमा केवल उपच्छाया में प्रवेश करता है। 1.0° < |β| < ~1.6°', ta: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', te: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', bn: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', kn: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', gu: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°' },
    desc: {
      en: 'The Moon passes through Earth\'s outer penumbral shadow — a region of partial sunlight, not total blockage. The dimming is subtle and often imperceptible to the naked eye except near maximum phase when the Moon\'s limb closest to the umbra may look slightly dusky. Not listed in most Panchang sutak observances because there is no visible "biting" of the Moon.',
      hi: 'चन्द्रमा पृथ्वी की बाहरी उपच्छाया से गुज़रता है — आंशिक सूर्यप्रकाश का क्षेत्र, पूर्ण अवरोध नहीं। मंद होना सूक्ष्म होता है और अधिकतम चरण के निकट को छोड़कर नग्न आँखों से अक्सर अगोचर होता है।',
    },
  },
];

/* ─── Eclipse phases ─── */
const PHASES = [
  {
    sanskrit: 'स्पर्श (Sparsha)',
    name: { en: 'First Contact', hi: 'प्रथम सम्पर्क', sa: 'प्रथम सम्पर्क', mai: 'प्रथम सम्पर्क', mr: 'प्रथम सम्पर्क', ta: 'First Contact', te: 'First Contact', bn: 'First Contact', kn: 'First Contact', gu: 'First Contact' },
    code: 'P1 / C1',
    desc: { en: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', hi: 'छाया सबसे पहले ज्योतिर्मय को स्पर्श करती है। यहीं से सूतक काल की गणना पारम्परिक रूप से की जाती है।', sa: 'छाया सबसे पहले ज्योतिर्मय को स्पर्श करती है। यहीं से सूतक काल की गणना पारम्परिक रूप से की जाती है।', mai: 'छाया सबसे पहले ज्योतिर्मय को स्पर्श करती है। यहीं से सूतक काल की गणना पारम्परिक रूप से की जाती है।', mr: 'छाया सबसे पहले ज्योतिर्मय को स्पर्श करती है। यहीं से सूतक काल की गणना पारम्परिक रूप से की जाती है।', ta: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', te: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', bn: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', kn: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', gu: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).' },
  },
  {
    sanskrit: 'खग्रास (Khagras)',
    name: { en: 'Totality Begins', hi: 'पूर्णता आरम्भ', sa: 'पूर्णता आरम्भ', mai: 'पूर्णता आरम्भ', mr: 'पूर्णता आरम्भ', ta: 'Totality Begins', te: 'Totality Begins', bn: 'Totality Begins', kn: 'Totality Begins', gu: 'Totality Begins' },
    code: 'U1 / C2',
    desc: { en: 'Moon fully enters the umbral shadow (U1 for lunar) or Moon\'s disk fully covers the Sun (C2 for solar). Only for total/annular eclipses. The Khagras moment is recorded in classical texts as the deepest ritual restriction.', hi: 'चन्द्रमा पूर्णतः उपछाया में प्रवेश करता है (U1 चन्द्र के लिए) या चन्द्र बिम्ब सूर्य को पूर्णतः ढकता है (C2 सूर्य के लिए)। केवल पूर्ण/कण्कण ग्रहणों के लिए।' },
  },
  {
    sanskrit: 'मध्य (Madhya)',
    name: { en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'अधिकतम ग्रहण', mai: 'अधिकतम ग्रहण', mr: 'अधिकतम ग्रहण', ta: 'Maximum Eclipse', te: 'Maximum Eclipse', bn: 'Maximum Eclipse', kn: 'Maximum Eclipse', gu: 'Maximum Eclipse' },
    code: 'Max',
    desc: { en: 'The deepest point of the eclipse — when the shadow\'s centre is nearest to the Moon (lunar) or when the Moon\'s centre is nearest to the Sun\'s centre (solar). This is the moment of greatest spiritual intensity in Vedic tradition.', hi: 'ग्रहण का सबसे गहरा बिन्दु — जब छाया का केन्द्र चन्द्रमा (चन्द्र) के निकटतम हो या जब चन्द्र का केन्द्र सूर्य के केन्द्र के निकटतम हो (सूर्य)।' },
  },
  {
    sanskrit: 'मोक्ष (Moksha)',
    name: { en: 'Last Contact', hi: 'अन्तिम सम्पर्क', sa: 'अन्तिम सम्पर्क', mai: 'अन्तिम सम्पर्क', mr: 'अन्तिम सम्पर्क', ta: 'Last Contact', te: 'Last Contact', bn: 'Last Contact', kn: 'Last Contact', gu: 'Last Contact' },
    code: 'P4 / C4',
    desc: { en: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', hi: 'छाया ज्योतिर्मय को पूर्णतः छोड़ देती है। ग्रहण पूर्ण होता है। यह स्नान, सूतक समाप्ति और ग्रहण-पूर्णता अनुष्ठानों का क्षण है। मोक्ष नाम सामान्य पवित्र समय की वापसी का संकेत देता है।', sa: 'छाया ज्योतिर्मय को पूर्णतः छोड़ देती है। ग्रहण पूर्ण होता है। यह स्नान, सूतक समाप्ति और ग्रहण-पूर्णता अनुष्ठानों का क्षण है। मोक्ष नाम सामान्य पवित्र समय की वापसी का संकेत देता है।', mai: 'छाया ज्योतिर्मय को पूर्णतः छोड़ देती है। ग्रहण पूर्ण होता है। यह स्नान, सूतक समाप्ति और ग्रहण-पूर्णता अनुष्ठानों का क्षण है। मोक्ष नाम सामान्य पवित्र समय की वापसी का संकेत देता है।', mr: 'छाया ज्योतिर्मय को पूर्णतः छोड़ देती है। ग्रहण पूर्ण होता है। यह स्नान, सूतक समाप्ति और ग्रहण-पूर्णता अनुष्ठानों का क्षण है। मोक्ष नाम सामान्य पवित्र समय की वापसी का संकेत देता है।', ta: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', te: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', bn: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', kn: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', gu: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.' },
  },
];

/* ─── Sutak data ─── */
const SUTAK_SOURCES = [
  {
    text: { en: 'Dharmasindhu', hi: 'धर्मसिन्धु', sa: 'धर्मसिन्धु', mai: 'धर्मसिन्धु', mr: 'धर्मसिन्धु', ta: 'Dharmasindhu', te: 'Dharmasindhu', bn: 'Dharmasindhu', kn: 'Dharmasindhu', gu: 'Dharmasindhu' },
    solar: { en: '4 day-prahars (~12 hours, scales with season)', hi: '4 दिन-प्रहर (~12 घण्टे, मौसम के साथ बदलता है)', sa: '4 दिन-प्रहर (~12 घण्टे, मौसम के साथ बदलता है)', mai: '4 दिन-प्रहर (~12 घण्टे, मौसम के साथ बदलता है)', mr: '4 दिन-प्रहर (~12 घण्टे, मौसम के साथ बदलता है)', ta: '4 day-prahars (~12 hours, scales with season)', te: '4 day-prahars (~12 hours, scales with season)', bn: '4 day-prahars (~12 hours, scales with season)', kn: '4 day-prahars (~12 hours, scales with season)', gu: '4 day-prahars (~12 hours, scales with season)' },
    lunar: { en: '3 night-prahars (~9 hours, scales with season)', hi: '3 रात-प्रहर (~9 घण्टे, मौसम के साथ बदलता है)', sa: '3 रात-प्रहर (~9 घण्टे, मौसम के साथ बदलता है)', mai: '3 रात-प्रहर (~9 घण्टे, मौसम के साथ बदलता है)', mr: '3 रात-प्रहर (~9 घण्टे, मौसम के साथ बदलता है)', ta: '3 night-prahars (~9 hours, scales with season)', te: '3 night-prahars (~9 hours, scales with season)', bn: '3 night-prahars (~9 hours, scales with season)', kn: '3 night-prahars (~9 hours, scales with season)', gu: '3 night-prahars (~9 hours, scales with season)' },
    color: 'text-amber-400',
  },
  {
    text: { en: 'Nirnaya Sindhu', hi: 'निर्णय सिन्धु', sa: 'निर्णय सिन्धु', mai: 'निर्णय सिन्धु', mr: 'निर्णय सिन्धु', ta: 'Nirnaya Sindhu', te: 'Nirnaya Sindhu', bn: 'Nirnaya Sindhu', kn: 'Nirnaya Sindhu', gu: 'Nirnaya Sindhu' },
    solar: { en: 'Fixed 12 hours before eclipse', hi: 'ग्रहण से ठीक 12 घण्टे पहले', sa: 'ग्रहण से ठीक 12 घण्टे पहले', mai: 'ग्रहण से ठीक 12 घण्टे पहले', mr: 'ग्रहण से ठीक 12 घण्टे पहले', ta: 'Fixed 12 hours before eclipse', te: 'Fixed 12 hours before eclipse', bn: 'Fixed 12 hours before eclipse', kn: 'Fixed 12 hours before eclipse', gu: 'Fixed 12 hours before eclipse' },
    lunar: { en: 'Fixed 9 hours before eclipse', hi: 'ग्रहण से ठीक 9 घण्टे पहले', sa: 'ग्रहण से ठीक 9 घण्टे पहले', mai: 'ग्रहण से ठीक 9 घण्टे पहले', mr: 'ग्रहण से ठीक 9 घण्टे पहले', ta: 'Fixed 9 hours before eclipse', te: 'Fixed 9 hours before eclipse', bn: 'Fixed 9 hours before eclipse', kn: 'Fixed 9 hours before eclipse', gu: 'Fixed 9 hours before eclipse' },
    color: 'text-blue-300',
  },
  {
    text: { en: 'Muhurta Chintamani', hi: 'मुहूर्त चिन्तामणि', sa: 'मुहूर्त चिन्तामणि', mai: 'मुहूर्त चिन्तामणि', mr: 'मुहूर्त चिन्तामणि', ta: 'Muhurta Chintamani', te: 'Muhurta Chintamani', bn: 'Muhurta Chintamani', kn: 'Muhurta Chintamani', gu: 'Muhurta Chintamani' },
    solar: { en: 'From sunrise on the eclipse day', hi: 'ग्रहण के दिन सूर्योदय से', sa: 'ग्रहण के दिन सूर्योदय से', mai: 'ग्रहण के दिन सूर्योदय से', mr: 'ग्रहण के दिन सूर्योदय से', ta: 'From sunrise on the eclipse day', te: 'From sunrise on the eclipse day', bn: 'From sunrise on the eclipse day', kn: 'From sunrise on the eclipse day', gu: 'From sunrise on the eclipse day' },
    lunar: { en: 'From sunrise on the eclipse day', hi: 'ग्रहण के दिन सूर्योदय से', sa: 'ग्रहण के दिन सूर्योदय से', mai: 'ग्रहण के दिन सूर्योदय से', mr: 'ग्रहण के दिन सूर्योदय से', ta: 'From sunrise on the eclipse day', te: 'From sunrise on the eclipse day', bn: 'From sunrise on the eclipse day', kn: 'From sunrise on the eclipse day', gu: 'From sunrise on the eclipse day' },
    color: 'text-violet-400',
  },
];

const SUTAK_DO = [
  { en: 'Chanting of mantras, japa, prayer', hi: 'मन्त्र जाप, प्रार्थना', sa: 'मन्त्र जाप, प्रार्थना', mai: 'मन्त्र जाप, प्रार्थना', mr: 'मन्त्र जाप, प्रार्थना', ta: 'Chanting of mantras, japa, prayer', te: 'Chanting of mantras, japa, prayer', bn: 'Chanting of mantras, japa, prayer', kn: 'Chanting of mantras, japa, prayer', gu: 'Chanting of mantras, japa, prayer' },
  { en: 'Reading scriptures (Gita, Upanishads, Ramayana)', hi: 'शास्त्र पाठ (गीता, उपनिषद, रामायण)', sa: 'शास्त्र पाठ (गीता, उपनिषद, रामायण)', mai: 'शास्त्र पाठ (गीता, उपनिषद, रामायण)', mr: 'शास्त्र पाठ (गीता, उपनिषद, रामायण)', ta: 'Reading scriptures (Gita, Upanishads, Ramayana)', te: 'Reading scriptures (Gita, Upanishads, Ramayana)', bn: 'Reading scriptures (Gita, Upanishads, Ramayana)', kn: 'Reading scriptures (Gita, Upanishads, Ramayana)', gu: 'Reading scriptures (Gita, Upanishads, Ramayana)' },
  { en: 'Meditation and pranayama', hi: 'ध्यान और प्राणायाम', sa: 'ध्यान और प्राणायाम', mai: 'ध्यान और प्राणायाम', mr: 'ध्यान और प्राणायाम', ta: 'Meditation and pranayama', te: 'Meditation and pranayama', bn: 'Meditation and pranayama', kn: 'Meditation and pranayama', gu: 'Meditation and pranayama' },
  { en: 'Giving charity and donations', hi: 'दान-दक्षिणा देना', sa: 'दान-दक्षिणा देना', mai: 'दान-दक्षिणा देना', mr: 'दान-दक्षिणा देना', ta: 'Giving charity and donations', te: 'Giving charity and donations', bn: 'Giving charity and donations', kn: 'Giving charity and donations', gu: 'Giving charity and donations' },
  { en: 'Ritual bath at eclipse end (Moksha snan)', hi: 'ग्रहण मोक्ष पर स्नान', sa: 'ग्रहण मोक्ष पर स्नान', mai: 'ग्रहण मोक्ष पर स्नान', mr: 'ग्रहण मोक्ष पर स्नान', ta: 'Ritual bath at eclipse end (Moksha snan)', te: 'Ritual bath at eclipse end (Moksha snan)', bn: 'Ritual bath at eclipse end (Moksha snan)', kn: 'Ritual bath at eclipse end (Moksha snan)', gu: 'Ritual bath at eclipse end (Moksha snan)' },
  { en: 'Worshipping the deity on whose day the eclipse falls', hi: 'जिस देवता का दिन हो उनकी पूजा', sa: 'जिस देवता का दिन हो उनकी पूजा', mai: 'जिस देवता का दिन हो उनकी पूजा', mr: 'जिस देवता का दिन हो उनकी पूजा', ta: 'Worshipping the deity on whose day the eclipse falls', te: 'Worshipping the deity on whose day the eclipse falls', bn: 'Worshipping the deity on whose day the eclipse falls', kn: 'Worshipping the deity on whose day the eclipse falls', gu: 'Worshipping the deity on whose day the eclipse falls' },
];

const SUTAK_AVOID = [
  { en: 'Eating food prepared before Sutak began', hi: 'सूतक से पहले बना खाना खाना', sa: 'सूतक से पहले बना खाना खाना', mai: 'सूतक से पहले बना खाना खाना', mr: 'सूतक से पहले बना खाना खाना', ta: 'Eating food prepared before Sutak began', te: 'Eating food prepared before Sutak began', bn: 'Eating food prepared before Sutak began', kn: 'Eating food prepared before Sutak began', gu: 'Eating food prepared before Sutak began' },
  { en: 'Starting new ventures, signing contracts', hi: 'नए कार्य आरम्भ, अनुबंध पर हस्ताक्षर', sa: 'नए कार्य आरम्भ, अनुबंध पर हस्ताक्षर', mai: 'नए कार्य आरम्भ, अनुबंध पर हस्ताक्षर', mr: 'नए कार्य आरम्भ, अनुबंध पर हस्ताक्षर', ta: 'Starting new ventures, signing contracts', te: 'Starting new ventures, signing contracts', bn: 'Starting new ventures, signing contracts', kn: 'Starting new ventures, signing contracts', gu: 'Starting new ventures, signing contracts' },
  { en: 'Marriage, griha pravesh, sacred thread ceremony', hi: 'विवाह, गृह प्रवेश, यज्ञोपवीत संस्कार', sa: 'विवाह, गृह प्रवेश, यज्ञोपवीत संस्कार', mai: 'विवाह, गृह प्रवेश, यज्ञोपवीत संस्कार', mr: 'विवाह, गृह प्रवेश, यज्ञोपवीत संस्कार', ta: 'Marriage, griha pravesh, sacred thread ceremony', te: 'Marriage, griha pravesh, sacred thread ceremony', bn: 'Marriage, griha pravesh, sacred thread ceremony', kn: 'Marriage, griha pravesh, sacred thread ceremony', gu: 'Marriage, griha pravesh, sacred thread ceremony' },
  { en: 'Sleeping (considered inauspicious during eclipse)', hi: 'सोना (ग्रहण के दौरान अशुभ माना जाता है)', sa: 'सोना (ग्रहण के दौरान अशुभ माना जाता है)', mai: 'सोना (ग्रहण के दौरान अशुभ माना जाता है)', mr: 'सोना (ग्रहण के दौरान अशुभ माना जाता है)', ta: 'Sleeping (considered inauspicious during eclipse)', te: 'Sleeping (considered inauspicious during eclipse)', bn: 'Sleeping (considered inauspicious during eclipse)', kn: 'Sleeping (considered inauspicious during eclipse)', gu: 'Sleeping (considered inauspicious during eclipse)' },
  { en: 'Sexual activity', hi: 'यौन सम्बन्ध', sa: 'यौन सम्बन्ध', mai: 'यौन सम्बन्ध', mr: 'यौन सम्बन्ध', ta: 'Sexual activity', te: 'Sexual activity', bn: 'Sexual activity', kn: 'Sexual activity', gu: 'Sexual activity' },
  { en: 'Cutting hair, nails', hi: 'बाल, नाखून काटना', sa: 'बाल, नाखून काटना', mai: 'बाल, नाखून काटना', mr: 'बाल, नाखून काटना', ta: 'Cutting hair, nails', te: 'Cutting hair, nails', bn: 'Cutting hair, nails', kn: 'Cutting hair, nails', gu: 'Cutting hair, nails' },
];

/* ─── Kundali eclipse effects ─── */
const KUNDALI_EFFECTS = [
  {
    situation: { en: 'Eclipse conjunct natal Sun', hi: 'जन्म सूर्य पर ग्रहण', sa: 'जन्म सूर्य पर ग्रहण', mai: 'जन्म सूर्य पर ग्रहण', mr: 'जन्म सूर्य पर ग्रहण', ta: 'Eclipse conjunct natal Sun', te: 'Eclipse conjunct natal Sun', bn: 'Eclipse conjunct natal Sun', kn: 'Eclipse conjunct natal Sun', gu: 'Eclipse conjunct natal Sun' },
    effect: { en: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', hi: 'पहचान, करियर, अधिकार का परिवर्तन। पिता-सम्बन्धी विषय। नेतृत्व परिवर्तन। आत्म-परिभाषा के लिए महत्वपूर्ण वर्ष।', sa: 'पहचान, करियर, अधिकार का परिवर्तन। पिता-सम्बन्धी विषय। नेतृत्व परिवर्तन। आत्म-परिभाषा के लिए महत्वपूर्ण वर्ष।', mai: 'पहचान, करियर, अधिकार का परिवर्तन। पिता-सम्बन्धी विषय। नेतृत्व परिवर्तन। आत्म-परिभाषा के लिए महत्वपूर्ण वर्ष।', mr: 'पहचान, करियर, अधिकार का परिवर्तन। पिता-सम्बन्धी विषय। नेतृत्व परिवर्तन। आत्म-परिभाषा के लिए महत्वपूर्ण वर्ष।', ta: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', te: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', bn: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', kn: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', gu: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.' },
    color: 'text-amber-300',
  },
  {
    situation: { en: 'Eclipse conjunct natal Moon', hi: 'जन्म चन्द्र पर ग्रहण', sa: 'जन्म चन्द्र पर ग्रहण', mai: 'जन्म चन्द्र पर ग्रहण', mr: 'जन्म चन्द्र पर ग्रहण', ta: 'Eclipse conjunct natal Moon', te: 'Eclipse conjunct natal Moon', bn: 'Eclipse conjunct natal Moon', kn: 'Eclipse conjunct natal Moon', gu: 'Eclipse conjunct natal Moon' },
    effect: { en: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', hi: 'भावनात्मक उथल-पुथल या सफलता। घर, माँ, सार्वजनिक प्रतिष्ठा में परिवर्तन। आन्तरिक जगत का पुनर्संरेखण।', sa: 'भावनात्मक उथल-पुथल या सफलता। घर, माँ, सार्वजनिक प्रतिष्ठा में परिवर्तन। आन्तरिक जगत का पुनर्संरेखण।', mai: 'भावनात्मक उथल-पुथल या सफलता। घर, माँ, सार्वजनिक प्रतिष्ठा में परिवर्तन। आन्तरिक जगत का पुनर्संरेखण।', mr: 'भावनात्मक उथल-पुथल या सफलता। घर, माँ, सार्वजनिक प्रतिष्ठा में परिवर्तन। आन्तरिक जगत का पुनर्संरेखण।', ta: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', te: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', bn: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', kn: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', gu: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.' },
    color: 'text-blue-300',
  },
  {
    situation: { en: 'Eclipse on natal Rahu/Ketu axis', hi: 'जन्म राहु/केतु अक्ष पर ग्रहण', sa: 'जन्म राहु/केतु अक्ष पर ग्रहण', mai: 'जन्म राहु/केतु अक्ष पर ग्रहण', mr: 'जन्म राहु/केतु अक्ष पर ग्रहण', ta: 'Eclipse on natal Rahu/Ketu axis', te: 'Eclipse on natal Rahu/Ketu axis', bn: 'Eclipse on natal Rahu/Ketu axis', kn: 'Eclipse on natal Rahu/Ketu axis', gu: 'Eclipse on natal Rahu/Ketu axis' },
    effect: { en: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', hi: 'प्रमुख कार्मिक रीसेट। पूर्वजन्म के पैटर्न समाधान के लिए उभरते हैं। जीवन की दिशा में अचानक परिवर्तन। सबसे भाग्य-निर्धारित ग्रहण सम्पर्क।', sa: 'प्रमुख कार्मिक रीसेट। पूर्वजन्म के पैटर्न समाधान के लिए उभरते हैं। जीवन की दिशा में अचानक परिवर्तन। सबसे भाग्य-निर्धारित ग्रहण सम्पर्क।', mai: 'प्रमुख कार्मिक रीसेट। पूर्वजन्म के पैटर्न समाधान के लिए उभरते हैं। जीवन की दिशा में अचानक परिवर्तन। सबसे भाग्य-निर्धारित ग्रहण सम्पर्क।', mr: 'प्रमुख कार्मिक रीसेट। पूर्वजन्म के पैटर्न समाधान के लिए उभरते हैं। जीवन की दिशा में अचानक परिवर्तन। सबसे भाग्य-निर्धारित ग्रहण सम्पर्क।', ta: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', te: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', bn: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', kn: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', gu: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.' },
    color: 'text-violet-400',
  },
  {
    situation: { en: 'Eclipse on natal Ascendant (Lagna)', hi: 'जन्म लग्न पर ग्रहण', sa: 'जन्म लग्न पर ग्रहण', mai: 'जन्म लग्न पर ग्रहण', mr: 'जन्म लग्न पर ग्रहण', ta: 'Eclipse on natal Ascendant (Lagna)', te: 'Eclipse on natal Ascendant (Lagna)', bn: 'Eclipse on natal Ascendant (Lagna)', kn: 'Eclipse on natal Ascendant (Lagna)', gu: 'Eclipse on natal Ascendant (Lagna)' },
    effect: { en: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', hi: 'शारीरिक उपस्थिति, स्वास्थ्य और समग्र जीवन दिशा में परिवर्तन। एक नया अध्याय आरम्भ होता है। पहचान मौलिक स्तर पर बदलती है।', sa: 'शारीरिक उपस्थिति, स्वास्थ्य और समग्र जीवन दिशा में परिवर्तन। एक नया अध्याय आरम्भ होता है। पहचान मौलिक स्तर पर बदलती है।', mai: 'शारीरिक उपस्थिति, स्वास्थ्य और समग्र जीवन दिशा में परिवर्तन। एक नया अध्याय आरम्भ होता है। पहचान मौलिक स्तर पर बदलती है।', mr: 'शारीरिक उपस्थिति, स्वास्थ्य और समग्र जीवन दिशा में परिवर्तन। एक नया अध्याय आरम्भ होता है। पहचान मौलिक स्तर पर बदलती है।', ta: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', te: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', bn: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', kn: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', gu: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.' },
    color: 'text-emerald-400',
  },
  {
    situation: { en: 'Eclipse activating a house (no natal planet)', hi: 'भाव में ग्रहण (बिना जन्म ग्रह)', sa: 'भाव में ग्रहण (बिना जन्म ग्रह)', mai: 'भाव में ग्रहण (बिना जन्म ग्रह)', mr: 'भाव में ग्रहण (बिना जन्म ग्रह)', ta: 'Eclipse activating a house (no natal planet)', te: 'Eclipse activating a house (no natal planet)', bn: 'Eclipse activating a house (no natal planet)', kn: 'Eclipse activating a house (no natal planet)', gu: 'Eclipse activating a house (no natal planet)' },
    effect: { en: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', hi: 'उस भाव द्वारा शासित जीवन क्षेत्र में घटनाएँ: पहला = शरीर, दूसरा = धन, चौथा = घर, सातवाँ = सम्बन्ध, दसवाँ = करियर।', sa: 'उस भाव द्वारा शासित जीवन क्षेत्र में घटनाएँ: पहला = शरीर, दूसरा = धन, चौथा = घर, सातवाँ = सम्बन्ध, दसवाँ = करियर।', mai: 'उस भाव द्वारा शासित जीवन क्षेत्र में घटनाएँ: पहला = शरीर, दूसरा = धन, चौथा = घर, सातवाँ = सम्बन्ध, दसवाँ = करियर।', mr: 'उस भाव द्वारा शासित जीवन क्षेत्र में घटनाएँ: पहला = शरीर, दूसरा = धन, चौथा = घर, सातवाँ = सम्बन्ध, दसवाँ = करियर।', ta: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', te: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', bn: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', kn: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', gu: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.' },
    color: 'text-text-secondary',
  },
  {
    situation: { en: 'Solar eclipse near natal birthday', hi: 'जन्मदिन के निकट सूर्य ग्रहण', sa: 'जन्मदिन के निकट सूर्य ग्रहण', mai: 'जन्मदिन के निकट सूर्य ग्रहण', mr: 'जन्मदिन के निकट सूर्य ग्रहण', ta: 'Solar eclipse near natal birthday', te: 'Solar eclipse near natal birthday', bn: 'Solar eclipse near natal birthday', kn: 'Solar eclipse near natal birthday', gu: 'Solar eclipse near natal birthday' },
    effect: { en: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', hi: 'परिवर्तनकारी सोलर रिटर्न वर्ष। ग्रहण पर निर्धारित विषय अगले वर्ष सक्रिय होते हैं। वर्ष में तीव्र, भाग्य-निर्मित गुणवत्ता होती है।', sa: 'परिवर्तनकारी सोलर रिटर्न वर्ष। ग्रहण पर निर्धारित विषय अगले वर्ष सक्रिय होते हैं। वर्ष में तीव्र, भाग्य-निर्मित गुणवत्ता होती है।', mai: 'परिवर्तनकारी सोलर रिटर्न वर्ष। ग्रहण पर निर्धारित विषय अगले वर्ष सक्रिय होते हैं। वर्ष में तीव्र, भाग्य-निर्मित गुणवत्ता होती है।', mr: 'परिवर्तनकारी सोलर रिटर्न वर्ष। ग्रहण पर निर्धारित विषय अगले वर्ष सक्रिय होते हैं। वर्ष में तीव्र, भाग्य-निर्मित गुणवत्ता होती है।', ta: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', te: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', bn: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', kn: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', gu: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.' },
    color: 'text-gold-light',
  },
];

/* ─── Cross references ─── */
const CROSS_REFS = [
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण कैलेण्डर', sa: 'ग्रहण कैलेण्डर', mai: 'ग्रहण कैलेण्डर', mr: 'ग्रहण कैलेण्डर', ta: 'Eclipse Calendar', te: 'Eclipse Calendar', bn: 'Eclipse Calendar', kn: 'Eclipse Calendar', gu: 'Eclipse Calendar' }, desc: { en: 'All upcoming solar & lunar eclipses with timings', hi: 'सभी आगामी सूर्य और चन्द्र ग्रहण समय के साथ', sa: 'सभी आगामी सूर्य और चन्द्र ग्रहण समय के साथ', mai: 'सभी आगामी सूर्य और चन्द्र ग्रहण समय के साथ', mr: 'सभी आगामी सूर्य और चन्द्र ग्रहण समय के साथ', ta: 'All upcoming solar & lunar eclipses with timings', te: 'All upcoming solar & lunar eclipses with timings', bn: 'All upcoming solar & lunar eclipses with timings', kn: 'All upcoming solar & lunar eclipses with timings', gu: 'All upcoming solar & lunar eclipses with timings' } },
  { href: '/learn/tithis', label: { en: 'Tithis', hi: 'तिथि', sa: 'तिथि', mai: 'तिथि', mr: 'तिथि', ta: 'Tithis', te: 'Tithis', bn: 'Tithis', kn: 'Tithis', gu: 'Tithis' }, desc: { en: 'Amavasya & Purnima — the lunations that can produce eclipses', hi: 'अमावस्या और पूर्णिमा — ग्रहण उत्पन्न करने वाली तिथियाँ', sa: 'अमावस्या और पूर्णिमा — ग्रहण उत्पन्न करने वाली तिथियाँ', mai: 'अमावस्या और पूर्णिमा — ग्रहण उत्पन्न करने वाली तिथियाँ', mr: 'अमावस्या और पूर्णिमा — ग्रहण उत्पन्न करने वाली तिथियाँ', ta: 'Amavasya & Purnima — the lunations that can produce eclipses', te: 'Amavasya & Purnima — the lunations that can produce eclipses', bn: 'Amavasya & Purnima — the lunations that can produce eclipses', kn: 'Amavasya & Purnima — the lunations that can produce eclipses', gu: 'Amavasya & Purnima — the lunations that can produce eclipses' } },
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्र', mai: 'नक्षत्र', mr: 'नक्षत्र', ta: 'Nakshatras', te: 'Nakshatras', bn: 'Nakshatras', kn: 'Nakshatras', gu: 'Nakshatras' }, desc: { en: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', hi: 'भरणी, कृत्तिका आदि में ग्रहण — नक्षत्र-आधारित ग्रहण महत्त्व', sa: 'भरणी, कृत्तिका आदि में ग्रहण — नक्षत्र-आधारित ग्रहण महत्त्व', mai: 'भरणी, कृत्तिका आदि में ग्रहण — नक्षत्र-आधारित ग्रहण महत्त्व', mr: 'भरणी, कृत्तिका आदि में ग्रहण — नक्षत्र-आधारित ग्रहण महत्त्व', ta: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', te: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', bn: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', kn: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', gu: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification' } },
  { href: '/learn/rashis', label: { en: 'Rashis', hi: 'राशि', sa: 'राशि', mai: 'राशि', mr: 'राशि', ta: 'Rashis', te: 'Rashis', bn: 'Rashis', kn: 'Rashis', gu: 'Rashis' }, desc: { en: 'Which zodiac sign the eclipse falls in — house and sign effects', hi: 'ग्रहण किस राशि में पड़ता है — भाव और राशि प्रभाव', sa: 'ग्रहण किस राशि में पड़ता है — भाव और राशि प्रभाव', mai: 'ग्रहण किस राशि में पड़ता है — भाव और राशि प्रभाव', mr: 'ग्रहण किस राशि में पड़ता है — भाव और राशि प्रभाव', ta: 'Which zodiac sign the eclipse falls in — house and sign effects', te: 'Which zodiac sign the eclipse falls in — house and sign effects', bn: 'Which zodiac sign the eclipse falls in — house and sign effects', kn: 'Which zodiac sign the eclipse falls in — house and sign effects', gu: 'Which zodiac sign the eclipse falls in — house and sign effects' } },
];

export default function LearnEclipsesPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: LocaleText | Record<string, string>) => lt(obj as LocaleText, locale);

  return (
    <div className="space-y-8">
      {/* ═══ Header ═══ */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {t('subtitle')}
        </p>
      </div>

      {/* ═══ 1. Mythology ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {t('mythTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4" style={bodyFont}>
          <p>{t('myth1')}</p>
          <p>{t('myth2')}</p>

          {/* Visual: Rahu-Ketu diagram */}
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 max-w-lg w-full">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-5 text-center">
                {isHi ? 'राहु → सूर्य ग्रहण · केतु → चन्द्र ग्रहण' : 'Rahu → Solar Eclipse · Ketu → Lunar Eclipse'}
              </div>
              <svg viewBox="0 0 400 100" className="w-full h-24" aria-hidden="true">
                {/* Ecliptic line */}
                <line x1="20" y1="50" x2="380" y2="50" stroke="#d4a853" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
                {/* Moon orbit arc */}
                <path d="M 20 80 Q 200 10 380 80" fill="none" stroke="#8a8478" strokeWidth="1.5" opacity="0.5" />
                {/* Rahu node */}
                <circle cx="120" cy="50" r="8" fill="#d4a853" opacity="0.15" stroke="#d4a853" strokeWidth="1.5" />
                <text x="120" y="54" textAnchor="middle" fontSize="10" fill="#d4a853" fontWeight="bold">☊</text>
                <text x="120" y="68" textAnchor="middle" fontSize="9" fill="#d4a853" opacity="0.8">{isHi ? 'राहु' : 'Rahu'}</text>
                {/* Ketu node */}
                <circle cx="280" cy="50" r="8" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="280" y="54" textAnchor="middle" fontSize="10" fill="#8b5cf6" fontWeight="bold">☋</text>
                <text x="280" y="68" textAnchor="middle" fontSize="9" fill="#8b5cf6" opacity="0.8">{isHi ? 'केतु' : 'Ketu'}</text>
                {/* Sun label */}
                <circle cx="60" cy="50" r="12" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1" />
                <text x="60" y="54" textAnchor="middle" fontSize="11" fill="#f59e0b">☀</text>
                <text x="60" y="82" textAnchor="middle" fontSize="8" fill="#f59e0b" opacity="0.7">{isHi ? 'सूर्य' : 'Sun'}</text>
                {/* Moon near Rahu */}
                <circle cx="140" cy="42" r="7" fill="#e2e8f0" opacity="0.25" stroke="#e2e8f0" strokeWidth="1" />
                <text x="140" y="46" textAnchor="middle" fontSize="9" fill="#e2e8f0">☽</text>
                {/* Earth */}
                <circle cx="200" cy="50" r="10" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
                <text x="200" y="54" textAnchor="middle" fontSize="9" fill="#3b82f6">⊕</text>
                <text x="200" y="70" textAnchor="middle" fontSize="8" fill="#3b82f6" opacity="0.7">{isHi ? 'पृथ्वी' : 'Earth'}</text>
                {/* Inclination label */}
                <text x="330" y="30" textAnchor="middle" fontSize="8" fill="#8a8478" opacity="0.8">5.15°</text>
              </svg>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-center">
                <div className="p-2 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                  <div className="text-amber-300 font-bold mb-1">{isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse'}</div>
                  <div className="text-text-secondary/70">{isHi ? 'अमावस्या + राहु/केतु के निकट' : 'Amavasya + Moon near Rahu/Ketu'}</div>
                </div>
                <div className="p-2 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                  <div className="text-blue-300 font-bold mb-1">{isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse'}</div>
                  <div className="text-text-secondary/70">{isHi ? 'पूर्णिमा + राहु/केतु के निकट' : 'Purnima + Moon near Rahu/Ketu'}</div>
                </div>
              </div>
            </div>
          </div>

          <p>{t('myth3')}</p>
        </div>
      </motion.section>

      {/* ═══ 2. Astronomy ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {t('astroTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4" style={bodyFont}>
          <p>{t('astro1')}</p>
          <p>{t('astro2')}</p>
          <p>{t('astro3')}</p>

          {/* Interactive animation — Solar & Lunar Eclipse */}
          <EclipseAnimation locale={locale} />

          {/* Visual: Moon orbital inclination diagram */}
          <div className="flex justify-center my-4">
            <div className="bg-bg-primary/40 border border-gold-primary/10 rounded-xl p-5 max-w-md w-full">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4 text-center">
                {isHi ? 'चन्द्र कक्षा — क्रान्तिवृत्त से 5.15° झुकी हुई' : "Moon's Orbit — 5.15° Inclined to the Ecliptic"}
              </div>
              <svg viewBox="0 0 320 120" className="w-full h-28" aria-hidden="true">
                {/* Ecliptic plane */}
                <line x1="10" y1="60" x2="310" y2="60" stroke="#d4a853" strokeWidth="1.5" opacity="0.5" />
                <text x="315" y="63" fontSize="8" fill="#d4a853" opacity="0.6">{isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}</text>
                {/* Moon orbit — tilted line */}
                <line x1="10" y1="95" x2="310" y2="25" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" strokeDasharray="5 3" />
                {/* 5.15° arc indicator */}
                <path d="M 160 60 A 20 20 0 0 0 168 43" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.7" />
                <text x="172" y="50" fontSize="8" fill="#8b5cf6" opacity="0.9">5.15°</text>
                {/* Rahu node (ascending) */}
                <circle cx="90" cy="60" r="5" fill="#d4a853" opacity="0.2" stroke="#d4a853" strokeWidth="1.5" />
                <text x="90" y="64" textAnchor="middle" fontSize="9" fill="#d4a853">☊</text>
                <text x="90" y="78" textAnchor="middle" fontSize="8" fill="#d4a853" opacity="0.7">{isHi ? 'राहु' : 'Rahu'}</text>
                {/* Ketu node (descending) */}
                <circle cx="230" cy="60" r="5" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="230" y="64" textAnchor="middle" fontSize="9" fill="#8b5cf6">☋</text>
                <text x="230" y="78" textAnchor="middle" fontSize="8" fill="#8b5cf6" opacity="0.7">{isHi ? 'केतु' : 'Ketu'}</text>
                {/* Moon positions */}
                <circle cx="60" cy="82" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.5" />
                <text x="60" y="98" textAnchor="middle" fontSize="7" fill="#8a8478">{isHi ? 'β = −4°' : 'β = −4°'}</text>
                <circle cx="160" cy="48" r="5" fill="#e2e8f0" opacity="0.7" stroke="#e2e8f0" strokeWidth="1" />
                <text x="160" y="40" textAnchor="middle" fontSize="7" fill="#e2e8f0">{isHi ? 'β ≈ 0°' : 'β ≈ 0°'}</text>
                <text x="160" y="32" textAnchor="middle" fontSize="7" fill="#22c55e">{isHi ? '→ ग्रहण!' : '→ Eclipse!'}</text>
                <circle cx="270" cy="35" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.5" />
                <text x="270" y="28" textAnchor="middle" fontSize="7" fill="#8a8478">{isHi ? 'β = +3°' : 'β = +3°'}</text>
              </svg>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 3. Calculation Engine ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('calcTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bodyFont}>
          {t('calcIntro')}
        </p>

        <div className="space-y-5">
          {/* Step 1 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">01</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{t('step1Title')}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{t('step1')}</p>
              <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
                <p>{isHi ? '// तिथि #30 (अमावस्या) → सूर्य ग्रहण उम्मीदवार' : '// Tithi #30 (Amavasya) → solar eclipse candidate'}</p>
                <p>{isHi ? '// तिथि #15 (पूर्णिमा) → चन्द्र ग्रहण उम्मीदवार' : '// Tithi #15 (Purnima) → lunar eclipse candidate'}</p>
                <p className="text-text-secondary/60">t_mid = (entry.startJd + entry.endJd) / 2</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">02</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{t('step2Title')}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{t('step2')}</p>
              <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
                <p className="text-text-secondary/60">{isHi ? '// चन्द्र अक्षांश प्राप्त करें' : '// Query Moon ecliptic latitude'}</p>
                <p>β = moonEclipticLatitude(t_mid)  <span className="text-text-secondary/50">// degrees</span></p>
                <p>{isHi ? '// β = 0° पर नोड, ±5.15° पर नोड से दूर' : '// β = 0° at node, ±5.15° furthest from node'}</p>
              </div>
            </div>
          </div>

          {/* Step 3 — with threshold tables */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">03</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{t('step3Title')}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed space-y-4" style={bodyFont}>
              <p>{t('step3')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Solar thresholds */}
                <div>
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    {isHi ? 'सूर्य ग्रहण — अमावस्या पर' : 'Solar Eclipse — At New Moon'}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { range: '|β| < ~0.9°', type: { en: 'Central (Total or Annular)', hi: 'केन्द्रीय (पूर्ण या कण्कण)', sa: 'केन्द्रीय (पूर्ण या कण्कण)', mai: 'केन्द्रीय (पूर्ण या कण्कण)', mr: 'केन्द्रीय (पूर्ण या कण्कण)', ta: 'Central (Total or Annular)', te: 'Central (Total or Annular)', bn: 'Central (Total or Annular)', kn: 'Central (Total or Annular)', gu: 'Central (Total or Annular)' }, color: 'text-amber-300 bg-amber-500/8 border-amber-500/20' },
                      { range: '|β| < ~1.6°', type: { en: 'Partial solar eclipse', hi: 'आंशिक सूर्य ग्रहण', sa: 'आंशिक सूर्य ग्रहण', mai: 'आंशिक सूर्य ग्रहण', mr: 'आंशिक सूर्य ग्रहण', ta: 'Partial solar eclipse', te: 'Partial solar eclipse', bn: 'Partial solar eclipse', kn: 'Partial solar eclipse', gu: 'Partial solar eclipse' }, color: 'text-yellow-400 bg-yellow-500/8 border-yellow-500/20' },
                      { range: '|β| > ~1.6°', type: { en: 'No eclipse', hi: 'ग्रहण नहीं', sa: 'ग्रहण नहीं', mai: 'ग्रहण नहीं', mr: 'ग्रहण नहीं', ta: 'No eclipse', te: 'No eclipse', bn: 'No eclipse', kn: 'No eclipse', gu: 'No eclipse' }, color: 'text-text-secondary/60 bg-bg-primary/30 border-gold-primary/8' },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-2 items-center px-3 py-1.5 rounded-lg border text-xs font-mono ${row.color}`}>
                        <span className="opacity-90 w-20 shrink-0">{row.range}</span>
                        <span className="opacity-80">{lt(row.type as LocaleText, locale)}</span>
                      </div>
                    ))}
                    <div className="text-text-secondary/60 text-xs px-1 mt-1">
                      {isHi ? 'पूर्ण बनाम कण्कण: चन्द्र दूरी पर निर्भर — निकट = पूर्ण, दूर = कण्कण' : 'Total vs Annular: depends on Moon distance — closer = total, farther = annular'}
                    </div>
                  </div>
                </div>
                {/* Lunar thresholds */}
                <div>
                  <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                    {isHi ? 'चन्द्र ग्रहण — पूर्णिमा पर' : 'Lunar Eclipse — At Full Moon'}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { range: '|β| < ~0.5°', type: { en: 'Total lunar (Blood Moon)', hi: 'पूर्ण चन्द्र (रक्त चन्द्र)', sa: 'पूर्ण चन्द्र (रक्त चन्द्र)', mai: 'पूर्ण चन्द्र (रक्त चन्द्र)', mr: 'पूर्ण चन्द्र (रक्त चन्द्र)', ta: 'Total lunar (Blood Moon)', te: 'Total lunar (Blood Moon)', bn: 'Total lunar (Blood Moon)', kn: 'Total lunar (Blood Moon)', gu: 'Total lunar (Blood Moon)' }, color: 'text-red-400 bg-red-500/8 border-red-500/20' },
                      { range: '|β| < ~1.0°', type: { en: 'Partial lunar eclipse', hi: 'आंशिक चन्द्र ग्रहण', sa: 'आंशिक चन्द्र ग्रहण', mai: 'आंशिक चन्द्र ग्रहण', mr: 'आंशिक चन्द्र ग्रहण', ta: 'Partial lunar eclipse', te: 'Partial lunar eclipse', bn: 'Partial lunar eclipse', kn: 'Partial lunar eclipse', gu: 'Partial lunar eclipse' }, color: 'text-rose-400 bg-rose-500/8 border-rose-500/20' },
                      { range: '|β| < ~1.6°', type: { en: 'Penumbral lunar eclipse', hi: 'उपच्छाया चन्द्र ग्रहण', sa: 'उपच्छाया चन्द्र ग्रहण', mai: 'उपच्छाया चन्द्र ग्रहण', mr: 'उपच्छाया चन्द्र ग्रहण', ta: 'Penumbral lunar eclipse', te: 'Penumbral lunar eclipse', bn: 'Penumbral lunar eclipse', kn: 'Penumbral lunar eclipse', gu: 'Penumbral lunar eclipse' }, color: 'text-slate-400 bg-slate-500/8 border-slate-500/20' },
                      { range: '|β| > ~1.6°', type: { en: 'No eclipse', hi: 'ग्रहण नहीं', sa: 'ग्रहण नहीं', mai: 'ग्रहण नहीं', mr: 'ग्रहण नहीं', ta: 'No eclipse', te: 'No eclipse', bn: 'No eclipse', kn: 'No eclipse', gu: 'No eclipse' }, color: 'text-text-secondary/60 bg-bg-primary/30 border-gold-primary/8' },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-2 items-center px-3 py-1.5 rounded-lg border text-xs font-mono ${row.color}`}>
                        <span className="opacity-90 w-20 shrink-0">{row.range}</span>
                        <span className="opacity-80">{lt(row.type as LocaleText, locale)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">04</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{t('step4Title')}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{t('step4')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 4. Types of Eclipses ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('typesTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {t('typesIntro')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECLIPSE_TYPES.map((et, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-4 ${et.bg} ${et.border}`}
            >
              <div className={`text-2xl mb-2 ${et.color}`}>{et.symbol}</div>
              <h4 className={`font-bold text-sm mb-1 ${et.color}`} style={headingFont}>{lt(et.name as LocaleText, locale)}</h4>
              <div className="text-text-secondary/70 text-xs font-mono mb-2 leading-snug">{lt(et.condition as LocaleText, locale)}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{lt(et.desc as LocaleText, locale)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 5. Eclipse Phases ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('phasesTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {t('phasesIntro')}
        </p>
        <div className="space-y-3">
          {PHASES.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col sm:flex-row sm:items-start gap-3 border border-gold-primary/10 rounded-xl p-4"
            >
              <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-36">
                <span className="text-gold-primary font-bold text-base" style={headingFont}>{phase.sanskrit}</span>
                <span className="text-text-secondary/60 text-xs font-mono">{phase.code}</span>
              </div>
              <div>
                <div className="text-gold-light text-sm font-semibold mb-1" style={headingFont}>{lt(phase.name as LocaleText, locale)}</div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{lt(phase.desc as LocaleText, locale)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact times visual timeline */}
        <div className="mt-6 p-4 bg-bg-primary/40 rounded-xl border border-gold-primary/10">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
            {isHi ? 'चन्द्र ग्रहण कालक्रम' : 'Lunar Eclipse Timeline'}
          </div>
          <div className="flex items-center gap-0 w-full overflow-x-auto">
            {[
              { code: 'P1', label: { en: 'Penumbra\nstarts', hi: 'उपच्छाया\nआरम्भ', sa: 'उपच्छाया\nआरम्भ', mai: 'उपच्छाया\nआरम्भ', mr: 'उपच्छाया\nआरम्भ', ta: 'Penumbra\nstarts', te: 'Penumbra\nstarts', bn: 'Penumbra\nstarts', kn: 'Penumbra\nstarts', gu: 'Penumbra\nstarts' }, color: 'bg-slate-400/60' },
              { code: 'U1', label: { en: 'Umbra\nstarts', hi: 'उपछाया\nआरम्भ', sa: 'उपछाया\nआरम्भ', mai: 'उपछाया\nआरम्भ', mr: 'उपछाया\nआरम्भ', ta: 'Umbra\nstarts', te: 'Umbra\nstarts', bn: 'Umbra\nstarts', kn: 'Umbra\nstarts', gu: 'Umbra\nstarts' }, color: 'bg-red-500/60' },
              { code: 'Max', label: { en: 'Maximum\neclipse', hi: 'अधिकतम\nग्रहण', sa: 'अधिकतम\nग्रहण', mai: 'अधिकतम\nग्रहण', mr: 'अधिकतम\nग्रहण', ta: 'Maximum\neclipse', te: 'Maximum\neclipse', bn: 'Maximum\neclipse', kn: 'Maximum\neclipse', gu: 'Maximum\neclipse' }, color: 'bg-red-600/80' },
              { code: 'U2', label: { en: 'Umbra\nends', hi: 'उपछाया\nसमाप्त', sa: 'उपछाया\nसमाप्त', mai: 'उपछाया\nसमाप्त', mr: 'उपछाया\nसमाप्त', ta: 'Umbra\nends', te: 'Umbra\nends', bn: 'Umbra\nends', kn: 'Umbra\nends', gu: 'Umbra\nends' }, color: 'bg-red-500/60' },
              { code: 'P4', label: { en: 'Penumbra\nends', hi: 'उपच्छाया\nसमाप्त', sa: 'उपच्छाया\nसमाप्त', mai: 'उपच्छाया\nसमाप्त', mr: 'उपच्छाया\nसमाप्त', ta: 'Penumbra\nends', te: 'Penumbra\nends', bn: 'Penumbra\nends', kn: 'Penumbra\nends', gu: 'Penumbra\nends' }, color: 'bg-slate-400/60' },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="text-xs font-bold font-mono text-gold-primary">{item.code}</div>
                  <div className="text-text-secondary/60 text-xs text-center whitespace-pre-line leading-tight max-w-12">
                    {lt(item.label as LocaleText, locale)}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-0.5 w-10 sm:w-16 bg-gold-primary/15 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ 6. Sutak ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('sutakTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bodyFont}>
          {t('sutakIntro')}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bodyFont}>
          {t('sutakSources')}
        </p>

        {/* Sutak source table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'ग्रन्थ' : 'Text'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse'}</th>
              </tr>
            </thead>
            <tbody>
              {SUTAK_SOURCES.map((src, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className={`py-2.5 px-3 font-bold text-sm ${src.color}`} style={headingFont}>{lt(src.text as LocaleText, locale)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs" style={bodyFont}>{lt(src.solar as LocaleText, locale)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs" style={bodyFont}>{lt(src.lunar as LocaleText, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Do & Avoid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <h4 className="text-emerald-400 font-bold text-sm mb-3 uppercase tracking-wide" style={headingFont}>
              {t('sutakDo')}
            </h4>
            <ul className="space-y-2">
              {SUTAK_DO.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm" style={bodyFont}>
                  <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
                  <span>{isHi ? item.hi : item.en}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-bold text-sm mb-3 uppercase tracking-wide" style={headingFont}>
              {t('sutakAvoid')}
            </h4>
            <ul className="space-y-2">
              {SUTAK_AVOID.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm" style={bodyFont}>
                  <span className="text-red-400 mt-0.5 shrink-0">−</span>
                  <span>{isHi ? item.hi : item.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ═══ 7. Eclipses in Kundali ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('kundaliTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {t('kundaliIntro')}
        </p>
        <div className="space-y-3">
          {KUNDALI_EFFECTS.map((eff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col sm:flex-row gap-3 border border-gold-primary/10 rounded-xl p-4"
            >
              <div className={`shrink-0 font-bold text-sm sm:w-52 ${eff.color}`} style={headingFont}>
                {lt(eff.situation as LocaleText, locale)}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {lt(eff.effect as LocaleText, locale)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 8. Saros Cycle ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {t('sarosTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5" style={bodyFont}>
          {/* Why eclipses repeat */}
          <p className="font-semibold text-gold-light">{t('sarosWhy')}</p>
          <div className="space-y-3 ml-1">
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">1.</span>
              <p className="text-sm">{t('sarosSynodic')}</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">2.</span>
              <p className="text-sm">{t('sarosDraconic')}</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">3.</span>
              <p className="text-sm">{t('sarosAnomalistic')}</p>
            </div>
          </div>
          <p>{t('sarosResult')}</p>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '6,585.32', label: { en: 'Days (Saros)', hi: 'दिन (सारोस)', sa: 'दिन (सारोस)', mai: 'दिन (सारोस)', mr: 'दिन (सारोस)', ta: 'Days (Saros)', te: 'Days (Saros)', bn: 'Days (Saros)', kn: 'Days (Saros)', gu: 'Days (Saros)' }, color: 'text-gold-light' },
              { value: '18y 11d 8h', label: { en: 'Duration', hi: 'अवधि', sa: 'अवधि', mai: 'अवधि', mr: 'अवधि', ta: 'Duration', te: 'Duration', bn: 'Duration', kn: 'Duration', gu: 'Duration' }, color: 'text-gold-light' },
              { value: '54y 34d', label: { en: 'Exeligmos (3×)', hi: 'एक्सेलिग्मोस', sa: 'एक्सेलिग्मोस', mai: 'एक्सेलिग्मोस', mr: 'एक्सेलिग्मोस', ta: 'Exeligmos (3×)', te: 'Exeligmos (3×)', bn: 'Exeligmos (3×)', kn: 'Exeligmos (3×)', gu: 'Exeligmos (3×)' }, color: 'text-violet-400' },
              { value: '120°', label: { en: 'Westward Shift', hi: 'पश्चिम विचलन', sa: 'पश्चिम विचलन', mai: 'पश्चिम विचलन', mr: 'पश्चिम विचलन', ta: 'Westward Shift', te: 'Westward Shift', bn: 'Westward Shift', kn: 'Westward Shift', gu: 'Westward Shift' }, color: 'text-blue-300' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{lt(stat.label as LocaleText, locale)}</div>
              </div>
            ))}
          </div>

          {/* 8-hour shift */}
          <p>{t('saros8hours')}</p>

          {/* Saros Series */}
          <h4 className="text-lg font-bold text-gold-light mt-4" style={headingFont}>{t('sarosSeriesTitle')}</h4>
          <p>{t('sarosSeries1')}</p>
          <p>{t('sarosSeries2')}</p>

          {/* Saros lifecycle diagram */}
          <div className="border border-gold-primary/10 rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
            <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{isHi ? 'सारोस श्रृंखला का जीवन चक्र (~1,200-1,500 वर्ष)' : 'Lifecycle of a Saros Series (~1,200-1,500 years)'}</div>
            <div className="flex items-center gap-1 text-[10px]">
              <div className="flex-1 h-3 rounded-l-full bg-gradient-to-r from-transparent to-amber-500/30" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/30 to-amber-500/60" />
              <div className="flex-1 h-3 bg-amber-500/60" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/60 to-red-500/70" />
              <div className="flex-1 h-3 bg-red-500/70" />
              <div className="flex-1 h-3 bg-gradient-to-r from-red-500/70 to-amber-500/60" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/60 to-amber-500/30" />
              <div className="flex-1 h-3 rounded-r-full bg-gradient-to-r from-amber-500/30 to-transparent" />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-text-secondary/50">
              <span>{isHi ? 'शुरू: छोटे आंशिक (ध्रुव)' : 'Start: Small partials (pole)'}</span>
              <span className="text-red-400">{isHi ? 'चरम: पूर्ण/वलयाकार (भूमध्य)' : 'Peak: Total/Annular (equator)'}</span>
              <span>{isHi ? 'अंत: छोटे आंशिक (विपरीत ध्रुव)' : 'End: Small partials (opp. pole)'}</span>
            </div>
            <div className="text-center text-text-secondary/40 text-[9px] mt-1">70-85 {isHi ? 'ग्रहण प्रति श्रृंखला' : 'eclipses per series'}</div>
          </div>

          {/* Series stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: '~80', label: { en: 'Active Series (any time)', hi: 'सक्रिय श्रृंखलाएँ (किसी भी समय)', sa: 'सक्रिय श्रृंखलाएँ (किसी भी समय)', mai: 'सक्रिय श्रृंखलाएँ (किसी भी समय)', mr: 'सक्रिय श्रृंखलाएँ (किसी भी समय)', ta: 'Active Series (any time)', te: 'Active Series (any time)', bn: 'Active Series (any time)', kn: 'Active Series (any time)', gu: 'Active Series (any time)' }, color: 'text-blue-300' },
              { value: '70-85', label: { en: 'Eclipses per Series', hi: 'ग्रहण प्रति श्रृंखला', sa: 'ग्रहण प्रति श्रृंखला', mai: 'ग्रहण प्रति श्रृंखला', mr: 'ग्रहण प्रति श्रृंखला', ta: 'Eclipses per Series', te: 'Eclipses per Series', bn: 'Eclipses per Series', kn: 'Eclipses per Series', gu: 'Eclipses per Series' }, color: 'text-emerald-400' },
              { value: '1,200-1,500y', label: { en: 'Series Lifespan', hi: 'श्रृंखला जीवनकाल', sa: 'श्रृंखला जीवनकाल', mai: 'श्रृंखला जीवनकाल', mr: 'श्रृंखला जीवनकाल', ta: 'Series Lifespan', te: 'Series Lifespan', bn: 'Series Lifespan', kn: 'Series Lifespan', gu: 'Series Lifespan' }, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{lt(stat.label as LocaleText, locale)}</div>
              </div>
            ))}
          </div>

          {/* Nodal Precession */}
          <h4 className="text-lg font-bold text-gold-light mt-4" style={headingFont}>{t('sarosNodePrecession')}</h4>
          <p>{t('sarosNodePrec1')}</p>
          <p>{t('sarosNodePrec2')}</p>

          {/* Nodal precession stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '18.6y', label: { en: 'Full Nodal Cycle', hi: 'पूर्ण पात चक्र', sa: 'पूर्ण पात चक्र', mai: 'पूर्ण पात चक्र', mr: 'पूर्ण पात चक्र', ta: 'Full Nodal Cycle', te: 'Full Nodal Cycle', bn: 'Full Nodal Cycle', kn: 'Full Nodal Cycle', gu: 'Full Nodal Cycle' }, color: 'text-gold-light' },
              { value: '~1.5y', label: { en: 'Per Sign', hi: 'प्रति राशि', sa: 'प्रति राशि', mai: 'प्रति राशि', mr: 'प्रति राशि', ta: 'Per Sign', te: 'Per Sign', bn: 'Per Sign', kn: 'Per Sign', gu: 'Per Sign' }, color: 'text-violet-400' },
              { value: '~19d', label: { en: 'Annual Shift', hi: 'वार्षिक विचलन', sa: 'वार्षिक विचलन', mai: 'वार्षिक विचलन', mr: 'वार्षिक विचलन', ta: 'Annual Shift', te: 'Annual Shift', bn: 'Annual Shift', kn: 'Annual Shift', gu: 'Annual Shift' }, color: 'text-blue-300' },
              { value: '~3°/month', label: { en: 'Rahu Speed', hi: 'राहु गति', sa: 'राहु गति', mai: 'राहु गति', mr: 'राहु गति', ta: 'Rahu Speed', te: 'Rahu Speed', bn: 'Rahu Speed', kn: 'Rahu Speed', gu: 'Rahu Speed' }, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{lt(stat.label as LocaleText, locale)}</div>
              </div>
            ))}
          </div>

          {/* ══ WORKED EXAMPLES ══ */}
          <h4 className="text-lg font-bold text-gold-light mt-6" style={headingFont}>{t('sarosExampleTitle')}</h4>
          <p className="text-sm">{t('sarosExample1')}</p>

          {/* Solar: Saros 126 chain */}
          <div className="border border-amber-500/15 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-amber-500/5 border-b border-amber-500/10">
              <span className="text-amber-300 font-bold text-sm">{isHi ? 'सारोस 126 — पूर्ण सूर्य ग्रहण श्रृंखला' : 'Saros 126 — Total Solar Eclipse Chain'}</span>
            </div>
            <div className="divide-y divide-gold-primary/5">
              {[
                { date: 'Jul 22, 1990', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'फिनलैण्ड → साइबेरिया → प्रशान्त' : 'Finland → Siberia → Pacific', mag: '1.039', highlight: false },
                { date: 'Aug 1, 2008', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'कनाडा → आर्कटिक → साइबेरिया → चीन' : 'Canada → Arctic → Siberia → China', mag: '1.039', highlight: false },
                { date: 'Aug 12, 2026', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'आर्कटिक → ग्रीनलैण्ड → आइसलैण्ड → स्पेन' : 'Arctic → Greenland → Iceland → Spain', mag: '1.039', highlight: true },
                { date: 'Aug 24, 2044', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'कनाडा → मोन्टाना → उत्तरी डकोटा' : 'Canada → Montana → N. Dakota', mag: '1.036', highlight: false },
                { date: 'Sep 3, 2062', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'इण्डोनेशिया → ऑस्ट्रेलिया' : 'Indonesia → Australia', mag: '1.031', highlight: false },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-2.5 text-sm ${row.highlight ? 'bg-amber-500/8' : ''}`}>
                  <span className={`font-mono text-xs w-28 shrink-0 ${row.highlight ? 'text-gold-light font-bold' : 'text-text-secondary/70'}`}>{row.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${row.highlight ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-amber-500/5 text-amber-400/60 border-amber-500/10'}`}>{row.type}</span>
                  <span className="text-text-secondary/70 text-xs flex-1" style={bodyFont}>{row.path}</span>
                  <span className="font-mono text-xs text-text-secondary/50">{row.mag}</span>
                  {row.highlight && <span className="text-[9px] text-gold-light font-bold">← {isHi ? 'अगला!' : 'NEXT!'}</span>}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-amber-500/3 text-[10px] text-text-secondary/40">
              {isHi ? 'प्रत्येक ग्रहण के बीच: +18 वर्ष 11 दिन 8 घण्टे। पथ ~120° पश्चिम खिसकता है।' : 'Between each: +18 years 11 days 8 hours. Path shifts ~120° westward.'}
            </div>
          </div>

          <p className="text-sm">{t('sarosExample2')}</p>

          {/* Lunar: Saros 133 chain */}
          <p className="text-sm mt-2">{t('sarosLunarExample')}</p>
          <div className="border border-indigo-500/15 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-indigo-500/5 border-b border-indigo-500/10">
              <span className="text-indigo-300 font-bold text-sm">{isHi ? 'सारोस 133 — पूर्ण चन्द्र ग्रहण श्रृंखला' : 'Saros 133 — Total Lunar Eclipse Chain'}</span>
            </div>
            <div className="divide-y divide-gold-primary/5">
              {[
                { date: 'Feb 9, 1990', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'यूरोप, अफ्रीका, एशिया' : 'Europe, Africa, Asia', mag: '1.073', highlight: false },
                { date: 'Feb 20, 2008', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप, अफ्रीका' : 'Americas, Europe, Africa', mag: '1.107', highlight: false },
                { date: 'Mar 3, 2026', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप, अफ्रीका' : 'Americas, Europe, Africa', mag: '1.151', highlight: true },
                { date: 'Mar 14, 2044', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'एशिया, ऑस्ट्रेलिया, प्रशान्त' : 'Asia, Australia, Pacific', mag: '1.193', highlight: false },
                { date: 'Mar 25, 2062', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप' : 'Americas, Europe', mag: '1.227', highlight: false },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-2.5 text-sm ${row.highlight ? 'bg-indigo-500/8' : ''}`}>
                  <span className={`font-mono text-xs w-28 shrink-0 ${row.highlight ? 'text-indigo-300 font-bold' : 'text-text-secondary/70'}`}>{row.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${row.highlight ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' : 'bg-indigo-500/5 text-indigo-400/60 border-indigo-500/10'}`}>{row.type}</span>
                  <span className="text-text-secondary/70 text-xs flex-1" style={bodyFont}>{row.region}</span>
                  <span className="font-mono text-xs text-text-secondary/50">{row.mag}</span>
                  {row.highlight && <span className="text-[9px] text-indigo-300 font-bold">← {isHi ? 'अगला!' : 'NEXT!'}</span>}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-indigo-500/3 text-[10px] text-text-secondary/40">
              {isHi ? 'परिमाण बढ़ रहा है (1.073 → 1.227) — यह श्रृंखला अपने चरम की ओर है!' : 'Magnitude is increasing (1.073 → 1.227) — this series is heading toward its peak!'}
            </div>
          </div>

          {/* Eclipse Seasons */}
          <h4 className="text-lg font-bold text-gold-light mt-6" style={headingFont}>{t('sarosSeasonTitle')}</h4>
          <p className="text-sm">{t('sarosSeason1')}</p>

          {/* Eclipse season shift table */}
          <div className="border border-gold-primary/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-gold-primary/5 border-b border-gold-primary/10">
              <span className="text-gold-light font-bold text-sm">{isHi ? 'ग्रहण ऋतु विचलन (पात पुरस्सरण के कारण)' : 'Eclipse Season Drift (due to Nodal Precession)'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold-primary/10 bg-gold-primary/3">
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'वर्ष' : 'Year'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'ऋतु 1' : 'Season 1'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'ऋतु 2' : 'Season 2'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'राहु राशि' : 'Rahu Sign'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-primary/5">
                  {[
                    { year: '2024', s1: 'Mar-Apr', s2: 'Sep-Oct', rahu: isHi ? 'मीन' : 'Pisces', current: false },
                    { year: '2025', s1: 'Mar', s2: 'Sep', rahu: isHi ? 'मीन' : 'Pisces', current: false },
                    { year: '2026', s1: 'Feb-Mar', s2: 'Aug', rahu: isHi ? 'मीन → कुम्भ' : 'Pisces → Aquarius', current: true },
                    { year: '2028', s1: 'Jan', s2: 'Jul', rahu: isHi ? 'कुम्भ' : 'Aquarius', current: false },
                    { year: '2030', s1: 'Jun', s2: 'Nov-Dec', rahu: isHi ? 'मकर → धनु' : 'Capricorn → Sagittarius', current: false },
                    { year: '2033', s1: 'Mar-Apr', s2: 'Sep-Oct', rahu: isHi ? 'वृश्चिक' : 'Scorpio', current: false },
                    { year: '2035', s1: 'Mar', s2: 'Sep', rahu: isHi ? 'तुला → कन्या' : 'Libra → Virgo', current: false },
                  ].map((row, i) => (
                    <tr key={i} className={row.current ? 'bg-gold-primary/5' : ''}>
                      <td className={`px-4 py-2 font-mono ${row.current ? 'text-gold-light font-bold' : 'text-text-secondary/70'}`}>
                        {row.year} {row.current && <span className="text-[9px] text-gold-primary">← {isHi ? 'अभी' : 'NOW'}</span>}
                      </td>
                      <td className="px-4 py-2 text-text-secondary/70">{row.s1}</td>
                      <td className="px-4 py-2 text-text-secondary/70">{row.s2}</td>
                      <td className="px-4 py-2 text-violet-400/70" style={bodyFont}>{row.rahu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-gold-primary/3 text-[10px] text-text-secondary/40">
              {isHi ? 'ग्रहण ऋतुएँ प्रत्येक वर्ष ~19 दिन पहले खिसकती हैं। राहु हर ~1.5 वर्ष में नई राशि में प्रवेश करता है।' : 'Eclipse seasons shift ~19 days earlier each year. Rahu enters a new sign every ~1.5 years.'}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 9. The 4 Eclipse Types — Node × Type Matrix ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {t('nodeMatrixTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5" style={bodyFont}>
          <p>{t('nodeMatrixIntro')}</p>

          {/* 2×2 Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rahu Solar */}
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/10 flex items-center gap-2">
                <span className="text-lg">☊</span>
                <span className="text-amber-300 font-bold text-sm" style={headingFont}>{t('rahuSolar')}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {t('rahuSolarDesc')}
              </div>
              <div className="px-4 py-2 bg-amber-500/3 border-t border-amber-500/8">
                <div className="text-[10px] text-amber-400/60 font-mono">
                  {isHi ? 'स्वरूप: महत्वाकांक्षा, भ्रम, भौतिक उथल-पुथल' : 'Nature: Ambition, illusion, material upheaval'}
                </div>
              </div>
            </div>

            {/* Ketu Solar */}
            <div className="border border-violet-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-violet-500/8 border-b border-violet-500/10 flex items-center gap-2">
                <span className="text-lg">☋</span>
                <span className="text-violet-300 font-bold text-sm" style={headingFont}>{t('ketuSolar')}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {t('ketuSolarDesc')}
              </div>
              <div className="px-4 py-2 bg-violet-500/3 border-t border-violet-500/8">
                <div className="text-[10px] text-violet-400/60 font-mono">
                  {isHi ? 'स्वरूप: वैराग्य, कर्म परिपाक, आध्यात्मिक जागृति' : 'Nature: Detachment, karmic reckoning, spiritual awakening'}
                </div>
              </div>
            </div>

            {/* Rahu Lunar */}
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/10 flex items-center gap-2">
                <span className="text-lg">☊</span>
                <span className="text-amber-300 font-bold text-sm" style={headingFont}>{t('rahuLunar')}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {t('rahuLunarDesc')}
              </div>
              <div className="px-4 py-2 bg-amber-500/3 border-t border-amber-500/8">
                <div className="text-[10px] text-amber-400/60 font-mono">
                  {isHi ? 'स्वरूप: भावनात्मक भ्रम, सामूहिक चिन्ता, मानसिक जागृति' : 'Nature: Emotional illusion, mass anxiety, psychic awakening'}
                </div>
              </div>
            </div>

            {/* Ketu Lunar */}
            <div className="border border-red-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-red-500/8 border-b border-red-500/10 flex items-center gap-2">
                <span className="text-lg">☋</span>
                <span className="text-red-300 font-bold text-sm" style={headingFont}>{t('ketuLunar')}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {t('ketuLunarDesc')}
              </div>
              <div className="px-4 py-2 bg-red-500/3 border-t border-red-500/8">
                <div className="text-[10px] text-red-400/60 font-mono">
                  {isHi ? 'स्वरूप: पूर्वज कर्म, शोक, मोक्ष, सर्वाधिक आध्यात्मिक' : 'Nature: Ancestral karma, grief, moksha, most spiritual of all 4'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick reference table */}
          <div className="border border-gold-primary/10 rounded-xl overflow-hidden mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gold-primary/10 bg-gold-primary/3">
                  <th className="text-left px-4 py-2 text-gold-dark font-bold"></th>
                  <th className="text-left px-4 py-2 text-amber-400 font-bold">☊ {isHi ? 'राहु पर' : 'At Rahu'}</th>
                  <th className="text-left px-4 py-2 text-violet-400 font-bold">☋ {isHi ? 'केतु पर' : 'At Ketu'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5">
                <tr>
                  <td className="px-4 py-2.5 text-amber-300 font-bold">☀ {isHi ? 'सूर्य' : 'Solar'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'सत्ता उथल-पुथल, भ्रम, विदेश प्रभाव' : 'Power upheaval, deception, foreign influence'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'अहंकार पतन, कर्म परिपाक, आध्यात्मिक मोड़' : 'Ego fall, karmic reckoning, spiritual turning point'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-indigo-300 font-bold">☽ {isHi ? 'चन्द्र' : 'Lunar'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'सामूहिक भय, मानसिक धुंध, इच्छा-प्रेरित भ्रम' : 'Mass fear, mental fog, desire-driven illusion'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'पूर्वज कर्म सतह पर, शोक, मोक्ष, रक्त चन्द्र' : 'Ancestral karma surfaces, grief, moksha, Blood Moon'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-text-secondary/50 text-xs italic">{t('nodeMatrixNote')}</p>
        </div>
      </motion.section>

      {/* ═══ 10. Cross References ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {t('crossRef')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {CROSS_REFS.map((ref, i) => (
            <Link
              key={i}
              href={ref.href as '/'}
              className="flex flex-col gap-1 p-4 border border-gold-primary/15 rounded-xl hover:border-gold-primary/35 hover:bg-gold-primary/5 transition-all group"
            >
              <span className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors" style={headingFont}>
                {lt(ref.label as LocaleText, locale)}
              </span>
              <span className="text-text-secondary/70 text-xs" style={bodyFont}>{lt(ref.desc as LocaleText, locale)}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/eclipses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 hover:border-gold-primary/50 text-gold-light rounded-xl text-sm font-semibold transition-all"
          style={headingFont}
        >
          {t('viewCalendar')} →
        </Link>
      </motion.section>
    </div>
  );
}
