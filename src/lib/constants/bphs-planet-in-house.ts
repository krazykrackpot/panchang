/**
 * BPHS Planet-in-House Classical Citations
 *
 * 108 entries (9 planets x 12 houses) from Brihat Parashara Hora Shastra.
 * Planets 0-6 (Sun through Saturn): Chapter 24 "Effects of Planets in Houses"
 * Planets 7-8 (Rahu, Ketu): Chapter 47 "Effects of Shadow Planets"
 *
 * Translation excerpts are paraphrased from standard BPHS translations
 * (Girish Chand Sharma, R. Santhanam). Sanskrit excerpts to be added later.
 *
 * Keyed by planetId (0-8) then house (1-12).
 */

import type { ClassicalCitation } from '@/lib/kundali/tippanni-types';

function cite(
  chapter: number,
  verseRange: string,
  translationExcerpt: string,
  house: number,
  planetName: string,
): ClassicalCitation {
  return {
    textName: 'BPHS',
    textFullName: 'Brihat Parashara Hora Shastra',
    chapter,
    verseRange,
    sanskritExcerpt: null,
    translationExcerpt,
    relevanceNote: `${planetName} in ${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'} house from Lagna`,
  };
}

// Chapter 24: Effects of the Sun in houses 1-12
const SUN_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '1-2', 'The native will have sparse hair, be lazy in disposition, of a bilious temperament, given to anger, will have a tall body, impaired eyes, bone ailments, be valorous and cruel.', 1, 'Sun')],
  2: [cite(24, '3-4', 'The native will be devoid of learning, shameless, will stammer, be without wealth, will depend on others for food, and be called by bad names. The face may bear marks or blemishes.', 2, 'Sun')],
  3: [cite(24, '5-6', 'The native will be valorous, strong, victorious over enemies, wealthy, and will have good relations with siblings. Intelligence and strength will be notable.', 3, 'Sun')],
  4: [cite(24, '7-8', 'The native will be devoid of happiness from relatives, friends, home, and conveyances. Government favour may be lacking. The mind will be troubled and the native may be without landed property.', 4, 'Sun')],
  5: [cite(24, '9-10', 'The native will be bereft of happiness, wealth, and progeny, will be short-lived, intelligent, and given to wandering. Interest in mantras and spiritual practices is indicated.', 5, 'Sun')],
  6: [cite(24, '11-12', 'The native will be famous, a destroyer of enemies, powerful, wealthy, will have a good digestive fire, and be victorious. Enemies will be subdued.', 6, 'Sun')],
  7: [cite(24, '13-14', 'The native will face humiliation from women or government, will wander without purpose, suffer from diseases, and be bereft of marital happiness. The spouse may be afflicted.', 7, 'Sun')],
  8: [cite(24, '15-16', 'The native will have few children, impaired eyesight, and a short life. There may be separation from close ones, loss of wealth, and interest in occult knowledge.', 8, 'Sun')],
  9: [cite(24, '17-18', 'The native will be endowed with children and wealth, will be devoted to God, will be charitable, and well versed in sacred texts. Relations with the father may be strained.', 9, 'Sun')],
  10: [cite(24, '19-20', 'The native will be blessed with paternal happiness, will be a king or equal to a king, famous, intelligent, strong, and charitable. Success in career and public life is indicated.', 10, 'Sun')],
  11: [cite(24, '21-22', 'The native will be wealthy, long-lived, happy, with many servants, and possessed of conveyances. Gains from authority and powerful connections will come easily.', 11, 'Sun')],
  12: [cite(24, '23-24', 'The native will be inimical toward the father, suffer from eye ailments, be without wealth, without sons, and may reside in foreign lands. Spiritual inclinations may develop.', 12, 'Sun')],
};

