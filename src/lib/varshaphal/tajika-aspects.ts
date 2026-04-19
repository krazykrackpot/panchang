/**
 * Tajika Aspects and Yogas for Varshaphal
 * Complete 16-yoga engine: Ithasala, Ishrafa, Nakta, Yamaya, Manau,
 * Khallasara, Dutthottha, Ikkabal, Induvara, Tambira, Kuttha,
 * Durupha, Radda, Kamboola, Gairi-Kamboola, Muthashila
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type { TajikaYoga } from '@/types/varshaphal';
import type { LocaleText} from '@/types/panchang';

// ─── Sign lordship (sign 1-12 → planet id 0-8) ────────────────────────────
// Aries=Mars(2), Taurus=Venus(5), Gemini=Mercury(3), Cancer=Moon(1),
// Leo=Sun(0), Virgo=Mercury(3), Libra=Venus(5), Scorpio=Mars(2),
// Sagittarius=Jupiter(4), Capricorn=Saturn(6), Aquarius=Saturn(6), Pisces=Jupiter(4)
const SIGN_LORD: Record<number, number> = { 1:2, 2:5, 3:3, 4:1, 5:0, 6:3, 7:5, 8:2, 9:4, 10:6, 11:6, 12:4 };

// Cadent houses (3, 6, 9, 12) — weak placement in Tajika
const CADENT_HOUSES = new Set([3, 6, 9, 12]);
// Kendra houses (1, 4, 7, 10) — strong angular placement
const KENDRA_HOUSES = new Set([1, 4, 7, 10]);
// Trikona houses (1, 5, 9) — auspicious trine placement
const TRIKONA_HOUSES = new Set([1, 5, 9]);

// ─── P2-04: Planet-pair year-prediction matrix ──────────────────────────────
// Classical Tajika: planet pairs have specific annual meanings based on their nature.
// This gives richer interpretation for Ithasala / Ishrafa yogas.
// Reference: Neelakantha's Tajika Neelakanthi, Somanatha's Tajika Shastra

const PLANET_PAIR_YEAR_MEANING: Record<string, LocaleText> = {
  // Sun combinations
  '0-4': { en: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', hi: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', sa: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', mai: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', mr: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', ta: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', te: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', bn: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', kn: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', gu: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.' },
  '4-0': { en: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', hi: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', sa: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', mai: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', mr: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।', ta: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', te: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', bn: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', kn: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.', gu: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.' },
  '0-1': { en: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', hi: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', sa: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', mai: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', mr: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', ta: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', te: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', bn: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', kn: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', gu: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.' },
  '1-0': { en: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', hi: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', sa: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', mai: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', mr: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।', ta: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', te: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', bn: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', kn: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.', gu: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.' },
  '0-2': { en: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', hi: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', sa: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', mai: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', mr: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', ta: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', te: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', bn: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', kn: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', gu: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.' },
  '2-0': { en: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', hi: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', sa: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', mai: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', mr: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।', ta: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', te: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', bn: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', kn: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.', gu: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.' },
  '0-5': { en: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', hi: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', sa: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', mai: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', mr: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', ta: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', te: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', bn: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', kn: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', gu: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.' },
  '5-0': { en: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', hi: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', sa: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', mai: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', mr: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।', ta: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', te: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', bn: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', kn: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.', gu: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.' },
  '0-6': { en: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', hi: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', sa: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', mai: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', mr: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', ta: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', te: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', bn: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', kn: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', gu: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.' },
  '6-0': { en: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', hi: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', sa: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', mai: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', mr: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।', ta: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', te: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', bn: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', kn: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', gu: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.' },
  '0-3': { en: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', hi: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', sa: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', mai: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', mr: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', ta: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', te: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', bn: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', kn: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', gu: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.' },
  '3-0': { en: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', hi: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', sa: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', mai: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', mr: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।', ta: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', te: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', bn: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', kn: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', gu: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.' },
  // Moon combinations
  '1-4': { en: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', hi: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', sa: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', mai: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', mr: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', ta: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', te: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', bn: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', kn: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', gu: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.' },
  '4-1': { en: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', hi: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', sa: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', mai: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', mr: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।', ta: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', te: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', bn: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', kn: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.', gu: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.' },
  '1-5': { en: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', hi: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', sa: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', mai: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', mr: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', ta: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', te: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', bn: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', kn: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', gu: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.' },
  '5-1': { en: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', hi: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', sa: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', mai: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', mr: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।', ta: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', te: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', bn: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', kn: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', gu: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.' },
  '1-6': { en: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', hi: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', sa: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', mai: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', mr: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', ta: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', te: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', bn: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', kn: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', gu: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.' },
  '6-1': { en: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', hi: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', sa: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', mai: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', mr: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।', ta: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', te: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', bn: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', kn: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', gu: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.' },
  '1-2': { en: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', hi: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', sa: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', mai: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', mr: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', ta: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', te: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', bn: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', kn: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', gu: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.' },
  '2-1': { en: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', hi: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', sa: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', mai: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', mr: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।', ta: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', te: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', bn: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', kn: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', gu: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.' },
  // Mars combinations
  '2-4': { en: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', hi: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', sa: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', mai: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', mr: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', ta: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', te: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', bn: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', kn: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', gu: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.' },
  '4-2': { en: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', hi: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', sa: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', mai: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', mr: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।', ta: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', te: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', bn: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', kn: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', gu: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.' },
  '2-5': { en: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', hi: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', sa: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', mai: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', mr: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', ta: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', te: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', bn: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', kn: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', gu: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.' },
  '5-2': { en: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', hi: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', sa: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', mai: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', mr: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।', ta: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', te: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', bn: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', kn: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', gu: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.' },
  '2-6': { en: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', hi: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', sa: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', mai: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', mr: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', ta: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', te: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', bn: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', kn: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', gu: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.' },
  '6-2': { en: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', hi: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', sa: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', mai: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', mr: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।', ta: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', te: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', bn: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', kn: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', gu: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.' },
  // Mercury combinations
  '3-4': { en: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', hi: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', sa: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', mai: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', mr: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', ta: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', te: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', bn: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', kn: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', gu: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.' },
  '4-3': { en: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', hi: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', sa: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', mai: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', mr: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।', ta: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', te: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', bn: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', kn: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', gu: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.' },
  '3-5': { en: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', hi: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', sa: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', mai: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', mr: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', ta: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', te: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', bn: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', kn: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', gu: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.' },
  '5-3': { en: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', hi: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', sa: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', mai: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', mr: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।', ta: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', te: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', bn: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', kn: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', gu: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.' },
  '3-6': { en: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', hi: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', sa: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', mai: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', mr: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', ta: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', te: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', bn: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', kn: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', gu: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.' },
  '6-3': { en: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', hi: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', sa: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', mai: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', mr: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।', ta: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', te: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', bn: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', kn: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', gu: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.' },
  // Jupiter combinations
  '4-5': { en: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', hi: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', sa: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', mai: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', mr: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', ta: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', te: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', bn: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', kn: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', gu: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.' },
  '5-4': { en: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', hi: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', sa: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', mai: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', mr: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।', ta: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', te: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', bn: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', kn: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', gu: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.' },
  '4-6': { en: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', hi: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', sa: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', mai: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', mr: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', ta: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', te: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', bn: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', kn: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', gu: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.' },
  '6-4': { en: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', hi: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', sa: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', mai: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', mr: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।', ta: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', te: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', bn: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', kn: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', gu: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.' },
  // Venus–Saturn
  '5-6': { en: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', hi: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', sa: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', mai: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', mr: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', ta: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', te: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', bn: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', kn: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', gu: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.' },
  '6-5': { en: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', hi: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', sa: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', mai: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', mr: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।', ta: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', te: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', bn: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', kn: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', gu: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.' },
};

function getPairMeaning(id1: number, id2: number): LocaleText | null {
  const key = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;
  return PLANET_PAIR_YEAR_MEANING[`${id1}-${id2}`] || PLANET_PAIR_YEAR_MEANING[`${id2}-${id1}`] || null;
}

// Tajika aspect angles
const TAJIKA_ASPECTS = [
  { angle: 0, name: 'conjunction', label: { en: 'Conjunction', hi: 'युति', sa: 'युतिः' } },
  { angle: 60, name: 'sextile', label: { en: 'Sextile', hi: 'षष्ठांश', sa: 'षष्ठांशः' } },
  { angle: 90, name: 'square', label: { en: 'Square', hi: 'चतुर्थांश', sa: 'चतुर्थांशः' } },
  { angle: 120, name: 'trine', label: { en: 'Trine', hi: 'त्रिकोण', sa: 'त्रिकोणः' } },
  { angle: 180, name: 'opposition', label: { en: 'Opposition', hi: 'सप्तम', sa: 'सप्तमः' } },
];

// Orbs: luminaries (Sun/Moon) get 12°, others get 8°
function getOrb(id1: number, id2: number): number {
  if (id1 <= 1 || id2 <= 1) return 12;
  return 8;
}

// Approximate daily motion (degrees/day) for speed comparison
const PLANET_SPEEDS: Record<number, number> = {
  0: 1.0,    // Sun
  1: 13.2,   // Moon
  2: 0.52,   // Mars
  3: 1.38,   // Mercury
  4: 0.083,  // Jupiter
  5: 1.2,    // Venus
  6: 0.034,  // Saturn
  7: 0.053,  // Rahu
  8: 0.053,  // Ketu
};

/**
 * Main entry point for Tajika yoga detection.
 * @param planets - All planet positions from varshaphal chart
 * @param lagnaSign - Optional ascendant sign (1-12) for Kamboola/Gairi-Kamboola detection
 */
