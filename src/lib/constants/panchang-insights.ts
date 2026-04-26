/**
 * Panchang Insights Data — contextual "why this matters" for all panchang elements.
 *
 * Framing is observational/Ayurvedic rather than religious prescription.
 * Sources: classical Muhurta texts, Ayurvedic tradition, and historical observation.
 */

export interface PanchangInsight {
  id: string;
  type: 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara';
  headline: string;
  explanation: string;          // 2-3 sentences, observational framing
  bestFor: string[];
  avoid: string[];
  tradition: string;
}

// ─────────────────────────────────────────────
// TITHIS — Shukla Paksha (waxing moon, 1–15)
// ─────────────────────────────────────────────

const SHUKLA_TITHIS: PanchangInsight[] = [
  {
    id: 'shukla_pratipada',
    type: 'tithi',
    headline: 'New Cycle Begins',
    explanation:
      'The first lunar day of the bright fortnight marks the Moon emerging from conjunction with the Sun. Prana is considered low but rising — a seed-planting window rather than a harvest moment. Ayurvedic texts note that bodily fluids are minimal and the digestive fire steady.',
    bestFor: ['Starting new projects', 'Setting intentions', 'Light physical activity', 'Financial planning'],
    avoid: ['Fasting', 'Surgery', 'Signing major contracts'],
    tradition:
      'Classical Muhurta texts classify Pratipada as Rikta ("empty") — suitable for beginnings but not large undertakings.',
  },
  {
    id: 'shukla_dwitiya',
    type: 'tithi',
    headline: 'Momentum Building',
    explanation:
      'The second tithi sees the Moon visibly crescent for the first time. Energy is modest but directional. Classical texts associate this day with Brahma (the creator) and recommend activities that require focused, sustained effort rather than bursts of energy.',
    bestFor: ['Education', 'Artistic work', 'Correspondence', 'Relationship-building'],
    avoid: ['Impulsive decisions', 'Long journeys'],
    tradition:
      'Ruled by Brahma; a day for creation and careful craftsmanship in traditional Muhurta systems.',
  },
  {
    id: 'shukla_tritiya',
    type: 'tithi',
    headline: 'Auspicious Surge',
    explanation:
      'Tritiya is one of the most consistently auspicious tithis across Muhurta literature. The Moon-Sun angle reaches ~36°, a harmonic division observed in natural growth cycles. Vitality and enthusiasm are on the rise, and clarity of purpose tends to be high.',
    bestFor: ['Marriage ceremonies', 'Travel', 'New ventures', 'Purchasing property', 'Medical treatment'],
    avoid: ['Mourning rituals', 'Confrontational discussions'],
    tradition:
      'Akshaya Tritiya (Vaishakha Shukla 3) is the most celebrated instance — auspiciousness compounded by the Sun-Moon both in exaltation signs.',
  },
  {
    id: 'shukla_chaturthi',
    type: 'tithi',
    headline: 'Focused and Careful',
    explanation:
      'The fourth tithi carries a mixed quality. Lunar energy is growing but not yet peak. Traditional texts associate it with Ganesha (remover of obstacles) — suggesting it is an excellent time to address problems and plan carefully, but not for carefree celebration.',
    bestFor: ['Problem-solving', 'Editing existing work', 'Meditation', 'Technology work'],
    avoid: ['Starting major construction', 'Weddings', 'Oil application'],
    tradition:
      'Sankashti Chaturthi (every Krishna Chaturthi) is observed as a fast day dedicated to Ganesha across many traditions.',
  },
  {
    id: 'shukla_panchami',
    type: 'tithi',
    headline: 'Creative and Communicative',
    explanation:
      'Panchami is regarded as Nanda ("joy-giving") and associated with Saraswati, the deity of learning and arts. The Moon\'s light has grown enough to support mental clarity while the energy remains lively and exploratory. Creative and intellectual pursuits tend to flow well.',
    bestFor: ['Writing', 'Music', 'Learning a new skill', 'Negotiations', 'Medical consultations'],
    avoid: ['Aggressive confrontations', 'Surgery on the abdomen'],
    tradition:
      'Vasant Panchami in Magha is dedicated to Saraswati; students and artists worship their tools and books on this day.',
  },
  {
    id: 'shukla_shashthi',
    type: 'tithi',
    headline: 'Action and Vitality',
    explanation:
      'The sixth tithi is associated with Kartikeya (the warrior deity) and is considered energetically strong. Prana is building toward the lunar midpoint and physical vigor is elevated. Texts recommend this day for activities requiring courage and assertive action.',
    bestFor: ['Physical training', 'Competitive activities', 'Leadership decisions', 'Outdoor work'],
    avoid: ['Long sea voyages (classical texts)', 'Overly contemplative activities'],
    tradition:
      'Skanda Shashthi is a major festival for devotees of Kartikeya across South India, marking victory over adversaries.',
  },
  {
    id: 'shukla_saptami',
    type: 'tithi',
    headline: 'Solar and Radiant',
    explanation:
      'Saptami is ruled by the Sun (Surya) and carries a solar quality of clarity, authority, and outward expression. The Moon is at ~84° elongation — a growing quarter that favors visible, public undertakings. Classical texts describe this tithi as "Bhadra" (beneficial).',
    bestFor: ['Public presentations', 'Leadership roles', 'Health-related activities', 'Donating to causes', 'Travel east'],
    avoid: ['Starting underground construction', 'Solitary retreat'],
    tradition:
      'Ratha Saptami in Magha celebrates the Sun\'s northward journey; traditional solar health practices are performed on this day.',
  },
  {
    id: 'shukla_ashtami',
    type: 'tithi',
    headline: 'Balanced Intensity',
    explanation:
      'The eighth tithi marks the first quarter Moon (90° from the Sun). Lunar energy is at a transitional peak — neither building nor waning. This tension is associated with both creative potential and physical stress. Ayurvedic texts note heightened bodily reactivity on Ashtami.',
    bestFor: ['Disciplined practice', 'Debate and intellectual challenge', 'Community activities'],
    avoid: ['Major surgery (increased bleeding risk, classical texts)', 'Reckless physical activity'],
    tradition:
      'Both Janmashtami (Krishna\'s birth) and Durgashtami fall on Ashtami — the intensity of the day is seen as a container for profound events.',
  },
  {
    id: 'shukla_navami',
    type: 'tithi',
    headline: 'Auspicious and Expansive',
    explanation:
      'Navami is classified as Nanda and associated with Durga. The Moon is moving past the first quarter and building toward fullness; energy is abundant and purpose-driven. Classical Muhurta texts consistently list this tithi among the most favorable.',
    bestFor: ['Weddings', 'Initiations', 'Property dealings', 'Long journeys', 'Religious ceremonies'],
    avoid: ['Activities linked to decay or dissolution'],
    tradition:
      'Rama Navami and Maha Navami (Navaratri) are among the most auspicious Hindu festivals, both falling on Shukla Navami.',
  },
  {
    id: 'shukla_dashami',
    type: 'tithi',
    headline: 'Achievement and Recognition',
    explanation:
      'The tenth tithi is associated with Dharmaraja (Yama) and carries a quality of culmination and accountability. Energy is high as the Moon approaches fullness. It is well-regarded for acts of public recognition, completion, and ceremonial milestones.',
    bestFor: ['Completing projects', 'Public ceremonies', 'Honoring elders', 'Official announcements'],
    avoid: ['Starting entirely new ventures', 'Activities that require long incubation'],
    tradition:
      'Vijaya Dashami (Dussehra) is celebrated on Ashwin Shukla Dashami — the day of victory and righteous conclusion.',
  },
  {
    id: 'shukla_ekadashi',
    type: 'tithi',
    headline: 'Natural Fasting Window',
    explanation:
      'Ekadashi (the 11th tithi) occurs when the Moon is approximately 132° from the Sun. Ayurvedic tradition observed that digestion is strongest when lunar influence is building and the body can handle reduced food intake without stress — a natural detox window. Modern research on intermittent fasting shows similar patterns of heightened autophagy in alignment with circadian biology.',
    bestFor: ['Fasting or light eating', 'Meditation and prayer', 'Spiritual study', 'Rest and recuperation'],
    avoid: ['Heavy meals', 'Starting physically demanding projects', 'Alcohol'],
    tradition:
      'The 24 Ekadashis of the year are among the most widely observed vrat days across Vaishnavism; each carries a distinct name and associated narrative.',
  },
  {
    id: 'shukla_dwadashi',
    type: 'tithi',
    headline: 'Breaking the Fast with Clarity',
    explanation:
      'Dwadashi follows the Ekadashi fast and is associated with Vishnu. It carries a quality of restored vitality — the body\'s systems are reset and receptive. Classical texts recommend this as a day for nourishment, generosity, and re-entering the material world with renewed purpose.',
    bestFor: ['Eating nourishing meals after fasting', 'Charitable donations', 'Commerce and trade', 'Renewing commitments'],
    avoid: ['Excess or indulgence immediately after fasting'],
    tradition:
      'Parana (breaking the Ekadashi fast) is performed on Dwadashi, ideally within the first muhurta after sunrise.',
  },
  {
    id: 'shukla_trayodashi',
    type: 'tithi',
    headline: 'Joyful and Celebratory',
    explanation:
      'The 13th tithi is classified as "Jaya" (victorious) and associated with Kamadeva. The Moon is near its fullest and the night is bright; social energy and emotional warmth are at their peak. Texts consistently recommend this day for celebrations, arts, and romance.',
    bestFor: ['Social gatherings', 'Music and dance', 'Romantic activities', 'Artistic performances', 'Community festivals'],
    avoid: ['Solitary or somber work', 'Aggressive negotiations'],
    tradition:
      'Pradosha Vrata is observed on the 13th tithi (both Shukla and Krishna) — a dusk worship of Shiva that aligns with the evening twilight energy.',
  },
  {
    id: 'shukla_chaturdashi',
    type: 'tithi',
    headline: 'Peak Intensity Before Full',
    explanation:
      'Chaturdashi carries the most intense lunar energy before the Full Moon. The Moon is nearly opposite the Sun; tidal forces on bodily fluids and the nervous system are at their highest. This intensity can be channeled productively or can produce restlessness and difficulty sleeping.',
    bestFor: ['Intensive spiritual practice', 'Completing urgent tasks', 'Courage-requiring activities'],
    avoid: ['Auspicious ceremonies like weddings', 'Starting long-term plans'],
    tradition:
      'Shivaratri falls on Krishna Chaturdashi — the deepest night of the fortnight used for profound spiritual practices.',
  },
  {
    id: 'shukla_purnima',
    type: 'tithi',
    headline: 'Full Lunar Power',
    explanation:
      'Purnima (Full Moon) is when the Moon stands opposite the Sun at 180° elongation. Tidal forces on terrestrial water are at maximum, and Ayurvedic texts describe bodily fluids as abundant. Lunar traditions across cultures associate the Full Moon with completion, celebration, and heightened emotional states.',
    bestFor: ['Major ceremonies', 'Community gatherings', 'Acts of generosity', 'Healing rituals'],
    avoid: ['Fasting (body needs nourishment)', 'Surgery if possible', 'Starting new long-term projects'],
    tradition:
      'Each Purnima has a distinct name (Kartik Purnima, Guru Purnima, Sharad Purnima, etc.) and is celebrated as a sacred day across Hinduism, Buddhism, and Jainism.',
  },
];