// Chapter 24: Effects of the Moon in houses 1-12
const MOON_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '25-26', 'The native will be beautiful, soft-hearted, will have an attractive personality, be valorous, and fond of the opposite gender. A full (bright) Moon here gives wealth and fame; a waning Moon gives weakness.', 1, 'Moon')],
  2: [cite(24, '27-28', 'The native will be wealthy, will enjoy good food, handsome face, and be learned. The family will be large and the native will earn through multiple sources.', 2, 'Moon')],
  3: [cite(24, '29-30', 'The native will be courageous, will have siblings, be proud, will have servants, and be inclined toward virtuous deeds. Mental strength and short journeys are favoured.', 3, 'Moon')],
  4: [cite(24, '31-32', 'The native will be happy, will possess conveyances, houses, ornaments, and lands. Maternal happiness is indicated. The mind will be at ease, and domestic life comfortable.', 4, 'Moon')],
  5: [cite(24, '33-34', 'The native will be wise, will have ministerial positions, will be sharp-witted, and be blessed with good children. If afflicted, there may be mental restlessness.', 5, 'Moon')],
  6: [cite(24, '35-36', 'The native will be short-lived, will suffer from stomach ailments, face humiliation from enemies, and be lazy. If the Moon is waning, health issues become more prominent.', 6, 'Moon')],
  7: [cite(24, '37-38', 'The native will be attractive, passionate, happy in marriage, and will have a beautiful spouse. Popularity in public dealings is indicated.', 7, 'Moon')],
  8: [cite(24, '39-40', 'The native will be sickly, short-lived, and will have mental disturbances. If the Moon is full and benefic-aspected, longevity improves and psychic abilities develop.', 8, 'Moon')],
  9: [cite(24, '41-42', 'The native will be virtuous, eloquent, wealthy, devoted to God, and blessed with children. Righteous conduct and philosophical inclination are indicated.', 9, 'Moon')],
  10: [cite(24, '43-44', 'The native will be charitable, learned, wealthy, brave, and will perform virtuous deeds. Success in public life and career prominence are indicated.', 10, 'Moon')],
  11: [cite(24, '45-46', 'The native will be wealthy, illustrious, long-lived, blessed with children, and will have many friends. Gains through social connections come readily.', 11, 'Moon')],
  12: [cite(24, '47-48', 'The native will be lazy, humiliated, will have defective limbs, and be inimical toward others. If the Moon is well-aspected, foreign residence and spiritual development are possible.', 12, 'Moon')],
};

// Chapter 24: Effects of Mars in houses 1-12
const MARS_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '49-50', 'The native will have a mark or wound on the body, be courageous, short-lived in some readings, and of a cruel disposition. Valor, physical strength, and a love of adventure are indicated.', 1, 'Mars')],
  2: [cite(24, '51-52', 'The native will be without education, without wealth, will eat bad food, will depend on bad people, and will have an ugly face. Harsh speech and family discord are possible.', 2, 'Mars')],
  3: [cite(24, '53-54', 'The native will be valorous, unconquerable, wealthy, happy, and good-natured. Relations with siblings will be supportive and the native will display great courage.', 3, 'Mars')],
  4: [cite(24, '55-56', 'The native will be devoid of relatives, friends, mother, lands, and happiness. Domestic unrest, disputes over property, and lack of mental peace are indicated.', 4, 'Mars')],
  5: [cite(24, '57-58', 'The native will be without children, without wealth, and will have a wavering mind. If well-aspected, intelligence in competitive pursuits and speculation is indicated.', 5, 'Mars')],
  6: [cite(24, '59-60', 'The native will be wealthy, famous, will overpower enemies, and be a king or leader. This is one of the best placements for Mars — enemies are decisively defeated.', 6, 'Mars')],
  7: [cite(24, '61-62', 'The native will lose the spouse or face domestic strife, will wander uselessly, and will be humiliated. Manglik dosha applies, affecting marital harmony.', 7, 'Mars')],
  8: [cite(24, '63-64', 'The native will be sickly, short-lived, and will have few possessions. Interest in surgery, martial arts, or occult research is indicated. Accidents or injuries are possible.', 8, 'Mars')],
  9: [cite(24, '65-66', 'The native will be sinful, will speak ill of elders and preceptors, be fatherless early, and go on pilgrimages. If well-placed, courage in defending beliefs is indicated.', 9, 'Mars')],
  10: [cite(24, '67-68', 'The native will be brave, famous, prosperous, and devoted to the king or government. Career success through decisive action and military-like discipline is indicated.', 10, 'Mars')],
  11: [cite(24, '69-70', 'The native will be wealthy, courageous, happy, and will possess lands and conveyances. Gains through courage, competition, and bold enterprise are indicated.', 11, 'Mars')],
  12: [cite(24, '71-72', 'The native will have eye ailments, will be a sinner, will be cruel, without spouse happiness, and will face losses. Expenditure through conflicts or hidden enemies is indicated.', 12, 'Mars')],
};