export function detectTajikaYogas(planets: PlanetPosition[], lagnaSign?: number): TajikaYoga[] {
  const yogas: TajikaYoga[] = [];
  const mainPlanets = planets.filter(p => p.planet.id <= 6); // Sun through Saturn

  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      const orb = getOrb(p1.planet.id, p2.planet.id);

      for (const aspect of TAJIKA_ASPECTS) {
        const aspectDiff = Math.abs(diff - aspect.angle);
        if (aspectDiff <= orb) {
          // Determine faster planet (higher speed = faster)
          const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
          const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
          const faster = speed1 > speed2 ? p1 : p2;
          const slower = speed1 > speed2 ? p2 : p1;

          // Is the aspect applying (getting closer) or separating?
          const isApplying = isAspectApplying(faster, slower, aspect.angle);

          if (isApplying) {
            // Check Muthashila variant: both planets in high dignity (exalted or own sign)
            const isMuthashila = (faster.isExalted || faster.isOwnSign) && (slower.isExalted || slower.isOwnSign);
            const yogaType = isMuthashila ? 'muthashila' as const : 'ithasala' as const;
            const yogaNameEn = isMuthashila ? `Muthashila (${aspect.label.en})` : `Ithasala (${aspect.label.en})`;
            const yogaNameHi = isMuthashila ? `मुत्थशिल (${aspect.label.hi})` : `इत्थशाल (${aspect.label.hi})`;
            const yogaNameSa = isMuthashila ? `मुत्थशिलः (${aspect.label.sa})` : `इत्थशालः (${aspect.label.sa})`;

            // ITHASALA / MUTHASHILA — faster planet applies to slower
            const pairMeaning = getPairMeaning(faster.planet.id, slower.planet.id);
            const aspectQuality = aspect.angle === 120 || aspect.angle === 60 ? 'harmoniously' : aspect.angle === 90 || aspect.angle === 180 ? 'with tension' : 'powerfully';
            const muthashilaSuffix = isMuthashila ? ' Both planets are in high dignity — extra-strong results.' : '';
            const ithasalaCore = {
              en: `${faster.planet.name.en} applies to ${slower.planet.name.en} by ${aspect.label.en} ${aspectQuality} — this year's matter will materialise.${muthashilaSuffix} ${pairMeaning ? pairMeaning.en : ''}`,
              hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से ${aspect.label.hi} बना रहा है — कार्य सिद्ध होगा।${isMuthashila ? ' दोनों ग्रह उच्च गरिमा में — अत्यंत शक्तिशाली फल।' : ''} ${pairMeaning ? pairMeaning.hi : ''}`,
              sa: `${faster.planet.name.sa} ${slower.planet.name.sa} ${aspect.label.sa} योगं करोति — कार्यसिद्धिः।${isMuthashila ? ' उभौ ग्रहौ उच्चगरिमायाम् — अतिशक्तिशालफलम्।' : ''}`,
            };
            yogas.push({
              name: { en: yogaNameEn, hi: yogaNameHi, sa: yogaNameSa },
              type: yogaType,
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              planet1Id: faster.planet.id,
              planet2Id: slower.planet.id,
              orb: aspectDiff,
              favorable: aspect.angle !== 90 && aspect.angle !== 180,
              description: ithasalaCore,
            });
          } else {
            // ISHRAFA — separating aspect
            const pairMeaning = getPairMeaning(faster.planet.id, slower.planet.id);
            yogas.push({
              name: { en: `Ishrafa (${aspect.label.en})`, hi: `ईशराफ (${aspect.label.hi})`, sa: `ईशराफः (${aspect.label.sa})` },
              type: 'ishrafa',
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              planet1Id: faster.planet.id,
              planet2Id: slower.planet.id,
              orb: aspectDiff,
              favorable: false,
              description: {
                en: `${faster.planet.name.en} separates from ${slower.planet.name.en} — the window for this matter has partially closed; results from its earlier activation may still arrive. ${pairMeaning ? pairMeaning.en : ''}`,
                hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से विमुख हो रहा है — यह अवसर आंशिक रूप से बीत चुका है; पहले के प्रभाव से परिणाम अभी भी आ सकते हैं। ${pairMeaning ? pairMeaning.hi : ''}`,
                sa: `${faster.planet.name.sa} ${slower.planet.name.sa} विमुखः — अवसरः आंशिकतः अतीतः।`,
              },
            });
          }
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Check for Nakta (a third planet transfers light)
  if (yogas.length >= 2) {
    const naktaYoga = detectNakta(mainPlanets, yogas);
    if (naktaYoga) yogas.push(naktaYoga);
  }

  // P2-04: Yamaya Yoga — two planets in exact opposition (Tajika) = contention, conflict
  detectYamaya(mainPlanets, yogas);
  // P2-04: Manau Yoga — faster planet aspects slower, but slower is combust/debilitated = denied
  detectManau(mainPlanets, yogas);
  // P2-04: Khallasara — chain transfer through 3 planets
  detectKhallasara(mainPlanets, yogas);
  // P2-04: Dutthottha — recently separated but within 1° residual orb
  detectDutthottha(mainPlanets, yogas);

  // ─── New yogas (8-16) ────────────────────────────────────────────────────

  // 8. Ikkabal — planet in exaltation/own sign in kendra or trikona
  detectIkkabal(mainPlanets, yogas);
  // 10. Tambira — planet in both Ishrafa and Ithasala with different partners
  detectTambira(yogas);
  // 11. Kuttha — both planets applying but in cadent houses
  detectKuttha(mainPlanets, yogas);
  // 12. Durupha — slower planet applies to faster (reverse Ithasala)
  detectDurupha(mainPlanets, yogas);
  // 13. Radda — benefic rescues a negative yoga
  detectRadda(mainPlanets, yogas);
  // 14-15. Kamboola / Gairi-Kamboola — Moon applies to lagna lord or other
  if (lagnaSign !== undefined) {
    detectKamboola(mainPlanets, yogas, lagnaSign);
  }
  // 9. Induvara — safety net when no main yogas found
  detectInduvara(mainPlanets, yogas);

  // ─── Strength scoring for all yogas ──────────────────────────────────────
  for (const yoga of yogas) {
    yoga.strength = scoreYogaStrength(yoga, planets);
    yoga.strengthLabel = yoga.strength >= 70 ? 'strong' : yoga.strength >= 40 ? 'moderate' : 'weak';
  }

  return yogas;
}