// ─────────────────────────────────────────────
// TITHIS — Krishna Paksha (waning moon, 1–15)
// ─────────────────────────────────────────────

const KRISHNA_TITHIS: PanchangInsight[] = [
  {
    id: 'krishna_pratipada',
    type: 'tithi',
    headline: 'Releasing What Was Built',
    explanation:
      'The first tithi after the Full Moon begins the waning fortnight. Lunar light and associated prana start their descent. Ayurveda considers this a time to begin releasing, purging, and consolidating rather than acquiring and expanding.',
    bestFor: ['Decluttering', 'Financial review', 'Completing projects started during Shukla', 'Rest'],
    avoid: ['Starting major new initiatives', 'Accumulating new commitments'],
    tradition: 'Krishna Paksha in Muhurta texts is generally regarded as less auspicious for worldly beginnings, though excellent for spiritual deepening.',
  },
  {
    id: 'krishna_dwitiya',
    type: 'tithi',
    headline: 'Steady Waning Energy',
    explanation:
      'The second day of the dark fortnight maintains reasonable vitality with a descending quality. Classical texts regard it similarly to Shukla Dwitiya but with a preference for introspective and finishing activities over bold new steps.',
    bestFor: ['Research', 'Analysis', 'Completing correspondence', 'Study'],
    avoid: ['Launching products or initiatives', 'Aggressive expansion'],
    tradition: 'Traditional Muhurta texts advise avoiding marriage and travel inaugurations in Krishna Paksha generally.',
  },
  {
    id: 'krishna_tritiya',
    type: 'tithi',
    headline: 'Moderate and Grounding',
    explanation:
      'Krishna Tritiya retains some of the auspicious quality of Tritiya but is moderated by the waning Moon. The energy is stable and practical — good for methodical, skill-focused work where patience is an asset.',
    bestFor: ['Skill practice', 'Technical work', 'Financial consolidation', 'Healthcare appointments'],
    avoid: ['Impulsive spending', 'Emotionally charged confrontations'],
    tradition: 'In some regional traditions, Tritiya in both pakshas is avoided for hair-cutting; Sun-Moon geometry influences hair growth cycles per Ayurvedic cosmetology.',
  },
  {
    id: 'krishna_chaturthi',
    type: 'tithi',
    headline: 'Obstacle Awareness',
    explanation:
      'Krishna Chaturthi shares the careful, Ganesha-associated quality of Shukla Chaturthi but with less vitality. It is a day for addressing existing obstacles rather than creating new pathways. The reduced Moon light corresponds to lower physical and cognitive peak performance.',
    bestFor: ['Removing clutter', 'Resolving disputes', 'Introspection', 'Editing work'],
    avoid: ['Major new commitments', 'Risky financial moves'],
    tradition: 'Sankashti Chaturthi (each Krishna Chaturthi) is a widely observed fast; sunset Moon sighting and its worship are traditional.',
  },
  {
    id: 'krishna_panchami',
    type: 'tithi',
    headline: 'Introspective Learning',
    explanation:
      'The fifth tithi of the dark fortnight is suitable for learning that requires patience and depth rather than inspiration. Saraswati\'s association with Panchami suggests both pakshas are favorable for intellectual work, but Krishna Panchami is better for review and consolidation than first exposure.',
    bestFor: ['Reviewing notes', 'Deep study', 'Writing from existing research', 'Musical practice'],
    avoid: ['Public performances', 'Launching creative work'],
    tradition: 'Classical Muhurta texts list Panchami as one of the better tithis in Krishna Paksha for writing and scholarly activities.',
  },
  {
    id: 'krishna_shashthi',
    type: 'tithi',
    headline: 'Disciplined Energy',
    explanation:
      'Vitality is lower than its Shukla counterpart but the focus is steadier. Krishna Shashthi suits disciplined, repetitive, or maintenance-oriented physical work. The body can handle moderate exertion without the peak-effort demands that Shukla Shashthi supports.',
    bestFor: ['Physical maintenance', 'Repetitive skilled work', 'Agricultural tasks', 'Sports practice'],
    avoid: ['Major competitions', 'Extreme physical output'],
    tradition: 'Skanda Shashthi is celebrated in Shukla; the Krishna counterpart is quieter but retains the karmic connection to disciplined action.',
  },
  {
    id: 'krishna_saptami',
    type: 'tithi',
    headline: 'Reflective Clarity',
    explanation:
      'As the Moon passes the last quarter, Saptami carries the solar clarity of the Sun rulership but filtered through the descending lunar arc. It is good for honest self-assessment and re-evaluating plans formed during the waxing period.',
    bestFor: ['Journaling', 'Honest conversations', 'Course-correction', 'Solar practices (walking at sunrise)'],
    avoid: ['Major public announcements', 'Weddings'],
    tradition: 'Regular solar observances are maintained by many practitioners throughout both pakshas on Saptami.',
  },
  {
    id: 'krishna_ashtami',
    type: 'tithi',
    headline: 'Last Quarter Turning Point',
    explanation:
      'The last quarter Moon (270° from Sun) marks a powerful turning point in the lunar cycle. Krishna Ashtami is considered one of the most intense tithis — energetically charged but not in ways that support smooth worldly activity. Inner work, prayer, and fasting are traditional responses to this energy.',
    bestFor: ['Intense spiritual practice', 'Fasting', 'Deep meditation', 'Clearing debts'],
    avoid: ['Auspicious events', 'Surgery', 'Beginning projects'],
    tradition: 'Krishna Janmashtami (Shravana Krishna Ashtami) is celebrated as the birth of Lord Krishna; the intensity of the tithi is seen as holding the extraordinary.',
  },
  {
    id: 'krishna_navami',
    type: 'tithi',
    headline: 'Inward Auspiciousness',
    explanation:
      'While Shukla Navami is outwardly auspicious, Krishna Navami directs that quality inward — toward spiritual merit, ancestor veneration, and charitable acts. The nine-ness of Navami carries a completion quality that suits wrapping up significant life chapters.',
    bestFor: ['Ancestral offerings', 'Charity', 'Completing long projects', 'Spiritual studies'],
    avoid: ['Marriages', 'New business launches'],
    tradition: 'Maha Navami (the 9th day of Navaratri) falls on Shukla Navami; many traditions observe a parallel observance on Krishna Navami for ancestor worship.',
  },
  {
    id: 'krishna_dashami',
    type: 'tithi',
    headline: 'Settling Accounts',
    explanation:
      'The tenth dark fortnight tithi carries a quality of settlement and accountability. It is regarded as a time to complete financial obligations, resolve lingering disputes, and bring affairs to an honest close before the deep introspection of the final days.',
    bestFor: ['Settling debts', 'Administrative closures', 'Archiving', 'Writing wills or legal documents'],
    avoid: ['Celebrations', 'Impulsive financial decisions'],
    tradition: 'Some Dharmashastra traditions prescribe Shraddha (ancestor rites) beginning on Dashami in Ashwin Krishna Paksha.',
  },
  {
    id: 'krishna_ekadashi',
    type: 'tithi',
    headline: 'Deepest Fast of the Month',
    explanation:
      'Of the two Ekadashis each month, the Krishna Paksha Ekadashi is considered more potent for fasting and purification in many traditions. The Moon is waning toward conjunction with the Sun; lunar tidal forces are descending, and the digestive system is more receptive to light eating or full fasting.',
    bestFor: ['Full fasting', 'Water-only day', 'Deep meditation', 'Reading scripture', 'Service'],
    avoid: ['Heavy meals', 'Socializing', 'Physical exertion'],
    tradition: 'Each Krishna Ekadashi has a specific name (Nirjala, Apara, Utpanna, etc.) with distinct benefits described in the Padma Purana.',
  },
  {
    id: 'krishna_dwadashi',
    type: 'tithi',
    headline: 'Gentle Nourishment After the Fast',
    explanation:
      'Krishna Dwadashi carries the same post-fast restoration quality as its Shukla counterpart but in a more retiring, inward energy. The Moon is near its thinnest crescent; this is a time to replenish quietly rather than re-engage fully with the world.',
    bestFor: ['Breaking the fast mindfully', 'Gentle exercise', 'Quiet charitable giving', 'Sleep recovery'],
    avoid: ['Immediately returning to full social activity', 'Major exertion'],
    tradition: 'Parana rules for breaking the fast are the same as Shukla Dwadashi; timing within the prescribed window is considered important.',
  },
  {
    id: 'krishna_trayodashi',
    type: 'tithi',
    headline: 'Winding Down Toward Stillness',
    explanation:
      'As the Moon approaches New Moon, Trayodashi has a quieting quality — the opposite of the celebratory Shukla 13th. Pradosha Vrata on this evening is considered especially potent as the dusk energy is most still just before the Moon disappears.',
    bestFor: ['Evening worship', 'Candlelit meditation', 'Quiet arts', 'Concluding ceremonies'],
    avoid: ['Loud social gatherings', 'Beginning anything requiring sustained momentum'],
    tradition: 'Pradosha Vrata on Krishna Trayodashi is one of the most observed fortnightly rituals for Shiva worship across India.',
  },
  {
    id: 'krishna_chaturdashi',
    type: 'tithi',
    headline: 'Fierce and Transformative',
    explanation:
      'Krishna Chaturdashi is considered one of the most intense tithis in the calendar. The Moon is nearly invisible and the conjunction with the Sun is imminent. Ayurvedic texts describe bodily fluids as lowest and the nervous system as most stressed. Traditionally, this day is reserved for purification, releasing the old, and deep inner work.',
    bestFor: ['Cleansing rituals', 'Exorcism/purification ceremonies', 'Letting go', 'Deep sleep practices'],
    avoid: ['Auspicious events', 'Travel', 'Surgery', 'Any major new beginning'],
    tradition: 'Masik Shivaratri falls on Krishna Chaturdashi monthly; the annual Maha Shivaratri is the most celebrated instance.',
  },
  {
    id: 'krishna_amavasya',
    type: 'tithi',
    headline: 'New Moon — Stillness and Ancestral Rites',
    explanation:
      'Amavasya (New Moon) is the conjunction of Sun and Moon — the lowest point of lunar energy. Tidal forces are minimal; the sky is darkest. Across cultures, New Moon is associated with rest, introspection, and ancestral memory. Ayurvedic texts caution against excessive activity and recommend light eating.',
    bestFor: ['Ancestor offerings (Shraddha)', 'New Moon intentions', 'Rest', 'Introspection', 'Clearing space'],
    avoid: ['Weddings', 'Major business launches', 'Surgery', 'Travel if possible'],
    tradition: 'Shraddha (tarpana for ancestors) is traditionally performed on Amavasya; the Pitra tradition holds that ancestors receive offerings most directly on New Moon days.',
  },
];