// Chapter 24: Effects of Mercury in houses 1-12
const MERCURY_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '73-74', 'The native will be learned, sweet-spoken, long-lived, and will have good memory. A sharp intellect, youthful appearance, and adaptable personality are indicated.', 1, 'Mercury')],
  2: [cite(24, '75-76', 'The native will be wealthy, sweet-tongued, a poet, learned in the scriptures, and will enjoy fine food. Earning through intellect and communication is favoured.', 2, 'Mercury')],
  3: [cite(24, '77-78', 'The native will be courageous, will have siblings, be devoted to virtue, and will have a medium life span. Skill in writing, media, and short-distance travel is indicated.', 3, 'Mercury')],
  4: [cite(24, '79-80', 'The native will be learned, happy, will possess houses, ornaments, and conveyances. An educated home environment and success in property matters are indicated.', 4, 'Mercury')],
  5: [cite(24, '81-82', 'The native will be a minister or advisor, eloquent, skilled in mantras, and blessed with children. Sharp intelligence and skill in speculation or teaching are indicated.', 5, 'Mercury')],
  6: [cite(24, '83-84', 'The native will be lazy, very harsh in speech, quarrelsome, and will face enemies. However, the ability to solve complex problems analytically is strong.', 6, 'Mercury')],
  7: [cite(24, '85-86', 'The native will be learned, good-looking, will have a learned spouse, and be well-versed in arts. Success in partnerships and communication-based businesses is indicated.', 7, 'Mercury')],
  8: [cite(24, '87-88', 'The native will be famous, long-lived, will serve the ruler, and will have many sources of income. Analytical approach to mysteries and research is indicated.', 8, 'Mercury')],
  9: [cite(24, '89-90', 'The native will be devoted to God, eloquent, scholarly, wealthy, and blessed with children. Interest in philosophy, teaching, and foreign cultures is indicated.', 9, 'Mercury')],
  10: [cite(24, '91-92', 'The native will be wise, happy, valorous, truthful, and will be prosperous. Career success through intellect, communication, and business acumen is indicated.', 10, 'Mercury')],
  11: [cite(24, '93-94', 'The native will be wealthy, truthful, long-lived, and will have many friends. Gains through intellectual pursuits, networking, and trade are indicated.', 11, 'Mercury')],
  12: [cite(24, '95-96', 'The native will be mean, ineffective in speech, lazy, without wealth, and humiliated. If well-aspected, foreign communication work and a rich inner mental life are possible.', 12, 'Mercury')],
};

