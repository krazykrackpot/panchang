/**
 * Hindu Festival Calendar Engine
 *
 * Computes approximate dates for major Hindu festivals and Vrat days
 * for a given year using astronomical calculations.
 *
 * Festivals are tied to Tithi, Nakshatra, or solar events.
 */

import { dateToJD, sunLongitude, moonLongitude, toSidereal, calculateTithi, getNakshatraNumber, normalizeDeg } from '@/lib/ephem/astronomical';
import type { Trilingual } from '@/types/panchang';

export interface FestivalEntry {
  name: Trilingual;
  date: string;        // YYYY-MM-DD
  tithi?: string;      // e.g. "Chaitra Shukla 9"
  type: 'major' | 'vrat' | 'regional';
  category: 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'sankranti';
  description: Trilingual;
}

/**
 * Find the Gregorian date when a specific tithi occurs.
 * Scans from a start date forward until the target tithi is found at sunrise.
 */
function findTithiDate(year: number, month: number, targetTithi: number, lat: number = 28.6): string {
  // Start scanning from the 1st of the given month
  for (let day = 1; day <= 31; day++) {
    try {
      const jd = dateToJD(year, month, day, 6); // ~sunrise UT for India
      const { number } = calculateTithi(jd);
      if (number === targetTithi) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    } catch {
      break; // invalid date
    }
  }
  return `${year}-${month.toString().padStart(2, '0')}-15`; // fallback
}

/**
 * Find Purnima (tithi 15) dates for each month.
 */
function findPurnimaDate(year: number, month: number): string {
  return findTithiDate(year, month, 15);
}

/**
 * Find Amavasya (tithi 30) dates for each month.
 */
function findAmavasyaDate(year: number, month: number): string {
  return findTithiDate(year, month, 30);
}

/**
 * Find Ekadashi (tithi 11 and 26) dates.
 * Shukla Ekadashi = tithi 11, Krishna Ekadashi = tithi 26
 */
function findEkadashiDates(year: number, month: number): { shukla: string; krishna: string } {
  return {
    shukla: findTithiDate(year, month, 11),
    krishna: findTithiDate(year, month, 26),
  };
}

/**
 * Find Chaturthi (tithi 4 — Shukla, tithi 19 — Krishna) dates.
 */
function findChaturthiDate(year: number, month: number): string {
  return findTithiDate(year, month, 19); // Sankashti = Krishna Chaturthi
}

/**
 * Find Pradosham (tithi 13 — trayodashi) dates.
 */
function findPradoshamDates(year: number, month: number): { shukla: string; krishna: string } {
  return {
    shukla: findTithiDate(year, month, 13),
    krishna: findTithiDate(year, month, 28),
  };
}

/**
 * Find Sankranti date (Sun enters a new sidereal sign).
 */
function findSankrantiDate(year: number, targetSign: number): string {
  // Scan day by day to find when Sun's sidereal longitude crosses into target sign
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const jd = dateToJD(year, month, day, 6);
      const sunSid = normalizeDeg(toSidereal(sunLongitude(jd), jd));
      const sign = Math.floor(sunSid / 30) + 1;
      if (sign === targetSign) {
        // Check if previous day was different sign
        const jdPrev = dateToJD(year, month, day - 1, 6);
        const prevSid = normalizeDeg(toSidereal(sunLongitude(jdPrev), jdPrev));
        const prevSign = Math.floor(prevSid / 30) + 1;
        if (prevSign !== targetSign) {
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
      }
    }
  }
  return `${year}-01-14`; // fallback
}

/**
 * Generate the full festival calendar for a year.
 */