// ─────────────────────────────────────────────
// NAKSHATRAS (1–27)
// ─────────────────────────────────────────────

const NAKSHATRA_INSIGHTS: PanchangInsight[] = [
  {
    id: 'ashwini',
    type: 'nakshatra',
    headline: 'Swift Healing Momentum',
    explanation:
      'Ashwini is ruled by Ketu and governed by the Ashwini Kumaras — the divine physicians of Vedic tradition. Its nature is Kshipra (swift) and light, making it ideal for actions that require quick initiation, medical intervention, or rapid travel. The horse-head symbolism reflects speed and readiness.',
    bestFor: ['Medical treatment', 'Starting journeys', 'Quick decisions', 'Physical exercise', 'Horse riding'],
    avoid: ['Slow, methodical work requiring sustained patience'],
    tradition: 'Ashwini nakshatra is considered especially favorable for Ayurvedic treatments and for entering new homes quickly.',
  },
  {
    id: 'bharani',
    type: 'nakshatra',
    headline: 'Creation, Transformation, and Consequence',
    explanation:
      'Ruled by Venus and governed by Yama (the lord of consequence), Bharani carries intense creative and transformative energy. The bearing pot symbol reflects both fertility and containment — this nakshatra supports bringing things into existence and also releasing what is ready to leave.',
    bestFor: ['Creative projects', 'Dealing with legal matters', 'Purification practices', 'Fertility-related treatments'],
    avoid: ['Travel by water (classical texts)', 'Avoiding responsibility'],
    tradition: 'Bharani is associated with the concept of dharma — right action bearing its proper fruit.',
  },
  {
    id: 'krittika',
    type: 'nakshatra',
    headline: 'Fiery Purification',
    explanation:
      'Krittika is ruled by the Sun and associated with Agni (fire). Its dual nature — sharp and soft — reflects a capacity for both burning away impurities and warmly nurturing. Traditional texts describe it as excellent for cooking, fire-related ceremonies, and decisive cutting actions.',
    bestFor: ['Cooking and food preparation', 'Fire ceremonies (homa)', 'Surgery', 'Military or protective action'],
    avoid: ['Healing relationships through gentle persuasion (fire energy can burn bridges)'],
    tradition: 'The Krittikas are the six Pleiades stars — mythologically the foster mothers of Kartikeya, giving this nakshatra a fierce-yet-nurturing quality.',
  },
  {
    id: 'rohini',
    type: 'nakshatra',
    headline: 'Fertile Growth and Beauty',
    explanation:
      'Rohini is the Moon\'s favorite nakshatra — it is said the Moon lingers longest here. Ruled by the Moon itself and governed by Brahma, Rohini is Sthira (fixed) and associated with fertility, abundance, and sensory pleasure. It is among the most consistently auspicious nakshatras for material creation.',
    bestFor: ['Planting', 'Arts and music', 'Marriage', 'Business ventures', 'Agriculture', 'Luxury purchases'],
    avoid: ['Activities requiring rapid movement or quick decisions'],
    tradition: 'Rohini Vrata is observed by married women for marital harmony; the Moon\'s love for Rohini is a central narrative in lunar mythology.',
  },
  {
    id: 'mrigashira',
    type: 'nakshatra',
    headline: 'Gentle Search and Sensitivity',
    explanation:
      'Mrigashira (deer\'s head) is ruled by Mars and governed by Soma (the Moon deity). Its tender, soft nature makes it suitable for searching, exploration, and delicate activities. The deer symbolism represents both gentle curiosity and the tendency to startle — best used for peaceful, careful undertakings.',
    bestFor: ['Travel and exploration', 'Gardening', 'Romance', 'Learning new things', 'Gentle healing'],
    avoid: ['Aggressive confrontations', 'Heavy physical labor'],
    tradition: 'Mrigashira spans Taurus and Gemini, giving it both earthy stability and airy curiosity; Vedic texts associate it with the search for divine love.',
  },
  {
    id: 'ardra',
    type: 'nakshatra',
    headline: 'Stormy Renewal',
    explanation:
      'Ardra means "moist" or "green" — it is associated with storms, renewal, and the power of destruction as a precursor to fresh growth. Ruled by Rahu and governed by Rudra (the wild form of Shiva), its energy is turbulent and excellent for clearing the old but challenging for starting settled activities.',
    bestFor: ['Clearing clutter', 'Technological innovation', 'Research into difficult problems', 'Breaking old patterns'],
    avoid: ['Weddings', 'Starting construction', 'Planting'],
    tradition: 'Ardra is associated with Sirius (Mrigavyadha) and the monsoon\'s arrival in India; stormy weather and dramatic change are its signature.',
  },
  {
    id: 'punarvasu',
    type: 'nakshatra',
    headline: 'Return and Renewal',
    explanation:
      'Punarvasu means "becoming good again" — it carries a quality of restoration, return, and resourcefulness. Ruled by Jupiter and governed by Aditi (the mother of the gods), it is Chara (movable) and light. This nakshatra supports restoring what was lost, healing from setbacks, and finding abundance through simplicity.',
    bestFor: ['Travel', 'Rebuilding relationships', 'Second chances', 'Publishing', 'Medicine'],
    avoid: ['Destructive or one-time terminal actions'],
    tradition: 'The birth of Rama is celebrated when the Moon is in Punarvasu (Rama Navami) — a fitting symbol of righteous return and restoration.',
  },
  {
    id: 'pushya',
    type: 'nakshatra',
    headline: 'The Nourisher — Most Auspicious for New Work',
    explanation:
      'Pushya is widely regarded as the most auspicious nakshatra for beginning new ventures. Ruled by Saturn and governed by Brihaspati (Jupiter), it combines steadiness with wisdom. Its nature is Laghu (light) and swift, making it ideal for planting seeds — both literal and metaphorical — that will grow into lasting structures.',
    bestFor: ['Starting businesses', 'Buying property', 'Investments', 'Medical treatment', 'Initiating ceremonies'],
    avoid: ['Marriage (classical texts specifically exclude Pushya for weddings due to Saturn rulership)'],
    tradition: 'Pushya Nakshatra is considered so auspicious that markets and shops remain open late on Pushya days to capitalize on the energy; Guru Pushya Yoga (Jupiter\'s day + Pushya) is one of the most sought-after muhurtas.',
  },
  {
    id: 'ashlesha',
    type: 'nakshatra',
    headline: 'Serpentine Power — Use with Care',
    explanation:
      'Ashlesha is ruled by Mercury and governed by the Nagas (serpents). Its sharp, clinging nature makes it potent but double-edged — excellent for healing poison and uncovering hidden truths, but prone to entanglement and manipulation when misused. This nakshatra rewards depth over speed.',
    bestFor: ['Poison treatment', 'Deep healing', 'Research into hidden matters', 'Kundalini practices'],
    avoid: ['New beginnings', 'Trusting new people without verification', 'Lending money'],
    tradition: 'Ashlesha is considered one of the Mula Nakshatras — associated with foundational yet potentially disruptive karmic patterns.',
  },
  {
    id: 'magha',
    type: 'nakshatra',
    headline: 'Ancestral Authority and Dignity',
    explanation:
      'Magha is ruled by Ketu and governed by the Pitris (ancestors). Its fierce quality carries the weight of lineage, tradition, and earned authority. Activities connected to heritage, honor, and established power do well under Magha; it is less suited for anything that breaks from convention.',
    bestFor: ['Ancestral offerings', 'Leadership activities', 'Formal ceremonies', 'Honoring tradition', 'Court proceedings'],
    avoid: ['Unconventional or revolutionary actions', 'Starting new families or relationships'],
    tradition: 'Magha was used by traditional astrologers to identify individuals with strong connections to ancestral karma and royal lineage in Jyotish.',
  },
  {
    id: 'purva_phalguni',
    type: 'nakshatra',
    headline: 'Pleasure, Rest, and Creative Expression',
    explanation:
      'Ruled by Venus and governed by Bhaga (the deity of delight and conjugal love), Purva Phalguni is strongly associated with rest, sensory pleasure, and creative self-expression. Its Ugra (fierce) classification in texts refers to intensity of pleasure rather than aggression — it is an indulgent nakshatra.',
    bestFor: ['Arts', 'Romance', 'Music and dance', 'Rest and recreation', 'Weddings (it is Venus-ruled and marriage-supporting)'],
    avoid: ['Austere practices', 'Fasting', 'Activities requiring extreme self-discipline'],
    tradition: 'This nakshatra is linked with the hammock — a symbol of leisure and restful productivity in Vedic imagery.',
  },
  {
    id: 'uttara_phalguni',
    type: 'nakshatra',
    headline: 'Patronage and Committed Partnership',
    explanation:
      'Uttara Phalguni is ruled by the Sun and governed by Aryaman (deity of contracts and social bonds). Its Sthira (fixed) nature and association with the Sun make it excellent for long-term commitments, official agreements, and patronage. The energy here is warm, reliable, and sustaining.',
    bestFor: ['Marriages and partnerships', 'Long-term investments', 'Official agreements', 'Building social networks', 'Government work'],
    avoid: ['Short-term, transient activities'],
    tradition: 'The Moon in Uttara Phalguni is traditionally considered auspicious for birth — Vedic astrology associates it with individuals who become benefactors and protectors.',
  },
  {
    id: 'hasta',
    type: 'nakshatra',
    headline: 'Skilled Hands and Quick Execution',
    explanation:
      'Hasta (the hand) is ruled by the Moon and governed by Savitar (the creative aspect of the Sun). Its Laghu and swift nature makes it ideal for skilled craftsmanship, dexterous activities, and anything requiring nimble execution. Hasta carries a productive, practical energy that doesn\'t overthink.',
    bestFor: ['Craft work', 'Medical procedures', 'Trading', 'Travel', 'Healing with hands (massage, surgery)'],
    avoid: ['Long deliberation without action'],
    tradition: 'Hasta is associated with Virgo — the sign of discrimination and craftsmanship; its symbol, the open hand, represents both giving and skilled making.',
  },
  {
    id: 'chitra',
    type: 'nakshatra',
    headline: 'Brilliant Creativity and Aesthetic Vision',
    explanation:
      'Chitra (the bright one) is ruled by Mars and governed by Tvashtar (the divine architect). Its Mrdu (tender) nature combined with Mars\' drive produces exceptional energy for creative vision with precise execution. This is the architect\'s nakshatra — it sees beauty in structure.',
    bestFor: ['Architecture', 'Interior design', 'Jewelry making', 'Fashion', 'Software design', 'Visual arts'],
    avoid: ['Activities without aesthetic consideration', 'Purely routine, uncreative work'],
    tradition: 'The star Spica (Chitra) is one of the brightest in the sky — associated with Brahma\'s creative brilliance in classical texts.',
  },
  {
    id: 'swati',
    type: 'nakshatra',
    headline: 'Independent Movement and Adaptability',
    explanation:
      'Swati (the independent one) is ruled by Rahu and governed by Vayu (wind deity). Its Chara (movable) nature and symbolism of a young sprout bending in the wind reflect resilience through flexibility. This nakshatra supports independent action and trading — activities that benefit from the ability to move in any direction.',
    bestFor: ['Commerce and trading', 'Travel', 'Learning new technologies', 'Independent projects', 'Wind/air-related work'],
    avoid: ['Activities requiring rigid adherence to tradition'],
    tradition: 'Swati is associated with merchants and traders in classical Jyotish; its airy, movable nature was seen as ideal for those who traveled and exchanged goods.',
  },
  {
    id: 'vishakha',
    type: 'nakshatra',
    headline: 'Purposeful Achievement Through Sustained Effort',
    explanation:
      'Vishakha is ruled by Jupiter and governed by Indra-Agni (power and fire combined). Its mixed sharp-soft nature reflects a nakshatra of determined purpose — the forked branch symbol captures the capacity to split focus between worldly and spiritual achievement. It rewards sustained effort rather than quick wins.',
    bestFor: ['Long-term goal pursuit', 'Competitive activities', 'Religious study', 'Achieving recognition'],
    avoid: ['Short-term thinking', 'Abandoning projects midway'],
    tradition: 'Vishakha spans Libra and Scorpio, giving it both the balance of relationships and the intensity of transformation; its energy favors those who persist.',
  },
  {
    id: 'anuradha',
    type: 'nakshatra',
    headline: 'Devotion, Friendship, and Organization',
    explanation:
      'Anuradha is ruled by Saturn and governed by Mitra (the deity of friendship and contracts). Its Mrdu (soft) nature carries the reliability of Saturn with the warmth of devotion. This nakshatra is exceptional for building loyal organizations, deep friendships, and devotional practices.',
    bestFor: ['Building organizations', 'Forming lasting friendships', 'Travel', 'Devotional worship', 'Creating systems'],
    avoid: ['Betraying trust', 'Superficial networking'],
    tradition: 'Anuradha is associated with Scorpio but carries the diplomatic warmth of Mitra — a synthesis of depth and loyalty that classical texts consider ideal for community leaders.',
  },
  {
    id: 'jyeshtha',
    type: 'nakshatra',
    headline: 'Protective Authority with Edge',
    explanation:
      'Jyeshtha (the eldest) is ruled by Mercury and governed by Indra (the chief of gods). Its sharp, fierce nature carries the energy of a protective elder — powerful but prone to pride and overextension. Activities that require asserting authority, protecting the vulnerable, or confronting enemies directly are well-supported.',
    bestFor: ['Leadership and protection', 'Legal proceedings', 'Military-style decisions', 'Addressing enemies'],
    avoid: ['Starting peaceful collaborations', 'Humble or yielding activities'],
    tradition: 'Jyeshtha\'s symbol is the earring or circular amulet — a protective talisman; the nakshatra is associated with chieftains and champions in classical texts.',
  },
  {
    id: 'mula',
    type: 'nakshatra',
    headline: 'Root Investigation and Radical Change',
    explanation:
      'Mula (root) is ruled by Ketu and governed by Nirriti (the deity of dissolution). Its sharp energy reaches to foundations — excellent for uprooting old structures, investigating root causes, and initiating radical transformation. The lion tail symbol captures both ferocity and pride.',
    bestFor: ['Research into root causes', 'Radical life changes', 'Herbal medicine', 'Deconstruction before rebuilding'],
    avoid: ['Starting new relationships or ventures (without clear karmic purpose)', 'Superficial treatments of deep problems'],
    tradition: 'Mula nakshatra births traditionally prompted special astrological attention in classical texts; it is seen as marking souls with intense karmic purpose.',
  },
  {
    id: 'purva_ashadha',
    type: 'nakshatra',
    headline: 'Invincible Purification',
    explanation:
      'Purva Ashadha (the early victory) is ruled by Venus and governed by Apas (water deities). Its Ugra nature reflects the purifying force of water — gentle in gradual accumulation but irresistible once in motion. This nakshatra supports purification, cleansing, and building momentum toward declared victories.',
    bestFor: ['Purification rituals', 'Competitive events', 'Water-related activities', 'Declaring intentions with commitment'],
    avoid: ['Activities requiring immediate, forceful results'],
    tradition: 'The winnowing fan symbol suggests separating the essential from the inessential — a metaphor for focused purification in classical texts.',
  },
  {
    id: 'uttara_ashadha',
    type: 'nakshatra',
    headline: 'Final Victory and Lasting Achievement',
    explanation:
      'Uttara Ashadha (the later victory) is ruled by the Sun and governed by the Vishvedevas (all the gods). Its Sthira (fixed) nature combined with universal divine support makes it one of the most auspicious nakshatras for lasting achievements and long-term commitments. Victories begun here tend to endure.',
    bestFor: ['Permanent establishments', 'Receiving recognition', 'Long-term investments', 'Government work', 'Ceremonies marking final achievement'],
    avoid: ['Temporary or short-term activities that don\'t need permanence'],
    tradition: 'Uttara Ashadha is associated with the elephant tusk — a symbol of strength, patience, and accumulated wisdom in Vedic symbolism.',
  },
  {
    id: 'shravana',
    type: 'nakshatra',
    headline: 'Learning Through Listening',
    explanation:
      'Shravana (hearing) is ruled by the Moon and governed by Vishnu. Its Chara (movable) nature and ear symbolism make it ideal for receiving knowledge, listening to teachers, studying scriptures, and connecting with wisdom traditions. Vishnu\'s association brings preservation and support.',
    bestFor: ['Studying', 'Attending lectures', 'Listening practices', 'Travel to sacred sites', 'Connecting with mentors'],
    avoid: ['Activities requiring loud assertion or forceful expression'],
    tradition: 'Shravan Somvar (Mondays in the lunar month of Shravana) are among the most sacred for Shiva worship; the month itself is named for this nakshatra.',
  },
  {
    id: 'dhanishtha',
    type: 'nakshatra',
    headline: 'Wealth, Music, and Martial Discipline',
    explanation:
      'Dhanishtha (the wealthiest) is ruled by Mars and governed by the eight Vasus (deities of elemental abundance). Its Chara nature combines Mars\' drive with the Vasus\' material abundance, making it excellent for wealth-building through active effort. The drum symbolism connects it to rhythm, music, and martial precision.',
    bestFor: ['Financial ventures', 'Music', 'Acquiring property', 'Athletic training', 'Real estate'],
    avoid: ['Marriage (classical texts note a tendency toward relationship friction under Dhanishtha)'],
    tradition: 'Dhanishtha was used by Muhurta astrologers to identify optimal moments for financial transactions and property acquisition.',
  },
  {
    id: 'shatabhisha',
    type: 'nakshatra',
    headline: 'Healing and Hidden Knowledge',
    explanation:
      'Shatabhisha (the hundred physicians) is ruled by Rahu and governed by Varuna (deity of cosmic order and hidden depths). Its movable nature suits it to exploring the hidden, healing complex conditions, and working with subtle energies. It is the nakshatra of secret knowledge and medical mastery.',
    bestFor: ['Medical research', 'Healing chronic conditions', 'Astrology and occult studies', 'Water-related healing', 'Meditation'],
    avoid: ['Superficial activities', 'Public social events (Shatabhisha prefers depth)'],
    tradition: 'The empty circle symbol represents both the void and cosmic containment; Varuna\'s association brings the theme of seeing all — including what is hidden.',
  },
  {
    id: 'purva_bhadrapada',
    type: 'nakshatra',
    headline: 'Intense Transformation and Two-Faced Nature',
    explanation:
      'Purva Bhadrapada is ruled by Jupiter and governed by Aja Ekapada (the one-footed goat, a form of Rudra). Its Ugra (fierce) quality reflects an energy that burns away attachment in preparation for liberation. This nakshatra supports radical renunciation, intense practice, and facing difficult truths.',
    bestFor: ['Deep spiritual practice', 'Breaking addictions', 'Research into dark or hidden subjects', 'Transformational therapy'],
    avoid: ['Starting comfortable, material pursuits', 'Avoiding discomfort'],
    tradition: 'The classical image of Purva Bhadrapada is two funeral cots — a stark symbol of the nakshatra\'s transformative, renunciation-oriented quality.',
  },
  {
    id: 'uttara_bhadrapada',
    type: 'nakshatra',
    headline: 'Depth, Wisdom, and Compassionate Stillness',
    explanation:
      'Uttara Bhadrapada is ruled by Saturn and governed by Ahir Budhnya (the serpent of the deep). Its Sthira (fixed) nature combined with Saturn\'s depth and the ocean serpent\'s stillness creates an energy of profound, patient wisdom. This is one of the most spiritually rich nakshatras — contemplative and compassionate.',
    bestFor: ['Deep meditation', 'Long-term spiritual commitments', 'Writing wisdom literature', 'Working with the elderly'],
    avoid: ['Rapid, frenetic activity', 'Superficial interactions'],
    tradition: 'Uttara Bhadrapada is often found prominent in charts of ascetics, deep researchers, and those who carry wisdom traditions across generations.',
  },
  {
    id: 'revati',
    type: 'nakshatra',
    headline: 'Safe Passage and Boundless Compassion',
    explanation:
      'Revati (the wealthy) is ruled by Mercury and governed by Pushan (the deity of safe passage and protection of travelers). The final nakshatra of the zodiac, it carries a quality of completion, compassion, and gentle transition. Its soft, tender nature is ideal for supporting others through endings and new beginnings.',
    bestFor: ['Travel (especially long journeys)', 'Caring for others', 'Arts and music', 'Final ceremonies', 'Working with animals'],
    avoid: ['Harsh or aggressive activities', 'Activities that harm the vulnerable'],
    tradition: 'Revati is associated with fish — creatures that move through the depths without being lost; it represents souls who navigate the great ocean of existence with divine guidance.',
  },
];