function isAspectApplying(faster: PlanetPosition, slower: PlanetPosition, aspectAngle: number): boolean {
  const currentDiff = angleDiff(faster.longitude, slower.longitude);
  const futureFaster = faster.longitude + (faster.speed || PLANET_SPEEDS[faster.planet.id] || 0);
  const futureSlower = slower.longitude + (slower.speed || PLANET_SPEEDS[slower.planet.id] || 0);
  const futureDiff = angleDiff(futureFaster, futureSlower);

  return Math.abs(futureDiff - aspectAngle) < Math.abs(currentDiff - aspectAngle);
}

function angleDiff(a: number, b: number): number {
  let d = normalizeDeg(a - b);
  if (d > 180) d -= 360;
  return Math.abs(d);
}

function detectNakta(planets: PlanetPosition[], existingYogas: TajikaYoga[]): TajikaYoga | null {
  // Nakta: When planet A can't reach planet B, but planet C mediates
  // Simplified: if we have both Ishrafa and Ithasala involving a common planet
  const ishrafas = existingYogas.filter(y => y.type === 'ishrafa');
  const ithasalas = existingYogas.filter(y => y.type === 'ithasala');

  for (const ish of ishrafas) {
    for (const ith of ithasalas) {
      if (ish.planet2.en === ith.planet1.en || ish.planet1.en === ith.planet2.en) {
        const mediator = ish.planet2.en === ith.planet1.en ? ish.planet2 : ish.planet1;
        return {
          name: { en: 'Nakta Yoga', hi: 'नक्त योग', sa: 'नक्तयोगः' },
          type: 'nakta',
          planet1: ish.planet1,
          planet2: ith.planet2,
          favorable: true,
          description: {
            en: `${mediator.en} transfers light between planets — event happens through an intermediary.`,
            hi: `${mediator.hi} मध्यस्थता करता है — कार्य मध्यस्थ द्वारा होगा।`,
            sa: `${mediator.sa} ज्योतिसंक्रमणं करोति — कार्यं मध्यस्थेन भवति।`,
          },
        };
      }
    }
  }

  return null;
}

