/**
 * Traditional name syllables for each Nakshatra pada
 * Each nakshatra has 4 padas, each pada has a specific starting syllable
 *
 * Scripts: en (Latin), hi (Devanagari), sa (Devanagari/Sanskrit),
 * ta (Tamil), te (Telugu), bn (Bengali), kn (Kannada),
 * mr (Devanagari/Marathi), gu (Gujarati), mai (Devanagari/Maithili)
 */

export interface NakshatraSyllable {
  nakshatraId: number;
  pada: number;
  syllables: { en: string; hi: string; sa: string; ta: string; te: string; bn: string; kn: string; mr: string; gu: string; mai: string }[];
}

// Nakshatra → Pada → Starting syllables for baby names
export const NAKSHATRA_SYLLABLES: Record<number, { en: string; hi: string; sa: string; ta: string; te: string; bn: string; kn: string; mr: string; gu: string; mai: string }[]> = {
  // 1. Ashwini
  1: [
    { en: 'Chu', hi: 'चू', sa: 'चू', ta: 'சு', te: 'చు', bn: 'চু', kn: 'ಚು', mr: 'चू', gu: 'ચુ', mai: 'चू' },
    { en: 'Che', hi: 'चे', sa: 'चे', ta: 'சே', te: 'చే', bn: 'চে', kn: 'ಚೇ', mr: 'चे', gu: 'ચે', mai: 'चे' },
    { en: 'Cho', hi: 'चो', sa: 'चो', ta: 'சோ', te: 'చో', bn: 'চো', kn: 'ಚೋ', mr: 'चो', gu: 'ચો', mai: 'चो' },
    { en: 'La', hi: 'ला', sa: 'ला', ta: 'லா', te: 'లా', bn: 'লা', kn: 'ಲಾ', mr: 'ला', gu: 'લા', mai: 'ला' },
  ],
  // 2. Bharani
  2: [
    { en: 'Li', hi: 'ली', sa: 'ली', ta: 'லி', te: 'లి', bn: 'লি', kn: 'ಲಿ', mr: 'ली', gu: 'લિ', mai: 'ली' },
    { en: 'Lu', hi: 'लू', sa: 'लू', ta: 'லு', te: 'లు', bn: 'লু', kn: 'ಲು', mr: 'लू', gu: 'લુ', mai: 'लू' },
    { en: 'Le', hi: 'ले', sa: 'ले', ta: 'லே', te: 'లే', bn: 'লে', kn: 'ಲೇ', mr: 'ले', gu: 'લે', mai: 'ले' },
    { en: 'Lo', hi: 'लो', sa: 'लो', ta: 'லோ', te: 'లో', bn: 'লো', kn: 'ಲೋ', mr: 'लो', gu: 'લો', mai: 'लो' },
  ],
  // 3. Krittika
  3: [
    { en: 'A', hi: 'अ', sa: 'अ', ta: 'அ', te: 'అ', bn: 'অ', kn: 'ಅ', mr: 'अ', gu: 'અ', mai: 'अ' },
    { en: 'I', hi: 'ई', sa: 'ई', ta: 'ஈ', te: 'ఈ', bn: 'ঈ', kn: 'ಈ', mr: 'ई', gu: 'ઈ', mai: 'ई' },
    { en: 'U', hi: 'उ', sa: 'उ', ta: 'உ', te: 'ఉ', bn: 'উ', kn: 'ಉ', mr: 'उ', gu: 'ઉ', mai: 'उ' },
    { en: 'E', hi: 'ए', sa: 'ए', ta: 'ஏ', te: 'ఏ', bn: 'এ', kn: 'ಏ', mr: 'ए', gu: 'એ', mai: 'ए' },
  ],
  // 4. Rohini
  4: [
    { en: 'O', hi: 'ओ', sa: 'ओ', ta: 'ஓ', te: 'ఓ', bn: 'ও', kn: 'ಓ', mr: 'ओ', gu: 'ઓ', mai: 'ओ' },
    { en: 'Va', hi: 'वा', sa: 'वा', ta: 'வா', te: 'వా', bn: 'বা', kn: 'ವಾ', mr: 'वा', gu: 'વા', mai: 'वा' },
    { en: 'Vi', hi: 'वि', sa: 'वि', ta: 'வி', te: 'వి', bn: 'বি', kn: 'ವಿ', mr: 'वि', gu: 'વિ', mai: 'वि' },
    { en: 'Vu', hi: 'वु', sa: 'वु', ta: 'வு', te: 'వు', bn: 'বু', kn: 'ವು', mr: 'वु', gu: 'વુ', mai: 'वु' },
  ],
  // 5. Mrigashira
  5: [
    { en: 'Ve', hi: 'वे', sa: 'वे', ta: 'வே', te: 'వే', bn: 'বে', kn: 'ವೇ', mr: 'वे', gu: 'વે', mai: 'वे' },
    { en: 'Vo', hi: 'वो', sa: 'वो', ta: 'வோ', te: 'వో', bn: 'বো', kn: 'ವೋ', mr: 'वो', gu: 'વો', mai: 'वो' },
    { en: 'Ka', hi: 'का', sa: 'का', ta: 'கா', te: 'కా', bn: 'কা', kn: 'ಕಾ', mr: 'का', gu: 'કા', mai: 'का' },
    { en: 'Ki', hi: 'की', sa: 'की', ta: 'கி', te: 'కి', bn: 'কি', kn: 'ಕಿ', mr: 'की', gu: 'કિ', mai: 'की' },
  ],
  // 6. Ardra
  6: [
    { en: 'Ku', hi: 'कु', sa: 'कु', ta: 'கு', te: 'కు', bn: 'কু', kn: 'ಕು', mr: 'कु', gu: 'કુ', mai: 'कु' },
    { en: 'Gha', hi: 'घ', sa: 'घ', ta: 'க', te: 'ఘ', bn: 'ঘ', kn: 'ಘ', mr: 'घ', gu: 'ઘ', mai: 'घ' },
    { en: 'Ng', hi: 'ङ', sa: 'ङ', ta: 'ங', te: 'ఙ', bn: 'ঙ', kn: 'ಙ', mr: 'ङ', gu: 'ઙ', mai: 'ङ' },
    { en: 'Na', hi: 'ना', sa: 'ना', ta: 'நா', te: 'నా', bn: 'না', kn: 'ನಾ', mr: 'ना', gu: 'ના', mai: 'ना' },
  ],
  // 7. Punarvasu
  7: [
    { en: 'Ke', hi: 'के', sa: 'के', ta: 'கே', te: 'కే', bn: 'কে', kn: 'ಕೇ', mr: 'के', gu: 'કે', mai: 'के' },
    { en: 'Ko', hi: 'को', sa: 'को', ta: 'கோ', te: 'కో', bn: 'কো', kn: 'ಕೋ', mr: 'को', gu: 'કો', mai: 'को' },
    { en: 'Ha', hi: 'हा', sa: 'हा', ta: 'ஹா', te: 'హా', bn: 'হা', kn: 'ಹಾ', mr: 'हा', gu: 'હા', mai: 'हा' },
    { en: 'Hi', hi: 'ही', sa: 'ही', ta: 'ஹி', te: 'హి', bn: 'হি', kn: 'ಹಿ', mr: 'ही', gu: 'હિ', mai: 'ही' },
  ],
  // 8. Pushya
  8: [
    { en: 'Hu', hi: 'हू', sa: 'हू', ta: 'ஹு', te: 'హు', bn: 'হু', kn: 'ಹು', mr: 'हू', gu: 'હુ', mai: 'हू' },
    { en: 'He', hi: 'हे', sa: 'हे', ta: 'ஹே', te: 'హే', bn: 'হে', kn: 'ಹೇ', mr: 'हे', gu: 'હે', mai: 'हे' },
    { en: 'Ho', hi: 'हो', sa: 'हो', ta: 'ஹோ', te: 'హో', bn: 'হো', kn: 'ಹೋ', mr: 'हो', gu: 'હો', mai: 'हो' },
    { en: 'Da', hi: 'डा', sa: 'डा', ta: 'டா', te: 'డా', bn: 'ডা', kn: 'ಡಾ', mr: 'डा', gu: 'ડા', mai: 'डा' },
  ],
  // 9. Ashlesha
  9: [
    { en: 'Di', hi: 'डी', sa: 'डी', ta: 'டி', te: 'డి', bn: 'ডি', kn: 'ಡಿ', mr: 'डी', gu: 'ડિ', mai: 'डी' },
    { en: 'Du', hi: 'डू', sa: 'डू', ta: 'டு', te: 'డు', bn: 'ডু', kn: 'ಡು', mr: 'डू', gu: 'ડુ', mai: 'डू' },
    { en: 'De', hi: 'डे', sa: 'डे', ta: 'டே', te: 'డే', bn: 'ডে', kn: 'ಡೇ', mr: 'डे', gu: 'ડે', mai: 'डे' },
    { en: 'Do', hi: 'डो', sa: 'डो', ta: 'டோ', te: 'డో', bn: 'ডো', kn: 'ಡೋ', mr: 'डो', gu: 'ડો', mai: 'डो' },
  ],
  // 10. Magha
  10: [
    { en: 'Ma', hi: 'मा', sa: 'मा', ta: 'மா', te: 'మా', bn: 'মা', kn: 'ಮಾ', mr: 'मा', gu: 'મા', mai: 'मा' },
    { en: 'Mi', hi: 'मी', sa: 'मी', ta: 'மி', te: 'మి', bn: 'মি', kn: 'ಮಿ', mr: 'मी', gu: 'મિ', mai: 'मी' },
    { en: 'Mu', hi: 'मू', sa: 'मू', ta: 'மு', te: 'ము', bn: 'মু', kn: 'ಮು', mr: 'मू', gu: 'મુ', mai: 'मू' },
    { en: 'Me', hi: 'मे', sa: 'मे', ta: 'மே', te: 'మే', bn: 'মে', kn: 'ಮೇ', mr: 'मे', gu: 'મે', mai: 'मे' },
  ],
  // 11. Purva Phalguni
  11: [
    { en: 'Mo', hi: 'मो', sa: 'मो', ta: 'மோ', te: 'మో', bn: 'মো', kn: 'ಮೋ', mr: 'मो', gu: 'મો', mai: 'मो' },
    { en: 'Ta', hi: 'टा', sa: 'टा', ta: 'டா', te: 'టా', bn: 'টা', kn: 'ಟಾ', mr: 'टा', gu: 'ટા', mai: 'टा' },
    { en: 'Ti', hi: 'टी', sa: 'टी', ta: 'டி', te: 'టి', bn: 'টি', kn: 'ಟಿ', mr: 'टी', gu: 'ટિ', mai: 'टी' },
    { en: 'Tu', hi: 'टू', sa: 'टू', ta: 'டு', te: 'టు', bn: 'টু', kn: 'ಟು', mr: 'टू', gu: 'ટુ', mai: 'टू' },
  ],
  // 12. Uttara Phalguni
  12: [
    { en: 'Te', hi: 'टे', sa: 'टे', ta: 'டே', te: 'టే', bn: 'টে', kn: 'ಟೇ', mr: 'टे', gu: 'ટે', mai: 'टे' },
    { en: 'To', hi: 'टो', sa: 'टो', ta: 'டோ', te: 'టో', bn: 'টো', kn: 'ಟೋ', mr: 'टो', gu: 'ટો', mai: 'टो' },
    { en: 'Pa', hi: 'पा', sa: 'पा', ta: 'பா', te: 'పా', bn: 'পা', kn: 'ಪಾ', mr: 'पा', gu: 'પા', mai: 'पा' },
    { en: 'Pi', hi: 'पी', sa: 'पी', ta: 'பி', te: 'పి', bn: 'পি', kn: 'ಪಿ', mr: 'पी', gu: 'પિ', mai: 'पी' },
  ],
  // 13. Hasta
  13: [
    { en: 'Pu', hi: 'पू', sa: 'पू', ta: 'பு', te: 'పు', bn: 'পু', kn: 'ಪು', mr: 'पू', gu: 'પુ', mai: 'पू' },
    { en: 'Sha', hi: 'ष', sa: 'ष', ta: 'ஷ', te: 'ష', bn: 'ষ', kn: 'ಷ', mr: 'ष', gu: 'ષ', mai: 'ष' },
    { en: 'Na', hi: 'ण', sa: 'ण', ta: 'ண', te: 'ణ', bn: 'ণ', kn: 'ಣ', mr: 'ण', gu: 'ણ', mai: 'ण' },
    { en: 'Tha', hi: 'ठ', sa: 'ठ', ta: 'ட', te: 'ఠ', bn: 'ঠ', kn: 'ಠ', mr: 'ठ', gu: 'ઠ', mai: 'ठ' },
  ],
  // 14. Chitra
  14: [
    { en: 'Pe', hi: 'पे', sa: 'पे', ta: 'பே', te: 'పే', bn: 'পে', kn: 'ಪೇ', mr: 'पे', gu: 'પે', mai: 'पे' },
    { en: 'Po', hi: 'पो', sa: 'पो', ta: 'போ', te: 'పో', bn: 'পো', kn: 'ಪೋ', mr: 'पो', gu: 'પો', mai: 'पो' },
    { en: 'Ra', hi: 'रा', sa: 'रा', ta: 'ரா', te: 'రా', bn: 'রা', kn: 'ರಾ', mr: 'रा', gu: 'રા', mai: 'रा' },
    { en: 'Ri', hi: 'री', sa: 'री', ta: 'ரி', te: 'రి', bn: 'রি', kn: 'ರಿ', mr: 'री', gu: 'રિ', mai: 'री' },
  ],
  // 15. Swati
  15: [
    { en: 'Ru', hi: 'रू', sa: 'रू', ta: 'ரு', te: 'రు', bn: 'রু', kn: 'ರು', mr: 'रू', gu: 'રુ', mai: 'रू' },
    { en: 'Re', hi: 'रे', sa: 'रे', ta: 'ரே', te: 'రే', bn: 'রে', kn: 'ರೇ', mr: 'रे', gu: 'રે', mai: 'रे' },
    { en: 'Ro', hi: 'रो', sa: 'रो', ta: 'ரோ', te: 'రో', bn: 'রো', kn: 'ರೋ', mr: 'रो', gu: 'રો', mai: 'रो' },
    { en: 'Ta', hi: 'ता', sa: 'ता', ta: 'தா', te: 'తా', bn: 'তা', kn: 'ತಾ', mr: 'ता', gu: 'તા', mai: 'ता' },
  ],
  // 16. Vishakha
  16: [
    { en: 'Ti', hi: 'ती', sa: 'ती', ta: 'தி', te: 'తి', bn: 'তি', kn: 'ತಿ', mr: 'ती', gu: 'તિ', mai: 'ती' },
    { en: 'Tu', hi: 'तू', sa: 'तू', ta: 'து', te: 'తు', bn: 'তু', kn: 'ತು', mr: 'तू', gu: 'તુ', mai: 'तू' },
    { en: 'Te', hi: 'ते', sa: 'ते', ta: 'தே', te: 'తే', bn: 'তে', kn: 'ತೇ', mr: 'ते', gu: 'તે', mai: 'ते' },
    { en: 'To', hi: 'तो', sa: 'तो', ta: 'தோ', te: 'తో', bn: 'তো', kn: 'ತೋ', mr: 'तो', gu: 'તો', mai: 'तो' },
  ],
  // 17. Anuradha
  17: [
    { en: 'Na', hi: 'ना', sa: 'ना', ta: 'நா', te: 'నా', bn: 'না', kn: 'ನಾ', mr: 'ना', gu: 'ના', mai: 'ना' },
    { en: 'Ni', hi: 'नी', sa: 'नी', ta: 'நி', te: 'ని', bn: 'নি', kn: 'ನಿ', mr: 'नी', gu: 'ની', mai: 'नी' },
    { en: 'Nu', hi: 'नू', sa: 'नू', ta: 'நு', te: 'ను', bn: 'নু', kn: 'ನು', mr: 'नू', gu: 'નુ', mai: 'नू' },
    { en: 'Ne', hi: 'ने', sa: 'ने', ta: 'நே', te: 'నే', bn: 'নে', kn: 'ನೇ', mr: 'ने', gu: 'ને', mai: 'ने' },
  ],
  // 18. Jyeshtha
  18: [
    { en: 'No', hi: 'नो', sa: 'नो', ta: 'நோ', te: 'నో', bn: 'নো', kn: 'ನೋ', mr: 'नो', gu: 'નો', mai: 'नो' },
    { en: 'Ya', hi: 'या', sa: 'या', ta: 'யா', te: 'యా', bn: 'যা', kn: 'ಯಾ', mr: 'या', gu: 'યા', mai: 'या' },
    { en: 'Yi', hi: 'यी', sa: 'यी', ta: 'யி', te: 'యి', bn: 'যি', kn: 'ಯಿ', mr: 'यी', gu: 'યિ', mai: 'यी' },
    { en: 'Yu', hi: 'यू', sa: 'यू', ta: 'யு', te: 'యు', bn: 'যু', kn: 'ಯು', mr: 'यू', gu: 'યુ', mai: 'यू' },
  ],
  // 19. Moola
  19: [
    { en: 'Ye', hi: 'ये', sa: 'ये', ta: 'யே', te: 'యే', bn: 'যে', kn: 'ಯೇ', mr: 'ये', gu: 'યે', mai: 'ये' },
    { en: 'Yo', hi: 'यो', sa: 'यो', ta: 'யோ', te: 'యో', bn: 'যো', kn: 'ಯೋ', mr: 'यो', gu: 'યો', mai: 'यो' },
    { en: 'Bha', hi: 'भा', sa: 'भा', ta: 'பா', te: 'భా', bn: 'ভা', kn: 'ಭಾ', mr: 'भा', gu: 'ભા', mai: 'भा' },
    { en: 'Bhi', hi: 'भी', sa: 'भी', ta: 'பி', te: 'భి', bn: 'ভি', kn: 'ಭಿ', mr: 'भी', gu: 'ભિ', mai: 'भी' },
  ],
  // 20. Purva Ashadha
  20: [
    { en: 'Bhu', hi: 'भू', sa: 'भू', ta: 'பு', te: 'భు', bn: 'ভু', kn: 'ಭು', mr: 'भू', gu: 'ભુ', mai: 'भू' },
    { en: 'Dha', hi: 'धा', sa: 'धा', ta: 'தா', te: 'ధా', bn: 'ধা', kn: 'ಧಾ', mr: 'धा', gu: 'ધા', mai: 'धा' },
    { en: 'Pha', hi: 'फा', sa: 'फा', ta: 'பா', te: 'ఫా', bn: 'ফা', kn: 'ಫಾ', mr: 'फा', gu: 'ફા', mai: 'फा' },
    { en: 'Dha', hi: 'ढा', sa: 'ढा', ta: 'டா', te: 'ఢా', bn: 'ঢা', kn: 'ಢಾ', mr: 'ढा', gu: 'ઢા', mai: 'ढा' },
  ],
  // 21. Uttara Ashadha
  21: [
    { en: 'Bhe', hi: 'भे', sa: 'भे', ta: 'பே', te: 'భే', bn: 'ভে', kn: 'ಭೇ', mr: 'भे', gu: 'ભે', mai: 'भे' },
    { en: 'Bho', hi: 'भो', sa: 'भो', ta: 'போ', te: 'భో', bn: 'ভো', kn: 'ಭೋ', mr: 'भो', gu: 'ભો', mai: 'भो' },
    { en: 'Ja', hi: 'जा', sa: 'जा', ta: 'ஜா', te: 'జా', bn: 'জা', kn: 'ಜಾ', mr: 'जा', gu: 'જા', mai: 'जा' },
    { en: 'Ji', hi: 'जी', sa: 'जी', ta: 'ஜி', te: 'జి', bn: 'জি', kn: 'ಜಿ', mr: 'जी', gu: 'જિ', mai: 'जी' },
  ],
  // 22. Shravana
  22: [
    { en: 'Ju/Khi', hi: 'खी', sa: 'खी', ta: 'கி', te: 'ఖి', bn: 'খি', kn: 'ಖಿ', mr: 'खी', gu: 'ખિ', mai: 'खी' },
    { en: 'Je/Khu', hi: 'खू', sa: 'खू', ta: 'கு', te: 'ఖు', bn: 'খু', kn: 'ಖು', mr: 'खू', gu: 'ખુ', mai: 'खू' },
    { en: 'Jo/Khe', hi: 'खे', sa: 'खे', ta: 'கே', te: 'ఖే', bn: 'খে', kn: 'ಖೇ', mr: 'खे', gu: 'ખે', mai: 'खे' },
    { en: 'Gha', hi: 'खो', sa: 'खो', ta: 'கோ', te: 'ఖో', bn: 'খো', kn: 'ಖೋ', mr: 'खो', gu: 'ખો', mai: 'खो' },
  ],
  // 23. Dhanishtha
  23: [
    { en: 'Ga', hi: 'गा', sa: 'गा', ta: 'கா', te: 'గా', bn: 'গা', kn: 'ಗಾ', mr: 'गा', gu: 'ગા', mai: 'गा' },
    { en: 'Gi', hi: 'गी', sa: 'गी', ta: 'கி', te: 'గి', bn: 'গি', kn: 'ಗಿ', mr: 'गी', gu: 'ગિ', mai: 'गी' },
    { en: 'Gu', hi: 'गू', sa: 'गू', ta: 'கு', te: 'గు', bn: 'গু', kn: 'ಗು', mr: 'गू', gu: 'ગુ', mai: 'गू' },
    { en: 'Ge', hi: 'गे', sa: 'गे', ta: 'கே', te: 'గే', bn: 'গে', kn: 'ಗೇ', mr: 'गे', gu: 'ગે', mai: 'गे' },
  ],
  // 24. Shatabhisha
  24: [
    { en: 'Go', hi: 'गो', sa: 'गो', ta: 'கோ', te: 'గో', bn: 'গো', kn: 'ಗೋ', mr: 'गो', gu: 'ગો', mai: 'गो' },
    { en: 'Sa', hi: 'सा', sa: 'सा', ta: 'சா', te: 'సా', bn: 'সা', kn: 'ಸಾ', mr: 'सा', gu: 'સા', mai: 'सा' },
    { en: 'Si', hi: 'सी', sa: 'सी', ta: 'சி', te: 'సి', bn: 'সি', kn: 'ಸಿ', mr: 'सी', gu: 'સિ', mai: 'सी' },
    { en: 'Su', hi: 'सू', sa: 'सू', ta: 'சு', te: 'సు', bn: 'সু', kn: 'ಸು', mr: 'सू', gu: 'સુ', mai: 'सू' },
  ],
  // 25. Purva Bhadrapada
  25: [
    { en: 'Se', hi: 'से', sa: 'से', ta: 'சே', te: 'సే', bn: 'সে', kn: 'ಸೇ', mr: 'से', gu: 'સે', mai: 'से' },
    { en: 'So', hi: 'सो', sa: 'सो', ta: 'சோ', te: 'సో', bn: 'সো', kn: 'ಸೋ', mr: 'सो', gu: 'સો', mai: 'सो' },
    { en: 'Da', hi: 'दा', sa: 'दा', ta: 'தா', te: 'దా', bn: 'দা', kn: 'ದಾ', mr: 'दा', gu: 'દા', mai: 'दा' },
    { en: 'Di', hi: 'दी', sa: 'दी', ta: 'தி', te: 'ది', bn: 'দি', kn: 'ದಿ', mr: 'दी', gu: 'દિ', mai: 'दी' },
  ],
  // 26. Uttara Bhadrapada
  26: [
    { en: 'Du', hi: 'दू', sa: 'दू', ta: 'து', te: 'దు', bn: 'দু', kn: 'ದು', mr: 'दू', gu: 'દુ', mai: 'दू' },
    { en: 'Tha', hi: 'थ', sa: 'थ', ta: 'த', te: 'థ', bn: 'থ', kn: 'ಥ', mr: 'थ', gu: 'થ', mai: 'थ' },
    { en: 'Jha', hi: 'झ', sa: 'झ', ta: 'ஜ', te: 'ఝ', bn: 'ঝ', kn: 'ಝ', mr: 'झ', gu: 'ઝ', mai: 'झ' },
    { en: 'Jna', hi: 'ञ', sa: 'ञ', ta: 'ஞ', te: 'ఞ', bn: 'ঞ', kn: 'ಞ', mr: 'ञ', gu: 'ઞ', mai: 'ञ' },
  ],
  // 27. Revati
  27: [
    { en: 'De', hi: 'दे', sa: 'दे', ta: 'தே', te: 'దే', bn: 'দে', kn: 'ದೇ', mr: 'दे', gu: 'દે', mai: 'दे' },
    { en: 'Do', hi: 'दो', sa: 'दो', ta: 'தோ', te: 'దో', bn: 'দো', kn: 'ದೋ', mr: 'दो', gu: 'દો', mai: 'दो' },
    { en: 'Cha', hi: 'चा', sa: 'चा', ta: 'சா', te: 'చా', bn: 'চা', kn: 'ಚಾ', mr: 'चा', gu: 'ચા', mai: 'चा' },
    { en: 'Chi', hi: 'ची', sa: 'ची', ta: 'சி', te: 'చి', bn: 'চি', kn: 'ಚಿ', mr: 'ची', gu: 'ચિ', mai: 'ची' },
  ],
};

