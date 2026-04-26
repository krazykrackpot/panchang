// archetype-data.ts — Cosmic Blueprint archetype definitions
// Maps Vedic planetary archetypes to psychological profiles for the Cosmic Blueprint feature.
import type { LocaleText } from '@/types/panchang';

export type ArchetypeId = 'sovereign' | 'empath' | 'warrior' | 'analyst' | 'visionary' | 'harmonizer' | 'architect' | 'maverick' | 'mystic';

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: LocaleText;
  planetId: number;
  coreDescription: string;
  traits: string[];
  blindSpot: string;
  shadowDescription: string;
  growthArea: string;
  chapterDescription: string;
  chapterThemes: string[];
}

// Maps planet ID to archetype — 0=Sun through 8=Ketu
export const ARCHETYPES: Record<number, ArchetypeDefinition> = {
  0: {
    id: 'sovereign',
    name: { en: 'The Sovereign', hi: 'सम्राट', sa: 'सम्राट्' },
    planetId: 0,
    coreDescription: 'Your identity is anchored in purpose and authority. You process the world through a lens of significance — everything connects to your core mission. You naturally command attention and create order from chaos. Your strength is clarity of vision.',
    traits: ['purpose-driven', 'authoritative', 'decisive', 'dignified'],
    blindSpot: 'Need for recognition can overshadow collaborative instincts. You may struggle to lead without needing to be seen leading.',
    shadowDescription: 'When the Sun is your weakest influence, identity feels unstable. You seek external validation instead of generating your own sense of purpose.',
    growthArea: 'Building an internal sense of worth that doesn\'t depend on title, role, or others\' acknowledgment.',
    chapterDescription: 'A Sun chapter brings questions of identity, authority, and purpose to the forefront. Career visibility peaks. You\'re drawn to lead, to define yourself through achievement. Father/authority figures become important.',
    chapterThemes: ['leadership', 'career visibility', 'father figures', 'self-definition', 'authority'],
  },
  1: {
    id: 'empath',
    name: { en: 'The Empath', hi: 'सहानुभूतिशील', sa: 'सहानुभूतिवान्' },
    planetId: 1,
    coreDescription: 'Your mind leads with emotional intelligence. You absorb and process the feelings of those around you before logic kicks in. Your instinct is to nurture, protect, and create safety. Creativity flows from emotional depth.',
    traits: ['emotionally intelligent', 'nurturing', 'intuitive', 'receptive'],
    blindSpot: 'Absorbing others\' emotions can blur the boundary between your feelings and theirs. Decision-making suffers when everything feels personal.',
    shadowDescription: 'When the Moon is your weakest influence, emotional navigation feels unreliable. You may intellectualize feelings rather than processing them, leading to sudden emotional floods.',
    growthArea: 'Developing healthy emotional boundaries without shutting down sensitivity entirely.',
    chapterDescription: 'A Moon chapter amplifies emotional life, domestic matters, and inner world exploration. Relationships with women and mother figures intensify. Mental health awareness peaks. Travel and changes of residence are common.',
    chapterThemes: ['emotional growth', 'home/family', 'mother figures', 'mental health', 'travel'],
  },
  2: {
    id: 'warrior',
    name: { en: 'The Warrior', hi: 'योद्धा', sa: 'योद्धा' },
    planetId: 2,
    coreDescription: 'Action is your language. You process the world through what can be done, fixed, built, or fought for. Courage comes naturally — you advance where others hesitate. Physical vitality and competitive drive define your approach.',
    traits: ['action-oriented', 'courageous', 'competitive', 'direct'],
    blindSpot: 'Impatience with process. You may push through obstacles that required patience, not force. Relationships suffer when everything becomes a competition.',
    shadowDescription: 'When Mars is your weakest influence, assertiveness feels foreign. You avoid confrontation even when it\'s necessary, leading to passive resentment.',
    growthArea: 'Learning to assert needs directly without aggression or avoidance — finding the middle ground.',
    chapterDescription: 'A Mars chapter brings energy, ambition, and conflict to the surface. Property matters, sibling dynamics, and technical skills become prominent. Physical vitality peaks but so do risks of injury or surgery.',
    chapterThemes: ['ambition', 'property', 'siblings', 'physical energy', 'technical skill', 'surgery risk'],
  },
  3: {
    id: 'analyst',
    name: { en: 'The Analyst', hi: 'विश्लेषक', sa: 'विश्लेषकः' },
    planetId: 3,
    coreDescription: 'Your mind is your primary instrument. You process the world through pattern recognition, communication, and logical frameworks. Adaptability is your superpower — you shift between domains with ease. Learning is compulsive, not optional.',
    traits: ['analytical', 'adaptable', 'articulate', 'curious'],
    blindSpot: 'Overthinking paralysis. You can analyze a situation from 12 angles and still feel unprepared to act. Communication substitutes for connection.',
    shadowDescription: 'When Mercury is your weakest influence, clear thinking feels effortful. You may struggle with focus, misread social cues, or find written/verbal expression frustrating.',
    growthArea: 'Trusting intuition alongside analysis. Not every decision needs a framework.',
    chapterDescription: 'A Mercury chapter emphasizes communication, commerce, education, and intellectual growth. Writing, teaching, and technology projects thrive. Social networks expand. Nervous energy increases.',
    chapterThemes: ['communication', 'education', 'commerce', 'writing', 'technology', 'social networking'],
  },
  4: {
    id: 'visionary',
    name: { en: 'The Visionary', hi: 'दूरदर्शी', sa: 'दूरदर्शी' },
    planetId: 4,
    coreDescription: 'Meaning is your currency. You process the world through a lens of purpose, ethics, and expansion. Teaching, mentoring, and philosophical exploration come naturally. Generosity of spirit defines your presence.',
    traits: ['wise', 'expansive', 'optimistic', 'principled'],
    blindSpot: 'Over-commitment and blind optimism. You say yes to everything that sounds meaningful, spreading yourself impossibly thin. Advice-giving can become unsolicited.',
    shadowDescription: 'When Jupiter is your weakest influence, life feels purposeless. Cynicism replaces faith. You may struggle to see the bigger picture or find meaning in daily routines.',
    growthArea: 'Accepting that not everything needs meaning to be valuable. Learning to rest without purpose.',
    chapterDescription: 'A Jupiter chapter brings expansion through wisdom, travel, education, and spiritual growth. Children, teachers, and mentors become central figures. Financial growth through ethical means. Foreign connections flourish.',
    chapterThemes: ['expansion', 'teaching', 'foreign travel', 'higher learning', 'children', 'spirituality'],
  },
  5: {
    id: 'harmonizer',
    name: { en: 'The Harmonizer', hi: 'सामंजस्यकारी', sa: 'सामञ्जस्यकारी' },
    planetId: 5,
    coreDescription: 'Beauty and connection are your compass. You process the world through aesthetics, relationships, and sensory experience. Creating harmony — in environments, relationships, and art — is your instinct. Diplomacy comes naturally.',
    traits: ['aesthetic', 'diplomatic', 'sensual', 'relational'],
    blindSpot: 'Conflict avoidance masquerading as diplomacy. You may sacrifice your truth to keep the peace, then resent the cost. Comfort can become a trap.',
    shadowDescription: 'When Venus is your weakest influence, pleasure feels guilt-inducing. Relationships lack depth or feel transactional. Creative expression stalls.',
    growthArea: 'Embracing necessary conflict as a form of intimacy, not a failure of diplomacy.',
    chapterDescription: 'A Venus chapter brings love, luxury, creativity, and partnerships to the foreground. Marriage/relationship themes intensify. Artistic expression flourishes. Financial comfort improves through partnerships or creative ventures.',
    chapterThemes: ['love', 'marriage', 'creativity', 'luxury', 'partnerships', 'artistic expression'],
  },
  6: {
    id: 'architect',
    name: { en: 'The Architect', hi: 'वास्तुकार', sa: 'वास्तुकारः' },
    planetId: 6,
    coreDescription: 'Structure is your safety net and your art. You process the world through systems, long-term planning, and endurance. Discipline isn\'t imposed on you — it\'s how you think. You build things that last because you cannot tolerate fragility.',
    traits: ['disciplined', 'structured', 'enduring', 'methodical'],
    blindSpot: 'Rigidity disguised as thoroughness. You may resist change even when the structure is no longer serving its purpose. Isolation feels productive but becomes habitual.',
    shadowDescription: 'When Saturn is your weakest influence, structure feels oppressive rather than supportive. You may rebel against responsibility or struggle with chronic procrastination.',
    growthArea: 'Learning that flexibility is not weakness, and that some structures need to be dismantled to build better ones.',
    chapterDescription: 'A Saturn chapter demands discipline, responsibility, and maturation. Career advancement through persistent effort. Delays test patience but build character. Authority figures and legal matters feature prominently.',
    chapterThemes: ['discipline', 'career building', 'responsibility', 'delays/patience', 'legal matters', 'maturation'],
  },
  7: {
    id: 'maverick',
    name: { en: 'The Maverick', hi: 'विद्रोही', sa: 'विद्रोही' },
    planetId: 7,
    coreDescription: 'Disruption is your talent and your curse. You process the world through what\'s missing, what\'s broken, what could be radically different. Conventional paths feel suffocating. You\'re drawn to the unconventional, the foreign, the taboo.',
    traits: ['ambitious', 'unconventional', 'obsessive', 'disruptive'],
    blindSpot: 'Compulsive striving without clear purpose. The hunger for "more" never has a finish line. Identity can fragment when you chase too many possibilities.',
    shadowDescription: 'When Rahu is your weakest influence, ambition feels directionless. You may cling to convention out of fear rather than choice, or feel perpetually out of place.',
    growthArea: 'Distinguishing between genuine calling and compulsive craving. Learning when "enough" is enough.',
    chapterDescription: 'A Rahu chapter brings obsessive ambition, foreign connections, and unconventional pursuits. Technology, media, and cross-cultural experiences dominate. Material gains come through unusual means. Identity undergoes radical transformation.',
    chapterThemes: ['obsessive ambition', 'foreign travel', 'technology', 'unconventional paths', 'material gains', 'identity transformation'],
  },
  8: {
    id: 'mystic',
    name: { en: 'The Mystic', hi: 'रहस्यवादी', sa: 'रहस्यवादी' },
    planetId: 8,
    coreDescription: 'Detachment is your gift. You process the world through intuition and subtraction — what can be released, simplified, transcended. Spiritual insight comes naturally. You see through surfaces to underlying patterns others miss.',
    traits: ['intuitive', 'detached', 'perceptive', 'spiritual'],
    blindSpot: 'Disconnection masquerading as transcendence. You may check out of practical reality or relationships under the guise of being "above it all." Apathy and escapism are close neighbors of detachment.',
    shadowDescription: 'When Ketu is your weakest influence, spiritual life feels empty or performative. You may cling to material security with unusual intensity, fearing the loss you sense is inevitable.',
    growthArea: 'Engaging with the world fully while maintaining awareness. Detachment that includes, rather than excludes.',
    chapterDescription: 'A Ketu chapter brings spiritual awakening, loss that leads to liberation, and detachment from material concerns. Past life patterns surface. Meditation and introspection deepen. Sudden insights and unexpected separations.',
    chapterThemes: ['spiritual awakening', 'liberation through loss', 'meditation', 'past patterns', 'sudden insights', 'detachment'],
  },
};