// P2-04: Yamaya Yoga — two planets in exact opposition with tight orb ≤ 3°
function detectYamaya(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainPlanets = planets.filter(p => p.planet.id <= 6);
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      if (Math.abs(diff - 180) <= 3) {
        yogas.push({
          name: { en: 'Yamaya Yoga', hi: 'यमाय योग', sa: 'यमाययोगः' },
          type: 'yamaya',
          planet1: p1.planet.name,
          planet2: p2.planet.name,
          favorable: false,
          description: {
            en: `${p1.planet.name.en} and ${p2.planet.name.en} in tight opposition — contention, conflict, and delays are indicated.`,
            hi: `${p1.planet.name.hi} और ${p2.planet.name.hi} सप्तम कोण में — विवाद, संघर्ष और विलंब की संभावना।`,
            sa: `${p1.planet.name.sa} ${p2.planet.name.sa} च सप्तमे — विवादः संघर्षः विलम्बश्च।`,
          },
        });
      }
    }
  }
}

// P2-04: Manaú Yoga — Ithasala exists but slower planet is combust or debilitated → denied
function detectManau(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const COMBUST_ORB: Record<number, number> = { 1: 12, 2: 17, 3: 14, 4: 11, 5: 10, 6: 15 };
  const DEBIL_SIGN: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 6, 4: 10, 5: 6, 6: 1 };

  const ithasalas = yogas.filter(y => y.type === 'ithasala');
  for (const ith of ithasalas) {
    // Find the slower planet (planet2 in ithasala)
    const slowerP = planets.find(p => p.planet.name.en === ith.planet2.en);
    if (!slowerP) continue;
    const id = slowerP.planet.id;
    if (id === 0) continue; // Sun can't be combust

    // Check combustion
    const sunP = planets.find(p => p.planet.id === 0);
    const combOrb = COMBUST_ORB[id];
    const isCombust = sunP && combOrb !== undefined
      ? Math.abs(angleDiff(slowerP.longitude, sunP.longitude)) <= combOrb
      : false;

    // Check debilitation
    const isDebilitated = DEBIL_SIGN[id] !== undefined && slowerP.sign === DEBIL_SIGN[id];

    if (isCombust || isDebilitated) {
      const reason = isCombust ? 'combust' : 'debilitated';
      const reasonHi = isCombust ? 'अस्त' : 'नीच';
      const reasonSa = isCombust ? 'अस्तः' : 'नीचस्थः';
      yogas.push({
        name: { en: 'Manaú Yoga', hi: 'मनाउ योग', sa: 'मनाउयोगः' },
        type: 'manau',
        planet1: ith.planet1,
        planet2: ith.planet2,
        favorable: false,
        description: {
          en: `${ith.planet1.en} applies to ${ith.planet2.en} but ${ith.planet2.en} is ${reason} — promise is denied or greatly reduced.`,
          hi: `${ith.planet1.hi} ${ith.planet2.hi} से इत्थशाल बना रहा है किन्तु ${ith.planet2.hi} ${reasonHi} है — कार्यसिद्धि नहीं होगी।`,
          sa: `${ith.planet1.sa} ${ith.planet2.sa} इत्थशालं करोति परन्तु ${ith.planet2.sa} ${reasonSa} — कार्यसिद्धिर्नास्ति।`,
        },
      });
    }
  }
}