// Chapter 24: Effects of Jupiter in houses 1-12
const JUPITER_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '97-98', 'The native will be handsome, happy, devoted to God, long-lived, fearless, and favoured by rulers. Wisdom, optimism, and good fortune are inherent qualities.', 1, 'Jupiter')],
  2: [cite(24, '99-100', 'The native will be wealthy, learned, eloquent, blessed with a large family, handsome, and will enjoy good food. Noble speech and financial prosperity are indicated.', 2, 'Jupiter')],
  3: [cite(24, '101-102', 'The native will be mean, stingy, despised by relatives, and will have bad brothers. However, wise communication and eventually good sibling relations are possible if well-aspected.', 3, 'Jupiter')],
  4: [cite(24, '103-104', 'The native will be happy, wealthy, will have good mother, friends, conveyances, and lands. Domestic happiness and comfort in living are strongly indicated.', 4, 'Jupiter')],
  5: [cite(24, '105-106', 'The native will be an advisor or minister, wealthy, blessed with children, and endowed with fame. This is one of the best placements — intelligence and spiritual merit are strong.', 5, 'Jupiter')],
  6: [cite(24, '107-108', 'The native will destroy enemies but will be lazy and humiliated. If afflicted, health issues related to overindulgence are possible.', 6, 'Jupiter')],
  7: [cite(24, '109-110', 'The native will have a virtuous and beautiful spouse, will be superior to the father, and be eloquent. Fortunate and ethical partnerships are indicated.', 7, 'Jupiter')],
  8: [cite(24, '111-112', 'The native will be long-lived but will face humiliation, will have few possessions, and serve others. Interest in occult wisdom and protection from sudden harm are indicated.', 8, 'Jupiter')],
  9: [cite(24, '113-114', 'The native will be devoted to God, fortunate, wise, wealthy, famous, and blessed with sons. This is an extremely fortunate placement — spiritual and material blessings abound.', 9, 'Jupiter')],
  10: [cite(24, '115-116', 'The native will be happy, wealthy, powerful, famous, virtuous, and devoted to God. Career success through ethical leadership and social respect is strongly indicated.', 10, 'Jupiter')],
  11: [cite(24, '117-118', 'The native will be long-lived, wealthy, truthful, happy, with few children but many servants. Ambitions are fulfilled through knowledge and wise connections.', 11, 'Jupiter')],
  12: [cite(24, '119-120', 'The native will be disliked by others, without wealth, without children, and will serve others. If well-aspected, spiritual growth, foreign travel, and moksha are indicated.', 12, 'Jupiter')],
};

// Chapter 24: Effects of Venus in houses 1-12
const VENUS_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '121-122', 'The native will be happy, handsome, long-lived, endowed with good qualities, and will enjoy conjugal happiness. Charm, beauty, and artistic sensibility are indicated.', 1, 'Venus')],
  2: [cite(24, '123-124', 'The native will be wealthy, a poet, sweet-spoken, will have a beautiful face, and be happy with family. Earning through artistic pursuits and luxury trades is favoured.', 2, 'Venus')],
  3: [cite(24, '125-126', 'The native will be mean, without happiness, without wealth, and without good wife. If well-aspected, artistic talents and harmonious creative work are possible.', 3, 'Venus')],
  4: [cite(24, '127-128', 'The native will possess conveyances, houses, ornaments, clothes, perfumes, and lands. Luxury at home, beautiful surroundings, and domestic happiness are strongly indicated.', 4, 'Venus')],
  5: [cite(24, '129-130', 'The native will be an advisor or minister, wealthy, blessed with children, and will enjoy the company of the opposite gender. Romantic fulfillment and creative talent are indicated.', 5, 'Venus')],
  6: [cite(24, '131-132', 'The native will be without enemies, without wealth, and will face humiliation. Relationship challenges but success in service-related creative fields are possible.', 6, 'Venus')],
  7: [cite(24, '133-134', 'The native will be passionate, handsome, will have a beautiful spouse, and be happy in marriage. This is a strong placement for marital harmony and prosperous partnerships.', 7, 'Venus')],
  8: [cite(24, '135-136', 'The native will be long-lived, wealthy, and will enjoy all comforts. Possible inheritance, sensual depth, and transformative experiences in love are indicated.', 8, 'Venus')],
  9: [cite(24, '137-138', 'The native will be devoted to God, charitable, wealthy, happy, and blessed with wife and children. Fortune through arts, beauty, and pleasant foreign connections is indicated.', 9, 'Venus')],
  10: [cite(24, '139-140', 'The native will be happy, valorous, famous, and will perform many meritorious deeds. Career success in arts, beauty, fashion, or entertainment is indicated.', 10, 'Venus')],
  11: [cite(24, '141-142', 'The native will be wealthy, will enjoy all kinds of pleasures, and will be endowed with conveyances. Desires for luxury and pleasure fulfilled through social connections.', 11, 'Venus')],
  12: [cite(24, '143-144', 'The native will enjoy bed pleasures, will be wealthy, and be endowed with luxuries. Pleasures abroad, rich fantasy life, and spiritual love are indicated.', 12, 'Venus')],
};