// Sample names for each syllable group (curated)
export const SAMPLE_NAMES: Record<string, string[]> = {
  'Chu': ['Chudamani', 'Chulbuli'],
  'Che': ['Chetana', 'Chetan'],
  'Cho': ['Chokhi', 'Chola'],
  'La': ['Lakshmi', 'Lata', 'Lavanya', 'Lalita'],
  'Li': ['Lila', 'Lilavati'],
  'Lu': ['Lubdha'],
  'Le': ['Leela', 'Lekha'],
  'Lo': ['Lokesh', 'Lochana'],
  'A': ['Arjun', 'Aarav', 'Aanya', 'Ananya', 'Ashwin', 'Aditya', 'Aditi'],
  'I': ['Isha', 'Ishaan', 'Indira'],
  'U': ['Uma', 'Uday', 'Udaya'],
  'E': ['Ekta', 'Esha'],
  'O': ['Om', 'Omkar', 'Ojas'],
  'Va': ['Varun', 'Vasundhara', 'Vansh', 'Vani'],
  'Vi': ['Virat', 'Vidya', 'Vivaan', 'Vinay'],
  'Vu': ['Vruddhi'],
  'Ve': ['Vedant', 'Veena', 'Veer'],
  'Vo': ['Vojit'],
  'Ka': ['Karan', 'Kavya', 'Kashvi', 'Kartik'],
  'Ki': ['Kiara', 'Kishan', 'Kiran'],
  'Ku': ['Kunal', 'Kumari', 'Kundan'],
  'Ke': ['Keshav', 'Ketaki'],
  'Ko': ['Komal', 'Kovid'],
  'Ha': ['Harsh', 'Harini', 'Hansika'],
  'Hi': ['Hitesh', 'Himani', 'Hiral'],
  'Hu': ['Humira'],
  'He': ['Hema', 'Hemant'],
  'Ho': ['Homi'],
  'Da': ['Daksh', 'Darsh', 'Darpan'],
  'Ma': ['Manish', 'Manvi', 'Madhav', 'Maya'],
  'Mi': ['Mihir', 'Mira', 'Milan'],
  'Mu': ['Mukesh', 'Mukti', 'Mudit'],
  'Me': ['Meera', 'Medha', 'Megha'],
  'Mo': ['Mohit', 'Moksha', 'Mohan'],
  'Ta': ['Tanvi', 'Tarun', 'Tara'],
  'Ti': ['Tithi', 'Tirth'],
  'Tu': ['Tulsi', 'Tushar'],
  'Te': ['Tej', 'Tejas'],
  'To': ['Toshit'],
  'Pa': ['Pari', 'Parth', 'Pallavi', 'Param'],
  'Pi': ['Piyush', 'Pinki'],
  'Pu': ['Puja', 'Pulkit', 'Puneet', 'Pushkar'],
  'Pe': ['Prem'],
  'Po': ['Pooja'],
  'Ra': ['Raghav', 'Radha', 'Rajan', 'Raksha'],
  'Ri': ['Rishi', 'Richa', 'Ridhi', 'Ritik'],
  'Ru': ['Rudra', 'Ruchi', 'Rupal'],
  'Re': ['Reema', 'Revant'],
  'Ro': ['Rohan', 'Roshni', 'Roma'],
  'Na': ['Navya', 'Naman', 'Nandini', 'Nakul'],
  'Ni': ['Nikhil', 'Nisha', 'Nidhi', 'Nirav'],
  'Nu': ['Nutan'],
  'Ne': ['Neha', 'Neel'],
  'No': ['Nosheen'],
  'Ya': ['Yash', 'Yamini', 'Yashvi'],
  'Yi': ['Yitendra'],
  'Yu': ['Yuvan', 'Yukti'],
  'Ye': ['Yeshoda'],
  'Yo': ['Yogesh', 'Yogini', 'Yogi'],
  'Bha': ['Bhavya', 'Bharat', 'Bhavana'],
  'Bhi': ['Bhima'],
  'Bhu': ['Bhuvan', 'Bhumi'],
  'Dha': ['Dhanvi', 'Dharma', 'Dhanya'],
  'Bhe': ['Bhekhar'],
  'Bho': ['Bhola'],
  'Ja': ['Jayant', 'Jaya', 'Janvi'],
  'Ji': ['Jigna', 'Jiya', 'Jitesh'],
  'Ga': ['Gaurav', 'Garima', 'Gautam'],
  'Gi': ['Girish', 'Gita'],
  'Gu': ['Gunjan', 'Gulab'],
  'Ge': ['Geeta'],
  'Go': ['Govind', 'Gopal'],
  'Sa': ['Saanvi', 'Sahil', 'Sakshi', 'Sameer'],
  'Si': ['Siddharth', 'Simran', 'Sita'],
  'Su': ['Suraj', 'Sunita', 'Suresh', 'Sudha'],
  'Se': ['Seema'],
  'So': ['Sonal', 'Soham', 'Sonia'],
  'De': ['Dev', 'Deepak', 'Devika'],
  'Do': ['Dolly'],
  'Cha': ['Chandra', 'Chaitanya'],
  'Chi': ['Chinmay', 'Chitra'],
  'Sha': ['Shankar', 'Shanti', 'Shashi'],
  'Pha': ['Phalgun'],
};