// P2-04: Khallasara — chain: A applies to B (Ithasala), B applies to C (Ithasala)
function detectKhallasara(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const ithasalas = yogas.filter(y => y.type === 'ithasala');
  for (const ith1 of ithasalas) {
    for (const ith2 of ithasalas) {
      if (ith1 === ith2) continue;
      // Chain: ith1.planet2 === ith2.planet1 → A→B→C
      if (ith1.planet2.en === ith2.planet1.en) {
        const A = ith1.planet1;
        const B = ith1.planet2;
        const C = ith2.planet2;
        // Avoid duplicates (same A-B-C triple)
        const already = yogas.some(y => y.type === 'khallasara' && y.planet1.en === A.en && y.planet2.en === C.en);
        if (already) continue;
        yogas.push({
          name: { en: 'Khallasara Yoga', hi: 'खल्लसार योग', sa: 'खल्लसारयोगः' },
          type: 'khallasara',
          planet1: A,
          planet2: C,
          favorable: true,
          description: {
            en: `${A.en} → ${B.en} → ${C.en}: light transfers through a chain — results come through a sequence of events.`,
            hi: `${A.hi} → ${B.hi} → ${C.hi}: श्रृंखला से प्रकाश स्थानांतरण — क्रमशः परिणाम मिलेगा।`,
            sa: `${A.sa} → ${B.sa} → ${C.sa}: श्रृंखलया ज्योतिसंक्रमणम् — क्रमेण कार्यसिद्धिः।`,
          },
        });
      }
    }
  }
}

// P2-04: Dutthottha — separated but within 1° residual orb (potential residual results)
function detectDutthottha(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainPlanets = planets.filter(p => p.planet.id <= 6);
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));

      for (const aspect of [0, 60, 90, 120, 180]) {
        const residual = Math.abs(diff - aspect);
        if (residual > 0 && residual <= 1) {
          // Confirm it's separating (not applying — those are Ithasala/Ishrafa)
          const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
          const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
          const faster = speed1 > speed2 ? p1 : p2;
          const slower = speed1 > speed2 ? p2 : p1;
          const applying = isAspectApplying(faster, slower, aspect);
          if (applying) continue; // applying = Ithasala, skip

          const alreadyIshrafa = yogas.some(
            y => y.type === 'ishrafa' && ((y.planet1.en === p1.planet.name.en && y.planet2.en === p2.planet.name.en) || (y.planet1.en === p2.planet.name.en && y.planet2.en === p1.planet.name.en))
          );
          if (alreadyIshrafa) continue;

          yogas.push({
            name: { en: 'Dutthottha Yoga', hi: 'दुत्थोत्थ योग', sa: 'दुत्थोत्थयोगः' },
            type: 'dutthottha',
            planet1: p1.planet.name,
            planet2: p2.planet.name,
            planet1Id: p1.planet.id,
            planet2Id: p2.planet.id,
            orb: residual,
            favorable: true,
            description: {
              en: `${p1.planet.name.en} and ${p2.planet.name.en} just separated (within 1°) — residual effects of the aspect still carry results.`,
              hi: `${p1.planet.name.hi} और ${p2.planet.name.hi} अभी-अभी अलग हुए (1° के भीतर) — योग का अवशेष प्रभाव बना रहेगा।`,
              sa: `${p1.planet.name.sa} ${p2.planet.name.sa} च अद्यतनं विभक्तौ (1° अन्तर्गतम्) — योगशेषफलं भवति।`,
            },
          });
          break;
        }
      }
    }
  }
}

// ─── NEW YOGAS (8-16) ──────────────────────────────────────────────────────

// 8. Ikkabal — A planet in exaltation, moolatrikona, or own sign in a kendra/trikona
function detectIkkabal(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  for (const p of planets) {
    if (!(p.isExalted || p.isOwnSign)) continue;
    if (!(KENDRA_HOUSES.has(p.house) || TRIKONA_HOUSES.has(p.house))) continue;
    yogas.push({
      name: { en: 'Ikkabal Yoga', hi: 'इक्कबाल योग', sa: 'इक्कबालयोगः' },
      type: 'ikkabal',
      planet1: p.planet.name,
      planet2: p.planet.name, // single-planet yoga
      planet1Id: p.planet.id,
      planet2Id: p.planet.id,
      favorable: true,
      description: {
        en: `${p.planet.name.en} is ${p.isExalted ? 'exalted' : 'in own sign'} in house ${p.house} (kendra/trikona) — produces strong results independently without needing an aspect.`,
        hi: `${p.planet.name.hi} ${p.isExalted ? 'उच्च' : 'स्वराशि'} में भाव ${p.house} (केन्द्र/त्रिकोण) — बिना दृष्टि के भी स्वतंत्र रूप से शुभ फल देता है।`,
        sa: `${p.planet.name.sa} ${p.isExalted ? 'उच्चे' : 'स्वराशौ'} भावे ${p.house} (केन्द्र/त्रिकोण) — दृष्टिं विना स्वतन्त्रं शुभफलं ददाति।`,
      },
    });
  }
}