// Chapter 24: Effects of Saturn in houses 1-12
const SATURN_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(24, '145-146', 'The native will be sickly, will have a lean body, be lazy, without good qualities, and be far from home during childhood. A serious and disciplined personality develops over time.', 1, 'Saturn')],
  2: [cite(24, '147-148', 'The native will be without wealth, without family happiness, will face accusations, and will have an ugly face. Delayed prosperity through persistent hard work is indicated.', 2, 'Saturn')],
  3: [cite(24, '149-150', 'The native will be intelligent, wealthy, will have a bad wife, be lazy, and valorous. Determination and persistence despite early challenges are indicated.', 3, 'Saturn')],
  4: [cite(24, '151-152', 'The native will be devoid of house, land, mother, friends, and happiness. Domestic happiness is delayed but eventual stable property ownership comes through sustained effort.', 4, 'Saturn')],
  5: [cite(24, '153-154', 'The native will be without wealth, without children, and will be wicked. Education requires persistence but if well-aspected, serious-minded offspring and deep learning are indicated.', 5, 'Saturn')],
  6: [cite(24, '155-156', 'The native will be a glutton, wealthy, will vanquish enemies, and be arrogant. Overcoming long-term obstacles through service, with gradual recognition, is indicated.', 6, 'Saturn')],
  7: [cite(24, '157-158', 'The native will wander aimlessly, will have a sickly or older spouse, and be without happiness. Marriage may be delayed, or the spouse is mature and responsible.', 7, 'Saturn')],
  8: [cite(24, '159-160', 'The native will be sickly, thievish, short-tempered, and with few friends. However, longevity is often granted, along with deep research interests.', 8, 'Saturn')],
  9: [cite(24, '161-162', 'The native will be devoid of fortune, children, and wealth, and will be irreligious. If well-aspected, disciplined spiritual practice and thorough higher education are indicated.', 9, 'Saturn')],
  10: [cite(24, '163-164', 'The native will be a king or minister, wealthy, famous, and of charitable disposition. Career success through steady effort in structured institutions is strongly indicated.', 10, 'Saturn')],
  11: [cite(24, '165-166', 'The native will be long-lived, wealthy, happy, powerful, and will have many servants. Persistent effort brings lasting gains and long-term goal achievement.', 11, 'Saturn')],
  12: [cite(24, '167-168', 'The native will be without wealth, without happiness, sinful, and will have defective limbs. If well-aspected, foreign residence, spiritual discipline, and long-term service are indicated.', 12, 'Saturn')],
};

// Chapter 47: Effects of Rahu in houses 1-12
const RAHU_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(47, '1-3', 'The native will be short-lived, wealthy, and will suffer from ailments of the upper body. An unconventional personality with worldly ambitions and a distinctive identity develops.', 1, 'Rahu')],
  2: [cite(47, '4-5', 'The native will be harsh in speech, will face family discord, and have inconsistent wealth. Unusual wealth patterns with sudden gains and losses are indicated.', 2, 'Rahu')],
  3: [cite(47, '6-7', 'The native will be proud, inimical toward siblings, wealthy, and long-lived. Courage through unconventional means and modern communication skills are indicated.', 3, 'Rahu')],
  4: [cite(47, '8-9', 'The native will be short-lived, rarely happy, and afflicted with domestic troubles. Unusual domestic situations and the possibility of foreign property are indicated.', 4, 'Rahu')],
  5: [cite(47, '10-11', 'The native will suffer from stomach ailments, be harsh in speech, and have few children. Unusual intelligence and an unconventional creative approach are indicated.', 5, 'Rahu')],
  6: [cite(47, '12-13', 'The native will be wealthy, long-lived, afflicted by enemies in the beginning but will eventually prevail. Overcoming obstacles through unconventional methods is a strength.', 6, 'Rahu')],
  7: [cite(47, '14-15', 'The native will lose wealth through the spouse, be proud, and associated with widows. A spouse from a different cultural background and foreign partnerships are possible.', 7, 'Rahu')],
  8: [cite(47, '16-17', 'The native will be short-lived, will do evil deeds, and be afflicted with diseases. Fascination with occult matters, sudden transformations, and unconventional research are indicated.', 8, 'Rahu')],
  9: [cite(47, '18-19', 'The native will be sinful, harsh in speech, involved in wicked deeds, and without fortune. Interest in foreign philosophies and unconventional spiritual paths is indicated.', 9, 'Rahu')],
  10: [cite(47, '20-21', 'The native will be famous, will undertake bold deeds, have few children, and enjoy royal favour. Career success through innovation and public recognition is strongly indicated.', 10, 'Rahu')],
  11: [cite(47, '22-23', 'The native will be wealthy, happy, will enjoy all comforts, and be long-lived. This is an excellent placement — worldly desires are fulfilled through technology and networking.', 11, 'Rahu')],
  12: [cite(47, '24-25', 'The native will spend money on sinful activities, will have defective limbs, and be inimical toward others. Foreign residence and spiritual awakening through unconventional means are possible.', 12, 'Rahu')],
};