// Yoga psychological interpretations (top yogas that commonly appear)
export const YOGA_PSYCH_INSIGHTS: Record<string, string> = {
  gajakesari: 'Your emotional intelligence amplifies your wisdom drive. You teach through empathy, not authority.',
  budhaditya: 'Sun-Mercury conjunction gives your analytical nature executive presence. People listen when you speak.',
  chandra_mangala: 'Moon-Mars conjunction creates emotional intensity. You feel passionately and act on instinct.',
  hamsa: 'Jupiter in a Kendra in its own/exalted sign gives natural wisdom and spiritual magnetism.',
  malavya: 'Venus in a Kendra in its own/exalted sign brings artistic talent and relationship grace.',
  ruchaka: 'Mars in a Kendra in its own/exalted sign gives physical dynamism and leadership courage.',
  shasha: 'Saturn in a Kendra in its own/exalted sign provides structured discipline and endurance.',
  bhadra: 'Mercury in a Kendra in its own/exalted sign sharpens communication and intellectual precision.',
  viparita_raja: 'Challenge becomes fuel. Hardship in specific life areas paradoxically unlocks authority and growth.',
  neecha_bhanga: 'A debilitated planet with cancellation — what looks like weakness becomes your unexpected strength.',
  kemadruma: 'Moon without planetary support. Emotional self-reliance is your path — you learned early to be your own anchor.',
  sade_sati: 'Saturn\'s 7.5-year transit over your Moon. A period of pressure that forges emotional maturity and resilience.',
};

// Lagna modifier descriptions — keyed by rashi ID (1=Aries through 12=Pisces)
export const LAGNA_MODIFIERS: Record<number, string> = {
  1: 'through Aries\'s direct, pioneering energy — you lead with action, not deliberation',
  2: 'through Taurus\'s grounded, sensory lens — you build steadily, valuing tangible results',
  3: 'through Gemini\'s curious, communicative style — you adapt quickly and connect widely',
  4: 'through Cancer\'s protective, nurturing instinct — you create safety for yourself and others',
  5: 'through Leo\'s dignified, expressive nature — you command attention naturally',
  6: 'through Virgo\'s precise, service-oriented approach — you improve everything you touch',
  7: 'through Libra\'s diplomatic, harmony-seeking lens — you mediate, balance, and beautify',
  8: 'through Scorpio\'s intense, investigative depth — you see beneath surfaces instinctively',
  9: 'through Sagittarius\'s expansive, philosophical vision — you seek meaning in everything',
  10: 'through Capricorn\'s disciplined, ambitious structure — you build for the long term',
  11: 'through Aquarius\'s innovative, community-minded perspective — you think systemically',
  12: 'through Pisces\'s intuitive, compassionate awareness — you absorb the world\'s feelings',
};