// ─────────────────────────────────────────────
// YOGAS (1–27)
// ─────────────────────────────────────────────

const YOGA_INSIGHTS: PanchangInsight[] = [
  {
    id: 'vishkambha',
    type: 'yoga',
    headline: 'Obstacle Energy — Proceed Mindfully',
    explanation:
      'Vishkambha means "pillar of obstacles." Astronomically, it arises when the combined Sun-Moon longitude falls in the first 13°20\' of the yoga cycle. Classical Muhurta texts consistently rate it as inauspicious for new beginnings but consider it useful for activities where force is needed to break through resistance.',
    bestFor: ['Confronting established blocks', 'Demolition or clearing', 'Addressing enemies'],
    avoid: ['Starting new ventures', 'Travel', 'Auspicious ceremonies'],
    tradition: 'Vishkambha opens the 27-yoga cycle and is one of the five inauspicious yogas most carefully avoided in traditional Muhurta.',
  },
  {
    id: 'priti',
    type: 'yoga',
    headline: 'Love and Affection',
    explanation:
      'Priti (love, affection) is an auspicious yoga that supports activities rooted in warmth and mutual benefit. Its energy facilitates easy connection between people and tends to produce harmonious outcomes in collaborative efforts.',
    bestFor: ['Relationship activities', 'Gifts', 'Partnerships', 'Creative collaboration'],
    avoid: ['Adversarial negotiations'],
    tradition: 'Listed among the auspicious yogas in Muhurta Martanda and Brihat Samhita for marriage and friendship ceremonies.',
  },
  {
    id: 'ayushman',
    type: 'yoga',
    headline: 'Long Life and Robust Health',
    explanation:
      'Ayushman means "long-lived." This yoga is associated with health, vitality, and the sustaining force of life energy. Muhurta texts recommend it for starting health-related practices and for activities intended to be sustained over a long period.',
    bestFor: ['Starting health routines', 'Medical consultations', 'Long-term investments', 'Planting'],
    avoid: ['Reckless or destructive activities'],
    tradition: 'Ayushman is regarded as a protective yoga; births during this yoga were historically considered auspicious in classical astrology.',
  },
  {
    id: 'saubhagya',
    type: 'yoga',
    headline: 'Fortune Favors Action',
    explanation:
      'Saubhagya (good fortune) is one of the most consistently positive yogas in the list. Its influence is said to favor all activities that require external support, luck, or favorable circumstances aligning with effort.',
    bestFor: ['Business ventures', 'Applying for positions', 'Travel', 'Seeking favors'],
    avoid: ['Nothing specifically; generally favorable across domains'],
    tradition: 'Brihat Samhita places Saubhagya among the top-tier auspicious yogas alongside Siddhi and Shubha.',
  },
  {
    id: 'shobhana',
    type: 'yoga',
    headline: 'Splendor and Beauty',
    explanation:
      'Shobhana (splendor) carries an aesthetic quality that amplifies the beauty and radiance of whatever it touches. It is particularly beneficial for creative, artistic, and ceremonial activities where presentation and impression matter.',
    bestFor: ['Arts', 'Weddings', 'Public appearances', 'Creative launches'],
    avoid: ['Activities where aesthetics are irrelevant and efficiency dominates'],
    tradition: 'Shobhana is associated with Indra in some texts — the king of the gods whose realm is renowned for radiance.',
  },
  {
    id: 'atiganda',
    type: 'yoga',
    headline: 'Heightened Risk — Extra Caution',
    explanation:
      'Atiganda means "great danger" — it is among the most inauspicious yogas in classical Muhurta. The word Ganda refers to an obstacle or knot; Ati- amplifies it to "extreme." Events begun under this yoga are thought to carry hidden complications that emerge later.',
    bestFor: ['Internal work only', 'Reviewing and delaying decisions'],
    avoid: ['New ventures', 'Surgery', 'Travel', 'Marriage', 'Major purchases'],
    tradition: 'One of the five most carefully avoided yogas in traditional Muhurta practice alongside Vishkambha, Shula, Ganda, and Vyaghata.',
  },
  {
    id: 'sukarma',
    type: 'yoga',
    headline: 'Meritorious Action',
    explanation:
      'Sukarma (good action) is an auspicious yoga that amplifies the moral and practical quality of work performed. Charitable acts, honest business, and righteous effort are especially rewarded under this yoga. The energy tends to produce karma that is clean and productive.',
    bestFor: ['Charity', 'Ethical business', 'Education', 'Community service'],
    avoid: ['Deceitful or self-serving activities'],
    tradition: 'Sukarma is mentioned in Muhurta texts as one of the yogas that increases the merit of religious observance.',
  },
  {
    id: 'dhriti',
    type: 'yoga',
    headline: 'Firmness and Persistence',
    explanation:
      'Dhriti means "firmness" or "steadiness." This yoga supports activities that require endurance and resolve. It is particularly favorable for undertakings that will face tests over time — the yoga is thought to reinforce the staying power of whatever begins under it.',
    bestFor: ['Long-term projects', 'Athletic training', 'Building discipline', 'Starting businesses'],
    avoid: ['Activities requiring flexibility and rapid change of direction'],
    tradition: 'Dhriti is classified as an auspicious yoga in Muhurta Martanda; its association with steadiness makes it popular for laying foundations.',
  },
  {
    id: 'shula',
    type: 'yoga',
    headline: 'Thorn Energy — Painful Obstacles',
    explanation:
      'Shula (thorn or spear) is an inauspicious yoga that classical texts associate with pain, suffering, and hidden complications. Activities begun under this yoga are thought to produce sharp, unexpected difficulties. It is best used for activities that involve confronting or removing painful conditions.',
    bestFor: ['Surgical removal', 'Ending toxic relationships', 'Confronting painful truths'],
    avoid: ['Auspicious events', 'New partnerships', 'Travel'],
    tradition: 'Shula\'s pain symbolism made it a preferred yoga for cauterization and other medical procedures in Ayurvedic Muhurta tradition.',
  },
  {
    id: 'ganda',
    type: 'yoga',
    headline: 'Knotted Obstacle — Patience Required',
    explanation:
      'Ganda means a knot or tie — it represents an obstruction that is bound and tangled rather than straightforwardly blocked. Activities under this yoga tend to encounter complications that are difficult to diagnose and unravel. Patience and careful problem-solving are required.',
    bestFor: ['Untangling existing complications', 'Administrative work on existing problems'],
    avoid: ['New ventures', 'Investment', 'Starting journeys'],
    tradition: 'Ganda is one of the five primary inauspicious yogas in classical Muhurta; traditional astrologers avoided it for virtually all auspicious activities.',
  },
  {
    id: 'vriddhi',
    type: 'yoga',
    headline: 'Growth and Expansion',
    explanation:
      'Vriddhi (growth) is an auspicious yoga that amplifies the expansive quality of whatever it touches. Material prosperity, bodily health, and social influence tend to increase under this yoga. It is particularly favorable for activities related to abundance and increase.',
    bestFor: ['Business expansion', 'Financial investments', 'Planting', 'Starting families', 'Medical treatments aimed at restoration'],
    avoid: ['Downsizing or cutting back'],
    tradition: 'Vriddhi is associated with the increasing quality of the Moon (Chandra) and is mentioned in Brihat Samhita as favorable for prosperity-seeking activities.',
  },
  {
    id: 'dhruva',
    type: 'yoga',
    headline: 'Permanence and Stability',
    explanation:
      'Dhruva (the Pole Star) is an auspicious yoga that lends permanence to whatever is initiated under it. Its fixed quality means outcomes tend to be lasting and reliable. It is especially recommended for activities requiring long-term stability.',
    bestFor: ['Property purchase', 'Establishing institutions', 'Long-term contracts', 'Planting permanent trees'],
    avoid: ['Temporary or transient activities where permanence is unwanted'],
    tradition: 'Named after the Pole Star Dhruva — the child whose devotion earned him permanent, immovable status in the heavens — this yoga is associated with enduring merit.',
  },
  {
    id: 'vyaghata',
    type: 'yoga',
    headline: 'Calamity Risk — Take Extra Care',
    explanation:
      'Vyaghata (calamity or tiger blow) is one of the five most inauspicious yogas. Its name evokes a tiger\'s sudden, ferocious strike — unexpected disaster that cannot be easily predicted or defended. Classical texts strongly advise avoiding auspicious activities during this yoga.',
    bestFor: ['Internal protective practices', 'Reviewing insurance and security measures'],
    avoid: ['All auspicious activities', 'Starting new ventures', 'Travel'],
    tradition: 'Vyaghata appears in every classical Muhurta text as a yoga to avoid; it was historically taken as a warning sign in electional astrology.',
  },
  {
    id: 'harshana',
    type: 'yoga',
    headline: 'Joy and Celebration',
    explanation:
      'Harshana (joy) is an auspicious yoga associated with delight, celebration, and positive emotional energy. Activities that generate happiness for self and others — including ceremonies, entertainment, and gift-giving — are amplified under this yoga.',
    bestFor: ['Celebrations', 'Gifts', 'Social gatherings', 'Arts and entertainment'],
    avoid: ['Activities requiring solemnity or grief work'],
    tradition: 'Harshana is listed among the positive yogas in classical texts; its energy is considered supportive for activities aimed at collective wellbeing.',
  },
  {
    id: 'vajra',
    type: 'yoga',
    headline: 'Thunderbolt Energy — Intense and Risky',
    explanation:
      'Vajra (thunderbolt) is an inauspicious yoga associated with sudden, powerful disruption. Like the thunderbolt weapon of Indra, it can destroy or illuminate — rarely in between. Classical Muhurta texts treat it as one of the more dangerous yogas for worldly activities.',
    bestFor: ['Breaking through truly impenetrable obstacles', 'Situations requiring force'],
    avoid: ['Travel by air or water', 'Auspicious ceremonies', 'Major decisions'],
    tradition: 'Vajra\'s double nature (destructive yet clarifying) is acknowledged in some Tantric traditions where it symbolizes indestructible clarity.',
  },
  {
    id: 'siddhi',
    type: 'yoga',
    headline: 'Accomplishment — Highest Auspiciousness',
    explanation:
      'Siddhi (accomplishment or attainment) is one of the most auspicious yogas in classical Muhurta. Activities begun under this yoga are thought to reach their intended outcome — the word literally means "success." It is sought for the most important undertakings.',
    bestFor: ['All important new ventures', 'Medical procedures', 'Marriage', 'Entering new homes', 'Starting any significant project'],
    avoid: ['Nothing specific — generally the highest-rated yoga for positive actions'],
    tradition: 'Siddhi is mentioned in virtually every Muhurta text as one of the premier yogas; Guru Pushya Yoga and Siddhi combinations are especially sought for initiating important works.',
  },
  {
    id: 'vyatipata',
    type: 'yoga',
    headline: 'Inauspicious Crossing — Avoid Beginnings',
    explanation:
      'Vyatipata (misfortune or ill-omen) is one of the two most consistently inauspicious yogas (along with Vaidhriti). It occurs when the Sun and Moon are in certain angular relationships that produce what classical texts describe as "crossed fortunes." Activities begun now tend to face reversal.',
    bestFor: ['Completing things rather than starting them', 'Internal reflection'],
    avoid: ['Absolutely everything auspicious', 'Travel', 'Surgery', 'Marriage'],
    tradition: 'Vyatipata is one of the five Panchaka-like configurations that some traditions treat as a full fast day; it appears in Dharmashastra as an inauspicious tithi for many activities.',
  },
  {
    id: 'variyan',
    type: 'yoga',
    headline: 'Excellence in Effort',
    explanation:
      'Variyan (excellent, the best) is an auspicious yoga associated with achieving superior results through effort. It supports activities where quality matters and where the person is willing to put in sustained work to achieve an excellent outcome.',
    bestFor: ['Skilled craftsmanship', 'Academic achievement', 'Competitive excellence', 'Quality-focused work'],
    avoid: ['Lazy or half-hearted efforts — this yoga rewards full commitment'],
    tradition: 'Classical texts associate Variyan with achieving through merit; it is considered particularly favorable for those in scholarly and technical fields.',
  },
  {
    id: 'parigha',
    type: 'yoga',
    headline: 'Obstruction at the Threshold',
    explanation:
      'Parigha (a bar or bolt across a door) is an inauspicious yoga that creates blockages at thresholds — the point of entry into new phases. Activities involving entering new territory (new jobs, new cities, new relationships) encounter invisible resistance under this yoga.',
    bestFor: ['Staying where you are', 'Deepening existing commitments rather than starting new ones'],
    avoid: ['Entering new homes', 'Starting new jobs', 'Travel to new destinations', 'New relationships'],
    tradition: 'Parigha\'s threshold-blocking quality was well-known to Muhurta astrologers; it is specifically avoided for griha pravesh (entering a new home) ceremonies.',
  },
  {
    id: 'shiva',
    type: 'yoga',
    headline: 'Auspicious and Transformative',
    explanation:
      'Shiva yoga carries the quality of Shiva — simultaneously auspicious, powerful, and transformative. It is excellent for spiritual practice, yogic activity, and all undertakings where one seeks both worldly success and inner development simultaneously.',
    bestFor: ['Yoga and meditation', 'Spiritual ceremonies', 'Medical healing', 'Starting transformative practices'],
    avoid: ['Activities that are purely material without any higher purpose'],
    tradition: 'Shiva yoga\'s connection to the great transformative deity makes it particularly auspicious in Shaiva traditions for beginning new practices.',
  },
  {
    id: 'siddha',
    type: 'yoga',
    headline: 'The Perfected Ones — Mastery Energy',
    explanation:
      'Siddha (accomplished, perfected) is among the most auspicious yogas. Unlike Siddhi which emphasizes completion, Siddha emphasizes the quality of mastery — the activity not only succeeds but achieves a level of excellence. It supports attainment of rare skills and deep realization.',
    bestFor: ['Learning advanced skills', 'Initiating into practices', 'Major ceremonies requiring perfection'],
    avoid: ['Half-measures'],
    tradition: 'Siddha yoga is often combined with other powerful muhurta elements (like Pushya nakshatra) to create highly auspicious election charts in classical Muhurta.',
  },
  {
    id: 'sadhya',
    type: 'yoga',
    headline: 'Achievable Goals — Practical Success',
    explanation:
      'Sadhya (achievable) is an auspicious yoga associated with practical accomplishment of well-defined goals. Unlike the exceptional peaks of Siddhi and Siddha, Sadhya suggests a reliable, workmanlike success — the kind that comes from clear effort toward clear goals.',
    bestFor: ['Setting clear goals and working toward them', 'Practical business activities', 'Completing tasks on deadline'],
    avoid: ['Vague or undefined undertakings'],
    tradition: 'Sadhya appears in Muhurta texts as one of the dependable auspicious yogas for routine but important worldly activities.',
  },
  {
    id: 'shubha',
    type: 'yoga',
    headline: 'Auspicious in All Respects',
    explanation:
      'Shubha (auspicious) is a broadly positive yoga that blesses activities across most domains. It does not carry the specialized intensity of Siddhi but provides a generally favorable backdrop for almost any positive undertaking.',
    bestFor: ['All auspicious activities', 'Weddings', 'Travel', 'Business', 'Learning'],
    avoid: ['Activities that are by nature inauspicious (the yoga does not transform inauspicious intent)'],
    tradition: 'Shubha is one of the most commonly cited auspicious yogas in popular Muhurta almanacs; its broad applicability makes it widely used.',
  },
  {
    id: 'shukla',
    type: 'yoga',
    headline: 'Bright and Clear — Purity of Action',
    explanation:
      'Shukla (bright or pure) carries a quality of clarity, purity, and clean beginning. Like the Shukla Paksha (bright fortnight), this yoga suggests transparent, honest activities done in the open. Clarity of intention tends to be rewarded under Shukla yoga.',
    bestFor: ['Honest business dealings', 'Starting charitable work', 'Medical treatments', 'Education'],
    avoid: ['Deceptive or hidden activities'],
    tradition: 'Shukla yoga\'s purity association aligns it with Venus (Shukra) in traditional Indian culture — the planet of refined beauty and ethical conduct.',
  },
  {
    id: 'brahma',
    type: 'yoga',
    headline: 'Creative Power of the Divine',
    explanation:
      'Brahma yoga carries the creative power of Brahma — the original cosmic creator. Activities that bring something entirely new into existence are favored. This is an excellent yoga for innovation, composition, and original creative work.',
    bestFor: ['Original creative work', 'Composing', 'Designing new systems', 'Academic writing'],
    avoid: ['Activities that are purely derivative or copying'],
    tradition: 'Associated with Brahma\'s domain of creation and knowledge, this yoga is considered favorable for learning activities in some classical texts.',
  },
  {
    id: 'indra',
    type: 'yoga',
    headline: 'Royal Power and Authority',
    explanation:
      'Indra yoga carries the energy of the king of the gods — powerful, expansive, and authoritative. Activities requiring the exercise of power, leadership, or the granting and receiving of boons and honors are well-suited to this yoga.',
    bestFor: ['Leadership activities', 'Seeking royal or governmental favor', 'Receiving awards', 'Exercising authority'],
    avoid: ['Humble, retiring activities that do not require power'],
    tradition: 'Indra yoga is mentioned in classical texts as favorable for activities requiring the support of persons in authority and for establishing one\'s own dominance.',
  },
  {
    id: 'vaidhriti',
    type: 'yoga',
    headline: 'Deeply Inauspicious — Avoid All New Starts',
    explanation:
      'Vaidhriti is the other yoga (alongside Vyatipata) considered most consistently inauspicious across all classical Muhurta texts. It represents a condition of being "poorly held together" — activities begun here tend to fall apart at critical moments. Even minor activities begun under this yoga may be burdened.',
    bestFor: ['Rest', 'Internal spiritual practice', 'Completing existing obligations'],
    avoid: ['All new ventures', 'Travel', 'Auspicious ceremonies', 'Medical procedures if avoidable'],
    tradition: 'Vaidhriti is treated as a full inauspicious day in many traditional almanacs — some traditions prescribe fasting and prayer rather than worldly activity.',
  },
];