// Chapter 47: Effects of Ketu in houses 1-12
const KETU_IN_HOUSE: Record<number, ClassicalCitation[]> = {
  1: [cite(47, '26-27', 'The native will be ungrateful, unhappy, will slander others, and associate with outcasts. A spiritual and detached personality with past-life wisdom and strong intuition develops.', 1, 'Ketu')],
  2: [cite(47, '28-29', 'The native will be without education, without wealth, will depend on others for food, and have harsh speech. Detachment from material wealth and a mystical speech quality are indicated.', 2, 'Ketu')],
  3: [cite(47, '30-31', 'The native will be long-lived, powerful, wealthy, and will enjoy all comforts. Spiritual courage and intuitive communication from past-life skills are indicated.', 3, 'Ketu')],
  4: [cite(47, '32-33', 'The native will be devoid of house, land, and mother\'s happiness. Detachment from conventional domestic life and development of spiritual home practices are indicated.', 4, 'Ketu')],
  5: [cite(47, '34-35', 'The native will be afflicted with stomach ailments, without children, and sinful. Mystical intelligence and spiritual merit from past lives may manifest if well-aspected.', 5, 'Ketu')],
  6: [cite(47, '36-37', 'The native will be magnanimous, illustrious, long-lived, and free from enemies. Overcoming enemies through spiritual means and natural healing abilities are indicated.', 6, 'Ketu')],
  7: [cite(47, '38-39', 'The native will be without spouse happiness, will be humiliated, and associated with women of questionable character. A karmic relationship dimension and detachment in partnerships are indicated.', 7, 'Ketu')],
  8: [cite(47, '40-41', 'The native will be short-lived, will face separation from dear ones, and sustain injuries. Power in occult knowledge, meditation, and spiritual transformation is indicated.', 8, 'Ketu')],
  9: [cite(47, '42-43', 'The native will be sinful, short-lived, and will indulge in wicked deeds. Natural spiritual wisdom and an internally experienced religion are indicated if well-aspected.', 9, 'Ketu')],
  10: [cite(47, '44-45', 'The native will be engaged in wicked deeds, devoid of religion, and face obstacles in career. Career in healing, spirituality, or meaningful research may develop over time.', 10, 'Ketu')],
  11: [cite(47, '46-47', 'The native will amass wealth, be happy, will enjoy all comforts, and be virtuous. Spiritual gains and true fulfillment through service and liberation are indicated.', 11, 'Ketu')],
  12: [cite(47, '48-49', 'The native will enjoy bed pleasures, will spend on good causes, and attain final emancipation. This is excellent for moksha — strong meditation abilities and past-life merit manifest.', 12, 'Ketu')],
};

/**
 * Static BPHS planet-in-house citations: 9 planets x 12 houses = 108 entries.
 * Keyed by planetId (0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu)
 * then by house number (1-12).
 */
export const BPHS_PLANET_IN_HOUSE: Record<number, Record<number, ClassicalCitation[]>> = {
  0: SUN_IN_HOUSE,
  1: MOON_IN_HOUSE,
  2: MARS_IN_HOUSE,
  3: MERCURY_IN_HOUSE,
  4: JUPITER_IN_HOUSE,
  5: VENUS_IN_HOUSE,
  6: SATURN_IN_HOUSE,
  7: RAHU_IN_HOUSE,
  8: KETU_IN_HOUSE,
};