// 9. Induvara — safety net yoga when none of the main 7 yogas are found
function detectInduvara(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainTypes = new Set(['ithasala', 'ishrafa', 'nakta', 'yamaya', 'manau', 'khallasara', 'dutthottha', 'muthashila']);
  const hasMainYoga = yogas.some(y => mainTypes.has(y.type));
  if (hasMainYoga) return; // Only emit Induvara when no main yogas found

  // Check planets in kendras or trikonas from each other
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      // House distance (mod 12)
      const houseDist = ((p2.house - p1.house + 12) % 12) || 12;
      // Kendra (1,4,7,10) or Trikona (1,5,9) relationship
      if ([1, 4, 5, 7, 9, 10].includes(houseDist)) {
        yogas.push({
          name: { en: 'Induvara Yoga', hi: 'इन्दुवार योग', sa: 'इन्दुवारयोगः' },
          type: 'induvara',
          planet1: p1.planet.name,
          planet2: p2.planet.name,
          planet1Id: p1.planet.id,
          planet2Id: p2.planet.id,
          favorable: true,
          description: {
            en: `No major Tajika aspect yogas found. ${p1.planet.name.en} and ${p2.planet.name.en} are in kendra/trikona from each other — mild beneficial influence still operates.`,
            hi: `कोई प्रमुख ताजिक दृष्टि योग नहीं। ${p1.planet.name.hi} और ${p2.planet.name.hi} केन्द्र/त्रिकोण में — हल्का शुभ प्रभाव अभी भी कार्य करता है।`,
            sa: `प्रमुखताजिकयोगो नास्ति। ${p1.planet.name.sa} ${p2.planet.name.sa} च केन्द्र/त्रिकोणे — मन्दं शुभफलम् अस्ति।`,
          },
        });
        return; // Only one Induvara needed
      }
    }
  }
}

// 10. Tambira — a planet that is in Ishrafa with one planet and Ithasala with another
function detectTambira(yogas: TajikaYoga[]): void {
  const ishrafas = yogas.filter(y => y.type === 'ishrafa');
  const ithasalas = yogas.filter(y => y.type === 'ithasala' || y.type === 'muthashila');

  for (const ish of ishrafas) {
    for (const ith of ithasalas) {
      // Find the common planet (appears in both yogas with different partners)
      const ishPlanets = [ish.planet1.en, ish.planet2.en];
      const ithPlanets = [ith.planet1.en, ith.planet2.en];
      const common = ishPlanets.find(p => ithPlanets.includes(p));
      if (!common) continue;
      // Must have different partners
      const ishPartner = ishPlanets.find(p => p !== common);
      const ithPartner = ithPlanets.find(p => p !== common);
      if (!ishPartner || !ithPartner || ishPartner === ithPartner) continue;

      const already = yogas.some(y => y.type === 'tambira');
      if (already) return;

      yogas.push({
        name: { en: 'Tambira Yoga', hi: 'तम्बीर योग', sa: 'तम्बीरयोगः' },
        type: 'tambira',
        planet1: ish.planet1,
        planet2: ith.planet2,
        planet1Id: ish.planet1Id,
        planet2Id: ith.planet2Id,
        favorable: true,
        description: {
          en: `A planet separated from one and now applies to another — the second connection fulfills what the first started. Transfer of intent.`,
          hi: `एक ग्रह एक से अलग होकर दूसरे से जुड़ रहा है — दूसरा संयोग पहले को पूर्ण करता है। उद्देश्य का हस्तांतरण।`,
          sa: `ग्रहः एकस्माद् विभक्तः अपरं प्रति गच्छति — द्वितीयं योगं प्रथमं पूरयति।`,
        },
      });
      return;
    }
  }
}

// 11. Kuttha — two planets applying to aspect but BOTH in cadent houses (3,6,9,12)
function detectKuttha(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const ithasalas = yogas.filter(y => y.type === 'ithasala' || y.type === 'muthashila');
  for (const ith of ithasalas) {
    const p1 = planets.find(p => p.planet.name.en === ith.planet1.en);
    const p2 = planets.find(p => p.planet.name.en === ith.planet2.en);
    if (!p1 || !p2) continue;
    if (CADENT_HOUSES.has(p1.house) && CADENT_HOUSES.has(p2.house)) {
      yogas.push({
        name: { en: 'Kuttha Yoga', hi: 'कुत्थ योग', sa: 'कुत्थयोगः' },
        type: 'kuttha',
        planet1: p1.planet.name,
        planet2: p2.planet.name,
        planet1Id: p1.planet.id,
        planet2Id: p2.planet.id,
        orb: ith.orb,
        favorable: false,
        description: {
          en: `${p1.planet.name.en} and ${p2.planet.name.en} apply to each other but both are in cadent houses (${p1.house}, ${p2.house}) — promises but cannot deliver. Weak outcomes.`,
          hi: `${p1.planet.name.hi} और ${p2.planet.name.hi} एक-दूसरे की ओर जा रहे हैं किन्तु दोनों अपोक्लिम भावों (${p1.house}, ${p2.house}) में — वादा करते हैं पर पूरा नहीं करते।`,
          sa: `${p1.planet.name.sa} ${p2.planet.name.sa} च परस्परं गच्छतः किन्तु उभावपोक्लिमभावयोः (${p1.house}, ${p2.house}) — प्रतिज्ञा करोति न पूरयति।`,
        },
      });
    }
  }
}

