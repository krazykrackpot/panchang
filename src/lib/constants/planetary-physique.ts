/**
 * Planetary Physique — body characteristics associated with each planet.
 *
 * When a planet strongly influences the ascendant (lagna lord, in lagna,
 * or aspects lagna), it imprints physical characteristics on the native.
 *
 * Reference: BPHS Ch.3 (Graha Swarupa), Phaladeepika Ch.2
 */

export interface PlanetaryPhysique {
  planetId: number;
  build: { en: string; hi: string };
  complexion: { en: string; hi: string };
  face: { en: string; hi: string };
  hair: { en: string; hi: string };
  eyes: { en: string; hi: string };
  constitution: { en: string; hi: string };
  distinguishing: { en: string; hi: string };
}

export const PLANETARY_PHYSIQUE: PlanetaryPhysique[] = [
  {
    planetId: 0, // Sun
    build: { en: 'Medium, well-proportioned frame with strong bones', hi: 'मध्यम, सुडौल शरीर, मजबूत हड्डियाँ' },
    complexion: { en: 'Honey-colored or coppery complexion, flushed', hi: 'मधु-वर्ण या ताम्र रंग, लालिमायुक्त' },
    face: { en: 'Square or oval face, prominent forehead', hi: 'वर्गाकार या अंडाकार मुख, उभरा ललाट' },
    hair: { en: 'Sparse, thinning early, tawny or light brown', hi: 'विरल, शीघ्र पतले, भूरे-पीले' },
    eyes: { en: 'Honey-colored, small but penetrating gaze', hi: 'मधु-वर्ण, छोटी पर तीक्ष्ण दृष्टि' },
    constitution: { en: 'Pitta-dominant (bilious). Strong digestion, prone to heat-related issues.', hi: 'पित्त प्रधान। प्रबल पाचन, ताप-संबंधी विकारों की प्रवृत्ति।' },
    distinguishing: { en: 'Regal bearing, commanding presence, walks with authority', hi: 'राजसी चाल, आदेशात्मक उपस्थिति' },
  },
  {
    planetId: 1, // Moon
    build: { en: 'Soft, well-nourished, rounded frame', hi: 'कोमल, पुष्ट, गोलाकार शरीर' },
    complexion: { en: 'Fair, milky white, sometimes pale', hi: 'गोरा, दुग्ध-वर्ण, कभी पीला' },
    face: { en: 'Round face with pleasant, attractive features', hi: 'गोल मुख, सुन्दर आकर्षक लक्षण' },
    hair: { en: 'Thick, wavy, dark and lustrous', hi: 'घने, लहरदार, काले और चमकदार' },
    eyes: { en: 'Large, beautiful, expressive eyes', hi: 'बड़ी, सुन्दर, भावपूर्ण आँखें' },
    constitution: { en: 'Kapha-Vata (phlegmatic). Prone to water retention, emotional sensitivity.', hi: 'कफ-वात प्रधान। जल-धारण और भावनात्मक संवेदनशीलता की प्रवृत्ति।' },
    distinguishing: { en: 'Gentle demeanor, magnetic charm, changes in appearance with mood', hi: 'सौम्य स्वभाव, आकर्षक व्यक्तित्व, मनोदशा से बदलता रूप' },
  },
  {
    planetId: 2, // Mars
    build: { en: 'Lean, muscular, athletic frame with strong limbs', hi: 'दुबला, बलिष्ठ, कसा हुआ शरीर' },
    complexion: { en: 'Reddish or ruddy complexion, flushed cheeks', hi: 'लाल या ताम्र रंग, लाल गाल' },
    face: { en: 'Sharp features, angular jaw, fierce expression', hi: 'तीखे नैन-नक्श, कोणीय जबड़ा, उग्र भाव' },
    hair: { en: 'Short, curly or wiry, reddish tinge', hi: 'छोटे, घुंघराले, लाल आभा' },
    eyes: { en: 'Reddish, sharp, intimidating gaze', hi: 'लाल, तीखी, भय उत्पन्न करने वाली दृष्टि' },
    constitution: { en: 'Pitta-dominant. High body heat, prone to inflammation, injuries, fevers.', hi: 'पित्त प्रधान। उच्च शरीर ताप, शोथ, चोट, ज्वर की प्रवृत्ति।' },
    distinguishing: { en: 'Scars or marks on body, restless energy, warrior-like posture', hi: 'शरीर पर निशान, अशांत ऊर्जा, योद्धा जैसी मुद्रा' },
  },
  {
    planetId: 3, // Mercury
    build: { en: 'Slim, youthful frame, neither tall nor short', hi: 'पतला, युवा शरीर, न लम्बा न छोटा' },
    complexion: { en: 'Greenish or dusky, grass-like hue', hi: 'हरित या श्यामल, तृण-सा रंग' },
    face: { en: 'Oval face with witty, intelligent expression', hi: 'अंडाकार मुख, चतुर, बुद्धिमान भाव' },
    hair: { en: 'Dark, fine-textured, well-groomed', hi: 'काले, सूक्ष्म, सुव्यवस्थित' },
    eyes: { en: 'Quick-moving, bright, curious eyes', hi: 'चंचल, चमकदार, जिज्ञासु आँखें' },
    constitution: { en: 'Tridosha (mixed). Adapts to environment, nervous system sensitive.', hi: 'त्रिदोष (मिश्र)। वातावरण अनुकूल, तंत्रिका तंत्र संवेदनशील।' },
    distinguishing: { en: 'Animated gestures, quick movements, looks younger than age', hi: 'सजीव भाव-भंगिमा, तेज गति, उम्र से कम दिखना' },
  },
  {
    planetId: 4, // Jupiter
    build: { en: 'Large, well-built body with generous proportions', hi: 'बड़ा, सुगठित शरीर, उदार अनुपात' },
    complexion: { en: 'Golden or yellowish, tawny', hi: 'सुनहरा या पीतवर्ण, ताम्र-स्वर्ण' },
    face: { en: 'Broad face, high forehead, benevolent expression', hi: 'चौड़ा मुख, ऊँचा ललाट, सौम्य भाव' },
    hair: { en: 'Tawny or light brown, thinning at temples', hi: 'भूरे-पीले, कनपटी पर पतले' },
    eyes: { en: 'Large, clear, wise and compassionate', hi: 'बड़ी, स्वच्छ, ज्ञानपूर्ण और करुणामय' },
    constitution: { en: 'Kapha-dominant. Prone to weight gain, liver issues, diabetes.', hi: 'कफ प्रधान। मोटापा, यकृत विकार, मधुमेह की प्रवृत्ति।' },
    distinguishing: { en: 'Dignified bearing, melodious voice, natural authority without aggression', hi: 'गरिमापूर्ण चाल, मधुर स्वर, बिना आक्रामकता के स्वाभाविक अधिकार' },
  },
  {
    planetId: 5, // Venus
    build: { en: 'Attractive, well-proportioned, sensuous frame', hi: 'आकर्षक, सुडौल, कामुक शरीर' },
    complexion: { en: 'Fair, lustrous, blooming complexion', hi: 'गोरा, दीप्तिमान, प्रस्फुटित रंग' },
    face: { en: 'Beautiful, symmetrical features, dimpled', hi: 'सुन्दर, सममित नैन-नक्श, गड्ढेदार गाल' },
    hair: { en: 'Dark, curly, thick and luxuriant', hi: 'काले, घुंघराले, घने और समृद्ध' },
    eyes: { en: 'Large, beautiful, expressive with a magnetic quality', hi: 'बड़ी, सुन्दर, आकर्षण से भरपूर' },
    constitution: { en: 'Kapha-Vata. Prone to reproductive issues, kidney/urinary problems.', hi: 'कफ-वात। प्रजनन, वृक्क/मूत्र विकारों की प्रवृत्ति।' },
    distinguishing: { en: 'Graceful movements, charming smile, youthful appearance', hi: 'सुन्दर चाल, मोहक मुस्कान, युवा दिखावट' },
  },
  {
    planetId: 6, // Saturn
    build: { en: 'Tall, lean, bony frame with prominent joints', hi: 'लम्बा, दुबला, हड्डीदार, उभरे जोड़' },
    complexion: { en: 'Dark, dusky, or black complexion', hi: 'श्याम, कृष्ण वर्ण' },
    face: { en: 'Long face, sunken cheeks, serious expression', hi: 'लम्बा मुख, धँसे गाल, गम्भीर भाव' },
    hair: { en: 'Coarse, dark, prematurely grey', hi: 'खुरदरे, काले, समय से पहले सफेद' },
    eyes: { en: 'Small, deep-set, piercing, dark circles', hi: 'छोटी, गहरी, भेदने वाली, काले घेरे' },
    constitution: { en: 'Vata-dominant. Prone to chronic conditions, joint pain, nervous disorders.', hi: 'वात प्रधान। दीर्घकालिक रोग, जोड़ दर्द, तंत्रिका विकार।' },
    distinguishing: { en: 'Slow gait, stooped posture, looks older than age, prominent veins', hi: 'धीमी चाल, झुकी मुद्रा, उम्र से अधिक दिखना, उभरी नसें' },
  },
  {
    planetId: 7, // Rahu
    build: { en: 'Tall frame, unusual or foreign appearance', hi: 'लम्बा शरीर, असामान्य या विदेशी रूप' },
    complexion: { en: 'Smoke-colored, dark or mixed-race appearance', hi: 'धूम्र-वर्ण, श्याम या मिश्रित रूप' },
    face: { en: 'Unconventional features, may have a squint or asymmetry', hi: 'अपरम्परागत नैन-नक्श, भेंगापन या विषमता' },
    hair: { en: 'Dark, unkempt or unusual style', hi: 'काले, अव्यवस्थित या असामान्य शैली' },
    eyes: { en: 'Smoky, hypnotic, unsettling gaze', hi: 'धुँधली, सम्मोहक, अशांत दृष्टि' },
    constitution: { en: 'Vata-dominant. Mysterious ailments, toxins, addictions, allergies.', hi: 'वात प्रधान। रहस्यमय रोग, विष, व्यसन, एलर्जी।' },
    distinguishing: { en: 'Foreign mannerisms, attraction to taboo, magnetic but unsettling presence', hi: 'विदेशी बरताव, वर्जित की ओर आकर्षण, चुम्बकीय पर अशांत उपस्थिति' },
  },
  {
    planetId: 8, // Ketu
    build: { en: 'Lean, dry, ascetic frame', hi: 'दुबला, शुष्क, तपस्वी शरीर' },
    complexion: { en: 'Dark, grayish, or variegated', hi: 'श्याम, धूसर, या चित्रित' },
    face: { en: 'Sharp features, distant expression, other-worldly look', hi: 'तीखे नैन-नक्श, दूरस्थ भाव, अलौकिक दृष्टि' },
    hair: { en: 'Sparse, unkempt, or matted (jata-like)', hi: 'विरल, अव्यवस्थित, या जटाधारी' },
    eyes: { en: 'Inward-looking, unfocused, mystical', hi: 'अन्तर्मुखी, अकेन्द्रित, रहस्यमय' },
    constitution: { en: 'Pitta-Vata. Prone to skin conditions, fevers of unknown origin, sudden ailments.', hi: 'पित्त-वात। त्वचा रोग, अज्ञात ज्वर, अचानक विकार।' },
    distinguishing: { en: 'Birthmarks or unusual scars, detached demeanor, spiritual aura', hi: 'जन्मचिह्न या असामान्य निशान, विरक्त स्वभाव, आध्यात्मिक आभा' },
  },
];

/** Get physique description for a planet by ID */
export function getPlanetaryPhysique(planetId: number): PlanetaryPhysique | undefined {
  return PLANETARY_PHYSIQUE.find(p => p.planetId === planetId);
}