// ─────────────────────────────────────────────
// KARANAS (11 total: 7 chara + 4 sthira)
// ─────────────────────────────────────────────

const KARANA_INSIGHTS: PanchangInsight[] = [
  {
    id: 'bava',
    type: 'karana',
    headline: 'Good for Most Worldly Activities',
    explanation:
      'Bava is a movable (chara) karana associated with Indra and generally considered auspicious for worldly activities. As the first of the seven movable karanas, it carries a quality of initiative and forward motion suitable for most daytime undertakings.',
    bestFor: ['Trade', 'Starting projects', 'Travel', 'Official work'],
    avoid: ['Nothing specific'],
    tradition: 'Classical Muhurta texts describe the movable karanas as generally favorable; Bava is the most consistently recommended for routine worldly activity.',
  },
  {
    id: 'balava',
    type: 'karana',
    headline: 'Supportive and Balanced',
    explanation:
      'Balava carries a quality of support and equipoise. It is associated with activities that require steady, sustaining effort rather than bold initiative. Its energy is mild and conducive to work that benefits others.',
    bestFor: ['Teaching', 'Counseling', 'Medical assistance', 'Community work'],
    avoid: ['Aggressive competition'],
    tradition: 'Listed among the auspicious movable karanas in most Muhurta texts.',
  },
  {
    id: 'kaulava',
    type: 'karana',
    headline: 'Family and Community Focus',
    explanation:
      'Kaulava carries a quality associated with family, community, and extended networks of relationship. Activities that strengthen family bonds or build community are especially favored.',
    bestFor: ['Family gatherings', 'Community organizing', 'Social work', 'Weddings and related ceremonies'],
    avoid: ['Solitary activities disconnected from others'],
    tradition: 'Kaulava is considered a moderately auspicious movable karana in classical texts, suitable for social and familial activities.',
  },
  {
    id: 'taitila',
    type: 'karana',
    headline: 'Productive and Practical',
    explanation:
      'Taitila is associated with practical productivity and the quality of getting things done efficiently. It is a workhorse karana — neither glamorous nor problematic — that supports steady output in routine professional and domestic activities.',
    bestFor: ['Administrative work', 'Domestic activities', 'Completing ongoing tasks'],
    avoid: ['Nothing specific'],
    tradition: 'Listed as a movable karana of ordinary auspiciousness in classical Muhurta texts.',
  },
  {
    id: 'garaja',
    type: 'karana',
    headline: 'Movement and Commerce',
    explanation:
      'Garaja carries an energy associated with movement, trade, and exchange. It is favorable for commercial transactions and for activities involving physical movement — travel, relocation, or working with goods in transit.',
    bestFor: ['Trade', 'Travel', 'Transporting goods', 'Commercial negotiations'],
    avoid: ['Sedentary activities requiring deep focus'],
    tradition: 'Garaja is listed as a movable karana; its association with commerce and travel made it a practical choice in Muhurta for merchants and travelers.',
  },
  {
    id: 'vanija',
    type: 'karana',
    headline: 'Merchant Energy — Excellent for Trade',
    explanation:
      'Vanija literally means "merchant" — making this karana exceptionally favorable for all forms of commerce, negotiation, and exchange. Financial transactions, market activities, and business dealings of all kinds benefit from this karana.',
    bestFor: ['Business and trade', 'Financial transactions', 'Market activities', 'Negotiations', 'Shopping'],
    avoid: ['Purely spiritual activities (the energy is directed toward material exchange)'],
    tradition: 'Vanija is one of the most frequently cited karanas for commercial activity in classical Muhurta texts; some almanacs note it specifically for market day activities.',
  },
  {
    id: 'vishti',
    type: 'karana',
    headline: 'Bhadra — Inauspicious Moving Period',
    explanation:
      'Vishti is also known as Bhadra and is the only consistently inauspicious movable karana. Classical texts describe it as a period to avoid all auspicious activities. It is thought to produce obstacles, conflict, and difficulty for any new beginning. The inauspiciousness is temporary (each karana lasts ~6 hours).',
    bestFor: ['Rest', 'Internal work', 'Dealing with enemies or difficult situations (the fierce energy can be directed here)'],
    avoid: ['Travel', 'Auspicious ceremonies', 'Starting projects', 'Major purchases'],
    tradition: 'Vishti/Bhadra is one of the most universally avoided periods in traditional Muhurta; almanacs mark it prominently as a warning window.',
  },
  {
    id: 'shakuni',
    type: 'karana',
    headline: 'Fixed Cunning — Caution Advised',
    explanation:
      'Shakuni is a fixed (sthira) karana that occurs only at Amavasya. Named for the cunning advisor from the Mahabharata, it carries an energy of cleverness that can easily tip into manipulation. Classical texts treat it as generally inauspicious for straightforward worldly activities.',
    bestFor: ['Strategic planning', 'Uncovering deception', 'Introspective strategy sessions'],
    avoid: ['Honest business dealings', 'Trusting new people', 'Auspicious events'],
    tradition: 'The four sthira karanas occur only around New Moon; Shakuni\'s association with the New Moon gives it the dark, hidden quality of the darkest lunar phase.',
  },
  {
    id: 'chatushpada',
    type: 'karana',
    headline: 'Four-Footed Stability — Mixed Energy',
    explanation:
      'Chatushpada (four-footed) is a fixed karana associated with animals and agricultural work. Its energy is earthy and stubborn — resistant to sudden change. Classical texts are mixed on its use; some activities related to animals and land do well, while refined or sophisticated activities do not.',
    bestFor: ['Agricultural work', 'Working with animals', 'Land-related activities'],
    avoid: ['Commerce', 'Refined social activities', 'Auspicious ceremonies'],
    tradition: 'Chatushpada\'s animal association made it a karana of particular attention in agricultural communities; its use was carefully governed in Muhurta for farming activities.',
  },
  {
    id: 'naga',
    type: 'karana',
    headline: 'Serpentine Power — Purification and Depth',
    explanation:
      'Naga is a fixed karana associated with serpents and their symbolism of depth, healing, and hidden power. Like the Naga deity, this karana contains both protective and potentially harmful qualities. It is best used for purification, medicine, and engaging with the hidden or subterranean dimensions of life.',
    bestFor: ['Poison treatment', 'Meditation', 'Purification practices', 'Engaging with hidden matters'],
    avoid: ['New worldly beginnings', 'Travel', 'Auspicious ceremonies'],
    tradition: 'Naga karana occurs near New Moon and is associated with the Naga deities who govern underground waters and the serpentine life force energy of kundalini.',
  },
  {
    id: 'kimstughna',
    type: 'karana',
    headline: 'Special Transition — Purifying and Releasing',
    explanation:
      'Kimstughna is a special (sthira) karana that occurs only at the very start of each lunar month (first half of Shukla Pratipada). It carries a purifying, transitional quality — clearing the residue of the previous month before the new cycle properly begins.',
    bestFor: ['Purification rituals', 'Releasing old attachments', 'New Moon intentions'],
    avoid: ['Rushing into new activities before the transition is complete'],
    tradition: 'Kimstughna is described in classical texts as a transitional karana; its brief, liminal quality was associated with crossing thresholds between lunar months.',
  },
];