// 12. Durupha — slower planet applies to faster (reverse of normal Ithasala)
function detectDurupha(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainPlanets = planets.filter(p => p.planet.id <= 6);
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      const orb = getOrb(p1.planet.id, p2.planet.id);

      for (const aspect of TAJIKA_ASPECTS) {
        const aspectDiff = Math.abs(diff - aspect.angle);
        if (aspectDiff > orb) continue;

        const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
        const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
        const faster = speed1 > speed2 ? p1 : p2;
        const slower = speed1 > speed2 ? p2 : p1;

        // Durupha: check if the SLOWER planet is moving toward the aspect
        // (reverse of normal where FASTER applies)
        const slowerApplying = isAspectApplying(slower, faster, aspect.angle);
        const fasterApplying = isAspectApplying(faster, slower, aspect.angle);

        // Only trigger if slower applies but faster does not (pure reverse)
        if (slowerApplying && !fasterApplying) {
          // Check this pair isn't already covered by Ithasala/Ishrafa
          const alreadyCovered = yogas.some(
            y => (y.type === 'ithasala' || y.type === 'ishrafa' || y.type === 'muthashila') &&
              ((y.planet1.en === p1.planet.name.en && y.planet2.en === p2.planet.name.en) ||
               (y.planet1.en === p2.planet.name.en && y.planet2.en === p1.planet.name.en))
          );
          if (alreadyCovered) break;

          yogas.push({
            name: { en: 'Durupha Yoga', hi: 'दुरुफा योग', sa: 'दुरुफायोगः' },
            type: 'durupha',
            planet1: slower.planet.name,
            planet2: faster.planet.name,
            planet1Id: slower.planet.id,
            planet2Id: faster.planet.id,
            orb: aspectDiff,
            favorable: true,
            description: {
              en: `${slower.planet.name.en} (slower) applies to ${faster.planet.name.en} (faster) — desire exists but action is delayed. Eventual success through persistence.`,
              hi: `${slower.planet.name.hi} (धीमा) ${faster.planet.name.hi} (तीव्र) की ओर जा रहा है — इच्छा है किन्तु क्रिया विलंबित। धैर्य से सफलता।`,
              sa: `${slower.planet.name.sa} (मन्दः) ${faster.planet.name.sa} (शीघ्रः) प्रति गच्छति — इच्छास्ति किन्तु क्रिया विलम्बिता। धैर्येण सिद्धिः।`,
            },
          });
        }
        break;
      }
    }
  }
}

// 13. Radda — a strong benefic (Jupiter/Venus) rescues a negative yoga
function detectRadda(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const BENEFIC_IDS = new Set([4, 5]); // Jupiter=4, Venus=5
  const TIGHT_ORB = 5; // degrees
  const negativeTypes = new Set(['ishrafa', 'khallasara', 'kuttha', 'manau']);
  const negativeYogas = yogas.filter(y => negativeTypes.has(y.type));

  for (const neg of negativeYogas) {
    // Find planet IDs involved in the negative yoga
    const involvedNames = new Set([neg.planet1.en, neg.planet2.en]);

    for (const benefic of planets) {
      if (!BENEFIC_IDS.has(benefic.planet.id)) continue;
      // Benefic must not be one of the involved planets
      if (involvedNames.has(benefic.planet.name.en)) continue;

      // Check if benefic aspects one of the involved planets tightly
      for (const involved of planets) {
        if (!involvedNames.has(involved.planet.name.en)) continue;
        const diff = Math.abs(angleDiff(benefic.longitude, involved.longitude));
        for (const aspect of TAJIKA_ASPECTS) {
          if (Math.abs(diff - aspect.angle) <= TIGHT_ORB) {
            const already = yogas.some(y => y.type === 'radda' && y.cancels === neg.type);
            if (already) continue;

            yogas.push({
              name: { en: 'Radda Yoga', hi: 'रद्द योग', sa: 'रद्दयोगः' },
              type: 'radda',
              planet1: benefic.planet.name,
              planet2: involved.planet.name,
              planet1Id: benefic.planet.id,
              planet2Id: involved.planet.id,
              orb: Math.abs(diff - aspect.angle),
              favorable: true,
              cancels: neg.type,
              description: {
                en: `${benefic.planet.name.en} aspects ${involved.planet.name.en} tightly — rescuing the negative ${neg.type} yoga. Recovery and course correction indicated.`,
                hi: `${benefic.planet.name.hi} ${involved.planet.name.hi} पर कड़ी दृष्टि डालता है — नकारात्मक ${neg.type} योग को रद्द करता है। सुधार और पुनर्प्राप्ति संभव।`,
                sa: `${benefic.planet.name.sa} ${involved.planet.name.sa} दृष्टिं करोति — नकारात्मक${neg.type}योगं निरस्यति। संशोधनं पुनर्प्राप्तिश्च।`,
              },
            });
            return; // One Radda per negative yoga is enough
          }
        }
      }
    }
  }
}