export function generateFestivalCalendar(year: number): FestivalEntry[] {
  const festivals: FestivalEntry[] = [];

  // ── Major Festivals ──

  // Makar Sankranti (Sun enters Capricorn / sign 10)
  festivals.push({
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः' },
    date: findSankrantiDate(year, 10),
    type: 'major',
    category: 'sankranti',
    description: { en: 'Sun enters Capricorn — harvest festival', hi: 'सूर्य मकर राशि में — फसल का त्योहार', sa: 'सूर्यः मकरराशौ प्रविशति — शस्योत्सवः' },
  });

  // Vasant Panchami (Magha Shukla 5)
  festivals.push({
    name: { en: 'Vasant Panchami', hi: 'वसन्त पञ्चमी', sa: 'वसन्तपञ्चमी' },
    date: findTithiDate(year, 1, 5),
    tithi: 'Magha Shukla 5',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Saraswati — beginning of spring', hi: 'सरस्वती का त्योहार — वसन्त ऋतु का आरम्भ', sa: 'सरस्वतीपूजनम् — वसन्तर्तोः आरम्भः' },
  });

  // Maha Shivaratri (Phalguna Krishna 14 → tithi 29)
  festivals.push({
    name: { en: 'Maha Shivaratri', hi: 'महाशिवरात्रि', sa: 'महाशिवरात्रिः' },
    date: findTithiDate(year, 2, 29),
    tithi: 'Phalguna Krishna 14',
    type: 'major',
    category: 'festival',
    description: { en: 'Great Night of Lord Shiva — fasting and all-night worship', hi: 'भगवान शिव की महारात्रि — उपवास और रात्रि जागरण', sa: 'शिवस्य महारात्रिः — उपवासः रात्रिजागरणं च' },
  });

  // Holi (Phalguna Purnima → tithi 15 in March)
  festivals.push({
    name: { en: 'Holi', hi: 'होली', sa: 'होलिका' },
    date: findPurnimaDate(year, 3),
    tithi: 'Phalguna Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Colors — celebrating spring and good over evil', hi: 'रंगों का त्योहार — वसन्त और सत्य की विजय', sa: 'रङ्गोत्सवः — वसन्तस्य सत्यविजयस्य च उत्सवः' },
  });

  // Ram Navami (Chaitra Shukla 9)
  festivals.push({
    name: { en: 'Ram Navami', hi: 'रामनवमी', sa: 'रामनवमी' },
    date: findTithiDate(year, 4, 9),
    tithi: 'Chaitra Shukla 9',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Rama', hi: 'भगवान राम का जन्मोत्सव', sa: 'श्रीरामजन्मोत्सवः' },
  });

  // Hanuman Jayanti (Chaitra Purnima)
  festivals.push({
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', sa: 'हनुमज्जयन्ती' },
    date: findPurnimaDate(year, 4),
    tithi: 'Chaitra Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Hanuman', hi: 'हनुमान जी का जन्मोत्सव', sa: 'हनुमतः जन्मोत्सवः' },
  });

  // Guru Purnima (Ashadha Purnima)
  festivals.push({
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', sa: 'गुरुपूर्णिमा' },
    date: findPurnimaDate(year, 7),
    tithi: 'Ashadha Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Day of the Guru — honoring teachers and Sage Vyasa', hi: 'गुरु का दिन — शिक्षकों और व्यास ऋषि का सम्मान', sa: 'गुरोः दिनम् — आचार्याणां व्यासमुनेश्च सम्मानम्' },
  });

  // Raksha Bandhan (Shravana Purnima)
  festivals.push({
    name: { en: 'Raksha Bandhan', hi: 'रक्षाबन्धन', sa: 'रक्षाबन्धनम्' },
    date: findPurnimaDate(year, 8),
    tithi: 'Shravana Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Bond of protection — sisters tie rakhi on brothers\' wrists', hi: 'रक्षा का बन्धन — भाई-बहन का त्योहार', sa: 'रक्षायाः बन्धनम् — भ्रातृभगिन्योः उत्सवः' },
  });

  // Krishna Janmashtami (Bhadrapada Krishna 8 → tithi 23)
  festivals.push({
    name: { en: 'Janmashtami', hi: 'जन्माष्टमी', sa: 'जन्माष्टमी' },
    date: findTithiDate(year, 8, 23),
    tithi: 'Bhadrapada Krishna 8',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Krishna', hi: 'भगवान कृष्ण का जन्मोत्सव', sa: 'श्रीकृष्णजन्मोत्सवः' },
  });

  // Ganesh Chaturthi (Bhadrapada Shukla 4)
  festivals.push({
    name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', sa: 'गणेशचतुर्थी' },
    date: findTithiDate(year, 9, 4),
    tithi: 'Bhadrapada Shukla 4',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Ganesha', hi: 'भगवान गणेश का जन्मोत्सव', sa: 'श्रीगणेशजन्मोत्सवः' },
  });

  // Navaratri start (Ashwina Shukla 1)
  festivals.push({
    name: { en: 'Navaratri (Sharad)', hi: 'शारदीय नवरात्रि', sa: 'शारदीयनवरात्रिः' },
    date: findTithiDate(year, 10, 1),
    tithi: 'Ashwina Shukla 1',
    type: 'major',
    category: 'festival',
    description: { en: 'Nine nights of Goddess Durga worship', hi: 'देवी दुर्गा की नौ रातें', sa: 'दुर्गादेव्याः नवरात्रयः' },
  });

  // Dussehra / Vijayadashami (Ashwina Shukla 10)
  festivals.push({
    name: { en: 'Dussehra', hi: 'दशहरा', sa: 'विजयादशमी' },
    date: findTithiDate(year, 10, 10),
    tithi: 'Ashwina Shukla 10',
    type: 'major',
    category: 'festival',
    description: { en: 'Victory of good over evil — Rama\'s victory over Ravana', hi: 'बुराई पर अच्छाई की विजय — राम की रावण पर विजय', sa: 'अधर्मोपरि धर्मस्य विजयः — रामस्य रावणोपरि विजयः' },
  });

  // Diwali (Kartika Amavasya → tithi 30 in Oct/Nov)
  festivals.push({
    name: { en: 'Diwali', hi: 'दीपावली', sa: 'दीपावलिः' },
    date: findAmavasyaDate(year, 10),
    tithi: 'Kartika Amavasya',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Lights — Lakshmi Puja and celebration of light over darkness', hi: 'दीपों का त्योहार — लक्ष्मी पूजा', sa: 'दीपानाम् उत्सवः — लक्ष्मीपूजनम्' },
  });

  // ── Vrat Days (monthly recurring) ──
  for (let m = 1; m <= 12; m++) {
    // Purnima
    festivals.push({
      name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
      date: findPurnimaDate(year, m),
      type: 'vrat',
      category: 'purnima',
      description: { en: 'Full Moon fasting day', hi: 'पूर्णिमा का व्रत', sa: 'पूर्णिमायां व्रतम्' },
    });

    // Amavasya
    festivals.push({
      name: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावास्या' },
      date: findAmavasyaDate(year, m),
      type: 'vrat',
      category: 'amavasya',
      description: { en: 'New Moon — ancestral offerings', hi: 'अमावस्या — पितृ तर्पण', sa: 'अमावास्या — पितृतर्पणम्' },
    });

    // Ekadashi (Shukla & Krishna)
    const ekadashi = findEkadashiDates(year, m);
    festivals.push({
      name: { en: 'Shukla Ekadashi', hi: 'शुक्ल एकादशी', sa: 'शुक्लैकादशी' },
      date: ekadashi.shukla,
      type: 'vrat',
      category: 'ekadashi',
      description: { en: 'Fasting for Lord Vishnu — Shukla Paksha', hi: 'विष्णु व्रत — शुक्ल पक्ष', sa: 'विष्णुव्रतम् — शुक्लपक्षे' },
    });
    festivals.push({
      name: { en: 'Krishna Ekadashi', hi: 'कृष्ण एकादशी', sa: 'कृष्णैकादशी' },
      date: ekadashi.krishna,
      type: 'vrat',
      category: 'ekadashi',
      description: { en: 'Fasting for Lord Vishnu — Krishna Paksha', hi: 'विष्णु व्रत — कृष्ण पक्ष', sa: 'विष्णुव्रतम् — कृष्णपक्षे' },
    });

    // Sankashti Chaturthi
    festivals.push({
      name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टिचतुर्थी' },
      date: findChaturthiDate(year, m),
      type: 'vrat',
      category: 'chaturthi',
      description: { en: 'Fasting for Lord Ganesha — moonrise ends fast', hi: 'गणेश व्रत — चन्द्रोदय पर व्रत समाप्त', sa: 'गणेशव्रतम् — चन्द्रोदये व्रतसमाप्तिः' },
    });

    // Pradosham
    const pradosham = findPradoshamDates(year, m);
    festivals.push({
      name: { en: 'Shukla Pradosham', hi: 'शुक्ल प्रदोष', sa: 'शुक्लप्रदोषः' },
      date: pradosham.shukla,
      type: 'vrat',
      category: 'pradosham',
      description: { en: 'Twilight worship of Lord Shiva — Shukla Trayodashi', hi: 'शिव की संध्याकालीन पूजा — शुक्ल त्रयोदशी', sa: 'शिवस्य सन्ध्याकालपूजनम् — शुक्लत्रयोदश्यां' },
    });
    festivals.push({
      name: { en: 'Krishna Pradosham', hi: 'कृष्ण प्रदोष', sa: 'कृष्णप्रदोषः' },
      date: pradosham.krishna,
      type: 'vrat',
      category: 'pradosham',
      description: { en: 'Twilight worship of Lord Shiva — Krishna Trayodashi', hi: 'शिव की संध्याकालीन पूजा — कृष्ण त्रयोदशी', sa: 'शिवस्य सन्ध्याकालपूजनम् — कृष्णत्रयोदश्यां' },
    });
  }

  // Sort by date
  festivals.sort((a, b) => a.date.localeCompare(b.date));

  return festivals;
}