// ─────────────────────────────────────────────
// VARAS (7 weekdays, 0=Sunday through 6=Saturday)
// ─────────────────────────────────────────────

const VARA_INSIGHTS: PanchangInsight[] = [
  {
    id: 'sunday',
    type: 'vara',
    headline: 'Solar Day — Clarity and Authority',
    explanation:
      'Sunday (Ravivar) is ruled by the Sun. Solar energy favors visibility, authority, and clarity of purpose. The Sun\'s direct, outward quality makes this a good day for leadership, health-oriented activities, and anything requiring a bold, public presence. Biorhythm research has observed peak cortisol and energy levels in morning hours of the first day of the week in many populations.',
    bestFor: ['Leadership activities', 'Health practices', 'Public visibility', 'Government work', 'Seeking recognition'],
    avoid: ['Retiring, hidden, or secretive work'],
    tradition: 'Sunday is dedicated to Surya (the Sun) across Hindu tradition; morning sun worship (Surya Namaskar) and offerings at sunrise are traditional.',
  },
  {
    id: 'monday',
    type: 'vara',
    headline: 'Lunar Day — Emotion, Nourishment, and Flow',
    explanation:
      'Monday (Somavar) is ruled by the Moon. Lunar energy supports receptivity, emotional intelligence, and nurturing activities. The connection to water and fluids makes it favorable for anything involving care, healing, and the arts. The mind tends toward reflection rather than assertion.',
    bestFor: ['Emotional conversations', 'Cooking and nourishing others', 'Creative arts', 'Starting diets', 'Healing practices'],
    avoid: ['Aggressive negotiations', 'Demanding physical output'],
    tradition: 'Somavar is one of the most widely observed fast days for Shiva worship; the Moon\'s close relationship with Shiva (who wears the crescent) is central to this tradition.',
  },
  {
    id: 'tuesday',
    type: 'vara',
    headline: 'Martial Day — Action, Courage, and Physical Power',
    explanation:
      'Tuesday (Mangalvar) is ruled by Mars. Martian energy is assertive, physical, and decisive. This is the day of courage and direct action — excellent for physical training, surgery, and confronting challenges head-on. The same energy that drives achievement can produce conflict if not channeled.',
    bestFor: ['Physical training', 'Surgery', 'Confronting enemies', 'Starting competitive activities', 'Engineering work'],
    avoid: ['Peaceful negotiations', 'Beginning marriages (in some regional traditions)'],
    tradition: 'Mangalvar is dedicated to Hanuman across much of North India; the emphasis on courage, strength, and service aligns with Martian qualities.',
  },
  {
    id: 'wednesday',
    type: 'vara',
    headline: 'Mercurial Day — Communication, Commerce, and Learning',
    explanation:
      'Wednesday (Budhvar) is ruled by Mercury. Mercurial energy is quick, analytical, and communicative — ideal for business transactions, intellectual work, and anything involving language or information exchange. Decisions made on Wednesday tend to be well-reasoned when Mercury is strong.',
    bestFor: ['Business and commerce', 'Writing and communication', 'Learning', 'Meeting people', 'Trading'],
    avoid: ['Slow, deliberate physical work that requires patience over quickness'],
    tradition: 'Budhvar is dedicated to Ganesha in some traditions — the deity of intellect and communication, aligning with Mercury\'s domain.',
  },
  {
    id: 'thursday',
    type: 'vara',
    headline: 'Jupiter\'s Day — Wisdom, Expansion, and Blessings',
    explanation:
      'Thursday (Guruvar) is ruled by Jupiter — the planet of wisdom, teaching, and expansion. This day carries the most naturally auspicious energy of the week for spiritual practices, education, and receiving guidance. Jupiter\'s expansive quality benefits anything intended to grow in a wholesome direction.',
    bestFor: ['Spiritual practice', 'Education', 'Meeting teachers', 'Starting long-term auspicious activities', 'Legal proceedings'],
    avoid: ['Petty, mean-spirited activities'],
    tradition: 'Guruvar is dedicated to Brihaspati (Jupiter as divine teacher); it is a preferred day for approaching one\'s guru, making donations to educational institutions, and studying sacred texts.',
  },
  {
    id: 'friday',
    type: 'vara',
    headline: 'Venus Day — Beauty, Pleasure, and Relationship',
    explanation:
      'Friday (Shukravar) is ruled by Venus. This is the day of beauty, pleasure, romance, and material enjoyment. Aesthetic activities, relationship-focused work, and anything that involves beauty and sensory delight are well-supported. Commerce and financial activities connected to luxury and beauty also do well.',
    bestFor: ['Romance and relationships', 'Arts and music', 'Beauty treatments', 'Fashion', 'Buying luxuries'],
    avoid: ['Austere or ascetic practices', 'Confrontational activities'],
    tradition: 'Shukravar is dedicated to Lakshmi — the goddess of beauty and prosperity; Friday observances for wealth and relationship harmony are widespread across India.',
  },
  {
    id: 'saturday',
    type: 'vara',
    headline: 'Saturn\'s Day — Discipline, Karma, and Long-Term Work',
    explanation:
      'Saturday (Shanivar) is ruled by Saturn. Saturnine energy is slow, deliberate, and concerned with long-term consequences and karmic accountability. This is a day for serious, sustained work rather than celebration — excellent for structural planning, Shani puja, and activities where patience and endurance are required.',
    bestFor: ['Long-term planning', 'Structural work', 'Administrative tasks', 'Working with iron and metal', 'Service to the elderly'],
    avoid: ['Starting marriages', 'Investments requiring fast results', 'Frivolous activities'],
    tradition: 'Shanivar is dedicated to Shani (Saturn) — a figure associated with karmic consequences; Shani Puja, oil offerings, and service to the poor are traditional Saturday observances.',
  },
];