// 14-15. Kamboola & Gairi-Kamboola — Moon applies to Ithasala with lagna lord (or not)
function detectKamboola(planets: PlanetPosition[], yogas: TajikaYoga[], lagnaSign: number): void {
  const moon = planets.find(p => p.planet.id === 1);
  if (!moon) return;

  const lagnaLordId = SIGN_LORD[lagnaSign];
  if (lagnaLordId === undefined) return;

  // Find all Ithasala yogas involving the Moon
  const moonIthasalas = yogas.filter(
    y => (y.type === 'ithasala' || y.type === 'muthashila') &&
      (y.planet1.en === moon.planet.name.en || y.planet2.en === moon.planet.name.en)
  );

  for (const ith of moonIthasalas) {
    const partner = ith.planet1.en === moon.planet.name.en ? ith.planet2 : ith.planet1;
    const partnerPlanet = planets.find(p => p.planet.name.en === partner.en);
    if (!partnerPlanet) continue;

    if (partnerPlanet.planet.id === lagnaLordId) {
      // Kamboola — Moon + lagna lord
      yogas.push({
        name: { en: 'Kamboola Yoga', hi: 'कम्बूल योग', sa: 'कम्बूलयोगः' },
        type: 'kamboola',
        planet1: moon.planet.name,
        planet2: partnerPlanet.planet.name,
        planet1Id: 1,
        planet2Id: partnerPlanet.planet.id,
        orb: ith.orb,
        favorable: true,
        description: {
          en: `Moon applies to ${partnerPlanet.planet.name.en} (lagna lord) — results come through your own self-effort and initiative this year.`,
          hi: `चन्द्रमा ${partnerPlanet.planet.name.hi} (लग्नेश) से इत्थशाल — इस वर्ष स्वप्रयास और पहल से परिणाम मिलेगा।`,
          sa: `चन्द्रः ${partnerPlanet.planet.name.sa} (लग्नेशः) इत्थशालं करोति — स्वप्रयत्नेन फलसिद्धिः।`,
        },
      });
    } else {
      // Gairi-Kamboola — Moon + non-lagna lord
      yogas.push({
        name: { en: 'Gairi-Kamboola Yoga', hi: 'गैरी-कम्बूल योग', sa: 'गैरी-कम्बूलयोगः' },
        type: 'gairi-kamboola',
        planet1: moon.planet.name,
        planet2: partnerPlanet.planet.name,
        planet1Id: 1,
        planet2Id: partnerPlanet.planet.id,
        orb: ith.orb,
        favorable: true,
        description: {
          en: `Moon applies to ${partnerPlanet.planet.name.en} (not the lagna lord) — results come through others' help, not self-effort.`,
          hi: `चन्द्रमा ${partnerPlanet.planet.name.hi} (लग्नेश नहीं) से इत्थशाल — दूसरों की सहायता से परिणाम मिलेगा, स्वप्रयास से नहीं।`,
          sa: `चन्द्रः ${partnerPlanet.planet.name.sa} (लग्नेशो न) इत्थशालं करोति — परसाहाय्येन फलसिद्धिः।`,
        },
      });
    }
  }
}

// ─── Strength scoring ──────────────────────────────────────────────────────

/**
 * Compute a strength score 0-100 for a Tajika yoga based on:
 * - Dignity of participating planets (exalted/own/debilitated)
 * - Orb tightness (tighter = stronger)
 * - Retrograde penalty
 */
function scoreYogaStrength(yoga: TajikaYoga, planets: PlanetPosition[]): number {
  let score = 50; // base

  const pIds = [yoga.planet1Id, yoga.planet2Id].filter(id => id !== undefined) as number[];

  // Dignity of participating planets
  for (const pid of pIds) {
    const p = planets.find(pp => pp.planet.id === pid);
    if (!p) continue;
    if (p.isExalted) score += 20;
    else if (p.isOwnSign) score += 15;
    else if (p.isDebilitated) score -= 20;
  }

  // Orb tightness
  if (yoga.orb !== undefined) {
    if (yoga.orb < 1) score += 20;
    else if (yoga.orb < 3) score += 10;
    else if (yoga.orb > 8) score -= 10;
  }

  // Retrograde penalty
  for (const pid of pIds) {
    const p = planets.find(pp => pp.planet.id === pid);
    if (p?.isRetrograde) score -= 10;
  }

  // Bonus for Muthashila (both dignified Ithasala)
  if (yoga.type === 'muthashila') score += 10;

  // Penalty for inherently weak yogas
  if (yoga.type === 'kuttha') score -= 15;
  if (yoga.type === 'induvara') score -= 10;

  return Math.max(0, Math.min(100, score));
}