// ─────────────────────────────────────────────
// Combined lookup map
// ─────────────────────────────────────────────

const ALL_INSIGHTS: PanchangInsight[] = [
  ...SHUKLA_TITHIS,
  ...KRISHNA_TITHIS,
  ...NAKSHATRA_INSIGHTS,
  ...YOGA_INSIGHTS,
  ...KARANA_INSIGHTS,
  ...VARA_INSIGHTS,
];

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

/** Look up any insight by type + id */
export function getPanchangInsight(
  type: PanchangInsight['type'],
  id: string,
): PanchangInsight | undefined {
  return ALL_INSIGHTS.find((i) => i.type === type && i.id === id);
}

/**
 * Get the insight for a tithi.
 * @param tithiNumber 1–15 (Pratipada–Purnima or Pratipada–Amavasya)
 * @param paksha 'shukla' | 'krishna'
 */
export function getTithiInsight(
  tithiNumber: number,
  paksha: 'shukla' | 'krishna',
): PanchangInsight | undefined {
  const SHUKLA_IDS = [
    'shukla_pratipada', 'shukla_dwitiya', 'shukla_tritiya', 'shukla_chaturthi',
    'shukla_panchami', 'shukla_shashthi', 'shukla_saptami', 'shukla_ashtami',
    'shukla_navami', 'shukla_dashami', 'shukla_ekadashi', 'shukla_dwadashi',
    'shukla_trayodashi', 'shukla_chaturdashi', 'shukla_purnima',
  ];
  const KRISHNA_IDS = [
    'krishna_pratipada', 'krishna_dwitiya', 'krishna_tritiya', 'krishna_chaturthi',
    'krishna_panchami', 'krishna_shashthi', 'krishna_saptami', 'krishna_ashtami',
    'krishna_navami', 'krishna_dashami', 'krishna_ekadashi', 'krishna_dwadashi',
    'krishna_trayodashi', 'krishna_chaturdashi', 'krishna_amavasya',
  ];
  const ids = paksha === 'shukla' ? SHUKLA_IDS : KRISHNA_IDS;
  if (tithiNumber < 1 || tithiNumber > 15) return undefined;
  return getPanchangInsight('tithi', ids[tithiNumber - 1]);
}

/**
 * Get the insight for a nakshatra.
 * @param nakshatraId 1–27 (Ashwini=1 ... Revati=27)
 */
export function getNakshatraInsight(nakshatraId: number): PanchangInsight | undefined {
  const NAKSHATRA_IDS = [
    'ashwini', 'bharani', 'krittika', 'rohini', 'mrigashira', 'ardra',
    'punarvasu', 'pushya', 'ashlesha', 'magha', 'purva_phalguni', 'uttara_phalguni',
    'hasta', 'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha',
    'mula', 'purva_ashadha', 'uttara_ashadha', 'shravana', 'dhanishtha',
    'shatabhisha', 'purva_bhadrapada', 'uttara_bhadrapada', 'revati',
  ];
  if (nakshatraId < 1 || nakshatraId > 27) return undefined;
  return getPanchangInsight('nakshatra', NAKSHATRA_IDS[nakshatraId - 1]);
}

/**
 * Get the insight for an astronomical yoga.
 * @param yogaNumber 1–27 (Vishkambha=1 ... Vaidhriti=27)
 */
export function getYogaInsight(yogaNumber: number): PanchangInsight | undefined {
  const YOGA_IDS = [
    'vishkambha', 'priti', 'ayushman', 'saubhagya', 'shobhana',
    'atiganda', 'sukarma', 'dhriti', 'shula', 'ganda',
    'vriddhi', 'dhruva', 'vyaghata', 'harshana', 'vajra',
    'siddhi', 'vyatipata', 'variyan', 'parigha', 'shiva',
    'siddha', 'sadhya', 'shubha', 'shukla', 'brahma',
    'indra', 'vaidhriti',
  ];
  if (yogaNumber < 1 || yogaNumber > 27) return undefined;
  return getPanchangInsight('yoga', YOGA_IDS[yogaNumber - 1]);
}

/**
 * Get the insight for a karana by its English name.
 * @param karanaName English name (e.g., 'Bava', 'Vishti')
 */
export function getKaranaInsight(karanaName: string): PanchangInsight | undefined {
  const normalized = karanaName.toLowerCase().replace(/\s+/g, '_');
  const KARANA_NAME_MAP: Record<string, string> = {
    bava: 'bava',
    balava: 'balava',
    kaulava: 'kaulava',
    taitila: 'taitila',
    garaja: 'garaja',
    gara: 'garaja',  // alternate spelling
    vanija: 'vanija',
    vishti: 'vishti',
    bhadra: 'vishti',  // alternate name
    shakuni: 'shakuni',
    chatushpada: 'chatushpada',
    naga: 'naga',
    kimstughna: 'kimstughna',
    kinstughna: 'kimstughna',  // alternate spelling
  };
  const id = KARANA_NAME_MAP[normalized];
  if (!id) return undefined;
  return getPanchangInsight('karana', id);
}

/**
 * Get the insight for a vara (weekday).
 * @param dayOfWeek 0=Sunday, 1=Monday, ..., 6=Saturday
 * Uses the standard JS/JD convention: 0=Sunday (Math.floor(jd + 1.5) % 7)
 */
export function getVaraInsight(dayOfWeek: number): PanchangInsight | undefined {
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const VARA_IDS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  if (dayOfWeek < 0 || dayOfWeek > 6) return undefined;
  return getPanchangInsight('vara', VARA_IDS[dayOfWeek]);
}

export { ALL_INSIGHTS, SHUKLA_TITHIS, KRISHNA_TITHIS, NAKSHATRA_INSIGHTS, YOGA_INSIGHTS, KARANA_INSIGHTS, VARA_INSIGHTS };
